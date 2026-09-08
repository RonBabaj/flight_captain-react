# Graph Report - workspace  (2026-09-08)

## Corpus Check
- 219 files · ~211,196 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1855 nodes · 5329 edges · 89 communities (81 shown, 5 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 455 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1d8b9a8b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- googleflights2_provider.go
- TopNavMenu.tsx
- SearchFormScreen.tsx
- Issue
- FlightResultCard.tsx
- MonthDealsScreen
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
- time.Time
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
- ErrorBoundary
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
- FlightDetailsModal.tsx
- ExploreScreen.tsx
- gf2_deals.go
- api/index.ts
- SearchRequest
- api.ts
- MonthDealsScreen.tsx
- ThemeContext.tsx
- ResolveGF2PlaceCode
- AirportLocation
- store/index.ts
- client.ts
- searchRouteUrl.ts
- Registry
- FiltersPanel.tsx
- extract.go
- DraggableBottomSheet.tsx
- flyfix.ts
- exchangeRates.ts
- affiliate.ts
- DatePickerCalendar.tsx
- DedupeProviderResults
- react
- context.Context
- booking.ts
- TestApplySoftStrictBaggage
- DateRangePicker.tsx
- bookableDates.ts
- gf2Cache
- airlines.ts

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 88 edges
2. `useLocale()` - 79 edges
3. `react` - 62 edges
4. `react-native` - 54 edges
5. `ProviderResult` - 47 edges
6. `BookingOffer` - 40 edges
7. `MonthDealsScreen()` - 36 edges
8. `ResultsScreen()` - 35 edges
9. `resolveGF2PartnerOffers()` - 33 edges
10. `runBookingMatch()` - 32 edges

## Surprising Connections (you probably didn't know these)
- `scoreSegment()` --calls--> `textContainsAirport()`  [INFERRED]
  backend/bookingmatch/verify.go → backend/bookingmatch/extract.go
- `main()` --calls--> `startExploreSessionCleanup()`  [INFERRED]
  backend/server.go → backend/explore_session.go
- `handleAffiliateOutboundLink()` --calls--> `ResolveProvider()`  [INFERRED]
  backend/server.go → backend/affiliate.go
- `handleAffiliateProvider()` --calls--> `ResolveProvider()`  [INFERRED]
  backend/server.go → backend/affiliate.go
- `handleAffiliateRedirect()` --calls--> `ResolveProvider()`  [INFERRED]
  backend/server.go → backend/affiliate.go

## Import Cycles
- None detected.

## Communities (89 total, 5 thin omitted)

### Community 0 - "googleflights2_provider.go"
Cohesion: 0.17
Nodes (30): TestExtractGF2BookingURL(), TestExtractGF2PartnerBookingTokenPrefersPartnerURL(), buildGF2ResultFromItinerary(), extractGF2BookingToken(), extractGF2BookingURL(), extractGF2DurationMinutes(), extractGF2Flight(), extractGF2Itineraries() (+22 more)

### Community 1 - "TopNavMenu.tsx"
Cohesion: 0.10
Nodes (27): LandingScreen(), Nav, styles, useIsMobile(), DynamicDestinationsStack(), MonthDealsStack(), Stack, RootNavigator() (+19 more)

### Community 2 - "SearchFormScreen.tsx"
Cohesion: 0.21
Nodes (18): defaultParams, SearchFormScreen(), styles, getParam(), getParams(), isWeb(), parseSearchParamsFromUrl(), updateSearchUrl() (+10 more)

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "FlightResultCard.tsx"
Cohesion: 0.16
Nodes (23): getAirlineName(), FlightDetailsModalProps, buildRoutePath(), c, FlightResultCard(), FlightResultCardProps, fmtShortDate(), LegScheduleBlock() (+15 more)

### Community 5 - "MonthDealsScreen"
Cohesion: 0.21
Nodes (17): buildDealsPositioningSignature(), MonthDealsScreen(), parseDealYmdToUTCDate(), toYmdUTC(), clearPendingDealsParams(), DealsParams, dealsParamsFingerprint(), getCachedDealsResults() (+9 more)

### Community 6 - "dependencies"
Cohesion: 0.05
Nodes (37): dependencies, expo, @expo/metro-runtime, expo-status-bar, react, react-dom, react-native, react-native-safe-area-context (+29 more)

### Community 7 - "useTheme"
Cohesion: 0.13
Nodes (30): useAuth(), useLocale(), useRuntimeConfig(), useRuntimeConfigActions(), AdminRuntimeConfigPanel(), ConfigFieldRow(), SECTION_LABEL_KEYS, SECTION_ORDER (+22 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (33): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+25 more)

### Community 9 - "auth.go"
Cohesion: 0.19
Nodes (23): authUserJSON(), bootstrapAdminUser(), createAuthSession(), envFlagTrue(), handleAuthLogin(), handleAuthRegister(), handleAuthUsers(), initAuthStore() (+15 more)

### Community 10 - "gf2_booking_quote.go"
Cohesion: 0.21
Nodes (17): findBookingOptionsArray(), firstPartnerBookingOption(), firstPartnerURLInMap(), firstStringByKeys(), GoogleFlights2Provider, QuoteBinding, ResolvedPartnerBooking, isPartnerBookingList() (+9 more)

### Community 11 - "booking_resolve.go"
Cohesion: 0.14
Nodes (30): acquireBookingResolveSlot(), beginInflightResolve(), bookingResolveCacheKey(), bookingResolveFailureResponse(), bookingResolveMaxConcurrentFromEnv(), cacheTTLForStatus(), canonicalItineraryForOption(), envDurationMinutes() (+22 more)

### Community 12 - "ui/index.ts"
Cohesion: 0.17
Nodes (25): isSafeBookingUrl(), PublicBookingOffer, bookingOfferProviderLabel(), bookingOfferSubtitle(), formatBookingOfferPriceAmount(), formatBookingOfferPriceLine(), formatProviderDisplayName(), BookingOptionBadge (+17 more)

### Community 13 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 14 - "kiwi_apify_provider.go"
Cohesion: 0.13
Nodes (22): apifyErrorMessage(), asArray(), collectCarriers(), detectSelfTransfer(), extractKiwiLegs(), firstFloat(), firstString(), flattenKiwiItems() (+14 more)

### Community 15 - "canonical.go"
Cohesion: 0.13
Nodes (38): FlightOption, openJawOption(), TestBookingLinkModeDefaultsToGoogle(), TestBookingRouteFromSessionOption_splitOmitsReturn(), TestBuildGoogleFlightsFallbackFromParams(), TestBuildLegOrSegmentBookingURL_segment(), TestBuildOneWayLegBookingURL(), TestBuildSkyscannerPrefillURL_oneWay() (+30 more)

### Community 16 - "LocaleContext.tsx"
Cohesion: 0.13
Nodes (23): App(), linking, RTLWrapper(), getStorage(), languageToLocale(), loadSaved(), LocaleContext, LocaleContextValue (+15 more)

### Community 17 - "time.Time"
Cohesion: 0.16
Nodes (20): BuildLegAirlineDirectURL(), BuildRedirectURL(), getAffiliateID(), GetClicksSummary(), getOTAProvider(), GetSessionAndOption(), FlightOption, SearchSession (+12 more)

### Community 18 - "server.go"
Cohesion: 0.06
Nodes (64): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, CanonicalFingerprint(), Carrier, CarrierCodes, CreateSearchSessionRequest (+56 more)

### Community 19 - "runBookingMatch"
Cohesion: 0.18
Nodes (20): intPtrOrNil(), legRouteLabel(), TestCanonicalItineraryForOption_isolatesSplitLegs(), runBookingMatch(), TestHandleBookingResolve_invalidItinerary(), TestHandleBookingResolve_prefillFallback(), TestHandleBookingResolve_searchUnavailable(), TestHandleBookingResolve_verified() (+12 more)

### Community 20 - "qa_runner.py"
Cohesion: 0.14
Nodes (13): Namespace, Path, Any, Reporting helpers for test execution results., Render terminal summary and persist machine-readable reports., Print user-friendly report to stdout., Write a JSON report and return its path., ReportWriter (+5 more)

### Community 21 - "ApiClient"
Cohesion: 0.14
Nodes (12): ApiClient, Any, HTTP client utilities for executing API test cases., Parse JSON response when possible without raising., Sleep using exponential backoff., Executes HTTP requests with retry and timing support., Close the underlying requests session., Execute one test case and return a populated result. (+4 more)

### Community 22 - "matcher_test.go"
Cohesion: 0.17
Nodes (29): classifyURLType(), cfgTest(), floatPtr(), TestClassifyURLType_genericVsExact(), testConnectingTLVJFK(), TestGenerateQueries_connecting(), TestGenerateQueries_direct(), TestGenerateQueries_includesRouteDateBookQuery() (+21 more)

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
Cohesion: 0.10
Nodes (45): airlineDomainForCarrier(), allocateLegQuoteAmount(), applySearchQuoteToOffer(), attachQuotedPriceMeta(), dedupeGF2PartnerOffers(), flightLegDurationMinutes(), gf2OffersHavePrice(), gf2PartnerOfferFromQuoteURL() (+37 more)

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.32
Nodes (13): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+5 more)

