import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { MonthDealsStackParamList } from './types';
import { MonthDealsScreen } from '../features/monthly-deals/screens';
import { ErrorBoundary } from '../components/ErrorBoundary';

const Stack = createNativeStackNavigator<MonthDealsStackParamList>();

export function MonthDealsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MonthDealsForm">
        {(props) => (
          <ErrorBoundary title="Monthly Deals crashed">
            <MonthDealsScreen {...(props as any)} view="form" />
          </ErrorBoundary>
        )}
      </Stack.Screen>
      <Stack.Screen name="MonthDealsResults">
        {(props) => (
          <ErrorBoundary title="Monthly Deals crashed">
            <MonthDealsScreen {...(props as any)} view="results" />
          </ErrorBoundary>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

