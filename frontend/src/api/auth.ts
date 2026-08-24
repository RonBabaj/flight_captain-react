import { apiRequest } from './client';

export type AuthUser = {
  email: string;
  role: 'guest' | 'user' | 'admin';
  mustChangePassword: boolean;
};

export type LoginResponse = {
  token: string;
  user: AuthUser;
};

function authHeaders(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

export async function loginWithPassword(email: string, password: string): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    timeoutMs: 15_000,
  });
}

export async function fetchAuthMe(token: string): Promise<AuthUser> {
  return apiRequest<AuthUser>('/api/auth/me', {
    method: 'GET',
    headers: authHeaders(token),
    timeoutMs: 15_000,
  });
}

export async function logoutSession(token: string): Promise<void> {
  await apiRequest<{ ok: boolean }>('/api/auth/logout', {
    method: 'POST',
    headers: authHeaders(token),
    timeoutMs: 15_000,
  });
}

export async function changePassword(
  token: string,
  currentPassword: string,
  newPassword: string,
): Promise<AuthUser> {
  const res = await apiRequest<{ ok: boolean; user: AuthUser }>('/api/auth/change-password', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ currentPassword, newPassword }),
    timeoutMs: 15_000,
  });
  return res.user;
}
