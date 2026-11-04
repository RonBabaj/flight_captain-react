import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { ClearableTextInput } from '../../../components/ClearableTextInput';
import { useTheme } from '../../../theme/ThemeContext';
import { useLocale } from '../../../context/LocaleContext';
import { useAuth } from '../../../context/AuthContext';
import {
  createUser,
  deleteUser,
  fetchUsers,
  updateUser,
  type ManagedUser,
} from '../../../api/auth';

export function UserManagementPanel() {
  const { theme } = useTheme();
  const { t } = useLocale();
  const { token } = useAuth();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'user' | 'admin'>('user');
  const [creating, setCreating] = useState(false);

  const loadUsers = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const list = await fetchUsers(token);
      setUsers(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const handleCreate = async () => {
    if (!token || !newEmail.trim() || !newPassword) return;
    setCreating(true);
    setError('');
    try {
      const user = await createUser(token, newEmail.trim(), newPassword, newRole);
      setUsers((prev) => [...prev, user].sort((a, b) => a.email.localeCompare(b.email)));
      setNewEmail('');
      setNewPassword('');
      setNewRole('user');
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setCreating(false);
    }
  };

  const toggleRole = async (user: ManagedUser) => {
    if (!token) return;
    const nextRole = user.role === 'admin' ? 'user' : 'admin';
    setError('');
    try {
      const updated = await updateUser(token, user.id, { role: nextRole });
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  const handleDelete = async (user: ManagedUser) => {
    if (!token) return;
    setError('');
    try {
      await deleteUser(token, user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  if (loading) {
    return <ActivityIndicator color={theme.primary} style={{ marginVertical: 16 }} />;
  }

  return (
    <View style={styles.panel}>
      <Text style={[styles.sectionHint, { color: theme.textMuted }]}>{t('settings_users_subtitle')}</Text>

      {users.map((user) => (
        <View
          key={user.id}
          style={[styles.userRow, { backgroundColor: theme.screenBg, borderColor: theme.cardBorder }]}
        >
          <View style={styles.userMeta}>
            <Text style={[styles.userEmail, { color: theme.text }]}>{user.email}</Text>
            <Text style={[styles.userRole, { color: theme.textMuted }]}>
              {user.role === 'admin' ? t('auth_role_admin') : t('auth_role_user')}
            </Text>
          </View>
          <View style={styles.userActions}>
            <TouchableOpacity onPress={() => toggleRole(user)} style={styles.linkBtn}>
              <Text style={{ color: theme.primary }}>
                {user.role === 'admin' ? t('settings_users_make_user') : t('settings_users_make_admin')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(user)} style={styles.linkBtn}>
              <Text style={{ color: theme.error }}>{t('settings_users_delete')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <View style={[styles.createCard, { backgroundColor: theme.screenBg, borderColor: theme.cardBorder }]}>
        <Text style={[styles.createTitle, { color: theme.text }]}>{t('settings_users_create_title')}</Text>
        <ClearableTextInput
          style={[styles.input, { color: theme.text, borderColor: theme.cardBorder, backgroundColor: theme.cardBg }]}
          value={newEmail}
          onChangeText={setNewEmail}
          placeholder={t('auth_email_placeholder')}
          placeholderTextColor={theme.textMuted}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <ClearableTextInput
          style={[styles.input, { color: theme.text, borderColor: theme.cardBorder, backgroundColor: theme.cardBg }]}
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder={t('auth_new_password_placeholder')}
          placeholderTextColor={theme.textMuted}
          secureTextEntry
          autoCapitalize="none"
        />
        <View style={styles.rolePicker}>
          {(['user', 'admin'] as const).map((role) => (
            <TouchableOpacity
              key={role}
              style={[
                styles.roleOption,
                {
                  borderColor: newRole === role ? theme.primary : theme.cardBorder,
                  backgroundColor: newRole === role ? theme.primary + '14' : 'transparent',
                },
              ]}
              onPress={() => setNewRole(role)}
            >
              <Text style={{ color: newRole === role ? theme.primary : theme.textMuted }}>
                {role === 'admin' ? t('auth_role_admin') : t('auth_role_user')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: theme.primary }]}
          onPress={handleCreate}
          disabled={creating || !newEmail.trim() || newPassword.length < 8}
        >
          {creating ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryBtnText}>{t('settings_users_create_button')}</Text>
          )}
        </TouchableOpacity>
      </View>

      {error ? <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { gap: 10 },
  sectionHint: { fontSize: 13, lineHeight: 18, marginBottom: 4 },
  userRow: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  userMeta: { gap: 2 },
  userEmail: { fontSize: 15, fontWeight: '600' },
  userRole: { fontSize: 12 },
  userActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  linkBtn: { paddingVertical: 4, paddingHorizontal: 2 },
  createCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
    gap: 8,
  },
  createTitle: { fontSize: 15, fontWeight: '600', marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  rolePicker: { flexDirection: 'row', gap: 8 },
  roleOption: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  primaryBtn: {
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  primaryBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  errorText: { fontSize: 13, marginTop: 4 },
});
