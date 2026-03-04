import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import type { FlightOption } from '../../../types';
import { useTheme } from '../../../theme/ThemeContext';
import { useSearchStore, searchActions } from '../../../store';
import { getSearchSessionResults } from '../../../api';
import { getAirlineName } from '../../../data/airlines';
import { useIsMobile } from '../../../hooks/useResponsive';
import { SortBar } from '../components/SortBar';
import { FiltersPanel } from '../components/FiltersPanel';
import { FlightDetailsModal } from '../components/FlightDetailsModal';

const POLL_INTERVAL_MS = 1500;

function formatDuration(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}h ${m}m`;
}

function baggageBadgeText(baggageClass: FlightOption['baggageClass']): string {
  if (!baggageClass) return 'Checked bag: Unknown';
  if (baggageClass === 'BAG_OK') return 'Checked bag: Not included';
  if (baggageClass === 'BAG_INCLUDED') return 'Checked bag: Included';
  return 'Checked bag: Unknown';
}

function FlightCard({
  option,
  onPress,
  theme,
}: {
  option: FlightOption;
  onPress: () => void;
  theme: import('../../../theme/ThemeContext').Theme;
}) {
  const stops = option.legs.reduce((acc, leg) => acc + leg.segments.length - 1, 0);
  const validatingCode = option.validatingAirlines?.[0];
  const validatingName = getAirlineName(validatingCode) ?? validatingCode ?? 'Flight';

  return (
    <TouchableOpacity
      style={[cardStyles.card, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={cardStyles.header}>
        <View style={{ flex: 1 }}>
          <Text style={[cardStyles.price, { color: theme.primary }]}>
            {option.price.currency} {option.price.amount.toFixed(2)}
          </Text>
          <Text style={[cardStyles.airline, { color: theme.text }]}>{validatingName}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={[cardStyles.duration, { color: theme.textMuted }]}>
            {formatDuration(option.durationMinutes)}
          </Text>
          <Text style={[cardStyles.stops, { color: theme.textMuted }]}>
            {stops === 0 ? 'Direct' : `${stops} stop(s)`}
          </Text>
        </View>
      </View>
      {option.baggageClass != null && (
        <View style={cardStyles.badgeRow}>
          <Text style={[cardStyles.badge, { color: theme.textMuted, borderColor: theme.cardBorder }]}>
            Cabin bag: 1
          </Text>
          <Text style={[cardStyles.badge, { color: theme.textMuted, borderColor: theme.cardBorder }]}>
            {baggageBadgeText(option.baggageClass)}
          </Text>
        </View>
      )}
      <Text style={[cardStyles.viewDetails, { color: theme.primary }]}>View details →</Text>
    </TouchableOpacity>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  price: { fontSize: 22, fontWeight: '700' },
  airline: { marginTop: 4, fontSize: 15, fontWeight: '500' },
  duration: { fontSize: 16 },
  stops: { fontSize: 14 },
  badgeRow: { flexDirection: 'row', marginTop: 10, gap: 10, flexWrap: 'wrap' },
  badge: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  viewDetails: { marginTop: 12, fontSize: 15, fontWeight: '600' },
});

function SkeletonCard({ theme }: { theme: import('../../../theme/ThemeContext').Theme }) {
  return (
    <View style={[cardStyles.card, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
      <View style={[skeletonStyles.line, { backgroundColor: theme.controlBg }]} />
      <View style={[skeletonStyles.lineShort, { backgroundColor: theme.controlBg }]} />
      <View style={skeletonStyles.row}>
        <View style={[skeletonStyles.lineShort, { backgroundColor: theme.controlBg }]} />
        <View style={[skeletonStyles.lineShort, { backgroundColor: theme.controlBg }]} />
      </View>
    </View>
  );
}

const skeletonStyles = StyleSheet.create({
  line: { height: 24, borderRadius: 6, width: '60%', marginBottom: 12 },
  lineShort: { height: 16, borderRadius: 4, width: 80 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
});

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
    // best: by score descending (higher = better)
    const scoreA = a.score ?? 0;
    const scoreB = b.score ?? 0;
    return scoreB - scoreA;
  });
}

export function ResultsScreen({ route }: { route: { params: { sessionId: string } } }) {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const { sessionId } = route.params;
  const {
    params,
    results,
    status,
    sortField,
    sortOrder,
    filters,
  } = useSearchStore();
  const versionRef = useRef(0);
  const [detailsOption, setDetailsOption] = useState<FlightOption | null>(null);
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      if (cancelled) return;
      try {
        const res = await getSearchSessionResults(
          sessionId,
          versionRef.current || undefined
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
  }, [sessionId, status]);

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
          Search failed or session expired.
        </Text>
      </View>
    );
  }

  const summaryParts: string[] = [];
  if (params?.origin) summaryParts.push(params.origin);
  if (params?.destination) summaryParts.push(params.destination);
  if (params?.departureDate) summaryParts.push(params.departureDate);
  if (params?.returnDate) summaryParts.push(params.returnDate);
  const pax = [params?.adults, (params?.children ?? 0), (params?.infants ?? 0)].filter(
    (n) => n && n > 0
  );
  if (pax.length) summaryParts.push(`${params?.adults} adult(s)`);
  if (params?.cabinClass) summaryParts.push(params.cabinClass.replace('_', ' '));
  const summaryStr = summaryParts.join(' · ');

  const isLoading = status === 'PENDING' || status === 'PARTIAL';
  const hasResults = filtered.length > 0;
  const showEmpty = !isLoading && results.length === 0;
  const showNoMatch = !isLoading && results.length > 0 && filtered.length === 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.screenBg }]}>
      {/* Sticky search summary bar */}
      <View
        style={[
          styles.summaryBar,
          { backgroundColor: theme.cardBg, borderBottomColor: theme.cardBorder },
        ]}
      >
        <Text style={[styles.summaryText, { color: theme.text }]} numberOfLines={2}>
          {summaryStr || 'Search results'}
        </Text>
      </View>

      {/* Loading banner */}
      {isLoading && (
        <View
          style={[
            styles.banner,
            { backgroundColor: theme.isDark ? theme.controlBg : '#e0e7ff' },
          ]}
        >
          <ActivityIndicator size="small" color={theme.primary} />
          <Text style={[styles.bannerText, { color: theme.primary }]}>
            Loading more results…
          </Text>
        </View>
      )}

      <View style={styles.main}>
        {/* Filters: sidebar (desktop) or button (mobile) */}
        {!isMobile && (
          <FiltersPanel
            variant="sidebar"
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
            <SortBar
              sortField={sortField}
              sortOrder={sortOrder}
              onSort={toggleSort}
            />
            {isMobile && (
              <TouchableOpacity
                style={[styles.filtersBtn, { backgroundColor: theme.controlBg }]}
                onPress={() => setShowFiltersModal(true)}
              >
                <Text style={[styles.filtersBtnText, { color: theme.text }]}>Filters</Text>
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

          {isLoading && filtered.length === 0 ? (
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
              <FlightCard
                option={item}
                onPress={() => setDetailsOption(item)}
                theme={theme}
              />
            )}
            ListEmptyComponent={
              showEmpty ? (
                <View style={styles.emptyWrap}>
                  <ActivityIndicator size="large" color={theme.primary} />
                  <Text style={[styles.emptyText, { color: theme.textMuted }]}>
                    Searching for flights…
                  </Text>
                </View>
              ) : showNoMatch ? (
                <View style={styles.emptyWrap}>
                  <Text style={[styles.emptyTitle, { color: theme.text }]}>
                    No flights match your filters
                  </Text>
                  <Text style={[styles.emptyText, { color: theme.textMuted }]}>
                    Try changing stops or airlines in Filters.
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
          )}
        </View>
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
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  summaryText: { fontSize: 16, fontWeight: '600' },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  bannerText: { marginLeft: 12, fontSize: 16 },
  main: { flex: 1, flexDirection: 'row' },
  resultsColumn: { flex: 1, minWidth: 0 },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  filtersBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  filtersBtnText: { fontSize: 15, fontWeight: '600' },
  listContent: { paddingVertical: 12, paddingBottom: 32 },
  listContentEmpty: { flexGrow: 1, justifyContent: 'center', padding: 32 },
  emptyWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8, textAlign: 'center' },
  emptyText: { fontSize: 16, textAlign: 'center' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  error: { fontSize: 18 },
});
