import type { NavigationContainerRefWithCurrent } from '@react-navigation/native';
import type { RootStackParamList } from './types';
import { parseSearchParamsFromUrl } from '../hooks/useSearchParams';
import { searchActions, useSearchStore } from '../store';
import type { CreateSearchSessionRequest } from '../types';
import { classicSearchPayload } from '../utils/skyscanner';

function isResultsPathname(pathname: string): boolean {
  const p = pathname.toLowerCase();
  return (
    p.includes('/search/results') ||
    p.includes('/monthly-deals/results') ||
    p.includes('/dynamic-destinations/results') ||
    p.endsWith('/results') ||
    p.endsWith('/results/')
  );
}

function nestedFocusedRoute(
  navigationRef: NavigationContainerRefWithCurrent<RootStackParamList>,
  stackName: 'Search' | 'MonthDeals' | 'DynamicDestinations',
): string | undefined {
  const root = navigationRef.getRootState();
  const stack = root?.routes?.find((r) => r.name === stackName);
  const state = stack?.state as { index?: number; routes?: { name: string }[] } | undefined;
  const idx = state?.index ?? 0;
  return state?.routes?.[idx]?.name;
}

/** Cold open on `/search/results?…` without sessionId — stack must land on Results and boot search. */
export function ensureParamOnlyResultsDeepLink(
  navigationRef: NavigationContainerRefWithCurrent<RootStackParamList>,
): void {
  if (typeof window === 'undefined' || !navigationRef.isReady()) return;

  const pathname = window.location.pathname || '';
  if (!isResultsPathname(pathname)) return;

  const urlP = parseSearchParamsFromUrl();
  const origin = (urlP.origin ?? '').trim();
  const destination = (urlP.destination ?? '').trim();
  const departureDate = (urlP.departureDate ?? '').trim();
  if (!origin || !destination || !departureDate) return;
  if ((urlP.sessionId ?? '').trim()) return;

  const stackName: 'Search' | 'MonthDeals' | 'DynamicDestinations' = pathname
    .toLowerCase()
    .includes('monthly-deals')
    ? 'MonthDeals'
    : pathname.toLowerCase().includes('dynamic-destinations')
      ? 'DynamicDestinations'
      : 'Search';

  const resultsScreen =
    stackName === 'MonthDeals' ? 'MonthDealsResults' : 'Results';
  const focused = nestedFocusedRoute(navigationRef, stackName);
  if (focused === resultsScreen) return;

  const store = useSearchStore.getState();
  if (store.sessionId) return;

  const base: CreateSearchSessionRequest = {
    origin: '',
    destination: '',
    departureDate: '',
    cabinClass: 'ECONOMY',
    cabinPreference: 'ECONOMY',
    includeCheckedBag: false,
    adults: 1,
    children: 0,
    infants: 0,
    currency: 'USD',
    locale: 'en-US',
    ...urlP,
  } as CreateSearchSessionRequest;
  const payload: CreateSearchSessionRequest = classicSearchPayload(base, {
      origin: origin.toUpperCase(),
      destination: destination.toUpperCase(),
      departureDate,
      returnDate: urlP.returnDate ? String(urlP.returnDate) : undefined,
      cabinClass: urlP.cabinClass ?? 'ECONOMY',
      cabinPreference: urlP.cabinClass ?? 'ECONOMY',
      includeCheckedBag: false,
      adults: urlP.adults ?? 1,
      children: urlP.children ?? 0,
      infants: 0,
      currency: urlP.currency ?? 'USD',
      locale: urlP.locale ?? 'en-US',
    },
  );

  if (store.status !== 'PENDING' || !store.params) {
    searchActions.beginSearch(payload);
  }

  const navParams = {
    sessionId: '',
    searchNonce: Date.now(),
    origin: payload.origin,
    destination: payload.destination,
    departureDate: payload.departureDate,
    returnDate: payload.returnDate,
    adults: payload.adults,
    children: payload.children,
    currency: payload.currency,
    cabinClass: payload.cabinClass,
  };

  if (stackName === 'DynamicDestinations') {
    navigationRef.navigate('DynamicDestinations', { screen: 'Results', params: navParams } as never);
  } else if (stackName === 'MonthDeals') {
    navigationRef.navigate('MonthDeals', { screen: resultsScreen, params: navParams } as never);
  } else {
    navigationRef.navigate('Search', { screen: 'Results', params: navParams } as never);
  }
}