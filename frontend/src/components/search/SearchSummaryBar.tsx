import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
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

  const content = (
    <>
      {leading}
      <Text
        style={[
          s.text,
          { color: theme.text, fontFamily: theme.fontBody },
          leading ? { flex: 1 } : undefined,
        ]}
        numberOfLines={1}
      >
        {summary}
      </Text>
      {showEditButton && onEditPress ? (
        <View
          style={[
            s.editChip,
            { borderColor: theme.cardBorder, backgroundColor: theme.controlBg },
            { flexDirection: isRTL ? 'row-reverse' : 'row' },
          ]}
        >
          <AppIcon name="create-outline" size={15} color={theme.primary} fallbackText="" />
          <Text style={[s.editBtnText, { color: theme.primary, fontFamily: theme.fontBody }]}>
            {t('edit_search')}
          </Text>
        </View>
      ) : null}
    </>
  );

  // Whole bar is tappable on mobile when edit is available — saves a chrome row.
  if (showEditButton && onEditPress) {
    return (
      <TouchableOpacity
        style={[
          s.bar,
          { backgroundColor: theme.cardBg, borderBottomColor: theme.cardBorder },
          isRTL && { flexDirection: 'row-reverse' },
        ]}
        onPress={onEditPress}
        activeOpacity={0.75}
        accessibilityRole="button"
        accessibilityLabel={t('edit_search')}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={[
        s.bar,
        { backgroundColor: theme.cardBg, borderBottomColor: theme.cardBorder },
        isRTL && { flexDirection: 'row-reverse' },
      ]}
    >
      {content}
    </View>
  );
}

const s = StyleSheet.create({
  bar: {
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'web' ? 8 : 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  text: { flex: 1, fontSize: 13, fontWeight: '600' },
  editChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  editBtnText: { fontSize: 12, fontWeight: '600' },
});
