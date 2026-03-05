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
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme/ThemeContext';
import { useLocale } from '../../../context/LocaleContext';
import { useDealsStore, dealsActions, searchActions } from '../../../store';
import { getMonthDeals, getFlightDetails, createSearchSession } from '../../../api';
import { getDisplayPrice } from '../../../utils/exchangeRates';
import { getPendingDealsParams, setPendingDealsParams, clearPendingDealsParams } from '../../../utils/dealsCache';
import { AirportAutocomplete } from '../../flight-search/components/AirportAutocomplete';
import { PassengerCabinPicker } from '../../flight-search/components/PassengerCabinPicker';
import { useIsMobile } from '../../../hooks/useResponsive';
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
  const { currency, locale, t, isRTL } = useLocale();
  const isMobile = useIsMobile();
  const { route, year, month, durationDays, data, isLoading, error } = useDealsStore();
  const pending = typeof window !== 'undefined' ? getPendingDealsParams() : null;
  const [origin, setOrigin] = useState(pending?.origin ?? route?.origin ?? 'TLV');
  const [destination, setDestination] = useState(pending?.destination ?? route?.destination ?? 'HND');
  const [adults, setAdults] = useState(pending?.adults ?? 1);
  const [children, setChildren] = useState(pending?.children ?? 0);
  const [nonStop, setNonStop] = useState(pending?.nonStop ?? false);
  const [visibleCount, setVisibleCount] = useState(10);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [details, setDetails] = useState<FlightDetailsResponse | null>(null);
  const themed = makeThemedStyles(theme);

  useEffect(() => {
    if (!origin.trim() || !destination.trim()) return;
    dealsActions.setRoute(origin.trim(), destination.trim());
  }, [origin, destination]);

  useEffect(() => {
    setVisibleCount(10);
  }, [data]);

  // Restore pending params after reload (e.g. from passenger-change re-search)
  useEffect(() => {
    const toRestore = typeof window !== 'undefined' ? getPendingDealsParams() : null;
    if (!toRestore || !toRestore.origin?.trim() || !toRestore.destination?.trim()) return;
    if (toRestore.year) dealsActions.setMonth(toRestore.year, toRestore.month);
    if (toRestore.durationDays) dealsActions.setDurationDays(toRestore.durationDays);
    clearPendingDealsParams();
    const o = toRestore.origin.trim();
    const d = toRestore.destination.trim();
    dealsActions.setLoading(true);
    dealsActions.setError(null);
    getMonthDeals({
      origin: o,
      destination: d,
      year: toRestore.year,
      month: toRestore.month,
      durationDays: toRestore.durationDays,
      currency,
      adults: toRestore.adults,
      children: toRestore.children,
      nonStop: toRestore.nonStop,
    })
      .then(res => dealsActions.setData(res))
      .catch(e =>
        dealsActions.setError(e instanceof Error ? e.message : 'Failed to load deals')
      )
      .finally(() => dealsActions.setLoading(false));
  }, []);

  const bestDeals: DayDeal[] = (data?.days ?? [])
    .filter(d => d.lowestPrice != null && d.lowestPrice.amount > 0)
    .sort((a, b) => (a.lowestPrice!.amount - b.lowestPrice!.amount));
  const visibleDeals = bestDeals.slice(0, visibleCount);
  const hasMore = bestDeals.length > visibleCount;
  /** When we have fetched data and viewport is wide, use two-column layout: hero left, results right */
  const hasResultsLayout = data != null && !isMobile;

  const handleSearchDeals = () => {
    const o = origin.trim();
    const d = destination.trim();
    if (!o || !d) {
      dealsActions.setError('Please fill origin and destination.');
      return;
    }
    dealsActions.setLoading(true);
    dealsActions.setError(null);
    getMonthDeals({ origin: o, destination: d, year, month, durationDays, currency, adults, children, nonStop })
      .then(res => dealsActions.setData(res))
      .catch(e =>
        dealsActions.setError(e instanceof Error ? e.message : 'Failed to load deals')
      )
      .finally(() => dealsActions.setLoading(false));
  };

  // Re-fetch deals when passengers or nonStop change (prices depend on these).
  // On web, reload the page after fetch so prices display correctly.
  useEffect(() => {
    if (!data || !origin.trim() || !destination.trim()) return;
    const o = origin.trim();
    const d = destination.trim();
    dealsActions.setLoading(true);
    dealsActions.setError(null);
    getMonthDeals({ origin: o, destination: d, year, month, durationDays, currency, adults, children, nonStop })
      .then(res => {
        dealsActions.setData(res);
        if (typeof window !== 'undefined') {
          setPendingDealsParams({
            origin: o,
            destination: d,
            year,
            month,
            durationDays,
            adults,
            children,
            nonStop,
          });
          window.location.reload();
        }
      })
      .catch(e =>
        dealsActions.setError(e instanceof Error ? e.message : 'Failed to load deals')
      )
      .finally(() => dealsActions.setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-fetch when passengers/filter change
  }, [adults, children, nonStop]);

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
        currency,
        adults,
        children,
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
      adults,
      children,
      infants: 0,
      currency,
      locale,
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

  const heroCard = (
    <View style={[styles.hero, hasResultsLayout ? styles.heroSide : styles.heroCenter, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Ionicons name="calendar-outline" size={24} color={theme.text} />
          <Text style={themed.heroTitle}>{t('monthly_deals')}</Text>
        </View>
      <Text style={themed.heroSubtitle}>
        {t('monthly_deals_hero')}
      </Text>

      <AirportAutocomplete
        label={t('from')}
        value={origin}
        onChange={setOrigin}
        placeholder={t('city_or_airport')}
      />
      <AirportAutocomplete
        label={t('to')}
        value={destination}
        onChange={setDestination}
        placeholder={t('city_or_airport')}
      />

      <PassengerCabinPicker
        adults={adults}
        children={children}
        cabinClass="ECONOMY"
        onAdultsChange={setAdults}
        onChildrenChange={setChildren}
        onCabinChange={() => {}}
        label={t('passengers_cabin')}
        passengersOnly
      />

      <View style={[styles.filterRow, { borderColor: theme.inputBorder }]}>
        <Text style={[styles.filterLabel, { color: theme.text }]}>{t('non_stop_only')}</Text>
        <TouchableOpacity
          style={[styles.radioBtn, { backgroundColor: theme.controlBg, borderColor: theme.inputBorder }, nonStop && { backgroundColor: theme.primary, borderColor: theme.primary }]}
          onPress={() => setNonStop(!nonStop)}
        >
          <Text style={[styles.radioBtnText, { color: nonStop ? '#fff' : theme.text }]}>{nonStop ? '✓' : ''}</Text>
        </TouchableOpacity>
      </View>

      <Text style={themed.label}>{t('trip_duration_days')}</Text>
      <View style={styles.durationRow}>
        <TouchableOpacity
          style={[styles.stepperBtn, themed.stepperBtn]}
          onPress={() => dealsActions.setDurationDays(Math.max(1, durationDays - 1))}
        >
          <Text style={themed.stepperBtnText}>−</Text>
        </TouchableOpacity>
        <Text style={themed.durationValue}>{durationDays} {t('days')}</Text>
        <TouchableOpacity
          style={[styles.stepperBtn, themed.stepperBtn]}
          onPress={() => dealsActions.setDurationDays(Math.min(21, durationDays + 1))}
        >
          <Text style={themed.stepperBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.monthNav, { backgroundColor: theme.controlBg, borderColor: theme.inputBorder, borderRadius: theme.radiusMd }]}>
        <TouchableOpacity onPress={() => dealsActions.prevMonth()} style={styles.navBtn}>
          <Text style={themed.navText}>← {t('prev')}</Text>
        </TouchableOpacity>
        <Text style={[themed.monthTitle, { color: theme.text }]}>{MONTHS[month - 1]} {year}</Text>
        <TouchableOpacity onPress={() => dealsActions.nextMonth()} style={styles.navBtn}>
          <Text style={themed.navText}>{t('next')} →</Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={themed.error}>{error}</Text> : null}

      <TouchableOpacity
        style={[themed.searchBtn, (!origin.trim() || !destination.trim() || isLoading) && styles.searchBtnDisabled]}
        disabled={!origin.trim() || !destination.trim() || isLoading}
        onPress={handleSearchDeals}
      >
        {isLoading ? (
          <Text style={themed.searchBtnText}>{t('loading_deals')}</Text>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="search" size={18} color={theme.buttonText} />
            <Text style={themed.searchBtnText}>{t('search_deals')}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );

  const resultsContent = (
    isLoading && !data ? (
      <View style={styles.loaderWrap}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loaderText, { color: theme.textMuted }]}>{t('loading_deals')}</Text>
      </View>
    ) : data != null && bestDeals.length === 0 ? (
      <View style={[styles.emptyCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
        <Text style={[styles.emptyTitle, { color: theme.text }]}>{t('no_deals_month')}</Text>
        <Text style={[styles.emptySubtitle, { color: theme.textMuted }]}>
          {t('try_another_route')}
        </Text>
      </View>
    ) : data != null ? (
      <View style={styles.list}>
        <Text style={[styles.listTitle, { color: theme.textMuted }]}>
          {t('best_deals_first')}{bestDeals.length > 0 ? ` · ${bestDeals.length} total` : ''}
        </Text>
        {visibleDeals.map((day) => (
          <TouchableOpacity
            key={day.date}
            style={[styles.dealCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}
            onPress={() => openDetails(day.date)}
            activeOpacity={0.85}
          >
            <View style={styles.dealCardInner}>
              <View>
                <Text style={[styles.dealDate, { color: theme.text }]}>{formatDealDate(day.date)}</Text>
                <Text style={[styles.dealPrice, { color: theme.primary }]}>
                  {(() => {
                    const { amount, currency: outCurr } = getDisplayPrice(
                      day.lowestPrice!.amount,
                      day.lowestPrice!.currency,
                      currency
                    );
                    return `${outCurr} ${amount.toFixed(0)}`;
                  })()}
                </Text>
              </View>
            </View>
            <Text style={[styles.dealCta, { color: theme.primary }]}>{t('view_details')} →</Text>
          </TouchableOpacity>
        ))}
        {hasMore && (
          <TouchableOpacity
            style={[styles.loadMoreBtn, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}
            onPress={() => setVisibleCount(c => c + 10)}
          >
            <Text style={[styles.loadMoreText, { color: theme.primary }]}>
              {t('load_more')} ({bestDeals.length - visibleCount} {t('left')})
            </Text>
          </TouchableOpacity>
        )}
      </View>
    ) : null
  );

  return (
    <View style={themed.container}>
      {hasResultsLayout ? (
        <View style={[styles.twoColumn, isRTL && { flexDirection: 'row-reverse' }]}>
          <View style={[styles.heroColumn, isRTL ? { borderRightWidth: 0, borderLeftWidth: 1, borderLeftColor: theme.cardBorder } : { borderRightColor: theme.cardBorder }]}>
            <ScrollView contentContainerStyle={styles.heroColumnContent} keyboardShouldPersistTaps="handled">
              {heroCard}
            </ScrollView>
          </View>
          <ScrollView style={styles.resultsColumn} contentContainerStyle={styles.resultsColumnContent}>
            {resultsContent}
          </ScrollView>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.contentSingle} keyboardShouldPersistTaps="handled">
          {heroCard}
          {isLoading && !data ? (
            <View style={styles.loaderWrap}>
              <ActivityIndicator size="large" color={theme.primary} />
              <Text style={[styles.loaderText, { color: theme.textMuted }]}>{t('loading_deals')}</Text>
            </View>
          ) : (
            resultsContent
          )}
        </ScrollView>
      )}

      {/* Flight details modal – same style as FlightDetailsModal */}
      <Modal
        visible={showDetails}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder, borderRadius: theme.radiusLg }]}>
            <View style={[styles.modalHeader, { borderBottomColor: theme.cardBorder }]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>{t('flight_details')}</Text>
              {selectedDate && (
                <Text style={[styles.modalSubtitle, { color: theme.textMuted }]}>{formatDealDate(selectedDate)}</Text>
              )}
            </View>

            {detailsLoading && (
              <View style={styles.modalLoaderRow}>
                <ActivityIndicator size="small" color={theme.primary} />
                <Text style={[styles.modalLoaderText, { color: theme.textMuted }]}>{t('loading_flight_details')}</Text>
              </View>
            )}

            {detailsError && !detailsLoading && (
              <Text style={[styles.modalError, { color: theme.error }]}>{detailsError}</Text>
            )}

            {details && !detailsLoading && (
              <ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalContent}>
                <Text style={[styles.modalPrice, { color: theme.primary }]}>
                  {(() => {
                    const { amount, currency: outCurr } = getDisplayPrice(
                      details.totalPrice.amount,
                      details.totalPrice.currency,
                      currency
                    );
                    return `${outCurr} ${amount.toFixed(0)}`;
                  })()}
                </Text>
                <Text style={[styles.modalSection, { color: theme.textMuted }]}>
                  {t('outbound')} · {details.departureDate}
                </Text>
                {details.outbound.segments.map((seg, idx, arr) => {
                  const dep = new Date(seg.departureTime);
                  const arrTime = new Date(seg.arrivalTime);
                  const layover =
                    idx > 0
                      ? Math.round(
                          (dep.getTime() - new Date(arr[idx - 1].arrivalTime).getTime()) / 60000,
                        )
                      : 0;
                  return (
                    <View key={`o-${idx}`} style={styles.modalSegmentRow}>
                      {idx > 0 && layover > 0 && (
                        <Text style={[styles.modalLayover, { color: theme.textMuted }]}>
                          Layover in {arr[idx - 1].to.code} · {Math.floor(layover / 60)}h {layover % 60}m
                        </Text>
                      )}
                      <Text style={[styles.modalSegment, { color: theme.text }]}>
                        {seg.from.code}{' '}
                        {dep.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} →{' '}
                        {seg.to.code}{' '}
                        {arrTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{' '}
                        · {seg.marketingCarrier.code} {seg.flightNumber}
                      </Text>
                    </View>
                  );
                })}
                <Text style={[styles.modalSection, { color: theme.textMuted }]}>
                  {t('return_leg')} · {details.returnDate}
                </Text>
                {details.return.segments.map((seg, idx, arr) => {
                  const dep = new Date(seg.departureTime);
                  const arrTime = new Date(seg.arrivalTime);
                  const layover =
                    idx > 0
                      ? Math.round(
                          (dep.getTime() - new Date(arr[idx - 1].arrivalTime).getTime()) / 60000,
                        )
                      : 0;
                  return (
                    <View key={`r-${idx}`} style={styles.modalSegmentRow}>
                      {idx > 0 && layover > 0 && (
                        <Text style={[styles.modalLayover, { color: theme.textMuted }]}>
                          Layover in {arr[idx - 1].to.code} · {Math.floor(layover / 60)}h {layover % 60}m
                        </Text>
                      )}
                      <Text style={[styles.modalSegment, { color: theme.text }]}>
                        {seg.from.code}{' '}
                        {dep.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} →{' '}
                        {seg.to.code}{' '}
                        {arrTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{' '}
                        · {seg.marketingCarrier.code} {seg.flightNumber}
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>
            )}

            <View style={[styles.modalFooter, { borderTopColor: theme.cardBorder }]}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalSecondaryBtn, { backgroundColor: theme.controlBg }]}
                onPress={() => setShowDetails(false)}
              >
                <Text style={[styles.modalSecondaryText, { color: theme.text }]}>{t('close')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalBtn,
                  { backgroundColor: details ? theme.buttonBg : theme.controlBg },
                  !details && styles.modalPrimaryDisabled,
                ]}
                onPress={startSearchFromDetails}
                disabled={!details}
              >
                <Text style={[styles.modalPrimaryText, { color: theme.buttonText }]}>{t('search_these_dates')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function makeThemedStyles(theme: import('../../../theme/ThemeContext').Theme) {
  return {
    container: { flex: 1, backgroundColor: theme.screenBg },
    heroTitle: { fontSize: 26, fontWeight: '700' as const, color: theme.text, marginBottom: 6 },
    heroSubtitle: { fontSize: 15, color: theme.textMuted, marginBottom: 24 },
    label: { fontSize: 16, fontWeight: '600' as const, marginBottom: 8, color: theme.text },
    stepperBtn: {
      backgroundColor: theme.controlBg,
      borderRadius: theme.radiusMd,
      borderWidth: 1,
      borderColor: theme.inputBorder,
    },
    stepperBtnText: { color: theme.text, fontSize: 22, fontWeight: '600' as const },
    durationValue: { marginHorizontal: 16, fontSize: 18, minWidth: 64, textAlign: 'center' as const, color: theme.text },
    navText: { color: theme.primary, fontWeight: '600' as const, fontSize: 16 },
    monthTitle: { fontSize: 18, fontWeight: '700' as const },
    error: { color: theme.error, marginTop: 12, fontSize: 16 },
    searchBtn: {
      marginTop: 24,
      backgroundColor: theme.buttonBg,
      paddingVertical: 18,
      borderRadius: theme.radiusLg,
      alignItems: 'center' as const,
    },
    searchBtnText: { color: theme.buttonText, fontSize: 18, fontWeight: '600' as const },
  };
}

const styles = StyleSheet.create({
  twoColumn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  heroColumn: {
    width: 380,
    minWidth: 380,
    borderRightWidth: 1,
  },
  heroColumnContent: {
    padding: 20,
    paddingBottom: 48,
  },
  resultsColumn: {
    flex: 1,
    minWidth: 0,
  },
  resultsColumnContent: {
    padding: 20,
    paddingBottom: 48,
  },
  contentSingle: {
    padding: 20,
    paddingBottom: 48,
    maxWidth: 640,
    alignSelf: 'center',
    width: '100%',
  },
  hero: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
  },
  heroCenter: {
    marginBottom: 24,
  },
  heroSide: {
    marginBottom: 0,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  filterLabel: { fontSize: 16, fontWeight: '600' },
  radioBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioBtnText: { fontSize: 16, fontWeight: '600' },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  stepperBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  navBtn: { padding: 8 },
  searchBtnDisabled: { opacity: 0.5 },
  loaderWrap: { alignItems: 'center', paddingVertical: 48 },
  loaderText: { marginTop: 16, fontSize: 16 },
  emptyCard: {
    borderRadius: 20,
    padding: 32,
    borderWidth: 1,
    alignItems: 'center',
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  emptySubtitle: { fontSize: 15 },
  list: { marginTop: 8 },
  listTitle: { fontSize: 15, marginBottom: 12 },
  dealCard: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
  },
  dealCardInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dealDate: { fontSize: 18, fontWeight: '600' },
  dealPrice: { fontSize: 22, fontWeight: '700', marginTop: 6 },
  dealCta: { marginTop: 12, fontSize: 15, fontWeight: '600' },
  loadMoreBtn: {
    marginTop: 16,
    paddingVertical: 18,
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
  },
  loadMoreText: { fontWeight: '600', fontSize: 17 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '85%',
    borderWidth: 1,
    overflow: 'hidden',
  },
  modalHeader: { padding: 20, borderBottomWidth: 1 },
  modalTitle: { fontSize: 20, fontWeight: '700' },
  modalSubtitle: { fontSize: 16, marginTop: 4 },
  modalLoaderRow: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 12 },
  modalLoaderText: { fontSize: 16 },
  modalError: { margin: 20, fontSize: 16 },
  modalScroll: { maxHeight: 360 },
  modalContent: { padding: 20, paddingBottom: 16 },
  modalPrice: { fontSize: 24, fontWeight: '700', marginBottom: 12 },
  modalSection: { marginTop: 12, fontWeight: '600', fontSize: 16 },
  modalSegmentRow: { marginTop: 6 },
  modalLayover: { fontSize: 14 },
  modalSegment: { fontSize: 16 },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
  },
  modalBtn: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  modalSecondaryBtn: {},
  modalSecondaryText: { fontWeight: '600', fontSize: 16 },
  modalPrimaryDisabled: { opacity: 0.6 },
  modalPrimaryText: { fontWeight: '600', fontSize: 16 },
});
