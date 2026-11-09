import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import Reward from '../components/Reward'
import RewardCharger from '../components/RewardCharger'
import { HandIcon } from '../components/DemoHand'
import { DragDotsIcon } from '../components/icons'
import { AllIncentives, TestHeader, TestLayout } from '../components/TestLayout'
import { LoadingOverlay, PracticeBanner, PracticeCoach, PracticeTransition, useBlockFlow } from '../components/flow'
import { BackArrow, PrimaryButton, ThemeToggle, cx } from '../components/ui'
import { useApp } from '../context/AppContext'
import { BLOCK2_CASES, type Block2Case } from '../data/testData'

const LETTERS = ['A', 'B', 'C', 'D'] as const
const OPTION_BG = ['bg-cream', 'bg-blue-soft', 'bg-rose', 'bg-mist']
const SLOT_LABELS = ['Más importante', 'Importante', 'Moderado', 'Menos importante']

const PRACTICE: Block2Case = {
  situation: 'La ciudad organizará un festival para atraer visitantes el próximo mes.',
  options: BLOCK2_CASES[0].options,
}

type Slots = (number | null)[] // slot (1..4) → índice de opción

/* Estilo plano de Figma: casillas grises punteadas, opciones pastel y líneas turquesa */
const LINE = '#33a1b8'
const IDLE_DOT = '#c6c6c6'
const SHORT_LABELS = ['Más imp.', 'Importante', 'Moderado', 'Menos imp.']
const DEMO_OPT = 2 // la manito usa la C (no la A) para que se entienda que no va A con 1

type Pt = { x: number; y: number }
const curve = (a: Pt, b: Pt) => {
  const dx = Math.max(14, (b.x - a.x) / 2)
  return `M${a.x},${a.y} C${a.x + dx},${a.y} ${b.x - dx},${b.y} ${b.x},${b.y}`
}
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/* ---------- Ejercicio de ordenar · "une con líneas" (propuesta A, fiel a Figma) ----------
   Opciones A–D a la izquierda y puestos 1–4 a la derecha. Para unir:
   - arrastrar desde la opción hasta el número (mouse o dedo; se ve la línea en vivo), o
   - tocar la opción y luego el número.
   Soltar sobre un número ya unido intercambia; tocar un número unido (sin nada elegido) lo desune.
   En práctica (demo=true) una manito enseña a unir C→1 y a quitar; no cambia las respuestas reales
   y se retira apenas el estudiante toca el tablero. */
