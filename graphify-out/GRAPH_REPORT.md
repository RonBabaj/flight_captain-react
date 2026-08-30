# Graph Report - workspace  (2026-08-30)

## Corpus Check
- 207 files · ~201,326 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1743 nodes · 4728 edges · 76 communities (72 shown, 4 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 404 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `328e2d3c`
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
- auth.go
- context.Context
- BookingOffer
- handleCreateSession
- compilerOptions
- DateRangePicker.tsx
- booking_gf2_resolve.go
- LocaleContext.tsx
- affiliate.go
- server.go
- GoogleFlights2Provider
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
- AuthContext.tsx
- backend_api_contracts.md
- CalendarModal.tsx
- booking_resolve.go
- ValidationIssue
- Backend QA Automation Tool
- CanonicalItinerary
- kiwi_apify_provider.go
- search.ts
- SearchLoadingOverlay.tsx
- models.py
- testing.T
- Fly-Fix – Frontend
- write-spa-fallbacks.mjs
- net/http.Request
- metro.config.js
- __init__.py
- flightcaptainweb
- loadSearchSession
- ErrorBoundary
- ResultsScreen.tsx
- SelectBestOffer
- gf2Cache
- DedupeProviderResults
- matcher_test.go
- time.Time
- client.ts
- SearchRequest
- CreateSearchSessionRequest
- ThemeContext.tsx
- itinerary.go
- itinerary_test.go
- Registry
- CanonicalSegment
- DraggableBottomSheet.tsx
- affiliate.ts
- App.tsx
- flyfix.ts
- DatePickerCalendar.tsx
- ValidateBookingURL
- TestApplySoftStrictBaggage
- TestExtractCarrierCodes

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 74 edges
2. `useLocale()` - 71 edges
3. `ProviderResult` - 44 edges
4. `MonthDealsScreen()` - 36 edges
5. `ResultsScreen()` - 35 edges
6. `CanonicalItinerary` - 32 edges
7. `VerifyCandidate()` - 30 edges
8. `TestResult` - 29 edges
9. `ExploreScreen()` - 27 edges
10. `runBookingMatch()` - 25 edges

## Surprising Connections (you probably didn't know these)
- `handleExplore()` --calls--> `newExploreSessionID()`  [INFERRED]
  backend/server.go → backend/explore_session.go
- `handleExplore()` --calls--> `exploreSessionKey()`  [INFERRED]
  backend/server.go → backend/explore_session.go
- `handleAffiliateOutboundLink()` --calls--> `ResolveProvider()`  [INFERRED]
  backend/server.go → backend/affiliate.go
- `handleAffiliateProvider()` --calls--> `ResolveProvider()`  [INFERRED]
  backend/server.go → backend/affiliate.go
- `handleAffiliateRedirect()` --calls--> `ResolveProvider()`  [INFERRED]
  backend/server.go → backend/affiliate.go

## Import Cycles
- None detected.

## Communities (76 total, 4 thin omitted)

### Community 0 - "searcher.go"
Cohesion: 0.13
Nodes (23): defaultBookingMatchRunner(), webBookingMatchEnabled(), corpusText(), domainFromURL(), NewResolver(), collectSerpAPIResultMaps(), DefaultConfig(), envInt() (+15 more)

### Community 1 - "RootNavigator.tsx"
Cohesion: 0.10
Nodes (26): LandingScreen(), Nav, styles, useIsMobile(), DynamicDestinationsStack(), MonthDealsStack(), Stack, RootNavigator() (+18 more)

### Community 2 - "FlightDetailsModal.tsx"
Cohesion: 0.06
Nodes (62): BookingResolveRequest, BookingResolveResponse, BookingResolveStatus, isSafeBookingUrl(), PublicBookingOffer, resolveBookingOffer(), AIRLINE_NAMES, getAirlineName() (+54 more)

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "SearchFormScreen.tsx"
Cohesion: 0.16
Nodes (22): defaultParams, SearchFormScreen(), styles, buildSearchString(), getParam(), getParams(), isWeb(), parseSearchParamsFromUrl() (+14 more)

### Community 5 - "MonthDealsScreen.tsx"
Cohesion: 0.09
Nodes (45): CheaperCitiesOption, Props, s, buildDealsPositioningSignature(), dealBestScore(), fl, formatDealDate(), hfm (+37 more)

### Community 6 - "dependencies"
Cohesion: 0.04
Nodes (44): @babel/core, expo, @expo/metro-runtime, expo-status-bar, dependencies, expo, @expo/metro-runtime, expo-status-bar (+36 more)

### Community 7 - "useTheme"
Cohesion: 0.10
Nodes (37): DisplayPrice(), DisplayPriceProps, EditSearchModal(), HubRouteLeg, HubRouteSummaryModal(), HubRouteSummaryModalProps, s, SearchSummaryBar() (+29 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (33): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+25 more)

### Community 9 - "auth.go"
Cohesion: 0.17
Nodes (28): authUserJSON(), bearerTokenFromRequest(), bootstrapAdminUser(), createAuthSession(), envFlagTrue(), handleAuthChangePassword(), handleAuthLogin(), handleAuthMe() (+20 more)

### Community 10 - "context.Context"
Cohesion: 0.07
Nodes (67): AirportLocation(), TestAirportLocation_UnknownFallsBackUTC(), TestParseGF2TimeWithDateHint_AirportLocal(), TestParseGF2TimeWithDateHint_TelAviv(), findBookingOptionsArray(), firstPartnerBookingOption(), firstPartnerURLInMap(), firstStringByKeys() (+59 more)

### Community 11 - "BookingOffer"
Cohesion: 0.18
Nodes (14): applySearchQuoteToOffer(), bookingOfferInGF2Sources(), bookingOfferSameURL(), collectVerifiedBookingOffers(), elapsedMs(), logMatchEvent(), BookingOffer, MatchResult (+6 more)

### Community 12 - "handleCreateSession"
Cohesion: 0.13
Nodes (23): CanonicalFingerprint(), CreateSearchSessionRequest, ExtraSearchLeg, FlightOption, LayoverSummary, OutboundSummary, applyPriceNormalization(), applySoftStrictBaggageOptions() (+15 more)

### Community 13 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+15 more)

### Community 14 - "DateRangePicker.tsx"
Cohesion: 0.33
Nodes (9): useRuntimeConfig(), buildMonthDays(), DateRangePicker(), DateRangePickerProps, getMonthStart(), monthStartForYmd(), parseYmdUtc(), styles (+1 more)

### Community 15 - "booking_gf2_resolve.go"
Cohesion: 0.07
Nodes (72): allocateLegQuoteAmount(), attachQuotedPriceMeta(), bookingMatchPriceNormalizer(), dedupeGF2PartnerOffers(), flightLegDurationMinutes(), gf2PartnerOfferFromQuoteURL(), gf2PartnerOfferFromResolved(), gf2PartnerOfferFromURL() (+64 more)

### Community 16 - "LocaleContext.tsx"
Cohesion: 0.22
Nodes (13): getStorage(), languageToLocale(), loadSaved(), LocaleContext, LocaleContextValue, LocaleProvider(), save(), VALID_CURRENCIES (+5 more)

### Community 17 - "affiliate.go"
Cohesion: 0.14
Nodes (22): BuildRedirectURL(), getAffiliateID(), GetClicksSummary(), getOTAProvider(), GetSessionAndOption(), FlightOption, SearchSession, SearchSessionResultsResponse (+14 more)

### Community 18 - "server.go"
Cohesion: 0.08
Nodes (43): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, Carrier, CarrierCodes, DayDeal, startExploreSessionCleanup() (+35 more)

### Community 19 - "GoogleFlights2Provider"
Cohesion: 0.22
Nodes (5): GoogleFlights2Provider, newGF2RateLimiter(), NewGoogleFlights2Provider(), truncateGF2(), gf2RateLimiter

### Community 20 - "qa_runner.py"
Cohesion: 0.14
Nodes (13): Namespace, Path, Any, Reporting helpers for test execution results., Render terminal summary and persist machine-readable reports., Print user-friendly report to stdout., Write a JSON report and return its path., ReportWriter (+5 more)

### Community 21 - "ApiClient"
Cohesion: 0.14
Nodes (12): ApiClient, Any, HTTP client utilities for executing API test cases., Parse JSON response when possible without raising., Sleep using exponential backoff., Executes HTTP requests with retry and timing support., Close the underlying requests session., Execute one test case and return a populated result. (+4 more)

### Community 22 - "ExploreScreen.tsx"
Cohesion: 0.05
Nodes (84): getMonthDeals(), ExploreResponse, getExploreDestinations(), GetExploreDestinationsParams, AIRPORT_DICTIONARY, AIRPORT_ONLY_DICTIONARY, FULL_PLACE_DICTIONARY, getAirportDisplayName() (+76 more)

### Community 23 - "TestResult"
Cohesion: 0.18
Nodes (8): AI and heuristic quality-control analysis for API test results., Analyze result quality with Ollama and rule-based checks., Close underlying HTTP session., Return human-readable quality notes for this result. Rule-based insights are…, ResponseAnalyzer, Stores execution data and findings for one test case., A test passes when there are no error-level issues., TestResult

### Community 24 - "ResponseValidator"
Cohesion: 0.22
Nodes (5): Any, Applies status, schema, and consistency checks., Run all checks and append issues to the result., Resolve a dotted path in a nested JSON-like payload. Supports indexes like…, ResponseValidator

### Community 25 - "runtime_config.go"
Cohesion: 0.19
Nodes (18): adminAccessConfigured(), isAdminRequest(), configRangeError, adminTokenConfigured(), adminTokenFromHeader(), defaultRuntimeConfig(), errConfigOutOfRange(), getRuntimeConfig() (+10 more)

### Community 26 - "ProviderResult"
Cohesion: 0.15
Nodes (25): TestCombineOneWayBatches(), TestCombineOneWayBatches_emptyBatch(), TestCombineOneWayBatches_openJawReturnDiversity(), TestCompleteExtraLegs(), TestExtraLegsFingerprint(), TestHasExtraLegs(), cloneLegs(), CombineOneWayBatches() (+17 more)

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.32
Nodes (13): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+5 more)

