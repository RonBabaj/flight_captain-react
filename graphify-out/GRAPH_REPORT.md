# Graph Report - workspace  (2026-11-12)

## Corpus Check
- 292 files · ~244,892 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 16 file(s) not represented in the graph (top: (none) 8, .example 2, .conf 2)

## Summary
- 2434 nodes · 7607 edges · 99 communities (82 shown, 17 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 616 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `45daf195`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- .ResolveQuotedPartnerBooking
- ThemeContext.tsx
- SearchLoadingOverlay.tsx
- Issue
- LocaleContext.tsx
- session_store.go
- frontend/package.json
- useTheme
- Features
- DestinationMoodBanner.tsx
- flight-scraper/package.json
- resolveGF2PartnerOffers
- BookingOptionsFooter.tsx
- compilerOptions
- dealsCache.ts
- canonical_booking_test.go
- MonthDealsScreen.tsx
- googleflights2_provider.go
- server.go
- booking_resolve_test.go
- qa_runner.py
- ApiClient
- testing.T
- TestResult
- ResponseValidator
- runtime_config.go
- api.ts
- expo
- config_loader.py
- auth_test.go
- searcher.go
- auth.go
- itinerary.go
- RuntimeConfigContext.tsx
- explore_cache.go
- ValidationIssue
- Backend QA Automation Tool
- test-roundtrip-legs.js
- affiliate.go
- search.ts
- sharedLinkCache.ts
- models.py
- ExploreScreen.tsx
- Fly-Fix – Frontend
- DestinationMoodBanner.tsx
- booking_resolve.go
- test_cases
- FlightDetailsModal.tsx
- gen_explore_airport_coords.py
- flightcaptainweb
- .Search
- Nginx Proxy Manager — fly-fix TLS checklist
- LegalPageScreen.tsx
- FlightResultCard
- .finalize
- useLocale
- steps
- flyfix-api
- FlightResultCard.tsx
- ResultsScreen.tsx
- affiliate.ts
- client.ts
- npm
- skyscanner.js
- kiwi.js
- booking.ts
- nginx-proxy-manager (VPS edge)
- .buildCacheKey
- AuthContext.tsx
- .SearchAll
- normalizeKiwiItem
- scrape.js
- ProviderResult
- DatePickerCalendar.tsx
- server_carrier_test.go
- FiltersPanel.tsx
- exchangeRates.ts
- session.js
- Fly-Fix UI / UX
- TestApplySoftStrictBaggage
- backend_api_contracts.md
- ensure-edge-proxy.sh
- budget_config.go
- expedia.js
- install-edge-proxy-cron.sh
- sync-edge-stack.sh
- time.Time
- ErrorBoundary
- GF2SearchAirports
- ValidateBookingURL
- ensure-flight-chrome.sh
- skyscanner.ts
- docker-entrypoint.sh
- itinerary_test.go

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 106 edges
2. `useLocale()` - 94 edges
3. `react` - 73 edges
4. `react-native` - 66 edges
5. `ResultsScreen()` - 57 edges
6. `AppIcon()` - 56 edges
7. `ProviderResult` - 55 edges
8. `MonthDealsScreen()` - 48 edges
9. `BookingOffer` - 40 edges
10. `runBookingMatch()` - 34 edges

## Surprising Connections (you probably didn't know these)
- `Search form` --references--> `DestinationMoodBanner()`  [INFERRED]
  .cursor/skills/flyfix-ui-ux/SKILL.md → frontend/src/components/DestinationMoodBanner.tsx
- `Cheaper departure cities (positioning optimizer)` --references--> `CheaperCitiesSection()`  [INFERRED]
  README.md → frontend/src/features/flight-search/components/CheaperCitiesSection.tsx
- `Results` --references--> `SortBar()`  [INFERRED]
  .cursor/skills/flyfix-ui-ux/SKILL.md → frontend/src/features/flight-search/components/SortBar.tsx
- `Recent enhancements` --references--> `AppIcon()`  [INFERRED]
  README.md → frontend/src/components/AppIcon.tsx
- `2.1 Get Monthly Deals` --references--> `FullRoundTrip`  [INFERRED]
  backend/backend_api_contracts.md → backend/gf2_deals.go

## Import Cycles
- None detected.

## Communities (99 total, 17 thin omitted)

### Community 0 - ".ResolveQuotedPartnerBooking"
Cohesion: 0.10
Nodes (28): resolveAllPartnerBookingsFromTokenWithRetry(), bookingResolveFailureResponse(), findBookingOptionsArray(), firstPartnerBookingOption(), firstPartnerURLInMap(), firstStringByKeys(), ResolvedPartnerBooking, isPartnerBookingList() (+20 more)

### Community 1 - "ThemeContext.tsx"
Cohesion: 0.07
Nodes (38): App(), linking, RTLWrapper(), Nav, styles, DynamicDestinationsStack(), RootNavigator(), SearchStack() (+30 more)

### Community 2 - "SearchLoadingOverlay.tsx"
Cohesion: 0.21
Nodes (14): getAlmostDonePhrase(), getPhrasesForLanguage(), SEARCH_ALMOST_DONE, SEARCH_BUTTON_ALMOST_DONE, SEARCH_BUTTON_PHRASES, SEARCH_PROGRESS_PHRASES, s, SearchProgressBanner() (+6 more)

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "LocaleContext.tsx"
Cohesion: 0.18
Nodes (17): getStorage(), languageToLocale(), loadSaved(), LocaleContext, LocaleContextValue, LocaleProvider(), save(), VALID_CURRENCIES (+9 more)

### Community 5 - "session_store.go"
Cohesion: 0.13
Nodes (29): ProviderSearchStats, SearchProgress, SearchSession, SearchSessionResultsResponse, SearchSessionStatus, loadSearchSession(), markSessionFailed(), publishSearchProgress() (+21 more)

### Community 6 - "frontend/package.json"
Cohesion: 0.06
Nodes (40): config, { getDefaultConfig }, dependencies, expo@~52.0.0, @expo/metro-runtime@~4.0.1, expo-status-bar@~2.0.0, react@18.3.1, react-dom@18.3.1 (+32 more)

### Community 7 - "useTheme"
Cohesion: 0.08
Nodes (60): adminAuthHeaders(), fetchAdminRuntimeConfig(), saveAdminRuntimeConfig(), ClearableTextInput(), ClearableTextInputProps, styles, styles, useAuth() (+52 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (31): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+23 more)

### Community 9 - "DestinationMoodBanner.tsx"
Cohesion: 0.13
Nodes (19): collectTripDestinationCodes(), DestinationMoodBanner(), DestinationMoodStrip(), moodSizeForVariant(), stripStyles, styles, Variant, AIRPORT_DICTIONARY (+11 more)

### Community 10 - "flight-scraper/package.json"
Cohesion: 0.11
Nodes (17): express, playwright, dependencies, express@^4.21.2, playwright@^1.49.1, description, engines, node (+9 more)

### Community 11 - "resolveGF2PartnerOffers"
Cohesion: 0.07
Nodes (70): airlineDomainForCarrier(), allocateLegQuoteAmount(), applySearchQuoteToOffer(), attachQuotedPriceMeta(), bookingMatchPriceNormalizer(), dedupeGF2PartnerOffers(), flightLegDurationMinutes(), gf2OffersHavePrice() (+62 more)

### Community 12 - "BookingOptionsFooter.tsx"
Cohesion: 0.17
Nodes (26): BookingResolveResponse, isSafeBookingUrl(), PublicBookingOffer, bookingOfferProviderLabel(), bookingOfferSubtitle(), formatBookingOfferPriceAmount(), formatBookingOfferPriceLine(), formatProviderDisplayName() (+18 more)

### Community 13 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 14 - "dealsCache.ts"
Cohesion: 0.25
Nodes (15): DealsState, MonthDealsResponse, CachedDealsResults, clearPendingDealsParams(), DealsParams, dealsParamsFingerprint(), getCachedDealsResults(), getLocalStorage() (+7 more)

### Community 15 - "canonical_booking_test.go"
Cohesion: 0.11
Nodes (35): openJawOption(), TestBookingLinkModeDefaultsToSkyscanner(), TestBookingRouteFromSessionOption_splitOmitsReturn(), TestBuildGoogleFlightsFallbackFromParams(), TestBuildLegOrSegmentBookingURL_segment(), TestBuildOneWayLegBookingURL(), TestBuildSkyscannerPrefillURL_oneWay(), TestBuildSkyscannerPrefillURL_roundTrip() (+27 more)

### Community 16 - "MonthDealsScreen.tsx"
Cohesion: 0.06
Nodes (52): getFlightDetails(), DisplayPrice(), DisplayPriceProps, HubRouteLeg, HubRouteSummaryModal(), HubRouteSummaryModalProps, s, s (+44 more)

### Community 17 - "googleflights2_provider.go"
Cohesion: 0.13
Nodes (38): TestParseGF2TimeWithDateHint_AirportLocal(), TestExtractGF2BookingToken(), TestExtractGF2BookingURL(), TestBuildGF2ResultFromItinerary_FlatFormat(), TestParseGF2Response_AttachesFlatReturnFlights(), TestParseGF2Response_RapidAPIFlatTopFlights(), TestExtractGF2Leg_TimeOnly_NoDateHint(), TestExtractGF2SegmentFromFlight_CodeOnlyHasNoName() (+30 more)

### Community 18 - "server.go"
Cohesion: 0.06
Nodes (62): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, Carrier, TestProviderResultsToFlightOptions_PreservesCarrierName(), CreateSearchSessionRequest, DayDeal (+54 more)

### Community 19 - "booking_resolve_test.go"
Cohesion: 0.24
Nodes (6): exploreLiveCandidate, gf2ExploreResolveDeps(), outboundDatesForMonthBookable(), TestSanitizeProviderErrorForUser(), SanitizeProviderErrorForUser(), otaScraperSearchRequest

### Community 22 - "testing.T"
Cohesion: 0.06
Nodes (74): classifyURLType(), extractPrice(), cfgTest(), floatPtr(), TestClassifyURLType_genericVsExact(), testConnectingTLVJFK(), TestExtractPrice_euroPrefixNotArrivalTime(), TestFlightNumbersEquivalent_leadingZeros() (+66 more)

### Community 23 - "TestResult"
Cohesion: 0.19
Nodes (3): ResponseAnalyzer, main(), _print_unreachable_backend_hint()

### Community 25 - "runtime_config.go"
Cohesion: 0.21
Nodes (17): adminAccessConfigured(), configRangeError, adminTokenConfigured(), defaultRuntimeConfig(), errConfigOutOfRange(), getRuntimeConfig(), handleAdminRuntimeConfig(), handleGetRuntimeConfig() (+9 more)

### Community 26 - "api.ts"
Cohesion: 0.10
Nodes (26): FiltersPanelProps, FlightDetailsModalProps, FlightResultCardProps, PassengerCabinPickerProps, SearchFormContentProps, PositioningLegResult, defaultFilters, SearchFilters (+18 more)

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.30
Nodes (10): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+2 more)

