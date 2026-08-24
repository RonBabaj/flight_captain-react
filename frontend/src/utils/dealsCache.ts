/**
 * Persist monthly-deals search params and results across browser sessions.
 * Params + last results live in localStorage (not sessionStorage) so returning
 * to /monthly-deals/results after a tab close still restores the calendar.
 */

import type { MonthDealsResponse } from '../types';

const PARAMS_KEY = 'flight_captain_deals_params';
const RESULTS_KEY = 'flight_captain_deals_results';
/** Legacy key — migrated to localStorage on read. */
const LEGACY_SESSION_PARAMS_KEY = 'flight_captain_deals_params';

const DEFAULT_RESULTS_TTL_MS = 24 * 60 * 60 * 1000;

export interface DealsParams {
  origin: string;
  destination: string;
  year: number;
  month: number;
  durationDays: number;
  adults: number;
  children: number;
  nonStop: boolean;
}

interface CachedDealsResults {
  params: DealsParams;
  data: MonthDealsResponse;
  at: number;
}

function getLocalStorage(): Storage | null {
  try {
    if (typeof globalThis !== 'undefined' && (globalThis as any).window?.localStorage) {
      return (globalThis as any).window.localStorage;
    }
  } catch {
    // ignore
  }
  return null;
}

function getSessionStorage(): Storage | null {
  try {
    if (typeof globalThis !== 'undefined' && (globalThis as any).window?.sessionStorage) {
      return (globalThis as any).window.sessionStorage;
    }
  } catch {
    // ignore
  }
  return null;
}

function resultsTtlMs(): number {
  return DEFAULT_RESULTS_TTL_MS;
}

export function dealsParamsFingerprint(params: DealsParams): string {
  return [
    params.origin.trim().toUpperCase(),
    params.destination.trim().toUpperCase(),
    params.year,
    params.month,
    params.durationDays,
    params.adults,
    params.children,
    params.nonStop ? '1' : '0',
  ].join('|');
}

function normalizeDealsParams(raw: Partial<DealsParams> | null | undefined): DealsParams | null {
  if (!raw?.origin?.trim() || !raw?.destination?.trim()) return null;
  return {
    origin: raw.origin.trim().toUpperCase(),
    destination: raw.destination.trim().toUpperCase(),
    year: Number(raw.year) || new Date().getFullYear(),
    month: Number(raw.month) || new Date().getMonth() + 1,
    durationDays: Number(raw.durationDays) || 7,
    adults: Number(raw.adults) >= 1 ? Number(raw.adults) : 1,
    children: Number(raw.children) >= 0 ? Number(raw.children) : 0,
    nonStop: raw.nonStop === true,
  };
}

/** Migrate legacy sessionStorage params into localStorage once. */
function migrateLegacySessionParams(): void {
  const local = getLocalStorage();
  const session = getSessionStorage();
  if (!local || !session) return;
  try {
    if (local.getItem(PARAMS_KEY)) return;
    const raw = session.getItem(LEGACY_SESSION_PARAMS_KEY);
    if (!raw) return;
    local.setItem(PARAMS_KEY, raw);
    session.removeItem(LEGACY_SESSION_PARAMS_KEY);
  } catch {
    // ignore
  }
}

export function getPendingDealsParams(): DealsParams | null {
  migrateLegacySessionParams();
  const storage = getLocalStorage();
  if (!storage) return null;
  try {
    const raw = storage.getItem(PARAMS_KEY);
    if (!raw) return null;
    return normalizeDealsParams(JSON.parse(raw) as DealsParams);
  } catch {
    return null;
  }
}

export function setPendingDealsParams(params: DealsParams): void {
  const normalized = normalizeDealsParams(params);
  if (!normalized) return;
  const storage = getLocalStorage();
  if (!storage) return;
  try {
    storage.setItem(PARAMS_KEY, JSON.stringify(normalized));
  } catch {
    // ignore
  }
}

/** @deprecated Params are kept until replaced; clearing is rarely needed. */
export function clearPendingDealsParams(): void {
  const storage = getLocalStorage();
  if (!storage) return;
  try {
    storage.removeItem(PARAMS_KEY);
    storage.removeItem(RESULTS_KEY);
  } catch {
    // ignore
  }
}

export function getCachedDealsResults(params: DealsParams): MonthDealsResponse | null {
  const storage = getLocalStorage();
  if (!storage) return null;
  try {
    const raw = storage.getItem(RESULTS_KEY);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CachedDealsResults;
    if (!entry?.data || !entry.params) return null;
    if (dealsParamsFingerprint(entry.params) !== dealsParamsFingerprint(params)) return null;
    if (Date.now() - entry.at > resultsTtlMs()) return null;
    return entry.data;
  } catch {
    return null;
  }
}

export function setCachedDealsResults(params: DealsParams, data: MonthDealsResponse): void {
  const normalized = normalizeDealsParams(params);
  if (!normalized || !data) return;
  const storage = getLocalStorage();
  if (!storage) return;
  try {
    const entry: CachedDealsResults = { params: normalized, data, at: Date.now() };
    storage.setItem(RESULTS_KEY, JSON.stringify(entry));
    setPendingDealsParams(normalized);
  } catch {
    // ignore
  }
}

export function paramsMatchSavedData(params: DealsParams, data: MonthDealsResponse | null): boolean {
  if (!data) return false;
  const o = params.origin.trim().toUpperCase();
  const d = params.destination.trim().toUpperCase();
  const route = data.route;
  const dataOrigin = route?.origin?.code?.toUpperCase?.() ?? '';
  const dataDest = route?.destination?.code?.toUpperCase?.() ?? '';
  return (
    dataOrigin === o &&
    dataDest === d &&
    data.year === params.year &&
    data.month === params.month
  );
}
