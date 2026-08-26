import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../theme/ThemeContext';
import { useLocale } from '../../../context/LocaleContext';
import { useAuth } from '../../../context/AuthContext';
import { SettingsPageLayout } from '../../settings/components/SettingsPageLayout';
import { SettingsSection, SettingsPlaceholder } from '../../settings/components/SettingsSection';
import { SettingsNavRow } from '../../settings/components/SettingsNavRow';
import { ChangePasswordForm } from '../../auth/components/LoginForm';

export function AccountScreen() {
  const { theme } = useTheme();
  const { t } = useLocale();
  const navigation = useNavigation();
  const { loading, isSignedIn, email, role, mustChangePassword, signOut } = useAuth();

  if (loading) {
    return (
      <SettingsPageLayout title={t('account_page_title')} subtitle={t('account_page_subtitle')}>
        <Text style={{ color: theme.textMuted }}>{t('common_loading')}</Text>
      </SettingsPageLayout>
    );
  }

  if (!isSignedIn) {
    return (
      <SettingsPageLayout title={t('account_page_title')} subtitle={t('account_guest_subtitle')}>
        <View style={styles.guestActions}>
          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: theme.primary }]}
            onPress={() => navigation.navigate('Login' as never)}
          >
            <Text style={styles.primaryBtnText}>{t('auth_sign_in')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.secondaryBtn, { borderColor: theme.cardBorder }]}
            onPress={() => navigation.navigate('Register' as never)}
          >
            <Text style={{ color: theme.text }}>{t('auth_create_account')}</Text>
          </TouchableOpacity>
        </View>
      </SettingsPageLayout>
    );
  }

  if (mustChangePassword) {
    return (
      <SettingsPageLayout title={t('account_page_title')} subtitle={t('auth_must_change_password_notice')}>
        <ChangePasswordForm compact />
      </SettingsPageLayout>
    );
  }

  const roleLabel =
    role === 'admin' ? t('auth_role_admin') : role === 'user' ? t('auth_role_user') : t('auth_role_guest');

  return (
    <SettingsPageLayout title={t('account_page_title')} subtitle={t('account_page_subtitle')}>
      <View style={[styles.summaryCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
        <Text style={[styles.email, { color: theme.text }]}>{email}</Text>
        <View style={[styles.roleBadge, { backgroundColor: theme.primary + '18' }]}>
          <Text style={[styles.roleText, { color: theme.primaryLight }]}>{roleLabel}</Text>
        </View>
      </View>

      <SettingsSection
        icon="person-outline"
        title={t('settings_profile_title')}
        subtitle={t('settings_profile_subtitle')}
      >
        <SettingsPlaceholder text={t('settings_feature_coming_soon')} />
      </SettingsSection>

      <SettingsSection
        icon="heart-outline"
        title={t('settings_favorites_title')}
        subtitle={t('settings_favorites_subtitle')}
      >
        <SettingsPlaceholder text={t('settings_feature_coming_soon')} />
      </SettingsSection>

      <SettingsSection
        icon="options-outline"
        title={t('settings_search_defaults_title')}
        subtitle={t('settings_search_defaults_subtitle')}
      >
        <SettingsPlaceholder text={t('settings_feature_coming_soon')} />
      </SettingsSection>

      <SettingsSection
        icon="shield-outline"
        title={t('account_security_title')}
        subtitle={t('account_security_subtitle')}
      >
        <ChangePasswordForm compact />
      </SettingsSection>

      <TouchableOpacity onPress={signOut} style={[styles.signOutBtn, { borderColor: theme.cardBorder }]}>
        <Text style={{ color: theme.error, fontWeight: '600' }}>{t('auth_sign_out')}</Text>
      </TouchableOpacity>
    </SettingsPageLayout>
  );
}

const styles = StyleSheet.create({
  guestActions: { gap: 10, marginTop: 8 },
  primaryBtn: {
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  secondaryBtn: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
    alignItems: 'center',
  },
  summaryCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    gap: 8,
  },
  email: { fontSize: 16, fontWeight: '700' },
  roleBadge: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  roleText: { fontSize: 12, fontWeight: '700' },
  signOutBtn: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
});
