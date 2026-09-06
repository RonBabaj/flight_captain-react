# Graph Report - workspace  (2026-09-06)

## Corpus Check
- 217 files · ~210,512 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1848 nodes · 5168 edges · 86 communities (78 shown, 4 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 448 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `754cfd23`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- googleflights2_provider.go
- RootNavigator.tsx
- SearchFormScreen.tsx
- Issue
- FlightDetailsModal.tsx
- MonthDealsScreen
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
- itinerary_test.go
- qa_runner.py
- ApiClient
- matcher_test.go
- TestResult
- ResponseValidator
- runtime_config.go
- booking_gf2_resolve.go
- expo
- config_loader.py
- AdminRuntimeConfigPanel.tsx
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
- AirportAutocomplete.tsx
- Fly-Fix – Frontend
- write-spa-fallbacks.mjs
- net/http.Request
- metro.config.js
- __init__.py
- flightcaptainweb
- loadSearchSession
- ValidateBookingURL
- ResultsScreen
- BookingOffer
- itinerary.go
- types/index.ts
- ResultsScreen.tsx
- ExploreScreen.tsx
- time.Time
- client.ts
- data/airports.ts
- api.ts
- MonthDealsScreen.tsx
- ThemeContext.tsx
- TopNavMenu.tsx
- AirportLocation
- store/index.ts
- App.tsx
- CreateSearchSessionRequest
- Registry
- itineraryStops.ts
- segmentMatchesCabinClass
- DraggableBottomSheet.tsx
- flyfix.ts
- exchangeRates.ts
- booking.ts
- DatePickerCalendar.tsx
- DedupeProviderResults
- CalendarModal.tsx
- GoogleFlights2Provider
- formatMonthYear
- TestApplySoftStrictBaggage
- TestExtractCarrierCodes

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 88 edges
2. `useLocale()` - 79 edges
3. `ProviderResult` - 47 edges
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

## Communities (86 total, 4 thin omitted)

### Community 0 - "googleflights2_provider.go"
Cohesion: 0.19
Nodes (28): TestExtractGF2PartnerBookingTokenPrefersPartnerURL(), buildGF2ResultFromItinerary(), extractGF2BookingToken(), extractGF2DurationMinutes(), extractGF2Flight(), extractGF2Itineraries(), extractGF2ItinerariesFromMap(), extractGF2Leg() (+20 more)

### Community 1 - "RootNavigator.tsx"
Cohesion: 0.16
Nodes (15): DynamicDestinationsStack(), Stack, MonthDealsStack(), Stack, RootNavigator(), Stack, SearchStack(), Stack (+7 more)

### Community 2 - "SearchFormScreen.tsx"
Cohesion: 0.26
Nodes (14): defaultParams, SearchFormScreen(), styles, getParam(), getParams(), isWeb(), parseSearchParamsFromUrl(), updateSearchUrl() (+6 more)

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "FlightDetailsModal.tsx"
Cohesion: 0.11
Nodes (39): AIRLINE_NAMES, getAirlineName(), AIRLINE_FULL_NAMES, NOTE: This is a starter subset of IATA airlines., getAirportNameByCode(), f, FiltersPanel(), cabinLabel() (+31 more)

### Community 5 - "MonthDealsScreen"
Cohesion: 0.23
Nodes (17): buildDealsPositioningSignature(), MonthDealsScreen(), parseDealYmdToUTCDate(), toYmdUTC(), clearPendingDealsParams(), DealsParams, dealsParamsFingerprint(), getCachedDealsResults() (+9 more)

### Community 6 - "dependencies"
Cohesion: 0.04
Nodes (44): @babel/core, expo, @expo/metro-runtime, expo-status-bar, dependencies, expo, @expo/metro-runtime, expo-status-bar (+36 more)

### Community 7 - "useTheme"
Cohesion: 0.10
Nodes (36): ClearableTextInput(), ClearableTextInputProps, styles, EditSearchModal(), EditSearchModalProps, s, s, SearchSummaryBar() (+28 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (33): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+25 more)

### Community 9 - "auth.go"
Cohesion: 0.19
Nodes (23): authUserJSON(), bootstrapAdminUser(), createAuthSession(), envFlagTrue(), handleAuthLogin(), handleAuthRegister(), handleAuthUsers(), initAuthStore() (+15 more)

### Community 10 - "context.Context"
Cohesion: 0.12
Nodes (33): findBookingOptionsArray(), firstPartnerBookingOption(), firstPartnerURLInMap(), firstStringByKeys(), GoogleFlights2Provider, ResolvedPartnerBooking, hostFromURL(), isPartnerBookingList() (+25 more)

### Community 11 - "booking_resolve.go"
Cohesion: 0.12
Nodes (36): acquireBookingResolveSlot(), beginInflightResolve(), bookingOfferInGF2Sources(), bookingOfferSameURL(), bookingResolveCacheKey(), bookingResolveFailureResponse(), bookingResolveMaxConcurrentFromEnv(), cacheTTLForStatus() (+28 more)

### Community 12 - "ui/index.ts"
Cohesion: 0.12
Nodes (33): BookingResolveResponse, isSafeBookingUrl(), PublicBookingOffer, bookingOfferProviderLabel(), bookingOfferSubtitle(), formatBookingOfferPriceAmount(), formatBookingOfferPriceLine(), formatProviderDisplayName() (+25 more)

### Community 13 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+15 more)

### Community 14 - "kiwi_apify_provider.go"
Cohesion: 0.16
Nodes (20): apifyErrorMessage(), asArray(), collectCarriers(), detectSelfTransfer(), extractKiwiLegs(), firstFloat(), firstString(), flattenKiwiItems() (+12 more)

### Community 15 - "canonical.go"
Cohesion: 0.14
Nodes (35): FlightOption, openJawOption(), TestBookingLinkModeDefaultsToGoogle(), TestBookingRouteFromSessionOption_splitOmitsReturn(), TestBuildGoogleFlightsFallbackFromParams(), TestBuildLegOrSegmentBookingURL_segment(), TestBuildOneWayLegBookingURL(), TestBuildSkyscannerPrefillURL_oneWay() (+27 more)

### Community 16 - "LocaleContext.tsx"
Cohesion: 0.15
Nodes (18): getStorage(), languageToLocale(), loadSaved(), LocaleContext, LocaleContextValue, LocaleProvider(), save(), VALID_CURRENCIES (+10 more)

### Community 17 - "affiliate.go"
Cohesion: 0.15
Nodes (21): BuildLegAirlineDirectURL(), BuildRedirectURL(), getAffiliateID(), GetClicksSummary(), getOTAProvider(), GetSessionAndOption(), FlightOption, SearchSession (+13 more)

### Community 18 - "server.go"
Cohesion: 0.06
Nodes (65): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, CanonicalFingerprint(), normalizeProviderBookingURL(), Carrier, CarrierCodes (+57 more)

### Community 19 - "itinerary_test.go"
Cohesion: 0.25
Nodes (13): AttachCanonicalIdentity(), segTLVJFK(), TestCanonicalItineraryFingerprint_connectingFlight(), TestCanonicalItineraryFingerprint_differentFlightsDoNotCollide(), TestCanonicalItineraryFingerprint_directFlight(), TestCanonicalItineraryFingerprint_excludesPrice(), TestCanonicalItineraryFingerprint_formattingStable(), TestCanonicalItineraryFingerprint_gf2AirlineNameStable() (+5 more)

### Community 20 - "qa_runner.py"
Cohesion: 0.14
Nodes (13): Namespace, Path, Any, Reporting helpers for test execution results., Render terminal summary and persist machine-readable reports., Print user-friendly report to stdout., Write a JSON report and return its path., ReportWriter (+5 more)

### Community 21 - "ApiClient"
Cohesion: 0.14
Nodes (12): ApiClient, Any, HTTP client utilities for executing API test cases., Parse JSON response when possible without raising., Sleep using exponential backoff., Executes HTTP requests with retry and timing support., Close the underlying requests session., Execute one test case and return a populated result. (+4 more)

### Community 22 - "matcher_test.go"
Cohesion: 0.13
Nodes (36): cfgTest(), floatPtr(), testConnectingTLVJFK(), TestGenerateQueries_connecting(), TestGenerateQueries_direct(), TestGenerateQueries_gf2AirlineNameIdentity(), TestGenerateQueries_includesRouteDateBookQuery(), TestGenerateQueries_prioritizesEndToEndLegRoute() (+28 more)

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
Cohesion: 0.15
Nodes (34): airlineDomainForCarrier(), allocateLegQuoteAmount(), applySearchQuoteToOffer(), attachQuotedPriceMeta(), dedupeGF2PartnerOffers(), flightLegDurationMinutes(), gf2OffersHavePrice(), gf2PartnerOfferFromQuoteURL() (+26 more)

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.32
Nodes (13): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+5 more)

