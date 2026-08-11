import { Link } from 'react-router-dom';
import {
  Flame,
  Heart,
  Leaf,
  Award,
  Users,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

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
    // { anio: '2018', texto: 'Nace SublimaStudio como un proyecto enfocado en la personalización de calidad.' },
    // { anio: '2020', texto: 'Ampliamos el catálogo e incorporamos nuevas líneas de textiles y tazas.' },
    // { anio: '2023', texto: 'Integramos equipos de sublimación de alta precisión para detalles nítidos.' },
  { anio: '2026', texto: 'Iniciamos nuestra cadena de producción y lanzamos nuestra plataforma digital interactiva para pedidos en línea.' },
];

export default function SobreNosotros() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <div className="absolute inset-0">
          <div className="absolute -left-20 top-0 h-80 w-80 rounded-full bg-flame-600/20 blur-3xl" />
        </div>
        <div className="container-page relative py-20 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-flame-400/30 bg-flame-500/10 px-3 py-1 text-xs font-semibold text-flame-300">
            <Sparkles className="h-3.5 w-3.5" /> Nuestra historia
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl">
            Damos vida a tus ideas con{' '}
            <span className="bg-gradient-to-r from-flame-400 to-flame-600 bg-clip-text text-transparent">
              color y durabilidad
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink-300">
            Somos un equipo especializado en artículos para sublimación. Ayudamos
            a empresas, negocios y particulares a crear productos personalizados
            con acabados profesionales.
          </p>
        </div>
      </section>

      {/* Historia */}
      <section className="container-page py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/5650062/pexels-photo-5650062.jpeg?auto=compress&cs=tinysrgb&w=900"
              alt="Taller de sublimación"
              className="aspect-[4/3] w-full rounded-3xl object-cover shadow-xl"
            />
            <div className="absolute -bottom-6 -right-4 hidden rounded-2xl bg-flame-600 px-6 py-5 text-white shadow-xl sm:block">
              <p className="text-3xl font-extrabold">100%</p>
              <p className="text-sm text-flame-100">Garantía de nitidez y color</p>
            </div>
          </div>
          <div>
            <span className="text-sm font-semibold uppercase tracking-wide text-flame-600">
              Quiénes somos
            </span>
            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Pasión por el detalle</h2>
            <div className="mt-5 space-y-4 leading-relaxed text-ink-600">
              <p>
                En SublimaStudio creemos que cada objeto impreso cuenta una historia.
                Combinamos tecnología de precisión con una inspección artesanal en cada pieza.
              </p>
              <p>
                Trabajamos con los mejores insumos del mercado para garantizar
                colores vivos que no se desvanecen con el tiempo ni con el lavado.
              </p>
              <p>
                Te brindamos asesoría personalizada para elegir la prenda o artículo ideal
                según tu necesidad: eventos empresariales, regalos promocionales o proyectos personales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="bg-sand-50 py-16">
        <div className="container-page">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wide text-flame-600">
              Nuestros valores
            </span>
            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Lo que nos define</h2>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {valores.map((v) => (
              <div
                key={v.titulo}
                className="rounded-2xl border border-ink-100 bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-flame-50 text-flame-600">
                  <v.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-ink-900">{v.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{v.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Línea temporal */}
      <section className="container-page py-16">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-flame-600">
            Trayectoria
          </span>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Nuestro recorrido</h2>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {hitos.map((h) => (
            <div key={h.anio} className="relative rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-flame-600 text-white">
                <Flame className="h-5 w-5" />
              </div>
              <p className="mt-4 text-2xl font-extrabold text-flame-700">{h.anio}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-600">{h.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-page pb-20">
        <div className="rounded-3xl bg-gradient-to-br from-flame-600 to-flame-700 px-6 py-14 text-center shadow-xl sm:px-12">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">¿Hablamos de tu proyecto?</h2>
          <p className="mx-auto mt-3 max-w-xl text-flame-100">
            Estaremos encantados de asesorarte y prepararte una propuesta a medida.
          </p>
          <Link
            to="/contacto"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-flame-700 shadow-md transition-transform hover:scale-[1.03]"
          >
            Contáctanos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}