### Community 29 - "auth_test.go"
Cohesion: 0.20
Nodes (15): initAuthStore(), purgeExpiredAuthSessions(), purgeExpiredAuthSessionsLoop(), initTestAuthDB(), randomTestPassword(), TestAuthLoginAndChangePassword(), TestAuthRegister(), TestAuthUserManagement() (+7 more)

### Community 30 - "searcher.go"
Cohesion: 0.11
Nodes (27): defaultBookingMatchRunner(), webVerifiedBookingOffers(), corpusText(), domainFromURL(), logMatchEvent(), MatchResult, countVerifiedPricedOffers(), MatchItinerary() (+19 more)

### Community 31 - "auth.go"
Cohesion: 0.14
Nodes (39): RecordClick(), authUserJSON(), bearerTokenFromRequest(), bootstrapAdminUser(), createAuthSession(), envFlagTrue(), handleAuthChangePassword(), handleAuthLogin() (+31 more)

### Community 32 - "itinerary.go"
Cohesion: 0.09
Nodes (45): extractFlightNumbers(), flightNumberInText(), flightNumbersEquivalent(), splitFlightDesignator(), textContainsAirport(), textContainsAny(), timeMatches(), connectingFlightQueries() (+37 more)

### Community 33 - "RuntimeConfigContext.tsx"
Cohesion: 0.25
Nodes (10): fetchRuntimeConfig(), setRuntimeConfigStore(), RuntimeConfigContext, RuntimeConfigContextValue, RuntimeConfigProvider(), DEFAULT_RUNTIME_CONFIG, RUNTIME_CONFIG_FIELDS, RuntimeConfig (+2 more)

