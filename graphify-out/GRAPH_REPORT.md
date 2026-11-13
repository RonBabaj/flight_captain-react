# Graph Report - workspace  (2026-11-13)

## Corpus Check
- 303 files · ~255,008 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 16 file(s) not represented in the graph (top: (none) 8, .example 2, .conf 2)

## Summary
- 2534 nodes · 8203 edges · 105 communities (86 shown, 19 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 688 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `42017a6e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- .ResolveQuotedPartnerBooking
- LandingScreen.tsx
- SearchSubmitButton.tsx
- Issue
- testing.T
- session_store.go
- frontend/package.json
- useTheme
- Features
- FlightOption
- flight-scraper/package.json
- resolveGF2PartnerOffers
- BookingOptionsFooter.tsx
- compilerOptions
- FiltersPanel.tsx
- canonical_booking_test.go
- MonthDealsScreen.tsx
- googleflights2_provider.go
- main
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
- auth.go
- searcher.go
- auth.go
- runBookingMatch
- types.ts
- explore_cache.go
- ValidationIssue
- Backend QA Automation Tool
- test-roundtrip-legs.js
- BookingOffer
- search.ts
- ExploreScreen.tsx
- models.py
- AirportAutocomplete.tsx
- Fly-Fix – Frontend
- DestinationMoodBanner.tsx
- AirportLocation
- test_cases
- time.Duration
- gen_explore_airport_coords.py
- flightcaptainweb
- SearchRequest
- Nginx Proxy Manager — fly-fix TLS checklist
- BuildLegAirlineDirectURL
- FlightDetailsModal.tsx
- .finalize
- FlightResultCard.tsx
- steps
- flyfix-api
- store/index.ts
- ResultsScreen.tsx
- affiliate.ts
- api.ts
- npm
- skyscanner.js
- kiwi.js
- skyscanner.js
- nginx-proxy-manager (VPS edge)
- AppIcon
- AuthContext.tsx
- .SearchAll
- time.Duration
- warm.js
- normalizeKiwiItem
- ThemeContext.tsx
- handleCreateSession
- dealsCache.ts
- ErrorBoundary
- server_carrier_test.go
- App.tsx
- session.js
- Fly-Fix UI / UX
- TestApplySoftStrictBaggage
- backend_api_contracts.md
- ensure-edge-proxy.sh
- SearchFormScreen.tsx
- expedia.js
- otaListingPrefillURL
- install-edge-proxy-cron.sh
- sync-edge-stack.sh
- time.Time
- Flight scraper (multisite)
- AppIcon.tsx
- displayAirlines.ts
- FlightDetailsModal.tsx
- ValidateBookingURL
- scripts
- DraggableBottomSheet.tsx
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
- `Recent enhancements` --references--> `AppIcon()`  [INFERRED]
  README.md → frontend/src/components/AppIcon.tsx

## Import Cycles
- None detected.

## Communities (105 total, 19 thin omitted)

### Community 0 - ".ResolveQuotedPartnerBooking"
Cohesion: 0.13
Nodes (22): findBookingOptionsArray(), firstPartnerBookingOption(), firstPartnerURLInMap(), firstStringByKeys(), ResolvedPartnerBooking, isPartnerBookingList(), parseGF2BookingOptions(), partnerRequestTokenFromMap() (+14 more)

### Community 1 - "LandingScreen.tsx"
Cohesion: 0.09
Nodes (33): Nav, SiteFooter(), styles, moodImageUrlForVariant(), LandingMoodImage(), LandingScreen(), Nav, styles (+25 more)

### Community 2 - "SearchSubmitButton.tsx"
Cohesion: 0.14
Nodes (20): getAlmostDonePhrase(), getPhrasesForLanguage(), SEARCH_ALMOST_DONE, SEARCH_BUTTON_ALMOST_DONE, SEARCH_BUTTON_PHRASES, SEARCH_PROGRESS_PHRASES, s, SearchProgressBanner() (+12 more)

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "testing.T"
Cohesion: 0.06
Nodes (46): TestAllocateLegQuoteAmount_splitOpenJaw(), TestAttachQuotedPriceMeta_detectsMismatch(), TestLegDeepLink_rejectsMisalignedPartnerArrays(), TestLegDeepLink_rejectsWrongAirlineDirectCheckout(), TestQuoteBindingFromOption_usesOriginalWhenEstimate(), TestQuoteBindingFromOption_usesStoredLegPrice(), TestResolveGF2PartnerOffer_skipsSkyscannerDeepLink(), TestResolveGF2PartnerOffer_usesPersistedLegDeepLinkWithoutProvider() (+38 more)

### Community 5 - "session_store.go"
Cohesion: 0.18
Nodes (22): loadSearchSession(), markSessionFailed(), publishSessionSnapshot(), TestLoadSearchSession_Expiry(), searchSessionTTL(), startSearchSessionCleanup(), cleanupPersistedSessions(), importLegacyJSONSessions() (+14 more)

### Community 6 - "frontend/package.json"
Cohesion: 0.07
Nodes (33): config, { getDefaultConfig }, dependencies, expo@~52.0.0, @expo/metro-runtime@~4.0.1, expo-status-bar@~2.0.0, react@18.3.1, react-dom@18.3.1 (+25 more)

### Community 7 - "useTheme"
Cohesion: 0.12
Nodes (44): ClearableTextInput(), ClearableTextInputProps, styles, useAuth(), useLocale(), AccountScreen(), styles, ConfigFieldRow() (+36 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (31): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+23 more)

### Community 9 - "FlightOption"
Cohesion: 0.06
Nodes (61): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, CanonicalFingerprint(), Carrier, TestProviderResultsToFlightOptions_PreservesCarrierName(), DayDeal (+53 more)

### Community 10 - "flight-scraper/package.json"
Cohesion: 0.11
Nodes (17): express, playwright, dependencies, express@^4.21.2, playwright@^1.49.1, description, engines, node (+9 more)

### Community 11 - "resolveGF2PartnerOffers"
Cohesion: 0.11
Nodes (40): airlineDomainForCarrier(), allocateLegQuoteAmount(), applySearchQuoteToOffer(), attachQuotedPriceMeta(), bookingMatchPriceNormalizer(), dedupeGF2PartnerOffers(), flightLegDurationMinutes(), gf2OffersHavePrice() (+32 more)

### Community 12 - "BookingOptionsFooter.tsx"
Cohesion: 0.14
Nodes (31): BookingResolveResponse, isSafeBookingUrl(), PublicBookingOffer, bookingOfferProviderLabel(), bookingOfferSubtitle(), formatBookingOfferPriceAmount(), formatBookingOfferPriceLine(), formatProviderDisplayName() (+23 more)

### Community 13 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 14 - "FiltersPanel.tsx"
Cohesion: 0.18
Nodes (16): formatAirlineFilterLabel(), f, FiltersPanel(), FiltersPanelProps, FlightDetailsModalProps, FlightResultCardProps, PositioningLegResult, SearchFilters (+8 more)

### Community 15 - "canonical_booking_test.go"
Cohesion: 0.12
Nodes (31): openJawOption(), TestBookingLinkModeDefaultsToSkyscanner(), TestBookingRouteFromSessionOption_splitOmitsReturn(), TestBuildGoogleFlightsFallbackFromParams(), TestBuildLegOrSegmentBookingURL_segment(), TestBuildOneWayLegBookingURL(), TestBuildSkyscannerPrefillURL_oneWay(), TestBuildSkyscannerPrefillURL_roundTrip() (+23 more)

### Community 16 - "MonthDealsScreen.tsx"
Cohesion: 0.06
Nodes (47): getFlightDetails(), DisplayPrice(), DisplayPriceProps, EditSearchModal(), HubRouteLeg, HubRouteSummaryModal(), HubRouteSummaryModalProps, s (+39 more)

### Community 17 - "googleflights2_provider.go"
Cohesion: 0.09
Nodes (48): bookingResolveFailureResponse(), TestParseGF2TimeWithDateHint_AirportLocal(), TestParseGF2TimeWithDateHint_TelAviv(), TestExtractGF2BookingToken(), TestExtractGF2BookingURL(), TestExtractGF2PartnerBookingTokenPrefersPartnerURL(), TestBuildGF2ResultFromItinerary_FlatFormat(), TestParseGF2Response_AttachesFlatReturnFlights() (+40 more)

### Community 18 - "main"
Cohesion: 0.33
Nodes (5): startExploreSessionCleanup(), corsMiddleware(), fetchExchangeRates(), main(), startExchangeRateRefresh()

### Community 19 - "booking_resolve.go"
Cohesion: 0.07
Nodes (89): TestLookupAirlineIATA_Israir(), bookingResolveMaxConcurrentFromEnv(), envDurationMinutes(), init(), extractFlightNumbers(), flightNumberInText(), flightNumbersEquivalent(), splitFlightDesignator() (+81 more)

### Community 22 - "matcher_test.go"
Cohesion: 0.10
Nodes (44): classifyURLType(), extractPrice(), cfgTest(), floatPtr(), TestClassifyURLType_genericVsExact(), testConnectingTLVJFK(), TestExtractPrice_euroPrefixNotArrivalTime(), TestFlightNumbersEquivalent_leadingZeros() (+36 more)

### Community 23 - "TestResult"
Cohesion: 0.19
Nodes (3): ResponseAnalyzer, main(), _print_unreachable_backend_hint()

### Community 25 - "runtime_config.go"
Cohesion: 0.19
Nodes (18): adminAccessConfigured(), isAdminRequest(), configRangeError, adminTokenConfigured(), adminTokenFromHeader(), defaultRuntimeConfig(), errConfigOutOfRange(), getRuntimeConfig() (+10 more)

### Community 26 - "ProviderResult"
Cohesion: 0.08
Nodes (29): DedupeProviderResults(), ItineraryFingerprint(), mergeSelfTransfer(), uniqueStrings(), TestCombineOneWayBatches(), TestCombineOneWayBatches_emptyBatch(), TestCombineOneWayBatches_openJawReturnDiversity(), cheapestReturnLeg() (+21 more)

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.30
Nodes (10): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+2 more)

### Community 29 - "auth.go"
Cohesion: 0.15
Nodes (30): authUserJSON(), bearerTokenFromRequest(), bootstrapAdminUser(), createAuthSession(), envFlagTrue(), handleAuthChangePassword(), handleAuthLogin(), handleAuthMe() (+22 more)

### Community 30 - "searcher.go"
Cohesion: 0.11
Nodes (25): defaultBookingMatchRunner(), webVerifiedBookingOffers(), corpusText(), domainFromURL(), MatchResult, countVerifiedPricedOffers(), MatchItinerary(), NewResolver() (+17 more)

### Community 31 - "auth.go"
Cohesion: 0.14
Nodes (28): GetClicksSummary(), getOTAProvider(), GetSessionAndOption(), ParseOptionIndex(), RecordClick(), ResolveProvider(), handleAuthLogout(), ClicksSummaryResponse (+20 more)

### Community 32 - "runBookingMatch"
Cohesion: 0.07
Nodes (49): TestRunBookingMatch_kiwiWizzPrefersListingOverAirlineCalendar(), TestRunBookingMatch_prodShapeKiwiIsrairGetsAirlinePrefill(), TestRunBookingMatch_mergesOTAPartners(), acquireBookingResolveSlot(), beginInflightResolve(), bookingResolveCacheKey(), cacheTTLForStatus(), canonicalItineraryForOption() (+41 more)

### Community 33 - "types.ts"
Cohesion: 0.14
Nodes (16): Props, s, State, DynamicDestinationsStack(), Stack, MonthDealsStack(), Stack, SearchStack() (+8 more)

### Community 34 - "explore_cache.go"
Cohesion: 0.09
Nodes (26): airportCoord, exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut(), getAirportCoord() (+18 more)

### Community 36 - "Backend QA Automation Tool"
Cohesion: 0.18
Nodes (10): Backend QA Automation Tool, Features, If the run feels slow or “stuck”, Notes, Optional AI Setup (Ollama), Output, Project Structure, Run (+2 more)

### Community 37 - "test-roundtrip-legs.js"
Cohesion: 0.12
Nodes (20): a, arr, assert, b, dep, late, assert, frSegs (+12 more)

### Community 38 - "BookingOffer"
Cohesion: 0.15
Nodes (31): TestBuildLegAirlineDirectURL_wizzPathNotHash(), isAffiliateTemplateBookingURL(), normalizedGF2OfferPrice(), preferAirlineDirectWhenCheaperThanMarkedUpOTA(), publicAlternativesFromOffers(), bookingOfferInGF2Sources(), bookingOfferSameURL(), buildDualBookingResolveResponse() (+23 more)

### Community 39 - "search.ts"
Cohesion: 0.14
Nodes (27): CachedResult, createSearchSession(), createSearchSessionWithRetry(), ensureLegacyPurge(), fetchFresh(), getFromStorage(), getSearchSessionResults(), getStorage() (+19 more)

### Community 40 - "ExploreScreen.tsx"
Cohesion: 0.16
Nodes (24): getExploreDestinations(), getAirportEntry(), c, countryFlag(), d, DestCard(), ExploreScreen(), ExploreScreenProps (+16 more)

### Community 42 - "AirportAutocomplete.tsx"
Cohesion: 0.14
Nodes (38): AIRPORT_ONLY_DICTIONARY, FULL_PLACE_DICTIONARY, getAirportDisplayName(), getAirportNameByCode(), getCityDisplayName(), lower(), matchesQuery(), PLACE_SEARCH_LIMIT (+30 more)

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "DestinationMoodBanner.tsx"
Cohesion: 0.06
Nodes (26): __dirname, dist, indexHtml, indexPath, SPA_ROUTES, AIRPORT_DICTIONARY, AIRPORT_FALLBACK_IMAGE, ASSIGNED_URLS (+18 more)

### Community 45 - "AirportLocation"
Cohesion: 0.16
Nodes (14): AirportLocation(), TestAirportLocation_UnknownFallsBackUTC(), TestParseGF2Time_EuropeanDateFormat(), TestParseGF2Time_AcceptsFullDateTime(), TestParseGF2Time_NumericOffsetIsAbsolute(), TestParseGF2Time_RejectsTimeOnly(), TestParseGF2Time_ZIsAirportWallClock(), gf2HasNumericUTCOffset() (+6 more)

### Community 46 - "test_cases"
Cohesion: 0.05
Nodes (40): departureDate, origin, byProvider, currency, error, from, items, route (+32 more)

### Community 47 - "time.Duration"
Cohesion: 0.19
Nodes (16): getStorage(), languageToLocale(), loadSaved(), LocaleContext, LocaleContextValue, LocaleProvider(), save(), VALID_CURRENCIES (+8 more)

### Community 53 - "SearchRequest"
Cohesion: 0.09
Nodes (33): TestCompleteExtraLegs(), TestExtraLegsFingerprint(), classicRoundTripMissingReturn(), TestClassicRoundTripMissingReturn(), TestDoSearchWithRetry_doesNotCacheRoundTrip(), TestSearch_ignoresIncompleteClassicRTCache(), TestSearch_servesCompleteClassicRTCache(), GoogleFlights2Provider (+25 more)

### Community 54 - "Nginx Proxy Manager — fly-fix TLS checklist"
Cohesion: 0.40
Nodes (4): Nginx Proxy Manager — fly-fix TLS checklist, Reissue frontend cert (both names), Required proxy-host settings, Symptoms Chrome shows

### Community 55 - "BuildLegAirlineDirectURL"
Cohesion: 0.24
Nodes (8): BuildLegAirlineDirectURL(), BuildRedirectURL(), getAffiliateID(), stripEmptyQueryParams(), TestBuildLegAirlineDirectURL_wizzRoundTripReturnDate(), prodShapeKiwiIsrairOption(), TestHandleBookingResolve_prodShapeKiwiIsrairHTTP(), TestProdShape_airlinePrefillPieces()

### Community 56 - "FlightDetailsModal.tsx"
Cohesion: 0.24
Nodes (12): airportTimeZones, getAirportTimeZone(), fmtDur(), layoverBetween(), legDuration(), renderLeg(), flightMinutesBetween(), flightTimeToMs() (+4 more)

### Community 58 - "FlightResultCard.tsx"
Cohesion: 0.24
Nodes (15): buildRoutePath(), c, FlightResultCard(), LegScheduleBlock(), FlightSegment, LayoverSummary, buildLegPreviewSummary(), computeLayovers() (+7 more)

### Community 59 - "steps"
Cohesion: 0.09
Nodes (22): runs-on, steps, jobs, deploy, name, on, push, workflow_dispatch (+14 more)

### Community 60 - "flyfix-api"
Cohesion: 0.06
Nodes (37): context, FLIGHT_SCRAPER_MAX_CONCURRENT, FLIGHT_SCRAPER_URL, PLAYWRIGHT_HEADLESS, PORT, SCRAPER_CDP_URLS, SCRAPER_PROXY_URL, SCRAPER_WARM_ON_START (+29 more)

### Community 61 - "store/index.ts"
Cohesion: 0.16
Nodes (18): zustand@^5.0.0, SortBarProps, clampDealsMonth(), dealsActions, DealsSortField, getMinimumAllowedDealsYearMonth(), now, useDealsStore (+10 more)

### Community 62 - "ResultsScreen.tsx"
Cohesion: 0.13
Nodes (27): defaultParams, DynamicDestinationsScreen(), Nav, styles, Bone(), ResultsSkeletonCard(), ResultsSkeletonList(), sk (+19 more)

### Community 63 - "affiliate.ts"
Cohesion: 0.16
Nodes (17): AffiliateProvider, AffiliateProviderResponse, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink(), OutboundLinkResponse (+9 more)

### Community 64 - "api.ts"
Cohesion: 0.05
Nodes (45): searchAirports(), API_BASE, apiGet(), apiPost(), apiRequest(), apiUrl(), isLocalHostname(), resolveApiBase() (+37 more)

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

### Community 70 - "AppIcon"
Cohesion: 0.13
Nodes (32): AppIcon(), collectTripDestinationCodes(), DestinationMoodBanner(), DestinationMoodStrip(), moodSizeForVariant(), stripStyles, styles, Variant (+24 more)

### Community 71 - "AuthContext.tsx"
Cohesion: 0.08
Nodes (44): authHeaders(), AuthUser, changePassword(), createUser(), deleteUser(), fetchAuthMe(), fetchUsers(), LoginResponse (+36 more)

### Community 72 - ".SearchAll"
Cohesion: 0.15
Nodes (9): TestRegistryFailureMessage_transientOutbound(), TestRegistrySearchAll_openJawGF2FailNotMaskedByKiwiSkip(), TestRegistrySearchAllPartialFailure(), isFastProvider(), isSkippedProviderErr(), IsTransientSearchErrMsg(), MultiSearchResult, Registry (+1 more)

### Community 73 - "time.Duration"
Cohesion: 0.08
Nodes (26): budgetCfg(), durationFromEnvMin(), envTruthy(), FilterProviderNamesForBudget(), GF2EffectiveCacheTTL(), GF2EffectiveRateLimitPerMin(), GF2MetroConcurrency(), GF2SkipRoundTripEnrich() (+18 more)

### Community 74 - "warm.js"
Cohesion: 0.08
Nodes (28): cdpLockBusy(), chain, runWithOpenPage(), DEFAULT_SITES, hasCdp(), runOne(), scrapeAll(), SITE_FNS (+20 more)

### Community 75 - "normalizeKiwiItem"
Cohesion: 0.21
Nodes (17): TotalStops(), TestParseOTASegmentTime_AirportWallClock(), asArray(), collectCarriers(), extractKiwiLegs(), firstFloat(), firstString(), kiwiSegmentFromMap() (+9 more)

### Community 76 - "ThemeContext.tsx"
Cohesion: 0.15
Nodes (18): App(), linking, RTLWrapper(), RootNavigator(), ACCENT, darkTheme, FONTS, getWebStorage() (+10 more)

### Community 77 - "handleCreateSession"
Cohesion: 0.18
Nodes (11): CreateSearchSessionRequest, ExtraSearchLeg, ProviderSearchStats, SearchProgress, SearchSession, SearchSessionResultsResponse, SearchSessionStatus, finalizeSearchSession() (+3 more)

### Community 78 - "dealsCache.ts"
Cohesion: 0.25
Nodes (15): DealsState, MonthDealsResponse, CachedDealsResults, clearPendingDealsParams(), DealsParams, dealsParamsFingerprint(), getCachedDealsResults(), getLocalStorage() (+7 more)

### Community 80 - "server_carrier_test.go"
Cohesion: 0.43
Nodes (6): CarrierCodes, makeOfferWithCarriers(), TestExtractCarrierCodes(), TestPrimaryDisplayCarrier(), ExtractCarrierCodes(), PrimaryDisplayCarrier()

### Community 81 - "App.tsx"
Cohesion: 0.18
Nodes (18): isDeepLinkDebugEnabled(), logDeepLinkDiagnostics(), mergeDeepLinkParams(), fromStash, fromUrl, kept, recovery, store (+10 more)

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

### Community 87 - "SearchFormScreen.tsx"
Cohesion: 0.15
Nodes (24): DynamicDestinationsFormContentProps, PassengerCabinPickerProps, SearchFormContentProps, defaultParams, SearchFormScreen(), styles, buildSearchString(), getParam() (+16 more)

### Community 88 - "expedia.js"
Cohesion: 0.35
Nodes (4): expediaUrl(), scrapeExpedia(), attachJsonCapture(), gotoAndSettle()

### Community 89 - "otaListingPrefillURL"
Cohesion: 0.14
Nodes (11): flightSegmentToOtaMap(), isOTAScrapedSource(), otaListingPrefillURL(), otaResolveClockHints(), otaResolveSegmentsPayload(), TestIsOTAScrapedSource(), TestOtaResolveClockHints_oneWayUsesOutDep(), prodShapeSkyscannerEmptyCarrierOption() (+3 more)

### Community 92 - "time.Time"
Cohesion: 0.17
Nodes (17): elapsedMs(), minutesOfDay(), CodeshareFingerprint(), roundTimeToMinutes(), ClickRecord, FullRoundTrip, attachReturnLegKeepPrice(), ensureRoundTripLegs() (+9 more)

### Community 93 - "Flight scraper (multisite)"
Cohesion: 0.40
Nodes (4): Docker, Flight scraper (multisite), Run locally, VPS (recommended): headed Chrome on `:99`

### Community 94 - "AppIcon.tsx"
Cohesion: 0.13
Nodes (15): AppIconLibrary, AppIconProps, styles, EditSearchModalProps, s, getSvgMarkup(), getWebIconSvgDataUri(), hasWebSvgFallback() (+7 more)

### Community 95 - "displayAirlines.ts"
Cohesion: 0.30
Nodes (11): AIRLINE_NAMES, getAirlineName(), resolveAirlineLabel(), AIRLINE_FULL_NAMES, displayAirlineLabel(), formatFlightDesignator(), formatSegmentCarrierLine(), isPlausibleIataCarrier() (+3 more)

### Community 96 - "FlightDetailsModal.tsx"
Cohesion: 0.27
Nodes (12): cabinLabel(), FlightDetailsModal(), formatDuration(), layoverBetween(), legDuration(), s, segmentDurationMinutes(), hasMultipleAirlines() (+4 more)

### Community 97 - "ValidateBookingURL"
Cohesion: 0.27
Nodes (11): gf2CheckoutOffers(), IsCheckoutBookingURL(), IsNonBookableDomain(), TestIsCheckoutBookingURL_rejectsFlightSearchPages(), TestIsNonBookableDomain_blocksFlightRadar(), TestValidateBookingURL_acceptsHTTPS(), TestValidateBookingURL_rejectsEmpty(), TestValidateBookingURL_rejectsJavascript() (+3 more)

### Community 98 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, android, build, ios, start, web

### Community 101 - "ensure-flight-chrome.sh"
Cohesion: 0.70
Nodes (4): DISPLAY, ensure_gateway_proxy(), log(), ensure-flight-chrome.sh script

### Community 102 - "skyscanner.ts"
Cohesion: 0.42
Nodes (10): BookingHop, bookingHopsFromOption(), firstSeg(), isClassicRoundTripLegs(), isoDatePrefix(), isSplitBookingItinerary(), lastSeg(), legNeedsSegmentSplit() (+2 more)

## Knowledge Gaps
- **3 isolated node(s):** `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 596 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Fly-Fix` connect `Features` to `MonthDealsScreen.tsx`, `time.Duration`?**
  _High betweenness centrality (0.330) - this node is a cross-community bridge._
- **What connects `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `.ResolveQuotedPartnerBooking` be split into smaller, more focused modules?**
  _Cohesion score 0.12564102564102564 - nodes in this community are weakly interconnected._
- **Why does `Multi-provider flight search` connect `time.Duration` to `Features`?**
  _High betweenness centrality (0.324) - this node is a cross-community bridge._
- **Should `LandingScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08943089430894309 - nodes in this community are weakly interconnected._
- **Why does `Recent enhancements` connect `MonthDealsScreen.tsx` to `Features`, `AppIcon`?**
  _High betweenness centrality (0.319) - this node is a cross-community bridge._
- **Should `SearchSubmitButton.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13675213675213677 - nodes in this community are weakly interconnected._