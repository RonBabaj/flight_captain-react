import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DynamicDestinationsScreen } from '../features/dynamic-destinations/screens';
import { ResultsScreen } from '../features/flight-search/screens';
import type { DynamicDestinationsStackParamList } from './types';

const Stack = createNativeStackNavigator<DynamicDestinationsStackParamList>();

export function DynamicDestinationsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DynamicDestinationsForm" component={DynamicDestinationsScreen} />
      {/* Named "Results" so shared ResultsScreen navigation.navigate('Results') works. */}
      <Stack.Screen name="Results" component={ResultsScreen} />
    </Stack.Navigator>
  );
}
