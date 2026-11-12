# Graph Report - workspace  (2026-11-12)

## Corpus Check
- 292 files · ~244,589 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 16 file(s) not represented in the graph (top: (none) 8, .example 2, .conf 2)

## Summary
- 2433 nodes · 7602 edges · 108 communities (85 shown, 23 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 615 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6cb9d6a9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- .ResolveQuotedPartnerBooking
- RootNavigator.tsx
- AirportLocation
- Issue
- LocaleContext.tsx
- session_store.go
- frontend/package.json
- useTheme
- Features
- DestinationMoodBanner.tsx
- flight-scraper/package.json
- resolveGF2PartnerOffers
- BookingOptionsFooter.tsx
- compilerOptions
- ExploreScreen.tsx
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
- api.ts
- expo
- config_loader.py
- auth.go
- CanonicalItinerary
- auth.go
- itinerary.go
- runBookingMatch
- explore_cache.go
- ValidationIssue
- Backend QA Automation Tool
- test-roundtrip-legs.js
- affiliate.go
- search.ts
- sharedLinkCache.ts
- models.py
- ExploreScreen.tsx
- Fly-Fix – Frontend
- DestinationMoodBanner.tsx
- booking_resolve.go
- test_cases
- FlightDetailsModal.tsx
- gen_explore_airport_coords.py
- flightcaptainweb
- .Search
- Nginx Proxy Manager — fly-fix TLS checklist
- BookingOffer
- SearchFormScreen.tsx
- .finalize
- useLocale
- steps
- flyfix-api
- SelectBestOffer
- ResultsScreen.tsx
- booking.ts
- client.ts
- npm
- skyscanner.js
- kiwi.js
- flyfix.ts
- nginx-proxy-manager (VPS edge)
- SearchRequest
- AuthContext.tsx
- .SearchAll
- normalizeKiwiItem
- scrape.js
- ProviderResult
- main
- ThemeContext.tsx
- FiltersPanel.tsx
- handleCreateSession
- exchangeRates.ts
- session.js
- Fly-Fix UI / UX
- TestApplySoftStrictBaggage
- backend_api_contracts.md
- ensure-edge-proxy.sh
- budget_config.go
- expedia.js
- searchRouteUrl.ts
- install-edge-proxy-cron.sh
- sync-edge-stack.sh
- time.Time
- bookableDates.ts
- ErrorBoundary
- GF2SearchAirports
- selectBookingOptionForQuote
- ValidateBookingURL
- otaScraperSearchResponse
- AppIcon.tsx
- gf2Cache
- ensure-flight-chrome.sh
- skyscanner.ts
- docker-entrypoint.sh
- gf2ExploreResolveDeps
- testing.T

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 106 edges
2. `useLocale()` - 94 edges
3. `react` - 73 edges
4. `react-native` - 66 edges
5. `ResultsScreen()` - 57 edges
6. `AppIcon()` - 56 edges
7. `ProviderResult` - 55 edges
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

## Communities (108 total, 23 thin omitted)

### Community 0 - ".ResolveQuotedPartnerBooking"
Cohesion: 0.17
Nodes (16): findBookingOptionsArray(), firstPartnerBookingOption(), firstPartnerURLInMap(), firstStringByKeys(), ResolvedPartnerBooking, isPartnerBookingList(), parseGF2BookingOptions(), partnerRequestTokenFromMap() (+8 more)

### Community 1 - "RootNavigator.tsx"
Cohesion: 0.06
Nodes (58): App(), linking, RTLWrapper(), API_BASE, styles, Props, s, State (+50 more)

### Community 2 - "AirportLocation"
Cohesion: 0.11
Nodes (22): AirportLocation(), TestAirportLocation_UnknownFallsBackUTC(), TestParseGF2TimeWithDateHint_TelAviv(), TestParseGF2Time_EuropeanDateFormat(), TestExtractGF2Leg_SingleSegment_DepartArriveDiffer(), TestExtractGF2Leg_TimeOnly_NoDateHint(), TestExtractGF2Leg_TimeOnly_WithDateHint(), TestExtractGF2SegmentFromFlight_CodeOnlyHasNoName() (+14 more)

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "LocaleContext.tsx"
Cohesion: 0.17
Nodes (14): getStorage(), languageToLocale(), loadSaved(), LocaleContext, LocaleContextValue, LocaleProvider(), save(), VALID_CURRENCIES (+6 more)

### Community 5 - "session_store.go"
Cohesion: 0.19
Nodes (21): loadSearchSession(), markSessionFailed(), TestLoadSearchSession_Expiry(), searchSessionTTL(), startSearchSessionCleanup(), cleanupPersistedSessions(), importLegacyJSONSessions(), initSessionStore() (+13 more)

### Community 6 - "frontend/package.json"
Cohesion: 0.06
Nodes (41): config, { getDefaultConfig }, dependencies, expo@~52.0.0, @expo/metro-runtime@~4.0.1, expo-status-bar@~2.0.0, react@18.3.1, react-dom@18.3.1 (+33 more)

### Community 7 - "useTheme"
Cohesion: 0.09
Nodes (48): ClearableTextInput(), ClearableTextInputProps, styles, useAuth(), useRuntimeConfig(), useRuntimeConfigActions(), AccountScreen(), styles (+40 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (33): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+25 more)

### Community 9 - "DestinationMoodBanner.tsx"
Cohesion: 0.18
Nodes (10): AIRPORT_DICTIONARY, ASSIGNED_URLS, BY_CODE, BY_COUNTRY, DestinationMood, FALLBACK_IMAGE, hashCode(), LANDING_MOOD_DESTINATIONS (+2 more)

### Community 10 - "flight-scraper/package.json"
Cohesion: 0.11
Nodes (17): express, playwright, dependencies, express@^4.21.2, playwright@^1.49.1, description, engines, node (+9 more)

### Community 11 - "resolveGF2PartnerOffers"
Cohesion: 0.06
Nodes (46): allocateLegQuoteAmount(), applySearchQuoteToOffer(), attachQuotedPriceMeta(), dedupeGF2PartnerOffers(), flightLegDurationMinutes(), gf2OffersHavePrice(), gf2PartnerOfferFromQuoteURL(), gf2PartnerOfferFromResolved() (+38 more)

### Community 12 - "BookingOptionsFooter.tsx"
Cohesion: 0.15
Nodes (29): PublicBookingOffer, bookingOfferProviderLabel(), bookingOfferSubtitle(), formatBookingOfferPriceAmount(), formatBookingOfferPriceLine(), formatProviderDisplayName(), BookingOptionBadge, BookingOptionCard() (+21 more)

### Community 13 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 14 - "ExploreScreen.tsx"
Cohesion: 0.18
Nodes (26): getExploreDestinations(), getAirportEntry(), getCityDisplayName(), AirportAutocomplete(), c, countryFlag(), d, DestCard() (+18 more)

### Community 15 - "canonical_booking_test.go"
Cohesion: 0.12
Nodes (29): openJawOption(), TestBookingLinkModeDefaultsToSkyscanner(), TestBookingRouteFromSessionOption_splitOmitsReturn(), TestBuildGoogleFlightsFallbackFromParams(), TestBuildLegOrSegmentBookingURL_segment(), TestBuildOneWayLegBookingURL(), TestBuildSkyscannerPrefillURL_oneWay(), TestBuildSkyscannerPrefillURL_roundTrip() (+21 more)

### Community 16 - "MonthDealsScreen.tsx"
Cohesion: 0.08
Nodes (46): getAirportNameByCode(), buildDealsPositioningSignature(), dealBestScore(), fl, fmtDur(), formatDealDate(), hfm, layoverBetween() (+38 more)

### Community 17 - "googleflights2_provider.go"
Cohesion: 0.12
Nodes (39): TestParseGF2TimeWithDateHint_AirportLocal(), TestExtractGF2BookingToken(), TestExtractGF2BookingURL(), TestExtractGF2PartnerBookingTokenPrefersPartnerURL(), TestBuildGF2ResultFromItinerary_FlatFormat(), TestParseGF2Response_AttachesFlatReturnFlights(), TestParseGF2Response_RapidAPIFlatTopFlights(), buildGF2ResultFromItinerary() (+31 more)

### Community 18 - "server.go"
Cohesion: 0.07
Nodes (63): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, CanonicalFingerprint(), normalizeProviderBookingURL(), Carrier, CarrierCodes (+55 more)

### Community 22 - "matcher_test.go"
Cohesion: 0.16
Nodes (31): extractPrice(), cfgTest(), floatPtr(), testConnectingTLVJFK(), TestExtractPrice_euroPrefixNotArrivalTime(), TestGenerateQueries_connecting(), TestGenerateQueries_direct(), TestGenerateQueries_gf2AirlineNameIdentity() (+23 more)

### Community 23 - "TestResult"
Cohesion: 0.19
Nodes (3): ResponseAnalyzer, main(), _print_unreachable_backend_hint()

### Community 25 - "runtime_config.go"
Cohesion: 0.22
Nodes (16): adminAccessConfigured(), configRangeError, adminTokenConfigured(), defaultRuntimeConfig(), errConfigOutOfRange(), getRuntimeConfig(), handleAdminRuntimeConfig(), initRuntimeConfigStore() (+8 more)

### Community 26 - "api.ts"
Cohesion: 0.08
Nodes (30): DynamicDestinationsFormContentProps, FiltersPanelProps, FlightDetailsModalProps, FlightResultCardProps, PassengerCabinPickerProps, SearchFormContentProps, SortBarProps, PositioningLegResult (+22 more)

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.30
Nodes (10): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+2 more)

