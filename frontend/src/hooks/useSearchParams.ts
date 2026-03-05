/**
 * URL search params for shareable links. Web only (uses window).
 * Params: origin, destination, departureDate, returnDate, adults, children, currency, cabinClass
 */

import { useCallback, useEffect, useState } from 'react';
import type { CreateSearchSessionRequest } from '../types';

function isWeb(): boolean {
  return typeof window !== 'undefined' && typeof window.location !== 'undefined';
}

function getParams(): URLSearchParams {
  if (!isWeb()) return new URLSearchParams();
  return new URLSearchParams(window.location.search);
}

function getParam(p: URLSearchParams, key: string): string | null {
  const v = p.get(key);
  return v && v.trim() ? v.trim() : null;
}

/** Parse URL params into partial CreateSearchSessionRequest */
export function parseSearchParamsFromUrl(): Partial<CreateSearchSessionRequest> {
  const p = getParams();
  const origin = getParam(p, 'origin');
  const destination = getParam(p, 'destination');
  const departureDate = getParam(p, 'departureDate');
  const returnDate = getParam(p, 'returnDate');
  const adults = getParam(p, 'adults');
  const children = getParam(p, 'children');
  const currency = getParam(p, 'currency');
  const cabinClass = getParam(p, 'cabinClass');
  const sessionId = getParam(p, 'sessionId');

  const params: Partial<CreateSearchSessionRequest> & { sessionId?: string } = {};
  if (sessionId) (params as any).sessionId = sessionId;
  if (origin) params.origin = origin.toUpperCase();
  if (destination) params.destination = destination.toUpperCase();
  if (departureDate) params.departureDate = departureDate;
  if (returnDate) params.returnDate = returnDate;
  if (adults) {
    const n = parseInt(adults, 10);
    if (!isNaN(n) && n >= 1) params.adults = n;
  }
  if (children) {
    const n = parseInt(children, 10);
    if (!isNaN(n) && n >= 0) params.children = n;
  }
  if (currency && ['USD', 'ILS', 'GBP', 'EUR', 'JPY'].includes(currency.toUpperCase())) {
    params.currency = currency.toUpperCase() as CreateSearchSessionRequest['currency'];
  }
  if (cabinClass && ['ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST'].includes(cabinClass.toUpperCase())) {
    params.cabinClass = cabinClass.toUpperCase() as CreateSearchSessionRequest['cabinClass'];
  }
  return params;
}

/** Build URL search string from params */
function buildSearchString(params: Partial<CreateSearchSessionRequest> & { sessionId?: string }): string {
  const p = new URLSearchParams();
  if ((params as any).sessionId) p.set('sessionId', (params as any).sessionId);
  if (params.origin) p.set('origin', params.origin);
  if (params.destination) p.set('destination', params.destination);
  if (params.departureDate) p.set('departureDate', params.departureDate);
  if (params.returnDate) p.set('returnDate', params.returnDate);
  if (params.adults != null) p.set('adults', String(params.adults));
  if (params.children != null) p.set('children', String(params.children));
  if (params.currency) p.set('currency', params.currency);
  if (params.cabinClass) p.set('cabinClass', params.cabinClass);
  return p.toString();
}

/** Update browser URL without reload */
export function updateSearchUrl(params: Partial<CreateSearchSessionRequest> & { sessionId?: string }): void {
  if (!isWeb()) return;
  const q = buildSearchString(params);
  const url = q ? `${window.location.pathname}?${q}` : window.location.pathname;
  window.history.replaceState({}, '', url);
}

/** Hook: read URL params on mount, provide updater */
export function useSearchParams(): {
  paramsFromUrl: Partial<CreateSearchSessionRequest> & { sessionId?: string };
  updateUrl: (params: Partial<CreateSearchSessionRequest> & { sessionId?: string }) => void;
} {
  const [paramsFromUrl, setParamsFromUrl] = useState<Partial<CreateSearchSessionRequest> & { sessionId?: string }>(() =>
    parseSearchParamsFromUrl()
  );

  useEffect(() => {
    if (!isWeb()) return;
    const onPopState = () => setParamsFromUrl(parseSearchParamsFromUrl());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const updateUrl = useCallback((params: Partial<CreateSearchSessionRequest> & { sessionId?: string }) => {
    updateSearchUrl(params);
    setParamsFromUrl(parseSearchParamsFromUrl());
  }, []);

  return { paramsFromUrl, updateUrl };
}
