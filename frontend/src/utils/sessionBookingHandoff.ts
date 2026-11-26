import type { BookingResolveResponse } from '../api/booking';
import { isSafeBookingUrl } from '../api/booking';
import type { FlightOption } from '../types';

/**
 * Checkout URL already attached to the search result (Kiwi /booking?token=…,
 * Skyscanner transport_deeplink, etc.). Book should open this instead of
 * re-searching Google — same idea as backend storedSessionBookingURL.
 */
export function sessionCheckoutUrlFromOption(option: FlightOption | null | undefined): string | null {
  if (!option) return null;
  const candidates = [option.deepLink, option.bookingUrl];
  for (const raw of candidates) {
    const url = (raw || '').trim();
    if (url && isSafeBookingUrl(url)) return url;
  }
  return null;
}

/** Synthetic resolve payload so the footer can show Open without a round-trip. */
export function sessionBookingResolveFromOption(
  option: FlightOption | null | undefined,
): BookingResolveResponse | null {
  const url = sessionCheckoutUrlFromOption(option);
  if (!url || !option) return null;
  const host = (() => {
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch {
      return (option.vendorName || option.source || 'partner').trim();
    }
  })();
  const provider = (option.vendorName || option.source || host).trim() || host;
  const offer = {
    provider,
    domain: host,
    url,
    urlType: 'exact_booking_deeplink',
    price: option.price?.amount,
    currency: option.price?.currency,
    matchConfidence: 100,
    priceLabel: 'cheapest_ota' as const,
    checkedAt: new Date().toISOString(),
  };
  return {
    found: true,
    status: 'verified',
    offer,
    cheapestOta: offer,
    message: 'Opens the booking page from the site that showed this fare.',
  };
}