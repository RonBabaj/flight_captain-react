import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export interface ChipProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

export function Chip({ label, active = false, onPress, style, accessibilityLabel }: ChipProps) {
  const { theme } = useTheme();

  const content = (
    <Text
      style={[
        styles.label,
        { color: active ? theme.onPrimary : theme.text },
        active && styles.labelActive,
      ]}
    >
      {label}
    </Text>
  );

  if (!onPress) {
    return (
      <TouchableOpacity
        style={[
          styles.chip,
          { backgroundColor: active ? theme.primary : theme.controlBg, borderColor: active ? theme.primary : theme.cardBorder },
          style,
        ]}
        disabled
        accessibilityRole="text"
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.chip,
        { backgroundColor: active ? theme.primary : theme.controlBg, borderColor: active ? theme.primary : theme.cardBorder },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected: active }}
    >
      {content}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  labelActive: {
    fontWeight: '700',
  },
});
