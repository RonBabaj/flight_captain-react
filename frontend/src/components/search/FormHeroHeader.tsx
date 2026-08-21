import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppIcon } from '../AppIcon';
import { useTheme } from '../../theme/ThemeContext';
import { useLocale } from '../../context/LocaleContext';
import { makeFormThemedStyles } from './formStyles';

export interface FormHeroHeaderProps {
  icon: string;
  title: string;
  subtitle?: string;
  /** Compact mode: single muted line instead of icon + title block */
  compact?: boolean;
  compactLabel?: string;
  iconColor?: string;
}

export function FormHeroHeader({
  icon,
  title,
  subtitle,
  compact = false,
  compactLabel,
  iconColor,
}: FormHeroHeaderProps) {
  const { theme } = useTheme();
  const { isRTL } = useLocale();
  const ts = makeFormThemedStyles(theme);

  if (compact) {
    return (
      <Text
        style={[styles.compactLabel, { color: theme.textMuted }, isRTL && { textAlign: 'right' }]}
        numberOfLines={1}
      >
        {compactLabel ?? title}
      </Text>
    );
  }

  return (
    <>
      <View style={[styles.titleRow, isRTL && { flexDirection: 'row-reverse' }]}>
        <AppIcon
          name={icon}
          size={20}
          color={iconColor ?? theme.text}
          fallbackText={title}
        />
        <Text style={[ts.heroTitle, isRTL && { textAlign: 'right' }]}>{title}</Text>
      </View>
      {subtitle ? (
        <Text style={[ts.heroSubtitle, isRTL && { textAlign: 'right' }]}>{subtitle}</Text>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  compactLabel: { fontSize: 14, fontWeight: '600', marginBottom: 10 },
});
