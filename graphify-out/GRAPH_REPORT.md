# Graph Report - workspace  (2026-11-13)

## Corpus Check
- 304 files · ~255,513 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 16 file(s) not represented in the graph (top: (none) 8, .example 2, .conf 2)

## Summary
- 2539 nodes · 8221 edges · 96 communities (79 shown, 17 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 692 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6a4f2fe8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- .ResolveQuotedPartnerBooking
- LandingScreen.tsx
- AppIcon
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
- CanonicalSegment
- canonical_booking_test.go
- MonthDealsScreen.tsx
- SearchLoadingOverlay.tsx
- sharedLinkCache.ts
- booking_resolve.go
- qa_runner.py
- ApiClient
- matcher_test.go
- TestResult
- ResponseValidator
- runtime_config.go
- ProviderResult
- expo
- config_loader.py
- auth_test.go
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
- TopNavMenu.tsx
- models.py
- ExploreScreen.tsx
- Fly-Fix – Frontend
- .Search
- BuildLegAirlineDirectURL
- test_cases
- types.ts
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
- exchangeRates.ts
- warm.js
- parseGF2BookingOptions
- parseOtaOffers
- Flight scraper (multisite)
- ErrorBoundary
- server.go
- session.js
- Fly-Fix UI / UX
- TestApplySoftStrictBaggage
- backend_api_contracts.md
- ensure-edge-proxy.sh
- expedia.js
- install-edge-proxy-cron.sh
- sync-edge-stack.sh
- time.Time
- resolveAirlineLabel
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
9. `runBookingMatch()` - 41 edges
10. `BookingOffer` - 41 edges

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

## Communities (96 total, 17 thin omitted)

### Community 0 - ".ResolveQuotedPartnerBooking"
Cohesion: 0.14
Nodes (20): applySearchQuoteToOffer(), optionVendorFromQuote(), resolveAllPartnerBookingsFromTokenWithRetry(), firstPartnerBookingOption(), QuoteBinding, ResolvedPartnerBooking, providerFromURL(), SelectCheapestResolvedPartner() (+12 more)

### Community 1 - "LandingScreen.tsx"
Cohesion: 0.06
Nodes (37): __dirname, dist, indexHtml, indexPath, SPA_ROUTES, moodSizeForVariant(), stripStyles, styles (+29 more)

### Community 2 - "AppIcon"
Cohesion: 0.09
Nodes (42): AppIcon(), AppIconLibrary, AppIconProps, styles, collectTripDestinationCodes(), DestinationMoodBanner(), DestinationMoodStrip(), FormHeroHeader() (+34 more)

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "AttachCanonicalIdentity"
Cohesion: 0.11
Nodes (23): TestResolveOTAPartnerOffers_usesExistingCheckoutDeepLink(), ItineraryFingerprint(), TotalStops(), AttachCanonicalIdentity(), BuildCanonicalItinerary(), FingerprintDebugString(), ResultMatchesItinerary(), TestResultMatchesItinerary_OTAToGF2AcrossProviders() (+15 more)

### Community 5 - "session_store.go"
Cohesion: 0.13
Nodes (29): ProviderSearchStats, SearchProgress, SearchSession, SearchSessionResultsResponse, SearchSessionStatus, loadSearchSession(), markSessionFailed(), publishSearchProgress() (+21 more)

### Community 6 - "frontend/package.json"
Cohesion: 0.06
Nodes (40): config, { getDefaultConfig }, dependencies, expo@~52.0.0, @expo/metro-runtime@~4.0.1, expo-status-bar@~2.0.0, react@18.3.1, react-dom@18.3.1 (+32 more)

### Community 7 - "useTheme"
Cohesion: 0.06
Nodes (84): App(), linking, RTLWrapper(), ClearableTextInput(), ClearableTextInputProps, styles, DisplayPriceProps, styles (+76 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (34): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+26 more)

### Community 9 - "FlightOption"
Cohesion: 0.08
Nodes (35): TestProviderResultsToFlightOptions_PreservesCarrierName(), CreateSearchSessionRequest, ExtraSearchLeg, FlightLeg, FlightOption, LayoverSummary, OutboundSummary, applyPriceNormalization() (+27 more)

### Community 10 - "flight-scraper/package.json"
Cohesion: 0.11
Nodes (17): express, playwright, dependencies, express@^4.21.2, playwright@^1.49.1, description, engines, node (+9 more)

### Community 11 - "resolveGF2PartnerOffers"
Cohesion: 0.07
Nodes (41): allocateLegQuoteAmount(), attachQuotedPriceMeta(), dedupeGF2PartnerOffers(), flightLegDurationMinutes(), gf2OffersHavePrice(), gf2PartnerOfferFromQuoteURL(), gf2PartnerOfferFromResolved(), gf2PartnerOfferFromURL() (+33 more)

### Community 12 - "BookingOptionsFooter.tsx"
Cohesion: 0.15
Nodes (31): BookingResolveResponse, isSafeBookingUrl(), PublicBookingOffer, bookingOfferProviderLabel(), bookingOfferSubtitle(), formatBookingOfferPriceAmount(), formatBookingOfferPriceLine(), formatProviderDisplayName() (+23 more)

### Community 13 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 14 - "CanonicalSegment"
Cohesion: 0.09
Nodes (48): TestLookupAirlineIATA_Israir(), extractFlightNumbers(), flightNumberInText(), flightNumbersEquivalent(), splitFlightDesignator(), textContainsAirport(), textContainsAny(), timeMatches() (+40 more)

### Community 15 - "canonical_booking_test.go"
Cohesion: 0.10
Nodes (36): resolveLegBookingRedirectURL(), openJawOption(), TestBookingLinkModeDefaultsToSkyscanner(), TestBookingRouteFromSessionOption_splitOmitsReturn(), TestBuildGoogleFlightsFallbackFromParams(), TestBuildLegOrSegmentBookingURL_segment(), TestBuildOneWayLegBookingURL(), TestBuildSkyscannerPrefillURL_oneWay() (+28 more)

### Community 16 - "MonthDealsScreen.tsx"
Cohesion: 0.07
Nodes (52): getFlightDetails(), HubRouteLeg, HubRouteSummaryModal(), HubRouteSummaryModalProps, s, CheaperCitiesOption, CheaperCitiesSection(), Props (+44 more)

### Community 17 - "SearchLoadingOverlay.tsx"
Cohesion: 0.14
Nodes (19): getAlmostDonePhrase(), getPhrasesForLanguage(), SEARCH_ALMOST_DONE, SEARCH_BUTTON_ALMOST_DONE, SEARCH_BUTTON_PHRASES, SEARCH_PROGRESS_PHRASES, s, SearchProgressBanner() (+11 more)

### Community 18 - "sharedLinkCache.ts"
Cohesion: 0.17
Nodes (19): SearchUrlState, isDeepLinkDebugEnabled(), logDeepLinkDiagnostics(), mergeDeepLinkParams(), fromStash, fromUrl, kept, recovery (+11 more)

### Community 19 - "booking_resolve.go"
Cohesion: 0.05
Nodes (134): GetClicksSummary(), bookingResolveMaxConcurrentFromEnv(), cacheTTLForStatus(), envDurationMinutes(), init(), TestCacheTTLForStatus_doesNotCacheMisses(), webBookingMatchEnabled(), DefaultConfig() (+126 more)

### Community 22 - "matcher_test.go"
Cohesion: 0.11
Nodes (50): classifyURLType(), extractPrice(), cfgTest(), floatPtr(), TestClassifyURLType_genericVsExact(), testConnectingTLVJFK(), TestExtractPrice_euroPrefixNotArrivalTime(), TestFlightNumbersEquivalent_leadingZeros() (+42 more)

### Community 23 - "TestResult"
Cohesion: 0.19
Nodes (3): ResponseAnalyzer, main(), _print_unreachable_backend_hint()

### Community 25 - "runtime_config.go"
Cohesion: 0.21
Nodes (17): adminAccessConfigured(), configRangeError, adminTokenConfigured(), defaultRuntimeConfig(), errConfigOutOfRange(), getRuntimeConfig(), handleAdminRuntimeConfig(), handleGetRuntimeConfig() (+9 more)

### Community 26 - "ProviderResult"
Cohesion: 0.06
Nodes (32): isTransientGF2BookingErr(), bookingResolveFailureResponse(), DedupeProviderResults(), mergeSelfTransfer(), uniqueStrings(), TestCombineOneWayBatches(), TestCombineOneWayBatches_emptyBatch(), TestCombineOneWayBatches_openJawReturnDiversity() (+24 more)

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.30
Nodes (10): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+2 more)

