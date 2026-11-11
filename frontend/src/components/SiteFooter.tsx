import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeContext';
import { useLocale } from '../context/LocaleContext';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

/** Compact legal / contact footer for marketing surfaces. */
export function SiteFooter() {
  const { theme } = useTheme();
  const { t, isRTL } = useLocale();
  const navigation = useNavigation<Nav>();

  const links: { key: string; route: keyof RootStackParamList }[] = [
    { key: 'legal_nav_privacy', route: 'Privacy' },
    { key: 'legal_nav_terms', route: 'Terms' },
    { key: 'legal_nav_contact', route: 'Contact' },
  ];

  return (
    <View
      style={[
        styles.wrap,
        {
          borderTopColor: theme.cardBorder,
          flexDirection: isRTL ? 'row-reverse' : 'row',
        },
      ]}
    >
      {links.map((l, i) => (
        <React.Fragment key={l.route}>
          {i > 0 ? (
            <Text style={{ color: theme.textMuted, paddingHorizontal: 8 }}>·</Text>
          ) : null}
          <TouchableOpacity
            onPress={() => navigation.navigate(l.route)}
            accessibilityRole="link"
            accessibilityLabel={t(l.key)}
            hitSlop={8}
          >
            <Text style={[styles.link, { color: theme.textMuted, fontFamily: theme.fontBody }]}>
              {t(l.key)}
            </Text>
          </TouchableOpacity>
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 28,
    paddingTop: 18,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  link: { fontSize: 13, fontWeight: '500' },
});
