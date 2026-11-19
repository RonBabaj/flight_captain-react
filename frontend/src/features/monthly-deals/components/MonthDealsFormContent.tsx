import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AppIcon } from '../../../components/AppIcon';
import { DestinationMoodBanner } from '../../../components/DestinationMoodBanner';
import { SearchFormHeadline } from '../../../components/search/SearchFormHeadline';
import { SearchFormTicketShell } from '../../../components/search/SearchFormTicketShell';
import { SearchSubmitButton } from '../../../components/search/SearchSubmitButton';
import { useTheme } from '../../../theme/ThemeContext';
import { useLocale } from '../../../context/LocaleContext';
import { formatMonthYear } from '../../../utils/monthNames';
import { ANYWHERE_CODE } from '../../../types';
import { AirportAutocomplete } from '../../flight-search/components/AirportAutocomplete';
import { PassengerCabinPicker } from '../../flight-search/components/PassengerCabinPicker';

export interface MonthDealsFormContentProps {
  origin: string;
  destination: string;
  adults: number;
  children: number;
  durationDays: number;
  year: number;
  month: number;
  onOriginChange: (v: string) => void;
  onDestinationChange: (v: string) => void;
  onAdultsChange: (n: number) => void;
  onChildrenChange: (n: number) => void;
  onDurationChange: (n: number) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  atEarliestDealsMonth: boolean;
  onSearch: () => void;
  loading: boolean;
  error: string | null;
  compact?: boolean;
}

const MOOD_H = 132;

