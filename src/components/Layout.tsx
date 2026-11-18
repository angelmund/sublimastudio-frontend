import { Link } from 'react-router-dom';
import {  Menu, X } from 'lucide-react'; // Agregado 'X'
import { useState } from 'react';
import Logo from '../assets/Logo.png';
import { publicNavigationLinks } from '@/config/navigation';

export function Navbar() {
  const [abierto, setAbierto] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-ink-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2" onClick={() => setAbierto(false)}>
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden">
            <img 
              src={Logo} 
              alt="Logo" 
              className="h-16 max-w-none scale-150 object-contain mix-blend-multiply" 
            />
          </div>
          <span className="text-lg font-bold tracking-tight text-ink-900">
            Expresión<span className="text-flame-600">Sublime</span>
          </span>
        </Link>

        {/* Escritorio */}
        <nav className="hidden items-center gap-1 md:flex">
          {publicNavigationLinks.map((e) => (
            <Link
              key={e.to}
              to={e.to}
              className="rounded-lg px-3 py-2 text-sm font-medium text-ink-600 transition-colors hover:bg-flame-50 hover:text-flame-700"
            >
              {e.label}
            </Link>
          ))}
          <Link
            to="/contacto"
            className="ml-2 rounded-lg bg-flame-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-flame-700 hover:shadow-md"
          >
            Pedir cotización
          </Link>
          <Link
            to="/personalizar"
            className="ml-2 rounded-lg bg-flame-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-flame-700 hover:shadow-md"
          >
            Personalizar
          </Link>
        </nav>

        {/* Móvil: botón */}
        <button
          type="button"
          onClick={() => setAbierto((v) => !v)}
          className="inline-flex items-center justify-center rounded-lg p-2 text-ink-700 transition-colors hover:bg-ink-50 md:hidden"
          aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={abierto}
        >
          {abierto ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Móvil: panel */}
      {abierto && (
        <nav className="border-t border-ink-100 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {publicNavigationLinks.map((e) => (
              <Link
                key={e.to}
                to={e.to}
                onClick={() => setAbierto(false)}
                className="rounded-lg px-3 py-2.5 text-base font-medium text-ink-700 transition-colors hover:bg-flame-50 hover:text-flame-700"
              >
                {e.label}
              </Link>
            ))}
            <Link
              to="/contacto"
              onClick={() => setAbierto(false)}
              className="mt-2 rounded-lg bg-flame-600 px-3 py-2.5 text-center text-base font-semibold text-white shadow-sm"
            >
              Pedir cotización
            </Link>
            <Link
              to="/personalizar"
              onClick={() => setAbierto(false)}
              className="mt-2 rounded-lg bg-flame-600 px-3 py-2.5 text-center text-base font-semibold text-white shadow-sm"
            >
              Personalizar
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}