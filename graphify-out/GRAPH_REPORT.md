# Graph Report - workspace  (2026-08-08)

## Corpus Check
- 128 files · ~144,245 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1070 nodes · 2296 edges · 66 communities (60 shown, 6 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 111 edges (avg confidence: 0.79)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9fcb55a0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- googleflights2_provider.go
- App.tsx
- FlightDetailsModal.tsx
- Issue
- GoogleFlights2Provider
- MonthDealsScreen.tsx
- dependencies
- server.go
- Features
- affiliate.go
- ProviderResult
- AppIcon.tsx
- ResultsScreen.tsx
- compilerOptions
- LocaleContext.tsx
- ExploreScreen.tsx
- canonical.go
- explore.ts
- handleCreateSession
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
- main.go
- KiwiApifyProvider
- backend_api_contracts.md
- providerResultsToFlightOptions
- kiwi_apify_provider.go
- api.ts
- ValidationIssue
- Backend QA Automation Tool
- Registry
- store/index.ts
- TestApplySoftStrictBaggage
- CalendarModal.tsx
- models.py
- devDependencies
- Fly-Fix – Frontend
- write-spa-fallbacks.mjs
- search.ts
- metro.config.js
- __init__.py
- flightcaptainweb
- package.json
- FlightOption
- affiliate.ts
- dedupe.go
- multi_provider_test.go
- @react-navigation/native
- handleFlyFixRefineIssues
- MultiSearchResult
- TestExtractCarrierCodes
- flyfix.ts
- DatePickerCalendar.tsx
- DateRangePicker.tsx
- react-native-safe-area-context

## God Nodes (most connected - your core abstractions)
1. `useLocale()` - 36 edges
2. `useTheme()` - 35 edges
3. `ProviderResult` - 31 edges
4. `TestResult` - 29 edges
5. `MonthDealsScreen()` - 28 edges
6. `handleCreateSession()` - 23 edges
7. `FlightOption` - 19 edges
8. `ExploreScreen()` - 19 edges
9. `GoogleFlights2Provider` - 18 edges
10. `ResultsScreen()` - 17 edges

## Surprising Connections (you probably didn't know these)
- `RecordClick()` --calls--> `randomID()`  [INFERRED]
  backend/affiliate.go → backend/server.go
- `TestGetSessionAndOption_MissingOption()` --calls--> `GetSessionAndOption()`  [INFERRED]
  backend/server_review_test.go → backend/affiliate.go
- `providerResultsToFlightOptions()` --calls--> `normalizeProviderBookingURL()`  [INFERRED]
  backend/server.go → backend/canonical.go
- `handleOutBooking()` --calls--> `BuildUniformBookingLink()`  [INFERRED]
  backend/server.go → backend/canonical.go
- `handleOutBooking()` --calls--> `BuildSkyscannerFallbackFromParams()`  [INFERRED]
  backend/server.go → backend/canonical.go

## Import Cycles
- None detected.

## Communities (66 total, 6 thin omitted)

### Community 0 - "googleflights2_provider.go"
Cohesion: 0.13
Nodes (33): T, TestExtractGF2Leg_SingleSegment_DepartArriveDiffer(), TestExtractGF2Leg_TimeOnly_NoDateHint(), TestExtractGF2Leg_TimeOnly_WithDateHint(), TestParseGF2Time_AcceptsFullDateTime(), TestParseGF2Time_RejectsTimeOnly(), buildGF2ResultFromItinerary(), extractGF2DurationMinutes() (+25 more)

### Community 1 - "App.tsx"
Cohesion: 0.07
Nodes (24): App(), RTLWrapper(), API_BASE, ErrorBoundary, Props, s, State, ExploreScreenProps (+16 more)

### Community 2 - "FlightDetailsModal.tsx"
Cohesion: 0.11
Nodes (32): getUniformBookingRedirectUrl(), DisplayPrice(), DisplayPriceProps, AIRLINE_NAMES, getAirlineName(), AIRLINE_FULL_NAMES, NOTE: This is a starter subset of IATA airlines., cabinLabel() (+24 more)

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (32): Context, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+24 more)

### Community 4 - "GoogleFlights2Provider"
Cohesion: 0.06
Nodes (53): airportCoord, exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut(), Time (+45 more)

### Community 5 - "MonthDealsScreen.tsx"
Cohesion: 0.08
Nodes (46): buildDealsPositioningSignature(), dealBestScore(), DEALS_LOADING_PHRASES, dlb, esm, findCheapestFlightForDate(), fl, fmtDur() (+38 more)

