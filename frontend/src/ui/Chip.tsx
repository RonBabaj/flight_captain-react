import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
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
        { color: active ? theme.buttonText : theme.text, fontFamily: theme.fontBody },
        active && styles.labelActive,
      ]}
    >
      {label}
    </Text>
  );

  if (!onPress) {
    return (
      <View
        style={[
          styles.chip,
          { backgroundColor: active ? theme.buttonBg : theme.controlBg, borderColor: active ? theme.buttonBg : theme.cardBorder },
          style,
        ]}
        accessibilityRole="text"
      >
        {content}
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.chip,
        { backgroundColor: active ? theme.buttonBg : theme.controlBg, borderColor: active ? theme.buttonBg : theme.cardBorder },
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
    paddingVertical: 7,
    paddingHorizontal: 11,
    borderRadius: 8,
    borderWidth: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
  labelActive: {
    fontWeight: '700',
  },
});
