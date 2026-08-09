# Graph Report - workspace  (2026-08-09)

## Corpus Check
- 128 files · ~145,261 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1079 nodes · 2325 edges · 55 communities (47 shown, 8 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 112 edges (avg confidence: 0.79)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fd4aacaf`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- googleflights2_provider.go
- LocaleContext.tsx
- FlightDetailsModal.tsx
- Issue
- gf2_deals.go
- MonthDealsScreen.tsx
- dependencies
- server.go
- Features
- affiliate.go
- ExploreScreen.tsx
- ResponseWriter
- ResultsScreen.tsx
- compilerOptions
- package.json
- AirportAutocomplete.tsx
- canonical.go
- expo-status-bar
- handleCreateSession
- SearchFormContent.tsx
- qa_runner.py
- ApiClient
- SearchFormScreen.tsx
- TestResult
- ResponseValidator
- client.ts
- useLocale
- expo
- config_loader.py
- main.go
- ProviderResult
- backend_api_contracts.md
- providerResultsToFlightOptions
- react-dom
- api.ts
- ValidationIssue
- Backend QA Automation Tool
- react-native
- TestApplySoftStrictBaggage
- CalendarModal.tsx
- models.py
- devDependencies
- Fly-Fix – Frontend
- write-spa-fallbacks.mjs
- metro.config.js
- __init__.py
- flightcaptainweb
- scripts
- @react-navigation/native
- MultiSearchResult
- TestExtractCarrierCodes

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

## Communities (55 total, 8 thin omitted)

### Community 0 - "googleflights2_provider.go"
Cohesion: 0.08
Nodes (41): T, TestExtractGF2Leg_SingleSegment_DepartArriveDiffer(), TestExtractGF2Leg_TimeOnly_NoDateHint(), TestExtractGF2Leg_TimeOnly_WithDateHint(), TestParseGF2Time_AcceptsFullDateTime(), TestParseGF2Time_RejectsTimeOnly(), buildGF2ResultFromItinerary(), extractGF2DurationMinutes() (+33 more)

### Community 1 - "LocaleContext.tsx"
Cohesion: 0.05
Nodes (41): App(), linking, RTLWrapper(), API_BASE, ErrorBoundary, Props, s, State (+33 more)

### Community 2 - "FlightDetailsModal.tsx"
Cohesion: 0.11
Nodes (31): getUniformBookingRedirectUrl(), DisplayPrice(), DisplayPriceProps, AIRLINE_NAMES, getAirlineName(), AIRLINE_FULL_NAMES, NOTE: This is a starter subset of IATA airlines., cabinLabel() (+23 more)

### Community 3 - "Issue"
Cohesion: 0.08
Nodes (40): Context, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+32 more)

### Community 4 - "gf2_deals.go"
Cohesion: 0.07
Nodes (51): airportCoord, exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut(), Time (+43 more)

### Community 5 - "MonthDealsScreen.tsx"
Cohesion: 0.08
Nodes (42): CheaperCitiesOption, buildDealsPositioningSignature(), dealBestScore(), DEALS_LOADING_PHRASES, dlb, esm, findCheapestFlightForDate(), fl (+34 more)

### Community 6 - "dependencies"
Cohesion: 0.12
Nodes (17): expo, @expo/metro-runtime, dependencies, expo, @expo/metro-runtime, react-native-safe-area-context, react-native-screens, react-native-web (+9 more)

### Community 7 - "server.go"
Cohesion: 0.08
Nodes (45): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, Carrier, DayDeal, startExploreSessionCleanup(), FareBreakdown (+37 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (33): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+25 more)

### Community 9 - "affiliate.go"
Cohesion: 0.16
Nodes (20): BuildRedirectURL(), getAffiliateID(), GetClicksSummary(), getOTAProvider(), GetSessionAndOption(), FlightOption, SearchSession, Time (+12 more)

### Community 10 - "ExploreScreen.tsx"
Cohesion: 0.15
Nodes (26): getMonthDeals(), getExploreDestinations(), getAirportEntry(), c, countryFlag(), d, DestCard(), ExploreScreen() (+18 more)

### Community 11 - "ResponseWriter"
Cohesion: 0.44
Nodes (13): Request, ResponseWriter, handleAffiliateClicksSummary(), handleAffiliateOutboundLink(), handleAffiliateProvider(), handleAffiliateRedirect(), handleAirportSearch(), handleFlightDetails() (+5 more)

### Community 12 - "ResultsScreen.tsx"
Cohesion: 0.11
Nodes (26): CachedResult, createSearchSession(), fetchFresh(), getFromStorage(), getSearchSessionResults(), getStorage(), paramsMatch(), resultsCache (+18 more)

### Community 13 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+15 more)

### Community 14 - "package.json"
Cohesion: 0.40
Nodes (4): main, name, private, version

### Community 15 - "AirportAutocomplete.tsx"
Cohesion: 0.20
Nodes (16): AIRPORT_DICTIONARY, getAirportDisplayName(), getAirportNameByCode(), getCityDisplayName(), lower(), matchesQuery(), rankResult(), searchAirportsLocal() (+8 more)

### Community 16 - "canonical.go"
Cohesion: 0.23
Nodes (14): buildGoogleFlightsPrefillURL(), BuildSkyscannerFallbackFromParams(), buildSkyscannerPrefillURL(), BuildUniformBookingLink(), CanonicalFingerprint(), CodeshareFingerprint(), depToYYMMDD(), FlightOption (+6 more)

### Community 18 - "handleCreateSession"
Cohesion: 0.33
Nodes (4): CreateSearchSessionRequest, baggageOrderString(), handleCreateSession(), randomID()

### Community 19 - "SearchFormContent.tsx"
Cohesion: 0.12
Nodes (24): AppIcon(), AppIconLibrary, AppIconProps, styles, getSvgMarkup(), getWebIconSvgDataUri(), hasWebSvgFallback(), LOCAL_ICON_NAMES (+16 more)

### Community 20 - "qa_runner.py"
Cohesion: 0.14
Nodes (13): Namespace, Path, Any, Reporting helpers for test execution results., Render terminal summary and persist machine-readable reports., Print user-friendly report to stdout., Write a JSON report and return its path., ReportWriter (+5 more)

### Community 21 - "ApiClient"
Cohesion: 0.14
Nodes (12): ApiClient, Any, HTTP client utilities for executing API test cases., Parse JSON response when possible without raising., Sleep using exponential backoff., Executes HTTP requests with retry and timing support., Close the underlying requests session., Execute one test case and return a populated result. (+4 more)

### Community 22 - "SearchFormScreen.tsx"
Cohesion: 0.28
Nodes (13): defaultParams, SearchFormScreen(), styles, buildSearchString(), getParam(), getParams(), isWeb(), parseSearchParamsFromUrl() (+5 more)

### Community 23 - "TestResult"
Cohesion: 0.18
Nodes (8): AI and heuristic quality-control analysis for API test results., Analyze result quality with Ollama and rule-based checks., Close underlying HTTP session., Return human-readable quality notes for this result. Rule-based insights are…, ResponseAnalyzer, Stores execution data and findings for one test case., A test passes when there are no error-level issues., TestResult

### Community 24 - "ResponseValidator"
Cohesion: 0.22
Nodes (5): Any, Applies status, schema, and consistency checks., Run all checks and append issues to the result., Resolve a dotted path in a nested JSON-like payload. Supports indexes like…, ResponseValidator

### Community 25 - "client.ts"
Cohesion: 0.06
Nodes (43): AffiliateProvider, AffiliateProviderResponse, BookingRedirectParams, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink() (+35 more)

### Community 26 - "useLocale"
Cohesion: 0.08
Nodes (31): PHRASES_EN, PHRASES_HE, PHRASES_RU, Props, s, SearchLoadingOverlay(), useLocale(), CheaperCitiesSection() (+23 more)

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.32
Nodes (13): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+5 more)

### Community 29 - "main.go"
Cohesion: 0.22
Nodes (17): buildDealMessage(), buildDetailedItinerary(), displayFlightPage(), formatDateAndTime(), formatDuration(), getItinerarySummary(), getItinerarySummaryAt(), Request (+9 more)

### Community 30 - "ProviderResult"
Cohesion: 0.06
Nodes (59): DedupeProviderResults(), Time, ItineraryFingerprint(), maxInt(), mergeSelfTransfer(), normalizeFlightNumber(), roundTimeKey(), TotalStops() (+51 more)

### Community 31 - "backend_api_contracts.md"
Cohesion: 0.17
Nodes (11): 1.1 Create Search Session, 1.2 Get Search Session Status & Results, 1.3 Cancel Search Session (Optional, MVP+), 1. Flight Search Sessions, 2.1 Get Monthly Deals, 2. Monthly Deals API, 3.1 Search Airports & Cities, 3. Airport & City Autocomplete (+3 more)

### Community 32 - "providerResultsToFlightOptions"
Cohesion: 0.17
Nodes (21): FlightLeg, applyPriceNormalization(), computeOutboundSummary(), computeTotalDurationFromLegs(), ensurePrimaryCarrier(), extractDealMetaFromLeg(), T, TestApplyPriceNormalizationDefaultNoChange() (+13 more)

### Community 34 - "api.ts"
Cohesion: 0.10
Nodes (24): FiltersPanelProps, FlightDetailsModalProps, FlightResultCardProps, PositioningLegResult, defaultFilters, searchActions, SearchFilters, SearchState (+16 more)

### Community 35 - "ValidationIssue"
Cohesion: 0.18
Nodes (7): Any, Serialize nested result for report output., Represents a single validation or analysis finding., Serialize issue to dictionary., Serialize case to dictionary., Append a new issue to this result., ValidationIssue

### Community 36 - "Backend QA Automation Tool"
Cohesion: 0.18
Nodes (10): Backend QA Automation Tool, Features, If the run feels slow or “stuck”, Notes, Optional AI Setup (Ollama), Output, Project Structure, Run (+2 more)

### Community 39 - "TestApplySoftStrictBaggage"
Cohesion: 0.46
Nodes (7): applySoftStrictBaggage(), T, makeOfferWithBags(), makeOfferWithMissingBags(), TestApplySoftStrictBaggage(), TestClassifyOfferBaggage(), classifyOfferBaggage()

### Community 40 - "CalendarModal.tsx"
Cohesion: 0.28
Nodes (8): react, buildMonthDays(), CalendarModal(), getMonthStart(), Props, styles, WEEKDAYS, react

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

### Community 53 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, android, build, ios, start, web

### Community 61 - "TestExtractCarrierCodes"
Cohesion: 0.39
Nodes (7): CarrierCodes, T, makeOfferWithCarriers(), TestExtractCarrierCodes(), TestPrimaryDisplayCarrier(), ExtractCarrierCodes(), PrimaryDisplayCarrier()

## Knowledge Gaps
- **238 isolated node(s):** `ClicksByProvider`, `exploreLiveCandidate`, `flightcaptainweb`, `Provider`, `MultiSearchResult` (+233 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `CalendarModal.tsx` to `SearchFormContent.tsx`, `dependencies`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Why does `ProviderResult` connect `ProviderResult` to `googleflights2_provider.go`, `providerResultsToFlightOptions`, `gf2_deals.go`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Why does `DateRangePicker()` connect `SearchFormContent.tsx` to `CalendarModal.tsx`, `useLocale`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `TestResult` (e.g. with `ResponseAnalyzer` and `ApiClient`) actually correct?**
  _`TestResult` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `ClicksByProvider`, `exploreLiveCandidate`, `flightcaptainweb` to the rest of the system?**
  _238 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `googleflights2_provider.go` be split into smaller, more focused modules?**
  _Cohesion score 0.08145363408521303 - nodes in this community are weakly interconnected._
- **Should `LocaleContext.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05423728813559322 - nodes in this community are weakly interconnected._