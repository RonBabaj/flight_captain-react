import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  fetchAuthMe,
  loginWithPassword,
  logoutSession,
  changePassword as apiChangePassword,
  registerAccount,
} from '../api/auth';
import type { AuthUser } from '../api/auth';
import type { UserRole } from '../types/runtimeConfig';

const AUTH_TOKEN_KEY = 'fc_auth_token';
const LEGACY_ADMIN_TOKEN_KEY = 'fc_admin_token';

export type AuthContextValue = {
  role: UserRole;
  userId: number | null;
  email: string | null;
  token: string | null;
  loading: boolean;
  mustChangePassword: boolean;
  isSignedIn: boolean;
  isAdmin: boolean;
  signInWithPassword: (email: string, password: string) => Promise<AuthUser | null>;
  register: (email: string, password: string) => Promise<AuthUser | null>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue>({
  role: 'guest',
  userId: null,
  email: null,
  token: null,
  loading: true,
  mustChangePassword: false,
  isSignedIn: false,
  isAdmin: false,
  signInWithPassword: async () => null,
  register: async () => null,
  changePassword: async () => false,
  signOut: () => {},
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
  setUserId: (id: number | null) => void,
  setEmail: (e: string | null) => void,
  setMustChangePassword: (v: boolean) => void,
  user: AuthUser,
) {
  setRole(user.role === 'admin' ? 'admin' : user.role === 'user' ? 'user' : 'guest');
  setUserId(typeof user.id === 'number' ? user.id : null);
  setEmail(user.email);
  setMustChangePassword(!!user.mustChangePassword);
}

function clearUser(
  setRole: (r: UserRole) => void,
  setUserId: (id: number | null) => void,
  setEmail: (e: string | null) => void,
  setMustChangePassword: (v: boolean) => void,
) {
  setRole('guest');
  setUserId(null);
  setEmail(null);
  setMustChangePassword(false);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole>('guest');
  const [userId, setUserId] = useState<number | null>(null);
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
          clearUser(setRole, setUserId, setEmail, setMustChangePassword);
          setLoading(false);
        }
        return;
      }
      try {
        const user = await fetchAuthMe(stored);
        if (cancelled) return;
        writeStoredToken(stored);
        setToken(stored);
        applyUser(setRole, setUserId, setEmail, setMustChangePassword, user);
      } catch {
        if (cancelled) return;
        writeStoredToken(null);
        setToken(null);
        clearUser(setRole, setUserId, setEmail, setMustChangePassword);
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
      applyUser(setRole, setUserId, setEmail, setMustChangePassword, res.user);
      return res.user;
    } catch (e) {
      if (e instanceof Error && (e.message === 'AUTH_NOT_AVAILABLE' || e.message === 'AUTH_NOT_CONFIGURED')) {
        throw e;
      }
      return null;
    }
  }, []);

  const register = useCallback(async (nextEmail: string, password: string) => {
    const trimmedEmail = nextEmail.trim();
    if (!trimmedEmail || !password) return null;
    try {
      const res = await registerAccount(trimmedEmail, password);
      writeStoredToken(res.token);
      setToken(res.token);
      applyUser(setRole, setUserId, setEmail, setMustChangePassword, res.user);
      return res.user;
    } catch (e) {
      if (e instanceof Error && e.message === 'REGISTRATION_DISABLED') {
        throw e;
      }
      if (e instanceof Error && e.message === 'EMAIL_TAKEN') {
        throw e;
      }
      return null;
    }
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    if (!token) return false;
    try {
      const user = await apiChangePassword(token, currentPassword, newPassword);
      applyUser(setRole, setUserId, setEmail, setMustChangePassword, user);
      return true;
    } catch {
      return false;
    }
  }, [token]);

  const signOut = useCallback(() => {
    const current = token;
    writeStoredToken(null);
    setToken(null);
    clearUser(setRole, setUserId, setEmail, setMustChangePassword);
    if (current) {
      void logoutSession(current).catch(() => {});
    }
  }, [token]);

  const isSignedIn = role === 'user' || role === 'admin';
  const isAdmin = role === 'admin';

  const value = useMemo(
    () => ({
      role,
      userId,
      email,
      token,
      loading,
      mustChangePassword,
      isSignedIn,
      isAdmin,
      signInWithPassword,
      register,
      changePassword,
      signOut,
    }),
    [
      role,
      userId,
      email,
      token,
      loading,
      mustChangePassword,
      isSignedIn,
      isAdmin,
      signInWithPassword,
      register,
      changePassword,
      signOut,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

/** @deprecated Use useAuth */
export function useAdminAuth() {
  return useContext(AuthContext);
}

/** @deprecated Use AuthProvider */
export const AdminAuthProvider = AuthProvider;
