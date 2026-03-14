/**
 * Centralized icon component using only local static SVG (no runtime icon fonts).
 * Reliable across Expo web, iOS/Android browsers, normal and incognito/private browsing.
 */

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { getWebIconSvgDataUri, hasWebSvgFallback } from './WebIconSvg';

export type AppIconLibrary = 'ion' | 'material' | 'feather';

export interface AppIconProps {
  /** Icon name (e.g. "search", "close", "airplane-outline"). Must be in LOCAL_ICON_NAMES. */
  name: string;
  library?: AppIconLibrary;
  size?: number;
  color?: string;
  /** Optional text fallback for accessibility and when icon is missing */
  fallbackText?: string;
  style?: object;
}

export function AppIcon({
  name,
  size = 24,
  color = '#000',
  fallbackText,
  style,
}: AppIconProps) {
  const useLocalSvg = hasWebSvgFallback(name);
  const uri = useLocalSvg ? getWebIconSvgDataUri(name, color) : null;

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

  return (
    <View
      style={[styles.wrap, { width: size, height: size }, style]}
      accessible={!!fallbackText}
      accessibilityLabel={fallbackText}
      accessibilityRole="image"
    >
      {fallbackText ? (
        <Text
          style={[styles.fallbackText, { color }]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {fallbackText}
        </Text>
      ) : null}
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
    fontSize: 12,
    fontWeight: '600',
    maxWidth: 72,
  },
});
