# Graph Report - workspace  (2026-09-01)

## Corpus Check
- 217 files · ~208,339 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1831 nodes · 5099 edges · 77 communities (73 shown, 4 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 443 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3319809e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ExploreScreen.tsx
- RootNavigator.tsx
- AirportAutocomplete.tsx
- Issue
- ResultsScreen.tsx
- MonthDealsScreen.tsx
- dependencies
- useTheme
- Features
- auth.go
- googleflights2_provider.go
- booking_resolve.go
- ui/index.ts
- compilerOptions
- KiwiApifyProvider
- canonical.go
- LocaleContext.tsx
- affiliate.go
- server.go
- time.Time
- qa_runner.py
- ApiClient
- SelectBestOffer
- TestResult
- ResponseValidator
- runtime_config.go
- BuildCanonicalItinerary
- expo
- config_loader.py
- RuntimeConfigContext.tsx
- AuthContext.tsx
- backend_api_contracts.md
- CalendarModal.tsx
- testing.T
- kiwi_apify_provider.go
- ValidationIssue
- Backend QA Automation Tool
- auth.ts
- ProviderResult
- search.ts
- IsOpenJaw
- models.py
- client.ts
- Fly-Fix – Frontend
- write-spa-fallbacks.mjs
- net/http.Request
- metro.config.js
- __init__.py
- flightcaptainweb
- loadSearchSession
- gf2Cache
- DynamicDestinationsScreen.tsx
- CanonicalItinerary
- DateRangePicker.tsx
- AppIcon.tsx
- VerifyCandidate
- exploreBuildRowsAndQueue
- types/index.ts
- FlightDetailsModal.tsx
- DynamicDestinationsFormContent.tsx
- itinerary_test.go
- SortBar.tsx
- ThemeContext.tsx
- Registry
- DraggableBottomSheet.tsx
- handleExplore
- App.tsx
- affiliate.ts
- flyfix.ts
- context.Context
- ValidateBookingURL
- TestApplySoftStrictBaggage
- TestExtractCarrierCodes

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 88 edges
2. `useLocale()` - 79 edges
3. `ProviderResult` - 44 edges
4. `BookingOffer` - 40 edges
5. `MonthDealsScreen()` - 36 edges
6. `ResultsScreen()` - 35 edges
7. `resolveGF2PartnerOffers()` - 32 edges
8. `CanonicalItinerary` - 32 edges
9. `VerifyCandidate()` - 31 edges
10. `CanonicalItineraryFingerprint()` - 30 edges

## Surprising Connections (you probably didn't know these)
- `handleAffiliateOutboundLink()` --calls--> `ResolveProvider()`  [INFERRED]
  backend/server.go → backend/affiliate.go
- `handleAffiliateProvider()` --calls--> `ResolveProvider()`  [INFERRED]
  backend/server.go → backend/affiliate.go
- `handleAffiliateRedirect()` --calls--> `ResolveProvider()`  [INFERRED]
  backend/server.go → backend/affiliate.go
- `handleOutBooking()` --calls--> `ResolveProvider()`  [INFERRED]
  backend/server.go → backend/affiliate.go
- `BuildLegAirlineDirectURL()` --calls--> `marketingCarrierForLeg()`  [INFERRED]
  backend/affiliate.go → backend/booking_gf2_resolve.go

## Import Cycles
- None detected.

## Communities (77 total, 4 thin omitted)

### Community 0 - "ExploreScreen.tsx"
Cohesion: 0.14
Nodes (29): getMonthDeals(), getExploreDestinations(), useRuntimeConfig(), getAirportEntry(), getCityDisplayName(), c, countryFlag(), d (+21 more)

### Community 1 - "RootNavigator.tsx"
Cohesion: 0.09
Nodes (17): ErrorBoundary, Props, s, State, DynamicDestinationsStack(), Stack, MonthDealsStack(), Stack (+9 more)

### Community 2 - "AirportAutocomplete.tsx"
Cohesion: 0.13
Nodes (38): AIRPORT_DICTIONARY, AIRPORT_ONLY_DICTIONARY, FULL_PLACE_DICTIONARY, getAirportDisplayName(), getAirportNameByCode(), lower(), matchesQuery(), PLACE_SEARCH_LIMIT (+30 more)

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "ResultsScreen.tsx"
Cohesion: 0.11
Nodes (37): SearchLoadingOverlay(), bestScore(), CheapestOption, currentGeneration(), defaultFormParams, delay(), HUB_AIRPORTS, PositioningOption (+29 more)

### Community 5 - "MonthDealsScreen.tsx"
Cohesion: 0.09
Nodes (43): buildDealsPositioningSignature(), dealBestScore(), fl, formatDealDate(), hfm, HUB_AIRPORTS, m, MonthDealsScreen() (+35 more)

### Community 6 - "dependencies"
Cohesion: 0.04
Nodes (44): @babel/core, expo, @expo/metro-runtime, expo-status-bar, dependencies, expo, @expo/metro-runtime, expo-status-bar (+36 more)

### Community 7 - "useTheme"
Cohesion: 0.11
Nodes (36): ClearableTextInput(), ClearableTextInputProps, styles, s, SearchSummaryBar(), SearchSummaryBarProps, useAuth(), useLocale() (+28 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (33): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+25 more)

### Community 9 - "auth.go"
Cohesion: 0.19
Nodes (23): authUserJSON(), bootstrapAdminUser(), createAuthSession(), envFlagTrue(), handleAuthLogin(), handleAuthRegister(), handleAuthUsers(), initAuthStore() (+15 more)

### Community 10 - "googleflights2_provider.go"
Cohesion: 0.06
Nodes (68): AirportLocation(), TestAirportLocation_UnknownFallsBackUTC(), TestParseGF2TimeWithDateHint_AirportLocal(), TestParseGF2TimeWithDateHint_TelAviv(), findBookingOptionsArray(), firstPartnerBookingOption(), firstPartnerURLInMap(), firstStringByKeys() (+60 more)

### Community 11 - "booking_resolve.go"
Cohesion: 0.05
Nodes (115): airlineDomainForCarrier(), allocateLegQuoteAmount(), applySearchQuoteToOffer(), attachQuotedPriceMeta(), bookingMatchPriceNormalizer(), dedupeGF2PartnerOffers(), flightLegDurationMinutes(), gf2OffersHavePrice() (+107 more)

### Community 12 - "ui/index.ts"
Cohesion: 0.13
Nodes (32): BookingResolveRequest, BookingResolveResponse, BookingResolveStatus, isSafeBookingUrl(), PublicBookingAlternative, PublicBookingOffer, bookingOfferProviderLabel(), bookingOfferSubtitle() (+24 more)

### Community 13 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+15 more)

### Community 14 - "KiwiApifyProvider"
Cohesion: 0.16
Nodes (9): apifyErrorMessage(), flattenKiwiItems(), NewKiwiApifyProvider(), stringField(), truncateStr(), sync.RWMutex, KiwiApifyProvider, kiwiCache (+1 more)

### Community 15 - "canonical.go"
Cohesion: 0.12
Nodes (41): FlightOption, openJawOption(), TestBookingLinkModeDefaultsToGoogle(), TestBookingRouteFromSessionOption_splitOmitsReturn(), TestBuildGoogleFlightsFallbackFromParams(), TestBuildLegOrSegmentBookingURL_segment(), TestBuildOneWayLegBookingURL(), TestBuildSkyscannerPrefillURL_oneWay() (+33 more)

### Community 16 - "LocaleContext.tsx"
Cohesion: 0.18
Nodes (15): getStorage(), languageToLocale(), loadSaved(), LocaleContext, LocaleContextValue, LocaleProvider(), save(), VALID_CURRENCIES (+7 more)

### Community 17 - "affiliate.go"
Cohesion: 0.17
Nodes (19): BuildLegAirlineDirectURL(), BuildRedirectURL(), getAffiliateID(), GetClicksSummary(), getOTAProvider(), GetSessionAndOption(), FlightOption, SearchSession (+11 more)

### Community 18 - "server.go"
Cohesion: 0.07
Nodes (57): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, Carrier, CarrierCodes, CreateSearchSessionRequest, DayDeal (+49 more)

### Community 19 - "time.Time"
Cohesion: 0.24
Nodes (19): exploreDestRow, FullRoundTrip, attachReturnLegKeepPrice(), ensureRoundTripLegs(), exploreDestRowsToMaps(), gf2ExploreResolveDeps(), gf2ExploreSearchOneDestination(), gf2OneRoundTrip() (+11 more)

### Community 20 - "qa_runner.py"
Cohesion: 0.14
Nodes (13): Namespace, Path, Any, Reporting helpers for test execution results., Render terminal summary and persist machine-readable reports., Print user-friendly report to stdout., Write a JSON report and return its path., ReportWriter (+5 more)

### Community 21 - "ApiClient"
Cohesion: 0.14
Nodes (12): ApiClient, Any, HTTP client utilities for executing API test cases., Parse JSON response when possible without raising., Sleep using exponential backoff., Executes HTTP requests with retry and timing support., Close the underlying requests session., Execute one test case and return a populated result. (+4 more)

### Community 22 - "SelectBestOffer"
Cohesion: 0.18
Nodes (11): floatPtr(), TestSelectBestOffer_cheapestOTAOverAirline(), TestSelectBestOffer_conflictingCandidatesPicksCheapest(), TestSelectBestOffer_missingPrice(), TestSelectBestOffer_multipleMatching(), TestSelectBestOffer_prefersPriceAmongSameURLType(), TestSelectBestOffer_prefersQuoteMatchingPrice(), TestSelectBestOffer_rejectsGenericSearchURL() (+3 more)

### Community 23 - "TestResult"
Cohesion: 0.18
Nodes (8): AI and heuristic quality-control analysis for API test results., Analyze result quality with Ollama and rule-based checks., Close underlying HTTP session., Return human-readable quality notes for this result. Rule-based insights are…, ResponseAnalyzer, Stores execution data and findings for one test case., A test passes when there are no error-level issues., TestResult

### Community 24 - "ResponseValidator"
Cohesion: 0.22
Nodes (5): Any, Applies status, schema, and consistency checks., Run all checks and append issues to the result., Resolve a dotted path in a nested JSON-like payload. Supports indexes like…, ResponseValidator

### Community 25 - "runtime_config.go"
Cohesion: 0.22
Nodes (16): adminAccessConfigured(), configRangeError, adminTokenConfigured(), defaultRuntimeConfig(), errConfigOutOfRange(), getRuntimeConfig(), handleAdminRuntimeConfig(), initRuntimeConfigStore() (+8 more)

### Community 26 - "BuildCanonicalItinerary"
Cohesion: 0.23
Nodes (10): DedupeProviderResults(), ItineraryFingerprint(), mergeSelfTransfer(), TotalStops(), uniqueStrings(), BuildCanonicalItinerary(), sumCanonicalSegmentDurations(), TestFingerprintDebugString_format() (+2 more)

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.32
Nodes (13): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+5 more)

