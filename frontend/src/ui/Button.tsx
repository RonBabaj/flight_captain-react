import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'md' | 'sm';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  accessibilityLabel,
  style,
  textStyle,
}: ButtonProps) {
  const { theme } = useTheme();
  const isDisabled = disabled || loading;

  const containerStyle: ViewStyle[] = [
    styles.base,
    size === 'sm' ? styles.sm : styles.md,
    variant === 'primary' && { backgroundColor: theme.buttonBg },
    variant === 'secondary' && {
      backgroundColor: theme.cardBg,
      borderWidth: 1,
      borderColor: theme.cardBorder,
    },
    variant === 'ghost' && { backgroundColor: 'transparent' },
    isDisabled && styles.disabled,
    style,
  ].filter(Boolean) as ViewStyle[];

  const labelColor =
    variant === 'primary'
      ? theme.onPrimary
      : variant === 'secondary'
        ? theme.text
        : theme.primary;

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator size="small" color={labelColor} />
      ) : (
        <Text style={[styles.label, size === 'sm' && styles.labelSm, { color: labelColor }, textStyle]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    minHeight: 48,
  },
  md: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  sm: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    minHeight: 44,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  labelSm: {
    fontSize: 15,
  },
  disabled: {
    opacity: 0.55,
  },
});
