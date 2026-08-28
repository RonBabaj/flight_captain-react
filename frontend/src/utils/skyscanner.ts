/**
 * Skyscanner prefill URLs and helpers for split (open-jaw / extra-hop) itineraries.
 * Dynamic Destinations combine separate one-way tickets; each hop needs its own search.
 */

import type { CreateSearchSessionRequest, FlightLeg, FlightOption } from '../types';

export function isoDatePrefix(iso?: string | null): string {
  if (!iso) return '';
  const m = String(iso).match(/^(\d{4}-\d{2}-\d{2})/);
  return m ? m[1] : '';
}

/** YYYY-MM-DD → YYMMDD for Skyscanner path segments. */
export function isoToSkyscannerDate(iso?: string | null): string {
  const day = isoDatePrefix(iso);
  if (day.length < 10) return '';
  return day.slice(2, 4) + day.slice(5, 7) + day.slice(8, 10);
}

function skyCode(code?: string | null): string {
  const c = (code || '').trim().toLowerCase();
  return c || 'any';
}

export interface SkyscannerPrefillParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  cabinClass?: string;
  adults?: number;
  children?: number;
}

/** Prefill a Skyscanner search. Omitting returnDate yields a true one-way (rtn=0). */
export function buildSkyscannerPrefillURL(p: SkyscannerPrefillParams): string {
  const origin = skyCode(p.origin);
  const dest = skyCode(p.destination);
  const outbound = isoToSkyscannerDate(p.departureDate) || 'any';
  const inbound = isoToSkyscannerDate(p.returnDate);
  const path = inbound
    ? `https://www.skyscanner.net/transport/flights/${origin}/${dest}/${outbound}/${inbound}/`
    : `https://www.skyscanner.net/transport/flights/${origin}/${dest}/${outbound}/`;

  const params = new URLSearchParams();
  const adults = p.adults && p.adults >= 1 ? p.adults : 1;
  params.set('adultsv2', String(adults));
  if (p.cabinClass) params.set('cabinclass', p.cabinClass.toLowerCase());
  if (p.children && p.children > 0) params.set('childrenv2', String(p.children));
  params.set('inboundaltsenabled', 'false');
  params.set('outboundaltsenabled', 'false');
  params.set('preferdirects', 'false');
  params.set('ref', 'flyfix');
  params.set('rtn', inbound ? '1' : '0');
  return `${path}?${params.toString()}`;
}

/** Build a Skyscanner prefill URL for a whole option (round-trip or one-way). */
export function buildSkyscannerPrefillFromOption(
  option: FlightOption,
  searchParams?: Partial<CreateSearchSessionRequest> | null,
): string | null {
  const legs = option.legs ?? [];
  if (!legs.length) return null;
  const outLeg = legs[0];
  const outFirst = firstSeg(outLeg);
  const outLast = lastSeg(outLeg);
  const origin = (outFirst?.from?.code || searchParams?.origin || '').toUpperCase();
  const destination = (outLast?.to?.code || searchParams?.destination || '').toUpperCase();
  const departureDate = isoDatePrefix(outFirst?.departureTime) || searchParams?.departureDate || '';
  if (!origin || !destination || !departureDate) return null;
  let returnDate: string | undefined;
  if (!isSplitBookingItinerary(option, searchParams) && legs.length > 1) {
    returnDate = isoDatePrefix(firstSeg(legs[1])?.departureTime) || searchParams?.returnDate || undefined;
  }
  return buildSkyscannerPrefillURL({
    origin,
    destination,
    departureDate,
    returnDate,
    cabinClass: searchParams?.cabinClass,
    adults: searchParams?.adults,
    children: searchParams?.children,
  });
}

function firstSeg(leg?: FlightLeg) {
  return leg?.segments?.[0];
}

function lastSeg(leg?: FlightLeg) {
  const segs = leg?.segments;
  return segs?.length ? segs[segs.length - 1] : undefined;
}

