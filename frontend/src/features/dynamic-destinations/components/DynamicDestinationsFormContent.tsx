import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { useLocale } from '../../../context/LocaleContext';
import { AppIcon } from '../../../components/AppIcon';
import { FormHeroHeader } from '../../../components/search/FormHeroHeader';
import { SearchSubmitButton } from '../../../components/search/SearchSubmitButton';
import { formCardStyles } from '../../../components/search/formStyles';
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
  /** Flat layout for use inside EditSearchModal (no nested card chrome). */
  embedded?: boolean;
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
  embedded = false,
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
    <View
      style={
        embedded
          ? undefined
          : [
              formCardStyles.card,
              compact && formCardStyles.cardCompact,
              { backgroundColor: theme.cardBg, borderColor: theme.cardBorder },
            ]
      }
    >
      <FormHeroHeader
        icon="airplane-outline"
        title={t('dd_title')}
        subtitle={compact ? undefined : t('dd_subtitle')}
        compact={compact}
        compactLabel={t('dd_title')}
        iconColor={theme.primary}
      />

      <Text style={[formCardStyles.sectionLabel, { color: theme.primary }, isRTL && { textAlign: 'right' }]}>
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
            <Text style={[formCardStyles.sectionLabel, { color: theme.primary, marginBottom: 0 }, isRTL && { textAlign: 'right' }]}>
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
          <Text style={[formCardStyles.label, { color: theme.text }, isRTL && { textAlign: 'right' }]}>{t('dd_extra_date')}</Text>
          <TouchableOpacity
            style={[formCardStyles.dateBtn, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]}
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

      <Text style={[formCardStyles.sectionLabel, { color: theme.primary, marginTop: 8 }, isRTL && { textAlign: 'right' }]}>
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

      <Text style={[formCardStyles.label, { color: theme.text }, isRTL && { textAlign: 'right' }]}>{t('dates')}</Text>
      <TouchableOpacity
        style={[formCardStyles.dateBtn, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]}
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

      {error ? <Text style={[formCardStyles.error, { color: theme.error }]}>{error}</Text> : null}

      <SearchSubmitButton
        label={t('search_flights')}
        loading={loading}
        onPress={onSearch}
        compact={compact}
      />

      {!compact ? (
        <Text style={[formCardStyles.hint, { color: theme.textMuted }, isRTL && { textAlign: 'right' }]}>
          {t('dd_example_hint')}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
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
});
