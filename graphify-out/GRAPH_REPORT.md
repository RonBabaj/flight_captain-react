# Graph Report - workspace  (2026-10-04)

## Corpus Check
- 234 files · ~222,789 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: (none) 7, .mdc 2, .example 2)

## Summary
- 2074 nodes · 6708 edges · 82 communities (69 shown, 13 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 499 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7ef30686`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- .ResolveQuotedPartnerBooking
- App.tsx
- ResultsScreen.tsx
- Issue
- FiltersPanel.tsx
- dealsCache.ts
- package.json
- useTheme
- Features
- auth_test.go
- AirportLocation
- context.Context
- BookingOptionsFooter.tsx
- compilerOptions
- KiwiApifyProvider
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
- booking_gf2_resolve.go
- expo
- config_loader.py
- RuntimeConfigContext.tsx
- CanonicalItinerary
- api.ts
- itinerary.go
- testing.T
- explore_cache.go
- ValidationIssue
- Backend QA Automation Tool
- isSkippedProviderErr
- CompleteExtraLegs
- search.ts
- FlightDetailsModal.tsx
- AirportAutocomplete.tsx
- Fly-Fix – Frontend
- destinationMood.test.ts
- auth.go
- selectBookingOptionForQuote
- main
- flightcaptainweb
- session_store.go
- Nginx Proxy Manager — fly-fix TLS checklist
- ExploreScreen.tsx
- BookingOffer
- .finalize
- AppIcon
- ProviderResult
- client.ts
- SearchLoadingOverlay.tsx
- GF2SearchAirports
- flightTimeDisplay.ts
- AuthContext.tsx
- Registry
- normalizeKiwiItem
- server_carrier_test.go
- time.Time
- flyfix.ts
- exchangeRates.ts
- affiliate.ts
- dealsStore.ts
- FlightResultCard.tsx
- affiliate.go
- Fly-Fix UI / UX
- TestApplySoftStrictBaggage
- backend_api_contracts.md
- newGF2Cache
- booking_resolve.go
- booking.ts

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 90 edges
2. `useLocale()` - 82 edges
3. `react` - 63 edges
4. `ResultsScreen()` - 57 edges
5. `react-native` - 56 edges
6. `ProviderResult` - 53 edges
7. `AppIcon()` - 50 edges
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
- `1.2 Get Search Session Status & Results` --references--> `FlightOption`  [INFERRED]
  backend/backend_api_contracts.md → frontend/src/types/api.ts
- `Recent enhancements` --references--> `AppIcon()`  [INFERRED]
  README.md → frontend/src/components/AppIcon.tsx

## Import Cycles
- None detected.

## Communities (82 total, 13 thin omitted)

### Community 0 - ".ResolveQuotedPartnerBooking"
Cohesion: 0.15
Nodes (22): findBookingOptionsArray(), firstPartnerBookingOption(), firstPartnerURLInMap(), firstStringByKeys(), GoogleFlights2Provider, ResolvedPartnerBooking, isPartnerBookingList(), parseGF2BookingOptions() (+14 more)

### Community 1 - "App.tsx"
Cohesion: 0.06
Nodes (43): App(), linking, RTLWrapper(), ErrorBoundary, Props, s, State, RuntimeConfigProvider() (+35 more)

### Community 2 - "ResultsScreen.tsx"
Cohesion: 0.07
Nodes (63): collectTripDestinationCodes(), DestinationMoodStrip(), SearchSummaryBar(), DynamicDestinationsFormContent(), DynamicDestinationsFormContentProps, styles, defaultParams, DynamicDestinationsScreen() (+55 more)

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "FiltersPanel.tsx"
Cohesion: 0.18
Nodes (16): AIRLINE_NAMES, getAirlineName(), resolveAirlineLabel(), AIRLINE_FULL_NAMES, f, FiltersPanel(), Chip(), displayAirlineLabel() (+8 more)

### Community 5 - "dealsCache.ts"
Cohesion: 0.33
Nodes (12): clearPendingDealsParams(), DealsParams, dealsParamsFingerprint(), getCachedDealsResults(), getLocalStorage(), getPendingDealsParams(), getSessionStorage(), migrateLegacySessionParams() (+4 more)

### Community 6 - "package.json"
Cohesion: 0.05
Nodes (40): config, { getDefaultConfig }, dependencies, expo, @expo/metro-runtime, expo-status-bar, react, react-dom (+32 more)

### Community 7 - "useTheme"
Cohesion: 0.06
Nodes (70): ClearableTextInput(), ClearableTextInputProps, styles, styles, EditSearchModal(), EditSearchModalProps, s, s (+62 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (32): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+24 more)

### Community 9 - "auth_test.go"
Cohesion: 0.15
Nodes (19): handleAuthLogin(), initAuthStore(), initTestAuthDB(), randomTestPassword(), TestAuthLoginAndChangePassword(), TestAuthRegister(), TestAuthUserManagement(), TestBootstrapAdminPasswordSync() (+11 more)

### Community 10 - "AirportLocation"
Cohesion: 0.11
Nodes (19): AirportLocation(), TestAirportLocation_UnknownFallsBackUTC(), TestParseGF2TimeWithDateHint_TelAviv(), TestParseGF2TimeWithDateHint_ZSuffixWallClock(), TestParseGF2Time_EuropeanDateFormat(), TestExtractGF2Leg_SingleSegment_DepartArriveDiffer(), TestExtractGF2Leg_TimeOnly_WithDateHint(), TestParseGF2Time_AcceptsFullDateTime() (+11 more)

### Community 11 - "context.Context"
Cohesion: 0.15
Nodes (12): GoogleFlights2Provider, legSearchRetryable(), truncateGF2(), TestResolveReturnAirports_classic(), TestSanitizeStandardSearchRequest(), SearchRequest, HasExtraLegs(), IsOpenJaw() (+4 more)

### Community 12 - "BookingOptionsFooter.tsx"
Cohesion: 0.15
Nodes (30): BookingResolveResponse, isSafeBookingUrl(), PublicBookingOffer, bookingOfferProviderLabel(), bookingOfferSubtitle(), formatBookingOfferPriceAmount(), formatBookingOfferPriceLine(), formatProviderDisplayName() (+22 more)

### Community 13 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 14 - "KiwiApifyProvider"
Cohesion: 0.22
Nodes (7): apifyErrorMessage(), flattenKiwiItems(), NewKiwiApifyProvider(), stringField(), truncateStr(), TestApifyErrorMessage(), KiwiApifyProvider

### Community 15 - "canonical_booking_test.go"
Cohesion: 0.11
Nodes (30): openJawOption(), TestBookingLinkModeDefaultsToGoogle(), TestBookingRouteFromSessionOption_splitOmitsReturn(), TestBuildGoogleFlightsFallbackFromParams(), TestBuildLegOrSegmentBookingURL_segment(), TestBuildOneWayLegBookingURL(), TestBuildSkyscannerPrefillURL_oneWay(), TestBuildSkyscannerPrefillURL_roundTrip() (+22 more)

### Community 16 - "MonthDealsScreen.tsx"
Cohesion: 0.06
Nodes (48): getMonthDeals(), getFlightDetails(), DisplayPrice(), DisplayPriceProps, HubRouteLeg, HubRouteSummaryModal(), HubRouteSummaryModalProps, s (+40 more)

### Community 17 - "googleflights2_provider.go"
Cohesion: 0.18
Nodes (32): TestExtractGF2BookingURL(), TestExtractGF2PartnerBookingTokenPrefersPartnerURL(), buildGF2ResultFromItinerary(), extractGF2BookingToken(), extractGF2BookingURL(), extractGF2DurationMinutes(), extractGF2Flight(), extractGF2Itineraries() (+24 more)

### Community 18 - "server.go"
Cohesion: 0.06
Nodes (60): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, CanonicalFingerprint(), Carrier, CarrierCodes, CreateSearchSessionRequest (+52 more)

### Community 19 - "booking_resolve_test.go"
Cohesion: 0.23
Nodes (7): exploreLiveCandidate, gf2ExploreResolveDeps(), outboundDatesForMonthBookable(), detectSelfTransfer(), TestDetectSelfTransfer(), MultiSearchResult, ProviderSearchStats

### Community 22 - "matcher_test.go"
Cohesion: 0.16
Nodes (31): extractPrice(), cfgTest(), floatPtr(), testConnectingTLVJFK(), TestExtractPrice_euroPrefixNotArrivalTime(), TestGenerateQueries_connecting(), TestGenerateQueries_direct(), TestGenerateQueries_gf2AirlineNameIdentity() (+23 more)

### Community 25 - "runtime_config.go"
Cohesion: 0.22
Nodes (16): adminAccessConfigured(), configRangeError, adminTokenConfigured(), defaultRuntimeConfig(), errConfigOutOfRange(), getRuntimeConfig(), handleAdminRuntimeConfig(), initRuntimeConfigStore() (+8 more)

### Community 26 - "booking_gf2_resolve.go"
Cohesion: 0.09
Nodes (46): airlineDomainForCarrier(), allocateLegQuoteAmount(), applySearchQuoteToOffer(), attachQuotedPriceMeta(), bookingMatchPriceNormalizer(), dedupeGF2PartnerOffers(), flightLegDurationMinutes(), gf2OffersHavePrice() (+38 more)

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.29
Nodes (10): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+2 more)

### Community 29 - "RuntimeConfigContext.tsx"
Cohesion: 0.19
Nodes (14): apiRequest(), adminAuthHeaders(), fetchAdminRuntimeConfig(), fetchRuntimeConfig(), saveAdminRuntimeConfig(), setRuntimeConfigStore(), RuntimeConfigContext, RuntimeConfigContextValue (+6 more)

### Community 30 - "CanonicalItinerary"
Cohesion: 0.09
Nodes (32): defaultBookingMatchRunner(), webVerifiedBookingOffers(), corpusText(), domainFromURL(), elapsedMs(), logMatchEvent(), MatchResult, countVerifiedPricedOffers() (+24 more)

### Community 31 - "api.ts"
Cohesion: 0.11
Nodes (22): 5. Guarantees to the Frontend, FiltersPanelProps, FlightDetailsModalProps, FlightResultCardProps, PositioningLegResult, SearchState, AirportCitySearchResponse, AirportCityType (+14 more)

### Community 32 - "itinerary.go"
Cohesion: 0.10
Nodes (46): extractFlightNumbers(), flightNumberInText(), flightNumbersEquivalent(), splitFlightDesignator(), textContainsAirport(), textContainsAny(), timeMatches(), connectingFlightQueries() (+38 more)

### Community 33 - "testing.T"
Cohesion: 0.04
Nodes (64): TestClassifyURLType_genericVsExact(), TestFlightNumbersEquivalent_leadingZeros(), TestSelectBestOffer_cheapestOTAOverAirline(), TestSelectBestOffer_conflictingCandidatesPicksCheapest(), TestSelectBestOffer_missingPrice(), TestSelectBestOffer_prefersPriceAmongSameURLType(), TestSelectBestOffer_prefersQuoteMatchingPrice(), TestSelectBestOffer_rejectsGenericSearchURL() (+56 more)

### Community 34 - "explore_cache.go"
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
Cohesion: 0.14
Nodes (25): CachedResult, createSearchSession(), createSearchSessionWithRetry(), ensureLegacyPurge(), fetchFresh(), getFromStorage(), getSearchSessionResults(), getStorage() (+17 more)

### Community 40 - "FlightDetailsModal.tsx"
Cohesion: 0.18
Nodes (20): cabinLabel(), FlightDetailsModal(), formatDuration(), layoverBetween(), legDuration(), s, openUrlInNewTab(), openUrlInNewTabOrAlert() (+12 more)

### Community 42 - "AirportAutocomplete.tsx"
Cohesion: 0.10
Nodes (40): stripStyles, styles, Variant, AIRPORT_ONLY_DICTIONARY, FULL_PLACE_DICTIONARY, getAirportDisplayName(), getAirportNameByCode(), getCityDisplayName() (+32 more)

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "destinationMood.test.ts"
Cohesion: 0.12
Nodes (11): __dirname, dist, indexHtml, indexPath, SPA_ROUTES, byCity, curatedCities, curatedUrls (+3 more)

### Community 45 - "auth.go"
Cohesion: 0.16
Nodes (34): authUserJSON(), bearerTokenFromRequest(), bootstrapAdminUser(), createAuthSession(), envFlagTrue(), handleAuthChangePassword(), handleAuthLogout(), handleAuthMe() (+26 more)

### Community 46 - "selectBookingOptionForQuote"
Cohesion: 0.40
Nodes (5): hostFromURL(), selectBookingOptionForQuote(), TestSelectBookingOptionForQuote_fallsBackWhenQuotePriceMismatch(), TestSelectBookingOptionForQuote_prefersDeepLinkHost(), TestSelectBookingOptionForQuote_prefersPriceMatch()

### Community 47 - "main"
Cohesion: 0.40
Nodes (3): main(), parse_args(), _print_unreachable_backend_hint()

### Community 53 - "session_store.go"
Cohesion: 0.19
Nodes (20): loadSearchSession(), TestLoadSearchSession_Expiry(), searchSessionTTL(), startSearchSessionCleanup(), cleanupPersistedSessions(), importLegacyJSONSessions(), initSessionStore(), loadPersistedSession() (+12 more)

### Community 54 - "Nginx Proxy Manager — fly-fix TLS checklist"
Cohesion: 0.40
Nodes (4): Nginx Proxy Manager — fly-fix TLS checklist, Reissue frontend cert (both names), Required proxy-host settings, Symptoms Chrome shows

### Community 55 - "ExploreScreen.tsx"
Cohesion: 0.08
Nodes (47): getExploreDestinations(), SearchLoadingOverlay(), AIRPORT_DICTIONARY, getAirportEntry(), ASSIGNED_URLS, BY_CODE, BY_COUNTRY, DestinationMood (+39 more)

### Community 56 - "BookingOffer"
Cohesion: 0.13
Nodes (32): isAffiliateTemplateBookingURL(), normalizedGF2OfferPrice(), publicAlternativesFromOffers(), bookingOfferInGF2Sources(), bookingOfferSameURL(), buildDualBookingResolveResponse(), collectVerifiedBookingOffers(), gf2CheckoutOffers() (+24 more)

### Community 58 - "AppIcon"
Cohesion: 0.09
Nodes (40): AppIcon(), AppIconLibrary, AppIconProps, styles, DestinationMoodBanner(), FormHeroHeader(), FormHeroHeaderProps, styles (+32 more)

### Community 61 - "ProviderResult"
Cohesion: 0.08
Nodes (22): DedupeProviderResults(), ItineraryFingerprint(), mergeSelfTransfer(), uniqueStrings(), cheapestReturnLeg(), GoogleFlights2Provider, providerResultArrivalAirport(), TestCheapestReturnLeg() (+14 more)

### Community 62 - "client.ts"
Cohesion: 0.14
Nodes (12): searchAirports(), API_BASE, apiGet(), apiUrl(), isLocalHostname(), resolveApiBase(), ExploreResponse, GetExploreDestinationsParams (+4 more)

### Community 66 - "SearchLoadingOverlay.tsx"
Cohesion: 0.17
Nodes (13): getPhrasesForLanguage(), SEARCH_BUTTON_PHRASES, SEARCH_PROGRESS_PHRASES, s, SearchProgressBanner(), SearchProgressBannerProps, ExtraLeg, Props (+5 more)

### Community 67 - "GF2SearchAirports"
Cohesion: 0.22
Nodes (10): gf2MetroKey(), GF2SearchAirports(), ResolveGF2PlaceCode(), containsAll(), TestGF2SearchAirports_CityOnlyCode(), TestGF2SearchAirports_LondonParis(), TestGF2SearchAirports_SingleAirport(), TestGF2SearchAirports_SpecificAirportNotExpanded() (+2 more)

### Community 68 - "flightTimeDisplay.ts"
Cohesion: 0.24
Nodes (12): airportTimeZones, getAirportTimeZone(), fmtDur(), layoverBetween(), legDuration(), renderLeg(), flightMinutesBetween(), flightTimeToMs() (+4 more)

### Community 71 - "AuthContext.tsx"
Cohesion: 0.17
Nodes (22): authHeaders(), AuthUser, changePassword(), createUser(), deleteUser(), fetchAuthMe(), fetchUsers(), LoginResponse (+14 more)

### Community 72 - "Registry"
Cohesion: 0.28
Nodes (3): NewRegistryFromEnv(), parseProviderNames(), Registry

### Community 73 - "normalizeKiwiItem"
Cohesion: 0.11
Nodes (26): TotalStops(), TestCombineOneWayBatches(), TestCombineOneWayBatches_emptyBatch(), TestCombineOneWayBatches_openJawReturnDiversity(), TestAttachCanonicalIdentityAll_combineOneWay(), asArray(), collectCarriers(), extractKiwiLegs() (+18 more)

### Community 74 - "server_carrier_test.go"
Cohesion: 0.83
Nodes (3): makeOfferWithCarriers(), TestExtractCarrierCodes(), TestPrimaryDisplayCarrier()

### Community 75 - "time.Time"
Cohesion: 0.16
Nodes (19): minutesOfDay(), mergeExplorePriceRows(), exploreDestRow, exploreSession, FullRoundTrip, attachReturnLegKeepPrice(), ensureRoundTripLegs(), exploreDestRowsToMaps() (+11 more)

### Community 76 - "flyfix.ts"
Cohesion: 0.25
Nodes (8): apiPost(), FlyfixInsightsGroup, FlyfixIssue, FlyfixRefinedReport, FlyfixSummary, refineIssues(), RefineIssuesRequestBody, cancelSearchSession()

### Community 77 - "exchangeRates.ts"
Cohesion: 0.31
Nodes (7): useExchangeRates(), convertPrice(), CURRENCY_SYMBOLS, CurrencyCode, ensureRates(), fetchRates(), ratesToUSD

### Community 78 - "affiliate.ts"
Cohesion: 0.27
Nodes (9): AffiliateProvider, AffiliateProviderResponse, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink(), OutboundLinkResponse (+1 more)

### Community 79 - "dealsStore.ts"
Cohesion: 0.13
Nodes (16): getDealsRange(), GetDealsRangeParams, GetMonthDealsParams, DatePickerCalendar(), DatePickerCalendarProps, getNext14Dates(), getRangeStartEnd(), styles (+8 more)

### Community 81 - "FlightResultCard.tsx"
Cohesion: 0.21
Nodes (14): buildRoutePath(), c, FlightResultCard(), LegScheduleBlock(), LayoverSummary, hasMultipleAirlines(), buildLegPreviewSummary(), computeLayovers() (+6 more)

### Community 82 - "affiliate.go"
Cohesion: 0.15
Nodes (21): BuildLegAirlineDirectURL(), BuildRedirectURL(), getAffiliateID(), GetClicksSummary(), getOTAProvider(), GetSessionAndOption(), ParseOptionIndex(), RecordClick() (+13 more)

### Community 83 - "Fly-Fix UI / UX"
Cohesion: 0.15
Nodes (12): Avoid (AI-vibe tells), Checklist before shipping UI, Design north star, Fly-Fix UI / UX, Landing, Motion, Prefer, Responsive (+4 more)

### Community 84 - "TestApplySoftStrictBaggage"
Cohesion: 0.52
Nodes (6): applySoftStrictBaggage(), makeOfferWithBags(), makeOfferWithMissingBags(), TestApplySoftStrictBaggage(), TestClassifyOfferBaggage(), classifyOfferBaggage()

### Community 85 - "backend_api_contracts.md"
Cohesion: 0.18
Nodes (10): 1.1 Create Search Session, 1.2 Get Search Session Status & Results, 1.3 Cancel Search Session (Optional, MVP+), 1. Flight Search Sessions, 2.1 Get Monthly Deals, 2. Monthly Deals API, 3.1 Search Airports & Cities, 3. Airport & City Autocomplete (+2 more)

### Community 87 - "newGF2Cache"
Cohesion: 0.22
Nodes (9): classicRoundTripMissingReturn(), TestClassicRoundTripMissingReturn(), TestDoSearchWithRetry_doesNotCacheRoundTrip(), TestSearch_ignoresIncompleteClassicRTCache(), TestSearch_servesCompleteClassicRTCache(), newGF2Cache(), newGF2RateLimiter(), NewGoogleFlights2Provider() (+1 more)

### Community 88 - "booking_resolve.go"
Cohesion: 0.07
Nodes (50): acquireBookingResolveSlot(), beginInflightResolve(), bookingResolveCacheKey(), bookingResolveFailureResponse(), bookingResolveMaxConcurrentFromEnv(), cacheTTLForStatus(), canonicalItineraryForOption(), envDurationMinutes() (+42 more)

### Community 89 - "booking.ts"
Cohesion: 0.36
Nodes (8): BookingResolveRequest, BookingResolveStatus, bookingRetryDelayMs(), fetchBookingResolveOnce(), isTransientBookingFetchError(), isTransientBookingResolveResponse(), PublicBookingAlternative, resolveBookingOffer()

## Knowledge Gaps
- **321 isolated node(s):** `ClicksByProvider`, `BookingResolveRequest`, `PublicBookingAlternative`, `exploreLiveCandidate`, `flightcaptainweb` (+316 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 465 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `useTheme` to `App.tsx`, `SearchLoadingOverlay.tsx`, `ResultsScreen.tsx`, `FiltersPanel.tsx`, `package.json`, `AuthContext.tsx`, `FlightDetailsModal.tsx`, `AirportAutocomplete.tsx`, `BookingOptionsFooter.tsx`, `exchangeRates.ts`, `dealsStore.ts`, `MonthDealsScreen.tsx`, `FlightResultCard.tsx`, `ExploreScreen.tsx`, `AppIcon`, `RuntimeConfigContext.tsx`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `react-native` connect `useTheme` to `App.tsx`, `SearchLoadingOverlay.tsx`, `ResultsScreen.tsx`, `FiltersPanel.tsx`, `package.json`, `FlightDetailsModal.tsx`, `AirportAutocomplete.tsx`, `BookingOptionsFooter.tsx`, `dealsStore.ts`, `MonthDealsScreen.tsx`, `FlightResultCard.tsx`, `ExploreScreen.tsx`, `AppIcon`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Why does `useTheme()` connect `useTheme` to `App.tsx`, `ResultsScreen.tsx`, `SearchLoadingOverlay.tsx`, `FiltersPanel.tsx`, `FlightDetailsModal.tsx`, `AirportAutocomplete.tsx`, `BookingOptionsFooter.tsx`, `MonthDealsScreen.tsx`, `FlightResultCard.tsx`, `ExploreScreen.tsx`, `AppIcon`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **What connects `ClicksByProvider`, `BookingResolveRequest`, `PublicBookingAlternative` to the rest of the system?**
  _321 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `.ResolveQuotedPartnerBooking` be split into smaller, more focused modules?**
  _Cohesion score 0.14919354838709678 - nodes in this community are weakly interconnected._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05654761904761905 - nodes in this community are weakly interconnected._
- **Should `ResultsScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06604938271604938 - nodes in this community are weakly interconnected._