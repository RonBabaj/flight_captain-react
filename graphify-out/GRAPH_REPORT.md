# Graph Report - workspace  (2026-08-30)

## Corpus Check
- 207 files · ~200,597 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1736 nodes · 4681 edges · 87 communities (83 shown, 4 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 396 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c07bfea2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- searcher.go
- RootNavigator.tsx
- FlightDetailsModal.tsx
- Issue
- SearchFormScreen.tsx
- MonthDealsScreen.tsx
- dependencies
- useTheme
- Features
- net/http.Request
- googleflights2_provider.go
- CanonicalItinerary
- ExploreScreen.tsx
- compilerOptions
- DateRangePicker.tsx
- resolveGF2PartnerOffer
- LocaleContext.tsx
- affiliate.go
- server.go
- context.Context
- qa_runner.py
- ApiClient
- placeSearch.ts
- TestResult
- ResponseValidator
- runtime_config.go
- ProviderResult
- expo
- config_loader.py
- RuntimeConfigContext.tsx
- AuthContext.tsx
- backend_api_contracts.md
- CalendarModal.tsx
- flightTimeToMs
- booking_resolve.go
- ValidationIssue
- Backend QA Automation Tool
- CanonicalItineraryFingerprint
- kiwi_apify_provider.go
- search.ts
- ThemeContext.tsx
- models.py
- testing.T
- Fly-Fix – Frontend
- write-spa-fallbacks.mjs
- handleExplore
- metro.config.js
- __init__.py
- flightcaptainweb
- loadSearchSession
- ErrorBoundary
- ResultsScreen.tsx
- BookingOffer
- gf2Cache
- DedupeProviderResults
- types/index.ts
- matcher_test.go
- exploreBuildRowsAndQueue
- client.ts
- FlightResultCard.tsx
- SearchRequest
- store/index.ts
- useLocale
- itinerary.go
- itinerary_test.go
- data/airports.ts
- dealsCache.ts
- KiwiApifyProvider
- Registry
- FiltersPanel.tsx
- CanonicalSegment
- DraggableBottomSheet.tsx
- initTestAuthDB
- skyscanner.ts
- affiliate.ts
- App.tsx
- flyfix.ts
- DatePickerCalendar.tsx
- searchRouteUrl.ts
- ValidateBookingURL
- TestApplySoftStrictBaggage
- itineraryStops.ts
- TestExtractCarrierCodes

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 74 edges
2. `useLocale()` - 71 edges
3. `ProviderResult` - 44 edges
4. `MonthDealsScreen()` - 36 edges
5. `ResultsScreen()` - 35 edges
6. `VerifyCandidate()` - 30 edges
7. `CanonicalItinerary` - 30 edges
8. `TestResult` - 29 edges
9. `ExploreScreen()` - 27 edges
10. `CanonicalSegment` - 25 edges

## Surprising Connections (you probably didn't know these)
- `handleOutBooking()` --calls--> `ResolveProvider()`  [INFERRED]
  backend/server.go → backend/affiliate.go
- `RecordClick()` --calls--> `randomID()`  [INFERRED]
  backend/affiliate.go → backend/server.go
- `handleOutBooking()` --calls--> `RecordClick()`  [INFERRED]
  backend/server.go → backend/affiliate.go
- `handleAffiliateClicksSummary()` --calls--> `GetClicksSummary()`  [INFERRED]
  backend/server.go → backend/affiliate.go
- `GetSessionAndOption()` --calls--> `loadSearchSession()`  [INFERRED]
  backend/affiliate.go → backend/server.go

## Import Cycles
- None detected.

## Communities (87 total, 4 thin omitted)

### Community 0 - "searcher.go"
Cohesion: 0.15
Nodes (21): corpusText(), domainFromURL(), NewResolver(), collectSerpAPIResultMaps(), DefaultConfig(), envInt(), NewPageFetcher(), NewSerpAPISearcher() (+13 more)

### Community 1 - "RootNavigator.tsx"
Cohesion: 0.10
Nodes (25): LandingScreen(), Nav, styles, useIsMobile(), DynamicDestinationsStack(), Stack, MonthDealsStack(), Stack (+17 more)

### Community 2 - "FlightDetailsModal.tsx"
Cohesion: 0.20
Nodes (15): BookingResolveRequest, BookingResolveResponse, BookingResolveStatus, isSafeBookingUrl(), PublicBookingOffer, resolveBookingOffer(), cabinLabel(), FlightDetailsModal() (+7 more)

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "SearchFormScreen.tsx"
Cohesion: 0.19
Nodes (19): defaultParams, SearchFormScreen(), styles, getParam(), getParams(), isWeb(), parseSearchParamsFromUrl(), SearchUrlState (+11 more)

### Community 5 - "MonthDealsScreen.tsx"
Cohesion: 0.09
Nodes (36): HubRouteLeg, HubRouteSummaryModal(), HubRouteSummaryModalProps, s, CheaperCitiesOption, CheaperCitiesSection(), Props, s (+28 more)

### Community 6 - "dependencies"
Cohesion: 0.04
Nodes (44): @babel/core, expo, @expo/metro-runtime, expo-status-bar, dependencies, expo, @expo/metro-runtime, expo-status-bar (+36 more)

### Community 7 - "useTheme"
Cohesion: 0.12
Nodes (27): useAuth(), useRuntimeConfig(), useRuntimeConfigActions(), AdminRuntimeConfigPanel(), ConfigFieldRow(), SECTION_LABEL_KEYS, SECTION_ORDER, styles (+19 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (33): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+25 more)

### Community 9 - "net/http.Request"
Cohesion: 0.17
Nodes (34): authUserJSON(), bearerTokenFromRequest(), bootstrapAdminUser(), createAuthSession(), envFlagTrue(), handleAuthChangePassword(), handleAuthLogout(), handleAuthMe() (+26 more)

### Community 10 - "googleflights2_provider.go"
Cohesion: 0.06
Nodes (65): AirportLocation(), TestAirportLocation_UnknownFallsBackUTC(), TestParseGF2TimeWithDateHint_AirportLocal(), TestParseGF2TimeWithDateHint_TelAviv(), findBookingOptionsArray(), firstPartnerBookingOption(), firstPartnerURLInMap(), firstStringByKeys() (+57 more)

### Community 11 - "CanonicalItinerary"
Cohesion: 0.20
Nodes (12): bookingMatchPriceNormalizer(), defaultBookingMatchRunner(), elapsedMs(), logMatchEvent(), MatchResult, countVerifiedPricedOffers(), MatchItinerary(), truncateStr() (+4 more)

### Community 12 - "ExploreScreen.tsx"
Cohesion: 0.13
Nodes (27): GetDealsRangeParams, getMonthDeals(), GetMonthDealsParams, getAirportEntry(), c, countryFlag(), d, DestCard() (+19 more)

### Community 13 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+15 more)

### Community 14 - "DateRangePicker.tsx"
Cohesion: 0.36
Nodes (8): buildMonthDays(), DateRangePicker(), DateRangePickerProps, getMonthStart(), monthStartForYmd(), parseYmdUtc(), styles, WEEKDAYS

### Community 15 - "resolveGF2PartnerOffer"
Cohesion: 0.07
Nodes (76): allocateLegQuoteAmount(), applySearchQuoteToOffer(), attachQuotedPriceMeta(), flightLegDurationMinutes(), gf2PartnerOfferFromQuoteURL(), gf2PartnerOfferFromResolved(), gf2PartnerOfferFromURL(), FlightLeg (+68 more)

### Community 16 - "LocaleContext.tsx"
Cohesion: 0.18
Nodes (17): getStorage(), languageToLocale(), loadSaved(), LocaleContext, LocaleContextValue, LocaleProvider(), save(), VALID_CURRENCIES (+9 more)

### Community 17 - "affiliate.go"
Cohesion: 0.15
Nodes (21): BuildRedirectURL(), getAffiliateID(), GetClicksSummary(), getOTAProvider(), GetSessionAndOption(), FlightOption, SearchSession, SearchSessionResultsResponse (+13 more)

### Community 18 - "server.go"
Cohesion: 0.07
Nodes (60): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, Carrier, CarrierCodes, CreateSearchSessionRequest, DayDeal (+52 more)

### Community 19 - "context.Context"
Cohesion: 0.16
Nodes (23): exploreDestRow, FullRoundTrip, attachReturnLegKeepPrice(), ensureRoundTripLegs(), exploreDestRowsToMaps(), gf2ExploreResolveDeps(), gf2ExploreSearchOneDestination(), gf2OneRoundTrip() (+15 more)

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

### Community 25 - "runtime_config.go"
Cohesion: 0.21
Nodes (17): adminAccessConfigured(), configRangeError, adminTokenConfigured(), defaultRuntimeConfig(), errConfigOutOfRange(), getRuntimeConfig(), handleAdminRuntimeConfig(), handleGetRuntimeConfig() (+9 more)

### Community 26 - "ProviderResult"
Cohesion: 0.18
Nodes (18): AttachCanonicalIdentityAll(), cloneLegs(), CombineOneWayBatches(), extraLegMaxPerBatch(), finalizeCombinedBatches(), MultiSearchResult, ProviderResult, ProviderSearchStats (+10 more)

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.32
Nodes (13): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+5 more)

