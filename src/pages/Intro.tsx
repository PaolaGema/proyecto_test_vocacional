import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { TOTAL_ITEMS } from '../components/TestLayout'
import { ArrowRightIcon, IncentiveIcon, type IncentiveKind } from '../components/icons'
import ProfileMenu from '../components/ProfileMenu'
import { Modal, ModalText, ModalTitle, PrimaryButton, ThemeToggle, cx } from '../components/ui'
import { useApp } from '../context/AppContext'
import { BLOCK1_QUESTIONS, BLOCK2_CASES, BLOCK3_AREAS, PERSONALITY_ITEMS } from '../data/testData'

/*
 * Inicio del estudiante · Propuesta C ("Panel de etapas que cambia con tu avance").
 * El test tiene 2 etapas que se necesitan entre sí:
 *   1. Test de personalidad (cómo eres)
 *   2. Test vocacional (qué te interesa), con 3 bloques
 * La primera vez invita a empezar; al volver muestra el avance y un solo botón para continuar.
 */

type Status = 'done' | 'now' | 'next'

type Part = {
  key: 'personality' | 'block1' | 'block2' | 'block3'
  name: string
  unit: string
  total: number
  /** TODO: minutos estimados; medir con estudiantes reales antes de publicar */
  minutes: number
  route: string
  icon: IncentiveKind
  earned: string
}

const PARTS: Part[] = [
  { key: 'personality', name: 'Test de personalidad', unit: 'preguntas', total: PERSONALITY_ITEMS.length, minutes: 10, route: '/test/personalidad', icon: 'heart', earned: '4 corazones ganados' },
  { key: 'block1', name: 'Intereses', unit: 'preguntas', total: BLOCK1_QUESTIONS.length, minutes: 12, route: '/test/bloque-1', icon: 'star', earned: '4 estrellas ganadas' },
  { key: 'block2', name: 'Casos prácticos', unit: 'casos', total: BLOCK2_CASES.length, minutes: 8, route: '/test/bloque-2', icon: 'diamond', earned: 'Diamante ganado' },
  { key: 'block3', name: 'Enfoque', unit: 'áreas', total: BLOCK3_AREAS.length, minutes: 5, route: '/test/bloque-3', icon: 'trophy', earned: 'Trofeo ganado' },
]

/** Unidad en singular con su artículo: "la pregunta", "el caso", "el área" */
const SINGULAR: Record<string, string> = { preguntas: 'la pregunta', casos: 'el caso', áreas: 'el área' }

function StatusChip({ status, started }: { status: Status; started: boolean }) {
  const label = status === 'done' ? 'Completada' : status === 'now' ? (started ? 'En curso' : 'Empieza aquí') : 'Pendiente'
  return (
    <span
      className={cx(
        'shrink-0 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap',
        status === 'done' && 'bg-[#e3f5ee] text-[#0b5e43]',
        status === 'now' && 'bg-action text-white',
        status === 'next' && 'bg-[#eef1f3] text-[#4b5860] dark:bg-white/10 dark:text-white/80',
      )}
    >
      {label}
    </span>
  )
}

