# Graph Report - workspace  (2026-11-12)

## Corpus Check
- 293 files · ~245,785 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 16 file(s) not represented in the graph (top: (none) 8, .example 2, .conf 2)

## Summary
- 2445 nodes · 7678 edges · 99 communities (82 shown, 17 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 631 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `262ffd45`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- .ResolveQuotedPartnerBooking
- LandingScreen.tsx
- SearchLoadingOverlay.tsx
- Issue
- LocaleContext.tsx
- session_store.go
- frontend/package.json
- useTheme
- Features
- handleExplore
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
- auth.go
- searcher.go
- auth.go
- itinerary.go
- RuntimeConfigContext.tsx
- explore_cache.go
- ValidationIssue
- Backend QA Automation Tool
- test-roundtrip-legs.js
- DateRangePicker.tsx
- search.ts
- handleCreateSession
- models.py
- ExploreScreen.tsx
- Fly-Fix – Frontend
- DestinationMoodBanner.tsx
- booking_resolve.go
- test_cases
- FlightDetailsModal.tsx
- gen_explore_airport_coords.py
- flightcaptainweb
- SearchRequest
- Nginx Proxy Manager — fly-fix TLS checklist
- flyfix.ts
- FlightDetailsModal.tsx
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
- CalendarModal.tsx
- AuthContext.tsx
- .SearchAll
- normalizeKiwiItem
- scrape.js
- ProviderResult
- DatePickerCalendar.tsx
- server_carrier_test.go
- FiltersPanel.tsx
- Flight scraper (multisite)
- exchangeRates.ts
- session.js
- Fly-Fix UI / UX
- TestApplySoftStrictBaggage
- backend_api_contracts.md
- ensure-edge-proxy.sh
- expedia.js
- install-edge-proxy-cron.sh
- sync-edge-stack.sh
- time.Time
- ErrorBoundary
- budget_config.go
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
5. `ProviderResult` - 57 edges
6. `ResultsScreen()` - 57 edges
7. `AppIcon()` - 56 edges
8. `MonthDealsScreen()` - 48 edges
9. `BookingOffer` - 40 edges
10. `SearchRequest` - 37 edges

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

## Communities (99 total, 17 thin omitted)

### Community 0 - ".ResolveQuotedPartnerBooking"
Cohesion: 0.15
Nodes (19): resolveAllPartnerBookingsFromTokenWithRetry(), findBookingOptionsArray(), firstPartnerBookingOption(), firstPartnerURLInMap(), firstStringByKeys(), ResolvedPartnerBooking, isPartnerBookingList(), parseGF2BookingOptions() (+11 more)

### Community 1 - "LandingScreen.tsx"
Cohesion: 0.07
Nodes (42): Nav, SiteFooter(), styles, LandingScreen(), Nav, styles, ContactScreen(), LegalKind (+34 more)

### Community 2 - "SearchLoadingOverlay.tsx"
Cohesion: 0.15
Nodes (19): getAlmostDonePhrase(), getPhrasesForLanguage(), SEARCH_ALMOST_DONE, SEARCH_BUTTON_ALMOST_DONE, SEARCH_BUTTON_PHRASES, SEARCH_PROGRESS_PHRASES, s, SearchProgressBanner() (+11 more)

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "LocaleContext.tsx"
Cohesion: 0.23
Nodes (11): LocaleContext, LocaleContextValue, VALID_CURRENCIES, CURRENCIES, CurrencyCode, getTranslation(), LANGUAGES, TRANSLATIONS (+3 more)

### Community 5 - "session_store.go"
Cohesion: 0.13
Nodes (29): ProviderSearchStats, SearchProgress, SearchSession, SearchSessionResultsResponse, SearchSessionStatus, loadSearchSession(), markSessionFailed(), publishSearchProgress() (+21 more)

### Community 6 - "frontend/package.json"
Cohesion: 0.06
Nodes (40): config, { getDefaultConfig }, dependencies, expo@~52.0.0, @expo/metro-runtime@~4.0.1, expo-status-bar@~2.0.0, react@18.3.1, react-dom@18.3.1 (+32 more)

### Community 7 - "useTheme"
Cohesion: 0.07
Nodes (66): ClearableTextInput(), ClearableTextInputProps, styles, styles, EditSearchModal(), EditSearchModalProps, s, HubRouteLeg (+58 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (31): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+23 more)

### Community 9 - "handleExplore"
Cohesion: 0.16
Nodes (15): mergeExplorePriceRows(), exploreSessionKey(), getExploreSession(), newExploreSessionID(), putExploreSession(), startExploreSessionCleanup(), exploreDestRow, exploreSession (+7 more)

### Community 10 - "flight-scraper/package.json"
Cohesion: 0.11
Nodes (17): express, playwright, dependencies, express@^4.21.2, playwright@^1.49.1, description, engines, node (+9 more)

### Community 11 - "resolveGF2PartnerOffers"
Cohesion: 0.07
Nodes (71): airlineDomainForCarrier(), allocateLegQuoteAmount(), applySearchQuoteToOffer(), attachQuotedPriceMeta(), bookingMatchPriceNormalizer(), dedupeGF2PartnerOffers(), flightLegDurationMinutes(), gf2OffersHavePrice() (+63 more)

### Community 12 - "BookingOptionsFooter.tsx"
Cohesion: 0.15
Nodes (30): BookingResolveResponse, isSafeBookingUrl(), PublicBookingOffer, bookingOfferProviderLabel(), bookingOfferSubtitle(), formatBookingOfferPriceAmount(), formatBookingOfferPriceLine(), formatProviderDisplayName() (+22 more)

### Community 13 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 14 - "dealsCache.ts"
Cohesion: 0.25
Nodes (15): DealsState, MonthDealsResponse, CachedDealsResults, clearPendingDealsParams(), DealsParams, dealsParamsFingerprint(), getCachedDealsResults(), getLocalStorage() (+7 more)

### Community 15 - "canonical_booking_test.go"
Cohesion: 0.07
Nodes (50): BuildLegAirlineDirectURL(), BuildRedirectURL(), getAffiliateID(), GetClicksSummary(), getOTAProvider(), GetSessionAndOption(), ParseOptionIndex(), RecordClick() (+42 more)

### Community 16 - "MonthDealsScreen.tsx"
Cohesion: 0.07
Nodes (46): CheaperCitiesOption, CheaperCitiesSection(), Props, s, KEYS, s, SortBar(), SortBarProps (+38 more)

### Community 17 - "googleflights2_provider.go"
Cohesion: 0.10
Nodes (46): bookingResolveFailureResponse(), TestParseGF2TimeWithDateHint_AirportLocal(), TestExtractGF2BookingToken(), TestExtractGF2BookingURL(), TestExtractGF2PartnerBookingTokenPrefersPartnerURL(), TestBuildGF2ResultFromItinerary_FlatFormat(), TestParseGF2Response_AttachesFlatReturnFlights(), TestParseGF2Response_RapidAPIFlatTopFlights() (+38 more)

### Community 18 - "server.go"
Cohesion: 0.07
Nodes (58): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, CanonicalFingerprint(), Carrier, TestProviderResultsToFlightOptions_PreservesCarrierName(), DayDeal (+50 more)

### Community 19 - "booking_resolve_test.go"
Cohesion: 0.22
Nodes (6): exploreLiveCandidate, gf2ExploreResolveDeps(), outboundDatesForMonthBookable(), otaScraperSearchRequest, otaScraperSearchResponse, otaScraperSiteResult

### Community 22 - "testing.T"
Cohesion: 0.06
Nodes (73): classifyURLType(), extractPrice(), cfgTest(), floatPtr(), TestClassifyURLType_genericVsExact(), testConnectingTLVJFK(), TestExtractPrice_euroPrefixNotArrivalTime(), TestFlightNumbersEquivalent_leadingZeros() (+65 more)

### Community 23 - "TestResult"
Cohesion: 0.19
Nodes (3): ResponseAnalyzer, main(), _print_unreachable_backend_hint()

### Community 25 - "runtime_config.go"
Cohesion: 0.22
Nodes (16): adminAccessConfigured(), configRangeError, adminTokenConfigured(), defaultRuntimeConfig(), errConfigOutOfRange(), getRuntimeConfig(), handleAdminRuntimeConfig(), initRuntimeConfigStore() (+8 more)

### Community 26 - "api.ts"
Cohesion: 0.13
Nodes (15): CachedResult, SearchState, AirportCityType, AirportLike, BaggageClass, Carrier, COUNTRY_DEST_PREFIX, ExplorePriceSource (+7 more)

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.30
Nodes (10): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+2 more)

