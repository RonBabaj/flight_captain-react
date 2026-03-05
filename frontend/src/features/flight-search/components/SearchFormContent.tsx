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
  /** Compact mode for sidebar (e.g. on Results page) */
  compact?: boolean;
}

export function SearchFormContent({
  params,
  update,
  tripType,
  setTripType,
  onSearch,
  loading,
  error,
  compact = false,
}: SearchFormContentProps) {
  const { theme } = useTheme();
  const { t, isRTL } = useLocale();
  const [showCalendar, setShowCalendar] = useState(false);
  const themed = makeThemedStyles(theme);

  const dateLabel =
    tripType === 'round-trip'
      ? params.departureDate && params.returnDate
        ? `${params.departureDate} → ${params.returnDate}`
        : t('select_dates')
      : params.departureDate || t('select_date');

  const routeSummary =
    params.origin && params.destination
      ? `${params.origin} → ${params.destination}`
      : null;

  return (
    <View style={[styles.hero, compact && styles.heroCompact, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
      {compact ? (
        routeSummary && (
          <Text style={[themed.heroSubtitle, { marginBottom: 12 }]} numberOfLines={1}>
            {routeSummary}
          </Text>
        )
      ) : (
        <>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Ionicons name="airplane-outline" size={22} color={theme.text} />
          <Text style={themed.heroTitle}>{t('find_flights')}</Text>
        </View>
          <Text style={themed.heroSubtitle}>{t('compare_prices')}</Text>
        </>
      )}
      <View style={[styles.tripRow, compact && styles.tripRowCompact]}>
        <TouchableOpacity
          style={[styles.tab, themed.tabBase, tripType === 'one-way' && themed.tabActive]}
          onPress={() => setTripType('one-way')}
        >
          <Text style={tripType === 'one-way' ? themed.tabTextActive : themed.tabText}>{t('one_way')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, themed.tabBase, tripType === 'round-trip' && themed.tabActive]}
          onPress={() => setTripType('round-trip')}
        >
          <Text style={tripType === 'round-trip' ? themed.tabTextActive : themed.tabText}>{t('round_trip')}</Text>
        </TouchableOpacity>
      </View>

      <AirportAutocomplete label={t('from')} value={params.origin} onChange={(c) => update('origin', c)} placeholder={t('city_or_airport')} />
      <AirportAutocomplete label={t('to')} value={params.destination} onChange={(c) => update('destination', c)} placeholder={t('city_or_airport')} />

      <Text style={[themed.label, compact && { marginBottom: 4, fontSize: 14 }]}>{t('dates')}</Text>
      <TouchableOpacity style={[styles.dateButton, compact && styles.dateButtonCompact, themed.dateButton]} onPress={() => setShowCalendar(true)}>
        <Text style={themed.dateButtonText}>{dateLabel}</Text>
      </TouchableOpacity>

      <DateRangePicker
        visible={showCalendar}
        onClose={() => setShowCalendar(false)}
        mode={tripType === 'round-trip' ? 'range' : 'single'}
        initialDate={params.departureDate || undefined}
        initialEndDate={params.returnDate || undefined}
        onSelect={(date) => {
          update('departureDate', date);
          update('returnDate', undefined as any);
        }}
        onSelectRange={(start, end) => {
          update('departureDate', start);
          update('returnDate', end as any);
        }}
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
        onCabinChange={(c) => {
          update('cabinClass', c);
          update('cabinPreference', c as 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST');
        }}
        label={t('passengers_cabin')}
      />

      <Text style={themed.label}>{t('checked_bag')}</Text>
      <View style={styles.bagRow}>
        <TouchableOpacity
          style={[styles.bagBtn, themed.bagBtn, !params.includeCheckedBag && themed.bagBtnActive]}
          onPress={() => update('includeCheckedBag', false as any)}
        >
          <Text style={!params.includeCheckedBag ? themed.bagTextActive : themed.bagText}>{t('not_included')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.bagBtn, themed.bagBtn, params.includeCheckedBag && themed.bagBtnActive]}
          onPress={() => update('includeCheckedBag', true as any)}
        >
          <Text style={params.includeCheckedBag ? themed.bagTextActive : themed.bagText}>{t('included')}</Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={themed.error}>{error}</Text> : null}

      <TouchableOpacity
        style={[themed.button, compact && themed.buttonCompact, loading && styles.buttonDisabled]}
        onPress={onSearch}
        disabled={loading}
      >
        {loading ? (
          <Text style={[themed.buttonText, compact && { fontSize: 16 }]}>{t('searching')}</Text>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Ionicons name="search" size={18} color={theme.buttonText} />
            <Text style={[themed.buttonText, compact && { fontSize: 16 }]}>{t('search_flights')}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

function makeThemedStyles(theme: import('../../../theme/ThemeContext').Theme) {
  return {
    heroTitle: { fontSize: 26, fontWeight: '700' as const, color: theme.text, marginBottom: 6 },
    heroSubtitle: { fontSize: 15, color: theme.textMuted, marginBottom: 24 },
    label: { fontSize: 16, fontWeight: '600' as const, marginBottom: 8, color: theme.text },
    tabBase: { backgroundColor: theme.controlBg, borderColor: theme.inputBorder, borderRadius: theme.radiusMd },
    tabActive: { backgroundColor: theme.primary, borderColor: theme.primary },
    tabText: { color: theme.text, fontSize: 17 },
    tabTextActive: { color: '#fff', fontWeight: '600' as const, fontSize: 17 },
    dateButton: { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, borderRadius: theme.radiusMd },
    dateButtonText: { fontSize: 17, color: theme.text },
    bagBtn: { backgroundColor: theme.controlBg, borderColor: theme.inputBorder, borderRadius: theme.radiusMd },
    bagBtnActive: { backgroundColor: theme.primary, borderColor: theme.primary },
    bagText: { color: theme.text, fontSize: 15 },
    bagTextActive: { color: '#fff', fontSize: 15 },
    error: { color: theme.error, marginTop: 12, fontSize: 16 },
    button: {
      marginTop: 24,
      backgroundColor: theme.buttonBg,
      paddingVertical: 18,
      borderRadius: theme.radiusLg,
      alignItems: 'center' as const,
    },
    buttonCompact: { marginTop: 16, paddingVertical: 12 },
    buttonText: { color: theme.buttonText, fontSize: 18, fontWeight: '600' as const },
  };
}

const styles = StyleSheet.create({
  hero: { borderRadius: 20, padding: 24, borderWidth: 1 },
  heroCompact: { borderRadius: 12, padding: 16, borderWidth: 1 },
  tripRow: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  tripRowCompact: { marginBottom: 6 },
  tab: { flex: 1, paddingVertical: 14, paddingHorizontal: 20, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
  dateButton: { marginBottom: 4, borderRadius: 12, paddingVertical: 16, paddingHorizontal: 16, borderWidth: 1 },
  dateButtonCompact: { paddingVertical: 10, marginBottom: 2 },
  bagRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  bagBtn: { flex: 1, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
  buttonDisabled: { opacity: 0.6 },
});
