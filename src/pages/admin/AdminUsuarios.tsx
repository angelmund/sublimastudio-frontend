import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUsuariosAdmin, toggleUserRole, UsuarioAdmin } from '@/lib/api/admin';

export default function AdminUsuarios() {
  const { accessToken } = useAuth();
  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarUsuarios = async () => {
    try {
      const data = await getUsuariosAdmin(accessToken);
      setUsuarios(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, [accessToken]);

  const handleCambiarRol = async (id: number, estadoActual: boolean) => {
    try {
      await toggleUserRole(id, !estadoActual, accessToken);
      await cargarUsuarios();
    } catch (err) {
      alert('No se pudo cambiar el rol del usuario.');
    }
  };

  if (loading) return <div className="p-8 text-slate-500">Cargando usuarios...</div>;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Gestión de Usuarios y Roles</h1>
        <p className="text-sm text-slate-500">Asigna permisos de administrador a los usuarios registrados.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3.5 font-bold">Usuario</th>
              <th className="px-6 py-3.5 font-bold">Correo</th>
              <th className="px-6 py-3.5 font-bold">Rol Actual</th>
              <th className="px-6 py-3.5 font-bold text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {usuarios.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-semibold text-slate-900">{u.username}</td>
                <td className="px-6 py-4">{u.email}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${
                    u.is_staff ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {u.is_staff ? 'Administrador' : 'Cliente'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleCambiarRol(u.id, u.is_staff)}
                    className="text-xs font-bold text-slate-900 underline hover:text-slate-700"
                  >
                    {u.is_staff ? 'Revocar Admin' : 'Hacer Admin'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}