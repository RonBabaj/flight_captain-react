import React, { createContext, useContext, useState, useMemo } from 'react';
import { Platform } from 'react-native';

export type ThemeMode = 'dark' | 'light';

export type Theme = {
  mode: ThemeMode;
  isDark: boolean;
  primary: string;
  primaryLight: string;
  navBg: string;
  screenBg: string;
  cardBg: string;
  cardBorder: string;
  text: string;
  textMuted: string;
  inputBg: string;
  inputBorder: string;
  tabActive: string;
  tabInactive: string;
  buttonBg: string;
  buttonText: string;
  onPrimary: string;
  error: string;
  errorBg: string;
  warning: string;
  warningBg: string;
  success: string;
  successBg: string;
  info: string;
  infoBg: string;
  /** Controls, steppers, secondary surfaces */
  controlBg: string;
  /** Price / money emphasis — warm signal, not the primary CTA color */
  price: string;
  radiusMd: number;
  radiusLg: number;
  /** Soft wash for hero / mood planes */
  atmosphere: string;
  fontDisplay: string | undefined;
  fontBody: string | undefined;
  spaceXs: number;
  spaceSm: number;
  spaceMd: number;
  spaceLg: number;
  spaceXl: number;
};

/**
 * Boarding-pass system — ink navy + paper neutrals + amber fare signal.
 * Intentionally not: neon teal SaaS, purple gradients, cream/terracotta AI clusters.
 */
const ACCENT = {
  navy: '#163A5F',
  navyDeep: '#0F2A45',
  sky: '#3D7EB5',
  amber: '#C27803',
  amberSoft: '#E8A317',
};

const RADIUS = { md: 10, lg: 14 };

/** Archivo = terminal/ticket display; IBM Plex Sans = clear fare/UI body. */
const FONTS = {
  display: Platform.OS === 'web' ? 'Archivo, ui-sans-serif, sans-serif' : undefined,
  body: Platform.OS === 'web' ? '"IBM Plex Sans", ui-sans-serif, sans-serif' : undefined,
};

const SPACE = { spaceXs: 4, spaceSm: 8, spaceMd: 16, spaceLg: 24, spaceXl: 36 };

/** Light-first: paper, ink, restrained navy CTAs */
const lightTheme: Theme = {
  mode: 'light',
  isDark: false,
  primary: ACCENT.navy,
  primaryLight: ACCENT.sky,
  navBg: '#FFFFFF',
  screenBg: '#F4F6F8',
  cardBg: '#FFFFFF',
  cardBorder: '#DCE3EA',
  text: '#121820',
  textMuted: '#5A6572',
  inputBg: '#FFFFFF',
  inputBorder: '#D0D8E0',
  tabActive: '#121820',
  tabInactive: '#5A6572',
  buttonBg: ACCENT.navy,
  buttonText: '#FFFFFF',
  onPrimary: '#FFFFFF',
  error: '#B42318',
  errorBg: '#FEF3F2',
  warning: '#B54708',
  warningBg: '#FFFAEB',
  success: '#067647',
  successBg: '#ECFDF3',
  info: '#175CD3',
  infoBg: '#EFF8FF',
  controlBg: '#EEF2F6',
  price: ACCENT.amber,
  radiusMd: RADIUS.md,
  radiusLg: RADIUS.lg,
  atmosphere: 'rgba(22, 58, 95, 0.06)',
  fontDisplay: FONTS.display,
  fontBody: FONTS.body,
  ...SPACE,
};

/** Dark: charcoal cabin, sky blue actions, soft amber fares */
const darkTheme: Theme = {
  mode: 'dark',
  isDark: true,
  primary: ACCENT.sky,
  primaryLight: '#6AA8D4',
  navBg: '#12161C',
  screenBg: '#0C0F13',
  cardBg: '#171C24',
  cardBorder: '#2A3340',
  text: '#F2F4F7',
  textMuted: '#9AA3B0',
  inputBg: '#171C24',
  inputBorder: '#2A3340',
  tabActive: '#FFFFFF',
  tabInactive: 'rgba(242,244,247,0.65)',
  buttonBg: ACCENT.sky,
  buttonText: '#0C0F13',
  onPrimary: '#0C0F13',
  error: '#F97066',
  errorBg: 'rgba(185, 35, 24, 0.16)',
  warning: '#FDB022',
  warningBg: 'rgba(181, 71, 8, 0.16)',
  success: '#6CE9A6',
  successBg: 'rgba(6, 118, 71, 0.22)',
  info: '#84CAFF',
  infoBg: 'rgba(23, 92, 211, 0.16)',
  controlBg: '#222933',
  price: ACCENT.amberSoft,
  radiusMd: RADIUS.md,
  radiusLg: RADIUS.lg,
  atmosphere: 'rgba(61, 126, 181, 0.12)',
  fontDisplay: FONTS.display,
  fontBody: FONTS.body,
  ...SPACE,
};

type ThemeContextValue = {
  theme: Theme;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  children,
  defaultMode = 'light',
}: {
  children: React.ReactNode;
  defaultMode?: ThemeMode;
}) {
  const [mode, setModeState] = useState<ThemeMode>(defaultMode);
  const theme = mode === 'dark' ? darkTheme : lightTheme;
  const value = useMemo(
    () => ({
      theme,
      setMode: setModeState,
      toggleTheme: () => setModeState((m) => (m === 'dark' ? 'light' : 'dark')),
    }),
    [theme]
  );
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
