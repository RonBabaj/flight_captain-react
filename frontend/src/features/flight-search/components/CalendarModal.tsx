import React, { useMemo, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  // For single-date selection (one-way)
  onSelect?: (date: string) => void; // YYYY-MM-DD
  // For range selection (round-trip)
  onSelectRange?: (startDate: string, endDate: string) => void;
  initialDate?: string;     // YYYY-MM-DD
  initialEndDate?: string;  // YYYY-MM-DD
  mode?: 'single' | 'range';
}

function getMonthStart(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

function buildMonthDays(monthStart: Date): string[] {
  const days: string[] = [];
  const year = monthStart.getUTCFullYear();
  const month = monthStart.getUTCMonth();
  const d = new Date(monthStart);
  while (d.getUTCMonth() === month) {
    days.push(d.toISOString().slice(0, 10));
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return days;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CalendarModal({
  visible,
  onClose,
  onSelect,
  onSelectRange,
  initialDate,
  initialEndDate,
  mode = 'single',
}: Props) {
  const initial = useMemo(() => {
    if (!initialDate) return getMonthStart(new Date());
    const parsed = new Date(initialDate + 'T12:00:00Z');
    if (Number.isNaN(parsed.getTime())) return getMonthStart(new Date());
    return getMonthStart(parsed);
  }, [initialDate]);

  const [monthStart, setMonthStart] = useState<Date>(initial);
  const [rangeStart, setRangeStart] = useState<string | null>(initialDate ?? null);
  const [rangeEnd, setRangeEnd] = useState<string | null>(initialEndDate ?? null);

  React.useEffect(() => {
    if (mode === 'range') {
      setRangeStart(initialDate ?? null);
      setRangeEnd(initialEndDate ?? null);
    } else {
      setRangeStart(initialDate ?? null);
      setRangeEnd(null);
    }
  }, [mode, initialDate, initialEndDate]);

  const days = useMemo(() => buildMonthDays(monthStart), [monthStart]);
  const firstWeekday = days.length
    ? new Date(days[0] + 'T00:00:00Z').getUTCDay()
    : 0;
  const pad = Array(firstWeekday).fill(null);

  const monthLabel = monthStart.toLocaleString(undefined, {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

  const goOffset = (offset: number) => {
    const d = new Date(monthStart);
    d.setUTCMonth(d.getUTCMonth() + offset);
    setMonthStart(getMonthStart(d));
  };

  const handleDayPress = (date: string) => {
    if (mode === 'range') {
      if (!rangeStart || (rangeStart && rangeEnd)) {
        setRangeStart(date);
        setRangeEnd(null);
        return;
      }
      let start = rangeStart;
      let end = date;
      if (end < start) {
        start = date;
        end = rangeStart;
      }
      setRangeStart(start);
      setRangeEnd(end);
      if (onSelectRange) {
        onSelectRange(start, end);
      }
      onClose();
    } else {
      if (onSelect) {
        onSelect(date);
      }
      onClose();
    }
  };

  const isInRange = (date: string) => {
    if (!rangeStart) return false;
    if (!rangeEnd) return date === rangeStart;
    return date >= rangeStart && date <= rangeEnd;
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => goOffset(-1)} style={styles.navBtn}>
              <Text style={styles.navText}>{"<"}</Text>
            </TouchableOpacity>
            <Text style={styles.monthLabel}>{monthLabel}</Text>
            <TouchableOpacity onPress={() => goOffset(1)} style={styles.navBtn}>
              <Text style={styles.navText}>{'>'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.weekRow}>
            {WEEKDAYS.map(d => (
              <Text key={d} style={styles.weekday}>
                {d}
              </Text>
            ))}
          </View>

          <View style={styles.grid}>
            {pad.map((_, i) => (
              <View key={`pad-${i}`} style={styles.cell} />
            ))}
            {days.map(date => {
              const d = new Date(date + 'T00:00:00Z');
              const dayNum = d.getUTCDate();
              const selected = isInRange(date);
              return (
                <TouchableOpacity
                  key={date}
                  style={[styles.cell, selected && styles.cellSelected]}
                  onPress={() => handleDayPress(date)}
                >
                  <Text style={[styles.dayNum, selected && styles.dayNumSelected]}>{dayNum}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  monthLabel: { fontSize: 22, fontWeight: '700' },
  navBtn: { paddingHorizontal: 12, paddingVertical: 8 },
  navText: { fontSize: 22 },
  weekRow: { flexDirection: 'row', marginBottom: 8 },
  weekday: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  cell: {
    width: `${100 / 7}%`,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellSelected: {
    backgroundColor: '#e3f2fd',
    borderRadius: 999,
  },
  dayNum: { fontSize: 18, fontWeight: '600', color: '#333' },
  dayNumSelected: { color: '#0b63ce' },
  footer: { marginTop: 16, alignItems: 'flex-end' },
  closeBtn: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#eee',
  },
  closeText: { fontWeight: '600', color: '#333', fontSize: 18 },
});

