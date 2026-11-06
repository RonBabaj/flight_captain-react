# Graph Report - workspace  (2026-11-06)

## Corpus Check
- 274 files · ~232,962 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: (none) 8, .example 2, .mdc 1)

## Summary
- 2333 nodes · 7298 edges · 106 communities (90 shown, 16 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 591 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `61bbfd60`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- .ResolveQuotedPartnerBooking
- SearchFormScreen.tsx
- ResultsScreen.tsx
- Issue
- SearchLoadingOverlay.tsx
- dealsCache.ts
- frontend/package.json
- useTheme
- Features
- main
- flight-scraper/package.json
- SearchRequest
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
- RuntimeConfigContext.tsx
- CanonicalItinerary
- DateRangePicker.tsx
- itinerary.go
- budget_config_test.go
- explore_cache.go
- ValidationIssue
- Backend QA Automation Tool
- SearchFormScreen.tsx
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
- BookingOffer
- .finalize
- AppIcon
- steps
- flyfix-api
- ProviderResult
- client.ts
- FlightResultCard.tsx
- ErrorBoundary
- npm
- skyscanner.js
- kiwi.js
- testing.T
- nginx-proxy-manager (VPS edge)
- AuthContext.tsx
- Registry
- providers.go
- session.js
- time.Time
- flyfix.ts
- exchangeRates.ts
- affiliate.ts
- destinationMood.ts
- .buildCacheKey
- resolveAirlineLabel
- net/http.Request
- Fly-Fix UI / UX
- TestApplySoftStrictBaggage
- backend_api_contracts.md
- ensure-edge-proxy.sh
- budget_config.go
- expedia.js
- LocaleContext.tsx
- install-edge-proxy-cron.sh
- sync-edge-stack.sh
- ValidateBookingURL
- warm.js
- booking.ts
- budget_config_test.go
- DatePickerCalendar.tsx
- CompleteExtraLegs
- selectBookingOptionForQuote
- ensure-flight-chrome.sh
- booking_resolve.go
- docker-entrypoint.sh
- SearchFormScreen.tsx
- server_carrier_test.go
- CalendarModal.tsx
- time.Time

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

## Communities (106 total, 16 thin omitted)

### Community 0 - ".ResolveQuotedPartnerBooking"
Cohesion: 0.12
Nodes (25): findBookingOptionsArray(), firstPartnerBookingOption(), firstPartnerURLInMap(), firstStringByKeys(), ResolvedPartnerBooking, isPartnerBookingList(), parseGF2BookingOptions(), partnerRequestTokenFromMap() (+17 more)

### Community 1 - "SearchFormScreen.tsx"
Cohesion: 0.11
Nodes (20): DynamicDestinationsStack(), Stack, SearchStack(), Stack, MobileNavRow(), NavIconName, RESULTS_SCREENS, RouteProps (+12 more)

### Community 2 - "ResultsScreen.tsx"
Cohesion: 0.09
Nodes (36): invalidateSearchSessionResultsCache(), defaultParams, DynamicDestinationsScreen(), Nav, styles, FiltersPanel(), ResultsSkeletonCard(), ResultsSkeletonList() (+28 more)

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "SearchLoadingOverlay.tsx"
Cohesion: 0.23
Nodes (10): getPhrasesForLanguage(), SEARCH_BUTTON_PHRASES, SEARCH_PROGRESS_PHRASES, s, SearchProgressBanner(), SearchProgressBannerProps, ExtraLeg, Props (+2 more)

### Community 5 - "dealsCache.ts"
Cohesion: 0.25
Nodes (15): DealsState, MonthDealsResponse, CachedDealsResults, clearPendingDealsParams(), DealsParams, dealsParamsFingerprint(), getCachedDealsResults(), getLocalStorage() (+7 more)

### Community 6 - "frontend/package.json"
Cohesion: 0.06
Nodes (40): config, { getDefaultConfig }, dependencies, expo@~52.0.0, @expo/metro-runtime@~4.0.1, expo-status-bar@~2.0.0, react@18.3.1, react-dom@18.3.1 (+32 more)

### Community 7 - "useTheme"
Cohesion: 0.07
Nodes (70): ClearableTextInput(), ClearableTextInputProps, styles, styles, EditSearchModal(), EditSearchModalProps, s, HubRouteLeg (+62 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (31): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+23 more)

### Community 9 - "main"
Cohesion: 0.33
Nodes (5): startExploreSessionCleanup(), corsMiddleware(), fetchExchangeRates(), main(), startExchangeRateRefresh()

### Community 10 - "flight-scraper/package.json"
Cohesion: 0.12
Nodes (16): express, playwright, dependencies, express@^4.21.2, playwright@^1.49.1, description, engines, node (+8 more)

### Community 11 - "SearchRequest"
Cohesion: 0.09
Nodes (25): TestHasExtraLegs(), parseKiwiApifyItems(), parseKiwiOffers(), truncateStr(), TestParseKiwiApifyItemsSolidcodeShape(), TestParseKiwiEmptyAndInvalid(), TestIsOpenJaw(), TestResolveReturnAirports_classic() (+17 more)

### Community 12 - "BookingOptionsFooter.tsx"
Cohesion: 0.15
Nodes (31): BookingResolveResponse, isSafeBookingUrl(), PublicBookingOffer, bookingOfferProviderLabel(), bookingOfferSubtitle(), formatBookingOfferPriceAmount(), formatBookingOfferPriceLine(), formatProviderDisplayName() (+23 more)

### Community 13 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 14 - "runBookingMatch"
Cohesion: 0.07
Nodes (47): isTransientGF2BookingErr(), resolveAllPartnerBookingsFromTokenWithRetry(), acquireBookingResolveSlot(), beginInflightResolve(), bookingResolveCacheKey(), bookingResolveFailureResponse(), canonicalItineraryForOption(), finishInflightResolve() (+39 more)

### Community 15 - "canonical_booking_test.go"
Cohesion: 0.11
Nodes (30): openJawOption(), TestBookingLinkModeDefaultsToGoogle(), TestBookingRouteFromSessionOption_splitOmitsReturn(), TestBuildGoogleFlightsFallbackFromParams(), TestBuildLegOrSegmentBookingURL_segment(), TestBuildOneWayLegBookingURL(), TestBuildSkyscannerPrefillURL_oneWay(), TestBuildSkyscannerPrefillURL_roundTrip() (+22 more)

### Community 16 - "MonthDealsScreen.tsx"
Cohesion: 0.07
Nodes (44): getFlightDetails(), CheaperCitiesOption, CheaperCitiesSection(), Props, s, f, FiltersPanelProps, KEYS (+36 more)

### Community 17 - "googleflights2_provider.go"
Cohesion: 0.12
Nodes (40): TestParseGF2TimeWithDateHint_AirportLocal(), TestExtractGF2BookingToken(), TestExtractGF2BookingURL(), TestBuildGF2ResultFromItinerary_FlatFormat(), TestParseGF2Response_AttachesFlatReturnFlights(), TestParseGF2Response_RapidAPIFlatTopFlights(), TestExtractGF2Leg_TimeOnly_NoDateHint(), TestExtractGF2SegmentFromFlight_CodeOnlyHasNoName() (+32 more)

### Community 18 - "server.go"
Cohesion: 0.07
Nodes (56): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, CanonicalFingerprint(), Carrier, TestProviderResultsToFlightOptions_PreservesCarrierName(), CarrierCodes (+48 more)

### Community 19 - "booking_resolve_test.go"
Cohesion: 0.32
Nodes (4): gf2ExploreResolveDeps(), outboundDatesForMonthBookable(), detectSelfTransfer(), TestDetectSelfTransfer()

### Community 22 - "VerifyCandidate"
Cohesion: 0.20
Nodes (21): extractPrice(), cfgTest(), TestExtractPrice_euroPrefixNotArrivalTime(), testItineraryOS860(), TestResolver_pipeline_cheapestVerifiedOffer(), TestResolver_pipeline_exactMatch(), TestVerifyCandidate_codeshareOperatingNumber(), TestVerifyCandidate_connectingLegEndToEnd() (+13 more)

### Community 23 - "TestResult"
Cohesion: 0.19
Nodes (3): ResponseAnalyzer, main(), _print_unreachable_backend_hint()

### Community 25 - "runtime_config.go"
Cohesion: 0.22
Nodes (16): adminAccessConfigured(), configRangeError, adminTokenConfigured(), defaultRuntimeConfig(), errConfigOutOfRange(), getRuntimeConfig(), handleAdminRuntimeConfig(), initRuntimeConfigStore() (+8 more)

### Community 26 - "booking_gf2_resolve.go"
Cohesion: 0.08
Nodes (39): allocateLegQuoteAmount(), applySearchQuoteToOffer(), attachQuotedPriceMeta(), dedupeGF2PartnerOffers(), flightLegDurationMinutes(), gf2OffersHavePrice(), gf2PartnerOfferFromQuoteURL(), gf2PartnerOfferFromResolved() (+31 more)

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.30
Nodes (10): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+2 more)

