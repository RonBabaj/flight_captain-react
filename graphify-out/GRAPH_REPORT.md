# Graph Report - workspace  (2026-08-31)

## Corpus Check
- 217 files · ~207,387 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1824 nodes · 5065 edges · 83 communities (79 shown, 4 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 437 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a263cb1e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ExploreScreen.tsx
- RootNavigator.tsx
- placeSearch.ts
- Issue
- useSearchParams.ts
- MonthDealsScreen
- dependencies
- useTheme
- Features
- initTestAuthDB
- googleflights2_provider.go
- BookingOffer
- ui/index.ts
- compilerOptions
- gf2_booking_quote.go
- canonical.go
- LocaleContext.tsx
- affiliate.go
- server.go
- context.Context
- qa_runner.py
- ApiClient
- matcher_test.go
- TestResult
- ResponseValidator
- runtime_config.go
- ProviderResult
- expo
- config_loader.py
- RuntimeConfigContext.tsx
- AuthContext.tsx
- backend_api_contracts.md
- CalendarModal.tsx
- testing.T
- booking_gf2_resolve.go
- ValidationIssue
- Backend QA Automation Tool
- SearchRequest
- kiwi_apify_provider.go
- search.ts
- booking_resolve.go
- models.py
- runBookingMatch
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
- MonthDealsScreen.tsx
- api.ts
- VerifyCandidate
- exploreBuildRowsAndQueue
- client.ts
- AppIcon.tsx
- dealsCache.ts
- FlightDetailsModal.tsx
- DynamicDestinationsFormContent.tsx
- AirportAutocomplete.tsx
- itinerary_test.go
- ThemeContext.tsx
- SearchLoadingOverlay.tsx
- SearchFormScreen.tsx
- Registry
- DraggableBottomSheet.tsx
- handleExplore
- App.tsx
- affiliate.ts
- flyfix.ts
- DatePickerCalendar.tsx
- gf2Cache
- ValidateBookingURL
- TestApplySoftStrictBaggage
- TestExtractCarrierCodes

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 88 edges
2. `useLocale()` - 79 edges
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

## Communities (83 total, 4 thin omitted)

### Community 0 - "ExploreScreen.tsx"
Cohesion: 0.13
Nodes (31): getMonthDeals(), getExploreDestinations(), useRuntimeConfig(), getAirportEntry(), getCityDisplayName(), c, countryFlag(), d (+23 more)

### Community 1 - "RootNavigator.tsx"
Cohesion: 0.11
Nodes (24): SearchFormScreen(), DynamicDestinationsStack(), Stack, MonthDealsStack(), Stack, RootNavigator(), Stack, SearchStack() (+16 more)

### Community 2 - "placeSearch.ts"
Cohesion: 0.14
Nodes (32): AIRPORT_DICTIONARY, AIRPORT_ONLY_DICTIONARY, FULL_PLACE_DICTIONARY, getAirportDisplayName(), getAirportNameByCode(), lower(), matchesQuery(), PLACE_SEARCH_LIMIT (+24 more)

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "useSearchParams.ts"
Cohesion: 0.24
Nodes (15): buildSearchString(), getParam(), getParams(), isWeb(), parseSearchParamsFromUrl(), SearchUrlState, updateSearchUrl(), useSearchParams() (+7 more)

### Community 5 - "MonthDealsScreen"
Cohesion: 0.09
Nodes (28): GetDealsRangeParams, GetMonthDealsParams, SortBarProps, buildDealsPositioningSignature(), formatDealDate(), MonthDealsScreen(), parseDealYmdToUTCDate(), toYmdUTC() (+20 more)

### Community 6 - "dependencies"
Cohesion: 0.04
Nodes (44): @babel/core, expo, @expo/metro-runtime, expo-status-bar, dependencies, expo, @expo/metro-runtime, expo-status-bar (+36 more)

### Community 7 - "useTheme"
Cohesion: 0.11
Nodes (36): EditSearchModal(), HubRouteSummaryModal(), SearchSummaryBar(), SearchLoadingOverlay(), useAuth(), useLocale(), useRuntimeConfigActions(), AdminRuntimeConfigPanel() (+28 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (33): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+25 more)

### Community 9 - "initTestAuthDB"
Cohesion: 0.23
Nodes (15): handleAuthLogin(), initAuthStore(), initTestAuthDB(), randomTestPassword(), TestAuthLoginAndChangePassword(), TestAuthRegister(), TestAuthUserManagement(), TestBootstrapAdminPasswordSync() (+7 more)

### Community 10 - "googleflights2_provider.go"
Cohesion: 0.12
Nodes (35): AirportLocation(), TestAirportLocation_UnknownFallsBackUTC(), TestParseGF2TimeWithDateHint_AirportLocal(), TestParseGF2TimeWithDateHint_TelAviv(), TestExtractGF2BookingURL(), TestExtractGF2Leg_SingleSegment_DepartArriveDiffer(), TestExtractGF2Leg_TimeOnly_NoDateHint(), TestExtractGF2Leg_TimeOnly_WithDateHint() (+27 more)

### Community 11 - "BookingOffer"
Cohesion: 0.15
Nodes (31): bookingMatchPriceNormalizer(), PublicBookingAlternative, isAffiliateTemplateBookingURL(), marketingCarrierForLegIndex(), normalizedGF2OfferPrice(), preferAirlineDirectWhenCheaperThanMarkedUpOTA(), publicAlternativesFromOffers(), collectVerifiedBookingOffers() (+23 more)

### Community 12 - "ui/index.ts"
Cohesion: 0.13
Nodes (30): BookingResolveRequest, BookingResolveResponse, BookingResolveStatus, isSafeBookingUrl(), PublicBookingAlternative, PublicBookingOffer, bookingOfferProviderLabel(), bookingOfferSubtitle() (+22 more)

### Community 13 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+15 more)

### Community 14 - "gf2_booking_quote.go"
Cohesion: 0.18
Nodes (21): resolveAllPartnerBookingsFromTokenWithRetry(), findBookingOptionsArray(), firstPartnerBookingOption(), firstPartnerURLInMap(), firstStringByKeys(), GoogleFlights2Provider, ResolvedPartnerBooking, isPartnerBookingList() (+13 more)

### Community 15 - "canonical.go"
Cohesion: 0.13
Nodes (38): FlightOption, openJawOption(), TestBookingLinkModeDefaultsToGoogle(), TestBookingRouteFromSessionOption_splitOmitsReturn(), TestBuildGoogleFlightsFallbackFromParams(), TestBuildLegOrSegmentBookingURL_segment(), TestBuildOneWayLegBookingURL(), TestBuildSkyscannerPrefillURL_oneWay() (+30 more)

### Community 16 - "LocaleContext.tsx"
Cohesion: 0.18
Nodes (17): getStorage(), languageToLocale(), loadSaved(), LocaleContext, LocaleContextValue, LocaleProvider(), save(), VALID_CURRENCIES (+9 more)

### Community 17 - "affiliate.go"
Cohesion: 0.13
Nodes (24): BuildLegAirlineDirectURL(), BuildRedirectURL(), getAffiliateID(), GetClicksSummary(), getOTAProvider(), GetSessionAndOption(), FlightOption, SearchSession (+16 more)

### Community 18 - "server.go"
Cohesion: 0.07
Nodes (59): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, Carrier, CarrierCodes, CreateSearchSessionRequest, DayDeal (+51 more)

### Community 19 - "context.Context"
Cohesion: 0.12
Nodes (30): mergeExplorePriceRows(), exploreDestRow, exploreSession, FullRoundTrip, attachReturnLegKeepPrice(), ensureRoundTripLegs(), exploreDestRowsToMaps(), exploreRunLiveBatch() (+22 more)

### Community 20 - "qa_runner.py"
Cohesion: 0.14
Nodes (13): Namespace, Path, Any, Reporting helpers for test execution results., Render terminal summary and persist machine-readable reports., Print user-friendly report to stdout., Write a JSON report and return its path., ReportWriter (+5 more)

### Community 21 - "ApiClient"
Cohesion: 0.14
Nodes (12): ApiClient, Any, HTTP client utilities for executing API test cases., Parse JSON response when possible without raising., Sleep using exponential backoff., Executes HTTP requests with retry and timing support., Close the underlying requests session., Execute one test case and return a populated result. (+4 more)

### Community 22 - "matcher_test.go"
Cohesion: 0.14
Nodes (22): extractPrice(), floatPtr(), testConnectingTLVJFK(), TestExtractPrice_euroPrefixNotArrivalTime(), TestFlightNumbersEquivalent_leadingZeros(), TestGenerateQueries_connecting(), TestGenerateQueries_direct(), TestGenerateQueries_gf2AirlineNameIdentity() (+14 more)

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
Cohesion: 0.13
Nodes (27): TestCombineOneWayBatches(), TestCombineOneWayBatches_emptyBatch(), TestCombineOneWayBatches_openJawReturnDiversity(), TestCompleteExtraLegs(), TestExtraLegsFingerprint(), TestHasExtraLegs(), TestAttachCanonicalIdentityAll_combineOneWay(), cloneLegs() (+19 more)

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.32
Nodes (13): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+5 more)

