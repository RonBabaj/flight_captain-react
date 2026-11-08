# Graph Report - workspace  (2026-11-08)

## Corpus Check
- 284 files · ~237,288 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: (none) 8, .example 2, .mdc 1)

## Summary
- 2362 nodes · 7351 edges · 102 communities (81 shown, 21 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 594 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `acfd7fad`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- .ResolveQuotedPartnerBooking
- App.tsx
- useSearchParams.ts
- Issue
- SearchLoadingOverlay.tsx
- .buildCacheKey
- frontend/package.json
- useTheme
- Features
- testing.T
- flight-scraper/package.json
- BookingOffer
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
- matcher_test.go
- TestResult
- ResponseValidator
- runtime_config.go
- booking_gf2_resolve.go
- expo
- config_loader.py
- FlightDetailsModal.tsx
- CanonicalItinerary
- auth.go
- itinerary.go
- explore_session_build.go
- explore_cache.go
- ValidationIssue
- Backend QA Automation Tool
- test-local-time.js
- affiliate.go
- search.ts
- GF2SearchAirports
- models.py
- ExploreScreen.tsx
- Fly-Fix – Frontend
- DestinationMoodBanner.tsx
- auth_test.go
- test_cases
- flightTimeDisplay.ts
- gen_explore_airport_coords.py
- flightcaptainweb
- session_store.go
- Nginx Proxy Manager — fly-fix TLS checklist
- api.ts
- FlightResultCard.tsx
- .finalize
- AppIcon
- steps
- flyfix-api
- .Search
- ResultsScreen.tsx
- AdminRuntimeConfigPanel.tsx
- npm
- skyscanner.js
- kiwi.js
- nginx-proxy-manager (VPS edge)
- SearchRequest
- AuthContext.tsx
- Registry
- providers.go
- warm.js
- ProviderResult
- booking.ts
- gf2ExploreResolveDeps
- affiliate.ts
- ValidateBookingURL
- TestSanitizeProviderErrorForUser
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
- scrape.js
- ErrorBoundary
- flyfix.ts
- api/index.ts
- dealsCache.ts
- ensure-flight-chrome.sh
- skyscanner.ts
- docker-entrypoint.sh
- handleCreateSession
- ota_scraper_provider.go

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 100 edges
2. `useLocale()` - 88 edges
3. `react` - 69 edges
4. `react-native` - 62 edges
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

## Communities (102 total, 21 thin omitted)

### Community 0 - ".ResolveQuotedPartnerBooking"
Cohesion: 0.12
Nodes (26): resolveAllPartnerBookingsFromTokenWithRetry(), findBookingOptionsArray(), firstPartnerBookingOption(), firstPartnerURLInMap(), firstStringByKeys(), ResolvedPartnerBooking, isPartnerBookingList(), parseGF2BookingOptions() (+18 more)

### Community 1 - "App.tsx"
Cohesion: 0.07
Nodes (37): App(), linking, RTLWrapper(), LandingScreen(), Nav, styles, Breakpoint, BREAKPOINTS (+29 more)

### Community 2 - "useSearchParams.ts"
Cohesion: 0.11
Nodes (33): buildSearchString(), getParam(), getParams(), isWeb(), parseSearchParamsFromUrl(), SearchUrlState, updateSearchUrl(), useSearchParams() (+25 more)

### Community 3 - "Issue"
Cohesion: 0.09
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "SearchLoadingOverlay.tsx"
Cohesion: 0.17
Nodes (13): getPhrasesForLanguage(), SEARCH_BUTTON_PHRASES, SEARCH_PROGRESS_PHRASES, s, SearchProgressBanner(), SearchProgressBannerProps, ExtraLeg, Props (+5 more)

### Community 5 - ".buildCacheKey"
Cohesion: 0.27
Nodes (8): classicRoundTripMissingReturn(), TestDoSearchWithRetry_doesNotCacheRoundTrip(), TestSearch_ignoresIncompleteClassicRTCache(), TestSearch_servesCompleteClassicRTCache(), newGF2Cache(), TestSearchLegCached_usesCache(), gf2Cache, gf2CacheEntry

### Community 6 - "frontend/package.json"
Cohesion: 0.06
Nodes (40): config, { getDefaultConfig }, dependencies, expo@~52.0.0, @expo/metro-runtime@~4.0.1, expo-status-bar@~2.0.0, react@18.3.1, react-dom@18.3.1 (+32 more)

### Community 7 - "useTheme"
Cohesion: 0.07
Nodes (65): ClearableTextInput(), ClearableTextInputProps, styles, styles, EditSearchModalProps, s, s, SearchSummaryBarProps (+57 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (33): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+25 more)

### Community 9 - "testing.T"
Cohesion: 0.04
Nodes (67): TestIsAffiliateTemplateBookingURL(), TestFlightNumbersEquivalent_leadingZeros(), TestProviderResultsToFlightOptions_PreservesCarrierName(), TestAttachReturnLegKeepPrice(), TestEnsureRoundTripLegs_noOpWhenTwoLegs(), AirportLocation(), TestAirportLocation_UnknownFallsBackUTC(), TestParseGF2TimeWithDateHint_TelAviv() (+59 more)

### Community 10 - "flight-scraper/package.json"
Cohesion: 0.11
Nodes (17): express, playwright, dependencies, express@^4.21.2, playwright@^1.49.1, description, engines, node (+9 more)

### Community 11 - "BookingOffer"
Cohesion: 0.14
Nodes (36): airlineDomainForCarrier(), bookingMatchPriceNormalizer(), isAffiliateTemplateBookingURL(), marketingCarrierForLegIndex(), normalizedGF2OfferPrice(), offersIncludeAirlineDirect(), preferAirlineDirectWhenCheaperThanMarkedUpOTA(), publicAlternativesFromOffers() (+28 more)

### Community 12 - "BookingOptionsFooter.tsx"
Cohesion: 0.17
Nodes (26): BookingResolveResponse, isSafeBookingUrl(), PublicBookingOffer, bookingOfferProviderLabel(), bookingOfferSubtitle(), formatBookingOfferPriceAmount(), formatBookingOfferPriceLine(), formatProviderDisplayName() (+18 more)

### Community 13 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 14 - "runBookingMatch"
Cohesion: 0.08
Nodes (40): acquireBookingResolveSlot(), beginInflightResolve(), bookingResolveCacheKey(), bookingResolveFailureResponse(), cacheTTLForStatus(), canonicalItineraryForOption(), finishInflightResolve(), getCachedBookingResolve() (+32 more)

### Community 15 - "canonical_booking_test.go"
Cohesion: 0.11
Nodes (30): openJawOption(), TestBookingLinkModeDefaultsToGoogle(), TestBookingRouteFromSessionOption_splitOmitsReturn(), TestBuildGoogleFlightsFallbackFromParams(), TestBuildLegOrSegmentBookingURL_segment(), TestBuildOneWayLegBookingURL(), TestBuildSkyscannerPrefillURL_oneWay(), TestBuildSkyscannerPrefillURL_roundTrip() (+22 more)

### Community 16 - "MonthDealsScreen.tsx"
Cohesion: 0.08
Nodes (43): getMonthDeals(), DisplayPrice(), DisplayPriceProps, HubRouteLeg, HubRouteSummaryModalProps, s, CheaperCitiesOption, CheaperCitiesSection() (+35 more)

### Community 17 - "googleflights2_provider.go"
Cohesion: 0.14
Nodes (37): TestParseGF2TimeWithDateHint_AirportLocal(), TestExtractGF2BookingToken(), TestExtractGF2BookingURL(), TestBuildGF2ResultFromItinerary_FlatFormat(), TestParseGF2Response_AttachesFlatReturnFlights(), TestParseGF2Response_RapidAPIFlatTopFlights(), TestExtractGF2Leg_TimeOnly_NoDateHint(), TestExtractGF2SegmentFromFlight_CodeOnlyHasNoName() (+29 more)

### Community 18 - "server.go"
Cohesion: 0.07
Nodes (60): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, CanonicalFingerprint(), normalizeProviderBookingURL(), Carrier, CarrierCodes (+52 more)

### Community 22 - "matcher_test.go"
Cohesion: 0.11
Nodes (43): classifyURLType(), extractPrice(), cfgTest(), floatPtr(), TestClassifyURLType_genericVsExact(), testConnectingTLVJFK(), TestExtractPrice_euroPrefixNotArrivalTime(), TestGenerateQueries_connecting() (+35 more)

### Community 23 - "TestResult"
Cohesion: 0.19
Nodes (3): ResponseAnalyzer, main(), _print_unreachable_backend_hint()

### Community 25 - "runtime_config.go"
Cohesion: 0.26
Nodes (13): configRangeError, defaultRuntimeConfig(), errConfigOutOfRange(), getRuntimeConfig(), initRuntimeConfigStore(), persistRuntimeConfigLocked(), setRuntimeConfig(), TestSetRuntimeConfigPersists() (+5 more)

### Community 26 - "booking_gf2_resolve.go"
Cohesion: 0.08
Nodes (37): allocateLegQuoteAmount(), applySearchQuoteToOffer(), attachQuotedPriceMeta(), dedupeGF2PartnerOffers(), flightLegDurationMinutes(), gf2OffersHavePrice(), gf2PartnerOfferFromQuoteURL(), gf2PartnerOfferFromResolved() (+29 more)

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.30
Nodes (10): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+2 more)

