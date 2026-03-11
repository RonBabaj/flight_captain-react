/**
 * API client base. Isolated from UI; single place for base URL and fetch config.
 *
 * Primary source:
 * - EXPO_PUBLIC_API_BASE_URL (recommended)
 *
 * Fallbacks (for backwards compatibility/local dev):
 * - EXPO_PUBLIC_API_URL
 * - VITE_API_BASE_URL
 * - http://localhost:8080 (ONLY when running on localhost)
 */
function isLocalHostname(): boolean {
  try {
    if (typeof window !== 'undefined' && window.location?.hostname) {
      const h = window.location.hostname;
      return h === 'localhost' || h === '127.0.0.1';
    }
  } catch {
    // ignore
  }
  return false;
}

function resolveApiBase(): string {
  const env = (typeof process !== 'undefined' ? process.env : undefined) as
    | Record<string, string | undefined>
    | undefined;

  const fromEnv =
    env?.EXPO_PUBLIC_API_BASE_URL ||
    env?.EXPO_PUBLIC_API_URL ||
    env?.VITE_API_BASE_URL ||
    '';

  let raw = fromEnv.trim();

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
