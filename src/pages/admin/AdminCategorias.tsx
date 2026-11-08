import { useState, useEffect, useMemo, FormEvent } from 'react';
import { Plus, Edit2, Trash2, FolderTree, Check, X, Power } from 'lucide-react';
import {
  getCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
  activarCategoria,
} from '@/lib/api';
import axios from 'axios';
import type { Categoria } from '@/types/catalogo';
import DataTable, { type Column } from '@/components/DataTable';
import PageHeader from '@/components/PageHeader';
import SearchInput from '@/components/SearchInput';
import Button from '@/components/ui/Button';
import Field from '@/components/ui/Field';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import FormModal from '@/components/ui/FormModal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import ImageUpload from '@/components/ui/ImageUpload';
import { useToast } from '@/context/ToastContext';

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const { showToast } = useToast();
  const [erroresForm, setErroresForm] = useState<Record<string, string>>({});

  const [modalAbierto, setModalAbierto] = useState(false);
  const [categoriaEditar, setCategoriaEditar] = useState<Categoria | null>(null);
  const [guardando, setGuardando] = useState(false);

  const [categoriaEliminar, setCategoriaEliminar] = useState<Categoria | null>(null);
  const [eliminando, setEliminando] = useState(false);

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [activo, setActivo] = useState(true);
  const [archivoImagen, setArchivoImagen] = useState<File | null>(null);
  const [previewImagen, setPreviewImagen] = useState<string | null>(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    try {
      setCargando(true);
      setError(null);
      const cats = await getCategorias();
      setCategorias(cats);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar las categorías.');
    } finally {
      setCargando(false);
    }
  }

  const isActivo = (valor: any) => valor === true || valor === 1 || valor === '1' || valor === 'true';

  function abrirModal(c?: Categoria) {
    setErroresForm({});
    if (c) {
      setCategoriaEditar(c);
      setNombre(c.nombre || '');
      setDescripcion(c.descripcion || '');
      setActivo(isActivo(c.disponible));
      setPreviewImagen(c.imagen || null);
    } else {
      setCategoriaEditar(null);
      setNombre('');
      setDescripcion('');
      setActivo(true);
      setPreviewImagen(null);
    }
    setArchivoImagen(null);
    setModalAbierto(true);
  }

  function handleSelectImagen(file: File) {
    const limiteMB = 10;
    const tamanoMaximoBytes = limiteMB * 1024 * 1024;

    if (file.size > tamanoMaximoBytes) {
      showToast(`La imagen es muy pesada. El tamaño máximo permitido es ${limiteMB}MB.`, 'error');
      return;
    }

    setArchivoImagen(file);
    setPreviewImagen(URL.createObjectURL(file));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      setGuardando(true);
      setErroresForm({});
      
      const formData = new FormData();
      formData.append('nombre', nombre.trim());
      formData.append('descripcion', descripcion.trim());
      formData.append('activo', activo ? '1' : '0');

      if (archivoImagen) {
        formData.append('imagen', archivoImagen);
      }

      let respuesta;
      if (categoriaEditar) {
        respuesta = await actualizarCategoria(categoriaEditar.id, formData);
      } else {
        respuesta = await crearCategoria(formData);
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

        if (err.response?.status === 413) {
          showToast('La imagen es demasiado pesada. Por favor sube un archivo más pequeño.', 'error');
          return;
        }

        if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
          showToast('Error de red: El servidor rechazó la conexión o la imagen excede el límite.', 'error');
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
    if (!categoriaEliminar) return;
    try {
      setEliminando(true);
      await eliminarCategoria(categoriaEliminar.id);
      setCategoriaEliminar(null);
      showToast('Categoría desactivada correctamente', 'success');
      await cargarDatos();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al eliminar la categoría', 'error');
    } finally {
      setEliminando(false);
    }
  }

  async function handleActivarCategoria(id: number) {
    try {
      await activarCategoria(id);
      showToast('Categoría reactivada correctamente', 'success');
      await cargarDatos();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al reactivar la categoría', 'error');
    }
  }

  const categoriasFiltradas = useMemo(
    () =>
      categorias.filter((c) =>
        c.nombre.toLowerCase().includes(busqueda.toLowerCase()),
      ),
    [categorias, busqueda],
  );

  const columnas: Column<Categoria>[] = [
    {
      key: 'categoria',
      header: 'Categoría',
      render: (c) => (
        <div className="flex min-w-0 items-center gap-3">
          {c.imagen ? (
            <img
              src={c.imagen}
              alt={c.nombre}
              className="h-10 w-10 shrink-0 rounded-lg bg-ink-100 object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-flame-50 text-flame-600">
              <FolderTree className="h-5 w-5" />
            </div>
          )}
          <span className="truncate font-medium text-ink-900">{c.nombre}</span>
        </div>
      ),
    },
    {
      key: 'descripcion',
      header: 'Descripción',
      render: (c) => (
        <span className="text-ink-500">
          {c.descripcion || (
            <span className="italic text-ink-300">Sin descripción</span>
          )}
        </span>
      ),
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (c) =>
        isActivo(c.disponible) ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-success-700 px-2.5 py-0.5 text-xs font-bold text-white">
            <Check className="h-3 w-3" /> Activa
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-700 px-2.5 py-0.5 text-xs font-bold text-white">
            <X className="h-3 w-3" /> Inactiva
          </span>
        ),
    },
    {
      key: 'acciones',
      header: 'Acciones',
      align: 'right',
      render: (c) => (
        <div className="flex justify-end gap-1">
          <button
            onClick={() => abrirModal(c)}
            className="cursor-pointer rounded-lg p-2 text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900"
            title="Editar"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          
          {isActivo(c.disponible) ? (
            <button
              onClick={() => setCategoriaEliminar(c)}
              className="cursor-pointer rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
              title="Desactivar"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          ) : (
            <button 
              onClick={() => handleActivarCategoria(c.id)} 
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
        title="Categorías"
        subtitle="Organiza los tipos de artículos en tu catálogo."
      />

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <SearchInput
          value={busqueda}
          onChange={setBusqueda}
          placeholder="Buscar categoría..."
        />
        <Button
          icon={<Plus className="h-4 w-4" />}
          onClick={() => abrirModal()}
        >
          Nueva Categoría
        </Button>
      </div>

      <DataTable
        data={categoriasFiltradas}
        columns={columnas}
        getRowKey={(c) => c.id}
        loading={cargando}
        error={error}
        onRetry={cargarDatos}
        emptyMessage="No se encontraron categorías registradas."
        pageSize={5}
        resetKey={busqueda}
      />

      <FormModal
        open={modalAbierto}
        onClose={() => setModalAbierto(false)}
        title={categoriaEditar ? 'Editar Categoría' : 'Nueva Categoría'}
        onSubmit={handleSubmit}
        submitting={guardando}
        submitLabel={categoriaEditar ? 'Guardar cambios' : 'Crear categoría'}
      >
        <ImageUpload
          label="Imagen de Categoría"
          previewUrl={previewImagen}
          fileName={archivoImagen?.name}
          onSelect={handleSelectImagen}
        />
        {erroresForm.imagen && <p className="mt-1 text-xs font-medium text-red-600">{erroresForm.imagen}</p>}

        <Field label="Nombre" required error={erroresForm.nombre}>
          <Input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Tazas, Textiles, Promocionales"
            invalid={!!erroresForm.nombre}
          />
        </Field>

        <Field label="Descripción" error={erroresForm.descripcion}>
          <Textarea
            rows={3}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Detalles sobre esta categoría de productos..."
            invalid={!!erroresForm.descripcion}
          />
        </Field>

        <label className="flex items-center gap-2 pt-1 text-sm font-medium text-ink-700">
          <input
            type="checkbox"
            checked={activo}
            onChange={(e) => setActivo(e.target.checked)}
            className="h-4 w-4 rounded border-ink-300 text-flame-600 focus:ring-flame-500"
          />
          Categoría Activa
        </label>
      </FormModal>

      <ConfirmDialog
        open={!!categoriaEliminar}
        title="Desactivar categoría"
        message={`¿Seguro que quieres desactivar "${categoriaEliminar?.nombre}"? Puede volver a activar la categoría más tarde.`}
        confirmLabel="Sí, desactivar"
        loading={eliminando}
        onConfirm={confirmarEliminar}
        onCancel={() => setCategoriaEliminar(null)}
      />
    </div>
  );
}