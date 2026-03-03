import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SearchStack } from './SearchStack';
import { MonthDealsScreen } from '../features/monthly-deals/screens';
import { TopNavMenu } from './TopNavMenu';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: () => <TopNavMenu />,
      }}
    >
      <Stack.Screen name="Search" component={SearchStack} />
      <Stack.Screen name="MonthDeals" component={MonthDealsScreen} />
    </Stack.Navigator>
  );
}
