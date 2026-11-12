/**
 * Collect distinct marketing carriers across all legs/segments for honest UI labels.
 */

import { getAirlineName, resolveAirlineLabel } from '../data/airlines';
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

export function providerNameForCode(option: FlightOption | null | undefined, code: string): string | undefined {
  const want = code.toUpperCase();
  for (const leg of option?.legs ?? []) {
    for (const seg of leg.segments ?? []) {
      const mkt = seg.marketingCarrier;
      if ((mkt?.code || '').toUpperCase() === want && mkt?.name?.trim()) {
        return mkt.name;
      }
      const op = seg.operatingCarrier;
      if ((op?.code || '').toUpperCase() === want && op?.name?.trim()) {
        return op.name;
      }
    }
  }
  return undefined;
}

/** Human-readable airline line for result cards and details headers. */
export function displayAirlineLabel(option?: FlightOption | null, maxNames = 3): string {
  const codes = distinctMarketingCarriers(option);
  if (codes.length === 0) return '';

  const names = codes
    .slice(0, maxNames)
    .map((code) => resolveAirlineLabel(code, providerNameForCode(option, code)));

  if (codes.length > maxNames) {
    const extra = codes.length - maxNames;
    names.push(`+${extra}`);
  }

  return names.join(' · ');
}

/** Resolve a single carrier code using the static map and any name on the option. */
export function labelForCarrierCode(option: FlightOption | null | undefined, code?: string | null): string {
  if (!code) return '';
  return resolveAirlineLabel(code, providerNameForCode(option, code));
}

/**
 * "W4 6234" style designator. When scrapers leave flightNumber empty, backend
 * identity normalize may echo the carrier code ("W4") — don't render "W4 W4".
 */
export function formatFlightDesignator(carrierCode?: string | null, flightNumber?: string | null): string {
  const code = (carrierCode || '').trim().toUpperCase();
  const raw = (flightNumber || '').trim();
  if (!raw) return code;
  const compact = raw.toUpperCase().replace(/[\s-]/g, '');
  if (!compact || compact === code) return code;
  // "W46234" / "W4 6234" → "W4 6234"
  if (code && compact.startsWith(code) && compact.length > code.length) {
    return `${code} ${compact.slice(code.length)}`;
  }
  if (code) return `${code} ${raw}`;
  return raw;
}

// Re-export for callers that only need the map lookup
export { getAirlineName };
