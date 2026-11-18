# Graph Report - workspace  (2026-11-18)

## Corpus Check
- 320 files · ~266,418 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 17 file(s) not represented in the graph (top: (none) 8, .mdc 2, .example 2)

## Summary
- 2678 nodes · 8620 edges · 113 communities (90 shown, 23 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 726 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c97e76b9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- .ResolveQuotedPartnerBooking
- destinationMood.test.ts
- CanonicalSegment
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
- FlightDetailsModal.tsx
- canonical_booking_test.go
- MonthDealsScreen.tsx
- gf2PartnerOfferFromURL
- budget_config.go
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
- handleCreateSession
- CanonicalItinerary
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
- context.Context
- AirportLocation
- .finalize
- FlightResultCard.tsx
- steps
- flyfix-api
- skyscannerParse.js
- ResultsScreen.tsx
- auth.go
- providerResultsToFlightOptions
- npm
- AttachCanonicalIdentity
- kiwi.js
- skyscanner.js
- nginx-proxy-manager (VPS edge)
- App.tsx
- AuthContext.tsx
- .SearchAll
- App.tsx
- warm.js
- api.ts
- LegalPageScreen.tsx
- matcher_test.go
- ProviderResult
- ErrorBoundary
- test-kiwi-parse.js
- normalizeKiwiItem
- SearchSubmitButton.tsx
- Fly-Fix UI / UX
- TestApplySoftStrictBaggage
- backend_api_contracts.md
- ensure-edge-proxy.sh
- auth_test.go
- parseGF2Response
- client.ts
- install-edge-proxy-cron.sh
- sync-edge-stack.sh
- time.Time
- scrape.js
- displayAirlines.ts
- SearchCandidate
- resolveBookingOffer
- searchRouteUrl.ts
- handleCreateSession
- handleExplore
- ensure-flight-vnc.sh
- ensure-flight-chrome.sh
- ensure-scraper-proxy-forwarder.sh
- docker-entrypoint.sh
- after-reboot-flight.sh
- server_carrier_test.go
- CalendarModal.tsx
- DraggableBottomSheet.tsx
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
- `Recent enhancements` --references--> `AppIcon()`  [INFERRED]
  README.md → frontend/src/components/AppIcon.tsx

## Import Cycles
- None detected.

## Communities (113 total, 23 thin omitted)

### Community 0 - ".ResolveQuotedPartnerBooking"
Cohesion: 0.14
Nodes (22): resolveAllPartnerBookingsFromTokenWithRetry(), findBookingOptionsArray(), firstPartnerBookingOption(), firstPartnerURLInMap(), firstStringByKeys(), ResolvedPartnerBooking, isPartnerBookingList(), parseGF2BookingOptions() (+14 more)

### Community 1 - "destinationMood.test.ts"
Cohesion: 0.11
Nodes (14): __dirname, dist, indexHtml, indexPath, SPA_ROUTES, byCity, compact, curatedCities (+6 more)

### Community 2 - "CanonicalSegment"
Cohesion: 0.12
Nodes (37): extractFlightNumbers(), flightNumberInText(), flightNumbersEquivalent(), splitFlightDesignator(), textContainsAirport(), textContainsAny(), timeMatches(), TestFlightNumbersEquivalent_leadingZeros() (+29 more)

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "testing.T"
Cohesion: 0.05
Nodes (57): floatPtr(), TestSelectBestOffer_cheapestOTAOverAirline(), TestSelectBestOffer_conflictingCandidatesPicksCheapest(), TestSelectBestOffer_missingPrice(), TestSelectBestOffer_multipleMatching(), TestSelectBestOffer_prefersPriceAmongSameURLType(), TestSelectBestOffer_prefersQuoteMatchingPrice(), TestSelectBestOffer_rejectsGenericSearchURL() (+49 more)

### Community 5 - "session_store.go"
Cohesion: 0.20
Nodes (21): loadSearchSession(), markSessionFailed(), TestLoadSearchSession_Expiry(), searchSessionTTL(), startSearchSessionCleanup(), cleanupPersistedSessions(), importLegacyJSONSessions(), initSessionStore() (+13 more)

### Community 6 - "frontend/package.json"
Cohesion: 0.06
Nodes (39): config, { getDefaultConfig }, dependencies, expo@~52.0.0, @expo/metro-runtime@~4.0.1, expo-status-bar@~2.0.0, react@18.3.1, react-dom@18.3.1 (+31 more)

### Community 7 - "useTheme"
Cohesion: 0.07
Nodes (65): ClearableTextInput(), ClearableTextInputProps, styles, DisplayPriceProps, EditSearchModalProps, s, HubRouteLeg, HubRouteSummaryModalProps (+57 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (32): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+24 more)

### Community 9 - "server.go"
Cohesion: 0.12
Nodes (25): CanonicalFingerprint(), CodeshareFingerprint(), roundTimeToMinutes(), TestCapOptionsKeepingVariety(), FlightOption, applyPriceNormalization(), applySoftStrictBaggageOptions(), baggageOrderString() (+17 more)

### Community 10 - "flight-scraper/package.json"
Cohesion: 0.11
Nodes (17): express, playwright, dependencies, express@^4.21.2, playwright@^1.49.1, description, engines, node (+9 more)

### Community 11 - "resolveGF2PartnerOffers"
Cohesion: 0.09
Nodes (34): allocateLegQuoteAmount(), attachQuotedPriceMeta(), dedupeGF2PartnerOffers(), flightLegDurationMinutes(), gf2PartnerOfferFromResolved(), legBookingToken(), legDeepLink(), legPartnerArraysAligned() (+26 more)

### Community 12 - "BookingOptionsFooter.tsx"
Cohesion: 0.12
Nodes (37): BookingResolveRequest, BookingResolveResponse, BookingResolveStatus, bookingRetryDelayMs(), fetchBookingResolveOnce(), isSafeBookingUrl(), isTransientBookingFetchError(), isTransientBookingResolveResponse() (+29 more)

### Community 13 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 14 - "FlightDetailsModal.tsx"
Cohesion: 0.15
Nodes (29): airportTimeZones, getAirportTimeZone(), cabinLabel(), FlightDetailsModal(), formatDuration(), layoverBetween(), legDuration(), legDurationLine() (+21 more)

### Community 15 - "canonical_booking_test.go"
Cohesion: 0.12
Nodes (31): openJawOption(), TestBookingLinkModeDefaultsToSkyscanner(), TestBookingRouteFromSessionOption_splitOmitsReturn(), TestBuildGoogleFlightsFallbackFromParams(), TestBuildLegOrSegmentBookingURL_segment(), TestBuildOneWayLegBookingURL(), TestBuildSkyscannerPrefillURL_oneWay(), TestBuildSkyscannerPrefillURL_roundTrip() (+23 more)

### Community 16 - "MonthDealsScreen.tsx"
Cohesion: 0.07
Nodes (56): HubRouteSummaryModal(), CheaperCitiesOption, CheaperCitiesSection(), Props, s, buildDealsPositioningSignature(), dealBestScore(), fl (+48 more)

### Community 17 - "gf2PartnerOfferFromURL"
Cohesion: 0.29
Nodes (7): gf2PartnerOfferFromURL(), TestGF2PartnerOfferFromURL_acceptsHTTPS(), TestGF2PartnerOfferFromURL_metaSearchIsNotVerifiedCheckout(), TestGF2PartnerOfferFromURL_rejectsUnsafe(), TestGF2PartnerOfferFromURL_transportDeeplinkIsBooking(), storedSessionBookingURL(), IsTransportDeeplink()

### Community 18 - "budget_config.go"
Cohesion: 0.09
Nodes (25): budgetCfg(), durationFromEnvMin(), envTruthy(), FilterProviderNamesForBudget(), GF2EffectiveCacheTTL(), GF2EffectiveRateLimitPerMin(), GF2MetroConcurrency(), GF2SkipRoundTripEnrich() (+17 more)

### Community 19 - "server.go"
Cohesion: 0.06
Nodes (98): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, isTransientGF2BookingErr(), prodShapeKiwiIsrairOption(), TestHandleBookingResolve_prodShapeKiwiIsrairHTTP(), TestRunBookingMatch_kiwiMixedCarriersNoAustrianDeeplink() (+90 more)

### Community 22 - "skyscanner.js"
Cohesion: 0.11
Nodes (41): com, fr, req, pageLooksBlocked(), addPartner(), clickMatchingKiwiCard(), clickMatchingSkyscannerCard(), clocksFromSegments() (+33 more)

### Community 23 - "TestResult"
Cohesion: 0.19
Nodes (3): ResponseAnalyzer, main(), _print_unreachable_backend_hint()

### Community 25 - "runtime_config.go"
Cohesion: 0.18
Nodes (18): adminAccessConfigured(), isAdminRequest(), configRangeError, adminTokenConfigured(), adminTokenFromHeader(), defaultRuntimeConfig(), errConfigOutOfRange(), getRuntimeConfig() (+10 more)

### Community 26 - "AppIcon"
Cohesion: 0.10
Nodes (41): AppIcon(), AppIconLibrary, AppIconProps, styles, collectTripDestinationCodes(), DestinationMoodBanner(), DestinationMoodStrip(), moodSizeForVariant() (+33 more)

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.30
Nodes (10): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+2 more)

