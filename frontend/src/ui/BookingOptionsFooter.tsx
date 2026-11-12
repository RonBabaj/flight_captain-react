import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import type { BookingResolveResponse, PublicBookingOffer } from '../api/booking';
import { isSafeBookingUrl } from '../api/booking';
import { useTheme } from '../theme/ThemeContext';
import { useLocale } from '../context/LocaleContext';
import { resolveAirlineLabel } from '../data/airlines';
import { getCurrencySymbol } from '../utils/exchangeRates';
import { BookingOptionCard } from './BookingOptionCard';
import { Button } from './Button';
import { Callout } from './Callout';
import {
  bookingOfferProviderLabel,
  bookingOfferSubtitle,
  formatBookingOfferPriceAmount,
  formatProviderDisplayName,
} from './bookingOfferDisplay';

export interface BookingOptionsFooterProps {
  resolved: BookingResolveResponse | null | undefined;
  loading?: boolean;
  errorMessage?: string | null;
  onResolve?: () => void;
  onOpenUrl: (url: string) => void;
  /** Marketing carrier for airline-direct title (e.g. LY → El Al). */
  carrierCode?: string;
  /** Tighter layout for narrow/mobile containers. */
  compact?: boolean;
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
  compact = false,
  showDisclaimer = true,
  style,
}: BookingOptionsFooterProps) {
  const { theme } = useTheme();
  const { t } = useLocale();

  const airlineName = carrierCode ? resolveAirlineLabel(carrierCode) : undefined;

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

  const renderResolveCta = (label: string) =>
    onResolve ? <Button label={label} onPress={onResolve} /> : null;

  if (!resolved?.found) {
    return (
      <View style={[styles.wrap, style]}>
        {renderResolveCta(t('book_this_flight'))}
      </View>
    );
  }

  const dual = hasDualOptions(resolved);
  const offer = dual ? null : singleOffer(resolved);
  const offerOpenable = !!(offer?.url && isSafeBookingUrl(offer.url));

  // found=true with only a meta/unsafe URL used to render an empty footer (no Book button).
  if (!dual && !offerOpenable) {
    return (
      <View style={[styles.wrap, style]}>
        <Callout
          message={resolved.message || t('no_verified_booking')}
          variant="warning"
        />
        {renderResolveCta(t('try_again'))}
        {showDisclaimer ? (
          <Text style={[styles.disclaimer, { color: theme.textMuted }]}>{t('booking_disclaimer')}</Text>
        ) : null}
      </View>
    );
  }

  return (
    <View style={[styles.wrap, style]}>
      {resolved.priceMismatch ? (
        <Callout
          message={resolved.message || t('price_mismatch_warning')}
          variant="error"
        />
      ) : null}

      {dual && resolved.cheapestOta && resolved.airlineDirect ? (
        <View style={styles.optionsStack}>
          {resolved.candidatesConsidered != null && resolved.candidatesConsidered > 1 ? (
            <Text style={[styles.comparedHint, { color: theme.textMuted }]}>
              {t('booking_sites_compared').replace('{count}', String(resolved.candidatesConsidered))}
            </Text>
          ) : null}
          <BookingOptionCard
            offer={resolved.cheapestOta}
            badge="cheapest"
            compact={compact}
            onContinue={() => onOpenUrl(resolved.cheapestOta!.url)}
          />
          <BookingOptionCard
            offer={resolved.airlineDirect}
            badge="direct"
            compact={compact}
            titleOverride={airlineName}
            onContinue={() => onOpenUrl(resolved.airlineDirect!.url)}
          />
          {resolved.alternatives && resolved.alternatives.length > 0 ? (
            <View style={styles.altBlock}>
              <Text style={[styles.altTitle, { color: theme.textMuted }]}>{t('booking_alternatives_title')}</Text>
              {resolved.alternatives.map((alt) => {
                const label = formatProviderDisplayName(alt.provider || alt.domain || '');
                const price =
                  alt.price != null && alt.currency
                    ? `${getCurrencySymbol(alt.currency)} ${alt.price.toFixed(0)}`
                    : null;
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
          ) : null}
        </View>
      ) : offer && offerOpenable ? (
        (() => {
          const isPrefill =
            offer.priceLabel === 'search_prefill' || offer.priceLabel === 'airline_direct_prefill';
          const title = bookingOfferProviderLabel(offer, t('book_this_flight'));
          const priceAmount = formatBookingOfferPriceAmount(offer);
          const subtitle = bookingOfferSubtitle(offer, t);
          const host = (offer.domain || offer.provider || '').toLowerCase();
          const ctaLabel = isPrefill
            ? host.includes('skyscanner')
              ? t('open_skyscanner_search')
              : t('open_flight_search')
            : t('open_booking_site');
          return (
            <View style={[styles.singleCard, compact && styles.singleCardCompact, { borderColor: theme.cardBorder, backgroundColor: theme.cardBg }]}>
              <View style={styles.singleHeader}>
                <Text style={[styles.singleTitle, { color: theme.text }]} numberOfLines={2}>
                  {title}
                </Text>
                {priceAmount ? (
                  <Text style={[styles.singlePrice, { color: theme.text }]}>{priceAmount}</Text>
                ) : null}
              </View>
              {subtitle ? (
                <Text style={[styles.singleSubtitle, { color: theme.textMuted }]}>{subtitle}</Text>
              ) : null}
              {resolved.message && isPrefill ? (
                <Text style={[styles.singleSubtitle, { color: theme.textMuted }]}>{resolved.message}</Text>
              ) : null}
              <Button
                label={ctaLabel}
                onPress={() => onOpenUrl(offer.url)}
                style={styles.singleCta}
              />
            </View>
          );
        })()
      ) : (
        renderResolveCta(t('book_this_flight'))
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
  comparedHint: {
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
  },
  altBlock: {
    gap: 4,
    marginTop: 2,
  },
  altTitle: {
    fontSize: 11,
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
    fontSize: 11,
    fontWeight: '600',
    flexShrink: 0,
  },
  singleCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    gap: 6,
    width: '100%',
  },
  singleCardCompact: {
    padding: 10,
    borderRadius: 12,
  },
  singleHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  singleTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  singlePrice: {
    fontSize: 18,
    fontWeight: '800',
    flexShrink: 0,
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
