import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { AppIcon } from '../../../components/AppIcon';

type IconName =
  | 'person-outline'
  | 'heart-outline'
  | 'options-outline'
  | 'globe-outline'
  | 'shield-outline'
  | 'color-palette-outline';

export function SettingsSection({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: IconName;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const { theme } = useTheme();

  return (
    <View style={[styles.section, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
      <View style={styles.header}>
        <View style={[styles.iconWrap, { backgroundColor: theme.primary + '18' }]}>
          <AppIcon name={icon} size={20} color={theme.primaryLight} fallbackText="" />
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
          {subtitle ? (
            <Text style={[styles.subtitle, { color: theme.textMuted }]}>{subtitle}</Text>
          ) : null}
        </View>
      </View>
      <View style={styles.body}>{children}</View>
    </View>
  );
}

export function SettingsPlaceholder({ text }: { text: string }) {
  const { theme } = useTheme();
  return (
    <View style={[styles.placeholder, { backgroundColor: theme.screenBg, borderColor: theme.cardBorder }]}>
      <Text style={[styles.placeholderText, { color: theme.textMuted }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  body: {
    gap: 10,
  },
  placeholder: {
    borderWidth: 1,
    borderRadius: 12,
    borderStyle: 'dashed',
    paddingVertical: 16,
    paddingHorizontal: 14,
  },
  placeholderText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});