### Community 29 - "auth.go"
Cohesion: 0.15
Nodes (28): GetSessionAndOption(), ParseOptionIndex(), RecordClick(), handleAuthChangePassword(), handleAuthLogout(), handleBookingResolve(), TestHandleBookingResolve_invalidItinerary(), TestHandleBookingResolve_searchUnavailable() (+20 more)

### Community 30 - "session.js"
Cohesion: 0.16
Nodes (19): withCdpLock(), blockHeavyResources(), getOpenPageHook(), browserPromises, { chromium, firefox }, getBrowser(), isTransientScrapeError(), pickReusablePage() (+11 more)

### Community 31 - "handleCreateSession"
Cohesion: 0.25
Nodes (11): ProviderSearchStats, SearchProgress, SearchSession, SearchSessionResultsResponse, SearchSessionStatus, finalizeSearchSession(), pageSearchSessionForClient(), publishSearchProgress() (+3 more)

### Community 32 - "CanonicalItinerary"
Cohesion: 0.13
Nodes (19): defaultBookingMatchRunner(), logMatchEvent(), MatchItinerary(), NewResolver(), DefaultConfig(), envInt(), NewPageFetcher(), NewSerpAPISearcher() (+11 more)

### Community 33 - "LocaleContext.tsx"
Cohesion: 0.19
Nodes (16): getStorage(), languageToLocale(), loadSaved(), LocaleContext, LocaleContextValue, LocaleProvider(), save(), VALID_CURRENCIES (+8 more)

