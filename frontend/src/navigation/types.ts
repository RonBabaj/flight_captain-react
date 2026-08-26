import type { NativeStackScreenProps } from '@react-navigation/native-stack';

/** Params shared by both the search-stack and deals-stack Explore screens. */
export type ExploreScreenParams =
  | {
      mode?: 'search';
      origin: string;
      departureDate?: string;
      returnDate?: string;
      adults: number;
      currency: string;
      /** ISO country code — filter explore results to this country. */
      countryFilter?: string;
      /** Bumps on each navigation so a kept-alive Explore screen refetches. */
      searchNonce?: number;
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
      countryFilter?: string;
      searchNonce?: number;
    };

export type SearchStackParamList = {
  SearchForm: undefined;
  Results: { sessionId: string };
  Explore: ExploreScreenParams;
};

export type RootTabParamList = {
  Search: undefined;
  MonthDeals: undefined;
};

export type RootStackParamList = {
  Home: undefined;
  Search: undefined;
  MonthDeals: undefined;
  DynamicDestinations: undefined;
  FlyFixRefine: undefined;
  Settings: undefined;
  Login: undefined;
  Register: undefined;
};

export type SearchFormProps = NativeStackScreenProps<SearchStackParamList, 'SearchForm'>;
export type ResultsProps = NativeStackScreenProps<SearchStackParamList, 'Results'>;

export type MonthDealsStackParamList = {
  MonthDealsForm: undefined;
  MonthDealsResults: undefined;
  Explore: ExploreScreenParams;
};

export type DynamicDestinationsStackParamList = {
  DynamicDestinationsForm: undefined;
  Results: { sessionId: string };
};
