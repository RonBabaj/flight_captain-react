import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { useLocale } from '../../../context/LocaleContext';
import { useAuth } from '../../../context/AuthContext';

export function LoginForm({
  compact,
  onSuccess,
}: {
  compact?: boolean;
  onSuccess?: () => void;
}) {
  const { theme } = useTheme();
  const { t } = useLocale();
  const { signInWithPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSignIn = async () => {
    setSubmitting(true);
    setError('');
    try {
      const user = await signInWithPassword(email, password);
      if (!user) {
        setError(t('auth_login_failed'));
        return;
      }
      onSuccess?.();
    } catch (e) {
      if (e instanceof Error && e.message === 'AUTH_NOT_AVAILABLE') {
        setError(t('auth_not_available'));
        return;
      }
      if (e instanceof Error && e.message === 'AUTH_NOT_CONFIGURED') {
        setError(t('auth_not_configured'));
        return;
      }
      setError(t('auth_login_failed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View
      style={[
        styles.card,
        compact && styles.cardCompact,
        { backgroundColor: theme.screenBg, borderColor: theme.cardBorder },
      ]}
    >
      <Text style={[styles.title, { color: theme.text }]}>{t('auth_login_title')}</Text>
      <Text style={[styles.subtitle, { color: theme.textMuted }]}>{t('auth_login_subtitle')}</Text>
      <Text style={[styles.label, { color: theme.textMuted }]}>{t('auth_email_label')}</Text>
      <TextInput
        style={[
          styles.input,
          { color: theme.text, borderColor: theme.cardBorder, backgroundColor: theme.cardBg },
        ]}
        value={email}
        onChangeText={setEmail}
        placeholder={t('auth_email_placeholder')}
        placeholderTextColor={theme.textMuted}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        textContentType="username"
      />
      <Text style={[styles.label, { color: theme.textMuted }]}>{t('auth_password_label')}</Text>
      <TextInput
        style={[
          styles.input,
          { color: theme.text, borderColor: theme.cardBorder, backgroundColor: theme.cardBg },
        ]}
        value={password}
        onChangeText={setPassword}
        placeholder={t('auth_password_placeholder')}
        placeholderTextColor={theme.textMuted}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="password"
      />
      {error ? <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text> : null}
      <TouchableOpacity
        style={[styles.primaryBtn, { backgroundColor: theme.primary }]}
        onPress={handleSignIn}
        disabled={submitting || !email.trim() || !password}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryBtnText}>{t('auth_sign_in')}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

export function RegisterForm({
  compact,
  onSuccess,
}: {
  compact?: boolean;
  onSuccess?: () => void;
}) {
  const { theme } = useTheme();
  const { t } = useLocale();
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async () => {
    setError('');
    if (password.length < 8) {
      setError(t('auth_password_too_short'));
      return;
    }
    if (password !== confirmPassword) {
      setError(t('auth_password_mismatch'));
      return;
    }
    setSubmitting(true);
    try {
      const user = await register(email, password);
      if (!user) {
        setError(t('auth_register_failed'));
        return;
      }
      onSuccess?.();
    } catch (e) {
      if (e instanceof Error && e.message === 'REGISTRATION_DISABLED') {
        setError(t('auth_registration_disabled'));
        return;
      }
      if (e instanceof Error && e.message === 'EMAIL_TAKEN') {
        setError(t('auth_email_taken'));
        return;
      }
      setError(t('auth_register_failed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View
      style={[
        styles.card,
        compact && styles.cardCompact,
        { backgroundColor: theme.screenBg, borderColor: theme.cardBorder },
      ]}
    >
      <Text style={[styles.title, { color: theme.text }]}>{t('auth_register_title')}</Text>
      <Text style={[styles.subtitle, { color: theme.textMuted }]}>{t('auth_register_subtitle')}</Text>
      <Text style={[styles.label, { color: theme.textMuted }]}>{t('auth_email_label')}</Text>
      <TextInput
        style={[
          styles.input,
          { color: theme.text, borderColor: theme.cardBorder, backgroundColor: theme.cardBg },
        ]}
        value={email}
        onChangeText={setEmail}
        placeholder={t('auth_email_placeholder')}
        placeholderTextColor={theme.textMuted}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Text style={[styles.label, { color: theme.textMuted }]}>{t('auth_password_label')}</Text>
      <TextInput
        style={[
          styles.input,
          { color: theme.text, borderColor: theme.cardBorder, backgroundColor: theme.cardBg },
        ]}
        value={password}
        onChangeText={setPassword}
        placeholder={t('auth_new_password_placeholder')}
        placeholderTextColor={theme.textMuted}
        secureTextEntry
        autoCapitalize="none"
      />
      <TextInput
        style={[
          styles.input,
          { color: theme.text, borderColor: theme.cardBorder, backgroundColor: theme.cardBg },
        ]}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder={t('auth_confirm_password_placeholder')}
        placeholderTextColor={theme.textMuted}
        secureTextEntry
        autoCapitalize="none"
      />
      {error ? <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text> : null}
      <TouchableOpacity
        style={[styles.primaryBtn, { backgroundColor: theme.primary }]}
        onPress={handleRegister}
        disabled={submitting || !email.trim() || !password || !confirmPassword}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryBtnText}>{t('auth_create_account')}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

export function ChangePasswordForm({ compact }: { compact?: boolean }) {
  const { theme } = useTheme();
  const { t } = useLocale();
  const { changePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setMessage('');
    if (newPassword.length < 8) {
      setError(t('auth_password_too_short'));
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(t('auth_password_mismatch'));
      return;
    }
    setSubmitting(true);
    try {
      const ok = await changePassword(currentPassword, newPassword);
      if (!ok) {
        setError(t('auth_change_password_failed'));
        return;
      }
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setMessage(t('auth_change_password_success'));
    } catch {
      setError(t('auth_change_password_failed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View
      style={[
        styles.card,
        compact && styles.cardCompact,
        { backgroundColor: theme.screenBg, borderColor: theme.cardBorder },
      ]}
    >
      <Text style={[styles.title, { color: theme.text }]}>{t('auth_change_password_title')}</Text>
      <Text style={[styles.subtitle, { color: theme.textMuted }]}>{t('auth_change_password_subtitle')}</Text>
      <TextInput
        style={[
          styles.input,
          { color: theme.text, borderColor: theme.cardBorder, backgroundColor: theme.cardBg },
        ]}
        value={currentPassword}
        onChangeText={setCurrentPassword}
        placeholder={t('auth_current_password_placeholder')}
        placeholderTextColor={theme.textMuted}
        secureTextEntry
        autoCapitalize="none"
      />
      <TextInput
        style={[
          styles.input,
          { color: theme.text, borderColor: theme.cardBorder, backgroundColor: theme.cardBg },
        ]}
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder={t('auth_new_password_placeholder')}
        placeholderTextColor={theme.textMuted}
        secureTextEntry
        autoCapitalize="none"
      />
      <TextInput
        style={[
          styles.input,
          { color: theme.text, borderColor: theme.cardBorder, backgroundColor: theme.cardBg },
        ]}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder={t('auth_confirm_password_placeholder')}
        placeholderTextColor={theme.textMuted}
        secureTextEntry
        autoCapitalize="none"
      />
      {error ? <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text> : null}
      {message ? <Text style={[styles.successText, { color: theme.primary }]}>{message}</Text> : null}
      <TouchableOpacity
        style={[styles.primaryBtn, { backgroundColor: theme.primary }]}
        onPress={handleSubmit}
        disabled={submitting || !currentPassword || !newPassword || !confirmPassword}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryBtnText}>{t('auth_change_password_button')}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
  },
  cardCompact: {
    marginTop: 0,
  },
  title: { fontSize: 17, fontWeight: '700', marginBottom: 4 },
  subtitle: { fontSize: 13, lineHeight: 18, marginBottom: 12 },
  label: { fontSize: 12, fontWeight: '600', marginBottom: 6, marginTop: 4 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 8,
  },
  primaryBtn: {
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  errorText: { marginTop: 4, fontSize: 13 },
  successText: { marginTop: 4, fontSize: 13 },
});