### Community 29 - "AdminRuntimeConfigPanel.tsx"
Cohesion: 0.17
Nodes (19): apiRequest(), adminAuthHeaders(), fetchAdminRuntimeConfig(), fetchRuntimeConfig(), saveAdminRuntimeConfig(), setRuntimeConfigStore(), RuntimeConfigContext, RuntimeConfigContextValue (+11 more)

### Community 30 - "AuthContext.tsx"
Cohesion: 0.16
Nodes (25): authHeaders(), AuthUser, changePassword(), createUser(), deleteUser(), fetchAuthMe(), fetchUsers(), LoginResponse (+17 more)

### Community 31 - "backend_api_contracts.md"
Cohesion: 0.17
Nodes (11): 1.1 Create Search Session, 1.2 Get Search Session Status & Results, 1.3 Cancel Search Session (Optional, MVP+), 1. Flight Search Sessions, 2.1 Get Monthly Deals, 2. Monthly Deals API, 3.1 Search Airports & Cities, 3. Airport & City Autocomplete (+3 more)

### Community 32 - "CalendarModal.tsx"
Cohesion: 0.38
Nodes (6): buildMonthDays(), CalendarModal(), getMonthStart(), Props, styles, WEEKDAYS

### Community 34 - "booking_resolve.go"
Cohesion: 0.12
Nodes (36): acquireBookingResolveSlot(), beginInflightResolve(), bookingResolveCacheKey(), bookingResolveMaxConcurrentFromEnv(), cacheTTLForStatus(), envDurationMinutes(), finishInflightResolve(), getCachedBookingResolve() (+28 more)

