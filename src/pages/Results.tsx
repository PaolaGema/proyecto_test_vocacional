import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useApp } from '../context/AppContext'
import { ChevronDownIcon } from '../components/icons'
import { cx } from '../components/ui'
import {
  AREA_PREFERENCES,
  MOCK_USER,
  STUDY_CAREERS,
  STUDY_PLAN,
  TOP_AREA_CAREERS,
  TRAITS,
  UNIVERSITIES,
  type AreaCareers,
  type Trait,
} from '../data/resultsData'

type Tab = 'personal' | 'prefs' | 'plans'

const TABS: { id: Tab; label: string; icon: string; iconClass: string }[] = [
  { id: 'personal', label: 'Tu estilo personal', icon: '/images/tabPersonal.webp', iconClass: 'h-[50px]' },
  { id: 'prefs', label: 'Tus preferencias vocacionales', icon: '/images/tabPrefs.webp', iconClass: 'h-[60px]' },
  { id: 'plans', label: 'Tus planes de estudio', icon: '/images/tabPlans.webp', iconClass: 'h-[61px]' },
]

/* ---------- Piezas comunes ---------- */
function SectionTitle({ tab, children }: { tab: Tab; children: ReactNode }) {
  const t = TABS.find((x) => x.id === tab)!
  return (
    <h2 className="flex items-center gap-1 text-2xl leading-[42px] font-semibold tracking-[-0.5px] text-brand">
      <img src={t.icon} alt="" className="h-[50px]" />
      {children}
    </h2>
  )
}

function DownloadButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="mx-auto mt-[72px] flex h-14 w-[458px] max-w-full cursor-pointer items-center justify-center rounded-[30px] bg-action font-bold text-white transition hover:brightness-110"
    >
      Descargar informe completo
    </button>
  )
}

const ArrowUp = () => (
  <svg viewBox="0 0 24 24" className="size-6" aria-label="sube">
    <path d="M12 3 4 13h5v8h6v-8h5L12 3Z" fill="#33A1B8" />
  </svg>
)
const ArrowDown = () => (
  <svg viewBox="0 0 24 24" className="size-6" aria-label="baja">
    <path d="M12 21 4 11h5V3h6v8h5l-8 10Z" fill="#EB5757" />
  </svg>
)

/* ---------- Pestaña 1 · Tu estilo personal ---------- */
function TraitCard({ trait }: { trait: Trait }) {
  return (
    <article className="flex min-h-[480px] w-full flex-col overflow-hidden rounded-[23px] bg-white shadow-[3px_3px_23px_rgb(0_0_0/0.25)]">
      <div className="flex h-[201px] flex-col items-center bg-navy px-[11px] pt-4">
        <h3 className="text-[18.8px] leading-[33px] font-semibold tracking-[-0.4px] text-white">{trait.name}</h3>
        <div className="mt-3 flex min-h-[133px] w-full flex-col items-center rounded-[9px] bg-teal-soft/46 p-[22px] text-center">
          <span className="text-[15px] leading-[31px] font-medium text-white">¿Qué mide?</span>
          <span className="text-xs leading-[18px] font-semibold tracking-[-0.4px] text-[#e7e7e7]">{trait.measures}</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col px-[11px] pt-[21px] pb-[11px]">
        <p className="text-center text-[28px] leading-[33px] font-semibold tracking-[-0.4px] text-brand">{trait.percent}%</p>
        <p className="text-center text-[12.5px] font-medium tracking-[-0.4px] text-[#757575]">Mi resultado</p>
        <p className="mt-[17px] px-[22px] text-[12.5px] leading-4 font-semibold tracking-[-0.4px] text-body">{trait.result}</p>
        <div className="mt-auto rounded-[9px] bg-blue-soft px-[15px] py-[22px]">
          <p className="text-[15px] leading-[31px] font-medium text-navy">Sugerencia:</p>
          <p className="text-xs leading-4 font-semibold tracking-[-0.4px] text-body">{trait.suggestion}</p>
        </div>
      </div>
    </article>
  )
}

