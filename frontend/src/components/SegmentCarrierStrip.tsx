import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import type { Theme } from '../theme/ThemeContext';
import type { FlightOption, FlightSegment } from '../types';
import { AirlineLogo } from './AirlineLogo';
import { formatFlightDesignator, labelForCarrierCode } from '../utils/displayAirlines';

/** Per-segment marketing (and operating when different) carriers for connecting legs. */
export function SegmentCarrierStrip({
  segments,
  option,
  theme,
  isRTL,
  t,
}: {
  segments: FlightSegment[];
  option: FlightOption;
  theme: Theme;
  isRTL?: boolean;
  t: (key: string) => string;
}) {
  if (!segments.length) return null;
  const needsStrip =
    segments.length > 1 ||
    segments.some(
      (s) =>
        s.operatingCarrier?.code &&
        s.operatingCarrier.code.toUpperCase() !== (s.marketingCarrier?.code || '').toUpperCase(),
    );
  if (!needsStrip) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={s.scroll}
      contentContainerStyle={[s.row, isRTL && { flexDirection: 'row-reverse' }]}
    >
      {segments.map((seg, index) => {
        const mkt = (seg.marketingCarrier?.code || '').toUpperCase();
        const op = (seg.operatingCarrier?.code || '').toUpperCase();
        const showOp = op && op !== mkt;
        const designator = formatFlightDesignator(mkt, seg.flightNumber);
        const mktName = labelForCarrierCode(option, mkt) || seg.marketingCarrier?.name;
        return (
          <View
            key={`${mkt}-${seg.flightNumber}-${index}`}
            style={[s.chip, { backgroundColor: theme.screenBg, borderColor: theme.cardBorder }]}
          >
            <AirlineLogo code={mkt} name={mktName} size={26} />
            <View style={s.chipText}>
              <Text style={[s.flight, { color: theme.text, fontFamily: theme.fontBody }]} numberOfLines={1}>
                {designator || mkt}
              </Text>
              {showOp ? (
                <Text style={[s.operated, { color: theme.textMuted, fontFamily: theme.fontBody }]} numberOfLines={1}>
                  {t('operated_by')} {labelForCarrierCode(option, op) || op}
                </Text>
              ) : null}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll: { marginTop: 6, alignSelf: 'stretch' },
  row: { gap: 8, paddingRight: 4 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    maxWidth: 220,
  },
  chipText: { flexShrink: 1, minWidth: 0 },
  flight: { fontSize: 12, fontWeight: '600' },
  operated: { fontSize: 10, marginTop: 1 },
});