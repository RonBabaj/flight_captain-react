# Graph Report - workspace  (2026-11-11)

## Corpus Check
- 286 files · ~240,673 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 14 file(s) not represented in the graph (top: (none) 8, .example 2, .conf 2)

## Summary
- 2399 nodes · 7443 edges · 104 communities (86 shown, 18 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 603 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4ffd2fd7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- .ResolveQuotedPartnerBooking
- RootNavigator.tsx
- SearchFormScreen.tsx
- Issue
- SearchLoadingOverlay.tsx
- AdminRuntimeConfigPanel.tsx
- frontend/package.json
- useTheme
- Features
- itinerary_test.go
- flight-scraper/package.json
- booking_gf2_resolve.go
- BookingOptionsFooter.tsx
- compilerOptions
- booking_resolve.go
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
- api.ts
- legSummary.ts
- .finalize
- AppIcon
- steps
- flyfix-api
- OtaScraperProvider
- ResultsScreen.tsx
- DateRangePicker.tsx
- client.ts
- npm
- skyscanner.js
- kiwi.js
- providers.go
- nginx-proxy-manager (VPS edge)
- SearchRequest
- AuthContext.tsx
- .SearchAllWithProgress
- providers.go
- scrape.js
- ProviderResult
- exchangeRates.ts
- AirportLocation
- FlightOption
- ValidateBookingURL
- dealsCache.ts
- booking.ts
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
- DatePickerCalendar.tsx
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

## Communities (104 total, 18 thin omitted)

### Community 0 - ".ResolveQuotedPartnerBooking"
Cohesion: 0.14
Nodes (23): resolveAllPartnerBookingsFromTokenWithRetry(), findBookingOptionsArray(), firstPartnerBookingOption(), firstPartnerURLInMap(), firstStringByKeys(), ResolvedPartnerBooking, isPartnerBookingList(), parseGF2BookingOptions() (+15 more)

### Community 1 - "RootNavigator.tsx"
Cohesion: 0.09
Nodes (34): LandingScreen(), Nav, styles, Breakpoint, BREAKPOINTS, useBreakpoint(), useIsCompactLayout(), useIsMobile() (+26 more)

### Community 2 - "SearchFormScreen.tsx"
Cohesion: 0.09
Nodes (41): App(), linking, RTLWrapper(), defaultParams, SearchFormScreen(), styles, buildSearchString(), getParam() (+33 more)

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "SearchLoadingOverlay.tsx"
Cohesion: 0.17
Nodes (14): CubeSpinStyles(), LoadingCubePreview(), LoadingCubePulse(), styles, getPhrasesForLanguage(), SEARCH_BUTTON_PHRASES, SEARCH_PROGRESS_PHRASES, s (+6 more)

### Community 5 - "AdminRuntimeConfigPanel.tsx"
Cohesion: 0.18
Nodes (15): apiRequest(), adminAuthHeaders(), fetchAdminRuntimeConfig(), fetchRuntimeConfig(), saveAdminRuntimeConfig(), setRuntimeConfigStore(), RuntimeConfigContext, RuntimeConfigContextValue (+7 more)

### Community 6 - "frontend/package.json"
Cohesion: 0.06
Nodes (39): config, { getDefaultConfig }, dependencies, expo@~52.0.0, @expo/metro-runtime@~4.0.1, expo-status-bar@~2.0.0, react@18.3.1, react-dom@18.3.1 (+31 more)

### Community 7 - "useTheme"
Cohesion: 0.07
Nodes (71): ClearableTextInput(), ClearableTextInputProps, styles, styles, HubRouteLeg, HubRouteSummaryModalProps, s, useAuth() (+63 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (33): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+25 more)

### Community 9 - "itinerary_test.go"
Cohesion: 0.23
Nodes (14): AttachCanonicalIdentity(), segTLVJFK(), TestCanonicalItineraryFingerprint_connectingFlight(), TestCanonicalItineraryFingerprint_differentFlightsDoNotCollide(), TestCanonicalItineraryFingerprint_directFlight(), TestCanonicalItineraryFingerprint_formattingStable(), TestCanonicalItineraryFingerprint_gf2AirlineNameStable(), TestCanonicalItineraryFingerprint_missingOptionalFields() (+6 more)

### Community 10 - "flight-scraper/package.json"
Cohesion: 0.11
Nodes (17): express, playwright, dependencies, express@^4.21.2, playwright@^1.49.1, description, engines, node (+9 more)

### Community 11 - "booking_gf2_resolve.go"
Cohesion: 0.12
Nodes (35): airlineDomainForCarrier(), allocateLegQuoteAmount(), applySearchQuoteToOffer(), attachQuotedPriceMeta(), dedupeGF2PartnerOffers(), flightLegDurationMinutes(), gf2OffersHavePrice(), gf2PartnerOfferFromQuoteURL() (+27 more)

### Community 12 - "BookingOptionsFooter.tsx"
Cohesion: 0.17
Nodes (26): BookingResolveResponse, isSafeBookingUrl(), PublicBookingOffer, bookingOfferProviderLabel(), bookingOfferSubtitle(), formatBookingOfferPriceAmount(), formatBookingOfferPriceLine(), formatProviderDisplayName() (+18 more)

### Community 13 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 14 - "booking_resolve.go"
Cohesion: 0.08
Nodes (42): acquireBookingResolveSlot(), beginInflightResolve(), bookingResolveCacheKey(), bookingResolveFailureResponse(), cacheTTLForStatus(), canonicalItineraryForOption(), finishInflightResolve(), getCachedBookingResolve() (+34 more)

### Community 15 - "canonical_booking_test.go"
Cohesion: 0.12
Nodes (28): openJawOption(), TestBookingLinkModeDefaultsToGoogle(), TestBookingRouteFromSessionOption_splitOmitsReturn(), TestBuildGoogleFlightsFallbackFromParams(), TestBuildLegOrSegmentBookingURL_segment(), TestBuildOneWayLegBookingURL(), TestBuildSkyscannerPrefillURL_oneWay(), TestBuildSkyscannerPrefillURL_roundTrip() (+20 more)

### Community 16 - "MonthDealsScreen.tsx"
Cohesion: 0.06
Nodes (51): getFlightDetails(), EditSearchModal(), EditSearchModalProps, s, HubRouteSummaryModal(), s, SearchSummaryBar(), SearchSummaryBarProps (+43 more)

### Community 17 - "googleflights2_provider.go"
Cohesion: 0.13
Nodes (38): TestParseGF2TimeWithDateHint_AirportLocal(), TestExtractGF2BookingToken(), TestExtractGF2BookingURL(), TestBuildGF2ResultFromItinerary_FlatFormat(), TestParseGF2Response_AttachesFlatReturnFlights(), TestParseGF2Response_RapidAPIFlatTopFlights(), TestExtractGF2Leg_TimeOnly_NoDateHint(), TestExtractGF2SegmentFromFlight_CodeOnlyHasNoName() (+30 more)

### Community 18 - "server.go"
Cohesion: 0.07
Nodes (44): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, Carrier, CarrierCodes, DayDeal, startExploreSessionCleanup() (+36 more)

### Community 22 - "matcher_test.go"
Cohesion: 0.16
Nodes (30): extractPrice(), cfgTest(), testConnectingTLVJFK(), TestExtractPrice_euroPrefixNotArrivalTime(), TestGenerateQueries_connecting(), TestGenerateQueries_direct(), TestGenerateQueries_gf2AirlineNameIdentity(), TestGenerateQueries_includesRouteDateBookQuery() (+22 more)

### Community 23 - "TestResult"
Cohesion: 0.19
Nodes (3): ResponseAnalyzer, main(), _print_unreachable_backend_hint()

### Community 25 - "runtime_config.go"
Cohesion: 0.22
Nodes (16): adminAccessConfigured(), configRangeError, adminTokenConfigured(), defaultRuntimeConfig(), errConfigOutOfRange(), getRuntimeConfig(), handleAdminRuntimeConfig(), initRuntimeConfigStore() (+8 more)

### Community 26 - "FiltersPanel.tsx"
Cohesion: 0.14
Nodes (21): AIRLINE_NAMES, getAirlineName(), resolveAirlineLabel(), AIRLINE_FULL_NAMES, f, FiltersPanel(), FiltersPanelProps, FlightDetailsModalProps (+13 more)

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.30
Nodes (10): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+2 more)