### Community 29 - "FlightDetailsModal.tsx"
Cohesion: 0.24
Nodes (15): AIRLINE_NAMES, getAirlineName(), resolveAirlineLabel(), AIRLINE_FULL_NAMES, cabinLabel(), FlightDetailsModal(), formatDuration(), legDuration() (+7 more)

### Community 30 - "CanonicalItinerary"
Cohesion: 0.12
Nodes (25): corpusText(), domainFromURL(), elapsedMs(), logMatchEvent(), countVerifiedPricedOffers(), MatchItinerary(), NewResolver(), truncateStr() (+17 more)

### Community 31 - "auth.go"
Cohesion: 0.14
Nodes (38): adminAccessConfigured(), authUserJSON(), bearerTokenFromRequest(), bootstrapAdminUser(), createAuthSession(), envFlagTrue(), handleAuthChangePassword(), handleAuthLogout() (+30 more)

### Community 32 - "itinerary.go"
Cohesion: 0.10
Nodes (46): extractFlightNumbers(), flightNumberInText(), flightNumbersEquivalent(), splitFlightDesignator(), textContainsAirport(), textContainsAny(), timeMatches(), connectingFlightQueries() (+38 more)

### Community 34 - "explore_cache.go"
Cohesion: 0.12
Nodes (16): airportCoord, exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut(), getAirportCoord() (+8 more)

