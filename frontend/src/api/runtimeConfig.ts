import { apiGet, apiRequest } from './client';
import type { RuntimeConfig } from '../types/runtimeConfig';
import { DEFAULT_RUNTIME_CONFIG } from '../types/runtimeConfig';

export async function fetchRuntimeConfig(): Promise<RuntimeConfig> {
  try {
    return await apiGet<RuntimeConfig>('/api/runtime-config', 15_000);
  } catch {
    return DEFAULT_RUNTIME_CONFIG;
  }
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  const res = await apiRequest<{ ok: boolean; role: string }>('/api/admin/verify', {
    method: 'POST',
    body: JSON.stringify({ token }),
    timeoutMs: 15_000,
  });
  return res.ok === true && res.role === 'admin';
}

export async function fetchAdminRuntimeConfig(token: string): Promise<RuntimeConfig> {
  return apiRequest<RuntimeConfig>('/api/admin/runtime-config', {
    method: 'GET',
    headers: { 'X-Admin-Token': token },
    timeoutMs: 15_000,
  });
}

export async function saveAdminRuntimeConfig(
  token: string,
  config: RuntimeConfig,
): Promise<RuntimeConfig> {
  return apiRequest<RuntimeConfig>('/api/admin/runtime-config', {
    method: 'PUT',
    headers: { 'X-Admin-Token': token },
    body: JSON.stringify(config),
    timeoutMs: 15_000,
  });
}
