import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { getDealsRange } from '../../../api';
import type { DayDeal } from '../../../types';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const RANGE_DAYS = 14;

function getRangeStartEnd(): { start: string; end: string } {
  const start = new Date();
  const end = new Date();
  end.setDate(end.getDate() + RANGE_DAYS - 1);
  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  };
}

/** Build next RANGE_DAYS dates (no API), same range as getRangeStartEnd. */
function getNext14Dates(): string[] {
  const { start, end } = getRangeStartEnd();
  const out: string[] = [];
  const cur = new Date(start + 'T12:00:00Z');
  const last = new Date(end + 'T12:00:00Z');
  while (cur <= last) {
    out.push(cur.toISOString().slice(0, 10));
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return out;
}

export interface DatePickerCalendarProps {
  origin: string;
  destination: string;
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  /** Round-trip stay duration in days (for price display). Default 7. */
  durationDays?: number;
  label?: string;
}

export function DatePickerCalendar({
  origin,
  destination,
  selectedDate,
  onSelectDate,
  durationDays = 7,
  label = 'Pick a date',
}: DatePickerCalendarProps) {
  const [data, setData] = useState<DayDeal[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasRoute = Boolean(origin.trim() && destination.trim());

  useEffect(() => {
    if (!hasRoute) {
      setData(null);
      setError(null);
      return;
    }
    const { start, end } = getRangeStartEnd();
    setLoading(true);
    setError(null);
    getDealsRange({
      origin: origin.trim().toUpperCase(),
      destination: destination.trim().toUpperCase(),
      startDate: start,
      endDate: end,
      durationDays,
    })
      .then(res => setData(res.days ?? []))
      .catch(e => {
        setError(e instanceof Error ? e.message : 'Failed to load prices');
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [origin, destination, durationDays, hasRoute]);

  // Always show next 14 days; prices only when route is set
  const dateStrings = getNext14Dates();
  const priceByDate = (data ?? []).reduce<Record<string, number>>((acc, d) => {
    if (d.lowestPrice?.amount) acc[d.date] = d.lowestPrice.amount;
    return acc;
  }, {});

  const firstDate = dateStrings[0];
  const firstWeekday = firstDate ? new Date(firstDate + 'T00:00:00Z').getUTCDay() : 0;
  const pad = Array(firstWeekday).fill(null);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      {!hasRoute && (
        <Text style={styles.hint}>Fill origin & destination to see prices.</Text>
      )}
      {hasRoute && loading && (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="small" color="#1a73e8" />
          <Text style={styles.loadingText}>Loading prices…</Text>
        </View>
      )}
      {hasRoute && error && !loading && (
        <Text style={styles.errorText}>{error}</Text>
      )}
      <View style={styles.calendar}>
        {WEEKDAYS.map(d => (
          <Text key={d} style={styles.weekday}>{d}</Text>
        ))}
        {pad.map((_, i) => <View key={`pad-${i}`} style={styles.cell} />)}
        {dateStrings.map((date) => {
          const price = priceByDate[date];
          const isSelected = selectedDate === date;
          return (
            <TouchableOpacity
              key={date}
              style={[styles.cell, styles.cellTap, isSelected && styles.cellSelected]}
              onPress={() => onSelectDate(date)}
            >
              <Text style={[styles.dayNum, isSelected && styles.dayNumSelected]}>
                {new Date(date + 'T00:00:00Z').getUTCDate()}
              </Text>
              {hasRoute && !loading ? (
                price != null && price > 0 ? (
                  <Text style={styles.price} numberOfLines={1}>
                    ${price.toFixed(0)}
                  </Text>
                ) : (
                  <Text style={styles.noPrice}>—</Text>
                )
              ) : (
                <Text style={styles.noPrice}>—</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginTop: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  hint: { fontSize: 13, color: '#666', marginTop: 8 },
  errorText: { fontSize: 13, color: '#c62828', marginTop: 8 },
  loadingBox: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 },
  loadingText: { color: '#666' },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  weekday: {
    width: `${100 / 7}%`,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
    marginBottom: 6,
  },
  cell: {
    width: `${100 / 7}%`,
    paddingVertical: 6,
    paddingHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellTap: { minHeight: 44 },
  cellSelected: { backgroundColor: '#1a73e8', borderRadius: 8 },
  dayNum: { fontSize: 13, fontWeight: '600' },
  dayNumSelected: { color: '#fff' },
  price: { fontSize: 10, color: '#1a73e8', marginTop: 2 },
  noPrice: { fontSize: 10, color: '#999', marginTop: 2 },
});
