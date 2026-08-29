# Graph Report - workspace  (2026-08-29)

## Corpus Check
- 201 files · ~194,784 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1676 nodes · 4456 edges · 75 communities (71 shown, 4 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 369 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1addb653`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- BookingOffer
- RootNavigator.tsx
- FlightDetailsModal.tsx
- Issue
- ProviderResult
- MonthDealsScreen.tsx
- dependencies
- useTheme
- Features
- net/http.Request
- googleflights2_provider.go
- booking_resolve.go
- affiliate.go
- compilerOptions
- canonical.go
- runtime_config.go
- LocaleContext.tsx
- initTestAuthDB
- server.go
- context.Context
- qa_runner.py
- ApiClient
- ExploreScreen.tsx
- TestResult
- ResponseValidator
- Registry
- DedupeProviderResults
- expo
- config_loader.py
- ThemeContext.tsx
- exploreBuildRowsAndQueue
- backend_api_contracts.md
- testing.T
- SortBar.tsx
- skyscanner.ts
- ValidationIssue
- Backend QA Automation Tool
- KiwiApifyProvider
- time.Time
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
- ErrorBoundary
- ResultsScreen.tsx
- itinerary.go
- gf2Cache
- CalendarModal.tsx
- affiliate.ts
- matcher_test.go
- CanonicalSegment
- client.ts
- itinerary_test.go
- App.tsx
- AuthContext.tsx
- DatePickerCalendar.tsx
- searcher.go
- TestApplySoftStrictBaggage
- RuntimeConfigContext.tsx
- dealsCache.ts
- TestExtractCarrierCodes
- SelectBestOffer
- ValidateBookingURL
- DraggableBottomSheet.tsx

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 74 edges
2. `useLocale()` - 71 edges
3. `ProviderResult` - 39 edges
4. `MonthDealsScreen()` - 36 edges
5. `ResultsScreen()` - 34 edges
6. `VerifyCandidate()` - 30 edges
7. `CanonicalItinerary` - 30 edges
8. `TestResult` - 29 edges
9. `ExploreScreen()` - 27 edges
10. `CanonicalSegment` - 25 edges

## Surprising Connections (you probably didn't know these)
- `handleAffiliateProvider()` --calls--> `ResolveProvider()`  [INFERRED]
  backend/server.go → backend/affiliate.go
- `RecordClick()` --calls--> `randomID()`  [INFERRED]
  backend/affiliate.go → backend/server.go
- `handleAffiliateClicksSummary()` --calls--> `GetClicksSummary()`  [INFERRED]
  backend/server.go → backend/affiliate.go
- `GetSessionAndOption()` --calls--> `loadSearchSession()`  [INFERRED]
  backend/affiliate.go → backend/server.go
- `handleBookingResolve()` --calls--> `GetSessionAndOption()`  [INFERRED]
  backend/booking_resolve.go → backend/affiliate.go

## Import Cycles
- None detected.

## Communities (75 total, 4 thin omitted)

### Community 0 - "BookingOffer"
Cohesion: 0.06
Nodes (65): allocateLegQuoteAmount(), applySearchQuoteToOffer(), attachQuotedPriceMeta(), bookingMatchPriceNormalizer(), flightLegDurationMinutes(), gf2PartnerOfferFromQuoteURL(), gf2PartnerOfferFromResolved(), gf2PartnerOfferFromURL() (+57 more)

### Community 1 - "RootNavigator.tsx"
Cohesion: 0.10
Nodes (27): LandingScreen(), Nav, styles, useIsMobile(), DynamicDestinationsStack(), Stack, MonthDealsStack(), Stack (+19 more)

### Community 2 - "FlightDetailsModal.tsx"
Cohesion: 0.22
Nodes (16): BookingResolveRequest, BookingResolveResponse, BookingResolveStatus, isSafeBookingUrl(), PublicBookingOffer, resolveBookingOffer(), cabinLabel(), FlightDetailsModal() (+8 more)

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "ProviderResult"
Cohesion: 0.11
Nodes (29): TestCombineOneWayBatches(), TestCombineOneWayBatches_emptyBatch(), TestCompleteExtraLegs(), TestExtraLegsFingerprint(), TestHasExtraLegs(), TestAttachCanonicalIdentityAll_combineOneWay(), TestIsOpenJaw(), TestResolveReturnAirports_classic() (+21 more)

### Community 5 - "MonthDealsScreen.tsx"
Cohesion: 0.09
Nodes (38): CheaperCitiesOption, Props, s, buildDealsPositioningSignature(), dealBestScore(), fl, fmtDur(), formatDealDate() (+30 more)

### Community 6 - "dependencies"
Cohesion: 0.04
Nodes (44): @babel/core, expo, @expo/metro-runtime, expo-status-bar, dependencies, expo, @expo/metro-runtime, expo-status-bar (+36 more)

### Community 7 - "useTheme"
Cohesion: 0.10
Nodes (40): EditSearchModal(), HubRouteSummaryModal(), s, SearchSummaryBar(), SearchSummaryBarProps, SearchLoadingOverlay(), useAuth(), useLocale() (+32 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (33): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+25 more)

### Community 9 - "net/http.Request"
Cohesion: 0.16
Nodes (36): authUserJSON(), bearerTokenFromRequest(), bootstrapAdminUser(), createAuthSession(), envFlagTrue(), handleAuthChangePassword(), handleAuthLogout(), handleAuthMe() (+28 more)

### Community 10 - "googleflights2_provider.go"
Cohesion: 0.19
Nodes (28): TestExtractGF2Leg_SingleSegment_DepartArriveDiffer(), TestExtractGF2Leg_TimeOnly_NoDateHint(), TestExtractGF2Leg_TimeOnly_WithDateHint(), TestParseGF2Time_AcceptsFullDateTime(), TestParseGF2Time_RejectsTimeOnly(), buildGF2ResultFromItinerary(), extractGF2BookingToken(), extractGF2DurationMinutes() (+20 more)

### Community 11 - "booking_resolve.go"
Cohesion: 0.10
Nodes (41): acquireBookingResolveSlot(), beginInflightResolve(), bookingResolveCacheKey(), bookingResolveMaxConcurrentFromEnv(), cacheTTLForStatus(), canonicalItineraryForOption(), countVerifiedExactOffers(), envDurationMinutes() (+33 more)

### Community 12 - "affiliate.go"
Cohesion: 0.15
Nodes (23): BuildRedirectURL(), getAffiliateID(), GetClicksSummary(), getOTAProvider(), GetSessionAndOption(), FlightOption, SearchSession, SearchSessionResultsResponse (+15 more)

### Community 13 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+15 more)

### Community 14 - "canonical.go"
Cohesion: 0.15
Nodes (29): FlightOption, openJawOption(), TestBookingLinkModeDefaultsToGoogle(), TestBookingRouteFromSessionOption_splitOmitsReturn(), TestBuildGoogleFlightsFallbackFromParams(), TestBuildOneWayLegBookingURL(), TestBuildSkyscannerPrefillURL_oneWay(), TestBuildSkyscannerPrefillURL_roundTrip() (+21 more)

### Community 15 - "runtime_config.go"
Cohesion: 0.22
Nodes (16): adminAccessConfigured(), configRangeError, adminTokenConfigured(), defaultRuntimeConfig(), errConfigOutOfRange(), getRuntimeConfig(), handleAdminRuntimeConfig(), initRuntimeConfigStore() (+8 more)

### Community 16 - "LocaleContext.tsx"
Cohesion: 0.15
Nodes (15): EditSearchModalProps, s, HubRouteLeg, HubRouteSummaryModalProps, s, getStorage(), languageToLocale(), loadSaved() (+7 more)

### Community 17 - "initTestAuthDB"
Cohesion: 0.23
Nodes (15): handleAuthLogin(), initAuthStore(), initTestAuthDB(), randomTestPassword(), TestAuthLoginAndChangePassword(), TestAuthRegister(), TestAuthUserManagement(), TestBootstrapAdminPasswordSync() (+7 more)

### Community 18 - "server.go"
Cohesion: 0.07
Nodes (60): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, CanonicalFingerprint(), Carrier, CarrierCodes, CreateSearchSessionRequest (+52 more)

### Community 19 - "context.Context"
Cohesion: 0.13
Nodes (30): mergeExplorePriceRows(), exploreSessionKey(), getExploreSession(), newExploreSessionID(), putExploreSession(), exploreDestRow, exploreSession, FullRoundTrip (+22 more)

### Community 20 - "qa_runner.py"
Cohesion: 0.14
Nodes (13): Namespace, Path, Any, Reporting helpers for test execution results., Render terminal summary and persist machine-readable reports., Print user-friendly report to stdout., Write a JSON report and return its path., ReportWriter (+5 more)

### Community 21 - "ApiClient"
Cohesion: 0.14
Nodes (12): ApiClient, Any, HTTP client utilities for executing API test cases., Parse JSON response when possible without raising., Sleep using exponential backoff., Executes HTTP requests with retry and timing support., Close the underlying requests session., Execute one test case and return a populated result. (+4 more)

### Community 22 - "ExploreScreen.tsx"
Cohesion: 0.05
Nodes (88): getMonthDeals(), ExploreResponse, getExploreDestinations(), GetExploreDestinationsParams, AIRPORT_DICTIONARY, AIRPORT_ONLY_DICTIONARY, FULL_PLACE_DICTIONARY, getAirportDisplayName() (+80 more)

### Community 23 - "TestResult"
Cohesion: 0.18
Nodes (8): AI and heuristic quality-control analysis for API test results., Analyze result quality with Ollama and rule-based checks., Close underlying HTTP session., Return human-readable quality notes for this result. Rule-based insights are…, ResponseAnalyzer, Stores execution data and findings for one test case., A test passes when there are no error-level issues., TestResult

### Community 24 - "ResponseValidator"
Cohesion: 0.22
Nodes (5): Any, Applies status, schema, and consistency checks., Run all checks and append issues to the result., Resolve a dotted path in a nested JSON-like payload. Supports indexes like…, ResponseValidator

### Community 25 - "Registry"
Cohesion: 0.20
Nodes (7): MultiSearchResult, isSkippedProviderErr(), NewRegistryFromEnv(), parseProviderNames(), GoogleFlights2Provider, Provider, Registry

### Community 26 - "DedupeProviderResults"
Cohesion: 0.21
Nodes (9): DedupeProviderResults(), ItineraryFingerprint(), mergeSelfTransfer(), TotalStops(), uniqueStrings(), AttachCanonicalIdentityAll(), TestDedupeKeepsCheaper(), TestItineraryFingerprintStable() (+1 more)

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.32
Nodes (13): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+5 more)

### Community 29 - "ThemeContext.tsx"
Cohesion: 0.13
Nodes (17): getPhrasesForLanguage(), SEARCH_BUTTON_PHRASES, SEARCH_PROGRESS_PHRASES, s, SearchProgressBanner(), SearchProgressBannerProps, ExtraLeg, Props (+9 more)

### Community 30 - "exploreBuildRowsAndQueue"
Cohesion: 0.13
Nodes (17): airportCoord, exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut(), getAirportCoord() (+9 more)

### Community 31 - "backend_api_contracts.md"
Cohesion: 0.17
Nodes (11): 1.1 Create Search Session, 1.2 Get Search Session Status & Results, 1.3 Cancel Search Session (Optional, MVP+), 1. Flight Search Sessions, 2.1 Get Monthly Deals, 2. Monthly Deals API, 3.1 Search Airports & Cities, 3. Airport & City Autocomplete (+3 more)

### Community 32 - "testing.T"
Cohesion: 0.11
Nodes (28): TestFlightNumbersEquivalent_leadingZeros(), TestAttachReturnLegKeepPrice(), TestEnsureRoundTripLegs_nilSafe(), TestEnsureRoundTripLegs_noOpWhenTwoLegs(), parseKiwiApifyItems(), TestApifyErrorMessage(), TestBuildActorInputSolidcodeOnly(), TestDetectSelfTransfer() (+20 more)

### Community 33 - "SortBar.tsx"
Cohesion: 0.33
Nodes (6): ICONS, KEYS, s, SortBarProps, SortOption, SortField

### Community 34 - "skyscanner.ts"
Cohesion: 0.44
Nodes (8): FlightLeg, BookingHop, bookingHopsFromOption(), firstSeg(), isClassicRoundTripLegs(), isoDatePrefix(), isSplitBookingItinerary(), lastSeg()

### Community 35 - "ValidationIssue"
Cohesion: 0.18
Nodes (7): Any, Serialize nested result for report output., Represents a single validation or analysis finding., Serialize issue to dictionary., Serialize case to dictionary., Append a new issue to this result., ValidationIssue

### Community 36 - "Backend QA Automation Tool"
Cohesion: 0.18
Nodes (10): Backend QA Automation Tool, Features, If the run feels slow or “stuck”, Notes, Optional AI Setup (Ollama), Output, Project Structure, Run (+2 more)

### Community 37 - "KiwiApifyProvider"
Cohesion: 0.20
Nodes (8): apifyErrorMessage(), flattenKiwiItems(), NewKiwiApifyProvider(), stringField(), truncateStr(), sync.RWMutex, KiwiApifyProvider, kiwiCache

### Community 38 - "time.Time"
Cohesion: 0.30
Nodes (16): asArray(), collectCarriers(), detectSelfTransfer(), extractKiwiLegs(), firstFloat(), firstString(), kiwiSegmentFromMap(), mapsToSegments() (+8 more)

### Community 39 - "search.ts"
Cohesion: 0.13
Nodes (22): apiPost(), FlyfixInsightsGroup, FlyfixIssue, FlyfixRefinedReport, FlyfixSummary, refineIssues(), RefineIssuesRequestBody, CachedResult (+14 more)

### Community 40 - "DynamicDestinationsFormContent.tsx"
Cohesion: 0.10
Nodes (35): AppIcon(), AppIconLibrary, AppIconProps, styles, FormHeroHeader(), FormHeroHeaderProps, styles, formCardStyles (+27 more)

### Community 41 - "models.py"
Cohesion: 0.25
Nodes (5): Core data models for the API QA runner., Set completion timestamp., Return an ISO-8601 UTC timestamp., utc_now_iso(), Validation rules for API responses.

### Community 42 - "CanonicalItinerary"
Cohesion: 0.19
Nodes (11): elapsedMs(), logMatchEvent(), MatchResult, countVerifiedPricedOffers(), MatchItinerary(), truncateStr(), CanonicalItinerary, MatchEvent (+3 more)

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "write-spa-fallbacks.mjs"
Cohesion: 0.33
Nodes (5): __dirname, dist, indexHtml, indexPath, SPA_ROUTES

### Community 45 - "FlightResultCard.tsx"
Cohesion: 0.09
Nodes (36): DisplayPrice(), DisplayPriceProps, AIRLINE_NAMES, getAirlineName(), AIRLINE_FULL_NAMES, NOTE: This is a starter subset of IATA airlines., f, FiltersPanelProps (+28 more)

### Community 53 - "loadSearchSession"
Cohesion: 0.22
Nodes (22): loadSearchSession(), TestLoadSearchSession_Expiry(), searchSessionTTL(), startSearchSessionCleanup(), cleanupPersistedSessions(), SearchSessionResultsResponse, importLegacyJSONSessions(), initSessionStore() (+14 more)

### Community 54 - "ErrorBoundary"
Cohesion: 0.15
Nodes (4): ErrorBoundary, Props, s, State

### Community 55 - "ResultsScreen.tsx"
Cohesion: 0.09
Nodes (48): defaultParams, DynamicDestinationsScreen(), Nav, styles, bestScore(), CheapestOption, currentGeneration(), defaultFormParams (+40 more)

### Community 56 - "itinerary.go"
Cohesion: 0.23
Nodes (18): operatingFlightForMatch(), BuildCanonicalItinerary(), canonicalSegmentFromProvider(), FingerprintDebugString(), isIATACarrierCode(), flightNumbersEquivalent(), ResultMatchesItinerary(), segmentsLooselyMatch() (+10 more)

### Community 57 - "gf2Cache"
Cohesion: 0.22
Nodes (7): newGF2Cache(), newGF2RateLimiter(), NewGoogleFlights2Provider(), TestOpenJaw_usesDecomposedSearchPath(), TestSearchLegCached_usesCache(), gf2Cache, gf2CacheEntry

### Community 58 - "CalendarModal.tsx"
Cohesion: 0.38
Nodes (6): buildMonthDays(), CalendarModal(), getMonthStart(), Props, styles, WEEKDAYS

### Community 59 - "affiliate.ts"
Cohesion: 0.27
Nodes (9): AffiliateProvider, AffiliateProviderResponse, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink(), OutboundLinkResponse (+1 more)

### Community 60 - "matcher_test.go"
Cohesion: 0.17
Nodes (30): classifyURLType(), extractPrice(), cfgTest(), TestClassifyURLType_genericVsExact(), testConnectingTLVJFK(), TestExtractPrice_euroPrefixNotArrivalTime(), TestGenerateQueries_connecting(), TestGenerateQueries_direct() (+22 more)

### Community 61 - "CanonicalSegment"
Cohesion: 0.18
Nodes (26): extractFlightNumbers(), flightNumberInText(), flightNumbersEquivalent(), splitFlightDesignator(), textContainsAirport(), textContainsAny(), timeMatches(), connectingFlightQueries() (+18 more)

### Community 62 - "client.ts"
Cohesion: 0.18
Nodes (14): searchAirports(), apiGet(), apiRequest(), apiUrl(), isLocalHostname(), IMPORTANT: Expo/Metro statically inlines EXPO_PUBLIC_* only when accessed via, resolveApiBase(), getDealsRange() (+6 more)

### Community 63 - "itinerary_test.go"
Cohesion: 0.23
Nodes (14): AttachCanonicalIdentity(), segTLVJFK(), TestCanonicalItineraryFingerprint_connectingFlight(), TestCanonicalItineraryFingerprint_differentFlightsDoNotCollide(), TestCanonicalItineraryFingerprint_directFlight(), TestCanonicalItineraryFingerprint_formattingStable(), TestCanonicalItineraryFingerprint_gf2AirlineNameStable(), TestCanonicalItineraryFingerprint_missingOptionalFields() (+6 more)

### Community 64 - "App.tsx"
Cohesion: 0.19
Nodes (12): App(), linking, RTLWrapper(), API_BASE, getRuntimeConfig(), useExchangeRates(), ThemeProvider(), CURRENCY_SYMBOLS (+4 more)

### Community 65 - "AuthContext.tsx"
Cohesion: 0.16
Nodes (24): authHeaders(), AuthUser, changePassword(), createUser(), deleteUser(), fetchAuthMe(), fetchUsers(), LoginResponse (+16 more)

### Community 66 - "DatePickerCalendar.tsx"
Cohesion: 0.36
Nodes (7): DatePickerCalendar(), DatePickerCalendarProps, getNext14Dates(), getRangeStartEnd(), styles, WEEKDAYS, DayDeal

### Community 67 - "searcher.go"
Cohesion: 0.14
Nodes (22): defaultBookingMatchRunner(), corpusText(), domainFromURL(), NewResolver(), collectSerpAPIResultMaps(), DefaultConfig(), envInt(), NewPageFetcher() (+14 more)

### Community 68 - "TestApplySoftStrictBaggage"
Cohesion: 0.52
Nodes (6): applySoftStrictBaggage(), makeOfferWithBags(), makeOfferWithMissingBags(), TestApplySoftStrictBaggage(), TestClassifyOfferBaggage(), classifyOfferBaggage()

### Community 69 - "RuntimeConfigContext.tsx"
Cohesion: 0.19
Nodes (14): adminAuthHeaders(), fetchAdminRuntimeConfig(), fetchRuntimeConfig(), saveAdminRuntimeConfig(), setRuntimeConfigStore(), RuntimeConfigContext, RuntimeConfigContextValue, RuntimeConfigProvider() (+6 more)

### Community 70 - "dealsCache.ts"
Cohesion: 0.23
Nodes (16): DealsState, MonthDealsResponse, CachedDealsResults, clearPendingDealsParams(), DealsParams, dealsParamsFingerprint(), getCachedDealsResults(), getLocalStorage() (+8 more)

### Community 71 - "TestExtractCarrierCodes"
Cohesion: 0.83
Nodes (3): makeOfferWithCarriers(), TestExtractCarrierCodes(), TestPrimaryDisplayCarrier()

### Community 73 - "SelectBestOffer"
Cohesion: 0.20
Nodes (10): floatPtr(), TestSelectBestOffer_cheapestOTAOverAirline(), TestSelectBestOffer_conflictingCandidatesPicksCheapest(), TestSelectBestOffer_missingPrice(), TestSelectBestOffer_multipleMatching(), TestSelectBestOffer_prefersPriceAmongSameURLType(), TestSelectBestOffer_prefersQuoteMatchingPrice(), TestSelectBestOffer_rejectsGenericSearchURL() (+2 more)

### Community 74 - "ValidateBookingURL"
Cohesion: 0.39
Nodes (6): TestValidateBookingURL_acceptsHTTPS(), TestValidateBookingURL_rejectsEmpty(), TestValidateBookingURL_rejectsJavascript(), TestValidateBookingURL_rejectsLocalhost(), TestValidateBookingURL_rejectsPrivateIP(), ValidateBookingURL()

## Knowledge Gaps
- **279 isolated node(s):** `ClicksByProvider`, `BookingResolveRequest`, `exploreLiveCandidate`, `flightcaptainweb`, `runtimeConfigBounds` (+274 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ProviderResult` connect `ProviderResult` to `testing.T`, `KiwiApifyProvider`, `time.Time`, `googleflights2_provider.go`, `CanonicalItinerary`, `server.go`, `context.Context`, `itinerary.go`, `gf2Cache`, `DedupeProviderResults`, `itinerary_test.go`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `CanonicalItinerary` connect `CanonicalItinerary` to `BookingOffer`, `searcher.go`, `ProviderResult`, `booking_resolve.go`, `server.go`, `context.Context`, `itinerary.go`, `matcher_test.go`, `CanonicalSegment`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `handleFlyFixRefineIssues()` connect `net/http.Request` to `testing.T`, `Issue`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `ClicksByProvider`, `BookingResolveRequest`, `exploreLiveCandidate` to the rest of the system?**
  _279 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `BookingOffer` be split into smaller, more focused modules?**
  _Cohesion score 0.05754385964912281 - nodes in this community are weakly interconnected._
- **Should `RootNavigator.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09672830725462304 - nodes in this community are weakly interconnected._
- **Should `Issue` be split into smaller, more focused modules?**
  _Cohesion score 0.1036036036036036 - nodes in this community are weakly interconnected._