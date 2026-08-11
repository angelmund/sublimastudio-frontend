import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NoEncontrado() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-7xl font-extrabold text-flame-600">404</p>
      <h1 className="mt-4 text-3xl font-bold">Página no encontrada</h1>
      <p className="mt-2 max-w-md text-ink-500">
        Lo sentimos, la página que buscas no existe o se ha movido de sitio.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link to="/" className="btn-primary">
          <Home className="h-4 w-4" /> Ir al inicio
        </Link>
        <Link to="/articulos" className="btn-secundario">
          <ArrowLeft className="h-4 w-4" /> Ver catálogo
        </Link>
      </div>
    </div>
  );
}