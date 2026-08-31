import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../theme/ThemeContext';
import { useLocale } from '../../../context/LocaleContext';
import { useAuth } from '../../../context/AuthContext';
import { SettingsPageLayout } from '../../settings/components/SettingsPageLayout';
import { SettingsNavRow } from '../../settings/components/SettingsNavRow';

export function AdminHubScreen() {
  const { theme } = useTheme();
  const { t } = useLocale();
  const navigation = useNavigation();
  const { isAdmin, isSignedIn, loading } = useAuth();

  if (loading) {
    return (
      <SettingsPageLayout title={t('admin_hub_title')} subtitle={t('admin_hub_subtitle')}>
        <Text style={{ color: theme.textMuted }}>{t('common_loading')}</Text>
      </SettingsPageLayout>
    );
  }

  if (!isSignedIn) {
    return (
      <SettingsPageLayout title={t('admin_hub_title')} subtitle={t('admin_sign_in_required')}>
        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: theme.primary }]}
          onPress={() => navigation.navigate('Login' as never)}
        >
          <Text style={styles.primaryBtnText}>{t('auth_sign_in')}</Text>
        </TouchableOpacity>
      </SettingsPageLayout>
    );
  }

  if (!isAdmin) {
    return (
      <SettingsPageLayout title={t('admin_hub_title')} subtitle={t('admin_access_denied')}>
        <Text style={{ color: theme.textMuted, lineHeight: 20 }}>{t('admin_access_denied_body')}</Text>
      </SettingsPageLayout>
    );
  }

  return (
    <SettingsPageLayout title={t('admin_hub_title')} subtitle={t('admin_hub_subtitle')}>
      <SettingsNavRow
        icon="settings-outline"
        title={t('admin_runtime_title')}
        subtitle={t('admin_runtime_subtitle')}
        onPress={() => navigation.navigate('AdminRuntimeConfig' as never)}
      />
      <SettingsNavRow
        icon="person-outline"
        title={t('settings_users_title')}
        subtitle={t('settings_users_subtitle')}
        onPress={() => navigation.navigate('AdminUsers' as never)}
      />
    </SettingsPageLayout>
  );
}

const styles = StyleSheet.create({
  primaryBtn: {
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
});
