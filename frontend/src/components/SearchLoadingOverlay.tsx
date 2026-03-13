/**
 * SearchLoadingOverlay
 * Full-screen loading state shown while a new search session is being created.
 * Cycles through friendly status phrases so the user knows work is in progress.
 */
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useLocale } from '../context/LocaleContext';

const PHRASES_EN = [
  'Searching hundreds of airlines…',
  'Comparing prices across providers…',
  'Checking direct flights…',
  'Looking for the best deals…',
  'Almost there…',
];
const PHRASES_HE = [
  'מחפש מאות חברות תעופה…',
  'משווה מחירים בין ספקים…',
  'בודק טיסות ישירות…',
  'מחפש את המחירים הטובים…',
  'עוד רגע…',
];
const PHRASES_RU = [
  'Ищем сотни авиакомпаний…',
  'Сравниваем цены у провайдеров…',
  'Проверяем прямые рейсы…',
  'Ищем лучшие предложения…',
  'Почти готово…',
];

interface Props {
  visible: boolean;
  /** Origin and destination codes for the sub-title */
  origin?: string;
  destination?: string;
}

export function SearchLoadingOverlay({ visible, origin, destination }: Props) {
  const { theme } = useTheme();
  const { language } = useLocale();

  const phrases =
    language === 'he' ? PHRASES_HE : language === 'ru' ? PHRASES_RU : PHRASES_EN;

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

  const route = origin && destination ? `${origin} > ${destination}` : null;

  return (
    <View style={[s.overlay, { backgroundColor: theme.screenBg }]}>
      <ActivityIndicator size="large" color={theme.primary} style={s.spinner} />
      {route ? (
        <Text style={[s.route, { color: theme.text }]}>{route}</Text>
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
