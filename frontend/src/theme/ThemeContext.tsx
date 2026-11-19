import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { Platform } from 'react-native';
import { applyWebScrollbarTheme } from './webScrollbars';
import { layout, palette, radius, space } from './tokens';

export type ThemeMode = 'dark' | 'light';

export type Theme = {
  mode: ThemeMode;
  isDark: boolean;
  /** Brand / links / headings */
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
  /** Primary actions (coral) */
  buttonBg: string;
  buttonText: string;
  /** Legacy name: contrasting text on filled primary-colored controls */
  onPrimary: string;
  error: string;
  errorBg: string;
  warning: string;
  warningBg: string;
  success: string;
  successBg: string;
  info: string;
  infoBg: string;
  controlBg: string;
  /** Fares — navy (light) / paper (dark); not the coral CTA */
  price: string;
  radiusMd: number;
  radiusLg: number;
  atmosphere: string;
  fontDisplay: string | undefined;
  fontBody: string | undefined;
} & typeof space;

const FONTS = {
  display: Platform.OS === 'web' ? 'Manrope, ui-sans-serif, sans-serif' : undefined,
  body: Platform.OS === 'web' ? 'Inter, ui-sans-serif, sans-serif' : undefined,
};

const lightTheme: Theme = {
  mode: 'light',
  isDark: false,
  primary: palette.aviationNavy,
  primaryLight: '#3D5470',
  navBg: palette.white,
  screenBg: palette.cloudPaper,
  cardBg: palette.white,
  cardBorder: '#C5D4D4',
  text: palette.aviationNavy,
  textMuted: '#5C6B7A',
  inputBg: palette.white,
  inputBorder: '#C5D4D4',
  tabActive: palette.aviationNavy,
  tabInactive: '#5C6B7A',
  buttonBg: palette.signalCoral,
  buttonText: palette.aviationNavy,
  onPrimary: palette.aviationNavy,
  error: '#B42318',
  errorBg: '#FEF3F2',
  warning: '#B54708',
  warningBg: '#FFFAEB',
  success: palette.deepEvergreen,
  successBg: '#E8F0EE',
  info: '#175CD3',
  infoBg: '#EFF8FF',
  controlBg: palette.mist,
  price: palette.aviationNavy,
  radiusMd: radius.md,
  radiusLg: radius.lg,
  atmosphere: 'rgba(23, 42, 64, 0.06)',
  fontDisplay: FONTS.display,
  fontBody: FONTS.body,
  ...space,
};

const darkTheme: Theme = {
  mode: 'dark',
  isDark: true,
  primary: '#B8D0E8',
  primaryLight: '#D4E4F4',
  navBg: '#141A22',
  screenBg: '#0E1218',
  cardBg: '#1A2230',
  cardBorder: '#2E3D4A',
  text: '#F2F4F6',
  textMuted: '#9AA8B5',
  inputBg: '#1A2230',
  inputBorder: '#2E3D4A',
  tabActive: '#F2F4F6',
  tabInactive: 'rgba(242,244,246,0.65)',
  buttonBg: palette.signalCoral,
  buttonText: palette.aviationNavy,
  onPrimary: palette.aviationNavy,
  error: '#F97066',
  errorBg: 'rgba(185, 35, 24, 0.16)',
  warning: '#FDB022',
  warningBg: 'rgba(181, 71, 8, 0.16)',
  success: '#7BD4A8',
  successBg: 'rgba(38, 59, 55, 0.35)',
  info: '#84CAFF',
  infoBg: 'rgba(23, 92, 211, 0.16)',
  controlBg: '#243040',
  price: '#F6F5F1',
  radiusMd: radius.md,
  radiusLg: radius.lg,
  atmosphere: 'rgba(255, 115, 92, 0.08)',
  fontDisplay: FONTS.display,
  fontBody: FONTS.body,
  ...space,
};

export { layout, palette, radius, space };

const THEME_STORAGE_KEY = 'flight_captain_theme';

type ThemeContextValue = {
  theme: Theme;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getWebStorage(kind: 'session' | 'local'): Storage | null {
  try {
    const g = globalThis as { window?: { sessionStorage?: Storage; localStorage?: Storage } };
    if (kind === 'session') return g.window?.sessionStorage ?? null;
    return g.window?.localStorage ?? null;
  } catch {
    return null;
  }
}

function parseThemeMode(raw: string | null | undefined): ThemeMode | null {
  if (raw === 'dark' || raw === 'light') return raw;
  try {
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { mode?: string };
    if (parsed?.mode === 'dark' || parsed?.mode === 'light') return parsed.mode;
  } catch {
    /* ignore */
  }
  return null;
}

function loadSavedThemeMode(fallback: ThemeMode): ThemeMode {
  const fromSession = parseThemeMode(getWebStorage('session')?.getItem(THEME_STORAGE_KEY));
  if (fromSession) return fromSession;
  const fromLocal = parseThemeMode(getWebStorage('local')?.getItem(THEME_STORAGE_KEY));
  if (fromLocal) return fromLocal;
  return fallback;
}

function persistThemeMode(mode: ThemeMode): void {
  const payload = JSON.stringify({ mode });
  try {
    getWebStorage('session')?.setItem(THEME_STORAGE_KEY, payload);
  } catch {
    /* ignore */
  }
  try {
    getWebStorage('local')?.setItem(THEME_STORAGE_KEY, payload);
  } catch {
    /* ignore */
  }
}

export function ThemeProvider({
  children,
  defaultMode = 'light',
}: {
  children: React.ReactNode;
  defaultMode?: ThemeMode;
}) {
  const [mode, setModeState] = useState<ThemeMode>(() => loadSavedThemeMode(defaultMode));

  useEffect(() => {
    setModeState(loadSavedThemeMode(defaultMode));
  }, [defaultMode]);

  const setMode = (next: ThemeMode) => {
    setModeState(next);
    persistThemeMode(next);
  };

  const toggleTheme = () => {
    setModeState((m) => {
      const next: ThemeMode = m === 'dark' ? 'light' : 'dark';
      persistThemeMode(next);
      return next;
    });
  };

  const theme = mode === 'dark' ? darkTheme : lightTheme;

  useEffect(() => {
    applyWebScrollbarTheme(theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setMode,
      toggleTheme,
    }),
    [theme],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}