### Community 29 - "auth.go"
Cohesion: 0.18
Nodes (19): bootstrapAdminUser(), createAuthSession(), envFlagTrue(), handleAuthLogin(), initAuthStore(), insertAdminUser(), newSessionToken(), publicRegistrationEnabled() (+11 more)

### Community 30 - "CanonicalItinerary"
Cohesion: 0.14
Nodes (22): corpusText(), domainFromURL(), countVerifiedPricedOffers(), MatchItinerary(), NewResolver(), truncateStr(), collectSerpAPIResultMaps(), DefaultConfig() (+14 more)

### Community 31 - "auth.go"
Cohesion: 0.16
Nodes (33): GetSessionAndOption(), authUserJSON(), bearerTokenFromRequest(), handleAuthChangePassword(), handleAuthLogout(), handleAuthMe(), handleAuthRegister(), handleAuthUsers() (+25 more)

### Community 32 - "itinerary.go"
Cohesion: 0.11
Nodes (41): extractFlightNumbers(), flightNumberInText(), flightNumbersEquivalent(), splitFlightDesignator(), textContainsAirport(), textContainsAny(), timeMatches(), connectingFlightQueries() (+33 more)

### Community 33 - "runBookingMatch"
Cohesion: 0.11
Nodes (27): canonicalItineraryForOption(), intPtrOrNil(), legRouteLabel(), TestCanonicalItineraryForOption_isolatesSplitLegs(), mustCanonicalForLog(), runBookingMatch(), TestHandleBookingResolve_prefillFallback(), TestHandleBookingResolve_verified() (+19 more)

