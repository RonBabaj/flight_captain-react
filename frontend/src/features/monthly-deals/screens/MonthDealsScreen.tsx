import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Modal,
  Pressable,
  Linking,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme/ThemeContext';
import { useLocale } from '../../../context/LocaleContext';
import { useDealsStore, dealsActions } from '../../../store';
import type { DealsSortField } from '../../../store/dealsStore';
import { getMonthDeals, getFlightDetails, getUniformBookingRedirectUrl } from '../../../api';
import { getDisplayPrice } from '../../../utils/exchangeRates';
import { getPendingDealsParams, setPendingDealsParams, clearPendingDealsParams } from '../../../utils/dealsCache';
import { getAirlineName } from '../../../data/airlines';
import { AirportAutocomplete } from '../../flight-search/components/AirportAutocomplete';
import { PassengerCabinPicker } from '../../flight-search/components/PassengerCabinPicker';
import { useIsMobile } from '../../../hooks/useResponsive';
import type { DayDeal, FlightDetailsResponse, FlightSegment } from '../../../types';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// ─── Deals sort helpers (mirrors ResultsScreen logic) ───────────────────────

function dealBestScore(stops: number, price: number, maxPrice: number): number {
  const priceNorm = maxPrice > 0 ? price / maxPrice : 0;
  const stopsPenalty = stops * 0.25; // more weight on stops since no duration data
  return priceNorm + stopsPenalty;
}

function sortDeals(
  list: import('../../../types').DayDeal[],
  field: import('../../../store/dealsStore').DealsSortField,
  order: 'asc' | 'desc',
  maxPrice: number,
): import('../../../types').DayDeal[] {
  return [...list].sort((a, b) => {
    const mul = order === 'asc' ? 1 : -1;
    if (field === 'price') return mul * (a.lowestPrice!.amount - b.lowestPrice!.amount);
    if (field === 'duration') {
      // Fastest = fewest stops; then price as tiebreaker
      const stopsDiff = (a.stops ?? 99) - (b.stops ?? 99);
      if (stopsDiff !== 0) return mul * stopsDiff;
      return mul * (a.lowestPrice!.amount - b.lowestPrice!.amount);
    }
    // best: weighted score (price + stops penalty); lower is better — always asc
    const scoreA = dealBestScore(a.stops ?? 1, a.lowestPrice!.amount, maxPrice);
    const scoreB = dealBestScore(b.stops ?? 1, b.lowestPrice!.amount, maxPrice);
    return scoreA - scoreB;
  });
}

// ─── Shared helpers (same logic as FlightDetailsModal) ──────────────────────

function toValidMs(iso: string | undefined | null): number {
  if (!iso) return NaN;
  const ms = new Date(iso).getTime();
  if (!Number.isFinite(ms) || new Date(ms).getUTCFullYear() < 2000) return NaN;
  return ms;
}

