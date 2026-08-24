import type { RuntimeConfig } from '../types/runtimeConfig';
import { DEFAULT_RUNTIME_CONFIG } from '../types/runtimeConfig';

let currentConfig: RuntimeConfig = DEFAULT_RUNTIME_CONFIG;

export function getRuntimeConfig(): RuntimeConfig {
  return currentConfig;
}

export function setRuntimeConfigStore(config: RuntimeConfig): void {
  currentConfig = config;
}

export function resetRuntimeConfigStore(): void {
  currentConfig = DEFAULT_RUNTIME_CONFIG;
}
