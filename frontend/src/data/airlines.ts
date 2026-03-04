export const AIRLINE_NAMES: Record<string, string> = {
  W6: 'Wizz Air',
  LY: 'El Al Israel Airlines',
  TK: 'Turkish Airlines',
  AZ: 'ITA Airways',
  LH: 'Lufthansa',
  OS: 'Austrian Airlines',
  LX: 'SWISS',
  AF: 'Air France',
  KL: 'KLM',
};

export function getAirlineName(code?: string | null): string | undefined {
  if (!code) return undefined;
  return AIRLINE_NAMES[code.toUpperCase()];
}