function safeTime(iso: string | undefined | null): string {
  const ms = toValidMs(iso);
  if (!Number.isFinite(ms)) return '—';
  return new Date(ms).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

function safeDate(iso: string | undefined | null): string {
  const ms = toValidMs(iso);
  if (!Number.isFinite(ms)) return '';
  return new Date(ms).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function fmtDur(min: number): string {
  if (min <= 0) return '—';
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function legDuration(segs: FlightSegment[]): number {
  if (!segs?.length) return 0;
  const d = toValidMs(segs[0].departureTime);
  const a = toValidMs(segs[segs.length - 1].arrivalTime);
  if (Number.isFinite(d) && Number.isFinite(a) && a > d) return Math.round((a - d) / 60000);
  return segs.reduce((s, seg) => s + Math.max(0, seg.durationMinutes || 0), 0);
}

function layoverBetween(segs: FlightSegment[], idx: number): number {
  if (idx <= 0 || idx >= segs.length) return 0;
  const dest = segs[segs.length - 1].to?.code || '';
  const con = segs[idx - 1].to?.code || '';
  if (con && con === dest) return 0;
  const prev = toValidMs(segs[idx - 1].arrivalTime);
  const dep = toValidMs(segs[idx].departureTime);
  if (!Number.isFinite(prev) || !Number.isFinite(dep) || dep <= prev) return 0;
  return Math.round((dep - prev) / 60000);
}

function formatDealDate(dateStr: string): string {
  const d = new Date(dateStr + 'Z');
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthShort = MONTHS[d.getUTCMonth()].slice(0, 3);
  return `${weekdays[d.getUTCDay()]}, ${monthShort} ${d.getUTCDate()}`;
}

// ─── Screen ─────────────────────────────────────────────────────────────────

export function MonthDealsScreen({ navigation }: { navigation: any }) {
  const { theme } = useTheme();
  const { currency, locale, t, isRTL } = useLocale();
  const isMobile = useIsMobile();
  const { width: screenW } = useWindowDimensions();
  const { route, year, month, durationDays, preferredDays, sortField, sortOrder, maxPrice, maxStops, selectedAirlines, data, isLoading, error } = useDealsStore();
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
  const [bookLoading, setBookLoading] = useState(false);
  const [bookError, setBookError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [stopsOpen, setStopsOpen] = useState(true);
  const [daysOpen, setDaysOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [airlinesOpen, setAirlinesOpen] = useState(true);

  useEffect(() => {
    if (!origin.trim() || !destination.trim()) return;
    dealsActions.setRoute(origin.trim(), destination.trim());
  }, [origin, destination]);

  useEffect(() => { setVisibleCount(10); }, [data]);

  useEffect(() => {
    const toRestore = typeof window !== 'undefined' ? getPendingDealsParams() : null;
    if (!toRestore || !toRestore.origin?.trim() || !toRestore.destination?.trim()) return;
    if (toRestore.year) dealsActions.setMonth(toRestore.year, toRestore.month);
    if (toRestore.durationDays) dealsActions.setDurationDays(toRestore.durationDays);
    clearPendingDealsParams();
    dealsActions.setLoading(true);
    dealsActions.setError(null);
    getMonthDeals({
      origin: toRestore.origin.trim(), destination: toRestore.destination.trim(),
      year: toRestore.year, month: toRestore.month, durationDays: toRestore.durationDays,
      currency, adults: toRestore.adults, children: toRestore.children, nonStop: toRestore.nonStop,
    })
      .then(res => dealsActions.setData(res))
      .catch(e => dealsActions.setError(e instanceof Error ? e.message : 'Failed to load deals'))
      .finally(() => dealsActions.setLoading(false));
  }, []);

  useEffect(() => {
    if (!data || !origin.trim() || !destination.trim()) return;
    const o = origin.trim(), d = destination.trim();
    dealsActions.setLoading(true);
    dealsActions.setError(null);
    getMonthDeals({ origin: o, destination: d, year, month, durationDays, currency, adults, children, nonStop })
      .then(res => {
        dealsActions.setData(res);
        if (typeof window !== 'undefined') {
          setPendingDealsParams({ origin: o, destination: d, year, month, durationDays, adults, children, nonStop });
          window.location.reload();
        }
      })
      .catch(e => dealsActions.setError(e instanceof Error ? e.message : 'Failed to load deals'))
      .finally(() => dealsActions.setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adults, children, nonStop]);

  const allDealsWithPrice = (data?.days ?? []).filter(d => d.lowestPrice != null && d.lowestPrice.amount > 0);
  const allPrices = allDealsWithPrice.map(d => d.lowestPrice!.amount);
  const highestPrice = allPrices.length > 0 ? Math.max(...allPrices) : 0;

  // Build airline list from deals that have carrier data
  const dealsAirlines: { code: string; count: number }[] = (() => {
    const map: Record<string, number> = {};
    allDealsWithPrice.forEach(d => {
      (d.carriers ?? []).forEach(c => { map[c] = (map[c] ?? 0) + 1; });
    });
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b)).map(([code, count]) => ({ code, count }));
  })();

  const filteredDeals: DayDeal[] = allDealsWithPrice
    .filter(d => {
      if (preferredDays.length === 0) return true;
      const dow = new Date(d.date + 'T00:00:00Z').getUTCDay();
      return preferredDays.includes(dow);
    })
    .filter(d => {
      if (maxPrice == null) return true;
      return d.lowestPrice!.amount <= maxPrice;
    })
    .filter(d => {
      if (maxStops == null) return true;
      if (d.stops == null) return true; // no stops data — don't filter out
      if (maxStops === 2) return d.stops >= 2; // "2+" means 2 or more
      return d.stops <= maxStops;
    })
    .filter(d => {
      if (selectedAirlines.length === 0) return true;
      if (!d.carriers?.length) return true; // no data — don't filter out
      return d.carriers.some(c => selectedAirlines.includes(c));
    });
  const bestDeals = sortDeals(filteredDeals, sortField, sortOrder, highestPrice);
  const visibleDeals = bestDeals.slice(0, visibleCount);
  const hasMore = bestDeals.length > visibleCount;
  const hasResultsLayout = data != null && !isMobile;

  const handleSearchDeals = () => {
    const o = origin.trim(), d = destination.trim();
    if (!o || !d) { dealsActions.setError('Please fill origin and destination.'); return; }
    dealsActions.setLoading(true);
    dealsActions.setError(null);
    getMonthDeals({ origin: o, destination: d, year, month, durationDays, currency, adults, children, nonStop })
      .then(res => dealsActions.setData(res))
      .catch(e => dealsActions.setError(e instanceof Error ? e.message : 'Failed to load deals'))
      .finally(() => dealsActions.setLoading(false));
  };

  const openDetails = async (date: string) => {
    const o = origin.trim().toUpperCase(), d = destination.trim().toUpperCase();
    if (!o || !d) return;
    setSelectedDate(date);
    setShowDetails(true);
    setDetails(null);
    setDetailsError(null);
    setDetailsLoading(true);
    try {
      setDetails(await getFlightDetails({ origin: o, destination: d, date, durationDays, currency, adults, children }));
    } catch (e) {
      setDetailsError(e instanceof Error ? e.message : 'Failed to load flight details');
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleBookFromDetails = async () => {
    if (!selectedDate || !details) return;
    const o = origin.trim().toUpperCase(), d = destination.trim().toUpperCase();

    const depDate = new Date(selectedDate + 'T00:00:00Z');
    const retDate = new Date(depDate);
    retDate.setUTCDate(retDate.getUTCDate() + durationDays);
    const returnDateStr = retDate.toISOString().slice(0, 10);

    const url = getUniformBookingRedirectUrl('', '', {
      origin: o,
      destination: d,
      departureDate: selectedDate,
      returnDate: returnDateStr,
    });

    setBookLoading(true);
    setBookError(null);
    try {
      await Linking.openURL(url);
    } catch {
      setBookError('Cannot open booking link.');
    } finally {
      setBookLoading(false);
    }
  };

  const handleDealSort = (field: DealsSortField) => {
    if (field === 'best') {
      // Best is a fixed composite score — no direction toggle
      dealsActions.setSort('best', 'asc');
      return;
    }
    const newOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    dealsActions.setSort(field, newOrder);
  };

  // ─── Sort bar ──────────────────────────────────────────────────────────────

  const SORT_ICONS: Record<DealsSortField, string> = { price: '💰', duration: '⚡', best: '⭐' };
  const SORT_KEYS: Record<DealsSortField, string> = { price: 'cheapest', duration: 'fastest', best: 'best' };

  const sortBar = (
    <View style={[sb.bar, isRTL && sb.barRTL]}>
      <Text style={[sb.label, { color: theme.textMuted }]}>{t('sort_by')}</Text>
      <View style={[sb.pills, isRTL && sb.pillsRTL]}>
        {(['price', 'duration', 'best'] as DealsSortField[]).map((opt) => {
          const active = sortField === opt;
          const arrow = (active && opt !== 'best') ? (sortOrder === 'asc' ? ' ↑' : ' ↓') : '';
          return (
            <TouchableOpacity
              key={opt}
              style={[sb.pill, { backgroundColor: theme.controlBg, borderColor: theme.cardBorder }, active && { backgroundColor: theme.primary, borderColor: theme.primary }]}
              onPress={() => handleDealSort(opt)}
              activeOpacity={0.7}
            >
              <Text style={[sb.pillText, { color: theme.text }, active && { color: '#fff', fontWeight: '700' }]}>
                {`${SORT_ICONS[opt]} ${t(SORT_KEYS[opt])}${arrow}`}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {isMobile && data != null && (
        <TouchableOpacity
          style={[sb.filterBtn, { borderColor: theme.cardBorder }]}
          onPress={() => setShowFilters(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="options-outline" size={16} color={theme.text} />
          <Text style={[sb.filterBtnText, { color: theme.text }]}>{t('filters')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // ─── Filters content (shared between sidebar and modal) ────────────────────

  const DAY_KEYS = ['day_sun', 'day_mon', 'day_tue', 'day_wed', 'day_thu', 'day_fri', 'day_sat'] as const;

  const SectionHeader = ({ title, open, toggle }: { title: string; open: boolean; toggle: () => void }) => (
    <TouchableOpacity style={[fl.secHeader, { borderBottomColor: theme.cardBorder }]} onPress={toggle} activeOpacity={0.6}>
      <Text style={[fl.secTitle, { color: theme.text }]}>{title}</Text>
      <Text style={[fl.chevron, { color: theme.textMuted }]}>{open ? '▾' : '▸'}</Text>
    </TouchableOpacity>
  );

  const filtersContent = (
    <>
      {/* Stops */}
      <SectionHeader title={t('stops_section')} open={stopsOpen} toggle={() => setStopsOpen(o => !o)} />
      {stopsOpen && (
        <View style={fl.secBody}>
          <View style={fl.chipRow}>
            {([
              { val: null,  label: t('filter_any') },
              { val: 0,     label: t('direct') },
              { val: 1,     label: t('stops_1') },
              { val: 2,     label: t('stops_2_plus') },
            ] as const).map(({ val, label }) => {
              const active = maxStops === val;
              return (
                <TouchableOpacity
                  key={String(val)}
                  style={[fl.chip, { borderColor: theme.cardBorder }, active && { backgroundColor: theme.primary, borderColor: theme.primary }]}
                  onPress={() => dealsActions.setMaxStops(val)}
                  activeOpacity={0.7}
                >
                  <Text style={[fl.chipText, { color: theme.text }, active && { color: '#fff', fontWeight: '600' }]}>{label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* Departure days */}
      <SectionHeader title={t('departure_days_section')} open={daysOpen} toggle={() => setDaysOpen(o => !o)} />
      {daysOpen && (
        <View style={fl.secBody}>
          <View style={fl.chipRow}>
            {([0, 1, 2, 3, 4, 5, 6] as const).map((dow) => {
              const active = preferredDays.includes(dow);
              return (
                <TouchableOpacity
                  key={dow}
                  style={[fl.chip, { borderColor: theme.cardBorder }, active && { backgroundColor: theme.primary, borderColor: theme.primary }]}
                  onPress={() => dealsActions.togglePreferredDay(dow)}
                  activeOpacity={0.7}
                >
                  <Text style={[fl.chipText, { color: theme.text }, active && { color: '#fff', fontWeight: '600' }]}>{t(DAY_KEYS[dow])}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {preferredDays.length > 0 && (
            <TouchableOpacity onPress={() => dealsActions.clearPreferredDays()} activeOpacity={0.7} style={{ marginTop: 6 }}>
              <Text style={{ color: theme.primary, fontSize: 12, fontWeight: '600' }}>{t('any_day')}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Max price */}
      <SectionHeader title={t('price_section')} open={priceOpen} toggle={() => setPriceOpen(o => !o)} />
      {priceOpen && (
        <View style={fl.secBody}>
          <View style={fl.chipRow}>
            <TouchableOpacity
              style={[fl.chip, { borderColor: theme.cardBorder }, maxPrice == null && { backgroundColor: theme.primary, borderColor: theme.primary }]}
              onPress={() => dealsActions.setMaxPrice(null)}
              activeOpacity={0.7}
            >
              <Text style={[fl.chipText, { color: theme.text }, maxPrice == null && { color: '#fff', fontWeight: '600' }]}>{t('any_price')}</Text>
            </TouchableOpacity>
            {highestPrice > 0 && ([0.25, 0.5, 0.75] as const).map((frac) => {
              const limit = Math.round(highestPrice * frac);
              if (limit <= 0) return null;
              const active = maxPrice === limit;
              const { currency: cur } = getDisplayPrice(limit, data?.days?.[0]?.lowestPrice?.currency ?? 'USD', currency);
              return (
                <TouchableOpacity
                  key={frac}
                  style={[fl.chip, { borderColor: theme.cardBorder }, active && { backgroundColor: theme.primary, borderColor: theme.primary }]}
                  onPress={() => dealsActions.setMaxPrice(active ? null : limit)}
                  activeOpacity={0.7}
                >
                  <Text style={[fl.chipText, { color: theme.text }, active && { color: '#fff', fontWeight: '600' }]}>≤ {cur} {limit}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* Airlines */}
      {dealsAirlines.length > 0 && (
        <>
          <SectionHeader title={t('airlines_section')} open={airlinesOpen} toggle={() => setAirlinesOpen(o => !o)} />
          {airlinesOpen && (
            <View style={fl.secBody}>
              {dealsAirlines.map(({ code, count }) => {
                const name = getAirlineName(code) || code;
                const sel = selectedAirlines.includes(code);
                return (
                  <TouchableOpacity
                    key={code}
                    style={fl.airlineRow}
                    onPress={() => dealsActions.toggleAirline(code)}
                    activeOpacity={0.6}
                  >
                    <View style={[fl.check, { borderColor: theme.cardBorder }, sel && { backgroundColor: theme.primary, borderColor: theme.primary }]}>
                      {sel && <Text style={fl.checkMark}>✓</Text>}
                    </View>
                    <Text style={[fl.airlineName, { color: theme.text }]} numberOfLines={1}>{name}</Text>
                    <Text style={[fl.airlineCount, { color: theme.textMuted }]}>{count}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </>
      )}
    </>
  );

  // ─── Filters sidebar header + modal wrapper ────────────────────────────────

  const filtersHeader = (isModal: boolean) => (
    <View style={[fl.headerRow, { borderBottomColor: theme.cardBorder }]}>
      <Text style={[fl.headerTitle, { color: theme.text }]}>{t('filters')}</Text>
      {isModal && (
        <TouchableOpacity onPress={() => setShowFilters(false)} style={fl.closeBtn}>
          <Text style={[fl.closeText, { color: theme.primary }]}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const filtersSidebar = (
    <View style={fl.sidebarInner}>
      {filtersHeader(false)}
      <ScrollView contentContainerStyle={fl.scrollContent}>{filtersContent}</ScrollView>
    </View>
  );

  const filtersModal = (
    <Modal visible={showFilters} transparent animationType="slide" onRequestClose={() => setShowFilters(false)}>
      <Pressable style={fl.modalOverlay} onPress={() => setShowFilters(false)}>
        <View style={[fl.modalCard, { backgroundColor: theme.cardBg }]} onStartShouldSetResponder={() => true}>
          {filtersHeader(true)}
          <ScrollView contentContainerStyle={fl.scrollContent}>{filtersContent}</ScrollView>
        </View>
      </Pressable>
    </Modal>
  );

  // ─── Hero card ──────────────────────────────────────────────────────────────

  const heroCard = (
    <View style={[p.hero, hasResultsLayout ? p.heroSide : p.heroCenter, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Ionicons name="calendar-outline" size={20} color={theme.text} />
        <Text style={[p.heroTitle, { color: theme.text }]}>{t('monthly_deals')}</Text>
      </View>
      <Text style={[p.heroSub, { color: theme.textMuted }]}>{t('monthly_deals_hero')}</Text>

      <AirportAutocomplete label={t('from')} value={origin} onChange={setOrigin} placeholder={t('city_or_airport')} />
      <AirportAutocomplete label={t('to')} value={destination} onChange={setDestination} placeholder={t('city_or_airport')} />

      <PassengerCabinPicker
        adults={adults} children={children} cabinClass="ECONOMY"
        onAdultsChange={setAdults} onChildrenChange={setChildren} onCabinChange={() => {}}
        label={t('passengers_cabin')} passengersOnly
      />

      {/* Trip duration stepper */}
      <Text style={[p.label, { color: theme.text }]}>{t('trip_duration_days')}</Text>
      <View style={p.stepperRow}>
        <TouchableOpacity style={[p.stepBtn, { backgroundColor: theme.controlBg, borderColor: theme.cardBorder }]} onPress={() => dealsActions.setDurationDays(Math.max(1, durationDays - 1))}>
          <Text style={[p.stepBtnText, { color: theme.text }]}>−</Text>
        </TouchableOpacity>
        <Text style={[p.stepValue, { color: theme.text }]}>{durationDays} {t('days')}</Text>
        <TouchableOpacity style={[p.stepBtn, { backgroundColor: theme.controlBg, borderColor: theme.cardBorder }]} onPress={() => dealsActions.setDurationDays(Math.min(21, durationDays + 1))}>
          <Text style={[p.stepBtnText, { color: theme.text }]}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Month navigator */}
      <View style={[p.monthNav, { backgroundColor: theme.controlBg, borderColor: theme.cardBorder }]}>
        <TouchableOpacity onPress={() => dealsActions.prevMonth()} style={p.navBtn}>
          <Text style={[p.navText, { color: theme.primary }]}>← {t('prev')}</Text>
        </TouchableOpacity>
        <Text style={[p.monthTitle, { color: theme.text }]}>{MONTHS[month - 1]} {year}</Text>
        <TouchableOpacity onPress={() => dealsActions.nextMonth()} style={p.navBtn}>
          <Text style={[p.navText, { color: theme.primary }]}>{t('next')} →</Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={[p.error, { color: theme.error }]}>{error}</Text> : null}

      <TouchableOpacity
        style={[p.searchBtn, { backgroundColor: theme.buttonBg }, (!origin.trim() || !destination.trim() || isLoading) && { opacity: 0.5 }]}
        disabled={!origin.trim() || !destination.trim() || isLoading}
        onPress={handleSearchDeals}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <Text style={[p.searchBtnText, { color: theme.buttonText }]}>{t('loading_deals')}</Text>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons name="search" size={16} color={theme.buttonText} />
            <Text style={[p.searchBtnText, { color: theme.buttonText }]}>{t('search_deals')}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );

  // ─── Deal cards list ────────────────────────────────────────────────────────

  const resultsContent = (
    isLoading && !data ? (
      <View style={p.loaderWrap}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[p.loaderText, { color: theme.textMuted }]}>{t('loading_deals')}</Text>
      </View>
    ) : data != null && bestDeals.length === 0 ? (
      <>
        {sortBar}
        <View style={[p.emptyCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
          <Text style={[p.emptyTitle, { color: theme.text }]}>{t('no_deals_month')}</Text>
          <Text style={[p.emptySub, { color: theme.textMuted }]}>{t('try_another_route')}</Text>
        </View>
      </>
    ) : data != null ? (
      <View style={p.list}>
        {sortBar}
        <Text style={[p.listTitle, { color: theme.textMuted }]}>
          {bestDeals.length > 0 ? `${bestDeals.length} ${t('results_lower') || 'results'}` : ''}
        </Text>
        {visibleDeals.map((day) => {
          const { amount, currency: cur } = getDisplayPrice(day.lowestPrice!.amount, day.lowestPrice!.currency, currency);
          const depDate = new Date(day.date + 'T00:00:00Z');
          const retDate = new Date(depDate);
          retDate.setUTCDate(retDate.getUTCDate() + durationDays);
          const retStr = formatDealDate(retDate.toISOString().slice(0, 10));
          const o = origin.trim().toUpperCase(), d = destination.trim().toUpperCase();
          const routeSep = isRTL ? ' ← ' : ' → ';
          return (
            <TouchableOpacity
              key={day.date}
              style={[p.dealCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}
              onPress={() => openDetails(day.date)}
              activeOpacity={0.7}
            >
              <View style={p.dealTop}>
                <View style={{ flex: 1, minWidth: 0 }}>
                  {/* Departure → Return dates */}
                  <Text style={[p.dealDate, { color: theme.text }]}>
                    {formatDealDate(day.date)}{routeSep}{retStr}
                  </Text>
                  {/* Outbound route: TLV → ADD → BKK → HND */}
                  <Text style={[p.dealRoute, { color: theme.textMuted }]} numberOfLines={1}>
                    {(day.outboundPath && day.outboundPath.length > 1)
                      ? day.outboundPath.join(routeSep)
                      : `${o}${routeSep}${d}`}
                  </Text>
                  {/* Return route: HND → DOH → LCA → TLV */}
                  {(day.returnPath && day.returnPath.length > 1) && (
                    <Text style={[p.dealRoute, { color: theme.textMuted }]} numberOfLines={1}>
                      {day.returnPath.join(routeSep)}
                    </Text>
                  )}
                </View>
                <Text style={[p.dealPrice, { color: theme.primary }]}>{cur} {amount.toFixed(0)}</Text>
              </View>
              <Text style={[p.dealCta, { color: theme.primary }]}>
                {isRTL ? `← ${t('view_details')}` : `${t('view_details')} →`}
              </Text>
            </TouchableOpacity>
          );
        })}
        {hasMore && (
          <TouchableOpacity
            style={[p.loadMore, { borderColor: theme.cardBorder }]}
            onPress={() => setVisibleCount(c => c + 10)}
            activeOpacity={0.7}
          >
            <Text style={[p.loadMoreText, { color: theme.primary }]}>
              {t('load_more')} ({bestDeals.length - visibleCount} {t('left')})
            </Text>
          </TouchableOpacity>
        )}
      </View>
    ) : null
  );

  // ─── Details modal (same design as FlightDetailsModal) ────────────────────

  const isNarrow = screenW < 600;
  const modalContainerStyle = isNarrow
    ? [m.card, m.cardSheet, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]
    : [m.card, m.cardCentered, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }];

  const detailsModal = (
    <Modal visible={showDetails} transparent animationType="slide" onRequestClose={() => setShowDetails(false)}>
      <View style={[m.overlay, isNarrow && m.overlaySheet]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={() => setShowDetails(false)} />
        <View style={modalContainerStyle}>
          {/* Header */}
          <View style={[m.header, { borderBottomColor: theme.cardBorder }]}>
            <View>
              <Text style={[m.headerTitle, { color: theme.text }]}>{t('flight_details')}</Text>
              {selectedDate && <Text style={[m.headerSub, { color: theme.textMuted }]}>{formatDealDate(selectedDate)}</Text>}
            </View>
            <TouchableOpacity onPress={() => setShowDetails(false)} hitSlop={8}>
              <Text style={[m.headerClose, { color: theme.primary }]}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Loading */}
          {detailsLoading && (
            <View style={m.loaderRow}>
              <ActivityIndicator size="small" color={theme.primary} />
              <Text style={[m.loaderText, { color: theme.textMuted }]}>{t('loading_flight_details')}</Text>
            </View>
          )}

          {/* Error */}
          {detailsError && !detailsLoading && (
            <Text style={[m.errorText, { color: theme.error }]}>{detailsError}</Text>
          )}

          {/* Content */}
          {details && !detailsLoading && (
            <ScrollView style={m.scroll} contentContainerStyle={m.scrollContent} bounces={false}>
              {/* Price + summary */}
              <View style={m.summaryRow}>
                <Text style={[m.price, { color: theme.primary }]}>
                  {(() => { const { amount: a, currency: c } = getDisplayPrice(details.totalPrice.amount, details.totalPrice.currency, currency); return `${c} ${a.toFixed(0)}`; })()}
                </Text>
                <View style={m.summaryMeta}>
                  <Text style={[m.summaryMuted, { color: theme.textMuted }]}>
                    {details.stops.outbound + details.stops.return === 0 ? t('direct') : `${details.stops.outbound + details.stops.return} ${t('stops')}`}
                  </Text>
                </View>
              </View>

              {/* Legs */}
              {renderLeg(details.outbound.segments, t('outbound'), details.departureDate, theme, t)}
              {renderLeg(details.return.segments, t('return_leg'), details.returnDate, theme, t)}
            </ScrollView>
          )}

          {/* Footer */}
          <View style={[m.footer, { borderTopColor: theme.cardBorder }]}>
            {bookError ? (
              <Text style={[m.bookError, { color: theme.error }]}>{bookError}</Text>
            ) : null}
            <TouchableOpacity
              style={[m.bookBtn, { backgroundColor: details && !bookLoading ? theme.primary : theme.controlBg }]}
              onPress={handleBookFromDetails}
              disabled={!details || bookLoading}
              activeOpacity={0.8}
            >
              {bookLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={[m.bookBtnText, { color: details ? '#fff' : theme.textMuted }]}>{t('book_now')}</Text>
              )}
            </TouchableOpacity>
            <Text style={[m.disclaimer, { color: theme.textMuted }]}>{t('booking_disclaimer')}</Text>
          </View>
        </View>
      </View>
    </Modal>
  );

  // ─── Layout ─────────────────────────────────────────────────────────────────

  const hasFilters = data != null;

  return (
    <View style={{ flex: 1, backgroundColor: theme.screenBg }}>
      {hasResultsLayout ? (
        <View style={[p.twoCols, isRTL && { flexDirection: 'row-reverse' }]}>
          <View style={[p.heroCol, isRTL ? { borderRightWidth: 0, borderLeftWidth: 1, borderLeftColor: theme.cardBorder } : { borderRightColor: theme.cardBorder }]}>
            <ScrollView contentContainerStyle={p.heroColContent} keyboardShouldPersistTaps="handled">{heroCard}</ScrollView>
          </View>
          <ScrollView style={p.resultsCol} contentContainerStyle={p.resultsColContent}>{resultsContent}</ScrollView>
          {hasFilters && (
            <View style={[p.filterCol, isRTL ? { borderRightWidth: 1, borderRightColor: theme.cardBorder, borderLeftWidth: 0 } : { borderLeftWidth: 1, borderLeftColor: theme.cardBorder }]}>
              {filtersSidebar}
            </View>
          )}
        </View>
      ) : (
        <ScrollView contentContainerStyle={p.contentSingle} keyboardShouldPersistTaps="handled">
          {heroCard}
          {isLoading && !data ? (
            <View style={p.loaderWrap}>
              <ActivityIndicator size="large" color={theme.primary} />
              <Text style={[p.loaderText, { color: theme.textMuted }]}>{t('loading_deals')}</Text>
            </View>
          ) : resultsContent}
        </ScrollView>
      )}
      {detailsModal}
      {filtersModal}
    </View>
  );
}

// ─── Leg renderer (reusable for outbound + return) ──────────────────────────

function renderLeg(
  segs: FlightSegment[],
  label: string,
  dateStr: string,
  theme: import('../../../theme/ThemeContext').Theme,
  t: (k: string) => string,
) {
  if (!segs?.length) return null;
  const stops = Math.max(0, segs.length - 1);
  const stopsLabel = stops === 0 ? t('direct') : stops === 1 ? `1 ${t('stop')}` : `${stops} ${t('stops')}`;
  const dur = legDuration(segs);
  const legDate = safeDate(segs[0].departureTime) || dateStr;

  return (
    <View style={[m.legBlock, { borderTopColor: theme.cardBorder }]}>
      <View style={m.legHeader}>
        <Text style={[m.legTitle, { color: theme.text }]}>{label}</Text>
        <Text style={[m.legMeta, { color: theme.textMuted }]}>
          {legDate ? `${legDate} · ` : ''}{fmtDur(dur)} · {stopsLabel}
        </Text>
      </View>
      {segs.map((seg, idx) => {
        const lo = layoverBetween(segs, idx);
        const carrier = seg.marketingCarrier?.code || '';
        const carrierName = carrier ? (getAirlineName(carrier) || carrier) : '';

        return (
          <View key={idx}>
            {idx > 0 && lo > 0 && (
              <View style={[m.layoverRow, { backgroundColor: theme.controlBg }]}>
                <Text style={[m.layoverText, { color: theme.textMuted }]}>
                  {t('layover_in')} {segs[idx - 1].to?.code || '?'} · {fmtDur(lo)}
                </Text>
              </View>
            )}
            <View style={m.segRow}>
              <View style={m.segEnd}>
                <Text style={[m.segTime, { color: theme.text }]}>{safeTime(seg.departureTime)}</Text>
                <Text style={[m.segAirport, { color: theme.textMuted }]}>{seg.from?.code || '?'}</Text>
              </View>
              <View style={m.segMid}>
                <View style={[m.segLine, { backgroundColor: theme.cardBorder }]} />
                <Text style={[m.segDur, { color: theme.textMuted }]}>{fmtDur(seg.durationMinutes || 0)}</Text>
                <View style={[m.segLine, { backgroundColor: theme.cardBorder }]} />
              </View>
              <View style={[m.segEnd, m.segEndRight]}>
                <Text style={[m.segTime, { color: theme.text }]}>{safeTime(seg.arrivalTime)}</Text>
                <Text style={[m.segAirport, { color: theme.textMuted }]}>{seg.to?.code || '?'}</Text>
              </View>
            </View>
            <View style={m.segDetails}>
              <Text style={[m.segDetailText, { color: theme.textMuted }]}>
                {[carrierName, seg.flightNumber ? `${carrier} ${seg.flightNumber}` : ''].filter(Boolean).join(' · ')}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

// ─── Page styles ────────────────────────────────────────────────────────────

const p = StyleSheet.create({
  twoCols: { flex: 1, flexDirection: 'row', alignItems: 'stretch' },
  heroCol: { width: 280, minWidth: 240, borderRightWidth: 1 },
  heroColContent: { padding: 14, paddingBottom: 40 },
  resultsCol: { flex: 1, minWidth: 0 },
  resultsColContent: { padding: 16, paddingBottom: 40 },
  filterCol: { width: 240, minWidth: 200 },
  contentSingle: { padding: 16, paddingBottom: 40, maxWidth: 600, alignSelf: 'center', width: '100%' },

  hero: { borderRadius: 16, padding: 18, borderWidth: 1 },
  heroCenter: { marginBottom: 20 },
  heroSide: { marginBottom: 0 },
  heroTitle: { fontSize: 22, fontWeight: '700' },
  heroSub: { fontSize: 14, marginBottom: 18, marginTop: 2 },

  label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },

  stepperRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
  stepBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  stepBtnText: { fontSize: 20, fontWeight: '600' },
  stepValue: { fontSize: 16, minWidth: 56, textAlign: 'center' },

  monthNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, paddingHorizontal: 14, marginBottom: 12, borderWidth: 1, borderRadius: 12 },
  navBtn: { padding: 6 },
  navText: { fontWeight: '600', fontSize: 14 },
  monthTitle: { fontSize: 16, fontWeight: '700' },

  error: { marginTop: 10, fontSize: 14 },

  searchBtn: { marginTop: 16, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  searchBtnText: { fontSize: 16, fontWeight: '600' },

  loaderWrap: { alignItems: 'center', paddingVertical: 40 },
  loaderText: { marginTop: 12, fontSize: 14 },

  emptyCard: { borderRadius: 14, padding: 28, borderWidth: 1, alignItems: 'center' },
  emptyTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  emptySub: { fontSize: 14 },

  list: { marginTop: 4 },
  listTitle: { fontSize: 13, marginBottom: 10 },

  dealCard: { borderRadius: 14, padding: 14, marginBottom: 8, borderWidth: 1 },
  dealTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  dealDate: { fontSize: 14, fontWeight: '600' },
  dealRoute: { fontSize: 12, marginTop: 2 },
  dealStops: { fontSize: 11, marginTop: 2 },
  dealPrice: { fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  dealCta: { marginTop: 8, fontSize: 13, fontWeight: '600' },

  loadMore: { marginTop: 10, paddingVertical: 12, alignItems: 'center', borderRadius: 12, borderWidth: 1 },
  loadMoreText: { fontWeight: '600', fontSize: 14 },
});

// ─── Modal styles (matches FlightDetailsModal) ─────────────────────────────

const m = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  overlaySheet: { justifyContent: 'flex-end', padding: 0 },
  card: { borderWidth: 1, overflow: 'hidden' },
  cardSheet: { borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '92%', width: '100%' },
  cardCentered: { borderRadius: 20, maxHeight: '88%', width: '100%', maxWidth: 520 },

  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1 },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  headerSub: { fontSize: 13, marginTop: 2 },
  headerClose: { fontSize: 22, fontWeight: '400', lineHeight: 24 },

  loaderRow: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 12 },
  loaderText: { fontSize: 14 },
  errorText: { margin: 20, fontSize: 14 },

  scroll: {},
  scrollContent: { padding: 20, paddingBottom: 8 },

  summaryRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 },
  price: { fontSize: 26, fontWeight: '700' },
  summaryMeta: { alignItems: 'flex-end', flexShrink: 1 },
  summaryMuted: { fontSize: 14 },

  legBlock: { borderTopWidth: 1, paddingTop: 16, marginTop: 8 },
  legHeader: { marginBottom: 12 },
  legTitle: { fontSize: 16, fontWeight: '700' },
  legMeta: { fontSize: 13, marginTop: 2 },

  layoverRow: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, marginVertical: 6, alignItems: 'center' },
  layoverText: { fontSize: 13 },

  segRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  segEnd: { alignItems: 'center', width: 56 },
  segEndRight: { alignItems: 'center' },
  segTime: { fontSize: 18, fontWeight: '700' },
  segAirport: { fontSize: 12, marginTop: 2 },
  segMid: { flex: 1, flexDirection: 'row', alignItems: 'center', marginHorizontal: 8 },
  segLine: { flex: 1, height: 1 },
  segDur: { fontSize: 12, marginHorizontal: 6 },
  segDetails: { alignItems: 'center', marginBottom: 8 },
  segDetailText: { fontSize: 12, textAlign: 'center' },

  footer: { padding: 20, borderTopWidth: 1 },
  bookError: { fontSize: 14, marginBottom: 10, textAlign: 'center' },
  bookBtn: { paddingVertical: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', minHeight: 52 },
  bookBtnText: { fontSize: 17, fontWeight: '600' },
  disclaimer: { marginTop: 10, fontSize: 12, textAlign: 'center' },
});

// ─── Sort bar styles ────────────────────────────────────────────────────────

const sb = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, paddingHorizontal: 2, flexWrap: 'wrap' },
  barRTL: { flexDirection: 'row-reverse' },
  label: { fontSize: 13, fontWeight: '500' },
  pills: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  pillsRTL: { flexDirection: 'row-reverse' },
  pill: { paddingVertical: 7, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1 },
  pillText: { fontSize: 13 },
  filterBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 7, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, marginLeft: 'auto' as any },
  filterBtnText: { fontSize: 13, fontWeight: '600' },
});

// ─── Filters panel styles (matches search engine FiltersPanel) ───────────────

const fl = StyleSheet.create({
  sidebarInner: { flex: 1 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 15, fontWeight: '700' },
  closeBtn: { paddingVertical: 6, paddingHorizontal: 10 },
  closeText: { fontSize: 22, fontWeight: '400' },
  scrollContent: { paddingHorizontal: 14, paddingBottom: 24 },

  secHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  secTitle: { fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  chevron: { fontSize: 12 },
  secBody: { paddingBottom: 10 },

  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { paddingVertical: 5, paddingHorizontal: 10, borderRadius: 16, borderWidth: 1 },
  chipText: { fontSize: 12 },

  airlineRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 7 },
  check: { width: 20, height: 20, borderRadius: 5, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  checkMark: { color: '#fff', fontSize: 12, fontWeight: '700' },
  airlineName: { fontSize: 13, flex: 1 },
  airlineCount: { fontSize: 12 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalCard: { borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '80%' },
});