function RankingBoard({ data, slots, onChange, demo = false }: { data: Block2Case; slots: Slots; onChange: (s: Slots) => void; demo?: boolean }) {
  const boxRef = useRef<HTMLDivElement>(null)
  const optDots = useRef<(HTMLSpanElement | null)[]>([])
  const numDots = useRef<(HTMLSpanElement | null)[]>([])
  const [geo, setGeo] = useState<{ opt: Pt[]; num: Pt[] }>({ opt: [], num: [] })
  const [picked, setPicked] = useState<number | null>(null)
  const [drag, setDrag] = useState<{ opt: number; x0: number; y0: number; x: number; y: number; active: boolean } | null>(null)
  const [over, setOver] = useState<number | null>(null)
  const justDragged = useRef(false)
  const slotsRef = useRef(slots)
  const changeRef = useRef(onChange)
  useEffect(() => {
    slotsRef.current = slots
    changeRef.current = onChange
  })

  // estado de la demostración
  const [touched, setTouched] = useState(false)
  const demoOn = demo && !touched
  const [hand, setHand] = useState<Pt | null>(null)
  const [pressed, setPressed] = useState(false)
  const [ripple, setRipple] = useState<{ k: number; at: Pt } | null>(null)
  const [talk, setTalk] = useState<ReactNode>(null)
  const [demoDrag, setDemoDrag] = useState<Pt | null>(null)
  const [demoLinked, setDemoLinked] = useState(false)

  // posición de los puntitos de conexión (se recalcula si cambia el tamaño)
  useEffect(() => {
    const box = boxRef.current
    if (!box) return
    const measure = () => {
      const b = box.getBoundingClientRect()
      const pt = (el: HTMLElement | null): Pt => {
        if (!el) return { x: 0, y: 0 }
        const r = el.getBoundingClientRect()
        return { x: r.left + r.width / 2 - b.left, y: r.top + r.height / 2 - b.top }
      }
      setGeo({ opt: optDots.current.map(pt), num: numDots.current.map(pt) })
    }
    const ro = new ResizeObserver(measure)
    ro.observe(box)
    box.querySelectorAll('[data-measure]').forEach((el) => ro.observe(el))
    return () => ro.disconnect()
  }, [])

  // la demostración se retira cuando el estudiante toca el tablero
  useEffect(() => {
    const box = boxRef.current
    if (!box || !demoOn) return
    const stop = () => setTouched(true)
    box.addEventListener('pointerdown', stop, true)
    box.addEventListener('keydown', stop, true)
    return () => {
      box.removeEventListener('pointerdown', stop, true)
      box.removeEventListener('keydown', stop, true)
    }
  }, [demoOn])

  // guion de la manito: "no tiene que ser A con 1" → arrastra C al 1 → toca el 1 para quitar
  useEffect(() => {
    const box = boxRef.current
    if (!box || !demoOn) return
    let cancelled = false
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const at = (el: Element | null, fx = 0.5, fy = 0.5): Pt => {
      if (!el) return { x: 0, y: 0 }
      const r = el.getBoundingClientRect()
      const b = box.getBoundingClientRect()
      return { x: r.left - b.left + r.width * fx, y: r.top - b.top + r.height * fy }
    }
    const letterC = () => at(box.querySelector(`[data-demo-option="${LETTERS[DEMO_OPT]}"] [data-letter]`))
    const one = () => at(box.querySelector('[data-slot-index="0"]'))
    const tapAt = (p: Pt) => setRipple({ k: Math.random(), at: p })
    const intro = (
      <>
        <b className="text-[#8fd8e6]">No tiene que ser A con 1:</b> elige lo que mejor se adapte a ti
      </>
    )

    const run = async () => {
      await sleep(300)
      if (cancelled) return
      if (reduced) {
        setHand(letterC())
        setTalk(intro)
        return
      }
      setHand({ x: box.clientWidth * 0.45, y: box.clientHeight + 20 })
      await sleep(500)
      while (!cancelled) {
        setTalk(intro)
        setHand(letterC())
        await sleep(1700)
        if (cancelled) return
        setPressed(true)
        tapAt(letterC())
        await sleep(250)
        // arrastre animado de C hasta el 1
        const a = letterC()
        const b = one()
        await new Promise<void>((res) => {
          const t0 = performance.now()
          const step = (t: number) => {
            if (cancelled) return res()
            const k = Math.min(1, (t - t0) / 1100)
            const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2
            const p = { x: a.x + (b.x - a.x) * e, y: a.y + (b.y - a.y) * e }
            setDemoDrag(p)
            setHand(p)
            if (k < 1) requestAnimationFrame(step)
            else res()
          }
          requestAnimationFrame(step)
        })
        if (cancelled) return
        setPressed(false)
        setDemoDrag(null)
        setDemoLinked(true)
        setTalk(
          <>
            <b className="text-[#8fd8e6]">¡Así se une!</b> Si la C es la que más va contigo, va al 1
          </>,
        )
        await sleep(2400)
        if (cancelled) return
        const o = one()
        setHand({ x: o.x + 6, y: o.y + 6 })
        setTalk(
          <>
            <b className="text-[#8fd8e6]">Para quitar:</b> toca el número
          </>,
        )
        await sleep(1000)
        if (cancelled) return
        setPressed(true)
        tapAt(one())
        await sleep(220)
        setPressed(false)
        setDemoLinked(false)
        await sleep(1500)
      }
    }
    run()
    return () => {
      cancelled = true
      setTimeout(() => {
        setHand(null)
        setTalk(null)
        setDemoDrag(null)
        setDemoLinked(false)
        setPressed(false)
      }, 0)
    }
  }, [demoOn])

  // lo que se dibuja: las respuestas reales, más la unión de la demostración
  const view: Slots = demoOn && demoLinked ? slots.map((v, i) => (i === 0 ? DEMO_OPT : v)) : slots

  const place = (option: number, slot: number) => {
    const s = [...slotsRef.current]
    const prev = s.indexOf(option)
    const other = s[slot]
    if (prev >= 0) s[prev] = other // intercambio
    s[slot] = option
    changeRef.current(s)
  }

  // arrastre con pointer events (mouse, dedo y lápiz)
  const dragOpt = drag?.opt ?? null
  useEffect(() => {
    if (dragOpt === null) return
    const slotAt = (x: number, y: number) => {
      const el = document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-slot-index]')
      return el ? Number(el.dataset.slotIndex) : null
    }
    const move = (e: PointerEvent) => {
      const b = boxRef.current?.getBoundingClientRect()
      setDrag((d) =>
        d
          ? {
              ...d,
              x: e.clientX - (b?.left ?? 0),
              y: e.clientY - (b?.top ?? 0),
              active: d.active || Math.hypot(e.clientX - d.x0, e.clientY - d.y0) > 6,
            }
          : d,
      )
      setOver(slotAt(e.clientX, e.clientY))
    }
    const up = (e: PointerEvent) => {
      const target = slotAt(e.clientX, e.clientY)
      setDrag((d) => {
        if (d?.active) {
          justDragged.current = true
          setTimeout(() => (justDragged.current = false), 0)
          if (target !== null) setTimeout(() => place(d.opt, target), 0)
        }
        return null
      })
      setOver(null)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragOpt])

  const startDrag = (opt: number) => (e: React.PointerEvent) => {
    if (e.button !== 0) return
    const b = boxRef.current?.getBoundingClientRect()
    setPicked(null)
    setDrag({ opt, x0: e.clientX, y0: e.clientY, x: e.clientX - (b?.left ?? 0), y: e.clientY - (b?.top ?? 0), active: false })
  }
  const dragging = drag?.active ? drag.opt : null
  const choosing = picked !== null || dragging !== null

  const onNumber = (slot: number) => {
    if (justDragged.current) return
    if (picked !== null) {
      place(picked, slot)
      setPicked(null)
    } else if (slots[slot] !== null) {
      onChange(slots.map((v, i) => (i === slot ? null : v)))
    }
  }

  // línea punteada que sigue al dedo (real o de la manito)
  const live = drag?.active ? { opt: drag.opt, to: drag } : demoDrag ? { opt: DEMO_OPT, to: demoDrag } : null

  return (
    <div className="flex flex-col items-center">
      {/* Mensaje de la manito (arriba del tablero, siempre visible); el espacio queda reservado en práctica */}
      {demo && (
        <div className="mb-3 flex min-h-[44px] items-center justify-center" role="status">
          {demoOn && talk && (
            <p key={String(demoLinked) + String(!!demoDrag)} className="rounded-xl bg-navy px-4 py-2 text-center text-[13px] leading-snug font-semibold text-white animate-fade-up md:text-sm">
              {talk}
            </p>
          )}
        </div>
      )}
      <div
        ref={boxRef}
        className="relative mx-auto grid w-full max-w-[760px] grid-cols-[minmax(0,1fr)_28px_72px] items-stretch gap-y-2 sm:grid-cols-[minmax(0,1fr)_56px_150px] md:gap-y-2.5"
      >
        {/* Encabezados de columna */}
        <p className="col-start-1 text-left text-xs font-bold tracking-wide text-muted uppercase">Opciones</p>
        <p className="col-start-3 text-center text-xs font-bold tracking-wide text-muted uppercase">Tu orden</p>

        {/* Líneas de unión */}
        <svg className="pointer-events-none absolute inset-0 z-10 size-full overflow-visible" aria-hidden>
          {view.map((opt, slot) =>
            opt === null || live?.opt === opt || !geo.opt[opt] || !geo.num[slot] ? null : (
              <path
                key={`${opt}-${slot}`}
                d={curve(geo.opt[opt], geo.num[slot])}
                stroke={LINE}
                strokeWidth={4}
                strokeLinecap="round"
                fill="none"
                pathLength={1}
                className="[stroke-dasharray:1] [animation:draw-line_.45s_ease-out]"
              />
            ),
          )}
          {live && geo.opt[live.opt] && (
            <g>
              <path d={curve(geo.opt[live.opt], live.to)} stroke={LINE} strokeWidth={4} strokeLinecap="round" strokeDasharray="1 9" fill="none" />
              <circle cx={live.to.x} cy={live.to.y} r={16} fill={LINE} stroke="white" strokeWidth={3} />
              <text x={live.to.x} y={live.to.y} dy="0.35em" textAnchor="middle" fill="white" fontSize={15} fontWeight={800}>
                {LETTERS[live.opt]}
              </text>
            </g>
          )}
        </svg>

        {data.options.map((text, i) => {
          const used = view.includes(i)
          return (
            <button
              key={i}
              type="button"
              data-demo-option={LETTERS[i]}
              data-measure
              style={{ gridRow: i + 2 }}
              onPointerDown={startDrag(i)}
              onClick={() => !justDragged.current && setPicked((p) => (p === i ? null : i))}
              aria-pressed={picked === i}
              aria-label={`Opción ${LETTERS[i]}: ${text}. ${slots.includes(i) ? `Unida al puesto ${slots.indexOf(i) + 1}. ` : ''}Tócala y luego toca un número`}
              className={cx(
                'relative col-start-1 flex min-h-[64px] w-full cursor-grab touch-none items-center gap-2 rounded-md border-[2.6px] py-2 pr-4 pl-2.5 text-left transition select-none md:gap-3 md:py-2.5 md:pr-6 md:pl-3',
                OPTION_BG[i],
                used ? 'border-brand' : 'border-[#e5e5e5] hover:border-brand',
                picked === i && '-translate-y-0.5 border-brand ring-4 ring-brand/25',
                dragging === i && 'border-brand opacity-70',
              )}
            >
              <DragDotsIcon className="h-[11px] w-[7px] shrink-0 text-black" />
              <span className="min-w-0 flex-1 text-[13px] leading-[18px] font-semibold text-[#3c3c3c] md:text-sm md:leading-[21px]">{text}</span>
              <span
                data-letter
                className="flex size-10 shrink-0 items-center justify-center rounded-full border-[2.4px] border-[#e5e5e5] bg-white text-lg font-bold text-navy md:size-12 md:text-[22px]"
              >
                {LETTERS[i]}
              </span>
              <span
                ref={(el) => {
                  optDots.current[i] = el
                }}
                className="absolute top-1/2 -right-[9px] z-20 size-[14px] -translate-y-1/2 rounded-full border-[3px] border-white shadow-[0_1px_3px_rgb(0_0_0/0.3)]"
                style={{ background: used || picked === i ? LINE : IDLE_DOT }}
              >
                {picked === i && <span className="absolute inset-0 animate-ping rounded-full bg-brand" />}
              </span>
            </button>
          )
        })}

        {SLOT_LABELS.map((label, slot) => {
          const opt = view[slot]
          const filled = opt !== null
          return (
            <button
              key={label}
              type="button"
              data-demo-slot={slot + 1}
              data-slot-index={slot}
              style={{ gridRow: slot + 2 }}
              onClick={() => onNumber(slot)}
              aria-label={slots[slot] !== null ? `Puesto ${slot + 1}, ${label}: opción ${LETTERS[slots[slot]!]}. Toca para quitar` : `Puesto ${slot + 1}, ${label}: sin unir`}
              className={cx(
                'relative col-start-3 flex flex-col items-center justify-center gap-0.5 rounded-[7px] border-[3px] px-1 py-1 text-navy transition',
                filled ? cx('border-solid border-brand', OPTION_BG[opt]) : 'border-dashed border-[#646464] bg-[#c6c6c6]',
                !filled && choosing && 'border-brand',
                over === slot && 'scale-105 border-brand',
              )}
            >
              <span
                ref={(el) => {
                  numDots.current[slot] = el
                }}
                className="absolute top-1/2 -left-[9px] z-20 size-[14px] -translate-y-1/2 rounded-full border-[3px] border-white shadow-[0_1px_3px_rgb(0_0_0/0.3)]"
                style={{ background: filled ? LINE : IDLE_DOT }}
              />
              <span className="text-2xl leading-none font-bold md:text-[30px]">{slot + 1}</span>
              <span className="text-center text-[9px] leading-[10px] font-bold sm:hidden">{SHORT_LABELS[slot]}</span>
              <span className="hidden text-center text-xs leading-[14px] font-bold sm:block">{label}</span>
              {filled && (
                <span className="rounded-full border-[1.5px] border-[#e5e5e5] bg-white px-1.5 text-[9px] leading-4 font-bold whitespace-nowrap sm:text-[10px]">Opción {LETTERS[opt]}</span>
              )}
            </button>
          )
        })}

        {/* Manito de la demostración */}
        {demoOn && hand && (
          <div className="pointer-events-none absolute inset-0 z-30" aria-hidden>
            {ripple && (
              <span
                key={ripple.k}
                className="absolute size-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/40 [animation:demo-ripple_0.7s_ease-out_forwards]"
                style={{ left: ripple.at.x, top: ripple.at.y }}
              />
            )}
            <span
              className={cx('absolute ease-in-out', !demoDrag && 'transition-[left,top] duration-700')}
              style={{ left: hand.x - 13, top: hand.y - 4 }}
            >
              <span className={cx('block transition-transform duration-150', pressed ? 'scale-90' : 'scale-100')}>
                <HandIcon />
              </span>
            </span>
          </div>
        )}
      </div>

      {/* Indicación fija */}
      <p className="mt-4 max-w-[760px] text-center text-xs text-section-label md:text-sm">
          Arrastra desde una opción hasta un número, o toca la opción y luego el número. Toca un número para quitar.{' '}
          <b>No tiene que ser A con 1:</b> ordénalas según lo que mejor se adapte a ti.
        </p>
    </div>
  )
}

