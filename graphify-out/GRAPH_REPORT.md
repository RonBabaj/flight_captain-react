# Graph Report - workspace  (2026-11-22)

## Corpus Check
- 372 files · ~282,334 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 19 file(s) not represented in the graph (top: (none) 9, .mdc 2, .example 2)

## Summary
- 2928 nodes · 9633 edges · 118 communities (93 shown, 25 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 778 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `dad1c3ff`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- .ResolveQuotedPartnerBooking
- time.Duration
- CanonicalSegment
- Issue
- runBookingMatch
- session_store.go
- frontend/package.json
- useTheme
- Features
- FlightOption
- flight-scraper/package.json
- GF2SearchAirports
- BookingOptionsFooter.tsx
- compilerOptions
- FlightDetailsModal.tsx
- quoteBindingFromOption
- MonthDealsScreen.tsx
- resolveOTAPartnerOffers
- ErrorBoundary
- server.go
- qa_runner.py
- ApiClient
- skyscanner.js
- TestResult
- ResponseValidator
- runtime_config.go
- types/index.ts
- expo
- config_loader.py
- auth.go
- session.js
- api.ts
- CanonicalItinerary
- LocaleContext.tsx
- explore_cache.go
- ValidationIssue
- Backend QA Automation Tool
- test-roundtrip-legs.js
- LookupAirlineIATA
- search.ts
- App.tsx
- models.py
- ExploreScreen.tsx
- Fly-Fix – Frontend
- handleBookingResolve
- api.ts
- test_cases
- RootNavigator.tsx
- gen_explore_airport_coords.py
- flightcaptainweb
- SearchRequest
- Nginx Proxy Manager — fly-fix TLS checklist
- FlightResultCard.tsx
- googleflights2_provider.go
- .finalize
- debug-skyscanner-live.js
- steps
- flyfix-api
- skyscannerParse.js
- SearchFormScreen.tsx
- normalizeKiwiItem
- bookingPrefillURL
- npm
- types.ts
- handleBookingResolve
- destinationMood.test.ts
- nginx-proxy-manager (VPS edge)
- BuildLegAirlineDirectURL
- resolvePartners.js
- .SearchAll
- AuthContext.tsx
- warm.js
- SearchSubmitButton.tsx
- canonical_booking_test.go
- resolveOTAPartnerOffers
- ProviderResult
- skyscanner.ts
- test-kiwi-parse.js
- client.ts
- SortBar.tsx
- Fly-Fix UI / UX
- TestApplySoftStrictBaggage
- backend_api_contracts.md
- ensure-edge-proxy.sh
- FiltersPanel.tsx
- Flight scraper (multisite)
- resolveBookingRedirectURL
- install-edge-proxy-cron.sh
- sync-edge-stack.sh
- time.Time
- scrape.js
- FlightDetailsResponse
- Fly-Fix — Design System & Cursor Redesign Playbook
- attachQuotedPriceMeta
- destinationLabelForCode
- handleCreateSession
- .Search
- ensure-flight-vnc.sh
- ensure-flight-chrome.sh
- ensure-scraper-proxy-forwarder.sh
- docker-entrypoint.sh
- after-reboot-flight.sh
- ValidateBookingURL
- Frontend Design
- server_carrier_test.go
- AppIcon.tsx
- ResolveProvider
- GetClicksSummary
- poll-session.mjs
- gf2-rapidapi-probe.sh
- partial-search-verify.sh
- handleExplore
- Provider

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 122 edges
2. `useLocale()` - 106 edges
3. `react` - 89 edges
4. `react-native` - 83 edges
5. `ProviderResult` - 63 edges
6. `ResultsScreen()` - 62 edges
7. `AppIcon()` - 60 edges
8. `MonthDealsScreen()` - 50 edges
9. `runBookingMatch()` - 49 edges
10. `CanonicalItineraryFingerprint()` - 42 edges

## Surprising Connections (you probably didn't know these)
- `Cheaper departure cities (positioning optimizer)` --references--> `CheaperCitiesSection()`  [INFERRED]
  README.md → frontend/src/features/flight-search/components/CheaperCitiesSection.tsx
- `3. Core product patterns` --references--> `TopNavMenu()`  [INFERRED]
  .cursor/skills/flyfix-redesign-playbook/SKILL.md → frontend/src/navigation/TopNavMenu.tsx
- `Signature` --references--> `TicketStub()`  [INFERRED]
  design-system/fly-fix/MASTER.md → frontend/src/ui/TicketStub.tsx
- `Flight scraper (multisite)` --references--> `OtaScraperProvider`  [INFERRED]
  services/flight-scraper/README.md → backend/search/ota_scraper_provider.go
- `Search form (boarding-pass ticket)` --references--> `SearchFormHeadline()`  [INFERRED]
  .cursor/skills/flyfix-ui-ux/SKILL.md → frontend/src/components/search/SearchFormHeadline.tsx

## Import Cycles
- None detected.

## Communities (118 total, 25 thin omitted)

### Community 0 - ".ResolveQuotedPartnerBooking"
Cohesion: 0.14
Nodes (21): resolveAllPartnerBookingsFromTokenWithRetry(), findBookingOptionsArray(), firstPartnerBookingOption(), firstPartnerURLInMap(), firstStringByKeys(), ResolvedPartnerBooking, isPartnerBookingList(), parseGF2BookingOptions() (+13 more)

### Community 1 - "time.Duration"
Cohesion: 0.09
Nodes (25): budgetCfg(), durationFromEnvMin(), envTruthy(), FilterProviderNamesForBudget(), GF2EffectiveCacheTTL(), GF2EffectiveRateLimitPerMin(), GF2MetroConcurrency(), GF2SkipRoundTripEnrich() (+17 more)

### Community 2 - "CanonicalSegment"
Cohesion: 0.08
Nodes (49): TestLookupAirlineIATA_Israir(), extractFlightNumbers(), flightNumberInText(), flightNumbersEquivalent(), splitFlightDesignator(), textContainsAirport(), textContainsAny(), timeMatches() (+41 more)

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "runBookingMatch"
Cohesion: 0.08
Nodes (58): TestPickAirlineDirectOffer_fullItineraryUsesLegZeroTemplate(), TestRunBookingMatch_skyscannerSessionDualWithCondorPrefill(), TestParseOtaOffers_normalizesIsrairDisplayName(), TestRunBookingMatch_kiwiMixedCarriersNoAustrianDeeplink(), TestRunBookingMatch_kiwiWizzSellerPrimaryWithAirlineSecondary(), TestRunBookingMatch_prodShapeKiwiIsrairGetsAirlinePrefill(), TestResolveOTAPartnerOffers_usesExistingCheckoutDeepLink(), TestRunBookingMatch_mergesOTAPartners() (+50 more)

### Community 5 - "session_store.go"
Cohesion: 0.12
Nodes (31): ProviderSearchStats, SearchProgress, SearchSession, SearchSessionResultsResponse, SearchSessionStatus, loadSearchSession(), markSessionFailed(), pageSearchSessionForClient() (+23 more)

### Community 6 - "frontend/package.json"
Cohesion: 0.06
Nodes (41): config, { getDefaultConfig }, dependencies, expo@~52.0.0, @expo/metro-runtime@~4.0.1, expo-status-bar@~2.0.0, react@18.3.1, react-dom@18.3.1 (+33 more)

### Community 7 - "useTheme"
Cohesion: 0.07
Nodes (58): Search form (boarding-pass ticket), ClearableTextInput(), ClearableTextInputProps, styles, styles, SearchFormTicketShell(), shell, useAuth() (+50 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (31): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+23 more)

### Community 9 - "FlightOption"
Cohesion: 0.06
Nodes (47): CanonicalFingerprint(), CodeshareFingerprint(), roundTimeToMinutes(), TestCapOptionsKeepingVariety(), TestProviderResultsToFlightOptions_PreservesCarrierName(), CreateSearchSessionRequest, ExtraSearchLeg, FlightLeg (+39 more)

### Community 10 - "flight-scraper/package.json"
Cohesion: 0.13
Nodes (16): express, dependencies, express@^4.21.2, playwright@^1.49.1, description, engines, node, playwright (+8 more)

### Community 11 - "GF2SearchAirports"
Cohesion: 0.09
Nodes (53): airlineDomainForCarrier(), applySearchQuoteToOffer(), bookingMatchPriceNormalizer(), fillPublicOfferSearchQuote(), isAffiliateTemplateBookingURL(), normalizedGF2OfferPrice(), offersIncludeAirlineDirect(), preferAirlineDirectWhenCheaperThanMarkedUpOTA() (+45 more)

### Community 12 - "BookingOptionsFooter.tsx"
Cohesion: 0.10
Nodes (45): BookingResolveRequest, BookingResolveResponse, BookingResolveStatus, isSafeBookingUrl(), PublicBookingAlternative, PublicBookingOffer, BookingDualComparison(), BookingDualComparisonProps (+37 more)

### Community 13 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 14 - "FlightDetailsModal.tsx"
Cohesion: 0.06
Nodes (63): bookingRetryDelayMs(), fetchBookingResolveOnce(), isTransientBookingFetchError(), isTransientBookingResolveResponse(), resolveBookingOffer(), AirlineLogo(), AirlineLogoRow(), Props (+55 more)

### Community 15 - "quoteBindingFromOption"
Cohesion: 0.11
Nodes (22): TestMarketingCarrierForScopeUsesSegmentCarrier(), allocateLegQuoteAmount(), attachQuotedPriceMeta(), flightLegDurationMinutes(), legBookingToken(), legDeepLink(), legPartnerArraysAligned(), marketingCarrierForLeg() (+14 more)

### Community 16 - "MonthDealsScreen.tsx"
Cohesion: 0.07
Nodes (63): getFlightDetails(), AppIcon(), DestinationMoodBanner(), DestinationMoodStrip(), DisplayPrice(), DisplayPriceProps, EditSearchModal(), EditSearchModalProps (+55 more)

### Community 17 - "resolveOTAPartnerOffers"
Cohesion: 0.21
Nodes (11): fetchRuntimeConfig(), setRuntimeConfigStore(), RuntimeConfigContext, RuntimeConfigContextValue, RuntimeConfigProvider(), DEFAULT_RUNTIME_CONFIG, RUNTIME_CONFIG_FIELDS, RuntimeConfig (+3 more)

### Community 18 - "ErrorBoundary"
Cohesion: 0.15
Nodes (4): ErrorBoundary, Props, s, State

### Community 19 - "server.go"
Cohesion: 0.09
Nodes (75): init(), registerExtraAirlineProviders(), AirportCityResult, AirportCitySearchResponse, AirportCityType, bookingResolveMaxConcurrentFromEnv(), envDurationMinutes(), init() (+67 more)

### Community 22 - "skyscanner.js"
Cohesion: 0.17
Nodes (24): com, fr, req, waitUntil(), gotoAndSettle(), ensureDatedResultsUrl(), extractSkyscanner(), FLIGHTS_PATH_BY_HOST (+16 more)

### Community 23 - "TestResult"
Cohesion: 0.19
Nodes (3): ResponseAnalyzer, main(), _print_unreachable_backend_hint()

### Community 25 - "runtime_config.go"
Cohesion: 0.22
Nodes (16): adminAccessConfigured(), configRangeError, adminTokenConfigured(), defaultRuntimeConfig(), errConfigOutOfRange(), getRuntimeConfig(), handleAdminRuntimeConfig(), initRuntimeConfigStore() (+8 more)

### Community 26 - "types/index.ts"
Cohesion: 0.09
Nodes (37): FormHeroHeader(), FormHeroHeaderProps, styles, formCardStyles, makeFormThemedStyles(), useRuntimeConfig(), DynamicDestinationsFormContentProps, styles (+29 more)

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.30
Nodes (10): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+2 more)

