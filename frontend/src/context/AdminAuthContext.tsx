import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { fetchAuthMe, loginWithPassword, logoutSession, changePassword as apiChangePassword } from '../api/auth';
import type { AuthUser } from '../api/auth';
import type { UserRole } from '../types/runtimeConfig';

const AUTH_TOKEN_KEY = 'fc_auth_token';
const LEGACY_ADMIN_TOKEN_KEY = 'fc_admin_token';

type AdminAuthContextValue = {
  role: UserRole;
  email: string | null;
  token: string | null;
  loading: boolean;
  mustChangePassword: boolean;
  signInWithPassword: (email: string, password: string) => Promise<AuthUser | null>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  signOut: () => void;
  isAdmin: boolean;
};

const AdminAuthContext = createContext<AdminAuthContextValue>({
  role: 'guest',
  email: null,
  token: null,
  loading: true,
  mustChangePassword: false,
  signInWithPassword: async () => null,
  changePassword: async () => false,
  signOut: () => {},
  isAdmin: false,
});

function readStoredToken(): string | null {
  try {
    const g = typeof globalThis !== 'undefined' ? (globalThis as any) : undefined;
    const raw =
      g?.sessionStorage?.getItem(AUTH_TOKEN_KEY) ?? g?.sessionStorage?.getItem(LEGACY_ADMIN_TOKEN_KEY);
    return typeof raw === 'string' && raw.trim() ? raw.trim() : null;
  } catch {
    return null;
  }
}

function writeStoredToken(token: string | null): void {
  try {
    const g = typeof globalThis !== 'undefined' ? (globalThis as any) : undefined;
    if (!g?.sessionStorage) return;
    g.sessionStorage.removeItem(LEGACY_ADMIN_TOKEN_KEY);
    if (token) g.sessionStorage.setItem(AUTH_TOKEN_KEY, token);
    else g.sessionStorage.removeItem(AUTH_TOKEN_KEY);
  } catch {
    // ignore
  }
}

function applyUser(
  setRole: (r: UserRole) => void,
  setEmail: (e: string | null) => void,
  setMustChangePassword: (v: boolean) => void,
  user: AuthUser,
) {
  setRole(user.role === 'admin' ? 'admin' : user.role === 'user' ? 'user' : 'guest');
  setEmail(user.email);
  setMustChangePassword(!!user.mustChangePassword);
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole>('guest');
  const [email, setEmail] = useState<string | null>(null);
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = readStoredToken();
      if (!stored) {
        if (!cancelled) {
          setToken(null);
          setRole('guest');
          setEmail(null);
          setMustChangePassword(false);
          setLoading(false);
        }
        return;
      }
      try {
        const user = await fetchAuthMe(stored);
        if (cancelled) return;
        writeStoredToken(stored);
        setToken(stored);
        applyUser(setRole, setEmail, setMustChangePassword, user);
      } catch {
        if (cancelled) return;
        writeStoredToken(null);
        setToken(null);
        setRole('guest');
        setEmail(null);
        setMustChangePassword(false);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const signInWithPassword = useCallback(async (nextEmail: string, password: string) => {
    const trimmedEmail = nextEmail.trim();
    if (!trimmedEmail || !password) return null;
    try {
      const res = await loginWithPassword(trimmedEmail, password);
      writeStoredToken(res.token);
      setToken(res.token);
      applyUser(setRole, setEmail, setMustChangePassword, res.user);
      return res.user;
    } catch {
      return null;
    }
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    if (!token) return false;
    try {
      const user = await apiChangePassword(token, currentPassword, newPassword);
      applyUser(setRole, setEmail, setMustChangePassword, user);
      return true;
    } catch {
      return false;
    }
  }, [token]);

  const signOut = useCallback(() => {
    const current = token;
    writeStoredToken(null);
    setToken(null);
    setRole('guest');
    setEmail(null);
    setMustChangePassword(false);
    if (current) {
      void logoutSession(current).catch(() => {});
    }
  }, [token]);

  const value = useMemo(
    () => ({
      role,
      email,
      token,
      loading,
      mustChangePassword,
      signInWithPassword,
      changePassword,
      signOut,
      isAdmin: role === 'admin',
    }),
    [role, email, token, loading, mustChangePassword, signInWithPassword, changePassword, signOut],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
