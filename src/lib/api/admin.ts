import api from './client';

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

export async function getDashboardStats(): Promise<DashboardStats> {
  const { data } = await api.get('/api/v1/admin/dashboard-stats');
  return data;
}

export async function getUsuariosAdmin(): Promise<UsuarioAdmin[]> {
  const { data } = await api.get('/api/v1/admin/usuarios');
  return data;
}

export async function toggleUserRole(id: number, is_staff: boolean): Promise<UsuarioAdmin> {
  const { data } = await api.patch(`/api/v1/admin/usuarios/${id}/role`, { 
    is_staff 
  });
  return data;
}