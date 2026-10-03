# Graph Report - workspace  (2026-10-03)

## Corpus Check
- 232 files · ~220,682 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 7, .example 2, .mdc 1)

## Summary
- 2044 nodes · 6643 edges · 89 communities (75 shown, 14 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 497 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `de982397`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- context.Context
- App.tsx
- useSearchParams.ts
- Issue
- FiltersPanel.tsx
- types/index.ts
- package.json
- useTheme
- Features
- handleExplore
- FlightDetailsModal.tsx
- booking_resolve.go
- ui/index.ts
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
- GoogleFlights2Provider
- itinerary.go
- testing.T
- exploreBuildRowsAndQueue
- ValidationIssue
- Backend QA Automation Tool
- isSkippedProviderErr
- ProviderResult
- search.ts
- skyscanner.ts
- AirportAutocomplete.tsx
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
- react-native
- LocaleContext.tsx
- ExploreScreen.tsx
- time.Time
- client.ts
- itinerary_test.go
- api.ts
- FlightResultCard.tsx
- ThemeContext.tsx
- GF2SearchAirports
- AirportLocation
- SearchFormScreen.tsx
- AuthContext.tsx
- DedupeProviderResults
- normalizeKiwiItem
- server_carrier_test.go
- ErrorBoundary
- flyfix.ts
- exchangeRates.ts
- affiliate.ts
- DatePickerCalendar.tsx
- net/http.Request
- react
- affiliate.go
- ValidateBookingURL
- TestApplySoftStrictBaggage
- backend_api_contracts.md
- itineraryStops.ts
- newGF2Cache
- go_pkg_net_http

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
- `Cheaper departure cities (positioning optimizer)` --references--> `CheaperCitiesSection()`  [INFERRED]
  README.md → frontend/src/features/flight-search/components/CheaperCitiesSection.tsx
- `1.2 Get Search Session Status & Results` --references--> `FlightOption`  [INFERRED]
  backend/backend_api_contracts.md → frontend/src/types/api.ts
- `Recent enhancements` --references--> `AppIcon()`  [INFERRED]
  README.md → frontend/src/components/AppIcon.tsx
- `5. Guarantees to the Frontend` --references--> `MonetaryAmount`  [INFERRED]
  backend/backend_api_contracts.md → frontend/src/types/api.ts
- `5. Guarantees to the Frontend` --references--> `AirportLike`  [INFERRED]
  backend/backend_api_contracts.md → frontend/src/types/api.ts

## Import Cycles
- None detected.

## Communities (89 total, 14 thin omitted)

### Community 0 - "context.Context"
Cohesion: 0.15
Nodes (24): resolveAllPartnerBookingsFromTokenWithRetry(), findBookingOptionsArray(), firstPartnerBookingOption(), firstPartnerURLInMap(), firstStringByKeys(), GoogleFlights2Provider, ResolvedPartnerBooking, isPartnerBookingList() (+16 more)

### Community 1 - "App.tsx"
Cohesion: 0.08
Nodes (37): App(), linking, RTLWrapper(), LandingScreen(), Nav, styles, DynamicDestinationsStack(), Stack (+29 more)

### Community 2 - "useSearchParams.ts"
Cohesion: 0.12
Nodes (30): buildSearchString(), getParam(), getParams(), isWeb(), parseSearchParamsFromUrl(), SearchUrlState, updateSearchUrl(), useSearchParams() (+22 more)

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "FiltersPanel.tsx"
Cohesion: 0.24
Nodes (12): AIRLINE_NAMES, getAirlineName(), resolveAirlineLabel(), AIRLINE_FULL_NAMES, f, FiltersPanel(), FiltersPanelProps, SearchFilters (+4 more)

### Community 5 - "types/index.ts"
Cohesion: 0.15
Nodes (15): SortBarProps, clampDealsMonth(), dealsActions, DealsSortField, DealsState, getMinimumAllowedDealsYearMonth(), now, useDealsStore (+7 more)

### Community 6 - "package.json"
Cohesion: 0.05
Nodes (39): config, { getDefaultConfig }, dependencies, expo, @expo/metro-runtime, expo-status-bar, react, react-dom (+31 more)

### Community 7 - "useTheme"
Cohesion: 0.12
Nodes (35): ClearableTextInput(), ClearableTextInputProps, styles, useAuth(), useLocale(), useRuntimeConfig(), useRuntimeConfigActions(), AdminRuntimeConfigPanel() (+27 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (32): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+24 more)

### Community 9 - "handleExplore"
Cohesion: 0.18
Nodes (10): exploreSessionKey(), getExploreSession(), newExploreSessionID(), putExploreSession(), startExploreSessionCleanup(), corsMiddleware(), fetchExchangeRates(), handleExplore() (+2 more)

### Community 10 - "FlightDetailsModal.tsx"
Cohesion: 0.15
Nodes (22): airportTimeZones, getAirportTimeZone(), cabinLabel(), FlightDetailsModal(), formatDuration(), layoverBetween(), legDuration(), s (+14 more)

### Community 11 - "booking_resolve.go"
Cohesion: 0.08
Nodes (51): acquireBookingResolveSlot(), beginInflightResolve(), bookingOfferInGF2Sources(), bookingOfferSameURL(), bookingResolveCacheKey(), bookingResolveFailureResponse(), bookingResolveMaxConcurrentFromEnv(), cacheTTLForStatus() (+43 more)

### Community 12 - "ui/index.ts"
Cohesion: 0.12
Nodes (38): BookingResolveRequest, BookingResolveResponse, BookingResolveStatus, bookingRetryDelayMs(), fetchBookingResolveOnce(), isSafeBookingUrl(), isTransientBookingFetchError(), isTransientBookingResolveResponse() (+30 more)

### Community 13 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 14 - "KiwiApifyProvider"
Cohesion: 0.16
Nodes (8): apifyErrorMessage(), flattenKiwiItems(), NewKiwiApifyProvider(), stringField(), truncateStr(), KiwiApifyProvider, kiwiCache, kiwiCacheEntry

### Community 15 - "canonical_booking_test.go"
Cohesion: 0.11
Nodes (30): openJawOption(), TestBookingLinkModeDefaultsToGoogle(), TestBookingRouteFromSessionOption_splitOmitsReturn(), TestBuildGoogleFlightsFallbackFromParams(), TestBuildLegOrSegmentBookingURL_segment(), TestBuildOneWayLegBookingURL(), TestBuildSkyscannerPrefillURL_oneWay(), TestBuildSkyscannerPrefillURL_roundTrip() (+22 more)

### Community 16 - "MonthDealsScreen.tsx"
Cohesion: 0.07
Nodes (42): EditSearchModal(), EditSearchModalProps, s, s, SearchSummaryBar(), SearchSummaryBarProps, CheaperCitiesOption, CheaperCitiesSection() (+34 more)

### Community 17 - "googleflights2_provider.go"
Cohesion: 0.14
Nodes (36): TestParseGF2TimeWithDateHint_AirportLocal(), TestExtractGF2BookingToken(), TestExtractGF2BookingURL(), TestBuildGF2ResultFromItinerary_FlatFormat(), TestParseGF2Response_AttachesFlatReturnFlights(), TestParseGF2Response_RapidAPIFlatTopFlights(), TestExtractGF2Leg_TimeOnly_NoDateHint(), TestExtractGF2SegmentFromFlight_CodeOnlyHasNoName() (+28 more)

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
Cohesion: 0.19
Nodes (18): adminAccessConfigured(), isAdminRequest(), configRangeError, adminTokenConfigured(), adminTokenFromHeader(), defaultRuntimeConfig(), errConfigOutOfRange(), getRuntimeConfig() (+10 more)

### Community 26 - "booking_gf2_resolve.go"
Cohesion: 0.10
Nodes (40): allocateLegQuoteAmount(), applySearchQuoteToOffer(), attachQuotedPriceMeta(), dedupeGF2PartnerOffers(), flightLegDurationMinutes(), gf2OffersHavePrice(), gf2PartnerOfferFromQuoteURL(), gf2PartnerOfferFromResolved() (+32 more)

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
Cohesion: 0.13
Nodes (12): SelectCheapestResolvedPartner(), TestSelectCheapestResolvedPartner(), GoogleFlights2Provider, truncateGF2(), TestSanitizeStandardSearchRequest(), SearchRequest, HasExtraLegs(), IsOpenJaw() (+4 more)

### Community 32 - "itinerary.go"
Cohesion: 0.09
Nodes (47): extractFlightNumbers(), flightNumberInText(), flightNumbersEquivalent(), splitFlightDesignator(), textContainsAirport(), textContainsAny(), timeMatches(), connectingFlightQueries() (+39 more)

### Community 33 - "testing.T"
Cohesion: 0.06
Nodes (43): TestClassifyURLType_genericVsExact(), TestFlightNumbersEquivalent_leadingZeros(), TestSelectBestOffer_cheapestOTAOverAirline(), TestSelectBestOffer_conflictingCandidatesPicksCheapest(), TestSelectBestOffer_missingPrice(), TestSelectBestOffer_prefersPriceAmongSameURLType(), TestSelectBestOffer_prefersQuoteMatchingPrice(), TestSelectBestOffer_rejectsGenericSearchURL() (+35 more)

### Community 34 - "exploreBuildRowsAndQueue"
Cohesion: 0.12
Nodes (16): airportCoord, exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut(), getAirportCoord() (+8 more)

### Community 36 - "Backend QA Automation Tool"
Cohesion: 0.18
Nodes (10): Backend QA Automation Tool, Features, If the run feels slow or “stuck”, Notes, Optional AI Setup (Ollama), Output, Project Structure, Run (+2 more)

### Community 37 - "isSkippedProviderErr"
Cohesion: 0.53
Nodes (3): MultiSearchResult, isSkippedProviderErr(), IsTransientSearchErrMsg()

### Community 38 - "ProviderResult"
Cohesion: 0.10
Nodes (32): TestCombineOneWayBatches(), TestCombineOneWayBatches_emptyBatch(), TestCombineOneWayBatches_openJawReturnDiversity(), cheapestReturnLeg(), GoogleFlights2Provider, providerResultArrivalAirport(), isTransientGF2SearchErr(), legSearchRetryable() (+24 more)

### Community 39 - "search.ts"
Cohesion: 0.15
Nodes (25): CachedResult, createSearchSession(), createSearchSessionWithRetry(), ensureLegacyPurge(), fetchFresh(), getFromStorage(), getSearchSessionResults(), getStorage() (+17 more)

### Community 40 - "skyscanner.ts"
Cohesion: 0.36
Nodes (10): BookingHop, bookingHopsFromOption(), firstSeg(), isClassicRoundTripLegs(), isoDatePrefix(), isSplitBookingItinerary(), lastSeg(), legNeedsSegmentSplit() (+2 more)

### Community 42 - "AirportAutocomplete.tsx"
Cohesion: 0.11
Nodes (37): AIRPORT_DICTIONARY, AIRPORT_ONLY_DICTIONARY, FULL_PLACE_DICTIONARY, getAirportDisplayName(), lower(), matchesQuery(), PLACE_SEARCH_LIMIT, rankResult() (+29 more)

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "write-spa-fallbacks.mjs"
Cohesion: 0.22
Nodes (5): __dirname, dist, indexHtml, indexPath, SPA_ROUTES

### Community 45 - "auth.go"
Cohesion: 0.16
Nodes (28): authUserJSON(), bearerTokenFromRequest(), bootstrapAdminUser(), createAuthSession(), envFlagTrue(), handleAuthChangePassword(), handleAuthLogin(), handleAuthMe() (+20 more)

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
Cohesion: 0.09
Nodes (32): DynamicDestinationsFormContentProps, defaultParams, DynamicDestinationsScreen(), Nav, styles, PassengerCabinPickerProps, ResultsSkeletonCard(), ResultsSkeletonList() (+24 more)

### Community 56 - "BookingOffer"
Cohesion: 0.17
Nodes (31): airlineDomainForCarrier(), bookingMatchPriceNormalizer(), isAffiliateTemplateBookingURL(), normalizedGF2OfferPrice(), preferAirlineDirectWhenCheaperThanMarkedUpOTA(), publicAlternativesFromOffers(), buildDualBookingResolveResponse(), collectVerifiedBookingOffers() (+23 more)

### Community 58 - "react-native"
Cohesion: 0.16
Nodes (26): AppIcon(), FormHeroHeader(), FormHeroHeaderProps, styles, formCardStyles, makeFormThemedStyles(), SearchSubmitButton(), SearchSubmitButtonProps (+18 more)

### Community 59 - "LocaleContext.tsx"
Cohesion: 0.23
Nodes (12): getStorage(), languageToLocale(), loadSaved(), LocaleContext, LocaleContextValue, LocaleProvider(), save(), VALID_CURRENCIES (+4 more)

### Community 60 - "ExploreScreen.tsx"
Cohesion: 0.12
Nodes (26): getMonthDeals(), getExploreDestinations(), c, countryFlag(), d, DestCard(), ExploreScreen(), ExploreScreenProps (+18 more)

### Community 61 - "time.Time"
Cohesion: 0.13
Nodes (23): minutesOfDay(), mergeExplorePriceRows(), exploreDestRow, exploreSession, FullRoundTrip, attachReturnLegKeepPrice(), ensureRoundTripLegs(), exploreDestRowsToMaps() (+15 more)

### Community 62 - "client.ts"
Cohesion: 0.11
Nodes (17): searchAirports(), API_BASE, apiGet(), apiUrl(), isLocalHostname(), resolveApiBase(), getDealsRange(), GetDealsRangeParams (+9 more)

### Community 63 - "itinerary_test.go"
Cohesion: 0.19
Nodes (16): AttachCanonicalIdentity(), segTLVJFK(), TestCanonicalItineraryFingerprint_connectingFlight(), TestCanonicalItineraryFingerprint_differentFlightsDoNotCollide(), TestCanonicalItineraryFingerprint_directFlight(), TestCanonicalItineraryFingerprint_excludesPrice(), TestCanonicalItineraryFingerprint_formattingStable(), TestCanonicalItineraryFingerprint_gf2AirlineNameStable() (+8 more)

### Community 64 - "api.ts"
Cohesion: 0.13
Nodes (20): 5. Guarantees to the Frontend, FlightDetailsModalProps, FlightResultCardProps, PositioningLegResult, SearchState, AirportCityType, AirportLike, BaggageClass (+12 more)

### Community 65 - "FlightResultCard.tsx"
Cohesion: 0.20
Nodes (15): buildRoutePath(), c, FlightResultCard(), LegScheduleBlock(), LayoverSummary, hasMultipleAirlines(), getDisplayPrice(), buildLegPreviewSummary() (+7 more)

### Community 66 - "ThemeContext.tsx"
Cohesion: 0.10
Nodes (22): getPhrasesForLanguage(), SEARCH_BUTTON_PHRASES, SEARCH_PROGRESS_PHRASES, s, SearchProgressBanner(), SearchProgressBannerProps, ExtraLeg, Props (+14 more)

### Community 67 - "GF2SearchAirports"
Cohesion: 0.22
Nodes (10): gf2MetroKey(), GF2SearchAirports(), ResolveGF2PlaceCode(), containsAll(), TestGF2SearchAirports_CityOnlyCode(), TestGF2SearchAirports_LondonParis(), TestGF2SearchAirports_SingleAirport(), TestGF2SearchAirports_SpecificAirportNotExpanded() (+2 more)

### Community 68 - "AirportLocation"
Cohesion: 0.11
Nodes (19): AirportLocation(), TestAirportLocation_UnknownFallsBackUTC(), TestParseGF2TimeWithDateHint_TelAviv(), TestParseGF2TimeWithDateHint_ZSuffixWallClock(), TestParseGF2Time_EuropeanDateFormat(), TestExtractGF2Leg_SingleSegment_DepartArriveDiffer(), TestExtractGF2Leg_TimeOnly_WithDateHint(), TestParseGF2Time_AcceptsFullDateTime() (+11 more)

### Community 69 - "SearchFormScreen.tsx"
Cohesion: 0.11
Nodes (27): DestinationMoodBanner(), styles, Variant, getAirportEntry(), getAirportNameByCode(), getCityDisplayName(), BY_CODE, BY_COUNTRY (+19 more)

### Community 71 - "AuthContext.tsx"
Cohesion: 0.17
Nodes (22): authHeaders(), AuthUser, changePassword(), createUser(), deleteUser(), fetchAuthMe(), fetchUsers(), LoginResponse (+14 more)

### Community 72 - "DedupeProviderResults"
Cohesion: 0.15
Nodes (7): DedupeProviderResults(), ItineraryFingerprint(), mergeSelfTransfer(), uniqueStrings(), TestDedupeKeepsCheaper(), TestItineraryFingerprintStable(), Registry

### Community 73 - "normalizeKiwiItem"
Cohesion: 0.20
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
Cohesion: 0.14
Nodes (13): DisplayPrice(), DisplayPriceProps, HubRouteLeg, HubRouteSummaryModal(), HubRouteSummaryModalProps, s, useExchangeRates(), convertPrice() (+5 more)

### Community 78 - "affiliate.ts"
Cohesion: 0.27
Nodes (9): AffiliateProvider, AffiliateProviderResponse, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink(), OutboundLinkResponse (+1 more)

### Community 79 - "DatePickerCalendar.tsx"
Cohesion: 0.27
Nodes (7): DatePickerCalendar(), DatePickerCalendarProps, getNext14Dates(), getRangeStartEnd(), styles, WEEKDAYS, DayDeal

### Community 80 - "net/http.Request"
Cohesion: 0.23
Nodes (21): GetSessionAndOption(), RecordClick(), handleAuthLogout(), normalizeProviderBookingURL(), handleAdminVerify(), handleGetRuntimeConfig(), handleFlyFixRefineIssues(), handleAffiliateClicksSummary() (+13 more)

### Community 81 - "react"
Cohesion: 0.09
Nodes (22): AppIconLibrary, AppIconProps, styles, styles, getSvgMarkup(), getWebIconSvgDataUri(), hasWebSvgFallback(), LOCAL_ICON_NAMES (+14 more)

### Community 82 - "affiliate.go"
Cohesion: 0.19
Nodes (14): BuildLegAirlineDirectURL(), BuildRedirectURL(), getAffiliateID(), GetClicksSummary(), getOTAProvider(), ParseOptionIndex(), ResolveProvider(), stripEmptyQueryParams() (+6 more)

### Community 83 - "ValidateBookingURL"
Cohesion: 0.22
Nodes (12): gf2CheckoutOffers(), classifyURLType(), IsCheckoutBookingURL(), IsNonBookableDomain(), TestIsCheckoutBookingURL_rejectsFlightSearchPages(), TestIsNonBookableDomain_blocksFlightRadar(), TestValidateBookingURL_acceptsHTTPS(), TestValidateBookingURL_rejectsEmpty() (+4 more)

### Community 84 - "TestApplySoftStrictBaggage"
Cohesion: 0.52
Nodes (6): applySoftStrictBaggage(), makeOfferWithBags(), makeOfferWithMissingBags(), TestApplySoftStrictBaggage(), TestClassifyOfferBaggage(), classifyOfferBaggage()

### Community 85 - "backend_api_contracts.md"
Cohesion: 0.18
Nodes (10): 1.1 Create Search Session, 1.2 Get Search Session Status & Results, 1.3 Cancel Search Session (Optional, MVP+), 1. Flight Search Sessions, 2.1 Get Monthly Deals, 2. Monthly Deals API, 3.1 Search Airports & Cities, 3. Airport & City Autocomplete (+2 more)

### Community 86 - "itineraryStops.ts"
Cohesion: 0.48
Nodes (5): countByStopsFilter(), matchesStopsFilter(), maxStopsPerLeg(), stopsPerLeg(), totalStops()

### Community 87 - "newGF2Cache"
Cohesion: 0.29
Nodes (7): classicRoundTripMissingReturn(), TestClassicRoundTripMissingReturn(), TestDoSearchWithRetry_doesNotCacheRoundTrip(), TestSearch_ignoresIncompleteClassicRTCache(), TestSearch_servesCompleteClassicRTCache(), newGF2Cache(), TestSearchLegCached_usesCache()

## Knowledge Gaps
- **307 isolated node(s):** `ClicksByProvider`, `BookingResolveRequest`, `PublicBookingAlternative`, `exploreLiveCandidate`, `flightcaptainweb` (+302 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 449 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `App.tsx`, `useSearchParams.ts`, `FiltersPanel.tsx`, `package.json`, `useTheme`, `FlightDetailsModal.tsx`, `ui/index.ts`, `MonthDealsScreen.tsx`, `RuntimeConfigContext.tsx`, `AirportAutocomplete.tsx`, `ResultsScreen.tsx`, `react-native`, `LocaleContext.tsx`, `ExploreScreen.tsx`, `FlightResultCard.tsx`, `ThemeContext.tsx`, `SearchFormScreen.tsx`, `AuthContext.tsx`, `ErrorBoundary`, `exchangeRates.ts`, `DatePickerCalendar.tsx`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `react-native` connect `react-native` to `App.tsx`, `ThemeContext.tsx`, `FlightResultCard.tsx`, `FiltersPanel.tsx`, `SearchFormScreen.tsx`, `package.json`, `useTheme`, `AirportAutocomplete.tsx`, `ErrorBoundary`, `FlightDetailsModal.tsx`, `exchangeRates.ts`, `ui/index.ts`, `DatePickerCalendar.tsx`, `MonthDealsScreen.tsx`, `react`, `ResultsScreen.tsx`, `ExploreScreen.tsx`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Why does `useTheme()` connect `useTheme` to `FlightResultCard.tsx`, `ThemeContext.tsx`, `App.tsx`, `FiltersPanel.tsx`, `SearchFormScreen.tsx`, `AirportAutocomplete.tsx`, `FlightDetailsModal.tsx`, `ui/index.ts`, `exchangeRates.ts`, `MonthDealsScreen.tsx`, `react`, `ResultsScreen.tsx`, `react-native`, `ExploreScreen.tsx`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **What connects `ClicksByProvider`, `BookingResolveRequest`, `PublicBookingAlternative` to the rest of the system?**
  _307 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `context.Context` be split into smaller, more focused modules?**
  _Cohesion score 0.1495798319327731 - nodes in this community are weakly interconnected._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08421985815602837 - nodes in this community are weakly interconnected._
- **Should `useSearchParams.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12063492063492064 - nodes in this community are weakly interconnected._