### Community 6 - "dependencies"
Cohesion: 0.10
Nodes (21): expo, @expo/metro-runtime, expo-status-bar, dependencies, expo, @expo/metro-runtime, expo-status-bar, react-dom (+13 more)

### Community 7 - "server.go"
Cohesion: 0.11
Nodes (32): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, Carrier, DayDeal, startExploreSessionCleanup(), FareBreakdown (+24 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (33): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+25 more)

### Community 9 - "affiliate.go"
Cohesion: 0.14
Nodes (33): BuildRedirectURL(), getAffiliateID(), GetClicksSummary(), getOTAProvider(), GetSessionAndOption(), FlightOption, SearchSession, Time (+25 more)

### Community 10 - "ProviderResult"
Cohesion: 0.20
Nodes (11): Context, truncateGF2(), Context, MultiSearchResult, Layover, Monetary, Provider, ProviderResult (+3 more)

### Community 11 - "AppIcon.tsx"
Cohesion: 0.33
Nodes (8): AppIcon(), AppIconLibrary, AppIconProps, styles, getSvgMarkup(), getWebIconSvgDataUri(), hasWebSvgFallback(), LOCAL_ICON_NAMES

### Community 12 - "ResultsScreen.tsx"
Cohesion: 0.12
Nodes (20): linking, createSearchSession(), CheaperCitiesOption, CheaperCitiesSection(), Props, s, bestScore(), CheapestOption (+12 more)

### Community 13 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+15 more)

### Community 14 - "LocaleContext.tsx"
Cohesion: 0.15
Nodes (19): getStorage(), languageToLocale(), loadSaved(), LocaleContext, LocaleContextValue, LocaleProvider(), save(), VALID_CURRENCIES (+11 more)

### Community 15 - "ExploreScreen.tsx"
Cohesion: 0.11
Nodes (34): getExploreDestinations(), AIRPORT_DICTIONARY, getAirportDisplayName(), getAirportEntry(), getAirportNameByCode(), getCityDisplayName(), lower(), matchesQuery() (+26 more)

### Community 16 - "canonical.go"
Cohesion: 0.23
Nodes (14): buildGoogleFlightsPrefillURL(), BuildSkyscannerFallbackFromParams(), buildSkyscannerPrefillURL(), BuildUniformBookingLink(), CanonicalFingerprint(), CodeshareFingerprint(), depToYYMMDD(), FlightOption (+6 more)

### Community 17 - "explore.ts"
Cohesion: 0.50
Nodes (4): ExploreResponse, GetExploreDestinationsParams, DestCardProps, ExploreDestination

### Community 18 - "handleCreateSession"
Cohesion: 0.25
Nodes (6): CreateSearchSessionRequest, baggageOrderString(), convertOptionsToCurrency(), convertPrice(), handleCreateSession(), randomID()

### Community 19 - "useLocale"
Cohesion: 0.15
Nodes (17): PHRASES_EN, PHRASES_HE, PHRASES_RU, Props, s, SearchLoadingOverlay(), useLocale(), CABIN_OPTIONS (+9 more)

### Community 20 - "qa_runner.py"
Cohesion: 0.14
Nodes (13): Namespace, Path, Any, Reporting helpers for test execution results., Render terminal summary and persist machine-readable reports., Print user-friendly report to stdout., Write a JSON report and return its path., ReportWriter (+5 more)

### Community 21 - "ApiClient"
Cohesion: 0.14
Nodes (12): ApiClient, Any, HTTP client utilities for executing API test cases., Parse JSON response when possible without raising., Sleep using exponential backoff., Executes HTTP requests with retry and timing support., Close the underlying requests session., Execute one test case and return a populated result. (+4 more)

### Community 22 - "SearchFormScreen.tsx"
Cohesion: 0.25
Nodes (14): defaultParams, SearchFormScreen(), styles, buildSearchString(), getParam(), getParams(), isWeb(), parseSearchParamsFromUrl() (+6 more)

### Community 23 - "TestResult"
Cohesion: 0.18
Nodes (8): AI and heuristic quality-control analysis for API test results., Analyze result quality with Ollama and rule-based checks., Close underlying HTTP session., Return human-readable quality notes for this result. Rule-based insights are…, ResponseAnalyzer, Stores execution data and findings for one test case., A test passes when there are no error-level issues., TestResult

