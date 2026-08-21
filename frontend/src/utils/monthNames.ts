const LOCALE_MAP: Record<string, string> = {
  en: 'en-US',
  he: 'he-IL',
  ru: 'ru-RU',
};

function monthLocale(language: string): string {
  return LOCALE_MAP[language] ?? LOCALE_MAP.en;
}

/** Full month name + year, localized (e.g. "August 2026"). */
export function formatMonthYear(year: number, month: number, language: string): string {
  const d = new Date(Date.UTC(year, month - 1, 1));
  const monthStr = d.toLocaleDateString(monthLocale(language), { month: 'long', timeZone: 'UTC' });
  return `${monthStr} ${year}`;
}

/** Short month name for deal cards (e.g. "Aug"). */
export function formatMonthShort(monthIndex: number, language: string): string {
  const d = new Date(Date.UTC(2020, monthIndex, 1));
  return d.toLocaleDateString(monthLocale(language), { month: 'short', timeZone: 'UTC' });
}
