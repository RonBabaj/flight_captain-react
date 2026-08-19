/**
 * Dynamic Destinations — open-jaw and multi-city trips.
 * Fly outbound A→B, optional extra hops, then return C→D (usually D=A).
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../../theme/ThemeContext';
import { useLocale } from '../../../context/LocaleContext';
import { SearchLoadingOverlay } from '../../../components/SearchLoadingOverlay';
import { createSearchSession, getSearchSessionResults } from '../../../api';
import { searchActions, isCurrentSearchGeneration } from '../../../store';
import type { CreateSearchSessionRequest, ExtraSearchLeg } from '../../../types';
import type { DynamicDestinationsStackParamList } from '../../../navigation/types';
import { DynamicDestinationsFormContent } from '../components/DynamicDestinationsFormContent';
import {
  addExtraDestinationLeg,
  MAX_EXTRA_DESTINATIONS,
  patchDynamicDestinationsParams,
  patchExtraLeg,
  removeExtraDestinationLeg,
  validateDynamicDestinationsSearch,
} from '../../../utils/dynamicDestinations';

type Nav = NativeStackNavigationProp<DynamicDestinationsStackParamList, 'DynamicDestinationsForm'>;

const defaultParams: CreateSearchSessionRequest = {
  origin: '',
  destination: '',
  departureDate: '',
  returnDate: '',
  returnOrigin: '',
  returnDestination: '',
  extraLegs: [],
  cabinClass: 'ECONOMY',
  cabinPreference: 'ECONOMY',
  includeCheckedBag: false,
  adults: 1,
  children: 0,
  infants: 0,
  currency: 'USD',
  locale: 'en-US',
};

export function DynamicDestinationsScreen({ navigation }: { navigation: Nav }) {
  const { theme } = useTheme();
  const { t, currency, locale } = useLocale();
  const [params, setParams] = useState<CreateSearchSessionRequest>({
    ...defaultParams,
    currency,
    locale,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof CreateSearchSessionRequest>(
    key: K,
    value: CreateSearchSessionRequest[K],
  ) => {
    setParams((prev) => patchDynamicDestinationsParams(prev, key, value));
  };

  const updateExtra = (index: number, patch: Partial<ExtraSearchLeg>) => {
    setParams((prev) => patchExtraLeg(prev, index, patch));
  };

  const addExtraDestination = () => {
    setParams((prev) => {
      if ((prev.extraLegs ?? []).length >= MAX_EXTRA_DESTINATIONS) {
        setError(t('dd_max_extras'));
        return prev;
      }
      setError(null);
      return addExtraDestinationLeg(prev);
    });
  };

  const removeExtraDestination = (index: number) => {
    setParams((prev) => removeExtraDestinationLeg(prev, index));
  };

  const onSearch = async () => {
    const validated = validateDynamicDestinationsSearch(params, t, currency, locale);
    if (!validated.ok) {
      setError(validated.error);
      return;
    }
    const payload = validated.payload;

    setError(null);
    setLoading(true);
    searchActions.setLoading(true);
    searchActions.setError(null);
    try {
      const generation = searchActions.beginSearch(payload);
      const session = await createSearchSession(payload);
      if (!isCurrentSearchGeneration(generation)) return;
      const res = await getSearchSessionResults(session.id, undefined, payload);
      if (!isCurrentSearchGeneration(generation)) return;
      const applied = searchActions.applySessionResults({
        generation,
        sessionId: session.id,
        session: res.session ?? session,
        status: res.session?.status ?? session.status,
        results: res.results ?? [],
        version: res.version ?? 1,
        mode: 'replace',
      });
      if (!applied) return;
      navigation.navigate('Results', { sessionId: session.id });
    } catch (e) {
      const msg = e instanceof Error ? e.message : t('search_failed');
      setError(msg);
      searchActions.setError(msg);
    } finally {
      setLoading(false);
      searchActions.setLoading(false);
    }
  };

  return (
    <View style={[styles.page, { backgroundColor: theme.screenBg }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <DynamicDestinationsFormContent
          params={params}
          update={update}
          updateExtra={updateExtra}
          addExtraDestination={addExtraDestination}
          removeExtraDestination={removeExtraDestination}
          onSearch={onSearch}
          loading={loading}
          error={error}
        />
      </ScrollView>

      <SearchLoadingOverlay
        visible={loading}
        origin={params.origin}
        destination={params.destination}
        extraLegs={params.extraLegs ?? []}
        returnOrigin={params.returnOrigin}
        returnDestination={params.returnDestination || params.origin}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 40, maxWidth: 720, width: '100%', alignSelf: 'center' },
});
