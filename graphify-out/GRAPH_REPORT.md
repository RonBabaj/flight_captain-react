# Graph Report - workspace  (2026-08-30)

## Corpus Check
- 203 files · ~198,971 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1719 nodes · 4617 edges · 82 communities (78 shown, 4 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 385 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d6feb1d8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- searcher.go
- RootNavigator.tsx
- FlightDetailsModal.tsx
- Issue
- context.Context
- MonthDealsScreen.tsx
- dependencies
- useTheme
- Features
- initTestAuthDB
- googleflights2_provider.go
- extract.go
- net/http.Request
- compilerOptions
- DateRangePicker.tsx
- resolveGF2PartnerOffer
- LocaleContext.tsx
- affiliate.go
- server.go
- time.Time
- qa_runner.py
- ApiClient
- ExploreScreen.tsx
- TestResult
- ResponseValidator
- runtime_config.go
- ProviderResult
- expo
- config_loader.py
- AdminRuntimeConfigPanel.tsx
- ValidateBookingURL
- backend_api_contracts.md
- CalendarModal.tsx
- searchStore.ts
- booking_resolve.go
- ValidationIssue
- Backend QA Automation Tool
- TestExtractCarrierCodes
- kiwi_apify_provider.go
- search.ts
- SearchLoadingOverlay.tsx
- models.py
- testing.T
- Fly-Fix – Frontend
- write-spa-fallbacks.mjs
- App.tsx
- metro.config.js
- __init__.py
- flightcaptainweb
- loadSearchSession
- ErrorBoundary
- ResultsScreen.tsx
- itinerary_test.go
- gf2Cache
- multi_provider_test.go
- SelectBestOffer
- matcher_test.go
- exploreBuildRowsAndQueue
- client.ts
- FlightResultCard.tsx
- SearchRequest
- FiltersPanel.tsx
- types/index.ts
- CanonicalItinerary
- TestApplySoftStrictBaggage
- AuthContext.tsx
- dealsCache.ts
- KiwiApifyProvider
- Registry
- getAirlineName
- CanonicalSegment
- DraggableBottomSheet.tsx
- api.ts
- skyscanner.ts
- affiliate.ts
- exchangeRates.ts
- flyfix.ts
- DatePickerCalendar.tsx

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
- `main()` --calls--> `startExploreSessionCleanup()`  [INFERRED]
  backend/server.go → backend/explore_session.go
- `handleAffiliateProvider()` --calls--> `ResolveProvider()`  [INFERRED]
  backend/server.go → backend/affiliate.go
- `handleOutBooking()` --calls--> `ResolveProvider()`  [INFERRED]
  backend/server.go → backend/affiliate.go
- `RecordClick()` --calls--> `randomID()`  [INFERRED]
  backend/affiliate.go → backend/server.go
- `handleOutBooking()` --calls--> `RecordClick()`  [INFERRED]
  backend/server.go → backend/affiliate.go

## Import Cycles
- None detected.

## Communities (82 total, 4 thin omitted)

### Community 0 - "searcher.go"
Cohesion: 0.15
Nodes (18): corpusText(), domainFromURL(), collectSerpAPIResultMaps(), DefaultConfig(), envInt(), NewPageFetcher(), NewSerpAPISearcher(), NewWebSearcherFromConfig() (+10 more)

### Community 1 - "RootNavigator.tsx"
Cohesion: 0.11
Nodes (25): LandingScreen(), Nav, styles, useIsMobile(), DynamicDestinationsStack(), MonthDealsStack(), Stack, RootNavigator() (+17 more)

### Community 2 - "FlightDetailsModal.tsx"
Cohesion: 0.17
Nodes (20): BookingResolveRequest, BookingResolveResponse, BookingResolveStatus, isSafeBookingUrl(), PublicBookingOffer, resolveBookingOffer(), getAirportNameByCode(), cabinLabel() (+12 more)

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "context.Context"
Cohesion: 0.21
Nodes (7): GoogleFlights2Provider, newGF2RateLimiter(), NewGoogleFlights2Provider(), truncateGF2(), context.Context, sync.Mutex, gf2RateLimiter

### Community 5 - "MonthDealsScreen.tsx"
Cohesion: 0.09
Nodes (38): getFlightDetails(), CheaperCitiesOption, Props, s, buildDealsPositioningSignature(), dealBestScore(), fl, fmtDur() (+30 more)

### Community 6 - "dependencies"
Cohesion: 0.04
Nodes (44): @babel/core, expo, @expo/metro-runtime, expo-status-bar, dependencies, expo, @expo/metro-runtime, expo-status-bar (+36 more)

### Community 7 - "useTheme"
Cohesion: 0.08
Nodes (44): EditSearchModal(), EditSearchModalProps, s, HubRouteLeg, HubRouteSummaryModal(), HubRouteSummaryModalProps, s, s (+36 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (33): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+25 more)

### Community 9 - "initTestAuthDB"
Cohesion: 0.26
Nodes (14): handleAuthLogin(), initAuthStore(), initTestAuthDB(), randomTestPassword(), TestAuthLoginAndChangePassword(), TestAuthRegister(), TestAuthUserManagement(), TestBootstrapAdminPasswordSync() (+6 more)

### Community 10 - "googleflights2_provider.go"
Cohesion: 0.07
Nodes (60): findBookingOptionsArray(), firstPartnerBookingOption(), firstPartnerURLInMap(), firstStringByKeys(), GoogleFlights2Provider, ResolvedPartnerBooking, hostFromURL(), isPartnerBookingList() (+52 more)

### Community 11 - "extract.go"
Cohesion: 0.30
Nodes (13): extractFlightNumbers(), flightNumberInText(), flightNumbersEquivalent(), splitFlightDesignator(), textContainsAirport(), textContainsAny(), timeMatches(), conflictingFlightNumberInText() (+5 more)

### Community 12 - "net/http.Request"
Cohesion: 0.16
Nodes (36): authUserJSON(), bearerTokenFromRequest(), bootstrapAdminUser(), createAuthSession(), envFlagTrue(), handleAuthChangePassword(), handleAuthLogout(), handleAuthMe() (+28 more)

### Community 13 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+15 more)

### Community 14 - "DateRangePicker.tsx"
Cohesion: 0.22
Nodes (16): useRuntimeConfig(), buildMonthDays(), DateRangePicker(), DateRangePickerProps, getMonthStart(), monthStartForYmd(), parseYmdUtc(), styles (+8 more)

### Community 15 - "resolveGF2PartnerOffer"
Cohesion: 0.06
Nodes (86): allocateLegQuoteAmount(), applySearchQuoteToOffer(), attachQuotedPriceMeta(), bookingMatchPriceNormalizer(), flightLegDurationMinutes(), gf2PartnerOfferFromQuoteURL(), gf2PartnerOfferFromResolved(), gf2PartnerOfferFromURL() (+78 more)

### Community 16 - "LocaleContext.tsx"
Cohesion: 0.20
Nodes (15): getStorage(), languageToLocale(), loadSaved(), LocaleContext, LocaleContextValue, LocaleProvider(), save(), VALID_CURRENCIES (+7 more)

### Community 17 - "affiliate.go"
Cohesion: 0.13
Nodes (23): BuildRedirectURL(), getAffiliateID(), GetClicksSummary(), getOTAProvider(), GetSessionAndOption(), FlightOption, SearchSession, SearchSessionResultsResponse (+15 more)

### Community 18 - "server.go"
Cohesion: 0.07
Nodes (58): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, Carrier, CarrierCodes, CreateSearchSessionRequest, DayDeal (+50 more)

### Community 19 - "time.Time"
Cohesion: 0.14
Nodes (29): mergeExplorePriceRows(), exploreSessionKey(), getExploreSession(), newExploreSessionID(), putExploreSession(), startExploreSessionCleanup(), exploreDestRow, exploreLiveCandidate (+21 more)

### Community 20 - "qa_runner.py"
Cohesion: 0.14
Nodes (13): Namespace, Path, Any, Reporting helpers for test execution results., Render terminal summary and persist machine-readable reports., Print user-friendly report to stdout., Write a JSON report and return its path., ReportWriter (+5 more)

### Community 21 - "ApiClient"
Cohesion: 0.14
Nodes (12): ApiClient, Any, HTTP client utilities for executing API test cases., Parse JSON response when possible without raising., Sleep using exponential backoff., Executes HTTP requests with retry and timing support., Close the underlying requests session., Execute one test case and return a populated result. (+4 more)

### Community 22 - "ExploreScreen.tsx"
Cohesion: 0.09
Nodes (56): getMonthDeals(), getExploreDestinations(), AIRPORT_DICTIONARY, AIRPORT_ONLY_DICTIONARY, FULL_PLACE_DICTIONARY, getAirportDisplayName(), getAirportEntry(), getCityDisplayName() (+48 more)

### Community 23 - "TestResult"
Cohesion: 0.18
Nodes (8): AI and heuristic quality-control analysis for API test results., Analyze result quality with Ollama and rule-based checks., Close underlying HTTP session., Return human-readable quality notes for this result. Rule-based insights are…, ResponseAnalyzer, Stores execution data and findings for one test case., A test passes when there are no error-level issues., TestResult

### Community 24 - "ResponseValidator"
Cohesion: 0.22
Nodes (5): Any, Applies status, schema, and consistency checks., Run all checks and append issues to the result., Resolve a dotted path in a nested JSON-like payload. Supports indexes like…, ResponseValidator

### Community 25 - "runtime_config.go"
Cohesion: 0.22
Nodes (16): adminAccessConfigured(), configRangeError, adminTokenConfigured(), defaultRuntimeConfig(), errConfigOutOfRange(), getRuntimeConfig(), handleAdminRuntimeConfig(), initRuntimeConfigStore() (+8 more)

### Community 26 - "ProviderResult"
Cohesion: 0.21
Nodes (20): AttachCanonicalIdentityAll(), cloneLegs(), CombineOneWayBatches(), CompleteExtraLegs(), extraLegMaxPerBatch(), ExtraLegsFingerprint(), finalizeCombinedBatches(), MultiSearchResult (+12 more)

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.32
Nodes (13): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+5 more)

