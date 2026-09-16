export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function fetchWithAuth(
  endpoint: string, 
  options: RequestInit = {}, 
  token?: string | null
): Promise<Response> {
  const headers = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include', // Asegura el envío de la cookie de refresh cuando se requiera
  });

  if (response.status === 401) {
    window.location.href = '/login';
    throw new Error('Sesión expirada o no autorizada');
  }

  return response;
}