### Community 35 - "ValidationIssue"
Cohesion: 0.18
Nodes (7): Any, Serialize nested result for report output., Represents a single validation or analysis finding., Serialize issue to dictionary., Serialize case to dictionary., Append a new issue to this result., ValidationIssue

### Community 36 - "Backend QA Automation Tool"
Cohesion: 0.18
Nodes (10): Backend QA Automation Tool, Features, If the run feels slow or “stuck”, Notes, Optional AI Setup (Ollama), Output, Project Structure, Run (+2 more)

### Community 37 - "CanonicalItinerary"
Cohesion: 0.24
Nodes (8): canonicalItineraryForOption(), FlightOption, legRouteLabel(), TestCanonicalItineraryForOption_isolatesSplitLegs(), mustCanonicalForLog(), CanonicalItinerary, CanonicalLeg, PassengerContext

### Community 38 - "kiwi_apify_provider.go"
Cohesion: 0.16
Nodes (20): apifyErrorMessage(), asArray(), collectCarriers(), detectSelfTransfer(), extractKiwiLegs(), firstFloat(), firstString(), flattenKiwiItems() (+12 more)

### Community 39 - "search.ts"
Cohesion: 0.24
Nodes (15): CachedResult, createSearchSession(), fetchFresh(), getFromStorage(), getSearchSessionResults(), getStorage(), paramsMatch(), resultsCache (+7 more)