### Community 29 - "auth.go"
Cohesion: 0.14
Nodes (33): GetSessionAndOption(), ParseOptionIndex(), RecordClick(), ResolveProvider(), bearerTokenFromRequest(), handleAuthChangePassword(), handleAuthLogout(), handleAuthMe() (+25 more)

### Community 30 - "session.js"
Cohesion: 0.16
Nodes (20): pageLooksBlocked(), withCdpLock(), blockHeavyResources(), getOpenPageHook(), browserPromises, { chromium, firefox }, getBrowser(), isTransientScrapeError() (+12 more)

### Community 31 - "api.ts"
Cohesion: 0.11
Nodes (27): runs-on, steps, runs-on, steps, jobs, backend-search, frontend-phrases, prod-smoke (+19 more)

### Community 32 - "CanonicalItinerary"
Cohesion: 0.08
Nodes (28): corpusText(), domainFromURL(), logMatchEvent(), countVerifiedPricedOffers(), MatchItinerary(), NewResolver(), truncateStr(), collectSerpAPIResultMaps() (+20 more)

### Community 33 - "LocaleContext.tsx"
Cohesion: 0.12
Nodes (21): App(), linking, RTLWrapper(), getStorage(), languageToLocale(), loadSaved(), LocaleProvider(), save() (+13 more)

