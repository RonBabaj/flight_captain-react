/**
 * Skyscanner prefill URLs and helpers for split (open-jaw / extra-hop) itineraries.
 * Dynamic Destinations combine separate one-way tickets; each hop needs its own search.
 *
 * Tier-1 "specific flight" prefill: airline filter + departure time window (±2h).
 * @see https://developers.skyscanner.net/docs/referrals/flights-parameters
 */

import type { CreateSearchSessionRequest, FlightLeg, FlightOption, FlightSegment } from '../types';

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

/** Minutes from local-midnight for Skyscanner departure-times filter (e.g. 14:30 → 870). */
export function minutesFromDeparture(iso?: string | null): number | null {
  if (!iso) return null;
  const ms = new Date(iso).getTime();
  if (!Number.isFinite(ms)) return null;
  const d = new Date(ms);
  return d.getHours() * 60 + d.getMinutes();
}

/** Skyscanner departure-times segment: minutes-from-midnight range, default ±2 hours. */
export function skyscannerDepartureTimeRange(iso?: string | null, windowMinutes = 120): string {
  const center = minutesFromDeparture(iso);
  if (center == null) return '';
  const start = Math.max(0, center - windowMinutes);
  const end = Math.min(24 * 60 - 1, center + windowMinutes);
  return `${start}-${end}`;
}

function segmentCarrierCode(seg: FlightSegment): string {
  const op = seg.operatingCarrier?.code?.trim();
  if (op) return op.toUpperCase();
  return (seg.marketingCarrier?.code || '').trim().toUpperCase();
}

/** Unique IATA carrier codes on a leg (operating preferred). */
export function carriersFromLeg(leg?: FlightLeg): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const seg of leg?.segments ?? []) {
    const code = segmentCarrierCode(seg);
    if (code && !seen.has(code)) {
      seen.add(code);
      out.push(code);
    }
  }
  return out;
}

function legIsDirect(leg?: FlightLeg): boolean {
  const n = leg?.segments?.length ?? 0;
  return n === 1;
}

export interface SkyscannerPrefillParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  cabinClass?: string;
  adults?: number;
  children?: number;
  /** Comma-separated IATA airline codes (Skyscanner day-view filter). */
  airlines?: string;
  /** Skyscanner departure-times filter, e.g. "750-990" or "750-990,1200-1380". */
  departureTimes?: string;
  /** When true, prefer nonstop flights in Skyscanner results. */
  preferDirects?: boolean;
  currency?: string;
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
  params.set('preferdirects', p.preferDirects ? 'true' : 'false');
  if (p.airlines) params.set('airlines', p.airlines);
  if (p.departureTimes) params.set('departure-times', p.departureTimes);
  if (p.currency) params.set('currency', p.currency.toUpperCase());
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

function uniqueCarriers(legs: FlightLeg[]): string {
  const seen = new Set<string>();
  for (const leg of legs) {
    for (const c of carriersFromLeg(leg)) seen.add(c);
  }
  return [...seen].join(',');
}

function prefillForLeg(
  leg: FlightLeg,
  origin: string,
  destination: string,
  date: string,
  searchParams?: Partial<CreateSearchSessionRequest> | null,
): SkyscannerPrefillParams {
  const first = firstSeg(leg);
  return {
    origin,
    destination,
    departureDate: date,
    cabinClass: searchParams?.cabinClass,
    adults: searchParams?.adults,
    children: searchParams?.children,
    currency: searchParams?.currency,
    airlines: carriersFromLeg(leg).join(',') || undefined,
    departureTimes: skyscannerDepartureTimeRange(first?.departureTime) || undefined,
    preferDirects: legIsDirect(leg),
  };
}

/** Build a filtered Skyscanner URL for one itinerary leg (split / open-jaw hops). */
export function buildSkyscannerPrefillForLeg(
  option: FlightOption,
  legIndex: number,
  searchParams?: Partial<CreateSearchSessionRequest> | null,
): string | null {
  const leg = option.legs?.[legIndex];
  if (!leg) return null;
  const first = firstSeg(leg);
  const last = lastSeg(leg);
  const origin = (first?.from?.code || '').toUpperCase();
  const destination = (last?.to?.code || '').toUpperCase();
  const date = isoDatePrefix(first?.departureTime);
  if (!origin || !destination || !date) return null;
  return buildSkyscannerPrefillURL(prefillForLeg(leg, origin, destination, date, searchParams));
}

/** Build a filtered Skyscanner URL for a whole option (round-trip or one-way). */
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

  const split = isSplitBookingItinerary(option, searchParams);
  if (split) {
    return buildSkyscannerPrefillForLeg(option, 0, searchParams);
  }

  let returnDate: string | undefined;
  let departureTimes: string | undefined;
  let preferDirects = legIsDirect(outLeg);

  if (legs.length > 1) {
    const retFirst = firstSeg(legs[1]);
    returnDate = isoDatePrefix(retFirst?.departureTime) || searchParams?.returnDate || undefined;
    const outRange = skyscannerDepartureTimeRange(outFirst?.departureTime);
    const inRange = skyscannerDepartureTimeRange(retFirst?.departureTime);
    if (outRange && inRange) departureTimes = `${outRange},${inRange}`;
    else if (outRange) departureTimes = outRange;
    preferDirects = legIsDirect(outLeg) && legIsDirect(legs[1]);
  } else {
    departureTimes = skyscannerDepartureTimeRange(outFirst?.departureTime) || undefined;
  }

  return buildSkyscannerPrefillURL({
    origin,
    destination,
    departureDate,
    returnDate,
    cabinClass: searchParams?.cabinClass,
    adults: searchParams?.adults,
    children: searchParams?.children,
    currency: searchParams?.currency,
    airlines: uniqueCarriers(legs) || undefined,
    departureTimes,
    preferDirects,
  });
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
