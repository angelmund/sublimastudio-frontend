import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar, Footer } from '@/components/Layout';
import Inicio from '@/pages/Inicio';
import Articulos from '@/pages/Articulos';
import ArticuloDetalle from '@/pages/ArticuloDetalle';
import SobreNosotros from '@/pages/SobreNosotros';
import Contacto from '@/pages/Contacto';
import NoEncontrado from '@/pages/NoEncontrado';

import { AdminLayout } from '@/components/AdminLayout';
import AdminProductos from '@/pages/admin/AdminProductos';
import AdminCategoria from '@/pages/admin/AdminCategorias';

// Helper para reiniciar el scroll al cambiar de página
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Componente principal para el contenido de las rutas
function AppContent() {
  const location = useLocation();
  const esAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="flex min-h-screen flex-col bg-white text-ink-900 font-sans antialiased">
      {!esAdmin && <Navbar />}
      <main className="flex-1">
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<Inicio />} />
          <Route path="/articulos" element={<Articulos />} />
          <Route path="/articulo/:slug" element={<ArticuloDetalle />} />
          <Route path="/sobre-nosotros" element={<SobreNosotros />} />
          <Route path="/contacto" element={<Contacto />} />

          {/* Rutas Administrativas */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminProductos />} />
            <Route path="productos" element={<AdminProductos />} />
            <Route path="categorias" element={<AdminCategoria />} />
            <Route
              path="pedidos"
              element={<div className="p-6 text-xl font-bold">Módulo de Pedidos (Próximamente)</div>}
            />
          </Route>

          {/* Ruta 404 */}
          <Route path="*" element={<NoEncontrado />} />
        </Routes>
      </main>
      {!esAdmin && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppContent />
    </BrowserRouter>
  );
}