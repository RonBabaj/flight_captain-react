# Graph Report - workspace  (2026-11-19)

## Corpus Check
- 329 files · ~269,607 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 18 file(s) not represented in the graph (top: (none) 8, .mdc 2, .example 2)

## Summary
- 2716 nodes · 8739 edges · 109 communities (89 shown, 20 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 731 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `294cd94b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- .ResolveQuotedPartnerBooking
- DestinationMoodBanner.tsx
- CanonicalSegment
- Issue
- runBookingMatch
- session_store.go
- frontend/package.json
- useTheme
- Features
- FlightOption
- flight-scraper/package.json
- attachQuotedPriceMeta
- BookingOptionsFooter.tsx
- compilerOptions
- FlightDetailsModal.tsx
- resolveGF2PartnerOffers
- MonthDealsScreen.tsx
- resolveOTAPartnerOffers
- react
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
- LocaleContext.tsx
- CanonicalItinerary
- ExploreScreen.tsx
- explore_cache.go
- ValidationIssue
- Backend QA Automation Tool
- test-roundtrip-legs.js
- BookingOffer
- search.ts
- ThemeContext.tsx
- models.py
- AirportAutocomplete.tsx
- Fly-Fix – Frontend
- BuildLegAirlineDirectURL
- handleBookingResolve
- test_cases
- RootNavigator.tsx
- gen_explore_airport_coords.py
- flightcaptainweb
- SearchRequest
- Nginx Proxy Manager — fly-fix TLS checklist
- handleCreateSession
- googleflights2_provider.go
- .finalize
- api.ts
- steps
- flyfix-api
- skyscannerParse.js
- ResultsScreen.tsx
- auth.go
- booking.ts
- npm
- ValidateBookingURL
- kiwi.js
- DatePickerCalendar.tsx
- nginx-proxy-manager (VPS edge)
- RuntimeConfigContext.tsx
- AuthContext.tsx
- .SearchAll
- App.tsx
- warm.js
- SearchLoadingOverlay.tsx
- flyfix.ts
- AirportLocation
- ProviderResult
- normalizeKiwiItem
- test-kiwi-parse.js
- types/index.ts
- SelectBestOffer
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
- .doSearch
- Fly-Fix — Design System & Cursor Redesign Playbook
- write-spa-fallbacks.mjs
- parseOtaOffers
- server_carrier_test.go
- main
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
6. `AppIcon()` - 58 edges
7. `ResultsScreen()` - 58 edges
8. `MonthDealsScreen()` - 49 edges
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
- `Recent enhancements` --references--> `CheaperCitiesSection()`  [INFERRED]
  README.md → frontend/src/features/flight-search/components/CheaperCitiesSection.tsx

## Import Cycles
- None detected.

## Communities (109 total, 20 thin omitted)

### Community 0 - ".ResolveQuotedPartnerBooking"
Cohesion: 0.11
Nodes (29): gf2PartnerOfferFromQuoteURL(), optionVendorFromQuote(), resolveAllPartnerBookingsFromTokenWithRetry(), acquireBookingResolveSlot(), findBookingOptionsArray(), firstPartnerBookingOption(), firstPartnerURLInMap(), firstStringByKeys() (+21 more)

### Community 1 - "DestinationMoodBanner.tsx"
Cohesion: 0.09
Nodes (33): collectTripDestinationCodes(), DestinationMoodBanner(), DestinationMoodStrip(), moodSizeForVariant(), stripStyles, styles, Variant, AIRPORT_DICTIONARY (+25 more)

### Community 2 - "CanonicalSegment"
Cohesion: 0.08
Nodes (49): TestLookupAirlineIATA_Israir(), extractFlightNumbers(), flightNumberInText(), flightNumbersEquivalent(), splitFlightDesignator(), textContainsAirport(), textContainsAny(), timeMatches() (+41 more)

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "runBookingMatch"
Cohesion: 0.08
Nodes (54): TestRunBookingMatch_kiwiMixedCarriersNoAustrianDeeplink(), TestRunBookingMatch_kiwiWizzSellerPrimaryWithAirlineSecondary(), TestRunBookingMatch_prodShapeKiwiIsrairGetsAirlinePrefill(), TestRunBookingMatch_mergesOTAPartners(), canonicalItineraryForOption(), intPtrOrNil(), legRouteLabel(), TestCanonicalItineraryForOption_isolatesSplitLegs() (+46 more)

### Community 5 - "session_store.go"
Cohesion: 0.15
Nodes (24): loadSearchSession(), markSessionFailed(), publishSessionSnapshot(), TestLoadSearchSession_Expiry(), searchSessionTTL(), startSearchSessionCleanup(), cleanupPersistedSessions(), importLegacyJSONSessions() (+16 more)

### Community 6 - "frontend/package.json"
Cohesion: 0.06
Nodes (41): config, { getDefaultConfig }, dependencies, expo@~52.0.0, @expo/metro-runtime@~4.0.1, expo-status-bar@~2.0.0, react@18.3.1, react-dom@18.3.1 (+33 more)

### Community 7 - "useTheme"
Cohesion: 0.10
Nodes (48): ClearableTextInput(), ClearableTextInputProps, styles, EditSearchModal(), HubRouteSummaryModal(), SearchSummaryBar(), useAuth(), useLocale() (+40 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (33): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+25 more)

### Community 9 - "FlightOption"
Cohesion: 0.06
Nodes (64): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, CanonicalFingerprint(), TestCapOptionsKeepingVariety(), Carrier, DayDeal (+56 more)

### Community 10 - "flight-scraper/package.json"
Cohesion: 0.11
Nodes (17): express, playwright, dependencies, express@^4.21.2, playwright@^1.49.1, description, engines, node (+9 more)

### Community 11 - "attachQuotedPriceMeta"
Cohesion: 0.20
Nodes (10): attachQuotedPriceMeta(), redactPriceMismatchCheckoutURLs(), TestAttachQuotedPriceMeta_detectsMismatch(), hostFromURL(), PricesMatchQuote(), selectBookingOptionForQuote(), TestPricesMatchQuote(), TestSelectBookingOptionForQuote_fallsBackWhenQuotePriceMismatch() (+2 more)

### Community 12 - "BookingOptionsFooter.tsx"
Cohesion: 0.14
Nodes (32): BookingResolveResponse, isSafeBookingUrl(), PublicBookingOffer, DisplayPrice(), DisplayPriceProps, bookingOfferProviderLabel(), bookingOfferSubtitle(), formatBookingOfferPriceAmount() (+24 more)

### Community 13 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 14 - "FlightDetailsModal.tsx"
Cohesion: 0.06
Nodes (69): AIRLINE_NAMES, getAirlineName(), resolveAirlineLabel(), AIRLINE_FULL_NAMES, airportTimeZones, getAirportTimeZone(), cabinLabel(), FlightDetailsModal() (+61 more)

### Community 15 - "resolveGF2PartnerOffers"
Cohesion: 0.10
Nodes (37): resolveGF2PartnerOffers(), resolveLegBookingRedirectURL(), searchRequestFromSession(), TestSearchRequestFromSession_singleLegOverride(), openJawOption(), TestBookingLinkModeDefaultsToSkyscanner(), TestBookingRouteFromSessionOption_splitOmitsReturn(), TestBuildGoogleFlightsFallbackFromParams() (+29 more)

### Community 16 - "MonthDealsScreen.tsx"
Cohesion: 0.08
Nodes (40): SearchProgressBanner(), CheaperCitiesOption, buildDealsPositioningSignature(), dealBestScore(), fl, formatDealDate(), hfm, m (+32 more)

### Community 17 - "resolveOTAPartnerOffers"
Cohesion: 0.09
Nodes (24): dedupeGF2PartnerOffers(), gf2PartnerOfferFromResolved(), gf2PartnerOfferFromURL(), TestGF2PartnerOfferFromURL_acceptsHTTPS(), TestGF2PartnerOfferFromURL_metaSearchIsNotVerifiedCheckout(), TestGF2PartnerOfferFromURL_rejectsUnsafe(), TestGF2PartnerOfferFromURL_transportDeeplinkIsBooking(), flightSegmentToOtaMap() (+16 more)

### Community 18 - "react"
Cohesion: 0.09
Nodes (18): styles, HubRouteLeg, HubRouteSummaryModalProps, s, formatAirlineFilterLabel(), f, FiltersPanel(), Bone() (+10 more)

### Community 19 - "server.go"
Cohesion: 0.07
Nodes (87): GetClicksSummary(), bookingResolveMaxConcurrentFromEnv(), defaultBookingMatchRunner(), envDurationMinutes(), init(), corpusText(), logMatchEvent(), MatchItinerary() (+79 more)

### Community 22 - "skyscanner.js"
Cohesion: 0.11
Nodes (41): com, fr, req, pageLooksBlocked(), addPartner(), clickMatchingKiwiCard(), clickMatchingSkyscannerCard(), clocksFromSegments() (+33 more)

### Community 23 - "TestResult"
Cohesion: 0.19
Nodes (3): ResponseAnalyzer, main(), _print_unreachable_backend_hint()

### Community 25 - "runtime_config.go"
Cohesion: 0.22
Nodes (16): adminAccessConfigured(), configRangeError, adminTokenConfigured(), defaultRuntimeConfig(), errConfigOutOfRange(), getRuntimeConfig(), handleAdminRuntimeConfig(), initRuntimeConfigStore() (+8 more)

### Community 26 - "AppIcon"
Cohesion: 0.10
Nodes (40): AppIcon(), AppIconLibrary, AppIconProps, styles, EditSearchModalProps, s, FormHeroHeader(), FormHeroHeaderProps (+32 more)

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.30
Nodes (10): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+2 more)

### Community 29 - "auth.go"
Cohesion: 0.11
Nodes (42): getOTAProvider(), GetSessionAndOption(), ParseOptionIndex(), RecordClick(), ResolveProvider(), authUserJSON(), bearerTokenFromRequest(), handleAuthChangePassword() (+34 more)

### Community 30 - "session.js"
Cohesion: 0.16
Nodes (19): withCdpLock(), blockHeavyResources(), getOpenPageHook(), browserPromises, { chromium, firefox }, getBrowser(), isTransientScrapeError(), pickReusablePage() (+11 more)

### Community 31 - "LocaleContext.tsx"
Cohesion: 0.17
Nodes (15): getStorage(), languageToLocale(), loadSaved(), LocaleContext, LocaleContextValue, LocaleProvider(), save(), VALID_CURRENCIES (+7 more)

### Community 32 - "CanonicalItinerary"
Cohesion: 0.10
Nodes (35): domainFromURL(), extractPrice(), cfgTest(), testConnectingTLVJFK(), TestExtractPrice_euroPrefixNotArrivalTime(), TestGenerateQueries_connecting(), TestGenerateQueries_direct(), TestGenerateQueries_gf2AirlineNameIdentity() (+27 more)

### Community 33 - "ExploreScreen.tsx"
Cohesion: 0.14
Nodes (22): getMonthDeals(), c, countryFlag(), d, DestCard(), ExploreScreenProps, fmtDate(), fmtPrice() (+14 more)

### Community 34 - "explore_cache.go"
Cohesion: 0.09
Nodes (21): airportCoord, exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut(), getAirportCoord() (+13 more)

### Community 36 - "Backend QA Automation Tool"
Cohesion: 0.18
Nodes (10): Backend QA Automation Tool, Features, If the run feels slow or “stuck”, Notes, Optional AI Setup (Ollama), Output, Project Structure, Run (+2 more)

### Community 37 - "test-roundtrip-legs.js"
Cohesion: 0.13
Nodes (20): a, arr, assert, b, dep, late, assert, frSegs (+12 more)

### Community 38 - "BookingOffer"
Cohesion: 0.11
Nodes (45): airlineDomainForCarrier(), applySearchQuoteToOffer(), bookingMatchPriceNormalizer(), gf2OffersHavePrice(), marketingCarrierForLegIndex(), normalizedGF2OfferPrice(), offersIncludeAirlineDirect(), preferAirlineDirectWhenCheaperThanMarkedUpOTA() (+37 more)

### Community 39 - "search.ts"
Cohesion: 0.12
Nodes (29): CachedResult, createSearchSession(), createSearchSessionWithRetry(), ensureLegacyPurge(), fetchFresh(), getFromStorage(), getSearchSessionResults(), getStorage() (+21 more)

### Community 40 - "ThemeContext.tsx"
Cohesion: 0.13
Nodes (18): motion, darkTheme, FONTS, getWebStorage(), lightTheme, loadSavedThemeMode(), parseThemeMode(), persistThemeMode() (+10 more)

### Community 42 - "AirportAutocomplete.tsx"
Cohesion: 0.12
Nodes (40): AIRPORT_ONLY_DICTIONARY, FULL_PLACE_DICTIONARY, getAirportDisplayName(), getAirportNameByCode(), lower(), matchesQuery(), PLACE_SEARCH_LIMIT, rankResult() (+32 more)

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "BuildLegAirlineDirectURL"
Cohesion: 0.09
Nodes (25): BuildLegAirlineDirectURL(), BuildRedirectURL(), getAffiliateID(), TestBuildLegAirlineDirectURL_austrianHasNoUnverifiedLink(), stripEmptyQueryParams(), TestBuildLegAirlineDirectURL_wizzPathNotHash(), TestBuildLegAirlineDirectURL_wizzRoundTripReturnDate(), allocateLegQuoteAmount() (+17 more)

### Community 45 - "handleBookingResolve"
Cohesion: 0.12
Nodes (20): beginInflightResolve(), bookingResolveCacheKey(), cacheTTLForStatus(), dualBookingOptionCount(), finishInflightResolve(), getCachedBookingResolve(), handleBookingResolve(), logBookingResolve() (+12 more)

### Community 46 - "test_cases"
Cohesion: 0.05
Nodes (40): departureDate, origin, byProvider, currency, error, from, items, route (+32 more)

### Community 47 - "RootNavigator.tsx"
Cohesion: 0.06
Nodes (45): ErrorBoundary, Props, s, State, Nav, SiteFooter(), styles, LandingMoodImage() (+37 more)

### Community 53 - "SearchRequest"
Cohesion: 0.09
Nodes (34): TestCompleteExtraLegs(), TestExtraLegsFingerprint(), classicRoundTripMissingReturn(), TestClassicRoundTripMissingReturn(), TestDoSearchWithRetry_doesNotCacheRoundTrip(), TestSearch_ignoresIncompleteClassicRTCache(), TestSearch_servesCompleteClassicRTCache(), newGF2Cache() (+26 more)

### Community 54 - "Nginx Proxy Manager — fly-fix TLS checklist"
Cohesion: 0.40
Nodes (4): Nginx Proxy Manager — fly-fix TLS checklist, Reissue frontend cert (both names), Required proxy-host settings, Symptoms Chrome shows

### Community 55 - "handleCreateSession"
Cohesion: 0.15
Nodes (14): CreateSearchSessionRequest, ExtraSearchLeg, SearchTransientRetryMax(), ProviderSearchStats, SearchProgress, SearchSession, SearchSessionResultsResponse, SearchSessionStatus (+6 more)

### Community 56 - "googleflights2_provider.go"
Cohesion: 0.11
Nodes (36): TestParseGF2TimeWithDateHint_AirportLocal(), TestExtractGF2BookingToken(), TestBuildGF2ResultFromItinerary_FlatFormat(), TestParseGF2Response_AttachesFlatReturnFlights(), TestParseGF2Response_RapidAPIFlatTopFlights(), TestParseGF2Response_topFlightsWithoutPriceHistory(), TestExtractGF2Leg_TimeOnly_NoDateHint(), TestExtractGF2SegmentFromFlight_CodeOnlyHasNoName() (+28 more)

### Community 58 - "api.ts"
Cohesion: 0.09
Nodes (31): FiltersPanelProps, FlightDetailsModalProps, FlightResultCardProps, PassengerCabinPickerProps, SearchFormContentProps, SortBarProps, PositioningLegResult, defaultFilters (+23 more)

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
Cohesion: 0.10
Nodes (40): DynamicDestinationsFormContentProps, defaultParams, DynamicDestinationsScreen(), Nav, styles, ExploreScreen(), bestScore(), currentGeneration() (+32 more)

### Community 63 - "auth.go"
Cohesion: 0.18
Nodes (19): bootstrapAdminUser(), createAuthSession(), envFlagTrue(), handleAuthLogin(), initAuthStore(), insertAdminUser(), newSessionToken(), publicRegistrationEnabled() (+11 more)

### Community 64 - "booking.ts"
Cohesion: 0.36
Nodes (8): BookingResolveRequest, BookingResolveStatus, bookingRetryDelayMs(), fetchBookingResolveOnce(), isTransientBookingFetchError(), isTransientBookingResolveResponse(), PublicBookingAlternative, resolveBookingOffer()

### Community 65 - "npm"
Cohesion: 0.17
Nodes (11): networks, proxy, container_name, image, networks, ports, restart, volumes (+3 more)

### Community 66 - "ValidateBookingURL"
Cohesion: 0.27
Nodes (11): gf2CheckoutOffers(), IsCheckoutBookingURL(), IsNonBookableDomain(), TestIsCheckoutBookingURL_rejectsFlightSearchPages(), TestIsNonBookableDomain_blocksFlightRadar(), TestValidateBookingURL_acceptsHTTPS(), TestValidateBookingURL_rejectsEmpty(), TestValidateBookingURL_rejectsJavascript() (+3 more)

### Community 67 - "kiwi.js"
Cohesion: 0.18
Nodes (20): assert, clearKiwiSpaState(), ensureKiwiResultsUrl(), extractFromCaptured(), extractNextData(), flattenOffers(), kiwiPathLooksCorrect(), kiwiSearchUrl() (+12 more)

### Community 68 - "DatePickerCalendar.tsx"
Cohesion: 0.15
Nodes (15): searchAirports(), apiGet(), getDealsRange(), GetDealsRangeParams, GetMonthDealsParams, getFlightDetails(), GetFlightDetailsParams, DatePickerCalendar() (+7 more)

### Community 69 - "nginx-proxy-manager (VPS edge)"
Cohesion: 0.40
Nodes (4): Deploy sync, First-time / recovery, nginx-proxy-manager (VPS edge), On the server

### Community 70 - "RuntimeConfigContext.tsx"
Cohesion: 0.16
Nodes (19): apiRequest(), adminAuthHeaders(), fetchAdminRuntimeConfig(), fetchRuntimeConfig(), saveAdminRuntimeConfig(), setRuntimeConfigStore(), RuntimeConfigContext, RuntimeConfigContextValue (+11 more)

### Community 71 - "AuthContext.tsx"
Cohesion: 0.17
Nodes (22): authHeaders(), AuthUser, changePassword(), createUser(), deleteUser(), fetchAuthMe(), fetchUsers(), LoginResponse (+14 more)

### Community 72 - ".SearchAll"
Cohesion: 0.11
Nodes (15): TestSanitizeProviderErrorForUser(), TestRegistryFailureMessage_transientOutbound(), TestRegistrySearchAll_dedupeComparesInRequestedCurrency(), TestRegistrySearchAll_fastOnlySkipsScraper(), TestRegistrySearchAll_openJawGF2FailNotMaskedByKiwiSkip(), TestRegistrySearchAllPartialFailure(), TestRegistrySearchAllWithProgress(), convertResultsToCurrency() (+7 more)

### Community 73 - "App.tsx"
Cohesion: 0.08
Nodes (41): App(), linking, RTLWrapper(), DocumentLike, Focusable, useKeepFocusedFieldVisible(), buildSearchString(), getParam() (+33 more)

### Community 74 - "warm.js"
Cohesion: 0.09
Nodes (23): cdpLockBusy(), chain, DEFAULT_SITES, beginSearch(), endSearch(), isSearchBusy(), app, express (+15 more)

### Community 75 - "SearchLoadingOverlay.tsx"
Cohesion: 0.09
Nodes (28): getAlmostDonePhrase(), getPhrasesForLanguage(), pickSearchStatusPhrase(), providerPhraseMap(), SEARCH_ALMOST_DONE, SEARCH_BUTTON_ALMOST_DONE, SEARCH_BUTTON_PHRASES, SEARCH_PROGRESS_PHRASES (+20 more)

### Community 76 - "flyfix.ts"
Cohesion: 0.18
Nodes (11): API_BASE, apiPost(), apiUrl(), isLocalHostname(), resolveApiBase(), FlyfixInsightsGroup, FlyfixIssue, FlyfixRefinedReport (+3 more)

### Community 77 - "AirportLocation"
Cohesion: 0.14
Nodes (16): AirportLocation(), TestAirportLocation_UnknownFallsBackUTC(), TestParseGF2TimeWithDateHint_TelAviv(), TestParseGF2Time_EuropeanDateFormat(), TestExtractGF2Leg_SingleSegment_DepartArriveDiffer(), TestExtractGF2Leg_TimeOnly_WithDateHint(), TestParseGF2Time_AcceptsFullDateTime(), TestParseGF2Time_NumericOffsetIsAbsolute() (+8 more)

### Community 78 - "ProviderResult"
Cohesion: 0.07
Nodes (32): isTransientGF2BookingErr(), bookingResolveFailureResponse(), TestCombineOneWayBatches(), TestCombineOneWayBatches_emptyBatch(), TestCombineOneWayBatches_keepsNonstopsBothWays(), TestCombineOneWayBatches_openJawReturnDiversity(), cheapestReturnLeg(), providerResultArrivalAirport() (+24 more)

### Community 79 - "normalizeKiwiItem"
Cohesion: 0.17
Nodes (18): TotalStops(), TestParseOTASegmentTime_AirportWallClock(), asArray(), collectCarriers(), detectSelfTransfer(), extractKiwiLegs(), firstFloat(), firstString() (+10 more)

### Community 80 - "test-kiwi-parse.js"
Cohesion: 0.20
Nodes (10): assert, offers, pending, req, bookingUrlFor(), extractKiwiUmbrella(), kiwiUmbrellaSettled(), sectorSegments() (+2 more)

### Community 81 - "types/index.ts"
Cohesion: 0.15
Nodes (13): ExploreResponse, getExploreDestinations(), GetExploreDestinationsParams, DestCardProps, ExploreDestination, countByStopsFilter(), matchesStopsFilter(), maxStopsPerLeg() (+5 more)

### Community 82 - "SelectBestOffer"
Cohesion: 0.12
Nodes (17): classifyURLType(), floatPtr(), TestClassifyURLType_genericVsExact(), TestSelectBestOffer_cheapestOTAOverAirline(), TestSelectBestOffer_conflictingCandidatesPicksCheapest(), TestSelectBestOffer_missingPrice(), TestSelectBestOffer_multipleMatching(), TestSelectBestOffer_prefersPriceAmongSameURLType() (+9 more)

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
Cohesion: 0.10
Nodes (24): elapsedMs(), minutesOfDay(), bookingResolveCacheEntry, ClickRecord, getExploreSession(), putExploreSession(), exploreSession, FullRoundTrip (+16 more)

### Community 93 - "scrape.js"
Cohesion: 0.24
Nodes (13): assert, kiwi, pxSky, sky, hasCdp(), runWithSiteBudget(), scrapeAll(), scrapeSerial() (+5 more)

### Community 94 - ".doSearch"
Cohesion: 0.22
Nodes (7): DedupeProviderResults(), ItineraryFingerprint(), mergeSelfTransfer(), uniqueStrings(), truncateGF2(), TestDedupeKeepsCheaper(), TestItineraryFingerprintStable()

### Community 95 - "Fly-Fix — Design System & Cursor Redesign Playbook"
Cohesion: 0.22
Nodes (8): 1. Product and brand direction, 2. Design tokens (proposed starting values), 3. Core product patterns, 4. Motion, 5. Cursor workflow phases, 6. Non-negotiable constraints, 7. Working method, Fly-Fix — Design System & Cursor Redesign Playbook

### Community 96 - "write-spa-fallbacks.mjs"
Cohesion: 0.22
Nodes (5): __dirname, dist, indexHtml, indexPath, SPA_ROUTES

### Community 97 - "parseOtaOffers"
Cohesion: 0.25
Nodes (8): TestParseOtaOffers_normalizesIsrairDisplayName(), TestParseOtaOffers_IsrairNameToIATA(), ParseOtaOffers(), parseOtaOffers(), TestParseOtaOffers_dropsSkyscannerMetaDeepLink(), TestParseOtaOffers_keepsSkyscannerTransportDeeplink(), TestParseOtaOffersEmptyAndInvalid(), TestParseOtaOffersSolidcodeShape()

### Community 98 - "server_carrier_test.go"
Cohesion: 0.43
Nodes (6): CarrierCodes, makeOfferWithCarriers(), TestExtractCarrierCodes(), TestPrimaryDisplayCarrier(), ExtractCarrierCodes(), PrimaryDisplayCarrier()

### Community 99 - "main"
Cohesion: 0.33
Nodes (5): startExploreSessionCleanup(), corsMiddleware(), fetchExchangeRates(), main(), startExchangeRateRefresh()

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
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 645 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Fly-Fix` connect `Features` to `AppIcon`?**
  _High betweenness centrality (0.298) - this node is a cross-community bridge._
- **What connects `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `.ResolveQuotedPartnerBooking` be split into smaller, more focused modules?**
  _Cohesion score 0.10638297872340426 - nodes in this community are weakly interconnected._
- **Why does `Multi-provider flight search` connect `Features` to `server.go`?**
  _High betweenness centrality (0.296) - this node is a cross-community bridge._
- **Should `DestinationMoodBanner.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08534850640113797 - nodes in this community are weakly interconnected._
- **Why does `Recent enhancements` connect `AppIcon` to `Features`, `useTheme`?**
  _High betweenness centrality (0.288) - this node is a cross-community bridge._
- **Should `CanonicalSegment` be split into smaller, more focused modules?**
  _Cohesion score 0.08418367346938775 - nodes in this community are weakly interconnected._