/**
 * Centralized icon component for cross-platform compatibility.
 * Uses only @expo/vector-icons (Ionicons, MaterialIcons, Feather).
 * Prefer Ionicons for broad support on Expo web, iOS, and Android.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';

export type AppIconLibrary = 'ion' | 'material' | 'feather';

export interface AppIconProps {
  /** Icon name from the chosen library (e.g. "search", "close", "airplane-outline") */
  name: string;
  library?: AppIconLibrary;
  size?: number;
  color?: string;
  /** Optional text fallback for accessibility and when icon fails to render */
  fallbackText?: string;
  /** Optional style for the wrapper view */
  style?: object;
}

const ICON_SET = {
  ion: Ionicons,
  material: MaterialIcons,
  feather: Feather,
};

export function AppIcon({
  name,
  library = 'ion',
  size = 24,
  color = '#000',
  fallbackText,
  style,
}: AppIconProps) {
  const IconComponent = ICON_SET[library];

  return (
    <View
      style={[styles.wrap, style]}
      accessible={!!fallbackText}
      accessibilityLabel={fallbackText}
      accessibilityRole="image"
    >
      <IconComponent name={name as any} size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
