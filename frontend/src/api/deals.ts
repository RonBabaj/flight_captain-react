/**
 * Monthly deals API. Endpoints per backend contract.
 */

import { MonthDealsResponse } from '../types';
import { apiGet } from './client';

const DEALS_PATH = '/api/deals/month';

export interface GetMonthDealsParams {
  origin: string;
  destination: string;
  year: number;
  month: number;
  durationDays?: number;
}

/** Get cheapest price per day for a month. */
export async function getMonthDeals(
  params: GetMonthDealsParams
): Promise<MonthDealsResponse> {
  const q = new URLSearchParams({
    origin: params.origin,
    destination: params.destination,
    year: String(params.year),
    month: String(params.month),
  });
  if (params.durationDays != null) {
    q.set('durationDays', String(params.durationDays));
  }
  return apiGet<MonthDealsResponse>(`${DEALS_PATH}?${q.toString()}`);
}

export interface GetDealsRangeParams {
  origin: string;
  destination: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  durationDays?: number;
}

/** Get prices for a short date range (e.g. 14 days). Use for flight-search calendar to reduce backend load. */
export async function getDealsRange(
  params: GetDealsRangeParams
): Promise<MonthDealsResponse> {
  const q = new URLSearchParams({
    origin: params.origin,
    destination: params.destination,
    startDate: params.startDate,
    endDate: params.endDate,
  });
  if (params.durationDays != null) {
    q.set('durationDays', String(params.durationDays));
  }
  return apiGet<MonthDealsResponse>(`${DEALS_PATH}?${q.toString()}`);
}
