import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { useLocale } from '../../../context/LocaleContext';
import { AppIcon } from '../../../components/AppIcon';
import { AirportAutocomplete } from '../../flight-search/components/AirportAutocomplete';
import { DateRangePicker } from '../../flight-search/components/DateRangePicker';
import { PassengerCabinPicker } from '../../flight-search/components/PassengerCabinPicker';
import { MAX_EXTRA_DESTINATIONS } from '../../../utils/dynamicDestinations';
import type { CreateSearchSessionRequest, ExtraSearchLeg } from '../../../types';

export interface DynamicDestinationsFormContentProps {
  params: CreateSearchSessionRequest;
  update: <K extends keyof CreateSearchSessionRequest>(
    key: K,
    value: CreateSearchSessionRequest[K],
  ) => void;
  updateExtra: (index: number, patch: Partial<ExtraSearchLeg>) => void;
  addExtraDestination: () => void;
  removeExtraDestination: (index: number) => void;
  onSearch: () => void;
  loading: boolean;
  error: string | null;
  compact?: boolean;
}

export function DynamicDestinationsFormContent({
  params,
  update,
  updateExtra,
  addExtraDestination,
  removeExtraDestination,
  onSearch,
  loading,
  error,
  compact = false,
}: DynamicDestinationsFormContentProps) {
  const { theme } = useTheme();
  const { t, isRTL } = useLocale();
  const [showCalendar, setShowCalendar] = useState(false);
  const [extraDateIndex, setExtraDateIndex] = useState<number | null>(null);
  const extras = params.extraLegs ?? [];

  const dateLabel =
    params.departureDate && params.returnDate
      ? isRTL
        ? `${params.returnDate} ← ${params.departureDate}`
        : `${params.departureDate} → ${params.returnDate}`
      : t('select_dates');

  return (
    <View style={[styles.card, compact && styles.cardCompact, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
      {!compact ? (
        <>
          <View style={[styles.titleRow, isRTL && { flexDirection: 'row-reverse' }]}>
            <AppIcon name="airplane-outline" size={22} color={theme.primary} fallbackText="" />
            <Text style={[styles.title, { color: theme.text }, isRTL && { textAlign: 'right' }]}>
              {t('dd_title')}
            </Text>
          </View>
          <Text style={[styles.subtitle, { color: theme.textMuted }, isRTL && { textAlign: 'right' }]}>
            {t('dd_subtitle')}
          </Text>
        </>
      ) : (
        <Text style={[styles.compactLabel, { color: theme.textMuted }, isRTL && { textAlign: 'right' }]}>
          {t('dd_title')}
        </Text>
      )}

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
        onDone={onSearch}
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

      {!compact ? (
        <Text style={[styles.hint, { color: theme.textMuted }, isRTL && { textAlign: 'right' }]}>
          {t('dd_example_hint')}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, padding: 20, borderWidth: 1 },
  cardCompact: { borderRadius: 12, padding: 14 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  title: { fontSize: 24, fontWeight: '700', flex: 1 },
  subtitle: { fontSize: 14, lineHeight: 20, marginBottom: 18 },
  compactLabel: { fontSize: 13, fontWeight: '600', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.3 },
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
