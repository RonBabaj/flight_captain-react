import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import type { CreateSearchSessionRequest } from '../../../types';
import { ANYWHERE_CODE, isCountryDestination, parseCountryDestination } from '../../../types';
import { searchActions } from '../../../store';
import { useTheme } from '../../../theme/ThemeContext';
import { useLocale } from '../../../context/LocaleContext';
import { SearchFormContent } from '../components/SearchFormContent';
import { SearchLoadingOverlay } from '../../../components/SearchLoadingOverlay';
import { getCachedSearch, setCachedSearch } from '../../../utils/searchCache';
import { useSearchParams, updateSearchUrl, parseSearchParamsFromUrl } from '../../../hooks/useSearchParams';
import { clampExploreSearchDates } from '../../../utils/bookableDates';
import { flushActiveAutocomplete } from '../../../utils/placeSearch';
import { classicSearchPayload } from '../../../utils/skyscanner';

const defaultParams: CreateSearchSessionRequest = {
  origin: '',
  destination: '',
  departureDate: '',
  returnDate: '',
  cabinClass: 'ECONOMY',
  cabinPreference: 'ECONOMY',
  includeCheckedBag: false,
  adults: 1,
  children: 0,
  infants: 0,
  currency: 'USD',
  locale: 'en-US',
};

export function SearchFormScreen({ navigation }: { navigation: any }) {
  const { theme } = useTheme();
  const { currency, locale, t } = useLocale();
  const { paramsFromUrl, updateUrl } = useSearchParams();
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('round-trip');
  const [params, setParams] = useState<CreateSearchSessionRequest>(() => {
    const cached = getCachedSearch();
    const fromUrl = paramsFromUrl;
    const merged = { ...defaultParams, ...cached, ...fromUrl };
    const cabin = merged.cabinClass;
    const cabinClass =
      cabin === 'ECONOMY' || cabin === 'PREMIUM_ECONOMY' || cabin === 'BUSINESS' || cabin === 'FIRST'
        ? cabin
        : 'ECONOMY';
    return {
      ...merged,
      cabinClass,
      cabinPreference: cabinClass,
      adults: merged.adults ?? 1,
      children: merged.children ?? 0,
      infants: merged.infants ?? 0,
    };
  });

  useEffect(() => {
    const sid = paramsFromUrl.sessionId;
    if (sid && typeof window !== 'undefined') {
      // Pass sessionId='' so Results resolves it from the URL, not from a fixed route
      // param. That lets the expired-session recovery clear the URL sessionId and have
      // routeSessionId fall to '' so the bootstrap effect can re-run the search.
      navigation.navigate('Results', { sessionId: '' });
    }
  }, [paramsFromUrl.sessionId, navigation]);

  // Do not merge URL on every render — that overwrote destination when switching Anywhere → real airport
  // while the URL still had destination=ANYWHERE. Re-apply from URL only on browser history navigation.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onPopState = () => {
      const url = parseSearchParamsFromUrl();
      if (url.origin || url.destination || url.departureDate) {
        setParams((prev) => ({ ...prev, ...url }));
        setTripType(url.returnDate ? 'round-trip' : 'one-way');
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof CreateSearchSessionRequest>(
    key: K,
    value: CreateSearchSessionRequest[K]
  ) => {
    setParams((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'destination' && typeof value === 'string') {
        const v = value.trim().toUpperCase();
        if (v && v !== ANYWHERE_CODE) {
          updateSearchUrl({
            origin: next.origin,
            destination: v,
            departureDate: next.departureDate,
            returnDate: next.returnDate,
            adults: next.adults,
            children: next.children,
            currency: next.currency,
            cabinClass: next.cabinClass,
          });
        }
      }
      return next;
    });
  };

  const handleSearch = async () => {
    await flushActiveAutocomplete();

    if (!params.origin.trim() || !params.destination.trim()) {
      setError(t('please_fill_origin_destination'));
      return;
    }

    const destUpper = params.destination.trim().toUpperCase();

    if (isCountryDestination(destUpper)) {
      const dr = clampExploreSearchDates(
        params.departureDate || undefined,
        params.returnDate || undefined,
        tripType === 'round-trip',
      );
      navigation.navigate('Explore', {
        origin: params.origin.trim().toUpperCase(),
        departureDate: dr.departureDate,
        returnDate: tripType === 'one-way' ? undefined : dr.returnDate || undefined,
        adults: params.adults ?? 1,
        currency: currency || 'USD',
        countryFilter: parseCountryDestination(destUpper) ?? undefined,
        searchNonce: Date.now(),
      });
      return;
    }

    // "Anywhere" — navigate to the explore screen instead of running a regular search
    if (destUpper === ANYWHERE_CODE) {
      const dr = clampExploreSearchDates(
        params.departureDate || undefined,
        params.returnDate || undefined,
        tripType === 'round-trip',
      );
      navigation.navigate('Explore', {
        origin: params.origin.trim().toUpperCase(),
        departureDate: dr.departureDate,
        returnDate: tripType === 'one-way' ? undefined : dr.returnDate || undefined,
        adults: params.adults ?? 1,
        currency: currency || 'USD',
        searchNonce: Date.now(),
      });
      return;
    }

    if (!params.departureDate) {
      setError(t('please_fill_origin_destination'));
      return;
    }
    if (tripType === 'round-trip' && !params.returnDate) {
      setError(t('please_choose_return'));
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const cabin: CreateSearchSessionRequest['cabinClass'] =
        params.cabinClass === 'ECONOMY' || params.cabinClass === 'PREMIUM_ECONOMY' ||
        params.cabinClass === 'BUSINESS' || params.cabinClass === 'FIRST'
          ? params.cabinClass
          : 'ECONOMY';
      const payload: CreateSearchSessionRequest = classicSearchPayload(params, {
        origin: params.origin.trim().toUpperCase(),
        destination: params.destination.trim().toUpperCase(),
        returnDate: tripType === 'one-way' ? undefined : params.returnDate || undefined,
        cabinClass: cabin,
        cabinPreference: cabin as CreateSearchSessionRequest['cabinPreference'],
        includeCheckedBag: false,
        currency: currency || 'USD',
        locale: locale || 'en-US',
      });
      setCachedSearch(payload);
      // Optimistic navigation: create the session after the Results screen mounts.
      // beginSearch bumps generation + clears prior results so a late poll cannot
      // paint the previous route under the new summary header.
      searchActions.beginSearch(payload);
      // Clear any previous sessionId from the URL so Results does not poll a stale id.
      updateUrl(payload);
      navigation.navigate({
        name: 'Results',
        params: { sessionId: '', searchNonce: Date.now() },
        merge: false,
      } as any);
    } catch (e) {
      setError(e instanceof Error ? e.message : t('search_failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.screenBg }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <SearchFormContent
          params={params}
          update={update}
          tripType={tripType}
          setTripType={setTripType}
          onSearch={handleSearch}
          loading={loading}
          error={error}
        />
      </ScrollView>
      <SearchLoadingOverlay
        visible={loading}
        origin={params.origin || undefined}
        destination={params.destination || undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 48, maxWidth: 640, alignSelf: 'center', width: '100%' },
});
