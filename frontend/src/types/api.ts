/**
 * TypeScript types aligned with backend API contracts.
 * Backend normalizes Google Flights 2 results into these shapes.
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
  operatingFlightNumber?: string;
  durationMinutes: number;
  cabinClass: string;
  bookingClass?: string;
}

// --- Flight leg (outbound or return, can have multiple segments) ---

export interface FlightLeg {
  segments: FlightSegment[];
}

// --- Outbound summary (canonical; used by result card and details modal) ---

export interface LayoverSummary {
  airportCode: string;
  minutes: number;
}

export interface OutboundSummary {
  departureTime: string;   // ISO 8601
  arrivalTime: string;
  durationMinutes: number;
  stopsCount: number;
  layovers?: LayoverSummary[];
}

// --- Flight option (one bookable result) ---

export type BaggageClass = 'BAG_OK' | 'BAG_UNKNOWN' | 'BAG_INCLUDED';

/** One way to book the same physical flight (e.g. different marketing carrier or provider). */
export interface SellerOption {
  carrierCode: string;
  provider?: string;
  vendorName?: string;
  price: MonetaryAmount;
  bookingUrl?: string;
}

export interface FlightOption {
  id: string;
  price: MonetaryAmount;
  /** Raw provider price before any server-side normalization (if applied). */
  originalPrice?: MonetaryAmount;
  /** True if the server normalized the price (e.g., uplift heuristic). */
  priceIsEstimate?: boolean;
  durationMinutes: number;
  legs: FlightLeg[];
  fare?: FareBreakdown;
  outboundSummary?: OutboundSummary;
  score?: number;
  provider?: string;
  source?: string;  // "googleflights2" | "kiwi" | …
  validatingAirlines?: string[];
  primaryDisplayCarrier?: string;
  baggageClass?: BaggageClass;
  deepLink?: string;    // booking URL when present
  vendorName?: string;  // OTA name (kayak/expedia/kiwi etc)
  /** True when itinerary is self-transfer / virtual interlining (separate tickets). */
  selfTransfer?: boolean;
  /** User-facing warning when selfTransfer is true. */
  selfTransferWarning?: string;
  fetchedAt?: string;
  // Codeshare / multi-seller (additive)
  primaryMarketingCarrier?: string;
  primaryOperatingCarrier?: string;
  isCodeshare?: boolean;
  marketedBy?: string[];
  cheapestSeller?: string;
  sellerOptions?: SellerOption[];
}

// --- Search session ---

export type SearchSessionStatus = 'PENDING' | 'PARTIAL' | 'COMPLETE' | 'FAILED';

export interface ExtraSearchLeg {
  origin: string;
  destination: string;
  date: string; // YYYY-MM-DD
}

export interface CreateSearchSessionRequest {
  origin: string;
  destination: string;
  departureDate: string; // YYYY-MM-DD
  returnDate?: string;   // omit for one-way
  /** Open-jaw: return leg departs from this airport (defaults to destination). */
  returnOrigin?: string;
  /** Open-jaw: return leg arrives here (defaults to origin). */
  returnDestination?: string;
  /** Extra one-way hops between outbound and return (dynamic destinations). */
  extraLegs?: ExtraSearchLeg[];
  cabinClass: string;    // ECONOMY | PREMIUM_ECONOMY | BUSINESS | FIRST
  cabinPreference?: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
  includeCheckedBag?: boolean;
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
  stops?: number;           // outbound stop count (0 = direct)
  carriers?: string[];      // outbound marketing carrier codes
  outboundPath?: string[];  // ordered airport codes e.g. ["TLV","ADD","BKK","HND"]
  returnPath?: string[];    // ordered airport codes e.g. ["HND","DOH","LCA","TLV"]
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
  total?: number;
  adultsTotal?: number;
  childrenTotal?: number;
  infantsTotal?: number;
  adultsCount?: number;
  childrenCount?: number;
  infantsCount?: number;
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
  /** Short-lived session for Book now → partner checkout resolve */
  sessionId?: string;
  optionId?: string;
}

// Fare breakdown for a live search option (same shape as for monthly deals).
// Attached to FlightOption when the backend can derive per-type totals.

// --- Airport / city autocomplete ---

export type AirportCityType = 'AIRPORT' | 'CITY' | 'COUNTRY';

export interface AirportCityResult {
  id: string;
  type: AirportCityType;
  airportCode?: string;
  cityCode?: string;
  name: string;
  cityName?: string;
  countryCode?: string;
  /** Localized city name (Hebrew) for search/display */
  cityNameHe?: string;
  /** Localized city name (Russian) for search/display */
  cityNameRu?: string;
  /** Localized airport name (Hebrew) for display */
  nameHe?: string;
  /** Localized airport name (Russian) for display */
  nameRu?: string;
}

export interface AirportCitySearchResponse {
  items: AirportCityResult[];
}

// Special code used when the user selects "Anywhere" as the destination.
export const ANYWHERE_CODE = 'ANYWHERE';

/** Prefix for destination = explore/filter by country (ISO 3166-1 alpha-2). */
export const COUNTRY_DEST_PREFIX = 'COUNTRY:';

export function isCountryDestination(code: string | null | undefined): boolean {
  return typeof code === 'string' && code.trim().toUpperCase().startsWith(COUNTRY_DEST_PREFIX);
}

export function makeCountryDestination(countryCode: string): string {
  return `${COUNTRY_DEST_PREFIX}${countryCode.trim().toUpperCase()}`;
}

export function parseCountryDestination(code: string | null | undefined): string | null {
  if (!isCountryDestination(code)) return null;
  const cc = code!.trim().slice(COUNTRY_DEST_PREFIX.length).toUpperCase();
  return /^[A-Z]{2}$/.test(cc) ? cc : null;
}

// A single destination returned by the /api/explore endpoint (Amadeus Flight Inspiration).
export type ExplorePriceSource = 'live' | 'cached' | 'estimated';

export interface ExploreDestination {
  destination: string;
  price: string;
  currency: string;
  departureDate?: string;
  /** live = fresh GF2; cached = 24h server cache; estimated = distance-only hint until searched (not a quote) */
  priceSource?: ExplorePriceSource;
}
