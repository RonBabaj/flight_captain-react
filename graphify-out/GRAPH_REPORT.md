# Graph Report - workspace  (2026-11-13)

## Corpus Check
- 304 files · ~255,954 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 16 file(s) not represented in the graph (top: (none) 8, .example 2, .conf 2)

## Summary
- 2541 nodes · 8230 edges · 103 communities (85 shown, 18 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 694 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d512e19f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- .ResolveQuotedPartnerBooking
- destinationMood.test.ts
- useTheme
- Issue
- ExploreScreen.tsx
- session_store.go
- frontend/package.json
- AccountScreen.tsx
- Features
- FlightOption
- flight-scraper/package.json
- resolveGF2PartnerOffers
- BookingOptionsFooter.tsx
- compilerOptions
- googleflights2_provider.go
- canonical_booking_test.go
- MonthDealsScreen.tsx
- SearchSubmitButton.tsx
- sharedLinkCache.ts
- server.go
- qa_runner.py
- ApiClient
- testing.T
- TestResult
- ResponseValidator
- runtime_config.go
- ProviderResult
- expo
- config_loader.py
- auth.go
- searcher.go
- auth.go
- runBookingMatch
- LocaleContext.tsx
- explore_cache.go
- ValidationIssue
- Backend QA Automation Tool
- test-roundtrip-legs.js
- BookingOffer
- search.ts
- resolveOTAPartnerOffers
- models.py
- placeSearch.ts
- Fly-Fix – Frontend
- time.Duration
- BuildLegAirlineDirectURL
- test_cases
- react
- gen_explore_airport_coords.py
- flightcaptainweb
- SearchRequest
- Nginx Proxy Manager — fly-fix TLS checklist
- booking.ts
- FlightDetailsModal.tsx
- .finalize
- FlightResultCard.tsx
- steps
- flyfix-api
- ThemeContext.tsx
- ResultsScreen.tsx
- client.ts
- types/index.ts
- npm
- skyscanner.js
- kiwi.js
- skyscanner.js
- nginx-proxy-manager (VPS edge)
- DateRangePicker.tsx
- AuthContext.tsx
- .SearchAll
- exchangeRates.ts
- warm.js
- api.ts
- AirportLocation
- AppIcon.tsx
- react-native
- destinationMood.ts
- server_carrier_test.go
- handleExplore
- session.js
- Fly-Fix UI / UX
- TestApplySoftStrictBaggage
- backend_api_contracts.md
- ensure-edge-proxy.sh
- GF2SearchAirports
- expedia.js
- FlightOption
- install-edge-proxy-cron.sh
- sync-edge-stack.sh
- time.Time
- DateRangePicker.tsx
- scripts
- FiltersPanel.tsx
- GetClicksSummary
- SelectBestOffer
- ensure-flight-chrome.sh
- skyscanner.ts
- docker-entrypoint.sh

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 106 edges
2. `useLocale()` - 94 edges
3. `react` - 73 edges
4. `react-native` - 66 edges
5. `ProviderResult` - 58 edges
6. `ResultsScreen()` - 57 edges
7. `AppIcon()` - 56 edges
8. `MonthDealsScreen()` - 48 edges
9. `runBookingMatch()` - 42 edges
10. `BookingOffer` - 41 edges

## Surprising Connections (you probably didn't know these)
- `Search form` --references--> `DestinationMoodBanner()`  [INFERRED]
  .cursor/skills/flyfix-ui-ux/SKILL.md → frontend/src/components/DestinationMoodBanner.tsx
- `Cheaper departure cities (positioning optimizer)` --references--> `CheaperCitiesSection()`  [INFERRED]
  README.md → frontend/src/features/flight-search/components/CheaperCitiesSection.tsx
- `Results` --references--> `SortBar()`  [INFERRED]
  .cursor/skills/flyfix-ui-ux/SKILL.md → frontend/src/features/flight-search/components/SortBar.tsx
- `Recent enhancements` --references--> `AppIcon()`  [INFERRED]
  README.md → frontend/src/components/AppIcon.tsx
- `Recent enhancements` --references--> `CheaperCitiesSection()`  [INFERRED]
  README.md → frontend/src/features/flight-search/components/CheaperCitiesSection.tsx

## Import Cycles
- None detected.

## Communities (103 total, 18 thin omitted)

### Community 0 - ".ResolveQuotedPartnerBooking"
Cohesion: 0.11
Nodes (23): applySearchQuoteToOffer(), optionVendorFromQuote(), resolveAllPartnerBookingsFromTokenWithRetry(), findBookingOptionsArray(), firstPartnerBookingOption(), firstPartnerURLInMap(), firstStringByKeys(), QuoteBinding (+15 more)

### Community 1 - "destinationMood.test.ts"
Cohesion: 0.11
Nodes (14): __dirname, dist, indexHtml, indexPath, SPA_ROUTES, byCity, compact, curatedCities (+6 more)

### Community 2 - "useTheme"
Cohesion: 0.11
Nodes (47): AppIcon(), ClearableTextInput(), ClearableTextInputProps, styles, DestinationMoodBanner(), DestinationMoodStrip(), moodSizeForVariant(), stripStyles (+39 more)

### Community 3 - "Issue"
Cohesion: 0.11
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "ExploreScreen.tsx"
Cohesion: 0.12
Nodes (38): getMonthDeals(), getExploreDestinations(), getAirportEntry(), getCityDisplayName(), resolveDestinationMood(), c, countryFlag(), d (+30 more)

### Community 5 - "session_store.go"
Cohesion: 0.13
Nodes (29): ProviderSearchStats, SearchProgress, SearchSession, SearchSessionResultsResponse, SearchSessionStatus, loadSearchSession(), markSessionFailed(), publishSearchProgress() (+21 more)

### Community 6 - "frontend/package.json"
Cohesion: 0.07
Nodes (34): config, { getDefaultConfig }, dependencies, expo@~52.0.0, @expo/metro-runtime@~4.0.1, expo-status-bar@~2.0.0, react@18.3.1, react-dom@18.3.1 (+26 more)

### Community 7 - "AccountScreen.tsx"
Cohesion: 0.14
Nodes (19): AccountScreen(), styles, AdminHubScreen(), styles, AdminRuntimeConfigScreen(), styles, ChangePasswordForm(), IconName (+11 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (32): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+24 more)

### Community 9 - "FlightOption"
Cohesion: 0.07
Nodes (42): CanonicalFingerprint(), CodeshareFingerprint(), roundTimeToMinutes(), TestProviderResultsToFlightOptions_PreservesCarrierName(), CreateSearchSessionRequest, ExtraSearchLeg, FlightLeg, FlightOption (+34 more)

### Community 10 - "flight-scraper/package.json"
Cohesion: 0.11
Nodes (17): express, playwright, dependencies, express@^4.21.2, playwright@^1.49.1, description, engines, node (+9 more)

### Community 11 - "resolveGF2PartnerOffers"
Cohesion: 0.13
Nodes (25): allocateLegQuoteAmount(), attachQuotedPriceMeta(), bookingMatchPriceNormalizer(), flightLegDurationMinutes(), gf2OffersHavePrice(), legBookingToken(), legDeepLink(), legPartnerArraysAligned() (+17 more)

### Community 12 - "BookingOptionsFooter.tsx"
Cohesion: 0.15
Nodes (31): BookingResolveResponse, isSafeBookingUrl(), PublicBookingOffer, bookingOfferProviderLabel(), bookingOfferSubtitle(), formatBookingOfferPriceAmount(), formatBookingOfferPriceLine(), formatProviderDisplayName() (+23 more)

### Community 13 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 14 - "googleflights2_provider.go"
Cohesion: 0.15
Nodes (35): TestExtractGF2BookingURL(), TestExtractGF2PartnerBookingTokenPrefersPartnerURL(), buildGF2ResultFromItinerary(), extractGF2BookingToken(), extractGF2BookingURL(), extractGF2DurationMinutes(), extractGF2Flight(), extractGF2Itineraries() (+27 more)

### Community 15 - "canonical_booking_test.go"
Cohesion: 0.12
Nodes (28): openJawOption(), TestBookingLinkModeDefaultsToSkyscanner(), TestBookingRouteFromSessionOption_splitOmitsReturn(), TestBuildGoogleFlightsFallbackFromParams(), TestBuildLegOrSegmentBookingURL_segment(), TestBuildOneWayLegBookingURL(), TestBuildSkyscannerPrefillURL_oneWay(), TestBuildSkyscannerPrefillURL_roundTrip() (+20 more)

### Community 16 - "MonthDealsScreen.tsx"
Cohesion: 0.08
Nodes (49): CheaperCitiesOption, CheaperCitiesSection(), Props, s, SortBar(), buildDealsPositioningSignature(), dealBestScore(), fl (+41 more)

### Community 17 - "SearchSubmitButton.tsx"
Cohesion: 0.25
Nodes (11): getAlmostDonePhrase(), getPhrasesForLanguage(), SEARCH_ALMOST_DONE, SEARCH_BUTTON_ALMOST_DONE, SEARCH_BUTTON_PHRASES, SEARCH_PROGRESS_PHRASES, SearchSubmitButtonProps, ExtraLeg (+3 more)

### Community 18 - "sharedLinkCache.ts"
Cohesion: 0.12
Nodes (30): buildSearchString(), getParam(), getParams(), isWeb(), parseSearchParamsFromUrl(), SearchUrlState, updateSearchUrl(), useSearchParams() (+22 more)

### Community 19 - "server.go"
Cohesion: 0.07
Nodes (88): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, TestLookupAirlineIATA_Israir(), bookingResolveMaxConcurrentFromEnv(), envDurationMinutes(), init() (+80 more)

### Community 22 - "testing.T"
Cohesion: 0.05
Nodes (73): TestAttachQuotedPriceMeta_detectsMismatch(), TestLegDeepLink_rejectsMisalignedPartnerArrays(), TestLegDeepLink_rejectsWrongAirlineDirectCheckout(), TestQuoteBindingFromOption_usesOriginalWhenEstimate(), TestQuoteBindingFromOption_usesStoredLegPrice(), TestResolveGF2PartnerOffer_skipsSkyscannerDeepLink(), TestResolveGF2PartnerOffer_usesPersistedLegDeepLinkWithoutProvider(), TestSearchRequestFromSession_singleLegOverride() (+65 more)

### Community 23 - "TestResult"
Cohesion: 0.19
Nodes (3): ResponseAnalyzer, main(), _print_unreachable_backend_hint()

### Community 25 - "runtime_config.go"
Cohesion: 0.17
Nodes (20): adminAccessConfigured(), isAdminRequest(), configRangeError, adminTokenConfigured(), adminTokenFromHeader(), defaultRuntimeConfig(), errConfigOutOfRange(), getRuntimeConfig() (+12 more)

### Community 26 - "ProviderResult"
Cohesion: 0.06
Nodes (50): TestResolveOTAPartnerOffers_usesExistingCheckoutDeepLink(), DedupeProviderResults(), ItineraryFingerprint(), mergeSelfTransfer(), TotalStops(), uniqueStrings(), TestCombineOneWayBatches(), TestCombineOneWayBatches_emptyBatch() (+42 more)

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.30
Nodes (10): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+2 more)