### Community 29 - "RuntimeConfigContext.tsx"
Cohesion: 0.18
Nodes (15): apiRequest(), adminAuthHeaders(), fetchAdminRuntimeConfig(), fetchRuntimeConfig(), saveAdminRuntimeConfig(), setRuntimeConfigStore(), RuntimeConfigContext, RuntimeConfigContextValue (+7 more)

### Community 30 - "CanonicalItinerary"
Cohesion: 0.11
Nodes (25): corpusText(), domainFromURL(), elapsedMs(), logMatchEvent(), countVerifiedPricedOffers(), MatchItinerary(), NewResolver(), truncateStr() (+17 more)

### Community 31 - "DateRangePicker.tsx"
Cohesion: 0.22
Nodes (16): useRuntimeConfig(), buildMonthDays(), DateRangePicker(), DateRangePickerProps, getMonthStart(), monthStartForYmd(), parseYmdUtc(), styles (+8 more)

### Community 32 - "itinerary.go"
Cohesion: 0.10
Nodes (48): extractFlightNumbers(), flightNumberInText(), flightNumbersEquivalent(), splitFlightDesignator(), textContainsAirport(), textContainsAny(), timeMatches(), TestFlightNumbersEquivalent_leadingZeros() (+40 more)

### Community 33 - "budget_config_test.go"
Cohesion: 0.25
Nodes (11): gf2MetroKey(), GF2SearchAirports(), limitGF2SearchAirports(), ResolveGF2PlaceCode(), containsAll(), TestGF2SearchAirports_CityOnlyCode(), TestGF2SearchAirports_LondonParis(), TestGF2SearchAirports_SingleAirport() (+3 more)

