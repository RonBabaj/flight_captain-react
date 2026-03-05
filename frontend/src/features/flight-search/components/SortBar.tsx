import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { useLocale } from '../../../context/LocaleContext';
import type { SortField } from '../../../store/searchStore';

export type SortOption = 'price' | 'duration' | 'best';

const SORT_KEYS: Record<SortOption, string> = {
  price: 'cheapest',
  duration: 'fastest',
  best: 'best',
};

interface SortBarProps {
  sortField: SortField;
  sortOrder: 'asc' | 'desc';
  onSort: (field: SortField) => void;
}

export function SortBar({ sortField, sortOrder, onSort }: SortBarProps) {
  const { theme } = useTheme();
  const { t, isRTL } = useLocale();
  const options: SortOption[] = ['price', 'duration', 'best'];

  return (
    <View style={[styles.wrapper, { backgroundColor: theme.cardBg, borderBottomColor: theme.cardBorder }]}>
      <View style={[styles.bar, isRTL && styles.barRTL]}>
        <Text style={[styles.label, { color: theme.textMuted }, isRTL && styles.labelRTL]}>{t('sort_by')}</Text>
        <View style={[styles.buttons, isRTL && styles.buttonsRTL]}>
          {options.map((opt) => {
            const isActive = sortField === opt;
            const arrow = sortField === opt ? (sortOrder === 'asc' ? ' ↑' : ' ↓') : '';
            const prefix = opt === 'price' ? '💰' : opt === 'duration' ? '⚡' : '⭐';
            const label = t(SORT_KEYS[opt]);
            const content = isRTL ? `${label} ${prefix}${arrow}` : `${prefix} ${label}${arrow}`;
            return (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.btn,
                  { backgroundColor: theme.controlBg },
                  isActive && { backgroundColor: theme.primary },
                ]}
                onPress={() => onSort(opt as SortField)}
              >
                <Text
                  style={[
                    styles.btnText,
                    { color: theme.text },
                    isActive && { color: '#fff', fontWeight: '600' },
                  ]}
                >
                  {content}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      <Text style={[styles.tooltip, { color: theme.textMuted }]} numberOfLines={1}>
        {t('prices_include')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderBottomWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  barRTL: { flexDirection: 'row-reverse' },
  label: { fontSize: 14, marginRight: 8 },
  labelRTL: { marginRight: 0, marginLeft: 8 },
  buttons: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  buttonsRTL: { flexDirection: 'row-reverse' },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  btnText: { fontSize: 14 },
  tooltip: { fontSize: 11, marginTop: 6 },
});
