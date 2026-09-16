import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const ProtectedRoute = () => {
const { accessToken, loading } = useAuth();

  // Esperar a que el AuthContext termine de intentar refrescar sesión
  if (loading) {
    return <div className="p-8 text-center text-ink-500">Verificando sesión...</div>;
  }

  // Si no hay token de acceso en memoria (después de logout o sin iniciar sesión), expulsar a /login
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};