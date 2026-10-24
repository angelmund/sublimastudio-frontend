import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { requestPasswordReset } from '@/lib/api/auth';
import { useToast } from '@/context/ToastContext';
import axios from 'axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await requestPasswordReset(email);
      setSubmitted(true);
      showToast('Enlace enviado. Revisa tu bandeja de entrada.', 'success');
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        showToast(err.response.data.message, 'error');
      } else {
        showToast('Ocurrió un error al procesar la solicitud.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-slate-200/80 text-center">
        <h1 className="mb-2 text-2xl font-black tracking-tight text-slate-900">Recuperar Contraseña</h1>
        <p className="mb-6 text-sm text-slate-500">Ingresa tu correo y te enviaremos instrucciones.</p>

        {submitted ? (
          <div>
            <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
              Si el correo existe en nuestro sistema, hemos enviado un enlace de recuperación. Revisa tu bandeja o Mailtrap.
            </div>
            <Link to="/login" className="font-semibold text-slate-900 underline">Volver al login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-600">Correo electrónico</label>
              <input
                type="email"
                required
                placeholder="tucorreo@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white shadow transition-colors hover:bg-slate-800 disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Enviar enlace'}
            </button>
            <div className="mt-4 text-center">
              <Link to="/login" className="text-xs text-slate-500 hover:underline">Regresar al login</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}