# Graph Report - workspace  (2026-11-19)

## Corpus Check
- 329 files · ~270,271 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 18 file(s) not represented in the graph (top: (none) 8, .mdc 2, .example 2)

## Summary
- 2724 nodes · 8817 edges · 108 communities (88 shown, 20 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 734 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a3496b3c`
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
- CanonicalItinerary
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
- api.ts
- CanonicalItinerary
- LocaleContext.tsx
- explore_cache.go
- ValidationIssue
- Backend QA Automation Tool
- test-roundtrip-legs.js
- LookupAirlineIATA
- search.ts
- ThemeContext.tsx
- models.py
- ExploreScreen.tsx
- Fly-Fix – Frontend
- handleBookingResolve
- searchProgressRatio.test.ts
- test_cases
- LandingScreen.tsx
- gen_explore_airport_coords.py
- flightcaptainweb
- SearchRequest
- Nginx Proxy Manager — fly-fix TLS checklist
- SearchSessionResultsResponse
- googleflights2_provider.go
- .finalize
- FlightResultCard.tsx
- steps
- flyfix-api
- skyscannerParse.js
- ResultsScreen.tsx
- auth_test.go
- booking.ts
- npm
- types.ts
- kiwi.js
- destinationMood.test.ts
- nginx-proxy-manager (VPS edge)
- RuntimeConfigContext.tsx
- resolvePartners.js
- .SearchAll
- AuthContext.tsx
- warm.js
- SearchSubmitButton.tsx
- flyfix.ts
- testing.T
- ProviderResult
- displayAirlines.ts
- test-kiwi-parse.js
- client.ts
- .Search
- Fly-Fix UI / UX
- TestApplySoftStrictBaggage
- backend_api_contracts.md
- ensure-edge-proxy.sh
- FiltersPanel.tsx
- Flight scraper (multisite)
- affiliate.ts
- install-edge-proxy-cron.sh
- sync-edge-stack.sh
- time.Time
- scrape.js
- context.Context
- Fly-Fix — Design System & Cursor Redesign Playbook
- ExploreBudgetLimits
- DatePickerCalendar.tsx
- server_carrier_test.go
- handleExplore
- ensure-flight-vnc.sh
- ensure-flight-chrome.sh
- ensure-scraper-proxy-forwarder.sh
- docker-entrypoint.sh
- after-reboot-flight.sh
- Frontend Design

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 108 edges
2. `useLocale()` - 98 edges
3. `react` - 76 edges
4. `react-native` - 70 edges
5. `ProviderResult` - 62 edges
6. `ResultsScreen()` - 60 edges
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
- `Recent enhancements` --references--> `CheaperCitiesSection()`  [INFERRED]
  README.md → frontend/src/features/flight-search/components/CheaperCitiesSection.tsx
- `2.1 Get Monthly Deals` --references--> `FullRoundTrip`  [INFERRED]
  backend/backend_api_contracts.md → backend/gf2_deals.go

## Import Cycles
- None detected.

## Communities (108 total, 20 thin omitted)

### Community 0 - ".ResolveQuotedPartnerBooking"
Cohesion: 0.10
Nodes (29): isTransientGF2BookingErr(), resolveAllPartnerBookingsFromTokenWithRetry(), bookingResolveFailureResponse(), findBookingOptionsArray(), firstPartnerBookingOption(), firstPartnerURLInMap(), firstStringByKeys(), ResolvedPartnerBooking (+21 more)

### Community 1 - "time.Duration"
Cohesion: 0.08
Nodes (26): budgetCfg(), durationFromEnvMin(), envTruthy(), FilterProviderNamesForBudget(), GF2EffectiveCacheTTL(), GF2EffectiveRateLimitPerMin(), GF2MetroConcurrency(), GF2SkipRoundTripEnrich() (+18 more)

### Community 2 - "CanonicalSegment"
Cohesion: 0.11
Nodes (39): extractFlightNumbers(), flightNumberInText(), flightNumbersEquivalent(), splitFlightDesignator(), textContainsAirport(), textContainsAny(), timeMatches(), TestFlightNumbersEquivalent_leadingZeros() (+31 more)

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "runBookingMatch"
Cohesion: 0.11
Nodes (34): TestRunBookingMatch_kiwiMixedCarriersNoAustrianDeeplink(), TestRunBookingMatch_kiwiWizzSellerPrimaryWithAirlineSecondary(), TestRunBookingMatch_prodShapeKiwiIsrairGetsAirlinePrefill(), isOTAScrapedSource(), otaListingPrefillURL(), TestIsOTAScrapedSource(), TestRunBookingMatch_mergesOTAPartners(), canonicalItineraryForOption() (+26 more)

### Community 5 - "session_store.go"
Cohesion: 0.18
Nodes (22): loadSearchSession(), markSessionFailed(), publishSessionSnapshot(), TestLoadSearchSession_Expiry(), searchSessionTTL(), startSearchSessionCleanup(), cleanupPersistedSessions(), importLegacyJSONSessions() (+14 more)

### Community 6 - "frontend/package.json"
Cohesion: 0.06
Nodes (41): config, { getDefaultConfig }, dependencies, expo@~52.0.0, @expo/metro-runtime@~4.0.1, expo-status-bar@~2.0.0, react@18.3.1, react-dom@18.3.1 (+33 more)

### Community 7 - "useTheme"
Cohesion: 0.07
Nodes (69): ClearableTextInput(), ClearableTextInputProps, styles, DisplayPrice(), DisplayPriceProps, styles, formatProviderError(), labelForProvider() (+61 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (31): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+23 more)

### Community 9 - "FlightOption"
Cohesion: 0.06
Nodes (67): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, CanonicalFingerprint(), TestCapOptionsKeepingVariety(), Carrier, CarrierCodes (+59 more)

### Community 10 - "flight-scraper/package.json"
Cohesion: 0.11
Nodes (17): express, playwright, dependencies, express@^4.21.2, playwright@^1.49.1, description, engines, node (+9 more)

### Community 11 - "GF2SearchAirports"
Cohesion: 0.12
Nodes (18): GF2MetroMaxAirports(), gf2MetroKey(), GF2SearchAirports(), limitGF2SearchAirports(), ResolveGF2PlaceCode(), containsAll(), TestGF2SearchAirports_CityOnlyCode(), TestGF2SearchAirports_LondonParis() (+10 more)

### Community 12 - "BookingOptionsFooter.tsx"
Cohesion: 0.17
Nodes (27): BookingResolveResponse, isSafeBookingUrl(), PublicBookingOffer, bookingOfferProviderLabel(), bookingOfferSubtitle(), formatBookingOfferPriceAmount(), formatBookingOfferPriceLine(), formatProviderDisplayName() (+19 more)

### Community 13 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 14 - "FlightDetailsModal.tsx"
Cohesion: 0.13
Nodes (32): getAirportNameByCode(), airportTimeZones, getAirportTimeZone(), cabinLabel(), FlightDetailsModal(), formatDuration(), layoverBetween(), legDuration() (+24 more)

### Community 15 - "resolveGF2PartnerOffers"
Cohesion: 0.05
Nodes (68): BuildLegAirlineDirectURL(), BuildRedirectURL(), getAffiliateID(), TestBuildLegAirlineDirectURL_austrianHasNoUnverifiedLink(), stripEmptyQueryParams(), TestBuildLegAirlineDirectURL_wizzRoundTripReturnDate(), allocateLegQuoteAmount(), attachQuotedPriceMeta() (+60 more)

### Community 16 - "MonthDealsScreen.tsx"
Cohesion: 0.08
Nodes (48): getMonthDeals(), getFlightDetails(), buildDealsPositioningSignature(), dealBestScore(), fl, fmtDur(), formatDealDate(), hfm (+40 more)

### Community 17 - "CanonicalItinerary"
Cohesion: 0.11
Nodes (19): flightSegmentToOtaMap(), isSellerOTASource(), otaFirstNonEmpty(), otaResolveClockHints(), otaResolveSegmentsPayload(), otaResolveSiteForSource(), resolveOTAPartnerOffers(), TestResolveOTAPartnerOffers_usesExistingCheckoutDeepLink() (+11 more)

### Community 18 - "ErrorBoundary"
Cohesion: 0.15
Nodes (4): ErrorBoundary, Props, s, State

### Community 19 - "server.go"
Cohesion: 0.05
Nodes (130): TestBuildLegAirlineDirectURL_wizzPathNotHash(), airlineDomainForCarrier(), applySearchQuoteToOffer(), bookingMatchPriceNormalizer(), dedupeGF2PartnerOffers(), gf2OffersHavePrice(), gf2PartnerOfferFromQuoteURL(), gf2PartnerOfferFromResolved() (+122 more)

### Community 22 - "skyscanner.js"
Cohesion: 0.11
Nodes (31): com, fr, req, extractSkyscanner(), req, skyscannerUrl(), url, expediaUrl() (+23 more)

### Community 23 - "TestResult"
Cohesion: 0.19
Nodes (3): ResponseAnalyzer, main(), _print_unreachable_backend_hint()

### Community 25 - "runtime_config.go"
Cohesion: 0.22
Nodes (16): adminAccessConfigured(), configRangeError, adminTokenConfigured(), defaultRuntimeConfig(), errConfigOutOfRange(), getRuntimeConfig(), handleAdminRuntimeConfig(), initRuntimeConfigStore() (+8 more)

### Community 26 - "AppIcon"
Cohesion: 0.07
Nodes (53): AppIcon(), AppIconLibrary, AppIconProps, styles, DestinationMoodBanner(), moodSizeForVariant(), stripStyles, styles (+45 more)

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.30
Nodes (10): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+2 more)

### Community 29 - "auth.go"
Cohesion: 0.11
Nodes (46): getOTAProvider(), GetSessionAndOption(), ParseOptionIndex(), RecordClick(), ResolveProvider(), authUserJSON(), bearerTokenFromRequest(), bootstrapAdminUser() (+38 more)

### Community 30 - "session.js"
Cohesion: 0.17
Nodes (20): pageLooksBlocked(), withCdpLock(), blockHeavyResources(), getOpenPageHook(), browserPromises, { chromium, firefox }, getBrowser(), isTransientScrapeError() (+12 more)

### Community 31 - "api.ts"
Cohesion: 0.10
Nodes (26): SearchSourcesBannerProps, FiltersPanelProps, FlightDetailsModalProps, FlightResultCardProps, SortBarProps, PositioningLegResult, dealsActions, defaultFilters (+18 more)

### Community 32 - "CanonicalItinerary"
Cohesion: 0.14
Nodes (28): extractPrice(), cfgTest(), testConnectingTLVJFK(), TestExtractPrice_euroPrefixNotArrivalTime(), TestGenerateQueries_connecting(), TestGenerateQueries_direct(), TestGenerateQueries_gf2AirlineNameIdentity(), TestGenerateQueries_includesRouteDateBookQuery() (+20 more)

### Community 33 - "LocaleContext.tsx"
Cohesion: 0.12
Nodes (23): getStorage(), languageToLocale(), loadSaved(), LocaleContext, LocaleContextValue, LocaleProvider(), save(), VALID_CURRENCIES (+15 more)

### Community 34 - "explore_cache.go"
Cohesion: 0.09
Nodes (21): airportCoord, exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut(), getAirportCoord() (+13 more)

### Community 36 - "Backend QA Automation Tool"
Cohesion: 0.18
Nodes (10): Backend QA Automation Tool, Features, If the run feels slow or “stuck”, Notes, Optional AI Setup (Ollama), Output, Project Structure, Run (+2 more)

### Community 37 - "test-roundtrip-legs.js"
Cohesion: 0.13
Nodes (19): a, arr, assert, b, dep, late, assert, frSegs (+11 more)

### Community 38 - "LookupAirlineIATA"
Cohesion: 0.24
Nodes (12): TestLookupAirlineIATA_Israir(), airlineAliasKey(), LooksLikeAirportLabel(), LookupAirlineIATA(), TestLooksLikeAirportLabel(), TestLookupAirlineIATA(), TestResolveFlightIdentity_rejectsAirportAsCarrier(), CarrierDisplayName() (+4 more)

### Community 39 - "search.ts"
Cohesion: 0.13
Nodes (27): CachedResult, createSearchSession(), createSearchSessionWithRetry(), ensureLegacyPurge(), fetchFresh(), getFromStorage(), getSearchSessionResults(), getStorage() (+19 more)

### Community 40 - "ThemeContext.tsx"
Cohesion: 0.10
Nodes (27): App(), linking, RTLWrapper(), useExchangeRates(), DocumentLike, Focusable, useKeepFocusedFieldVisible(), RootNavigator() (+19 more)

### Community 42 - "ExploreScreen.tsx"
Cohesion: 0.08
Nodes (66): getExploreDestinations(), AIRPORT_ONLY_DICTIONARY, FULL_PLACE_DICTIONARY, getAirportDisplayName(), getAirportEntry(), getCityDisplayName(), lower(), matchesQuery() (+58 more)

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "handleBookingResolve"
Cohesion: 0.11
Nodes (23): TestHandleBookingResolve_prodShapeKiwiIsrairHTTP(), beginInflightResolve(), bookingResolveCacheKey(), cacheTTLForStatus(), dualBookingOptionCount(), finishInflightResolve(), getCachedBookingResolve(), handleBookingResolve() (+15 more)

### Community 45 - "searchProgressRatio.test.ts"
Cohesion: 0.40
Nodes (3): fin, full, half

### Community 46 - "test_cases"
Cohesion: 0.05
Nodes (40): departureDate, origin, byProvider, currency, error, from, items, route (+32 more)

### Community 47 - "LandingScreen.tsx"
Cohesion: 0.07
Nodes (43): Responsive, s, SearchSummaryBarProps, SiteFooter(), AIRPORT_DICTIONARY, AIRPORT_FALLBACK_IMAGE, ASSIGNED_URLS, BY_CODE (+35 more)

### Community 53 - "SearchRequest"
Cohesion: 0.11
Nodes (26): TestCompleteExtraLegs(), TestExtraLegsFingerprint(), truncateStr(), TestIsOpenJaw(), TestResolveReturnAirports_classic(), TestResolveReturnAirports_openJaw(), TestSanitizeStandardSearchRequest(), TestDynamicDestinationOneWayRequests_extraLegs() (+18 more)

### Community 54 - "Nginx Proxy Manager — fly-fix TLS checklist"
Cohesion: 0.40
Nodes (4): Nginx Proxy Manager — fly-fix TLS checklist, Reissue frontend cert (both names), Required proxy-host settings, Symptoms Chrome shows

### Community 55 - "SearchSessionResultsResponse"
Cohesion: 0.28
Nodes (9): ProviderSearchStats, SearchProgress, SearchSession, SearchSessionResultsResponse, SearchSessionStatus, pageSearchSessionForClient(), publishSearchProgress(), sanitizeSessionForClient() (+1 more)

### Community 56 - "googleflights2_provider.go"
Cohesion: 0.08
Nodes (52): TestParseGF2TimeWithDateHint_AirportLocal(), TestExtractGF2BookingToken(), TestBuildGF2ResultFromItinerary_FlatFormat(), TestParseGF2Response_AttachesFlatReturnFlights(), TestParseGF2Response_RapidAPIFlatTopFlights(), TestParseGF2Response_topFlightsWithoutPriceHistory(), TestExtractGF2Leg_TimeOnly_NoDateHint(), TestExtractGF2SegmentFromFlight_CodeOnlyHasNoName() (+44 more)

### Community 58 - "FlightResultCard.tsx"
Cohesion: 0.16
Nodes (21): buildRoutePath(), c, FlightResultCard(), LegScheduleBlock(), FlightSegment, LayoverSummary, OutboundSummary, hasMultipleAirlines() (+13 more)

### Community 59 - "steps"
Cohesion: 0.09
Nodes (22): runs-on, steps, jobs, deploy, name, on, push, workflow_dispatch (+14 more)

### Community 60 - "flyfix-api"
Cohesion: 0.06
Nodes (37): context, FLIGHT_SCRAPER_MAX_CONCURRENT, FLIGHT_SCRAPER_URL, PLAYWRIGHT_HEADLESS, PORT, SCRAPER_CDP_URLS, SCRAPER_PROXY_URL, SCRAPER_WARM_ON_START (+29 more)

### Community 61 - "skyscannerParse.js"
Cohesion: 0.12
Nodes (28): assert, english, firstPage, named, offers, radarOffers, req, absolutizeSkyscanner() (+20 more)

### Community 62 - "ResultsScreen.tsx"
Cohesion: 0.06
Nodes (72): invalidateSearchSessionResultsCache(), collectTripDestinationCodes(), DestinationMoodStrip(), EditSearchModal(), HubRouteSummaryModal(), SearchSummaryBar(), DynamicDestinationsFormContent(), defaultParams (+64 more)

### Community 63 - "auth_test.go"
Cohesion: 0.36
Nodes (11): handleAuthLogin(), initAuthStore(), purgeExpiredAuthSessions(), purgeExpiredAuthSessionsLoop(), initTestAuthDB(), randomTestPassword(), TestAuthLoginAndChangePassword(), TestAuthRegister() (+3 more)

### Community 64 - "booking.ts"
Cohesion: 0.36
Nodes (8): BookingResolveRequest, BookingResolveStatus, bookingRetryDelayMs(), fetchBookingResolveOnce(), isTransientBookingFetchError(), isTransientBookingResolveResponse(), PublicBookingAlternative, resolveBookingOffer()

### Community 65 - "npm"
Cohesion: 0.17
Nodes (11): networks, proxy, container_name, image, networks, ports, restart, volumes (+3 more)

### Community 66 - "types.ts"
Cohesion: 0.15
Nodes (16): Nav, styles, DynamicDestinationsStack(), Stack, MonthDealsStack(), Stack, SearchStack(), Stack (+8 more)

### Community 67 - "kiwi.js"
Cohesion: 0.16
Nodes (22): assert, waitUntil(), parseRoundTripHm(), clearKiwiSpaState(), ensureKiwiResultsUrl(), extractFromCaptured(), extractNextData(), flattenOffers() (+14 more)

### Community 68 - "destinationMood.test.ts"
Cohesion: 0.11
Nodes (14): __dirname, dist, indexHtml, indexPath, SPA_ROUTES, byCity, compact, curatedCities (+6 more)

### Community 69 - "nginx-proxy-manager (VPS edge)"
Cohesion: 0.40
Nodes (4): Deploy sync, First-time / recovery, nginx-proxy-manager (VPS edge), On the server

### Community 70 - "RuntimeConfigContext.tsx"
Cohesion: 0.18
Nodes (15): apiRequest(), adminAuthHeaders(), fetchAdminRuntimeConfig(), fetchRuntimeConfig(), saveAdminRuntimeConfig(), setRuntimeConfigStore(), RuntimeConfigContext, RuntimeConfigContextValue (+7 more)

### Community 71 - "resolvePartners.js"
Cohesion: 0.23
Nodes (17): addPartner(), clickMatchingKiwiCard(), clickMatchingSkyscannerCard(), clocksFromSegments(), collectPartnerMap(), extractPartnersFromDom(), hmFromIso(), isMetaHost() (+9 more)

### Community 72 - ".SearchAll"
Cohesion: 0.11
Nodes (15): TestSanitizeProviderErrorForUser(), TestRegistryFailureMessage_transientOutbound(), TestRegistrySearchAll_dedupeComparesInRequestedCurrency(), TestRegistrySearchAll_fastOnlySkipsScraper(), TestRegistrySearchAll_openJawGF2FailNotMaskedByKiwiSkip(), TestRegistrySearchAllPartialFailure(), TestRegistrySearchAllWithProgress(), convertResultsToCurrency() (+7 more)

### Community 73 - "AuthContext.tsx"
Cohesion: 0.17
Nodes (22): authHeaders(), AuthUser, changePassword(), createUser(), deleteUser(), fetchAuthMe(), fetchUsers(), LoginResponse (+14 more)

### Community 74 - "warm.js"
Cohesion: 0.09
Nodes (23): cdpLockBusy(), chain, DEFAULT_SITES, beginSearch(), endSearch(), isSearchBusy(), app, express (+15 more)

### Community 75 - "SearchSubmitButton.tsx"
Cohesion: 0.11
Nodes (30): getAlmostDonePhrase(), getPhrasesForLanguage(), pickSearchStatusPhrase(), providerPhraseMap(), SEARCH_ALMOST_DONE, SEARCH_BUTTON_ALMOST_DONE, SEARCH_BUTTON_PHRASES, SEARCH_PROGRESS_PHRASES (+22 more)

### Community 76 - "flyfix.ts"
Cohesion: 0.29
Nodes (7): apiPost(), FlyfixInsightsGroup, FlyfixIssue, FlyfixRefinedReport, FlyfixSummary, refineIssues(), RefineIssuesRequestBody

### Community 77 - "testing.T"
Cohesion: 0.06
Nodes (54): TestParseOtaOffers_normalizesIsrairDisplayName(), TestProviderResultsToFlightOptions_PreservesCarrierName(), TestAttachReturnLegKeepPrice(), TestEnsureRoundTripLegs_noOpWhenTwoLegs(), AirportLocation(), TestAirportLocation_UnknownFallsBackUTC(), TestParseGF2TimeWithDateHint_TelAviv(), TestParseOtaOffers_IsrairNameToIATA() (+46 more)

### Community 78 - "ProviderResult"
Cohesion: 0.09
Nodes (28): DedupeProviderResults(), ItineraryFingerprint(), mergeSelfTransfer(), uniqueStrings(), TestCombineOneWayBatches(), TestCombineOneWayBatches_emptyBatch(), TestCombineOneWayBatches_keepsNonstopsBothWays(), TestCombineOneWayBatches_openJawReturnDiversity() (+20 more)

### Community 79 - "displayAirlines.ts"
Cohesion: 0.26
Nodes (13): AIRLINE_NAMES, formatAirlineFilterLabel(), getAirlineName(), resolveAirlineLabel(), AIRLINE_FULL_NAMES, displayAirlineLabel(), distinctMarketingCarriers(), formatFlightDesignator() (+5 more)

### Community 80 - "test-kiwi-parse.js"
Cohesion: 0.16
Nodes (15): assert, offers, pending, req, offerTemplate(), segment(), bookingUrlFor(), extractKiwiUmbrella() (+7 more)

### Community 81 - "client.ts"
Cohesion: 0.14
Nodes (15): searchAirports(), API_BASE, apiGet(), apiUrl(), isLocalHostname(), resolveApiBase(), GetDealsRangeParams, GetMonthDealsParams (+7 more)

### Community 82 - ".Search"
Cohesion: 0.27
Nodes (8): classicRoundTripMissingReturn(), TestClassicRoundTripMissingReturn(), TestDoSearchWithRetry_doesNotCacheRoundTrip(), TestSearch_ignoresIncompleteClassicRTCache(), TestSearch_servesCompleteClassicRTCache(), newGF2Cache(), TestSearchLegCached_usesCache(), gf2Cache

### Community 83 - "Fly-Fix UI / UX"
Cohesion: 0.22
Nodes (8): Avoid (AI-vibe tells), Checklist before shipping UI, Design north star, Fly-Fix UI / UX, Phase 0 decisions (locked), Prefer, Screen rules, Tokens (source of truth)

### Community 84 - "TestApplySoftStrictBaggage"
Cohesion: 0.52
Nodes (6): applySoftStrictBaggage(), makeOfferWithBags(), makeOfferWithMissingBags(), TestApplySoftStrictBaggage(), TestClassifyOfferBaggage(), classifyOfferBaggage()

### Community 85 - "backend_api_contracts.md"
Cohesion: 0.18
Nodes (10): 1.1 Create Search Session, 1.2 Get Search Session Status & Results, 1. Flight Search Sessions, 2.1 Get Monthly Deals, 2. Monthly Deals API, 3.1 Search Airports & Cities, 3. Airport & City Autocomplete, 4. High-Level Handler Layout (Go) (+2 more)

### Community 87 - "FiltersPanel.tsx"
Cohesion: 0.31
Nodes (8): f, FiltersPanel(), Chip(), countByStopsFilter(), matchesStopsFilter(), maxStopsPerLeg(), stopsPerLeg(), totalStops()

### Community 88 - "Flight scraper (multisite)"
Cohesion: 0.29
Nodes (6): Docker, Flight scraper (multisite), Residential EU proxy, Run locally, VPS (recommended): headed Chrome on `:99`, When Skyscanner returns 0 offers

### Community 89 - "affiliate.ts"
Cohesion: 0.27
Nodes (9): AffiliateProvider, AffiliateProviderResponse, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink(), OutboundLinkResponse (+1 more)

### Community 92 - "time.Time"
Cohesion: 0.15
Nodes (18): GetClicksSummary(), elapsedMs(), minutesOfDay(), ClickRecord, ClicksSummaryResponse, FullRoundTrip, attachReturnLegKeepPrice(), ensureRoundTripLegs() (+10 more)

### Community 93 - "scrape.js"
Cohesion: 0.22
Nodes (13): assert, kiwi, pxSky, sky, hasCdp(), runWithSiteBudget(), scrapeAll(), scrapeSerial() (+5 more)

### Community 94 - "context.Context"
Cohesion: 0.21
Nodes (5): acquireBookingResolveSlot(), GoogleFlights2Provider, legSearchRetryable(), truncateGF2(), gf2RateLimiter

### Community 95 - "Fly-Fix — Design System & Cursor Redesign Playbook"
Cohesion: 0.22
Nodes (8): 1. Product and brand direction, 2. Design tokens (proposed starting values), 3. Core product patterns, 4. Motion, 5. Cursor workflow phases, 6. Non-negotiable constraints, 7. Working method, Fly-Fix — Design System & Cursor Redesign Playbook

### Community 96 - "ExploreBudgetLimits"
Cohesion: 0.25
Nodes (9): init(), BudgetModeEnabled(), ExploreBudgetLimits(), resetBudgetEnv(), TestExploreBudgetLimits_budget(), TestExploreBudgetLimits_defaultsWithoutBudget(), TestFilterProviderNamesForBudget_disablesKiwi(), TestGF2SearchAirports_budgetCapsMetro() (+1 more)

### Community 97 - "DatePickerCalendar.tsx"
Cohesion: 0.39
Nodes (7): getDealsRange(), DatePickerCalendar(), DatePickerCalendarProps, getNext14Dates(), getRangeStartEnd(), styles, WEEKDAYS

### Community 98 - "server_carrier_test.go"
Cohesion: 0.83
Nodes (3): makeOfferWithCarriers(), TestExtractCarrierCodes(), TestPrimaryDisplayCarrier()

### Community 99 - "handleExplore"
Cohesion: 0.16
Nodes (10): exploreSessionKey(), getExploreSession(), newExploreSessionID(), putExploreSession(), startExploreSessionCleanup(), exploreSession, corsMiddleware(), fetchExchangeRates() (+2 more)

### Community 101 - "ensure-flight-chrome.sh"
Cohesion: 0.52
Nodes (6): chrome_proxy_args(), DISPLAY, ensure_gateway_proxy(), load_scraper_proxy_env(), log(), ensure-flight-chrome.sh script

### Community 106 - "Frontend Design"
Cohesion: 0.25
Nodes (7): Design principles, Fly-Fix (this repo), Frontend Design, Ground your designs in the subject matter, More on writing in design, Process: plan, review against the brief, build, critique, Restraint and self-critique

## Knowledge Gaps
- **3 isolated node(s):** `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 645 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Fly-Fix` connect `Features` to `time.Duration`, `AppIcon`?**
  _High betweenness centrality (0.317) - this node is a cross-community bridge._
- **What connects `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `.ResolveQuotedPartnerBooking` be split into smaller, more focused modules?**
  _Cohesion score 0.10121457489878542 - nodes in this community are weakly interconnected._
- **Why does `Multi-provider flight search` connect `time.Duration` to `Features`?**
  _High betweenness centrality (0.304) - this node is a cross-community bridge._
- **Should `time.Duration` be split into smaller, more focused modules?**
  _Cohesion score 0.08021390374331551 - nodes in this community are weakly interconnected._
- **Why does `Recent enhancements` connect `AppIcon` to `Features`, `ResultsScreen.tsx`?**
  _High betweenness centrality (0.298) - this node is a cross-community bridge._
- **Should `CanonicalSegment` be split into smaller, more focused modules?**
  _Cohesion score 0.10931174089068826 - nodes in this community are weakly interconnected._