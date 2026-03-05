import { apiGet } from './client';
import type { FlightDetailsResponse } from '../types';

const FLIGHT_DETAILS_PATH = '/api/flights/details';

export interface GetFlightDetailsParams {
  origin: string;
  destination: string;
  date: string; // YYYY-MM-DD outbound
  durationDays: number;
  currency?: string;
  adults?: number;
  children?: number;
}

export async function getFlightDetails(
  params: GetFlightDetailsParams
): Promise<FlightDetailsResponse> {
  const q = new URLSearchParams({
    origin: params.origin,
    destination: params.destination,
    date: params.date,
    durationDays: String(params.durationDays),
  });
  if (params.currency) {
    q.set('currency', params.currency);
  }
  if (params.adults != null && params.adults >= 1) {
    q.set('adults', String(params.adults));
  }
  if (params.children != null && params.children > 0) {
    q.set('children', String(params.children));
  }
  return apiGet<FlightDetailsResponse>(`${FLIGHT_DETAILS_PATH}?${q.toString()}`);
}