function PersonalTab() {
  return (
    <>
      <SectionTitle tab="personal">Tu estilo personal</SectionTitle>
      <p className="mt-1 text-base leading-5 font-semibold tracking-[-0.2px] text-navy">
        Conoce los aspectos más importantes de tu personalidad que influyen en tu elección vocacional:
      </p>
      <div className="mt-[19px] grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {TRAITS.map((t) => (
          <TraitCard key={t.name} trait={t} />
        ))}
      </div>
    </>
  )
}

/* ---------- Pestaña 2 · Tus preferencias vocacionales ---------- */
function PreferenceMap() {
  // Gráfico en cascada (Figma: "Mapa de preferencias"), escala -100% … 100%
  const W = 1000
  const H = 440
  const top = 30
  const plotH = 340
  const left = 60
  const y = (v: number) => top + ((100 - v) / 200) * plotH
  const step = (W - left - 40) / AREA_PREFERENCES.length
  const starts = AREA_PREFERENCES.map((_, i) => (i === 0 ? 0 : AREA_PREFERENCES[i - 1].prefPersonality))
  return (
    <div className="rounded-3xl bg-white p-5 shadow-soft">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Mapa de preferencias por área">
        <text x={W / 2} y={18} textAnchor="middle" className="fill-[#333] text-[18px]">
          Mapa de preferencias
        </text>
        {[-100, -80, -60, -40, -20, 0, 20, 40, 60, 80, 100].map((t) => (
          <g key={t}>
            <line x1={left} x2={W - 30} y1={y(t)} y2={y(t)} stroke="#e5e5e5" strokeWidth={t === 0 ? 1.5 : 1} />
            <text x={left - 8} y={y(t) + 4} textAnchor="end" className="fill-[#555] text-[11px]">
              {t}%
            </text>
          </g>
        ))}
        {AREA_PREFERENCES.map((a, i) => {
          const v = a.prefPersonality
          const prev = starts[i]
          const y1 = y(Math.max(prev, v))
          const y2 = y(Math.min(prev, v))
          const x = left + i * step + step * 0.12
          const w = step * 0.76
          return (
            <g key={a.area}>
              <rect x={x} y={y1} width={w} height={Math.max(4, y2 - y1)} fill={a.color} />
              <text x={x + w / 2} y={(y1 + y2) / 2 + 4} textAnchor="middle" className="fill-white text-[12px] font-semibold">
                {v}%
              </text>
            </g>
          )
        })}
        <g transform={`translate(${left + 120}, ${H - 18})`}>
          {AREA_PREFERENCES.map((a, i) => (
            <g key={a.area} transform={`translate(${i * 105}, 0)`}>
              <rect width="10" height="10" y="-9" fill={a.color} />
              <text x="14" className="fill-[#555] text-[12px]">
                {a.area}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  )
}

function CareerBars({ data }: { data: AreaCareers }) {
  return (
    <div className="flex w-[582px] max-w-full flex-col rounded-3xl bg-white p-6 shadow-soft">
      <p className="text-center text-[13px] font-medium uppercase">{data.area}</p>
      <div className="mt-3 flex h-[220px] items-stretch gap-3">
        <div className="flex items-center">
          <span className="-rotate-90 text-[10px] whitespace-nowrap text-navy">PORCENTAJE (%)</span>
        </div>
        <div className="flex flex-col justify-between pb-6 text-[9px] text-black">
          {[100, 80, 60, 40, 20, 0].map((t) => (
            <span key={t} className="text-right">
              {t}
            </span>
          ))}
        </div>
        <div className="flex flex-1 items-end justify-around border-b border-l border-[#ccc] pb-0">
          {data.careers.map((c) => (
            <div key={c.name} className="relative flex h-full w-[60px] flex-col items-center justify-end">
              <div
                className="w-[48px] rounded-t-[3px] bg-navy"
                style={{ height: `${Math.max(2, c.percent) * 0.86}%`, opacity: c.percent >= 80 ? 0.78 : c.percent >= 20 ? 0.57 : 0.23 }}
              />
              <span className="absolute -bottom-7 w-[80px] text-center text-[9px] leading-[11px] text-black">{c.name}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-9 text-center text-xs text-navy">CARRERAS</p>
    </div>
  )
}

function CareerTable({ data }: { data: AreaCareers }) {
  const shades = ['bg-[#4b6b7a]', 'bg-[#6b8794]', 'bg-[#9fb1b9]', 'bg-[#c3ced3]']
  return (
    <div className="w-[540px] max-w-full overflow-hidden rounded-xl shadow-soft">
      <div className="grid grid-cols-[1fr_120px] bg-navy text-xl leading-8 font-medium text-white">
        <span className="px-4 py-2">{data.area}</span>
        <span className="py-2">%</span>
      </div>
      {data.careers.map((c, i) => (
        <div key={c.name} className="grid min-h-[70px] grid-cols-[1fr_120px] items-center bg-white">
          <span className="px-6 text-[14.4px] font-bold text-[#4f4f4f]">{c.name}</span>
          <span className={cx('flex h-full items-center pl-3 text-2xl', shades[i] ?? shades[3], i < 2 ? 'text-white' : 'text-[#4f4f4f]')}>
            {c.percent}%
          </span>
        </div>
      ))}
    </div>
  )
}

function PrefsTab() {
  return (
    <>
      <SectionTitle tab="prefs">Tus preferencias vocacionales</SectionTitle>

      {/* Nota importante */}
      <div className="relative mt-4 flex gap-6 rounded-[20px] bg-action px-8 py-6 text-white">
        <svg viewBox="0 0 78 78" className="size-[78px] shrink-0" aria-hidden>
          <path d="M39 0a34.3 34.3 0 0 1 0 68.6l-.6 0-16.9 8.2c-2.7 1.3-5.7-.7-5.7-3.6V60.3c0-1-.4-2.1-1.2-2.8A34.3 34.3 0 0 1 39 0Z" fill="#002E42" />
          <circle cx="39" cy="44.8" r="3.1" fill="#fff" />
          <rect x="35.9" y="20.1" width="6.3" height="19.5" rx="3" fill="#fff" />
        </svg>
        <div>
          <p className="text-[34px] leading-[51px] font-medium tracking-[-1.2px]">¡Nota importante!</p>
          <p className="text-base leading-[21px] tracking-[0.3px]">
            ✨ Recuerda: Esta prueba no define quién eres ni lo que serás, solo te da pistas sobre tus intereses y tu personalidad.
            Tómala como un mapa para explorar, descubrir y atreverte a soñar con tu futuro. Tu camino lo decides tú, y siempre
            podrás aprender, cambiar y crecer. 🚀
          </p>
        </div>
      </div>

      {/* Leyenda */}
      <div className="mt-6 rounded-[20px] bg-navy p-8 text-white">
        <div className="flex flex-wrap gap-12">
          <div className="flex min-h-[150px] w-[404px] max-w-full items-center gap-4 rounded-2xl bg-teal-soft/46 px-5">
            <img src="/images/img1fa6.webp" alt="" className="size-[70px]" />
            <p className="font-bold">
              Lo que te interesa: <span className="font-normal">tus intereses de hoy, según tus respuestas.</span>
            </p>
          </div>
          <div className="flex min-h-[150px] flex-1 items-center gap-4 rounded-2xl bg-teal-soft/46 px-5">
            <img src="/images/prefIcon.webp" alt="" className="size-[95px]" />
            <p className="font-bold">
              Lo que encaja contigo: <span className="font-normal">tus intereses ajustados a tu forma de ser (lo que podría encajar mejor contigo en el día a día).</span>
            </p>
          </div>
        </div>
        <p className="mt-10 flex items-center gap-12 font-semibold">
          Si ves <ArrowUp /> Significa que tu estilo se ajusta a lo que quieres
        </p>
        <p className="mt-3 flex items-center gap-12 font-semibold">
          Si ves <ArrowDown /> Significa que tu estilo no se ajusta y se te podría dificultar más este tipo de carreras
        </p>
      </div>

      {/* Tabla por áreas */}
      <div className="mt-8">
        <PreferenceMap />
      </div>

      <details className="group mt-6">
        <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl bg-blue-soft px-6 py-4 text-lg font-semibold text-navy">
          Ver la tabla detallada por área
          <span className="transition group-open:rotate-180" aria-hidden>▾</span>
        </summary>
      <div className="mt-4 overflow-x-auto rounded-xl shadow-soft">
        <table className="w-full min-w-[800px] border-collapse text-left">
          <thead className="bg-navy text-white">
            <tr className="text-[15px]">
              <th className="px-11 py-5 font-medium">Area</th>
              <th className="py-5 font-medium">Carreras que agrupa</th>
              <th className="py-5 font-medium">Lo que te interesa</th>
              <th className="py-5 font-medium">Lo que encaja contigo</th>
            </tr>
          </thead>
          <tbody className=" text-[14.4px] text-[#4f4f4f]">
            {AREA_PREFERENCES.map((a) => (
              <tr key={a.area} className="border-b border-[#f0f0f0] bg-white">
                <td className="px-11 py-4 font-bold">{a.area}</td>
                <td className="max-w-[264px] py-4 pr-6">{a.careers}</td>
                <td className="py-4">{a.pref}%</td>
                <td className="py-4">
                  <span className="inline-flex items-center gap-4">
                    <span className="w-10">{a.prefPersonality}%</span>
                    {a.delta >= 0 ? <ArrowUp /> : <ArrowDown />}
                    <span>{a.delta}%</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </details>


      <h3 className="mt-10 text-2xl leading-8 font-semibold text-brand">🚀 Las carreras dentro de estas áreas se ajustan más contigo:</h3>
      <div className="mt-8 flex flex-col gap-10">
        {TOP_AREA_CAREERS.map((a) => (
          <div key={a.area} className="flex flex-wrap items-start gap-8">
            <CareerTable data={a} />
            <CareerBars data={a} />
          </div>
        ))}
      </div>
    </>
  )
}

/* ---------- Pestaña 3 · Tus planes de estudio ---------- */
function PlansTab() {
  const [career, setCareer] = useState<string | null>(null)
  const [uni, setUni] = useState(UNIVERSITIES[0])
  const detailRef = useRef<HTMLDivElement>(null)

  const open = (name: string) => {
    setCareer(name)
    setTimeout(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  return (
    <>
      <SectionTitle tab="plans">Tus planes de estudio</SectionTitle>
      <div className="mt-6 grid gap-x-[35px] gap-y-[38px] rounded-3xl bg-white p-7 shadow-soft sm:grid-cols-2 lg:grid-cols-3">
        {STUDY_CAREERS.map((c) => (
          <article key={c.name} className="flex min-h-[232px] flex-col rounded-3xl bg-white px-[23px] py-[26px] shadow-soft">
            <span className="w-fit rounded-[9px] bg-blue-soft px-[15px] py-[11px] text-xs leading-4 font-semibold tracking-[-0.4px] text-body">
              {c.compatibility}% compatibilidad
            </span>
            <h3 className="mt-3 text-[15px] leading-[31px] font-medium text-navy">{c.name}</h3>
            <p className="text-xs leading-4 font-semibold tracking-[-0.4px] text-body">{c.description}</p>
            <button
              type="button"
              onClick={() => open(c.name)}
              className={cx(
                'mt-auto flex h-[39px] w-[174px] cursor-pointer items-center justify-center gap-1.5 rounded-[60px] border-[0.7px] border-navy text-[10.8px] font-semibold text-navy shadow-[0_2.75px_42px_rgb(51_161_184/0.4)] transition hover:bg-brand/10',
                career === c.name && 'bg-brand/15',
              )}
            >
              <span aria-hidden>↗</span> Ver Plan de Estudios
            </button>
          </article>
        ))}
      </div>

      {career && (
        <div ref={detailRef} className="mt-[66px] scroll-mt-6 rounded-[30px] bg-white px-[71px] py-[67px] shadow-[4px_4px_30px_rgb(0_0_0/0.25)] animate-fade-up max-md:px-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-2xl leading-[42px] font-semibold tracking-[-0.5px] text-brand">Planes de estudio - {career}</h3>
            <label className="flex items-center gap-2 text-xl font-semibold text-brand">
              Universidad:
              <span className="relative">
                <select
                  value={uni}
                  onChange={(e) => setUni(e.target.value)}
                  className="h-10 w-[218px] cursor-pointer appearance-none truncate rounded border border-[#a0a0a0]/50 bg-white pr-8 pl-3 text-sm font-normal text-[#333]"
                >
                  {UNIVERSITIES.map((u) => (
                    <option key={u}>{u}</option>
                  ))}
                </select>
                <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 h-[6px] w-[11px] -translate-y-1/2 text-[#a0a0a0]" />
              </span>
            </label>
          </div>

          <div className="mt-[30px] flex flex-wrap justify-between gap-4 rounded-[9px] bg-blue-soft px-[22px] py-[27px] text-xl leading-[42px] font-semibold text-navy">
            <span>Duración: {STUDY_PLAN.duration}</span>
            <span>Total de materias: {STUDY_PLAN.totalSubjects}</span>
            <span>Modalidad: {STUDY_PLAN.modality}</span>
          </div>

          <div className="mt-[30px] grid gap-x-[65px] gap-y-8 rounded-[9px] bg-blue-soft px-10 py-7 md:grid-cols-3">
            {STUDY_PLAN.semesters.map((s) => (
              <div key={s.name}>
                <h4 className="text-center text-xl leading-[42px] font-semibold text-navy">{s.name}</h4>
                <ul className="mt-2 flex flex-col gap-2">
                  {s.subjects.map((sub) => (
                    <li key={sub} className="rounded-lg border border-[#3058d8] bg-[#d6def7] py-3 pr-3 pl-[41px] text-sm leading-[21px] text-[#212121]">
                      {sub}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

/** Figma: frames "Frame 1874428454/55/56/57" — Resultados */
export default function Results() {
  const [tab, setTab] = useState<Tab>('personal')
  const { setLastRoute } = useApp()
  useEffect(() => setLastRoute('/resultados'), [setLastRoute])

  return (
    <div className="min-h-screen bg-navy pb-24 text-white">
      <div className="mx-auto max-w-[1440px] px-4 xl:px-[58px]">
        {/* Encabezado */}
        <header className="flex flex-col items-center gap-4 pt-4 md:flex-row md:items-center md:gap-[clamp(24px,8vw,146px)]">
          <img src="/images/penguinResults.webp" alt="¡Tus resultados!" className="w-[220px] md:-ml-[30px] md:w-[clamp(220px,22vw,320px)]" />
          <div>
            <h1 className="max-w-[661px] text-[clamp(1.75rem,3.4vw,3rem)] leading-[1.25] font-bold">
              Resultados de tu Test de Orientación Vocacional
            </h1>
            <p className="mt-2 max-w-[660px] text-base leading-relaxed uppercase md:text-lg">
              👋 Hola {MOCK_USER.name}!
              <br />
              Has completado exitosamente el test. Aquí tienes tus resultados personalizados basados en tus respuestas.
            </p>
          </div>
        </header>

        {/* Pestañas */}
        <nav
          className="mt-4 flex flex-col gap-2 rounded-[17px] bg-brand/37 px-[25px] py-1 shadow-brand md:mt-[14px] md:flex-row md:gap-[23px]"
          role="tablist"
        >
          {TABS.map((t) => {
            const active = tab === t.id
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.id)}
                className={cx(
                  'flex h-[56px] flex-1 cursor-pointer items-center justify-center gap-1 rounded-[13px] text-base font-semibold tracking-[-0.3px] transition lg:text-xl',
                  active ? 'bg-white text-brand shadow-[0_6px_17px_rgb(0_0_0/0.12)]' : 'text-white hover:bg-white/10',
                )}
              >
                <img src={t.icon} alt="" className={cx(t.iconClass, "max-h-10 lg:max-h-none")} />
                {t.label}
              </button>
            )
          })}
        </nav>

        {/* Contenido */}
        <section key={tab} className="mt-9 rounded-[30px] bg-white px-5 py-12 text-navy shadow-[4px_4px_30px_rgb(0_0_0/0.25)] animate-fade-up md:px-[35px]">
          {tab === 'personal' && <PersonalTab />}
          {tab === 'prefs' && <PrefsTab />}
          {tab === 'plans' && <PlansTab />}
        </section>

        <DownloadButton />
      </div>
    </div>
  )
}
