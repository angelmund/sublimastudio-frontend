import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getDashboardStats, DashboardStats } from '@/lib/api/admin';
import StatsCard from '@/components/StatsCard';
import { ShoppingBag, Package, FolderTree, UsersRound, AlertTriangle } from 'lucide-react';
import { ROUTES, adminProductosFiltro } from '@/config/routes';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. CORRECCIÓN: Permitimos que 'admin' y 'user' vean el panel
  const tieneAccesoPanel = useMemo(() => {
    return user?.roles?.some((rol: any) => ['admin', 'user'].includes(rol.name));
  }, [user]);

  useEffect(() => {
    if (!tieneAccesoPanel) {
      setLoading(false);
      return;
    }

    getDashboardStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [tieneAccesoPanel]);

  // VISTA PARA CLIENTES
  if (!tieneAccesoPanel) {
    return (
      <div className="mx-auto w-full max-w-5xl space-y-8 p-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div onClick={() => navigate('/admin/compras')} className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Mis Compras</h3>
            <p className="mt-1 text-sm text-slate-500">Rastrea tus pedidos y revisa tu historial.</p>
          </div>
          
          <div onClick={() => navigate('/articulos')} className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-flame-300 hover:shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-flame-50 text-flame-600 transition-colors group-hover:bg-flame-100">
              <Package className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Nuevo Pedido</h3>
            <p className="mt-1 text-sm text-slate-500">Explora nuestro catálogo de personalización.</p>
          </div>

          <div onClick={() => navigate('/contacto')} className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-emerald-300 hover:shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-100">
              <UsersRound className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Soporte</h3>
            <p className="mt-1 text-sm text-slate-500">¿Tienes dudas con tu diseño? Contáctanos.</p>
          </div>
        </div>
      </div>
    );
  }

  // VISTA PARA ADMINISTRADORES / STAFF
  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Panel de Control</h1>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          label="Total Productos"
          value={stats?.total_productos ?? 0}
          color="blue"
          icon={<Package className="h-5 w-5" strokeWidth={2.2} />}
          loading={loading}
          onClick={() => navigate(ROUTES.admin.productos)}
        />
        <StatsCard
          label="Categorías"
          value={stats?.total_categorias ?? 0}
          color="violet"
          icon={<FolderTree className="h-5 w-5" strokeWidth={2.2} />}
          loading={loading}
          onClick={() => navigate(ROUTES.admin.categorias)}
        />
        <StatsCard
          label="Usuarios Registrados"
          value={stats?.total_usuarios ?? 0}
          color="emerald"
          icon={<UsersRound className="h-5 w-5" strokeWidth={2.2} />}
          loading={loading}
          onClick={() => navigate(ROUTES.admin.usuarios)}
        />
        <StatsCard
          label="Stock Crítico (≤ 5)"
          value={stats?.productos_bajo_stock ?? 0}
          color="rose"
          icon={<AlertTriangle className="h-5 w-5" strokeWidth={2.2} />}
          loading={loading}
          onClick={() => navigate(adminProductosFiltro?.stockCritico ? adminProductosFiltro.stockCritico() : '/admin/productos')}
        />
      </div>
    </div>
  );
}