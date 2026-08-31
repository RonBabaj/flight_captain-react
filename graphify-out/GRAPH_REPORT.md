# Graph Report - workspace  (2026-08-31)

## Corpus Check
- 208 files · ~206,174 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1790 nodes · 4930 edges · 89 communities (84 shown, 5 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 437 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e254177e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ExploreScreen.tsx
- RootNavigator.tsx
- AirportAutocomplete.tsx
- Issue
- useSearchParams.ts
- MonthDealsScreen.tsx
- dependencies
- useTheme
- Features
- initTestAuthDB
- googleflights2_provider.go
- booking_resolve.go
- FlightDetailsModal.tsx
- compilerOptions
- context.Context
- canonical.go
- LocaleContext.tsx
- affiliate.go
- server.go
- time.Time
- qa_runner.py
- ApiClient
- matcher_test.go
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
- testing.T
- flightTimeToMs
- ValidationIssue
- Backend QA Automation Tool
- SearchRequest
- kiwi_apify_provider.go
- search.ts
- GoogleFlights2Provider
- models.py
- multi_provider_test.go
- Fly-Fix – Frontend
- write-spa-fallbacks.mjs
- net/http.Request
- metro.config.js
- __init__.py
- flightcaptainweb
- loadSearchSession
- ErrorBoundary
- ResultsScreen.tsx
- CanonicalItinerary
- DedupeProviderResults
- FlightResultCard.tsx
- api.ts
- VerifyCandidate
- exploreBuildRowsAndQueue
- client.ts
- AppIcon.tsx
- KiwiApifyProvider
- FiltersPanel.tsx
- ThemeContext.tsx
- gf2_booking_quote.go
- itinerary_test.go
- store/index.ts
- AirportLocation
- SearchFormScreen.tsx
- Registry
- skyscanner.ts
- DateRangePicker.tsx
- DraggableBottomSheet.tsx
- handleExplore
- exchangeRates.ts
- affiliate.ts
- CompleteExtraLegs
- flyfix.ts
- DatePickerCalendar.tsx
- gf2Cache
- ValidateBookingURL
- TestApplySoftStrictBaggage
- FlightOption
- TestExtractCarrierCodes
- bookableDates.ts
- extractPrice

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 76 edges
2. `useLocale()` - 73 edges
3. `ProviderResult` - 44 edges
4. `BookingOffer` - 37 edges
5. `MonthDealsScreen()` - 36 edges
6. `ResultsScreen()` - 35 edges
7. `resolveGF2PartnerOffers()` - 32 edges
8. `CanonicalItinerary` - 32 edges
9. `runBookingMatch()` - 31 edges
10. `VerifyCandidate()` - 31 edges

## Surprising Connections (you probably didn't know these)
- `handleAffiliateOutboundLink()` --calls--> `ResolveProvider()`  [INFERRED]
  backend/server.go → backend/affiliate.go
- `handleAffiliateProvider()` --calls--> `ResolveProvider()`  [INFERRED]
  backend/server.go → backend/affiliate.go
- `handleAffiliateRedirect()` --calls--> `ResolveProvider()`  [INFERRED]
  backend/server.go → backend/affiliate.go
- `BuildLegAirlineDirectURL()` --calls--> `marketingCarrierForLeg()`  [INFERRED]
  backend/affiliate.go → backend/booking_gf2_resolve.go
- `BuildLegAirlineDirectURL()` --calls--> `routeFromFlightLeg()`  [INFERRED]
  backend/affiliate.go → backend/canonical.go

## Import Cycles
- None detected.

## Communities (89 total, 5 thin omitted)

### Community 0 - "ExploreScreen.tsx"
Cohesion: 0.13
Nodes (26): getMonthDeals(), ExploreResponse, getExploreDestinations(), GetExploreDestinationsParams, getAirportEntry(), c, countryFlag(), d (+18 more)

### Community 1 - "RootNavigator.tsx"
Cohesion: 0.10
Nodes (27): LandingScreen(), Nav, styles, useIsMobile(), DynamicDestinationsStack(), Stack, MonthDealsStack(), Stack (+19 more)

### Community 2 - "AirportAutocomplete.tsx"
Cohesion: 0.13
Nodes (35): AIRPORT_DICTIONARY, AIRPORT_ONLY_DICTIONARY, FULL_PLACE_DICTIONARY, getAirportDisplayName(), getAirportNameByCode(), getCityDisplayName(), lower(), matchesQuery() (+27 more)

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "useSearchParams.ts"
Cohesion: 0.19
Nodes (18): buildSearchString(), getParam(), getParams(), isWeb(), parseSearchParamsFromUrl(), SearchUrlState, updateSearchUrl(), useSearchParams() (+10 more)

### Community 5 - "MonthDealsScreen.tsx"
Cohesion: 0.10
Nodes (41): buildDealsPositioningSignature(), dealBestScore(), fl, formatDealDate(), hfm, HUB_AIRPORTS, m, MonthDealsScreen() (+33 more)

### Community 6 - "dependencies"
Cohesion: 0.04
Nodes (44): @babel/core, expo, @expo/metro-runtime, expo-status-bar, dependencies, expo, @expo/metro-runtime, expo-status-bar (+36 more)

### Community 7 - "useTheme"
Cohesion: 0.13
Nodes (31): ClearableTextInput(), EditSearchModal(), HubRouteSummaryModal(), SearchSummaryBar(), SearchLoadingOverlay(), useAuth(), useLocale(), ConfigFieldRow() (+23 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (33): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+25 more)

### Community 9 - "initTestAuthDB"
Cohesion: 0.23
Nodes (15): handleAuthLogin(), initAuthStore(), initTestAuthDB(), randomTestPassword(), TestAuthLoginAndChangePassword(), TestAuthRegister(), TestAuthUserManagement(), TestBootstrapAdminPasswordSync() (+7 more)

### Community 10 - "googleflights2_provider.go"
Cohesion: 0.22
Nodes (25): TestExtractGF2BookingURL(), buildGF2ResultFromItinerary(), extractGF2BookingToken(), extractGF2BookingURL(), extractGF2DurationMinutes(), extractGF2Flight(), extractGF2Itineraries(), extractGF2ItinerariesFromMap() (+17 more)

### Community 11 - "booking_resolve.go"
Cohesion: 0.05
Nodes (111): airlineDomainForCarrier(), allocateLegQuoteAmount(), applySearchQuoteToOffer(), attachQuotedPriceMeta(), bookingMatchPriceNormalizer(), dedupeGF2PartnerOffers(), flightLegDurationMinutes(), gf2OffersHavePrice() (+103 more)

### Community 12 - "FlightDetailsModal.tsx"
Cohesion: 0.19
Nodes (17): BookingResolveRequest, BookingResolveResponse, BookingResolveStatus, isSafeBookingUrl(), PublicBookingAlternative, PublicBookingOffer, resolveBookingOffer(), bookingOfferLabel() (+9 more)

### Community 13 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+15 more)

### Community 14 - "context.Context"
Cohesion: 0.25
Nodes (13): resolveAllPartnerBookingsFromTokenWithRetry(), GoogleFlights2Provider, ResolvedPartnerBooking, providerFromURL(), TestExtractGF2PartnerBookingTokenPrefersPartnerURL(), extractGF2PartnerBookingToken(), findFirstPartnerCheckoutURL(), findFirstStringByKeys() (+5 more)

### Community 15 - "canonical.go"
Cohesion: 0.13
Nodes (38): FlightOption, openJawOption(), TestBookingLinkModeDefaultsToGoogle(), TestBookingRouteFromSessionOption_splitOmitsReturn(), TestBuildGoogleFlightsFallbackFromParams(), TestBuildLegOrSegmentBookingURL_segment(), TestBuildOneWayLegBookingURL(), TestBuildSkyscannerPrefillURL_oneWay() (+30 more)

### Community 16 - "LocaleContext.tsx"
Cohesion: 0.13
Nodes (20): App(), linking, RTLWrapper(), getStorage(), languageToLocale(), loadSaved(), LocaleContext, LocaleContextValue (+12 more)

### Community 17 - "affiliate.go"
Cohesion: 0.13
Nodes (24): BuildLegAirlineDirectURL(), BuildRedirectURL(), getAffiliateID(), GetClicksSummary(), getOTAProvider(), GetSessionAndOption(), FlightOption, SearchSession (+16 more)

### Community 18 - "server.go"
Cohesion: 0.07
Nodes (59): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, Carrier, CarrierCodes, CreateSearchSessionRequest, DayDeal (+51 more)

### Community 19 - "time.Time"
Cohesion: 0.17
Nodes (25): mergeExplorePriceRows(), exploreDestRow, exploreSession, FullRoundTrip, attachReturnLegKeepPrice(), ensureRoundTripLegs(), exploreDestRowsToMaps(), exploreRunLiveBatch() (+17 more)

### Community 20 - "qa_runner.py"
Cohesion: 0.14
Nodes (13): Namespace, Path, Any, Reporting helpers for test execution results., Render terminal summary and persist machine-readable reports., Print user-friendly report to stdout., Write a JSON report and return its path., ReportWriter (+5 more)

### Community 21 - "ApiClient"
Cohesion: 0.14
Nodes (12): ApiClient, Any, HTTP client utilities for executing API test cases., Parse JSON response when possible without raising., Sleep using exponential backoff., Executes HTTP requests with retry and timing support., Close the underlying requests session., Execute one test case and return a populated result. (+4 more)

### Community 22 - "matcher_test.go"
Cohesion: 0.16
Nodes (20): floatPtr(), testConnectingTLVJFK(), TestFlightNumbersEquivalent_leadingZeros(), TestGenerateQueries_connecting(), TestGenerateQueries_direct(), TestGenerateQueries_gf2AirlineNameIdentity(), TestGenerateQueries_includesRouteDateBookQuery(), TestGenerateQueries_prioritizesEndToEndLegRoute() (+12 more)

### Community 23 - "TestResult"
Cohesion: 0.18
Nodes (8): AI and heuristic quality-control analysis for API test results., Analyze result quality with Ollama and rule-based checks., Close underlying HTTP session., Return human-readable quality notes for this result. Rule-based insights are…, ResponseAnalyzer, Stores execution data and findings for one test case., A test passes when there are no error-level issues., TestResult

### Community 24 - "ResponseValidator"
Cohesion: 0.22
Nodes (5): Any, Applies status, schema, and consistency checks., Run all checks and append issues to the result., Resolve a dotted path in a nested JSON-like payload. Supports indexes like…, ResponseValidator

### Community 25 - "runtime_config.go"
Cohesion: 0.22
Nodes (16): adminAccessConfigured(), configRangeError, adminTokenConfigured(), defaultRuntimeConfig(), errConfigOutOfRange(), getRuntimeConfig(), handleAdminRuntimeConfig(), initRuntimeConfigStore() (+8 more)

### Community 26 - "ProviderResult"
Cohesion: 0.28
Nodes (15): TestAttachCanonicalIdentityAll_combineOneWay(), cloneLegs(), CombineOneWayBatches(), extraLegMaxPerBatch(), finalizeCombinedBatches(), MultiSearchResult, ProviderResult, ProviderSearchStats (+7 more)

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.32
Nodes (13): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+5 more)

