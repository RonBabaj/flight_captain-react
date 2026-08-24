import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SearchStack } from './SearchStack';
import { TopNavMenu } from './TopNavMenu';
import type { RootStackParamList } from './types';
import { MonthDealsStack } from './MonthDealsStack';
import { DynamicDestinationsStack } from './DynamicDestinationsStack';
import { LandingScreen } from '../features/landing';
import { AdminSettingsScreen } from '../features/admin/screens/AdminSettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: () => <TopNavMenu />,
      }}
    >
      <Stack.Screen name="Home" component={LandingScreen} />
      <Stack.Screen name="Search" component={SearchStack} />
      <Stack.Screen name="MonthDeals" component={MonthDealsStack} />
      <Stack.Screen name="DynamicDestinations" component={DynamicDestinationsStack} />
      <Stack.Screen name="AdminSettings" component={AdminSettingsScreen} />
    </Stack.Navigator>
  );
}