### Community 29 - "auth.go"
Cohesion: 0.16
Nodes (27): authUserJSON(), bootstrapAdminUser(), createAuthSession(), envFlagTrue(), handleAuthLogin(), handleAuthRegister(), handleAuthUsers(), initAuthStore() (+19 more)

### Community 30 - "searcher.go"
Cohesion: 0.08
Nodes (30): defaultBookingMatchRunner(), corpusText(), domainFromURL(), elapsedMs(), logMatchEvent(), countVerifiedPricedOffers(), MatchItinerary(), NewResolver() (+22 more)

### Community 31 - "auth.go"
Cohesion: 0.13
Nodes (34): getOTAProvider(), GetSessionAndOption(), ParseOptionIndex(), RecordClick(), ResolveProvider(), bearerTokenFromRequest(), handleAuthChangePassword(), handleAuthLogout() (+26 more)

### Community 32 - "runBookingMatch"
Cohesion: 0.07
Nodes (50): isTransientGF2BookingErr(), TestRunBookingMatch_kiwiMixedCarriersNoAustrianDeeplink(), TestRunBookingMatch_kiwiWizzSellerPrimaryWithAirlineSecondary(), TestRunBookingMatch_prodShapeKiwiIsrairGetsAirlinePrefill(), TestRunBookingMatch_mergesOTAPartners(), acquireBookingResolveSlot(), beginInflightResolve(), bookingResolveCacheKey() (+42 more)

