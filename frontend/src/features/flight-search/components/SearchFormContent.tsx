import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { useLocale } from '../../../context/LocaleContext';
import type { CreateSearchSessionRequest } from '../../../types';
import { FormHeroHeader } from '../../../components/search/FormHeroHeader';
import { SearchSubmitButton } from '../../../components/search/SearchSubmitButton';
import { formCardStyles, makeFormThemedStyles } from '../../../components/search/formStyles';
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
  /** Flat layout for use inside EditSearchModal (no nested card chrome). */
  embedded?: boolean;
  /** When set, tapping Done in Passenger & cabin triggers this (e.g. re-search on results page) */
  onPassengerCabinDone?: () => void;
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
  embedded = false,
  onPassengerCabinDone,
}: SearchFormContentProps) {
  const { theme } = useTheme();
  const { t, isRTL } = useLocale();
  const [showCalendar, setShowCalendar] = useState(false);
  const ts = makeFormThemedStyles(theme);

  const dateLabel =
    tripType === 'round-trip'
      ? params.departureDate && params.returnDate
        ? isRTL
          ? `${params.returnDate} ← ${params.departureDate}`
          : `${params.departureDate} → ${params.returnDate}`
        : t('select_dates')
      : params.departureDate || t('select_date');

  const routeSummary =
    params.origin && params.destination ? `${params.origin} → ${params.destination}` : null;

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
      {compact ? (
        routeSummary && (
          <Text style={[ts.heroSubtitle, { marginBottom: 10 }]} numberOfLines={1}>
            {routeSummary}
          </Text>
        )
      ) : (
        <FormHeroHeader
          icon="airplane-outline"
          title={t('find_flights')}
          subtitle={t('compare_prices')}
        />
      )}

      <View style={[formCardStyles.tripRow, compact && formCardStyles.tripRowCompact]}>
        {(['one-way', 'round-trip'] as const).map((tt) => {
          const active = tripType === tt;
          return (
            <TouchableOpacity
              key={tt}
              style={[formCardStyles.tab, { backgroundColor: theme.controlBg, borderColor: theme.cardBorder }, active && { backgroundColor: theme.primary, borderColor: theme.primary }]}
              onPress={() => setTripType(tt)}
              activeOpacity={0.7}
            >
              <Text style={active ? ts.tabTextActive : ts.tabText}>{t(tt === 'one-way' ? 'one_way' : 'round_trip')}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <AirportAutocomplete label={t('from')} value={params.origin} onChange={(c) => update('origin', c)} placeholder={t('city_country_or_airport')} countryMode="resolve-primary" />
      <AirportAutocomplete label={t('to')} value={params.destination} onChange={(c) => update('destination', c)} placeholder={t('city_country_or_airport')} showAnywhere countryMode="country-code" />

      <Text style={[ts.label, compact && { marginBottom: 3, fontSize: 13 }]}>{t('dates')}</Text>
      <TouchableOpacity
        style={[formCardStyles.dateBtn, compact && formCardStyles.dateBtnCompact, { backgroundColor: theme.inputBg, borderColor: theme.cardBorder }]}
        onPress={() => setShowCalendar(true)}
        activeOpacity={0.7}
      >
        <Text style={[ts.dateText, compact && { fontSize: 14 }, isRTL && { textAlign: 'right' }]}>{dateLabel}</Text>
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
        onDone={onPassengerCabinDone}
      />

      {error ? <Text style={ts.error}>{error}</Text> : null}

      <SearchSubmitButton
        label={t('search_flights')}
        loading={loading}
        onPress={onSearch}
        compact={compact}
      />
    </View>
  );
}
