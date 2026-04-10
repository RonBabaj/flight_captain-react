import type { ExploreDestination } from '../types';
import { apiGet } from './client';

const EXPLORE_PATH = '/api/explore';

export interface GetExploreDestinationsParams {
  /** Required for a new search; omit when continuing with `sessionId`. */
  origin?: string;
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
  /** Pagination / continuation */
  sessionId?: string;
  offset?: number;
  limit?: number;
  /** Fast path: cache + estimates only (no live GF2). */
  prefetch?: boolean;
  /** Fetch next batch of live prices for this session (max ~12 GF2 calls). */
  live?: boolean;
}

export interface ExploreResponse {
  destinations: ExploreDestination[];
  sessionId: string;
  total: number;
  offset: number;
  limit: number;
  hasMore: boolean;
  /** Some rows still use estimates (not yet replaced by cache/live). */
  partialResults?: boolean;
  /** More live GF2 batches allowed for this session. */
  liveRefreshAvailable?: boolean;
}

export async function getExploreDestinations(
  params: GetExploreDestinationsParams
): Promise<ExploreResponse> {
  if (params.sessionId) {
    const q = new URLSearchParams({ sessionId: params.sessionId });
    q.set('offset', String(params.offset ?? 0));
    q.set('limit', String(params.limit ?? 10));
    if (params.live) q.set('live', 'true');
    const res = await apiGet<ExploreResponse>(`${EXPLORE_PATH}?${q.toString()}`);
    return {
      destinations: res.destinations ?? [],
      sessionId: res.sessionId ?? params.sessionId,
      total: res.total ?? 0,
      offset: res.offset ?? 0,
      limit: res.limit ?? 10,
      hasMore: res.hasMore ?? false,
      partialResults: res.partialResults,
      liveRefreshAvailable: res.liveRefreshAvailable,
    };
  }

  const origin = params.origin?.trim();
  if (!origin) {
    throw new Error('origin is required for a new explore search');
  }

  const q = new URLSearchParams({ origin });
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
  q.set('offset', String(params.offset ?? 0));
  q.set('limit', String(params.limit ?? 10));
  if (params.prefetch) q.set('prefetch', 'true');

  const res = await apiGet<ExploreResponse>(`${EXPLORE_PATH}?${q.toString()}`);
  return {
    destinations: res.destinations ?? [],
    sessionId: res.sessionId ?? '',
    total: res.total ?? 0,
    offset: res.offset ?? 0,
    limit: res.limit ?? 10,
    hasMore: res.hasMore ?? false,
    partialResults: res.partialResults,
    liveRefreshAvailable: res.liveRefreshAvailable,
  };
}
