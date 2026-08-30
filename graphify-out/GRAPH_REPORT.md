# Graph Report - workspace  (2026-08-30)

## Corpus Check
- 207 files · ~200,130 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1731 nodes · 4658 edges · 78 communities (74 shown, 4 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 392 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `35bf525a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- .Match
- RootNavigator.tsx
- FlightDetailsModal.tsx
- Issue
- SearchFormScreen.tsx
- MonthDealsScreen.tsx
- dependencies
- useTheme
- Features
- auth.go
- googleflights2_provider.go
- handleCreateSession
- net/http.Request
- compilerOptions
- DateRangePicker.tsx
- resolveGF2PartnerOffer
- LocaleContext.tsx
- affiliate.go
- server.go
- context.Context
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
- auth.ts
- backend_api_contracts.md
- CalendarModal.tsx
- flightTimeToMs
- booking_resolve.go
- ValidationIssue
- Backend QA Automation Tool
- CanonicalItineraryFingerprint
- time.Time
- search.ts
- SearchLoadingOverlay.tsx
- models.py
- server_normalize_test.go
- Fly-Fix – Frontend
- write-spa-fallbacks.mjs
- handleExplore
- metro.config.js
- __init__.py
- flightcaptainweb
- loadSearchSession
- ErrorBoundary
- ResultsScreen.tsx
- ResultMatchesItinerary
- gf2Cache
- DedupeProviderResults
- testing.T
- exploreBuildRowsAndQueue
- client.ts
- FlightResultCard.tsx
- SearchRequest
- FiltersPanel.tsx
- types/index.ts
- CanonicalItinerary
- AuthContext.tsx
- dealsCache.ts
- KiwiApifyProvider
- getAirlineName
- CanonicalSegment
- DraggableBottomSheet.tsx
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
- `handleAffiliateOutboundLink()` --calls--> `ResolveProvider()`  [INFERRED]
  backend/server.go → backend/affiliate.go
- `handleAffiliateProvider()` --calls--> `ResolveProvider()`  [INFERRED]
  backend/server.go → backend/affiliate.go
- `handleAffiliateRedirect()` --calls--> `ResolveProvider()`  [INFERRED]
  backend/server.go → backend/affiliate.go
- `handleOutBooking()` --calls--> `ResolveProvider()`  [INFERRED]
  backend/server.go → backend/affiliate.go

## Import Cycles
- None detected.

## Communities (78 total, 4 thin omitted)

### Community 0 - ".Match"
Cohesion: 0.11
Nodes (28): defaultBookingMatchRunner(), corpusText(), domainFromURL(), elapsedMs(), logMatchEvent(), MatchResult, countVerifiedPricedOffers(), MatchItinerary() (+20 more)

### Community 1 - "RootNavigator.tsx"
Cohesion: 0.10
Nodes (27): LandingScreen(), Nav, styles, useIsMobile(), DynamicDestinationsStack(), Stack, MonthDealsStack(), Stack (+19 more)

### Community 2 - "FlightDetailsModal.tsx"
Cohesion: 0.22
Nodes (14): BookingResolveRequest, BookingResolveResponse, BookingResolveStatus, isSafeBookingUrl(), PublicBookingOffer, resolveBookingOffer(), cabinLabel(), FlightDetailsModal() (+6 more)

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "SearchFormScreen.tsx"
Cohesion: 0.13
Nodes (26): defaultParams, SearchFormScreen(), styles, buildSearchString(), getParam(), getParams(), isWeb(), parseSearchParamsFromUrl() (+18 more)

### Community 5 - "MonthDealsScreen.tsx"
Cohesion: 0.08
Nodes (39): DisplayPrice(), DisplayPriceProps, HubRouteLeg, HubRouteSummaryModal(), HubRouteSummaryModalProps, s, CheaperCitiesOption, CheaperCitiesSection() (+31 more)

### Community 6 - "dependencies"
Cohesion: 0.04
Nodes (44): @babel/core, expo, @expo/metro-runtime, expo-status-bar, dependencies, expo, @expo/metro-runtime, expo-status-bar (+36 more)

### Community 7 - "useTheme"
Cohesion: 0.10
Nodes (36): EditSearchModal(), EditSearchModalProps, s, s, SearchSummaryBar(), SearchSummaryBarProps, useAuth(), useLocale() (+28 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (33): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+25 more)

### Community 9 - "auth.go"
Cohesion: 0.19
Nodes (25): authUserJSON(), bootstrapAdminUser(), createAuthSession(), envFlagTrue(), handleAuthLogin(), handleAuthRegister(), handleAuthUsers(), initAuthStore() (+17 more)

### Community 10 - "googleflights2_provider.go"
Cohesion: 0.06
Nodes (65): AirportLocation(), TestAirportLocation_UnknownFallsBackUTC(), TestParseGF2TimeWithDateHint_AirportLocal(), TestParseGF2TimeWithDateHint_TelAviv(), findBookingOptionsArray(), firstPartnerBookingOption(), firstPartnerURLInMap(), firstStringByKeys() (+57 more)

### Community 11 - "handleCreateSession"
Cohesion: 0.11
Nodes (25): bookingMatchPriceNormalizer(), CanonicalFingerprint(), CodeshareFingerprint(), roundTimeToMinutes(), CreateSearchSessionRequest, ExtraSearchLeg, FlightOption, applySoftStrictBaggageOptions() (+17 more)

### Community 12 - "net/http.Request"
Cohesion: 0.26
Nodes (22): RecordClick(), bearerTokenFromRequest(), handleAuthChangePassword(), handleAuthLogout(), handleAuthMe(), handleAdminVerify(), handleGetRuntimeConfig(), handleFlyFixRefineIssues() (+14 more)

### Community 13 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+15 more)

### Community 14 - "DateRangePicker.tsx"
Cohesion: 0.33
Nodes (9): useRuntimeConfig(), buildMonthDays(), DateRangePicker(), DateRangePickerProps, getMonthStart(), monthStartForYmd(), parseYmdUtc(), styles (+1 more)

### Community 15 - "resolveGF2PartnerOffer"
Cohesion: 0.06
Nodes (80): allocateLegQuoteAmount(), applySearchQuoteToOffer(), attachQuotedPriceMeta(), flightLegDurationMinutes(), gf2PartnerOfferFromQuoteURL(), gf2PartnerOfferFromResolved(), gf2PartnerOfferFromURL(), FlightLeg (+72 more)

### Community 16 - "LocaleContext.tsx"
Cohesion: 0.22
Nodes (13): getStorage(), languageToLocale(), loadSaved(), LocaleContext, LocaleContextValue, LocaleProvider(), save(), VALID_CURRENCIES (+5 more)

### Community 17 - "affiliate.go"
Cohesion: 0.17
Nodes (17): BuildRedirectURL(), getAffiliateID(), GetClicksSummary(), getOTAProvider(), GetSessionAndOption(), FlightOption, SearchSession, SearchSessionResultsResponse (+9 more)

### Community 18 - "server.go"
Cohesion: 0.08
Nodes (41): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, Carrier, CarrierCodes, DayDeal, FareBreakdown (+33 more)

### Community 19 - "context.Context"
Cohesion: 0.16
Nodes (23): mergeExplorePriceRows(), exploreDestRow, exploreLiveCandidate, FullRoundTrip, attachReturnLegKeepPrice(), ensureRoundTripLegs(), exploreDestRowsToMaps(), exploreRunLiveBatch() (+15 more)

### Community 20 - "qa_runner.py"
Cohesion: 0.14
Nodes (13): Namespace, Path, Any, Reporting helpers for test execution results., Render terminal summary and persist machine-readable reports., Print user-friendly report to stdout., Write a JSON report and return its path., ReportWriter (+5 more)

### Community 21 - "ApiClient"
Cohesion: 0.14
Nodes (12): ApiClient, Any, HTTP client utilities for executing API test cases., Parse JSON response when possible without raising., Sleep using exponential backoff., Executes HTTP requests with retry and timing support., Close the underlying requests session., Execute one test case and return a populated result. (+4 more)

### Community 22 - "ExploreScreen.tsx"
Cohesion: 0.05
Nodes (87): GetDealsRangeParams, getMonthDeals(), GetMonthDealsParams, ExploreResponse, getExploreDestinations(), GetExploreDestinationsParams, AIRPORT_DICTIONARY, AIRPORT_ONLY_DICTIONARY (+79 more)

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
Cohesion: 0.13
Nodes (26): TestCombineOneWayBatches(), TestCombineOneWayBatches_emptyBatch(), TestCombineOneWayBatches_openJawReturnDiversity(), TestCompleteExtraLegs(), TestExtraLegsFingerprint(), TestHasExtraLegs(), AttachCanonicalIdentityAll(), TestAttachCanonicalIdentityAll_combineOneWay() (+18 more)

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.32
Nodes (13): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+5 more)

### Community 29 - "AdminRuntimeConfigPanel.tsx"
Cohesion: 0.17
Nodes (18): apiRequest(), adminAuthHeaders(), fetchAdminRuntimeConfig(), fetchRuntimeConfig(), saveAdminRuntimeConfig(), setRuntimeConfigStore(), RuntimeConfigContext, RuntimeConfigContextValue (+10 more)

### Community 30 - "auth.ts"
Cohesion: 0.32
Nodes (12): authHeaders(), changePassword(), createUser(), deleteUser(), fetchAuthMe(), fetchUsers(), LoginResponse, logoutSession() (+4 more)

### Community 31 - "backend_api_contracts.md"
Cohesion: 0.17
Nodes (11): 1.1 Create Search Session, 1.2 Get Search Session Status & Results, 1.3 Cancel Search Session (Optional, MVP+), 1. Flight Search Sessions, 2.1 Get Monthly Deals, 2. Monthly Deals API, 3.1 Search Airports & Cities, 3. Airport & City Autocomplete (+3 more)

### Community 32 - "CalendarModal.tsx"
Cohesion: 0.38
Nodes (6): buildMonthDays(), CalendarModal(), getMonthStart(), Props, styles, WEEKDAYS

### Community 33 - "flightTimeToMs"
Cohesion: 0.23
Nodes (12): airportTimeZones, getAirportTimeZone(), fmtShortDate(), fmtDur(), layoverBetween(), legDuration(), renderLeg(), safeDate() (+4 more)

### Community 34 - "booking_resolve.go"
Cohesion: 0.16
Nodes (26): acquireBookingResolveSlot(), beginInflightResolve(), bookingResolveCacheKey(), bookingResolveMaxConcurrentFromEnv(), cacheTTLForStatus(), countVerifiedExactOffers(), envDurationMinutes(), finishInflightResolve() (+18 more)

### Community 35 - "ValidationIssue"
Cohesion: 0.18
Nodes (7): Any, Serialize nested result for report output., Represents a single validation or analysis finding., Serialize issue to dictionary., Serialize case to dictionary., Append a new issue to this result., ValidationIssue

### Community 36 - "Backend QA Automation Tool"
Cohesion: 0.18
Nodes (10): Backend QA Automation Tool, Features, If the run feels slow or “stuck”, Notes, Optional AI Setup (Ollama), Output, Project Structure, Run (+2 more)

### Community 37 - "CanonicalItineraryFingerprint"
Cohesion: 0.26
Nodes (11): handleBookingResolve(), TestCacheTTLForStatus_doesNotCacheMisses(), TestHandleBookingResolve_invalidItinerary(), TestHandleBookingResolve_prefillFallback(), TestHandleBookingResolve_searchUnavailable(), TestHandleBookingResolve_verified(), TestRunBookingMatch_gf2DirectLinkSkipsWebSearch(), TestRunBookingMatch_usesLegTokenFromSearchQuote() (+3 more)

### Community 38 - "time.Time"
Cohesion: 0.26
Nodes (18): minutesOfDay(), asArray(), collectCarriers(), detectSelfTransfer(), extractKiwiLegs(), firstFloat(), firstString(), kiwiSegmentFromMap() (+10 more)

### Community 39 - "search.ts"
Cohesion: 0.28
Nodes (12): CachedResult, fetchFresh(), getFromStorage(), getSearchSessionResults(), getStorage(), paramsMatch(), resultsCache, setToStorage() (+4 more)

### Community 40 - "SearchLoadingOverlay.tsx"
Cohesion: 0.22
Nodes (11): getPhrasesForLanguage(), SEARCH_BUTTON_PHRASES, SEARCH_PROGRESS_PHRASES, s, SearchProgressBanner(), SearchProgressBannerProps, ExtraLeg, Props (+3 more)

### Community 41 - "models.py"
Cohesion: 0.25
Nodes (5): Core data models for the API QA runner., Set completion timestamp., Return an ISO-8601 UTC timestamp., utc_now_iso(), Validation rules for API responses.

### Community 42 - "server_normalize_test.go"
Cohesion: 0.21
Nodes (12): applyPriceNormalization(), computeOutboundSummary(), computeTotalDurationFromLegs(), TestApplyPriceNormalizationDefaultNoChange(), TestComputeOutboundSummary_Direct(), TestComputeOutboundSummary_OneStop(), TestComputeTotalDurationFromLegs(), TestComputeTotalDurationFromLegs_IncludesLayover() (+4 more)

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "write-spa-fallbacks.mjs"
Cohesion: 0.33
Nodes (5): __dirname, dist, indexHtml, indexPath, SPA_ROUTES

### Community 45 - "handleExplore"
Cohesion: 0.43
Nodes (7): exploreSessionKey(), getExploreSession(), newExploreSessionID(), putExploreSession(), startExploreSessionCleanup(), exploreSession, handleExplore()

### Community 53 - "loadSearchSession"
Cohesion: 0.10
Nodes (32): MultiSearchResult, isSkippedProviderErr(), NewRegistryFromEnv(), parseProviderNames(), corsMiddleware(), loadSearchSession(), main(), TestLoadSearchSession_Expiry() (+24 more)

### Community 54 - "ErrorBoundary"
Cohesion: 0.15
Nodes (4): ErrorBoundary, Props, s, State

### Community 55 - "ResultsScreen.tsx"
Cohesion: 0.12
Nodes (29): createSearchSession(), DynamicDestinationsFormContent(), defaultParams, DynamicDestinationsScreen(), Nav, styles, bestScore(), CheapestOption (+21 more)

### Community 56 - "ResultMatchesItinerary"
Cohesion: 0.83
Nodes (3): flightNumbersEquivalent(), ResultMatchesItinerary(), segmentsLooselyMatch()

### Community 57 - "gf2Cache"
Cohesion: 0.15
Nodes (10): newGF2Cache(), newGF2RateLimiter(), NewGoogleFlights2Provider(), TestOpenJaw_usesDecomposedSearchPath(), TestSearchLegCached_usesCache(), sync.Mutex, sync.RWMutex, gf2Cache (+2 more)

### Community 58 - "DedupeProviderResults"
Cohesion: 0.24
Nodes (8): DedupeProviderResults(), ItineraryFingerprint(), mergeSelfTransfer(), TotalStops(), uniqueStrings(), TestDedupeKeepsCheaper(), TestItineraryFingerprintStable(), MultiSearchResult

### Community 60 - "testing.T"
Cohesion: 0.05
Nodes (85): classifyURLType(), extractPrice(), cfgTest(), floatPtr(), TestClassifyURLType_genericVsExact(), testConnectingTLVJFK(), TestExtractPrice_euroPrefixNotArrivalTime(), TestFlightNumbersEquivalent_leadingZeros() (+77 more)

### Community 61 - "exploreBuildRowsAndQueue"
Cohesion: 0.15
Nodes (16): airportCoord, exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut(), getAirportCoord() (+8 more)

### Community 62 - "client.ts"
Cohesion: 0.15
Nodes (14): linking, RTLWrapper(), searchAirports(), API_BASE, apiGet(), apiUrl(), isLocalHostname(), IMPORTANT: Expo/Metro statically inlines EXPO_PUBLIC_* only when accessed via (+6 more)

### Community 63 - "FlightResultCard.tsx"
Cohesion: 0.24
Nodes (14): buildRoutePath(), c, LegScheduleBlock(), FlightSegment, LayoverSummary, OutboundSummary, buildLegPreviewSummary(), computeLayovers() (+6 more)

### Community 64 - "SearchRequest"
Cohesion: 0.21
Nodes (11): truncateGF2(), TestIsOpenJaw(), TestResolveReturnAirports_classic(), TestResolveReturnAirports_openJaw(), TestSanitizeStandardSearchRequest(), SearchRequest, HasExtraLegs(), IsOpenJaw() (+3 more)

### Community 65 - "FiltersPanel.tsx"
Cohesion: 0.09
Nodes (27): f, FiltersPanel(), FiltersPanelProps, FlightDetailsModalProps, FlightResultCardProps, ICONS, KEYS, s (+19 more)

### Community 66 - "types/index.ts"
Cohesion: 0.13
Nodes (26): AppIcon(), AppIconLibrary, AppIconProps, styles, FormHeroHeader(), FormHeroHeaderProps, styles, formCardStyles (+18 more)

### Community 67 - "CanonicalItinerary"
Cohesion: 0.19
Nodes (15): canonicalItineraryForOption(), FlightOption, legRouteLabel(), TestCanonicalItineraryForOption_isolatesSplitLegs(), mustCanonicalForLog(), BuildCanonicalItinerary(), FingerprintDebugString(), CanonicalItinerary (+7 more)

### Community 69 - "AuthContext.tsx"
Cohesion: 0.23
Nodes (13): AuthUser, loginWithPassword(), registerAccount(), AdminAuthProvider, applyUser(), AuthContext, AuthContextValue, AuthProvider() (+5 more)

### Community 70 - "dealsCache.ts"
Cohesion: 0.25
Nodes (15): DealsState, MonthDealsResponse, CachedDealsResults, clearPendingDealsParams(), DealsParams, dealsParamsFingerprint(), getCachedDealsResults(), getLocalStorage() (+7 more)

### Community 71 - "KiwiApifyProvider"
Cohesion: 0.19
Nodes (7): apifyErrorMessage(), flattenKiwiItems(), NewKiwiApifyProvider(), stringField(), truncateStr(), KiwiApifyProvider, kiwiCache

### Community 73 - "getAirlineName"
Cohesion: 0.31
Nodes (8): AIRLINE_NAMES, getAirlineName(), AIRLINE_FULL_NAMES, NOTE: This is a starter subset of IATA airlines., FlightResultCard(), displayAirlineLabel(), distinctMarketingCarriers(), hasMultipleAirlines()

### Community 74 - "CanonicalSegment"
Cohesion: 0.15
Nodes (33): extractFlightNumbers(), flightNumberInText(), flightNumbersEquivalent(), splitFlightDesignator(), textContainsAirport(), textContainsAny(), timeMatches(), connectingFlightQueries() (+25 more)

### Community 77 - "skyscanner.ts"
Cohesion: 0.42
Nodes (10): BookingHop, bookingHopsFromOption(), firstSeg(), isClassicRoundTripLegs(), isoDatePrefix(), isSplitBookingItinerary(), lastSeg(), legNeedsSegmentSplit() (+2 more)

### Community 78 - "affiliate.ts"
Cohesion: 0.27
Nodes (9): AffiliateProvider, AffiliateProviderResponse, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink(), OutboundLinkResponse (+1 more)

### Community 79 - "exchangeRates.ts"
Cohesion: 0.25
Nodes (9): App(), useExchangeRates(), convertPrice(), CURRENCY_SYMBOLS, CurrencyCode, ensureRates(), fetchRates(), getDisplayPrice() (+1 more)

### Community 80 - "flyfix.ts"
Cohesion: 0.25
Nodes (8): apiPost(), FlyfixInsightsGroup, FlyfixIssue, FlyfixRefinedReport, FlyfixSummary, refineIssues(), RefineIssuesRequestBody, cancelSearchSession()

### Community 81 - "DatePickerCalendar.tsx"
Cohesion: 0.39
Nodes (7): getDealsRange(), DatePickerCalendar(), DatePickerCalendarProps, getNext14Dates(), getRangeStartEnd(), styles, WEEKDAYS

## Knowledge Gaps
- **278 isolated node(s):** `ClicksByProvider`, `BookingResolveRequest`, `exploreLiveCandidate`, `flightcaptainweb`, `runtimeConfigBounds` (+273 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `CanonicalSegment` connect `CanonicalSegment` to `ResultMatchesItinerary`, `CanonicalItinerary`, `time.Time`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Why does `BookingOffer` connect `resolveGF2PartnerOffer` to `.Match`, `booking_resolve.go`, `testing.T`, `time.Time`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `ClicksByProvider`, `BookingResolveRequest`, `exploreLiveCandidate` to the rest of the system?**
  _278 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `.Match` be split into smaller, more focused modules?**
  _Cohesion score 0.112375533428165 - nodes in this community are weakly interconnected._
- **Should `RootNavigator.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09672830725462304 - nodes in this community are weakly interconnected._
- **Should `Issue` be split into smaller, more focused modules?**
  _Cohesion score 0.1036036036036036 - nodes in this community are weakly interconnected._
- **Should `SearchFormScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13257575757575757 - nodes in this community are weakly interconnected._