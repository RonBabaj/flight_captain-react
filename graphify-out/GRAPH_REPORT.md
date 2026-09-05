# Graph Report - workspace  (2026-09-05)

## Corpus Check
- 217 files · ~209,414 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1841 nodes · 5142 edges · 82 communities (74 shown, 4 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 448 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `bb3b58da`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- googleflights2_provider.go
- RootNavigator.tsx
- ResultsScreen
- Issue
- FlightDetailsModal.tsx
- MonthDealsScreen.tsx
- dependencies
- useTheme
- Features
- auth.go
- context.Context
- booking_resolve.go
- ui/index.ts
- compilerOptions
- kiwi_apify_provider.go
- canonical.go
- LocaleContext.tsx
- affiliate.go
- server.go
- dealsCache.ts
- qa_runner.py
- ApiClient
- matcher_test.go
- TestResult
- ResponseValidator
- runtime_config.go
- SearchRequest
- expo
- config_loader.py
- RuntimeConfigContext.tsx
- CanonicalItinerary
- backend_api_contracts.md
- CalendarModal.tsx
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
- extract.go
- ResultsScreen.tsx
- .Match
- DateRangePicker.tsx
- AppIcon.tsx
- store/index.ts
- ExploreScreen.tsx
- time.Time
- types/index.ts
- data/airports.ts
- api.ts
- FlightResultCard.tsx
- DynamicDestinationsFormContent.tsx
- App.tsx
- CanonicalItineraryFingerprint
- SortBar.tsx
- ThemeContext.tsx
- booking.ts
- Registry
- itineraryStops.ts
- server_review_test.go
- DraggableBottomSheet.tsx
- exchangeRates.ts
- affiliate.ts
- client.ts
- GoogleFlights2Provider
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
- `scoreSegment()` --calls--> `textContainsAirport()`  [INFERRED]
  backend/bookingmatch/verify.go → backend/bookingmatch/extract.go
- `handleExplore()` --calls--> `newExploreSessionID()`  [INFERRED]
  backend/server.go → backend/explore_session.go
- `handleExplore()` --calls--> `exploreSessionKey()`  [INFERRED]
  backend/server.go → backend/explore_session.go
- `main()` --calls--> `startExploreSessionCleanup()`  [INFERRED]
  backend/server.go → backend/explore_session.go
- `BuildLegAirlineDirectURL()` --calls--> `marketingCarrierForLeg()`  [INFERRED]
  backend/affiliate.go → backend/booking_gf2_resolve.go

## Import Cycles
- None detected.

## Communities (82 total, 4 thin omitted)

### Community 0 - "googleflights2_provider.go"
Cohesion: 0.12
Nodes (36): AirportLocation(), TestAirportLocation_UnknownFallsBackUTC(), TestParseGF2TimeWithDateHint_AirportLocal(), TestParseGF2TimeWithDateHint_TelAviv(), TestExtractGF2PartnerBookingTokenPrefersPartnerURL(), TestExtractGF2Leg_SingleSegment_DepartArriveDiffer(), TestExtractGF2Leg_TimeOnly_NoDateHint(), TestExtractGF2Leg_TimeOnly_WithDateHint() (+28 more)

### Community 1 - "RootNavigator.tsx"
Cohesion: 0.18
Nodes (14): DynamicDestinationsStack(), Stack, MonthDealsStack(), Stack, RootNavigator(), Stack, SearchStack(), Stack (+6 more)

### Community 2 - "ResultsScreen"
Cohesion: 0.16
Nodes (24): ResultsScreen(), defaultParams, SearchFormScreen(), styles, buildSearchString(), getParam(), getParams(), isWeb() (+16 more)

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "FlightDetailsModal.tsx"
Cohesion: 0.20
Nodes (17): airportTimeZones, getAirportTimeZone(), cabinLabel(), FlightDetailsModal(), formatDuration(), layoverBetween(), legDuration(), s (+9 more)

### Community 5 - "MonthDealsScreen.tsx"
Cohesion: 0.11
Nodes (30): buildDealsPositioningSignature(), dealBestScore(), fl, fmtDur(), formatDealDate(), hfm, HUB_AIRPORTS, layoverBetween() (+22 more)

### Community 6 - "dependencies"
Cohesion: 0.04
Nodes (44): @babel/core, expo, @expo/metro-runtime, expo-status-bar, dependencies, expo, @expo/metro-runtime, expo-status-bar (+36 more)

### Community 7 - "useTheme"
Cohesion: 0.11
Nodes (38): ClearableTextInput(), ClearableTextInputProps, styles, EditSearchModal(), SearchSummaryBar(), SearchLoadingOverlay(), useAuth(), useLocale() (+30 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (33): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+25 more)

### Community 9 - "auth.go"
Cohesion: 0.18
Nodes (26): authUserJSON(), bootstrapAdminUser(), createAuthSession(), envFlagTrue(), handleAuthLogin(), handleAuthMe(), handleAuthRegister(), handleAuthUsers() (+18 more)

### Community 10 - "context.Context"
Cohesion: 0.11
Nodes (35): findBookingOptionsArray(), firstPartnerBookingOption(), firstPartnerURLInMap(), firstStringByKeys(), GoogleFlights2Provider, ResolvedPartnerBooking, hostFromURL(), isPartnerBookingList() (+27 more)

### Community 11 - "booking_resolve.go"
Cohesion: 0.05
Nodes (112): airlineDomainForCarrier(), allocateLegQuoteAmount(), applySearchQuoteToOffer(), attachQuotedPriceMeta(), bookingMatchPriceNormalizer(), dedupeGF2PartnerOffers(), flightLegDurationMinutes(), gf2OffersHavePrice() (+104 more)

### Community 12 - "ui/index.ts"
Cohesion: 0.12
Nodes (33): BookingResolveResponse, isSafeBookingUrl(), PublicBookingOffer, bookingOfferProviderLabel(), bookingOfferSubtitle(), formatBookingOfferPriceAmount(), formatBookingOfferPriceLine(), formatProviderDisplayName() (+25 more)

### Community 13 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+15 more)

### Community 14 - "kiwi_apify_provider.go"
Cohesion: 0.13
Nodes (23): apifyErrorMessage(), asArray(), collectCarriers(), detectSelfTransfer(), extractKiwiLegs(), firstFloat(), firstString(), flattenKiwiItems() (+15 more)

### Community 15 - "canonical.go"
Cohesion: 0.14
Nodes (35): FlightOption, openJawOption(), TestBookingLinkModeDefaultsToGoogle(), TestBookingRouteFromSessionOption_splitOmitsReturn(), TestBuildGoogleFlightsFallbackFromParams(), TestBuildLegOrSegmentBookingURL_segment(), TestBuildOneWayLegBookingURL(), TestBuildSkyscannerPrefillURL_oneWay() (+27 more)

### Community 16 - "LocaleContext.tsx"
Cohesion: 0.22
Nodes (13): getStorage(), languageToLocale(), loadSaved(), LocaleContext, LocaleContextValue, LocaleProvider(), save(), VALID_CURRENCIES (+5 more)

### Community 17 - "affiliate.go"
Cohesion: 0.18
Nodes (16): BuildLegAirlineDirectURL(), BuildRedirectURL(), getAffiliateID(), GetClicksSummary(), getOTAProvider(), FlightOption, SearchSession, ParseOptionIndex() (+8 more)

### Community 18 - "server.go"
Cohesion: 0.07
Nodes (61): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, CanonicalFingerprint(), Carrier, CarrierCodes, CreateSearchSessionRequest (+53 more)

### Community 19 - "dealsCache.ts"
Cohesion: 0.25
Nodes (15): DealsState, MonthDealsResponse, CachedDealsResults, clearPendingDealsParams(), DealsParams, dealsParamsFingerprint(), getCachedDealsResults(), getLocalStorage() (+7 more)

### Community 20 - "qa_runner.py"
Cohesion: 0.14
Nodes (13): Namespace, Path, Any, Reporting helpers for test execution results., Render terminal summary and persist machine-readable reports., Print user-friendly report to stdout., Write a JSON report and return its path., ReportWriter (+5 more)

### Community 21 - "ApiClient"
Cohesion: 0.14
Nodes (12): ApiClient, Any, HTTP client utilities for executing API test cases., Parse JSON response when possible without raising., Sleep using exponential backoff., Executes HTTP requests with retry and timing support., Close the underlying requests session., Execute one test case and return a populated result. (+4 more)

### Community 22 - "matcher_test.go"
Cohesion: 0.13
Nodes (37): cfgTest(), floatPtr(), testConnectingTLVJFK(), TestGenerateQueries_connecting(), TestGenerateQueries_direct(), TestGenerateQueries_gf2AirlineNameIdentity(), TestGenerateQueries_includesRouteDateBookQuery(), TestGenerateQueries_prioritizesEndToEndLegRoute() (+29 more)

### Community 23 - "TestResult"
Cohesion: 0.18
Nodes (8): AI and heuristic quality-control analysis for API test results., Analyze result quality with Ollama and rule-based checks., Close underlying HTTP session., Return human-readable quality notes for this result. Rule-based insights are…, ResponseAnalyzer, Stores execution data and findings for one test case., A test passes when there are no error-level issues., TestResult

### Community 24 - "ResponseValidator"
Cohesion: 0.22
Nodes (5): Any, Applies status, schema, and consistency checks., Run all checks and append issues to the result., Resolve a dotted path in a nested JSON-like payload. Supports indexes like…, ResponseValidator

### Community 25 - "runtime_config.go"
Cohesion: 0.19
Nodes (18): adminAccessConfigured(), isAdminRequest(), configRangeError, adminTokenConfigured(), adminTokenFromHeader(), defaultRuntimeConfig(), errConfigOutOfRange(), getRuntimeConfig() (+10 more)

### Community 26 - "SearchRequest"
Cohesion: 0.23
Nodes (11): parseKiwiApifyItems(), TestIsOpenJaw(), TestResolveReturnAirports_classic(), TestResolveReturnAirports_openJaw(), TestSanitizeStandardSearchRequest(), SearchRequest, HasExtraLegs(), IsOpenJaw() (+3 more)

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.32
Nodes (13): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+5 more)