### Community 34 - "explore_cache.go"
Cohesion: 0.09
Nodes (26): airportCoord, exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut(), getAirportCoord() (+18 more)

### Community 36 - "Backend QA Automation Tool"
Cohesion: 0.18
Nodes (10): Backend QA Automation Tool, Features, If the run feels slow or “stuck”, Notes, Optional AI Setup (Ollama), Output, Project Structure, Run (+2 more)

### Community 37 - "test-roundtrip-legs.js"
Cohesion: 0.13
Nodes (19): a, arr, assert, b, dep, late, assert, frSegs (+11 more)

### Community 38 - "affiliate.go"
Cohesion: 0.16
Nodes (16): BuildLegAirlineDirectURL(), BuildRedirectURL(), getAffiliateID(), GetClicksSummary(), getOTAProvider(), GetSessionAndOption(), ParseOptionIndex(), ResolveProvider() (+8 more)

### Community 39 - "search.ts"
Cohesion: 0.14
Nodes (27): CachedResult, createSearchSession(), createSearchSessionWithRetry(), ensureLegacyPurge(), fetchFresh(), getFromStorage(), getSearchSessionResults(), getStorage() (+19 more)

### Community 40 - "sharedLinkCache.ts"
Cohesion: 0.12
Nodes (26): buildSearchString(), SearchUrlState, isDeepLinkDebugEnabled(), logDeepLinkDiagnostics(), mergeDeepLinkParams(), fromStash, fromUrl, kept (+18 more)