### Community 36 - "Backend QA Automation Tool"
Cohesion: 0.18
Nodes (10): Backend QA Automation Tool, Features, If the run feels slow or “stuck”, Notes, Optional AI Setup (Ollama), Output, Project Structure, Run (+2 more)

### Community 37 - "test-local-time.js"
Cohesion: 0.19
Nodes (10): a, arr, assert, b, dep, late, AIRPORT_TZ, localHmToIso() (+2 more)

### Community 38 - "affiliate.go"
Cohesion: 0.16
Nodes (16): BuildLegAirlineDirectURL(), BuildRedirectURL(), getAffiliateID(), GetClicksSummary(), getOTAProvider(), GetSessionAndOption(), ParseOptionIndex(), RecordClick() (+8 more)

### Community 39 - "search.ts"
Cohesion: 0.15
Nodes (22): CachedResult, createSearchSession(), ensureLegacyPurge(), fetchFresh(), getFromStorage(), getSearchSessionResults(), getStorage(), invalidateSearchSessionResultsCache() (+14 more)

### Community 40 - "GF2SearchAirports"
Cohesion: 0.20
Nodes (11): gf2MetroKey(), GF2SearchAirports(), limitGF2SearchAirports(), ResolveGF2PlaceCode(), containsAll(), TestGF2SearchAirports_CityOnlyCode(), TestGF2SearchAirports_LondonParis(), TestGF2SearchAirports_SingleAirport() (+3 more)

