import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import type { Theme } from '../../theme/ThemeContext';
import {
  getAlmostDonePhrase,
  getPhrasesForLanguage,
  SEARCH_ALMOST_DONE,
  SEARCH_PROGRESS_PHRASES,
} from './searchLoadingPhrases';

interface SearchProgressBannerProps {
  language: string;
  theme: Theme;
  /** When true, lock copy to "Almost done…" — only set when search is truly finalizing. */
  nearComplete?: boolean;
}

/** Inline progress banner shown above results while a search is loading. */
export function SearchProgressBanner({ language, theme, nearComplete = false }: SearchProgressBannerProps) {
  const phrases = getPhrasesForLanguage(SEARCH_PROGRESS_PHRASES, language);
  const almostDone = getAlmostDonePhrase(SEARCH_ALMOST_DONE, language);
  const [phraseIdx, setPhraseIdx] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(progressAnim, { toValue: 1, duration: 2200, useNativeDriver: false }),
        Animated.timing(progressAnim, { toValue: 0, duration: 0, useNativeDriver: false }),
      ]),
    ).start();

    if (nearComplete) {
      fadeAnim.setValue(1);
      return () => {
        progressAnim.stopAnimation();
      };
    }

    const cycle = () => {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
      setPhraseIdx((i) => (i + 1) % phrases.length);
    };
    const id = setInterval(cycle, 2200);
    return () => {
      clearInterval(id);
      progressAnim.stopAnimation();
    };
  }, [phrases.length, fadeAnim, progressAnim, nearComplete]);

  const progressWidth = progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['5%', '100%'] });
  const label = nearComplete ? almostDone : phrases[phraseIdx];

  return (
    <View style={[s.wrap, { backgroundColor: theme.isDark ? theme.controlBg : theme.infoBg }]}>
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