### Community 34 - "explore_cache.go"
Cohesion: 0.12
Nodes (16): airportCoord, exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut(), getAirportCoord() (+8 more)

### Community 36 - "Backend QA Automation Tool"
Cohesion: 0.18
Nodes (10): Backend QA Automation Tool, Features, If the run feels slow or “stuck”, Notes, Optional AI Setup (Ollama), Output, Project Structure, Run (+2 more)

### Community 37 - "test-roundtrip-legs.js"
Cohesion: 0.09
Nodes (24): assert, a, arr, assert, b, dep, late, assert (+16 more)

### Community 38 - "LookupAirlineIATA"
Cohesion: 0.17
Nodes (25): authUserJSON(), bootstrapAdminUser(), createAuthSession(), envFlagTrue(), handleAuthLogin(), handleAuthRegister(), handleAuthUsers(), initAuthStore() (+17 more)

### Community 39 - "search.ts"
Cohesion: 0.13
Nodes (28): CachedResult, createSearchSession(), createSearchSessionWithRetry(), ensureLegacyPurge(), fetchFresh(), getFromStorage(), getSearchSessionResults(), getStorage() (+20 more)

### Community 40 - "App.tsx"
Cohesion: 0.18
Nodes (18): isDeepLinkDebugEnabled(), logDeepLinkDiagnostics(), mergeDeepLinkParams(), fromStash, fromUrl, kept, recovery, store (+10 more)

