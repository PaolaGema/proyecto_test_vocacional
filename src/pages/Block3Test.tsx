import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import Reward from '../components/Reward'
import RewardCharger from '../components/RewardCharger'
import { HandIcon } from '../components/DemoHand'
import { AllIncentives, TestHeader, TestLayout } from '../components/TestLayout'
import { LoadingOverlay, PracticeBanner, PracticeCoach, PracticeTransition, useBlockFlow } from '../components/flow'
import { BackArrow, PrimaryButton, ThemeToggle, cx } from '../components/ui'
import { useApp } from '../context/AppContext'
import { BLOCK3_AREAS, type Block3Area } from '../data/testData'

const ROW_BG = ['bg-cream', 'bg-blue-soft', 'bg-rose']

const PRACTICE: Block3Area = BLOCK3_AREAS.find((a) => a.id === 'arte') ?? BLOCK3_AREAS[0]

type Values = Record<number, number>

/** Columnas en escritorio según la cantidad de actividades, para que no quede una tarjeta suelta:
 *  4 → una fila de 4 · 9 → 3+3+3 · 7 → 4+3 · 5 → 3+2 */
const colsFor = (n: number) => (n <= 4 ? n : n % 3 === 0 ? 3 : n % 4 === 0 || n % 4 === 3 ? 4 : 3)
function lgCols(n: number) {
  const cols = colsFor(n)
  return ({ 1: 'lg:grid-cols-1', 2: 'lg:grid-cols-2', 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4' } as Record<number, string>)[cols]
}
type Pt = { x: number; y: number }
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const countOf = (values: Values) => {
  const c: Record<number, number> = {}
  Object.values(values).forEach((v) => (c[v] = (c[v] ?? 0) + 1))
  return c
}

/* ---------- Tarjeta con casilla numérica (Figma: "cuandro de opcion bloque 3") ----------
   Propuesta C "Escribir, pero con ayuda": casilla gris punteada cuando está vacía,
   borde turquesa al escribir, roja si el número está repetido. */
function NumberedActivity({
  text,
  value,
  max,
  duplicated,
  bg,
  index,
  inputRef,
  onChange,
}: {
  text: string
  value?: number
  max: number
  duplicated: boolean
  bg: string
  index: number
  inputRef: (el: HTMLInputElement | null) => void
  onChange: (v?: number) => void
}) {
  const filled = value !== undefined
  return (
    <label
      className={cx(
        'flex min-h-[80px] w-full cursor-text items-center gap-2 rounded-md border-[2.6px] p-3 transition md:min-h-[100px]',
        bg,
        duplicated ? 'border-red-400' : filled ? 'border-brand' : 'border-[#e5e5e5] hover:border-brand',
      )}
    >
      <span className="flex-1 pr-1 text-sm leading-[21px] font-semibold text-[#3c3c3c]">{text}</span>
      <span className="relative flex h-16 w-14 shrink-0 md:h-[76px] md:w-16" data-box={index}>
        <input
          ref={inputRef}
          inputMode="numeric"
          enterKeyHint="next"
          maxLength={1}
          value={value ?? ''}
          onChange={(e) => {
            const n = parseInt(e.target.value.replace(/\D/g, '').slice(-1), 10)
            onChange(n >= 1 && n <= max ? n : undefined)
          }}
          onFocus={(e) => e.target.select()}
          aria-label={`Número para: ${text}`}
          aria-invalid={duplicated || undefined}
          className={cx(
            'size-full rounded-lg border-[3px] text-center text-[36px] leading-none font-bold text-navy outline-none transition focus:border-brand focus:shadow-[0_0_0_4px_rgb(51_161_184/0.25)] md:text-[44px]',
            duplicated
              ? 'border-solid border-red-500 bg-red-50 text-red-600'
              : filled
                ? 'border-solid border-brand bg-white [animation:pop-in_.25s_ease-out]'
                : 'border-dashed border-[#646464] bg-[#c6c6c6]',
          )}
        />
      </span>
    </label>
  )
}

/* ---------- Tablero del área ----------
   - Barra 1…N arriba: muestra qué números ya se usaron (turquesa) y cuáles están repetidos (rojo).
   - Al escribir un número, el cursor salta solo a la siguiente casilla vacía.
   - En práctica (demo=true) una manito enseña: no va en el orden de la lista, mira qué números faltan,
     y si repites un número se marca en rojo. No cambia las respuestas reales y se retira al tocar. */
function AreaBoard({ area, values, onChange, demo = false }: { area: Block3Area; values: Values; onChange: (v: Values) => void; demo?: boolean }) {
  const max = area.activities.length
  const boxRef = useRef<HTMLDivElement>(null)
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  // estado de la demostración
  const [touched, setTouched] = useState(false)
  const demoOn = demo && !touched
  const [hand, setHand] = useState<Pt | null>(null)
  const [pressed, setPressed] = useState(false)
  const [ripple, setRipple] = useState<{ k: number; at: Pt } | null>(null)
  const [talk, setTalk] = useState<ReactNode>(null)
  const [demoVals, setDemoVals] = useState<Values | null>(null)

  useEffect(() => {
    const box = boxRef.current
    if (!box || !demoOn) return
    const stop = () => setTouched(true)
    box.addEventListener('pointerdown', stop, true)
    box.addEventListener('keydown', stop, true)
    box.addEventListener('focusin', stop, true)
    return () => {
      box.removeEventListener('pointerdown', stop, true)
      box.removeEventListener('keydown', stop, true)
      box.removeEventListener('focusin', stop, true)
    }
  }, [demoOn])

  useEffect(() => {
    const box = boxRef.current
    if (!box || !demoOn) return
    let cancelled = false
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const at = (i: number): Pt => {
      const el = box.querySelector(`[data-box="${i}"]`)
      if (!el) return { x: 0, y: 0 }
      const r = el.getBoundingClientRect()
      const b = box.getBoundingClientRect()
      return { x: r.left - b.left + r.width * 0.55, y: r.top - b.top + r.height * 0.55 }
    }
    const tap = async (i: number) => {
      setPressed(true)
      setRipple({ k: Math.random(), at: at(i) })
      await sleep(220)
      setPressed(false)
    }
    const hi = (t: string, rest: string) => (
      <>
        <b className="text-[#8fd8e6]">{t}</b> {rest}
      </>
    )
    const first = Math.min(2, max - 1) // empieza por la 3.ª actividad, no por la 1.ª

    const run = async () => {
      await sleep(300)
      if (cancelled) return
      if (reduced) {
        setHand(at(first))
        setTalk(hi('No tiene que ser en el orden de la lista:', 'escribe el 1 en la que más disfrutarías'))
        return
      }
      setHand({ x: box.clientWidth * 0.5, y: box.clientHeight + 20 })
      await sleep(400)
      while (!cancelled) {
        setTalk(hi('No tiene que ser en el orden de la lista:', 'escribe el 1 en la que más disfrutarías'))
        setHand(at(first))
        await sleep(1600)
        if (cancelled) return
        await tap(first)
        setDemoVals({ [first]: 1 })
        await sleep(500)
        setTalk(hi('Arriba ves qué números', 'ya usaste y cuáles te faltan'))
        await sleep(1900)
        if (cancelled) return
        setHand(at(0))
        await sleep(800)
        if (cancelled) return
        await tap(0)
        setDemoVals({ [first]: 1, 0: 1 })
        setTalk(hi('¡Ojo!', 'si repites un número, se marca en rojo'))
        await sleep(2100)
        if (cancelled) return
        setDemoVals({ [first]: 1, 0: 2 })
        setTalk(hi('Cámbialo', 'y listo: cada número va una sola vez'))
        await sleep(2000)
        if (cancelled) return
        setDemoVals(null)
        await sleep(600)
      }
    }
    run()
    return () => {
      cancelled = true
      setTimeout(() => {
        setHand(null)
        setTalk(null)
        setDemoVals(null)
        setPressed(false)
      }, 0)
    }
  }, [demoOn, max])

  const view = demoOn && demoVals ? demoVals : values
  const counts = countOf(view)
  const nums = Object.values(view)
  const missing = Array.from({ length: max }, (_, i) => i + 1).filter((n) => !nums.includes(n))
  const repeated = Object.keys(counts)
    .map(Number)
    .filter((n) => counts[n] > 1)

  const setAt = (i: number, v?: number) => {
    const next = { ...values }
    if (v === undefined) delete next[i]
    else next[i] = v
    onChange(next)
    // salta sola a la siguiente casilla vacía
    if (v !== undefined) {
      const order = [...Array(max).keys()]
      const nextEmpty = [...order.slice(i + 1), ...order.slice(0, i)].find((j) => next[j] === undefined)
      if (nextEmpty !== undefined) setTimeout(() => inputs.current[nextEmpty]?.focus(), 0)
    }
  }

  return (
    <div className="mx-auto max-w-[1206px]">
      {/* Escala con la barra 1…N: única instrucción, siempre a la vista */}
      <div className="sticky top-0 z-20 -mx-4 flex items-center justify-center gap-2 bg-surface px-4 py-2 text-xs font-semibold text-fg shadow-[0_6px_10px_-6px_rgb(0_46_66/0.25)] md:static md:mx-0 md:flex-wrap md:gap-x-3 md:bg-transparent md:text-sm md:shadow-none" aria-hidden>
        <span className="md:hidden">Más</span>
        <span className="hidden md:inline">1 = Disfrutaría muchísimo</span>
        <span className="flex gap-1">
          {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
            <i
              key={n}
              className={cx(
                'grid size-6 place-items-center rounded-md text-[11px] font-extrabold not-italic transition md:size-7 md:text-xs',
                counts[n] > 1 ? 'bg-red-500 text-white' : counts[n] ? 'bg-brand text-white' : 'bg-[#ededed] text-[#6b7280]',
              )}
            >
              {n}
            </i>
          ))}
        </span>
        <span className="md:hidden">Menos</span>
        <span className="hidden md:inline">{max} = Disfrutaría menos</span>
      </div>

      {/* Mensaje de la manito (espacio reservado en práctica para que nada salte) */}
      {demo && (
        <div className="mt-3 flex min-h-[40px] items-center justify-center" role="status">
          {demoOn && talk && (
            <p key={String(talk && JSON.stringify(demoVals))} className="rounded-xl bg-navy px-4 py-2 text-center text-[13px] leading-snug font-semibold text-white animate-fade-up md:text-sm">
              {talk}
            </p>
          )}
        </div>
      )}

      <div ref={boxRef} className={cx('relative mt-4 grid gap-[6px] sm:grid-cols-2 sm:gap-x-5 lg:gap-x-6', lgCols(max))}>
        {area.activities.map((t, i) => (
          <NumberedActivity
            key={i}
            index={i}
            text={t}
            max={max}
            bg={ROW_BG[Math.floor(i / colsFor(max)) % 3]}
            value={view[i]}
            duplicated={view[i] !== undefined && counts[view[i]] > 1}
            inputRef={(el) => {
              inputs.current[i] = el
            }}
            onChange={(v) => setAt(i, v)}
          />
        ))}

        {demoOn && hand && (
          <div className="pointer-events-none absolute inset-0 z-30" aria-hidden>
            {ripple && (
              <span
                key={ripple.k}
                className="absolute size-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/40 [animation:demo-ripple_0.7s_ease-out_forwards]"
                style={{ left: ripple.at.x, top: ripple.at.y }}
              />
            )}
            <span className="absolute transition-[left,top] duration-700 ease-in-out" style={{ left: hand.x - 13, top: hand.y - 4 }}>
              <span className={cx('block transition-transform duration-150', pressed ? 'scale-90' : 'scale-100')}>
                <HandIcon />
              </span>
            </span>
          </div>
        )}
      </div>

      {/* Qué falta / repetidos (auditoría #5 y #6) */}
      <div className="mt-4 flex justify-center text-sm font-semibold" aria-live="polite">
        {repeated.length > 0 ? (
          <span className="rounded-full bg-red-50 px-4 py-2 text-red-700" role="alert">
            {repeated.length === 1 ? `El número ${repeated[0]} está repetido` : `Los números ${repeated.join(', ')} están repetidos`}: cada número se usa una sola vez.
          </span>
        ) : missing.length === 0 ? (
          <span className="rounded-full bg-blue-soft px-4 py-2 text-navy">¡Listo! Ya puedes continuar.</span>
        ) : (
          <span className="rounded-full bg-blue-soft px-4 py-2 text-navy">
            Te {missing.length === 1 ? 'falta el' : 'faltan los números'}: <b>{missing.join(', ')}</b>
          </span>
        )}
      </div>
    </div>
  )
}

