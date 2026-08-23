import {
  ANYWHERE_CODE,
  isCountryDestination,
  makeCountryDestination,
  parseCountryDestination,
  type AirportCityResult,
} from '../types';
import { searchAirportsLocal, getAirportEntry } from '../data/airports';
import {
  COUNTRY_DIRECTORY,
  getCountryEntry,
  getCountryDisplayName,
  type CountryEntry,
} from '../data/countries';
import type { LanguageCode } from '../data/translations';

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
  return 5;
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
  limit = 5,
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
    return countryRank(ca, q, language) - countryRank(cb, q, language);
  });
  return out.slice(0, limit);
}

/** Search airports/cities and countries together for autocomplete. */
export function searchPlacesLocal(
  query: string,
  limit = 15,
  language: LanguageCode = 'en',
): AirportCityResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const countries = searchCountriesLocal(query, 5, language);
  const airports = searchAirportsLocal(query, limit, language);

  const countryCodesInAirports = new Set(
    airports.map((a) => a.countryCode).filter(Boolean) as string[],
  );
  const topCountry = countries[0];
  const countryIsStrong =
    topCountry &&
    getCountryEntry(topCountry.countryCode!) &&
    countryRank(getCountryEntry(topCountry.countryCode!)!, q, language) <= 2;

  const merged: AirportCityResult[] = [];
  if (countryIsStrong) {
    merged.push(...countries);
  }
  merged.push(...airports);
  if (!countryIsStrong && countries.length > 0) {
    for (const c of countries) {
      if (!countryCodesInAirports.has(c.countryCode!)) merged.push(c);
    }
  }

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
  const results = searchPlacesLocal(raw, 10, language);
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