### Community 42 - "ExploreScreen.tsx"
Cohesion: 0.09
Nodes (61): getMonthDeals(), getExploreDestinations(), AIRPORT_ONLY_DICTIONARY, FULL_PLACE_DICTIONARY, getAirportDisplayName(), getAirportEntry(), getCityDisplayName(), lower() (+53 more)

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "DestinationMoodBanner.tsx"
Cohesion: 0.12
Nodes (11): __dirname, dist, indexHtml, indexPath, SPA_ROUTES, byCity, curatedCities, curatedUrls (+3 more)

### Community 45 - "booking_resolve.go"
Cohesion: 0.09
Nodes (45): acquireBookingResolveSlot(), beginInflightResolve(), bookingResolveCacheKey(), bookingResolveMaxConcurrentFromEnv(), cacheTTLForStatus(), canonicalItineraryForOption(), envDurationMinutes(), finishInflightResolve() (+37 more)

### Community 46 - "test_cases"
Cohesion: 0.05
Nodes (40): departureDate, origin, byProvider, currency, error, from, items, route (+32 more)

### Community 47 - "FlightDetailsModal.tsx"
Cohesion: 0.16
Nodes (22): getAirportNameByCode(), airportTimeZones, getAirportTimeZone(), cabinLabel(), FlightDetailsModal(), formatDuration(), layoverBetween(), legDuration() (+14 more)

### Community 53 - ".Search"
Cohesion: 0.09
Nodes (25): parseOtaOffers(), truncateStr(), TestParseOtaOffers_dropsSkyscannerMetaDeepLink(), TestParseOtaOffersEmptyAndInvalid(), TestParseOtaOffersSolidcodeShape(), TestIsOpenJaw(), TestResolveReturnAirports_classic(), TestResolveReturnAirports_openJaw() (+17 more)

### Community 54 - "Nginx Proxy Manager — fly-fix TLS checklist"
Cohesion: 0.40
Nodes (4): Nginx Proxy Manager — fly-fix TLS checklist, Reissue frontend cert (both names), Required proxy-host settings, Symptoms Chrome shows

