import { useState, useEffect, useMemo, FormEvent } from 'react';
import { Plus, Edit2, Trash2, Check, X, Package } from 'lucide-react';
import {
  getAdminProductos,
  getCategorias,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from '@/lib/api';
import axios from 'axios';
import type { ProductoConCategoria, Categoria } from '@/types/catalogo';
import DataTable, { type Column } from '@/components/DataTable';
import PageHeader from '@/components/PageHeader';
import SearchInput from '@/components/SearchInput';
import Button from '@/components/ui/Button';
import Field from '@/components/ui/Field';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import FormModal from '@/components/ui/FormModal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import ImageUpload from '@/components/ui/ImageUpload';
import { useToast } from '@/context/ToastContext';
export default function AdminProductos() {
  // ---------- Data ----------
const [productos, setProductos] = useState<ProductoConCategoria[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const { showToast } = useToast();
  const [erroresForm, setErroresForm] = useState<Record<string, string>>({});
  
  // ---------- Modal form ----------
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoEditar, setProductoEditar] = useState<ProductoConCategoria | null>(null);
  const [guardando, setGuardando] = useState(false);

  // ---------- Modal delete ----------
  const [productoEliminar, setProductoEliminar] = useState<ProductoConCategoria | null>(null);
  const [eliminando, setEliminando] = useState(false);

  // ---------- Campos ----------
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
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
      const [prods, cats] = await Promise.all([getAdminProductos(), getCategorias()]);
      setProductos(prods);
      setCategorias(cats);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar los datos.');
    } finally {
      setCargando(false);
    }
  }

  function abrirModal(p?: ProductoConCategoria) {
    setErroresForm({});
    if (p) {
      setProductoEditar(p);
      setNombre(p.nombre);
      setPrecio(p.precio.toString());
      setCategoriaId(p.categoria?.id.toString() || '');
      setDescripcion(p.descripcion || '');
      setDisponible(p.disponible);
      setPreviewImagen(p.imagen || null);
    } else {
      setProductoEditar(null);
      setNombre('');
      setPrecio('');
      setCategoriaId('');
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
    if (!nombre.trim() || !precio || !categoriaId) {
      alert('Por favor completa los campos obligatorios.');
      return;
    }

    try {
  setGuardando(true);
  setErroresForm({}); // Limpiamos errores antes de enviar
  
  const formData = new FormData();
  formData.append('nombre', nombre.trim());
  formData.append('precio_base', precio);
  formData.append('categoria', categoriaId);
  formData.append('descripcion', descripcion.trim());
  formData.append('activo', disponible ? 'true' : 'false');

  if (archivoImagen) formData.append('imagen_muestra', archivoImagen);

  if (productoEditar) {
    await actualizarProducto(productoEditar.id, formData);
    showToast('Producto actualizado correctamente', 'success');
  } else {
    await crearProducto(formData);
    showToast('Producto creado con éxito', 'success');
  }

  setModalAbierto(false);
  await cargarDatos();
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 422) {
      // Laravel devuelve los errores en err.response.data.errors
      const erroresLaravel = err.response.data.errors;
      const nuevosErrores: Record<string, string> = {};

      // Extraemos el primer mensaje de cada campo
      Object.keys(erroresLaravel).forEach((campo) => {
        nuevosErrores[campo] = erroresLaravel[campo][0];
      });

      setErroresForm(nuevosErrores);
      showToast('Por favor corrige los errores resaltados en rojo.', 'error');
    } else {
      showToast(err instanceof Error ? err.message : 'Error al guardar el producto', 'error');
    }
  } finally {
    setGuardando(false);
  }
  }

  async function confirmarEliminar() {
    if (!productoEliminar) return;
    try {
      setEliminando(true);
      await eliminarProducto(productoEliminar.id);
      setProductoEliminar(null);
      await cargarDatos();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar');
    } finally {
      setEliminando(false);
    }
  }

  const productosFiltrados = useMemo(
    () =>
      productos.filter((p) =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()),
      ),
    [productos, busqueda],
  );

  const columnas: Column<ProductoConCategoria>[] = [
    {
      key: 'producto',
      header: 'Producto',
      render: (p) => (
        <div className="flex min-w-0 items-center gap-4">
          {p.imagen ? (
            <img
              src={p.imagen}
              alt={p.nombre}
              className="h-10 w-10 shrink-0 rounded-lg bg-ink-100 object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ink-100 text-ink-400">
              <Package className="h-5 w-5" />
            </div>
          )}
          <span className="truncate font-medium text-ink-900">{p.nombre}</span>
        </div>
      ),
    },
    {
      key: 'categoria',
      header: 'Categoría',
      render: (p) => (
        <span className="text-ink-500">
          {p.categoria?.nombre ?? 'Sin Categoría'}
        </span>
      ),
    },
    {
      key: 'precio',
      header: 'Precio',
      render: (p) => (
        <span className="font-semibold text-ink-900">
          ${p.precio.toFixed(2)} MXN
        </span>
      ),
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (p) =>
        p.disponible ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-success-50 px-2.5 py-0.5 text-xs font-semibold text-success-700">
            <Check className="h-3 w-3" /> Activo
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-ink-100 px-2.5 py-0.5 text-xs font-semibold text-ink-600">
            <X className="h-3 w-3" /> Inactivo
          </span>
        ),
    },
    {
      key: 'acciones',
      header: 'Acciones',
      align: 'right',
      render: (p) => (
        <div className="flex justify-end gap-1">
          <button
            onClick={() => abrirModal(p)}
            className="rounded-lg p-2 text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900 cursor-pointer"
            title="Editar"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setProductoEliminar(p)}
            className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700 cursor-pointer"
            title="Eliminar"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-10xl space-y-8">
      <PageHeader
        title="Productos"
        subtitle="Agrega, edita o elimina artículos de tu catálogo."
      />

      {/* Buscador centrado + botón */}
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <SearchInput
          value={busqueda}
          onChange={setBusqueda}
          placeholder="Buscar producto..."
        />
        <Button
          icon={<Plus className="h-4 w-4" />}
          onClick={() => abrirModal()}
        >
          Nuevo Producto
        </Button>
      </div>

      <DataTable
        data={productosFiltrados}
        columns={columnas}
        getRowKey={(p) => p.id}
        loading={cargando}
        error={error}
        onRetry={cargarDatos}
        emptyMessage="No se encontraron productos registrados."
        pageSize={5}
        resetKey={busqueda}
      />

      {/* Modal crear/editar */}
      <FormModal
        open={modalAbierto}
        onClose={() => setModalAbierto(false)}
        title={productoEditar ? 'Editar Producto' : 'Nuevo Producto'}
        onSubmit={handleSubmit}
        submitting={guardando}
        submitLabel={productoEditar ? 'Guardar cambios' : 'Crear producto'}
      >
      <ImageUpload
        label="Imagen de Muestra"
        previewUrl={previewImagen}
        fileName={archivoImagen?.name}
        onSelect={handleSelectImagen}
      />
      {/* Mostrar error de imagen debajo si existe */}
      {erroresForm.imagen_muestra && (
        <p className="mt-1 text-xs font-medium text-red-600">{erroresForm.imagen_muestra}</p>
      )}

      <Field label="Nombre" required error={erroresForm.nombre}>
        <Input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej. Taza Mágica 11oz"
          invalid={!!erroresForm.nombre} // true si hay error
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Precio Base (MXN)" required error={erroresForm.precio_base}>
          <Input
            type="number"
            step="0.01"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            placeholder="0.00"
            invalid={!!erroresForm.precio_base}
          />
        </Field>

        <Field label="Categoría" required error={erroresForm.categoria}>
          <Select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            invalid={!!erroresForm.categoria}
          >
            <option value="">Selecciona...</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="Descripción" error={erroresForm.descripcion}>
        <Textarea
          rows={3}
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Detalles del artículo..."
          invalid={!!erroresForm.descripcion}
        />
      </Field>

        <label className="flex items-center gap-2 text-sm font-medium text-ink-700">
          <input
            type="checkbox"
            checked={disponible}
            onChange={(e) => setDisponible(e.target.checked)}
            className="h-4 w-4 rounded border-ink-300 text-flame-600 focus:ring-flame-500"
          />
          Disponible para venta (Activo)
        </label>
      </FormModal>

      {/* Confirm delete */}
      <ConfirmDialog
        open={!!productoEliminar}
        title="Eliminar producto"
        message={`¿Seguro que quieres eliminar "${productoEliminar?.nombre}"? Esta acción no se puede deshacer.`}
        confirmLabel="Sí, eliminar"
        loading={eliminando}
        onConfirm={confirmarEliminar}
        onCancel={() => setProductoEliminar(null)}
      />
    </div>
  );
}