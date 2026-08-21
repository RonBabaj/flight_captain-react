/**
 * SearchLoadingOverlay
 * Full-screen loading state shown while a new search session is being created.
 * Cycles through friendly status phrases so the user knows work is in progress.
 */
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useLocale } from '../context/LocaleContext';
import { getPhrasesForLanguage, SEARCH_PROGRESS_PHRASES } from './search/searchLoadingPhrases';

interface ExtraLeg {
  origin?: string;
  destination?: string;
  date?: string;
}

interface Props {
  visible: boolean;
  /** Origin and destination codes for the sub-title */
  origin?: string;
  destination?: string;
  /** Extra hops (Dynamic Destinations) to show in the route string */
  extraLegs?: ExtraLeg[];
  /** Return-leg departure airport (open-jaw) */
  returnOrigin?: string;
  /** Return-leg arrival airport (open-jaw) */
  returnDestination?: string;
}

export function SearchLoadingOverlay({
  visible,
  origin,
  destination,
  extraLegs,
  returnOrigin,
  returnDestination,
}: Props) {
  const { theme } = useTheme();
  const { language } = useLocale();

  const phrases = getPhrasesForLanguage(SEARCH_PROGRESS_PHRASES, language);

  const [phraseIdx, setPhraseIdx] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!visible) {
      setPhraseIdx(0);
      fadeAnim.setValue(1);
      return;
    }
    const cycle = () => {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
      setPhraseIdx((i) => (i + 1) % phrases.length);
    };
    const id = setInterval(cycle, 2200);
    return () => clearInterval(id);
  }, [visible, phrases.length]);

  if (!visible) return null;

  const completeExtras = (extraLegs ?? []).filter(
    (l) => (l.origin || '').trim() && (l.destination || '').trim(),
  );
  const isOpenJaw =
    returnOrigin && destination
      ? returnOrigin.trim().toUpperCase() !== destination.trim().toUpperCase()
      : false;
  const isSplit = completeExtras.length > 0 || isOpenJaw;

  let route: string | null = null;
  if (origin && destination) {
    if (isSplit) {
      const parts: string[] = [`${origin.toUpperCase()} → ${destination.toUpperCase()}`];
      completeExtras.forEach((l) => {
        parts.push(`${(l.origin || '').toUpperCase()} → ${(l.destination || '').toUpperCase()}`);
      });
      const retFrom = (returnOrigin || destination).toUpperCase();
      const retTo = (returnDestination || origin).toUpperCase();
      parts.push(`${retFrom} → ${retTo}`);
      route = parts.join('  |  ');
    } else {
      route = `${origin} → ${destination}`;
    }
  }

  return (
    <View style={[s.overlay, { backgroundColor: theme.screenBg }]}>
      <ActivityIndicator size="large" color={theme.primary} style={s.spinner} />
      {route ? (
        <Text style={[s.route, { color: theme.text }]} numberOfLines={3}>{route}</Text>
      ) : null}
      <Animated.Text style={[s.phrase, { color: theme.textMuted, opacity: fadeAnim }]}>
        {phrases[phraseIdx]}
      </Animated.Text>
    </View>
  );
}

const s = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 14,
  },
  spinner: { marginBottom: 4 },
  route: { fontSize: 20, fontWeight: '700', letterSpacing: 0.3 },
  phrase: { fontSize: 15, textAlign: 'center', paddingHorizontal: 32 },
});
