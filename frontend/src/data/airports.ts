/**
 * Airport dictionary for From/To autocomplete.
 * Only these codes are sent to the backend (Amadeus); add more as needed.
 * Optional cityNameHe/cityNameRu (and nameHe/nameRu) enable search in the selected language.
 */

import type { AirportCityResult } from '../types';
import type { LanguageCode } from './translations';

export const AIRPORT_DICTIONARY: AirportCityResult[] = [
  { id: 'TLV', type: 'AIRPORT', airportCode: 'TLV', cityCode: 'TLV', name: 'Ben Gurion Intl', cityName: 'Tel Aviv', countryCode: 'IL', cityNameHe: 'תל אביב', cityNameRu: 'Тель-Авив' },
  { id: 'NAP', type: 'AIRPORT', airportCode: 'NAP', cityCode: 'NAP', name: 'Naples Intl', cityName: 'Naples', countryCode: 'IT', cityNameHe: 'נאפולי', cityNameRu: 'Неаполь' },
  { id: 'HND', type: 'AIRPORT', airportCode: 'HND', cityCode: 'TYO', name: 'Tokyo Haneda', cityName: 'Tokyo', countryCode: 'JP', cityNameHe: 'טוקיו', cityNameRu: 'Токио' },
  { id: 'NRT', type: 'AIRPORT', airportCode: 'NRT', cityCode: 'TYO', name: 'Narita Intl', cityName: 'Tokyo', countryCode: 'JP', cityNameHe: 'טוקיו', cityNameRu: 'Токио' },
  { id: 'BER', type: 'AIRPORT', airportCode: 'BER', cityCode: 'BER', name: 'Berlin Brandenburg', cityName: 'Berlin', countryCode: 'DE', cityNameHe: 'ברלין', cityNameRu: 'Берлин' },
  { id: 'MUC', type: 'AIRPORT', airportCode: 'MUC', cityCode: 'MUC', name: 'Munich', cityName: 'Munich', countryCode: 'DE', cityNameHe: 'מינכן', cityNameRu: 'Мюнхен' },
  { id: 'FRA', type: 'AIRPORT', airportCode: 'FRA', cityCode: 'FRA', name: 'Frankfurt', cityName: 'Frankfurt', countryCode: 'DE', cityNameHe: 'פרנקפורט', cityNameRu: 'Франкфурт' },
  { id: 'CDG', type: 'AIRPORT', airportCode: 'CDG', cityCode: 'PAR', name: 'Paris Charles de Gaulle', cityName: 'Paris', countryCode: 'FR', cityNameHe: 'פריז', cityNameRu: 'Париж' },
  { id: 'ORY', type: 'AIRPORT', airportCode: 'ORY', cityCode: 'PAR', name: 'Paris Orly', cityName: 'Paris', countryCode: 'FR', cityNameHe: 'פריז', cityNameRu: 'Париж' },
  { id: 'LHR', type: 'AIRPORT', airportCode: 'LHR', cityCode: 'LON', name: 'London Heathrow', cityName: 'London', countryCode: 'GB', cityNameHe: 'לונדון', cityNameRu: 'Лондон' },
  { id: 'LGW', type: 'AIRPORT', airportCode: 'LGW', cityCode: 'LON', name: 'London Gatwick', cityName: 'London', countryCode: 'GB', cityNameHe: 'לונדון', cityNameRu: 'Лондон' },
  { id: 'JFK', type: 'AIRPORT', airportCode: 'JFK', cityCode: 'NYC', name: 'New York JFK', cityName: 'New York', countryCode: 'US', cityNameHe: 'ניו יורק', cityNameRu: 'Нью-Йорк' },
  { id: 'LAX', type: 'AIRPORT', airportCode: 'LAX', cityCode: 'LAX', name: 'Los Angeles Intl', cityName: 'Los Angeles', countryCode: 'US', cityNameHe: 'לוס אנג\'לס', cityNameRu: 'Лос-Анджелес' },
  { id: 'MIA', type: 'AIRPORT', airportCode: 'MIA', cityCode: 'MIA', name: 'Miami Intl', cityName: 'Miami', countryCode: 'US', cityNameHe: 'מיאמי', cityNameRu: 'Майами' },
  { id: 'BCN', type: 'AIRPORT', airportCode: 'BCN', cityCode: 'BCN', name: 'Barcelona El Prat', cityName: 'Barcelona', countryCode: 'ES', cityNameHe: 'ברצלונה', cityNameRu: 'Барселона' },
  { id: 'MAD', type: 'AIRPORT', airportCode: 'MAD', cityCode: 'MAD', name: 'Madrid Barajas', cityName: 'Madrid', countryCode: 'ES', cityNameHe: 'מדריד', cityNameRu: 'Мадрид' },
  { id: 'AMS', type: 'AIRPORT', airportCode: 'AMS', cityCode: 'AMS', name: 'Amsterdam Schiphol', cityName: 'Amsterdam', countryCode: 'NL', cityNameHe: 'אמסטרדם', cityNameRu: 'Амстердам' },
  { id: 'FCO', type: 'AIRPORT', airportCode: 'FCO', cityCode: 'ROM', name: 'Rome Fiumicino', cityName: 'Rome', countryCode: 'IT', cityNameHe: 'רומא', cityNameRu: 'Рим' },
  { id: 'HFA', type: 'AIRPORT', airportCode: 'HFA', cityCode: 'HFA', name: 'Haifa', cityName: 'Haifa', countryCode: 'IL', cityNameHe: 'חיפה', cityNameRu: 'Хайфа' },
  { id: 'VCE', type: 'AIRPORT', airportCode: 'VCE', cityCode: 'VCE', name: 'Venice Marco Polo', cityName: 'Venice', countryCode: 'IT', cityNameHe: 'ונציה', cityNameRu: 'Венеция' },
  { id: 'DXB', type: 'AIRPORT', airportCode: 'DXB', cityCode: 'DXB', name: 'Dubai Intl', cityName: 'Dubai', countryCode: 'AE', cityNameHe: 'דובאי', cityNameRu: 'Дубай' },
  { id: 'IST', type: 'AIRPORT', airportCode: 'IST', cityCode: 'IST', name: 'Istanbul', cityName: 'Istanbul', countryCode: 'TR', cityNameHe: 'איסטנבול', cityNameRu: 'Стамбул' },
];

