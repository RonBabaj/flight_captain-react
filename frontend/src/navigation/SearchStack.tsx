import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SearchFormScreen, ResultsScreen } from '../features/flight-search/screens';
import type { SearchStackParamList } from './types';

const Stack = createNativeStackNavigator<SearchStackParamList>();

export function SearchStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SearchForm" component={SearchFormScreen} />
      <Stack.Screen name="Results" component={ResultsScreen} />
    </Stack.Navigator>
  );
}
