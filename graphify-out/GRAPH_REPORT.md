# Graph Report - workspace  (2026-09-08)

## Corpus Check
- 220 files · ~211,954 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1863 nodes · 5356 edges · 88 communities (81 shown, 4 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 459 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7af43493`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- googleflights2_provider.go
- RootNavigator.tsx
- ResultsScreen
- Issue
- FlightDetailsModal.tsx
- dealsCache.ts
- dependencies
- useTheme
- Features
- initTestAuthDB
- .ResolveQuotedPartnerBooking
- booking_resolve.go
- ui/index.ts
- compilerOptions
- KiwiApifyProvider
- canonical.go
- MonthDealsScreen.tsx
- affiliate.go
- server.go
- runBookingMatch
- qa_runner.py
- ApiClient
- matcher_test.go
- TestResult
- ResponseValidator
- runtime_config.go
- booking_gf2_resolve.go
- expo
- config_loader.py
- RuntimeConfigContext.tsx
- .Match
- backend_api_contracts.md
- CanonicalSegment
- testing.T
- exploreBuildRowsAndQueue
- ValidationIssue
- Backend QA Automation Tool
- AuthContext.tsx
- ProviderResult
- search.ts
- skyscanner.ts
- models.py
- placeSearch.ts
- Fly-Fix – Frontend
- write-spa-fallbacks.mjs
- net/http.Request
- metro.config.js
- __init__.py
- gen_explore_airport_coords.py
- flightcaptainweb
- loadSearchSession
- ValidateBookingURL
- ResultsScreen.tsx
- BookingOffer
- CanonicalItinerary
- react-native
- gf2_booking_quote.go
- ExploreScreen.tsx
- gf2_deals.go
- apiGet
- IsOpenJaw
- api.ts
- MonthDealsScreen
- ThemeContext.tsx
- GF2SearchAirports
- AirportLocation
- SearchFormScreen.tsx
- AirportAutocomplete.tsx
- SelectBestOffer
- Registry
- kiwi_apify_provider.go
- TestExtractCarrierCodes
- IsGF2RateLimitError
- flyfix.ts
- react
- client.ts
- DatePickerCalendar.tsx
- DedupeProviderResults
- CalendarModal.tsx
- context.Context
- booking.ts
- TestApplySoftStrictBaggage
- DateRangePicker.tsx
- extractGF2BookingURL
- gf2Cache

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 88 edges
2. `useLocale()` - 79 edges
3. `react` - 62 edges
4. `react-native` - 54 edges
5. `ProviderResult` - 48 edges
6. `BookingOffer` - 40 edges
7. `MonthDealsScreen()` - 36 edges
8. `ResultsScreen()` - 35 edges
9. `resolveGF2PartnerOffers()` - 33 edges
10. `runBookingMatch()` - 32 edges

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

## Communities (88 total, 4 thin omitted)

### Community 0 - "googleflights2_provider.go"
Cohesion: 0.28
Nodes (23): buildGF2ResultFromItinerary(), extractGF2BookingToken(), extractGF2DurationMinutes(), extractGF2Flight(), extractGF2Itineraries(), extractGF2ItinerariesFromMap(), extractGF2Leg(), extractGF2LegFromFlightsArray() (+15 more)

### Community 1 - "RootNavigator.tsx"
Cohesion: 0.09
Nodes (19): ErrorBoundary, Props, s, State, DynamicDestinationsStack(), Stack, MonthDealsStack(), Stack (+11 more)

### Community 2 - "ResultsScreen"
Cohesion: 0.15
Nodes (25): currentGeneration(), ResultsScreen(), SearchFormScreen(), buildSearchString(), getParam(), getParams(), isWeb(), parseSearchParamsFromUrl() (+17 more)

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "FlightDetailsModal.tsx"
Cohesion: 0.09
Nodes (43): AIRLINE_NAMES, getAirlineName(), AIRLINE_FULL_NAMES, NOTE: This is a starter subset of IATA airlines., f, FiltersPanel(), FiltersPanelProps, cabinLabel() (+35 more)

### Community 5 - "dealsCache.ts"
Cohesion: 0.23
Nodes (16): DealsState, MonthDealsResponse, CachedDealsResults, clearPendingDealsParams(), DealsParams, dealsParamsFingerprint(), getCachedDealsResults(), getLocalStorage() (+8 more)

### Community 6 - "dependencies"
Cohesion: 0.05
Nodes (37): dependencies, expo, @expo/metro-runtime, expo-status-bar, react, react-dom, react-native, react-native-safe-area-context (+29 more)

### Community 7 - "useTheme"
Cohesion: 0.09
Nodes (45): ClearableTextInput(), ClearableTextInputProps, styles, EditSearchModal(), HubRouteSummaryModal(), SearchSummaryBar(), useAuth(), useLocale() (+37 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (33): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+25 more)

### Community 9 - "initTestAuthDB"
Cohesion: 0.26
Nodes (14): handleAuthLogin(), initAuthStore(), initTestAuthDB(), randomTestPassword(), TestAuthLoginAndChangePassword(), TestAuthRegister(), TestAuthUserManagement(), TestBootstrapAdminPasswordSync() (+6 more)

### Community 10 - ".ResolveQuotedPartnerBooking"
Cohesion: 0.24
Nodes (12): applySearchQuoteToOffer(), GoogleFlights2Provider, QuoteBinding, ResolvedPartnerBooking, providerFromURL(), extractGF2PartnerBookingToken(), findFirstPartnerCheckoutURL(), findFirstStringByKeys() (+4 more)

### Community 11 - "booking_resolve.go"
Cohesion: 0.13
Nodes (32): acquireBookingResolveSlot(), beginInflightResolve(), bookingOfferInGF2Sources(), bookingOfferSameURL(), bookingResolveCacheKey(), bookingResolveFailureResponse(), bookingResolveMaxConcurrentFromEnv(), cacheTTLForStatus() (+24 more)

### Community 12 - "ui/index.ts"
Cohesion: 0.13
Nodes (32): BookingResolveResponse, isSafeBookingUrl(), PublicBookingOffer, bookingOfferProviderLabel(), bookingOfferSubtitle(), formatBookingOfferPriceAmount(), formatBookingOfferPriceLine(), formatProviderDisplayName() (+24 more)

### Community 13 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 14 - "KiwiApifyProvider"
Cohesion: 0.18
Nodes (7): apifyErrorMessage(), NewKiwiApifyProvider(), stringField(), truncateStr(), KiwiApifyProvider, kiwiCache, kiwiCacheEntry

### Community 15 - "canonical.go"
Cohesion: 0.13
Nodes (38): FlightOption, openJawOption(), TestBookingLinkModeDefaultsToGoogle(), TestBookingRouteFromSessionOption_splitOmitsReturn(), TestBuildGoogleFlightsFallbackFromParams(), TestBuildLegOrSegmentBookingURL_segment(), TestBuildOneWayLegBookingURL(), TestBuildSkyscannerPrefillURL_oneWay() (+30 more)

### Community 16 - "MonthDealsScreen.tsx"
Cohesion: 0.08
Nodes (37): getStorage(), languageToLocale(), loadSaved(), LocaleContext, LocaleContextValue, LocaleProvider(), save(), VALID_CURRENCIES (+29 more)

### Community 17 - "affiliate.go"
Cohesion: 0.13
Nodes (23): BuildLegAirlineDirectURL(), BuildRedirectURL(), getAffiliateID(), GetClicksSummary(), getOTAProvider(), GetSessionAndOption(), FlightOption, SearchSession (+15 more)

### Community 18 - "server.go"
Cohesion: 0.07
Nodes (60): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, CanonicalFingerprint(), Carrier, CarrierCodes, CreateSearchSessionRequest (+52 more)

### Community 19 - "runBookingMatch"
Cohesion: 0.18
Nodes (20): legRouteLabel(), TestCanonicalItineraryForOption_isolatesSplitLegs(), runBookingMatch(), TestCacheTTLForStatus_doesNotCacheMisses(), TestHandleBookingResolve_invalidItinerary(), TestHandleBookingResolve_prefillFallback(), TestHandleBookingResolve_searchUnavailable(), TestHandleBookingResolve_verified() (+12 more)

### Community 20 - "qa_runner.py"
Cohesion: 0.14
Nodes (13): Namespace, Path, Any, Reporting helpers for test execution results., Render terminal summary and persist machine-readable reports., Print user-friendly report to stdout., Write a JSON report and return its path., ReportWriter (+5 more)

### Community 21 - "ApiClient"
Cohesion: 0.14
Nodes (12): ApiClient, Any, HTTP client utilities for executing API test cases., Parse JSON response when possible without raising., Sleep using exponential backoff., Executes HTTP requests with retry and timing support., Close the underlying requests session., Execute one test case and return a populated result. (+4 more)

### Community 22 - "matcher_test.go"
Cohesion: 0.16
Nodes (29): classifyURLType(), extractPrice(), cfgTest(), floatPtr(), TestClassifyURLType_genericVsExact(), testConnectingTLVJFK(), TestExtractPrice_euroPrefixNotArrivalTime(), TestGenerateQueries_connecting() (+21 more)

### Community 23 - "TestResult"
Cohesion: 0.18
Nodes (8): AI and heuristic quality-control analysis for API test results., Analyze result quality with Ollama and rule-based checks., Close underlying HTTP session., Return human-readable quality notes for this result. Rule-based insights are…, ResponseAnalyzer, Stores execution data and findings for one test case., A test passes when there are no error-level issues., TestResult

### Community 24 - "ResponseValidator"
Cohesion: 0.22
Nodes (5): Any, Applies status, schema, and consistency checks., Run all checks and append issues to the result., Resolve a dotted path in a nested JSON-like payload. Supports indexes like…, ResponseValidator

### Community 25 - "runtime_config.go"
Cohesion: 0.22
Nodes (16): adminAccessConfigured(), configRangeError, adminTokenConfigured(), defaultRuntimeConfig(), errConfigOutOfRange(), getRuntimeConfig(), handleAdminRuntimeConfig(), initRuntimeConfigStore() (+8 more)

### Community 26 - "booking_gf2_resolve.go"
Cohesion: 0.16
Nodes (32): airlineDomainForCarrier(), allocateLegQuoteAmount(), attachQuotedPriceMeta(), dedupeGF2PartnerOffers(), flightLegDurationMinutes(), gf2OffersHavePrice(), gf2PartnerOfferFromQuoteURL(), gf2PartnerOfferFromResolved() (+24 more)

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.32
Nodes (13): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+5 more)

### Community 29 - "RuntimeConfigContext.tsx"
Cohesion: 0.18
Nodes (15): apiRequest(), adminAuthHeaders(), fetchAdminRuntimeConfig(), fetchRuntimeConfig(), saveAdminRuntimeConfig(), setRuntimeConfigStore(), RuntimeConfigContext, RuntimeConfigContextValue (+7 more)

### Community 30 - ".Match"
Cohesion: 0.11
Nodes (28): defaultBookingMatchRunner(), corpusText(), domainFromURL(), elapsedMs(), logMatchEvent(), countVerifiedPricedOffers(), MatchItinerary(), NewResolver() (+20 more)

### Community 31 - "backend_api_contracts.md"
Cohesion: 0.17
Nodes (11): 1.1 Create Search Session, 1.2 Get Search Session Status & Results, 1.3 Cancel Search Session (Optional, MVP+), 1. Flight Search Sessions, 2.1 Get Monthly Deals, 2. Monthly Deals API, 3.1 Search Airports & Cities, 3. Airport & City Autocomplete (+3 more)

### Community 32 - "CanonicalSegment"
Cohesion: 0.14
Nodes (32): extractFlightNumbers(), flightNumberInText(), flightNumbersEquivalent(), splitFlightDesignator(), textContainsAirport(), textContainsAny(), timeMatches(), TestFlightNumbersEquivalent_leadingZeros() (+24 more)

### Community 33 - "testing.T"
Cohesion: 0.06
Nodes (57): TestAllocateLegQuoteAmount_splitOpenJaw(), TestAttachQuotedPriceMeta_detectsMismatch(), TestGF2PartnerOfferFromURL_acceptsHTTPS(), TestGF2PartnerOfferFromURL_rejectsUnsafe(), TestLegDeepLink_rejectsMisalignedPartnerArrays(), TestLegDeepLink_rejectsWrongAirlineDirectCheckout(), TestQuoteBindingFromOption_usesOriginalWhenEstimate(), TestQuoteBindingFromOption_usesStoredLegPrice() (+49 more)

### Community 34 - "exploreBuildRowsAndQueue"
Cohesion: 0.13
Nodes (17): airportCoord, exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut(), getAirportCoord() (+9 more)

### Community 35 - "ValidationIssue"
Cohesion: 0.18
Nodes (7): Any, Serialize nested result for report output., Represents a single validation or analysis finding., Serialize issue to dictionary., Serialize case to dictionary., Append a new issue to this result., ValidationIssue

### Community 36 - "Backend QA Automation Tool"
Cohesion: 0.18
Nodes (10): Backend QA Automation Tool, Features, If the run feels slow or “stuck”, Notes, Optional AI Setup (Ollama), Output, Project Structure, Run (+2 more)

### Community 37 - "AuthContext.tsx"
Cohesion: 0.16
Nodes (23): authHeaders(), AuthUser, changePassword(), createUser(), deleteUser(), fetchAuthMe(), fetchUsers(), LoginResponse (+15 more)

### Community 38 - "ProviderResult"
Cohesion: 0.18
Nodes (21): cloneLegs(), CombineOneWayBatches(), CompleteExtraLegs(), extraLegMaxPerBatch(), ExtraLegsFingerprint(), finalizeCombinedBatches(), MultiSearchResult, ProviderResult (+13 more)

### Community 39 - "search.ts"
Cohesion: 0.20
Nodes (18): CachedResult, createSearchSession(), createSearchSessionWithRetry(), fetchFresh(), getFromStorage(), getSearchSessionResults(), getStorage(), isTransientSearchError() (+10 more)

### Community 40 - "skyscanner.ts"
Cohesion: 0.42
Nodes (10): BookingHop, bookingHopsFromOption(), firstSeg(), isClassicRoundTripLegs(), isoDatePrefix(), isSplitBookingItinerary(), lastSeg(), legNeedsSegmentSplit() (+2 more)

### Community 41 - "models.py"
Cohesion: 0.25
Nodes (5): Core data models for the API QA runner., Set completion timestamp., Return an ISO-8601 UTC timestamp., utc_now_iso(), Validation rules for API responses.

### Community 42 - "placeSearch.ts"
Cohesion: 0.14
Nodes (24): AIRPORT_DICTIONARY, AIRPORT_ONLY_DICTIONARY, FULL_PLACE_DICTIONARY, lower(), matchesQuery(), rankResult(), searchAirportsLocal(), byCode (+16 more)

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "write-spa-fallbacks.mjs"
Cohesion: 0.33
Nodes (5): __dirname, dist, indexHtml, indexPath, SPA_ROUTES

### Community 45 - "net/http.Request"
Cohesion: 0.14
Nodes (40): authUserJSON(), bearerTokenFromRequest(), bootstrapAdminUser(), createAuthSession(), envFlagTrue(), handleAuthChangePassword(), handleAuthLogout(), handleAuthMe() (+32 more)

### Community 53 - "loadSearchSession"
Cohesion: 0.22
Nodes (22): loadSearchSession(), TestLoadSearchSession_Expiry(), searchSessionTTL(), startSearchSessionCleanup(), cleanupPersistedSessions(), SearchSessionResultsResponse, importLegacyJSONSessions(), initSessionStore() (+14 more)

### Community 54 - "ValidateBookingURL"
Cohesion: 0.27
Nodes (11): gf2CheckoutOffers(), IsCheckoutBookingURL(), IsNonBookableDomain(), TestIsCheckoutBookingURL_rejectsFlightSearchPages(), TestIsNonBookableDomain_blocksFlightRadar(), TestValidateBookingURL_acceptsHTTPS(), TestValidateBookingURL_rejectsEmpty(), TestValidateBookingURL_rejectsJavascript() (+3 more)

### Community 55 - "ResultsScreen.tsx"
Cohesion: 0.14
Nodes (23): DynamicDestinationsFormContentProps, defaultParams, DynamicDestinationsScreen(), Nav, styles, bestScore(), CheapestOption, defaultFormParams (+15 more)

### Community 56 - "BookingOffer"
Cohesion: 0.23
Nodes (25): bookingMatchPriceNormalizer(), PublicBookingAlternative, isAffiliateTemplateBookingURL(), normalizedGF2OfferPrice(), preferAirlineDirectWhenCheaperThanMarkedUpOTA(), publicAlternativesFromOffers(), buildDualBookingResolveResponse(), collectVerifiedBookingOffers() (+17 more)

### Community 57 - "CanonicalItinerary"
Cohesion: 0.17
Nodes (21): BuildCanonicalItinerary(), canonicalSegmentFromProvider(), FingerprintDebugString(), CanonicalItinerary, isIATACarrierCode(), flightNumbersEquivalent(), ResultMatchesItinerary(), segmentsLooselyMatch() (+13 more)

### Community 58 - "react-native"
Cohesion: 0.11
Nodes (30): AppIcon(), AppIconLibrary, AppIconProps, styles, EditSearchModalProps, s, FormHeroHeader(), FormHeroHeaderProps (+22 more)

### Community 59 - "gf2_booking_quote.go"
Cohesion: 0.14
Nodes (22): findBookingOptionsArray(), firstPartnerBookingOption(), firstPartnerURLInMap(), firstStringByKeys(), hostFromURL(), isPartnerBookingList(), parseGF2BookingOptions(), partnerRequestTokenFromMap() (+14 more)

### Community 60 - "ExploreScreen.tsx"
Cohesion: 0.11
Nodes (22): GetDealsRangeParams, getMonthDeals(), GetMonthDealsParams, ExploreResponse, getExploreDestinations(), GetExploreDestinationsParams, c, countryFlag() (+14 more)

### Community 61 - "gf2_deals.go"
Cohesion: 0.15
Nodes (28): mergeExplorePriceRows(), exploreSessionKey(), getExploreSession(), newExploreSessionID(), putExploreSession(), startExploreSessionCleanup(), exploreDestRow, exploreSession (+20 more)

### Community 62 - "apiGet"
Cohesion: 0.32
Nodes (6): searchAirports(), apiGet(), getFlightDetails(), GetFlightDetailsParams, AirportCitySearchResponse, FlightDetailsResponse

### Community 63 - "IsOpenJaw"
Cohesion: 0.29
Nodes (9): TestIsOpenJaw(), TestResolveReturnAirports_classic(), TestResolveReturnAirports_openJaw(), TestSanitizeStandardSearchRequest(), HasExtraLegs(), IsOpenJaw(), ResolveReturnAirports(), SanitizeStandardSearchRequest() (+1 more)

### Community 64 - "api.ts"
Cohesion: 0.14
Nodes (13): AirportCityResult, AirportCityType, AirportLike, ANYWHERE_CODE, BaggageClass, Carrier, COUNTRY_DEST_PREFIX, ExplorePriceSource (+5 more)

### Community 65 - "MonthDealsScreen"
Cohesion: 0.27
Nodes (9): buildDealsPositioningSignature(), formatDealDate(), MonthDealsScreen(), parseDealYmdToUTCDate(), toYmdUTC(), formatMonthShort(), formatMonthYear(), LOCALE_MAP (+1 more)

### Community 66 - "ThemeContext.tsx"
Cohesion: 0.11
Nodes (20): getPhrasesForLanguage(), SEARCH_BUTTON_PHRASES, SEARCH_PROGRESS_PHRASES, s, SearchProgressBanner(), SearchProgressBannerProps, ExtraLeg, Props (+12 more)

### Community 67 - "GF2SearchAirports"
Cohesion: 0.27
Nodes (10): gf2MetroKey(), GF2SearchAirports(), ResolveGF2PlaceCode(), containsAll(), TestGF2SearchAirports_CityOnlyCode(), TestGF2SearchAirports_LondonParis(), TestGF2SearchAirports_SingleAirport(), TestGF2SearchAirports_SpecificAirportNotExpanded() (+2 more)

### Community 68 - "AirportLocation"
Cohesion: 0.12
Nodes (14): AirportLocation(), TestAirportLocation_UnknownFallsBackUTC(), TestParseGF2TimeWithDateHint_AirportLocal(), TestParseGF2TimeWithDateHint_TelAviv(), TestBuildGF2ResultFromItinerary_FlatFormat(), TestParseGF2Response_RapidAPIFlatTopFlights(), TestParseGF2Time_EuropeanDateFormat(), TestExtractGF2Leg_SingleSegment_DepartArriveDiffer() (+6 more)

### Community 69 - "SearchFormScreen.tsx"
Cohesion: 0.11
Nodes (24): KEYS, s, SortBarProps, SortOption, defaultParams, styles, clampDealsMonth(), dealsActions (+16 more)

### Community 70 - "AirportAutocomplete.tsx"
Cohesion: 0.27
Nodes (19): getAirportDisplayName(), getAirportEntry(), getAirportNameByCode(), getCityDisplayName(), PLACE_SEARCH_LIMIT, getCountryEntry(), AirportAutocomplete(), AirportAutocompleteProps (+11 more)

### Community 71 - "SelectBestOffer"
Cohesion: 0.18
Nodes (15): TestSelectBestOffer_cheapestOTAOverAirline(), TestSelectBestOffer_conflictingCandidatesPicksCheapest(), TestSelectBestOffer_missingPrice(), TestSelectBestOffer_prefersPriceAmongSameURLType(), TestSelectBestOffer_prefersQuoteMatchingPrice(), TestSelectBestOffer_rejectsGenericSearchURL(), TestSelectBestOffer_rejectsUnverified(), TestSelectCheapestVerifiedOffer_picksLowestPrice() (+7 more)

### Community 72 - "Registry"
Cohesion: 0.19
Nodes (8): MultiSearchResult, isSkippedProviderErr(), IsTransientSearchErrMsg(), NewRegistryFromEnv(), parseProviderNames(), GoogleFlights2Provider, Provider, Registry

### Community 73 - "kiwi_apify_provider.go"
Cohesion: 0.28
Nodes (15): asArray(), collectCarriers(), detectSelfTransfer(), extractKiwiLegs(), firstFloat(), firstString(), flattenKiwiItems(), kiwiSegmentFromMap() (+7 more)

### Community 74 - "TestExtractCarrierCodes"
Cohesion: 0.83
Nodes (3): makeOfferWithCarriers(), TestExtractCarrierCodes(), TestPrimaryDisplayCarrier()

### Community 75 - "IsGF2RateLimitError"
Cohesion: 0.67
Nodes (3): resolveAllPartnerBookingsFromTokenWithRetry(), IsGF2RateLimitError(), isTransientGF2SearchErr()

### Community 76 - "flyfix.ts"
Cohesion: 0.25
Nodes (8): apiPost(), FlyfixInsightsGroup, FlyfixIssue, FlyfixRefinedReport, FlyfixSummary, refineIssues(), RefineIssuesRequestBody, cancelSearchSession()

### Community 77 - "react"
Cohesion: 0.07
Nodes (31): App(), linking, RTLWrapper(), DisplayPrice(), DisplayPriceProps, styles, HubRouteLeg, HubRouteSummaryModalProps (+23 more)

### Community 78 - "client.ts"
Cohesion: 0.17
Nodes (14): AffiliateProvider, AffiliateProviderResponse, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink(), OutboundLinkResponse (+6 more)

### Community 79 - "DatePickerCalendar.tsx"
Cohesion: 0.39
Nodes (7): getDealsRange(), DatePickerCalendar(), DatePickerCalendarProps, getNext14Dates(), getRangeStartEnd(), styles, WEEKDAYS

### Community 80 - "DedupeProviderResults"
Cohesion: 0.31
Nodes (7): DedupeProviderResults(), ItineraryFingerprint(), mergeSelfTransfer(), TotalStops(), uniqueStrings(), TestDedupeKeepsCheaper(), TestItineraryFingerprintStable()

### Community 81 - "CalendarModal.tsx"
Cohesion: 0.38
Nodes (6): buildMonthDays(), CalendarModal(), getMonthStart(), Props, styles, WEEKDAYS

### Community 82 - "context.Context"
Cohesion: 0.21
Nodes (7): GoogleFlights2Provider, legSearchRetryable(), truncateGF2(), SearchRequest, context.Context, MultiSearchResult, gf2RateLimiter

### Community 83 - "booking.ts"
Cohesion: 0.36
Nodes (8): BookingResolveRequest, BookingResolveStatus, bookingRetryDelayMs(), fetchBookingResolveOnce(), isTransientBookingFetchError(), isTransientBookingResolveResponse(), PublicBookingAlternative, resolveBookingOffer()

### Community 84 - "TestApplySoftStrictBaggage"
Cohesion: 0.52
Nodes (6): applySoftStrictBaggage(), makeOfferWithBags(), makeOfferWithMissingBags(), TestApplySoftStrictBaggage(), TestClassifyOfferBaggage(), classifyOfferBaggage()

### Community 85 - "DateRangePicker.tsx"
Cohesion: 0.22
Nodes (16): useRuntimeConfig(), buildMonthDays(), DateRangePicker(), DateRangePickerProps, getMonthStart(), monthStartForYmd(), parseYmdUtc(), styles (+8 more)

### Community 86 - "extractGF2BookingURL"
Cohesion: 0.67
Nodes (3): TestExtractGF2BookingURL(), extractGF2BookingURL(), findFirstHTTPSURL()

### Community 87 - "gf2Cache"
Cohesion: 0.29
Nodes (6): newGF2Cache(), newGF2RateLimiter(), NewGoogleFlights2Provider(), sync.RWMutex, gf2Cache, gf2CacheEntry

## Knowledge Gaps
- **292 isolated node(s):** `ClicksByProvider`, `BookingResolveRequest`, `PublicBookingAlternative`, `exploreLiveCandidate`, `flightcaptainweb` (+287 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 400 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `RootNavigator.tsx`, `ThemeContext.tsx`, `ResultsScreen`, `FlightDetailsModal.tsx`, `AuthContext.tsx`, `dependencies`, `useTheme`, `AirportAutocomplete.tsx`, `SearchFormScreen.tsx`, `ui/index.ts`, `DatePickerCalendar.tsx`, `MonthDealsScreen.tsx`, `CalendarModal.tsx`, `DateRangePicker.tsx`, `ResultsScreen.tsx`, `react-native`, `ExploreScreen.tsx`, `RuntimeConfigContext.tsx`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `ProviderResult` connect `ProviderResult` to `googleflights2_provider.go`, `testing.T`, `kiwi_apify_provider.go`, `.ResolveQuotedPartnerBooking`, `KiwiApifyProvider`, `DedupeProviderResults`, `context.Context`, `server.go`, `gf2Cache`, `CanonicalItinerary`, `gf2_deals.go`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `CanonicalItinerary` connect `CanonicalItinerary` to `CanonicalSegment`, `ProviderResult`, `.ResolveQuotedPartnerBooking`, `booking_resolve.go`, `server.go`, `runBookingMatch`, `context.Context`, `matcher_test.go`, `BookingOffer`, `booking_gf2_resolve.go`, `.Match`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **What connects `ClicksByProvider`, `BookingResolveRequest`, `PublicBookingAlternative` to the rest of the system?**
  _292 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `RootNavigator.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09206349206349207 - nodes in this community are weakly interconnected._
- **Should `ResultsScreen` be split into smaller, more focused modules?**
  _Cohesion score 0.1477832512315271 - nodes in this community are weakly interconnected._
- **Should `Issue` be split into smaller, more focused modules?**
  _Cohesion score 0.1036036036036036 - nodes in this community are weakly interconnected._