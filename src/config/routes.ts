/**
 * Fuente única de verdad para todas las rutas de la app.
 * - Rutas estáticas: string literal.
 * - Rutas con parámetros: función que recibe el param y devuelve la URL.
 * - Rutas con query: se construyen con URLSearchParams dentro del helper.
 * Si crece el proyecto, se puede separar en varios archivos y exportar un objeto por cada módulo.
 * Se recomienda usar siempre estas rutas en lugar de strings hardcodeados.
 */
export const ROUTES = {
  // ---------- Públicas ----------
  home: '/',
  articulos: '/articulos',
  articuloDetalle: (slug: string) => `/articulos/${slug}`,
  contacto: '/contacto',
  sobreNosotros: '/sobre-nosotros',
  noEncontrado: '/404',

  // ---------- Auth ----------
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  verifyEmail: '/verify-email',

  // ---------- Admin ----------
  admin: {
    root: '/admin',
    productos: '/admin/productos',
    productoDetalle: (id: string | number) => `/admin/productos/${id}`,
    productosConFiltro: (filtros: Record<string, string | number>) =>
      `/admin/productos?${new URLSearchParams(
        Object.entries(filtros).map(([k, v]) => [k, String(v)]),
      ).toString()}`,
    categorias: '/admin/categorias',
    pedidos: '/admin/pedidos',
    usuarios: '/admin/usuarios',
  },
} as const;

/* Helper opcional para rutas de admin con filtros comunes */
export const adminProductosFiltro = {
  stockCritico: () => ROUTES.admin.productosConFiltro({ stock: 'critico' }),
};