### Community 29 - "RuntimeConfigContext.tsx"
Cohesion: 0.23
Nodes (10): fetchRuntimeConfig(), setRuntimeConfigStore(), RuntimeConfigContext, RuntimeConfigContextValue, RuntimeConfigProvider(), DEFAULT_RUNTIME_CONFIG, RUNTIME_CONFIG_FIELDS, RuntimeConfig (+2 more)

### Community 30 - ".Match"
Cohesion: 0.11
Nodes (28): defaultBookingMatchRunner(), corpusText(), domainFromURL(), elapsedMs(), logMatchEvent(), countVerifiedPricedOffers(), MatchItinerary(), NewResolver() (+20 more)

### Community 31 - "backend_api_contracts.md"
Cohesion: 0.17
Nodes (11): 1.1 Create Search Session, 1.2 Get Search Session Status & Results, 1.3 Cancel Search Session (Optional, MVP+), 1. Flight Search Sessions, 2.1 Get Monthly Deals, 2. Monthly Deals API, 3.1 Search Airports & Cities, 3. Airport & City Autocomplete (+3 more)

### Community 32 - "CanonicalSegment"
Cohesion: 0.21
Nodes (23): textContainsAny(), timeMatches(), TestGenerateQueries_gf2AirlineNameIdentity(), connectingFlightQueries(), directFlightQueries(), GenerateQueries(), legRouteQueries(), minutesOfDay() (+15 more)