### Community 55 - "LegalPageScreen.tsx"
Cohesion: 0.26
Nodes (11): ContactScreen(), LegalKind, LegalPageScreen(), PrivacyScreen(), SECTIONS, styles, TermsScreen(), Nav (+3 more)

### Community 56 - "FlightResultCard"
Cohesion: 0.27
Nodes (11): AIRLINE_NAMES, getAirlineName(), resolveAirlineLabel(), AIRLINE_FULL_NAMES, buildRoutePath(), FlightResultCard(), displayAirlineLabel(), distinctMarketingCarriers() (+3 more)

### Community 58 - "useLocale"
Cohesion: 0.10
Nodes (38): AppIcon(), AppIconLibrary, AppIconProps, styles, FormHeroHeader(), FormHeroHeaderProps, styles, formCardStyles (+30 more)

### Community 59 - "steps"
Cohesion: 0.09
Nodes (22): runs-on, steps, jobs, deploy, name, on, push, workflow_dispatch (+14 more)

### Community 60 - "flyfix-api"
Cohesion: 0.06
Nodes (37): context, FLIGHT_SCRAPER_MAX_CONCURRENT, FLIGHT_SCRAPER_URL, PLAYWRIGHT_HEADLESS, PORT, SCRAPER_CDP_URLS, SCRAPER_PROXY_URL, SCRAPER_WARM_ON_START (+29 more)

### Community 61 - "FlightResultCard.tsx"
Cohesion: 0.30
Nodes (12): c, LegScheduleBlock(), FlightSegment, LayoverSummary, buildLegPreviewSummary(), computeLayovers(), formatDuration(), formatLayoverPreview() (+4 more)

### Community 62 - "ResultsScreen.tsx"
Cohesion: 0.06
Nodes (60): EditSearchModal(), EditSearchModalProps, s, SiteFooter(), DynamicDestinationsFormContentProps, defaultParams, DynamicDestinationsScreen(), Nav (+52 more)

### Community 63 - "affiliate.ts"
Cohesion: 0.27
Nodes (9): AffiliateProvider, AffiliateProviderResponse, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink(), OutboundLinkResponse (+1 more)

### Community 64 - "client.ts"
Cohesion: 0.10
Nodes (23): searchAirports(), API_BASE, apiGet(), apiPost(), apiRequest(), apiUrl(), isLocalHostname(), resolveApiBase() (+15 more)

### Community 65 - "npm"
Cohesion: 0.17
Nodes (11): networks, proxy, container_name, image, networks, ports, restart, volumes (+3 more)

### Community 66 - "skyscanner.js"
Cohesion: 0.17
Nodes (20): com, fr, req, waitUntil(), skyscannerDate(), ensureDatedResultsUrl(), extractSkyscanner(), FLIGHTS_PATH_BY_HOST (+12 more)

### Community 67 - "kiwi.js"
Cohesion: 0.16
Nodes (24): offerTemplate(), segment(), segmentsFromRoundTripClocks(), clearKiwiSpaState(), ensureKiwiResultsUrl(), extractFromCaptured(), extractNextData(), flattenOffers() (+16 more)

### Community 68 - "booking.ts"
Cohesion: 0.36
Nodes (8): BookingResolveRequest, BookingResolveStatus, bookingRetryDelayMs(), fetchBookingResolveOnce(), isTransientBookingFetchError(), isTransientBookingResolveResponse(), PublicBookingAlternative, resolveBookingOffer()

### Community 69 - "nginx-proxy-manager (VPS edge)"
Cohesion: 0.40
Nodes (4): Deploy sync, First-time / recovery, nginx-proxy-manager (VPS edge), On the server

### Community 70 - ".buildCacheKey"
Cohesion: 0.19
Nodes (13): TestCompleteExtraLegs(), TestExtraLegsFingerprint(), classicRoundTripMissingReturn(), TestClassicRoundTripMissingReturn(), TestDoSearchWithRetry_doesNotCacheRoundTrip(), TestSearch_ignoresIncompleteClassicRTCache(), TestSearch_servesCompleteClassicRTCache(), newGF2Cache() (+5 more)

