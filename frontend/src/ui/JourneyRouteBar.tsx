import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Theme } from '../theme/ThemeContext';
import type { LegPreviewSummary } from '../utils/legSummary';
import { railConnectionLabel } from '../utils/legSummary';
import { formatFlightTime, formatArrivalDayOffset, type FlightTimeDisplayMode } from '../utils/flightTimeDisplay';
import { isolateLTR } from '../utils/bidi';

/**
 * Scannable leg header: departure ↔ arrival times with connection duration above the rail.
 */
export function JourneyRouteBar({
  summary,
  theme,
  isRTL,
  timeDisplay,
  locale,
  t,
}: {
  summary: LegPreviewSummary;
  theme: Theme;
  isRTL?: boolean;
  timeDisplay: FlightTimeDisplayMode;
  locale: string;
  t: (key: string) => string;
}) {
  const dep = formatFlightTime(summary.departureTime, summary.origin, timeDisplay, locale);
  const arr = formatFlightTime(summary.arrivalTime, summary.destination, timeDisplay, locale);
  const dayOffset = formatArrivalDayOffset(summary.departureTime, summary.arrivalTime);
  const origin = summary.origin?.toUpperCase() || '—';
  const dest = summary.destination?.toUpperCase() || '—';
  const midLabel = railConnectionLabel(summary, t);

  const row = isRTL ? s.rowRtl : s.row;

  return (
    <View style={row} accessibilityRole="summary">
      <View style={s.end}>
        <Text style={[s.time, { color: theme.text, fontFamily: theme.fontDisplay }]}>{dep}</Text>
        <Text style={[s.code, { color: theme.textMuted, fontFamily: theme.fontDisplay }]}>{isolateLTR(origin)}</Text>
      </View>

      <View style={s.railWrap}>
        <View style={s.railTrack}>
          <Text
            style={[s.railMeta, { color: theme.textMuted, fontFamily: theme.fontBody }]}
            numberOfLines={1}
          >
            {isolateLTR(midLabel)}
          </Text>
          <View style={[s.railLine, { backgroundColor: theme.cardBorder }]} />
        </View>
      </View>

      <View style={[s.end, s.endRight]}>
        <Text style={[s.time, { color: theme.text, fontFamily: theme.fontDisplay }]}>
          {arr}
          {dayOffset > 0 ? (
            <Text style={[s.offset, { color: theme.textMuted }]}>{` +${dayOffset}`}</Text>
          ) : null}
        </Text>
        <Text style={[s.code, { color: theme.textMuted, fontFamily: theme.fontDisplay }]}>{isolateLTR(dest)}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 2,
    marginBottom: 2,
  },
  rowRtl: {
    flexDirection: 'row-reverse',
  },
  end: { minWidth: 52, alignItems: 'flex-start' },
  endRight: { alignItems: 'flex-end' },
  time: { fontSize: 20, fontWeight: '700', fontVariant: ['tabular-nums'] as any, letterSpacing: -0.15 },
  offset: { fontSize: 13, fontWeight: '600' },
  code: { fontSize: 13, fontWeight: '700', marginTop: 2, letterSpacing: 0.4 },
  railWrap: {
    flex: 1,
    minWidth: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  railTrack: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 2,
    gap: 5,
  },
  railLine: {
    width: '100%',
    height: 2,
    borderRadius: 1,
  },
  railMeta: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.2,
    lineHeight: 14,
  },
});
