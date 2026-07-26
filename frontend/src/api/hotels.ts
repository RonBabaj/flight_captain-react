/**
 * Hotel API client — all RateHawk calls go through the Fly-Fix backend.
 */

import { apiGet, apiPost } from './client';
import type {
  HotelDestinationSuggestion,
  HotelEstimate,
  HotelOffer,
  HotelSearchRequest,
  HotelSearchResponse,
  TripDeal,
} from '../types/hotels';

export async function suggestHotelDestinations(
  q: string,
  language = 'en'
): Promise<HotelDestinationSuggestion[]> {
  const params = new URLSearchParams({ q, language });
  const res = await apiGet<{ results: HotelDestinationSuggestion[]; message?: string }>(
    `/api/hotels/destinations?${params.toString()}`
  );
  return res.results ?? [];
}

export async function searchHotels(req: HotelSearchRequest): Promise<HotelSearchResponse> {
  return apiPost<HotelSearchResponse>('/api/hotels/search', req);
}

export async function getHotelDetails(params: {
  hotelId?: string;
  hid?: number;
  checkIn: string;
  checkOut: string;
  adults?: number;
  rooms?: number;
  currency?: string;
  language?: string;
}): Promise<{ hotel?: HotelOffer; rates?: HotelOffer[]; message?: string; priceStatus?: string }> {
  return apiPost('/api/hotels/details', params);
}

export async function getHotelEstimate(body: {
  destination: string;
  checkIn?: string;
  checkOut?: string;
  flightDepartureDate?: string;
  flightReturnDate?: string;
  itineraryType?: string;
  adults?: number;
  rooms?: number;
  currency?: string;
  language?: string;
  regionId?: number;
}): Promise<{ estimate?: HotelEstimate; message?: string }> {
  return apiPost('/api/hotels/estimate', body);
}

/** Batch estimates for unique destination/date keys (server dedupes). */
export async function getHotelEstimatesBatch(body: {
  currency?: string;
  adults?: number;
  rooms?: number;
  language?: string;
  items: Array<{
    key: string;
    destination: string;
    checkIn: string;
    checkOut: string;
    adults?: number;
    rooms?: number;
    currency?: string;
  }>;
}): Promise<{ estimates?: Record<string, HotelEstimate>; message?: string }> {
  return apiPost('/api/hotels/estimate', body);
}

export async function getTripEstimate(body: {
  destination: string;
  flightOptionId?: string;
  flightPriceAmount: number;
  flightPriceCurrency: string;
  departureDate?: string;
  returnDate?: string;
  itineraryType?: string;
  adults?: number;
  rooms?: number;
  currency?: string;
  label?: string;
  checkIn?: string;
  checkOut?: string;
}): Promise<TripDeal> {
  return apiPost<TripDeal>('/api/trips/estimate', body);
}
