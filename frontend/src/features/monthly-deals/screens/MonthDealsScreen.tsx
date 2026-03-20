import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { AppIcon } from '../../../components/AppIcon';
import { useTheme } from '../../../theme/ThemeContext';
import { useLocale } from '../../../context/LocaleContext';
import { useDealsStore, dealsActions } from '../../../store';
import type { DealsSortField } from '../../../store/dealsStore';
import { getMonthDeals, getFlightDetails, getUniformBookingRedirectUrl } from '../../../api';
import { getDisplayPrice, getCurrencySymbol } from '../../../utils/exchangeRates';
import { getPendingDealsParams, setPendingDealsParams, clearPendingDealsParams } from '../../../utils/dealsCache';
import { getAirlineName } from '../../../data/airlines';
import { getAirportNameByCode } from '../../../data/airports';
import type { LanguageCode } from '../../../data/translations';
import { AirportAutocomplete } from '../../flight-search/components/AirportAutocomplete';
import { PassengerCabinPicker } from '../../flight-search/components/PassengerCabinPicker';
import { useIsMobile } from '../../../hooks/useResponsive';
import type { DayDeal, FlightDetailsResponse, FlightSegment, MonetaryAmount, MonthDealsResponse } from '../../../types';
import { SearchLoadingOverlay } from '../../../components/SearchLoadingOverlay';
import { CheaperCitiesSection } from '../../flight-search/components/CheaperCitiesSection';
import type { CheaperCitiesOption } from '../../flight-search/components/CheaperCitiesSection';