### Community 29 - "RuntimeConfigContext.tsx"
Cohesion: 0.21
Nodes (11): fetchRuntimeConfig(), setRuntimeConfigStore(), RuntimeConfigContext, RuntimeConfigContextValue, RuntimeConfigProvider(), DEFAULT_RUNTIME_CONFIG, RUNTIME_CONFIG_FIELDS, RuntimeConfig (+3 more)

### Community 30 - "AuthContext.tsx"
Cohesion: 0.16
Nodes (24): authHeaders(), AuthUser, changePassword(), createUser(), deleteUser(), fetchAuthMe(), fetchUsers(), LoginResponse (+16 more)

### Community 31 - "backend_api_contracts.md"
Cohesion: 0.17
Nodes (11): 1.1 Create Search Session, 1.2 Get Search Session Status & Results, 1.3 Cancel Search Session (Optional, MVP+), 1. Flight Search Sessions, 2.1 Get Monthly Deals, 2. Monthly Deals API, 3.1 Search Airports & Cities, 3. Airport & City Autocomplete (+3 more)

### Community 32 - "CalendarModal.tsx"
Cohesion: 0.38
Nodes (6): buildMonthDays(), CalendarModal(), getMonthStart(), Props, styles, WEEKDAYS

### Community 33 - "flightTimeToMs"
Cohesion: 0.26
Nodes (11): airportTimeZones, getAirportTimeZone(), fmtDur(), layoverBetween(), legDuration(), renderLeg(), safeDate(), flightMinutesBetween() (+3 more)

