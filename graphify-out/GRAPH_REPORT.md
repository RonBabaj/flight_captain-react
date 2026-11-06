# Graph Report - workspace  (2026-11-06)

## Corpus Check
- 273 files · ~231,981 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: (none) 8, .example 2, .mdc 1)

## Summary
- 2322 nodes · 7244 edges · 115 communities (95 shown, 20 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 585 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ec375498`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- .ResolveQuotedPartnerBooking
- SearchFormScreen.tsx
- DynamicDestinationsScreen.tsx
- Issue
- ThemeContext.tsx
- dealsCache.ts
- dependencies
- useTheme
- Features
- handleExplore
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
- testing.T
- TestResult
- ResponseValidator
- runtime_config.go
- booking_gf2_resolve.go
- expo
- config_loader.py
- RuntimeConfigContext.tsx
- CanonicalItinerary
- ExploreScreen.tsx
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
- AirportAutocomplete.tsx
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
- FlightOption
- ErrorBoundary
- npm
- skyscanner.js
- kiwi.js
- SelectBestOffer
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
- server_normalize_test.go
- CanonicalItinerary
- net/http.Request
- Fly-Fix UI / UX
- TestApplySoftStrictBaggage
- backend_api_contracts.md
- ensure-edge-proxy.sh
- budget_config.go
- scrape.js
- App.tsx
- install-edge-proxy-cron.sh
- sync-edge-stack.sh
- ValidateBookingURL
- warm-flight-chrome.js
- OtaScraperProvider
- handleCreateSession
- frontend/package.json
- gf2ExploreResolveDeps
- Registry
- searchStore.ts
- DraggableBottomSheet.tsx
- ensure-flight-chrome.sh
- otaScraperSearchResponse
- docker-entrypoint.sh
- session_store.go
- useSearchParams.ts
- parseGF2BookingOptions
- searchRouteUrl.ts
- server_carrier_test.go
- CalendarModal.tsx
- scripts
- check-skyscanner-url.js
- SearchSession
- metro.config.js
- tequila.js

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

## Communities (115 total, 20 thin omitted)

### Community 0 - ".ResolveQuotedPartnerBooking"
Cohesion: 0.22
Nodes (11): firstPartnerBookingOption(), ResolvedPartnerBooking, providerFromURL(), SelectCheapestResolvedPartner(), TestExtractGF2PartnerBookingTokenPrefersPartnerURL(), extractGF2PartnerBookingToken(), findFirstPartnerCheckoutURL(), findFirstStringByKeys() (+3 more)

### Community 1 - "SearchFormScreen.tsx"
Cohesion: 0.18
Nodes (14): @react-navigation/native-stack@^7.0.0, DynamicDestinationsStack(), Stack, MonthDealsStack(), Stack, SearchStack(), Stack, DynamicDestinationsStackParamList (+6 more)

### Community 2 - "DynamicDestinationsScreen.tsx"
Cohesion: 0.23
Nodes (14): defaultParams, DynamicDestinationsScreen(), Nav, styles, ExtraSearchLeg, addExtraDestinationLeg(), DynamicDestinationsValidation, emptyExtraLeg() (+6 more)

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "ThemeContext.tsx"
Cohesion: 0.10
Nodes (22): getPhrasesForLanguage(), SEARCH_BUTTON_PHRASES, SEARCH_PROGRESS_PHRASES, s, SearchProgressBannerProps, ExtraLeg, Props, s (+14 more)

### Community 5 - "dealsCache.ts"
Cohesion: 0.25
Nodes (15): DealsState, MonthDealsResponse, CachedDealsResults, clearPendingDealsParams(), DealsParams, dealsParamsFingerprint(), getCachedDealsResults(), getLocalStorage() (+7 more)

### Community 6 - "dependencies"
Cohesion: 0.12
Nodes (16): dependencies, @expo/metro-runtime@~4.0.1, expo-status-bar@~2.0.0, react@18.3.1, react-dom@18.3.1, react-native@0.76.3, react-native-safe-area-context@4.12.0, react-native-screens@~4.4.0 (+8 more)

### Community 7 - "useTheme"
Cohesion: 0.08
Nodes (61): ClearableTextInput(), ClearableTextInputProps, styles, useAuth(), LocaleContext, LocaleContextValue, useLocale(), VALID_CURRENCIES (+53 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (33): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+25 more)

### Community 9 - "handleExplore"
Cohesion: 0.22
Nodes (9): exploreSessionKey(), getExploreSession(), newExploreSessionID(), putExploreSession(), startExploreSessionCleanup(), exploreSession, corsMiddleware(), handleExplore() (+1 more)

### Community 10 - "flight-scraper/package.json"
Cohesion: 0.12
Nodes (16): express, playwright, dependencies, express@^4.21.2, playwright@^1.49.1, description, engines, node (+8 more)

### Community 11 - "SearchRequest"
Cohesion: 0.14
Nodes (24): TestCompleteExtraLegs(), TestExtraLegsFingerprint(), classicRoundTripMissingReturn(), TestDoSearchWithRetry_doesNotCacheRoundTrip(), TestSearch_ignoresIncompleteClassicRTCache(), TestSearch_servesCompleteClassicRTCache(), newGF2Cache(), parseKiwiApifyItems() (+16 more)

### Community 12 - "BookingOptionsFooter.tsx"
Cohesion: 0.11
Nodes (40): BookingResolveRequest, BookingResolveResponse, BookingResolveStatus, bookingRetryDelayMs(), fetchBookingResolveOnce(), isSafeBookingUrl(), isTransientBookingFetchError(), isTransientBookingResolveResponse() (+32 more)

### Community 13 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 14 - "runBookingMatch"
Cohesion: 0.07
Nodes (43): isTransientGF2BookingErr(), resolveAllPartnerBookingsFromTokenWithRetry(), acquireBookingResolveSlot(), beginInflightResolve(), bookingResolveCacheKey(), bookingResolveFailureResponse(), cacheTTLForStatus(), finishInflightResolve() (+35 more)

### Community 15 - "canonical_booking_test.go"
Cohesion: 0.12
Nodes (29): openJawOption(), TestBookingLinkModeDefaultsToGoogle(), TestBookingRouteFromSessionOption_splitOmitsReturn(), TestBuildGoogleFlightsFallbackFromParams(), TestBuildLegOrSegmentBookingURL_segment(), TestBuildOneWayLegBookingURL(), TestBuildSkyscannerPrefillURL_oneWay(), TestBuildSkyscannerPrefillURL_roundTrip() (+21 more)

### Community 16 - "MonthDealsScreen.tsx"
Cohesion: 0.05
Nodes (74): getFlightDetails(), EditSearchModal(), EditSearchModalProps, s, HubRouteSummaryModal(), SearchProgressBanner(), s, SearchSummaryBar() (+66 more)

### Community 17 - "googleflights2_provider.go"
Cohesion: 0.08
Nodes (55): AirportLocation(), TestAirportLocation_UnknownFallsBackUTC(), TestParseGF2TimeWithDateHint_AirportLocal(), TestParseGF2TimeWithDateHint_TelAviv(), TestParseGF2TimeWithDateHint_ZSuffixWallClock(), TestExtractGF2BookingToken(), TestExtractGF2BookingURL(), TestBuildGF2ResultFromItinerary_FlatFormat() (+47 more)

### Community 18 - "server.go"
Cohesion: 0.11
Nodes (25): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, Carrier, DayDeal, FareBreakdown, FlightDetailsResponse (+17 more)

### Community 19 - "booking_resolve_test.go"
Cohesion: 0.24
Nodes (3): BookingResolveRequest, PublicBookingAlternative, otaScraperSearchRequest

### Community 22 - "testing.T"
Cohesion: 0.07
Nodes (58): TestIsAffiliateTemplateBookingURL(), extractPrice(), cfgTest(), testConnectingTLVJFK(), TestExtractPrice_euroPrefixNotArrivalTime(), TestGenerateQueries_connecting(), TestGenerateQueries_direct(), TestGenerateQueries_gf2AirlineNameIdentity() (+50 more)

### Community 23 - "TestResult"
Cohesion: 0.19
Nodes (3): ResponseAnalyzer, main(), _print_unreachable_backend_hint()

### Community 25 - "runtime_config.go"
Cohesion: 0.17
Nodes (20): adminAccessConfigured(), isAdminRequest(), configRangeError, adminTokenConfigured(), adminTokenFromHeader(), defaultRuntimeConfig(), errConfigOutOfRange(), getRuntimeConfig() (+12 more)

### Community 26 - "booking_gf2_resolve.go"
Cohesion: 0.07
Nodes (44): allocateLegQuoteAmount(), applySearchQuoteToOffer(), attachQuotedPriceMeta(), dedupeGF2PartnerOffers(), flightLegDurationMinutes(), gf2OffersHavePrice(), gf2PartnerOfferFromQuoteURL(), gf2PartnerOfferFromResolved() (+36 more)

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.30
Nodes (10): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+2 more)

### Community 29 - "RuntimeConfigContext.tsx"
Cohesion: 0.16
Nodes (19): apiRequest(), apiUrl(), adminAuthHeaders(), fetchAdminRuntimeConfig(), fetchRuntimeConfig(), saveAdminRuntimeConfig(), setRuntimeConfigStore(), RuntimeConfigContext (+11 more)

### Community 30 - "CanonicalItinerary"
Cohesion: 0.11
Nodes (21): corpusText(), domainFromURL(), logMatchEvent(), MatchItinerary(), NewResolver(), collectSerpAPIResultMaps(), DefaultConfig(), envInt() (+13 more)

### Community 31 - "ExploreScreen.tsx"
Cohesion: 0.13
Nodes (23): ExploreResponse, getExploreDestinations(), GetExploreDestinationsParams, getAirportNameByCode(), getCityDisplayName(), c, countryFlag(), d (+15 more)

### Community 32 - "itinerary.go"
Cohesion: 0.10
Nodes (43): extractFlightNumbers(), flightNumberInText(), flightNumbersEquivalent(), splitFlightDesignator(), textContainsAirport(), textContainsAny(), timeMatches(), TestFlightNumbersEquivalent_leadingZeros() (+35 more)

### Community 33 - "budget_config_test.go"
Cohesion: 0.13
Nodes (18): resetBudgetEnv(), TestExploreBudgetLimits_budget(), TestExploreBudgetLimits_defaultsWithoutBudget(), TestFilterProviderNamesForBudget_disablesKiwi(), TestGF2SearchAirports_budgetCapsMetro(), TestSanitizeProviderErrorForUser(), gf2MetroKey(), GF2SearchAirports() (+10 more)

### Community 34 - "explore_cache.go"
Cohesion: 0.09
Nodes (20): airportCoord, exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut(), getAirportCoord() (+12 more)

### Community 36 - "Backend QA Automation Tool"
Cohesion: 0.18
Nodes (10): Backend QA Automation Tool, Features, If the run feels slow or “stuck”, Notes, Optional AI Setup (Ollama), Output, Project Structure, Run (+2 more)

### Community 37 - "SearchFormScreen.tsx"
Cohesion: 0.17
Nodes (19): SearchUrlState, isDeepLinkDebugEnabled(), logDeepLinkDiagnostics(), mergeDeepLinkParams(), fromStash, fromUrl, kept, recovery (+11 more)

### Community 38 - "affiliate.go"
Cohesion: 0.15
Nodes (19): BuildLegAirlineDirectURL(), BuildRedirectURL(), getAffiliateID(), GetClicksSummary(), getOTAProvider(), GetSessionAndOption(), ParseOptionIndex(), RecordClick() (+11 more)

### Community 39 - "search.ts"
Cohesion: 0.16
Nodes (25): CachedResult, createSearchSession(), createSearchSessionWithRetry(), ensureLegacyPurge(), fetchFresh(), getFromStorage(), getSearchSessionResults(), getStorage() (+17 more)

### Community 40 - "skyscanner.ts"
Cohesion: 0.42
Nodes (10): BookingHop, bookingHopsFromOption(), firstSeg(), isClassicRoundTripLegs(), isoDatePrefix(), isSplitBookingItinerary(), lastSeg(), legNeedsSegmentSplit() (+2 more)

### Community 42 - "AirportAutocomplete.tsx"
Cohesion: 0.18
Nodes (25): getAirportDisplayName(), byCode, COUNTRY_DIRECTORY, CountryEntry, getCountryDisplayName(), getCountryEntry(), LanguageCode, TRANSLATIONS (+17 more)

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "destinationMood.test.ts"
Cohesion: 0.12
Nodes (11): __dirname, dist, indexHtml, indexPath, SPA_ROUTES, byCity, curatedCities, curatedUrls (+3 more)

### Community 45 - "auth.go"
Cohesion: 0.20
Nodes (21): authUserJSON(), bootstrapAdminUser(), createAuthSession(), envFlagTrue(), handleAuthLogin(), handleAuthRegister(), handleAuthUsers(), initAuthStore() (+13 more)

### Community 46 - "test_cases"
Cohesion: 0.05
Nodes (40): departureDate, origin, byProvider, currency, error, from, items, route (+32 more)

### Community 47 - "FlightDetailsModal.tsx"
Cohesion: 0.07
Nodes (56): AIRLINE_NAMES, getAirlineName(), resolveAirlineLabel(), AIRLINE_FULL_NAMES, airportTimeZones, getAirportTimeZone(), f, FiltersPanel() (+48 more)

### Community 53 - "session_store.go"
Cohesion: 0.32
Nodes (14): loadSearchSession(), TestLoadSearchSession_Expiry(), searchSessionTTL(), loadPersistedSession(), persistSearchSession(), initTestSessionDB(), makeSessionResp(), TestLegacyJSONImport() (+6 more)

### Community 54 - "Nginx Proxy Manager — fly-fix TLS checklist"
Cohesion: 0.40
Nodes (4): Nginx Proxy Manager — fly-fix TLS checklist, Reissue frontend cert (both names), Required proxy-host settings, Symptoms Chrome shows

### Community 55 - "api.ts"
Cohesion: 0.10
Nodes (20): AIRPORT_DICTIONARY, AIRPORT_ONLY_DICTIONARY, FULL_PLACE_DICTIONARY, lower(), matchesQuery(), PLACE_SEARCH_LIMIT, rankResult(), searchAirportsLocal() (+12 more)

### Community 56 - "BookingOffer"
Cohesion: 0.17
Nodes (31): airlineDomainForCarrier(), bookingMatchPriceNormalizer(), isAffiliateTemplateBookingURL(), marketingCarrierForLegIndex(), normalizedGF2OfferPrice(), offersIncludeAirlineDirect(), preferAirlineDirectWhenCheaperThanMarkedUpOTA(), publicAlternativesFromOffers() (+23 more)

### Community 58 - "AppIcon"
Cohesion: 0.09
Nodes (48): AppIcon(), AppIconLibrary, AppIconProps, styles, collectTripDestinationCodes(), DestinationMoodBanner(), DestinationMoodStrip(), stripStyles (+40 more)

### Community 59 - "steps"
Cohesion: 0.09
Nodes (22): runs-on, steps, jobs, deploy, name, on, push, workflow_dispatch (+14 more)

### Community 60 - "flyfix-api"
Cohesion: 0.06
Nodes (35): context, FLIGHT_SCRAPER_URL, PLAYWRIGHT_HEADLESS, PORT, SCRAPER_CDP_URLS, SCRAPER_PROXY_URL, build, container_name (+27 more)

### Community 61 - "ProviderResult"
Cohesion: 0.10
Nodes (17): DedupeProviderResults(), ItineraryFingerprint(), mergeSelfTransfer(), uniqueStrings(), cheapestReturnLeg(), providerResultArrivalAirport(), legSearchRetryable(), ResultMatchesItinerary() (+9 more)

### Community 62 - "client.ts"
Cohesion: 0.13
Nodes (18): searchAirports(), API_BASE, apiGet(), isLocalHostname(), resolveApiBase(), getDealsRange(), GetDealsRangeParams, getMonthDeals() (+10 more)

### Community 63 - "FlightOption"
Cohesion: 0.14
Nodes (19): CanonicalFingerprint(), CodeshareFingerprint(), roundTimeToMinutes(), TestProviderResultsToFlightOptions_PreservesCarrierName(), FlightOption, LayoverSummary, OutboundSummary, applySoftStrictBaggageOptions() (+11 more)

### Community 64 - "ErrorBoundary"
Cohesion: 0.15
Nodes (4): ErrorBoundary, Props, s, State

### Community 65 - "npm"
Cohesion: 0.17
Nodes (11): networks, proxy, container_name, image, networks, ports, restart, volumes (+3 more)

### Community 66 - "skyscanner.js"
Cohesion: 0.21
Nodes (16): offerTemplate(), segment(), expediaUrl(), scrapeExpedia(), attachJsonCapture(), gotoAndSettle(), ensureDatedResultsUrl(), extractSkyscanner() (+8 more)

### Community 67 - "kiwi.js"
Cohesion: 0.24
Nodes (14): extractFromCaptured(), extractNextData(), flattenOffers(), kiwiSearchUrl(), mapRouteSeg(), pickNumber(), pickSegments(), pickString() (+6 more)

### Community 68 - "SelectBestOffer"
Cohesion: 0.12
Nodes (18): quoteBindingForMatch(), classifyURLType(), floatPtr(), TestClassifyURLType_genericVsExact(), TestSelectBestOffer_cheapestOTAOverAirline(), TestSelectBestOffer_conflictingCandidatesPicksCheapest(), TestSelectBestOffer_missingPrice(), TestSelectBestOffer_multipleMatching() (+10 more)

### Community 69 - "nginx-proxy-manager (VPS edge)"
Cohesion: 0.40
Nodes (4): Deploy sync, First-time / recovery, nginx-proxy-manager (VPS edge), On the server

### Community 71 - "AuthContext.tsx"
Cohesion: 0.16
Nodes (25): authHeaders(), AuthUser, changePassword(), createUser(), deleteUser(), fetchAuthMe(), fetchUsers(), LoginResponse (+17 more)

### Community 72 - "Registry"
Cohesion: 0.31
Nodes (7): AttachCanonicalIdentityAll(), TestRegistryFailureMessage_transientOutbound(), TestRegistrySearchAll_openJawGF2FailNotMaskedByKiwiSkip(), TestRegistrySearchAllPartialFailure(), isSkippedProviderErr(), IsTransientSearchErrMsg(), MultiSearchResult

### Community 73 - "providers.go"
Cohesion: 0.14
Nodes (29): TestCombineOneWayBatches(), TestCombineOneWayBatches_emptyBatch(), TestCombineOneWayBatches_openJawReturnDiversity(), TestAttachCanonicalIdentityAll_combineOneWay(), asArray(), collectCarriers(), detectSelfTransfer(), extractKiwiLegs() (+21 more)

### Community 74 - "session.js"
Cohesion: 0.24
Nodes (11): pageLooksBlocked(), browserPromises, { chromium, firefox }, getBrowser(), runWithRetries(), warmHomepage(), withPage(), withPageViaCdp() (+3 more)

### Community 75 - "time.Time"
Cohesion: 0.12
Nodes (20): minutesOfDay(), FullRoundTrip, attachReturnLegKeepPrice(), ensureRoundTripLegs(), exploreRunLiveBatch(), gf2ExploreSearchOneDestination(), gf2OneRoundTrip(), gf2SearchDealsOnDates() (+12 more)

### Community 76 - "flyfix.ts"
Cohesion: 0.25
Nodes (8): apiPost(), FlyfixInsightsGroup, FlyfixIssue, FlyfixRefinedReport, FlyfixSummary, refineIssues(), RefineIssuesRequestBody, cancelSearchSession()

### Community 77 - "exchangeRates.ts"
Cohesion: 0.19
Nodes (10): DisplayPrice(), DisplayPriceProps, HubRouteLeg, HubRouteSummaryModalProps, s, convertPrice(), CURRENCY_SYMBOLS, CurrencyCode (+2 more)

### Community 78 - "affiliate.ts"
Cohesion: 0.27
Nodes (9): AffiliateProvider, AffiliateProviderResponse, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink(), OutboundLinkResponse (+1 more)

### Community 79 - "destinationMood.ts"
Cohesion: 0.19
Nodes (15): getAirportEntry(), ASSIGNED_URLS, BY_CODE, BY_COUNTRY, DestinationMood, FALLBACK_IMAGE, hashCode(), LANDING_MOOD_DESTINATIONS (+7 more)

### Community 80 - "server_normalize_test.go"
Cohesion: 0.19
Nodes (12): applyPriceNormalization(), computeTotalDurationFromLegs(), TestApplyPriceNormalizationDefaultNoChange(), TestComputeTotalDurationFromLegs(), TestComputeTotalDurationFromLegs_IncludesLayover(), TestPriceUpliftMultiplierConfigured(), TestPriceUpliftMultiplierDefaultOff(), TestRoundtripOption_HasTwoLegs() (+4 more)

### Community 81 - "CanonicalItinerary"
Cohesion: 0.16
Nodes (14): canonicalItineraryForOption(), legRouteLabel(), TestCanonicalItineraryForOption_isolatesSplitLegs(), mustCanonicalForLog(), TotalStops(), BuildCanonicalItinerary(), FingerprintDebugString(), CanonicalItinerary (+6 more)

### Community 82 - "net/http.Request"
Cohesion: 0.21
Nodes (24): bearerTokenFromRequest(), handleAuthChangePassword(), handleAuthLogout(), handleAuthMe(), requireAdminUser(), userFromRequest(), userFromSessionToken(), authUser (+16 more)

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
Cohesion: 0.12
Nodes (28): bookingResolveMaxConcurrentFromEnv(), envDurationMinutes(), init(), init(), budgetCfg(), BudgetModeEnabled(), durationFromEnvMin(), envTruthy() (+20 more)

### Community 88 - "scrape.js"
Cohesion: 0.33
Nodes (4): scrapeAll(), SITE_FNS, app, express

### Community 89 - "App.tsx"
Cohesion: 0.19
Nodes (14): App(), linking, RTLWrapper(), getStorage(), languageToLocale(), loadSaved(), LocaleProvider(), save() (+6 more)

### Community 92 - "ValidateBookingURL"
Cohesion: 0.27
Nodes (11): gf2CheckoutOffers(), IsCheckoutBookingURL(), IsNonBookableDomain(), TestIsCheckoutBookingURL_rejectsFlightSearchPages(), TestIsNonBookableDomain_blocksFlightRadar(), TestValidateBookingURL_acceptsHTTPS(), TestValidateBookingURL_rejectsEmpty(), TestValidateBookingURL_rejectsJavascript() (+3 more)

### Community 93 - "warm-flight-chrome.js"
Cohesion: 0.22
Nodes (6): { chromium }, main(), WARM_URLS, warmEndpoint(), DEFAULT_SITES, mergeConfig()

### Community 94 - "OtaScraperProvider"
Cohesion: 0.15
Nodes (7): truncateStr(), SerpAPISearcher, OtaScraperProvider, Docker, Flight scraper (multisite), Run locally, VPS (recommended): headed Chrome on `:99`

### Community 95 - "handleCreateSession"
Cohesion: 0.20
Nodes (9): CreateSearchSessionRequest, ExtraSearchLeg, baggageOrderString(), filterFlightOptionsByCabinPref(), handleCreateSession(), optionMatchesCabinFlightOption(), randomID(), TestSegmentMatchesCabinClass() (+1 more)

### Community 96 - "frontend/package.json"
Cohesion: 0.18
Nodes (13): react-native-web@~0.19.13, devDependencies, @babel/core@^7.25.0, @types/react@~18.3.12, typescript@~5.3.0, main, name, private (+5 more)

### Community 99 - "searchStore.ts"
Cohesion: 0.19
Nodes (12): KEYS, s, SortBarProps, SortOption, defaultFilters, searchActions, SearchState, SortField (+4 more)

### Community 101 - "ensure-flight-chrome.sh"
Cohesion: 0.70
Nodes (4): DISPLAY, ensure_gateway_proxy(), log(), ensure-flight-chrome.sh script

### Community 104 - "session_store.go"
Cohesion: 0.31
Nodes (6): startSearchSessionCleanup(), cleanupPersistedSessions(), importLegacyJSONSessions(), initSessionStore(), sessionDBPath(), sessionRetention()

### Community 105 - "useSearchParams.ts"
Cohesion: 0.47
Nodes (8): buildSearchString(), getParam(), getParams(), isWeb(), parseSearchParamsFromUrl(), updateSearchUrl(), useSearchParams(), resultsPathFromSharedCache()

### Community 106 - "parseGF2BookingOptions"
Cohesion: 0.32
Nodes (8): findBookingOptionsArray(), firstPartnerURLInMap(), firstStringByKeys(), isPartnerBookingList(), parseGF2BookingOptions(), partnerRequestTokenFromMap(), TestParseGF2BookingOptions(), TestParseGF2BookingOptions_rapidAPIPartnerList()

### Community 107 - "searchRouteUrl.ts"
Cohesion: 0.43
Nodes (6): openUrlInNewTab(), openUrlInNewTabOrAlert(), openUrlSameTab(), buildFlyFixSearchResultsUrl(), FlyFixLegSearchParams, openFlyFixLegSearchInNewTab()

### Community 108 - "server_carrier_test.go"
Cohesion: 0.43
Nodes (6): CarrierCodes, makeOfferWithCarriers(), TestExtractCarrierCodes(), TestPrimaryDisplayCarrier(), ExtractCarrierCodes(), PrimaryDisplayCarrier()

### Community 109 - "CalendarModal.tsx"
Cohesion: 0.38
Nodes (6): buildMonthDays(), CalendarModal(), getMonthStart(), Props, styles, WEEKDAYS

### Community 110 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, android, build, ios, start, web

### Community 111 - "check-skyscanner-url.js"
Cohesion: 0.40
Nodes (5): com, fr, req, flightsSegmentForHost(), skyscannerUrl()

### Community 112 - "SearchSession"
Cohesion: 0.40
Nodes (5): ProviderSearchStats, SearchSession, SearchSessionResultsResponse, SearchSessionStatus, sanitizeSessionForClient()

### Community 113 - "metro.config.js"
Cohesion: 0.40
Nodes (4): config, { getDefaultConfig }, expo@~52.0.0, expo

### Community 114 - "tequila.js"
Cohesion: 0.83
Nodes (3): formatTequilaDate(), parseTequilaData(), scrapeKiwiTequila()

## Knowledge Gaps
- **3 isolated node(s):** `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 555 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Fly-Fix` connect `Features` to `MonthDealsScreen.tsx`?**
  _High betweenness centrality (0.363) - this node is a cross-community bridge._
- **What connects `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Issue` be split into smaller, more focused modules?**
  _Cohesion score 0.10365853658536585 - nodes in this community are weakly interconnected._
- **Why does `Multi-provider flight search` connect `Features` to `budget_config.go`?**
  _High betweenness centrality (0.356) - this node is a cross-community bridge._
- **Should `ThemeContext.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10256410256410256 - nodes in this community are weakly interconnected._
- **Why does `Recent enhancements` connect `MonthDealsScreen.tsx` to `Features`, `AppIcon`?**
  _High betweenness centrality (0.347) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._