import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme/ThemeContext';
import { useLocale } from '../../../context/LocaleContext';
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
  /** For sidebar: 'left' = border on right, 'right' = border on left. Default 'left'. */
  sidebarPosition?: 'left' | 'right';
  visible?: boolean;
  onClose?: () => void;
}

export function FiltersPanel({
  filters,
  onFiltersChange,
  results,
  noResults,
  variant,
  sidebarPosition = 'left',
  visible,
  onClose,
}: FiltersPanelProps) {
  const { theme } = useTheme();
  const { t, isRTL } = useLocale();
  const isModal = variant === 'modal';
  const [stopsOpen, setStopsOpen] = useState(true);
  const [airlinesOpen, setAirlinesOpen] = useState(true);

  const airlineCodesWithCount = useMemo(() => {
    const countByCode: Record<string, number> = {};
    results.forEach((opt) => {
      const codes = new Set<string>();
      opt.legs.forEach((leg) => {
        leg.segments.forEach((seg) => {
          const code = seg.marketingCarrier?.code;
          if (code) codes.add(code);
        });
      });
      codes.forEach((code) => {
        countByCode[code] = (countByCode[code] ?? 0) + 1;
      });
    });
    return Object.entries(countByCode)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([code, count]) => ({ code, count }));
  }, [results]);

  const toggleAirline = (code: string) => {
    const list = filters.airlines.includes(code)
      ? filters.airlines.filter((c) => c !== code)
      : [...filters.airlines, code];
    onFiltersChange({ airlines: list });
  };

  const stopsLabel = (max: number | null) =>
    max === null ? t('filter_any') : max === 0 ? t('direct') : max === 1 ? t('stops_1') : t('stops_2_plus');

  const content = (
    <>
      <TouchableOpacity
        style={[styles.sectionHeader, { borderBottomColor: theme.cardBorder }]}
        onPress={() => setStopsOpen((o) => !o)}
      >
        <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('stops_section')}</Text>
        <Text style={[styles.sectionChevron, { color: theme.textMuted }]}>{stopsOpen ? '▼' : '▶'}</Text>
      </TouchableOpacity>
      {stopsOpen && (
        <View style={[styles.sectionBody, { borderBottomColor: theme.cardBorder }]}>
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
                  {stopsLabel(max)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {airlineCodesWithCount.length > 0 && (
        <>
          <TouchableOpacity
            style={[styles.sectionHeader, { borderBottomColor: theme.cardBorder }]}
            onPress={() => setAirlinesOpen((o) => !o)}
          >
            <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('airlines_section')}</Text>
            <Text style={[styles.sectionChevron, { color: theme.textMuted }]}>{airlinesOpen ? '▼' : '▶'}</Text>
          </TouchableOpacity>
          {airlinesOpen && (
            <View style={[styles.sectionBody, { borderBottomColor: theme.cardBorder }]}>
              <View style={styles.airlineList}>
                {airlineCodesWithCount.map(({ code, count }) => {
                  const name = getAirlineName(code) || code;
                  const selected = filters.airlines.includes(code);
                  return (
                    <TouchableOpacity
                      key={code}
                      style={[styles.airlineRow, { borderBottomColor: theme.cardBorder }]}
                      onPress={() => toggleAirline(code)}
                    >
                      <Text style={[styles.airlineName, { color: theme.text }]}>{name} ({count})</Text>
                      <View style={styles.airlineMeta}>
                        <View
                          style={[
                            styles.checkbox,
                            { borderColor: theme.inputBorder },
                            selected && { backgroundColor: theme.primary, borderColor: theme.primary },
                          ]}
                        >
                          {selected && <Text style={styles.checkmark}>✓</Text>}
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}
        </>
      )}

      {noResults && (
        <Text style={[styles.hint, { color: theme.textMuted }]}>
          {t('no_results_search_first')}
        </Text>
      )}
    </>
  );

  const panelContent = (
    <>
      <View style={[styles.header, { borderBottomColor: theme.cardBorder }, isRTL && { flexDirection: 'row-reverse' }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Ionicons name="filter-outline" size={22} color={theme.text} />
          <Text style={[styles.title, { color: theme.text }]}>{t('filters')}</Text>
        </View>
        {isModal && onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={[styles.closeText, { color: theme.primary }]}>{t('done')}</Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {content}
      </ScrollView>
    </>
  );

  if (variant === 'sidebar') {
    const borderStyle = sidebarPosition === 'right'
      ? { borderLeftWidth: 1, borderLeftColor: theme.cardBorder }
      : { borderRightWidth: 1, borderRightColor: theme.cardBorder };
    return (
      <View style={[styles.sidebar, { backgroundColor: theme.cardBg }, borderStyle]}>
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
  scrollContent: { padding: 12, paddingBottom: 24 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  sectionTitle: { fontSize: 13, fontWeight: '500' },
  sectionChevron: { fontSize: 10 },
  sectionBody: {
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  chipText: { fontSize: 12 },
  airlineList: { marginTop: 0 },
  airlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  airlineName: { fontSize: 13 },
  airlineMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
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
