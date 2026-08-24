import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { verifyAdminToken } from '../api/runtimeConfig';
import type { UserRole } from '../types/runtimeConfig';

const ADMIN_TOKEN_KEY = 'fc_admin_token';

type AdminAuthContextValue = {
  role: UserRole;
  token: string | null;
  loading: boolean;
  signIn: (token: string) => Promise<boolean>;
  signOut: () => void;
  isAdmin: boolean;
};

const AdminAuthContext = createContext<AdminAuthContextValue>({
  role: 'guest',
  token: null,
  loading: true,
  signIn: async () => false,
  signOut: () => {},
  isAdmin: false,
});

function readStoredToken(): string | null {
  try {
    const g = typeof globalThis !== 'undefined' ? (globalThis as any) : undefined;
    const raw = g?.sessionStorage?.getItem(ADMIN_TOKEN_KEY);
    return typeof raw === 'string' && raw.trim() ? raw.trim() : null;
  } catch {
    return null;
  }
}

function writeStoredToken(token: string | null): void {
  try {
    const g = typeof globalThis !== 'undefined' ? (globalThis as any) : undefined;
    if (!g?.sessionStorage) return;
    if (token) g.sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
    else g.sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  } catch {
    // ignore
  }
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole>('guest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = readStoredToken();
      if (!stored) {
        if (!cancelled) {
          setToken(null);
          setRole('guest');
          setLoading(false);
        }
        return;
      }
      const ok = await verifyAdminToken(stored);
      if (cancelled) return;
      if (ok) {
        setToken(stored);
        setRole('admin');
      } else {
        writeStoredToken(null);
        setToken(null);
        setRole('guest');
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (nextToken: string) => {
    const trimmed = nextToken.trim();
    if (!trimmed) return false;
    const ok = await verifyAdminToken(trimmed);
    if (!ok) return false;
    writeStoredToken(trimmed);
    setToken(trimmed);
    setRole('admin');
    return true;
  }, []);

  const signOut = useCallback(() => {
    writeStoredToken(null);
    setToken(null);
    setRole('guest');
  }, []);

  const value = useMemo(
    () => ({
      role,
      token,
      loading,
      signIn,
      signOut,
      isAdmin: role === 'admin',
    }),
    [role, token, loading, signIn, signOut],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
