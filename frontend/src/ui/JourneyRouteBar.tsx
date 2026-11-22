import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Theme } from '../theme/ThemeContext';
import type { LegPreviewSummary } from '../utils/legSummary';
import { formatFlightTime, formatArrivalDayOffset, type FlightTimeDisplayMode } from '../utils/flightTimeDisplay';
import { isolateLTR } from '../utils/bidi';

/**
 * Scannable leg header: departure ↔ arrival times with endpoint airports (no pill chain).
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
  const stops = summary.stopsCount ?? 0;
  const stopsLabel =
    stops === 0
      ? t('direct')
      : stops === 1
        ? t('stops_1')
        : t('stops_2_plus');

  const row = isRTL ? s.rowRtl : s.row;

  return (
    <View style={row} accessibilityRole="summary">
      <View style={s.end}>
        <Text style={[s.time, { color: theme.text, fontFamily: theme.fontDisplay }]}>{dep}</Text>
        <Text style={[s.code, { color: theme.textMuted, fontFamily: theme.fontDisplay }]}>{isolateLTR(origin)}</Text>
      </View>

      <View style={s.railWrap}>
        <View style={[s.railLine, { backgroundColor: theme.cardBorder }]} />
        {stops > 0 ? (
          <View style={[s.railDot, { backgroundColor: theme.primary, borderColor: theme.cardBg }]} />
        ) : null}
        <Text style={[s.railMeta, { color: theme.textMuted, fontFamily: theme.fontBody }]} numberOfLines={1}>
          {stops > 0 && summary.layovers[0]?.airportCode
            ? isolateLTR(summary.layovers[0].airportCode)
            : stopsLabel}
        </Text>
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
  railWrap: { flex: 1, minWidth: 48, alignItems: 'center', justifyContent: 'center', paddingVertical: 4 },
  railLine: { position: 'absolute', left: 4, right: 4, height: 2, borderRadius: 1, top: '50%' as any },
  railDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
    marginBottom: 14,
  },
  railMeta: { fontSize: 11, fontWeight: '600', marginTop: 2, textAlign: 'center' },
});