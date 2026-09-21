/**
 * Survive Chrome/iOS WebKit address-bar sync that strips ?sessionId=… from the
 * visible URL (and sometimes from window.location) after a shared link opens.
 * sessionStorage is tab-scoped — Incognito still works within the same tab.
 *
 * Also call captureSharedLinkFromLocation() as early as possible (module load /
 * index.html inline script) before React Navigation rewrites history.
 */

import type { SearchUrlState } from '../hooks/useSearchParams';

export const SHARED_LINK_STORAGE_KEY = 'flyfix_shared_link_v1';

function getSessionStorage(): Storage | null {
  try {
    const g = globalThis as { window?: { sessionStorage?: Storage } };
    return g.window?.sessionStorage ?? null;
  } catch {
    return null;
  }
}

export function readSharedLinkCache(): SearchUrlState | null {
  const storage = getSessionStorage();
  if (!storage) return null;
  try {
    const raw = storage.getItem(SHARED_LINK_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SearchUrlState;
    if (!parsed || typeof parsed !== 'object') return null;
    if (typeof parsed.sessionId !== 'string' || !parsed.sessionId.trim()) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Persist whatever identity we still have for this tab's shared link. */
export function rememberSharedLink(params: SearchUrlState): void {
  const sessionId = typeof params.sessionId === 'string' ? params.sessionId.trim() : '';
  if (!sessionId) return;
  const storage = getSessionStorage();
  if (!storage) return;
  try {
    const prev = readSharedLinkCache() ?? {};
    const next: SearchUrlState = {
      ...prev,
      ...params,
      sessionId,
    };
    storage.setItem(SHARED_LINK_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore quota / private-mode edge cases
  }
}

export function clearSharedLinkCache(): void {
  const storage = getSessionStorage();
  if (!storage) return;
  try {
    storage.removeItem(SHARED_LINK_STORAGE_KEY);
  } catch {
    // ignore
  }
}

/**
 * Snapshot the live window.location search into sessionStorage.
 * Safe to call repeatedly; no-ops when there is no sessionId in the URL.
 */
export function captureSharedLinkFromLocation(): void {
  try {
    const g = globalThis as { window?: { location?: { search?: string } } };
    const search = g.window?.location?.search ?? '';
    if (!search || !search.includes('sessionId=')) return;
    const p = new URLSearchParams(search);
    const sessionId = (p.get('sessionId') || '').trim();
    if (!sessionId) return;
    const payload: SearchUrlState = { sessionId };
    const optionId = p.get('optionId');
    const flightId = p.get('flightId');
    const origin = p.get('origin');
    const destination = p.get('destination');
    const departureDate = p.get('departureDate');
    const returnDate = p.get('returnDate');
    const returnOrigin = p.get('returnOrigin');
    const returnDestination = p.get('returnDestination');
    const adults = p.get('adults');
    const children = p.get('children');
    const currency = p.get('currency');
    const cabinClass = p.get('cabinClass');
    if (optionId) payload.optionId = optionId;
    if (flightId) payload.flightId = flightId;
    if (origin) payload.origin = origin.toUpperCase();
    if (destination) payload.destination = destination.toUpperCase();
    if (departureDate) payload.departureDate = departureDate;
    if (returnDate) payload.returnDate = returnDate;
    if (returnOrigin) payload.returnOrigin = returnOrigin.toUpperCase();
    if (returnDestination) payload.returnDestination = returnDestination.toUpperCase();
    if (adults) {
      const n = parseInt(adults, 10);
      if (!isNaN(n) && n >= 1) payload.adults = n;
    }
    if (children) {
      const n = parseInt(children, 10);
      if (!isNaN(n) && n >= 0) payload.children = n;
    }
    if (currency) payload.currency = currency.toUpperCase() as SearchUrlState['currency'];
    if (cabinClass) payload.cabinClass = cabinClass.toUpperCase() as SearchUrlState['cabinClass'];
    rememberSharedLink(payload);
  } catch {
    // ignore
  }
}

// Seed stash as soon as this module is evaluated — before NavigationContainer mounts.
captureSharedLinkFromLocation();
