/**
 * Airport/city autocomplete API. Endpoints per backend contract.
 */

import { AirportCitySearchResponse } from '../types';
import { apiGet } from './client';

const AIRPORTS_PATH = '/api/airports/search';

/** Search airports and cities (stub: placeholder endpoint). */
export async function searchAirports(
  query: string,
  limit?: number
): Promise<AirportCitySearchResponse> {
  const q = new URLSearchParams({ q: query });
  if (limit != null) q.set('limit', String(limit));
  return apiGet<AirportCitySearchResponse>(`${AIRPORTS_PATH}?${q.toString()}`);
}
