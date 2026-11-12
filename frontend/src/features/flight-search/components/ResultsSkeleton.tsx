/**
 * Structure-preview cards for Results while search is PENDING —
 * mirrors FlightResultCard layout so the page reads as “about to fill in”.
 */
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import type { Theme } from '../../../theme/ThemeContext';

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

export function ResultsSkeletonCard({ theme }: { theme: Theme }) {
  return (
    <View
      style={[sk.card, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {/* Airline / carriers row */}
      <View style={sk.carrierRow}>
        <Bone theme={theme} width={28} height={28} radius={14} />
        <View style={{ flex: 1, gap: 6 }}>
          <Bone theme={theme} width="55%" height={12} />
          <Bone theme={theme} width="35%" height={10} />
        </View>
        <View style={{ alignItems: 'flex-end', gap: 6 }}>
          <Bone theme={theme} width={72} height={20} radius={8} />
          <Bone theme={theme} width={56} height={10} />
        </View>
      </View>

      <View style={[sk.divider, { backgroundColor: theme.cardBorder }]} />

      {/* Outbound leg: times + route + duration */}
      <View style={sk.legRow}>
        <View style={sk.timeBlock}>
          <Bone theme={theme} width={48} height={18} />
          <Bone theme={theme} width={36} height={10} style={{ marginTop: 6 }} />
        </View>
        <View style={sk.midBlock}>
          <Bone theme={theme} width="70%" height={8} />
          <Bone theme={theme} width="40%" height={8} style={{ marginTop: 8, alignSelf: 'center' }} />
        </View>
        <View style={[sk.timeBlock, { alignItems: 'flex-end' }]}>
          <Bone theme={theme} width={48} height={18} />
          <Bone theme={theme} width={36} height={10} style={{ marginTop: 6 }} />
        </View>
      </View>

      {/* Return leg preview */}
      <View style={[sk.legRow, { marginTop: 14 }]}>
        <View style={sk.timeBlock}>
          <Bone theme={theme} width={48} height={18} />
          <Bone theme={theme} width={36} height={10} style={{ marginTop: 6 }} />
        </View>
        <View style={sk.midBlock}>
          <Bone theme={theme} width="70%" height={8} />
          <Bone theme={theme} width="40%" height={8} style={{ marginTop: 8, alignSelf: 'center' }} />
        </View>
        <View style={[sk.timeBlock, { alignItems: 'flex-end' }]}>
          <Bone theme={theme} width={48} height={18} />
          <Bone theme={theme} width={36} height={10} style={{ marginTop: 6 }} />
        </View>
      </View>

      <View style={[sk.divider, { backgroundColor: theme.cardBorder }]} />

      {/* Footer: stops + Book */}
      <View style={sk.footerRow}>
        <Bone theme={theme} width="38%" height={12} />
        <Bone theme={theme} width={88} height={34} radius={10} />
      </View>
    </View>
  );
}

export function ResultsSkeletonList({ theme, count = 4 }: { theme: Theme; count?: number }) {
  const pulse = useRef(new Animated.Value(0.55)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 750, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.55, duration: 750, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <Animated.View
      style={[sk.list, { opacity: pulse }]}
      accessibilityRole="progressbar"
      accessibilityLabel="Loading flight results"
    >
      {Array.from({ length: count }, (_, i) => (
        <ResultsSkeletonCard key={i} theme={theme} />
      ))}
    </Animated.View>
  );
}

const sk = StyleSheet.create({
  list: { flex: 1, paddingTop: 4, paddingBottom: 24 },
  card: {
    marginHorizontal: 12,
    marginVertical: 5,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  carrierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  divider: { height: StyleSheet.hairlineWidth, marginVertical: 12 },
  legRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timeBlock: { width: 56 },
  midBlock: { flex: 1, alignItems: 'center' },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