### Community 40 - "SearchLoadingOverlay.tsx"
Cohesion: 0.23
Nodes (10): getPhrasesForLanguage(), SEARCH_BUTTON_PHRASES, SEARCH_PROGRESS_PHRASES, s, SearchProgressBanner(), SearchProgressBannerProps, ExtraLeg, Props (+2 more)

### Community 41 - "models.py"
Cohesion: 0.25
Nodes (5): Core data models for the API QA runner., Set completion timestamp., Return an ISO-8601 UTC timestamp., utc_now_iso(), Validation rules for API responses.

### Community 42 - "testing.T"
Cohesion: 0.11
Nodes (26): TestFlightNumbersEquivalent_leadingZeros(), parseKiwiApifyItems(), TestApifyErrorMessage(), TestBuildActorInputSolidcodeOnly(), TestDetectSelfTransfer(), TestKiwiApifyTimeout(), TestParseKiwiApifyItemsSolidcodeShape(), TestParseKiwiEmptyAndInvalid() (+18 more)

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "write-spa-fallbacks.mjs"
Cohesion: 0.33
Nodes (5): __dirname, dist, indexHtml, indexPath, SPA_ROUTES

### Community 45 - "net/http.Request"
Cohesion: 0.33
Nodes (18): handleAuthLogout(), handleAdminVerify(), handleGetRuntimeConfig(), handleFlyFixRefineIssues(), handleAffiliateClicksSummary(), handleAffiliateOutboundLink(), handleAffiliateProvider(), handleAffiliateRedirect() (+10 more)

### Community 53 - "loadSearchSession"
Cohesion: 0.23
Nodes (21): loadSearchSession(), TestLoadSearchSession_Expiry(), searchSessionTTL(), cleanupPersistedSessions(), SearchSessionResultsResponse, importLegacyJSONSessions(), initSessionStore(), loadPersistedSession() (+13 more)

### Community 54 - "ErrorBoundary"
Cohesion: 0.15
Nodes (4): ErrorBoundary, Props, s, State

### Community 55 - "ResultsScreen.tsx"
Cohesion: 0.11
Nodes (30): defaultParams, DynamicDestinationsScreen(), Nav, styles, bestScore(), CheapestOption, currentGeneration(), defaultFormParams (+22 more)

### Community 56 - "SelectBestOffer"
Cohesion: 0.16
Nodes (19): floatPtr(), TestSelectBestOffer_cheapestOTAOverAirline(), TestSelectBestOffer_conflictingCandidatesPicksCheapest(), TestSelectBestOffer_missingPrice(), TestSelectBestOffer_multipleMatching(), TestSelectBestOffer_prefersPriceAmongSameURLType(), TestSelectBestOffer_prefersQuoteMatchingPrice(), TestSelectBestOffer_rejectsGenericSearchURL() (+11 more)

