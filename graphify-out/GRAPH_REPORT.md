# Graph Report - workspace  (2026-09-08)

## Corpus Check
- 222 files · ~212,565 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1874 nodes · 5382 edges · 87 communities (79 shown, 5 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 462 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9d5a0756`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- googleflights2_provider.go
- react
- ResultsScreen
- Issue
- FiltersPanel.tsx
- dealsCache.ts
- dependencies
- useTheme
- Features
- auth.go
- FlightDetailsModal.tsx
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
- AirportAutocomplete.tsx
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
- useLocale
- LocaleContext.tsx
- ExploreScreen.tsx
- time.Time
- client.ts
- itinerary_test.go
- api.ts
- FlightResultCard.tsx
- ThemeContext.tsx
- GF2SearchAirports
- AirportLocation
- SortBar.tsx
- UserManagementPanel.tsx
- SelectCheapestVerifiedOffer
- Registry
- kiwi_apify_provider.go
- TestExtractCarrierCodes
- ErrorBoundary
- flyfix.ts
- exchangeRates.ts
- affiliate.ts
- DatePickerCalendar.tsx
- DedupeProviderResults
- AppIcon.tsx
- context.Context
- booking.ts
- TestApplySoftStrictBaggage
- DateRangePicker.tsx
- gf2Cache

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 88 edges
2. `useLocale()` - 79 edges
3. `react` - 62 edges
4. `react-native` - 54 edges
5. `ProviderResult` - 51 edges
6. `BookingOffer` - 40 edges
7. `MonthDealsScreen()` - 36 edges
8. `ResultsScreen()` - 35 edges
9. `resolveGF2PartnerOffers()` - 33 edges
10. `runBookingMatch()` - 32 edges

## Surprising Connections (you probably didn't know these)
- `BuildLegAirlineDirectURL()` --calls--> `marketingCarrierForLeg()`  [INFERRED]
  backend/affiliate.go → backend/booking_gf2_resolve.go
- `BuildLegAirlineDirectURL()` --calls--> `routeFromFlightLeg()`  [INFERRED]
  backend/affiliate.go → backend/canonical.go
- `BuildLegAirlineDirectURL()` --calls--> `routeFromFlightSegment()`  [INFERRED]
  backend/affiliate.go → backend/canonical.go
- `resolveGF2PartnerOffers()` --calls--> `BuildLegAirlineDirectURL()`  [INFERRED]
  backend/booking_gf2_resolve.go → backend/affiliate.go
- `pickAirlineDirectOffer()` --calls--> `BuildLegAirlineDirectURL()`  [INFERRED]
  backend/booking_resolve.go → backend/affiliate.go

## Import Cycles
- None detected.

## Communities (87 total, 5 thin omitted)

### Community 0 - "googleflights2_provider.go"
Cohesion: 0.07
Nodes (63): resolveAllPartnerBookingsFromTokenWithRetry(), findBookingOptionsArray(), firstPartnerBookingOption(), firstPartnerURLInMap(), firstStringByKeys(), GoogleFlights2Provider, ResolvedPartnerBooking, hostFromURL() (+55 more)

### Community 1 - "react"
Cohesion: 0.07
Nodes (35): linking, RTLWrapper(), styles, Props, s, State, LandingScreen(), Nav (+27 more)

### Community 2 - "ResultsScreen"
Cohesion: 0.16
Nodes (24): ResultsScreen(), defaultParams, SearchFormScreen(), styles, buildSearchString(), getParam(), getParams(), isWeb() (+16 more)

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "FiltersPanel.tsx"
Cohesion: 0.13
Nodes (22): AIRLINE_NAMES, getAirlineName(), AIRLINE_FULL_NAMES, NOTE: This is a starter subset of IATA airlines., f, FiltersPanel(), FiltersPanelProps, FlightDetailsModalProps (+14 more)

### Community 5 - "dealsCache.ts"
Cohesion: 0.25
Nodes (15): DealsState, MonthDealsResponse, CachedDealsResults, clearPendingDealsParams(), DealsParams, dealsParamsFingerprint(), getCachedDealsResults(), getLocalStorage() (+7 more)

### Community 6 - "dependencies"
Cohesion: 0.05
Nodes (37): dependencies, expo, @expo/metro-runtime, expo-status-bar, react, react-dom, react-native, react-native-safe-area-context (+29 more)

### Community 7 - "useTheme"
Cohesion: 0.09
Nodes (35): ClearableTextInput(), ClearableTextInputProps, styles, useAuth(), useRuntimeConfig(), useRuntimeConfigActions(), AdminRuntimeConfigPanel(), ConfigFieldRow() (+27 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (33): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+25 more)

### Community 9 - "auth.go"
Cohesion: 0.18
Nodes (26): authUserJSON(), bootstrapAdminUser(), createAuthSession(), envFlagTrue(), handleAuthLogin(), handleAuthMe(), handleAuthRegister(), handleAuthUsers() (+18 more)

### Community 10 - "FlightDetailsModal.tsx"
Cohesion: 0.18
Nodes (18): airportTimeZones, getAirportTimeZone(), cabinLabel(), FlightDetailsModal(), formatDuration(), layoverBetween(), legDuration(), s (+10 more)

### Community 11 - "booking_resolve.go"
Cohesion: 0.14
Nodes (28): acquireBookingResolveSlot(), beginInflightResolve(), bookingResolveCacheKey(), bookingResolveFailureResponse(), bookingResolveMaxConcurrentFromEnv(), cacheTTLForStatus(), canonicalItineraryForOption(), envDurationMinutes() (+20 more)

### Community 12 - "ui/index.ts"
Cohesion: 0.13
Nodes (32): BookingResolveResponse, isSafeBookingUrl(), PublicBookingOffer, bookingOfferProviderLabel(), bookingOfferSubtitle(), formatBookingOfferPriceAmount(), formatBookingOfferPriceLine(), formatProviderDisplayName() (+24 more)

### Community 13 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 14 - "KiwiApifyProvider"
Cohesion: 0.17
Nodes (8): apifyErrorMessage(), flattenKiwiItems(), NewKiwiApifyProvider(), stringField(), truncateStr(), KiwiApifyProvider, kiwiCache, kiwiCacheEntry

### Community 15 - "canonical.go"
Cohesion: 0.14
Nodes (35): FlightOption, openJawOption(), TestBookingLinkModeDefaultsToGoogle(), TestBookingRouteFromSessionOption_splitOmitsReturn(), TestBuildGoogleFlightsFallbackFromParams(), TestBuildLegOrSegmentBookingURL_segment(), TestBuildOneWayLegBookingURL(), TestBuildSkyscannerPrefillURL_oneWay() (+27 more)

### Community 16 - "MonthDealsScreen.tsx"
Cohesion: 0.10
Nodes (31): buildDealsPositioningSignature(), dealBestScore(), fl, fmtDur(), formatDealDate(), hfm, HUB_AIRPORTS, layoverBetween() (+23 more)

### Community 17 - "affiliate.go"
Cohesion: 0.18
Nodes (16): BuildLegAirlineDirectURL(), BuildRedirectURL(), getAffiliateID(), GetClicksSummary(), getOTAProvider(), FlightOption, SearchSession, ParseOptionIndex() (+8 more)

### Community 18 - "server.go"
Cohesion: 0.07
Nodes (59): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, CanonicalFingerprint(), Carrier, CarrierCodes, CreateSearchSessionRequest (+51 more)

### Community 19 - "runBookingMatch"
Cohesion: 0.16
Nodes (22): legRouteLabel(), TestCanonicalItineraryForOption_isolatesSplitLegs(), runBookingMatch(), TestCacheTTLForStatus_doesNotCacheMisses(), TestHandleBookingResolve_invalidItinerary(), TestHandleBookingResolve_prefillFallback(), TestHandleBookingResolve_searchUnavailable(), TestHandleBookingResolve_verified() (+14 more)

### Community 20 - "qa_runner.py"
Cohesion: 0.14
Nodes (13): Namespace, Path, Any, Reporting helpers for test execution results., Render terminal summary and persist machine-readable reports., Print user-friendly report to stdout., Write a JSON report and return its path., ReportWriter (+5 more)

### Community 21 - "ApiClient"
Cohesion: 0.14
Nodes (12): ApiClient, Any, HTTP client utilities for executing API test cases., Parse JSON response when possible without raising., Sleep using exponential backoff., Executes HTTP requests with retry and timing support., Close the underlying requests session., Execute one test case and return a populated result. (+4 more)

### Community 22 - "matcher_test.go"
Cohesion: 0.12
Nodes (39): classifyURLType(), extractPrice(), cfgTest(), floatPtr(), TestClassifyURLType_genericVsExact(), testConnectingTLVJFK(), TestExtractPrice_euroPrefixNotArrivalTime(), TestGenerateQueries_connecting() (+31 more)

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
Nodes (34): airlineDomainForCarrier(), allocateLegQuoteAmount(), applySearchQuoteToOffer(), attachQuotedPriceMeta(), bookingMatchPriceNormalizer(), dedupeGF2PartnerOffers(), flightLegDurationMinutes(), gf2OffersHavePrice() (+26 more)

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
Cohesion: 0.16
Nodes (29): extractFlightNumbers(), flightNumberInText(), flightNumbersEquivalent(), splitFlightDesignator(), textContainsAirport(), textContainsAny(), timeMatches(), TestFlightNumbersEquivalent_leadingZeros() (+21 more)

### Community 33 - "testing.T"
Cohesion: 0.07
Nodes (44): TestAllocateLegQuoteAmount_splitOpenJaw(), TestAttachQuotedPriceMeta_detectsMismatch(), TestGF2PartnerOfferFromURL_acceptsHTTPS(), TestGF2PartnerOfferFromURL_rejectsUnsafe(), TestLegDeepLink_rejectsMisalignedPartnerArrays(), TestLegDeepLink_rejectsWrongAirlineDirectCheckout(), TestQuoteBindingFromOption_usesOriginalWhenEstimate(), TestQuoteBindingFromOption_usesStoredLegPrice() (+36 more)

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
Cohesion: 0.23
Nodes (14): AuthUser, fetchAuthMe(), loginWithPassword(), logoutSession(), registerAccount(), AdminAuthProvider, applyUser(), AuthContext (+6 more)

### Community 38 - "ProviderResult"
Cohesion: 0.10
Nodes (30): TestCombineOneWayBatches(), TestCombineOneWayBatches_emptyBatch(), TestCombineOneWayBatches_openJawReturnDiversity(), TestCompleteExtraLegs(), TestExtraLegsFingerprint(), TestHasExtraLegs(), cheapestReturnLeg(), GoogleFlights2Provider (+22 more)

### Community 39 - "search.ts"
Cohesion: 0.20
Nodes (18): CachedResult, createSearchSession(), createSearchSessionWithRetry(), fetchFresh(), getFromStorage(), getSearchSessionResults(), getStorage(), isTransientSearchError() (+10 more)

### Community 40 - "skyscanner.ts"
Cohesion: 0.42
Nodes (10): BookingHop, bookingHopsFromOption(), firstSeg(), isClassicRoundTripLegs(), isoDatePrefix(), isSplitBookingItinerary(), lastSeg(), legNeedsSegmentSplit() (+2 more)

### Community 41 - "models.py"
Cohesion: 0.25
Nodes (5): Core data models for the API QA runner., Set completion timestamp., Return an ISO-8601 UTC timestamp., utc_now_iso(), Validation rules for API responses.

### Community 42 - "AirportAutocomplete.tsx"
Cohesion: 0.13
Nodes (39): AIRPORT_DICTIONARY, AIRPORT_ONLY_DICTIONARY, FULL_PLACE_DICTIONARY, getAirportDisplayName(), getAirportNameByCode(), getCityDisplayName(), lower(), matchesQuery() (+31 more)

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "write-spa-fallbacks.mjs"
Cohesion: 0.33
Nodes (5): __dirname, dist, indexHtml, indexPath, SPA_ROUTES

### Community 45 - "net/http.Request"
Cohesion: 0.19
Nodes (29): GetSessionAndOption(), SearchSessionResultsResponse, RecordClick(), ResolveProvider(), bearerTokenFromRequest(), handleAuthChangePassword(), handleAuthLogout(), isAdminRequest() (+21 more)

### Community 53 - "loadSearchSession"
Cohesion: 0.15
Nodes (28): startExploreSessionCleanup(), corsMiddleware(), fetchExchangeRates(), loadSearchSession(), main(), TestLoadSearchSession_Expiry(), searchSessionTTL(), startExchangeRateRefresh() (+20 more)

### Community 54 - "ValidateBookingURL"
Cohesion: 0.27
Nodes (11): gf2CheckoutOffers(), IsCheckoutBookingURL(), IsNonBookableDomain(), TestIsCheckoutBookingURL_rejectsFlightSearchPages(), TestIsNonBookableDomain_blocksFlightRadar(), TestValidateBookingURL_acceptsHTTPS(), TestValidateBookingURL_rejectsEmpty(), TestValidateBookingURL_rejectsJavascript() (+3 more)

### Community 55 - "ResultsScreen.tsx"
Cohesion: 0.12
Nodes (28): DynamicDestinationsFormContent(), DynamicDestinationsFormContentProps, styles, defaultParams, DynamicDestinationsScreen(), Nav, styles, PassengerCabinPickerProps (+20 more)

### Community 56 - "BookingOffer"
Cohesion: 0.20
Nodes (27): PublicBookingAlternative, isAffiliateTemplateBookingURL(), normalizedGF2OfferPrice(), preferAirlineDirectWhenCheaperThanMarkedUpOTA(), publicAlternativesFromOffers(), bookingOfferInGF2Sources(), bookingOfferSameURL(), buildDualBookingResolveResponse() (+19 more)

### Community 57 - "CanonicalItinerary"
Cohesion: 0.16
Nodes (23): operatingFlightForMatch(), BuildCanonicalItinerary(), canonicalSegmentFromProvider(), FingerprintDebugString(), CanonicalItinerary, isIATACarrierCode(), flightNumbersEquivalent(), ResultMatchesItinerary() (+15 more)

### Community 58 - "useLocale"
Cohesion: 0.16
Nodes (22): FormHeroHeader(), FormHeroHeaderProps, styles, formCardStyles, makeFormThemedStyles(), SearchSubmitButton(), SearchSubmitButtonProps, useLocale() (+14 more)

### Community 59 - "LocaleContext.tsx"
Cohesion: 0.20
Nodes (15): getStorage(), languageToLocale(), loadSaved(), LocaleContext, LocaleContextValue, LocaleProvider(), save(), VALID_CURRENCIES (+7 more)

### Community 60 - "ExploreScreen.tsx"
Cohesion: 0.15
Nodes (25): getExploreDestinations(), getAirportEntry(), c, countryFlag(), d, DestCard(), ExploreScreen(), ExploreScreenProps (+17 more)

### Community 61 - "time.Time"
Cohesion: 0.16
Nodes (28): mergeExplorePriceRows(), exploreSessionKey(), getExploreSession(), newExploreSessionID(), putExploreSession(), exploreDestRow, exploreSession, FullRoundTrip (+20 more)

### Community 62 - "client.ts"
Cohesion: 0.13
Nodes (19): searchAirports(), API_BASE, apiGet(), apiUrl(), isLocalHostname(), IMPORTANT: Expo/Metro statically inlines EXPO_PUBLIC_* only when accessed via, resolveApiBase(), getDealsRange() (+11 more)

### Community 63 - "itinerary_test.go"
Cohesion: 0.22
Nodes (14): AttachCanonicalIdentity(), segTLVJFK(), TestCanonicalItineraryFingerprint_connectingFlight(), TestCanonicalItineraryFingerprint_differentFlightsDoNotCollide(), TestCanonicalItineraryFingerprint_directFlight(), TestCanonicalItineraryFingerprint_excludesPrice(), TestCanonicalItineraryFingerprint_formattingStable(), TestCanonicalItineraryFingerprint_gf2AirlineNameStable() (+6 more)

### Community 64 - "api.ts"
Cohesion: 0.11
Nodes (21): defaultFilters, isCurrentSearchGeneration(), searchActions, SearchFilters, SearchState, SortOrder, useSearchStore, AirportCityType (+13 more)

### Community 65 - "FlightResultCard.tsx"
Cohesion: 0.30
Nodes (12): c, LegScheduleBlock(), FlightSegment, LayoverSummary, buildLegPreviewSummary(), computeLayovers(), formatDuration(), formatLayoverPreview() (+4 more)

### Community 66 - "ThemeContext.tsx"
Cohesion: 0.11
Nodes (20): getPhrasesForLanguage(), SEARCH_BUTTON_PHRASES, SEARCH_PROGRESS_PHRASES, s, SearchProgressBanner(), SearchProgressBannerProps, ExtraLeg, Props (+12 more)

### Community 67 - "GF2SearchAirports"
Cohesion: 0.27
Nodes (10): gf2MetroKey(), GF2SearchAirports(), ResolveGF2PlaceCode(), containsAll(), TestGF2SearchAirports_CityOnlyCode(), TestGF2SearchAirports_LondonParis(), TestGF2SearchAirports_SingleAirport(), TestGF2SearchAirports_SpecificAirportNotExpanded() (+2 more)

### Community 68 - "AirportLocation"
Cohesion: 0.16
Nodes (11): AirportLocation(), TestAirportLocation_UnknownFallsBackUTC(), TestParseGF2TimeWithDateHint_AirportLocal(), TestParseGF2TimeWithDateHint_TelAviv(), TestExtractGF2Leg_SingleSegment_DepartArriveDiffer(), TestExtractGF2Leg_TimeOnly_NoDateHint(), TestExtractGF2Leg_TimeOnly_WithDateHint(), TestParseGF2Time_AcceptsFullDateTime() (+3 more)

### Community 69 - "SortBar.tsx"
Cohesion: 0.29
Nodes (7): KEYS, s, SortBar(), SortBarProps, SortOption, SortField, Chip()

### Community 70 - "UserManagementPanel.tsx"
Cohesion: 0.38
Nodes (10): authHeaders(), changePassword(), createUser(), deleteUser(), fetchUsers(), LoginResponse, ManagedUser, updateUser() (+2 more)

### Community 71 - "SelectCheapestVerifiedOffer"
Cohesion: 0.36
Nodes (7): TestSelectCheapestVerifiedOffer_picksLowestPrice(), QuoteBinding, normalizedOfferPrice(), normalizedQuoteAmount(), SelectCheapestVerifiedOffer(), urlTypeRank(), offerCandidate

### Community 72 - "Registry"
Cohesion: 0.19
Nodes (8): MultiSearchResult, isSkippedProviderErr(), IsTransientSearchErrMsg(), NewRegistryFromEnv(), parseProviderNames(), GoogleFlights2Provider, Provider, Registry

### Community 73 - "kiwi_apify_provider.go"
Cohesion: 0.32
Nodes (15): asArray(), collectCarriers(), detectSelfTransfer(), extractKiwiLegs(), firstFloat(), firstString(), kiwiSegmentFromMap(), mapsToSegments() (+7 more)

### Community 74 - "TestExtractCarrierCodes"
Cohesion: 0.83
Nodes (3): makeOfferWithCarriers(), TestExtractCarrierCodes(), TestPrimaryDisplayCarrier()

### Community 76 - "flyfix.ts"
Cohesion: 0.25
Nodes (8): apiPost(), FlyfixInsightsGroup, FlyfixIssue, FlyfixRefinedReport, FlyfixSummary, refineIssues(), RefineIssuesRequestBody, cancelSearchSession()

### Community 77 - "exchangeRates.ts"
Cohesion: 0.21
Nodes (11): App(), DisplayPrice(), DisplayPriceProps, useExchangeRates(), convertPrice(), CURRENCY_SYMBOLS, CurrencyCode, ensureRates() (+3 more)

### Community 78 - "affiliate.ts"
Cohesion: 0.27
Nodes (9): AffiliateProvider, AffiliateProviderResponse, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink(), OutboundLinkResponse (+1 more)

### Community 79 - "DatePickerCalendar.tsx"
Cohesion: 0.36
Nodes (7): DatePickerCalendar(), DatePickerCalendarProps, getNext14Dates(), getRangeStartEnd(), styles, WEEKDAYS, DayDeal

### Community 80 - "DedupeProviderResults"
Cohesion: 0.24
Nodes (8): DedupeProviderResults(), ItineraryFingerprint(), mergeSelfTransfer(), TotalStops(), uniqueStrings(), TestDedupeKeepsCheaper(), TestItineraryFingerprintStable(), MultiSearchResult

### Community 81 - "AppIcon.tsx"
Cohesion: 0.09
Nodes (24): AppIcon(), AppIconLibrary, AppIconProps, styles, EditSearchModal(), EditSearchModalProps, s, HubRouteLeg (+16 more)

### Community 82 - "context.Context"
Cohesion: 0.16
Nodes (14): GoogleFlights2Provider, truncateGF2(), TestIsOpenJaw(), TestResolveReturnAirports_classic(), TestResolveReturnAirports_openJaw(), TestSanitizeStandardSearchRequest(), SearchRequest, HasExtraLegs() (+6 more)

### Community 83 - "booking.ts"
Cohesion: 0.36
Nodes (8): BookingResolveRequest, BookingResolveStatus, bookingRetryDelayMs(), fetchBookingResolveOnce(), isTransientBookingFetchError(), isTransientBookingResolveResponse(), PublicBookingAlternative, resolveBookingOffer()

### Community 84 - "TestApplySoftStrictBaggage"
Cohesion: 0.52
Nodes (6): applySoftStrictBaggage(), makeOfferWithBags(), makeOfferWithMissingBags(), TestApplySoftStrictBaggage(), TestClassifyOfferBaggage(), classifyOfferBaggage()

### Community 85 - "DateRangePicker.tsx"
Cohesion: 0.36
Nodes (8): buildMonthDays(), DateRangePicker(), DateRangePickerProps, getMonthStart(), monthStartForYmd(), parseYmdUtc(), styles, WEEKDAYS

### Community 87 - "gf2Cache"
Cohesion: 0.18
Nodes (8): newGF2Cache(), newGF2RateLimiter(), NewGoogleFlights2Provider(), TestOpenJaw_usesDecomposedSearchPath(), TestSearchLegCached_usesCache(), sync.RWMutex, gf2Cache, gf2CacheEntry

## Knowledge Gaps
- **293 isolated node(s):** `ClicksByProvider`, `BookingResolveRequest`, `PublicBookingAlternative`, `exploreLiveCandidate`, `flightcaptainweb` (+288 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 401 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `ResultsScreen`, `FiltersPanel.tsx`, `dependencies`, `useTheme`, `FlightDetailsModal.tsx`, `ui/index.ts`, `MonthDealsScreen.tsx`, `RuntimeConfigContext.tsx`, `AuthContext.tsx`, `AirportAutocomplete.tsx`, `ResultsScreen.tsx`, `useLocale`, `LocaleContext.tsx`, `ExploreScreen.tsx`, `FlightResultCard.tsx`, `ThemeContext.tsx`, `SortBar.tsx`, `UserManagementPanel.tsx`, `exchangeRates.ts`, `DatePickerCalendar.tsx`, `AppIcon.tsx`, `DateRangePicker.tsx`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `ProviderResult` connect `ProviderResult` to `googleflights2_provider.go`, `kiwi_apify_provider.go`, `KiwiApifyProvider`, `DedupeProviderResults`, `server.go`, `context.Context`, `gf2Cache`, `CanonicalItinerary`, `time.Time`, `itinerary_test.go`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `CanonicalItinerary` connect `CanonicalItinerary` to `CanonicalSegment`, `googleflights2_provider.go`, `ProviderResult`, `booking_resolve.go`, `server.go`, `runBookingMatch`, `context.Context`, `matcher_test.go`, `BookingOffer`, `booking_gf2_resolve.go`, `.Match`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **What connects `ClicksByProvider`, `BookingResolveRequest`, `PublicBookingAlternative` to the rest of the system?**
  _293 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `googleflights2_provider.go` be split into smaller, more focused modules?**
  _Cohesion score 0.07403508771929825 - nodes in this community are weakly interconnected._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.07397959183673469 - nodes in this community are weakly interconnected._
- **Should `Issue` be split into smaller, more focused modules?**
  _Cohesion score 0.1036036036036036 - nodes in this community are weakly interconnected._