### Community 33 - "LocaleContext.tsx"
Cohesion: 0.15
Nodes (19): DisplayPrice(), DisplayPriceProps, getStorage(), languageToLocale(), loadSaved(), LocaleContext, LocaleContextValue, LocaleProvider() (+11 more)

### Community 34 - "explore_cache.go"
Cohesion: 0.09
Nodes (21): airportCoord, exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut(), getAirportCoord() (+13 more)

### Community 36 - "Backend QA Automation Tool"
Cohesion: 0.18
Nodes (10): Backend QA Automation Tool, Features, If the run feels slow or “stuck”, Notes, Optional AI Setup (Ollama), Output, Project Structure, Run (+2 more)

### Community 37 - "test-roundtrip-legs.js"
Cohesion: 0.12
Nodes (20): a, arr, assert, b, dep, late, assert, frSegs (+12 more)

### Community 38 - "BookingOffer"
Cohesion: 0.17
Nodes (30): airlineDomainForCarrier(), marketingCarrierForLegIndex(), normalizedGF2OfferPrice(), offersIncludeAirlineDirect(), preferAirlineDirectWhenCheaperThanMarkedUpOTA(), publicAlternativesFromOffers(), bookingOfferInGF2Sources(), bookingOfferSameURL() (+22 more)

