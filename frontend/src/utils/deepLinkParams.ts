/**
 * Resolve portable deep-link params for shared results URLs.
 *
 * On iOS WebKit (incl. Chrome on iPhone), React Navigation may rewrite the
 * address bar while keeping the original query values on route.params, and
 * the page can remount (bfcache / in-app browser) after the URL was synced.
 * Never rely on a single snapshot from useSearchParams alone — merge
 * route.params (navigation state) with a fresh read of window.location, and
 * fall back to a tab-scoped sessionStorage snapshot when both were stripped.
 */

import type { SearchUrlState } from '../hooks/useSearchParams';
import { parseSearchParamsFromUrl } from '../hooks/useSearchParams';
import { readSharedLinkCache, rememberSharedLink } from './sharedLinkCache';

function trimString(v: unknown): string | undefined {
  if (typeof v !== 'string') return undefined;
  const s = v.trim();
  return s || undefined;
}

/** Merge React Navigation route params with the live URL query string. */
export function mergeDeepLinkParams(
  routeParams: Record<string, unknown> | undefined | null,
): SearchUrlState {
  const fromUrl = parseSearchParamsFromUrl();
  const fromRoute: SearchUrlState = {};

  const sessionId = trimString(routeParams?.sessionId);
  const optionId = trimString(routeParams?.optionId);
  const flightId = trimString(routeParams?.flightId);
  if (sessionId) fromRoute.sessionId = sessionId;
  if (optionId) fromRoute.optionId = optionId;
  if (flightId) fromRoute.flightId = flightId;

  const origin = trimString(routeParams?.origin);
  const destination = trimString(routeParams?.destination);
  const departureDate = trimString(routeParams?.departureDate);
  const returnDate = trimString(routeParams?.returnDate);
  const returnOrigin = trimString(routeParams?.returnOrigin);
  const returnDestination = trimString(routeParams?.returnDestination);
  if (origin) fromRoute.origin = origin.toUpperCase();
  if (destination) fromRoute.destination = destination.toUpperCase();
  if (departureDate) fromRoute.departureDate = departureDate;
  if (returnDate) fromRoute.returnDate = returnDate;
  if (returnOrigin) fromRoute.returnOrigin = returnOrigin.toUpperCase();
  if (returnDestination) fromRoute.returnDestination = returnDestination.toUpperCase();

  const adults = routeParams?.adults;
  if (typeof adults === 'number' && adults >= 1) fromRoute.adults = adults;
  else if (typeof adults === 'string') {
    const n = parseInt(adults, 10);
    if (!isNaN(n) && n >= 1) fromRoute.adults = n;
  }

  const children = routeParams?.children;
  if (typeof children === 'number' && children >= 0) fromRoute.children = children;
  else if (typeof children === 'string') {
    const n = parseInt(children, 10);
    if (!isNaN(n) && n >= 0) fromRoute.children = n;
  }

  const currency = trimString(routeParams?.currency);
  if (currency) fromRoute.currency = currency.toUpperCase() as SearchUrlState['currency'];

  const cabinClass = trimString(routeParams?.cabinClass);
  if (cabinClass) fromRoute.cabinClass = cabinClass.toUpperCase() as SearchUrlState['cabinClass'];

  // URL first for search fields; route overrides for ids Navigation kept after
  // address-bar sync. Do NOT treat route sessionId="" as wiping the URL id —
  // SearchForm shared-link recovery navigates with sessionId:'' on purpose so
  // Results reads the URL. New in-app searches ignore link ids via PENDING store.
  const merged: SearchUrlState = {
    ...fromUrl,
    ...fromRoute,
    sessionId: fromRoute.sessionId ?? fromUrl.sessionId,
    optionId: fromRoute.optionId ?? fromUrl.optionId,
    flightId: fromRoute.flightId ?? fromUrl.flightId,
  };

  if (merged.sessionId) {
    rememberSharedLink(merged);
    return merged;
  }

  const cached = readSharedLinkCache();
  if (!cached?.sessionId) return merged;

  return {
    ...cached,
    ...merged,
    sessionId: cached.sessionId,
    optionId: merged.optionId ?? cached.optionId,
    flightId: merged.flightId ?? cached.flightId,
  };
}

export function isDeepLinkDebugEnabled(): boolean {
  try {
    const g = typeof globalThis !== 'undefined' ? (globalThis as { window?: { location?: { search?: string } } }) : undefined;
    const search = g?.window?.location?.search ?? '';
    return /(?:^|[?&])debug=1(?:&|$)/.test(search);
  } catch {
    return false;
  }
}

/** Temporary diagnostics for shared-link failures (?debug=1 in the URL). */
export function logDeepLinkDiagnostics(
  label: string,
  opts: {
    routeParams?: Record<string, unknown> | null;
    merged?: SearchUrlState;
    resolvedSessionId?: string;
    storeSessionId?: string | null;
    storeStatus?: string | null;
    resultsCount?: number;
    apiStatus?: number | string;
    apiError?: string;
  },
): void {
  if (!isDeepLinkDebugEnabled() && !__DEV__) return;

  let href = '';
  let pathname = '';
  let rawSearch = '';
  let hasLocalStorage = false;
  let hasSessionStorage = false;
  try {
    const g = globalThis as { window?: { location?: { href?: string; pathname?: string; search?: string }; localStorage?: Storage; sessionStorage?: Storage } };
    href = g.window?.location?.href ?? '';
    pathname = g.window?.location?.pathname ?? '';
    rawSearch = g.window?.location?.search ?? '';
    hasLocalStorage = !!g.window?.localStorage;
    hasSessionStorage = !!g.window?.sessionStorage;
  } catch {
    // ignore
  }

  const merged = opts.merged ?? mergeDeepLinkParams(opts.routeParams);
  // eslint-disable-next-line no-console
  console.log(`[DEEP_LINK] ${label}`, {
    href,
    pathname,
    rawSearch,
    routeSessionId: trimString(opts.routeParams?.sessionId),
    routeOptionId: trimString(opts.routeParams?.optionId),
    parsedSessionId: merged.sessionId,
    parsedOptionId: merged.optionId,
    parsedFlightId: merged.flightId,
    resolvedSessionId: opts.resolvedSessionId,
    storeSessionId: opts.storeSessionId,
    storeStatus: opts.storeStatus,
    resultsCount: opts.resultsCount,
    hasLocalStorage,
    hasSessionStorage,
    apiStatus: opts.apiStatus,
    apiError: opts.apiError,
  });
}
