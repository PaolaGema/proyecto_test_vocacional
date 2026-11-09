import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import Logo from './Logo'
import { LoadingRing } from '../pages/Loading'
import { useApp, type BlockKey } from '../context/AppContext'


/** Atajos de teclado (auditoría #8). Ignora las teclas mientras se escribe en un campo. */
export function useShortcuts(map: Record<string, () => void>, enabled = true) {
  const ref = useRef(map)
  useEffect(() => {
    ref.current = map
  })
  useEffect(() => {
    if (!enabled) return
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || e.ctrlKey || e.metaKey || e.altKey) return
      const fn = ref.current[e.key.toLowerCase()]
      if (fn) {
        e.preventDefault()
        fn()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [enabled])
}

/** Pista visible de los atajos de teclado */
export function KeyHint({ children }: { children: ReactNode }) {
  return <p className="mt-4 hidden text-center text-sm text-section-label md:block">{children}</p>
}

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="mx-0.5 rounded border border-current/40 px-1.5 py-0.5 text-xs font-semibold">{children}</kbd>
  )
}

export type Phase = 'tutorial' | 'practice' | 'practiceDone' | 'loading' | 'test' | 'reward'

/**
 * Máquina de estados común a todos los bloques del test:
 * tutorial → práctica → ¡Perfecto! → carga → preguntas (por secciones) → recompensa → …
 */
const BLOCK_ORDER: BlockKey[] = ['personality', 'block1', 'block2', 'block3']

export function useBlockFlow(block: BlockKey, route: string, sectionSizes: number[], { skipPractice = false } = {}) {
  const { progress, saveProgress, setLastRoute, setRewards } = useApp()
  // Al entrar a un bloque, los bloques anteriores ya se terminaron: sus recompensas quedan completas.
  // (Evita huecos si una animación de recompensa se interrumpió, p. ej. al recargar o salir a mitad.)
  useEffect(() => {
    const i = BLOCK_ORDER.indexOf(block)
    setRewards((r) => {
      const fixed = { hearts: i > 0 ? 4 : r.hearts, stars: i > 1 ? 4 : r.stars, diamond: i > 2 || r.diamond, trophy: r.trophy }
      return fixed.hearts === r.hearts && fixed.stars === r.stars && fixed.diamond === r.diamond ? r : fixed
    })
  }, [block, setRewards])
  // Propuesta B "aprender haciendo": sin ventanas de tutorial. La práctica empieza directo,
  // y no se repite si el bloque ya se empezó o el estudiante ya practicó (o la saltó) antes.
  const resumed = progress[block]
  const [phase, setPhase] = useState<Phase>(resumed || hasPracticed(block) ? 'test' : 'practice')
  const [section, setSection] = useState(resumed?.section ?? 0)
  const [index, setIndex] = useState(resumed?.index ?? 0)

  const offset = sectionSizes.slice(0, section).reduce((a, b) => a + b, 0)
  const globalIndex = offset + index
  const sectionSize = sectionSizes[section]
  const total = sectionSizes.reduce((a, b) => a + b, 0)

  useEffect(() => setLastRoute(route), [route, setLastRoute])
  useEffect(() => {
    if (phase === 'test') saveProgress(block, { section, index })
  }, [phase, section, index, block, saveProgress])

  const startPractice = useCallback(() => setPhase(skipPractice ? 'test' : 'practice'), [skipPractice])
  /** práctica respondida: aviso "¡Así de fácil!" y el test real empieza solo */
  const finishPractice = useCallback(() => {
    markPracticed(block)
    setPhase('practiceDone')
  }, [block])
  /** "Saltar práctica" */
  const skip = useCallback(() => {
    markPracticed(block)
    setPhase('test')
  }, [block])
  /** la transición "¡Así de fácil! → test real" llama a esto al terminar la cuenta regresiva */
  const startTest = useCallback(() => setPhase('test'), [])

  // carga breve solo como transición (antes 1,6 s; auditoría #4)
  useEffect(() => {
    if (phase !== 'loading') return
    const t = setTimeout(() => setPhase('test'), 700)
    return () => clearTimeout(t)
  }, [phase])

  // Secciones intermedias: el test sigue sin detenerse y se avisa al cargador (sectionDone).
  // Solo la última sección pasa a 'reward' (celebración de pantalla completa).
  const [sectionDone, setSectionDone] = useState(0)
  const next = useCallback(() => {
    if (index < sectionSize - 1) setIndex((i) => i + 1)
    else if (section < sectionSizes.length - 1) {
      setSection((s) => s + 1)
      setIndex(0)
      setSectionDone((n) => n + 1)
    } else setPhase('reward')
  }, [index, sectionSize, section, sectionSizes.length])

  const prev = useCallback(() => {
    if (index > 0) setIndex((i) => i - 1)
  }, [index])

  /** se llama al terminar la animación de recompensa; devuelve true si era la última sección */
  const afterReward = useCallback(() => {
    if (section < sectionSizes.length - 1) {
      setSection((s) => s + 1)
      setIndex(0)
      setPhase('test')
      return false
    }
    return true
  }, [section, sectionSizes.length])

  return {
    sectionDone,
    phase,
    section,
    index,
    globalIndex,
    sectionSize,
    total,
    isLastSection: section === sectionSizes.length - 1,
    startPractice,
    finishPractice,
    skipPractice: skip,
    startTest,
    next,
    prev,
    afterReward,
  }
}

