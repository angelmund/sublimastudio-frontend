import api from './client';
import type { ProductoConCategoria } from '@/types/catalogo';

function normalizarProducto(p: any): ProductoConCategoria {
  const materialAtributo = p.atributos?.find(
    (a: any) => a.atributo_nombre?.toLowerCase() === 'material'
  )?.valor;

  const medidasAtributo = p.atributos?.find(
    (a: any) => a.atributo_nombre?.toLowerCase() === 'medidas' || a.atributo_nombre?.toLowerCase() === 'capacidad'
  )?.valor;

  const precioBase = parseFloat(p.precio_base) || 0;
  const precioDescuento = p.precio_descuento ? parseFloat(p.precio_descuento) : null;
  
  const precioFinalCalculado = p.precio_final !== undefined 
    ? parseFloat(p.precio_final) 
    : (precioDescuento || precioBase);

  const stockReal = p.stock !== undefined ? parseInt(p.stock, 10) : (p.activo ? 10 : 0);

  const catId = p.categoria?.id ?? p.categoria_id ?? p.id_categoria ?? (typeof p.categoria !== 'object' ? p.categoria : null);
  const catNombre = p.categoria?.nombre ?? p.categoria_nombre ?? 'Categoría';

  return {
    id: p.id,
    slug: p.id.toString(),
    nombre: p.nombre,
    descripcion: p.descripcion,
    precio: precioBase,
    precio_oferta: precioDescuento,
    precio_final: precioFinalCalculado,
    stock: stockReal, 
    imagen: p.imagen 
      ? (p.imagen.startsWith('http') ? p.imagen : `${api.defaults.baseURL}/${p.imagen.replace(/^\//, '')}`) 
      : undefined,
    disponible: p.activo ?? true,
    material: materialAtributo,
    medidas: medidasAtributo,
    created_at: p.created_at || new Date().toISOString(),
    
    categoria: catId
      ? {
          id: parseInt(catId, 10),
          nombre: catNombre,
          slug: catId.toString(),
        }
      : undefined,
    atributos: p.atributos || [],
  };
}

// ==========================================
// RUTAS PÚBLICAS (No requieren autenticación)
// ==========================================
export async function getProductos(): Promise<ProductoConCategoria[]> {
  const { data } = await api.get('/api/v1/articulos');
  return data.map(normalizarProducto);
}

export async function getProductoBySlug(slug: string): Promise<ProductoConCategoria | null> {
  // Opcional: Si tu API soporta buscar por ID directo, podrías hacer api.get(`/api/v1/articulos/${slug}`)
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

// ==========================================
// RUTAS ADMIN (Protegidas por Sanctum)
// ==========================================
export async function getAdminProductos(): Promise<ProductoConCategoria[]> {
  const { data } = await api.get('/api/v1/admin/articulos');
  return data.map(normalizarProducto);
}

export async function crearProducto(formData: FormData): Promise<ProductoConCategoria> {
  const { data } = await api.post('/api/v1/admin/articulos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return normalizarProducto(data);
}

export async function actualizarProducto(id: number, formData: FormData): Promise<ProductoConCategoria> {
  
  const { data } = await api.post(`/api/v1/admin/articulos/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return normalizarProducto(data);
}

export async function eliminarProducto(id: number): Promise<boolean> {
  await api.delete(`/api/v1/admin/articulos/${id}`);
  return true;
}