/** Figma: frames "INGENIERIA", "ECONÓMICAS", "SOCIALES", "SALUD", "ARTE"… + "Tutorial bloque 8" */
export default function Block3Test() {
  const navigate = useNavigate()
  const { answers, saveAnswer, setRewards, rewards } = useApp()
  const flow = useBlockFlow('block3', '/test/bloque-3', [BLOCK3_AREAS.length])
  const [values, setValues] = useState<Values>(() => (flow.phase === 'test' ? (answers.block3[BLOCK3_AREAS[flow.globalIndex].id] ?? {}) : {}))

  const inPractice = flow.phase === 'practice' || flow.phase === 'practiceDone'
  const area = inPractice ? PRACTICE : BLOCK3_AREAS[flow.globalIndex]
  const max = area.activities.length
  const nums = Object.values(values)
  const complete = nums.length === max && new Set(nums).size === max

  const onContinue = () => {
    if (flow.phase === 'practice') {
      flow.finishPractice()
      // se limpian las casillas cuando empieza el test real (tras el aviso)
      setTimeout(() => setValues({}), 1500)
      return
    }
    saveAnswer('block3', area.id, values)
    const nextArea = BLOCK3_AREAS[flow.globalIndex + 1]
    setValues((nextArea && answers.block3[nextArea.id]) || {})
    flow.next()
  }

  const onPrev = () => {
    const prevArea = BLOCK3_AREAS[flow.globalIndex - 1]
    setValues(answers.block3[prevArea.id] ?? {})
    flow.prev()
  }

  return (
    <TestLayout
      prevDisabled={inPractice || flow.index === 0}
      onPrev={onPrev}
      footerRight={
        <PrimaryButton disabled={!complete} onClick={onContinue} className="md:w-[332px]">
          Continuar
        </PrimaryButton>
      }
    >
      {inPractice ? (
        <header className="mx-auto flex w-full max-w-[1352px] items-center gap-3 px-4 pt-4 md:gap-6 md:px-8 md:pt-6 2xl:px-0">
          <BackArrow to="/test/bloque-2" />
          <PracticeBanner />
          <ThemeToggle />
        </header>
      ) : (
        <TestHeader
          pill="Bloque 3 de 3 · Enfoque de interés"
          incentives={<AllIncentives />}
          progress={{ current: flow.index + 1, total: flow.sectionSize }}
        />
      )}

      {/* Una sola instrucción: la pregunta (la escala va en la barra 1…N del tablero) */}
      <section className="mx-auto mt-5 max-w-[1100px] px-4 text-center md:mt-8">
        <h1 className="text-base leading-snug font-bold md:text-lg xl:text-2xl">
          Enumera según qué actividades te imaginas disfrutando más en tu carrera profesional
        </h1>
        <p className="mt-1.5 text-sm font-medium text-section-label md:text-base">Escribe un número del 1 al {max} en cada actividad, sin repetir</p>
      </section>

      {flow.phase === 'practice' && (
        <PracticeCoach onSkip={flow.skipPractice}>
          {complete ? (
            <>
              <b className="text-[#8fd8e6]">¡Listo!</b> Toca Continuar.
            </>
          ) : (
            <>
              <b className="text-[#8fd8e6]">Escribe un número</b> en cada actividad: 1 es la que más disfrutarías, y no tiene que ser en el orden de la lista.
            </>
          )}
        </PracticeCoach>
      )}
      <div className="relative mt-5 px-4 pb-6 animate-fade-up md:mt-8" key={area.id}>
        <AreaBoard area={area} values={values} onChange={setValues} demo={flow.phase === 'practice'} />
      </div>

      {flow.phase === 'practiceDone' && <PracticeTransition heading="Ahora empieza el bloque 3 de verdad" onStart={flow.startTest} />}
      {flow.phase === 'loading' && <LoadingOverlay />}
      {flow.phase === 'test' && (
        <RewardCharger
          kind="trophy"
          done={flow.index}
          size={flow.sectionSize}
          earned={Number(rewards.trophy)}
          total={1}
          launchKey={flow.sectionDone}
          onLanded={() => {}}
          className="bottom-[80px] md:bottom-[108px]"
        />
      )}
      {flow.phase === 'reward' && (
        <Reward
          kind="trophy"
          earned={1}
          finalLabel="Ver resultados"
          onDone={() => {
            setRewards((r) => ({ ...r, trophy: true }))
            navigate('/cargando?next=/resultados')
          }}
        />
      )}
    </TestLayout>
  )
}
