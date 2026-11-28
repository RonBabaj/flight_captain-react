import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import type { PublicBookingOffer } from '../api/booking';
import { useTheme } from '../theme/ThemeContext';
import { useLocale } from '../context/LocaleContext';
import { Button } from './Button';
import {
  bookingOfferProviderLabel,
  bookingOfferSubtitle,
  formatBookingOfferPriceDisplay,
} from './bookingOfferDisplay';
import { badgeToTranslationKey, type BookingDisplayBadge } from './bookingDualDisplay';

export type BookingOptionBadge = BookingDisplayBadge;

export interface BookingOptionCardProps {
  offer: PublicBookingOffer;
  badge: BookingOptionBadge;
  titleOverride?: string;
  onContinue: () => void;
  compact?: boolean;
  style?: ViewStyle;
}

export function BookingOptionCard({
  offer,
  badge,
  titleOverride,
  onContinue,
  compact = false,
  style,
}: BookingOptionCardProps) {
  const { theme } = useTheme();
  const { t } = useLocale();

  const title = titleOverride || bookingOfferProviderLabel(offer, t('book_this_flight'));
  const priceAmount = formatBookingOfferPriceDisplay(offer, t);
  const subtitle = bookingOfferSubtitle(offer, t);
  const badgeLabel = t(badgeToTranslationKey(badge));
  const badgeColors =
    badge === 'cheapest' || badge === 'lowest'
      ? { fg: theme.success, bg: theme.successBg }
      : badge === 'partner'
        ? { fg: theme.textMuted, bg: theme.controlBg }
        : { fg: theme.primaryLight, bg: theme.infoBg };
  const ctaLabel = t('booking_continue');
  const ctaA11y = t('booking_continue_on').replace('{provider}', title);

  return (
    <View
      style={[
        styles.card,
        compact && styles.cardCompact,
        { backgroundColor: theme.cardBg, borderColor: theme.cardBorder },
        style,
      ]}
      accessibilityRole="summary"
    >
      <View style={styles.headerRow}>
        <View style={[styles.badge, { backgroundColor: badgeColors.bg }]}>
          <Text style={[styles.badgeText, { color: badgeColors.fg }]}>{badgeLabel}</Text>
        </View>
        <Text
          style={[styles.price, compact && styles.priceCompact, { color: theme.text }]}
          accessibilityLabel={priceAmount}
        >
          {priceAmount}
        </Text>
      </View>
      <Text style={[styles.title, compact && styles.titleCompact, { color: theme.text }]} numberOfLines={2}>
        {title}
      </Text>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: theme.textMuted }]} numberOfLines={compact ? 2 : 3}>
          {subtitle}
        </Text>
      ) : null}
      <Button
        label={ctaLabel}
        onPress={onContinue}
        variant="secondary"
        size="sm"
        style={styles.cta}
        accessibilityLabel={ctaA11y}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    gap: 4,
    width: '100%',
  },
  cardCompact: {
    padding: 10,
    borderRadius: 12,
    gap: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  price: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
    flexShrink: 0,
  },
  priceCompact: {
    fontSize: 18,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  titleCompact: {
    fontSize: 15,
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 16,
  },
  cta: {
    marginTop: 4,
    width: '100%',
  },
});
