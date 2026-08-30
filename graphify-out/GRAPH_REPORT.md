# Graph Report - workspace  (2026-08-30)

## Corpus Check
- 201 files · ~195,262 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1679 nodes · 4468 edges · 71 communities (67 shown, 4 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 370 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8de357f4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- BookingOffer
- RootNavigator.tsx
- FlightDetailsModal.tsx
- Issue
- providers.go
- MonthDealsScreen.tsx
- dependencies
- useTheme
- Features
- net/http.Request
- googleflights2_provider.go
- CanonicalItinerary
- server.go
- compilerOptions
- canonical.go
- flyfix.ts
- LocaleContext.tsx
- main
- handleCreateSession
- time.Time
- qa_runner.py
- ApiClient
- ExploreScreen.tsx
- TestResult
- ResponseValidator
- Registry
- context.Context
- expo
- config_loader.py
- SearchLoadingOverlay.tsx
- exploreBuildRowsAndQueue
- backend_api_contracts.md
- SearchSession
- FiltersPanel.tsx
- booking_resolve.go
- ValidationIssue
- Backend QA Automation Tool
- KiwiApifyProvider
- kiwi_apify_provider.go
- search.ts
- types/index.ts
- models.py
- testing.T
- Fly-Fix – Frontend
- write-spa-fallbacks.mjs
- DynamicDestinationsScreen.tsx
- metro.config.js
- __init__.py
- flightcaptainweb
- loadSearchSession
- ErrorBoundary
- ResultsScreen.tsx
- itinerary_test.go
- gf2Cache
- CalendarModal.tsx
- SelectBestOffer
- matcher_test.go
- CombineOneWayBatches
- client.ts
- affiliate.ts
- DatePickerCalendar.tsx
- AuthContext.tsx
- ValidateBookingURL
- TestApplySoftStrictBaggage
- AdminRuntimeConfigPanel.tsx
- TestExtractCarrierCodes
- DraggableBottomSheet.tsx

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 74 edges
2. `useLocale()` - 71 edges
3. `ProviderResult` - 40 edges
4. `MonthDealsScreen()` - 36 edges
5. `ResultsScreen()` - 34 edges
6. `VerifyCandidate()` - 30 edges
7. `CanonicalItinerary` - 30 edges
8. `TestResult` - 29 edges
9. `ExploreScreen()` - 27 edges
10. `CanonicalSegment` - 25 edges

## Surprising Connections (you probably didn't know these)
- `GetSessionAndOption()` --calls--> `loadSearchSession()`  [INFERRED]
  backend/affiliate.go → backend/server.go
- `handleBookingResolve()` --calls--> `GetSessionAndOption()`  [INFERRED]
  backend/booking_resolve.go → backend/affiliate.go
- `TestGetSessionAndOption_MissingOption()` --calls--> `GetSessionAndOption()`  [INFERRED]
  backend/server_review_test.go → backend/affiliate.go
- `main()` --calls--> `initAuthStore()`  [INFERRED]
  backend/server.go → backend/auth.go
- `initTestAuthDB()` --calls--> `initSessionStore()`  [INFERRED]
  backend/auth_test.go → backend/session_store.go

## Import Cycles
- None detected.

## Communities (71 total, 4 thin omitted)

### Community 0 - "BookingOffer"
Cohesion: 0.06
Nodes (60): allocateLegQuoteAmount(), applySearchQuoteToOffer(), attachQuotedPriceMeta(), bookingMatchPriceNormalizer(), flightLegDurationMinutes(), gf2PartnerOfferFromQuoteURL(), gf2PartnerOfferFromResolved(), gf2PartnerOfferFromURL() (+52 more)

### Community 1 - "RootNavigator.tsx"
Cohesion: 0.10
Nodes (26): LandingScreen(), Nav, styles, useIsMobile(), DynamicDestinationsStack(), Stack, MonthDealsStack(), RootNavigator() (+18 more)

### Community 2 - "FlightDetailsModal.tsx"
Cohesion: 0.06
Nodes (56): App(), linking, RTLWrapper(), BookingResolveRequest, BookingResolveResponse, BookingResolveStatus, isSafeBookingUrl(), PublicBookingOffer (+48 more)

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "providers.go"
Cohesion: 0.17
Nodes (18): TestIsOpenJaw(), TestResolveReturnAirports_classic(), TestResolveReturnAirports_openJaw(), TestSanitizeStandardSearchRequest(), CompleteExtraLegs(), ExtraLegsFingerprint(), MultiSearchResult, ProviderSearchStats (+10 more)

### Community 5 - "MonthDealsScreen.tsx"
Cohesion: 0.07
Nodes (52): MonthDealsFormContent(), buildDealsPositioningSignature(), dealBestScore(), fl, fmtDur(), formatDealDate(), hfm, HUB_AIRPORTS (+44 more)

### Community 6 - "dependencies"
Cohesion: 0.04
Nodes (44): @babel/core, expo, @expo/metro-runtime, expo-status-bar, dependencies, expo, @expo/metro-runtime, expo-status-bar (+36 more)

### Community 7 - "useTheme"
Cohesion: 0.10
Nodes (36): EditSearchModal(), EditSearchModalProps, s, s, SearchSummaryBar(), SearchSummaryBarProps, useAuth(), useLocale() (+28 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (33): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+25 more)

### Community 9 - "net/http.Request"
Cohesion: 0.06
Nodes (83): BuildRedirectURL(), getAffiliateID(), GetClicksSummary(), getOTAProvider(), GetSessionAndOption(), FlightOption, SearchSession, SearchSessionResultsResponse (+75 more)

### Community 10 - "googleflights2_provider.go"
Cohesion: 0.14
Nodes (34): TestExtractGF2BookingURL(), TestExtractGF2PartnerBookingTokenPrefersPartnerURL(), TestExtractGF2Leg_SingleSegment_DepartArriveDiffer(), TestExtractGF2Leg_TimeOnly_NoDateHint(), TestExtractGF2Leg_TimeOnly_WithDateHint(), TestParseGF2Time_AcceptsFullDateTime(), TestParseGF2Time_RejectsTimeOnly(), buildGF2ResultFromItinerary() (+26 more)

### Community 11 - "CanonicalItinerary"
Cohesion: 0.05
Nodes (76): defaultBookingMatchRunner(), corpusText(), domainFromURL(), extractFlightNumbers(), flightNumberInText(), flightNumbersEquivalent(), splitFlightDesignator(), textContainsAirport() (+68 more)

### Community 12 - "server.go"
Cohesion: 0.14
Nodes (26): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, Carrier, DayDeal, FareBreakdown, FlightDetailsResponse (+18 more)

### Community 13 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+15 more)

### Community 14 - "canonical.go"
Cohesion: 0.14
Nodes (31): FlightOption, openJawOption(), TestBookingLinkModeDefaultsToGoogle(), TestBookingRouteFromSessionOption_splitOmitsReturn(), TestBuildGoogleFlightsFallbackFromParams(), TestBuildOneWayLegBookingURL(), TestBuildSkyscannerPrefillURL_oneWay(), TestBuildSkyscannerPrefillURL_roundTrip() (+23 more)

### Community 15 - "flyfix.ts"
Cohesion: 0.25
Nodes (8): apiPost(), FlyfixInsightsGroup, FlyfixIssue, FlyfixRefinedReport, FlyfixSummary, refineIssues(), RefineIssuesRequestBody, cancelSearchSession()

### Community 16 - "LocaleContext.tsx"
Cohesion: 0.11
Nodes (22): DisplayPrice(), DisplayPriceProps, HubRouteLeg, HubRouteSummaryModal(), HubRouteSummaryModalProps, s, getStorage(), languageToLocale() (+14 more)

### Community 17 - "main"
Cohesion: 0.33
Nodes (6): startExploreSessionCleanup(), corsMiddleware(), fetchExchangeRates(), main(), startExchangeRateRefresh(), net/http.Handler

### Community 18 - "handleCreateSession"
Cohesion: 0.11
Nodes (26): CanonicalFingerprint(), CreateSearchSessionRequest, ExtraSearchLeg, FlightLeg, FlightOption, LayoverSummary, OutboundSummary, applyPriceNormalization() (+18 more)

### Community 19 - "time.Time"
Cohesion: 0.13
Nodes (33): mergeExplorePriceRows(), exploreSessionKey(), getExploreSession(), newExploreSessionID(), putExploreSession(), exploreDestRow, exploreSession, FullRoundTrip (+25 more)

### Community 20 - "qa_runner.py"
Cohesion: 0.14
Nodes (13): Namespace, Path, Any, Reporting helpers for test execution results., Render terminal summary and persist machine-readable reports., Print user-friendly report to stdout., Write a JSON report and return its path., ReportWriter (+5 more)

### Community 21 - "ApiClient"
Cohesion: 0.14
Nodes (12): ApiClient, Any, HTTP client utilities for executing API test cases., Parse JSON response when possible without raising., Sleep using exponential backoff., Executes HTTP requests with retry and timing support., Close the underlying requests session., Execute one test case and return a populated result. (+4 more)

### Community 22 - "ExploreScreen.tsx"
Cohesion: 0.05
Nodes (86): ExploreResponse, getExploreDestinations(), AIRPORT_DICTIONARY, AIRPORT_ONLY_DICTIONARY, FULL_PLACE_DICTIONARY, getAirportDisplayName(), getAirportEntry(), getAirportNameByCode() (+78 more)

### Community 23 - "TestResult"
Cohesion: 0.18
Nodes (8): AI and heuristic quality-control analysis for API test results., Analyze result quality with Ollama and rule-based checks., Close underlying HTTP session., Return human-readable quality notes for this result. Rule-based insights are…, ResponseAnalyzer, Stores execution data and findings for one test case., A test passes when there are no error-level issues., TestResult

### Community 24 - "ResponseValidator"
Cohesion: 0.22
Nodes (5): Any, Applies status, schema, and consistency checks., Run all checks and append issues to the result., Resolve a dotted path in a nested JSON-like payload. Supports indexes like…, ResponseValidator

### Community 25 - "Registry"
Cohesion: 0.20
Nodes (7): MultiSearchResult, isSkippedProviderErr(), NewRegistryFromEnv(), parseProviderNames(), GoogleFlights2Provider, Provider, Registry

### Community 26 - "context.Context"
Cohesion: 0.14
Nodes (14): DedupeProviderResults(), ItineraryFingerprint(), mergeSelfTransfer(), TotalStops(), uniqueStrings(), truncateGF2(), AttachCanonicalIdentityAll(), TestDedupeKeepsCheaper() (+6 more)

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.32
Nodes (13): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+5 more)

