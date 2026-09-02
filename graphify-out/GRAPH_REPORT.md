# Graph Report - workspace  (2026-09-02)

## Corpus Check
- 217 files · ~208,641 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1832 nodes · 5112 edges · 78 communities (73 shown, 5 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 445 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f7912aef`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- googleflights2_provider.go
- RootNavigator.tsx
- ExploreScreen.tsx
- Issue
- FlightDetailsModal.tsx
- MonthDealsScreen.tsx
- dependencies
- useTheme
- Features
- auth.go
- context.Context
- booking_resolve.go
- ui/index.ts
- compilerOptions
- SearchRequest
- canonical.go
- LocaleContext.tsx
- affiliate.go
- server.go
- dealsCache.ts
- qa_runner.py
- ApiClient
- matcher_test.go
- TestResult
- ResponseValidator
- runtime_config.go
- multi_provider_test.go
- expo
- config_loader.py
- AdminRuntimeConfigPanel.tsx
- FlightResultCard.tsx
- backend_api_contracts.md
- CalendarModal.tsx
- testing.T
- ErrorBoundary
- ValidationIssue
- Backend QA Automation Tool
- AuthContext.tsx
- ProviderResult
- search.ts
- skyscanner.ts
- models.py
- DatePickerCalendar.tsx
- Fly-Fix – Frontend
- write-spa-fallbacks.mjs
- net/http.Request
- metro.config.js
- __init__.py
- flightcaptainweb
- loadSearchSession
- extractPrice
- ResultsScreen.tsx
- CanonicalItinerary
- DateRangePicker.tsx
- AppIcon.tsx
- api.ts
- VerifyCandidate
- gf2_deals.go
- client.ts
- FiltersPanel.tsx
- DynamicDestinationsFormContent.tsx
- itinerary_test.go
- SortBar.tsx
- ThemeContext.tsx
- Registry
- DraggableBottomSheet.tsx
- handleExplore
- exchangeRates.ts
- affiliate.ts
- flyfix.ts
- GoogleFlights2Provider
- ValidateBookingURL
- TestApplySoftStrictBaggage
- TestExtractCarrierCodes

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 88 edges
2. `useLocale()` - 79 edges
3. `ProviderResult` - 44 edges
4. `BookingOffer` - 40 edges
5. `MonthDealsScreen()` - 36 edges
6. `ResultsScreen()` - 35 edges
7. `resolveGF2PartnerOffers()` - 32 edges
8. `CanonicalItinerary` - 32 edges
9. `VerifyCandidate()` - 31 edges
10. `CanonicalItineraryFingerprint()` - 30 edges

## Surprising Connections (you probably didn't know these)
- `handleAffiliateOutboundLink()` --calls--> `ResolveProvider()`  [INFERRED]
  backend/server.go → backend/affiliate.go
- `handleAffiliateProvider()` --calls--> `ResolveProvider()`  [INFERRED]
  backend/server.go → backend/affiliate.go
- `handleAffiliateRedirect()` --calls--> `ResolveProvider()`  [INFERRED]
  backend/server.go → backend/affiliate.go
- `handleOutBooking()` --calls--> `ResolveProvider()`  [INFERRED]
  backend/server.go → backend/affiliate.go
- `BuildLegAirlineDirectURL()` --calls--> `marketingCarrierForLeg()`  [INFERRED]
  backend/affiliate.go → backend/booking_gf2_resolve.go

## Import Cycles
- None detected.

## Communities (78 total, 5 thin omitted)

### Community 0 - "googleflights2_provider.go"
Cohesion: 0.12
Nodes (37): AirportLocation(), TestAirportLocation_UnknownFallsBackUTC(), TestParseGF2TimeWithDateHint_AirportLocal(), TestParseGF2TimeWithDateHint_TelAviv(), TestExtractGF2PartnerBookingTokenPrefersPartnerURL(), TestExtractGF2Leg_SingleSegment_DepartArriveDiffer(), TestExtractGF2Leg_TimeOnly_NoDateHint(), TestExtractGF2Leg_TimeOnly_WithDateHint() (+29 more)

### Community 1 - "RootNavigator.tsx"
Cohesion: 0.11
Nodes (25): LandingScreen(), Nav, styles, useIsMobile(), DynamicDestinationsStack(), MonthDealsStack(), Stack, RootNavigator() (+17 more)

### Community 2 - "ExploreScreen.tsx"
Cohesion: 0.05
Nodes (94): getExploreDestinations(), useRuntimeConfig(), AIRPORT_DICTIONARY, AIRPORT_ONLY_DICTIONARY, FULL_PLACE_DICTIONARY, getAirportDisplayName(), getAirportEntry(), getAirportNameByCode() (+86 more)

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "FlightDetailsModal.tsx"
Cohesion: 0.17
Nodes (19): resolveBookingOffer(), airportTimeZones, getAirportTimeZone(), cabinLabel(), FlightDetailsModal(), formatDuration(), layoverBetween(), legDuration() (+11 more)

### Community 5 - "MonthDealsScreen.tsx"
Cohesion: 0.11
Nodes (30): buildDealsPositioningSignature(), dealBestScore(), fl, fmtDur(), formatDealDate(), hfm, HUB_AIRPORTS, layoverBetween() (+22 more)

### Community 6 - "dependencies"
Cohesion: 0.04
Nodes (44): @babel/core, expo, @expo/metro-runtime, expo-status-bar, dependencies, expo, @expo/metro-runtime, expo-status-bar (+36 more)

### Community 7 - "useTheme"
Cohesion: 0.12
Nodes (33): ClearableTextInput(), EditSearchModal(), HubRouteSummaryModal(), SearchSummaryBar(), SearchLoadingOverlay(), useAuth(), useLocale(), AdminRuntimeConfigPanel() (+25 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (33): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+25 more)

### Community 9 - "auth.go"
Cohesion: 0.19
Nodes (23): authUserJSON(), bootstrapAdminUser(), createAuthSession(), envFlagTrue(), handleAuthLogin(), handleAuthRegister(), handleAuthUsers(), initAuthStore() (+15 more)

### Community 10 - "context.Context"
Cohesion: 0.11
Nodes (34): resolveAllPartnerBookingsFromTokenWithRetry(), findBookingOptionsArray(), firstPartnerBookingOption(), firstPartnerURLInMap(), firstStringByKeys(), GoogleFlights2Provider, ResolvedPartnerBooking, hostFromURL() (+26 more)

### Community 11 - "booking_resolve.go"
Cohesion: 0.05
Nodes (115): airlineDomainForCarrier(), allocateLegQuoteAmount(), applySearchQuoteToOffer(), attachQuotedPriceMeta(), bookingMatchPriceNormalizer(), dedupeGF2PartnerOffers(), flightLegDurationMinutes(), gf2OffersHavePrice() (+107 more)

### Community 12 - "ui/index.ts"
Cohesion: 0.14
Nodes (29): BookingResolveRequest, BookingResolveResponse, BookingResolveStatus, isSafeBookingUrl(), PublicBookingAlternative, PublicBookingOffer, bookingOfferProviderLabel(), bookingOfferSubtitle() (+21 more)

### Community 13 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+15 more)

### Community 14 - "SearchRequest"
Cohesion: 0.12
Nodes (25): apifyErrorMessage(), asArray(), collectCarriers(), detectSelfTransfer(), extractKiwiLegs(), firstFloat(), firstString(), flattenKiwiItems() (+17 more)

### Community 15 - "canonical.go"
Cohesion: 0.12
Nodes (41): FlightOption, openJawOption(), TestBookingLinkModeDefaultsToGoogle(), TestBookingRouteFromSessionOption_splitOmitsReturn(), TestBuildGoogleFlightsFallbackFromParams(), TestBuildLegOrSegmentBookingURL_segment(), TestBuildOneWayLegBookingURL(), TestBuildSkyscannerPrefillURL_oneWay() (+33 more)

### Community 16 - "LocaleContext.tsx"
Cohesion: 0.17
Nodes (15): linking, RTLWrapper(), getStorage(), languageToLocale(), loadSaved(), LocaleContext, LocaleContextValue, LocaleProvider() (+7 more)

### Community 17 - "affiliate.go"
Cohesion: 0.17
Nodes (19): BuildLegAirlineDirectURL(), BuildRedirectURL(), getAffiliateID(), GetClicksSummary(), getOTAProvider(), GetSessionAndOption(), FlightOption, SearchSession (+11 more)

### Community 18 - "server.go"
Cohesion: 0.07
Nodes (58): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, Carrier, CarrierCodes, CreateSearchSessionRequest, DayDeal (+50 more)

### Community 19 - "dealsCache.ts"
Cohesion: 0.25
Nodes (15): DealsState, MonthDealsResponse, CachedDealsResults, clearPendingDealsParams(), DealsParams, dealsParamsFingerprint(), getCachedDealsResults(), getLocalStorage() (+7 more)

### Community 20 - "qa_runner.py"
Cohesion: 0.14
Nodes (13): Namespace, Path, Any, Reporting helpers for test execution results., Render terminal summary and persist machine-readable reports., Print user-friendly report to stdout., Write a JSON report and return its path., ReportWriter (+5 more)

### Community 21 - "ApiClient"
Cohesion: 0.14
Nodes (12): ApiClient, Any, HTTP client utilities for executing API test cases., Parse JSON response when possible without raising., Sleep using exponential backoff., Executes HTTP requests with retry and timing support., Close the underlying requests session., Execute one test case and return a populated result. (+4 more)

### Community 22 - "matcher_test.go"
Cohesion: 0.16
Nodes (20): floatPtr(), testConnectingTLVJFK(), TestFlightNumbersEquivalent_leadingZeros(), TestGenerateQueries_connecting(), TestGenerateQueries_direct(), TestGenerateQueries_gf2AirlineNameIdentity(), TestGenerateQueries_includesRouteDateBookQuery(), TestGenerateQueries_prioritizesEndToEndLegRoute() (+12 more)

### Community 23 - "TestResult"
Cohesion: 0.18
Nodes (8): AI and heuristic quality-control analysis for API test results., Analyze result quality with Ollama and rule-based checks., Close underlying HTTP session., Return human-readable quality notes for this result. Rule-based insights are…, ResponseAnalyzer, Stores execution data and findings for one test case., A test passes when there are no error-level issues., TestResult

### Community 24 - "ResponseValidator"
Cohesion: 0.22
Nodes (5): Any, Applies status, schema, and consistency checks., Run all checks and append issues to the result., Resolve a dotted path in a nested JSON-like payload. Supports indexes like…, ResponseValidator

### Community 25 - "runtime_config.go"
Cohesion: 0.22
Nodes (16): adminAccessConfigured(), configRangeError, adminTokenConfigured(), defaultRuntimeConfig(), errConfigOutOfRange(), getRuntimeConfig(), handleAdminRuntimeConfig(), initRuntimeConfigStore() (+8 more)

### Community 26 - "multi_provider_test.go"
Cohesion: 0.12
Nodes (17): DedupeProviderResults(), ItineraryFingerprint(), mergeSelfTransfer(), TotalStops(), uniqueStrings(), parseKiwiApifyItems(), TestApifyErrorMessage(), TestBuildActorInputSolidcodeOnly() (+9 more)

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.32
Nodes (13): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+5 more)

### Community 29 - "AdminRuntimeConfigPanel.tsx"
Cohesion: 0.18
Nodes (17): adminAuthHeaders(), fetchAdminRuntimeConfig(), fetchRuntimeConfig(), saveAdminRuntimeConfig(), setRuntimeConfigStore(), RuntimeConfigContext, RuntimeConfigContextValue, RuntimeConfigProvider() (+9 more)

### Community 30 - "FlightResultCard.tsx"
Cohesion: 0.30
Nodes (12): c, LegScheduleBlock(), FlightSegment, LayoverSummary, buildLegPreviewSummary(), computeLayovers(), formatDuration(), formatLayoverPreview() (+4 more)

### Community 31 - "backend_api_contracts.md"
Cohesion: 0.17
Nodes (11): 1.1 Create Search Session, 1.2 Get Search Session Status & Results, 1.3 Cancel Search Session (Optional, MVP+), 1. Flight Search Sessions, 2.1 Get Monthly Deals, 2. Monthly Deals API, 3.1 Search Airports & Cities, 3. Airport & City Autocomplete (+3 more)

### Community 32 - "CalendarModal.tsx"
Cohesion: 0.38
Nodes (6): buildMonthDays(), CalendarModal(), getMonthStart(), Props, styles, WEEKDAYS

### Community 33 - "testing.T"
Cohesion: 0.13
Nodes (25): TestAllocateLegQuoteAmount_splitOpenJaw(), TestAttachQuotedPriceMeta_detectsMismatch(), TestGF2PartnerOfferFromURL_acceptsHTTPS(), TestGF2PartnerOfferFromURL_rejectsUnsafe(), TestLegDeepLink_rejectsMisalignedPartnerArrays(), TestLegDeepLink_rejectsWrongAirlineDirectCheckout(), TestQuoteBindingFromOption_usesOriginalWhenEstimate(), TestQuoteBindingFromOption_usesStoredLegPrice() (+17 more)

### Community 34 - "ErrorBoundary"
Cohesion: 0.15
Nodes (4): ErrorBoundary, Props, s, State

### Community 35 - "ValidationIssue"
Cohesion: 0.18
Nodes (7): Any, Serialize nested result for report output., Represents a single validation or analysis finding., Serialize issue to dictionary., Serialize case to dictionary., Append a new issue to this result., ValidationIssue

### Community 36 - "Backend QA Automation Tool"
Cohesion: 0.18
Nodes (10): Backend QA Automation Tool, Features, If the run feels slow or “stuck”, Notes, Optional AI Setup (Ollama), Output, Project Structure, Run (+2 more)

### Community 37 - "AuthContext.tsx"
Cohesion: 0.16
Nodes (25): authHeaders(), AuthUser, changePassword(), createUser(), deleteUser(), fetchAuthMe(), fetchUsers(), LoginResponse (+17 more)

### Community 38 - "ProviderResult"
Cohesion: 0.15
Nodes (25): TestCombineOneWayBatches(), TestCombineOneWayBatches_emptyBatch(), TestCombineOneWayBatches_openJawReturnDiversity(), TestCompleteExtraLegs(), TestExtraLegsFingerprint(), TestHasExtraLegs(), cloneLegs(), CombineOneWayBatches() (+17 more)

### Community 39 - "search.ts"
Cohesion: 0.22
Nodes (17): CachedResult, createSearchSession(), createSearchSessionWithRetry(), fetchFresh(), getFromStorage(), getSearchSessionResults(), getStorage(), isTransientSearchError() (+9 more)

### Community 40 - "skyscanner.ts"
Cohesion: 0.36
Nodes (11): BookingHop, bookingHopsFromOption(), firstSeg(), isClassicRoundTripLegs(), isoDatePrefix(), isSplitBookingItinerary(), lastSeg(), legNeedsSegmentSplit() (+3 more)

### Community 41 - "models.py"
Cohesion: 0.25
Nodes (5): Core data models for the API QA runner., Set completion timestamp., Return an ISO-8601 UTC timestamp., utc_now_iso(), Validation rules for API responses.

### Community 42 - "DatePickerCalendar.tsx"
Cohesion: 0.36
Nodes (7): DatePickerCalendar(), DatePickerCalendarProps, getNext14Dates(), getRangeStartEnd(), styles, WEEKDAYS, DayDeal

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "write-spa-fallbacks.mjs"
Cohesion: 0.33
Nodes (5): __dirname, dist, indexHtml, indexPath, SPA_ROUTES

### Community 45 - "net/http.Request"
Cohesion: 0.22
Nodes (26): RecordClick(), bearerTokenFromRequest(), handleAuthChangePassword(), handleAuthLogout(), handleAuthMe(), isAdminRequest(), requireAdminUser(), userFromRequest() (+18 more)

### Community 53 - "loadSearchSession"
Cohesion: 0.22
Nodes (22): loadSearchSession(), TestLoadSearchSession_Expiry(), searchSessionTTL(), startSearchSessionCleanup(), cleanupPersistedSessions(), SearchSessionResultsResponse, importLegacyJSONSessions(), initSessionStore() (+14 more)

### Community 55 - "ResultsScreen.tsx"
Cohesion: 0.10
Nodes (29): defaultParams, DynamicDestinationsScreen(), Nav, styles, CheaperCitiesOption, Props, s, bestScore() (+21 more)

### Community 56 - "CanonicalItinerary"
Cohesion: 0.05
Nodes (74): corpusText(), domainFromURL(), extractFlightNumbers(), flightNumberInText(), flightNumbersEquivalent(), splitFlightDesignator(), textContainsAirport(), textContainsAny() (+66 more)

### Community 57 - "DateRangePicker.tsx"
Cohesion: 0.36
Nodes (8): buildMonthDays(), DateRangePicker(), DateRangePickerProps, getMonthStart(), monthStartForYmd(), parseYmdUtc(), styles, WEEKDAYS

### Community 58 - "AppIcon.tsx"
Cohesion: 0.11
Nodes (20): AppIcon(), AppIconLibrary, AppIconProps, styles, ClearableTextInputProps, styles, EditSearchModalProps, s (+12 more)

### Community 59 - "api.ts"
Cohesion: 0.11
Nodes (22): FiltersPanelProps, FlightDetailsModalProps, FlightResultCardProps, PositioningLegResult, defaultFilters, SearchFilters, SearchState, SortOrder (+14 more)

### Community 60 - "VerifyCandidate"
Cohesion: 0.23
Nodes (19): cfgTest(), testItineraryOS860(), TestResolver_pipeline_cheapestVerifiedOffer(), TestResolver_pipeline_exactMatch(), TestVerifyCandidate_codeshareOperatingNumber(), TestVerifyCandidate_connectingLegEndToEnd(), TestVerifyCandidate_connectingOneWrongSegment(), TestVerifyCandidate_differentPricesSameItinerary() (+11 more)

### Community 61 - "gf2_deals.go"
Cohesion: 0.08
Nodes (40): airportCoord, exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut(), getAirportCoord() (+32 more)

### Community 62 - "client.ts"
Cohesion: 0.13
Nodes (20): searchAirports(), API_BASE, apiGet(), apiRequest(), apiUrl(), isLocalHostname(), IMPORTANT: Expo/Metro statically inlines EXPO_PUBLIC_* only when accessed via, resolveApiBase() (+12 more)

### Community 65 - "FiltersPanel.tsx"
Cohesion: 0.16
Nodes (17): AIRLINE_NAMES, getAirlineName(), AIRLINE_FULL_NAMES, NOTE: This is a starter subset of IATA airlines., f, FiltersPanel(), buildRoutePath(), FlightResultCard() (+9 more)

### Community 66 - "DynamicDestinationsFormContent.tsx"
Cohesion: 0.18
Nodes (18): FormHeroHeader(), FormHeroHeaderProps, styles, formCardStyles, makeFormThemedStyles(), SearchSubmitButton(), SearchSubmitButtonProps, DynamicDestinationsFormContentProps (+10 more)

### Community 68 - "itinerary_test.go"
Cohesion: 0.19
Nodes (16): AttachCanonicalIdentity(), segTLVJFK(), TestAttachCanonicalIdentityAll_combineOneWay(), TestCanonicalItineraryFingerprint_connectingFlight(), TestCanonicalItineraryFingerprint_differentFlightsDoNotCollide(), TestCanonicalItineraryFingerprint_directFlight(), TestCanonicalItineraryFingerprint_excludesPrice(), TestCanonicalItineraryFingerprint_formattingStable() (+8 more)

### Community 69 - "SortBar.tsx"
Cohesion: 0.25
Nodes (7): KEYS, s, SortBarProps, SortOption, SortField, Chip(), styles

### Community 70 - "ThemeContext.tsx"
Cohesion: 0.09
Nodes (22): getPhrasesForLanguage(), SEARCH_BUTTON_PHRASES, SEARCH_PROGRESS_PHRASES, s, SearchProgressBanner(), SearchProgressBannerProps, ExtraLeg, Props (+14 more)

### Community 72 - "Registry"
Cohesion: 0.20
Nodes (7): MultiSearchResult, isSkippedProviderErr(), NewRegistryFromEnv(), parseProviderNames(), GoogleFlights2Provider, Provider, Registry

### Community 76 - "handleExplore"
Cohesion: 0.22
Nodes (12): exploreSessionKey(), getExploreSession(), newExploreSessionID(), putExploreSession(), startExploreSessionCleanup(), exploreSession, corsMiddleware(), fetchExchangeRates() (+4 more)

### Community 77 - "exchangeRates.ts"
Cohesion: 0.21
Nodes (12): App(), DisplayPrice(), DisplayPriceProps, useExchangeRates(), convertPrice(), CURRENCY_SYMBOLS, CurrencyCode, ensureRates() (+4 more)

### Community 78 - "affiliate.ts"
Cohesion: 0.27
Nodes (9): AffiliateProvider, AffiliateProviderResponse, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink(), OutboundLinkResponse (+1 more)

### Community 80 - "flyfix.ts"
Cohesion: 0.25
Nodes (8): apiPost(), FlyfixInsightsGroup, FlyfixIssue, FlyfixRefinedReport, FlyfixSummary, refineIssues(), RefineIssuesRequestBody, cancelSearchSession()

### Community 82 - "GoogleFlights2Provider"
Cohesion: 0.10
Nodes (19): GoogleFlights2Provider, newGF2Cache(), newGF2RateLimiter(), NewGoogleFlights2Provider(), truncateGF2(), TestIsOpenJaw(), TestResolveReturnAirports_classic(), TestResolveReturnAirports_openJaw() (+11 more)

### Community 83 - "ValidateBookingURL"
Cohesion: 0.23
Nodes (12): classifyURLType(), TestClassifyURLType_genericVsExact(), IsCheckoutBookingURL(), IsNonBookableDomain(), TestIsCheckoutBookingURL_rejectsFlightSearchPages(), TestIsNonBookableDomain_blocksFlightRadar(), TestValidateBookingURL_acceptsHTTPS(), TestValidateBookingURL_rejectsEmpty() (+4 more)

### Community 84 - "TestApplySoftStrictBaggage"
Cohesion: 0.52
Nodes (6): applySoftStrictBaggage(), makeOfferWithBags(), makeOfferWithMissingBags(), TestApplySoftStrictBaggage(), TestClassifyOfferBaggage(), classifyOfferBaggage()

### Community 86 - "TestExtractCarrierCodes"
Cohesion: 0.83
Nodes (3): makeOfferWithCarriers(), TestExtractCarrierCodes(), TestPrimaryDisplayCarrier()

## Knowledge Gaps
- **286 isolated node(s):** `ClicksByProvider`, `BookingResolveRequest`, `PublicBookingAlternative`, `exploreLiveCandidate`, `flightcaptainweb` (+281 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `CanonicalItinerary` connect `CanonicalItinerary` to `ProviderResult`, `context.Context`, `booking_resolve.go`, `server.go`, `matcher_test.go`, `VerifyCandidate`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Why does `ProviderResult` connect `ProviderResult` to `googleflights2_provider.go`, `itinerary_test.go`, `context.Context`, `SearchRequest`, `canonical.go`, `server.go`, `GoogleFlights2Provider`, `CanonicalItinerary`, `multi_provider_test.go`, `gf2_deals.go`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Why does `useTheme()` connect `useTheme` to `FiltersPanel.tsx`, `DynamicDestinationsFormContent.tsx`, `ExploreScreen.tsx`, `FlightDetailsModal.tsx`, `AuthContext.tsx`, `ThemeContext.tsx`, `SortBar.tsx`, `RootNavigator.tsx`, `MonthDealsScreen.tsx`, `ui/index.ts`, `LocaleContext.tsx`, `ResultsScreen.tsx`, `DateRangePicker.tsx`, `AppIcon.tsx`, `AdminRuntimeConfigPanel.tsx`, `FlightResultCard.tsx`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `ClicksByProvider`, `BookingResolveRequest`, `PublicBookingAlternative` to the rest of the system?**
  _286 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `googleflights2_provider.go` be split into smaller, more focused modules?**
  _Cohesion score 0.11614401858304298 - nodes in this community are weakly interconnected._
- **Should `RootNavigator.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10695187165775401 - nodes in this community are weakly interconnected._
- **Should `ExploreScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05330564209068882 - nodes in this community are weakly interconnected._