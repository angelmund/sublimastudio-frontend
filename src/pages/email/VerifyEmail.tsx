import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { verifyEmail } from '@/lib/api';

export default function VerifyEmail() {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (uid && token) {
      verifyEmail(uid, token)
        .then((res) => {
          setStatus('success');
          setMessage(res.message || 'Tu cuenta ha sido verificada exitosamente.');
        })
        .catch((err) => {
          setStatus('error');
          setMessage(err.message || 'El enlace de verificación es inválido o ha expirado.');
        });
    }
  }, [uid, token]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-slate-200/80 text-center">
        {status === 'loading' && <p className="text-slate-600 font-medium">Verificando tu cuenta...</p>}
        {status === 'success' && (
          <div>
            <h2 className="text-xl font-bold text-emerald-600 mb-2">¡Cuenta Verificada!</h2>
            <p className="text-sm text-slate-600 mb-6">{message}</p>
            <Link to="/login" className="rounded-lg bg-slate-900 px-5 py-2.5 font-semibold text-white shadow hover:bg-slate-800">
              Iniciar Sesión
            </Link>
          </div>
        )}
        {status === 'error' && (
          <div>
            <h2 className="text-xl font-bold text-red-600 mb-2">Error de Verificación</h2>
            <p className="text-sm text-slate-600 mb-6">{message}</p>
            <Link to="/login" className="text-slate-900 font-semibold underline">
              Volver al inicio
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}