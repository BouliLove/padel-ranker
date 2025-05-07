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
    const isTeam1Winner = winner === "team1";

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

    // Calculate team averages
    const team1Avg = (team1Players[0].elo + team1Players[1].elo) / 2;
    const team2Avg = (team2Players[0].elo + team2Players[1].elo) / 2;
    
    // Store original team average ELOs for consistent calculation across all sets
    const originalTeam1Avg = team1Avg;
    const originalTeam2Avg = team2Avg;
    
    // Calculate player contribution weights - with fair bounds
    const calculateContributionWeights = (
      teamPlayers: any[], 
      teamAvg: number
    ): number[] => {
      // First calculate raw contribution factors
      const rawWeights = teamPlayers.map(p => p.elo / teamAvg);
      
      // Ensure weights are within reasonable bounds (0.7 to 1.3)
      // These bounds prevent extreme weights while still allowing for contribution differences
      const boundedWeights = rawWeights.map((w: number) => Math.max(0.7, Math.min(1.3, w)));
      
      // Normalize to ensure weights sum to 2.0 (for 2 players)
      const sum = boundedWeights.reduce((acc: number, w: number) => acc + w, 0);
      return boundedWeights.map((w: number) => (w / sum) * 2);
    };
    
    // Calculate weights based on team and outcome
    const team1Weights = calculateContributionWeights(team1Players, team1Avg);
    const team2Weights = calculateContributionWeights(team2Players, team2Avg);
    
    // Initialize raw ELO changes
    const rawEloChanges: { [key: string]: number } = {
      [team1Players[0].id]: 0,
      [team1Players[1].id]: 0,
      [team2Players[0].id]: 0,
      [team2Players[1].id]: 0,
    };

    // Match winner bonus
    const matchWinnerBonus = 8;

    // Calculate raw ELO changes for each set
    for (const set of sets) {
      const margin = Math.abs(set.team1 - set.team2);
      const team1Won = set.team1 > set.team2;
      const team2Won = set.team2 > set.team1;
      if (!team1Won && !team2Won) continue;

      // Use progressive margin impact with diminishing returns
      const marginFactor = getProgressiveMarginFactor(margin);

      // Calculate raw changes for team 1
      for (let i = 0; i < team1Players.length; i++) {
        const player = team1Players[i];
        const weight = team1Weights[i];
        const delta = calculateEloChange(player.elo, originalTeam2Avg, team1Won, marginFactor);
        rawEloChanges[player.id] += delta * weight;
      }

      // Calculate raw changes for team 2
      for (let i = 0; i < team2Players.length; i++) {
        const player = team2Players[i];
        const weight = team2Weights[i];
        const delta = calculateEloChange(player.elo, originalTeam1Avg, team2Won, marginFactor);
        rawEloChanges[player.id] += delta * weight;
      }
    }

    // Add winner bonus to raw ELO changes
    if (winner === "team1") {
      for (let i = 0; i < team1Players.length; i++) {
        const player = team1Players[i];
        const weight = team1Weights[i];
        rawEloChanges[player.id] += matchWinnerBonus * weight;
      }
    } else {
      for (let i = 0; i < team2Players.length; i++) {
        const player = team2Players[i];
        const weight = team2Weights[i];
        rawEloChanges[player.id] += matchWinnerBonus * weight;
      }
    }

    // Calculate total team ELO changes
    const team1TotalElo = team1.reduce((sum, id) => sum + rawEloChanges[id], 0);
    const team2TotalElo = team2.reduce((sum, id) => sum + rawEloChanges[id], 0);
    
    // Ensure zero-sum (one team's gain equals the other's loss)
    const totalEloChange = team1TotalElo + team2TotalElo;
    
    // Create the final ELO changes object with balanced, rounded values
    const eloChanges: { [key: string]: number } = {};
    
    // Normalize to ensure zero-sum
    for (const id of [...team1]) {
      // For team 1, adjust proportionally to ensure team total is correct
      const adjustmentFactor = (team1TotalElo !== 0) ? -team2TotalElo / team1TotalElo : 1;
      eloChanges[id] = Math.round(rawEloChanges[id] * adjustmentFactor);
    }
    
    for (const id of [...team2]) {
      // For team 2, round but preserve original sign
      eloChanges[id] = Math.round(rawEloChanges[id]);
    }

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
    // Count sets won/lost per player
    const setResults: { [id: string]: { won: number; lost: number } } = {};
    players.forEach(p => setResults[p.id] = { won: 0, lost: 0 });

    for (const set of sets) {
      const team1Won = set.team1 > set.team2;
      const team2Won = set.team2 > set.team1;
      if (!team1Won && !team2Won) continue;

      for (const p of team1Players) {
        if (team1Won) setResults[p.id].won++;
        else setResults[p.id].lost++;
      }

      for (const p of team2Players) {
        if (team2Won) setResults[p.id].won++;
        else setResults[p.id].lost++;
      }
    }

    // Update all players with Elo + set stats
    const updatePromises = players.map(player =>
      supabase
        .from("players")
        .update({
          elo: player.elo + eloChanges[player.id],
          matches: player.matches + 1,
          wins: player.wins + (winner === "team1" && team1.includes(player.id) || winner === "team2" && team2.includes(player.id) ? 1 : 0),
          sets_won: player.sets_won + setResults[player.id].won,
          sets_lost: player.sets_lost + setResults[player.id].lost,
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

// Calculate Elo change using standard formula, but with margin factor provided separately
function calculateEloChange(
  playerElo: number,
  opponentTeamElo: number,
  setWon: boolean,
  marginFactor: number
): number {
  const K = 16;
  const expected = 1 / (1 + Math.pow(10, (opponentTeamElo - playerElo) / 400));
  const base = K * ((setWon ? 1 : 0) - expected);
  return base * marginFactor;
}

// Progressive margin impact with diminishing returns
function getProgressiveMarginFactor(margin: number): number {
  // Square root function provides diminishing returns
  // First point has highest impact, subsequent points have decreasing additional impact
  return 1 + 0.25 * Math.sqrt(margin);
  
  // This gives more balanced factors:
  // margin 1: 1.25x  (25% bonus)
  // margin 2: 1.35x  (35% bonus)
  // margin 3: 1.43x  (43% bonus)
  // margin 4: 1.50x  (50% bonus) 
  // margin 9: 1.75x  (75% bonus)
}