### Community 29 - "RuntimeConfigContext.tsx"
Cohesion: 0.21
Nodes (11): fetchRuntimeConfig(), setRuntimeConfigStore(), RuntimeConfigContext, RuntimeConfigContextValue, RuntimeConfigProvider(), DEFAULT_RUNTIME_CONFIG, RUNTIME_CONFIG_FIELDS, RuntimeConfig (+3 more)

### Community 30 - "CanonicalItinerary"
Cohesion: 0.14
Nodes (31): textContainsAny(), timeMatches(), connectingFlightQueries(), directFlightQueries(), legRouteQueries(), segmentArrTimeVariants(), segmentDateISO(), segmentDateVariants() (+23 more)

### Community 31 - "backend_api_contracts.md"
Cohesion: 0.17
Nodes (11): 1.1 Create Search Session, 1.2 Get Search Session Status & Results, 1.3 Cancel Search Session (Optional, MVP+), 1. Flight Search Sessions, 2.1 Get Monthly Deals, 2. Monthly Deals API, 3.1 Search Airports & Cities, 3. Airport & City Autocomplete (+3 more)

### Community 32 - "CalendarModal.tsx"
Cohesion: 0.38
Nodes (6): buildMonthDays(), CalendarModal(), getMonthStart(), Props, styles, WEEKDAYS

