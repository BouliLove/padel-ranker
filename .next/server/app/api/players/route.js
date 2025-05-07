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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @supabase/supabase-js */ \"(rsc)/./node_modules/@supabase/supabase-js/dist/module/index.js\");\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n\n\nconst supabaseUrl = \"https://rhtltbpshcvibcqiexct.supabase.co\";\nconst supabase = (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_1__.createClient)(\"https://rhtltbpshcvibcqiexct.supabase.co\", \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJodGx0YnBzaGN2aWJjcWlleGN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNDk1NDYsImV4cCI6MjA2MTkyNTU0Nn0.jFNbuENCE_g5DNhXoh2KkWg1mKu2D0Dyo9wXvFKcSjA\");\nasync function GET() {\n    try {\n        const { data, error } = await supabase.from(\"players\").select(\"*\").order(\"elo\", {\n            ascending: false\n        });\n        if (error) {\n            console.error(\"Error fetching players:\", error.message, error.details, error.hint);\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Unable to retrieve player data\"\n            }, {\n                status: 500\n            });\n        }\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(data);\n    } catch (error) {\n        console.error(\"Unexpected error in GET /api/players:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Unable to retrieve player data at this time\"\n        }, {\n            status: 500\n        });\n    }\n}\nasync function POST(request) {\n    try {\n        const body = await request.json();\n        // Validate required fields\n        if (!body.name) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Name is required\"\n            }, {\n                status: 400\n            });\n        }\n        // Basic validation\n        const name = body.name.trim();\n        if (name.length < 2 || name.length > 50) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Name must be between 2 and 50 characters\"\n            }, {\n                status: 400\n            });\n        }\n        // Check for duplicate name\n        const { data: existingPlayers, error: checkError } = await supabase.from(\"players\").select(\"name\").ilike(\"name\", name);\n        if (checkError) {\n            console.error(\"Database error while checking for duplicates:\", checkError);\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Unable to validate player information\"\n            }, {\n                status: 500\n            });\n        }\n        if (existingPlayers && existingPlayers.length > 0) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"A player with this name already exists\"\n            }, {\n                status: 400\n            });\n        }\n        // Insert new player\n        const { data, error } = await supabase.from(\"players\").insert([\n            {\n                name: name,\n                elo: 1000,\n                matches: 0,\n                wins: 0\n            }\n        ]).select();\n        if (error) {\n            console.error(\"Database error while adding player:\", error);\n            if (error.code === '23505') {\n                return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                    error: \"This player already exists\"\n                }, {\n                    status: 409\n                });\n            }\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Unable to add player\"\n            }, {\n                status: 500\n            });\n        }\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(data[0]);\n    } catch (error) {\n        console.error(\"Unexpected error in POST /api/players:\", error);\n        if (error.name === 'SyntaxError' && error.message.includes('JSON')) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Invalid request format\"\n            }, {\n                status: 400\n            });\n        }\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Unable to process request\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q2tCLElBQUksQ0FDdEI7Z0JBQUVULE9BQU87WUFBdUIsR0FDaEM7Z0JBQUVVLFFBQVE7WUFBSTtRQUVsQjtRQUVBLE9BQU9uQixxREFBWUEsQ0FBQ2tCLElBQUksQ0FBQ1YsSUFBSSxDQUFDLEVBQUU7SUFDbEMsRUFBRSxPQUFPQyxPQUFZO1FBQ25CSyxRQUFRTCxLQUFLLENBQUMsMENBQTBDQTtRQUN4RCxJQUFJQSxNQUFNYyxJQUFJLEtBQUssaUJBQWlCZCxNQUFNTSxPQUFPLENBQUNtQixRQUFRLENBQUMsU0FBUztZQUNsRSxPQUFPbEMscURBQVlBLENBQUNrQixJQUFJLENBQ3RCO2dCQUFFVCxPQUFPO1lBQXlCLEdBQ2xDO2dCQUFFVSxRQUFRO1lBQUk7UUFFbEI7UUFDQSxPQUFPbkIscURBQVlBLENBQUNrQixJQUFJLENBQ3RCO1lBQUVULE9BQU87UUFBNEIsR0FDckM7WUFBRVUsUUFBUTtRQUFJO0lBRWxCO0FBQ0YiLCJzb3VyY2VzIjpbIi9Vc2Vycy9sdWthbGF6aWMvRGVza3RvcC9wYWRlbC1yYW5raW5ncy1tYWluL2FwcC9hcGkvcGxheWVycy9yb3V0ZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVDbGllbnQgfSBmcm9tICdAc3VwYWJhc2Uvc3VwYWJhc2UtanMnO1xuaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSAnbmV4dC9zZXJ2ZXInO1xuXG5jb25zdCBzdXBhYmFzZVVybCA9IHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX1NVUEFCQVNFX1VSTCE7XG5jb25zdCBzdXBhYmFzZSA9IGNyZWF0ZUNsaWVudChcbiAgcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfU1VQQUJBU0VfVVJMISxcbiAgcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfU1VQQUJBU0VfQU5PTl9LRVkhXG4pO1xuXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQoKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgeyBkYXRhLCBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VcbiAgICAgIC5mcm9tKFwicGxheWVyc1wiKVxuICAgICAgLnNlbGVjdChcIipcIilcbiAgICAgIC5vcmRlcihcImVsb1wiLCB7IGFzY2VuZGluZzogZmFsc2UgfSk7XG5cbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBmZXRjaGluZyBwbGF5ZXJzOlwiLCBlcnJvci5tZXNzYWdlLCBlcnJvci5kZXRhaWxzLCBlcnJvci5oaW50KTtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAgeyBlcnJvcjogXCJVbmFibGUgdG8gcmV0cmlldmUgcGxheWVyIGRhdGFcIiB9LCBcbiAgICAgICAgeyBzdGF0dXM6IDUwMCB9XG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihkYXRhKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiVW5leHBlY3RlZCBlcnJvciBpbiBHRVQgL2FwaS9wbGF5ZXJzOlwiLCBlcnJvcik7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgeyBlcnJvcjogXCJVbmFibGUgdG8gcmV0cmlldmUgcGxheWVyIGRhdGEgYXQgdGhpcyB0aW1lXCIgfSwgXG4gICAgICB7IHN0YXR1czogNTAwIH1cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQT1NUKHJlcXVlc3Q6IFJlcXVlc3QpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBib2R5ID0gYXdhaXQgcmVxdWVzdC5qc29uKCk7XG4gICAgXG4gICAgLy8gVmFsaWRhdGUgcmVxdWlyZWQgZmllbGRzXG4gICAgaWYgKCFib2R5Lm5hbWUpIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAgeyBlcnJvcjogXCJOYW1lIGlzIHJlcXVpcmVkXCIgfSxcbiAgICAgICAgeyBzdGF0dXM6IDQwMCB9XG4gICAgICApO1xuICAgIH1cbiAgICBcbiAgICAvLyBCYXNpYyB2YWxpZGF0aW9uXG4gICAgY29uc3QgbmFtZSA9IGJvZHkubmFtZS50cmltKCk7XG4gICAgXG4gICAgaWYgKG5hbWUubGVuZ3RoIDwgMiB8fCBuYW1lLmxlbmd0aCA+IDUwKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICAgIHsgZXJyb3I6IFwiTmFtZSBtdXN0IGJlIGJldHdlZW4gMiBhbmQgNTAgY2hhcmFjdGVyc1wiIH0sXG4gICAgICAgIHsgc3RhdHVzOiA0MDAgfVxuICAgICAgKTtcbiAgICB9XG4gICAgXG4gICAgLy8gQ2hlY2sgZm9yIGR1cGxpY2F0ZSBuYW1lXG4gICAgY29uc3QgeyBkYXRhOiBleGlzdGluZ1BsYXllcnMsIGVycm9yOiBjaGVja0Vycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxuICAgICAgLmZyb20oXCJwbGF5ZXJzXCIpXG4gICAgICAuc2VsZWN0KFwibmFtZVwiKVxuICAgICAgLmlsaWtlKFwibmFtZVwiLCBuYW1lKTtcbiAgICAgIFxuICAgIGlmIChjaGVja0Vycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiRGF0YWJhc2UgZXJyb3Igd2hpbGUgY2hlY2tpbmcgZm9yIGR1cGxpY2F0ZXM6XCIsIGNoZWNrRXJyb3IpO1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgICB7IGVycm9yOiBcIlVuYWJsZSB0byB2YWxpZGF0ZSBwbGF5ZXIgaW5mb3JtYXRpb25cIiB9LFxuICAgICAgICB7IHN0YXR1czogNTAwIH1cbiAgICAgICk7XG4gICAgfVxuICAgIFxuICAgIGlmIChleGlzdGluZ1BsYXllcnMgJiYgZXhpc3RpbmdQbGF5ZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAgeyBlcnJvcjogXCJBIHBsYXllciB3aXRoIHRoaXMgbmFtZSBhbHJlYWR5IGV4aXN0c1wiIH0sXG4gICAgICAgIHsgc3RhdHVzOiA0MDAgfVxuICAgICAgKTtcbiAgICB9XG4gICAgXG4gICAgLy8gSW5zZXJ0IG5ldyBwbGF5ZXJcbiAgICBjb25zdCB7IGRhdGEsIGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxuICAgICAgLmZyb20oXCJwbGF5ZXJzXCIpXG4gICAgICAuaW5zZXJ0KFt7XG4gICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgIGVsbzogMTAwMCxcbiAgICAgICAgbWF0Y2hlczogMCxcbiAgICAgICAgd2luczogMCxcbiAgICAgIH1dKVxuICAgICAgLnNlbGVjdCgpO1xuICAgICAgXG4gICAgaWYgKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiRGF0YWJhc2UgZXJyb3Igd2hpbGUgYWRkaW5nIHBsYXllcjpcIiwgZXJyb3IpO1xuICAgICAgaWYgKGVycm9yLmNvZGUgPT09ICcyMzUwNScpIHtcbiAgICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgICAgIHsgZXJyb3I6IFwiVGhpcyBwbGF5ZXIgYWxyZWFkeSBleGlzdHNcIiB9LFxuICAgICAgICAgIHsgc3RhdHVzOiA0MDkgfVxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgICB7IGVycm9yOiBcIlVuYWJsZSB0byBhZGQgcGxheWVyXCIgfSxcbiAgICAgICAgeyBzdGF0dXM6IDUwMCB9XG4gICAgICApO1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oZGF0YVswXSk7XG4gIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiVW5leHBlY3RlZCBlcnJvciBpbiBQT1NUIC9hcGkvcGxheWVyczpcIiwgZXJyb3IpO1xuICAgIGlmIChlcnJvci5uYW1lID09PSAnU3ludGF4RXJyb3InICYmIGVycm9yLm1lc3NhZ2UuaW5jbHVkZXMoJ0pTT04nKSkge1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgICB7IGVycm9yOiBcIkludmFsaWQgcmVxdWVzdCBmb3JtYXRcIiB9LFxuICAgICAgICB7IHN0YXR1czogNDAwIH1cbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgIHsgZXJyb3I6IFwiVW5hYmxlIHRvIHByb2Nlc3MgcmVxdWVzdFwiIH0sXG4gICAgICB7IHN0YXR1czogNTAwIH1cbiAgICApO1xuICB9XG59Il0sIm5hbWVzIjpbImNyZWF0ZUNsaWVudCIsIk5leHRSZXNwb25zZSIsInN1cGFiYXNlVXJsIiwicHJvY2VzcyIsImVudiIsIk5FWFRfUFVCTElDX1NVUEFCQVNFX1VSTCIsInN1cGFiYXNlIiwiTkVYVF9QVUJMSUNfU1VQQUJBU0VfQU5PTl9LRVkiLCJHRVQiLCJkYXRhIiwiZXJyb3IiLCJmcm9tIiwic2VsZWN0Iiwib3JkZXIiLCJhc2NlbmRpbmciLCJjb25zb2xlIiwibWVzc2FnZSIsImRldGFpbHMiLCJoaW50IiwianNvbiIsInN0YXR1cyIsIlBPU1QiLCJyZXF1ZXN0IiwiYm9keSIsIm5hbWUiLCJ0cmltIiwibGVuZ3RoIiwiZXhpc3RpbmdQbGF5ZXJzIiwiY2hlY2tFcnJvciIsImlsaWtlIiwiaW5zZXJ0IiwiZWxvIiwibWF0Y2hlcyIsIndpbnMiLCJjb2RlIiwiaW5jbHVkZXMiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/players/route.ts\n");

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