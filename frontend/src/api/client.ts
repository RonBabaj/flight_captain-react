/**
 * API client base. Isolated from UI; single place for base URL and fetch config.
 *
 * Primary source:
 * - EXPO_PUBLIC_API_BASE_URL (recommended)
 *
 * Fallbacks (for backwards compatibility/local dev):
 * - EXPO_PUBLIC_API_URL
 * - http://localhost:8080 (ONLY when running on localhost)
 *
 * IMPORTANT: Expo/Metro statically inlines EXPO_PUBLIC_* only when accessed via
 * direct `process.env.EXPO_PUBLIC_*` references (no typeof checks, no dynamic lookup).
 */
import { getRuntimeConfig } from '../config/runtimeConfigStore';

const EXPO_API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const EXPO_API_URL = process.env.EXPO_PUBLIC_API_URL;

function isLocalHostname(): boolean {
  try {
    const g = typeof globalThis !== 'undefined' ? (globalThis as any) : undefined;
    const hostname: string | undefined = g?.window?.location?.hostname;
    if (hostname) {
      const h = hostname;
      return h === 'localhost' || h === '127.0.0.1';
    }
  } catch {
    // ignore
  }
  return false;
}

function resolveApiBase(): string {
  let raw = (EXPO_API_BASE_URL || EXPO_API_URL || '').trim();

  // No env configured.
  if (!raw) {
    if (!isLocalHostname()) {
      throw new Error(
        '[API_BASE_URL] EXPO_PUBLIC_API_BASE_URL is required in production/non-local environments'
      );
    }
    raw = 'http://localhost:8080';
  }

  // Add scheme when missing.
  if (!raw.startsWith('http://') && !raw.startsWith('https://')) {
    const isLocal =
      raw.startsWith('localhost') ||
      raw.startsWith('127.0.0.1');
    raw = `${isLocal ? 'http' : 'https'}://${raw}`;
  }

  // Strip trailing slashes to keep url join logic simple.
  while (raw.endsWith('/')) {
    raw = raw.slice(0, -1);
  }

  return raw;
}

export const API_BASE = resolveApiBase();

// Log at startup so we can verify what the frontend is calling in each environment.
if (typeof console !== 'undefined') {
  // eslint-disable-next-line no-console
  console.log('[API_BASE_URL]', API_BASE);
}

export function getApiBase(): string {
  return API_BASE;
}

export function apiUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${API_BASE}${path}`;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { timeoutMs?: number } = {}
): Promise<T> {
  const url = apiUrl(path);
  const { timeoutMs, ...fetchOptions } = options;
  const waitMs = timeoutMs ?? getRuntimeConfig().apiRequestDefaultTimeoutMs;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), waitMs);
  if (fetchOptions.signal) {
    const outer = fetchOptions.signal;
    if (outer.aborted) controller.abort();
    else outer.addEventListener('abort', () => controller.abort(), { once: true });
  }
  let res: Response;
  try {
    res = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
    });
  } catch (e) {
    const aborted = controller.signal.aborted;
    const raw = e instanceof Error ? e.message : String(e);
    if (aborted && !fetchOptions.signal?.aborted) {
      throw new Error('Search timed out. Please try again in a moment.');
    }
    // WebKit/Brave often surfaces cross-origin/network aborts as "Load failed (host)".
    if (/load failed|failed to fetch|networkerror|network request failed/i.test(raw)) {
      throw new Error(
        'Could not reach the flight API. Please check your connection and try again.'
      );
    }
    throw e instanceof Error ? e : new Error(raw);
  } finally {
    clearTimeout(timer);
  }
  if (!res.ok) {
    const text = await res.text();
    // Gateway proxies often return HTML for timeouts; keep the message short for UI.
    if (res.status === 504 || /gateway time-?out/i.test(text)) {
      throw new Error('Search timed out. Please try again in a moment.');
    }
    if (res.status === 502) {
      throw new Error('Flight search is temporarily unavailable. Please try again.');
    }
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export function apiGet<T>(path: string, timeoutMs?: number): Promise<T> {
  return apiRequest<T>(path, { method: 'GET', timeoutMs });
}

export function apiPost<T>(path: string, body: unknown, timeoutMs?: number): Promise<T> {
  return apiRequest<T>(path, {
    method: 'POST',
    body: JSON.stringify(body),
    timeoutMs,
  });
}
