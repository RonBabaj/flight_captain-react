import React, { createContext, useContext, useState, useMemo } from 'react';

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
};

// Shared accent – indigo/violet, works on both themes
const ACCENT = {
  main: '#6366f1',
  light: '#818cf8',
  dark: '#4f46e5',
};

const RADIUS = { md: 14, lg: 20 };

/** Dark: high contrast, easy to read, rich but not harsh */
const darkTheme: Theme = {
  mode: 'dark',
  isDark: true,
  primary: ACCENT.main,
  primaryLight: ACCENT.light,
  navBg: '#18181b',
  screenBg: '#09090b',
  cardBg: '#18181b',
  cardBorder: '#27272a',
  text: '#fafafa',
  textMuted: '#a1a1aa',
  inputBg: '#18181b',
  inputBorder: '#27272a',
  tabActive: '#fff',
  tabInactive: 'rgba(255,255,255,0.7)',
  buttonBg: ACCENT.main,
  buttonText: '#fff',
  onPrimary: '#fff',
  error: '#f87171',
  errorBg: 'rgba(248, 113, 113, 0.12)',
  warning: '#fbbf24',
  warningBg: 'rgba(251, 191, 36, 0.12)',
  success: '#6ee7b7',
  successBg: 'rgba(6, 78, 59, 0.55)',
  info: '#93c5fd',
  infoBg: 'rgba(59, 130, 246, 0.12)',
  controlBg: '#27272a',
  radiusMd: RADIUS.md,
  radiusLg: RADIUS.lg,
};

/** Light: same accent, soft background, clear hierarchy */
const lightTheme: Theme = {
  mode: 'light',
  isDark: false,
  primary: ACCENT.dark,
  primaryLight: ACCENT.main,
  navBg: '#ffffff',
  screenBg: '#fafafa',
  cardBg: '#ffffff',
  cardBorder: '#e4e4e7',
  text: '#18181b',
  textMuted: '#71717a',
  inputBg: '#ffffff',
  inputBorder: '#e4e4e7',
  tabActive: '#18181b',
  tabInactive: '#71717a',
  buttonBg: ACCENT.dark,
  buttonText: '#fff',
  onPrimary: '#fff',
  error: '#dc2626',
  errorBg: '#fef2f2',
  warning: '#b45309',
  warningBg: '#fffbeb',
  success: '#065f46',
  successBg: '#d1fae5',
  info: '#1d4ed8',
  infoBg: '#eff6ff',
  controlBg: '#f4f4f5',
  radiusMd: RADIUS.md,
  radiusLg: RADIUS.lg,
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
      toggleTheme: () => setModeState(m => (m === 'dark' ? 'light' : 'dark')),
    }),
    [theme]
  );
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
