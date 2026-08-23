import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
  Modal,
  Pressable,
} from 'react-native';
import { AppIcon } from '../../../components/AppIcon';
import { useTheme } from '../../../theme/ThemeContext';
import { useLocale } from '../../../context/LocaleContext';
import { getExploreDestinations } from '../../../api';
import { createSearchSession } from '../../../api';
import { getMonthDeals } from '../../../api/deals';
import { searchActions, dealsActions, isCurrentSearchGeneration } from '../../../store';
import { getAirportEntry, getCityDisplayName } from '../../../data/airports';
import { AirportAutocomplete } from '../components/AirportAutocomplete';
import { useIsMobile } from '../../../hooks/useResponsive';
import { SearchLoadingOverlay } from '../../../components/SearchLoadingOverlay';
import { SearchFormContent } from '../components/SearchFormContent';
import { PassengerCabinPicker } from '../components/PassengerCabinPicker';
import { ANYWHERE_CODE } from '../../../types';
import type { ExploreDestination } from '../../../types';
import type { CreateSearchSessionRequest } from '../../../types';
import type { ExploreScreenParams } from '../../../navigation/types';
import { updateSearchUrl } from '../../../hooks/useSearchParams';
import { setCachedSearch } from '../../../utils/searchCache';
import {
  addDaysYmdUtc,
  clampExploreDealsDates,
  clampExploreSearchDates,
  firstBookableDepartureInMonth,
} from '../../../utils/bookableDates';

import { formatMonthYear } from '../../../utils/monthNames';
import { useRuntimeConfig } from '../../../context/RuntimeConfigContext';

function initialDatesFromRouteParams(p: ExploreScreenParams): {
  departureDate: string;
  returnDate: string;
  tripType: 'one-way' | 'round-trip';
} {
  if (p.mode === 'deals') {
    const { departureDate, returnDate } = clampExploreDealsDates(
      p.departureDate,
      p.returnDate,
      p.durationDays,
      { year: p.year, month: p.month },
    );
    return { departureDate, returnDate, tripType: 'round-trip' };
  }
  const { departureDate, returnDate } = clampExploreSearchDates(
    p.departureDate,
    p.returnDate,
    !!p.returnDate,
  );
  return {
    departureDate,
    returnDate,
    tripType: returnDate ? 'round-trip' : 'one-way',
  };
}

interface ExploreScreenProps {
  navigation: any;
  route: { params: ExploreScreenParams };
}

function countryFlag(cc: string | undefined): string {
  if (!cc || cc.length !== 2) return '✈️';
  return [...cc.toUpperCase()]
    .map((c) => String.fromCodePoint(0x1f1e6 - 65 + c.charCodeAt(0)))
    .join('');
}

function fmtPrice(price: string, currency: string): string {
  const symbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', ILS: '₪', JPY: '¥' };
  const sym = symbols[currency] ?? currency + ' ';
  const num = parseFloat(price);
  if (!Number.isFinite(num)) return `${sym}${price}`;
  return `${sym}${Math.round(num).toLocaleString()}`;
}

function fmtDate(d?: string): string {
  if (!d) return '';
  const dt = new Date(d + 'T12:00:00Z');
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
}

/** True when origin and destination are the same metro (e.g. NYC + JFK). Avoids showing "NYC → JFK". */
function originSameMetroAsDestination(originCode: string, destAirportCode: string): boolean {
  const o = originCode.trim().toUpperCase();
  const destEntry = getAirportEntry(destAirportCode);
  if (!destEntry?.cityCode) return false;
  if (o === destEntry.cityCode) return true;
  const originEntry = getAirportEntry(o);
  return !!(originEntry?.cityCode && originEntry.cityCode === destEntry.cityCode);
}

const REGION_MAP: Record<string, string[]> = {
  Europe: [
    // UK
    'LHR', 'LGW', 'STN', 'MAN', 'EDI', 'BHX',
    // France
    'CDG', 'ORY', 'NCE', 'LYS', 'MRS',
    // Italy
    'FCO', 'MXP', 'VCE', 'NAP', 'BLQ',
    // Benelux
    'AMS', 'BRU', 'LUX',
    // Spain
    'MAD', 'BCN', 'VLC', 'AGP', 'PMI', 'SVQ',
    // Portugal
    'LIS', 'OPO',
    // Germany
    'FRA', 'MUC', 'BER', 'HAM', 'DUS', 'STR',
    // Switzerland
    'ZRH', 'GVA',
    // Austria
    'VIE',
    // Scandinavia & Iceland
    'CPH', 'OSL', 'ARN', 'HEL', 'KEF', 'RKV',
    // Poland
    'WAW', 'KRK', 'GDN',
    // Czech / Slovakia / Hungary
    'PRG', 'BUD', 'BTS',
    // Balkans
    'BEG', 'SKP', 'TGD',
    // Greece
    'ATH', 'SKG', 'HER', 'RHO',
    // Bulgaria / Romania
    'SOF', 'OTP', 'CLJ',
    // Ireland
    'DUB', 'SNN',
  ],
  'Middle East': [
    // Gulf
    'DXB', 'AUH', 'DOH', 'KWI', 'BAH', 'MCT',
    // Turkey
    'IST', 'SAW',
    // Levant & Saudi
    'AMM', 'BEY', 'RUH', 'JED',
    // Egypt
    'CAI', 'HRG', 'SSH',
  ],
  Africa: [
    // East & South
    'NBO', 'JNB', 'CPT', 'DUR',
    // North
    'CMN', 'TUN', 'ALG',
    // Sub-Saharan & East
    'ADD', 'ACC', 'LOS', 'ABV', 'DKR', 'DAR', 'EBB',
  ],
  Asia: [
    // India
    'DEL', 'BOM', 'MAA', 'BLR', 'HYD', 'CCU',
    // South Asia
    'CMB', 'KTM', 'DAC',
    // South-East Asia
    'BKK', 'DMK', 'KBV', 'SIN', 'KUL', 'PEN',
    'CGK', 'DPS', 'MNL', 'SGN', 'HAN', 'REP', 'RGN',
    // East Asia
    'HKG', 'TPE', 'ICN', 'PUS',
    'HND', 'NRT', 'KIX', 'NGO', 'FUK', 'CTS',
    'PVG', 'PEK', 'CAN', 'CTU', 'WUH', 'SZX',
  ],
  'Asia-Pacific': [
    // Australia
    'SYD', 'MEL', 'BNE', 'PER', 'ADL',
    // New Zealand
    'AKL', 'CHC',
    // Indian Ocean
    'MLE',
  ],
  Americas: [
    // US North-east
    'JFK', 'EWR', 'LGA', 'BOS', 'PHL', 'DCA',
    // US South-east
    'ATL', 'MCO', 'MIA', 'FLL', 'TPA',
    // US Mid-west
    'ORD', 'MDW', 'DTW', 'MSP', 'CLE',
    // US South
    'DFW', 'IAH', 'AUS', 'SAT',
    // US Mountain & West
    'DEN', 'PHX', 'LAS', 'SLC',
    // US West Coast
    'LAX', 'SFO', 'SEA', 'PDX', 'SAN',
    // Canada
    'YYZ', 'YUL', 'YVR', 'YYC',
    // Mexico
    'MEX', 'GDL', 'MTY', 'CUN',
    // Central & South America
    'PTY', 'BOG', 'MDE', 'LIM',
    'GRU', 'GIG', 'BSB', 'SSA',
    'EZE', 'COR', 'SCL',
    'UIO', 'GYE', 'CCS', 'HAV',
  ],
};