### Community 24 - "ResponseValidator"
Cohesion: 0.22
Nodes (5): Any, Applies status, schema, and consistency checks., Run all checks and append issues to the result., Resolve a dotted path in a nested JSON-like payload. Supports indexes like…, ResponseValidator

### Community 25 - "client.ts"
Cohesion: 0.18
Nodes (14): searchAirports(), apiGet(), apiRequest(), apiUrl(), isLocalHostname(), IMPORTANT: Expo/Metro statically inlines EXPO_PUBLIC_* only when accessed via, resolveApiBase(), GetDealsRangeParams (+6 more)

### Community 26 - "ThemeContext.tsx"
Cohesion: 0.14
Nodes (12): LandingScreen(), Nav, styles, RootStackParamList, ACCENT, darkTheme, lightTheme, RADIUS (+4 more)

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.32
Nodes (13): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+5 more)

### Community 29 - "main.go"
Cohesion: 0.22
Nodes (17): buildDealMessage(), buildDetailedItinerary(), displayFlightPage(), formatDateAndTime(), formatDuration(), getItinerarySummary(), getItinerarySummaryAt(), Request (+9 more)

### Community 30 - "KiwiApifyProvider"
Cohesion: 0.18
Nodes (9): flattenKiwiItems(), Client, Context, RWMutex, NewKiwiApifyProvider(), stringField(), truncateStr(), KiwiApifyProvider (+1 more)

### Community 31 - "backend_api_contracts.md"
Cohesion: 0.17
Nodes (11): 1.1 Create Search Session, 1.2 Get Search Session Status & Results, 1.3 Cancel Search Session (Optional, MVP+), 1. Flight Search Sessions, 2.1 Get Monthly Deals, 2. Monthly Deals API, 3.1 Search Airports & Cities, 3. Airport & City Autocomplete (+3 more)

### Community 32 - "providerResultsToFlightOptions"
Cohesion: 0.19
Nodes (18): applyPriceNormalization(), computeOutboundSummary(), computeTotalDurationFromLegs(), ensurePrimaryCarrier(), T, TestApplyPriceNormalizationDefaultNoChange(), TestComputeOutboundSummary_Direct(), TestComputeOutboundSummary_OneStop() (+10 more)

### Community 33 - "kiwi_apify_provider.go"
Cohesion: 0.27
Nodes (17): asArray(), collectCarriers(), detectSelfTransfer(), extractKiwiLegs(), firstFloat(), firstString(), Time, kiwiSegmentFromMap() (+9 more)

### Community 34 - "api.ts"
Cohesion: 0.14
Nodes (14): SearchState, AirportCityType, AirportLike, BaggageClass, Carrier, ExplorePriceSource, FareBreakdown, FlightLeg (+6 more)

### Community 35 - "ValidationIssue"
Cohesion: 0.18
Nodes (7): Any, Serialize nested result for report output., Represents a single validation or analysis finding., Serialize issue to dictionary., Serialize case to dictionary., Append a new issue to this result., ValidationIssue

### Community 36 - "Backend QA Automation Tool"
Cohesion: 0.18
Nodes (10): Backend QA Automation Tool, Features, If the run feels slow or “stuck”, Notes, Optional AI Setup (Ollama), Output, Project Structure, Run (+2 more)

### Community 37 - "Registry"
Cohesion: 0.23
Nodes (6): Context, NewRegistryFromEnv(), parseProviderNames(), MultiSearchResult, Provider, Registry

### Community 38 - "store/index.ts"
Cohesion: 0.14
Nodes (18): f, FiltersPanel(), FiltersPanelProps, FlightDetailsModalProps, FlightResultCardProps, ICONS, KEYS, s (+10 more)

### Community 39 - "TestApplySoftStrictBaggage"
Cohesion: 0.46
Nodes (7): applySoftStrictBaggage(), T, makeOfferWithBags(), makeOfferWithMissingBags(), TestApplySoftStrictBaggage(), TestClassifyOfferBaggage(), classifyOfferBaggage()

### Community 40 - "CalendarModal.tsx"
Cohesion: 0.38
Nodes (6): buildMonthDays(), CalendarModal(), getMonthStart(), Props, styles, WEEKDAYS

### Community 41 - "models.py"
Cohesion: 0.25
Nodes (5): Core data models for the API QA runner., Set completion timestamp., Return an ISO-8601 UTC timestamp., utc_now_iso(), Validation rules for API responses.

