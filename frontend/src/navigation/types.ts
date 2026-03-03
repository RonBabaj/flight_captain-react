import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type SearchStackParamList = {
  SearchForm: undefined;
  Results: { sessionId: string };
};

export type RootTabParamList = {
  Search: undefined;
  MonthDeals: undefined;
};

export type SearchFormProps = NativeStackScreenProps<SearchStackParamList, 'SearchForm'>;
export type ResultsProps = NativeStackScreenProps<SearchStackParamList, 'Results'>;
