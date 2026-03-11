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
  variant: 'modal' | 'sidebar';
  sidebarPosition?: 'left' | 'right';
  visible?: boolean;
  onClose?: () => void;
  /** Extra content rendered below the filter controls (sidebar mode only). */
  footer?: React.ReactNode;
}

export function FiltersPanel({
  filters, onFiltersChange, results, noResults,
  variant, sidebarPosition = 'left', visible, onClose, footer,
}: FiltersPanelProps) {
  const { theme } = useTheme();
  const { t, isRTL } = useLocale();
  const isModal = variant === 'modal';
  const [stopsOpen, setStopsOpen] = useState(true);
  const [airlinesOpen, setAirlinesOpen] = useState(true);

  const airlines = useMemo(() => {
    const map: Record<string, number> = {};
    results.forEach((opt) => {
      const codes = new Set<string>();
      opt.legs.forEach((l) => l.segments.forEach((s) => { if (s.marketingCarrier?.code) codes.add(s.marketingCarrier.code); }));
      codes.forEach((c) => { map[c] = (map[c] ?? 0) + 1; });
    });
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b)).map(([code, count]) => ({ code, count }));
  }, [results]);

  const toggleAirline = (code: string) => {
    const list = filters.airlines.includes(code)
      ? filters.airlines.filter((c) => c !== code)
      : [...filters.airlines, code];
    onFiltersChange({ airlines: list });
  };

  const stopsLabel = (max: number | null) =>
    max === null ? t('filter_any') : max === 0 ? t('direct') : max === 1 ? t('stops_1') : t('stops_2_plus');

  const SectionHeader = ({ title, open, toggle }: { title: string; open: boolean; toggle: () => void }) => (
    <TouchableOpacity style={[f.secHeader, { borderBottomColor: theme.cardBorder }]} onPress={toggle} activeOpacity={0.6}>
      <Text style={[f.secTitle, { color: theme.text }]}>{title}</Text>
      <Text style={[f.chevron, { color: theme.textMuted }]}>{open ? '▾' : '▸'}</Text>
    </TouchableOpacity>
  );

  const content = (
    <>
      <SectionHeader title={t('stops_section')} open={stopsOpen} toggle={() => setStopsOpen((o) => !o)} />
      {stopsOpen && (
        <View style={f.secBody}>
          <View style={f.chipRow}>
            {([null, 0, 1, 2] as const).map((max) => {
              const active = filters.maxStops === max;
              return (
                <TouchableOpacity
                  key={max ?? 'any'}
                  style={[f.chip, { borderColor: theme.cardBorder }, active && { backgroundColor: theme.primary, borderColor: theme.primary }]}
                  onPress={() => onFiltersChange({ maxStops: max })}
                  activeOpacity={0.7}
                >
                  <Text style={[f.chipText, { color: theme.text }, active && { color: '#fff', fontWeight: '600' }]}>
                    {stopsLabel(max)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {airlines.length > 0 && (
        <>
          <SectionHeader title={t('airlines_section')} open={airlinesOpen} toggle={() => setAirlinesOpen((o) => !o)} />
          {airlinesOpen && (
            <View style={f.secBody}>
              {airlines.map(({ code, count }) => {
                const name = getAirlineName(code) || code;
                const sel = filters.airlines.includes(code);
                return (
                  <TouchableOpacity key={code} style={f.airlineRow} onPress={() => toggleAirline(code)} activeOpacity={0.6}>
                    <View style={[f.check, { borderColor: theme.cardBorder }, sel && { backgroundColor: theme.primary, borderColor: theme.primary }]}>
                      {sel && <Text style={f.checkMark}>✓</Text>}
                    </View>
                    <Text style={[f.airlineName, { color: theme.text }]} numberOfLines={1}>{name}</Text>
                    <Text style={[f.airlineCount, { color: theme.textMuted }]}>{count}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </>
      )}

      {noResults && <Text style={[f.hint, { color: theme.textMuted }]}>{t('no_results_search_first')}</Text>}
    </>
  );

  const header = (
    <View style={[f.header, { borderBottomColor: theme.cardBorder }, isRTL && { flexDirection: 'row-reverse' }]}>
      <Text style={[f.title, { color: theme.text }]}>{t('filters')}</Text>
      {isModal && onClose && (
        <TouchableOpacity onPress={onClose} style={f.closeBtn}>
          <Text style={[f.closeText, { color: theme.primary }]}>{t('done')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (variant === 'sidebar') {
    const border = sidebarPosition === 'right'
      ? { borderLeftWidth: 1, borderLeftColor: theme.cardBorder }
      : { borderRightWidth: 1, borderRightColor: theme.cardBorder };
    return (
      <View style={[f.sidebar, { backgroundColor: theme.cardBg }, border]}>
        {header}
        <ScrollView style={f.scroll} contentContainerStyle={f.scrollContent}>{content}</ScrollView>
        {footer ? <View style={[f.footer, { borderTopColor: theme.cardBorder }]}>{footer}</View> : null}
      </View>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={f.overlay} onPress={onClose}>
        <View style={[f.panel, { backgroundColor: theme.cardBg }]} onStartShouldSetResponder={() => true}>
          {header}
          <ScrollView style={f.scroll} contentContainerStyle={f.scrollContent}>{content}</ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
}

const f = StyleSheet.create({
  sidebar: { width: 240, paddingTop: 0 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  panel: { borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '80%' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  title: { fontSize: 15, fontWeight: '700' },
  closeBtn: { paddingVertical: 6, paddingHorizontal: 10 },
  closeText: { fontSize: 15, fontWeight: '600' },
  scroll: {},
  scrollContent: { paddingHorizontal: 14, paddingBottom: 24 },

  secHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  secTitle: { fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  chevron: { fontSize: 12 },
  secBody: { paddingBottom: 10 },

  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { paddingVertical: 5, paddingHorizontal: 10, borderRadius: 16, borderWidth: 1 },
  chipText: { fontSize: 12 },

  airlineRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 7 },
  check: { width: 20, height: 20, borderRadius: 5, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  checkMark: { color: '#fff', fontSize: 12, fontWeight: '700' },
  airlineName: { fontSize: 13, flex: 1 },
  airlineCount: { fontSize: 12 },

  hint: { fontSize: 13, marginTop: 16, fontStyle: 'italic' },

  footer: { borderTopWidth: StyleSheet.hairlineWidth },
});
