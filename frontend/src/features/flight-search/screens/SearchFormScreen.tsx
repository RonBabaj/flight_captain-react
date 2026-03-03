import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import type { CreateSearchSessionRequest } from '../../../types';
import { searchActions } from '../../../store';
import { createSearchSession } from '../../../api';
import { DatePickerCalendar } from '../components/DatePickerCalendar';

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

const MIN_STAY_DAYS = 1;
const MAX_STAY_DAYS = 21;

export function SearchFormScreen({ navigation }: { navigation: any }) {
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('round-trip');
  const [params, setParams] = useState<CreateSearchSessionRequest>(defaultParams);
  const [durationDays, setDurationDays] = useState(7); // for calendar price display (round-trip stay)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!params.origin.trim() || !params.destination.trim() || !params.departureDate) {
      setError('Please fill origin, destination and departure date.');
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Flight Search</Text>

      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.tab, tripType === 'one-way' && styles.tabActive]}
          onPress={() => setTripType('one-way')}
        >
          <Text style={tripType === 'one-way' ? styles.tabTextActive : styles.tabText}>
            One-way
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tripType === 'round-trip' && styles.tabActive]}
          onPress={() => setTripType('round-trip')}
        >
          <Text style={tripType === 'round-trip' ? styles.tabTextActive : styles.tabText}>
            Round-trip
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>From</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. TLV"
        value={params.origin}
        onChangeText={v => update('origin', v)}
        autoCapitalize="characters"
      />

      <Text style={styles.label}>To</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. HND"
        value={params.destination}
        onChangeText={v => update('destination', v)}
        autoCapitalize="characters"
      />

      <Text style={styles.label}>Stay duration (for calendar prices)</Text>
      <View style={styles.durationRow}>
        <TouchableOpacity
          style={styles.stepperBtn}
          onPress={() => setDurationDays(d => Math.max(MIN_STAY_DAYS, d - 1))}
        >
          <Text>−</Text>
        </TouchableOpacity>
        <Text style={styles.durationValue}>{durationDays} days</Text>
        <TouchableOpacity
          style={styles.stepperBtn}
          onPress={() => setDurationDays(d => Math.min(MAX_STAY_DAYS, d + 1))}
        >
          <Text>+</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Departure date</Text>
      <DatePickerCalendar
        origin={params.origin}
        destination={params.destination}
        selectedDate={params.departureDate || null}
        onSelectDate={v => update('departureDate', v)}
        durationDays={durationDays}
        label="Next 14 days (tap a date)"
      />
      <TextInput
        style={[styles.input, styles.inputSmall]}
        placeholder="Or type YYYY-MM-DD"
        value={params.departureDate}
        onChangeText={v => update('departureDate', v)}
      />

      {tripType === 'round-trip' && (
        <>
          <Text style={styles.label}>Return date</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={params.returnDate || ''}
            onChangeText={v => update('returnDate', v)}
          />
        </>
      )}

      <Text style={styles.label}>Passengers</Text>
      <View style={styles.row}>
        <Text style={styles.smallLabel}>Adults</Text>
        <View style={styles.stepper}>
          <TouchableOpacity
            onPress={() => update('adults', Math.max(1, params.adults - 1))}
            style={styles.stepperBtn}
          >
            <Text>-</Text>
          </TouchableOpacity>
          <Text style={styles.stepperValue}>{params.adults}</Text>
          <TouchableOpacity
            onPress={() => update('adults', params.adults + 1)}
            style={styles.stepperBtn}
          >
            <Text>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.row}>
        <Text style={styles.smallLabel}>Children</Text>
        <View style={styles.stepper}>
          <TouchableOpacity
            onPress={() => update('children', Math.max(0, (params.children ?? 0) - 1))}
            style={styles.stepperBtn}
          >
            <Text>-</Text>
          </TouchableOpacity>
          <Text style={styles.stepperValue}>{params.children ?? 0}</Text>
          <TouchableOpacity
            onPress={() => update('children', (params.children ?? 0) + 1)}
            style={styles.stepperBtn}
          >
            <Text>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.label}>Cabin class</Text>
      <View style={styles.cabinRow}>
        {CABIN_OPTIONS.map(c => (
          <TouchableOpacity
            key={c}
            style={[styles.cabinBtn, params.cabinClass === c && styles.cabinBtnActive]}
            onPress={() => update('cabinClass', c)}
          >
            <Text style={params.cabinClass === c ? styles.cabinTextActive : styles.cabinText}>
              {c.replace('_', ' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSearch}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Searching…' : 'Search flights'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', marginTop: 12, marginBottom: 4 },
  smallLabel: { fontSize: 14, marginRight: 8 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputSmall: { marginTop: 8 },
  durationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 12 },
  stepperBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationValue: { fontSize: 16, fontWeight: '600', minWidth: 72 },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  tabActive: { backgroundColor: '#1a73e8', borderColor: '#1a73e8' },
  tabText: { color: '#333' },
  tabTextActive: { color: '#fff', fontWeight: '600' },
  stepper: { flexDirection: 'row', alignItems: 'center' },
  stepperBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperValue: { marginHorizontal: 12, fontSize: 16, minWidth: 24, textAlign: 'center' },
  cabinRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, gap: 8 },
  cabinBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cabinBtnActive: { backgroundColor: '#1a73e8', borderColor: '#1a73e8' },
  cabinText: { color: '#333' },
  cabinTextActive: { color: '#fff' },
  error: { color: '#c62828', marginTop: 12 },
  button: {
    marginTop: 24,
    backgroundColor: '#1a73e8',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
