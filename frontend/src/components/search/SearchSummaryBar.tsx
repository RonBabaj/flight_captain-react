import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { AppIcon } from '../AppIcon';
import { useTheme } from '../../theme/ThemeContext';
import { useLocale } from '../../context/LocaleContext';
import { useContentGutter } from '../../hooks/useResponsive';

export interface SearchSummaryBarProps {
  /** Legacy single-line summary (used when headline is omitted). */
  summary?: string;
  /** Primary route line, e.g. Tel Aviv → Jamaica */
  headline?: string;
  /** Secondary meta: dates, travelers, cabin */
  subtitle?: string;
  /** When false, hides the Edit button (e.g. desktop sidebar already shows the form). */
  showEditButton?: boolean;
  onEditPress?: () => void;
  /** Optional leading control (e.g. back button on Explore). */
  leading?: React.ReactNode;
}

export function SearchSummaryBar({
  summary,
  headline,
  subtitle,
  showEditButton = true,
  onEditPress,
  leading,
}: SearchSummaryBarProps) {
  const { theme } = useTheme();
  const { t, isRTL } = useLocale();
  const gutter = useContentGutter();

  const titleText = headline || summary || '';
  const hasStructured = Boolean(headline);

  const content = (
    <>
      {leading}
      <View style={[s.textBlock, leading ? { flex: 1 } : undefined]}>
        <Text
          style={[
            hasStructured ? s.headline : s.text,
            { color: theme.text, fontFamily: hasStructured ? theme.fontDisplay : theme.fontBody },
          ]}
          numberOfLines={hasStructured ? 2 : 1}
        >
          {titleText}
        </Text>
        {hasStructured && subtitle ? (
          <Text
            style={[s.subtitle, { color: theme.textMuted, fontFamily: theme.fontBody }, isRTL && { textAlign: 'right' }]}
            numberOfLines={2}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
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
          { backgroundColor: theme.cardBg, borderBottomColor: theme.cardBorder, paddingHorizontal: gutter },
          isRTL && { flexDirection: 'row-reverse' },
        ]}
        onPress={onEditPress}
        activeOpacity={0.75}
        accessibilityRole="button"
        accessibilityLabel={[titleText, subtitle].filter(Boolean).join('. ') || t('edit_search')}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={[
        s.bar,
        { backgroundColor: theme.cardBg, borderBottomColor: theme.cardBorder, paddingHorizontal: gutter },
        isRTL && { flexDirection: 'row-reverse' },
      ]}
    >
      {content}
    </View>
  );
}

const s = StyleSheet.create({
  bar: {
    paddingHorizontal: 0,
    paddingVertical: Platform.OS === 'web' ? 8 : 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  textBlock: { flex: 1, minWidth: 0, gap: 2 },
  text: { fontSize: 13, fontWeight: '600' },
  headline: { fontSize: 16, fontWeight: '700', letterSpacing: -0.2, lineHeight: 20 },
  subtitle: { fontSize: 12, fontWeight: '500', lineHeight: 16 },
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