### Community 29 - "RuntimeConfigContext.tsx"
Cohesion: 0.18
Nodes (15): apiRequest(), adminAuthHeaders(), fetchAdminRuntimeConfig(), fetchRuntimeConfig(), saveAdminRuntimeConfig(), setRuntimeConfigStore(), RuntimeConfigContext, RuntimeConfigContextValue (+7 more)

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
Cohesion: 0.10
Nodes (33): hostFromURL(), selectBookingOptionForQuote(), TestExtractGF2BookingToken(), TestFirstNonEmpty(), TestIsLikelyPartnerCheckoutURL(), TestParseGF2BookingOptions(), TestParseGF2BookingOptions_rapidAPIPartnerList(), TestPricesMatchQuote() (+25 more)

### Community 34 - "booking_gf2_resolve.go"
Cohesion: 0.11
Nodes (41): airlineDomainForCarrier(), allocateLegQuoteAmount(), applySearchQuoteToOffer(), attachQuotedPriceMeta(), dedupeGF2PartnerOffers(), flightLegDurationMinutes(), gf2OffersHavePrice(), gf2PartnerOfferFromQuoteURL() (+33 more)

### Community 35 - "ValidationIssue"
Cohesion: 0.18
Nodes (7): Any, Serialize nested result for report output., Represents a single validation or analysis finding., Serialize issue to dictionary., Serialize case to dictionary., Append a new issue to this result., ValidationIssue

