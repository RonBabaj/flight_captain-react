import { Platform } from 'react-native';
import type { Theme } from './ThemeContext';

const STYLE_ID = 'flyfix-web-scrollbars';

/** Web-only: themed scrollbars (no default white OS track between panels). */
export function applyWebScrollbarTheme(theme: Theme): void {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;

  document.documentElement.dataset.theme = theme.mode;
  document.documentElement.style.colorScheme = theme.isDark ? 'dark' : 'light';

  let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement('style');
    el.id = STYLE_ID;
    document.head.appendChild(el);
  }

  const thumb = theme.isDark ? 'rgba(154, 163, 176, 0.45)' : 'rgba(90, 101, 114, 0.35)';
  const thumbHover = theme.isDark ? theme.primaryLight : theme.primary;
  const thumbActive = theme.isDark ? theme.primary : theme.primaryLight;

  el.textContent = `
    html, body {
      scrollbar-width: thin;
      scrollbar-color: ${thumb} transparent;
    }
    * {
      scrollbar-width: thin;
      scrollbar-color: ${thumb} transparent;
    }
    *::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    *::-webkit-scrollbar-track {
      background: transparent;
    }
    *::-webkit-scrollbar-thumb {
      background-color: ${thumb};
      border-radius: 999px;
      border: 2px solid transparent;
      background-clip: padding-box;
    }
    *::-webkit-scrollbar-thumb:hover {
      background-color: ${thumbHover};
    }
    *::-webkit-scrollbar-thumb:active {
      background-color: ${thumbActive};
    }
    *::-webkit-scrollbar-corner {
      background: transparent;
    }
  `;
}