import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { useLocale } from '../../../context/LocaleContext';
import type { CreateSearchSessionRequest } from '../../../types';
import { SearchFormHeadline } from '../../../components/search/SearchFormHeadline';
import { SearchFormTicketShell } from '../../../components/search/SearchFormTicketShell';
import { SearchSubmitButton } from '../../../components/search/SearchSubmitButton';
import { formCardStyles, makeFormThemedStyles } from '../../../components/search/formStyles';
import { DestinationMoodBanner } from '../../../components/DestinationMoodBanner';
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
  embedded?: boolean;
  onPassengerCabinDone?: () => void;
}

const MOOD_FORM_HEIGHT = 132;

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

  const showMood = !!params.destination && (!compact || embedded);
  const useTicket = !embedded && !compact;

  const tripTypeControl = (
    <View
      style={[
        s.tripTrack,
        { backgroundColor: theme.controlBg, borderColor: theme.cardBorder },
        isRTL && { flexDirection: 'row-reverse' },
      ]}
      accessibilityRole="tablist"
    >
      {(['one-way', 'round-trip'] as const).map((tt, index) => {
        const active = tripType === tt;
        const isFirst = index === 0;
        const isLast = index === 1;
        // Solid brand violet fill — pale primary washes washed out on dark controlBg.
        const activeBg = theme.isDark ? '#6366F1' : theme.primary;
        return (
          <TouchableOpacity
            key={tt}
            style={[
              s.tripSeg,
              active && { backgroundColor: activeBg },
              isFirst && (isRTL ? s.tripSegEndRtl : s.tripSegStart),
              isLast && (isRTL ? s.tripSegStart : s.tripSegEnd),
            ]}
            onPress={() => setTripType(tt)}
            activeOpacity={0.75}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
          >
            <Text
              style={[
                s.tripSegLabel,
                { fontFamily: theme.fontBody },
                active
                  ? { color: '#FFFFFF', fontWeight: '700' }
                  : { color: theme.textMuted, fontWeight: '600' },
              ]}
            >
              {t(tt === 'one-way' ? 'one_way' : 'round_trip')}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const fields = (
    <>
      {compact && routeSummary ? (
        <Text style={[ts.heroSubtitle, { marginBottom: 10 }]} numberOfLines={1}>
          {routeSummary}
        </Text>
      ) : null}

      {!compact && !embedded ? (
        <SearchFormHeadline origin={params.origin} destination={params.destination} tripType={tripType} />
      ) : null}

      {tripTypeControl}

      <View style={[s.routeBlock, { borderColor: theme.cardBorder, backgroundColor: theme.screenBg }]}>
        <AirportAutocomplete
          label={t('from')}
          value={params.origin}
          onChange={(c) => update('origin', c)}
          placeholder={t('city_country_or_airport')}
          countryMode="resolve-primary"
          fieldVariant="route"
        />
        <View style={[s.routeRule, { backgroundColor: theme.cardBorder }]} />
        <AirportAutocomplete
          label={t('to')}
          value={params.destination}
          onChange={(c) => update('destination', c)}
          placeholder={t('city_country_or_airport')}
          showAnywhere
          countryMode="country-code"
          fieldVariant="route"
        />
      </View>

      <View style={[s.detailsBlock, { backgroundColor: theme.controlBg, borderColor: theme.cardBorder }]}>
        <Text style={[s.fieldLabel, { color: theme.textMuted, fontFamily: theme.fontBody }]}>{t('dates')}</Text>
        <TouchableOpacity
          style={[s.dateTap, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}
          onPress={() => setShowCalendar(true)}
          activeOpacity={0.75}
        >
          <Text style={[ts.dateText, { fontFamily: theme.fontBody }, isRTL && { textAlign: 'right' }]}>{dateLabel}</Text>
        </TouchableOpacity>

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
            update('cabinPreference', c as CreateSearchSessionRequest['cabinPreference']);
          }}
          label={t('passengers_cabin')}
          onDone={onPassengerCabinDone}
        />
      </View>

      <DateRangePicker
        visible={showCalendar}
        onClose={() => setShowCalendar(false)}
        mode={tripType === 'round-trip' ? 'range' : 'single'}
        initialDate={params.departureDate || undefined}
        initialEndDate={params.returnDate || undefined}
        onSelect={(date) => {
          update('departureDate', date);
          update('returnDate', undefined as CreateSearchSessionRequest['returnDate']);
        }}
        onSelectRange={(start, end) => {
          update('departureDate', start);
          update('returnDate', end as CreateSearchSessionRequest['returnDate']);
        }}
      />

      {error ? (
        <Text
          style={[
            ts.error,
            {
              paddingVertical: 10,
              paddingHorizontal: 12,
              borderRadius: theme.radiusMd,
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: theme.error,
              backgroundColor: theme.errorBg,
              fontFamily: theme.fontBody,
            },
          ]}
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
        >
          {error}
        </Text>
      ) : null}

      <SearchSubmitButton label={t('search_flights')} loading={loading} onPress={onSearch} compact={compact} />
    </>
  );

  if (embedded) {
    return <View style={s.embeddedPad}>{fields}</View>;
  }

  if (!useTicket) {
    return (
      <View
        style={[
          formCardStyles.card,
          formCardStyles.cardCompact,
          { backgroundColor: theme.cardBg, borderColor: theme.cardBorder, borderRadius: theme.radiusLg },
        ]}
      >
        {fields}
      </View>
    );
  }

  return (
    <SearchFormTicketShell accentHeight={showMood ? MOOD_FORM_HEIGHT + 40 : undefined}>
      {showMood ? (
        <DestinationMoodBanner destinationCode={params.destination} variant="form" flushTop />
      ) : null}
      <View style={s.ticketPad}>{fields}</View>
    </SearchFormTicketShell>
  );
}

const s = StyleSheet.create({
  embeddedPad: { paddingVertical: 4 },
  ticketPad: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 22 },
  tripTrack: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 3,
    gap: 2,
    marginBottom: 16,
  },
  tripSeg: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 9,
  },
  tripSegStart: { borderTopLeftRadius: 9, borderBottomLeftRadius: 9 },
  tripSegEnd: { borderTopRightRadius: 9, borderBottomRightRadius: 9 },
  tripSegEndRtl: { borderTopRightRadius: 9, borderBottomRightRadius: 9 },
  routeBlock: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingTop: 6,
    paddingBottom: 4,
    marginBottom: 14,
  },
  routeRule: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 8,
    marginHorizontal: 2,
  },
  detailsBlock: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    gap: 4,
  },
  fieldLabel: { fontSize: 13, fontWeight: '600', marginBottom: 6 },
  dateTap: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 4,
  },
});