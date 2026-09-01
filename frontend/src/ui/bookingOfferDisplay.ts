import type { PublicBookingOffer } from '../api/booking';
import { getCurrencySymbol } from '../utils/exchangeRates';

export function bookingOfferProviderLabel(offer: PublicBookingOffer, fallback = ''): string {
  const raw = (offer.provider || offer.domain || fallback).trim();
  if (!raw) return fallback;
  if (/^(flight|flights|partner|ota|travel|booking)$/i.test(raw)) {
    const fromDomain = offer.domain ? formatProviderDisplayName(offer.domain) : '';
    if (fromDomain && !/^(flight|flights|partner|ota|travel|booking)$/i.test(fromDomain)) {
      return fromDomain;
    }
    return fallback || raw;
  }
  return formatProviderDisplayName(raw);
}

/** Turn budgetair.com / www.budgetair.com into a readable label. */
export function formatProviderDisplayName(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return raw;
  if (!trimmed.includes('.') && !trimmed.includes('/')) return trimmed;
  const host = trimmed.replace(/^https?:\/\//i, '').replace(/^www\./i, '').split('/')[0];
  const parts = host.split('.').filter(Boolean);
  if (parts.length === 0) return trimmed;
  const localeLike = (label: string) => /^[a-z]{2}(-[a-z]{2})?$/i.test(label);
  let slug = parts[0];
  if (parts.length >= 2 && (localeLike(slug) || slug.length <= 3)) {
    slug = parts[parts.length - 2];
  }
  if (!slug) return trimmed;
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

export function formatBookingOfferPriceAmount(
  offer: PublicBookingOffer,
  t?: (key: string) => string,
): string | null {
  if (offer.price == null || !offer.currency) return null;
  const amount = `${getCurrencySymbol(offer.currency)} ${offer.price.toFixed(0)}`;
  if (offer.priceLabel === 'airline_direct_prefill' && t) {
    return `${amount} (${t('search_quote_price')})`;
  }
  return amount;
}

export function formatBookingOfferPriceLine(
  offer: PublicBookingOffer,
  t: (key: string) => string,
): string | null {
  const amount = formatBookingOfferPriceAmount(offer, t);
  if (!amount) return null;
  const hint =
    offer.priceLabel === 'google_flights_partner' ? ` (${t('partner_listing_price')})` : '';
  return `${amount}${hint}`;
}

export function bookingOfferSubtitle(
  offer: PublicBookingOffer,
  t: (key: string) => string,
): string | undefined {
  switch (offer.priceLabel) {
    case 'google_flights_partner':
      return t('partner_listing_price');
    case 'partner_checkout_price':
      return t('partner_checkout_price');
    case 'cheapest_matching_offer':
      return t('cheapest_matching_offer');
    case 'airline_direct_prefill':
      return t('airline_direct_prefill_hint');
    case 'search_prefill':
      return t('search_prefill_hint');
    case 'airline_direct':
      return t('booking_airline_direct_subtitle');
    default:
      return undefined;
  }
}