### Community 29 - "SearchLoadingOverlay.tsx"
Cohesion: 0.22
Nodes (11): getPhrasesForLanguage(), SEARCH_BUTTON_PHRASES, SEARCH_PROGRESS_PHRASES, s, SearchProgressBanner(), SearchProgressBannerProps, ExtraLeg, Props (+3 more)

### Community 30 - "exploreBuildRowsAndQueue"
Cohesion: 0.13
Nodes (17): airportCoord, exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut(), getAirportCoord() (+9 more)

### Community 31 - "backend_api_contracts.md"
Cohesion: 0.17
Nodes (11): 1.1 Create Search Session, 1.2 Get Search Session Status & Results, 1.3 Cancel Search Session (Optional, MVP+), 1. Flight Search Sessions, 2.1 Get Monthly Deals, 2. Monthly Deals API, 3.1 Search Airports & Cities, 3. Airport & City Autocomplete (+3 more)

### Community 32 - "SearchSession"
Cohesion: 0.50
Nodes (4): SearchSession, SearchSessionResultsResponse, SearchSessionStatus, sanitizeSessionForClient()

### Community 33 - "FiltersPanel.tsx"
Cohesion: 0.11
Nodes (22): f, FiltersPanel(), FiltersPanelProps, FlightDetailsModalProps, FlightResultCardProps, ICONS, KEYS, s (+14 more)

