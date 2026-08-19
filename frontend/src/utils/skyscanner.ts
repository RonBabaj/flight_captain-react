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

  const dest = (searchParams?.destination || '').trim().toUpperCase();
  const retOrig = (searchParams?.returnOrigin || '').trim().toUpperCase();
  if (retOrig && dest && retOrig !== dest) return true;

  const orig = (searchParams?.origin || '').trim().toUpperCase();
  const retDest = (searchParams?.returnDestination || '').trim().toUpperCase();
  if (retDest && orig && retDest !== orig) return true;

  const legs = option?.legs ?? [];
  if (legs.length > 2) return true;
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

export function buildShareUrlWithOptionId(optionId: string, flightId?: string): string {
  try {
    const g = typeof globalThis !== 'undefined' ? (globalThis as { window?: { location?: { href?: string } } }) : undefined;
    const href = g?.window?.location?.href;
    if (!href) return '';
    const u = new URL(href);
    if (optionId) u.searchParams.set('optionId', optionId);
    else u.searchParams.delete('optionId');
    if (flightId) u.searchParams.set('flightId', flightId);
    else u.searchParams.delete('flightId');
    return u.toString();
  } catch {
    return '';
  }
}
