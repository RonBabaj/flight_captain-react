import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Pressable,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { getAirlineName } from '../../../data/airlines';
import type { FlightOption } from '../../../types';
import type { SearchFilters } from '../../../store/searchStore';

interface FiltersPanelProps {
  filters: SearchFilters;
  onFiltersChange: (f: Partial<SearchFilters>) => void;
  results: FlightOption[];
  noResults?: boolean;
  /** When 'modal', show as bottom sheet with visible/onClose. When 'sidebar', render inline. */
  variant: 'modal' | 'sidebar';
  visible?: boolean;
  onClose?: () => void;
}

export function FiltersPanel({
  filters,
  onFiltersChange,
  results,
  noResults,
  variant,
  visible,
  onClose,
}: FiltersPanelProps) {
  const { theme } = useTheme();
  const isModal = variant === 'modal';

  const airlineCodes = useMemo(() => {
    const set = new Set<string>();
    results.forEach((opt) => {
      opt.legs.forEach((leg) => {
        leg.segments.forEach((seg) => {
          if (seg.marketingCarrier?.code) set.add(seg.marketingCarrier.code);
        });
      });
    });
    return Array.from(set).sort();
  }, [results]);

  const toggleAirline = (code: string) => {
    const list = filters.airlines.includes(code)
      ? filters.airlines.filter((c) => c !== code)
      : [...filters.airlines, code];
    onFiltersChange({ airlines: list });
  };

  const content = (
    <>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Stops</Text>
      <View style={styles.chipRow}>
        {([null, 0, 1, 2] as const).map((max) => (
          <TouchableOpacity
            key={max ?? 'any'}
            style={[
              styles.chip,
              { backgroundColor: theme.controlBg, borderColor: theme.inputBorder },
              filters.maxStops === max && { backgroundColor: theme.primary, borderColor: theme.primary },
            ]}
            onPress={() => onFiltersChange({ maxStops: max })}
          >
            <Text
              style={[
                styles.chipText,
                { color: theme.text },
                filters.maxStops === max && { color: '#fff', fontWeight: '600' },
              ]}
            >
              {max === null ? 'Any' : max === 0 ? 'Direct' : max === 1 ? '1 stop' : '2+'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {airlineCodes.length > 0 && (
        <>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Airlines</Text>
          <View style={styles.airlineList}>
            {airlineCodes.map((code) => {
              const name = getAirlineName(code) || code;
              const selected = filters.airlines.includes(code);
              return (
                <TouchableOpacity
                  key={code}
                  style={[styles.airlineRow, { borderBottomColor: theme.cardBorder }]}
                  onPress={() => toggleAirline(code)}
                >
                  <Text style={[styles.airlineName, { color: theme.text }]}>{name}</Text>
                  <View
                    style={[
                      styles.checkbox,
                      { borderColor: theme.inputBorder },
                      selected && { backgroundColor: theme.primary, borderColor: theme.primary },
                    ]}
                  >
                    {selected && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}

      {noResults && (
        <Text style={[styles.hint, { color: theme.textMuted }]}>
          No results yet. Search to see airlines and filters.
        </Text>
      )}
    </>
  );

  const panelContent = (
    <>
      <View style={[styles.header, { borderBottomColor: theme.cardBorder }]}>
        <Text style={[styles.title, { color: theme.text }]}>Filters</Text>
        {isModal && onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={[styles.closeText, { color: theme.primary }]}>Done</Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {content}
      </ScrollView>
    </>
  );

  if (variant === 'sidebar') {
    return (
      <View style={[styles.sidebar, { backgroundColor: theme.cardBg, borderRightColor: theme.cardBorder }]}>
        {panelContent}
      </View>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={styles.overlay} onPress={onClose}>
        <View
          style={[styles.panel, { backgroundColor: theme.cardBg }]}
          onStartShouldSetResponder={() => true}
        >
          {panelContent}
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 260,
    borderRightWidth: 1,
    paddingTop: 16,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  panel: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  title: { fontSize: 20, fontWeight: '700' },
  closeBtn: { paddingVertical: 8, paddingHorizontal: 12 },
  closeText: { fontSize: 17, fontWeight: '600' },
  scroll: { maxHeight: 400 },
  scrollContent: { padding: 20, paddingBottom: 32 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12, marginTop: 16 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
  },
  chipText: { fontSize: 15 },
  airlineList: { marginTop: 4 },
  airlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  airlineName: { fontSize: 16 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: { color: '#fff', fontSize: 14, fontWeight: '700' },
  hint: { fontSize: 14, marginTop: 16, fontStyle: 'italic' },
});
