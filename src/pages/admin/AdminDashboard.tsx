import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getDashboardStats, DashboardStats } from '@/lib/api/admin';
import StatsCard from '@/components/StatsCard';
import { Package, FolderTree, UsersRound, AlertTriangle } from 'lucide-react';
import { ROUTES, adminProductosFiltro } from '@/config/routes';

export default function AdminDashboard() {
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats(accessToken)
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [accessToken]);

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
          onClick={() => navigate(adminProductosFiltro.stockCritico())}
        />
      </div>
    </div>
  );
}