### Community 33 - "testing.T"
Cohesion: 0.07
Nodes (50): TestAllocateLegQuoteAmount_splitOpenJaw(), TestAttachQuotedPriceMeta_detectsMismatch(), TestGF2PartnerOfferFromURL_acceptsHTTPS(), TestGF2PartnerOfferFromURL_rejectsUnsafe(), TestLegDeepLink_rejectsMisalignedPartnerArrays(), TestLegDeepLink_rejectsWrongAirlineDirectCheckout(), TestQuoteBindingFromOption_usesOriginalWhenEstimate(), TestQuoteBindingFromOption_usesStoredLegPrice() (+42 more)

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
Nodes (22): authHeaders(), AuthUser, changePassword(), createUser(), deleteUser(), fetchAuthMe(), fetchUsers(), LoginResponse (+14 more)

### Community 38 - "ProviderResult"
Cohesion: 0.10
Nodes (33): DedupeProviderResults(), ItineraryFingerprint(), mergeSelfTransfer(), TotalStops(), uniqueStrings(), TestCombineOneWayBatches(), TestCombineOneWayBatches_emptyBatch(), TestCombineOneWayBatches_openJawReturnDiversity() (+25 more)

### Community 39 - "search.ts"
Cohesion: 0.20
Nodes (17): CachedResult, createSearchSession(), createSearchSessionWithRetry(), fetchFresh(), getFromStorage(), getSearchSessionResults(), getStorage(), isTransientSearchError() (+9 more)

