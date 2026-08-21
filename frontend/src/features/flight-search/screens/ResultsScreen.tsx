import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Animated,
  ScrollView,
  Modal,
  Pressable,
  Linking,
  Alert,
} from 'react-native';
import { AppIcon } from '../../../components/AppIcon';
import { useNavigation } from '@react-navigation/native';
import type { FlightOption, MonetaryAmount } from '../../../types';
import type { CreateSearchSessionRequest, ExtraSearchLeg } from '../../../types';
import { ANYWHERE_CODE } from '../../../types';
import { useTheme } from '../../../theme/ThemeContext';
import { useLocale } from '../../../context/LocaleContext';
import { useSearchStore, searchActions, isCurrentSearchGeneration } from '../../../store';
import { getSearchSessionResults, createSearchSession, getUniformBookingRedirectUrl } from '../../../api';
import { setCachedSearch } from '../../../utils/searchCache';
import { useIsMobile } from '../../../hooks/useResponsive';
import { useSearchParams, parseSearchParamsFromUrl } from '../../../hooks/useSearchParams';
import { mergeDeepLinkParams, logDeepLinkDiagnostics } from '../../../utils/deepLinkParams';
import { SortBar } from '../components/SortBar';
import { FiltersPanel } from '../components/FiltersPanel';
import { FlightDetailsModal } from '../components/FlightDetailsModal';
import { FlightResultCard } from '../components/FlightResultCard';
import { SearchFormContent } from '../components/SearchFormContent';
import { DynamicDestinationsFormContent } from '../../dynamic-destinations/components/DynamicDestinationsFormContent';
import {
  addExtraDestinationLeg,
  isDynamicDestinationsSearch,
  patchDynamicDestinationsParams,
  patchExtraLeg,
  removeExtraDestinationLeg,
  validateDynamicDestinationsSearch,
} from '../../../utils/dynamicDestinations';
import { clampExploreSearchDates } from '../../../utils/bookableDates';
import { isSplitBookingItinerary } from '../../../utils/skyscanner';
import { openFlyFixLegSearchInNewTab } from '../../../utils/searchRouteUrl';
import { SearchLoadingOverlay } from '../../../components/SearchLoadingOverlay';
import { SearchProgressBanner } from '../../../components/search/SearchProgressBanner';
import { SearchSummaryBar } from '../../../components/search/SearchSummaryBar';
import { EditSearchModal } from '../../../components/search/EditSearchModal';
import { HubRouteSummaryModal } from '../../../components/search/HubRouteSummaryModal';
import { CheaperCitiesSection } from '../components/CheaperCitiesSection';

const POLL_INTERVAL_MS = 1500;

/** Snapshot generation for async work that must not clobber a newer search. */
function currentGeneration(): number {
  return useSearchStore.getState().searchGeneration;
}

// ─── Positioning flight optimizer (MVP) ────────────────────────────────────────

const HUB_AIRPORTS = [
  'ATH',
  'VIE',
  'BUD',
  'FCO',
  'MXP',
  'SOF',
  'OTP',
] as const;

