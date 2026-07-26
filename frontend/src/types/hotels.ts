/**
 * Hotel / trip deal types aligned with backend search/hotels models.
 * RateHawk credentials never appear here — frontend talks only to Fly-Fix API.
 */

import type { MonetaryAmount } from './api';

export type HotelPriceStatus = 'estimated' | 'live' | 'confirmed';

export interface HotelGeoPoint {
  latitude: number;
  longitude: number;
}

export interface HotelOffer {
  hotelId: string;
  provider: string;
  providerHid?: number;
  name: string;
  destination?: string;
  country?: string;
  address?: string;
  location?: HotelGeoPoint;
  starRating?: number;
  guestRating?: number;
  reviewCount?: number;
  roomType?: string;
  boardType?: string;
  hasBreakfast?: boolean;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalPrice: MonetaryAmount;
  pricePerNight: MonetaryAmount;
  currency: string;
  cancellationPolicy?: string;
  refundable: boolean;
  freeCancellationBefore?: string;
  roomAvailability?: number;
  photos?: string[];
  amenities?: string[];
  deepLink?: string;
  priceStatus: HotelPriceStatus;
}

export interface HotelEstimate {
  destination: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  rooms: number;
  guests: number;
  totalPrice?: MonetaryAmount;
  pricePerNight?: MonetaryAmount;
  currency: string;
  priceStatus: HotelPriceStatus;
  sampleHotelId?: string;
  sampleName?: string;
  hotelCount?: number;
  available: boolean;
  message?: string;
  provider?: string;
  cached?: boolean;
}

export interface HotelDestinationSuggestion {
  id: string;
  name: string;
  type: string;
  countryCode?: string;
  regionId?: number;
  hotelId?: string;
  providerHid?: number;
}

export interface HotelSearchRequest {
  destination: string;
  regionId?: number;
  latitude?: number;
  longitude?: number;
  checkIn: string;
  checkOut: string;
  adults: number;
  childrenAges?: number[];
  rooms: number;
  currency?: string;
  language?: string;
  minStarRating?: number;
  maxStarRating?: number;
  minGuestRating?: number;
  minPrice?: number;
  maxPrice?: number;
  freeCancellation?: boolean;
  breakfastIncluded?: boolean;
  propertyTypes?: string[];
  sort?: 'cheapest' | 'best_value' | 'highest_rated' | 'most_popular';
  hotelsLimit?: number;
}

export interface HotelSearchResponse {
  results: HotelOffer[];
  count: number;
  provider?: string;
  priceStatus: HotelPriceStatus;
  message?: string;
}

export interface TripDeal {
  id: string;
  label?: string;
  destination: string;
  checkIn?: string;
  checkOut?: string;
  flightOptionId?: string;
  flightPrice: MonetaryAmount;
  hotelEstimate?: HotelEstimate;
  hotelOffer?: HotelOffer;
  hotelPrice?: MonetaryAmount;
  estimatedTotal?: MonetaryAmount;
  liveTotal?: MonetaryAmount;
  totalPriceStatus: HotelPriceStatus;
  currency: string;
  providers?: string[];
  message?: string;
}

/** Prefill params when navigating from flight results → Hotel Deals. */
export interface HotelSearchPrefill {
  destination?: string;
  regionId?: number;
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  rooms?: number;
  autoSearch?: boolean;
}