### Community 29 - "auth_test.go"
Cohesion: 0.38
Nodes (10): initAuthStore(), purgeExpiredAuthSessions(), purgeExpiredAuthSessionsLoop(), initTestAuthDB(), randomTestPassword(), TestAuthLoginAndChangePassword(), TestAuthRegister(), TestAuthUserManagement() (+2 more)

### Community 30 - "searcher.go"
Cohesion: 0.12
Nodes (22): corpusText(), domainFromURL(), logMatchEvent(), countVerifiedPricedOffers(), MatchItinerary(), NewResolver(), truncateStr(), collectSerpAPIResultMaps() (+14 more)

### Community 31 - "auth.go"
Cohesion: 0.11
Nodes (47): getOTAProvider(), GetSessionAndOption(), ParseOptionIndex(), RecordClick(), ResolveProvider(), authUserJSON(), bearerTokenFromRequest(), bootstrapAdminUser() (+39 more)

### Community 32 - "runBookingMatch"
Cohesion: 0.07
Nodes (50): prodShapeKiwiIsrairOption(), TestHandleBookingResolve_prodShapeKiwiIsrairHTTP(), TestRunBookingMatch_kiwiWizzSellerPrimaryWithAirlineSecondary(), TestRunBookingMatch_prodShapeKiwiIsrairGetsAirlinePrefill(), TestRunBookingMatch_mergesOTAPartners(), acquireBookingResolveSlot(), beginInflightResolve(), bookingResolveCacheKey() (+42 more)