### Community 34 - "explore_cache.go"
Cohesion: 0.09
Nodes (21): airportCoord, exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut(), getAirportCoord() (+13 more)

### Community 36 - "Backend QA Automation Tool"
Cohesion: 0.18
Nodes (10): Backend QA Automation Tool, Features, If the run feels slow or “stuck”, Notes, Optional AI Setup (Ollama), Output, Project Structure, Run (+2 more)

### Community 37 - "test-roundtrip-legs.js"
Cohesion: 0.13
Nodes (19): a, arr, assert, b, dep, late, assert, frSegs (+11 more)

### Community 38 - "booking_resolve.go"
Cohesion: 0.11
Nodes (46): airlineDomainForCarrier(), applySearchQuoteToOffer(), bookingMatchPriceNormalizer(), gf2OffersHavePrice(), gf2PartnerOfferFromQuoteURL(), normalizedGF2OfferPrice(), offersIncludeAirlineDirect(), optionVendorFromQuote() (+38 more)

### Community 39 - "search.ts"
Cohesion: 0.12
Nodes (29): CachedResult, createSearchSession(), createSearchSessionWithRetry(), ensureLegacyPurge(), fetchFresh(), getFromStorage(), getSearchSessionResults(), getStorage() (+21 more)

### Community 40 - "Flight scraper (multisite)"
Cohesion: 0.29
Nodes (6): Docker, Flight scraper (multisite), Residential EU proxy, Run locally, VPS (recommended): headed Chrome on `:99`, When Skyscanner returns 0 offers