### Community 29 - "AdminRuntimeConfigPanel.tsx"
Cohesion: 0.16
Nodes (20): apiRequest(), adminAuthHeaders(), fetchAdminRuntimeConfig(), fetchRuntimeConfig(), saveAdminRuntimeConfig(), setRuntimeConfigStore(), RuntimeConfigContext, RuntimeConfigContextValue (+12 more)

### Community 30 - "ValidateBookingURL"
Cohesion: 0.39
Nodes (6): TestValidateBookingURL_acceptsHTTPS(), TestValidateBookingURL_rejectsEmpty(), TestValidateBookingURL_rejectsJavascript(), TestValidateBookingURL_rejectsLocalhost(), TestValidateBookingURL_rejectsPrivateIP(), ValidateBookingURL()

### Community 31 - "backend_api_contracts.md"
Cohesion: 0.17
Nodes (11): 1.1 Create Search Session, 1.2 Get Search Session Status & Results, 1.3 Cancel Search Session (Optional, MVP+), 1. Flight Search Sessions, 2.1 Get Monthly Deals, 2. Monthly Deals API, 3.1 Search Airports & Cities, 3. Airport & City Autocomplete (+3 more)

### Community 32 - "CalendarModal.tsx"
Cohesion: 0.38
Nodes (6): buildMonthDays(), CalendarModal(), getMonthStart(), Props, styles, WEEKDAYS

