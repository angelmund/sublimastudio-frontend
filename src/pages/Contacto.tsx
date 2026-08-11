import { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { enviarMensaje } from '@/lib/api';

interface FormState {
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
}

const inicial: FormState = { nombre: '', email: '', asunto: '', mensaje: '' };

export default function Contacto() {
  const [form, setForm] = useState<FormState>(inicial);
  const [enviando, setEnviando] = useState(false);
  const [estado, setEstado] = useState<'idle' | 'ok' | 'error'>('idle');
  const [mensajeError, setMensajeError] = useState('');

  function actualizar(campo: keyof FormState, valor: string) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setEstado('idle');
    setMensajeError('');
    try {
      await enviarMensaje({
        nombre: form.nombre.trim(),
        email: form.email.trim(),
        asunto: form.asunto.trim() || null,
        mensaje: form.mensaje.trim(),
      });
      setEstado('ok');
      setForm(inicial);
    } catch (err) {
      setEstado('error');
      setMensajeError(err instanceof Error ? err.message : 'No se pudo enviar el mensaje.');
    } finally {
      setEnviando(false);
    }
  }

  const datos = [
    { icon: Mail, etiqueta: 'Email', valor: 'hola@sublimastudio.com', href: 'mailto:hola@sublimastudio.com' },
    { icon: Phone, etiqueta: 'Teléfono', valor: '+52 228 123 4567', href: 'tel:+522281234567' },
    { icon: MapPin, etiqueta: 'Taller', valor: 'Xalapa / Veracruz, México', href: undefined },
    { icon: Clock, etiqueta: 'Horario', valor: 'Lun–Vie · 9:00 a 18:00', href: undefined },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-ink-950 py-16 text-center text-white">
        <div className="container-page">
          <h1 className="text-4xl font-extrabold sm:text-5xl">Hablemos</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-ink-300">
            ¿Tienes una idea o necesitas una cotización? Escríbenos y te
            responderemos a la brevedad.
          </p>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.2fr]">
          {/* Datos de contacto */}
          <div>
            <h2 className="text-2xl font-bold">Datos de contacto</h2>
            <p className="mt-2 text-ink-500">
              Estamos disponibles para atenderte por cualquiera de estos canales.
            </p>
            <ul className="mt-6 space-y-4">
              {datos.map((d) => (
                <li
                  key={d.etiqueta}
                  className="flex items-start gap-4 rounded-2xl border border-ink-100 bg-white p-4 shadow-sm"
                >
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-flame-50 text-flame-600">
                    <d.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
                      {d.etiqueta}
                    </p>
                    {d.href ? (
                      <a
                        href={d.href}
                        className="text-base font-semibold text-ink-900 hover:text-flame-700"
                      >
                        {d.valor}
                      </a>
                    ) : (
                      <p className="text-base font-semibold text-ink-900">{d.valor}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 overflow-hidden rounded-2xl border border-ink-100 shadow-sm">
              <iframe
                title="Mapa del taller"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-96.93%2C19.51%2C-96.88%2C19.55&layer=mapnik"
                className="h-56 w-full"
                loading="lazy"
              />
            </div>
          </div>

          {/* Formulario */}
          <div className="rounded-3xl border border-ink-100 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-bold">Envíanos un mensaje</h2>
            <p className="mt-2 text-sm text-ink-500">
              Completa el formulario y te responderemos por email.
            </p>

            {estado === 'ok' && (
              <div className="mt-6 flex items-start gap-3 rounded-xl bg-success-50 p-4 text-success-700 animate-fade-up">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none" />
                <div>
                  <p className="font-semibold">¡Mensaje enviado!</p>
                  <p className="text-sm">Gracias por escribirnos. Te responderemos muy pronto.</p>
                </div>
              </div>
            )}

            {estado === 'error' && (
              <div className="mt-6 flex items-start gap-3 rounded-xl bg-error-50 p-4 text-error-700 animate-fade-up">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-none" />
                <div>
                  <p className="font-semibold">No se pudo enviar.</p>
                  <p className="text-sm">{mensajeError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-semibold text-ink-800">
                    Nombre <span className="text-flame-600">*</span>
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    required
                    value={form.nombre}
                    onChange={(e) => actualizar('nombre', e.target.value)}
                    className="campo-form mt-1.5"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-ink-800">
                    Email <span className="text-flame-600">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => actualizar('email', e.target.value)}
                    className="campo-form mt-1.5"
                    placeholder="tucorreo@ejemplo.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="asunto" className="block text-sm font-semibold text-ink-800">
                  Asunto
                </label>
                <input
                  id="asunto"
                  type="text"
                  value={form.asunto}
                  onChange={(e) => actualizar('asunto', e.target.value)}
                  className="campo-form mt-1.5"
                  placeholder="¿Sobre qué quieres hablar?"
                />
              </div>

              <div>
                <label htmlFor="mensaje" className="block text-sm font-semibold text-ink-800">
                  Mensaje <span className="text-flame-600">*</span>
                </label>
                <textarea
                  id="mensaje"
                  required
                  rows={5}
                  value={form.mensaje}
                  onChange={(e) => actualizar('mensaje', e.target.value)}
                  className="campo-form mt-1.5 resize-y"
                  placeholder="Cuéntanos tu idea, cantidades, fechas…"
                />
              </div>

              <button type="submit" disabled={enviando} className="btn-primary w-full">
                {enviando ? 'Enviando…' : (
                  <>Enviar mensaje <Send className="h-4 w-4" /></>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}