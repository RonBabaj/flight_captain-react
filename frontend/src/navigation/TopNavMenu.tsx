import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import { AppIcon } from '../components/AppIcon';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { useLocale } from '../context/LocaleContext';
import { LANGUAGES, CURRENCIES } from '../data/translations';
import { useSearchStore } from '../store';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useIsMobile } from '../hooks/useResponsive';
import type { RootStackParamList } from './types';
import type { LanguageCode, CurrencyCode } from '../data/translations';

type RouteProps = RouteProp<RootStackParamList, keyof RootStackParamList>;

const RESULTS_SCREENS = new Set(['Results', 'MonthDealsResults', 'Explore']);

const TITLE_KEYS: Record<string, string> = {
  Home: 'nav_home',
  SearchForm: 'nav_flight_search',
  Results: 'nav_results',
  Search: 'nav_flight_search',
  MonthDeals: 'nav_monthly_deals',
  MonthDealsForm: 'nav_monthly_deals',
  MonthDealsResults: 'nav_results',
  Explore: 'nav_results',
  DynamicDestinations: 'nav_dynamic_destinations',
  DynamicDestinationsForm: 'nav_dynamic_destinations',
  FlyFixRefine: 'flyfix_refine_nav_title',
  AdminSettings: 'nav_admin_settings',
};

