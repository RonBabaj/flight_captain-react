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
  switch (name) {
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
    default:
      return '';
  }
}

/** All icon names supported by local static SVG (no font). */
export const LOCAL_ICON_NAMES = new Set([
  'airplane-outline', 'globe-outline', 'sunny-outline', 'moon-outline', 'menu-outline',
  'search', 'filter-outline', 'options-outline', 'calendar-outline', 'close',
  'create-outline', 'time-outline', 'chevron-down', 'chevron-up', 'chevron-back', 'chevron-forward',
]);

export function hasWebSvgFallback(name: string): boolean {
  return LOCAL_ICON_NAMES.has(name);
}
