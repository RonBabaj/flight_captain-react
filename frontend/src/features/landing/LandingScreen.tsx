import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { useLocale } from '../../context/LocaleContext';
import type { RootStackParamList } from '../../navigation/types';
import { AppIcon } from '../../components/AppIcon';
import { useIsMobile } from '../../hooks/useResponsive';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const MAX_CONTENT = 1040;

export function LandingScreen() {
  const { theme } = useTheme();
  const { t, isRTL } = useLocale();
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const isMobile = useIsMobile();

  const brandOpacity = useRef(new Animated.Value(0)).current;
  const brandY = useRef(new Animated.Value(18)).current;
  const ctaOpacity = useRef(new Animated.Value(0)).current;

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

  const textAlign = isRTL ? 'right' : 'left';

  return (
    <ScrollView
      style={[styles.page, { backgroundColor: theme.screenBg }]}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingBottom: Math.max(insets.bottom, 24) + 24 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Full-bleed hero — brand first, one composition */}
      <View style={[styles.heroPlane, { minHeight: isMobile ? 520 : 620 }]}>
        <View
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: theme.screenBg,
            },
          ]}
        />
        {/* Horizon atmosphere — not a flat fill */}
        <View
          pointerEvents="none"
          style={[
            styles.horizonBand,
            {
              backgroundColor: theme.atmosphere,
            },
          ]}
        />
        <View
          pointerEvents="none"
          style={[
            styles.horizonGlow,
            { backgroundColor: theme.primary + '22' },
          ]}
        />
        <View style={[styles.heroInner, { maxWidth: MAX_CONTENT, paddingTop: isMobile ? 28 : 48 }]}>
          <Animated.View style={{ opacity: brandOpacity, transform: [{ translateY: brandY }] }}>
            <Text
              style={[
                styles.brand,
                {
                  color: theme.text,
                  fontFamily: theme.fontDisplay,
                  textAlign,
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
                { backgroundColor: theme.buttonBg },
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

      {/* One job: why Fly-Fix — stacked, not a card grid in the hero */}
      <View style={[styles.section, { paddingHorizontal: 20 }]}>
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

      <View style={[styles.section, { paddingHorizontal: 20 }]}>
        <TouchableOpacity
          style={[styles.btnPrimary, styles.btnPrimaryBlock, { backgroundColor: theme.buttonBg }]}
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
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  heroPlane: {
    width: '100%',
    overflow: 'hidden',
    justifyContent: 'flex-end',
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  horizonBand: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '55%',
  },
  horizonGlow: {
    position: 'absolute',
    width: '140%',
    height: 280,
    borderRadius: 999,
    bottom: -80,
    alignSelf: 'center',
    left: '-20%',
  },
  heroInner: {
    width: '100%',
    alignSelf: 'center',
    zIndex: 1,
  },
  brand: {
    fontSize: Platform.OS === 'web' ? 56 : 44,
    fontWeight: '800',
    letterSpacing: -1.2,
    lineHeight: Platform.OS === 'web' ? 60 : 48,
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: Platform.OS === 'web' ? 28 : 24,
    fontWeight: '700',
    letterSpacing: -0.4,
    lineHeight: Platform.OS === 'web' ? 34 : 30,
    marginBottom: 12,
    maxWidth: 520,
  },
  heroSubtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 28,
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
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 12,
    minHeight: 48,
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
    paddingTop: 36,
    paddingBottom: 12,
    maxWidth: MAX_CONTENT,
    width: '100%',
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: -0.3,
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
});
