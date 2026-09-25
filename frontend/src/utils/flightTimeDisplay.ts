/**
 * Format flight times for display.
 *
 * Modes (Settings → Flight times):
 * - airport (default): each city’s clock — matches airline / Google Flights sites
 * - local: convert the absolute instant into the viewer’s timezone
 * - utc: show UTC
 *
 * Backend GF2 parsing stores real UTC instants derived from airport wall clocks,
 * so "airport" uses the segment airport’s IANA zone (see airportTimezones.ts).
 */
import { getAirportTimeZone } from '../data/airportTimezones';

export type FlightTimeDisplayMode = 'airport' | 'local' | 'utc';

export const FLIGHT_TIME_DISPLAY_MODES: FlightTimeDisplayMode[] = ['airport', 'local', 'utc'];

/** Parse ISO timestamp; returns NaN for missing/invalid/placeholder dates. */
export function flightTimeToMs(iso: string | undefined | null): number {
  if (!iso) return NaN;
  const ms = new Date(iso).getTime();
  if (!Number.isFinite(ms)) return NaN;
  if (new Date(ms).getUTCFullYear() < 2000) return NaN;
  return ms;
}

function resolveTimeZone(mode: FlightTimeDisplayMode, airportCode?: string | null): string | undefined {
  switch (mode) {
    case 'airport':
      return getAirportTimeZone(airportCode);
    case 'utc':
      return 'UTC';
    case 'local':
    default:
      return undefined;
  }
}

/**
 * Format a segment departure/arrival for display.
 * Default (airport): wall clock at the relevant airport.
 * Durations/layovers should use flightTimeToMs() on raw ISO values — unaffected by display mode.
 */
export function formatFlightTime(
  iso: string | undefined | null,
  airportCode: string | undefined | null,
  mode: FlightTimeDisplayMode,
  locale = 'en-US',
): string {
  const ms = flightTimeToMs(iso);
  if (!Number.isFinite(ms)) return '—';
  const timeZone = resolveTimeZone(mode, airportCode);
  return new Date(ms).toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    ...(timeZone ? { timeZone } : {}),
  });
}

/** Short date (e.g. "Jan 14") using the same timezone rules as formatFlightTime. */
export function formatFlightShortDate(
  iso: string | undefined | null,
  airportCode: string | undefined | null,
  mode: FlightTimeDisplayMode,
  locale = 'en-US',
): string {
  const ms = flightTimeToMs(iso);
  if (!Number.isFinite(ms)) return '';
  const timeZone = resolveTimeZone(mode, airportCode);
  return new Date(ms).toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    ...(timeZone ? { timeZone } : {}),
  });
}

/** Weekday + short date (e.g. "Thu, Jan 14"). */
export function formatFlightWeekdayDate(
  iso: string | undefined | null,
  airportCode: string | undefined | null,
  mode: FlightTimeDisplayMode,
  locale = 'en-US',
): string {
  const ms = flightTimeToMs(iso);
  if (!Number.isFinite(ms)) return '';
  const timeZone = resolveTimeZone(mode, airportCode);
  return new Date(ms).toLocaleDateString(locale, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    ...(timeZone ? { timeZone } : {}),
  });
}

/** Difference in minutes between two ISO timestamps (for layovers/durations). */
export function flightMinutesBetween(startIso: string | undefined | null, endIso: string | undefined | null): number {
  const start = flightTimeToMs(startIso);
  const end = flightTimeToMs(endIso);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return 0;
  return Math.round((end - start) / 60000);
}
