import type { NavigationProp, ParamListBase } from '@react-navigation/native';
import { StackActions } from '@react-navigation/native';
import { buildSearchString, type SearchUrlState } from '../hooks/useSearchParams';

export type SearchResultsNavParams = {
  sessionId?: string;
  searchNonce?: number;
  optionId?: string;
  flightId?: string;
};

/** SPA pathname for Results within the current product area (search / deals / DD). */
export function resultsPathForCurrentArea(): string {
  if (typeof window === 'undefined') return '/search/results';
  const p = window.location.pathname || '';
  if (p.includes('monthly-deals')) return '/monthly-deals/results';
  if (p.includes('dynamic-destinations')) return '/dynamic-destinations/results';
  return '/search/results';
}

/** Keep the address bar on the Results route before the stack transitions (web deep-link + refresh). */
export function pushSearchResultsUrl(searchFields: SearchUrlState): void {
  if (typeof window === 'undefined') return;
  const q = buildSearchString(searchFields);
  const path = resultsPathForCurrentArea();
  window.history.pushState({}, '', q ? `${path}?${q}` : path);
}

/**
 * Move to Results after beginSearch. Uses replace (not push) so the form screen
 * cannot remain focused under a blank viewport on web; syncs `/search/results` URL.
 */
export function goToSearchResults(
  navigation: NavigationProp<ParamListBase>,
  params: SearchResultsNavParams,
  urlState?: SearchUrlState,
): void {
  if (urlState) {
    pushSearchResultsUrl(urlState);
  }
  const routeParams = urlState
  ? {
      ...urlState,
      sessionId: params.sessionId ?? urlState.sessionId ?? '',
      searchNonce: params.searchNonce,
      optionId: params.optionId ?? urlState.optionId,
      flightId: params.flightId ?? urlState.flightId,
    }
  : params;
  navigation.dispatch(StackActions.replace('Results', routeParams));
}