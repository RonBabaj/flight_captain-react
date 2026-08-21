import { StyleSheet } from 'react-native';
import type { Theme } from '../../theme/ThemeContext';

/** Shared card shell for search / deals / dynamic-destinations forms. */
export const formCardStyles = StyleSheet.create({
  card: { borderRadius: 16, padding: 20, borderWidth: 1 },
  cardCompact: { borderRadius: 12, padding: 14 },
  tripRow: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  tripRowCompact: { marginBottom: 4 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1, alignItems: 'center' },
  dateBtn: { marginBottom: 4, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 14, borderWidth: 1 },
  dateBtnCompact: { paddingVertical: 8 },
  btnDisabled: { opacity: 0.6 },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.4,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6, marginTop: 4 },
  searchBtn: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  searchBtnCompact: { marginTop: 12, paddingVertical: 10 },
  searchBtnText: { fontSize: 16, fontWeight: '600' },
  searchBtnTextCompact: { fontSize: 15 },
  error: { marginTop: 10, fontSize: 14 },
  hint: { marginTop: 14, fontSize: 13, lineHeight: 18 },
  compactLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
});

export function makeFormThemedStyles(theme: Theme) {
  return {
    heroTitle: { fontSize: 24, fontWeight: '700' as const, color: theme.text, marginBottom: 4 },
    heroSubtitle: { fontSize: 14, color: theme.textMuted, marginBottom: 20 },
    label: { fontSize: 14, fontWeight: '600' as const, marginBottom: 6, color: theme.text },
    tabText: { color: theme.text, fontSize: 14 },
    tabTextActive: { color: '#fff', fontWeight: '600' as const, fontSize: 14 },
    dateText: { fontSize: 15, color: theme.text },
    error: { color: theme.error, marginTop: 10, fontSize: 14 },
    button: {
      marginTop: 20,
      backgroundColor: theme.buttonBg,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center' as const,
    },
    buttonCompact: { marginTop: 12, paddingVertical: 10 },
    buttonText: { color: theme.buttonText, fontSize: 16, fontWeight: '600' as const },
  };
}
