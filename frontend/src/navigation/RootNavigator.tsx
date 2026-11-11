import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SearchStack } from './SearchStack';
import { TopNavMenu } from './TopNavMenu';
import type { RootStackParamList } from './types';
import { MonthDealsStack } from './MonthDealsStack';
import { DynamicDestinationsStack } from './DynamicDestinationsStack';
import { LandingScreen } from '../features/landing';
import { SettingsScreen } from '../features/settings/screens/SettingsScreen';
import { AccountScreen } from '../features/account/screens/AccountScreen';
import { LoginScreen } from '../features/auth/screens/LoginScreen';
import { RegisterScreen } from '../features/auth/screens/RegisterScreen';
import { AdminHubScreen } from '../features/admin/screens/AdminHubScreen';
import { AdminRuntimeConfigScreen } from '../features/admin/screens/AdminRuntimeConfigScreen';
import { AdminUsersScreen } from '../features/admin/screens/AdminUsersScreen';
import {
  ContactScreen,
  NotFoundScreen,
  PrivacyScreen,
  TermsScreen,
} from '../features/legal';

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
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Account" component={AccountScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Admin" component={AdminHubScreen} />
      <Stack.Screen name="AdminRuntimeConfig" component={AdminRuntimeConfigScreen} />
      <Stack.Screen name="AdminUsers" component={AdminUsersScreen} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} />
      <Stack.Screen name="Terms" component={TermsScreen} />
      <Stack.Screen name="Contact" component={ContactScreen} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} />
    </Stack.Navigator>
  );
}