### Community 42 - "ExploreScreen.tsx"
Cohesion: 0.06
Nodes (78): getMonthDeals(), getExploreDestinations(), s, SearchFormHeadlineProps, AIRPORT_DICTIONARY, AIRPORT_ONLY_DICTIONARY, FULL_PLACE_DICTIONARY, getAirportDisplayName() (+70 more)

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "handleBookingResolve"
Cohesion: 0.27
Nodes (9): AffiliateProvider, AffiliateProviderResponse, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink(), OutboundLinkResponse (+1 more)

### Community 45 - "api.ts"
Cohesion: 0.05
Nodes (54): Results, getDealsRange(), GetDealsRangeParams, GetMonthDealsParams, GetFlightDetailsParams, formatProviderError(), labelForProvider(), SearchSourcesBanner() (+46 more)

### Community 46 - "test_cases"
Cohesion: 0.05
Nodes (40): departureDate, origin, byProvider, currency, error, from, items, route (+32 more)

### Community 47 - "RootNavigator.tsx"
Cohesion: 0.07
Nodes (47): Responsive, Nav, SiteFooter(), styles, LandingScreen(), ContactScreen(), LegalKind, LegalPageScreen() (+39 more)

### Community 53 - "SearchRequest"
Cohesion: 0.11
Nodes (26): TestCompleteExtraLegs(), TestExtraLegsFingerprint(), truncateStr(), TestIsOpenJaw(), TestResolveReturnAirports_classic(), TestResolveReturnAirports_openJaw(), TestSanitizeStandardSearchRequest(), TestDynamicDestinationOneWayRequests_extraLegs() (+18 more)