### Community 42 - "devDependencies"
Cohesion: 0.29
Nodes (7): @babel/core, devDependencies, @babel/core, @types/react, typescript, @types/react, typescript

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "write-spa-fallbacks.mjs"
Cohesion: 0.33
Nodes (5): __dirname, dist, indexHtml, indexPath, SPA_ROUTES

### Community 45 - "search.ts"
Cohesion: 0.36
Nodes (9): CachedResult, fetchFresh(), getFromStorage(), getSearchSessionResults(), getStorage(), paramsMatch(), resultsCache, setToStorage() (+1 more)

### Community 53 - "package.json"
Cohesion: 0.18
Nodes (10): main, name, private, scripts, android, build, ios, start (+2 more)

### Community 54 - "FlightOption"
Cohesion: 0.21
Nodes (13): FlightOption, LayoverSummary, monthDealsCacheEntry, OutboundSummary, SearchSession, SearchSessionResultsResponse, SearchSessionStatus, applySoftStrictBaggageOptions() (+5 more)

### Community 55 - "affiliate.ts"
Cohesion: 0.24
Nodes (10): AffiliateProvider, AffiliateProviderResponse, BookingRedirectParams, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink() (+2 more)

### Community 56 - "dedupe.go"
Cohesion: 0.33
Nodes (9): DedupeProviderResults(), Time, ItineraryFingerprint(), maxInt(), mergeSelfTransfer(), normalizeFlightNumber(), roundTimeKey(), TotalStops() (+1 more)

### Community 57 - "multi_provider_test.go"
Cohesion: 0.36
Nodes (9): parseKiwiApifyItems(), T, TestDedupeKeepsCheaper(), TestDetectSelfTransfer(), TestItineraryFingerprintStable(), TestKiwiApifyTimeout(), TestParseKiwiApifyItemsSolidcodeShape(), TestParseKiwiEmptyAndInvalid() (+1 more)

### Community 59 - "handleFlyFixRefineIssues"
Cohesion: 0.27
Nodes (9): Request, ResponseWriter, handleFlyFixRefineIssues(), T, TestGetSessionAndOption_MissingOption(), TestHandleFlyFixRefineIssues_Smoke(), TestLoadSearchSession_Expiry(), TestSegmentMatchesCabinClass() (+1 more)

### Community 61 - "TestExtractCarrierCodes"
Cohesion: 0.39
Nodes (7): CarrierCodes, T, makeOfferWithCarriers(), TestExtractCarrierCodes(), TestPrimaryDisplayCarrier(), ExtractCarrierCodes(), PrimaryDisplayCarrier()

### Community 62 - "flyfix.ts"
Cohesion: 0.25
Nodes (8): apiPost(), FlyfixInsightsGroup, FlyfixIssue, FlyfixRefinedReport, FlyfixSummary, refineIssues(), RefineIssuesRequestBody, cancelSearchSession()

### Community 63 - "DatePickerCalendar.tsx"
Cohesion: 0.33
Nodes (8): getDealsRange(), DatePickerCalendar(), DatePickerCalendarProps, getNext14Dates(), getRangeStartEnd(), styles, WEEKDAYS, DayDeal

### Community 64 - "DateRangePicker.tsx"
Cohesion: 0.28
Nodes (8): react, buildMonthDays(), DateRangePicker(), DateRangePickerProps, getMonthStart(), styles, WEEKDAYS, react

## Knowledge Gaps
- **238 isolated node(s):** `ClicksByProvider`, `exploreLiveCandidate`, `flightcaptainweb`, `Provider`, `MultiSearchResult` (+233 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `DateRangePicker.tsx` to `CalendarModal.tsx`, `dependencies`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `DateRangePicker()` connect `DateRangePicker.tsx` to `useLocale`, `ExploreScreen.tsx`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `DateRangePicker.tsx`, `react-native-safe-area-context`, `@react-navigation/native`, `package.json`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `TestResult` (e.g. with `ResponseAnalyzer` and `ApiClient`) actually correct?**
  _`TestResult` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `ClicksByProvider`, `exploreLiveCandidate`, `flightcaptainweb` to the rest of the system?**
  _238 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `googleflights2_provider.go` be split into smaller, more focused modules?**
  _Cohesion score 0.13229018492176386 - nodes in this community are weakly interconnected._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06951219512195123 - nodes in this community are weakly interconnected._