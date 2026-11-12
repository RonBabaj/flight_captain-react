# Graph Report - workspace  (2026-11-12)

## Corpus Check
- 300 files · ~252,928 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 16 file(s) not represented in the graph (top: (none) 8, .example 2, .conf 2)

## Summary
- 2512 nodes · 8134 edges · 103 communities (82 shown, 21 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 676 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f223ec0f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- .ResolveQuotedPartnerBooking
- LandingScreen.tsx
- SearchFormContent.tsx
- Issue
- AttachCanonicalIdentity
- session_store.go
- frontend/package.json
- useTheme
- Features
- FlightOption
- flight-scraper/package.json
- resolveGF2PartnerOffers
- BookingOptionsFooter.tsx
- compilerOptions
- dealsCache.ts
- canonical_booking_test.go
- MonthDealsScreen.tsx
- googleflights2_provider.go
- FlightLeg
- booking_gf2_resolve.go
- qa_runner.py
- ApiClient
- matcher_test.go
- TestResult
- ResponseValidator
- runtime_config.go
- GF2SearchAirports
- expo
- config_loader.py
- auth.go
- searcher.go
- auth.go
- testing.T
- RuntimeConfigContext.tsx
- explore_cache.go
- ValidationIssue
- Backend QA Automation Tool
- test-roundtrip-legs.js
- BookingOffer
- search.ts
- sharedLinkCache.ts
- models.py
- AirportAutocomplete.tsx
- Fly-Fix – Frontend
- DestinationMoodBanner.tsx
- handleExplore
- test_cases
- time.Duration
- gen_explore_airport_coords.py
- flightcaptainweb
- SearchRequest
- Nginx Proxy Manager — fly-fix TLS checklist
- server.go
- FlightDetailsModal.tsx
- .finalize
- CalendarModal.tsx
- steps
- flyfix-api
- booking.ts
- ResultsScreen.tsx
- affiliate.ts
- client.ts
- npm
- skyscanner.js
- kiwi.js
- useSearchParams.ts
- nginx-proxy-manager (VPS edge)
- ExploreScreen.tsx
- AuthContext.tsx
- .SearchAll
- searchRouteUrl.ts
- scrape.js
- ProviderResult
- DatePickerCalendar.tsx
- otaListingPrefillURL
- itinerary.go
- gf2ExploreResolveDeps
- flyfix.ts
- App.tsx
- session.js
- Fly-Fix UI / UX
- TestApplySoftStrictBaggage
- backend_api_contracts.md
- ensure-edge-proxy.sh
- server_carrier_test.go
- expedia.js
- selectBookingOptionForQuote
- install-edge-proxy-cron.sh
- sync-edge-stack.sh
- time.Time
- Flight scraper (multisite)
- ErrorBoundary
- DraggableBottomSheet.tsx
- TestSanitizeProviderErrorForUser
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
10. `runBookingMatch()` - 39 edges

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

## Communities (103 total, 21 thin omitted)

### Community 0 - ".ResolveQuotedPartnerBooking"
Cohesion: 0.12
Nodes (24): findBookingOptionsArray(), firstPartnerBookingOption(), firstPartnerURLInMap(), firstStringByKeys(), ResolvedPartnerBooking, isPartnerBookingList(), parseGF2BookingOptions(), partnerRequestTokenFromMap() (+16 more)

### Community 1 - "LandingScreen.tsx"
Cohesion: 0.06
Nodes (55): AppIcon(), AppIconLibrary, AppIconProps, styles, SiteFooter(), getSvgMarkup(), getWebIconSvgDataUri(), hasWebSvgFallback() (+47 more)

### Community 2 - "SearchFormContent.tsx"
Cohesion: 0.14
Nodes (21): FormHeroHeader(), FormHeroHeaderProps, styles, formCardStyles, makeFormThemedStyles(), getAlmostDonePhrase(), getPhrasesForLanguage(), SEARCH_ALMOST_DONE (+13 more)

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "AttachCanonicalIdentity"
Cohesion: 0.13
Nodes (20): TotalStops(), AttachCanonicalIdentity(), BuildCanonicalItinerary(), FingerprintDebugString(), ResultMatchesItinerary(), TestResultMatchesItinerary_OTAToGF2AcrossProviders(), TestResultMatchesItinerary_RejectsDifferentFlightNumber(), NormalizeTimestamp() (+12 more)

### Community 5 - "session_store.go"
Cohesion: 0.13
Nodes (29): ProviderSearchStats, SearchProgress, SearchSession, SearchSessionResultsResponse, SearchSessionStatus, loadSearchSession(), markSessionFailed(), publishSearchProgress() (+21 more)

### Community 6 - "frontend/package.json"
Cohesion: 0.06
Nodes (41): config, { getDefaultConfig }, dependencies, expo@~52.0.0, @expo/metro-runtime@~4.0.1, expo-status-bar@~2.0.0, react@18.3.1, react-dom@18.3.1 (+33 more)

### Community 7 - "useTheme"
Cohesion: 0.06
Nodes (80): ClearableTextInput(), ClearableTextInputProps, styles, EditSearchModalProps, s, HubRouteLeg, HubRouteSummaryModalProps, s (+72 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (33): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+25 more)

### Community 9 - "FlightOption"
Cohesion: 0.07
Nodes (39): CanonicalFingerprint(), CodeshareFingerprint(), roundTimeToMinutes(), TestProviderResultsToFlightOptions_PreservesCarrierName(), CreateSearchSessionRequest, ExtraSearchLeg, FlightOption, LayoverSummary (+31 more)

### Community 10 - "flight-scraper/package.json"
Cohesion: 0.11
Nodes (17): express, playwright, dependencies, express@^4.21.2, playwright@^1.49.1, description, engines, node (+9 more)

### Community 11 - "resolveGF2PartnerOffers"
Cohesion: 0.07
Nodes (54): allocateLegQuoteAmount(), applySearchQuoteToOffer(), attachQuotedPriceMeta(), dedupeGF2PartnerOffers(), flightLegDurationMinutes(), gf2OffersHavePrice(), gf2PartnerOfferFromQuoteURL(), gf2PartnerOfferFromResolved() (+46 more)

### Community 12 - "BookingOptionsFooter.tsx"
Cohesion: 0.11
Nodes (37): BookingResolveResponse, isSafeBookingUrl(), PublicBookingOffer, DisplayPrice(), DisplayPriceProps, bookingOfferProviderLabel(), bookingOfferSubtitle(), formatBookingOfferPriceAmount() (+29 more)

### Community 13 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 14 - "dealsCache.ts"
Cohesion: 0.25
Nodes (15): DealsState, MonthDealsResponse, CachedDealsResults, clearPendingDealsParams(), DealsParams, dealsParamsFingerprint(), getCachedDealsResults(), getLocalStorage() (+7 more)

### Community 15 - "canonical_booking_test.go"
Cohesion: 0.10
Nodes (35): BuildLegAirlineDirectURL(), BuildRedirectURL(), getAffiliateID(), stripEmptyQueryParams(), openJawOption(), TestBookingLinkModeDefaultsToSkyscanner(), TestBookingRouteFromSessionOption_splitOmitsReturn(), TestBuildGoogleFlightsFallbackFromParams() (+27 more)

### Community 16 - "MonthDealsScreen.tsx"
Cohesion: 0.10
Nodes (33): getFlightDetails(), CheaperCitiesOption, Props, s, buildDealsPositioningSignature(), dealBestScore(), fl, fmtDur() (+25 more)

### Community 17 - "googleflights2_provider.go"
Cohesion: 0.05
Nodes (72): GetClicksSummary(), elapsedMs(), minutesOfDay(), ClickRecord, ClicksSummaryResponse, AirportLocation(), TestAirportLocation_UnknownFallsBackUTC(), TestParseGF2TimeWithDateHint_AirportLocal() (+64 more)

### Community 18 - "FlightLeg"
Cohesion: 0.12
Nodes (18): AirportLike, Carrier, DayDeal, FareBreakdown, FlightDetailsResponse, FlightLeg, FlightSegment, MonetaryAmount (+10 more)

### Community 22 - "matcher_test.go"
Cohesion: 0.12
Nodes (39): extractPrice(), cfgTest(), floatPtr(), testConnectingTLVJFK(), TestExtractPrice_euroPrefixNotArrivalTime(), TestGenerateQueries_connecting(), TestGenerateQueries_direct(), TestGenerateQueries_gf2AirlineNameIdentity() (+31 more)

### Community 23 - "TestResult"
Cohesion: 0.19
Nodes (3): ResponseAnalyzer, main(), _print_unreachable_backend_hint()

### Community 25 - "runtime_config.go"
Cohesion: 0.19
Nodes (18): adminAccessConfigured(), isAdminRequest(), configRangeError, adminTokenConfigured(), adminTokenFromHeader(), defaultRuntimeConfig(), errConfigOutOfRange(), getRuntimeConfig() (+10 more)

### Community 26 - "GF2SearchAirports"
Cohesion: 0.14
Nodes (16): ExploreBudgetLimits(), resetBudgetEnv(), TestExploreBudgetLimits_budget(), TestExploreBudgetLimits_defaultsWithoutBudget(), TestGF2SearchAirports_budgetCapsMetro(), gf2MetroKey(), GF2SearchAirports(), ResolveGF2PlaceCode() (+8 more)

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
Cohesion: 0.09
Nodes (28): defaultBookingMatchRunner(), corpusText(), domainFromURL(), logMatchEvent(), MatchItinerary(), NewResolver(), truncateStr(), collectSerpAPIResultMaps() (+20 more)

### Community 31 - "auth.go"
Cohesion: 0.14
Nodes (31): getOTAProvider(), GetSessionAndOption(), ParseOptionIndex(), RecordClick(), ResolveProvider(), bearerTokenFromRequest(), handleAuthChangePassword(), handleAuthLogout() (+23 more)

### Community 32 - "testing.T"
Cohesion: 0.09
Nodes (44): prodShapeKiwiIsrairOption(), TestHandleBookingResolve_prodShapeKiwiIsrairHTTP(), TestParseOtaOffers_normalizesIsrairDisplayName(), TestRunBookingMatch_prodShapeKiwiIsrairGetsAirlinePrefill(), TestRunBookingMatch_mergesOTAPartners(), bookingResolveCacheKey(), cacheTTLForStatus(), canonicalItineraryForOption() (+36 more)

### Community 33 - "RuntimeConfigContext.tsx"
Cohesion: 0.17
Nodes (16): apiRequest(), apiUrl(), adminAuthHeaders(), fetchAdminRuntimeConfig(), fetchRuntimeConfig(), saveAdminRuntimeConfig(), setRuntimeConfigStore(), RuntimeConfigContext (+8 more)

### Community 34 - "explore_cache.go"
Cohesion: 0.09
Nodes (20): airportCoord, exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut(), getAirportCoord() (+12 more)

### Community 36 - "Backend QA Automation Tool"
Cohesion: 0.18
Nodes (10): Backend QA Automation Tool, Features, If the run feels slow or “stuck”, Notes, Optional AI Setup (Ollama), Output, Project Structure, Run (+2 more)

### Community 37 - "test-roundtrip-legs.js"
Cohesion: 0.13
Nodes (19): a, arr, assert, b, dep, late, assert, frSegs (+11 more)

### Community 38 - "BookingOffer"
Cohesion: 0.09
Nodes (54): airlineDomainForCarrier(), bookingMatchPriceNormalizer(), isAffiliateTemplateBookingURL(), marketingCarrierForLegIndex(), normalizedGF2OfferPrice(), offersIncludeAirlineDirect(), preferAirlineDirectWhenCheaperThanMarkedUpOTA(), publicAlternativesFromOffers() (+46 more)

### Community 39 - "search.ts"
Cohesion: 0.14
Nodes (27): CachedResult, createSearchSession(), createSearchSessionWithRetry(), ensureLegacyPurge(), fetchFresh(), getFromStorage(), getSearchSessionResults(), getStorage() (+19 more)

### Community 40 - "sharedLinkCache.ts"
Cohesion: 0.18
Nodes (18): isDeepLinkDebugEnabled(), logDeepLinkDiagnostics(), mergeDeepLinkParams(), fromStash, fromUrl, kept, recovery, store (+10 more)

### Community 42 - "AirportAutocomplete.tsx"
Cohesion: 0.08
Nodes (60): DestinationMoodBanner(), moodSizeForVariant(), stripStyles, styles, Variant, AIRPORT_DICTIONARY, AIRPORT_ONLY_DICTIONARY, FULL_PLACE_DICTIONARY (+52 more)

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "DestinationMoodBanner.tsx"
Cohesion: 0.11
Nodes (14): __dirname, dist, indexHtml, indexPath, SPA_ROUTES, byCity, compact, curatedCities (+6 more)

### Community 45 - "handleExplore"
Cohesion: 0.22
Nodes (9): exploreSessionKey(), getExploreSession(), newExploreSessionID(), putExploreSession(), startExploreSessionCleanup(), exploreSession, corsMiddleware(), handleExplore() (+1 more)

### Community 46 - "test_cases"
Cohesion: 0.05
Nodes (40): departureDate, origin, byProvider, currency, error, from, items, route (+32 more)

### Community 47 - "time.Duration"
Cohesion: 0.07
Nodes (31): init(), budgetCfg(), BudgetModeEnabled(), durationFromEnvMin(), envTruthy(), GF2EffectiveCacheTTL(), GF2EffectiveRateLimitPerMin(), GF2MetroConcurrency() (+23 more)

### Community 53 - "SearchRequest"
Cohesion: 0.10
Nodes (29): TestCompleteExtraLegs(), TestExtraLegsFingerprint(), truncateStr(), TestIsOpenJaw(), TestResolveReturnAirports_classic(), TestResolveReturnAirports_openJaw(), TestSanitizeStandardSearchRequest(), TestDynamicDestinationOneWayRequests_extraLegs() (+21 more)

### Community 54 - "Nginx Proxy Manager — fly-fix TLS checklist"
Cohesion: 0.40
Nodes (4): Nginx Proxy Manager — fly-fix TLS checklist, Reissue frontend cert (both names), Required proxy-host settings, Symptoms Chrome shows

### Community 55 - "server.go"
Cohesion: 0.08
Nodes (22): AirportCityResult, AirportCitySearchResponse, AirportCityType, TestExtractGF2BookingURL(), extractGF2BookingURL(), findFirstHTTPSURL(), IsGF2RateLimitError(), IsMetaSearchAggregatorURL() (+14 more)

### Community 56 - "FlightDetailsModal.tsx"
Cohesion: 0.07
Nodes (55): AIRLINE_NAMES, getAirlineName(), resolveAirlineLabel(), AIRLINE_FULL_NAMES, airportTimeZones, getAirportTimeZone(), f, FiltersPanel() (+47 more)

### Community 58 - "CalendarModal.tsx"
Cohesion: 0.38
Nodes (6): buildMonthDays(), CalendarModal(), getMonthStart(), Props, styles, WEEKDAYS

### Community 59 - "steps"
Cohesion: 0.09
Nodes (22): runs-on, steps, jobs, deploy, name, on, push, workflow_dispatch (+14 more)

### Community 60 - "flyfix-api"
Cohesion: 0.06
Nodes (37): context, FLIGHT_SCRAPER_MAX_CONCURRENT, FLIGHT_SCRAPER_URL, PLAYWRIGHT_HEADLESS, PORT, SCRAPER_CDP_URLS, SCRAPER_PROXY_URL, SCRAPER_WARM_ON_START (+29 more)

### Community 61 - "booking.ts"
Cohesion: 0.36
Nodes (8): BookingResolveRequest, BookingResolveStatus, bookingRetryDelayMs(), fetchBookingResolveOnce(), isTransientBookingFetchError(), isTransientBookingResolveResponse(), PublicBookingAlternative, resolveBookingOffer()

### Community 62 - "ResultsScreen.tsx"
Cohesion: 0.06
Nodes (63): collectTripDestinationCodes(), DestinationMoodStrip(), EditSearchModal(), HubRouteSummaryModal(), SearchSummaryBar(), DynamicDestinationsFormContent(), DynamicDestinationsFormContentProps, styles (+55 more)

### Community 63 - "affiliate.ts"
Cohesion: 0.27
Nodes (9): AffiliateProvider, AffiliateProviderResponse, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink(), OutboundLinkResponse (+1 more)

### Community 64 - "client.ts"
Cohesion: 0.14
Nodes (15): searchAirports(), API_BASE, apiGet(), isLocalHostname(), resolveApiBase(), getDealsRange(), GetDealsRangeParams, GetMonthDealsParams (+7 more)

### Community 65 - "npm"
Cohesion: 0.17
Nodes (11): networks, proxy, container_name, image, networks, ports, restart, volumes (+3 more)

### Community 66 - "skyscanner.js"
Cohesion: 0.12
Nodes (35): com, fr, req, kiwiSearchUrl(), addPartner(), clickMatchingKiwiCard(), clickMatchingSkyscannerCard(), clocksFromSegments() (+27 more)

### Community 67 - "kiwi.js"
Cohesion: 0.16
Nodes (24): waitUntil(), offerTemplate(), segment(), segmentsFromRoundTripClocks(), clearKiwiSpaState(), ensureKiwiResultsUrl(), extractFromCaptured(), extractNextData() (+16 more)

### Community 68 - "useSearchParams.ts"
Cohesion: 0.47
Nodes (8): buildSearchString(), getParam(), getParams(), isWeb(), parseSearchParamsFromUrl(), updateSearchUrl(), useSearchParams(), resultsPathFromSharedCache()

### Community 69 - "nginx-proxy-manager (VPS edge)"
Cohesion: 0.40
Nodes (4): Deploy sync, First-time / recovery, nginx-proxy-manager (VPS edge), On the server

### Community 70 - "ExploreScreen.tsx"
Cohesion: 0.09
Nodes (47): getMonthDeals(), getExploreDestinations(), SearchLoadingOverlay(), useRuntimeConfig(), buildMonthDays(), DateRangePicker(), DateRangePickerProps, getMonthStart() (+39 more)

### Community 71 - "AuthContext.tsx"
Cohesion: 0.17
Nodes (22): authHeaders(), AuthUser, changePassword(), createUser(), deleteUser(), fetchAuthMe(), fetchUsers(), LoginResponse (+14 more)

### Community 72 - ".SearchAll"
Cohesion: 0.11
Nodes (14): FilterProviderNamesForBudget(), TestFilterProviderNamesForBudget_disablesKiwi(), TestRegistryFailureMessage_transientOutbound(), TestRegistrySearchAll_openJawGF2FailNotMaskedByKiwiSkip(), TestRegistrySearchAllPartialFailure(), TestRegistrySearchAllWithProgress(), isFastProvider(), isSkippedProviderErr() (+6 more)

### Community 73 - "searchRouteUrl.ts"
Cohesion: 0.36
Nodes (7): SearchUrlState, openUrlInNewTab(), openUrlInNewTabOrAlert(), openUrlSameTab(), buildFlyFixSearchResultsUrl(), FlyFixLegSearchParams, openFlyFixLegSearchInNewTab()

### Community 74 - "scrape.js"
Cohesion: 0.18
Nodes (11): runWithOpenPage(), hasCdp(), runOne(), scrapeAll(), SITE_FNS, beginSearch(), endSearch(), isSearchBusy() (+3 more)

### Community 75 - "ProviderResult"
Cohesion: 0.08
Nodes (26): DedupeProviderResults(), mergeSelfTransfer(), uniqueStrings(), TestCombineOneWayBatches(), TestCombineOneWayBatches_emptyBatch(), TestCombineOneWayBatches_openJawReturnDiversity(), cheapestReturnLeg(), providerResultArrivalAirport() (+18 more)

### Community 76 - "DatePickerCalendar.tsx"
Cohesion: 0.36
Nodes (7): DatePickerCalendar(), DatePickerCalendarProps, getNext14Dates(), getRangeStartEnd(), styles, WEEKDAYS, DayDeal

### Community 77 - "otaListingPrefillURL"
Cohesion: 0.33
Nodes (5): isOTAScrapedSource(), otaListingPrefillURL(), TestIsOTAScrapedSource(), prodShapeSkyscannerEmptyCarrierOption(), TestOtaListingPrefillURL_skyscanner()

### Community 78 - "itinerary.go"
Cohesion: 0.09
Nodes (46): TestLookupAirlineIATA_Israir(), extractFlightNumbers(), flightNumberInText(), flightNumbersEquivalent(), splitFlightDesignator(), textContainsAirport(), textContainsAny(), timeMatches() (+38 more)

### Community 80 - "flyfix.ts"
Cohesion: 0.29
Nodes (7): apiPost(), FlyfixInsightsGroup, FlyfixIssue, FlyfixRefinedReport, FlyfixSummary, refineIssues(), RefineIssuesRequestBody

### Community 81 - "App.tsx"
Cohesion: 0.16
Nodes (17): App(), linking, RTLWrapper(), getStorage(), languageToLocale(), loadSaved(), LocaleProvider(), save() (+9 more)

### Community 82 - "session.js"
Cohesion: 0.11
Nodes (31): pageLooksBlocked(), cdpLockBusy(), chain, withCdpLock(), blockHeavyResources(), getOpenPageHook(), browserPromises, { chromium, firefox } (+23 more)

### Community 83 - "Fly-Fix UI / UX"
Cohesion: 0.15
Nodes (12): Avoid (AI-vibe tells), Checklist before shipping UI, Design north star, Fly-Fix UI / UX, Landing, Motion, Prefer, Responsive (+4 more)

### Community 84 - "TestApplySoftStrictBaggage"
Cohesion: 0.52
Nodes (6): applySoftStrictBaggage(), makeOfferWithBags(), makeOfferWithMissingBags(), TestApplySoftStrictBaggage(), TestClassifyOfferBaggage(), classifyOfferBaggage()

### Community 85 - "backend_api_contracts.md"
Cohesion: 0.18
Nodes (10): 1.1 Create Search Session, 1.2 Get Search Session Status & Results, 1. Flight Search Sessions, 2.1 Get Monthly Deals, 2. Monthly Deals API, 3.1 Search Airports & Cities, 3. Airport & City Autocomplete, 4. High-Level Handler Layout (Go) (+2 more)

### Community 87 - "server_carrier_test.go"
Cohesion: 0.43
Nodes (6): CarrierCodes, makeOfferWithCarriers(), TestExtractCarrierCodes(), TestPrimaryDisplayCarrier(), ExtractCarrierCodes(), PrimaryDisplayCarrier()

### Community 88 - "expedia.js"
Cohesion: 0.19
Nodes (6): DEFAULT_SITES, expediaUrl(), scrapeExpedia(), attachJsonCapture(), gotoAndSettle(), mergeConfig()

### Community 89 - "selectBookingOptionForQuote"
Cohesion: 0.40
Nodes (5): hostFromURL(), selectBookingOptionForQuote(), TestSelectBookingOptionForQuote_fallsBackWhenQuotePriceMismatch(), TestSelectBookingOptionForQuote_prefersDeepLinkHost(), TestSelectBookingOptionForQuote_prefersPriceMatch()

### Community 92 - "time.Time"
Cohesion: 0.12
Nodes (18): FullRoundTrip, attachReturnLegKeepPrice(), ensureRoundTripLegs(), exploreRunLiveBatch(), gf2ExploreSearchOneDestination(), gf2OneRoundTrip(), gf2SearchDealsOnDates(), gf2SearchDealsRange() (+10 more)

### Community 93 - "Flight scraper (multisite)"
Cohesion: 0.40
Nodes (4): Docker, Flight scraper (multisite), Run locally, VPS (recommended): headed Chrome on `:99`

### Community 94 - "ErrorBoundary"
Cohesion: 0.15
Nodes (4): ErrorBoundary, Props, s, State

### Community 97 - "ValidateBookingURL"
Cohesion: 0.22
Nodes (13): gf2CheckoutOffers(), classifyURLType(), TestClassifyURLType_genericVsExact(), IsCheckoutBookingURL(), IsNonBookableDomain(), TestIsCheckoutBookingURL_rejectsFlightSearchPages(), TestIsNonBookableDomain_blocksFlightRadar(), TestValidateBookingURL_acceptsHTTPS() (+5 more)

### Community 101 - "ensure-flight-chrome.sh"
Cohesion: 0.70
Nodes (4): DISPLAY, ensure_gateway_proxy(), log(), ensure-flight-chrome.sh script

### Community 102 - "skyscanner.ts"
Cohesion: 0.42
Nodes (10): BookingHop, bookingHopsFromOption(), firstSeg(), isClassicRoundTripLegs(), isoDatePrefix(), isSplitBookingItinerary(), lastSeg(), legNeedsSegmentSplit() (+2 more)

## Knowledge Gaps
- **3 isolated node(s):** `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 592 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Fly-Fix` connect `Features` to `LandingScreen.tsx`?**
  _High betweenness centrality (0.323) - this node is a cross-community bridge._
- **What connects `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `.ResolveQuotedPartnerBooking` be split into smaller, more focused modules?**
  _Cohesion score 0.12299465240641712 - nodes in this community are weakly interconnected._
- **Why does `Multi-provider flight search` connect `Features` to `.SearchAll`?**
  _High betweenness centrality (0.317) - this node is a cross-community bridge._
- **Should `LandingScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.060362173038229376 - nodes in this community are weakly interconnected._
- **Why does `Recent enhancements` connect `LandingScreen.tsx` to `Features`, `ResultsScreen.tsx`?**
  _High betweenness centrality (0.312) - this node is a cross-community bridge._
- **Should `SearchFormContent.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._