### Community 40 - "skyscanner.ts"
Cohesion: 0.42
Nodes (10): BookingHop, bookingHopsFromOption(), firstSeg(), isClassicRoundTripLegs(), isoDatePrefix(), isSplitBookingItinerary(), lastSeg(), legNeedsSegmentSplit() (+2 more)

### Community 41 - "models.py"
Cohesion: 0.25
Nodes (5): Core data models for the API QA runner., Set completion timestamp., Return an ISO-8601 UTC timestamp., utc_now_iso(), Validation rules for API responses.

### Community 42 - "AirportAutocomplete.tsx"
Cohesion: 0.22
Nodes (26): getAirportDisplayName(), getAirportNameByCode(), getCityDisplayName(), getCountryDisplayName(), getCountryEntry(), AirportAutocomplete(), AirportAutocompleteProps, CountrySelectMode (+18 more)

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "write-spa-fallbacks.mjs"
Cohesion: 0.33
Nodes (5): __dirname, dist, indexHtml, indexPath, SPA_ROUTES

### Community 45 - "net/http.Request"
Cohesion: 0.19
Nodes (29): GetSessionAndOption(), SearchSessionResultsResponse, RecordClick(), ResolveProvider(), bearerTokenFromRequest(), handleAuthChangePassword(), handleAuthLogout(), normalizeProviderBookingURL() (+21 more)

### Community 53 - "loadSearchSession"
Cohesion: 0.17
Nodes (26): corsMiddleware(), loadSearchSession(), main(), TestLoadSearchSession_Expiry(), searchSessionTTL(), startSearchSessionCleanup(), cleanupPersistedSessions(), SearchSessionResultsResponse (+18 more)

### Community 54 - "extract.go"
Cohesion: 0.19
Nodes (16): classifyURLType(), extractFlightNumbers(), extractPrice(), flightNumberInText(), flightNumbersEquivalent(), splitFlightDesignator(), textContainsAirport(), TestClassifyURLType_genericVsExact() (+8 more)

### Community 55 - "ResultsScreen.tsx"
Cohesion: 0.09
Nodes (32): HubRouteLeg, HubRouteSummaryModal(), HubRouteSummaryModalProps, s, defaultParams, DynamicDestinationsScreen(), Nav, styles (+24 more)

### Community 56 - ".Match"
Cohesion: 0.11
Nodes (26): corpusText(), domainFromURL(), elapsedMs(), logMatchEvent(), countVerifiedPricedOffers(), MatchItinerary(), NewResolver(), truncateStr() (+18 more)

