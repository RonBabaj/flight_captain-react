/**
 * Persist deals search params for restore after page reload (e.g. when re-searching with new passengers).
 */

const KEY = 'flight_captain_deals_params';

export interface DealsParams {
  origin: string;
  destination: string;
  year: number;
  month: number;
  durationDays: number;
  adults: number;
  children: number;
  nonStop: boolean;
}

function getStorage(): Storage | null {
  try {
    if (typeof globalThis !== 'undefined' && (globalThis as any).window?.sessionStorage)
      return (globalThis as any).window.sessionStorage;
  } catch {}
  return null;
}

export function getPendingDealsParams(): DealsParams | null {
  const storage = getStorage();
  if (!storage) return null;
  try {
    const raw = storage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DealsParams;
    return parsed && parsed.origin && parsed.destination ? parsed : null;
  } catch {
    return null;
  }
}

export function setPendingDealsParams(params: DealsParams): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(KEY, JSON.stringify(params));
  } catch {}
}

export function clearPendingDealsParams(): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.removeItem(KEY);
  } catch {}
}