### Community 54 - "Nginx Proxy Manager — fly-fix TLS checklist"
Cohesion: 0.40
Nodes (4): Nginx Proxy Manager — fly-fix TLS checklist, Reissue frontend cert (both names), Required proxy-host settings, Symptoms Chrome shows

### Community 55 - "FlightResultCard.tsx"
Cohesion: 0.11
Nodes (26): s, FlightDetailsModalProps, buildRoutePath(), c, FlightResultCardProps, LegScheduleBlock(), PositioningLegResult, FlightOption (+18 more)

### Community 56 - "googleflights2_provider.go"
Cohesion: 0.11
Nodes (45): TestParseGF2TimeWithDateHint_AirportLocal(), TestExtractGF2BookingToken(), TestExtractGF2BookingURL(), TestExtractGF2PartnerBookingTokenPrefersPartnerURL(), TestBuildGF2ResultFromItinerary_FlatFormat(), TestParseGF2Response_AttachesFlatReturnFlights(), TestParseGF2Response_RapidAPIFlatTopFlights(), TestParseGF2Response_topFlightsWithoutPriceHistory() (+37 more)

### Community 58 - "debug-skyscanner-live.js"
Cohesion: 0.14
Nodes (10): extractSkyscanner(), req, skyscannerUrl(), url, DEFAULT_SITES, expediaUrl(), scrapeExpedia(), attachJsonCapture() (+2 more)

### Community 59 - "steps"
Cohesion: 0.09
Nodes (22): runs-on, steps, jobs, deploy, name, on, push, workflow_dispatch (+14 more)

### Community 60 - "flyfix-api"
Cohesion: 0.05
Nodes (39): context, FLIGHT_PROVIDERS, FLIGHT_SCRAPER_MAX_CONCURRENT, FLIGHT_SCRAPER_URL, PLAYWRIGHT_HEADLESS, PORT, SCRAPER_CDP_URLS, SCRAPER_PROXY_URL (+31 more)

### Community 61 - "skyscannerParse.js"
Cohesion: 0.12
Nodes (28): assert, english, firstPage, named, offers, radarOffers, req, absolutizeSkyscanner() (+20 more)

### Community 62 - "SearchFormScreen.tsx"
Cohesion: 0.13
Nodes (28): defaultParams, SearchFormScreen(), styles, buildSearchString(), getParam(), getParams(), isWeb(), parseSearchParamsFromUrl() (+20 more)

### Community 63 - "normalizeKiwiItem"
Cohesion: 0.18
Nodes (17): TotalStops(), asArray(), collectCarriers(), extractKiwiLegs(), firstFloat(), firstString(), kiwiSegmentFromMap(), mapsToSegments() (+9 more)

### Community 64 - "bookingPrefillURL"
Cohesion: 0.09
Nodes (39): gf2OffersHavePrice(), isTransientGF2BookingErr(), resolveGF2PartnerOffer(), resolveGF2PartnerOffers(), resolveLegBookingRedirectURL(), searchRequestFromSession(), TestResolveGF2PartnerOffer_skipsSkyscannerDeepLink(), TestResolveGF2PartnerOffer_usesPersistedLegDeepLinkWithoutProvider() (+31 more)

### Community 65 - "npm"
Cohesion: 0.17
Nodes (11): networks, proxy, container_name, image, networks, ports, restart, volumes (+3 more)

### Community 66 - "types.ts"
Cohesion: 0.33
Nodes (12): clearPendingDealsParams(), DealsParams, dealsParamsFingerprint(), getCachedDealsResults(), getLocalStorage(), getPendingDealsParams(), getSessionStorage(), migrateLegacySessionParams() (+4 more)

### Community 67 - "handleBookingResolve"
Cohesion: 0.12
Nodes (19): acquireBookingResolveSlot(), beginInflightResolve(), bookingResolveCacheKey(), cacheTTLForStatus(), finishInflightResolve(), getCachedBookingResolve(), handleBookingResolve(), logBookingResolve() (+11 more)

