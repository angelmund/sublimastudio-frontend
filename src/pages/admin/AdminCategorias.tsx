import { useState, useEffect, useMemo, FormEvent } from 'react';
import { Plus, Edit2, Trash2, FolderTree, Check, X } from 'lucide-react';
import {
  getCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from '@/lib/api';
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

export default function AdminCategorias() {
  // ---------- Data ----------
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');

  // ---------- Modal form ----------
  const [modalAbierto, setModalAbierto] = useState(false);
  const [categoriaEditar, setCategoriaEditar] = useState<Categoria | null>(null);
  const [guardando, setGuardando] = useState(false);

  // ---------- Modal delete ----------
  const [categoriaEliminar, setCategoriaEliminar] = useState<Categoria | null>(null);
  const [eliminando, setEliminando] = useState(false);

  // ---------- Campos ----------
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [disponible, setDisponible] = useState(true);
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

  function abrirModal(c?: Categoria) {
    if (c) {
      setCategoriaEditar(c);
      setNombre(c.nombre);
      setDescripcion(c.descripcion || '');
      setDisponible(c.disponible ?? true);
      setPreviewImagen(c.imagen || null);
    } else {
      setCategoriaEditar(null);
      setNombre('');
      setDescripcion('');
      setDisponible(true);
      setPreviewImagen(null);
    }
    setArchivoImagen(null);
    setModalAbierto(true);
  }

  function handleSelectImagen(file: File) {
    setArchivoImagen(file);
    setPreviewImagen(URL.createObjectURL(file));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!nombre.trim()) {
      alert('El nombre de la categoría es obligatorio.');
      return;
    }

    try {
      setGuardando(true);
      const formData = new FormData();
      formData.append('nombre', nombre.trim());
      formData.append('descripcion', descripcion.trim());
      formData.append('activo', disponible ? 'true' : 'false');

      if (archivoImagen) {
        formData.append('imagen', archivoImagen);
      }

      if (categoriaEditar) {
        await actualizarCategoria(categoriaEditar.id, formData);
      } else {
        await crearCategoria(formData);
      }

      setModalAbierto(false);
      await cargarDatos();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al guardar la categoría');
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
      await cargarDatos();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar la categoría');
    } finally {
      setEliminando(false);
    }
  }

  const categoriasFiltradas = useMemo(
    () =>
      categorias.filter((c) =>
        c.nombre.toLowerCase().includes(busqueda.toLowerCase()),
      ),
    [categorias, busqueda],
  );

  // ============================================================
  // Columnas
  // ============================================================
  const columnas: Column<Categoria>[] = [
    // {
    //   key: 'id',
    //   header: 'ID',
    //   className: 'w-20',
    //   render: (c) => (
    //     <span className="font-mono text-xs font-semibold text-ink-400">
    //       #{c.id}
    //     </span>
    //   ),
    // },
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
        c.disponible ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-success-50 px-2.5 py-0.5 text-xs font-semibold text-success-700">
            <Check className="h-3 w-3" /> Activa
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-ink-100 px-2.5 py-0.5 text-xs font-semibold text-ink-600">
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
          <button
            onClick={() => setCategoriaEliminar(c)}
            className="cursor-pointer rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
            title="Eliminar"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  // ============================================================
  // Render
  // ============================================================
  return (
    <div className="mx-auto w-full max-w-10xl space-y-8">
      <PageHeader
        title="Categorías"
        subtitle="Organiza los tipos de artículos en tu catálogo."
      />

      {/* Buscador + botón */}
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

      {/* Modal crear/editar */}
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

        <Field label="Nombre" required>
          <Input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Tazas, Textiles, Promocionales"
            required
          />
        </Field>

        <Field label="Descripción">
          <Textarea
            rows={3}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Detalles sobre esta categoría de productos..."
          />
        </Field>

        <label className="flex items-center gap-2 pt-1 text-sm font-medium text-ink-700">
          <input
            type="checkbox"
            checked={disponible}
            onChange={(e) => setDisponible(e.target.checked)}
            className="h-4 w-4 rounded border-ink-300 text-flame-600 focus:ring-flame-500"
          />
          Categoría Activa
        </label>
      </FormModal>

      {/* Confirm delete */}
      <ConfirmDialog
        open={!!categoriaEliminar}
        title="Eliminar categoría"
        message={`¿Seguro que quieres eliminar "${categoriaEliminar?.nombre}"? Los productos asociados podrían quedar sin categoría.`}
        confirmLabel="Sí, eliminar"
        loading={eliminando}
        onConfirm={confirmarEliminar}
        onCancel={() => setCategoriaEliminar(null)}
      />
    </div>
  );
}