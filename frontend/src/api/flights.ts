import { apiGet } from './client';
import type { FlightDetailsResponse } from '../types';

const FLIGHT_DETAILS_PATH = '/api/flights/details';

export interface GetFlightDetailsParams {
  origin: string;
  destination: string;
  date: string; // YYYY-MM-DD outbound
  durationDays: number;
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
  return apiGet<FlightDetailsResponse>(`${FLIGHT_DETAILS_PATH}?${q.toString()}`);
}

