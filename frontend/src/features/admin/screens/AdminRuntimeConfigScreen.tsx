import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../theme/ThemeContext';
import { useLocale } from '../../../context/LocaleContext';
import { useAuth } from '../../../context/AuthContext';
import { SettingsPageLayout } from '../../settings/components/SettingsPageLayout';
import { AdminRuntimeConfigPanel } from '../components/AdminRuntimeConfigPanel';

export function AdminRuntimeConfigScreen() {
  const { theme } = useTheme();
  const { t } = useLocale();
  const navigation = useNavigation();
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <SettingsPageLayout title={t('admin_runtime_title')} subtitle={t('admin_runtime_subtitle')}>
        <Text style={{ color: theme.textMuted }}>{t('common_loading')}</Text>
      </SettingsPageLayout>
    );
  }

  if (!isAdmin) {
    return (
      <SettingsPageLayout title={t('admin_runtime_title')} subtitle={t('admin_access_denied')}>
        <TouchableOpacity
          style={[styles.linkBtn, { borderColor: theme.cardBorder }]}
          onPress={() => navigation.navigate('Admin' as never)}
        >
          <Text style={{ color: theme.primary }}>{t('admin_back_to_hub')}</Text>
        </TouchableOpacity>
      </SettingsPageLayout>
    );
  }

  return (
    <SettingsPageLayout title={t('admin_runtime_title')} subtitle={t('admin_runtime_subtitle')}>
      <AdminRuntimeConfigPanel />
    </SettingsPageLayout>
  );
}

const styles = StyleSheet.create({
  linkBtn: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
});
