import api from './client';

export interface UsuarioAdmin {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  activo?: boolean;
  created_at: string;
}

export async function getUsuariosAdmin(): Promise<UsuarioAdmin[]> {
  const { data } = await api.get('/api/v1/admin/usuarios');
  return data;
}

export async function crearUsuarioAdmin(datos: { name: string; email: string; password?: string; is_admin: boolean }): Promise<any> {
  const { data } = await api.post('/api/v1/admin/usuarios', datos);
  return data;
}

export async function actualizarUsuarioAdmin(id: number, datos: any): Promise<any> {
  const { data } = await api.put(`/api/v1/admin/usuarios/${id}`, datos);
  return data;
}

export async function eliminarUsuarioAdmin(id: number): Promise<any> {
  const { data } = await api.delete(`/api/v1/admin/usuarios/${id}`);
  return data;
}

export async function toggleUserRole(id: number): Promise<any> {
  const { data } = await api.patch(`/api/v1/admin/usuarios/${id}/role`);
  return data;
}