### Community 34 - "booking_resolve.go"
Cohesion: 0.12
Nodes (32): acquireBookingResolveSlot(), beginInflightResolve(), bookingOfferSameURL(), bookingResolveCacheKey(), bookingResolveMaxConcurrentFromEnv(), cacheTTLForStatus(), canonicalItineraryForOption(), collectVerifiedBookingOffers() (+24 more)

### Community 35 - "ValidationIssue"
Cohesion: 0.18
Nodes (7): Any, Serialize nested result for report output., Represents a single validation or analysis finding., Serialize issue to dictionary., Serialize case to dictionary., Append a new issue to this result., ValidationIssue

### Community 36 - "Backend QA Automation Tool"
Cohesion: 0.18
Nodes (10): Backend QA Automation Tool, Features, If the run feels slow or “stuck”, Notes, Optional AI Setup (Ollama), Output, Project Structure, Run (+2 more)

### Community 37 - "CanonicalItineraryFingerprint"
Cohesion: 0.26
Nodes (11): handleBookingResolve(), TestCacheTTLForStatus_doesNotCacheMisses(), TestHandleBookingResolve_invalidItinerary(), TestHandleBookingResolve_prefillFallback(), TestHandleBookingResolve_searchUnavailable(), TestHandleBookingResolve_verified(), TestRunBookingMatch_picksCheapestWebOfferOverGF2Partner(), TestRunBookingMatch_usesLegTokenFromSearchQuote() (+3 more)

### Community 38 - "kiwi_apify_provider.go"
Cohesion: 0.26
Nodes (17): asArray(), collectCarriers(), detectSelfTransfer(), extractKiwiLegs(), firstFloat(), firstString(), kiwiSegmentFromMap(), mapsToSegments() (+9 more)

### Community 39 - "search.ts"
Cohesion: 0.24
Nodes (15): CachedResult, createSearchSession(), fetchFresh(), getFromStorage(), getSearchSessionResults(), getStorage(), paramsMatch(), resultsCache (+7 more)

### Community 40 - "ThemeContext.tsx"
Cohesion: 0.13
Nodes (18): getPhrasesForLanguage(), SEARCH_BUTTON_PHRASES, SEARCH_PROGRESS_PHRASES, s, SearchProgressBanner(), SearchProgressBannerProps, ExtraLeg, Props (+10 more)

