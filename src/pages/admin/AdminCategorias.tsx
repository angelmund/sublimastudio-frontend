import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  FolderTree,
  X,
  Check,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';
import {
  getCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from '@/lib/api';
import type { Categoria } from '@/types/catalogo';
import { Cargando, ErrorEstado, Vacio } from '@/components/Estados';

export default function AdminCategoria() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');

  // Estados del Formulario y Modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [categoriaEditar, setCategoriaEditar] = useState<Categoria | null>(null);
  const [guardando, setGuardando] = useState(false);

  // Campos del formulario
  const [nombre, setNombre] = useState('');
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

  function handleSelectImagen(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setArchivoImagen(file);
      setPreviewImagen(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
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

  async function handleEliminar(id: number) {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return;
    try {
      await eliminarCategoria(id);
      await cargarDatos();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar la categoría');
    }
  }

  const categoriasFiltradas = categorias.filter((c) =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-900 sm:text-3xl">Gestión de Categorías</h1>
          <p className="mt-1 text-sm text-ink-500">
            Organiza los tipos de artículos en tu catálogo.
          </p>
        </div>
        <button onClick={() => abrirModal()} className="btn-primary">
          <Plus className="h-4 w-4" /> Nueva Categoría
        </button>
      </div>

      {/* Búsqueda */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input
          type="search"
          placeholder="Buscar categoría..."
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
      ) : categoriasFiltradas.length === 0 ? (
        <Vacio mensaje="No se encontraron categorías registradas." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm">
          <table className="w-full text-left text-sm text-ink-700">
            <thead className="border-b border-ink-100 bg-ink-50/50 text-xs font-semibold uppercase tracking-wider text-ink-500">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4">Descripción</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {categoriasFiltradas.map((c) => (
                <tr key={c.id} className="hover:bg-ink-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-semibold text-ink-400">
                    #{c.id}
                  </td>
                  <td className="px-6 py-4 font-medium text-ink-900 flex items-center gap-3">
                    {c.imagen ? (
                      <img
                        src={c.imagen}
                        alt={c.nombre}
                        className="h-10 w-10 rounded-lg object-cover bg-ink-100 flex-none"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-flame-50 text-flame-600 flex items-center justify-center flex-none">
                        <FolderTree className="h-5 w-5" />
                      </div>
                    )}
                    <span>{c.nombre}</span>
                  </td>
                  <td className="px-6 py-4 text-ink-500">
                    {c.descripcion || <span className="italic text-ink-300">Sin descripción</span>}
                  </td>
                  <td className="px-6 py-4">
                    {c.disponible ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-success-50 px-2.5 py-0.5 text-xs font-semibold text-success-700">
                        <Check className="h-3 w-3" /> Activa
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-ink-100 px-2.5 py-0.5 text-xs font-semibold text-ink-600">
                        <X className="h-3 w-3" /> Inactiva
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => abrirModal(c)}
                      className="rounded-lg p-2 text-ink-500 hover:bg-ink-100 hover:text-ink-900 transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEliminar(c.id)}
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
                {categoriaEditar ? 'Editar Categoría' : 'Nueva Categoría'}
              </h3>
              <button
                onClick={() => setModalAbierto(false)}
                className="rounded-lg p-1 text-ink-400 hover:bg-ink-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Imagen de Categoría */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-600 mb-1">
                  Imagen de Categoría
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
                  placeholder="Ej. Tazas, Textiles, Promocionales"
                />
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
                  placeholder="Detalles sobre esta categoría de productos..."
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-ink-700 font-medium pt-1">
                <input
                  type="checkbox"
                  checked={disponible}
                  onChange={(e) => setDisponible(e.target.checked)}
                  className="h-4 w-4 rounded border-ink-300 text-flame-600 focus:ring-flame-500"
                />
                Categoría Activa
              </label>

              <div className="flex items-center gap-2 pt-3">
                <button type="submit" disabled={guardando} className="btn-primary flex-1">
                  {guardando ? 'Guardando...' : 'Guardar Categoría'}
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