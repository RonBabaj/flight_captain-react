import {
  ANYWHERE_CODE,
  isCountryDestination,
  makeCountryDestination,
  parseCountryDestination,
  type AirportCityResult,
  type AirportCityType,
} from '../types';
import { searchAirportsLocal, getAirportEntry, PLACE_SEARCH_LIMIT } from '../data/airports';
export { PLACE_SEARCH_LIMIT } from '../data/airports';
import {
  COUNTRY_DIRECTORY,
  getCountryEntry,
  getCountryDisplayName,
  type CountryEntry,
} from '../data/countries';
import type { LanguageCode } from '../data/translations';

/** Max country rows shown alongside airports/cities in autocomplete. */
export const PLACE_COUNTRY_LIMIT = 12;

const lower = (s: string) => s.toLowerCase();

function countryMatchesQuery(country: CountryEntry, q: string, language: LanguageCode): boolean {
  if (lower(country.code) === q) return true;
  if (lower(country.name).includes(q)) return true;
  if (language === 'he' && country.nameHe && lower(country.nameHe).includes(q)) return true;
  if (language === 'ru' && country.nameRu && lower(country.nameRu).includes(q)) return true;
  if (country.nameHe && lower(country.nameHe).includes(q)) return true;
  if (country.nameRu && lower(country.nameRu).includes(q)) return true;
  return false;
}

function countryRank(country: CountryEntry, q: string, language: LanguageCode): number {
  const name = getCountryDisplayName(country, language);
  const ln = lower(name);
  if (lower(country.code) === q) return 0;
  if (ln === q) return 1;
  if (ln.startsWith(q)) return 2;
  if (ln.includes(q)) return 4;
  return 8;
}

function placeRank(item: AirportCityResult, q: string): number {
  const code = lower(item.airportCode || item.cityCode || item.id);
  let base: number;
  if (code === q) base = 0;
  else if (code.startsWith(q)) base = 2;
  else if (item.cityName && lower(item.cityName) === q) base = 1;
  else if (item.cityName && lower(item.cityName).startsWith(q)) base = 3;
  else if (item.cityName && lower(item.cityName).includes(q)) base = 5;
  else if (lower(item.name).startsWith(q)) base = 7;
  else base = 9;
  if (item.type === 'CITY') return base - 0.5;
  return base;
}

function typeOrder(type: AirportCityType): number {
  if (type === 'COUNTRY') return 0;
  if (type === 'CITY') return 1;
  return 2;
}

export function countryToPlaceResult(country: CountryEntry, language: LanguageCode): AirportCityResult {
  const label = getCountryDisplayName(country, language);
  return {
    id: `COUNTRY-${country.code}`,
    type: 'COUNTRY',
    countryCode: country.code,
    name: label,
    cityName: label,
    cityNameHe: country.nameHe,
    cityNameRu: country.nameRu,
  };
}

export function searchCountriesLocal(
  query: string,
  limit = PLACE_COUNTRY_LIMIT,
  language: LanguageCode = 'en',
): AirportCityResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const out: AirportCityResult[] = [];
  for (const country of COUNTRY_DIRECTORY) {
    if (countryMatchesQuery(country, q, language)) {
      out.push(countryToPlaceResult(country, language));
    }
  }
  out.sort((a, b) => {
    const ca = getCountryEntry(a.countryCode!)!;
    const cb = getCountryEntry(b.countryCode!)!;
    const diff = countryRank(ca, q, language) - countryRank(cb, q, language);
    if (diff !== 0) return diff;
    return getCountryDisplayName(ca, language).localeCompare(getCountryDisplayName(cb, language));
  });
  return out.slice(0, limit);
}

