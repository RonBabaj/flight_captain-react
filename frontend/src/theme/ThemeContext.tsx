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
  /** Controls, steppers, secondary surfaces – shared feel across light/dark */
  controlBg: string;
  radiusMd: number;
  radiusLg: number;
  /** Horizon wash for atmosphere (gradients / hero planes). */
  atmosphere: string;
  fontDisplay: string | undefined;
  fontBody: string | undefined;
  spaceXs: number;
  spaceSm: number;
  spaceMd: number;
  spaceLg: number;
  spaceXl: number;
};

/** Travel-rooted teal (sky/horizon) — not the default indigo/purple cluster. */
const ACCENT = {
  main: '#1BA7A0',
  light: '#3BC4BC',
  dark: '#0F766E',
};

const RADIUS = { md: 12, lg: 18 };

const FONTS = {
  display: Platform.OS === 'web' ? 'Sora, ui-sans-serif, sans-serif' : undefined,
  body: Platform.OS === 'web' ? 'Figtree, ui-sans-serif, sans-serif' : undefined,
};

const SPACE = { spaceXs: 4, spaceSm: 8, spaceMd: 14, spaceLg: 20, spaceXl: 32 };

/** Dark: deep slate night sky, teal accent */
const darkTheme: Theme = {
  mode: 'dark',
  isDark: true,
  primary: ACCENT.main,
  primaryLight: ACCENT.light,
  navBg: '#0e1620',
  screenBg: '#081018',
  cardBg: '#121c27',
  cardBorder: '#243041',
  text: '#f1f5f9',
  textMuted: '#94a3b8',
  inputBg: '#121c27',
  inputBorder: '#243041',
  tabActive: '#fff',
  tabInactive: 'rgba(241,245,249,0.65)',
  buttonBg: ACCENT.main,
  buttonText: '#041016',
  onPrimary: '#041016',
  error: '#f87171',
  errorBg: 'rgba(248, 113, 113, 0.12)',
  warning: '#fbbf24',
  warningBg: 'rgba(251, 191, 36, 0.12)',
  success: '#6ee7b7',
  successBg: 'rgba(6, 78, 59, 0.55)',
  info: '#7dd3fc',
  infoBg: 'rgba(14, 165, 233, 0.12)',
  controlBg: '#1a2736',
  radiusMd: RADIUS.md,
  radiusLg: RADIUS.lg,
  atmosphere: 'rgba(27, 167, 160, 0.14)',
  fontDisplay: FONTS.display,
  fontBody: FONTS.body,
  ...SPACE,
};

/** Light: cool mist background, deep teal accent */
const lightTheme: Theme = {
  mode: 'light',
  isDark: false,
  primary: ACCENT.dark,
  primaryLight: ACCENT.main,
  navBg: '#ffffff',
  screenBg: '#eef3f6',
  cardBg: '#ffffff',
  cardBorder: '#d5dee7',
  text: '#0f172a',
  textMuted: '#64748b',
  inputBg: '#ffffff',
  inputBorder: '#d5dee7',
  tabActive: '#0f172a',
  tabInactive: '#64748b',
  buttonBg: ACCENT.dark,
  buttonText: '#ffffff',
  onPrimary: '#ffffff',
  error: '#dc2626',
  errorBg: '#fef2f2',
  warning: '#b45309',
  warningBg: '#fffbeb',
  success: '#065f46',
  successBg: '#d1fae5',
  info: '#0369a1',
  infoBg: '#e0f2fe',
  controlBg: '#e8eef3',
  radiusMd: RADIUS.md,
  radiusLg: RADIUS.lg,
  atmosphere: 'rgba(15, 118, 110, 0.08)',
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
  defaultMode = 'dark',
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
