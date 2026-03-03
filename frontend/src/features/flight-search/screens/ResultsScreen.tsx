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

function SegmentRow({ seg }: { seg: FlightSegment }) {
  return (
    <View style={segmentStyles.row}>
      <Text style={segmentStyles.code}>{seg.from.code}</Text>
      <Text style={segmentStyles.time}>{formatTime(seg.departureTime)}</Text>
      <Text style={segmentStyles.dash}>→</Text>
      <Text style={segmentStyles.code}>{seg.to.code}</Text>
      <Text style={segmentStyles.time}>{formatTime(seg.arrivalTime)}</Text>
      <Text style={segmentStyles.carrier}>
        {seg.marketingCarrier.name || seg.marketingCarrier.code} {seg.flightNumber}
      </Text>
    </View>
  );
}

function FlightCard({
  option,
  expanded,
  onPress,
}: {
  option: FlightOption;
  expanded: boolean;
  onPress: () => void;
}) {
  const stops = option.legs.reduce((acc, leg) => acc + leg.segments.length - 1, 0);
  return (
    <TouchableOpacity style={cardStyles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={cardStyles.header}>
        <Text style={cardStyles.price}>
          {option.price.currency} {option.price.amount.toFixed(2)}
        </Text>
        <Text style={cardStyles.duration}>{formatDuration(option.durationMinutes)}</Text>
        <Text style={cardStyles.stops}>{stops === 0 ? 'Direct' : `${stops} stop(s)`}</Text>
      </View>
      {expanded && (
        <View style={cardStyles.details}>
          {option.legs.map((leg, i) => (
            <View key={i}>
              <Text style={cardStyles.legLabel}>
                {option.legs.length > 1 ? (i === 0 ? 'Outbound' : 'Return') : 'Flight'}
              </Text>
              {leg.segments.map((seg, j) => (
                <SegmentRow key={j} seg={seg} />
              ))}
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}

const segmentStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginVertical: 4, flexWrap: 'wrap' },
  code: { fontWeight: '700', marginRight: 8 },
  time: { marginRight: 8, color: '#555' },
  dash: { marginRight: 8 },
  carrier: { marginLeft: 8, color: '#666', fontSize: 12 },
});

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  price: { fontSize: 18, fontWeight: '700' },
  duration: { color: '#555' },
  stops: { color: '#666', fontSize: 12 },
  details: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#eee' },
  legLabel: { fontWeight: '600', marginBottom: 4 },
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
      <View style={styles.centered}>
        <Text style={styles.error}>Search failed or expired.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {(status === 'PENDING' || status === 'PARTIAL') && (
        <View style={styles.banner}>
          <ActivityIndicator size="small" color="#1a73e8" />
          <Text style={styles.bannerText}>Loading more results…</Text>
        </View>
      )}

      <View style={styles.toolbar}>
        <TouchableOpacity
          style={[styles.sortBtn, sortField === 'price' && styles.sortBtnActive]}
          onPress={() => toggleSort('price')}
        >
          <Text style={sortField === 'price' ? styles.sortTextActive : styles.sortText}>
            Price {sortOrder === 'asc' ? '↑' : '↓'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortBtn, sortField === 'duration' && styles.sortBtnActive]}
          onPress={() => toggleSort('duration')}
        >
          <Text style={sortField === 'duration' ? styles.sortTextActive : styles.sortText}>
            Duration {sortOrder === 'asc' ? '↑' : '↓'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.filterRow}>
        <Text style={styles.filterLabel}>Stops:</Text>
        {([null, 0, 1, 2] as const).map(max => (
          <TouchableOpacity
            key={max ?? 'any'}
            style={[
              styles.filterBtn,
              filters.maxStops === max && styles.filterBtnActive,
            ]}
            onPress={() => searchActions.setFilters({ maxStops: max })}
          >
            <Text
              style={
                filters.maxStops === max ? styles.filterTextActive : styles.filterText
              }
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
          />
        )}
        ListEmptyComponent={
          status === 'PENDING' && results.length === 0 ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color="#1a73e8" />
              <Text style={styles.emptyText}>Searching for flights…</Text>
            </View>
          ) : (
            <View style={styles.centered}>
              <Text style={styles.emptyText}>No flights match your filters.</Text>
            </View>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#e3f2fd',
  },
  bannerText: { marginLeft: 8, color: '#1565c0' },
  toolbar: { flexDirection: 'row', padding: 12, gap: 8, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  sortBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, backgroundColor: '#f0f0f0' },
  sortBtnActive: { backgroundColor: '#1a73e8' },
  sortText: { color: '#333' },
  sortTextActive: { color: '#fff', fontWeight: '600' },
  filterRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingBottom: 8, backgroundColor: '#fff', gap: 6 },
  filterLabel: { fontSize: 12, color: '#666', marginRight: 4 },
  filterBtn: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6, backgroundColor: '#f0f0f0' },
  filterBtnActive: { backgroundColor: '#1a73e8' },
  filterText: { fontSize: 12, color: '#333' },
  filterTextActive: { fontSize: 12, color: '#fff', fontWeight: '600' },
  error: { color: '#c62828', fontSize: 16 },
  emptyText: { color: '#666', marginTop: 8 },
});
