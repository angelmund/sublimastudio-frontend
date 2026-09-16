import { API_URL, fetchWithAuth } from './client';
import type { ProductoConCategoria } from '@/types/catalogo';

function normalizarProducto(p: any): ProductoConCategoria {
  const materialAtributo = p.atributos?.find(
    (a: any) => a.atributo_nombre?.toLowerCase() === 'material'
  )?.valor;

  const medidasAtributo = p.atributos?.find(
    (a: any) => a.atributo_nombre?.toLowerCase() === 'medidas' || a.atributo_nombre?.toLowerCase() === 'capacidad'
  )?.valor;

  return {
    id: p.id,
    slug: p.id.toString(),
    nombre: p.nombre,
    descripcion: p.descripcion,
    precio: parseFloat(p.precio_base) || 0,
    precio_oferta: p.precio_oferta ? parseFloat(p.precio_oferta) : null,
    precio_final: parseFloat(p.precio_final) || parseFloat(p.precio_base) || 0,
    stock: parseInt(p.stock, 10) || 0,
    imagen: p.imagen ? (p.imagen.startsWith('http') ? p.imagen : `${API_URL}${p.imagen}`) : undefined,
    disponible: p.activo,
    material: materialAtributo,
    medidas: medidasAtributo,
    created_at: p.created_at || new Date().toISOString(),
    categoria: p.categoria
      ? {
          id: p.categoria,
          nombre: p.categoria_nombre,
          slug: p.categoria.toString(),
        }
      : undefined,
    atributos: p.atributos || [],
  };
}

export async function getProductos(): Promise<ProductoConCategoria[]> {
  const res = await fetch(`${API_URL}/api/catalogo/productos/`);
  if (!res.ok) throw new Error('No se pudo cargar el catálogo.');
  const data = await res.json();
  return data.map(normalizarProducto);
}

export async function getProductoBySlug(slug: string): Promise<ProductoConCategoria | null> {
  const productos = await getProductos();
  return productos.find((p) => p.slug === slug || p.id.toString() === slug) || null;
}

export async function getProductosByCategoria(categoriaSlug: string): Promise<ProductoConCategoria[]> {
  const productos = await getProductos();
  return productos.filter(
    (p) => p.categoria?.slug === categoriaSlug || p.categoria?.id.toString() === categoriaSlug
  );
}

export async function getProductosDestacados(limit = 8): Promise<ProductoConCategoria[]> {
  const productos = await getProductos();
  return productos.slice(0, limit);
}

export async function crearProducto(formData: FormData): Promise<ProductoConCategoria> {
  const res = await fetchWithAuth('/api/catalogo/productos/', {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Error al crear el producto.');
  const data = await res.json();
  return normalizarProducto(data);
}

export async function actualizarProducto(id: number, formData: FormData): Promise<ProductoConCategoria> {
  const res = await fetchWithAuth(`/api/catalogo/productos/${id}/`, {
    method: 'PATCH',
    body: formData,
  });
  if (!res.ok) throw new Error('Error al actualizar el producto.');
  const data = await res.json();
  return normalizarProducto(data);
}

export async function eliminarProducto(id: number): Promise<boolean> {
  const res = await fetchWithAuth(`/api/catalogo/productos/${id}/`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error al eliminar el producto.');
  return true;
}