### Community 33 - "testing.T"
Cohesion: 0.07
Nodes (54): TestSelectCheapestVerifiedOffer_picksLowestPrice(), hostFromURL(), PricesMatchQuote(), selectBookingOptionForQuote(), TestExtractGF2BookingToken(), TestFirstNonEmpty(), TestIsLikelyPartnerCheckoutURL(), TestParseGF2BookingOptions() (+46 more)

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
Cohesion: 0.15
Nodes (24): authHeaders(), AuthUser, changePassword(), createUser(), deleteUser(), fetchAuthMe(), fetchUsers(), LoginResponse (+16 more)

### Community 38 - "ProviderResult"
Cohesion: 0.12
Nodes (28): TestCombineOneWayBatches(), TestCombineOneWayBatches_emptyBatch(), TestCombineOneWayBatches_openJawReturnDiversity(), TestCompleteExtraLegs(), TestExtraLegsFingerprint(), TestHasExtraLegs(), AttachCanonicalIdentityAll(), TestKiwiApifyTimeout() (+20 more)

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
Cohesion: 0.15
Nodes (25): AIRPORT_DICTIONARY, AIRPORT_ONLY_DICTIONARY, FULL_PLACE_DICTIONARY, getAirportDisplayName(), getAirportNameByCode(), lower(), matchesQuery(), PLACE_SEARCH_LIMIT (+17 more)

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "write-spa-fallbacks.mjs"
Cohesion: 0.33
Nodes (5): __dirname, dist, indexHtml, indexPath, SPA_ROUTES

### Community 45 - "net/http.Request"
Cohesion: 0.22
Nodes (26): RecordClick(), bearerTokenFromRequest(), handleAuthChangePassword(), handleAuthLogout(), handleAuthMe(), isAdminRequest(), requireAdminUser(), userFromRequest() (+18 more)