### Community 36 - "Backend QA Automation Tool"
Cohesion: 0.18
Nodes (10): Backend QA Automation Tool, Features, If the run feels slow or “stuck”, Notes, Optional AI Setup (Ollama), Output, Project Structure, Run (+2 more)

### Community 37 - "SearchRequest"
Cohesion: 0.21
Nodes (12): TestIsOpenJaw(), TestResolveReturnAirports_classic(), TestResolveReturnAirports_openJaw(), TestSanitizeStandardSearchRequest(), SearchRequest, HasExtraLegs(), IsOpenJaw(), ResolveReturnAirports() (+4 more)

### Community 38 - "kiwi_apify_provider.go"
Cohesion: 0.13
Nodes (23): apifyErrorMessage(), asArray(), collectCarriers(), detectSelfTransfer(), extractKiwiLegs(), firstFloat(), firstString(), flattenKiwiItems() (+15 more)

### Community 39 - "search.ts"
Cohesion: 0.22
Nodes (17): CachedResult, createSearchSession(), createSearchSessionWithRetry(), fetchFresh(), getFromStorage(), getSearchSessionResults(), getStorage(), isTransientSearchError() (+9 more)

### Community 40 - "booking_resolve.go"
Cohesion: 0.14
Nodes (29): acquireBookingResolveSlot(), beginInflightResolve(), bookingOfferInGF2Sources(), bookingOfferSameURL(), bookingResolveCacheKey(), bookingResolveMaxConcurrentFromEnv(), cacheTTLForStatus(), envDurationMinutes() (+21 more)

### Community 41 - "models.py"
Cohesion: 0.25
Nodes (5): Core data models for the API QA runner., Set completion timestamp., Return an ISO-8601 UTC timestamp., utc_now_iso(), Validation rules for API responses.

### Community 42 - "runBookingMatch"
Cohesion: 0.19
Nodes (18): intPtrOrNil(), legRouteLabel(), TestCanonicalItineraryForOption_isolatesSplitLegs(), runBookingMatch(), TestHandleBookingResolve_invalidItinerary(), TestHandleBookingResolve_prefillFallback(), TestHandleBookingResolve_searchUnavailable(), TestHandleBookingResolve_verified() (+10 more)

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
Cohesion: 0.12
Nodes (27): defaultParams, DynamicDestinationsScreen(), Nav, styles, ResultsSkeletonList(), sk, bestScore(), CheapestOption (+19 more)

### Community 56 - "CanonicalItinerary"
Cohesion: 0.05
Nodes (77): canonicalItineraryForOption(), defaultBookingMatchRunner(), mustCanonicalForLog(), corpusText(), domainFromURL(), extractFlightNumbers(), flightNumberInText(), flightNumbersEquivalent() (+69 more)

