import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HotelSearchPrefill } from '../types/hotels';

/** Params shared by both the search-stack and deals-stack Explore screens. */
export type ExploreScreenParams =
  | {
      mode?: 'search';
      origin: string;
      departureDate?: string;
      returnDate?: string;
      adults: number;
      currency: string;
    }
  | {
      mode: 'deals';
      origin: string;
      departureDate: string;
      returnDate: string;
      adults: number;
      currency: string;
      year: number;
      month: number;
      durationDays: number;
      children: number;
      nonStop: boolean;
    };

export type SearchStackParamList = {
  SearchForm: undefined;
  Results: { sessionId: string };
  Explore: ExploreScreenParams;
};

export type RootTabParamList = {
  Search: undefined;
  MonthDeals: undefined;
  HotelDeals: HotelSearchPrefill | undefined;
};

export type RootStackParamList = {
  Home: undefined;
  Search: undefined;
  MonthDeals: undefined;
  HotelDeals: HotelSearchPrefill | undefined;
  FlyFixRefine: undefined;
};

export type SearchFormProps = NativeStackScreenProps<SearchStackParamList, 'SearchForm'>;
export type ResultsProps = NativeStackScreenProps<SearchStackParamList, 'Results'>;

export type MonthDealsStackParamList = {
  MonthDealsForm: undefined;
  MonthDealsResults: undefined;
  Explore: ExploreScreenParams;
};

export type HotelDealsStackParamList = {
  HotelDealsForm: HotelSearchPrefill | undefined;
  HotelDealsResults: HotelSearchPrefill | undefined;
};