### Community 68 - "destinationMood.test.ts"
Cohesion: 0.11
Nodes (14): __dirname, dist, indexHtml, indexPath, SPA_ROUTES, byCity, compact, curatedCities (+6 more)

### Community 69 - "nginx-proxy-manager (VPS edge)"
Cohesion: 0.40
Nodes (4): Deploy sync, First-time / recovery, nginx-proxy-manager (VPS edge), On the server

### Community 70 - "BuildLegAirlineDirectURL"
Cohesion: 0.17
Nodes (11): buildCondorSearchURL(), BuildLegAirlineDirectURL(), compactYYYYMMDD(), TestBuildCondorSearchURL_roundTrip(), TestBuildLegAirlineDirectURL_condor(), TestBuildLegAirlineDirectURL_austrianHasNoUnverifiedLink(), TestBuildLegAirlineDirectURL_wizzPathNotHash(), TestBuildLegAirlineDirectURL_wizzRoundTripReturnDate() (+3 more)

### Community 71 - "resolvePartners.js"
Cohesion: 0.21
Nodes (18): kiwiSearchUrl(), addPartner(), clickMatchingKiwiCard(), clickMatchingSkyscannerCard(), clocksFromSegments(), collectPartnerMap(), extractPartnersFromDom(), hmFromIso() (+10 more)

### Community 72 - ".SearchAll"
Cohesion: 0.09
Nodes (18): TestSanitizeProviderErrorForUser(), TestRegistryFailureMessage_transientOutbound(), TestRegistrySearchAll_dedupeComparesInRequestedCurrency(), TestRegistrySearchAll_fastOnlySkipsScraper(), TestRegistrySearchAll_openJawGF2FailNotMaskedByKiwiSkip(), TestRegistrySearchAllPartialFailure(), TestRegistrySearchAllWithProgress(), TestRegistrySearchAllPartialStream() (+10 more)

### Community 73 - "AuthContext.tsx"
Cohesion: 0.17
Nodes (22): authHeaders(), AuthUser, changePassword(), createUser(), deleteUser(), fetchAuthMe(), fetchUsers(), LoginResponse (+14 more)

### Community 74 - "warm.js"
Cohesion: 0.12
Nodes (21): cdpLockBusy(), chain, beginSearch(), endSearch(), isSearchBusy(), app, express, { chromium } (+13 more)

### Community 75 - "SearchSubmitButton.tsx"
Cohesion: 0.05
Nodes (66): collectTripDestinationCodes(), moodSizeForVariant(), stripStyles, styles, Variant, getAlmostDonePhrase(), getPhrasesForLanguage(), pickSearchStatusPhrase() (+58 more)

### Community 76 - "canonical_booking_test.go"
Cohesion: 0.10
Nodes (46): classifyURLType(), extractPrice(), cfgTest(), floatPtr(), TestClassifyURLType_genericVsExact(), testConnectingTLVJFK(), TestExtractPrice_euroPrefixNotArrivalTime(), TestFlightNumbersEquivalent_leadingZeros() (+38 more)

### Community 77 - "resolveOTAPartnerOffers"
Cohesion: 0.07
Nodes (31): dedupeGF2PartnerOffers(), gf2PartnerOfferFromQuoteURL(), gf2PartnerOfferFromResolved(), gf2PartnerOfferFromURL(), optionVendorFromQuote(), TestGF2PartnerOfferFromURL_acceptsHTTPS(), TestGF2PartnerOfferFromURL_metaSearchIsNotVerifiedCheckout(), TestGF2PartnerOfferFromURL_rejectsUnsafe() (+23 more)

### Community 78 - "ProviderResult"
Cohesion: 0.07
Nodes (32): DedupeProviderResults(), ItineraryFingerprint(), mergeSelfTransfer(), uniqueStrings(), TestCombineOneWayBatches(), TestCombineOneWayBatches_emptyBatch(), TestCombineOneWayBatches_keepsNonstopsBothWays(), TestCombineOneWayBatches_openJawReturnDiversity() (+24 more)