### Community 42 - "ExploreScreen.tsx"
Cohesion: 0.08
Nodes (61): ExploreResponse, getExploreDestinations(), GetExploreDestinationsParams, AIRPORT_ONLY_DICTIONARY, FULL_PLACE_DICTIONARY, getAirportDisplayName(), getAirportEntry(), getAirportNameByCode() (+53 more)

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "DestinationMoodBanner.tsx"
Cohesion: 0.07
Nodes (25): __dirname, dist, indexHtml, indexPath, SPA_ROUTES, stripStyles, styles, Variant (+17 more)

### Community 45 - "auth_test.go"
Cohesion: 0.20
Nodes (15): handleAuthLogin(), initAuthStore(), initTestAuthDB(), randomTestPassword(), TestAuthLoginAndChangePassword(), TestAuthRegister(), TestAuthUserManagement(), TestBootstrapAdminPasswordSync() (+7 more)

### Community 46 - "test_cases"
Cohesion: 0.05
Nodes (40): departureDate, origin, byProvider, currency, error, from, items, route (+32 more)

### Community 47 - "flightTimeDisplay.ts"
Cohesion: 0.22
Nodes (13): airportTimeZones, getAirportTimeZone(), layoverBetween(), fmtDur(), layoverBetween(), legDuration(), renderLeg(), flightMinutesBetween() (+5 more)

### Community 53 - "session_store.go"
Cohesion: 0.12
Nodes (30): startExploreSessionCleanup(), ProviderSearchStats, SearchSession, SearchSessionResultsResponse, SearchSessionStatus, corsMiddleware(), loadSearchSession(), main() (+22 more)

### Community 54 - "Nginx Proxy Manager — fly-fix TLS checklist"
Cohesion: 0.40
Nodes (4): Nginx Proxy Manager — fly-fix TLS checklist, Reissue frontend cert (both names), Required proxy-host settings, Symptoms Chrome shows

### Community 55 - "api.ts"
Cohesion: 0.07
Nodes (33): f, FiltersPanelProps, FlightDetailsModalProps, FlightResultCardProps, KEYS, s, SortBarProps, SortOption (+25 more)

### Community 56 - "FlightResultCard.tsx"
Cohesion: 0.22
Nodes (16): buildRoutePath(), c, FlightResultCard(), LegScheduleBlock(), FlightSegment, LayoverSummary, OutboundSummary, buildLegPreviewSummary() (+8 more)

### Community 58 - "AppIcon"
Cohesion: 0.09
Nodes (40): AppIcon(), AppIconLibrary, AppIconProps, styles, DestinationMoodBanner(), FormHeroHeader(), FormHeroHeaderProps, styles (+32 more)

### Community 59 - "steps"
Cohesion: 0.09
Nodes (22): runs-on, steps, jobs, deploy, name, on, push, workflow_dispatch (+14 more)

### Community 60 - "flyfix-api"
Cohesion: 0.06
Nodes (35): context, FLIGHT_SCRAPER_URL, PLAYWRIGHT_HEADLESS, PORT, SCRAPER_CDP_URLS, SCRAPER_PROXY_URL, build, container_name (+27 more)

### Community 61 - ".Search"
Cohesion: 0.12
Nodes (8): truncateStr(), otaScraperCache, otaScraperCacheEntry, OtaScraperProvider, Docker, Flight scraper (multisite), Run locally, VPS (recommended): headed Chrome on `:99`

### Community 62 - "ResultsScreen.tsx"
Cohesion: 0.08
Nodes (50): createSearchSessionWithRetry(), collectTripDestinationCodes(), DestinationMoodStrip(), EditSearchModal(), HubRouteSummaryModal(), SearchSummaryBar(), SearchLoadingOverlay(), DynamicDestinationsFormContent() (+42 more)

### Community 64 - "AdminRuntimeConfigPanel.tsx"
Cohesion: 0.17
Nodes (19): apiRequest(), adminAuthHeaders(), fetchAdminRuntimeConfig(), fetchRuntimeConfig(), saveAdminRuntimeConfig(), setRuntimeConfigStore(), RuntimeConfigContext, RuntimeConfigContextValue (+11 more)

