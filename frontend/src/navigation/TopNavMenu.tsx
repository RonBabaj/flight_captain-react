import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { useLocale } from '../context/LocaleContext';
import { LANGUAGES, CURRENCIES } from '../data/translations';
import { useSearchStore } from '../store';
import type { RootStackParamList } from './types';
import type { LanguageCode, CurrencyCode } from '../data/translations';

type RouteProps = RouteProp<RootStackParamList, keyof RootStackParamList>;

const TITLE_KEYS: Record<string, string> = {
  SearchForm: 'nav_flight_search',
  Results: 'nav_results',
  Search: 'nav_flight_search',
  MonthDeals: 'nav_monthly_deals',
};

export function TopNavMenu() {
  const { theme, toggleTheme } = useTheme();
  const { t, language, currency, setLanguage, setCurrency, isRTL } = useLocale();
  const navigation = useNavigation();
  const route = useRoute<RouteProps>();
  const sessionId = useSearchStore((s) => s.sessionId);
  const currentRoot = route.name;
  const [showLocaleModal, setShowLocaleModal] = useState(false);

  const nestedName = currentRoot === 'Search'
    ? getFocusedRouteNameFromRoute(route) ?? 'SearchForm'
    : null;
  const titleKey = nestedName ? TITLE_KEYS[nestedName] ?? TITLE_KEYS.Search : TITLE_KEYS[currentRoot];
  const title = t(titleKey);

  const isSearch = currentRoot === 'Search';
  const isDeals = currentRoot === 'MonthDeals';

  return (
    <>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
      <View style={[styles.bar, { backgroundColor: theme.navBg, borderBottomColor: theme.cardBorder, direction: 'ltr' }]}>
      {isRTL ? (
        <>
          <View style={[styles.rightActions, styles.rightActionsRTL]}>
            <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
              <Ionicons name={theme.isDark ? 'sunny-outline' : 'moon-outline'} size={20} color={theme.tabInactive} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.localeBtn} onPress={() => setShowLocaleModal(true)}>
              <Ionicons name="globe-outline" size={20} color={theme.tabInactive} />
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
              onPress={() => {
                if (isSearch) return;
                if (sessionId) {
                  (navigation as any).navigate('Search', { screen: 'Results', params: { sessionId } });
                } else {
                  navigation.navigate('Search' as never);
                }
              }}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, { color: theme.tabInactive }, isSearch && { color: theme.tabActive }]}>{t('nav_search')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab} onPress={() => !isDeals && navigation.navigate('MonthDeals' as never)} activeOpacity={0.8}>
              <Text style={[styles.tabText, { color: theme.tabInactive }, isDeals && { color: theme.tabActive }]}>{t('nav_monthly_deals')}</Text>
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
        <TouchableOpacity
          style={styles.tab}
          onPress={() => {
            if (isSearch) return;
            if (sessionId) {
              (navigation as any).navigate('Search', { screen: 'Results', params: { sessionId } });
            } else {
              navigation.navigate('Search' as never);
            }
          }}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, { color: theme.tabInactive }, isSearch && { color: theme.tabActive }]}>
            {t('nav_search')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => !isDeals && navigation.navigate('MonthDeals' as never)}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, { color: theme.tabInactive }, isDeals && { color: theme.tabActive }]}>
            {t('nav_monthly_deals')}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.rightActions}>
            <TouchableOpacity style={styles.localeBtn} onPress={() => setShowLocaleModal(true)}>
              <Ionicons name="globe-outline" size={20} color={theme.tabInactive} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
              <Ionicons name={theme.isDark ? 'sunny-outline' : 'moon-outline'} size={20} color={theme.tabInactive} />
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
              <Ionicons name="close" size={24} color={theme.textMuted} />
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
    </>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  titleWrap: {
    minWidth: 0,
    flex: 1,
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
    gap: 28,
    pointerEvents: 'box-none',
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 'auto',
  },
  rightActionsRTL: {
    marginLeft: 0,
    marginRight: 'auto',
    flexDirection: 'row-reverse',
  },
  localeBtn: {
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  localeBtnText: { fontSize: 18 },
  themeToggle: {
    paddingVertical: 6,
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
});