### Community 29 - "AdminRuntimeConfigPanel.tsx"
Cohesion: 0.16
Nodes (21): apiRequest(), adminAuthHeaders(), fetchAdminRuntimeConfig(), fetchRuntimeConfig(), saveAdminRuntimeConfig(), setRuntimeConfigStore(), RuntimeConfigContext, RuntimeConfigContextValue (+13 more)

### Community 30 - "AuthContext.tsx"
Cohesion: 0.16
Nodes (24): authHeaders(), AuthUser, changePassword(), createUser(), deleteUser(), fetchAuthMe(), fetchUsers(), LoginResponse (+16 more)

### Community 31 - "backend_api_contracts.md"
Cohesion: 0.17
Nodes (11): 1.1 Create Search Session, 1.2 Get Search Session Status & Results, 1.3 Cancel Search Session (Optional, MVP+), 1. Flight Search Sessions, 2.1 Get Monthly Deals, 2. Monthly Deals API, 3.1 Search Airports & Cities, 3. Airport & City Autocomplete (+3 more)

### Community 32 - "CalendarModal.tsx"
Cohesion: 0.38
Nodes (6): buildMonthDays(), CalendarModal(), getMonthStart(), Props, styles, WEEKDAYS

### Community 33 - "testing.T"
Cohesion: 0.15
Nodes (22): TestAllocateLegQuoteAmount_splitOpenJaw(), TestAttachQuotedPriceMeta_detectsMismatch(), TestGF2PartnerOfferFromURL_acceptsHTTPS(), TestGF2PartnerOfferFromURL_rejectsUnsafe(), TestLegDeepLink_rejectsMisalignedPartnerArrays(), TestLegDeepLink_rejectsWrongAirlineDirectCheckout(), TestQuoteBindingFromOption_usesOriginalWhenEstimate(), TestQuoteBindingFromOption_usesStoredLegPrice() (+14 more)

