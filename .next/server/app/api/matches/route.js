/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/matches/route";
exports.ids = ["app/api/matches/route"];
exports.modules = {

/***/ "(rsc)/./app/api/matches/route.ts":
/*!**********************************!*\
  !*** ./app/api/matches/route.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @supabase/supabase-js */ \"(rsc)/./node_modules/@supabase/supabase-js/dist/module/index.js\");\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n\n\nconst supabaseUrl = \"https://rhtltbpshcvibcqiexct.supabase.co\";\nconst supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;\nconst supabase = (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_1__.createClient)(\"https://rhtltbpshcvibcqiexct.supabase.co\", \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJodGx0YnBzaGN2aWJjcWlleGN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNDk1NDYsImV4cCI6MjA2MTkyNTU0Nn0.jFNbuENCE_g5DNhXoh2KkWg1mKu2D0Dyo9wXvFKcSjA\");\nasync function GET() {\n    try {\n        const { data: matchesData, error: matchesError } = await supabase.from(\"matches\").select(`\n        id,\n        date,\n        winner,\n        team1_player1(id, name, elo, matches, wins),\n        team1_player2(id, name, elo, matches, wins),\n        team2_player1(id, name, elo, matches, wins),\n        team2_player2(id, name, elo, matches, wins)\n      `).order(\"date\", {\n            ascending: false\n        });\n        if (matchesError) {\n            console.error(\"Database error fetching matches:\", matchesError);\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Unable to retrieve match data\"\n            }, {\n                status: 500\n            });\n        }\n        if (!matchesData?.length) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json([]);\n        const { data: eloChangesData, error: eloChangesError } = await supabase.from(\"elo_changes\").select(\"*\").in(\"match_id\", matchesData.map((m)=>m.id));\n        if (eloChangesError) {\n            console.error(\"Database error fetching ELO changes:\", eloChangesError);\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Unable to retrieve ELO data\"\n            }, {\n                status: 500\n            });\n        }\n        const formattedMatches = matchesData.map((match)=>({\n                id: match.id,\n                date: match.date,\n                team1: [\n                    match.team1_player1,\n                    match.team1_player2\n                ],\n                team2: [\n                    match.team2_player1,\n                    match.team2_player2\n                ],\n                winner: match.winner,\n                eloChanges: eloChangesData?.filter((change)=>change.match_id === match.id)?.reduce((acc, change)=>({\n                        ...acc,\n                        [change.player_id]: change.elo_change\n                    }), {}) || {}\n            }));\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(formattedMatches);\n    } catch (error) {\n        console.error(\"Unexpected error in GET /api/matches:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Unable to retrieve matches\"\n        }, {\n            status: 500\n        });\n    }\n}\nasync function POST(request) {\n    try {\n        const body = await request.json();\n        const { team1, team2, sets } = body;\n        if (!team1 || !team2 || !sets) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Missing required fields\"\n            }, {\n                status: 400\n            });\n        }\n        if (!Array.isArray(team1) || team1.length !== 2 || !Array.isArray(team2) || team2.length !== 2 || !Array.isArray(sets) || sets.length === 0) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Invalid team or sets structure\"\n            }, {\n                status: 400\n            });\n        }\n        // Build score string and compute winner\n        let score = \"\";\n        let team1Wins = 0;\n        let team2Wins = 0;\n        for (const set of sets){\n            const t1 = parseInt(set.team1);\n            const t2 = parseInt(set.team2);\n            if (isNaN(t1) || isNaN(t2)) {\n                return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                    error: \"Invalid set scores\"\n                }, {\n                    status: 400\n                });\n            }\n            score += `${t1}-${t2}, `;\n            if (t1 > t2) team1Wins++;\n            else if (t2 > t1) team2Wins++;\n        }\n        score = score.trim().replace(/,$/, \"\");\n        if (team1Wins === team2Wins) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Match cannot be a draw\"\n            }, {\n                status: 400\n            });\n        }\n        const winner = team1Wins > team2Wins ? \"team1\" : \"team2\";\n        // Fetch players\n        const { data: players, error: playersError } = await supabase.from(\"players\").select(\"*\").in(\"id\", [\n            ...team1,\n            ...team2\n        ]);\n        if (playersError || players?.length !== 4) {\n            console.error(\"Player fetch error:\", playersError);\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Invalid player selection\"\n            }, {\n                status: 400\n            });\n        }\n        // Calculate ELO changes\n        const team1Players = team1.map((id)=>players.find((p)=>p.id === id));\n        const team2Players = team2.map((id)=>players.find((p)=>p.id === id));\n        const team1Avg = (team1Players[0].elo + team1Players[1].elo) / 2;\n        const team2Avg = (team2Players[0].elo + team2Players[1].elo) / 2;\n        const eloChange = calculateEloChange(winner === \"team1\" ? team1Avg : team2Avg, winner === \"team1\" ? team2Avg : team1Avg);\n        const eloChanges = Object.fromEntries([\n            ...team1Players.map((p)=>[\n                    p.id,\n                    winner === \"team1\" ? eloChange : -eloChange\n                ]),\n            ...team2Players.map((p)=>[\n                    p.id,\n                    winner === \"team2\" ? eloChange : -eloChange\n                ])\n        ]);\n        // Insert match\n        const { data: matchData, error: matchError } = await supabase.from(\"matches\").insert([\n            {\n                date: new Date().toISOString(),\n                winner,\n                score,\n                team1_player1: team1Players[0].id,\n                team1_player2: team1Players[1].id,\n                team2_player1: team2Players[0].id,\n                team2_player2: team2Players[1].id\n            }\n        ]).select();\n        if (matchError || !matchData?.length) {\n            console.error(\"Match insert error:\", matchError);\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Failed to record match\"\n            }, {\n                status: 500\n            });\n        }\n        const matchId = matchData[0].id;\n        // Record ELO changes\n        const eloChangeRecords = Object.entries(eloChanges).map(([playerId, change])=>({\n                match_id: matchId,\n                player_id: playerId,\n                elo_change: change\n            }));\n        const { error: eloChangeError } = await supabase.from(\"elo_changes\").insert(eloChangeRecords);\n        if (eloChangeError) {\n            console.error(\"ELO changes error:\", eloChangeError);\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                warning: \"Match recorded with partial updates\",\n                matchId\n            }, {\n                status: 207\n            });\n        }\n        // Update player stats\n        const updatePromises = players.map((player)=>supabase.from(\"players\").update({\n                elo: player.elo + eloChanges[player.id],\n                matches: player.matches + 1,\n                wins: player.wins + (eloChanges[player.id] > 0 ? 1 : 0)\n            }).eq(\"id\", player.id));\n        const updateResults = await Promise.all(updatePromises);\n        const updateErrors = updateResults.filter((r)=>r.error);\n        if (updateErrors.length > 0) {\n            console.error(\"Player update errors:\", updateErrors);\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                warning: \"Partial stats updates\",\n                matchId\n            }, {\n                status: 207\n            });\n        }\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            id: matchId,\n            team1: team1Players,\n            team2: team2Players,\n            winner,\n            score,\n            eloChanges\n        });\n    } catch (error) {\n        console.error(\"Unexpected error in POST /api/matches:\", error);\n        if (error.name === 'SyntaxError') {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Invalid request format\"\n            }, {\n                status: 400\n            });\n        }\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Unable to process match\"\n        }, {\n            status: 500\n        });\n    }\n}\nfunction calculateEloChange(winnerElo, loserElo) {\n    const K = 32;\n    const expected = 1 / (1 + Math.pow(10, (loserElo - winnerElo) / 400));\n    return Math.round(K * (1 - expected));\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBR0EsU0FBU29ELG1CQUFtQjBCLFNBQWlCLEVBQUVDLFFBQWdCO0lBQzdELE1BQU1DLElBQUk7SUFDVixNQUFNQyxXQUFXLElBQUssS0FBSUMsS0FBS0MsR0FBRyxDQUFDLElBQUksQ0FBQ0osV0FBV0QsU0FBUSxJQUFLLElBQUc7SUFDbkUsT0FBT0ksS0FBS0UsS0FBSyxDQUFDSixJQUFLLEtBQUlDLFFBQU87QUFDcEMiLCJzb3VyY2VzIjpbIi9Vc2Vycy9sdWthbGF6aWMvRGVza3RvcC9wYWRlbC1yYW5raW5ncy1tYWluL2FwcC9hcGkvbWF0Y2hlcy9yb3V0ZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVDbGllbnQgfSBmcm9tICdAc3VwYWJhc2Uvc3VwYWJhc2UtanMnO1xuaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSAnbmV4dC9zZXJ2ZXInO1xuXG5jb25zdCBzdXBhYmFzZVVybCA9IHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX1NVUEFCQVNFX1VSTCE7XG5jb25zdCBzdXBhYmFzZVNlcnZpY2VLZXkgPSBwcm9jZXNzLmVudi5TVVBBQkFTRV9TRVJWSUNFX1JPTEVfS0VZO1xuY29uc3Qgc3VwYWJhc2UgPSBjcmVhdGVDbGllbnQoXG4gIHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX1NVUEFCQVNFX1VSTCEsXG4gIHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX1NVUEFCQVNFX0FOT05fS0VZIVxuKTtcblxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR0VUKCkge1xuICB0cnkge1xuICAgIGNvbnN0IHsgZGF0YTogbWF0Y2hlc0RhdGEsIGVycm9yOiBtYXRjaGVzRXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXG4gICAgICAuZnJvbShcIm1hdGNoZXNcIilcbiAgICAgIC5zZWxlY3QoYFxuICAgICAgICBpZCxcbiAgICAgICAgZGF0ZSxcbiAgICAgICAgd2lubmVyLFxuICAgICAgICB0ZWFtMV9wbGF5ZXIxKGlkLCBuYW1lLCBlbG8sIG1hdGNoZXMsIHdpbnMpLFxuICAgICAgICB0ZWFtMV9wbGF5ZXIyKGlkLCBuYW1lLCBlbG8sIG1hdGNoZXMsIHdpbnMpLFxuICAgICAgICB0ZWFtMl9wbGF5ZXIxKGlkLCBuYW1lLCBlbG8sIG1hdGNoZXMsIHdpbnMpLFxuICAgICAgICB0ZWFtMl9wbGF5ZXIyKGlkLCBuYW1lLCBlbG8sIG1hdGNoZXMsIHdpbnMpXG4gICAgICBgKVxuICAgICAgLm9yZGVyKFwiZGF0ZVwiLCB7IGFzY2VuZGluZzogZmFsc2UgfSk7XG5cbiAgICBpZiAobWF0Y2hlc0Vycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiRGF0YWJhc2UgZXJyb3IgZmV0Y2hpbmcgbWF0Y2hlczpcIiwgbWF0Y2hlc0Vycm9yKTtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAgeyBlcnJvcjogXCJVbmFibGUgdG8gcmV0cmlldmUgbWF0Y2ggZGF0YVwiIH0sIFxuICAgICAgICB7IHN0YXR1czogNTAwIH1cbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKCFtYXRjaGVzRGF0YT8ubGVuZ3RoKSByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oW10pO1xuXG4gICAgY29uc3QgeyBkYXRhOiBlbG9DaGFuZ2VzRGF0YSwgZXJyb3I6IGVsb0NoYW5nZXNFcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VcbiAgICAgIC5mcm9tKFwiZWxvX2NoYW5nZXNcIilcbiAgICAgIC5zZWxlY3QoXCIqXCIpXG4gICAgICAuaW4oXCJtYXRjaF9pZFwiLCBtYXRjaGVzRGF0YS5tYXAobSA9PiBtLmlkKSk7XG5cbiAgICBpZiAoZWxvQ2hhbmdlc0Vycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiRGF0YWJhc2UgZXJyb3IgZmV0Y2hpbmcgRUxPIGNoYW5nZXM6XCIsIGVsb0NoYW5nZXNFcnJvcik7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICAgIHsgZXJyb3I6IFwiVW5hYmxlIHRvIHJldHJpZXZlIEVMTyBkYXRhXCIgfSwgXG4gICAgICAgIHsgc3RhdHVzOiA1MDAgfVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBmb3JtYXR0ZWRNYXRjaGVzID0gbWF0Y2hlc0RhdGEubWFwKG1hdGNoID0+ICh7XG4gICAgICBpZDogbWF0Y2guaWQsXG4gICAgICBkYXRlOiBtYXRjaC5kYXRlLFxuICAgICAgdGVhbTE6IFttYXRjaC50ZWFtMV9wbGF5ZXIxLCBtYXRjaC50ZWFtMV9wbGF5ZXIyXSxcbiAgICAgIHRlYW0yOiBbbWF0Y2gudGVhbTJfcGxheWVyMSwgbWF0Y2gudGVhbTJfcGxheWVyMl0sXG4gICAgICB3aW5uZXI6IG1hdGNoLndpbm5lcixcbiAgICAgIGVsb0NoYW5nZXM6IGVsb0NoYW5nZXNEYXRhXG4gICAgICAgID8uZmlsdGVyKGNoYW5nZSA9PiBjaGFuZ2UubWF0Y2hfaWQgPT09IG1hdGNoLmlkKVxuICAgICAgICA/LnJlZHVjZSgoYWNjLCBjaGFuZ2UpID0+ICh7XG4gICAgICAgICAgLi4uYWNjLFxuICAgICAgICAgIFtjaGFuZ2UucGxheWVyX2lkXTogY2hhbmdlLmVsb19jaGFuZ2VcbiAgICAgICAgfSksIHt9KSB8fCB7fVxuICAgIH0pKTtcblxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihmb3JtYXR0ZWRNYXRjaGVzKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiVW5leHBlY3RlZCBlcnJvciBpbiBHRVQgL2FwaS9tYXRjaGVzOlwiLCBlcnJvcik7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgeyBlcnJvcjogXCJVbmFibGUgdG8gcmV0cmlldmUgbWF0Y2hlc1wiIH0sIFxuICAgICAgeyBzdGF0dXM6IDUwMCB9XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUE9TVChyZXF1ZXN0OiBSZXF1ZXN0KSB7XG4gIHRyeSB7XG4gICAgY29uc3QgYm9keSA9IGF3YWl0IHJlcXVlc3QuanNvbigpO1xuXG4gICAgY29uc3QgeyB0ZWFtMSwgdGVhbTIsIHNldHMgfSA9IGJvZHk7XG5cbiAgICBpZiAoIXRlYW0xIHx8ICF0ZWFtMiB8fCAhc2V0cykge1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgICB7IGVycm9yOiBcIk1pc3NpbmcgcmVxdWlyZWQgZmllbGRzXCIgfSxcbiAgICAgICAgeyBzdGF0dXM6IDQwMCB9XG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICghQXJyYXkuaXNBcnJheSh0ZWFtMSkgfHwgdGVhbTEubGVuZ3RoICE9PSAyIHx8XG4gICAgICAgICFBcnJheS5pc0FycmF5KHRlYW0yKSB8fCB0ZWFtMi5sZW5ndGggIT09IDIgfHxcbiAgICAgICAgIUFycmF5LmlzQXJyYXkoc2V0cykgfHwgc2V0cy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAgeyBlcnJvcjogXCJJbnZhbGlkIHRlYW0gb3Igc2V0cyBzdHJ1Y3R1cmVcIiB9LFxuICAgICAgICB7IHN0YXR1czogNDAwIH1cbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gQnVpbGQgc2NvcmUgc3RyaW5nIGFuZCBjb21wdXRlIHdpbm5lclxuICAgIGxldCBzY29yZSA9IFwiXCI7XG4gICAgbGV0IHRlYW0xV2lucyA9IDA7XG4gICAgbGV0IHRlYW0yV2lucyA9IDA7XG5cbiAgICBmb3IgKGNvbnN0IHNldCBvZiBzZXRzKSB7XG4gICAgICBjb25zdCB0MSA9IHBhcnNlSW50KHNldC50ZWFtMSk7XG4gICAgICBjb25zdCB0MiA9IHBhcnNlSW50KHNldC50ZWFtMik7XG5cbiAgICAgIGlmIChpc05hTih0MSkgfHwgaXNOYU4odDIpKSB7XG4gICAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAgICB7IGVycm9yOiBcIkludmFsaWQgc2V0IHNjb3Jlc1wiIH0sXG4gICAgICAgICAgeyBzdGF0dXM6IDQwMCB9XG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIHNjb3JlICs9IGAke3QxfS0ke3QyfSwgYDtcbiAgICAgIGlmICh0MSA+IHQyKSB0ZWFtMVdpbnMrKztcbiAgICAgIGVsc2UgaWYgKHQyID4gdDEpIHRlYW0yV2lucysrO1xuICAgIH1cblxuICAgIHNjb3JlID0gc2NvcmUudHJpbSgpLnJlcGxhY2UoLywkLywgXCJcIik7XG5cbiAgICBpZiAodGVhbTFXaW5zID09PSB0ZWFtMldpbnMpIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAgeyBlcnJvcjogXCJNYXRjaCBjYW5ub3QgYmUgYSBkcmF3XCIgfSxcbiAgICAgICAgeyBzdGF0dXM6IDQwMCB9XG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IHdpbm5lciA9IHRlYW0xV2lucyA+IHRlYW0yV2lucyA/IFwidGVhbTFcIiA6IFwidGVhbTJcIjtcblxuICAgIC8vIEZldGNoIHBsYXllcnNcbiAgICBjb25zdCB7IGRhdGE6IHBsYXllcnMsIGVycm9yOiBwbGF5ZXJzRXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXG4gICAgICAuZnJvbShcInBsYXllcnNcIilcbiAgICAgIC5zZWxlY3QoXCIqXCIpXG4gICAgICAuaW4oXCJpZFwiLCBbLi4udGVhbTEsIC4uLnRlYW0yXSk7XG5cbiAgICBpZiAocGxheWVyc0Vycm9yIHx8IHBsYXllcnM/Lmxlbmd0aCAhPT0gNCkge1xuICAgICAgY29uc29sZS5lcnJvcihcIlBsYXllciBmZXRjaCBlcnJvcjpcIiwgcGxheWVyc0Vycm9yKTtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAgeyBlcnJvcjogXCJJbnZhbGlkIHBsYXllciBzZWxlY3Rpb25cIiB9LFxuICAgICAgICB7IHN0YXR1czogNDAwIH1cbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gQ2FsY3VsYXRlIEVMTyBjaGFuZ2VzXG4gICAgY29uc3QgdGVhbTFQbGF5ZXJzID0gdGVhbTEubWFwKGlkID0+IHBsYXllcnMuZmluZChwID0+IHAuaWQgPT09IGlkKSk7XG4gICAgY29uc3QgdGVhbTJQbGF5ZXJzID0gdGVhbTIubWFwKGlkID0+IHBsYXllcnMuZmluZChwID0+IHAuaWQgPT09IGlkKSk7XG5cbiAgICBjb25zdCB0ZWFtMUF2ZyA9ICh0ZWFtMVBsYXllcnNbMF0uZWxvICsgdGVhbTFQbGF5ZXJzWzFdLmVsbykgLyAyO1xuICAgIGNvbnN0IHRlYW0yQXZnID0gKHRlYW0yUGxheWVyc1swXS5lbG8gKyB0ZWFtMlBsYXllcnNbMV0uZWxvKSAvIDI7XG5cbiAgICBjb25zdCBlbG9DaGFuZ2UgPSBjYWxjdWxhdGVFbG9DaGFuZ2UoXG4gICAgICB3aW5uZXIgPT09IFwidGVhbTFcIiA/IHRlYW0xQXZnIDogdGVhbTJBdmcsXG4gICAgICB3aW5uZXIgPT09IFwidGVhbTFcIiA/IHRlYW0yQXZnIDogdGVhbTFBdmdcbiAgICApO1xuXG4gICAgY29uc3QgZWxvQ2hhbmdlcyA9IE9iamVjdC5mcm9tRW50cmllcyhbXG4gICAgICAuLi50ZWFtMVBsYXllcnMubWFwKHAgPT4gW3AuaWQsIHdpbm5lciA9PT0gXCJ0ZWFtMVwiID8gZWxvQ2hhbmdlIDogLWVsb0NoYW5nZV0pLFxuICAgICAgLi4udGVhbTJQbGF5ZXJzLm1hcChwID0+IFtwLmlkLCB3aW5uZXIgPT09IFwidGVhbTJcIiA/IGVsb0NoYW5nZSA6IC1lbG9DaGFuZ2VdKVxuICAgIF0pO1xuXG4gICAgLy8gSW5zZXJ0IG1hdGNoXG4gICAgY29uc3QgeyBkYXRhOiBtYXRjaERhdGEsIGVycm9yOiBtYXRjaEVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxuICAgICAgLmZyb20oXCJtYXRjaGVzXCIpXG4gICAgICAuaW5zZXJ0KFt7XG4gICAgICAgIGRhdGU6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgICAgd2lubmVyLFxuICAgICAgICBzY29yZSxcbiAgICAgICAgdGVhbTFfcGxheWVyMTogdGVhbTFQbGF5ZXJzWzBdLmlkLFxuICAgICAgICB0ZWFtMV9wbGF5ZXIyOiB0ZWFtMVBsYXllcnNbMV0uaWQsXG4gICAgICAgIHRlYW0yX3BsYXllcjE6IHRlYW0yUGxheWVyc1swXS5pZCxcbiAgICAgICAgdGVhbTJfcGxheWVyMjogdGVhbTJQbGF5ZXJzWzFdLmlkLFxuICAgICAgfV0pXG4gICAgICAuc2VsZWN0KCk7XG5cbiAgICBpZiAobWF0Y2hFcnJvciB8fCAhbWF0Y2hEYXRhPy5sZW5ndGgpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJNYXRjaCBpbnNlcnQgZXJyb3I6XCIsIG1hdGNoRXJyb3IpO1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgICB7IGVycm9yOiBcIkZhaWxlZCB0byByZWNvcmQgbWF0Y2hcIiB9LFxuICAgICAgICB7IHN0YXR1czogNTAwIH1cbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3QgbWF0Y2hJZCA9IG1hdGNoRGF0YVswXS5pZDtcblxuICAgIC8vIFJlY29yZCBFTE8gY2hhbmdlc1xuICAgIGNvbnN0IGVsb0NoYW5nZVJlY29yZHMgPSBPYmplY3QuZW50cmllcyhlbG9DaGFuZ2VzKS5tYXAoKFtwbGF5ZXJJZCwgY2hhbmdlXSkgPT4gKHtcbiAgICAgIG1hdGNoX2lkOiBtYXRjaElkLFxuICAgICAgcGxheWVyX2lkOiBwbGF5ZXJJZCxcbiAgICAgIGVsb19jaGFuZ2U6IGNoYW5nZVxuICAgIH0pKTtcblxuICAgIGNvbnN0IHsgZXJyb3I6IGVsb0NoYW5nZUVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxuICAgICAgLmZyb20oXCJlbG9fY2hhbmdlc1wiKVxuICAgICAgLmluc2VydChlbG9DaGFuZ2VSZWNvcmRzKTtcblxuICAgIGlmIChlbG9DaGFuZ2VFcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihcIkVMTyBjaGFuZ2VzIGVycm9yOlwiLCBlbG9DaGFuZ2VFcnJvcik7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICAgIHsgd2FybmluZzogXCJNYXRjaCByZWNvcmRlZCB3aXRoIHBhcnRpYWwgdXBkYXRlc1wiLCBtYXRjaElkIH0sXG4gICAgICAgIHsgc3RhdHVzOiAyMDcgfVxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBVcGRhdGUgcGxheWVyIHN0YXRzXG4gICAgY29uc3QgdXBkYXRlUHJvbWlzZXMgPSBwbGF5ZXJzLm1hcChwbGF5ZXIgPT5cbiAgICAgIHN1cGFiYXNlLmZyb20oXCJwbGF5ZXJzXCIpXG4gICAgICAgIC51cGRhdGUoe1xuICAgICAgICAgIGVsbzogcGxheWVyLmVsbyArIGVsb0NoYW5nZXNbcGxheWVyLmlkXSxcbiAgICAgICAgICBtYXRjaGVzOiBwbGF5ZXIubWF0Y2hlcyArIDEsXG4gICAgICAgICAgd2luczogcGxheWVyLndpbnMgKyAoZWxvQ2hhbmdlc1twbGF5ZXIuaWRdID4gMCA/IDEgOiAwKVxuICAgICAgICB9KVxuICAgICAgICAuZXEoXCJpZFwiLCBwbGF5ZXIuaWQpXG4gICAgKTtcblxuICAgIGNvbnN0IHVwZGF0ZVJlc3VsdHMgPSBhd2FpdCBQcm9taXNlLmFsbCh1cGRhdGVQcm9taXNlcyk7XG4gICAgY29uc3QgdXBkYXRlRXJyb3JzID0gdXBkYXRlUmVzdWx0cy5maWx0ZXIociA9PiByLmVycm9yKTtcblxuICAgIGlmICh1cGRhdGVFcnJvcnMubGVuZ3RoID4gMCkge1xuICAgICAgY29uc29sZS5lcnJvcihcIlBsYXllciB1cGRhdGUgZXJyb3JzOlwiLCB1cGRhdGVFcnJvcnMpO1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgICB7IHdhcm5pbmc6IFwiUGFydGlhbCBzdGF0cyB1cGRhdGVzXCIsIG1hdGNoSWQgfSxcbiAgICAgICAgeyBzdGF0dXM6IDIwNyB9XG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7XG4gICAgICBpZDogbWF0Y2hJZCxcbiAgICAgIHRlYW0xOiB0ZWFtMVBsYXllcnMsXG4gICAgICB0ZWFtMjogdGVhbTJQbGF5ZXJzLFxuICAgICAgd2lubmVyLFxuICAgICAgc2NvcmUsXG4gICAgICBlbG9DaGFuZ2VzXG4gICAgfSk7XG5cbiAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJVbmV4cGVjdGVkIGVycm9yIGluIFBPU1QgL2FwaS9tYXRjaGVzOlwiLCBlcnJvcik7XG4gICAgaWYgKGVycm9yLm5hbWUgPT09ICdTeW50YXhFcnJvcicpIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAgeyBlcnJvcjogXCJJbnZhbGlkIHJlcXVlc3QgZm9ybWF0XCIgfSxcbiAgICAgICAgeyBzdGF0dXM6IDQwMCB9XG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICB7IGVycm9yOiBcIlVuYWJsZSB0byBwcm9jZXNzIG1hdGNoXCIgfSxcbiAgICAgIHsgc3RhdHVzOiA1MDAgfVxuICAgICk7XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBjYWxjdWxhdGVFbG9DaGFuZ2Uod2lubmVyRWxvOiBudW1iZXIsIGxvc2VyRWxvOiBudW1iZXIpOiBudW1iZXIge1xuICBjb25zdCBLID0gMzI7XG4gIGNvbnN0IGV4cGVjdGVkID0gMSAvICgxICsgTWF0aC5wb3coMTAsIChsb3NlckVsbyAtIHdpbm5lckVsbykgLyA0MDApKTtcbiAgcmV0dXJuIE1hdGgucm91bmQoSyAqICgxIC0gZXhwZWN0ZWQpKTtcbn0iXSwibmFtZXMiOlsiY3JlYXRlQ2xpZW50IiwiTmV4dFJlc3BvbnNlIiwic3VwYWJhc2VVcmwiLCJwcm9jZXNzIiwiZW52IiwiTkVYVF9QVUJMSUNfU1VQQUJBU0VfVVJMIiwic3VwYWJhc2VTZXJ2aWNlS2V5IiwiU1VQQUJBU0VfU0VSVklDRV9ST0xFX0tFWSIsInN1cGFiYXNlIiwiTkVYVF9QVUJMSUNfU1VQQUJBU0VfQU5PTl9LRVkiLCJHRVQiLCJkYXRhIiwibWF0Y2hlc0RhdGEiLCJlcnJvciIsIm1hdGNoZXNFcnJvciIsImZyb20iLCJzZWxlY3QiLCJvcmRlciIsImFzY2VuZGluZyIsImNvbnNvbGUiLCJqc29uIiwic3RhdHVzIiwibGVuZ3RoIiwiZWxvQ2hhbmdlc0RhdGEiLCJlbG9DaGFuZ2VzRXJyb3IiLCJpbiIsIm1hcCIsIm0iLCJpZCIsImZvcm1hdHRlZE1hdGNoZXMiLCJtYXRjaCIsImRhdGUiLCJ0ZWFtMSIsInRlYW0xX3BsYXllcjEiLCJ0ZWFtMV9wbGF5ZXIyIiwidGVhbTIiLCJ0ZWFtMl9wbGF5ZXIxIiwidGVhbTJfcGxheWVyMiIsIndpbm5lciIsImVsb0NoYW5nZXMiLCJmaWx0ZXIiLCJjaGFuZ2UiLCJtYXRjaF9pZCIsInJlZHVjZSIsImFjYyIsInBsYXllcl9pZCIsImVsb19jaGFuZ2UiLCJQT1NUIiwicmVxdWVzdCIsImJvZHkiLCJzZXRzIiwiQXJyYXkiLCJpc0FycmF5Iiwic2NvcmUiLCJ0ZWFtMVdpbnMiLCJ0ZWFtMldpbnMiLCJzZXQiLCJ0MSIsInBhcnNlSW50IiwidDIiLCJpc05hTiIsInRyaW0iLCJyZXBsYWNlIiwicGxheWVycyIsInBsYXllcnNFcnJvciIsInRlYW0xUGxheWVycyIsImZpbmQiLCJwIiwidGVhbTJQbGF5ZXJzIiwidGVhbTFBdmciLCJlbG8iLCJ0ZWFtMkF2ZyIsImVsb0NoYW5nZSIsImNhbGN1bGF0ZUVsb0NoYW5nZSIsIk9iamVjdCIsImZyb21FbnRyaWVzIiwibWF0Y2hEYXRhIiwibWF0Y2hFcnJvciIsImluc2VydCIsIkRhdGUiLCJ0b0lTT1N0cmluZyIsIm1hdGNoSWQiLCJlbG9DaGFuZ2VSZWNvcmRzIiwiZW50cmllcyIsInBsYXllcklkIiwiZWxvQ2hhbmdlRXJyb3IiLCJ3YXJuaW5nIiwidXBkYXRlUHJvbWlzZXMiLCJwbGF5ZXIiLCJ1cGRhdGUiLCJtYXRjaGVzIiwid2lucyIsImVxIiwidXBkYXRlUmVzdWx0cyIsIlByb21pc2UiLCJhbGwiLCJ1cGRhdGVFcnJvcnMiLCJyIiwibmFtZSIsIndpbm5lckVsbyIsImxvc2VyRWxvIiwiSyIsImV4cGVjdGVkIiwiTWF0aCIsInBvdyIsInJvdW5kIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/matches/route.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fmatches%2Froute&page=%2Fapi%2Fmatches%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fmatches%2Froute.ts&appDir=%2FUsers%2Flukalazic%2FDesktop%2Fpadel-rankings-main%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Flukalazic%2FDesktop%2Fpadel-rankings-main&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fmatches%2Froute&page=%2Fapi%2Fmatches%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fmatches%2Froute.ts&appDir=%2FUsers%2Flukalazic%2FDesktop%2Fpadel-rankings-main%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Flukalazic%2FDesktop%2Fpadel-rankings-main&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_lukalazic_Desktop_padel_rankings_main_app_api_matches_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/matches/route.ts */ \"(rsc)/./app/api/matches/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/matches/route\",\n        pathname: \"/api/matches\",\n        filename: \"route\",\n        bundlePath: \"app/api/matches/route\"\n    },\n    resolvedPagePath: \"/Users/lukalazic/Desktop/padel-rankings-main/app/api/matches/route.ts\",\n    nextConfigOutput,\n    userland: _Users_lukalazic_Desktop_padel_rankings_main_app_api_matches_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZtYXRjaGVzJTJGcm91dGUmcGFnZT0lMkZhcGklMkZtYXRjaGVzJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGbWF0Y2hlcyUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRmx1a2FsYXppYyUyRkRlc2t0b3AlMkZwYWRlbC1yYW5raW5ncy1tYWluJTJGYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj0lMkZVc2VycyUyRmx1a2FsYXppYyUyRkRlc2t0b3AlMkZwYWRlbC1yYW5raW5ncy1tYWluJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNxQjtBQUNxQjtBQUNsRztBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFzRDtBQUM5RDtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMwRjs7QUFFMUYiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiL1VzZXJzL2x1a2FsYXppYy9EZXNrdG9wL3BhZGVsLXJhbmtpbmdzLW1haW4vYXBwL2FwaS9tYXRjaGVzL3JvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9tYXRjaGVzL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvbWF0Y2hlc1wiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvbWF0Y2hlcy9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIi9Vc2Vycy9sdWthbGF6aWMvRGVza3RvcC9wYWRlbC1yYW5raW5ncy1tYWluL2FwcC9hcGkvbWF0Y2hlcy9yb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHdvcmtBc3luY1N0b3JhZ2UsXG4gICAgICAgIHdvcmtVbml0QXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fmatches%2Froute&page=%2Fapi%2Fmatches%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fmatches%2Froute.ts&appDir=%2FUsers%2Flukalazic%2FDesktop%2Fpadel-rankings-main%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Flukalazic%2FDesktop%2Fpadel-rankings-main&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "punycode":
/*!***************************!*\
  !*** external "punycode" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("punycode");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "tls":
/*!**********************!*\
  !*** external "tls" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@supabase","vendor-chunks/tr46","vendor-chunks/whatwg-url","vendor-chunks/webidl-conversions"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fmatches%2Froute&page=%2Fapi%2Fmatches%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fmatches%2Froute.ts&appDir=%2FUsers%2Flukalazic%2FDesktop%2Fpadel-rankings-main%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Flukalazic%2FDesktop%2Fpadel-rankings-main&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();