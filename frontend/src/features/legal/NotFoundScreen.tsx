import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { useLocale } from '../../context/LocaleContext';
import type { RootStackParamList } from '../../navigation/types';
import { AppIcon } from '../../components/AppIcon';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

type Nav = NativeStackNavigationProp<RootStackParamList>;

/** Custom 404 — unknown deep links / mistyped paths land here instead of a blank shell. */
export function NotFoundScreen() {
  const { theme } = useTheme();
  const { t, isRTL } = useLocale();
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const textAlign = isRTL ? 'right' : 'left';
  useDocumentTitle('404');

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: theme.screenBg,
          paddingTop: insets.top + 48,
          paddingBottom: insets.bottom + 32,
        },
      ]}
    >
      <Text style={[styles.code, { color: theme.primary, fontFamily: theme.fontDisplay }]}>404</Text>
      <Text
        style={[styles.title, { color: theme.text, fontFamily: theme.fontDisplay, textAlign }]}
        accessibilityRole="header"
      >
        {t('not_found_title')}
      </Text>
      <Text style={[styles.body, { color: theme.textMuted, fontFamily: theme.fontBody, textAlign }]}>
        {t('not_found_body')}
      </Text>
      <TouchableOpacity
        style={[
          styles.btn,
          { backgroundColor: theme.buttonBg, borderRadius: theme.radiusMd },
        ]}
        onPress={() => navigation.navigate('Home')}
        accessibilityRole="button"
        accessibilityLabel={t('not_found_home')}
      >
        <AppIcon name="home-outline" size={18} color={theme.buttonText} fallbackText="" />
        <Text style={[styles.btnText, { color: theme.buttonText, fontFamily: theme.fontBody }]}>
          {t('not_found_home')}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.link}
        onPress={() => navigation.navigate('Search')}
        accessibilityRole="button"
      >
        <Text style={[styles.linkText, { color: theme.primaryLight, fontFamily: theme.fontBody }]}>
          {t('landing_cta_search')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  code: { fontSize: 56, fontWeight: '800', letterSpacing: -1, marginBottom: 4 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 6 },
  body: { fontSize: 15, lineHeight: 22, maxWidth: 420, marginBottom: 18, textAlign: 'center' },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 22,
    minHeight: 48,
  },
  btnText: { fontSize: 16, fontWeight: '700' },
  link: { paddingVertical: 10 },
  linkText: { fontSize: 15, fontWeight: '600' },
});
