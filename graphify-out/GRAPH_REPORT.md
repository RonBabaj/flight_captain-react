# Graph Report - workspace  (2026-09-06)

## Corpus Check
- 217 files · ~209,876 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1841 nodes · 5143 edges · 75 communities (67 shown, 4 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 448 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `010b7349`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- googleflights2_provider.go
- RootNavigator.tsx
- useSearchParams.ts
- Issue
- FlightDetailsModal.tsx
- MonthDealsScreen.tsx
- dependencies
- useTheme
- Features
- auth.go
- gf2_booking_quote.go
- booking_resolve.go
- ui/index.ts
- compilerOptions
- kiwi_apify_provider.go
- canonical.go
- LocaleContext.tsx
- affiliate.go
- server.go
- itinerary_test.go
- qa_runner.py
- ApiClient
- matcher_test.go
- TestResult
- ResponseValidator
- runtime_config.go
- SelectBestOffer
- expo
- config_loader.py
- AdminRuntimeConfigPanel.tsx
- CanonicalItinerary
- backend_api_contracts.md
- gf2Cache
- testing.T
- ErrorBoundary
- ValidationIssue
- Backend QA Automation Tool
- AuthContext.tsx
- ProviderResult
- search.ts
- skyscanner.ts
- models.py
- AirportAutocomplete.tsx
- Fly-Fix – Frontend
- write-spa-fallbacks.mjs
- net/http.Request
- metro.config.js
- __init__.py
- flightcaptainweb
- loadSearchSession
- ValidateBookingURL
- ResultsScreen.tsx
- AppIcon.tsx
- ExploreScreen.tsx
- time.Time
- types/index.ts
- placeSearch.ts
- api.ts
- FlightResultCard.tsx
- ThemeContext.tsx
- CanonicalItineraryFingerprint
- SortBar.tsx
- Registry
- itineraryStops.ts
- segmentMatchesCabinClass
- DraggableBottomSheet.tsx
- exchangeRates.ts
- affiliate.ts
- context.Context
- TestApplySoftStrictBaggage
- TestExtractCarrierCodes

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 88 edges
2. `useLocale()` - 79 edges
3. `ProviderResult` - 44 edges
4. `BookingOffer` - 40 edges
5. `MonthDealsScreen()` - 36 edges
6. `ResultsScreen()` - 35 edges
7. `resolveGF2PartnerOffers()` - 33 edges
8. `runBookingMatch()` - 32 edges
9. `CanonicalItinerary` - 32 edges
10. `VerifyCandidate()` - 31 edges

## Surprising Connections (you probably didn't know these)
- `handleExplore()` --calls--> `newExploreSessionID()`  [INFERRED]
  backend/server.go → backend/explore_session.go
- `handleExplore()` --calls--> `exploreSessionKey()`  [INFERRED]
  backend/server.go → backend/explore_session.go
- `main()` --calls--> `startExploreSessionCleanup()`  [INFERRED]
  backend/server.go → backend/explore_session.go
- `handleAffiliateOutboundLink()` --calls--> `ResolveProvider()`  [INFERRED]
  backend/server.go → backend/affiliate.go
- `handleAffiliateProvider()` --calls--> `ResolveProvider()`  [INFERRED]
  backend/server.go → backend/affiliate.go

## Import Cycles
- None detected.

## Communities (75 total, 4 thin omitted)

### Community 0 - "googleflights2_provider.go"
Cohesion: 0.12
Nodes (35): AirportLocation(), TestAirportLocation_UnknownFallsBackUTC(), TestParseGF2TimeWithDateHint_AirportLocal(), TestParseGF2TimeWithDateHint_TelAviv(), TestExtractGF2BookingURL(), TestExtractGF2Leg_SingleSegment_DepartArriveDiffer(), TestExtractGF2Leg_TimeOnly_NoDateHint(), TestExtractGF2Leg_TimeOnly_WithDateHint() (+27 more)

### Community 1 - "RootNavigator.tsx"
Cohesion: 0.08
Nodes (30): linking, RTLWrapper(), API_BASE, LandingScreen(), Nav, styles, useIsMobile(), DynamicDestinationsStack() (+22 more)

### Community 2 - "useSearchParams.ts"
Cohesion: 0.24
Nodes (15): buildSearchString(), getParam(), getParams(), isWeb(), parseSearchParamsFromUrl(), SearchUrlState, updateSearchUrl(), useSearchParams() (+7 more)

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "FlightDetailsModal.tsx"
Cohesion: 0.13
Nodes (26): AIRLINE_NAMES, getAirlineName(), AIRLINE_FULL_NAMES, NOTE: This is a starter subset of IATA airlines., f, FiltersPanel(), FiltersPanelProps, cabinLabel() (+18 more)

### Community 5 - "MonthDealsScreen.tsx"
Cohesion: 0.10
Nodes (40): buildDealsPositioningSignature(), dealBestScore(), fl, formatDealDate(), hfm, HUB_AIRPORTS, m, MonthDealsScreen() (+32 more)

### Community 6 - "dependencies"
Cohesion: 0.04
Nodes (44): @babel/core, expo, @expo/metro-runtime, expo-status-bar, dependencies, expo, @expo/metro-runtime, expo-status-bar (+36 more)

### Community 7 - "useTheme"
Cohesion: 0.12
Nodes (29): EditSearchModal(), EditSearchModalProps, s, s, SearchSummaryBar(), SearchSummaryBarProps, useAuth(), useLocale() (+21 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (33): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+25 more)

### Community 9 - "auth.go"
Cohesion: 0.19
Nodes (23): authUserJSON(), bootstrapAdminUser(), createAuthSession(), envFlagTrue(), handleAuthLogin(), handleAuthRegister(), handleAuthUsers(), initAuthStore() (+15 more)

### Community 10 - "gf2_booking_quote.go"
Cohesion: 0.11
Nodes (34): findBookingOptionsArray(), firstPartnerBookingOption(), firstPartnerURLInMap(), firstStringByKeys(), GoogleFlights2Provider, ResolvedPartnerBooking, hostFromURL(), isPartnerBookingList() (+26 more)

### Community 11 - "booking_resolve.go"
Cohesion: 0.06
Nodes (102): airlineDomainForCarrier(), allocateLegQuoteAmount(), applySearchQuoteToOffer(), attachQuotedPriceMeta(), bookingMatchPriceNormalizer(), dedupeGF2PartnerOffers(), flightLegDurationMinutes(), gf2OffersHavePrice() (+94 more)

### Community 12 - "ui/index.ts"
Cohesion: 0.12
Nodes (33): BookingResolveRequest, BookingResolveResponse, BookingResolveStatus, isSafeBookingUrl(), PublicBookingAlternative, PublicBookingOffer, bookingOfferProviderLabel(), bookingOfferSubtitle() (+25 more)

### Community 13 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+15 more)

### Community 14 - "kiwi_apify_provider.go"
Cohesion: 0.12
Nodes (23): apifyErrorMessage(), asArray(), collectCarriers(), detectSelfTransfer(), extractKiwiLegs(), firstFloat(), firstString(), flattenKiwiItems() (+15 more)

### Community 15 - "canonical.go"
Cohesion: 0.14
Nodes (35): FlightOption, openJawOption(), TestBookingLinkModeDefaultsToGoogle(), TestBookingRouteFromSessionOption_splitOmitsReturn(), TestBuildGoogleFlightsFallbackFromParams(), TestBuildLegOrSegmentBookingURL_segment(), TestBuildOneWayLegBookingURL(), TestBuildSkyscannerPrefillURL_oneWay() (+27 more)

### Community 16 - "LocaleContext.tsx"
Cohesion: 0.22
Nodes (13): getStorage(), languageToLocale(), loadSaved(), LocaleContext, LocaleContextValue, LocaleProvider(), save(), VALID_CURRENCIES (+5 more)

### Community 17 - "affiliate.go"
Cohesion: 0.15
Nodes (21): BuildLegAirlineDirectURL(), BuildRedirectURL(), getAffiliateID(), GetClicksSummary(), getOTAProvider(), GetSessionAndOption(), FlightOption, SearchSession (+13 more)

### Community 18 - "server.go"
Cohesion: 0.06
Nodes (65): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, CanonicalFingerprint(), normalizeProviderBookingURL(), Carrier, CarrierCodes (+57 more)

### Community 19 - "itinerary_test.go"
Cohesion: 0.18
Nodes (17): AttachCanonicalIdentity(), FingerprintDebugString(), segTLVJFK(), TestCanonicalItineraryFingerprint_connectingFlight(), TestCanonicalItineraryFingerprint_differentFlightsDoNotCollide(), TestCanonicalItineraryFingerprint_directFlight(), TestCanonicalItineraryFingerprint_excludesPrice(), TestCanonicalItineraryFingerprint_formattingStable() (+9 more)

### Community 20 - "qa_runner.py"
Cohesion: 0.14
Nodes (13): Namespace, Path, Any, Reporting helpers for test execution results., Render terminal summary and persist machine-readable reports., Print user-friendly report to stdout., Write a JSON report and return its path., ReportWriter (+5 more)

### Community 21 - "ApiClient"
Cohesion: 0.14
Nodes (12): ApiClient, Any, HTTP client utilities for executing API test cases., Parse JSON response when possible without raising., Sleep using exponential backoff., Executes HTTP requests with retry and timing support., Close the underlying requests session., Execute one test case and return a populated result. (+4 more)

### Community 22 - "matcher_test.go"
Cohesion: 0.19
Nodes (26): extractPrice(), cfgTest(), testConnectingTLVJFK(), TestExtractPrice_euroPrefixNotArrivalTime(), TestGenerateQueries_connecting(), TestGenerateQueries_direct(), TestGenerateQueries_includesRouteDateBookQuery(), TestGenerateQueries_prioritizesEndToEndLegRoute() (+18 more)

### Community 23 - "TestResult"
Cohesion: 0.18
Nodes (8): AI and heuristic quality-control analysis for API test results., Analyze result quality with Ollama and rule-based checks., Close underlying HTTP session., Return human-readable quality notes for this result. Rule-based insights are…, ResponseAnalyzer, Stores execution data and findings for one test case., A test passes when there are no error-level issues., TestResult

### Community 24 - "ResponseValidator"
Cohesion: 0.22
Nodes (5): Any, Applies status, schema, and consistency checks., Run all checks and append issues to the result., Resolve a dotted path in a nested JSON-like payload. Supports indexes like…, ResponseValidator

### Community 25 - "runtime_config.go"
Cohesion: 0.22
Nodes (16): adminAccessConfigured(), configRangeError, adminTokenConfigured(), defaultRuntimeConfig(), errConfigOutOfRange(), getRuntimeConfig(), handleAdminRuntimeConfig(), initRuntimeConfigStore() (+8 more)

### Community 26 - "SelectBestOffer"
Cohesion: 0.18
Nodes (11): floatPtr(), TestSelectBestOffer_cheapestOTAOverAirline(), TestSelectBestOffer_conflictingCandidatesPicksCheapest(), TestSelectBestOffer_missingPrice(), TestSelectBestOffer_multipleMatching(), TestSelectBestOffer_prefersPriceAmongSameURLType(), TestSelectBestOffer_prefersQuoteMatchingPrice(), TestSelectBestOffer_rejectsGenericSearchURL() (+3 more)

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.32
Nodes (13): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+5 more)

