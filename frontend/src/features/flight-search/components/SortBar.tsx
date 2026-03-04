import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import type { SortField } from '../../../store/searchStore';

export type SortOption = 'price' | 'duration' | 'best';

const LABELS: Record<SortOption, string> = {
  price: 'Cheapest',
  duration: 'Fastest',
  best: 'Best',
};

interface SortBarProps {
  sortField: SortField;
  sortOrder: 'asc' | 'desc';
  onSort: (field: SortField) => void;
}

export function SortBar({ sortField, sortOrder, onSort }: SortBarProps) {
  const { theme } = useTheme();
  const options: SortOption[] = ['price', 'duration', 'best'];

  return (
    <View style={[styles.bar, { backgroundColor: theme.cardBg, borderBottomColor: theme.cardBorder }]}>
      <Text style={[styles.label, { color: theme.textMuted }]}>Sort by</Text>
      <View style={styles.buttons}>
        {options.map((opt) => {
          const isActive = sortField === opt;
          const arrow = sortField === opt ? (sortOrder === 'asc' ? ' ↑' : ' ↓') : '';
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
                {LABELS[opt]}
                {arrow}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  label: { fontSize: 15, marginRight: 8 },
  buttons: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  btnText: { fontSize: 15 },
});
