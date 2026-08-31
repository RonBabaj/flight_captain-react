import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useLocale } from '../context/LocaleContext';
import { Button } from './Button';
import { Callout } from './Callout';

export interface SearchStatusBannerProps {
  message: string;
  variant?: 'error' | 'warning' | 'info';
  onRetry?: () => void;
  retryLabel?: string;
  loading?: boolean;
  style?: ViewStyle;
}

export function SearchStatusBanner({
  message,
  variant = 'error',
  onRetry,
  retryLabel,
  loading = false,
  style,
}: SearchStatusBannerProps) {
  const { theme } = useTheme();
  const { t } = useLocale();

  return (
    <View style={[styles.wrap, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }, style]}>
      <Callout message={message} variant={variant} />
      {onRetry ? (
        <Button
          label={retryLabel ?? t('try_again')}
          onPress={onRetry}
          variant="secondary"
          size="sm"
          loading={loading}
          style={styles.retryBtn}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 12,
    marginVertical: 8,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
  },
  retryBtn: {
    alignSelf: 'flex-start',
  },
});