### Community 29 - "AdminRuntimeConfigPanel.tsx"
Cohesion: 0.11
Nodes (30): apiRequest(), adminAuthHeaders(), fetchAdminRuntimeConfig(), fetchRuntimeConfig(), saveAdminRuntimeConfig(), setRuntimeConfigStore(), RuntimeConfigContext, RuntimeConfigContextValue (+22 more)

### Community 30 - "CanonicalItinerary"
Cohesion: 0.06
Nodes (72): corpusText(), domainFromURL(), extractFlightNumbers(), flightNumberInText(), flightNumbersEquivalent(), splitFlightDesignator(), textContainsAirport(), textContainsAny() (+64 more)

### Community 31 - "backend_api_contracts.md"
Cohesion: 0.17
Nodes (11): 1.1 Create Search Session, 1.2 Get Search Session Status & Results, 1.3 Cancel Search Session (Optional, MVP+), 1. Flight Search Sessions, 2.1 Get Monthly Deals, 2. Monthly Deals API, 3.1 Search Airports & Cities, 3. Airport & City Autocomplete (+3 more)

### Community 32 - "gf2Cache"
Cohesion: 0.25
Nodes (7): newGF2Cache(), newGF2RateLimiter(), NewGoogleFlights2Provider(), TestSearchLegCached_usesCache(), sync.RWMutex, gf2Cache, gf2CacheEntry

