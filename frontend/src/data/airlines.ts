import { AIRLINE_FULL_NAMES } from './airlinesFull';

export const AIRLINE_NAMES: Record<string, string> = {
  // Local overrides / curated names (can differ from official names if needed)
  W6: 'Wizz Air',
  LY: 'El Al Israel Airlines',
  TK: 'Turkish Airlines',
};

export function getAirlineName(code?: string | null): string | undefined {
  if (!code) return undefined;
  const key = code.toUpperCase();
  // Prefer any local override, then fall back to full IATA dataset
  return AIRLINE_NAMES[key] || AIRLINE_FULL_NAMES[key];
}