function getRegion(code: string): string {
  for (const [region, codes] of Object.entries(REGION_MAP)) {
    if (codes.includes(code)) return region;
  }
  return 'Other';
}

const RANK_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'] as const;

export function ExploreScreen({ navigation, route }: ExploreScreenProps) {
  const params = route.params;
  const { adults, currency: routeCurrency } = params;
  const isDealsMode = params.mode === 'deals';

  const { theme } = useTheme();
  const { t, language, locale, currency: localeCurrency } = useLocale();
  const runtimeConfig = useRuntimeConfig();
  const { width } = useWindowDimensions();
  const isMobile = useIsMobile();

  // Mutable search params (sidebar / date modal can change these)
  const [origin, setOrigin] = useState(params.origin);
  const initialDr = initialDatesFromRouteParams(params);
  const [departureDate, setDepartureDate] = useState(initialDr.departureDate);
  const [returnDate, setReturnDate] = useState(initialDr.returnDate);

  // ── Search-mode sidebar form state ────────────────────────────────────────
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>(initialDr.tripType);
  const [formParams, setFormParams] = useState<CreateSearchSessionRequest>({
    origin: params.origin,
    destination: ANYWHERE_CODE,
    departureDate: initialDr.departureDate,
    returnDate: initialDr.returnDate || (undefined as any),
    adults: params.adults ?? 1,
    children: 0,
    infants: 0,
    cabinClass: 'ECONOMY',
    cabinPreference: 'ECONOMY',
    includeCheckedBag: false,
    currency: params.currency ?? 'USD',
    locale: 'en-US',
  });
  const updateForm = <K extends keyof CreateSearchSessionRequest>(key: K, value: CreateSearchSessionRequest[K]) =>
    setFormParams((p) => ({ ...p, [key]: value }));

  // ── Deals-mode sidebar form state ─────────────────────────────────────────
  const initYear  = params.mode === 'deals' ? params.year  : new Date().getFullYear();
  const initMonth = params.mode === 'deals' ? params.month : new Date().getMonth() + 1;
  const initDuration  = params.mode === 'deals' ? params.durationDays : 7;
  const initChildren  = params.mode === 'deals' ? params.children  : 0;
  const initNonStop   = params.mode === 'deals' ? params.nonStop   : false;
  const [localYear,     setLocalYear]     = useState(initYear);
  const [localMonth,    setLocalMonth]    = useState(initMonth);
  const [localDuration, setLocalDuration] = useState(initDuration);
  const [localAdults,   setLocalAdults]   = useState(params.adults ?? 1);
  const [localChildren, setLocalChildren] = useState(initChildren);
  const [localNonStop,  setLocalNonStop]  = useState(initNonStop);

  const todayYear  = new Date().getFullYear();
  const todayMonth = new Date().getMonth() + 1;
  const atEarliestMonth = localYear === todayYear && localMonth <= todayMonth;

  const bumpDealsMonth = (dir: 1 | -1) => {
    let nm = localMonth + dir;
    let ny = localYear;
    if (nm < 1)  { nm = 12; ny -= 1; }
    if (nm > 12) { nm = 1;  ny += 1; }
    setLocalMonth(nm);
    setLocalYear(ny);
    const dep = firstBookableDepartureInMonth(ny, nm);
    const ret = addDaysYmdUtc(dep, localDuration);
    setDepartureDate(dep);
    setReturnDate(ret);
  };

  const [destinations, setDestinations] = useState<ExploreDestination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formSearchError, setFormSearchError] = useState<string | null>(null);
  const [searchingDest, setSearchingDest] = useState<string | null>(null);

  /** Server-side explore session (top N cheapest + load more without re-scanning from scratch). */
  const [exploreSessionId, setExploreSessionId] = useState('');
  const [exploreHasMore, setExploreHasMore] = useState(false);
  const [exploreNextOffset, setExploreNextOffset] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [liveRefreshing, setLiveRefreshing] = useState(false);
  const exploreFetchGenRef = useRef(0);

  // Filter / sort
  const [sortAsc, setSortAsc] = useState(true);
  const [regionFilter, setRegionFilter] = useState<string>('All');

  // Mobile Edit: full search / deals form (same fields as desktop sidebar)
  const [showEditSearchModal, setShowEditSearchModal] = useState(false);

  const originEntry = getAirportEntry(origin);
  const originCity = originEntry ? getCityDisplayName(originEntry, language as any) : origin;
  const originFlagEmoji = countryFlag(originEntry?.countryCode);

  type DoFetchOverrides = { origin?: string; departureDate?: string; returnDate?: string };

  const doFetch = (overrides?: DoFetchOverrides) => {
    const org = (overrides?.origin ?? origin).trim();
    if (!org) return;
    const fetchGen = ++exploreFetchGenRef.current;
    const isCurrent = () => exploreFetchGenRef.current === fetchGen;

    setLoading(true);
    setError(null);
    setDestinations([]);
    setExploreSessionId('');
    setExploreHasMore(false);
    setExploreNextOffset(0);
    setLiveRefreshing(false);
    // New result set: a stale region filter can hide every row while destinations.length > 0.
    setRegionFilter('All');
    const dep = overrides?.departureDate ?? departureDate;
    const ret = overrides?.returnDate ?? returnDate;

    const req =
      isDealsMode && params.mode === 'deals'
        ? {
            origin: org,
            year: localYear,
            month: localMonth,
            durationDays: localDuration,
            currency: routeCurrency,
            adults: localAdults,
            children: localChildren,
            nonStop: localNonStop,
          }
        : {
            origin: org,
            departureDate: dep || undefined,
            returnDate: ret || undefined,
            currency: routeCurrency,
            adults: formParams.adults ?? adults ?? 1,
          };

    const pageSize = 64;
    let watchdog: ReturnType<typeof setTimeout> | undefined;
    const clearWatchdog = () => {
      if (watchdog) {
        clearTimeout(watchdog);
        watchdog = undefined;
      }
    };
    watchdog = setTimeout(() => {
      if (!isCurrent()) return;
      setLoading(false);
      setLiveRefreshing(false);
    }, runtimeConfig.explorePrefetchTimeoutMs + runtimeConfig.exploreLiveTimeoutMs);

    // Prefetch returns cached real prices only (no estimate placeholders). Live batches
    // then grow the list as confirmed destinations arrive.
    getExploreDestinations({ ...req, limit: pageSize, offset: 0, prefetch: true }, runtimeConfig.explorePrefetchTimeoutMs)
      .then(async (res) => {
        if (!isCurrent()) return;
        const confirmed = (res.destinations ?? []).filter(
          (d) => d.priceSource !== 'estimated',
        );
        setDestinations(confirmed);
        setExploreSessionId(res.sessionId);
        setExploreHasMore(res.hasMore);
        setExploreNextOffset(res.offset + res.destinations.length);

        // Cached hits: show the list immediately. Cold cache: wait for the first live round.
        if (confirmed.length > 0) {
          setLoading(false);
        }

        if (!res.sessionId || !res.liveRefreshAvailable) {
          setLoading(false);
          return;
        }

        setLiveRefreshing(true);
        let liveFailed = false;
        let lastConfirmed = confirmed;
        try {
          let avail = true;
          let rounds = 0;
          // Backend caps ~36 live GF2 calls/session (~3 batches of 12).
          const maxRounds = 3;
          while (avail && rounds < maxRounds) {
            if (!isCurrent()) return;
            try {
              const r2 = await getExploreDestinations({
                sessionId: res.sessionId,
                offset: 0,
                limit: pageSize,
                live: true,
              }, runtimeConfig.exploreLiveTimeoutMs);
              if (!isCurrent()) return;
              const next = (r2.destinations ?? []).filter(
                (d) => d.priceSource !== 'estimated',
              );
              lastConfirmed = next;
              setDestinations(next);
              setExploreHasMore(r2.hasMore);
              setExploreNextOffset(r2.offset + r2.destinations.length);
              if (next.length > 0) {
                setLoading(false);
              }
              avail = !!r2.liveRefreshAvailable;
            } catch {
              liveFailed = true;
              break;
            }
            rounds += 1;
            // Never keep the full-screen loader for more than one live round.
            // Extra rounds only refine the list in the background.
            setLoading(false);
            if (lastConfirmed.length === 0) {
              break;
            }
          }
        } finally {
          clearWatchdog();
          if (!isCurrent()) return;
          setLiveRefreshing(false);
          setLoading(false);
          // Cold cache + failed live would otherwise show a false "No destinations found".
          if (liveFailed && lastConfirmed.length === 0) {
            setError(t('explore_error'));
          }
        }
      })
      .catch(() => {
        clearWatchdog();
        if (!isCurrent()) return;
        setError(t('explore_error'));
        setLoading(false);
        setLiveRefreshing(false);
      });
  };

  const loadMoreExplore = () => {
    if (!exploreSessionId || !exploreHasMore || loadingMore || loading || liveRefreshing) return;
    setLoadingMore(true);
    getExploreDestinations({
      sessionId: exploreSessionId,
      offset: exploreNextOffset,
      limit: 10,
    })
      .then((res) => {
        setDestinations((prev) => {
          const seen = new Set(prev.map((d) => d.destination));
          const next = [...prev];
          for (const d of res.destinations) {
            if (d.priceSource === 'estimated') continue;
            if (!seen.has(d.destination)) {
              next.push(d);
              seen.add(d.destination);
            }
          }
          return next;
        });
        setExploreHasMore(res.hasMore);
        setExploreNextOffset(res.offset + res.destinations.length);
      })
      .catch(() => setError(t('explore_error')))
      .finally(() => setLoadingMore(false));
  };

  useEffect(() => {
    const org = (params.origin || '').trim();
    const dr = initialDatesFromRouteParams(params);
    setOrigin(org);
    setDepartureDate(dr.departureDate);
    setReturnDate(dr.returnDate);
    setTripType(dr.tripType);
    setFormParams((p) => ({
      ...p,
      origin: org,
      departureDate: dr.departureDate,
      returnDate: dr.tripType === 'one-way' ? (undefined as any) : dr.returnDate,
    }));
    doFetch({ origin: org, departureDate: dr.departureDate, returnDate: dr.returnDate });
    return () => {
      exploreFetchGenRef.current += 1;
    };
    // Refetch when Search Form (or deals) navigates here again — the screen often stays mounted.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    params.origin,
    isDealsMode && params.mode === 'deals' ? params.year : params.departureDate,
    isDealsMode && params.mode === 'deals' ? params.month : params.returnDate,
    isDealsMode && params.mode === 'deals' ? params.durationDays : '',
    params.adults,
    params.currency,
    isDealsMode,
    params.searchNonce,
  ]);

  // If the region pill no longer applies to any row (e.g. stale selection), show all again.
  useEffect(() => {
    if (regionFilter === 'All' || destinations.length === 0) return;
    const anyInRegion = destinations.some((d) => getRegion(d.destination) === regionFilter);
    if (!anyInRegion) setRegionFilter('All');
  }, [destinations, regionFilter]);

  const handlePickDestination = async (dest: ExploreDestination) => {
    if (searchingDest) return;
    setSearchingDest(dest.destination);

    if (isDealsMode && params.mode === 'deals') {
      try {
        dealsActions.setLoading(true);
        dealsActions.setError(null);
        // Keep store in sync with this explore search so MonthDealsResults shows the right route/period.
        dealsActions.setRoute(origin.trim(), dest.destination.trim());
        dealsActions.setMonth(localYear, localMonth);
        dealsActions.setDurationDays(localDuration);
        const res = await getMonthDeals({
          origin,
          destination: dest.destination,
          year: localYear,
          month: localMonth,
          durationDays: localDuration,
          currency: routeCurrency,
          adults: localAdults,
          children: localChildren,
          nonStop: localNonStop,
        });
        dealsActions.setData(res);
        navigation.navigate('MonthDealsResults');
      } catch (e) {
        dealsActions.setError(e instanceof Error ? e.message : 'Failed to load deals');
      } finally {
        dealsActions.setLoading(false);
        setSearchingDest(null);
      }
      return;
    }

    try {
      const payload: CreateSearchSessionRequest = {
        origin,
        destination: dest.destination,
        departureDate: departureDate || dest.departureDate || new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
        returnDate: (tripType === 'round-trip' ? returnDate : undefined) || undefined,
        cabinClass: formParams.cabinClass ?? 'ECONOMY',
        cabinPreference: formParams.cabinPreference ?? 'ECONOMY',
        includeCheckedBag: false,
        adults: formParams.adults ?? adults ?? 1,
        children: formParams.children ?? 0,
        infants: 0,
        currency: routeCurrency || 'USD',
        locale: locale || 'en-US',
      };
      setCachedSearch(payload);
      const generation = searchActions.beginSearch(payload, { clearSession: false });
      const session = await createSearchSession(payload);
      if (!isCurrentSearchGeneration(generation)) return;
      searchActions.setSession(session.id, session, session.status);
      searchActions.setResults([], 0);
      updateSearchUrl({ ...payload, sessionId: session.id });
      navigation.navigate('Results', { sessionId: session.id });
    } catch {
      setError(t('search_failed'));
    } finally {
      setSearchingDest(null);
    }
  };

  const availableRegions = useMemo(() => {
    const seen = new Set<string>();
    destinations.forEach((d) => seen.add(getRegion(d.destination)));
    return ['All', ...Array.from(seen).sort()];
  }, [destinations]);

  const displayed = useMemo(() => {
    let list = destinations;
    if (regionFilter !== 'All') {
      list = list.filter((d) => getRegion(d.destination) === regionFilter);
    }
    return [...list].sort((a, b) => {
      const pa = parseFloat(String(a.price)), pb = parseFloat(String(b.price));
      const na = Number.isFinite(pa) ? pa : 0;
      const nb = Number.isFinite(pb) ? pb : 0;
      return sortAsc ? na - nb : nb - na;
    });
  }, [destinations, regionFilter, sortAsc]);

  const tripLabel = isDealsMode
    ? `${formatMonthYear(localYear, localMonth, language)} · ${localDuration} ${t('days')}`
    : returnDate
      ? `${fmtDate(departureDate)} – ${fmtDate(returnDate)}`
      : fmtDate(departureDate);

  /** Sidebar / Edit modal "Search flights": Anywhere → re-fetch explore; specific airport → Results. */
  const handleSidebarSearch = async () => {
    const newOrigin = (formParams.origin || origin).trim();
    const destRaw = (formParams.destination || '').trim().toUpperCase();
    const newDep = formParams.departureDate || departureDate;
    const newRet = tripType === 'round-trip' ? (formParams.returnDate || returnDate) : '';

    if (!newOrigin || !destRaw) {
      setFormSearchError(t('please_fill_origin_destination'));
      return;
    }

    if (destRaw === ANYWHERE_CODE) {
      setFormSearchError(null);
      setShowEditSearchModal(false);
      setOrigin(newOrigin.toUpperCase());
      setDepartureDate(newDep);
      setReturnDate(newRet);
      setFormParams((p) => ({
        ...p,
        origin: newOrigin.toUpperCase(),
        departureDate: newDep,
        returnDate: tripType === 'one-way' ? (undefined as any) : newRet || undefined,
      }));
      doFetch({ origin: newOrigin, departureDate: newDep, returnDate: newRet });
      return;
    }

    if (!newDep) {
      setFormSearchError(t('please_fill_origin_destination'));
      return;
    }
    if (tripType === 'round-trip' && !newRet) {
      setFormSearchError(t('please_choose_return'));
      return;
    }

    setFormSearchError(null);
    setShowEditSearchModal(false);
    setLoading(true);
    try {
      const cabin: CreateSearchSessionRequest['cabinClass'] =
        formParams.cabinClass === 'ECONOMY' || formParams.cabinClass === 'PREMIUM_ECONOMY' ||
        formParams.cabinClass === 'BUSINESS' || formParams.cabinClass === 'FIRST'
          ? formParams.cabinClass
          : 'ECONOMY';
      const payload: CreateSearchSessionRequest = {
        ...formParams,
        origin: newOrigin.toUpperCase(),
        destination: destRaw,
        departureDate: newDep,
        returnDate: tripType === 'one-way' ? undefined : newRet || undefined,
        cabinClass: cabin,
        cabinPreference: cabin as CreateSearchSessionRequest['cabinPreference'],
        includeCheckedBag: false,
        currency: localeCurrency || formParams.currency || 'USD',
        locale: locale || formParams.locale || 'en-US',
        adults: formParams.adults ?? adults ?? 1,
        children: formParams.children ?? 0,
        infants: formParams.infants ?? 0,
      };
      setOrigin(payload.origin);
      setDepartureDate(newDep);
      setReturnDate(newRet);
      setFormParams((p) => ({ ...p, ...payload }));
      setCachedSearch(payload);
      const generation = searchActions.beginSearch(payload, { clearSession: false });
      const session = await createSearchSession(payload);
      if (!isCurrentSearchGeneration(generation)) return;
      searchActions.setSession(session.id, session, session.status);
      searchActions.setResults([], 0);
      updateSearchUrl({ ...payload, sessionId: session.id });
      navigation.navigate('Results', { sessionId: session.id });
    } catch (e) {
      setFormSearchError(e instanceof Error ? e.message : t('search_failed'));
    } finally {
      setLoading(false);
    }
  };

  // ── Search / deals form fields (desktop sidebar + mobile Edit modal) ───────

  const runDealsExploreSearch = () => {
    const dep = firstBookableDepartureInMonth(localYear, localMonth);
    const ret = addDaysYmdUtc(dep, localDuration);
    setDepartureDate(dep);
    setReturnDate(ret);
    setShowEditSearchModal(false);
    doFetch();
  };

  const dealsFormFields = (
    <>
      <AirportAutocomplete
        label={t('from')}
        value={origin}
        onChange={(v) => { setOrigin(v); updateForm('origin', v); }}
        placeholder={t('city_or_airport')}
      />
      {/* Destination locked to Anywhere */}
      <AirportAutocomplete
        label={t('to')}
        value={ANYWHERE_CODE}
        onChange={() => {}}
        placeholder={t('anywhere')}
        showAnywhere
      />

      <PassengerCabinPicker
        adults={localAdults}
        children={localChildren}
        cabinClass="ECONOMY"
        onAdultsChange={(n) => { setLocalAdults(n); }}
        onChildrenChange={(n) => { setLocalChildren(n); }}
        onCabinChange={() => {}}
        label={t('passengers_cabin')}
        passengersOnly
      />

      {/* Duration stepper */}
      <Text style={[p.label, { color: theme.text }]}>{t('trip_duration_days')}</Text>
      <View style={p.stepperRow}>
        <TouchableOpacity
          style={[p.stepBtn, { backgroundColor: theme.controlBg, borderColor: theme.cardBorder }]}
          onPress={() => {
            const nd = Math.max(1, localDuration - 1);
            setLocalDuration(nd);
            const dep = departureDate || firstBookableDepartureInMonth(localYear, localMonth);
            setReturnDate(addDaysYmdUtc(dep, nd));
          }}
        >
          <Text style={[p.stepBtnText, { color: theme.text }]}>−</Text>
        </TouchableOpacity>
        <Text style={[p.stepValue, { color: theme.text }]}>{localDuration} {t('days')}</Text>
        <TouchableOpacity
          style={[p.stepBtn, { backgroundColor: theme.controlBg, borderColor: theme.cardBorder }]}
          onPress={() => {
            const nd = Math.min(21, localDuration + 1);
            setLocalDuration(nd);
            const dep = departureDate || firstBookableDepartureInMonth(localYear, localMonth);
            setReturnDate(addDaysYmdUtc(dep, nd));
          }}
        >
          <Text style={[p.stepBtnText, { color: theme.text }]}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Month navigator */}
      <View style={[p.monthNav, { backgroundColor: theme.controlBg, borderColor: theme.cardBorder }]}>
        <TouchableOpacity
          onPress={() => bumpDealsMonth(-1)}
          style={[p.navBtn, atEarliestMonth && { opacity: 0.45 }]}
          disabled={atEarliestMonth}
          activeOpacity={atEarliestMonth ? 1 : 0.7}
        >
          <View style={p.navBtnInner}>
            <AppIcon name="chevron-back" size={18} color={atEarliestMonth ? theme.textMuted : theme.primary} fallbackText={t('prev')} />
            <Text style={[p.navText, { color: atEarliestMonth ? theme.textMuted : theme.primary }]}>{t('prev')}</Text>
          </View>
        </TouchableOpacity>
        <Text style={[p.monthTitle, { color: theme.text }]}>{formatMonthYear(localYear, localMonth, language)}</Text>
        <TouchableOpacity onPress={() => bumpDealsMonth(1)} style={p.navBtn}>
          <View style={p.navBtnInner}>
            <Text style={[p.navText, { color: theme.primary }]}>{t('next')}</Text>
            <AppIcon name="chevron-forward" size={18} color={theme.primary} fallbackText={t('next')} />
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[p.searchBtn, { backgroundColor: theme.buttonBg }, loading && { opacity: 0.5 }]}
        disabled={loading}
        onPress={runDealsExploreSearch}
        activeOpacity={0.8}
      >
        {loading ? (
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

  const searchFormFields = (
    <SearchFormContent
      params={formParams}
      update={updateForm}
      tripType={tripType}
      setTripType={(tt) => {
        setTripType(tt);
        if (tt === 'one-way') updateForm('returnDate', undefined as any);
      }}
      onSearch={handleSidebarSearch}
      onPassengerCabinDone={handleSidebarSearch}
      loading={loading}
      error={formSearchError}
      compact
    />
  );

  const searchSidebar = (
    <View style={[d.searchSidebar, { backgroundColor: theme.cardBg, borderRightColor: theme.cardBorder }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={isDealsMode ? { gap: 4 } : undefined}
      >
        {isDealsMode ? dealsFormFields : searchFormFields}
      </ScrollView>
    </View>
  );

  // ── Filter sidebar (desktop right panel) ──────────────────────────────────

  const filterSidebar = (
    <View style={[d.filterSidebar, { backgroundColor: theme.cardBg, borderLeftColor: theme.cardBorder }]}>
      <Text style={[d.sidebarTitle, { color: theme.text }]}>
        Filters {destinations.length > 0 ? `· ${displayed.length} found` : ''}
      </Text>

      {/* Sort */}
      <Text style={[d.fieldLabel, { color: theme.textMuted }]}>Sort by</Text>
      <TouchableOpacity
        style={[d.sortPill, { borderColor: sortAsc ? theme.primary : theme.cardBorder, backgroundColor: sortAsc ? theme.primary + '18' : theme.controlBg }]}
        onPress={() => setSortAsc(true)}
        activeOpacity={0.7}
      >
        <Text style={[d.sortPillText, { color: sortAsc ? theme.primary : theme.text }]}>💰 {t('explore_cheapest_first')}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[d.sortPill, { borderColor: !sortAsc ? theme.primary : theme.cardBorder, backgroundColor: !sortAsc ? theme.primary + '18' : theme.controlBg, marginTop: 6 }]}
        onPress={() => setSortAsc(false)}
        activeOpacity={0.7}
      >
        <Text style={[d.sortPillText, { color: !sortAsc ? theme.primary : theme.text }]}>💸 Most expensive</Text>
      </TouchableOpacity>

      {/* Region */}
      <Text style={[d.fieldLabel, { color: theme.textMuted, marginTop: 16 }]}>Region</Text>
      {availableRegions.map((r) => (
        <TouchableOpacity
          key={r}
          style={[
            d.regionPill,
            { borderColor: regionFilter === r ? theme.primary : theme.cardBorder, backgroundColor: regionFilter === r ? theme.primary : theme.controlBg },
          ]}
          onPress={() => setRegionFilter(r)}
          activeOpacity={0.7}
        >
          <Text style={[d.regionPillText, { color: regionFilter === r ? '#fff' : theme.text }]}>{r}</Text>
        </TouchableOpacity>
      ))}

      {/* Disclaimer */}
      <View style={[d.disclaimer, { borderColor: theme.cardBorder }]}>
        <AppIcon name="information-circle-outline" size={13} color={theme.textMuted} fallbackText="i" />
        <Text style={[d.disclaimerText, { color: theme.textMuted }]}>
          {' '}{isDealsMode ? t('explore_month_deals_disclaimer') : t('explore_prices_indicative')}
        </Text>
      </View>
    </View>
  );

  // ── Results list ──────────────────────────────────────────────────────────

  const resultsList = (
    <>
      {loading || (liveRefreshing && destinations.length === 0 && !error) ? (
        <View style={s.centered}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[s.loadingTitle, { color: theme.text }]}>{t('explore_loading')}</Text>
          <Text style={[s.loadingSub, { color: theme.textMuted }]}>
            {isDealsMode ? t('explore_loading_sub_deals') : t('explore_loading_sub_worldwide')}
          </Text>
        </View>
      ) : error ? (
        <View style={s.centered}>
          <AppIcon name="alert-circle-outline" size={44} color={theme.error} fallbackText="!" />
          <Text style={[s.errorTitle, { color: theme.text }]}>Could not load destinations</Text>
          <Text style={[s.errorSub, { color: theme.textMuted }]}>{error}</Text>
          <TouchableOpacity style={[s.retryBtn, { borderColor: theme.primary }]} onPress={() => doFetch()}>
            <Text style={[s.retryText, { color: theme.primary }]}>{t('try_again')}</Text>
          </TouchableOpacity>
        </View>
      ) : destinations.length === 0 ? (
        <View style={s.centered}>
          <AppIcon name="search-outline" size={44} color={theme.textMuted} fallbackText="?" />
          <Text style={[s.errorTitle, { color: theme.text }]}>{t('explore_no_destinations')}</Text>
          <Text style={[s.errorSub, { color: theme.textMuted }]}>
            {t('explore_no_destinations_tip')}
          </Text>
          <TouchableOpacity style={[s.retryBtn, { borderColor: theme.primary }]} onPress={() => doFetch()}>
            <Text style={[s.retryText, { color: theme.primary }]}>{t('try_again')}</Text>
          </TouchableOpacity>
        </View>
      ) : displayed.length === 0 ? (
        <View style={s.centered}>
          <Text style={[s.errorTitle, { color: theme.text }]}>{t('explore_no_region')}</Text>
          <TouchableOpacity style={[s.retryBtn, { borderColor: theme.primary }]} onPress={() => setRegionFilter('All')}>
            <Text style={[s.retryText, { color: theme.primary }]}>{t('explore_show_all_regions')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={s.resultsScroll} contentContainerStyle={s.scroll}>
          {/* Top 3 picks — always shown first when not filtering by region */}
          {regionFilter === 'All' && displayed.length > 0 && (
            <>
              <Text style={[s.sectionLabel, { color: theme.textMuted }]}>{t('explore_top_picks')}</Text>
              <View style={s.grid}>
                {displayed.slice(0, Math.min(3, displayed.length)).map((dest, idx) => (
                  <DestCard
                    key={dest.destination}
                    dest={dest}
                    origin={origin}
                    rank={idx}
                    theme={theme}
                    language={language}
                    isSearching={searchingDest === dest.destination}
                    disabled={!!searchingDest}
                    onPress={() => handlePickDestination(dest)}
                    isDealsMode={isDealsMode}
                  />
                ))}
              </View>
            </>
          )}

          {/* Remaining visible results */}
          {(regionFilter !== 'All' ? displayed : displayed.slice(3)).length > 0 && (
            <>
              <Text style={[s.sectionLabel, { color: theme.textMuted }]}>
                {regionFilter === 'All' ? t('explore_more_destinations') : regionFilter}
              </Text>
              <View style={s.grid}>
                {(regionFilter !== 'All' ? displayed : displayed.slice(3)).map((dest) => (
                    <DestCard
                      key={dest.destination}
                      dest={dest}
                      origin={origin}
                      rank={null}
                      theme={theme}
                      language={language}
                      isSearching={searchingDest === dest.destination}
                      disabled={!!searchingDest}
                      onPress={() => handlePickDestination(dest)}
                      isDealsMode={isDealsMode}
                    />
                  ))}
              </View>
            </>
          )}

          {/* Load more button */}
          {exploreHasMore && (
            <TouchableOpacity
              style={[s.loadMoreBtn, { borderColor: theme.primary }]}
              onPress={loadMoreExplore}
              disabled={loadingMore}
              activeOpacity={0.8}
            >
              {loadingMore ? (
                <ActivityIndicator size="small" color={theme.primary} />
              ) : (
                <>
                  <Text style={[s.loadMoreText, { color: theme.primary }]}>Load 10 more</Text>
                  <AppIcon name="chevron-down" size={16} color={theme.primary} fallbackText="↓" />
                </>
              )}
            </TouchableOpacity>
          )}
        </ScrollView>
      )}
    </>
  );

  // ── Top summary bar (shared mobile + desktop) ─────────────────────────────

  const formDestCode = formParams.destination?.trim().toUpperCase();
  let summaryDestLabel = t('anywhere');
  if (!isDealsMode && formDestCode && formDestCode !== ANYWHERE_CODE) {
    const entry = getAirportEntry(formDestCode);
    summaryDestLabel = entry ? getCityDisplayName(entry, language as any) : formDestCode;
  }

  const summaryBar = (
    <View style={[s.summaryBar, { backgroundColor: theme.cardBg, borderBottomColor: theme.cardBorder }]}>
      <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
        <AppIcon name="arrow-back" size={20} color={theme.text} fallbackText="←" />
      </TouchableOpacity>
      <View style={s.summaryMid}>
        <Text style={[s.summaryRoute, { color: theme.text }]} numberOfLines={1}>
          {originFlagEmoji} {originCity} → <Text style={{ color: theme.primary }}>{summaryDestLabel}</Text>
        </Text>
        {tripLabel ? (
          <Text style={[s.summaryDate, { color: theme.textMuted }]}>{tripLabel}</Text>
        ) : null}
        {liveRefreshing && destinations.length > 0 ? (
          <View style={s.liveRefreshRow}>
            <ActivityIndicator size="small" color={theme.primary} />
            <Text style={[s.liveRefreshText, { color: theme.textMuted }]}>{t('explore_live_updating')}</Text>
          </View>
        ) : null}
      </View>
      {/* Mobile: Edit opens full search / deals form (not calendar-only) */}
      {isMobile && (
        <TouchableOpacity
          style={[s.editBtn, { borderColor: theme.cardBorder }]}
          onPress={() => setShowEditSearchModal(true)}
          activeOpacity={0.7}
        >
          <AppIcon name="create-outline" size={15} color={theme.primary} fallbackText="✏" />
          <Text style={[s.editBtnText, { color: theme.primary }]}>{t('edit_search')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // ── Mobile toolbar (sort + region pills) ──────────────────────────────────

  const dealsExploreHint =
    isDealsMode && !loading && !error && destinations.length > 0 ? (
      <View style={[s.dealsHintBar, { borderBottomColor: theme.cardBorder, backgroundColor: theme.screenBg }]}>
        <Text style={[s.dealsHintText, { color: theme.textMuted }]}>{t('explore_month_deals_disclaimer')}</Text>
      </View>
    ) : null;

  const mobileToolbar = !loading && !error && destinations.length > 0 && (
    <View style={[s.toolbar, { backgroundColor: theme.navBg, borderBottomColor: theme.cardBorder }]}>
      <TouchableOpacity
        style={[s.sortBtn, { borderColor: theme.cardBorder, backgroundColor: theme.controlBg }]}
        onPress={() => setSortAsc((v) => !v)}
        activeOpacity={0.7}
      >
        <Text style={[s.sortBtnText, { color: theme.primary }]}>
          💰 {sortAsc ? t('explore_cheapest_first') : t('explore_most_expensive')}
        </Text>
      </TouchableOpacity>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.regionPills}>
        {availableRegions.map((r) => (
          <TouchableOpacity
            key={r}
            style={[
              s.regionPill,
              { borderColor: theme.cardBorder, backgroundColor: theme.controlBg },
              regionFilter === r && { backgroundColor: theme.primary, borderColor: theme.primary },
            ]}
            onPress={() => setRegionFilter(r)}
            activeOpacity={0.7}
          >
            <Text style={[s.regionPillText, { color: regionFilter === r ? '#fff' : theme.text }]}>{r}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <View style={[s.screen, { backgroundColor: theme.screenBg }]}>
      {summaryBar}

      {isMobile ? (
        // ── Mobile: toolbar + full-width results ──────────────────────────
        <>
          {dealsExploreHint}
          {mobileToolbar}
          {resultsList}
        </>
      ) : (
        // ── Desktop: 3-column layout — sidebars only shown after results load ──
        <View style={s.threeCol}>
          {!loading && searchSidebar}
          <View style={s.centerCol}>
            {resultsList}
          </View>
          {!loading && filterSidebar}
        </View>
      )}

      {/* Full-screen loading overlay — blocks all taps while a search is in progress */}
      <SearchLoadingOverlay
        visible={!!searchingDest}
        origin={origin}
        destination={searchingDest ?? undefined}
      />

      {/* Mobile Edit search / deals form */}
      <Modal visible={showEditSearchModal} transparent animationType="fade">
        <View style={s.editSearchOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setShowEditSearchModal(false)} />
          <View style={[s.editSearchModalCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
            <View style={[s.editSearchModalHeader, { borderBottomColor: theme.cardBorder }]}>
              <Text style={[s.editSearchModalTitle, { color: theme.text }]}>{t('change_search')}</Text>
              <TouchableOpacity onPress={() => setShowEditSearchModal(false)} style={s.editSearchModalClose}>
                <AppIcon name="close" size={24} color={theme.textMuted} fallbackText={t('close')} />
              </TouchableOpacity>
            </View>
            <ScrollView
              style={s.editSearchModalScroll}
              contentContainerStyle={[s.editSearchModalContent, isDealsMode && { gap: 4 }]}
              keyboardShouldPersistTaps="handled"
            >
              {isDealsMode ? dealsFormFields : searchFormFields}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ── Destination card ──────────────────────────────────────────────────────────

interface DestCardProps {
  dest: ExploreDestination;
  origin: string;
  rank: number | null;
  theme: any;
  language: any;
  isSearching: boolean;
  disabled: boolean;
  onPress: () => void;
  isDealsMode: boolean;
}

function DestCard({ dest, origin, rank, theme, language, isSearching, disabled, onPress, isDealsMode }: DestCardProps) {
  const { t } = useLocale();
  const entry = getAirportEntry(dest.destination);
  const cityName = entry ? getCityDisplayName(entry, language) : dest.destination;
  const flag = countryFlag(entry?.countryCode);
  const priceStr = fmtPrice(dest.price, dest.currency);
  const rankColor = rank !== null ? RANK_COLORS[rank] : undefined;
  const isFeatured = rank === 0;
  const ctaLabel = isDealsMode ? 'Search deals' : 'Search flights';

  return (
    <TouchableOpacity
      style={[c.card, { backgroundColor: theme.cardBg, borderColor: isFeatured ? theme.primary : theme.cardBorder }, isFeatured && c.cardFeatured]}
      onPress={onPress}
      activeOpacity={0.78}
      disabled={disabled}
    >
      {rankColor && (
        <View style={[c.rankBadge, { backgroundColor: rankColor }]}>
          <Text style={c.rankText}>{rank === 0 ? '🏆' : rank === 1 ? '🥈' : '🥉'}</Text>
        </View>
      )}
      <View style={c.topRow}>
        <Text style={c.flagEmoji}>{flag}</Text>
        <View style={c.cityWrap}>
          <Text style={[c.cityName, { color: theme.text }]} numberOfLines={1}>{cityName}</Text>
          <Text style={[c.airportCode, { color: theme.textMuted }]}>
            {dest.destination}{entry?.countryCode ? ` · ${entry.countryCode}` : ''}
          </Text>
        </View>
        <View style={c.priceWrap}>
          {isSearching ? (
            <ActivityIndicator size="small" color={theme.primary} />
          ) : (
            <>
              <Text style={[c.priceFrom, { color: theme.textMuted }]}>{t('explore_from')}</Text>
              <Text style={[c.price, { color: isFeatured ? theme.primary : theme.text }]}>{priceStr}</Text>
            </>
          )}
        </View>
      </View>
      <View style={c.bottomRow}>
        <Text style={[c.route, { color: theme.textMuted }]}>
          {originSameMetroAsDestination(origin, dest.destination)
            ? t('explore_route_same_metro_hint').replace(/\{\{code\}\}/g, dest.destination)
            : `${origin} → ${dest.destination}`}
        </Text>
        {!isSearching && (
          <View style={[c.ctaChip, { backgroundColor: isFeatured ? theme.primary : theme.controlBg }]}>
            <Text style={[c.ctaText, { color: isFeatured ? '#fff' : theme.primary }]}>{ctaLabel}</Text>
            <AppIcon name="arrow-forward" size={12} color={isFeatured ? '#fff' : theme.primary} fallbackText="→" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────

/** Deals-form styles (mirrors MonthDealsScreen `p` stylesheet) */
const p = StyleSheet.create({
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
  searchBtn: { marginTop: 16, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  searchBtnText: { fontSize: 16, fontWeight: '600' },
});

/** Desktop sidebar styles */
const d = StyleSheet.create({
  searchSidebar: {
    width: 280,
    minWidth: 240,
    borderRightWidth: 1,
    padding: 18,
  },
  filterSidebar: {
    width: 240,
    minWidth: 200,
    borderLeftWidth: 1,
    padding: 18,
  },
  sidebarTitle: { fontSize: 16, fontWeight: '700', marginBottom: 14 },
  fieldLabel: { fontSize: 12, fontWeight: '600', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  dateInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  searchBtn: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  searchBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  sortPill: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  sortPillText: { fontSize: 13, fontWeight: '600' },
  regionPill: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 6,
  },
  regionPillText: { fontSize: 13, fontWeight: '500' },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    gap: 4,
  },
  disclaimerText: { fontSize: 11, flex: 1, lineHeight: 16 },
});

/** Shared / mobile styles */
const s = StyleSheet.create({
  screen: { flex: 1 },
  // 3-column desktop layout
  threeCol: { flex: 1, flexDirection: 'row', alignItems: 'stretch' },
  centerCol: { flex: 1, minWidth: 0, minHeight: 0 },
  /** Lets the results column fill the row on web flex layouts */
  resultsScroll: { flex: 1 },
  // Summary bar
  summaryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    gap: 8,
  },
  backBtn: { padding: 6 },
  summaryMid: { flex: 1 },
  summaryRoute: { fontSize: 15, fontWeight: '700' },
  summaryDate: { fontSize: 12, marginTop: 2 },
  liveRefreshRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  liveRefreshText: { fontSize: 12 },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  editBtnText: { fontSize: 13, fontWeight: '600' },
  dealsHintBar: { paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1 },
  dealsHintText: { fontSize: 12, lineHeight: 17 },
  // Mobile toolbar
  toolbar: { paddingVertical: 8, paddingHorizontal: 12, borderBottomWidth: 1, gap: 8 },
  sortBtn: { alignSelf: 'flex-start', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, marginBottom: 4 },
  sortBtnText: { fontSize: 13, fontWeight: '600' },
  regionPills: { gap: 6, paddingBottom: 2 },
  regionPill: { paddingVertical: 5, paddingHorizontal: 12, borderRadius: 16, borderWidth: 1 },
  regionPillText: { fontSize: 12, fontWeight: '600' },
  // Center column scroll
  scroll: { padding: 16, paddingBottom: 48 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, gap: 10 },
  loadingTitle: { fontSize: 17, fontWeight: '700', marginTop: 12 },
  loadingSub: { fontSize: 14, textAlign: 'center' },
  errorTitle: { fontSize: 17, fontWeight: '700' },
  errorSub: { fontSize: 14, textAlign: 'center', marginTop: 4 },
  retryBtn: { marginTop: 14, paddingVertical: 10, paddingHorizontal: 24, borderRadius: 10, borderWidth: 1 },
  retryText: { fontSize: 15, fontWeight: '600' },
  sectionLabel: {
    fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10, marginTop: 4,
  },
  grid: { gap: 10 },
  loadMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
  },
  loadMoreText: { fontSize: 14, fontWeight: '600' },
  // Edit search modal (mobile)
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
  editSearchModalScroll: { maxHeight: 480 },
  editSearchModalContent: { padding: 18, paddingBottom: 28 },
});

const c = StyleSheet.create({
  card: { borderRadius: 16, borderWidth: 1, padding: 14, marginBottom: 2, overflow: 'hidden' },
  cardFeatured: { borderWidth: 2 },
  rankBadge: { position: 'absolute', top: 0, right: 0, paddingHorizontal: 10, paddingVertical: 4, borderBottomLeftRadius: 12, borderTopRightRadius: 14 },
  rankText: { fontSize: 13 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  flagEmoji: { fontSize: 32, lineHeight: 36 },
  cityWrap: { flex: 1 },
  cityName: { fontSize: 17, fontWeight: '700' },
  airportCode: { fontSize: 13, marginTop: 2 },
  priceWrap: { alignItems: 'flex-end', minWidth: 70 },
  priceFrom: { fontSize: 11 },
  price: { fontSize: 22, fontWeight: '800' },
  bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
  route: { fontSize: 13 },
  ctaChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 20 },
  ctaText: { fontSize: 13, fontWeight: '600' },
});
