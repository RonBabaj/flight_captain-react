import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import type { PublicBookingOffer } from '../api/booking';
import { useTheme } from '../theme/ThemeContext';
import { useLocale } from '../context/LocaleContext';
import { Button } from './Button';
import {
  bookingOfferProviderLabel,
  bookingOfferSubtitle,
  formatBookingOfferPriceLine,
} from './bookingOfferDisplay';

export type BookingOptionBadge = 'cheapest' | 'direct';

export interface BookingOptionCardProps {
  offer: PublicBookingOffer;
  badge: BookingOptionBadge;
  /** Display name override (e.g. airline marketing name). */
  titleOverride?: string;
  onContinue: () => void;
  style?: ViewStyle;
}

export function BookingOptionCard({
  offer,
  badge,
  titleOverride,
  onContinue,
  style,
}: BookingOptionCardProps) {
  const { theme } = useTheme();
  const { t } = useLocale();

  const title = titleOverride || bookingOfferProviderLabel(offer, t('book_this_flight'));
  const priceLine = formatBookingOfferPriceLine(offer, t);
  const subtitle = bookingOfferSubtitle(offer, t);
  const badgeLabel = badge === 'cheapest' ? t('booking_badge_cheapest') : t('booking_badge_direct');
  const badgeColors =
    badge === 'cheapest'
      ? { fg: theme.success, bg: theme.successBg }
      : { fg: theme.primaryLight, bg: theme.infoBg };
  const ctaLabel = t('booking_continue_on').replace('{provider}', title);

  return (
    <View
      style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }, style]}
      accessibilityRole="summary"
    >
      <View style={styles.headerRow}>
        <View style={[styles.badge, { backgroundColor: badgeColors.bg }]}>
          <Text style={[styles.badgeText, { color: badgeColors.fg }]}>{badgeLabel}</Text>
        </View>
        {priceLine ? (
          <Text style={[styles.price, { color: theme.text }]} accessibilityLabel={priceLine}>
            {priceLine}
          </Text>
        ) : null}
      </View>
      <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
        {title}
      </Text>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: theme.textMuted }]} numberOfLines={3}>
          {subtitle}
        </Text>
      ) : null}
      <Button
        label={ctaLabel}
        onPress={onContinue}
        variant="secondary"
        size="sm"
        style={styles.cta}
        accessibilityLabel={ctaLabel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    gap: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  price: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 17,
  },
  cta: {
    marginTop: 6,
    width: '100%',
  },
});