### Community 42 - "AirportAutocomplete.tsx"
Cohesion: 0.07
Nodes (73): getExploreDestinations(), SearchLoadingOverlay(), AIRPORT_ONLY_DICTIONARY, FULL_PLACE_DICTIONARY, getAirportDisplayName(), getAirportEntry(), getAirportNameByCode(), getCityDisplayName() (+65 more)

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "GoogleFlights2Provider"
Cohesion: 0.30
Nodes (7): classicRoundTripMissingReturn(), TestDoSearchWithRetry_doesNotCacheRoundTrip(), TestSearch_ignoresIncompleteClassicRTCache(), TestSearch_servesCompleteClassicRTCache(), newGF2Cache(), TestSearchLegCached_usesCache(), gf2Cache

### Community 45 - "BuildLegAirlineDirectURL"
Cohesion: 0.23
Nodes (10): BuildLegAirlineDirectURL(), BuildRedirectURL(), getAffiliateID(), TestBuildLegAirlineDirectURL_austrianHasNoUnverifiedLink(), stripEmptyQueryParams(), TestBuildLegAirlineDirectURL_wizzPathNotHash(), TestBuildLegAirlineDirectURL_wizzRoundTripReturnDate(), isAffiliateTemplateBookingURL() (+2 more)

### Community 46 - "test_cases"
Cohesion: 0.05
Nodes (40): departureDate, origin, byProvider, currency, error, from, items, route (+32 more)

### Community 47 - "LandingScreen.tsx"
Cohesion: 0.07
Nodes (35): Props, s, State, Nav, SiteFooter(), styles, AIRPORT_DICTIONARY, AIRPORT_FALLBACK_IMAGE (+27 more)

### Community 53 - "SearchRequest"
Cohesion: 0.09
Nodes (29): TestParseOtaOffers_normalizesIsrairDisplayName(), TestParseOtaOffers_IsrairNameToIATA(), TestCompleteExtraLegs(), TestExtraLegsFingerprint(), ParseOtaOffers(), parseOtaOffers(), truncateStr(), TestParseOtaOffers_dropsSkyscannerMetaDeepLink() (+21 more)

### Community 54 - "Nginx Proxy Manager — fly-fix TLS checklist"
Cohesion: 0.40
Nodes (4): Nginx Proxy Manager — fly-fix TLS checklist, Reissue frontend cert (both names), Required proxy-host settings, Symptoms Chrome shows

### Community 55 - "context.Context"
Cohesion: 0.19
Nodes (5): GoogleFlights2Provider, legSearchRetryable(), newGF2RateLimiter(), truncateGF2(), gf2RateLimiter

### Community 56 - "AirportLocation"
Cohesion: 0.06
Nodes (50): TestLookupAirlineIATA_Israir(), AirportLocation(), TestAirportLocation_UnknownFallsBackUTC(), TestParseGF2TimeWithDateHint_AirportLocal(), TestParseGF2TimeWithDateHint_TelAviv(), airlineAliasKey(), LooksLikeAirportLabel(), LookupAirlineIATA() (+42 more)

### Community 58 - "FlightResultCard.tsx"
Cohesion: 0.11
Nodes (27): DisplayPrice(), buildRoutePath(), c, FlightResultCard(), LegScheduleBlock(), useExchangeRates(), FlightSegment, LayoverSummary (+19 more)

### Community 59 - "steps"
Cohesion: 0.09
Nodes (22): runs-on, steps, jobs, deploy, name, on, push, workflow_dispatch (+14 more)

