import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar, Footer } from '@/components/Layout';
import Inicio from '@/pages/Inicio';
import Articulos from '@/pages/Articulos';
import ArticuloDetalle from '@/pages/ArticuloDetalle';
import SobreNosotros from '@/pages/SobreNosotros';
import Contacto from '@/pages/Contacto';
import NoEncontrado from '@/pages/NoEncontrado';
import { GuestRoute } from '@/components/GuestRoute';

// Importación de autenticación y panel admin
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminLayout } from '@/components/AdminLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminProductos from '@/pages/admin/AdminProductos';
import AdminCategoria from '@/pages/admin/AdminCategorias';
import Miscompras from '@/pages/admin/MisCompras';
import AdminUsuarios from '@/pages/admin/AdminUsuarios';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import VerifyEmail from '@/pages/email/VerifyEmail';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import ToastContainer from '@/components/ui/ToastContainer';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppContent() {
  const location = useLocation();
  const esVistaLimpia = location.pathname.startsWith('/admin') || ['/login', '/register', '/verify-email', '/forgot-password', '/reset-password'].includes(location.pathname);

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900 font-sans antialiased">
      <ToastContainer />
      {!esVistaLimpia && <Navbar />}
      <main className="flex-1">
        <Routes>
          {/* 1. Rutas Públicas (Todos pueden verlas) */}
          <Route path="/" element={<Inicio />} />
          <Route path="/articulos" element={<Articulos />} />
          <Route path="/articulo/:slug" element={<ArticuloDetalle />} />
          <Route path="/sobre-nosotros" element={<SobreNosotros />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* 2. Rutas para Invitados (Solo para usuarios NO logueados) */}
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Route>

          {/* 3. Rutas Administrativas Protegidas (Solo usuarios LOGUEADOS) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              
              {/* Esta ruta la ven todos los logueados (puedes hacer que el Dashboard cambie según el rol) */}
              <Route index element={<AdminDashboard />} />

              {/* rutas de los clientes */}
              <Route path="compras" element={<Miscompras />} />

              {/* Nivel 2: Sub-rutas estrictamente para ADMINISTRADORES */}
              <Route element={<ProtectedRoute requiereAdmin={true} />}>
                    <Route path="productos" element={<AdminProductos />} />
                    <Route path="categorias" element={<AdminCategoria />} />
                    <Route path="usuarios" element={<AdminUsuarios />} />
                    <Route path="pedidos" element={<div className="p-6 text-xl font-bold">Gestión de Pedidos</div>}/>
                    </Route>

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
      <ToastProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AppContent />
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}