### Community 34 - "flightTimeToMs"
Cohesion: 0.21
Nodes (13): airportTimeZones, getAirportTimeZone(), fmtShortDate(), fmtDur(), layoverBetween(), legDuration(), renderLeg(), safeDate() (+5 more)

### Community 35 - "ValidationIssue"
Cohesion: 0.18
Nodes (7): Any, Serialize nested result for report output., Represents a single validation or analysis finding., Serialize issue to dictionary., Serialize case to dictionary., Append a new issue to this result., ValidationIssue

### Community 36 - "Backend QA Automation Tool"
Cohesion: 0.18
Nodes (10): Backend QA Automation Tool, Features, If the run feels slow or “stuck”, Notes, Optional AI Setup (Ollama), Output, Project Structure, Run (+2 more)

### Community 37 - "SearchRequest"
Cohesion: 0.20
Nodes (13): TestHasExtraLegs(), TestIsOpenJaw(), TestResolveReturnAirports_classic(), TestResolveReturnAirports_openJaw(), TestSanitizeStandardSearchRequest(), SearchRequest, HasExtraLegs(), IsOpenJaw() (+5 more)

### Community 38 - "kiwi_apify_provider.go"
Cohesion: 0.34
Nodes (14): asArray(), collectCarriers(), detectSelfTransfer(), extractKiwiLegs(), firstFloat(), firstString(), kiwiSegmentFromMap(), mapsToSegments() (+6 more)