### Community 33 - "testing.T"
Cohesion: 0.10
Nodes (32): TestAllocateLegQuoteAmount_splitOpenJaw(), TestAttachQuotedPriceMeta_detectsMismatch(), TestGF2PartnerOfferFromURL_acceptsHTTPS(), TestGF2PartnerOfferFromURL_rejectsUnsafe(), TestLegDeepLink_rejectsMisalignedPartnerArrays(), TestLegDeepLink_rejectsWrongAirlineDirectCheckout(), TestQuoteBindingFromOption_usesOriginalWhenEstimate(), TestQuoteBindingFromOption_usesStoredLegPrice() (+24 more)

### Community 34 - "ErrorBoundary"
Cohesion: 0.15
Nodes (4): ErrorBoundary, Props, s, State

### Community 35 - "ValidationIssue"
Cohesion: 0.18
Nodes (7): Any, Serialize nested result for report output., Represents a single validation or analysis finding., Serialize issue to dictionary., Serialize case to dictionary., Append a new issue to this result., ValidationIssue

### Community 36 - "Backend QA Automation Tool"
Cohesion: 0.18
Nodes (10): Backend QA Automation Tool, Features, If the run feels slow or “stuck”, Notes, Optional AI Setup (Ollama), Output, Project Structure, Run (+2 more)

