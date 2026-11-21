/** Rotating status copy shared by progress banners, submit buttons, and overlays. */
/** "Almost done" is intentionally excluded — show it only via SEARCH_ALMOST_DONE when nearComplete. */
import type { ProviderSearchStats, SearchProgress } from '../../types';

export const SEARCH_PROGRESS_PHRASES: Record<string, string[]> = {
  en: [
    'Searching hundreds of airlines…',
    'Comparing prices across providers…',
    'Checking direct and connecting flights…',
    'Finding the best fares…',
  ],
  he: [
    'מחפש מאות חברות תעופה…',
    'משווה מחירים בין ספקים…',
    'בודק טיסות ישירות ועם עצירות…',
    'מוצא את המחירים הטובים…',
  ],
  ru: [
    'Ищем сотни авиакомпаний…',
    'Сравниваем цены у провайдеров…',
    'Проверяем прямые и стыковочные рейсы…',
    'Ищем лучшие тарифы…',
  ],
};

/** Provider-aware status when unified search is mid-flight (no result cards yet). */
export const SEARCH_PROVIDER_PHRASES: Record<string, Record<string, string>> = {
  en: {
    parallel: 'Searching Google Flights, Kiwi & Skyscanner in parallel…',
    gf2: 'Still checking Kiwi & Skyscanner…',
    ota: 'Still loading Google Flights…',
    both: 'Comparing prices across providers…',
  },
  he: {
    parallel: 'מחפש במקביל ב-Google Flights, Kiwi ו-Skyscanner…',
    gf2: 'עדיין בודק Kiwi ו-Skyscanner…',
    ota: 'עדיין טוען Google Flights…',
    both: 'משווה מחירים בין הספקים…',
  },
  ru: {
    parallel: 'Ищем параллельно в Google Flights, Kiwi и Skyscanner…',
    gf2: 'Ещё проверяем Kiwi и Skyscanner…',
    ota: 'Ещё загружаем Google Flights…',
    both: 'Сравниваем цены у провайдеров…',
  },
};

/** Locked copy when searchProgress.phase === 'finalizing' (results are imminent). */
export const SEARCH_ALMOST_DONE: Record<string, string> = {
  en: 'Almost done…',
  he: 'עוד רגע…',
  ru: 'Почти готово…',
};

export const SEARCH_BUTTON_PHRASES: Record<string, string[]> = {
  en: [
    'Searching hundreds of airlines…',
    'Comparing prices…',
    'Checking direct flights…',
    'Looking for the best deals…',
  ],
  he: [
    'מחפש מאות חברות תעופה…',
    'משווה מחירים…',
    'בודק טיסות ישירות…',
    'מחפש את הדילים הטובים…',
  ],
  ru: [
    'Ищем сотни авиакомпаний…',
    'Сравниваем цены…',
    'Проверяем прямые рейсы…',
    'Ищем лучшие предложения…',
  ],
};

export const SEARCH_BUTTON_ALMOST_DONE: Record<string, string> = {
  en: 'Almost there…',
  he: 'עוד רגע…',
  ru: 'Почти готово…',
};

export function getPhrasesForLanguage(
  map: Record<string, string[]>,
  language: string,
): string[] {
  return map[language] ?? map.en;
}

export function getAlmostDonePhrase(
  map: Record<string, string>,
  language: string,
): string {
  return map[language] ?? map.en;
}

function providerPhraseMap(language: string) {
  return SEARCH_PROVIDER_PHRASES[language] ?? SEARCH_PROVIDER_PHRASES.en;
}

function statsHasProvider(stats: ProviderSearchStats[] | null | undefined, name: string) {
  return (stats ?? []).some((s) => s.provider.toLowerCase() === name.toLowerCase());
}

/**
 * Honest loading copy from live provider completion (still PENDING — no partial results).
 */
export function pickSearchStatusPhrase(
  language: string,
  progress: SearchProgress | null | undefined,
  stats: ProviderSearchStats[] | null | undefined,
  nearComplete: boolean,
  phraseIdx: number,
): string {
  if (nearComplete || progress?.phase === 'finalizing') {
    return getAlmostDonePhrase(SEARCH_ALMOST_DONE, language);
  }
  const pmap = providerPhraseMap(language);
  const total = progress?.providersTotal ?? 0;
  const done = progress?.providersDone ?? 0;
  if (total <= 0) {
    return getPhrasesForLanguage(SEARCH_PROGRESS_PHRASES, language)[phraseIdx] ?? pmap.gf2;
  }
  const gf2Finished = statsHasProvider(stats, 'googleflights2');
  const multisiteFinished = statsHasProvider(stats, 'multisite');
  if (total >= 2) {
    if (done === 0) return pmap.parallel;
    if (gf2Finished && !multisiteFinished) return pmap.gf2;
    if (multisiteFinished && !gf2Finished) return pmap.ota;
    if (done > 0 && done < total) return pmap.both;
  }
  const rotating = getPhrasesForLanguage(SEARCH_PROGRESS_PHRASES, language);
  return rotating[phraseIdx % rotating.length] ?? rotating[0];
}