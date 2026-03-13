/**
 * Centralized icon component for cross-platform compatibility.
 * Uses only @expo/vector-icons (Ionicons, MaterialIcons, Feather).
 * On web, critical icons (airplane, globe, sun, moon, menu) use inline SVG so they always render.
 */

import React from 'react';
import { View, Text, Image, StyleSheet, Platform } from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { useIconFontsLoaded } from './IconFontsContext';
import { getWebIconSvgDataUri, hasWebSvgFallback } from './WebIconSvg';

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
  const iconFontsLoaded = useIconFontsLoaded();
  const IconComponent = ICON_SET[library];

  const useWebSvg = Platform.OS === 'web' && library === 'ion' && hasWebSvgFallback(name);
  const showFallback = !iconFontsLoaded && fallbackText && !useWebSvg;

  if (useWebSvg) {
    const uri = getWebIconSvgDataUri(name, color);
    if (uri) {
      return (
        <View
          style={[styles.wrap, { width: size, height: size }, style]}
          accessible={!!fallbackText}
          accessibilityLabel={fallbackText}
          accessibilityRole="image"
        >
          <Image
            source={{ uri }}
            style={{ width: size, height: size }}
            resizeMode="contain"
          />
        </View>
      );
    }
  }

  return (
    <View
      style={[styles.wrap, style]}
      accessible={!!fallbackText}
      accessibilityLabel={fallbackText}
      accessibilityRole="image"
    >
      {showFallback ? (
        <Text
          style={[styles.fallbackText, { color }]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {fallbackText}
        </Text>
      ) : (
        <IconComponent name={name as any} size={size} color={color} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 24,
    minHeight: 24,
  },
  fallbackText: {
    fontSize: Platform.OS === 'web' ? 12 : 10,
    fontWeight: '600',
    maxWidth: 72,
  },
});
