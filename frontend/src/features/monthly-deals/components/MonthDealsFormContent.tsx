import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AppIcon } from '../../../components/AppIcon';
import { FormHeroHeader } from '../../../components/search/FormHeroHeader';
import { SearchSubmitButton } from '../../../components/search/SearchSubmitButton';
import { formCardStyles } from '../../../components/search/formStyles';
import { useTheme } from '../../../theme/ThemeContext';
import { useLocale } from '../../../context/LocaleContext';
import { formatMonthYear } from '../../../utils/monthNames';
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

  return (
    <View
      style={[
        formCardStyles.card,
        compact && formCardStyles.cardCompact,
        { backgroundColor: theme.cardBg, borderColor: theme.cardBorder },
      ]}
    >
      {compact && routeSummary ? (
        <Text style={[styles.routeSummary, { color: theme.textMuted }]} numberOfLines={1}>
          {routeSummary}
        </Text>
      ) : (
        <FormHeroHeader
          icon="calendar-outline"
          title={t('monthly_deals')}
          subtitle={t('monthly_deals_hero')}
        />
      )}

      <AirportAutocomplete
        label={t('from')}
        value={origin}
        onChange={onOriginChange}
        placeholder={t('city_or_airport')}
      />
      <AirportAutocomplete
        label={t('to')}
        value={destination}
        onChange={onDestinationChange}
        placeholder={t('city_or_airport')}
        showAnywhere
      />

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

      <Text style={[formCardStyles.label, { color: theme.text }, isRTL && { textAlign: 'right' }]}>
        {t('trip_duration_days')}
      </Text>
      <View style={styles.stepperRow}>
        <TouchableOpacity
          style={[styles.stepBtn, { backgroundColor: theme.controlBg, borderColor: theme.cardBorder }]}
          onPress={() => onDurationChange(Math.max(1, durationDays - 1))}
        >
          <Text style={[styles.stepBtnText, { color: theme.text }]}>−</Text>
        </TouchableOpacity>
        <Text style={[styles.stepValue, { color: theme.text }]}>
          {durationDays} {t('days')}
        </Text>
        <TouchableOpacity
          style={[styles.stepBtn, { backgroundColor: theme.controlBg, borderColor: theme.cardBorder }]}
          onPress={() => onDurationChange(Math.min(21, durationDays + 1))}
        >
          <Text style={[styles.stepBtnText, { color: theme.text }]}>+</Text>
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.monthNav,
          { backgroundColor: theme.controlBg, borderColor: theme.cardBorder },
          isRTL && { direction: 'rtl' },
        ]}
      >
        <TouchableOpacity
          onPress={onPrevMonth}
          style={[styles.navBtn, atEarliestDealsMonth && { opacity: 0.45 }]}
          disabled={atEarliestDealsMonth}
          activeOpacity={atEarliestDealsMonth ? 1 : 0.7}
        >
          <View style={styles.navBtnInner}>
            <AppIcon
              name={isRTL ? 'chevron-forward' : 'chevron-back'}
              size={18}
              color={atEarliestDealsMonth ? theme.textMuted : theme.primary}
              fallbackText={t('prev')}
            />
            <Text style={[styles.navText, { color: atEarliestDealsMonth ? theme.textMuted : theme.primary }]}>
              {t('prev')}
            </Text>
          </View>
        </TouchableOpacity>
        <Text style={[styles.monthTitle, { color: theme.text }]}>
          {formatMonthYear(year, month, language)}
        </Text>
        <TouchableOpacity onPress={onNextMonth} style={styles.navBtn}>
          <View style={styles.navBtnInner}>
            <Text style={[styles.navText, { color: theme.primary }]}>{t('next')}</Text>
            <AppIcon
              name={isRTL ? 'chevron-back' : 'chevron-forward'}
              size={18}
              color={theme.primary}
              fallbackText={t('next')}
            />
          </View>
        </TouchableOpacity>
      </View>

      {error ? <Text style={[formCardStyles.error, { color: theme.error }]}>{error}</Text> : null}

      <SearchSubmitButton
        label={t('search_deals')}
        loading={loading}
        disabled={!origin.trim() || !destination.trim()}
        onPress={onSearch}
        compact={compact}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  routeSummary: { fontSize: 14, marginBottom: 10 },
  stepperRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
  stepBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepBtnText: { fontSize: 20, fontWeight: '600' },
  stepValue: { fontSize: 16, minWidth: 56, textAlign: 'center' },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 12,
  },
  navBtn: {},
  navBtnInner: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  navText: { fontWeight: '600', fontSize: 14 },
  monthTitle: { fontSize: 16, fontWeight: '700', marginHorizontal: 16, textAlign: 'center' },
});
