/**
 * TypeScript types aligned with backend API contracts.
 * Backend normalizes Amadeus into these shapes.
 */

// --- Monetary & common ---

export interface MonetaryAmount {
  currency: string;
  amount: number;
}

export interface AirportLike {
  code: string;
  cityCode?: string;
  name?: string;
  cityName?: string;
  countryCode?: string;
}

export interface Carrier {
  code: string;
  name?: string;
}

// --- Flight segment (single flight) ---

export interface FlightSegment {
  from: AirportLike;
  to: AirportLike;
  departureTime: string; // ISO 8601
  arrivalTime: string;
  marketingCarrier: Carrier;
  operatingCarrier?: Carrier;
  flightNumber: string;
  durationMinutes: number;
  cabinClass: string;
  bookingClass?: string;
}

// --- Flight leg (outbound or return, can have multiple segments) ---

export interface FlightLeg {
  segments: FlightSegment[];
}

// --- Flight option (one bookable result) ---

export interface FlightOption {
  id: string;
  price: MonetaryAmount;
  durationMinutes: number;
  legs: FlightLeg[];
  score?: number;
  provider?: string;
}

// --- Search session ---

export type SearchSessionStatus = 'PENDING' | 'PARTIAL' | 'COMPLETE' | 'FAILED';

export interface CreateSearchSessionRequest {
  origin: string;
  destination: string;
  departureDate: string; // YYYY-MM-DD
  returnDate?: string;   // omit for one-way
  cabinClass: string;    // ECONOMY | PREMIUM_ECONOMY | BUSINESS | FIRST
  adults: number;
  children?: number;
  infants?: number;
  currency?: string;
  locale?: string;
}

export interface SearchSession {
  id: string;
  status: SearchSessionStatus;
  createdAt: string; // ISO 8601
  params: CreateSearchSessionRequest;
  expiresAt?: string;
}

export interface SearchSessionResultsResponse {
  session: SearchSession;
  version: number;
  results: FlightOption[];
}

// --- Monthly deals ---

export interface DayDeal {
  date: string; // YYYY-MM-DD
  lowestPrice?: MonetaryAmount;
  sampleOptionId?: string;
}

export interface MonthDealsResponse {
  route: {
    origin: AirportLike;
    destination: AirportLike;
  };
  year: number;
  month: number;
  currency: string;
  days: DayDeal[];
}

// --- Flight details for a specific deal/day ---

export interface FareBreakdown {
  currency: string;
  total: number;
}

export interface StopsSummary {
  outbound: number;
  return: number;
}

export interface FlightDetailsResponse {
  origin: AirportLike;
  destination: AirportLike;
  departureDate: string;
  returnDate: string;
  durationDays: number;
  outbound: FlightLeg;
  return: FlightLeg;
  totalPrice: MonetaryAmount;
  fare?: FareBreakdown;
  stops: StopsSummary;
}

// --- Airport / city autocomplete ---

export type AirportCityType = 'AIRPORT' | 'CITY';

export interface AirportCityResult {
  id: string;
  type: AirportCityType;
  airportCode?: string;
  cityCode?: string;
  name: string;
  cityName?: string;
  countryCode?: string;
}

export interface AirportCitySearchResponse {
  items: AirportCityResult[];
}
