import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { Theme } from '../../../theme/ThemeContext';

export function ResultsSkeletonCard({ theme }: { theme: Theme }) {
  const bg = theme.controlBg;
  return (
    <View style={[sk.card, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
      <View style={sk.topRow}>
        <View style={{ flex: 1 }}>
          <View style={[sk.line, { backgroundColor: bg, width: '75%' }]} />
          <View style={[sk.line, { backgroundColor: bg, width: '50%', height: 12 }]} />
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <View style={[sk.line, { backgroundColor: bg, width: 64, height: 22 }]} />
          <View style={[sk.line, { backgroundColor: bg, width: 80, height: 30, borderRadius: 8, marginTop: 6 }]} />
        </View>
      </View>
      <View style={[sk.divider, { backgroundColor: theme.cardBorder }]} />
      <View style={[sk.line, { backgroundColor: bg, width: '40%', height: 12 }]} />
    </View>
  );
}

export function ResultsSkeletonList({ theme, count = 4 }: { theme: Theme; count?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <ResultsSkeletonCard key={i} theme={theme} />
      ))}
    </>
  );
}

const sk = StyleSheet.create({
  card: { marginHorizontal: 12, marginVertical: 5, padding: 14, borderRadius: 14, borderWidth: 1 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  line: { height: 18, borderRadius: 6, marginBottom: 6 },
  divider: { height: StyleSheet.hairlineWidth, marginVertical: 10 },
});
