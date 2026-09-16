import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar, Footer } from '@/components/Layout';
import Inicio from '@/pages/Inicio';
import Articulos from '@/pages/Articulos';
import ArticuloDetalle from '@/pages/ArticuloDetalle';
import SobreNosotros from '@/pages/SobreNosotros';
import Contacto from '@/pages/Contacto';
import NoEncontrado from '@/pages/NoEncontrado';

// Importación de autenticación y panel admin
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminLayout } from '@/components/AdminLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminProductos from '@/pages/admin/AdminProductos';
import AdminCategoria from '@/pages/admin/AdminCategorias';
import AdminUsuarios from '@/pages/admin/AdminUsuarios';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import VerifyEmail from '@/pages/email/VerifyEmail';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';

import { AuthProvider } from '@/context/AuthContext';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppContent() {
  const location = useLocation();
  const esVistaLimpia = location.pathname.startsWith('/admin') || location.pathname === '/login';

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900 font-sans antialiased">
      {!esVistaLimpia && <Navbar />}
      <main className="flex-1">
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<Inicio />} />
          <Route path="/articulos" element={<Articulos />} />
          <Route path="/articulo/:slug" element={<ArticuloDetalle />} />
          <Route path="/sobre-nosotros" element={<SobreNosotros />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email/:uid/:token" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />

          {/* Rutas Administrativas Protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="productos" element={<AdminProductos />} />
              <Route path="categorias" element={<AdminCategoria />} />
              <Route path="usuarios" element={<AdminUsuarios />} />
              <Route
                path="pedidos"
                element={<div className="p-6 text-xl font-bold text-slate-800">Módulo de Pedidos (Próximamente)</div>}
              />
            </Route>
          </Route>

          {/* Ruta 404 */}
          <Route path="*" element={<NoEncontrado />} />
        </Routes>
      </main>
      {!esVistaLimpia && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}