### Community 57 - "DedupeProviderResults"
Cohesion: 0.24
Nodes (8): DedupeProviderResults(), ItineraryFingerprint(), mergeSelfTransfer(), TotalStops(), uniqueStrings(), TestDedupeKeepsCheaper(), TestItineraryFingerprintStable(), MultiSearchResult

### Community 58 - "MonthDealsScreen.tsx"
Cohesion: 0.13
Nodes (16): HubRouteLeg, HubRouteSummaryModalProps, s, CheaperCitiesOption, Props, s, dealBestScore(), fl (+8 more)

### Community 59 - "api.ts"
Cohesion: 0.12
Nodes (15): ExploreResponse, GetExploreDestinationsParams, DestCardProps, AirportCitySearchResponse, AirportCityType, AirportLike, BaggageClass, Carrier (+7 more)

### Community 60 - "VerifyCandidate"
Cohesion: 0.23
Nodes (19): cfgTest(), testItineraryOS860(), TestResolver_pipeline_cheapestVerifiedOffer(), TestResolver_pipeline_exactMatch(), TestVerifyCandidate_codeshareOperatingNumber(), TestVerifyCandidate_connectingLegEndToEnd(), TestVerifyCandidate_connectingOneWrongSegment(), TestVerifyCandidate_differentPricesSameItinerary() (+11 more)

### Community 61 - "exploreBuildRowsAndQueue"
Cohesion: 0.13
Nodes (17): airportCoord, exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut(), getAirportCoord() (+9 more)

### Community 62 - "client.ts"
Cohesion: 0.24
Nodes (9): searchAirports(), apiGet(), apiUrl(), isLocalHostname(), IMPORTANT: Expo/Metro statically inlines EXPO_PUBLIC_* only when accessed via, resolveApiBase(), getFlightDetails(), GetFlightDetailsParams (+1 more)

### Community 63 - "AppIcon.tsx"
Cohesion: 0.12
Nodes (14): AppIconLibrary, AppIconProps, styles, EditSearchModalProps, s, s, SearchSummaryBarProps, getSvgMarkup() (+6 more)

### Community 64 - "dealsCache.ts"
Cohesion: 0.30
Nodes (13): clearPendingDealsParams(), DealsParams, dealsParamsFingerprint(), getCachedDealsResults(), getLocalStorage(), getPendingDealsParams(), getSessionStorage(), migrateLegacySessionParams() (+5 more)

### Community 65 - "FlightDetailsModal.tsx"
Cohesion: 0.05
Nodes (73): resolveBookingOffer(), DisplayPrice(), DisplayPriceProps, AIRLINE_NAMES, getAirlineName(), AIRLINE_FULL_NAMES, NOTE: This is a starter subset of IATA airlines., airportTimeZones (+65 more)

### Community 66 - "DynamicDestinationsFormContent.tsx"
Cohesion: 0.15
Nodes (23): AppIcon(), FormHeroHeader(), FormHeroHeaderProps, styles, formCardStyles, makeFormThemedStyles(), SearchSubmitButton(), SearchSubmitButtonProps (+15 more)

### Community 67 - "AirportAutocomplete.tsx"
Cohesion: 0.19
Nodes (10): ClearableTextInput(), ClearableTextInputProps, styles, AirportAutocompleteProps, CountrySelectMode, styles, AirportInput(), Props (+2 more)

### Community 68 - "itinerary_test.go"
Cohesion: 0.21
Nodes (15): AttachCanonicalIdentity(), segTLVJFK(), TestCanonicalItineraryFingerprint_connectingFlight(), TestCanonicalItineraryFingerprint_differentFlightsDoNotCollide(), TestCanonicalItineraryFingerprint_directFlight(), TestCanonicalItineraryFingerprint_excludesPrice(), TestCanonicalItineraryFingerprint_formattingStable(), TestCanonicalItineraryFingerprint_gf2AirlineNameStable() (+7 more)

### Community 69 - "ThemeContext.tsx"
Cohesion: 0.13
Nodes (13): KEYS, s, SortOption, ACCENT, darkTheme, lightTheme, RADIUS, ThemeContext (+5 more)

### Community 70 - "SearchLoadingOverlay.tsx"
Cohesion: 0.23
Nodes (10): getPhrasesForLanguage(), SEARCH_BUTTON_PHRASES, SEARCH_PROGRESS_PHRASES, s, SearchProgressBanner(), SearchProgressBannerProps, ExtraLeg, Props (+2 more)

