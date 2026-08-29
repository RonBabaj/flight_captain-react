# Graph Report - workspace  (2026-08-29)

## Corpus Check
- 199 files · ~189,471 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1614 nodes · 4231 edges · 76 communities (72 shown, 4 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 325 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1e286fff`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- googleflights2_provider.go
- RootNavigator.tsx
- FlightDetailsModal.tsx
- Issue
- providers.go
- MonthDealsScreen.tsx
- dependencies
- useTheme
- Features
- net/http.Request
- ExploreScreen.tsx
- booking_resolve.go
- ResultsScreen.tsx
- compilerOptions
- canonical.go
- data/airports.ts
- LocaleContext.tsx
- flyfix.ts
- server.go
- gf2_deals.go
- qa_runner.py
- ApiClient
- placeSearch.ts
- TestResult
- ResponseValidator
- Registry
- ProviderResult
- expo
- config_loader.py
- ThemeContext.tsx
- handleExplore
- backend_api_contracts.md
- testing.T
- TopNavMenu.tsx
- api.ts
- ValidationIssue
- Backend QA Automation Tool
- KiwiApifyProvider
- kiwi_apify_provider.go
- search.ts
- DynamicDestinationsFormContent.tsx
- models.py
- CanonicalItinerary
- Fly-Fix – Frontend
- write-spa-fallbacks.mjs
- FlightResultCard.tsx
- metro.config.js
- __init__.py
- flightcaptainweb
- loadSearchSession
- client.ts
- ResultsScreen
- itinerary.go
- context.Context
- CalendarModal.tsx
- HubRouteSummaryModal.tsx
- VerifyCandidate
- CanonicalSegment
- types/index.ts
- itinerary_test.go
- App.tsx
- auth.ts
- extract.go
- searcher.go
- AuthContext.tsx
- RuntimeConfigContext.tsx
- dealsCache.ts
- IsOpenJaw
- DateRangePicker.tsx
- SelectBestOffer
- ValidateBookingURL
- DraggableBottomSheet.tsx

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 74 edges
2. `useLocale()` - 71 edges
3. `ProviderResult` - 39 edges
4. `MonthDealsScreen()` - 36 edges
5. `ResultsScreen()` - 34 edges
6. `TestResult` - 29 edges
7. `CanonicalItinerary` - 27 edges
8. `ExploreScreen()` - 27 edges
9. `VerifyCandidate()` - 26 edges
10. `writeJSON()` - 25 edges

## Surprising Connections (you probably didn't know these)
- `VerifyCandidate()` --calls--> `extractPrice()`  [INFERRED]
  backend/bookingmatch/verify.go → backend/bookingmatch/extract.go
- `scoreSegment()` --calls--> `textContainsAirport()`  [INFERRED]
  backend/bookingmatch/verify.go → backend/bookingmatch/extract.go
- `handleOutBooking()` --calls--> `ResolveProvider()`  [INFERRED]
  backend/server.go → backend/affiliate.go
- `handleOutBooking()` --calls--> `RecordClick()`  [INFERRED]
  backend/server.go → backend/affiliate.go
- `GetSessionAndOption()` --calls--> `loadSearchSession()`  [INFERRED]
  backend/affiliate.go → backend/server.go

## Import Cycles
- None detected.

## Communities (76 total, 4 thin omitted)

### Community 0 - "googleflights2_provider.go"
Cohesion: 0.08
Nodes (55): findBookingOptionsArray(), firstPartnerURLInMap(), firstStringByKeys(), GoogleFlights2Provider, QuoteBinding, hostFromURL(), parseGF2BookingOptions(), PricesMatchQuote() (+47 more)

### Community 1 - "RootNavigator.tsx"
Cohesion: 0.08
Nodes (22): ErrorBoundary, Props, s, State, LandingScreen(), Nav, styles, DynamicDestinationsStack() (+14 more)

### Community 2 - "FlightDetailsModal.tsx"
Cohesion: 0.09
Nodes (36): AffiliateProvider, AffiliateProviderResponse, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink(), OutboundLinkResponse (+28 more)

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "providers.go"
Cohesion: 0.17
Nodes (18): TestCombineOneWayBatches(), TestCombineOneWayBatches_emptyBatch(), TestCompleteExtraLegs(), TestExtraLegsFingerprint(), TestHasExtraLegs(), TestAttachCanonicalIdentityAll_combineOneWay(), cloneLegs(), CombineOneWayBatches() (+10 more)

### Community 5 - "MonthDealsScreen.tsx"
Cohesion: 0.10
Nodes (35): MonthDealsFormContent(), buildDealsPositioningSignature(), dealBestScore(), fl, fmtDur(), formatDealDate(), hfm, HUB_AIRPORTS (+27 more)

### Community 6 - "dependencies"
Cohesion: 0.04
Nodes (44): @babel/core, expo, @expo/metro-runtime, expo-status-bar, dependencies, expo, @expo/metro-runtime, expo-status-bar (+36 more)

### Community 7 - "useTheme"
Cohesion: 0.12
Nodes (31): s, SearchSummaryBar(), SearchSummaryBarProps, useAuth(), useLocale(), useRuntimeConfigActions(), AdminRuntimeConfigPanel(), ConfigFieldRow() (+23 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (33): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+25 more)

### Community 9 - "net/http.Request"
Cohesion: 0.06
Nodes (82): BuildRedirectURL(), getAffiliateID(), GetClicksSummary(), getOTAProvider(), GetSessionAndOption(), FlightOption, SearchSession, SearchSessionResultsResponse (+74 more)

### Community 10 - "ExploreScreen.tsx"
Cohesion: 0.15
Nodes (25): getAirportEntry(), c, countryFlag(), d, DestCard(), ExploreScreen(), ExploreScreenProps, fmtDate() (+17 more)

### Community 11 - "booking_resolve.go"
Cohesion: 0.13
Nodes (32): acquireBookingResolveSlot(), beginInflightResolve(), bookingResolveCacheKey(), bookingResolveMaxConcurrentFromEnv(), cacheTTLForStatus(), canonicalItineraryForOption(), countVerifiedExactOffers(), envDurationMinutes() (+24 more)

### Community 12 - "ResultsScreen.tsx"
Cohesion: 0.13
Nodes (23): DynamicDestinationsFormContent(), defaultParams, DynamicDestinationsScreen(), Nav, styles, bestScore(), CheapestOption, defaultFormParams (+15 more)

### Community 13 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+15 more)

### Community 14 - "canonical.go"
Cohesion: 0.12
Nodes (35): FlightOption, SearchSession, quoteBindingFromOption(), FlightOption, openJawOption(), TestBookingLinkModeDefaultsToGoogle(), TestBookingRouteFromSessionOption_splitOmitsReturn(), TestBuildGoogleFlightsFallbackFromParams() (+27 more)

### Community 15 - "data/airports.ts"
Cohesion: 0.14
Nodes (16): AIRPORT_DICTIONARY, AIRPORT_ONLY_DICTIONARY, FULL_PLACE_DICTIONARY, lower(), matchesQuery(), PLACE_SEARCH_LIMIT, rankResult(), searchAirportsLocal() (+8 more)

### Community 16 - "LocaleContext.tsx"
Cohesion: 0.19
Nodes (13): EditSearchModal(), EditSearchModalProps, s, getStorage(), languageToLocale(), loadSaved(), LocaleContext, LocaleContextValue (+5 more)

### Community 17 - "flyfix.ts"
Cohesion: 0.25
Nodes (8): apiPost(), FlyfixInsightsGroup, FlyfixIssue, FlyfixRefinedReport, FlyfixSummary, refineIssues(), RefineIssuesRequestBody, cancelSearchSession()

### Community 18 - "server.go"
Cohesion: 0.05
Nodes (75): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, CanonicalFingerprint(), Carrier, CarrierCodes, CreateSearchSessionRequest (+67 more)

### Community 19 - "gf2_deals.go"
Cohesion: 0.19
Nodes (21): exploreDestRow, FullRoundTrip, attachReturnLegKeepPrice(), ensureRoundTripLegs(), exploreDestRowsToMaps(), gf2ExploreResolveDeps(), gf2ExploreSearchOneDestination(), gf2OneRoundTrip() (+13 more)

### Community 20 - "qa_runner.py"
Cohesion: 0.14
Nodes (13): Namespace, Path, Any, Reporting helpers for test execution results., Render terminal summary and persist machine-readable reports., Print user-friendly report to stdout., Write a JSON report and return its path., ReportWriter (+5 more)

### Community 21 - "ApiClient"
Cohesion: 0.14
Nodes (12): ApiClient, Any, HTTP client utilities for executing API test cases., Parse JSON response when possible without raising., Sleep using exponential backoff., Executes HTTP requests with retry and timing support., Close the underlying requests session., Execute one test case and return a populated result. (+4 more)

### Community 22 - "placeSearch.ts"
Cohesion: 0.19
Nodes (29): getAirportDisplayName(), getAirportNameByCode(), getCityDisplayName(), byCode, COUNTRY_DIRECTORY, CountryEntry, getCountryDisplayName(), getCountryEntry() (+21 more)

### Community 23 - "TestResult"
Cohesion: 0.18
Nodes (8): AI and heuristic quality-control analysis for API test results., Analyze result quality with Ollama and rule-based checks., Close underlying HTTP session., Return human-readable quality notes for this result. Rule-based insights are…, ResponseAnalyzer, Stores execution data and findings for one test case., A test passes when there are no error-level issues., TestResult

### Community 24 - "ResponseValidator"
Cohesion: 0.22
Nodes (5): Any, Applies status, schema, and consistency checks., Run all checks and append issues to the result., Resolve a dotted path in a nested JSON-like payload. Supports indexes like…, ResponseValidator

### Community 25 - "Registry"
Cohesion: 0.20
Nodes (7): MultiSearchResult, isSkippedProviderErr(), NewRegistryFromEnv(), parseProviderNames(), GoogleFlights2Provider, Provider, Registry

### Community 26 - "ProviderResult"
Cohesion: 0.10
Nodes (20): DedupeProviderResults(), ItineraryFingerprint(), mergeSelfTransfer(), TotalStops(), uniqueStrings(), newGF2Cache(), AttachCanonicalIdentityAll(), TestDedupeKeepsCheaper() (+12 more)

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.32
Nodes (13): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+5 more)

### Community 29 - "ThemeContext.tsx"
Cohesion: 0.13
Nodes (18): getPhrasesForLanguage(), SEARCH_BUTTON_PHRASES, SEARCH_PROGRESS_PHRASES, s, SearchProgressBanner(), SearchProgressBannerProps, ExtraLeg, Props (+10 more)

### Community 30 - "handleExplore"
Cohesion: 0.10
Nodes (26): airportCoord, exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut(), getAirportCoord() (+18 more)

### Community 31 - "backend_api_contracts.md"
Cohesion: 0.17
Nodes (11): 1.1 Create Search Session, 1.2 Get Search Session Status & Results, 1.3 Cancel Search Session (Optional, MVP+), 1. Flight Search Sessions, 2.1 Get Monthly Deals, 2. Monthly Deals API, 3.1 Search Airports & Cities, 3. Airport & City Autocomplete (+3 more)

### Community 32 - "testing.T"
Cohesion: 0.14
Nodes (23): TestApifyErrorMessage(), TestBuildActorInputSolidcodeOnly(), TestDetectSelfTransfer(), TestKiwiApifyTimeout(), TestParseKiwiApifyItemsSolidcodeShape(), TestParseKiwiEmptyAndInvalid(), TestRegistrySearchAll_openJawGF2FailNotMaskedByKiwiSkip(), TestRegistrySearchAllPartialFailure() (+15 more)

### Community 33 - "TopNavMenu.tsx"
Cohesion: 0.10
Nodes (21): ICONS, KEYS, s, SortBar(), SortBarProps, SortOption, MobileNavRow(), NavIconName (+13 more)

### Community 34 - "api.ts"
Cohesion: 0.13
Nodes (14): AirportCityType, AirportLike, ANYWHERE_CODE, BaggageClass, Carrier, COUNTRY_DEST_PREFIX, ExplorePriceSource, FareBreakdown (+6 more)

### Community 35 - "ValidationIssue"
Cohesion: 0.18
Nodes (7): Any, Serialize nested result for report output., Represents a single validation or analysis finding., Serialize issue to dictionary., Serialize case to dictionary., Append a new issue to this result., ValidationIssue

### Community 36 - "Backend QA Automation Tool"
Cohesion: 0.18
Nodes (10): Backend QA Automation Tool, Features, If the run feels slow or “stuck”, Notes, Optional AI Setup (Ollama), Output, Project Structure, Run (+2 more)

### Community 37 - "KiwiApifyProvider"
Cohesion: 0.22
Nodes (6): apifyErrorMessage(), flattenKiwiItems(), NewKiwiApifyProvider(), stringField(), truncateStr(), KiwiApifyProvider

### Community 38 - "kiwi_apify_provider.go"
Cohesion: 0.32
Nodes (15): asArray(), collectCarriers(), detectSelfTransfer(), extractKiwiLegs(), firstFloat(), firstString(), kiwiSegmentFromMap(), mapsToSegments() (+7 more)

### Community 39 - "search.ts"
Cohesion: 0.32
Nodes (11): CachedResult, fetchFresh(), getFromStorage(), getSearchSessionResults(), getStorage(), paramsMatch(), resultsCache, setToStorage() (+3 more)

### Community 40 - "DynamicDestinationsFormContent.tsx"
Cohesion: 0.13
Nodes (26): AppIcon(), AppIconLibrary, AppIconProps, styles, FormHeroHeader(), FormHeroHeaderProps, styles, formCardStyles (+18 more)

### Community 41 - "models.py"
Cohesion: 0.25
Nodes (5): Core data models for the API QA runner., Set completion timestamp., Return an ISO-8601 UTC timestamp., utc_now_iso(), Validation rules for API responses.

### Community 42 - "CanonicalItinerary"
Cohesion: 0.17
Nodes (15): defaultBookingMatchRunner(), elapsedMs(), logMatchEvent(), BookingOffer, MatchResult, MatchItinerary(), NewResolver(), truncateStr() (+7 more)

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "write-spa-fallbacks.mjs"
Cohesion: 0.33
Nodes (5): __dirname, dist, indexHtml, indexPath, SPA_ROUTES

### Community 45 - "FlightResultCard.tsx"
Cohesion: 0.12
Nodes (27): AIRLINE_NAMES, getAirlineName(), AIRLINE_FULL_NAMES, NOTE: This is a starter subset of IATA airlines., f, FiltersPanel(), FiltersPanelProps, FlightDetailsModalProps (+19 more)

### Community 53 - "loadSearchSession"
Cohesion: 0.22
Nodes (22): loadSearchSession(), TestLoadSearchSession_Expiry(), searchSessionTTL(), startSearchSessionCleanup(), cleanupPersistedSessions(), SearchSessionResultsResponse, importLegacyJSONSessions(), initSessionStore() (+14 more)

### Community 54 - "client.ts"
Cohesion: 0.36
Nodes (8): apiRequest(), apiUrl(), isLocalHostname(), IMPORTANT: Expo/Metro statically inlines EXPO_PUBLIC_* only when accessed via, resolveApiBase(), adminAuthHeaders(), fetchAdminRuntimeConfig(), saveAdminRuntimeConfig()

### Community 55 - "ResultsScreen"
Cohesion: 0.13
Nodes (29): createSearchSession(), currentGeneration(), delay(), findCheapestOptionForParams(), ResultsScreen(), defaultParams, SearchFormScreen(), styles (+21 more)

### Community 56 - "itinerary.go"
Cohesion: 0.20
Nodes (20): operatingFlightForMatch(), BuildCanonicalItinerary(), canonicalSegmentFromProvider(), FingerprintDebugString(), isIATACarrierCode(), flightNumbersEquivalent(), ResultMatchesItinerary(), segmentsLooselyMatch() (+12 more)

### Community 57 - "context.Context"
Cohesion: 0.24
Nodes (7): GoogleFlights2Provider, newGF2RateLimiter(), NewGoogleFlights2Provider(), truncateGF2(), context.Context, gf2RateLimiter, SearchRequest

### Community 58 - "CalendarModal.tsx"
Cohesion: 0.38
Nodes (6): buildMonthDays(), CalendarModal(), getMonthStart(), Props, styles, WEEKDAYS

### Community 59 - "HubRouteSummaryModal.tsx"
Cohesion: 0.17
Nodes (13): DisplayPrice(), DisplayPriceProps, HubRouteLeg, HubRouteSummaryModal(), HubRouteSummaryModalProps, s, CheaperCitiesOption, CheaperCitiesSection() (+5 more)

### Community 60 - "VerifyCandidate"
Cohesion: 0.26
Nodes (20): classifyURLType(), cfgTest(), TestClassifyURLType_genericVsExact(), testConnectingTLVJFK(), TestGenerateQueries_connecting(), TestGenerateQueries_direct(), testItineraryOS860(), TestResolver_pipeline_exactMatch() (+12 more)

### Community 61 - "CanonicalSegment"
Cohesion: 0.26
Nodes (16): textContainsAny(), timeMatches(), connectingFlightQueries(), directFlightQueries(), GenerateQueries(), minutesOfDay(), segmentArrTimeVariants(), segmentDateISO() (+8 more)

### Community 62 - "types/index.ts"
Cohesion: 0.11
Nodes (22): searchAirports(), apiGet(), getDealsRange(), GetDealsRangeParams, getMonthDeals(), GetMonthDealsParams, ExploreResponse, getExploreDestinations() (+14 more)

### Community 63 - "itinerary_test.go"
Cohesion: 0.22
Nodes (14): AttachCanonicalIdentity(), segTLVJFK(), TestCanonicalItineraryFingerprint_connectingFlight(), TestCanonicalItineraryFingerprint_differentFlightsDoNotCollide(), TestCanonicalItineraryFingerprint_directFlight(), TestCanonicalItineraryFingerprint_excludesPrice(), TestCanonicalItineraryFingerprint_formattingStable(), TestCanonicalItineraryFingerprint_gf2AirlineNameStable() (+6 more)

### Community 64 - "App.tsx"
Cohesion: 0.18
Nodes (12): App(), linking, RTLWrapper(), API_BASE, useExchangeRates(), ThemeProvider(), convertPrice(), CURRENCY_SYMBOLS (+4 more)

### Community 65 - "auth.ts"
Cohesion: 0.29
Nodes (13): authHeaders(), AuthUser, changePassword(), createUser(), deleteUser(), fetchAuthMe(), fetchUsers(), LoginResponse (+5 more)

### Community 66 - "extract.go"
Cohesion: 0.19
Nodes (10): corpusText(), domainFromURL(), extractFlightNumbers(), extractPrice(), flightNumberInText(), textContainsAirport(), parseSerpAPIResults(), truncate() (+2 more)

### Community 67 - "searcher.go"
Cohesion: 0.27
Nodes (12): DefaultConfig(), envInt(), NewPageFetcher(), NewSerpAPISearcher(), NewWebSearcherFromConfig(), stripHTMLTags(), Config, PageFetcher (+4 more)

### Community 68 - "AuthContext.tsx"
Cohesion: 0.25
Nodes (12): loginWithPassword(), registerAccount(), AdminAuthProvider, applyUser(), AuthContext, AuthContextValue, AuthProvider(), clearUser() (+4 more)

### Community 69 - "RuntimeConfigContext.tsx"
Cohesion: 0.23
Nodes (10): fetchRuntimeConfig(), setRuntimeConfigStore(), RuntimeConfigContext, RuntimeConfigContextValue, RuntimeConfigProvider(), DEFAULT_RUNTIME_CONFIG, RUNTIME_CONFIG_FIELDS, RuntimeConfig (+2 more)

### Community 70 - "dealsCache.ts"
Cohesion: 0.30
Nodes (13): CachedDealsResults, clearPendingDealsParams(), DealsParams, dealsParamsFingerprint(), getCachedDealsResults(), getLocalStorage(), getPendingDealsParams(), getSessionStorage() (+5 more)

### Community 71 - "IsOpenJaw"
Cohesion: 0.29
Nodes (8): TestIsOpenJaw(), TestResolveReturnAirports_classic(), TestResolveReturnAirports_openJaw(), TestSanitizeStandardSearchRequest(), IsOpenJaw(), ResolveReturnAirports(), TestClassicRoundTrip_usesNativeSearchPath(), TestOpenJaw_usesDecomposedSearchPath()

### Community 72 - "DateRangePicker.tsx"
Cohesion: 0.33
Nodes (9): useRuntimeConfig(), buildMonthDays(), DateRangePicker(), DateRangePickerProps, getMonthStart(), monthStartForYmd(), parseYmdUtc(), styles (+1 more)

### Community 73 - "SelectBestOffer"
Cohesion: 0.25
Nodes (8): TestSelectBestOffer_conflictingCandidatesPicksBest(), TestSelectBestOffer_missingPrice(), TestSelectBestOffer_multipleMatching(), TestSelectBestOffer_prefersPriceAmongSameURLType(), TestSelectBestOffer_rejectsGenericSearchURL(), TestSelectBestOffer_rejectsUnverified(), SelectBestOffer(), urlTypeRank()

### Community 74 - "ValidateBookingURL"
Cohesion: 0.39
Nodes (6): TestValidateBookingURL_acceptsHTTPS(), TestValidateBookingURL_rejectsEmpty(), TestValidateBookingURL_rejectsJavascript(), TestValidateBookingURL_rejectsLocalhost(), TestValidateBookingURL_rejectsPrivateIP(), ValidateBookingURL()

## Knowledge Gaps
- **279 isolated node(s):** `ClicksByProvider`, `BookingResolveRequest`, `exploreLiveCandidate`, `flightcaptainweb`, `runtimeConfigBounds` (+274 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ProviderResult` connect `ProviderResult` to `googleflights2_provider.go`, `providers.go`, `KiwiApifyProvider`, `kiwi_apify_provider.go`, `CanonicalItinerary`, `server.go`, `gf2_deals.go`, `itinerary.go`, `context.Context`, `itinerary_test.go`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `resolveBookingRedirectURL()` connect `canonical.go` to `itinerary.go`, `net/http.Request`, `server.go`, `context.Context`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `CanonicalSegment` connect `CanonicalSegment` to `itinerary.go`, `CanonicalItinerary`, `server.go`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `ClicksByProvider`, `BookingResolveRequest`, `exploreLiveCandidate` to the rest of the system?**
  _279 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `googleflights2_provider.go` be split into smaller, more focused modules?**
  _Cohesion score 0.0798611111111111 - nodes in this community are weakly interconnected._
- **Should `RootNavigator.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08232118758434548 - nodes in this community are weakly interconnected._
- **Should `FlightDetailsModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09390243902439024 - nodes in this community are weakly interconnected._