### Community 37 - "AuthContext.tsx"
Cohesion: 0.16
Nodes (24): authHeaders(), AuthUser, changePassword(), createUser(), deleteUser(), fetchAuthMe(), fetchUsers(), LoginResponse (+16 more)

### Community 38 - "ProviderResult"
Cohesion: 0.11
Nodes (32): DedupeProviderResults(), ItineraryFingerprint(), mergeSelfTransfer(), TotalStops(), uniqueStrings(), TestCombineOneWayBatches(), TestCombineOneWayBatches_emptyBatch(), TestCombineOneWayBatches_openJawReturnDiversity() (+24 more)

### Community 39 - "search.ts"
Cohesion: 0.12
Nodes (25): apiPost(), FlyfixInsightsGroup, FlyfixIssue, FlyfixRefinedReport, FlyfixSummary, refineIssues(), RefineIssuesRequestBody, CachedResult (+17 more)

### Community 40 - "skyscanner.ts"
Cohesion: 0.42
Nodes (10): BookingHop, bookingHopsFromOption(), firstSeg(), isClassicRoundTripLegs(), isoDatePrefix(), isSplitBookingItinerary(), lastSeg(), legNeedsSegmentSplit() (+2 more)

### Community 41 - "models.py"
Cohesion: 0.25
Nodes (5): Core data models for the API QA runner., Set completion timestamp., Return an ISO-8601 UTC timestamp., utc_now_iso(), Validation rules for API responses.

### Community 42 - "AirportAutocomplete.tsx"
Cohesion: 0.17
Nodes (26): getAirportDisplayName(), getAirportNameByCode(), getCityDisplayName(), getCountryEntry(), AirportAutocomplete(), AirportAutocompleteProps, CountrySelectMode, styles (+18 more)

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "write-spa-fallbacks.mjs"
Cohesion: 0.33
Nodes (5): __dirname, dist, indexHtml, indexPath, SPA_ROUTES

### Community 45 - "net/http.Request"
Cohesion: 0.24
Nodes (25): bearerTokenFromRequest(), handleAuthChangePassword(), handleAuthLogout(), handleAuthMe(), isAdminRequest(), requireAdminUser(), userFromRequest(), adminTokenFromHeader() (+17 more)