### Community 39 - "search.ts"
Cohesion: 0.13
Nodes (28): CachedResult, createSearchSession(), createSearchSessionWithRetry(), ensureLegacyPurge(), fetchFresh(), getFromStorage(), getSearchSessionResults(), getStorage() (+20 more)

### Community 40 - "resolveOTAPartnerOffers"
Cohesion: 0.08
Nodes (24): dedupeGF2PartnerOffers(), gf2PartnerOfferFromQuoteURL(), gf2PartnerOfferFromResolved(), gf2PartnerOfferFromURL(), TestGF2PartnerOfferFromURL_acceptsHTTPS(), TestGF2PartnerOfferFromURL_metaSearchIsNotVerifiedCheckout(), TestGF2PartnerOfferFromURL_rejectsUnsafe(), flightSegmentToOtaMap() (+16 more)

### Community 42 - "placeSearch.ts"
Cohesion: 0.14
Nodes (28): AIRPORT_ONLY_DICTIONARY, FULL_PLACE_DICTIONARY, getAirportDisplayName(), getAirportNameByCode(), lower(), matchesQuery(), PLACE_SEARCH_LIMIT, rankResult() (+20 more)

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "time.Duration"
Cohesion: 0.05
Nodes (43): init(), budgetCfg(), BudgetModeEnabled(), durationFromEnvMin(), envTruthy(), ExploreBudgetLimits(), FilterProviderNamesForBudget(), GF2EffectiveCacheTTL() (+35 more)

### Community 45 - "BuildLegAirlineDirectURL"
Cohesion: 0.17
Nodes (12): BuildLegAirlineDirectURL(), BuildRedirectURL(), getAffiliateID(), TestBuildLegAirlineDirectURL_austrianHasNoUnverifiedLink(), stripEmptyQueryParams(), TestBuildLegAirlineDirectURL_wizzPathNotHash(), TestBuildLegAirlineDirectURL_wizzRoundTripReturnDate(), isAffiliateTemplateBookingURL() (+4 more)

### Community 46 - "test_cases"
Cohesion: 0.05
Nodes (40): departureDate, origin, byProvider, currency, error, from, items, route (+32 more)

### Community 47 - "react"
Cohesion: 0.05
Nodes (54): react-native-safe-area-context@4.12.0, ErrorBoundary, Props, s, State, Nav, SiteFooter(), styles (+46 more)

### Community 53 - "SearchRequest"
Cohesion: 0.08
Nodes (30): TestCompleteExtraLegs(), TestExtraLegsFingerprint(), truncateStr(), TestIsOpenJaw(), TestResolveReturnAirports_classic(), TestResolveReturnAirports_openJaw(), TestSanitizeStandardSearchRequest(), TestDynamicDestinationOneWayRequests_extraLegs() (+22 more)

