import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, Flame } from 'lucide-react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { usePersistentState } from '@/hooks/usePersistentState';

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = usePersistentState<boolean>(
    'admin-sidebar-collapsed',
    false,
  );

  return (
    <div className="flex h-screen bg-slate-50">
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar SOLO móvil: sin `md:hidden` en el header no habría nav blanco,
            pero así el contenido móvil no queda pegado al borde */}
        <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 md:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100"
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-white">
              <Flame className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <span className="text-sm font-bold text-slate-900">Admin Panel</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}