### Community 71 - "AuthContext.tsx"
Cohesion: 0.16
Nodes (23): authHeaders(), AuthUser, changePassword(), createUser(), deleteUser(), fetchAuthMe(), fetchUsers(), LoginResponse (+15 more)

### Community 72 - ".SearchAll"
Cohesion: 0.15
Nodes (10): TestRegistryFailureMessage_transientOutbound(), TestRegistrySearchAll_openJawGF2FailNotMaskedByKiwiSkip(), TestRegistrySearchAllPartialFailure(), TestRegistrySearchAllWithProgress(), isFastProvider(), isSkippedProviderErr(), IsTransientSearchErrMsg(), MultiSearchResult (+2 more)

### Community 73 - "normalizeKiwiItem"
Cohesion: 0.20
Nodes (20): elapsedMs(), minutesOfDay(), roundTimeToMinutes(), asArray(), collectCarriers(), detectSelfTransfer(), extractKiwiLegs(), firstFloat() (+12 more)

### Community 74 - "scrape.js"
Cohesion: 0.18
Nodes (11): runWithOpenPage(), hasCdp(), runOne(), scrapeAll(), SITE_FNS, beginSearch(), endSearch(), isSearchBusy() (+3 more)

### Community 75 - "ProviderResult"
Cohesion: 0.07
Nodes (36): DedupeProviderResults(), ItineraryFingerprint(), mergeSelfTransfer(), TotalStops(), uniqueStrings(), TestCombineOneWayBatches(), TestCombineOneWayBatches_emptyBatch(), TestCombineOneWayBatches_openJawReturnDiversity() (+28 more)

### Community 76 - "DatePickerCalendar.tsx"
Cohesion: 0.33
Nodes (8): getDealsRange(), DatePickerCalendar(), DatePickerCalendarProps, getNext14Dates(), getRangeStartEnd(), styles, WEEKDAYS, DayDeal

### Community 77 - "server_carrier_test.go"
Cohesion: 0.43
Nodes (6): CarrierCodes, makeOfferWithCarriers(), TestExtractCarrierCodes(), TestPrimaryDisplayCarrier(), ExtractCarrierCodes(), PrimaryDisplayCarrier()

### Community 78 - "FiltersPanel.tsx"
Cohesion: 0.31
Nodes (8): f, FiltersPanel(), Chip(), countByStopsFilter(), matchesStopsFilter(), maxStopsPerLeg(), stopsPerLeg(), totalStops()

### Community 81 - "exchangeRates.ts"
Cohesion: 0.29
Nodes (8): useExchangeRates(), convertPrice(), CURRENCY_SYMBOLS, CurrencyCode, ensureRates(), fetchRates(), getDisplayPrice(), ratesToUSD

### Community 82 - "session.js"
Cohesion: 0.12
Nodes (31): pageLooksBlocked(), cdpLockBusy(), chain, withCdpLock(), blockHeavyResources(), getOpenPageHook(), browserPromises, { chromium, firefox } (+23 more)

### Community 83 - "Fly-Fix UI / UX"
Cohesion: 0.15
Nodes (12): Avoid (AI-vibe tells), Checklist before shipping UI, Design north star, Fly-Fix UI / UX, Landing, Motion, Prefer, Responsive (+4 more)

### Community 84 - "TestApplySoftStrictBaggage"
Cohesion: 0.52
Nodes (6): applySoftStrictBaggage(), makeOfferWithBags(), makeOfferWithMissingBags(), TestApplySoftStrictBaggage(), TestClassifyOfferBaggage(), classifyOfferBaggage()

### Community 85 - "backend_api_contracts.md"
Cohesion: 0.18
Nodes (10): 1.1 Create Search Session, 1.2 Get Search Session Status & Results, 1. Flight Search Sessions, 2.1 Get Monthly Deals, 2. Monthly Deals API, 3.1 Search Airports & Cities, 3. Airport & City Autocomplete, 4. High-Level Handler Layout (Go) (+2 more)

