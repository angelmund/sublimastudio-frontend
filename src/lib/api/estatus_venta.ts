import api from './client';
import type { Estatus_venta } from '@/types/catalogo';

export async function getEstatus_ventas(): Promise<Estatus_venta[]> {
  const { data } = await api.get('/api/v1/admin/estatus-venta');
  return data;
}

export async function crearEstatus_venta(datos: { nombre: string; color: string; activo: boolean }): Promise<any> {
  const { data } = await api.post('/api/v1/admin/estatus-venta', datos);
  return data; 
}

export async function actualizarEstatus_venta(id: number, datos: { nombre?: string; color?: string; activo?: boolean }): Promise<any> {
  const { data } = await api.put(`/api/v1/admin/estatus-venta/${id}`, datos);
  return data;
}

export async function eliminarEstatus_venta(id: number): Promise<boolean> {
  await api.delete(`/api/v1/admin/estatus-venta/${id}`);
  return true;
}

export async function activarEstatus_venta(id: number): Promise<boolean> {
  await api.post(`/api/v1/admin/estatus-venta/${id}/activar`);
  return true;
}