### Community 41 - "models.py"
Cohesion: 0.25
Nodes (5): Core data models for the API QA runner., Set completion timestamp., Return an ISO-8601 UTC timestamp., utc_now_iso(), Validation rules for API responses.

### Community 42 - "testing.T"
Cohesion: 0.08
Nodes (35): TestClassifyURLType_genericVsExact(), TestExtractPrice_euroPrefixNotArrivalTime(), TestFlightNumbersEquivalent_leadingZeros(), TestAttachReturnLegKeepPrice(), TestEnsureRoundTripLegs_nilSafe(), TestEnsureRoundTripLegs_noOpWhenTwoLegs(), TestCombineOneWayBatches(), TestCombineOneWayBatches_emptyBatch() (+27 more)

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "write-spa-fallbacks.mjs"
Cohesion: 0.33
Nodes (5): __dirname, dist, indexHtml, indexPath, SPA_ROUTES

### Community 45 - "handleExplore"
Cohesion: 0.24
Nodes (11): exploreSessionKey(), getExploreSession(), newExploreSessionID(), putExploreSession(), startExploreSessionCleanup(), exploreSession, corsMiddleware(), handleExplore() (+3 more)

### Community 53 - "loadSearchSession"
Cohesion: 0.22
Nodes (22): loadSearchSession(), TestLoadSearchSession_Expiry(), searchSessionTTL(), startSearchSessionCleanup(), cleanupPersistedSessions(), SearchSessionResultsResponse, importLegacyJSONSessions(), initSessionStore() (+14 more)

### Community 54 - "ErrorBoundary"
Cohesion: 0.15
Nodes (4): ErrorBoundary, Props, s, State

### Community 55 - "ResultsScreen.tsx"
Cohesion: 0.14
Nodes (25): defaultParams, DynamicDestinationsScreen(), Nav, styles, bestScore(), CheapestOption, currentGeneration(), defaultFormParams (+17 more)

### Community 56 - "BookingOffer"
Cohesion: 0.15
Nodes (22): floatPtr(), TestSelectBestOffer_cheapestOTAOverAirline(), TestSelectBestOffer_conflictingCandidatesPicksCheapest(), TestSelectBestOffer_missingPrice(), TestSelectBestOffer_multipleMatching(), TestSelectBestOffer_prefersPriceAmongSameURLType(), TestSelectBestOffer_prefersQuoteMatchingPrice(), TestSelectBestOffer_rejectsGenericSearchURL() (+14 more)

### Community 57 - "gf2Cache"
Cohesion: 0.13
Nodes (10): newGF2Cache(), newGF2RateLimiter(), NewGoogleFlights2Provider(), TestOpenJaw_usesDecomposedSearchPath(), TestSearchLegCached_usesCache(), sync.RWMutex, gf2Cache, gf2CacheEntry (+2 more)

### Community 58 - "DedupeProviderResults"
Cohesion: 0.43
Nodes (5): DedupeProviderResults(), ItineraryFingerprint(), mergeSelfTransfer(), TotalStops(), uniqueStrings()

### Community 59 - "types/index.ts"
Cohesion: 0.12
Nodes (15): ExploreResponse, getExploreDestinations(), GetExploreDestinationsParams, DestCardProps, AirportCityType, AirportLike, BaggageClass, Carrier (+7 more)

### Community 60 - "matcher_test.go"
Cohesion: 0.20
Nodes (26): cfgTest(), testConnectingTLVJFK(), TestGenerateQueries_connecting(), TestGenerateQueries_direct(), TestGenerateQueries_gf2AirlineNameIdentity(), TestGenerateQueries_includesRouteDateBookQuery(), TestGenerateQueries_prioritizesEndToEndLegRoute(), testItineraryOS860() (+18 more)

### Community 61 - "exploreBuildRowsAndQueue"
Cohesion: 0.12
Nodes (19): airportCoord, exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut(), getAirportCoord() (+11 more)

### Community 62 - "client.ts"
Cohesion: 0.20
Nodes (14): searchAirports(), apiGet(), apiRequest(), apiUrl(), isLocalHostname(), IMPORTANT: Expo/Metro statically inlines EXPO_PUBLIC_* only when accessed via, resolveApiBase(), getFlightDetails() (+6 more)

