import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import type { RootStackParamList } from './types';

type RouteProps = RouteProp<RootStackParamList, keyof RootStackParamList>;

const TITLES: Record<string, string> = {
  SearchForm: 'Flight Search',
  Results: 'Results',
  Search: 'Flight Search',
  MonthDeals: 'Monthly Deals',
};

export function TopNavMenu() {
  const { theme, toggleTheme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<RouteProps>();
  const currentRoot = route.name;

  const nestedName = currentRoot === 'Search'
    ? getFocusedRouteNameFromRoute(route) ?? 'SearchForm'
    : null;
  const title = nestedName ? TITLES[nestedName] ?? TITLES.Search : TITLES[currentRoot];

  const isSearch = currentRoot === 'Search';
  const isDeals = currentRoot === 'MonthDeals';

  return (
    <>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
      <View style={[styles.bar, { backgroundColor: theme.navBg, borderBottomColor: theme.cardBorder }]}>
      <View style={styles.titleWrap}>
        <Text style={[styles.title, { color: theme.tabActive }]} numberOfLines={1}>
          {title}
        </Text>
      </View>
      <View style={styles.menuWrap}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => !isSearch && navigation.navigate('Search' as never)}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, { color: theme.tabInactive }, isSearch && { color: theme.tabActive }]}>
            Search
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => !isDeals && navigation.navigate('MonthDeals' as never)}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, { color: theme.tabInactive }, isDeals && { color: theme.tabActive }]}>
            Monthly Deals
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
        <Text style={[styles.themeToggleText, { color: theme.tabInactive }]}>
          {theme.isDark ? '☀️ Light' : '🌙 Dark'}
        </Text>
      </TouchableOpacity>
    </View>
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
  themeToggle: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignSelf: 'flex-end',
  },
  themeToggleText: {
    fontSize: 14,
    fontWeight: '600',
  }
});
