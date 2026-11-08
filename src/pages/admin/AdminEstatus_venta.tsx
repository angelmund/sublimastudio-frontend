import { useState, useEffect, useMemo, FormEvent } from 'react';
import { Plus, Edit2, Trash2, Check, X, Power, Tag } from 'lucide-react';
import {
  getEstatus_ventas,
  crearEstatus_venta,
  actualizarEstatus_venta,
  eliminarEstatus_venta,
  activarEstatus_venta,
} from '@/lib/api';
import axios from 'axios';
import type { Estatus_venta } from '@/types/catalogo';
import DataTable, { type Column } from '@/components/DataTable';
import PageHeader from '@/components/PageHeader';
import SearchInput from '@/components/SearchInput';
import Button from '@/components/ui/Button';
import Field from '@/components/ui/Field';
import Input from '@/components/ui/Input';
import FormModal from '@/components/ui/FormModal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useToast } from '@/context/ToastContext';

export default function AdminEstatus_venta() {
  const [estatusVentas, setEstatusVentas] = useState<Estatus_venta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const { showToast } = useToast();
  const [erroresForm, setErroresForm] = useState<Record<string, string>>({});

  const [modalAbierto, setModalAbierto] = useState(false);
  const [estatusEditar, setEstatusEditar] = useState<Estatus_venta | null>(null);
  const [guardando, setGuardando] = useState(false);

  const [estatusEliminar, setEstatusEliminar] = useState<Estatus_venta | null>(null);
  const [eliminando, setEliminando] = useState(false);

  // Campos del formulario
  const [nombre, setNombre] = useState('');
  const [color, setColor] = useState('#3B82F6'); // Color azul por defecto
  const [activo, setActivo] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    try {
      setCargando(true);
      setError(null);
      const data = await getEstatus_ventas();
      setEstatusVentas(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar los estatus de venta.');
    } finally {
      setCargando(false);
    }
  }

  const isActivo = (valor: any) => valor === true || valor === 1 || valor === '1' || valor === 'true';

  function abrirModal(e?: Estatus_venta) {
    setErroresForm({});
    if (e) {
      setEstatusEditar(e);
      setNombre(e.nombre || '');
      setColor(e.color || '#000000');
      setActivo(isActivo(e.activo));
    } else {
      setEstatusEditar(null);
      setNombre('');
      setColor('#3B82F6');
      setActivo(true);
    }
    setModalAbierto(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      setGuardando(true);
      setErroresForm({});
      
      const payload = {
        nombre: nombre.trim(),
        color: color,
        activo: activo
      };

      let respuesta;
      if (estatusEditar) {
        respuesta = await actualizarEstatus_venta(estatusEditar.id, payload);
      } else {
        respuesta = await crearEstatus_venta(payload);
      }

      setModalAbierto(false);
      
      const mensajeExito = respuesta?.message || 'Operación exitosa';
      showToast(mensajeExito, 'success');
      
      await cargarDatos();

    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 422) {
          const erroresLaravel = err.response.data.errors;
          const nuevosErrores: Record<string, string> = {};
          Object.keys(erroresLaravel).forEach((campo) => {
            nuevosErrores[campo] = erroresLaravel[campo][0];
          });
          setErroresForm(nuevosErrores);
          showToast('Por favor corrige los errores resaltados en el formulario.', 'error');
          return;
        }

        const mensajeBackend = err.response?.data?.message;
        showToast(mensajeBackend || `Error del servidor (${err.response?.status})`, 'error');
        
      } else {
        showToast(err instanceof Error ? err.message : 'Error interno de la aplicación', 'error');
      }
    } finally {
      setGuardando(false);
    }
  }

  async function confirmarEliminar() {
    if (!estatusEliminar) return;
    try {
      setEliminando(true);
      await eliminarEstatus_venta(estatusEliminar.id);
      setEstatusEliminar(null);
      showToast('Estatus desactivado correctamente', 'success');
      await cargarDatos();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al desactivar', 'error');
    } finally {
      setEliminando(false);
    }
  }

  async function handleActivarEstatus(id: number) {
    try {
      await activarEstatus_venta(id);
      showToast('Estatus reactivado correctamente', 'success');
      await cargarDatos();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al reactivar', 'error');
    }
  }

  const estatusFiltrados = useMemo(
    () =>
      estatusVentas.filter((e) =>
        e.nombre.toLowerCase().includes(busqueda.toLowerCase()),
      ),
    [estatusVentas, busqueda],
  );

  const columnas: Column<Estatus_venta>[] = [
    {
      key: 'estatus',
      header: 'Estatus',
      render: (e) => (
        <div className="flex min-w-0 items-center gap-3">
          <div 
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-sm border border-black/10"
            style={{ backgroundColor: e.color }}
          >
          </div>
          <span className="truncate font-medium text-ink-900">{e.nombre}</span>
        </div>
      ),
    },
    {
      key: 'color_hex',
      header: 'Color (HEX)',
      render: (e) => (
        <span className="font-mono text-sm text-ink-500 uppercase">{e.color}</span>
      ),
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (e) =>
        isActivo(e.activo) ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-success-700 px-2.5 py-0.5 text-xs font-bold text-white">
            <Check className="h-3 w-3" /> Activo
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-700 px-2.5 py-0.5 text-xs font-bold text-white">
            <X className="h-3 w-3" /> Inactivo
          </span>
        ),
    },
    {
      key: 'acciones',
      header: 'Acciones',
      align: 'right',
      render: (e) => (
        <div className="flex justify-end gap-1">
          <button
            onClick={() => abrirModal(e)}
            className="cursor-pointer rounded-lg p-2 text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900"
            title="Editar"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          
          {isActivo(e.activo) ? (
            <button
              onClick={() => setEstatusEliminar(e)}
              className="cursor-pointer rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
              title="Desactivar"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          ) : (
            <button 
              onClick={() => handleActivarEstatus(e.id)} 
              className="cursor-pointer rounded-lg p-2 text-emerald-500 transition-colors hover:bg-emerald-50 hover:text-emerald-700" 
              title="Reactivar"
            >
              <Power className="h-4 w-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-10xl space-y-8">
      <PageHeader
        title="Estatus de Venta"
        subtitle="Configura los estados por los que pasa un pedido (ej. Pendiente, En Producción, Entregado)."
      />

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <SearchInput
          value={busqueda}
          onChange={setBusqueda}
          placeholder="Buscar estatus..."
        />
        <Button
          icon={<Plus className="h-4 w-4" />}
          onClick={() => abrirModal()}
        >
          Nuevo Estatus
        </Button>
      </div>

      <DataTable
        data={estatusFiltrados}
        columns={columnas}
        getRowKey={(e) => e.id}
        loading={cargando}
        error={error}
        onRetry={cargarDatos}
        emptyMessage="No se encontraron estatus registrados."
        pageSize={5}
        resetKey={busqueda}
      />

      <FormModal
        open={modalAbierto}
        onClose={() => setModalAbierto(false)}
        title={estatusEditar ? 'Editar Estatus' : 'Nuevo Estatus'}
        onSubmit={handleSubmit}
        submitting={guardando}
        submitLabel={estatusEditar ? 'Guardar cambios' : 'Crear estatus'}
      >
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <Field label="Nombre del Estatus" required error={erroresForm.nombre}>
              <Input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. En Producción"
                invalid={!!erroresForm.nombre}
              />
            </Field>
          </div>
          
          <div className="col-span-1">
            <Field label="Color" required error={erroresForm.color}>
              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-10 w-full cursor-pointer p-1"
                  invalid={!!erroresForm.color}
                />
              </div>
            </Field>
          </div>
        </div>

        <label className="flex items-center gap-2 pt-1 text-sm font-medium text-ink-700">
          <input
            type="checkbox"
            checked={activo}
            onChange={(e) => setActivo(e.target.checked)}
            className="h-4 w-4 rounded border-ink-300 text-flame-600 focus:ring-flame-500"
          />
          Estatus Activo (Visible para nuevos pedidos)
        </label>
      </FormModal>

      <ConfirmDialog
        open={!!estatusEliminar}
        title="Desactivar estatus"
        message={`¿Seguro que quieres desactivar "${estatusEliminar?.nombre}"? Podrás reactivarlo más tarde.`}
        confirmLabel="Sí, desactivar"
        loading={eliminando}
        onConfirm={confirmarEliminar}
        onCancel={() => setEstatusEliminar(null)}
      />
    </div>
  );
}