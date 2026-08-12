import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Check, X, Package, Upload, Image as ImageIcon } from 'lucide-react';
import { getProductos, getCategorias, crearProducto, actualizarProducto, eliminarProducto } from '@/lib/api';
import type { ProductoConCategoria, Categoria } from '@/types/catalogo';
import { Cargando, ErrorEstado, Vacio } from '@/components/Estados';

export default function AdminProductos() {
  const [productos, setProductos] = useState<ProductoConCategoria[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');

  // Estados del Formulario y Modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoEditar, setProductoEditar] = useState<ProductoConCategoria | null>(null);
  const [guardando, setGuardando] = useState(false);

  // Estados de los campos del formulario
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [disponible, setDisponible] = useState(true);
  
  // Manejo del archivo de imagen
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

  // Cargar/Limpiar datos al abrir modal
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

  // Manejador de selección de imagen
  function handleSelectImagen(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setArchivoImagen(file);
      setPreviewImagen(URL.createObjectURL(file)); // Vista previa en vivo
    }
  }

  // Enviar formulario a Django
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

      // Si seleccionó una nueva imagen, se adjunta al FormData
      if (archivoImagen) {
        formData.append('imagen_muestra', archivoImagen);
      }

      if (productoEditar) {
        await actualizarProducto(productoEditar.id, formData);
      } else {
        await crearProducto(formData);
      }

      setModalAbierto(false);
      await cargarDatos(); // Recargar lista
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al guardar el producto');
    } finally {
      setGuardando(false);
    }
  }

  // Eliminar Producto
  async function handleEliminar(id: number) {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      await eliminarProducto(id);
      await cargarDatos();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar');
    }
  }

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-900 sm:text-3xl">Gestión de Productos</h1>
          <p className="mt-1 text-sm text-ink-500">Agrega, edita o elimina artículos de tu catálogo.</p>
        </div>
        <button onClick={() => abrirModal()} className="btn-primary">
          <Plus className="h-4 w-4" /> Nuevo Producto
        </button>
      </div>

      {/* Búsqueda */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input
          type="search"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="campo-form pl-10"
        />
      </div>

      {/* Tabla */}
      {cargando ? (
        <Cargando />
      ) : error ? (
        <ErrorEstado mensaje={error} onReintentar={cargarDatos} />
      ) : productosFiltrados.length === 0 ? (
        <Vacio mensaje="No se encontraron productos registrados." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm">
          <table className="w-full text-left text-sm text-ink-700">
            <thead className="border-b border-ink-100 bg-ink-50/50 text-xs font-semibold uppercase tracking-wider text-ink-500">
              <tr>
                <th className="px-6 py-4">Producto</th>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4">Precio</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {productosFiltrados.map((p) => (
                <tr key={p.id} className="hover:bg-ink-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-ink-900 flex items-center gap-3">
                    {p.imagen ? (
                      <img src={p.imagen} alt={p.nombre} className="h-10 w-10 rounded-lg object-cover bg-ink-100" />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-ink-100 flex items-center justify-center text-ink-400">
                        <Package className="h-5 w-5" />
                      </div>
                    )}
                    <span>{p.nombre}</span>
                  </td>
                  <td className="px-6 py-4 text-ink-500">{p.categoria?.nombre ?? 'Sin Categoría'}</td>
                  <td className="px-6 py-4 font-semibold text-ink-900">
                    ${p.precio.toFixed(2)} MXN
                  </td>
                  <td className="px-6 py-4">
                    {p.disponible ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-success-50 px-2.5 py-0.5 text-xs font-semibold text-success-700">
                        <Check className="h-3 w-3" /> Activo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-ink-100 px-2.5 py-0.5 text-xs font-semibold text-ink-600">
                        <X className="h-3 w-3" /> Inactivo
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => abrirModal(p)}
                      className="rounded-lg p-2 text-ink-500 hover:bg-ink-100 hover:text-ink-900 transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEliminar(p.id)}
                      className="rounded-lg p-2 text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Formulario */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-ink-100 pb-3">
              <h3 className="text-lg font-bold text-ink-900">
                {productoEditar ? 'Editar Producto' : 'Nuevo Producto'}
              </h3>
              <button onClick={() => setModalAbierto(false)} className="rounded-lg p-1 text-ink-400 hover:bg-ink-50">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Carga e Imagen de Muestra */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-600 mb-1">
                  Imagen de Muestra
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 flex-none rounded-xl border border-dashed border-ink-200 bg-ink-50 flex items-center justify-center overflow-hidden">
                    {previewImagen ? (
                      <img src={previewImagen} alt="Vista previa" className="h-full w-full object-cover" />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-ink-300" />
                    )}
                  </div>
                  <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-xs font-semibold text-ink-700 hover:bg-ink-50 transition-colors">
                    <Upload className="h-4 w-4 text-flame-600" />
                    <span>{archivoImagen ? archivoImagen.name : 'Subir archivo...'}</span>
                    <input type="file" accept="image/*" onChange={handleSelectImagen} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-600 mb-1">
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-600 mb-1">
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
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-600 mb-1">
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

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-600 mb-1">
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

              <label className="flex items-center gap-2 text-sm text-ink-700 font-medium">
                <input
                  type="checkbox"
                  checked={disponible}
                  onChange={(e) => setDisponible(e.target.checked)}
                  className="h-4 w-4 rounded border-ink-300 text-flame-600 focus:ring-flame-500"
                />
                Disponible para venta (Activo)
              </label>

              <div className="flex items-center gap-2 pt-3">
                <button type="submit" disabled={guardando} className="btn-primary flex-1">
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