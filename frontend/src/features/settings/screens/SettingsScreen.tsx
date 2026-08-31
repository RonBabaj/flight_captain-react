import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme/ThemeContext';
import { useLocale } from '../../../context/LocaleContext';
import { useAuth } from '../../../context/AuthContext';
import { UserPreferencesSection } from '../components/UserPreferencesSection';
import { SettingsSection } from '../components/SettingsSection';
import { AccountSection } from '../components/AccountSection';
import { AdminRuntimeConfigPanel } from '../../admin/components/AdminRuntimeConfigPanel';
import { UserManagementPanel } from '../../admin/components/UserManagementPanel';

export function SettingsScreen() {
  const { theme } = useTheme();
  const { t } = useLocale();
  const { isAdmin } = useAuth();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.screenBg }]}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: Math.max(insets.bottom, 24) + 24 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.pageTitle, { color: theme.text }]} accessibilityRole="header">
        {t('settings_page_title')}
      </Text>
      <Text style={[styles.pageSubtitle, { color: theme.textMuted }]}>{t('settings_page_subtitle')}</Text>

      <SettingsSection
        icon="person-outline"
        title={t('settings_account_title')}
        subtitle={t('settings_account_subtitle')}
      >
        <AccountSection />
      </SettingsSection>

      <UserPreferencesSection />

      {isAdmin ? (
        <>
          <SettingsSection
            icon="shield-outline"
            title={t('settings_admin_title')}
            subtitle={t('settings_admin_subtitle')}
          >
            <AdminRuntimeConfigPanel />
          </SettingsSection>

          <SettingsSection
            icon="person-outline"
            title={t('settings_users_title')}
            subtitle={t('settings_users_subtitle')}
          >
            <UserManagementPanel />
          </SettingsSection>
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: 20,
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  pageSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
});
