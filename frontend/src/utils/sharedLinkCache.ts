/**
 * Survive Chrome/iOS WebKit address-bar sync that strips ?sessionId=… from the
 * visible URL (and sometimes rewrites the path to `/`) after a shared link opens.
 * sessionStorage is tab-scoped — Incognito still works within the same tab.
 */

import type { SearchUrlState } from '../hooks/useSearchParams';

export const SHARED_LINK_STORAGE_KEY = 'flyfix_shared_link_v1';
export const BOOT_HREF_STORAGE_KEY = 'flyfix_boot_href_v1';

export type SharedLinkCache = SearchUrlState & {
  /** Path when the link was opened, e.g. /search/results */
  pathname?: string;
};

function getSessionStorage(): Storage | null {
  try {
    const g = globalThis as { window?: { sessionStorage?: Storage } };
    return g.window?.sessionStorage ?? null;
  } catch {
    return null;
  }
}

export function readBootHref(): string | null {
  const storage = getSessionStorage();
  if (!storage) return null;
  try {
    const href = storage.getItem(BOOT_HREF_STORAGE_KEY);
    return href && href.trim() ? href.trim() : null;
  } catch {
    return null;
  }
}

export function rememberBootHref(href: string): void {
  const storage = getSessionStorage();
  if (!storage) return;
  try {
    if (href && href.includes('sessionId=')) {
      storage.setItem(BOOT_HREF_STORAGE_KEY, href);
    }
  } catch {
    // ignore
  }
}

export function readSharedLinkCache(): SharedLinkCache | null {
  const storage = getSessionStorage();
  if (!storage) return null;
  try {
    const raw = storage.getItem(SHARED_LINK_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SharedLinkCache;
    if (!parsed || typeof parsed !== 'object') return null;
    if (typeof parsed.sessionId !== 'string' || !parsed.sessionId.trim()) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Persist whatever identity we still have for this tab's shared link. */
export function rememberSharedLink(params: SharedLinkCache): void {
  const sessionId = typeof params.sessionId === 'string' ? params.sessionId.trim() : '';
  if (!sessionId) return;
  const storage = getSessionStorage();
  if (!storage) return;
  try {
    const prev = readSharedLinkCache() ?? {};
    const next: SharedLinkCache = {
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
    storage.removeItem(BOOT_HREF_STORAGE_KEY);
  } catch {
    // ignore
  }
}

/**
 * Snapshot the live window.location into sessionStorage.
 * Safe to call repeatedly; no-ops when there is no sessionId in the URL.
 */
export function captureSharedLinkFromLocation(): void {
  try {
    const g = globalThis as {
      window?: { location?: { href?: string; search?: string; pathname?: string } };
    };
    const loc = g.window?.location;
    const search = loc?.search ?? '';
    if (!search || !search.includes('sessionId=')) return;
    if (loc?.href) rememberBootHref(loc.href);
    const p = new URLSearchParams(search);
    const sessionId = (p.get('sessionId') || '').trim();
    if (!sessionId) return;
    const payload: SharedLinkCache = {
      sessionId,
      pathname: loc?.pathname || undefined,
    };
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

/** Prefer Results path under Search or Dynamic Destinations when Chrome wiped us to `/`. */
export function resultsPathFromSharedCache(cached?: SharedLinkCache | null): string {
  const path = (cached?.pathname || '').toLowerCase();
  if (path.includes('dynamic-destinations')) return '/dynamic-destinations/results';
  return '/search/results';
}

// Seed stash as soon as this module is evaluated — before NavigationContainer mounts.
captureSharedLinkFromLocation();