### Community 39 - "search.ts"
Cohesion: 0.22
Nodes (17): CachedResult, createSearchSession(), createSearchSessionWithRetry(), fetchFresh(), getFromStorage(), getSearchSessionResults(), getStorage(), isTransientSearchError() (+9 more)

### Community 40 - "GoogleFlights2Provider"
Cohesion: 0.21
Nodes (6): GoogleFlights2Provider, newGF2RateLimiter(), NewGoogleFlights2Provider(), truncateGF2(), sync.Mutex, gf2RateLimiter

### Community 41 - "models.py"
Cohesion: 0.25
Nodes (5): Core data models for the API QA runner., Set completion timestamp., Return an ISO-8601 UTC timestamp., utc_now_iso(), Validation rules for API responses.

### Community 42 - "multi_provider_test.go"
Cohesion: 0.18
Nodes (10): parseKiwiApifyItems(), TestApifyErrorMessage(), TestBuildActorInputSolidcodeOnly(), TestDetectSelfTransfer(), TestKiwiApifyTimeout(), TestParseKiwiApifyItemsSolidcodeShape(), TestParseKiwiEmptyAndInvalid(), TestRegistrySearchAll_openJawGF2FailNotMaskedByKiwiSkip() (+2 more)

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "write-spa-fallbacks.mjs"
Cohesion: 0.33
Nodes (5): __dirname, dist, indexHtml, indexPath, SPA_ROUTES

