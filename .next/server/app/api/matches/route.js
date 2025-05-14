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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @supabase/supabase-js */ \"(rsc)/./node_modules/@supabase/supabase-js/dist/module/index.js\");\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n\n\nconst supabase = (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_1__.createClient)(\"https://rhtltbpshcvibcqiexct.supabase.co\", \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJodGx0YnBzaGN2aWJjcWlleGN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNDk1NDYsImV4cCI6MjA2MTkyNTU0Nn0.jFNbuENCE_g5DNhXoh2KkWg1mKu2D0Dyo9wXvFKcSjA\");\nasync function GET() {\n    try {\n        const { data: matchesData, error: matchesError } = await supabase.from(\"matches\").select(`\n        id,\n        date,\n        winner,\n        score,\n        team1_player1(id, name, elo, matches, wins),\n        team1_player2(id, name, elo, matches, wins),\n        team2_player1(id, name, elo, matches, wins),\n        team2_player2(id, name, elo, matches, wins)\n      `).order(\"date\", {\n            ascending: false\n        });\n        if (matchesError) {\n            console.error(\"Database error fetching matches:\", matchesError);\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Unable to retrieve match data\"\n            }, {\n                status: 500\n            });\n        }\n        if (!matchesData?.length) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json([]);\n        const { data: eloChangesData, error: eloChangesError } = await supabase.from(\"elo_changes\").select(\"*\").in(\"match_id\", matchesData.map((m)=>m.id));\n        if (eloChangesError) {\n            console.error(\"Database error fetching ELO changes:\", eloChangesError);\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Unable to retrieve ELO data\"\n            }, {\n                status: 500\n            });\n        }\n        const formattedMatches = matchesData.map((match)=>({\n                id: match.id,\n                date: match.date,\n                team1: [\n                    match.team1_player1,\n                    match.team1_player2\n                ],\n                team2: [\n                    match.team2_player1,\n                    match.team2_player2\n                ],\n                winner: match.winner,\n                score: match.score,\n                eloChanges: eloChangesData?.filter((change)=>change.match_id === match.id)?.reduce((acc, change)=>({\n                        ...acc,\n                        [change.player_id]: change.elo_change\n                    }), {}) || {}\n            }));\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(formattedMatches);\n    } catch (error) {\n        console.error(\"Unexpected error in GET /api/matches:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Unable to retrieve matches\"\n        }, {\n            status: 500\n        });\n    }\n}\nasync function POST(request) {\n    try {\n        const body = await request.json();\n        console.log(\"Received match POST body:\", body);\n        const { team1, team2, sets } = body;\n        if (!Array.isArray(team1) || !Array.isArray(team2) || team1.length !== 2 || team2.length !== 2) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Invalid team structure\"\n            }, {\n                status: 400\n            });\n        }\n        if (!Array.isArray(sets) || sets.length === 0 || sets.some((s)=>typeof s.team1 !== \"number\" || typeof s.team2 !== \"number\")) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Invalid sets format\"\n            }, {\n                status: 400\n            });\n        }\n        // Build score string and determine winner\n        const score = sets.map((s)=>`${s.team1}-${s.team2}`).join(\", \");\n        let team1Wins = 0;\n        let team2Wins = 0;\n        for (const set of sets){\n            if (set.team1 > set.team2) team1Wins++;\n            else if (set.team2 > set.team1) team2Wins++;\n        }\n        if (team1Wins === team2Wins) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Draws are not allowed\"\n            }, {\n                status: 400\n            });\n        }\n        const winner = team1Wins > team2Wins ? \"team1\" : \"team2\";\n        // Fetch players\n        const { data: players, error: playersError } = await supabase.from(\"players\").select(\"*\").in(\"id\", [\n            ...team1,\n            ...team2\n        ]);\n        if (playersError || players?.length !== 4) {\n            console.error(\"Player fetch error:\", playersError);\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Invalid player selection\"\n            }, {\n                status: 400\n            });\n        }\n        const team1Players = team1.map((id)=>players.find((p)=>p.id === id));\n        const team2Players = team2.map((id)=>players.find((p)=>p.id === id));\n        const eloChanges = {\n            [team1Players[0].id]: 0,\n            [team1Players[1].id]: 0,\n            [team2Players[0].id]: 0,\n            [team2Players[1].id]: 0\n        };\n        for (const set of sets){\n            const margin = Math.abs(set.team1 - set.team2);\n            const team1Won = set.team1 > set.team2;\n            const team2Won = set.team2 > set.team1;\n            if (!team1Won && !team2Won) continue;\n            const team1Avg = (team1Players[0].elo + team1Players[1].elo) / 2;\n            const team2Avg = (team2Players[0].elo + team2Players[1].elo) / 2;\n            // Team 1\n            for (const [i, player] of team1Players.entries()){\n                const teammate = team1Players[1 - i];\n                const delta = calculateEloChangeWithTeammate(player.elo, teammate.elo, team2Avg, team1Won, margin);\n                eloChanges[player.id] += delta;\n            }\n            // Team 2\n            for (const [i, player] of team2Players.entries()){\n                const teammate = team2Players[1 - i];\n                const delta = calculateEloChangeWithTeammate(player.elo, teammate.elo, team1Avg, team2Won, margin);\n                eloChanges[player.id] += delta;\n            }\n        }\n        // Cap max Elo change per player per match\n        Object.keys(eloChanges).forEach((id)=>{\n            eloChanges[id] = Math.max(-40, Math.min(40, eloChanges[id]));\n        });\n        // Insert match\n        const { data: matchData, error: matchError } = await supabase.from(\"matches\").insert([\n            {\n                date: new Date().toISOString(),\n                winner,\n                score,\n                team1_player1: team1Players[0].id,\n                team1_player2: team1Players[1].id,\n                team2_player1: team2Players[0].id,\n                team2_player2: team2Players[1].id\n            }\n        ]).select();\n        if (matchError || !matchData?.length) {\n            console.error(\"Match insert error:\", matchError);\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Failed to record match\"\n            }, {\n                status: 500\n            });\n        }\n        const matchId = matchData[0].id;\n        // Insert elo_changes\n        const eloChangeRecords = Object.entries(eloChanges).map(([playerId, change])=>({\n                match_id: matchId,\n                player_id: playerId,\n                elo_change: change\n            }));\n        const { error: eloChangeError } = await supabase.from(\"elo_changes\").insert(eloChangeRecords);\n        if (eloChangeError) {\n            console.error(\"ELO changes insert error:\", eloChangeError);\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                warning: \"ELO update failed\",\n                matchId\n            }, {\n                status: 207\n            });\n        }\n        // Update players\n        const updatePromises = players.map((player)=>supabase.from(\"players\").update({\n                elo: player.elo + eloChanges[player.id],\n                matches: player.matches + 1,\n                wins: player.wins + (eloChanges[player.id] > 0 ? 1 : 0)\n            }).eq(\"id\", player.id));\n        const updateResults = await Promise.all(updatePromises);\n        const updateErrors = updateResults.filter((r)=>r.error);\n        if (updateErrors.length > 0) {\n            console.error(\"Player update errors:\", updateErrors);\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                warning: \"Partial stats update\",\n                matchId\n            }, {\n                status: 207\n            });\n        }\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            id: matchId,\n            team1: team1Players,\n            team2: team2Players,\n            winner,\n            score,\n            eloChanges\n        });\n    } catch (error) {\n        console.error(\"Unexpected error in POST /api/matches:\", error);\n        if (error.name === 'SyntaxError') {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Invalid JSON format\"\n            }, {\n                status: 400\n            });\n        }\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Unable to process match\"\n        }, {\n            status: 500\n        });\n    }\n}\n// 🎯 Elo per player per set with teammate + margin + opponent scaling\nfunction calculateEloChangeWithTeammate(playerElo, teammateElo, opponentTeamElo, setWon, margin) {\n    const K = 16;\n    const effectiveElo = playerElo * 0.75 + teammateElo * 0.25;\n    const expected = 1 / (1 + Math.pow(10, (opponentTeamElo - effectiveElo) / 400));\n    const base = K * ((setWon ? 1 : 0) - expected);\n    const marginFactor = 1 + Math.min(margin, 4) * 0.15;\n    return Math.round(base * marginFactor);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RCxTQUFTLElBQUksS0FBS0csUUFBTztJQUM1QyxNQUFNRyxlQUFlLElBQUloRCxLQUFLaUIsR0FBRyxDQUFDbEIsUUFBUSxLQUFLO0lBQy9DLE9BQU9DLEtBQUtpRCxLQUFLLENBQUNGLE9BQU9DO0FBQzNCIiwic291cmNlcyI6WyIvVXNlcnMvbHVrYWxhemljL0Rlc2t0b3AvcGFkZWwtcmFua2luZ3MtbWFpbi9hcHAvYXBpL21hdGNoZXMvcm91dGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3JlYXRlQ2xpZW50IH0gZnJvbSAnQHN1cGFiYXNlL3N1cGFiYXNlLWpzJztcbmltcG9ydCB7IE5leHRSZXNwb25zZSB9IGZyb20gJ25leHQvc2VydmVyJztcblxuY29uc3Qgc3VwYWJhc2UgPSBjcmVhdGVDbGllbnQoXG4gIHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX1NVUEFCQVNFX1VSTCEsXG4gIHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX1NVUEFCQVNFX0FOT05fS0VZIVxuKTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEdFVCgpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IGRhdGE6IG1hdGNoZXNEYXRhLCBlcnJvcjogbWF0Y2hlc0Vycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxuICAgICAgLmZyb20oXCJtYXRjaGVzXCIpXG4gICAgICAuc2VsZWN0KGBcbiAgICAgICAgaWQsXG4gICAgICAgIGRhdGUsXG4gICAgICAgIHdpbm5lcixcbiAgICAgICAgc2NvcmUsXG4gICAgICAgIHRlYW0xX3BsYXllcjEoaWQsIG5hbWUsIGVsbywgbWF0Y2hlcywgd2lucyksXG4gICAgICAgIHRlYW0xX3BsYXllcjIoaWQsIG5hbWUsIGVsbywgbWF0Y2hlcywgd2lucyksXG4gICAgICAgIHRlYW0yX3BsYXllcjEoaWQsIG5hbWUsIGVsbywgbWF0Y2hlcywgd2lucyksXG4gICAgICAgIHRlYW0yX3BsYXllcjIoaWQsIG5hbWUsIGVsbywgbWF0Y2hlcywgd2lucylcbiAgICAgIGApXG4gICAgICAub3JkZXIoXCJkYXRlXCIsIHsgYXNjZW5kaW5nOiBmYWxzZSB9KTtcblxuICAgIGlmIChtYXRjaGVzRXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJEYXRhYmFzZSBlcnJvciBmZXRjaGluZyBtYXRjaGVzOlwiLCBtYXRjaGVzRXJyb3IpO1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6IFwiVW5hYmxlIHRvIHJldHJpZXZlIG1hdGNoIGRhdGFcIiB9LCB7IHN0YXR1czogNTAwIH0pO1xuICAgIH1cblxuICAgIGlmICghbWF0Y2hlc0RhdGE/Lmxlbmd0aCkgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFtdKTtcblxuICAgIGNvbnN0IHsgZGF0YTogZWxvQ2hhbmdlc0RhdGEsIGVycm9yOiBlbG9DaGFuZ2VzRXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXG4gICAgICAuZnJvbShcImVsb19jaGFuZ2VzXCIpXG4gICAgICAuc2VsZWN0KFwiKlwiKVxuICAgICAgLmluKFwibWF0Y2hfaWRcIiwgbWF0Y2hlc0RhdGEubWFwKG0gPT4gbS5pZCkpO1xuXG4gICAgaWYgKGVsb0NoYW5nZXNFcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihcIkRhdGFiYXNlIGVycm9yIGZldGNoaW5nIEVMTyBjaGFuZ2VzOlwiLCBlbG9DaGFuZ2VzRXJyb3IpO1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6IFwiVW5hYmxlIHRvIHJldHJpZXZlIEVMTyBkYXRhXCIgfSwgeyBzdGF0dXM6IDUwMCB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBmb3JtYXR0ZWRNYXRjaGVzID0gbWF0Y2hlc0RhdGEubWFwKG1hdGNoID0+ICh7XG4gICAgICBpZDogbWF0Y2guaWQsXG4gICAgICBkYXRlOiBtYXRjaC5kYXRlLFxuICAgICAgdGVhbTE6IFttYXRjaC50ZWFtMV9wbGF5ZXIxLCBtYXRjaC50ZWFtMV9wbGF5ZXIyXSxcbiAgICAgIHRlYW0yOiBbbWF0Y2gudGVhbTJfcGxheWVyMSwgbWF0Y2gudGVhbTJfcGxheWVyMl0sXG4gICAgICB3aW5uZXI6IG1hdGNoLndpbm5lcixcbiAgICAgIHNjb3JlOiBtYXRjaC5zY29yZSxcbiAgICAgIGVsb0NoYW5nZXM6IGVsb0NoYW5nZXNEYXRhXG4gICAgICAgID8uZmlsdGVyKGNoYW5nZSA9PiBjaGFuZ2UubWF0Y2hfaWQgPT09IG1hdGNoLmlkKVxuICAgICAgICA/LnJlZHVjZSgoYWNjLCBjaGFuZ2UpID0+ICh7XG4gICAgICAgICAgLi4uYWNjLFxuICAgICAgICAgIFtjaGFuZ2UucGxheWVyX2lkXTogY2hhbmdlLmVsb19jaGFuZ2VcbiAgICAgICAgfSksIHt9KSB8fCB7fVxuICAgIH0pKTtcblxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihmb3JtYXR0ZWRNYXRjaGVzKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiVW5leHBlY3RlZCBlcnJvciBpbiBHRVQgL2FwaS9tYXRjaGVzOlwiLCBlcnJvcik7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6IFwiVW5hYmxlIHRvIHJldHJpZXZlIG1hdGNoZXNcIiB9LCB7IHN0YXR1czogNTAwIH0pO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQT1NUKHJlcXVlc3Q6IFJlcXVlc3QpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBib2R5ID0gYXdhaXQgcmVxdWVzdC5qc29uKCk7XG4gICAgY29uc29sZS5sb2coXCJSZWNlaXZlZCBtYXRjaCBQT1NUIGJvZHk6XCIsIGJvZHkpO1xuXG4gICAgY29uc3QgeyB0ZWFtMSwgdGVhbTIsIHNldHMgfSA9IGJvZHk7XG5cbiAgICBpZiAoIUFycmF5LmlzQXJyYXkodGVhbTEpIHx8ICFBcnJheS5pc0FycmF5KHRlYW0yKSB8fCB0ZWFtMS5sZW5ndGggIT09IDIgfHwgdGVhbTIubGVuZ3RoICE9PSAyKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogXCJJbnZhbGlkIHRlYW0gc3RydWN0dXJlXCIgfSwgeyBzdGF0dXM6IDQwMCB9KTtcbiAgICB9XG5cbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoc2V0cykgfHwgc2V0cy5sZW5ndGggPT09IDAgfHwgc2V0cy5zb21lKHMgPT4gdHlwZW9mIHMudGVhbTEgIT09IFwibnVtYmVyXCIgfHwgdHlwZW9mIHMudGVhbTIgIT09IFwibnVtYmVyXCIpKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogXCJJbnZhbGlkIHNldHMgZm9ybWF0XCIgfSwgeyBzdGF0dXM6IDQwMCB9KTtcbiAgICB9XG5cbiAgICAvLyBCdWlsZCBzY29yZSBzdHJpbmcgYW5kIGRldGVybWluZSB3aW5uZXJcbiAgICBjb25zdCBzY29yZSA9IHNldHMubWFwKHMgPT4gYCR7cy50ZWFtMX0tJHtzLnRlYW0yfWApLmpvaW4oXCIsIFwiKTtcbiAgICBsZXQgdGVhbTFXaW5zID0gMDtcbiAgICBsZXQgdGVhbTJXaW5zID0gMDtcblxuICAgIGZvciAoY29uc3Qgc2V0IG9mIHNldHMpIHtcbiAgICAgIGlmIChzZXQudGVhbTEgPiBzZXQudGVhbTIpIHRlYW0xV2lucysrO1xuICAgICAgZWxzZSBpZiAoc2V0LnRlYW0yID4gc2V0LnRlYW0xKSB0ZWFtMldpbnMrKztcbiAgICB9XG5cbiAgICBpZiAodGVhbTFXaW5zID09PSB0ZWFtMldpbnMpIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiBcIkRyYXdzIGFyZSBub3QgYWxsb3dlZFwiIH0sIHsgc3RhdHVzOiA0MDAgfSk7XG4gICAgfVxuXG4gICAgY29uc3Qgd2lubmVyID0gdGVhbTFXaW5zID4gdGVhbTJXaW5zID8gXCJ0ZWFtMVwiIDogXCJ0ZWFtMlwiO1xuXG4gICAgLy8gRmV0Y2ggcGxheWVyc1xuICAgIGNvbnN0IHsgZGF0YTogcGxheWVycywgZXJyb3I6IHBsYXllcnNFcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VcbiAgICAgIC5mcm9tKFwicGxheWVyc1wiKVxuICAgICAgLnNlbGVjdChcIipcIilcbiAgICAgIC5pbihcImlkXCIsIFsuLi50ZWFtMSwgLi4udGVhbTJdKTtcblxuICAgIGlmIChwbGF5ZXJzRXJyb3IgfHwgcGxheWVycz8ubGVuZ3RoICE9PSA0KSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiUGxheWVyIGZldGNoIGVycm9yOlwiLCBwbGF5ZXJzRXJyb3IpO1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6IFwiSW52YWxpZCBwbGF5ZXIgc2VsZWN0aW9uXCIgfSwgeyBzdGF0dXM6IDQwMCB9KTtcbiAgICB9XG5cbiAgICBjb25zdCB0ZWFtMVBsYXllcnMgPSB0ZWFtMS5tYXAoaWQgPT4gcGxheWVycy5maW5kKHAgPT4gcC5pZCA9PT0gaWQpISk7XG4gICAgY29uc3QgdGVhbTJQbGF5ZXJzID0gdGVhbTIubWFwKGlkID0+IHBsYXllcnMuZmluZChwID0+IHAuaWQgPT09IGlkKSEpO1xuXG4gICAgY29uc3QgZWxvQ2hhbmdlczogeyBbcGxheWVySWQ6IHN0cmluZ106IG51bWJlciB9ID0ge1xuICAgICAgW3RlYW0xUGxheWVyc1swXS5pZF06IDAsXG4gICAgICBbdGVhbTFQbGF5ZXJzWzFdLmlkXTogMCxcbiAgICAgIFt0ZWFtMlBsYXllcnNbMF0uaWRdOiAwLFxuICAgICAgW3RlYW0yUGxheWVyc1sxXS5pZF06IDAsXG4gICAgfTtcblxuICAgIGZvciAoY29uc3Qgc2V0IG9mIHNldHMpIHtcbiAgICAgIGNvbnN0IG1hcmdpbiA9IE1hdGguYWJzKHNldC50ZWFtMSAtIHNldC50ZWFtMik7XG4gICAgICBjb25zdCB0ZWFtMVdvbiA9IHNldC50ZWFtMSA+IHNldC50ZWFtMjtcbiAgICAgIGNvbnN0IHRlYW0yV29uID0gc2V0LnRlYW0yID4gc2V0LnRlYW0xO1xuXG4gICAgICBpZiAoIXRlYW0xV29uICYmICF0ZWFtMldvbikgY29udGludWU7XG5cbiAgICAgIGNvbnN0IHRlYW0xQXZnID0gKHRlYW0xUGxheWVyc1swXS5lbG8gKyB0ZWFtMVBsYXllcnNbMV0uZWxvKSAvIDI7XG4gICAgICBjb25zdCB0ZWFtMkF2ZyA9ICh0ZWFtMlBsYXllcnNbMF0uZWxvICsgdGVhbTJQbGF5ZXJzWzFdLmVsbykgLyAyO1xuXG4gICAgICAvLyBUZWFtIDFcbiAgICAgIGZvciAoY29uc3QgW2ksIHBsYXllcl0gb2YgdGVhbTFQbGF5ZXJzLmVudHJpZXMoKSkge1xuICAgICAgICBjb25zdCB0ZWFtbWF0ZSA9IHRlYW0xUGxheWVyc1sxIC0gaV07XG4gICAgICAgIGNvbnN0IGRlbHRhID0gY2FsY3VsYXRlRWxvQ2hhbmdlV2l0aFRlYW1tYXRlKHBsYXllci5lbG8sIHRlYW1tYXRlLmVsbywgdGVhbTJBdmcsIHRlYW0xV29uLCBtYXJnaW4pO1xuICAgICAgICBlbG9DaGFuZ2VzW3BsYXllci5pZF0gKz0gZGVsdGE7XG4gICAgICB9XG5cbiAgICAgIC8vIFRlYW0gMlxuICAgICAgZm9yIChjb25zdCBbaSwgcGxheWVyXSBvZiB0ZWFtMlBsYXllcnMuZW50cmllcygpKSB7XG4gICAgICAgIGNvbnN0IHRlYW1tYXRlID0gdGVhbTJQbGF5ZXJzWzEgLSBpXTtcbiAgICAgICAgY29uc3QgZGVsdGEgPSBjYWxjdWxhdGVFbG9DaGFuZ2VXaXRoVGVhbW1hdGUocGxheWVyLmVsbywgdGVhbW1hdGUuZWxvLCB0ZWFtMUF2ZywgdGVhbTJXb24sIG1hcmdpbik7XG4gICAgICAgIGVsb0NoYW5nZXNbcGxheWVyLmlkXSArPSBkZWx0YTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBDYXAgbWF4IEVsbyBjaGFuZ2UgcGVyIHBsYXllciBwZXIgbWF0Y2hcbiAgICBPYmplY3Qua2V5cyhlbG9DaGFuZ2VzKS5mb3JFYWNoKGlkID0+IHtcbiAgICAgIGVsb0NoYW5nZXNbaWRdID0gTWF0aC5tYXgoLTQwLCBNYXRoLm1pbig0MCwgZWxvQ2hhbmdlc1tpZF0pKTtcbiAgICB9KTtcblxuICAgIC8vIEluc2VydCBtYXRjaFxuICAgIGNvbnN0IHsgZGF0YTogbWF0Y2hEYXRhLCBlcnJvcjogbWF0Y2hFcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VcbiAgICAgIC5mcm9tKFwibWF0Y2hlc1wiKVxuICAgICAgLmluc2VydChbe1xuICAgICAgICBkYXRlOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICAgIHdpbm5lcixcbiAgICAgICAgc2NvcmUsXG4gICAgICAgIHRlYW0xX3BsYXllcjE6IHRlYW0xUGxheWVyc1swXS5pZCxcbiAgICAgICAgdGVhbTFfcGxheWVyMjogdGVhbTFQbGF5ZXJzWzFdLmlkLFxuICAgICAgICB0ZWFtMl9wbGF5ZXIxOiB0ZWFtMlBsYXllcnNbMF0uaWQsXG4gICAgICAgIHRlYW0yX3BsYXllcjI6IHRlYW0yUGxheWVyc1sxXS5pZCxcbiAgICAgIH1dKVxuICAgICAgLnNlbGVjdCgpO1xuXG4gICAgaWYgKG1hdGNoRXJyb3IgfHwgIW1hdGNoRGF0YT8ubGVuZ3RoKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiTWF0Y2ggaW5zZXJ0IGVycm9yOlwiLCBtYXRjaEVycm9yKTtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiBcIkZhaWxlZCB0byByZWNvcmQgbWF0Y2hcIiB9LCB7IHN0YXR1czogNTAwIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IG1hdGNoSWQgPSBtYXRjaERhdGFbMF0uaWQ7XG5cbiAgICAvLyBJbnNlcnQgZWxvX2NoYW5nZXNcbiAgICBjb25zdCBlbG9DaGFuZ2VSZWNvcmRzID0gT2JqZWN0LmVudHJpZXMoZWxvQ2hhbmdlcykubWFwKChbcGxheWVySWQsIGNoYW5nZV0pID0+ICh7XG4gICAgICBtYXRjaF9pZDogbWF0Y2hJZCxcbiAgICAgIHBsYXllcl9pZDogcGxheWVySWQsXG4gICAgICBlbG9fY2hhbmdlOiBjaGFuZ2VcbiAgICB9KSk7XG5cbiAgICBjb25zdCB7IGVycm9yOiBlbG9DaGFuZ2VFcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VcbiAgICAgIC5mcm9tKFwiZWxvX2NoYW5nZXNcIilcbiAgICAgIC5pbnNlcnQoZWxvQ2hhbmdlUmVjb3Jkcyk7XG5cbiAgICBpZiAoZWxvQ2hhbmdlRXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJFTE8gY2hhbmdlcyBpbnNlcnQgZXJyb3I6XCIsIGVsb0NoYW5nZUVycm9yKTtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IHdhcm5pbmc6IFwiRUxPIHVwZGF0ZSBmYWlsZWRcIiwgbWF0Y2hJZCB9LCB7IHN0YXR1czogMjA3IH0pO1xuICAgIH1cblxuICAgIC8vIFVwZGF0ZSBwbGF5ZXJzXG4gICAgY29uc3QgdXBkYXRlUHJvbWlzZXMgPSBwbGF5ZXJzLm1hcChwbGF5ZXIgPT5cbiAgICAgIHN1cGFiYXNlXG4gICAgICAgIC5mcm9tKFwicGxheWVyc1wiKVxuICAgICAgICAudXBkYXRlKHtcbiAgICAgICAgICBlbG86IHBsYXllci5lbG8gKyBlbG9DaGFuZ2VzW3BsYXllci5pZF0sXG4gICAgICAgICAgbWF0Y2hlczogcGxheWVyLm1hdGNoZXMgKyAxLFxuICAgICAgICAgIHdpbnM6IHBsYXllci53aW5zICsgKGVsb0NoYW5nZXNbcGxheWVyLmlkXSA+IDAgPyAxIDogMClcbiAgICAgICAgfSlcbiAgICAgICAgLmVxKFwiaWRcIiwgcGxheWVyLmlkKVxuICAgICk7XG5cbiAgICBjb25zdCB1cGRhdGVSZXN1bHRzID0gYXdhaXQgUHJvbWlzZS5hbGwodXBkYXRlUHJvbWlzZXMpO1xuICAgIGNvbnN0IHVwZGF0ZUVycm9ycyA9IHVwZGF0ZVJlc3VsdHMuZmlsdGVyKHIgPT4gci5lcnJvcik7XG5cbiAgICBpZiAodXBkYXRlRXJyb3JzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJQbGF5ZXIgdXBkYXRlIGVycm9yczpcIiwgdXBkYXRlRXJyb3JzKTtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IHdhcm5pbmc6IFwiUGFydGlhbCBzdGF0cyB1cGRhdGVcIiwgbWF0Y2hJZCB9LCB7IHN0YXR1czogMjA3IH0pO1xuICAgIH1cblxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7XG4gICAgICBpZDogbWF0Y2hJZCxcbiAgICAgIHRlYW0xOiB0ZWFtMVBsYXllcnMsXG4gICAgICB0ZWFtMjogdGVhbTJQbGF5ZXJzLFxuICAgICAgd2lubmVyLFxuICAgICAgc2NvcmUsXG4gICAgICBlbG9DaGFuZ2VzXG4gICAgfSk7XG5cbiAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJVbmV4cGVjdGVkIGVycm9yIGluIFBPU1QgL2FwaS9tYXRjaGVzOlwiLCBlcnJvcik7XG4gICAgaWYgKGVycm9yLm5hbWUgPT09ICdTeW50YXhFcnJvcicpIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiBcIkludmFsaWQgSlNPTiBmb3JtYXRcIiB9LCB7IHN0YXR1czogNDAwIH0pO1xuICAgIH1cbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogXCJVbmFibGUgdG8gcHJvY2VzcyBtYXRjaFwiIH0sIHsgc3RhdHVzOiA1MDAgfSk7XG4gIH1cbn1cblxuLy8g8J+OryBFbG8gcGVyIHBsYXllciBwZXIgc2V0IHdpdGggdGVhbW1hdGUgKyBtYXJnaW4gKyBvcHBvbmVudCBzY2FsaW5nXG5mdW5jdGlvbiBjYWxjdWxhdGVFbG9DaGFuZ2VXaXRoVGVhbW1hdGUoXG4gIHBsYXllckVsbzogbnVtYmVyLFxuICB0ZWFtbWF0ZUVsbzogbnVtYmVyLFxuICBvcHBvbmVudFRlYW1FbG86IG51bWJlcixcbiAgc2V0V29uOiBib29sZWFuLFxuICBtYXJnaW46IG51bWJlclxuKTogbnVtYmVyIHtcbiAgY29uc3QgSyA9IDE2O1xuICBjb25zdCBlZmZlY3RpdmVFbG8gPSBwbGF5ZXJFbG8gKiAwLjc1ICsgdGVhbW1hdGVFbG8gKiAwLjI1O1xuICBjb25zdCBleHBlY3RlZCA9IDEgLyAoMSArIE1hdGgucG93KDEwLCAob3Bwb25lbnRUZWFtRWxvIC0gZWZmZWN0aXZlRWxvKSAvIDQwMCkpO1xuICBjb25zdCBiYXNlID0gSyAqICgoc2V0V29uID8gMSA6IDApIC0gZXhwZWN0ZWQpO1xuICBjb25zdCBtYXJnaW5GYWN0b3IgPSAxICsgTWF0aC5taW4obWFyZ2luLCA0KSAqIDAuMTU7XG4gIHJldHVybiBNYXRoLnJvdW5kKGJhc2UgKiBtYXJnaW5GYWN0b3IpO1xufVxuIl0sIm5hbWVzIjpbImNyZWF0ZUNsaWVudCIsIk5leHRSZXNwb25zZSIsInN1cGFiYXNlIiwicHJvY2VzcyIsImVudiIsIk5FWFRfUFVCTElDX1NVUEFCQVNFX1VSTCIsIk5FWFRfUFVCTElDX1NVUEFCQVNFX0FOT05fS0VZIiwiR0VUIiwiZGF0YSIsIm1hdGNoZXNEYXRhIiwiZXJyb3IiLCJtYXRjaGVzRXJyb3IiLCJmcm9tIiwic2VsZWN0Iiwib3JkZXIiLCJhc2NlbmRpbmciLCJjb25zb2xlIiwianNvbiIsInN0YXR1cyIsImxlbmd0aCIsImVsb0NoYW5nZXNEYXRhIiwiZWxvQ2hhbmdlc0Vycm9yIiwiaW4iLCJtYXAiLCJtIiwiaWQiLCJmb3JtYXR0ZWRNYXRjaGVzIiwibWF0Y2giLCJkYXRlIiwidGVhbTEiLCJ0ZWFtMV9wbGF5ZXIxIiwidGVhbTFfcGxheWVyMiIsInRlYW0yIiwidGVhbTJfcGxheWVyMSIsInRlYW0yX3BsYXllcjIiLCJ3aW5uZXIiLCJzY29yZSIsImVsb0NoYW5nZXMiLCJmaWx0ZXIiLCJjaGFuZ2UiLCJtYXRjaF9pZCIsInJlZHVjZSIsImFjYyIsInBsYXllcl9pZCIsImVsb19jaGFuZ2UiLCJQT1NUIiwicmVxdWVzdCIsImJvZHkiLCJsb2ciLCJzZXRzIiwiQXJyYXkiLCJpc0FycmF5Iiwic29tZSIsInMiLCJqb2luIiwidGVhbTFXaW5zIiwidGVhbTJXaW5zIiwic2V0IiwicGxheWVycyIsInBsYXllcnNFcnJvciIsInRlYW0xUGxheWVycyIsImZpbmQiLCJwIiwidGVhbTJQbGF5ZXJzIiwibWFyZ2luIiwiTWF0aCIsImFicyIsInRlYW0xV29uIiwidGVhbTJXb24iLCJ0ZWFtMUF2ZyIsImVsbyIsInRlYW0yQXZnIiwiaSIsInBsYXllciIsImVudHJpZXMiLCJ0ZWFtbWF0ZSIsImRlbHRhIiwiY2FsY3VsYXRlRWxvQ2hhbmdlV2l0aFRlYW1tYXRlIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJtYXgiLCJtaW4iLCJtYXRjaERhdGEiLCJtYXRjaEVycm9yIiwiaW5zZXJ0IiwiRGF0ZSIsInRvSVNPU3RyaW5nIiwibWF0Y2hJZCIsImVsb0NoYW5nZVJlY29yZHMiLCJwbGF5ZXJJZCIsImVsb0NoYW5nZUVycm9yIiwid2FybmluZyIsInVwZGF0ZVByb21pc2VzIiwidXBkYXRlIiwibWF0Y2hlcyIsIndpbnMiLCJlcSIsInVwZGF0ZVJlc3VsdHMiLCJQcm9taXNlIiwiYWxsIiwidXBkYXRlRXJyb3JzIiwiciIsIm5hbWUiLCJwbGF5ZXJFbG8iLCJ0ZWFtbWF0ZUVsbyIsIm9wcG9uZW50VGVhbUVsbyIsInNldFdvbiIsIksiLCJlZmZlY3RpdmVFbG8iLCJleHBlY3RlZCIsInBvdyIsImJhc2UiLCJtYXJnaW5GYWN0b3IiLCJyb3VuZCJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/matches/route.ts\n");

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