### Community 65 - "npm"
Cohesion: 0.17
Nodes (11): networks, proxy, container_name, image, networks, ports, restart, volumes (+3 more)

### Community 66 - "skyscanner.js"
Cohesion: 0.20
Nodes (18): com, fr, req, parseDepArrHm(), skyscannerDate(), ensureDatedResultsUrl(), extractSkyscanner(), FLIGHTS_PATH_BY_HOST (+10 more)

### Community 67 - "kiwi.js"
Cohesion: 0.16
Nodes (23): offerTemplate(), segment(), clearKiwiSpaState(), ensureKiwiResultsUrl(), extractFromCaptured(), extractNextData(), flattenOffers(), kiwiPathLooksCorrect() (+15 more)

### Community 69 - "nginx-proxy-manager (VPS edge)"
Cohesion: 0.40
Nodes (4): Deploy sync, First-time / recovery, nginx-proxy-manager (VPS edge), On the server

### Community 70 - "SearchRequest"
Cohesion: 0.19
Nodes (16): TestCompleteExtraLegs(), TestExtraLegsFingerprint(), parseOtaOffers(), TestSanitizeStandardSearchRequest(), flattenOtaScraperResponse(), otaCabin(), otaCurrency(), CompleteExtraLegs() (+8 more)

### Community 71 - "AuthContext.tsx"
Cohesion: 0.17
Nodes (22): authHeaders(), AuthUser, changePassword(), createUser(), deleteUser(), fetchAuthMe(), fetchUsers(), LoginResponse (+14 more)

### Community 72 - "Registry"
Cohesion: 0.18
Nodes (8): TestRegistryFailureMessage_transientOutbound(), TestRegistrySearchAll_openJawGF2FailNotMaskedByKiwiSkip(), TestRegistrySearchAllPartialFailure(), isFastProvider(), isSkippedProviderErr(), IsTransientSearchErrMsg(), MultiSearchResult, Registry

### Community 73 - "providers.go"
Cohesion: 0.18
Nodes (19): asArray(), collectCarriers(), detectSelfTransfer(), extractKiwiLegs(), firstFloat(), firstString(), kiwiSegmentFromMap(), mapsToSegments() (+11 more)

### Community 74 - "warm.js"
Cohesion: 0.09
Nodes (23): cdpLockBusy(), chain, DEFAULT_SITES, beginSearch(), endSearch(), isSearchBusy(), app, express (+15 more)

### Community 75 - "ProviderResult"
Cohesion: 0.11
Nodes (21): DedupeProviderResults(), ItineraryFingerprint(), mergeSelfTransfer(), TotalStops(), uniqueStrings(), cheapestReturnLeg(), providerResultArrivalAirport(), legSearchRetryable() (+13 more)

### Community 76 - "booking.ts"
Cohesion: 0.15
Nodes (17): BookingResolveRequest, BookingResolveStatus, bookingRetryDelayMs(), fetchBookingResolveOnce(), isTransientBookingFetchError(), isTransientBookingResolveResponse(), PublicBookingAlternative, resolveBookingOffer() (+9 more)

### Community 78 - "affiliate.ts"
Cohesion: 0.27
Nodes (9): AffiliateProvider, AffiliateProviderResponse, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink(), OutboundLinkResponse (+1 more)

### Community 79 - "ValidateBookingURL"
Cohesion: 0.27
Nodes (11): gf2CheckoutOffers(), IsCheckoutBookingURL(), IsNonBookableDomain(), TestIsCheckoutBookingURL_rejectsFlightSearchPages(), TestIsNonBookableDomain_blocksFlightRadar(), TestValidateBookingURL_acceptsHTTPS(), TestValidateBookingURL_rejectsEmpty(), TestValidateBookingURL_rejectsJavascript() (+3 more)

