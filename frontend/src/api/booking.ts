/**
 * Exact-flight booking resolution API.
 */

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
  priceLabel?: 'best_matching_price' | 'cheapest_matching_offer';
  checkedAt: string;
}

export interface BookingResolveResponse {
  found: boolean;
  status: BookingResolveStatus;
  itineraryFingerprint?: string;
  offer?: PublicBookingOffer;
  message?: string;
  quotedPrice?: number;
  quotedCurrency?: string;
  priceMismatch?: boolean;
}

export interface BookingResolveRequest {
  sessionId: string;
  optionId: string;
  legIndex?: number;
}

/** Resolve a verified web booking offer for the exact itinerary (server loads canonical identity). */
export async function resolveBookingOffer(
  sessionId: string,
  optionId: string,
  legIndex?: number,
): Promise<BookingResolveResponse> {
  const base = getApiBase();
  const body: BookingResolveRequest = { sessionId, optionId };
  if (legIndex != null && legIndex >= 0) {
    body.legIndex = legIndex;
  }
  const res = await fetch(`${base}/api/booking/resolve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  });
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

/** Client-side guard before opening an externally resolved booking URL. */
export function isSafeBookingUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch {
    return false;
  }
}