### Community 33 - "LocaleContext.tsx"
Cohesion: 0.18
Nodes (17): getStorage(), languageToLocale(), loadSaved(), LocaleContext, LocaleContextValue, LocaleProvider(), save(), VALID_CURRENCIES (+9 more)

### Community 34 - "explore_cache.go"
Cohesion: 0.08
Nodes (27): airportCoord, exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut(), getAirportCoord() (+19 more)

### Community 36 - "Backend QA Automation Tool"
Cohesion: 0.18
Nodes (10): Backend QA Automation Tool, Features, If the run feels slow or “stuck”, Notes, Optional AI Setup (Ollama), Output, Project Structure, Run (+2 more)

### Community 37 - "test-roundtrip-legs.js"
Cohesion: 0.12
Nodes (20): a, arr, assert, b, dep, late, assert, frSegs (+12 more)

### Community 38 - "BookingOffer"
Cohesion: 0.12
Nodes (41): airlineDomainForCarrier(), bookingMatchPriceNormalizer(), isAffiliateTemplateBookingURL(), marketingCarrierForLegIndex(), normalizedGF2OfferPrice(), offersIncludeAirlineDirect(), preferAirlineDirectWhenCheaperThanMarkedUpOTA(), publicAlternativesFromOffers() (+33 more)

### Community 39 - "search.ts"
Cohesion: 0.14
Nodes (26): CachedResult, createSearchSession(), createSearchSessionWithRetry(), ensureLegacyPurge(), fetchFresh(), getFromStorage(), getSearchSessionResults(), getStorage() (+18 more)

### Community 40 - "TopNavMenu.tsx"
Cohesion: 0.17
Nodes (15): Breakpoint, BREAKPOINTS, useBreakpoint(), useIsCompactLayout(), useIsMobile(), useWindowWidth(), widthToBreakpoint(), MobileNavRow() (+7 more)

### Community 42 - "ExploreScreen.tsx"
Cohesion: 0.08
Nodes (67): getMonthDeals(), ExploreResponse, getExploreDestinations(), GetExploreDestinationsParams, AIRPORT_ONLY_DICTIONARY, FULL_PLACE_DICTIONARY, getAirportDisplayName(), getAirportEntry() (+59 more)

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - ".Search"
Cohesion: 0.27
Nodes (8): classicRoundTripMissingReturn(), TestClassicRoundTripMissingReturn(), TestDoSearchWithRetry_doesNotCacheRoundTrip(), TestSearch_ignoresIncompleteClassicRTCache(), TestSearch_servesCompleteClassicRTCache(), newGF2Cache(), TestSearchLegCached_usesCache(), gf2Cache