### Community 54 - "Nginx Proxy Manager — fly-fix TLS checklist"
Cohesion: 0.40
Nodes (4): Nginx Proxy Manager — fly-fix TLS checklist, Reissue frontend cert (both names), Required proxy-host settings, Symptoms Chrome shows

### Community 55 - "booking.ts"
Cohesion: 0.36
Nodes (8): BookingResolveRequest, BookingResolveStatus, bookingRetryDelayMs(), fetchBookingResolveOnce(), isTransientBookingFetchError(), isTransientBookingResolveResponse(), PublicBookingAlternative, resolveBookingOffer()

### Community 56 - "FlightDetailsModal.tsx"
Cohesion: 0.19
Nodes (19): airportTimeZones, getAirportTimeZone(), cabinLabel(), FlightDetailsModal(), formatDuration(), layoverBetween(), legDuration(), s (+11 more)

### Community 58 - "FlightResultCard.tsx"
Cohesion: 0.24
Nodes (15): buildRoutePath(), c, FlightResultCard(), LegScheduleBlock(), FlightSegment, LayoverSummary, buildLegPreviewSummary(), computeLayovers() (+7 more)

### Community 59 - "steps"
Cohesion: 0.09
Nodes (22): runs-on, steps, jobs, deploy, name, on, push, workflow_dispatch (+14 more)

### Community 60 - "flyfix-api"
Cohesion: 0.06
Nodes (37): context, FLIGHT_SCRAPER_MAX_CONCURRENT, FLIGHT_SCRAPER_URL, PLAYWRIGHT_HEADLESS, PORT, SCRAPER_CDP_URLS, SCRAPER_PROXY_URL, SCRAPER_WARM_ON_START (+29 more)

### Community 61 - "ThemeContext.tsx"
Cohesion: 0.10
Nodes (24): App(), linking, RTLWrapper(), KEYS, s, SortBarProps, SortOption, RootNavigator() (+16 more)

### Community 62 - "ResultsScreen.tsx"
Cohesion: 0.13
Nodes (27): collectTripDestinationCodes(), defaultParams, DynamicDestinationsScreen(), Nav, styles, Bone(), ResultsSkeletonCard(), ResultsSkeletonList() (+19 more)

### Community 63 - "client.ts"
Cohesion: 0.11
Nodes (19): AffiliateProvider, AffiliateProviderResponse, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink(), OutboundLinkResponse (+11 more)

### Community 64 - "types/index.ts"
Cohesion: 0.08
Nodes (28): searchAirports(), apiGet(), getDealsRange(), GetDealsRangeParams, GetMonthDealsParams, ExploreResponse, GetExploreDestinationsParams, getFlightDetails() (+20 more)

### Community 65 - "npm"
Cohesion: 0.17
Nodes (11): networks, proxy, container_name, image, networks, ports, restart, volumes (+3 more)

### Community 66 - "skyscanner.js"
Cohesion: 0.20
Nodes (19): kiwiSearchUrl(), addPartner(), clickMatchingKiwiCard(), clickMatchingSkyscannerCard(), clocksFromSegments(), collectPartnerMap(), extractPartnersFromDom(), hmFromIso() (+11 more)

### Community 67 - "kiwi.js"
Cohesion: 0.16
Nodes (22): offerTemplate(), clearKiwiSpaState(), ensureKiwiResultsUrl(), extractFromCaptured(), extractNextData(), flattenOffers(), kiwiPathLooksCorrect(), mapRouteSeg() (+14 more)

### Community 68 - "skyscanner.js"
Cohesion: 0.19
Nodes (18): com, fr, req, waitUntil(), parseRoundTripHm(), skyscannerDate(), ensureDatedResultsUrl(), extractSkyscanner() (+10 more)

### Community 69 - "nginx-proxy-manager (VPS edge)"
Cohesion: 0.40
Nodes (4): Deploy sync, First-time / recovery, nginx-proxy-manager (VPS edge), On the server

### Community 70 - "DateRangePicker.tsx"
Cohesion: 0.15
Nodes (22): apiRequest(), apiUrl(), adminAuthHeaders(), fetchAdminRuntimeConfig(), fetchRuntimeConfig(), saveAdminRuntimeConfig(), setRuntimeConfigStore(), RuntimeConfigContext (+14 more)

