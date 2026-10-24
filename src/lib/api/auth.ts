import api from './client';

export interface RegisterData {
  name: string; 
  email: string;
  password: string;
  password_confirmation: string; 
}

// ==========================================
// 1. INICIO Y CIERRE DE SESIÓN
// ==========================================
export async function login(email: string, password: string): Promise<any> {
  await api.get('/sanctum/csrf-cookie');
  const res = await api.post('/login', { email, password });
  return res.data;
}

export async function logout(): Promise<void> {
  await api.post('/logout');
}

// ==========================================
// 2. REGISTRO DE USUARIO
// ==========================================
export async function register(data: RegisterData): Promise<any> {
  await api.get('/sanctum/csrf-cookie');
  const res = await api.post('/register', data);
  return res.data;
}

// ==========================================
// 3. VERIFICACIÓN DE CORREO (MAILTRAP)
// ==========================================

// Para cuando el usuario pide que le vuelvan a enviar el correo de verificación
export async function resendVerificationEmail(): Promise<any> {
  await api.get('/sanctum/csrf-cookie');
  const res = await api.post('/email/verification-notification');
  return res.data;
}

// Para validar el enlace que el usuario recibe en su correo
// Recibe la URL relativa firmada (ej: /verify-email/1/aBcD123?expires=...&signature=...)
export async function verifyEmail(signedUrl: string): Promise<any> {
  const res = await api.get(signedUrl);
  return res.data;
}

// ==========================================
// 4. RECUPERACIÓN DE CONTRASEÑA
// ==========================================

// Paso 1: Enviar correo de recuperación
export async function requestPasswordReset(email: string): Promise<any> {
  await api.get('/sanctum/csrf-cookie');
  const res = await api.post('/forgot-password', { email }); 
  return res.data;
}

// Paso 2: Cambiar la contraseña usando el token del correo
export async function confirmPasswordReset(data: {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}): Promise<any> {
  await api.get('/sanctum/csrf-cookie');
  const res = await api.post('/reset-password', data);
  return res.data;
}