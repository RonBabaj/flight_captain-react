import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useLocale } from '../../context/LocaleContext';
import { parseCountryDestination } from '../../types/api';
import { destinationLabelForCode, formatPlaceCodeForDisplay } from '../../utils/placeSearch';

export interface SearchFormHeadlineProps {
  origin?: string;
  destination?: string;
  tripType: 'one-way' | 'round-trip';
}

/** Route-led type hierarchy for the search ticket — not icon + generic title. */
export function SearchFormHeadline({ origin, destination, tripType }: SearchFormHeadlineProps) {
  const { theme } = useTheme();
  const { t, isRTL, language } = useLocale();

  const o = (origin || '').trim();
  const d = (destination || '').trim();
  const hasRoute = Boolean(o && d);

  const codeLine = (code: string) => {
    const country = parseCountryDestination(code);
    if (country) return country;
    const short = formatPlaceCodeForDisplay(code, language, t);
    const iata = short.match(/\(([A-Z0-9]{3,4})\)/);
    return iata ? iata[1] : short.slice(0, 12).toUpperCase();
  };

  if (hasRoute) {
    const left = codeLine(o);
    const right = codeLine(d);
    const arrow = tripType === 'round-trip' ? (isRTL ? ' ⇄ ' : ' ⇄ ') : isRTL ? ' ← ' : ' → ';
    return (
      <View style={[s.block, isRTL && { alignItems: 'flex-end' }]}>
        <Text
          style={[
            s.routeCodes,
            { color: theme.text, fontFamily: theme.fontDisplay },
            isRTL && { textAlign: 'right' },
          ]}
          accessibilityRole="header"
        >
          {left}
          <Text style={{ color: theme.textMuted, fontWeight: '600' }}>{arrow}</Text>
          {right}
        </Text>
        <Text style={[s.routeHint, { color: theme.textMuted, fontFamily: theme.fontBody }, isRTL && { textAlign: 'right' }]}>
          {destinationLabelForCode(d, language, t)}
        </Text>
      </View>
    );
  }

  return (
    <View style={[s.block, isRTL && { alignItems: 'flex-end' }]}>
      <Text
        style={[s.title, { color: theme.text, fontFamily: theme.fontDisplay }, isRTL && { textAlign: 'right' }]}
        accessibilityRole="header"
      >
        {t('find_flights')}
      </Text>
      <Text style={[s.routeHint, { color: theme.textMuted, fontFamily: theme.fontBody }, isRTL && { textAlign: 'right' }]}>
        {t('compare_prices')}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  block: { marginBottom: 16, gap: 4 },
  title: { fontSize: 26, fontWeight: '800', letterSpacing: -0.4, lineHeight: 32 },
  routeCodes: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5, lineHeight: 34 },
  routeHint: { fontSize: 14, lineHeight: 20, fontWeight: '500' },
});