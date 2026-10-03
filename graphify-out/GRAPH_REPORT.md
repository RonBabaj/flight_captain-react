# Graph Report - workspace  (2026-10-03)

## Corpus Check
- 230 files · ~218,857 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 7, .example 2, .mdc 1)

## Summary
- 2027 nodes · 6571 edges · 84 communities (70 shown, 14 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 497 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `03e39a5e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- context.Context
- react
- App.tsx
- Issue
- displayAirlines.ts
- dealsCache.ts
- dependencies
- useTheme
- Features
- auth_test.go
- FlightDetailsModal.tsx
- booking_resolve.go
- ui/index.ts
- compilerOptions
- KiwiApifyProvider
- canonical.go
- MonthDealsScreen.tsx
- extractGF2SegmentFromFlight
- server.go
- googleflights2_provider.go
- qa_runner.py
- ApiClient
- matcher_test.go
- TestResult
- ResponseValidator
- runtime_config.go
- booking_gf2_resolve.go
- expo
- config_loader.py
- RuntimeConfigContext.tsx
- searcher.go
- GoogleFlights2Provider
- itinerary.go
- testing.T
- exploreBuildRowsAndQueue
- ValidationIssue
- Backend QA Automation Tool
- isSkippedProviderErr
- providers.go
- search.ts
- skyscanner.ts
- ExploreScreen.tsx
- Fly-Fix – Frontend
- write-spa-fallbacks.mjs
- auth.go
- selectBookingOptionForQuote
- main
- flightcaptainweb
- loadSearchSession
- Nginx Proxy Manager — fly-fix TLS checklist
- ResultsScreen.tsx
- BookingOffer
- .finalize
- AppIcon
- LocaleContext.tsx
- DateRangePicker.tsx
- time.Time
- api/index.ts
- itinerary_test.go
- api.ts
- FlightResultCard.tsx
- SearchLoadingOverlay.tsx
- GF2SearchAirports
- AirportLocation
- extractGF2BookingURL
- Registry
- normalizeKiwiItem
- server_carrier_test.go
- ErrorBoundary
- flyfix.ts
- exchangeRates.ts
- client.ts
- DatePickerCalendar.tsx
- CalendarModal.tsx
- ProviderResult
- booking.ts
- TestApplySoftStrictBaggage
- gf2Cache

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 88 edges
2. `useLocale()` - 79 edges
3. `react` - 62 edges
4. `react-native` - 55 edges
5. `ProviderResult` - 53 edges
6. `ResultsScreen()` - 53 edges
7. `AppIcon()` - 50 edges
8. `MonthDealsScreen()` - 47 edges
9. `BookingOffer` - 40 edges
10. `resolveGF2PartnerOffers()` - 33 edges

## Surprising Connections (you probably didn't know these)
- `Cheaper departure cities (positioning optimizer)` --references--> `CheaperCitiesSection()`  [INFERRED]
  README.md → frontend/src/features/flight-search/components/CheaperCitiesSection.tsx
- `Recent enhancements` --references--> `AppIcon()`  [INFERRED]
  README.md → frontend/src/components/AppIcon.tsx
- `5. Guarantees to the Frontend` --references--> `MonetaryAmount`  [INFERRED]
  backend/backend_api_contracts.md → frontend/src/types/api.ts
- `5. Guarantees to the Frontend` --references--> `AirportLike`  [INFERRED]
  backend/backend_api_contracts.md → frontend/src/types/api.ts
- `5. Guarantees to the Frontend` --references--> `Carrier`  [INFERRED]
  backend/backend_api_contracts.md → frontend/src/types/api.ts

## Import Cycles
- None detected.

## Communities (84 total, 14 thin omitted)

### Community 0 - "context.Context"
Cohesion: 0.15
Nodes (24): resolveAllPartnerBookingsFromTokenWithRetry(), findBookingOptionsArray(), firstPartnerBookingOption(), firstPartnerURLInMap(), firstStringByKeys(), GoogleFlights2Provider, ResolvedPartnerBooking, isPartnerBookingList() (+16 more)

### Community 1 - "react"
Cohesion: 0.10
Nodes (29): styles, LandingScreen(), Nav, styles, useIsMobile(), DynamicDestinationsStack(), Stack, MonthDealsStack() (+21 more)

### Community 2 - "App.tsx"
Cohesion: 0.06
Nodes (65): App(), linking, RTLWrapper(), authHeaders(), AuthUser, changePassword(), createUser(), deleteUser() (+57 more)

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "displayAirlines.ts"
Cohesion: 0.38
Nodes (7): AIRLINE_NAMES, getAirlineName(), resolveAirlineLabel(), AIRLINE_FULL_NAMES, displayAirlineLabel(), labelForCarrierCode(), providerNameForCode()

### Community 5 - "dealsCache.ts"
Cohesion: 0.25
Nodes (15): DealsState, MonthDealsResponse, CachedDealsResults, clearPendingDealsParams(), DealsParams, dealsParamsFingerprint(), getCachedDealsResults(), getLocalStorage() (+7 more)

### Community 6 - "dependencies"
Cohesion: 0.05
Nodes (40): config, { getDefaultConfig }, dependencies, expo, @expo/metro-runtime, expo-status-bar, react, react-dom (+32 more)

### Community 7 - "useTheme"
Cohesion: 0.07
Nodes (65): ClearableTextInput(), ClearableTextInputProps, styles, EditSearchModal(), EditSearchModalProps, s, s, SearchSummaryBar() (+57 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (32): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+24 more)

### Community 9 - "auth_test.go"
Cohesion: 0.16
Nodes (18): handleAuthLogin(), initAuthStore(), initTestAuthDB(), randomTestPassword(), TestAuthLoginAndChangePassword(), TestAuthRegister(), TestAuthUserManagement(), TestBootstrapAdminPasswordSync() (+10 more)

### Community 10 - "FlightDetailsModal.tsx"
Cohesion: 0.17
Nodes (19): airportTimeZones, getAirportTimeZone(), cabinLabel(), FlightDetailsModal(), formatDuration(), layoverBetween(), legDuration(), s (+11 more)

### Community 11 - "booking_resolve.go"
Cohesion: 0.08
Nodes (51): acquireBookingResolveSlot(), beginInflightResolve(), bookingOfferInGF2Sources(), bookingOfferSameURL(), bookingResolveCacheKey(), bookingResolveFailureResponse(), bookingResolveMaxConcurrentFromEnv(), cacheTTLForStatus() (+43 more)

### Community 12 - "ui/index.ts"
Cohesion: 0.17
Nodes (26): BookingResolveResponse, isSafeBookingUrl(), PublicBookingOffer, bookingOfferProviderLabel(), bookingOfferSubtitle(), formatBookingOfferPriceAmount(), formatBookingOfferPriceLine(), formatProviderDisplayName() (+18 more)

### Community 13 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 14 - "KiwiApifyProvider"
Cohesion: 0.15
Nodes (9): apifyErrorMessage(), flattenKiwiItems(), NewKiwiApifyProvider(), stringField(), truncateStr(), TestApifyErrorMessage(), KiwiApifyProvider, kiwiCache (+1 more)

### Community 15 - "canonical.go"
Cohesion: 0.07
Nodes (52): BuildLegAirlineDirectURL(), BuildRedirectURL(), getAffiliateID(), GetClicksSummary(), getOTAProvider(), GetSessionAndOption(), ParseOptionIndex(), ResolveProvider() (+44 more)

### Community 16 - "MonthDealsScreen.tsx"
Cohesion: 0.07
Nodes (38): DisplayPrice(), DisplayPriceProps, HubRouteLeg, HubRouteSummaryModal(), HubRouteSummaryModalProps, s, CheaperCitiesOption, CheaperCitiesSection() (+30 more)

### Community 17 - "extractGF2SegmentFromFlight"
Cohesion: 0.12
Nodes (34): TestParseGF2TimeWithDateHint_AirportLocal(), TestParseGF2TimeWithDateHint_TelAviv(), TestParseGF2TimeWithDateHint_ZSuffixWallClock(), TestExtractGF2BookingToken(), TestBuildGF2ResultFromItinerary_FlatFormat(), TestExtractGF2Leg_SingleSegment_DepartArriveDiffer(), TestExtractGF2Leg_TimeOnly_NoDateHint(), TestExtractGF2Leg_TimeOnly_WithDateHint() (+26 more)

### Community 18 - "server.go"
Cohesion: 0.06
Nodes (58): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, Carrier, CarrierCodes, CreateSearchSessionRequest, DayDeal (+50 more)

### Community 19 - "googleflights2_provider.go"
Cohesion: 0.26
Nodes (4): gf2ExploreResolveDeps(), outboundDatesForMonthBookable(), detectSelfTransfer(), TestDetectSelfTransfer()

### Community 22 - "matcher_test.go"
Cohesion: 0.16
Nodes (31): extractPrice(), cfgTest(), floatPtr(), testConnectingTLVJFK(), TestExtractPrice_euroPrefixNotArrivalTime(), TestGenerateQueries_connecting(), TestGenerateQueries_direct(), TestGenerateQueries_gf2AirlineNameIdentity() (+23 more)

### Community 25 - "runtime_config.go"
Cohesion: 0.22
Nodes (16): adminAccessConfigured(), configRangeError, adminTokenConfigured(), defaultRuntimeConfig(), errConfigOutOfRange(), getRuntimeConfig(), handleAdminRuntimeConfig(), initRuntimeConfigStore() (+8 more)

### Community 26 - "booking_gf2_resolve.go"
Cohesion: 0.09
Nodes (42): airlineDomainForCarrier(), allocateLegQuoteAmount(), applySearchQuoteToOffer(), attachQuotedPriceMeta(), dedupeGF2PartnerOffers(), flightLegDurationMinutes(), gf2OffersHavePrice(), gf2PartnerOfferFromQuoteURL() (+34 more)

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
Cohesion: 0.10
Nodes (25): corpusText(), domainFromURL(), elapsedMs(), logMatchEvent(), countVerifiedPricedOffers(), MatchItinerary(), NewResolver(), truncateStr() (+17 more)

### Community 31 - "GoogleFlights2Provider"
Cohesion: 0.15
Nodes (9): SelectCheapestResolvedPartner(), TestSelectCheapestResolvedPartner(), GoogleFlights2Provider, newGF2RateLimiter(), NewGoogleFlights2Provider(), truncateGF2(), NewRegistryFromEnv(), parseProviderNames() (+1 more)

### Community 32 - "itinerary.go"
Cohesion: 0.10
Nodes (44): extractFlightNumbers(), flightNumberInText(), flightNumbersEquivalent(), splitFlightDesignator(), textContainsAirport(), textContainsAny(), timeMatches(), connectingFlightQueries() (+36 more)

### Community 33 - "testing.T"
Cohesion: 0.04
Nodes (56): TestClassifyURLType_genericVsExact(), TestFlightNumbersEquivalent_leadingZeros(), TestSelectBestOffer_cheapestOTAOverAirline(), TestSelectBestOffer_conflictingCandidatesPicksCheapest(), TestSelectBestOffer_missingPrice(), TestSelectBestOffer_prefersPriceAmongSameURLType(), TestSelectBestOffer_prefersQuoteMatchingPrice(), TestSelectBestOffer_rejectsGenericSearchURL() (+48 more)

### Community 34 - "exploreBuildRowsAndQueue"
Cohesion: 0.12
Nodes (16): airportCoord, exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut(), getAirportCoord() (+8 more)

### Community 36 - "Backend QA Automation Tool"
Cohesion: 0.18
Nodes (10): Backend QA Automation Tool, Features, If the run feels slow or “stuck”, Notes, Optional AI Setup (Ollama), Output, Project Structure, Run (+2 more)

### Community 37 - "isSkippedProviderErr"
Cohesion: 0.53
Nodes (3): MultiSearchResult, isSkippedProviderErr(), IsTransientSearchErrMsg()

### Community 38 - "providers.go"
Cohesion: 0.16
Nodes (20): TestCompleteExtraLegs(), TestExtraLegsFingerprint(), cloneLegs(), CombineOneWayBatches(), CompleteExtraLegs(), extraLegMaxPerBatch(), ExtraLegsFingerprint(), finalizeCombinedBatches() (+12 more)

### Community 39 - "search.ts"
Cohesion: 0.14
Nodes (25): CachedResult, createSearchSession(), createSearchSessionWithRetry(), ensureLegacyPurge(), fetchFresh(), getFromStorage(), getSearchSessionResults(), getStorage() (+17 more)

### Community 40 - "skyscanner.ts"
Cohesion: 0.36
Nodes (10): BookingHop, bookingHopsFromOption(), firstSeg(), isClassicRoundTripLegs(), isoDatePrefix(), isSplitBookingItinerary(), lastSeg(), legNeedsSegmentSplit() (+2 more)

### Community 42 - "ExploreScreen.tsx"
Cohesion: 0.08
Nodes (57): getMonthDeals(), getExploreDestinations(), AIRPORT_DICTIONARY, AIRPORT_ONLY_DICTIONARY, FULL_PLACE_DICTIONARY, getAirportDisplayName(), getAirportEntry(), getAirportNameByCode() (+49 more)

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "write-spa-fallbacks.mjs"
Cohesion: 0.22
Nodes (5): __dirname, dist, indexHtml, indexPath, SPA_ROUTES

### Community 45 - "auth.go"
Cohesion: 0.14
Nodes (38): RecordClick(), authUserJSON(), bearerTokenFromRequest(), bootstrapAdminUser(), createAuthSession(), envFlagTrue(), handleAuthChangePassword(), handleAuthLogout() (+30 more)

### Community 46 - "selectBookingOptionForQuote"
Cohesion: 0.40
Nodes (5): hostFromURL(), selectBookingOptionForQuote(), TestSelectBookingOptionForQuote_fallsBackWhenQuotePriceMismatch(), TestSelectBookingOptionForQuote_prefersDeepLinkHost(), TestSelectBookingOptionForQuote_prefersPriceMatch()

### Community 47 - "main"
Cohesion: 0.40
Nodes (3): main(), parse_args(), _print_unreachable_backend_hint()

### Community 53 - "loadSearchSession"
Cohesion: 0.19
Nodes (20): loadSearchSession(), TestLoadSearchSession_Expiry(), searchSessionTTL(), startSearchSessionCleanup(), cleanupPersistedSessions(), importLegacyJSONSessions(), initSessionStore(), loadPersistedSession() (+12 more)

### Community 54 - "Nginx Proxy Manager — fly-fix TLS checklist"
Cohesion: 0.40
Nodes (4): Nginx Proxy Manager — fly-fix TLS checklist, Reissue frontend cert (both names), Required proxy-host settings, Symptoms Chrome shows

### Community 55 - "ResultsScreen.tsx"
Cohesion: 0.07
Nodes (52): SearchLoadingOverlay(), defaultParams, DynamicDestinationsScreen(), Nav, styles, f, FiltersPanel(), FiltersPanelProps (+44 more)

### Community 56 - "BookingOffer"
Cohesion: 0.13
Nodes (36): bookingMatchPriceNormalizer(), isAffiliateTemplateBookingURL(), normalizedGF2OfferPrice(), preferAirlineDirectWhenCheaperThanMarkedUpOTA(), publicAlternativesFromOffers(), buildDualBookingResolveResponse(), collectVerifiedBookingOffers(), defaultBookingMatchRunner() (+28 more)

### Community 58 - "AppIcon"
Cohesion: 0.14
Nodes (29): AppIcon(), AppIconLibrary, AppIconProps, styles, FormHeroHeader(), FormHeroHeaderProps, styles, formCardStyles (+21 more)

### Community 59 - "LocaleContext.tsx"
Cohesion: 0.24
Nodes (11): LocaleContext, LocaleContextValue, VALID_CURRENCIES, CURRENCIES, CurrencyCode, getTranslation(), LanguageCode, LANGUAGES (+3 more)

### Community 60 - "DateRangePicker.tsx"
Cohesion: 0.20
Nodes (15): useRuntimeConfig(), buildMonthDays(), DateRangePickerProps, getMonthStart(), monthStartForYmd(), parseYmdUtc(), styles, WEEKDAYS (+7 more)

### Community 61 - "time.Time"
Cohesion: 0.15
Nodes (18): minutesOfDay(), mergeExplorePriceRows(), exploreDestRow, exploreLiveCandidate, FullRoundTrip, attachReturnLegKeepPrice(), ensureRoundTripLegs(), exploreDestRowsToMaps() (+10 more)

### Community 62 - "api/index.ts"
Cohesion: 0.12
Nodes (12): searchAirports(), apiGet(), GetDealsRangeParams, GetMonthDealsParams, ExploreResponse, GetExploreDestinationsParams, getFlightDetails(), GetFlightDetailsParams (+4 more)

### Community 63 - "itinerary_test.go"
Cohesion: 0.18
Nodes (17): AttachCanonicalIdentity(), FingerprintDebugString(), segTLVJFK(), TestAttachCanonicalIdentityAll_combineOneWay(), TestCanonicalItineraryFingerprint_connectingFlight(), TestCanonicalItineraryFingerprint_differentFlightsDoNotCollide(), TestCanonicalItineraryFingerprint_directFlight(), TestCanonicalItineraryFingerprint_formattingStable() (+9 more)

### Community 64 - "api.ts"
Cohesion: 0.08
Nodes (29): 1.1 Create Search Session, 1.2 Get Search Session Status & Results, 1.3 Cancel Search Session (Optional, MVP+), 1. Flight Search Sessions, 2.1 Get Monthly Deals, 2. Monthly Deals API, 3.1 Search Airports & Cities, 3. Airport & City Autocomplete (+21 more)

### Community 65 - "FlightResultCard.tsx"
Cohesion: 0.19
Nodes (16): buildRoutePath(), c, FlightResultCard(), LegScheduleBlock(), FlightSegment, LayoverSummary, hasMultipleAirlines(), FlightTimeDisplayMode (+8 more)

### Community 66 - "SearchLoadingOverlay.tsx"
Cohesion: 0.23
Nodes (10): getPhrasesForLanguage(), SEARCH_BUTTON_PHRASES, SEARCH_PROGRESS_PHRASES, s, SearchProgressBanner(), SearchProgressBannerProps, ExtraLeg, Props (+2 more)

### Community 67 - "GF2SearchAirports"
Cohesion: 0.22
Nodes (10): gf2MetroKey(), GF2SearchAirports(), ResolveGF2PlaceCode(), containsAll(), TestGF2SearchAirports_CityOnlyCode(), TestGF2SearchAirports_LondonParis(), TestGF2SearchAirports_SingleAirport(), TestGF2SearchAirports_SpecificAirportNotExpanded() (+2 more)

### Community 68 - "AirportLocation"
Cohesion: 0.15
Nodes (15): AirportLocation(), TestAirportLocation_UnknownFallsBackUTC(), TestParseGF2Time_EuropeanDateFormat(), TestParseGF2Time_AcceptsFullDateTime(), TestParseGF2Time_NumericOffsetIsAbsolute(), TestParseGF2Time_RejectsTimeOnly(), TestParseGF2Time_ZIsAirportWallClock(), gf2HasNumericUTCOffset() (+7 more)

### Community 69 - "extractGF2BookingURL"
Cohesion: 0.67
Nodes (3): TestExtractGF2BookingURL(), extractGF2BookingURL(), findFirstHTTPSURL()

### Community 73 - "normalizeKiwiItem"
Cohesion: 0.23
Nodes (14): TotalStops(), gf2ReturnLegFromFlatItem(), asArray(), collectCarriers(), extractKiwiLegs(), firstFloat(), firstString(), kiwiSegmentFromMap() (+6 more)

### Community 74 - "server_carrier_test.go"
Cohesion: 0.83
Nodes (3): makeOfferWithCarriers(), TestExtractCarrierCodes(), TestPrimaryDisplayCarrier()

### Community 75 - "ErrorBoundary"
Cohesion: 0.15
Nodes (4): ErrorBoundary, Props, s, State

### Community 76 - "flyfix.ts"
Cohesion: 0.25
Nodes (8): apiPost(), FlyfixInsightsGroup, FlyfixIssue, FlyfixRefinedReport, FlyfixSummary, refineIssues(), RefineIssuesRequestBody, cancelSearchSession()

### Community 77 - "exchangeRates.ts"
Cohesion: 0.29
Nodes (8): useExchangeRates(), convertPrice(), CURRENCY_SYMBOLS, CurrencyCode, ensureRates(), fetchRates(), getDisplayPrice(), ratesToUSD

### Community 78 - "client.ts"
Cohesion: 0.17
Nodes (13): AffiliateProvider, AffiliateProviderResponse, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink(), OutboundLinkResponse (+5 more)

### Community 79 - "DatePickerCalendar.tsx"
Cohesion: 0.33
Nodes (7): getDealsRange(), DatePickerCalendar(), DatePickerCalendarProps, getNext14Dates(), getRangeStartEnd(), styles, WEEKDAYS

### Community 81 - "CalendarModal.tsx"
Cohesion: 0.38
Nodes (6): buildMonthDays(), CalendarModal(), getMonthStart(), Props, styles, WEEKDAYS

### Community 82 - "ProviderResult"
Cohesion: 0.14
Nodes (20): DedupeProviderResults(), ItineraryFingerprint(), mergeSelfTransfer(), uniqueStrings(), cheapestReturnLeg(), GoogleFlights2Provider, providerResultArrivalAirport(), isTransientGF2SearchErr() (+12 more)

### Community 83 - "booking.ts"
Cohesion: 0.36
Nodes (8): BookingResolveRequest, BookingResolveStatus, bookingRetryDelayMs(), fetchBookingResolveOnce(), isTransientBookingFetchError(), isTransientBookingResolveResponse(), PublicBookingAlternative, resolveBookingOffer()

### Community 84 - "TestApplySoftStrictBaggage"
Cohesion: 0.52
Nodes (6): applySoftStrictBaggage(), makeOfferWithBags(), makeOfferWithMissingBags(), TestApplySoftStrictBaggage(), TestClassifyOfferBaggage(), classifyOfferBaggage()

### Community 87 - "gf2Cache"
Cohesion: 0.22
Nodes (9): classicRoundTripMissingReturn(), TestClassicRoundTripMissingReturn(), TestDoSearchWithRetry_doesNotCacheRoundTrip(), TestSearch_ignoresIncompleteClassicRTCache(), TestSearch_servesCompleteClassicRTCache(), newGF2Cache(), TestSearchLegCached_usesCache(), gf2Cache (+1 more)

## Knowledge Gaps
- **299 isolated node(s):** `ClicksByProvider`, `BookingResolveRequest`, `PublicBookingAlternative`, `exploreLiveCandidate`, `flightcaptainweb` (+294 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 441 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `FlightResultCard.tsx`, `App.tsx`, `SearchLoadingOverlay.tsx`, `dependencies`, `useTheme`, `ExploreScreen.tsx`, `ErrorBoundary`, `FlightDetailsModal.tsx`, `exchangeRates.ts`, `ui/index.ts`, `DatePickerCalendar.tsx`, `MonthDealsScreen.tsx`, `CalendarModal.tsx`, `ResultsScreen.tsx`, `AppIcon`, `LocaleContext.tsx`, `DateRangePicker.tsx`, `RuntimeConfigContext.tsx`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Why does `useTheme()` connect `useTheme` to `FlightResultCard.tsx`, `SearchLoadingOverlay.tsx`, `react`, `ExploreScreen.tsx`, `FlightDetailsModal.tsx`, `ui/index.ts`, `MonthDealsScreen.tsx`, `ResultsScreen.tsx`, `AppIcon`, `LocaleContext.tsx`, `DateRangePicker.tsx`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Why does `react-native` connect `useTheme` to `react`, `App.tsx`, `SearchLoadingOverlay.tsx`, `FlightResultCard.tsx`, `dependencies`, `ExploreScreen.tsx`, `ErrorBoundary`, `FlightDetailsModal.tsx`, `ui/index.ts`, `DatePickerCalendar.tsx`, `MonthDealsScreen.tsx`, `CalendarModal.tsx`, `ResultsScreen.tsx`, `AppIcon`, `LocaleContext.tsx`, `DateRangePicker.tsx`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `ClicksByProvider`, `BookingResolveRequest`, `PublicBookingAlternative` to the rest of the system?**
  _299 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `context.Context` be split into smaller, more focused modules?**
  _Cohesion score 0.1495798319327731 - nodes in this community are weakly interconnected._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.09639953542392567 - nodes in this community are weakly interconnected._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.055087719298245616 - nodes in this community are weakly interconnected._