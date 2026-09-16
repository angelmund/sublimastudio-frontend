import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '@/lib/api';
import { useAuth } from '@/context/AuthContext'; // Importamos el hook del contexto

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { setAccessToken } = useAuth(); // Extraemos la función para guardar el token en memoria

  const validarFormulario = (): boolean => {
    if (username.trim().length < 3) {
      setError('El usuario debe tener al menos 3 caracteres.');
      return false;
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return false;
    }
    const tieneAlfanumericoEspecial = /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    if (!tieneAlfanumericoEspecial) {
      setError('La contraseña debe incluir al menos un número o carácter especial.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validarFormulario()) return;

    setLoading(true);
    try {
      // Recibimos la respuesta que contiene { access: '...' }
      const res = await login(username, password);
      
      // Guardamos el Access Token en el estado de React
      setAccessToken(res.access);

      // Redirigimos a la ruta protegida
      navigate('/admin/productos');
    } catch (err: any) {
      setError('Usuario o contraseña incorrectos. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-slate-200/80">
        
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Expresión Sublime
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Panel de Administración
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-700 border border-red-200/60 transition-all">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Usuario
            </label>
            <input
              type="text"
              required
              placeholder="Ingresa tu usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 shadow-sm transition-all focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Contraseña
              </label>
              <Link to="/forgot-password" className="text-xs text-slate-500 hover:text-slate-900 underline transition-colors">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 shadow-sm transition-all focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white shadow-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:opacity-50 transition-all"
          >
            {loading ? 'Validando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          ¿No tienes una cuenta?{' '}
          <Link to="/register" className="font-semibold text-slate-900 hover:underline">
            Regístrate aquí
          </Link>
        </div>

      </div>
    </div>
  );
}