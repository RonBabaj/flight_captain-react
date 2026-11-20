import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { AppIcon } from '../components/AppIcon';
import { useTheme } from '../theme/ThemeContext';
import { useLocale } from '../context/LocaleContext';

export interface BookingTrustStripProps {
  style?: ViewStyle;
}

/** Short trust copy + icon row above booking choices. */
export function BookingTrustStrip({ style }: BookingTrustStripProps) {
  const { theme } = useTheme();
  const { t } = useLocale();
  return (
    <View
      style={[
        styles.row,
        { backgroundColor: theme.controlBg, borderColor: theme.cardBorder },
        style,
      ]}
      accessibilityRole="text"
    >
      <AppIcon name="checkmark-circle-outline" size={16} color={theme.success} fallbackText="✓" />
      <Text style={[styles.text, { color: theme.textMuted, fontFamily: theme.fontBody }]}>
        {t('booking_trust_strip')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  text: { flex: 1, fontSize: 12, lineHeight: 17 },
});