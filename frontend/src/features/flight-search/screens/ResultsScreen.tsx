import React, { useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import type { FlightOption, FlightSegment } from '../../../types';
import { useTheme } from '../../../theme/ThemeContext';
import { useSearchStore, searchActions } from '../../../store';
import { getSearchSessionResults } from '../../../api';
import type { SortField, SortOrder } from '../../../store/searchStore';

const POLL_INTERVAL_MS = 1500;

function formatDuration(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}h ${m}m`;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function SegmentRow({ seg, theme }: { seg: FlightSegment; theme?: import('../../../theme/ThemeContext').Theme }) {
  const t = theme;
  return (
    <View style={segmentStyles.row}>
      <Text style={[segmentStyles.code, t && { color: t.text }]}>{seg.from.code}</Text>
      <Text style={[segmentStyles.time, t && { color: t.textMuted }]}>{formatTime(seg.departureTime)}</Text>
      <Text style={segmentStyles.dash}>→</Text>
      <Text style={[segmentStyles.code, t && { color: t.text }]}>{seg.to.code}</Text>
      <Text style={[segmentStyles.time, t && { color: t.textMuted }]}>{formatTime(seg.arrivalTime)}</Text>
      <Text style={[segmentStyles.carrier, t && { color: t.textMuted }]}>
        {seg.marketingCarrier.name || seg.marketingCarrier.code} {seg.flightNumber}
      </Text>
    </View>
  );
}

function FlightCard({
  option,
  expanded,
  onPress,
  theme,
}: {
  option: FlightOption;
  expanded: boolean;
  onPress: () => void;
  theme: import('../../../theme/ThemeContext').Theme;
}) {
  const stops = option.legs.reduce((acc, leg) => acc + leg.segments.length - 1, 0);
  return (
    <TouchableOpacity style={[cardStyles.card, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]} onPress={onPress} activeOpacity={0.8}>
      <View style={cardStyles.header}>
        <Text style={[cardStyles.price, { color: theme.primary }]}>
          {option.price.currency} {option.price.amount.toFixed(2)}
        </Text>
        <Text style={[cardStyles.duration, { color: theme.textMuted }]}>{formatDuration(option.durationMinutes)}</Text>
        <Text style={[cardStyles.stops, { color: theme.textMuted }]}>{stops === 0 ? 'Direct' : `${stops} stop(s)`}</Text>
      </View>
      {expanded && (
        <View style={[cardStyles.details, { borderTopColor: theme.cardBorder }]}>
          {option.legs.map((leg, i) => (
            <View key={i}>
              <Text style={[cardStyles.legLabel, { color: theme.text }]}>
                {option.legs.length > 1 ? (i === 0 ? 'Outbound' : 'Return') : 'Flight'}
              </Text>
              {leg.segments.map((seg, j) => (
                <SegmentRow key={j} seg={seg} theme={theme} />
              ))}
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}

const segmentStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginVertical: 6, flexWrap: 'wrap' },
  code: { fontWeight: '700', marginRight: 10, fontSize: 16 },
  time: { marginRight: 10, color: '#555', fontSize: 16 },
  dash: { marginRight: 10 },
  carrier: { marginLeft: 10, color: '#666', fontSize: 15 },
});

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  price: { fontSize: 22, fontWeight: '700' },
  duration: { color: '#555', fontSize: 16 },
  stops: { color: '#666', fontSize: 15 },
  details: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#eee' },
  legLabel: { fontWeight: '600', marginBottom: 6, fontSize: 16 },
});

function sortResults(
  results: FlightOption[],
  sortField: SortField,
  sortOrder: SortOrder
): FlightOption[] {
  const sorted = [...results].sort((a, b) => {
    let diff = 0;
    if (sortField === 'price') diff = a.price.amount - b.price.amount;
    else diff = a.durationMinutes - b.durationMinutes;
    return sortOrder === 'asc' ? diff : -diff;
  });
  return sorted;
}

export function ResultsScreen({ route }: { route: { params: { sessionId: string } } }) {
  const { theme } = useTheme();
  const { sessionId } = route.params;
  const {
    results,
    status,
    sortField,
    sortOrder,
    filters,
    expandedOptionId,
  } = useSearchStore();
  const versionRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      if (cancelled) return;
      try {
        const res = await getSearchSessionResults(sessionId, versionRef.current || undefined);
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
      list = list.filter(opt => {
        const stops = opt.legs.reduce((acc, leg) => acc + leg.segments.length - 1, 0);
        return stops <= filters.maxStops!;
      });
    }
    if (filters.airlines.length > 0) {
      const set = new Set(filters.airlines);
      list = list.filter(opt =>
        opt.legs.every(leg =>
          leg.segments.some(seg => set.has(seg.marketingCarrier.code))
        )
      );
    }
    return sortResults(list, sortField, sortOrder);
  }, [results, filters, sortField, sortOrder]);

  const toggleSort = (field: SortField) => {
    const order =
      sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    searchActions.setSort(field, order);
  };

  if (status === 'FAILED') {
    return (
      <View style={[styles.centered, { backgroundColor: theme.screenBg }]}>
        <Text style={[styles.error, { color: theme.error }]}>Search failed or expired.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.screenBg }]}>
      {(status === 'PENDING' || status === 'PARTIAL') && (
        <View style={[styles.banner, { backgroundColor: theme.isDark ? theme.cardBg : '#e0e7ff' }]}>
          <ActivityIndicator size="small" color={theme.primary} />
          <Text style={[styles.bannerText, { color: theme.primary }]}>Loading more results…</Text>
        </View>
      )}

      <View style={[styles.toolbar, { backgroundColor: theme.cardBg, borderBottomColor: theme.cardBorder }]}>
        <TouchableOpacity
          style={[styles.sortBtn, { backgroundColor: theme.isDark ? theme.cardBorder : '#f0f0f0' }, sortField === 'price' && { backgroundColor: theme.primary }]}
          onPress={() => toggleSort('price')}
        >
          <Text style={[sortField === 'price' ? styles.sortTextActive : styles.sortText, sortField !== 'price' && { color: theme.text }]}>
            Price {sortOrder === 'asc' ? '↑' : '↓'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortBtn, { backgroundColor: theme.isDark ? theme.cardBorder : '#f0f0f0' }, sortField === 'duration' && { backgroundColor: theme.primary }]}
          onPress={() => toggleSort('duration')}
        >
          <Text style={[sortField === 'duration' ? styles.sortTextActive : styles.sortText, sortField !== 'duration' && { color: theme.text }]}>
            Duration {sortOrder === 'asc' ? '↑' : '↓'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.filterRow, { backgroundColor: theme.cardBg }]}>
        <Text style={[styles.filterLabel, { color: theme.textMuted }]}>Stops:</Text>
        {([null, 0, 1, 2] as const).map(max => (
          <TouchableOpacity
            key={max ?? 'any'}
            style={[
              styles.filterBtn,
              { backgroundColor: theme.isDark ? theme.cardBorder : '#f0f0f0' },
              filters.maxStops === max && { backgroundColor: theme.primary },
            ]}
            onPress={() => searchActions.setFilters({ maxStops: max })}
          >
            <Text
              style={[
                filters.maxStops === max ? styles.filterTextActive : styles.filterText,
                filters.maxStops !== max && { color: theme.text },
              ]}
            >
              {max === null ? 'Any' : max === 0 ? 'Direct' : max === 1 ? '1' : '2+'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <FlightCard
            option={item}
            expanded={expandedOptionId === item.id}
            onPress={() =>
              searchActions.setExpandedOption(expandedOptionId === item.id ? null : item.id)
            }
            theme={theme}
          />
        )}
        ListEmptyComponent={
          status === 'PENDING' && results.length === 0 ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={theme.primary} />
              <Text style={[styles.emptyText, { color: theme.textMuted }]}>Searching for flights…</Text>
            </View>
          ) : (
            <View style={styles.centered}>
              <Text style={[styles.emptyText, { color: theme.textMuted }]}>No flights match your filters.</Text>
            </View>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  bannerText: { marginLeft: 12, fontSize: 18 },
  toolbar: { flexDirection: 'row', padding: 16, gap: 12, borderBottomWidth: 1 },
  sortBtn: { paddingVertical: 12, paddingHorizontal: 18, borderRadius: 12 },
  sortBtnActive: {},
  sortText: { fontSize: 17 },
  sortTextActive: { color: '#fff', fontWeight: '600', fontSize: 17 },
  filterRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12, gap: 10 },
  filterLabel: { fontSize: 16, marginRight: 8 },
  filterBtn: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10 },
  filterBtnActive: {},
  filterText: { fontSize: 16 },
  filterTextActive: { fontSize: 16, color: '#fff', fontWeight: '600' },
  error: { fontSize: 20 },
  emptyText: { marginTop: 12, fontSize: 18 },
});