### Community 53 - "loadSearchSession"
Cohesion: 0.18
Nodes (25): corsMiddleware(), loadSearchSession(), main(), TestLoadSearchSession_Expiry(), searchSessionTTL(), startSearchSessionCleanup(), cleanupPersistedSessions(), SearchSessionResultsResponse (+17 more)

### Community 54 - "ValidateBookingURL"
Cohesion: 0.27
Nodes (11): gf2CheckoutOffers(), IsCheckoutBookingURL(), IsNonBookableDomain(), TestIsCheckoutBookingURL_rejectsFlightSearchPages(), TestIsNonBookableDomain_blocksFlightRadar(), TestValidateBookingURL_acceptsHTTPS(), TestValidateBookingURL_rejectsEmpty(), TestValidateBookingURL_rejectsJavascript() (+3 more)

### Community 55 - "ResultsScreen.tsx"
Cohesion: 0.12
Nodes (29): DynamicDestinationsFormContent(), DynamicDestinationsFormContentProps, defaultParams, DynamicDestinationsScreen(), Nav, styles, bestScore(), CheapestOption (+21 more)

### Community 56 - "BookingOffer"
Cohesion: 0.12
Nodes (41): bookingMatchPriceNormalizer(), PublicBookingAlternative, isAffiliateTemplateBookingURL(), normalizedGF2OfferPrice(), preferAirlineDirectWhenCheaperThanMarkedUpOTA(), publicAlternativesFromOffers(), bookingOfferInGF2Sources(), bookingOfferSameURL() (+33 more)

### Community 57 - "CanonicalItinerary"
Cohesion: 0.16
Nodes (21): TotalStops(), BuildCanonicalItinerary(), canonicalSegmentFromProvider(), FingerprintDebugString(), CanonicalItinerary, isIATACarrierCode(), flightNumbersEquivalent(), ResultMatchesItinerary() (+13 more)

### Community 58 - "react-native"
Cohesion: 0.19
Nodes (18): FormHeroHeader(), FormHeroHeaderProps, styles, formCardStyles, makeFormThemedStyles(), SearchSubmitButton(), SearchSubmitButtonProps, styles (+10 more)

### Community 59 - "FlightDetailsModal.tsx"
Cohesion: 0.18
Nodes (19): airportTimeZones, getAirportTimeZone(), cabinLabel(), FlightDetailsModal(), formatDuration(), layoverBetween(), legDuration(), s (+11 more)

### Community 60 - "ExploreScreen.tsx"
Cohesion: 0.18
Nodes (25): getAirportEntry(), getCityDisplayName(), AirportAutocomplete(), c, countryFlag(), d, DestCard(), destinationLabelForCode() (+17 more)

### Community 61 - "gf2_deals.go"
Cohesion: 0.07
Nodes (47): airportCoord, exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut(), getAirportCoord() (+39 more)

### Community 62 - "api/index.ts"
Cohesion: 0.22
Nodes (9): searchAirports(), apiGet(), GetDealsRangeParams, getMonthDeals(), GetMonthDealsParams, getFlightDetails(), GetFlightDetailsParams, AirportCitySearchResponse (+1 more)

### Community 63 - "SearchRequest"
Cohesion: 0.23
Nodes (11): TestIsOpenJaw(), TestResolveReturnAirports_classic(), TestResolveReturnAirports_openJaw(), TestSanitizeStandardSearchRequest(), SearchRequest, HasExtraLegs(), IsOpenJaw(), ResolveReturnAirports() (+3 more)

### Community 64 - "api.ts"
Cohesion: 0.12
Nodes (16): ExploreResponse, getExploreDestinations(), GetExploreDestinationsParams, DestCardProps, AirportCityType, AirportLike, BaggageClass, Carrier (+8 more)

### Community 65 - "MonthDealsScreen.tsx"
Cohesion: 0.09
Nodes (27): HubRouteLeg, HubRouteSummaryModal(), HubRouteSummaryModalProps, s, s, SearchSummaryBar(), SearchSummaryBarProps, CheaperCitiesOption (+19 more)

### Community 66 - "ThemeContext.tsx"
Cohesion: 0.11
Nodes (20): getPhrasesForLanguage(), SEARCH_BUTTON_PHRASES, SEARCH_PROGRESS_PHRASES, s, SearchProgressBanner(), SearchProgressBannerProps, ExtraLeg, Props (+12 more)

