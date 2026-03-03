/**
 * API client base. Isolated from UI; single place for base URL and fetch config.
 * Must be an absolute URL so requests hit the backend, not the Expo dev server.
 */
const raw = typeof process !== 'undefined' ? process.env?.EXPO_PUBLIC_API_URL : undefined;
const API_BASE =
  (typeof raw === 'string' && raw.trim() !== '') ? raw.trim() : 'http://localhost:8080';

export function getApiBase(): string {
  return API_BASE;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
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
