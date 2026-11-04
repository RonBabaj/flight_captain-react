import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { AppIcon } from '../components/AppIcon';
import { useTheme } from '../theme/ThemeContext';

export type CalloutVariant = 'info' | 'warning' | 'error' | 'success';

export interface CalloutProps {
  message: string;
  variant?: CalloutVariant;
  style?: ViewStyle;
}

export function Callout({ message, variant = 'info', style }: CalloutProps) {
  const { theme } = useTheme();

  const palette = {
    info: { fg: theme.info, bg: theme.infoBg, icon: 'information-circle-outline' as const },
    warning: { fg: theme.warning, bg: theme.warningBg, icon: 'alert-circle-outline' as const },
    error: { fg: theme.error, bg: theme.errorBg, icon: 'alert-circle-outline' as const },
    success: { fg: theme.success, bg: theme.successBg, icon: 'information-circle-outline' as const },
  }[variant];

  return (
    <View
      style={[styles.wrap, { backgroundColor: palette.bg, borderColor: palette.fg + '33' }, style]}
      accessibilityRole="alert"
    >
      <AppIcon name={palette.icon} size={18} color={palette.fg} fallbackText="" />
      <Text style={[styles.text, { color: palette.fg }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  text: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
});