### Community 34 - "explore_cache.go"
Cohesion: 0.10
Nodes (20): airportCoord, exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut(), getAirportCoord() (+12 more)

### Community 36 - "Backend QA Automation Tool"
Cohesion: 0.18
Nodes (10): Backend QA Automation Tool, Features, If the run feels slow or “stuck”, Notes, Optional AI Setup (Ollama), Output, Project Structure, Run (+2 more)

### Community 37 - "SearchFormScreen.tsx"
Cohesion: 0.14
Nodes (23): App(), linking, RTLWrapper(), RootNavigator(), ThemeProvider(), isDeepLinkDebugEnabled(), logDeepLinkDiagnostics(), mergeDeepLinkParams() (+15 more)

### Community 38 - "affiliate.go"
Cohesion: 0.16
Nodes (19): BuildLegAirlineDirectURL(), BuildRedirectURL(), getAffiliateID(), GetClicksSummary(), getOTAProvider(), GetSessionAndOption(), ParseOptionIndex(), RecordClick() (+11 more)

### Community 39 - "search.ts"
Cohesion: 0.17
Nodes (24): CachedResult, createSearchSession(), createSearchSessionWithRetry(), ensureLegacyPurge(), fetchFresh(), getFromStorage(), getSearchSessionResults(), getStorage() (+16 more)

