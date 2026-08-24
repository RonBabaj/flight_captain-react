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

function adminAuthHeaders(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

export async function fetchAdminRuntimeConfig(token: string): Promise<RuntimeConfig> {
  return apiRequest<RuntimeConfig>('/api/admin/runtime-config', {
    method: 'GET',
    headers: adminAuthHeaders(token),
    timeoutMs: 15_000,
  });
}

export async function saveAdminRuntimeConfig(
  token: string,
  config: RuntimeConfig,
): Promise<RuntimeConfig> {
  return apiRequest<RuntimeConfig>('/api/admin/runtime-config', {
    method: 'PUT',
    headers: adminAuthHeaders(token),
    body: JSON.stringify(config),
    timeoutMs: 15_000,
  });
}