### Community 45 - "BuildLegAirlineDirectURL"
Cohesion: 0.25
Nodes (9): BuildLegAirlineDirectURL(), BuildRedirectURL(), getAffiliateID(), TestBuildLegAirlineDirectURL_austrianDeeplinkNotLegacyBooking404(), stripEmptyQueryParams(), TestBuildLegAirlineDirectURL_wizzPathNotHash(), TestBuildLegAirlineDirectURL_wizzRoundTripReturnDate(), marketingCarrierForLeg() (+1 more)

### Community 46 - "test_cases"
Cohesion: 0.05
Nodes (40): departureDate, origin, byProvider, currency, error, from, items, route (+32 more)

### Community 47 - "types.ts"
Cohesion: 0.14
Nodes (16): Nav, styles, DynamicDestinationsStack(), Stack, MonthDealsStack(), Stack, SearchStack(), Stack (+8 more)

### Community 53 - "SearchRequest"
Cohesion: 0.10
Nodes (27): TestCompleteExtraLegs(), TestExtraLegsFingerprint(), truncateStr(), TestIsOpenJaw(), TestResolveReturnAirports_classic(), TestResolveReturnAirports_openJaw(), TestSanitizeStandardSearchRequest(), TestDynamicDestinationOneWayRequests_extraLegs() (+19 more)

### Community 54 - "Nginx Proxy Manager — fly-fix TLS checklist"
Cohesion: 0.40
Nodes (4): Nginx Proxy Manager — fly-fix TLS checklist, Reissue frontend cert (both names), Required proxy-host settings, Symptoms Chrome shows

### Community 55 - "booking.ts"
Cohesion: 0.36
Nodes (8): BookingResolveRequest, BookingResolveStatus, bookingRetryDelayMs(), fetchBookingResolveOnce(), isTransientBookingFetchError(), isTransientBookingResolveResponse(), PublicBookingAlternative, resolveBookingOffer()

### Community 56 - "FlightDetailsModal.tsx"
Cohesion: 0.18
Nodes (20): airportTimeZones, getAirportTimeZone(), cabinLabel(), FlightDetailsModal(), formatDuration(), layoverBetween(), legDuration(), s (+12 more)

### Community 58 - "FlightResultCard.tsx"
Cohesion: 0.16
Nodes (24): buildRoutePath(), c, FlightResultCard(), FlightResultCardProps, LegScheduleBlock(), FlightSegment, LayoverSummary, displayAirlineLabel() (+16 more)

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
Cohesion: 0.04
Nodes (92): formatAirlineFilterLabel(), DynamicDestinationsFormContentProps, defaultParams, DynamicDestinationsScreen(), Nav, styles, f, FiltersPanel() (+84 more)

### Community 63 - "affiliate.ts"
Cohesion: 0.27
Nodes (9): AffiliateProvider, AffiliateProviderResponse, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink(), OutboundLinkResponse (+1 more)

### Community 64 - "client.ts"
Cohesion: 0.13
Nodes (18): searchAirports(), API_BASE, apiGet(), apiUrl(), isLocalHostname(), resolveApiBase(), getDealsRange(), GetDealsRangeParams (+10 more)

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
Cohesion: 0.16
Nodes (19): apiRequest(), adminAuthHeaders(), fetchAdminRuntimeConfig(), fetchRuntimeConfig(), saveAdminRuntimeConfig(), setRuntimeConfigStore(), RuntimeConfigContext, RuntimeConfigContextValue (+11 more)

### Community 71 - "AuthContext.tsx"
Cohesion: 0.17
Nodes (22): authHeaders(), AuthUser, changePassword(), createUser(), deleteUser(), fetchAuthMe(), fetchUsers(), LoginResponse (+14 more)

### Community 72 - ".SearchAll"
Cohesion: 0.13
Nodes (11): AttachCanonicalIdentityAll(), TestRegistryFailureMessage_transientOutbound(), TestRegistrySearchAll_openJawGF2FailNotMaskedByKiwiSkip(), TestRegistrySearchAllPartialFailure(), TestRegistrySearchAllWithProgress(), isFastProvider(), isSkippedProviderErr(), IsTransientSearchErrMsg() (+3 more)