### Community 57 - "DateRangePicker.tsx"
Cohesion: 0.33
Nodes (9): useRuntimeConfig(), buildMonthDays(), DateRangePicker(), DateRangePickerProps, getMonthStart(), monthStartForYmd(), parseYmdUtc(), styles (+1 more)

### Community 58 - "AppIcon.tsx"
Cohesion: 0.08
Nodes (27): AppIcon(), AppIconLibrary, AppIconProps, styles, EditSearchModalProps, s, s, SearchSummaryBarProps (+19 more)

### Community 59 - "store/index.ts"
Cohesion: 0.20
Nodes (14): FiltersPanelProps, FlightDetailsModalProps, FlightResultCardProps, PositioningLegResult, defaultFilters, isCurrentSearchGeneration(), searchActions, SearchFilters (+6 more)

### Community 60 - "ExploreScreen.tsx"
Cohesion: 0.17
Nodes (23): getAirportEntry(), c, countryFlag(), d, DestCard(), ExploreScreen(), ExploreScreenProps, fmtDate() (+15 more)

### Community 61 - "time.Time"
Cohesion: 0.06
Nodes (49): airportCoord, minutesOfDay(), exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut() (+41 more)

### Community 62 - "types/index.ts"
Cohesion: 0.11
Nodes (22): searchAirports(), apiGet(), getDealsRange(), GetDealsRangeParams, getMonthDeals(), GetMonthDealsParams, ExploreResponse, getExploreDestinations() (+14 more)

### Community 63 - "data/airports.ts"
Cohesion: 0.15
Nodes (15): AIRPORT_DICTIONARY, AIRPORT_ONLY_DICTIONARY, FULL_PLACE_DICTIONARY, lower(), matchesQuery(), PLACE_SEARCH_LIMIT, rankResult(), searchAirportsLocal() (+7 more)

### Community 64 - "api.ts"
Cohesion: 0.14
Nodes (13): AirportCityResult, AirportCityType, AirportLike, ANYWHERE_CODE, BaggageClass, Carrier, COUNTRY_DEST_PREFIX, ExplorePriceSource (+5 more)

### Community 65 - "FlightResultCard.tsx"
Cohesion: 0.14
Nodes (24): AIRLINE_NAMES, getAirlineName(), AIRLINE_FULL_NAMES, NOTE: This is a starter subset of IATA airlines., f, FiltersPanel(), buildRoutePath(), c (+16 more)

### Community 66 - "DynamicDestinationsFormContent.tsx"
Cohesion: 0.18
Nodes (18): FormHeroHeader(), FormHeroHeaderProps, styles, formCardStyles, makeFormThemedStyles(), SearchSubmitButton(), SearchSubmitButtonProps, DynamicDestinationsFormContentProps (+10 more)

### Community 67 - "App.tsx"
Cohesion: 0.27
Nodes (8): App(), linking, RTLWrapper(), API_BASE, useExchangeRates(), ThemeProvider(), ensureRates(), fetchRates()

### Community 68 - "CanonicalItineraryFingerprint"
Cohesion: 0.14
Nodes (20): TestCanonicalItineraryForOption_isolatesSplitLegs(), TestCacheTTLForStatus_doesNotCacheMisses(), TestHandleBookingResolve_invalidItinerary(), TestHandleBookingResolve_prefillFallback(), TestHandleBookingResolve_searchUnavailable(), TestHandleBookingResolve_verified(), TestIsAffiliateTemplateBookingURL(), TestPreferAirlineDirectWhenCheaperThanMarkedUpOTA() (+12 more)

### Community 69 - "SortBar.tsx"
Cohesion: 0.40
Nodes (5): KEYS, s, SortBarProps, SortOption, SortField

### Community 70 - "ThemeContext.tsx"
Cohesion: 0.11
Nodes (19): getPhrasesForLanguage(), SEARCH_BUTTON_PHRASES, SEARCH_PROGRESS_PHRASES, s, SearchProgressBanner(), SearchProgressBannerProps, ExtraLeg, Props (+11 more)