/** Search airports, cities, and countries together for autocomplete. */
export function searchPlacesLocal(
  query: string,
  limit = PLACE_SEARCH_LIMIT,
  language: LanguageCode = 'en',
): AirportCityResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const countries = searchCountriesLocal(query, PLACE_COUNTRY_LIMIT, language);
  const places = searchAirportsLocal(query, limit, language);

  const merged = [...countries, ...places];
  merged.sort((a, b) => {
    const ra = a.type === 'COUNTRY'
      ? countryRank(getCountryEntry(a.countryCode!)!, q, language)
      : placeRank(a, q);
    const rb = b.type === 'COUNTRY'
      ? countryRank(getCountryEntry(b.countryCode!)!, q, language)
      : placeRank(b, q);
    if (ra !== rb) return ra - rb;
    const to = typeOrder(a.type) - typeOrder(b.type);
    if (to !== 0) return to;
    const la = a.cityName || a.name || '';
    const lb = b.cityName || b.name || '';
    return la.localeCompare(lb);
  });

  const seen = new Set<string>();
  const deduped: AirportCityResult[] = [];
  for (const item of merged) {
    const key = `${item.type}:${item.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(item);
    if (deduped.length >= limit) break;
  }
  return deduped;
}

export function placeResultToCode(item: AirportCityResult): string {
  if (item.type === 'COUNTRY' && item.countryCode) {
    return makeCountryDestination(item.countryCode);
  }
  return (item.airportCode || item.cityCode || item.id).toUpperCase();
}

/** Resolve free-text or labeled input to a stored place code (IATA, COUNTRY:XX, or ANYWHERE). */
export function resolvePlaceQuery(
  query: string,
  language: LanguageCode = 'en',
): string | null {
  const raw = query.trim();
  if (!raw) return null;

  const upper = raw.toUpperCase();
  if (upper === ANYWHERE_CODE) return ANYWHERE_CODE;
  if (isCountryDestination(raw)) return makeCountryDestination(parseCountryDestination(raw)!);

  const paren = raw.match(/\(([A-Z]{2,3})\)\s*$/i);
  if (paren) {
    const token = paren[1].toUpperCase();
    if (token.length === 3 && getAirportEntry(token)) return token;
    if (token.length === 2 && getCountryEntry(token)) return makeCountryDestination(token);
  }

  if (/^[A-Za-z]{3}$/.test(raw) && getAirportEntry(upper)) return upper;
  if (/^[A-Za-z]{2}$/.test(raw) && getCountryEntry(upper)) return makeCountryDestination(upper);

  const qLower = raw.toLowerCase();
  const results = searchPlacesLocal(raw, PLACE_SEARCH_LIMIT, language);
  if (results.length === 0) return null;

  const exact = results.find((item) => {
    if (item.type === 'COUNTRY') {
      const c = getCountryEntry(item.countryCode!);
      if (!c) return false;
      const names = [c.name, c.nameHe, c.nameRu].filter(Boolean) as string[];
      return names.some((n) => lower(n) === qLower);
    }
    const names = [item.cityName, item.cityNameHe, item.cityNameRu, item.name].filter(Boolean) as string[];
    return names.some((n) => lower(n) === qLower);
  });
  if (exact) return placeResultToCode(exact);

  const cityExact = results.find(
    (item) => item.type === 'CITY' && item.cityName && lower(item.cityName) === qLower,
  );
  if (cityExact) return placeResultToCode(cityExact);

  if (results.length === 1) return placeResultToCode(results[0]);
  return null;
}

export function resolveCountryToPrimaryAirport(countryCode: string): string | null {
  const entry = getCountryEntry(countryCode);
  return entry?.primaryAirport ?? null;
}

/** Blur focused input so autocomplete onBlur handlers commit typed text before search. */
export async function flushActiveAutocomplete(): Promise<void> {
  try {
    const el = (globalThis as { document?: { activeElement?: { blur?: () => void } } }).document?.activeElement;
    el?.blur?.();
  } catch {
    // ignore
  }
  await new Promise((resolve) => setTimeout(resolve, 50));
}

export function formatPlaceCodeForDisplay(
  code: string,
  language: LanguageCode,
  t: (key: string) => string,
): string {
  if (!code) return '';
  if (code.toUpperCase() === ANYWHERE_CODE) return t('anywhere');
  if (isCountryDestination(code)) {
    const cc = parseCountryDestination(code);
    const country = cc ? getCountryEntry(cc) : null;
    if (country) return `${getCountryDisplayName(country, language)} (${cc})`;
    return code;
  }
  const entry = getAirportEntry(code);
  if (!entry) return code;
  const placeCode = (entry.airportCode || entry.cityCode || entry.id).toUpperCase();
  const cityDisplay =
    language === 'he' && entry.cityNameHe
      ? entry.cityNameHe
      : language === 'ru' && entry.cityNameRu
        ? entry.cityNameRu
        : entry.cityName || entry.name || code;
  return `${cityDisplay} (${placeCode})`;
}
