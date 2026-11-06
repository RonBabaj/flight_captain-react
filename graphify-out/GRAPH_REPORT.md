# Graph Report - workspace  (2026-11-06)

## Corpus Check
- 278 files · ~235,261 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: (none) 8, .example 2, .mdc 1)

## Summary
- 2372 nodes · 7379 edges · 102 communities (86 shown, 16 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 602 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `11bc3787`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- .ResolveQuotedPartnerBooking
- LandingScreen.tsx
- ResultsScreen.tsx
- Issue
- SearchLoadingOverlay.tsx
- ProviderResult
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
- VerifyCandidate
- TestResult
- ResponseValidator
- runtime_config.go
- booking_gf2_resolve.go
- expo
- config_loader.py
- auth_test.go
- CanonicalItinerary
- RuntimeConfigContext.tsx
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
- api.ts
- FlightResultCard.tsx
- .finalize
- AppIcon
- steps
- flyfix-api
- SearchRequest
- client.ts
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
- selectBookingOptionForQuote
- dealsCache.ts
- affiliate.ts
- App.tsx
- testing.T
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
- IsCheckoutBookingURL
- warm.js
- server_normalize_test.go
- booking.ts
- server_carrier_test.go
- flyfix.ts
- DatePickerCalendar.tsx
- exchangeRates.ts
- ensure-flight-chrome.sh
- docker-entrypoint.sh

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
- `Multi-provider flight search` --references--> `NewRegistryFromEnv()`  [INFERRED]
  README.md → backend/search/registry.go
- `Recent enhancements` --references--> `AppIcon()`  [INFERRED]
  README.md → frontend/src/components/AppIcon.tsx

## Import Cycles
- None detected.

## Communities (102 total, 16 thin omitted)

### Community 0 - ".ResolveQuotedPartnerBooking"
Cohesion: 0.16
Nodes (18): findBookingOptionsArray(), firstPartnerBookingOption(), firstPartnerURLInMap(), firstStringByKeys(), ResolvedPartnerBooking, isPartnerBookingList(), parseGF2BookingOptions(), partnerRequestTokenFromMap() (+10 more)

### Community 1 - "LandingScreen.tsx"
Cohesion: 0.08
Nodes (32): LandingScreen(), Nav, styles, Breakpoint, BREAKPOINTS, useBreakpoint(), useIsCompactLayout(), useIsMobile() (+24 more)

### Community 2 - "ResultsScreen.tsx"
Cohesion: 0.08
Nodes (55): createSearchSessionWithRetry(), useRuntimeConfig(), DynamicDestinationsFormContentProps, defaultParams, DynamicDestinationsScreen(), Nav, styles, FiltersPanel() (+47 more)

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "SearchLoadingOverlay.tsx"
Cohesion: 0.17
Nodes (11): SEARCH_BUTTON_PHRASES, SEARCH_PROGRESS_PHRASES, s, SearchProgressBannerProps, ExtraLeg, Props, s, ResultsSkeletonCard() (+3 more)

### Community 5 - "ProviderResult"
Cohesion: 0.11
Nodes (19): DedupeProviderResults(), ItineraryFingerprint(), mergeSelfTransfer(), uniqueStrings(), cheapestReturnLeg(), providerResultArrivalAirport(), isTransientGF2SearchErr(), legSearchRetryable() (+11 more)

### Community 6 - "frontend/package.json"
Cohesion: 0.06
Nodes (40): config, { getDefaultConfig }, dependencies, expo@~52.0.0, @expo/metro-runtime@~4.0.1, expo-status-bar@~2.0.0, react@18.3.1, react-dom@18.3.1 (+32 more)

### Community 7 - "useTheme"
Cohesion: 0.07
Nodes (66): ClearableTextInput(), ClearableTextInputProps, styles, styles, EditSearchModalProps, s, s, SearchSummaryBarProps (+58 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (33): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+25 more)

### Community 9 - "main"
Cohesion: 0.17
Nodes (11): exploreSessionKey(), getExploreSession(), newExploreSessionID(), putExploreSession(), startExploreSessionCleanup(), exploreSession, corsMiddleware(), fetchExchangeRates() (+3 more)

### Community 10 - "flight-scraper/package.json"
Cohesion: 0.11
Nodes (17): express, playwright, dependencies, express@^4.21.2, playwright@^1.49.1, description, engines, node (+9 more)

### Community 11 - "sharedLinkCache.ts"
Cohesion: 0.18
Nodes (18): isDeepLinkDebugEnabled(), logDeepLinkDiagnostics(), mergeDeepLinkParams(), fromStash, fromUrl, kept, recovery, store (+10 more)

### Community 12 - "BookingOptionsFooter.tsx"
Cohesion: 0.15
Nodes (29): BookingResolveResponse, PublicBookingOffer, bookingOfferProviderLabel(), bookingOfferSubtitle(), formatBookingOfferPriceAmount(), formatBookingOfferPriceLine(), formatProviderDisplayName(), BookingOptionBadge (+21 more)

### Community 13 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 14 - "runBookingMatch"
Cohesion: 0.08
Nodes (45): acquireBookingResolveSlot(), beginInflightResolve(), bookingResolveCacheKey(), bookingResolveFailureResponse(), bookingResolveMaxConcurrentFromEnv(), cacheTTLForStatus(), envDurationMinutes(), finishInflightResolve() (+37 more)

### Community 15 - "canonical_booking_test.go"
Cohesion: 0.13
Nodes (33): openJawOption(), TestBookingLinkModeDefaultsToGoogle(), TestBookingRouteFromSessionOption_splitOmitsReturn(), TestBuildGoogleFlightsFallbackFromParams(), TestBuildLegOrSegmentBookingURL_segment(), TestBuildOneWayLegBookingURL(), TestBuildSkyscannerPrefillURL_oneWay(), TestBuildSkyscannerPrefillURL_roundTrip() (+25 more)

### Community 16 - "MonthDealsScreen.tsx"
Cohesion: 0.07
Nodes (50): getMonthDeals(), getFlightDetails(), DisplayPrice(), DisplayPriceProps, EditSearchModal(), HubRouteLeg, HubRouteSummaryModal(), HubRouteSummaryModalProps (+42 more)

### Community 17 - "googleflights2_provider.go"
Cohesion: 0.12
Nodes (40): TestParseGF2TimeWithDateHint_AirportLocal(), TestExtractGF2BookingToken(), TestExtractGF2BookingURL(), TestExtractGF2PartnerBookingTokenPrefersPartnerURL(), TestBuildGF2ResultFromItinerary_FlatFormat(), TestParseGF2Response_AttachesFlatReturnFlights(), TestParseGF2Response_RapidAPIFlatTopFlights(), TestExtractGF2Leg_TimeOnly_NoDateHint() (+32 more)

### Community 18 - "server.go"
Cohesion: 0.07
Nodes (63): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, CanonicalFingerprint(), Carrier, TestProviderResultsToFlightOptions_PreservesCarrierName(), CarrierCodes (+55 more)

### Community 19 - "booking_resolve_test.go"
Cohesion: 0.23
Nodes (10): exploreLiveCandidate, gf2ExploreResolveDeps(), outboundDatesForMonthBookable(), TestSanitizeProviderErrorForUser(), detectSelfTransfer(), TestDetectSelfTransfer(), SanitizeProviderErrorForUser(), otaScraperSearchRequest (+2 more)

### Community 22 - "VerifyCandidate"
Cohesion: 0.16
Nodes (31): extractPrice(), cfgTest(), floatPtr(), testConnectingTLVJFK(), TestExtractPrice_euroPrefixNotArrivalTime(), TestGenerateQueries_connecting(), TestGenerateQueries_direct(), TestGenerateQueries_gf2AirlineNameIdentity() (+23 more)

### Community 23 - "TestResult"
Cohesion: 0.19
Nodes (3): ResponseAnalyzer, main(), _print_unreachable_backend_hint()

### Community 25 - "runtime_config.go"
Cohesion: 0.22
Nodes (16): adminAccessConfigured(), configRangeError, adminTokenConfigured(), defaultRuntimeConfig(), errConfigOutOfRange(), getRuntimeConfig(), handleAdminRuntimeConfig(), initRuntimeConfigStore() (+8 more)

### Community 26 - "booking_gf2_resolve.go"
Cohesion: 0.06
Nodes (80): airlineDomainForCarrier(), allocateLegQuoteAmount(), applySearchQuoteToOffer(), attachQuotedPriceMeta(), bookingMatchPriceNormalizer(), dedupeGF2PartnerOffers(), flightLegDurationMinutes(), gf2OffersHavePrice() (+72 more)

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.30
Nodes (10): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+2 more)

