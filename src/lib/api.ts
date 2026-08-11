import type { ProductoConCategoria, Categoria } from '@/types/catalogo';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function normalizarProducto(p: any): ProductoConCategoria {
  // Extraemos material y medidas de los atributos dinámicos de Django
  const materialAtributo = p.atributos?.find((a: any) => 
    a.atributo_nombre?.toLowerCase() === 'material'
  )?.valor;

  const medidasAtributo = p.atributos?.find((a: any) => 
    a.atributo_nombre?.toLowerCase() === 'medidas' || a.atributo_nombre?.toLowerCase() === 'capacidad'
  )?.valor;

  return {
    id: p.id,
    slug: p.id.toString(),
    nombre: p.nombre,
    descripcion: p.descripcion,
    
    // Precios
    precio: parseFloat(p.precio_base) || 0,
    precio_oferta: p.precio_oferta ? parseFloat(p.precio_oferta) : null,
    precio_final: parseFloat(p.precio_final) || parseFloat(p.precio_base) || 0,
    
    // Inventario
    stock: parseInt(p.stock, 10) || 0,
    
    // Media & Estado
    imagen_url: p.imagen ? (p.imagen.startsWith('http') ? p.imagen : `${API_URL}${p.imagen}`) : undefined,
    disponible: p.activo,
    
    // Atributos dinámicos extraídos
    material: materialAtributo,
    medidas: medidasAtributo,
    created_at: p.created_at || new Date().toISOString(),
    
    // Categoría
    categoria: p.categoria ? { 
      id: p.categoria, 
      nombre: p.categoria_nombre, 
      slug: p.categoria.toString() 
    } : undefined,
    
    atributos: p.atributos || []
  };
}

export async function getProductos(): Promise<ProductoConCategoria[]> {
  const res = await fetch(`${API_URL}/api/catalogo/productos/`);
  if (!res.ok) throw new Error('No se pudo cargar el catálogo.');
  const data = await res.json();
  return data.map(normalizarProducto);
}

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
    imagen_url: c.imagen
      ? c.imagen.startsWith('http')
        ? c.imagen
        : `${API_URL}${c.imagen}`
      : undefined,
  }));
}

export async function getProductoBySlug(slug: string): Promise<ProductoConCategoria | null> {
  // Como en Django la lista de productos nos da la data completa,
  // buscamos el producto por ID/slug en el catálogo
  const productos = await getProductos();
  return productos.find((p) => p.slug === slug || p.id.toString() === slug) || null;
}

export async function getProductosByCategoria(categoriaSlug: string): Promise<ProductoConCategoria[]> {
  const productos = await getProductos();
  return productos.filter((p) => p.categoria?.slug === categoriaSlug || p.categoria?.id.toString() === categoriaSlug);
}

export async function getCategoriasDestacadas(): Promise<Categoria[]> {
  const categorias = await getCategorias();
  return categorias.slice(0, 4); // Muestra las primeras 4
}

export async function getProductosDestacados(limit = 8): Promise<ProductoConCategoria[]> {
  const productos = await getProductos();
  return productos.slice(0, limit); // Muestra los primeros productos
}
export async function crearProducto(formData: FormData): Promise<ProductoConCategoria> {
  const res = await fetch(`${API_URL}/api/catalogo/productos/`, {
    method: 'POST',
    body: formData, // FormData envía automáticamente multipart/form-data
  });
  if (!res.ok) throw new Error('Error al crear el producto.');
  const data = await res.json();
  return normalizarProducto(data);
}

export async function actualizarProducto(id: number, formData: FormData): Promise<ProductoConCategoria> {
  const res = await fetch(`${API_URL}/api/catalogo/productos/${id}/`, {
    method: 'PATCH', // Usamos PATCH para actualizar solo los campos enviados
    body: formData,
  });
  if (!res.ok) throw new Error('Error al actualizar el producto.');
  const data = await res.json();
  return normalizarProducto(data);
}

export async function eliminarProducto(id: number): Promise<boolean> {
  const res = await fetch(`${API_URL}/api/catalogo/productos/${id}/`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error al eliminar el producto.');
  return true;
}

export async function enviarMensaje(datos: {
  nombre: string;
  email: string;
  asunto: string | null;
  mensaje: string;
}): Promise<boolean> {
  // Aquí harás el POST a Django para guardar o enviar la duda por correo
  console.log('Enviando mensaje a Django backend:', datos);
  return new Promise((resolve) => setTimeout(resolve, 800));
}

export async function crearCategoria(formData: FormData): Promise<Categoria> {
  const res = await fetch(`${API_URL}/api/catalogo/categorias/`, {
    method: 'POST',
    body: formData, // Envia multipart/form-data
  });
  if (!res.ok) throw new Error('Error al crear la categoría.');
  const c = await res.json();
  return {
    id: c.id,
    nombre: c.nombre,
    slug: c.id.toString(),
    descripcion: c.descripcion,
    disponible: c.activo,
    imagen_url: c.imagen ? `${API_URL}${c.imagen}` : undefined,
  };
}

export async function actualizarCategoria(
  id: number,
  formData: FormData
): Promise<Categoria> {
  const res = await fetch(`${API_URL}/api/catalogo/categorias/${id}/`, {
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
    imagen_url: c.imagen ? `${API_URL}${c.imagen}` : undefined,
  };
}

export async function eliminarCategoria(id: number): Promise<boolean> {
  const res = await fetch(`${API_URL}/api/catalogo/categorias/${id}/`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error al eliminar la categoría.');
  return true;
}