### Community 29 - "AdminRuntimeConfigPanel.tsx"
Cohesion: 0.16
Nodes (21): apiRequest(), apiUrl(), adminAuthHeaders(), fetchAdminRuntimeConfig(), fetchRuntimeConfig(), saveAdminRuntimeConfig(), setRuntimeConfigStore(), RuntimeConfigContext (+13 more)

### Community 30 - ".Match"
Cohesion: 0.11
Nodes (28): defaultBookingMatchRunner(), corpusText(), domainFromURL(), elapsedMs(), logMatchEvent(), countVerifiedPricedOffers(), MatchItinerary(), NewResolver() (+20 more)

### Community 31 - "backend_api_contracts.md"
Cohesion: 0.17
Nodes (11): 1.1 Create Search Session, 1.2 Get Search Session Status & Results, 1.3 Cancel Search Session (Optional, MVP+), 1. Flight Search Sessions, 2.1 Get Monthly Deals, 2. Monthly Deals API, 3.1 Search Airports & Cities, 3. Airport & City Autocomplete (+3 more)

### Community 32 - "CanonicalSegment"
Cohesion: 0.15
Nodes (31): classifyURLType(), extractFlightNumbers(), extractPrice(), flightNumberInText(), flightNumbersEquivalent(), splitFlightDesignator(), textContainsAirport(), textContainsAny() (+23 more)

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
Cohesion: 0.15
Nodes (23): authHeaders(), AuthUser, changePassword(), createUser(), deleteUser(), fetchAuthMe(), fetchUsers(), LoginResponse (+15 more)