### Community 63 - "FlightResultCard.tsx"
Cohesion: 0.22
Nodes (16): buildRoutePath(), c, FlightResultCard(), fmtShortDate(), LegScheduleBlock(), FlightSegment, LayoverSummary, OutboundSummary (+8 more)

### Community 64 - "SearchRequest"
Cohesion: 0.20
Nodes (14): TestIsOpenJaw(), TestResolveReturnAirports_classic(), TestResolveReturnAirports_openJaw(), TestSanitizeStandardSearchRequest(), CompleteExtraLegs(), ExtraLegsFingerprint(), SearchRequest, HasExtraLegs() (+6 more)

### Community 65 - "store/index.ts"
Cohesion: 0.16
Nodes (16): ICONS, KEYS, s, SortBar(), SortBarProps, SortOption, defaultFilters, isCurrentSearchGeneration() (+8 more)

### Community 66 - "useLocale"
Cohesion: 0.10
Nodes (35): AppIcon(), AppIconLibrary, AppIconProps, styles, EditSearchModal(), EditSearchModalProps, s, FormHeroHeader() (+27 more)

### Community 67 - "itinerary.go"
Cohesion: 0.24
Nodes (17): BuildCanonicalItinerary(), canonicalSegmentFromProvider(), FingerprintDebugString(), isIATACarrierCode(), flightNumbersEquivalent(), ResultMatchesItinerary(), segmentsLooselyMatch(), normalizeCabinClass() (+9 more)

### Community 68 - "itinerary_test.go"
Cohesion: 0.21
Nodes (15): AttachCanonicalIdentity(), segTLVJFK(), TestAttachCanonicalIdentityAll_combineOneWay(), TestCanonicalItineraryFingerprint_connectingFlight(), TestCanonicalItineraryFingerprint_differentFlightsDoNotCollide(), TestCanonicalItineraryFingerprint_directFlight(), TestCanonicalItineraryFingerprint_formattingStable(), TestCanonicalItineraryFingerprint_gf2AirlineNameStable() (+7 more)

### Community 69 - "data/airports.ts"
Cohesion: 0.20
Nodes (12): AIRPORT_DICTIONARY, AIRPORT_ONLY_DICTIONARY, FULL_PLACE_DICTIONARY, lower(), matchesQuery(), PLACE_SEARCH_LIMIT, rankResult(), searchAirportsLocal() (+4 more)

### Community 70 - "dealsCache.ts"
Cohesion: 0.25
Nodes (15): DealsState, MonthDealsResponse, CachedDealsResults, clearPendingDealsParams(), DealsParams, dealsParamsFingerprint(), getCachedDealsResults(), getLocalStorage() (+7 more)

### Community 71 - "KiwiApifyProvider"
Cohesion: 0.27
Nodes (6): apifyErrorMessage(), flattenKiwiItems(), NewKiwiApifyProvider(), stringField(), truncateStr(), KiwiApifyProvider

### Community 72 - "Registry"
Cohesion: 0.20
Nodes (7): MultiSearchResult, isSkippedProviderErr(), NewRegistryFromEnv(), parseProviderNames(), GoogleFlights2Provider, Provider, Registry

### Community 73 - "FiltersPanel.tsx"
Cohesion: 0.20
Nodes (13): AIRLINE_NAMES, getAirlineName(), AIRLINE_FULL_NAMES, NOTE: This is a starter subset of IATA airlines., f, FiltersPanel(), FiltersPanelProps, FlightDetailsModalProps (+5 more)

### Community 74 - "CanonicalSegment"
Cohesion: 0.16
Nodes (29): classifyURLType(), extractFlightNumbers(), extractPrice(), flightNumberInText(), flightNumbersEquivalent(), splitFlightDesignator(), textContainsAirport(), textContainsAny() (+21 more)

### Community 76 - "initTestAuthDB"
Cohesion: 0.49
Nodes (9): handleAuthLogin(), initAuthStore(), initTestAuthDB(), randomTestPassword(), TestAuthLoginAndChangePassword(), TestAuthRegister(), TestAuthUserManagement(), TestBootstrapAdminPasswordSync() (+1 more)

### Community 77 - "skyscanner.ts"
Cohesion: 0.42
Nodes (10): BookingHop, bookingHopsFromOption(), firstSeg(), isClassicRoundTripLegs(), isoDatePrefix(), isSplitBookingItinerary(), lastSeg(), legNeedsSegmentSplit() (+2 more)