### Community 60 - "flyfix-api"
Cohesion: 0.06
Nodes (37): context, FLIGHT_SCRAPER_MAX_CONCURRENT, FLIGHT_SCRAPER_URL, PLAYWRIGHT_HEADLESS, PORT, SCRAPER_CDP_URLS, SCRAPER_PROXY_URL, SCRAPER_WARM_ON_START (+29 more)

### Community 61 - "skyscannerParse.js"
Cohesion: 0.12
Nodes (29): assert, english, firstPage, named, offers, radarOffers, req, segment() (+21 more)

### Community 62 - "ResultsScreen.tsx"
Cohesion: 0.06
Nodes (50): getDealsRange(), EditSearchModal(), s, SearchProgressBanner(), SearchProgressBannerProps, searchProgressRatio(), fin, full (+42 more)

### Community 63 - "auth.go"
Cohesion: 0.19
Nodes (20): authUserJSON(), bearerTokenFromRequest(), bootstrapAdminUser(), createAuthSession(), envFlagTrue(), handleAuthMe(), handleAuthRegister(), handleAuthUsers() (+12 more)

### Community 64 - "providerResultsToFlightOptions"
Cohesion: 0.16
Nodes (17): TestProviderResultsToFlightOptions_PreservesCarrierName(), FlightLeg, LayoverSummary, OutboundSummary, computeOutboundSummary(), computeTotalDurationFromLegs(), ensureAllMarketingCarriers(), extractDealMetaFromLeg() (+9 more)

### Community 65 - "npm"
Cohesion: 0.17
Nodes (11): networks, proxy, container_name, image, networks, ports, restart, volumes (+3 more)

### Community 66 - "AttachCanonicalIdentity"
Cohesion: 0.11
Nodes (21): TestResolveOTAPartnerOffers_usesExistingCheckoutDeepLink(), ItineraryFingerprint(), AttachCanonicalIdentity(), BuildCanonicalItinerary(), FingerprintDebugString(), TestParseOTASegmentTime_AirportWallClock(), TestResultMatchesItinerary_OTAToGF2AcrossProviders(), TestResultMatchesItinerary_RejectsDifferentFlightNumber() (+13 more)

### Community 67 - "kiwi.js"
Cohesion: 0.13
Nodes (31): waitUntil(), offerTemplate(), segmentsFromRoundTripClocks(), clearKiwiSpaState(), ensureKiwiResultsUrl(), extractFromCaptured(), extractNextData(), flattenOffers() (+23 more)

### Community 68 - "skyscanner.js"
Cohesion: 0.14
Nodes (10): extractSkyscanner(), req, skyscannerUrl(), url, DEFAULT_SITES, expediaUrl(), scrapeExpedia(), attachJsonCapture() (+2 more)

### Community 69 - "nginx-proxy-manager (VPS edge)"
Cohesion: 0.40
Nodes (4): Deploy sync, First-time / recovery, nginx-proxy-manager (VPS edge), On the server

### Community 70 - "App.tsx"
Cohesion: 0.07
Nodes (35): App(), linking, RTLWrapper(), fetchRuntimeConfig(), setRuntimeConfigStore(), RuntimeConfigContext, RuntimeConfigContextValue, RuntimeConfigProvider() (+27 more)

### Community 71 - "AuthContext.tsx"
Cohesion: 0.17
Nodes (24): authHeaders(), AuthUser, changePassword(), createUser(), deleteUser(), fetchAuthMe(), fetchUsers(), LoginResponse (+16 more)

### Community 72 - ".SearchAll"
Cohesion: 0.11
Nodes (15): TestSanitizeProviderErrorForUser(), TestRegistryFailureMessage_transientOutbound(), TestRegistrySearchAll_dedupeComparesInRequestedCurrency(), TestRegistrySearchAll_fastOnlySkipsScraper(), TestRegistrySearchAll_openJawGF2FailNotMaskedByKiwiSkip(), TestRegistrySearchAllPartialFailure(), TestRegistrySearchAllWithProgress(), convertResultsToCurrency() (+7 more)