### Community 29 - "RuntimeConfigContext.tsx"
Cohesion: 0.21
Nodes (11): fetchRuntimeConfig(), setRuntimeConfigStore(), RuntimeConfigContext, RuntimeConfigContextValue, RuntimeConfigProvider(), DEFAULT_RUNTIME_CONFIG, RUNTIME_CONFIG_FIELDS, RuntimeConfig (+3 more)

### Community 30 - "AuthContext.tsx"
Cohesion: 0.23
Nodes (14): AuthUser, fetchAuthMe(), loginWithPassword(), logoutSession(), registerAccount(), AdminAuthProvider, applyUser(), AuthContext (+6 more)

### Community 31 - "backend_api_contracts.md"
Cohesion: 0.17
Nodes (11): 1.1 Create Search Session, 1.2 Get Search Session Status & Results, 1.3 Cancel Search Session (Optional, MVP+), 1. Flight Search Sessions, 2.1 Get Monthly Deals, 2. Monthly Deals API, 3.1 Search Airports & Cities, 3. Airport & City Autocomplete (+3 more)

### Community 32 - "CalendarModal.tsx"
Cohesion: 0.38
Nodes (6): buildMonthDays(), CalendarModal(), getMonthStart(), Props, styles, WEEKDAYS

### Community 33 - "testing.T"
Cohesion: 0.08
Nodes (38): TestAllocateLegQuoteAmount_splitOpenJaw(), TestAttachQuotedPriceMeta_detectsMismatch(), TestGF2PartnerOfferFromURL_acceptsHTTPS(), TestGF2PartnerOfferFromURL_rejectsUnsafe(), TestLegDeepLink_rejectsMisalignedPartnerArrays(), TestLegDeepLink_rejectsWrongAirlineDirectCheckout(), TestQuoteBindingFromOption_usesOriginalWhenEstimate(), TestQuoteBindingFromOption_usesStoredLegPrice() (+30 more)

