/**
 * Shared layout for Privacy / Terms / Contact — production “boring” pages vibe-coded
 * demos usually skip. Content is plain and honest for a flight meta-search product.
 */
import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { useLocale } from '../../context/LocaleContext';
import { useBreakpoint } from '../../hooks/useResponsive';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

const CONTACT_EMAIL = 'support@fly-fix.com';
const MAX = 720;

type LegalKind = 'privacy' | 'terms' | 'contact';

const SECTIONS: Record<
  LegalKind,
  { titleKey: string; bodyKeys: string[] }
> = {
  privacy: {
    titleKey: 'legal_privacy_title',
    bodyKeys: [
      'legal_privacy_p1',
      'legal_privacy_p2',
      'legal_privacy_p3',
      'legal_privacy_p4',
    ],
  },
  terms: {
    titleKey: 'legal_terms_title',
    bodyKeys: ['legal_terms_p1', 'legal_terms_p2', 'legal_terms_p3', 'legal_terms_p4'],
  },
  contact: {
    titleKey: 'legal_contact_title',
    bodyKeys: ['legal_contact_p1', 'legal_contact_p2'],
  },
};

export function LegalPageScreen({ kind }: { kind: LegalKind }) {
  const { theme } = useTheme();
  const { t, isRTL } = useLocale();
  const insets = useSafeAreaInsets();
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === 'mobile';
  const meta = SECTIONS[kind];
  const textAlign = isRTL ? 'right' : 'left';
  useDocumentTitle(t(meta.titleKey));

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.screenBg }}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: isMobile ? 20 : 32,
          paddingBottom: Math.max(insets.bottom, 24) + 40,
          paddingHorizontal: isMobile ? 18 : 24,
        },
      ]}
    >
      <View style={[styles.inner, { maxWidth: MAX }]}>
        <Text
          style={[
            styles.title,
            {
              color: theme.text,
              fontFamily: theme.fontDisplay,
              textAlign,
            },
          ]}
          accessibilityRole="header"
        >
          {t(meta.titleKey)}
        </Text>
        {meta.bodyKeys.map((key) => (
          <Text
            key={key}
            style={[
              styles.body,
              { color: theme.textMuted, fontFamily: theme.fontBody, textAlign },
            ]}
          >
            {t(key)}
          </Text>
        ))}
        {kind === 'contact' ? (
          <TouchableOpacity
            onPress={() => Linking.openURL(`mailto:${CONTACT_EMAIL}`)}
            accessibilityRole="link"
            accessibilityLabel={CONTACT_EMAIL}
            style={[
              styles.emailBtn,
              {
                backgroundColor: theme.controlBg,
                borderColor: theme.cardBorder,
                borderRadius: theme.radiusMd,
                alignSelf: isRTL ? 'flex-end' : 'flex-start',
              },
            ]}
          >
            <Text style={[styles.email, { color: theme.primary, fontFamily: theme.fontBody }]}>
              {CONTACT_EMAIL}
            </Text>
          </TouchableOpacity>
        ) : null}
        <Text style={[styles.updated, { color: theme.textMuted, fontFamily: theme.fontBody, textAlign }]}>
          {t('legal_last_updated')}
        </Text>
      </View>
    </ScrollView>
  );
}

export function PrivacyScreen() {
  return <LegalPageScreen kind="privacy" />;
}
export function TermsScreen() {
  return <LegalPageScreen kind="terms" />;
}
export function ContactScreen() {
  return <LegalPageScreen kind="contact" />;
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, alignItems: 'center' },
  inner: { width: '100%' },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginBottom: 18,
  },
  body: {
    fontSize: 15.5,
    lineHeight: 24,
    marginBottom: 14,
  },
  emailBtn: {
    marginTop: 8,
    marginBottom: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  email: { fontSize: 16, fontWeight: '700' },
  updated: { marginTop: 28, fontSize: 12, opacity: 0.8 },
});
