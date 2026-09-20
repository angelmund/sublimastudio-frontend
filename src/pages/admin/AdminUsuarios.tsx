import { useEffect, useMemo, useState } from 'react';
import { ShieldCheck, ShieldOff, UsersRound } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  getUsuariosAdmin,
  toggleUserRole,
  type UsuarioAdmin,
} from '@/lib/api/admin';
import DataTable, { type Column } from '@/components/DataTable';
import PageHeader from '@/components/PageHeader';
import SearchInput from '@/components/SearchInput';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export default function AdminUsuarios() {
  const { accessToken } = useAuth();

  // ---------- Data ----------
  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');

  // ---------- Modal cambiar rol ----------
  const [usuarioCambiar, setUsuarioCambiar] = useState<UsuarioAdmin | null>(null);
  const [cambiando, setCambiando] = useState(false);

  useEffect(() => {
    cargarUsuarios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  async function cargarUsuarios() {
    try {
      setCargando(true);
      setError(null);
      const data = await getUsuariosAdmin(accessToken);
      setUsuarios(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar los usuarios.');
    } finally {
      setCargando(false);
    }
  }

  async function confirmarCambioRol() {
    if (!usuarioCambiar) return;
    try {
      setCambiando(true);
      await toggleUserRole(usuarioCambiar.id, !usuarioCambiar.is_staff, accessToken);
      setUsuarioCambiar(null);
      await cargarUsuarios();
    } catch {
      alert('No se pudo cambiar el rol del usuario.');
    } finally {
      setCambiando(false);
    }
  }

  const usuariosFiltrados = useMemo(() => {
    const q = busqueda.toLowerCase().trim();
    if (!q) return usuarios;
    return usuarios.filter(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q),
    );
  }, [usuarios, busqueda]);

  // ============================================================
  // Columnas
  // ============================================================
  const columnas: Column<UsuarioAdmin>[] = [
    {
      key: 'usuario',
      header: 'Usuario',
      render: (u) => (
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
            {u.username[0]?.toUpperCase() ?? '?'}
          </div>
          <span className="truncate font-semibold text-ink-900">
            {u.username}
          </span>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Correo',
      render: (u) => <span className="text-ink-500">{u.email}</span>,
    },
    {
      key: 'rol',
      header: 'Rol Actual',
      render: (u) =>
        u.is_staff ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-0.5 text-xs font-semibold text-violet-700">
            <ShieldCheck className="h-3 w-3" /> Administrador
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-100 px-2.5 py-0.5 text-xs font-semibold text-ink-600">
            <UsersRound className="h-3 w-3" /> Cliente
          </span>
        ),
    },
    {
      key: 'acciones',
      header: 'Acción',
      align: 'right',
      render: (u) => (
        <button
          onClick={() => setUsuarioCambiar(u)}
          className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
            u.is_staff
              ? 'text-red-600 hover:bg-red-50'
              : 'text-violet-700 hover:bg-violet-50'
          }`}
          title={u.is_staff ? 'Revocar acceso admin' : 'Otorgar acceso admin'}
        >
          {u.is_staff ? (
            <>
              <ShieldOff className="h-3.5 w-3.5" /> Revocar Admin
            </>
          ) : (
            <>
              <ShieldCheck className="h-3.5 w-3.5" /> Hacer Admin
            </>
          )}
        </button>
      ),
    },
  ];

  // ============================================================
  // Render
  // ============================================================
  return (
    <div className="mx-auto w-full max-w-10xl space-y-8">
      <PageHeader
        title="Usuarios"
        subtitle="Asigna o revoca permisos de administrador a los usuarios registrados."
      />

      {/* Buscador centrado */}
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <SearchInput
          value={busqueda}
          onChange={setBusqueda}
          placeholder="Buscar por usuario o correo..."
        />
      </div>

      <DataTable
        data={usuariosFiltrados}
        columns={columnas}
        getRowKey={(u) => u.id}
        loading={cargando}
        error={error}
        onRetry={cargarUsuarios}
        emptyMessage="No se encontraron usuarios registrados."
        pageSize={10}
        resetKey={busqueda}
      />

      {/* Confirm cambio de rol */}
      <ConfirmDialog
        open={!!usuarioCambiar}
        title={usuarioCambiar?.is_staff ? 'Revocar acceso admin' : 'Otorgar acceso admin'}
        message={
          usuarioCambiar?.is_staff
            ? `¿Seguro que quieres quitar los permisos de administrador a "${usuarioCambiar?.username}"?`
            : `¿Seguro que quieres dar permisos de administrador a "${usuarioCambiar?.username}"? Podrá gestionar productos, categorías y usuarios.`
        }
        confirmLabel={usuarioCambiar?.is_staff ? 'Sí, revocar' : 'Sí, otorgar'}
        cancelLabel="Cancelar"
        loading={cambiando}
        onConfirm={confirmarCambioRol}
        onCancel={() => setUsuarioCambiar(null)}
      />
    </div>
  );
}