### Community 34 - "explore_cache.go"
Cohesion: 0.13
Nodes (19): airportCoord, exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut(), getAirportCoord() (+11 more)

### Community 36 - "Backend QA Automation Tool"
Cohesion: 0.18
Nodes (10): Backend QA Automation Tool, Features, If the run feels slow or “stuck”, Notes, Optional AI Setup (Ollama), Output, Project Structure, Run (+2 more)

### Community 37 - "test-roundtrip-legs.js"
Cohesion: 0.13
Nodes (19): a, arr, assert, b, dep, late, assert, frSegs (+11 more)

### Community 38 - "affiliate.go"
Cohesion: 0.17
Nodes (16): BuildLegAirlineDirectURL(), BuildRedirectURL(), getAffiliateID(), GetClicksSummary(), getOTAProvider(), ParseOptionIndex(), RecordClick(), ResolveProvider() (+8 more)

### Community 39 - "search.ts"
Cohesion: 0.13
Nodes (28): CachedResult, createSearchSession(), createSearchSessionWithRetry(), ensureLegacyPurge(), fetchFresh(), getFromStorage(), getSearchSessionResults(), getStorage() (+20 more)

### Community 40 - "sharedLinkCache.ts"
Cohesion: 0.17
Nodes (19): SearchUrlState, isDeepLinkDebugEnabled(), logDeepLinkDiagnostics(), mergeDeepLinkParams(), fromStash, fromUrl, kept, recovery (+11 more)

