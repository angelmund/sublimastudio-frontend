import { Link, Outlet, useLocation } from 'react-router-dom';
import { Flame, Package, FolderTree, ShoppingBag, LayoutDashboard, ExternalLink } from 'lucide-react';

const navegacion = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/productos', label: 'Productos', icon: Package },
  { to: '/admin/categorias', label: 'Categorías', icon: FolderTree },
  { to: '/admin/pedidos', label: 'Pedidos', icon: ShoppingBag },
];

export function AdminLayout() {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen bg-sand-50">
      {/* Sidebar Lateral */}
      <aside className="w-64 border-r border-ink-100 bg-white p-6 hidden md:flex md:flex-col justify-between">
        <div>
          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-flame-500 to-flame-600 text-white shadow-sm">
              <Flame className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <span className="text-lg font-bold tracking-tight text-ink-900">
              Sublima<span className="text-flame-600">Admin</span>
            </span>
          </Link>

          {/* Menú de Navegación */}
          <nav className="space-y-1">
            {navegacion.map((item) => {
              const activo = pathname === item.to;
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all ${
                    activo
                      ? 'bg-flame-50 text-flame-700 shadow-sm'
                      : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${activo ? 'text-flame-600' : 'text-ink-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Ir al sitio público */}
        <Link
          to="/"
          target="_blank"
          className="flex items-center justify-center gap-2 rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-xs font-semibold text-ink-700 hover:bg-ink-50 transition-colors"
        >
          Ver tienda en vivo <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}