export default function Intro() {
  const navigate = useNavigate()
  const { user, signOut, rewards, answers, answeredCount, reset } = useApp()
  const [confirm, setConfirm] = useState<'logout' | 'restart' | null>(null)

  // Estado de cada parte a partir de lo que el prototipo ya guarda
  const answered: Record<Part['key'], number> = {
    personality: Object.keys(answers.personality).length,
    block1: Object.keys(answers.block1).length,
    block2: Object.keys(answers.block2).length,
    block3: Object.keys(answers.block3).length,
  }
  const done: Record<Part['key'], boolean> = {
    personality: rewards.hearts >= 4,
    block1: rewards.stars >= 4,
    block2: rewards.diamond,
    block3: rewards.trophy,
  }
  const current = PARTS.find((p) => !done[p.key]) ?? null
  const allDone = current === null
  const statusOf = (p: Part): Status => (done[p.key] ? 'done' : current?.key === p.key ? 'now' : 'next')
  const started = (p: Part) => answered[p.key] > 0

  const personality = PARTS[0]
  const blocks = PARTS.slice(1)
  const vocStatus: Status = blocks.every((b) => done[b.key]) ? 'done' : current && current.key !== 'personality' ? 'now' : 'next'
  const vocStarted = blocks.some((b) => started(b))
  const vocMinutes = blocks.reduce((a, b) => a + b.minutes, 0)

  const returning = answeredCount > 0
  const pct = Math.round((Math.min(answeredCount, TOTAL_ITEMS) / TOTAL_ITEMS) * 100)
  const firstName = user?.name.trim().split(/\s+/)[0] ?? ''

  const detail = (p: Part) => {
    if (done[p.key]) return p.earned
    if (started(p)) return `Vas en ${SINGULAR[p.unit]} ${Math.min(answered[p.key] + 1, p.total)} de ${p.total}`
    return `${p.total} ${p.unit} · ${p.minutes} min`
  }

  // Un solo botón principal según el avance
  let cta = { label: 'Empezar etapa 1', to: personality.route }
  if (allDone) cta = { label: 'Ver mis resultados', to: '/resultados' }
  else if (current!.key === 'personality') cta = { label: started(current!) ? 'Continuar test de personalidad' : 'Empezar etapa 1', to: current!.route }
  else cta = { label: vocStarted ? 'Continuar test vocacional' : 'Empezar etapa 2', to: current!.route }

  const doLogout = () => {
    signOut()
    navigate('/login')
  }

  return (
    // Fondo turquesa suave (como el panel del login) con el contenido en una tarjeta blanca
    <div className="flex min-h-svh flex-col bg-[#eef5f7] text-fg dark:bg-surface">
      {/* ---------- Barra superior: logo y menú de perfil ---------- */}
      <header className="border-b border-black/6 bg-white dark:border-white/10 dark:bg-surface">
        {/* Barra a todo el ancho: logo pegado a la izquierda, tema y perfil a la derecha */}
        <div className="flex h-16 items-center justify-between gap-3 px-5 md:h-[68px] md:px-8 xl:px-10">
          <Link to="/" aria-label="trabajito, inicio">
            <Logo className="w-[110px] md:w-[128px]" />
          </Link>
          <div className="flex items-center gap-3 md:gap-4">
            <ThemeToggle />
            {user ? (
              <ProfileMenu
                name={user.name}
                email={user.email}
                progress={returning ? pct : null}
                onLogout={() => (returning && !allDone ? setConfirm('logout') : doLogout())}
              />
            ) : (
              <Link to="/login" className="h-10 rounded-full bg-action px-4 text-sm leading-10 font-semibold text-white">
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[800px] flex-1 px-3 py-[clamp(10px,2.5vh,28px)] sm:px-5">
        <div className="rounded-[28px] bg-white px-5 py-6 shadow-[0_10px_40px_rgb(0_46_66/0.08)] md:px-9 md:py-[clamp(18px,3vh,32px)] dark:bg-white/5 dark:shadow-none dark:ring-1 dark:ring-white/10">
        {/* ---------- Saludo ---------- */}
        <h1 className="text-[clamp(1.5rem,2.6vw,2.1rem)] leading-tight font-bold">
          {returning ? `¡Qué bueno verte${firstName ? `, ${firstName}` : ''}!` : `¡Hola${firstName ? `, ${firstName}` : ''}!`}
        </h1>
        {allDone ? (
          <p className="mt-1 text-base text-muted dark:text-[#b7c4cb]">Completaste las 2 etapas. Tus resultados ya están listos.</p>
        ) : returning ? (
          <div className="mt-2">
            <p className="text-base text-muted dark:text-[#b7c4cb]">Llevas el {pct} % del test. Sigue donde lo dejaste.</p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e5e5e5] dark:bg-white/10" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="Avance del test">
              <div className="h-full rounded-full bg-brand transition-[width]" style={{ width: `${pct}%` }} />
            </div>
          </div>
        ) : (
          <>
            <p className="mt-1 text-base text-muted dark:text-[#b7c4cb]">Tu test tiene 2 etapas. Tu avance se guarda solo.</p>
            <ul className="mt-3 flex flex-wrap gap-2 text-[13px] font-semibold text-navy">
              {[`${TOTAL_ITEMS} preguntas`, `unos ${PARTS.reduce((a, p) => a + p.minutes, 0)} minutos`, 'no hay respuestas correctas'].map((c) => (
                <li key={c} className="rounded-full bg-blue-soft px-3 py-1">
                  {c}
                </li>
              ))}
            </ul>
          </>
        )}

        {/* ---------- Las 2 etapas ---------- */}
        <ol className="mt-[clamp(14px,2.5vh,24px)] flex flex-col gap-2.5">
          {/* Etapa 1 */}
          <li
            className={cx(
              'flex items-center gap-4 rounded-2xl border p-3.5 text-navy md:px-5 md:py-4 dark:text-white',
              statusOf(personality) === 'now' ? 'border-2 border-action bg-[#f2f9fb] dark:bg-action/20' : 'border-black/10 bg-white dark:border-white/12 dark:bg-white/5',
            )}
          >
            <IncentiveIcon kind="heart" filled className="size-8 shrink-0" />
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-bold tracking-wide text-action uppercase dark:text-brand">Etapa 1 · Cómo eres</span>
              <span className="block text-lg leading-snug font-semibold">{personality.name}</span>
              <span className="block text-sm text-muted dark:text-[#b7c4cb]">{detail(personality)}</span>
            </span>
            <StatusChip status={statusOf(personality)} started={started(personality)} />
          </li>

          {/* Etapa 2 con sus 3 bloques */}
          <li
            className={cx(
              'rounded-2xl border p-3.5 text-navy md:px-5 md:py-4 dark:text-white',
              vocStatus === 'now' ? 'border-2 border-action bg-[#f2f9fb] dark:bg-action/20' : 'border-black/10 bg-white dark:border-white/12 dark:bg-white/5',
            )}
          >
            <div className="flex items-center gap-4">
              <IncentiveIcon kind="star" filled className="size-8 shrink-0" />
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-bold tracking-wide text-action uppercase dark:text-brand">Etapa 2 · Qué te interesa</span>
                <span className="block text-lg leading-snug font-semibold">Test vocacional</span>
                <span className="block text-sm text-muted dark:text-[#b7c4cb]">
                  {vocStatus === 'done' ? 'Los 3 bloques completados' : `3 bloques · ${vocMinutes} min`}
                </span>
              </span>
              <StatusChip status={vocStatus} started={vocStarted} />
            </div>
            <ul className="mt-2.5 flex flex-col gap-1.5 border-t border-black/8 pt-2.5 md:ml-12 dark:border-white/10">
              {blocks.map((b, i) => (
                <li key={b.key} className="flex items-center gap-3">
                  <IncentiveIcon kind={b.icon} filled={done[b.key]} className="size-5 shrink-0" />
                  <span className="min-w-0 flex-1 text-[15px]">
                    <b className="font-semibold">
                      Bloque {i + 1} · {b.name}
                    </b>
                    <span className="text-muted dark:text-[#b7c4cb]"> · {detail(b)}</span>
                  </span>
                  <span className="hidden sm:block">
                    <StatusChip status={statusOf(b)} started={started(b)} />
                  </span>
                </li>
              ))}
            </ul>
          </li>
        </ol>

        {/* ---------- Por qué van juntas ---------- */}
        <div className="mt-4 grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 text-center text-[13px] font-semibold md:text-sm" aria-label="Tu forma de ser más lo que te interesa da como resultado carreras para ti">
          <span className="rounded-xl bg-blue-soft px-2 py-2 text-navy">Tu forma de ser</span>
          <span className="text-lg text-action dark:text-brand" aria-hidden>+</span>
          <span className="rounded-xl bg-blue-soft px-2 py-2 text-navy">Lo que te interesa</span>
          <span className="text-lg text-action dark:text-brand" aria-hidden>=</span>
          <span className="rounded-xl bg-action px-2 py-2 text-white">Carreras para ti</span>
        </div>

        {/* ---------- Acción principal ---------- */}
        <button
          type="button"
          onClick={() => navigate(cta.to)}
          className="mt-[clamp(14px,2.5vh,24px)] inline-flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-action text-base font-bold text-white transition hover:brightness-110"
        >
          {cta.label} <ArrowRightIcon className="size-5" />
        </button>
        {returning && (
          <p className="mt-3 text-center">
            <button type="button" onClick={() => setConfirm('restart')} className="cursor-pointer text-sm font-semibold text-muted underline underline-offset-4 dark:text-[#b7c4cb]">
              Empezar el test de nuevo
            </button>
          </p>
        )}
        </div>
      </main>

      {confirm === 'logout' && (
        <Modal className="max-w-[480px]" onClose={() => setConfirm(null)}>
          <ModalTitle>¿Cerrar sesión?</ModalTitle>
          <ModalText>
            Tu avance ({pct} %) queda guardado. Para seguir, vuelve a entrar con tu correo. Si estás en una computadora compartida, cierra sesión antes de irte.
          </ModalText>
          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setConfirm(null)}
              className="h-14 flex-1 cursor-pointer rounded-[30px] border-2 border-action font-bold text-action transition hover:bg-action/10"
            >
              Quedarme
            </button>
            <PrimaryButton arrow={false} onClick={doLogout} className="flex-1 px-4">
              Cerrar sesión
            </PrimaryButton>
          </div>
        </Modal>
      )}
      {confirm === 'restart' && (
        <Modal className="max-w-[480px]" onClose={() => setConfirm(null)}>
          <ModalTitle>¿Empezar de nuevo?</ModalTitle>
          <ModalText>Se borrarán tus {answeredCount} respuestas y los incentivos ganados. No se puede deshacer.</ModalText>
          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setConfirm(null)}
              className="h-14 flex-1 cursor-pointer rounded-[30px] border-2 border-action font-bold text-action transition hover:bg-action/10"
            >
              Cancelar
            </button>
            <PrimaryButton
              arrow={false}
              onClick={() => {
                reset()
                setConfirm(null)
              }}
              className="flex-1 px-4"
            >
              Borrar y empezar
            </PrimaryButton>
          </div>
        </Modal>
      )}
    </div>
  )
}
