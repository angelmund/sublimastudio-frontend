import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { API_URL } from '../lib/api/client';

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  loading: boolean;
  logoutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function silenciosoRefresco() {
      try {
        const res = await fetch(`${API_URL}/api/auth/token/refresh/`, {
          method: 'POST',
          credentials: 'include', // Envía la cookie HTTP-Only a Django
        });

        if (res.ok) {
          const data = await res.json();
          setAccessToken(data.access);
        } else {
          setAccessToken(null);
        }
      } catch {
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    }

    silenciosoRefresco();
  }, []);

  const logoutUser = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout/`, {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      setAccessToken(null);
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, loading, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};