### Community 71 - "booking.ts"
Cohesion: 0.33
Nodes (9): BookingResolveRequest, BookingResolveStatus, bookingRetryDelayMs(), fetchBookingResolveOnce(), isTransientBookingFetchError(), isTransientBookingResolveResponse(), PublicBookingAlternative, resolveBookingOffer() (+1 more)

### Community 72 - "Registry"
Cohesion: 0.20
Nodes (7): MultiSearchResult, isSkippedProviderErr(), NewRegistryFromEnv(), parseProviderNames(), GoogleFlights2Provider, Provider, Registry

### Community 73 - "itineraryStops.ts"
Cohesion: 0.48
Nodes (5): countByStopsFilter(), matchesStopsFilter(), maxStopsPerLeg(), stopsPerLeg(), totalStops()

### Community 74 - "server_review_test.go"
Cohesion: 0.50
Nodes (3): TestGetSessionAndOption_MissingOption(), TestHandleFlyFixRefineIssues_Smoke(), TestSegmentMatchesCabinClass()

### Community 77 - "exchangeRates.ts"
Cohesion: 0.31
Nodes (7): DisplayPrice(), DisplayPriceProps, convertPrice(), CURRENCY_SYMBOLS, CurrencyCode, getDisplayPrice(), ratesToUSD

### Community 78 - "affiliate.ts"
Cohesion: 0.27
Nodes (9): AffiliateProvider, AffiliateProviderResponse, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink(), OutboundLinkResponse (+1 more)

### Community 80 - "client.ts"
Cohesion: 0.16
Nodes (16): apiPost(), apiRequest(), apiUrl(), isLocalHostname(), IMPORTANT: Expo/Metro statically inlines EXPO_PUBLIC_* only when accessed via, resolveApiBase(), FlyfixInsightsGroup, FlyfixIssue (+8 more)

### Community 82 - "GoogleFlights2Provider"
Cohesion: 0.15
Nodes (8): GoogleFlights2Provider, newGF2Cache(), newGF2RateLimiter(), NewGoogleFlights2Provider(), truncateGF2(), gf2Cache, gf2CacheEntry, gf2RateLimiter

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

- **Why does `CanonicalItinerary` connect `CanonicalItinerary` to `testing.T`, `CanonicalItineraryFingerprint`, `ProviderResult`, `context.Context`, `booking_resolve.go`, `server.go`, `matcher_test.go`, `.Match`, `SearchRequest`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `useTheme()` connect `useTheme` to `FlightResultCard.tsx`, `DynamicDestinationsFormContent.tsx`, `ResultsScreen`, `FlightDetailsModal.tsx`, `SortBar.tsx`, `ThemeContext.tsx`, `MonthDealsScreen.tsx`, `AirportAutocomplete.tsx`, `ui/index.ts`, `LocaleContext.tsx`, `ResultsScreen.tsx`, `DateRangePicker.tsx`, `AppIcon.tsx`, `ExploreScreen.tsx`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `ProviderResult` connect `ProviderResult` to `googleflights2_provider.go`, `testing.T`, `context.Context`, `kiwi_apify_provider.go`, `server.go`, `GoogleFlights2Provider`, `SearchRequest`, `time.Time`, `CanonicalItinerary`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `ClicksByProvider`, `BookingResolveRequest`, `PublicBookingAlternative` to the rest of the system?**
  _286 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `googleflights2_provider.go` be split into smaller, more focused modules?**
  _Cohesion score 0.12073170731707317 - nodes in this community are weakly interconnected._
- **Should `Issue` be split into smaller, more focused modules?**
  _Cohesion score 0.1036036036036036 - nodes in this community are weakly interconnected._
- **Should `MonthDealsScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11174242424242424 - nodes in this community are weakly interconnected._