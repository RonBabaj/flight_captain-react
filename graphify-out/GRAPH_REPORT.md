# Graph Report - workspace  (2026-10-03)

## Corpus Check
- 234 files · ~222,697 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: (none) 7, .mdc 2, .example 2)

## Summary
- 2073 nodes · 6707 edges · 84 communities (71 shown, 13 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 499 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `257e773d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- context.Context
- react
- useSearchParams.ts
- Issue
- FiltersPanel.tsx
- dealsCache.ts
- package.json
- ThemeContext.tsx
- Features
- handleExplore
- AirportLocation
- AppIcon.tsx
- BookingOptionsFooter.tsx
- compilerOptions
- KiwiApifyProvider
- canonical_booking_test.go
- MonthDealsScreen.tsx
- googleflights2_provider.go
- server.go
- kiwi_apify_provider.go
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
- searcher.go
- AttachCanonicalIdentity
- CanonicalSegment
- testing.T
- explore_cache.go
- ValidationIssue
- Backend QA Automation Tool
- isSkippedProviderErr
- search.ts
- skyscanner.ts
- ExploreScreen.tsx
- Fly-Fix – Frontend
- destinationMood.test.ts
- auth.go
- auth_test.go
- main
- flightcaptainweb
- session_store.go
- Nginx Proxy Manager — fly-fix TLS checklist
- ResultsScreen.tsx
- booking_resolve.go
- .finalize
- useTheme
- LocaleContext.tsx
- DateRangePicker.tsx
- ProviderResult
- client.ts
- SelectBestOffer
- SearchLoadingOverlay.tsx
- GF2SearchAirports
- FlightDetailsModal.tsx
- AuthContext.tsx
- Registry
- BuildCanonicalItinerary
- server_carrier_test.go
- time.Time
- flyfix.ts
- exchangeRates.ts
- affiliate.ts
- DatePickerCalendar.tsx
- FlightResultCard.tsx
- affiliate.go
- Fly-Fix UI / UX
- TestApplySoftStrictBaggage
- 5. Guarantees to the Frontend
- newGF2Cache
- booking_resolve_test.go
- booking.ts

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 90 edges
2. `useLocale()` - 82 edges
3. `react` - 63 edges
4. `ResultsScreen()` - 57 edges
5. `react-native` - 56 edges
6. `ProviderResult` - 53 edges
7. `AppIcon()` - 50 edges
8. `MonthDealsScreen()` - 48 edges
9. `BookingOffer` - 40 edges
10. `resolveGF2PartnerOffers()` - 33 edges

## Surprising Connections (you probably didn't know these)
- `Search form` --references--> `DestinationMoodBanner()`  [INFERRED]
  .cursor/skills/flyfix-ui-ux/SKILL.md → frontend/src/components/DestinationMoodBanner.tsx
- `Cheaper departure cities (positioning optimizer)` --references--> `CheaperCitiesSection()`  [INFERRED]
  README.md → frontend/src/features/flight-search/components/CheaperCitiesSection.tsx
- `Results` --references--> `SortBar()`  [INFERRED]
  .cursor/skills/flyfix-ui-ux/SKILL.md → frontend/src/features/flight-search/components/SortBar.tsx
- `1.2 Get Search Session Status & Results` --references--> `FlightOption`  [INFERRED]
  backend/backend_api_contracts.md → frontend/src/types/api.ts
- `Recent enhancements` --references--> `AppIcon()`  [INFERRED]
  README.md → frontend/src/components/AppIcon.tsx

## Import Cycles
- None detected.

## Communities (84 total, 13 thin omitted)

### Community 0 - "context.Context"
Cohesion: 0.12
Nodes (27): applySearchQuoteToOffer(), optionVendorFromQuote(), findBookingOptionsArray(), firstPartnerBookingOption(), firstPartnerURLInMap(), firstStringByKeys(), GoogleFlights2Provider, QuoteBinding (+19 more)

### Community 1 - "react"
Cohesion: 0.06
Nodes (45): App(), linking, RTLWrapper(), styles, ErrorBoundary, Props, s, State (+37 more)

### Community 2 - "useSearchParams.ts"
Cohesion: 0.11
Nodes (33): buildSearchString(), getParam(), getParams(), isWeb(), parseSearchParamsFromUrl(), SearchUrlState, updateSearchUrl(), useSearchParams() (+25 more)

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "FiltersPanel.tsx"
Cohesion: 0.14
Nodes (22): AIRLINE_NAMES, getAirlineName(), resolveAirlineLabel(), AIRLINE_FULL_NAMES, f, FiltersPanel(), FiltersPanelProps, FlightDetailsModalProps (+14 more)

### Community 5 - "dealsCache.ts"
Cohesion: 0.23
Nodes (16): DealsState, MonthDealsResponse, CachedDealsResults, clearPendingDealsParams(), DealsParams, dealsParamsFingerprint(), getCachedDealsResults(), getLocalStorage() (+8 more)

### Community 6 - "package.json"
Cohesion: 0.05
Nodes (40): config, { getDefaultConfig }, dependencies, expo, @expo/metro-runtime, expo-status-bar, react, react-dom (+32 more)

### Community 7 - "ThemeContext.tsx"
Cohesion: 0.08
Nodes (43): ClearableTextInput(), ClearableTextInputProps, styles, useAuth(), useRuntimeConfig(), useRuntimeConfigActions(), AdminRuntimeConfigPanel(), ConfigFieldRow() (+35 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (33): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+25 more)

### Community 9 - "handleExplore"
Cohesion: 0.18
Nodes (11): exploreSessionKey(), getExploreSession(), newExploreSessionID(), putExploreSession(), startExploreSessionCleanup(), exploreSession, corsMiddleware(), fetchExchangeRates() (+3 more)

### Community 10 - "AirportLocation"
Cohesion: 0.11
Nodes (19): AirportLocation(), TestAirportLocation_UnknownFallsBackUTC(), TestParseGF2TimeWithDateHint_TelAviv(), TestParseGF2TimeWithDateHint_ZSuffixWallClock(), TestParseGF2Time_EuropeanDateFormat(), TestExtractGF2Leg_SingleSegment_DepartArriveDiffer(), TestExtractGF2Leg_TimeOnly_WithDateHint(), TestParseGF2Time_AcceptsFullDateTime() (+11 more)

### Community 11 - "AppIcon.tsx"
Cohesion: 0.13
Nodes (16): AppIconLibrary, AppIconProps, styles, HubRouteLeg, HubRouteSummaryModalProps, s, getSvgMarkup(), getWebIconSvgDataUri() (+8 more)

### Community 12 - "BookingOptionsFooter.tsx"
Cohesion: 0.15
Nodes (30): BookingResolveResponse, isSafeBookingUrl(), PublicBookingOffer, bookingOfferProviderLabel(), bookingOfferSubtitle(), formatBookingOfferPriceAmount(), formatBookingOfferPriceLine(), formatProviderDisplayName() (+22 more)

### Community 13 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 14 - "KiwiApifyProvider"
Cohesion: 0.15
Nodes (9): apifyErrorMessage(), flattenKiwiItems(), NewKiwiApifyProvider(), stringField(), truncateStr(), TestApifyErrorMessage(), KiwiApifyProvider, kiwiCache (+1 more)

### Community 15 - "canonical_booking_test.go"
Cohesion: 0.12
Nodes (28): openJawOption(), TestBookingLinkModeDefaultsToGoogle(), TestBookingRouteFromSessionOption_splitOmitsReturn(), TestBuildGoogleFlightsFallbackFromParams(), TestBuildLegOrSegmentBookingURL_segment(), TestBuildOneWayLegBookingURL(), TestBuildSkyscannerPrefillURL_oneWay(), TestBuildSkyscannerPrefillURL_roundTrip() (+20 more)

### Community 16 - "MonthDealsScreen.tsx"
Cohesion: 0.06
Nodes (39): CheaperCitiesOption, Props, s, KEYS, s, SortBarProps, SortOption, buildDealsPositioningSignature() (+31 more)

### Community 17 - "googleflights2_provider.go"
Cohesion: 0.12
Nodes (42): TestParseGF2TimeWithDateHint_AirportLocal(), TestExtractGF2BookingToken(), TestExtractGF2BookingURL(), TestExtractGF2PartnerBookingTokenPrefersPartnerURL(), TestBuildGF2ResultFromItinerary_FlatFormat(), TestParseGF2Response_AttachesFlatReturnFlights(), TestParseGF2Response_RapidAPIFlatTopFlights(), TestExtractGF2Leg_TimeOnly_NoDateHint() (+34 more)

### Community 18 - "server.go"
Cohesion: 0.06
Nodes (60): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, CanonicalFingerprint(), Carrier, CarrierCodes, CreateSearchSessionRequest (+52 more)

### Community 19 - "kiwi_apify_provider.go"
Cohesion: 0.21
Nodes (9): CodeshareFingerprint(), roundTimeToMinutes(), exploreLiveCandidate, gf2ExploreResolveDeps(), outboundDatesForMonthBookable(), SelectCheapestResolvedPartner(), TestSelectCheapestResolvedPartner(), MultiSearchResult (+1 more)

### Community 22 - "matcher_test.go"
Cohesion: 0.18
Nodes (28): extractPrice(), cfgTest(), testConnectingTLVJFK(), TestExtractPrice_euroPrefixNotArrivalTime(), TestGenerateQueries_connecting(), TestGenerateQueries_direct(), TestGenerateQueries_gf2AirlineNameIdentity(), TestGenerateQueries_includesRouteDateBookQuery() (+20 more)

### Community 25 - "runtime_config.go"
Cohesion: 0.22
Nodes (16): adminAccessConfigured(), configRangeError, adminTokenConfigured(), defaultRuntimeConfig(), errConfigOutOfRange(), getRuntimeConfig(), handleAdminRuntimeConfig(), initRuntimeConfigStore() (+8 more)

### Community 26 - "booking_gf2_resolve.go"
Cohesion: 0.09
Nodes (40): airlineDomainForCarrier(), allocateLegQuoteAmount(), attachQuotedPriceMeta(), dedupeGF2PartnerOffers(), flightLegDurationMinutes(), gf2OffersHavePrice(), gf2PartnerOfferFromQuoteURL(), gf2PartnerOfferFromResolved() (+32 more)

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.29
Nodes (10): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+2 more)

### Community 29 - "RuntimeConfigContext.tsx"
Cohesion: 0.19
Nodes (14): apiRequest(), adminAuthHeaders(), fetchAdminRuntimeConfig(), fetchRuntimeConfig(), saveAdminRuntimeConfig(), setRuntimeConfigStore(), RuntimeConfigContext, RuntimeConfigContextValue (+6 more)

### Community 30 - "searcher.go"
Cohesion: 0.09
Nodes (28): bookingResolveMaxConcurrentFromEnv(), envDurationMinutes(), init(), corpusText(), domainFromURL(), elapsedMs(), logMatchEvent(), countVerifiedPricedOffers() (+20 more)

### Community 31 - "AttachCanonicalIdentity"
Cohesion: 0.22
Nodes (10): AttachCanonicalIdentity(), segTLVJFK(), TestCanonicalItineraryFingerprint_connectingFlight(), TestCanonicalItineraryFingerprint_differentFlightsDoNotCollide(), TestCanonicalItineraryFingerprint_directFlight(), TestCanonicalItineraryFingerprint_formattingStable(), TestCanonicalItineraryFingerprint_gf2AirlineNameStable(), TestCanonicalItineraryFingerprint_operatingCarrier() (+2 more)

### Community 32 - "CanonicalSegment"
Cohesion: 0.10
Nodes (42): extractFlightNumbers(), flightNumberInText(), flightNumbersEquivalent(), splitFlightDesignator(), textContainsAirport(), textContainsAny(), timeMatches(), connectingFlightQueries() (+34 more)

### Community 33 - "testing.T"
Cohesion: 0.08
Nodes (35): TestQuoteBindingFromOption_usesStoredLegPrice(), TestResolveGF2PartnerOffer_usesPersistedLegDeepLinkWithoutProvider(), TestIsAffiliateTemplateBookingURL(), TestFlightNumbersEquivalent_leadingZeros(), TestSelectCheapestVerifiedOffer_picksLowestPrice(), TestIsCheckoutBookingURL_rejectsFlightSearchPages(), TestIsNonBookableDomain_blocksFlightRadar(), TestValidateBookingURL_acceptsHTTPS() (+27 more)

### Community 34 - "explore_cache.go"
Cohesion: 0.12
Nodes (15): airportCoord, exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), getAirportCoord(), haversineKm() (+7 more)

### Community 36 - "Backend QA Automation Tool"
Cohesion: 0.18
Nodes (10): Backend QA Automation Tool, Features, If the run feels slow or “stuck”, Notes, Optional AI Setup (Ollama), Output, Project Structure, Run (+2 more)

### Community 37 - "isSkippedProviderErr"
Cohesion: 0.53
Nodes (3): MultiSearchResult, isSkippedProviderErr(), IsTransientSearchErrMsg()

### Community 39 - "search.ts"
Cohesion: 0.14
Nodes (26): CachedResult, createSearchSession(), createSearchSessionWithRetry(), ensureLegacyPurge(), fetchFresh(), getFromStorage(), getSearchSessionResults(), getStorage() (+18 more)

### Community 40 - "skyscanner.ts"
Cohesion: 0.36
Nodes (10): BookingHop, bookingHopsFromOption(), firstSeg(), isClassicRoundTripLegs(), isoDatePrefix(), isSplitBookingItinerary(), lastSeg(), legNeedsSegmentSplit() (+2 more)

### Community 42 - "ExploreScreen.tsx"
Cohesion: 0.05
Nodes (77): getMonthDeals(), ExploreResponse, getExploreDestinations(), GetExploreDestinationsParams, AIRPORT_DICTIONARY, AIRPORT_ONLY_DICTIONARY, FULL_PLACE_DICTIONARY, getAirportDisplayName() (+69 more)

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "destinationMood.test.ts"
Cohesion: 0.12
Nodes (11): __dirname, dist, indexHtml, indexPath, SPA_ROUTES, byCity, curatedCities, curatedUrls (+3 more)

### Community 45 - "auth.go"
Cohesion: 0.15
Nodes (35): authUserJSON(), bearerTokenFromRequest(), bootstrapAdminUser(), createAuthSession(), envFlagTrue(), handleAuthChangePassword(), handleAuthLogout(), handleAuthMe() (+27 more)

### Community 46 - "auth_test.go"
Cohesion: 0.49
Nodes (9): handleAuthLogin(), initAuthStore(), initTestAuthDB(), randomTestPassword(), TestAuthLoginAndChangePassword(), TestAuthRegister(), TestAuthUserManagement(), TestBootstrapAdminPasswordSync() (+1 more)

### Community 47 - "main"
Cohesion: 0.40
Nodes (3): main(), parse_args(), _print_unreachable_backend_hint()

### Community 53 - "session_store.go"
Cohesion: 0.19
Nodes (20): loadSearchSession(), TestLoadSearchSession_Expiry(), searchSessionTTL(), startSearchSessionCleanup(), cleanupPersistedSessions(), importLegacyJSONSessions(), initSessionStore(), loadPersistedSession() (+12 more)

### Community 54 - "Nginx Proxy Manager — fly-fix TLS checklist"
Cohesion: 0.40
Nodes (4): Nginx Proxy Manager — fly-fix TLS checklist, Reissue frontend cert (both names), Required proxy-host settings, Symptoms Chrome shows

### Community 55 - "ResultsScreen.tsx"
Cohesion: 0.09
Nodes (38): DynamicDestinationsFormContentProps, styles, defaultParams, DynamicDestinationsScreen(), Nav, styles, CABIN_OPTIONS, PassengerCabinPickerProps (+30 more)

### Community 56 - "booking_resolve.go"
Cohesion: 0.10
Nodes (54): bookingMatchPriceNormalizer(), isAffiliateTemplateBookingURL(), normalizedGF2OfferPrice(), preferAirlineDirectWhenCheaperThanMarkedUpOTA(), publicAlternativesFromOffers(), acquireBookingResolveSlot(), beginInflightResolve(), bookingOfferInGF2Sources() (+46 more)

### Community 58 - "useTheme"
Cohesion: 0.14
Nodes (40): AppIcon(), collectTripDestinationCodes(), DestinationMoodBanner(), DestinationMoodStrip(), stripStyles, styles, Variant, EditSearchModal() (+32 more)

### Community 59 - "LocaleContext.tsx"
Cohesion: 0.18
Nodes (17): getStorage(), languageToLocale(), loadSaved(), LocaleContext, LocaleContextValue, LocaleProvider(), save(), VALID_CURRENCIES (+9 more)

### Community 60 - "DateRangePicker.tsx"
Cohesion: 0.23
Nodes (15): buildMonthDays(), DateRangePicker(), DateRangePickerProps, getMonthStart(), monthStartForYmd(), parseYmdUtc(), styles, WEEKDAYS (+7 more)

### Community 61 - "ProviderResult"
Cohesion: 0.07
Nodes (38): DedupeProviderResults(), ItineraryFingerprint(), mergeSelfTransfer(), uniqueStrings(), TestCompleteExtraLegs(), TestExtraLegsFingerprint(), TestHasExtraLegs(), cheapestReturnLeg() (+30 more)

### Community 62 - "client.ts"
Cohesion: 0.15
Nodes (11): searchAirports(), API_BASE, apiGet(), apiUrl(), isLocalHostname(), resolveApiBase(), GetDealsRangeParams, GetMonthDealsParams (+3 more)

### Community 65 - "SelectBestOffer"
Cohesion: 0.12
Nodes (17): classifyURLType(), floatPtr(), TestClassifyURLType_genericVsExact(), TestSelectBestOffer_cheapestOTAOverAirline(), TestSelectBestOffer_conflictingCandidatesPicksCheapest(), TestSelectBestOffer_missingPrice(), TestSelectBestOffer_multipleMatching(), TestSelectBestOffer_prefersPriceAmongSameURLType() (+9 more)

### Community 66 - "SearchLoadingOverlay.tsx"
Cohesion: 0.17
Nodes (11): SEARCH_BUTTON_PHRASES, SEARCH_PROGRESS_PHRASES, s, SearchProgressBannerProps, ExtraLeg, Props, s, ResultsSkeletonCard() (+3 more)

### Community 67 - "GF2SearchAirports"
Cohesion: 0.22
Nodes (10): gf2MetroKey(), GF2SearchAirports(), ResolveGF2PlaceCode(), containsAll(), TestGF2SearchAirports_CityOnlyCode(), TestGF2SearchAirports_LondonParis(), TestGF2SearchAirports_SingleAirport(), TestGF2SearchAirports_SpecificAirportNotExpanded() (+2 more)

### Community 68 - "FlightDetailsModal.tsx"
Cohesion: 0.17
Nodes (21): getAirportNameByCode(), airportTimeZones, getAirportTimeZone(), cabinLabel(), FlightDetailsModal(), formatDuration(), layoverBetween(), legDuration() (+13 more)

### Community 71 - "AuthContext.tsx"
Cohesion: 0.17
Nodes (23): authHeaders(), AuthUser, changePassword(), createUser(), deleteUser(), fetchAuthMe(), fetchUsers(), LoginResponse (+15 more)

### Community 72 - "Registry"
Cohesion: 0.22
Nodes (3): NewRegistryFromEnv(), parseProviderNames(), Registry

### Community 73 - "BuildCanonicalItinerary"
Cohesion: 0.08
Nodes (33): TotalStops(), TestCombineOneWayBatches(), TestCombineOneWayBatches_emptyBatch(), TestCombineOneWayBatches_openJawReturnDiversity(), BuildCanonicalItinerary(), FingerprintDebugString(), sumCanonicalSegmentDurations(), TestAttachCanonicalIdentityAll_combineOneWay() (+25 more)

### Community 74 - "server_carrier_test.go"
Cohesion: 0.83
Nodes (3): makeOfferWithCarriers(), TestExtractCarrierCodes(), TestPrimaryDisplayCarrier()

### Community 75 - "time.Time"
Cohesion: 0.10
Nodes (25): minutesOfDay(), explorePriceCachePut(), mergeExplorePriceRows(), exploreDestRow, FullRoundTrip, attachReturnLegKeepPrice(), ensureRoundTripLegs(), exploreDestRowsToMaps() (+17 more)

### Community 76 - "flyfix.ts"
Cohesion: 0.25
Nodes (8): apiPost(), FlyfixInsightsGroup, FlyfixIssue, FlyfixRefinedReport, FlyfixSummary, refineIssues(), RefineIssuesRequestBody, cancelSearchSession()

### Community 77 - "exchangeRates.ts"
Cohesion: 0.23
Nodes (11): DisplayPrice(), DisplayPriceProps, useExchangeRates(), convertPrice(), CURRENCY_SYMBOLS, CurrencyCode, ensureRates(), fetchRates() (+3 more)

### Community 78 - "affiliate.ts"
Cohesion: 0.27
Nodes (9): AffiliateProvider, AffiliateProviderResponse, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink(), OutboundLinkResponse (+1 more)

### Community 79 - "DatePickerCalendar.tsx"
Cohesion: 0.25
Nodes (8): getDealsRange(), DatePickerCalendar(), DatePickerCalendarProps, getNext14Dates(), getRangeStartEnd(), styles, WEEKDAYS, DayDeal

### Community 81 - "FlightResultCard.tsx"
Cohesion: 0.19
Nodes (15): buildRoutePath(), c, FlightResultCard(), LegScheduleBlock(), FlightSegment, LayoverSummary, OutboundSummary, buildLegPreviewSummary() (+7 more)

### Community 82 - "affiliate.go"
Cohesion: 0.15
Nodes (19): BuildLegAirlineDirectURL(), BuildRedirectURL(), getAffiliateID(), GetClicksSummary(), getOTAProvider(), GetSessionAndOption(), ParseOptionIndex(), RecordClick() (+11 more)

### Community 83 - "Fly-Fix UI / UX"
Cohesion: 0.15
Nodes (12): Avoid (AI-vibe tells), Checklist before shipping UI, Design north star, Fly-Fix UI / UX, Landing, Motion, Prefer, Responsive (+4 more)

### Community 84 - "TestApplySoftStrictBaggage"
Cohesion: 0.52
Nodes (6): applySoftStrictBaggage(), makeOfferWithBags(), makeOfferWithMissingBags(), TestApplySoftStrictBaggage(), TestClassifyOfferBaggage(), classifyOfferBaggage()

### Community 85 - "5. Guarantees to the Frontend"
Cohesion: 0.13
Nodes (14): 1.1 Create Search Session, 1.2 Get Search Session Status & Results, 1.3 Cancel Search Session (Optional, MVP+), 1. Flight Search Sessions, 2.1 Get Monthly Deals, 2. Monthly Deals API, 3.1 Search Airports & Cities, 3. Airport & City Autocomplete (+6 more)

### Community 87 - "newGF2Cache"
Cohesion: 0.33
Nodes (7): classicRoundTripMissingReturn(), TestClassicRoundTripMissingReturn(), TestDoSearchWithRetry_doesNotCacheRoundTrip(), TestSearch_ignoresIncompleteClassicRTCache(), TestSearch_servesCompleteClassicRTCache(), newGF2Cache(), TestSearchLegCached_usesCache()

### Community 88 - "booking_resolve_test.go"
Cohesion: 0.11
Nodes (27): cacheTTLForStatus(), intPtrOrNil(), legRouteLabel(), TestCanonicalItineraryForOption_isolatesSplitLegs(), runBookingMatch(), TestCacheTTLForStatus_doesNotCacheMisses(), TestHandleBookingResolve_invalidItinerary(), TestHandleBookingResolve_prefillFallback() (+19 more)

### Community 89 - "booking.ts"
Cohesion: 0.36
Nodes (8): BookingResolveRequest, BookingResolveStatus, bookingRetryDelayMs(), fetchBookingResolveOnce(), isTransientBookingFetchError(), isTransientBookingResolveResponse(), PublicBookingAlternative, resolveBookingOffer()

## Knowledge Gaps
- **321 isolated node(s):** `ClicksByProvider`, `BookingResolveRequest`, `PublicBookingAlternative`, `exploreLiveCandidate`, `flightcaptainweb` (+316 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 464 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `useSearchParams.ts`, `FiltersPanel.tsx`, `package.json`, `ThemeContext.tsx`, `AppIcon.tsx`, `BookingOptionsFooter.tsx`, `MonthDealsScreen.tsx`, `RuntimeConfigContext.tsx`, `ExploreScreen.tsx`, `ResultsScreen.tsx`, `useTheme`, `LocaleContext.tsx`, `DateRangePicker.tsx`, `SearchLoadingOverlay.tsx`, `FlightDetailsModal.tsx`, `AuthContext.tsx`, `exchangeRates.ts`, `DatePickerCalendar.tsx`, `FlightResultCard.tsx`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Why does `useTheme()` connect `useTheme` to `react`, `SearchLoadingOverlay.tsx`, `FiltersPanel.tsx`, `FlightDetailsModal.tsx`, `AuthContext.tsx`, `ThemeContext.tsx`, `ExploreScreen.tsx`, `AppIcon.tsx`, `BookingOptionsFooter.tsx`, `MonthDealsScreen.tsx`, `FlightResultCard.tsx`, `ResultsScreen.tsx`, `LocaleContext.tsx`, `DateRangePicker.tsx`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `react-native` connect `ThemeContext.tsx` to `react`, `SearchLoadingOverlay.tsx`, `useSearchParams.ts`, `FiltersPanel.tsx`, `FlightDetailsModal.tsx`, `package.json`, `AuthContext.tsx`, `ExploreScreen.tsx`, `AppIcon.tsx`, `BookingOptionsFooter.tsx`, `exchangeRates.ts`, `DatePickerCalendar.tsx`, `MonthDealsScreen.tsx`, `FlightResultCard.tsx`, `ResultsScreen.tsx`, `useTheme`, `LocaleContext.tsx`, `DateRangePicker.tsx`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **What connects `ClicksByProvider`, `BookingResolveRequest`, `PublicBookingAlternative` to the rest of the system?**
  _321 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `context.Context` be split into smaller, more focused modules?**
  _Cohesion score 0.1173054587688734 - nodes in this community are weakly interconnected._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.0553116769095698 - nodes in this community are weakly interconnected._
- **Should `useSearchParams.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1076923076923077 - nodes in this community are weakly interconnected._