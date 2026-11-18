import { useState } from 'react';
import { Upload, RotateCcw, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import VisorProducto3D, {
  TipoProducto3D,
  ConfigColor,
  TamanoPlaca,
  OrientacionPlaca,
} from '@/components/VisorProducto3D';

const PRODUCTOS_3D: { id: TipoProducto3D; nombre: string; subtitulo: string }[] = [
  { id: 'taza', nombre: 'Taza 11 oz', subtitulo: 'Cerámica blanca o int. de color' },
  { id: 'termo', nombre: 'Termo 20 oz', subtitulo: 'Skinny blanco con popote' },
  { id: 'placa', nombre: 'Placa aluminio', subtitulo: '20×30 cm y 40×60 cm' },
];

const DISENOS_EJEMPLO = [
  {
    id: 1,
    nombre: 'Floral Acuarela',
    url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80',
  },
  {
    id: 2,
    nombre: 'Arte Geométrico',
    url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80',
  },
  {
    id: 3,
    nombre: 'Galaxia Neón',
    url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80',
  },
  {
    id: 4,
    nombre: 'Minimalista Café',
    url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
  },
];

const OPCIONES_COLOR: ConfigColor[] = [
  { nombre: 'Blanca Clásica', exterior: '#ffffff', interior: '#ffffff', asa: '#ffffff' },
  { nombre: 'Mágica Negra', exterior: '#1e1e24', interior: '#1e1e24', asa: '#1e1e24' },
  {
    nombre: 'Int. Azul Acero',
    exterior: '#ffffff',
    interior: '#3D6B9D',
    asa: '#3D6B9D',
    esInteriorColor: true,
  },
  {
    nombre: 'Int. Verde Manzana',
    exterior: '#ffffff',
    interior: '#9DBA4F',
    asa: '#9DBA4F',
    esInteriorColor: true,
  },
  {
    nombre: 'Int. Negro',
    exterior: '#ffffff',
    interior: '#18181b',
    asa: '#18181b',
    esInteriorColor: true,
  },
  {
    nombre: 'Int. Rojo',
    exterior: '#ffffff',
    interior: '#b91c1c',
    asa: '#b91c1c',
    esInteriorColor: true,
  },
  {
    nombre: 'Int. Amarillo',
    exterior: '#ffffff',
    interior: '#eab308',
    asa: '#eab308',
    esInteriorColor: true,
  },
  { nombre: 'Azul Acero Sólido', exterior: '#3D6B9D', interior: '#3D6B9D', asa: '#3D6B9D' },
  { nombre: 'Verde Lima Sólido', exterior: '#9DBA4F', interior: '#9DBA4F', asa: '#9DBA4F' },
];

export default function Personalizador() {
  const [tipoProducto, setTipoProducto] = useState<TipoProducto3D>('taza');
  const [imagenActiva, setImagenActiva] = useState<string>(DISENOS_EJEMPLO[0].url);
  const [colorSeleccionado, setColorSeleccionado] = useState<ConfigColor>(OPCIONES_COLOR[2]);
  const [tamanoPlaca, setTamanoPlaca] = useState<TamanoPlaca>('20x30');
  const [orientacionPlaca, setOrientacionPlaca] = useState<OrientacionPlaca>('vertical');
  const [escalaY, setEscalaY] = useState<number>(1.0);
  const [posicionY, setPosicionY] = useState<number>(0);

  function manejarSubidaArchivo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setImagenActiva(objectUrl);
  }

  const productoActual = PRODUCTOS_3D.find((p) => p.id === tipoProducto)!;

  return (
    <div className="container-page py-10">
      <div className="mb-8">
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
          Personaliza tu {productoActual.nombre.toLowerCase()}
        </h1>
        <p className="mt-2 max-w-2xl text-ink-500">
          Elige el artículo, selecciona un diseño de nuestra galería o sube tu propia imagen para ver cómo lucirá sublimado en 360°.
        </p>
      </div>

      {/* Selector de producto (3 columnas ahora) */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {PRODUCTOS_3D.map((prod) => {
          const activo = tipoProducto === prod.id;
          return (
            <button
              key={prod.id}
              type="button"
              onClick={() => {
                setTipoProducto(prod.id);
                setEscalaY(1.0);
                setPosicionY(0);
              }}
              className={`rounded-2xl border p-3.5 text-left transition-all ${
                activo
                  ? 'border-flame-600 bg-flame-50/70 ring-2 ring-flame-200'
                  : 'border-ink-200 bg-white hover:border-ink-300'
              }`}
            >
              <div className="text-sm font-bold text-ink-900">{prod.nombre}</div>
              <div className="mt-0.5 text-xs text-ink-500">{prod.subtitulo}</div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Columna izquierda: Visor 3D */}
        <div className="lg:col-span-7">
          <VisorProducto3D
            tipoProducto={tipoProducto}
            imagenUrl={imagenActiva}
            colorConfig={colorSeleccionado}
            escalaY={escalaY}
            posicionY={posicionY}
            tamanoPlaca={tamanoPlaca}
            orientacionPlaca={orientacionPlaca}
          />
        </div>

        {/* Columna derecha: Controles y Carrusel */}
        <div className="space-y-6 rounded-3xl border border-ink-100 bg-white p-6 shadow-sm lg:col-span-5">
          {/* 1. Subir imagen propia */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-ink-800">
              1. Sube tu propio diseño o foto
            </label>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-ink-200 bg-ink-50/50 px-4 py-4 text-sm font-semibold text-ink-700 transition-colors hover:border-flame-400 hover:bg-flame-50/40">
              <Upload className="h-5 w-5 text-flame-600" />
              <span>Seleccionar imagen (PNG, JPG)</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={manejarSubidaArchivo}
                className="hidden"
              />
            </label>
          </div>

          {/* 2. Carrusel de diseños predefinidos */}
          <div>
            <span className="mb-2 block text-sm font-semibold text-ink-800">
              2. O elige un diseño del catálogo
            </span>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {DISENOS_EJEMPLO.map((d) => {
                const seleccionado = imagenActiva === d.url;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setImagenActiva(d.url)}
                    className={`group relative h-20 w-24 flex-none overflow-hidden rounded-xl border-2 transition-all ${
                      seleccionado
                        ? 'border-flame-600 ring-2 ring-flame-200'
                        : 'border-ink-200 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={d.url}
                      alt={d.nombre}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute inset-x-0 bottom-0 truncate bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
                      {d.nombre}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3A. Color (solo para Taza) */}
          {tipoProducto === 'taza' && (
            <div>
              <span className="mb-2 block text-sm font-semibold text-ink-800">
                3. Color de taza
              </span>
              <div className="flex flex-wrap gap-2">
                {OPCIONES_COLOR.map((c) => {
                  const activo = colorSeleccionado.nombre === c.nombre;
                  return (
                    <button
                      key={c.nombre}
                      type="button"
                      onClick={() => setColorSeleccionado(c)}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all ${
                        activo
                          ? 'border-flame-600 bg-flame-50 text-flame-800'
                          : 'border-ink-200 text-ink-700 hover:bg-ink-50'
                      }`}
                    >
                      <span
                        className="h-4 w-4 rounded-full border border-ink-300"
                        style={{
                          background: c.esInteriorColor
                            ? `linear-gradient(135deg, ${c.exterior} 50%, ${c.interior} 50%)`
                            : c.exterior,
                        }}
                      />
                      {c.nombre}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3B. Medida y orientación (solo para Placa de aluminio) */}
          {tipoProducto === 'placa' && (
            <div className="space-y-3">
              <div>
                <span className="mb-2 block text-sm font-semibold text-ink-800">
                  3. Medida de placa de aluminio
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  {(['20x30', '40x60'] as TamanoPlaca[]).map((medida) => (
                    <button
                      key={medida}
                      type="button"
                      onClick={() => setTamanoPlaca(medida)}
                      className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                        tamanoPlaca === medida
                          ? 'border-flame-600 bg-flame-50 text-flame-800'
                          : 'border-ink-200 text-ink-700 hover:bg-ink-50'
                      }`}
                    >
                      {medida === '20x30' ? '20 × 30 cm (Estándar)' : '40 × 60 cm (Grande)'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="mb-1.5 block text-xs font-semibold text-ink-600">
                  Orientación
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  {(['vertical', 'horizontal'] as OrientacionPlaca[]).map((ori) => (
                    <button
                      key={ori}
                      type="button"
                      onClick={() => setOrientacionPlaca(ori)}
                      className={`rounded-xl border px-3 py-1.5 text-xs font-medium capitalize transition-all ${
                        orientacionPlaca === ori
                          ? 'border-flame-600 bg-flame-50 text-flame-800'
                          : 'border-ink-200 text-ink-700 hover:bg-ink-50'
                      }`}
                    >
                      {ori}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. Ajuste de tamaño y altura */}
          <div className="space-y-3 rounded-2xl bg-ink-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Ajuste de impresión
              </span>
              <button
                type="button"
                onClick={() => {
                  setEscalaY(1.0);
                  setPosicionY(0);
                }}
                className="inline-flex items-center gap-1 text-xs font-medium text-flame-600 hover:text-flame-700"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Restablecer
              </button>
            </div>

            <div>
              <div className="flex justify-between text-xs text-ink-600">
                <span>Alto del diseño (100%)</span>
                <span>{Math.round(escalaY * 100)}%</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={1.0}
                step={0.02}
                value={escalaY}
                onChange={(e) => setEscalaY(parseFloat(e.target.value))}
                className="mt-1 w-full accent-flame-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-ink-600">
                <span>Posición vertical</span>
                <span>{posicionY > 0 ? `+${posicionY.toFixed(2)}` : posicionY.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={-0.35}
                max={0.35}
                step={0.02}
                value={posicionY}
                onChange={(e) => setPosicionY(parseFloat(e.target.value))}
                className="mt-1 w-full accent-flame-600"
              />
            </div>
          </div>

          <Link to="/contacto" className="btn-primary w-full justify-center">
            <ShoppingBag className="h-4 w-4" /> Cotizar {productoActual.nombre.toLowerCase()} personalizada
          </Link>
        </div>
      </div>
    </div>
  );
}