const lower = (s: string) => s.toLowerCase();

function matchesQuery(a: AirportCityResult, q: string): boolean {
  const code = a.airportCode || a.cityCode || a.id;
  if (lower(code).includes(q)) return true;
  if (a.cityName && lower(a.cityName).includes(q)) return true;
  if (lower(a.name).includes(q)) return true;
  if (a.countryCode && lower(a.countryCode).includes(q)) return true;
  if (a.cityNameHe && lower(a.cityNameHe).includes(q)) return true;
  if (a.cityNameRu && lower(a.cityNameRu).includes(q)) return true;
  if (a.nameHe && lower(a.nameHe).includes(q)) return true;
  if (a.nameRu && lower(a.nameRu).includes(q)) return true;
  return false;
}

/** Search the dictionary by code or city/airport name (incl. localized names); returns matches for Amadeus-ready codes. */
export function searchAirportsLocal(query: string, limit = 15, _language?: LanguageCode): AirportCityResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const out: AirportCityResult[] = [];
  for (const a of AIRPORT_DICTIONARY) {
    if (matchesQuery(a, q)) {
      out.push(a);
      if (out.length >= limit) break;
    }
  }
  return out;
}

/** Display city name in the given language (for dropdown and selected value). */
export function getCityDisplayName(a: AirportCityResult, language: LanguageCode): string {
  if (language === 'he' && a.cityNameHe) return a.cityNameHe;
  if (language === 'ru' && a.cityNameRu) return a.cityNameRu;
  return a.cityName || a.name || '';
}

/** Display airport/place name in the given language (for subtitle). */
export function getAirportDisplayName(a: AirportCityResult, language: LanguageCode): string {
  if (language === 'he' && a.nameHe) return a.nameHe;
  if (language === 'ru' && a.nameRu) return a.nameRu;
  return a.name || '';
}
