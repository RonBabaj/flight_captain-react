import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

/** Shared boarding-pass left stub — search tickets and result cards. */
export function TicketStub({
  children,
  style,
  innerStyle,
  stubHeight,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  innerStyle?: ViewStyle;
  stubHeight?: number | `${number}%`;
}) {
  const { theme } = useTheme();
  return (
    <View
      style={[
        s.outer,
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
          s.stub,
          {
            backgroundColor: theme.primary,
            borderTopLeftRadius: theme.radiusLg,
            borderBottomLeftRadius: theme.radiusLg,
            height: stubHeight ?? '100%',
          },
        ]}
      />
      <View style={[s.inner, innerStyle]}>{children}</View>
    </View>
  );
}

const s = StyleSheet.create({
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
    width: 4,
    minHeight: 80,
  },
  inner: {
    paddingLeft: 4,
  },
});