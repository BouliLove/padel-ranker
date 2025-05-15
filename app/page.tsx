"use client";

import { useState, useEffect, useCallback } from "react";
import { FaTrophy, FaPlus } from "react-icons/fa";
import clsx from "clsx";
import Leaderboard from "./components/Leaderboard";
import MatchHistory from "./components/MatchHistory";
import SearchableSelect from "./components/SearchableSelect";

interface Player {
  id: string;
  name: string;
  elo: number;
  matches: number;
  wins: number;
  sets_won: number;
  sets_lost: number;
}

interface Match {
  id: string;
  date: string;
  team1: [Player, Player];
  team2: [Player, Player];
  score: string;
  winner: "team1" | "team2";
  eloChanges: {
    [key: string]: number;
  };
}

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState({
    team1: ["", ""],
    team2: ["", ""],
  });

  const [currentSet, setCurrentSet] = useState({ team1: "", team2: "" });
  const [sets, setSets] = useState<{ team1: number; team2: number }[]>([]);

  const [keepPlayers, setKeepPlayers] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [formErrors, setFormErrors] = useState({
    name: false,
    nameDuplicate: false,
  });
  
  // Add state for pagination
  const [leaderboardPage, setLeaderboardPage] = useState(1);
  const [matchHistoryPage, setMatchHistoryPage] = useState(1);

  const fetchPlayers = async () => {
    try {
      const res = await fetch("/api/players", { cache: "no-store" });
      if (!res.ok) return [];
      return (await res.json()) as Player[];
    } catch (e) {
      console.error("Error fetching players:", e);
      return [];
    }
  };

  const fetchMatches = async () => {
    try {
      const res = await fetch("/api/matches", { cache: "no-store" });
      if (!res.ok) return [];
      return (await res.json()) as Match[];
    } catch (e) {
      console.error("Error fetching matches:", e);
      return [];
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [playersData, matchesData] = await Promise.all([
        fetchPlayers(),
        fetchMatches(),
      ]);
      setPlayers(playersData);
      setMatches(matchesData);
      setLoading(false);
    };

    loadData();
  }, []);

  // Filter out players with no matches and remove the NPC player
  const activePlayersOnly = players.filter(player => 
  player.matches > 0 && player.name !== "NPC"
  );

  const handlePlayerSelect = (team: "team1" | "team2", index: 0 | 1, playerId: string) => {
    setSelectedPlayers((prev) => {
      const newTeam = [...prev[team]];
      newTeam[index] = playerId;
      return { ...prev, [team]: newTeam };
    });
  };

  const addSet = () => {
    const team1 = parseInt(currentSet.team1);
    const team2 = parseInt(currentSet.team2);

    if (isNaN(team1) || isNaN(team2)) {
      alert("Please enter valid scores for both teams.");
      return;
    }

    setSets((prev) => [...prev, { team1, team2 }]);
    setCurrentSet({ team1: "", team2: "" });
  };

  const recordMatch = async () => {
    const team1 = selectedPlayers.team1;
    const team2 = selectedPlayers.team2;

    if (team1.includes("") || team2.includes("")) {
      alert("Please select all players");
      return;
    }

    if (sets.length === 0) {
      alert("Please add at least one set");
      return;
    }

    const allIds = [...team1, ...team2];
    const unique = new Set(allIds);
    if (unique.size < 4) {
      alert("A player cannot play on both teams.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          team1,
          team2,
          sets,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        alert(`Match error: ${err.error || "Unknown error"}`);
        return;
      }

      const [updatedPlayers, updatedMatches] = await Promise.all([
        fetchPlayers(),
        fetchMatches(),
      ]);

      setPlayers(updatedPlayers);
      setMatches(updatedMatches);
      setSets([]);
      setCurrentSet({ team1: "", team2: "" });

      if (!keepPlayers) {
        setSelectedPlayers({ team1: ["", ""], team2: ["", ""] });
      }
    } catch (e) {
      alert("Failed to record match");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {
      name: !newPlayerName.trim(),
      nameDuplicate: players.some(
        (p) => p.name.toLowerCase() === newPlayerName.trim().toLowerCase()
      ),
    };
    setFormErrors(errors);
    return !errors.name && !errors.nameDuplicate;
  };

  const addPlayer = async () => {
    if (!validateForm()) return;
    try {
      const res = await fetch("/api/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newPlayerName.trim() }),
      });
      if (!res.ok) throw new Error("Failed to add player");
      const data = await res.json();
      setNewPlayerName("");
      setShowAddPlayer(false);
      setPlayers(await fetchPlayers());
    } catch (e) {
      alert("Could not add player.");
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Padel Rankings</h1>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-md shadow-lg">
            <p className="text-lg">Loading...</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="order-first lg:order-none card">
          <h2 className="text-2xl font-semibold mb-4">Record Match</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Team 1</label>
              <SearchableSelect
                id="team1-player1"
                options={players}
                value={selectedPlayers.team1[0]}
                onChange={(val) => handlePlayerSelect("team1", 0, val)}
                placeholder="Select Player 1"
              />
              <SearchableSelect
                id="team1-player2"
                options={players}
                value={selectedPlayers.team1[1]}
                onChange={(val) => handlePlayerSelect("team1", 1, val)}
                placeholder="Select Player 2"
              />
            </div>

            <div>
              <label className="block mb-1">Team 2</label>
              <SearchableSelect
                id="team2-player1"
                options={players}
                value={selectedPlayers.team2[0]}
                onChange={(val) => handlePlayerSelect("team2", 0, val)}
                placeholder="Select Player 1"
              />
              <SearchableSelect
                id="team2-player2"
                options={players}
                value={selectedPlayers.team2[1]}
                onChange={(val) => handlePlayerSelect("team2", 1, val)}
                placeholder="Select Player 2"
              />
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Team 1 score"
                value={currentSet.team1}
                onChange={(e) => setCurrentSet({ ...currentSet, team1: e.target.value })}
                className="w-1/2 p-2 border rounded text-black"
              />
              <input
                type="number"
                placeholder="Team 2 score"
                value={currentSet.team2}
                onChange={(e) => setCurrentSet({ ...currentSet, team2: e.target.value })}
                className="w-1/2 p-2 border rounded text-black"
              />
              <button onClick={addSet} className="btn">Add Set</button>
            </div>

            <div>
              <p className="font-semibold">Sets:</p>
              <ul className="list-disc ml-6 space-y-1">
                {sets.map((set, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span>{set.team1}-{set.team2}</span>
                    <button
                      className="text-red-500 text-sm hover:underline"
                      onClick={() => {
                        setSets(prev => prev.filter((_, i) => i !== idx));
                      }}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>

            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={keepPlayers}
                onChange={(e) => setKeepPlayers(e.target.checked)}
              />
              <label>Keep players after match</label>
            </div>

            <button onClick={recordMatch} className="btn btn-primary w-full">
              Record Match
            </button>
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <FaTrophy className="text-yellow-500" /> Leaderboard
            </h2>
            <button onClick={() => setShowAddPlayer(true)} className="btn-secondary btn flex items-center gap-2">
              <FaPlus /> Add Player
            </button>
          </div>
          <Leaderboard 
            players={activePlayersOnly} 
            currentPage={leaderboardPage} 
            onPageChange={setLeaderboardPage} 
          />
        </div>

        <div className="lg:col-span-2 card">
          <MatchHistory 
            matches={matches} 
            currentPage={matchHistoryPage} 
            onPageChange={setMatchHistoryPage} 
          />
        </div>
      </div>

      {showAddPlayer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="card w-full max-w-md p-4">
            <h2 className="text-2xl font-semibold mb-4">Add New Player</h2>
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => {
                setNewPlayerName(e.target.value);
                setFormErrors({ name: false, nameDuplicate: false });
              }}
              className={clsx("input w-full mb-2", (formErrors.name || formErrors.nameDuplicate) && "border-red-500")}
              placeholder="Player Name"
            />
            {formErrors.name && <p className="text-red-500">Name is required</p>}
            {formErrors.nameDuplicate && <p className="text-red-500">Name already exists</p>}
            <div className="flex gap-2">
              <button onClick={addPlayer} className="btn w-full">Add Player</button>
              <button onClick={() => setShowAddPlayer(false)} className="btn-secondary btn w-full">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}