### Community 34 - "booking_resolve.go"
Cohesion: 0.10
Nodes (42): acquireBookingResolveSlot(), beginInflightResolve(), bookingResolveCacheKey(), bookingResolveMaxConcurrentFromEnv(), cacheTTLForStatus(), canonicalItineraryForOption(), countVerifiedExactOffers(), envDurationMinutes() (+34 more)

### Community 35 - "ValidationIssue"
Cohesion: 0.18
Nodes (7): Any, Serialize nested result for report output., Represents a single validation or analysis finding., Serialize issue to dictionary., Serialize case to dictionary., Append a new issue to this result., ValidationIssue

### Community 36 - "Backend QA Automation Tool"
Cohesion: 0.18
Nodes (10): Backend QA Automation Tool, Features, If the run feels slow or “stuck”, Notes, Optional AI Setup (Ollama), Output, Project Structure, Run (+2 more)

### Community 37 - "KiwiApifyProvider"
Cohesion: 0.17
Nodes (8): apifyErrorMessage(), flattenKiwiItems(), NewKiwiApifyProvider(), stringField(), truncateStr(), KiwiApifyProvider, kiwiCache, kiwiCacheEntry

### Community 38 - "kiwi_apify_provider.go"
Cohesion: 0.34
Nodes (14): asArray(), collectCarriers(), detectSelfTransfer(), extractKiwiLegs(), firstFloat(), firstString(), kiwiSegmentFromMap(), mapsToSegments() (+6 more)

