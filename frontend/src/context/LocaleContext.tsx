import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import type { LanguageCode, CurrencyCode } from '../data/translations';
import { getTranslation } from '../data/translations';
import type { FlightTimeDisplayMode } from '../utils/flightTimeDisplay';
import { FLIGHT_TIME_DISPLAY_MODES } from '../utils/flightTimeDisplay';

const STORAGE_KEY = 'flight_captain_locale';

const VALID_TIME_DISPLAY: FlightTimeDisplayMode[] = FLIGHT_TIME_DISPLAY_MODES;

function getStorage(): Storage | null {
  try {
    if (typeof globalThis !== 'undefined' && (globalThis as any).window?.localStorage)
      return (globalThis as any).window.localStorage;
  } catch {}
  return null;
}

const VALID_CURRENCIES: CurrencyCode[] = ['USD', 'ILS', 'GBP', 'EUR', 'JPY'];

function loadSaved(): { language: LanguageCode; currency: CurrencyCode; timeDisplay: FlightTimeDisplayMode } {
  const storage = getStorage();
  if (!storage) return { language: 'en', currency: 'USD', timeDisplay: 'airport' };
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return { language: 'en', currency: 'USD', timeDisplay: 'airport' };
    const parsed = JSON.parse(raw) as { language?: string; currency?: string; timeDisplay?: string };
    const language = parsed.language === 'he' || parsed.language === 'ru' ? parsed.language : 'en';
    const currency = VALID_CURRENCIES.includes((parsed.currency ?? '') as CurrencyCode) ? (parsed.currency as CurrencyCode) : 'USD';
    const timeDisplay = VALID_TIME_DISPLAY.includes(parsed.timeDisplay as FlightTimeDisplayMode)
      ? (parsed.timeDisplay as FlightTimeDisplayMode)
      : 'airport';
    return { language, currency, timeDisplay };
  } catch {
    return { language: 'en', currency: 'USD', timeDisplay: 'airport' };
  }
}

function save(language: LanguageCode, currency: CurrencyCode, timeDisplay: FlightTimeDisplayMode): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify({ language, currency, timeDisplay }));
  } catch {}
}

/** API locale string from language code */
export function languageToLocale(lang: LanguageCode): string {
  switch (lang) {
    case 'he': return 'he-IL';
    case 'ru': return 'ru-RU';
    default: return 'en-US';
  }
}

export type LocaleContextValue = {
  language: LanguageCode;
  currency: CurrencyCode;
  timeDisplay: FlightTimeDisplayMode;
  setLanguage: (lang: LanguageCode) => void;
  setCurrency: (curr: CurrencyCode) => void;
  setTimeDisplay: (mode: FlightTimeDisplayMode) => void;
  /** API locale e.g. en-US */
  locale: string;
  /** Right-to-left layout (e.g. Hebrew, Arabic) */
  isRTL: boolean;
  t: (key: string) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>('en');
  const [currency, setCurrencyState] = useState<CurrencyCode>('USD');
  const [timeDisplay, setTimeDisplayState] = useState<FlightTimeDisplayMode>('airport');

  useEffect(() => {
    const { language: l, currency: c, timeDisplay: td } = loadSaved();
    setLanguageState(l);
    setCurrencyState(c);
    setTimeDisplayState(td);
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    save(lang, currency, timeDisplay);
  };
  const setCurrency = (curr: CurrencyCode) => {
    setCurrencyState(curr);
    save(language, curr, timeDisplay);
  };
  const setTimeDisplay = (mode: FlightTimeDisplayMode) => {
    setTimeDisplayState(mode);
    save(language, currency, mode);
  };

  const value = useMemo<LocaleContextValue>(
    () => ({
      language,
      currency,
      timeDisplay,
      setLanguage,
      setCurrency,
      setTimeDisplay,
      locale: languageToLocale(language),
      isRTL: language === 'he',
      t: (key: string) => getTranslation(key, language),
    }),
    [language, currency, timeDisplay]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}
