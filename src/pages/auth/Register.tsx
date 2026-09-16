import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { register } from '@/lib/api';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validarFormulario = (): boolean => {
    if (!username.trim()) {
      setError('Por favor, ingresa un nombre de usuario.');
      return false;
    }
    if (username.trim().length < 3) {
      setError('El usuario debe tener al menos 3 caracteres.');
      return false;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Ingresa un correo electrónico válido.');
      return false;
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return false;
    }
    if (password !== passwordConfirm) {
      setError('Las contraseñas no coinciden.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!validarFormulario()) return;

    setLoading(true);
    try {
      await register({ username, email, password, password_confirm: passwordConfirm });
      setSuccessMessage('¡Cuenta creada exitosamente! Se ha enviado un correo de verificación, por favor revisa tu bandeja de entrada y sigue las instrucciones.');
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al registrar la cuenta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-slate-200/80">
        
        {/* Encabezado */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Crear Cuenta</h1>
          <p className="mt-1 text-sm text-slate-500">Regístrate en Expresión Sublime</p>
        </div>

        {/* Alerta de Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 p-4 border border-red-200/80 text-red-700 text-sm">
            <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="font-medium">{error}</div>
          </div>
        )}

        {/* Mensaje de Éxito y Acción */}
        {successMessage ? (
          <div className="text-center space-y-6">
            <div className="flex items-start gap-3 rounded-xl bg-emerald-50 p-4 border border-emerald-200/80 text-emerald-800 text-sm text-left">
              <svg className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="font-medium">{successMessage}</div>
            </div>
            
            <Link
              to="/login"
              className="inline-block w-full rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white shadow-md hover:bg-slate-800 transition-all text-center"
            >
              Ir a Iniciar Sesión
            </Link>
          </div>
        ) : (
          /* Formulario */
          <form onSubmit={handleSubmit} noValidate={true} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Usuario
              </label>
              <input
                type="text"
                placeholder="Ej. juanperez"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 shadow-sm transition-all focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 shadow-sm transition-all focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 shadow-sm transition-all focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 shadow-sm transition-all focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white shadow-md hover:bg-slate-800 disabled:opacity-50 transition-all focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-slate-600">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-semibold text-slate-900 hover:underline">
            Inicia sesión
          </Link>
        </div>

      </div>
    </div>
  );
}