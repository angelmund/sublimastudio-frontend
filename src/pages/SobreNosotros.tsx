import { Link } from 'react-router-dom';
import {
  Flame,
  Heart,
  Leaf,
  Award,
  Users,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

// --- MASCOTA SVG: "PINCELITO" (Versión Delgada y Elegante) ---
// Inspirada directamente en tu logo, con colores exactos y trazo curvo.
const MascotaPincel = () => (
  <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Sombra base */}
    <ellipse cx="100" cy="220" rx="60" ry="12" fill="#1A2B4C" opacity="0.1" />
    
    {/* Trazo curvo inferior (Como en tu logo) */}
    <path d="M 40 200 Q 100 170 160 200" stroke="#1A2B4C" strokeWidth="6" strokeLinecap="round" fill="none" />

    {/* Mango del pincel (Más delgado) */}
    <rect x="88" y="140" width="24" height="60" rx="6" fill="#1A2B4C" />
    {/* Brillo del mango */}
    <rect x="92" y="145" width="6" height="50" rx="3" fill="#2A3B5C" opacity="0.4" />
    
    {/* Anillo metálico (Férula) - Más alto y delgado */}
    <rect x="82" y="110" width="36" height="30" rx="4" fill="#CBD5E1" />
    <rect x="82" y="118" width="36" height="3" fill="#94A3B8" />
    <rect x="82" y="130" width="36" height="3" fill="#94A3B8" />
    
    {/* Cerdas del pincel (Más altas y puntiagudas) */}
    <path d="M82 110 C 70 80, 70 30, 100 10 C 130 30, 130 80, 118 110 Z" fill="url(#brushGradient)" />
    
    {/* Contorno oscuro de las cerdas para darle el estilo del logo */}
    <path d="M82 110 C 70 80, 70 30, 100 10 C 130 30, 130 80, 118 110" stroke="#1A2B4C" strokeWidth="2" fill="none" />

    {/* Ojos (En la férula) */}
    <circle cx="93" cy="125" r="3.5" fill="#1A2B4C" />
    <circle cx="107" cy="125" r="3.5" fill="#1A2B4C" />
    {/* Brillos de los ojos */}
    <circle cx="94" cy="124" r="1.2" fill="white" />
    <circle cx="108" cy="124" r="1.2" fill="white" />
    
    {/* Mejillas sonrojadas */}
    <circle cx="86" cy="130" r="3" fill="#FF6B35" opacity="0.4" />
    <circle cx="114" cy="130" r="3" fill="#FF6B35" opacity="0.4" />
    
    {/* Sonrisa */}
    <path d="M96 130 Q 100 134 104 130" stroke="#1A2B4C" strokeWidth="2" strokeLinecap="round" fill="none" />
    
    {/* Brazos (Saludando) */}
    <path d="M88 155 Q 70 150 75 140" stroke="#1A2B4C" strokeWidth="4" strokeLinecap="round" fill="none" />
    <path d="M112 160 Q 130 155 125 145" stroke="#1A2B4C" strokeWidth="4" strokeLinecap="round" fill="none" />

    {/* Degradado exacto de tu logo */}
    <defs>
      <linearGradient id="brushGradient" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#E91E63" />   {/* Rosa */}
        <stop offset="50%" stopColor="#FF6B35" />  {/* Naranja */}
        <stop offset="100%" stopColor="#FFD166" /> {/* Amarillo */}
      </linearGradient>
    </defs>
  </svg>
);

const valores = [
  {
    icon: Award,
    titulo: 'Calidad garantizada',
    texto: 'Seleccionamos solo materiales con recubrimiento de polímero de primera para un acabado impecable.',
  },
  {
    icon: Heart,
    titulo: 'Atención cercana',
    texto: 'Te acompañamos en todo el proceso, desde la idea hasta el producto final impreso.',
  },
  {
    icon: Leaf,
    titulo: 'Compromiso sostenible',
    texto: 'Optimizamos consumibles y trabajamos con insumos de alta eficiencia y bajo desperdicio.',
  },
  {
    icon: Users,
    titulo: 'Hecho para ti',
    texto: 'Cada pedido es único. Personalizamos cantidades, diseños y plazos según tu proyecto.',
  },
];

const hitos = [
  { anio: '2026', texto: 'Iniciamos nuestra cadena de producción y lanzamos nuestra plataforma digital interactiva para pedidos en línea.' },
];

