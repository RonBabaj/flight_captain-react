import { useEffect } from 'react';
import { Platform } from 'react-native';

type Focusable = {
  tagName?: string;
  isContentEditable?: boolean;
  scrollIntoView?: (opts: { block: string; inline: string }) => void;
};

/**
 * On mobile web the layout viewport stays full height, so the keyboard covers
 * the field the user is typing in. Scroll that field into the visible area.
 */
export function useKeepFocusedFieldVisible() {
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const doc = (globalThis as { document?: DocumentLike }).document;
    if (!doc) return;
    const onFocus = (ev: { target?: Focusable | null }) => {
      const target = ev.target;
      if (!target) return;
      const tag = target.tagName;
      if (tag !== 'INPUT' && tag !== 'TEXTAREA' && !target.isContentEditable) return;
      const timer = (globalThis as { setTimeout?: (fn: () => void, ms: number) => void }).setTimeout;
      timer?.(() => {
        target.scrollIntoView?.({ block: 'center', inline: 'nearest' });
      }, 300);
    };
    doc.addEventListener('focusin', onFocus);
    return () => doc.removeEventListener('focusin', onFocus);
  }, []);
}

type DocumentLike = {
  addEventListener: (type: string, listener: (ev: { target?: Focusable | null }) => void) => void;
  removeEventListener: (type: string, listener: (ev: { target?: Focusable | null }) => void) => void;
};