### Community 42 - "ExploreScreen.tsx"
Cohesion: 0.12
Nodes (32): AIRPORT_ONLY_DICTIONARY, FULL_PLACE_DICTIONARY, getAirportDisplayName(), lower(), matchesQuery(), PLACE_SEARCH_LIMIT, rankResult(), searchAirportsLocal() (+24 more)

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "DestinationMoodBanner.tsx"
Cohesion: 0.12
Nodes (11): __dirname, dist, indexHtml, indexPath, SPA_ROUTES, byCity, curatedCities, curatedUrls (+3 more)

### Community 45 - "booking_resolve.go"
Cohesion: 0.09
Nodes (24): acquireBookingResolveSlot(), beginInflightResolve(), bookingResolveCacheKey(), bookingResolveFailureResponse(), bookingResolveMaxConcurrentFromEnv(), cacheTTLForStatus(), envDurationMinutes(), finishInflightResolve() (+16 more)

### Community 46 - "test_cases"
Cohesion: 0.05
Nodes (40): departureDate, origin, byProvider, currency, error, from, items, route (+32 more)

### Community 47 - "FlightDetailsModal.tsx"
Cohesion: 0.10
Nodes (42): isSafeBookingUrl(), AIRLINE_NAMES, getAirlineName(), resolveAirlineLabel(), AIRLINE_FULL_NAMES, airportTimeZones, getAirportTimeZone(), cabinLabel() (+34 more)

### Community 53 - ".Search"
Cohesion: 0.09
Nodes (16): parseOtaOffers(), truncateStr(), TestParseOtaOffers_dropsSkyscannerMetaDeepLink(), TestParseOtaOffersEmptyAndInvalid(), TestParseOtaOffersSolidcodeShape(), flattenOtaScraperResponse(), otaCabin(), otaCurrency() (+8 more)

### Community 54 - "Nginx Proxy Manager — fly-fix TLS checklist"
Cohesion: 0.40
Nodes (4): Nginx Proxy Manager — fly-fix TLS checklist, Reissue frontend cert (both names), Required proxy-host settings, Symptoms Chrome shows

### Community 55 - "BookingOffer"
Cohesion: 0.15
Nodes (34): airlineDomainForCarrier(), bookingMatchPriceNormalizer(), isAffiliateTemplateBookingURL(), marketingCarrierForLegIndex(), normalizedGF2OfferPrice(), offersIncludeAirlineDirect(), preferAirlineDirectWhenCheaperThanMarkedUpOTA(), publicAlternativesFromOffers() (+26 more)

### Community 56 - "SearchFormScreen.tsx"
Cohesion: 0.25
Nodes (15): defaultParams, SearchFormScreen(), styles, getParam(), getParams(), isWeb(), parseSearchParamsFromUrl(), updateSearchUrl() (+7 more)

