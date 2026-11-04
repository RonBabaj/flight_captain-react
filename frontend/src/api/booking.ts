/**
 * Exact-flight booking resolution API.
 */

import { getRuntimeConfig } from '../config/runtimeConfigStore';
import { getApiBase } from './client';

export type BookingResolveStatus =
  | 'verified'
  | 'not_found'
  | 'search_unavailable'
  | 'timeout'
  | 'invalid_itinerary';

export interface PublicBookingOffer {
  provider: string;
  domain: string;
  url: string;
  urlType: string;
  price?: number;
  currency?: string;
  matchConfidence: number;
  priceLabel?:
    | 'best_matching_price'
    | 'cheapest_matching_offer'
    | 'search_quote'
    | 'search_prefill'
    | 'google_flights_partner'
    | 'partner_checkout_price'
    | 'cheapest_ota'
    | 'airline_direct'
    | 'airline_direct_prefill';
  checkedAt: string;
}

export interface BookingResolveResponse {
  found: boolean;
  status: BookingResolveStatus;
  itineraryFingerprint?: string;
  offer?: PublicBookingOffer;
  cheapestOta?: PublicBookingOffer;
  airlineDirect?: PublicBookingOffer;
  message?: string;
  quotedPrice?: number;
  quotedCurrency?: string;
  priceMismatch?: boolean;
  candidatesConsidered?: number;
  alternatives?: PublicBookingAlternative[];
}

export interface PublicBookingAlternative {
  provider: string;
  domain: string;
  url?: string;
  price?: number;
  currency?: string;
}

export interface BookingResolveRequest {
  sessionId: string;
  optionId: string;
  legIndex?: number;
  segmentIndex?: number;
  force?: boolean;
}

function isTransientBookingResolveResponse(res: BookingResolveResponse): boolean {
  if (res.found) return false;
  if (res.status === 'timeout' || res.status === 'search_unavailable') return true;
  const msg = (res.message || '').toLowerCase();
  return /rate limit|try again|temporarily unavailable|timed out|busy/.test(msg);
}

function isTransientBookingFetchError(message: string): boolean {
  return /rate limit|try again|timed out|timeout|502|503|504|gateway|network|failed to fetch|load failed|could not reach/i.test(
    message,
  );
}

function bookingRetryDelayMs(attempt: number): number {
  return 1500 * (attempt + 1);
}

async function fetchBookingResolveOnce(
  sessionId: string,
  optionId: string,
  legIndex?: number,
  force?: boolean,
  segmentIndex?: number,
): Promise<BookingResolveResponse> {
  const base = getApiBase();
  const body: BookingResolveRequest = { sessionId, optionId };
  if (legIndex != null && legIndex >= 0) {
    body.legIndex = legIndex;
  }
  if (segmentIndex != null && segmentIndex >= 0) {
    body.segmentIndex = segmentIndex;
  }
  if (force) {
    body.force = true;
  }

  const timeoutMs = getRuntimeConfig().apiRequestDefaultTimeoutMs;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let res: Response;
  try {
    res = await fetch(`${base}/api/booking/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (e) {
    const raw = e instanceof Error ? e.message : String(e);
    if (controller.signal.aborted) {
      throw new Error('Booking search timed out. Please try again.');
    }
    if (isTransientBookingFetchError(raw)) {
      throw new Error('Booking search is temporarily unavailable. Please try again.');
    }
    throw e instanceof Error ? e : new Error(raw);
  } finally {
    clearTimeout(timer);
  }

  const text = await res.text();
  let data: BookingResolveResponse;
  try {
    data = JSON.parse(text) as BookingResolveResponse;
  } catch {
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  if (!res.ok && !data.status) {
    throw new Error(data.message || text || res.statusText);
  }
  return data;
}

/** Resolve a verified web booking offer for the exact itinerary (server loads canonical identity). */
export async function resolveBookingOffer(
  sessionId: string,
  optionId: string,
  legIndex?: number,
  force?: boolean,
  segmentIndex?: number,
  maxAttempts = 3,
): Promise<BookingResolveResponse> {
  let lastRes: BookingResolveResponse | undefined;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const useForce = force === true || attempt > 0;
    try {
      const res = await fetchBookingResolveOnce(
        sessionId,
        optionId,
        legIndex,
        useForce,
        segmentIndex,
      );
      if (res.found || !isTransientBookingResolveResponse(res) || attempt === maxAttempts - 1) {
        return res;
      }
      lastRes = res;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (!isTransientBookingFetchError(msg) || attempt === maxAttempts - 1) {
        throw e instanceof Error ? e : new Error(msg);
      }
    }
    await new Promise((r) => setTimeout(r, bookingRetryDelayMs(attempt)));
  }
  if (lastRes) return lastRes;
  throw new Error('Booking search is temporarily unavailable. Please try again.');
}

/** Client-side guard before opening an externally resolved booking URL. */
export function isSafeBookingUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch {
    return false;
  }
}
