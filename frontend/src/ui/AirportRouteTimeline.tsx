import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Theme } from '../theme/ThemeContext';

/** Scannable airport hop row for result cards (TLV › LHR › SJU). */
export function AirportRouteTimeline({
  codes,
  theme,
  isRTL,
}: {
  codes: string[];
  theme: Theme;
  isRTL?: boolean;
}) {
  const path = codes.map((c) => c.trim().toUpperCase()).filter(Boolean);
  if (path.length < 2) return null;

  const sep = isRTL ? '‹' : '›';

  return (
    <View
      style={[s.row, isRTL && { flexDirection: 'row-reverse', flexWrap: 'wrap-reverse' }]}
      accessibilityRole="text"
    >
      {path.map((code, index) => (
        <React.Fragment key={`${code}-${index}`}>
          {index > 0 ? (
            <Text style={[s.sep, { color: theme.textMuted }]} accessibilityElementsHidden>
              {sep}
            </Text>
          ) : null}
          <View style={[s.pill, { backgroundColor: theme.controlBg, borderColor: theme.cardBorder }]}>
            <Text style={[s.code, { color: theme.text, fontFamily: theme.fontDisplay }]}>{code}</Text>
          </View>
        </React.Fragment>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 2,
    marginTop: 4,
  },
  sep: {
    fontSize: 11,
    fontWeight: '600',
    marginHorizontal: 1,
    opacity: 0.85,
  },
  pill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
  },
  code: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.35,
    fontVariant: ['tabular-nums'] as any,
  },
});