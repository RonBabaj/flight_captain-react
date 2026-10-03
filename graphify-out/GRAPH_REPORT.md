# Graph Report - workspace  (2026-10-03)

## Corpus Check
- 233 files · ~221,487 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: (none) 7, .mdc 2, .example 2)

## Summary
- 2057 nodes · 6654 edges · 92 communities (78 shown, 14 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 499 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a4c0166e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- .ResolveQuotedPartnerBooking
- RootNavigator.tsx
- useSearchParams.ts
- Issue
- FlightDetailsModal.tsx
- dealsCache.ts
- package.json
- useTheme
- Features
- auth_test.go
- AirportAutocomplete.tsx
- booking_resolve.go
- BookingOptionsFooter.tsx
- compilerOptions
- KiwiApifyProvider
- canonical_booking_test.go
- MonthDealsScreen.tsx
- googleflights2_provider.go
- server.go
- kiwi_apify_provider.go
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
- ProviderResult
- itinerary.go
- testing.T
- exploreBuildRowsAndQueue
- ValidationIssue
- Backend QA Automation Tool
- isSkippedProviderErr
- providers.go
- search.ts
- skyscanner.ts
- placeSearch.ts
- Fly-Fix – Frontend
- write-spa-fallbacks.mjs
- auth.go
- selectBookingOptionForQuote
- main
- flightcaptainweb
- session_store.go
- Nginx Proxy Manager — fly-fix TLS checklist
- ResultsScreen.tsx
- BookingOffer
- .finalize
- react-native
- App.tsx
- ExploreScreen.tsx
- context.Context
- client.ts
- itinerary_test.go
- api.ts
- dependencies
- ThemeContext.tsx
- GF2SearchAirports
- AirportLocation
- TopNavMenu.tsx
- AuthContext.tsx
- Registry
- normalizeKiwiItem
- server_carrier_test.go
- ErrorBoundary
- flyfix.ts
- exchangeRates.ts
- affiliate.ts
- DatePickerCalendar.tsx
- data/airports.ts
- CalendarModal.tsx
- affiliate.go
- Fly-Fix UI / UX
- TestApplySoftStrictBaggage
- backend_api_contracts.md
- destinationMood.ts
- newGF2Cache
- booking_resolve_test.go
- DraggableBottomSheet.tsx
- explore.ts
- scripts

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

## Communities (92 total, 14 thin omitted)

### Community 0 - ".ResolveQuotedPartnerBooking"
Cohesion: 0.13
Nodes (25): findBookingOptionsArray(), firstPartnerBookingOption(), firstPartnerURLInMap(), firstStringByKeys(), GoogleFlights2Provider, ResolvedPartnerBooking, isPartnerBookingList(), parseGF2BookingOptions() (+17 more)

### Community 1 - "RootNavigator.tsx"
Cohesion: 0.20
Nodes (15): DynamicDestinationsStack(), Stack, MonthDealsStack(), Stack, Stack, SearchStack(), Stack, DynamicDestinationsStackParamList (+7 more)

### Community 2 - "useSearchParams.ts"
Cohesion: 0.11
Nodes (33): buildSearchString(), getParam(), getParams(), isWeb(), parseSearchParamsFromUrl(), SearchUrlState, updateSearchUrl(), useSearchParams() (+25 more)

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "FlightDetailsModal.tsx"
Cohesion: 0.07
Nodes (52): AIRLINE_NAMES, getAirlineName(), resolveAirlineLabel(), AIRLINE_FULL_NAMES, airportTimeZones, getAirportTimeZone(), f, FiltersPanel() (+44 more)

### Community 5 - "dealsCache.ts"
Cohesion: 0.25
Nodes (15): DealsState, MonthDealsResponse, CachedDealsResults, clearPendingDealsParams(), DealsParams, dealsParamsFingerprint(), getCachedDealsResults(), getLocalStorage() (+7 more)

### Community 6 - "package.json"
Cohesion: 0.10
Nodes (19): config, { getDefaultConfig }, devDependencies, @babel/core, @types/react, typescript, main, name (+11 more)

### Community 7 - "useTheme"
Cohesion: 0.08
Nodes (51): ClearableTextInput(), ClearableTextInputProps, styles, EditSearchModalProps, s, s, SearchSummaryBarProps, useAuth() (+43 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (32): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+24 more)

### Community 9 - "auth_test.go"
Cohesion: 0.14
Nodes (19): initAuthStore(), initTestAuthDB(), randomTestPassword(), TestAuthLoginAndChangePassword(), TestAuthRegister(), TestAuthUserManagement(), TestBootstrapAdminPasswordSync(), TestBootstrapAdminUser() (+11 more)

### Community 10 - "AirportAutocomplete.tsx"
Cohesion: 0.29
Nodes (12): resolveDestinationMood(), AirportAutocomplete(), AirportAutocompleteProps, CountrySelectMode, styles, isCountryDestination(), makeCountryDestination(), parseCountryDestination() (+4 more)

### Community 11 - "booking_resolve.go"
Cohesion: 0.11
Nodes (34): acquireBookingResolveSlot(), beginInflightResolve(), bookingOfferInGF2Sources(), bookingOfferSameURL(), bookingResolveCacheKey(), bookingResolveFailureResponse(), bookingResolveMaxConcurrentFromEnv(), cacheTTLForStatus() (+26 more)

### Community 12 - "BookingOptionsFooter.tsx"
Cohesion: 0.11
Nodes (39): BookingResolveRequest, BookingResolveResponse, BookingResolveStatus, bookingRetryDelayMs(), fetchBookingResolveOnce(), isSafeBookingUrl(), isTransientBookingFetchError(), isTransientBookingResolveResponse() (+31 more)

### Community 13 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 14 - "KiwiApifyProvider"
Cohesion: 0.13
Nodes (11): apifyErrorMessage(), flattenKiwiItems(), NewKiwiApifyProvider(), stringField(), truncateStr(), TestApifyErrorMessage(), gf2Cache, gf2CacheEntry (+3 more)

### Community 15 - "canonical_booking_test.go"
Cohesion: 0.11
Nodes (30): openJawOption(), TestBookingLinkModeDefaultsToGoogle(), TestBookingRouteFromSessionOption_splitOmitsReturn(), TestBuildGoogleFlightsFallbackFromParams(), TestBuildLegOrSegmentBookingURL_segment(), TestBuildOneWayLegBookingURL(), TestBuildSkyscannerPrefillURL_oneWay(), TestBuildSkyscannerPrefillURL_roundTrip() (+22 more)

### Community 16 - "MonthDealsScreen.tsx"
Cohesion: 0.05
Nodes (56): getFlightDetails(), DisplayPrice(), DisplayPriceProps, EditSearchModal(), HubRouteLeg, HubRouteSummaryModal(), HubRouteSummaryModalProps, s (+48 more)

### Community 17 - "googleflights2_provider.go"
Cohesion: 0.16
Nodes (33): TestParseGF2TimeWithDateHint_AirportLocal(), TestExtractGF2BookingURL(), TestBuildGF2ResultFromItinerary_FlatFormat(), TestParseGF2Response_AttachesFlatReturnFlights(), TestExtractGF2SegmentFromFlight_CodeOnlyHasNoName(), TestExtractGF2SegmentFromFlight_PreservesAirlineName(), buildGF2ResultFromItinerary(), extractGF2BookingToken() (+25 more)

### Community 18 - "server.go"
Cohesion: 0.06
Nodes (60): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, CanonicalFingerprint(), Carrier, CarrierCodes, CreateSearchSessionRequest (+52 more)

### Community 19 - "kiwi_apify_provider.go"
Cohesion: 0.28
Nodes (3): exploreLiveCandidate, gf2ExploreResolveDeps(), outboundDatesForMonthBookable()

### Community 22 - "matcher_test.go"
Cohesion: 0.16
Nodes (31): extractPrice(), cfgTest(), floatPtr(), testConnectingTLVJFK(), TestExtractPrice_euroPrefixNotArrivalTime(), TestGenerateQueries_connecting(), TestGenerateQueries_direct(), TestGenerateQueries_gf2AirlineNameIdentity() (+23 more)

### Community 25 - "runtime_config.go"
Cohesion: 0.24
Nodes (13): configRangeError, defaultRuntimeConfig(), errConfigOutOfRange(), getRuntimeConfig(), initRuntimeConfigStore(), persistRuntimeConfigLocked(), setRuntimeConfig(), TestSetRuntimeConfigPersists() (+5 more)

### Community 26 - "booking_gf2_resolve.go"
Cohesion: 0.09
Nodes (43): airlineDomainForCarrier(), allocateLegQuoteAmount(), applySearchQuoteToOffer(), attachQuotedPriceMeta(), dedupeGF2PartnerOffers(), flightLegDurationMinutes(), gf2OffersHavePrice(), gf2PartnerOfferFromQuoteURL() (+35 more)

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
Cohesion: 0.13
Nodes (20): defaultBookingMatchRunner(), corpusText(), MatchItinerary(), NewResolver(), collectSerpAPIResultMaps(), DefaultConfig(), envInt(), NewPageFetcher() (+12 more)

### Community 31 - "ProviderResult"
Cohesion: 0.13
Nodes (20): DedupeProviderResults(), ItineraryFingerprint(), mergeSelfTransfer(), uniqueStrings(), cheapestReturnLeg(), GoogleFlights2Provider, providerResultArrivalAirport(), legSearchRetryable() (+12 more)

### Community 32 - "itinerary.go"
Cohesion: 0.09
Nodes (48): extractFlightNumbers(), flightNumberInText(), flightNumbersEquivalent(), splitFlightDesignator(), textContainsAirport(), textContainsAny(), timeMatches(), connectingFlightQueries() (+40 more)

### Community 33 - "testing.T"
Cohesion: 0.04
Nodes (55): TestClassifyURLType_genericVsExact(), TestFlightNumbersEquivalent_leadingZeros(), TestSelectBestOffer_cheapestOTAOverAirline(), TestSelectBestOffer_conflictingCandidatesPicksCheapest(), TestSelectBestOffer_missingPrice(), TestSelectBestOffer_prefersPriceAmongSameURLType(), TestSelectBestOffer_prefersQuoteMatchingPrice(), TestSelectBestOffer_rejectsGenericSearchURL() (+47 more)

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
Cohesion: 0.14
Nodes (22): TestCombineOneWayBatches(), TestCombineOneWayBatches_emptyBatch(), TestCombineOneWayBatches_openJawReturnDiversity(), TestAttachCanonicalIdentityAll_combineOneWay(), cloneLegs(), CombineOneWayBatches(), CompleteExtraLegs(), extraLegMaxPerBatch() (+14 more)

### Community 39 - "search.ts"
Cohesion: 0.15
Nodes (25): CachedResult, createSearchSession(), createSearchSessionWithRetry(), ensureLegacyPurge(), fetchFresh(), getFromStorage(), getSearchSessionResults(), getStorage() (+17 more)

### Community 40 - "skyscanner.ts"
Cohesion: 0.36
Nodes (10): BookingHop, bookingHopsFromOption(), firstSeg(), isClassicRoundTripLegs(), isoDatePrefix(), isSplitBookingItinerary(), lastSeg(), legNeedsSegmentSplit() (+2 more)

### Community 42 - "placeSearch.ts"
Cohesion: 0.19
Nodes (18): byCode, COUNTRY_DIRECTORY, CountryEntry, getCountryDisplayName(), getCountryEntry(), CURRENCIES, LanguageCode, LANGUAGES (+10 more)

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "write-spa-fallbacks.mjs"
Cohesion: 0.22
Nodes (5): __dirname, dist, indexHtml, indexPath, SPA_ROUTES

### Community 45 - "auth.go"
Cohesion: 0.15
Nodes (37): adminAccessConfigured(), authUserJSON(), bearerTokenFromRequest(), bootstrapAdminUser(), createAuthSession(), envFlagTrue(), handleAuthChangePassword(), handleAuthLogin() (+29 more)

### Community 46 - "selectBookingOptionForQuote"
Cohesion: 0.40
Nodes (5): hostFromURL(), selectBookingOptionForQuote(), TestSelectBookingOptionForQuote_fallsBackWhenQuotePriceMismatch(), TestSelectBookingOptionForQuote_prefersDeepLinkHost(), TestSelectBookingOptionForQuote_prefersPriceMatch()

### Community 47 - "main"
Cohesion: 0.40
Nodes (3): main(), parse_args(), _print_unreachable_backend_hint()

### Community 53 - "session_store.go"
Cohesion: 0.21
Nodes (20): loadSearchSession(), TestLoadSearchSession_Expiry(), searchSessionTTL(), startSearchSessionCleanup(), cleanupPersistedSessions(), importLegacyJSONSessions(), initSessionStore(), loadPersistedSession() (+12 more)

### Community 54 - "Nginx Proxy Manager — fly-fix TLS checklist"
Cohesion: 0.40
Nodes (4): Nginx Proxy Manager — fly-fix TLS checklist, Reissue frontend cert (both names), Required proxy-host settings, Symptoms Chrome shows

### Community 55 - "ResultsScreen.tsx"
Cohesion: 0.09
Nodes (37): SearchLoadingOverlay(), defaultParams, DynamicDestinationsScreen(), Nav, styles, ResultsSkeletonCard(), ResultsSkeletonList(), sk (+29 more)

### Community 56 - "BookingOffer"
Cohesion: 0.12
Nodes (37): bookingMatchPriceNormalizer(), isAffiliateTemplateBookingURL(), normalizedGF2OfferPrice(), preferAirlineDirectWhenCheaperThanMarkedUpOTA(), publicAlternativesFromOffers(), buildDualBookingResolveResponse(), collectVerifiedBookingOffers(), filterOffersNotIn() (+29 more)

### Community 58 - "react-native"
Cohesion: 0.10
Nodes (40): AppIcon(), AppIconLibrary, AppIconProps, styles, DestinationMoodBanner(), styles, Variant, FormHeroHeader() (+32 more)

### Community 59 - "App.tsx"
Cohesion: 0.22
Nodes (12): App(), linking, RTLWrapper(), getStorage(), languageToLocale(), loadSaved(), LocaleProvider(), save() (+4 more)

### Community 60 - "ExploreScreen.tsx"
Cohesion: 0.16
Nodes (25): getAirportEntry(), getCityDisplayName(), c, countryFlag(), d, DestCard(), destinationLabelForCode(), ExploreScreen() (+17 more)

### Community 61 - "context.Context"
Cohesion: 0.13
Nodes (20): minutesOfDay(), mergeExplorePriceRows(), exploreDestRow, FullRoundTrip, attachReturnLegKeepPrice(), ensureRoundTripLegs(), exploreDestRowsToMaps(), exploreRunLiveBatch() (+12 more)

### Community 62 - "client.ts"
Cohesion: 0.16
Nodes (11): searchAirports(), API_BASE, apiGet(), apiUrl(), isLocalHostname(), resolveApiBase(), GetDealsRangeParams, getMonthDeals() (+3 more)

### Community 63 - "itinerary_test.go"
Cohesion: 0.19
Nodes (16): AttachCanonicalIdentity(), segTLVJFK(), TestCanonicalItineraryFingerprint_connectingFlight(), TestCanonicalItineraryFingerprint_differentFlightsDoNotCollide(), TestCanonicalItineraryFingerprint_directFlight(), TestCanonicalItineraryFingerprint_excludesPrice(), TestCanonicalItineraryFingerprint_formattingStable(), TestCanonicalItineraryFingerprint_gf2AirlineNameStable() (+8 more)

### Community 64 - "api.ts"
Cohesion: 0.14
Nodes (17): 5. Guarantees to the Frontend, SearchState, AirportCitySearchResponse, AirportCityType, AirportLike, ANYWHERE_CODE, BaggageClass, Carrier (+9 more)

### Community 65 - "dependencies"
Cohesion: 0.14
Nodes (14): dependencies, expo, @expo/metro-runtime, expo-status-bar, react, react-dom, react-native, react-native-safe-area-context (+6 more)

### Community 66 - "ThemeContext.tsx"
Cohesion: 0.12
Nodes (19): getPhrasesForLanguage(), SEARCH_BUTTON_PHRASES, SEARCH_PROGRESS_PHRASES, s, SearchProgressBanner(), SearchProgressBannerProps, ExtraLeg, Props (+11 more)

### Community 67 - "GF2SearchAirports"
Cohesion: 0.22
Nodes (10): gf2MetroKey(), GF2SearchAirports(), ResolveGF2PlaceCode(), containsAll(), TestGF2SearchAirports_CityOnlyCode(), TestGF2SearchAirports_LondonParis(), TestGF2SearchAirports_SingleAirport(), TestGF2SearchAirports_SpecificAirportNotExpanded() (+2 more)

### Community 68 - "AirportLocation"
Cohesion: 0.11
Nodes (19): AirportLocation(), TestAirportLocation_UnknownFallsBackUTC(), TestParseGF2TimeWithDateHint_TelAviv(), TestParseGF2TimeWithDateHint_ZSuffixWallClock(), TestParseGF2Time_EuropeanDateFormat(), TestExtractGF2Leg_SingleSegment_DepartArriveDiffer(), TestExtractGF2Leg_TimeOnly_WithDateHint(), TestParseGF2Time_AcceptsFullDateTime() (+11 more)

### Community 69 - "TopNavMenu.tsx"
Cohesion: 0.18
Nodes (15): Breakpoint, BREAKPOINTS, useBreakpoint(), useIsCompactLayout(), useIsMobile(), useWindowWidth(), widthToBreakpoint(), MobileNavRow() (+7 more)

### Community 71 - "AuthContext.tsx"
Cohesion: 0.17
Nodes (24): authHeaders(), AuthUser, changePassword(), createUser(), deleteUser(), fetchAuthMe(), fetchUsers(), LoginResponse (+16 more)

### Community 72 - "Registry"
Cohesion: 0.28
Nodes (3): NewRegistryFromEnv(), parseProviderNames(), Registry

### Community 73 - "normalizeKiwiItem"
Cohesion: 0.24
Nodes (15): asArray(), collectCarriers(), detectSelfTransfer(), extractKiwiLegs(), firstFloat(), firstString(), kiwiSegmentFromMap(), mapsToSegments() (+7 more)

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
Cohesion: 0.31
Nodes (7): useExchangeRates(), convertPrice(), CURRENCY_SYMBOLS, CurrencyCode, ensureRates(), fetchRates(), ratesToUSD

### Community 78 - "affiliate.ts"
Cohesion: 0.27
Nodes (9): AffiliateProvider, AffiliateProviderResponse, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink(), OutboundLinkResponse (+1 more)

### Community 79 - "DatePickerCalendar.tsx"
Cohesion: 0.25
Nodes (8): getDealsRange(), DatePickerCalendar(), DatePickerCalendarProps, getNext14Dates(), getRangeStartEnd(), styles, WEEKDAYS, DayDeal

### Community 80 - "data/airports.ts"
Cohesion: 0.20
Nodes (11): AIRPORT_DICTIONARY, AIRPORT_ONLY_DICTIONARY, FULL_PLACE_DICTIONARY, getAirportDisplayName(), getAirportNameByCode(), lower(), matchesQuery(), PLACE_SEARCH_LIMIT (+3 more)

### Community 81 - "CalendarModal.tsx"
Cohesion: 0.38
Nodes (6): buildMonthDays(), CalendarModal(), getMonthStart(), Props, styles, WEEKDAYS

### Community 82 - "affiliate.go"
Cohesion: 0.14
Nodes (22): BuildLegAirlineDirectURL(), BuildRedirectURL(), getAffiliateID(), GetClicksSummary(), getOTAProvider(), GetSessionAndOption(), ParseOptionIndex(), RecordClick() (+14 more)

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
Cohesion: 0.25
Nodes (5): BY_CODE, BY_COUNTRY, DestinationMood, FALLBACK, LANDING_MOOD_DESTINATIONS

### Community 87 - "newGF2Cache"
Cohesion: 0.22
Nodes (9): classicRoundTripMissingReturn(), TestClassicRoundTripMissingReturn(), TestDoSearchWithRetry_doesNotCacheRoundTrip(), TestSearch_ignoresIncompleteClassicRTCache(), TestSearch_servesCompleteClassicRTCache(), newGF2Cache(), newGF2RateLimiter(), NewGoogleFlights2Provider() (+1 more)

### Community 88 - "booking_resolve_test.go"
Cohesion: 0.14
Nodes (20): legRouteLabel(), TestCanonicalItineraryForOption_isolatesSplitLegs(), runBookingMatch(), TestHandleBookingResolve_prefillFallback(), TestHandleBookingResolve_verified(), TestIsAffiliateTemplateBookingURL(), TestRunBookingMatch_picksCheapestAmongMultipleGF2Partners(), TestRunBookingMatch_picksCheapestWebOfferOverGF2Partner() (+12 more)

### Community 90 - "explore.ts"
Cohesion: 0.33
Nodes (5): ExploreResponse, getExploreDestinations(), GetExploreDestinationsParams, DestCardProps, ExploreDestination

### Community 91 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, android, build, ios, start, web

## Knowledge Gaps
- **314 isolated node(s):** `ClicksByProvider`, `BookingResolveRequest`, `PublicBookingAlternative`, `exploreLiveCandidate`, `flightcaptainweb` (+309 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 457 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `useTheme` to `RootNavigator.tsx`, `useSearchParams.ts`, `FlightDetailsModal.tsx`, `package.json`, `AirportAutocomplete.tsx`, `BookingOptionsFooter.tsx`, `MonthDealsScreen.tsx`, `RuntimeConfigContext.tsx`, `ResultsScreen.tsx`, `react-native`, `App.tsx`, `ExploreScreen.tsx`, `ThemeContext.tsx`, `TopNavMenu.tsx`, `AuthContext.tsx`, `ErrorBoundary`, `exchangeRates.ts`, `DatePickerCalendar.tsx`, `CalendarModal.tsx`, `DraggableBottomSheet.tsx`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Why does `react-native` connect `react-native` to `ThemeContext.tsx`, `useSearchParams.ts`, `FlightDetailsModal.tsx`, `TopNavMenu.tsx`, `package.json`, `useTheme`, `AuthContext.tsx`, `AirportAutocomplete.tsx`, `ErrorBoundary`, `BookingOptionsFooter.tsx`, `DatePickerCalendar.tsx`, `MonthDealsScreen.tsx`, `CalendarModal.tsx`, `ResultsScreen.tsx`, `DraggableBottomSheet.tsx`, `App.tsx`, `ExploreScreen.tsx`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `Fly-Fix` connect `Features` to `MonthDealsScreen.tsx`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **What connects `ClicksByProvider`, `BookingResolveRequest`, `PublicBookingAlternative` to the rest of the system?**
  _314 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `.ResolveQuotedPartnerBooking` be split into smaller, more focused modules?**
  _Cohesion score 0.13109243697478992 - nodes in this community are weakly interconnected._
- **Should `useSearchParams.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1076923076923077 - nodes in this community are weakly interconnected._
- **Should `Issue` be split into smaller, more focused modules?**
  _Cohesion score 0.09988385598141696 - nodes in this community are weakly interconnected._