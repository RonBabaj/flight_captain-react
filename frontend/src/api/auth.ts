import { apiRequest } from './client';

export type AuthUser = {
  id?: number;
  email: string;
  role: 'guest' | 'user' | 'admin';
  mustChangePassword: boolean;
};

export type ManagedUser = AuthUser & {
  id: number;
};

export type LoginResponse = {
  token: string;
  user: AuthUser;
};

function authHeaders(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

export async function loginWithPassword(email: string, password: string): Promise<LoginResponse> {
  try {
    return await apiRequest<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      timeoutMs: 15_000,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (/API 404|404 page not found/i.test(msg)) {
      throw new Error('AUTH_NOT_AVAILABLE');
    }
    if (/API 503|authentication is not available/i.test(msg)) {
      throw new Error('AUTH_NOT_CONFIGURED');
    }
    throw e;
  }
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

export async function registerAccount(email: string, password: string): Promise<LoginResponse> {
  try {
    return await apiRequest<LoginResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      timeoutMs: 15_000,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (/API 403|registration is disabled/i.test(msg)) {
      throw new Error('REGISTRATION_DISABLED');
    }
    if (/API 409|already registered/i.test(msg)) {
      throw new Error('EMAIL_TAKEN');
    }
    throw e;
  }
}

export async function fetchUsers(token: string): Promise<ManagedUser[]> {
  const res = await apiRequest<{ users: ManagedUser[] }>('/api/auth/users', {
    method: 'GET',
    headers: authHeaders(token),
    timeoutMs: 15_000,
  });
  return res.users;
}

export async function createUser(
  token: string,
  email: string,
  password: string,
  role: 'user' | 'admin',
): Promise<ManagedUser> {
  const res = await apiRequest<{ user: ManagedUser }>('/api/auth/users', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ email, password, role }),
    timeoutMs: 15_000,
  });
  return res.user;
}

export async function updateUser(
  token: string,
  id: number,
  patch: { role?: 'user' | 'admin'; password?: string },
): Promise<ManagedUser> {
  const res = await apiRequest<{ user: ManagedUser }>('/api/auth/users', {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify({ id, ...patch }),
    timeoutMs: 15_000,
  });
  return res.user;
}

export async function deleteUser(token: string, id: number): Promise<void> {
  await apiRequest<{ ok: boolean }>('/api/auth/users', {
    method: 'DELETE',
    headers: authHeaders(token),
    body: JSON.stringify({ id }),
    timeoutMs: 15_000,
  });
}
