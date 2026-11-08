import { useState, useEffect, useMemo, FormEvent } from 'react';
import { Plus, Edit2, Trash2, Check, X, Package, Power, } from 'lucide-react';
import {
  getAdminProductos,
  getCategorias,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  activarProducto, 
} from '@/lib/api';
import axios from 'axios';
import type { Categoria } from '@/types/catalogo';
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
  const [productos, setProductos] = useState<any[]>([]); 
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const { showToast } = useToast();
  const [erroresForm, setErroresForm] = useState<Record<string, string>>({});
  
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoEditar, setProductoEditar] = useState<any | null>(null);
  const [guardando, setGuardando] = useState(false);

  const [productoEliminar, setProductoEliminar] = useState<any | null>(null);
  const [eliminando, setEliminando] = useState(false);

  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [activo, setactivo] = useState(true);
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

  const isActivo = (valor: any) => valor === true || valor === 1 || valor === '1' || valor === 'true';

  function abrirModal(p?: any) {
    setErroresForm({});
    if (p) {
      setProductoEditar(p);
      setNombre(p.nombre || '');
      setPrecio((p.precio_base || p.precio || 0).toString());
      setCategoriaId(p.categoria?.id?.toString() || p.categoria_id?.toString() || '');
      setDescripcion(p.descripcion || '');
      setactivo(isActivo(p.activo));
      setPreviewImagen(p.imagen || null);
    } else {
      setProductoEditar(null);
      setNombre('');
      setPrecio('');
      setCategoriaId('');
      setDescripcion('');
      setactivo(true);
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
    
    
    if (Number(precio) <= 0) {
        showToast('El precio debe ser mayor a $0', 'error');
        return;
    }

    try {
      setGuardando(true);
      setErroresForm({});
      
      const formData = new FormData();
      formData.append('nombre', nombre.trim());
      formData.append('precio_base', precio);
      formData.append('categoria', categoriaId);
      formData.append('descripcion', descripcion.trim());
      formData.append('activo', activo ? '1' : '0');

      if (archivoImagen) formData.append('imagen_muestra', archivoImagen);

      let respuesta;
      if (productoEditar) {
        respuesta = await actualizarProducto(productoEditar.id, formData);
      } else {
        respuesta = await crearProducto(formData);
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
          showToast('Error de red: El servidor rechazó la conexión o la imagen excede el límite del servidor.', 'error');
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
    if (!productoEliminar) return;
    try {
      setEliminando(true);
      await eliminarProducto(productoEliminar.id);
      setProductoEliminar(null);
      showToast('Producto eliminado (desactivado) correctamente', 'success');
      await cargarDatos();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al eliminar', 'error');
    } finally {
      setEliminando(false);
    }
  }

  
  async function handleActivarProducto(id: number) {
    try {
      await activarProducto(id);
      showToast('Producto reactivado correctamente', 'success');
      await cargarDatos();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al reactivar el producto', 'error');
    }
  }

  const productosFiltrados = useMemo(
    () => productos.filter((p) => p.nombre.toLowerCase().includes(busqueda.toLowerCase())),
    [productos, busqueda],
  );

  const columnas: Column<any>[] = [
    {
      key: 'producto',
      header: 'Producto',
      render: (p) => (
        <div className="flex min-w-0 items-center gap-4">
          {p.imagen ? (
            <img src={p.imagen} alt={p.nombre} className="h-10 w-10 shrink-0 rounded-lg bg-ink-100 object-cover" />
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
      render: (p) => <span className="text-ink-500">{p.categoria?.nombre ?? 'Sin Categoría'}</span>,
    },
    {
      key: 'precio',
      header: 'Precio',
      render: (p) => <span className="font-semibold text-ink-900">${Number(p.precio_base || p.precio || 0).toFixed(2)} MXN</span>,
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (p) => isActivo(p.activo) ? (
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
      render: (p) => (
        <div className="flex justify-end gap-1">
          <button onClick={() => abrirModal(p)} className="rounded-lg p-2 text-ink-500 hover:bg-ink-100 hover:text-ink-900 cursor-pointer" title="Editar">
            <Edit2 className="h-4 w-4" />
          </button>
          
          {/* Mostramos el botón de Eliminar si está activo, o el de Reactivar si está inactivo */}
          {isActivo(p.activo) ? (
            <button onClick={() => setProductoEliminar(p)} className="rounded-lg p-2 text-red-500 hover:bg-red-50 hover:text-red-700 cursor-pointer" title="Desactivar">
              <Trash2 className="h-4 w-4" />
            </button>
          ) : (
            <button onClick={() => handleActivarProducto(p.id)} className="rounded-lg p-2 text-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer" title="Reactivar">
              <Power className="h-4 w-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-10xl space-y-8">
      <PageHeader title="Productos" subtitle="Agrega, edita o elimina artículos de tu catálogo." />

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <SearchInput value={busqueda} onChange={setBusqueda} placeholder="Buscar producto..." />
        <Button icon={<Plus className="h-4 w-4" />} onClick={() => abrirModal()}>Nuevo Producto</Button>
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

      <FormModal open={modalAbierto} onClose={() => setModalAbierto(false)} title={productoEditar ? 'Editar Producto' : 'Nuevo Producto'} onSubmit={handleSubmit} submitting={guardando} submitLabel={productoEditar ? 'Guardar cambios' : 'Crear producto'}>
        <ImageUpload label="Imagen de Muestra" previewUrl={previewImagen} fileName={archivoImagen?.name} onSelect={handleSelectImagen} />
        {erroresForm.imagen_muestra && <p className="mt-1 text-xs font-medium text-red-600">{erroresForm.imagen_muestra}</p>}
        <Field label="Nombre" required error={erroresForm.nombre}>
          <Input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Taza Mágica 11oz" invalid={!!erroresForm.nombre} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Precio Base (MXN)" required error={erroresForm.precio_base}>
            {/* AQUÍ LIMITAMOS EL INPUT A MÍNIMO 0.01 */}
            <Input type="number" step="0.01" min="0.01" value={precio} onChange={(e) => setPrecio(e.target.value)} placeholder="0.00" invalid={!!erroresForm.precio_base} />
          </Field>
          <Field label="Categoría" required error={erroresForm.categoria}>
            <Select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} invalid={!!erroresForm.categoria}>
              <option value="">Selecciona...</option>
              {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </Select>
          </Field>
        </div>
        <Field label="Descripción" error={erroresForm.descripcion}>
          <Textarea rows={3} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Detalles del artículo..." invalid={!!erroresForm.descripcion} />
        </Field>
        <label className="flex items-center gap-2 text-sm font-medium text-ink-700">
          <input type="checkbox" checked={activo} onChange={(e) => setactivo(e.target.checked)} className="h-4 w-4 rounded border-ink-300 text-flame-600 focus:ring-flame-500" />
          Disponible para venta (Activo)
        </label>
      </FormModal>

      <ConfirmDialog open={!!productoEliminar} title="Eliminar producto" message={`¿Seguro que quieres eliminar "${productoEliminar?.nombre}"? Puede volver a activar el artículo.`} confirmLabel="Sí, eliminar" loading={eliminando} onConfirm={confirmarEliminar} onCancel={() => setProductoEliminar(null)} />
    </div>
  );
}