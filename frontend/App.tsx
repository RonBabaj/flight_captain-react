import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { ThemeProvider } from './src/theme/ThemeContext';
import { LocaleProvider, useLocale } from './src/context/LocaleContext';
import { IconFontsProvider } from './src/components/IconFontsContext';
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

const iconFonts = {
  ...Ionicons.font,
  ...MaterialIcons.font,
  ...Feather.font,
};

export default function App() {
  const [fontsLoaded, fontsError] = useFonts(iconFonts);
  const [showAfterTimeout, setShowAfterTimeout] = useState(false);

  useExchangeRates();

  useEffect(() => {
    const t = setTimeout(() => setShowAfterTimeout(true), 8000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    // Log API base URL on startup for quick diagnostics.
    // eslint-disable-next-line no-console
    console.log('[API_BASE_URL]', API_BASE);
  }, []);

  const ready = fontsLoaded || fontsError !== null || showAfterTimeout;
  const iconFontsReady = fontsLoaded && fontsError === null;

  if (!ready) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider defaultMode="dark">
        <IconFontsProvider loaded={iconFontsReady}>
          <LocaleProvider>
            <RTLWrapper>
              <NavigationContainer linking={linking}>
                <StatusBar style="auto" />
                <RootNavigator />
              </NavigationContainer>
            </RTLWrapper>
          </LocaleProvider>
        </IconFontsProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
