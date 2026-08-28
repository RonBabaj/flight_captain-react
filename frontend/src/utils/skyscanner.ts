/**
 * Split-itinerary helpers and share URL builder.
 */

import type { CreateSearchSessionRequest, FlightLeg, FlightOption } from '../types';

export function isoDatePrefix(iso?: string | null): string {
  if (!iso) return '';
  const m = String(iso).match(/^(\d{4}-\d{2}-\d{2})/);
  return m ? m[1] : '';
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
  const extra = (searchParams?.extraLegs ?? []).filter(
    (l) => (l.origin || '').trim() && (l.destination || '').trim(),
  );
  if (extra.length > 0) return true;

  const legs = option?.legs ?? [];
  if (legs.length > 2) return true;

  const dest = (searchParams?.destination || '').trim().toUpperCase();
  const retOrig = (searchParams?.returnOrigin || '').trim().toUpperCase();
  if (retOrig && dest && retOrig !== dest) return true;

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

/** Build a shareable URL for a specific flight including search params for session recovery. */
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
    const setOrClear = (key: string, value: string | undefined | null) => {
      if (value) u.searchParams.set(key, value);
      else u.searchParams.delete(key);
    };
    setOrClear('optionId', optionId);
    setOrClear('flightId', flightId);
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
