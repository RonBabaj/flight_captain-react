import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import type { Theme } from '../../theme/ThemeContext';
import type { SearchProgress } from '../../types';
import {
  getAlmostDonePhrase,
  getPhrasesForLanguage,
  SEARCH_ALMOST_DONE,
  SEARCH_PROGRESS_PHRASES,
} from './searchLoadingPhrases';
import { searchProgressRatio } from './searchProgressRatio';

interface SearchProgressBannerProps {
  language: string;
  theme: Theme;
  /** When true, lock copy to "Almost done…" — only set when search is truly finalizing. */
  nearComplete?: boolean;
  /** Live backend provider completion; drives the bar instead of a looping animation. */
  progress?: SearchProgress | null;
}

/** Inline progress banner shown above results while a search is loading. */
export function SearchProgressBanner({
  language,
  theme,
  nearComplete = false,
  progress = null,
}: SearchProgressBannerProps) {
  const phrases = getPhrasesForLanguage(SEARCH_PROGRESS_PHRASES, language);
  const almostDone = getAlmostDonePhrase(SEARCH_ALMOST_DONE, language);
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [startedAt] = useState(() => Date.now());
  const [tick, setTick] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0.06)).current;
  const lastRatioRef = useRef(0.06);

  // Soft crawl tick (~1s) so the bar advances between provider polls.
  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (nearComplete) {
      fadeAnim.setValue(1);
      return;
    }
    const cycle = () => {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
      setPhraseIdx((i) => (i + 1) % phrases.length);
    };
    const id = setInterval(cycle, 2200);
    return () => clearInterval(id);
  }, [phrases.length, fadeAnim, nearComplete]);

  // Monotonic fill toward the latest target ratio.
  useEffect(() => {
    const elapsed = Date.now() - startedAt;
    let target = searchProgressRatio(progress, elapsed);
    if (nearComplete) target = Math.max(target, 0.94);
    // Never shrink within a search — avoids jank when polls briefly omit progress.
    target = Math.max(target, lastRatioRef.current);
    lastRatioRef.current = target;
    Animated.timing(progressAnim, {
      toValue: target,
      duration: 450,
      useNativeDriver: false,
    }).start();
  }, [
    progress,
    progress?.providersDone,
    progress?.providersTotal,
    progress?.phase,
    nearComplete,
    startedAt,
    progressAnim,
    tick,
  ]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });
  const label = nearComplete ? almostDone : phrases[phraseIdx];
  const a11yValue = Math.round(lastRatioRef.current * 100);

  return (
    <View
      style={[s.wrap, { backgroundColor: theme.isDark ? theme.controlBg : theme.infoBg }]}
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: a11yValue }}
    >
      <View style={[s.track, { backgroundColor: theme.isDark ? theme.cardBorder : theme.controlBg }]}>
        <Animated.View style={[s.fill, { width: progressWidth, backgroundColor: theme.primary }]} />
      </View>
      <View style={s.row}>
        <ActivityIndicator size="small" color={theme.primary} />
        <Animated.Text style={[s.text, { color: theme.text, opacity: fadeAnim, fontFamily: theme.fontBody }]}>
          {label}
        </Animated.Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { paddingTop: 6, paddingBottom: 10, paddingHorizontal: 14 },
  track: { height: 3, borderRadius: 2, overflow: 'hidden', marginBottom: 8 },
  fill: { height: 3, borderRadius: 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  text: { fontSize: 13, fontWeight: '500', flex: 1 },
});
