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
// Seed shared-link stash before NavigationContainer can rewrite the URL.
import './src/utils/sharedLinkCache';

const linking = {
  prefixes: [
    'https://fly-fix.com',
    'https://www.fly-fix.com',
    ...(typeof window !== 'undefined' && window.location?.origin ? [window.location.origin] : []),
  ],
  config: {
    screens: {
      Home: '',
      Search: {
        path: 'search',
        screens: {
          SearchForm: '',
          Results: {
            path: 'results',
            parse: {
              sessionId: (v: string) => v,
              optionId: (v: string) => v,
              flightId: (v: string) => v,
              origin: (v: string) => v,
              destination: (v: string) => v,
              departureDate: (v: string) => v,
              returnDate: (v: string) => v,
              adults: (v: string) => v,
              children: (v: string) => v,
              currency: (v: string) => v,
              cabinClass: (v: string) => v,
            },
          },
          Explore: 'explore',
        },
      },
      MonthDeals: {
        path: 'monthly-deals',
        screens: {
          MonthDealsForm: '',
          MonthDealsResults: {
            path: 'results',
            parse: {
              sessionId: (v: string) => v,
              optionId: (v: string) => v,
              flightId: (v: string) => v,
            },
          },
          Explore: 'explore',
        },
      },
      DynamicDestinations: {
        path: 'dynamic-destinations',
        screens: {
          DynamicDestinationsForm: '',
          Results: {
            path: 'results',
            parse: {
              sessionId: (v: string) => v,
              optionId: (v: string) => v,
              flightId: (v: string) => v,
              origin: (v: string) => v,
              destination: (v: string) => v,
              departureDate: (v: string) => v,
              returnDate: (v: string) => v,
              returnOrigin: (v: string) => v,
              returnDestination: (v: string) => v,
              adults: (v: string) => v,
              children: (v: string) => v,
              currency: (v: string) => v,
              cabinClass: (v: string) => v,
            },
          },
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
