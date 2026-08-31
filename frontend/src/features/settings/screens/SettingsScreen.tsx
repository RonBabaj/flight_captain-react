import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../theme/ThemeContext';
import { useLocale } from '../../../context/LocaleContext';
import { useAuth } from '../../../context/AuthContext';
import { SettingsPageLayout } from '../components/SettingsPageLayout';
import { SettingsNavRow } from '../components/SettingsNavRow';
import { UserPreferencesSection } from '../components/UserPreferencesSection';

export function SettingsScreen() {
  const { theme } = useTheme();
  const { t } = useLocale();
  const navigation = useNavigation();
  const { isSignedIn, isAdmin, email, loading } = useAuth();

  const accountSubtitle = loading
    ? t('common_loading')
    : isSignedIn
      ? email ?? t('settings_account_signed_in')
      : t('settings_account_guest_nav');

  return (
    <SettingsPageLayout title={t('settings_page_title')} subtitle={t('settings_page_subtitle_slim')}>
      <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>{t('settings_section_app')}</Text>
      <UserPreferencesSection />

      <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>{t('settings_section_you')}</Text>
      <SettingsNavRow
        icon="person-outline"
        title={t('settings_account_title')}
        subtitle={accountSubtitle}
        onPress={() =>
          isSignedIn
            ? navigation.navigate('Account' as never)
            : navigation.navigate('Login' as never)
        }
        disabled={loading}
      />

      {isAdmin ? (
        <>
          <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>{t('settings_section_admin')}</Text>
          <SettingsNavRow
            icon="shield-outline"
            title={t('admin_hub_title')}
            subtitle={t('admin_hub_nav_subtitle')}
            onPress={() => navigation.navigate('Admin' as never)}
          />
        </>
      ) : null}
    </SettingsPageLayout>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginTop: 4,
  },
});
