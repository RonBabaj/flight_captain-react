/**
 * Dynamic Destinations — open-jaw and multi-city trips.
 * Fly outbound A→B, optional extra hops, then return C→D (usually D=A).
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../../theme/ThemeContext';
import { useLocale } from '../../../context/LocaleContext';
import { AirportAutocomplete } from '../../flight-search/components/AirportAutocomplete';
import { DateRangePicker } from '../../flight-search/components/DateRangePicker';
import { PassengerCabinPicker } from '../../flight-search/components/PassengerCabinPicker';
import { SearchLoadingOverlay } from '../../../components/SearchLoadingOverlay';
import { AppIcon } from '../../../components/AppIcon';
import { createSearchSession, getSearchSessionResults } from '../../../api';
import { searchActions, isCurrentSearchGeneration } from '../../../store';
import type { CreateSearchSessionRequest, ExtraSearchLeg } from '../../../types';
import type { DynamicDestinationsStackParamList } from '../../../navigation/types';

type Nav = NativeStackNavigationProp<DynamicDestinationsStackParamList, 'DynamicDestinationsForm'>;

const MAX_EXTRA_DESTINATIONS = 3;

const emptyExtra = (origin = ''): ExtraSearchLeg => ({
  origin,
  destination: '',
  date: '',
});

const defaultParams: CreateSearchSessionRequest = {
  origin: '',
  destination: '',
  departureDate: '',
  returnDate: '',
  returnOrigin: '',
  returnDestination: '',
  extraLegs: [],
  cabinClass: 'ECONOMY',
  cabinPreference: 'ECONOMY',
  includeCheckedBag: false,
  adults: 1,
  children: 0,
  infants: 0,
  currency: 'USD',
  locale: 'en-US',
};

export function DynamicDestinationsScreen({ navigation }: { navigation: Nav }) {
  const { theme } = useTheme();
  const { t, currency, locale, isRTL } = useLocale();
  const [params, setParams] = useState<CreateSearchSessionRequest>({
    ...defaultParams,
    currency,
    locale,
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const [extraDateIndex, setExtraDateIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const extras = params.extraLegs ?? [];

  const update = <K extends keyof CreateSearchSessionRequest>(
    key: K,
    value: CreateSearchSessionRequest[K],
  ) => {
    setParams((prev) => {
      const next = { ...prev, [key]: value };
      // Keep return destination synced to home origin unless the user already overrode it.
      if (key === 'origin' && typeof value === 'string') {
        const home = value.trim().toUpperCase();
        const prevHome = (prev.origin || '').trim().toUpperCase();
        const retDest = (prev.returnDestination || '').trim().toUpperCase();
        if (!retDest || retDest === prevHome) {
          next.returnDestination = home;
        }
      }
      // Chain the first extra "from" to outbound destination when it still matches the previous dest.
      if (key === 'destination' && typeof value === 'string') {
        const dest = value.trim().toUpperCase();
        const prevDest = (prev.destination || '').trim().toUpperCase();
        const list = [...(prev.extraLegs ?? [])];
        if (list[0] && (!list[0].origin || list[0].origin.toUpperCase() === prevDest)) {
          list[0] = { ...list[0], origin: dest };
          next.extraLegs = list;
        }
      }
      return next;
    });
  };

  const updateExtra = (index: number, patch: Partial<ExtraSearchLeg>) => {
    setParams((prev) => {
      const list = [...(prev.extraLegs ?? [])];
      const old = list[index] ?? emptyExtra();
      const nextLeg = { ...old, ...patch };
      list[index] = nextLeg;
      if (patch.destination !== undefined && list[index + 1]) {
        const prevDest = (old.destination || '').trim().toUpperCase();
        const chained = (list[index + 1].origin || '').trim().toUpperCase();
        if (!chained || chained === prevDest) {
          list[index + 1] = { ...list[index + 1], origin: String(patch.destination).trim().toUpperCase() };
        }
      }
      return { ...prev, extraLegs: list };
    });
  };

  const addExtraDestination = () => {
    if (extras.length >= MAX_EXTRA_DESTINATIONS) {
      setError(t('dd_max_extras'));
      return;
    }
    const prevTo = extras.length > 0
      ? extras[extras.length - 1].destination
      : params.destination;
    setError(null);
    setParams((prev) => ({
      ...prev,
      extraLegs: [...(prev.extraLegs ?? []), emptyExtra((prevTo || '').trim().toUpperCase())],
    }));
  };

  const removeExtraDestination = (index: number) => {
    setParams((prev) => ({
      ...prev,
      extraLegs: (prev.extraLegs ?? []).filter((_, i) => i !== index),
    }));
    if (extraDateIndex === index) setExtraDateIndex(null);
    else if (extraDateIndex != null && extraDateIndex > index) setExtraDateIndex(extraDateIndex - 1);
  };

  const dateLabel =
    params.departureDate && params.returnDate
      ? isRTL
        ? `${params.returnDate} ← ${params.departureDate}`
        : `${params.departureDate} → ${params.returnDate}`
      : t('select_dates');

  const onSearch = async () => {
    const origin = params.origin.trim().toUpperCase();
    const destination = params.destination.trim().toUpperCase();
    const returnOrigin = (params.returnOrigin || '').trim().toUpperCase();
    const returnDestination = (params.returnDestination || origin).trim().toUpperCase();

    if (!origin || !destination || !params.departureDate) {
      setError(t('please_fill_origin_destination'));
      return;
    }
    if (!params.returnDate) {
      setError(t('choose_return_date'));
      return;
    }
    if (!returnOrigin) {
      setError(t('dd_need_return_origin'));
      return;
    }
    if (origin === destination) {
      setError(t('dd_outbound_same'));
      return;
    }

    const extraLegs: ExtraSearchLeg[] = [];
    for (const raw of extras) {
      const eo = (raw.origin || '').trim().toUpperCase();
      const ed = (raw.destination || '').trim().toUpperCase();
      const date = (raw.date || '').trim();
      if (!eo && !ed && !date) continue;
      if (!eo || !ed || !date) {
        setError(t('dd_need_extra_fields'));
        return;
      }
      if (eo === ed) {
        setError(t('dd_extra_same'));
        return;
      }
      if (date < params.departureDate || date > params.returnDate) {
        setError(t('dd_extra_date_order'));
        return;
      }
      extraLegs.push({ origin: eo, destination: ed, date });
    }

    if (extraLegs.length === 0 && returnOrigin === destination) {
      setError(t('dd_return_must_differ'));
      return;
    }

    const payload: CreateSearchSessionRequest = {
      ...params,
      origin,
      destination,
      returnOrigin,
      returnDestination,
      extraLegs,
      returnDate: params.returnDate,
      currency,
      locale,
      cabinPreference: (params.cabinClass as CreateSearchSessionRequest['cabinPreference']) || 'ECONOMY',
    };

    setError(null);
    setLoading(true);
    searchActions.setLoading(true);
    searchActions.setError(null);
    try {
      const generation = searchActions.beginSearch(payload);
      const session = await createSearchSession(payload);
      if (!isCurrentSearchGeneration(generation)) return;
      const res = await getSearchSessionResults(session.id, undefined, payload);
      if (!isCurrentSearchGeneration(generation)) return;
      const applied = searchActions.applySessionResults({
        generation,
        sessionId: session.id,
        session: res.session ?? session,
        status: res.session?.status ?? session.status,
        results: res.results ?? [],
        version: res.version ?? 1,
        mode: 'replace',
      });
      if (!applied) return;
      navigation.navigate('Results', { sessionId: session.id });
    } catch (e) {
      const msg = e instanceof Error ? e.message : t('search_failed');
      setError(msg);
      searchActions.setError(msg);
    } finally {
      setLoading(false);
      searchActions.setLoading(false);
    }
  };

  return (
    <View style={[styles.page, { backgroundColor: theme.screenBg }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
          <View style={[styles.titleRow, isRTL && { flexDirection: 'row-reverse' }]}>
            <AppIcon name="airplane-outline" size={22} color={theme.primary} fallbackText="" />
            <Text style={[styles.title, { color: theme.text }, isRTL && { textAlign: 'right' }]}>
              {t('dd_title')}
            </Text>
          </View>
          <Text style={[styles.subtitle, { color: theme.textMuted }, isRTL && { textAlign: 'right' }]}>
            {t('dd_subtitle')}
          </Text>

          <Text style={[styles.sectionLabel, { color: theme.primary }, isRTL && { textAlign: 'right' }]}>
            {t('dd_outbound_section')}
          </Text>
          <AirportAutocomplete
            label={t('from')}
            value={params.origin}
            onChange={(c) => update('origin', c)}
            placeholder={t('city_or_airport')}
          />
          <AirportAutocomplete
            label={t('to')}
            value={params.destination}
            onChange={(c) => update('destination', c)}
            placeholder={t('city_or_airport')}
          />

          {extras.map((leg, index) => (
            <View key={`extra-${index}`} style={styles.extraBlock}>
              <View style={[styles.extraHeader, isRTL && { flexDirection: 'row-reverse' }]}>
                <Text style={[styles.sectionLabel, { color: theme.primary, marginBottom: 0 }, isRTL && { textAlign: 'right' }]}>
                  {t('dd_extra_section')} {index + 2}
                </Text>
                <TouchableOpacity
                  onPress={() => removeExtraDestination(index)}
                  hitSlop={8}
                  accessibilityLabel={t('dd_remove')}
                  style={styles.extraRemove}
                >
                  <AppIcon name="close" size={18} color={theme.textMuted} fallbackText={t('dd_remove')} />
                </TouchableOpacity>
              </View>
              <AirportAutocomplete
                label={t('from')}
                value={leg.origin}
                onChange={(c) => updateExtra(index, { origin: c })}
                placeholder={t('city_or_airport')}
              />
              <AirportAutocomplete
                label={t('to')}
                value={leg.destination}
                onChange={(c) => updateExtra(index, { destination: c })}
                placeholder={t('city_or_airport')}
              />
              <Text style={[styles.label, { color: theme.text }, isRTL && { textAlign: 'right' }]}>{t('dd_extra_date')}</Text>
              <TouchableOpacity
                style={[styles.dateBtn, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]}
                onPress={() => setExtraDateIndex(index)}
                activeOpacity={0.7}
              >
                <Text style={[{ color: theme.text, fontSize: 15 }, isRTL && { textAlign: 'right' }]}>
                  {leg.date || t('select_dates')}
                </Text>
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity
            style={[
              styles.addBtn,
              { borderColor: theme.primary },
              extras.length >= MAX_EXTRA_DESTINATIONS && { opacity: 0.45 },
              isRTL && { flexDirection: 'row-reverse' },
            ]}
            onPress={addExtraDestination}
            disabled={extras.length >= MAX_EXTRA_DESTINATIONS}
            activeOpacity={0.75}
          >
            <AppIcon name="add-outline" size={18} color={theme.primary} fallbackText="+" />
            <Text style={[styles.addBtnText, { color: theme.primary }]}>{t('dd_add_destination')}</Text>
          </TouchableOpacity>

          <Text style={[styles.sectionLabel, { color: theme.primary, marginTop: 8 }, isRTL && { textAlign: 'right' }]}>
            {t('dd_return_section')}
          </Text>
          <AirportAutocomplete
            label={t('dd_return_from')}
            value={params.returnOrigin || ''}
            onChange={(c) => update('returnOrigin', c)}
            placeholder={t('city_or_airport')}
          />
          <AirportAutocomplete
            label={t('dd_return_to')}
            value={params.returnDestination || params.origin}
            onChange={(c) => update('returnDestination', c)}
            placeholder={t('city_or_airport')}
          />

          <Text style={[styles.label, { color: theme.text }, isRTL && { textAlign: 'right' }]}>{t('dates')}</Text>
          <TouchableOpacity
            style={[styles.dateBtn, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]}
            onPress={() => setShowCalendar(true)}
            activeOpacity={0.7}
          >
            <Text style={[{ color: theme.text, fontSize: 15 }, isRTL && { textAlign: 'right' }]}>{dateLabel}</Text>
          </TouchableOpacity>

          <DateRangePicker
            visible={showCalendar}
            onClose={() => setShowCalendar(false)}
            mode="range"
            initialDate={params.departureDate || undefined}
            initialEndDate={params.returnDate || undefined}
            onSelect={(date) => {
              update('departureDate', date);
              update('returnDate', undefined as unknown as string);
            }}
            onSelectRange={(start, end) => {
              update('departureDate', start);
              update('returnDate', end);
            }}
          />

          <DateRangePicker
            visible={extraDateIndex != null}
            onClose={() => setExtraDateIndex(null)}
            mode="single"
            initialDate={(extraDateIndex != null ? extras[extraDateIndex]?.date : '') || params.departureDate || undefined}
            onSelect={(date) => {
              if (extraDateIndex != null) {
                updateExtra(extraDateIndex, { date });
              }
              setExtraDateIndex(null);
            }}
          />

          <PassengerCabinPicker
            adults={params.adults}
            children={params.children ?? 0}
            cabinClass={
              params.cabinClass === 'ECONOMY' ||
              params.cabinClass === 'PREMIUM_ECONOMY' ||
              params.cabinClass === 'BUSINESS' ||
              params.cabinClass === 'FIRST'
                ? params.cabinClass
                : 'ECONOMY'
            }
            onAdultsChange={(n) => update('adults', n)}
            onChildrenChange={(n) => update('children', n)}
            onCabinChange={(c) => {
              update('cabinClass', c);
              update('cabinPreference', c as CreateSearchSessionRequest['cabinPreference']);
            }}
            label={t('passengers_cabin')}
          />

          {error ? <Text style={[styles.error, { color: theme.error }]}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.searchBtn, { backgroundColor: theme.buttonBg }, loading && { opacity: 0.65 }]}
            onPress={onSearch}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color={theme.buttonText} />
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <AppIcon name="search" size={16} color={theme.buttonText} fallbackText="" />
                <Text style={[styles.searchBtnText, { color: theme.buttonText }]}>{t('search_flights')}</Text>
              </View>
            )}
          </TouchableOpacity>

          <Text style={[styles.hint, { color: theme.textMuted }, isRTL && { textAlign: 'right' }]}>
            {t('dd_example_hint')}
          </Text>
        </View>
      </ScrollView>

      <SearchLoadingOverlay
        visible={loading}
        origin={params.origin}
        destination={params.destination}
        extraLegs={params.extraLegs ?? []}
        returnOrigin={params.returnOrigin}
        returnDestination={params.returnDestination || params.origin}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 40, maxWidth: 720, width: '100%', alignSelf: 'center' },
  card: { borderRadius: 16, padding: 20, borderWidth: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  title: { fontSize: 24, fontWeight: '700', flex: 1 },
  subtitle: { fontSize: 14, lineHeight: 20, marginBottom: 18 },
  sectionLabel: { fontSize: 13, fontWeight: '700', letterSpacing: 0.4, marginBottom: 8, textTransform: 'uppercase' },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6, marginTop: 4 },
  dateBtn: { borderRadius: 10, paddingVertical: 12, paddingHorizontal: 14, borderWidth: 1, marginBottom: 8 },
  extraBlock: { marginTop: 4, marginBottom: 4 },
  extraHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 8,
  },
  extraRemove: { padding: 4 },
  addBtn: {
    marginTop: 8,
    marginBottom: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addBtnText: { fontSize: 15, fontWeight: '600' },
  error: { marginTop: 10, fontSize: 14 },
  searchBtn: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  searchBtnText: { fontSize: 16, fontWeight: '600' },
  hint: { marginTop: 14, fontSize: 13, lineHeight: 18 },
});
