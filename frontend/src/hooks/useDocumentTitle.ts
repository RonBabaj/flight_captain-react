import { useEffect } from 'react';
import { Platform } from 'react-native';

const SITE = 'Fly-Fix';

/** Set browser tab title per screen (web only). */
export function useDocumentTitle(pageTitle: string) {
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    const prev = document.title;
    document.title = pageTitle ? `${pageTitle} · ${SITE}` : SITE;
    return () => {
      document.title = prev;
    };
  }, [pageTitle]);
}
