/**
 * Web-only SVG icons as data URIs. Used when icon fonts don't load so we still show real icons.
 * Outline style, 24x24 viewBox. Color is injected into the SVG.
 */

export function getWebIconSvgDataUri(name: string, color: string): string | null {
  const encoded = encodeURIComponent(getSvgMarkup(name, color));
  return `data:image/svg+xml,${encoded}`;
}

function getSvgMarkup(name: string, color: string): string {
  const stroke = color.replace(/"/g, "'");
  const fill = stroke;
  const common = `xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`;
  switch (name) {
    case 'airplane-outline':
      // Material Design "flight" icon (universal airplane icon, e.g. Google Flights)
      return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="${fill}" d="M2.5 19h19v2h-19v-2zm19.57-9.36c-.21-.8-.84-1.28-1.64-1.06l-5.31 1.42-6.92-6.42-1.91.51 4.14 7.21-4.97 1.33-1.97-1.54-.45 1.15 1.82 3.39.59 1.33 1.6.58 5.31-1.43 4.31-1.16 5.31-.59c.81-.24 1.28-1.06 1.07-1.86z"/></svg>`;
    case 'globe-outline':
      return `<svg ${common}><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;
    case 'sunny-outline':
      return `<svg ${common}><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`;
    case 'moon-outline':
      return `<svg ${common}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    case 'menu-outline':
      return `<svg ${common}><path d="M3 12h18M3 6h18M3 18h18"/></svg>`;
    default:
      return '';
  }
}

/** Icon names that have a web SVG fallback (ion outline style). */
export const WEB_SVG_ICON_NAMES = new Set([
  'airplane-outline',
  'globe-outline',
  'sunny-outline',
  'moon-outline',
  'menu-outline',
]);

export function hasWebSvgFallback(name: string): boolean {
  return WEB_SVG_ICON_NAMES.has(name);
}