### Community 58 - "useLocale"
Cohesion: 0.09
Nodes (48): AppIcon(), collectTripDestinationCodes(), DestinationMoodBanner(), DestinationMoodStrip(), moodSizeForVariant(), stripStyles, styles, Variant (+40 more)

### Community 59 - "steps"
Cohesion: 0.09
Nodes (22): runs-on, steps, jobs, deploy, name, on, push, workflow_dispatch (+14 more)

### Community 60 - "flyfix-api"
Cohesion: 0.06
Nodes (37): context, FLIGHT_SCRAPER_MAX_CONCURRENT, FLIGHT_SCRAPER_URL, PLAYWRIGHT_HEADLESS, PORT, SCRAPER_CDP_URLS, SCRAPER_PROXY_URL, SCRAPER_WARM_ON_START (+29 more)

### Community 61 - "SelectBestOffer"
Cohesion: 0.14
Nodes (15): quoteBindingForMatch(), classifyURLType(), TestClassifyURLType_genericVsExact(), TestSelectBestOffer_cheapestOTAOverAirline(), TestSelectBestOffer_conflictingCandidatesPicksCheapest(), TestSelectBestOffer_missingPrice(), TestSelectBestOffer_prefersPriceAmongSameURLType(), TestSelectBestOffer_prefersQuoteMatchingPrice() (+7 more)

### Community 62 - "ResultsScreen.tsx"
Cohesion: 0.09
Nodes (37): EditSearchModal(), HubRouteSummaryModal(), SearchProgressBanner(), SearchSummaryBar(), defaultParams, DynamicDestinationsScreen(), Nav, styles (+29 more)

### Community 63 - "booking.ts"
Cohesion: 0.15
Nodes (18): AffiliateProvider, AffiliateProviderResponse, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink(), OutboundLinkResponse (+10 more)

### Community 64 - "client.ts"
Cohesion: 0.12
Nodes (21): searchAirports(), apiGet(), isLocalHostname(), resolveApiBase(), getDealsRange(), GetDealsRangeParams, getMonthDeals(), GetMonthDealsParams (+13 more)

### Community 65 - "npm"
Cohesion: 0.17
Nodes (11): networks, proxy, container_name, image, networks, ports, restart, volumes (+3 more)

### Community 66 - "skyscanner.js"
Cohesion: 0.17
Nodes (20): com, fr, req, waitUntil(), skyscannerDate(), ensureDatedResultsUrl(), extractSkyscanner(), FLIGHTS_PATH_BY_HOST (+12 more)

### Community 67 - "kiwi.js"
Cohesion: 0.16
Nodes (24): offerTemplate(), segment(), segmentsFromRoundTripClocks(), clearKiwiSpaState(), ensureKiwiResultsUrl(), extractFromCaptured(), extractNextData(), flattenOffers() (+16 more)

### Community 68 - "flyfix.ts"
Cohesion: 0.29
Nodes (7): apiPost(), FlyfixInsightsGroup, FlyfixIssue, FlyfixRefinedReport, FlyfixSummary, refineIssues(), RefineIssuesRequestBody

### Community 69 - "nginx-proxy-manager (VPS edge)"
Cohesion: 0.40
Nodes (4): Deploy sync, First-time / recovery, nginx-proxy-manager (VPS edge), On the server

### Community 70 - "SearchRequest"
Cohesion: 0.14
Nodes (21): TestCompleteExtraLegs(), TestExtraLegsFingerprint(), classicRoundTripMissingReturn(), TestClassicRoundTripMissingReturn(), TestDoSearchWithRetry_doesNotCacheRoundTrip(), TestSearch_ignoresIncompleteClassicRTCache(), TestSearch_servesCompleteClassicRTCache(), legSearchRetryable() (+13 more)

