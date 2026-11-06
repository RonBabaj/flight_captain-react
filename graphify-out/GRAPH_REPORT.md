# Graph Report - workspace  (2026-11-06)

## Corpus Check
- 276 files · ~234,216 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: (none) 8, .example 2, .mdc 1)

## Summary
- 2352 nodes · 7334 edges · 100 communities (83 shown, 17 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 595 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cb758dbf`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- .ResolveQuotedPartnerBooking
- types.ts
- ResultsScreen.tsx
- Issue
- SearchLoadingOverlay.tsx
- ProviderResult
- frontend/package.json
- useTheme
- Features
- main
- flight-scraper/package.json
- OtaScraperProvider
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
- DateRangePicker.tsx
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
- destinationMood.ts
- .finalize
- AppIcon
- steps
- flyfix-api
- ProviderResult
- client.ts
- SelectBestOffer
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
- selectBookingOptionForQuote
- dealsCache.ts
- affiliate.ts
- App.tsx
- .buildCacheKey
- itineraryStops.ts
- SearchFormScreen.tsx
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
- CompleteExtraLegs
- CalendarModal.tsx
- server_carrier_test.go
- DraggableBottomSheet.tsx
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

## Communities (100 total, 17 thin omitted)

### Community 0 - ".ResolveQuotedPartnerBooking"
Cohesion: 0.16
Nodes (19): findBookingOptionsArray(), firstPartnerBookingOption(), firstPartnerURLInMap(), firstStringByKeys(), ResolvedPartnerBooking, isPartnerBookingList(), parseGF2BookingOptions(), partnerRequestTokenFromMap() (+11 more)

### Community 1 - "types.ts"
Cohesion: 0.19
Nodes (13): DynamicDestinationsStack(), Stack, MonthDealsStack(), Stack, SearchStack(), Stack, DynamicDestinationsStackParamList, MonthDealsStackParamList (+5 more)

### Community 2 - "ResultsScreen.tsx"
Cohesion: 0.08
Nodes (46): defaultParams, DynamicDestinationsScreen(), Nav, styles, ResultsSkeletonCard(), ResultsSkeletonList(), sk, bestScore() (+38 more)

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "SearchLoadingOverlay.tsx"
Cohesion: 0.12
Nodes (20): getPhrasesForLanguage(), SEARCH_BUTTON_PHRASES, SEARCH_PROGRESS_PHRASES, s, SearchProgressBanner(), SearchProgressBannerProps, ExtraLeg, Props (+12 more)

### Community 5 - "ProviderResult"
Cohesion: 0.06
Nodes (36): DedupeProviderResults(), ItineraryFingerprint(), mergeSelfTransfer(), TotalStops(), uniqueStrings(), TestCombineOneWayBatches(), TestCombineOneWayBatches_emptyBatch(), TestCombineOneWayBatches_openJawReturnDiversity() (+28 more)

### Community 6 - "frontend/package.json"
Cohesion: 0.06
Nodes (41): config, { getDefaultConfig }, dependencies, expo@~52.0.0, @expo/metro-runtime@~4.0.1, expo-status-bar@~2.0.0, react@18.3.1, react-dom@18.3.1 (+33 more)

### Community 7 - "useTheme"
Cohesion: 0.08
Nodes (61): ClearableTextInput(), ClearableTextInputProps, styles, useAuth(), useRuntimeConfig(), useRuntimeConfigActions(), AccountScreen(), styles (+53 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (31): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+23 more)

### Community 9 - "main"
Cohesion: 0.20
Nodes (11): exploreSessionKey(), getExploreSession(), newExploreSessionID(), putExploreSession(), startExploreSessionCleanup(), exploreSession, corsMiddleware(), fetchExchangeRates() (+3 more)

### Community 10 - "flight-scraper/package.json"
Cohesion: 0.12
Nodes (16): express, playwright, dependencies, express@^4.21.2, playwright@^1.49.1, description, engines, node (+8 more)

### Community 11 - "OtaScraperProvider"
Cohesion: 0.18
Nodes (6): truncateStr(), OtaScraperProvider, Docker, Flight scraper (multisite), Run locally, VPS (recommended): headed Chrome on `:99`

### Community 12 - "BookingOptionsFooter.tsx"
Cohesion: 0.11
Nodes (40): BookingResolveRequest, BookingResolveResponse, BookingResolveStatus, bookingRetryDelayMs(), fetchBookingResolveOnce(), isSafeBookingUrl(), isTransientBookingFetchError(), isTransientBookingResolveResponse() (+32 more)

### Community 13 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 14 - "runBookingMatch"
Cohesion: 0.07
Nodes (52): acquireBookingResolveSlot(), beginInflightResolve(), bookingOfferInGF2Sources(), bookingOfferSameURL(), bookingResolveCacheKey(), bookingResolveFailureResponse(), bookingResolveMaxConcurrentFromEnv(), cacheTTLForStatus() (+44 more)

### Community 15 - "canonical_booking_test.go"
Cohesion: 0.11
Nodes (30): openJawOption(), TestBookingLinkModeDefaultsToGoogle(), TestBookingRouteFromSessionOption_splitOmitsReturn(), TestBuildGoogleFlightsFallbackFromParams(), TestBuildLegOrSegmentBookingURL_segment(), TestBuildOneWayLegBookingURL(), TestBuildSkyscannerPrefillURL_oneWay(), TestBuildSkyscannerPrefillURL_roundTrip() (+22 more)

### Community 16 - "MonthDealsScreen.tsx"
Cohesion: 0.07
Nodes (45): CheaperCitiesOption, CheaperCitiesSection(), Props, s, KEYS, s, SortBar(), SortOption (+37 more)

### Community 17 - "googleflights2_provider.go"
Cohesion: 0.11
Nodes (42): TestParseGF2TimeWithDateHint_AirportLocal(), TestExtractGF2BookingToken(), TestExtractGF2BookingURL(), TestExtractGF2PartnerBookingTokenPrefersPartnerURL(), TestBuildGF2ResultFromItinerary_FlatFormat(), TestParseGF2Response_AttachesFlatReturnFlights(), TestParseGF2Response_RapidAPIFlatTopFlights(), TestExtractGF2Leg_TimeOnly_NoDateHint() (+34 more)

### Community 18 - "server.go"
Cohesion: 0.06
Nodes (64): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, minutesOfDay(), CanonicalFingerprint(), Carrier, CarrierCodes (+56 more)

### Community 19 - "booking_resolve_test.go"
Cohesion: 0.30
Nodes (5): gf2ExploreResolveDeps(), outboundDatesForMonthBookable(), otaScraperSearchRequest, otaScraperSearchResponse, otaScraperSiteResult

### Community 22 - "VerifyCandidate"
Cohesion: 0.16
Nodes (31): extractPrice(), cfgTest(), TestClassifyURLType_genericVsExact(), testConnectingTLVJFK(), TestExtractPrice_euroPrefixNotArrivalTime(), TestFlightNumbersEquivalent_leadingZeros(), TestGenerateQueries_connecting(), TestGenerateQueries_direct() (+23 more)

### Community 23 - "TestResult"
Cohesion: 0.19
Nodes (3): ResponseAnalyzer, main(), _print_unreachable_backend_hint()

### Community 25 - "runtime_config.go"
Cohesion: 0.22
Nodes (16): adminAccessConfigured(), configRangeError, adminTokenConfigured(), defaultRuntimeConfig(), errConfigOutOfRange(), getRuntimeConfig(), handleAdminRuntimeConfig(), initRuntimeConfigStore() (+8 more)

### Community 26 - "booking_gf2_resolve.go"
Cohesion: 0.07
Nodes (69): airlineDomainForCarrier(), allocateLegQuoteAmount(), applySearchQuoteToOffer(), attachQuotedPriceMeta(), bookingMatchPriceNormalizer(), dedupeGF2PartnerOffers(), flightLegDurationMinutes(), gf2OffersHavePrice() (+61 more)

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.30
Nodes (10): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+2 more)

### Community 29 - "auth_test.go"
Cohesion: 0.26
Nodes (11): initAuthStore(), initTestAuthDB(), randomTestPassword(), TestAuthLoginAndChangePassword(), TestAuthRegister(), TestAuthUserManagement(), TestBootstrapAdminPasswordSync(), TestBootstrapAdminUser() (+3 more)

### Community 30 - "CanonicalItinerary"
Cohesion: 0.12
Nodes (24): defaultBookingMatchRunner(), corpusText(), elapsedMs(), logMatchEvent(), MatchItinerary(), NewResolver(), truncateStr(), collectSerpAPIResultMaps() (+16 more)

### Community 31 - "DateRangePicker.tsx"
Cohesion: 0.15
Nodes (21): c, countryFlag(), d, DestCard(), ExploreScreenProps, fmtDate(), fmtPrice(), getRegion() (+13 more)

### Community 32 - "itinerary.go"
Cohesion: 0.10
Nodes (43): extractFlightNumbers(), flightNumberInText(), flightNumbersEquivalent(), splitFlightDesignator(), textContainsAirport(), textContainsAny(), timeMatches(), connectingFlightQueries() (+35 more)

### Community 33 - "budget_config_test.go"
Cohesion: 0.18
Nodes (12): TestGF2SearchAirports_budgetCapsMetro(), gf2MetroKey(), GF2SearchAirports(), limitGF2SearchAirports(), ResolveGF2PlaceCode(), containsAll(), TestGF2SearchAirports_CityOnlyCode(), TestGF2SearchAirports_LondonParis() (+4 more)

### Community 34 - "explore_cache.go"
Cohesion: 0.10
Nodes (19): airportCoord, exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut(), getAirportCoord() (+11 more)

### Community 36 - "Backend QA Automation Tool"
Cohesion: 0.18
Nodes (10): Backend QA Automation Tool, Features, If the run feels slow or “stuck”, Notes, Optional AI Setup (Ollama), Output, Project Structure, Run (+2 more)

### Community 37 - "test-local-time.js"
Cohesion: 0.19
Nodes (11): a, arr, assert, b, dep, late, AIRPORT_TZ, localHmToIso() (+3 more)

### Community 38 - "affiliate.go"
Cohesion: 0.16
Nodes (20): BuildLegAirlineDirectURL(), BuildRedirectURL(), getAffiliateID(), GetClicksSummary(), getOTAProvider(), GetSessionAndOption(), ParseOptionIndex(), RecordClick() (+12 more)

### Community 39 - "search.ts"
Cohesion: 0.11
Nodes (33): apiPost(), FlyfixInsightsGroup, FlyfixIssue, FlyfixRefinedReport, FlyfixSummary, refineIssues(), RefineIssuesRequestBody, CachedResult (+25 more)

### Community 40 - "skyscanner.ts"
Cohesion: 0.36
Nodes (11): FlightLeg, BookingHop, bookingHopsFromOption(), firstSeg(), isClassicRoundTripLegs(), isoDatePrefix(), isSplitBookingItinerary(), lastSeg() (+3 more)

### Community 42 - "ExploreScreen.tsx"
Cohesion: 0.14
Nodes (40): AIRPORT_ONLY_DICTIONARY, FULL_PLACE_DICTIONARY, getAirportDisplayName(), getAirportEntry(), getAirportNameByCode(), getCityDisplayName(), lower(), matchesQuery() (+32 more)

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "destinationMood.test.ts"
Cohesion: 0.12
Nodes (11): __dirname, dist, indexHtml, indexPath, SPA_ROUTES, byCity, curatedCities, curatedUrls (+3 more)

### Community 45 - "auth.go"
Cohesion: 0.16
Nodes (35): authUserJSON(), bearerTokenFromRequest(), bootstrapAdminUser(), createAuthSession(), envFlagTrue(), handleAuthChangePassword(), handleAuthLogin(), handleAuthLogout() (+27 more)

### Community 46 - "test_cases"
Cohesion: 0.05
Nodes (40): departureDate, origin, byProvider, currency, error, from, items, route (+32 more)

### Community 47 - "FlightDetailsModal.tsx"
Cohesion: 0.09
Nodes (48): AIRLINE_NAMES, getAirlineName(), resolveAirlineLabel(), AIRLINE_FULL_NAMES, airportTimeZones, getAirportTimeZone(), f, FiltersPanel() (+40 more)

### Community 53 - "session_store.go"
Cohesion: 0.17
Nodes (21): loadSearchSession(), markSessionComplete(), TestLoadSearchSession_Expiry(), searchSessionTTL(), startSearchSessionCleanup(), cleanupPersistedSessions(), importLegacyJSONSessions(), initSessionStore() (+13 more)

### Community 54 - "Nginx Proxy Manager — fly-fix TLS checklist"
Cohesion: 0.40
Nodes (4): Nginx Proxy Manager — fly-fix TLS checklist, Reissue frontend cert (both names), Required proxy-host settings, Symptoms Chrome shows

### Community 55 - "api.ts"
Cohesion: 0.09
Nodes (27): SortBarProps, dealsActions, DealsSortField, DealsState, now, defaultFilters, isCurrentSearchGeneration(), searchActions (+19 more)

### Community 56 - "destinationMood.ts"
Cohesion: 0.18
Nodes (10): AIRPORT_DICTIONARY, ASSIGNED_URLS, BY_CODE, BY_COUNTRY, DestinationMood, FALLBACK_IMAGE, hashCode(), LANDING_MOOD_DESTINATIONS (+2 more)

### Community 58 - "AppIcon"
Cohesion: 0.09
Nodes (47): AppIcon(), AppIconLibrary, AppIconProps, styles, collectTripDestinationCodes(), DestinationMoodBanner(), DestinationMoodStrip(), stripStyles (+39 more)

### Community 59 - "steps"
Cohesion: 0.09
Nodes (22): runs-on, steps, jobs, deploy, name, on, push, workflow_dispatch (+14 more)

### Community 60 - "flyfix-api"
Cohesion: 0.06
Nodes (35): context, FLIGHT_SCRAPER_URL, PLAYWRIGHT_HEADLESS, PORT, SCRAPER_CDP_URLS, SCRAPER_PROXY_URL, build, container_name (+27 more)

### Community 61 - "ProviderResult"
Cohesion: 0.07
Nodes (34): TestHasExtraLegs(), classicRoundTripMissingReturn(), TestClassicRoundTripMissingReturn(), TestDoSearchWithRetry_doesNotCacheRoundTrip(), TestSearch_ignoresIncompleteClassicRTCache(), TestSearch_servesCompleteClassicRTCache(), GoogleFlights2Provider, newGF2Cache() (+26 more)

### Community 62 - "client.ts"
Cohesion: 0.11
Nodes (23): searchAirports(), apiGet(), isLocalHostname(), resolveApiBase(), getDealsRange(), GetDealsRangeParams, getMonthDeals(), GetMonthDealsParams (+15 more)

### Community 63 - "SelectBestOffer"
Cohesion: 0.18
Nodes (11): floatPtr(), TestSelectBestOffer_cheapestOTAOverAirline(), TestSelectBestOffer_conflictingCandidatesPicksCheapest(), TestSelectBestOffer_missingPrice(), TestSelectBestOffer_multipleMatching(), TestSelectBestOffer_prefersPriceAmongSameURLType(), TestSelectBestOffer_prefersQuoteMatchingPrice(), TestSelectBestOffer_rejectsGenericSearchURL() (+3 more)

### Community 64 - "ErrorBoundary"
Cohesion: 0.15
Nodes (4): ErrorBoundary, Props, s, State

### Community 65 - "npm"
Cohesion: 0.17
Nodes (11): networks, proxy, container_name, image, networks, ports, restart, volumes (+3 more)

### Community 66 - "skyscanner.js"
Cohesion: 0.22
Nodes (15): com, fr, req, ensureDatedResultsUrl(), extractSkyscanner(), FLIGHTS_PATH_BY_HOST, flightsSegmentForHost(), normalizeLegs() (+7 more)

### Community 67 - "kiwi.js"
Cohesion: 0.19
Nodes (19): offerTemplate(), segment(), extractFromCaptured(), extractNextData(), flattenOffers(), kiwiSearchUrl(), mapRouteSeg(), pickNumber() (+11 more)

### Community 68 - "testing.T"
Cohesion: 0.09
Nodes (34): TestProviderResultsToFlightOptions_PreservesCarrierName(), TestAttachReturnLegKeepPrice(), TestEnsureRoundTripLegs_nilSafe(), TestEnsureRoundTripLegs_noOpWhenTwoLegs(), AirportLocation(), TestAirportLocation_UnknownFallsBackUTC(), TestParseGF2TimeWithDateHint_TelAviv(), TestParseGF2TimeWithDateHint_ZSuffixWallClock() (+26 more)

### Community 69 - "nginx-proxy-manager (VPS edge)"
Cohesion: 0.40
Nodes (4): Deploy sync, First-time / recovery, nginx-proxy-manager (VPS edge), On the server

### Community 71 - "AuthContext.tsx"
Cohesion: 0.09
Nodes (38): authHeaders(), AuthUser, changePassword(), createUser(), deleteUser(), fetchAuthMe(), fetchUsers(), LoginResponse (+30 more)

### Community 72 - "Registry"
Cohesion: 0.13
Nodes (12): TestSanitizeProviderErrorForUser(), TestRegistryFailureMessage_transientOutbound(), TestRegistrySearchAll_openJawGF2FailNotMaskedByKiwiSkip(), TestRegistrySearchAllPartialFailure(), ProviderSearchStats, isPrimaryProvider(), isSkippedProviderErr(), IsTransientSearchErrMsg() (+4 more)

### Community 73 - "providers.go"
Cohesion: 0.26
Nodes (16): asArray(), collectCarriers(), detectSelfTransfer(), extractKiwiLegs(), firstFloat(), firstString(), kiwiSegmentFromMap(), mapsToSegments() (+8 more)

### Community 74 - "session.js"
Cohesion: 0.17
Nodes (19): pageLooksBlocked(), browserPromises, { chromium, firefox }, getBrowser(), warmHomepage(), withPage(), withPageViaCdp(), stealthInitScript() (+11 more)

### Community 75 - "time.Time"
Cohesion: 0.21
Nodes (14): exploreDestRow, FullRoundTrip, attachReturnLegKeepPrice(), ensureRoundTripLegs(), exploreDestRowsToMaps(), gf2ExploreSearchOneDestination(), gf2OneRoundTrip(), gf2SearchDealsOnDates() (+6 more)

### Community 76 - "selectBookingOptionForQuote"
Cohesion: 0.29
Nodes (7): hostFromURL(), PricesMatchQuote(), selectBookingOptionForQuote(), TestPricesMatchQuote(), TestSelectBookingOptionForQuote_fallsBackWhenQuotePriceMismatch(), TestSelectBookingOptionForQuote_prefersDeepLinkHost(), TestSelectBookingOptionForQuote_prefersPriceMatch()

### Community 77 - "dealsCache.ts"
Cohesion: 0.33
Nodes (12): clearPendingDealsParams(), DealsParams, dealsParamsFingerprint(), getCachedDealsResults(), getLocalStorage(), getPendingDealsParams(), getSessionStorage(), migrateLegacySessionParams() (+4 more)

### Community 78 - "affiliate.ts"
Cohesion: 0.27
Nodes (9): AffiliateProvider, AffiliateProviderResponse, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink(), OutboundLinkResponse (+1 more)

### Community 79 - "App.tsx"
Cohesion: 0.12
Nodes (19): App(), linking, RTLWrapper(), API_BASE, DisplayPrice(), DisplayPriceProps, HubRouteLeg, HubRouteSummaryModalProps (+11 more)

### Community 80 - ".buildCacheKey"
Cohesion: 0.17
Nodes (13): AttachCanonicalIdentity(), FingerprintDebugString(), segTLVJFK(), TestCanonicalItineraryFingerprint_connectingFlight(), TestCanonicalItineraryFingerprint_differentFlightsDoNotCollide(), TestCanonicalItineraryFingerprint_directFlight(), TestCanonicalItineraryFingerprint_formattingStable(), TestCanonicalItineraryFingerprint_gf2AirlineNameStable() (+5 more)

### Community 81 - "itineraryStops.ts"
Cohesion: 0.48
Nodes (5): countByStopsFilter(), matchesStopsFilter(), maxStopsPerLeg(), stopsPerLeg(), totalStops()

### Community 82 - "SearchFormScreen.tsx"
Cohesion: 0.15
Nodes (24): DynamicDestinationsFormContentProps, PassengerCabinPickerProps, SearchFormContentProps, defaultParams, SearchFormScreen(), styles, buildSearchString(), getParam() (+16 more)

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
Nodes (28): init(), budgetCfg(), BudgetModeEnabled(), durationFromEnvMin(), envTruthy(), ExploreBudgetLimits(), FilterProviderNamesForBudget(), GF2EffectiveCacheTTL() (+20 more)

### Community 88 - "expedia.js"
Cohesion: 0.27
Nodes (6): runWithRetries(), expediaUrl(), scrapeExpedia(), attachJsonCapture(), gotoAndSettle(), skyscannerDate()

### Community 89 - "LocaleContext.tsx"
Cohesion: 0.19
Nodes (16): getStorage(), languageToLocale(), loadSaved(), LocaleContext, LocaleContextValue, LocaleProvider(), save(), VALID_CURRENCIES (+8 more)

### Community 92 - "ValidateBookingURL"
Cohesion: 0.16
Nodes (15): gf2CheckoutOffers(), classifyURLType(), domainFromURL(), urlTypeRank(), IsCheckoutBookingURL(), IsNonBookableDomain(), TestIsCheckoutBookingURL_rejectsFlightSearchPages(), TestIsNonBookableDomain_blocksFlightRadar() (+7 more)

### Community 93 - "warm.js"
Cohesion: 0.17
Nodes (7): DEFAULT_SITES, scrapeAll(), SITE_FNS, app, express, mergeConfig(), warmStatus()

### Community 94 - "CompleteExtraLegs"
Cohesion: 0.47
Nodes (6): TestCompleteExtraLegs(), TestExtraLegsFingerprint(), CompleteExtraLegs(), ExtraLegsFingerprint(), NormalizeExtraLegs(), ExtraLeg

### Community 95 - "CalendarModal.tsx"
Cohesion: 0.38
Nodes (6): buildMonthDays(), CalendarModal(), getMonthStart(), Props, styles, WEEKDAYS

### Community 96 - "server_carrier_test.go"
Cohesion: 0.83
Nodes (3): makeOfferWithCarriers(), TestExtractCarrierCodes(), TestPrimaryDisplayCarrier()

### Community 101 - "ensure-flight-chrome.sh"
Cohesion: 0.70
Nodes (4): DISPLAY, ensure_gateway_proxy(), log(), ensure-flight-chrome.sh script

## Knowledge Gaps
- **3 isolated node(s):** `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 565 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Fly-Fix` connect `Features` to `MonthDealsScreen.tsx`, `ProviderResult`?**
  _High betweenness centrality (0.359) - this node is a cross-community bridge._
- **What connects `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ResultsScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07832080200501253 - nodes in this community are weakly interconnected._
- **Why does `Multi-provider flight search` connect `ProviderResult` to `Features`, `budget_config.go`?**
  _High betweenness centrality (0.348) - this node is a cross-community bridge._
- **Should `Issue` be split into smaller, more focused modules?**
  _Cohesion score 0.10365853658536585 - nodes in this community are weakly interconnected._
- **Why does `Recent enhancements` connect `MonthDealsScreen.tsx` to `Features`, `AppIcon`?**
  _High betweenness centrality (0.339) - this node is a cross-community bridge._
- **Should `SearchLoadingOverlay.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11594202898550725 - nodes in this community are weakly interconnected._