/** Figma: "pregunta bloque 2: pregunta N" / ": N" + "Tutorial bloque 8" */
export default function Block2Test() {
  const navigate = useNavigate()
  const { answers, saveAnswer, setRewards, rewards } = useApp()
  const demoRef = useRef<HTMLDivElement>(null)
  const flow = useBlockFlow('block2', '/test/bloque-2', [BLOCK2_CASES.length])
  const [slots, setSlots] = useState<Slots>(() => {
    const saved = flow.phase === 'test' ? answers.block2[flow.globalIndex] : undefined
    return saved ? saved.map((l) => LETTERS.indexOf(l as (typeof LETTERS)[number])) : [null, null, null, null]
  })

  const inPractice = flow.phase === 'practice' || flow.phase === 'practiceDone'
  const data = inPractice ? PRACTICE : BLOCK2_CASES[flow.globalIndex]
  const placed = slots.filter((s) => s !== null).length
  const complete = placed === 4

  const loadSlots = (i: number) => {
    const saved = answers.block2[i]
    setSlots(saved ? saved.map((l) => LETTERS.indexOf(l as (typeof LETTERS)[number])) : [null, null, null, null])
  }

  const onContinue = () => {
    if (flow.phase === 'practice') {
      flow.finishPractice()
      // se limpian las casillas cuando empieza el test real (tras el aviso)
      setTimeout(() => setSlots([null, null, null, null]), 1500)
      return
    }
    saveAnswer('block2', flow.globalIndex, slots.map((s) => LETTERS[s ?? 0]))
    if (flow.index < flow.sectionSize - 1) loadSlots(flow.globalIndex + 1)
    flow.next()
  }

  const onPrev = () => {
    loadSlots(flow.globalIndex - 1)
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
          <BackArrow to="/test/bloque-1" />
          <PracticeBanner />
          <ThemeToggle />
        </header>
      ) : (
        <TestHeader
          pill="Bloque 2 de 3 · Casos prácticos"
          incentives={<AllIncentives />}
          progress={{ current: flow.index + 1, total: flow.sectionSize }}
        />
      )}

      <section className="mx-auto mt-5 flex max-w-[1100px] flex-col gap-3 px-4 text-center md:mt-8 md:gap-5">
        <h1 key={data.situation} className="text-[clamp(1.25rem,2.3vw,2rem)] leading-[1.25] font-medium animate-fade-up">
          {data.situation}
        </h1>
        <p className="text-base leading-snug font-medium md:text-lg xl:text-2xl">
          No existen respuestas correctas e incorrectas · <b>Ordena según tu preferencia</b>
        </p>
      </section>

      {flow.phase === 'practice' && (
        <PracticeCoach onSkip={flow.skipPractice}>
          {complete ? (
            <>
              <b className="text-[#8fd8e6]">¡Listo!</b> Toca Continuar.
            </>
          ) : placed > 0 ? (
            <>
              <b className="text-[#8fd8e6]">¡Muy bien!</b> Te {4 - placed === 1 ? 'falta 1' : `faltan ${4 - placed}`}.
            </>
          ) : (
            <>
              <b className="text-[#8fd8e6]">Une cada opción con un número:</b> arrástrala o tócala y luego toca el número. 1 es lo más importante, y no tiene que ser la A.
</>
          )}
        </PracticeCoach>
      )}
      <div ref={demoRef} className="relative mt-5 px-4 md:mt-8">
        <RankingBoard key={data.situation} data={data} slots={slots} onChange={setSlots} demo={flow.phase === 'practice'} />
      </div>

      {flow.phase === 'practiceDone' && <PracticeTransition heading="Ahora empiezan los casos de verdad" onStart={flow.startTest} />}
      {flow.phase === 'loading' && <LoadingOverlay />}
      {flow.phase === 'test' && (
        <RewardCharger
          kind="diamond"
          done={flow.index}
          size={flow.sectionSize}
          earned={Number(rewards.diamond)}
          total={1}
          launchKey={flow.sectionDone}
          onLanded={() => {}}
          className="bottom-[80px] md:bottom-[108px]"
        />
      )}
      {flow.phase === 'reward' && (
        <Reward
          kind="diamond"
          earned={1}
          onDone={() => {
            setRewards((r) => ({ ...r, diamond: true }))
            if (flow.afterReward()) navigate('/test/bloque-3')
          }}
        />
      )}
    </TestLayout>
  )
}
