/**
 * Airport dictionary for From/To autocomplete.
 * Only these codes are sent to the backend (Amadeus); add more as needed.
 */

import type { AirportCityResult } from '../types';

export const AIRPORT_DICTIONARY: AirportCityResult[] = [
  { id: 'TLV', type: 'AIRPORT', airportCode: 'TLV', cityCode: 'TLV', name: 'Ben Gurion Intl', cityName: 'Tel Aviv', countryCode: 'IL' },
  { id: 'NAP', type: 'AIRPORT', airportCode: 'NAP', cityCode: 'NAP', name: 'Naples Intl', cityName: 'Naples', countryCode: 'IT' },
  { id: 'HND', type: 'AIRPORT', airportCode: 'HND', cityCode: 'TYO', name: 'Tokyo Haneda', cityName: 'Tokyo', countryCode: 'JP' },
  { id: 'NRT', type: 'AIRPORT', airportCode: 'NRT', cityCode: 'TYO', name: 'Narita Intl', cityName: 'Tokyo', countryCode: 'JP' },
  { id: 'BER', type: 'AIRPORT', airportCode: 'BER', cityCode: 'BER', name: 'Berlin Brandenburg', cityName: 'Berlin', countryCode: 'DE' },
  { id: 'MUC', type: 'AIRPORT', airportCode: 'MUC', cityCode: 'MUC', name: 'Munich', cityName: 'Munich', countryCode: 'DE' },
  { id: 'FRA', type: 'AIRPORT', airportCode: 'FRA', cityCode: 'FRA', name: 'Frankfurt', cityName: 'Frankfurt', countryCode: 'DE' },
  { id: 'CDG', type: 'AIRPORT', airportCode: 'CDG', cityCode: 'PAR', name: 'Paris Charles de Gaulle', cityName: 'Paris', countryCode: 'FR' },
  { id: 'ORY', type: 'AIRPORT', airportCode: 'ORY', cityCode: 'PAR', name: 'Paris Orly', cityName: 'Paris', countryCode: 'FR' },
  { id: 'LHR', type: 'AIRPORT', airportCode: 'LHR', cityCode: 'LON', name: 'London Heathrow', cityName: 'London', countryCode: 'GB' },
  { id: 'LGW', type: 'AIRPORT', airportCode: 'LGW', cityCode: 'LON', name: 'London Gatwick', cityName: 'London', countryCode: 'GB' },
  { id: 'JFK', type: 'AIRPORT', airportCode: 'JFK', cityCode: 'NYC', name: 'New York JFK', cityName: 'New York', countryCode: 'US' },
  { id: 'LAX', type: 'AIRPORT', airportCode: 'LAX', cityCode: 'LAX', name: 'Los Angeles Intl', cityName: 'Los Angeles', countryCode: 'US' },
  { id: 'MIA', type: 'AIRPORT', airportCode: 'MIA', cityCode: 'MIA', name: 'Miami Intl', cityName: 'Miami', countryCode: 'US' },
  { id: 'BCN', type: 'AIRPORT', airportCode: 'BCN', cityCode: 'BCN', name: 'Barcelona El Prat', cityName: 'Barcelona', countryCode: 'ES' },
  { id: 'MAD', type: 'AIRPORT', airportCode: 'MAD', cityCode: 'MAD', name: 'Madrid Barajas', cityName: 'Madrid', countryCode: 'ES' },
  { id: 'AMS', type: 'AIRPORT', airportCode: 'AMS', cityCode: 'AMS', name: 'Amsterdam Schiphol', cityName: 'Amsterdam', countryCode: 'NL' },
  { id: 'FCO', type: 'AIRPORT', airportCode: 'FCO', cityCode: 'ROM', name: 'Rome Fiumicino', cityName: 'Rome', countryCode: 'IT' },
  { id: 'HFA', type: 'AIRPORT', airportCode: 'HFA', cityCode: 'HFA', name: 'Haifa', cityName: 'Haifa', countryCode: 'IL' },
  { id: 'VCE', type: 'AIRPORT', airportCode: 'VCE', cityCode: 'VCE', name: 'Venice Marco Polo', cityName: 'Venice', countryCode: 'IT' },
  { id: 'DXB', type: 'AIRPORT', airportCode: 'DXB', cityCode: 'DXB', name: 'Dubai Intl', cityName: 'Dubai', countryCode: 'AE' },
  { id: 'IST', type: 'AIRPORT', airportCode: 'IST', cityCode: 'IST', name: 'Istanbul', cityName: 'Istanbul', countryCode: 'TR' },
];

const lower = (s: string) => s.toLowerCase();

/** Search the dictionary by code or city/airport name; returns matches for Amadeus-ready codes. */
export function searchAirportsLocal(query: string, limit = 15): AirportCityResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const out: AirportCityResult[] = [];
  for (const a of AIRPORT_DICTIONARY) {
    const code = a.airportCode || a.cityCode || a.id;
    if (
      lower(code).includes(q) ||
      (a.cityName && lower(a.cityName).includes(q)) ||
      lower(a.name).includes(q) ||
      (a.countryCode && lower(a.countryCode).includes(q))
    ) {
      out.push(a);
      if (out.length >= limit) break;
    }
  }
  return out;
}