### Community 38 - "ProviderResult"
Cohesion: 0.09
Nodes (34): TestCombineOneWayBatches(), TestCombineOneWayBatches_emptyBatch(), TestCombineOneWayBatches_openJawReturnDiversity(), TestCompleteExtraLegs(), TestExtraLegsFingerprint(), TestHasExtraLegs(), newGF2Cache(), TestAttachCanonicalIdentityAll_combineOneWay() (+26 more)

### Community 39 - "search.ts"
Cohesion: 0.22
Nodes (17): CachedResult, createSearchSession(), createSearchSessionWithRetry(), fetchFresh(), getFromStorage(), getSearchSessionResults(), getStorage(), isTransientSearchError() (+9 more)

### Community 40 - "skyscanner.ts"
Cohesion: 0.42
Nodes (10): BookingHop, bookingHopsFromOption(), firstSeg(), isClassicRoundTripLegs(), isoDatePrefix(), isSplitBookingItinerary(), lastSeg(), legNeedsSegmentSplit() (+2 more)

### Community 41 - "models.py"
Cohesion: 0.25
Nodes (5): Core data models for the API QA runner., Set completion timestamp., Return an ISO-8601 UTC timestamp., utc_now_iso(), Validation rules for API responses.

### Community 42 - "AirportAutocomplete.tsx"
Cohesion: 0.23
Nodes (24): getAirportDisplayName(), PLACE_SEARCH_LIMIT, getCountryDisplayName(), getCountryEntry(), AirportAutocomplete(), AirportAutocompleteProps, CountrySelectMode, styles (+16 more)

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
Cohesion: 0.29
Nodes (10): IsCheckoutBookingURL(), IsNonBookableDomain(), TestIsCheckoutBookingURL_rejectsFlightSearchPages(), TestIsNonBookableDomain_blocksFlightRadar(), TestValidateBookingURL_acceptsHTTPS(), TestValidateBookingURL_rejectsEmpty(), TestValidateBookingURL_rejectsJavascript(), TestValidateBookingURL_rejectsLocalhost() (+2 more)

### Community 55 - "ResultsScreen"
Cohesion: 0.24
Nodes (15): defaultParams, DynamicDestinationsScreen(), Nav, styles, ResultsScreen(), ExtraSearchLeg, addExtraDestinationLeg(), DynamicDestinationsValidation (+7 more)

### Community 56 - "BookingOffer"
Cohesion: 0.17
Nodes (31): bookingMatchPriceNormalizer(), PublicBookingAlternative, isAffiliateTemplateBookingURL(), normalizedGF2OfferPrice(), preferAirlineDirectWhenCheaperThanMarkedUpOTA(), publicAlternativesFromOffers(), buildDualBookingResolveResponse(), collectVerifiedBookingOffers() (+23 more)