### Community 53 - "loadSearchSession"
Cohesion: 0.19
Nodes (24): SearchSessionResultsResponse, loadSearchSession(), TestLoadSearchSession_Expiry(), sanitizeSessionForClient(), searchSessionTTL(), startSearchSessionCleanup(), cleanupPersistedSessions(), SearchSessionResultsResponse (+16 more)

### Community 54 - "ValidateBookingURL"
Cohesion: 0.23
Nodes (12): classifyURLType(), TestClassifyURLType_genericVsExact(), IsCheckoutBookingURL(), IsNonBookableDomain(), TestIsCheckoutBookingURL_rejectsFlightSearchPages(), TestIsNonBookableDomain_blocksFlightRadar(), TestValidateBookingURL_acceptsHTTPS(), TestValidateBookingURL_rejectsEmpty() (+4 more)

### Community 55 - "ResultsScreen.tsx"
Cohesion: 0.09
Nodes (34): DynamicDestinationsFormContent(), DynamicDestinationsFormContentProps, styles, defaultParams, DynamicDestinationsScreen(), Nav, styles, CheaperCitiesOption (+26 more)

### Community 58 - "AppIcon.tsx"
Cohesion: 0.10
Nodes (24): AppIcon(), AppIconLibrary, AppIconProps, styles, ClearableTextInput(), ClearableTextInputProps, styles, HubRouteLeg (+16 more)

### Community 60 - "ExploreScreen.tsx"
Cohesion: 0.16
Nodes (24): getExploreDestinations(), getAirportEntry(), c, countryFlag(), d, DestCard(), ExploreScreen(), ExploreScreenProps (+16 more)

### Community 61 - "time.Time"
Cohesion: 0.06
Nodes (49): airportCoord, minutesOfDay(), exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut() (+41 more)

### Community 62 - "types/index.ts"
Cohesion: 0.10
Nodes (25): searchAirports(), apiGet(), apiUrl(), isLocalHostname(), IMPORTANT: Expo/Metro statically inlines EXPO_PUBLIC_* only when accessed via, resolveApiBase(), getDealsRange(), GetDealsRangeParams (+17 more)

### Community 63 - "placeSearch.ts"
Cohesion: 0.13
Nodes (26): AIRPORT_DICTIONARY, AIRPORT_ONLY_DICTIONARY, FULL_PLACE_DICTIONARY, lower(), matchesQuery(), PLACE_SEARCH_LIMIT, rankResult(), searchAirportsLocal() (+18 more)

### Community 64 - "api.ts"
Cohesion: 0.12
Nodes (20): defaultFilters, isCurrentSearchGeneration(), searchActions, SearchFilters, SearchState, SortOrder, useSearchStore, AirportCityType (+12 more)

### Community 65 - "FlightResultCard.tsx"
Cohesion: 0.14
Nodes (25): airportTimeZones, getAirportTimeZone(), buildRoutePath(), c, fmtShortDate(), LegScheduleBlock(), fmtDur(), layoverBetween() (+17 more)

### Community 66 - "ThemeContext.tsx"
Cohesion: 0.08
Nodes (34): FormHeroHeader(), FormHeroHeaderProps, styles, formCardStyles, makeFormThemedStyles(), getPhrasesForLanguage(), SEARCH_BUTTON_PHRASES, SEARCH_PROGRESS_PHRASES (+26 more)

### Community 68 - "CanonicalItineraryFingerprint"
Cohesion: 0.15
Nodes (19): TestCanonicalItineraryForOption_isolatesSplitLegs(), TestCacheTTLForStatus_doesNotCacheMisses(), TestHandleBookingResolve_invalidItinerary(), TestHandleBookingResolve_prefillFallback(), TestHandleBookingResolve_searchUnavailable(), TestHandleBookingResolve_verified(), TestIsAffiliateTemplateBookingURL(), TestPreferAirlineDirectWhenCheaperThanMarkedUpOTA() (+11 more)

