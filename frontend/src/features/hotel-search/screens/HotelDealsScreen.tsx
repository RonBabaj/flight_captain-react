/**
 * Hotel Deals — search form + results (mirrors Monthly Deals stack pattern).
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useTheme } from '../../../theme/ThemeContext';
import { useLocale } from '../../../context/LocaleContext';
import { useIsMobile } from '../../../hooks/useResponsive';
import { AppIcon } from '../../../components/AppIcon';
import { SearchLoadingOverlay } from '../../../components/SearchLoadingOverlay';
import { getCurrencySymbol } from '../../../utils/exchangeRates';
import { searchHotels, suggestHotelDestinations, getHotelDetails } from '../../../api';
import type {
  HotelDestinationSuggestion,
  HotelOffer,
  HotelSearchPrefill,
  HotelSearchRequest,
} from '../../../types/hotels';
import type { HotelDealsStackParamList } from '../../../navigation/types';
import { HotelResultCard } from '../components/HotelResultCard';

type SortMode = NonNullable<HotelSearchRequest['sort']>;

const SORT_OPTIONS: { key: SortMode; labelKey: string; hintKey: string }[] = [
  { key: 'cheapest', labelKey: 'hotel_sort_cheapest', hintKey: 'hotel_sort_cheapest_hint' },
  { key: 'best_value', labelKey: 'hotel_sort_best_value', hintKey: 'hotel_sort_best_value_hint' },
  { key: 'highest_rated', labelKey: 'hotel_sort_highest_rated', hintKey: 'hotel_sort_highest_rated_hint' },
  { key: 'most_popular', labelKey: 'hotel_sort_most_popular', hintKey: 'hotel_sort_most_popular_hint' },
];

function todayPlus(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function HotelDealsScreen({ view }: { view: 'form' | 'results' }) {
  const { theme } = useTheme();
  const { t, currency, language, isRTL } = useLocale();
  const isMobile = useIsMobile();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<HotelDealsStackParamList, 'HotelDealsForm' | 'HotelDealsResults'>>();
  const prefill = (route.params as HotelSearchPrefill | undefined) ?? undefined;

  const [destination, setDestination] = useState(prefill?.destination ?? '');
  const [regionId, setRegionId] = useState<number | undefined>(prefill?.regionId);
  const [checkIn, setCheckIn] = useState(prefill?.checkIn ?? todayPlus(14));
  const [checkOut, setCheckOut] = useState(prefill?.checkOut ?? todayPlus(19));
  const [adults, setAdults] = useState(prefill?.adults ?? 2);
  const [rooms, setRooms] = useState(prefill?.rooms ?? 1);
  const [freeCancellation, setFreeCancellation] = useState(false);
  const [breakfastIncluded, setBreakfastIncluded] = useState(false);
  const [minStars, setMinStars] = useState(0);
  const [sort, setSort] = useState<SortMode>('cheapest');
  const [suggestions, setSuggestions] = useState<HotelDestinationSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<HotelOffer[]>([]);
  const [priceNote, setPriceNote] = useState('');
  const [selected, setSelected] = useState<HotelOffer | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    if (!prefill) return;
    if (prefill.destination) setDestination(prefill.destination);
    if (prefill.regionId) setRegionId(prefill.regionId);
    if (prefill.checkIn) setCheckIn(prefill.checkIn);
    if (prefill.checkOut) setCheckOut(prefill.checkOut);
    if (prefill.adults) setAdults(prefill.adults);
    if (prefill.rooms) setRooms(prefill.rooms);
  }, [prefill?.destination, prefill?.regionId, prefill?.checkIn, prefill?.checkOut, prefill?.adults, prefill?.rooms]);

  useEffect(() => {
    const q = destination.trim();
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const items = await suggestHotelDestinations(q, language === 'he' ? 'he' : language === 'ru' ? 'ru' : 'en');
        if (!cancelled) setSuggestions(items.slice(0, 8));
      } catch {
        if (!cancelled) setSuggestions([]);
      }
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [destination, language]);

  const runSearch = useCallback(async () => {
    setError('');
    if (!destination.trim()) {
      setError(t('hotel_err_destination'));
      return;
    }
    if (!checkIn || !checkOut || checkOut <= checkIn) {
      setError(t('hotel_err_dates'));
      return;
    }
    setLoading(true);
    try {
      const req: HotelSearchRequest = {
        destination: destination.trim(),
        regionId,
        checkIn,
        checkOut,
        adults,
        rooms,
        currency,
        language: language === 'he' ? 'he' : language === 'ru' ? 'ru' : 'en',
        freeCancellation: freeCancellation || undefined,
        breakfastIncluded: breakfastIncluded || undefined,
        minStarRating: minStars > 0 ? minStars : undefined,
        sort,
      };
      const res = await searchHotels(req);
      setResults(res.results ?? []);
      setPriceNote(res.message || (res.priceStatus === 'estimated' ? t('hotel_prices_estimated') : ''));
      if (view === 'form') {
        navigation.navigate('HotelDealsResults', {
          destination: destination.trim(),
          regionId,
          checkIn,
          checkOut,
          adults,
          rooms,
        } as HotelSearchPrefill);
      }
    } catch {
      setResults([]);
      setError(t('hotel_err_search'));
    } finally {
      setLoading(false);
    }
  }, [
    destination, regionId, checkIn, checkOut, adults, rooms, currency, language,
    freeCancellation, breakfastIncluded, minStars, sort, navigation, t, view,
  ]);

  useEffect(() => {
    if (prefill?.autoSearch && view === 'form') {
      runSearch();
    }
    // intentionally once when arriving with autoSearch
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (view === 'results' && results.length === 0 && !loading && !error && destination) {
      runSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  const onPickSuggestion = (s: HotelDestinationSuggestion) => {
    setDestination(s.name);
    if (s.regionId) setRegionId(s.regionId);
    setSuggestions([]);
  };

  const onViewDeal = async (offer: HotelOffer) => {
    setSelected(offer);
    setDetailsLoading(true);
    try {
      const res = await getHotelDetails({
        hotelId: offer.hotelId,
        hid: offer.providerHid,
        checkIn: offer.checkIn || checkIn,
        checkOut: offer.checkOut || checkOut,
        adults,
        rooms,
        currency,
      });
      if (res.hotel) setSelected(res.hotel);
    } catch {
      // keep SERP offer; still show estimated pricing
    } finally {
      setDetailsLoading(false);
    }
  };

  const sortHint = useMemo(
    () => SORT_OPTIONS.find((s) => s.key === sort)?.hintKey ?? '',
    [sort]
  );

  const form = (
    <ScrollView contentContainerStyle={[styles.formPad, isMobile && { paddingHorizontal: 14 }]}>
      <Text style={[styles.heading, { color: theme.text }]}>{t('hotel_deals_title')}</Text>
      <Text style={[styles.sub, { color: theme.textMuted }]}>{t('hotel_deals_subtitle')}</Text>

      <Text style={[styles.label, { color: theme.textMuted }]}>{t('hotel_destination')}</Text>
      <TextInput
        value={destination}
        onChangeText={(v) => {
          setDestination(v);
          setRegionId(undefined);
        }}
        placeholder={t('hotel_destination_placeholder')}
        placeholderTextColor={theme.textMuted}
        style={[styles.input, { backgroundColor: theme.controlBg, color: theme.text, borderColor: theme.cardBorder }]}
      />
      {suggestions.length > 0 && (
        <View style={[styles.suggestBox, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
          {suggestions.map((s) => (
            <TouchableOpacity key={s.id} style={styles.suggestItem} onPress={() => onPickSuggestion(s)}>
              <Text style={{ color: theme.text, fontWeight: '600' }}>{s.name}</Text>
              <Text style={{ color: theme.textMuted, fontSize: 12 }}>
                {s.type}{s.countryCode ? ` · ${s.countryCode}` : ''}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={[styles.row, isRTL && { flexDirection: 'row-reverse' }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.label, { color: theme.textMuted }]}>{t('hotel_checkin')}</Text>
          <TextInput
            value={checkIn}
            onChangeText={setCheckIn}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={theme.textMuted}
            style={[styles.input, { backgroundColor: theme.controlBg, color: theme.text, borderColor: theme.cardBorder }]}
          />
        </View>
        <View style={{ width: 12 }} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.label, { color: theme.textMuted }]}>{t('hotel_checkout')}</Text>
          <TextInput
            value={checkOut}
            onChangeText={setCheckOut}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={theme.textMuted}
            style={[styles.input, { backgroundColor: theme.controlBg, color: theme.text, borderColor: theme.cardBorder }]}
          />
        </View>
      </View>

      <View style={[styles.row, isRTL && { flexDirection: 'row-reverse' }]}>
        <Stepper label={t('hotel_guests')} value={adults} min={1} max={6} onChange={setAdults} theme={theme} />
        <View style={{ width: 12 }} />
        <Stepper label={t('hotel_rooms')} value={rooms} min={1} max={6} onChange={setRooms} theme={theme} />
      </View>

      <View style={[styles.toggleRow, isRTL && { flexDirection: 'row-reverse' }]}>
        <Text style={{ color: theme.text, flex: 1 }}>{t('hotel_free_cancellation')}</Text>
        <Switch value={freeCancellation} onValueChange={setFreeCancellation} />
      </View>
      <View style={[styles.toggleRow, isRTL && { flexDirection: 'row-reverse' }]}>
        <Text style={{ color: theme.text, flex: 1 }}>{t('hotel_breakfast')}</Text>
        <Switch value={breakfastIncluded} onValueChange={setBreakfastIncluded} />
      </View>

      <Text style={[styles.label, { color: theme.textMuted }]}>{t('hotel_min_stars')}</Text>
      <View style={[styles.chipRow, isRTL && { flexDirection: 'row-reverse' }]}>
        {[0, 3, 4, 5].map((n) => (
          <TouchableOpacity
            key={n}
            onPress={() => setMinStars(n)}
            style={[
              styles.chip,
              { borderColor: theme.cardBorder, backgroundColor: minStars === n ? theme.tabActive + '22' : theme.controlBg },
            ]}
          >
            <Text style={{ color: theme.text }}>{n === 0 ? t('hotel_any') : `${n}+ ★`}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {!!error && <Text style={{ color: '#ef4444', marginTop: 8 }}>{error}</Text>}

      <TouchableOpacity
        style={[styles.cta, { backgroundColor: theme.tabActive }]}
        onPress={runSearch}
        disabled={loading}
      >
        <Text style={styles.ctaText}>{t('hotel_search_cta')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const resultsView = (
    <View style={{ flex: 1 }}>
      <View style={[styles.resultsHeader, { borderBottomColor: theme.cardBorder, backgroundColor: theme.cardBg }]}>
        <Text style={{ color: theme.text, fontWeight: '700' }} numberOfLines={1}>
          {destination} · {checkIn} → {checkOut}
        </Text>
        <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 4 }}>
          {priceNote || t('hotel_prices_estimated')}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
          {SORT_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.key}
              onPress={() => {
                setSort(opt.key);
                setTimeout(() => runSearch(), 0);
              }}
              style={[
                styles.chip,
                {
                  marginRight: 8,
                  borderColor: theme.cardBorder,
                  backgroundColor: sort === opt.key ? theme.tabActive + '22' : theme.controlBg,
                },
              ]}
            >
              <Text style={{ color: theme.text, fontSize: 13 }}>{t(opt.labelKey)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {!!sortHint && (
          <Text style={{ color: theme.textMuted, fontSize: 11, marginTop: 6 }}>{t(sortHint)}</Text>
        )}
        <TouchableOpacity onPress={() => navigation.navigate('HotelDealsForm')} style={{ marginTop: 8 }}>
          <Text style={{ color: theme.tabActive, fontWeight: '600' }}>{t('hotel_edit_search')}</Text>
        </TouchableOpacity>
      </View>

      {loading && results.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator color={theme.tabActive} />
        </View>
      ) : results.length === 0 ? (
        <View style={styles.center}>
          <AppIcon name="bed-outline" size={40} color={theme.textMuted} fallbackText="Hotels" />
          <Text style={{ color: theme.text, marginTop: 12, fontWeight: '600' }}>{t('hotel_no_results')}</Text>
          <Text style={{ color: theme.textMuted, marginTop: 6, textAlign: 'center', paddingHorizontal: 24 }}>
            {error || t('hotel_no_results_tip')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => `${item.hotelId}-${item.totalPrice.amount}`}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          renderItem={({ item }) => (
            <HotelResultCard offer={item} onViewDeal={() => onViewDeal(item)} />
          )}
        />
      )}

      {selected && (
        <View style={[styles.detailSheet, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
          <View style={[styles.detailHeader, isRTL && { flexDirection: 'row-reverse' }]}>
            <Text style={{ color: theme.text, fontWeight: '700', flex: 1 }} numberOfLines={2}>
              {selected.name}
            </Text>
            <TouchableOpacity onPress={() => setSelected(null)}>
              <AppIcon name="close" size={22} color={theme.textMuted} fallbackText="Close" />
            </TouchableOpacity>
          </View>
          {detailsLoading ? (
            <ActivityIndicator color={theme.tabActive} />
          ) : (
            <>
              <Text style={{ color: theme.textMuted, marginBottom: 6 }}>
                {selected.priceStatus === 'live' ? t('hotel_price_live') : t('hotel_price_estimated')}
              </Text>
              <Text style={{ color: theme.text, fontSize: 22, fontWeight: '800' }}>
                {getCurrencySymbol(selected.currency || currency)} {selected.totalPrice.amount.toFixed(0)}
                <Text style={{ fontSize: 13, fontWeight: '500', color: theme.textMuted }}>
                  {' '}· {selected.nights} {t('hotel_nights')}
                </Text>
              </Text>
              {!!selected.roomType && (
                <Text style={{ color: theme.text, marginTop: 8 }}>{selected.roomType}</Text>
              )}
              {!!selected.cancellationPolicy && (
                <Text style={{ color: theme.textMuted, marginTop: 6 }}>{selected.cancellationPolicy}</Text>
              )}
              {!!selected.boardType && (
                <Text style={{ color: theme.textMuted, marginTop: 4 }}>{selected.boardType}</Text>
              )}
            </>
          )}
        </View>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.screenBg }]}>
      {view === 'form' ? form : resultsView}
      <SearchLoadingOverlay visible={loading && view === 'form'} />
    </View>
  );
}

function Stepper({
  label,
  value,
  min,
  max,
  onChange,
  theme,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
  theme: import('../../../theme/ThemeContext').Theme;
}) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={[styles.label, { color: theme.textMuted }]}>{label}</Text>
      <View style={[styles.stepper, { borderColor: theme.cardBorder, backgroundColor: theme.controlBg }]}>
        <TouchableOpacity onPress={() => onChange(Math.max(min, value - 1))} style={styles.stepBtn}>
          <Text style={{ color: theme.text, fontSize: 18 }}>−</Text>
        </TouchableOpacity>
        <Text style={{ color: theme.text, fontWeight: '700' }}>{value}</Text>
        <TouchableOpacity onPress={() => onChange(Math.min(max, value + 1))} style={styles.stepBtn}>
          <Text style={{ color: theme.text, fontSize: 18 }}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  formPad: { padding: 20, paddingBottom: 48 },
  heading: { fontSize: 24, fontWeight: '800', marginBottom: 6 },
  sub: { fontSize: 14, marginBottom: 18, lineHeight: 20 },
  label: { fontSize: 12, fontWeight: '600', marginBottom: 6, marginTop: 10 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    gap: 12,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  cta: {
    marginTop: 22,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  ctaText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  suggestBox: {
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 6,
    overflow: 'hidden',
  },
  suggestItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(127,127,127,0.25)',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  stepBtn: { paddingHorizontal: 12, paddingVertical: 4 },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  detailSheet: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
});
