import type { PublicBookingOffer } from '../api/booking';
import { getCurrencySymbol } from '../utils/exchangeRates';

export function bookingOfferProviderLabel(offer: PublicBookingOffer, fallback = ''): string {
  return (offer.provider || offer.domain || fallback).trim();
}

export function formatBookingOfferPriceLine(
  offer: PublicBookingOffer,
  t: (key: string) => string,
): string | null {
  if (offer.price == null || !offer.currency) return null;
  const sym = getCurrencySymbol(offer.currency);
  const hint =
    offer.priceLabel === 'google_flights_partner' ? ` (${t('partner_listing_price')})` : '';
  return `${sym} ${offer.price.toFixed(0)}${hint}`;
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
