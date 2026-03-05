import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import type { LanguageCode, CurrencyCode } from '../data/translations';
import { getTranslation } from '../data/translations';

const STORAGE_KEY = 'flight_captain_locale';

function getStorage(): Storage | null {
  try {
    if (typeof globalThis !== 'undefined' && (globalThis as any).window?.localStorage)
      return (globalThis as any).window.localStorage;
  } catch {}
  return null;
}

const VALID_CURRENCIES: CurrencyCode[] = ['USD', 'ILS', 'GBP', 'EUR', 'JPY'];

function loadSaved(): { language: LanguageCode; currency: CurrencyCode } {
  const storage = getStorage();
  if (!storage) return { language: 'en', currency: 'USD' };
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return { language: 'en', currency: 'USD' };
    const parsed = JSON.parse(raw) as { language?: string; currency?: string };
    const language = parsed.language === 'he' || parsed.language === 'ru' ? parsed.language : 'en';
    const currency = VALID_CURRENCIES.includes((parsed.currency ?? '') as CurrencyCode) ? (parsed.currency as CurrencyCode) : 'USD';
    return { language, currency };
  } catch {
    return { language: 'en', currency: 'USD' };
  }
}

function save(language: LanguageCode, currency: CurrencyCode): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify({ language, currency }));
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
  setLanguage: (lang: LanguageCode) => void;
  setCurrency: (curr: CurrencyCode) => void;
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

  useEffect(() => {
    const { language: l, currency: c } = loadSaved();
    setLanguageState(l);
    setCurrencyState(c);
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    save(lang, currency);
  };
  const setCurrency = (curr: CurrencyCode) => {
    setCurrencyState(curr);
    save(language, curr);
  };

  const value = useMemo<LocaleContextValue>(
    () => ({
      language,
      currency,
      setLanguage,
      setCurrency,
      locale: languageToLocale(language),
      isRTL: language === 'he',
      t: (key: string) => getTranslation(key, language),
    }),
    [language, currency]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}
