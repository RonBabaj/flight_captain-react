import React, { useMemo, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';

function getMonthStart(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

function buildMonthDays(monthStart: Date): string[] {
  const days: string[] = [];
  const d = new Date(monthStart);
  const month = monthStart.getUTCMonth();
  while (d.getUTCMonth() === month) {
    days.push(d.toISOString().slice(0, 10));
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return days;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export interface DateRangePickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect?: (date: string) => void;
  onSelectRange?: (startDate: string, endDate: string) => void;
  initialDate?: string;
  initialEndDate?: string;
  mode: 'single' | 'range';
}

export function DateRangePicker({
  visible,
  onClose,
  onSelect,
  onSelectRange,
  initialDate,
  initialEndDate,
  mode = 'single',
}: DateRangePickerProps) {
  const { theme } = useTheme();
  const todayUtc = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const todayMonthStart = useMemo(() => getMonthStart(new Date()), []);
  const initial = useMemo(() => {
    if (!initialDate) return todayMonthStart;
    const parsed = new Date(initialDate + 'T12:00:00Z');
    if (Number.isNaN(parsed.getTime())) return todayMonthStart;
    const month = getMonthStart(parsed);
    return month < todayMonthStart ? todayMonthStart : month;
  }, [initialDate, todayMonthStart]);

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
  const firstWeekday = days.length ? new Date(days[0] + 'T00:00:00Z').getUTCDay() : 0;
  const pad = Array(firstWeekday).fill(null);
  const monthLabel = monthStart.toLocaleString(undefined, {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

  const goOffset = (offset: number) => {
    const d = new Date(monthStart);
    d.setUTCMonth(d.getUTCMonth() + offset);
    const next = getMonthStart(d);
    setMonthStart(next < todayMonthStart ? todayMonthStart : next);
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
      onSelectRange?.(start, end);
      onClose();
    } else {
      onSelect?.(date);
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
      <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => goOffset(-1)} style={styles.navBtn}>
              <Text style={[styles.navText, { color: theme.text }]}>←</Text>
            </TouchableOpacity>
            <Text style={[styles.monthLabel, { color: theme.text }]}>{monthLabel}</Text>
            <TouchableOpacity onPress={() => goOffset(1)} style={styles.navBtn}>
              <Text style={[styles.navText, { color: theme.text }]}>→</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.weekRow}>
            {WEEKDAYS.map((d) => (
              <Text key={d} style={[styles.weekday, { color: theme.textMuted }]}>
                {d}
              </Text>
            ))}
          </View>
          <View style={styles.grid}>
            {pad.map((_, i) => (
              <View key={`pad-${i}`} style={styles.cell} />
            ))}
            {days.map((date) => {
              const isPast = date < todayUtc;
              const selected = !isPast && isInRange(date);
              return (
                <TouchableOpacity
                  key={date}
                  style={[
                    styles.cell,
                    isPast && { opacity: 0.3 },
                    selected && { backgroundColor: theme.primary, borderRadius: 999 },
                  ]}
                  disabled={isPast}
                  onPress={() => handleDayPress(date)}
                >
                  <Text
                    style={[
                      styles.dayNum,
                      { color: isPast ? theme.textMuted : theme.text },
                      selected && { color: '#fff' },
                    ]}
                  >
                    {new Date(date + 'T00:00:00Z').getUTCDate()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={styles.footer}>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: theme.controlBg }]}
            >
              <Text style={[styles.closeText, { color: theme.text }]}>Cancel</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  monthLabel: { fontSize: 20, fontWeight: '700' },
  navBtn: { paddingHorizontal: 12, paddingVertical: 8 },
  navText: { fontSize: 22 },
  weekRow: { flexDirection: 'row', marginBottom: 8 },
  weekday: { flex: 1, textAlign: 'center', fontSize: 14, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
  cell: {
    width: `${100 / 7}%`,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNum: { fontSize: 16, fontWeight: '600' },
  footer: { marginTop: 16, alignItems: 'flex-end' },
  closeBtn: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 12 },
  closeText: { fontWeight: '600', fontSize: 16 },
});
