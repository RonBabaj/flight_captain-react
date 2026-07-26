import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useRoute } from '@react-navigation/native';
import type { HotelDealsStackParamList, RootStackParamList } from './types';
import type { RouteProp } from '@react-navigation/native';
import { HotelDealsScreen } from '../features/hotel-search/screens';
import { ErrorBoundary } from '../components/ErrorBoundary';

const Stack = createNativeStackNavigator<HotelDealsStackParamList>();

export function HotelDealsStack() {
  const route = useRoute<RouteProp<RootStackParamList, 'HotelDeals'>>();
  const prefill = route.params;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HotelDealsForm" initialParams={prefill}>
        {(props) => (
          <ErrorBoundary title="Hotel Deals crashed">
            <HotelDealsScreen {...(props as any)} view="form" />
          </ErrorBoundary>
        )}
      </Stack.Screen>
      <Stack.Screen name="HotelDealsResults" initialParams={prefill}>
        {(props) => (
          <ErrorBoundary title="Hotel Deals crashed">
            <HotelDealsScreen {...(props as any)} view="results" />
          </ErrorBoundary>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
