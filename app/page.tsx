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
}

interface Match {
  id: string;
  date: string;
  team1: [Player, Player];
  team2: [Player, Player];
  winner: "team1" | "team2";
  eloChanges: {
    [key: string]: number;
  };
}

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [formErrors, setFormErrors] = useState({
    name: false,
    nameDuplicate: false,
  });
  
  const [selectedPlayers, setSelectedPlayers] = useState({
    team1: ["", ""],
    team2: ["", ""]
  });
  
  const [winner, setWinner] = useState<"team1" | "team2" | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [matchHistoryPage, setMatchHistoryPage] = useState(1);

  const fetchPlayers = async () => {
    try {
      const response = await fetch('/api/players', {
        cache: 'no-store'
      });
      
      if (!response.ok) {
        let errorMessage = "Failed to fetch players";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          errorMessage = response.statusText || errorMessage;
        }
        
        console.error(`Error fetching players (${response.status}):`, errorMessage);
        
        if (response.status !== 503 && response.status !== 504) {
          alert(`Unable to load players: ${errorMessage}`);
        }
        
        return [];
      }
      
      const data = await response.json();
      return data as Player[];
    } catch (error) {
      console.error("Network error while fetching players:", error);
      return [];
    }
  };

  const fetchMatches = async () => {
    try {
      const response = await fetch('/api/matches', {
        cache: 'no-store'
      });
      
      if (!response.ok) {
        let errorMessage = "Failed to fetch matches";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          errorMessage = response.statusText || errorMessage;
        }
        
        console.error(`Error fetching matches (${response.status}):`, errorMessage);
        
        if (response.status !== 503 && response.status !== 504) {
          alert(`Unable to load match history: ${errorMessage}`);
        }
        
        return [];
      }
      
      const data = await response.json();
      return data as Match[];
    } catch (error) {
      console.error("Network error while fetching matches:", error);
      return [];
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      try {
        const [playersData, matchesData] = await Promise.all([
          fetchPlayers(),
          fetchMatches()
        ]);
        
        setPlayers(playersData);
        setMatches(matchesData);
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleMatchHistoryPageChange = useCallback((page: number) => {
    setMatchHistoryPage(page);
  }, []);

  const validateForm = () => {
    const errors = {
      name: !newPlayerName.trim(),
      nameDuplicate: false,
    };

    if (!errors.name) {
      const duplicateName = players.find(
        (p) => p.name.toLowerCase() === newPlayerName.trim().toLowerCase()
      );
      errors.nameDuplicate = !!duplicateName;
    }

    setFormErrors(errors);
    return !errors.name && !errors.nameDuplicate;
  };

  const addPlayer = async (
    playerData: Omit<Player, "id" | "matches" | "wins" | "elo">
  ) => {
    try {
      const name = playerData.name.trim();
  
      const response = await fetch('/api/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        let errorMessage = "Failed to add player";
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          errorMessage = response.statusText || errorMessage;
        }
        
        console.error(`Error adding player (${response.status}):`, errorMessage);
        
        if (response.status === 400) {
          alert(`Invalid player data: ${errorMessage}`);
        } else if (response.status === 409) { 
          alert(`This player already exists: ${errorMessage}`);
        } else {
          alert(`Unable to add player: ${errorMessage}`);
        }
        
        return null;
      }

      const data = await response.json();
      const updatedPlayers = await fetchPlayers();
      setPlayers(updatedPlayers);

      return data;
    } catch (error) {
      console.error("Network error while adding player:", error);
      alert('Unable to add player due to a network error. Please check your connection and try again.');
      return null;
    }
  };

  const handleAddPlayer = async () => {
    if (!validateForm()) return;

    try {
      const result = await addPlayer({
        name: newPlayerName.trim(),
      });

      if (result) {
        setNewPlayerName("");
        setShowAddPlayer(false);
      } else {
        alert("Failed to add player. Check console for details.");
      }
    } catch (error) {
      console.error("Error in handleAddPlayer:", error);
      alert("Failed to add player. Check console for details.");
    }
  };

  const handlePlayerSelect = (team: 'team1' | 'team2', index: 0 | 1, playerId: string) => {
    setSelectedPlayers(prev => {
      const newTeam = [...prev[team]];
      newTeam[index] = playerId;
      return {
        ...prev,
        [team]: newTeam
      };
    });
  };

  const recordMatch = async () => {
    try {
      const team1Ids = selectedPlayers.team1;
      const team2Ids = selectedPlayers.team2;
  
      if (team1Ids.includes("") || team2Ids.includes("") || !winner) {
        alert("Please select all players and a winner");
        return;
      }
      
      const allPlayerIds = [...team1Ids, ...team2Ids];
      const uniquePlayerIds = new Set(allPlayerIds);
      
      if (uniquePlayerIds.size !== 4) {
        alert("A player cannot be on both teams. Please select different players.");
        return;
      }
      
      setLoading(true);
      
      try {
        const response = await fetch('/api/matches', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            team1: team1Ids,
            team2: team2Ids,
            winner: winner,
          }),
        });
        
        if (!response.ok) {
          let errorMessage = "Failed to record match";
          let warningMessage = null;
          let isPartialSuccess = false;
          
          try {
            const responseData = await response.json();
            
            if (response.status === 207 && responseData.warning) {
              warningMessage = responseData.warning;
              isPartialSuccess = true;
            } else if (responseData.error) {
              errorMessage = responseData.error;
            }
          } catch (e) {
            errorMessage = response.statusText || errorMessage;
          }
          
          if (isPartialSuccess) {
            console.warn(`Partial success: ${warningMessage}`);
            alert(`Match recorded with warning: ${warningMessage}`);
          } else {
            console.error(`Error recording match (${response.status}):`, errorMessage);
            alert(`Unable to record match: ${errorMessage}`);
            setLoading(false);
            return;
          }
        } else {
          console.log("Match recorded successfully!");
        }
        
        const [updatedPlayers, updatedMatches] = await Promise.all([
          fetchPlayers(),
          fetchMatches()
        ]);
        
        setPlayers(updatedPlayers);
        setMatches(updatedMatches);
        
        setSelectedPlayers({ team1: ["", ""], team2: ["", ""] });
        setWinner(null);
      } catch (apiError) {
        console.error("API error while recording match:", apiError);
        alert('Unable to record match. Please try again later.');
      } finally {
        setLoading(false);
      }
    } catch (error) {
      console.error("Unexpected error recording match:", error);
      alert('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Padel Rankings</h1>
      
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-lg">
            <p className="text-lg">Loading...</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="order-first lg:order-none card">
          <h2 className="text-2xl font-semibold mb-6">Record Match</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Team 1</label>
                <div className="mb-2">
                  <SearchableSelect
                    id="team1-player1"
                    options={players}
                    value={selectedPlayers.team1[0]}
                    onChange={(value) => handlePlayerSelect('team1', 0, value)}
                    placeholder="Select Player 1"
                  />
                </div>
                <div className="mb-2">
                  <SearchableSelect
                    id="team1-player2"
                    options={players}
                    value={selectedPlayers.team1[1]}
                    onChange={(value) => handlePlayerSelect('team1', 1, value)}
                    placeholder="Select Player 2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Team 2</label>
                <div className="mb-2">
                  <SearchableSelect
                    id="team2-player1"
                    options={players}
                    value={selectedPlayers.team2[0]}
                    onChange={(value) => handlePlayerSelect('team2', 0, value)}
                    placeholder="Select Player 1"
                  />
                </div>
                <div className="mb-2">
                  <SearchableSelect
                    id="team2-player2"
                    options={players}
                    value={selectedPlayers.team2[1]}
                    onChange={(value) => handlePlayerSelect('team2', 1, value)}
                    placeholder="Select Player 2"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                className={clsx(
                  "btn",
                  winner === "team1" ? "btn-win-selected" : "btn-win"
                )}
                onClick={() => setWinner("team1")}
                disabled={
                  selectedPlayers.team1.includes("") ||
                  selectedPlayers.team2.includes("")
                }
              >
                Team 1 Wins
              </button>
              <button
                className={clsx(
                  "btn",
                  winner === "team2" ? "btn-win-selected" : "btn-win"
                )}
                onClick={() => setWinner("team2")}
                disabled={
                  selectedPlayers.team1.includes("") ||
                  selectedPlayers.team2.includes("")
                }
              >
                Team 2 Wins
              </button>
            </div>

            <button
              className="btn btn-primary w-full"
              onClick={recordMatch}
              disabled={
                selectedPlayers.team1.includes("") ||
                selectedPlayers.team2.includes("") ||
                !winner
              }
            >
              Record Match
            </button>
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <FaTrophy className="text-yellow-500" />
              Leaderboard
            </h2>
            <button
              onClick={() => setShowAddPlayer(true)}
              className="btn-secondary btn flex items-center gap-2"
            >
              <FaPlus /> Add Player
            </button>
          </div>

          <Leaderboard
            players={players}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>

        <div className="lg:col-span-2 card">
          <MatchHistory
            matches={matches}
            currentPage={matchHistoryPage}
            onPageChange={handleMatchHistoryPageChange}
          />
        </div>
      </div>

      {showAddPlayer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="card w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4">Add New Player</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={clsx(
                  "input w-full",
                  (formErrors.name || formErrors.nameDuplicate) &&
                    "border-red-500"
                )}
                placeholder="Player Name"
                value={newPlayerName}
                onChange={(e) => {
                  setNewPlayerName(e.target.value);
                  setFormErrors((prev) => ({
                    ...prev,
                    name: false,
                    nameDuplicate: false,
                  }));
                }}
              />
              {formErrors.name && (
                <p className="text-red-500 text-sm mt-1">Name is required</p>
              )}
              {formErrors.nameDuplicate && (
                <p className="text-red-500 text-sm mt-1">
                  Name already taken, please change it
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button className="btn w-full" onClick={handleAddPlayer}>
                Add Player
              </button>
              <button
                className="btn-secondary btn w-full"
                onClick={() => {
                  setShowAddPlayer(false);
                  setNewPlayerName("");
                  setFormErrors({
                    name: false,
                    nameDuplicate: false,
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}