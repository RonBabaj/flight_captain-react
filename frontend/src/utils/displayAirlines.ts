/**
 * Collect distinct marketing carriers across all legs/segments for honest UI labels.
 */

import { getAirlineName } from '../data/airlines';
import type { FlightOption } from '../types';

/** Ordered unique marketing carrier codes (first segment appearance wins). */
export function distinctMarketingCarriers(option?: FlightOption | null): string[] {
  const seen = new Set<string>();
  const codes: string[] = [];
  for (const leg of option?.legs ?? []) {
    for (const seg of leg.segments ?? []) {
      const code = (seg.marketingCarrier?.code || '').toUpperCase();
      if (!code || seen.has(code)) continue;
      seen.add(code);
      codes.push(code);
    }
  }
  if (codes.length > 0) return codes;

  const fallback =
    option?.primaryDisplayCarrier ||
    option?.validatingAirlines?.[0] ||
    '';
  return fallback ? [fallback.toUpperCase()] : [];
}

export function hasMultipleAirlines(option?: FlightOption | null): boolean {
  return distinctMarketingCarriers(option).length > 1;
}

/** Human-readable airline line for result cards and details headers. */
export function displayAirlineLabel(option?: FlightOption | null, maxNames = 3): string {
  const codes = distinctMarketingCarriers(option);
  if (codes.length === 0) return '';

  const names = codes
    .slice(0, maxNames)
    .map((code) => getAirlineName(code) || code);

  if (codes.length > maxNames) {
    const extra = codes.length - maxNames;
    names.push(`+${extra}`);
  }

  return names.join(' · ');
}
