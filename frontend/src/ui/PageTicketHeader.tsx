import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { TicketStub } from './TicketStub';

export interface PageTicketHeaderProps {
  title: string;
  subtitle?: string;
  /** Compact bar for explore summary (less padding). */
  compact?: boolean;
  style?: ViewStyle;
  children?: React.ReactNode;
}

/** Navy stub + title — unifies auth, explore summary, and secondary flows. */
export function PageTicketHeader({
  title,
  subtitle,
  compact = false,
  style,
  children,
}: PageTicketHeaderProps) {
  const { theme } = useTheme();
  return (
    <TicketStub
      style={StyleSheet.flatten([styles.wrap, style])}
      innerStyle={StyleSheet.flatten([styles.inner, compact ? styles.innerCompact : undefined])}
      stubHeight={compact ? '100%' : undefined}
    >
      <Text
        style={[styles.title, compact && styles.titleCompact, { color: theme.text, fontFamily: theme.fontDisplay }]}
        accessibilityRole="header"
        numberOfLines={2}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text
          style={[styles.subtitle, { color: theme.textMuted, fontFamily: theme.fontBody }]}
          numberOfLines={3}
        >
          {subtitle}
        </Text>
      ) : null}
      {children ? <View style={styles.children}>{children}</View> : null}
    </TicketStub>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%' },
  inner: { padding: 16, gap: 6 },
  innerCompact: { paddingVertical: 12, paddingHorizontal: 14, gap: 4 },
  title: { fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
  titleCompact: { fontSize: 17, fontWeight: 700 },
  subtitle: { fontSize: 14, lineHeight: 20 },
  children: { marginTop: 4 },
});