### Community 29 - "auth_test.go"
Cohesion: 0.33
Nodes (10): initAuthStore(), purgeExpiredAuthSessions(), purgeExpiredAuthSessionsLoop(), initTestAuthDB(), randomTestPassword(), TestAuthLoginAndChangePassword(), TestAuthRegister(), TestAuthUserManagement() (+2 more)

### Community 30 - "CanonicalItinerary"
Cohesion: 0.12
Nodes (22): corpusText(), domainFromURL(), logMatchEvent(), MatchItinerary(), NewResolver(), collectSerpAPIResultMaps(), DefaultConfig(), envInt() (+14 more)

### Community 31 - "auth.go"
Cohesion: 0.14
Nodes (39): authUserJSON(), bearerTokenFromRequest(), bootstrapAdminUser(), createAuthSession(), envFlagTrue(), handleAuthChangePassword(), handleAuthLogin(), handleAuthLogout() (+31 more)

### Community 32 - "itinerary.go"
Cohesion: 0.11
Nodes (41): extractFlightNumbers(), flightNumberInText(), flightNumbersEquivalent(), splitFlightDesignator(), textContainsAirport(), textContainsAny(), timeMatches(), connectingFlightQueries() (+33 more)

### Community 33 - "BookingOffer"
Cohesion: 0.16
Nodes (31): bookingMatchPriceNormalizer(), isAffiliateTemplateBookingURL(), normalizedGF2OfferPrice(), preferAirlineDirectWhenCheaperThanMarkedUpOTA(), publicAlternativesFromOffers(), bookingOfferInGF2Sources(), bookingOfferSameURL(), buildDualBookingResolveResponse() (+23 more)

