import type { FlightSegment, LayoverSummary, OutboundSummary } from '../types';

export interface LegPreviewSummary {
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  stopsCount: number;
  layovers: LayoverSummary[];
  origin: string;
  destination: string;
}

function toValidMs(iso: string | undefined | null): number {
  if (!iso) return NaN;
  const ms = new Date(iso).getTime();
  if (!Number.isFinite(ms)) return NaN;
  if (new Date(ms).getUTCFullYear() < 2000) return NaN;
  return ms;
}

function layoverBetween(segments: FlightSegment[], idx: number): LayoverSummary | null {
  if (idx <= 0 || idx >= segments.length) return null;
  const prev = segments[idx - 1];
  const curr = segments[idx];
  const airport = prev.to?.code || curr.from?.code || '';
  if (!airport) return null;
  const prevArr = toValidMs(prev.arrivalTime);
  const dep = toValidMs(curr.departureTime);
  if (!Number.isFinite(prevArr) || !Number.isFinite(dep) || dep <= prevArr) {
    return airport ? { airportCode: airport, minutes: 0 } : null;
  }
  return { airportCode: airport, minutes: Math.round((dep - prevArr) / 60000) };
}

function computeLayovers(segments: FlightSegment[]): LayoverSummary[] {
  const layovers: LayoverSummary[] = [];
  for (let i = 1; i < segments.length; i++) {
    const lo = layoverBetween(segments, i);
    if (lo) layovers.push(lo);
  }
  return layovers;
}

/** Build card/modal preview fields for one leg's segments. */
export function buildLegPreviewSummary(
  segments: FlightSegment[] | undefined,
  fallback?: OutboundSummary | null,
  optionDurationMinutes?: number,
): LegPreviewSummary | null {
  if (!segments?.length) return null;

  const first = segments[0];
  const last = segments[segments.length - 1];

  const departureTime =
    (Number.isFinite(toValidMs(first.departureTime)) ? first.departureTime : null)
    ?? (Number.isFinite(toValidMs(fallback?.departureTime)) ? fallback!.departureTime : null)
    ?? '';
  const arrivalTime =
    (Number.isFinite(toValidMs(last.arrivalTime)) ? last.arrivalTime : null)
    ?? (Number.isFinite(toValidMs(fallback?.arrivalTime)) ? fallback!.arrivalTime : null)
    ?? '';

  let durationMinutes = 0;
  if ((fallback?.durationMinutes ?? 0) > 0) durationMinutes = fallback!.durationMinutes;
  if (durationMinutes <= 0 && (optionDurationMinutes ?? 0) > 0) durationMinutes = optionDurationMinutes!;
  if (durationMinutes <= 0) {
    const d = toValidMs(departureTime);
    const a = toValidMs(arrivalTime);
    if (Number.isFinite(d) && Number.isFinite(a) && a > d) {
      durationMinutes = Math.round((a - d) / 60000);
    }
  }
  if (durationMinutes <= 0) {
    durationMinutes = segments.reduce((s, seg) => s + Math.max(0, seg.durationMinutes || 0), 0);
  }

  const stopsCount = Math.max(0, segments.length - 1);
  const layovers =
    fallback?.layovers?.length
      ? fallback.layovers
      : computeLayovers(segments);

  return {
    departureTime,
    arrivalTime,
    durationMinutes,
    stopsCount,
    layovers,
    origin: first.from?.code || '',
    destination: last.to?.code || '',
  };
}

export function formatDuration(min: number): string {
  if (min <= 0) return '—';
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function formatLegStopsLabel(stopsCount: number, t: (key: string) => string): string {
  if (stopsCount === 0) return t('direct');
  if (stopsCount === 1) return `1 ${t('stop')}`;
  return `${stopsCount} ${t('stops')}`;
}

/** Compact layover hint for result cards, e.g. "2h 10m in FRA". */
export function formatLayoverPreview(
  layovers: LayoverSummary[],
  t: (key: string) => string,
  fmtDur: (min: number) => string = formatDuration,
): string {
  const parts = layovers
    .filter((lo) => lo.airportCode && lo.minutes > 0)
    .map((lo) =>
      t('layover_short')
        .replace('{duration}', fmtDur(lo.minutes))
        .replace('{airport}', lo.airportCode),
    );
  return parts.join(', ');
}
