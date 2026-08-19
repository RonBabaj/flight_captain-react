/**
 * Affiliate outbound-link and provider API. No payment; user books on external site.
 */

import { getApiBase } from './client';
import { isoDatePrefix, isSplitBookingItinerary } from '../utils/skyscanner';
import type { FlightOption } from '../types';

export interface AffiliateProvider {
  code: string;
  name: string;
  type: 'airline' | 'ota';
}

export interface AffiliateProviderResponse {
  provider: AffiliateProvider;
}

export interface OutboundLinkResponse {
  redirectUrl: string;
  provider: AffiliateProvider;
  clickId: string;
}

export interface ClicksByProvider {
  providerCode: string;
  providerName: string;
  count: number;
}

export interface ClicksSummaryResponse {
  from: string;
  to: string;
  total: number;
  byProvider: ClicksByProvider[];
}

const AFFILIATE_BASE = '/api/affiliate';
const OUT_BOOKING_PATH = '/api/out/booking';

/** Optional flight data: when provided, backend can use it for fallback redirect if session/option is not found. */
export interface BookingRedirectParams {
  origin?: string;
  destination?: string;
  departureDate?: string;
  returnDate?: string;
  /** 0-based itinerary leg for a one-way Skyscanner/partner link (dynamic destinations). */
  bookingLeg?: number;
}

type BookingOptionInput = {
  legs?: FlightOption['legs'];
  bookingLeg?: number;
};

/**
 * URL for the uniform booking redirect. Open this URL (e.g. Linking.openURL); backend will 302 to the partner checkout page (or Google Flights prefill) and record the click.
 * Pass optionOrParams so the backend can resolve a booking URL for that flight if session/option is missing.
 * For split (open-jaw / extra-hop) itineraries, omit returnDate so the fallback is a one-way; pass bookingLeg for a specific hop.
 */
export function getUniformBookingRedirectUrl(
  sessionId: string,
  optionId: string,
  optionOrParams?: BookingOptionInput | BookingRedirectParams
): string {
  const base = getApiBase();
  const params = new URLSearchParams({ sessionId, optionId });

  const bookingLeg =
    optionOrParams && 'bookingLeg' in optionOrParams && typeof optionOrParams.bookingLeg === 'number'
      ? optionOrParams.bookingLeg
      : undefined;
  if (bookingLeg != null && bookingLeg >= 0) {
    params.set('leg', String(bookingLeg));
  }

  if (optionOrParams && 'legs' in optionOrParams && optionOrParams.legs?.length) {
    const legs = optionOrParams.legs;
    const split = isSplitBookingItinerary({ legs });
    const legIdx = bookingLeg != null && bookingLeg >= 0 && bookingLeg < legs.length ? bookingLeg : 0;
    const oneWay = split || bookingLeg != null;
    const leg = legs[oneWay ? legIdx : 0];
    const seg0 = leg?.segments?.[0];
    const lastSeg = leg?.segments?.length ? leg.segments[leg.segments.length - 1] : undefined;
    if (seg0?.from?.code) params.set('origin', seg0.from.code);
    if (lastSeg?.to?.code) params.set('destination', lastSeg.to.code);
    const dep = isoDatePrefix(seg0?.departureTime);
    if (dep) params.set('departureDate', dep);
    if (!oneWay && legs.length > 1) {
      const retDep = isoDatePrefix(legs[1]?.segments?.[0]?.departureTime);
      if (retDep) params.set('returnDate', retDep);
    }
  } else if (optionOrParams && 'origin' in optionOrParams) {
    const p = optionOrParams as BookingRedirectParams;
    if (p.origin) params.set('origin', p.origin);
    if (p.destination) params.set('destination', p.destination);
    if (p.departureDate) params.set('departureDate', p.departureDate);
    if (bookingLeg == null && p.returnDate) params.set('returnDate', p.returnDate);
  }

  return `${base}${OUT_BOOKING_PATH}?${params.toString()}`;
}

/** Get provider for an option (for button label). Does not record a click. */
export async function getAffiliateProvider(
  sessionId: string,
  optionId: string
): Promise<AffiliateProviderResponse> {
  const base = getApiBase();
  const url = `${base}${AFFILIATE_BASE}/provider?sessionId=${encodeURIComponent(sessionId)}&optionId=${encodeURIComponent(optionId)}`;
  const res = await fetch(url, { method: 'GET', headers: { Accept: 'application/json' } });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}

/** Get outbound link and record click. Then open redirectUrl (e.g. Linking.openURL). */
export async function getOutboundLink(
  sessionId: string,
  optionId: string
): Promise<OutboundLinkResponse> {
  const base = getApiBase();
  const url = `${base}${AFFILIATE_BASE}/outbound-link?sessionId=${encodeURIComponent(sessionId)}&optionId=${encodeURIComponent(optionId)}`;
  const res = await fetch(url, { method: 'GET', headers: { Accept: 'application/json' } });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}

/** Get clicks summary for reporting (optional date range). */
export async function getClicksSummary(
  from?: string,
  to?: string
): Promise<ClicksSummaryResponse> {
  const base = getApiBase();
  const params = new URLSearchParams();
  if (from) params.set('from', from);
  if (to) params.set('to', to);
  const q = params.toString();
  const url = `${base}${AFFILIATE_BASE}/clicks/summary${q ? `?${q}` : ''}`;
  const res = await fetch(url, { method: 'GET', headers: { Accept: 'application/json' } });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}
