import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { PublicBookingAlternative } from '../api/booking';
import { isSafeBookingUrl } from '../api/booking';
import { useTheme } from '../theme/ThemeContext';
import { useLocale } from '../context/LocaleContext';
import { Button } from './Button';
import { formatBookingOfferPriceAmount, formatProviderDisplayName } from './bookingOfferDisplay';

export interface BookingAlternativesListProps {
  alternatives: PublicBookingAlternative[];
  onOpenUrl: (url: string) => void;
  /** Compact rows as text links (dual stack); otherwise secondary buttons. */
  asLinks?: boolean;
  message?: string | null;
}

export function BookingAlternativesList({
  alternatives,
  onOpenUrl,
  asLinks = false,
  message,
}: BookingAlternativesListProps) {
  const { theme } = useTheme();
  const { t } = useLocale();
  const openable = alternatives.filter((alt) => alt.url && isSafeBookingUrl(alt.url));
  if (openable.length === 0 && !message) return null;

  if (asLinks) {
    return (
      <View style={styles.altBlock}>
        <Text style={[styles.altTitle, { color: theme.textMuted }]}>{t('booking_alternatives_title')}</Text>
        {alternatives.map((alt) => {
          const label = formatProviderDisplayName(alt.provider || alt.domain || '');
          const price = formatBookingOfferPriceAmount(alt, t);
          const canOpen = !!alt.url && isSafeBookingUrl(alt.url);
          const rowKey = `${alt.domain}-${alt.url || label}`;
          if (!canOpen) {
            return (
              <Text key={rowKey} style={[styles.altRow, { color: theme.textMuted }]}>
                {label}
                {price ? ` · ${price}` : ''}
              </Text>
            );
          }
          return (
            <Pressable
              key={rowKey}
              onPress={() => onOpenUrl(alt.url!)}
              style={({ pressed }) => [styles.altPressable, pressed && styles.altPressablePressed]}
              accessibilityRole="link"
              accessibilityLabel={
                price
                  ? t('booking_open_alternative').replace('{provider}', label).replace('{price}', price)
                  : t('booking_open_alternative_no_price').replace('{provider}', label)
              }
            >
              <Text style={[styles.altRow, styles.altLink, { color: theme.primaryLight }]}>
                {label}
                {price ? ` · ${price}` : ''}
              </Text>
              <Text style={[styles.altOpenHint, { color: theme.textMuted }]}>{t('booking_continue')}</Text>
            </Pressable>
          );
        })}
      </View>
    );
  }

  return (
    <View style={styles.altBlock}>
      {message ? (
        <Text style={[styles.singleSubtitle, { color: theme.textMuted }]}>{message}</Text>
      ) : null}
      {openable.map((alt) => {
        const label = formatProviderDisplayName(alt.provider || alt.domain || '');
        const price = formatBookingOfferPriceAmount(alt, t);
        return (
          <Button
            key={`${alt.domain}-${alt.url}`}
            label={
              price
                ? t('booking_open_alternative').replace('{provider}', label).replace('{price}', price)
                : t('booking_open_alternative_no_price').replace('{provider}', label)
            }
            onPress={() => onOpenUrl(alt.url!)}
            variant="secondary"
            size="sm"
            style={styles.singleCta}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  altBlock: {
    gap: 4,
    marginTop: 2,
  },
  altTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  altRow: {
    fontSize: 12,
    lineHeight: 17,
    flex: 1,
  },
  altPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  altPressablePressed: {
    opacity: 0.7,
  },
  altLink: {
    textDecorationLine: 'underline',
  },
  altOpenHint: {
    fontSize: 12,
    fontWeight: '600',
    flexShrink: 0,
  },
  singleSubtitle: {
    fontSize: 12,
    lineHeight: 17,
  },
  singleCta: {
    marginTop: 4,
  },
});
