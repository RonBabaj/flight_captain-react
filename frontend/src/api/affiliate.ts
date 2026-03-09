/**
 * Affiliate outbound-link and provider API. No payment; user books on external site.
 */

import { getApiBase } from './client';

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
}

/**
 * URL for the uniform booking redirect. Open this URL (e.g. Linking.openURL); backend will 302 to the actual booking page and record the click.
 * Pass optionOrParams so the backend can redirect to a Skyscanner search for that flight if session/option is missing.
 */
export function getUniformBookingRedirectUrl(
  sessionId: string,
  optionId: string,
  optionOrParams?: { legs?: Array<{ segments: Array<{ from?: { code?: string }; to?: { code?: string }; departureTime?: string; arrivalTime?: string }> }> } | BookingRedirectParams
): string {
  const base = getApiBase();
  const params = new URLSearchParams({ sessionId, optionId });

  if (optionOrParams?.legs?.length) {
    const leg0 = optionOrParams.legs[0];
    const seg0 = leg0?.segments?.[0];
    const lastSeg0 = leg0?.segments?.length ? leg0.segments[leg0.segments.length - 1] : undefined;
    if (seg0?.from?.code) params.set('origin', seg0.from.code);
    if (lastSeg0?.to?.code) params.set('destination', lastSeg0.to.code);
    if (seg0?.departureTime) {
      try {
        params.set('departureDate', new Date(seg0.departureTime).toISOString().slice(0, 10));
      } catch {
        // ignore
      }
    }
    if (optionOrParams.legs.length > 1) {
      const leg1 = optionOrParams.legs[1];
      const lastSeg1 = leg1?.segments?.length ? leg1.segments[leg1.segments.length - 1] : undefined;
      if (lastSeg1?.arrivalTime) {
        try {
          params.set('returnDate', new Date(lastSeg1.arrivalTime).toISOString().slice(0, 10));
        } catch {
          // ignore
        }
      }
    }
  } else if (optionOrParams && 'origin' in optionOrParams) {
    const p = optionOrParams as BookingRedirectParams;
    if (p.origin) params.set('origin', p.origin);
    if (p.destination) params.set('destination', p.destination);
    if (p.departureDate) params.set('departureDate', p.departureDate);
    if (p.returnDate) params.set('returnDate', p.returnDate);
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
