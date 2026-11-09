import { useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { ArrowRightIcon, ChevronDownIcon, HeartSolidIcon, RocketIcon, SparkleIcon, StarSolidIcon } from '../components/icons'
import { cx } from '../components/ui'
import { useApp } from '../context/AppContext'
import { BENEFITS, FAQS, JOURNEY_STOPS, TESTIMONIALS } from '../data/landingData'

/*
 * Landing (diseño entregado como lan.png · frame "94" de Figma, 1440 × 5719).
 * Siempre oscura, como el diseño. Colores de sección tomados del PNG:
 *   #002e42 (navy) y #0d2838 (navy profundo); tarjetas #1a3442.
 *
 * Escala responsiva: el diseño se dibujó a 1440 px con tipos muy grandes.
 * Aquí los tamaños son fluidos (clamp con vw y vh) para que el hero entre
 * completo en la primera pantalla de una laptop (1280 × 720) y en móvil.
 */

const FEATURES = [
  {
    icon: <HeartSolidIcon className="size-8 text-brand" />,
    title: 'Descubre tus fortalezas',
    text: 'Identifica tus habilidades y talentos principales para orientar mejor tus decisiones.',
  },
  {
    icon: <StarSolidIcon className="size-[30px] text-brand" />,
    title: 'Explora tus intereses',
    text: 'Conoce las áreas profesionales que más se alinean con lo que te apasiona.',
  },
  {
    icon: <RocketIcon className="size-[30px] text-brand" />,
    title: 'Encuentra tu camino',
    text: 'Recibe una recomendación personalizada de carreras o áreas de estudio ideales para ti.',
  },
]

const NAV = [
  { href: '#beneficios', label: 'Beneficios' },
  { href: '#testimonios', label: 'Testimonios' },
  { href: '#preguntas', label: 'Preguntas' },
]

/** Espaciado vertical común de las secciones */
const SECTION_Y = 'py-[clamp(48px,6vw,88px)]'
/** Ancho máximo común del contenido (todas las secciones alineadas al mismo borde) */
const CONTAINER = 'mx-auto w-full max-w-[1120px]'

function SectionTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={cx('text-[clamp(1.75rem,3.2vw,3rem)] leading-[1.12] font-bold tracking-[-0.02em] text-white', className)}>{children}</h2>
  )
}

/* ---------- Pregunta frecuente (acordeón accesible) ---------- */
function FaqItem({ q, a, first }: { q: string; a: string; first: boolean }) {
  const [open, setOpen] = useState(false)
  const id = q.replace(/\W+/g, '-')
  return (
    <div className={cx('border-white/45', !first && 'border-t')}>
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((o) => !o)}
          className="flex min-h-[72px] w-full cursor-pointer items-center justify-between gap-6 px-5 text-left text-lg font-semibold text-white md:min-h-[84px] md:px-6 md:text-xl"
        >
          {q}
          <ChevronDownIcon className={cx('h-2.5 w-5 shrink-0 text-white transition-transform', open && 'rotate-180')} />
        </button>
      </h3>
      <div id={id} hidden={!open} className="px-5 pb-6 text-base leading-7 text-white/85 md:px-6 md:text-lg">
        {a}
      </div>
    </div>
  )
}

