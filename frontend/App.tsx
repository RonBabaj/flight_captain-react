import React, { useCallback, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/theme/ThemeContext';
import { LocaleProvider, useLocale } from './src/context/LocaleContext';
import { RuntimeConfigProvider } from './src/context/RuntimeConfigContext';
import { AuthProvider } from './src/context/AuthContext';
import { RootNavigator } from './src/navigation';
import type { RootStackParamList } from './src/navigation/types';
import { API_BASE } from './src/api/client';
import { useExchangeRates } from './src/hooks/useExchangeRates';
import {
  captureSharedLinkFromLocation,
  readBootHref,
  readSharedLinkCache,
} from './src/utils/sharedLinkCache';

// Seed shared-link stash before NavigationContainer can rewrite the URL.
captureSharedLinkFromLocation();

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
  // Chrome/iOS often rewrites location to bare origin before RN reads it.
  // Prefer the href we stashed in index.html on first paint.
  getInitialURL: () => {
    if (typeof window === 'undefined') return null;
    const boot = readBootHref();
    if (boot) return boot;
    return window.location.href;
  },
  subscribe: (listener: (url: string) => void) => {
    if (typeof window === 'undefined') return () => {};
    const onChange = () => listener(window.location.href);
    window.addEventListener('popstate', onChange);
    window.addEventListener('hashchange', onChange);
    return () => {
      window.removeEventListener('popstate', onChange);
      window.removeEventListener('hashchange', onChange);
    };
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
  const navigationRef = useNavigationContainerRef<RootStackParamList>();
  const recoveredRef = useRef(false);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('[API_BASE_URL]', API_BASE);
  }, []);

  const recoverSharedLink = useCallback(() => {
    if (recoveredRef.current) return;
    if (!navigationRef.isReady()) return;
    const cached = readSharedLinkCache();
    if (!cached?.sessionId) return;
    recoveredRef.current = true;

    const path = (cached.pathname || '').toLowerCase();
    const params = {
      sessionId: cached.sessionId,
      optionId: cached.optionId,
      flightId: cached.flightId,
      origin: cached.origin,
      destination: cached.destination,
      departureDate: cached.departureDate,
      returnDate: cached.returnDate,
      returnOrigin: cached.returnOrigin,
      returnDestination: cached.returnDestination,
      adults: cached.adults,
      children: cached.children,
      currency: cached.currency,
      cabinClass: cached.cabinClass,
    };

    if (path.includes('dynamic-destinations')) {
      navigationRef.navigate('DynamicDestinations', {
        screen: 'Results',
        params,
      } as never);
    } else {
      navigationRef.navigate('Search', {
        screen: 'Results',
        params,
      } as never);
    }
  }, [navigationRef]);

  return (
    <SafeAreaProvider>
      <ThemeProvider defaultMode="dark">
        <LocaleProvider>
          <RuntimeConfigProvider>
            <AuthProvider>
              <RTLWrapper>
                <NavigationContainer
                  ref={navigationRef}
                  linking={linking}
                  onReady={recoverSharedLink}
                >
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