export function isSplitBookingItinerary(
  option?: { legs?: FlightLeg[] } | null,
  searchParams?: Partial<CreateSearchSessionRequest> | null,
): boolean {
  // Extra hops (3+ legs) = server-combined separate one-way tickets.
  const extra = (searchParams?.extraLegs ?? []).filter(
    (l) => (l.origin || '').trim() && (l.destination || '').trim(),
  );
  if (extra.length > 0) return true;

  const legs = option?.legs ?? [];
  if (legs.length > 2) return true;

  // Open-jaw: return departs from a different city than the outbound destination.
  // Cannot be booked as a single round-trip — needs two separate one-way searches.
  const dest = (searchParams?.destination || '').trim().toUpperCase();
  const retOrig = (searchParams?.returnOrigin || '').trim().toUpperCase();
  if (retOrig && dest && retOrig !== dest) return true;

  // Detect from legs when search params not available.
  if (legs.length === 2) {
    const outDest = (lastSeg(legs[0])?.to?.code || '').toUpperCase();
    const inOrig = (firstSeg(legs[1])?.from?.code || '').toUpperCase();
    if (outDest && inOrig && outDest !== inOrig) return true;
  }

  return false;
}

export interface BookingHop {
  origin: string;
  destination: string;
  date: string;
  legIndex: number;
}

export function bookingHopsFromOption(option: FlightOption): BookingHop[] {
  const hops: BookingHop[] = [];
  (option.legs ?? []).forEach((leg, i) => {
    const first = firstSeg(leg);
    const last = lastSeg(leg);
    const origin = (first?.from?.code || '').toUpperCase();
    const destination = (last?.to?.code || '').toUpperCase();
    const date = isoDatePrefix(first?.departureTime);
    if (origin && destination && date) {
      hops.push({ origin, destination, date, legIndex: i });
    }
  });
  return hops;
}

/**
 * Build a shareable URL for a specific flight. Always includes the search params
 * (origin, destination, dates, cabin, pax) so a recipient on a fresh device can
 * re-run the search if the session has expired. Falls back to window.location for
 * params not explicitly provided.
 */
export function buildShareUrlWithOptionId(
  optionId: string,
  flightId?: string,
  searchParams?: Partial<CreateSearchSessionRequest> & { sessionId?: string },
): string {
  try {
    const g = typeof globalThis !== 'undefined' ? (globalThis as { window?: { location?: { href?: string; origin?: string; pathname?: string } } }) : undefined;
    const href = g?.window?.location?.href;
    if (!href) return '';
    const u = new URL(href);
    // setOrClear: the shared URL must describe EXACTLY the current search. Stale
    // address-bar leftovers (an old returnDate on a one-way, a previous session's
    // id) must be dropped, not silently kept — they made recipients re-run a
    // different search than the one being shared.
    const setOrClear = (key: string, value: string | undefined | null) => {
      if (value) u.searchParams.set(key, value);
      else u.searchParams.delete(key);
    };
    setOrClear('optionId', optionId);
    setOrClear('flightId', flightId);
    // Bake search params into the URL so the recipient can always reconstruct the search.
    if (searchParams) {
      setOrClear('sessionId', searchParams.sessionId);
      setOrClear('origin', searchParams.origin);
      setOrClear('destination', searchParams.destination);
      setOrClear('departureDate', searchParams.departureDate);
      setOrClear('returnDate', searchParams.returnDate);
      setOrClear('returnOrigin', searchParams.returnOrigin);
      setOrClear('returnDestination', searchParams.returnDestination);
      setOrClear('adults', searchParams.adults != null ? String(searchParams.adults) : undefined);
      setOrClear('children', searchParams.children != null ? String(searchParams.children) : undefined);
      setOrClear('currency', searchParams.currency);
      setOrClear('cabinClass', searchParams.cabinClass);
      setOrClear(
        'extra',
        searchParams.extraLegs?.length
          ? searchParams.extraLegs
              .map((l) => `${(l.origin || '').toUpperCase()}:${(l.destination || '').toUpperCase()}:${l.date || ''}`)
              .join('|')
          : undefined,
      );
    }
    return u.toString();
  } catch {
    return '';
  }
}
