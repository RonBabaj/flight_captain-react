import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

/** Boarding-pass shell: navy ticket stub + white body, mood can bleed to top edge. */
export function SearchFormTicketShell({
  children,
  style,
  accentHeight,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  /** Height of content that sits under the left accent (mood photo). */
  accentHeight?: number;
}) {
  const { theme } = useTheme();
  return (
    <View
      style={[
        shell.outer,
        {
          backgroundColor: theme.cardBg,
          borderColor: theme.cardBorder,
          borderRadius: theme.radiusLg,
        },
        style,
      ]}
    >
      <View
        pointerEvents="none"
        style={[
          shell.stub,
          {
            backgroundColor: theme.primary,
            borderTopLeftRadius: theme.radiusLg,
            borderBottomLeftRadius: theme.radiusLg,
            height: accentHeight ?? '100%',
          },
        ]}
      />
      <View style={shell.body}>{children}</View>
    </View>
  );
}

const shell = StyleSheet.create({
  outer: {
    width: '100%',
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    position: 'relative',
  },
  stub: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 5,
    minHeight: 120,
  },
  body: {
    flex: 1,
    paddingLeft: 5,
  },
});