### Community 82 - "session.js"
Cohesion: 0.23
Nodes (15): pageLooksBlocked(), withCdpLock(), getOpenPageHook(), browserPromises, { chromium, firefox }, getBrowser(), isTransientScrapeError(), pruneJunkPages() (+7 more)

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
Cohesion: 0.10
Nodes (32): bookingResolveMaxConcurrentFromEnv(), envDurationMinutes(), init(), init(), budgetCfg(), BudgetModeEnabled(), durationFromEnvMin(), envTruthy() (+24 more)

### Community 88 - "expedia.js"
Cohesion: 0.35
Nodes (4): expediaUrl(), scrapeExpedia(), attachJsonCapture(), gotoAndSettle()

### Community 89 - "LocaleContext.tsx"
Cohesion: 0.19
Nodes (16): getStorage(), languageToLocale(), loadSaved(), LocaleContext, LocaleContextValue, LocaleProvider(), save(), VALID_CURRENCIES (+8 more)

### Community 92 - "time.Time"
Cohesion: 0.15
Nodes (19): minutesOfDay(), mergeExplorePriceRows(), exploreDestRow, FullRoundTrip, attachReturnLegKeepPrice(), ensureRoundTripLegs(), exploreDestRowsToMaps(), exploreRunLiveBatch() (+11 more)

### Community 93 - "scrape.js"
Cohesion: 0.48
Nodes (5): runWithOpenPage(), hasCdp(), runOne(), scrapeAll(), SITE_FNS

### Community 94 - "ErrorBoundary"
Cohesion: 0.15
Nodes (4): ErrorBoundary, Props, s, State

### Community 95 - "flyfix.ts"
Cohesion: 0.18
Nodes (11): API_BASE, apiPost(), apiUrl(), isLocalHostname(), resolveApiBase(), FlyfixInsightsGroup, FlyfixIssue, FlyfixRefinedReport (+3 more)

### Community 98 - "api/index.ts"
Cohesion: 0.15
Nodes (15): searchAirports(), apiGet(), getDealsRange(), GetDealsRangeParams, GetMonthDealsParams, getFlightDetails(), GetFlightDetailsParams, DatePickerCalendar() (+7 more)

### Community 100 - "dealsCache.ts"
Cohesion: 0.25
Nodes (15): DealsState, MonthDealsResponse, CachedDealsResults, clearPendingDealsParams(), DealsParams, dealsParamsFingerprint(), getCachedDealsResults(), getLocalStorage() (+7 more)

### Community 101 - "ensure-flight-chrome.sh"
Cohesion: 0.70
Nodes (4): DISPLAY, ensure_gateway_proxy(), log(), ensure-flight-chrome.sh script

### Community 102 - "skyscanner.ts"
Cohesion: 0.42
Nodes (10): BookingHop, bookingHopsFromOption(), firstSeg(), isClassicRoundTripLegs(), isoDatePrefix(), isSplitBookingItinerary(), lastSeg(), legNeedsSegmentSplit() (+2 more)

### Community 104 - "handleCreateSession"
Cohesion: 0.31
Nodes (5): CreateSearchSessionRequest, ExtraSearchLeg, finalizeSearchSession(), handleCreateSession(), randomID()

### Community 105 - "ota_scraper_provider.go"
Cohesion: 0.16
Nodes (4): parseOtaScraperSites(), otaScraperSearchRequest, otaScraperSearchResponse, otaScraperSiteResult

## Knowledge Gaps
- **3 isolated node(s):** `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 568 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Fly-Fix` connect `Features` to `MonthDealsScreen.tsx`?**
  _High betweenness centrality (0.350) - this node is a cross-community bridge._
- **What connects `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `.ResolveQuotedPartnerBooking` be split into smaller, more focused modules?**
  _Cohesion score 0.11960132890365449 - nodes in this community are weakly interconnected._
- **Why does `Multi-provider flight search` connect `Features` to `budget_config.go`?**
  _High betweenness centrality (0.340) - this node is a cross-community bridge._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07180851063829788 - nodes in this community are weakly interconnected._
- **Why does `Recent enhancements` connect `MonthDealsScreen.tsx` to `Features`, `AppIcon`?**
  _High betweenness centrality (0.335) - this node is a cross-community bridge._
- **Should `useSearchParams.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1076923076923077 - nodes in this community are weakly interconnected._