### Community 34 - "explore_cache.go"
Cohesion: 0.13
Nodes (19): airportCoord, exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut(), getAirportCoord() (+11 more)

### Community 36 - "Backend QA Automation Tool"
Cohesion: 0.18
Nodes (10): Backend QA Automation Tool, Features, If the run feels slow or “stuck”, Notes, Optional AI Setup (Ollama), Output, Project Structure, Run (+2 more)

### Community 37 - "test-roundtrip-legs.js"
Cohesion: 0.12
Nodes (21): a, arr, assert, b, dep, late, assert, frSegs (+13 more)

### Community 38 - "affiliate.go"
Cohesion: 0.15
Nodes (18): BuildLegAirlineDirectURL(), BuildRedirectURL(), getAffiliateID(), GetClicksSummary(), getOTAProvider(), GetSessionAndOption(), ParseOptionIndex(), RecordClick() (+10 more)

### Community 39 - "search.ts"
Cohesion: 0.13
Nodes (20): CachedResult, createSearchSession(), ensureLegacyPurge(), fetchFresh(), getFromStorage(), getStorage(), isEmptyCompleteSession(), isIncompleteSession() (+12 more)

### Community 40 - "affiliate.ts"
Cohesion: 0.27
Nodes (9): AffiliateProvider, AffiliateProviderResponse, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink(), OutboundLinkResponse (+1 more)

### Community 42 - "ExploreScreen.tsx"
Cohesion: 0.09
Nodes (59): getMonthDeals(), getExploreDestinations(), SearchLoadingOverlay(), AIRPORT_ONLY_DICTIONARY, FULL_PLACE_DICTIONARY, getAirportDisplayName(), getAirportEntry(), getAirportNameByCode() (+51 more)

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "DestinationMoodBanner.tsx"
Cohesion: 0.12
Nodes (11): __dirname, dist, indexHtml, indexPath, SPA_ROUTES, byCity, curatedCities, curatedUrls (+3 more)

### Community 45 - "booking_resolve.go"
Cohesion: 0.08
Nodes (9): bookingResolveMaxConcurrentFromEnv(), envDurationMinutes(), init(), BookingResolveRequest, PublicBookingAlternative, parseOtaScraperSites(), otaScraperSearchRequest, otaScraperSearchResponse (+1 more)

### Community 46 - "test_cases"
Cohesion: 0.05
Nodes (40): departureDate, origin, byProvider, currency, error, from, items, route (+32 more)

### Community 47 - "flightTimeDisplay.ts"
Cohesion: 0.16
Nodes (22): airportTimeZones, getAirportTimeZone(), cabinLabel(), FlightDetailsModal(), formatDuration(), layoverBetween(), legDuration(), s (+14 more)

### Community 53 - "session_store.go"
Cohesion: 0.14
Nodes (27): ProviderSearchStats, SearchSession, SearchSessionResultsResponse, SearchSessionStatus, loadSearchSession(), markSessionFailed(), publishSessionSnapshot(), TestLoadSearchSession_Expiry() (+19 more)

