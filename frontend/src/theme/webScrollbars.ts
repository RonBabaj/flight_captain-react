import { Platform } from 'react-native';
import type { Theme } from './ThemeContext';

const STYLE_ID = 'flyfix-scrollbar-theme';

function scrollbarCss(theme: Theme): string {
  const thumb = theme.isDark ? '#3E4F62' : '#B8C8C8';
  const thumbHover = theme.isDark ? '#4E6278' : '#9AADAD';
  return `
    * {
      scrollbar-width: thin;
      scrollbar-color: ${thumb} transparent;
    }
    *::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }
    *::-webkit-scrollbar-track {
      background: transparent;
    }
    *::-webkit-scrollbar-thumb {
      background-color: ${thumb};
      border-radius: 999px;
      border: 2px solid transparent;
      background-clip: content-box;
    }
    *::-webkit-scrollbar-thumb:hover {
      background-color: ${thumbHover};
    }
  `;
}

export function applyWebScrollbarTheme(theme: Theme): void {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;
  let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement('style');
    el.id = STYLE_ID;
    document.head.appendChild(el);
  }
  el.textContent = scrollbarCss(theme);
}