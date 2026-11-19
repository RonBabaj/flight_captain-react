# Graph Report - workspace  (2026-11-19)

## Corpus Check
- 331 files · ~271,206 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 18 file(s) not represented in the graph (top: (none) 8, .mdc 2, .example 2)

## Summary
- 2733 nodes · 8850 edges · 106 communities (86 shown, 20 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 736 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d60cab0c`
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
- api.ts
- CanonicalItinerary
- LocaleContext.tsx
- explore_cache.go
- ValidationIssue
- Backend QA Automation Tool
- test-roundtrip-legs.js
- LookupAirlineIATA
- search.ts
- App.tsx
- models.py
- ExploreScreen.tsx
- Fly-Fix – Frontend
- handleBookingResolve
- SearchFormScreen.tsx
- test_cases
- LandingScreen.tsx
- gen_explore_airport_coords.py
- flightcaptainweb
- SearchRequest
- Nginx Proxy Manager — fly-fix TLS checklist
- SearchSessionResultsResponse
- googleflights2_provider.go
- .finalize
- ExploreScreen.tsx
- steps
- flyfix-api
- skyscannerParse.js
- ResultsScreen.tsx
- normalizeKiwiItem
- bookingPrefillURL
- npm
- types.ts
- kiwi.js
- destinationMood.test.ts
- nginx-proxy-manager (VPS edge)
- BuildLegAirlineDirectURL
- resolvePartners.js
- .SearchAll
- AuthContext.tsx
- warm.js
- SearchSubmitButton.tsx
- canonical_booking_test.go
- testing.T
- ProviderResult
- skyscanner.ts
- test-kiwi-parse.js
- client.ts
- SortBar.tsx
- Fly-Fix UI / UX
- TestApplySoftStrictBaggage
- backend_api_contracts.md
- ensure-edge-proxy.sh
- FiltersPanel.tsx
- Flight scraper (multisite)
- resolveBookingRedirectURL
- install-edge-proxy-cron.sh
- sync-edge-stack.sh
- time.Time
- scrape.js
- GoogleFlights2Provider
- Fly-Fix — Design System & Cursor Redesign Playbook
- attachQuotedPriceMeta
- auth_test.go
- ensure-flight-vnc.sh
- ensure-flight-chrome.sh
- ensure-scraper-proxy-forwarder.sh
- docker-entrypoint.sh
- after-reboot-flight.sh
- Frontend Design

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 112 edges
2. `useLocale()` - 100 edges
3. `react` - 78 edges
4. `react-native` - 72 edges
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
- `Multi-provider flight search` --references--> `NewRegistryFromEnv()`  [INFERRED]
  README.md → backend/search/registry.go
- `Recent enhancements` --references--> `AppIcon()`  [INFERRED]
  README.md → frontend/src/components/AppIcon.tsx

## Import Cycles
- None detected.

## Communities (106 total, 20 thin omitted)

### Community 0 - ".ResolveQuotedPartnerBooking"
Cohesion: 0.11
Nodes (29): isTransientGF2BookingErr(), resolveAllPartnerBookingsFromTokenWithRetry(), bookingResolveFailureResponse(), findBookingOptionsArray(), firstPartnerBookingOption(), firstPartnerURLInMap(), firstStringByKeys(), ResolvedPartnerBooking (+21 more)

### Community 1 - "time.Duration"
Cohesion: 0.09
Nodes (27): init(), budgetCfg(), BudgetModeEnabled(), durationFromEnvMin(), envTruthy(), FilterProviderNamesForBudget(), GF2EffectiveCacheTTL(), GF2EffectiveRateLimitPerMin() (+19 more)

### Community 2 - "CanonicalSegment"
Cohesion: 0.09
Nodes (48): extractFlightNumbers(), flightNumberInText(), flightNumbersEquivalent(), splitFlightDesignator(), textContainsAirport(), textContainsAny(), timeMatches(), TestFlightNumbersEquivalent_leadingZeros() (+40 more)

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
Cohesion: 0.13
Nodes (38): ClearableTextInput(), HubRouteSummaryModal(), useAuth(), useLocale(), AccountScreen(), styles, AdminRuntimeConfigPanel(), ConfigFieldRow() (+30 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (33): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+25 more)

### Community 9 - "FlightOption"
Cohesion: 0.06
Nodes (68): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, CanonicalFingerprint(), TestCapOptionsKeepingVariety(), Carrier, CarrierCodes (+60 more)

### Community 10 - "flight-scraper/package.json"
Cohesion: 0.11
Nodes (17): express, playwright, dependencies, express@^4.21.2, playwright@^1.49.1, description, engines, node (+9 more)

### Community 11 - "GF2SearchAirports"
Cohesion: 0.10
Nodes (22): ExploreBudgetLimits(), resetBudgetEnv(), TestExploreBudgetLimits_budget(), TestExploreBudgetLimits_defaultsWithoutBudget(), TestGF2SearchAirports_budgetCapsMetro(), gf2MetroKey(), GF2SearchAirports(), ResolveGF2PlaceCode() (+14 more)

### Community 12 - "BookingOptionsFooter.tsx"
Cohesion: 0.11
Nodes (40): BookingResolveRequest, BookingResolveResponse, BookingResolveStatus, bookingRetryDelayMs(), fetchBookingResolveOnce(), isSafeBookingUrl(), isTransientBookingFetchError(), isTransientBookingResolveResponse() (+32 more)

### Community 13 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 14 - "FlightDetailsModal.tsx"
Cohesion: 0.08
Nodes (52): AIRLINE_NAMES, formatAirlineFilterLabel(), getAirlineName(), resolveAirlineLabel(), AIRLINE_FULL_NAMES, airportTimeZones, getAirportTimeZone(), f (+44 more)

### Community 15 - "resolveGF2PartnerOffers"
Cohesion: 0.13
Nodes (23): allocateLegQuoteAmount(), flightLegDurationMinutes(), legBookingToken(), legDeepLink(), legPartnerArraysAligned(), partnerDomainMatchesCarrier(), providerDomainFromURL(), quoteBindingForMatch() (+15 more)

### Community 16 - "MonthDealsScreen.tsx"
Cohesion: 0.09
Nodes (46): CheaperCitiesOption, buildDealsPositioningSignature(), dealBestScore(), fl, fmtDur(), formatDealDate(), hfm, layoverBetween() (+38 more)

### Community 17 - "resolveOTAPartnerOffers"
Cohesion: 0.20
Nodes (9): flightSegmentToOtaMap(), isSellerOTASource(), otaFirstNonEmpty(), otaResolveClockHints(), otaResolveSegmentsPayload(), otaResolveSiteForSource(), resolveOTAPartnerOffers(), TestResolveOTAPartnerOffers_usesExistingCheckoutDeepLink() (+1 more)

### Community 18 - "ErrorBoundary"
Cohesion: 0.15
Nodes (4): ErrorBoundary, Props, s, State

### Community 19 - "server.go"
Cohesion: 0.05
Nodes (132): airlineDomainForCarrier(), applySearchQuoteToOffer(), bookingMatchPriceNormalizer(), dedupeGF2PartnerOffers(), gf2OffersHavePrice(), gf2PartnerOfferFromQuoteURL(), gf2PartnerOfferFromResolved(), gf2PartnerOfferFromURL() (+124 more)

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
Cohesion: 0.06
Nodes (61): Search form (boarding-pass ticket), AppIcon(), AppIconLibrary, AppIconProps, styles, ClearableTextInputProps, styles, styles (+53 more)

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.30
Nodes (10): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+2 more)

### Community 29 - "auth.go"
Cohesion: 0.10
Nodes (47): getOTAProvider(), GetSessionAndOption(), ParseOptionIndex(), RecordClick(), ResolveProvider(), authUserJSON(), bearerTokenFromRequest(), bootstrapAdminUser() (+39 more)

### Community 30 - "session.js"
Cohesion: 0.17
Nodes (20): pageLooksBlocked(), withCdpLock(), blockHeavyResources(), getOpenPageHook(), browserPromises, { chromium, firefox }, getBrowser(), isTransientScrapeError() (+12 more)

### Community 31 - "api.ts"
Cohesion: 0.08
Nodes (30): DynamicDestinationsFormContentProps, FiltersPanelProps, FlightDetailsModalProps, FlightResultCardProps, PassengerCabinPickerProps, SearchFormContentProps, PositioningLegResult, defaultFilters (+22 more)

### Community 32 - "CanonicalItinerary"
Cohesion: 0.14
Nodes (28): extractPrice(), cfgTest(), testConnectingTLVJFK(), TestExtractPrice_euroPrefixNotArrivalTime(), TestGenerateQueries_connecting(), TestGenerateQueries_direct(), TestGenerateQueries_gf2AirlineNameIdentity(), TestGenerateQueries_includesRouteDateBookQuery() (+20 more)

### Community 33 - "LocaleContext.tsx"
Cohesion: 0.09
Nodes (26): DisplayPrice(), DisplayPriceProps, HubRouteLeg, HubRouteSummaryModalProps, s, getStorage(), languageToLocale(), loadSaved() (+18 more)

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
Nodes (28): CachedResult, createSearchSession(), createSearchSessionWithRetry(), ensureLegacyPurge(), fetchFresh(), getFromStorage(), getSearchSessionResults(), getStorage() (+20 more)

### Community 40 - "App.tsx"
Cohesion: 0.11
Nodes (29): App(), linking, RTLWrapper(), useExchangeRates(), DocumentLike, Focusable, useKeepFocusedFieldVisible(), RootNavigator() (+21 more)

### Community 42 - "ExploreScreen.tsx"
Cohesion: 0.11
Nodes (44): AIRPORT_ONLY_DICTIONARY, FULL_PLACE_DICTIONARY, getAirportDisplayName(), getAirportNameByCode(), getCityDisplayName(), lower(), matchesQuery(), PLACE_SEARCH_LIMIT (+36 more)

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "handleBookingResolve"
Cohesion: 0.12
Nodes (21): TestHandleBookingResolve_prodShapeKiwiIsrairHTTP(), acquireBookingResolveSlot(), beginInflightResolve(), bookingResolveCacheKey(), dualBookingOptionCount(), finishInflightResolve(), getCachedBookingResolve(), handleBookingResolve() (+13 more)

### Community 45 - "SearchFormScreen.tsx"
Cohesion: 0.15
Nodes (23): defaultParams, SearchFormScreen(), styles, buildSearchString(), getParam(), getParams(), isWeb(), parseSearchParamsFromUrl() (+15 more)

### Community 46 - "test_cases"
Cohesion: 0.05
Nodes (40): departureDate, origin, byProvider, currency, error, from, items, route (+32 more)

### Community 47 - "LandingScreen.tsx"
Cohesion: 0.09
Nodes (32): Nav, SiteFooter(), styles, moodImageUrlForVariant(), LandingMoodImage(), LandingScreen(), Nav, styles (+24 more)

### Community 53 - "SearchRequest"
Cohesion: 0.12
Nodes (21): TestCompleteExtraLegs(), TestExtraLegsFingerprint(), truncateStr(), TestSanitizeStandardSearchRequest(), TestDynamicDestinationOneWayRequests_extraLegs(), TestDynamicDestinationOneWayRequests_openJaw(), dynamicDestinationOneWayRequests(), flattenOtaScraperResponse() (+13 more)

### Community 54 - "Nginx Proxy Manager — fly-fix TLS checklist"
Cohesion: 0.40
Nodes (4): Nginx Proxy Manager — fly-fix TLS checklist, Reissue frontend cert (both names), Required proxy-host settings, Symptoms Chrome shows

### Community 55 - "SearchSessionResultsResponse"
Cohesion: 0.28
Nodes (9): ProviderSearchStats, SearchProgress, SearchSession, SearchSessionResultsResponse, SearchSessionStatus, pageSearchSessionForClient(), publishSearchProgress(), sanitizeSessionForClient() (+1 more)

### Community 56 - "googleflights2_provider.go"
Cohesion: 0.11
Nodes (36): TestParseGF2TimeWithDateHint_AirportLocal(), TestExtractGF2BookingToken(), TestBuildGF2ResultFromItinerary_FlatFormat(), TestParseGF2Response_AttachesFlatReturnFlights(), TestParseGF2Response_RapidAPIFlatTopFlights(), TestParseGF2Response_topFlightsWithoutPriceHistory(), TestExtractGF2Leg_TimeOnly_NoDateHint(), TestExtractGF2SegmentFromFlight_CodeOnlyHasNoName() (+28 more)

### Community 58 - "ExploreScreen.tsx"
Cohesion: 0.15
Nodes (26): getMonthDeals(), getExploreDestinations(), getAirportEntry(), c, countryFlag(), d, DestCard(), ExploreScreen() (+18 more)

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
Cohesion: 0.11
Nodes (33): collectTripDestinationCodes(), DestinationMoodBanner(), DestinationMoodStrip(), moodSizeForVariant(), stripStyles, styles, Variant, AIRPORT_FALLBACK_IMAGE (+25 more)

### Community 63 - "normalizeKiwiItem"
Cohesion: 0.17
Nodes (18): TotalStops(), TestParseOTASegmentTime_AirportWallClock(), asArray(), collectCarriers(), detectSelfTransfer(), extractKiwiLegs(), firstFloat(), firstString() (+10 more)

### Community 64 - "bookingPrefillURL"
Cohesion: 0.27
Nodes (14): bookingLinkMode(), bookingPrefillURL(), bookingRouteFromSessionOption(), buildGoogleFlightsPrefillURL(), buildGoogleFlightsSegmentPrefillURL(), buildLegOrSegmentBookingURL(), BuildOneWayLegBookingURL(), BuildUniformBookingLink() (+6 more)

### Community 65 - "npm"
Cohesion: 0.17
Nodes (11): networks, proxy, container_name, image, networks, ports, restart, volumes (+3 more)

### Community 66 - "types.ts"
Cohesion: 0.18
Nodes (13): DynamicDestinationsStack(), Stack, MonthDealsStack(), Stack, SearchStack(), Stack, DynamicDestinationsStackParamList, MonthDealsStackParamList (+5 more)

### Community 67 - "kiwi.js"
Cohesion: 0.16
Nodes (22): assert, waitUntil(), parseRoundTripHm(), clearKiwiSpaState(), ensureKiwiResultsUrl(), extractFromCaptured(), extractNextData(), flattenOffers() (+14 more)

### Community 68 - "destinationMood.test.ts"
Cohesion: 0.06
Nodes (25): __dirname, dist, indexHtml, indexPath, SPA_ROUTES, AIRPORT_DICTIONARY, ASSIGNED_URLS, BY_CODE (+17 more)

### Community 69 - "nginx-proxy-manager (VPS edge)"
Cohesion: 0.40
Nodes (4): Deploy sync, First-time / recovery, nginx-proxy-manager (VPS edge), On the server

### Community 70 - "BuildLegAirlineDirectURL"
Cohesion: 0.17
Nodes (11): BuildLegAirlineDirectURL(), BuildRedirectURL(), getAffiliateID(), TestBuildLegAirlineDirectURL_austrianHasNoUnverifiedLink(), stripEmptyQueryParams(), TestBuildLegAirlineDirectURL_wizzPathNotHash(), TestBuildLegAirlineDirectURL_wizzRoundTripReturnDate(), marketingCarrierForLeg() (+3 more)

### Community 71 - "resolvePartners.js"
Cohesion: 0.23
Nodes (17): addPartner(), clickMatchingKiwiCard(), clickMatchingSkyscannerCard(), clocksFromSegments(), collectPartnerMap(), extractPartnersFromDom(), hmFromIso(), isMetaHost() (+9 more)

### Community 72 - ".SearchAll"
Cohesion: 0.11
Nodes (15): TestSanitizeProviderErrorForUser(), TestRegistryFailureMessage_transientOutbound(), TestRegistrySearchAll_dedupeComparesInRequestedCurrency(), TestRegistrySearchAll_fastOnlySkipsScraper(), TestRegistrySearchAll_openJawGF2FailNotMaskedByKiwiSkip(), TestRegistrySearchAllPartialFailure(), TestRegistrySearchAllWithProgress(), convertResultsToCurrency() (+7 more)

### Community 73 - "AuthContext.tsx"
Cohesion: 0.05
Nodes (63): AffiliateProvider, AffiliateProviderResponse, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink(), OutboundLinkResponse (+55 more)

### Community 74 - "warm.js"
Cohesion: 0.09
Nodes (23): cdpLockBusy(), chain, DEFAULT_SITES, beginSearch(), endSearch(), isSearchBusy(), app, express (+15 more)

### Community 75 - "SearchSubmitButton.tsx"
Cohesion: 0.05
Nodes (55): getAlmostDonePhrase(), getPhrasesForLanguage(), pickSearchStatusPhrase(), providerPhraseMap(), SEARCH_ALMOST_DONE, SEARCH_BUTTON_ALMOST_DONE, SEARCH_BUTTON_PHRASES, SEARCH_PROGRESS_PHRASES (+47 more)

### Community 76 - "canonical_booking_test.go"
Cohesion: 0.18
Nodes (13): openJawOption(), TestBookingLinkModeDefaultsToSkyscanner(), TestBookingRouteFromSessionOption_splitOmitsReturn(), TestBuildLegOrSegmentBookingURL_segment(), TestBuildOneWayLegBookingURL(), TestBuildSkyscannerPrefillURL_oneWay(), TestBuildSkyscannerPrefillURL_roundTrip(), TestBuildUniformBookingLink_splitIgnoresDeepLink() (+5 more)

### Community 77 - "testing.T"
Cohesion: 0.05
Nodes (63): TestParseOtaOffers_normalizesIsrairDisplayName(), TestProviderResultsToFlightOptions_PreservesCarrierName(), TestAttachReturnLegKeepPrice(), TestEnsureRoundTripLegs_noOpWhenTwoLegs(), AirportLocation(), TestAirportLocation_UnknownFallsBackUTC(), TestParseGF2TimeWithDateHint_TelAviv(), TestParseOtaOffers_IsrairNameToIATA() (+55 more)

### Community 78 - "ProviderResult"
Cohesion: 0.08
Nodes (29): DedupeProviderResults(), ItineraryFingerprint(), mergeSelfTransfer(), uniqueStrings(), TestCombineOneWayBatches(), TestCombineOneWayBatches_emptyBatch(), TestCombineOneWayBatches_keepsNonstopsBothWays(), TestCombineOneWayBatches_openJawReturnDiversity() (+21 more)

### Community 79 - "skyscanner.ts"
Cohesion: 0.39
Nodes (11): BookingHop, bookingHopsFromOption(), firstSeg(), isClassicRoundTripLegs(), isoDatePrefix(), isSplitBookingItinerary(), lastSeg(), legCarrierCode() (+3 more)

### Community 80 - "test-kiwi-parse.js"
Cohesion: 0.16
Nodes (15): assert, offers, pending, req, offerTemplate(), segment(), bookingUrlFor(), extractKiwiUmbrella() (+7 more)

### Community 81 - "client.ts"
Cohesion: 0.12
Nodes (20): searchAirports(), apiGet(), getDealsRange(), GetDealsRangeParams, GetMonthDealsParams, ExploreResponse, GetExploreDestinationsParams, getFlightDetails() (+12 more)

### Community 82 - "SortBar.tsx"
Cohesion: 0.32
Nodes (7): KEYS, s, SortBar(), SortBarProps, SortOption, useIsNarrowPhone(), SortField

### Community 83 - "Fly-Fix UI / UX"
Cohesion: 0.20
Nodes (9): Avoid (AI-vibe tells), Checklist before shipping UI, Design north star, Fly-Fix UI / UX, Phase 0 decisions (locked), Prefer, Responsive, Screen rules (+1 more)

### Community 84 - "TestApplySoftStrictBaggage"
Cohesion: 0.52
Nodes (6): applySoftStrictBaggage(), makeOfferWithBags(), makeOfferWithMissingBags(), TestApplySoftStrictBaggage(), TestClassifyOfferBaggage(), classifyOfferBaggage()

### Community 85 - "backend_api_contracts.md"
Cohesion: 0.18
Nodes (10): 1.1 Create Search Session, 1.2 Get Search Session Status & Results, 1. Flight Search Sessions, 2.1 Get Monthly Deals, 2. Monthly Deals API, 3.1 Search Airports & Cities, 3. Airport & City Autocomplete, 4. High-Level Handler Layout (Go) (+2 more)

### Community 87 - "FiltersPanel.tsx"
Cohesion: 0.48
Nodes (5): countByStopsFilter(), matchesStopsFilter(), maxStopsPerLeg(), stopsPerLeg(), totalStops()

### Community 88 - "Flight scraper (multisite)"
Cohesion: 0.29
Nodes (6): Docker, Flight scraper (multisite), Residential EU proxy, Run locally, VPS (recommended): headed Chrome on `:99`, When Skyscanner returns 0 offers

### Community 89 - "resolveBookingRedirectURL"
Cohesion: 0.50
Nodes (5): TestBuildGoogleFlightsFallbackFromParams(), BuildGoogleFlightsFallbackFromParams(), normalizeProviderBookingURL(), handleOutBooking(), resolveBookingRedirectURL()

### Community 92 - "time.Time"
Cohesion: 0.16
Nodes (17): GetClicksSummary(), elapsedMs(), minutesOfDay(), ClickRecord, ClicksSummaryResponse, FullRoundTrip, attachReturnLegKeepPrice(), ensureRoundTripLegs() (+9 more)

### Community 93 - "scrape.js"
Cohesion: 0.22
Nodes (13): assert, kiwi, pxSky, sky, hasCdp(), runWithSiteBudget(), scrapeAll(), scrapeSerial() (+5 more)

### Community 94 - "GoogleFlights2Provider"
Cohesion: 0.12
Nodes (13): classicRoundTripMissingReturn(), TestDoSearchWithRetry_doesNotCacheRoundTrip(), TestSearch_ignoresIncompleteClassicRTCache(), TestSearch_servesCompleteClassicRTCache(), GoogleFlights2Provider, legSearchRetryable(), newGF2Cache(), newGF2RateLimiter() (+5 more)

### Community 95 - "Fly-Fix — Design System & Cursor Redesign Playbook"
Cohesion: 0.22
Nodes (8): 1. Product and brand direction, 2. Design tokens (proposed starting values), 3. Core product patterns, 4. Motion, 5. Cursor workflow phases, 6. Non-negotiable constraints, 7. Working method, Fly-Fix — Design System & Cursor Redesign Playbook

### Community 96 - "attachQuotedPriceMeta"
Cohesion: 0.67
Nodes (3): attachQuotedPriceMeta(), redactPriceMismatchCheckoutURLs(), TestAttachQuotedPriceMeta_detectsMismatch()

### Community 99 - "auth_test.go"
Cohesion: 0.17
Nodes (18): handleAuthLogin(), initAuthStore(), initTestAuthDB(), randomTestPassword(), TestAuthLoginAndChangePassword(), TestAuthRegister(), TestAuthUserManagement(), TestBootstrapAdminPasswordSync() (+10 more)

### Community 101 - "ensure-flight-chrome.sh"
Cohesion: 0.52
Nodes (6): chrome_proxy_args(), DISPLAY, ensure_gateway_proxy(), load_scraper_proxy_env(), log(), ensure-flight-chrome.sh script

### Community 106 - "Frontend Design"
Cohesion: 0.25
Nodes (7): Design principles, Fly-Fix (this repo), Frontend Design, Ground your designs in the subject matter, More on writing in design, Process: plan, review against the brief, build, critique, Restraint and self-critique

## Knowledge Gaps
- **3 isolated node(s):** `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 649 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Fly-Fix` connect `Features` to `LocaleContext.tsx`?**
  _High betweenness centrality (0.312) - this node is a cross-community bridge._
- **What connects `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `.ResolveQuotedPartnerBooking` be split into smaller, more focused modules?**
  _Cohesion score 0.10887949260042283 - nodes in this community are weakly interconnected._
- **Why does `Multi-provider flight search` connect `Features` to `time.Duration`?**
  _High betweenness centrality (0.304) - this node is a cross-community bridge._
- **Should `time.Duration` be split into smaller, more focused modules?**
  _Cohesion score 0.09195402298850575 - nodes in this community are weakly interconnected._
- **Why does `Recent enhancements` connect `LocaleContext.tsx` to `Features`, `AppIcon`?**
  _High betweenness centrality (0.298) - this node is a cross-community bridge._
- **Should `CanonicalSegment` be split into smaller, more focused modules?**
  _Cohesion score 0.09176470588235294 - nodes in this community are weakly interconnected._