export default function SobreNosotros() {
  return (
    <div className="bg-white overflow-hidden">
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <div className="absolute inset-0">
          <div className="absolute -left-20 top-0 h-96 w-96 rounded-full bg-flame-600/20 blur-3xl" />
          <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-flame-400/10 blur-3xl" />
        </div>
        <div className="container-page relative py-24 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-flame-300 backdrop-blur-sm">
            <Sparkles className="h-4 w-4" /> Sobre Nosotros
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl">
            Damos vida a tus ideas con{' '}
            <span className="bg-gradient-to-r from-flame-400 to-flame-600 bg-clip-text text-transparent">
              color y durabilidad
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-300">
            Somos un equipo especializado en artículos para sublimación. Ayudamos
            a empresas, negocios y particulares a crear productos personalizados
            con acabados profesionales.
          </p>
        </div>
      </section>

      {/* Historia / Quiénes Somos */}
      <section className="container-page py-24">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
          
          {/* Columna Izquierda: Mascota y Elementos Flotantes */}
          <div className="relative flex justify-center lg:justify-start">
            {/* Fondo decorativo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-gradient-to-br from-flame-100 to-sand-200 blur-3xl opacity-70" />
            
            {/* Contenedor de la Mascota - Hice el contenedor más alto para que luzca el pincel delgado */}
            <div className="relative z-10 w-56 h-80 sm:w-64 sm:h-96">
              <MascotaPincel />
            </div>

            {/* Etiqueta Flotante 1 */}
            <div className="absolute top-4 right-0 sm:right-4 z-20 flex items-center gap-2 rounded-2xl bg-white px-5 py-3 shadow-xl border border-ink-50 animate-bounce-slow">
              <CheckCircle2 className="h-5 w-5 text-flame-600" />
              <span className="text-sm font-bold text-ink-900">100% Garantizado</span>
            </div>

            {/* Etiqueta Flotante 2 */}
            <div className="absolute bottom-8 left-0 sm:left-4 z-20 flex items-center gap-3 rounded-2xl bg-ink-950 px-5 py-4 shadow-xl text-white">
              <Flame className="h-6 w-6 text-flame-500" />
              <div>
                <p className="text-xs text-ink-300">Acabado</p>
                <p className="text-sm font-bold">Profesional</p>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Texto */}
          <div className="relative z-10">
            <span className="text-sm font-semibold uppercase tracking-wider text-flame-600">
              Quiénes somos
            </span>
            <h2 className="mt-3 text-4xl font-extrabold sm:text-5xl text-ink-900 leading-tight">
              Pasión por la <br />
              <span className="text-flame-600">expresión artesanal</span>
            </h2>
            <div className="mt-8 space-y-6 text-lg leading-relaxed text-ink-600">
              <p>
                En <strong className="text-ink-900 font-bold">Expresión Sublime</strong> creemos que cada objeto impreso cuenta una historia.
                Combinamos tecnología de precisión con una inspección artesanal en cada pieza.
              </p>
              <p>
                Trabajamos con los mejores insumos del mercado para garantizar
                colores vivos que no se desvanecen con el tiempo ni con el lavado.
              </p>
              <div className="rounded-2xl bg-sand-50 p-6 border-l-4 border-flame-600">
                <p className="text-base italic text-ink-700">
                  "Te brindamos asesoría personalizada para elegir la prenda o artículo ideal
                  según tu necesidad: eventos empresariales, regalos promocionales o proyectos personales."
                </p>
              </div>
            </div>
            
            <div className="mt-10">
              <Link
                to="/contacto"
                className="inline-flex items-center gap-2 rounded-xl bg-ink-950 px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:bg-ink-900"
              >
                Contáctanos <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="bg-ink-950 py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-flame-600/10 blur-3xl" />
        <div className="container-page relative">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-flame-400">
              Nuestros valores
            </span>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl text-white">Lo que nos define</h2>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {valores.map((v) => (
              <div
                key={v.titulo}
                className="group rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 p-8 transition-all hover:bg-white/10 hover:-translate-y-2"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-flame-600/20 text-flame-400 group-hover:bg-flame-600 group-hover:text-white transition-colors">
                  <v.icon className="h-7 w-7" />
                </span>
                <h3 className="mt-6 text-xl font-bold text-white">{v.titulo}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-300">{v.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Línea temporal */}
      <section className="container-page py-24">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-flame-600">
            Trayectoria
          </span>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl text-ink-900">Nuestro recorrido</h2>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {hitos.map((h) => (
            <div key={h.anio} className="relative rounded-3xl border border-ink-100 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-flame-500 to-flame-700 text-white shadow-md">
                <Flame className="h-7 w-7" />
              </div>
              <p className="mt-6 text-4xl font-black text-ink-900">{h.anio}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">{h.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section className="container-page pb-24">
        <div className="rounded-[2.5rem] bg-gradient-to-br from-flame-600 to-flame-700 px-6 py-20 text-center shadow-2xl sm:px-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-black/10 blur-3xl" />
          
          <h2 className="text-4xl font-extrabold text-white sm:text-5xl relative z-10">
            ¿Hablamos de tu proyecto?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-flame-100 relative z-10">
            Estaremos encantados de asesorarte y prepararte una propuesta a medida.
          </p>
          <Link
            to="/contacto"
            className="relative z-10 mt-10 inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-4 text-base font-bold text-flame-700 shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
          >
            Contáctanos <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}