# Graph Report - workspace  (2026-11-20)

## Corpus Check
- 459 files · ~482,431 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 71 file(s) not represented in the graph (top: .csv 53, (none) 8, .mdc 2)

## Summary
- 5067 nodes · 12235 edges · 226 communities (186 shown, 40 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 872 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2508c5fe`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- .ResolveQuotedPartnerBooking
- time.Duration
- json
- Issue
- DesignSystemGenerator
- session_store.go
- frontend/package.json
- useTheme
- Features
- server.go
- flight-scraper/package.json
- validate_data.py
- BookingOptionsFooter.tsx
- compilerOptions
- ShadcnInstaller
- booking_resolve.go
- MonthDealsScreen.tsx
- skyscanner.ts
- ErrorBoundary
- googleflights2_provider.go
- qa_runner.py
- ApiClient
- skyscanner.js
- TestResult
- ResponseValidator
- runtime_config.go
- react-native
- expo
- config_loader.py
- auth.go
- session.js
- matcher_test.go
- CanonicalItinerary
- scripts/core.py
- explore_cache.go
- ValidationIssue
- Backend QA Automation Tool
- test-roundtrip-legs.js
- FlightDetailsModal.tsx
- search.ts
- SearchFormScreen.tsx
- types/index.ts
- Fly-Fix – Frontend
- handleBookingResolve
- CanonicalSegment
- test_cases
- design_system.py
- csv
- flightcaptainweb
- SearchRequest
- Nginx Proxy Manager — fly-fix TLS checklist
- gray
- googleflights2_provider.go
- .finalize
- GF2SearchAirports
- steps
- flyfix-api
- skyscannerParse.js
- test_design_system_mode.py
- slide_search_core.py
- bookingPrefillURL
- npm
- Tailwind CSS Utility Reference
- kiwi.js
- destinationMood.test.ts
- nginx-proxy-manager (VPS edge)
- BuildLegAirlineDirectURL
- time.Time
- .SearchAll
- AuthContext.tsx
- warm.js
- ResultsScreen.tsx
- canonical_booking_test.go
- testing.T
- .buildCacheKey
- Brand Guidelines v1.0
- test-kiwi-parse.js
- Design
- Canvas Design System
- Fly-Fix UI / UX
- TestApplySoftStrictBaggage
- backend_api_contracts.md
- ensure-edge-proxy.sh
- FlightOption
- Flight scraper (multisite)
- Prerequisites
- install-edge-proxy-cron.sh
- sync-edge-stack.sh
- re
- scrape.js
- ProviderResult
- Fly-Fix — Design System & Cursor Redesign Playbook
- server_carrier_test.go
- LocaleContext.tsx
- Form & Input Components
- auth.go
- ensure-flight-vnc.sh
- ensure-flight-chrome.sh
- ensure-scraper-proxy-forwarder.sh
- docker-entrypoint.sh
- after-reboot-flight.sh
- handleExplore
- Frontend Design
- Tailwind CSS Responsive Design
- init
- Typography Specifications
- Logo Usage Rules
- Component Specifications
- html-token-validator.py
- shadcn/ui Accessibility Patterns
- Asset Approval Checklist
- Logo AI Prompt Engineering
- Color Palette Management
- CIP Deliverable Guide
- States and Variants
- UI Styling Skill
- Workflow
- SearchLoadingOverlay.tsx
- cip/core.py
- Design System
- Tailwind CSS Customization
- spacing
- generate-slide.py
- Routing by Task Type
- shadcn/ui Theming & Customization
- TestTailwindConfigGenerator
- Asset Organization Guide
- Primary Color Meanings
- Core Logo Types
- fetch-background.py
- color
- test_relevance_evaluator.py
- TestWebStackFreshness
- 3. Logo Usage
- Brand Consistency Checklist
- CIP Mockup Prompt Engineering
- Color Semantics
- Design Principles
- Design Principles
- fontSize
- debug-skyscanner-live.js
- CIP Design Reference
- Icon Design Reference
- Copywriting Formulas
- Copywriting Formulas
- CatalogRefreshTest
- Banner Design - Multi-Format Creative Banner System
- Messaging Framework
- Brand Voice Framework
- extract-colors.cjs
- validate-asset.cjs
- Layout Patterns
- Tailwind Integration
- radius
- Layout Patterns
- TailwindConfigGenerator
- dealsCache.ts
- update.md
- Logo Design Reference
- Token Architecture
- design-tokens-starter.json
- .test_node_check_parses_generated_config
- TestDomainDetection
- TestSearchDomains
- render-html.py
- Primitive Tokens
- validate-tokens.cjs
- card
- Core Visual Elements
- inject-brand-context.cjs
- sync-brand-to-tokens.cjs
- CIP Design Style Guide
- embed-tokens.cjs
- main
- TestNativeDesktopStackFreshness
- Brand
- Slide Strategies
- Component Tokens
- generate-tokens.cjs
- button
- duration
- Slide Strategies
- TestStyleTaxonomy
- Fly-Fix Design System (Master)
- input
- ref_path
- logo/search.py
- FlightOption
- Slides Reference
- HTML Slide Template
- HTML Slide Template
- DedupeProviderResults
- Slides
- $type
- radius
- lg
- sm
- searchProgressRatio.test.ts
- padding-y
- xl
- none
- 16
- 1
- 3
- 8
- destructive
- destructive-foreground
- muted
- primary-foreground
- ring
- secondary-foreground
- slides-create.md
- create.md
- booking.md

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 120 edges
2. `useLocale()` - 106 edges
3. `react` - 84 edges
4. `react-native` - 78 edges
5. `ProviderResult` - 62 edges
6. `ResultsScreen()` - 61 edges
7. `AppIcon()` - 60 edges
8. `TailwindConfigGenerator` - 58 edges
9. `MonthDealsScreen()` - 50 edges
10. `runBookingMatch()` - 49 edges

## Surprising Connections (you probably didn't know these)
- `Cheaper departure cities (positioning optimizer)` --references--> `CheaperCitiesSection()`  [INFERRED]
  README.md → frontend/src/features/flight-search/components/CheaperCitiesSection.tsx
- `3. Core product patterns` --references--> `TopNavMenu()`  [INFERRED]
  .cursor/skills/flyfix-redesign-playbook/SKILL.md → frontend/src/navigation/TopNavMenu.tsx
- `Interaction (App)` --references--> `Button()`  [INFERRED]
  .cursor/skills/ui-ux-pro-max/SKILL.md → frontend/src/ui/Button.tsx
- `Signature` --references--> `TicketStub()`  [INFERRED]
  design-system/fly-fix/MASTER.md → frontend/src/ui/TicketStub.tsx
- `Flight scraper (multisite)` --references--> `OtaScraperProvider`  [INFERRED]
  services/flight-scraper/README.md → backend/search/ota_scraper_provider.go

## Import Cycles
- None detected.

## Communities (226 total, 40 thin omitted)

### Community 0 - ".ResolveQuotedPartnerBooking"
Cohesion: 0.12
Nodes (24): findBookingOptionsArray(), firstPartnerBookingOption(), firstPartnerURLInMap(), firstStringByKeys(), ResolvedPartnerBooking, isPartnerBookingList(), parseGF2BookingOptions(), partnerRequestTokenFromMap() (+16 more)

### Community 1 - "time.Duration"
Cohesion: 0.07
Nodes (28): budgetCfg(), durationFromEnvMin(), envTruthy(), FilterProviderNamesForBudget(), GF2EffectiveCacheTTL(), GF2EffectiveRateLimitPerMin(), GF2MetroConcurrency(), GF2SkipRoundTripEnrich() (+20 more)

### Community 2 - "json"
Cohesion: 0.05
Nodes (18): test_sync_parses_bundled_starter_template(), build_cip_prompt(), check_logo_required(), generate_cip_set(), generate_with_nano_banana(), load_env(), load_logo_image(), main() (+10 more)

### Community 3 - "Issue"
Cohesion: 0.10
Nodes (29): Issue, relPathForDisplay(), RunPlainNodeSyntaxCheck(), RunTypeScriptCheck(), truncateRunes(), filterPythonModelFieldFalsePositives(), leadingSpaceLen(), shouldDropPythonUnusedVar() (+21 more)

### Community 4 - "DesignSystemGenerator"
Cohesion: 0.06
Nodes (13): DesignSystemGenerator, apply_decision_rules(), _object_without_duplicates(), parse_decision_rules(), _validate_action(), TestReasoningMatch, read_rows(), split_values() (+5 more)

### Community 5 - "session_store.go"
Cohesion: 0.18
Nodes (22): loadSearchSession(), markSessionFailed(), publishSessionSnapshot(), TestLoadSearchSession_Expiry(), searchSessionTTL(), startSearchSessionCleanup(), cleanupPersistedSessions(), importLegacyJSONSessions() (+14 more)

### Community 6 - "frontend/package.json"
Cohesion: 0.06
Nodes (39): config, { getDefaultConfig }, dependencies, expo@~52.0.0, @expo/metro-runtime@~4.0.1, expo-status-bar@~2.0.0, react@18.3.1, react-dom@18.3.1 (+31 more)

### Community 7 - "useTheme"
Cohesion: 0.09
Nodes (55): ClearableTextInput(), useAuth(), useLocale(), AccountScreen(), styles, AdminRuntimeConfigPanel(), ConfigFieldRow(), AdminHubScreen() (+47 more)

### Community 8 - "Features"
Cohesion: 0.06
Nodes (32): AdSense & consent (CMP), Affiliate setup (optional), Backend, Booking Redirect, Cheaper departure cities (positioning optimizer), Environment, Environment, Explore (Anywhere) (+24 more)

### Community 9 - "server.go"
Cohesion: 0.07
Nodes (46): AirportCityResult, AirportCitySearchResponse, AirportCityType, AirportLike, Carrier, DayDeal, FareBreakdown, FlightDetailsResponse (+38 more)

### Community 10 - "flight-scraper/package.json"
Cohesion: 0.11
Nodes (17): express, playwright, dependencies, express@^4.21.2, playwright@^1.49.1, description, engines, node (+9 more)

### Community 11 - "validate_data.py"
Cohesion: 0.06
Nodes (43): read_rows(), TestAccessibilityGuidance, TestChartsTypographyAndIcons, TestCurrentReactGuidance, TestSemanticColors, _catalog_date(), _check_app_interface_contract(), _check_catalog_contract() (+35 more)

### Community 12 - "BookingOptionsFooter.tsx"
Cohesion: 0.08
Nodes (54): BookingResolveRequest, BookingResolveResponse, BookingResolveStatus, bookingRetryDelayMs(), fetchBookingResolveOnce(), isSafeBookingUrl(), isTransientBookingFetchError(), isTransientBookingResolveResponse() (+46 more)

### Community 13 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 14 - "ShadcnInstaller"
Cohesion: 0.05
Nodes (3): main(), ShadcnInstaller, TestShadcnInstaller

### Community 15 - "booking_resolve.go"
Cohesion: 0.05
Nodes (107): airlineDomainForCarrier(), allocateLegQuoteAmount(), applySearchQuoteToOffer(), attachQuotedPriceMeta(), bookingMatchPriceNormalizer(), dedupeGF2PartnerOffers(), fillPublicOfferSearchQuote(), flightLegDurationMinutes() (+99 more)

### Community 16 - "MonthDealsScreen.tsx"
Cohesion: 0.05
Nodes (60): CheaperCitiesOption, Props, s, KEYS, s, SortBarProps, SortOption, buildDealsPositioningSignature() (+52 more)

### Community 17 - "skyscanner.ts"
Cohesion: 0.17
Nodes (20): apiPost(), FlyfixInsightsGroup, FlyfixIssue, FlyfixRefinedReport, FlyfixSummary, refineIssues(), RefineIssuesRequestBody, BookingHop (+12 more)

### Community 18 - "ErrorBoundary"
Cohesion: 0.15
Nodes (4): ErrorBoundary, Props, s, State

### Community 19 - "googleflights2_provider.go"
Cohesion: 0.23
Nodes (8): ClicksByProvider, gf2ExploreResolveDeps(), outboundDatesForMonthBookable(), otaPartnerResolveResponse, OtaResolvedPartner, otaScraperSearchRequest, otaScraperSearchResponse, otaScraperSiteResult

### Community 22 - "skyscanner.js"
Cohesion: 0.11
Nodes (41): com, fr, req, pageLooksBlocked(), addPartner(), clickMatchingKiwiCard(), clickMatchingSkyscannerCard(), clocksFromSegments() (+33 more)

### Community 23 - "TestResult"
Cohesion: 0.18
Nodes (4): ResponseAnalyzer, main(), parse_args(), _print_unreachable_backend_hint()

### Community 25 - "runtime_config.go"
Cohesion: 0.19
Nodes (18): adminAccessConfigured(), isAdminRequest(), configRangeError, adminTokenConfigured(), adminTokenFromHeader(), defaultRuntimeConfig(), errConfigOutOfRange(), getRuntimeConfig() (+10 more)

### Community 26 - "react-native"
Cohesion: 0.04
Nodes (82): Search form (boarding-pass ticket), AppIcon(), AppIconLibrary, AppIconProps, styles, ClearableTextInputProps, styles, styles (+74 more)

### Community 27 - "expo"
Cohesion: 0.13
Nodes (14): expo, name, newArchEnabled, orientation, plugins, scheme, slug, userInterfaceStyle (+6 more)

### Community 28 - "config_loader.py"
Cohesion: 0.30
Nodes (10): _as_str(), load_test_cases(), _normalize_bool(), _normalize_dict(), _normalize_optional_int(), _normalize_status_codes(), _normalize_string_list(), _normalize_string_map() (+2 more)

### Community 29 - "auth.go"
Cohesion: 0.15
Nodes (29): GetClicksSummary(), getOTAProvider(), GetSessionAndOption(), ParseOptionIndex(), RecordClick(), ResolveProvider(), handleAuthLogout(), normalizeProviderBookingURL() (+21 more)

### Community 30 - "session.js"
Cohesion: 0.16
Nodes (19): withCdpLock(), blockHeavyResources(), getOpenPageHook(), browserPromises, { chromium, firefox }, getBrowser(), isTransientScrapeError(), pickReusablePage() (+11 more)

### Community 31 - "matcher_test.go"
Cohesion: 0.10
Nodes (45): classifyURLType(), extractPrice(), cfgTest(), floatPtr(), TestClassifyURLType_genericVsExact(), testConnectingTLVJFK(), TestExtractPrice_euroPrefixNotArrivalTime(), TestGenerateQueries_connecting() (+37 more)

### Community 32 - "CanonicalItinerary"
Cohesion: 0.11
Nodes (25): corpusText(), domainFromURL(), elapsedMs(), logMatchEvent(), countVerifiedPricedOffers(), MatchItinerary(), NewResolver(), truncateStr() (+17 more)

### Community 33 - "scripts/core.py"
Cohesion: 0.06
Nodes (31): BM25, _contains_phrase(), detect_domain(), _domain_keywords(), _exact_match_diagnostic(), _exact_row_identity(), _exact_stack_identifier(), _file_signature() (+23 more)

### Community 34 - "explore_cache.go"
Cohesion: 0.10
Nodes (19): airportCoord, exploreEstimateInCurrency(), exploreEstimateRTPriceUSD(), explorePriceCacheGet(), explorePriceCacheIsFresh(), explorePriceCacheKey(), explorePriceCachePut(), getAirportCoord() (+11 more)

### Community 36 - "Backend QA Automation Tool"
Cohesion: 0.18
Nodes (10): Backend QA Automation Tool, Features, If the run feels slow or “stuck”, Notes, Optional AI Setup (Ollama), Output, Project Structure, Run (+2 more)

### Community 37 - "test-roundtrip-legs.js"
Cohesion: 0.13
Nodes (20): a, arr, assert, b, dep, late, assert, frSegs (+12 more)

### Community 38 - "FlightDetailsModal.tsx"
Cohesion: 0.07
Nodes (60): AIRLINE_NAMES, formatAirlineFilterLabel(), getAirlineName(), resolveAirlineLabel(), AIRLINE_FULL_NAMES, airportTimeZones, getAirportTimeZone(), f (+52 more)

### Community 39 - "search.ts"
Cohesion: 0.05
Nodes (62): searchAirports(), API_BASE, apiGet(), apiRequest(), apiUrl(), isLocalHostname(), resolveApiBase(), GetDealsRangeParams (+54 more)

### Community 40 - "SearchFormScreen.tsx"
Cohesion: 0.04
Nodes (78): App(), linking, RTLWrapper(), DynamicDestinationsFormContentProps, defaultParams, DynamicDestinationsScreen(), Nav, styles (+70 more)

### Community 42 - "types/index.ts"
Cohesion: 0.06
Nodes (77): getMonthDeals(), getExploreDestinations(), AIRPORT_DICTIONARY, AIRPORT_ONLY_DICTIONARY, FULL_PLACE_DICTIONARY, getAirportDisplayName(), getAirportEntry(), getAirportNameByCode() (+69 more)

### Community 43 - "Fly-Fix – Frontend"
Cohesion: 0.29
Nodes (6): Backend URL, Fly-Fix – Frontend, Main flows, Run, Setup, Structure

### Community 44 - "handleBookingResolve"
Cohesion: 0.27
Nodes (9): AffiliateProvider, AffiliateProviderResponse, ClicksByProvider, ClicksSummaryResponse, getAffiliateProvider(), getClicksSummary(), getOutboundLink(), OutboundLinkResponse (+1 more)

### Community 45 - "CanonicalSegment"
Cohesion: 0.07
Nodes (55): TestLookupAirlineIATA_Israir(), extractFlightNumbers(), flightNumberInText(), flightNumbersEquivalent(), splitFlightDesignator(), textContainsAirport(), textContainsAny(), timeMatches() (+47 more)

### Community 46 - "test_cases"
Cohesion: 0.05
Nodes (40): departureDate, origin, byProvider, currency, error, from, items, route (+32 more)

### Community 47 - "design_system.py"
Cohesion: 0.05
Nodes (18): ansi_ljust(), _detect_page_type(), format_ascii_box(), format_markdown(), format_master_md(), format_page_override_md(), generate_design_system(), _generate_intelligent_overrides() (+10 more)

### Community 49 - "csv"
Cohesion: 0.08
Nodes (9): BM25, detect_domain(), _load_csv(), search(), search_all(), _search_csv(), read_rows(), TestTextLayoutDataContracts (+1 more)

### Community 53 - "SearchRequest"
Cohesion: 0.13
Nodes (20): truncateStr(), TestIsOpenJaw(), TestResolveReturnAirports_classic(), TestResolveReturnAirports_openJaw(), TestSanitizeStandardSearchRequest(), TestDynamicDestinationOneWayRequests_extraLegs(), TestDynamicDestinationOneWayRequests_openJaw(), TestOtaScraperProvider_openJawNoLongerSkipped() (+12 more)

### Community 54 - "Nginx Proxy Manager — fly-fix TLS checklist"
Cohesion: 0.40
Nodes (4): Nginx Proxy Manager — fly-fix TLS checklist, Reissue frontend cert (both names), Required proxy-host settings, Symptoms Chrome shows

### Community 55 - "gray"
Cohesion: 0.05
Nodes (53): $type, $value, $type, $value, $type, $value, $type, $value (+45 more)

### Community 56 - "googleflights2_provider.go"
Cohesion: 0.05
Nodes (83): minutesOfDay(), CodeshareFingerprint(), roundTimeToMinutes(), ClickRecord, AirportLocation(), TestAirportLocation_UnknownFallsBackUTC(), TestParseGF2TimeWithDateHint_AirportLocal(), TestParseGF2TimeWithDateHint_TelAviv() (+75 more)

### Community 58 - "GF2SearchAirports"
Cohesion: 0.08
Nodes (27): init(), BudgetModeEnabled(), ExploreBudgetLimits(), GF2MetroMaxAirports(), resetBudgetEnv(), TestExploreBudgetLimits_budget(), TestExploreBudgetLimits_defaultsWithoutBudget(), TestFilterProviderNamesForBudget_disablesKiwi() (+19 more)

### Community 59 - "steps"
Cohesion: 0.09
Nodes (22): runs-on, steps, jobs, deploy, name, on, push, workflow_dispatch (+14 more)

### Community 60 - "flyfix-api"
Cohesion: 0.06
Nodes (37): context, FLIGHT_SCRAPER_MAX_CONCURRENT, FLIGHT_SCRAPER_URL, PLAYWRIGHT_HEADLESS, PORT, SCRAPER_CDP_URLS, SCRAPER_PROXY_URL, SCRAPER_WARM_ON_START (+29 more)

### Community 61 - "skyscannerParse.js"
Cohesion: 0.10
Nodes (33): assert, english, firstPage, named, offers, radarOffers, req, offerTemplate() (+25 more)

### Community 62 - "test_design_system_mode.py"
Cohesion: 0.07
Nodes (14): _contrast_ratio(), _derive_dark_palette(), _filter_anti_patterns_for_mode(), _palette_is_dark(), _query_wants_dark(), _relative_luminance(), _resolve_color_mode(), _select_palette_for_mode() (+6 more)

### Community 63 - "slide_search_core.py"
Cohesion: 0.08
Nodes (17): format_context(), format_result(), main(), BM25, calculate_pattern_break(), detect_domain(), get_background_config(), get_color_for_emotion() (+9 more)

### Community 64 - "bookingPrefillURL"
Cohesion: 0.12
Nodes (28): openJawOption(), TestBookingLinkModeDefaultsToSkyscanner(), TestBookingRouteFromSessionOption_splitOmitsReturn(), TestBuildGoogleFlightsFallbackFromParams(), TestBuildLegOrSegmentBookingURL_segment(), TestBuildOneWayLegBookingURL(), TestBuildSkyscannerPrefillURL_oneWay(), TestBuildSkyscannerPrefillURL_roundTrip() (+20 more)

### Community 65 - "npm"
Cohesion: 0.17
Nodes (11): networks, proxy, container_name, image, networks, ports, restart, volumes (+3 more)

### Community 66 - "Tailwind CSS Utility Reference"
Cohesion: 0.05
Nodes (43): Arbitrary Values, Aspect Ratio, Background Colors, Border Color, Border Radius, Border Style, Border Width, Borders (+35 more)

### Community 67 - "kiwi.js"
Cohesion: 0.18
Nodes (20): assert, clearKiwiSpaState(), ensureKiwiResultsUrl(), extractFromCaptured(), extractNextData(), flattenOffers(), kiwiPathLooksCorrect(), kiwiSearchUrl() (+12 more)

### Community 68 - "destinationMood.test.ts"
Cohesion: 0.18
Nodes (9): byCity, compact, curatedCities, curatedUrls, exploreCodes, hero, resultsLike, unique (+1 more)

### Community 69 - "nginx-proxy-manager (VPS edge)"
Cohesion: 0.40
Nodes (4): Deploy sync, First-time / recovery, nginx-proxy-manager (VPS edge), On the server

### Community 70 - "BuildLegAirlineDirectURL"
Cohesion: 0.19
Nodes (11): buildCondorSearchURL(), BuildLegAirlineDirectURL(), BuildRedirectURL(), compactYYYYMMDD(), TestBuildCondorSearchURL_roundTrip(), TestBuildLegAirlineDirectURL_condor(), getAffiliateID(), TestBuildLegAirlineDirectURL_austrianHasNoUnverifiedLink() (+3 more)

### Community 71 - "time.Time"
Cohesion: 0.17
Nodes (16): exploreDestRow, FullRoundTrip, attachReturnLegKeepPrice(), ensureRoundTripLegs(), exploreDestRowsToMaps(), gf2ExploreSearchOneDestination(), gf2OneRoundTrip(), gf2SearchDealsOnDates() (+8 more)

### Community 72 - ".SearchAll"
Cohesion: 0.12
Nodes (13): TestRegistryFailureMessage_transientOutbound(), TestRegistrySearchAll_dedupeComparesInRequestedCurrency(), TestRegistrySearchAll_fastOnlySkipsScraper(), TestRegistrySearchAll_openJawGF2FailNotMaskedByKiwiSkip(), TestRegistrySearchAllPartialFailure(), TestRegistrySearchAllWithProgress(), convertResultsToCurrency(), isFastProvider() (+5 more)

### Community 73 - "AuthContext.tsx"
Cohesion: 0.11
Nodes (34): authHeaders(), AuthUser, changePassword(), createUser(), deleteUser(), fetchAuthMe(), fetchUsers(), LoginResponse (+26 more)

### Community 74 - "warm.js"
Cohesion: 0.09
Nodes (23): cdpLockBusy(), chain, DEFAULT_SITES, beginSearch(), endSearch(), isSearchBusy(), app, express (+15 more)

### Community 75 - "ResultsScreen.tsx"
Cohesion: 0.05
Nodes (69): Responsive, Results, collectTripDestinationCodes(), DestinationMoodBanner(), DestinationMoodStrip(), moodSizeForVariant(), stripStyles, styles (+61 more)

### Community 76 - "canonical_booking_test.go"
Cohesion: 0.27
Nodes (11): gf2CheckoutOffers(), IsCheckoutBookingURL(), IsNonBookableDomain(), TestIsCheckoutBookingURL_rejectsFlightSearchPages(), TestIsNonBookableDomain_blocksFlightRadar(), TestValidateBookingURL_acceptsHTTPS(), TestValidateBookingURL_rejectsEmpty(), TestValidateBookingURL_rejectsJavascript() (+3 more)

### Community 77 - "testing.T"
Cohesion: 0.04
Nodes (106): TestPickAirlineDirectOffer_fullItineraryUsesLegZeroTemplate(), TestRunBookingMatch_skyscannerSessionDualWithCondorPrefill(), TestMarketingCarrierForScopeUsesSegmentCarrier(), TestAllocateLegQuoteAmount_splitOpenJaw(), TestAttachQuotedPriceMeta_detectsMismatch(), TestGF2PartnerOfferFromURL_acceptsHTTPS(), TestGF2PartnerOfferFromURL_metaSearchIsNotVerifiedCheckout(), TestGF2PartnerOfferFromURL_rejectsUnsafe() (+98 more)

### Community 78 - ".buildCacheKey"
Cohesion: 0.16
Nodes (15): TestCompleteExtraLegs(), TestExtraLegsFingerprint(), classicRoundTripMissingReturn(), TestClassicRoundTripMissingReturn(), TestDoSearchWithRetry_doesNotCacheRoundTrip(), TestSearch_ignoresIncompleteClassicRTCache(), TestSearch_servesCompleteClassicRTCache(), newGF2Cache() (+7 more)

### Community 79 - "Brand Guidelines v1.0"
Cohesion: 0.05
Nodes (37): 1. Color Palette, 2. Typography, 3. Logo Usage, 4. Voice & Tone, 5. Imagery Guidelines, 6. Design Components, Accessibility, AI Image Generation (+29 more)

### Community 80 - "test-kiwi-parse.js"
Cohesion: 0.20
Nodes (10): assert, offers, pending, req, bookingUrlFor(), extractKiwiUmbrella(), kiwiUmbrellaSettled(), sectorSegments() (+2 more)

### Community 81 - "Design"
Cohesion: 0.06
Nodes (35): Banner Design (Built-in), Banner: Design Rules, Banner: Quick Size Reference, Banner: Top Art Styles, Banner: Workflow, CIP Design (Built-in), CIP: Generate Brief, CIP: Generate Mockups (+27 more)

### Community 82 - "Canvas Design System"
Cohesion: 0.06
Nodes (35): 1. Visual Communication First, 2. Minimal Text Integration, 3. Expert Craftsmanship, 4. Systematic Patterns, Analog Meditation, Approach, Canvas Boundaries, Canvas Design System (+27 more)

### Community 83 - "Fly-Fix UI / UX"
Cohesion: 0.22
Nodes (8): Avoid (AI-vibe tells), Checklist before shipping UI, Design north star, Fly-Fix UI / UX, Phase 0 decisions (locked), Prefer, Screen rules, Tokens (source of truth)

### Community 84 - "TestApplySoftStrictBaggage"
Cohesion: 0.52
Nodes (6): applySoftStrictBaggage(), makeOfferWithBags(), makeOfferWithMissingBags(), TestApplySoftStrictBaggage(), TestClassifyOfferBaggage(), classifyOfferBaggage()

### Community 85 - "backend_api_contracts.md"
Cohesion: 0.18
Nodes (10): 1.1 Create Search Session, 1.2 Get Search Session Status & Results, 1. Flight Search Sessions, 2.1 Get Monthly Deals, 2. Monthly Deals API, 3.1 Search Airports & Cities, 3. Airport & City Autocomplete, 4. High-Level Handler Layout (Go) (+2 more)

### Community 87 - "FlightOption"
Cohesion: 0.08
Nodes (35): CanonicalFingerprint(), TestCapOptionsKeepingVariety(), CreateSearchSessionRequest, ExtraSearchLeg, FlightOption, applyPriceNormalization(), applySoftStrictBaggageOptions(), baggageOrderString() (+27 more)

### Community 88 - "Flight scraper (multisite)"
Cohesion: 0.29
Nodes (6): Docker, Flight scraper (multisite), Residential EU proxy, Run locally, VPS (recommended): headed Chrome on `:99`, When Skyscanner returns 0 offers

### Community 89 - "Prerequisites"
Cohesion: 0.06
Nodes (34): Accessibility, Available Domains, Available Stacks, Common Rules for Professional UI, Common Sticking Points, Example Workflow, How to Use This Skill, Icons & Visual Elements (+26 more)

### Community 92 - "re"
Cohesion: 0.11
Nodes (13): apply_color(), apply_viewbox_size(), extract_svgs(), generate_batch(), generate_icon(), generate_sizes(), load_env(), main() (+5 more)

### Community 93 - "scrape.js"
Cohesion: 0.24
Nodes (13): assert, kiwi, pxSky, sky, hasCdp(), runWithSiteBudget(), scrapeAll(), scrapeSerial() (+5 more)

### Community 94 - "ProviderResult"
Cohesion: 0.15
Nodes (11): cheapestReturnLeg(), providerResultArrivalAirport(), TestCheapestReturnLeg(), GoogleFlights2Provider, legSearchRetryable(), truncateGF2(), TestOtaScraperProviderSearch(), ProviderResult (+3 more)

### Community 95 - "Fly-Fix — Design System & Cursor Redesign Playbook"
Cohesion: 0.22
Nodes (8): 1. Product and brand direction, 2. Design tokens (proposed starting values), 3. Core product patterns, 4. Motion, 5. Cursor workflow phases, 6. Non-negotiable constraints, 7. Working method, Fly-Fix — Design System & Cursor Redesign Playbook

### Community 96 - "server_carrier_test.go"
Cohesion: 0.43
Nodes (6): CarrierCodes, makeOfferWithCarriers(), TestExtractCarrierCodes(), TestPrimaryDisplayCarrier(), ExtractCarrierCodes(), PrimaryDisplayCarrier()

### Community 97 - "LocaleContext.tsx"
Cohesion: 0.15
Nodes (20): getStorage(), languageToLocale(), loadSaved(), LocaleContext, LocaleContextValue, LocaleProvider(), save(), VALID_CURRENCIES (+12 more)

### Community 98 - "Form & Input Components"
Cohesion: 0.06
Nodes (32): Accordion, Alert, Alert Dialog, Avatar, Badge, Button, Card, Checkbox (+24 more)

### Community 99 - "auth.go"
Cohesion: 0.15
Nodes (30): authUserJSON(), bearerTokenFromRequest(), bootstrapAdminUser(), createAuthSession(), envFlagTrue(), handleAuthChangePassword(), handleAuthLogin(), handleAuthMe() (+22 more)

### Community 101 - "ensure-flight-chrome.sh"
Cohesion: 0.52
Nodes (6): chrome_proxy_args(), DISPLAY, ensure_gateway_proxy(), load_scraper_proxy_env(), log(), ensure-flight-chrome.sh script

### Community 105 - "handleExplore"
Cohesion: 0.24
Nodes (9): exploreSessionKey(), getExploreSession(), newExploreSessionID(), putExploreSession(), startExploreSessionCleanup(), exploreSession, corsMiddleware(), handleExplore() (+1 more)

### Community 106 - "Frontend Design"
Cohesion: 0.25
Nodes (7): Design principles, Fly-Fix (this repo), Frontend Design, Ground your designs in the subject matter, More on writing in design, Process: plan, review against the brief, build, critique, Restraint and self-critique

### Community 107 - "Tailwind CSS Responsive Design"
Cohesion: 0.06
Nodes (32): 1. Mobile-First Design, 2. Consistent Breakpoint Usage, 3. Test at Breakpoint Boundaries, 4. Use Container for Content Width, 5. Progressive Enhancement, 6. Avoid Too Many Breakpoints, Best Practices, Breakpoint System (+24 more)

### Community 109 - "Typography Specifications"
Cohesion: 0.06
Nodes (30): Accessibility, Base System, Best Practices, Clean & Modern, Common Font Pairings, Contrast Requirements, CSS Implementation, Editorial (+22 more)

### Community 112 - "Logo Usage Rules"
Cohesion: 0.07
Nodes (28): Absolute Don'ts, Approved Backgrounds, Before Using Logo, Clear Space, Co-branding, Color Rules, Color Usage, Color Variants (+20 more)

### Community 113 - "Component Specifications"
Cohesion: 0.07
Nodes (28): Alert, Anatomy, Anatomy, Anatomy, Anatomy, Anatomy, Badge, Button (+20 more)

### Community 114 - "html-token-validator.py"
Cohesion: 0.13
Nodes (12): get_context(), is_allowed_exception(), is_allowed_rgba(), is_inside_block(), load_css_variables(), main(), print_result(), print_summary() (+4 more)

### Community 115 - "shadcn/ui Accessibility Patterns"
Cohesion: 0.07
Nodes (28): Accordion, Alert, ARIA Labels, Checkbox and Radio, Color Contrast, Command Palette Navigation, Component-Specific Patterns, Dialog/Modal Navigation (+20 more)

### Community 116 - "Asset Approval Checklist"
Cohesion: 0.08
Nodes (25): Accessibility, Archival, Asset Approval Checklist, Automation Support, Color Compliance, Common Issues & Fixes, Content Accessibility, Content Quality (+17 more)

### Community 117 - "Logo AI Prompt Engineering"
Cohesion: 0.08
Nodes (25): Common Pitfalls, Core Prompt Structure, Detailed Brief, Eco/Sustainable, Effective Keywords by Style, Fashion Brand, Healthcare, Industry-Specific Prompts (+17 more)

### Community 118 - "Color Palette Management"
Cohesion: 0.08
Nodes (24): Accessibility Requirements, Brand Compliance Validation, Checking Contrast, Color Documentation Format, Color Extraction, Color Palette Examples, Color Palette Management, Color System Structure (+16 more)

### Community 119 - "CIP Deliverable Guide"
Cohesion: 0.08
Nodes (24): Apparel, Business Card, Car/Sedan, CIP Deliverable Guide, Core Identity, Digital Assets, Email Signature, Envelope (+16 more)

### Community 120 - "States and Variants"
Cohesion: 0.08
Nodes (24): Accessibility, Accessibility Requirements, ARIA States, Color Contrast, Color Variants, Disabled States, Error Messages, Error States (+16 more)

### Community 121 - "UI Styling Skill"
Cohesion: 0.08
Nodes (24): Accessibility Patterns, Alternative: Tailwind-Only Setup, Best Practices, Common Patterns, Component Layer: shadcn/ui, Component Library Guide, Component + Styling Setup, Core Stack (+16 more)

### Community 122 - "Workflow"
Cohesion: 0.08
Nodes (23): Art Direction Styles (Reuse from Banner), Color & Contrast, Design Best Practices, HTML Design Rules, HTML Template Structure, Option A: Chrome Headless CLI (Recommended — zero dependencies), Option B: chrome-devtools skill, Option C: Playwright script (+15 more)

### Community 123 - "SearchLoadingOverlay.tsx"
Cohesion: 0.13
Nodes (19): getAlmostDonePhrase(), getPhrasesForLanguage(), pickSearchStatusPhrase(), providerPhraseMap(), SEARCH_ALMOST_DONE, SEARCH_BUTTON_ALMOST_DONE, SEARCH_BUTTON_PHRASES, SEARCH_PROGRESS_PHRASES (+11 more)

### Community 124 - "cip/core.py"
Cohesion: 0.12
Nodes (7): BM25, detect_domain(), get_cip_brief(), _load_csv(), search(), search_all(), _search_csv()

### Community 125 - "Design System"
Cohesion: 0.09
Nodes (22): Best Practices, Chart.js Integration, Command, Component Spec Pattern, Contextual Decision Flow, Decision System CSVs, Design System, Integration (+14 more)

### Community 126 - "Tailwind CSS Customization"
Cohesion: 0.09
Nodes (22): @apply Directive, Best Practices, Color Customization, Complete Tailwind Config, Configuration Examples, Content Configuration, Custom Color Palette, Custom Font Sizes (+14 more)

### Community 127 - "spacing"
Cohesion: 0.09
Nodes (22): $type, $value, $type, $value, $type, $value, $type, $value (+14 more)

### Community 128 - "generate-slide.py"
Cohesion: 0.13
Nodes (10): _e(), generate_chart_slide(), generate_cta_slide(), generate_deck(), generate_metrics_slide(), generate_problem_slide(), generate_solution_slide(), generate_testimonial_slide() (+2 more)

### Community 129 - "Routing by Task Type"
Cohesion: 0.10
Nodes (19): Banner Design Tasks, Brand Identity Tasks, Component Creation, Corporate Identity Program Tasks, Design Routing Guide, Design System Migration, Icon Design Tasks, Implementation Tasks (+11 more)

### Community 130 - "shadcn/ui Theming & Customization"
Cohesion: 0.10
Nodes (19): Base Color Presets, Best Practices, Color Customization, Color Format, Component Customization, CSS Variable System, Customize Styles, Customize Variants (+11 more)

### Community 132 - "Asset Organization Guide"
Cohesion: 0.11
Nodes (18): Asset Entry (manifest.json), Asset Organization Guide, By Campaign, By Status, By Type, Cleanup Workflow, Components, Directory Structure (+10 more)

### Community 133 - "Primary Color Meanings"
Cohesion: 0.11
Nodes (18): Accessibility Considerations, Analogous, Black, Blue, Color Combinations by Industry, Color Harmony Types, Complementary, Green (+10 more)

### Community 134 - "Core Logo Types"
Cohesion: 0.11
Nodes (18): 1. Wordmark (Logotype), 2. Lettermark (Monogram), 3. Pictorial Mark (Brand Mark), 4. Abstract Mark, 5. Mascot, 6. Emblem, 7. Combination Mark, Aesthetic Styles (+10 more)

### Community 135 - "fetch-background.py"
Cohesion: 0.16
Nodes (9): generate_css_for_background(), get_background_image(), get_curated_images(), get_overlay_css(), get_pexels_search_url(), load_backgrounds_config(), load_brand_colors(), main() (+1 more)

### Community 136 - "color"
Cohesion: 0.11
Nodes (19): $type, $value, background, foreground, muted-foreground, primary, primary-hover, secondary (+11 more)

### Community 137 - "test_relevance_evaluator.py"
Cohesion: 0.12
Nodes (3): TestFixtureValidation, TestMetricMath, TestThresholdGate

### Community 139 - "3. Logo Usage"
Cohesion: 0.11
Nodes (17): 3. Logo Usage, 4. Voice & Tone, 5. Imagery Guidelines, Brand Guidelines Template, Brand Personality, Clear Space, Document Structure, Don'ts (+9 more)

### Community 140 - "Brand Consistency Checklist"
Cohesion: 0.11
Nodes (17): Audit Frequency, Brand Consistency Checklist, Channel Audit, Collateral, Colors, Common Issues, Email, Imagery (+9 more)

### Community 141 - "CIP Mockup Prompt Engineering"
Cohesion: 0.11
Nodes (17): Apparel (Polo/T-Shirt), Base Prompt Structure, Business Card, CIP Mockup Prompt Engineering, Context Modifiers, Corporate Minimal, Deliverable-Specific Modifiers, Letterhead (+9 more)

### Community 142 - "Color Semantics"
Cohesion: 0.11
Nodes (17): Accent, Applying Semantic Tokens, Background & Foreground, Border & Ring, Color Semantics, Dark Mode Overrides, Destructive, Interactive States (+9 more)

### Community 143 - "Design Principles"
Cohesion: 0.12
Nodes (15): 22 Art Direction Styles, Banner Sizes & Art Direction Styles Reference, Complete Banner Sizes, CTA Rules, Design Principles, Pinterest Research Queries, Print, Print Specs (+7 more)

### Community 144 - "Design Principles"
Cohesion: 0.12
Nodes (15): 22 Art Direction Styles, Banner Sizes & Art Direction Styles Reference, Complete Banner Sizes, CTA Rules, Design Principles, Pinterest Research Queries, Print, Print Specs (+7 more)

### Community 145 - "fontSize"
Cohesion: 0.12
Nodes (16): $type, $value, $type, $value, $type, $value, $type, $value (+8 more)

### Community 147 - "debug-skyscanner-live.js"
Cohesion: 0.20
Nodes (9): extractSkyscanner(), req, skyscannerUrl(), url, waitUntil(), expediaUrl(), scrapeExpedia(), attachJsonCapture() (+1 more)

### Community 148 - "CIP Design Reference"
Cohesion: 0.13
Nodes (14): CIP Brief (Start Here), CIP Design Reference, Commands, Deliverable Categories, Design Styles, Detailed References, Generate Mockups, HTML Presentation Features (+6 more)

### Community 149 - "Icon Design Reference"
Cohesion: 0.13
Nodes (14): Available Styles, CLI Options, Commands, Generate Batch Variations, Generate Multiple Sizes, Generate Single Icon, Icon Categories, Icon Design Reference (+6 more)

### Community 150 - "Copywriting Formulas"
Cohesion: 0.13
Nodes (14): AIDA (Attention-Interest-Desire-Action), Before-After-Bridge, Contrast Patterns, Copywriting Formulas, Core Formulas, Cost of Inaction, FAB (Features-Advantages-Benefits), Formula-to-Slide Mapping (+6 more)

### Community 151 - "Copywriting Formulas"
Cohesion: 0.13
Nodes (14): AIDA (Attention-Interest-Desire-Action), Before-After-Bridge, Contrast Patterns, Copywriting Formulas, Core Formulas, Cost of Inaction, FAB (Features-Advantages-Benefits), Formula-to-Slide Mapping (+6 more)

### Community 153 - "Banner Design - Multi-Format Creative Banner System"
Cohesion: 0.14
Nodes (13): Art Direction Styles (Top 10), Banner Design - Multi-Format Creative Banner System, Banner Size Quick Reference, Design Rules, Prerequisites, Security, Step 1: Gather Requirements (AskUserQuestion), Step 2: Research & Art Direction (+5 more)

### Community 154 - "Messaging Framework"
Cohesion: 0.14
Nodes (13): Core Statements, Elevator Pitches, Framework Structure, Message Architecture, Message by Audience, Message Testing, Messaging Framework, Mission Statement (+5 more)

### Community 155 - "Brand Voice Framework"
Cohesion: 0.14
Nodes (13): Brand Voice Framework, Character Spectrum, Emotion Spectrum, Language Spectrum, Step 1: Define Personality Traits, Step 2: Create Voice Chart, Step 3: Context Adaptation, Tone Spectrum (+5 more)

### Community 156 - "extract-colors.cjs"
Cohesion: 0.22
Nodes (11): calculateCompliance(), colorDistance(), displayPalette(), extractHexColors(), findNearestBrandColor(), fs, generateImageMagickCommand(), hexToRgb() (+3 more)

### Community 157 - "validate-asset.cjs"
Cohesion: 0.25
Nodes (13): checkManifest(), formatBytes(), formatOutput(), fs, main(), parseFilename(), path, RULES (+5 more)

### Community 158 - "Layout Patterns"
Cohesion: 0.14
Nodes (13): Card Styles, Component Variants, CSS Structures, Feature Grid (3 columns), Layout Decision Flow, Layout Patterns, Layout Selection by Use Case, Metric Styles (+5 more)

### Community 159 - "Tailwind Integration"
Cohesion: 0.14
Nodes (13): Animation Tokens, Base Layer, Button Example, Component Classes, CSS Variables Setup, Dark Mode Toggle, HSL Format Benefits, shadcn/ui Alignment (+5 more)

### Community 160 - "radius"
Cohesion: 0.19
Nodes (14): $type, $value, $type, $value, $type, $value, primitive, radius (+6 more)

### Community 161 - "Layout Patterns"
Cohesion: 0.14
Nodes (13): Card Styles, Component Variants, CSS Structures, Feature Grid (3 columns), Layout Decision Flow, Layout Patterns, Layout Selection by Use Case, Metric Styles (+5 more)

### Community 163 - "dealsCache.ts"
Cohesion: 0.30
Nodes (13): CachedDealsResults, clearPendingDealsParams(), DealsParams, dealsParamsFingerprint(), getCachedDealsResults(), getLocalStorage(), getPendingDealsParams(), getSessionStorage() (+5 more)

### Community 164 - "update.md"
Cohesion: 0.15
Nodes (12): Color Presets, Examples, Files Modified, Important, Overview, Skills Used, Step 1: Gather Brand Input, Step 2: Update Brand Guidelines (+4 more)

### Community 165 - "Logo Design Reference"
Cohesion: 0.15
Nodes (12): Available Styles, Color Psychology, Commands, Design Brief (Start Here), Detailed References, Generate Logo, Industry Defaults, Logo Design Reference (+4 more)

### Community 166 - "Token Architecture"
Cohesion: 0.15
Nodes (12): Categories, Dark Mode, File Organization, Layer 1: Primitive Tokens, Layer 2: Semantic Tokens, Layer 3: Component Tokens, Layer Overview, Migration from Flat Tokens (+4 more)

### Community 167 - "design-tokens-starter.json"
Cohesion: 0.15
Nodes (12): component, $type, $value, dark, semantic, $schema, $type, $value (+4 more)

### Community 171 - "render-html.py"
Cohesion: 0.23
Nodes (4): generate_html(), get_deliverable_info(), get_image_base64(), main()

### Community 172 - "Primitive Tokens"
Cohesion: 0.17
Nodes (11): Border Radius, Color Scales, Gray Scale, Motion / Duration, Primary Colors (Blue), Primitive Tokens, Shadows, Spacing Scale (+3 more)

### Community 173 - "validate-tokens.cjs"
Cohesion: 0.24
Nodes (11): extensions, formatReport(), fs, getFiles(), main(), parseArgs(), path, patterns (+3 more)

### Community 174 - "card"
Cohesion: 0.20
Nodes (12): $type, $value, bg, bg, padding, shadow, card, bg (+4 more)

### Community 175 - "Core Visual Elements"
Cohesion: 0.18
Nodes (10): Color Palette, Colors, Core Visual Elements, Logo, Logo, Quick Checks, Typography, Typography (+2 more)

### Community 176 - "inject-brand-context.cjs"
Cohesion: 0.31
Nodes (10): extractColorsFromTable(), extractCoreAttributes(), extractHexColors(), extractImageStyle(), extractTypography(), extractVoice(), fs, generatePromptAddition() (+2 more)

### Community 177 - "sync-brand-to-tokens.cjs"
Cohesion: 0.25
Nodes (8): adjustBrightness(), { execFileSync }, extractColorsFromMarkdown(), fs, generateColorScale(), main(), path, updateDesignTokens()

### Community 178 - "CIP Design Style Guide"
Cohesion: 0.18
Nodes (10): Bold Dynamic, CIP Design Style Guide, Classic Traditional, Color Psychology, Corporate Minimal, Fresh Modern, Luxury Premium, Modern Tech (+2 more)

### Community 179 - "embed-tokens.cjs"
Cohesion: 0.18
Nodes (8): args, fs, minimal, MINIMAL_TOKENS, path, projectRoot, tokensPath, wrapStyle

### Community 182 - "Brand"
Cohesion: 0.20
Nodes (9): Brand, Brand Sync Workflow, Quick Start, References, Routing, Scripts, Subcommands, Templates (+1 more)

### Community 183 - "Slide Strategies"
Cohesion: 0.20
Nodes (9): Common Structures, Duarte Sparkline Pattern, Matching Strategy to Context, Product Demo (6 slides), Sales Pitch (9 slides), Search Commands, Slide Strategies, Strategy Selection (+1 more)

### Community 184 - "Component Tokens"
Cohesion: 0.20
Nodes (9): Alert Tokens, Badge Tokens, Button Tokens, Card Tokens, Component Tokens, Dialog/Modal Tokens, Input Tokens, Table Tokens (+1 more)

### Community 185 - "generate-tokens.cjs"
Cohesion: 0.36
Nodes (9): flattenTokens(), fs, generateCSS(), generateTailwind(), main(), parseArgs(), path, resolveReference() (+1 more)

### Community 186 - "button"
Cohesion: 0.20
Nodes (10): fg, font-size, hover-bg, button, $type, $value, $type, $value (+2 more)

### Community 187 - "duration"
Cohesion: 0.20
Nodes (10): fast, normal, slow, $type, $value, $type, $value, duration (+2 more)

### Community 188 - "Slide Strategies"
Cohesion: 0.20
Nodes (9): Common Structures, Duarte Sparkline Pattern, Matching Strategy to Context, Product Demo (6 slides), Sales Pitch (9 slides), Search Commands, Slide Strategies, Strategy Selection (+1 more)

### Community 191 - "Fly-Fix Design System (Master)"
Cohesion: 0.22
Nodes (8): Anti-patterns, Checklist, Color (implementation: `frontend/src/theme/tokens.ts`), Fly-Fix Design System (Master), Motion, Patterns, Signature, Typography

### Community 192 - "input"
Cohesion: 0.29
Nodes (8): padding-x, input, $type, $value, focus-ring, padding-x, $type, $value

### Community 196 - "ref_path"
Cohesion: 0.25
Nodes (5): __dirname, dist, indexHtml, indexPath, SPA_ROUTES

### Community 198 - "FlightOption"
Cohesion: 0.29
Nodes (5): flightSegmentToOtaMap(), isSellerOTASource(), otaResolveClockHints(), otaResolveSegmentsPayload(), TestOtaResolveClockHints_oneWayUsesOutDep()

### Community 199 - "Slides Reference"
Cohesion: 0.29
Nodes (6): Key Features, Knowledge Base, Slides Reference, Usage, When to Use, Workflow

### Community 200 - "HTML Slide Template"
Cohesion: 0.29
Nodes (6): Animation Classes, Background Images, Base Structure, Chart.js Integration, CSS Variables Reference, HTML Slide Template

### Community 201 - "HTML Slide Template"
Cohesion: 0.29
Nodes (6): Animation Classes, Background Images, Base Structure, Chart.js Integration, CSS Variables Reference, HTML Slide Template

### Community 203 - "DedupeProviderResults"
Cohesion: 0.33
Nodes (6): DedupeProviderResults(), ItineraryFingerprint(), mergeSelfTransfer(), uniqueStrings(), TestDedupeKeepsCheaper(), TestItineraryFingerprintStable()

### Community 204 - "Slides"
Cohesion: 0.33
Nodes (5): References (Knowledge Base), Routing, Slides, Subcommands, When to Use

### Community 205 - "$type"
Cohesion: 0.60
Nodes (5): $type, $value, border, border, border

### Community 206 - "radius"
Cohesion: 0.60
Nodes (5): radius, radius, radius, $type, $value

### Community 207 - "lg"
Cohesion: 0.60
Nodes (5): lg, $type, $value, lg, lg

### Community 208 - "sm"
Cohesion: 0.60
Nodes (5): sm, sm, sm, $type, $value

### Community 209 - "searchProgressRatio.test.ts"
Cohesion: 0.40
Nodes (3): fin, full, half

### Community 210 - "padding-y"
Cohesion: 0.67
Nodes (4): padding-y, padding-y, $type, $value

### Community 211 - "xl"
Cohesion: 0.67
Nodes (4): xl, xl, $type, $value

### Community 212 - "none"
Cohesion: 0.67
Nodes (4): $type, $value, none, none

### Community 213 - "16"
Cohesion: 0.67
Nodes (3): $type, $value, 16

### Community 214 - "1"
Cohesion: 0.67
Nodes (3): $type, $value, 1

### Community 215 - "3"
Cohesion: 0.67
Nodes (3): $type, $value, 3

### Community 216 - "8"
Cohesion: 0.67
Nodes (3): $type, $value, 8

### Community 217 - "destructive"
Cohesion: 0.67
Nodes (3): destructive, $type, $value

### Community 218 - "destructive-foreground"
Cohesion: 0.67
Nodes (3): destructive-foreground, $type, $value

### Community 219 - "muted"
Cohesion: 0.67
Nodes (3): muted, $type, $value

### Community 220 - "primary-foreground"
Cohesion: 0.67
Nodes (3): primary-foreground, $type, $value

### Community 221 - "ring"
Cohesion: 0.67
Nodes (3): ring, $type, $value

### Community 222 - "secondary-foreground"
Cohesion: 0.67
Nodes (3): secondary-foreground, $type, $value

## Knowledge Gaps
- **3 isolated node(s):** `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2031 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **40 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Fly-Fix` connect `Features` to `time.Duration`?**
  _High betweenness centrality (0.125) - this node is a cross-community bridge._
- **What connects `flightcaptainweb`, `expo/tsconfig.base`, `DISPLAY` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `.ResolveQuotedPartnerBooking` be split into smaller, more focused modules?**
  _Cohesion score 0.11932773109243698 - nodes in this community are weakly interconnected._
- **Why does `Multi-provider flight search` connect `time.Duration` to `Features`?**
  _High betweenness centrality (0.125) - this node is a cross-community bridge._
- **Should `time.Duration` be split into smaller, more focused modules?**
  _Cohesion score 0.07207207207207207 - nodes in this community are weakly interconnected._
- **Why does `Recent enhancements` connect `Features` to `react-native`, `useTheme`?**
  _High betweenness centrality (0.123) - this node is a cross-community bridge._
- **Should `json` be split into smaller, more focused modules?**
  _Cohesion score 0.04912280701754386 - nodes in this community are weakly interconnected._