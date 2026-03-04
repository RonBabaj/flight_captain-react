/**
 * Cache last search params in localStorage (web) so we can restore on load.
 * No API calls; only persists/reads the form state.
 */

import type { CreateSearchSessionRequest } from '../types';

const KEY = 'flight_captain_last_search';

function getStorage(): Storage | null {
  try {
    if (typeof globalThis !== 'undefined' && (globalThis as any).window?.localStorage)
      return (globalThis as any).window.localStorage;
  } catch {}
  return null;
}

export function getCachedSearch(): Partial<CreateSearchSessionRequest> | null {
  const storage = getStorage();
  if (!storage) return null;
  try {
    const raw = storage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CreateSearchSessionRequest>;
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

export function setCachedSearch(params: CreateSearchSessionRequest): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(KEY, JSON.stringify(params));
  } catch {
    // ignore
  }
}
