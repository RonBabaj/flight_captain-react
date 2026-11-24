import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { useLocale } from '../../../context/LocaleContext';
import { useIsNarrowPhone } from '../../../hooks/useResponsive';
import type { SortField } from '../../../store/searchStore';

export type SortOption = 'price' | 'duration' | 'best';

const KEYS: Record<SortOption, string> = { price: 'cheapest', duration: 'fastest', best: 'best' };

interface SortBarProps {
  sortField: SortField;
  sortOrder: 'asc' | 'desc';
  onSort: (field: SortField) => void;
  /** Optional result count shown beside sort controls. */
  resultCount?: number;
  /**
   * Renders on the same row as Cheapest/Fastest/Best (e.g. cheaper-cities pills),
   * so trailing controls share the segment baseline instead of centering against the label.
   */
  trailing?: React.ReactNode;
}

export function SortBar({ sortField, sortOrder, onSort, resultCount, trailing }: SortBarProps) {
  const { theme } = useTheme();
  const { t, isRTL } = useLocale();
  const narrow = useIsNarrowPhone();
  const opts: SortOption[] = ['price', 'duration', 'best'];

  return (
    <View style={[s.bar, isRTL && { direction: 'rtl' }]}>
      <View style={[s.metaRow, isRTL && { flexDirection: 'row-reverse' }]}>
        <Text style={[s.label, { color: theme.textMuted, fontFamily: theme.fontBody }]}>
          {t('sort_by')}
        </Text>
        {typeof resultCount === 'number' && resultCount > 0 ? (
          <Text style={[s.count, { color: theme.textMuted, fontFamily: theme.fontBody }]}>
            {t('results_count').replace('{n}', String(resultCount))}
          </Text>
        ) : null}
      </View>

      <View style={[s.controlsRow, isRTL && { flexDirection: 'row-reverse' }]}>
        <View
          style={[
            s.segment,
            {
              backgroundColor: theme.controlBg,
              borderColor: theme.cardBorder,
              borderRadius: theme.radiusMd,
            },
            isRTL && { flexDirection: 'row-reverse' },
            trailing ? s.segmentWithTrailing : null,
          ]}
          accessibilityRole="tablist"
        >
          {opts.map((opt, index) => {
            const active = sortField === opt;
            const arrow =
              active && opt !== 'best' ? (sortOrder === 'asc' ? ' ↓' : ' ↑') : '';
            const isFirst = index === 0;
            const isLast = index === opts.length - 1;
            return (
              <TouchableOpacity
                key={opt}
                style={[
                  s.segBtn,
                  active && {
                    backgroundColor: theme.buttonBg,
                  },
                  // Keep outer corners rounded on the track ends
                  isFirst && (isRTL ? s.segEndRTL : s.segStart),
                  isLast && (isRTL ? s.segStartRTL : s.segEnd),
                ]}
                onPress={() => onSort(opt as SortField)}
                activeOpacity={0.85}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                accessibilityLabel={`${t('sort_by')} ${t(KEYS[opt])}`}
              >
                <Text
                  style={[
                    s.segLabel,
                    narrow && s.segLabelNarrow,
                    {
                      color: active ? theme.buttonText : theme.textMuted,
                      fontFamily: theme.fontBody,
                      fontWeight: active ? '700' : '600',
                    },
                  ]}
                  numberOfLines={1}
                >
                  {t(KEYS[opt])}
                  {arrow}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {trailing ? <View style={s.trailing}>{trailing}</View> : null}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  bar: {
    paddingHorizontal: 2,
    paddingVertical: 6,
    gap: 8,
    minWidth: 0,
    flexShrink: 1,
    width: '100%',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0,
  },
  count: {
    fontSize: 12,
    fontWeight: '600',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minWidth: 0,
    width: '100%',
  },
  trailing: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },
  segment: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 3,
    gap: 2,
    alignSelf: 'stretch',
    maxWidth: '100%',
    flexGrow: 1,
  },
  segmentWithTrailing: {
    flexGrow: 0,
    flexShrink: 0,
    width: 280,
    maxWidth: '55%',
  },
  segBtn: {
    flex: 1,
    paddingVertical: 11,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 0,
    minHeight: 44,
  },
  segStart: { borderTopLeftRadius: 8, borderBottomLeftRadius: 8 },
  segEnd: { borderTopRightRadius: 8, borderBottomRightRadius: 8 },
  segStartRTL: { borderTopRightRadius: 8, borderBottomRightRadius: 8 },
  segEndRTL: { borderTopLeftRadius: 8, borderBottomLeftRadius: 8 },
  segLabel: {
    fontSize: 13,
    letterSpacing: -0.1,
  },
  segLabelNarrow: { fontSize: 12, paddingHorizontal: 2 },
});
