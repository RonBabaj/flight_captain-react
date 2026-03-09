import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme/ThemeContext';
import { useLocale } from '../../../context/LocaleContext';
import type { CreateSearchSessionRequest } from '../../../types';
import { AirportAutocomplete } from './AirportAutocomplete';
import { DateRangePicker } from './DateRangePicker';
import { PassengerCabinPicker } from './PassengerCabinPicker';

export interface SearchFormContentProps {
  params: CreateSearchSessionRequest;
  update: <K extends keyof CreateSearchSessionRequest>(key: K, value: CreateSearchSessionRequest[K]) => void;
  tripType: 'one-way' | 'round-trip';
  setTripType: (t: 'one-way' | 'round-trip') => void;
  onSearch: () => void;
  loading: boolean;
  error: string | null;
  compact?: boolean;
}

export function SearchFormContent({
  params, update, tripType, setTripType, onSearch, loading, error, compact = false,
}: SearchFormContentProps) {
  const { theme } = useTheme();
  const { t } = useLocale();
  const [showCalendar, setShowCalendar] = useState(false);
  const ts = makeThemedStyles(theme);

  const dateLabel =
    tripType === 'round-trip'
      ? params.departureDate && params.returnDate
        ? `${params.departureDate} → ${params.returnDate}`
        : t('select_dates')
      : params.departureDate || t('select_date');

  const routeSummary =
    params.origin && params.destination ? `${params.origin} → ${params.destination}` : null;

  return (
    <View style={[s.hero, compact && s.heroCompact, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
      {compact ? (
        routeSummary && <Text style={[ts.heroSubtitle, { marginBottom: 10 }]} numberOfLines={1}>{routeSummary}</Text>
      ) : (
        <>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="airplane-outline" size={20} color={theme.text} />
            <Text style={ts.heroTitle}>{t('find_flights')}</Text>
          </View>
          <Text style={ts.heroSubtitle}>{t('compare_prices')}</Text>
        </>
      )}

      {/* Trip type pills */}
      <View style={[s.tripRow, compact && s.tripRowCompact]}>
        {(['one-way', 'round-trip'] as const).map((tt) => {
          const active = tripType === tt;
          return (
            <TouchableOpacity
              key={tt}
              style={[s.tab, { backgroundColor: theme.controlBg, borderColor: theme.cardBorder }, active && { backgroundColor: theme.primary, borderColor: theme.primary }]}
              onPress={() => setTripType(tt)}
              activeOpacity={0.7}
            >
              <Text style={active ? ts.tabTextActive : ts.tabText}>{t(tt === 'one-way' ? 'one_way' : 'round_trip')}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <AirportAutocomplete label={t('from')} value={params.origin} onChange={(c) => update('origin', c)} placeholder={t('city_or_airport')} />
      <AirportAutocomplete label={t('to')} value={params.destination} onChange={(c) => update('destination', c)} placeholder={t('city_or_airport')} />

      <Text style={[ts.label, compact && { marginBottom: 3, fontSize: 13 }]}>{t('dates')}</Text>
      <TouchableOpacity
        style={[s.dateBtn, compact && s.dateBtnCompact, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]}
        onPress={() => setShowCalendar(true)}
        activeOpacity={0.7}
      >
        <Text style={[ts.dateText, compact && { fontSize: 14 }]}>{dateLabel}</Text>
      </TouchableOpacity>

      <DateRangePicker
        visible={showCalendar}
        onClose={() => setShowCalendar(false)}
        mode={tripType === 'round-trip' ? 'range' : 'single'}
        initialDate={params.departureDate || undefined}
        initialEndDate={params.returnDate || undefined}
        onSelect={(date) => { update('departureDate', date); update('returnDate', undefined as any); }}
        onSelectRange={(start, end) => { update('departureDate', start); update('returnDate', end as any); }}
      />

      <PassengerCabinPicker
        adults={params.adults}
        children={params.children ?? 0}
        cabinClass={
          params.cabinClass === 'ECONOMY' || params.cabinClass === 'PREMIUM_ECONOMY' ||
          params.cabinClass === 'BUSINESS' || params.cabinClass === 'FIRST'
            ? params.cabinClass
            : 'ECONOMY'
        }
        onAdultsChange={(n) => update('adults', n)}
        onChildrenChange={(n) => update('children', n)}
        onCabinChange={(c) => { update('cabinClass', c); update('cabinPreference', c as any); }}
        label={t('passengers_cabin')}
      />

      <Text style={[ts.label, compact && { fontSize: 13 }]}>{t('checked_bag')}</Text>
      <View style={s.bagRow}>
        {([false, true] as const).map((val) => {
          const active = params.includeCheckedBag === val;
          return (
            <TouchableOpacity
              key={String(val)}
              style={[s.bagBtn, { backgroundColor: theme.controlBg, borderColor: theme.cardBorder }, active && { backgroundColor: theme.primary, borderColor: theme.primary }]}
              onPress={() => update('includeCheckedBag', val as any)}
              activeOpacity={0.7}
            >
              <Text style={active ? ts.bagTextActive : ts.bagText}>{t(val ? 'included' : 'not_included')}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {error ? <Text style={ts.error}>{error}</Text> : null}

      <TouchableOpacity
        style={[ts.button, compact && ts.buttonCompact, loading && s.btnDisabled]}
        onPress={onSearch}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <Text style={[ts.buttonText, compact && { fontSize: 15 }]}>{t('searching')}</Text>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Ionicons name="search" size={16} color={theme.buttonText} />
            <Text style={[ts.buttonText, compact && { fontSize: 15 }]}>{t('search_flights')}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

function makeThemedStyles(theme: import('../../../theme/ThemeContext').Theme) {
  return {
    heroTitle: { fontSize: 24, fontWeight: '700' as const, color: theme.text, marginBottom: 4 },
    heroSubtitle: { fontSize: 14, color: theme.textMuted, marginBottom: 20 },
    label: { fontSize: 14, fontWeight: '600' as const, marginBottom: 6, color: theme.text },
    tabText: { color: theme.text, fontSize: 14 },
    tabTextActive: { color: '#fff', fontWeight: '600' as const, fontSize: 14 },
    dateText: { fontSize: 15, color: theme.text },
    bagText: { color: theme.text, fontSize: 13 },
    bagTextActive: { color: '#fff', fontSize: 13 },
    error: { color: theme.error, marginTop: 10, fontSize: 14 },
    button: {
      marginTop: 20,
      backgroundColor: theme.buttonBg,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center' as const,
    },
    buttonCompact: { marginTop: 12, paddingVertical: 10 },
    buttonText: { color: theme.buttonText, fontSize: 16, fontWeight: '600' as const },
  };
}

const s = StyleSheet.create({
  hero: { borderRadius: 16, padding: 20, borderWidth: 1 },
  heroCompact: { borderRadius: 12, padding: 14, borderWidth: 1 },
  tripRow: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  tripRowCompact: { marginBottom: 4 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1, alignItems: 'center' },
  dateBtn: { marginBottom: 4, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 14, borderWidth: 1 },
  dateBtnCompact: { paddingVertical: 8 },
  bagRow: { flexDirection: 'row', gap: 8, marginTop: 2 },
  bagBtn: { flex: 1, paddingVertical: 9, borderRadius: 10, borderWidth: 1, alignItems: 'center' },
  btnDisabled: { opacity: 0.6 },
});
