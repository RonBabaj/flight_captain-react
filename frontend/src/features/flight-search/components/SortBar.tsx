import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { useLocale } from '../../../context/LocaleContext';
import type { SortField } from '../../../store/searchStore';
import { Chip } from '../../../ui';

export type SortOption = 'price' | 'duration' | 'best';

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
    <View style={[s.bar, isRTL && { direction: 'rtl' }]}>
      <Text style={[s.label, { color: theme.textMuted }]}>{t('sort_by')}</Text>
      <View style={[s.pills, isRTL && s.pillsRTL]}>
        {opts.map((opt) => {
          const active = sortField === opt;
          const arrow =
            active && opt !== 'best' ? (sortOrder === 'asc' ? ' ↑' : ' ↓') : '';
          return (
            <Chip
              key={opt}
              label={`${t(KEYS[opt])}${arrow}`}
              active={active}
              onPress={() => onSort(opt as SortField)}
              accessibilityLabel={`${t('sort_by')} ${t(KEYS[opt])}`}
              style={s.chip}
            />
          );
        })}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  bar: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pillsRTL: {
    flexDirection: 'row-reverse',
  },
  chip: {
    marginRight: 0,
  },
});