### Community 34 - "kiwi_apify_provider.go"
Cohesion: 0.32
Nodes (15): asArray(), collectCarriers(), detectSelfTransfer(), extractKiwiLegs(), firstFloat(), firstString(), kiwiSegmentFromMap(), mapsToSegments() (+7 more)

### Community 35 - "ValidationIssue"
Cohesion: 0.18
Nodes (7): Any, Serialize nested result for report output., Represents a single validation or analysis finding., Serialize issue to dictionary., Serialize case to dictionary., Append a new issue to this result., ValidationIssue

### Community 36 - "Backend QA Automation Tool"
Cohesion: 0.18
Nodes (10): Backend QA Automation Tool, Features, If the run feels slow or “stuck”, Notes, Optional AI Setup (Ollama), Output, Project Structure, Run (+2 more)

### Community 37 - "auth.ts"
Cohesion: 0.38
Nodes (10): authHeaders(), changePassword(), createUser(), deleteUser(), fetchUsers(), LoginResponse, ManagedUser, updateUser() (+2 more)

### Community 38 - "ProviderResult"
Cohesion: 0.13
Nodes (26): TestCombineOneWayBatches(), TestCombineOneWayBatches_emptyBatch(), TestCombineOneWayBatches_openJawReturnDiversity(), TestCompleteExtraLegs(), TestExtraLegsFingerprint(), TestHasExtraLegs(), TestAttachCanonicalIdentityAll_combineOneWay(), cloneLegs() (+18 more)