### Community 78 - "affiliate.ts"
Cohesion: 0.27
Nodes (9): AffiliateProvider, AffiliateProviderResponse, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink(), OutboundLinkResponse (+1 more)

### Community 79 - "App.tsx"
Cohesion: 0.14
Nodes (16): App(), linking, RTLWrapper(), API_BASE, DisplayPrice(), DisplayPriceProps, useExchangeRates(), RootNavigator() (+8 more)

### Community 80 - "flyfix.ts"
Cohesion: 0.25
Nodes (8): apiPost(), FlyfixInsightsGroup, FlyfixIssue, FlyfixRefinedReport, FlyfixSummary, refineIssues(), RefineIssuesRequestBody, cancelSearchSession()

### Community 81 - "DatePickerCalendar.tsx"
Cohesion: 0.39
Nodes (7): getDealsRange(), DatePickerCalendar(), DatePickerCalendarProps, getNext14Dates(), getRangeStartEnd(), styles, WEEKDAYS

### Community 82 - "searchRouteUrl.ts"
Cohesion: 0.39
Nodes (7): buildSearchString(), openUrlInNewTab(), openUrlInNewTabOrAlert(), openUrlSameTab(), buildFlyFixSearchResultsUrl(), FlyFixLegSearchParams, openFlyFixLegSearchInNewTab()

### Community 83 - "ValidateBookingURL"
Cohesion: 0.39
Nodes (6): TestValidateBookingURL_acceptsHTTPS(), TestValidateBookingURL_rejectsEmpty(), TestValidateBookingURL_rejectsJavascript(), TestValidateBookingURL_rejectsLocalhost(), TestValidateBookingURL_rejectsPrivateIP(), ValidateBookingURL()

### Community 84 - "TestApplySoftStrictBaggage"
Cohesion: 0.52
Nodes (6): applySoftStrictBaggage(), makeOfferWithBags(), makeOfferWithMissingBags(), TestApplySoftStrictBaggage(), TestClassifyOfferBaggage(), classifyOfferBaggage()

### Community 85 - "itineraryStops.ts"
Cohesion: 0.48
Nodes (5): countByStopsFilter(), matchesStopsFilter(), maxStopsPerLeg(), stopsPerLeg(), totalStops()

### Community 86 - "TestExtractCarrierCodes"
Cohesion: 0.83
Nodes (3): makeOfferWithCarriers(), TestExtractCarrierCodes(), TestPrimaryDisplayCarrier()

## Knowledge Gaps
- **278 isolated node(s):** `ClicksByProvider`, `BookingResolveRequest`, `exploreLiveCandidate`, `flightcaptainweb`, `runtimeConfigBounds` (+273 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ProviderResult` connect `ProviderResult` to `SearchRequest`, `itinerary.go`, `itinerary_test.go`, `kiwi_apify_provider.go`, `googleflights2_provider.go`, `CanonicalItinerary`, `resolveGF2PartnerOffer`, `server.go`, `context.Context`, `gf2Cache`, `DedupeProviderResults`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `CanonicalItinerary` connect `CanonicalItinerary` to `booking_resolve.go`, `itinerary.go`, `CanonicalItineraryFingerprint`, `CanonicalSegment`, `googleflights2_provider.go`, `resolveGF2PartnerOffer`, `server.go`, `context.Context`, `ProviderResult`, `matcher_test.go`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `useTheme()` connect `useTheme` to `store/index.ts`, `useLocale`, `FlightDetailsModal.tsx`, `SearchFormScreen.tsx`, `MonthDealsScreen.tsx`, `data/airports.ts`, `RootNavigator.tsx`, `ThemeContext.tsx`, `FiltersPanel.tsx`, `ExploreScreen.tsx`, `DateRangePicker.tsx`, `LocaleContext.tsx`, `placeSearch.ts`, `ResultsScreen.tsx`, `AuthContext.tsx`, `FlightResultCard.tsx`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `ClicksByProvider`, `BookingResolveRequest`, `exploreLiveCandidate` to the rest of the system?**
  _278 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `searcher.go` be split into smaller, more focused modules?**
  _Cohesion score 0.1476923076923077 - nodes in this community are weakly interconnected._
- **Should `RootNavigator.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0990990990990991 - nodes in this community are weakly interconnected._
- **Should `Issue` be split into smaller, more focused modules?**
  _Cohesion score 0.1036036036036036 - nodes in this community are weakly interconnected._