import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import type { CreateSearchSessionRequest } from '../../../types';
import { searchActions } from '../../../store';
import { createSearchSession } from '../../../api';
import { useTheme } from '../../../theme/ThemeContext';
import { useLocale } from '../../../context/LocaleContext';
import { SearchFormContent } from '../components/SearchFormContent';
import { SearchLoadingOverlay } from '../../../components/SearchLoadingOverlay';
import { getCachedSearch, setCachedSearch } from '../../../utils/searchCache';
import { useSearchParams } from '../../../hooks/useSearchParams';

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
      navigation.navigate('Results', { sessionId: sid });
    }
  }, [paramsFromUrl.sessionId, navigation]);

  useEffect(() => {
    if (paramsFromUrl.origin || paramsFromUrl.destination || paramsFromUrl.departureDate) {
      setParams((prev) => ({ ...prev, ...paramsFromUrl }));
      setTripType(paramsFromUrl.returnDate ? 'round-trip' : 'one-way');
    }
  }, [paramsFromUrl.origin, paramsFromUrl.destination, paramsFromUrl.departureDate, paramsFromUrl.returnDate]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof CreateSearchSessionRequest>(
    key: K,
    value: CreateSearchSessionRequest[K]
  ) => setParams((prev) => ({ ...prev, [key]: value }));

  const handleSearch = async () => {
    if (!params.origin.trim() || !params.destination.trim() || !params.departureDate) {
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
      const payload: CreateSearchSessionRequest = {
        ...params,
        origin: params.origin.trim().toUpperCase(),
        destination: params.destination.trim().toUpperCase(),
        returnDate: tripType === 'one-way' ? undefined : params.returnDate || undefined,
        cabinClass: cabin,
        cabinPreference: cabin as CreateSearchSessionRequest['cabinPreference'],
        includeCheckedBag: false,
        currency: currency || 'USD',
        locale: locale || 'en-US',
      };
      setCachedSearch(payload);
      searchActions.setParams(payload);
      const session = await createSearchSession(payload);
      searchActions.setSession(session.id, session, session.status);
      searchActions.setResults([], 0);
      updateUrl({ ...payload, sessionId: session.id });
      navigation.navigate('Results', { sessionId: session.id });
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
