import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import type { FlightOption } from '../../../types';
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

const POLL_INTERVAL_MS = 1500;

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

export function ResultsScreen({ route }: { route: { params: { sessionId: string } } }) {
  const { theme } = useTheme();
  const { currency, locale, t, isRTL } = useLocale();
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

  useEffect(() => {
    if (results.length > 0) {
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [results.length]);

  const filtered = useMemo(() => {
    let list = results;
    if (filters.maxStops != null) {
      list = list.filter((opt) => {
        const stops = opt.legs.reduce((acc, leg) => acc + leg.segments.length - 1, 0);
        return stops <= filters.maxStops!;
      });
    }
    if (filters.airlines.length > 0) {
      const set = new Set(filters.airlines);
      list = list.filter((opt) =>
        opt.legs.every((leg) =>
          leg.segments.some((seg) => set.has(seg.marketingCarrier.code))
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
  const showEmpty = !isLoading && results.length === 0;
  const showNoMatch = !isLoading && results.length > 0 && filtered.length === 0;

  const resultsList = (
    isLoading && filtered.length === 0 ? (
      <View style={styles.listContent}>
        {[1, 2, 3, 4].map((i) => (
          <SkeletonCard key={i} theme={theme} />
        ))}
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
          />
        )}
        ListEmptyComponent={
          showEmpty ? (
            <View style={styles.emptyWrap}>
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
          ) : showNoMatch ? (
            <View style={styles.emptyWrap}>
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

      {isLoading && (
        <View style={[styles.banner, { backgroundColor: theme.isDark ? theme.controlBg : '#eef2ff' }]}>
          <ActivityIndicator size="small" color={theme.primary} />
          <Text style={[styles.bannerText, { color: theme.primary }]}>
            {t('loading_more_results')}
          </Text>
        </View>
      )}

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
                <FiltersPanel variant="sidebar" sidebarPosition="right" filters={filters} onFiltersChange={(f) => searchActions.setFilters(f)} results={results} noResults={results.length === 0} />
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
                <SortBar sortField={sortField} sortOrder={sortOrder} onSort={toggleSort} />
                {isMobile && (
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
              <Animated.View style={{ flex: 1, opacity: fadeAnim }}>{resultsList}</Animated.View>
            </View>
          </>
        )}
      </View>

      <FlightDetailsModal
        visible={detailsOption != null}
        onClose={() => setDetailsOption(null)}
        sessionId={sessionId}
        option={detailsOption}
      />
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
  },
  filtersBtn: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
  },
  filtersBtnText: { fontSize: 13, fontWeight: '600' },

  listContent: { paddingVertical: 6, paddingBottom: 20 },
  listContentEmpty: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  emptyWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8, textAlign: 'center' },
  emptyText: { fontSize: 14, textAlign: 'center', paddingHorizontal: 24, lineHeight: 20 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  error: { fontSize: 18 },
});