### Community 29 - "auth_test.go"
Cohesion: 0.49
Nodes (9): handleAuthLogin(), initAuthStore(), initTestAuthDB(), randomTestPassword(), TestAuthLoginAndChangePassword(), TestAuthRegister(), TestAuthUserManagement(), TestBootstrapAdminPasswordSync() (+1 more)

### Community 30 - "CanonicalItinerary"
Cohesion: 0.10
Nodes (24): corpusText(), elapsedMs(), logMatchEvent(), countVerifiedPricedOffers(), MatchItinerary(), NewResolver(), truncateStr(), collectSerpAPIResultMaps() (+16 more)

### Community 31 - "RuntimeConfigContext.tsx"
Cohesion: 0.18
Nodes (15): apiRequest(), adminAuthHeaders(), fetchAdminRuntimeConfig(), fetchRuntimeConfig(), saveAdminRuntimeConfig(), setRuntimeConfigStore(), RuntimeConfigContext, RuntimeConfigContextValue (+7 more)

### Community 32 - "itinerary.go"
Cohesion: 0.09
Nodes (49): extractFlightNumbers(), flightNumberInText(), flightNumbersEquivalent(), splitFlightDesignator(), textContainsAirport(), textContainsAny(), timeMatches(), TestFlightNumbersEquivalent_leadingZeros() (+41 more)