### Community 29 - "auth.go"
Cohesion: 0.17
Nodes (25): authUserJSON(), bootstrapAdminUser(), createAuthSession(), envFlagTrue(), handleAuthLogin(), handleAuthRegister(), handleAuthUsers(), initAuthStore() (+17 more)

### Community 30 - "searcher.go"
Cohesion: 0.10
Nodes (26): defaultBookingMatchRunner(), webVerifiedBookingOffers(), corpusText(), logMatchEvent(), MatchResult, countVerifiedPricedOffers(), MatchItinerary(), NewResolver() (+18 more)

### Community 31 - "auth.go"
Cohesion: 0.20
Nodes (25): bearerTokenFromRequest(), handleAuthChangePassword(), handleAuthLogout(), handleAuthMe(), isAdminRequest(), requireAdminUser(), userFromRequest(), adminTokenFromHeader() (+17 more)

### Community 32 - "itinerary.go"
Cohesion: 0.11
Nodes (41): extractFlightNumbers(), flightNumberInText(), flightNumbersEquivalent(), splitFlightDesignator(), textContainsAirport(), textContainsAny(), timeMatches(), connectingFlightQueries() (+33 more)

### Community 33 - "RuntimeConfigContext.tsx"
Cohesion: 0.17
Nodes (18): adminAuthHeaders(), fetchAdminRuntimeConfig(), fetchRuntimeConfig(), saveAdminRuntimeConfig(), setRuntimeConfigStore(), RuntimeConfigContext, RuntimeConfigContextValue, RuntimeConfigProvider() (+10 more)

