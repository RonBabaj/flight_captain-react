/** Rotating status copy shared by progress banners, submit buttons, and overlays. */
export const SEARCH_PROGRESS_PHRASES: Record<string, string[]> = {
  en: [
    'Searching hundreds of airlines…',
    'Comparing prices across providers…',
    'Checking direct and connecting flights…',
    'Finding the best fares…',
    'Almost done…',
  ],
  he: [
    'מחפש מאות חברות תעופה…',
    'משווה מחירים בין ספקים…',
    'בודק טיסות ישירות ועם עצירות…',
    'מוצא את המחירים הטובים…',
    'עוד רגע…',
  ],
  ru: [
    'Ищем сотни авиакомпаний…',
    'Сравниваем цены у провайдеров…',
    'Проверяем прямые и стыковочные рейсы…',
    'Ищем лучшие тарифы…',
    'Почти готово…',
  ],
};

export const SEARCH_BUTTON_PHRASES: Record<string, string[]> = {
  en: [
    'Searching hundreds of airlines…',
    'Comparing prices…',
    'Checking direct flights…',
    'Looking for the best deals…',
    'Almost there…',
  ],
  he: [
    'מחפש מאות חברות תעופה…',
    'משווה מחירים…',
    'בודק טיסות ישירות…',
    'מחפש את הדילים הטובים…',
    'עוד רגע…',
  ],
  ru: [
    'Ищем сотни авиакомпаний…',
    'Сравниваем цены…',
    'Проверяем прямые рейсы…',
    'Ищем лучшие предложения…',
    'Почти готово…',
  ],
};

export function getPhrasesForLanguage(
  map: Record<string, string[]>,
  language: string,
): string[] {
  return map[language] ?? map.en;
}
