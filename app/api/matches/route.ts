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

    const team1Players = team1.map(id => players.find(p => p.id === id)!);
    const team2Players = team2.map(id => players.find(p => p.id === id)!);

    const eloChanges: { [playerId: string]: number } = {
      [team1Players[0].id]: 0,
      [team1Players[1].id]: 0,
      [team2Players[0].id]: 0,
      [team2Players[1].id]: 0,
    };

    for (const set of sets) {
      const margin = Math.abs(set.team1 - set.team2);
      const team1Won = set.team1 > set.team2;
      const team2Won = set.team2 > set.team1;

      if (!team1Won && !team2Won) continue;

      const team1Avg = (team1Players[0].elo + team1Players[1].elo) / 2;
      const team2Avg = (team2Players[0].elo + team2Players[1].elo) / 2;

      // Team 1
      for (const [i, player] of team1Players.entries()) {
        const teammate = team1Players[1 - i];
        const delta = calculateEloChangeWithTeammate(player.elo, teammate.elo, team2Avg, team1Won, margin);
        eloChanges[player.id] += delta;
      }

      // Team 2
      for (const [i, player] of team2Players.entries()) {
        const teammate = team2Players[1 - i];
        const delta = calculateEloChangeWithTeammate(player.elo, teammate.elo, team1Avg, team2Won, margin);
        eloChanges[player.id] += delta;
      }
    }

    // Cap max Elo change per player per match
    Object.keys(eloChanges).forEach(id => {
      eloChanges[id] = Math.max(-40, Math.min(40, eloChanges[id]));
    });

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
      return NextResponse.json({ warning: "ELO update failed", matchId }, { status: 207 });
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
      return NextResponse.json({ warning: "Partial stats update", matchId }, { status: 207 });
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

// 🎯 Elo per player per set with teammate + margin + opponent scaling
function calculateEloChangeWithTeammate(
  playerElo: number,
  teammateElo: number,
  opponentTeamElo: number,
  setWon: boolean,
  margin: number
): number {
  const K = 16;
  const effectiveElo = playerElo * 0.75 + teammateElo * 0.25;
  const expected = 1 / (1 + Math.pow(10, (opponentTeamElo - effectiveElo) / 400));
  const base = K * ((setWon ? 1 : 0) - expected);
  const marginFactor = 1 + Math.min(margin, 4) * 0.15;
  return Math.round(base * marginFactor);
}
