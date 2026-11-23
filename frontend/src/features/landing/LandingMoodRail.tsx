import React, { useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useReducedMotion } from '../../theme/motion';
import { useLocale } from '../../context/LocaleContext';
import {
  LANDING_MOOD_DESTINATIONS,
  type DestinationMood,
} from '../../data/destinationMood';
import { getAirportEntry, getCityDisplayName } from '../../data/airports';
import type { LanguageCode } from '../../data/translations';
import { LandingMoodImage } from './LandingMoodImage';

type Props = {
  isDesktop: boolean;
  onSelect: (code: string) => void;
  /** Horizontal page gutter — negated so cards bleed edge-to-edge while titles stay inset. */
  bleedGutter: number;
};

const GAP = 12;
const CARD_H_MOBILE = 210;
const CARD_H_DESKTOP = 232;
const CARD_W_MOBILE = 168;
const CARD_W_DESKTOP = 184;
/** ~22px/s — slow enough to browse, fast enough to feel alive. */
const MS_PER_PX = 22;

function MoodCard({
  mood,
  label,
  cardW,
  cardH,
  borderRadius,
  borderColor,
  fontDisplay,
  onPress,
  a11yLabel,
}: {
  mood: DestinationMood;
  label: string;
  cardW: number;
  cardH: number;
  borderRadius: number;
  borderColor: string;
  fontDisplay: string;
  onPress: () => void;
  a11yLabel: string;
}) {
  return (
    <TouchableOpacity
      style={[
        s.card,
        {
          width: cardW,
          height: cardH,
          borderRadius,
          borderColor,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.88}
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
    >
      <LandingMoodImage uri={mood.imageUrl} label={label} />
      <View style={s.scrim} />
      <Text style={[s.label, { fontFamily: fontDisplay }]} numberOfLines={1}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function buildCards(
  language: LanguageCode,
  t: (key: string) => string,
  isDesktop: boolean,
  onSelect: (code: string) => void,
  theme: ReturnType<typeof useTheme>['theme'],
) {
  const cardW = isDesktop ? CARD_W_DESKTOP : CARD_W_MOBILE;
  const cardH = isDesktop ? CARD_H_DESKTOP : CARD_H_MOBILE;
  return LANDING_MOOD_DESTINATIONS.map(({ code, mood }) => {
    const entry = getAirportEntry(code);
    const label = entry ? getCityDisplayName(entry, language) : mood.labelEn;
    return (
      <MoodCard
        key={code}
        code={code}
        mood={mood}
        label={label}
        cardW={cardW}
        cardH={cardH}
        borderRadius={theme.radiusLg}
        borderColor={theme.cardBorder}
        fontDisplay={theme.fontDisplay}
        onPress={() => onSelect(code)}
        a11yLabel={t('landing_mood_go').replace('{city}', label)}
      />
    );
  });
}

export function LandingMoodRail({ isDesktop, onSelect, bleedGutter }: Props) {
  const { theme } = useTheme();
  const { t, isRTL, language } = useLocale();
  const reducedMotion = useReducedMotion();
  const translateX = useRef(new Animated.Value(0)).current;
  const animRef = useRef<Animated.CompositeAnimation | null>(null);

  const cardW = isDesktop ? CARD_W_DESKTOP : CARD_W_MOBILE;
  const stride = cardW + GAP;
  const loopWidth = LANDING_MOOD_DESTINATIONS.length * stride;
  const cardH = isDesktop ? CARD_H_DESKTOP : CARD_H_MOBILE;

  const renderSet = useCallback(
    (dup: 'a' | 'b') =>
      LANDING_MOOD_DESTINATIONS.map(({ code, mood }) => {
        const entry = getAirportEntry(code);
        const label = entry ? getCityDisplayName(entry, language) : mood.labelEn;
        return (
          <MoodCard
            key={`${dup}-${code}`}
            code={code}
            mood={mood}
            label={label}
            cardW={cardW}
            cardH={cardH}
            borderRadius={theme.radiusLg}
            borderColor={theme.cardBorder}
            fontDisplay={theme.fontDisplay}
            onPress={() => onSelect(code)}
            a11yLabel={t('landing_mood_go').replace('{city}', label)}
          />
        );
      }),
  [cardW, cardH, isDesktop, language, onSelect, t, theme.cardBorder, theme.fontDisplay, theme.radiusLg],
  );

  useEffect(() => {
    if (reducedMotion) {
      animRef.current?.stop();
      return;
    }
    translateX.setValue(0);
    const anim = Animated.loop(
      Animated.timing(translateX, {
        toValue: -loopWidth,
        duration: Math.round(loopWidth * MS_PER_PX),
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    animRef.current = anim;
    anim.start();
    return () => {
      anim.stop();
      animRef.current = null;
    };
  }, [loopWidth, reducedMotion, translateX]);

  if (reducedMotion) {
    return (
      <View style={[s.clip, { marginHorizontal: -bleedGutter }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[s.track, isRTL && { flexDirection: 'row-reverse' }]}
        >
          {buildCards(language, t, isDesktop, onSelect, theme)}
        </ScrollView>
      </View>
    );
  }

  return (
    <View
      style={[s.clip, { marginHorizontal: -bleedGutter, height: cardH + 8 }]}
      accessibilityRole="none"
    >
      <Animated.View
        style={[
          s.track,
          s.marqueeTrack,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        {renderSet('a')}
        {renderSet('b')}
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  clip: {
    width: '100%',
    overflow: 'hidden',
    paddingVertical: 4,
  },
  track: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: GAP,
    paddingHorizontal: 12,
  },
  marqueeTrack: {
    width: 'auto' as unknown as number,
  },
  card: {
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'flex-end',
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8,16,24,0.28)',
  },
  label: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    paddingHorizontal: 12,
    paddingBottom: 14,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});