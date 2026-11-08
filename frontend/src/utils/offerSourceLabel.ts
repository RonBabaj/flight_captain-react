/** Translation key for a known offer source, or null when unknown. */
export function offerSourceTranslationKey(
  source: string | undefined | null
): 'source_kiwi' | 'source_skyscanner' | 'source_expedia' | 'source_googleflights2' | null {
  switch (String(source || '').toLowerCase()) {
    case 'kiwi':
      return 'source_kiwi';
    case 'skyscanner':
      return 'source_skyscanner';
    case 'expedia':
      return 'source_expedia';
    case 'googleflights2':
    case 'google':
    case 'gf2':
      return 'source_googleflights2';
    default:
      return null;
  }
}
