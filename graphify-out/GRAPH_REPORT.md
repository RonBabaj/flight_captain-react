# Graph Report - workspace  (2026-08-18)

## Corpus Check
- 136 files · ~151,526 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1122 nodes · 2569 edges · 54 communities (50 shown, 4 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 151 edges (avg confidence: 0.78)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2d29c755`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- googleflights2_provider.go
- types.ts
- FlightDetailsModal.tsx
- Issue
- kiwi_apify_provider.go
- MonthDealsScreen.tsx
- dependencies
- server.go
- Features
- affiliate.go
- ExploreScreen.tsx
- net/http.ResponseWriter
- ResultsScreen.tsx
- compilerOptions
- MonthDealsScreen
- types/index.ts
- LocaleContext.tsx
- client.ts
- handleCreateSession
- CalendarModal.tsx
- qa_runner.py
- ApiClient
- AppIcon.tsx
- TestResult
- ResponseValidator
- main
- searchStore.ts
- expo
- config_loader.py
- dealsCache.ts
- time.Time
- backend_api_contracts.md
- testing.T
- SortBar.tsx
- api.ts
- ValidationIssue
- Backend QA Automation Tool
- models.py
- Registry
- Fly-Fix – Frontend
- write-spa-fallbacks.mjs
- metro.config.js
- __init__.py
- flightcaptainweb
- DatePickerCalendar.tsx
- SearchFormScreen.tsx
- useLocale
- ThemeContext.tsx
- MultiSearchResult
- SearchSession

## God Nodes (most connected - your core abstractions)
1. `useLocale()` - 38 edges
2. `useTheme()` - 37 edges
3. `ProviderResult` - 32 edges
4. `TestResult` - 29 edges
5. `MonthDealsScreen()` - 27 edges
6. `handleCreateSession()` - 23 edges
7. `GoogleFlights2Provider` - 21 edges
8. `FlightOption` - 20 edges
9. `ExploreScreen()` - 20 edges
10. `ResultsScreen()` - 20 edges

## Surprising Connections (you probably didn't know these)
- `handleAffiliateOutboundLink()` --calls--> `ResolveProvider()`  [INFERRED]
  backend/server.go → backend/affiliate.go
- `handleAffiliateProvider()` --calls--> `ResolveProvider()`  [INFERRED]
  backend/server.go → backend/affiliate.go
- `handleAffiliateRedirect()` --calls--> `ResolveProvider()`  [INFERRED]
  backend/server.go → backend/affiliate.go
- `handleOutBooking()` --calls--> `ResolveProvider()`  [INFERRED]
  backend/server.go → backend/affiliate.go
- `handleOutBooking()` --calls--> `RecordClick()`  [INFERRED]
  backend/server.go → backend/affiliate.go

## Import Cycles
- None detected.

## Communities (54 total, 4 thin omitted)

### Community 0 - "googleflights2_provider.go"
Cohesion: 0.08
Nodes (51): DedupeProviderResults(), ItineraryFingerprint(), maxInt(), mergeSelfTransfer(), normalizeFlightNumber(), roundTimeKey(), TotalStops(), uniqueStrings() (+43 more)

### Community 1 - "types.ts"
Cohesion: 0.08
Nodes (21): ErrorBoundary, Props, s, State, LandingScreen(), Nav, styles, DynamicDestinationsStack() (+13 more)

### Community 2 - "FlightDetailsModal.tsx"
Cohesion: 0.07
Nodes (54): AffiliateProvider, AffiliateProviderResponse, BookingOptionInput, BookingRedirectParams, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary() (+46 more)

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "kiwi_apify_provider.go"
Cohesion: 0.07
Nodes (50): TestCombineOneWayBatches(), TestCombineOneWayBatches_emptyBatch(), TestCompleteExtraLegs(), TestExtraLegsFingerprint(), TestHasExtraLegs(), apifyErrorMessage(), asArray(), collectCarriers() (+42 more)

### Community 5 - "MonthDealsScreen.tsx"
Cohesion: 0.13
Nodes (21): dealBestScore(), DEALS_LOADING_PHRASES, dlb, esm, fl, fmtDur(), hfm, HUB_AIRPORTS (+13 more)

### Community 6 - "dependencies"
Cohesion: 0.04
Nodes (44): @babel/core, expo, @expo/metro-runtime, expo-status-bar, dependencies, expo, @expo/metro-runtime, expo-status-bar (+36 more)

### Community 7 - "server.go"
Cohesion: 0.11
Nodes (30): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, Carrier, CarrierCodes, DayDeal, FareBreakdown (+22 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (33): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+25 more)

### Community 9 - "affiliate.go"
Cohesion: 0.17
Nodes (17): BuildRedirectURL(), getAffiliateID(), GetClicksSummary(), getOTAProvider(), GetSessionAndOption(), FlightOption, SearchSession, ParseOptionIndex() (+9 more)

### Community 10 - "ExploreScreen.tsx"
Cohesion: 0.13
Nodes (28): getMonthDeals(), getExploreDestinations(), getAirportEntry(), getCityDisplayName(), c, countryFlag(), d, DestCard() (+20 more)

### Community 11 - "net/http.ResponseWriter"
Cohesion: 0.35
Nodes (16): RecordClick(), handleFlyFixRefineIssues(), handleAffiliateClicksSummary(), handleAffiliateOutboundLink(), handleAffiliateProvider(), handleAffiliateRedirect(), handleAirportSearch(), handleFlightDetails() (+8 more)

### Community 12 - "ResultsScreen.tsx"
Cohesion: 0.12
Nodes (23): createSearchSession(), getSearchSessionResults(), defaultParams, DynamicDestinationsScreen(), emptyExtra(), Nav, styles, bestScore() (+15 more)

### Community 13 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+15 more)

### Community 14 - "MonthDealsScreen"
Cohesion: 0.19
Nodes (14): buildDealsPositioningSignature(), formatDealDate(), MonthDealsScreen(), parseDealYmdToUTCDate(), toYmdUTC(), clampDealsMonth(), dealsActions, DealsSortField (+6 more)

### Community 15 - "types/index.ts"
Cohesion: 0.15
Nodes (16): GetDealsRangeParams, GetMonthDealsParams, AIRPORT_DICTIONARY, getAirportDisplayName(), lower(), matchesQuery(), rankResult(), searchAirportsLocal() (+8 more)

### Community 16 - "LocaleContext.tsx"
Cohesion: 0.14
Nodes (20): getStorage(), languageToLocale(), loadSaved(), LocaleContext, LocaleContextValue, LocaleProvider(), save(), VALID_CURRENCIES (+12 more)

### Community 17 - "client.ts"
Cohesion: 0.06
Nodes (39): App(), linking, RTLWrapper(), searchAirports(), API_BASE, apiGet(), apiPost(), apiRequest() (+31 more)

### Community 18 - "handleCreateSession"
Cohesion: 0.14
Nodes (20): CreateSearchSessionRequest, ExtraSearchLeg, FlightOption, LayoverSummary, OutboundSummary, applyPriceNormalization(), applySoftStrictBaggageOptions(), baggageOrderString() (+12 more)

### Community 19 - "CalendarModal.tsx"
Cohesion: 0.38
Nodes (6): buildMonthDays(), CalendarModal(), getMonthStart(), Props, styles, WEEKDAYS

### Community 20 - "qa_runner.py"
Cohesion: 0.14
Nodes (13): Namespace, Path, Any, Reporting helpers for test execution results., Render terminal summary and persist machine-readable reports., Print user-friendly report to stdout., Write a JSON report and return its path., ReportWriter (+5 more)

### Community 21 - "ApiClient"
Cohesion: 0.14
Nodes (12): ApiClient, Any, HTTP client utilities for executing API test cases., Parse JSON response when possible without raising., Sleep using exponential backoff., Executes HTTP requests with retry and timing support., Close the underlying requests session., Execute one test case and return a populated result. (+4 more)

### Community 22 - "AppIcon.tsx"
Cohesion: 0.31
Nodes (8): AppIcon(), AppIconLibrary, AppIconProps, styles, getSvgMarkup(), getWebIconSvgDataUri(), hasWebSvgFallback(), LOCAL_ICON_NAMES

### Community 23 - "TestResult"
Cohesion: 0.18
Nodes (8): AI and heuristic quality-control analysis for API test results., Analyze result quality with Ollama and rule-based checks., Close underlying HTTP session., Return human-readable quality notes for this result. Rule-based insights are…, ResponseAnalyzer, Stores execution data and findings for one test case., A test passes when there are no error-level issues., TestResult

### Community 24 - "ResponseValidator"
Cohesion: 0.22
Nodes (5): Any, Applies status, schema, and consistency checks., Run all checks and append issues to the result., Resolve a dotted path in a nested JSON-like payload. Supports indexes like…, ResponseValidator

### Community 25 - "main"
Cohesion: 0.29
Nodes (7): startExploreSessionCleanup(), corsMiddleware(), fetchExchangeRates(), main(), startExchangeRateRefresh(), startSearchSessionCleanup(), net/http.Handler

### Community 26 - "searchStore.ts"
Cohesion: 0.25
Nodes (10): FiltersPanelProps, FlightDetailsModalProps, FlightResultCardProps, PositioningLegResult, defaultFilters, SearchFilters, SearchState, FlightOption (+2 more)

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.32
Nodes (13): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+5 more)

### Community 29 - "dealsCache.ts"
Cohesion: 0.53
Nodes (5): clearPendingDealsParams(), DealsParams, getPendingDealsParams(), getStorage(), setPendingDealsParams()

### Community 30 - "time.Time"
Cohesion: 0.07
Nodes (52): airportCoord, exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut(), getAirportCoord() (+44 more)

### Community 31 - "backend_api_contracts.md"
Cohesion: 0.17
Nodes (11): 1.1 Create Search Session, 1.2 Get Search Session Status & Results, 1.3 Cancel Search Session (Optional, MVP+), 1. Flight Search Sessions, 2.1 Get Monthly Deals, 2. Monthly Deals API, 3.1 Search Airports & Cities, 3. Airport & City Autocomplete (+3 more)

### Community 32 - "testing.T"
Cohesion: 0.06
Nodes (67): FlightOption, openJawOption(), TestBookingLinkModeDefaultsToGoogle(), TestBookingRouteFromSessionOption_splitOmitsReturn(), TestBuildGoogleFlightsFallbackFromParams(), TestBuildOneWayLegBookingURL(), TestBuildSkyscannerPrefillURL_oneWay(), TestBuildSkyscannerPrefillURL_roundTrip() (+59 more)

### Community 33 - "SortBar.tsx"
Cohesion: 0.33
Nodes (6): ICONS, KEYS, s, SortBarProps, SortOption, SortField

### Community 34 - "api.ts"
Cohesion: 0.14
Nodes (13): AirportCityType, AirportLike, BaggageClass, Carrier, ExplorePriceSource, ExtraSearchLeg, FareBreakdown, FlightLeg (+5 more)

### Community 35 - "ValidationIssue"
Cohesion: 0.18
Nodes (7): Any, Serialize nested result for report output., Represents a single validation or analysis finding., Serialize issue to dictionary., Serialize case to dictionary., Append a new issue to this result., ValidationIssue

### Community 36 - "Backend QA Automation Tool"
Cohesion: 0.18
Nodes (10): Backend QA Automation Tool, Features, If the run feels slow or “stuck”, Notes, Optional AI Setup (Ollama), Output, Project Structure, Run (+2 more)

### Community 41 - "models.py"
Cohesion: 0.25
Nodes (5): Core data models for the API QA runner., Set completion timestamp., Return an ISO-8601 UTC timestamp., utc_now_iso(), Validation rules for API responses.

### Community 42 - "Registry"
Cohesion: 0.25
Nodes (5): NewRegistryFromEnv(), parseProviderNames(), MultiSearchResult, Provider, Registry

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "write-spa-fallbacks.mjs"
Cohesion: 0.33
Nodes (5): __dirname, dist, indexHtml, indexPath, SPA_ROUTES

### Community 54 - "DatePickerCalendar.tsx"
Cohesion: 0.33
Nodes (8): getDealsRange(), DatePickerCalendar(), DatePickerCalendarProps, getNext14Dates(), getRangeStartEnd(), styles, WEEKDAYS, DayDeal

### Community 55 - "SearchFormScreen.tsx"
Cohesion: 0.15
Nodes (21): PHRASES_EN, PHRASES_HE, PHRASES_RU, Props, s, SearchLoadingOverlay(), defaultParams, SearchFormScreen() (+13 more)

### Community 56 - "useLocale"
Cohesion: 0.15
Nodes (20): useLocale(), CheaperCitiesOption, CheaperCitiesSection(), Props, s, f, FiltersPanel(), CABIN_OPTIONS (+12 more)

### Community 59 - "ThemeContext.tsx"
Cohesion: 0.14
Nodes (14): buildMonthDays(), DateRangePicker(), DateRangePickerProps, getMonthStart(), styles, WEEKDAYS, ACCENT, darkTheme (+6 more)

### Community 61 - "SearchSession"
Cohesion: 0.50
Nodes (4): SearchSession, SearchSessionResultsResponse, SearchSessionStatus, loadSearchSession()

## Knowledge Gaps
- **251 isolated node(s):** `ClicksByProvider`, `exploreLiveCandidate`, `flightcaptainweb`, `Provider`, `MultiSearchResult` (+246 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ProviderResult` connect `googleflights2_provider.go` to `testing.T`, `handleCreateSession`, `kiwi_apify_provider.go`, `time.Time`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `GoogleFlights2Provider` connect `time.Time` to `googleflights2_provider.go`, `Registry`, `kiwi_apify_provider.go`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `TestResult` (e.g. with `ResponseAnalyzer` and `ApiClient`) actually correct?**
  _`TestResult` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `ClicksByProvider`, `exploreLiveCandidate`, `flightcaptainweb` to the rest of the system?**
  _251 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `googleflights2_provider.go` be split into smaller, more focused modules?**
  _Cohesion score 0.07924984875983061 - nodes in this community are weakly interconnected._
- **Should `types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07965860597439545 - nodes in this community are weakly interconnected._
- **Should `FlightDetailsModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0671602326811211 - nodes in this community are weakly interconnected._