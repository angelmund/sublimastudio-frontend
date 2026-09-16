import { API_URL, fetchWithAuth } from './client';
import type { Categoria } from '@/types/catalogo';

export async function getCategorias(): Promise<Categoria[]> {
  const res = await fetch(`${API_URL}/api/catalogo/categorias/`);
  if (!res.ok) throw new Error('No se pudieron cargar las categorías.');
  const data = await res.json();
  return data.map((c: any) => ({
    id: c.id,
    nombre: c.nombre,
    slug: c.id.toString(),
    descripcion: c.descripcion,
    disponible: c.activo ?? true,
    imagen: c.imagen
      ? c.imagen.startsWith('http')
        ? c.imagen
        : `${API_URL}${c.imagen}`
      : undefined,
  }));
}

export async function getCategoriasDestacadas(): Promise<Categoria[]> {
  const categorias = await getCategorias();
  return categorias.slice(0, 4);
}

export async function crearCategoria(formData: FormData, token?: string | null): Promise<Categoria> {
  const res = await fetchWithAuth('/api/catalogo/categorias/', {
    method: 'POST',
    body: formData,
  }, token);
  
  if (!res.ok) throw new Error('Error al crear la categoría.');
  const c = await res.json();
  return {
    id: c.id,
    nombre: c.nombre,
    slug: c.id.toString(),
    descripcion: c.descripcion,
    disponible: c.activo,
    imagen: c.imagen ? `${API_URL}${c.imagen}` : undefined,
  };
}

export async function actualizarCategoria(id: number, formData: FormData): Promise<Categoria> {
  const res = await fetchWithAuth(`/api/catalogo/categorias/${id}/`, {
    method: 'PATCH',
    body: formData,
  });
  if (!res.ok) throw new Error('Error al actualizar la categoría.');
  const c = await res.json();
  return {
    id: c.id,
    nombre: c.nombre,
    slug: c.id.toString(),
    descripcion: c.descripcion,
    disponible: c.activo,
    imagen: c.imagen ? `${API_URL}${c.imagen}` : undefined,
  };
}

export async function eliminarCategoria(id: number): Promise<boolean> {
  const res = await fetchWithAuth(`/api/catalogo/categorias/${id}/`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error al eliminar la categoría.');
  return true;
}

export async function enviarMensaje(datos: {
  nombre: string;
  email: string;
  asunto: string | null;
  mensaje: string;
}): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  console.log('Mensaje enviado:', datos);
  return true;
}