### Community 57 - "itinerary.go"
Cohesion: 0.16
Nodes (23): operatingFlightForMatch(), TotalStops(), BuildCanonicalItinerary(), canonicalSegmentFromProvider(), FingerprintDebugString(), isIATACarrierCode(), flightNumbersEquivalent(), ResultMatchesItinerary() (+15 more)

### Community 58 - "types/index.ts"
Cohesion: 0.11
Nodes (30): AppIcon(), AppIconLibrary, AppIconProps, styles, FormHeroHeader(), FormHeroHeaderProps, styles, formCardStyles (+22 more)

### Community 59 - "ResultsScreen.tsx"
Cohesion: 0.14
Nodes (16): ResultsSkeletonList(), sk, bestScore(), CheapestOption, currentGeneration(), defaultFormParams, delay(), HUB_AIRPORTS (+8 more)

### Community 60 - "ExploreScreen.tsx"
Cohesion: 0.15
Nodes (27): getMonthDeals(), getAirportEntry(), getCityDisplayName(), c, countryFlag(), d, DestCard(), destinationLabelForCode() (+19 more)

### Community 61 - "time.Time"
Cohesion: 0.06
Nodes (49): airportCoord, minutesOfDay(), exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut() (+41 more)

### Community 62 - "client.ts"
Cohesion: 0.20
Nodes (11): searchAirports(), apiGet(), isLocalHostname(), IMPORTANT: Expo/Metro statically inlines EXPO_PUBLIC_* only when accessed via, resolveApiBase(), GetDealsRangeParams, GetMonthDealsParams, getFlightDetails() (+3 more)

### Community 63 - "data/airports.ts"
Cohesion: 0.15
Nodes (15): AIRPORT_DICTIONARY, AIRPORT_ONLY_DICTIONARY, FULL_PLACE_DICTIONARY, lower(), matchesQuery(), rankResult(), searchAirportsLocal(), byCode (+7 more)

### Community 64 - "api.ts"
Cohesion: 0.11
Nodes (17): ExploreResponse, getExploreDestinations(), GetExploreDestinationsParams, DestCardProps, AirportCityType, AirportLike, ANYWHERE_CODE, BaggageClass (+9 more)

### Community 65 - "MonthDealsScreen.tsx"
Cohesion: 0.09
Nodes (27): CheaperCitiesOption, CheaperCitiesSection(), Props, s, KEYS, s, SortBar(), SortOption (+19 more)

### Community 66 - "ThemeContext.tsx"
Cohesion: 0.13
Nodes (18): getPhrasesForLanguage(), SEARCH_BUTTON_PHRASES, SEARCH_PROGRESS_PHRASES, s, SearchProgressBanner(), SearchProgressBannerProps, ExtraLeg, Props (+10 more)

### Community 67 - "TopNavMenu.tsx"
Cohesion: 0.17
Nodes (12): LandingScreen(), Nav, styles, useIsMobile(), MobileNavRow(), NavIconName, RESULTS_SCREENS, RouteProps (+4 more)

### Community 68 - "AirportLocation"
Cohesion: 0.16
Nodes (11): AirportLocation(), TestAirportLocation_UnknownFallsBackUTC(), TestParseGF2TimeWithDateHint_AirportLocal(), TestParseGF2TimeWithDateHint_TelAviv(), TestExtractGF2Leg_SingleSegment_DepartArriveDiffer(), TestExtractGF2Leg_TimeOnly_NoDateHint(), TestExtractGF2Leg_TimeOnly_WithDateHint(), TestParseGF2Time_AcceptsFullDateTime() (+3 more)

### Community 69 - "store/index.ts"
Cohesion: 0.14
Nodes (19): FiltersPanelProps, SortBarProps, clampDealsMonth(), dealsActions, DealsSortField, DealsState, getMinimumAllowedDealsYearMonth(), now (+11 more)

### Community 70 - "App.tsx"
Cohesion: 0.27
Nodes (8): App(), linking, RTLWrapper(), API_BASE, useExchangeRates(), ThemeProvider(), ensureRates(), fetchRates()

### Community 71 - "CreateSearchSessionRequest"
Cohesion: 0.24
Nodes (9): DynamicDestinationsFormContentProps, PassengerCabinPickerProps, SearchFormContentProps, buildSearchString(), SearchUrlState, CreateSearchSessionRequest, buildFlyFixSearchResultsUrl(), FlyFixLegSearchParams (+1 more)

