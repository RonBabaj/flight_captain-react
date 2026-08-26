import React, { useEffect } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/theme/ThemeContext';
import { LocaleProvider, useLocale } from './src/context/LocaleContext';
import { RuntimeConfigProvider } from './src/context/RuntimeConfigContext';
import { AuthProvider } from './src/context/AuthContext';
import { RootNavigator } from './src/navigation';
import { API_BASE } from './src/api/client';
import { useExchangeRates } from './src/hooks/useExchangeRates';

const linking = {
  prefixes: [],
  config: {
    screens: {
      Home: '',
      Search: {
        path: 'search',
        screens: {
          SearchForm: '',
          Results: 'results',
          Explore: 'explore',
        },
      },
      MonthDeals: {
        path: 'monthly-deals',
        screens: {
          MonthDealsForm: '',
          MonthDealsResults: 'results',
          Explore: 'explore',
        },
      },
      DynamicDestinations: {
        path: 'dynamic-destinations',
        screens: {
          DynamicDestinationsForm: '',
          Results: 'results',
        },
      },
      Settings: {
        path: 'settings',
        alias: ['admin/settings'],
      },
      Login: 'login',
      Register: 'register',
    },
  },
};

function RTLWrapper({ children }: { children: React.ReactNode }) {
  const { isRTL } = useLocale();
  return (
    <View style={{ flex: 1, direction: isRTL ? 'rtl' : 'ltr' }}>
      {children}
    </View>
  );
}

export default function App() {
  useExchangeRates();

  useEffect(() => {
    // Log API base URL on startup for quick diagnostics.
    // eslint-disable-next-line no-console
    console.log('[API_BASE_URL]', API_BASE);
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider defaultMode="dark">
        <LocaleProvider>
          <RuntimeConfigProvider>
            <AuthProvider>
              <RTLWrapper>
                <NavigationContainer linking={linking}>
                  <StatusBar style="auto" />
                  <RootNavigator />
                </NavigationContainer>
              </RTLWrapper>
            </AuthProvider>
          </RuntimeConfigProvider>
        </LocaleProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