### Community 45 - "net/http.Request"
Cohesion: 0.16
Nodes (38): authUserJSON(), bearerTokenFromRequest(), bootstrapAdminUser(), createAuthSession(), envFlagTrue(), handleAuthChangePassword(), handleAuthLogout(), handleAuthMe() (+30 more)

### Community 53 - "loadSearchSession"
Cohesion: 0.22
Nodes (22): loadSearchSession(), TestLoadSearchSession_Expiry(), searchSessionTTL(), startSearchSessionCleanup(), cleanupPersistedSessions(), SearchSessionResultsResponse, importLegacyJSONSessions(), initSessionStore() (+14 more)

### Community 54 - "ErrorBoundary"
Cohesion: 0.15
Nodes (4): ErrorBoundary, Props, s, State

### Community 55 - "ResultsScreen.tsx"
Cohesion: 0.11
Nodes (30): defaultParams, DynamicDestinationsScreen(), Nav, styles, CheaperCitiesOption, Props, s, bestScore() (+22 more)

### Community 56 - "CanonicalItinerary"
Cohesion: 0.05
Nodes (76): defaultBookingMatchRunner(), corpusText(), domainFromURL(), extractFlightNumbers(), flightNumberInText(), flightNumbersEquivalent(), splitFlightDesignator(), textContainsAirport() (+68 more)

### Community 57 - "DedupeProviderResults"
Cohesion: 0.31
Nodes (7): DedupeProviderResults(), ItineraryFingerprint(), mergeSelfTransfer(), TotalStops(), uniqueStrings(), TestDedupeKeepsCheaper(), TestItineraryFingerprintStable()

### Community 58 - "FlightResultCard.tsx"
Cohesion: 0.30
Nodes (12): c, LegScheduleBlock(), FlightSegment, LayoverSummary, buildLegPreviewSummary(), computeLayovers(), formatDuration(), formatLayoverPreview() (+4 more)

### Community 59 - "api.ts"
Cohesion: 0.15
Nodes (12): AirportCityType, AirportLike, ANYWHERE_CODE, BaggageClass, Carrier, COUNTRY_DEST_PREFIX, ExplorePriceSource, FareBreakdown (+4 more)

### Community 60 - "VerifyCandidate"
Cohesion: 0.23
Nodes (19): cfgTest(), testItineraryOS860(), TestResolver_pipeline_cheapestVerifiedOffer(), TestResolver_pipeline_exactMatch(), TestVerifyCandidate_codeshareOperatingNumber(), TestVerifyCandidate_connectingLegEndToEnd(), TestVerifyCandidate_connectingOneWrongSegment(), TestVerifyCandidate_differentPricesSameItinerary() (+11 more)

### Community 61 - "exploreBuildRowsAndQueue"
Cohesion: 0.13
Nodes (17): airportCoord, exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut(), getAirportCoord() (+9 more)

### Community 62 - "client.ts"
Cohesion: 0.17
Nodes (13): searchAirports(), API_BASE, apiGet(), apiUrl(), isLocalHostname(), IMPORTANT: Expo/Metro statically inlines EXPO_PUBLIC_* only when accessed via, resolveApiBase(), GetDealsRangeParams (+5 more)

### Community 63 - "AppIcon.tsx"
Cohesion: 0.11
Nodes (20): AppIcon(), AppIconLibrary, AppIconProps, styles, ClearableTextInputProps, styles, EditSearchModalProps, s (+12 more)

### Community 64 - "KiwiApifyProvider"
Cohesion: 0.24
Nodes (6): apifyErrorMessage(), flattenKiwiItems(), NewKiwiApifyProvider(), stringField(), truncateStr(), KiwiApifyProvider

### Community 65 - "FiltersPanel.tsx"
Cohesion: 0.25
Nodes (11): AIRLINE_NAMES, getAirlineName(), AIRLINE_FULL_NAMES, NOTE: This is a starter subset of IATA airlines., f, FiltersPanel(), buildRoutePath(), FlightResultCard() (+3 more)

