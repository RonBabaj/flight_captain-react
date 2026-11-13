# Graph Report - workspace  (2026-11-13)

## Corpus Check
- 303 files · ~255,214 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 16 file(s) not represented in the graph (top: (none) 8, .example 2, .conf 2)

## Summary
- 2536 nodes · 8212 edges · 98 communities (80 shown, 18 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 690 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6c961a50`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- .ResolveQuotedPartnerBooking
- LandingScreen.tsx
- AppIcon
- Issue
- testing.T
- session_store.go
- frontend/package.json
- useTheme
- Features
- FlightOption
- flight-scraper/package.json
- resolveOTAPartnerOffers
- BookingOptionsFooter.tsx
- compilerOptions
- FiltersPanel.tsx
- resolveGF2PartnerOffers
- MonthDealsScreen.tsx
- googleflights2_provider.go
- handleExplore
- booking_resolve.go
- qa_runner.py
- ApiClient
- matcher_test.go
- TestResult
- ResponseValidator
- runtime_config.go
- context.Context
- expo
- config_loader.py
- auth_test.go
- searcher.go
- auth.go
- runBookingMatch
- CombineOneWayBatches
- explore_cache.go
- ValidationIssue
- Backend QA Automation Tool
- test-roundtrip-legs.js
- BookingOffer
- search.ts
- DatePickerCalendar.tsx
- models.py
- ExploreScreen.tsx
- Fly-Fix – Frontend
- DestinationMoodBanner.tsx
- AirportLocation
- test_cases
- LocaleContext.tsx
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
- flyfix.ts
- ResultsScreen.tsx
- affiliate.ts
- client.ts
- npm
- skyscanner.js
- kiwi.js
- skyscanner.js
- nginx-proxy-manager (VPS edge)
- DateRangePicker.tsx
- AuthContext.tsx
- .SearchAll
- time.Duration
- warm.js
- normalizeKiwiItem
- attachQuotedPriceMeta
- handleCreateSession
- dealsCache.ts
- ErrorBoundary
- server_carrier_test.go
- gf2RateLimiter
- session.js
- Fly-Fix UI / UX
- TestApplySoftStrictBaggage
- backend_api_contracts.md
- ensure-edge-proxy.sh
- expedia.js
- install-edge-proxy-cron.sh
- sync-edge-stack.sh
- time.Time
- displayAirlines.ts
- ValidateBookingURL
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
9. `BookingOffer` - 41 edges
10. `runBookingMatch()` - 40 edges

## Surprising Connections (you probably didn't know these)
- `Search form` --references--> `DestinationMoodBanner()`  [INFERRED]
  .cursor/skills/flyfix-ui-ux/SKILL.md → frontend/src/components/DestinationMoodBanner.tsx
- `Cheaper departure cities (positioning optimizer)` --references--> `CheaperCitiesSection()`  [INFERRED]
  README.md → frontend/src/features/flight-search/components/CheaperCitiesSection.tsx
- `Results` --references--> `SortBar()`  [INFERRED]
  .cursor/skills/flyfix-ui-ux/SKILL.md → frontend/src/features/flight-search/components/SortBar.tsx
- `Recent enhancements` --references--> `AppIcon()`  [INFERRED]
  README.md → frontend/src/components/AppIcon.tsx
- `2.1 Get Monthly Deals` --references--> `FullRoundTrip`  [INFERRED]
  backend/backend_api_contracts.md → backend/gf2_deals.go

## Import Cycles
- None detected.

## Communities (98 total, 18 thin omitted)

### Community 0 - ".ResolveQuotedPartnerBooking"
Cohesion: 0.13
Nodes (23): resolveAllPartnerBookingsFromTokenWithRetry(), findBookingOptionsArray(), firstPartnerBookingOption(), firstPartnerURLInMap(), firstStringByKeys(), ResolvedPartnerBooking, isPartnerBookingList(), parseGF2BookingOptions() (+15 more)

### Community 1 - "LandingScreen.tsx"
Cohesion: 0.09
Nodes (29): moodSizeForVariant(), stripStyles, styles, Variant, SiteFooter(), AIRPORT_DICTIONARY, AIRPORT_FALLBACK_IMAGE, ASSIGNED_URLS (+21 more)

### Community 2 - "AppIcon"
Cohesion: 0.07
Nodes (49): AppIcon(), AppIconLibrary, AppIconProps, styles, DestinationMoodBanner(), FormHeroHeader(), FormHeroHeaderProps, styles (+41 more)

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "testing.T"
Cohesion: 0.04
Nodes (73): TestAllocateLegQuoteAmount_splitOpenJaw(), TestLegDeepLink_rejectsMisalignedPartnerArrays(), TestLegDeepLink_rejectsWrongAirlineDirectCheckout(), TestQuoteBindingFromOption_usesOriginalWhenEstimate(), TestQuoteBindingFromOption_usesStoredLegPrice(), TestResolveGF2PartnerOffer_skipsSkyscannerDeepLink(), TestResolveGF2PartnerOffer_usesPersistedLegDeepLinkWithoutProvider(), TestSearchRequestFromSession_singleLegOverride() (+65 more)

### Community 5 - "session_store.go"
Cohesion: 0.13
Nodes (29): ProviderSearchStats, SearchProgress, SearchSession, SearchSessionResultsResponse, SearchSessionStatus, loadSearchSession(), markSessionFailed(), publishSearchProgress() (+21 more)

### Community 6 - "frontend/package.json"
Cohesion: 0.06
Nodes (41): config, { getDefaultConfig }, dependencies, expo@~52.0.0, @expo/metro-runtime@~4.0.1, expo-status-bar@~2.0.0, react@18.3.1, react-dom@18.3.1 (+33 more)

### Community 7 - "useTheme"
Cohesion: 0.06
Nodes (78): ClearableTextInput(), ClearableTextInputProps, styles, styles, EditSearchModalProps, s, s, SearchSummaryBarProps (+70 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (31): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+23 more)

### Community 9 - "FlightOption"
Cohesion: 0.07
Nodes (58): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, Carrier, TestProviderResultsToFlightOptions_PreservesCarrierName(), DayDeal, FareBreakdown (+50 more)

### Community 10 - "flight-scraper/package.json"
Cohesion: 0.11
Nodes (17): express, playwright, dependencies, express@^4.21.2, playwright@^1.49.1, description, engines, node (+9 more)

### Community 11 - "resolveOTAPartnerOffers"
Cohesion: 0.11
Nodes (19): applySearchQuoteToOffer(), dedupeGF2PartnerOffers(), gf2PartnerOfferFromQuoteURL(), gf2PartnerOfferFromResolved(), gf2PartnerOfferFromURL(), optionVendorFromQuote(), providerDomainFromURL(), TestGF2PartnerOfferFromURL_acceptsHTTPS() (+11 more)

### Community 12 - "BookingOptionsFooter.tsx"
Cohesion: 0.15
Nodes (30): BookingResolveResponse, isSafeBookingUrl(), PublicBookingOffer, bookingOfferProviderLabel(), bookingOfferSubtitle(), formatBookingOfferPriceAmount(), formatBookingOfferPriceLine(), formatProviderDisplayName() (+22 more)

### Community 13 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 14 - "FiltersPanel.tsx"
Cohesion: 0.29
Nodes (9): formatAirlineFilterLabel(), f, FiltersPanel(), Chip(), countByStopsFilter(), matchesStopsFilter(), maxStopsPerLeg(), stopsPerLeg() (+1 more)

### Community 15 - "resolveGF2PartnerOffers"
Cohesion: 0.09
Nodes (44): BuildLegAirlineDirectURL(), BuildRedirectURL(), getAffiliateID(), stripEmptyQueryParams(), TestBuildLegAirlineDirectURL_wizzPathNotHash(), TestBuildLegAirlineDirectURL_wizzRoundTripReturnDate(), allocateLegQuoteAmount(), flightLegDurationMinutes() (+36 more)

### Community 16 - "MonthDealsScreen.tsx"
Cohesion: 0.06
Nodes (49): getFlightDetails(), DisplayPrice(), DisplayPriceProps, EditSearchModal(), HubRouteLeg, HubRouteSummaryModal(), HubRouteSummaryModalProps, s (+41 more)

### Community 17 - "googleflights2_provider.go"
Cohesion: 0.13
Nodes (38): TestParseGF2TimeWithDateHint_AirportLocal(), TestExtractGF2BookingToken(), TestExtractGF2BookingURL(), TestBuildGF2ResultFromItinerary_FlatFormat(), TestParseGF2Response_AttachesFlatReturnFlights(), TestParseGF2Response_RapidAPIFlatTopFlights(), TestExtractGF2Leg_TimeOnly_NoDateHint(), TestExtractGF2SegmentFromFlight_CodeOnlyHasNoName() (+30 more)

### Community 18 - "handleExplore"
Cohesion: 0.20
Nodes (11): exploreSessionKey(), getExploreSession(), newExploreSessionID(), putExploreSession(), startExploreSessionCleanup(), exploreSession, corsMiddleware(), fetchExchangeRates() (+3 more)

### Community 19 - "booking_resolve.go"
Cohesion: 0.08
Nodes (80): TestLookupAirlineIATA_Israir(), bookingResolveMaxConcurrentFromEnv(), envDurationMinutes(), init(), extractFlightNumbers(), flightNumberInText(), flightNumbersEquivalent(), splitFlightDesignator() (+72 more)

### Community 22 - "matcher_test.go"
Cohesion: 0.15
Nodes (33): classifyURLType(), extractPrice(), cfgTest(), floatPtr(), TestClassifyURLType_genericVsExact(), testConnectingTLVJFK(), TestExtractPrice_euroPrefixNotArrivalTime(), TestGenerateQueries_connecting() (+25 more)

### Community 23 - "TestResult"
Cohesion: 0.19
Nodes (3): ResponseAnalyzer, main(), _print_unreachable_backend_hint()

### Community 25 - "runtime_config.go"
Cohesion: 0.22
Nodes (16): adminAccessConfigured(), configRangeError, adminTokenConfigured(), defaultRuntimeConfig(), errConfigOutOfRange(), getRuntimeConfig(), handleAdminRuntimeConfig(), initRuntimeConfigStore() (+8 more)

### Community 26 - "context.Context"
Cohesion: 0.11
Nodes (21): DedupeProviderResults(), ItineraryFingerprint(), mergeSelfTransfer(), uniqueStrings(), cheapestReturnLeg(), classicRoundTripMissingReturn(), providerResultArrivalAirport(), TestDoSearchWithRetry_doesNotCacheRoundTrip() (+13 more)

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.30
Nodes (10): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+2 more)

### Community 29 - "auth_test.go"
Cohesion: 0.36
Nodes (11): handleAuthLogin(), initAuthStore(), purgeExpiredAuthSessions(), purgeExpiredAuthSessionsLoop(), initTestAuthDB(), randomTestPassword(), TestAuthLoginAndChangePassword(), TestAuthRegister() (+3 more)

### Community 30 - "searcher.go"
Cohesion: 0.10
Nodes (25): corpusText(), domainFromURL(), elapsedMs(), logMatchEvent(), countVerifiedPricedOffers(), MatchItinerary(), NewResolver(), truncateStr() (+17 more)

### Community 31 - "auth.go"
Cohesion: 0.11
Nodes (46): getOTAProvider(), GetSessionAndOption(), ParseOptionIndex(), RecordClick(), ResolveProvider(), authUserJSON(), bearerTokenFromRequest(), bootstrapAdminUser() (+38 more)

### Community 32 - "runBookingMatch"
Cohesion: 0.05
Nodes (63): isTransientGF2BookingErr(), prodShapeKiwiIsrairOption(), TestHandleBookingResolve_prodShapeKiwiIsrairHTTP(), TestRunBookingMatch_kiwiWizzAirlinePrimaryWithKiwiSecondary(), TestRunBookingMatch_prodShapeKiwiIsrairGetsAirlinePrefill(), isOTAScrapedSource(), otaListingPrefillURL(), TestIsOTAScrapedSource() (+55 more)

### Community 33 - "CombineOneWayBatches"
Cohesion: 0.18
Nodes (13): TestCombineOneWayBatches(), TestCombineOneWayBatches_emptyBatch(), TestCombineOneWayBatches_openJawReturnDiversity(), TestAttachCanonicalIdentityAll_combineOneWay(), cloneLegs(), CombineOneWayBatches(), extraLegMaxPerBatch(), finalizeCombinedBatches() (+5 more)

### Community 34 - "explore_cache.go"
Cohesion: 0.13
Nodes (19): airportCoord, exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut(), getAirportCoord() (+11 more)

### Community 36 - "Backend QA Automation Tool"
Cohesion: 0.18
Nodes (10): Backend QA Automation Tool, Features, If the run feels slow or “stuck”, Notes, Optional AI Setup (Ollama), Output, Project Structure, Run (+2 more)

### Community 37 - "test-roundtrip-legs.js"
Cohesion: 0.12
Nodes (20): a, arr, assert, b, dep, late, assert, frSegs (+12 more)

### Community 38 - "BookingOffer"
Cohesion: 0.14
Nodes (37): airlineDomainForCarrier(), bookingMatchPriceNormalizer(), isAffiliateTemplateBookingURL(), marketingCarrierForLegIndex(), normalizedGF2OfferPrice(), offersIncludeAirlineDirect(), preferAirlineDirectWhenCheaperThanMarkedUpOTA(), publicAlternativesFromOffers() (+29 more)

### Community 39 - "search.ts"
Cohesion: 0.12
Nodes (28): CachedResult, createSearchSession(), createSearchSessionWithRetry(), ensureLegacyPurge(), fetchFresh(), getFromStorage(), getSearchSessionResults(), getStorage() (+20 more)

### Community 40 - "DatePickerCalendar.tsx"
Cohesion: 0.25
Nodes (9): getDealsRange(), GetDealsRangeParams, GetMonthDealsParams, DatePickerCalendar(), DatePickerCalendarProps, getNext14Dates(), getRangeStartEnd(), styles (+1 more)

### Community 42 - "ExploreScreen.tsx"
Cohesion: 0.06
Nodes (80): getMonthDeals(), ExploreResponse, getExploreDestinations(), GetExploreDestinationsParams, AIRPORT_ONLY_DICTIONARY, FULL_PLACE_DICTIONARY, getAirportDisplayName(), getAirportEntry() (+72 more)

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "DestinationMoodBanner.tsx"
Cohesion: 0.11
Nodes (14): __dirname, dist, indexHtml, indexPath, SPA_ROUTES, byCity, compact, curatedCities (+6 more)

### Community 45 - "AirportLocation"
Cohesion: 0.14
Nodes (16): AirportLocation(), TestAirportLocation_UnknownFallsBackUTC(), TestParseGF2TimeWithDateHint_TelAviv(), TestParseGF2Time_EuropeanDateFormat(), TestExtractGF2Leg_SingleSegment_DepartArriveDiffer(), TestExtractGF2Leg_TimeOnly_WithDateHint(), TestParseGF2Time_AcceptsFullDateTime(), TestParseGF2Time_NumericOffsetIsAbsolute() (+8 more)

### Community 46 - "test_cases"
Cohesion: 0.05
Nodes (40): departureDate, origin, byProvider, currency, error, from, items, route (+32 more)

### Community 47 - "LocaleContext.tsx"
Cohesion: 0.07
Nodes (43): App(), linking, RTLWrapper(), Nav, styles, getStorage(), languageToLocale(), loadSaved() (+35 more)

### Community 53 - "SearchRequest"
Cohesion: 0.08
Nodes (33): TestParseOtaOffers_normalizesIsrairDisplayName(), TestParseOtaOffers_IsrairNameToIATA(), TestCompleteExtraLegs(), TestExtraLegsFingerprint(), ParseOtaOffers(), parseOtaOffers(), truncateStr(), TestParseOtaOffers_dropsSkyscannerMetaDeepLink() (+25 more)

### Community 54 - "Nginx Proxy Manager — fly-fix TLS checklist"
Cohesion: 0.40
Nodes (4): Nginx Proxy Manager — fly-fix TLS checklist, Reissue frontend cert (both names), Required proxy-host settings, Symptoms Chrome shows

### Community 55 - "booking.ts"
Cohesion: 0.36
Nodes (8): BookingResolveRequest, BookingResolveStatus, bookingRetryDelayMs(), fetchBookingResolveOnce(), isTransientBookingFetchError(), isTransientBookingResolveResponse(), PublicBookingAlternative, resolveBookingOffer()

### Community 56 - "FlightDetailsModal.tsx"
Cohesion: 0.18
Nodes (21): getAirportNameByCode(), airportTimeZones, getAirportTimeZone(), cabinLabel(), FlightDetailsModal(), formatDuration(), layoverBetween(), legDuration() (+13 more)

### Community 58 - "FlightResultCard.tsx"
Cohesion: 0.15
Nodes (22): FiltersPanelProps, FlightDetailsModalProps, buildRoutePath(), c, FlightResultCard(), FlightResultCardProps, LegScheduleBlock(), PositioningLegResult (+14 more)

### Community 59 - "steps"
Cohesion: 0.09
Nodes (22): runs-on, steps, jobs, deploy, name, on, push, workflow_dispatch (+14 more)

### Community 60 - "flyfix-api"
Cohesion: 0.06
Nodes (37): context, FLIGHT_SCRAPER_MAX_CONCURRENT, FLIGHT_SCRAPER_URL, PLAYWRIGHT_HEADLESS, PORT, SCRAPER_CDP_URLS, SCRAPER_PROXY_URL, SCRAPER_WARM_ON_START (+29 more)

### Community 61 - "flyfix.ts"
Cohesion: 0.29
Nodes (7): apiPost(), FlyfixInsightsGroup, FlyfixIssue, FlyfixRefinedReport, FlyfixSummary, refineIssues(), RefineIssuesRequestBody

### Community 62 - "ResultsScreen.tsx"
Cohesion: 0.05
Nodes (88): collectTripDestinationCodes(), DestinationMoodStrip(), DynamicDestinationsFormContent(), DynamicDestinationsFormContentProps, defaultParams, DynamicDestinationsScreen(), Nav, styles (+80 more)

### Community 63 - "affiliate.ts"
Cohesion: 0.27
Nodes (9): AffiliateProvider, AffiliateProviderResponse, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink(), OutboundLinkResponse (+1 more)

### Community 64 - "client.ts"
Cohesion: 0.19
Nodes (13): searchAirports(), API_BASE, apiGet(), apiRequest(), apiUrl(), isLocalHostname(), resolveApiBase(), GetFlightDetailsParams (+5 more)

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
Cohesion: 0.13
Nodes (20): fetchRuntimeConfig(), setRuntimeConfigStore(), RuntimeConfigContext, RuntimeConfigContextValue, RuntimeConfigProvider(), useRuntimeConfig(), buildMonthDays(), DateRangePicker() (+12 more)

### Community 71 - "AuthContext.tsx"
Cohesion: 0.17
Nodes (24): authHeaders(), AuthUser, changePassword(), createUser(), deleteUser(), fetchAuthMe(), fetchUsers(), LoginResponse (+16 more)

### Community 72 - ".SearchAll"
Cohesion: 0.15
Nodes (9): TestRegistryFailureMessage_transientOutbound(), TestRegistrySearchAll_openJawGF2FailNotMaskedByKiwiSkip(), TestRegistrySearchAllPartialFailure(), isFastProvider(), isSkippedProviderErr(), IsTransientSearchErrMsg(), MultiSearchResult, Registry (+1 more)

### Community 73 - "time.Duration"
Cohesion: 0.07
Nodes (29): init(), budgetCfg(), BudgetModeEnabled(), durationFromEnvMin(), envTruthy(), ExploreBudgetLimits(), FilterProviderNamesForBudget(), GF2EffectiveCacheTTL() (+21 more)

### Community 74 - "warm.js"
Cohesion: 0.08
Nodes (28): cdpLockBusy(), chain, runWithOpenPage(), DEFAULT_SITES, hasCdp(), runOne(), scrapeAll(), SITE_FNS (+20 more)

### Community 75 - "normalizeKiwiItem"
Cohesion: 0.19
Nodes (18): TestParseOTASegmentTime_AirportWallClock(), asArray(), collectCarriers(), detectSelfTransfer(), extractKiwiLegs(), firstFloat(), firstString(), kiwiSegmentFromMap() (+10 more)

### Community 76 - "attachQuotedPriceMeta"
Cohesion: 0.50
Nodes (4): attachQuotedPriceMeta(), redactPriceMismatchCheckoutURLs(), TestAttachQuotedPriceMeta_detectsMismatch(), convertPrice()

### Community 77 - "handleCreateSession"
Cohesion: 0.31
Nodes (5): CreateSearchSessionRequest, ExtraSearchLeg, SearchTransientRetryMax(), finalizeSearchSession(), handleCreateSession()

### Community 78 - "dealsCache.ts"
Cohesion: 0.25
Nodes (15): DealsState, MonthDealsResponse, CachedDealsResults, clearPendingDealsParams(), DealsParams, dealsParamsFingerprint(), getCachedDealsResults(), getLocalStorage() (+7 more)

### Community 79 - "ErrorBoundary"
Cohesion: 0.15
Nodes (4): ErrorBoundary, Props, s, State

### Community 80 - "server_carrier_test.go"
Cohesion: 0.43
Nodes (6): CarrierCodes, makeOfferWithCarriers(), TestExtractCarrierCodes(), TestPrimaryDisplayCarrier(), ExtractCarrierCodes(), PrimaryDisplayCarrier()

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

### Community 88 - "expedia.js"
Cohesion: 0.35
Nodes (4): expediaUrl(), scrapeExpedia(), attachJsonCapture(), gotoAndSettle()

### Community 92 - "time.Time"
Cohesion: 0.12
Nodes (21): GetClicksSummary(), minutesOfDay(), roundTimeToMinutes(), ClickRecord, ClicksSummaryResponse, exploreDestRow, FullRoundTrip, attachReturnLegKeepPrice() (+13 more)

### Community 95 - "displayAirlines.ts"
Cohesion: 0.28
Nodes (12): AIRLINE_NAMES, getAirlineName(), resolveAirlineLabel(), AIRLINE_FULL_NAMES, displayAirlineLabel(), distinctMarketingCarriers(), formatFlightDesignator(), formatSegmentCarrierLine() (+4 more)

### Community 97 - "ValidateBookingURL"
Cohesion: 0.20
Nodes (11): gf2CheckoutOffers(), IsCheckoutBookingURL(), IsNonBookableDomain(), TestIsCheckoutBookingURL_rejectsFlightSearchPages(), TestIsNonBookableDomain_blocksFlightRadar(), TestValidateBookingURL_acceptsHTTPS(), TestValidateBookingURL_rejectsEmpty(), TestValidateBookingURL_rejectsJavascript() (+3 more)

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

- **Why does `Fly-Fix` connect `Features` to `time.Duration`, `ResultsScreen.tsx`?**
  _High betweenness centrality (0.331) - this node is a cross-community bridge._
- **What connects `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `.ResolveQuotedPartnerBooking` be split into smaller, more focused modules?**
  _Cohesion score 0.12773109243697478 - nodes in this community are weakly interconnected._
- **Why does `Multi-provider flight search` connect `time.Duration` to `Features`?**
  _High betweenness centrality (0.321) - this node is a cross-community bridge._
- **Should `LandingScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08907563025210084 - nodes in this community are weakly interconnected._
- **Why does `Recent enhancements` connect `ResultsScreen.tsx` to `Features`, `AppIcon`?**
  _High betweenness centrality (0.315) - this node is a cross-community bridge._
- **Should `AppIcon` be split into smaller, more focused modules?**
  _Cohesion score 0.07179487179487179 - nodes in this community are weakly interconnected._