### Community 71 - "AuthContext.tsx"
Cohesion: 0.15
Nodes (27): authHeaders(), AuthUser, changePassword(), createUser(), deleteUser(), fetchAuthMe(), fetchUsers(), LoginResponse (+19 more)

### Community 72 - ".SearchAll"
Cohesion: 0.13
Nodes (11): AttachCanonicalIdentityAll(), TestRegistryFailureMessage_transientOutbound(), TestRegistrySearchAll_openJawGF2FailNotMaskedByKiwiSkip(), TestRegistrySearchAllPartialFailure(), TestRegistrySearchAllWithProgress(), isFastProvider(), isSkippedProviderErr(), IsTransientSearchErrMsg() (+3 more)

### Community 73 - "exchangeRates.ts"
Cohesion: 0.29
Nodes (8): useExchangeRates(), convertPrice(), CURRENCY_SYMBOLS, CurrencyCode, ensureRates(), fetchRates(), getDisplayPrice(), ratesToUSD

### Community 74 - "warm.js"
Cohesion: 0.08
Nodes (28): cdpLockBusy(), chain, runWithOpenPage(), DEFAULT_SITES, hasCdp(), runOne(), scrapeAll(), SITE_FNS (+20 more)

### Community 75 - "api.ts"
Cohesion: 0.10
Nodes (25): DynamicDestinationsFormContentProps, PassengerCabinPickerProps, SearchFormContentProps, defaultFilters, isCurrentSearchGeneration(), searchActions, SearchFilters, SearchState (+17 more)

### Community 76 - "AirportLocation"
Cohesion: 0.12
Nodes (18): AirportLocation(), TestAirportLocation_UnknownFallsBackUTC(), TestParseGF2TimeWithDateHint_TelAviv(), TestParseGF2Time_EuropeanDateFormat(), TestExtractGF2Leg_SingleSegment_DepartArriveDiffer(), TestExtractGF2Leg_TimeOnly_WithDateHint(), TestParseGF2Time_AcceptsFullDateTime(), TestParseGF2Time_NumericOffsetIsAbsolute() (+10 more)

### Community 77 - "AppIcon.tsx"
Cohesion: 0.13
Nodes (16): AppIconLibrary, AppIconProps, styles, HubRouteLeg, HubRouteSummaryModalProps, s, getSvgMarkup(), getWebIconSvgDataUri() (+8 more)

### Community 78 - "react-native"
Cohesion: 0.19
Nodes (9): styles, LoginForm(), RegisterForm(), styles, LoginScreen(), styles, RegisterScreen(), styles (+1 more)

### Community 79 - "destinationMood.ts"
Cohesion: 0.15
Nodes (12): AIRPORT_DICTIONARY, AIRPORT_FALLBACK_IMAGE, ASSIGNED_URLS, BY_CODE, BY_COUNTRY, DestinationMood, hashCode(), LANDING_MOOD_DESTINATIONS (+4 more)

### Community 80 - "server_carrier_test.go"
Cohesion: 0.43
Nodes (6): CarrierCodes, makeOfferWithCarriers(), TestExtractCarrierCodes(), TestPrimaryDisplayCarrier(), ExtractCarrierCodes(), PrimaryDisplayCarrier()

### Community 81 - "handleExplore"
Cohesion: 0.24
Nodes (9): exploreSessionKey(), getExploreSession(), newExploreSessionID(), putExploreSession(), startExploreSessionCleanup(), exploreSession, corsMiddleware(), handleExplore() (+1 more)

### Community 82 - "session.js"
Cohesion: 0.23
Nodes (16): pageLooksBlocked(), withCdpLock(), blockHeavyResources(), getOpenPageHook(), browserPromises, { chromium, firefox }, getBrowser(), isTransientScrapeError() (+8 more)

### Community 83 - "Fly-Fix UI / UX"
Cohesion: 0.15
Nodes (12): Avoid (AI-vibe tells), Checklist before shipping UI, Design north star, Fly-Fix UI / UX, Landing, Motion, Prefer, Responsive (+4 more)

### Community 84 - "TestApplySoftStrictBaggage"
Cohesion: 0.52
Nodes (6): applySoftStrictBaggage(), makeOfferWithBags(), makeOfferWithMissingBags(), TestApplySoftStrictBaggage(), TestClassifyOfferBaggage(), classifyOfferBaggage()

