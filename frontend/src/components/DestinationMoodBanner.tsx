import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  ScrollView,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useLocale } from '../context/LocaleContext';
import { getAirportEntry, getCityDisplayName } from '../data/airports';
import { resolveDestinationMood } from '../data/destinationMood';
import { useBreakpoint } from '../hooks/useResponsive';
import { ANYWHERE_CODE } from '../types';
import type { CreateSearchSessionRequest } from '../types';

type Variant = 'hero' | 'form' | 'results' | 'compact';

/** Unique destination codes for a trip (outbound + extras + open-jaw return city). */
export function collectTripDestinationCodes(
  params?: Partial<CreateSearchSessionRequest> | null,
): string[] {
  if (!params) return [];
  const out: string[] = [];
  const add = (raw?: string | null) => {
    const code = (raw || '').trim().toUpperCase();
    if (!code || code === ANYWHERE_CODE || out.includes(code)) return;
    if (!resolveDestinationMood(code)) return;
    out.push(code);
  };
  add(params.destination);
  for (const leg of params.extraLegs ?? []) add(leg.destination);
  add(params.returnOrigin);
  return out;
}

export function DestinationMoodBanner({
  destinationCode,
  variant = 'form',
  labelOverride,
  style,
}: {
  destinationCode?: string | null;
  variant?: Variant;
  labelOverride?: string;
  style?: ViewStyle;
}) {
  const { theme } = useTheme();
  const { language, isRTL, t } = useLocale();
  const bp = useBreakpoint();
  const mood = resolveDestinationMood(destinationCode);
  const opacity = useRef(new Animated.Value(0)).current;
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
    opacity.setValue(0);
    if (!mood) return;
    Animated.timing(opacity, { toValue: 1, duration: 420, useNativeDriver: true }).start();
  }, [mood?.imageUrl, opacity]);

  if (!mood || !destinationCode) return null;

  const entry = getAirportEntry(destinationCode);
  const cityLabel =
    labelOverride ||
    (entry ? getCityDisplayName(entry, language) : mood.labelEn) ||
    mood.labelEn;

  const height =
    variant === 'hero'
      ? bp === 'mobile'
        ? 200
        : 280
      : variant === 'results'
        ? bp === 'mobile'
          ? 110
          : bp === 'tablet'
            ? 130
            : 148
        : variant === 'compact'
          ? 88
          : bp === 'mobile'
            ? 120
            : 140;

  return (
    <Animated.View
      style={[
        styles.wrap,
        {
          height,
          borderRadius: theme.radiusLg,
          opacity,
          borderColor: theme.cardBorder,
        },
        style,
      ]}
      accessibilityRole="image"
      accessibilityLabel={t('destination_mood_a11y').replace('{city}', cityLabel)}
    >
      <View
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: theme.isDark ? '#1A2430' : '#D8E2EC' },
        ]}
      />
      {!imgFailed && (
        <Image
          source={{ uri: mood.imageUrl }}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
          onError={() => setImgFailed(true)}
        />
      )}
      <View
        pointerEvents="none"
        style={[
          styles.scrim,
          {
            backgroundColor: theme.isDark ? 'rgba(8,16,24,0.42)' : 'rgba(15,23,42,0.28)',
          },
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          styles.accentWash,
          { backgroundColor: (mood.accent || theme.primary) + (theme.isDark ? '33' : '22') },
        ]}
      />
      <View style={[styles.labelRow, isRTL && { flexDirection: 'row-reverse' }]}>
        <View style={[styles.pill, { backgroundColor: theme.isDark ? 'rgba(8,16,24,0.55)' : 'rgba(255,255,255,0.88)' }]}>
          <Text
            style={[
              styles.eyebrow,
              {
                color: theme.isDark ? theme.primaryLight : theme.primary,
                fontFamily: theme.fontBody,
              },
            ]}
          >
            {t('destination_mood_eyebrow')}
          </Text>
          <Text
            style={[
              styles.city,
              {
                color: theme.isDark ? '#fff' : theme.text,
                fontFamily: theme.fontDisplay,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}
            numberOfLines={1}
          >
            {cityLabel}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

/** One or many destination mood photos (Dynamic Destinations shows all stops). */
export function DestinationMoodStrip({
  destinationCodes,
  variant = 'form',
  style,
}: {
  destinationCodes?: Array<string | null | undefined> | null;
  variant?: Variant;
  style?: ViewStyle;
}) {
  const { isRTL } = useLocale();
  const codes = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    for (const raw of destinationCodes ?? []) {
      const code = (raw || '').trim().toUpperCase();
      if (!code || code === ANYWHERE_CODE || seen.has(code)) continue;
      if (!resolveDestinationMood(code)) continue;
      seen.add(code);
      list.push(code);
    }
    return list;
  }, [destinationCodes]);

  if (codes.length === 0) return null;
  if (codes.length === 1) {
    return <DestinationMoodBanner destinationCode={codes[0]} variant={variant} style={style} />;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[stripStyles.scroll, style]}
      contentContainerStyle={[
        stripStyles.row,
        isRTL && { flexDirection: 'row-reverse' },
      ]}
    >
      {codes.map((code) => (
        <DestinationMoodBanner
          key={code}
          destinationCode={code}
          variant="compact"
          style={stripStyles.tile}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 14,
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
  },
  accentWash: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '55%',
  },
  labelRow: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 14,
  },
  pill: {
    alignSelf: 'flex-start',
    maxWidth: '92%',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  city: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
});

const stripStyles = StyleSheet.create({
  scroll: {
    marginBottom: 14,
    maxHeight: 110,
  },
  row: {
    gap: 10,
    paddingRight: 4,
  },
  tile: {
    width: 200,
    marginBottom: 0,
  },
});
