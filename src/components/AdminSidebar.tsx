import { useEffect } from 'react';
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
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const navegacion = [
  { to: '/admin',             label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/admin/productos',   label: 'Productos',  icon: Package },
  { to: '/admin/categorias',  label: 'Categorías', icon: FolderTree },
  { to: '/admin/pedidos',     label: 'Pedidos',    icon: ShoppingBag },
  { to: '/admin/usuarios',    label: 'Usuarios',   icon: UsersRound },
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
  const { logoutUser } = useAuth();

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
          {/* ---------- Header: logo + toggle ---------- */}
          <div
            className={`mb-8 flex items-center gap-2
              ${collapsed ? 'md:flex-col md:items-center md:gap-3' : 'justify-between'}`}
          >
            <Link to="/" className="flex min-w-0 items-center gap-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
                <Flame className="h-5 w-5" strokeWidth={2.5} />
              </span>
              <span
                className={`truncate text-lg font-bold tracking-tight text-slate-900
                  ${collapsed ? 'md:hidden' : ''}`}
              >
                Admin Panel
              </span>
            </Link>

            {/* Cerrar (solo móvil) */}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 md:hidden"
              aria-label="Cerrar menú"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Colapsar (solo desktop) */}
            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 md:inline-flex cursor-pointer"
              aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
              title={collapsed ? 'Expandir menú' : 'Colapsar menú'}
            >
              {collapsed ? (
                <ChevronsRight className="h-5 w-5" />
              ) : (
                <ChevronsLeft className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* ---------- Navegación ---------- */}
          <nav className="space-y-1">
            {navegacion.map((item) => {
              const activo =
                item.to === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.to);
              const Icon = item.icon;

              return (
                <Link
                  key={item.to}
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

        {/* ---------- Footer ---------- */}
        <div className="space-y-2">
          <Link
            to="/"
            target="_blank"
            title={collapsed ? 'Ver tienda en vivo' : undefined}
            className={`flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50
              ${collapsed ? 'md:px-0' : ''}`}
          >
            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
            <span className={collapsed ? 'md:hidden' : ''}>
              Ver tienda en vivo
            </span>
          </Link>

          <button
            type="button"
            onClick={logoutUser}
            title={collapsed ? 'Cerrar sesión' : undefined}
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