import React from 'react';
import { ViewStyle } from 'react-native';
import { useLocale } from '../context/LocaleContext';
import { Callout } from './Callout';

export interface SelfTransferNoticeProps {
  /** Server-provided warning; falls back to localized default. */
  message?: string | null;
  style?: ViewStyle;
}

/** Full-width self-transfer warning — use outside the price column. */
export function SelfTransferNotice({ message, style }: SelfTransferNoticeProps) {
  const { t } = useLocale();
  const text = (message && message.trim()) || t('self_transfer_warning');
  return <Callout message={text} variant="warning" style={style} />;
}