### Community 57 - "gf2Cache"
Cohesion: 0.20
Nodes (7): newGF2Cache(), TestSearchLegCached_usesCache(), sync.RWMutex, gf2Cache, gf2CacheEntry, kiwiCache, kiwiCacheEntry

### Community 58 - "DedupeProviderResults"
Cohesion: 0.21
Nodes (9): DedupeProviderResults(), ItineraryFingerprint(), mergeSelfTransfer(), TotalStops(), uniqueStrings(), AttachCanonicalIdentityAll(), TestDedupeKeepsCheaper(), TestItineraryFingerprintStable() (+1 more)

### Community 60 - "matcher_test.go"
Cohesion: 0.17
Nodes (30): classifyURLType(), extractPrice(), cfgTest(), TestClassifyURLType_genericVsExact(), testConnectingTLVJFK(), TestExtractPrice_euroPrefixNotArrivalTime(), TestGenerateQueries_connecting(), TestGenerateQueries_direct() (+22 more)

### Community 61 - "time.Time"
Cohesion: 0.07
Nodes (48): airportCoord, minutesOfDay(), exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut() (+40 more)

### Community 62 - "client.ts"
Cohesion: 0.18
Nodes (13): searchAirports(), apiGet(), apiUrl(), isLocalHostname(), IMPORTANT: Expo/Metro statically inlines EXPO_PUBLIC_* only when accessed via, resolveApiBase(), getDealsRange(), GetDealsRangeParams (+5 more)

### Community 64 - "SearchRequest"
Cohesion: 0.21
Nodes (11): TestIsOpenJaw(), TestResolveReturnAirports_classic(), TestResolveReturnAirports_openJaw(), TestSanitizeStandardSearchRequest(), SearchRequest, HasExtraLegs(), IsOpenJaw(), ResolveReturnAirports() (+3 more)

### Community 65 - "CreateSearchSessionRequest"
Cohesion: 0.10
Nodes (27): DynamicDestinationsFormContentProps, f, FiltersPanelProps, FlightDetailsModalProps, FlightResultCardProps, PassengerCabinPickerProps, SearchFormContentProps, ICONS (+19 more)

### Community 66 - "ThemeContext.tsx"
Cohesion: 0.08
Nodes (36): AppIcon(), AppIconLibrary, AppIconProps, styles, EditSearchModalProps, s, FormHeroHeader(), FormHeroHeaderProps (+28 more)

### Community 67 - "itinerary.go"
Cohesion: 0.23
Nodes (18): operatingFlightForMatch(), BuildCanonicalItinerary(), canonicalSegmentFromProvider(), FingerprintDebugString(), isIATACarrierCode(), flightNumbersEquivalent(), ResultMatchesItinerary(), segmentsLooselyMatch() (+10 more)

### Community 68 - "itinerary_test.go"
Cohesion: 0.21
Nodes (15): AttachCanonicalIdentity(), segTLVJFK(), TestAttachCanonicalIdentityAll_combineOneWay(), TestCanonicalItineraryFingerprint_connectingFlight(), TestCanonicalItineraryFingerprint_differentFlightsDoNotCollide(), TestCanonicalItineraryFingerprint_directFlight(), TestCanonicalItineraryFingerprint_formattingStable(), TestCanonicalItineraryFingerprint_gf2AirlineNameStable() (+7 more)

### Community 72 - "Registry"
Cohesion: 0.20
Nodes (7): MultiSearchResult, isSkippedProviderErr(), NewRegistryFromEnv(), parseProviderNames(), GoogleFlights2Provider, Provider, Registry

### Community 74 - "CanonicalSegment"
Cohesion: 0.19
Nodes (25): extractFlightNumbers(), flightNumberInText(), flightNumbersEquivalent(), splitFlightDesignator(), textContainsAirport(), textContainsAny(), timeMatches(), connectingFlightQueries() (+17 more)

