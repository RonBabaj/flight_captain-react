import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View, ViewStyle } from 'react-native';
import type { BookingResolveResponse, PublicBookingOffer } from '../api/booking';
import { isSafeBookingUrl } from '../api/booking';
import { useTheme } from '../theme/ThemeContext';
import { useLocale } from '../context/LocaleContext';
import { resolveAirlineLabel } from '../data/airlines';
import { BookingOptionCard } from './BookingOptionCard';
import { BookingDualComparison } from './BookingDualComparison';
import { BookingAlternativesList } from './BookingAlternativesList';
import { BookingTrustStrip } from './BookingTrustStrip';
import { Button } from './Button';
import { Callout } from './Callout';
import type { BookingDisplayBadge } from './bookingDualDisplay';

export interface BookingOptionsFooterProps {
  resolved: BookingResolveResponse | null | undefined;
  loading?: boolean;
  errorMessage?: string | null;
  onResolve?: () => void;
  onOpenUrl: (url: string) => void;
  /** Marketing carrier for airline-direct title (e.g. LY → El Al). */
  carrierCode?: string;
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

function singleOfferBadge(offer: PublicBookingOffer): BookingDisplayBadge {
  switch (offer.priceLabel) {
    case 'airline_direct':
    case 'airline_direct_prefill':
      return 'direct';
    case 'cheapest_matching_offer':
      return 'cheapest';
    default:
      return 'partner';
  }
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
          variant={offerOpenable || dual ? 'warning' : 'error'}
        />
      ) : null}

      {dual && resolved.cheapestOta && resolved.airlineDirect ? (
        <View style={styles.optionsStack}>
          <BookingTrustStrip />
          {resolved.candidatesConsidered != null && resolved.candidatesConsidered > 1 ? (
            <Text style={[styles.comparedHint, { color: theme.textMuted }]}>
              {t('booking_sites_compared').replace('{count}', String(resolved.candidatesConsidered))}
            </Text>
          ) : null}
          <BookingDualComparison
            cheapest={resolved.cheapestOta}
            airline={resolved.airlineDirect}
            airlineName={airlineName}
            compact={compact}
            onOpenCheapest={() => onOpenUrl(resolved.cheapestOta!.url)}
            onOpenAirline={() => onOpenUrl(resolved.airlineDirect!.url)}
          />
          {resolved.alternatives && resolved.alternatives.length > 0 ? (
            <BookingAlternativesList
              alternatives={resolved.alternatives}
              onOpenUrl={onOpenUrl}
              asLinks
            />
          ) : null}
        </View>
      ) : offer && offerOpenable ? (
        <View style={styles.optionsStack}>
          <BookingOptionCard
            offer={offer}
            badge={singleOfferBadge(offer)}
            titleOverride={
              offer.priceLabel === 'airline_direct' || offer.priceLabel === 'airline_direct_prefill'
                ? airlineName
                : undefined
            }
            compact={compact}
            onContinue={() => onOpenUrl(offer.url)}
          />
          <BookingAlternativesList
            alternatives={resolved.alternatives ?? []}
            onOpenUrl={onOpenUrl}
            message={
              resolved.message && (resolved.alternatives?.length ?? 0) > 0 ? resolved.message : null
            }
          />
        </View>
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
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  disclaimer: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 2,
  },
});
