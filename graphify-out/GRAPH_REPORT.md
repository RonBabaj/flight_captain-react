# Graph Report - workspace  (2026-08-19)

## Corpus Check
- 138 files · ~154,256 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1140 nodes · 2620 edges · 64 communities (60 shown, 4 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 166 edges (avg confidence: 0.78)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `98396a80`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- googleflights2_provider.go
- types.ts
- FlightDetailsModal.tsx
- Issue
- providers.go
- MonthDealsScreen.tsx
- dependencies
- server.go
- Features
- affiliate.go
- ExploreScreen.tsx
- net/http.ResponseWriter
- ResultsScreen.tsx
- compilerOptions
- persistSearchSession
- types/index.ts
- LocaleContext.tsx
- flyfix.ts
- handleCreateSession
- time.Time
- qa_runner.py
- ApiClient
- AppIcon.tsx
- TestResult
- ResponseValidator
- main
- ProviderResult
- expo
- config_loader.py
- CheaperCitiesSection.tsx
- exploreBuildRowsAndQueue
- backend_api_contracts.md
- testing.T
- store/index.ts
- api.ts
- ValidationIssue
- Backend QA Automation Tool
- KiwiApifyProvider
- kiwi_apify_provider.go
- search.ts
- ErrorBoundary
- models.py
- dedupe.go
- Fly-Fix – Frontend
- write-spa-fallbacks.mjs
- affiliate.ts
- metro.config.js
- __init__.py
- flightcaptainweb
- App.tsx
- client.ts
- SearchFormScreen.tsx
- useTheme
- handleExplore
- CalendarModal.tsx
- useLocale
- MultiSearchResult
- SearchSession
- DatePickerCalendar.tsx
- explore.ts

## God Nodes (most connected - your core abstractions)
1. `useLocale()` - 38 edges
2. `useTheme()` - 37 edges
3. `ProviderResult` - 32 edges
4. `TestResult` - 29 edges
5. `MonthDealsScreen()` - 27 edges
6. `handleCreateSession()` - 24 edges
7. `GoogleFlights2Provider` - 21 edges
8. `ResultsScreen()` - 21 edges
9. `FlightOption` - 20 edges
10. `ExploreScreen()` - 20 edges

## Surprising Connections (you probably didn't know these)
- `handleAffiliateOutboundLink()` --calls--> `ResolveProvider()`  [INFERRED]
  backend/server.go → backend/affiliate.go
- `handleAffiliateProvider()` --calls--> `ResolveProvider()`  [INFERRED]
  backend/server.go → backend/affiliate.go
- `handleAffiliateRedirect()` --calls--> `ResolveProvider()`  [INFERRED]
  backend/server.go → backend/affiliate.go
- `handleOutBooking()` --calls--> `ResolveProvider()`  [INFERRED]
  backend/server.go → backend/affiliate.go
- `handleAffiliateClicksSummary()` --calls--> `GetClicksSummary()`  [INFERRED]
  backend/server.go → backend/affiliate.go

## Import Cycles
- None detected.

## Communities (64 total, 4 thin omitted)

### Community 0 - "googleflights2_provider.go"
Cohesion: 0.11
Nodes (38): TestExtractGF2BookingToken(), TestExtractGF2BookingURL(), TestExtractGF2PartnerBookingTokenPrefersPartnerURL(), TestFirstNonEmpty(), TestIsLikelyPartnerCheckoutURL(), TestExtractGF2Leg_SingleSegment_DepartArriveDiffer(), TestExtractGF2Leg_TimeOnly_NoDateHint(), TestExtractGF2Leg_TimeOnly_WithDateHint() (+30 more)

### Community 1 - "types.ts"
Cohesion: 0.14
Nodes (18): LandingScreen(), Nav, styles, DynamicDestinationsStack(), Stack, MonthDealsStack(), Stack, RootNavigator() (+10 more)

### Community 2 - "FlightDetailsModal.tsx"
Cohesion: 0.19
Nodes (22): getUniformBookingRedirectUrl(), cabinLabel(), FlightDetailsModal(), formatDuration(), layoverBetween(), legDuration(), s, safeDate() (+14 more)

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "providers.go"
Cohesion: 0.12
Nodes (24): TestCombineOneWayBatches(), TestCombineOneWayBatches_emptyBatch(), TestCompleteExtraLegs(), TestExtraLegsFingerprint(), TestHasExtraLegs(), TestIsOpenJaw(), TestResolveReturnAirports_classic(), TestResolveReturnAirports_openJaw() (+16 more)

### Community 5 - "MonthDealsScreen.tsx"
Cohesion: 0.10
Nodes (32): getFlightDetails(), buildDealsPositioningSignature(), dealBestScore(), DEALS_LOADING_PHRASES, dlb, esm, fl, fmtDur() (+24 more)

### Community 6 - "dependencies"
Cohesion: 0.04
Nodes (44): @babel/core, expo, @expo/metro-runtime, expo-status-bar, dependencies, expo, @expo/metro-runtime, expo-status-bar (+36 more)

### Community 7 - "server.go"
Cohesion: 0.12
Nodes (30): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, Carrier, CarrierCodes, DayDeal, FareBreakdown (+22 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (33): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+25 more)

### Community 9 - "affiliate.go"
Cohesion: 0.18
Nodes (15): BuildRedirectURL(), getAffiliateID(), GetClicksSummary(), getOTAProvider(), FlightOption, SearchSession, ParseOptionIndex(), ResolveProvider() (+7 more)

### Community 10 - "ExploreScreen.tsx"
Cohesion: 0.15
Nodes (25): getMonthDeals(), getExploreDestinations(), c, countryFlag(), d, DestCard(), ExploreScreen(), ExploreScreenProps (+17 more)

### Community 11 - "net/http.ResponseWriter"
Cohesion: 0.27
Nodes (20): GetSessionAndOption(), SearchSessionResultsResponse, RecordClick(), handleFlyFixRefineIssues(), handleAffiliateClicksSummary(), handleAffiliateOutboundLink(), handleAffiliateProvider(), handleAffiliateRedirect() (+12 more)

### Community 12 - "ResultsScreen.tsx"
Cohesion: 0.09
Nodes (30): createSearchSession(), getSearchSessionResults(), ExtraLeg, PHRASES_EN, PHRASES_HE, PHRASES_RU, Props, s (+22 more)

### Community 13 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+15 more)

### Community 14 - "persistSearchSession"
Cohesion: 0.26
Nodes (15): cleanupSessionDisk(), SearchSessionResultsResponse, loadSessionFromDisk(), persistSearchSession(), sessionDiskRetention(), sessionFilePath(), sessionStoreDir(), SearchSessionResultsResponse (+7 more)

### Community 15 - "types/index.ts"
Cohesion: 0.21
Nodes (16): AIRPORT_DICTIONARY, getAirportDisplayName(), getAirportEntry(), getAirportNameByCode(), getCityDisplayName(), lower(), matchesQuery(), rankResult() (+8 more)

### Community 16 - "LocaleContext.tsx"
Cohesion: 0.14
Nodes (20): getStorage(), languageToLocale(), loadSaved(), LocaleContext, LocaleContextValue, LocaleProvider(), save(), VALID_CURRENCIES (+12 more)

### Community 17 - "flyfix.ts"
Cohesion: 0.25
Nodes (8): apiPost(), FlyfixInsightsGroup, FlyfixIssue, FlyfixRefinedReport, FlyfixSummary, refineIssues(), RefineIssuesRequestBody, cancelSearchSession()

### Community 18 - "handleCreateSession"
Cohesion: 0.13
Nodes (21): CreateSearchSessionRequest, ExtraSearchLeg, FlightOption, LayoverSummary, OutboundSummary, applyPriceNormalization(), applySoftStrictBaggageOptions(), baggageOrderString() (+13 more)

### Community 19 - "time.Time"
Cohesion: 0.18
Nodes (25): mergeExplorePriceRows(), exploreDestRow, FullRoundTrip, attachReturnLegKeepPrice(), ensureRoundTripLegs(), exploreDestRowsToMaps(), exploreRunLiveBatch(), gf2ExploreResolveDeps() (+17 more)

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

### Community 26 - "ProviderResult"
Cohesion: 0.15
Nodes (11): GoogleFlights2Provider, newGF2Cache(), truncateGF2(), ProviderResult, net/http.Client, sync.RWMutex, gf2Cache, gf2CacheEntry (+3 more)

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.32
Nodes (13): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+5 more)