### Community 87 - "budget_config.go"
Cohesion: 0.08
Nodes (25): budgetCfg(), durationFromEnvMin(), envTruthy(), FilterProviderNamesForBudget(), GF2EffectiveCacheTTL(), GF2EffectiveRateLimitPerMin(), GF2MetroConcurrency(), GF2SkipRoundTripEnrich() (+17 more)

### Community 88 - "expedia.js"
Cohesion: 0.19
Nodes (6): DEFAULT_SITES, expediaUrl(), scrapeExpedia(), attachJsonCapture(), gotoAndSettle(), mergeConfig()

### Community 92 - "time.Time"
Cohesion: 0.15
Nodes (14): FullRoundTrip, attachReturnLegKeepPrice(), ensureRoundTripLegs(), gf2ExploreSearchOneDestination(), gf2OneRoundTrip(), gf2SearchDealsOnDates(), gf2SearchDealsRange(), gf2SearchMonthDeals() (+6 more)

### Community 94 - "ErrorBoundary"
Cohesion: 0.15
Nodes (4): ErrorBoundary, Props, s, State

### Community 95 - "GF2SearchAirports"
Cohesion: 0.11
Nodes (20): init(), BudgetModeEnabled(), ExploreBudgetLimits(), GF2MetroMaxAirports(), resetBudgetEnv(), TestExploreBudgetLimits_budget(), TestExploreBudgetLimits_defaultsWithoutBudget(), TestGF2SearchAirports_budgetCapsMetro() (+12 more)

### Community 97 - "ValidateBookingURL"
Cohesion: 0.22
Nodes (11): gf2CheckoutOffers(), IsCheckoutBookingURL(), IsNonBookableDomain(), TestIsCheckoutBookingURL_rejectsFlightSearchPages(), TestIsNonBookableDomain_blocksFlightRadar(), TestValidateBookingURL_acceptsHTTPS(), TestValidateBookingURL_rejectsEmpty(), TestValidateBookingURL_rejectsJavascript() (+3 more)

### Community 101 - "ensure-flight-chrome.sh"
Cohesion: 0.70
Nodes (4): DISPLAY, ensure_gateway_proxy(), log(), ensure-flight-chrome.sh script

### Community 102 - "skyscanner.ts"
Cohesion: 0.42
Nodes (10): BookingHop, bookingHopsFromOption(), firstSeg(), isClassicRoundTripLegs(), isoDatePrefix(), isSplitBookingItinerary(), lastSeg(), legNeedsSegmentSplit() (+2 more)

### Community 105 - "itinerary_test.go"
Cohesion: 0.23
Nodes (14): AttachCanonicalIdentity(), segTLVJFK(), TestCanonicalItineraryFingerprint_connectingFlight(), TestCanonicalItineraryFingerprint_differentFlightsDoNotCollide(), TestCanonicalItineraryFingerprint_directFlight(), TestCanonicalItineraryFingerprint_formattingStable(), TestCanonicalItineraryFingerprint_gf2AirlineNameStable(), TestCanonicalItineraryFingerprint_missingOptionalFields() (+6 more)

## Knowledge Gaps
- **3 isolated node(s):** `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 582 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Fly-Fix` connect `Features` to `MonthDealsScreen.tsx`, `budget_config.go`?**
  _High betweenness centrality (0.356) - this node is a cross-community bridge._
- **What connects `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `.ResolveQuotedPartnerBooking` be split into smaller, more focused modules?**
  _Cohesion score 0.10384068278805121 - nodes in this community are weakly interconnected._
- **Why does `Multi-provider flight search` connect `budget_config.go` to `Features`?**
  _High betweenness centrality (0.353) - this node is a cross-community bridge._
- **Should `ThemeContext.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06767676767676768 - nodes in this community are weakly interconnected._
- **Why does `Recent enhancements` connect `MonthDealsScreen.tsx` to `Features`, `useLocale`?**
  _High betweenness centrality (0.341) - this node is a cross-community bridge._
- **Should `Issue` be split into smaller, more focused modules?**
  _Cohesion score 0.10365853658536585 - nodes in this community are weakly interconnected._