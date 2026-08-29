/**
 * Flight search session API. Endpoints per backend contract.
 * Session results are cached in memory and localStorage for persistence across refresh.
 */

import {
  CreateSearchSessionRequest,
  SearchSession,
  SearchSessionResultsResponse,
} from '../types';
import { getRuntimeConfig } from '../config/runtimeConfigStore';
import { sanitizeStandardSearchPayload } from '../utils/skyscanner';
import { apiGet, apiPost } from './client';

const SESSIONS_PATH = '/api/search/sessions';

interface CachedResult {
  data: SearchSessionResultsResponse;
  at: number;
}

const resultsCache = new Map<string, CachedResult>();

const STORAGE_PREFIX = 'flight_captain_results_';

function getStorage(): Storage | null {
  try {
    if (typeof globalThis !== 'undefined' && (globalThis as any).window?.localStorage)
      return (globalThis as any).window.localStorage;
  } catch {}
  return null;
}

function getFromStorage(sessionId: string): SearchSessionResultsResponse | null {
  const storage = getStorage();
  if (!storage) return null;
  try {
    const raw = storage.getItem(STORAGE_PREFIX + sessionId);
    if (!raw) return null;
    const { data, at }: { data: SearchSessionResultsResponse; at: number } = JSON.parse(raw);
    if (!data || Date.now() - at > getRuntimeConfig().resultsStorageTtlMs) return null;
    return data;
  } catch {
    return null;
  }
}

function setToStorage(sessionId: string, data: SearchSessionResultsResponse): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(STORAGE_PREFIX + sessionId, JSON.stringify({ data, at: Date.now() }));
  } catch {}
}

/** Create a new search session. */
export async function createSearchSession(
  params: CreateSearchSessionRequest
): Promise<SearchSession> {
  const session = await apiPost<SearchSession>(SESSIONS_PATH, sanitizeStandardSearchPayload(params));
  return session;
}

function paramsMatch(
  cached: CreateSearchSessionRequest | undefined,
  expected: Partial<CreateSearchSessionRequest> | null | undefined
): boolean {
  if (!expected || !cached) return true;
  const keys: (keyof CreateSearchSessionRequest)[] = [
    'origin', 'destination', 'departureDate', 'returnDate',
    'returnOrigin', 'returnDestination',
    'adults', 'children', 'infants',
  ];
  for (const k of keys) {
    const c = cached[k];
    const e = expected[k];
    if (e === undefined) continue;
    if (String(c ?? '') !== String(e ?? '')) return false;
  }
  if (expected.extraLegs !== undefined) {
    const extraKey = (legs?: { origin?: string; destination?: string; date?: string }[]) =>
      (legs ?? []).map((l) => `${l.origin ?? ''}|${l.destination ?? ''}|${l.date ?? ''}`).join(';');
    if (extraKey(cached.extraLegs) !== extraKey(expected.extraLegs)) return false;
  }
  return true;
}

/** Get session status and results; optional sinceVersion for incremental. Uses memory + localStorage cache.
 * Only returns cached data when paramsMatch is provided and matches the cached session params. */
export async function getSearchSessionResults(
  sessionId: string,
  sinceVersion?: number,
  paramsMatchExpected?: Partial<CreateSearchSessionRequest> | null
): Promise<SearchSessionResultsResponse> {
  const isInitialLoad = sinceVersion == null || sinceVersion === 0;
  const now = Date.now();

  const memHit = isInitialLoad ? resultsCache.get(sessionId) : undefined;
  if (memHit && now - memHit.at < getRuntimeConfig().resultsCacheTtlMs) {
    if (!paramsMatch(memHit.data.session?.params, paramsMatchExpected)) return await fetchFresh(sessionId, sinceVersion);
    return memHit.data;
  }

  const storageHit = isInitialLoad ? getFromStorage(sessionId) : null;
  if (storageHit) {
    if (!paramsMatch(storageHit.session?.params, paramsMatchExpected)) return await fetchFresh(sessionId, sinceVersion);
    resultsCache.set(sessionId, { data: storageHit, at: now });
    return storageHit;
  }

  return fetchFresh(sessionId, sinceVersion);
}

async function fetchFresh(
  sessionId: string,
  sinceVersion?: number
): Promise<SearchSessionResultsResponse> {
  const query = sinceVersion != null ? `?sinceVersion=${sinceVersion}` : '';
  const data = await apiGet<SearchSessionResultsResponse>(
    `${SESSIONS_PATH}/${sessionId}${query}`
  );
  const isInitialLoad = sinceVersion == null || sinceVersion === 0;
  resultsCache.set(sessionId, { data, at: Date.now() });
  if (isInitialLoad && data.results?.length) {
    setToStorage(sessionId, data);
  }
  return data;
}

/** Cancel search session (optional, MVP+). */
export async function cancelSearchSession(sessionId: string): Promise<void> {
  await apiPost(`${SESSIONS_PATH}/${sessionId}/cancel`, {});
}
