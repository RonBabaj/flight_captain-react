import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { layout, useTheme } from '../../theme/ThemeContext';
import { motion, useReducedMotion } from '../../theme/motion';
import { useLocale } from '../../context/LocaleContext';
import type { RootStackParamList } from '../../navigation/types';
import { AppIcon } from '../../components/AppIcon';
import { SiteFooter } from '../../components/SiteFooter';
import { useBreakpoint, useContentGutter } from '../../hooks/useResponsive';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import {
  AIRPORT_FALLBACK_IMAGE,
  LANDING_MOOD_DESTINATIONS,
  moodImageUrlForVariant,
} from '../../data/destinationMood';
import { setCachedSearch } from '../../utils/searchCache';
import { updateSearchUrl } from '../../hooks/useSearchParams';
import { LandingMoodRail } from './LandingMoodRail';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const MAX_CONTENT = layout.maxContentWidth;

export function LandingScreen() {
  const { theme } = useTheme();
  const { t, isRTL, language } = useLocale();
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === 'mobile';
  const gutter = useContentGutter();
  useDocumentTitle(t('nav_home'));

  const brandOpacity = useRef(new Animated.Value(0)).current;
  const brandY = useRef(new Animated.Value(18)).current;
  const ctaOpacity = useRef(new Animated.Value(0)).current;
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      brandOpacity.setValue(1);
      brandY.setValue(0);
      ctaOpacity.setValue(1);
      return;
    }
    Animated.sequence([
      Animated.parallel([
        Animated.timing(brandOpacity, { toValue: 1, duration: motion.slowMs + 200, useNativeDriver: true }),
        Animated.timing(brandY, { toValue: 0, duration: motion.slowMs + 200, useNativeDriver: true }),
      ]),
      Animated.timing(ctaOpacity, { toValue: 1, duration: motion.standardMs + 160, useNativeDriver: true }),
    ]).start();
  }, [brandOpacity, brandY, ctaOpacity, reducedMotion]);

  const goSearch = () => navigation.navigate('Search');
  const goDeals = () => navigation.navigate('MonthDeals');

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
  const isDesktop = breakpoint === 'desktop';
  const heroMin = isMobile ? 520 : isDesktop ? 620 : 560;
  const titleSize = isMobile ? 26 : isDesktop ? 34 : 28;
  const heroBg = moodImageUrlForVariant(LANDING_MOOD_DESTINATIONS[2]?.mood.imageUrl ?? AIRPORT_FALLBACK_IMAGE, 'hero');

  return (
    <View style={[styles.page, { backgroundColor: theme.screenBg, direction: isRTL ? 'rtl' : 'ltr' }]}>
    <ScrollView
      style={styles.page}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingBottom: Math.max(insets.bottom, 24) + 28 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.heroPlane, { minHeight: heroMin }]}>
        <Image source={{ uri: heroBg }} style={StyleSheet.absoluteFillObject} resizeMode="cover" accessibilityIgnoresInvertColors />
        <View style={[StyleSheet.absoluteFillObject, styles.heroScrim]} />
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: theme.isDark ? 'rgba(8,14,22,0.72)' : 'rgba(246,245,241,0.88)' },
          ]}
        />
        <View
          style={[
            styles.heroInner,
            {
              maxWidth: MAX_CONTENT,
              paddingTop: isMobile ? 28 : 48,
              paddingBottom: isMobile ? 32 : 56,
              paddingHorizontal: gutter,
              alignItems: isRTL ? 'flex-end' : 'flex-start',
            },
          ]}
        >
          <Animated.View
            style={[
              styles.heroCard,
              {
                opacity: brandOpacity,
                transform: [{ translateY: brandY }],
                backgroundColor: theme.isDark ? 'rgba(22,32,44,0.82)' : 'rgba(255,255,255,0.92)',
                borderColor: theme.cardBorder,
                borderRadius: theme.radiusLg + 8,
              },
              isRTL && isDesktop && { alignSelf: 'flex-end' },
            ]}
          >
            <View
              style={[
                styles.brandPill,
                { backgroundColor: theme.primary + '22', borderColor: theme.primary + '44' },
                isRTL && { alignSelf: 'flex-end' },
              ]}
            >
              <Text style={[styles.brandPillText, { color: theme.primary, fontFamily: theme.fontDisplay }]}>Fly-Fix</Text>
            </View>
            <Text
              accessibilityRole="header"
              style={[
                styles.heroTitle,
                {
                  color: theme.text,
                  fontFamily: theme.fontDisplay,
                  textAlign,
                  fontSize: titleSize,
                  lineHeight: titleSize + 8,
                },
              ]}
            >
              {t('landing_hero_title')}
            </Text>
            <Text style={[styles.heroSubtitle, { color: theme.textMuted, fontFamily: theme.fontBody, textAlign }]}>
              {t('landing_hero_subtitle')}
            </Text>
            <Animated.View
              style={[
                styles.heroCtas,
                isMobile ? styles.heroCtasMobile : styles.heroCtasDesktop,
                { opacity: ctaOpacity },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.btnPrimary,
                  styles.btnPrimaryHero,
                  { backgroundColor: theme.buttonBg, borderRadius: theme.radiusMd },
                  isRTL && { flexDirection: 'row-reverse' },
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
                style={[
                  styles.btnSecondary,
                  { borderColor: theme.cardBorder, borderRadius: theme.radiusMd, backgroundColor: theme.controlBg },
                  isRTL && { flexDirection: 'row-reverse' },
                ]}
                onPress={goDeals}
                activeOpacity={0.8}
              >
                <AppIcon name="calendar-outline" size={18} color={theme.text} fallbackText="" />
                <Text style={[styles.btnSecondaryText, { color: theme.text, fontFamily: theme.fontBody }]}>
                  {t('landing_cta_deals')}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </View>
      </View>

      {/* Mood destinations — below hero, one job: inspire */}
      <View style={[styles.section, { paddingHorizontal: gutter }]}>
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
        <LandingMoodRail isDesktop={isDesktop} onSelect={goDestination} bleedGutter={gutter} />
      </View>

      {/* Why Fly-Fix */}
      <View style={[styles.section, { paddingHorizontal: gutter }]}>
        <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: theme.fontDisplay, textAlign }]}>
          {t('landing_features_title')}
        </Text>
        <View style={[styles.featureGrid, isDesktop && styles.featureGridDesktop]}>
          {[
            { titleKey: 'landing_feature_1_title', descKey: 'landing_feature_1_desc', icon: 'airplane-outline' as const },
            { titleKey: 'landing_feature_2_title', descKey: 'landing_feature_2_desc', icon: 'options-outline' as const },
            // calendar-outline is in the local SVG set; ticket-outline was not → empty square.
            { titleKey: 'landing_feature_3_title', descKey: 'landing_feature_3_desc', icon: 'calendar-outline' as const },
          ].map((f) => (
            <View
              key={f.titleKey}
              style={[styles.featureCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder, borderRadius: theme.radiusLg }]}
            >
              <View style={[styles.featureIconWrap, { backgroundColor: theme.primary + '18' }]}>
                <AppIcon name={f.icon} size={22} color={theme.primary} fallbackText="" />
              </View>
              <Text style={[styles.featureTitle, { color: theme.text, fontFamily: theme.fontBody, textAlign }]}>
                {t(f.titleKey)}
              </Text>
              <Text style={[styles.featureDesc, { color: theme.textMuted, fontFamily: theme.fontBody, textAlign }]}>
                {t(f.descKey)}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.section, { paddingHorizontal: gutter }]}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  heroPlane: {
    width: '100%',
    overflow: 'hidden',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  heroScrim: {
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  heroInner: {
    width: '100%',
    alignSelf: 'center',
    zIndex: 1,
  },
  heroCard: {
    width: '100%',
    maxWidth: 640,
    paddingVertical: 28,
    paddingHorizontal: 24,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 14,
  },
  brandPill: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 4,
  },
  brandPillText: { fontSize: 13, fontWeight: '800', letterSpacing: 0.6 },
  heroTitle: {
    fontWeight: '800',
    letterSpacing: -0.6,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 17,
    lineHeight: 26,
    marginBottom: 4,
  },
  heroCtas: {
    gap: 12,
    marginTop: 8,
  },
  heroCtasMobile: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  heroCtasDesktop: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  btnFullWidth: {
    width: '100%',
    justifyContent: 'center',
  },
  btnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 15,
    paddingHorizontal: 22,
    minHeight: 50,
  },
  btnPrimaryHero: {
    flex: 1,
    minWidth: 160,
    maxWidth: 280,
  },
  btnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 18,
    minHeight: 50,
    borderWidth: 1,
    flex: 1,
    minWidth: 160,
    maxWidth: 280,
  },
  btnSecondaryText: { fontSize: 15, fontWeight: '600' },
  btnPrimaryBlock: {
    justifyContent: 'center',
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  btnPrimaryText: { fontSize: 16, fontWeight: '700' },
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
  featureGrid: {
    gap: 12,
    marginTop: 8,
  },
  featureGridDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  featureCard: {
    flex: 1,
    minWidth: 240,
    padding: 18,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  featureIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  featureTitle: { fontSize: 16, fontWeight: '700' },
  featureDesc: { fontSize: 15, lineHeight: 22 },
  footerTag: {
    marginTop: 20,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
});