### Community 34 - "explore_cache.go"
Cohesion: 0.12
Nodes (16): airportCoord, exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut(), getAirportCoord() (+8 more)

### Community 36 - "Backend QA Automation Tool"
Cohesion: 0.18
Nodes (10): Backend QA Automation Tool, Features, If the run feels slow or “stuck”, Notes, Optional AI Setup (Ollama), Output, Project Structure, Run (+2 more)

### Community 37 - "test-roundtrip-legs.js"
Cohesion: 0.13
Nodes (19): a, arr, assert, b, dep, late, assert, frSegs (+11 more)

### Community 38 - "DateRangePicker.tsx"
Cohesion: 0.20
Nodes (15): useRuntimeConfig(), buildMonthDays(), DateRangePickerProps, getMonthStart(), monthStartForYmd(), parseYmdUtc(), styles, WEEKDAYS (+7 more)

### Community 39 - "search.ts"
Cohesion: 0.15
Nodes (25): createSearchSession(), createSearchSessionWithRetry(), ensureLegacyPurge(), fetchFresh(), getFromStorage(), getSearchSessionResults(), getStorage(), invalidateSearchSessionResultsCache() (+17 more)

### Community 40 - "handleCreateSession"
Cohesion: 0.31
Nodes (5): CreateSearchSessionRequest, ExtraSearchLeg, finalizeSearchSession(), handleCreateSession(), randomID()

### Community 42 - "ExploreScreen.tsx"
Cohesion: 0.09
Nodes (56): getMonthDeals(), getExploreDestinations(), AIRPORT_ONLY_DICTIONARY, FULL_PLACE_DICTIONARY, getAirportDisplayName(), getAirportEntry(), getCityDisplayName(), lower() (+48 more)

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "DestinationMoodBanner.tsx"
Cohesion: 0.12
Nodes (11): __dirname, dist, indexHtml, indexPath, SPA_ROUTES, byCity, curatedCities, curatedUrls (+3 more)

### Community 45 - "booking_resolve.go"
Cohesion: 0.07
Nodes (53): acquireBookingResolveSlot(), beginInflightResolve(), bookingResolveCacheKey(), bookingResolveMaxConcurrentFromEnv(), cacheTTLForStatus(), canonicalItineraryForOption(), envDurationMinutes(), finishInflightResolve() (+45 more)

### Community 46 - "test_cases"
Cohesion: 0.05
Nodes (40): departureDate, origin, byProvider, currency, error, from, items, route (+32 more)

### Community 47 - "FlightDetailsModal.tsx"
Cohesion: 0.24
Nodes (12): airportTimeZones, getAirportTimeZone(), fmtDur(), layoverBetween(), legDuration(), renderLeg(), flightMinutesBetween(), flightTimeToMs() (+4 more)

### Community 53 - "SearchRequest"
Cohesion: 0.07
Nodes (39): TestCompleteExtraLegs(), TestExtraLegsFingerprint(), classicRoundTripMissingReturn(), TestClassicRoundTripMissingReturn(), TestDoSearchWithRetry_doesNotCacheRoundTrip(), TestSearch_ignoresIncompleteClassicRTCache(), TestSearch_servesCompleteClassicRTCache(), newGF2Cache() (+31 more)

### Community 54 - "Nginx Proxy Manager — fly-fix TLS checklist"
Cohesion: 0.40
Nodes (4): Nginx Proxy Manager — fly-fix TLS checklist, Reissue frontend cert (both names), Required proxy-host settings, Symptoms Chrome shows

