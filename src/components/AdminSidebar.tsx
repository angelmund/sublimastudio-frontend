import { useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Flame,
  Package,
  FolderTree,
  ShoppingBag,
  LayoutDashboard,
  ExternalLink,
  LogOut,
  UsersRound,
  X,
  ChevronsLeft,
  ChevronsRight,
  User as UserIcon
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// 1. EL DICCIONARIO DE RUTAS (Single Source of Truth)
// Cada opción declara un arreglo 'roles'. Si el usuario tiene alguno de esos roles, la ve.
const MENU_ITEMS = [
  // --- Rutas de Administrador ---
  { to: '/admin',             label: 'Dashboard',  icon: LayoutDashboard, roles: ['admin'] },
  { to: '/admin/productos',   label: 'Productos',  icon: Package,         roles: ['admin'] },
  { to: '/admin/categorias',  label: 'Categorías', icon: FolderTree,      roles: ['admin'] },
  { to: '/admin/pedidos',     label: 'Pedidos',    icon: ShoppingBag,     roles: ['admin', 'vendedor'] }, // Ejemplo de multi-rol
  { to: '/admin/usuarios',    label: 'Usuarios',   icon: UsersRound,      roles: ['admin'] },

  // --- Rutas de Cliente ---
  { to: '/admin',             label: 'Mi Perfil',   icon: UserIcon,       roles: ['cliente'] },
  { to: '/admin/compras',     label: 'Mis Compras', icon: ShoppingBag,    roles: ['cliente'] },
];

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function AdminSidebar({
  open,
  onClose,
  collapsed,
  onToggleCollapse,
}: AdminSidebarProps) {
  const { pathname } = useLocation();
  const { user, logoutUser } = useAuth();

  // 2. Extraemos los roles del usuario en un arreglo simple (ej: ['cliente'])
  const userRoles = useMemo(() => {
    return user?.roles?.map((rol: any) => rol.name) || [];
  }, [user]);

  // 3. Filtramos el menú dinámicamente: 
  // "Muéstrame los items donde al menos uno de los roles requeridos coincida con mis roles"
  const navegacion = useMemo(() => {
    return MENU_ITEMS.filter((item) =>
      item.roles.some((rolRequerido) => userRoles.includes(rolRequerido))
    );
  }, [userRoles]);

  

  useEffect(() => { onClose(); /* eslint-disable-next-line */ }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex shrink-0 flex-col justify-between border-r border-slate-200 bg-white select-none
          transition-[transform,width,padding] duration-300 ease-in-out
          md:relative md:z-40 md:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full'}
          ${collapsed ? 'md:w-20 md:p-4' : 'md:w-64 md:p-6'}
          w-64 p-6`}
      >
        <div className="min-w-0">
          <div
            className={`mb-8 flex items-center gap-2
              ${collapsed ? 'md:flex-col md:items-center md:gap-3' : 'justify-between'}`}
          >
            <Link to="/" className="flex min-w-0 items-center gap-2">
              <span
                className={`truncate text-lg font-bold tracking-tight text-slate-900
                  ${collapsed ? 'md:hidden' : ''}`}
              >
                <div className="rounded-full bg-slate-100 p-6">
                  <UserIcon className="h-12 w-12 text-slate-400" />
                </div>
              </span>
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 md:hidden"
            >
              <X className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 md:inline-flex cursor-pointer"
            >
              {collapsed ? (
                <ChevronsRight className="h-5 w-5" />
              ) : (
                <ChevronsLeft className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* ---------- Navegación Dinámica ---------- */}
          <nav className="space-y-1">
            {navegacion.map((item) => {
              const activo =
                item.to === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.to);
              const Icon = item.icon;

              return (
                <Link
                  key={item.to + item.label}
                  to={item.to}
                  className={`group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all
                    ${collapsed ? 'md:justify-center md:px-0' : ''}
                    ${
                      activo
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      activo ? 'text-white' : 'text-slate-400'
                    }`}
                  />
                  <span className={`truncate ${collapsed ? 'md:hidden' : ''}`}>
                    {item.label}
                  </span>

                  {collapsed && (
                    <span
                      role="tooltip"
                      className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 hidden -translate-y-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 md:block"
                    >
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-2">
          <Link
            to="/"
            target="_blank"
            className={`flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50
              ${collapsed ? 'md:px-0' : ''}`}
          >
            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
            <span className={collapsed ? 'md:hidden' : ''}>
              Ver tienda
            </span>
          </Link>

          <button
            type="button"
            onClick={logoutUser}
            className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50/50 px-4 py-2.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100/80
              ${collapsed ? 'md:px-0' : ''}`}
          >
            <LogOut className="h-3.5 w-3.5 shrink-0" />
            <span className={collapsed ? 'md:hidden' : ''}>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}