### Community 66 - "ThemeContext.tsx"
Cohesion: 0.09
Nodes (35): FormHeroHeader(), FormHeroHeaderProps, styles, formCardStyles, makeFormThemedStyles(), getPhrasesForLanguage(), SEARCH_BUTTON_PHRASES, SEARCH_PROGRESS_PHRASES (+27 more)

### Community 67 - "gf2_booking_quote.go"
Cohesion: 0.15
Nodes (21): findBookingOptionsArray(), firstPartnerBookingOption(), firstPartnerURLInMap(), firstStringByKeys(), hostFromURL(), isPartnerBookingList(), parseGF2BookingOptions(), partnerRequestTokenFromMap() (+13 more)

### Community 68 - "itinerary_test.go"
Cohesion: 0.21
Nodes (15): AttachCanonicalIdentity(), segTLVJFK(), TestCanonicalItineraryFingerprint_connectingFlight(), TestCanonicalItineraryFingerprint_differentFlightsDoNotCollide(), TestCanonicalItineraryFingerprint_directFlight(), TestCanonicalItineraryFingerprint_excludesPrice(), TestCanonicalItineraryFingerprint_formattingStable(), TestCanonicalItineraryFingerprint_gf2AirlineNameStable() (+7 more)

### Community 69 - "store/index.ts"
Cohesion: 0.18
Nodes (14): ICONS, KEYS, s, SortBarProps, SortOption, defaultFilters, isCurrentSearchGeneration(), searchActions (+6 more)

### Community 70 - "AirportLocation"
Cohesion: 0.16
Nodes (11): AirportLocation(), TestAirportLocation_UnknownFallsBackUTC(), TestParseGF2TimeWithDateHint_AirportLocal(), TestParseGF2TimeWithDateHint_TelAviv(), TestExtractGF2Leg_SingleSegment_DepartArriveDiffer(), TestExtractGF2Leg_TimeOnly_NoDateHint(), TestExtractGF2Leg_TimeOnly_WithDateHint(), TestParseGF2Time_AcceptsFullDateTime() (+3 more)

### Community 71 - "SearchFormScreen.tsx"
Cohesion: 0.35
Nodes (8): defaultParams, SearchFormScreen(), styles, flushActiveAutocomplete(), getCachedSearch(), getStorage(), setCachedSearch(), classicSearchPayload()

### Community 72 - "Registry"
Cohesion: 0.20
Nodes (7): MultiSearchResult, isSkippedProviderErr(), NewRegistryFromEnv(), parseProviderNames(), GoogleFlights2Provider, Provider, Registry

### Community 73 - "skyscanner.ts"
Cohesion: 0.42
Nodes (10): BookingHop, bookingHopsFromOption(), firstSeg(), isClassicRoundTripLegs(), isoDatePrefix(), isSplitBookingItinerary(), lastSeg(), legNeedsSegmentSplit() (+2 more)

### Community 74 - "DateRangePicker.tsx"
Cohesion: 0.36
Nodes (8): buildMonthDays(), DateRangePicker(), DateRangePickerProps, getMonthStart(), monthStartForYmd(), parseYmdUtc(), styles, WEEKDAYS

### Community 76 - "handleExplore"
Cohesion: 0.53
Nodes (5): exploreSessionKey(), getExploreSession(), newExploreSessionID(), putExploreSession(), handleExplore()

### Community 77 - "exchangeRates.ts"
Cohesion: 0.26
Nodes (10): DisplayPrice(), DisplayPriceProps, convertPrice(), CURRENCY_SYMBOLS, CurrencyCode, ensureRates(), fetchRates(), getCurrencySymbol() (+2 more)

### Community 78 - "affiliate.ts"
Cohesion: 0.27
Nodes (9): AffiliateProvider, AffiliateProviderResponse, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink(), OutboundLinkResponse (+1 more)

### Community 79 - "CompleteExtraLegs"
Cohesion: 0.27
Nodes (9): TestCombineOneWayBatches(), TestCombineOneWayBatches_emptyBatch(), TestCombineOneWayBatches_openJawReturnDiversity(), TestCompleteExtraLegs(), TestExtraLegsFingerprint(), CompleteExtraLegs(), ExtraLegsFingerprint(), NormalizeExtraLegs() (+1 more)