### Community 40 - "skyscanner.ts"
Cohesion: 0.42
Nodes (10): BookingHop, bookingHopsFromOption(), firstSeg(), isClassicRoundTripLegs(), isoDatePrefix(), isSplitBookingItinerary(), lastSeg(), legNeedsSegmentSplit() (+2 more)

### Community 42 - "ExploreScreen.tsx"
Cohesion: 0.08
Nodes (62): GetDealsRangeParams, getMonthDeals(), GetMonthDealsParams, getExploreDestinations(), AIRPORT_ONLY_DICTIONARY, FULL_PLACE_DICTIONARY, getAirportDisplayName(), getAirportEntry() (+54 more)

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "destinationMood.test.ts"
Cohesion: 0.12
Nodes (11): __dirname, dist, indexHtml, indexPath, SPA_ROUTES, byCity, curatedCities, curatedUrls (+3 more)

### Community 45 - "auth.go"
Cohesion: 0.17
Nodes (23): authUserJSON(), bootstrapAdminUser(), createAuthSession(), envFlagTrue(), handleAuthLogin(), handleAuthRegister(), handleAuthUsers(), initAuthStore() (+15 more)

### Community 46 - "test_cases"
Cohesion: 0.05
Nodes (40): departureDate, origin, byProvider, currency, error, from, items, route (+32 more)

### Community 47 - "FlightDetailsModal.tsx"
Cohesion: 0.18
Nodes (20): getAirportNameByCode(), airportTimeZones, getAirportTimeZone(), cabinLabel(), FlightDetailsModal(), formatDuration(), layoverBetween(), legDuration() (+12 more)

### Community 53 - "session_store.go"
Cohesion: 0.17
Nodes (22): SearchSessionResultsResponse, loadSearchSession(), TestLoadSearchSession_Expiry(), sanitizeSessionForClient(), searchSessionTTL(), startSearchSessionCleanup(), cleanupPersistedSessions(), importLegacyJSONSessions() (+14 more)

### Community 54 - "Nginx Proxy Manager — fly-fix TLS checklist"
Cohesion: 0.40
Nodes (4): Nginx Proxy Manager — fly-fix TLS checklist, Reissue frontend cert (both names), Required proxy-host settings, Symptoms Chrome shows

### Community 55 - "api.ts"
Cohesion: 0.12
Nodes (18): FlightDetailsModalProps, FlightResultCardProps, PositioningLegResult, SearchState, AirportCityType, AirportLike, BaggageClass, Carrier (+10 more)

### Community 56 - "BookingOffer"
Cohesion: 0.14
Nodes (35): airlineDomainForCarrier(), bookingMatchPriceNormalizer(), isAffiliateTemplateBookingURL(), marketingCarrierForLegIndex(), normalizedGF2OfferPrice(), offersIncludeAirlineDirect(), preferAirlineDirectWhenCheaperThanMarkedUpOTA(), publicAlternativesFromOffers() (+27 more)

### Community 58 - "AppIcon"
Cohesion: 0.12
Nodes (35): AppIcon(), AppIconLibrary, AppIconProps, styles, collectTripDestinationCodes(), DestinationMoodBanner(), DestinationMoodStrip(), stripStyles (+27 more)

### Community 59 - "steps"
Cohesion: 0.09
Nodes (22): runs-on, steps, jobs, deploy, name, on, push, workflow_dispatch (+14 more)

### Community 60 - "flyfix-api"
Cohesion: 0.06
Nodes (35): context, FLIGHT_SCRAPER_URL, PLAYWRIGHT_HEADLESS, PORT, SCRAPER_CDP_URLS, SCRAPER_PROXY_URL, build, container_name (+27 more)

