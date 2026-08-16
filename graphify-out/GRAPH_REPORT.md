# Graph Report - workspace  (2026-08-11)

## Corpus Check
- 133 files · ~147,552 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1065 nodes · 2385 edges · 64 communities (60 shown, 4 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 116 edges (avg confidence: 0.79)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b8e69710`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- googleflights2_provider.go
- types.ts
- FlightResultCard.tsx
- Issue
- ProviderResult
- MonthDealsScreen.tsx
- dependencies
- server.go
- Features
- affiliate.go
- ExploreScreen.tsx
- net/http.ResponseWriter
- ResultsScreen.tsx
- compilerOptions
- LocaleContext.tsx
- AirportAutocomplete.tsx
- canonical.go
- types/index.ts
- handleCreateSession
- AppIcon.tsx
- qa_runner.py
- ApiClient
- useLocale
- TestResult
- ResponseValidator
- client.ts
- searchStore.ts
- expo
- config_loader.py
- KiwiApifyProvider
- time.Time
- backend_api_contracts.md
- testing.T
- FlightDetailsModal.tsx
- api.ts
- ValidationIssue
- Backend QA Automation Tool
- affiliate.ts
- MonthDealsScreen
- exchangeRates.ts
- main
- models.py
- Registry
- Fly-Fix – Frontend
- write-spa-fallbacks.mjs
- search.ts
- metro.config.js
- __init__.py
- flightcaptainweb
- store/index.ts
- DatePickerCalendar.tsx
- SearchFormScreen.tsx
- CalendarModal.tsx
- explore.ts
- kiwi_apify_provider.go
- airlines.ts
- MultiSearchResult
- SearchSession
- SearchRequest
- dedupe.go

## God Nodes (most connected - your core abstractions)
1. `useLocale()` - 38 edges
2. `useTheme()` - 37 edges
3. `ProviderResult` - 31 edges
4. `TestResult` - 29 edges
5. `MonthDealsScreen()` - 27 edges
6. `handleCreateSession()` - 23 edges
7. `FlightOption` - 19 edges
8. `ExploreScreen()` - 19 edges
9. `GoogleFlights2Provider` - 18 edges
10. `KiwiApifyProvider` - 17 edges

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

## Communities (64 total, 4 thin omitted)

### Community 0 - "googleflights2_provider.go"
Cohesion: 0.19
Nodes (26): TestExtractGF2Leg_SingleSegment_DepartArriveDiffer(), TestExtractGF2Leg_TimeOnly_NoDateHint(), TestExtractGF2Leg_TimeOnly_WithDateHint(), TestParseGF2Time_AcceptsFullDateTime(), TestParseGF2Time_RejectsTimeOnly(), buildGF2ResultFromItinerary(), extractGF2DurationMinutes(), extractGF2Flight() (+18 more)

### Community 1 - "types.ts"
Cohesion: 0.08
Nodes (22): ErrorBoundary, Props, s, State, LandingScreen(), Nav, styles, DynamicDestinationsStack() (+14 more)

### Community 2 - "FlightResultCard.tsx"
Cohesion: 0.38
Nodes (10): getAirlineName(), airlineName(), buildRoutePath(), buildSummary(), c, FlightResultCard(), fmtDuration(), fmtShortDate() (+2 more)

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "ProviderResult"
Cohesion: 0.16
Nodes (12): newGF2Cache(), MultiSearchResult, ProviderResult, ProviderSearchStats, sync.RWMutex, gf2Cache, gf2CacheEntry, kiwiCache (+4 more)

### Community 5 - "MonthDealsScreen.tsx"
Cohesion: 0.13
Nodes (21): dealBestScore(), DEALS_LOADING_PHRASES, dlb, esm, fl, fmtDur(), hfm, HUB_AIRPORTS (+13 more)

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
Cohesion: 0.15
Nodes (20): BuildRedirectURL(), getAffiliateID(), GetClicksSummary(), getOTAProvider(), GetSessionAndOption(), FlightOption, SearchSession, ParseOptionIndex() (+12 more)

### Community 10 - "ExploreScreen.tsx"
Cohesion: 0.15
Nodes (27): getExploreDestinations(), getAirportEntry(), getCityDisplayName(), AirportAutocomplete(), c, countryFlag(), d, DestCard() (+19 more)

### Community 11 - "net/http.ResponseWriter"
Cohesion: 0.40
Nodes (14): healthHandler(), handleFlyFixRefineIssues(), handleAffiliateClicksSummary(), handleAffiliateOutboundLink(), handleAffiliateProvider(), handleAffiliateRedirect(), handleAirportSearch(), handleFlightDetails() (+6 more)

### Community 12 - "ResultsScreen.tsx"
Cohesion: 0.12
Nodes (22): createSearchSession(), getSearchSessionResults(), paramsMatch(), CheaperCitiesOption, CheaperCitiesSection(), Props, s, bestScore() (+14 more)

### Community 13 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+15 more)

### Community 14 - "LocaleContext.tsx"
Cohesion: 0.14
Nodes (20): getStorage(), languageToLocale(), loadSaved(), LocaleContext, LocaleContextValue, LocaleProvider(), save(), VALID_CURRENCIES (+12 more)

### Community 15 - "AirportAutocomplete.tsx"
Cohesion: 0.20
Nodes (14): AIRPORT_DICTIONARY, getAirportDisplayName(), getAirportNameByCode(), lower(), matchesQuery(), rankResult(), searchAirportsLocal(), AirportAutocompleteProps (+6 more)

### Community 16 - "canonical.go"
Cohesion: 0.25
Nodes (13): buildGoogleFlightsPrefillURL(), BuildSkyscannerFallbackFromParams(), buildSkyscannerPrefillURL(), BuildUniformBookingLink(), CanonicalFingerprint(), CodeshareFingerprint(), depToYYMMDD(), FlightOption (+5 more)

### Community 17 - "types/index.ts"
Cohesion: 0.22
Nodes (9): searchAirports(), apiGet(), GetDealsRangeParams, getMonthDeals(), GetMonthDealsParams, getFlightDetails(), GetFlightDetailsParams, AirportCitySearchResponse (+1 more)

### Community 18 - "handleCreateSession"
Cohesion: 0.14
Nodes (19): CreateSearchSessionRequest, FlightLeg, FlightOption, LayoverSummary, OutboundSummary, applyPriceNormalization(), applySoftStrictBaggageOptions(), baggageOrderString() (+11 more)

### Community 19 - "AppIcon.tsx"
Cohesion: 0.18
Nodes (14): AppIcon(), AppIconLibrary, AppIconProps, styles, getSvgMarkup(), getWebIconSvgDataUri(), hasWebSvgFallback(), LOCAL_ICON_NAMES (+6 more)

### Community 20 - "qa_runner.py"
Cohesion: 0.14
Nodes (13): Namespace, Path, Any, Reporting helpers for test execution results., Render terminal summary and persist machine-readable reports., Print user-friendly report to stdout., Write a JSON report and return its path., ReportWriter (+5 more)

### Community 21 - "ApiClient"
Cohesion: 0.14
Nodes (12): ApiClient, Any, HTTP client utilities for executing API test cases., Parse JSON response when possible without raising., Sleep using exponential backoff., Executes HTTP requests with retry and timing support., Close the underlying requests session., Execute one test case and return a populated result. (+4 more)

### Community 22 - "useLocale"
Cohesion: 0.08
Nodes (38): linking, RTLWrapper(), API_BASE, PHRASES_EN, PHRASES_HE, PHRASES_RU, Props, s (+30 more)

### Community 23 - "TestResult"
Cohesion: 0.18
Nodes (8): AI and heuristic quality-control analysis for API test results., Analyze result quality with Ollama and rule-based checks., Close underlying HTTP session., Return human-readable quality notes for this result. Rule-based insights are…, ResponseAnalyzer, Stores execution data and findings for one test case., A test passes when there are no error-level issues., TestResult

### Community 24 - "ResponseValidator"
Cohesion: 0.22
Nodes (5): Any, Applies status, schema, and consistency checks., Run all checks and append issues to the result., Resolve a dotted path in a nested JSON-like payload. Supports indexes like…, ResponseValidator

### Community 25 - "client.ts"
Cohesion: 0.18
Nodes (13): apiPost(), apiRequest(), apiUrl(), isLocalHostname(), IMPORTANT: Expo/Metro statically inlines EXPO_PUBLIC_* only when accessed via, resolveApiBase(), FlyfixInsightsGroup, FlyfixIssue (+5 more)

### Community 26 - "searchStore.ts"
Cohesion: 0.17
Nodes (13): ICONS, KEYS, s, SortBar(), SortBarProps, SortOption, defaultFilters, searchActions (+5 more)

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.32
Nodes (13): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+5 more)

### Community 29 - "KiwiApifyProvider"
Cohesion: 0.22
Nodes (8): apifyErrorMessage(), flattenKiwiItems(), NewKiwiApifyProvider(), stringField(), truncateStr(), TestApifyErrorMessage(), net/http.Client, KiwiApifyProvider

### Community 30 - "time.Time"
Cohesion: 0.06
Nodes (61): airportCoord, exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut(), getAirportCoord() (+53 more)

### Community 31 - "backend_api_contracts.md"
Cohesion: 0.17
Nodes (11): 1.1 Create Search Session, 1.2 Get Search Session Status & Results, 1.3 Cancel Search Session (Optional, MVP+), 1. Flight Search Sessions, 2.1 Get Monthly Deals, 2. Monthly Deals API, 3.1 Search Airports & Cities, 3. Airport & City Autocomplete (+3 more)

### Community 32 - "testing.T"
Cohesion: 0.08
Nodes (38): TestAttachReturnLegKeepPrice(), TestEnsureRoundTripLegs_nilSafe(), TestEnsureRoundTripLegs_noOpWhenTwoLegs(), parseKiwiApifyItems(), TestBuildActorInputSolidcodeOnly(), TestDedupeKeepsCheaper(), TestDetectSelfTransfer(), TestItineraryFingerprintStable() (+30 more)

### Community 33 - "FlightDetailsModal.tsx"
Cohesion: 0.25
Nodes (14): getUniformBookingRedirectUrl(), cabinLabel(), FlightDetailsModal(), FlightDetailsModalProps, formatDuration(), layoverBetween(), legDuration(), s (+6 more)

### Community 34 - "api.ts"
Cohesion: 0.15
Nodes (12): AirportCityType, AirportLike, BaggageClass, Carrier, ExplorePriceSource, FareBreakdown, FlightLeg, FlightSegment (+4 more)

### Community 35 - "ValidationIssue"
Cohesion: 0.18
Nodes (7): Any, Serialize nested result for report output., Represents a single validation or analysis finding., Serialize issue to dictionary., Serialize case to dictionary., Append a new issue to this result., ValidationIssue

### Community 36 - "Backend QA Automation Tool"
Cohesion: 0.18
Nodes (10): Backend QA Automation Tool, Features, If the run feels slow or “stuck”, Notes, Optional AI Setup (Ollama), Output, Project Structure, Run (+2 more)

### Community 37 - "affiliate.ts"
Cohesion: 0.24
Nodes (10): AffiliateProvider, AffiliateProviderResponse, BookingRedirectParams, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink() (+2 more)

### Community 38 - "MonthDealsScreen"
Cohesion: 0.27
Nodes (10): buildDealsPositioningSignature(), formatDealDate(), MonthDealsScreen(), parseDealYmdToUTCDate(), toYmdUTC(), clearPendingDealsParams(), DealsParams, getPendingDealsParams() (+2 more)

### Community 39 - "exchangeRates.ts"
Cohesion: 0.21
Nodes (12): App(), DisplayPrice(), DisplayPriceProps, useExchangeRates(), convertPrice(), CURRENCY_SYMBOLS, CurrencyCode, ensureRates() (+4 more)

### Community 40 - "main"
Cohesion: 0.29
Nodes (7): startExploreSessionCleanup(), corsMiddleware(), fetchExchangeRates(), main(), startExchangeRateRefresh(), startSearchSessionCleanup(), net/http.Handler

### Community 41 - "models.py"
Cohesion: 0.25
Nodes (5): Core data models for the API QA runner., Set completion timestamp., Return an ISO-8601 UTC timestamp., utc_now_iso(), Validation rules for API responses.

### Community 42 - "Registry"
Cohesion: 0.33
Nodes (4): NewRegistryFromEnv(), parseProviderNames(), Provider, Registry

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "write-spa-fallbacks.mjs"
Cohesion: 0.33
Nodes (5): __dirname, dist, indexHtml, indexPath, SPA_ROUTES

### Community 45 - "search.ts"
Cohesion: 0.39
Nodes (7): CachedResult, fetchFresh(), getFromStorage(), getStorage(), resultsCache, setToStorage(), SearchSessionResultsResponse

### Community 53 - "store/index.ts"
Cohesion: 0.33
Nodes (8): clampDealsMonth(), dealsActions, DealsSortField, DealsState, getMinimumAllowedDealsYearMonth(), now, useDealsStore, MonthDealsResponse

### Community 54 - "DatePickerCalendar.tsx"
Cohesion: 0.33
Nodes (8): getDealsRange(), DatePickerCalendar(), DatePickerCalendarProps, getNext14Dates(), getRangeStartEnd(), styles, WEEKDAYS, DayDeal

### Community 55 - "SearchFormScreen.tsx"
Cohesion: 0.29
Nodes (13): defaultParams, SearchFormScreen(), styles, buildSearchString(), getParam(), getParams(), isWeb(), parseSearchParamsFromUrl() (+5 more)

### Community 56 - "CalendarModal.tsx"
Cohesion: 0.38
Nodes (6): buildMonthDays(), CalendarModal(), getMonthStart(), Props, styles, WEEKDAYS

### Community 57 - "explore.ts"
Cohesion: 0.50
Nodes (4): ExploreResponse, GetExploreDestinationsParams, DestCardProps, ExploreDestination

### Community 58 - "kiwi_apify_provider.go"
Cohesion: 0.34
Nodes (14): asArray(), collectCarriers(), detectSelfTransfer(), extractKiwiLegs(), firstFloat(), firstString(), kiwiSegmentFromMap(), mapsToSegments() (+6 more)

### Community 59 - "airlines.ts"
Cohesion: 0.50
Nodes (3): AIRLINE_NAMES, AIRLINE_FULL_NAMES, NOTE: This is a starter subset of IATA airlines.

### Community 61 - "SearchSession"
Cohesion: 0.50
Nodes (4): SearchSession, SearchSessionResultsResponse, SearchSessionStatus, loadSearchSession()

### Community 62 - "SearchRequest"
Cohesion: 0.30
Nodes (6): TestIsOpenJaw(), TestResolveReturnAirports_classic(), TestResolveReturnAirports_openJaw(), IsOpenJaw(), ResolveReturnAirports(), SearchRequest

### Community 63 - "dedupe.go"
Cohesion: 0.29
Nodes (9): DedupeProviderResults(), ItineraryFingerprint(), maxInt(), mergeSelfTransfer(), normalizeFlightNumber(), roundTimeKey(), TotalStops(), uniqueStrings() (+1 more)

## Knowledge Gaps
- **247 isolated node(s):** `ClicksByProvider`, `exploreLiveCandidate`, `flightcaptainweb`, `Provider`, `MultiSearchResult` (+242 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ProviderResult` connect `ProviderResult` to `googleflights2_provider.go`, `testing.T`, `handleCreateSession`, `SearchRequest`, `kiwi_apify_provider.go`, `time.Time`, `dedupe.go`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Why does `providerResultsToFlightOptions()` connect `handleCreateSession` to `canonical.go`, `ProviderResult`, `time.Time`, `server.go`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Why does `handleFlyFixRefineIssues()` connect `net/http.ResponseWriter` to `testing.T`, `Issue`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `TestResult` (e.g. with `ResponseAnalyzer` and `ApiClient`) actually correct?**
  _`TestResult` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `ClicksByProvider`, `exploreLiveCandidate`, `flightcaptainweb` to the rest of the system?**
  _247 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07804878048780488 - nodes in this community are weakly interconnected._
- **Should `Issue` be split into smaller, more focused modules?**
  _Cohesion score 0.1036036036036036 - nodes in this community are weakly interconnected._