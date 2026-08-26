import React from 'react';
import { ScrollView, Text, StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme/ThemeContext';

export function SettingsPageLayout({
  title,
  subtitle,
  children,
  contentStyle,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  contentStyle?: ViewStyle;
}) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.screenBg }]}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: Math.max(insets.bottom, 24) + 24 },
        contentStyle,
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.pageTitle, { color: theme.text }]} accessibilityRole="header">
        {title}
      </Text>
      {subtitle ? (
        <Text style={[styles.pageSubtitle, { color: theme.textMuted }]}>{subtitle}</Text>
      ) : null}
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: 20,
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  pageSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
});
