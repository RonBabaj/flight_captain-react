import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { useLocale } from '../../context/LocaleContext';
import type { RootStackParamList } from '../../navigation/types';
import { AppIcon } from '../../components/AppIcon';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const MAX_CONTENT = 1040;

export function LandingScreen() {
  const { theme } = useTheme();
  const { t, isRTL } = useLocale();
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();

  const goSearch = () => navigation.navigate('Search');
  const goDeals = () => navigation.navigate('MonthDeals');

  const dir = isRTL ? 'rtl' : 'ltr';
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
      {/* Hero */}
      <View
        style={[
          styles.heroWrap,
          {
            paddingTop: 8,
            paddingHorizontal: 20,
            borderBottomColor: theme.cardBorder,
          },
        ]}
      >
        <View
          style={[
            styles.heroGlow,
            {
              backgroundColor: theme.primary + '18',
              opacity: Platform.OS === 'web' ? 1 : 0.9,
            },
          ]}
        />
        <View style={[styles.heroInner, { maxWidth: MAX_CONTENT }]}>
          <View style={[styles.heroBadge, { borderColor: theme.primary + '55' }]}>
            <AppIcon name="airplane-outline" size={18} color={theme.primaryLight} fallbackText="" />
            <Text style={[styles.heroBadgeText, { color: theme.primaryLight }]}>
              Fly-Fix
            </Text>
          </View>
          <Text style={[styles.heroTitle, { color: theme.text, textAlign }]} accessibilityRole="header">
            {t('landing_hero_title')}
          </Text>
          <Text style={[styles.heroSubtitle, { color: theme.textMuted, textAlign }]}>
            {t('landing_hero_subtitle')}
          </Text>
          <View style={[styles.heroCtas, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <TouchableOpacity
              style={[styles.btnPrimary, { backgroundColor: theme.buttonBg }]}
              onPress={goSearch}
              activeOpacity={0.85}
            >
              <AppIcon name="search" size={20} color={theme.buttonText} fallbackText="" />
              <Text style={[styles.btnPrimaryText, { color: theme.buttonText }]}>
                {t('landing_cta_search')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btnSecondary, { borderColor: theme.cardBorder, backgroundColor: theme.cardBg }]}
              onPress={goDeals}
              activeOpacity={0.85}
            >
              <Text style={[styles.btnSecondaryText, { color: theme.text }]}>
                {t('landing_cta_deals')}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.heroVisual, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={[styles.routeLine, { backgroundColor: theme.cardBorder }]} />
            <View style={[styles.planeDot, { backgroundColor: theme.primary + '35' }]}>
              <AppIcon name="airplane-outline" size={22} color={theme.primaryLight} fallbackText="" />
            </View>
            <View style={[styles.routeLine, { backgroundColor: theme.cardBorder }]} />
          </View>
        </View>
      </View>

      {/* Features */}
      <View style={[styles.section, { paddingHorizontal: 20 }]}>
        <Text style={[styles.sectionTitle, { color: theme.text, textAlign: 'center' }]}>{t('landing_features_title')}</Text>
        <View style={[styles.featureGrid, { direction: dir as 'ltr' | 'rtl' }]}>
          {[
            { icon: 'filter-outline' as const, titleKey: 'landing_feature_1_title', descKey: 'landing_feature_1_desc' },
            { icon: 'globe-outline' as const, titleKey: 'landing_feature_2_title', descKey: 'landing_feature_2_desc' },
            { icon: 'calendar-outline' as const, titleKey: 'landing_feature_3_title', descKey: 'landing_feature_3_desc' },
            { icon: 'options-outline' as const, titleKey: 'landing_feature_4_title', descKey: 'landing_feature_4_desc' },
          ].map((f) => (
            <View
              key={f.titleKey}
              style={[
                styles.featureCard,
                {
                  backgroundColor: theme.cardBg,
                  borderColor: theme.cardBorder,
                  borderRadius: theme.radiusLg,
                },
              ]}
            >
              <View style={[styles.featureIconWrap, { backgroundColor: theme.primary + '22' }]}>
                <AppIcon name={f.icon} size={26} color={theme.primaryLight} fallbackText="" />
              </View>
              <Text style={[styles.featureCardTitle, { color: theme.text, textAlign }]}>{t(f.titleKey)}</Text>
              <Text style={[styles.featureCardDesc, { color: theme.textMuted, textAlign }]}>{t(f.descKey)}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* How it works */}
      <View style={[styles.section, styles.sectionAlt, { backgroundColor: theme.cardBg, borderTopColor: theme.cardBorder, borderBottomColor: theme.cardBorder }]}>
        <View style={{ maxWidth: MAX_CONTENT, alignSelf: 'center', width: '100%', paddingHorizontal: 20 }}>
          <Text style={[styles.sectionTitle, { color: theme.text, textAlign }]}>{t('landing_how_title')}</Text>
          <View style={[styles.stepsRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            {[
              { n: '1', titleKey: 'landing_step_1_title', descKey: 'landing_step_1_desc' },
              { n: '2', titleKey: 'landing_step_2_title', descKey: 'landing_step_2_desc' },
              { n: '3', titleKey: 'landing_step_3_title', descKey: 'landing_step_3_desc' },
            ].map((step, i) => (
              <View key={step.n} style={[styles.step, i < 2 && styles.stepWithDivider]}>
                <View style={[styles.stepNum, { backgroundColor: theme.primary, borderRadius: theme.radiusMd }]}>
                  <Text style={styles.stepNumText}>{step.n}</Text>
                </View>
                <Text style={[styles.stepTitle, { color: theme.text, textAlign }]}>{t(step.titleKey)}</Text>
                <Text style={[styles.stepDesc, { color: theme.textMuted, textAlign }]}>{t(step.descKey)}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Bottom CTA */}
      <View style={[styles.section, { paddingHorizontal: 20 }]}>
        <View
          style={[
            styles.bottomCta,
            {
              backgroundColor: theme.cardBg,
              borderColor: theme.cardBorder,
              borderRadius: theme.radiusLg,
              maxWidth: MAX_CONTENT,
              alignSelf: 'center',
              width: '100%',
            },
          ]}
        >
          <Text style={[styles.bottomCtaTitle, { color: theme.text, textAlign }]}>{t('landing_bottom_title')}</Text>
          <Text style={[styles.bottomCtaSub, { color: theme.textMuted, textAlign }]}>{t('landing_bottom_subtitle')}</Text>
          <View style={[styles.bottomCtaRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <TouchableOpacity
              style={[styles.btnPrimary, styles.btnPrimarySmall, { backgroundColor: theme.buttonBg }]}
              onPress={goSearch}
              activeOpacity={0.85}
            >
              <Text style={[styles.btnPrimaryText, { color: theme.buttonText }]}>{t('landing_cta_search')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btnGhost, { borderColor: theme.primary + '55' }]}
              onPress={goDeals}
              activeOpacity={0.85}
            >
              <Text style={[styles.btnGhostText, { color: theme.primaryLight }]}>{t('landing_cta_deals')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={[styles.footer, { borderTopColor: theme.cardBorder }]}>
        <Text style={[styles.footerBrand, { color: theme.text }]}>Fly-Fix</Text>
        <Text style={[styles.footerTag, { color: theme.textMuted }]}>{t('landing_footer_tagline')}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  heroWrap: {
    paddingBottom: 40,
    borderBottomWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  heroGlow: {
    position: 'absolute',
    width: 420,
    height: 420,
    borderRadius: 210,
    top: -180,
    alignSelf: 'center',
  },
  heroInner: {
    width: '100%',
    alignSelf: 'center',
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    marginBottom: 8,
  },
  heroBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: Platform.OS === 'web' ? 40 : 32,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: Platform.OS === 'web' ? 46 : 38,
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 17,
    lineHeight: 26,
    marginBottom: 28,
    maxWidth: 560,
  },
  heroCtas: {
    flexWrap: 'wrap',
    gap: 12,
    alignItems: 'center',
    marginBottom: 32,
  },
  btnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  btnPrimarySmall: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  btnPrimaryText: {
    fontSize: 16,
    fontWeight: '700',
  },
  btnSecondary: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
  },
  btnSecondaryText: {
    fontSize: 16,
    fontWeight: '600',
  },
  btnGhost: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  btnGhostText: {
    fontSize: 15,
    fontWeight: '600',
  },
  heroVisual: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    opacity: 0.85,
  },
  routeLine: {
    flex: 1,
    height: 2,
    maxWidth: 120,
    borderRadius: 2,
  },
  planeDot: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    paddingVertical: 40,
  },
  sectionAlt: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
    letterSpacing: -0.2,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    maxWidth: MAX_CONTENT,
    alignSelf: 'center',
    width: '100%',
  },
  featureCard: {
    flexGrow: 1,
    flexBasis: '45%',
    minWidth: 260,
    padding: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 2,
  },
  featureIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  featureCardDesc: {
    fontSize: 14,
    lineHeight: 21,
  },
  stepsRow: {
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  step: {
    flex: 1,
    minWidth: 200,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  stepWithDivider: {},
  stepNum: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  stepNumText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  stepDesc: {
    fontSize: 14,
    lineHeight: 21,
  },
  bottomCta: {
    padding: 28,
    borderWidth: 1,
    alignItems: 'stretch',
  },
  bottomCtaTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  bottomCtaSub: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  bottomCtaRow: {
    flexWrap: 'wrap',
    gap: 12,
    alignItems: 'center',
  },
  footer: {
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    marginTop: 8,
  },
  footerBrand: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  footerTag: {
    fontSize: 13,
    textAlign: 'center',
  },
});