/* ---------- Recordar qué bloques ya se practicaron ---------- */
const PRACTICED_KEY = 'tv-practiced'
function readPracticed(): string[] {
  try {
    return JSON.parse(localStorage.getItem(PRACTICED_KEY) ?? '[]')
  } catch {
    return []
  }
}
function hasPracticed(block: BlockKey) {
  return readPracticed().includes(block)
}
function markPracticed(block: BlockKey) {
  try {
    const list = readPracticed()
    if (!list.includes(block)) localStorage.setItem(PRACTICED_KEY, JSON.stringify([...list, block]))
  } catch {
    /* sin almacenamiento */
  }
}

/* ---------- Guía de práctica: el pingüino con una frase (propuesta B) ----------
   Va en el flujo de la página, entre la pregunta y las opciones, para no tapar nada. */
export function PracticeCoach({ children, onSkip }: { children: ReactNode; onSkip: () => void }) {
  return (
    <div role="status" className="mx-auto mt-3 flex w-fit max-w-[min(620px,100%)] items-center gap-2 px-4 animate-fade-up md:mt-4 md:gap-3">
      <img src="/images/penguinCoach.webp" alt="" className="h-[58px] w-auto shrink-0 md:h-[72px]" />
      <div className="rounded-2xl rounded-bl-sm bg-navy px-4 py-2.5 text-sm leading-snug text-white shadow-[0_8px_24px_rgb(0_46_66/0.2)] md:text-[15px] dark:bg-white/10">
        {children}{' '}
        <button type="button" onClick={onSkip} className="cursor-pointer whitespace-nowrap text-white/70 underline underline-offset-4 hover:text-white">
          Saltar práctica
        </button>
      </div>
    </div>
  )
}

/* ---------- Transición de la práctica al test real ----------
   1) Sticker "¡Así de fácil!" que salta sobre el pingüino, con confeti.
   2) "Ahora empieza el test real · Tus respuestas ya cuentan".
   3) Cuenta regresiva 3 · 2 · 1 (o "Empezar ya") y arranca el test. */
const CONFETTI = [
  { x: '-150px', y: '-120px', c: '#FFBE2C' },
  { x: '140px', y: '-140px', c: '#33A1B8' },
  { x: '180px', y: '10px', c: '#FFA101' },
  { x: '-190px', y: '30px', c: '#33A1B8' },
  { x: '-90px', y: '-190px', c: '#1AD598' },
  { x: '80px', y: '-200px', c: '#FFBE2C' },
  { x: '-170px', y: '-40px', c: '#FFA101' },
  { x: '160px', y: '-70px', c: '#1AD598' },
]

