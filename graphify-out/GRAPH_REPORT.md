# Graph Report - workspace  (2026-11-19)

## Corpus Check
- 332 files · ~271,589 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 18 file(s) not represented in the graph (top: (none) 8, .mdc 2, .example 2)

## Summary
- 2736 nodes · 8867 edges · 113 communities (92 shown, 21 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 736 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7225173a`
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
- resolveGF2PartnerOffers
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
- AppIcon
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
- SearchFormScreen.tsx
- test_cases
- LandingScreen.tsx
- gen_explore_airport_coords.py
- flightcaptainweb
- SearchRequest
- Nginx Proxy Manager — fly-fix TLS checklist
- SearchSessionResultsResponse
- googleflights2_provider.go
- .finalize
- ExploreScreen.tsx
- steps
- flyfix-api
- skyscannerParse.js
- ResultsScreen.tsx
- normalizeKiwiItem
- bookingPrefillURL
- npm
- types.ts
- kiwi.js
- destinationMood.test.ts
- nginx-proxy-manager (VPS edge)
- BuildLegAirlineDirectURL
- resolvePartners.js
- .SearchAll
- AuthContext.tsx
- warm.js
- SearchSubmitButton.tsx
- canonical_booking_test.go
- testing.T
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
- GoogleFlights2Provider
- Fly-Fix — Design System & Cursor Redesign Playbook
- attachQuotedPriceMeta
- destinationLabelForCode
- handleCreateSession
- auth_test.go
- ensure-flight-vnc.sh
- ensure-flight-chrome.sh
- ensure-scraper-proxy-forwarder.sh
- docker-entrypoint.sh
- after-reboot-flight.sh
- handleExplore
- Frontend Design
- server_carrier_test.go
- CalendarModal.tsx
- ResolveProvider
- GetClicksSummary

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 112 edges
2. `useLocale()` - 100 edges
3. `react` - 79 edges
4. `react-native` - 73 edges
5. `ProviderResult` - 62 edges
6. `ResultsScreen()` - 60 edges
7. `AppIcon()` - 58 edges
8. `MonthDealsScreen()` - 50 edges
9. `runBookingMatch()` - 48 edges
10. `BookingOffer` - 41 edges

## Surprising Connections (you probably didn't know these)
- `Cheaper departure cities (positioning optimizer)` --references--> `CheaperCitiesSection()`  [INFERRED]
  README.md → frontend/src/features/flight-search/components/CheaperCitiesSection.tsx
- `3. Core product patterns` --references--> `TopNavMenu()`  [INFERRED]
  .cursor/skills/flyfix-redesign-playbook/SKILL.md → frontend/src/navigation/TopNavMenu.tsx
- `Flight scraper (multisite)` --references--> `OtaScraperProvider`  [INFERRED]
  services/flight-scraper/README.md → backend/search/ota_scraper_provider.go
- `Recent enhancements` --references--> `CheaperCitiesSection()`  [INFERRED]
  README.md → frontend/src/features/flight-search/components/CheaperCitiesSection.tsx
- `Responsive` --references--> `useContentGutter()`  [INFERRED]
  .cursor/skills/flyfix-ui-ux/SKILL.md → frontend/src/hooks/useResponsive.ts

## Import Cycles
- None detected.

## Communities (113 total, 21 thin omitted)

### Community 0 - ".ResolveQuotedPartnerBooking"
Cohesion: 0.08
Nodes (38): gf2PartnerOfferFromQuoteURL(), isTransientGF2BookingErr(), optionVendorFromQuote(), resolveAllPartnerBookingsFromTokenWithRetry(), bookingResolveFailureResponse(), findBookingOptionsArray(), firstPartnerBookingOption(), firstPartnerURLInMap() (+30 more)

### Community 1 - "time.Duration"
Cohesion: 0.08
Nodes (27): budgetCfg(), durationFromEnvMin(), envTruthy(), FilterProviderNamesForBudget(), GF2EffectiveCacheTTL(), GF2EffectiveRateLimitPerMin(), GF2MetroConcurrency(), GF2SkipRoundTripEnrich() (+19 more)

### Community 2 - "CanonicalSegment"
Cohesion: 0.12
Nodes (37): extractFlightNumbers(), flightNumberInText(), flightNumbersEquivalent(), splitFlightDesignator(), textContainsAirport(), textContainsAny(), timeMatches(), TestFlightNumbersEquivalent_leadingZeros() (+29 more)

### Community 3 - "Issue"
Cohesion: 0.11
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "runBookingMatch"
Cohesion: 0.07
Nodes (52): TestRunBookingMatch_kiwiMixedCarriersNoAustrianDeeplink(), TestRunBookingMatch_kiwiWizzSellerPrimaryWithAirlineSecondary(), TestRunBookingMatch_prodShapeKiwiIsrairGetsAirlinePrefill(), TestRunBookingMatch_mergesOTAPartners(), acquireBookingResolveSlot(), beginInflightResolve(), bookingResolveCacheKey(), cacheTTLForStatus() (+44 more)

### Community 5 - "session_store.go"
Cohesion: 0.25
Nodes (18): loadSearchSession(), markSessionFailed(), TestLoadSearchSession_Expiry(), searchSessionTTL(), startSearchSessionCleanup(), cleanupPersistedSessions(), loadPersistedSession(), persistSearchSession() (+10 more)

### Community 6 - "frontend/package.json"
Cohesion: 0.06
Nodes (40): config, { getDefaultConfig }, dependencies, expo@~52.0.0, @expo/metro-runtime@~4.0.1, expo-status-bar@~2.0.0, react@18.3.1, react-dom@18.3.1 (+32 more)

### Community 7 - "useTheme"
Cohesion: 0.05
Nodes (88): Search form (boarding-pass ticket), AppIcon(), ClearableTextInput(), ClearableTextInputProps, styles, DestinationMoodBanner(), EditSearchModalProps, s (+80 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (31): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+23 more)

### Community 9 - "FlightOption"
Cohesion: 0.12
Nodes (26): CanonicalFingerprint(), CodeshareFingerprint(), roundTimeToMinutes(), TestCapOptionsKeepingVariety(), TestProviderResultsToFlightOptions_PreservesCarrierName(), FlightOption, applySoftStrictBaggageOptions(), baggageOrderString() (+18 more)

### Community 10 - "flight-scraper/package.json"
Cohesion: 0.11
Nodes (17): express, playwright, dependencies, express@^4.21.2, playwright@^1.49.1, description, engines, node (+9 more)

### Community 11 - "GF2SearchAirports"
Cohesion: 0.13
Nodes (37): airlineDomainForCarrier(), applySearchQuoteToOffer(), bookingMatchPriceNormalizer(), gf2OffersHavePrice(), isAffiliateTemplateBookingURL(), marketingCarrierForLegIndex(), normalizedGF2OfferPrice(), offersIncludeAirlineDirect() (+29 more)

### Community 12 - "BookingOptionsFooter.tsx"
Cohesion: 0.08
Nodes (54): BookingResolveResponse, isSafeBookingUrl(), PublicBookingOffer, DisplayPrice(), DisplayPriceProps, airportTimeZones, getAirportTimeZone(), cabinLabel() (+46 more)

### Community 13 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 14 - "FlightDetailsModal.tsx"
Cohesion: 0.09
Nodes (43): AIRLINE_NAMES, formatAirlineFilterLabel(), getAirlineName(), resolveAirlineLabel(), AIRLINE_FULL_NAMES, f, FiltersPanel(), FiltersPanelProps (+35 more)

### Community 15 - "resolveGF2PartnerOffers"
Cohesion: 0.05
Nodes (55): allocateLegQuoteAmount(), attachQuotedPriceMeta(), dedupeGF2PartnerOffers(), flightLegDurationMinutes(), gf2PartnerOfferFromResolved(), gf2PartnerOfferFromURL(), legBookingToken(), legDeepLink() (+47 more)

### Community 16 - "MonthDealsScreen.tsx"
Cohesion: 0.06
Nodes (49): Responsive, getMonthDeals(), getFlightDetails(), EditSearchModal(), HubRouteSummaryModal(), SearchSummaryBar(), CheaperCitiesOption, CheaperCitiesSection() (+41 more)

### Community 17 - "resolveOTAPartnerOffers"
Cohesion: 0.16
Nodes (19): apiRequest(), adminAuthHeaders(), fetchAdminRuntimeConfig(), fetchRuntimeConfig(), saveAdminRuntimeConfig(), setRuntimeConfigStore(), RuntimeConfigContext, RuntimeConfigContextValue (+11 more)

### Community 18 - "ErrorBoundary"
Cohesion: 0.15
Nodes (4): ErrorBoundary, Props, s, State

### Community 19 - "server.go"
Cohesion: 0.10
Nodes (47): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, bookingResolveMaxConcurrentFromEnv(), envDurationMinutes(), init(), BookingResolveRequest (+39 more)

### Community 22 - "skyscanner.js"
Cohesion: 0.11
Nodes (31): com, fr, req, extractSkyscanner(), req, skyscannerUrl(), url, expediaUrl() (+23 more)

### Community 23 - "TestResult"
Cohesion: 0.19
Nodes (3): ResponseAnalyzer, main(), _print_unreachable_backend_hint()

### Community 25 - "runtime_config.go"
Cohesion: 0.15
Nodes (21): adminAccessConfigured(), isAdminRequest(), configRangeError, adminTokenConfigured(), adminTokenFromHeader(), defaultRuntimeConfig(), errConfigOutOfRange(), getRuntimeConfig() (+13 more)

### Community 26 - "AppIcon"
Cohesion: 0.16
Nodes (16): AppIconLibrary, AppIconProps, styles, getSvgMarkup(), getWebIconSvgDataUri(), hasWebSvgFallback(), LOCAL_ICON_NAMES, useRuntimeConfig() (+8 more)

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.30
Nodes (10): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+2 more)

### Community 29 - "auth.go"
Cohesion: 0.15
Nodes (28): GetSessionAndOption(), ParseOptionIndex(), RecordClick(), handleAuthChangePassword(), handleAuthLogout(), handleAuthMe(), handleGetRuntimeConfig(), handleFlyFixRefineIssues() (+20 more)

### Community 30 - "session.js"
Cohesion: 0.17
Nodes (20): pageLooksBlocked(), withCdpLock(), blockHeavyResources(), getOpenPageHook(), browserPromises, { chromium, firefox }, getBrowser(), isTransientScrapeError() (+12 more)

### Community 31 - "api.ts"
Cohesion: 0.17
Nodes (11): AirportCityResult, AirportCityType, AirportLike, BaggageClass, Carrier, COUNTRY_DEST_PREFIX, ExplorePriceSource, FareBreakdown (+3 more)

### Community 32 - "CanonicalItinerary"
Cohesion: 0.06
Nodes (59): defaultBookingMatchRunner(), corpusText(), domainFromURL(), extractPrice(), cfgTest(), testConnectingTLVJFK(), TestExtractPrice_euroPrefixNotArrivalTime(), TestGenerateQueries_connecting() (+51 more)

### Community 33 - "LocaleContext.tsx"
Cohesion: 0.10
Nodes (25): App(), linking, RTLWrapper(), getStorage(), languageToLocale(), loadSaved(), LocaleProvider(), save() (+17 more)

### Community 34 - "explore_cache.go"
Cohesion: 0.09
Nodes (20): airportCoord, exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut(), getAirportCoord() (+12 more)

### Community 36 - "Backend QA Automation Tool"
Cohesion: 0.18
Nodes (10): Backend QA Automation Tool, Features, If the run feels slow or “stuck”, Notes, Optional AI Setup (Ollama), Output, Project Structure, Run (+2 more)

### Community 37 - "test-roundtrip-legs.js"
Cohesion: 0.13
Nodes (19): a, arr, assert, b, dep, late, assert, frSegs (+11 more)

### Community 38 - "LookupAirlineIATA"
Cohesion: 0.20
Nodes (19): authUserJSON(), bearerTokenFromRequest(), bootstrapAdminUser(), createAuthSession(), envFlagTrue(), handleAuthRegister(), handleAuthUsers(), insertAdminUser() (+11 more)

### Community 39 - "search.ts"
Cohesion: 0.13
Nodes (28): CachedResult, createSearchSession(), createSearchSessionWithRetry(), ensureLegacyPurge(), fetchFresh(), getFromStorage(), getSearchSessionResults(), getStorage() (+20 more)

### Community 40 - "App.tsx"
Cohesion: 0.17
Nodes (19): SearchUrlState, isDeepLinkDebugEnabled(), logDeepLinkDiagnostics(), mergeDeepLinkParams(), fromStash, fromUrl, kept, recovery (+11 more)

### Community 42 - "ExploreScreen.tsx"
Cohesion: 0.29
Nodes (13): byCode, COUNTRY_DIRECTORY, CountryEntry, getCountryDisplayName(), countryMatchesQuery(), countryRank(), countryToPlaceResult(), lower() (+5 more)

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "handleBookingResolve"
Cohesion: 0.16
Nodes (17): AffiliateProvider, AffiliateProviderResponse, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink(), OutboundLinkResponse (+9 more)

### Community 45 - "SearchFormScreen.tsx"
Cohesion: 0.39
Nodes (7): buildSearchString(), openUrlInNewTab(), openUrlInNewTabOrAlert(), openUrlSameTab(), buildFlyFixSearchResultsUrl(), FlyFixLegSearchParams, openFlyFixLegSearchInNewTab()

### Community 46 - "test_cases"
Cohesion: 0.05
Nodes (40): departureDate, origin, byProvider, currency, error, from, items, route (+32 more)

### Community 47 - "LandingScreen.tsx"
Cohesion: 0.06
Nodes (51): styles, Nav, SiteFooter(), styles, moodImageUrlForVariant(), AdminUsersScreen(), styles, LandingMoodImage() (+43 more)

### Community 53 - "SearchRequest"
Cohesion: 0.13
Nodes (21): TestCompleteExtraLegs(), TestExtraLegsFingerprint(), truncateStr(), TestSanitizeStandardSearchRequest(), TestDynamicDestinationOneWayRequests_extraLegs(), TestDynamicDestinationOneWayRequests_openJaw(), dynamicDestinationOneWayRequests(), flattenOtaScraperResponse() (+13 more)

### Community 54 - "Nginx Proxy Manager — fly-fix TLS checklist"
Cohesion: 0.40
Nodes (4): Nginx Proxy Manager — fly-fix TLS checklist, Reissue frontend cert (both names), Required proxy-host settings, Symptoms Chrome shows

### Community 55 - "SearchSessionResultsResponse"
Cohesion: 0.25
Nodes (11): ProviderSearchStats, SearchProgress, SearchSession, SearchSessionResultsResponse, SearchSessionStatus, finalizeSearchSession(), pageSearchSessionForClient(), publishSearchProgress() (+3 more)

### Community 56 - "googleflights2_provider.go"
Cohesion: 0.06
Nodes (58): TestLookupAirlineIATA_Israir(), AirportLocation(), TestAirportLocation_UnknownFallsBackUTC(), TestParseGF2TimeWithDateHint_AirportLocal(), TestParseGF2TimeWithDateHint_TelAviv(), airlineAliasKey(), LooksLikeAirportLabel(), LookupAirlineIATA() (+50 more)

### Community 58 - "ExploreScreen.tsx"
Cohesion: 0.15
Nodes (14): AIRPORT_DICTIONARY, getAirportEntry(), ASSIGNED_URLS, BY_CODE, BY_COUNTRY, DestinationMood, hashCode(), LANDING_MOOD_DESTINATIONS (+6 more)

### Community 59 - "steps"
Cohesion: 0.09
Nodes (22): runs-on, steps, jobs, deploy, name, on, push, workflow_dispatch (+14 more)

### Community 60 - "flyfix-api"
Cohesion: 0.06
Nodes (37): context, FLIGHT_SCRAPER_MAX_CONCURRENT, FLIGHT_SCRAPER_URL, PLAYWRIGHT_HEADLESS, PORT, SCRAPER_CDP_URLS, SCRAPER_PROXY_URL, SCRAPER_WARM_ON_START (+29 more)

### Community 61 - "skyscannerParse.js"
Cohesion: 0.12
Nodes (28): assert, english, firstPage, named, offers, radarOffers, req, absolutizeSkyscanner() (+20 more)

### Community 62 - "ResultsScreen.tsx"
Cohesion: 0.06
Nodes (81): getExploreDestinations(), collectTripDestinationCodes(), DestinationMoodStrip(), SearchLoadingOverlay(), DynamicDestinationsFormContent(), DynamicDestinationsFormContentProps, styles, defaultParams (+73 more)

### Community 63 - "normalizeKiwiItem"
Cohesion: 0.18
Nodes (19): TotalStops(), TestParseOTASegmentTime_AirportWallClock(), asArray(), collectCarriers(), detectSelfTransfer(), extractKiwiLegs(), firstFloat(), firstString() (+11 more)

### Community 64 - "bookingPrefillURL"
Cohesion: 0.12
Nodes (31): openJawOption(), TestBookingLinkModeDefaultsToSkyscanner(), TestBookingRouteFromSessionOption_splitOmitsReturn(), TestBuildGoogleFlightsFallbackFromParams(), TestBuildLegOrSegmentBookingURL_segment(), TestBuildOneWayLegBookingURL(), TestBuildSkyscannerPrefillURL_oneWay(), TestBuildSkyscannerPrefillURL_roundTrip() (+23 more)

### Community 65 - "npm"
Cohesion: 0.17
Nodes (11): networks, proxy, container_name, image, networks, ports, restart, volumes (+3 more)

### Community 66 - "types.ts"
Cohesion: 0.25
Nodes (15): DealsState, MonthDealsResponse, CachedDealsResults, clearPendingDealsParams(), DealsParams, dealsParamsFingerprint(), getCachedDealsResults(), getLocalStorage() (+7 more)

### Community 67 - "kiwi.js"
Cohesion: 0.16
Nodes (22): assert, waitUntil(), parseRoundTripHm(), clearKiwiSpaState(), ensureKiwiResultsUrl(), extractFromCaptured(), extractNextData(), flattenOffers() (+14 more)

### Community 68 - "destinationMood.test.ts"
Cohesion: 0.11
Nodes (13): __dirname, dist, indexHtml, indexPath, SPA_ROUTES, byCity, compact, curatedCities (+5 more)

### Community 69 - "nginx-proxy-manager (VPS edge)"
Cohesion: 0.40
Nodes (4): Deploy sync, First-time / recovery, nginx-proxy-manager (VPS edge), On the server

### Community 70 - "BuildLegAirlineDirectURL"
Cohesion: 0.19
Nodes (10): BuildLegAirlineDirectURL(), BuildRedirectURL(), getAffiliateID(), TestBuildLegAirlineDirectURL_austrianHasNoUnverifiedLink(), stripEmptyQueryParams(), TestBuildLegAirlineDirectURL_wizzPathNotHash(), TestBuildLegAirlineDirectURL_wizzRoundTripReturnDate(), prodShapeKiwiIsrairOption() (+2 more)

### Community 71 - "resolvePartners.js"
Cohesion: 0.23
Nodes (17): addPartner(), clickMatchingKiwiCard(), clickMatchingSkyscannerCard(), clocksFromSegments(), collectPartnerMap(), extractPartnersFromDom(), hmFromIso(), isMetaHost() (+9 more)

### Community 72 - ".SearchAll"
Cohesion: 0.11
Nodes (15): TestSanitizeProviderErrorForUser(), TestRegistryFailureMessage_transientOutbound(), TestRegistrySearchAll_dedupeComparesInRequestedCurrency(), TestRegistrySearchAll_fastOnlySkipsScraper(), TestRegistrySearchAll_openJawGF2FailNotMaskedByKiwiSkip(), TestRegistrySearchAllPartialFailure(), TestRegistrySearchAllWithProgress(), convertResultsToCurrency() (+7 more)

### Community 73 - "AuthContext.tsx"
Cohesion: 0.17
Nodes (24): authHeaders(), AuthUser, changePassword(), createUser(), deleteUser(), fetchAuthMe(), fetchUsers(), LoginResponse (+16 more)

### Community 74 - "warm.js"
Cohesion: 0.09
Nodes (23): cdpLockBusy(), chain, DEFAULT_SITES, beginSearch(), endSearch(), isSearchBusy(), app, express (+15 more)

### Community 75 - "SearchSubmitButton.tsx"
Cohesion: 0.06
Nodes (48): moodSizeForVariant(), stripStyles, styles, Variant, getAlmostDonePhrase(), getPhrasesForLanguage(), pickSearchStatusPhrase(), providerPhraseMap() (+40 more)

### Community 76 - "canonical_booking_test.go"
Cohesion: 0.14
Nodes (15): gf2CheckoutOffers(), classifyURLType(), TestClassifyURLType_genericVsExact(), urlTypeRank(), IsCheckoutBookingURL(), IsNonBookableDomain(), TestIsCheckoutBookingURL_rejectsFlightSearchPages(), TestIsNonBookableDomain_blocksFlightRadar() (+7 more)

### Community 77 - "testing.T"
Cohesion: 0.05
Nodes (70): TestParseOtaOffers_normalizesIsrairDisplayName(), TestIsAffiliateTemplateBookingURL(), floatPtr(), TestSelectBestOffer_cheapestOTAOverAirline(), TestSelectBestOffer_conflictingCandidatesPicksCheapest(), TestSelectBestOffer_missingPrice(), TestSelectBestOffer_multipleMatching(), TestSelectBestOffer_prefersPriceAmongSameURLType() (+62 more)

### Community 78 - "ProviderResult"
Cohesion: 0.07
Nodes (36): DedupeProviderResults(), mergeSelfTransfer(), uniqueStrings(), TestCombineOneWayBatches(), TestCombineOneWayBatches_emptyBatch(), TestCombineOneWayBatches_keepsNonstopsBothWays(), TestCombineOneWayBatches_openJawReturnDiversity(), cheapestReturnLeg() (+28 more)

### Community 79 - "skyscanner.ts"
Cohesion: 0.39
Nodes (11): BookingHop, bookingHopsFromOption(), firstSeg(), isClassicRoundTripLegs(), isoDatePrefix(), isSplitBookingItinerary(), lastSeg(), legCarrierCode() (+3 more)

### Community 80 - "test-kiwi-parse.js"
Cohesion: 0.16
Nodes (15): assert, offers, pending, req, offerTemplate(), segment(), bookingUrlFor(), extractKiwiUmbrella() (+7 more)

### Community 81 - "client.ts"
Cohesion: 0.10
Nodes (20): searchAirports(), API_BASE, apiGet(), apiPost(), apiUrl(), isLocalHostname(), resolveApiBase(), ExploreResponse (+12 more)

### Community 82 - "SortBar.tsx"
Cohesion: 0.15
Nodes (14): LayoverSummary, OutboundSummary, applyPriceNormalization(), computeOutboundSummary(), computeTotalDurationFromLegs(), TestApplyPriceNormalizationDefaultNoChange(), TestComputeOutboundSummary_Direct(), TestComputeOutboundSummary_OneStop() (+6 more)

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
Cohesion: 0.36
Nodes (13): getAirportDisplayName(), getCountryEntry(), AirportAutocomplete(), AirportAutocompleteProps, CountrySelectMode, styles, isCountryDestination(), makeCountryDestination() (+5 more)

### Community 88 - "Flight scraper (multisite)"
Cohesion: 0.29
Nodes (6): Docker, Flight scraper (multisite), Residential EU proxy, Run locally, VPS (recommended): headed Chrome on `:99`, When Skyscanner returns 0 offers

### Community 89 - "resolveBookingRedirectURL"
Cohesion: 0.24
Nodes (9): getDealsRange(), GetDealsRangeParams, GetMonthDealsParams, DatePickerCalendar(), DatePickerCalendarProps, getNext14Dates(), getRangeStartEnd(), styles (+1 more)

### Community 92 - "time.Time"
Cohesion: 0.20
Nodes (14): minutesOfDay(), ClickRecord, FullRoundTrip, attachReturnLegKeepPrice(), ensureRoundTripLegs(), gf2OneRoundTrip(), gf2SearchDealsOnDates(), gf2SearchDealsRange() (+6 more)

### Community 93 - "scrape.js"
Cohesion: 0.22
Nodes (13): assert, kiwi, pxSky, sky, hasCdp(), runWithSiteBudget(), scrapeAll(), scrapeSerial() (+5 more)

### Community 94 - "GoogleFlights2Provider"
Cohesion: 0.17
Nodes (11): exploreRunLiveBatch(), gf2ExploreSearchOneDestination(), isGF2RateLimitErr(), classicRoundTripMissingReturn(), TestDoSearchWithRetry_doesNotCacheRoundTrip(), TestSearch_ignoresIncompleteClassicRTCache(), TestSearch_servesCompleteClassicRTCache(), GoogleFlights2Provider (+3 more)

### Community 95 - "Fly-Fix — Design System & Cursor Redesign Playbook"
Cohesion: 0.22
Nodes (8): 1. Product and brand direction, 2. Design tokens (proposed starting values), 3. Core product patterns, 4. Motion, 5. Cursor workflow phases, 6. Non-negotiable constraints, 7. Working method, Fly-Fix — Design System & Cursor Redesign Playbook

### Community 96 - "attachQuotedPriceMeta"
Cohesion: 0.27
Nodes (9): AIRPORT_ONLY_DICTIONARY, FULL_PLACE_DICTIONARY, getAirportNameByCode(), getCityDisplayName(), lower(), matchesQuery(), PLACE_SEARCH_LIMIT, rankResult() (+1 more)

### Community 97 - "destinationLabelForCode"
Cohesion: 0.27
Nodes (8): CURRENCIES, LanguageCode, LANGUAGES, TRANSLATIONS, destinationLabelForCode(), buildResultsSearchSummary(), formatTripDate(), ResultsSearchSummary

### Community 98 - "handleCreateSession"
Cohesion: 0.39
Nodes (3): CreateSearchSessionRequest, ExtraSearchLeg, handleCreateSession()

### Community 99 - "auth_test.go"
Cohesion: 0.22
Nodes (15): handleAuthLogin(), initAuthStore(), initTestAuthDB(), randomTestPassword(), TestAuthLoginAndChangePassword(), TestAuthRegister(), TestAuthUserManagement(), TestBootstrapAdminPasswordSync() (+7 more)

### Community 101 - "ensure-flight-chrome.sh"
Cohesion: 0.52
Nodes (6): chrome_proxy_args(), DISPLAY, ensure_gateway_proxy(), load_scraper_proxy_env(), log(), ensure-flight-chrome.sh script

### Community 105 - "handleExplore"
Cohesion: 0.43
Nodes (6): exploreSessionKey(), getExploreSession(), newExploreSessionID(), putExploreSession(), exploreSession, handleExplore()

### Community 106 - "Frontend Design"
Cohesion: 0.25
Nodes (7): Design principles, Fly-Fix (this repo), Frontend Design, Ground your designs in the subject matter, More on writing in design, Process: plan, review against the brief, build, critique, Restraint and self-critique

### Community 107 - "server_carrier_test.go"
Cohesion: 0.43
Nodes (6): CarrierCodes, makeOfferWithCarriers(), TestExtractCarrierCodes(), TestPrimaryDisplayCarrier(), ExtractCarrierCodes(), PrimaryDisplayCarrier()

### Community 108 - "CalendarModal.tsx"
Cohesion: 0.38
Nodes (6): buildMonthDays(), CalendarModal(), getMonthStart(), Props, styles, WEEKDAYS

### Community 109 - "ResolveProvider"
Cohesion: 0.50
Nodes (5): getOTAProvider(), ResolveProvider(), OutboundLinkResponse, Provider, ProviderResponse

## Knowledge Gaps
- **3 isolated node(s):** `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 650 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Fly-Fix` connect `Features` to `time.Duration`, `useTheme`?**
  _High betweenness centrality (0.309) - this node is a cross-community bridge._
- **What connects `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `.ResolveQuotedPartnerBooking` be split into smaller, more focused modules?**
  _Cohesion score 0.07738095238095238 - nodes in this community are weakly interconnected._
- **Why does `Multi-provider flight search` connect `time.Duration` to `Features`?**
  _High betweenness centrality (0.304) - this node is a cross-community bridge._
- **Should `time.Duration` be split into smaller, more focused modules?**
  _Cohesion score 0.08143939393939394 - nodes in this community are weakly interconnected._
- **Why does `Recent enhancements` connect `useTheme` to `Features`, `MonthDealsScreen.tsx`?**
  _High betweenness centrality (0.295) - this node is a cross-community bridge._
- **Should `CanonicalSegment` be split into smaller, more focused modules?**
  _Cohesion score 0.11711711711711711 - nodes in this community are weakly interconnected._