### Community 73 - "exchangeRates.ts"
Cohesion: 0.25
Nodes (9): DisplayPrice(), useExchangeRates(), convertPrice(), CURRENCY_SYMBOLS, CurrencyCode, ensureRates(), fetchRates(), getDisplayPrice() (+1 more)

### Community 74 - "warm.js"
Cohesion: 0.08
Nodes (28): cdpLockBusy(), chain, runWithOpenPage(), DEFAULT_SITES, hasCdp(), runOne(), scrapeAll(), SITE_FNS (+20 more)

### Community 75 - "parseGF2BookingOptions"
Cohesion: 0.32
Nodes (8): findBookingOptionsArray(), firstPartnerURLInMap(), firstStringByKeys(), isPartnerBookingList(), parseGF2BookingOptions(), partnerRequestTokenFromMap(), TestParseGF2BookingOptions(), TestParseGF2BookingOptions_rapidAPIPartnerList()

### Community 76 - "parseOtaOffers"
Cohesion: 0.29
Nodes (7): TestParseOtaOffers_normalizesIsrairDisplayName(), TestParseOtaOffers_IsrairNameToIATA(), ParseOtaOffers(), parseOtaOffers(), TestParseOtaOffers_dropsSkyscannerMetaDeepLink(), TestParseOtaOffersEmptyAndInvalid(), TestParseOtaOffersSolidcodeShape()

### Community 77 - "Flight scraper (multisite)"
Cohesion: 0.40
Nodes (4): Docker, Flight scraper (multisite), Run locally, VPS (recommended): headed Chrome on `:99`

### Community 79 - "ErrorBoundary"
Cohesion: 0.15
Nodes (4): ErrorBoundary, Props, s, State

### Community 80 - "server.go"
Cohesion: 0.07
Nodes (39): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, Carrier, CarrierCodes, DayDeal, startExploreSessionCleanup() (+31 more)

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
Cohesion: 0.11
Nodes (22): elapsedMs(), minutesOfDay(), roundTimeToMinutes(), ClickRecord, FullRoundTrip, attachReturnLegKeepPrice(), ensureRoundTripLegs(), gf2ExploreSearchOneDestination() (+14 more)

### Community 95 - "resolveAirlineLabel"
Cohesion: 0.47
Nodes (4): AIRLINE_NAMES, getAirlineName(), resolveAirlineLabel(), AIRLINE_FULL_NAMES

### Community 97 - "ValidateBookingURL"
Cohesion: 0.17
Nodes (16): isOTAScrapedSource(), otaListingPrefillURL(), TestIsOTAScrapedSource(), gf2CheckoutOffers(), TestOtaListingPrefillURL_rejectsSkyscannerMeta(), IsCheckoutBookingURL(), IsNonBookableDomain(), TestIsCheckoutBookingURL_rejectsFlightSearchPages() (+8 more)

### Community 101 - "ensure-flight-chrome.sh"
Cohesion: 0.70
Nodes (4): DISPLAY, ensure_gateway_proxy(), log(), ensure-flight-chrome.sh script

### Community 102 - "skyscanner.ts"
Cohesion: 0.42
Nodes (10): BookingHop, bookingHopsFromOption(), firstSeg(), isClassicRoundTripLegs(), isoDatePrefix(), isSplitBookingItinerary(), lastSeg(), legNeedsSegmentSplit() (+2 more)

## Knowledge Gaps
- **3 isolated node(s):** `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 595 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Multi-provider flight search` connect `Features` to `booking_resolve.go`?**
  _High betweenness centrality (0.316) - this node is a cross-community bridge._
- **What connects `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `.ResolveQuotedPartnerBooking` be split into smaller, more focused modules?**
  _Cohesion score 0.1379800853485064 - nodes in this community are weakly interconnected._
- **Why does `Recent enhancements` connect `Features` to `MonthDealsScreen.tsx`, `AppIcon`?**
  _High betweenness centrality (0.310) - this node is a cross-community bridge._
- **Should `LandingScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05673758865248227 - nodes in this community are weakly interconnected._
- **Should `AppIcon` be split into smaller, more focused modules?**
  _Cohesion score 0.09361393323657474 - nodes in this community are weakly interconnected._
- **Should `Issue` be split into smaller, more focused modules?**
  _Cohesion score 0.10365853658536585 - nodes in this community are weakly interconnected._