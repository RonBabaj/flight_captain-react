/**
 * URL search params for shareable links. Web only (uses window).
 * Params: origin, destination, departureDate, returnDate, adults, children, currency, cabinClass,
 * sessionId, optionId (opened flight on results).
 */

import { useCallback, useEffect, useState } from 'react';
import type { CreateSearchSessionRequest } from '../types';

export type SearchUrlState = Partial<CreateSearchSessionRequest> & {
  sessionId?: string;
  optionId?: string;
  /** Stable canonical fingerprint of the shared flight — survives session re-creation */
  flightId?: string;
};

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

/** Parse URL params into shareable search state */
export function parseSearchParamsFromUrl(): SearchUrlState {
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
  const optionId = getParam(p, 'optionId');
  const flightId = getParam(p, 'flightId');
  const returnOrigin = getParam(p, 'returnOrigin');
  const returnDestination = getParam(p, 'returnDestination');
  const extra = getParam(p, 'extra');

  const params: SearchUrlState = {};
  if (sessionId) params.sessionId = sessionId;
  if (optionId) params.optionId = optionId;
  if (flightId) params.flightId = flightId;
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
  if (returnOrigin) params.returnOrigin = returnOrigin.toUpperCase();
  if (returnDestination) params.returnDestination = returnDestination.toUpperCase();
  if (extra) {
    const legs = extra.split('|').map((part) => {
      const [o, d, date] = part.split(':');
      return {
        origin: (o || '').toUpperCase(),
        destination: (d || '').toUpperCase(),
        date: date || '',
      };
    }).filter((l) => l.origin || l.destination || l.date);
    if (legs.length) params.extraLegs = legs;
  }
  return params;
}

/** Build URL search string from params */
export function buildSearchString(params: SearchUrlState): string {
  const p = new URLSearchParams();
  if (params.sessionId) p.set('sessionId', params.sessionId);
  if (params.optionId) p.set('optionId', params.optionId);
  if (params.flightId) p.set('flightId', params.flightId);
  if (params.origin) p.set('origin', params.origin);
  if (params.destination) p.set('destination', params.destination);
  if (params.departureDate) p.set('departureDate', params.departureDate);
  if (params.returnDate) p.set('returnDate', params.returnDate);
  if (params.adults != null) p.set('adults', String(params.adults));
  if (params.children != null) p.set('children', String(params.children));
  if (params.currency) p.set('currency', params.currency);
  if (params.cabinClass) p.set('cabinClass', params.cabinClass);
  if (params.returnOrigin) p.set('returnOrigin', params.returnOrigin);
  if (params.returnDestination) p.set('returnDestination', params.returnDestination);
  if (params.extraLegs?.length) {
    p.set(
      'extra',
      params.extraLegs
        .map((l) => `${(l.origin || '').toUpperCase()}:${(l.destination || '').toUpperCase()}:${l.date || ''}`)
        .join('|'),
    );
  }
  return p.toString();
}

/** Update browser URL without reload */
export function updateSearchUrl(params: SearchUrlState): void {
  if (!isWeb()) return;
  const q = buildSearchString(params);
  const url = q ? `${window.location.pathname}?${q}` : window.location.pathname;
  window.history.replaceState({}, '', url);
}

/** Hook: read URL params on mount, provide updater */
export function useSearchParams(): {
  paramsFromUrl: SearchUrlState;
  updateUrl: (params: SearchUrlState) => void;
} {
  const [paramsFromUrl, setParamsFromUrl] = useState<SearchUrlState>(() =>
    parseSearchParamsFromUrl()
  );

  useEffect(() => {
    if (!isWeb()) return;
    const onPopState = () => setParamsFromUrl(parseSearchParamsFromUrl());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const updateUrl = useCallback((params: SearchUrlState) => {
    updateSearchUrl(params);
    setParamsFromUrl(parseSearchParamsFromUrl());
  }, []);

  return { paramsFromUrl, updateUrl };
}
