import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Theme } from '../theme/ThemeContext';
import type { LayoverSummary } from '../types';
import { formatDuration } from '../utils/legSummary';

/** One chip per connection — easier to scan than comma-separated prose. */
export function LayoverChips({
  layovers,
  theme,
  isRTL,
  t,
}: {
  layovers: LayoverSummary[];
  theme: Theme;
  isRTL?: boolean;
  t: (key: string) => string;
}) {
  const items = layovers.filter((lo) => lo.airportCode && lo.minutes > 0);
  if (!items.length) return null;

  return (
    <View style={[s.row, isRTL && s.rowRtl]}>
      {items.map((lo) => {
        const label = t('layover_short')
          .replace('{duration}', formatDuration(lo.minutes))
          .replace('{airport}', lo.airportCode);
        return (
          <View
            key={`${lo.airportCode}-${lo.minutes}`}
            style={[s.chip, { backgroundColor: theme.screenBg, borderColor: theme.cardBorder }]}
          >
            <Text style={[s.text, { color: theme.textMuted, fontFamily: theme.fontBody }]} numberOfLines={1}>
              {label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  rowRtl: {
    justifyContent: 'flex-end',
    alignSelf: 'stretch',
  },
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    maxWidth: '100%',
  },
  text: { fontSize: 11, fontWeight: '500' },
});