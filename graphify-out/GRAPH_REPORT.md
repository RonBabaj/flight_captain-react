# Graph Report - workspace  (2026-07-26)

## Corpus Check
- 124 files · ~138,973 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 988 nodes · 2105 edges · 59 communities (52 shown, 7 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 95 edges (avg confidence: 0.78)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `174f96b5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- googleflights2_provider.go
- LocaleContext.tsx
- FlightDetailsModal.tsx
- Issue
- GoogleFlights2Provider
- MonthDealsScreen.tsx
- dependencies
- server.go
- Features
- affiliate.go
- exploreBuildRowsAndQueue
- AppIcon.tsx
- ResultsScreen.tsx
- compilerOptions
- handleCreateSession
- AirportAutocomplete.tsx
- canonical.go
- ExploreScreen.tsx
- store/index.ts
- useLocale
- qa_runner.py
- ApiClient
- SearchFormScreen.tsx
- TestResult
- ResponseValidator
- client.ts
- ThemeContext.tsx
- expo
- config_loader.py
- api/index.ts
- api.ts
- backend_api_contracts.md
- computeOutboundSummary
- ResponseWriter
- affiliate.ts
- ValidationIssue
- Backend QA Automation Tool
- search.ts
- TestExtractCarrierCodes
- TestApplySoftStrictBaggage
- DatePickerCalendar.tsx
- models.py
- main
- Fly-Fix – Frontend
- write-spa-fallbacks.mjs
- explore.ts
- metro.config.js
- __init__.py
- flightcaptainweb
- scripts
- package.json
- @expo/metro-runtime
- expo-status-bar
- react-native
- @react-navigation/native

## God Nodes (most connected - your core abstractions)
1. `useLocale()` - 36 edges
2. `useTheme()` - 35 edges
3. `TestResult` - 29 edges
4. `MonthDealsScreen()` - 28 edges
5. `handleCreateSession()` - 22 edges
6. `ExploreScreen()` - 19 edges
7. `FlightOption` - 18 edges
8. `GoogleFlights2Provider` - 17 edges
9. `ResultsScreen()` - 17 edges
10. `ResponseValidator` - 17 edges

## Surprising Connections (you probably didn't know these)
- `handleAffiliateOutboundLink()` --calls--> `ResolveProvider()`  [INFERRED]
  backend/server.go → backend/affiliate.go
- `handleAffiliateProvider()` --calls--> `ResolveProvider()`  [INFERRED]
  backend/server.go → backend/affiliate.go
- `handleAffiliateRedirect()` --calls--> `ResolveProvider()`  [INFERRED]
  backend/server.go → backend/affiliate.go
- `handleAffiliateOutboundLink()` --calls--> `BuildRedirectURL()`  [INFERRED]
  backend/server.go → backend/affiliate.go
- `handleAffiliateRedirect()` --calls--> `BuildRedirectURL()`  [INFERRED]
  backend/server.go → backend/affiliate.go

## Import Cycles
- None detected.

## Communities (59 total, 7 thin omitted)

### Community 0 - "googleflights2_provider.go"
Cohesion: 0.10
Nodes (42): T, TestExtractGF2Leg_SingleSegment_DepartArriveDiffer(), TestExtractGF2Leg_TimeOnly_NoDateHint(), TestExtractGF2Leg_TimeOnly_WithDateHint(), TestParseGF2Time_AcceptsFullDateTime(), TestParseGF2Time_RejectsTimeOnly(), buildGF2ResultFromItinerary(), extractGF2DurationMinutes() (+34 more)

### Community 1 - "LocaleContext.tsx"
Cohesion: 0.08
Nodes (19): ErrorBoundary, Props, s, State, LandingScreen(), Nav, styles, MonthDealsStack() (+11 more)

### Community 2 - "FlightDetailsModal.tsx"
Cohesion: 0.09
Nodes (38): App(), linking, RTLWrapper(), getUniformBookingRedirectUrl(), DisplayPrice(), DisplayPriceProps, AIRLINE_NAMES, getAirlineName() (+30 more)

### Community 3 - "Issue"
Cohesion: 0.08
Nodes (40): Context, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+32 more)

### Community 4 - "GoogleFlights2Provider"
Cohesion: 0.07
Nodes (51): airportCoord, exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut(), Time (+43 more)

### Community 5 - "MonthDealsScreen.tsx"
Cohesion: 0.13
Nodes (20): dealBestScore(), DEALS_LOADING_PHRASES, dlb, esm, fl, fmtDur(), hfm, HUB_AIRPORTS (+12 more)

### Community 6 - "dependencies"
Cohesion: 0.12
Nodes (17): expo, dependencies, expo, react-dom, react-native-safe-area-context, react-native-screens, react-native-web, @react-navigation/bottom-tabs (+9 more)

### Community 7 - "server.go"
Cohesion: 0.09
Nodes (37): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, Carrier, DayDeal, startExploreSessionCleanup(), FareBreakdown (+29 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (32): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+24 more)

### Community 9 - "affiliate.go"
Cohesion: 0.15
Nodes (21): BuildRedirectURL(), getAffiliateID(), GetClicksSummary(), getOTAProvider(), GetSessionAndOption(), FlightOption, SearchSession, Time (+13 more)

### Community 10 - "exploreBuildRowsAndQueue"
Cohesion: 0.19
Nodes (16): getStorage(), languageToLocale(), loadSaved(), LocaleContext, LocaleProvider(), save(), VALID_CURRENCIES, CURRENCIES (+8 more)

### Community 11 - "AppIcon.tsx"
Cohesion: 0.18
Nodes (14): AppIcon(), AppIconLibrary, AppIconProps, styles, getSvgMarkup(), getWebIconSvgDataUri(), hasWebSvgFallback(), LOCAL_ICON_NAMES (+6 more)

### Community 12 - "ResultsScreen.tsx"
Cohesion: 0.13
Nodes (20): createSearchSession(), getSearchSessionResults(), LocaleContextValue, bestScore(), CheapestOption, defaultFormParams, delay(), findCheapestOptionForParams() (+12 more)

### Community 13 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+15 more)

### Community 14 - "handleCreateSession"
Cohesion: 0.17
Nodes (13): CreateSearchSessionRequest, FlightOption, applyPriceNormalization(), applySoftStrictBaggageOptions(), baggageOrderString(), classifyFlightOptionBaggage(), convertOptionsToCurrency(), convertPrice() (+5 more)

### Community 15 - "AirportAutocomplete.tsx"
Cohesion: 0.22
Nodes (16): AIRPORT_DICTIONARY, getAirportDisplayName(), getAirportEntry(), getAirportNameByCode(), getCityDisplayName(), lower(), matchesQuery(), rankResult() (+8 more)

### Community 16 - "canonical.go"
Cohesion: 0.23
Nodes (14): buildGoogleFlightsPrefillURL(), BuildSkyscannerFallbackFromParams(), buildSkyscannerPrefillURL(), BuildUniformBookingLink(), CanonicalFingerprint(), CodeshareFingerprint(), depToYYMMDD(), FlightOption (+6 more)

### Community 17 - "ExploreScreen.tsx"
Cohesion: 0.15
Nodes (24): c, countryFlag(), d, DestCard(), DestCardProps, ExploreScreen(), ExploreScreenProps, fmtDate() (+16 more)

### Community 18 - "store/index.ts"
Cohesion: 0.24
Nodes (11): f, FiltersPanelProps, FlightDetailsModalProps, FlightResultCardProps, PositioningLegResult, defaultFilters, SearchFilters, SearchState (+3 more)

### Community 19 - "useLocale"
Cohesion: 0.17
Nodes (19): SearchLoadingOverlay(), useLocale(), CheaperCitiesSection(), Props, s, FiltersPanel(), CABIN_OPTIONS, PassengerCabinPicker() (+11 more)

### Community 20 - "qa_runner.py"
Cohesion: 0.14
Nodes (13): Namespace, Path, Any, Reporting helpers for test execution results., Render terminal summary and persist machine-readable reports., Print user-friendly report to stdout., Write a JSON report and return its path., ReportWriter (+5 more)

### Community 21 - "ApiClient"
Cohesion: 0.14
Nodes (12): ApiClient, Any, HTTP client utilities for executing API test cases., Parse JSON response when possible without raising., Sleep using exponential backoff., Executes HTTP requests with retry and timing support., Close the underlying requests session., Execute one test case and return a populated result. (+4 more)

### Community 22 - "SearchFormScreen.tsx"
Cohesion: 0.26
Nodes (13): defaultParams, SearchFormScreen(), styles, buildSearchString(), getParam(), getParams(), isWeb(), parseSearchParamsFromUrl() (+5 more)

### Community 23 - "TestResult"
Cohesion: 0.18
Nodes (8): AI and heuristic quality-control analysis for API test results., Analyze result quality with Ollama and rule-based checks., Close underlying HTTP session., Return human-readable quality notes for this result.          Rule-based insight, ResponseAnalyzer, Stores execution data and findings for one test case., A test passes when there are no error-level issues., TestResult

### Community 24 - "ResponseValidator"
Cohesion: 0.22
Nodes (5): Any, Applies status, schema, and consistency checks., Run all checks and append issues to the result., Resolve a dotted path in a nested JSON-like payload.          Supports indexes l, ResponseValidator

### Community 25 - "client.ts"
Cohesion: 0.05
Nodes (53): AffiliateProvider, AffiliateProviderResponse, BookingRedirectParams, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink() (+45 more)

### Community 26 - "ThemeContext.tsx"
Cohesion: 0.13
Nodes (13): PHRASES_EN, PHRASES_HE, PHRASES_RU, Props, s, ACCENT, darkTheme, lightTheme (+5 more)

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.32
Nodes (13): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+5 more)

### Community 29 - "api/index.ts"
Cohesion: 0.22
Nodes (17): buildDealMessage(), buildDetailedItinerary(), displayFlightPage(), formatDateAndTime(), formatDuration(), getItinerarySummary(), getItinerarySummaryAt(), Request (+9 more)

### Community 30 - "api.ts"
Cohesion: 0.13
Nodes (14): CheaperCitiesOption, AirportCityType, AirportLike, BaggageClass, Carrier, ExplorePriceSource, FareBreakdown, FlightLeg (+6 more)

### Community 31 - "backend_api_contracts.md"
Cohesion: 0.17
Nodes (11): 1.1 Create Search Session, 1.2 Get Search Session Status & Results, 1.3 Cancel Search Session (Optional, MVP+), 1. Flight Search Sessions, 2.1 Get Monthly Deals, 2. Monthly Deals API, 3.1 Search Airports & Cities, 3. Airport & City Autocomplete (+3 more)

### Community 32 - "computeOutboundSummary"
Cohesion: 0.21
Nodes (16): FlightLeg, computeOutboundSummary(), computeTotalDurationFromLegs(), ensurePrimaryCarrier(), extractDealMetaFromLeg(), T, TestComputeOutboundSummary_Direct(), TestComputeOutboundSummary_OneStop() (+8 more)

### Community 33 - "ResponseWriter"
Cohesion: 0.44
Nodes (13): Request, ResponseWriter, handleAffiliateClicksSummary(), handleAffiliateOutboundLink(), handleAffiliateProvider(), handleAffiliateRedirect(), handleAirportSearch(), handleFlightDetails() (+5 more)

### Community 34 - "affiliate.ts"
Cohesion: 0.26
Nodes (10): clampDealsMonth(), dealsActions, DealsSortField, DealsState, getMinimumAllowedDealsYearMonth(), now, useDealsStore, searchActions (+2 more)

### Community 35 - "ValidationIssue"
Cohesion: 0.18
Nodes (7): Any, Serialize nested result for report output., Represents a single validation or analysis finding., Serialize issue to dictionary., Serialize case to dictionary., Append a new issue to this result., ValidationIssue

### Community 36 - "Backend QA Automation Tool"
Cohesion: 0.18
Nodes (10): Backend QA Automation Tool, Features, If the run feels slow or “stuck”, Notes, Optional AI Setup (Ollama), Output, Project Structure, Run (+2 more)

### Community 37 - "search.ts"
Cohesion: 0.27
Nodes (10): buildDealsPositioningSignature(), formatDealDate(), MonthDealsScreen(), parseDealYmdToUTCDate(), toYmdUTC(), clearPendingDealsParams(), DealsParams, getPendingDealsParams() (+2 more)

### Community 38 - "TestExtractCarrierCodes"
Cohesion: 0.39
Nodes (7): CarrierCodes, T, makeOfferWithCarriers(), TestExtractCarrierCodes(), TestPrimaryDisplayCarrier(), ExtractCarrierCodes(), PrimaryDisplayCarrier()

### Community 39 - "TestApplySoftStrictBaggage"
Cohesion: 0.46
Nodes (7): applySoftStrictBaggage(), T, makeOfferWithBags(), makeOfferWithMissingBags(), TestApplySoftStrictBaggage(), TestClassifyOfferBaggage(), classifyOfferBaggage()

### Community 40 - "DatePickerCalendar.tsx"
Cohesion: 0.28
Nodes (8): react, buildMonthDays(), CalendarModal(), getMonthStart(), Props, styles, WEEKDAYS, react

### Community 41 - "models.py"
Cohesion: 0.25
Nodes (5): Core data models for the API QA runner., Set completion timestamp., Return an ISO-8601 UTC timestamp., utc_now_iso(), Validation rules for API responses.

### Community 42 - "main"
Cohesion: 0.29
Nodes (7): @babel/core, devDependencies, @babel/core, @types/react, typescript, @types/react, typescript

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "write-spa-fallbacks.mjs"
Cohesion: 0.33
Nodes (5): __dirname, dist, indexHtml, indexPath, SPA_ROUTES

### Community 45 - "explore.ts"
Cohesion: 0.33
Nodes (6): ICONS, KEYS, s, SortBarProps, SortOption, SortField

### Community 53 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, android, build, ios, start, web

### Community 54 - "package.json"
Cohesion: 0.40
Nodes (4): main, name, private, version

## Knowledge Gaps
- **236 isolated node(s):** `Overview`, `Graphify (codebase knowledge graph)`, `Landing (home)`, `Flight Search`, `Flight Result Cards` (+231 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `DateRangePicker()` connect `AppIcon.tsx` to `DatePickerCalendar.tsx`, `ExploreScreen.tsx`, `useLocale`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Why does `react` connect `DatePickerCalendar.tsx` to `AppIcon.tsx`, `dependencies`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `DatePickerCalendar.tsx`, `package.json`, `@expo/metro-runtime`, `expo-status-bar`, `react-native`, `@react-navigation/native`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `TestResult` (e.g. with `ResponseAnalyzer` and `ApiClient`) actually correct?**
  _`TestResult` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Overview`, `Graphify (codebase knowledge graph)`, `Landing (home)` to the rest of the system?**
  _236 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `googleflights2_provider.go` be split into smaller, more focused modules?**
  _Cohesion score 0.09796806966618288 - nodes in this community are weakly interconnected._
- **Should `LocaleContext.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08412698412698413 - nodes in this community are weakly interconnected._