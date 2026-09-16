import { API_URL } from './client';

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
}

export async function login(username: string, password: string): Promise<{ access: string }> {
  const res = await fetch(`${API_URL}/api/auth/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
    credentials: 'include', // Envía la cookie HTTP-Only para el refresh token
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || 'Credenciales inválidas');
  }

  // Retornamos únicamente el access token (se guardará en el AuthContext en memoria)
  return data;
}

export async function logout(): Promise<void> {
  await fetch(`${API_URL}/api/auth/logout/`, {
    method: 'POST',
    credentials: 'include',
  });
}

export async function register(data: RegisterData): Promise<any> {
  const res = await fetch(`${API_URL}/api/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const resData = await res.json();

  if (!res.ok) {
    let errorMessage = 'Error al registrar la cuenta.';
    if (typeof resData === 'object' && resData !== null) {
      const messages = Object.entries(resData)
        .map(([field, errs]) => `${field}: ${Array.isArray(errs) ? errs.join(' ') : errs}`)
        .join(' | ');
      if (messages) errorMessage = messages;
    }
    throw new Error(errorMessage);
  }

  return resData;
}

export async function verifyEmail(uid: string, token: string): Promise<any> {
  const res = await fetch(`${API_URL}/api/auth/verify-email/${uid}/${token}/`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.detail || 'Error al verificar el correo.');
  }

  return data;
}

export async function requestPasswordReset(email: string): Promise<any> {
  const res = await fetch(`${API_URL}/api/auth/password-reset/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.detail || 'Error al solicitar el cambio de contraseña.');
  }

  return data;
}

export async function confirmPasswordReset(uid: string, token: string, password: string): Promise<any> {
  const res = await fetch(`${API_URL}/api/auth/password-reset-confirm/${uid}/${token}/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.detail || 'Error al restablecer la contraseña.');
  }

  return data;
}