import { API_URL, fetchWithAuth } from './client';

export interface DashboardStats {
  total_productos: number;
  total_categorias: number;
  total_usuarios: number;
  productos_bajo_stock: number;
}

export interface UsuarioAdmin {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_active: boolean;
  date_joined: string;
}

export async function getDashboardStats(token?: string | null): Promise<DashboardStats> {
  const res = await fetchWithAuth('/api/auth/dashboard-stats/', {}, token);
  if (!res.ok) throw new Error('Error al cargar métricas del dashboard');
  return await res.json();
}

export async function getUsuariosAdmin(token?: string | null): Promise<UsuarioAdmin[]> {
  const res = await fetchWithAuth('/api/auth/gestion-usuarios/', {}, token);
  if (!res.ok) throw new Error('Error al obtener lista de usuarios');
  return await res.json();
}

export async function toggleUserRole(id: number, is_staff: boolean, token?: string | null): Promise<UsuarioAdmin> {
  const res = await fetchWithAuth(`/api/auth/gestion-usuarios/${id}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ is_staff }),
  }, token);
  if (!res.ok) throw new Error('Error al actualizar rol de usuario');
  return await res.json();
}