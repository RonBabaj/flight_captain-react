/**
 * Structure-preview cards for Results while search is PENDING —
 * mirrors FlightResultCard layout (schedule + price, footer logos) so CLS stays low.
 */
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import type { Theme } from '../../../theme/ThemeContext';
import { motion, useReducedMotion } from '../../../theme/motion';
import { TicketStub } from '../../../ui/TicketStub';

function Bone({
  theme,
  width,
  height = 12,
  radius = 6,
  style,
}: {
  theme: Theme;
  width: number | `${number}%`;
  height?: number;
  radius?: number;
  style?: object;
}) {
  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius: radius,
          backgroundColor: theme.controlBg,
        },
        style,
      ]}
    />
  );
}

function LegJourneyPreview({ theme }: { theme: Theme }) {
  return (
    <View style={sk.legBlock}>
      <Bone theme={theme} width={52} height={9} radius={4} style={{ marginBottom: 6 }} />
      <View style={sk.journeyRow}>
        <View style={sk.timeCol}>
          <Bone theme={theme} width={52} height={20} />
          <Bone theme={theme} width={32} height={10} style={{ marginTop: 4 }} />
        </View>
        <View style={sk.railCol}>
          <Bone theme={theme} width="85%" height={2} radius={1} />
          <Bone theme={theme} width={36} height={9} style={{ marginTop: 10, alignSelf: 'center' }} />
        </View>
        <View style={[sk.timeCol, { alignItems: 'flex-end' }]}>
          <Bone theme={theme} width={52} height={20} />
          <Bone theme={theme} width={32} height={10} style={{ marginTop: 4 }} />
        </View>
      </View>
      <View style={sk.metaRow}>
        <Bone theme={theme} width={44} height={10} />
        <Bone theme={theme} width={56} height={22} radius={6} />
      </View>
    </View>
  );
}

export function ResultsSkeletonCard({
  theme,
  roundTrip = true,
}: {
  theme: Theme;
  roundTrip?: boolean;
}) {
  return (
    <TicketStub style={sk.cardWrap} innerStyle={{ paddingVertical: 12, paddingHorizontal: 14 }}>
      <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <View style={sk.row1}>
          <View style={sk.scheduleCol}>
            <LegJourneyPreview theme={theme} />
            {roundTrip ? <LegJourneyPreview theme={theme} /> : null}
            <Bone theme={theme} width="42%" height={10} style={{ marginTop: 4 }} />
          </View>

          <View style={sk.priceCol}>
            <Bone theme={theme} width={80} height={22} radius={6} />
            <Bone theme={theme} width={64} height={10} style={{ marginTop: 6 }} />
            <Bone theme={theme} width={96} height={44} radius={10} style={{ marginTop: 10 }} />
          </View>
        </View>

        <View style={[sk.row2, { borderTopColor: theme.cardBorder }]}>
          <View style={sk.footerAirline}>
            <Bone theme={theme} width={30} height={30} radius={8} />
            <Bone theme={theme} width="55%" height={12} style={{ flex: 1 }} />
          </View>
          <Bone theme={theme} width={72} height={14} />
        </View>
      </View>
    </TicketStub>
  );
}

export function ResultsSkeletonList({
  theme,
  count = 4,
  roundTrip = true,
}: {
  theme: Theme;
  count?: number;
  roundTrip?: boolean;
}) {
  const reducedMotion = useReducedMotion();
  const pulse = useRef(new Animated.Value(reducedMotion ? 0.85 : 0.55)).current;

  useEffect(() => {
    if (reducedMotion) {
      pulse.setValue(0.85);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: motion.standardMs + 530, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.55, duration: motion.standardMs + 530, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse, reducedMotion]);

  const minH = roundTrip ? 248 : 196;

  return (
    <Animated.View
      style={[sk.list, { opacity: pulse }]}
      accessibilityRole="progressbar"
      accessibilityLabel="Loading flight results"
      accessibilityState={{ busy: true }}
    >
      {Array.from({ length: count }, (_, i) => (
        <View key={i} style={{ marginVertical: i === 0 ? 0 : 4, minHeight: minH }}>
          <ResultsSkeletonCard theme={theme} roundTrip={roundTrip} />
        </View>
      ))}
    </Animated.View>
  );
}

const sk = StyleSheet.create({
  list: { flex: 1, paddingTop: 4, paddingBottom: 24 },
  cardWrap: {
    marginHorizontal: 0,
    marginVertical: 6,
    flex: 1,
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    alignItems: 'flex-start',
  },
  scheduleCol: { flex: 1, minWidth: 0 },
  priceCol: { alignItems: 'flex-end', minWidth: 96 },
  legBlock: { marginBottom: 10 },
  journeyRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  timeCol: { width: 56 },
  railCol: { flex: 1, minWidth: 40, alignItems: 'center', paddingVertical: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  row2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  footerAirline: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, minWidth: 0 },
});