### Community 67 - "ResolveGF2PlaceCode"
Cohesion: 0.29
Nodes (9): gf2MetroKey(), ResolveGF2PlaceCode(), containsAll(), TestResolveGF2PlaceCode_CityOnlyCode(), TestResolveGF2PlaceCode_Istanbul(), TestResolveGF2PlaceCode_LondonParis(), TestResolveGF2PlaceCode_SingleAirport(), TestResolveGF2PlaceCode_TokyoAirportExpandsMetro() (+1 more)

### Community 68 - "AirportLocation"
Cohesion: 0.16
Nodes (11): AirportLocation(), TestAirportLocation_UnknownFallsBackUTC(), TestParseGF2TimeWithDateHint_AirportLocal(), TestParseGF2TimeWithDateHint_TelAviv(), TestExtractGF2Leg_SingleSegment_DepartArriveDiffer(), TestExtractGF2Leg_TimeOnly_NoDateHint(), TestExtractGF2Leg_TimeOnly_WithDateHint(), TestParseGF2Time_AcceptsFullDateTime() (+3 more)

### Community 69 - "store/index.ts"
Cohesion: 0.13
Nodes (21): FiltersPanelProps, SortBarProps, clampDealsMonth(), dealsActions, DealsSortField, DealsState, getMinimumAllowedDealsYearMonth(), now (+13 more)

### Community 70 - "client.ts"
Cohesion: 0.31
Nodes (9): API_BASE, apiRequest(), apiUrl(), isLocalHostname(), IMPORTANT: Expo/Metro statically inlines EXPO_PUBLIC_* only when accessed via, resolveApiBase(), adminAuthHeaders(), fetchAdminRuntimeConfig() (+1 more)

### Community 71 - "searchRouteUrl.ts"
Cohesion: 0.33
Nodes (8): buildSearchString(), SearchUrlState, openUrlInNewTab(), openUrlInNewTabOrAlert(), openUrlSameTab(), buildFlyFixSearchResultsUrl(), FlyFixLegSearchParams, openFlyFixLegSearchInNewTab()

### Community 72 - "Registry"
Cohesion: 0.19
Nodes (8): MultiSearchResult, isSkippedProviderErr(), IsTransientSearchErrMsg(), NewRegistryFromEnv(), parseProviderNames(), GoogleFlights2Provider, Provider, Registry

### Community 73 - "FiltersPanel.tsx"
Cohesion: 0.15
Nodes (13): f, FiltersPanel(), KEYS, s, SortBar(), SortOption, Chip(), styles (+5 more)

### Community 74 - "extract.go"
Cohesion: 0.31
Nodes (9): extractFlightNumbers(), extractPrice(), flightNumberInText(), flightNumbersEquivalent(), splitFlightDesignator(), textContainsAirport(), TestExtractPrice_euroPrefixNotArrivalTime(), TestFlightNumbersEquivalent_leadingZeros() (+1 more)

### Community 76 - "flyfix.ts"
Cohesion: 0.25
Nodes (8): apiPost(), FlyfixInsightsGroup, FlyfixIssue, FlyfixRefinedReport, FlyfixSummary, refineIssues(), RefineIssuesRequestBody, cancelSearchSession()

### Community 77 - "exchangeRates.ts"
Cohesion: 0.24
Nodes (10): DisplayPrice(), DisplayPriceProps, convertPrice(), CURRENCY_SYMBOLS, CurrencyCode, ensureRates(), fetchRates(), getCurrencySymbol() (+2 more)

### Community 78 - "affiliate.ts"
Cohesion: 0.27
Nodes (9): AffiliateProvider, AffiliateProviderResponse, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink(), OutboundLinkResponse (+1 more)

### Community 79 - "DatePickerCalendar.tsx"
Cohesion: 0.33
Nodes (8): getDealsRange(), DatePickerCalendar(), DatePickerCalendarProps, getNext14Dates(), getRangeStartEnd(), styles, WEEKDAYS, DayDeal