### Community 39 - "search.ts"
Cohesion: 0.24
Nodes (16): CachedResult, createSearchSession(), createSearchSessionWithRetry(), fetchFresh(), getFromStorage(), getSearchSessionResults(), getStorage(), isTransientSearchError() (+8 more)

### Community 40 - "IsOpenJaw"
Cohesion: 0.25
Nodes (9): TestIsOpenJaw(), TestResolveReturnAirports_classic(), TestResolveReturnAirports_openJaw(), TestSanitizeStandardSearchRequest(), IsOpenJaw(), ResolveReturnAirports(), TestClassicRoundTrip_usesNativeSearchPath(), TestOpenJaw_usesDecomposedSearchPath() (+1 more)

### Community 41 - "models.py"
Cohesion: 0.25
Nodes (5): Core data models for the API QA runner., Set completion timestamp., Return an ISO-8601 UTC timestamp., utc_now_iso(), Validation rules for API responses.

### Community 42 - "client.ts"
Cohesion: 0.36
Nodes (8): apiRequest(), apiUrl(), isLocalHostname(), IMPORTANT: Expo/Metro statically inlines EXPO_PUBLIC_* only when accessed via, resolveApiBase(), adminAuthHeaders(), fetchAdminRuntimeConfig(), saveAdminRuntimeConfig()

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
Cohesion: 0.22
Nodes (22): loadSearchSession(), TestLoadSearchSession_Expiry(), searchSessionTTL(), startSearchSessionCleanup(), cleanupPersistedSessions(), SearchSessionResultsResponse, importLegacyJSONSessions(), initSessionStore() (+14 more)

