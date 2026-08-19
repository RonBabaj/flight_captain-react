# Graph Report - workspace  (2026-08-19)

## Corpus Check
- 136 files · ~152,555 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1123 nodes · 2574 edges · 60 communities (56 shown, 4 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 151 edges (avg confidence: 0.78)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b52a3372`
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
- dealsStore.ts
- AirportAutocomplete.tsx
- LocaleContext.tsx
- client.ts
- handleCreateSession
- testing.T
- qa_runner.py
- ApiClient
- AppIcon.tsx
- TestResult
- ResponseValidator
- main
- ProviderResult
- expo
- config_loader.py
- DynamicDestinationsScreen.tsx
- time.Time
- backend_api_contracts.md
- canonical.go
- store/index.ts
- api.ts
- ValidationIssue
- Backend QA Automation Tool
- gf2_booking_test.go
- multi_provider_test.go
- search.ts
- googleflights2_normalize_test.go
- models.py
- Registry
- Fly-Fix – Frontend
- write-spa-fallbacks.mjs
- TestApplySoftStrictBaggage
- metro.config.js
- __init__.py
- flightcaptainweb
- TestExtractCarrierCodes
- api/index.ts
- types/index.ts
- SearchFormContent.tsx
- useLocale
- MultiSearchResult
- SearchSession

## God Nodes (most connected - your core abstractions)
1. `useLocale()` - 38 edges
2. `useTheme()` - 37 edges
3. `ProviderResult` - 32 edges
4. `TestResult` - 29 edges
5. `MonthDealsScreen()` - 27 edges
6. `handleCreateSession()` - 23 edges
7. `ResultsScreen()` - 22 edges
8. `GoogleFlights2Provider` - 21 edges
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
- `handleOutBooking()` --calls--> `RecordClick()`  [INFERRED]
  backend/server.go → backend/affiliate.go

## Import Cycles
- None detected.

## Communities (60 total, 4 thin omitted)

### Community 0 - "googleflights2_provider.go"
Cohesion: 0.29
Nodes (20): buildGF2ResultFromItinerary(), extractGF2BookingToken(), extractGF2DurationMinutes(), extractGF2Flight(), extractGF2Itineraries(), extractGF2ItinerariesFromMap(), extractGF2Leg(), extractGF2LegFromFlightsArray() (+12 more)

### Community 1 - "types.ts"
Cohesion: 0.08
Nodes (22): ErrorBoundary, Props, s, State, LandingScreen(), Nav, styles, DynamicDestinationsStack() (+14 more)

### Community 2 - "FlightDetailsModal.tsx"
Cohesion: 0.05
Nodes (66): App(), linking, RTLWrapper(), AffiliateProvider, AffiliateProviderResponse, BookingOptionInput, BookingRedirectParams, ClicksByProvider (+58 more)

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "kiwi_apify_provider.go"
Cohesion: 0.07
Nodes (47): TestCombineOneWayBatches(), TestCombineOneWayBatches_emptyBatch(), TestCompleteExtraLegs(), TestExtraLegsFingerprint(), TestHasExtraLegs(), apifyErrorMessage(), asArray(), collectCarriers() (+39 more)

### Community 5 - "MonthDealsScreen.tsx"
Cohesion: 0.10
Nodes (32): buildDealsPositioningSignature(), dealBestScore(), DEALS_LOADING_PHRASES, dlb, esm, fl, fmtDur(), formatDealDate() (+24 more)

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
Cohesion: 0.15
Nodes (25): getExploreDestinations(), getAirportEntry(), c, countryFlag(), d, DestCard(), ExploreScreen(), ExploreScreenProps (+17 more)

### Community 11 - "net/http.ResponseWriter"
Cohesion: 0.35
Nodes (16): RecordClick(), handleFlyFixRefineIssues(), handleAffiliateClicksSummary(), handleAffiliateOutboundLink(), handleAffiliateProvider(), handleAffiliateRedirect(), handleAirportSearch(), handleFlightDetails() (+8 more)

### Community 12 - "ResultsScreen.tsx"
Cohesion: 0.14
Nodes (20): createSearchSession(), getSearchSessionResults(), bestScore(), CheapestOption, currentGeneration(), defaultFormParams, delay(), findCheapestOptionForParams() (+12 more)

### Community 13 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+15 more)

### Community 14 - "dealsStore.ts"
Cohesion: 0.28
Nodes (8): clampDealsMonth(), dealsActions, DealsSortField, DealsState, getMinimumAllowedDealsYearMonth(), now, DayDeal, MonthDealsResponse

### Community 15 - "AirportAutocomplete.tsx"
Cohesion: 0.20
Nodes (15): AIRPORT_DICTIONARY, getAirportDisplayName(), getCityDisplayName(), lower(), matchesQuery(), rankResult(), searchAirportsLocal(), AirportAutocomplete() (+7 more)

### Community 16 - "LocaleContext.tsx"
Cohesion: 0.17
Nodes (17): getStorage(), languageToLocale(), loadSaved(), LocaleContext, LocaleContextValue, LocaleProvider(), save(), VALID_CURRENCIES (+9 more)

### Community 17 - "client.ts"
Cohesion: 0.12
Nodes (18): API_BASE, apiPost(), apiRequest(), apiUrl(), isLocalHostname(), IMPORTANT: Expo/Metro statically inlines EXPO_PUBLIC_* only when accessed via, resolveApiBase(), ExploreResponse (+10 more)

### Community 18 - "handleCreateSession"
Cohesion: 0.14
Nodes (20): CreateSearchSessionRequest, ExtraSearchLeg, FlightOption, LayoverSummary, OutboundSummary, applyPriceNormalization(), applySoftStrictBaggageOptions(), baggageOrderString() (+12 more)

### Community 19 - "testing.T"
Cohesion: 0.16
Nodes (19): TestAttachReturnLegKeepPrice(), TestEnsureRoundTripLegs_nilSafe(), TestEnsureRoundTripLegs_noOpWhenTwoLegs(), TestApplyPriceNormalizationDefaultNoChange(), TestComputeOutboundSummary_Direct(), TestComputeOutboundSummary_OneStop(), TestComputeTotalDurationFromLegs(), TestComputeTotalDurationFromLegs_IncludesLayover() (+11 more)

### Community 20 - "qa_runner.py"
Cohesion: 0.14
Nodes (13): Namespace, Path, Any, Reporting helpers for test execution results., Render terminal summary and persist machine-readable reports., Print user-friendly report to stdout., Write a JSON report and return its path., ReportWriter (+5 more)

### Community 21 - "ApiClient"
Cohesion: 0.14
Nodes (12): ApiClient, Any, HTTP client utilities for executing API test cases., Parse JSON response when possible without raising., Sleep using exponential backoff., Executes HTTP requests with retry and timing support., Close the underlying requests session., Execute one test case and return a populated result. (+4 more)

### Community 22 - "AppIcon.tsx"
Cohesion: 0.18
Nodes (14): AppIcon(), AppIconLibrary, AppIconProps, styles, getSvgMarkup(), getWebIconSvgDataUri(), hasWebSvgFallback(), LOCAL_ICON_NAMES (+6 more)

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
Cohesion: 0.19
Nodes (14): DedupeProviderResults(), ItineraryFingerprint(), maxInt(), mergeSelfTransfer(), normalizeFlightNumber(), roundTimeKey(), TotalStops(), uniqueStrings() (+6 more)

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.32
Nodes (13): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+5 more)

### Community 29 - "DynamicDestinationsScreen.tsx"
Cohesion: 0.19
Nodes (12): defaultParams, DynamicDestinationsScreen(), emptyExtra(), Nav, styles, buildMonthDays(), DateRangePicker(), DateRangePickerProps (+4 more)

### Community 30 - "time.Time"
Cohesion: 0.07
Nodes (49): airportCoord, exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut(), getAirportCoord() (+41 more)

### Community 31 - "backend_api_contracts.md"
Cohesion: 0.17
Nodes (11): 1.1 Create Search Session, 1.2 Get Search Session Status & Results, 1.3 Cancel Search Session (Optional, MVP+), 1. Flight Search Sessions, 2.1 Get Monthly Deals, 2. Monthly Deals API, 3.1 Search Airports & Cities, 3. Airport & City Autocomplete (+3 more)

### Community 32 - "canonical.go"
Cohesion: 0.13
Nodes (34): FlightOption, openJawOption(), TestBookingLinkModeDefaultsToGoogle(), TestBookingRouteFromSessionOption_splitOmitsReturn(), TestBuildGoogleFlightsFallbackFromParams(), TestBuildOneWayLegBookingURL(), TestBuildSkyscannerPrefillURL_oneWay(), TestBuildSkyscannerPrefillURL_roundTrip() (+26 more)

### Community 33 - "store/index.ts"
Cohesion: 0.18
Nodes (14): ICONS, KEYS, s, SortBar(), SortBarProps, SortOption, defaultFilters, searchActions (+6 more)

### Community 34 - "api.ts"
Cohesion: 0.12
Nodes (15): CheaperCitiesOption, AirportCityType, AirportLike, BaggageClass, Carrier, ExplorePriceSource, ExtraSearchLeg, FareBreakdown (+7 more)

### Community 35 - "ValidationIssue"
Cohesion: 0.18
Nodes (7): Any, Serialize nested result for report output., Represents a single validation or analysis finding., Serialize issue to dictionary., Serialize case to dictionary., Append a new issue to this result., ValidationIssue

### Community 36 - "Backend QA Automation Tool"
Cohesion: 0.18
Nodes (10): Backend QA Automation Tool, Features, If the run feels slow or “stuck”, Notes, Optional AI Setup (Ollama), Output, Project Structure, Run (+2 more)

### Community 37 - "gf2_booking_test.go"
Cohesion: 0.17
Nodes (12): TestExtractGF2BookingToken(), TestExtractGF2BookingURL(), TestExtractGF2PartnerBookingTokenPrefersPartnerURL(), TestFirstNonEmpty(), TestIsLikelyPartnerCheckoutURL(), extractGF2BookingURL(), extractGF2PartnerBookingToken(), findFirstHTTPSURL() (+4 more)

### Community 38 - "multi_provider_test.go"
Cohesion: 0.18
Nodes (10): parseKiwiApifyItems(), TestApifyErrorMessage(), TestBuildActorInputSolidcodeOnly(), TestDetectSelfTransfer(), TestItineraryFingerprintStable(), TestKiwiApifyTimeout(), TestParseKiwiApifyItemsSolidcodeShape(), TestParseKiwiEmptyAndInvalid() (+2 more)

### Community 39 - "search.ts"
Cohesion: 0.33
Nodes (8): CachedResult, fetchFresh(), getFromStorage(), getStorage(), paramsMatch(), resultsCache, setToStorage(), SearchSessionResultsResponse

### Community 40 - "googleflights2_normalize_test.go"
Cohesion: 0.33
Nodes (6): TestExtractGF2Leg_SingleSegment_DepartArriveDiffer(), TestExtractGF2Leg_TimeOnly_NoDateHint(), TestExtractGF2Leg_TimeOnly_WithDateHint(), TestParseGF2Time_AcceptsFullDateTime(), TestParseGF2Time_RejectsTimeOnly(), parseGF2Time()

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

### Community 45 - "TestApplySoftStrictBaggage"
Cohesion: 0.52
Nodes (6): applySoftStrictBaggage(), makeOfferWithBags(), makeOfferWithMissingBags(), TestApplySoftStrictBaggage(), TestClassifyOfferBaggage(), classifyOfferBaggage()

### Community 53 - "TestExtractCarrierCodes"
Cohesion: 0.83
Nodes (3): makeOfferWithCarriers(), TestExtractCarrierCodes(), TestPrimaryDisplayCarrier()

### Community 54 - "api/index.ts"
Cohesion: 0.15
Nodes (16): searchAirports(), apiGet(), getDealsRange(), GetDealsRangeParams, getMonthDeals(), GetMonthDealsParams, getFlightDetails(), GetFlightDetailsParams (+8 more)

### Community 55 - "types/index.ts"
Cohesion: 0.25
Nodes (14): defaultParams, SearchFormScreen(), styles, buildSearchString(), getParam(), getParams(), isWeb(), parseSearchParamsFromUrl() (+6 more)

### Community 56 - "SearchFormContent.tsx"
Cohesion: 0.24
Nodes (10): CABIN_OPTIONS, PassengerCabinPicker(), PassengerCabinPickerProps, styles, makeThemedStyles(), s, SEARCH_PHRASES, SearchFormContent() (+2 more)

### Community 59 - "useLocale"
Cohesion: 0.11
Nodes (22): ExtraLeg, PHRASES_EN, PHRASES_HE, PHRASES_RU, Props, s, SearchLoadingOverlay(), useLocale() (+14 more)

### Community 61 - "SearchSession"
Cohesion: 0.50
Nodes (4): SearchSession, SearchSessionResultsResponse, SearchSessionStatus, loadSearchSession()

## Knowledge Gaps
- **252 isolated node(s):** `ClicksByProvider`, `exploreLiveCandidate`, `flightcaptainweb`, `Provider`, `MultiSearchResult` (+247 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ProviderResult` connect `ProviderResult` to `googleflights2_provider.go`, `kiwi_apify_provider.go`, `multi_provider_test.go`, `handleCreateSession`, `time.Time`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `GoogleFlights2Provider` connect `time.Time` to `googleflights2_provider.go`, `ProviderResult`, `kiwi_apify_provider.go`, `Registry`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `TestResult` (e.g. with `ResponseAnalyzer` and `ApiClient`) actually correct?**
  _`TestResult` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `ClicksByProvider`, `exploreLiveCandidate`, `flightcaptainweb` to the rest of the system?**
  _252 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07804878048780488 - nodes in this community are weakly interconnected._
- **Should `FlightDetailsModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.052982456140350874 - nodes in this community are weakly interconnected._
- **Should `Issue` be split into smaller, more focused modules?**
  _Cohesion score 0.1036036036036036 - nodes in this community are weakly interconnected._