### Community 71 - "SearchFormScreen.tsx"
Cohesion: 0.22
Nodes (11): DynamicDestinationsFormContentProps, PassengerCabinPickerProps, SearchFormContentProps, defaultParams, styles, ANYWHERE_CODE, CreateSearchSessionRequest, getCachedSearch() (+3 more)

### Community 72 - "Registry"
Cohesion: 0.20
Nodes (7): MultiSearchResult, isSkippedProviderErr(), NewRegistryFromEnv(), parseProviderNames(), GoogleFlights2Provider, Provider, Registry

### Community 76 - "handleExplore"
Cohesion: 0.53
Nodes (5): exploreSessionKey(), getExploreSession(), newExploreSessionID(), putExploreSession(), handleExplore()

### Community 77 - "App.tsx"
Cohesion: 0.20
Nodes (11): App(), linking, RTLWrapper(), API_BASE, useExchangeRates(), ThemeProvider(), CURRENCY_SYMBOLS, CurrencyCode (+3 more)

### Community 78 - "affiliate.ts"
Cohesion: 0.27
Nodes (9): AffiliateProvider, AffiliateProviderResponse, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink(), OutboundLinkResponse (+1 more)

### Community 80 - "flyfix.ts"
Cohesion: 0.25
Nodes (8): apiPost(), FlyfixInsightsGroup, FlyfixIssue, FlyfixRefinedReport, FlyfixSummary, refineIssues(), RefineIssuesRequestBody, cancelSearchSession()

### Community 81 - "DatePickerCalendar.tsx"
Cohesion: 0.33
Nodes (8): getDealsRange(), DatePickerCalendar(), DatePickerCalendarProps, getNext14Dates(), getRangeStartEnd(), styles, WEEKDAYS, DayDeal

### Community 82 - "gf2Cache"
Cohesion: 0.29
Nodes (5): newGF2Cache(), newGF2RateLimiter(), NewGoogleFlights2Provider(), gf2Cache, gf2CacheEntry

### Community 83 - "ValidateBookingURL"
Cohesion: 0.23
Nodes (12): classifyURLType(), TestClassifyURLType_genericVsExact(), IsCheckoutBookingURL(), IsNonBookableDomain(), TestIsCheckoutBookingURL_rejectsFlightSearchPages(), TestIsNonBookableDomain_blocksFlightRadar(), TestValidateBookingURL_acceptsHTTPS(), TestValidateBookingURL_rejectsEmpty() (+4 more)

### Community 84 - "TestApplySoftStrictBaggage"
Cohesion: 0.52
Nodes (6): applySoftStrictBaggage(), makeOfferWithBags(), makeOfferWithMissingBags(), TestApplySoftStrictBaggage(), TestClassifyOfferBaggage(), classifyOfferBaggage()

### Community 86 - "TestExtractCarrierCodes"
Cohesion: 0.83
Nodes (3): makeOfferWithCarriers(), TestExtractCarrierCodes(), TestPrimaryDisplayCarrier()

## Knowledge Gaps
- **286 isolated node(s):** `ClicksByProvider`, `BookingResolveRequest`, `PublicBookingAlternative`, `exploreLiveCandidate`, `flightcaptainweb` (+281 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ProviderResult` connect `ProviderResult` to `testing.T`, `itinerary_test.go`, `SearchRequest`, `kiwi_apify_provider.go`, `googleflights2_provider.go`, `gf2_booking_quote.go`, `server.go`, `context.Context`, `gf2Cache`, `CanonicalItinerary`, `DedupeProviderResults`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Why does `CanonicalItinerary` connect `CanonicalItinerary` to `booking_gf2_resolve.go`, `runBookingMatch`, `BookingOffer`, `gf2_booking_quote.go`, `server.go`, `matcher_test.go`, `ProviderResult`, `VerifyCandidate`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `BookingOffer` connect `BookingOffer` to `booking_gf2_resolve.go`, `booking_resolve.go`, `context.Context`, `matcher_test.go`, `CanonicalItinerary`, `VerifyCandidate`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `ClicksByProvider`, `BookingResolveRequest`, `PublicBookingAlternative` to the rest of the system?**
  _286 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ExploreScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1265597147950089 - nodes in this community are weakly interconnected._
- **Should `RootNavigator.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10606060606060606 - nodes in this community are weakly interconnected._
- **Should `placeSearch.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._