### Community 54 - "gf2Cache"
Cohesion: 0.40
Nodes (3): newGF2Cache(), gf2Cache, gf2CacheEntry

### Community 55 - "DynamicDestinationsScreen.tsx"
Cohesion: 0.13
Nodes (25): DynamicDestinationsFormContentProps, defaultParams, DynamicDestinationsScreen(), Nav, styles, defaultFilters, isCurrentSearchGeneration(), searchActions (+17 more)

### Community 56 - "CanonicalItinerary"
Cohesion: 0.06
Nodes (72): corpusText(), domainFromURL(), extractFlightNumbers(), flightNumberInText(), flightNumbersEquivalent(), splitFlightDesignator(), textContainsAirport(), textContainsAny() (+64 more)

### Community 57 - "DateRangePicker.tsx"
Cohesion: 0.36
Nodes (8): buildMonthDays(), DateRangePicker(), DateRangePickerProps, getMonthStart(), monthStartForYmd(), parseYmdUtc(), styles, WEEKDAYS

### Community 58 - "AppIcon.tsx"
Cohesion: 0.07
Nodes (29): AppIcon(), AppIconLibrary, AppIconProps, styles, EditSearchModal(), EditSearchModalProps, s, HubRouteLeg (+21 more)

### Community 60 - "VerifyCandidate"
Cohesion: 0.18
Nodes (28): extractPrice(), cfgTest(), testConnectingTLVJFK(), TestExtractPrice_euroPrefixNotArrivalTime(), TestGenerateQueries_connecting(), TestGenerateQueries_direct(), TestGenerateQueries_gf2AirlineNameIdentity(), TestGenerateQueries_includesRouteDateBookQuery() (+20 more)

### Community 61 - "exploreBuildRowsAndQueue"
Cohesion: 0.12
Nodes (19): airportCoord, exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut(), getAirportCoord() (+11 more)

### Community 62 - "types/index.ts"
Cohesion: 0.07
Nodes (35): searchAirports(), apiGet(), getDealsRange(), GetDealsRangeParams, GetMonthDealsParams, ExploreResponse, GetExploreDestinationsParams, getFlightDetails() (+27 more)

### Community 65 - "FlightDetailsModal.tsx"
Cohesion: 0.05
Nodes (75): resolveBookingOffer(), DisplayPrice(), DisplayPriceProps, AIRLINE_NAMES, getAirlineName(), AIRLINE_FULL_NAMES, NOTE: This is a starter subset of IATA airlines., airportTimeZones (+67 more)

### Community 66 - "DynamicDestinationsFormContent.tsx"
Cohesion: 0.19
Nodes (16): FormHeroHeader(), FormHeroHeaderProps, styles, formCardStyles, makeFormThemedStyles(), SearchSubmitButton(), SearchSubmitButtonProps, styles (+8 more)

### Community 68 - "itinerary_test.go"
Cohesion: 0.21
Nodes (15): AttachCanonicalIdentity(), segTLVJFK(), TestCanonicalItineraryFingerprint_connectingFlight(), TestCanonicalItineraryFingerprint_differentFlightsDoNotCollide(), TestCanonicalItineraryFingerprint_directFlight(), TestCanonicalItineraryFingerprint_excludesPrice(), TestCanonicalItineraryFingerprint_formattingStable(), TestCanonicalItineraryFingerprint_gf2AirlineNameStable() (+7 more)

