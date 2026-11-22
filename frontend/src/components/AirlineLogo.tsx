import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, type ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { airlineLogoUri } from '../data/airlineLogoUri';
import { resolveAirlineLabel } from '../data/airlines';

type Props = {
  code?: string | null;
  /** Provider-supplied name for a11y */
  name?: string | null;
  size?: number;
  style?: ViewStyle;
};

export function AirlineLogo({ code, name, size = 32, style }: Props) {
  const { theme } = useTheme();
  const [failed, setFailed] = useState(false);
  const iata = (code || '').trim().toUpperCase();
  const uri = airlineLogoUri(iata, size >= 40 ? 64 : 32);
  const label = resolveAirlineLabel(iata, name) || iata || 'Airline';

  useEffect(() => {
    setFailed(false);
  }, [iata, uri]);

  const box = { width: size, height: size, borderRadius: Math.max(6, Math.round(size * 0.22)) };

  if (!iata || failed || !uri) {
    return (
      <View
        style={[
          s.monogram,
          box,
          { backgroundColor: theme.controlBg, borderColor: theme.cardBorder },
          style,
        ]}
        accessibilityLabel={label}
        accessible
      >
        <Text style={[s.monoText, { color: theme.text, fontFamily: theme.fontDisplay, fontSize: size * 0.38 }]}>
          {iata.slice(0, 2) || '—'}
        </Text>
      </View>
    );
  }

  return (
    <View style={[box, s.imgWrap, { borderColor: theme.cardBorder }, style]}>
      <Image
        source={{ uri }}
        style={{ width: size - 4, height: size - 4 }}
        resizeMode="contain"
        accessibilityLabel={label}
        accessible
        onError={() => setFailed(true)}
      />
    </View>
  );
}

/** Up to `max` logos for multi-airline itineraries. */
export function AirlineLogoRow({
  codes,
  size = 28,
  overlap = 6,
}: {
  codes: string[];
  size?: number;
  overlap?: number;
}) {
  const list = codes.filter(Boolean).slice(0, 4);
  if (!list.length) return null;
  return (
    <View style={s.row}>
      {list.map((code, index) => (
        <View
          key={code}
          style={[
            index > 0 && { marginLeft: -overlap },
            { zIndex: list.length - index },
          ]}
        >
          <AirlineLogo code={code} size={size} />
        </View>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  monogram: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  monoText: { fontWeight: '800', letterSpacing: 0.5 },
  imgWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  row: { flexDirection: 'row', alignItems: 'center' },
});