### Community 78 - "affiliate.ts"
Cohesion: 0.27
Nodes (9): AffiliateProvider, AffiliateProviderResponse, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink(), OutboundLinkResponse (+1 more)

### Community 79 - "App.tsx"
Cohesion: 0.27
Nodes (8): App(), linking, RTLWrapper(), API_BASE, useExchangeRates(), ThemeProvider(), ensureRates(), fetchRates()

### Community 80 - "flyfix.ts"
Cohesion: 0.25
Nodes (8): apiPost(), FlyfixInsightsGroup, FlyfixIssue, FlyfixRefinedReport, FlyfixSummary, refineIssues(), RefineIssuesRequestBody, cancelSearchSession()

### Community 81 - "DatePickerCalendar.tsx"
Cohesion: 0.36
Nodes (7): DatePickerCalendar(), DatePickerCalendarProps, getNext14Dates(), getRangeStartEnd(), styles, WEEKDAYS, DayDeal

### Community 83 - "ValidateBookingURL"
Cohesion: 0.39
Nodes (6): TestValidateBookingURL_acceptsHTTPS(), TestValidateBookingURL_rejectsEmpty(), TestValidateBookingURL_rejectsJavascript(), TestValidateBookingURL_rejectsLocalhost(), TestValidateBookingURL_rejectsPrivateIP(), ValidateBookingURL()

### Community 84 - "TestApplySoftStrictBaggage"
Cohesion: 0.52
Nodes (6): applySoftStrictBaggage(), makeOfferWithBags(), makeOfferWithMissingBags(), TestApplySoftStrictBaggage(), TestClassifyOfferBaggage(), classifyOfferBaggage()

### Community 86 - "TestExtractCarrierCodes"
Cohesion: 0.83
Nodes (3): makeOfferWithCarriers(), TestExtractCarrierCodes(), TestPrimaryDisplayCarrier()

## Knowledge Gaps
- **278 isolated node(s):** `ClicksByProvider`, `BookingResolveRequest`, `exploreLiveCandidate`, `flightcaptainweb`, `runtimeConfigBounds` (+273 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `CanonicalItinerary` connect `CanonicalItinerary` to `searcher.go`, `SearchRequest`, `booking_resolve.go`, `itinerary.go`, `CanonicalSegment`, `BookingOffer`, `handleCreateSession`, `context.Context`, `booking_gf2_resolve.go`, `ProviderResult`, `matcher_test.go`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `useTheme()` connect `useTheme` to `CreateSearchSessionRequest`, `ThemeContext.tsx`, `FlightDetailsModal.tsx`, `SearchFormScreen.tsx`, `MonthDealsScreen.tsx`, `RootNavigator.tsx`, `SearchLoadingOverlay.tsx`, `DateRangePicker.tsx`, `LocaleContext.tsx`, `ExploreScreen.tsx`, `ResultsScreen.tsx`, `AdminRuntimeConfigPanel.tsx`, `AuthContext.tsx`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `useLocale()` connect `useTheme` to `CreateSearchSessionRequest`, `ThemeContext.tsx`, `FlightDetailsModal.tsx`, `SearchFormScreen.tsx`, `MonthDealsScreen.tsx`, `RootNavigator.tsx`, `SearchLoadingOverlay.tsx`, `App.tsx`, `LocaleContext.tsx`, `ExploreScreen.tsx`, `ResultsScreen.tsx`, `AdminRuntimeConfigPanel.tsx`, `AuthContext.tsx`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `ClicksByProvider`, `BookingResolveRequest`, `exploreLiveCandidate` to the rest of the system?**
  _278 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `searcher.go` be split into smaller, more focused modules?**
  _Cohesion score 0.1349206349206349 - nodes in this community are weakly interconnected._
- **Should `RootNavigator.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09841269841269841 - nodes in this community are weakly interconnected._
- **Should `FlightDetailsModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06430745814307458 - nodes in this community are weakly interconnected._