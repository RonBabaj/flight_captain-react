/** Rotating status copy shared by progress banners, submit buttons, and overlays. */
/** "Almost done" is intentionally excluded — show it only via SEARCH_ALMOST_DONE when nearComplete. */
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
