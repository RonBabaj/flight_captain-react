import React, { useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
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
  const [focused, setFocused] = useState(false);

  const containerStyle: ViewStyle[] = [
    styles.base,
    { borderRadius: theme.radiusMd },
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
  const containerFlat = StyleSheet.flatten(containerStyle);

  const labelColor =
    variant === 'primary'
      ? theme.buttonText
      : variant === 'secondary'
        ? theme.text
        : theme.primary;

  return (
    <Pressable
      style={({ pressed }) => [
        containerFlat,
        pressed && !isDisabled && styles.pressed,
        Platform.OS === 'web' && focused && !isDisabled && { outlineWidth: 2, outlineColor: theme.primary, outlineStyle: 'solid' as const, outlineOffset: 2 },
      ]}
      onPress={onPress}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator size="small" color={labelColor} />
      ) : (
        <Text
          style={[
            styles.label,
            size === 'sm' && styles.labelSm,
            { color: labelColor, fontFamily: theme.fontBody },
            textStyle,
          ]}
          numberOfLines={2}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
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
  pressed: {
    opacity: 0.88,
  },
});
