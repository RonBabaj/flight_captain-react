import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import type { CreateSearchSessionRequest } from '../../../types';
import { searchActions } from '../../../store';
import { createSearchSession } from '../../../api';
import { useTheme } from '../../../theme/ThemeContext';
import { AirportAutocomplete } from '../components/AirportAutocomplete';
import { DateRangePicker } from '../components/DateRangePicker';
import { PassengerCabinPicker } from '../components/PassengerCabinPicker';
import { getCachedSearch, setCachedSearch } from '../../../utils/searchCache';

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
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('round-trip');
  const [params, setParams] = useState<CreateSearchSessionRequest>(() => {
    const cached = getCachedSearch();
    if (cached && typeof cached === 'object') {
      const cabin = cached.cabinClass;
      const cabinClass =
        cabin === 'ECONOMY' || cabin === 'PREMIUM_ECONOMY' || cabin === 'BUSINESS' || cabin === 'FIRST'
          ? cabin
          : 'ECONOMY';
      return {
        ...defaultParams,
        ...cached,
        cabinClass,
        cabinPreference: cabinClass,
        adults: cached.adults ?? 1,
        children: cached.children ?? 0,
        infants: cached.infants ?? 0,
      };
    }
    return defaultParams;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const themed = makeThemedStyles(theme);

  const update = <K extends keyof CreateSearchSessionRequest>(
    key: K,
    value: CreateSearchSessionRequest[K]
  ) => setParams((prev) => ({ ...prev, [key]: value }));

  const handleSearch = async () => {
    if (!params.origin.trim() || !params.destination.trim() || !params.departureDate) {
      setError('Please fill origin, destination and departure date.');
      return;
    }
    if (tripType === 'round-trip' && !params.returnDate) {
      setError('Please choose a return date.');
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
        includeCheckedBag: params.includeCheckedBag ?? false,
      };
      setCachedSearch(payload);
      searchActions.setParams(payload);
      const session = await createSearchSession(payload);
      searchActions.setSession(session.id, session, session.status);
      searchActions.setResults([], 0);
      navigation.navigate('Results', { sessionId: session.id });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const dateLabel =
    tripType === 'round-trip'
      ? params.departureDate && params.returnDate
        ? `${params.departureDate} → ${params.returnDate}`
        : 'Select dates'
      : params.departureDate || 'Select date';

  return (
    <ScrollView style={themed.container} contentContainerStyle={styles.content}>
      <View style={[styles.hero, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
        <Text style={themed.heroTitle}>Find flights</Text>
        <Text style={themed.heroSubtitle}>Compare prices and book with one click</Text>

        <View style={styles.tripRow}>
          <TouchableOpacity
            style={[styles.tab, themed.tabBase, tripType === 'one-way' && themed.tabActive]}
            onPress={() => setTripType('one-way')}
          >
            <Text style={tripType === 'one-way' ? themed.tabTextActive : themed.tabText}>
              One-way
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, themed.tabBase, tripType === 'round-trip' && themed.tabActive]}
            onPress={() => setTripType('round-trip')}
          >
            <Text style={tripType === 'round-trip' ? themed.tabTextActive : themed.tabText}>
              Round-trip
            </Text>
          </TouchableOpacity>
        </View>

        <AirportAutocomplete
          label="From"
          value={params.origin}
          onChange={(code) => update('origin', code)}
          placeholder="City or airport"
        />
        <AirportAutocomplete
          label="To"
          value={params.destination}
          onChange={(code) => update('destination', code)}
          placeholder="City or airport"
        />

        <Text style={themed.label}>Dates</Text>
        <TouchableOpacity
          style={[styles.dateButton, themed.dateButton]}
          onPress={() => setShowCalendar(true)}
        >
          <Text style={themed.dateButtonText}>{dateLabel}</Text>
        </TouchableOpacity>

        <DateRangePicker
          visible={showCalendar}
          onClose={() => setShowCalendar(false)}
          mode={tripType === 'round-trip' ? 'range' : 'single'}
          initialDate={params.departureDate || undefined}
          initialEndDate={params.returnDate || undefined}
          onSelect={(date) => {
            update('departureDate', date);
            update('returnDate', undefined as any);
          }}
          onSelectRange={(start, end) => {
            update('departureDate', start);
            update('returnDate', end as any);
          }}
        />

        <PassengerCabinPicker
          adults={params.adults}
          children={params.children ?? 0}
          cabinClass={
            params.cabinClass === 'ECONOMY' || params.cabinClass === 'PREMIUM_ECONOMY' ||
            params.cabinClass === 'BUSINESS' || params.cabinClass === 'FIRST'
              ? params.cabinClass
              : 'ECONOMY'
          }
          onAdultsChange={(n) => update('adults', n)}
          onChildrenChange={(n) => update('children', n)}
          onCabinChange={(c) => {
            update('cabinClass', c);
            update('cabinPreference', c as 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST');
          }}
          label="Passengers & cabin"
        />

        <Text style={themed.label}>Checked bag</Text>
        <View style={styles.bagRow}>
          <TouchableOpacity
            style={[
              styles.bagBtn,
              themed.bagBtn,
              !params.includeCheckedBag && themed.bagBtnActive,
            ]}
            onPress={() => update('includeCheckedBag', false as any)}
          >
            <Text
              style={
                !params.includeCheckedBag ? themed.bagTextActive : themed.bagText
              }
            >
              Not included
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.bagBtn,
              themed.bagBtn,
              params.includeCheckedBag && themed.bagBtnActive,
            ]}
            onPress={() => update('includeCheckedBag', true as any)}
          >
            <Text
              style={
                params.includeCheckedBag ? themed.bagTextActive : themed.bagText
              }
            >
              Included
            </Text>
          </TouchableOpacity>
        </View>

        {error ? <Text style={themed.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[themed.button, loading && styles.buttonDisabled]}
          onPress={handleSearch}
          disabled={loading}
        >
          <Text style={themed.buttonText}>{loading ? 'Searching…' : 'Search flights'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function makeThemedStyles(theme: import('../../../theme/ThemeContext').Theme) {
  return {
    container: { flex: 1, backgroundColor: theme.screenBg },
    heroTitle: { fontSize: 26, fontWeight: '700' as const, color: theme.text, marginBottom: 6 },
    heroSubtitle: { fontSize: 15, color: theme.textMuted, marginBottom: 24 },
    label: { fontSize: 16, fontWeight: '600' as const, marginBottom: 8, color: theme.text },
    tabBase: {
      backgroundColor: theme.controlBg,
      borderColor: theme.inputBorder,
      borderRadius: theme.radiusMd,
    },
    tabActive: { backgroundColor: theme.primary, borderColor: theme.primary },
    tabText: { color: theme.text, fontSize: 17 },
    tabTextActive: { color: '#fff', fontWeight: '600', fontSize: 17 },
    dateButton: {
      backgroundColor: theme.inputBg,
      borderColor: theme.inputBorder,
      borderRadius: theme.radiusMd,
    },
    dateButtonText: { fontSize: 17, color: theme.text },
    bagBtn: {
      backgroundColor: theme.controlBg,
      borderColor: theme.inputBorder,
      borderRadius: theme.radiusMd,
    },
    bagBtnActive: { backgroundColor: theme.primary, borderColor: theme.primary },
    bagText: { color: theme.text, fontSize: 15 },
    bagTextActive: { color: '#fff', fontSize: 15 },
    error: { color: theme.error, marginTop: 12, fontSize: 16 },
    button: {
      marginTop: 24,
      backgroundColor: theme.buttonBg,
      paddingVertical: 18,
      borderRadius: theme.radiusLg,
      alignItems: 'center' as const,
    },
    buttonText: { color: theme.buttonText, fontSize: 18, fontWeight: '600' as const },
  };
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 48, maxWidth: 560, alignSelf: 'center', width: '100%' },
  hero: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
  },
  tripRow: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  tab: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  dateButton: {
    marginBottom: 4,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  bagRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  bagBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.6 },
});
