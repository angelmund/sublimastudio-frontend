import { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  Package,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';
import {
  getProductos,
  getCategorias,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from '@/lib/api';
import type { ProductoConCategoria, Categoria } from '@/types/catalogo';
import DataTable, { type Column } from '@/components/DataTable';
import PageHeader from '@/components/PageHeader';

export default function AdminProductos() {
  const [productos, setProductos] = useState<ProductoConCategoria[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');

  // ---------- Estado del modal ----------
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoEditar, setProductoEditar] = useState<ProductoConCategoria | null>(null);
  const [guardando, setGuardando] = useState(false);

  // ---------- Campos del formulario ----------
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [disponible, setDisponible] = useState(true);

  // ---------- Imagen ----------
  const [archivoImagen, setArchivoImagen] = useState<File | null>(null);
  const [previewImagen, setPreviewImagen] = useState<string | null>(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    try {
      setCargando(true);
      setError(null);
      const [prods, cats] = await Promise.all([getProductos(), getCategorias()]);
      setProductos(prods);
      setCategorias(cats);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar los datos.');
    } finally {
      setCargando(false);
    }
  }

  function abrirModal(p?: ProductoConCategoria) {
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

  function handleSelectImagen(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setArchivoImagen(file);
      setPreviewImagen(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim() || !precio || !categoriaId) {
      alert('Por favor completa los campos obligatorios.');
      return;
    }

    try {
      setGuardando(true);
      const formData = new FormData();
      formData.append('nombre', nombre.trim());
      formData.append('precio_base', precio);
      formData.append('categoria', categoriaId);
      formData.append('descripcion', descripcion.trim());
      formData.append('activo', disponible ? 'true' : 'false');

      if (archivoImagen) {
        formData.append('imagen_muestra', archivoImagen);
      }

      if (productoEditar) {
        await actualizarProducto(productoEditar.id, formData);
      } else {
        await crearProducto(formData);
      }

      setModalAbierto(false);
      await cargarDatos();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al guardar el producto');
    } finally {
      setGuardando(false);
    }
  }

  async function handleEliminar(id: number) {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      await eliminarProducto(id);
      await cargarDatos();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar');
    }
  }

  // ---------- Filtro de búsqueda ----------
  const productosFiltrados = useMemo(
    () =>
      productos.filter((p) =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()),
      ),
    [productos, busqueda],
  );

  // ============================================================
  // Columnas — van en el CUERPO del componente, no en el JSX
  // ============================================================
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
            className="rounded-lg p-2 text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900"
            title="Editar"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleEliminar(p.id)}
            className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
            title="Eliminar"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  // ============================================================
  // ÚNICO return del componente
  // ============================================================
  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="Gestión de Productos"
        subtitle="Agrega, edita o elimina artículos de tu catálogo."
        action={
          <button onClick={() => abrirModal()} className="btn-primary">
            <Plus className="h-4 w-4" /> Nuevo Producto
          </button>
        }
      />

      {/* Búsqueda */}
      <div className="relative w-full max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input
          type="search"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full rounded-xl border border-ink-200 bg-white py-2.5 pl-10 pr-4 text-sm text-ink-900 shadow-sm transition-colors placeholder:text-ink-400 focus:border-flame-500 focus:outline-none focus:ring-2 focus:ring-flame-500/20"
        />
      </div>

      {/* Tabla — DataTable maneja loading, error, vacío y paginación */}
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

      {/* Modal Formulario */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink-950/50 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-lg space-y-4 rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-ink-100 pb-3">
              <h3 className="text-lg font-bold text-ink-900">
                {productoEditar ? 'Editar Producto' : 'Nuevo Producto'}
              </h3>
              <button
                onClick={() => setModalAbierto(false)}
                className="rounded-lg p-1 text-ink-400 hover:bg-ink-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Imagen */}
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-600">
                  Imagen de Muestra
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative flex h-20 w-20 flex-none items-center justify-center overflow-hidden rounded-xl border border-dashed border-ink-200 bg-ink-50">
                    {previewImagen ? (
                      <img
                        src={previewImagen}
                        alt="Vista previa"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-ink-300" />
                    )}
                  </div>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-xs font-semibold text-ink-700 transition-colors hover:bg-ink-50">
                    <Upload className="h-4 w-4 text-flame-600" />
                    <span>{archivoImagen ? archivoImagen.name : 'Subir archivo...'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSelectImagen}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Nombre */}
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-600">
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="campo-form"
                  placeholder="Ej. Taza Mágica 11oz"
                />
              </div>

              {/* Precio + Categoría */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-600">
                    Precio Base (MXN) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    className="campo-form"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-600">
                    Categoría *
                  </label>
                  <select
                    required
                    value={categoriaId}
                    onChange={(e) => setCategoriaId(e.target.value)}
                    className="campo-form"
                  >
                    <option value="">Selecciona...</option>
                    {categorias.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-600">
                  Descripción
                </label>
                <textarea
                  rows={3}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="campo-form"
                  placeholder="Detalles del artículo..."
                />
              </div>

              {/* Disponible */}
              <label className="flex items-center gap-2 text-sm font-medium text-ink-700">
                <input
                  type="checkbox"
                  checked={disponible}
                  onChange={(e) => setDisponible(e.target.checked)}
                  className="h-4 w-4 rounded border-ink-300 text-flame-600 focus:ring-flame-500"
                />
                Disponible para venta (Activo)
              </label>

              {/* Botones */}
              <div className="flex items-center gap-2 pt-3">
                <button
                  type="submit"
                  disabled={guardando}
                  className="btn-primary flex-1"
                >
                  {guardando ? 'Guardando...' : 'Guardar Producto'}
                </button>
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="btn-secundario"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}