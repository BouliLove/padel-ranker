import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    const { data: matchesData, error: matchesError } = await supabase
      .from("matches")
      .select(`
        id,
        date,
        winner,
        score,
        team1_player1(id, name, elo, matches, wins),
        team1_player2(id, name, elo, matches, wins),
        team2_player1(id, name, elo, matches, wins),
        team2_player2(id, name, elo, matches, wins)
      `)
      .order("date", { ascending: false });

    if (matchesError) {
      console.error("Database error fetching matches:", matchesError);
      return NextResponse.json({ error: "Unable to retrieve match data" }, { status: 500 });
    }

    if (!matchesData?.length) return NextResponse.json([]);

    const { data: eloChangesData, error: eloChangesError } = await supabase
      .from("elo_changes")
      .select("*")
      .in("match_id", matchesData.map(m => m.id));

    if (eloChangesError) {
      console.error("Database error fetching ELO changes:", eloChangesError);
      return NextResponse.json({ error: "Unable to retrieve ELO data" }, { status: 500 });
    }

    const formattedMatches = matchesData.map(match => ({
      id: match.id,
      date: match.date,
      team1: [match.team1_player1, match.team1_player2],
      team2: [match.team2_player1, match.team2_player2],
      winner: match.winner,
      score: match.score,
      eloChanges: eloChangesData
        ?.filter(change => change.match_id === match.id)
        ?.reduce((acc, change) => ({
          ...acc,
          [change.player_id]: change.elo_change
        }), {}) || {}
    }));

    return NextResponse.json(formattedMatches);
  } catch (error) {
    console.error("Unexpected error in GET /api/matches:", error);
    return NextResponse.json({ error: "Unable to retrieve matches" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received match POST body:", body);

    const { team1, team2, sets } = body;

    if (!Array.isArray(team1) || !Array.isArray(team2) || team1.length !== 2 || team2.length !== 2) {
      return NextResponse.json({ error: "Invalid team structure" }, { status: 400 });
    }

    if (!Array.isArray(sets) || sets.length === 0 || sets.some(s => typeof s.team1 !== "number" || typeof s.team2 !== "number")) {
      return NextResponse.json({ error: "Invalid sets format" }, { status: 400 });
    }

    // Build score string and determine winner
    const score = sets.map(s => `${s.team1}-${s.team2}`).join(", ");
    let team1Wins = 0;
    let team2Wins = 0;

    for (const set of sets) {
      if (set.team1 > set.team2) team1Wins++;
      else if (set.team2 > set.team1) team2Wins++;
    }

    if (team1Wins === team2Wins) {
      return NextResponse.json({ error: "Draws are not allowed" }, { status: 400 });
    }

    const winner = team1Wins > team2Wins ? "team1" : "team2";

    // Fetch players
    const { data: players, error: playersError } = await supabase
      .from("players")
      .select("*")
      .in("id", [...team1, ...team2]);

    if (playersError || players?.length !== 4) {
      console.error("Player fetch error:", playersError);
      return NextResponse.json({ error: "Invalid player selection" }, { status: 400 });
    }

    // Map player objects
    const team1Players = team1.map(id => players.find(p => p.id === id));
    const team2Players = team2.map(id => players.find(p => p.id === id));

    const team1Avg = (team1Players[0].elo + team1Players[1].elo) / 2;
    const team2Avg = (team2Players[0].elo + team2Players[1].elo) / 2;

    const eloChange = calculateEloChange(
      winner === "team1" ? team1Avg : team2Avg,
      winner === "team1" ? team2Avg : team1Avg
    );

    const eloChanges = Object.fromEntries([
      ...team1Players.map(p => [p.id, winner === "team1" ? eloChange : -eloChange]),
      ...team2Players.map(p => [p.id, winner === "team2" ? eloChange : -eloChange])
    ]);

    // Insert match
    const { data: matchData, error: matchError } = await supabase
      .from("matches")
      .insert([{
        date: new Date().toISOString(),
        winner,
        score,
        team1_player1: team1Players[0].id,
        team1_player2: team1Players[1].id,
        team2_player1: team2Players[0].id,
        team2_player2: team2Players[1].id,
      }])
      .select();

    if (matchError || !matchData?.length) {
      console.error("Match insert error:", matchError);
      return NextResponse.json({ error: "Failed to record match" }, { status: 500 });
    }

    const matchId = matchData[0].id;

    // Insert elo_changes
    const eloChangeRecords = Object.entries(eloChanges).map(([playerId, change]) => ({
      match_id: matchId,
      player_id: playerId,
      elo_change: change
    }));

    const { error: eloChangeError } = await supabase
      .from("elo_changes")
      .insert(eloChangeRecords);

    if (eloChangeError) {
      console.error("ELO changes insert error:", eloChangeError);
      return NextResponse.json(
        { warning: "Match recorded but ELO update failed", matchId },
        { status: 207 }
      );
    }

    // Update players
    const updatePromises = players.map(player =>
      supabase
        .from("players")
        .update({
          elo: player.elo + eloChanges[player.id],
          matches: player.matches + 1,
          wins: player.wins + (eloChanges[player.id] > 0 ? 1 : 0)
        })
        .eq("id", player.id)
    );

    const updateResults = await Promise.all(updatePromises);
    const updateErrors = updateResults.filter(r => r.error);

    if (updateErrors.length > 0) {
      console.error("Player update errors:", updateErrors);
      return NextResponse.json(
        { warning: "Match and ELO saved but player updates failed", matchId },
        { status: 207 }
      );
    }

    return NextResponse.json({
      id: matchId,
      team1: team1Players,
      team2: team2Players,
      winner,
      score,
      eloChanges
    });

  } catch (error: any) {
    console.error("Unexpected error in POST /api/matches:", error);
    if (error.name === 'SyntaxError') {
      return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
    }
    return NextResponse.json({ error: "Unable to process match" }, { status: 500 });
  }
}

function calculateEloChange(winnerElo: number, loserElo: number): number {
  const K = 32;
  const expected = 1 / (1 + Math.pow(10, (loserElo - winnerElo) / 400));
  return Math.round(K * (1 - expected));
}