### Community 33 - "budget_config_test.go"
Cohesion: 0.20
Nodes (11): gf2MetroKey(), GF2SearchAirports(), limitGF2SearchAirports(), ResolveGF2PlaceCode(), containsAll(), TestGF2SearchAirports_CityOnlyCode(), TestGF2SearchAirports_LondonParis(), TestGF2SearchAirports_SingleAirport() (+3 more)

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
Nodes (16): BuildLegAirlineDirectURL(), BuildRedirectURL(), getAffiliateID(), GetClicksSummary(), getOTAProvider(), GetSessionAndOption(), ParseOptionIndex(), ResolveProvider() (+8 more)

### Community 39 - "search.ts"
Cohesion: 0.17
Nodes (22): CachedResult, createSearchSession(), ensureLegacyPurge(), fetchFresh(), getFromStorage(), getSearchSessionResults(), getStorage(), invalidateSearchSessionResultsCache() (+14 more)

### Community 40 - "skyscanner.ts"
Cohesion: 0.42
Nodes (10): BookingHop, bookingHopsFromOption(), firstSeg(), isClassicRoundTripLegs(), isoDatePrefix(), isSplitBookingItinerary(), lastSeg(), legNeedsSegmentSplit() (+2 more)

### Community 42 - "ExploreScreen.tsx"
Cohesion: 0.09
Nodes (62): getExploreDestinations(), AIRPORT_ONLY_DICTIONARY, FULL_PLACE_DICTIONARY, getAirportDisplayName(), getAirportEntry(), getAirportNameByCode(), getCityDisplayName(), lower() (+54 more)

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "destinationMood.test.ts"
Cohesion: 0.07
Nodes (21): __dirname, dist, indexHtml, indexPath, SPA_ROUTES, AIRPORT_DICTIONARY, ASSIGNED_URLS, BY_CODE (+13 more)

