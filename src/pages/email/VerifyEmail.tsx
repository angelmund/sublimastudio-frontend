import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { verifyEmail } from '@/lib/api/auth';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function VerificarCorreo() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [estado, setEstado] = useState<'cargando' | 'exito' | 'error'>('cargando');
  const peticionEnviada = useRef(false);

  useEffect(() => {
    // Obtenemos la URL firmada por Laravel que enviamos desde el AppServiceProvider
    const urlFirma = searchParams.get('url');

    if (!urlFirma) {
      setEstado('error');
      return;
    }

    if (peticionEnviada.current) return;
    peticionEnviada.current = true;

    verifyEmail(urlFirma)
      .then(() => {
        setEstado('exito');
        // Redirigir al Dashboard después de 2 segundos
        setTimeout(() => navigate('/admin'), 2000);
      })
      .catch(() => setEstado('error'));
  }, [searchParams, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl border border-slate-200/80">
        {estado === 'cargando' && (
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-flame-600 mb-4" />
            <h2 className="text-xl font-bold text-slate-900">Verificando tu cuenta...</h2>
          </div>
        )}
        
        {estado === 'exito' && (
          <div className="flex flex-col items-center animate-fade-in">
            <CheckCircle className="h-12 w-12 text-emerald-500 mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">¡Cuenta verificada!</h2>
            <p className="text-slate-500 text-sm">Redirigiendo a tu panel de control...</p>
          </div>
        )}

        {estado === 'error' && (
          <div className="flex flex-col items-center animate-fade-in">
            <XCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Enlace inválido o expirado</h2>
            <p className="text-slate-500 text-sm mb-6">No se pudo verificar el correo. Es posible que el enlace ya haya sido utilizado.</p>
            <button onClick={() => navigate('/login')} className="btn-primary">
              Ir al inicio de sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
}