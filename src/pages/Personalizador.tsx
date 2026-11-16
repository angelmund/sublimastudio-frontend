import { useState } from 'react';
import { Upload, Sparkles, RotateCcw, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import VisorTaza3D from '@/components/VisorTaza3D';

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

const COLORES_TAZA = [
  { nombre: 'Cerámica Blanca', hex: '#ffffff' },
  { nombre: 'Mágica Negra', hex: '#1e1e24' },
  { nombre: 'Rosa Pastel', hex: '#fce7f3' },
  { nombre: 'Azul Cielo', hex: '#e0f2fe' },
];

export default function Personalizador() {
  const [imagenActiva, setImagenActiva] = useState<string>(DISENOS_EJEMPLO[0].url);
  const [colorTaza, setColorTaza] = useState<string>('#ffffff');
  const [escalaY, setEscalaY] = useState<number>(0.85);
  const [posicionY, setPosicionY] = useState<number>(0);

  function manejarSubidaArchivo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setImagenActiva(objectUrl);
  }

  return (
    <div className="container-page py-10">
      <div className="mb-8">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-flame-50 px-3 py-1 text-xs font-semibold text-flame-700">
          <Sparkles className="h-3.5 w-3.5" /> Vista previa 3D interactiva
        </span>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Personaliza tu taza</h1>
        <p className="mt-2 max-w-2xl text-ink-500">
          Elige un diseño de nuestra galería o sube tu propia imagen para ver cómo lucirá sublimada en 360°.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Columna izquierda: Visor 3D */}
        <div className="lg:col-span-7">
          <VisorTaza3D
            imagenUrl={imagenActiva}
            colorTaza={colorTaza}
            escalaY={escalaY}
            posicionY={posicionY}
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

          {/* 3. Color base de la taza */}
          <div>
            <span className="mb-2 block text-sm font-semibold text-ink-800">
              3. Color de taza
            </span>
            <div className="flex flex-wrap gap-2.5">
              {COLORES_TAZA.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setColorTaza(c.hex)}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all ${
                    colorTaza === c.hex
                      ? 'border-flame-600 bg-flame-50 text-flame-800'
                      : 'border-ink-200 text-ink-700 hover:bg-ink-50'
                  }`}
                >
                  <span
                    className="h-4 w-4 rounded-full border border-ink-300"
                    style={{ backgroundColor: c.hex }}
                  />
                  {c.nombre}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Ajuste de tamaño y altura */}
          <div className="space-y-3 rounded-2xl bg-ink-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Ajuste de impresión
              </span>
              <button
                type="button"
                onClick={() => {
                  setEscalaY(0.85);
                  setPosicionY(0);
                }}
                className="inline-flex items-center gap-1 text-xs font-medium text-flame-600 hover:text-flame-700"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Restablecer
              </button>
            </div>

            <div>
              <div className="flex justify-between text-xs text-ink-600">
                <span>Alto del diseño</span>
                <span>{Math.round(escalaY * 100)}%</span>
              </div>
              <input
                type="range"
                min={0.4}
                max={0.96}
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
            <ShoppingBag className="h-4 w-4" /> Cotizar esta taza personalizada
          </Link>
        </div>
      </div>
    </div>
  );
}