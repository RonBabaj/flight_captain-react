/**
 * API client base. Isolated from UI; single place for base URL and fetch config.
 *
 * Primary source:
 * - EXPO_PUBLIC_API_BASE_URL (recommended)
 *
 * Fallbacks (for backwards compatibility/local dev):
 * - EXPO_PUBLIC_API_URL
 * - VITE_API_BASE_URL
 * - http://localhost:8080
 */
function resolveApiBase(): string {
  if (typeof process === 'undefined') return 'http://localhost:8080';
  const env = process.env as Record<string, string | undefined>;
  let raw =
    env.EXPO_PUBLIC_API_BASE_URL ||
    env.EXPO_PUBLIC_API_URL ||
    env.VITE_API_BASE_URL ||
    'http://localhost:8080';

  raw = raw.trim();
  if (!raw.startsWith('http://') && !raw.startsWith('https://')) {
    // Assume https if scheme missing.
    raw = `https://${raw}`;
  }
  return raw;
}

export const API_BASE = resolveApiBase();

export function getApiBase(): string {
  return API_BASE;
}

export function apiUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${API_BASE}${path}`;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = apiUrl(path);
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export function apiGet<T>(path: string): Promise<T> {
  return apiRequest<T>(path, { method: 'GET' });
}

export function apiPost<T>(path: string, body: unknown): Promise<T> {
  return apiRequest<T>(path, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
