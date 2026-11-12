import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { useLocale } from '../../context/LocaleContext';
import type { RootStackParamList } from '../../navigation/types';
import { AppIcon } from '../../components/AppIcon';
import { SiteFooter } from '../../components/SiteFooter';
import { useBreakpoint } from '../../hooks/useResponsive';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { AIRPORT_FALLBACK_IMAGE, LANDING_MOOD_DESTINATIONS } from '../../data/destinationMood';
import { getAirportEntry, getCityDisplayName } from '../../data/airports';
import { setCachedSearch } from '../../utils/searchCache';
import { updateSearchUrl } from '../../hooks/useSearchParams';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const MAX_CONTENT = 1040;

function LandingMoodImage({ uri, label }: { uri: string; label: string }) {
  const [src, setSrc] = useState(uri);
  useEffect(() => {
    setSrc(uri);
  }, [uri]);
  return (
    <Image
      source={{ uri: src }}
      style={StyleSheet.absoluteFillObject}
      resizeMode="cover"
      accessibilityLabel={label}
      accessible
      onError={() => {
        setSrc((cur) => (cur === AIRPORT_FALLBACK_IMAGE ? cur : AIRPORT_FALLBACK_IMAGE));
      }}
    />
  );
}

export function LandingScreen() {
  const { theme } = useTheme();
  const { t, isRTL, language } = useLocale();
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === 'mobile';
  useDocumentTitle(t('nav_home'));

  const brandOpacity = useRef(new Animated.Value(0)).current;
  const brandY = useRef(new Animated.Value(18)).current;
  const ctaOpacity = useRef(new Animated.Value(0)).current;
  const [showStickyCta, setShowStickyCta] = useState(false);

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(brandOpacity, { toValue: 1, duration: 520, useNativeDriver: true }),
        Animated.timing(brandY, { toValue: 0, duration: 520, useNativeDriver: true }),
      ]),
      Animated.timing(ctaOpacity, { toValue: 1, duration: 380, useNativeDriver: true }),
    ]).start();
  }, [brandOpacity, brandY, ctaOpacity]);

  const goSearch = () => navigation.navigate('Search');
  const goDeals = () => navigation.navigate('MonthDeals');

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!isMobile) return;
    const y = e.nativeEvent.contentOffset.y;
    setShowStickyCta(y > 360);
  };

  const goDestination = (code: string) => {
    const dest = code.toUpperCase();
    setCachedSearch({
      origin: '',
      destination: dest,
      departureDate: '',
      returnDate: '',
      cabinClass: 'ECONOMY',
      cabinPreference: 'ECONOMY',
      includeCheckedBag: false,
      adults: 1,
      children: 0,
      infants: 0,
      currency: 'USD',
      locale: 'en-US',
    });
    updateSearchUrl({ destination: dest });
    navigation.navigate('Search');
  };

  const textAlign = isRTL ? 'right' : 'left';
  const heroMin = isMobile ? 480 : breakpoint === 'tablet' ? 540 : 600;
  const brandSize = isMobile ? 42 : breakpoint === 'tablet' ? 50 : 58;
  const titleSize = isMobile ? 22 : breakpoint === 'tablet' ? 26 : 28;

  return (
    <View style={[styles.page, { backgroundColor: theme.screenBg }]}>
    <ScrollView
      style={styles.page}
      contentContainerStyle={[
        styles.scrollContent,
        {
          paddingBottom:
            Math.max(insets.bottom, 24) + 28 + (isMobile && showStickyCta ? 72 : 0),
        },
      ]}
      showsVerticalScrollIndicator={false}
      onScroll={onScroll}
      scrollEventThrottle={16}
    >
      {/* Full-bleed hero — brand first, one composition */}
      <View style={[styles.heroPlane, { minHeight: heroMin }]}>
        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: theme.screenBg }]} />
        <View
          pointerEvents="none"
          style={[styles.horizonBand, { backgroundColor: theme.atmosphere }]}
        />
        <View
          pointerEvents="none"
          style={[styles.horizonGlow, { backgroundColor: theme.primary + '28' }]}
        />
        <View
          style={[
            styles.heroInner,
            {
              maxWidth: MAX_CONTENT,
              paddingTop: isMobile ? 24 : 40,
              paddingHorizontal: isMobile ? 0 : 4,
            },
          ]}
        >
          <Animated.View style={{ opacity: brandOpacity, transform: [{ translateY: brandY }] }}>
            <Text
              style={[
                styles.brand,
                {
                  color: theme.text,
                  fontFamily: theme.fontDisplay,
                  textAlign,
                  fontSize: brandSize,
                  lineHeight: brandSize + 4,
                },
              ]}
              accessibilityRole="header"
            >
              Fly-Fix
            </Text>
            <Text
              style={[
                styles.heroTitle,
                {
                  color: theme.text,
                  fontFamily: theme.fontDisplay,
                  textAlign,
                  fontSize: titleSize,
                  lineHeight: titleSize + 6,
                },
              ]}
            >
              {t('landing_hero_title')}
            </Text>
            <Text
              style={[
                styles.heroSubtitle,
                { color: theme.textMuted, fontFamily: theme.fontBody, textAlign },
              ]}
            >
              {t('landing_hero_subtitle')}
            </Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.heroCtas,
              isMobile ? styles.heroCtasMobile : { flexDirection: isRTL ? 'row-reverse' : 'row' },
              { opacity: ctaOpacity },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.btnPrimary,
                { backgroundColor: theme.buttonBg, borderRadius: theme.radiusMd },
                isMobile && styles.btnFullWidth,
              ]}
              onPress={goSearch}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel={t('landing_cta_search')}
            >
              <AppIcon name="search" size={20} color={theme.buttonText} fallbackText="" />
              <Text style={[styles.btnPrimaryText, { color: theme.buttonText, fontFamily: theme.fontBody }]}>
                {t('landing_cta_search')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btnTextLink, isMobile && { alignSelf: 'center' }]}
              onPress={goDeals}
              activeOpacity={0.75}
            >
              <Text style={[styles.btnTextLinkLabel, { color: theme.primaryLight, fontFamily: theme.fontBody }]}>
                {t('landing_cta_deals')}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>

      {/* Mood destinations — below hero, one job: inspire */}
      <View style={[styles.section, { paddingHorizontal: isMobile ? 16 : 20 }]}>
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.text, fontFamily: theme.fontDisplay, textAlign },
          ]}
        >
          {t('landing_mood_title')}
        </Text>
        <Text
          style={[
            styles.sectionSubtitle,
            { color: theme.textMuted, fontFamily: theme.fontBody, textAlign },
          ]}
        >
          {t('landing_mood_subtitle')}
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.moodRow,
            isRTL && { flexDirection: 'row-reverse' },
          ]}
        >
          {LANDING_MOOD_DESTINATIONS.map(({ code, mood }) => {
            const entry = getAirportEntry(code);
            const label = entry ? getCityDisplayName(entry, language) : mood.labelEn;
            return (
              <TouchableOpacity
                key={code}
                style={[styles.moodCard, { borderRadius: theme.radiusLg, borderColor: theme.cardBorder }]}
                onPress={() => goDestination(code)}
                activeOpacity={0.88}
                accessibilityRole="button"
                accessibilityLabel={t('landing_mood_go').replace('{city}', label)}
              >
                <LandingMoodImage uri={mood.imageUrl} label={label} />
                <View style={styles.moodScrim} />
                <Text style={[styles.moodLabel, { fontFamily: theme.fontDisplay }]} numberOfLines={1}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Why Fly-Fix */}
      <View style={[styles.section, { paddingHorizontal: isMobile ? 16 : 20 }]}>
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.text, fontFamily: theme.fontDisplay, textAlign },
          ]}
        >
          {t('landing_features_title')}
        </Text>
        {[
          { titleKey: 'landing_feature_1_title', descKey: 'landing_feature_1_desc' },
          { titleKey: 'landing_feature_2_title', descKey: 'landing_feature_2_desc' },
          { titleKey: 'landing_feature_3_title', descKey: 'landing_feature_3_desc' },
        ].map((f, i) => (
          <View
            key={f.titleKey}
            style={[
              styles.featureRow,
              i < 2 && { borderBottomColor: theme.cardBorder, borderBottomWidth: StyleSheet.hairlineWidth },
            ]}
          >
            <Text style={[styles.featureTitle, { color: theme.text, fontFamily: theme.fontBody, textAlign }]}>
              {t(f.titleKey)}
            </Text>
            <Text style={[styles.featureDesc, { color: theme.textMuted, fontFamily: theme.fontBody, textAlign }]}>
              {t(f.descKey)}
            </Text>
          </View>
        ))}
      </View>

      <View style={[styles.section, { paddingHorizontal: isMobile ? 16 : 20 }]}>
        <TouchableOpacity
          style={[
            styles.btnPrimary,
            styles.btnPrimaryBlock,
            { backgroundColor: theme.buttonBg, borderRadius: theme.radiusMd },
          ]}
          onPress={goSearch}
          activeOpacity={0.85}
        >
          <Text style={[styles.btnPrimaryText, { color: theme.buttonText, fontFamily: theme.fontBody }]}>
            {t('landing_cta_search')}
          </Text>
        </TouchableOpacity>
        <Text style={[styles.footerTag, { color: theme.textMuted, fontFamily: theme.fontBody }]}>
          {t('landing_footer_tagline')}
        </Text>
        <SiteFooter />
      </View>
    </ScrollView>

      {isMobile && showStickyCta ? (
        <View
          style={[
            styles.stickyBar,
            {
              backgroundColor: theme.screenBg,
              borderTopColor: theme.cardBorder,
              paddingBottom: Math.max(insets.bottom, 10),
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.btnPrimary,
              styles.btnPrimaryBlock,
              { backgroundColor: theme.buttonBg, borderRadius: theme.radiusMd, maxWidth: '100%' },
            ]}
            onPress={goSearch}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={t('landing_sticky_cta')}
          >
            <AppIcon name="search" size={18} color={theme.buttonText} fallbackText="" />
            <Text style={[styles.btnPrimaryText, { color: theme.buttonText, fontFamily: theme.fontBody }]}>
              {t('landing_sticky_cta')}
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  heroPlane: {
    width: '100%',
    overflow: 'hidden',
    justifyContent: 'center',
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  horizonBand: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  horizonGlow: {
    position: 'absolute',
    width: '160%',
    height: '70%',
    borderRadius: 999,
    bottom: '-18%',
    alignSelf: 'center',
    left: '-30%',
  },
  heroInner: {
    width: '100%',
    alignSelf: 'center',
    zIndex: 1,
  },
  brand: {
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  heroTitle: {
    fontWeight: '700',
    letterSpacing: -0.2,
    marginBottom: 12,
    maxWidth: 520,
  },
  heroSubtitle: {
    fontSize: 16.5,
    lineHeight: 25,
    marginBottom: 26,
    maxWidth: 480,
  },
  heroCtas: {
    gap: 14,
    alignItems: 'center',
  },
  heroCtasMobile: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 12,
  },
  btnFullWidth: {
    width: '100%',
    justifyContent: 'center',
  },
  btnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 15,
    paddingHorizontal: 22,
    minHeight: 50,
  },
  btnPrimaryBlock: {
    justifyContent: 'center',
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  btnPrimaryText: { fontSize: 16, fontWeight: '700' },
  btnTextLink: { paddingVertical: 8, paddingHorizontal: 4 },
  btnTextLinkLabel: { fontSize: 15, fontWeight: '600' },
  section: {
    paddingTop: 32,
    paddingBottom: 8,
    maxWidth: MAX_CONTENT,
    width: '100%',
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
    maxWidth: 560,
  },
  moodRow: {
    gap: 12,
    paddingVertical: 4,
    paddingRight: 8,
  },
  moodCard: {
    width: 152,
    height: 190,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'flex-end',
  },
  moodScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8,16,24,0.28)',
  },
  moodLabel: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    paddingHorizontal: 12,
    paddingBottom: 14,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  featureRow: {
    paddingVertical: 18,
  },
  featureTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  featureDesc: { fontSize: 15, lineHeight: 22 },
  footerTag: {
    marginTop: 20,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  stickyBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
