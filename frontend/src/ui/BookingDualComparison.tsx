import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { PublicBookingOffer } from '../api/booking';
import { useTheme } from '../theme/ThemeContext';
import { useLocale } from '../context/LocaleContext';
import { BookingOptionCard } from './BookingOptionCard';
import {
  bookingOfferProviderLabel,
  bookingOfferSubtitle,
  formatBookingOfferPriceDisplay,
} from './bookingOfferDisplay';
import { badgesForDualOffers } from './bookingDualDisplay';

export interface BookingDualComparisonProps {
  cheapest: PublicBookingOffer;
  airline: PublicBookingOffer;
  airlineName?: string;
  compact?: boolean;
  onOpenCheapest: () => void;
  onOpenAirline: () => void;
}

/** Comparison header + dual action cards (partner vs airline). */
export function BookingDualComparison({
  cheapest,
  airline,
  airlineName,
  compact,
  onOpenCheapest,
  onOpenAirline,
}: BookingDualComparisonProps) {
  const { theme } = useTheme();
  const { t } = useLocale();

  const partnerLabel = bookingOfferProviderLabel(cheapest, t('book_this_flight'));
  const directLabel = airlineName || bookingOfferProviderLabel(airline, t('book_this_flight'));
  const partnerPrice = formatBookingOfferPriceDisplay(cheapest, t);
  const directPrice = formatBookingOfferPriceDisplay(airline, t);
  const directSub = bookingOfferSubtitle(airline, t);
  const { partnerBadge, airlineBadge, partnerIsLower } = badgesForDualOffers(cheapest, airline);
  const partnerFirst = partnerIsLower || partnerBadge === 'cheapest';

  return (
    <View style={styles.wrap}>
      <Text style={[styles.tableTitle, { color: theme.text, fontFamily: theme.fontDisplay }]}>
        {t('booking_compare_title')}
      </Text>
      <View style={[styles.table, { borderColor: theme.cardBorder, backgroundColor: theme.cardBg }]}>
        <View style={[styles.headRow, { borderBottomColor: theme.cardBorder }]}>
          <Text style={[styles.colHead, styles.colOption, { color: theme.textMuted }]}>{t('booking_compare_option')}</Text>
          <Text style={[styles.colHead, styles.colPrice, { color: theme.textMuted }]}>{t('booking_compare_price')}</Text>
          <Text style={[styles.colHead, styles.colNext, { color: theme.textMuted }]} numberOfLines={2}>
            {t('booking_compare_next')}
          </Text>
        </View>
        <View style={[styles.dataRow, partnerIsLower && { backgroundColor: theme.successBg }]}>
          <Text style={[styles.cell, styles.colOption, { color: theme.text, fontWeight: '700' }]} numberOfLines={2}>
            {partnerLabel}
          </Text>
          <Text style={[styles.cell, styles.colPrice, { color: theme.price, fontWeight: '800' }]}>{partnerPrice}</Text>
          <Text style={[styles.cell, styles.colNext, { color: theme.textMuted }]} numberOfLines={3}>
            {t('booking_compare_partner_next')}
          </Text>
        </View>
        <View style={[styles.dataRow, !partnerIsLower && airlineBadge === 'lowest' && { backgroundColor: theme.successBg }]}>
          <Text style={[styles.cell, styles.colOption, { color: theme.text, fontWeight: '700' }]} numberOfLines={2}>
            {directLabel}
          </Text>
          <Text style={[styles.cell, styles.colPrice, { color: theme.price, fontWeight: '800' }]}>{directPrice}</Text>
          <Text style={[styles.cell, styles.colNext, { color: theme.textMuted }]} numberOfLines={3}>
            {directSub ?? t('airline_direct_prefill_hint')}
          </Text>
        </View>
      </View>
      {partnerFirst ? (
        <>
          <BookingOptionCard offer={cheapest} badge={partnerBadge} compact={compact} onContinue={onOpenCheapest} />
          <BookingOptionCard
            offer={airline}
            badge={airlineBadge}
            compact={compact}
            titleOverride={airlineName}
            onContinue={onOpenAirline}
          />
        </>
      ) : (
        <>
          <BookingOptionCard
            offer={airline}
            badge={airlineBadge}
            compact={compact}
            titleOverride={airlineName}
            onContinue={onOpenAirline}
          />
          <BookingOptionCard offer={cheapest} badge={partnerBadge} compact={compact} onContinue={onOpenCheapest} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 10, width: '100%' },
  tableTitle: { fontSize: 14, fontWeight: '700', letterSpacing: 0.2 },
  table: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    overflow: 'hidden',
  },
  headRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  dataRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'flex-start',
  },
  colHead: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.35,
  },
  cell: { fontSize: 13, lineHeight: 18 },
  colOption: { flex: 1.1, paddingRight: 6 },
  colPrice: { width: 88, flexShrink: 0 },
  colNext: { flex: 1.4 },
});