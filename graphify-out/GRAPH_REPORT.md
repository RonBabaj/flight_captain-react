# Graph Report - workspace  (2026-11-12)

## Corpus Check
- 303 files · ~253,736 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 16 file(s) not represented in the graph (top: (none) 8, .example 2, .conf 2)

## Summary
- 2523 nodes · 8164 edges · 99 communities (81 shown, 18 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 679 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c7bfafef`
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
- types/index.ts
- canonical_booking_test.go
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
- ProviderResult
- expo
- config_loader.py
- auth_test.go
- searcher.go
- auth.go
- runBookingMatch
- RuntimeConfigContext.tsx
- explore_cache.go
- ValidationIssue
- Backend QA Automation Tool
- test-roundtrip-legs.js
- BookingOffer
- search.ts
- DestinationMoodBanner.tsx
- models.py
- AirportAutocomplete.tsx
- Fly-Fix – Frontend
- DestinationMoodBanner.tsx
- AirportLocation
- test_cases
- LocaleContext.tsx
- gen_explore_airport_coords.py
- flightcaptainweb
- SearchRequest
- Nginx Proxy Manager — fly-fix TLS checklist
- BuildLegAirlineDirectURL
- FlightDetailsModal.tsx
- .finalize
- FiltersPanel.tsx
- steps
- flyfix-api
- exchangeRates.ts
- ResultsScreen.tsx
- affiliate.ts
- client.ts
- npm
- skyscanner.js
- kiwi.js
- .Search
- nginx-proxy-manager (VPS edge)
- AppIcon
- AuthContext.tsx
- .SearchAll
- handleCreateSession
- scrape.js
- normalizeKiwiItem
- booking.ts
- flyfix.ts
- selectBookingOptionForQuote
- allocateLegQuoteAmount
- server_carrier_test.go
- ThemeContext.tsx
- session.js
- Fly-Fix UI / UX
- TestApplySoftStrictBaggage
- backend_api_contracts.md
- ensure-edge-proxy.sh
- DraggableBottomSheet.tsx
- expedia.js
- install-edge-proxy-cron.sh
- sync-edge-stack.sh
- time.Time
- Flight scraper (multisite)
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

## Communities (99 total, 18 thin omitted)

### Community 0 - ".ResolveQuotedPartnerBooking"
Cohesion: 0.15
Nodes (19): resolveAllPartnerBookingsFromTokenWithRetry(), findBookingOptionsArray(), firstPartnerBookingOption(), firstPartnerURLInMap(), firstStringByKeys(), ResolvedPartnerBooking, isPartnerBookingList(), parseGF2BookingOptions() (+11 more)

### Community 1 - "LandingScreen.tsx"
Cohesion: 0.05
Nodes (50): ErrorBoundary, Props, s, State, Nav, SiteFooter(), styles, moodImageUrlForVariant() (+42 more)

### Community 2 - "SearchFormContent.tsx"
Cohesion: 0.11
Nodes (23): getAlmostDonePhrase(), getPhrasesForLanguage(), SEARCH_ALMOST_DONE, SEARCH_BUTTON_ALMOST_DONE, SEARCH_BUTTON_PHRASES, SEARCH_PROGRESS_PHRASES, s, SearchProgressBanner() (+15 more)

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "AttachCanonicalIdentity"
Cohesion: 0.13
Nodes (20): TestResolveOTAPartnerOffers_usesExistingCheckoutDeepLink(), AttachCanonicalIdentity(), BuildCanonicalItinerary(), FingerprintDebugString(), ResultMatchesItinerary(), TestResultMatchesItinerary_OTAToGF2AcrossProviders(), TestResultMatchesItinerary_RejectsDifferentFlightNumber(), NormalizeTimestamp() (+12 more)

### Community 5 - "session_store.go"
Cohesion: 0.14
Nodes (28): ProviderSearchStats, SearchProgress, SearchSession, SearchSessionResultsResponse, SearchSessionStatus, loadSearchSession(), markSessionFailed(), publishSearchProgress() (+20 more)

### Community 6 - "frontend/package.json"
Cohesion: 0.06
Nodes (41): config, { getDefaultConfig }, dependencies, expo@~52.0.0, @expo/metro-runtime@~4.0.1, expo-status-bar@~2.0.0, react@18.3.1, react-dom@18.3.1 (+33 more)

### Community 7 - "useTheme"
Cohesion: 0.10
Nodes (47): ClearableTextInput(), ClearableTextInputProps, styles, DisplayPrice(), DisplayPriceProps, useAuth(), useLocale(), AccountScreen() (+39 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (34): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+26 more)

### Community 9 - "FlightOption"
Cohesion: 0.06
Nodes (64): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, CanonicalFingerprint(), Carrier, TestProviderResultsToFlightOptions_PreservesCarrierName(), CarrierCodes (+56 more)

### Community 10 - "flight-scraper/package.json"
Cohesion: 0.11
Nodes (17): express, playwright, dependencies, express@^4.21.2, playwright@^1.49.1, description, engines, node (+9 more)

### Community 11 - "resolveGF2PartnerOffers"
Cohesion: 0.07
Nodes (40): airlineDomainForCarrier(), attachQuotedPriceMeta(), dedupeGF2PartnerOffers(), gf2OffersHavePrice(), gf2PartnerOfferFromResolved(), gf2PartnerOfferFromURL(), isTransientGF2BookingErr(), legBookingToken() (+32 more)

### Community 12 - "BookingOptionsFooter.tsx"
Cohesion: 0.16
Nodes (29): BookingResolveResponse, isSafeBookingUrl(), PublicBookingOffer, bookingOfferProviderLabel(), bookingOfferSubtitle(), formatBookingOfferPriceAmount(), formatBookingOfferPriceLine(), formatProviderDisplayName() (+21 more)

### Community 13 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 14 - "types/index.ts"
Cohesion: 0.10
Nodes (23): GetFlightDetailsParams, LegScheduleBlock(), AirportCityType, AirportLike, BaggageClass, Carrier, COUNTRY_DEST_PREFIX, ExplorePriceSource (+15 more)

### Community 15 - "canonical_booking_test.go"
Cohesion: 0.12
Nodes (28): openJawOption(), TestBookingLinkModeDefaultsToSkyscanner(), TestBookingRouteFromSessionOption_splitOmitsReturn(), TestBuildGoogleFlightsFallbackFromParams(), TestBuildLegOrSegmentBookingURL_segment(), TestBuildOneWayLegBookingURL(), TestBuildSkyscannerPrefillURL_oneWay(), TestBuildSkyscannerPrefillURL_roundTrip() (+20 more)

### Community 16 - "MonthDealsScreen.tsx"
Cohesion: 0.08
Nodes (46): getFlightDetails(), getAirportNameByCode(), CheaperCitiesSection(), buildDealsPositioningSignature(), dealBestScore(), fl, fmtDur(), formatDealDate() (+38 more)

### Community 17 - "googleflights2_provider.go"
Cohesion: 0.11
Nodes (44): TestParseGF2TimeWithDateHint_AirportLocal(), TestExtractGF2BookingToken(), TestExtractGF2BookingURL(), TestExtractGF2PartnerBookingTokenPrefersPartnerURL(), TestBuildGF2ResultFromItinerary_FlatFormat(), TestParseGF2Response_AttachesFlatReturnFlights(), TestParseGF2Response_RapidAPIFlatTopFlights(), TestExtractGF2Leg_TimeOnly_NoDateHint() (+36 more)

### Community 18 - "handleExplore"
Cohesion: 0.18
Nodes (12): exploreSessionKey(), getExploreSession(), newExploreSessionID(), putExploreSession(), startExploreSessionCleanup(), exploreSession, corsMiddleware(), fetchExchangeRates() (+4 more)

### Community 19 - "booking_resolve.go"
Cohesion: 0.06
Nodes (116): GetClicksSummary(), TestLookupAirlineIATA_Israir(), bookingResolveMaxConcurrentFromEnv(), cacheTTLForStatus(), envDurationMinutes(), init(), TestCacheTTLForStatus_doesNotCacheMisses(), webBookingMatchEnabled() (+108 more)

### Community 22 - "matcher_test.go"
Cohesion: 0.09
Nodes (56): TestQuoteBindingFromOption_usesOriginalWhenEstimate(), TestQuoteBindingFromOption_usesStoredLegPrice(), classifyURLType(), extractPrice(), cfgTest(), floatPtr(), TestClassifyURLType_genericVsExact(), testConnectingTLVJFK() (+48 more)

### Community 23 - "TestResult"
Cohesion: 0.19
Nodes (3): ResponseAnalyzer, main(), _print_unreachable_backend_hint()

### Community 25 - "runtime_config.go"
Cohesion: 0.22
Nodes (16): adminAccessConfigured(), configRangeError, adminTokenConfigured(), defaultRuntimeConfig(), errConfigOutOfRange(), getRuntimeConfig(), handleAdminRuntimeConfig(), initRuntimeConfigStore() (+8 more)

### Community 26 - "ProviderResult"
Cohesion: 0.10
Nodes (19): DedupeProviderResults(), ItineraryFingerprint(), mergeSelfTransfer(), uniqueStrings(), cheapestReturnLeg(), providerResultArrivalAirport(), isTransientGF2SearchErr(), legSearchRetryable() (+11 more)

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
Cohesion: 0.11
Nodes (22): defaultBookingMatchRunner(), webVerifiedBookingOffers(), corpusText(), domainFromURL(), MatchResult, countVerifiedPricedOffers(), NewResolver(), truncateStr() (+14 more)

### Community 31 - "auth.go"
Cohesion: 0.10
Nodes (47): getOTAProvider(), GetSessionAndOption(), ParseOptionIndex(), RecordClick(), ResolveProvider(), authUserJSON(), bearerTokenFromRequest(), bootstrapAdminUser() (+39 more)

### Community 32 - "runBookingMatch"
Cohesion: 0.07
Nodes (49): TestRunBookingMatch_prodShapeKiwiIsrairGetsAirlinePrefill(), isOTAScrapedSource(), otaListingPrefillURL(), TestIsOTAScrapedSource(), TestRunBookingMatch_mergesOTAPartners(), acquireBookingResolveSlot(), beginInflightResolve(), bookingResolveCacheKey() (+41 more)

### Community 33 - "RuntimeConfigContext.tsx"
Cohesion: 0.17
Nodes (17): apiRequest(), adminAuthHeaders(), fetchAdminRuntimeConfig(), fetchRuntimeConfig(), saveAdminRuntimeConfig(), RuntimeConfigContext, RuntimeConfigContextValue, useRuntimeConfigActions() (+9 more)

### Community 34 - "explore_cache.go"
Cohesion: 0.10
Nodes (19): airportCoord, exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut(), getAirportCoord() (+11 more)

### Community 36 - "Backend QA Automation Tool"
Cohesion: 0.18
Nodes (10): Backend QA Automation Tool, Features, If the run feels slow or “stuck”, Notes, Optional AI Setup (Ollama), Output, Project Structure, Run (+2 more)

### Community 37 - "test-roundtrip-legs.js"
Cohesion: 0.13
Nodes (19): a, arr, assert, b, dep, late, assert, frSegs (+11 more)

### Community 38 - "BookingOffer"
Cohesion: 0.14
Nodes (35): applySearchQuoteToOffer(), bookingMatchPriceNormalizer(), gf2PartnerOfferFromQuoteURL(), marketingCarrierForLegIndex(), normalizedGF2OfferPrice(), optionVendorFromQuote(), preferAirlineDirectWhenCheaperThanMarkedUpOTA(), publicAlternativesFromOffers() (+27 more)

### Community 39 - "search.ts"
Cohesion: 0.13
Nodes (28): CachedResult, createSearchSession(), createSearchSessionWithRetry(), ensureLegacyPurge(), fetchFresh(), getFromStorage(), getSearchSessionResults(), getStorage() (+20 more)

### Community 40 - "DestinationMoodBanner.tsx"
Cohesion: 0.13
Nodes (17): moodSizeForVariant(), stripStyles, styles, Variant, AIRPORT_DICTIONARY, AIRPORT_FALLBACK_IMAGE, ASSIGNED_URLS, BY_CODE (+9 more)

### Community 42 - "AirportAutocomplete.tsx"
Cohesion: 0.08
Nodes (63): getMonthDeals(), getExploreDestinations(), AIRPORT_ONLY_DICTIONARY, FULL_PLACE_DICTIONARY, getAirportDisplayName(), getAirportEntry(), getCityDisplayName(), lower() (+55 more)

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "DestinationMoodBanner.tsx"
Cohesion: 0.11
Nodes (14): __dirname, dist, indexHtml, indexPath, SPA_ROUTES, byCity, compact, curatedCities (+6 more)

### Community 45 - "AirportLocation"
Cohesion: 0.11
Nodes (19): AirportLocation(), TestAirportLocation_UnknownFallsBackUTC(), TestParseGF2TimeWithDateHint_TelAviv(), TestParseGF2Time_EuropeanDateFormat(), TestExtractGF2Leg_SingleSegment_DepartArriveDiffer(), TestExtractGF2Leg_TimeOnly_WithDateHint(), TestParseGF2Time_AcceptsFullDateTime(), TestParseGF2Time_NumericOffsetIsAbsolute() (+11 more)

### Community 46 - "test_cases"
Cohesion: 0.05
Nodes (40): departureDate, origin, byProvider, currency, error, from, items, route (+32 more)

### Community 47 - "LocaleContext.tsx"
Cohesion: 0.19
Nodes (16): getStorage(), languageToLocale(), loadSaved(), LocaleContext, LocaleContextValue, LocaleProvider(), save(), VALID_CURRENCIES (+8 more)

### Community 53 - "SearchRequest"
Cohesion: 0.10
Nodes (29): TestParseOtaOffers_normalizesIsrairDisplayName(), TestParseOtaOffers_IsrairNameToIATA(), TestCompleteExtraLegs(), TestExtraLegsFingerprint(), ParseOtaOffers(), parseOtaOffers(), truncateStr(), TestParseOtaOffers_dropsSkyscannerMetaDeepLink() (+21 more)

### Community 54 - "Nginx Proxy Manager — fly-fix TLS checklist"
Cohesion: 0.40
Nodes (4): Nginx Proxy Manager — fly-fix TLS checklist, Reissue frontend cert (both names), Required proxy-host settings, Symptoms Chrome shows

### Community 55 - "BuildLegAirlineDirectURL"
Cohesion: 0.18
Nodes (12): BuildLegAirlineDirectURL(), BuildRedirectURL(), getAffiliateID(), stripEmptyQueryParams(), TestBuildLegAirlineDirectURL_wizzPathNotHash(), TestBuildLegAirlineDirectURL_wizzRoundTripReturnDate(), isAffiliateTemplateBookingURL(), marketingCarrierForLeg() (+4 more)

### Community 56 - "FlightDetailsModal.tsx"
Cohesion: 0.13
Nodes (31): AIRLINE_NAMES, getAirlineName(), resolveAirlineLabel(), AIRLINE_FULL_NAMES, airportTimeZones, getAirportTimeZone(), cabinLabel(), FlightDetailsModal() (+23 more)

### Community 58 - "FiltersPanel.tsx"
Cohesion: 0.19
Nodes (14): formatAirlineFilterLabel(), f, FiltersPanel(), FiltersPanelProps, FlightDetailsModalProps, FlightResultCardProps, PositioningLegResult, FlightOption (+6 more)

### Community 59 - "steps"
Cohesion: 0.09
Nodes (22): runs-on, steps, jobs, deploy, name, on, push, workflow_dispatch (+14 more)

### Community 60 - "flyfix-api"
Cohesion: 0.06
Nodes (37): context, FLIGHT_SCRAPER_MAX_CONCURRENT, FLIGHT_SCRAPER_URL, PLAYWRIGHT_HEADLESS, PORT, SCRAPER_CDP_URLS, SCRAPER_PROXY_URL, SCRAPER_WARM_ON_START (+29 more)

### Community 61 - "exchangeRates.ts"
Cohesion: 0.19
Nodes (11): CheaperCitiesOption, Props, s, useExchangeRates(), MonetaryAmount, convertPrice(), CURRENCY_SYMBOLS, CurrencyCode (+3 more)

### Community 62 - "ResultsScreen.tsx"
Cohesion: 0.05
Nodes (89): collectTripDestinationCodes(), EditSearchModal(), HubRouteSummaryModal(), SearchSummaryBar(), DynamicDestinationsFormContentProps, defaultParams, DynamicDestinationsScreen(), Nav (+81 more)

### Community 63 - "affiliate.ts"
Cohesion: 0.27
Nodes (9): AffiliateProvider, AffiliateProviderResponse, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink(), OutboundLinkResponse (+1 more)

### Community 64 - "client.ts"
Cohesion: 0.12
Nodes (19): searchAirports(), apiGet(), apiUrl(), isLocalHostname(), resolveApiBase(), getDealsRange(), GetDealsRangeParams, GetMonthDealsParams (+11 more)

### Community 65 - "npm"
Cohesion: 0.17
Nodes (11): networks, proxy, container_name, image, networks, ports, restart, volumes (+3 more)

### Community 66 - "skyscanner.js"
Cohesion: 0.12
Nodes (35): com, fr, req, kiwiSearchUrl(), addPartner(), clickMatchingKiwiCard(), clickMatchingSkyscannerCard(), clocksFromSegments() (+27 more)

### Community 67 - "kiwi.js"
Cohesion: 0.16
Nodes (24): waitUntil(), offerTemplate(), segment(), segmentsFromRoundTripClocks(), clearKiwiSpaState(), ensureKiwiResultsUrl(), extractFromCaptured(), extractNextData() (+16 more)

### Community 68 - ".Search"
Cohesion: 0.27
Nodes (8): classicRoundTripMissingReturn(), TestDoSearchWithRetry_doesNotCacheRoundTrip(), TestSearch_ignoresIncompleteClassicRTCache(), TestSearch_servesCompleteClassicRTCache(), newGF2Cache(), TestSearchLegCached_usesCache(), gf2Cache, gf2CacheEntry

### Community 69 - "nginx-proxy-manager (VPS edge)"
Cohesion: 0.40
Nodes (4): Deploy sync, First-time / recovery, nginx-proxy-manager (VPS edge), On the server

### Community 70 - "AppIcon"
Cohesion: 0.07
Nodes (51): AppIcon(), AppIconLibrary, AppIconProps, styles, DestinationMoodBanner(), DestinationMoodStrip(), EditSearchModalProps, s (+43 more)

### Community 71 - "AuthContext.tsx"
Cohesion: 0.17
Nodes (22): authHeaders(), AuthUser, changePassword(), createUser(), deleteUser(), fetchAuthMe(), fetchUsers(), LoginResponse (+14 more)

### Community 72 - ".SearchAll"
Cohesion: 0.15
Nodes (9): TestRegistryFailureMessage_transientOutbound(), TestRegistrySearchAll_openJawGF2FailNotMaskedByKiwiSkip(), TestRegistrySearchAllPartialFailure(), isFastProvider(), isSkippedProviderErr(), IsTransientSearchErrMsg(), MultiSearchResult, Registry (+1 more)

### Community 73 - "handleCreateSession"
Cohesion: 0.31
Nodes (5): CreateSearchSessionRequest, ExtraSearchLeg, SearchTransientRetryMax(), finalizeSearchSession(), handleCreateSession()

### Community 74 - "scrape.js"
Cohesion: 0.18
Nodes (11): runWithOpenPage(), hasCdp(), runOne(), scrapeAll(), SITE_FNS, beginSearch(), endSearch(), isSearchBusy() (+3 more)

### Community 75 - "normalizeKiwiItem"
Cohesion: 0.12
Nodes (25): TotalStops(), TestCombineOneWayBatches(), TestCombineOneWayBatches_emptyBatch(), TestCombineOneWayBatches_openJawReturnDiversity(), TestAttachCanonicalIdentityAll_combineOneWay(), asArray(), collectCarriers(), extractKiwiLegs() (+17 more)

### Community 76 - "booking.ts"
Cohesion: 0.36
Nodes (8): BookingResolveRequest, BookingResolveStatus, bookingRetryDelayMs(), fetchBookingResolveOnce(), isTransientBookingFetchError(), isTransientBookingResolveResponse(), PublicBookingAlternative, resolveBookingOffer()

### Community 77 - "flyfix.ts"
Cohesion: 0.29
Nodes (7): apiPost(), FlyfixInsightsGroup, FlyfixIssue, FlyfixRefinedReport, FlyfixSummary, refineIssues(), RefineIssuesRequestBody

### Community 78 - "selectBookingOptionForQuote"
Cohesion: 0.40
Nodes (5): hostFromURL(), selectBookingOptionForQuote(), TestSelectBookingOptionForQuote_fallsBackWhenQuotePriceMismatch(), TestSelectBookingOptionForQuote_prefersDeepLinkHost(), TestSelectBookingOptionForQuote_prefersPriceMatch()

### Community 79 - "allocateLegQuoteAmount"
Cohesion: 0.50
Nodes (3): allocateLegQuoteAmount(), flightLegDurationMinutes(), TestAllocateLegQuoteAmount_splitOpenJaw()

### Community 80 - "server_carrier_test.go"
Cohesion: 0.83
Nodes (3): makeOfferWithCarriers(), TestExtractCarrierCodes(), TestPrimaryDisplayCarrier()

### Community 81 - "ThemeContext.tsx"
Cohesion: 0.13
Nodes (21): App(), linking, RTLWrapper(), API_BASE, setRuntimeConfigStore(), RuntimeConfigProvider(), RootNavigator(), ACCENT (+13 more)

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

### Community 88 - "expedia.js"
Cohesion: 0.19
Nodes (6): DEFAULT_SITES, expediaUrl(), scrapeExpedia(), attachJsonCapture(), gotoAndSettle(), mergeConfig()

### Community 92 - "time.Time"
Cohesion: 0.10
Nodes (25): elapsedMs(), minutesOfDay(), bookingResolveCacheEntry, CodeshareFingerprint(), roundTimeToMinutes(), ClickRecord, exploreDestRow, FullRoundTrip (+17 more)

### Community 93 - "Flight scraper (multisite)"
Cohesion: 0.40
Nodes (4): Docker, Flight scraper (multisite), Run locally, VPS (recommended): headed Chrome on `:99`

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
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 596 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Multi-provider flight search` connect `Features` to `booking_resolve.go`?**
  _High betweenness centrality (0.320) - this node is a cross-community bridge._
- **What connects `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `LandingScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.04929577464788732 - nodes in this community are weakly interconnected._
- **Why does `Recent enhancements` connect `Features` to `MonthDealsScreen.tsx`, `AppIcon`?**
  _High betweenness centrality (0.316) - this node is a cross-community bridge._
- **Should `SearchFormContent.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11264367816091954 - nodes in this community are weakly interconnected._
- **Should `Issue` be split into smaller, more focused modules?**
  _Cohesion score 0.10256410256410256 - nodes in this community are weakly interconnected._
- **Should `AttachCanonicalIdentity` be split into smaller, more focused modules?**
  _Cohesion score 0.12631578947368421 - nodes in this community are weakly interconnected._