### Community 29 - "CheaperCitiesSection.tsx"
Cohesion: 0.19
Nodes (13): DisplayPrice(), DisplayPriceProps, CheaperCitiesOption, CheaperCitiesSection(), Props, s, MonetaryAmount, convertPrice() (+5 more)

### Community 30 - "exploreBuildRowsAndQueue"
Cohesion: 0.13
Nodes (17): airportCoord, exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut(), getAirportCoord() (+9 more)

### Community 31 - "backend_api_contracts.md"
Cohesion: 0.17
Nodes (11): 1.1 Create Search Session, 1.2 Get Search Session Status & Results, 1.3 Cancel Search Session (Optional, MVP+), 1. Flight Search Sessions, 2.1 Get Monthly Deals, 2. Monthly Deals API, 3.1 Search Airports & Cities, 3. Airport & City Autocomplete (+3 more)

### Community 32 - "testing.T"
Cohesion: 0.06
Nodes (64): FlightOption, openJawOption(), TestBookingLinkModeDefaultsToGoogle(), TestBookingRouteFromSessionOption_splitOmitsReturn(), TestBuildGoogleFlightsFallbackFromParams(), TestBuildOneWayLegBookingURL(), TestBuildSkyscannerPrefillURL_oneWay(), TestBuildSkyscannerPrefillURL_roundTrip() (+56 more)

