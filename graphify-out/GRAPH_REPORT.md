# Graph Report - workspace  (2026-10-03)

## Corpus Check
- 234 files · ~222,194 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: (none) 7, .mdc 2, .example 2)

## Summary
- 2070 nodes · 6677 edges · 93 communities (76 shown, 17 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 499 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7322fdce`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- .ResolveQuotedPartnerBooking
- react
- App.tsx
- Issue
- FiltersPanel.tsx
- dealsCache.ts
- package.json
- useTheme
- Features
- handleExplore
- SearchFormScreen.tsx
- booking_resolve.go
- BookingOptionsFooter.tsx
- compilerOptions
- KiwiApifyProvider
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
- resolveGF2PartnerOffers
- expo
- config_loader.py
- RuntimeConfigContext.tsx
- searcher.go
- ProviderResult
- itinerary.go
- testing.T
- exploreBuildRowsAndQueue
- ValidationIssue
- Backend QA Automation Tool
- isSkippedProviderErr
- CompleteExtraLegs
- search.ts
- skyscanner.ts
- AirportAutocomplete.tsx
- Fly-Fix – Frontend
- destinationMood.test.ts
- net/http.Request
- auth.go
- main
- flightcaptainweb
- session_store.go
- Nginx Proxy Manager — fly-fix TLS checklist
- ResultsScreen.tsx
- BookingOffer
- .finalize
- react-native
- LocaleContext.tsx
- ExploreScreen.tsx
- context.Context
- client.ts
- FlightDetailsModal.tsx
- api.ts
- ValidateBookingURL
- SearchLoadingOverlay.tsx
- gf2_places_test.go
- flightTimeDisplay.ts
- TopNavMenu.tsx
- AuthContext.tsx
- Registry
- normalizeKiwiItem
- server_carrier_test.go
- time.Time
- flyfix.ts
- FlightResultCard.tsx
- affiliate.ts
- DatePickerCalendar.tsx
- data/airports.ts
- legSummary.ts
- affiliate.go
- Fly-Fix UI / UX
- TestApplySoftStrictBaggage
- backend_api_contracts.md
- destinationMood.ts
- newGF2Cache
- runBookingMatch
- booking.ts
- CodeshareFingerprint
- explore_session_build.go
- gf2ExploreResolveDeps

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 90 edges
2. `useLocale()` - 81 edges
3. `react` - 63 edges
4. `react-native` - 56 edges
5. `ResultsScreen()` - 55 edges
6. `ProviderResult` - 53 edges
7. `AppIcon()` - 50 edges
8. `MonthDealsScreen()` - 47 edges
9. `BookingOffer` - 40 edges
10. `resolveGF2PartnerOffers()` - 33 edges

## Surprising Connections (you probably didn't know these)
- `Search form` --references--> `DestinationMoodBanner()`  [INFERRED]
  .cursor/skills/flyfix-ui-ux/SKILL.md → frontend/src/components/DestinationMoodBanner.tsx
- `Cheaper departure cities (positioning optimizer)` --references--> `CheaperCitiesSection()`  [INFERRED]
  README.md → frontend/src/features/flight-search/components/CheaperCitiesSection.tsx
- `Results` --references--> `SortBar()`  [INFERRED]
  .cursor/skills/flyfix-ui-ux/SKILL.md → frontend/src/features/flight-search/components/SortBar.tsx
- `1.2 Get Search Session Status & Results` --references--> `FlightOption`  [INFERRED]
  backend/backend_api_contracts.md → frontend/src/types/api.ts
- `Recent enhancements` --references--> `AppIcon()`  [INFERRED]
  README.md → frontend/src/components/AppIcon.tsx

## Import Cycles
- None detected.

## Communities (93 total, 17 thin omitted)

### Community 0 - ".ResolveQuotedPartnerBooking"
Cohesion: 0.10
Nodes (32): applySearchQuoteToOffer(), gf2PartnerOfferFromQuoteURL(), optionVendorFromQuote(), resolveAllPartnerBookingsFromTokenWithRetry(), findBookingOptionsArray(), firstPartnerBookingOption(), firstPartnerURLInMap(), firstStringByKeys() (+24 more)

### Community 1 - "react"
Cohesion: 0.08
Nodes (24): styles, ErrorBoundary, Props, s, State, LandingScreen(), Nav, styles (+16 more)

### Community 2 - "App.tsx"
Cohesion: 0.12
Nodes (27): App(), linking, RTLWrapper(), API_BASE, useExchangeRates(), RootNavigator(), ThemeProvider(), isDeepLinkDebugEnabled() (+19 more)

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "FiltersPanel.tsx"
Cohesion: 0.12
Nodes (18): f, FiltersPanel(), FiltersPanelProps, FlightDetailsModalProps, FlightResultCardProps, PositioningLegResult, defaultFilters, isCurrentSearchGeneration() (+10 more)

### Community 5 - "dealsCache.ts"
Cohesion: 0.25
Nodes (15): DealsState, MonthDealsResponse, CachedDealsResults, clearPendingDealsParams(), DealsParams, dealsParamsFingerprint(), getCachedDealsResults(), getLocalStorage() (+7 more)

### Community 6 - "package.json"
Cohesion: 0.05
Nodes (40): config, { getDefaultConfig }, dependencies, expo, @expo/metro-runtime, expo-status-bar, react, react-dom (+32 more)

### Community 7 - "useTheme"
Cohesion: 0.09
Nodes (50): ClearableTextInput(), ClearableTextInputProps, styles, useAuth(), useLocale(), useRuntimeConfigActions(), AdminRuntimeConfigPanel(), ConfigFieldRow() (+42 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (32): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+24 more)

### Community 9 - "handleExplore"
Cohesion: 0.19
Nodes (10): exploreSessionKey(), getExploreSession(), newExploreSessionID(), putExploreSession(), startExploreSessionCleanup(), corsMiddleware(), fetchExchangeRates(), handleExplore() (+2 more)

### Community 10 - "SearchFormScreen.tsx"
Cohesion: 0.15
Nodes (24): SearchLoadingOverlay(), defaultParams, SearchFormScreen(), styles, buildSearchString(), getParam(), getParams(), isWeb() (+16 more)

### Community 11 - "booking_resolve.go"
Cohesion: 0.16
Nodes (20): acquireBookingResolveSlot(), beginInflightResolve(), bookingResolveCacheKey(), bookingResolveFailureResponse(), bookingResolveMaxConcurrentFromEnv(), cacheTTLForStatus(), envDurationMinutes(), finishInflightResolve() (+12 more)

### Community 12 - "BookingOptionsFooter.tsx"
Cohesion: 0.17
Nodes (26): BookingResolveResponse, isSafeBookingUrl(), PublicBookingOffer, bookingOfferProviderLabel(), bookingOfferSubtitle(), formatBookingOfferPriceAmount(), formatBookingOfferPriceLine(), formatProviderDisplayName() (+18 more)

### Community 13 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 14 - "KiwiApifyProvider"
Cohesion: 0.20
Nodes (7): apifyErrorMessage(), flattenKiwiItems(), NewKiwiApifyProvider(), stringField(), truncateStr(), TestApifyErrorMessage(), KiwiApifyProvider

### Community 15 - "canonical_booking_test.go"
Cohesion: 0.12
Nodes (28): openJawOption(), TestBookingLinkModeDefaultsToGoogle(), TestBookingRouteFromSessionOption_splitOmitsReturn(), TestBuildGoogleFlightsFallbackFromParams(), TestBuildLegOrSegmentBookingURL_segment(), TestBuildOneWayLegBookingURL(), TestBuildSkyscannerPrefillURL_oneWay(), TestBuildSkyscannerPrefillURL_roundTrip() (+20 more)

### Community 16 - "MonthDealsScreen.tsx"
Cohesion: 0.06
Nodes (41): getFlightDetails(), EditSearchModal(), EditSearchModalProps, s, s, SearchSummaryBar(), SearchSummaryBarProps, KEYS (+33 more)

### Community 17 - "googleflights2_provider.go"
Cohesion: 0.14
Nodes (37): TestParseGF2TimeWithDateHint_AirportLocal(), TestExtractGF2BookingToken(), TestExtractGF2BookingURL(), TestBuildGF2ResultFromItinerary_FlatFormat(), TestParseGF2Response_AttachesFlatReturnFlights(), TestParseGF2Response_RapidAPIFlatTopFlights(), TestExtractGF2Leg_TimeOnly_NoDateHint(), TestExtractGF2SegmentFromFlight_CodeOnlyHasNoName() (+29 more)

### Community 18 - "server.go"
Cohesion: 0.07
Nodes (57): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, CanonicalFingerprint(), Carrier, CreateSearchSessionRequest, DayDeal (+49 more)

### Community 22 - "matcher_test.go"
Cohesion: 0.12
Nodes (39): extractPrice(), cfgTest(), floatPtr(), testConnectingTLVJFK(), TestExtractPrice_euroPrefixNotArrivalTime(), TestGenerateQueries_connecting(), TestGenerateQueries_direct(), TestGenerateQueries_gf2AirlineNameIdentity() (+31 more)

### Community 25 - "runtime_config.go"
Cohesion: 0.22
Nodes (16): adminAccessConfigured(), configRangeError, adminTokenConfigured(), defaultRuntimeConfig(), errConfigOutOfRange(), getRuntimeConfig(), handleAdminRuntimeConfig(), initRuntimeConfigStore() (+8 more)

### Community 26 - "resolveGF2PartnerOffers"
Cohesion: 0.08
Nodes (37): allocateLegQuoteAmount(), attachQuotedPriceMeta(), dedupeGF2PartnerOffers(), flightLegDurationMinutes(), gf2OffersHavePrice(), gf2PartnerOfferFromResolved(), gf2PartnerOfferFromURL(), isTransientGF2BookingErr() (+29 more)

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.29
Nodes (10): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+2 more)

### Community 29 - "RuntimeConfigContext.tsx"
Cohesion: 0.18
Nodes (15): apiRequest(), adminAuthHeaders(), fetchAdminRuntimeConfig(), fetchRuntimeConfig(), saveAdminRuntimeConfig(), setRuntimeConfigStore(), RuntimeConfigContext, RuntimeConfigContextValue (+7 more)

### Community 30 - "searcher.go"
Cohesion: 0.08
Nodes (26): defaultBookingMatchRunner(), corpusText(), domainFromURL(), elapsedMs(), logMatchEvent(), countVerifiedPricedOffers(), MatchItinerary(), NewResolver() (+18 more)

### Community 31 - "ProviderResult"
Cohesion: 0.10
Nodes (21): DedupeProviderResults(), ItineraryFingerprint(), mergeSelfTransfer(), uniqueStrings(), cheapestReturnLeg(), GoogleFlights2Provider, providerResultArrivalAirport(), TestDedupeKeepsCheaper() (+13 more)

### Community 32 - "itinerary.go"
Cohesion: 0.09
Nodes (42): extractFlightNumbers(), flightNumberInText(), flightNumbersEquivalent(), splitFlightDesignator(), textContainsAirport(), textContainsAny(), timeMatches(), connectingFlightQueries() (+34 more)

### Community 33 - "testing.T"
Cohesion: 0.04
Nodes (69): TestIsAffiliateTemplateBookingURL(), TestFlightNumbersEquivalent_leadingZeros(), TestSelectCheapestVerifiedOffer_picksLowestPrice(), TestProviderResultsToFlightOptions_PreservesCarrierName(), TestAttachReturnLegKeepPrice(), TestEnsureRoundTripLegs_nilSafe(), TestEnsureRoundTripLegs_noOpWhenTwoLegs(), AirportLocation() (+61 more)

### Community 34 - "exploreBuildRowsAndQueue"
Cohesion: 0.12
Nodes (16): airportCoord, exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut(), getAirportCoord() (+8 more)

### Community 36 - "Backend QA Automation Tool"
Cohesion: 0.18
Nodes (10): Backend QA Automation Tool, Features, If the run feels slow or “stuck”, Notes, Optional AI Setup (Ollama), Output, Project Structure, Run (+2 more)

### Community 37 - "isSkippedProviderErr"
Cohesion: 0.53
Nodes (3): MultiSearchResult, isSkippedProviderErr(), IsTransientSearchErrMsg()

### Community 38 - "CompleteExtraLegs"
Cohesion: 0.47
Nodes (6): TestCompleteExtraLegs(), TestExtraLegsFingerprint(), CompleteExtraLegs(), ExtraLegsFingerprint(), NormalizeExtraLegs(), ExtraLeg

### Community 39 - "search.ts"
Cohesion: 0.15
Nodes (25): CachedResult, createSearchSession(), createSearchSessionWithRetry(), ensureLegacyPurge(), fetchFresh(), getFromStorage(), getSearchSessionResults(), getStorage() (+17 more)

### Community 40 - "skyscanner.ts"
Cohesion: 0.36
Nodes (10): BookingHop, bookingHopsFromOption(), firstSeg(), isClassicRoundTripLegs(), isoDatePrefix(), isSplitBookingItinerary(), lastSeg(), legNeedsSegmentSplit() (+2 more)

### Community 42 - "AirportAutocomplete.tsx"
Cohesion: 0.20
Nodes (19): getCountryDisplayName(), getCountryEntry(), AirportAutocomplete(), AirportAutocompleteProps, CountrySelectMode, styles, makeCountryDestination(), countryMatchesQuery() (+11 more)

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "destinationMood.test.ts"
Cohesion: 0.12
Nodes (11): __dirname, dist, indexHtml, indexPath, SPA_ROUTES, byCity, curatedCities, curatedUrls (+3 more)

### Community 45 - "net/http.Request"
Cohesion: 0.19
Nodes (26): GetSessionAndOption(), bearerTokenFromRequest(), handleAuthChangePassword(), handleAuthLogout(), handleAuthMe(), isAdminRequest(), requireAdminUser(), userFromRequest() (+18 more)

### Community 46 - "auth.go"
Cohesion: 0.18
Nodes (23): authUserJSON(), bootstrapAdminUser(), createAuthSession(), envFlagTrue(), handleAuthLogin(), handleAuthRegister(), handleAuthUsers(), initAuthStore() (+15 more)

### Community 47 - "main"
Cohesion: 0.40
Nodes (3): main(), parse_args(), _print_unreachable_backend_hint()

### Community 53 - "session_store.go"
Cohesion: 0.19
Nodes (20): loadSearchSession(), TestLoadSearchSession_Expiry(), searchSessionTTL(), startSearchSessionCleanup(), cleanupPersistedSessions(), importLegacyJSONSessions(), initSessionStore(), loadPersistedSession() (+12 more)

### Community 54 - "Nginx Proxy Manager — fly-fix TLS checklist"
Cohesion: 0.40
Nodes (4): Nginx Proxy Manager — fly-fix TLS checklist, Reissue frontend cert (both names), Required proxy-host settings, Symptoms Chrome shows

### Community 55 - "ResultsScreen.tsx"
Cohesion: 0.11
Nodes (28): defaultParams, DynamicDestinationsScreen(), Nav, styles, ResultsSkeletonCard(), ResultsSkeletonList(), sk, bestScore() (+20 more)

### Community 56 - "BookingOffer"
Cohesion: 0.16
Nodes (32): airlineDomainForCarrier(), bookingMatchPriceNormalizer(), isAffiliateTemplateBookingURL(), marketingCarrierForLegIndex(), normalizedGF2OfferPrice(), offersIncludeAirlineDirect(), preferAirlineDirectWhenCheaperThanMarkedUpOTA(), publicAlternativesFromOffers() (+24 more)

### Community 58 - "react-native"
Cohesion: 0.09
Nodes (44): AppIcon(), AppIconLibrary, AppIconProps, styles, FormHeroHeader(), FormHeroHeaderProps, styles, formCardStyles (+36 more)

### Community 59 - "LocaleContext.tsx"
Cohesion: 0.22
Nodes (13): getStorage(), languageToLocale(), loadSaved(), LocaleContext, LocaleContextValue, LocaleProvider(), save(), VALID_CURRENCIES (+5 more)

### Community 60 - "ExploreScreen.tsx"
Cohesion: 0.13
Nodes (26): ExploreResponse, getExploreDestinations(), c, countryFlag(), d, DestCard(), DestCardProps, ExploreScreen() (+18 more)

### Community 61 - "context.Context"
Cohesion: 0.11
Nodes (20): mergeExplorePriceRows(), exploreDestRow, exploreSession, exploreDestRowsToMaps(), exploreRunLiveBatch(), gf2ExploreSearchOneDestination(), isGF2RateLimitErr(), GoogleFlights2Provider (+12 more)

### Community 62 - "client.ts"
Cohesion: 0.14
Nodes (12): searchAirports(), apiGet(), apiUrl(), isLocalHostname(), resolveApiBase(), GetDealsRangeParams, getMonthDeals(), GetMonthDealsParams (+4 more)

### Community 63 - "FlightDetailsModal.tsx"
Cohesion: 0.22
Nodes (15): AIRLINE_NAMES, getAirlineName(), resolveAirlineLabel(), AIRLINE_FULL_NAMES, cabinLabel(), FlightDetailsModal(), formatDuration(), layoverBetween() (+7 more)

### Community 64 - "api.ts"
Cohesion: 0.14
Nodes (17): 5. Guarantees to the Frontend, SearchState, AirportCityResult, AirportCityType, AirportLike, ANYWHERE_CODE, BaggageClass, Carrier (+9 more)

### Community 65 - "ValidateBookingURL"
Cohesion: 0.18
Nodes (15): gf2CheckoutOffers(), classifyURLType(), TestClassifyURLType_genericVsExact(), urlTypeRank(), IsCheckoutBookingURL(), IsNonBookableDomain(), TestIsCheckoutBookingURL_rejectsFlightSearchPages(), TestIsNonBookableDomain_blocksFlightRadar() (+7 more)

### Community 66 - "SearchLoadingOverlay.tsx"
Cohesion: 0.23
Nodes (10): getPhrasesForLanguage(), SEARCH_BUTTON_PHRASES, SEARCH_PROGRESS_PHRASES, s, SearchProgressBanner(), SearchProgressBannerProps, ExtraLeg, Props (+2 more)

### Community 67 - "gf2_places_test.go"
Cohesion: 0.31
Nodes (10): gf2MetroKey(), GF2SearchAirports(), ResolveGF2PlaceCode(), containsAll(), TestGF2SearchAirports_CityOnlyCode(), TestGF2SearchAirports_LondonParis(), TestGF2SearchAirports_SingleAirport(), TestGF2SearchAirports_SpecificAirportNotExpanded() (+2 more)

### Community 68 - "flightTimeDisplay.ts"
Cohesion: 0.24
Nodes (12): airportTimeZones, getAirportTimeZone(), fmtDur(), layoverBetween(), legDuration(), renderLeg(), flightMinutesBetween(), flightTimeToMs() (+4 more)

### Community 69 - "TopNavMenu.tsx"
Cohesion: 0.14
Nodes (18): DestinationMoodBanner(), styles, Variant, Breakpoint, BREAKPOINTS, useBreakpoint(), useIsCompactLayout(), useIsMobile() (+10 more)

### Community 71 - "AuthContext.tsx"
Cohesion: 0.17
Nodes (22): authHeaders(), AuthUser, changePassword(), createUser(), deleteUser(), fetchAuthMe(), fetchUsers(), LoginResponse (+14 more)

### Community 72 - "Registry"
Cohesion: 0.18
Nodes (5): newGF2RateLimiter(), NewGoogleFlights2Provider(), NewRegistryFromEnv(), parseProviderNames(), Registry

### Community 73 - "normalizeKiwiItem"
Cohesion: 0.11
Nodes (25): TestCombineOneWayBatches(), TestCombineOneWayBatches_emptyBatch(), TestCombineOneWayBatches_openJawReturnDiversity(), TestAttachCanonicalIdentityAll_combineOneWay(), asArray(), collectCarriers(), detectSelfTransfer(), extractKiwiLegs() (+17 more)

### Community 74 - "server_carrier_test.go"
Cohesion: 0.43
Nodes (6): CarrierCodes, makeOfferWithCarriers(), TestExtractCarrierCodes(), TestPrimaryDisplayCarrier(), ExtractCarrierCodes(), PrimaryDisplayCarrier()

### Community 75 - "time.Time"
Cohesion: 0.27
Nodes (11): minutesOfDay(), FullRoundTrip, attachReturnLegKeepPrice(), ensureRoundTripLegs(), gf2OneRoundTrip(), gf2SearchDealsOnDates(), gf2SearchDealsRange(), gf2SearchMonthDeals() (+3 more)

### Community 76 - "flyfix.ts"
Cohesion: 0.25
Nodes (8): apiPost(), FlyfixInsightsGroup, FlyfixIssue, FlyfixRefinedReport, FlyfixSummary, refineIssues(), RefineIssuesRequestBody, cancelSearchSession()

### Community 77 - "FlightResultCard.tsx"
Cohesion: 0.11
Nodes (21): DisplayPrice(), DisplayPriceProps, HubRouteLeg, HubRouteSummaryModal(), HubRouteSummaryModalProps, s, CheaperCitiesOption, CheaperCitiesSection() (+13 more)

### Community 78 - "affiliate.ts"
Cohesion: 0.27
Nodes (9): AffiliateProvider, AffiliateProviderResponse, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink(), OutboundLinkResponse (+1 more)

### Community 79 - "DatePickerCalendar.tsx"
Cohesion: 0.29
Nodes (7): getDealsRange(), DatePickerCalendar(), DatePickerCalendarProps, getNext14Dates(), getRangeStartEnd(), styles, WEEKDAYS

### Community 80 - "data/airports.ts"
Cohesion: 0.12
Nodes (18): AIRPORT_DICTIONARY, AIRPORT_ONLY_DICTIONARY, FULL_PLACE_DICTIONARY, getAirportDisplayName(), getAirportNameByCode(), getCityDisplayName(), lower(), matchesQuery() (+10 more)

### Community 81 - "legSummary.ts"
Cohesion: 0.22
Nodes (11): LegScheduleBlock(), LayoverSummary, OutboundSummary, buildLegPreviewSummary(), computeLayovers(), formatDuration(), formatLayoverPreview(), formatLegStopsLabel() (+3 more)

### Community 82 - "affiliate.go"
Cohesion: 0.18
Nodes (15): BuildLegAirlineDirectURL(), BuildRedirectURL(), getAffiliateID(), GetClicksSummary(), getOTAProvider(), ParseOptionIndex(), RecordClick(), ResolveProvider() (+7 more)

### Community 83 - "Fly-Fix UI / UX"
Cohesion: 0.15
Nodes (12): Avoid (AI-vibe tells), Checklist before shipping UI, Design north star, Fly-Fix UI / UX, Landing, Motion, Prefer, Responsive (+4 more)

### Community 84 - "TestApplySoftStrictBaggage"
Cohesion: 0.52
Nodes (6): applySoftStrictBaggage(), makeOfferWithBags(), makeOfferWithMissingBags(), TestApplySoftStrictBaggage(), TestClassifyOfferBaggage(), classifyOfferBaggage()

### Community 85 - "backend_api_contracts.md"
Cohesion: 0.18
Nodes (10): 1.1 Create Search Session, 1.2 Get Search Session Status & Results, 1.3 Cancel Search Session (Optional, MVP+), 1. Flight Search Sessions, 2.1 Get Monthly Deals, 2. Monthly Deals API, 3.1 Search Airports & Cities, 3. Airport & City Autocomplete (+2 more)

### Community 86 - "destinationMood.ts"
Cohesion: 0.19
Nodes (15): getAirportEntry(), ASSIGNED_URLS, BY_CODE, BY_COUNTRY, DestinationMood, FALLBACK_IMAGE, hashCode(), LANDING_MOOD_DESTINATIONS (+7 more)

### Community 87 - "newGF2Cache"
Cohesion: 0.29
Nodes (7): classicRoundTripMissingReturn(), TestClassicRoundTripMissingReturn(), TestDoSearchWithRetry_doesNotCacheRoundTrip(), TestSearch_ignoresIncompleteClassicRTCache(), TestSearch_servesCompleteClassicRTCache(), newGF2Cache(), TestSearchLegCached_usesCache()

### Community 88 - "runBookingMatch"
Cohesion: 0.08
Nodes (36): canonicalItineraryForOption(), handleBookingResolve(), intPtrOrNil(), legRouteLabel(), TestCanonicalItineraryForOption_isolatesSplitLegs(), logBookingResolve(), mustCanonicalForLog(), providerFromOffer() (+28 more)

### Community 89 - "booking.ts"
Cohesion: 0.36
Nodes (8): BookingResolveRequest, BookingResolveStatus, bookingRetryDelayMs(), fetchBookingResolveOnce(), isTransientBookingFetchError(), isTransientBookingResolveResponse(), PublicBookingAlternative, resolveBookingOffer()

## Knowledge Gaps
- **320 isolated node(s):** `ClicksByProvider`, `BookingResolveRequest`, `PublicBookingAlternative`, `exploreLiveCandidate`, `flightcaptainweb` (+315 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 463 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `App.tsx`, `FiltersPanel.tsx`, `package.json`, `useTheme`, `SearchFormScreen.tsx`, `BookingOptionsFooter.tsx`, `MonthDealsScreen.tsx`, `RuntimeConfigContext.tsx`, `AirportAutocomplete.tsx`, `ResultsScreen.tsx`, `react-native`, `LocaleContext.tsx`, `ExploreScreen.tsx`, `FlightDetailsModal.tsx`, `SearchLoadingOverlay.tsx`, `TopNavMenu.tsx`, `AuthContext.tsx`, `FlightResultCard.tsx`, `DatePickerCalendar.tsx`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `react-native` connect `react-native` to `react`, `App.tsx`, `SearchLoadingOverlay.tsx`, `FiltersPanel.tsx`, `TopNavMenu.tsx`, `package.json`, `useTheme`, `AirportAutocomplete.tsx`, `SearchFormScreen.tsx`, `BookingOptionsFooter.tsx`, `FlightResultCard.tsx`, `DatePickerCalendar.tsx`, `MonthDealsScreen.tsx`, `ResultsScreen.tsx`, `LocaleContext.tsx`, `ExploreScreen.tsx`, `FlightDetailsModal.tsx`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `ClicksByProvider`, `BookingResolveRequest`, `PublicBookingAlternative` to the rest of the system?**
  _320 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `.ResolveQuotedPartnerBooking` be split into smaller, more focused modules?**
  _Cohesion score 0.10452961672473868 - nodes in this community are weakly interconnected._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.07878787878787878 - nodes in this community are weakly interconnected._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11742424242424243 - nodes in this community are weakly interconnected._
- **Should `Issue` be split into smaller, more focused modules?**
  _Cohesion score 0.09957325746799431 - nodes in this community are weakly interconnected._