### Community 69 - "SortBar.tsx"
Cohesion: 0.33
Nodes (6): KEYS, s, SortBar(), SortBarProps, SortOption, SortField

### Community 72 - "Registry"
Cohesion: 0.20
Nodes (7): MultiSearchResult, isSkippedProviderErr(), NewRegistryFromEnv(), parseProviderNames(), GoogleFlights2Provider, Provider, Registry

### Community 73 - "itineraryStops.ts"
Cohesion: 0.48
Nodes (5): countByStopsFilter(), matchesStopsFilter(), maxStopsPerLeg(), stopsPerLeg(), totalStops()

### Community 74 - "segmentMatchesCabinClass"
Cohesion: 0.40
Nodes (4): TestGetSessionAndOption_MissingOption(), TestHandleFlyFixRefineIssues_Smoke(), TestSegmentMatchesCabinClass(), segmentMatchesCabinClass()

### Community 77 - "exchangeRates.ts"
Cohesion: 0.14
Nodes (18): App(), bookingRetryDelayMs(), fetchBookingResolveOnce(), isTransientBookingFetchError(), isTransientBookingResolveResponse(), resolveBookingOffer(), DisplayPrice(), DisplayPriceProps (+10 more)

### Community 78 - "affiliate.ts"
Cohesion: 0.27
Nodes (9): AffiliateProvider, AffiliateProviderResponse, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink(), OutboundLinkResponse (+1 more)

### Community 82 - "context.Context"
Cohesion: 0.13
Nodes (17): TestHasExtraLegs(), GoogleFlights2Provider, truncateGF2(), TestIsOpenJaw(), TestResolveReturnAirports_classic(), TestResolveReturnAirports_openJaw(), TestSanitizeStandardSearchRequest(), SearchRequest (+9 more)

### Community 84 - "TestApplySoftStrictBaggage"
Cohesion: 0.52
Nodes (6): applySoftStrictBaggage(), makeOfferWithBags(), makeOfferWithMissingBags(), TestApplySoftStrictBaggage(), TestClassifyOfferBaggage(), classifyOfferBaggage()

### Community 86 - "TestExtractCarrierCodes"
Cohesion: 0.83
Nodes (3): makeOfferWithCarriers(), TestExtractCarrierCodes(), TestPrimaryDisplayCarrier()

## Knowledge Gaps
- **286 isolated node(s):** `ClicksByProvider`, `BookingResolveRequest`, `PublicBookingAlternative`, `exploreLiveCandidate`, `flightcaptainweb` (+281 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 393 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `CanonicalItinerary` connect `CanonicalItinerary` to `CanonicalItineraryFingerprint`, `ProviderResult`, `gf2_booking_quote.go`, `booking_resolve.go`, `server.go`, `itinerary_test.go`, `context.Context`, `matcher_test.go`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `useTheme()` connect `useTheme` to `FlightResultCard.tsx`, `ThemeContext.tsx`, `RootNavigator.tsx`, `FlightDetailsModal.tsx`, `AuthContext.tsx`, `SortBar.tsx`, `MonthDealsScreen.tsx`, `AirportAutocomplete.tsx`, `ui/index.ts`, `LocaleContext.tsx`, `ResultsScreen.tsx`, `AppIcon.tsx`, `ExploreScreen.tsx`, `AdminRuntimeConfigPanel.tsx`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `ProviderResult` connect `ProviderResult` to `googleflights2_provider.go`, `gf2Cache`, `gf2_booking_quote.go`, `kiwi_apify_provider.go`, `server.go`, `itinerary_test.go`, `context.Context`, `time.Time`, `CanonicalItinerary`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `ClicksByProvider`, `BookingResolveRequest`, `PublicBookingAlternative` to the rest of the system?**
  _286 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `googleflights2_provider.go` be split into smaller, more focused modules?**
  _Cohesion score 0.12435897435897436 - nodes in this community are weakly interconnected._
- **Should `RootNavigator.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08362369337979095 - nodes in this community are weakly interconnected._
- **Should `Issue` be split into smaller, more focused modules?**
  _Cohesion score 0.1036036036036036 - nodes in this community are weakly interconnected._