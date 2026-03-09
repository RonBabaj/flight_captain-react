import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { useLocale } from '../../../context/LocaleContext';
import type { SortField } from '../../../store/searchStore';

export type SortOption = 'price' | 'duration' | 'best';

const ICONS: Record<SortOption, string> = { price: '💰', duration: '⚡', best: '⭐' };
const KEYS: Record<SortOption, string> = { price: 'cheapest', duration: 'fastest', best: 'best' };

interface SortBarProps {
  sortField: SortField;
  sortOrder: 'asc' | 'desc';
  onSort: (field: SortField) => void;
}

export function SortBar({ sortField, sortOrder, onSort }: SortBarProps) {
  const { theme } = useTheme();
  const { t, isRTL } = useLocale();
  const opts: SortOption[] = ['price', 'duration', 'best'];

  return (
    <View style={[s.bar, isRTL && s.barRTL]}>
      <Text style={[s.label, { color: theme.textMuted }]}>{t('sort_by')}</Text>
      <View style={[s.pills, isRTL && s.pillsRTL]}>
        {opts.map((opt) => {
          const active = sortField === opt;
          const arrow = active ? (sortOrder === 'asc' ? ' ↑' : ' ↓') : '';
          return (
            <TouchableOpacity
              key={opt}
              style={[
                s.pill,
                { backgroundColor: theme.controlBg, borderColor: theme.cardBorder },
                active && { backgroundColor: theme.primary, borderColor: theme.primary },
              ]}
              onPress={() => onSort(opt as SortField)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  s.pillText,
                  { color: theme.text },
                  active && { color: '#fff', fontWeight: '700' },
                ]}
              >
                {`${ICONS[opt]} ${t(KEYS[opt])}${arrow}`}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  barRTL: { flexDirection: 'row-reverse' },
  label: { fontSize: 13, fontWeight: '500' },
  pills: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  pillsRTL: { flexDirection: 'row-reverse' },
  pill: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
  },
  pillText: { fontSize: 13 },
});