### Community 61 - "ProviderResult"
Cohesion: 0.08
Nodes (25): DedupeProviderResults(), ItineraryFingerprint(), mergeSelfTransfer(), TotalStops(), uniqueStrings(), providerResultArrivalAirport(), TestProviderResultArrivalAirport(), BuildCanonicalItinerary() (+17 more)

### Community 62 - "client.ts"
Cohesion: 0.15
Nodes (13): searchAirports(), API_BASE, apiGet(), apiUrl(), isLocalHostname(), resolveApiBase(), ExploreResponse, GetExploreDestinationsParams (+5 more)

### Community 63 - "FlightResultCard.tsx"
Cohesion: 0.25
Nodes (15): buildRoutePath(), c, FlightResultCard(), LegScheduleBlock(), FlightSegment, LayoverSummary, hasMultipleAirlines(), buildLegPreviewSummary() (+7 more)

### Community 64 - "ErrorBoundary"
Cohesion: 0.15
Nodes (4): ErrorBoundary, Props, s, State

### Community 65 - "npm"
Cohesion: 0.17
Nodes (11): networks, proxy, container_name, image, networks, ports, restart, volumes (+3 more)

### Community 66 - "skyscanner.js"
Cohesion: 0.22
Nodes (18): com, fr, req, segment(), gotoAndSettle(), skyscannerDate(), ensureDatedResultsUrl(), extractSkyscanner() (+10 more)

### Community 67 - "kiwi.js"
Cohesion: 0.19
Nodes (18): offerTemplate(), extractFromCaptured(), extractNextData(), flattenOffers(), kiwiSearchUrl(), mapRouteSeg(), pickNumber(), pickSegments() (+10 more)

### Community 68 - "testing.T"
Cohesion: 0.05
Nodes (63): TestIsAffiliateTemplateBookingURL(), floatPtr(), TestSelectBestOffer_cheapestOTAOverAirline(), TestSelectBestOffer_conflictingCandidatesPicksCheapest(), TestSelectBestOffer_missingPrice(), TestSelectBestOffer_multipleMatching(), TestSelectBestOffer_prefersPriceAmongSameURLType(), TestSelectBestOffer_prefersQuoteMatchingPrice() (+55 more)

### Community 69 - "nginx-proxy-manager (VPS edge)"
Cohesion: 0.40
Nodes (4): Deploy sync, First-time / recovery, nginx-proxy-manager (VPS edge), On the server

### Community 71 - "AuthContext.tsx"
Cohesion: 0.17
Nodes (24): authHeaders(), AuthUser, changePassword(), createUser(), deleteUser(), fetchAuthMe(), fetchUsers(), LoginResponse (+16 more)

### Community 72 - "Registry"
Cohesion: 0.15
Nodes (10): TestRegistryFailureMessage_transientOutbound(), TestRegistrySearchAll_openJawGF2FailNotMaskedByKiwiSkip(), TestRegistrySearchAllPartialFailure(), ProviderSearchStats, isPrimaryProvider(), isSkippedProviderErr(), IsTransientSearchErrMsg(), MultiSearchResult (+2 more)

### Community 73 - "providers.go"
Cohesion: 0.11
Nodes (25): TestCombineOneWayBatches(), TestCombineOneWayBatches_emptyBatch(), TestCombineOneWayBatches_openJawReturnDiversity(), cheapestReturnLeg(), TestCheapestReturnLeg(), TestAttachCanonicalIdentityAll_combineOneWay(), asArray(), collectCarriers() (+17 more)

### Community 74 - "session.js"
Cohesion: 0.25
Nodes (11): pageLooksBlocked(), browserPromises, { chromium, firefox }, getBrowser(), runWithRetries(), warmHomepage(), withPage(), withPageViaCdp() (+3 more)