### Community 71 - "AuthContext.tsx"
Cohesion: 0.09
Nodes (38): authHeaders(), AuthUser, changePassword(), createUser(), deleteUser(), fetchAuthMe(), fetchUsers(), LoginResponse (+30 more)

### Community 72 - ".SearchAll"
Cohesion: 0.14
Nodes (11): TestRegistryFailureMessage_transientOutbound(), TestRegistrySearchAll_openJawGF2FailNotMaskedByKiwiSkip(), TestRegistrySearchAllPartialFailure(), TestRegistrySearchAllWithProgress(), isFastProvider(), isSkippedProviderErr(), IsTransientSearchErrMsg(), multisiteSoftTimeout() (+3 more)

### Community 73 - "normalizeKiwiItem"
Cohesion: 0.21
Nodes (17): asArray(), collectCarriers(), detectSelfTransfer(), extractKiwiLegs(), firstFloat(), firstString(), kiwiSegmentFromMap(), mapsToSegments() (+9 more)

### Community 74 - "scrape.js"
Cohesion: 0.18
Nodes (11): runWithOpenPage(), hasCdp(), runOne(), scrapeAll(), SITE_FNS, beginSearch(), endSearch(), isSearchBusy() (+3 more)

### Community 75 - "ProviderResult"
Cohesion: 0.09
Nodes (30): DedupeProviderResults(), ItineraryFingerprint(), mergeSelfTransfer(), TotalStops(), uniqueStrings(), TestCombineOneWayBatches(), TestCombineOneWayBatches_emptyBatch(), TestCombineOneWayBatches_openJawReturnDiversity() (+22 more)

### Community 76 - "main"
Cohesion: 0.33
Nodes (5): startExploreSessionCleanup(), corsMiddleware(), fetchExchangeRates(), main(), startExchangeRateRefresh()

### Community 77 - "ThemeContext.tsx"
Cohesion: 0.18
Nodes (14): ACCENT, darkTheme, FONTS, getWebStorage(), lightTheme, loadSavedThemeMode(), parseThemeMode(), persistThemeMode() (+6 more)

### Community 78 - "FiltersPanel.tsx"
Cohesion: 0.31
Nodes (8): f, FiltersPanel(), Chip(), countByStopsFilter(), matchesStopsFilter(), maxStopsPerLeg(), stopsPerLeg(), totalStops()

### Community 80 - "handleCreateSession"
Cohesion: 0.31
Nodes (5): CreateSearchSessionRequest, ExtraSearchLeg, finalizeSearchSession(), handleCreateSession(), randomID()

### Community 81 - "exchangeRates.ts"
Cohesion: 0.23
Nodes (11): DisplayPrice(), DisplayPriceProps, useExchangeRates(), convertPrice(), CURRENCY_SYMBOLS, CurrencyCode, ensureRates(), fetchRates() (+3 more)

### Community 82 - "session.js"
Cohesion: 0.12
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

### Community 87 - "budget_config.go"
Cohesion: 0.10
Nodes (31): init(), budgetCfg(), BudgetModeEnabled(), durationFromEnvMin(), envTruthy(), ExploreBudgetLimits(), FilterProviderNamesForBudget(), GF2EffectiveCacheTTL() (+23 more)

### Community 88 - "expedia.js"
Cohesion: 0.19
Nodes (6): DEFAULT_SITES, expediaUrl(), scrapeExpedia(), attachJsonCapture(), gotoAndSettle(), mergeConfig()

### Community 89 - "searchRouteUrl.ts"
Cohesion: 0.39
Nodes (7): buildSearchString(), openUrlInNewTab(), openUrlInNewTabOrAlert(), openUrlSameTab(), buildFlyFixSearchResultsUrl(), FlyFixLegSearchParams, openFlyFixLegSearchInNewTab()

