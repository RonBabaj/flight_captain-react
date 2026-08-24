import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import { AppIcon } from '../components/AppIcon';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { useLocale } from '../context/LocaleContext';
import { useSearchStore } from '../store';
import { useIsMobile } from '../hooks/useResponsive';
import type { RootStackParamList } from './types';

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
  Settings: 'nav_settings',
  Login: 'auth_login_page_title',
};

type NavIconName = 'home-outline' | 'search-outline' | 'calendar-outline' | 'airplane-outline';

function MobileNavRow({
  icon,
  label,
  active,
  onPress,
}: {
  icon: NavIconName;
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      style={[
        styles.mobileMenuItem,
        {
          backgroundColor: active ? theme.primary + '14' : 'transparent',
          borderColor: active ? theme.primary + '44' : 'transparent',
        },
      ]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={[styles.mobileMenuIconWrap, { backgroundColor: theme.controlBg }]}>
        <AppIcon name={icon} size={20} color={active ? theme.primary : theme.textMuted} fallbackText="" />
      </View>
      <View style={styles.mobileMenuTextWrap}>
        <Text
          style={[
            styles.mobileMenuItemText,
            { color: active ? theme.primary : theme.text },
            active && styles.mobileMenuItemTextActive,
          ]}
        >
          {label}
        </Text>
      </View>
      <AppIcon name="chevron-forward" size={18} color={theme.textMuted} fallbackText="" />
    </TouchableOpacity>
  );
}

export function TopNavMenu() {
  const { theme, toggleTheme } = useTheme();
  const { t, isRTL } = useLocale();
  const navigation = useNavigation();
  const route = useRoute<RouteProps>();
  const insets = useSafeAreaInsets();
  const sessionId = useSearchStore((s) => s.sessionId);
  const currentRoot = route.name;
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
  const isSettings = currentRoot === 'Settings';

  const closeMobileMenu = () => setShowMobileMenu(false);

  const handleGoToHome = () => {
    if (!isHome) navigation.navigate('Home' as never);
    closeMobileMenu();
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
    closeMobileMenu();
  };

  const handleGoToDeals = () => {
    if (!isDeals) navigation.navigate('MonthDeals' as never);
    closeMobileMenu();
  };

  const handleGoToDynamic = () => {
    if (!isDynamic) navigation.navigate('DynamicDestinations' as never);
    closeMobileMenu();
  };

  const handleGoToSettings = () => {
    if (!isSettings) navigation.navigate('Settings' as never);
    closeMobileMenu();
  };

  const navActions = (
    <View style={[styles.rightActions, isRTL && styles.rightActionsRTL]}>
      <TouchableOpacity
        style={styles.iconBtn}
        onPress={handleGoToSettings}
        activeOpacity={0.8}
        accessibilityLabel={t('nav_settings')}
      >
        <AppIcon
          name="settings-outline"
          size={21}
          color={isSettings ? theme.tabActive : theme.tabInactive}
          fallbackText=""
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconBtn} onPress={toggleTheme} activeOpacity={0.8}>
        <AppIcon
          name={theme.isDark ? 'sunny-outline' : 'moon-outline'}
          size={20}
          color={theme.tabInactive}
          fallbackText={theme.isDark ? 'Light' : 'Dark'}
        />
      </TouchableOpacity>
    </View>
  );

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
                accessibilityLabel={t('nav_sections')}
              >
                <AppIcon name="menu-outline" size={22} color={theme.tabInactive} fallbackText="Menu" />
              </TouchableOpacity>
            </View>
            <View style={styles.titleWrap}>
              <Text style={[styles.title, { color: theme.tabActive }]} numberOfLines={1}>
                {title}
              </Text>
            </View>
            {navActions}
          </>
        ) : isRTL ? (
          <>
            {navActions}
            <View style={styles.titleWrap}>
              <Text style={[styles.title, { color: theme.tabActive }]} numberOfLines={1}>
                {title}
              </Text>
            </View>
            <View style={styles.menuWrap}>
              <TouchableOpacity style={styles.tab} onPress={handleGoToHome} activeOpacity={0.8}>
                <Text style={[styles.tabText, { color: theme.tabInactive }, isHome && { color: theme.tabActive }]}>
                  {t('nav_home')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tab} onPress={handleGoToSearch} activeOpacity={0.8}>
                <Text style={[styles.tabText, { color: theme.tabInactive }, isSearch && { color: theme.tabActive }]}>
                  {t('nav_search')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tab} onPress={handleGoToDeals} activeOpacity={0.8}>
                <Text style={[styles.tabText, { color: theme.tabInactive }, isDeals && { color: theme.tabActive }]}>
                  {t('nav_monthly_deals')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tab} onPress={handleGoToDynamic} activeOpacity={0.8}>
                <Text style={[styles.tabText, { color: theme.tabInactive }, isDynamic && { color: theme.tabActive }]}>
                  {t('nav_dynamic_destinations')}
                </Text>
              </TouchableOpacity>
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
              <TouchableOpacity style={styles.tab} onPress={handleGoToHome} activeOpacity={0.8}>
                <Text style={[styles.tabText, { color: theme.tabInactive }, isHome && { color: theme.tabActive }]}>
                  {t('nav_home')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tab} onPress={handleGoToSearch} activeOpacity={0.8}>
                <Text style={[styles.tabText, { color: theme.tabInactive }, isSearch && { color: theme.tabActive }]}>
                  {t('nav_search')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tab} onPress={handleGoToDeals} activeOpacity={0.8}>
                <Text style={[styles.tabText, { color: theme.tabInactive }, isDeals && { color: theme.tabActive }]}>
                  {t('nav_monthly_deals')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tab} onPress={handleGoToDynamic} activeOpacity={0.8}>
                <Text style={[styles.tabText, { color: theme.tabInactive }, isDynamic && { color: theme.tabActive }]}>
                  {t('nav_dynamic_destinations')}
                </Text>
              </TouchableOpacity>
            </View>
            {navActions}
          </>
        )}
      </View>

      {isMobile && (
        <Modal visible={showMobileMenu} transparent animationType="slide">
          <Pressable style={styles.mobileMenuOverlay} onPress={closeMobileMenu}>
            <View
              style={[
                styles.mobileMenuPanel,
                {
                  backgroundColor: theme.cardBg,
                  borderColor: theme.cardBorder,
                  paddingBottom: Math.max(insets.bottom, 16),
                },
              ]}
              onStartShouldSetResponder={() => true}
            >
              <View style={[styles.mobileMenuHandle, { backgroundColor: theme.cardBorder }]} />
              <View style={[styles.localeModalHeader, { borderBottomColor: theme.cardBorder }]}>
                <Text style={[styles.localeModalTitle, { color: theme.text }]}>{t('nav_sections')}</Text>
                <TouchableOpacity onPress={closeMobileMenu} style={styles.localeModalClose}>
                  <AppIcon name="close" size={24} color={theme.textMuted} fallbackText="Close" />
                </TouchableOpacity>
              </View>
              <ScrollView
                style={styles.mobileMenuScroll}
                contentContainerStyle={styles.mobileMenuScrollContent}
                showsVerticalScrollIndicator={false}
              >
                <MobileNavRow icon="home-outline" label={t('nav_home')} active={isHome} onPress={handleGoToHome} />
                <MobileNavRow icon="search-outline" label={t('nav_search')} active={isSearch} onPress={handleGoToSearch} />
                <MobileNavRow
                  icon="calendar-outline"
                  label={t('nav_monthly_deals')}
                  active={isDeals}
                  onPress={handleGoToDeals}
                />
                <MobileNavRow
                  icon="airplane-outline"
                  label={t('nav_dynamic_destinations')}
                  active={isDynamic}
                  onPress={handleGoToDynamic}
                />
              </ScrollView>
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
    gap: 4,
  },
  rightActionsRTL: {
    flexDirection: 'row-reverse',
  },
  iconBtn: {
    paddingVertical: 8,
    paddingHorizontal: 10,
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
    maxWidth: 480,
    maxHeight: '72%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  mobileMenuHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    marginTop: 10,
    marginBottom: 4,
  },
  mobileMenuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  mobileMenuScroll: {
    flexGrow: 0,
  },
  mobileMenuScrollContent: {
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 8,
    gap: 6,
  },
  mobileMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  mobileMenuIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileMenuTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  mobileMenuItemText: {
    fontSize: 17,
    fontWeight: '600',
  },
  mobileMenuItemTextActive: {
    fontWeight: '700',
  },
});