### Community 73 - "App.tsx"
Cohesion: 0.18
Nodes (18): isDeepLinkDebugEnabled(), logDeepLinkDiagnostics(), mergeDeepLinkParams(), fromStash, fromUrl, kept, recovery, store (+10 more)

### Community 74 - "warm.js"
Cohesion: 0.11
Nodes (21): cdpLockBusy(), chain, beginSearch(), endSearch(), isSearchBusy(), app, express, { chromium } (+13 more)

### Community 75 - "api.ts"
Cohesion: 0.07
Nodes (36): FiltersPanelProps, FlightDetailsModalProps, FlightResultCardProps, PassengerCabinPickerProps, SearchFormContentProps, KEYS, s, SortBar() (+28 more)

### Community 76 - "LegalPageScreen.tsx"
Cohesion: 0.16
Nodes (18): ContactScreen(), LegalKind, LegalPageScreen(), PrivacyScreen(), SECTIONS, styles, TermsScreen(), Nav (+10 more)

### Community 77 - "matcher_test.go"
Cohesion: 0.14
Nodes (29): extractPrice(), cfgTest(), testConnectingTLVJFK(), TestExtractPrice_euroPrefixNotArrivalTime(), TestGenerateQueries_connecting(), TestGenerateQueries_direct(), TestGenerateQueries_gf2AirlineNameIdentity(), TestGenerateQueries_includesRouteDateBookQuery() (+21 more)

### Community 78 - "ProviderResult"
Cohesion: 0.09
Nodes (27): DedupeProviderResults(), mergeSelfTransfer(), uniqueStrings(), TestCombineOneWayBatches(), TestCombineOneWayBatches_emptyBatch(), TestCombineOneWayBatches_keepsNonstopsBothWays(), TestCombineOneWayBatches_openJawReturnDiversity(), cheapestReturnLeg() (+19 more)

### Community 80 - "test-kiwi-parse.js"
Cohesion: 0.25
Nodes (4): assert, offers, pending, req

### Community 81 - "normalizeKiwiItem"
Cohesion: 0.19
Nodes (17): TotalStops(), asArray(), collectCarriers(), detectSelfTransfer(), extractKiwiLegs(), firstFloat(), firstString(), kiwiSegmentFromMap() (+9 more)

### Community 82 - "SearchSubmitButton.tsx"
Cohesion: 0.18
Nodes (14): getAlmostDonePhrase(), getPhrasesForLanguage(), pickSearchStatusPhrase(), providerPhraseMap(), SEARCH_ALMOST_DONE, SEARCH_BUTTON_ALMOST_DONE, SEARCH_BUTTON_PHRASES, SEARCH_PROGRESS_PHRASES (+6 more)

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
Cohesion: 0.49
Nodes (9): handleAuthLogin(), initAuthStore(), initTestAuthDB(), randomTestPassword(), TestAuthLoginAndChangePassword(), TestAuthRegister(), TestAuthUserManagement(), TestBootstrapAdminPasswordSync() (+1 more)

### Community 88 - "parseGF2Response"
Cohesion: 0.21
Nodes (15): TestExtractGF2BookingToken(), TestParseGF2Response_AttachesFlatReturnFlights(), TestParseGF2Response_RapidAPIFlatTopFlights(), TestParseGF2Response_topFlightsWithoutPriceHistory(), extractGF2BookingToken(), extractGF2Flight(), extractGF2Itineraries(), extractGF2ItinerariesFromMap() (+7 more)

### Community 89 - "client.ts"
Cohesion: 0.07
Nodes (35): AffiliateProvider, AffiliateProviderResponse, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink(), OutboundLinkResponse (+27 more)

### Community 92 - "time.Time"
Cohesion: 0.16
Nodes (18): elapsedMs(), minutesOfDay(), ClickRecord, FullRoundTrip, attachReturnLegKeepPrice(), ensureRoundTripLegs(), gf2ExploreSearchOneDestination(), gf2OneRoundTrip() (+10 more)

