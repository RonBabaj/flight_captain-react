import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { useLocale } from '../../../context/LocaleContext';
import { LANGUAGES, CURRENCIES } from '../../../data/translations';
import type { LanguageCode, CurrencyCode } from '../../../data/translations';
import { SettingsSection } from './SettingsSection';
import { AppIcon } from '../../../components/AppIcon';
import type { FlightTimeDisplayMode } from '../../../utils/flightTimeDisplay';
import { FLIGHT_TIME_DISPLAY_MODES } from '../../../utils/flightTimeDisplay';

export function UserPreferencesSection() {
  const { theme, toggleTheme } = useTheme();
  const { t, language, currency, timeDisplay, setLanguage, setCurrency, setTimeDisplay } = useLocale();

  const timeDisplayLabels: Record<FlightTimeDisplayMode, string> = {
    airport: t('time_display_airport'),
    local: t('time_display_local'),
    utc: t('time_display_utc'),
  };

  return (
    <SettingsSection
      icon="globe-outline"
      title={t('settings_preferences_title')}
      subtitle={t('settings_preferences_subtitle')}
    >
      <Text style={[styles.label, { color: theme.textMuted }]}>{t('locale_language')}</Text>
      <View style={styles.optionRow}>
        {LANGUAGES.map(({ code, label }) => {
          const active = language === code;
          return (
            <TouchableOpacity
              key={code}
              style={[
                styles.chip,
                {
                  borderColor: active ? theme.primary : theme.cardBorder,
                  backgroundColor: active ? theme.primary + '18' : theme.screenBg,
                },
              ]}
              onPress={() => setLanguage(code as LanguageCode)}
            >
              <Text style={[styles.chipText, { color: active ? theme.primary : theme.text }]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={[styles.label, { color: theme.textMuted, marginTop: 8 }]}>{t('locale_currency')}</Text>
      <View style={styles.optionRow}>
        {CURRENCIES.map(({ code, label, symbol }) => {
          const active = currency === code;
          return (
            <TouchableOpacity
              key={code}
              style={[
                styles.chip,
                {
                  borderColor: active ? theme.primary : theme.cardBorder,
                  backgroundColor: active ? theme.primary + '18' : theme.screenBg,
                },
              ]}
              onPress={() => setCurrency(code as CurrencyCode)}
            >
              <Text style={[styles.chipText, { color: active ? theme.primary : theme.text }]}>
                {symbol ?? code} {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={[styles.label, { color: theme.textMuted, marginTop: 8 }]}>{t('settings_time_display_label')}</Text>
      <Text style={[styles.hint, { color: theme.textMuted }]}>{t('settings_time_display_hint')}</Text>
      <View style={styles.optionRow}>
        {FLIGHT_TIME_DISPLAY_MODES.map((mode) => {
          const active = timeDisplay === mode;
          return (
            <TouchableOpacity
              key={mode}
              style={[
                styles.chip,
                {
                  borderColor: active ? theme.primary : theme.cardBorder,
                  backgroundColor: active ? theme.primary + '18' : theme.screenBg,
                },
              ]}
              onPress={() => setTimeDisplay(mode)}
            >
              <Text style={[styles.chipText, { color: active ? theme.primary : theme.text }]}>{timeDisplayLabels[mode]}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={[styles.label, { color: theme.textMuted, marginTop: 8 }]}>{t('settings_theme_label')}</Text>
      <TouchableOpacity
        style={[styles.themeRow, { borderColor: theme.cardBorder, backgroundColor: theme.screenBg }]}
        onPress={toggleTheme}
        activeOpacity={0.8}
      >
        <View style={styles.themeRowLeft}>
          <AppIcon
            name={theme.isDark ? 'moon-outline' : 'sunny-outline'}
            size={20}
            color={theme.primaryLight}
            fallbackText=""
          />
          <Text style={[styles.themeRowText, { color: theme.text }]}>
            {theme.isDark ? t('settings_theme_dark') : t('settings_theme_light')}
          </Text>
        </View>
        <Text style={[styles.themeRowAction, { color: theme.primary }]}>{t('settings_theme_toggle')}</Text>
      </TouchableOpacity>
    </SettingsSection>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  hint: {
    fontSize: 11,
    lineHeight: 15,
    marginBottom: 8,
    marginTop: -4,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  themeRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  themeRowText: {
    fontSize: 15,
    fontWeight: '600',
  },
  themeRowAction: {
    fontSize: 14,
    fontWeight: '600',
  },
});
