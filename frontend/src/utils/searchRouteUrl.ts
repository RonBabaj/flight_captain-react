import type { CreateSearchSessionRequest } from '../types';
import { buildSearchString, type SearchUrlState } from '../hooks/useSearchParams';
import { openUrlInNewTab } from './openUrl';

export type FlyFixLegSearchParams = Pick<
  CreateSearchSessionRequest,
  'origin' | 'destination' | 'departureDate' | 'adults' | 'children' | 'currency' | 'cabinClass'
>;

/** Shareable Fly-Fix one-way results URL for a single leg (opens in a new tab on web). */
export function buildFlyFixSearchResultsUrl(
  params: FlyFixLegSearchParams,
  options?: { baseOrigin?: string },
): string {
  const state: SearchUrlState = {
    origin: (params.origin || '').trim().toUpperCase(),
    destination: (params.destination || '').trim().toUpperCase(),
    departureDate: params.departureDate,
    adults: params.adults ?? 1,
    children: params.children ?? 0,
    currency: params.currency,
    cabinClass: params.cabinClass,
  };
  const q = buildSearchString(state);
  let baseOrigin = options?.baseOrigin;
  if (!baseOrigin && typeof window !== 'undefined') {
    baseOrigin = window.location.origin;
  }
  if (!baseOrigin) {
    baseOrigin = 'https://fly-fix.com';
  }
  return `${baseOrigin}/search/results?${q}`;
}

/** Open a one-way Fly-Fix search for a positioning leg in a new browser tab. */
export async function openFlyFixLegSearchInNewTab(params: FlyFixLegSearchParams): Promise<boolean> {
  return openUrlInNewTab(buildFlyFixSearchResultsUrl(params));
}