### Community 55 - "flyfix.ts"
Cohesion: 0.29
Nodes (7): apiPost(), FlyfixInsightsGroup, FlyfixIssue, FlyfixRefinedReport, FlyfixSummary, refineIssues(), RefineIssuesRequestBody

### Community 56 - "FlightDetailsModal.tsx"
Cohesion: 0.17
Nodes (21): AIRLINE_NAMES, getAirlineName(), resolveAirlineLabel(), AIRLINE_FULL_NAMES, getAirportNameByCode(), cabinLabel(), FlightDetailsModal(), FlightDetailsModalProps (+13 more)

### Community 58 - "useLocale"
Cohesion: 0.09
Nodes (43): AppIcon(), AppIconLibrary, AppIconProps, styles, collectTripDestinationCodes(), DestinationMoodBanner(), DestinationMoodStrip(), moodSizeForVariant() (+35 more)

### Community 59 - "steps"
Cohesion: 0.09
Nodes (22): runs-on, steps, jobs, deploy, name, on, push, workflow_dispatch (+14 more)

### Community 60 - "flyfix-api"
Cohesion: 0.06
Nodes (37): context, FLIGHT_SCRAPER_MAX_CONCURRENT, FLIGHT_SCRAPER_URL, PLAYWRIGHT_HEADLESS, PORT, SCRAPER_CDP_URLS, SCRAPER_PROXY_URL, SCRAPER_WARM_ON_START (+29 more)

### Community 61 - "FlightResultCard.tsx"
Cohesion: 0.22
Nodes (16): buildRoutePath(), c, FlightResultCard(), LegScheduleBlock(), FlightSegment, LayoverSummary, OutboundSummary, buildLegPreviewSummary() (+8 more)

### Community 62 - "ResultsScreen.tsx"
Cohesion: 0.08
Nodes (49): DynamicDestinationsFormContentProps, defaultParams, DynamicDestinationsScreen(), Nav, styles, PassengerCabinPickerProps, SearchFormContentProps, bestScore() (+41 more)

### Community 63 - "affiliate.ts"
Cohesion: 0.27
Nodes (9): AffiliateProvider, AffiliateProviderResponse, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink(), OutboundLinkResponse (+1 more)

### Community 64 - "client.ts"
Cohesion: 0.14
Nodes (16): searchAirports(), apiGet(), apiRequest(), apiUrl(), isLocalHostname(), resolveApiBase(), GetDealsRangeParams, GetMonthDealsParams (+8 more)

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

### Community 70 - "CalendarModal.tsx"
Cohesion: 0.38
Nodes (6): buildMonthDays(), CalendarModal(), getMonthStart(), Props, styles, WEEKDAYS

### Community 71 - "AuthContext.tsx"
Cohesion: 0.06
Nodes (57): App(), linking, RTLWrapper(), authHeaders(), AuthUser, changePassword(), createUser(), deleteUser() (+49 more)

### Community 72 - ".SearchAll"
Cohesion: 0.16
Nodes (9): TestSanitizeProviderErrorForUser(), TestRegistryFailureMessage_transientOutbound(), TestRegistrySearchAll_openJawGF2FailNotMaskedByKiwiSkip(), TestRegistrySearchAllPartialFailure(), isSkippedProviderErr(), IsTransientSearchErrMsg(), SanitizeProviderErrorForUser(), MultiSearchResult (+1 more)

### Community 73 - "normalizeKiwiItem"
Cohesion: 0.18
Nodes (22): asArray(), collectCarriers(), detectSelfTransfer(), extractKiwiLegs(), firstFloat(), firstString(), kiwiSegmentFromMap(), mapsToSegments() (+14 more)

### Community 74 - "scrape.js"
Cohesion: 0.18
Nodes (11): runWithOpenPage(), hasCdp(), runOne(), scrapeAll(), SITE_FNS, beginSearch(), endSearch(), isSearchBusy() (+3 more)

### Community 75 - "ProviderResult"
Cohesion: 0.06
Nodes (39): DedupeProviderResults(), ItineraryFingerprint(), mergeSelfTransfer(), TotalStops(), uniqueStrings(), TestCombineOneWayBatches(), TestCombineOneWayBatches_emptyBatch(), TestCombineOneWayBatches_openJawReturnDiversity() (+31 more)

### Community 76 - "DatePickerCalendar.tsx"
Cohesion: 0.39
Nodes (7): getDealsRange(), DatePickerCalendar(), DatePickerCalendarProps, getNext14Dates(), getRangeStartEnd(), styles, WEEKDAYS

