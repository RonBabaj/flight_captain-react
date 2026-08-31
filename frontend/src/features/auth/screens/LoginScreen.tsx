import React from 'react';
import { ScrollView, Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../theme/ThemeContext';
import { useLocale } from '../../../context/LocaleContext';
import { LoginForm } from '../components/LoginForm';

export function LoginScreen() {
  const { theme } = useTheme();
  const { t } = useLocale();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.screenBg }]}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: Math.max(insets.bottom, 24) + 24 },
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.pageTitle, { color: theme.text }]} accessibilityRole="header">
        {t('auth_login_page_title')}
      </Text>
      <Text style={[styles.pageSubtitle, { color: theme.textMuted }]}>{t('auth_login_page_subtitle')}</Text>
      <LoginForm onSuccess={() => navigation.navigate('Account' as never)} />
      <View style={styles.footerRow}>
        <Text style={[styles.footerText, { color: theme.textMuted }]}>{t('auth_no_account')}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register' as never)}>
          <Text style={[styles.footerLink, { color: theme.primary }]}>{t('auth_create_account')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: 20,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 6,
  },
  pageSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  footerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
    justifyContent: 'center',
  },
  footerText: { fontSize: 14 },
  footerLink: { fontSize: 14, fontWeight: '600' },
});
