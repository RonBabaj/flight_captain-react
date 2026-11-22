/**
 * Bidirectional text helpers for Hebrew (RTL) UI with Latin flight data.
 * Use Unicode isolates so times and IATA codes stay in departure → arrival order.
 */

/** Left-to-right isolate (U+2066) */
export const LRI = '\u2066';
/** Pop directional isolate (U+2069) */
export const PDI = '\u2069';

/** Wrap a Latin segment so it renders LTR inside RTL paragraphs. */
export function isolateLTR(text: string): string {
  const s = String(text ?? '').trim();
  if (!s) return s;
  return `${LRI}${s}${PDI}`;
}

/** Departure → arrival times (always chronological, never mirror arrows in RTL). */
export function formatFlightTimeRange(dep: string, arr: string): string {
  return isolateLTR(`${dep} → ${arr}`);
}

/** Airport path TLV › FRA › JFK in true travel order. */
export function formatAirportPath(codes: string[]): string {
  const path = codes.map((c) => c.trim().toUpperCase()).filter(Boolean);
  if (path.length < 2) return path[0] ? isolateLTR(path[0]) : '';
  return isolateLTR(path.join(' › '));
}

/** Route line for accessibility / joined strings. */
export function joinRouteCodes(codes: string[], sep = ' › '): string {
  return isolateLTR(codes.filter(Boolean).join(sep));
}