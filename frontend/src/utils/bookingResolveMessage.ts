import type { BookingResolveResponse } from '../api/booking';

type Translate = (key: string) => string;

/** User-facing copy for a failed booking resolve response (found=false). */
export function bookingResolveErrorMessage(
  res: BookingResolveResponse | null | undefined,
  t: Translate,
): string {
  if (!res) {
    return t('booking_search_unavailable');
  }
  const msg = (res.message || '').trim();
  switch (res.status) {
    case 'not_found':
    case 'invalid_itinerary':
      return msg || t('no_verified_booking');
    case 'timeout':
      return msg || t('booking_search_timeout');
    case 'search_unavailable':
      return msg || t('booking_search_unavailable');
    default:
      return msg || t('no_verified_booking');
  }
}

/** Map thrown errors from resolveBookingOffer / fetch to localized strings. */
export function bookingResolveFetchErrorMessage(error: unknown, t: Translate): string {
  const raw = error instanceof Error ? error.message : String(error);
  const lower = raw.toLowerCase();
  if (/timed out|timeout/.test(lower)) {
    return t('booking_search_timeout');
  }
  if (/no verified|not found/.test(lower)) {
    return raw;
  }
  if (/temporarily unavailable|rate limit|try again|502|503|504|gateway|failed to fetch|could not reach|busy/.test(lower)) {
    return /try again|busy|rate limit/.test(lower) && raw.trim()
      ? raw
      : t('booking_search_unavailable');
  }
  return raw.trim() || t('booking_search_unavailable');
}