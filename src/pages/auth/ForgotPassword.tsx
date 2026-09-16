import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { requestPasswordReset } from '@/lib/api/auth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await requestPasswordReset(email);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-slate-200/80 text-center">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-2">Recuperar Contraseña</h1>
        <p className="text-sm text-slate-500 mb-6">Ingresa tu correo y te enviaremos instrucciones.</p>

        {submitted ? (
          <div>
            <div className="mb-6 rounded-lg bg-emerald-50 p-4 text-sm font-medium text-emerald-700 border border-emerald-200">
              Si el correo existe en nuestro sistema, hemos enviado un enlace de recuperación. Revisa tu bandeja o Mailtrap.
            </div>
            <Link to="/login" className="text-slate-900 font-semibold underline">Volver al login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">{error}</div>}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Correo electrónico</label>
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
              className="w-full rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white shadow hover:bg-slate-800 disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Enviar enlace'}
            </button>
            <div className="text-center mt-4">
              <Link to="/login" className="text-xs text-slate-500 hover:underline">Regresar al login</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}