import { AIRLINE_FULL_NAMES } from './airlinesFull';

export const AIRLINE_NAMES: Record<string, string> = {
  // Local overrides / curated names (can differ from official names if needed)
  W6: 'Wizz Air',
  LY: 'El Al Israel Airlines',
  TK: 'Turkish Airlines',
  BZ: 'Bluebird Airways',
};

export function getAirlineName(code?: string | null): string | undefined {
  if (!code) return undefined;
  const key = code.toUpperCase();
  // Prefer any local override, then fall back to full IATA dataset
  return AIRLINE_NAMES[key] || AIRLINE_FULL_NAMES[key];
}

/** Map lookup, then provider-supplied name, then raw code — never leave users with only IATA. */
export function resolveAirlineLabel(
  code?: string | null,
  providerName?: string | null,
): string {
  const mapped = getAirlineName(code);
  if (mapped) return mapped;
  const name = providerName?.trim();
  if (name) return name;
  return (code || '').trim();
}