### Community 39 - "search.ts"
Cohesion: 0.24
Nodes (15): CachedResult, createSearchSession(), fetchFresh(), getFromStorage(), getSearchSessionResults(), getStorage(), paramsMatch(), resultsCache (+7 more)

### Community 40 - "types/index.ts"
Cohesion: 0.10
Nodes (35): AppIcon(), AppIconLibrary, AppIconProps, styles, FormHeroHeader(), FormHeroHeaderProps, styles, formCardStyles (+27 more)

### Community 41 - "models.py"
Cohesion: 0.25
Nodes (5): Core data models for the API QA runner., Set completion timestamp., Return an ISO-8601 UTC timestamp., utc_now_iso(), Validation rules for API responses.

### Community 42 - "testing.T"
Cohesion: 0.12
Nodes (25): TestFlightNumbersEquivalent_leadingZeros(), parseKiwiApifyItems(), TestApifyErrorMessage(), TestBuildActorInputSolidcodeOnly(), TestDetectSelfTransfer(), TestKiwiApifyTimeout(), TestParseKiwiApifyItemsSolidcodeShape(), TestParseKiwiEmptyAndInvalid() (+17 more)

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "write-spa-fallbacks.mjs"
Cohesion: 0.33
Nodes (5): __dirname, dist, indexHtml, indexPath, SPA_ROUTES

### Community 45 - "DynamicDestinationsScreen.tsx"
Cohesion: 0.22
Nodes (14): DynamicDestinationsFormContent(), defaultParams, DynamicDestinationsScreen(), Nav, styles, addExtraDestinationLeg(), DynamicDestinationsValidation, emptyExtraLeg() (+6 more)

### Community 53 - "loadSearchSession"
Cohesion: 0.22
Nodes (22): loadSearchSession(), TestLoadSearchSession_Expiry(), searchSessionTTL(), startSearchSessionCleanup(), cleanupPersistedSessions(), SearchSessionResultsResponse, importLegacyJSONSessions(), initSessionStore() (+14 more)

### Community 54 - "ErrorBoundary"
Cohesion: 0.15
Nodes (4): ErrorBoundary, Props, s, State

### Community 55 - "ResultsScreen.tsx"
Cohesion: 0.11
Nodes (34): bestScore(), CheapestOption, currentGeneration(), defaultFormParams, HUB_AIRPORTS, PositioningOption, NOTE: params are read through refs, NOT effect deps. When this effect calls, ResultsScreen() (+26 more)

### Community 56 - "itinerary_test.go"
Cohesion: 0.23
Nodes (14): AttachCanonicalIdentity(), segTLVJFK(), TestCanonicalItineraryFingerprint_connectingFlight(), TestCanonicalItineraryFingerprint_differentFlightsDoNotCollide(), TestCanonicalItineraryFingerprint_directFlight(), TestCanonicalItineraryFingerprint_formattingStable(), TestCanonicalItineraryFingerprint_gf2AirlineNameStable(), TestCanonicalItineraryFingerprint_missingOptionalFields() (+6 more)

### Community 57 - "gf2Cache"
Cohesion: 0.25
Nodes (7): newGF2Cache(), newGF2RateLimiter(), NewGoogleFlights2Provider(), TestSearchLegCached_usesCache(), sync.RWMutex, gf2Cache, gf2CacheEntry

### Community 58 - "CalendarModal.tsx"
Cohesion: 0.38
Nodes (6): buildMonthDays(), CalendarModal(), getMonthStart(), Props, styles, WEEKDAYS

### Community 59 - "SelectBestOffer"
Cohesion: 0.20
Nodes (10): floatPtr(), TestSelectBestOffer_cheapestOTAOverAirline(), TestSelectBestOffer_conflictingCandidatesPicksCheapest(), TestSelectBestOffer_missingPrice(), TestSelectBestOffer_multipleMatching(), TestSelectBestOffer_prefersPriceAmongSameURLType(), TestSelectBestOffer_prefersQuoteMatchingPrice(), TestSelectBestOffer_rejectsGenericSearchURL() (+2 more)

### Community 60 - "matcher_test.go"
Cohesion: 0.17
Nodes (30): classifyURLType(), extractPrice(), cfgTest(), TestClassifyURLType_genericVsExact(), testConnectingTLVJFK(), TestExtractPrice_euroPrefixNotArrivalTime(), TestGenerateQueries_connecting(), TestGenerateQueries_direct() (+22 more)

