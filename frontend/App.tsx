import React, { useEffect } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/theme/ThemeContext';
import { LocaleProvider, useLocale } from './src/context/LocaleContext';
import { RootNavigator } from './src/navigation';
import { API_BASE } from './src/api/client';
import { useExchangeRates } from './src/hooks/useExchangeRates';

const linking = {
  prefixes: [],
  config: {
    screens: {
      Search: {
        path: '',
        screens: {
          SearchForm: '',
          Results: 'results',
        },
      },
      MonthDeals: 'deals',
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
          <RTLWrapper>
            <NavigationContainer linking={linking}>
              <StatusBar style="auto" />
              <RootNavigator />
            </NavigationContainer>
          </RTLWrapper>
        </LocaleProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