type PositioningOption = {
  hubAirport: string;
  positioningPrice: MonetaryAmount;
  hubFlightPrice: MonetaryAmount;
  totalPrice: MonetaryAmount;
  savings: MonetaryAmount;
  positioningSessionId: string;
  positioningOptionId: string;
  hubSessionId: string;
  hubOptionId: string;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const defaultFormParams: CreateSearchSessionRequest = {
  origin: '',
  destination: '',
  departureDate: '',
  returnDate: '',
  returnOrigin: '',
  returnDestination: '',
  extraLegs: [],
  cabinClass: 'ECONOMY',
  cabinPreference: 'ECONOMY',
  includeCheckedBag: false,
  adults: 1,
  children: 0,
  infants: 0,
  currency: 'USD',
  locale: 'en-US',
};

function SkeletonCard({ theme }: { theme: import('../../../theme/ThemeContext').Theme }) {
  const bg = theme.controlBg;
  return (
    <View style={[sk.card, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
      <View style={sk.topRow}>
        <View style={{ flex: 1 }}>
          <View style={[sk.line, { backgroundColor: bg, width: '75%' }]} />
          <View style={[sk.line, { backgroundColor: bg, width: '50%', height: 12 }]} />
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <View style={[sk.line, { backgroundColor: bg, width: 64, height: 22 }]} />
          <View style={[sk.line, { backgroundColor: bg, width: 80, height: 30, borderRadius: 8, marginTop: 6 }]} />
        </View>
      </View>
      <View style={[sk.divider, { backgroundColor: theme.cardBorder }]} />
      <View style={[sk.line, { backgroundColor: bg, width: '40%', height: 12 }]} />
    </View>
  );
}

const sk = StyleSheet.create({
  card: { marginHorizontal: 12, marginVertical: 5, padding: 14, borderRadius: 14, borderWidth: 1 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  line: { height: 18, borderRadius: 6, marginBottom: 6 },
  divider: { height: StyleSheet.hairlineWidth, marginVertical: 10 },
});

/** Weighted score for "Best": lower is better (price + stops penalty + duration penalty). */
function bestScore(opt: FlightOption, maxPrice: number, maxDuration: number): number {
  const priceNorm = maxPrice > 0 ? opt.price.amount / maxPrice : 0;
  const stops = opt.legs.reduce((acc, leg) => acc + Math.max(0, leg.segments.length - 1), 0);
  const stopsPenalty = stops * 0.15; // 0, 0.15, 0.3, ...
  const durationNorm = maxDuration > 0 ? opt.durationMinutes / maxDuration : 0;
  const durationPenalty = durationNorm * 0.2;
  return priceNorm + stopsPenalty + durationPenalty;
}

function sortResults(
  results: FlightOption[],
  sortField: 'price' | 'duration' | 'best',
  sortOrder: 'asc' | 'desc'
): FlightOption[] {
  return [...results].sort((a, b) => {
    if (sortField === 'price') {
      const diff = a.price.amount - b.price.amount;
      return sortOrder === 'asc' ? diff : -diff;
    }
    if (sortField === 'duration') {
      const diff = a.durationMinutes - b.durationMinutes;
      return sortOrder === 'asc' ? diff : -diff;
    }
    // best: weighted score (price + stops + duration); lower is better
    const maxPrice = Math.max(...results.map((r) => r.price.amount), 1);
    const maxDuration = Math.max(...results.map((r) => r.durationMinutes), 1);
    const scoreA = bestScore(a, maxPrice, maxDuration);
    const scoreB = bestScore(b, maxPrice, maxDuration);
    return scoreA - scoreB;
  });
}

type CheapestOption = {
  sessionId: string;
  option: FlightOption;
};

async function findCheapestOptionForParams(
  base: CreateSearchSessionRequest
): Promise<CheapestOption | null> {
  const session = await createSearchSession(base);
  let attempts = 0;
  let lastResults: FlightOption[] = [];
  let status: string | undefined;

  while (attempts < 6) {
    const res = await getSearchSessionResults(session.id);
    lastResults = res.results ?? [];
    status = res.session?.status;
    if (status === 'COMPLETE' || status === 'FAILED') {
      break;
    }
    attempts += 1;
    await delay(POLL_INTERVAL_MS);
  }

  if (!lastResults.length) return null;
  const best = lastResults.reduce(
    (min, opt) => (opt.price.amount < min.price.amount ? opt : min),
    lastResults[0]
  );
  return { sessionId: session.id, option: best };
}

export function ResultsScreen({ route }: { route: { params: Record<string, unknown> } }) {
  const { theme } = useTheme();
  const { currency, locale, t, isRTL, language } = useLocale();
  const { updateUrl, paramsFromUrl } = useSearchParams();
  const navigation = useNavigation<any>();
  const isMobile = useIsMobile();
  const {
    params: storeParams,
    sessionId: storeSessionId,
    results,
    status,
    error: storeError,
    sortField,
    sortOrder,
    filters,
  } = useSearchStore();
  const isDynamicDestinations = useMemo(() => {
    const routeNames = navigation.getState()?.routeNames;
    if (Array.isArray(routeNames) && routeNames.includes('DynamicDestinationsForm')) {
      return true;
    }
    return isDynamicDestinationsSearch(storeParams);
  }, [navigation, storeParams]);

  // Portable deep links: merge live URL + React Navigation route params. On iOS
  // WebKit the address bar can lose query params after history sync while
  // route.params still holds sessionId/optionId from the original shared URL.
  const deepLinkParams = mergeDeepLinkParams(route.params);
  const mergedSearchParams = { ...paramsFromUrl, ...deepLinkParams };

  const routeSessionId = typeof deepLinkParams.sessionId === 'string' ? deepLinkParams.sessionId.trim() : '';
  const urlSessionId = typeof mergedSearchParams.sessionId === 'string' ? mergedSearchParams.sessionId.trim() : '';
  const hasSharedSessionInLink = !!(routeSessionId || urlSessionId);

  /**
   * Optimistic new searches clear the store (PENDING + sessionId=null) and navigate with
   * sessionId="". Ignore route/URL ids only when starting a fresh in-app search — never
   * when the link itself carries a sessionId (shared deep link opened from Telegram etc.).
   */
  const optimisticNewSearch = status === 'PENDING' && !storeSessionId && !hasSharedSessionInLink;

  const sessionId = optimisticNewSearch
    ? ''
    : (storeSessionId || routeSessionId || urlSessionId || '');
  const searchNonce = (route.params as any)?.searchNonce ?? 0;
  const versionRef = useRef(0);
  const prevSessionIdRef = useRef<string | null>(null);
  const [detailsOption, setDetailsOption] = useState<FlightOption | null>(null);
  const pendingOptionIdRef = useRef<string | undefined>(
    typeof mergedSearchParams.optionId === 'string' ? mergedSearchParams.optionId : undefined
  );
  // flightId is the canonical fingerprint — survives session re-creation for shared links
  const pendingFlightIdRef = useRef<string | undefined>(
    typeof mergedSearchParams.flightId === 'string' ? mergedSearchParams.flightId : undefined
  );
  // Skip paramsMatch cache guard while hydrating a shared link — partial/stale URL
  // search fields must not block loading the server-side session snapshot.
  const sharedLinkHydrationRef = useRef(!!(routeSessionId || urlSessionId) && !storeSessionId);
  const deepLinkLoggedRef = useRef(false);
  const creatingSessionRef = useRef(false);
  const [bookLoadingId, setBookLoadingId] = useState<string | null>(null);
  const [bootstrappingSession, setBootstrappingSession] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [showEditSearchModal, setShowEditSearchModal] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // iOS WebKit can deliver sessionId one frame late. If bootstrap already called
  // beginSearch (PENDING, no sessionId), the poll guard would block forever —
  // infinite "Comparing prices…" skeletons. Mark hydration and clear bootstrap residue.
  useEffect(() => {
    if (!sessionId || storeSessionId) return;
    sharedLinkHydrationRef.current = true;
    const st = useSearchStore.getState();
    if (st.status === 'PENDING' && !st.sessionId) {
      creatingSessionRef.current = false;
      setBootstrappingSession(false);
      useSearchStore.setState({ status: null, error: null });
    }
  }, [sessionId, storeSessionId]);

  // Keep pending flight refs aligned when iOS WebKit delivers params via route.params
  // after remount, or when pageshow refreshes the URL query string.
  useEffect(() => {
    if (mergedSearchParams.optionId) pendingOptionIdRef.current = mergedSearchParams.optionId;
    if (mergedSearchParams.flightId) pendingFlightIdRef.current = mergedSearchParams.flightId;
  }, [mergedSearchParams.optionId, mergedSearchParams.flightId]);

  useEffect(() => {
    if (deepLinkLoggedRef.current) return;
    if (!routeSessionId && !urlSessionId) return;
    deepLinkLoggedRef.current = true;
    logDeepLinkDiagnostics('mount', {
      routeParams: route.params,
      merged: mergedSearchParams,
      resolvedSessionId: sessionId,
      storeSessionId,
      storeStatus: status,
      resultsCount: results.length,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openDetails = useCallback((option: FlightOption) => {
    pendingOptionIdRef.current = option.id;
    pendingFlightIdRef.current = (option as any).canonicalFingerprint || undefined;
    setDetailsOption(option);
  }, []);

  const closeDetails = useCallback(() => {
    pendingOptionIdRef.current = undefined;
    pendingFlightIdRef.current = undefined;
    setDetailsOption(null);
  }, []);

  const handleBookFromCard = async (option: FlightOption) => {
    if (isSplitBookingItinerary(option, storeParams)) {
      openDetails(option);
      return;
    }
    if (!sessionId) {
      Alert.alert('', 'Session expired. Please run a new search.');
      return;
    }
    setBookLoadingId(option.id);
    try {
      const url = getUniformBookingRedirectUrl(sessionId, option.id, option);
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('', 'Cannot open booking link.');
      }
    } catch {
      Alert.alert('', 'Cannot open booking link.');
    } finally {
      setBookLoadingId(null);
    }
  };

  const [formParams, setFormParams] = useState<CreateSearchSessionRequest>(() =>
    storeParams ? { ...defaultFormParams, ...storeParams } : defaultFormParams
  );
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>(
    storeParams?.returnDate ? 'round-trip' : 'one-way'
  );
  const [sidebarSearchLoading, setSidebarSearchLoading] = useState(false);
  const [sidebarSearchError, setSidebarSearchError] = useState<string | null>(null);
  const [positioningOptions, setPositioningOptions] = useState<PositioningOption[]>([]);
  const [positioningLoading, setPositioningLoading] = useState(false);
  const optimizerSessionRef = useRef<string | null>(null);
  const [positioningDetails, setPositioningDetails] = useState<PositioningOption | null>(null);
  const [cheaperCitiesFolded, setCheaperCitiesFolded] = useState(true);

  // Only reset the edit form when the search session changes. Syncing on every storeParams field
  // (or spreading ...storeParams over local state) overwrote in-progress edits: e.g. user replaces
  // Anywhere with LHR, then store still had ANYWHERE until submit — a re-run could revert the field.
  useEffect(() => {
    if (storeParams) {
      setFormParams({ ...defaultFormParams, ...storeParams });
      setTripType(storeParams.returnDate ? 'round-trip' : 'one-way');
    }
  }, [sessionId]);

  const updateFormParams = <K extends keyof CreateSearchSessionRequest>(
    key: K,
    value: CreateSearchSessionRequest[K]
  ) => setFormParams((prev) => ({ ...prev, [key]: value }));

  const updateDynamicFormParams = <K extends keyof CreateSearchSessionRequest>(
    key: K,
    value: CreateSearchSessionRequest[K],
  ) => setFormParams((prev) => patchDynamicDestinationsParams(prev, key, value));

  const updateDynamicExtra = (index: number, patch: Partial<ExtraSearchLeg>) => {
    setFormParams((prev) => patchExtraLeg(prev, index, patch));
  };

  const addDynamicExtra = () => {
    setFormParams((prev) => addExtraDestinationLeg(prev));
  };

  const removeDynamicExtra = (index: number) => {
    setFormParams((prev) => removeExtraDestinationLeg(prev, index));
  };

  const runEditedSearch = async (payload: CreateSearchSessionRequest) => {
    setSidebarSearchError(null);
    setShowEditSearchModal(false);
    setSidebarSearchLoading(true);
    creatingSessionRef.current = true;
    try {
      setCachedSearch(payload);
      const generation = searchActions.beginSearch(payload);
      updateUrl(payload);
      versionRef.current = 0;
      const session = await createSearchSession(payload);
      if (!isCurrentSearchGeneration(generation)) return;
      const res = await getSearchSessionResults(session.id, undefined, payload);
      if (!isCurrentSearchGeneration(generation)) return;
      const applied = searchActions.applySessionResults({
        generation,
        sessionId: session.id,
        session: res.session ?? session,
        status: res.session?.status ?? session.status,
        results: res.results ?? [],
        version: res.version ?? 1,
        mode: 'replace',
      });
      if (!applied) return;
      versionRef.current = res.version ?? 1;
      updateUrl({ ...payload, sessionId: session.id });
      navigation.navigate('Results', { sessionId: session.id });
    } catch (e) {
      setSidebarSearchError(e instanceof Error ? e.message : 'Search failed');
    } finally {
      creatingSessionRef.current = false;
      setSidebarSearchLoading(false);
    }
  };

  const handleDynamicDestinationsSearch = async () => {
    const validated = validateDynamicDestinationsSearch(
      formParams,
      t,
      currency || 'USD',
      locale || 'en-US',
    );
    if (!validated.ok) {
      setSidebarSearchError(validated.error);
      return;
    }
    await runEditedSearch(validated.payload);
  };

  const handleSidebarSearch = async () => {
    if (isDynamicDestinations) {
      await handleDynamicDestinationsSearch();
      return;
    }
    const p = formParams;
    if (!p.origin.trim() || !p.destination.trim() || !p.departureDate) {
      setSidebarSearchError(t('fill_origin_destination_dates'));
      return;
    }
    // Match SearchForm: Anywhere opens Explore instead of POSTing ANYWHERE to GF2.
    if (p.destination.trim().toUpperCase() === ANYWHERE_CODE) {
      setSidebarSearchError(null);
      setShowEditSearchModal(false);
      const dr = clampExploreSearchDates(
        p.departureDate || undefined,
        p.returnDate || undefined,
        tripType === 'round-trip',
      );
      navigation.navigate('Explore', {
        origin: p.origin.trim().toUpperCase(),
        departureDate: dr.departureDate,
        returnDate: tripType === 'one-way' ? undefined : dr.returnDate || undefined,
        adults: p.adults ?? 1,
        currency: currency || 'USD',
        searchNonce: Date.now(),
      });
      return;
    }
    if (tripType === 'round-trip' && !p.returnDate) {
      setSidebarSearchError(t('choose_return_date'));
      return;
    }
    const cabin: CreateSearchSessionRequest['cabinClass'] =
      p.cabinClass === 'ECONOMY' || p.cabinClass === 'PREMIUM_ECONOMY' ||
      p.cabinClass === 'BUSINESS' || p.cabinClass === 'FIRST'
        ? p.cabinClass
        : 'ECONOMY';
    const payload: CreateSearchSessionRequest = {
      ...p,
      origin: p.origin.trim().toUpperCase(),
      destination: p.destination.trim().toUpperCase(),
      returnDate: tripType === 'one-way' ? undefined : p.returnDate || undefined,
      cabinClass: cabin,
      cabinPreference: cabin as CreateSearchSessionRequest['cabinPreference'],
      includeCheckedBag: false,
      currency: currency || 'USD',
      locale: locale || 'en-US',
    };
    await runEditedSearch(payload);
  };

  useEffect(() => {
    if (prevSessionIdRef.current && prevSessionIdRef.current !== sessionId) {
      pendingOptionIdRef.current = undefined;
      setDetailsOption(null);
    }
    if (prevSessionIdRef.current !== sessionId) {
      prevSessionIdRef.current = sessionId;
      versionRef.current = 0;
    }
  }, [sessionId]);

  // ─── Shared-link expiry ─────────────────────────────────────────────────────
  // Sessions are now durable on the backend (disk store, ~7-day retention), so a
  // shared sessionId normally resolves on any device. When it is genuinely gone
  // (past retention), the poll's 404 handler flips this flag and we render a
  // dedicated "shared link expired" state with a button to re-run the search from
  // the params baked into the URL. NOTE: on a deep link, React Navigation parses
  // the query string into route.params, so routeSessionId is ALWAYS set — never
  // use it to distinguish in-app navigation from a shared link.
  const [sharedLinkExpired, setSharedLinkExpired] = useState(false);

  // ─── Optimistic session bootstrap ──────────────────────────────────────────
  // If we navigated here with `sessionId=""`, we create the session after the
  // Results screen is mounted (so the user sees the UI immediately).
  const statusRef = useRef(status);
  const storeParamsRef = useRef(storeParams);
  useEffect(() => {
    statusRef.current = status;
  }, [status]);
  useEffect(() => {
    storeParamsRef.current = storeParams;
  }, [storeParams]);
  const paramsFromUrlRef = useRef(paramsFromUrl);
  useEffect(() => {
    paramsFromUrlRef.current = paramsFromUrl;
  }, [paramsFromUrl]);

  useEffect(() => {
    if (sessionId) return;
    if (creatingSessionRef.current) return;

    // Shared links carry sessionId + search params. Never POST a new search when the
    // URL/route already names a session — that was the iPhone Chrome bug: bootstrap
    // fired on frame 1 (sessionId not resolved yet) and replaced the shared session.
    const linkParams = mergeDeepLinkParams(route.params as Record<string, unknown>);
    if (linkParams.sessionId?.trim() || parseSearchParamsFromUrl().sessionId?.trim()) return;

    // Prefer in-memory store params over the URL. After "Edit search", storeParams
    // already reflect the new route while the URL can still hold the previous
    // destination — merging URL last would re-search the old route (BKK vs BER).
    // NOTE: params are read through refs, NOT effect deps. When this effect calls
    // beginSearch below it replaces storeParams — with storeParams in the deps
    // list, that re-triggered the effect, whose cleanup set cancelled=true and
    // silently discarded the in-flight create. The UI then hung on the loading
    // screen forever (hit by param-only shared links and the expired-link re-run).
    const { sessionId: _urlSession, optionId: _urlOption, flightId: _urlFlightId, ...urlSearch } = paramsFromUrlRef.current ?? {};
    const { sessionId: _routeSession, optionId: _routeOption, flightId: _routeFlight, ...routeSearch } =
      mergeDeepLinkParams(route.params as Record<string, unknown>);
    const base = {
      ...defaultFormParams,
      ...urlSearch,
      ...routeSearch,
      ...(storeParamsRef.current ?? {}),
    } as Partial<CreateSearchSessionRequest>;

    const origin = (base.origin ?? '').trim();
    const destination = (base.destination ?? '').trim();
    const departureDate = (base.departureDate ?? '').trim();
    if (!origin || !destination || !departureDate) return;

    creatingSessionRef.current = true;
    setBootstrappingSession(true);

    const generation =
      useSearchStore.getState().status === 'PENDING' && !useSearchStore.getState().sessionId
        ? currentGeneration()
        : searchActions.beginSearch({
            ...defaultFormParams,
            ...base,
            origin: origin.toUpperCase(),
            destination: destination.toUpperCase(),
            departureDate,
            returnDate: base.returnDate ? String(base.returnDate) : undefined,
            cabinClass: String(base.cabinClass ?? 'ECONOMY'),
            cabinPreference: (base.cabinPreference ?? base.cabinClass ?? 'ECONOMY') as any,
            includeCheckedBag: base.includeCheckedBag ?? false,
            adults: base.adults ?? 1,
            children: base.children ?? 0,
            infants: base.infants ?? 0,
            currency: (base.currency ?? currency ?? 'USD') as any,
            locale: (base.locale ?? locale ?? 'en-US') as any,
          });

    // Ensure UI goes into loading mode even before we have a sessionId.
    searchActions.setError(null);
    versionRef.current = 0;

    let cancelled = false;
    (async () => {
      try {
        const cabin = base.cabinClass ?? 'ECONOMY';
        const payload: CreateSearchSessionRequest = {
          ...defaultFormParams,
          ...base,
          origin: origin.toUpperCase(),
          destination: destination.toUpperCase(),
          departureDate,
          returnDate: base.returnDate ? String(base.returnDate) : undefined,
          cabinClass: String(cabin),
          cabinPreference: (base.cabinPreference ?? cabin) as any,
          includeCheckedBag: base.includeCheckedBag ?? false,
          adults: base.adults ?? 1,
          children: base.children ?? 0,
          infants: base.infants ?? 0,
          currency: (base.currency ?? currency ?? 'USD') as any,
          locale: (base.locale ?? locale ?? 'en-US') as any,
        };

        const session = await createSearchSession(payload);
        if (cancelled || !isCurrentSearchGeneration(generation)) return;

        // POST /sessions returns COMPLETE but does not include offers. Hydrate
        // results here — the poll effect skips COMPLETE and would otherwise leave
        // the list empty ("No flights found") even when the API has offers.
        const res = await getSearchSessionResults(session.id, undefined, payload);
        if (cancelled || !isCurrentSearchGeneration(generation)) return;

        const applied = searchActions.applySessionResults({
          generation,
          sessionId: session.id,
          session: res.session ?? session,
          status: res.session?.status ?? session.status,
          results: res.results ?? [],
          version: res.version ?? 1,
          mode: 'replace',
        });
        if (!applied) return;
        versionRef.current = res.version ?? 1;
        navigation.replace('Results', { sessionId: session.id });
      } catch (e) {
        if (!cancelled && isCurrentSearchGeneration(generation)) {
          searchActions.setError(e instanceof Error ? e.message : 'Search failed');
          searchActions.setSession(null, null, 'FAILED');
        }
      } finally {
        // Always clear — if we skip this when cancelled (e.g. replace() changed sessionId
        // mid-flight), the top LoadingBanner stays forever while results are already visible.
        creatingSessionRef.current = false;
        setBootstrappingSession(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // Deliberately narrow deps: params/navigation/currency/locale are read via
    // refs or captured at execution time. Re-running on those (esp. storeParams,
    // which this effect itself mutates via beginSearch) self-cancelled the create.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, searchNonce]);

  useEffect(() => {
    if (!sessionId) return;

    let cancelled = false;
    let consecutiveNotFound = 0;
    const MAX_NOT_FOUND = 3;
    const polledSessionId = sessionId;
    const generation = currentGeneration();

    const poll = async () => {
      if (cancelled) return;
      if (!isCurrentSearchGeneration(generation)) return;
      const storeState = useSearchStore.getState();
      const storeSid = storeState.sessionId;
      const hydratingShared = sharedLinkHydrationRef.current;
      // Store may have moved on (new search) before React re-ran this effect.
      if (storeSid != null && storeSid !== polledSessionId) return;
      // Block only when a *new* in-app search (PENDING) is in flight — not when
      // bootstrap briefly poisoned the store before sessionId resolved on iOS.
      if (storeSid == null && storeState.status === 'PENDING' && !hydratingShared) return;

      const currentStatus = statusRef.current;
      // Failed: stop. Completed: only skip once results are hydrated (version > 0).
      // Otherwise a COMPLETE create with an empty store never GETs offers and the UI
      // falsely shows "No flights found".
      if (currentStatus === 'FAILED') return;
      if (currentStatus === 'COMPLETE' && versionRef.current > 0) return;
      try {
        const sinceVersion = versionRef.current > 0 ? versionRef.current : undefined;
        const matchParams =
          sharedLinkHydrationRef.current || !storeParamsRef.current
            ? undefined
            : storeParamsRef.current;
        const res = await getSearchSessionResults(
          polledSessionId,
          sinceVersion,
          matchParams
        );
        if (cancelled || !isCurrentSearchGeneration(generation)) return;
        const latest = useSearchStore.getState();
        if (latest.sessionId != null && latest.sessionId !== polledSessionId) return;
        if (latest.sessionId == null && latest.status === 'PENDING' && !sharedLinkHydrationRef.current) return;

        consecutiveNotFound = 0;
        const nextVersion = res.version ?? 0;
        const applied = searchActions.applySessionResults({
          generation,
          sessionId: polledSessionId,
          session: res.session,
          status: res.session.status,
          results: res.results ?? [],
          version: nextVersion,
          mode: sinceVersion == null ? 'replace' : 'append',
        });
        if (applied) {
          versionRef.current = nextVersion;
          sharedLinkHydrationRef.current = false;
          logDeepLinkDiagnostics('poll-ok', {
            routeParams: route.params as Record<string, unknown>,
            resolvedSessionId: polledSessionId,
            storeSessionId: useSearchStore.getState().sessionId,
            storeStatus: res.session?.status,
            resultsCount: res.results?.length ?? 0,
            apiStatus: 200,
          });
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        const notFound = /\b404\b|not found|expired/i.test(msg);
        logDeepLinkDiagnostics(notFound ? 'poll-404' : 'poll-error', {
          routeParams: route.params as Record<string, unknown>,
          resolvedSessionId: polledSessionId,
          storeSessionId: useSearchStore.getState().sessionId,
          storeStatus: statusRef.current,
          resultsCount: useSearchStore.getState().results.length,
          apiStatus: notFound ? 404 : 'error',
          apiError: msg.slice(0, 200),
        });
        if (notFound) {
          consecutiveNotFound += 1;
          const stAfter = statusRef.current;
          const storeSidNow = useSearchStore.getState().sessionId;
          if (
            consecutiveNotFound >= MAX_NOT_FOUND &&
            stAfter !== 'COMPLETE' &&
            stAfter !== 'FAILED' &&
            isCurrentSearchGeneration(generation) &&
            // On a shared link opened on a fresh device the store sessionId is
            // still null (no poll ever succeeded) — that case must recover too.
            (storeSidNow === polledSessionId || storeSidNow == null)
          ) {
            // The session is gone even from the backend's durable store (past
            // retention, or an invalid id). Show a distinct expired-link state —
            // never the generic "No flights found".
            const urlP = parseSearchParamsFromUrl();
            const canReRun = !!(urlP.origin && urlP.destination && urlP.departureDate);
            setSharedLinkExpired(canReRun);
            searchActions.setError(
              canReRun ? t('shared_link_expired_body') : t('link_expired_invalid')
            );
            searchActions.setSession(null, null, 'FAILED');
          }
        }
        // Transient 5xx/network: keep polling briefly while still PENDING.
      }
    };

    const id = setInterval(() => {
      const st = statusRef.current;
      if (st === 'FAILED') {
        clearInterval(id);
        return;
      }
      if (st === 'COMPLETE' && versionRef.current > 0) {
        clearInterval(id);
        return;
      }
      poll();
    }, POLL_INTERVAL_MS);

    poll();
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [sessionId]);

  useEffect(() => {
    if (sessionId && storeParams) {
      const openOption = detailsOption || results.find((r) => r.id === pendingOptionIdRef.current);
      updateUrl({
        ...storeParams,
        sessionId,
        optionId: openOption?.id || pendingOptionIdRef.current,
        flightId: (openOption as any)?.canonicalFingerprint || pendingFlightIdRef.current,
      });
    }
  }, [sessionId, storeParams, updateUrl, detailsOption?.id, results]);

  // Auto-open the flight from a shared link. Prefer optionId match (same session), then
  // fall back to canonicalFingerprint match (re-created session after expiry).
  useEffect(() => {
    const wantId = pendingOptionIdRef.current;
    const wantFingerprint = pendingFlightIdRef.current;
    if (!wantId && !wantFingerprint) return;
    if (detailsOption) return;

    // Try exact optionId first. opt_N ids are positional within one session, so
    // when the link also carries a fingerprint, the id match must agree with it —
    // otherwise a re-created session's opt_0 would open a different flight than
    // the one that was shared.
    if (wantId) {
      const match = results.find((r) => r.id === wantId);
      const fingerprintOk =
        !wantFingerprint || (match as any)?.canonicalFingerprint === wantFingerprint;
      if (match && fingerprintOk) {
        setDetailsOption(match);
        pendingFlightIdRef.current = undefined;
        return;
      }
    }
    // Fall back to fingerprint match (session was re-created; option IDs differ)
    if (wantFingerprint) {
      const match = results.find(
        (r) => (r as any).canonicalFingerprint === wantFingerprint
      );
      if (match) {
        pendingOptionIdRef.current = match.id;
        setDetailsOption(match);
        pendingFlightIdRef.current = undefined;
        return;
      }
    }
    // If results are final and no match found, clear the pending refs
    if (status === 'COMPLETE' && results.length > 0) {
      pendingOptionIdRef.current = undefined;
      pendingFlightIdRef.current = undefined;
    }
  }, [results, status, detailsOption]);

  // Only reset positioning when sessionId actually changes (not on every mount). Prevents "Cheaper departure cities" disappearing on Chrome iOS when component re-mounts or effect re-runs with same sessionId.
  const positioningSessionIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (positioningSessionIdRef.current !== sessionId) {
      positioningSessionIdRef.current = sessionId;
      setPositioningOptions([]);
      setPositioningLoading(false);
      optimizerSessionRef.current = null;
    }
  }, [sessionId]);

  // Debug: positioning section visibility (helps diagnose disappearing section).
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('[POSITIONING_SECTION]', {
      loading: positioningLoading,
      positioningOptionsLength: positioningOptions?.length ?? 0,
      hasData: !!(positioningOptions && positioningOptions.length > 0),
    });
  }, [positioningLoading, positioningOptions]);

  // Positioning Flight Optimizer — runs once per session after results load.
  const runPositioningOptimizer = useCallback(async () => {
    if (!storeParams || !results.length) return;
    const { origin, destination, departureDate } = storeParams;
    if (!origin || !destination || !departureDate) return;
    if (optimizerSessionRef.current === sessionId) return;   // already ran for this session
    optimizerSessionRef.current = sessionId;

    const cur = storeParams.currency || 'USD';
    const directCheapest = results.reduce(
      (min, opt) => (opt.price.amount < min ? opt.price.amount : min),
      results[0].price.amount
    );

    setPositioningLoading(true);
    const found: PositioningOption[] = [];
    const startedAt = Date.now();
    // Hard cap so "Searching cheaper departure cities..." cannot run for many minutes.
    const POSITIONING_BUDGET_MS = 45_000;
    const sessionStillActive = () => optimizerSessionRef.current === sessionId;

    try {
      let hubRunIndex = 0;
      for (const hub of HUB_AIRPORTS) {
        if (!sessionStillActive()) break;
        if (Date.now() - startedAt > POSITIONING_BUDGET_MS) break;
        if (hub === origin.toUpperCase() || hub === destination.toUpperCase()) continue;
        // Spread hub scans so we do not burst the backend GF2 limiter right after the main search.
        if (hubRunIndex > 0) {
          await delay(2000);
        }
        hubRunIndex += 1;
        try {
          const baseOpts: Partial<CreateSearchSessionRequest> = {
            adults: storeParams.adults ?? 1,
            children: storeParams.children ?? 0,
            infants: storeParams.infants ?? 0,
            cabinClass: storeParams.cabinClass ?? 'ECONOMY',
            cabinPreference: storeParams.cabinPreference ?? 'ECONOMY',
            includeCheckedBag: storeParams.includeCheckedBag ?? false,
            currency: cur,
            locale: storeParams.locale ?? 'en-US',
            returnDate: '',
          };

          // Sequential (not Promise.all): two fewer concurrent Search() calls per hub.
          const positioning = await findCheapestOptionForParams({
            ...(baseOpts as CreateSearchSessionRequest),
            origin: origin.toUpperCase(),
            destination: hub,
            departureDate,
          });
          if (!sessionStillActive()) break;
          if (Date.now() - startedAt > POSITIONING_BUDGET_MS) break;
          const hubFlight = await findCheapestOptionForParams({
            ...(baseOpts as CreateSearchSessionRequest),
            origin: hub,
            destination: destination.toUpperCase(),
            departureDate,
          });

          if (!positioning || !hubFlight) continue;

          const totalAmount = positioning.option.price.amount + hubFlight.option.price.amount;
          const savingsAmount = directCheapest - totalAmount;
          if (savingsAmount <= 80) continue;

          found.push({
            hubAirport: hub,
            positioningPrice: { amount: positioning.option.price.amount, currency: cur },
            hubFlightPrice: { amount: hubFlight.option.price.amount, currency: cur },
            totalPrice: { amount: totalAmount, currency: cur },
            savings: { amount: savingsAmount, currency: cur },
            positioningSessionId: positioning.sessionId,
            positioningOptionId: positioning.option.id,
            hubSessionId: hubFlight.sessionId,
            hubOptionId: hubFlight.option.id,
          });
        } catch {
          // skip hubs that fail
        }
      }

      found.sort((a, b) => b.savings.amount - a.savings.amount);
      if (sessionStillActive()) {
        setPositioningOptions(found);
      }
    } finally {
      if (sessionStillActive()) {
        setPositioningLoading(false);
      }
    }
  }, [sessionId, storeParams, results]);

  useEffect(() => {
    if (status === 'COMPLETE' && results.length > 0 && storeParams) {
      runPositioningOptimizer();
    }
  }, [status, results.length, storeParams, runPositioningOptimizer]);

  const filtered = useMemo(() => {
    let list = results;
    if (filters.maxStops != null) {
      list = list.filter((opt) => {
        // Use max stops per leg (not sum), so a 2-stop outbound + 2-stop return = 2 max, not 4
        const maxPerLeg = opt.legs.length > 0
          ? Math.max(...opt.legs.map((leg) => Math.max(0, leg.segments.length - 1)))
          : 0;
        if (filters.maxStops === 0) return maxPerLeg === 0;       // Direct only
        if (filters.maxStops === 1) return maxPerLeg === 1;       // Exactly 1 stop
        if (filters.maxStops === 2) return maxPerLeg >= 2;        // 2+ stops
        return true;
      });
    }
    if (filters.airlines.length > 0) {
      const set = new Set(filters.airlines.map((c) => c.toUpperCase()));
      list = list.filter((opt) => {
        const primary =
          opt.primaryDisplayCarrier ||
          opt.validatingAirlines?.[0] ||
          opt.legs?.[0]?.segments?.[0]?.marketingCarrier?.code;
        if (!primary) return false;
        return set.has(primary.toUpperCase());
      });
    }
    if (filters.maxDurationMinutes != null) {
      list = list.filter((opt) => opt.durationMinutes <= filters.maxDurationMinutes!);
    }
    return sortResults(list, sortField, sortOrder);
  }, [results, filters, sortField, sortOrder]);

  const toggleSort = (field: typeof sortField) => {
    if (field === 'best') {
      searchActions.setSort('best', 'desc');
      return;
    }
    const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    searchActions.setSort(field, order);
  };

  const [showSlowPopup, setShowSlowPopup] = useState(false);
  const slowPopupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const loading = status === 'PENDING' || status === 'PARTIAL';
    if (!loading) {
      setShowSlowPopup(false);
      if (slowPopupTimerRef.current) {
        clearTimeout(slowPopupTimerRef.current);
        slowPopupTimerRef.current = null;
      }
      return;
    }
    if (slowPopupTimerRef.current || showSlowPopup) {
      return;
    }
    slowPopupTimerRef.current = setTimeout(() => {
      slowPopupTimerRef.current = null;
      if (status === 'PENDING' || status === 'PARTIAL') {
        setShowSlowPopup(true);
      }
    }, 10000);
    return () => {
      if (slowPopupTimerRef.current) {
        clearTimeout(slowPopupTimerRef.current);
        slowPopupTimerRef.current = null;
      }
    };
  }, [status, sessionId, showSlowPopup]);

  // Must stay above any early return (Rules of Hooks).
  useEffect(() => {
    const loadingNow =
      ((bootstrappingSession || status === 'PENDING' || status === 'PARTIAL') && results.length === 0);
    const hasVisualContent =
      results.length > 0 ||
      (!loadingNow && !!sessionId && results.length === 0) ||
      (!loadingNow && results.length > 0 && filtered.length === 0);
    if (hasVisualContent) {
      Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [results.length, filtered.length, bootstrappingSession, status, sessionId, fadeAnim]);

  if (status === 'FAILED') {
    // Re-running must clear the dead sessionId from EVERY source the resolver
    // reads: the store (setSession above), the URL, and route.params (React
    // Navigation keeps the deep-link sessionId there — the historic cause of
    // shared links never recovering). Only then does the bootstrap effect fire.
    const clearDeadSessionEverywhere = () => {
      const urlP = parseSearchParamsFromUrl();
      updateUrl({ ...urlP, sessionId: undefined, optionId: undefined });
      // optionId must be cleared from route.params too: setParams re-syncs the URL
      // from route params, which would resurrect the stale optionId — and opt_N ids
      // are positional, so in the re-created session it matches a DIFFERENT flight.
      navigation.setParams({ sessionId: '', optionId: '', searchNonce: Date.now() });
    };

    if (sharedLinkExpired) {
      const rerunSharedSearch = () => {
        const urlP = parseSearchParamsFromUrl();
        // Keep the canonical fingerprint so the shared flight re-opens after the
        // fresh search finds the same itinerary.
        if (urlP.flightId) pendingFlightIdRef.current = urlP.flightId;
        pendingOptionIdRef.current = undefined;
        setSharedLinkExpired(false);
        searchActions.setError(null);
        searchActions.setSession(null, null, null);
        versionRef.current = 0;
        creatingSessionRef.current = false;
        clearDeadSessionEverywhere();
      };
      return (
        <View style={[styles.centered, { backgroundColor: theme.screenBg }]}>
          <View style={{ marginBottom: 12 }}>
            <AppIcon name="time-outline" size={48} color={theme.textMuted} fallbackText="⏱" />
          </View>
          <Text style={[styles.emptyTitle, { color: theme.text, textAlign: 'center' }]}>
            {t('shared_link_expired_title')}
          </Text>
          <Text style={[styles.emptyText, { color: theme.textMuted, textAlign: 'center', maxWidth: 420 }]}>
            {t('shared_link_expired_body')}
          </Text>
          <TouchableOpacity
            style={[styles.retryBtn, { borderColor: theme.primary, marginTop: 16 }]}
            onPress={rerunSharedSearch}
            activeOpacity={0.8}
          >
            <Text style={[styles.retryBtnText, { color: theme.primary }]}>{t('run_search_again')}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    const retrySearch = () => {
      const p = useSearchStore.getState().params;
      if (p) {
        searchActions.beginSearch(p);
      } else {
        searchActions.setError(null);
        searchActions.setSession(null, null, 'PENDING');
        searchActions.setResults([], 0);
      }
      versionRef.current = 0;
      creatingSessionRef.current = false;
      setBootstrappingSession(false);
      clearDeadSessionEverywhere();
      navigation.navigate('Results', { sessionId: '', searchNonce: Date.now() });
    };
    return (
      <View style={[styles.centered, { backgroundColor: theme.screenBg }]}>
        <Text style={[styles.error, { color: theme.error }]}>
          {storeError || t('search_failed_expired')}
        </Text>
        <TouchableOpacity
          style={[styles.retryBtn, { borderColor: theme.primary, marginTop: 16 }]}
          onPress={retrySearch}
          activeOpacity={0.8}
        >
          <Text style={[styles.retryBtnText, { color: theme.primary }]}>{t('try_again')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const params = storeParams;
  const summaryParts: string[] = [];
  const extraLegs = (params?.extraLegs ?? []).filter((l) => (l.origin || '').trim() && (l.destination || '').trim());
  const isOpenJaw =
    !!(params?.returnOrigin && params.returnOrigin.toUpperCase() !== (params.destination || '').toUpperCase());
  if ((isOpenJaw || extraLegs.length > 0) && params?.origin && params?.destination) {
    const retFrom = (params.returnOrigin || params.destination).toUpperCase();
    const retTo = (params.returnDestination || params.origin).toUpperCase();
    summaryParts.push(`${params.origin}→${params.destination}`);
    extraLegs.forEach((l) => {
      summaryParts.push(`${l.origin.toUpperCase()}→${l.destination.toUpperCase()}`);
    });
    summaryParts.push(`${retFrom}→${retTo}`);
  } else {
    if (params?.origin) summaryParts.push(params.origin);
    if (params?.destination) summaryParts.push(params.destination);
  }
  if (params?.departureDate) summaryParts.push(params.departureDate);
  if (params?.returnDate) summaryParts.push(params.returnDate);
  const pax = [params?.adults, (params?.children ?? 0), (params?.infants ?? 0)].filter(
    (n) => n && n > 0
  );
  if (pax.length && params?.adults != null) {
    summaryParts.push(`${params.adults} ${params.adults === 1 ? t('adult') : t('adults')}`);
  }
  if (params?.cabinClass) {
    const cabinKey = params.cabinClass === 'ECONOMY' ? 'cabin_economy' : params.cabinClass === 'PREMIUM_ECONOMY' ? 'cabin_premium_economy' : params.cabinClass === 'BUSINESS' ? 'cabin_business' : 'cabin_first';
    summaryParts.push(t(cabinKey));
  }
  const summaryStr = summaryParts.join(' · ');
  const showSearchBesideResults = !isMobile;

  // Hide the top progress banner once we have results (or search finished).
  // bootstrappingSession used to stick true when create was cancelled mid-flight
  // (navigation.replace), which left the banner looping forever over real results.
  // On a fresh shared-link load the store status is still null while the first
  // poll of the URL's sessionId is in flight. That state must render as loading —
  // it used to fall through to "No flights found" for the few seconds before the
  // session resolved (or the expired-link screen appeared), which read as broken.
  const awaitingFirstPoll = !!sessionId && status == null;
  const isLoading =
    (bootstrappingSession || awaitingFirstPoll || status === 'PENDING' || status === 'PARTIAL') &&
    results.length === 0;
  const hasResults = filtered.length > 0;
  // Empty = we are on a results session, backend is not loading, and the raw list is empty
  const hasActiveSession = !!sessionId;
  const showEmpty = !isLoading && hasActiveSession && results.length === 0;
  const showNoMatch = !isLoading && results.length > 0 && filtered.length === 0;

  const makeViewCombinationHandler = (opt: PositioningOption) => () => {
    setPositioningDetails(opt);
  };

  const openPositioningLegSearch = async (origin: string, destination: string) => {
    const dep = storeParams?.departureDate;
    if (!dep || !origin.trim() || !destination.trim()) {
      Alert.alert('', t('fill_origin_destination_dates'));
      return;
    }
    try {
      const ok = await openFlyFixLegSearchInNewTab({
        origin: origin.trim().toUpperCase(),
        destination: destination.trim().toUpperCase(),
        departureDate: dep,
        cabinClass: storeParams?.cabinClass,
        adults: storeParams?.adults,
        children: storeParams?.children,
        currency: storeParams?.currency || currency,
      });
      if (!ok) {
        Alert.alert('', t('search_failed'));
      }
    } catch {
      Alert.alert('', t('search_failed'));
    }
  };

  const positioningSection = (
    <CheaperCitiesSection
      loading={positioningLoading}
      options={positioningOptions}
      isMobile={isMobile}
      folded={cheaperCitiesFolded}
      onToggleFold={() => setCheaperCitiesFolded((f) => !f)}
      onView={(hub) => {
        const opt = positioningOptions.find((o) => o.hubAirport === hub);
        if (opt) setPositioningDetails(opt);
      }}
    />
  );

  const resultsList = (
    isLoading && filtered.length === 0 ? (
      <View style={styles.listContent}>
        {[1, 2, 3, 4].map((i) => (
          <SkeletonCard key={i} theme={theme} />
        ))}
      </View>
    ) : showEmpty ? (
      <View style={styles.listContentEmpty}>
        <View
          style={[
            styles.emptyWrap,
            { backgroundColor: theme.cardBg, borderColor: theme.cardBorder },
          ]}
        >
          <View style={{ marginBottom: 12 }}>
            <AppIcon name="airplane-outline" size={48} color={theme.textMuted} fallbackText={t('no_flights_found')} />
          </View>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            {storeParams?.cabinClass && storeParams.cabinClass !== 'ECONOMY'
              ? t('no_flights_cabin')
              : t('no_flights_found')}
          </Text>
          <Text style={[styles.emptyText, { color: theme.textMuted }]}>
            {storeParams?.cabinClass && storeParams.cabinClass !== 'ECONOMY'
              ? t('no_flights_cabin_tip')
              : t('no_flights_tip')}
          </Text>
        </View>
      </View>
    ) : (
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FlightResultCard
            option={item}
            onDetails={() => openDetails(item)}
            onBook={() => handleBookFromCard(item)}
            bookLoading={bookLoadingId === item.id}
            bookLabel={isSplitBookingItinerary(item, storeParams) ? t('view_booking_options') : t('book_now')}
            tripType={tripType}
            searchReturnDate={formParams.returnDate || storeParams?.returnDate}
            passengerCount={
              (storeParams?.adults ?? 0) +
              (storeParams?.children ?? 0) +
              (storeParams?.infants ?? 0)
            }
          />
        )}
        ListEmptyComponent={
          showNoMatch ? (
            <View
              style={[
                styles.emptyWrap,
                { backgroundColor: theme.cardBg, borderColor: theme.cardBorder },
              ]}
            >
              <View style={{ marginBottom: 12 }}>
                <AppIcon name="filter-outline" size={48} color={theme.textMuted} fallbackText={t('filters')} />
              </View>
              <Text style={[styles.emptyTitle, { color: theme.text }]}>
                {t('no_flights_match')}
              </Text>
              <Text style={[styles.emptyText, { color: theme.textMuted }]}>
                {t('try_filters')}
              </Text>
            </View>
          ) : null
        }
        contentContainerStyle={
          filtered.length === 0 && !showEmpty
            ? styles.listContentEmpty
            : styles.listContent
        }
      />
    )
  );

  const editSearchForm = isDynamicDestinations ? (
    <DynamicDestinationsFormContent
      params={formParams}
      update={updateDynamicFormParams}
      updateExtra={updateDynamicExtra}
      addExtraDestination={addDynamicExtra}
      removeExtraDestination={removeDynamicExtra}
      onSearch={handleSidebarSearch}
      loading={sidebarSearchLoading}
      error={sidebarSearchError}
      compact
    />
  ) : (
    <SearchFormContent
      params={formParams}
      update={updateFormParams}
      tripType={tripType}
      setTripType={setTripType}
      onSearch={handleSidebarSearch}
      onPassengerCabinDone={() => {
        setShowEditSearchModal(false);
        handleSidebarSearch();
      }}
      loading={sidebarSearchLoading}
      error={sidebarSearchError}
      compact
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.screenBg }]}>
      <SearchSummaryBar
        summary={summaryStr || t('search_results')}
        showEditButton={isMobile}
        onEditPress={() => setShowEditSearchModal(true)}
      />

      <EditSearchModal
        visible={showEditSearchModal}
        onClose={() => setShowEditSearchModal(false)}
        title={isDynamicDestinations ? t('dd_title') : t('change_search')}
        tall={isDynamicDestinations}
      >
        {editSearchForm}
      </EditSearchModal>

      {isLoading && <SearchProgressBanner language={language} theme={theme} />}

      <View style={[styles.main, isRTL && { direction: 'rtl' }]}>
        {showSearchBesideResults ? (
          <>
            {/* RTL: Search (right) | Results (center) | Filters (left). LTR: Search (left) | Results (center) | Filters (right). */}
            {isRTL ? (
              <>
                <View style={[styles.searchColumn, styles.searchColumnRTL, { borderLeftColor: theme.cardBorder }]}>
                    <ScrollView style={styles.searchColumnScroll} contentContainerStyle={styles.searchColumnContent} keyboardShouldPersistTaps="handled">
                      {editSearchForm}
                    </ScrollView>
                </View>
                <Animated.View style={[styles.resultsColumn, { opacity: fadeAnim }]}>
                  <View style={[styles.toolbar, { backgroundColor: theme.cardBg, borderBottomColor: theme.cardBorder }]}>
                    <SortBar sortField={sortField} sortOrder={sortOrder} onSort={toggleSort} />
                  </View>
                  {resultsList}
                </Animated.View>
                <FiltersPanel
                  variant="sidebar"
                  sidebarPosition="left"
                  filters={filters}
                  onFiltersChange={(f) => searchActions.setFilters(f)}
                  results={results}
                  noResults={results.length === 0}
                  footer={positioningSection}
                />
              </>
            ) : (
              <>
                <View style={[styles.searchColumn, { borderRightColor: theme.cardBorder }]}>
                    <ScrollView style={styles.searchColumnScroll} contentContainerStyle={styles.searchColumnContent} keyboardShouldPersistTaps="handled">
                      {editSearchForm}
                    </ScrollView>
                </View>
                <Animated.View style={[styles.resultsColumn, { opacity: fadeAnim }]}>
                  <View style={[styles.toolbar, { backgroundColor: theme.cardBg, borderBottomColor: theme.cardBorder }]}>
                    <SortBar sortField={sortField} sortOrder={sortOrder} onSort={toggleSort} />
                  </View>
                  {resultsList}
                </Animated.View>
                <FiltersPanel variant="sidebar" sidebarPosition="right" filters={filters} onFiltersChange={(f) => searchActions.setFilters(f)} results={results} noResults={results.length === 0} footer={positioningSection} />
              </>
            )}
          </>
        ) : (
          <>
            {!isMobile && (
              <FiltersPanel
                variant="sidebar"
                sidebarPosition={isRTL ? 'right' : 'left'}
                filters={filters}
                onFiltersChange={(f) => searchActions.setFilters(f)}
                results={results}
                noResults={results.length === 0}
              />
            )}
            <View style={styles.resultsColumn}>
              <View
                style={[
                  styles.toolbar,
                  { backgroundColor: theme.cardBg, borderBottomColor: theme.cardBorder },
                ]}
              >
                <View style={styles.toolbarSortWrap}>
                  <SortBar sortField={sortField} sortOrder={sortOrder} onSort={toggleSort} />
                </View>
                {!isMobile && (
                  <TouchableOpacity
                    style={[styles.filtersBtn, { backgroundColor: theme.controlBg, flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6 }]}
                    onPress={() => setShowFiltersModal(true)}
                  >
                    <AppIcon name="filter-outline" size={18} color={theme.text} fallbackText={t('filters')} />
                    <Text style={[styles.filtersBtnText, { color: theme.text }]}>{t('filters')}</Text>
                  </TouchableOpacity>
                )}
              </View>
              {isMobile && (
                <TouchableOpacity
                  style={[
                    styles.filtersRowMobile,
                    { backgroundColor: theme.cardBg, borderBottomColor: theme.cardBorder },
                    isRTL && { flexDirection: 'row-reverse' },
                  ]}
                  onPress={() => setShowFiltersModal(true)}
                  activeOpacity={0.7}
                >
                  <AppIcon name="filter-outline" size={20} color={theme.primary} fallbackText={t('filters')} />
                  <Text style={[styles.filtersRowMobileText, { color: theme.primary }]}>{t('filters')}</Text>
                </TouchableOpacity>
              )}
              {isMobile && (
                <FiltersPanel
                  variant="modal"
                  visible={showFiltersModal}
                  onClose={() => setShowFiltersModal(false)}
                  filters={filters}
                  onFiltersChange={(f) => searchActions.setFilters(f)}
                  results={results}
                  noResults={results.length === 0}
                />
              )}
              <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
                {resultsList}
                {positioningSection}
              </Animated.View>
            </View>
          </>
        )}
      </View>

      {positioningDetails && (
        <HubRouteSummaryModal
          visible
          onClose={() => setPositioningDetails(null)}
          routeTitle={`${storeParams?.origin} → ${positioningDetails.hubAirport} → ${storeParams?.destination}`}
          legs={[
            {
              label: `${storeParams?.origin} → ${positioningDetails.hubAirport}`,
              amount: positioningDetails.positioningPrice.amount,
              currency: positioningDetails.positioningPrice.currency,
            },
            {
              label: `${positioningDetails.hubAirport} → ${storeParams?.destination}`,
              amount: positioningDetails.hubFlightPrice.amount,
              currency: positioningDetails.hubFlightPrice.currency,
            },
          ]}
          totalAmount={positioningDetails.totalPrice.amount}
          totalCurrency={positioningDetails.totalPrice.currency}
          directAmount={positioningDetails.savings.amount + positioningDetails.totalPrice.amount}
          directCurrency={positioningDetails.totalPrice.currency}
          savingsAmount={positioningDetails.savings.amount}
          savingsCurrency={positioningDetails.savings.currency}
          footer={
            <>
              <Text style={{ color: theme.textMuted, fontSize: 13, marginBottom: 4 }}>
                {t('positioning_split_hint')}
              </Text>
              <TouchableOpacity
                style={[styles.positioningPrimaryBtn, { backgroundColor: theme.primary }]}
                onPress={() =>
                  openPositioningLegSearch(storeParams?.origin || '', positioningDetails.hubAirport)
                }
                activeOpacity={0.8}
              >
                <Text style={[styles.positioningPrimaryBtnText, { color: '#fff' }]}>
                  {t('search_route_leg')
                    .replace('{from}', storeParams?.origin || '')
                    .replace('{to}', positioningDetails.hubAirport)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.positioningPrimaryBtn, { backgroundColor: theme.primary }]}
                onPress={() =>
                  openPositioningLegSearch(positioningDetails.hubAirport, storeParams?.destination || '')
                }
                activeOpacity={0.8}
              >
                <Text style={[styles.positioningPrimaryBtnText, { color: '#fff' }]}>
                  {t('search_route_leg')
                    .replace('{from}', positioningDetails.hubAirport)
                    .replace('{to}', storeParams?.destination || '')}
                </Text>
              </TouchableOpacity>
            </>
          }
        />
      )}

      <FlightDetailsModal
        visible={detailsOption != null}
        onClose={closeDetails}
        sessionId={sessionId}
        option={detailsOption}
        searchParams={storeParams}
        passengerCount={
          (storeParams?.adults ?? 0) +
          (storeParams?.children ?? 0) +
          (storeParams?.infants ?? 0)
        }
      />

      <SearchLoadingOverlay
        visible={sidebarSearchLoading}
        origin={formParams.origin || storeParams?.origin}
        destination={formParams.destination || storeParams?.destination}
      />

      {showSlowPopup && (
        <View
          style={[
            styles.slowPopup,
            { backgroundColor: theme.cardBg, borderColor: theme.cardBorder },
          ]}
        >
          <View style={styles.slowPopupRow}>
            <AppIcon name="time-outline" size={14} color={theme.textMuted} fallbackText="" />
            <Text style={[styles.slowPopupText, { color: theme.textMuted }]}>
              {t('results_slow_hint')}
            </Text>
            <TouchableOpacity
              onPress={() => setShowSlowPopup(false)}
              style={styles.slowPopupClose}
              activeOpacity={0.7}
            >
              <AppIcon name="close" size={14} color={theme.textMuted} fallbackText={t('close')} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  summaryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  summaryText: { fontSize: 14, fontWeight: '600', flex: 1 },
  editSearchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    gap: 5,
  },
  editSearchBtnText: { fontSize: 13, fontWeight: '600' },

  editSearchOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  editSearchModalCard: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '90%',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  editSearchModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
  },
  editSearchModalTitle: { fontSize: 18, fontWeight: '700' },
  editSearchModalClose: { padding: 6 },
  editSearchModalCloseText: { fontSize: 20 },
  editSearchModalScroll: { maxHeight: 480 },
  editSearchModalScrollTall: { maxHeight: 640 },
  editSearchModalContent: { padding: 18, paddingBottom: 28 },

  searchColumn: {
    width: 280,
    minWidth: 240,
    maxWidth: 340,
    borderRightWidth: 1,
  },
  searchColumnRTL: { borderRightWidth: 0, borderLeftWidth: 1 },
  searchColumnScroll: { flex: 1 },
  searchColumnContent: { padding: 14, paddingBottom: 28 },

  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  bannerText: { marginLeft: 10, fontSize: 13, fontWeight: '500' },

  main: { flex: 1, flexDirection: 'row' },
  resultsColumn: { flex: 1, minWidth: 0 },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    zIndex: 10,
    position: 'sticky' as any,
    top: 0,
    minWidth: 0,
    overflow: 'hidden',
    paddingHorizontal: 8,
  },
  toolbarSortWrap: {
    flex: 1,
    minWidth: 0,
  },
  filtersBtn: {
    flexShrink: 0,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginLeft: 4,
  },
  filtersBtnText: { fontSize: 13, fontWeight: '600' },

  filtersRowMobile: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  filtersRowMobileText: { fontSize: 15, fontWeight: '600' },

  listContent: { paddingVertical: 6, paddingBottom: 20 },
  listContentEmpty: { flex: 1, justifyContent: 'center', padding: 24 },
  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    borderRadius: 16,
    borderWidth: 1,
  },
  emptyTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8, textAlign: 'center' },
  emptyText: { fontSize: 14, textAlign: 'center', paddingHorizontal: 24, lineHeight: 20 },
  retryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
  },
  retryBtnText: { fontSize: 15, fontWeight: '600' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  error: { fontSize: 18 },

  positioningSection: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 4,
  },
  positioningHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  positioningTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  positioningFoldTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  positioningFoldTriggerText: {
    fontSize: 12,
    fontWeight: '600',
  },
  positioningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 7,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 4,
    gap: 6,
  },
  positioningHub: {
    fontSize: 13,
    fontWeight: '600',
  },
  positioningMeta: {
    fontSize: 11,
  },
  positioningBtn: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 999,
  },
  positioningBtnText: {
    fontSize: 11,
    fontWeight: '600',
  },
  positioningPrimaryBtn: {
    marginTop: 8,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  positioningPrimaryBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  slowPopup: {
    position: 'absolute',
    right: 12,
    bottom: 20,
    maxWidth: 320,
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  slowPopupRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slowPopupText: {
    flex: 1,
    fontSize: 11,
    marginHorizontal: 6,
  },
  slowPopupClose: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
});