/** Figma: frame "94" / lan.png — Página de inicio */
export default function Landing() {
  const navigate = useNavigate()
  const { lastRoute, answeredCount } = useApp()
  const canResume = Boolean(lastRoute) && answeredCount > 0
  const start = () => navigate('/login')

  return (
    <div className="min-h-screen overflow-x-clip bg-navy text-white [color-scheme:dark]">
      {/* ---------- Navegación ---------- */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-navy/95 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-[1240px] items-center justify-between gap-4 px-5 md:h-[72px] md:px-10" aria-label="Principal">
          <Link to="/" aria-label="trabajito, inicio">
            <Logo className="w-[112px] text-white md:w-[132px]" />
          </Link>
          <ul className="hidden items-center gap-8 md:flex">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="text-base text-white/75 transition hover:text-white lg:text-lg">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={start}
            className="h-10 cursor-pointer rounded-full bg-action px-5 text-sm font-bold text-white transition hover:brightness-110 md:px-6"
          >
            Empezar test
          </button>
        </nav>
      </header>

      <main>
        {/* ---------- Hero: ocupa exactamente la primera pantalla ---------- */}
        <section className="relative">
          <div className="mx-auto grid max-w-[1240px] items-center gap-6 px-5 pt-8 pb-10 md:px-10 lg:min-h-[calc(100svh-72px)] lg:grid-cols-[1.15fr_1fr] lg:gap-10 lg:py-6">
            <div className="flex flex-col gap-[clamp(14px,2.2vh,24px)]">
              <h1 className="text-[clamp(2.6rem,min(6.4vw,10.5vh),6.5rem)] leading-[1.02] font-normal tracking-[-0.01em]">
                Test de orientación vocacional
              </h1>
              <p className="max-w-[34ch] text-[clamp(1.05rem,1.6vw,1.375rem)] leading-[1.5] text-white/90">
                Inicia un viaje de autodescubrimiento que transformará tu futuro.
              </p>
              <div className="mt-[clamp(4px,1vh,12px)] flex flex-col items-start gap-3">
                <button
                  type="button"
                  onClick={start}
                  className="flex h-14 cursor-pointer items-center justify-center gap-3 rounded-full border-[1.5px] border-white bg-white/8 px-8 shadow-[0_6px_60px_rgb(51_161_184/0.4)] transition hover:bg-white/15 md:h-16 md:px-10"
                >
                  <SparkleIcon className="size-6" />
                  <span className="text-lg font-semibold md:text-xl">¡Empezar ahora!</span>
                </button>
                {canResume && (
                  <button
                    type="button"
                    onClick={() => navigate(lastRoute!)}
                    className="cursor-pointer pl-2 text-base font-semibold text-brand underline underline-offset-4"
                  >
                    ¿Ya empezaste? Continúa donde lo dejaste
                  </button>
                )}
              </div>
            </div>
            <img
              src="/images/landing/hero.webp"
              alt="Pingüino astronauta despegando junto al cohete del Test de Orientación Vocacional"
              className="mx-auto max-h-[44svh] w-auto object-contain lg:max-h-[min(calc(100svh-120px),760px)]"
            />
          </div>
        </section>

        {/* ---------- Tarjetas de características ---------- */}
        <section className="bg-[#0d2838] px-5 py-[clamp(32px,4.5vw,64px)] md:px-10" aria-label="Qué obtienes">
          <div className={cx(CONTAINER, 'grid gap-3 md:grid-cols-3 md:gap-5')}>
            {FEATURES.map((f) => (
              <article key={f.title} className="flex flex-col rounded-3xl bg-card-gray p-5 text-[#000103] md:p-6 lg:p-7">
                <div className="flex h-9 items-center">{f.icon}</div>
                <h3 className="mt-3 text-lg leading-7 font-medium md:mt-4 lg:text-xl">{f.title}</h3>
                <p className="mt-1.5 text-[15px] leading-6 font-light lg:text-base lg:leading-7">{f.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ---------- Tu viaje ---------- */}
        <section className={cx('relative', SECTION_Y)} aria-labelledby="viaje-title">
          <div className="relative z-10 px-5 text-center">
            <SectionTitle>
              <span id="viaje-title">Tu viaje</span>
            </SectionTitle>
            <p className="mt-3 text-base md:mt-4 md:text-lg">Del primer clic hasta la claridad: un recorrido simple y entretenido</p>
          </div>

          {/* Ilustración 1440 × 760; su franja superior (sin dibujo) queda bajo el título */}
          <div className="relative mx-auto mt-4 aspect-[1440/760] w-full max-w-[1000px] md:mt-[calc(-1*min(8.6vw,96px))]">
            <img src="/images/landing/viaje.webp" alt="" className="absolute inset-0 size-full" />
            {/* Etiquetas sobre la ilustración: solo desde tablet, en móvil quedarían ilegibles */}
            <ol className="absolute inset-0 hidden text-[clamp(11px,1.15vw,15px)] leading-snug md:block">
              {JOURNEY_STOPS.map((s) => (
                <li
                  key={s.title}
                  className="absolute -translate-x-1/2 text-center"
                  style={{ left: `${(s.x / 1440) * 100}%`, top: `${(s.y / 760) * 100}%`, width: `${(s.w / 1440) * 100}%` }}
                >
                  <span className="block text-white">{s.title}</span>
                  {s.subtitle && <span className="mt-[0.3em] block text-brand">{s.subtitle}</span>}
                </li>
              ))}
            </ol>
          </div>

          {/* Móvil: las etapas en orden, como pasos */}
          <ol className="mx-auto mt-2 grid max-w-md grid-cols-2 gap-2.5 px-5 md:hidden">
            {[...JOURNEY_STOPS].sort((a, b) => a.order - b.order).map((s) => (
              <li key={s.title} className="rounded-2xl border border-white/10 bg-[#1a3442] p-3.5">
                <span className="text-xs font-semibold text-brand">Paso {s.order}</span>
                <span className="mt-1 block text-sm font-medium">{s.title}</span>
                {s.subtitle && <span className="block text-sm text-white/70">{s.subtitle}</span>}
              </li>
            ))}
          </ol>
        </section>

        {/* ---------- Beneficios ---------- */}
        <section id="beneficios" className={cx('scroll-mt-20 bg-[#0d2838] px-5 md:px-10', SECTION_Y)}>
          <div className={CONTAINER}>
            <SectionTitle>Beneficios del test</SectionTitle>
            <ul className="mt-[clamp(24px,3.5vw,44px)] grid gap-2.5 md:grid-cols-2 md:gap-x-6 md:gap-y-4">
              {BENEFITS.map((b) => (
                <li
                  key={b}
                  className="flex min-h-[60px] items-center gap-3.5 rounded-2xl border border-white/10 bg-[#1a3442] px-5 py-3 text-[15px] leading-snug md:min-h-[76px] md:text-base lg:text-lg"
                >
                  <SparkleIcon className="size-5 shrink-0 text-brand md:size-6" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------- Historias reales ---------- */}
        <section id="testimonios" className={cx('scroll-mt-20 px-5 md:px-10', SECTION_Y)}>
          <div className={cx(CONTAINER, 'text-center')}>
            <SectionTitle>Historias Reales</SectionTitle>
            <p className="mx-auto mt-3 max-w-[600px] text-[15px] leading-7 text-[#a9bcc7] md:text-base lg:text-lg">
              Historias reales de estudiantes que, como tú, estaban en busca de respuestas y encontraron claridad en su camino profesional.
            </p>
            <ul className="mx-auto mt-[clamp(24px,3.5vw,48px)] grid gap-4 text-left md:grid-cols-3 md:gap-8 lg:gap-12">
              {TESTIMONIALS.map((t) => (
                <li key={t.name} className="relative md:pb-5">
                  {/* panel luminoso detrás de la tarjeta (del diseño) */}
                  <div
                    aria-hidden
                    className="absolute inset-x-[-14px] top-[58%] bottom-0 hidden rounded-md bg-[linear-gradient(180deg,rgb(255_255_255/0.2),rgb(255_255_255/0.06))] md:block"
                  />
                  <figure className="relative h-full rounded-[22px] border border-white/12 bg-[#1a3442] p-5 shadow-[0_10px_30px_rgb(0_0_0/0.25)] md:min-h-[190px] md:p-6">
                    <figcaption className="flex items-center gap-3">
                      {/* Foto del estudiante en círculo, con anillo turquesa de marca */}
                      <img
                        src={t.photo}
                        alt=""
                        width={56}
                        height={56}
                        loading="lazy"
                        className="size-12 shrink-0 rounded-full object-cover ring-2 ring-brand ring-offset-2 ring-offset-[#1a3442] md:size-14"
                      />
                      <span>
                        <span className="block text-base font-medium md:text-lg">{t.name}</span>
                        <span className="block text-[13px] text-[#a9bcc7]">{t.role}</span>
                      </span>
                    </figcaption>
                    <blockquote className="mt-3 text-[15px] leading-[1.55] text-white/90 md:mt-4 md:text-base">{t.quote}</blockquote>
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------- Preguntas frecuentes ---------- */}
        <section id="preguntas" className={cx('scroll-mt-20 bg-[#0d2838] px-5 md:px-10', SECTION_Y)}>
          <div className={CONTAINER}>
            <SectionTitle>Preguntas frecuentes</SectionTitle>
            <div className="mt-[clamp(24px,3.5vw,44px)] rounded-xl border border-white/45">
              {FAQS.map((f, i) => (
                <FaqItem key={f.q} q={f.q} a={f.a} first={i === 0} />
              ))}
            </div>
          </div>
        </section>

        {/* ---------- CTA final ---------- */}
        <section className={cx('px-5 md:px-10', SECTION_Y)}>
          <div className={cx(CONTAINER, 'flex flex-col items-center justify-center gap-3 rounded-3xl bg-[#1a3442] px-6 py-[clamp(36px,5vw,72px)] text-center shadow-[0_10px_40px_rgb(0_0_0/0.3)]')}>
            <h2 className="text-[clamp(1.6rem,3.2vw,2.75rem)] leading-[1.15] font-bold tracking-[-0.02em]">¿Listo para empezar tu viaje?</h2>
            <p className="text-[15px] md:text-base lg:text-lg">Completa el test y recibe un informe con recomendaciones hechas para ti.</p>
            <button
              type="button"
              onClick={start}
              className="mt-3 inline-flex h-12 w-full max-w-[300px] md:h-14 cursor-pointer items-center justify-center gap-2 rounded-full bg-action font-bold text-white transition hover:brightness-110"
            >
              Empezar test <ArrowRightIcon className="size-5" />
            </button>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/15 px-5 py-8 text-center text-sm text-white/80 md:text-base">
        © Trabajito. Todos los derechos reservados
      </footer>
    </div>
  )
}
