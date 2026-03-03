import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { useDealsStore, dealsActions, searchActions } from '../../../store';
import { getMonthDeals, getFlightDetails, createSearchSession } from '../../../api';
import { AirportInput } from '../../flight-search/components/AirportInput';
import type { DayDeal, FlightDetailsResponse } from '../../../types';

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

export function MonthDealsScreen({ navigation }: { navigation: any }) {
  const { theme } = useTheme();
  const { route, year, month, durationDays, data, isLoading, error } = useDealsStore();
  const [origin, setOrigin] = useState(route?.origin ?? 'TLV');
  const [destination, setDestination] = useState(route?.destination ?? 'HND');
  const [visibleCount, setVisibleCount] = useState(10);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [details, setDetails] = useState<FlightDetailsResponse | null>(null);

  useEffect(() => {
    if (!origin.trim() || !destination.trim()) return;
    dealsActions.setRoute(origin.trim(), destination.trim());
  }, [origin, destination]);

  useEffect(() => {
    setVisibleCount(10);
  }, [data]);

  // Best deals = days with a price, sorted by price ascending
  const bestDeals: DayDeal[] = (data?.days ?? [])
    .filter(d => d.lowestPrice != null && d.lowestPrice.amount > 0)
    .sort((a, b) => (a.lowestPrice!.amount - b.lowestPrice!.amount));
  const visibleDeals = bestDeals.slice(0, visibleCount);
  const hasMore = bestDeals.length > visibleCount;

  const handleSearchDeals = () => {
    const o = origin.trim();
    const d = destination.trim();
    if (!o || !d) {
      dealsActions.setError('Please fill origin and destination.');
      return;
    }
    dealsActions.setLoading(true);
    dealsActions.setError(null);
    getMonthDeals({ origin: o, destination: d, year, month, durationDays })
      .then(res => dealsActions.setData(res))
      .catch(e =>
        dealsActions.setError(e instanceof Error ? e.message : 'Failed to load deals')
      )
      .finally(() => dealsActions.setLoading(false));
  };

  const openDetails = async (date: string) => {
    const o = origin.trim().toUpperCase();
    const d = destination.trim().toUpperCase();
    if (!o || !d) return;
    setSelectedDate(date);
    setShowDetails(true);
    setDetails(null);
    setDetailsError(null);
    setDetailsLoading(true);
    try {
      const res = await getFlightDetails({
        origin: o,
        destination: d,
        date,
        durationDays,
      });
      setDetails(res);
    } catch (e) {
      setDetailsError(e instanceof Error ? e.message : 'Failed to load flight details');
    } finally {
      setDetailsLoading(false);
    }
  };

  const startSearchFromDetails = async () => {
    if (!selectedDate) return;
    const o = origin.trim().toUpperCase();
    const d = destination.trim().toUpperCase();
    const params = {
      origin: o,
      destination: d,
      departureDate: selectedDate,
      cabinClass: 'ECONOMY' as const,
      adults: 1,
      children: 0,
      infants: 0,
      currency: 'USD',
      locale: 'en-US',
    };
    searchActions.setParams(params as any);
    try {
      const session = await createSearchSession(params);
      searchActions.setSession(session.id, session, session.status);
      searchActions.setResults([], 0);
      setShowDetails(false);
      navigation.getParent()?.navigate('Search', {
        screen: 'Results',
        params: { sessionId: session.id },
      });
    } catch (_) {
      dealsActions.setError('Failed to start search');
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.screenBg }]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: theme.text }]}>Monthly Deals</Text>
      <Text style={[styles.subtitle, { color: theme.textMuted }]}>
        Best round-trip deals for a month. Tap a deal to search flights for that date.
      </Text>

      <AirportInput
        label="From"
        value={origin}
        onChange={code => setOrigin(code)}
        placeholder="City or airport"
      />
      <AirportInput
        label="To"
        value={destination}
        onChange={code => setDestination(code)}
        placeholder="City or airport"
      />

      <Text style={[styles.label, { color: theme.text }]}>Trip duration (days)</Text>
      <View style={styles.durationRow}>
        <TouchableOpacity
          style={[styles.stepperBtn, { backgroundColor: theme.controlBg, borderRadius: theme.radiusMd }]}
          onPress={() => dealsActions.setDurationDays(Math.max(1, durationDays - 1))}
        >
          <Text style={[styles.stepperText, { color: theme.text }]}>−</Text>
        </TouchableOpacity>
        <Text style={[styles.durationValue, { color: theme.text }]}>{durationDays} days</Text>
        <TouchableOpacity
          style={[styles.stepperBtn, { backgroundColor: theme.controlBg, borderRadius: theme.radiusMd }]}
          onPress={() => dealsActions.setDurationDays(Math.min(21, durationDays + 1))}
        >
          <Text style={[styles.stepperText, { color: theme.text }]}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.monthNav}>
        <TouchableOpacity onPress={() => dealsActions.prevMonth()} style={styles.navBtn}>
          <Text style={[styles.navText, { color: theme.primary }]}>← Prev</Text>
        </TouchableOpacity>
        <Text style={[styles.monthTitle, { color: theme.text }]}>{MONTHS[month - 1]} {year}</Text>
        <TouchableOpacity onPress={() => dealsActions.nextMonth()} style={styles.navBtn}>
          <Text style={[styles.navText, { color: theme.primary }]}>Next →</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.searchBtn, { backgroundColor: theme.primary }, (!origin.trim() || !destination.trim()) && styles.searchBtnDisabled]}
        disabled={!origin.trim() || !destination.trim() || isLoading}
        onPress={handleSearchDeals}
      >
        <Text style={styles.searchBtnText}>
          {isLoading ? 'Searching deals…' : 'Search deals'}
        </Text>
      </TouchableOpacity>

      {error ? <Text style={[styles.error, { color: theme.error }]}>{error}</Text> : null}
      {isLoading ? (
        <ActivityIndicator size="large" color={theme.primary} style={styles.loader} />
      ) : bestDeals.length === 0 ? (
        <Text style={[styles.empty, { color: theme.textMuted }]}>
          No deals found for this month. Try another month or route.
        </Text>
      ) : (
        <View style={styles.list}>
          <Text style={[styles.listTitle, { color: theme.textMuted }]}>
            Best deals (cheapest first){bestDeals.length > 0 ? ` · ${bestDeals.length} total` : ''}
          </Text>
          {visibleDeals.map((day) => (
            <TouchableOpacity
              key={day.date}
              style={[styles.dealCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder, borderRadius: theme.radiusLg }]}
              onPress={() => openDetails(day.date)}
              activeOpacity={0.8}
            >
              <Text style={[styles.dealDate, { color: theme.text }]}>{formatDealDate(day.date)}</Text>
              <Text style={[styles.dealPrice, { color: theme.primary }]}>
                {day.lowestPrice!.currency} {day.lowestPrice!.amount.toFixed(0)}
              </Text>
              <Text style={[styles.dealHint, { color: theme.textMuted }]}>Tap to view details</Text>
            </TouchableOpacity>
          ))}
          {hasMore && (
            <TouchableOpacity
              style={[styles.loadMoreBtn, { backgroundColor: theme.cardBg, borderColor: theme.inputBorder }]}
              onPress={() => setVisibleCount(c => c + 10)}
            >
              <Text style={[styles.loadMoreText, { color: theme.primary }]}>
                Load more ({bestDeals.length - visibleCount} left)
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <Modal
        visible={showDetails}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.cardBg }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Flight details</Text>
            {selectedDate && (
              <Text style={styles.modalSubtitle}>{formatDealDate(selectedDate)}</Text>
            )}

            {detailsLoading && (
              <View style={styles.modalLoaderRow}>
                <ActivityIndicator size="small" color="#1a73e8" />
                <Text style={styles.modalLoaderText}>Loading flight details…</Text>
              </View>
            )}

            {detailsError && !detailsLoading && (
              <Text style={styles.modalError}>{detailsError}</Text>
            )}

            {details && !detailsLoading && (
              <View style={styles.modalContent}>
                <Text style={styles.modalPrice}>
                  {details.totalPrice.currency} {details.totalPrice.amount.toFixed(0)}
                </Text>
                <Text style={styles.modalSection}>
                  Outbound · {details.departureDate}
                </Text>
                {details.outbound.segments.map((seg, idx, arr) => {
                  const dep = new Date(seg.departureTime);
                  const arrTime = new Date(seg.arrivalTime);
                  const layover =
                    idx > 0
                      ? Math.round(
                          (dep.getTime() -
                            new Date(arr[idx - 1].arrivalTime).getTime()) /
                            60000,
                        )
                      : 0;
                  return (
                    <View key={`o-${idx}`} style={styles.modalSegmentRow}>
                      {idx > 0 && layover > 0 && (
                        <Text style={styles.modalLayover}>
                          Layover in {arr[idx - 1].to.code} · {Math.floor(layover / 60)}h {layover % 60}m
                        </Text>
                      )}
                      <Text style={styles.modalSegment}>
                        {seg.from.code}{' '}
                        {dep.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} →{' '}
                        {seg.to.code}{' '}
                        {arrTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{' '}
                        · {seg.marketingCarrier.code} {seg.flightNumber}
                      </Text>
                    </View>
                  );
                })}
                <Text style={styles.modalSection}>
                  Return · {details.returnDate}
                </Text>
                {details.return.segments.map((seg, idx, arr) => {
                  const dep = new Date(seg.departureTime);
                  const arrTime = new Date(seg.arrivalTime);
                  const layover =
                    idx > 0
                      ? Math.round(
                          (dep.getTime() -
                            new Date(arr[idx - 1].arrivalTime).getTime()) /
                            60000,
                        )
                      : 0;
                  return (
                    <View key={`r-${idx}`} style={styles.modalSegmentRow}>
                      {idx > 0 && layover > 0 && (
                        <Text style={styles.modalLayover}>
                          Layover in {arr[idx - 1].to.code} · {Math.floor(layover / 60)}h {layover % 60}m
                        </Text>
                      )}
                      <Text style={styles.modalSegment}>
                        {seg.from.code}{' '}
                        {dep.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} →{' '}
                        {seg.to.code}{' '}
                        {arrTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{' '}
                        · {seg.marketingCarrier.code} {seg.flightNumber}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalSecondaryBtn]}
                onPress={() => setShowDetails(false)}
              >
                <Text style={styles.modalSecondaryText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, !details && styles.modalPrimaryDisabled]}
                onPress={startSearchFromDetails}
                disabled={!details}
              >
                <Text style={styles.modalPrimaryText}>Search these dates</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 24, paddingBottom: 48 },
  title: { fontSize: 32, fontWeight: '700', marginBottom: 8, color: '#333' },
  subtitle: { fontSize: 18, color: '#555', marginBottom: 20 },
  label: { fontSize: 18, fontWeight: '600', marginTop: 16, marginBottom: 8, color: '#333' },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    fontSize: 20,
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 16,
  },
  navBtn: { padding: 12 },
  navText: { color: '#1a73e8', fontWeight: '600', fontSize: 18 },
  monthTitle: { fontSize: 22, fontWeight: '700' },
  error: { color: '#c62828', marginBottom: 12, fontSize: 18 },
  loader: { marginVertical: 32 },
  empty: { color: '#666', marginTop: 20, textAlign: 'center', fontSize: 18 },
  list: { marginTop: 12 },
  listTitle: { fontSize: 18, fontWeight: '600', color: '#555', marginBottom: 12 },
  dealCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dealDate: { fontSize: 20, fontWeight: '600' },
  dealPrice: { fontSize: 24, fontWeight: '700', color: '#1a73e8', marginTop: 6 },
  dealHint: { fontSize: 16, color: '#888', marginTop: 6 },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 16,
  },
  stepperBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperText: { fontSize: 20, fontWeight: '600', color: '#333' },
  durationValue: { fontSize: 18, fontWeight: '600', minWidth: 90 },
  loadMoreBtn: {
    marginTop: 16,
    paddingVertical: 18,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  loadMoreText: { color: '#1a73e8', fontWeight: '600', fontSize: 18 },
  searchBtn: {
    marginTop: 12,
    paddingVertical: 18,
    borderRadius: 12,
    backgroundColor: '#1a73e8',
    alignItems: 'center',
  },
  searchBtnDisabled: {
    opacity: 0.5,
  },
  searchBtnText: { color: '#fff', fontWeight: '600', fontSize: 18 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
  },
  modalTitle: { fontSize: 22, fontWeight: '700' },
  modalSubtitle: { fontSize: 18, color: '#555', marginTop: 6, marginBottom: 12 },
  modalLoaderRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16, gap: 12 },
  modalLoaderText: { color: '#555', fontSize: 18 },
  modalError: { color: '#c62828', marginTop: 16, fontSize: 18 },
  modalContent: { marginTop: 12 },
  modalPrice: { fontSize: 24, fontWeight: '700', color: '#1a73e8', marginBottom: 12 },
  modalSection: { marginTop: 12, fontWeight: '600', fontSize: 18 },
  modalSegmentRow: { marginTop: 6 },
  modalLayover: { fontSize: 16, color: '#666' },
  modalSegment: { fontSize: 17, color: '#333' },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 20,
  },
  modalBtn: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  modalSecondaryBtn: {
    backgroundColor: '#eee',
  },
  modalSecondaryText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 18,
  },
  modalPrimaryDisabled: {
    backgroundColor: '#90caf9',
  },
  modalPrimaryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
  },
});
