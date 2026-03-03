import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SearchStack } from './SearchStack';
import { MonthDealsScreen } from '../features/monthly-deals/screens';
import type { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

export function RootNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1a73e8',
      }}
    >
      <Tab.Screen
        name="Search"
        component={SearchStack}
        options={{ tabBarLabel: 'Search' }}
      />
      <Tab.Screen
        name="MonthDeals"
        component={MonthDealsScreen}
        options={{ tabBarLabel: 'Monthly Deals' }}
      />
    </Tab.Navigator>
  );
}
