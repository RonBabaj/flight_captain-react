import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../theme/ThemeContext';
import { useLocale } from '../../../context/LocaleContext';
import { useAuth } from '../../../context/AuthContext';
import { ChangePasswordForm } from '../../auth/components/LoginForm';

function roleLabel(role: string, t: (key: string) => string): string {
  if (role === 'admin') return t('auth_role_admin');
  if (role === 'user') return t('auth_role_user');
  return t('auth_role_guest');
}

export function AccountSection() {
  const { theme } = useTheme();
  const { t } = useLocale();
  const navigation = useNavigation();
  const { loading, isSignedIn, email, role, mustChangePassword, signOut } = useAuth();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  if (mustChangePassword && isSignedIn) {
    return (
      <View style={styles.stack}>
        <Text style={[styles.notice, { color: theme.textMuted }]}>{t('auth_must_change_password_notice')}</Text>
        <ChangePasswordForm compact />
      </View>
    );
  }

  if (!isSignedIn) {
    return (
      <View style={styles.stack}>
        <Text style={[styles.guestText, { color: theme.textMuted }]}>{t('settings_account_guest_hint')}</Text>
        <View style={styles.actionsRow}>
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
      </View>
    );
  }

  return (
    <View style={styles.stack}>
      <View style={styles.signedInRow}>
        <View style={styles.signedInMeta}>
          <Text style={[styles.email, { color: theme.text }]}>{email}</Text>
          <View style={[styles.roleBadge, { backgroundColor: theme.primary + '18' }]}>
            <Text style={[styles.roleText, { color: theme.primaryLight }]}>{roleLabel(role, t)}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={signOut} style={styles.linkBtn}>
          <Text style={{ color: theme.primary }}>{t('auth_sign_out')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 12 },
  centered: { paddingVertical: 12, alignItems: 'center' },
  guestText: { fontSize: 14, lineHeight: 20 },
  actionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
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
  signedInRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  signedInMeta: { flex: 1, minWidth: 0, gap: 6 },
  email: { fontSize: 15, fontWeight: '600' },
  roleBadge: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  roleText: { fontSize: 12, fontWeight: '700' },
  linkBtn: { padding: 8 },
  notice: { fontSize: 13, lineHeight: 18 },
});
