# Graph Report - workspace  (2026-11-17)

## Corpus Check
- 317 files · ~265,218 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 17 file(s) not represented in the graph (top: (none) 8, .mdc 2, .example 2)

## Summary
- 2658 nodes · 8580 edges · 113 communities (92 shown, 21 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 721 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c47dedab`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- .ResolveQuotedPartnerBooking
- destinationMood.test.ts
- searchProgressRatio.test.ts
- Issue
- testing.T
- session_store.go
- frontend/package.json
- useTheme
- Features
- server.go
- flight-scraper/package.json
- resolveGF2PartnerOffers
- BookingOptionsFooter.tsx
- compilerOptions
- flightTimeDisplay.ts
- canonical_booking_test.go
- MonthDealsScreen.tsx
- resolveOTAPartnerOffers
- budget_config.go
- server.go
- qa_runner.py
- ApiClient
- skyscanner.js
- TestResult
- ResponseValidator
- runtime_config.go
- react-native
- expo
- config_loader.py
- auth.go
- DateRangePicker.tsx
- handleCreateSession
- runBookingMatch
- LocaleContext.tsx
- explore_cache.go
- ValidationIssue
- Backend QA Automation Tool
- test-roundtrip-legs.js
- booking_resolve.go
- search.ts
- Flight scraper (multisite)
- models.py
- AirportAutocomplete.tsx
- Fly-Fix – Frontend
- GoogleFlights2Provider
- BuildLegAirlineDirectURL
- test_cases
- LandingScreen.tsx
- gen_explore_airport_coords.py
- flightcaptainweb
- SearchRequest
- Nginx Proxy Manager — fly-fix TLS checklist
- skyscanner.ts
- extractGF2SegmentFromFlight
- .finalize
- FlightResultCard.tsx
- steps
- flyfix-api
- skyscannerParse.js
- ResultsScreen.tsx
- affiliate.ts
- handleMonthDeals
- npm
- skyscanner.js
- kiwi.js
- skyscanner.js
- nginx-proxy-manager (VPS edge)
- DateRangePicker.tsx
- AuthContext.tsx
- .SearchAll
- App.tsx
- warm.js
- api.ts
- LandingScreen.tsx
- matcher_test.go
- ProviderResult
- ErrorBoundary
- test-kiwi-parse.js
- normalizeKiwiItem
- dealsCache.ts
- Fly-Fix UI / UX
- TestApplySoftStrictBaggage
- backend_api_contracts.md
- ensure-edge-proxy.sh
- auth_test.go
- AirportLocation
- client.ts
- install-edge-proxy-cron.sh
- sync-edge-stack.sh
- time.Time
- scrape.js
- displayAirlines.ts
- ValidateBookingURL
- FlightDetailsModal.tsx
- exchangeRates.ts
- itineraryStops.ts
- handleExplore
- ensure-flight-vnc.sh
- ensure-flight-chrome.sh
- ensure-scraper-proxy-forwarder.sh
- docker-entrypoint.sh
- after-reboot-flight.sh
- devDependencies
- CalendarModal.tsx
- scripts
- ResolveProvider
- GetClicksSummary
- parseSearchSessionPageQuery

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 108 edges
2. `useLocale()` - 98 edges
3. `react` - 75 edges
4. `react-native` - 68 edges
5. `ProviderResult` - 62 edges
6. `ResultsScreen()` - 59 edges
7. `AppIcon()` - 58 edges
8. `MonthDealsScreen()` - 49 edges
9. `runBookingMatch()` - 48 edges
10. `BookingOffer` - 41 edges

## Surprising Connections (you probably didn't know these)
- `Search form` --references--> `DestinationMoodBanner()`  [INFERRED]
  .cursor/skills/flyfix-ui-ux/SKILL.md → frontend/src/components/DestinationMoodBanner.tsx
- `Cheaper departure cities (positioning optimizer)` --references--> `CheaperCitiesSection()`  [INFERRED]
  README.md → frontend/src/features/flight-search/components/CheaperCitiesSection.tsx
- `Results` --references--> `SortBar()`  [INFERRED]
  .cursor/skills/flyfix-ui-ux/SKILL.md → frontend/src/features/flight-search/components/SortBar.tsx
- `Flight scraper (multisite)` --references--> `OtaScraperProvider`  [INFERRED]
  services/flight-scraper/README.md → backend/search/ota_scraper_provider.go
- `Multi-provider flight search` --references--> `NewRegistryFromEnv()`  [INFERRED]
  README.md → backend/search/registry.go

## Import Cycles
- None detected.

## Communities (113 total, 21 thin omitted)

### Community 0 - ".ResolveQuotedPartnerBooking"
Cohesion: 0.15
Nodes (19): resolveAllPartnerBookingsFromTokenWithRetry(), findBookingOptionsArray(), firstPartnerBookingOption(), firstPartnerURLInMap(), firstStringByKeys(), ResolvedPartnerBooking, isPartnerBookingList(), parseGF2BookingOptions() (+11 more)

### Community 1 - "destinationMood.test.ts"
Cohesion: 0.11
Nodes (14): __dirname, dist, indexHtml, indexPath, SPA_ROUTES, byCity, compact, curatedCities (+6 more)

### Community 2 - "searchProgressRatio.test.ts"
Cohesion: 0.40
Nodes (3): fin, full, half

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "testing.T"
Cohesion: 0.05
Nodes (64): TestSearchRequestFromSession_singleLegOverride(), TestParseOtaOffers_normalizesIsrairDisplayName(), TestResolveOTAPartnerOffers_usesExistingCheckoutDeepLink(), TestFlightNumbersEquivalent_leadingZeros(), TestAttachReturnLegKeepPrice(), TestEnsureRoundTripLegs_noOpWhenTwoLegs(), ExploreBudgetLimits(), GF2MetroMaxAirports() (+56 more)

### Community 5 - "session_store.go"
Cohesion: 0.18
Nodes (22): loadSearchSession(), markSessionFailed(), publishSessionSnapshot(), TestLoadSearchSession_Expiry(), searchSessionTTL(), startSearchSessionCleanup(), cleanupPersistedSessions(), importLegacyJSONSessions() (+14 more)

### Community 6 - "frontend/package.json"
Cohesion: 0.09
Nodes (22): config, { getDefaultConfig }, dependencies, expo@~52.0.0, @expo/metro-runtime@~4.0.1, expo-status-bar@~2.0.0, react@18.3.1, react-dom@18.3.1 (+14 more)

### Community 7 - "useTheme"
Cohesion: 0.08
Nodes (57): ClearableTextInput(), ClearableTextInputProps, styles, DisplayPrice(), DisplayPriceProps, labelForProvider(), SearchSourcesBanner(), styles (+49 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (33): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+25 more)

### Community 9 - "server.go"
Cohesion: 0.07
Nodes (43): CanonicalFingerprint(), CodeshareFingerprint(), roundTimeToMinutes(), TestCapOptionsKeepingVariety(), TestProviderResultsToFlightOptions_PreservesCarrierName(), FlightLeg, FlightOption, LayoverSummary (+35 more)

### Community 10 - "flight-scraper/package.json"
Cohesion: 0.11
Nodes (17): express, playwright, dependencies, express@^4.21.2, playwright@^1.49.1, description, engines, node (+9 more)

### Community 11 - "resolveGF2PartnerOffers"
Cohesion: 0.10
Nodes (26): allocateLegQuoteAmount(), attachQuotedPriceMeta(), flightLegDurationMinutes(), legBookingToken(), legDeepLink(), legPartnerArraysAligned(), marketingCarrierForLeg(), marketingCarrierForLegIndex() (+18 more)

### Community 12 - "BookingOptionsFooter.tsx"
Cohesion: 0.10
Nodes (40): BookingResolveRequest, BookingResolveResponse, BookingResolveStatus, bookingRetryDelayMs(), fetchBookingResolveOnce(), isSafeBookingUrl(), isTransientBookingFetchError(), isTransientBookingResolveResponse() (+32 more)

### Community 13 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 14 - "flightTimeDisplay.ts"
Cohesion: 0.24
Nodes (12): airportTimeZones, getAirportTimeZone(), fmtDur(), layoverBetween(), legDuration(), renderLeg(), flightMinutesBetween(), flightTimeToMs() (+4 more)

### Community 15 - "canonical_booking_test.go"
Cohesion: 0.11
Nodes (35): gf2OffersHavePrice(), isTransientGF2BookingErr(), resolveGF2PartnerOffers(), searchRequestFromSession(), openJawOption(), TestBookingLinkModeDefaultsToSkyscanner(), TestBookingRouteFromSessionOption_splitOmitsReturn(), TestBuildGoogleFlightsFallbackFromParams() (+27 more)

### Community 16 - "MonthDealsScreen.tsx"
Cohesion: 0.06
Nodes (51): getDealsRange(), GetDealsRangeParams, getMonthDeals(), GetMonthDealsParams, getFlightDetails(), HubRouteLeg, HubRouteSummaryModal(), HubRouteSummaryModalProps (+43 more)

### Community 17 - "resolveOTAPartnerOffers"
Cohesion: 0.08
Nodes (29): applySearchQuoteToOffer(), dedupeGF2PartnerOffers(), gf2PartnerOfferFromQuoteURL(), gf2PartnerOfferFromResolved(), gf2PartnerOfferFromURL(), optionVendorFromQuote(), providerDomainFromURL(), TestGF2PartnerOfferFromURL_acceptsHTTPS() (+21 more)

### Community 18 - "budget_config.go"
Cohesion: 0.11
Nodes (23): budgetCfg(), durationFromEnvMin(), envTruthy(), FilterProviderNamesForBudget(), GF2EffectiveCacheTTL(), GF2EffectiveRateLimitPerMin(), GF2MetroConcurrency(), GF2SkipRoundTripEnrich() (+15 more)

### Community 19 - "server.go"
Cohesion: 0.06
Nodes (106): AirportCityResult, AirportCitySearchResponse, AirportCityType, TestLookupAirlineIATA_Israir(), corpusText(), domainFromURL(), extractFlightNumbers(), flightNumberInText() (+98 more)

### Community 22 - "skyscanner.js"
Cohesion: 0.18
Nodes (22): com, fr, req, gotoAndSettle(), ensureDatedResultsUrl(), extractSkyscanner(), FLIGHTS_PATH_BY_HOST, flightsSegmentForHost() (+14 more)

### Community 23 - "TestResult"
Cohesion: 0.19
Nodes (3): ResponseAnalyzer, main(), _print_unreachable_backend_hint()

### Community 25 - "runtime_config.go"
Cohesion: 0.21
Nodes (17): adminAccessConfigured(), configRangeError, adminTokenConfigured(), defaultRuntimeConfig(), errConfigOutOfRange(), getRuntimeConfig(), handleAdminRuntimeConfig(), handleGetRuntimeConfig() (+9 more)

### Community 26 - "react-native"
Cohesion: 0.08
Nodes (45): AppIcon(), AppIconLibrary, AppIconProps, styles, DestinationMoodBanner(), styles, EditSearchModalProps, s (+37 more)

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.30
Nodes (10): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+2 more)

### Community 29 - "auth.go"
Cohesion: 0.11
Nodes (42): GetSessionAndOption(), ParseOptionIndex(), RecordClick(), authUserJSON(), bearerTokenFromRequest(), bootstrapAdminUser(), createAuthSession(), envFlagTrue() (+34 more)

### Community 30 - "DateRangePicker.tsx"
Cohesion: 0.22
Nodes (16): useRuntimeConfig(), buildMonthDays(), DateRangePicker(), DateRangePickerProps, getMonthStart(), monthStartForYmd(), parseYmdUtc(), styles (+8 more)

### Community 31 - "handleCreateSession"
Cohesion: 0.16
Nodes (13): CreateSearchSessionRequest, ExtraSearchLeg, ProviderSearchStats, SearchProgress, SearchSession, SearchSessionResultsResponse, SearchSessionStatus, finalizeSearchSession() (+5 more)

### Community 32 - "runBookingMatch"
Cohesion: 0.09
Nodes (39): TestRunBookingMatch_kiwiMixedCarriersNoAustrianDeeplink(), TestRunBookingMatch_kiwiWizzSellerPrimaryWithAirlineSecondary(), TestRunBookingMatch_prodShapeKiwiIsrairGetsAirlinePrefill(), TestRunBookingMatch_mergesOTAPartners(), bookingResolveCacheKey(), canonicalItineraryForOption(), handleBookingResolve(), legRouteLabel() (+31 more)

### Community 33 - "LocaleContext.tsx"
Cohesion: 0.18
Nodes (17): getStorage(), languageToLocale(), loadSaved(), LocaleContext, LocaleContextValue, LocaleProvider(), save(), VALID_CURRENCIES (+9 more)

### Community 34 - "explore_cache.go"
Cohesion: 0.12
Nodes (16): airportCoord, exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut(), getAirportCoord() (+8 more)

### Community 36 - "Backend QA Automation Tool"
Cohesion: 0.18
Nodes (10): Backend QA Automation Tool, Features, If the run feels slow or “stuck”, Notes, Optional AI Setup (Ollama), Output, Project Structure, Run (+2 more)

### Community 37 - "test-roundtrip-legs.js"
Cohesion: 0.12
Nodes (19): a, arr, assert, b, dep, late, assert, frSegs (+11 more)

### Community 38 - "booking_resolve.go"
Cohesion: 0.09
Nodes (58): airlineDomainForCarrier(), bookingMatchPriceNormalizer(), normalizedGF2OfferPrice(), offersIncludeAirlineDirect(), preferAirlineDirectWhenCheaperThanMarkedUpOTA(), publicAlternativesFromOffers(), acquireBookingResolveSlot(), beginInflightResolve() (+50 more)

### Community 39 - "search.ts"
Cohesion: 0.13
Nodes (28): CachedResult, createSearchSession(), createSearchSessionWithRetry(), ensureLegacyPurge(), fetchFresh(), getFromStorage(), getSearchSessionResults(), getStorage() (+20 more)

### Community 40 - "Flight scraper (multisite)"
Cohesion: 0.29
Nodes (6): Docker, Flight scraper (multisite), Residential EU proxy, Run locally, VPS (recommended): headed Chrome on `:99`, When Skyscanner returns 0 offers

### Community 42 - "AirportAutocomplete.tsx"
Cohesion: 0.09
Nodes (59): getExploreDestinations(), AIRPORT_DICTIONARY, AIRPORT_ONLY_DICTIONARY, FULL_PLACE_DICTIONARY, getAirportDisplayName(), getAirportEntry(), getAirportNameByCode(), getCityDisplayName() (+51 more)

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "GoogleFlights2Provider"
Cohesion: 0.15
Nodes (10): classicRoundTripMissingReturn(), TestDoSearchWithRetry_doesNotCacheRoundTrip(), TestSearch_ignoresIncompleteClassicRTCache(), TestSearch_servesCompleteClassicRTCache(), GoogleFlights2Provider, newGF2Cache(), truncateGF2(), TestSearchLegCached_usesCache() (+2 more)

### Community 45 - "BuildLegAirlineDirectURL"
Cohesion: 0.17
Nodes (12): BuildLegAirlineDirectURL(), BuildRedirectURL(), getAffiliateID(), TestBuildLegAirlineDirectURL_austrianHasNoUnverifiedLink(), stripEmptyQueryParams(), TestBuildLegAirlineDirectURL_wizzPathNotHash(), TestBuildLegAirlineDirectURL_wizzRoundTripReturnDate(), isAffiliateTemplateBookingURL() (+4 more)

### Community 46 - "test_cases"
Cohesion: 0.05
Nodes (40): departureDate, origin, byProvider, currency, error, from, items, route (+32 more)

### Community 47 - "LandingScreen.tsx"
Cohesion: 0.06
Nodes (49): App(), linking, RTLWrapper(), main, name, private, version, Nav (+41 more)

### Community 53 - "SearchRequest"
Cohesion: 0.13
Nodes (21): TestCompleteExtraLegs(), TestExtraLegsFingerprint(), truncateStr(), TestSanitizeStandardSearchRequest(), TestDynamicDestinationOneWayRequests_extraLegs(), TestDynamicDestinationOneWayRequests_openJaw(), dynamicDestinationOneWayRequests(), flattenOtaScraperResponse() (+13 more)

### Community 54 - "Nginx Proxy Manager — fly-fix TLS checklist"
Cohesion: 0.40
Nodes (4): Nginx Proxy Manager — fly-fix TLS checklist, Reissue frontend cert (both names), Required proxy-host settings, Symptoms Chrome shows

### Community 55 - "skyscanner.ts"
Cohesion: 0.39
Nodes (11): BookingHop, bookingHopsFromOption(), firstSeg(), isClassicRoundTripLegs(), isoDatePrefix(), isSplitBookingItinerary(), lastSeg(), legCarrierCode() (+3 more)

### Community 56 - "extractGF2SegmentFromFlight"
Cohesion: 0.11
Nodes (44): TestParseGF2TimeWithDateHint_AirportLocal(), TestExtractGF2BookingToken(), TestExtractGF2BookingURL(), TestExtractGF2PartnerBookingTokenPrefersPartnerURL(), TestBuildGF2ResultFromItinerary_FlatFormat(), TestParseGF2Response_AttachesFlatReturnFlights(), TestParseGF2Response_RapidAPIFlatTopFlights(), TestParseGF2Response_topFlightsWithoutPriceHistory() (+36 more)

### Community 58 - "FlightResultCard.tsx"
Cohesion: 0.24
Nodes (15): buildRoutePath(), c, FlightResultCard(), LegScheduleBlock(), FlightSegment, LayoverSummary, buildLegPreviewSummary(), computeLayovers() (+7 more)

### Community 59 - "steps"
Cohesion: 0.09
Nodes (22): runs-on, steps, jobs, deploy, name, on, push, workflow_dispatch (+14 more)

### Community 60 - "flyfix-api"
Cohesion: 0.06
Nodes (37): context, FLIGHT_SCRAPER_MAX_CONCURRENT, FLIGHT_SCRAPER_URL, PLAYWRIGHT_HEADLESS, PORT, SCRAPER_CDP_URLS, SCRAPER_PROXY_URL, SCRAPER_WARM_ON_START (+29 more)

### Community 61 - "skyscannerParse.js"
Cohesion: 0.10
Nodes (33): assert, english, firstPage, named, offers, radarOffers, req, offerTemplate() (+25 more)

### Community 62 - "ResultsScreen.tsx"
Cohesion: 0.07
Nodes (66): collectTripDestinationCodes(), DestinationMoodStrip(), EditSearchModal(), DynamicDestinationsFormContent(), DynamicDestinationsFormContentProps, styles, defaultParams, DynamicDestinationsScreen() (+58 more)

### Community 63 - "affiliate.ts"
Cohesion: 0.27
Nodes (9): AffiliateProvider, AffiliateProviderResponse, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink(), OutboundLinkResponse (+1 more)

### Community 64 - "handleMonthDeals"
Cohesion: 0.13
Nodes (17): AirportLike, Carrier, DayDeal, FareBreakdown, FlightDetailsResponse, FlightSegment, MonetaryAmount, monthDealsCacheEntry (+9 more)

### Community 65 - "npm"
Cohesion: 0.17
Nodes (11): networks, proxy, container_name, image, networks, ports, restart, volumes (+3 more)

### Community 66 - "skyscanner.js"
Cohesion: 0.23
Nodes (17): addPartner(), clickMatchingKiwiCard(), clickMatchingSkyscannerCard(), clocksFromSegments(), collectPartnerMap(), extractPartnersFromDom(), hmFromIso(), isMetaHost() (+9 more)

### Community 67 - "kiwi.js"
Cohesion: 0.18
Nodes (21): waitUntil(), parseRoundTripHm(), clearKiwiSpaState(), ensureKiwiResultsUrl(), extractFromCaptured(), extractNextData(), flattenOffers(), kiwiPathLooksCorrect() (+13 more)

### Community 68 - "skyscanner.js"
Cohesion: 0.15
Nodes (10): extractSkyscanner(), req, skyscannerUrl(), url, DEFAULT_SITES, expediaUrl(), scrapeExpedia(), attachJsonCapture() (+2 more)

### Community 69 - "nginx-proxy-manager (VPS edge)"
Cohesion: 0.40
Nodes (4): Deploy sync, First-time / recovery, nginx-proxy-manager (VPS edge), On the server

### Community 70 - "DateRangePicker.tsx"
Cohesion: 0.18
Nodes (17): adminAuthHeaders(), fetchAdminRuntimeConfig(), fetchRuntimeConfig(), saveAdminRuntimeConfig(), setRuntimeConfigStore(), RuntimeConfigContext, RuntimeConfigContextValue, RuntimeConfigProvider() (+9 more)

### Community 71 - "AuthContext.tsx"
Cohesion: 0.16
Nodes (25): authHeaders(), AuthUser, changePassword(), createUser(), deleteUser(), fetchAuthMe(), fetchUsers(), LoginResponse (+17 more)

### Community 72 - ".SearchAll"
Cohesion: 0.12
Nodes (13): TestRegistryFailureMessage_transientOutbound(), TestRegistrySearchAll_dedupeComparesInRequestedCurrency(), TestRegistrySearchAll_fastOnlySkipsScraper(), TestRegistrySearchAll_openJawGF2FailNotMaskedByKiwiSkip(), TestRegistrySearchAllPartialFailure(), TestRegistrySearchAllWithProgress(), convertResultsToCurrency(), isFastProvider() (+5 more)

### Community 73 - "App.tsx"
Cohesion: 0.12
Nodes (26): buildSearchString(), SearchUrlState, isDeepLinkDebugEnabled(), logDeepLinkDiagnostics(), mergeDeepLinkParams(), fromStash, fromUrl, kept (+18 more)

### Community 74 - "warm.js"
Cohesion: 0.10
Nodes (33): pageLooksBlocked(), cdpLockBusy(), chain, withCdpLock(), blockHeavyResources(), getOpenPageHook(), browserPromises, { chromium, firefox } (+25 more)

### Community 75 - "api.ts"
Cohesion: 0.11
Nodes (20): SearchSourcesBannerProps, FlightDetailsModalProps, FlightResultCardProps, PositioningLegResult, SearchState, AirportCityType, AirportLike, BaggageClass (+12 more)

### Community 76 - "LandingScreen.tsx"
Cohesion: 0.09
Nodes (29): moodSizeForVariant(), stripStyles, styles, Variant, SiteFooter(), AIRPORT_FALLBACK_IMAGE, ASSIGNED_URLS, BY_CODE (+21 more)

### Community 77 - "matcher_test.go"
Cohesion: 0.11
Nodes (43): classifyURLType(), extractPrice(), cfgTest(), floatPtr(), TestClassifyURLType_genericVsExact(), testConnectingTLVJFK(), TestExtractPrice_euroPrefixNotArrivalTime(), TestGenerateQueries_connecting() (+35 more)

### Community 78 - "ProviderResult"
Cohesion: 0.07
Nodes (33): DedupeProviderResults(), ItineraryFingerprint(), mergeSelfTransfer(), uniqueStrings(), TestCombineOneWayBatches(), TestCombineOneWayBatches_emptyBatch(), TestCombineOneWayBatches_keepsNonstopsBothWays(), TestCombineOneWayBatches_openJawReturnDiversity() (+25 more)

### Community 79 - "ErrorBoundary"
Cohesion: 0.15
Nodes (4): ErrorBoundary, Props, s, State

### Community 80 - "test-kiwi-parse.js"
Cohesion: 0.20
Nodes (10): assert, offers, pending, req, bookingUrlFor(), extractKiwiUmbrella(), kiwiUmbrellaSettled(), sectorSegments() (+2 more)

### Community 81 - "normalizeKiwiItem"
Cohesion: 0.17
Nodes (16): TotalStops(), TestParseOTASegmentTime_AirportWallClock(), asArray(), collectCarriers(), detectSelfTransfer(), extractKiwiLegs(), firstFloat(), firstString() (+8 more)

### Community 82 - "dealsCache.ts"
Cohesion: 0.25
Nodes (15): DealsState, MonthDealsResponse, CachedDealsResults, clearPendingDealsParams(), DealsParams, dealsParamsFingerprint(), getCachedDealsResults(), getLocalStorage() (+7 more)

### Community 83 - "Fly-Fix UI / UX"
Cohesion: 0.15
Nodes (12): Avoid (AI-vibe tells), Checklist before shipping UI, Design north star, Fly-Fix UI / UX, Landing, Motion, Prefer, Responsive (+4 more)

### Community 84 - "TestApplySoftStrictBaggage"
Cohesion: 0.52
Nodes (6): applySoftStrictBaggage(), makeOfferWithBags(), makeOfferWithMissingBags(), TestApplySoftStrictBaggage(), TestClassifyOfferBaggage(), classifyOfferBaggage()

### Community 85 - "backend_api_contracts.md"
Cohesion: 0.18
Nodes (10): 1.1 Create Search Session, 1.2 Get Search Session Status & Results, 1. Flight Search Sessions, 2.1 Get Monthly Deals, 2. Monthly Deals API, 3.1 Search Airports & Cities, 3. Airport & City Autocomplete, 4. High-Level Handler Layout (Go) (+2 more)

### Community 87 - "auth_test.go"
Cohesion: 0.36
Nodes (11): handleAuthLogin(), initAuthStore(), purgeExpiredAuthSessions(), purgeExpiredAuthSessionsLoop(), initTestAuthDB(), randomTestPassword(), TestAuthLoginAndChangePassword(), TestAuthRegister() (+3 more)

### Community 88 - "AirportLocation"
Cohesion: 0.14
Nodes (16): AirportLocation(), TestAirportLocation_UnknownFallsBackUTC(), TestParseGF2TimeWithDateHint_TelAviv(), TestParseGF2Time_EuropeanDateFormat(), TestExtractGF2Leg_SingleSegment_DepartArriveDiffer(), TestExtractGF2Leg_TimeOnly_WithDateHint(), TestParseGF2Time_AcceptsFullDateTime(), TestParseGF2Time_NumericOffsetIsAbsolute() (+8 more)

### Community 89 - "client.ts"
Cohesion: 0.11
Nodes (21): searchAirports(), API_BASE, apiGet(), apiPost(), apiRequest(), apiUrl(), isLocalHostname(), resolveApiBase() (+13 more)

### Community 92 - "time.Time"
Cohesion: 0.14
Nodes (21): minutesOfDay(), ClickRecord, mergeExplorePriceRows(), exploreDestRow, exploreSession, FullRoundTrip, attachReturnLegKeepPrice(), ensureRoundTripLegs() (+13 more)

### Community 93 - "scrape.js"
Cohesion: 0.18
Nodes (11): runWithOpenPage(), hasCdp(), runOne(), scrapeAll(), SITE_FNS, beginSearch(), endSearch(), isSearchBusy() (+3 more)

### Community 94 - "displayAirlines.ts"
Cohesion: 0.30
Nodes (11): AIRLINE_NAMES, getAirlineName(), resolveAirlineLabel(), AIRLINE_FULL_NAMES, displayAirlineLabel(), formatFlightDesignator(), formatSegmentCarrierLine(), isPlausibleIataCarrier() (+3 more)

### Community 95 - "ValidateBookingURL"
Cohesion: 0.27
Nodes (11): gf2CheckoutOffers(), IsCheckoutBookingURL(), IsNonBookableDomain(), TestIsCheckoutBookingURL_rejectsFlightSearchPages(), TestIsNonBookableDomain_blocksFlightRadar(), TestValidateBookingURL_acceptsHTTPS(), TestValidateBookingURL_rejectsEmpty(), TestValidateBookingURL_rejectsJavascript() (+3 more)

### Community 96 - "FlightDetailsModal.tsx"
Cohesion: 0.36
Nodes (11): cabinLabel(), FlightDetailsModal(), formatDuration(), layoverBetween(), legDuration(), legDurationLine(), s, segmentDurationMinutes() (+3 more)

### Community 97 - "exchangeRates.ts"
Cohesion: 0.29
Nodes (8): useExchangeRates(), convertPrice(), CURRENCY_SYMBOLS, CurrencyCode, ensureRates(), fetchRates(), getDisplayPrice(), ratesToUSD

### Community 98 - "itineraryStops.ts"
Cohesion: 0.48
Nodes (5): countByStopsFilter(), matchesStopsFilter(), maxStopsPerLeg(), stopsPerLeg(), totalStops()

### Community 99 - "handleExplore"
Cohesion: 0.24
Nodes (8): exploreSessionKey(), getExploreSession(), newExploreSessionID(), putExploreSession(), startExploreSessionCleanup(), corsMiddleware(), handleExplore(), main()

### Community 101 - "ensure-flight-chrome.sh"
Cohesion: 0.52
Nodes (6): chrome_proxy_args(), DISPLAY, ensure_gateway_proxy(), load_scraper_proxy_env(), log(), ensure-flight-chrome.sh script

### Community 105 - "devDependencies"
Cohesion: 0.29
Nodes (7): devDependencies, @babel/core@^7.25.0, @types/react@~18.3.12, typescript@~5.3.0, @babel/core, @types/react, typescript

### Community 106 - "CalendarModal.tsx"
Cohesion: 0.38
Nodes (6): buildMonthDays(), CalendarModal(), getMonthStart(), Props, styles, WEEKDAYS

### Community 107 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, android, build, ios, start, web

### Community 108 - "ResolveProvider"
Cohesion: 0.50
Nodes (5): getOTAProvider(), ResolveProvider(), OutboundLinkResponse, Provider, ProviderResponse

### Community 112 - "parseSearchSessionPageQuery"
Cohesion: 0.67
Nodes (3): parseSearchSessionPageQuery(), searchResultsMaxStored(), searchResultsPageSize()

## Knowledge Gaps
- **3 isolated node(s):** `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 623 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Fly-Fix` connect `Features` to `MonthDealsScreen.tsx`?**
  _High betweenness centrality (0.314) - this node is a cross-community bridge._
- **What connects `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `destinationMood.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Why does `Multi-provider flight search` connect `Features` to `budget_config.go`?**
  _High betweenness centrality (0.309) - this node is a cross-community bridge._
- **Should `Issue` be split into smaller, more focused modules?**
  _Cohesion score 0.10365853658536585 - nodes in this community are weakly interconnected._
- **Why does `Recent enhancements` connect `MonthDealsScreen.tsx` to `Features`, `react-native`?**
  _High betweenness centrality (0.304) - this node is a cross-community bridge._
- **Should `testing.T` be split into smaller, more focused modules?**
  _Cohesion score 0.046620046620046623 - nodes in this community are weakly interconnected._