### Community 33 - "searchStore.ts"
Cohesion: 0.17
Nodes (13): ICONS, KEYS, s, SortBarProps, SortOption, defaultFilters, isCurrentSearchGeneration(), searchActions (+5 more)

### Community 34 - "booking_resolve.go"
Cohesion: 0.10
Nodes (42): acquireBookingResolveSlot(), beginInflightResolve(), bookingResolveCacheKey(), bookingResolveMaxConcurrentFromEnv(), cacheTTLForStatus(), canonicalItineraryForOption(), countVerifiedExactOffers(), envDurationMinutes() (+34 more)

### Community 35 - "ValidationIssue"
Cohesion: 0.18
Nodes (7): Any, Serialize nested result for report output., Represents a single validation or analysis finding., Serialize issue to dictionary., Serialize case to dictionary., Append a new issue to this result., ValidationIssue

### Community 36 - "Backend QA Automation Tool"
Cohesion: 0.18
Nodes (10): Backend QA Automation Tool, Features, If the run feels slow or “stuck”, Notes, Optional AI Setup (Ollama), Output, Project Structure, Run (+2 more)

### Community 37 - "TestExtractCarrierCodes"
Cohesion: 0.83
Nodes (3): makeOfferWithCarriers(), TestExtractCarrierCodes(), TestPrimaryDisplayCarrier()

