import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AppIcon } from '../AppIcon';
import { useTheme } from '../../theme/ThemeContext';
import { useLocale } from '../../context/LocaleContext';

export interface SearchSummaryBarProps {
  summary: string;
  /** When false, hides the Edit button (e.g. desktop sidebar already shows the form). */
  showEditButton?: boolean;
  onEditPress?: () => void;
  /** Optional leading control (e.g. back button on Explore). */
  leading?: React.ReactNode;
}

export function SearchSummaryBar({
  summary,
  showEditButton = true,
  onEditPress,
  leading,
}: SearchSummaryBarProps) {
  const { theme } = useTheme();
  const { t, isRTL } = useLocale();

  return (
    <View
      style={[
        s.bar,
        { backgroundColor: theme.cardBg, borderBottomColor: theme.cardBorder },
        isRTL && { flexDirection: 'row-reverse' },
      ]}
    >
      {leading}
      <Text style={[s.text, { color: theme.text }, leading ? { flex: 1 } : undefined]} numberOfLines={1}>
        {summary}
      </Text>
      {showEditButton && onEditPress ? (
        <TouchableOpacity
          style={[s.editBtn, { borderColor: theme.cardBorder, flexDirection: isRTL ? 'row-reverse' : 'row' }]}
          onPress={onEditPress}
          activeOpacity={0.7}
        >
          <AppIcon name="create-outline" size={16} color={theme.primary} fallbackText={t('change_search')} />
          <Text style={[s.editBtnText, { color: theme.primary }]}>{t('edit_search')}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  bar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  text: { flex: 1, fontSize: 14, fontWeight: '600' },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    gap: 5,
  },
  editBtnText: { fontSize: 13, fontWeight: '600' },
});
