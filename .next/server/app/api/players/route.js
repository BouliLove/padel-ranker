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
exports.id = "app/api/players/route";
exports.ids = ["app/api/players/route"];
exports.modules = {

/***/ "(rsc)/./app/api/players/route.ts":
/*!**********************************!*\
  !*** ./app/api/players/route.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @supabase/supabase-js */ \"(rsc)/./node_modules/@supabase/supabase-js/dist/module/index.js\");\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n\n\n// Server-side Supabase client (environment variables are protected here)\nconst supabaseUrl = \"your_supabase_url\";\nconst supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || \"your_supabase_anon_key\";\n// Create a Supabase client with the admin key\nconst supabase = (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_1__.createClient)(supabaseUrl, supabaseServiceKey);\nasync function GET() {\n    try {\n        const { data, error } = await supabase.from(\"players\").select(\"*\").order(\"elo\", {\n            ascending: false\n        });\n        if (error) {\n            // Log detailed error information server-side only\n            console.error(\"Error fetching players:\", error.message, error.details, error.hint);\n            // Return a generic error message to the client\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Unable to retrieve player data\"\n            }, {\n                status: 500\n            });\n        }\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(data);\n    } catch (error) {\n        // Log the full error details server-side\n        console.error(\"Unexpected error in GET /api/players:\", error);\n        // Return a generic error message to the client\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Unable to retrieve player data at this time\"\n        }, {\n            status: 500\n        });\n    }\n}\nasync function POST(request) {\n    try {\n        const body = await request.json();\n        // Validate required fields\n        if (!body.name || !body.email) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Name and email are required\"\n            }, {\n                status: 400\n            });\n        }\n        // Basic validation\n        const name = body.name.trim();\n        const email = body.email.trim();\n        if (name.length < 2 || name.length > 50) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Name must be between 2 and 50 characters\"\n            }, {\n                status: 400\n            });\n        }\n        const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;\n        if (!emailRegex.test(email)) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Invalid email format\"\n            }, {\n                status: 400\n            });\n        }\n        // Check for duplicate name or email\n        const { data: existingPlayers, error: checkError } = await supabase.from(\"players\").select(\"name, email\").or(`name.ilike.${name},email.ilike.${email}`);\n        if (checkError) {\n            // Log detailed error information server-side\n            console.error(\"Database error while checking for duplicates:\", checkError.message, checkError.details, checkError.hint);\n            // Return a user-friendly error message\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Unable to validate player information\"\n            }, {\n                status: 500\n            });\n        }\n        if (existingPlayers && existingPlayers.length > 0) {\n            const duplicateName = existingPlayers.find((p)=>p.name.toLowerCase() === name.toLowerCase());\n            const duplicateEmail = existingPlayers.find((p)=>p.email.toLowerCase() === email.toLowerCase());\n            if (duplicateName) {\n                return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                    error: \"A player with this name already exists\"\n                }, {\n                    status: 400\n                });\n            }\n            if (duplicateEmail) {\n                return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                    error: \"A player with this email already exists\"\n                }, {\n                    status: 400\n                });\n            }\n        }\n        // Insert new player\n        const { data, error } = await supabase.from(\"players\").insert([\n            {\n                name: name,\n                email: email,\n                elo: 1000,\n                matches: 0,\n                wins: 0\n            }\n        ]).select();\n        if (error) {\n            // Log detailed error information server-side only\n            console.error(\"Database error while adding player:\", error.message, error.details, error.hint, error.code);\n            // Check for constraint violations or other specific errors\n            if (error.code === '23505') {\n                return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                    error: \"This player already exists in our system\"\n                }, {\n                    status: 409\n                } // Conflict\n                );\n            }\n            // Generic error for other cases\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Unable to add player at this time\"\n            }, {\n                status: 500\n            });\n        }\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(data[0]);\n    } catch (error) {\n        // Log detailed server-side error\n        console.error(\"Unexpected error in POST /api/players:\", error);\n        // Check if it's a client error (like invalid JSON)\n        if (error.name === 'SyntaxError' && error.message.includes('JSON')) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Invalid request format\"\n            }, {\n                status: 400\n            });\n        }\n        // Return a generic message for all other errors\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Unable to process your request at this time\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QztnQkFBRVUsUUFBUTtZQUFJO1FBRWxCO1FBRUEsT0FBT3JCLHFEQUFZQSxDQUFDb0IsSUFBSSxDQUFDVixJQUFJLENBQUMsRUFBRTtJQUNsQyxFQUFFLE9BQU9DLE9BQVk7UUFDbkIsaUNBQWlDO1FBQ2pDSyxRQUFRTCxLQUFLLENBQUMsMENBQTBDQTtRQUV4RCxtREFBbUQ7UUFDbkQsSUFBSUEsTUFBTWMsSUFBSSxLQUFLLGlCQUFpQmQsTUFBTU0sT0FBTyxDQUFDMkIsUUFBUSxDQUFDLFNBQVM7WUFDbEUsT0FBTzVDLHFEQUFZQSxDQUFDb0IsSUFBSSxDQUN0QjtnQkFBRVQsT0FBTztZQUF5QixHQUNsQztnQkFBRVUsUUFBUTtZQUFJO1FBRWxCO1FBRUEsZ0RBQWdEO1FBQ2hELE9BQU9yQixxREFBWUEsQ0FBQ29CLElBQUksQ0FDdEI7WUFBRVQsT0FBTztRQUE4QyxHQUN2RDtZQUFFVSxRQUFRO1FBQUk7SUFFbEI7QUFDRiIsInNvdXJjZXMiOlsiL1VzZXJzL2x1a2FsYXppYy9EZXNrdG9wL3BhZGVsLXJhbmtpbmdzLW1haW4vYXBwL2FwaS9wbGF5ZXJzL3JvdXRlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNyZWF0ZUNsaWVudCB9IGZyb20gJ0BzdXBhYmFzZS9zdXBhYmFzZS1qcyc7XG5pbXBvcnQgeyBOZXh0UmVzcG9uc2UgfSBmcm9tICduZXh0L3NlcnZlcic7XG5cbi8vIFNlcnZlci1zaWRlIFN1cGFiYXNlIGNsaWVudCAoZW52aXJvbm1lbnQgdmFyaWFibGVzIGFyZSBwcm90ZWN0ZWQgaGVyZSlcbmNvbnN0IHN1cGFiYXNlVXJsID0gcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfU1VQQUJBU0VfVVJMITtcbmNvbnN0IHN1cGFiYXNlU2VydmljZUtleSA9IHByb2Nlc3MuZW52LlNVUEFCQVNFX1NFUlZJQ0VfUk9MRV9LRVkgfHwgcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfU1VQQUJBU0VfQU5PTl9LRVkhO1xuXG4vLyBDcmVhdGUgYSBTdXBhYmFzZSBjbGllbnQgd2l0aCB0aGUgYWRtaW4ga2V5XG5jb25zdCBzdXBhYmFzZSA9IGNyZWF0ZUNsaWVudChzdXBhYmFzZVVybCwgc3VwYWJhc2VTZXJ2aWNlS2V5KTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEdFVCgpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IGRhdGEsIGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxuICAgICAgLmZyb20oXCJwbGF5ZXJzXCIpXG4gICAgICAuc2VsZWN0KFwiKlwiKVxuICAgICAgLm9yZGVyKFwiZWxvXCIsIHsgYXNjZW5kaW5nOiBmYWxzZSB9KTtcblxuICAgIGlmIChlcnJvcikge1xuICAgICAgLy8gTG9nIGRldGFpbGVkIGVycm9yIGluZm9ybWF0aW9uIHNlcnZlci1zaWRlIG9ubHlcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBmZXRjaGluZyBwbGF5ZXJzOlwiLCBlcnJvci5tZXNzYWdlLCBlcnJvci5kZXRhaWxzLCBlcnJvci5oaW50KTtcbiAgICAgIFxuICAgICAgLy8gUmV0dXJuIGEgZ2VuZXJpYyBlcnJvciBtZXNzYWdlIHRvIHRoZSBjbGllbnRcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAgeyBlcnJvcjogXCJVbmFibGUgdG8gcmV0cmlldmUgcGxheWVyIGRhdGFcIiB9LCBcbiAgICAgICAgeyBzdGF0dXM6IDUwMCB9XG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihkYXRhKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAvLyBMb2cgdGhlIGZ1bGwgZXJyb3IgZGV0YWlscyBzZXJ2ZXItc2lkZVxuICAgIGNvbnNvbGUuZXJyb3IoXCJVbmV4cGVjdGVkIGVycm9yIGluIEdFVCAvYXBpL3BsYXllcnM6XCIsIGVycm9yKTtcbiAgICBcbiAgICAvLyBSZXR1cm4gYSBnZW5lcmljIGVycm9yIG1lc3NhZ2UgdG8gdGhlIGNsaWVudFxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgIHsgZXJyb3I6IFwiVW5hYmxlIHRvIHJldHJpZXZlIHBsYXllciBkYXRhIGF0IHRoaXMgdGltZVwiIH0sIFxuICAgICAgeyBzdGF0dXM6IDUwMCB9XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUE9TVChyZXF1ZXN0OiBSZXF1ZXN0KSB7XG4gIHRyeSB7XG4gICAgY29uc3QgYm9keSA9IGF3YWl0IHJlcXVlc3QuanNvbigpO1xuICAgIFxuICAgIC8vIFZhbGlkYXRlIHJlcXVpcmVkIGZpZWxkc1xuICAgIGlmICghYm9keS5uYW1lIHx8ICFib2R5LmVtYWlsKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICAgIHsgZXJyb3I6IFwiTmFtZSBhbmQgZW1haWwgYXJlIHJlcXVpcmVkXCIgfSxcbiAgICAgICAgeyBzdGF0dXM6IDQwMCB9XG4gICAgICApO1xuICAgIH1cbiAgICBcbiAgICAvLyBCYXNpYyB2YWxpZGF0aW9uXG4gICAgY29uc3QgbmFtZSA9IGJvZHkubmFtZS50cmltKCk7XG4gICAgY29uc3QgZW1haWwgPSBib2R5LmVtYWlsLnRyaW0oKTtcbiAgICBcbiAgICBpZiAobmFtZS5sZW5ndGggPCAyIHx8IG5hbWUubGVuZ3RoID4gNTApIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAgeyBlcnJvcjogXCJOYW1lIG11c3QgYmUgYmV0d2VlbiAyIGFuZCA1MCBjaGFyYWN0ZXJzXCIgfSxcbiAgICAgICAgeyBzdGF0dXM6IDQwMCB9XG4gICAgICApO1xuICAgIH1cbiAgICBcbiAgICBjb25zdCBlbWFpbFJlZ2V4ID0gL15bXlxcc0BdK0BbXlxcc0BdK1xcLlteXFxzQF0rJC87XG4gICAgaWYgKCFlbWFpbFJlZ2V4LnRlc3QoZW1haWwpKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICAgIHsgZXJyb3I6IFwiSW52YWxpZCBlbWFpbCBmb3JtYXRcIiB9LFxuICAgICAgICB7IHN0YXR1czogNDAwIH1cbiAgICAgICk7XG4gICAgfVxuICAgIFxuICAgIC8vIENoZWNrIGZvciBkdXBsaWNhdGUgbmFtZSBvciBlbWFpbFxuICAgIGNvbnN0IHsgZGF0YTogZXhpc3RpbmdQbGF5ZXJzLCBlcnJvcjogY2hlY2tFcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VcbiAgICAgIC5mcm9tKFwicGxheWVyc1wiKVxuICAgICAgLnNlbGVjdChcIm5hbWUsIGVtYWlsXCIpXG4gICAgICAub3IoYG5hbWUuaWxpa2UuJHtuYW1lfSxlbWFpbC5pbGlrZS4ke2VtYWlsfWApO1xuICAgICAgXG4gICAgaWYgKGNoZWNrRXJyb3IpIHtcbiAgICAgIC8vIExvZyBkZXRhaWxlZCBlcnJvciBpbmZvcm1hdGlvbiBzZXJ2ZXItc2lkZVxuICAgICAgY29uc29sZS5lcnJvcihcIkRhdGFiYXNlIGVycm9yIHdoaWxlIGNoZWNraW5nIGZvciBkdXBsaWNhdGVzOlwiLCBcbiAgICAgICAgY2hlY2tFcnJvci5tZXNzYWdlLFxuICAgICAgICBjaGVja0Vycm9yLmRldGFpbHMsXG4gICAgICAgIGNoZWNrRXJyb3IuaGludFxuICAgICAgKTtcbiAgICAgIFxuICAgICAgLy8gUmV0dXJuIGEgdXNlci1mcmllbmRseSBlcnJvciBtZXNzYWdlXG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICAgIHsgZXJyb3I6IFwiVW5hYmxlIHRvIHZhbGlkYXRlIHBsYXllciBpbmZvcm1hdGlvblwiIH0sXG4gICAgICAgIHsgc3RhdHVzOiA1MDAgfVxuICAgICAgKTtcbiAgICB9XG4gICAgXG4gICAgaWYgKGV4aXN0aW5nUGxheWVycyAmJiBleGlzdGluZ1BsYXllcnMubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgZHVwbGljYXRlTmFtZSA9IGV4aXN0aW5nUGxheWVycy5maW5kKFxuICAgICAgICAocCkgPT4gcC5uYW1lLnRvTG93ZXJDYXNlKCkgPT09IG5hbWUudG9Mb3dlckNhc2UoKVxuICAgICAgKTtcbiAgICAgIGNvbnN0IGR1cGxpY2F0ZUVtYWlsID0gZXhpc3RpbmdQbGF5ZXJzLmZpbmQoXG4gICAgICAgIChwKSA9PiBwLmVtYWlsLnRvTG93ZXJDYXNlKCkgPT09IGVtYWlsLnRvTG93ZXJDYXNlKClcbiAgICAgICk7XG4gICAgICBcbiAgICAgIGlmIChkdXBsaWNhdGVOYW1lKSB7XG4gICAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAgICB7IGVycm9yOiBcIkEgcGxheWVyIHdpdGggdGhpcyBuYW1lIGFscmVhZHkgZXhpc3RzXCIgfSxcbiAgICAgICAgICB7IHN0YXR1czogNDAwIH1cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgaWYgKGR1cGxpY2F0ZUVtYWlsKSB7XG4gICAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAgICB7IGVycm9yOiBcIkEgcGxheWVyIHdpdGggdGhpcyBlbWFpbCBhbHJlYWR5IGV4aXN0c1wiIH0sXG4gICAgICAgICAgeyBzdGF0dXM6IDQwMCB9XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIC8vIEluc2VydCBuZXcgcGxheWVyXG4gICAgY29uc3QgeyBkYXRhLCBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VcbiAgICAgIC5mcm9tKFwicGxheWVyc1wiKVxuICAgICAgLmluc2VydChbXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICAgIGVtYWlsOiBlbWFpbCxcbiAgICAgICAgICBlbG86IDEwMDAsXG4gICAgICAgICAgbWF0Y2hlczogMCxcbiAgICAgICAgICB3aW5zOiAwLFxuICAgICAgICB9LFxuICAgICAgXSlcbiAgICAgIC5zZWxlY3QoKTtcbiAgICAgIFxuICAgIGlmIChlcnJvcikge1xuICAgICAgLy8gTG9nIGRldGFpbGVkIGVycm9yIGluZm9ybWF0aW9uIHNlcnZlci1zaWRlIG9ubHlcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJEYXRhYmFzZSBlcnJvciB3aGlsZSBhZGRpbmcgcGxheWVyOlwiLCBcbiAgICAgICAgZXJyb3IubWVzc2FnZSwgXG4gICAgICAgIGVycm9yLmRldGFpbHMsIFxuICAgICAgICBlcnJvci5oaW50LCBcbiAgICAgICAgZXJyb3IuY29kZVxuICAgICAgKTtcbiAgICAgIFxuICAgICAgLy8gQ2hlY2sgZm9yIGNvbnN0cmFpbnQgdmlvbGF0aW9ucyBvciBvdGhlciBzcGVjaWZpYyBlcnJvcnNcbiAgICAgIGlmIChlcnJvci5jb2RlID09PSAnMjM1MDUnKSB7IC8vIFVuaXF1ZSBjb25zdHJhaW50IHZpb2xhdGlvblxuICAgICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICAgICAgeyBlcnJvcjogXCJUaGlzIHBsYXllciBhbHJlYWR5IGV4aXN0cyBpbiBvdXIgc3lzdGVtXCIgfSxcbiAgICAgICAgICB7IHN0YXR1czogNDA5IH0gLy8gQ29uZmxpY3RcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy8gR2VuZXJpYyBlcnJvciBmb3Igb3RoZXIgY2FzZXNcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAgeyBlcnJvcjogXCJVbmFibGUgdG8gYWRkIHBsYXllciBhdCB0aGlzIHRpbWVcIiB9LFxuICAgICAgICB7IHN0YXR1czogNTAwIH1cbiAgICAgICk7XG4gICAgfVxuICAgIFxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihkYXRhWzBdKTtcbiAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xuICAgIC8vIExvZyBkZXRhaWxlZCBzZXJ2ZXItc2lkZSBlcnJvclxuICAgIGNvbnNvbGUuZXJyb3IoXCJVbmV4cGVjdGVkIGVycm9yIGluIFBPU1QgL2FwaS9wbGF5ZXJzOlwiLCBlcnJvcik7XG4gICAgXG4gICAgLy8gQ2hlY2sgaWYgaXQncyBhIGNsaWVudCBlcnJvciAobGlrZSBpbnZhbGlkIEpTT04pXG4gICAgaWYgKGVycm9yLm5hbWUgPT09ICdTeW50YXhFcnJvcicgJiYgZXJyb3IubWVzc2FnZS5pbmNsdWRlcygnSlNPTicpKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICAgIHsgZXJyb3I6IFwiSW52YWxpZCByZXF1ZXN0IGZvcm1hdFwiIH0sXG4gICAgICAgIHsgc3RhdHVzOiA0MDAgfVxuICAgICAgKTtcbiAgICB9XG4gICAgXG4gICAgLy8gUmV0dXJuIGEgZ2VuZXJpYyBtZXNzYWdlIGZvciBhbGwgb3RoZXIgZXJyb3JzXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgeyBlcnJvcjogXCJVbmFibGUgdG8gcHJvY2VzcyB5b3VyIHJlcXVlc3QgYXQgdGhpcyB0aW1lXCIgfSxcbiAgICAgIHsgc3RhdHVzOiA1MDAgfVxuICAgICk7XG4gIH1cbn0iXSwibmFtZXMiOlsiY3JlYXRlQ2xpZW50IiwiTmV4dFJlc3BvbnNlIiwic3VwYWJhc2VVcmwiLCJwcm9jZXNzIiwiZW52IiwiTkVYVF9QVUJMSUNfU1VQQUJBU0VfVVJMIiwic3VwYWJhc2VTZXJ2aWNlS2V5IiwiU1VQQUJBU0VfU0VSVklDRV9ST0xFX0tFWSIsIk5FWFRfUFVCTElDX1NVUEFCQVNFX0FOT05fS0VZIiwic3VwYWJhc2UiLCJHRVQiLCJkYXRhIiwiZXJyb3IiLCJmcm9tIiwic2VsZWN0Iiwib3JkZXIiLCJhc2NlbmRpbmciLCJjb25zb2xlIiwibWVzc2FnZSIsImRldGFpbHMiLCJoaW50IiwianNvbiIsInN0YXR1cyIsIlBPU1QiLCJyZXF1ZXN0IiwiYm9keSIsIm5hbWUiLCJlbWFpbCIsInRyaW0iLCJsZW5ndGgiLCJlbWFpbFJlZ2V4IiwidGVzdCIsImV4aXN0aW5nUGxheWVycyIsImNoZWNrRXJyb3IiLCJvciIsImR1cGxpY2F0ZU5hbWUiLCJmaW5kIiwicCIsInRvTG93ZXJDYXNlIiwiZHVwbGljYXRlRW1haWwiLCJpbnNlcnQiLCJlbG8iLCJtYXRjaGVzIiwid2lucyIsImNvZGUiLCJpbmNsdWRlcyJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/players/route.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fplayers%2Froute&page=%2Fapi%2Fplayers%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fplayers%2Froute.ts&appDir=%2FUsers%2Flukalazic%2FDesktop%2Fpadel-rankings-main%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Flukalazic%2FDesktop%2Fpadel-rankings-main&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fplayers%2Froute&page=%2Fapi%2Fplayers%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fplayers%2Froute.ts&appDir=%2FUsers%2Flukalazic%2FDesktop%2Fpadel-rankings-main%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Flukalazic%2FDesktop%2Fpadel-rankings-main&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_lukalazic_Desktop_padel_rankings_main_app_api_players_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/players/route.ts */ \"(rsc)/./app/api/players/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/players/route\",\n        pathname: \"/api/players\",\n        filename: \"route\",\n        bundlePath: \"app/api/players/route\"\n    },\n    resolvedPagePath: \"/Users/lukalazic/Desktop/padel-rankings-main/app/api/players/route.ts\",\n    nextConfigOutput,\n    userland: _Users_lukalazic_Desktop_padel_rankings_main_app_api_players_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZwbGF5ZXJzJTJGcm91dGUmcGFnZT0lMkZhcGklMkZwbGF5ZXJzJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGcGxheWVycyUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRmx1a2FsYXppYyUyRkRlc2t0b3AlMkZwYWRlbC1yYW5raW5ncy1tYWluJTJGYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj0lMkZVc2VycyUyRmx1a2FsYXppYyUyRkRlc2t0b3AlMkZwYWRlbC1yYW5raW5ncy1tYWluJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNxQjtBQUNxQjtBQUNsRztBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFzRDtBQUM5RDtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMwRjs7QUFFMUYiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiL1VzZXJzL2x1a2FsYXppYy9EZXNrdG9wL3BhZGVsLXJhbmtpbmdzLW1haW4vYXBwL2FwaS9wbGF5ZXJzL3JvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9wbGF5ZXJzL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvcGxheWVyc1wiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvcGxheWVycy9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIi9Vc2Vycy9sdWthbGF6aWMvRGVza3RvcC9wYWRlbC1yYW5raW5ncy1tYWluL2FwcC9hcGkvcGxheWVycy9yb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHdvcmtBc3luY1N0b3JhZ2UsXG4gICAgICAgIHdvcmtVbml0QXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fplayers%2Froute&page=%2Fapi%2Fplayers%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fplayers%2Froute.ts&appDir=%2FUsers%2Flukalazic%2FDesktop%2Fpadel-rankings-main%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Flukalazic%2FDesktop%2Fpadel-rankings-main&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

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
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@supabase","vendor-chunks/tr46","vendor-chunks/whatwg-url","vendor-chunks/webidl-conversions"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fplayers%2Froute&page=%2Fapi%2Fplayers%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fplayers%2Froute.ts&appDir=%2FUsers%2Flukalazic%2FDesktop%2Fpadel-rankings-main%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Flukalazic%2FDesktop%2Fpadel-rankings-main&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();