/**
 * Local static SVG icons as data URIs. No runtime font loading.
 * Used for all platforms (Expo web, iOS, Android) for reliable icon rendering including incognito/private.
 * Outline style, 24x24 viewBox. Color is injected into the SVG.
 */

export function getWebIconSvgDataUri(name: string, color: string): string | null {
  const markup = getSvgMarkup(name, color);
  if (!markup) return null;
  const encoded = encodeURIComponent(markup);
  return `data:image/svg+xml,${encoded}`;
}

function getSvgMarkup(name: string, color: string): string {
  const stroke = color.replace(/"/g, "'");
  const fill = stroke;
  const common = `xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`;
  const resolved = name === 'search-outline' ? 'search' : name;
  switch (resolved) {
    case 'airplane-outline':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="${fill}" d="M2.5 19h19v2h-19v-2zm19.57-9.36c-.21-.8-.84-1.28-1.64-1.06l-5.31 1.42-6.92-6.42-1.91.51 4.14 7.21-4.97 1.33-1.97-1.54-.45 1.15 1.82 3.39.59 1.33 1.6.58 5.31-1.43 4.31-1.16 5.31-.59c.81-.24 1.28-1.06 1.07-1.86z"/></svg>`;
    case 'globe-outline':
      return `<svg ${common}><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;
    case 'sunny-outline':
      return `<svg ${common}><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`;
    case 'moon-outline':
      return `<svg ${common}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    case 'menu-outline':
      return `<svg ${common}><path d="M3 12h18M3 6h18M3 18h18"/></svg>`;
    case 'search':
      return `<svg ${common}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`;
    case 'filter-outline':
      return `<svg ${common}><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>`;
    case 'options-outline':
      return `<svg ${common}><path d="M4 20V10M4 10h4v10H4M12 20V4M12 4h4v16h-4M20 20v-6M20 14h4v6h-4"/></svg>`;
    case 'calendar-outline':
      return `<svg ${common}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>`;
    case 'close':
      return `<svg ${common}><path d="M18 6L6 18M6 6l12 12"/></svg>`;
    case 'create-outline':
      return `<svg ${common}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`;
    case 'time-outline':
      return `<svg ${common}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`;
    case 'chevron-down':
      return `<svg ${common}><path d="m6 9 6 6 6-6"/></svg>`;
    case 'chevron-up':
      return `<svg ${common}><path d="m18 15-6-6-6 6"/></svg>`;
    case 'chevron-back':
      return `<svg ${common}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>`;
    case 'chevron-forward':
      return `<svg ${common}><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
    case 'add-outline':
      return `<svg ${common}><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>`;
    case 'share-outline':
      return `<svg ${common}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>`;
    case 'link-outline':
      return `<svg ${common}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`;
    case 'settings-outline':
      return `<svg ${common}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`;
    case 'home-outline':
      return `<svg ${common}><path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5z"/></svg>`;
    case 'person-outline':
      return `<svg ${common}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
    case 'heart-outline':
      return `<svg ${common}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
    case 'shield-outline':
      return `<svg ${common}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
    case 'information-circle-outline':
      return `<svg ${common}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>`;
    case 'alert-circle-outline':
      return `<svg ${common}><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>`;
    case 'arrow-back':
      return `<svg ${common}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>`;
    case 'arrow-forward':
      return `<svg ${common}><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
    default:
      return '';
  }
}

/** All icon names supported by local static SVG (no font). */
export const LOCAL_ICON_NAMES = new Set([
  'airplane-outline', 'globe-outline', 'sunny-outline', 'moon-outline', 'menu-outline',
  'search', 'search-outline', 'filter-outline', 'options-outline', 'calendar-outline', 'close',
  'create-outline', 'time-outline', 'chevron-down', 'chevron-up', 'chevron-back', 'chevron-forward',
  'add-outline', 'share-outline', 'link-outline',
  'settings-outline', 'home-outline', 'person-outline', 'heart-outline', 'shield-outline',
  'information-circle-outline', 'alert-circle-outline', 'arrow-back', 'arrow-forward',
]);

export function hasWebSvgFallback(name: string): boolean {
  return LOCAL_ICON_NAMES.has(name);
}