### Community 79 - "skyscanner.ts"
Cohesion: 0.18
Nodes (8): apiSearchFlow(), main(), pollSession(), report, step(), uiSearchFlow(), logs, { chromium }

### Community 80 - "test-kiwi-parse.js"
Cohesion: 0.12
Nodes (30): assert, offers, pending, req, offerTemplate(), segment(), segmentsFromRoundTripClocks(), clearKiwiSpaState() (+22 more)

### Community 81 - "client.ts"
Cohesion: 0.11
Nodes (22): searchAirports(), API_BASE, apiGet(), apiPost(), apiRequest(), apiUrl(), isLocalHostname(), resolveApiBase() (+14 more)

### Community 82 - "SortBar.tsx"
Cohesion: 0.28
Nodes (10): Do not, Fly-Fix RTL / bidirectional text, Rules, Verify, formatAirportPath(), formatFlightTimeRange(), isolateLTR(), joinRouteCodes() (+2 more)

### Community 83 - "Fly-Fix UI / UX"
Cohesion: 0.22
Nodes (8): Avoid (AI-vibe tells), Checklist before shipping UI, Design north star, Fly-Fix UI / UX, Phase 0 decisions (locked), Prefer, Screen rules, Tokens (source of truth)

### Community 84 - "TestApplySoftStrictBaggage"
Cohesion: 0.52
Nodes (6): applySoftStrictBaggage(), makeOfferWithBags(), makeOfferWithMissingBags(), TestApplySoftStrictBaggage(), TestClassifyOfferBaggage(), classifyOfferBaggage()

### Community 85 - "backend_api_contracts.md"
Cohesion: 0.18
Nodes (10): 1.1 Create Search Session, 1.2 Get Search Session Status & Results, 1. Flight Search Sessions, 2.1 Get Monthly Deals, 2. Monthly Deals API, 3.1 Search Airports & Cities, 3. Airport & City Autocomplete, 4. High-Level Handler Layout (Go) (+2 more)

### Community 87 - "FiltersPanel.tsx"
Cohesion: 0.22
Nodes (9): devDependencies, playwright@1.49.0, playwright, name, private, scripts, poll, ui (+1 more)

### Community 88 - "Flight scraper (multisite)"
Cohesion: 0.29
Nodes (6): Docker, Flight scraper (multisite), Residential EU proxy, Run locally, VPS (recommended): headed Chrome on `:99`, When Skyscanner returns 0 offers

### Community 89 - "resolveBookingRedirectURL"
Cohesion: 0.22
Nodes (8): Anti-patterns, Checklist, Color (implementation: `frontend/src/theme/tokens.ts`), Fly-Fix Design System (Master), Motion, Patterns, Signature, Typography

### Community 92 - "time.Time"
Cohesion: 0.07
Nodes (38): elapsedMs(), minutesOfDay(), ClickRecord, mergeExplorePriceRows(), exploreDestRow, exploreSession, FullRoundTrip, attachReturnLegKeepPrice() (+30 more)

### Community 93 - "scrape.js"
Cohesion: 0.24
Nodes (13): assert, kiwi, pxSky, sky, hasCdp(), runWithSiteBudget(), scrapeAll(), scrapeSerial() (+5 more)

### Community 94 - "FlightDetailsResponse"
Cohesion: 0.13
Nodes (16): AirportLike, Carrier, DayDeal, FareBreakdown, FlightDetailsResponse, FlightSegment, MonetaryAmount, monthDealsCacheEntry (+8 more)

### Community 95 - "Fly-Fix — Design System & Cursor Redesign Playbook"
Cohesion: 0.22
Nodes (8): 1. Product and brand direction, 2. Design tokens (proposed starting values), 3. Core product patterns, 4. Motion, 5. Cursor workflow phases, 6. Non-negotiable constraints, 7. Working method, Fly-Fix — Design System & Cursor Redesign Playbook

### Community 96 - "attachQuotedPriceMeta"
Cohesion: 0.40
Nodes (3): fin, full, half