export function MonthDealsFormContent({
  origin,
  destination,
  adults,
  children,
  durationDays,
  year,
  month,
  onOriginChange,
  onDestinationChange,
  onAdultsChange,
  onChildrenChange,
  onDurationChange,
  onPrevMonth,
  onNextMonth,
  atEarliestDealsMonth,
  onSearch,
  loading,
  error,
  compact = false,
}: MonthDealsFormContentProps) {
  const { theme } = useTheme();
  const { t, isRTL, language } = useLocale();

  const routeSummary =
    origin.trim() && destination.trim()
      ? `${origin.trim().toUpperCase()} → ${destination.trim().toUpperCase()}`
      : null;

  const showMood = !!destination.trim() && destination.trim().toUpperCase() !== ANYWHERE_CODE;

  const inner = (
    <View style={compact ? styles.compactPad : styles.ticketPad}>
      {compact && routeSummary ? (
        <Text style={[styles.routeSummary, { color: theme.textMuted, fontFamily: theme.fontBody }]} numberOfLines={1}>
          {routeSummary}
        </Text>
      ) : (
        <>
          <Text style={[styles.dealsTitle, { color: theme.text, fontFamily: theme.fontDisplay }, isRTL && { textAlign: 'right' }]}>
            {t('monthly_deals')}
          </Text>
          <SearchFormHeadline origin={origin} destination={destination} tripType="one-way" />
        </>
      )}

      <View style={[styles.routeBlock, { borderColor: theme.cardBorder, backgroundColor: theme.screenBg }]}>
        <AirportAutocomplete
          label={t('from')}
          value={origin}
          onChange={onOriginChange}
          placeholder={t('city_country_or_airport')}
          countryMode="resolve-primary"
          fieldVariant="route"
        />
        <View style={[styles.routeRule, { backgroundColor: theme.cardBorder }]} />
        <AirportAutocomplete
          label={t('to')}
          value={destination}
          onChange={onDestinationChange}
          placeholder={t('city_country_or_airport')}
          showAnywhere
          countryMode="country-code"
          fieldVariant="route"
        />
      </View>

      <View style={[styles.detailsBlock, { backgroundColor: theme.controlBg, borderColor: theme.cardBorder }]}>
        <PassengerCabinPicker
          adults={adults}
          children={children}
          cabinClass="ECONOMY"
          onAdultsChange={onAdultsChange}
          onChildrenChange={onChildrenChange}
          onCabinChange={() => {}}
          label={t('passengers_cabin')}
          passengersOnly
        />
        <Text style={[styles.fieldLabel, { color: theme.textMuted, fontFamily: theme.fontBody }]}>{t('month')}</Text>
        <View style={[styles.monthNav, isRTL && { flexDirection: 'row-reverse' }]}>
          <TouchableOpacity
            onPress={onPrevMonth}
            disabled={atEarliestDealsMonth}
            style={[styles.stepBtn, { borderColor: theme.cardBorder, opacity: atEarliestDealsMonth ? 0.4 : 1 }]}
          >
            <AppIcon name="chevron-back" size={18} color={theme.text} fallbackText="" />
          </TouchableOpacity>
          <Text style={[styles.monthLabel, { color: theme.text, fontFamily: theme.fontDisplay }]}>
            {formatMonthYear(year, month, language)}
          </Text>
          <TouchableOpacity onPress={onNextMonth} style={[styles.stepBtn, { borderColor: theme.cardBorder }]}>
            <AppIcon name="chevron-forward" size={18} color={theme.text} fallbackText="" />
          </TouchableOpacity>
        </View>

        <Text style={[styles.fieldLabel, { color: theme.textMuted, fontFamily: theme.fontBody, marginTop: 12 }]}>
          {t('trip_duration_days')}
        </Text>
        <View style={[styles.stepperRow, isRTL && { flexDirection: 'row-reverse' }]}>
          <TouchableOpacity
            onPress={() => onDurationChange(Math.max(1, durationDays - 1))}
            style={[styles.stepBtn, { borderColor: theme.cardBorder }]}
          >
            <Text style={{ color: theme.text, fontSize: 18 }}>−</Text>
          </TouchableOpacity>
          <Text style={[styles.stepValue, { color: theme.text, fontFamily: theme.fontDisplay }]}>
            {durationDays} {t('days')}
          </Text>
          <TouchableOpacity
            onPress={() => onDurationChange(Math.min(21, durationDays + 1))}
            style={[styles.stepBtn, { borderColor: theme.cardBorder }]}
          >
            <Text style={{ color: theme.text, fontSize: 18 }}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {error ? (
        <Text style={[styles.error, { color: theme.error, fontFamily: theme.fontBody }]} accessibilityRole="alert">
          {error}
        </Text>
      ) : null}

      <SearchSubmitButton
        label={t('search_deals')}
        icon="calendar-outline"
        loading={loading}
        onPress={onSearch}
        compact={compact}
      />
    </View>
  );

  if (compact) {
    return (
      <View
        style={[
          styles.compactCard,
          { backgroundColor: theme.cardBg, borderColor: theme.cardBorder, borderRadius: theme.radiusLg },
        ]}
      >
        {inner}
      </View>
    );
  }

  return (
    <SearchFormTicketShell accentHeight={showMood ? MOOD_H + 40 : undefined}>
      {showMood ? <DestinationMoodBanner destinationCode={destination} variant="form" flushTop /> : null}
      {inner}
    </SearchFormTicketShell>
  );
}

const styles = StyleSheet.create({
  ticketPad: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 22 },
  compactPad: { padding: 14 },
  compactCard: { borderWidth: StyleSheet.hairlineWidth },
  dealsTitle: { fontSize: 15, fontWeight: '700', marginBottom: 4, letterSpacing: 0.2 },
  routeSummary: { fontSize: 13, marginBottom: 10 },
  routeBlock: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingTop: 6,
    paddingBottom: 4,
    marginBottom: 14,
  },
  routeRule: { height: StyleSheet.hairlineWidth, marginVertical: 2, marginHorizontal: 4 },
  detailsBlock: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  fieldLabel: { fontSize: 13, fontWeight: '600', marginBottom: 8 },
  monthNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  monthLabel: { fontSize: 17, fontWeight: '700' },
  stepBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginTop: 4,
  },
  stepValue: { fontSize: 17, fontWeight: '700', minWidth: 72, textAlign: 'center' },
  error: { marginBottom: 12, fontSize: 14 },
});