import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useDealsStore, dealsActions, searchActions } from '../../../store';
import { getMonthDeals, createSearchSession } from '../../../api';
import type { DayDeal } from '../../../types';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** Format date for display: "Wed, Apr 5" */
function formatDealDate(dateStr: string): string {
  const d = new Date(dateStr + 'Z');
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthShort = MONTHS[d.getUTCMonth()].slice(0, 3);
  return `${weekdays[d.getUTCDay()]}, ${monthShort} ${d.getUTCDate()}`;
}

const INITIAL_DEALS_VISIBLE = 10;
const LOAD_MORE_STEP = 10;

export function MonthDealsScreen({ navigation }: { navigation: any }) {
  const { route, year, month, durationDays, data, isLoading, error } = useDealsStore();
  const [origin, setOrigin] = useState(route?.origin ?? 'TLV');
  const [destination, setDestination] = useState(route?.destination ?? 'HND');
  const [visibleCount, setVisibleCount] = useState(INITIAL_DEALS_VISIBLE);

  useEffect(() => {
    if (!origin.trim() || !destination.trim()) return;
    dealsActions.setRoute(origin.trim(), destination.trim());
    dealsActions.setLoading(true);
    dealsActions.setError(null);
    getMonthDeals({
      origin: origin.trim(),
      destination: destination.trim(),
      year,
      month,
      durationDays,
    })
      .then(res => dealsActions.setData(res))
      .catch(e => dealsActions.setError(e instanceof Error ? e.message : 'Failed to load deals'))
      .finally(() => dealsActions.setLoading(false));
  }, [origin, destination, year, month, durationDays]);

  // Reset visible count when data changes
  useEffect(() => {
    setVisibleCount(INITIAL_DEALS_VISIBLE);
  }, [data]);

  // Best deals = days with a price, sorted by price ascending
  const bestDeals: DayDeal[] = (data?.days ?? [])
    .filter(d => d.lowestPrice != null && d.lowestPrice.amount > 0)
    .sort((a, b) => (a.lowestPrice!.amount - b.lowestPrice!.amount));
  const visibleDeals = bestDeals.slice(0, visibleCount);
  const hasMore = bestDeals.length > visibleCount;

  const handleDealPress = async (date: string) => {
    const o = origin.trim();
    const d = destination.trim();
    if (!o || !d) return;
    const params = {
      origin: o,
      destination: d,
      departureDate: date,
      cabinClass: 'ECONOMY' as const,
      adults: 1,
      children: 0,
      infants: 0,
      currency: 'USD',
      locale: 'en-US',
    };
    searchActions.setParams(params);
    try {
      const session = await createSearchSession(params);
      searchActions.setSession(session.id, session, session.status);
      searchActions.setResults([], 0);
      navigation.getParent()?.navigate('Search', {
        screen: 'Results',
        params: { sessionId: session.id },
      });
    } catch (_) {
      dealsActions.setError('Failed to start search');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Monthly Deals</Text>
      <Text style={styles.subtitle}>
        Best round-trip deals for a month. Tap a deal to search flights for that date.
      </Text>

      <Text style={styles.label}>From</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. TLV"
        value={origin}
        onChangeText={setOrigin}
        autoCapitalize="characters"
      />
      <Text style={styles.label}>To</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. NAP"
        value={destination}
        onChangeText={setDestination}
        autoCapitalize="characters"
      />

      <Text style={styles.label}>Trip duration (days)</Text>
      <View style={styles.durationRow}>
        <TouchableOpacity
          style={styles.stepperBtn}
          onPress={() => dealsActions.setDurationDays(Math.max(1, durationDays - 1))}
        >
          <Text style={styles.stepperText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.durationValue}>{durationDays} days</Text>
        <TouchableOpacity
          style={styles.stepperBtn}
          onPress={() => dealsActions.setDurationDays(Math.min(21, durationDays + 1))}
        >
          <Text style={styles.stepperText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.monthNav}>
        <TouchableOpacity onPress={() => dealsActions.prevMonth()} style={styles.navBtn}>
          <Text style={styles.navText}>← Prev</Text>
        </TouchableOpacity>
        <Text style={styles.monthTitle}>{MONTHS[month - 1]} {year}</Text>
        <TouchableOpacity onPress={() => dealsActions.nextMonth()} style={styles.navBtn}>
          <Text style={styles.navText}>Next →</Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {isLoading ? (
        <ActivityIndicator size="large" color="#1a73e8" style={styles.loader} />
      ) : bestDeals.length === 0 ? (
        <Text style={styles.empty}>
          No deals found for this month. Try another month or route.
        </Text>
      ) : (
        <View style={styles.list}>
          <Text style={styles.listTitle}>
            Best deals (cheapest first){bestDeals.length > 0 ? ` · ${bestDeals.length} total` : ''}
          </Text>
          {visibleDeals.map((day) => (
            <TouchableOpacity
              key={day.date}
              style={styles.dealCard}
              onPress={() => handleDealPress(day.date)}
              activeOpacity={0.8}
            >
              <Text style={styles.dealDate}>{formatDealDate(day.date)}</Text>
              <Text style={styles.dealPrice}>
                {day.lowestPrice!.currency} {day.lowestPrice!.amount.toFixed(0)}
              </Text>
              <Text style={styles.dealHint}>Tap to search</Text>
            </TouchableOpacity>
          ))}
          {hasMore && (
            <TouchableOpacity
              style={styles.loadMoreBtn}
              onPress={() => setVisibleCount(c => c + LOAD_MORE_STEP)}
            >
              <Text style={styles.loadMoreText}>
                Load more ({bestDeals.length - visibleCount} left)
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#555', marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', marginTop: 12, marginBottom: 4 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 12,
  },
  navBtn: { padding: 8 },
  navText: { color: '#1a73e8', fontWeight: '600' },
  monthTitle: { fontSize: 18, fontWeight: '700' },
  error: { color: '#c62828', marginBottom: 8 },
  loader: { marginVertical: 24 },
  empty: { color: '#666', marginTop: 16, textAlign: 'center' },
  list: { marginTop: 8 },
  listTitle: { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 8 },
  dealCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dealDate: { fontSize: 16, fontWeight: '600' },
  dealPrice: { fontSize: 20, fontWeight: '700', color: '#1a73e8', marginTop: 4 },
  dealHint: { fontSize: 12, color: '#888', marginTop: 4 },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 12,
  },
  stepperBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperText: { fontSize: 18, fontWeight: '600', color: '#333' },
  durationValue: { fontSize: 16, fontWeight: '600', minWidth: 80 },
  loadMoreBtn: {
    marginTop: 12,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  loadMoreText: { color: '#1a73e8', fontWeight: '600' },
});