### Community 45 - "auth.go"
Cohesion: 0.14
Nodes (38): RecordClick(), authUserJSON(), bearerTokenFromRequest(), bootstrapAdminUser(), createAuthSession(), envFlagTrue(), handleAuthChangePassword(), handleAuthLogout() (+30 more)

### Community 46 - "test_cases"
Cohesion: 0.05
Nodes (40): departureDate, origin, byProvider, currency, error, from, items, route (+32 more)

### Community 47 - "FlightDetailsModal.tsx"
Cohesion: 0.21
Nodes (17): isSafeBookingUrl(), AIRLINE_NAMES, getAirlineName(), resolveAirlineLabel(), AIRLINE_FULL_NAMES, cabinLabel(), FlightDetailsModal(), formatDuration() (+9 more)

### Community 53 - "session_store.go"
Cohesion: 0.18
Nodes (21): loadSearchSession(), markSessionComplete(), TestLoadSearchSession_Expiry(), searchSessionTTL(), startSearchSessionCleanup(), cleanupPersistedSessions(), importLegacyJSONSessions(), initSessionStore() (+13 more)

### Community 54 - "Nginx Proxy Manager — fly-fix TLS checklist"
Cohesion: 0.40
Nodes (4): Nginx Proxy Manager — fly-fix TLS checklist, Reissue frontend cert (both names), Required proxy-host settings, Symptoms Chrome shows

### Community 55 - "api.ts"
Cohesion: 0.07
Nodes (34): f, FiltersPanelProps, FlightDetailsModalProps, FlightResultCardProps, KEYS, s, SortBarProps, SortOption (+26 more)

### Community 56 - "FlightResultCard.tsx"
Cohesion: 0.24
Nodes (15): buildRoutePath(), c, FlightResultCard(), LegScheduleBlock(), FlightSegment, LayoverSummary, OutboundSummary, buildLegPreviewSummary() (+7 more)

### Community 58 - "AppIcon"
Cohesion: 0.09
Nodes (45): AppIcon(), AppIconLibrary, AppIconProps, styles, collectTripDestinationCodes(), DestinationMoodBanner(), DestinationMoodStrip(), stripStyles (+37 more)

### Community 59 - "steps"
Cohesion: 0.09
Nodes (22): runs-on, steps, jobs, deploy, name, on, push, workflow_dispatch (+14 more)

### Community 60 - "flyfix-api"
Cohesion: 0.06
Nodes (35): context, FLIGHT_SCRAPER_URL, PLAYWRIGHT_HEADLESS, PORT, SCRAPER_CDP_URLS, SCRAPER_PROXY_URL, build, container_name (+27 more)

### Community 61 - "SearchRequest"
Cohesion: 0.10
Nodes (24): TestCompleteExtraLegs(), TestExtraLegsFingerprint(), parseKiwiApifyItems(), parseKiwiOffers(), truncateStr(), TestSanitizeStandardSearchRequest(), flattenOtaScraperResponse(), otaCabin() (+16 more)

### Community 62 - "client.ts"
Cohesion: 0.14
Nodes (15): searchAirports(), API_BASE, apiGet(), apiUrl(), isLocalHostname(), resolveApiBase(), GetDealsRangeParams, GetMonthDealsParams (+7 more)

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
Cohesion: 0.11
Nodes (19): AirportLocation(), TestAirportLocation_UnknownFallsBackUTC(), TestParseGF2TimeWithDateHint_TelAviv(), TestParseGF2TimeWithDateHint_ZSuffixWallClock(), TestParseGF2Time_EuropeanDateFormat(), TestExtractGF2Leg_SingleSegment_DepartArriveDiffer(), TestExtractGF2Leg_TimeOnly_WithDateHint(), TestParseGF2Time_AcceptsFullDateTime() (+11 more)

### Community 69 - "nginx-proxy-manager (VPS edge)"
Cohesion: 0.40
Nodes (4): Deploy sync, First-time / recovery, nginx-proxy-manager (VPS edge), On the server