### Community 97 - "destinationLabelForCode"
Cohesion: 0.18
Nodes (14): LocaleContext, LocaleContextValue, VALID_CURRENCIES, CURRENCIES, CurrencyCode, LanguageCode, LANGUAGES, TRANSLATIONS (+6 more)

### Community 98 - "handleCreateSession"
Cohesion: 0.40
Nodes (4): Live & local search verification, Playwright MCP (local Cursor), Production smoke (read-only API + Playwright UI), Quick checks (no credentials)

### Community 99 - ".Search"
Cohesion: 0.24
Nodes (9): classicRoundTripMissingReturn(), TestClassicRoundTripMissingReturn(), TestDoSearchWithRetry_doesNotCacheRoundTrip(), TestSearch_ignoresIncompleteClassicRTCache(), TestSearch_servesCompleteClassicRTCache(), newGF2Cache(), TestSearchLegCached_usesCache(), gf2Cache (+1 more)

### Community 101 - "ensure-flight-chrome.sh"
Cohesion: 0.52
Nodes (6): chrome_proxy_args(), DISPLAY, ensure_gateway_proxy(), load_scraper_proxy_env(), log(), ensure-flight-chrome.sh script

### Community 105 - "ValidateBookingURL"
Cohesion: 0.27
Nodes (11): gf2CheckoutOffers(), IsCheckoutBookingURL(), IsNonBookableDomain(), TestIsCheckoutBookingURL_rejectsFlightSearchPages(), TestIsNonBookableDomain_blocksFlightRadar(), TestValidateBookingURL_acceptsHTTPS(), TestValidateBookingURL_rejectsEmpty(), TestValidateBookingURL_rejectsJavascript() (+3 more)

### Community 106 - "Frontend Design"
Cohesion: 0.25
Nodes (7): Design principles, Fly-Fix (this repo), Frontend Design, Ground your designs in the subject matter, More on writing in design, Process: plan, review against the brief, build, critique, Restraint and self-critique

### Community 107 - "server_carrier_test.go"
Cohesion: 0.43
Nodes (6): CarrierCodes, makeOfferWithCarriers(), TestExtractCarrierCodes(), TestPrimaryDisplayCarrier(), ExtractCarrierCodes(), PrimaryDisplayCarrier()

### Community 108 - "AppIcon.tsx"
Cohesion: 0.17
Nodes (13): AppIconLibrary, AppIconProps, styles, getSvgMarkup(), getWebIconSvgDataUri(), hasWebSvgFallback(), LOCAL_ICON_NAMES, buildMonthDays() (+5 more)

### Community 116 - "handleExplore"
Cohesion: 0.21
Nodes (9): exploreSessionKey(), getExploreSession(), newExploreSessionID(), putExploreSession(), startExploreSessionCleanup(), exploreDestRowsToMaps(), corsMiddleware(), handleExplore() (+1 more)

### Community 117 - "Provider"
Cohesion: 0.22
Nodes (7): BuildRedirectURL(), getAffiliateID(), getOTAProvider(), stripEmptyQueryParams(), OutboundLinkResponse, Provider, ProviderResponse

## Knowledge Gaps
- **3 isolated node(s):** `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 710 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Fly-Fix` connect `Features` to `MonthDealsScreen.tsx`, `time.Duration`?**
  _High betweenness centrality (0.289) - this node is a cross-community bridge._
- **What connects `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `.ResolveQuotedPartnerBooking` be split into smaller, more focused modules?**
  _Cohesion score 0.13900134952766532 - nodes in this community are weakly interconnected._
- **Why does `Multi-provider flight search` connect `time.Duration` to `Features`?**
  _High betweenness centrality (0.287) - this node is a cross-community bridge._
- **Should `time.Duration` be split into smaller, more focused modules?**
  _Cohesion score 0.09195402298850575 - nodes in this community are weakly interconnected._
- **Why does `Recent enhancements` connect `MonthDealsScreen.tsx` to `Features`?**
  _High betweenness centrality (0.279) - this node is a cross-community bridge._
- **Should `CanonicalSegment` be split into smaller, more focused modules?**
  _Cohesion score 0.08418367346938775 - nodes in this community are weakly interconnected._