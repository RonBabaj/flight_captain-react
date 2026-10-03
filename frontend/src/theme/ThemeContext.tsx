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

/** Travel-rooted teal — warmer & friendlier than cold indigo. */
const ACCENT = {
  main: '#1FB8AE',
  light: '#4FD0C6',
  dark: '#0E7A72',
};

const RADIUS = { md: 14, lg: 22 };

const FONTS = {
  display: Platform.OS === 'web' ? 'Sora, ui-sans-serif, sans-serif' : undefined,
  body: Platform.OS === 'web' ? 'Figtree, ui-sans-serif, sans-serif' : undefined,
};

const SPACE = { spaceXs: 4, spaceSm: 8, spaceMd: 16, spaceLg: 24, spaceXl: 36 };

/** Dark: soft night sky, approachable teal */
const darkTheme: Theme = {
  mode: 'dark',
  isDark: true,
  primary: ACCENT.main,
  primaryLight: ACCENT.light,
  navBg: '#101820',
  screenBg: '#0b1219',
  cardBg: '#15202b',
  cardBorder: '#2a3a4a',
  text: '#f4f7fa',
  textMuted: '#a8b6c5',
  inputBg: '#15202b',
  inputBorder: '#2a3a4a',
  tabActive: '#fff',
  tabInactive: 'rgba(244,247,250,0.68)',
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
  controlBg: '#1c2a38',
  radiusMd: RADIUS.md,
  radiusLg: RADIUS.lg,
  atmosphere: 'rgba(31, 184, 174, 0.16)',
  fontDisplay: FONTS.display,
  fontBody: FONTS.body,
  ...SPACE,
};

/** Light: soft mist, welcoming teal */
const lightTheme: Theme = {
  mode: 'light',
  isDark: false,
  primary: ACCENT.dark,
  primaryLight: ACCENT.main,
  navBg: '#ffffff',
  screenBg: '#f3f7f8',
  cardBg: '#ffffff',
  cardBorder: '#d7e2e6',
  text: '#0f172a',
  textMuted: '#5b6b7c',
  inputBg: '#ffffff',
  inputBorder: '#d7e2e6',
  tabActive: '#0f172a',
  tabInactive: '#5b6b7c',
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
  controlBg: '#e7eef1',
  radiusMd: RADIUS.md,
  radiusLg: RADIUS.lg,
  atmosphere: 'rgba(14, 122, 114, 0.10)',
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
