import Logo from '../assets/Logo.png';
import { Link } from 'react-router-dom';
import { publicNavigationLinks } from '@/config/navigation';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-ink-100 bg-ink-900 text-ink-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden">
            <img 
              src={Logo} 
              alt="Logo" 
              className="h-16 max-w-none scale-150 object-contain mix-blend-multiply" 
            />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Expresión<span className="text-flame-600">Sublime</span>
          </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-400">
              Artículos de primera calidad para sublimación. Personalizamos tus
              ideas con acabados profesionales y colores vivos que duran.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Navegación
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              {publicNavigationLinks.map((e) => (
                <li key={e.to}>
                  <Link to={e.to} className="text-ink-400 transition-colors hover:text-flame-400">
                    {e.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Contacto
            </h4>
          </div>
        </div>

        <div className="mt-10 border-t border-ink-800 pt-6 text-center text-xs text-ink-500">
          © {new Date().getFullYear()} SublimaStudio. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}