### Community 69 - "SortBar.tsx"
Cohesion: 0.20
Nodes (9): KEYS, s, SortBar(), SortBarProps, SortOption, SortField, Chip(), ChipProps (+1 more)

### Community 70 - "ThemeContext.tsx"
Cohesion: 0.11
Nodes (19): getPhrasesForLanguage(), SEARCH_BUTTON_PHRASES, SEARCH_PROGRESS_PHRASES, s, SearchProgressBanner(), SearchProgressBannerProps, ExtraLeg, Props (+11 more)

### Community 72 - "Registry"
Cohesion: 0.20
Nodes (7): MultiSearchResult, isSkippedProviderErr(), NewRegistryFromEnv(), parseProviderNames(), GoogleFlights2Provider, Provider, Registry

### Community 76 - "handleExplore"
Cohesion: 0.20
Nodes (13): exploreSessionKey(), getExploreSession(), newExploreSessionID(), putExploreSession(), startExploreSessionCleanup(), exploreSession, corsMiddleware(), fetchExchangeRates() (+5 more)

### Community 77 - "App.tsx"
Cohesion: 0.33
Nodes (6): App(), linking, RTLWrapper(), API_BASE, useExchangeRates(), ThemeProvider()

### Community 78 - "affiliate.ts"
Cohesion: 0.27
Nodes (9): AffiliateProvider, AffiliateProviderResponse, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink(), OutboundLinkResponse (+1 more)

### Community 80 - "flyfix.ts"
Cohesion: 0.25
Nodes (8): apiPost(), FlyfixInsightsGroup, FlyfixIssue, FlyfixRefinedReport, FlyfixSummary, refineIssues(), RefineIssuesRequestBody, cancelSearchSession()

### Community 82 - "context.Context"
Cohesion: 0.19
Nodes (10): GoogleFlights2Provider, newGF2RateLimiter(), NewGoogleFlights2Provider(), truncateGF2(), SearchRequest, HasExtraLegs(), SanitizeStandardSearchRequest(), context.Context (+2 more)

### Community 83 - "ValidateBookingURL"
Cohesion: 0.22
Nodes (13): gf2CheckoutOffers(), classifyURLType(), TestClassifyURLType_genericVsExact(), IsCheckoutBookingURL(), IsNonBookableDomain(), TestIsCheckoutBookingURL_rejectsFlightSearchPages(), TestIsNonBookableDomain_blocksFlightRadar(), TestValidateBookingURL_acceptsHTTPS() (+5 more)

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

- **Why does `CanonicalItinerary` connect `CanonicalItinerary` to `ProviderResult`, `googleflights2_provider.go`, `booking_resolve.go`, `server.go`, `context.Context`, `BuildCanonicalItinerary`, `VerifyCandidate`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Why does `ProviderResult` connect `ProviderResult` to `kiwi_apify_provider.go`, `itinerary_test.go`, `googleflights2_provider.go`, `KiwiApifyProvider`, `canonical.go`, `server.go`, `time.Time`, `context.Context`, `gf2Cache`, `CanonicalItinerary`, `BuildCanonicalItinerary`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Why does `resolveGF2PartnerOffers()` connect `booking_resolve.go` to `googleflights2_provider.go`, `canonical.go`, `affiliate.go`, `context.Context`, `CanonicalItinerary`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **What connects `ClicksByProvider`, `BookingResolveRequest`, `PublicBookingAlternative` to the rest of the system?**
  _286 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ExploreScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1350806451612903 - nodes in this community are weakly interconnected._
- **Should `RootNavigator.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09462365591397849 - nodes in this community are weakly interconnected._
- **Should `AirportAutocomplete.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12684989429175475 - nodes in this community are weakly interconnected._