### Community 33 - "store/index.ts"
Cohesion: 0.12
Nodes (22): ICONS, KEYS, s, SortBar(), SortBarProps, SortOption, clampDealsMonth(), dealsActions (+14 more)

### Community 34 - "api.ts"
Cohesion: 0.14
Nodes (13): AirportCityType, AirportLike, ANYWHERE_CODE, BaggageClass, Carrier, ExplorePriceSource, ExtraSearchLeg, FareBreakdown (+5 more)

### Community 35 - "ValidationIssue"
Cohesion: 0.18
Nodes (7): Any, Serialize nested result for report output., Represents a single validation or analysis finding., Serialize issue to dictionary., Serialize case to dictionary., Append a new issue to this result., ValidationIssue

### Community 36 - "Backend QA Automation Tool"
Cohesion: 0.18
Nodes (10): Backend QA Automation Tool, Features, If the run feels slow or “stuck”, Notes, Optional AI Setup (Ollama), Output, Project Structure, Run (+2 more)

### Community 37 - "KiwiApifyProvider"
Cohesion: 0.27
Nodes (6): apifyErrorMessage(), flattenKiwiItems(), NewKiwiApifyProvider(), stringField(), truncateStr(), KiwiApifyProvider

### Community 38 - "kiwi_apify_provider.go"
Cohesion: 0.26
Nodes (17): asArray(), collectCarriers(), detectSelfTransfer(), extractKiwiLegs(), firstFloat(), firstString(), kiwiSegmentFromMap(), mapsToSegments() (+9 more)

### Community 39 - "search.ts"
Cohesion: 0.33
Nodes (8): CachedResult, fetchFresh(), getFromStorage(), getStorage(), paramsMatch(), resultsCache, setToStorage(), SearchSessionResultsResponse

### Community 40 - "ErrorBoundary"
Cohesion: 0.15
Nodes (4): ErrorBoundary, Props, s, State

### Community 41 - "models.py"
Cohesion: 0.25
Nodes (5): Core data models for the API QA runner., Set completion timestamp., Return an ISO-8601 UTC timestamp., utc_now_iso(), Validation rules for API responses.

### Community 42 - "dedupe.go"
Cohesion: 0.14
Nodes (14): DedupeProviderResults(), ItineraryFingerprint(), maxInt(), mergeSelfTransfer(), normalizeFlightNumber(), roundTimeKey(), TotalStops(), uniqueStrings() (+6 more)

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "write-spa-fallbacks.mjs"
Cohesion: 0.33
Nodes (5): __dirname, dist, indexHtml, indexPath, SPA_ROUTES