### Community 75 - "time.Time"
Cohesion: 0.14
Nodes (15): FullRoundTrip, attachReturnLegKeepPrice(), ensureRoundTripLegs(), gf2ExploreSearchOneDestination(), gf2OneRoundTrip(), gf2SearchDealsOnDates(), gf2SearchDealsRange(), gf2SearchMonthDeals() (+7 more)

### Community 76 - "flyfix.ts"
Cohesion: 0.25
Nodes (8): apiPost(), FlyfixInsightsGroup, FlyfixIssue, FlyfixRefinedReport, FlyfixSummary, refineIssues(), RefineIssuesRequestBody, cancelSearchSession()

### Community 77 - "exchangeRates.ts"
Cohesion: 0.23
Nodes (10): DisplayPrice(), DisplayPriceProps, useExchangeRates(), convertPrice(), CURRENCY_SYMBOLS, CurrencyCode, ensureRates(), fetchRates() (+2 more)

### Community 78 - "affiliate.ts"
Cohesion: 0.27
Nodes (9): AffiliateProvider, AffiliateProviderResponse, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink(), OutboundLinkResponse (+1 more)

### Community 79 - "destinationMood.ts"
Cohesion: 0.18
Nodes (10): AIRPORT_DICTIONARY, ASSIGNED_URLS, BY_CODE, BY_COUNTRY, DestinationMood, FALLBACK_IMAGE, hashCode(), LANDING_MOOD_DESTINATIONS (+2 more)

### Community 80 - ".buildCacheKey"
Cohesion: 0.24
Nodes (9): classicRoundTripMissingReturn(), TestClassicRoundTripMissingReturn(), TestDoSearchWithRetry_doesNotCacheRoundTrip(), TestSearch_ignoresIncompleteClassicRTCache(), TestSearch_servesCompleteClassicRTCache(), newGF2Cache(), TestSearchLegCached_usesCache(), gf2Cache (+1 more)

### Community 81 - "resolveAirlineLabel"
Cohesion: 0.38
Nodes (7): AIRLINE_NAMES, getAirlineName(), resolveAirlineLabel(), AIRLINE_FULL_NAMES, displayAirlineLabel(), labelForCarrierCode(), providerNameForCode()

### Community 82 - "net/http.Request"
Cohesion: 0.22
Nodes (23): bearerTokenFromRequest(), handleAuthChangePassword(), handleAuthLogout(), handleAuthMe(), isAdminRequest(), requireAdminUser(), userFromRequest(), exploreSessionKey() (+15 more)

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
Cohesion: 0.15
Nodes (22): init(), budgetCfg(), BudgetModeEnabled(), durationFromEnvMin(), envTruthy(), ExploreBudgetLimits(), FilterProviderNamesForBudget(), GF2EffectiveCacheTTL() (+14 more)

### Community 88 - "expedia.js"
Cohesion: 0.26
Nodes (5): scrapeAll(), SITE_FNS, expediaUrl(), scrapeExpedia(), attachJsonCapture()

### Community 89 - "LocaleContext.tsx"
Cohesion: 0.18
Nodes (17): getStorage(), languageToLocale(), loadSaved(), LocaleContext, LocaleContextValue, LocaleProvider(), save(), VALID_CURRENCIES (+9 more)

### Community 92 - "ValidateBookingURL"
Cohesion: 0.22
Nodes (13): gf2CheckoutOffers(), classifyURLType(), TestClassifyURLType_genericVsExact(), IsCheckoutBookingURL(), IsNonBookableDomain(), TestIsCheckoutBookingURL_rejectsFlightSearchPages(), TestIsNonBookableDomain_blocksFlightRadar(), TestValidateBookingURL_acceptsHTTPS() (+5 more)

### Community 93 - "warm.js"
Cohesion: 0.15
Nodes (10): DEFAULT_SITES, app, express, mergeConfig(), { chromium }, lastWarm, startWarmLoop(), WARM_URLS (+2 more)

### Community 94 - "booking.ts"
Cohesion: 0.36
Nodes (8): BookingResolveRequest, BookingResolveStatus, bookingRetryDelayMs(), fetchBookingResolveOnce(), isTransientBookingFetchError(), isTransientBookingResolveResponse(), PublicBookingAlternative, resolveBookingOffer()