### Community 92 - "time.Time"
Cohesion: 0.12
Nodes (22): elapsedMs(), minutesOfDay(), getExploreSession(), putExploreSession(), exploreDestRow, exploreSession, FullRoundTrip, attachReturnLegKeepPrice() (+14 more)

### Community 93 - "bookableDates.ts"
Cohesion: 0.54
Nodes (7): initialDatesFromRouteParams(), addDaysYmdUtc(), clampExploreDealsDates(), clampExploreSearchDates(), firstBookableDepartureInMonth(), pad2(), tomorrowYmdUtc()

### Community 95 - "GF2SearchAirports"
Cohesion: 0.20
Nodes (11): gf2MetroKey(), GF2SearchAirports(), limitGF2SearchAirports(), ResolveGF2PlaceCode(), containsAll(), TestGF2SearchAirports_CityOnlyCode(), TestGF2SearchAirports_LondonParis(), TestGF2SearchAirports_SingleAirport() (+3 more)

### Community 96 - "selectBookingOptionForQuote"
Cohesion: 0.40
Nodes (5): hostFromURL(), selectBookingOptionForQuote(), TestSelectBookingOptionForQuote_fallsBackWhenQuotePriceMismatch(), TestSelectBookingOptionForQuote_prefersDeepLinkHost(), TestSelectBookingOptionForQuote_prefersPriceMatch()

### Community 97 - "ValidateBookingURL"
Cohesion: 0.27
Nodes (11): gf2CheckoutOffers(), IsCheckoutBookingURL(), IsNonBookableDomain(), TestIsCheckoutBookingURL_rejectsFlightSearchPages(), TestIsNonBookableDomain_blocksFlightRadar(), TestValidateBookingURL_acceptsHTTPS(), TestValidateBookingURL_rejectsEmpty(), TestValidateBookingURL_rejectsJavascript() (+3 more)

### Community 99 - "AppIcon.tsx"
Cohesion: 0.09
Nodes (20): AppIconLibrary, AppIconProps, styles, EditSearchModalProps, s, HubRouteLeg, HubRouteSummaryModalProps, s (+12 more)

### Community 101 - "ensure-flight-chrome.sh"
Cohesion: 0.70
Nodes (4): DISPLAY, ensure_gateway_proxy(), log(), ensure-flight-chrome.sh script

### Community 102 - "skyscanner.ts"
Cohesion: 0.36
Nodes (11): FlightLeg, BookingHop, bookingHopsFromOption(), firstSeg(), isClassicRoundTripLegs(), isoDatePrefix(), isSplitBookingItinerary(), lastSeg() (+3 more)

### Community 105 - "testing.T"
Cohesion: 0.07
Nodes (38): TestHandleBookingResolve_invalidItinerary(), TestHandleBookingResolve_searchUnavailable(), TestIsAffiliateTemplateBookingURL(), TestFlightNumbersEquivalent_leadingZeros(), TestProviderResultsToFlightOptions_PreservesCarrierName(), TestAttachReturnLegKeepPrice(), TestEnsureRoundTripLegs_noOpWhenTwoLegs(), TestIsLikelyPartnerCheckoutURL() (+30 more)

## Knowledge Gaps
- **3 isolated node(s):** `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 582 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Fly-Fix` connect `Features` to `ResultsScreen.tsx`?**
  _High betweenness centrality (0.352) - this node is a cross-community bridge._
- **What connects `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `RootNavigator.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.056943056943056944 - nodes in this community are weakly interconnected._
- **Why does `Multi-provider flight search` connect `Features` to `budget_config.go`?**
  _High betweenness centrality (0.349) - this node is a cross-community bridge._
- **Should `AirportLocation` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._
- **Why does `Recent enhancements` connect `ResultsScreen.tsx` to `Features`, `useLocale`?**
  _High betweenness centrality (0.337) - this node is a cross-community bridge._
- **Should `Issue` be split into smaller, more focused modules?**
  _Cohesion score 0.09957325746799431 - nodes in this community are weakly interconnected._