export function TopNavMenu() {
  const { theme, toggleTheme } = useTheme();
  const { t, language, currency, setLanguage, setCurrency, isRTL } = useLocale();
  const navigation = useNavigation();
  const route = useRoute<RouteProps>();
  const sessionId = useSearchStore((s) => s.sessionId);
  const { isAdmin } = useAdminAuth();
  const currentRoot = route.name;
  const [showLocaleModal, setShowLocaleModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const isMobile = useIsMobile();

  const nestedName =
    currentRoot === 'Search' || currentRoot === 'DynamicDestinations' || currentRoot === 'MonthDeals'
      ? getFocusedRouteNameFromRoute(route) ??
        (currentRoot === 'Search'
          ? 'SearchForm'
          : currentRoot === 'MonthDeals'
            ? 'MonthDealsForm'
            : 'DynamicDestinationsForm')
      : null;
  const titleKey =
    nestedName && RESULTS_SCREENS.has(nestedName)
      ? 'nav_results'
      : nestedName
        ? TITLE_KEYS[nestedName] ?? TITLE_KEYS[currentRoot] ?? TITLE_KEYS.Search
        : TITLE_KEYS[currentRoot] ?? TITLE_KEYS.Search;
  const title = t(titleKey);

  const isHome = currentRoot === 'Home';
  const isSearch = currentRoot === 'Search';
  const isDeals = currentRoot === 'MonthDeals';
  const isDynamic = currentRoot === 'DynamicDestinations';
  const isAdminSettings = currentRoot === 'AdminSettings';

  const handleGoToHome = () => {
    if (!isHome) {
      navigation.navigate('Home' as never);
    }
    setShowMobileMenu(false);
  };

  const handleGoToSearch = () => {
    if (isSearch) return;
    if (sessionId) {
      (navigation as any).navigate('Search', {
        screen: 'Results',
        params: { sessionId },
      });
    } else {
      navigation.navigate('Search' as never);
    }
    setShowMobileMenu(false);
  };

  const handleGoToDeals = () => {
    if (!isDeals) {
      navigation.navigate('MonthDeals' as never);
    }
    setShowMobileMenu(false);
  };

  const handleGoToDynamic = () => {
    if (!isDynamic) {
      navigation.navigate('DynamicDestinations' as never);
    }
    setShowMobileMenu(false);
  };

  const handleGoToAdminSettings = () => {
    if (!isAdminSettings) {
      navigation.navigate('AdminSettings' as never);
    }
    setShowMobileMenu(false);
  };

  const adminNavItem = isAdmin ? (
    <TouchableOpacity
      style={styles.tab}
      onPress={handleGoToAdminSettings}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.tabText,
          { color: theme.tabInactive },
          isAdminSettings && { color: theme.tabActive },
        ]}
      >
        {t('nav_admin_settings')}
      </Text>
    </TouchableOpacity>
  ) : null;

  return (
    <>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
      <View
        style={[
          styles.bar,
          {
            backgroundColor: theme.navBg,
            borderBottomColor: theme.cardBorder,
            direction: 'ltr',
          },
        ]}
      >
        {isMobile ? (
          <>
            <View style={[styles.mobileSide, isRTL && { flexDirection: 'row-reverse' }]}>
              <TouchableOpacity
                style={styles.mobileMenuBtn}
                onPress={() => setShowMobileMenu(true)}
                activeOpacity={0.8}
              >
                <AppIcon name="menu-outline" size={22} color={theme.tabInactive} fallbackText="Menu" />
              </TouchableOpacity>
            </View>
            <View style={styles.titleWrap}>
              <Text style={[styles.title, { color: theme.tabActive }]} numberOfLines={1}>
                {title}
              </Text>
            </View>
            <View style={[styles.rightActions, { justifyContent: 'flex-end' }]}>
              <TouchableOpacity style={styles.localeBtn} onPress={() => setShowLocaleModal(true)}>
                <AppIcon name="globe-outline" size={20} color={theme.tabInactive} fallbackText="Locale" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
                <AppIcon
                  name={theme.isDark ? 'sunny-outline' : 'moon-outline'}
                  size={20}
                  color={theme.tabInactive}
                  fallbackText={theme.isDark ? 'Light' : 'Dark'}
                />
              </TouchableOpacity>
            </View>
          </>
        ) : isRTL ? (
          <>
            <View style={[styles.rightActions, styles.rightActionsRTL]}>
              <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
                <AppIcon
                  name={theme.isDark ? 'sunny-outline' : 'moon-outline'}
                  size={20}
                  color={theme.tabInactive}
                  fallbackText={theme.isDark ? 'Light' : 'Dark'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.localeBtn}
                onPress={() => setShowLocaleModal(true)}
              >
                <AppIcon name="globe-outline" size={20} color={theme.tabInactive} fallbackText="Locale" />
              </TouchableOpacity>
            </View>
            <View style={styles.titleWrap}>
              <Text style={[styles.title, { color: theme.tabActive }]} numberOfLines={1}>
                {title}
              </Text>
            </View>
            <View style={styles.menuWrap}>
              <TouchableOpacity
                style={styles.tab}
                onPress={handleGoToHome}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: theme.tabInactive },
                    isHome && { color: theme.tabActive },
                  ]}
                >
                  {t('nav_home')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tab}
                onPress={handleGoToSearch}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: theme.tabInactive },
                    isSearch && { color: theme.tabActive },
                  ]}
                >
                  {t('nav_search')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tab}
                onPress={handleGoToDeals}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: theme.tabInactive },
                    isDeals && { color: theme.tabActive },
                  ]}
                >
                  {t('nav_monthly_deals')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tab}
                onPress={handleGoToDynamic}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: theme.tabInactive },
                    isDynamic && { color: theme.tabActive },
                  ]}
                >
                  {t('nav_dynamic_destinations')}
                </Text>
              </TouchableOpacity>
              {adminNavItem}
            </View>
          </>
        ) : (
          <>
            <View style={styles.titleWrap}>
              <Text style={[styles.title, { color: theme.tabActive }]} numberOfLines={1}>
                {title}
              </Text>
            </View>
            <View style={styles.menuWrap}>
              <TouchableOpacity
                style={styles.tab}
                onPress={handleGoToHome}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: theme.tabInactive },
                    isHome && { color: theme.tabActive },
                  ]}
                >
                  {t('nav_home')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tab}
                onPress={handleGoToSearch}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: theme.tabInactive },
                    isSearch && { color: theme.tabActive },
                  ]}
                >
                  {t('nav_search')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tab}
                onPress={handleGoToDeals}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: theme.tabInactive },
                    isDeals && { color: theme.tabActive },
                  ]}
                >
                  {t('nav_monthly_deals')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tab}
                onPress={handleGoToDynamic}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: theme.tabInactive },
                    isDynamic && { color: theme.tabActive },
                  ]}
                >
                  {t('nav_dynamic_destinations')}
                </Text>
              </TouchableOpacity>
              {adminNavItem}
            </View>
            <View style={styles.rightActions}>
              <TouchableOpacity
                style={styles.localeBtn}
                onPress={() => setShowLocaleModal(true)}
              >
                <AppIcon name="globe-outline" size={20} color={theme.tabInactive} fallbackText="Locale" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
                <AppIcon
                  name={theme.isDark ? 'sunny-outline' : 'moon-outline'}
                  size={20}
                  color={theme.tabInactive}
                  fallbackText={theme.isDark ? 'Light' : 'Dark'}
                />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

    <Modal visible={showLocaleModal} transparent animationType="fade">
      <Pressable style={styles.localeOverlay} onPress={() => setShowLocaleModal(false)}>
        <View style={[styles.localeModal, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]} onStartShouldSetResponder={() => true}>
          <View style={[styles.localeModalHeader, { borderBottomColor: theme.cardBorder }]}>
            <Text style={[styles.localeModalTitle, { color: theme.text }]}>{t('locale_language')} / {t('locale_currency')}</Text>
            <TouchableOpacity onPress={() => setShowLocaleModal(false)} style={styles.localeModalClose}>
              <AppIcon name="close" size={24} color={theme.textMuted} fallbackText="Close" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.localeModalScroll} contentContainerStyle={styles.localeModalContent}>
            <Text style={[styles.localeSectionLabel, { color: theme.textMuted }]}>{t('locale_language')}</Text>
            {LANGUAGES.map(({ code, label }) => (
              <TouchableOpacity
                key={code}
                style={[styles.localeOption, language === code && { backgroundColor: theme.tabActive + '20' }]}
                onPress={() => setLanguage(code as LanguageCode)}
              >
                <Text style={[styles.localeOptionText, { color: theme.text }]}>{label}</Text>
                {language === code && <Text style={{ color: theme.tabActive }}>✓</Text>}
              </TouchableOpacity>
            ))}
            <Text style={[styles.localeSectionLabel, { color: theme.textMuted, marginTop: 16 }]}>{t('locale_currency')}</Text>
            {CURRENCIES.map(({ code, label, symbol }) => (
              <TouchableOpacity
                key={code}
                style={[styles.localeOption, currency === code && { backgroundColor: theme.tabActive + '20' }]}
                onPress={() => setCurrency(code as CurrencyCode)}
              >
                <Text style={[styles.localeOptionText, { color: theme.text }]}>{symbol ?? code} – {label}</Text>
                {currency === code && <Text style={{ color: theme.tabActive }}>✓</Text>}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Pressable>
    </Modal>

    {isMobile && (
      <Modal visible={showMobileMenu} transparent animationType="slide">
        <Pressable
          style={styles.mobileMenuOverlay}
          onPress={() => setShowMobileMenu(false)}
        >
          <View
            style={[
              styles.mobileMenuPanel,
              { backgroundColor: theme.cardBg, borderColor: theme.cardBorder },
            ]}
            onStartShouldSetResponder={() => true}
          >
            <View
              style={[
                styles.localeModalHeader,
                { borderBottomColor: theme.cardBorder },
              ]}
            >
              <Text style={[styles.localeModalTitle, { color: theme.text }]}>
                {t('nav_sections')}
              </Text>
              <TouchableOpacity
                onPress={() => setShowMobileMenu(false)}
                style={styles.localeModalClose}
              >
                <AppIcon name="close" size={24} color={theme.textMuted} fallbackText="Close" />
              </TouchableOpacity>
            </View>
            <View style={{ paddingHorizontal: 16, paddingVertical: 10, gap: 8 }}>
              <TouchableOpacity
                style={styles.mobileMenuItem}
                onPress={handleGoToHome}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.mobileMenuItemText,
                    { color: theme.text },
                    isHome && { fontWeight: '700', color: theme.tabActive },
                  ]}
                >
                  {t('nav_home')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.mobileMenuItem}
                onPress={handleGoToSearch}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.mobileMenuItemText,
                    { color: theme.text },
                    isSearch && { fontWeight: '700', color: theme.tabActive },
                  ]}
                >
                  {t('nav_search')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.mobileMenuItem}
                onPress={handleGoToDeals}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.mobileMenuItemText,
                    { color: theme.text },
                    isDeals && { fontWeight: '700', color: theme.tabActive },
                  ]}
                >
                  {t('nav_monthly_deals')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.mobileMenuItem}
                onPress={handleGoToDynamic}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.mobileMenuItemText,
                    { color: theme.text },
                    isDynamic && { fontWeight: '700', color: theme.tabActive },
                  ]}
                >
                  {t('nav_dynamic_destinations')}
                </Text>
              </TouchableOpacity>
              {isAdmin ? (
                <TouchableOpacity
                  style={styles.mobileMenuItem}
                  onPress={handleGoToAdminSettings}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.mobileMenuItemText,
                      { color: theme.text },
                      isAdminSettings && { fontWeight: '700', color: theme.tabActive },
                    ]}
                  >
                    {t('nav_admin_settings')}
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </Pressable>
      </Modal>
    )}
    </>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  titleWrap: {
    minWidth: 0,
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  menuWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    pointerEvents: 'box-none',
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rightActionsRTL: {
    marginLeft: 0,
    marginRight: 'auto',
    flexDirection: 'row-reverse',
  },
  localeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  localeBtnText: { fontSize: 18 },
  themeToggle: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  themeToggleRTL: {},
  localeOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  localeModal: {
    width: '100%',
    maxWidth: 360,
    maxHeight: '80%',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  localeModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  localeModalTitle: { fontSize: 18, fontWeight: '700' },
  localeModalClose: { padding: 8 },
  localeModalCloseText: { fontSize: 20 },
  localeModalScroll: { maxHeight: 400 },
  localeModalContent: { padding: 16, paddingBottom: 24 },
  localeSectionLabel: { fontSize: 12, fontWeight: '600', marginBottom: 8 },
  localeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 4,
  },
  localeOptionText: { fontSize: 16 },
  mobileSide: {
    width: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  mobileMenuBtn: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  mobileMenuPanel: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '55%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  mobileMenuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  mobileMenuItem: {
    paddingVertical: 10,
  },
  mobileMenuItemText: {
    fontSize: 16,
  },
});
