import { AIRLINE_FULL_NAMES } from './airlinesFull';

export const AIRLINE_NAMES: Record<string, string> = {
  // Local overrides / curated names (can differ from official names if needed)
  W6: 'Wizz Air',
  LY: 'El Al Israel Airlines',
  TK: 'Turkish Airlines',
  BZ: 'Bluebird Airways',
};

/** Scraped OTA cards often send display names without IATA — mirror backend aliases. */
const AIRLINE_NAME_TO_IATA: Record<string, string> = {
  ISRAIR: '6H',
  ISRAIRAIRLINES: '6H',
  ELAL: 'LY',
  ELALISRAELAIRLINES: 'LY',
  ARKIA: 'IZ',
  WIZZAIR: 'W6',
  WIZZAIRMALTA: 'W4',
  WIZZAIRUK: 'W9',
  TUSAIRWAYS: 'U8',
  SMARTWINGS: 'QS',
  AUSTRIAN: 'OS',
  AUSTRIANAIRLINES: 'OS',
  LUFTHANSA: 'LH',
  SWISS: 'LX',
  AIRFRANCE: 'AF',
  KLM: 'KL',
  BRITISHAIRWAYS: 'BA',
  RYANAIR: 'FR',
  EASYJET: 'U2',
  VUELING: 'VY',
  PEGASUS: 'PC',
  PEGASUSAIRLINES: 'PC',
  TURKISHAIRLINES: 'TK',
  AEGEAN: 'A3',
  AEGEANAIRLINES: 'A3',
  LOT: 'LO',
  LOTPOLISHAIRLINES: 'LO',
  ITA: 'AZ',
  ITAAIRWAYS: 'AZ',
  TRANSAVIA: 'HV',
  BLUEBIRDAIRWAYS: 'BZ',
  CONDOR: 'DE',
  CONDORFLUGDIENST: 'DE',
  EUROWINGS: 'EW',
  NORWEGIAN: 'DY',
  NORWEGIANAIRSHUTTLE: 'DY',
  AERLINGUS: 'EI',
  IBERIA: 'IB',
  FINNAIR: 'AY',
  SAS: 'SK',
  SCANDINAVIANAIRLINES: 'SK',
  JET2: 'LS',
  JET2COM: 'LS',
};

function airlineAliasKey(raw: string): string {
  return raw.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

export function getAirlineName(code?: string | null): string | undefined {
  if (!code) return undefined;
  const key = code.toUpperCase();
  // Prefer any local override, then fall back to full IATA dataset
  return AIRLINE_NAMES[key] || AIRLINE_FULL_NAMES[key];
}

/** Resolve IATA when scrapers leave marketingCarrier.code empty but send a name ("Condor"). */
export function iataFromAirlineName(name?: string | null): string {
  const raw = (name || '').trim();
  if (!raw) return '';
  if (/^[A-Z0-9]{2}$/i.test(raw)) return raw.toUpperCase();
  const key = airlineAliasKey(raw);
  if (AIRLINE_NAME_TO_IATA[key]) return AIRLINE_NAME_TO_IATA[key];
  for (const [alias, code] of Object.entries(AIRLINE_NAME_TO_IATA)) {
    if (alias.length >= 5 && key.startsWith(alias)) return code;
  }
  // Reverse lookup curated + full name tables (exact match on alias key).
  for (const [code, label] of Object.entries(AIRLINE_NAMES)) {
    if (airlineAliasKey(label) === key) return code;
  }
  for (const [code, label] of Object.entries(AIRLINE_FULL_NAMES)) {
    if (airlineAliasKey(label) === key) return code;
  }
  return '';
}

/** Prefer IATA code; fall back to name→IATA when scrapers omit the code. */
export function resolveCarrierCode(
  code?: string | null,
  providerName?: string | null,
): string {
  const raw = (code || '').trim().toUpperCase();
  if (/^[A-Z0-9]{2}$/.test(raw)) return raw;
  return iataFromAirlineName(providerName) || iataFromAirlineName(code);
}

/** Map lookup, then provider-supplied name, then raw code — never leave users with only IATA. */
export function resolveAirlineLabel(
  code?: string | null,
  providerName?: string | null,
): string {
  const resolved = resolveCarrierCode(code, providerName);
  const mapped = getAirlineName(resolved || code);
  if (mapped) return mapped;
  const name = providerName?.trim();
  if (name) return name;
  return (code || '').trim();
}

/** Filter checkbox label: "Air Europa (UX)" when resolved, else the raw code. */
export function formatAirlineFilterLabel(
  code?: string | null,
  providerName?: string | null,
): string {
  const raw = (code || '').trim().toUpperCase();
  if (!raw) return providerName?.trim() || '';
  const name = resolveAirlineLabel(raw, providerName);
  if (!name || name.toUpperCase() === raw) return raw;
  return `${name} (${raw})`;
}
