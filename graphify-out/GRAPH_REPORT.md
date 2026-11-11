# Graph Report - workspace  (2026-11-11)

## Corpus Check
- 287 files · ~240,762 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 14 file(s) not represented in the graph (top: (none) 8, .example 2, .conf 2)

## Summary
- 2400 nodes · 7448 edges · 105 communities (88 shown, 17 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 604 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4fcc0770`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- .ResolveQuotedPartnerBooking
- types.ts
- SearchFormScreen.tsx
- Issue
- SearchLoadingOverlay.tsx
- AdminRuntimeConfigPanel.tsx
- frontend/package.json
- useTheme
- Features
- ThemeContext.tsx
- flight-scraper/package.json
- booking_gf2_resolve.go
- BookingOptionsFooter.tsx
- compilerOptions
- resolveBookingOffer
- canonical_booking_test.go
- MonthDealsScreen.tsx
- googleflights2_provider.go
- server.go
- booking_resolve_test.go
- qa_runner.py
- ApiClient
- matcher_test.go
- TestResult
- ResponseValidator
- runtime_config.go
- FiltersPanel.tsx
- expo
- config_loader.py
- auth_test.go
- CanonicalItinerary
- auth.go
- itinerary.go
- BookingOffer
- explore_cache.go
- ValidationIssue
- Backend QA Automation Tool
- test-roundtrip-legs.js
- affiliate.go
- search.ts
- affiliate.ts
- models.py
- ExploreScreen.tsx
- Fly-Fix – Frontend
- DestinationMoodBanner.tsx
- booking_resolve.go
- test_cases
- flightTimeDisplay.ts
- gen_explore_airport_coords.py
- flightcaptainweb
- session_store.go
- Nginx Proxy Manager — fly-fix TLS checklist
- react-native
- legSummary.ts
- .finalize
- AppIcon
- steps
- flyfix-api
- OtaScraperProvider
- ResultsScreen.tsx
- ExploreScreen.tsx
- client.ts
- npm
- skyscanner.js
- kiwi.js
- CombineOneWayBatches
- nginx-proxy-manager (VPS edge)
- SearchRequest
- AuthContext.tsx
- .SearchAllWithProgress
- providers.go
- scrape.js
- ProviderResult
- handleExplore
- AirportLocation
- TopNavMenu.tsx
- ValidateBookingURL
- server_carrier_test.go
- CalendarModal.tsx
- session.js
- Fly-Fix UI / UX
- TestApplySoftStrictBaggage
- backend_api_contracts.md
- ensure-edge-proxy.sh
- budget_config.go
- expedia.js
- LocaleContext.tsx
- install-edge-proxy-cron.sh
- sync-edge-stack.sh
- time.Time
- destinationMood.ts
- ErrorBoundary
- GF2SearchAirports
- flyfix.ts
- CompleteExtraLegs
- SortBar.tsx
- ensure-flight-chrome.sh
- skyscanner.ts
- docker-entrypoint.sh
- testing.T

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 102 edges
2. `useLocale()` - 88 edges
3. `react` - 70 edges
4. `react-native` - 63 edges
5. `ResultsScreen()` - 56 edges
6. `ProviderResult` - 55 edges
7. `AppIcon()` - 52 edges
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
- `Multi-provider flight search` --references--> `NewRegistryFromEnv()`  [INFERRED]
  README.md → backend/search/registry.go
- `Recent enhancements` --references--> `AppIcon()`  [INFERRED]
  README.md → frontend/src/components/AppIcon.tsx

## Import Cycles
- None detected.

## Communities (105 total, 17 thin omitted)

### Community 0 - ".ResolveQuotedPartnerBooking"
Cohesion: 0.16
Nodes (18): findBookingOptionsArray(), firstPartnerBookingOption(), firstPartnerURLInMap(), firstStringByKeys(), ResolvedPartnerBooking, isPartnerBookingList(), parseGF2BookingOptions(), partnerRequestTokenFromMap() (+10 more)

### Community 1 - "types.ts"
Cohesion: 0.18
Nodes (13): DynamicDestinationsStack(), Stack, MonthDealsStack(), Stack, SearchStack(), Stack, DynamicDestinationsStackParamList, MonthDealsStackParamList (+5 more)

### Community 2 - "SearchFormScreen.tsx"
Cohesion: 0.11
Nodes (33): buildSearchString(), getParam(), getParams(), isWeb(), parseSearchParamsFromUrl(), SearchUrlState, updateSearchUrl(), useSearchParams() (+25 more)

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "SearchLoadingOverlay.tsx"
Cohesion: 0.31
Nodes (7): CubeSpinStyles(), LoadingCubePreview(), LoadingCubePulse(), styles, ExtraLeg, Props, s

### Community 5 - "AdminRuntimeConfigPanel.tsx"
Cohesion: 0.20
Nodes (17): apiRequest(), adminAuthHeaders(), fetchAdminRuntimeConfig(), fetchRuntimeConfig(), saveAdminRuntimeConfig(), RuntimeConfigContext, RuntimeConfigContextValue, useRuntimeConfigActions() (+9 more)

### Community 6 - "frontend/package.json"
Cohesion: 0.06
Nodes (40): config, { getDefaultConfig }, dependencies, expo@~52.0.0, @expo/metro-runtime@~4.0.1, expo-status-bar@~2.0.0, react@18.3.1, react-dom@18.3.1 (+32 more)

### Community 7 - "useTheme"
Cohesion: 0.12
Nodes (43): ClearableTextInput(), ClearableTextInputProps, styles, EditSearchModal(), HubRouteSummaryModal(), SearchSummaryBar(), useAuth(), useLocale() (+35 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (34): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+26 more)

### Community 9 - "ThemeContext.tsx"
Cohesion: 0.09
Nodes (28): App(), linking, RTLWrapper(), SEARCH_PROGRESS_PHRASES, s, SearchProgressBannerProps, setRuntimeConfigStore(), RuntimeConfigProvider() (+20 more)

### Community 10 - "flight-scraper/package.json"
Cohesion: 0.11
Nodes (17): express, playwright, dependencies, express@^4.21.2, playwright@^1.49.1, description, engines, node (+9 more)

### Community 11 - "booking_gf2_resolve.go"
Cohesion: 0.12
Nodes (35): airlineDomainForCarrier(), allocateLegQuoteAmount(), applySearchQuoteToOffer(), attachQuotedPriceMeta(), dedupeGF2PartnerOffers(), flightLegDurationMinutes(), gf2OffersHavePrice(), gf2PartnerOfferFromQuoteURL() (+27 more)

### Community 12 - "BookingOptionsFooter.tsx"
Cohesion: 0.17
Nodes (27): BookingResolveResponse, isSafeBookingUrl(), PublicBookingOffer, bookingOfferProviderLabel(), bookingOfferSubtitle(), formatBookingOfferPriceAmount(), formatBookingOfferPriceLine(), formatProviderDisplayName() (+19 more)

### Community 13 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 14 - "resolveBookingOffer"
Cohesion: 0.11
Nodes (23): acquireBookingResolveSlot(), beginInflightResolve(), bookingResolveCacheKey(), bookingResolveFailureResponse(), cacheTTLForStatus(), finishInflightResolve(), getCachedBookingResolve(), handleBookingResolve() (+15 more)

### Community 15 - "canonical_booking_test.go"
Cohesion: 0.12
Nodes (28): openJawOption(), TestBookingLinkModeDefaultsToGoogle(), TestBookingRouteFromSessionOption_splitOmitsReturn(), TestBuildGoogleFlightsFallbackFromParams(), TestBuildLegOrSegmentBookingURL_segment(), TestBuildOneWayLegBookingURL(), TestBuildSkyscannerPrefillURL_oneWay(), TestBuildSkyscannerPrefillURL_roundTrip() (+20 more)

### Community 16 - "MonthDealsScreen.tsx"
Cohesion: 0.08
Nodes (47): SearchProgressBanner(), CheaperCitiesOption, CheaperCitiesSection(), Props, s, SortBar(), buildDealsPositioningSignature(), dealBestScore() (+39 more)

### Community 17 - "googleflights2_provider.go"
Cohesion: 0.13
Nodes (39): TestParseGF2TimeWithDateHint_AirportLocal(), TestExtractGF2BookingToken(), TestExtractGF2BookingURL(), TestExtractGF2PartnerBookingTokenPrefersPartnerURL(), TestBuildGF2ResultFromItinerary_FlatFormat(), TestParseGF2Response_AttachesFlatReturnFlights(), TestParseGF2Response_RapidAPIFlatTopFlights(), buildGF2ResultFromItinerary() (+31 more)

### Community 18 - "server.go"
Cohesion: 0.06
Nodes (62): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, CanonicalFingerprint(), Carrier, CreateSearchSessionRequest, DayDeal (+54 more)

### Community 19 - "booking_resolve_test.go"
Cohesion: 0.28
Nodes (5): CodeshareFingerprint(), roundTimeToMinutes(), exploreLiveCandidate, gf2ExploreResolveDeps(), outboundDatesForMonthBookable()

### Community 22 - "matcher_test.go"
Cohesion: 0.10
Nodes (46): classifyURLType(), extractPrice(), cfgTest(), floatPtr(), TestClassifyURLType_genericVsExact(), testConnectingTLVJFK(), TestExtractPrice_euroPrefixNotArrivalTime(), TestFlightNumbersEquivalent_leadingZeros() (+38 more)

### Community 23 - "TestResult"
Cohesion: 0.19
Nodes (3): ResponseAnalyzer, main(), _print_unreachable_backend_hint()

### Community 25 - "runtime_config.go"
Cohesion: 0.22
Nodes (16): adminAccessConfigured(), configRangeError, adminTokenConfigured(), defaultRuntimeConfig(), errConfigOutOfRange(), getRuntimeConfig(), handleAdminRuntimeConfig(), initRuntimeConfigStore() (+8 more)

### Community 26 - "FiltersPanel.tsx"
Cohesion: 0.14
Nodes (22): AIRLINE_NAMES, getAirlineName(), resolveAirlineLabel(), AIRLINE_FULL_NAMES, f, FiltersPanel(), FiltersPanelProps, FlightDetailsModalProps (+14 more)

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.30
Nodes (10): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+2 more)

### Community 29 - "auth_test.go"
Cohesion: 0.36
Nodes (11): handleAuthLogin(), initAuthStore(), purgeExpiredAuthSessions(), purgeExpiredAuthSessionsLoop(), initTestAuthDB(), randomTestPassword(), TestAuthLoginAndChangePassword(), TestAuthRegister() (+3 more)

### Community 30 - "CanonicalItinerary"
Cohesion: 0.08
Nodes (33): canonicalItineraryForOption(), defaultBookingMatchRunner(), mustCanonicalForLog(), corpusText(), domainFromURL(), logMatchEvent(), countVerifiedPricedOffers(), MatchItinerary() (+25 more)

### Community 31 - "auth.go"
Cohesion: 0.15
Nodes (36): authUserJSON(), bearerTokenFromRequest(), bootstrapAdminUser(), createAuthSession(), envFlagTrue(), handleAuthChangePassword(), handleAuthLogout(), handleAuthMe() (+28 more)

### Community 32 - "itinerary.go"
Cohesion: 0.10
Nodes (42): extractFlightNumbers(), flightNumberInText(), flightNumbersEquivalent(), splitFlightDesignator(), textContainsAirport(), textContainsAny(), timeMatches(), connectingFlightQueries() (+34 more)

### Community 33 - "BookingOffer"
Cohesion: 0.16
Nodes (31): bookingMatchPriceNormalizer(), isAffiliateTemplateBookingURL(), normalizedGF2OfferPrice(), preferAirlineDirectWhenCheaperThanMarkedUpOTA(), publicAlternativesFromOffers(), bookingOfferInGF2Sources(), bookingOfferSameURL(), buildDualBookingResolveResponse() (+23 more)

### Community 34 - "explore_cache.go"
Cohesion: 0.10
Nodes (20): airportCoord, exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut(), getAirportCoord() (+12 more)

### Community 36 - "Backend QA Automation Tool"
Cohesion: 0.18
Nodes (10): Backend QA Automation Tool, Features, If the run feels slow or “stuck”, Notes, Optional AI Setup (Ollama), Output, Project Structure, Run (+2 more)

### Community 37 - "test-roundtrip-legs.js"
Cohesion: 0.13
Nodes (19): a, arr, assert, b, dep, late, assert, frSegs (+11 more)

### Community 38 - "affiliate.go"
Cohesion: 0.14
Nodes (20): BuildLegAirlineDirectURL(), BuildRedirectURL(), getAffiliateID(), GetClicksSummary(), getOTAProvider(), GetSessionAndOption(), ParseOptionIndex(), RecordClick() (+12 more)

### Community 39 - "search.ts"
Cohesion: 0.12
Nodes (28): CachedResult, createSearchSession(), createSearchSessionWithRetry(), ensureLegacyPurge(), fetchFresh(), getFromStorage(), getSearchSessionResults(), getStorage() (+20 more)

### Community 40 - "affiliate.ts"
Cohesion: 0.16
Nodes (17): AffiliateProvider, AffiliateProviderResponse, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink(), OutboundLinkResponse (+9 more)

### Community 42 - "ExploreScreen.tsx"
Cohesion: 0.14
Nodes (35): AIRPORT_ONLY_DICTIONARY, FULL_PLACE_DICTIONARY, getAirportDisplayName(), lower(), matchesQuery(), PLACE_SEARCH_LIMIT, rankResult(), searchAirportsLocal() (+27 more)

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "DestinationMoodBanner.tsx"
Cohesion: 0.12
Nodes (11): __dirname, dist, indexHtml, indexPath, SPA_ROUTES, byCity, curatedCities, curatedUrls (+3 more)

### Community 45 - "booking_resolve.go"
Cohesion: 0.13
Nodes (9): bookingResolveMaxConcurrentFromEnv(), envDurationMinutes(), init(), BookingResolveRequest, PublicBookingAlternative, parseOtaScraperSites(), otaScraperSearchRequest, otaScraperSearchResponse (+1 more)

### Community 46 - "test_cases"
Cohesion: 0.05
Nodes (40): departureDate, origin, byProvider, currency, error, from, items, route (+32 more)

### Community 47 - "flightTimeDisplay.ts"
Cohesion: 0.17
Nodes (21): getAirportNameByCode(), airportTimeZones, getAirportTimeZone(), cabinLabel(), FlightDetailsModal(), formatDuration(), layoverBetween(), legDuration() (+13 more)

### Community 53 - "session_store.go"
Cohesion: 0.14
Nodes (27): ProviderSearchStats, SearchSession, SearchSessionResultsResponse, SearchSessionStatus, loadSearchSession(), markSessionFailed(), publishSessionSnapshot(), TestLoadSearchSession_Expiry() (+19 more)

### Community 54 - "Nginx Proxy Manager — fly-fix TLS checklist"
Cohesion: 0.40
Nodes (4): Nginx Proxy Manager — fly-fix TLS checklist, Reissue frontend cert (both names), Required proxy-host settings, Symptoms Chrome shows

### Community 55 - "react-native"
Cohesion: 0.08
Nodes (22): AppIconLibrary, AppIconProps, styles, styles, EditSearchModalProps, s, HubRouteLeg, HubRouteSummaryModalProps (+14 more)

### Community 56 - "legSummary.ts"
Cohesion: 0.15
Nodes (22): buildRoutePath(), c, FlightResultCard(), LegScheduleBlock(), useExchangeRates(), FlightSegment, LayoverSummary, convertPrice() (+14 more)

### Community 58 - "AppIcon"
Cohesion: 0.13
Nodes (28): AppIcon(), FormHeroHeader(), FormHeroHeaderProps, styles, formCardStyles, makeFormThemedStyles(), getPhrasesForLanguage(), SEARCH_BUTTON_PHRASES (+20 more)

### Community 59 - "steps"
Cohesion: 0.09
Nodes (22): runs-on, steps, jobs, deploy, name, on, push, workflow_dispatch (+14 more)

### Community 60 - "flyfix-api"
Cohesion: 0.06
Nodes (37): context, FLIGHT_SCRAPER_MAX_CONCURRENT, FLIGHT_SCRAPER_URL, PLAYWRIGHT_HEADLESS, PORT, SCRAPER_CDP_URLS, SCRAPER_PROXY_URL, SCRAPER_WARM_ON_START (+29 more)

### Community 61 - "OtaScraperProvider"
Cohesion: 0.10
Nodes (14): parseOtaOffers(), truncateStr(), TestParseOtaOffers_dropsSkyscannerMetaDeepLink(), TestParseOtaOffersEmptyAndInvalid(), TestParseOtaOffersSolidcodeShape(), flattenOtaScraperResponse(), otaCabin(), otaCurrency() (+6 more)

### Community 62 - "ResultsScreen.tsx"
Cohesion: 0.11
Nodes (33): DynamicDestinationsFormContentProps, defaultParams, DynamicDestinationsScreen(), Nav, styles, bestScore(), currentGeneration(), defaultFormParams (+25 more)

### Community 63 - "ExploreScreen.tsx"
Cohesion: 0.08
Nodes (49): getMonthDeals(), getExploreDestinations(), SearchLoadingOverlay(), useRuntimeConfig(), getAirportEntry(), getCityDisplayName(), LANDING_MOOD_DESTINATIONS, SearchFormContent() (+41 more)

### Community 64 - "client.ts"
Cohesion: 0.07
Nodes (33): searchAirports(), API_BASE, apiGet(), apiUrl(), isLocalHostname(), resolveApiBase(), getDealsRange(), GetDealsRangeParams (+25 more)

### Community 65 - "npm"
Cohesion: 0.17
Nodes (11): networks, proxy, container_name, image, networks, ports, restart, volumes (+3 more)

### Community 66 - "skyscanner.js"
Cohesion: 0.17
Nodes (20): com, fr, req, waitUntil(), skyscannerDate(), ensureDatedResultsUrl(), extractSkyscanner(), FLIGHTS_PATH_BY_HOST (+12 more)

### Community 67 - "kiwi.js"
Cohesion: 0.16
Nodes (24): offerTemplate(), segment(), segmentsFromRoundTripClocks(), clearKiwiSpaState(), ensureKiwiResultsUrl(), extractFromCaptured(), extractNextData(), flattenOffers() (+16 more)

### Community 68 - "CombineOneWayBatches"
Cohesion: 0.22
Nodes (10): TestCombineOneWayBatches(), TestCombineOneWayBatches_emptyBatch(), TestCombineOneWayBatches_openJawReturnDiversity(), TestAttachCanonicalIdentityAll_combineOneWay(), cloneLegs(), CombineOneWayBatches(), extraLegMaxPerBatch(), marketingCarriersFromLegs() (+2 more)

### Community 69 - "nginx-proxy-manager (VPS edge)"
Cohesion: 0.40
Nodes (4): Deploy sync, First-time / recovery, nginx-proxy-manager (VPS edge), On the server

### Community 70 - "SearchRequest"
Cohesion: 0.12
Nodes (20): classicRoundTripMissingReturn(), TestClassicRoundTripMissingReturn(), TestDoSearchWithRetry_doesNotCacheRoundTrip(), TestSearch_ignoresIncompleteClassicRTCache(), TestSearch_servesCompleteClassicRTCache(), GoogleFlights2Provider, newGF2Cache(), newGF2RateLimiter() (+12 more)

### Community 71 - "AuthContext.tsx"
Cohesion: 0.16
Nodes (25): authHeaders(), AuthUser, changePassword(), createUser(), deleteUser(), fetchAuthMe(), fetchUsers(), LoginResponse (+17 more)

### Community 72 - ".SearchAllWithProgress"
Cohesion: 0.16
Nodes (10): AttachCanonicalIdentityAll(), TestRegistryFailureMessage_transientOutbound(), TestRegistrySearchAll_openJawGF2FailNotMaskedByKiwiSkip(), TestRegistrySearchAllPartialFailure(), isFastProvider(), isSkippedProviderErr(), IsTransientSearchErrMsg(), multisiteSoftTimeout() (+2 more)

### Community 73 - "providers.go"
Cohesion: 0.22
Nodes (16): asArray(), collectCarriers(), detectSelfTransfer(), extractKiwiLegs(), firstFloat(), firstString(), kiwiSegmentFromMap(), mapsToSegments() (+8 more)

### Community 74 - "scrape.js"
Cohesion: 0.18
Nodes (11): runWithOpenPage(), hasCdp(), runOne(), scrapeAll(), SITE_FNS, beginSearch(), endSearch(), isSearchBusy() (+3 more)

### Community 75 - "ProviderResult"
Cohesion: 0.09
Nodes (21): DedupeProviderResults(), ItineraryFingerprint(), mergeSelfTransfer(), uniqueStrings(), cheapestReturnLeg(), providerResultArrivalAirport(), TestCheapestReturnLeg(), legSearchRetryable() (+13 more)

### Community 76 - "handleExplore"
Cohesion: 0.20
Nodes (11): exploreSessionKey(), getExploreSession(), newExploreSessionID(), putExploreSession(), startExploreSessionCleanup(), exploreSession, corsMiddleware(), fetchExchangeRates() (+3 more)

### Community 77 - "AirportLocation"
Cohesion: 0.12
Nodes (21): AirportLocation(), TestAirportLocation_UnknownFallsBackUTC(), TestParseGF2TimeWithDateHint_TelAviv(), TestParseGF2Time_EuropeanDateFormat(), TestExtractGF2Leg_SingleSegment_DepartArriveDiffer(), TestExtractGF2Leg_TimeOnly_NoDateHint(), TestExtractGF2Leg_TimeOnly_WithDateHint(), TestExtractGF2SegmentFromFlight_CodeOnlyHasNoName() (+13 more)

### Community 78 - "TopNavMenu.tsx"
Cohesion: 0.25
Nodes (8): MobileNavRow(), NavIconName, RESULTS_SCREENS, RouteProps, styles, TITLE_KEYS, TopNavMenu(), RootStackParamList

### Community 79 - "ValidateBookingURL"
Cohesion: 0.24
Nodes (11): gf2CheckoutOffers(), IsCheckoutBookingURL(), IsNonBookableDomain(), TestIsCheckoutBookingURL_rejectsFlightSearchPages(), TestIsNonBookableDomain_blocksFlightRadar(), TestValidateBookingURL_acceptsHTTPS(), TestValidateBookingURL_rejectsEmpty(), TestValidateBookingURL_rejectsJavascript() (+3 more)

### Community 80 - "server_carrier_test.go"
Cohesion: 0.43
Nodes (6): CarrierCodes, makeOfferWithCarriers(), TestExtractCarrierCodes(), TestPrimaryDisplayCarrier(), ExtractCarrierCodes(), PrimaryDisplayCarrier()

### Community 81 - "CalendarModal.tsx"
Cohesion: 0.38
Nodes (6): buildMonthDays(), CalendarModal(), getMonthStart(), Props, styles, WEEKDAYS

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
Cohesion: 0.12
Nodes (29): init(), budgetCfg(), BudgetModeEnabled(), durationFromEnvMin(), envTruthy(), ExploreBudgetLimits(), FilterProviderNamesForBudget(), GF2EffectiveCacheTTL() (+21 more)

### Community 88 - "expedia.js"
Cohesion: 0.19
Nodes (6): DEFAULT_SITES, expediaUrl(), scrapeExpedia(), attachJsonCapture(), gotoAndSettle(), mergeConfig()

### Community 89 - "LocaleContext.tsx"
Cohesion: 0.15
Nodes (19): DisplayPrice(), DisplayPriceProps, getStorage(), languageToLocale(), loadSaved(), LocaleContext, LocaleContextValue, LocaleProvider() (+11 more)

### Community 92 - "time.Time"
Cohesion: 0.17
Nodes (16): elapsedMs(), minutesOfDay(), FullRoundTrip, attachReturnLegKeepPrice(), ensureRoundTripLegs(), gf2ExploreSearchOneDestination(), gf2OneRoundTrip(), gf2SearchDealsOnDates() (+8 more)

### Community 93 - "destinationMood.ts"
Cohesion: 0.14
Nodes (18): collectTripDestinationCodes(), DestinationMoodBanner(), DestinationMoodStrip(), moodSizeForVariant(), stripStyles, styles, Variant, AIRPORT_DICTIONARY (+10 more)

### Community 94 - "ErrorBoundary"
Cohesion: 0.15
Nodes (4): ErrorBoundary, Props, s, State

### Community 95 - "GF2SearchAirports"
Cohesion: 0.27
Nodes (11): gf2MetroKey(), GF2SearchAirports(), limitGF2SearchAirports(), ResolveGF2PlaceCode(), containsAll(), TestGF2SearchAirports_CityOnlyCode(), TestGF2SearchAirports_LondonParis(), TestGF2SearchAirports_SingleAirport() (+3 more)

### Community 96 - "flyfix.ts"
Cohesion: 0.29
Nodes (7): apiPost(), FlyfixInsightsGroup, FlyfixIssue, FlyfixRefinedReport, FlyfixSummary, refineIssues(), RefineIssuesRequestBody

### Community 97 - "CompleteExtraLegs"
Cohesion: 0.47
Nodes (6): TestCompleteExtraLegs(), TestExtraLegsFingerprint(), CompleteExtraLegs(), ExtraLegsFingerprint(), NormalizeExtraLegs(), ExtraLeg

### Community 98 - "SortBar.tsx"
Cohesion: 0.40
Nodes (5): KEYS, s, SortBarProps, SortOption, SortField

### Community 101 - "ensure-flight-chrome.sh"
Cohesion: 0.70
Nodes (4): DISPLAY, ensure_gateway_proxy(), log(), ensure-flight-chrome.sh script

### Community 102 - "skyscanner.ts"
Cohesion: 0.36
Nodes (11): FlightLeg, BookingHop, bookingHopsFromOption(), firstSeg(), isClassicRoundTripLegs(), isoDatePrefix(), isSplitBookingItinerary(), lastSeg() (+3 more)

### Community 105 - "testing.T"
Cohesion: 0.06
Nodes (51): TestAllocateLegQuoteAmount_splitOpenJaw(), TestAttachQuotedPriceMeta_detectsMismatch(), TestLegDeepLink_rejectsMisalignedPartnerArrays(), TestLegDeepLink_rejectsWrongAirlineDirectCheckout(), TestQuoteBindingFromOption_usesOriginalWhenEstimate(), TestQuoteBindingFromOption_usesStoredLegPrice(), TestResolveGF2PartnerOffer_skipsSkyscannerDeepLink(), TestResolveGF2PartnerOffer_usesPersistedLegDeepLinkWithoutProvider() (+43 more)

## Knowledge Gaps
- **3 isolated node(s):** `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 575 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Multi-provider flight search` connect `Features` to `budget_config.go`?**
  _High betweenness centrality (0.324) - this node is a cross-community bridge._
- **What connects `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `SearchFormScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1076923076923077 - nodes in this community are weakly interconnected._
- **Why does `Recent enhancements` connect `Features` to `MonthDealsScreen.tsx`, `AppIcon`?**
  _High betweenness centrality (0.316) - this node is a cross-community bridge._
- **Should `Issue` be split into smaller, more focused modules?**
  _Cohesion score 0.09716599190283401 - nodes in this community are weakly interconnected._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.059233449477351915 - nodes in this community are weakly interconnected._
- **Should `useTheme` be split into smaller, more focused modules?**
  _Cohesion score 0.11842105263157894 - nodes in this community are weakly interconnected._