### Community 38 - "kiwi_apify_provider.go"
Cohesion: 0.34
Nodes (14): asArray(), collectCarriers(), detectSelfTransfer(), extractKiwiLegs(), firstFloat(), firstString(), kiwiSegmentFromMap(), mapsToSegments() (+6 more)

### Community 39 - "search.ts"
Cohesion: 0.27
Nodes (14): CachedResult, createSearchSession(), fetchFresh(), getFromStorage(), getSearchSessionResults(), getStorage(), paramsMatch(), resultsCache (+6 more)

### Community 40 - "SearchLoadingOverlay.tsx"
Cohesion: 0.23
Nodes (10): getPhrasesForLanguage(), SEARCH_BUTTON_PHRASES, SEARCH_PROGRESS_PHRASES, s, SearchProgressBanner(), SearchProgressBannerProps, ExtraLeg, Props (+2 more)

### Community 41 - "models.py"
Cohesion: 0.25
Nodes (5): Core data models for the API QA runner., Set completion timestamp., Return an ISO-8601 UTC timestamp., utc_now_iso(), Validation rules for API responses.

### Community 42 - "testing.T"
Cohesion: 0.14
Nodes (22): TestFlightNumbersEquivalent_leadingZeros(), TestAttachReturnLegKeepPrice(), TestEnsureRoundTripLegs_nilSafe(), TestEnsureRoundTripLegs_noOpWhenTwoLegs(), TestCombineOneWayBatches(), TestCombineOneWayBatches_emptyBatch(), TestCombineOneWayBatches_openJawReturnDiversity(), TestCompleteExtraLegs() (+14 more)

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "write-spa-fallbacks.mjs"
Cohesion: 0.33
Nodes (5): __dirname, dist, indexHtml, indexPath, SPA_ROUTES

### Community 45 - "App.tsx"
Cohesion: 0.27
Nodes (8): App(), linking, RTLWrapper(), API_BASE, useExchangeRates(), ThemeProvider(), ensureRates(), fetchRates()

### Community 53 - "loadSearchSession"
Cohesion: 0.22
Nodes (22): loadSearchSession(), TestLoadSearchSession_Expiry(), searchSessionTTL(), startSearchSessionCleanup(), cleanupPersistedSessions(), SearchSessionResultsResponse, importLegacyJSONSessions(), initSessionStore() (+14 more)

### Community 54 - "ErrorBoundary"
Cohesion: 0.15
Nodes (4): ErrorBoundary, Props, s, State

### Community 55 - "ResultsScreen.tsx"
Cohesion: 0.08
Nodes (50): defaultParams, DynamicDestinationsScreen(), Nav, styles, bestScore(), CheapestOption, currentGeneration(), defaultFormParams (+42 more)

### Community 56 - "itinerary_test.go"
Cohesion: 0.21
Nodes (15): AttachCanonicalIdentity(), segTLVJFK(), TestAttachCanonicalIdentityAll_combineOneWay(), TestCanonicalItineraryFingerprint_connectingFlight(), TestCanonicalItineraryFingerprint_differentFlightsDoNotCollide(), TestCanonicalItineraryFingerprint_directFlight(), TestCanonicalItineraryFingerprint_formattingStable(), TestCanonicalItineraryFingerprint_gf2AirlineNameStable() (+7 more)

