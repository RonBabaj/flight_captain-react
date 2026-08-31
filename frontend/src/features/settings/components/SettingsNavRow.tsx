import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { AppIcon } from '../../../components/AppIcon';

type IconName =
  | 'person-outline'
  | 'heart-outline'
  | 'options-outline'
  | 'globe-outline'
  | 'shield-outline'
  | 'color-palette-outline'
  | 'settings-outline';

export function SettingsNavRow({
  icon,
  title,
  subtitle,
  onPress,
  disabled,
}: {
  icon: IconName;
  title: string;
  subtitle?: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.row,
        {
          backgroundColor: theme.cardBg,
          borderColor: theme.cardBorder,
          opacity: disabled ? 0.55 : 1,
        },
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.75}
    >
      <View style={[styles.iconWrap, { backgroundColor: theme.primary + '18' }]}>
        <AppIcon name={icon} size={20} color={theme.primaryLight} fallbackText="" />
      </View>
      <View style={styles.textWrap}>
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: theme.textMuted }]} numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <AppIcon name="chevron-forward" size={18} color={theme.textMuted} fallbackText="" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
});
