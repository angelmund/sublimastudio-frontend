import { useEffect, useMemo, useState, FormEvent } from 'react';
import { ShieldCheck, ShieldOff, UsersRound, Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { 
  getUsuariosAdmin, 
  toggleUserRole, 
  crearUsuarioAdmin, 
  actualizarUsuarioAdmin, 
  eliminarUsuarioAdmin,
  type UsuarioAdmin 
} from '@/lib/api/usuarios';
import axios from 'axios';
import DataTable, { type Column } from '@/components/DataTable';
import PageHeader from '@/components/PageHeader';
import SearchInput from '@/components/SearchInput';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import FormModal from '@/components/ui/FormModal';
import Button from '@/components/ui/Button';
import Field from '@/components/ui/Field';
import Input from '@/components/ui/Input';
import { useToast } from '@/context/ToastContext';

export default function AdminUsuarios() {
  const { user: currentUser } = useAuth();
  const { showToast } = useToast();

  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');

  // Estados para Modal Formulario
  const [modalAbierto, setModalAbierto] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState<UsuarioAdmin | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [erroresForm, setErroresForm] = useState<Record<string, string>>({});

  // Campos del Formulario
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // Estados para Eliminación/Roles
  const [usuarioCambiarRol, setUsuarioCambiarRol] = useState<UsuarioAdmin | null>(null);
  const [usuarioEliminar, setUsuarioEliminar] = useState<UsuarioAdmin | null>(null);
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  async function cargarUsuarios() {
    try {
      setCargando(true);
      setError(null);
      const data = await getUsuariosAdmin();
      setUsuarios(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar los usuarios.');
    } finally {
      setCargando(false);
    }
  }

  function abrirModal(u?: UsuarioAdmin) {
    setErroresForm({});
    if (u) {
      setUsuarioEditar(u);
      setNombre(u.name);
      setEmail(u.email);
      setPassword(''); // Siempre vacío al editar por seguridad
      setIsAdmin(u.is_admin);
      setIsActive(u.activo ?? true);
    } else {
      setUsuarioEditar(null);
      setNombre('');
      setEmail('');
      setPassword('');
      setIsAdmin(false);
      setIsActive(true);
    }
    setModalAbierto(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      setGuardando(true);
      setErroresForm({});
      
      const payload: any = {
        name: nombre.trim(),
        email: email.trim(),
        is_admin: isAdmin,
        activo: isActive
      };

      // Solo enviamos el password si lo escribieron
      if (password.trim()) {
        payload.password = password;
      } else if (!usuarioEditar) {
        showToast('La contraseña es obligatoria para nuevos usuarios', 'error');
        return;
      }

      let respuesta;
      if (usuarioEditar) {
        respuesta = await actualizarUsuarioAdmin(usuarioEditar.id, payload);
      } else {
        respuesta = await crearUsuarioAdmin(payload);
      }

      showToast(respuesta?.message || 'Operación exitosa', 'success');
      setModalAbierto(false);
      await cargarUsuarios();

    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 422) {
        const erroresLaravel = err.response.data.errors;
        const nuevosErrores: Record<string, string> = {};
        Object.keys(erroresLaravel).forEach((campo) => {
          nuevosErrores[campo] = erroresLaravel[campo][0];
        });
        setErroresForm(nuevosErrores);
        showToast('Verifica los datos del formulario.', 'error');
      } else {
        showToast('Error al guardar el usuario.', 'error');
      }
    } finally {
      setGuardando(false);
    }
  }

  async function confirmarCambioRol() {
    if (!usuarioCambiarRol) return;
    try {
      setProcesando(true);
      const res = await toggleUserRole(usuarioCambiarRol.id);
      showToast(res?.message || 'Rol actualizado', 'success');
      setUsuarioCambiarRol(null);
      await cargarUsuarios();
    } catch (err) {
      showToast('No se pudo cambiar el rol.', 'error');
    } finally {
      setProcesando(false);
    }
  }

  async function confirmarEliminar() {
    if (!usuarioEliminar) return;
    try {
      setProcesando(true);
      await eliminarUsuarioAdmin(usuarioEliminar.id);
      showToast('Usuario desactivado correctamente', 'success');
      setUsuarioEliminar(null);
      await cargarUsuarios();
    } catch (err) {
      showToast('Error al desactivar usuario', 'error');
    } finally {
      setProcesando(false);
    }
  }

  const usuariosFiltrados = useMemo(() => {
    const q = busqueda.toLowerCase().trim();
    if (!q) return usuarios;
    return usuarios.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q),
    );
  }, [usuarios, busqueda]);

  const columnas: Column<UsuarioAdmin>[] = [
    {
      key: 'usuario',
      header: 'Usuario',
      render: (u) => (
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
            {u.name[0]?.toUpperCase() ?? '?'}
          </div>
          <span className="truncate font-semibold text-ink-900">
            {u.name} {currentUser?.id === u.id && <span className="text-ink-400 text-xs font-normal ml-1">(Tú)</span>}
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
        u.is_admin ? (
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
      key: 'estado',
      header: 'Estado',
      render: (u) => (
        u.activo !== false ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-success-50 px-2.5 py-0.5 text-xs font-semibold text-success-700">
            <Check className="h-3 w-3" /> Activo
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700">
            <X className="h-3 w-3" /> Inactivo
          </span>
        )
      )
    },
    {
      key: 'acciones',
      header: 'Acciones',
      align: 'right',
      render: (u) => {
        const isMe = currentUser?.id === u.id;
        return (
          <div className="flex justify-end gap-1">
            <button
              onClick={() => abrirModal(u)}
              className="cursor-pointer rounded-lg p-2 text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900"
              title="Editar"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            
            {!isMe && (
              <>
                <button
                  onClick={() => setUsuarioCambiarRol(u)}
                  className={`cursor-pointer rounded-lg p-2 transition-colors ${
                    u.is_admin ? 'text-violet-600 hover:bg-violet-50' : 'text-slate-500 hover:bg-slate-100'
                  }`}
                  title={u.is_admin ? 'Revocar Admin' : 'Hacer Admin'}
                >
                  {u.is_admin ? <ShieldOff className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                </button>

                <button
                  onClick={() => setUsuarioEliminar(u)}
                  className="cursor-pointer rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                  title="Desactivar"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="mx-auto w-full max-w-10xl space-y-8">
      <PageHeader
        title="Usuarios"
        subtitle="Gestiona el acceso, edita perfiles y asigna roles administrativos."
      />

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <SearchInput
          value={busqueda}
          onChange={setBusqueda}
          placeholder="Buscar por usuario o correo..."
        />
        <Button icon={<Plus className="h-4 w-4" />} onClick={() => abrirModal()}>
          Nuevo Usuario
        </Button>
      </div>

      <DataTable
        data={usuariosFiltrados}
        columns={columnas}
        getRowKey={(u) => u.id}
        loading={cargando}
        error={error}
        onRetry={cargarUsuarios}
        emptyMessage="No se encontraron usuarios."
        pageSize={10}
        resetKey={busqueda}
      />

      {/* Modal CRUD */}
      <FormModal
        open={modalAbierto}
        onClose={() => setModalAbierto(false)}
        title={usuarioEditar ? 'Editar Usuario' : 'Nuevo Usuario'}
        onSubmit={handleSubmit}
        submitting={guardando}
        submitLabel={usuarioEditar ? 'Guardar cambios' : 'Crear usuario'}
      >
        <Field label="Nombre Completo" required error={erroresForm.name}>
          <Input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Juan Pérez"
            invalid={!!erroresForm.name}
          />
        </Field>
        
        <Field label="Correo Electrónico" required error={erroresForm.email}>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="juan@ejemplo.com"
            invalid={!!erroresForm.email}
          />
        </Field>

        <Field 
          label={usuarioEditar ? "Nueva Contraseña (opcional)" : "Contraseña"} 
          required={!usuarioEditar} 
          error={erroresForm.password}
        >
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={usuarioEditar ? "Deja en blanco para no cambiar" : "Mínimo 8 caracteres"}
            invalid={!!erroresForm.password}
          />
        </Field>

        <div className="space-y-3 pt-2">
          <label className="flex items-center gap-2 text-sm font-medium text-ink-700">
            <input
              type="checkbox"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              disabled={usuarioEditar?.id === currentUser?.id}
              className="h-4 w-4 rounded border-ink-300 text-violet-600 focus:ring-violet-500 disabled:opacity-50"
            />
            Permisos de Administrador (Acceso al panel)
          </label>
          
          <label className="flex items-center gap-2 text-sm font-medium text-ink-700">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              disabled={usuarioEditar?.id === currentUser?.id}
              className="h-4 w-4 rounded border-ink-300 text-success-600 focus:ring-success-500 disabled:opacity-50"
            />
            Cuenta Activa (Puede iniciar sesión)
          </label>
        </div>
      </FormModal>

      {/* Confirmaciones */}
      <ConfirmDialog
        open={!!usuarioCambiarRol}
        title={usuarioCambiarRol?.is_admin ? 'Revocar acceso admin' : 'Otorgar acceso admin'}
        message={
          usuarioCambiarRol?.is_admin
            ? `¿Quitar los permisos de administrador a "${usuarioCambiarRol?.name}"?`
            : `¿Dar permisos de administrador a "${usuarioCambiarRol?.name}"?`
        }
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
        loading={procesando}
        onConfirm={confirmarCambioRol}
        onCancel={() => setUsuarioCambiarRol(null)}
      />

      <ConfirmDialog
        open={!!usuarioEliminar}
        title="Desactivar usuario"
        message={`¿Seguro que quieres desactivar a "${usuarioEliminar?.name}"? No podrá iniciar sesión en la tienda.`}
        confirmLabel="Sí, desactivar"
        cancelLabel="Cancelar"
        loading={procesando}
        onConfirm={confirmarEliminar}
        onCancel={() => setUsuarioEliminar(null)}
      />
    </div>
  );
}