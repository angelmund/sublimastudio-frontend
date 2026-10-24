import api from './client'; // Tu nueva instancia de Axios
import type { Categoria } from '@/types/catalogo';

// ==========================================
// RUTAS PÚBLICAS (No requieren autenticación)
// ==========================================
export async function getCategorias(): Promise<Categoria[]> {
  const { data } = await api.get('/api/v1/categorias');
  
  return data.map((c: any) => ({
    id: c.id,
    nombre: c.nombre,
    // Ahora toma el slug real de la BD, y solo usa el ID si ocurriera un error
    slug: c.slug || c.id.toString(), 
    descripcion: c.descripcion,
    disponible: c.activo ?? true,
    imagen: c.imagen 
      ? (c.imagen.startsWith('http') ? c.imagen : `${api.defaults.baseURL}${c.imagen}`) 
      : undefined,
  }));
}

export async function getCategoriasDestacadas(): Promise<Categoria[]> {
  const categorias = await getCategorias();
  return categorias.slice(0, 4);
}

// ==========================================
// RUTAS ADMIN (Protegidas automáticamente por Sanctum/Breeze)
// ==========================================
export async function crearCategoria(formData: FormData): Promise<Categoria> {
  // Axios envía la cookie de sesión y el token CSRF automáticamente
  const { data } = await api.post('/api/v1/admin/categorias', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
}

export async function actualizarCategoria(id: number, formData: FormData): Promise<Categoria> {
  // Para Laravel, cuando envías FormData (archivos) en actualización, 
  // a veces es mejor usar POST y agregar el _method: 'PATCH' dentro del formData.
  const { data } = await api.post(`/api/v1/admin/categorias/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function eliminarCategoria(id: number): Promise<boolean> {
  await api.delete(`/api/v1/admin/categorias/${id}`);
  return true;
}