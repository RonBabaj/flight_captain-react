# Graph Report - workspace  (2026-11-19)

## Corpus Check
- 329 files · ~269,977 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 18 file(s) not represented in the graph (top: (none) 8, .mdc 2, .example 2)

## Summary
- 2721 nodes · 8772 edges · 102 communities (82 shown, 20 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 734 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `89a43cc6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- .ResolveQuotedPartnerBooking
- time.Duration
- CanonicalSegment
- Issue
- runBookingMatch
- session_store.go
- frontend/package.json
- useTheme
- Features
- FlightOption
- flight-scraper/package.json
- GF2SearchAirports
- BookingOptionsFooter.tsx
- compilerOptions
- FlightDetailsModal.tsx
- resolveGF2PartnerOffers
- MonthDealsScreen.tsx
- resolveOTAPartnerOffers
- ErrorBoundary
- server.go
- qa_runner.py
- ApiClient
- skyscanner.js
- TestResult
- ResponseValidator
- runtime_config.go
- AppIcon
- expo
- config_loader.py
- auth.go
- session.js
- dealsCache.ts
- CanonicalItinerary
- ExploreScreen.tsx
- explore_cache.go
- ValidationIssue
- Backend QA Automation Tool
- test-roundtrip-legs.js
- LookupAirlineIATA
- search.ts
- ThemeContext.tsx
- models.py
- AirportAutocomplete.tsx
- Fly-Fix – Frontend
- skyscanner.ts
- searchProgressRatio.test.ts
- test_cases
- RootNavigator.tsx
- gen_explore_airport_coords.py
- flightcaptainweb
- SearchRequest
- Nginx Proxy Manager — fly-fix TLS checklist
- handleCreateSession
- googleflights2_provider.go
- .finalize
- steps
- flyfix-api
- skyscannerParse.js
- ResultsScreen.tsx
- auth.go
- booking.ts
- npm
- kiwi.js
- nginx-proxy-manager (VPS edge)
- RuntimeConfigContext.tsx
- .SearchAll
- App.tsx
- warm.js
- SearchLoadingOverlay.tsx
- flyfix.ts
- testing.T
- ProviderResult
- CanonicalItinerary
- test-kiwi-parse.js
- client.ts
- Fly-Fix UI / UX
- TestApplySoftStrictBaggage
- backend_api_contracts.md
- ensure-edge-proxy.sh
- debug-skyscanner-live.js
- Flight scraper (multisite)
- affiliate.ts
- install-edge-proxy-cron.sh
- sync-edge-stack.sh
- time.Time
- scrape.js
- GoogleFlights2Provider
- Fly-Fix — Design System & Cursor Redesign Playbook
- server_carrier_test.go
- handleExplore
- ensure-flight-vnc.sh
- ensure-flight-chrome.sh
- ensure-scraper-proxy-forwarder.sh
- docker-entrypoint.sh
- after-reboot-flight.sh
- Frontend Design
- CalendarModal.tsx

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 108 edges
2. `useLocale()` - 98 edges
3. `react` - 75 edges
4. `react-native` - 70 edges
5. `ProviderResult` - 62 edges
6. `ResultsScreen()` - 59 edges
7. `AppIcon()` - 58 edges
8. `MonthDealsScreen()` - 50 edges
9. `runBookingMatch()` - 48 edges
10. `BookingOffer` - 41 edges

## Surprising Connections (you probably didn't know these)
- `Cheaper departure cities (positioning optimizer)` --references--> `CheaperCitiesSection()`  [INFERRED]
  README.md → frontend/src/features/flight-search/components/CheaperCitiesSection.tsx
- `3. Core product patterns` --references--> `TopNavMenu()`  [INFERRED]
  .cursor/skills/flyfix-redesign-playbook/SKILL.md → frontend/src/navigation/TopNavMenu.tsx
- `Flight scraper (multisite)` --references--> `OtaScraperProvider`  [INFERRED]
  services/flight-scraper/README.md → backend/search/ota_scraper_provider.go
- `Multi-provider flight search` --references--> `NewRegistryFromEnv()`  [INFERRED]
  README.md → backend/search/registry.go
- `Recent enhancements` --references--> `AppIcon()`  [INFERRED]
  README.md → frontend/src/components/AppIcon.tsx

## Import Cycles
- None detected.

## Communities (102 total, 20 thin omitted)

### Community 0 - ".ResolveQuotedPartnerBooking"
Cohesion: 0.12
Nodes (26): isTransientGF2BookingErr(), resolveAllPartnerBookingsFromTokenWithRetry(), bookingResolveFailureResponse(), findBookingOptionsArray(), firstPartnerBookingOption(), firstPartnerURLInMap(), firstStringByKeys(), ResolvedPartnerBooking (+18 more)

### Community 1 - "time.Duration"
Cohesion: 0.07
Nodes (28): init(), budgetCfg(), BudgetModeEnabled(), durationFromEnvMin(), envTruthy(), FilterProviderNamesForBudget(), GF2EffectiveCacheTTL(), GF2EffectiveRateLimitPerMin() (+20 more)

### Community 2 - "CanonicalSegment"
Cohesion: 0.11
Nodes (39): extractFlightNumbers(), flightNumberInText(), flightNumbersEquivalent(), splitFlightDesignator(), textContainsAirport(), textContainsAny(), timeMatches(), TestFlightNumbersEquivalent_leadingZeros() (+31 more)

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "runBookingMatch"
Cohesion: 0.07
Nodes (51): TestHandleBookingResolve_prodShapeKiwiIsrairHTTP(), TestRunBookingMatch_kiwiMixedCarriersNoAustrianDeeplink(), TestRunBookingMatch_kiwiWizzSellerPrimaryWithAirlineSecondary(), TestRunBookingMatch_prodShapeKiwiIsrairGetsAirlinePrefill(), TestRunBookingMatch_mergesOTAPartners(), acquireBookingResolveSlot(), beginInflightResolve(), bookingResolveCacheKey() (+43 more)

### Community 5 - "session_store.go"
Cohesion: 0.15
Nodes (24): loadSearchSession(), markSessionFailed(), publishSessionSnapshot(), TestLoadSearchSession_Expiry(), searchSessionTTL(), startSearchSessionCleanup(), cleanupPersistedSessions(), importLegacyJSONSessions() (+16 more)

### Community 6 - "frontend/package.json"
Cohesion: 0.06
Nodes (40): config, { getDefaultConfig }, dependencies, expo@~52.0.0, @expo/metro-runtime@~4.0.1, expo-status-bar@~2.0.0, react@18.3.1, react-dom@18.3.1 (+32 more)

### Community 7 - "useTheme"
Cohesion: 0.07
Nodes (66): ClearableTextInput(), ClearableTextInputProps, styles, styles, EditSearchModalProps, s, HubRouteLeg, HubRouteSummaryModalProps (+58 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (33): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+25 more)

### Community 9 - "FlightOption"
Cohesion: 0.06
Nodes (65): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, CanonicalFingerprint(), TestCapOptionsKeepingVariety(), Carrier, TestProviderResultsToFlightOptions_PreservesCarrierName() (+57 more)

### Community 10 - "flight-scraper/package.json"
Cohesion: 0.11
Nodes (17): express, playwright, dependencies, express@^4.21.2, playwright@^1.49.1, description, engines, node (+9 more)

### Community 11 - "GF2SearchAirports"
Cohesion: 0.14
Nodes (16): gf2MetroKey(), GF2SearchAirports(), ResolveGF2PlaceCode(), containsAll(), TestGF2SearchAirports_CityOnlyCode(), TestGF2SearchAirports_LondonParis(), TestGF2SearchAirports_SingleAirport(), TestGF2SearchAirports_SpecificAirportNotExpanded() (+8 more)

### Community 12 - "BookingOptionsFooter.tsx"
Cohesion: 0.10
Nodes (39): BookingResolveResponse, isSafeBookingUrl(), PublicBookingOffer, DisplayPrice(), DisplayPriceProps, bookingOfferProviderLabel(), bookingOfferSubtitle(), formatBookingOfferPriceAmount() (+31 more)

### Community 13 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 14 - "FlightDetailsModal.tsx"
Cohesion: 0.06
Nodes (68): AIRLINE_NAMES, formatAirlineFilterLabel(), getAirlineName(), resolveAirlineLabel(), AIRLINE_FULL_NAMES, getAirportNameByCode(), airportTimeZones, getAirportTimeZone() (+60 more)

### Community 15 - "resolveGF2PartnerOffers"
Cohesion: 0.05
Nodes (66): BuildLegAirlineDirectURL(), BuildRedirectURL(), getAffiliateID(), TestBuildLegAirlineDirectURL_austrianHasNoUnverifiedLink(), stripEmptyQueryParams(), TestBuildLegAirlineDirectURL_wizzRoundTripReturnDate(), allocateLegQuoteAmount(), attachQuotedPriceMeta() (+58 more)

### Community 16 - "MonthDealsScreen.tsx"
Cohesion: 0.06
Nodes (49): getDealsRange(), GetDealsRangeParams, GetMonthDealsParams, getFlightDetails(), GetFlightDetailsParams, CheaperCitiesOption, CheaperCitiesSection(), Props (+41 more)

### Community 17 - "resolveOTAPartnerOffers"
Cohesion: 0.12
Nodes (16): flightSegmentToOtaMap(), isOTAScrapedSource(), isSellerOTASource(), otaFirstNonEmpty(), otaListingPrefillURL(), otaResolveClockHints(), otaResolveSegmentsPayload(), otaResolveSiteForSource() (+8 more)

### Community 18 - "ErrorBoundary"
Cohesion: 0.15
Nodes (4): ErrorBoundary, Props, s, State

### Community 19 - "server.go"
Cohesion: 0.05
Nodes (131): TestBuildLegAirlineDirectURL_wizzPathNotHash(), airlineDomainForCarrier(), applySearchQuoteToOffer(), bookingMatchPriceNormalizer(), dedupeGF2PartnerOffers(), gf2OffersHavePrice(), gf2PartnerOfferFromQuoteURL(), gf2PartnerOfferFromResolved() (+123 more)

### Community 22 - "skyscanner.js"
Cohesion: 0.11
Nodes (41): com, fr, req, pageLooksBlocked(), addPartner(), clickMatchingKiwiCard(), clickMatchingSkyscannerCard(), clocksFromSegments() (+33 more)

### Community 23 - "TestResult"
Cohesion: 0.19
Nodes (3): ResponseAnalyzer, main(), _print_unreachable_backend_hint()

### Community 25 - "runtime_config.go"
Cohesion: 0.19
Nodes (18): adminAccessConfigured(), isAdminRequest(), configRangeError, adminTokenConfigured(), adminTokenFromHeader(), defaultRuntimeConfig(), errConfigOutOfRange(), getRuntimeConfig() (+10 more)

### Community 26 - "AppIcon"
Cohesion: 0.09
Nodes (45): AppIcon(), AppIconLibrary, AppIconProps, styles, DestinationMoodBanner(), DestinationMoodStrip(), moodSizeForVariant(), stripStyles (+37 more)

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.30
Nodes (10): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+2 more)

### Community 29 - "auth.go"
Cohesion: 0.12
Nodes (31): GetClicksSummary(), getOTAProvider(), GetSessionAndOption(), ParseOptionIndex(), RecordClick(), ResolveProvider(), handleAuthLogout(), ClicksSummaryResponse (+23 more)

### Community 30 - "session.js"
Cohesion: 0.16
Nodes (19): withCdpLock(), blockHeavyResources(), getOpenPageHook(), browserPromises, { chromium, firefox }, getBrowser(), isTransientScrapeError(), pickReusablePage() (+11 more)

### Community 31 - "dealsCache.ts"
Cohesion: 0.33
Nodes (12): clearPendingDealsParams(), DealsParams, dealsParamsFingerprint(), getCachedDealsResults(), getLocalStorage(), getPendingDealsParams(), getSessionStorage(), migrateLegacySessionParams() (+4 more)

### Community 32 - "CanonicalItinerary"
Cohesion: 0.14
Nodes (28): extractPrice(), cfgTest(), testConnectingTLVJFK(), TestExtractPrice_euroPrefixNotArrivalTime(), TestGenerateQueries_connecting(), TestGenerateQueries_direct(), TestGenerateQueries_gf2AirlineNameIdentity(), TestGenerateQueries_includesRouteDateBookQuery() (+20 more)

### Community 33 - "ExploreScreen.tsx"
Cohesion: 0.15
Nodes (25): getMonthDeals(), getExploreDestinations(), getCityDisplayName(), c, countryFlag(), d, DestCard(), ExploreScreen() (+17 more)

### Community 34 - "explore_cache.go"
Cohesion: 0.10
Nodes (20): airportCoord, exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut(), getAirportCoord() (+12 more)

### Community 36 - "Backend QA Automation Tool"
Cohesion: 0.18
Nodes (10): Backend QA Automation Tool, Features, If the run feels slow or “stuck”, Notes, Optional AI Setup (Ollama), Output, Project Structure, Run (+2 more)

### Community 37 - "test-roundtrip-legs.js"
Cohesion: 0.13
Nodes (20): a, arr, assert, b, dep, late, assert, frSegs (+12 more)

### Community 38 - "LookupAirlineIATA"
Cohesion: 0.24
Nodes (12): TestLookupAirlineIATA_Israir(), airlineAliasKey(), LooksLikeAirportLabel(), LookupAirlineIATA(), TestLooksLikeAirportLabel(), TestLookupAirlineIATA(), TestResolveFlightIdentity_rejectsAirportAsCarrier(), CarrierDisplayName() (+4 more)

### Community 39 - "search.ts"
Cohesion: 0.13
Nodes (28): CachedResult, createSearchSession(), createSearchSessionWithRetry(), ensureLegacyPurge(), fetchFresh(), getFromStorage(), getSearchSessionResults(), getStorage() (+20 more)

### Community 40 - "ThemeContext.tsx"
Cohesion: 0.13
Nodes (16): Bone(), ResultsSkeletonCard(), ResultsSkeletonList(), sk, motion, darkTheme, FONTS, lightTheme (+8 more)

### Community 42 - "AirportAutocomplete.tsx"
Cohesion: 0.05
Nodes (69): __dirname, dist, indexHtml, indexPath, SPA_ROUTES, AIRPORT_DICTIONARY, AIRPORT_ONLY_DICTIONARY, FULL_PLACE_DICTIONARY (+61 more)

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "skyscanner.ts"
Cohesion: 0.39
Nodes (11): BookingHop, bookingHopsFromOption(), firstSeg(), isClassicRoundTripLegs(), isoDatePrefix(), isSplitBookingItinerary(), lastSeg(), legCarrierCode() (+3 more)

### Community 45 - "searchProgressRatio.test.ts"
Cohesion: 0.40
Nodes (3): fin, full, half

### Community 46 - "test_cases"
Cohesion: 0.05
Nodes (40): departureDate, origin, byProvider, currency, error, from, items, route (+32 more)

### Community 47 - "RootNavigator.tsx"
Cohesion: 0.08
Nodes (34): Nav, SiteFooter(), styles, moodImageUrlForVariant(), LandingMoodImage(), LandingScreen(), Nav, styles (+26 more)

### Community 53 - "SearchRequest"
Cohesion: 0.12
Nodes (21): TestCompleteExtraLegs(), TestExtraLegsFingerprint(), truncateStr(), TestSanitizeStandardSearchRequest(), TestDynamicDestinationOneWayRequests_extraLegs(), TestDynamicDestinationOneWayRequests_openJaw(), dynamicDestinationOneWayRequests(), flattenOtaScraperResponse() (+13 more)

### Community 54 - "Nginx Proxy Manager — fly-fix TLS checklist"
Cohesion: 0.40
Nodes (4): Nginx Proxy Manager — fly-fix TLS checklist, Reissue frontend cert (both names), Required proxy-host settings, Symptoms Chrome shows

### Community 55 - "handleCreateSession"
Cohesion: 0.16
Nodes (13): CreateSearchSessionRequest, ExtraSearchLeg, ProviderSearchStats, SearchProgress, SearchSession, SearchSessionResultsResponse, SearchSessionStatus, finalizeSearchSession() (+5 more)

### Community 56 - "googleflights2_provider.go"
Cohesion: 0.08
Nodes (52): TestParseGF2TimeWithDateHint_AirportLocal(), TestExtractGF2BookingToken(), TestBuildGF2ResultFromItinerary_FlatFormat(), TestParseGF2Response_AttachesFlatReturnFlights(), TestParseGF2Response_RapidAPIFlatTopFlights(), TestParseGF2Response_topFlightsWithoutPriceHistory(), TestExtractGF2Leg_TimeOnly_NoDateHint(), TestExtractGF2SegmentFromFlight_CodeOnlyHasNoName() (+44 more)

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
Cohesion: 0.06
Nodes (71): Responsive, collectTripDestinationCodes(), EditSearchModal(), HubRouteSummaryModal(), s, SearchSummaryBar(), SearchSummaryBarProps, defaultParams (+63 more)

### Community 63 - "auth.go"
Cohesion: 0.15
Nodes (30): authUserJSON(), bearerTokenFromRequest(), bootstrapAdminUser(), createAuthSession(), envFlagTrue(), handleAuthChangePassword(), handleAuthLogin(), handleAuthMe() (+22 more)

### Community 64 - "booking.ts"
Cohesion: 0.36
Nodes (8): BookingResolveRequest, BookingResolveStatus, bookingRetryDelayMs(), fetchBookingResolveOnce(), isTransientBookingFetchError(), isTransientBookingResolveResponse(), PublicBookingAlternative, resolveBookingOffer()

### Community 65 - "npm"
Cohesion: 0.17
Nodes (11): networks, proxy, container_name, image, networks, ports, restart, volumes (+3 more)

### Community 67 - "kiwi.js"
Cohesion: 0.18
Nodes (20): assert, clearKiwiSpaState(), ensureKiwiResultsUrl(), extractFromCaptured(), extractNextData(), flattenOffers(), kiwiPathLooksCorrect(), kiwiSearchUrl() (+12 more)

### Community 69 - "nginx-proxy-manager (VPS edge)"
Cohesion: 0.40
Nodes (4): Deploy sync, First-time / recovery, nginx-proxy-manager (VPS edge), On the server

### Community 70 - "RuntimeConfigContext.tsx"
Cohesion: 0.17
Nodes (16): apiRequest(), apiUrl(), adminAuthHeaders(), fetchAdminRuntimeConfig(), fetchRuntimeConfig(), saveAdminRuntimeConfig(), setRuntimeConfigStore(), RuntimeConfigContext (+8 more)

### Community 72 - ".SearchAll"
Cohesion: 0.15
Nodes (14): TestSanitizeProviderErrorForUser(), TestRegistryFailureMessage_transientOutbound(), TestRegistrySearchAll_dedupeComparesInRequestedCurrency(), TestRegistrySearchAll_fastOnlySkipsScraper(), TestRegistrySearchAll_openJawGF2FailNotMaskedByKiwiSkip(), TestRegistrySearchAllPartialFailure(), TestRegistrySearchAllWithProgress(), convertResultsToCurrency() (+6 more)

### Community 73 - "App.tsx"
Cohesion: 0.05
Nodes (65): App(), linking, RTLWrapper(), authHeaders(), AuthUser, changePassword(), createUser(), deleteUser() (+57 more)

### Community 74 - "warm.js"
Cohesion: 0.09
Nodes (23): cdpLockBusy(), chain, DEFAULT_SITES, beginSearch(), endSearch(), isSearchBusy(), app, express (+15 more)

### Community 75 - "SearchLoadingOverlay.tsx"
Cohesion: 0.06
Nodes (42): getAlmostDonePhrase(), getPhrasesForLanguage(), pickSearchStatusPhrase(), providerPhraseMap(), SEARCH_ALMOST_DONE, SEARCH_BUTTON_ALMOST_DONE, SEARCH_BUTTON_PHRASES, SEARCH_PROGRESS_PHRASES (+34 more)

### Community 76 - "flyfix.ts"
Cohesion: 0.29
Nodes (7): apiPost(), FlyfixInsightsGroup, FlyfixIssue, FlyfixRefinedReport, FlyfixSummary, refineIssues(), RefineIssuesRequestBody

### Community 77 - "testing.T"
Cohesion: 0.06
Nodes (54): TestParseOtaOffers_normalizesIsrairDisplayName(), AirportLocation(), TestAirportLocation_UnknownFallsBackUTC(), TestParseGF2TimeWithDateHint_TelAviv(), ExploreBudgetLimits(), resetBudgetEnv(), TestExploreBudgetLimits_budget(), TestExploreBudgetLimits_defaultsWithoutBudget() (+46 more)

### Community 78 - "ProviderResult"
Cohesion: 0.08
Nodes (30): DedupeProviderResults(), ItineraryFingerprint(), mergeSelfTransfer(), uniqueStrings(), TestCombineOneWayBatches(), TestCombineOneWayBatches_emptyBatch(), TestCombineOneWayBatches_keepsNonstopsBothWays(), TestCombineOneWayBatches_openJawReturnDiversity() (+22 more)

### Community 79 - "CanonicalItinerary"
Cohesion: 0.21
Nodes (10): TotalStops(), BuildCanonicalItinerary(), CanonicalItinerary, ResultMatchesItinerary(), TestResultMatchesItinerary_OTAToGF2AcrossProviders(), TestResultMatchesItinerary_RejectsDifferentFlightNumber(), sumCanonicalSegmentDurations(), CanonicalLeg (+2 more)

### Community 80 - "test-kiwi-parse.js"
Cohesion: 0.20
Nodes (10): assert, offers, pending, req, bookingUrlFor(), extractKiwiUmbrella(), kiwiUmbrellaSettled(), sectorSegments() (+2 more)

### Community 81 - "client.ts"
Cohesion: 0.20
Nodes (10): searchAirports(), API_BASE, apiGet(), isLocalHostname(), resolveApiBase(), ExploreResponse, GetExploreDestinationsParams, DestCardProps (+2 more)

### Community 83 - "Fly-Fix UI / UX"
Cohesion: 0.22
Nodes (8): Avoid (AI-vibe tells), Checklist before shipping UI, Design north star, Fly-Fix UI / UX, Phase 0 decisions (locked), Prefer, Screen rules, Tokens (source of truth)

### Community 84 - "TestApplySoftStrictBaggage"
Cohesion: 0.52
Nodes (6): applySoftStrictBaggage(), makeOfferWithBags(), makeOfferWithMissingBags(), TestApplySoftStrictBaggage(), TestClassifyOfferBaggage(), classifyOfferBaggage()

### Community 85 - "backend_api_contracts.md"
Cohesion: 0.18
Nodes (10): 1.1 Create Search Session, 1.2 Get Search Session Status & Results, 1. Flight Search Sessions, 2.1 Get Monthly Deals, 2. Monthly Deals API, 3.1 Search Airports & Cities, 3. Airport & City Autocomplete, 4. High-Level Handler Layout (Go) (+2 more)

### Community 87 - "debug-skyscanner-live.js"
Cohesion: 0.20
Nodes (9): extractSkyscanner(), req, skyscannerUrl(), url, waitUntil(), expediaUrl(), scrapeExpedia(), attachJsonCapture() (+1 more)

### Community 88 - "Flight scraper (multisite)"
Cohesion: 0.29
Nodes (6): Docker, Flight scraper (multisite), Residential EU proxy, Run locally, VPS (recommended): headed Chrome on `:99`, When Skyscanner returns 0 offers

### Community 89 - "affiliate.ts"
Cohesion: 0.27
Nodes (9): AffiliateProvider, AffiliateProviderResponse, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink(), OutboundLinkResponse (+1 more)

### Community 92 - "time.Time"
Cohesion: 0.14
Nodes (19): elapsedMs(), minutesOfDay(), CodeshareFingerprint(), roundTimeToMinutes(), ClickRecord, FullRoundTrip, attachReturnLegKeepPrice(), ensureRoundTripLegs() (+11 more)

### Community 93 - "scrape.js"
Cohesion: 0.24
Nodes (13): assert, kiwi, pxSky, sky, hasCdp(), runWithSiteBudget(), scrapeAll(), scrapeSerial() (+5 more)

### Community 94 - "GoogleFlights2Provider"
Cohesion: 0.13
Nodes (13): SelectCheapestResolvedPartner(), classicRoundTripMissingReturn(), TestDoSearchWithRetry_doesNotCacheRoundTrip(), TestSearch_ignoresIncompleteClassicRTCache(), TestSearch_servesCompleteClassicRTCache(), GoogleFlights2Provider, newGF2Cache(), newGF2RateLimiter() (+5 more)

### Community 95 - "Fly-Fix — Design System & Cursor Redesign Playbook"
Cohesion: 0.22
Nodes (8): 1. Product and brand direction, 2. Design tokens (proposed starting values), 3. Core product patterns, 4. Motion, 5. Cursor workflow phases, 6. Non-negotiable constraints, 7. Working method, Fly-Fix — Design System & Cursor Redesign Playbook

### Community 98 - "server_carrier_test.go"
Cohesion: 0.43
Nodes (6): CarrierCodes, makeOfferWithCarriers(), TestExtractCarrierCodes(), TestPrimaryDisplayCarrier(), ExtractCarrierCodes(), PrimaryDisplayCarrier()

### Community 99 - "handleExplore"
Cohesion: 0.20
Nodes (11): exploreSessionKey(), getExploreSession(), newExploreSessionID(), putExploreSession(), startExploreSessionCleanup(), exploreSession, corsMiddleware(), fetchExchangeRates() (+3 more)

### Community 101 - "ensure-flight-chrome.sh"
Cohesion: 0.52
Nodes (6): chrome_proxy_args(), DISPLAY, ensure_gateway_proxy(), load_scraper_proxy_env(), log(), ensure-flight-chrome.sh script

### Community 106 - "Frontend Design"
Cohesion: 0.25
Nodes (7): Design principles, Fly-Fix (this repo), Frontend Design, Ground your designs in the subject matter, More on writing in design, Process: plan, review against the brief, build, critique, Restraint and self-critique

### Community 107 - "CalendarModal.tsx"
Cohesion: 0.38
Nodes (6): buildMonthDays(), CalendarModal(), getMonthStart(), Props, styles, WEEKDAYS

## Knowledge Gaps
- **3 isolated node(s):** `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 646 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Fly-Fix` connect `Features` to `MonthDealsScreen.tsx`?**
  _High betweenness centrality (0.305) - this node is a cross-community bridge._
- **What connects `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `.ResolveQuotedPartnerBooking` be split into smaller, more focused modules?**
  _Cohesion score 0.12307692307692308 - nodes in this community are weakly interconnected._
- **Why does `Multi-provider flight search` connect `Features` to `time.Duration`?**
  _High betweenness centrality (0.299) - this node is a cross-community bridge._
- **Should `time.Duration` be split into smaller, more focused modules?**
  _Cohesion score 0.07254623044096728 - nodes in this community are weakly interconnected._
- **Why does `Recent enhancements` connect `MonthDealsScreen.tsx` to `Features`, `AppIcon`?**
  _High betweenness centrality (0.290) - this node is a cross-community bridge._
- **Should `CanonicalSegment` be split into smaller, more focused modules?**
  _Cohesion score 0.10931174089068826 - nodes in this community are weakly interconnected._