export function PracticeTransition({ heading, onStart }: { heading: string; onStart: () => void }) {
  const [count, setCount] = useState(3)
  const startRef = useRef(onStart)
  useEffect(() => {
    startRef.current = onStart
  })

  useEffect(() => {
    // primero se deja ver el sticker; luego cuenta 3, 2, 1
    let n = 3
    let tick: ReturnType<typeof setInterval> | undefined
    const delay = setTimeout(() => {
      tick = setInterval(() => {
        n -= 1
        if (n <= 0) {
          if (tick) clearInterval(tick)
          startRef.current()
        } else setCount(n)
      }, 900)
    }, 1300)
    return () => {
      clearTimeout(delay)
      if (tick) clearInterval(tick)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#eef5f7]/95 p-5 backdrop-blur-sm animate-fade-up dark:bg-navy/95" role="dialog" aria-modal="true" aria-labelledby="pt-title">
      <div className="flex max-w-[460px] flex-col items-center text-center text-navy dark:text-white">
        {/* pingüino + sticker + confeti */}
        <div className="relative mb-2 flex h-[190px] w-[240px] items-end justify-center">
          {CONFETTI.map((p, i) => (
            <span
              key={i}
              aria-hidden
              className="absolute top-1/2 left-1/2 size-3 rounded-full"
              style={{ background: p.c, ['--dx' as string]: p.x, ['--dy' as string]: p.y, animation: `spark 1.2s ${0.15 + i * 0.04}s ease-out both` }}
            />
          ))}
          <img src="/images/penguinCoach.webp" alt="" className="h-[150px] w-auto [animation:pop-in_0.5s_ease_both]" />
          <span className="absolute -top-1 right-0 rounded-2xl border-4 border-white bg-spark px-4 py-2 text-xl font-extrabold text-navy shadow-[0_8px_20px_rgb(0_0_0/0.2)] [animation:sticker-in_0.55s_0.25s_cubic-bezier(.2,1.6,.4,1)_both]">
            ¡Así de fácil!
          </span>
        </div>

        <h2 id="pt-title" className="mt-2 text-[clamp(1.5rem,3vw,2rem)] leading-tight font-extrabold [animation:fade-up_0.45s_0.6s_ease_both]">
          {heading}
        </h2>
        <p className="mt-2 text-base text-muted [animation:fade-up_0.45s_0.75s_ease_both] dark:text-[#b7c4cb]">
          Se acabó la práctica: <b className="text-navy dark:text-white">tus respuestas ya cuentan</b> para tu resultado.
        </p>

        {/* cuenta regresiva */}
        <div className="mt-6 flex items-center gap-4 [animation:fade-up_0.45s_0.9s_ease_both]">
          <span
            key={count}
            aria-live="polite"
            aria-label={`Empieza en ${count}`}
            className="flex size-16 items-center justify-center rounded-full border-4 border-brand bg-white text-3xl font-extrabold text-action [animation:count-pop_0.3s_ease-out_both] dark:bg-white/10 dark:text-white"
          >
            {count}
          </span>
          <button type="button" onClick={onStart} autoFocus className="h-12 cursor-pointer rounded-full bg-action px-6 font-bold text-white transition hover:brightness-110">
            Empezar ya →
          </button>
        </div>
      </div>
    </div>
  )
}

/** Resalta lo que hay que tocar durante la práctica */
export const PRACTICE_GLOW = 'ring-4 ring-brand/45 ring-offset-2 ring-offset-transparent animate-[glow_1.6s_ease-in-out_infinite]'

/* ---------- Pantalla de carga entre fases ---------- */
export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-9 bg-surface text-fg">
      <Logo className="w-[200px] md:w-[270px]" />
      <LoadingRing />
    </div>
  )
}

/* ---------- Etiqueta "MODO PRÁCTICA · Pregunta de ejemplo" ----------
   Pulso suave 4 veces al entrar (el diseño original parpadeaba); luego queda quieta. */
export function PracticeBanner({ suffix = '' }: { suffix?: string }) {
  return (
    <div className="flex h-9 min-w-0 flex-1 items-center justify-center gap-2 rounded-[40px] bg-action px-3 text-xs font-semibold text-white [animation:practice-pulse_1.4s_ease-in-out_4] sm:text-sm md:h-[43px] md:text-lg xl:text-xl dark:bg-brand/30">
      <img src="/images/hand.webp" alt="" className="h-5 shrink-0 md:h-[30px]" />
      <span className="truncate tracking-wide uppercase">Modo práctica · Pregunta de ejemplo{suffix}</span>
    </div>
  )
}
