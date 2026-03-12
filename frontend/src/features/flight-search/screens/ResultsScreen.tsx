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
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { FlightOption, MonetaryAmount } from '../../../types';
import type { CreateSearchSessionRequest } from '../../../types';
import { useTheme } from '../../../theme/ThemeContext';
import { useLocale } from '../../../context/LocaleContext';
import { useSearchStore, searchActions } from '../../../store';
import type { LocaleContextValue } from '../../../context/LocaleContext';
import { getSearchSessionResults, createSearchSession, getUniformBookingRedirectUrl } from '../../../api';
import { setCachedSearch } from '../../../utils/searchCache';
import { useIsMobile } from '../../../hooks/useResponsive';
import { useSearchParams } from '../../../hooks/useSearchParams';
import { SortBar } from '../components/SortBar';
import { FiltersPanel } from '../components/FiltersPanel';
import { FlightDetailsModal } from '../components/FlightDetailsModal';
import { FlightResultCard } from '../components/FlightResultCard';
import { SearchFormContent } from '../components/SearchFormContent';
import { SearchLoadingOverlay } from '../../../components/SearchLoadingOverlay';

const POLL_INTERVAL_MS = 1500;

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

const LOADING_PHRASES: Record<string, string[]> = {
  en: [
    'Searching hundreds of airlines…',
    'Comparing prices across providers…',
    'Checking direct and connecting flights…',
    'Finding the best fares…',
    'Almost done…',
  ],
  he: [
    'מחפש מאות חברות תעופה…',
    'משווה מחירים בין ספקים…',
    'בודק טיסות ישירות ועם עצירות…',
    'מוצא את המחירים הטובים…',
    'עוד רגע…',
  ],
  ru: [
    'Ищем сотни авиакомпаний…',
    'Сравниваем цены у провайдеров…',
    'Проверяем прямые и стыковочные рейсы…',
    'Ищем лучшие тарифы…',
    'Почти готово…',
  ],
};

function LoadingBanner({ language, theme }: {
  language: string;
  theme: import('../../../theme/ThemeContext').Theme;
}) {
  const phrases = LOADING_PHRASES[language] ?? LOADING_PHRASES.en;
  const [phraseIdx, setPhraseIdx] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(progressAnim, { toValue: 1, duration: 2200, useNativeDriver: false }),
        Animated.timing(progressAnim, { toValue: 0, duration: 0, useNativeDriver: false }),
      ])
    ).start();

    const cycle = () => {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
      setPhraseIdx((i) => (i + 1) % phrases.length);
    };
    const id = setInterval(cycle, 2200);
    return () => { clearInterval(id); progressAnim.stopAnimation(); };
  }, [phrases.length]);

  const progressWidth = progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['5%', '100%'] });

  return (
    <View style={[lb.wrap, { backgroundColor: theme.isDark ? theme.controlBg : '#eef2ff' }]}>
      <View style={[lb.track, { backgroundColor: theme.isDark ? '#334' : '#dde4ff' }]}>
        <Animated.View style={[lb.fill, { width: progressWidth, backgroundColor: theme.primary }]} />
      </View>
      <View style={lb.row}>
        <ActivityIndicator size="small" color={theme.primary} />
        <Animated.Text style={[lb.text, { color: theme.primary, opacity: fadeAnim }]}>
          {phrases[phraseIdx]}
        </Animated.Text>
      </View>
    </View>
  );
}

