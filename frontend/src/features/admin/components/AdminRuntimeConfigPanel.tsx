import React, { useEffect, useMemo, useState } from 'react';
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
import { useRuntimeConfig, useRuntimeConfigActions } from '../../../context/RuntimeConfigContext';
import { fetchAdminRuntimeConfig, saveAdminRuntimeConfig } from '../../../api/runtimeConfig';
import {
  DEFAULT_RUNTIME_CONFIG,
  RUNTIME_CONFIG_FIELDS,
  type RuntimeConfig,
  type RuntimeConfigFieldMeta,
} from '../../../types/runtimeConfig';

const SECTION_ORDER = ['search', 'explore', 'positioning', 'cache', 'backend'] as const;

const SECTION_LABEL_KEYS: Record<(typeof SECTION_ORDER)[number], string> = {
  search: 'admin_cfg_section_search',
  explore: 'admin_cfg_section_explore',
  positioning: 'admin_cfg_section_positioning',
  cache: 'admin_cfg_section_cache',
  backend: 'admin_cfg_section_backend',
};

function ConfigFieldRow({
  field,
  value,
  onChange,
}: {
  field: RuntimeConfigFieldMeta;
  value: number;
  onChange: (next: number) => void;
}) {
  const { theme } = useTheme();
  const { t } = useLocale();
  const [text, setText] = useState(String(value));

  useEffect(() => {
    setText(String(value));
  }, [value]);

  return (
    <View
      style={[
        styles.fieldCard,
        { backgroundColor: theme.screenBg, borderColor: theme.cardBorder },
      ]}
    >
      <Text style={[styles.fieldLabel, { color: theme.text }]}>{t(field.labelKey)}</Text>
      <Text style={[styles.fieldDesc, { color: theme.textMuted }]}>{t(field.descriptionKey)}</Text>
      <View style={styles.fieldInputRow}>
        <ClearableTextInput
          style={[
            styles.fieldInput,
            {
              color: theme.text,
              borderColor: theme.cardBorder,
              backgroundColor: theme.cardBg,
            },
          ]}
          containerStyle={styles.fieldInputWrap}
          value={text}
          keyboardType="numeric"
          onChangeText={(raw) => {
            setText(raw);
            const parsed = Number.parseInt(raw, 10);
            if (Number.isFinite(parsed)) onChange(parsed);
          }}
        />
        <Text style={[styles.fieldUnit, { color: theme.textMuted }]}>
          {field.unit === 'ms' ? t('admin_cfg_unit_ms') : field.unit === 'minutes' ? t('admin_cfg_unit_min') : t('admin_cfg_unit_count')}
        </Text>
      </View>
      <Text style={[styles.fieldBounds, { color: theme.textMuted }]}>
        {t('admin_cfg_bounds_prefix')} {field.min} – {field.max}
      </Text>
    </View>
  );
}

export function AdminRuntimeConfigPanel() {
  const { theme } = useTheme();
  const { t } = useLocale();
  const { token, email } = useAuth();
  const liveConfig = useRuntimeConfig();
  const { applyConfig, refresh } = useRuntimeConfigActions();
  const [draft, setDraft] = useState<RuntimeConfig>(liveConfig);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setDraft(liveConfig);
  }, [liveConfig]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const cfg = await fetchAdminRuntimeConfig(token);
        if (!cancelled) {
          setDraft(cfg);
          applyConfig(cfg);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : String(e));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, applyConfig]);

  const grouped = useMemo(() => {
    const map = new Map<string, RuntimeConfigFieldMeta[]>();
    for (const field of RUNTIME_CONFIG_FIELDS) {
      const list = map.get(field.section) ?? [];
      list.push(field);
      map.set(field.section, list);
    }
    return map;
  }, []);

  const updateField = (key: keyof RuntimeConfig, value: number) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const saved = await saveAdminRuntimeConfig(token, draft);
      applyConfig(saved);
      setDraft(saved);
      await refresh();
      setMessage(t('admin_save_success'));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    setDraft(DEFAULT_RUNTIME_CONFIG);
  };

  return (
    <View style={styles.panel}>
      {email ? (
        <Text style={[styles.adminStatus, { color: theme.textMuted }]}>
          {t('settings_admin_signed_in')} ({email})
        </Text>
      ) : null}

      {loading ? (
        <ActivityIndicator color={theme.primary} style={{ marginVertical: 24 }} />
      ) : (
        SECTION_ORDER.map((section) => {
          const fields = grouped.get(section);
          if (!fields?.length) return null;
          return (
            <View key={section} style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                {t(SECTION_LABEL_KEYS[section])}
              </Text>
              {fields.map((field) => (
                <ConfigFieldRow
                  key={field.key}
                  field={field}
                  value={draft[field.key]}
                  onChange={(value) => updateField(field.key, value)}
                />
              ))}
            </View>
          );
        })
      )}

      {message ? <Text style={[styles.successText, { color: theme.primary }]}>{message}</Text> : null}
      {error ? <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text> : null}

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.secondaryBtn, { borderColor: theme.cardBorder }]}
          onPress={handleResetDefaults}
          disabled={saving}
        >
          <Text style={{ color: theme.text }}>{t('admin_reset_defaults')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: theme.primary }]}
          onPress={handleSave}
          disabled={saving || loading}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryBtnText}>{t('admin_save')}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    gap: 4,
  },
  adminHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  adminStatus: {
    fontSize: 13,
    fontWeight: '600',
  },
  section: { marginTop: 8, marginBottom: 4 },
  sectionTitle: { fontSize: 15, fontWeight: '600', marginBottom: 8 },
  fieldCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  fieldLabel: { fontSize: 15, fontWeight: '600', marginBottom: 4 },
  fieldDesc: { fontSize: 13, lineHeight: 18, marginBottom: 10 },
  fieldInputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  fieldInputWrap: { flex: 1 },
  fieldInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  fieldUnit: { fontSize: 13, minWidth: 56 },
  fieldBounds: { fontSize: 12, marginTop: 6 },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    flexWrap: 'wrap',
  },
  primaryBtn: {
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
    minWidth: 120,
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
  linkBtn: { padding: 8 },
  errorText: { marginTop: 8, fontSize: 13 },
  successText: { marginTop: 12, fontSize: 13 },
});