### Community 72 - "Registry"
Cohesion: 0.19
Nodes (8): MultiSearchResult, isSkippedProviderErr(), IsTransientSearchErrMsg(), NewRegistryFromEnv(), parseProviderNames(), GoogleFlights2Provider, Provider, Registry

### Community 73 - "itineraryStops.ts"
Cohesion: 0.48
Nodes (5): countByStopsFilter(), matchesStopsFilter(), maxStopsPerLeg(), stopsPerLeg(), totalStops()

### Community 74 - "segmentMatchesCabinClass"
Cohesion: 0.40
Nodes (4): TestGetSessionAndOption_MissingOption(), TestHandleFlyFixRefineIssues_Smoke(), TestSegmentMatchesCabinClass(), segmentMatchesCabinClass()

### Community 76 - "flyfix.ts"
Cohesion: 0.25
Nodes (8): apiPost(), FlyfixInsightsGroup, FlyfixIssue, FlyfixRefinedReport, FlyfixSummary, refineIssues(), RefineIssuesRequestBody, cancelSearchSession()

### Community 77 - "exchangeRates.ts"
Cohesion: 0.18
Nodes (11): DisplayPrice(), DisplayPriceProps, HubRouteLeg, HubRouteSummaryModal(), HubRouteSummaryModalProps, s, convertPrice(), CURRENCY_SYMBOLS (+3 more)

### Community 78 - "booking.ts"
Cohesion: 0.16
Nodes (17): AffiliateProvider, AffiliateProviderResponse, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink(), OutboundLinkResponse (+9 more)

### Community 79 - "DatePickerCalendar.tsx"
Cohesion: 0.33
Nodes (8): getDealsRange(), DatePickerCalendar(), DatePickerCalendarProps, getNext14Dates(), getRangeStartEnd(), styles, WEEKDAYS, DayDeal

### Community 80 - "DedupeProviderResults"
Cohesion: 0.36
Nodes (6): DedupeProviderResults(), ItineraryFingerprint(), mergeSelfTransfer(), uniqueStrings(), TestDedupeKeepsCheaper(), TestItineraryFingerprintStable()

### Community 81 - "CalendarModal.tsx"
Cohesion: 0.38
Nodes (6): buildMonthDays(), CalendarModal(), getMonthStart(), Props, styles, WEEKDAYS

### Community 82 - "GoogleFlights2Provider"
Cohesion: 0.11
Nodes (18): GoogleFlights2Provider, legSearchRetryable(), newGF2RateLimiter(), NewGoogleFlights2Provider(), truncateGF2(), TestIsOpenJaw(), TestResolveReturnAirports_classic(), TestResolveReturnAirports_openJaw() (+10 more)

### Community 83 - "formatMonthYear"
Cohesion: 0.47
Nodes (5): formatDealDate(), formatMonthShort(), formatMonthYear(), LOCALE_MAP, monthLocale()

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

- **Why does `CanonicalItinerary` connect `booking_resolve.go` to `CanonicalSegment`, `testing.T`, `ProviderResult`, `context.Context`, `server.go`, `GoogleFlights2Provider`, `matcher_test.go`, `BookingOffer`, `itinerary.go`, `booking_gf2_resolve.go`, `.Match`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `useTheme()` connect `useTheme` to `MonthDealsScreen.tsx`, `ThemeContext.tsx`, `SearchFormScreen.tsx`, `FlightDetailsModal.tsx`, `TopNavMenu.tsx`, `MonthDealsScreen`, `AirportAutocomplete.tsx`, `ui/index.ts`, `exchangeRates.ts`, `LocaleContext.tsx`, `ResultsScreen`, `types/index.ts`, `ResultsScreen.tsx`, `ExploreScreen.tsx`, `AdminRuntimeConfigPanel.tsx`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Why does `ProviderResult` connect `ProviderResult` to `googleflights2_provider.go`, `context.Context`, `booking_resolve.go`, `kiwi_apify_provider.go`, `DedupeProviderResults`, `GoogleFlights2Provider`, `itinerary_test.go`, `server.go`, `itinerary.go`, `time.Time`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `ClicksByProvider`, `BookingResolveRequest`, `PublicBookingAlternative` to the rest of the system?**
  _286 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Issue` be split into smaller, more focused modules?**
  _Cohesion score 0.1036036036036036 - nodes in this community are weakly interconnected._
- **Should `FlightDetailsModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10628019323671498 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.044444444444444446 - nodes in this community are weakly interconnected._