const lb = StyleSheet.create({
  wrap: { paddingTop: 6, paddingBottom: 10, paddingHorizontal: 14 },
  track: { height: 3, borderRadius: 2, overflow: 'hidden', marginBottom: 8 },
  fill: { height: 3, borderRadius: 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  text: { fontSize: 13, fontWeight: '500', flex: 1 },
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

export function ResultsScreen({ route }: { route: { params: { sessionId: string } } }) {
  const { theme } = useTheme();
  const { currency, locale, t, isRTL, language } = useLocale();
  const { updateUrl } = useSearchParams();
  const navigation = useNavigation<any>();
  const isMobile = useIsMobile();
  const { sessionId } = route.params;
  const {
    params: storeParams,
    results,
    status,
    sortField,
    sortOrder,
    filters,
  } = useSearchStore();
  const versionRef = useRef(0);
  const prevSessionIdRef = useRef<string | null>(null);
  const [detailsOption, setDetailsOption] = useState<FlightOption | null>(null);
  const [bookLoadingId, setBookLoadingId] = useState<string | null>(null);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [showEditSearchModal, setShowEditSearchModal] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleBookFromCard = async (option: FlightOption) => {
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

  useEffect(() => {
    if (storeParams) {
      setFormParams((p) => ({ ...defaultFormParams, ...p, ...storeParams }));
      setTripType(storeParams.returnDate ? 'round-trip' : 'one-way');
    }
  }, [sessionId, storeParams?.origin, storeParams?.destination, storeParams?.departureDate, storeParams?.returnDate]);

  const updateFormParams = <K extends keyof CreateSearchSessionRequest>(
    key: K,
    value: CreateSearchSessionRequest[K]
  ) => setFormParams((prev) => ({ ...prev, [key]: value }));

  const handleSidebarSearch = async () => {
    const p = formParams;
    if (!p.origin.trim() || !p.destination.trim() || !p.departureDate) {
      setSidebarSearchError(t('fill_origin_destination_dates'));
      return;
    }
    if (tripType === 'round-trip' && !p.returnDate) {
      setSidebarSearchError(t('choose_return_date'));
      return;
    }
    setSidebarSearchError(null);
    setSidebarSearchLoading(true);
    try {
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
        includeCheckedBag: p.includeCheckedBag ?? false,
        currency: currency || 'USD',
        locale: locale || 'en-US',
      };
      setCachedSearch(payload);
      searchActions.setParams(payload);
      const session = await createSearchSession(payload);
      searchActions.setSession(session.id, session, session.status);
      searchActions.setResults([], 0);
      setShowEditSearchModal(false);
      updateUrl({ ...payload, sessionId: session.id });
      navigation.navigate('Results', { sessionId: session.id });
    } catch (e) {
      setSidebarSearchError(e instanceof Error ? e.message : 'Search failed');
    } finally {
      setSidebarSearchLoading(false);
    }
  };

  useEffect(() => {
    if (prevSessionIdRef.current !== sessionId) {
      prevSessionIdRef.current = sessionId;
      versionRef.current = 0;
    }
  }, [sessionId]);

  useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      if (cancelled) return;
      try {
        const sinceVersion = versionRef.current > 0 ? versionRef.current : undefined;
        const res = await getSearchSessionResults(
          sessionId,
          sinceVersion,
          storeParams ?? undefined
        );
        if (cancelled) return;
        versionRef.current = res.version;
        searchActions.setSession(sessionId, res.session, res.session.status);
        searchActions.appendResults(res.results, res.version);
      } catch (_) {
        // keep polling on transient errors
      }
    };
    const id = setInterval(() => {
      if (status === 'COMPLETE' || status === 'FAILED') {
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
  }, [sessionId, status, storeParams]);

  useEffect(() => {
    if (sessionId && storeParams) {
      updateUrl({ ...storeParams, sessionId });
    }
  }, [sessionId, storeParams, updateUrl]);

  // Frontend debug: log how many positioning options we received.
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('[POSITIONING_FRONTEND]', positioningOptions?.length ?? 0);
  }, [positioningOptions?.length]);

  // Reset positioning options when the session changes.
  useEffect(() => {
    setPositioningOptions([]);
    optimizerSessionRef.current = null;
  }, [sessionId]);

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

    for (const hub of HUB_AIRPORTS) {
      if (hub === origin.toUpperCase() || hub === destination.toUpperCase()) continue;
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

        const [positioning, hubFlight] = await Promise.all([
          findCheapestOptionForParams({
            ...(baseOpts as CreateSearchSessionRequest),
            origin: origin.toUpperCase(),
            destination: hub,
            departureDate,
          }),
          findCheapestOptionForParams({
            ...(baseOpts as CreateSearchSessionRequest),
            origin: hub,
            destination: destination.toUpperCase(),
            departureDate,
          }),
        ]);

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
    setPositioningOptions(found);
    setPositioningLoading(false);
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
        return maxPerLeg <= filters.maxStops!;
      });
    }
    if (filters.airlines.length > 0) {
      const set = new Set(filters.airlines);
      // Match if ANY leg contains the selected airline (not every leg — round-trips use different carriers per leg)
      list = list.filter((opt) =>
        opt.legs.some((leg) =>
          leg.segments.some((seg) => set.has(seg.marketingCarrier?.code))
        )
      );
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

  if (status === 'FAILED') {
    return (
      <View style={[styles.centered, { backgroundColor: theme.screenBg }]}>
        <Text style={[styles.error, { color: theme.error }]}>
          {t('search_failed_expired')}
        </Text>
      </View>
    );
  }

  const params = storeParams;
  const summaryParts: string[] = [];
  if (params?.origin) summaryParts.push(params.origin);
  if (params?.destination) summaryParts.push(params.destination);
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

  const isLoading = status === 'PENDING' || status === 'PARTIAL';
  const hasResults = filtered.length > 0;
  // Empty = we are on a results session, backend is not loading, and the raw list is empty
  const hasActiveSession = !!sessionId;
  const showEmpty = !isLoading && hasActiveSession && results.length === 0;
  const showNoMatch = !isLoading && results.length > 0 && filtered.length === 0;

  const [showSlowPopup, setShowSlowPopup] = useState(false);
  const slowPopupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fade in whenever we have any visual content (results, empty-state, or no-match)
  useEffect(() => {
    const hasVisualContent = results.length > 0 || showEmpty || showNoMatch;
    if (hasVisualContent) {
      Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [results.length, showEmpty, showNoMatch, fadeAnim]);

  useEffect(() => {
    const loading = status === 'PENDING' || status === 'PARTIAL';

    // If we are no longer loading, clear any timer and hide popup.
    if (!loading) {
      setShowSlowPopup(false);
      if (slowPopupTimerRef.current) {
        clearTimeout(slowPopupTimerRef.current);
        slowPopupTimerRef.current = null;
      }
      return;
    }

    // Already scheduled or already visible – do nothing.
    if (slowPopupTimerRef.current || showSlowPopup) {
      return;
    }

    // Show hint if we stay loading for more than 10 seconds.
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

  const makeViewCombinationHandler = (opt: PositioningOption) => () => {
    setPositioningDetails(opt);
  };

  const positioningSection =
    positioningLoading ? (
      <View style={styles.positioningSection}>
        <Text style={[styles.positioningTitle, { color: theme.textMuted }]}>
          Searching for cheaper departure cities…
        </Text>
      </View>
    ) : positioningOptions && positioningOptions.length > 0 ? (
      <View style={styles.positioningSection}>
        <Text style={[styles.positioningTitle, { color: theme.text }]}>
          Cheaper departure cities
        </Text>
        {positioningOptions.map((opt) => (
          <View
            key={opt.hubAirport}
            style={[styles.positioningRow, { borderColor: theme.cardBorder }]}
          >
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={[styles.positioningHub, { color: theme.text }]}>
                {opt.hubAirport}
              </Text>
              <Text style={[styles.positioningMeta, { color: theme.textMuted }]}>
                {opt.totalPrice.currency} {opt.totalPrice.amount.toFixed(0)} · save{' '}
                {opt.savings.currency} {opt.savings.amount.toFixed(0)}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.positioningBtn, { backgroundColor: theme.controlBg }]}
              onPress={makeViewCombinationHandler(opt)}
              activeOpacity={0.7}
            >
              <Text style={[styles.positioningBtnText, { color: theme.primary }]}>
                View
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    ) : null;

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
            <Ionicons name="airplane-outline" size={48} color={theme.textMuted} />
          </View>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            {t('no_flights_found')}
          </Text>
          <Text style={[styles.emptyText, { color: theme.textMuted }]}>
            {t('no_flights_tip')}
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
            onDetails={() => setDetailsOption(item)}
            onBook={() => handleBookFromCard(item)}
            bookLoading={bookLoadingId === item.id}
            bookLabel={t('book_now')}
            tripType={tripType}
            searchReturnDate={formParams.returnDate || storeParams?.returnDate}
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
                <Ionicons name="filter-outline" size={48} color={theme.textMuted} />
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

  return (
    <View style={[styles.container, { backgroundColor: theme.screenBg }]}>
      {/* Summary bar */}
      <View
        style={[
          styles.summaryBar,
          { backgroundColor: theme.cardBg, borderBottomColor: theme.cardBorder },
          isRTL && { flexDirection: 'row-reverse' },
        ]}
      >
        <Text style={[styles.summaryText, { color: theme.text }]} numberOfLines={1}>
          {summaryStr || t('search_results')}
        </Text>
        <TouchableOpacity
          style={[styles.editSearchBtn, { borderColor: theme.cardBorder, flexDirection: isRTL ? 'row-reverse' : 'row' }]}
          onPress={() => setShowEditSearchModal(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="create-outline" size={16} color={theme.primary} />
          <Text style={[styles.editSearchBtnText, { color: theme.primary }]}>{t('edit_search')}</Text>
        </TouchableOpacity>
      </View>

      {/* Edit search popup modal */}
      <Modal visible={showEditSearchModal} transparent animationType="fade">
        <View style={styles.editSearchOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setShowEditSearchModal(false)} />
          <View style={[styles.editSearchModalCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
            <View style={[styles.editSearchModalHeader, { borderBottomColor: theme.cardBorder }]}>
              <Text style={[styles.editSearchModalTitle, { color: theme.text }]}>{t('change_search')}</Text>
              <TouchableOpacity onPress={() => setShowEditSearchModal(false)} style={styles.editSearchModalClose}>
                <Ionicons name="close" size={24} color={theme.textMuted} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.editSearchModalScroll} contentContainerStyle={styles.editSearchModalContent} keyboardShouldPersistTaps="handled">
              <SearchFormContent
                params={formParams}
                update={updateFormParams}
                tripType={tripType}
                setTripType={setTripType}
                onSearch={handleSidebarSearch}
                loading={sidebarSearchLoading}
                error={sidebarSearchError}
                compact
              />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {isLoading && <LoadingBanner language={language} theme={theme} />}

      <View style={[styles.main, isRTL && { direction: 'rtl' }]}>
        {showSearchBesideResults ? (
          <>
            {/* RTL: Search (right) | Results (center) | Filters (left). LTR: Search (left) | Results (center) | Filters (right). */}
            {isRTL ? (
              <>
                <View style={[styles.searchColumn, styles.searchColumnRTL, { borderLeftColor: theme.cardBorder }]}>
                  <ScrollView style={styles.searchColumnScroll} contentContainerStyle={styles.searchColumnContent} keyboardShouldPersistTaps="handled">
                    <SearchFormContent params={formParams} update={updateFormParams} tripType={tripType} setTripType={setTripType} onSearch={handleSidebarSearch} loading={sidebarSearchLoading} error={sidebarSearchError} compact />
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
                    <SearchFormContent params={formParams} update={updateFormParams} tripType={tripType} setTripType={setTripType} onSearch={handleSidebarSearch} loading={sidebarSearchLoading} error={sidebarSearchError} compact />
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
                    <Ionicons name="filter-outline" size={18} color={theme.text} />
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
                  <Ionicons name="filter-outline" size={20} color={theme.primary} />
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
        <Modal visible transparent animationType="fade">
          <View style={styles.editSearchOverlay}>
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={() => setPositioningDetails(null)}
            />
            <View
              style={[
                styles.editSearchModalCard,
                { backgroundColor: theme.cardBg, borderColor: theme.cardBorder },
              ]}
            >
              <View
                style={[
                  styles.editSearchModalHeader,
                  { borderBottomColor: theme.cardBorder },
                ]}
              >
                <Text style={[styles.editSearchModalTitle, { color: theme.text }]}>
                  Cheaper departure route
                </Text>
                <TouchableOpacity
                  onPress={() => setPositioningDetails(null)}
                  style={styles.editSearchModalClose}
                >
                  <Ionicons name="close" size={24} color={theme.textMuted} />
                </TouchableOpacity>
              </View>
              <ScrollView
                style={styles.editSearchModalScroll}
                contentContainerStyle={styles.editSearchModalContent}
              >
                <Text style={{ color: theme.text, fontSize: 14, marginBottom: 12 }}>
                  {storeParams?.origin} → {positioningDetails.hubAirport} →{' '}
                  {storeParams?.destination}
                </Text>
                <Text style={{ color: theme.textMuted, fontSize: 13, marginBottom: 16 }}>
                  Total: {positioningDetails.totalPrice.currency}{' '}
                  {positioningDetails.totalPrice.amount.toFixed(0)} · Save{' '}
                  {positioningDetails.savings.currency}{' '}
                  {positioningDetails.savings.amount.toFixed(0)} vs. cheapest direct
                </Text>

                <Text style={{ color: theme.text, fontWeight: '600', marginBottom: 6 }}>
                  Leg 1 – Positioning
                </Text>
                <Text style={{ color: theme.textMuted, fontSize: 13, marginBottom: 4 }}>
                  {storeParams?.origin} → {positioningDetails.hubAirport}{' '}
                  ({positioningDetails.positioningPrice.currency}{' '}
                  {positioningDetails.positioningPrice.amount.toFixed(0)})
                </Text>

                <Text style={{ color: theme.text, fontWeight: '600', marginTop: 12, marginBottom: 6 }}>
                  Leg 2 – Main flight
                </Text>
                <Text style={{ color: theme.textMuted, fontSize: 13, marginBottom: 16 }}>
                  {positioningDetails.hubAirport} → {storeParams?.destination}{' '}
                  ({positioningDetails.hubFlightPrice.currency}{' '}
                  {positioningDetails.hubFlightPrice.amount.toFixed(0)})
                </Text>

                <TouchableOpacity
                  style={[
                    styles.positioningPrimaryBtn,
                    { backgroundColor: theme.primary },
                  ]}
                  onPress={async () => {
                    try {
                      const url1 = getUniformBookingRedirectUrl(
                        positioningDetails.positioningSessionId,
                        positioningDetails.positioningOptionId,
                        results.find((r) => r.id === positioningDetails.positioningOptionId) ||
                          results[0]
                      );
                      const url2 = getUniformBookingRedirectUrl(
                        positioningDetails.hubSessionId,
                        positioningDetails.hubOptionId,
                        results.find((r) => r.id === positioningDetails.hubOptionId) ||
                          results[0]
                      );
                      const canOpen1 = await Linking.canOpenURL(url1);
                      if (canOpen1) await Linking.openURL(url1);
                      const canOpen2 = await Linking.canOpenURL(url2);
                      if (canOpen2) await Linking.openURL(url2);
                    } catch {
                      Alert.alert('', 'Cannot open booking links for this combination.');
                    }
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.positioningPrimaryBtnText, { color: '#fff' }]}>
                    Book both legs on partner sites
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

      <FlightDetailsModal
        visible={detailsOption != null}
        onClose={() => setDetailsOption(null)}
        sessionId={sessionId}
        option={detailsOption}
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
            <Ionicons name="time-outline" size={14} color={theme.textMuted} />
            <Text style={[styles.slowPopupText, { color: theme.textMuted }]}>
              {t('results_slow_hint')}
            </Text>
            <TouchableOpacity
              onPress={() => setShowSlowPopup(false)}
              style={styles.slowPopupClose}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={14} color={theme.textMuted} />
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
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  error: { fontSize: 18 },

  positioningSection: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 4,
  },
  positioningTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 6,
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
