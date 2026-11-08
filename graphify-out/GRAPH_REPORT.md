# Graph Report - workspace  (2026-11-08)

## Corpus Check
- 284 files · ~238,025 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 14 file(s) not represented in the graph (top: (none) 8, .example 2, .conf 2)

## Summary
- 2370 nodes · 7369 edges · 103 communities (85 shown, 18 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 595 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `00e5eb7d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- .ResolveQuotedPartnerBooking
- App.tsx
- useSearchParams.ts
- Issue
- SearchLoadingOverlay.tsx
- GoogleFlights2Provider
- frontend/package.json
- useTheme
- Features
- testing.T
- flight-scraper/package.json
- BookingOffer
- BookingOptionsFooter.tsx
- compilerOptions
- booking_resolve.go
- canonical_booking_test.go
- MonthDealsScreen.tsx
- googleflights2_provider.go
- server.go
- booking_resolve_test.go
- qa_runner.py
- ApiClient
- matcher_test.go
- TestResult
- ResponseValidator
- runtime_config.go
- allocateLegQuoteAmount
- expo
- config_loader.py
- react
- CanonicalItinerary
- auth.go
- itinerary.go
- SearchFormScreen.tsx
- explore_cache.go
- ValidationIssue
- Backend QA Automation Tool
- test-local-time.js
- affiliate.go
- search.ts
- GF2SearchAirports
- models.py
- ExploreScreen.tsx
- Fly-Fix – Frontend
- DestinationMoodBanner.tsx
- auth_test.go
- test_cases
- flightTimeDisplay.ts
- gen_explore_airport_coords.py
- flightcaptainweb
- session_store.go
- Nginx Proxy Manager — fly-fix TLS checklist
- api.ts
- FlightResultCard.tsx
- .finalize
- AppIcon
- steps
- flyfix-api
- .Search
- ResultsScreen.tsx
- ExploreScreen.tsx
- client.ts
- npm
- skyscanner.js
- kiwi.js
- AppIcon.tsx
- nginx-proxy-manager (VPS edge)
- SearchRequest
- AuthContext.tsx
- Registry
- providers.go
- warm.js
- ProviderResult
- exchangeRates.ts
- AirportLocation
- providers.go
- ValidateBookingURL
- types/index.ts
- booking.ts
- session.js
- Fly-Fix UI / UX
- TestApplySoftStrictBaggage
- backend_api_contracts.md
- ensure-edge-proxy.sh
- budget_config.go
- expedia.js
- LocaleContext.tsx
- install-edge-proxy-cron.sh
- sync-edge-stack.sh
- time.Time
- scrape.js
- ErrorBoundary
- scripts
- IsGF2RateLimitError
- ensure-flight-chrome.sh
- skyscanner.ts
- docker-entrypoint.sh
- go_pkg_strings

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 100 edges
2. `useLocale()` - 88 edges
3. `react` - 69 edges
4. `react-native` - 62 edges
5. `ResultsScreen()` - 56 edges
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

## Communities (103 total, 18 thin omitted)

### Community 0 - ".ResolveQuotedPartnerBooking"
Cohesion: 0.16
Nodes (20): resolveAllPartnerBookingsFromTokenWithRetry(), findBookingOptionsArray(), firstPartnerBookingOption(), firstPartnerURLInMap(), firstStringByKeys(), ResolvedPartnerBooking, isPartnerBookingList(), parseGF2BookingOptions() (+12 more)

### Community 1 - "App.tsx"
Cohesion: 0.10
Nodes (28): App(), linking, RTLWrapper(), LandingScreen(), Nav, styles, DynamicDestinationsStack(), MonthDealsStack() (+20 more)

### Community 2 - "useSearchParams.ts"
Cohesion: 0.17
Nodes (19): isDeepLinkDebugEnabled(), logDeepLinkDiagnostics(), mergeDeepLinkParams(), fromStash, fromUrl, kept, recovery, store (+11 more)

### Community 3 - "Issue"
Cohesion: 0.09
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "SearchLoadingOverlay.tsx"
Cohesion: 0.12
Nodes (19): getPhrasesForLanguage(), SEARCH_BUTTON_PHRASES, SEARCH_PROGRESS_PHRASES, s, SearchProgressBannerProps, ExtraLeg, Props, s (+11 more)

### Community 5 - "GoogleFlights2Provider"
Cohesion: 0.15
Nodes (11): classicRoundTripMissingReturn(), TestDoSearchWithRetry_doesNotCacheRoundTrip(), TestSearch_ignoresIncompleteClassicRTCache(), TestSearch_servesCompleteClassicRTCache(), GoogleFlights2Provider, legSearchRetryable(), newGF2Cache(), truncateGF2() (+3 more)

### Community 6 - "frontend/package.json"
Cohesion: 0.07
Nodes (36): config, { getDefaultConfig }, dependencies, expo@~52.0.0, @expo/metro-runtime@~4.0.1, expo-status-bar@~2.0.0, react@18.3.1, react-dom@18.3.1 (+28 more)

### Community 7 - "useTheme"
Cohesion: 0.13
Nodes (30): useAuth(), useRuntimeConfigActions(), AccountScreen(), styles, AdminRuntimeConfigPanel(), ConfigFieldRow(), SECTION_LABEL_KEYS, SECTION_ORDER (+22 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (33): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+25 more)

### Community 9 - "testing.T"
Cohesion: 0.05
Nodes (67): TestGF2PartnerOfferFromURL_acceptsHTTPS(), TestGF2PartnerOfferFromURL_rejectsUnsafe(), TestResolveGF2PartnerOffer_usesPersistedLegDeepLinkWithoutProvider(), TestSearchRequestFromSession_singleLegOverride(), intPtrOrNil(), runBookingMatch(), TestHandleBookingResolve_invalidItinerary(), TestHandleBookingResolve_prefillFallback() (+59 more)

### Community 10 - "flight-scraper/package.json"
Cohesion: 0.11
Nodes (17): express, playwright, dependencies, express@^4.21.2, playwright@^1.49.1, description, engines, node (+9 more)

### Community 11 - "BookingOffer"
Cohesion: 0.08
Nodes (59): airlineDomainForCarrier(), applySearchQuoteToOffer(), attachQuotedPriceMeta(), bookingMatchPriceNormalizer(), dedupeGF2PartnerOffers(), gf2OffersHavePrice(), gf2PartnerOfferFromQuoteURL(), gf2PartnerOfferFromResolved() (+51 more)

### Community 12 - "BookingOptionsFooter.tsx"
Cohesion: 0.15
Nodes (30): BookingResolveResponse, isSafeBookingUrl(), PublicBookingOffer, bookingOfferProviderLabel(), bookingOfferSubtitle(), formatBookingOfferPriceAmount(), formatBookingOfferPriceLine(), formatProviderDisplayName() (+22 more)

### Community 13 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 14 - "booking_resolve.go"
Cohesion: 0.14
Nodes (21): acquireBookingResolveSlot(), beginInflightResolve(), bookingResolveCacheKey(), bookingResolveMaxConcurrentFromEnv(), cacheTTLForStatus(), envDurationMinutes(), finishInflightResolve(), getCachedBookingResolve() (+13 more)

### Community 15 - "canonical_booking_test.go"
Cohesion: 0.11
Nodes (30): openJawOption(), TestBookingLinkModeDefaultsToGoogle(), TestBookingRouteFromSessionOption_splitOmitsReturn(), TestBuildGoogleFlightsFallbackFromParams(), TestBuildLegOrSegmentBookingURL_segment(), TestBuildOneWayLegBookingURL(), TestBuildSkyscannerPrefillURL_oneWay(), TestBuildSkyscannerPrefillURL_roundTrip() (+22 more)

### Community 16 - "MonthDealsScreen.tsx"
Cohesion: 0.08
Nodes (46): getFlightDetails(), SearchProgressBanner(), CheaperCitiesOption, buildDealsPositioningSignature(), dealBestScore(), fl, formatDealDate(), hfm (+38 more)

### Community 17 - "googleflights2_provider.go"
Cohesion: 0.14
Nodes (36): TestParseGF2TimeWithDateHint_AirportLocal(), TestExtractGF2BookingToken(), TestExtractGF2BookingURL(), TestBuildGF2ResultFromItinerary_FlatFormat(), TestParseGF2Response_AttachesFlatReturnFlights(), TestParseGF2Response_RapidAPIFlatTopFlights(), TestExtractGF2Leg_TimeOnly_NoDateHint(), TestExtractGF2SegmentFromFlight_CodeOnlyHasNoName() (+28 more)

### Community 18 - "server.go"
Cohesion: 0.07
Nodes (59): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, CanonicalFingerprint(), Carrier, CarrierCodes, CreateSearchSessionRequest (+51 more)

### Community 22 - "matcher_test.go"
Cohesion: 0.10
Nodes (43): classifyURLType(), extractPrice(), cfgTest(), floatPtr(), TestClassifyURLType_genericVsExact(), testConnectingTLVJFK(), TestExtractPrice_euroPrefixNotArrivalTime(), TestGenerateQueries_connecting() (+35 more)

### Community 23 - "TestResult"
Cohesion: 0.19
Nodes (3): ResponseAnalyzer, main(), _print_unreachable_backend_hint()

### Community 25 - "runtime_config.go"
Cohesion: 0.22
Nodes (16): adminAccessConfigured(), configRangeError, adminTokenConfigured(), defaultRuntimeConfig(), errConfigOutOfRange(), getRuntimeConfig(), handleAdminRuntimeConfig(), initRuntimeConfigStore() (+8 more)

### Community 26 - "allocateLegQuoteAmount"
Cohesion: 0.50
Nodes (3): allocateLegQuoteAmount(), flightLegDurationMinutes(), TestAllocateLegQuoteAmount_splitOpenJaw()

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.30
Nodes (10): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+2 more)

### Community 29 - "react"
Cohesion: 0.09
Nodes (27): ClearableTextInput(), ClearableTextInputProps, styles, DisplayPrice(), DisplayPriceProps, styles, HubRouteLeg, HubRouteSummaryModalProps (+19 more)

### Community 30 - "CanonicalItinerary"
Cohesion: 0.11
Nodes (23): defaultBookingMatchRunner(), corpusText(), domainFromURL(), countVerifiedPricedOffers(), MatchItinerary(), NewResolver(), truncateStr(), collectSerpAPIResultMaps() (+15 more)

### Community 31 - "auth.go"
Cohesion: 0.14
Nodes (38): authUserJSON(), bearerTokenFromRequest(), bootstrapAdminUser(), createAuthSession(), envFlagTrue(), handleAuthChangePassword(), handleAuthLogin(), handleAuthLogout() (+30 more)

### Community 32 - "itinerary.go"
Cohesion: 0.08
Nodes (56): canonicalItineraryForOption(), legRouteLabel(), TestCanonicalItineraryForOption_isolatesSplitLegs(), mustCanonicalForLog(), extractFlightNumbers(), flightNumberInText(), flightNumbersEquivalent(), splitFlightDesignator() (+48 more)

### Community 33 - "SearchFormScreen.tsx"
Cohesion: 0.17
Nodes (22): PassengerCabinPickerProps, defaultParams, SearchFormScreen(), styles, buildSearchString(), getParam(), getParams(), isWeb() (+14 more)

### Community 34 - "explore_cache.go"
Cohesion: 0.16
Nodes (16): airportCoord, exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut(), getAirportCoord() (+8 more)

### Community 36 - "Backend QA Automation Tool"
Cohesion: 0.18
Nodes (10): Backend QA Automation Tool, Features, If the run feels slow or “stuck”, Notes, Optional AI Setup (Ollama), Output, Project Structure, Run (+2 more)

### Community 37 - "test-local-time.js"
Cohesion: 0.19
Nodes (10): a, arr, assert, b, dep, late, AIRPORT_TZ, localHmToIso() (+2 more)

### Community 38 - "affiliate.go"
Cohesion: 0.15
Nodes (21): BuildLegAirlineDirectURL(), BuildRedirectURL(), getAffiliateID(), GetClicksSummary(), getOTAProvider(), GetSessionAndOption(), ParseOptionIndex(), RecordClick() (+13 more)

### Community 39 - "search.ts"
Cohesion: 0.13
Nodes (28): CachedResult, createSearchSession(), createSearchSessionWithRetry(), ensureLegacyPurge(), fetchFresh(), getFromStorage(), getSearchSessionResults(), getStorage() (+20 more)

### Community 40 - "GF2SearchAirports"
Cohesion: 0.27
Nodes (11): gf2MetroKey(), GF2SearchAirports(), limitGF2SearchAirports(), ResolveGF2PlaceCode(), containsAll(), TestGF2SearchAirports_CityOnlyCode(), TestGF2SearchAirports_LondonParis(), TestGF2SearchAirports_SingleAirport() (+3 more)

### Community 42 - "ExploreScreen.tsx"
Cohesion: 0.14
Nodes (38): AIRPORT_ONLY_DICTIONARY, FULL_PLACE_DICTIONARY, getAirportDisplayName(), getAirportEntry(), getCityDisplayName(), lower(), matchesQuery(), PLACE_SEARCH_LIMIT (+30 more)

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "DestinationMoodBanner.tsx"
Cohesion: 0.07
Nodes (21): __dirname, dist, indexHtml, indexPath, SPA_ROUTES, AIRPORT_DICTIONARY, ASSIGNED_URLS, BY_CODE (+13 more)

### Community 45 - "auth_test.go"
Cohesion: 0.15
Nodes (18): initAuthStore(), initTestAuthDB(), randomTestPassword(), TestAuthLoginAndChangePassword(), TestAuthRegister(), TestAuthUserManagement(), TestBootstrapAdminPasswordSync(), TestBootstrapAdminUser() (+10 more)

### Community 46 - "test_cases"
Cohesion: 0.05
Nodes (40): departureDate, origin, byProvider, currency, error, from, items, route (+32 more)

### Community 47 - "flightTimeDisplay.ts"
Cohesion: 0.17
Nodes (21): getAirportNameByCode(), airportTimeZones, getAirportTimeZone(), cabinLabel(), FlightDetailsModal(), formatDuration(), layoverBetween(), legDuration() (+13 more)

### Community 53 - "session_store.go"
Cohesion: 0.14
Nodes (27): ProviderSearchStats, SearchSession, SearchSessionResultsResponse, SearchSessionStatus, loadSearchSession(), markSessionFailed(), publishSessionSnapshot(), TestLoadSearchSession_Expiry() (+19 more)

### Community 54 - "Nginx Proxy Manager — fly-fix TLS checklist"
Cohesion: 0.40
Nodes (4): Nginx Proxy Manager — fly-fix TLS checklist, Reissue frontend cert (both names), Required proxy-host settings, Symptoms Chrome shows

### Community 55 - "api.ts"
Cohesion: 0.10
Nodes (24): SortBarProps, defaultFilters, isCurrentSearchGeneration(), searchActions, SearchFilters, SearchState, SortField, SortOrder (+16 more)

### Community 56 - "FlightResultCard.tsx"
Cohesion: 0.11
Nodes (32): AIRLINE_NAMES, getAirlineName(), resolveAirlineLabel(), AIRLINE_FULL_NAMES, f, FiltersPanel(), FiltersPanelProps, FlightDetailsModalProps (+24 more)

### Community 58 - "AppIcon"
Cohesion: 0.12
Nodes (39): AppIcon(), collectTripDestinationCodes(), DestinationMoodBanner(), DestinationMoodStrip(), moodSizeForVariant(), stripStyles, styles, Variant (+31 more)

### Community 59 - "steps"
Cohesion: 0.09
Nodes (22): runs-on, steps, jobs, deploy, name, on, push, workflow_dispatch (+14 more)

### Community 60 - "flyfix-api"
Cohesion: 0.06
Nodes (37): context, FLIGHT_SCRAPER_MAX_CONCURRENT, FLIGHT_SCRAPER_URL, PLAYWRIGHT_HEADLESS, PORT, SCRAPER_CDP_URLS, SCRAPER_PROXY_URL, SCRAPER_WARM_ON_START (+29 more)

### Community 61 - ".Search"
Cohesion: 0.18
Nodes (6): truncateStr(), OtaScraperProvider, Docker, Flight scraper (multisite), Run locally, VPS (recommended): headed Chrome on `:99`

### Community 62 - "ResultsScreen.tsx"
Cohesion: 0.09
Nodes (35): useRuntimeConfig(), DynamicDestinationsFormContentProps, defaultParams, DynamicDestinationsScreen(), Nav, styles, ResultsSkeletonCard(), ResultsSkeletonList() (+27 more)

### Community 63 - "ExploreScreen.tsx"
Cohesion: 0.14
Nodes (22): getMonthDeals(), c, countryFlag(), d, DestCard(), ExploreScreenProps, fmtDate(), fmtPrice() (+14 more)

### Community 64 - "client.ts"
Cohesion: 0.05
Nodes (49): AffiliateProvider, AffiliateProviderResponse, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink(), OutboundLinkResponse (+41 more)

### Community 65 - "npm"
Cohesion: 0.17
Nodes (11): networks, proxy, container_name, image, networks, ports, restart, volumes (+3 more)

### Community 66 - "skyscanner.js"
Cohesion: 0.20
Nodes (18): com, fr, req, parseDepArrHm(), skyscannerDate(), ensureDatedResultsUrl(), extractSkyscanner(), FLIGHTS_PATH_BY_HOST (+10 more)

### Community 67 - "kiwi.js"
Cohesion: 0.16
Nodes (23): offerTemplate(), segment(), clearKiwiSpaState(), ensureKiwiResultsUrl(), extractFromCaptured(), extractNextData(), flattenOffers(), kiwiPathLooksCorrect() (+15 more)

### Community 68 - "AppIcon.tsx"
Cohesion: 0.11
Nodes (17): AppIconLibrary, AppIconProps, styles, EditSearchModalProps, s, s, SearchSummaryBarProps, getSvgMarkup() (+9 more)

### Community 69 - "nginx-proxy-manager (VPS edge)"
Cohesion: 0.40
Nodes (4): Deploy sync, First-time / recovery, nginx-proxy-manager (VPS edge), On the server

### Community 70 - "SearchRequest"
Cohesion: 0.19
Nodes (15): TestCompleteExtraLegs(), TestExtraLegsFingerprint(), TestSanitizeStandardSearchRequest(), otaCabin(), otaCurrency(), otaScrapeSemaphore(), CompleteExtraLegs(), ExtraLegsFingerprint() (+7 more)

### Community 71 - "AuthContext.tsx"
Cohesion: 0.17
Nodes (24): authHeaders(), AuthUser, changePassword(), createUser(), deleteUser(), fetchAuthMe(), fetchUsers(), LoginResponse (+16 more)

### Community 72 - "Registry"
Cohesion: 0.15
Nodes (11): TestSanitizeProviderErrorForUser(), AttachCanonicalIdentityAll(), TestRegistryFailureMessage_transientOutbound(), TestRegistrySearchAll_openJawGF2FailNotMaskedByKiwiSkip(), TestRegistrySearchAllPartialFailure(), isFastProvider(), isSkippedProviderErr(), IsTransientSearchErrMsg() (+3 more)

### Community 73 - "providers.go"
Cohesion: 0.24
Nodes (17): TotalStops(), asArray(), collectCarriers(), detectSelfTransfer(), extractKiwiLegs(), firstFloat(), firstString(), kiwiSegmentFromMap() (+9 more)

### Community 74 - "warm.js"
Cohesion: 0.09
Nodes (23): cdpLockBusy(), chain, DEFAULT_SITES, beginSearch(), endSearch(), isSearchBusy(), app, express (+15 more)

### Community 75 - "ProviderResult"
Cohesion: 0.11
Nodes (16): DedupeProviderResults(), ItineraryFingerprint(), mergeSelfTransfer(), uniqueStrings(), cheapestReturnLeg(), providerResultArrivalAirport(), ResultMatchesItinerary(), parseOtaOffers() (+8 more)

### Community 76 - "exchangeRates.ts"
Cohesion: 0.29
Nodes (8): useExchangeRates(), convertPrice(), CURRENCY_SYMBOLS, CurrencyCode, ensureRates(), fetchRates(), getDisplayPrice(), ratesToUSD

### Community 77 - "AirportLocation"
Cohesion: 0.12
Nodes (18): AirportLocation(), TestAirportLocation_UnknownFallsBackUTC(), TestParseGF2TimeWithDateHint_TelAviv(), TestParseGF2Time_EuropeanDateFormat(), TestExtractGF2Leg_SingleSegment_DepartArriveDiffer(), TestExtractGF2Leg_TimeOnly_WithDateHint(), TestParseGF2Time_AcceptsFullDateTime(), TestParseGF2Time_NumericOffsetIsAbsolute() (+10 more)

### Community 78 - "providers.go"
Cohesion: 0.25
Nodes (13): TestCombineOneWayBatches(), TestCombineOneWayBatches_emptyBatch(), TestCombineOneWayBatches_openJawReturnDiversity(), TestAttachCanonicalIdentityAll_combineOneWay(), cloneLegs(), CombineOneWayBatches(), extraLegMaxPerBatch(), finalizeCombinedBatches() (+5 more)

### Community 79 - "ValidateBookingURL"
Cohesion: 0.19
Nodes (15): gf2CheckoutOffers(), providerFromOffer(), publicBookingOfferFromPick(), publicOfferFromMatch(), IsCheckoutBookingURL(), IsNonBookableDomain(), TestIsCheckoutBookingURL_rejectsFlightSearchPages(), TestIsNonBookableDomain_blocksFlightRadar() (+7 more)

### Community 80 - "types/index.ts"
Cohesion: 0.20
Nodes (10): ExploreResponse, getExploreDestinations(), GetExploreDestinationsParams, DestCardProps, ExploreDestination, countByStopsFilter(), matchesStopsFilter(), maxStopsPerLeg() (+2 more)

### Community 81 - "booking.ts"
Cohesion: 0.36
Nodes (8): BookingResolveRequest, BookingResolveStatus, bookingRetryDelayMs(), fetchBookingResolveOnce(), isTransientBookingFetchError(), isTransientBookingResolveResponse(), PublicBookingAlternative, resolveBookingOffer()

### Community 82 - "session.js"
Cohesion: 0.23
Nodes (15): pageLooksBlocked(), withCdpLock(), getOpenPageHook(), browserPromises, { chromium, firefox }, getBrowser(), isTransientScrapeError(), pruneJunkPages() (+7 more)

### Community 83 - "Fly-Fix UI / UX"
Cohesion: 0.15
Nodes (12): Avoid (AI-vibe tells), Checklist before shipping UI, Design north star, Fly-Fix UI / UX, Landing, Motion, Prefer, Responsive (+4 more)

### Community 84 - "TestApplySoftStrictBaggage"
Cohesion: 0.52
Nodes (6): applySoftStrictBaggage(), makeOfferWithBags(), makeOfferWithMissingBags(), TestApplySoftStrictBaggage(), TestClassifyOfferBaggage(), classifyOfferBaggage()

### Community 85 - "backend_api_contracts.md"
Cohesion: 0.18
Nodes (10): 1.1 Create Search Session, 1.2 Get Search Session Status & Results, 1. Flight Search Sessions, 2.1 Get Monthly Deals, 2. Monthly Deals API, 3.1 Search Airports & Cities, 3. Airport & City Autocomplete, 4. High-Level Handler Layout (Go) (+2 more)

### Community 87 - "budget_config.go"
Cohesion: 0.12
Nodes (28): init(), budgetCfg(), BudgetModeEnabled(), durationFromEnvMin(), envTruthy(), ExploreBudgetLimits(), FilterProviderNamesForBudget(), GF2EffectiveCacheTTL() (+20 more)

### Community 88 - "expedia.js"
Cohesion: 0.35
Nodes (4): expediaUrl(), scrapeExpedia(), attachJsonCapture(), gotoAndSettle()

### Community 89 - "LocaleContext.tsx"
Cohesion: 0.14
Nodes (19): getStorage(), languageToLocale(), loadSaved(), LocaleContext, LocaleContextValue, LocaleProvider(), save(), VALID_CURRENCIES (+11 more)

### Community 92 - "time.Time"
Cohesion: 0.14
Nodes (21): elapsedMs(), minutesOfDay(), mergeExplorePriceRows(), exploreDestRow, exploreSession, FullRoundTrip, attachReturnLegKeepPrice(), ensureRoundTripLegs() (+13 more)

### Community 93 - "scrape.js"
Cohesion: 0.48
Nodes (5): runWithOpenPage(), hasCdp(), runOne(), scrapeAll(), SITE_FNS

### Community 94 - "ErrorBoundary"
Cohesion: 0.15
Nodes (4): ErrorBoundary, Props, s, State

### Community 95 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, android, build, ios, start, web

### Community 96 - "IsGF2RateLimitError"
Cohesion: 0.50
Nodes (4): isTransientGF2BookingErr(), bookingResolveFailureResponse(), IsGF2RateLimitError(), isTransientGF2SearchErr()

### Community 101 - "ensure-flight-chrome.sh"
Cohesion: 0.70
Nodes (4): DISPLAY, ensure_gateway_proxy(), log(), ensure-flight-chrome.sh script

### Community 102 - "skyscanner.ts"
Cohesion: 0.42
Nodes (10): BookingHop, bookingHopsFromOption(), firstSeg(), isClassicRoundTripLegs(), isoDatePrefix(), isSplitBookingItinerary(), lastSeg(), legNeedsSegmentSplit() (+2 more)

### Community 105 - "go_pkg_strings"
Cohesion: 0.09
Nodes (7): logMatchEvent(), exploreLiveCandidate, parseOtaScraperSites(), MatchEvent, otaScraperSearchRequest, otaScraperSearchResponse, otaScraperSiteResult

## Knowledge Gaps
- **3 isolated node(s):** `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 569 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Fly-Fix` connect `Features` to `react`?**
  _High betweenness centrality (0.355) - this node is a cross-community bridge._
- **What connects `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1036036036036036 - nodes in this community are weakly interconnected._
- **Why does `Multi-provider flight search` connect `Features` to `budget_config.go`?**
  _High betweenness centrality (0.352) - this node is a cross-community bridge._
- **Should `Issue` be split into smaller, more focused modules?**
  _Cohesion score 0.09358974358974359 - nodes in this community are weakly interconnected._
- **Why does `Recent enhancements` connect `react` to `Features`, `AppIcon`?**
  _High betweenness centrality (0.340) - this node is a cross-community bridge._
- **Should `SearchLoadingOverlay.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11857707509881422 - nodes in this community are weakly interconnected._