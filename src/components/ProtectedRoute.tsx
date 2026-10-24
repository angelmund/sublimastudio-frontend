import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

export function ProtectedRoute({ requiereAdmin = false }: { requiereAdmin?: boolean }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-slate-900" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si la ruta exige ser admin, revisamos los roles de Spatie
  if (requiereAdmin) {
    const esAdmin = user?.roles?.some((rol: any) => rol.name === 'admin');
    if (!esAdmin) {
      // Si es un cliente intentando entrar al admin, lo pateamos al inicio
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
}