### Community 54 - "Nginx Proxy Manager — fly-fix TLS checklist"
Cohesion: 0.40
Nodes (4): Nginx Proxy Manager — fly-fix TLS checklist, Reissue frontend cert (both names), Required proxy-host settings, Symptoms Chrome shows

### Community 55 - "api.ts"
Cohesion: 0.14
Nodes (14): SearchState, AirportCityType, AirportLike, BaggageClass, Carrier, COUNTRY_DEST_PREFIX, ExplorePriceSource, FareBreakdown (+6 more)

### Community 56 - "legSummary.ts"
Cohesion: 0.22
Nodes (16): buildRoutePath(), c, FlightResultCard(), LegScheduleBlock(), LayoverSummary, OutboundSummary, hasMultipleAirlines(), buildLegPreviewSummary() (+8 more)

### Community 58 - "AppIcon"
Cohesion: 0.09
Nodes (43): AppIcon(), AppIconLibrary, AppIconProps, styles, collectTripDestinationCodes(), DestinationMoodBanner(), DestinationMoodStrip(), moodSizeForVariant() (+35 more)

### Community 59 - "steps"
Cohesion: 0.09
Nodes (22): runs-on, steps, jobs, deploy, name, on, push, workflow_dispatch (+14 more)

### Community 60 - "flyfix-api"
Cohesion: 0.06
Nodes (37): context, FLIGHT_SCRAPER_MAX_CONCURRENT, FLIGHT_SCRAPER_URL, PLAYWRIGHT_HEADLESS, PORT, SCRAPER_CDP_URLS, SCRAPER_PROXY_URL, SCRAPER_WARM_ON_START (+29 more)

### Community 61 - "OtaScraperProvider"
Cohesion: 0.18
Nodes (6): truncateStr(), OtaScraperProvider, Docker, Flight scraper (multisite), Run locally, VPS (recommended): headed Chrome on `:99`

### Community 62 - "ResultsScreen.tsx"
Cohesion: 0.11
Nodes (32): createSearchSessionWithRetry(), getSearchSessionResults(), invalidateSearchSessionResultsCache(), getRuntimeConfig(), defaultParams, DynamicDestinationsScreen(), Nav, styles (+24 more)

### Community 63 - "DateRangePicker.tsx"
Cohesion: 0.22
Nodes (16): useRuntimeConfig(), buildMonthDays(), DateRangePicker(), DateRangePickerProps, getMonthStart(), monthStartForYmd(), parseYmdUtc(), styles (+8 more)

### Community 64 - "client.ts"
Cohesion: 0.14
Nodes (15): searchAirports(), API_BASE, apiGet(), apiUrl(), isLocalHostname(), resolveApiBase(), GetDealsRangeParams, GetMonthDealsParams (+7 more)

### Community 65 - "npm"
Cohesion: 0.17
Nodes (11): networks, proxy, container_name, image, networks, ports, restart, volumes (+3 more)

### Community 66 - "skyscanner.js"
Cohesion: 0.19
Nodes (19): com, fr, req, skyscannerDate(), ensureDatedResultsUrl(), extractSkyscanner(), FLIGHTS_PATH_BY_HOST, flightsSegmentForHost() (+11 more)

### Community 67 - "kiwi.js"
Cohesion: 0.17
Nodes (22): offerTemplate(), clearKiwiSpaState(), ensureKiwiResultsUrl(), extractFromCaptured(), extractNextData(), flattenOffers(), kiwiPathLooksCorrect(), kiwiSearchUrl() (+14 more)

### Community 68 - "providers.go"
Cohesion: 0.18
Nodes (19): TestCombineOneWayBatches(), TestCombineOneWayBatches_emptyBatch(), TestCombineOneWayBatches_openJawReturnDiversity(), TestCompleteExtraLegs(), TestExtraLegsFingerprint(), TestAttachCanonicalIdentityAll_combineOneWay(), cloneLegs(), CombineOneWayBatches() (+11 more)

### Community 69 - "nginx-proxy-manager (VPS edge)"
Cohesion: 0.40
Nodes (4): Deploy sync, First-time / recovery, nginx-proxy-manager (VPS edge), On the server

### Community 70 - "SearchRequest"
Cohesion: 0.13
Nodes (19): classicRoundTripMissingReturn(), TestDoSearchWithRetry_doesNotCacheRoundTrip(), TestSearch_ignoresIncompleteClassicRTCache(), TestSearch_servesCompleteClassicRTCache(), GoogleFlights2Provider, legSearchRetryable(), newGF2Cache(), truncateGF2() (+11 more)

