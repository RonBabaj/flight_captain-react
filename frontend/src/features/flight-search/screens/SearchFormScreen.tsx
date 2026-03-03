import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import type { CreateSearchSessionRequest } from '../../../types';
import { searchActions } from '../../../store';
import { createSearchSession } from '../../../api';
import { useTheme } from '../../../theme/ThemeContext';
import { CalendarModal } from '../components/CalendarModal';
import { AirportInput } from '../components/AirportInput';

const CABIN_OPTIONS: Array<CreateSearchSessionRequest['cabinClass']> = [
  'ECONOMY',
  'PREMIUM_ECONOMY',
  'BUSINESS',
  'FIRST',
];

const defaultParams: CreateSearchSessionRequest = {
  origin: '',
  destination: '',
  departureDate: '',
  returnDate: '',
  cabinClass: 'ECONOMY',
  adults: 1,
  children: 0,
  infants: 0,
  currency: 'USD',
  locale: 'en-US',
};

export function SearchFormScreen({ navigation }: { navigation: any }) {
  const { theme } = useTheme();
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('round-trip');
  const [params, setParams] = useState<CreateSearchSessionRequest>(defaultParams);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const themed = makeThemedStyles(theme);

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
      const payload: CreateSearchSessionRequest = {
        ...params,
        origin: params.origin.trim().toUpperCase(),
        destination: params.destination.trim().toUpperCase(),
        returnDate: tripType === 'one-way' ? undefined : params.returnDate || undefined,
      };
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

  const update = <K extends keyof CreateSearchSessionRequest>(
    key: K,
    value: CreateSearchSessionRequest[K]
  ) => setParams(prev => ({ ...prev, [key]: value }));

  return (
    <ScrollView style={themed.container} contentContainerStyle={styles.content}>
      <Text style={themed.title}>Flight Search</Text>

      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.tab, themed.tabBase, tripType === 'one-way' && themed.tabActive]}
          onPress={() => setTripType('one-way')}
        >
          <Text style={[tripType === 'one-way' ? themed.tabTextActive : themed.tabText]}>
            One-way
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, themed.tabBase, tripType === 'round-trip' && themed.tabActive]}
          onPress={() => setTripType('round-trip')}
        >
          <Text style={[tripType === 'round-trip' ? themed.tabTextActive : themed.tabText]}>
            Round-trip
          </Text>
        </TouchableOpacity>
      </View>

      <AirportInput
        label="From"
        value={params.origin}
        onChange={code => update('origin', code)}
        placeholder="City or airport"
      />
      <AirportInput
        label="To"
        value={params.destination}
        onChange={code => update('destination', code)}
        placeholder="City or airport"
      />

      <Text style={themed.label}>Departure date</Text>
      <TouchableOpacity
        style={[styles.dateButton, themed.dateButton]}
        onPress={() => setShowCalendar(true)}
      >
        <Text style={themed.dateButtonText}>
          {tripType === 'round-trip'
            ? params.departureDate && params.returnDate
              ? `${params.departureDate} → ${params.returnDate}`
              : 'Select dates'
            : params.departureDate || 'Select date'}
        </Text>
      </TouchableOpacity>

      <CalendarModal
        visible={showCalendar}
        mode={tripType === 'round-trip' ? 'range' : 'single'}
        initialDate={params.departureDate || undefined}
        initialEndDate={params.returnDate || undefined}
        onClose={() => setShowCalendar(false)}
        onSelect={date => {
          update('departureDate', date);
          update('returnDate', undefined as any);
        }}
        onSelectRange={(start, end) => {
          update('departureDate', start);
          update('returnDate', end as any);
        }}
      />

      <Text style={themed.label}>Passengers</Text>
      <View style={styles.row}>
        <Text style={themed.smallLabel}>Adults</Text>
        <View style={styles.stepper}>
          <TouchableOpacity
            onPress={() => update('adults', Math.max(1, params.adults - 1))}
            style={[styles.stepperBtn, themed.stepperBtn]}
          >
            <Text style={[styles.stepperBtnText, themed.stepperBtnText]}>−</Text>
          </TouchableOpacity>
          <Text style={themed.stepperValue}>{params.adults}</Text>
          <TouchableOpacity
            onPress={() => update('adults', params.adults + 1)}
            style={[styles.stepperBtn, themed.stepperBtn]}
          >
            <Text style={[styles.stepperBtnText, themed.stepperBtnText]}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.row}>
        <Text style={themed.smallLabel}>Children</Text>
        <View style={styles.stepper}>
          <TouchableOpacity
            onPress={() => update('children', Math.max(0, (params.children ?? 0) - 1))}
            style={[styles.stepperBtn, themed.stepperBtn]}
          >
            <Text style={[styles.stepperBtnText, themed.stepperBtnText]}>−</Text>
          </TouchableOpacity>
          <Text style={themed.stepperValue}>{params.children ?? 0}</Text>
          <TouchableOpacity
            onPress={() => update('children', (params.children ?? 0) + 1)}
            style={[styles.stepperBtn, themed.stepperBtn]}
          >
            <Text style={[styles.stepperBtnText, themed.stepperBtnText]}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={themed.label}>Cabin class</Text>
      <View style={styles.cabinRow}>
        {CABIN_OPTIONS.map(c => (
          <TouchableOpacity
            key={c}
            style={[styles.cabinBtn, themed.cabinBtn, params.cabinClass === c && themed.cabinBtnActive]}
            onPress={() => update('cabinClass', c)}
          >
            <Text style={params.cabinClass === c ? themed.cabinTextActive : themed.cabinText}>
              {c.replace('_', ' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {error ? <Text style={themed.error}>{error}</Text> : null}

      <TouchableOpacity
        style={[styles.button, themed.button, loading && styles.buttonDisabled]}
        onPress={handleSearch}
        disabled={loading}
      >
        <Text style={themed.buttonText}>{loading ? 'Searching…' : 'Search flights'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function makeThemedStyles(theme: import('../../../theme/ThemeContext').Theme) {
  return {
    container: { flex: 1, backgroundColor: theme.screenBg },
    title: { fontSize: 32, fontWeight: '700', marginBottom: 24, color: theme.text },
    label: { fontSize: 18, fontWeight: '600', marginTop: 16, marginBottom: 8, color: theme.text },
    smallLabel: { fontSize: 18, marginRight: 12, color: theme.text },
    tabBase: { backgroundColor: theme.cardBg, borderColor: theme.inputBorder, borderRadius: theme.radiusMd },
    tabActive: { backgroundColor: theme.primary, borderColor: theme.primary },
    tabText: { color: theme.text, fontSize: 18 },
    tabTextActive: { color: '#fff', fontWeight: '600', fontSize: 18 },
    dateButton: { backgroundColor: theme.cardBg, borderColor: theme.inputBorder, borderRadius: theme.radiusMd },
    dateButtonText: { fontSize: 20, color: theme.text },
    stepperValue: { marginHorizontal: 16, fontSize: 20, minWidth: 32, textAlign: 'center' as const, color: theme.text },
    stepperBtn: { backgroundColor: theme.controlBg, borderRadius: theme.radiusMd },
    stepperBtnText: { color: theme.text },
    cabinBtn: { backgroundColor: theme.cardBg, borderColor: theme.inputBorder, borderRadius: theme.radiusMd },
    cabinBtnActive: { backgroundColor: theme.primary, borderColor: theme.primary },
    cabinText: { color: theme.text, fontSize: 16 },
    cabinTextActive: { color: '#fff', fontSize: 16 },
    error: { color: theme.error, marginTop: 16, fontSize: 18 },
    button: { marginTop: 32, backgroundColor: theme.buttonBg, padding: 20, borderRadius: theme.radiusLg, alignItems: 'center' as const },
    buttonText: { color: theme.buttonText, fontSize: 20, fontWeight: '600' as const },
  };
}

const styles = StyleSheet.create({
  content: { padding: 24, paddingBottom: 48 },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  tab: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginRight: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  dateButton: {
    marginTop: 12,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  stepper: { flexDirection: 'row', alignItems: 'center' },
  stepperBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperBtnText: { fontSize: 24, fontWeight: '600', color: '#333' },
  cabinRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12, gap: 12 },
  cabinBtn: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1,
  },
  buttonDisabled: { opacity: 0.6 },
});