### Community 95 - "budget_config_test.go"
Cohesion: 0.39
Nodes (7): resetBudgetEnv(), TestExploreBudgetLimits_budget(), TestExploreBudgetLimits_defaultsWithoutBudget(), TestFilterProviderNamesForBudget_disablesKiwi(), TestGF2SearchAirports_budgetCapsMetro(), TestSanitizeProviderErrorForUser(), SanitizeProviderErrorForUser()

### Community 96 - "DatePickerCalendar.tsx"
Cohesion: 0.39
Nodes (7): getDealsRange(), DatePickerCalendar(), DatePickerCalendarProps, getNext14Dates(), getRangeStartEnd(), styles, WEEKDAYS

### Community 97 - "CompleteExtraLegs"
Cohesion: 0.47
Nodes (6): TestCompleteExtraLegs(), TestExtraLegsFingerprint(), CompleteExtraLegs(), ExtraLegsFingerprint(), NormalizeExtraLegs(), ExtraLeg

### Community 98 - "selectBookingOptionForQuote"
Cohesion: 0.40
Nodes (5): hostFromURL(), selectBookingOptionForQuote(), TestSelectBookingOptionForQuote_fallsBackWhenQuotePriceMismatch(), TestSelectBookingOptionForQuote_prefersDeepLinkHost(), TestSelectBookingOptionForQuote_prefersPriceMatch()

### Community 101 - "ensure-flight-chrome.sh"
Cohesion: 0.70
Nodes (4): DISPLAY, ensure_gateway_proxy(), log(), ensure-flight-chrome.sh script

### Community 102 - "booking_resolve.go"
Cohesion: 0.10
Nodes (14): bookingResolveMaxConcurrentFromEnv(), cacheTTLForStatus(), envDurationMinutes(), init(), TestCacheTTLForStatus_doesNotCacheMisses(), webBookingMatchEnabled(), BookingResolveRequest, exploreLiveCandidate (+6 more)

### Community 105 - "SearchFormScreen.tsx"
Cohesion: 0.10
Nodes (33): SearchLoadingOverlay(), defaultParams, SearchFormScreen(), styles, LandingScreen(), Nav, styles, Breakpoint (+25 more)

### Community 108 - "server_carrier_test.go"
Cohesion: 0.83
Nodes (3): makeOfferWithCarriers(), TestExtractCarrierCodes(), TestPrimaryDisplayCarrier()

### Community 109 - "CalendarModal.tsx"
Cohesion: 0.38
Nodes (6): buildMonthDays(), CalendarModal(), getMonthStart(), Props, styles, WEEKDAYS

### Community 112 - "time.Time"
Cohesion: 0.25
Nodes (7): minutesOfDay(), ClickRecord, getExploreSession(), putExploreSession(), exploreSession, SearchSession, SearchSessionStatus

## Knowledge Gaps
- **3 isolated node(s):** `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 556 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Fly-Fix` connect `Features` to `MonthDealsScreen.tsx`, `ProviderResult`?**
  _High betweenness centrality (0.365) - this node is a cross-community bridge._
- **What connects `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `.ResolveQuotedPartnerBooking` be split into smaller, more focused modules?**
  _Cohesion score 0.12162162162162163 - nodes in this community are weakly interconnected._
- **Why does `Multi-provider flight search` connect `ProviderResult` to `Features`, `booking_resolve.go`?**
  _High betweenness centrality (0.355) - this node is a cross-community bridge._
- **Should `SearchFormScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11384615384615385 - nodes in this community are weakly interconnected._
- **Why does `Recent enhancements` connect `MonthDealsScreen.tsx` to `Features`, `AppIcon`?**
  _High betweenness centrality (0.345) - this node is a cross-community bridge._
- **Should `ResultsScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09393939393939393 - nodes in this community are weakly interconnected._