### Community 85 - "backend_api_contracts.md"
Cohesion: 0.18
Nodes (10): 1.1 Create Search Session, 1.2 Get Search Session Status & Results, 1. Flight Search Sessions, 2.1 Get Monthly Deals, 2. Monthly Deals API, 3.1 Search Airports & Cities, 3. Airport & City Autocomplete, 4. High-Level Handler Layout (Go) (+2 more)

### Community 87 - "GF2SearchAirports"
Cohesion: 0.18
Nodes (12): GF2MetroMaxAirports(), gf2MetroKey(), GF2SearchAirports(), limitGF2SearchAirports(), ResolveGF2PlaceCode(), containsAll(), TestGF2SearchAirports_CityOnlyCode(), TestGF2SearchAirports_LondonParis() (+4 more)

### Community 88 - "expedia.js"
Cohesion: 0.35
Nodes (4): expediaUrl(), scrapeExpedia(), attachJsonCapture(), gotoAndSettle()

### Community 89 - "FlightOption"
Cohesion: 0.23
Nodes (10): FiltersPanelProps, FlightDetailsModalProps, FlightResultCardProps, PositioningLegResult, FlightOption, countByStopsFilter(), matchesStopsFilter(), maxStopsPerLeg() (+2 more)

### Community 92 - "time.Time"
Cohesion: 0.17
Nodes (16): minutesOfDay(), ClickRecord, FullRoundTrip, attachReturnLegKeepPrice(), ensureRoundTripLegs(), gf2ExploreSearchOneDestination(), gf2OneRoundTrip(), gf2SearchDealsOnDates() (+8 more)

### Community 93 - "DateRangePicker.tsx"
Cohesion: 0.32
Nodes (7): buildMonthDays(), DateRangePickerProps, getMonthStart(), monthStartForYmd(), parseYmdUtc(), styles, WEEKDAYS

### Community 94 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, android, build, ios, start, web

### Community 95 - "FiltersPanel.tsx"
Cohesion: 0.21
Nodes (17): AIRLINE_NAMES, formatAirlineFilterLabel(), getAirlineName(), resolveAirlineLabel(), AIRLINE_FULL_NAMES, f, FiltersPanel(), Chip() (+9 more)

### Community 97 - "SelectBestOffer"
Cohesion: 0.08
Nodes (29): gf2CheckoutOffers(), classifyURLType(), floatPtr(), TestClassifyURLType_genericVsExact(), TestSelectBestOffer_cheapestOTAOverAirline(), TestSelectBestOffer_conflictingCandidatesPicksCheapest(), TestSelectBestOffer_missingPrice(), TestSelectBestOffer_multipleMatching() (+21 more)

### Community 101 - "ensure-flight-chrome.sh"
Cohesion: 0.70
Nodes (4): DISPLAY, ensure_gateway_proxy(), log(), ensure-flight-chrome.sh script

### Community 102 - "skyscanner.ts"
Cohesion: 0.42
Nodes (10): BookingHop, bookingHopsFromOption(), firstSeg(), isClassicRoundTripLegs(), isoDatePrefix(), isSplitBookingItinerary(), lastSeg(), legNeedsSegmentSplit() (+2 more)

## Knowledge Gaps
- **3 isolated node(s):** `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 595 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Fly-Fix` connect `Features` to `time.Duration`?**
  _High betweenness centrality (0.322) - this node is a cross-community bridge._
- **What connects `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `.ResolveQuotedPartnerBooking` be split into smaller, more focused modules?**
  _Cohesion score 0.10522496371552975 - nodes in this community are weakly interconnected._
- **Why does `Multi-provider flight search` connect `time.Duration` to `Features`?**
  _High betweenness centrality (0.313) - this node is a cross-community bridge._
- **Should `destinationMood.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Why does `Recent enhancements` connect `Features` to `MonthDealsScreen.tsx`, `useTheme`?**
  _High betweenness centrality (0.306) - this node is a cross-community bridge._
- **Should `useTheme` be split into smaller, more focused modules?**
  _Cohesion score 0.10753945061367622 - nodes in this community are weakly interconnected._