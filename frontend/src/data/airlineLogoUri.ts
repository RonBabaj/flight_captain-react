/**
 * Single source for airline logo URLs (IATA → image).
 * Uses Kiwi’s public airline artwork CDN — common for 2-letter IATA codes.
 * Components must fall back to a monogram on load failure (never show broken icons).
 */

const CDN = 'https://images.kiwi.com/airlines';

export function airlineLogoUri(iata: string | undefined | null, pixelSize = 64): string | null {
  const code = (iata || '').trim().toUpperCase();
  if (!/^[A-Z0-9]{2}$/.test(code)) return null;
  const px = pixelSize >= 128 ? 128 : pixelSize >= 64 ? 64 : 32;
  return `${CDN}/${px}/${code}.png`;
}