### Community 71 - "AuthContext.tsx"
Cohesion: 0.17
Nodes (22): authHeaders(), AuthUser, changePassword(), createUser(), deleteUser(), fetchAuthMe(), fetchUsers(), LoginResponse (+14 more)

### Community 72 - "Registry"
Cohesion: 0.15
Nodes (10): TestRegistryFailureMessage_transientOutbound(), TestRegistrySearchAll_openJawGF2FailNotMaskedByKiwiSkip(), TestRegistrySearchAllPartialFailure(), ProviderSearchStats, isPrimaryProvider(), isSkippedProviderErr(), IsTransientSearchErrMsg(), MultiSearchResult (+2 more)

### Community 73 - "providers.go"
Cohesion: 0.18
Nodes (17): asArray(), collectCarriers(), extractKiwiLegs(), firstFloat(), firstString(), kiwiSegmentFromMap(), mapsToSegments(), normalizeKiwiItem() (+9 more)

### Community 74 - "warm.js"
Cohesion: 0.16
Nodes (17): cdpLockBusy(), chain, withCdpLock(), isSearchBusy(), { chromium }, connectCdp(), GOTO_TIMEOUT_MS, gotoSoft() (+9 more)

### Community 75 - "time.Time"
Cohesion: 0.14
Nodes (19): minutesOfDay(), mergeExplorePriceRows(), exploreDestRow, FullRoundTrip, attachReturnLegKeepPrice(), ensureRoundTripLegs(), exploreDestRowsToMaps(), exploreRunLiveBatch() (+11 more)

### Community 76 - "selectBookingOptionForQuote"
Cohesion: 0.29
Nodes (7): hostFromURL(), PricesMatchQuote(), selectBookingOptionForQuote(), TestPricesMatchQuote(), TestSelectBookingOptionForQuote_fallsBackWhenQuotePriceMismatch(), TestSelectBookingOptionForQuote_prefersDeepLinkHost(), TestSelectBookingOptionForQuote_prefersPriceMatch()

### Community 77 - "dealsCache.ts"
Cohesion: 0.25
Nodes (15): DealsState, MonthDealsResponse, CachedDealsResults, clearPendingDealsParams(), DealsParams, dealsParamsFingerprint(), getCachedDealsResults(), getLocalStorage() (+7 more)

### Community 78 - "affiliate.ts"
Cohesion: 0.27
Nodes (9): AffiliateProvider, AffiliateProviderResponse, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink(), OutboundLinkResponse (+1 more)

### Community 79 - "App.tsx"
Cohesion: 0.33
Nodes (8): App(), linking, RTLWrapper(), useExchangeRates(), RootNavigator(), ThemeProvider(), ensureRates(), fetchRates()

### Community 80 - "testing.T"
Cohesion: 0.06
Nodes (53): TestSelectBestOffer_cheapestOTAOverAirline(), TestSelectBestOffer_conflictingCandidatesPicksCheapest(), TestSelectBestOffer_missingPrice(), TestSelectBestOffer_prefersPriceAmongSameURLType(), TestSelectBestOffer_prefersQuoteMatchingPrice(), TestSelectBestOffer_rejectsGenericSearchURL(), TestSelectBestOffer_rejectsUnverified(), TestSelectCheapestVerifiedOffer_picksLowestPrice() (+45 more)

### Community 81 - ".Search"
Cohesion: 0.22
Nodes (9): classicRoundTripMissingReturn(), TestClassicRoundTripMissingReturn(), TestDoSearchWithRetry_doesNotCacheRoundTrip(), TestSearch_ignoresIncompleteClassicRTCache(), TestSearch_servesCompleteClassicRTCache(), newGF2Cache(), TestSearchLegCached_usesCache(), gf2Cache (+1 more)

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
Cohesion: 0.11
Nodes (30): init(), budgetCfg(), BudgetModeEnabled(), durationFromEnvMin(), envTruthy(), ExploreBudgetLimits(), FilterProviderNamesForBudget(), GF2EffectiveCacheTTL() (+22 more)