### Community 57 - "gf2Cache"
Cohesion: 0.18
Nodes (7): newGF2Cache(), TestSearchLegCached_usesCache(), sync.RWMutex, gf2Cache, gf2CacheEntry, kiwiCache, kiwiCacheEntry

### Community 58 - "multi_provider_test.go"
Cohesion: 0.11
Nodes (18): DedupeProviderResults(), ItineraryFingerprint(), mergeSelfTransfer(), TotalStops(), uniqueStrings(), parseKiwiApifyItems(), TestApifyErrorMessage(), TestBuildActorInputSolidcodeOnly() (+10 more)

### Community 59 - "SelectBestOffer"
Cohesion: 0.20
Nodes (10): floatPtr(), TestSelectBestOffer_cheapestOTAOverAirline(), TestSelectBestOffer_conflictingCandidatesPicksCheapest(), TestSelectBestOffer_missingPrice(), TestSelectBestOffer_multipleMatching(), TestSelectBestOffer_prefersPriceAmongSameURLType(), TestSelectBestOffer_prefersQuoteMatchingPrice(), TestSelectBestOffer_rejectsGenericSearchURL() (+2 more)

### Community 60 - "matcher_test.go"
Cohesion: 0.17
Nodes (30): classifyURLType(), extractPrice(), cfgTest(), TestClassifyURLType_genericVsExact(), testConnectingTLVJFK(), TestExtractPrice_euroPrefixNotArrivalTime(), TestGenerateQueries_connecting(), TestGenerateQueries_direct() (+22 more)

### Community 61 - "exploreBuildRowsAndQueue"
Cohesion: 0.15
Nodes (16): airportCoord, exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut(), getAirportCoord() (+8 more)

### Community 62 - "client.ts"
Cohesion: 0.14
Nodes (16): searchAirports(), apiGet(), apiUrl(), isLocalHostname(), IMPORTANT: Expo/Metro statically inlines EXPO_PUBLIC_* only when accessed via, resolveApiBase(), getDealsRange(), GetDealsRangeParams (+8 more)

### Community 63 - "FlightResultCard.tsx"
Cohesion: 0.24
Nodes (15): c, fmtShortDate(), fmtTime(), LegScheduleBlock(), toValidMs(), FlightSegment, LayoverSummary, buildLegPreviewSummary() (+7 more)

### Community 64 - "SearchRequest"
Cohesion: 0.23
Nodes (11): TestIsOpenJaw(), TestResolveReturnAirports_classic(), TestResolveReturnAirports_openJaw(), TestSanitizeStandardSearchRequest(), SearchRequest, HasExtraLegs(), IsOpenJaw(), ResolveReturnAirports() (+3 more)

### Community 65 - "FiltersPanel.tsx"
Cohesion: 0.20
Nodes (13): f, FiltersPanel(), FiltersPanelProps, FlightDetailsModalProps, FlightResultCardProps, PositioningLegResult, SearchFilters, FlightOption (+5 more)

### Community 66 - "types/index.ts"
Cohesion: 0.11
Nodes (30): AppIcon(), AppIconLibrary, AppIconProps, styles, FormHeroHeader(), FormHeroHeaderProps, styles, formCardStyles (+22 more)

### Community 67 - "CanonicalItinerary"
Cohesion: 0.23
Nodes (13): defaultBookingMatchRunner(), elapsedMs(), logMatchEvent(), MatchResult, countVerifiedPricedOffers(), itineraryDebugFields(), MatchItinerary(), NewResolver() (+5 more)

### Community 68 - "TestApplySoftStrictBaggage"
Cohesion: 0.52
Nodes (6): applySoftStrictBaggage(), makeOfferWithBags(), makeOfferWithMissingBags(), TestApplySoftStrictBaggage(), TestClassifyOfferBaggage(), classifyOfferBaggage()

### Community 69 - "AuthContext.tsx"
Cohesion: 0.16
Nodes (24): authHeaders(), AuthUser, changePassword(), createUser(), deleteUser(), fetchAuthMe(), fetchUsers(), LoginResponse (+16 more)