### Community 80 - "DedupeProviderResults"
Cohesion: 0.31
Nodes (6): DedupeProviderResults(), ItineraryFingerprint(), mergeSelfTransfer(), uniqueStrings(), TestItineraryFingerprintStable(), MultiSearchResult

### Community 81 - "react"
Cohesion: 0.08
Nodes (32): AppIcon(), AppIconLibrary, AppIconProps, styles, ClearableTextInput(), ClearableTextInputProps, styles, EditSearchModal() (+24 more)

### Community 82 - "context.Context"
Cohesion: 0.21
Nodes (7): GoogleFlights2Provider, newGF2RateLimiter(), NewGoogleFlights2Provider(), truncateGF2(), context.Context, sync.Mutex, gf2RateLimiter

### Community 83 - "booking.ts"
Cohesion: 0.31
Nodes (9): BookingResolveRequest, BookingResolveResponse, BookingResolveStatus, bookingRetryDelayMs(), fetchBookingResolveOnce(), isTransientBookingFetchError(), isTransientBookingResolveResponse(), PublicBookingAlternative (+1 more)

### Community 84 - "TestApplySoftStrictBaggage"
Cohesion: 0.52
Nodes (6): applySoftStrictBaggage(), makeOfferWithBags(), makeOfferWithMissingBags(), TestApplySoftStrictBaggage(), TestClassifyOfferBaggage(), classifyOfferBaggage()

### Community 85 - "DateRangePicker.tsx"
Cohesion: 0.36
Nodes (8): buildMonthDays(), DateRangePicker(), DateRangePickerProps, getMonthStart(), monthStartForYmd(), parseYmdUtc(), styles, WEEKDAYS

### Community 86 - "bookableDates.ts"
Cohesion: 0.54
Nodes (7): initialDatesFromRouteParams(), addDaysYmdUtc(), clampExploreDealsDates(), clampExploreSearchDates(), firstBookableDepartureInMonth(), pad2(), tomorrowYmdUtc()

### Community 87 - "gf2Cache"
Cohesion: 0.33
Nodes (5): newGF2Cache(), TestSearchLegCached_usesCache(), sync.RWMutex, gf2Cache, gf2CacheEntry

### Community 88 - "airlines.ts"
Cohesion: 0.50
Nodes (3): AIRLINE_NAMES, AIRLINE_FULL_NAMES, NOTE: This is a starter subset of IATA airlines.

## Knowledge Gaps
- **292 isolated node(s):** `ClicksByProvider`, `BookingResolveRequest`, `PublicBookingAlternative`, `exploreLiveCandidate`, `flightcaptainweb` (+287 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 400 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `TopNavMenu.tsx`, `SearchFormScreen.tsx`, `FlightResultCard.tsx`, `dependencies`, `useTheme`, `ui/index.ts`, `LocaleContext.tsx`, `RuntimeConfigContext.tsx`, `ErrorBoundary`, `AuthContext.tsx`, `ResultsScreen.tsx`, `react-native`, `FlightDetailsModal.tsx`, `ExploreScreen.tsx`, `MonthDealsScreen.tsx`, `ThemeContext.tsx`, `FiltersPanel.tsx`, `DraggableBottomSheet.tsx`, `exchangeRates.ts`, `DatePickerCalendar.tsx`, `DateRangePicker.tsx`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `CanonicalItinerary` connect `CanonicalItinerary` to `CanonicalSegment`, `ProviderResult`, `gf2_booking_quote.go`, `booking_resolve.go`, `server.go`, `runBookingMatch`, `matcher_test.go`, `BookingOffer`, `booking_gf2_resolve.go`, `.Match`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `ProviderResult` connect `ProviderResult` to `googleflights2_provider.go`, `testing.T`, `kiwi_apify_provider.go`, `DedupeProviderResults`, `time.Time`, `server.go`, `context.Context`, `gf2Cache`, `CanonicalItinerary`, `gf2_deals.go`, `SearchRequest`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **What connects `ClicksByProvider`, `BookingResolveRequest`, `PublicBookingAlternative` to the rest of the system?**
  _292 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TopNavMenu.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1006006006006006 - nodes in this community are weakly interconnected._
- **Should `Issue` be split into smaller, more focused modules?**
  _Cohesion score 0.1036036036036036 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05263157894736842 - nodes in this community are weakly interconnected._