### Community 88 - "expedia.js"
Cohesion: 0.21
Nodes (6): DEFAULT_SITES, expediaUrl(), scrapeExpedia(), attachJsonCapture(), gotoAndSettle(), mergeConfig()

### Community 89 - "LocaleContext.tsx"
Cohesion: 0.18
Nodes (17): getStorage(), languageToLocale(), loadSaved(), LocaleContext, LocaleContextValue, LocaleProvider(), save(), VALID_CURRENCIES (+9 more)

### Community 92 - "IsCheckoutBookingURL"
Cohesion: 0.40
Nodes (5): classifyURLType(), domainFromURL(), TestClassifyURLType_genericVsExact(), IsCheckoutBookingURL(), TestIsCheckoutBookingURL_rejectsFlightSearchPages()

### Community 93 - "warm.js"
Cohesion: 0.24
Nodes (7): scrapeAll(), SITE_FNS, beginSearch(), endSearch(), app, express, warmStatus()

### Community 94 - "server_normalize_test.go"
Cohesion: 0.18
Nodes (11): TestApplyPriceNormalizationDefaultNoChange(), TestComputeOutboundSummary_Direct(), TestComputeOutboundSummary_OneStop(), TestComputeTotalDurationFromLegs(), TestComputeTotalDurationFromLegs_IncludesLayover(), TestPriceUpliftMultiplierConfigured(), TestPriceUpliftMultiplierDefaultOff(), TestRoundtripOption_HasTwoLegs() (+3 more)

### Community 95 - "booking.ts"
Cohesion: 0.36
Nodes (8): BookingResolveRequest, BookingResolveStatus, bookingRetryDelayMs(), fetchBookingResolveOnce(), isTransientBookingFetchError(), isTransientBookingResolveResponse(), PublicBookingAlternative, resolveBookingOffer()

### Community 96 - "server_carrier_test.go"
Cohesion: 0.83
Nodes (3): makeOfferWithCarriers(), TestExtractCarrierCodes(), TestPrimaryDisplayCarrier()

### Community 97 - "flyfix.ts"
Cohesion: 0.25
Nodes (8): apiPost(), FlyfixInsightsGroup, FlyfixIssue, FlyfixRefinedReport, FlyfixSummary, refineIssues(), RefineIssuesRequestBody, cancelSearchSession()

### Community 98 - "DatePickerCalendar.tsx"
Cohesion: 0.39
Nodes (7): getDealsRange(), DatePickerCalendar(), DatePickerCalendarProps, getNext14Dates(), getRangeStartEnd(), styles, WEEKDAYS

### Community 99 - "exchangeRates.ts"
Cohesion: 0.40
Nodes (4): convertPrice(), CURRENCY_SYMBOLS, CurrencyCode, ratesToUSD

### Community 101 - "ensure-flight-chrome.sh"
Cohesion: 0.70
Nodes (4): DISPLAY, ensure_gateway_proxy(), log(), ensure-flight-chrome.sh script

## Knowledge Gaps
- **3 isolated node(s):** `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 570 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Fly-Fix` connect `Features` to `MonthDealsScreen.tsx`?**
  _High betweenness centrality (0.347) - this node is a cross-community bridge._
- **What connects `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `LandingScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08013937282229965 - nodes in this community are weakly interconnected._
- **Why does `Multi-provider flight search` connect `Features` to `budget_config.go`?**
  _High betweenness centrality (0.344) - this node is a cross-community bridge._
- **Should `ResultsScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07740384615384616 - nodes in this community are weakly interconnected._
- **Why does `Recent enhancements` connect `MonthDealsScreen.tsx` to `Features`, `AppIcon`?**
  _High betweenness centrality (0.332) - this node is a cross-community bridge._
- **Should `Issue` be split into smaller, more focused modules?**
  _Cohesion score 0.09988385598141696 - nodes in this community are weakly interconnected._