# Graph Report - workspace  (2026-11-06)

## Corpus Check
- 274 files · ~233,396 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: (none) 8, .example 2, .mdc 1)

## Summary
- 2338 nodes · 7308 edges · 99 communities (83 shown, 16 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 592 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3e769fc4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- .ResolveQuotedPartnerBooking
- SearchFormScreen.tsx
- ResultsScreen.tsx
- Issue
- SearchLoadingOverlay.tsx
- providers.go
- frontend/package.json
- useTheme
- Features
- auth_test.go
- flight-scraper/package.json
- Flight scraper (multisite)
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
- ExploreScreen.tsx
- itinerary.go
- budget_config_test.go
- explore_cache.go
- ValidationIssue
- Backend QA Automation Tool
- sharedLinkCache.ts
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
- context.Context
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
- dealsCache.ts
- affiliate.ts
- exchangeRates.ts
- itinerary_test.go
- resolveAirlineLabel
- searchRouteUrl.ts
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
- CalendarModal.tsx
- DatePickerCalendar.tsx
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
- `Flight scraper (multisite)` --references--> `OtaScraperProvider`  [INFERRED]
  services/flight-scraper/README.md → backend/search/ota_scraper_provider.go
- `Multi-provider flight search` --references--> `NewRegistryFromEnv()`  [INFERRED]
  README.md → backend/search/registry.go

## Import Cycles
- None detected.

## Communities (99 total, 16 thin omitted)

### Community 0 - ".ResolveQuotedPartnerBooking"
Cohesion: 0.11
Nodes (26): findBookingOptionsArray(), firstPartnerBookingOption(), firstPartnerURLInMap(), firstStringByKeys(), ResolvedPartnerBooking, isPartnerBookingList(), parseGF2BookingOptions(), partnerRequestTokenFromMap() (+18 more)

### Community 1 - "SearchFormScreen.tsx"
Cohesion: 0.09
Nodes (28): App(), linking, RTLWrapper(), DynamicDestinationsStack(), Stack, MonthDealsStack(), Stack, RootNavigator() (+20 more)

### Community 2 - "ResultsScreen.tsx"
Cohesion: 0.07
Nodes (58): invalidateSearchSessionResultsCache(), s, SearchSummaryBar(), SearchSummaryBarProps, SearchLoadingOverlay(), defaultParams, DynamicDestinationsScreen(), Nav (+50 more)

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "SearchLoadingOverlay.tsx"
Cohesion: 0.23
Nodes (10): getPhrasesForLanguage(), SEARCH_BUTTON_PHRASES, SEARCH_PROGRESS_PHRASES, s, SearchProgressBanner(), SearchProgressBannerProps, ExtraLeg, Props (+2 more)

### Community 5 - "providers.go"
Cohesion: 0.13
Nodes (23): TestCombineOneWayBatches(), TestCombineOneWayBatches_emptyBatch(), TestCombineOneWayBatches_openJawReturnDiversity(), TestCompleteExtraLegs(), TestExtraLegsFingerprint(), TestAttachCanonicalIdentityAll_combineOneWay(), cloneLegs(), CombineOneWayBatches() (+15 more)

### Community 6 - "frontend/package.json"
Cohesion: 0.06
Nodes (40): config, { getDefaultConfig }, dependencies, expo@~52.0.0, @expo/metro-runtime@~4.0.1, expo-status-bar@~2.0.0, react@18.3.1, react-dom@18.3.1 (+32 more)

### Community 7 - "useTheme"
Cohesion: 0.07
Nodes (61): ClearableTextInput(), ClearableTextInputProps, styles, styles, useAuth(), useRuntimeConfigActions(), AccountScreen(), styles (+53 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (31): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+23 more)

### Community 9 - "auth_test.go"
Cohesion: 0.15
Nodes (19): handleAuthLogin(), initAuthStore(), initTestAuthDB(), randomTestPassword(), TestAuthLoginAndChangePassword(), TestAuthRegister(), TestAuthUserManagement(), TestBootstrapAdminPasswordSync() (+11 more)

### Community 10 - "flight-scraper/package.json"
Cohesion: 0.12
Nodes (16): express, playwright, dependencies, express@^4.21.2, playwright@^1.49.1, description, engines, node (+8 more)

### Community 11 - "Flight scraper (multisite)"
Cohesion: 0.40
Nodes (4): Docker, Flight scraper (multisite), Run locally, VPS (recommended): headed Chrome on `:99`

### Community 12 - "BookingOptionsFooter.tsx"
Cohesion: 0.17
Nodes (26): BookingResolveResponse, isSafeBookingUrl(), PublicBookingOffer, bookingOfferProviderLabel(), bookingOfferSubtitle(), formatBookingOfferPriceAmount(), formatBookingOfferPriceLine(), formatProviderDisplayName() (+18 more)

### Community 13 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 14 - "runBookingMatch"
Cohesion: 0.10
Nodes (34): beginInflightResolve(), bookingResolveCacheKey(), bookingResolveFailureResponse(), cacheTTLForStatus(), finishInflightResolve(), getCachedBookingResolve(), handleBookingResolve(), intPtrOrNil() (+26 more)

### Community 15 - "canonical_booking_test.go"
Cohesion: 0.12
Nodes (28): openJawOption(), TestBookingLinkModeDefaultsToGoogle(), TestBookingRouteFromSessionOption_splitOmitsReturn(), TestBuildGoogleFlightsFallbackFromParams(), TestBuildLegOrSegmentBookingURL_segment(), TestBuildOneWayLegBookingURL(), TestBuildSkyscannerPrefillURL_oneWay(), TestBuildSkyscannerPrefillURL_roundTrip() (+20 more)

### Community 16 - "MonthDealsScreen.tsx"
Cohesion: 0.06
Nodes (51): getFlightDetails(), DisplayPrice(), DisplayPriceProps, EditSearchModal(), EditSearchModalProps, s, HubRouteLeg, HubRouteSummaryModal() (+43 more)

### Community 17 - "googleflights2_provider.go"
Cohesion: 0.14
Nodes (37): TestParseGF2TimeWithDateHint_AirportLocal(), TestExtractGF2BookingToken(), TestExtractGF2BookingURL(), TestBuildGF2ResultFromItinerary_FlatFormat(), TestParseGF2Response_AttachesFlatReturnFlights(), TestParseGF2Response_RapidAPIFlatTopFlights(), TestExtractGF2Leg_TimeOnly_NoDateHint(), TestExtractGF2SegmentFromFlight_CodeOnlyHasNoName() (+29 more)

### Community 18 - "server.go"
Cohesion: 0.06
Nodes (62): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, CanonicalFingerprint(), Carrier, CarrierCodes, CreateSearchSessionRequest (+54 more)

### Community 19 - "booking_resolve_test.go"
Cohesion: 0.25
Nodes (5): BookingResolveRequest, gf2ExploreResolveDeps(), outboundDatesForMonthBookable(), PublicBookingAlternative, otaScraperSearchRequest

### Community 22 - "VerifyCandidate"
Cohesion: 0.16
Nodes (31): extractPrice(), cfgTest(), floatPtr(), testConnectingTLVJFK(), TestExtractPrice_euroPrefixNotArrivalTime(), TestGenerateQueries_connecting(), TestGenerateQueries_direct(), TestGenerateQueries_gf2AirlineNameIdentity() (+23 more)

### Community 23 - "TestResult"
Cohesion: 0.19
Nodes (3): ResponseAnalyzer, main(), _print_unreachable_backend_hint()

### Community 25 - "runtime_config.go"
Cohesion: 0.26
Nodes (13): configRangeError, defaultRuntimeConfig(), errConfigOutOfRange(), getRuntimeConfig(), initRuntimeConfigStore(), persistRuntimeConfigLocked(), setRuntimeConfig(), TestSetRuntimeConfigPersists() (+5 more)

### Community 26 - "booking_gf2_resolve.go"
Cohesion: 0.14
Nodes (33): airlineDomainForCarrier(), allocateLegQuoteAmount(), applySearchQuoteToOffer(), attachQuotedPriceMeta(), dedupeGF2PartnerOffers(), flightLegDurationMinutes(), gf2OffersHavePrice(), gf2PartnerOfferFromQuoteURL() (+25 more)

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
Nodes (27): defaultBookingMatchRunner(), webVerifiedBookingOffers(), corpusText(), domainFromURL(), logMatchEvent(), MatchResult, countVerifiedPricedOffers(), MatchItinerary() (+19 more)

### Community 31 - "ExploreScreen.tsx"
Cohesion: 0.11
Nodes (33): getMonthDeals(), getExploreDestinations(), useRuntimeConfig(), buildMonthDays(), DateRangePicker(), DateRangePickerProps, getMonthStart(), monthStartForYmd() (+25 more)

### Community 32 - "itinerary.go"
Cohesion: 0.09
Nodes (50): canonicalItineraryForOption(), legRouteLabel(), TestCanonicalItineraryForOption_isolatesSplitLegs(), mustCanonicalForLog(), extractFlightNumbers(), flightNumberInText(), flightNumbersEquivalent(), splitFlightDesignator() (+42 more)

### Community 33 - "budget_config_test.go"
Cohesion: 0.20
Nodes (11): gf2MetroKey(), GF2SearchAirports(), limitGF2SearchAirports(), ResolveGF2PlaceCode(), containsAll(), TestGF2SearchAirports_CityOnlyCode(), TestGF2SearchAirports_LondonParis(), TestGF2SearchAirports_SingleAirport() (+3 more)

### Community 34 - "explore_cache.go"
Cohesion: 0.12
Nodes (16): airportCoord, exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut(), getAirportCoord() (+8 more)

### Community 36 - "Backend QA Automation Tool"
Cohesion: 0.18
Nodes (10): Backend QA Automation Tool, Features, If the run feels slow or “stuck”, Notes, Optional AI Setup (Ollama), Output, Project Structure, Run (+2 more)

### Community 37 - "sharedLinkCache.ts"
Cohesion: 0.17
Nodes (19): SearchUrlState, isDeepLinkDebugEnabled(), logDeepLinkDiagnostics(), mergeDeepLinkParams(), fromStash, fromUrl, kept, recovery (+11 more)

### Community 38 - "affiliate.go"
Cohesion: 0.15
Nodes (21): BuildLegAirlineDirectURL(), BuildRedirectURL(), getAffiliateID(), GetClicksSummary(), getOTAProvider(), GetSessionAndOption(), ParseOptionIndex(), RecordClick() (+13 more)

### Community 39 - "search.ts"
Cohesion: 0.17
Nodes (24): CachedResult, createSearchSession(), createSearchSessionWithRetry(), ensureLegacyPurge(), fetchFresh(), getFromStorage(), getSearchSessionResults(), getStorage() (+16 more)

### Community 40 - "skyscanner.ts"
Cohesion: 0.42
Nodes (10): BookingHop, bookingHopsFromOption(), firstSeg(), isClassicRoundTripLegs(), isoDatePrefix(), isSplitBookingItinerary(), lastSeg(), legNeedsSegmentSplit() (+2 more)

### Community 42 - "ExploreScreen.tsx"
Cohesion: 0.09
Nodes (52): AIRPORT_DICTIONARY, AIRPORT_ONLY_DICTIONARY, FULL_PLACE_DICTIONARY, getAirportDisplayName(), getAirportEntry(), getAirportNameByCode(), getCityDisplayName(), lower() (+44 more)

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "destinationMood.test.ts"
Cohesion: 0.12
Nodes (11): __dirname, dist, indexHtml, indexPath, SPA_ROUTES, byCity, curatedCities, curatedUrls (+3 more)

### Community 45 - "auth.go"
Cohesion: 0.14
Nodes (37): adminAccessConfigured(), authUserJSON(), bearerTokenFromRequest(), bootstrapAdminUser(), createAuthSession(), envFlagTrue(), handleAuthChangePassword(), handleAuthLogout() (+29 more)

### Community 46 - "test_cases"
Cohesion: 0.05
Nodes (40): departureDate, origin, byProvider, currency, error, from, items, route (+32 more)

### Community 47 - "FlightDetailsModal.tsx"
Cohesion: 0.18
Nodes (19): airportTimeZones, getAirportTimeZone(), cabinLabel(), FlightDetailsModal(), formatDuration(), layoverBetween(), legDuration(), s (+11 more)

### Community 53 - "session_store.go"
Cohesion: 0.19
Nodes (20): loadSearchSession(), TestLoadSearchSession_Expiry(), searchSessionTTL(), startSearchSessionCleanup(), cleanupPersistedSessions(), importLegacyJSONSessions(), initSessionStore(), loadPersistedSession() (+12 more)

### Community 54 - "Nginx Proxy Manager — fly-fix TLS checklist"
Cohesion: 0.40
Nodes (4): Nginx Proxy Manager — fly-fix TLS checklist, Reissue frontend cert (both names), Required proxy-host settings, Symptoms Chrome shows

### Community 55 - "api.ts"
Cohesion: 0.11
Nodes (22): FiltersPanelProps, FlightDetailsModalProps, FlightResultCardProps, PositioningLegResult, defaultFilters, SearchFilters, SearchState, SortOrder (+14 more)

### Community 56 - "BookingOffer"
Cohesion: 0.15
Nodes (29): bookingMatchPriceNormalizer(), normalizedGF2OfferPrice(), publicAlternativesFromOffers(), bookingOfferInGF2Sources(), bookingOfferSameURL(), buildDualBookingResolveResponse(), collectVerifiedBookingOffers(), filterOffersNotIn() (+21 more)

### Community 58 - "AppIcon"
Cohesion: 0.13
Nodes (36): AppIcon(), AppIconLibrary, AppIconProps, styles, collectTripDestinationCodes(), DestinationMoodBanner(), DestinationMoodStrip(), stripStyles (+28 more)

### Community 59 - "steps"
Cohesion: 0.09
Nodes (22): runs-on, steps, jobs, deploy, name, on, push, workflow_dispatch (+14 more)

### Community 60 - "flyfix-api"
Cohesion: 0.06
Nodes (35): context, FLIGHT_SCRAPER_URL, PLAYWRIGHT_HEADLESS, PORT, SCRAPER_CDP_URLS, SCRAPER_PROXY_URL, build, container_name (+27 more)

### Community 61 - "context.Context"
Cohesion: 0.05
Nodes (50): acquireBookingResolveSlot(), DedupeProviderResults(), ItineraryFingerprint(), mergeSelfTransfer(), uniqueStrings(), TestHasExtraLegs(), cheapestReturnLeg(), classicRoundTripMissingReturn() (+42 more)

### Community 62 - "client.ts"
Cohesion: 0.13
Nodes (16): searchAirports(), API_BASE, apiGet(), apiUrl(), isLocalHostname(), resolveApiBase(), getDealsRange(), GetDealsRangeParams (+8 more)

### Community 63 - "FlightResultCard.tsx"
Cohesion: 0.24
Nodes (15): buildRoutePath(), c, FlightResultCard(), LegScheduleBlock(), LayoverSummary, OutboundSummary, hasMultipleAirlines(), buildLegPreviewSummary() (+7 more)

### Community 64 - "ErrorBoundary"
Cohesion: 0.15
Nodes (4): ErrorBoundary, Props, s, State

### Community 65 - "npm"
Cohesion: 0.17
Nodes (11): networks, proxy, container_name, image, networks, ports, restart, volumes (+3 more)

### Community 66 - "skyscanner.js"
Cohesion: 0.19
Nodes (17): com, fr, req, SITE_FNS, skyscannerDate(), ensureDatedResultsUrl(), extractSkyscanner(), FLIGHTS_PATH_BY_HOST (+9 more)

### Community 67 - "kiwi.js"
Cohesion: 0.19
Nodes (19): offerTemplate(), segment(), extractFromCaptured(), extractNextData(), flattenOffers(), kiwiSearchUrl(), mapRouteSeg(), pickNumber() (+11 more)

### Community 68 - "testing.T"
Cohesion: 0.04
Nodes (68): TestAllocateLegQuoteAmount_splitOpenJaw(), TestAttachQuotedPriceMeta_detectsMismatch(), TestGF2PartnerOfferFromURL_acceptsHTTPS(), TestGF2PartnerOfferFromURL_rejectsUnsafe(), TestLegDeepLink_rejectsMisalignedPartnerArrays(), TestLegDeepLink_rejectsWrongAirlineDirectCheckout(), TestQuoteBindingFromOption_usesOriginalWhenEstimate(), TestQuoteBindingFromOption_usesStoredLegPrice() (+60 more)

### Community 69 - "nginx-proxy-manager (VPS edge)"
Cohesion: 0.40
Nodes (4): Deploy sync, First-time / recovery, nginx-proxy-manager (VPS edge), On the server

### Community 71 - "AuthContext.tsx"
Cohesion: 0.17
Nodes (22): authHeaders(), AuthUser, changePassword(), createUser(), deleteUser(), fetchAuthMe(), fetchUsers(), LoginResponse (+14 more)

### Community 72 - "Registry"
Cohesion: 0.13
Nodes (12): TestSanitizeProviderErrorForUser(), TestRegistryFailureMessage_transientOutbound(), TestRegistrySearchAll_openJawGF2FailNotMaskedByKiwiSkip(), TestRegistrySearchAllPartialFailure(), ProviderSearchStats, isPrimaryProvider(), isSkippedProviderErr(), IsTransientSearchErrMsg() (+4 more)

### Community 73 - "providers.go"
Cohesion: 0.22
Nodes (17): TotalStops(), asArray(), collectCarriers(), detectSelfTransfer(), extractKiwiLegs(), firstFloat(), firstString(), kiwiSegmentFromMap() (+9 more)

### Community 74 - "session.js"
Cohesion: 0.17
Nodes (19): pageLooksBlocked(), browserPromises, { chromium, firefox }, getBrowser(), warmHomepage(), withPage(), withPageViaCdp(), stealthInitScript() (+11 more)

### Community 75 - "time.Time"
Cohesion: 0.11
Nodes (25): elapsedMs(), minutesOfDay(), bookingResolveCacheEntry, CodeshareFingerprint(), roundTimeToMinutes(), mergeExplorePriceRows(), exploreDestRow, exploreLiveCandidate (+17 more)

### Community 76 - "flyfix.ts"
Cohesion: 0.25
Nodes (8): apiPost(), FlyfixInsightsGroup, FlyfixIssue, FlyfixRefinedReport, FlyfixSummary, refineIssues(), RefineIssuesRequestBody, cancelSearchSession()

### Community 77 - "dealsCache.ts"
Cohesion: 0.25
Nodes (15): DealsState, MonthDealsResponse, CachedDealsResults, clearPendingDealsParams(), DealsParams, dealsParamsFingerprint(), getCachedDealsResults(), getLocalStorage() (+7 more)

### Community 78 - "affiliate.ts"
Cohesion: 0.27
Nodes (9): AffiliateProvider, AffiliateProviderResponse, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink(), OutboundLinkResponse (+1 more)

### Community 79 - "exchangeRates.ts"
Cohesion: 0.31
Nodes (7): useExchangeRates(), convertPrice(), CURRENCY_SYMBOLS, CurrencyCode, ensureRates(), fetchRates(), ratesToUSD

### Community 80 - "itinerary_test.go"
Cohesion: 0.19
Nodes (16): AttachCanonicalIdentity(), segTLVJFK(), TestCanonicalItineraryFingerprint_connectingFlight(), TestCanonicalItineraryFingerprint_differentFlightsDoNotCollide(), TestCanonicalItineraryFingerprint_directFlight(), TestCanonicalItineraryFingerprint_excludesPrice(), TestCanonicalItineraryFingerprint_formattingStable(), TestCanonicalItineraryFingerprint_gf2AirlineNameStable() (+8 more)

### Community 81 - "resolveAirlineLabel"
Cohesion: 0.18
Nodes (16): AIRLINE_NAMES, getAirlineName(), resolveAirlineLabel(), AIRLINE_FULL_NAMES, f, FiltersPanel(), Chip(), displayAirlineLabel() (+8 more)

### Community 82 - "searchRouteUrl.ts"
Cohesion: 0.39
Nodes (7): buildSearchString(), openUrlInNewTab(), openUrlInNewTabOrAlert(), openUrlSameTab(), buildFlyFixSearchResultsUrl(), FlyFixLegSearchParams, openFlyFixLegSearchInNewTab()

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
Cohesion: 0.10
Nodes (32): bookingResolveMaxConcurrentFromEnv(), envDurationMinutes(), init(), init(), budgetCfg(), BudgetModeEnabled(), durationFromEnvMin(), envTruthy() (+24 more)

### Community 88 - "expedia.js"
Cohesion: 0.27
Nodes (5): runWithRetries(), expediaUrl(), scrapeExpedia(), attachJsonCapture(), gotoAndSettle()

### Community 89 - "LocaleContext.tsx"
Cohesion: 0.18
Nodes (17): getStorage(), languageToLocale(), loadSaved(), LocaleContext, LocaleContextValue, LocaleProvider(), save(), VALID_CURRENCIES (+9 more)

### Community 92 - "ValidateBookingURL"
Cohesion: 0.18
Nodes (13): gf2CheckoutOffers(), classifyURLType(), TestClassifyURLType_genericVsExact(), IsCheckoutBookingURL(), IsNonBookableDomain(), TestIsCheckoutBookingURL_rejectsFlightSearchPages(), TestIsNonBookableDomain_blocksFlightRadar(), TestValidateBookingURL_acceptsHTTPS() (+5 more)

### Community 93 - "warm.js"
Cohesion: 0.18
Nodes (6): DEFAULT_SITES, scrapeAll(), app, express, mergeConfig(), warmStatus()

### Community 94 - "booking.ts"
Cohesion: 0.36
Nodes (8): BookingResolveRequest, BookingResolveStatus, bookingRetryDelayMs(), fetchBookingResolveOnce(), isTransientBookingFetchError(), isTransientBookingResolveResponse(), PublicBookingAlternative, resolveBookingOffer()

### Community 95 - "CalendarModal.tsx"
Cohesion: 0.38
Nodes (6): buildMonthDays(), CalendarModal(), getMonthStart(), Props, styles, WEEKDAYS

### Community 96 - "DatePickerCalendar.tsx"
Cohesion: 0.43
Nodes (6): DatePickerCalendar(), DatePickerCalendarProps, getNext14Dates(), getRangeStartEnd(), styles, WEEKDAYS

### Community 101 - "ensure-flight-chrome.sh"
Cohesion: 0.70
Nodes (4): DISPLAY, ensure_gateway_proxy(), log(), ensure-flight-chrome.sh script

## Knowledge Gaps
- **3 isolated node(s):** `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 557 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Fly-Fix` connect `Features` to `MonthDealsScreen.tsx`, `providers.go`?**
  _High betweenness centrality (0.360) - this node is a cross-community bridge._
- **What connects `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `.ResolveQuotedPartnerBooking` be split into smaller, more focused modules?**
  _Cohesion score 0.11336032388663968 - nodes in this community are weakly interconnected._
- **Why does `Multi-provider flight search` connect `providers.go` to `Features`, `budget_config.go`?**
  _High betweenness centrality (0.357) - this node is a cross-community bridge._
- **Should `SearchFormScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09206349206349207 - nodes in this community are weakly interconnected._
- **Why does `Recent enhancements` connect `MonthDealsScreen.tsx` to `Features`, `AppIcon`?**
  _High betweenness centrality (0.344) - this node is a cross-community bridge._
- **Should `ResultsScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06659056316590563 - nodes in this community are weakly interconnected._