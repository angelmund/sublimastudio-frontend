import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api/client';
import { logout } from '@/lib/api/auth';

// 1. Agregamos logoutUser a la interfaz
interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  loading: boolean;
  checkAuth: () => Promise<void>;
  logoutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const { data } = await api.get('/api/user');
      setUser(data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 2. Metemos la función DENTRO del AuthProvider
  const logoutUser = async () => {
    try {
      await logout(); 
    } catch (error) {
      console.error("Error al cerrar sesión en el servidor", error);
    } finally {
      setUser(null); // Esto automáticamente hará que isAuthenticated sea false
      window.location.href = '/login'; 
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    // 3. Exponemos logoutUser en el Provider
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      loading, 
      checkAuth,
      logoutUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};