### Community 71 - "AuthContext.tsx"
Cohesion: 0.17
Nodes (22): authHeaders(), AuthUser, changePassword(), createUser(), deleteUser(), fetchAuthMe(), fetchUsers(), LoginResponse (+14 more)

### Community 72 - ".SearchAllWithProgress"
Cohesion: 0.17
Nodes (9): AttachCanonicalIdentityAll(), TestRegistryFailureMessage_transientOutbound(), TestRegistrySearchAll_openJawGF2FailNotMaskedByKiwiSkip(), TestRegistrySearchAllPartialFailure(), isFastProvider(), isSkippedProviderErr(), IsTransientSearchErrMsg(), MultiSearchResult (+1 more)

### Community 73 - "providers.go"
Cohesion: 0.15
Nodes (21): TotalStops(), asArray(), collectCarriers(), detectSelfTransfer(), extractKiwiLegs(), firstFloat(), firstString(), kiwiSegmentFromMap() (+13 more)

### Community 74 - "scrape.js"
Cohesion: 0.18
Nodes (11): runWithOpenPage(), hasCdp(), runOne(), scrapeAll(), SITE_FNS, beginSearch(), endSearch(), isSearchBusy() (+3 more)

### Community 75 - "ProviderResult"
Cohesion: 0.10
Nodes (16): DedupeProviderResults(), ItineraryFingerprint(), mergeSelfTransfer(), uniqueStrings(), cheapestReturnLeg(), providerResultArrivalAirport(), ResultMatchesItinerary(), TestDedupeKeepsCheaper() (+8 more)

### Community 76 - "exchangeRates.ts"
Cohesion: 0.23
Nodes (11): DisplayPrice(), DisplayPriceProps, useExchangeRates(), convertPrice(), CURRENCY_SYMBOLS, CurrencyCode, ensureRates(), fetchRates() (+3 more)

### Community 77 - "AirportLocation"
Cohesion: 0.14
Nodes (16): AirportLocation(), TestAirportLocation_UnknownFallsBackUTC(), TestParseGF2TimeWithDateHint_TelAviv(), TestParseGF2Time_EuropeanDateFormat(), TestExtractGF2Leg_SingleSegment_DepartArriveDiffer(), TestExtractGF2Leg_TimeOnly_WithDateHint(), TestParseGF2Time_AcceptsFullDateTime(), TestParseGF2Time_NumericOffsetIsAbsolute() (+8 more)

### Community 78 - "FlightOption"
Cohesion: 0.09
Nodes (34): CanonicalFingerprint(), normalizeProviderBookingURL(), CreateSearchSessionRequest, ExtraSearchLeg, FlightOption, BuildCanonicalItinerary(), applyPriceNormalization(), applySoftStrictBaggageOptions() (+26 more)

### Community 79 - "ValidateBookingURL"
Cohesion: 0.18
Nodes (15): gf2CheckoutOffers(), classifyURLType(), TestClassifyURLType_genericVsExact(), urlTypeRank(), IsCheckoutBookingURL(), IsNonBookableDomain(), TestIsCheckoutBookingURL_rejectsFlightSearchPages(), TestIsNonBookableDomain_blocksFlightRadar() (+7 more)

### Community 80 - "dealsCache.ts"
Cohesion: 0.25
Nodes (15): DealsState, MonthDealsResponse, CachedDealsResults, clearPendingDealsParams(), DealsParams, dealsParamsFingerprint(), getCachedDealsResults(), getLocalStorage() (+7 more)

### Community 81 - "booking.ts"
Cohesion: 0.36
Nodes (8): BookingResolveRequest, BookingResolveStatus, bookingRetryDelayMs(), fetchBookingResolveOnce(), isTransientBookingFetchError(), isTransientBookingResolveResponse(), PublicBookingAlternative, resolveBookingOffer()

### Community 82 - "session.js"
Cohesion: 0.12
Nodes (30): pageLooksBlocked(), cdpLockBusy(), chain, withCdpLock(), getOpenPageHook(), browserPromises, { chromium, firefox }, getBrowser() (+22 more)

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
Cohesion: 0.11
Nodes (32): init(), budgetCfg(), BudgetModeEnabled(), durationFromEnvMin(), envTruthy(), ExploreBudgetLimits(), FilterProviderNamesForBudget(), GF2EffectiveCacheTTL() (+24 more)

