/**
 * Survive Chrome/iOS WebKit address-bar sync that strips ?sessionId=… from the
 * visible URL (and sometimes from window.location) after a shared link opens.
 * sessionStorage is tab-scoped — Incognito still works within the same tab.
 */

import type { SearchUrlState } from '../hooks/useSearchParams';

const KEY = 'flyfix_shared_link_v1';

function getSessionStorage(): Storage | null {
  try {
    const g = globalThis as { window?: { sessionStorage?: Storage } };
    return g.window?.sessionStorage ?? null;
  } catch {
    return null;
  }
}

export function readSharedLinkCache(): SearchUrlState | null {
  const storage = getSessionStorage();
  if (!storage) return null;
  try {
    const raw = storage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SearchUrlState;
    if (!parsed || typeof parsed !== 'object') return null;
    if (typeof parsed.sessionId !== 'string' || !parsed.sessionId.trim()) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Persist whatever identity we still have for this tab's shared link. */
export function rememberSharedLink(params: SearchUrlState): void {
  const sessionId = typeof params.sessionId === 'string' ? params.sessionId.trim() : '';
  if (!sessionId) return;
  const storage = getSessionStorage();
  if (!storage) return;
  try {
    const prev = readSharedLinkCache() ?? {};
    const next: SearchUrlState = {
      ...prev,
      ...params,
      sessionId,
    };
    storage.setItem(KEY, JSON.stringify(next));
  } catch {
    // ignore quota / private-mode edge cases
  }
}

export function clearSharedLinkCache(): void {
  const storage = getSessionStorage();
  if (!storage) return;
  try {
    storage.removeItem(KEY);
  } catch {
    // ignore
  }
}