### Community 80 - "flyfix.ts"
Cohesion: 0.25
Nodes (8): apiPost(), FlyfixInsightsGroup, FlyfixIssue, FlyfixRefinedReport, FlyfixSummary, refineIssues(), RefineIssuesRequestBody, cancelSearchSession()

### Community 81 - "DatePickerCalendar.tsx"
Cohesion: 0.39
Nodes (7): getDealsRange(), DatePickerCalendar(), DatePickerCalendarProps, getNext14Dates(), getRangeStartEnd(), styles, WEEKDAYS

### Community 82 - "gf2Cache"
Cohesion: 0.20
Nodes (6): newGF2Cache(), sync.RWMutex, gf2Cache, gf2CacheEntry, kiwiCache, kiwiCacheEntry

### Community 83 - "ValidateBookingURL"
Cohesion: 0.23
Nodes (12): classifyURLType(), TestClassifyURLType_genericVsExact(), IsCheckoutBookingURL(), IsNonBookableDomain(), TestIsCheckoutBookingURL_rejectsFlightSearchPages(), TestIsNonBookableDomain_blocksFlightRadar(), TestValidateBookingURL_acceptsHTTPS(), TestValidateBookingURL_rejectsEmpty() (+4 more)

### Community 84 - "TestApplySoftStrictBaggage"
Cohesion: 0.52
Nodes (6): applySoftStrictBaggage(), makeOfferWithBags(), makeOfferWithMissingBags(), TestApplySoftStrictBaggage(), TestClassifyOfferBaggage(), classifyOfferBaggage()

### Community 85 - "FlightOption"
Cohesion: 0.23
Nodes (10): FiltersPanelProps, FlightDetailsModalProps, FlightResultCardProps, PositioningLegResult, FlightOption, countByStopsFilter(), matchesStopsFilter(), maxStopsPerLeg() (+2 more)

### Community 86 - "TestExtractCarrierCodes"
Cohesion: 0.83
Nodes (3): makeOfferWithCarriers(), TestExtractCarrierCodes(), TestPrimaryDisplayCarrier()

### Community 87 - "bookableDates.ts"
Cohesion: 0.54
Nodes (7): initialDatesFromRouteParams(), addDaysYmdUtc(), clampExploreDealsDates(), clampExploreSearchDates(), firstBookableDepartureInMonth(), pad2(), tomorrowYmdUtc()

## Knowledge Gaps
- **281 isolated node(s):** `ClicksByProvider`, `BookingResolveRequest`, `PublicBookingAlternative`, `exploreLiveCandidate`, `flightcaptainweb` (+276 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ProviderResult` connect `ProviderResult` to `KiwiApifyProvider`, `itinerary_test.go`, `SearchRequest`, `kiwi_apify_provider.go`, `GoogleFlights2Provider`, `googleflights2_provider.go`, `multi_provider_test.go`, `context.Context`, `server.go`, `time.Time`, `gf2Cache`, `CanonicalItinerary`, `DedupeProviderResults`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Why does `CanonicalItinerary` connect `CanonicalItinerary` to `booking_resolve.go`, `context.Context`, `server.go`, `matcher_test.go`, `ProviderResult`, `VerifyCandidate`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `CanonicalItineraryFingerprint()` connect `booking_resolve.go` to `itinerary_test.go`, `context.Context`, `canonical.go`, `server.go`, `CanonicalItinerary`, `DedupeProviderResults`, `ProviderResult`, `VerifyCandidate`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `ClicksByProvider`, `BookingResolveRequest`, `PublicBookingAlternative` to the rest of the system?**
  _281 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ExploreScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1349206349206349 - nodes in this community are weakly interconnected._
- **Should `RootNavigator.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09672830725462304 - nodes in this community are weakly interconnected._
- **Should `AirportAutocomplete.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13205128205128205 - nodes in this community are weakly interconnected._