### Community 70 - "dealsCache.ts"
Cohesion: 0.25
Nodes (15): DealsState, MonthDealsResponse, CachedDealsResults, clearPendingDealsParams(), DealsParams, dealsParamsFingerprint(), getCachedDealsResults(), getLocalStorage() (+7 more)

### Community 71 - "KiwiApifyProvider"
Cohesion: 0.27
Nodes (6): apifyErrorMessage(), flattenKiwiItems(), NewKiwiApifyProvider(), stringField(), truncateStr(), KiwiApifyProvider

### Community 72 - "Registry"
Cohesion: 0.20
Nodes (7): MultiSearchResult, isSkippedProviderErr(), NewRegistryFromEnv(), parseProviderNames(), GoogleFlights2Provider, Provider, Registry

### Community 73 - "getAirlineName"
Cohesion: 0.27
Nodes (9): AIRLINE_NAMES, getAirlineName(), AIRLINE_FULL_NAMES, NOTE: This is a starter subset of IATA airlines., buildRoutePath(), FlightResultCard(), displayAirlineLabel(), distinctMarketingCarriers() (+1 more)

### Community 74 - "CanonicalSegment"
Cohesion: 0.15
Nodes (31): connectingFlightQueries(), directFlightQueries(), legRouteQueries(), minutesOfDay(), segmentArrTimeVariants(), segmentDateISO(), segmentDateVariants(), segmentDepTimeVariants() (+23 more)

### Community 76 - "api.ts"
Cohesion: 0.17
Nodes (11): AirportCityType, AirportLike, BaggageClass, Carrier, COUNTRY_DEST_PREFIX, ExplorePriceSource, FareBreakdown, FlightLeg (+3 more)

### Community 77 - "skyscanner.ts"
Cohesion: 0.42
Nodes (10): BookingHop, bookingHopsFromOption(), firstSeg(), isClassicRoundTripLegs(), isoDatePrefix(), isSplitBookingItinerary(), lastSeg(), legNeedsSegmentSplit() (+2 more)

### Community 78 - "affiliate.ts"
Cohesion: 0.27
Nodes (9): AffiliateProvider, AffiliateProviderResponse, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink(), OutboundLinkResponse (+1 more)

### Community 79 - "exchangeRates.ts"
Cohesion: 0.31
Nodes (8): DisplayPrice(), DisplayPriceProps, convertPrice(), CURRENCY_SYMBOLS, CurrencyCode, getCurrencySymbol(), getDisplayPrice(), ratesToUSD

### Community 80 - "flyfix.ts"
Cohesion: 0.25
Nodes (8): apiPost(), FlyfixInsightsGroup, FlyfixIssue, FlyfixRefinedReport, FlyfixSummary, refineIssues(), RefineIssuesRequestBody, cancelSearchSession()

### Community 81 - "DatePickerCalendar.tsx"
Cohesion: 0.43
Nodes (6): DatePickerCalendar(), DatePickerCalendarProps, getNext14Dates(), getRangeStartEnd(), styles, WEEKDAYS

## Knowledge Gaps
- **277 isolated node(s):** `ClicksByProvider`, `BookingResolveRequest`, `exploreLiveCandidate`, `flightcaptainweb`, `runtimeConfigBounds` (+272 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `CanonicalItinerary` connect `CanonicalItinerary` to `booking_resolve.go`, `context.Context`, `CanonicalSegment`, `googleflights2_provider.go`, `resolveGF2PartnerOffer`, `server.go`, `ProviderResult`, `matcher_test.go`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `BookingOffer` connect `resolveGF2PartnerOffer` to `booking_resolve.go`, `CanonicalItinerary`, `time.Time`, `SelectBestOffer`, `matcher_test.go`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `CanonicalSegment` connect `CanonicalSegment` to `time.Time`, `CanonicalItinerary`, `extract.go`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `ClicksByProvider`, `BookingResolveRequest`, `exploreLiveCandidate` to the rest of the system?**
  _277 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `RootNavigator.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10695187165775401 - nodes in this community are weakly interconnected._
- **Should `Issue` be split into smaller, more focused modules?**
  _Cohesion score 0.1036036036036036 - nodes in this community are weakly interconnected._
- **Should `MonthDealsScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._