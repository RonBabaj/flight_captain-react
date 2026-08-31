import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View, ViewStyle } from 'react-native';
import type { BookingResolveResponse, PublicBookingOffer } from '../api/booking';
import { isSafeBookingUrl } from '../api/booking';
import { useTheme } from '../theme/ThemeContext';
import { useLocale } from '../context/LocaleContext';
import { getAirlineName } from '../data/airlines';
import { BookingOptionCard } from './BookingOptionCard';
import { Button } from './Button';
import { Callout } from './Callout';
import {
  bookingOfferProviderLabel,
  bookingOfferSubtitle,
  formatBookingOfferPriceLine,
} from './bookingOfferDisplay';

export interface BookingOptionsFooterProps {
  resolved: BookingResolveResponse | null | undefined;
  loading?: boolean;
  errorMessage?: string | null;
  onResolve?: () => void;
  onOpenUrl: (url: string) => void;
  /** Marketing carrier for airline-direct title (e.g. LY → El Al). */
  carrierCode?: string;
  showDisclaimer?: boolean;
  style?: ViewStyle;
}

function hasDualOptions(resolved: BookingResolveResponse): boolean {
  const cheapest = resolved.cheapestOta;
  const airline = resolved.airlineDirect;
  if (!cheapest?.url || !airline?.url) return false;
  if (cheapest.url === airline.url) return false;
  return isSafeBookingUrl(cheapest.url) && isSafeBookingUrl(airline.url);
}

function singleOffer(resolved: BookingResolveResponse): PublicBookingOffer | null {
  if (!resolved.found) return null;
  return resolved.cheapestOta ?? resolved.offer ?? null;
}

export function BookingOptionsFooter({
  resolved,
  loading = false,
  errorMessage,
  onResolve,
  onOpenUrl,
  carrierCode,
  showDisclaimer = true,
  style,
}: BookingOptionsFooterProps) {
  const { theme } = useTheme();
  const { t } = useLocale();

  const airlineName = carrierCode ? getAirlineName(carrierCode) || carrierCode : undefined;

  if (loading) {
    return (
      <View style={[styles.wrap, style]}>
        <Text style={[styles.hint, { color: theme.textMuted }]}>{t('resolving_exact_booking')}</Text>
        <ActivityIndicator size="small" color={theme.primary} />
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={[styles.wrap, style]}>
        <Callout message={errorMessage} variant="error" />
        {onResolve ? (
          <Button label={t('try_again')} onPress={onResolve} variant="secondary" size="sm" />
        ) : null}
      </View>
    );
  }

  if (!resolved?.found) {
    if (onResolve) {
      return (
        <View style={[styles.wrap, style]}>
          <Button label={t('book_this_flight')} onPress={onResolve} />
        </View>
      );
    }
    return null;
  }

  const dual = hasDualOptions(resolved);

  return (
    <View style={[styles.wrap, style]}>
      {resolved.priceMismatch ? (
        <Callout
          message={resolved.message || t('price_mismatch_warning')}
          variant="warning"
        />
      ) : null}

      {dual && resolved.cheapestOta && resolved.airlineDirect ? (
        <View style={styles.optionsStack}>
          <BookingOptionCard
            offer={resolved.cheapestOta}
            badge="cheapest"
            onContinue={() => onOpenUrl(resolved.cheapestOta!.url)}
          />
          <BookingOptionCard
            offer={resolved.airlineDirect}
            badge="direct"
            titleOverride={airlineName}
            onContinue={() => onOpenUrl(resolved.airlineDirect!.url)}
          />
        </View>
      ) : (
        (() => {
          const offer = singleOffer(resolved);
          if (!offer?.url || !isSafeBookingUrl(offer.url)) return null;
          const isPrefill = offer.priceLabel === 'search_prefill';
          const title = bookingOfferProviderLabel(offer, t('book_this_flight'));
          const priceLine = formatBookingOfferPriceLine(offer, t);
          const subtitle = bookingOfferSubtitle(offer, t);
          return (
            <View style={[styles.singleCard, { borderColor: theme.cardBorder, backgroundColor: theme.cardBg }]}>
              <Text style={[styles.singleTitle, { color: theme.text }]}>
                {title}
                {priceLine ? ` · ${priceLine}` : ''}
              </Text>
              {subtitle ? (
                <Text style={[styles.singleSubtitle, { color: theme.textMuted }]}>{subtitle}</Text>
              ) : null}
              {resolved.message && isPrefill ? (
                <Text style={[styles.singleSubtitle, { color: theme.textMuted }]}>{resolved.message}</Text>
              ) : null}
              <Button
                label={isPrefill ? t('open_flight_search') : t('open_booking_site')}
                onPress={() => onOpenUrl(offer.url)}
                style={styles.singleCta}
              />
            </View>
          );
        })()
      )}

      {showDisclaimer ? (
        <Text style={[styles.disclaimer, { color: theme.textMuted }]}>{t('booking_disclaimer')}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    gap: 10,
  },
  hint: {
    fontSize: 12,
    textAlign: 'center',
  },
  optionsStack: {
    gap: 10,
  },
  singleCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    gap: 6,
  },
  singleTitle: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 21,
  },
  singleSubtitle: {
    fontSize: 12,
    lineHeight: 17,
  },
  singleCta: {
    marginTop: 4,
  },
  disclaimer: {
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: 2,
  },
});