### Community 88 - "expedia.js"
Cohesion: 0.19
Nodes (6): DEFAULT_SITES, expediaUrl(), scrapeExpedia(), attachJsonCapture(), gotoAndSettle(), mergeConfig()

### Community 89 - "LocaleContext.tsx"
Cohesion: 0.18
Nodes (17): getStorage(), languageToLocale(), loadSaved(), LocaleContext, LocaleContextValue, LocaleProvider(), save(), VALID_CURRENCIES (+9 more)

### Community 92 - "time.Time"
Cohesion: 0.11
Nodes (25): elapsedMs(), minutesOfDay(), bookingResolveCacheEntry, CodeshareFingerprint(), roundTimeToMinutes(), getExploreSession(), putExploreSession(), exploreDestRow (+17 more)

### Community 93 - "destinationMood.ts"
Cohesion: 0.18
Nodes (10): AIRPORT_DICTIONARY, ASSIGNED_URLS, BY_CODE, BY_COUNTRY, DestinationMood, FALLBACK_IMAGE, hashCode(), LANDING_MOOD_DESTINATIONS (+2 more)

### Community 94 - "ErrorBoundary"
Cohesion: 0.15
Nodes (4): ErrorBoundary, Props, s, State

### Community 95 - "GF2SearchAirports"
Cohesion: 0.20
Nodes (11): gf2MetroKey(), GF2SearchAirports(), limitGF2SearchAirports(), ResolveGF2PlaceCode(), containsAll(), TestGF2SearchAirports_CityOnlyCode(), TestGF2SearchAirports_LondonParis(), TestGF2SearchAirports_SingleAirport() (+3 more)

### Community 96 - "flyfix.ts"
Cohesion: 0.29
Nodes (7): apiPost(), FlyfixInsightsGroup, FlyfixIssue, FlyfixRefinedReport, FlyfixSummary, refineIssues(), RefineIssuesRequestBody

### Community 97 - "DatePickerCalendar.tsx"
Cohesion: 0.39
Nodes (7): getDealsRange(), DatePickerCalendar(), DatePickerCalendarProps, getNext14Dates(), getRangeStartEnd(), styles, WEEKDAYS

### Community 101 - "ensure-flight-chrome.sh"
Cohesion: 0.70
Nodes (4): DISPLAY, ensure_gateway_proxy(), log(), ensure-flight-chrome.sh script

### Community 102 - "skyscanner.ts"
Cohesion: 0.42
Nodes (10): BookingHop, bookingHopsFromOption(), firstSeg(), isClassicRoundTripLegs(), isoDatePrefix(), isSplitBookingItinerary(), lastSeg(), legNeedsSegmentSplit() (+2 more)

### Community 105 - "testing.T"
Cohesion: 0.06
Nodes (44): TestAllocateLegQuoteAmount_splitOpenJaw(), TestLegDeepLink_rejectsMisalignedPartnerArrays(), TestLegDeepLink_rejectsWrongAirlineDirectCheckout(), TestQuoteBindingFromOption_usesOriginalWhenEstimate(), TestQuoteBindingFromOption_usesStoredLegPrice(), TestResolveGF2PartnerOffer_skipsSkyscannerDeepLink(), TestResolveGF2PartnerOffer_usesPersistedLegDeepLinkWithoutProvider(), TestSearchRequestFromSession_singleLegOverride() (+36 more)

## Knowledge Gaps
- **3 isolated node(s):** `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 575 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Fly-Fix` connect `Features` to `MonthDealsScreen.tsx`?**
  _High betweenness centrality (0.331) - this node is a cross-community bridge._
- **What connects `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `.ResolveQuotedPartnerBooking` be split into smaller, more focused modules?**
  _Cohesion score 0.1354723707664884 - nodes in this community are weakly interconnected._
- **Why does `Multi-provider flight search` connect `Features` to `budget_config.go`?**
  _High betweenness centrality (0.324) - this node is a cross-community bridge._
- **Should `RootNavigator.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08686868686868687 - nodes in this community are weakly interconnected._
- **Why does `Recent enhancements` connect `MonthDealsScreen.tsx` to `Features`, `AppIcon`?**
  _High betweenness centrality (0.316) - this node is a cross-community bridge._
- **Should `SearchFormScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09224489795918367 - nodes in this community are weakly interconnected._