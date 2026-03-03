import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SearchFormScreen, ResultsScreen } from '../features/flight-search/screens';
import type { SearchStackParamList } from './types';

const Stack = createNativeStackNavigator<SearchStackParamList>();

export function SearchStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1a73e8' },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen
        name="SearchForm"
        component={SearchFormScreen}
        options={{ title: 'Flight Search' }}
      />
      <Stack.Screen
        name="Results"
        component={ResultsScreen}
        options={{ title: 'Results' }}
      />
    </Stack.Navigator>
  );
}
