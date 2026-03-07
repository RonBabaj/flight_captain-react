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

/**
 * URL for the uniform booking redirect. Open this URL (e.g. Linking.openURL); backend will 302 to the actual booking page and record the click.
 */
export function getUniformBookingRedirectUrl(sessionId: string, optionId: string): string {
  const base = getApiBase();
  const params = new URLSearchParams({ sessionId, optionId });
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
