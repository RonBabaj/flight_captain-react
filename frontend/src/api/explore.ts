import type { ExploreDestination } from '../types';
import { apiGet } from './client';

const EXPLORE_PATH = '/api/explore';

export interface GetExploreDestinationsParams {
  origin: string;
  /** Single trip window (main search “Anywhere”). */
  departureDate?: string;
  returnDate?: string;
  /** Monthly-deals semantics: cheapest round-trip of `durationDays` across all bookable days in the month. */
  year?: number;
  month?: number;
  durationDays?: number;
  children?: number;
  nonStop?: boolean;
  currency?: string;
  adults?: number;
}

export async function getExploreDestinations(
  params: GetExploreDestinationsParams
): Promise<ExploreDestination[]> {
  const q = new URLSearchParams({ origin: params.origin });
  const useMonth =
    params.year != null &&
    params.month != null &&
    params.durationDays != null &&
    params.year >= 2000 &&
    params.month >= 1 &&
    params.month <= 12 &&
    params.durationDays >= 1;

  if (useMonth) {
    q.set('year', String(params.year));
    q.set('month', String(params.month));
    q.set('durationDays', String(params.durationDays));
    if (params.children != null && params.children > 0) {
      q.set('children', String(params.children));
    }
    if (params.nonStop === true) {
      q.set('nonStop', 'true');
    }
  } else {
    if (params.departureDate) q.set('departureDate', params.departureDate);
    if (params.returnDate) q.set('returnDate', params.returnDate);
  }
  if (params.currency) q.set('currency', params.currency);
  if (params.adults != null && params.adults >= 1) q.set('adults', String(params.adults));
  const res = await apiGet<{ destinations: ExploreDestination[] }>(`${EXPLORE_PATH}?${q.toString()}`);
  return res.destinations ?? [];
}