// Module-scope cache so the optimizer remains stable across dev-mode remounts
// (React StrictMode can mount/unmount components during development).
const POSITIONING_DEALS_PROMISE_CACHE = new Map<string, Promise<MonthDealsResponse>>();

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const HUB_AIRPORTS = [
  'ATH',
  'VIE',
  'BUD',
  'FCO',
  'MXP',
  'SOF',
  'OTP',
] as const;

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
  const safe = (dateStr ?? '').slice(0, 10); // tolerate 'YYYY-MM-DD...' inputs
  const d = new Date(`${safe}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return safe || String(dateStr);
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthShort = MONTHS[d.getUTCMonth()].slice(0, 3);
  return `${weekdays[d.getUTCDay()]}, ${monthShort} ${d.getUTCDate()}`;
}

function parseDealYmdToUTCDate(dateStr: string): Date | null {
  const safe = (dateStr ?? '').slice(0, 10);
  const d = new Date(`${safe}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function toYmdUTC(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getMonthDealsPositioningCached(params: {
  origin: string;
  destination: string;
  year: number;
  month: number;
  durationDays: number;
  currency: string;
  adults: number;
  children: number;
  nonStop: boolean;
}): Promise<MonthDealsResponse> {
  const key = `${params.origin}|${params.destination}|${params.year}|${params.month}|${params.durationDays}|${params.currency}|${params.adults}|${params.children}|${params.nonStop ? 1 : 0}`;
  const cached = POSITIONING_DEALS_PROMISE_CACHE.get(key);
  if (cached) return cached;
  const p = getMonthDeals(params);
  POSITIONING_DEALS_PROMISE_CACHE.set(key, p);
  return p;
}

// ─── Screen ─────────────────────────────────────────────────────────────────

export function MonthDealsScreen({ navigation, view = 'form' }: { navigation: any; view?: 'form' | 'results' }) {
  const { theme } = useTheme();
  const { currency, locale, t, isRTL, language } = useLocale();
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
  const [showEditSearchModal, setShowEditSearchModal] = useState(false);
  const [stopsOpen, setStopsOpen] = useState(true);
  const [daysOpen, setDaysOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [airlinesOpen, setAirlinesOpen] = useState(true);

  const [positioningOptions, setPositioningOptions] = useState<CheaperCitiesOption[]>([]);
  const [positioningLoading, setPositioningLoading] = useState(false);
  const [cheaperCitiesFolded, setCheaperCitiesFolded] = useState(true);
  const positioningSessionKeyRef = useRef<string>('');
  const positioningLoadTokenRef = useRef(0);

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
      .then(res => {
        dealsActions.setData(res);
        setShowEditSearchModal(false);
        try {
          navigation?.navigate?.('MonthDealsResults');
        } catch {}
      })
      .catch(e => dealsActions.setError(e instanceof Error ? e.message : 'Failed to load deals'))
      .finally(() => dealsActions.setLoading(false));
  };

  const mergePathOutbound = (p1?: string[], p2?: string[], fallback?: string[]) => {
    if (p1 && p2 && p1.length > 0 && p2.length > 0) {
      if (p1[p1.length - 1] === p2[0]) return [...p1, ...p2.slice(1)];
      return [...p1, ...p2];
    }
    return fallback;
  };

  const mergePathReturn = (rDestToHub?: string[], rHubToOrigin?: string[], fallback?: string[]) => {
    // For the combined round-trip, we want: destination -> ... -> hub -> ... -> origin
    // leg2.returnPath is destination -> ... -> hub
    // leg1.returnPath is hub -> ... -> origin
    if (rDestToHub && rHubToOrigin && rDestToHub.length > 0 && rHubToOrigin.length > 0) {
      if (rDestToHub[rDestToHub.length - 1] === rHubToOrigin[0]) {
        return [...rDestToHub, ...rHubToOrigin.slice(1)];
      }
      return [...rDestToHub, ...rHubToOrigin];
    }
    return fallback;
  };

  const combineLegsForHub = (leg1: MonthDealsResponse, leg2: MonthDealsResponse, hubAirport: string, o: string, d: string): MonthDealsResponse => {
    const byDateLeg2 = new Map<string, DayDeal>(leg2.days.map((x) => [x.date, x]));
    const days: DayDeal[] = leg1.days.map((day1) => {
      const day2 = byDateLeg2.get(day1.date);

      const lp1 = day1.lowestPrice;
      const lp2 = day2?.lowestPrice;
      const hasAnyPrice = !!lp1 || !!lp2;

      const lowestPrice = hasAnyPrice
        ? {
            currency: lp1?.currency ?? lp2?.currency ?? currency,
            amount: (lp1?.amount ?? 0) + (lp2?.amount ?? 0),
          }
        : undefined;

      const stops = (day1.stops ?? 0) + (day2?.stops ?? 0);

      const carriers = Array.from(new Set([...(day1.carriers ?? []), ...((day2?.carriers ?? []) as string[])]));

      const outboundPath = mergePathOutbound(
        day1.outboundPath,
        day2?.outboundPath,
        [o, hubAirport, d],
      );

      const returnPath = mergePathReturn(
        day2?.returnPath,
        day1.returnPath,
        [d, hubAirport, o],
      );

      return {
        date: day1.date,
        lowestPrice,
        stops,
        carriers: carriers.length ? carriers : undefined,
        outboundPath,
        returnPath,
        sampleOptionId: day1.sampleOptionId ?? day2?.sampleOptionId,
      };
    });

    return {
      route: { origin: { code: o }, destination: { code: d } },
      year: leg1.year,
      month: leg1.month,
      currency: leg1.currency,
      days,
    };
  };

  const handleViewOptimizedHub = async (hubAirport: string) => {
    const o = origin.trim().toUpperCase();
    const d = destination.trim().toUpperCase();
    if (!o || !d || !hubAirport) return;

    dealsActions.setLoading(true);
    dealsActions.setError(null);

    try {
      const [leg1Res, leg2Res] = await Promise.all([
        getMonthDeals({ origin: o, destination: hubAirport, year, month, durationDays, currency, adults, children, nonStop }),
        getMonthDeals({ origin: hubAirport, destination: d, year, month, durationDays, currency, adults, children, nonStop }),
      ]);

      const combined = combineLegsForHub(leg1Res, leg2Res, hubAirport, o, d);
      dealsActions.setData(combined);
    } catch (e) {
      dealsActions.setError(e instanceof Error ? e.message : 'Failed to load optimized deals');
    } finally {
      dealsActions.setLoading(false);
    }
  };

  // ─── Positioning Flight Optimizer (Deals) ──────────────────────────────────
  // Clean parallel implementation: fires all hub requests at once, shows results
  // after all finish. ~6s total instead of minutes.
  const positioningCalcKey = `${origin.trim().toUpperCase()}|${destination.trim().toUpperCase()}|${year}|${month}|${durationDays}|${currency}|${adults}|${children}|${nonStop ? 1 : 0}`;

  useEffect(() => {
    const o = origin.trim().toUpperCase();
    const d = destination.trim().toUpperCase();

    if (!o || !d || !data || allDealsWithPrice.length === 0) {
      setPositioningLoading(false);
      return;
    }

    if (positioningCalcKey === positioningSessionKeyRef.current) return;
    positioningSessionKeyRef.current = positioningCalcKey;

    const token = ++positioningLoadTokenRef.current;
    setPositioningOptions([]);
    setCheaperCitiesFolded(true);
    setPositioningLoading(true);

    // Monthly Deals: when combining legs we match by `day.date`,
    // so savings must be computed against the direct (origin->destination)
    // lowest price for the same date.
    const directByDate = new Map<string, number>();
    for (const day of allDealsWithPrice) {
      const lp = day.lowestPrice;
      if (!lp || typeof lp.amount !== 'number') continue;
      directByDate.set(day.date, lp.amount);
    }
    const directCheapest = (() => {
      const vals = Array.from(directByDate.values());
      return vals.length ? Math.min(...vals) : Infinity;
    })();
    const hubsToTry = (HUB_AIRPORTS as readonly string[]).filter((h) => h !== o && h !== d);

    console.log(
      '[MONTHLY_POSITIONING] origin=' +
        o +
        ' dest=' +
        d +
        ' hubs=' +
        hubsToTry.join(',') +
        ' year=' +
        year +
        ' month=' +
        month +
        ' durationDays=' +
        durationDays +
        ' currency=' +
        currency +
        ' adults=' +
        adults +
        ' children=' +
        children +
        ' nonStop=' +
        (nonStop ? 1 : 0),
    );

    // Hard cap so we don't wait forever, but we must not cut valid responses.
    const withTimeout = <T,>(p: Promise<T>, ms: number): Promise<T | null> =>
      Promise.race([
        p,
        new Promise<null>((resolve) =>
          setTimeout(() => {
            resolve(null);
          }, ms),
        ),
      ]);

    Promise.allSettled(
      hubsToTry.map(async (hub) => {
        const fetchLeg = async (from: string, to: string) => {
          // Retry once: intermittent `net::ERR_EMPTY_RESPONSE` / timeouts.
          const p1 = withTimeout(
            getMonthDealsPositioningCached({
              origin: from,
              destination: to,
              year,
              month,
              durationDays,
              currency,
              adults,
              children,
              nonStop,
            }),
            25000,
          );
          const r1 = await p1;
          if (r1) return r1;

          return await withTimeout(
            getMonthDealsPositioningCached({
              origin: from,
              destination: to,
              year,
              month,
              durationDays,
              currency,
              adults,
              children,
              nonStop,
            }),
            45000,
          );
        };

        const [posRes, hubRes] = await Promise.all([fetchLeg(o, hub), fetchLeg(hub, d)]);

        if (!posRes || !hubRes) return null;

        const posDays = (posRes.days ?? []).filter((dd) => dd.lowestPrice && dd.lowestPrice.amount > 0);
        const hubDays = (hubRes.days ?? []).filter((dd) => dd.lowestPrice && dd.lowestPrice.amount > 0);
        if (!posDays.length || !hubDays.length) return null;

        // IMPORTANT: Monthly Deals combines legs by matching `day.date`.
        // So we must compute the best (min) combined total for shared dates,
        // not by independently taking the cheapest date from each leg.
        const posByDate = new Map<string, number>();
        for (const dd of posDays) posByDate.set(dd.date, dd.lowestPrice!.amount);
        const hubByDate = new Map<string, number>();
        for (const dd of hubDays) hubByDate.set(dd.date, dd.lowestPrice!.amount);

        let bestTotal = Infinity;
        let bestPosAmount = 0;
        let bestHubAmount = 0;
        let sharedDateCount = 0;

        for (const [date, posAmount] of posByDate.entries()) {
          const hubAmount = hubByDate.get(date);
          if (hubAmount == null) continue;
          sharedDateCount += 1;

          const totalAmount = posAmount + hubAmount;
          if (totalAmount < bestTotal) {
            bestTotal = totalAmount;
            bestPosAmount = posAmount;
            bestHubAmount = hubAmount;
          }
        }

        if (!Number.isFinite(bestTotal)) return null;

        const savingsAmount = directCheapest - bestTotal;
        if (savingsAmount <= 80) return null;

        console.log(
          '[MONTHLY_POSITIONING] origin=' +
            o +
            ' hub=' +
            hub +
            ' dest=' +
            d +
            ' total=' +
            bestTotal.toFixed(0) +
            ' savings=' +
            savingsAmount.toFixed(0) +
            ' sharedDates=' +
            sharedDateCount,
        );

        return {
          hubAirport: hub,
          totalPrice: { amount: bestTotal, currency },
          savings: { amount: savingsAmount, currency },
          positioningPrice: { amount: bestPosAmount, currency },
          hubFlightPrice: { amount: bestHubAmount, currency },
          mainTripPrice: { amount: directCheapest, currency },
        } as CheaperCitiesOption;
      }),
    ).then((results) => {
      if (token !== positioningLoadTokenRef.current) return;
      const found = results
        .filter((r): r is PromiseFulfilledResult<CheaperCitiesOption> =>
          r.status === 'fulfilled' && r.value !== null,
        )
        .map((r) => r.value)
        .sort((a, b) => b.savings.amount - a.savings.amount);
      console.log('[MONTHLY_POSITIONING_RENDER] optionsCount=' + found.length);
      setPositioningOptions(found);
      setPositioningLoading(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positioningCalcKey, data, allDealsWithPrice.length]);

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
    <View style={[sb.bar, isRTL && { direction: 'rtl' }]}>
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
              const sym = getCurrencySymbol(cur);
              return (
                <TouchableOpacity
                  key={frac}
                  style={[fl.chip, { borderColor: theme.cardBorder }, active && { backgroundColor: theme.primary, borderColor: theme.primary }]}
                  onPress={() => dealsActions.setMaxPrice(active ? null : limit)}
                  activeOpacity={0.7}
                >
                  <Text style={[fl.chipText, { color: theme.text }, active && { color: '#fff', fontWeight: '600' }]}>≤ {sym} {limit}</Text>
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

  // ─── Cheaper departure cities (reuses main search CheaperCitiesSection) ────
  // Desktop: embedded inside filter sidebar ScrollView (appears right after filters).
  // Mobile: rendered after resultsContent in the ScrollView.
  const cheaperCitiesNode = (
    <CheaperCitiesSection
      loading={positioningLoading}
      options={positioningOptions}
      isMobile={isMobile}
      folded={cheaperCitiesFolded}
      onToggleFold={() => setCheaperCitiesFolded((f) => !f)}
      onView={(hub) => {
        console.log('[MONTHLY_POSITIONING_CLICK] selectedHub=' + hub);
        handleViewOptimizedHub(hub);
      }}
    />
  );

  // ─── Filters sidebar header + modal wrapper ────────────────────────────────

  const filtersHeader = (isModal: boolean) => (
    <View style={[fl.headerRow, { borderBottomColor: theme.cardBorder }, isRTL && { flexDirection: 'row-reverse' }]}>
      <Text style={[fl.headerTitle, { color: theme.text }]}>{t('filters')}</Text>
      {isModal && (
        <TouchableOpacity onPress={() => setShowFilters(false)} style={fl.closeBtn}>
          <AppIcon name="close" size={24} color={theme.primary} fallbackText={t('close')} />
        </TouchableOpacity>
      )}
    </View>
  );

  const filtersSidebar = (
    <View style={fl.sidebarInner}>
      {filtersHeader(false)}
      <ScrollView contentContainerStyle={fl.scrollContent}>
        {filtersContent}
      </ScrollView>
      {/* Cheaper departure cities appears right after filter content — matches FiltersPanel footer pattern */}
      {(positioningLoading || positioningOptions.length > 0) ? (
        <View style={[fl.cheaperCitiesFooter, { borderTopColor: theme.cardBorder }]}>
          {cheaperCitiesNode}
        </View>
      ) : null}
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

  const heroInner = (
    <>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <AppIcon name="calendar-outline" size={20} color={theme.text} fallbackText={t('dates')} />
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

      {/* Month navigator: in RTL, natural flow puts first child (Prev) on right, last (Next) on left — no row-reverse */}
      <View style={[p.monthNav, { backgroundColor: theme.controlBg, borderColor: theme.cardBorder }, isRTL && { direction: 'rtl' }]}>
        <TouchableOpacity onPress={() => dealsActions.prevMonth()} style={p.navBtn}>
          <View style={p.navBtnInner}>
            <AppIcon name={isRTL ? 'chevron-forward' : 'chevron-back'} size={18} color={theme.primary} fallbackText={t('prev')} />
            <Text style={[p.navText, { color: theme.primary }]}>{t('prev')}</Text>
          </View>
        </TouchableOpacity>
        <Text style={[p.monthTitle, { color: theme.text }]}>{MONTHS[month - 1]} {year}</Text>
        <TouchableOpacity onPress={() => dealsActions.nextMonth()} style={p.navBtn}>
          <View style={p.navBtnInner}>
            <Text style={[p.navText, { color: theme.primary }]}>{t('next')}</Text>
            <AppIcon name={isRTL ? 'chevron-back' : 'chevron-forward'} size={18} color={theme.primary} fallbackText={t('next')} />
          </View>
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
          <Text style={[p.searchBtnText, { color: theme.buttonText }]}>{t('searching')}</Text>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <AppIcon name="search" size={16} color={theme.buttonText} fallbackText={t('search_deals')} />
            <Text style={[p.searchBtnText, { color: theme.buttonText }]}>{t('search_deals')}</Text>
          </View>
        )}
      </TouchableOpacity>
    </>
  );

  const heroCard = (
    <View style={[p.hero, hasResultsLayout ? p.heroSide : p.heroCenter, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
      {heroInner}
    </View>
  );

  // ─── Deal cards list ────────────────────────────────────────────────────────

  const resultsContent = (
    data != null && bestDeals.length === 0 ? (
      <>
        <View style={[p.emptyCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
          <Text style={[p.emptyTitle, { color: theme.text }]}>{t('no_deals_month')}</Text>
          <Text style={[p.emptySub, { color: theme.textMuted }]}>{t('try_another_route')}</Text>
        </View>
      </>
    ) : data != null ? (
      <View style={p.list}>
        <Text style={[p.listTitle, { color: theme.textMuted }]}>
          {bestDeals.length > 0 ? `${bestDeals.length} ${t('results_lower') || 'results'}` : ''}
        </Text>
        {visibleDeals.map((day) => {
          const { amount, currency: cur } = getDisplayPrice(day.lowestPrice!.amount, day.lowestPrice!.currency, currency);
          const sym = getCurrencySymbol(cur);
          const depDate = parseDealYmdToUTCDate(day.date);
          const retStr = (() => {
            if (!depDate) return '';
            const retDate = new Date(depDate);
            retDate.setUTCDate(retDate.getUTCDate() + durationDays);
            return formatDealDate(toYmdUTC(retDate));
          })();
          const o = origin.trim().toUpperCase(), d = destination.trim().toUpperCase();
          const routeSep = isRTL ? ' ← ' : ' → ';
          return (
            <TouchableOpacity
              key={day.date}
              style={[p.dealCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}
              onPress={() => openDetails(day.date)}
              activeOpacity={0.7}
            >
              <View style={[p.dealTop, isRTL && { flexDirection: 'row-reverse' }]}>
                <View style={{ flex: 1, minWidth: 0 }}>
                  {/* Departure → Return dates */}
                  <Text style={[p.dealDate, { color: theme.text }, isRTL && { textAlign: 'right' }]}>
                    {formatDealDate(day.date)}{retStr ? `${routeSep}${retStr}` : ''}
                  </Text>
                  {/* Outbound route: TLV → ADD → BKK → HND */}
                  <Text style={[p.dealRoute, { color: theme.textMuted }, isRTL && { textAlign: 'right' }]} numberOfLines={1}>
                    {(day.outboundPath && day.outboundPath.length > 1)
                      ? day.outboundPath.join(routeSep)
                      : `${o}${routeSep}${d}`}
                  </Text>
                  {/* Return route: HND → DOH → LCA → TLV */}
                  {(day.returnPath && day.returnPath.length > 1) && (
                    <Text style={[p.dealRoute, { color: theme.textMuted }, isRTL && { textAlign: 'right' }]} numberOfLines={1}>
                      {day.returnPath.join(routeSep)}
                    </Text>
                  )}
                </View>
                  <Text style={[p.dealPrice, { color: theme.primary }]}>{sym} {amount.toFixed(0)}</Text>
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
          {/* Header (RTL swaps title and close) */}
          <View style={[m.header, { borderBottomColor: theme.cardBorder }, isRTL && { flexDirection: 'row-reverse' }]}>
            <View>
              <Text style={[m.headerTitle, { color: theme.text }]}>{t('flight_details')}</Text>
              {selectedDate && <Text style={[m.headerSub, { color: theme.textMuted }]}>{formatDealDate(selectedDate)}</Text>}
            </View>
            <TouchableOpacity onPress={() => setShowDetails(false)} hitSlop={8}>
              <AppIcon name="close" size={24} color={theme.primary} fallbackText={t('close')} />
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
              {/* Price + summary (RTL swaps sides) */}
              <View style={[m.summaryRow, isRTL && { flexDirection: 'row-reverse' }]}>
                <Text style={[m.price, { color: theme.primary }]}>
                  {(() => {
                    const { amount: a, currency: c } = getDisplayPrice(details.totalPrice.amount, details.totalPrice.currency, currency);
                    const sym = getCurrencySymbol(c);
                    return `${sym} ${a.toFixed(0)}`;
                  })()}
                </Text>
                <View style={[m.summaryMeta, isRTL && { alignItems: 'flex-start' }]}>
                  <Text style={[m.summaryMuted, { color: theme.textMuted }]}>
                    {details.stops.outbound + details.stops.return === 0 ? t('direct') : `${details.stops.outbound + details.stops.return} ${t('stops')}`}
                  </Text>
                </View>
              </View>

              {/* Legs */}
              {renderLeg(details.outbound.segments, t('outbound'), details.departureDate, theme, t, language)}
              {renderLeg(details.return.segments, t('return_leg'), details.returnDate, theme, t, language)}
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
  const showForm = view === 'form';
  const showResultsShell = view === 'results';
  const showDesktopSidebar = !isMobile && view === 'results';

  const summaryStr = useMemo(() => {
    const o = origin.trim().toUpperCase();
    const d = destination.trim().toUpperCase();
    const monthLabel = `${MONTHS[Math.max(0, month - 1)]} ${year}`;
    const adultLabel = adults === 1 ? t('adult') : t('adults');
    const childLabel = children === 1 ? t('child') : t('children');
    const pax = children > 0 ? `${adults} ${adultLabel} · ${children} ${childLabel}` : `${adults} ${adultLabel}`;
    return [o && d ? `${o} · ${d}` : '', monthLabel, pax].filter(Boolean).join(' · ');
  }, [origin, destination, year, month, adults, children, t]);

  const summaryBar = showResultsShell ? (
    <View
      style={[
        p.summaryBar,
        { backgroundColor: theme.cardBg, borderBottomColor: theme.cardBorder },
        isRTL && { flexDirection: 'row-reverse' },
      ]}
    >
      <Text style={[p.summaryText, { color: theme.text }]} numberOfLines={1}>
        {summaryStr || t('monthly_deals')}
      </Text>
      <TouchableOpacity
        style={[p.editSearchBtn, { borderColor: theme.cardBorder, flexDirection: isRTL ? 'row-reverse' : 'row' }]}
        onPress={() => {
          setShowEditSearchModal(true);
        }}
        activeOpacity={0.7}
      >
        <AppIcon name="create-outline" size={16} color={theme.primary} fallbackText={t('change_search')} />
        <Text style={[p.editSearchBtnText, { color: theme.primary }]}>{t('edit_search')}</Text>
      </TouchableOpacity>
    </View>
  ) : null;

  const toolbar = data != null ? (
    <View style={[
      p.toolbar,
      (!hasResultsLayout ? p.toolbarMobile : p.toolbarDesktop),
      { backgroundColor: theme.cardBg, borderBottomColor: theme.cardBorder },
    ]}>
      <View style={p.toolbarSortWrap}>{sortBar}</View>
    </View>
  ) : null;

  const filtersRowMobile = isMobile && data != null ? (
    <TouchableOpacity
      style={[
        p.filtersRowMobile,
        { backgroundColor: theme.cardBg, borderBottomColor: theme.cardBorder },
        isRTL && { flexDirection: 'row-reverse' },
      ]}
      onPress={() => setShowFilters(true)}
      activeOpacity={0.7}
    >
      <AppIcon name="filter-outline" size={20} color={theme.primary} fallbackText={t('filters')} />
      <Text style={[p.filtersRowMobileText, { color: theme.primary }]}>{t('filters')}</Text>
    </TouchableOpacity>
  ) : null;

  return (
    <View style={{ flex: 1, backgroundColor: theme.screenBg }}>
      {summaryBar}
      {/* Must show even if previous results are still present (data stays non-null until fetch resolves). */}
      <SearchLoadingOverlay visible={isLoading} origin={origin} destination={destination} />
      {hasResultsLayout ? (
        /* Same as main search: parent direction:rtl puts 1st col (search) on right, 3rd (filters) on left. No row-reverse. */
        <View style={p.twoCols}>
          {(showForm || showDesktopSidebar) && (
            <View style={[p.heroCol, isRTL ? { borderRightWidth: 0, borderLeftWidth: 1, borderLeftColor: theme.cardBorder } : { borderRightWidth: 1, borderRightColor: theme.cardBorder }]}>
              <ScrollView contentContainerStyle={p.heroColContent} keyboardShouldPersistTaps="handled">{heroCard}</ScrollView>
            </View>
          )}
          <ScrollView style={p.resultsCol} contentContainerStyle={p.resultsColContent}>
            {toolbar}
            {resultsContent}
          </ScrollView>
          {hasFilters && (
            <View style={[p.filterCol, isRTL ? { borderRightWidth: 1, borderRightColor: theme.cardBorder, borderLeftWidth: 0 } : { borderLeftWidth: 1, borderLeftColor: theme.cardBorder }]}>
              {filtersSidebar}
            </View>
          )}
        </View>
      ) : (
        <ScrollView
          style={p.scrollSingle}
          contentContainerStyle={showForm ? p.contentSingle : p.contentSingleResults}
          keyboardShouldPersistTaps="handled"
        >
          {showForm && heroCard}
          <View style={[p.stickyHeaderWrap, { backgroundColor: theme.cardBg }]}>
            {toolbar}
            {filtersRowMobile}
          </View>
          {resultsContent}
          {/* Mobile only: cheaper cities shown after results, as collapsible panel */}
          {(positioningLoading || positioningOptions.length > 0) ? (
            <View style={{ borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.cardBorder }}>
              {cheaperCitiesNode}
            </View>
          ) : null}
        </ScrollView>
      )}
      {detailsModal}
      {filtersModal}
      {/* Edit search popup modal — identical structure to ResultsScreen */}
      <Modal visible={showEditSearchModal} transparent animationType="fade" onRequestClose={() => setShowEditSearchModal(false)}>
        <View style={esm.overlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setShowEditSearchModal(false)} />
          <View style={[esm.card, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
            <View style={[esm.header, { borderBottomColor: theme.cardBorder }]}>
              <Text style={[esm.title, { color: theme.text }]}>{t('change_search')}</Text>
              <TouchableOpacity onPress={() => setShowEditSearchModal(false)} style={esm.closeBtn}>
                <AppIcon name="close" size={24} color={theme.textMuted} fallbackText={t('close')} />
              </TouchableOpacity>
            </View>
            <ScrollView style={esm.scroll} contentContainerStyle={esm.content} keyboardShouldPersistTaps="handled">
              {/* Inner card — same as SearchFormContent compact mode */}
              <View style={[esm.formCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                <Text style={[esm.routeSummary, { color: theme.textMuted }]} numberOfLines={1}>
                  {origin.trim().toUpperCase()} → {destination.trim().toUpperCase()}
                </Text>
                <AirportAutocomplete label={t('from')} value={origin} onChange={setOrigin} placeholder={t('city_or_airport')} />
                <AirportAutocomplete label={t('to')} value={destination} onChange={setDestination} placeholder={t('city_or_airport')} />
                <PassengerCabinPicker
                  adults={adults} children={children} cabinClass="ECONOMY"
                  onAdultsChange={setAdults} onChildrenChange={setChildren} onCabinChange={() => {}}
                  label={t('passengers_cabin')} passengersOnly
                />
                <Text style={[esm.label, { color: theme.text }]}>{t('trip_duration_days')}</Text>
                <View style={esm.stepperRow}>
                  <TouchableOpacity style={[esm.stepBtn, { backgroundColor: theme.controlBg, borderColor: theme.cardBorder }]} onPress={() => dealsActions.setDurationDays(Math.max(1, durationDays - 1))}>
                    <Text style={[esm.stepBtnText, { color: theme.text }]}>−</Text>
                  </TouchableOpacity>
                  <Text style={[esm.stepValue, { color: theme.text }]}>{durationDays} {t('days')}</Text>
                  <TouchableOpacity style={[esm.stepBtn, { backgroundColor: theme.controlBg, borderColor: theme.cardBorder }]} onPress={() => dealsActions.setDurationDays(Math.min(21, durationDays + 1))}>
                    <Text style={[esm.stepBtnText, { color: theme.text }]}>+</Text>
                  </TouchableOpacity>
                </View>
                <View style={[esm.monthNav, { backgroundColor: theme.controlBg, borderColor: theme.cardBorder }, isRTL && { direction: 'rtl' }]}>
                  <TouchableOpacity onPress={() => dealsActions.prevMonth()} style={esm.navBtn}>
                    <View style={esm.navBtnInner}>
                      <AppIcon name={isRTL ? 'chevron-forward' : 'chevron-back'} size={16} color={theme.primary} fallbackText={t('prev')} />
                      <Text style={[esm.navText, { color: theme.primary }]}>{t('prev')}</Text>
                    </View>
                  </TouchableOpacity>
                  <Text style={[esm.monthTitle, { color: theme.text }]}>{MONTHS[month - 1]} {year}</Text>
                  <TouchableOpacity onPress={() => dealsActions.nextMonth()} style={esm.navBtn}>
                    <View style={esm.navBtnInner}>
                      <Text style={[esm.navText, { color: theme.primary }]}>{t('next')}</Text>
                      <AppIcon name={isRTL ? 'chevron-back' : 'chevron-forward'} size={16} color={theme.primary} fallbackText={t('next')} />
                    </View>
                  </TouchableOpacity>
                </View>
                {error ? <Text style={[esm.error, { color: theme.error }]}>{error}</Text> : null}
                <TouchableOpacity
                  style={[esm.button, { backgroundColor: theme.buttonBg }, (!origin.trim() || !destination.trim() || isLoading) && { opacity: 0.5 }]}
                  disabled={!origin.trim() || !destination.trim() || isLoading}
                  onPress={handleSearchDeals}
                  activeOpacity={0.8}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <AppIcon name="search" size={16} color={theme.buttonText} fallbackText={t('search_deals')} />
                    <Text style={[esm.buttonText, { color: theme.buttonText }]}>{t('search_deals')}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  language: LanguageCode,
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
                  {t('layover_in')} {getAirportNameByCode(segs[idx - 1].to?.code, language)} · {fmtDur(lo)}
                </Text>
              </View>
            )}
            <View style={m.segRow}>
              <View style={m.segEnd}>
                <Text style={[m.segTime, { color: theme.text }]}>{safeTime(seg.departureTime)}</Text>
                <Text style={[m.segAirport, { color: theme.textMuted }]}>{getAirportNameByCode(seg.from?.code, language)}</Text>
              </View>
              <View style={m.segMid}>
                <View style={[m.segLine, { backgroundColor: theme.cardBorder }]} />
                <Text style={[m.segDur, { color: theme.textMuted }]}>{fmtDur(seg.durationMinutes || 0)}</Text>
                <View style={[m.segLine, { backgroundColor: theme.cardBorder }]} />
              </View>
              <View style={[m.segEnd, m.segEndRight]}>
                <Text style={[m.segTime, { color: theme.text }]}>{safeTime(seg.arrivalTime)}</Text>
                <Text style={[m.segAirport, { color: theme.textMuted }]}>{getAirportNameByCode(seg.to?.code, language)}</Text>
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

// ─── Edit-search modal styles — copied 1:1 from ResultsScreen + SearchFormContent ─
const esm = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '90%',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
  },
  title: { fontSize: 18, fontWeight: '700' },
  closeBtn: { padding: 6 },
  scroll: { maxHeight: 480 },
  content: { padding: 18, paddingBottom: 28 },
  formCard: { borderRadius: 12, padding: 14, borderWidth: 1 },
  routeSummary: { fontSize: 14, marginBottom: 10 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 3 },
  stepperRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  stepBtn: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  stepBtnText: { fontSize: 18, fontWeight: '600' },
  stepValue: { fontSize: 15, minWidth: 50, textAlign: 'center' },
  monthNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, paddingHorizontal: 14, marginBottom: 4, borderWidth: 1, borderRadius: 10 },
  navBtn: {},
  navBtnInner: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  navText: { fontWeight: '600', fontSize: 13 },
  monthTitle: { fontSize: 15, fontWeight: '700', marginHorizontal: 12 },
  error: { color: 'red', marginTop: 8, fontSize: 13 },
  button: { marginTop: 12, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  buttonText: { fontSize: 15, fontWeight: '600' },
});

const p = StyleSheet.create({
  twoCols: { flex: 1, flexDirection: 'row', alignItems: 'stretch' },
  heroCol: { width: 320, minWidth: 280, borderRightWidth: 1 },
  heroColContent: { padding: 18, paddingBottom: 40 },
  resultsCol: { flex: 1, minWidth: 0 },
  // Match main search results: toolbar should sit flush under the summary bar (no extra paddingTop).
  resultsColContent: { paddingHorizontal: 20, paddingTop: 0, paddingBottom: 40 },
  filterCol: { width: 240, minWidth: 200 },
  scrollSingle: { flex: 1 },
  contentSingle: { padding: 16, paddingBottom: 40, maxWidth: 600, alignSelf: 'center', width: '100%', flexGrow: 1 },
  // Mobile results view: avoid extra top inset so the sticky header sits right under `summaryBar`.
  contentSingleResults: { paddingLeft: 16, paddingRight: 16, paddingTop: 0, paddingBottom: 40, maxWidth: 600, alignSelf: 'center', width: '100%', flexGrow: 1 },

  summaryBar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryText: { flex: 1, fontSize: 14, fontWeight: '600' },
  editSearchBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, gap: 5 },
  editSearchBtnText: { fontSize: 13, fontWeight: '600' },

  stickyHeaderWrap: { position: 'sticky' as any, top: 0, zIndex: 10, overflow: 'visible' },
  toolbar: { borderBottomWidth: StyleSheet.hairlineWidth, paddingHorizontal: 8, alignSelf: 'stretch' },
  toolbarMobile: { marginHorizontal: -16, paddingHorizontal: 16 },
  toolbarDesktop: { marginHorizontal: -20, paddingHorizontal: 20 },
  toolbarSortWrap: { paddingHorizontal: 0, flex: 1, minWidth: 0 },

  filtersRowMobile: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginHorizontal: -16,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  filtersRowMobileText: { fontSize: 15, fontWeight: '600' },

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

  monthNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, paddingHorizontal: 18, marginBottom: 12, borderWidth: 1, borderRadius: 12 },
  navBtn: {},
  navBtnInner: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  navText: { fontWeight: '600', fontSize: 14 },
  monthTitle: { fontSize: 16, fontWeight: '700', marginHorizontal: 16 },

  error: { marginTop: 10, fontSize: 14 },

  searchBtn: { marginTop: 16, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  searchBtnText: { fontSize: 16, fontWeight: '600' },

  loaderWrap: { alignItems: 'center', paddingVertical: 40 },
  loaderText: { marginTop: 12, fontSize: 14, textAlign: 'center' },
  dealsProgressTrack: { width: '70%', maxWidth: 280, height: 4, borderRadius: 2, overflow: 'hidden', marginBottom: 8 },
  dealsProgressFill: { height: 4, borderRadius: 2 },

  emptyCard: { borderRadius: 14, padding: 28, borderWidth: 1, alignItems: 'center' },
  emptyTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  emptySub: { fontSize: 14 },

  list: { marginTop: 4 },
  listTitle: { fontSize: 13, marginBottom: 6 },

  dealCard: { borderRadius: 14, padding: 16, marginBottom: 6, borderWidth: 1 },
  dealTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 },
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
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    flex: 1,
    minWidth: 0,
  },
  label: { fontSize: 13, fontWeight: '500' },
  pills: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', flex: 1, minWidth: 0 },
  pillsRTL: { flexDirection: 'row-reverse' },
  pill: { paddingVertical: 7, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1 },
  pillText: { fontSize: 13 },
  filterBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 7, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, marginLeft: 'auto' as any },
  filterBtnText: { fontSize: 13, fontWeight: '600' },
});

// ─── Filters panel styles (matches search engine FiltersPanel) ───────────────

const fl = StyleSheet.create({
  sidebarInner: { flex: 1 },
  cheaperCitiesFooter: { borderTopWidth: StyleSheet.hairlineWidth },
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