### Community 77 - "server_carrier_test.go"
Cohesion: 0.43
Nodes (6): CarrierCodes, makeOfferWithCarriers(), TestExtractCarrierCodes(), TestPrimaryDisplayCarrier(), ExtractCarrierCodes(), PrimaryDisplayCarrier()

### Community 78 - "FiltersPanel.tsx"
Cohesion: 0.24
Nodes (11): f, FiltersPanel(), FiltersPanelProps, SearchFilters, Chip(), distinctMarketingCarriers(), countByStopsFilter(), matchesStopsFilter() (+3 more)

### Community 79 - "Flight scraper (multisite)"
Cohesion: 0.40
Nodes (4): Docker, Flight scraper (multisite), Run locally, VPS (recommended): headed Chrome on `:99`

### Community 81 - "exchangeRates.ts"
Cohesion: 0.23
Nodes (11): DisplayPrice(), DisplayPriceProps, useExchangeRates(), convertPrice(), CURRENCY_SYMBOLS, CurrencyCode, ensureRates(), fetchRates() (+3 more)

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

### Community 88 - "expedia.js"
Cohesion: 0.19
Nodes (6): DEFAULT_SITES, expediaUrl(), scrapeExpedia(), attachJsonCapture(), gotoAndSettle(), mergeConfig()

### Community 92 - "time.Time"
Cohesion: 0.13
Nodes (20): elapsedMs(), minutesOfDay(), FullRoundTrip, attachReturnLegKeepPrice(), ensureRoundTripLegs(), gf2ExploreSearchOneDestination(), gf2OneRoundTrip(), gf2SearchDealsOnDates() (+12 more)

### Community 94 - "ErrorBoundary"
Cohesion: 0.15
Nodes (4): ErrorBoundary, Props, s, State

### Community 95 - "budget_config.go"
Cohesion: 0.08
Nodes (37): init(), budgetCfg(), BudgetModeEnabled(), durationFromEnvMin(), envTruthy(), ExploreBudgetLimits(), FilterProviderNamesForBudget(), GF2MetroConcurrency() (+29 more)

### Community 97 - "ValidateBookingURL"
Cohesion: 0.20
Nodes (12): gf2CheckoutOffers(), domainFromURL(), IsCheckoutBookingURL(), IsNonBookableDomain(), TestIsCheckoutBookingURL_rejectsFlightSearchPages(), TestIsNonBookableDomain_blocksFlightRadar(), TestValidateBookingURL_acceptsHTTPS(), TestValidateBookingURL_rejectsEmpty() (+4 more)

### Community 101 - "ensure-flight-chrome.sh"
Cohesion: 0.70
Nodes (4): DISPLAY, ensure_gateway_proxy(), log(), ensure-flight-chrome.sh script

### Community 102 - "skyscanner.ts"
Cohesion: 0.36
Nodes (11): FlightLeg, BookingHop, bookingHopsFromOption(), firstSeg(), isClassicRoundTripLegs(), isoDatePrefix(), isSplitBookingItinerary(), lastSeg() (+3 more)

### Community 105 - "itinerary_test.go"
Cohesion: 0.32
Nodes (11): AttachCanonicalIdentity(), segTLVJFK(), TestCanonicalItineraryFingerprint_connectingFlight(), TestCanonicalItineraryFingerprint_differentFlightsDoNotCollide(), TestCanonicalItineraryFingerprint_directFlight(), TestCanonicalItineraryFingerprint_formattingStable(), TestCanonicalItineraryFingerprint_gf2AirlineNameStable(), TestCanonicalItineraryFingerprint_missingOptionalFields() (+3 more)

## Knowledge Gaps
- **3 isolated node(s):** `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 583 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Fly-Fix` connect `Features` to `MonthDealsScreen.tsx`, `ProviderResult`?**
  _High betweenness centrality (0.366) - this node is a cross-community bridge._
- **What connects `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `LandingScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06753246753246753 - nodes in this community are weakly interconnected._
- **Why does `Multi-provider flight search` connect `ProviderResult` to `Features`, `budget_config.go`?**
  _High betweenness centrality (0.356) - this node is a cross-community bridge._
- **Should `Issue` be split into smaller, more focused modules?**
  _Cohesion score 0.10365853658536585 - nodes in this community are weakly interconnected._
- **Why does `Recent enhancements` connect `MonthDealsScreen.tsx` to `Features`, `useLocale`?**
  _High betweenness centrality (0.351) - this node is a cross-community bridge._
- **Should `session_store.go` be split into smaller, more focused modules?**
  _Cohesion score 0.13277310924369748 - nodes in this community are weakly interconnected._