### Community 45 - "affiliate.ts"
Cohesion: 0.21
Nodes (11): AffiliateProvider, AffiliateProviderResponse, BookingOptionInput, BookingRedirectParams, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary() (+3 more)

### Community 53 - "App.tsx"
Cohesion: 0.31
Nodes (7): App(), linking, RTLWrapper(), API_BASE, useExchangeRates(), ensureRates(), fetchRates()

### Community 54 - "client.ts"
Cohesion: 0.18
Nodes (13): searchAirports(), apiGet(), apiRequest(), apiUrl(), isLocalHostname(), IMPORTANT: Expo/Metro statically inlines EXPO_PUBLIC_* only when accessed via, resolveApiBase(), getDealsRange() (+5 more)

### Community 55 - "SearchFormScreen.tsx"
Cohesion: 0.26
Nodes (14): defaultParams, SearchFormScreen(), styles, buildSearchString(), getParam(), getParams(), isWeb(), parseSearchParamsFromUrl() (+6 more)

### Community 56 - "useTheme"
Cohesion: 0.10
Nodes (26): buildMonthDays(), DateRangePicker(), DateRangePickerProps, getMonthStart(), styles, WEEKDAYS, CABIN_OPTIONS, PassengerCabinPicker() (+18 more)

### Community 57 - "handleExplore"
Cohesion: 0.43
Nodes (7): exploreSessionKey(), getExploreSession(), newExploreSessionID(), putExploreSession(), exploreSession, handleExplore(), sync.Mutex

### Community 58 - "CalendarModal.tsx"
Cohesion: 0.38
Nodes (6): buildMonthDays(), CalendarModal(), getMonthStart(), Props, styles, WEEKDAYS

### Community 59 - "useLocale"
Cohesion: 0.14
Nodes (22): useLocale(), AIRLINE_NAMES, getAirlineName(), AIRLINE_FULL_NAMES, NOTE: This is a starter subset of IATA airlines., f, FiltersPanel(), FiltersPanelProps (+14 more)

### Community 61 - "SearchSession"
Cohesion: 0.67
Nodes (3): SearchSession, SearchSessionResultsResponse, SearchSessionStatus

### Community 62 - "DatePickerCalendar.tsx"
Cohesion: 0.43
Nodes (6): DatePickerCalendar(), DatePickerCalendarProps, getNext14Dates(), getRangeStartEnd(), styles, WEEKDAYS

### Community 63 - "explore.ts"
Cohesion: 0.50
Nodes (4): ExploreResponse, GetExploreDestinationsParams, DestCardProps, ExploreDestination

## Knowledge Gaps
- **252 isolated node(s):** `ClicksByProvider`, `exploreLiveCandidate`, `flightcaptainweb`, `Provider`, `MultiSearchResult` (+247 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ProviderResult` connect `ProviderResult` to `googleflights2_provider.go`, `testing.T`, `providers.go`, `kiwi_apify_provider.go`, `dedupe.go`, `handleCreateSession`, `time.Time`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `GoogleFlights2Provider` connect `ProviderResult` to `googleflights2_provider.go`, `dedupe.go`, `time.Time`, `providers.go`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Why does `useLocale()` connect `useLocale` to `store/index.ts`, `FlightDetailsModal.tsx`, `types.ts`, `MonthDealsScreen.tsx`, `ExploreScreen.tsx`, `ResultsScreen.tsx`, `types/index.ts`, `LocaleContext.tsx`, `App.tsx`, `SearchFormScreen.tsx`, `useTheme`, `CheaperCitiesSection.tsx`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `TestResult` (e.g. with `ResponseAnalyzer` and `ApiClient`) actually correct?**
  _`TestResult` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `ClicksByProvider`, `exploreLiveCandidate`, `flightcaptainweb` to the rest of the system?**
  _252 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `googleflights2_provider.go` be split into smaller, more focused modules?**
  _Cohesion score 0.11463414634146342 - nodes in this community are weakly interconnected._
- **Should `types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1396011396011396 - nodes in this community are weakly interconnected._