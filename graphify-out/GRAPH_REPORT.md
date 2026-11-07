# Graph Report - workspace  (2026-11-07)

## Corpus Check
- 278 files · ~235,649 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: (none) 8, .example 2, .mdc 1)

## Summary
- 2373 nodes · 7381 edges · 109 communities (90 shown, 19 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 602 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ca02e332`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- .ResolveQuotedPartnerBooking
- App.tsx
- ResultsScreen.tsx
- Issue
- SearchLoadingOverlay.tsx
- DedupeProviderResults
- frontend/package.json
- useTheme
- Features
- main
- flight-scraper/package.json
- sharedLinkCache.ts
- BookingOptionsFooter.tsx
- compilerOptions
- runBookingMatch
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
- booking_gf2_resolve.go
- expo
- config_loader.py
- LandingScreen.tsx
- CanonicalItinerary
- net/http.Request
- itinerary.go
- budget_config_test.go
- explore_cache.go
- ValidationIssue
- Backend QA Automation Tool
- test-local-time.js
- affiliate.go
- search.ts
- skyscanner.ts
- models.py
- ExploreScreen.tsx
- Fly-Fix – Frontend
- destinationMood.test.ts
- auth.go
- test_cases
- FlightDetailsModal.tsx
- gen_explore_airport_coords.py
- flightcaptainweb
- session_store.go
- Nginx Proxy Manager — fly-fix TLS checklist
- FiltersPanel.tsx
- FlightResultCard.tsx
- .finalize
- AppIcon
- steps
- flyfix-api
- SearchRequest
- DateRangePicker.tsx
- flightTimeDisplay.ts
- ErrorBoundary
- npm
- skyscanner.js
- kiwi.js
- AirportLocation
- nginx-proxy-manager (VPS edge)
- AuthContext.tsx
- Registry
- providers.go
- warm.js
- time.Time
- Fly-Fix
- dealsCache.ts
- affiliate.ts
- CombineOneWayBatches
- itinerary_test.go
- .Search
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
- NewRegistryFromEnv
- warm.js
- ExploreBudgetLimits
- devDependencies
- server_carrier_test.go
- itineraryStops.ts
- DatePickerCalendar.tsx
- CompleteExtraLegs
- scripts
- ensure-flight-chrome.sh
- metro.config.js
- docker-entrypoint.sh
- Backend
- Flight scraper (multisite)
- go_pkg_net_http
- DraggableBottomSheet.tsx

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 100 edges
2. `useLocale()` - 88 edges
3. `react` - 69 edges
4. `react-native` - 62 edges
5. `ResultsScreen()` - 57 edges
6. `ProviderResult` - 55 edges
7. `AppIcon()` - 52 edges
8. `MonthDealsScreen()` - 48 edges
9. `BookingOffer` - 40 edges
10. `SearchRequest` - 36 edges

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

## Communities (109 total, 19 thin omitted)

### Community 0 - ".ResolveQuotedPartnerBooking"
Cohesion: 0.17
Nodes (17): findBookingOptionsArray(), firstPartnerBookingOption(), firstPartnerURLInMap(), firstStringByKeys(), ResolvedPartnerBooking, isPartnerBookingList(), parseGF2BookingOptions(), partnerRequestTokenFromMap() (+9 more)

### Community 1 - "App.tsx"
Cohesion: 0.14
Nodes (19): App(), linking, RTLWrapper(), DynamicDestinationsStack(), Stack, MonthDealsStack(), Stack, RootNavigator() (+11 more)

### Community 2 - "ResultsScreen.tsx"
Cohesion: 0.07
Nodes (56): createSearchSessionWithRetry(), collectTripDestinationCodes(), DestinationMoodStrip(), SearchLoadingOverlay(), DynamicDestinationsFormContent(), defaultParams, DynamicDestinationsScreen(), Nav (+48 more)

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "SearchLoadingOverlay.tsx"
Cohesion: 0.24
Nodes (8): SEARCH_BUTTON_PHRASES, SEARCH_PROGRESS_PHRASES, s, SearchProgressBannerProps, ExtraLeg, Props, s, Theme

### Community 5 - "DedupeProviderResults"
Cohesion: 0.33
Nodes (6): DedupeProviderResults(), ItineraryFingerprint(), mergeSelfTransfer(), uniqueStrings(), TestDedupeKeepsCheaper(), TestItineraryFingerprintStable()

### Community 6 - "frontend/package.json"
Cohesion: 0.10
Nodes (24): dependencies, @expo/metro-runtime@~4.0.1, expo-status-bar@~2.0.0, react@18.3.1, react-dom@18.3.1, react-native@0.76.3, react-native-safe-area-context@4.12.0, react-native-screens@~4.4.0 (+16 more)

### Community 7 - "useTheme"
Cohesion: 0.07
Nodes (74): ClearableTextInput(), ClearableTextInputProps, styles, EditSearchModalProps, s, HubRouteLeg, HubRouteSummaryModalProps, s (+66 more)

### Community 8 - "Features"
Cohesion: 0.14
Nodes (14): AdSense & consent (CMP), Booking Redirect, Cheaper departure cities (positioning optimizer), Explore (Anywhere), Favicon & SEO, Features, Filters & Sorting, Flight Details Modal (+6 more)

### Community 9 - "main"
Cohesion: 0.17
Nodes (11): exploreSessionKey(), getExploreSession(), newExploreSessionID(), putExploreSession(), startExploreSessionCleanup(), exploreSession, corsMiddleware(), fetchExchangeRates() (+3 more)

### Community 10 - "flight-scraper/package.json"
Cohesion: 0.11
Nodes (17): express, playwright, dependencies, express@^4.21.2, playwright@^1.49.1, description, engines, node (+9 more)

### Community 11 - "sharedLinkCache.ts"
Cohesion: 0.17
Nodes (19): SearchUrlState, isDeepLinkDebugEnabled(), logDeepLinkDiagnostics(), mergeDeepLinkParams(), fromStash, fromUrl, kept, recovery (+11 more)

### Community 12 - "BookingOptionsFooter.tsx"
Cohesion: 0.15
Nodes (30): BookingResolveResponse, isSafeBookingUrl(), PublicBookingOffer, bookingOfferProviderLabel(), bookingOfferSubtitle(), formatBookingOfferPriceAmount(), formatBookingOfferPriceLine(), formatProviderDisplayName() (+22 more)

### Community 13 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 14 - "runBookingMatch"
Cohesion: 0.07
Nodes (53): acquireBookingResolveSlot(), beginInflightResolve(), bookingResolveCacheKey(), bookingResolveFailureResponse(), bookingResolveMaxConcurrentFromEnv(), cacheTTLForStatus(), canonicalItineraryForOption(), envDurationMinutes() (+45 more)

### Community 15 - "canonical_booking_test.go"
Cohesion: 0.13
Nodes (31): openJawOption(), TestBookingLinkModeDefaultsToGoogle(), TestBookingRouteFromSessionOption_splitOmitsReturn(), TestBuildGoogleFlightsFallbackFromParams(), TestBuildLegOrSegmentBookingURL_segment(), TestBuildOneWayLegBookingURL(), TestBuildSkyscannerPrefillURL_oneWay(), TestBuildSkyscannerPrefillURL_roundTrip() (+23 more)

### Community 16 - "MonthDealsScreen.tsx"
Cohesion: 0.04
Nodes (67): searchAirports(), API_BASE, apiGet(), isLocalHostname(), resolveApiBase(), GetDealsRangeParams, getMonthDeals(), GetMonthDealsParams (+59 more)

### Community 17 - "googleflights2_provider.go"
Cohesion: 0.12
Nodes (41): TestParseGF2TimeWithDateHint_AirportLocal(), TestExtractGF2BookingToken(), TestExtractGF2BookingURL(), TestExtractGF2PartnerBookingTokenPrefersPartnerURL(), TestBuildGF2ResultFromItinerary_FlatFormat(), TestParseGF2Response_AttachesFlatReturnFlights(), TestParseGF2Response_RapidAPIFlatTopFlights(), TestExtractGF2Leg_TimeOnly_NoDateHint() (+33 more)

### Community 18 - "server.go"
Cohesion: 0.06
Nodes (63): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, CanonicalFingerprint(), Carrier, TestProviderResultsToFlightOptions_PreservesCarrierName(), CarrierCodes (+55 more)

### Community 19 - "booking_resolve_test.go"
Cohesion: 0.22
Nodes (10): exploreLiveCandidate, gf2ExploreResolveDeps(), outboundDatesForMonthBookable(), TestSanitizeProviderErrorForUser(), detectSelfTransfer(), TestDetectSelfTransfer(), SanitizeProviderErrorForUser(), otaScraperSearchRequest (+2 more)

### Community 22 - "testing.T"
Cohesion: 0.05
Nodes (92): gf2CheckoutOffers(), classifyURLType(), domainFromURL(), extractPrice(), cfgTest(), floatPtr(), TestClassifyURLType_genericVsExact(), testConnectingTLVJFK() (+84 more)

### Community 23 - "TestResult"
Cohesion: 0.19
Nodes (3): ResponseAnalyzer, main(), _print_unreachable_backend_hint()

### Community 25 - "runtime_config.go"
Cohesion: 0.19
Nodes (18): adminAccessConfigured(), isAdminRequest(), configRangeError, adminTokenConfigured(), adminTokenFromHeader(), defaultRuntimeConfig(), errConfigOutOfRange(), getRuntimeConfig() (+10 more)

### Community 26 - "booking_gf2_resolve.go"
Cohesion: 0.07
Nodes (74): airlineDomainForCarrier(), allocateLegQuoteAmount(), applySearchQuoteToOffer(), attachQuotedPriceMeta(), bookingMatchPriceNormalizer(), dedupeGF2PartnerOffers(), flightLegDurationMinutes(), gf2OffersHavePrice() (+66 more)

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.30
Nodes (10): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+2 more)

### Community 29 - "LandingScreen.tsx"
Cohesion: 0.11
Nodes (20): AIRPORT_DICTIONARY, ASSIGNED_URLS, BY_CODE, BY_COUNTRY, DestinationMood, FALLBACK_IMAGE, hashCode(), LANDING_MOOD_DESTINATIONS (+12 more)

### Community 30 - "CanonicalItinerary"
Cohesion: 0.15
Nodes (19): corpusText(), MatchItinerary(), NewResolver(), collectSerpAPIResultMaps(), DefaultConfig(), envInt(), NewPageFetcher(), NewSerpAPISearcher() (+11 more)

### Community 31 - "net/http.Request"
Cohesion: 0.25
Nodes (20): GetSessionAndOption(), RecordClick(), ResolveProvider(), handleAuthLogout(), handleAdminVerify(), handleGetRuntimeConfig(), handleFlyFixRefineIssues(), handleAffiliateClicksSummary() (+12 more)

### Community 32 - "itinerary.go"
Cohesion: 0.10
Nodes (46): extractFlightNumbers(), flightNumberInText(), flightNumbersEquivalent(), splitFlightDesignator(), textContainsAirport(), textContainsAny(), timeMatches(), connectingFlightQueries() (+38 more)

### Community 33 - "budget_config_test.go"
Cohesion: 0.24
Nodes (12): TestGF2SearchAirports_budgetCapsMetro(), gf2MetroKey(), GF2SearchAirports(), limitGF2SearchAirports(), ResolveGF2PlaceCode(), containsAll(), TestGF2SearchAirports_CityOnlyCode(), TestGF2SearchAirports_LondonParis() (+4 more)

### Community 34 - "explore_cache.go"
Cohesion: 0.10
Nodes (20): airportCoord, exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut(), getAirportCoord() (+12 more)

### Community 36 - "Backend QA Automation Tool"
Cohesion: 0.18
Nodes (10): Backend QA Automation Tool, Features, If the run feels slow or “stuck”, Notes, Optional AI Setup (Ollama), Output, Project Structure, Run (+2 more)

### Community 37 - "test-local-time.js"
Cohesion: 0.19
Nodes (10): a, arr, assert, b, dep, late, AIRPORT_TZ, localHmToIso() (+2 more)

### Community 38 - "affiliate.go"
Cohesion: 0.18
Nodes (13): BuildLegAirlineDirectURL(), BuildRedirectURL(), getAffiliateID(), GetClicksSummary(), getOTAProvider(), ParseOptionIndex(), stripEmptyQueryParams(), ClickRecord (+5 more)

### Community 39 - "search.ts"
Cohesion: 0.10
Nodes (30): apiPost(), FlyfixInsightsGroup, FlyfixIssue, FlyfixRefinedReport, FlyfixSummary, refineIssues(), RefineIssuesRequestBody, CachedResult (+22 more)

### Community 40 - "skyscanner.ts"
Cohesion: 0.42
Nodes (10): BookingHop, bookingHopsFromOption(), firstSeg(), isClassicRoundTripLegs(), isoDatePrefix(), isSplitBookingItinerary(), lastSeg(), legNeedsSegmentSplit() (+2 more)

### Community 42 - "ExploreScreen.tsx"
Cohesion: 0.10
Nodes (55): AIRPORT_ONLY_DICTIONARY, FULL_PLACE_DICTIONARY, getAirportDisplayName(), getAirportEntry(), getAirportNameByCode(), getCityDisplayName(), lower(), matchesQuery() (+47 more)

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "destinationMood.test.ts"
Cohesion: 0.12
Nodes (11): __dirname, dist, indexHtml, indexPath, SPA_ROUTES, byCity, curatedCities, curatedUrls (+3 more)

### Community 45 - "auth.go"
Cohesion: 0.16
Nodes (28): authUserJSON(), bearerTokenFromRequest(), bootstrapAdminUser(), createAuthSession(), envFlagTrue(), handleAuthChangePassword(), handleAuthLogin(), handleAuthMe() (+20 more)

### Community 46 - "test_cases"
Cohesion: 0.05
Nodes (40): departureDate, origin, byProvider, currency, error, from, items, route (+32 more)

### Community 47 - "FlightDetailsModal.tsx"
Cohesion: 0.18
Nodes (20): AIRLINE_NAMES, getAirlineName(), resolveAirlineLabel(), AIRLINE_FULL_NAMES, cabinLabel(), FlightDetailsModal(), FlightDetailsModalProps, formatDuration() (+12 more)

### Community 53 - "session_store.go"
Cohesion: 0.18
Nodes (20): loadSearchSession(), TestLoadSearchSession_Expiry(), searchSessionTTL(), startSearchSessionCleanup(), cleanupPersistedSessions(), importLegacyJSONSessions(), initSessionStore(), loadPersistedSession() (+12 more)

### Community 54 - "Nginx Proxy Manager — fly-fix TLS checklist"
Cohesion: 0.40
Nodes (4): Nginx Proxy Manager — fly-fix TLS checklist, Reissue frontend cert (both names), Required proxy-host settings, Symptoms Chrome shows

### Community 55 - "FiltersPanel.tsx"
Cohesion: 0.15
Nodes (18): f, FiltersPanel(), FiltersPanelProps, KEYS, s, SortBarProps, SortOption, defaultFilters (+10 more)

### Community 56 - "FlightResultCard.tsx"
Cohesion: 0.13
Nodes (25): DisplayPrice(), DisplayPriceProps, buildRoutePath(), c, FlightResultCard(), LegScheduleBlock(), useExchangeRates(), FlightSegment (+17 more)

### Community 58 - "AppIcon"
Cohesion: 0.09
Nodes (39): AppIcon(), AppIconLibrary, AppIconProps, styles, DestinationMoodBanner(), stripStyles, styles, Variant (+31 more)

### Community 59 - "steps"
Cohesion: 0.09
Nodes (22): runs-on, steps, jobs, deploy, name, on, push, workflow_dispatch (+14 more)

### Community 60 - "flyfix-api"
Cohesion: 0.06
Nodes (35): context, FLIGHT_SCRAPER_URL, PLAYWRIGHT_HEADLESS, PORT, SCRAPER_CDP_URLS, SCRAPER_PROXY_URL, build, container_name (+27 more)

### Community 61 - "SearchRequest"
Cohesion: 0.10
Nodes (24): TestHasExtraLegs(), cheapestReturnLeg(), providerResultArrivalAirport(), isTransientGF2SearchErr(), legSearchRetryable(), parseKiwiApifyItems(), parseKiwiOffers(), truncateStr() (+16 more)

### Community 62 - "DateRangePicker.tsx"
Cohesion: 0.22
Nodes (16): useRuntimeConfig(), buildMonthDays(), DateRangePicker(), DateRangePickerProps, getMonthStart(), monthStartForYmd(), parseYmdUtc(), styles (+8 more)

### Community 63 - "flightTimeDisplay.ts"
Cohesion: 0.24
Nodes (12): airportTimeZones, getAirportTimeZone(), fmtDur(), layoverBetween(), legDuration(), renderLeg(), flightMinutesBetween(), flightTimeToMs() (+4 more)

### Community 64 - "ErrorBoundary"
Cohesion: 0.15
Nodes (4): ErrorBoundary, Props, s, State

### Community 65 - "npm"
Cohesion: 0.17
Nodes (11): networks, proxy, container_name, image, networks, ports, restart, volumes (+3 more)

### Community 66 - "skyscanner.js"
Cohesion: 0.19
Nodes (19): com, fr, req, pageLooksBlocked(), parseDepArrHm(), skyscannerDate(), ensureDatedResultsUrl(), extractSkyscanner() (+11 more)

### Community 67 - "kiwi.js"
Cohesion: 0.16
Nodes (23): offerTemplate(), segment(), clearKiwiSpaState(), ensureKiwiResultsUrl(), extractFromCaptured(), extractNextData(), flattenOffers(), kiwiPathLooksCorrect() (+15 more)

### Community 68 - "AirportLocation"
Cohesion: 0.12
Nodes (18): AirportLocation(), TestAirportLocation_UnknownFallsBackUTC(), TestParseGF2TimeWithDateHint_TelAviv(), TestParseGF2TimeWithDateHint_ZSuffixWallClock(), TestParseGF2Time_EuropeanDateFormat(), TestExtractGF2Leg_SingleSegment_DepartArriveDiffer(), TestExtractGF2Leg_TimeOnly_WithDateHint(), TestParseGF2Time_AcceptsFullDateTime() (+10 more)

### Community 69 - "nginx-proxy-manager (VPS edge)"
Cohesion: 0.40
Nodes (4): Deploy sync, First-time / recovery, nginx-proxy-manager (VPS edge), On the server

### Community 71 - "AuthContext.tsx"
Cohesion: 0.09
Nodes (38): authHeaders(), AuthUser, changePassword(), createUser(), deleteUser(), fetchAuthMe(), fetchUsers(), LoginResponse (+30 more)

### Community 72 - "Registry"
Cohesion: 0.15
Nodes (10): TestRegistryFailureMessage_transientOutbound(), TestRegistrySearchAll_openJawGF2FailNotMaskedByKiwiSkip(), TestRegistrySearchAllPartialFailure(), ProviderSearchStats, isPrimaryProvider(), isSkippedProviderErr(), IsTransientSearchErrMsg(), MultiSearchResult (+2 more)

### Community 73 - "providers.go"
Cohesion: 0.26
Nodes (13): asArray(), collectCarriers(), extractKiwiLegs(), firstFloat(), firstString(), kiwiSegmentFromMap(), mapsToSegments(), normalizeKiwiItem() (+5 more)

### Community 74 - "warm.js"
Cohesion: 0.16
Nodes (17): cdpLockBusy(), chain, withCdpLock(), isSearchBusy(), { chromium }, connectCdp(), GOTO_TIMEOUT_MS, gotoSoft() (+9 more)

### Community 75 - "time.Time"
Cohesion: 0.14
Nodes (17): elapsedMs(), minutesOfDay(), FullRoundTrip, attachReturnLegKeepPrice(), ensureRoundTripLegs(), gf2ExploreSearchOneDestination(), gf2OneRoundTrip(), gf2SearchDealsOnDates() (+9 more)

### Community 76 - "Fly-Fix"
Cohesion: 0.14
Nodes (13): Environment, Flows, Fly-Fix, Frontend, Graphify (codebase knowledge graph), Install and run, Notes, Overview (+5 more)

### Community 77 - "dealsCache.ts"
Cohesion: 0.30
Nodes (13): CachedDealsResults, clearPendingDealsParams(), DealsParams, dealsParamsFingerprint(), getCachedDealsResults(), getLocalStorage(), getPendingDealsParams(), getSessionStorage() (+5 more)

### Community 78 - "affiliate.ts"
Cohesion: 0.16
Nodes (17): AffiliateProvider, AffiliateProviderResponse, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink(), OutboundLinkResponse (+9 more)

### Community 79 - "CombineOneWayBatches"
Cohesion: 0.18
Nodes (13): TestCombineOneWayBatches(), TestCombineOneWayBatches_emptyBatch(), TestCombineOneWayBatches_openJawReturnDiversity(), TestAttachCanonicalIdentityAll_combineOneWay(), cloneLegs(), CombineOneWayBatches(), extraLegMaxPerBatch(), finalizeCombinedBatches() (+5 more)

### Community 80 - "itinerary_test.go"
Cohesion: 0.19
Nodes (16): AttachCanonicalIdentity(), segTLVJFK(), TestCanonicalItineraryFingerprint_connectingFlight(), TestCanonicalItineraryFingerprint_differentFlightsDoNotCollide(), TestCanonicalItineraryFingerprint_directFlight(), TestCanonicalItineraryFingerprint_excludesPrice(), TestCanonicalItineraryFingerprint_formattingStable(), TestCanonicalItineraryFingerprint_gf2AirlineNameStable() (+8 more)

### Community 81 - ".Search"
Cohesion: 0.27
Nodes (8): classicRoundTripMissingReturn(), TestDoSearchWithRetry_doesNotCacheRoundTrip(), TestSearch_ignoresIncompleteClassicRTCache(), TestSearch_servesCompleteClassicRTCache(), newGF2Cache(), TestSearchLegCached_usesCache(), gf2Cache, gf2CacheEntry

### Community 82 - "session.js"
Cohesion: 0.26
Nodes (11): browserPromises, { chromium, firefox }, getBrowser(), isTransientScrapeError(), pruneJunkPages(), runWithRetries(), warmHomepage(), withPage() (+3 more)

### Community 83 - "Fly-Fix UI / UX"
Cohesion: 0.15
Nodes (12): Avoid (AI-vibe tells), Checklist before shipping UI, Design north star, Fly-Fix UI / UX, Landing, Motion, Prefer, Responsive (+4 more)

### Community 84 - "TestApplySoftStrictBaggage"
Cohesion: 0.52
Nodes (6): applySoftStrictBaggage(), makeOfferWithBags(), makeOfferWithMissingBags(), TestApplySoftStrictBaggage(), TestClassifyOfferBaggage(), classifyOfferBaggage()

### Community 85 - "backend_api_contracts.md"
Cohesion: 0.17
Nodes (11): 1.1 Create Search Session, 1.2 Get Search Session Status & Results, 1.3 Cancel Search Session (Optional, MVP+), 1. Flight Search Sessions, 2.1 Get Monthly Deals, 2. Monthly Deals API, 3.1 Search Airports & Cities, 3. Airport & City Autocomplete (+3 more)

### Community 87 - "budget_config.go"
Cohesion: 0.23
Nodes (15): budgetCfg(), BudgetModeEnabled(), durationFromEnvMin(), FilterProviderNamesForBudget(), GF2EffectiveCacheTTL(), GF2EffectiveRateLimitPerMin(), GF2MetroConcurrency(), GF2MetroMaxAirports() (+7 more)

### Community 88 - "expedia.js"
Cohesion: 0.21
Nodes (6): DEFAULT_SITES, expediaUrl(), scrapeExpedia(), attachJsonCapture(), gotoAndSettle(), mergeConfig()

### Community 89 - "LocaleContext.tsx"
Cohesion: 0.19
Nodes (16): getStorage(), languageToLocale(), loadSaved(), LocaleContext, LocaleContextValue, LocaleProvider(), save(), VALID_CURRENCIES (+8 more)

### Community 92 - "NewRegistryFromEnv"
Cohesion: 0.18
Nodes (9): envTruthy(), newGF2RateLimiter(), NewGoogleFlights2Provider(), NewOtaScraperProvider(), parseOtaScraperSites(), NewRegistryFromEnv(), parseProviderNames(), Multi-provider flight search (+1 more)

### Community 93 - "warm.js"
Cohesion: 0.24
Nodes (7): scrapeAll(), SITE_FNS, beginSearch(), endSearch(), app, express, warmStatus()

### Community 94 - "ExploreBudgetLimits"
Cohesion: 0.33
Nodes (7): init(), ExploreBudgetLimits(), resetBudgetEnv(), TestExploreBudgetLimits_budget(), TestExploreBudgetLimits_defaultsWithoutBudget(), TestFilterProviderNamesForBudget_disablesKiwi(), ExploreLimits

### Community 95 - "devDependencies"
Cohesion: 0.29
Nodes (7): devDependencies, @babel/core@^7.25.0, @types/react@~18.3.12, typescript@~5.3.0, @babel/core, @types/react, typescript

### Community 96 - "server_carrier_test.go"
Cohesion: 0.83
Nodes (3): makeOfferWithCarriers(), TestExtractCarrierCodes(), TestPrimaryDisplayCarrier()

### Community 97 - "itineraryStops.ts"
Cohesion: 0.48
Nodes (5): countByStopsFilter(), matchesStopsFilter(), maxStopsPerLeg(), stopsPerLeg(), totalStops()

### Community 98 - "DatePickerCalendar.tsx"
Cohesion: 0.39
Nodes (7): getDealsRange(), DatePickerCalendar(), DatePickerCalendarProps, getNext14Dates(), getRangeStartEnd(), styles, WEEKDAYS

### Community 99 - "CompleteExtraLegs"
Cohesion: 0.47
Nodes (6): TestCompleteExtraLegs(), TestExtraLegsFingerprint(), CompleteExtraLegs(), ExtraLegsFingerprint(), NormalizeExtraLegs(), ExtraLeg

### Community 100 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, android, build, ios, start, web

### Community 101 - "ensure-flight-chrome.sh"
Cohesion: 0.70
Nodes (4): DISPLAY, ensure_gateway_proxy(), log(), ensure-flight-chrome.sh script

### Community 102 - "metro.config.js"
Cohesion: 0.40
Nodes (4): config, { getDefaultConfig }, expo@~52.0.0, expo

### Community 104 - "Backend"
Cohesion: 0.40
Nodes (5): Affiliate setup (optional), Backend, Environment, Main endpoints, Run the HTTP API

### Community 105 - "Flight scraper (multisite)"
Cohesion: 0.40
Nodes (4): Docker, Flight scraper (multisite), Run locally, VPS (recommended): headed Chrome on `:99`

## Knowledge Gaps
- **3 isolated node(s):** `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 570 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Fly-Fix` connect `Fly-Fix` to `Backend`, `Features`, `NewRegistryFromEnv`?**
  _High betweenness centrality (0.348) - this node is a cross-community bridge._
- **What connects `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13538461538461538 - nodes in this community are weakly interconnected._
- **Why does `Multi-provider flight search` connect `NewRegistryFromEnv` to `Fly-Fix`?**
  _High betweenness centrality (0.345) - this node is a cross-community bridge._
- **Should `ResultsScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07287093942054433 - nodes in this community are weakly interconnected._
- **Why does `Recent enhancements` connect `Fly-Fix` to `MonthDealsScreen.tsx`, `AppIcon`?**
  _High betweenness centrality (0.333) - this node is a cross-community bridge._
- **Should `Issue` be split into smaller, more focused modules?**
  _Cohesion score 0.10220673635307782 - nodes in this community are weakly interconnected._