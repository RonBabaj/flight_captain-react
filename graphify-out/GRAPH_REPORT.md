# Graph Report - workspace  (2026-11-04)

## Corpus Check
- 260 files · ~227,118 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: (none) 8, .example 2, .mdc 1)

## Summary
- 2260 nodes · 7103 edges · 98 communities (81 shown, 17 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 567 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3ef9d4ae`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- .ResolveQuotedPartnerBooking
- react
- ResultsScreen.tsx
- Issue
- FlightDetailsModal.tsx
- dealsCache.ts
- package.json
- useTheme
- Features
- auth_test.go
- kiwi.js
- SearchRequest
- BookingOptionsFooter.tsx
- compilerOptions
- runBookingMatch
- canonical_booking_test.go
- MonthDealsScreen.tsx
- googleflights2_provider.go
- server.go
- qa_runner.py
- ApiClient
- matcher_test.go
- TestResult
- ResponseValidator
- runtime_config.go
- booking_gf2_resolve.go
- expo
- config_loader.py
- RuntimeConfigContext.tsx
- CanonicalItinerary
- api.ts
- itinerary.go
- testing.T
- explore_cache.go
- ValidationIssue
- Backend QA Automation Tool
- SearchFormScreen.tsx
- LocaleContext.tsx
- search.ts
- skyscanner.ts
- models.py
- AirportAutocomplete.tsx
- Fly-Fix – Frontend
- destinationMood.test.ts
- auth.go
- test_cases
- itineraryStops.ts
- gen_explore_airport_coords.py
- flightcaptainweb
- session_store.go
- Nginx Proxy Manager — fly-fix TLS checklist
- ExploreScreen.tsx
- BookingOffer
- .finalize
- AppIcon
- steps
- flyfix-api
- ProviderResult
- client.ts
- .Search
- ErrorBoundary
- npm
- CalendarModal.tsx
- GF2SearchAirports
- flightTimeDisplay.ts
- nginx-proxy-manager (VPS edge)
- AuthContext.tsx
- Registry
- normalizeKiwiItem
- server_carrier_test.go
- time.Time
- flyfix.ts
- exchangeRates.ts
- affiliate.ts
- DatePickerCalendar.tsx
- SearchLoadingOverlay.tsx
- FlightResultCard.tsx
- net/http.Request
- Fly-Fix UI / UX
- TestApplySoftStrictBaggage
- backend_api_contracts.md
- ensure-edge-proxy.sh
- budget_config.go
- booking_resolve.go
- booking.ts
- install-edge-proxy-cron.sh
- sync-edge-stack.sh
- ValidateBookingURL
- CombineOneWayBatches
- OtaScraperProvider
- ota_scraper_provider.go
- exploreDestRow
- gf2ExploreResolveDeps

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

## Communities (98 total, 17 thin omitted)

### Community 0 - ".ResolveQuotedPartnerBooking"
Cohesion: 0.15
Nodes (19): findBookingOptionsArray(), firstPartnerBookingOption(), firstPartnerURLInMap(), firstStringByKeys(), ResolvedPartnerBooking, isPartnerBookingList(), parseGF2BookingOptions(), partnerRequestTokenFromMap() (+11 more)

### Community 1 - "react"
Cohesion: 0.10
Nodes (26): App(), linking, RTLWrapper(), styles, DynamicDestinationsStack(), Stack, RootNavigator(), Stack (+18 more)

### Community 2 - "ResultsScreen.tsx"
Cohesion: 0.07
Nodes (49): DynamicDestinationsFormContentProps, defaultParams, DynamicDestinationsScreen(), Nav, styles, f, FiltersPanel(), FiltersPanelProps (+41 more)

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "FlightDetailsModal.tsx"
Cohesion: 0.16
Nodes (21): AIRLINE_NAMES, getAirlineName(), resolveAirlineLabel(), AIRLINE_FULL_NAMES, cabinLabel(), FlightDetailsModal(), FlightDetailsModalProps, formatDuration() (+13 more)

### Community 5 - "dealsCache.ts"
Cohesion: 0.25
Nodes (15): DealsState, MonthDealsResponse, CachedDealsResults, clearPendingDealsParams(), DealsParams, dealsParamsFingerprint(), getCachedDealsResults(), getLocalStorage() (+7 more)

### Community 6 - "package.json"
Cohesion: 0.06
Nodes (39): config, { getDefaultConfig }, dependencies, expo@~52.0.0, @expo/metro-runtime@~4.0.1, expo-status-bar@~2.0.0, react@18.3.1, react-dom@18.3.1 (+31 more)

### Community 7 - "useTheme"
Cohesion: 0.08
Nodes (50): ClearableTextInput(), ClearableTextInputProps, styles, useAuth(), useLocale(), AccountScreen(), styles, ConfigFieldRow() (+42 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (33): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+25 more)

### Community 9 - "auth_test.go"
Cohesion: 0.18
Nodes (11): exploreSessionKey(), getExploreSession(), newExploreSessionID(), putExploreSession(), startExploreSessionCleanup(), exploreSession, corsMiddleware(), fetchExchangeRates() (+3 more)

### Community 10 - "kiwi.js"
Cohesion: 0.08
Nodes (40): express, playwright, dependencies, express@^4.21.2, playwright@^1.49.1, description, engines, node (+32 more)

### Community 11 - "SearchRequest"
Cohesion: 0.11
Nodes (26): TestCompleteExtraLegs(), TestExtraLegsFingerprint(), TestHasExtraLegs(), legSearchRetryable(), parseKiwiApifyItems(), parseKiwiOffers(), TestParseKiwiApifyItemsSolidcodeShape(), TestParseKiwiEmptyAndInvalid() (+18 more)

### Community 12 - "BookingOptionsFooter.tsx"
Cohesion: 0.17
Nodes (26): BookingResolveResponse, isSafeBookingUrl(), PublicBookingOffer, bookingOfferProviderLabel(), bookingOfferSubtitle(), formatBookingOfferPriceAmount(), formatBookingOfferPriceLine(), formatProviderDisplayName() (+18 more)

### Community 13 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 14 - "runBookingMatch"
Cohesion: 0.12
Nodes (23): intPtrOrNil(), legRouteLabel(), TestCanonicalItineraryForOption_isolatesSplitLegs(), runBookingMatch(), TestHandleBookingResolve_prefillFallback(), TestRunBookingMatch_picksCheapestAmongMultipleGF2Partners(), TestRunBookingMatch_picksCheapestWebOfferOverGF2Partner(), TestRunBookingMatch_prefersAirlineDirectWhenOTAAboveSearchQuote() (+15 more)

### Community 15 - "canonical_booking_test.go"
Cohesion: 0.07
Nodes (51): BuildLegAirlineDirectURL(), BuildRedirectURL(), getAffiliateID(), GetClicksSummary(), getOTAProvider(), GetSessionAndOption(), ParseOptionIndex(), ResolveProvider() (+43 more)

### Community 16 - "MonthDealsScreen.tsx"
Cohesion: 0.06
Nodes (44): EditSearchModal(), EditSearchModalProps, s, HubRouteLeg, HubRouteSummaryModal(), HubRouteSummaryModalProps, s, s (+36 more)

### Community 17 - "googleflights2_provider.go"
Cohesion: 0.07
Nodes (60): AirportLocation(), TestAirportLocation_UnknownFallsBackUTC(), TestParseGF2TimeWithDateHint_AirportLocal(), TestParseGF2TimeWithDateHint_TelAviv(), TestParseGF2TimeWithDateHint_ZSuffixWallClock(), TestExtractGF2BookingToken(), TestExtractGF2BookingURL(), TestExtractGF2PartnerBookingTokenPrefersPartnerURL() (+52 more)

### Community 18 - "server.go"
Cohesion: 0.07
Nodes (53): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, Carrier, CreateSearchSessionRequest, DayDeal, ExtraSearchLeg (+45 more)

### Community 22 - "matcher_test.go"
Cohesion: 0.15
Nodes (33): classifyURLType(), extractPrice(), cfgTest(), floatPtr(), TestClassifyURLType_genericVsExact(), testConnectingTLVJFK(), TestExtractPrice_euroPrefixNotArrivalTime(), TestGenerateQueries_connecting() (+25 more)

### Community 23 - "TestResult"
Cohesion: 0.19
Nodes (3): ResponseAnalyzer, main(), _print_unreachable_backend_hint()

### Community 25 - "runtime_config.go"
Cohesion: 0.19
Nodes (18): adminAccessConfigured(), isAdminRequest(), configRangeError, adminTokenConfigured(), adminTokenFromHeader(), defaultRuntimeConfig(), errConfigOutOfRange(), getRuntimeConfig() (+10 more)

### Community 26 - "booking_gf2_resolve.go"
Cohesion: 0.08
Nodes (39): allocateLegQuoteAmount(), applySearchQuoteToOffer(), attachQuotedPriceMeta(), flightLegDurationMinutes(), gf2PartnerOfferFromQuoteURL(), gf2PartnerOfferFromResolved(), gf2PartnerOfferFromURL(), isTransientGF2BookingErr() (+31 more)

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.30
Nodes (10): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+2 more)

### Community 29 - "RuntimeConfigContext.tsx"
Cohesion: 0.16
Nodes (21): apiRequest(), adminAuthHeaders(), fetchAdminRuntimeConfig(), fetchRuntimeConfig(), saveAdminRuntimeConfig(), setRuntimeConfigStore(), RuntimeConfigContext, RuntimeConfigContextValue (+13 more)

### Community 30 - "CanonicalItinerary"
Cohesion: 0.11
Nodes (25): corpusText(), domainFromURL(), elapsedMs(), logMatchEvent(), countVerifiedPricedOffers(), MatchItinerary(), NewResolver(), truncateStr() (+17 more)

### Community 31 - "api.ts"
Cohesion: 0.15
Nodes (13): SearchState, AirportCityType, AirportLike, BaggageClass, Carrier, COUNTRY_DEST_PREFIX, ExplorePriceSource, FareBreakdown (+5 more)

### Community 32 - "itinerary.go"
Cohesion: 0.11
Nodes (42): extractFlightNumbers(), flightNumberInText(), flightNumbersEquivalent(), splitFlightDesignator(), textContainsAirport(), textContainsAny(), timeMatches(), connectingFlightQueries() (+34 more)

### Community 33 - "testing.T"
Cohesion: 0.07
Nodes (45): TestLegDeepLink_rejectsMisalignedPartnerArrays(), TestFlightNumbersEquivalent_leadingZeros(), TestSelectBestOffer_cheapestOTAOverAirline(), TestSelectBestOffer_conflictingCandidatesPicksCheapest(), TestSelectBestOffer_missingPrice(), TestSelectBestOffer_prefersPriceAmongSameURLType(), TestSelectBestOffer_prefersQuoteMatchingPrice(), TestSelectBestOffer_rejectsGenericSearchURL() (+37 more)

### Community 34 - "explore_cache.go"
Cohesion: 0.12
Nodes (16): airportCoord, exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut(), getAirportCoord() (+8 more)

### Community 36 - "Backend QA Automation Tool"
Cohesion: 0.18
Nodes (10): Backend QA Automation Tool, Features, If the run feels slow or “stuck”, Notes, Optional AI Setup (Ollama), Output, Project Structure, Run (+2 more)

### Community 37 - "SearchFormScreen.tsx"
Cohesion: 0.07
Nodes (50): SearchLoadingOverlay(), defaultParams, SearchFormScreen(), styles, LandingScreen(), Nav, styles, Breakpoint (+42 more)

### Community 38 - "LocaleContext.tsx"
Cohesion: 0.19
Nodes (16): getStorage(), languageToLocale(), loadSaved(), LocaleContext, LocaleContextValue, LocaleProvider(), save(), VALID_CURRENCIES (+8 more)

### Community 39 - "search.ts"
Cohesion: 0.16
Nodes (25): CachedResult, createSearchSession(), createSearchSessionWithRetry(), ensureLegacyPurge(), fetchFresh(), getFromStorage(), getSearchSessionResults(), getStorage() (+17 more)

### Community 40 - "skyscanner.ts"
Cohesion: 0.36
Nodes (11): FlightLeg, BookingHop, bookingHopsFromOption(), firstSeg(), isClassicRoundTripLegs(), isoDatePrefix(), isSplitBookingItinerary(), lastSeg() (+3 more)

### Community 42 - "AirportAutocomplete.tsx"
Cohesion: 0.08
Nodes (64): getMonthDeals(), getExploreDestinations(), AIRPORT_ONLY_DICTIONARY, FULL_PLACE_DICTIONARY, getAirportDisplayName(), getAirportEntry(), getAirportNameByCode(), getCityDisplayName() (+56 more)

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "destinationMood.test.ts"
Cohesion: 0.12
Nodes (11): __dirname, dist, indexHtml, indexPath, SPA_ROUTES, byCity, curatedCities, curatedUrls (+3 more)

### Community 45 - "auth.go"
Cohesion: 0.17
Nodes (25): authUserJSON(), bootstrapAdminUser(), createAuthSession(), envFlagTrue(), handleAuthLogin(), handleAuthRegister(), handleAuthUsers(), initAuthStore() (+17 more)

### Community 46 - "test_cases"
Cohesion: 0.05
Nodes (40): departureDate, origin, byProvider, currency, error, from, items, route (+32 more)

### Community 47 - "itineraryStops.ts"
Cohesion: 0.48
Nodes (5): countByStopsFilter(), matchesStopsFilter(), maxStopsPerLeg(), stopsPerLeg(), totalStops()

### Community 53 - "session_store.go"
Cohesion: 0.19
Nodes (20): loadSearchSession(), TestLoadSearchSession_Expiry(), searchSessionTTL(), startSearchSessionCleanup(), cleanupPersistedSessions(), importLegacyJSONSessions(), initSessionStore(), loadPersistedSession() (+12 more)

### Community 54 - "Nginx Proxy Manager — fly-fix TLS checklist"
Cohesion: 0.40
Nodes (4): Nginx Proxy Manager — fly-fix TLS checklist, Reissue frontend cert (both names), Required proxy-host settings, Symptoms Chrome shows

### Community 55 - "ExploreScreen.tsx"
Cohesion: 0.18
Nodes (10): AIRPORT_DICTIONARY, ASSIGNED_URLS, BY_CODE, BY_COUNTRY, DestinationMood, FALLBACK_IMAGE, hashCode(), LANDING_MOOD_DESTINATIONS (+2 more)

### Community 56 - "BookingOffer"
Cohesion: 0.13
Nodes (36): airlineDomainForCarrier(), bookingMatchPriceNormalizer(), dedupeGF2PartnerOffers(), gf2OffersHavePrice(), isAffiliateTemplateBookingURL(), marketingCarrierForLegIndex(), normalizedGF2OfferPrice(), offersIncludeAirlineDirect() (+28 more)

### Community 58 - "AppIcon"
Cohesion: 0.09
Nodes (47): AppIcon(), AppIconLibrary, AppIconProps, styles, collectTripDestinationCodes(), DestinationMoodBanner(), DestinationMoodStrip(), stripStyles (+39 more)

### Community 59 - "steps"
Cohesion: 0.09
Nodes (22): runs-on, steps, jobs, deploy, name, on, push, workflow_dispatch (+14 more)

### Community 60 - "flyfix-api"
Cohesion: 0.06
Nodes (32): context, FLIGHT_SCRAPER_URL, PLAYWRIGHT_HEADLESS, PORT, build, container_name, environment, expose (+24 more)

### Community 61 - "ProviderResult"
Cohesion: 0.09
Nodes (22): DedupeProviderResults(), ItineraryFingerprint(), mergeSelfTransfer(), TotalStops(), uniqueStrings(), cheapestReturnLeg(), providerResultArrivalAirport(), TestCheapestReturnLeg() (+14 more)

### Community 62 - "client.ts"
Cohesion: 0.13
Nodes (16): searchAirports(), API_BASE, apiGet(), apiUrl(), isLocalHostname(), resolveApiBase(), GetDealsRangeParams, GetMonthDealsParams (+8 more)

### Community 63 - ".Search"
Cohesion: 0.24
Nodes (9): classicRoundTripMissingReturn(), TestClassicRoundTripMissingReturn(), TestDoSearchWithRetry_doesNotCacheRoundTrip(), TestSearch_ignoresIncompleteClassicRTCache(), TestSearch_servesCompleteClassicRTCache(), newGF2Cache(), TestSearchLegCached_usesCache(), gf2Cache (+1 more)

### Community 64 - "ErrorBoundary"
Cohesion: 0.15
Nodes (4): ErrorBoundary, Props, s, State

### Community 65 - "npm"
Cohesion: 0.17
Nodes (11): networks, proxy, container_name, image, networks, ports, restart, volumes (+3 more)

### Community 66 - "CalendarModal.tsx"
Cohesion: 0.38
Nodes (6): buildMonthDays(), CalendarModal(), getMonthStart(), Props, styles, WEEKDAYS

### Community 67 - "GF2SearchAirports"
Cohesion: 0.25
Nodes (11): gf2MetroKey(), GF2SearchAirports(), limitGF2SearchAirports(), ResolveGF2PlaceCode(), containsAll(), TestGF2SearchAirports_CityOnlyCode(), TestGF2SearchAirports_LondonParis(), TestGF2SearchAirports_SingleAirport() (+3 more)

### Community 68 - "flightTimeDisplay.ts"
Cohesion: 0.24
Nodes (12): airportTimeZones, getAirportTimeZone(), fmtDur(), layoverBetween(), legDuration(), renderLeg(), flightMinutesBetween(), flightTimeToMs() (+4 more)

### Community 69 - "nginx-proxy-manager (VPS edge)"
Cohesion: 0.40
Nodes (4): Deploy sync, First-time / recovery, nginx-proxy-manager (VPS edge), On the server

### Community 71 - "AuthContext.tsx"
Cohesion: 0.17
Nodes (22): authHeaders(), AuthUser, changePassword(), createUser(), deleteUser(), fetchAuthMe(), fetchUsers(), LoginResponse (+14 more)

### Community 72 - "Registry"
Cohesion: 0.18
Nodes (8): TestRegistryFailureMessage_transientOutbound(), TestRegistrySearchAll_openJawGF2FailNotMaskedByKiwiSkip(), TestRegistrySearchAllPartialFailure(), ProviderSearchStats, isSkippedProviderErr(), IsTransientSearchErrMsg(), MultiSearchResult, Registry

### Community 73 - "normalizeKiwiItem"
Cohesion: 0.22
Nodes (16): asArray(), collectCarriers(), detectSelfTransfer(), extractKiwiLegs(), firstFloat(), firstString(), kiwiSegmentFromMap(), mapsToSegments() (+8 more)

### Community 74 - "server_carrier_test.go"
Cohesion: 0.43
Nodes (6): CarrierCodes, makeOfferWithCarriers(), TestExtractCarrierCodes(), TestPrimaryDisplayCarrier(), ExtractCarrierCodes(), PrimaryDisplayCarrier()

### Community 75 - "time.Time"
Cohesion: 0.12
Nodes (21): minutesOfDay(), bookingResolveCacheEntry, roundTimeToMinutes(), FullRoundTrip, attachReturnLegKeepPrice(), ensureRoundTripLegs(), exploreRunLiveBatch(), gf2ExploreSearchOneDestination() (+13 more)

### Community 76 - "flyfix.ts"
Cohesion: 0.25
Nodes (8): apiPost(), FlyfixInsightsGroup, FlyfixIssue, FlyfixRefinedReport, FlyfixSummary, refineIssues(), RefineIssuesRequestBody, cancelSearchSession()

### Community 77 - "exchangeRates.ts"
Cohesion: 0.23
Nodes (11): DisplayPrice(), DisplayPriceProps, useExchangeRates(), convertPrice(), CURRENCY_SYMBOLS, CurrencyCode, ensureRates(), fetchRates() (+3 more)

### Community 78 - "affiliate.ts"
Cohesion: 0.27
Nodes (9): AffiliateProvider, AffiliateProviderResponse, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink(), OutboundLinkResponse (+1 more)

### Community 79 - "DatePickerCalendar.tsx"
Cohesion: 0.39
Nodes (7): getDealsRange(), DatePickerCalendar(), DatePickerCalendarProps, getNext14Dates(), getRangeStartEnd(), styles, WEEKDAYS

### Community 80 - "SearchLoadingOverlay.tsx"
Cohesion: 0.23
Nodes (10): getPhrasesForLanguage(), SEARCH_BUTTON_PHRASES, SEARCH_PROGRESS_PHRASES, s, SearchProgressBanner(), SearchProgressBannerProps, ExtraLeg, Props (+2 more)

### Community 81 - "FlightResultCard.tsx"
Cohesion: 0.25
Nodes (15): buildRoutePath(), c, FlightResultCard(), LegScheduleBlock(), FlightSegment, LayoverSummary, hasMultipleAirlines(), buildLegPreviewSummary() (+7 more)

### Community 82 - "net/http.Request"
Cohesion: 0.26
Nodes (20): RecordClick(), bearerTokenFromRequest(), handleAuthChangePassword(), handleAuthLogout(), handleAuthMe(), handleAdminVerify(), handleGetRuntimeConfig(), handleFlyFixRefineIssues() (+12 more)

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
Nodes (31): init(), budgetCfg(), BudgetModeEnabled(), durationFromEnvMin(), envTruthy(), ExploreBudgetLimits(), FilterProviderNamesForBudget(), GF2EffectiveCacheTTL() (+23 more)

### Community 88 - "booking_resolve.go"
Cohesion: 0.12
Nodes (29): acquireBookingResolveSlot(), beginInflightResolve(), bookingResolveCacheKey(), bookingResolveFailureResponse(), bookingResolveMaxConcurrentFromEnv(), cacheTTLForStatus(), canonicalItineraryForOption(), envDurationMinutes() (+21 more)

### Community 89 - "booking.ts"
Cohesion: 0.36
Nodes (8): BookingResolveRequest, BookingResolveStatus, bookingRetryDelayMs(), fetchBookingResolveOnce(), isTransientBookingFetchError(), isTransientBookingResolveResponse(), PublicBookingAlternative, resolveBookingOffer()

### Community 92 - "ValidateBookingURL"
Cohesion: 0.27
Nodes (11): gf2CheckoutOffers(), IsCheckoutBookingURL(), IsNonBookableDomain(), TestIsCheckoutBookingURL_rejectsFlightSearchPages(), TestIsNonBookableDomain_blocksFlightRadar(), TestValidateBookingURL_acceptsHTTPS(), TestValidateBookingURL_rejectsEmpty(), TestValidateBookingURL_rejectsJavascript() (+3 more)

### Community 93 - "CombineOneWayBatches"
Cohesion: 0.20
Nodes (11): TestCombineOneWayBatches(), TestCombineOneWayBatches_emptyBatch(), TestCombineOneWayBatches_openJawReturnDiversity(), AttachCanonicalIdentityAll(), TestAttachCanonicalIdentityAll_combineOneWay(), cloneLegs(), CombineOneWayBatches(), extraLegMaxPerBatch() (+3 more)

### Community 94 - "OtaScraperProvider"
Cohesion: 0.18
Nodes (6): truncateStr(), OtaScraperProvider, Docker, Flight scraper (multisite), Run locally, VPS notes

### Community 95 - "ota_scraper_provider.go"
Cohesion: 0.20
Nodes (4): parseOtaScraperSites(), otaScraperSearchRequest, otaScraperSearchResponse, otaScraperSiteResult

### Community 96 - "exploreDestRow"
Cohesion: 0.40
Nodes (4): mergeExplorePriceRows(), exploreDestRow, exploreLiveCandidate, exploreDestRowsToMaps()

## Knowledge Gaps
- **2 isolated node(s):** `flightcaptainweb`, `expo/tsconfig.base`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 536 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Fly-Fix` connect `Features` to `MonthDealsScreen.tsx`?**
  _High betweenness centrality (0.362) - this node is a cross-community bridge._
- **What connects `flightcaptainweb`, `expo/tsconfig.base` to the rest of the system?**
  _2 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.10158730158730159 - nodes in this community are weakly interconnected._
- **Why does `Multi-provider flight search` connect `Features` to `budget_config.go`?**
  _High betweenness centrality (0.359) - this node is a cross-community bridge._
- **Should `ResultsScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06885245901639345 - nodes in this community are weakly interconnected._
- **Why does `Recent enhancements` connect `MonthDealsScreen.tsx` to `Features`, `AppIcon`?**
  _High betweenness centrality (0.355) - this node is a cross-community bridge._
- **Should `Issue` be split into smaller, more focused modules?**
  _Cohesion score 0.10365853658536585 - nodes in this community are weakly interconnected._