### Community 93 - "scrape.js"
Cohesion: 0.24
Nodes (13): assert, kiwi, pxSky, sky, hasCdp(), runWithSiteBudget(), scrapeAll(), scrapeSerial() (+5 more)

### Community 94 - "displayAirlines.ts"
Cohesion: 0.16
Nodes (21): AIRLINE_NAMES, formatAirlineFilterLabel(), getAirlineName(), resolveAirlineLabel(), AIRLINE_FULL_NAMES, f, FiltersPanel(), Chip() (+13 more)

### Community 95 - "SearchCandidate"
Cohesion: 0.15
Nodes (12): classifyURLType(), corpusText(), domainFromURL(), TestClassifyURLType_genericVsExact(), collectSerpAPIResultMaps(), parseSerpAPIResults(), truncate(), IsCheckoutBookingURL() (+4 more)

### Community 96 - "resolveBookingOffer"
Cohesion: 0.23
Nodes (11): acquireBookingResolveSlot(), beginInflightResolve(), bookingResolveCacheKey(), finishInflightResolve(), getCachedBookingResolve(), releaseBookingResolveSlot(), resolveBookingOffer(), setCachedBookingResolve() (+3 more)

### Community 97 - "searchRouteUrl.ts"
Cohesion: 0.33
Nodes (8): buildSearchString(), SearchUrlState, openUrlInNewTab(), openUrlInNewTabOrAlert(), openUrlSameTab(), buildFlyFixSearchResultsUrl(), FlyFixLegSearchParams, openFlyFixLegSearchInNewTab()

### Community 98 - "handleCreateSession"
Cohesion: 0.39
Nodes (3): CreateSearchSessionRequest, ExtraSearchLeg, handleCreateSession()

### Community 99 - "handleExplore"
Cohesion: 0.24
Nodes (9): exploreSessionKey(), getExploreSession(), newExploreSessionID(), putExploreSession(), startExploreSessionCleanup(), exploreSession, corsMiddleware(), handleExplore() (+1 more)

### Community 101 - "ensure-flight-chrome.sh"
Cohesion: 0.52
Nodes (6): chrome_proxy_args(), DISPLAY, ensure_gateway_proxy(), load_scraper_proxy_env(), log(), ensure-flight-chrome.sh script

### Community 105 - "server_carrier_test.go"
Cohesion: 0.43
Nodes (6): CarrierCodes, makeOfferWithCarriers(), TestExtractCarrierCodes(), TestPrimaryDisplayCarrier(), ExtractCarrierCodes(), PrimaryDisplayCarrier()

### Community 106 - "CalendarModal.tsx"
Cohesion: 0.38
Nodes (6): buildMonthDays(), CalendarModal(), getMonthStart(), Props, styles, WEEKDAYS

### Community 108 - "ResolveProvider"
Cohesion: 0.50
Nodes (5): getOTAProvider(), ResolveProvider(), OutboundLinkResponse, Provider, ProviderResponse

### Community 112 - "parseSearchSessionPageQuery"
Cohesion: 0.67
Nodes (3): parseSearchSessionPageQuery(), searchResultsMaxStored(), searchResultsPageSize()

## Knowledge Gaps
- **3 isolated node(s):** `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 631 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Fly-Fix` connect `Features` to `budget_config.go`?**
  _High betweenness centrality (0.306) - this node is a cross-community bridge._
- **What connects `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `.ResolveQuotedPartnerBooking` be split into smaller, more focused modules?**
  _Cohesion score 0.13709677419354838 - nodes in this community are weakly interconnected._
- **Why does `Multi-provider flight search` connect `budget_config.go` to `Features`?**
  _High betweenness centrality (0.303) - this node is a cross-community bridge._
- **Should `destinationMood.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Why does `Recent enhancements` connect `Features` to `MonthDealsScreen.tsx`, `AppIcon`?**
  _High betweenness centrality (0.295) - this node is a cross-community bridge._
- **Should `CanonicalSegment` be split into smaller, more focused modules?**
  _Cohesion score 0.11711711711711711 - nodes in this community are weakly interconnected._