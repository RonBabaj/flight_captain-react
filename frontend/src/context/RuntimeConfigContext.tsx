import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { fetchRuntimeConfig } from '../api/runtimeConfig';
import { setRuntimeConfigStore } from '../config/runtimeConfigStore';
import type { RuntimeConfig } from '../types/runtimeConfig';
import { DEFAULT_RUNTIME_CONFIG } from '../types/runtimeConfig';

type RuntimeConfigContextValue = {
  config: RuntimeConfig;
  loading: boolean;
  refresh: () => Promise<void>;
  applyConfig: (next: RuntimeConfig) => void;
};

const RuntimeConfigContext = createContext<RuntimeConfigContextValue>({
  config: DEFAULT_RUNTIME_CONFIG,
  loading: true,
  refresh: async () => {},
  applyConfig: () => {},
});

export function RuntimeConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<RuntimeConfig>(DEFAULT_RUNTIME_CONFIG);
  const [loading, setLoading] = useState(true);

  const applyConfig = useCallback((next: RuntimeConfig) => {
    setConfig(next);
    setRuntimeConfigStore(next);
  }, []);

  const refresh = useCallback(async () => {
    const next = await fetchRuntimeConfig();
    applyConfig(next);
  }, [applyConfig]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const next = await fetchRuntimeConfig();
      if (!cancelled) {
        applyConfig(next);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [applyConfig]);

  const value = useMemo(
    () => ({ config, loading, refresh, applyConfig }),
    [config, loading, refresh, applyConfig],
  );

  return (
    <RuntimeConfigContext.Provider value={value}>{children}</RuntimeConfigContext.Provider>
  );
}

export function useRuntimeConfig(): RuntimeConfig {
  return useContext(RuntimeConfigContext).config;
}

export function useRuntimeConfigActions() {
  const { refresh, applyConfig, loading } = useContext(RuntimeConfigContext);
  return { refresh, applyConfig, loading };
}