### Community 61 - "CombineOneWayBatches"
Cohesion: 0.22
Nodes (9): TestCombineOneWayBatches(), TestCombineOneWayBatches_emptyBatch(), TestCompleteExtraLegs(), TestExtraLegsFingerprint(), TestHasExtraLegs(), TestAttachCanonicalIdentityAll_combineOneWay(), cloneLegs(), CombineOneWayBatches() (+1 more)

### Community 62 - "client.ts"
Cohesion: 0.18
Nodes (13): searchAirports(), apiGet(), apiUrl(), isLocalHostname(), IMPORTANT: Expo/Metro statically inlines EXPO_PUBLIC_* only when accessed via, resolveApiBase(), GetDealsRangeParams, getMonthDeals() (+5 more)

### Community 63 - "affiliate.ts"
Cohesion: 0.27
Nodes (9): AffiliateProvider, AffiliateProviderResponse, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink(), OutboundLinkResponse (+1 more)

### Community 64 - "DatePickerCalendar.tsx"
Cohesion: 0.33
Nodes (8): getDealsRange(), DatePickerCalendar(), DatePickerCalendarProps, getNext14Dates(), getRangeStartEnd(), styles, WEEKDAYS, DayDeal

### Community 65 - "AuthContext.tsx"
Cohesion: 0.16
Nodes (24): authHeaders(), AuthUser, changePassword(), createUser(), deleteUser(), fetchAuthMe(), fetchUsers(), LoginResponse (+16 more)

### Community 66 - "ValidateBookingURL"
Cohesion: 0.39
Nodes (6): TestValidateBookingURL_acceptsHTTPS(), TestValidateBookingURL_rejectsEmpty(), TestValidateBookingURL_rejectsJavascript(), TestValidateBookingURL_rejectsLocalhost(), TestValidateBookingURL_rejectsPrivateIP(), ValidateBookingURL()

### Community 68 - "TestApplySoftStrictBaggage"
Cohesion: 0.52
Nodes (6): applySoftStrictBaggage(), makeOfferWithBags(), makeOfferWithMissingBags(), TestApplySoftStrictBaggage(), TestClassifyOfferBaggage(), classifyOfferBaggage()

### Community 69 - "AdminRuntimeConfigPanel.tsx"
Cohesion: 0.16
Nodes (21): apiRequest(), adminAuthHeaders(), fetchAdminRuntimeConfig(), fetchRuntimeConfig(), saveAdminRuntimeConfig(), setRuntimeConfigStore(), RuntimeConfigContext, RuntimeConfigContextValue (+13 more)

### Community 71 - "TestExtractCarrierCodes"
Cohesion: 0.43
Nodes (6): CarrierCodes, makeOfferWithCarriers(), TestExtractCarrierCodes(), TestPrimaryDisplayCarrier(), ExtractCarrierCodes(), PrimaryDisplayCarrier()

## Knowledge Gaps
- **279 isolated node(s):** `ClicksByProvider`, `BookingResolveRequest`, `exploreLiveCandidate`, `flightcaptainweb`, `runtimeConfigBounds` (+274 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ProviderResult` connect `context.Context` to `providers.go`, `KiwiApifyProvider`, `kiwi_apify_provider.go`, `googleflights2_provider.go`, `CanonicalItinerary`, `testing.T`, `handleCreateSession`, `time.Time`, `itinerary_test.go`, `gf2Cache`, `CombineOneWayBatches`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `CanonicalItinerary` connect `CanonicalItinerary` to `BookingOffer`, `booking_resolve.go`, `handleCreateSession`, `context.Context`, `matcher_test.go`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `useLocale()` connect `useTheme` to `AuthContext.tsx`, `FlightDetailsModal.tsx`, `FiltersPanel.tsx`, `RootNavigator.tsx`, `AdminRuntimeConfigPanel.tsx`, `MonthDealsScreen.tsx`, `types/index.ts`, `DynamicDestinationsScreen.tsx`, `LocaleContext.tsx`, `ExploreScreen.tsx`, `ResultsScreen.tsx`, `SearchLoadingOverlay.tsx`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `ClicksByProvider`, `BookingResolveRequest`, `exploreLiveCandidate` to the rest of the system?**
  _279 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `BookingOffer` be split into smaller, more focused modules?**
  _Cohesion score 0.0647887323943662 - nodes in this community are weakly interconnected._
- **Should `RootNavigator.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10252100840336134 - nodes in this community are weakly interconnected._
- **Should `FlightDetailsModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.059673659673659674 - nodes in this community are weakly interconnected._