import { useState, FormEvent } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { confirmPasswordReset } from '@/lib/api/auth';
import { useToast } from '@/context/ToastContext';
import axios from 'axios';

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validaciones disparando Toasts
    if (password !== confirmPassword) {
      showToast('Las contraseñas no coinciden.', 'error');
      return;
    }
    if (password.length < 8) {
      showToast('La contraseña debe tener al menos 8 caracteres.', 'error');
      return;
    }
    if (!email || !token) {
      showToast('Enlace inválido o expirado. Vuelve a solicitar la recuperación.', 'error');
      return;
    }

    setLoading(true);

    try {
      await confirmPasswordReset({
        token,
        email,
        password,
        password_confirmation: confirmPassword
      });
      
      setSuccess(true);
      showToast('¡Contraseña actualizada con éxito!', 'success');
      setTimeout(() => navigate('/login'), 3000);
      
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.data?.errors) {
         // Atrapamos errores de validación de Laravel (ej. la contraseña es débil)
         const primerError = Object.values(err.response.data.errors)[0] as string[];
         showToast(primerError[0], 'error');
      } else if (axios.isAxiosError(err) && err.response?.data?.message) {
         // Errores generales de Laravel (ej. Token inválido)
         showToast(err.response.data.message, 'error');
      } else {
         showToast('Ocurrió un error al restablecer la contraseña.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl border border-slate-200/80">
        <h1 className="mb-2 text-2xl font-black tracking-tight text-slate-900">Nueva Contraseña</h1>
        <p className="mb-6 text-sm text-slate-500">
          Ingresa tu nueva contraseña para <span className="font-semibold text-slate-700">{email}</span>.
        </p>

        {success ? (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
            ¡Contraseña actualizada con éxito! Redirigiendo al login...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-600">Nueva Contraseña</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-600">Confirmar Contraseña</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white shadow hover:bg-slate-800 disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Restablecer contraseña'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}