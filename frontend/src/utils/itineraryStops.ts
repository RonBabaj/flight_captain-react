import type { FlightOption } from '../types';

/** Stop count for each leg (segments - 1). */
export function stopsPerLeg(option: FlightOption): number[] {
  return (option.legs ?? []).map((leg) => Math.max(0, (leg.segments?.length ?? 0) - 1));
}

/** Highest stop count on any single leg — matches the results stops filter. */
export function maxStopsPerLeg(option: FlightOption): number {
  const perLeg = stopsPerLeg(option);
  return perLeg.length > 0 ? Math.max(...perLeg) : 0;
}

/** Total connection count summed across all legs. */
export function totalStops(option: FlightOption): number {
  return stopsPerLeg(option).reduce((sum, n) => sum + n, 0);
}

/**
 * Whether an option passes the stops filter.
 * - 0 = every leg is nonstop
 * - 1 = at most one stop per leg
 * - 2 = two or more stops on at least one leg
 */
export function matchesStopsFilter(option: FlightOption, maxStops: number | null): boolean {
  if (maxStops == null) return true;
  const worstLeg = maxStopsPerLeg(option);
  if (maxStops === 0) return worstLeg === 0;
  if (maxStops === 1) return worstLeg <= 1;
  if (maxStops === 2) return worstLeg >= 2;
  return true;
}

/** Count results that would match each stops bucket. */
export function countByStopsFilter(results: FlightOption[]): Record<'any' | 'direct' | 'one' | 'twoPlus', number> {
  const counts = { any: results.length, direct: 0, one: 0, twoPlus: 0 };
  for (const opt of results) {
    const worst = maxStopsPerLeg(opt);
    if (worst === 0) counts.direct += 1;
    if (worst <= 1) counts.one += 1;
    if (worst >= 2) counts.twoPlus += 1;
  }
  return counts;
}

export function formatStopsLabel(
  worstLegStops: number,
  t: (key: string) => string,
  legCount: number,
): string {
  if (worstLegStops === 0) return t('direct');
  if (worstLegStops === 1) return `1 ${t('stop')}`;
  const base = `${worstLegStops} ${t('stops')}`;
  // Multi-leg: chip reflects worst leg (what the filter uses), not outbound only.
  if (legCount > 1 && worstLegStops > 0) {
    return base;
  }
  return base;
}
