import { useEffect, useId, useRef, useState } from 'react'
import { INCENTIVE_PATHS, type IncentiveKind } from './icons'
import { cx } from './ui'

/*
 * Corazón que se carga · el incentivo se llena como un vaso con cada respuesta.
 * Vive en la esquina inferior derecha y nunca bloquea el test.
 * Al completar una sección: brilla, tiembla, despega dejando una estela hasta su lugar
 * en la fila de arriba ([data-reward-slot]) y aparece un aviso corto. Luego vuelve a vacío.
 */

const COLOR: Record<IncentiveKind, { fill: string; light: string }> = {
  heart: { fill: '#33a1b8', light: '#8fd8e6' },
  star: { fill: '#d28800', light: '#ffbe2c' },
  diamond: { fill: '#ffa101', light: '#ffd56b' },
  trophy: { fill: '#ffa101', light: '#ffd56b' },
}
const NAME: Record<IncentiveKind, [string, string]> = {
  heart: ['¡Corazón ganado!', '♥'],
  star: ['¡Estrella ganada!', '★'],
  diamond: ['¡Diamante ganado!', '◆'],
  trophy: ['¡Trofeo ganado!', '🏆'],
}

/*
 * El líquido se llena por ÁREA, no por altura: cada ícono tiene su contorno real (arriba/abajo)
 * y una curva medida de "qué altura hace falta para llenar 10 %, 20 %…" de su superficie.
 * Así el diamante (punta abajo) se ve llenarse desde la primera respuesta.
 */
const FILL: Record<IncentiveKind, { top: number; bottom: number; need: number[] }> = {
  heart: { top: 5, bottom: 29, need: [0, 0.23, 0.33, 0.43, 0.51, 0.58, 0.66, 0.73, 0.8, 0.88, 1] },
  star: { top: 2.64, bottom: 26.94, need: [0, 0.14, 0.23, 0.32, 0.41, 0.48, 0.54, 0.59, 0.65, 0.73, 1] },
  diamond: { top: 4, bottom: 29, need: [0, 0.26, 0.38, 0.47, 0.54, 0.61, 0.67, 0.74, 0.81, 0.9, 1] },
  trophy: { top: 5, bottom: 27, need: [0, 0.29, 0.42, 0.52, 0.58, 0.65, 0.72, 0.8, 0.85, 0.91, 1] },
}
/** altura de la superficie del líquido (coordenada y del ícono) para una fracción de área 0..1 */
function surfaceY(kind: IncentiveKind, level: number) {
  const { top, bottom, need } = FILL[kind]
  const t = Math.max(0, Math.min(1, level)) * 10
  const i = Math.min(9, Math.floor(t))
  const h = need[i] + (need[i + 1] - need[i]) * (t - i)
  return level >= 1 ? top - 2 : bottom - h * (bottom - top)
}

const reduced = () => {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return false
  }
}

/** Busca el ícono visible de la fila de arriba (el encabezado tiene versiones para celular y escritorio) */
function findSlot(kind: IncentiveKind, i: number): HTMLElement | null {
  const all = Array.from(document.querySelectorAll<HTMLElement>(`[data-reward-slot="${kind}-${i}"]`))
  return all.find((el) => el.getClientRects().length > 0) ?? null
}

export default function RewardCharger({
  kind,
  done,
  size,
  earned,
  total,
  launchKey,
  onLanded,
  className,
}: {
  kind: IncentiveKind
  /** respuestas dadas en la sección actual */
  done: number
  size: number
  /** incentivos ya ganados de este tipo */
  earned: number
  total: number
  /** cambia cada vez que se completa una sección: dispara el despegue */
  launchKey: number
  /** el incentivo llegó a la fila de arriba: aquí se suma al estado */
  onLanded: () => void
  className?: string
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const boxRef = useRef<HTMLDivElement>(null)
  const landedRef = useRef(onLanded)
  useEffect(() => {
    landedRef.current = onLanded
  })
  const [launching, setLaunching] = useState(false)
  const [shake, setShake] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [fly, setFly] = useState<{ from: DOMRect; to: DOMRect | null; go: boolean } | null>(null)
  const firstLaunch = useRef(launchKey)
  const earnedRef = useRef(earned)
  useEffect(() => {
    earnedRef.current = earned
  })

  // saltito en cada respuesta
  const prevDone = useRef(done)
  useEffect(() => {
    if (done > prevDone.current && !reduced()) boxRef.current?.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.12)' }, { transform: 'scale(1)' }], { duration: 350, easing: 'ease' })
    prevDone.current = done
  }, [done])

  // despegue al completar una sección
  useEffect(() => {
    if (launchKey === firstLaunch.current) return
    firstLaunch.current = launchKey
    const slotIndex = earnedRef.current
    const [title, sym] = NAME[kind]
    const msg = `${sym} ${title} ${slotIndex + 1} de ${total}`
    const finish = () => {
      setFly(null)
      setLaunching(false)
      landedRef.current()
      setToast(msg)
    }
    const timers: ReturnType<typeof setTimeout>[] = []
    if (reduced()) {
      timers.push(setTimeout(finish, 0))
      return () => timers.forEach(clearTimeout)
    }
    timers.push(
      setTimeout(() => {
        setLaunching(true)
        setShake(true)
      }, 0),
    )
    timers.push(
      setTimeout(() => {
        setShake(false)
        const from = boxRef.current?.getBoundingClientRect()
        const to = findSlot(kind, slotIndex)?.getBoundingClientRect() ?? null
        if (!from) return finish()
        setFly({ from, to, go: false })
        requestAnimationFrame(() => requestAnimationFrame(() => setFly((f) => (f ? { ...f, go: true } : f))))
        timers.push(setTimeout(finish, 800))
      }, 600),
    )
    return () => timers.forEach(clearTimeout)
  }, [launchKey, kind, total])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(t)
  }, [toast])

  const level = launching ? 1 : Math.min(1, done / size)
  const y = surfaceY(kind, level) - 3 // las olas tienen su superficie en y≈3
  const { fill, light } = COLOR[kind]
  const path = INCENTIVE_PATHS[kind]

  return (
    <>
      <div className={cx('pointer-events-none fixed right-3 z-30 flex flex-row-reverse items-center gap-2 md:right-6', className)} aria-hidden>
        <div
          ref={boxRef}
          className={cx('relative size-14 md:size-[72px]', shake && '[animation:charger-ready_.6s_ease_both]')}
        >
          <svg viewBox="0 0 32 32" className="size-full overflow-visible drop-shadow-[0_6px_10px_rgb(0_46_66/0.18)]">
            <defs>
              <clipPath id={`cl${uid}`}>
                <path d={path} />
              </clipPath>
            </defs>
            <path d={path} fill="#fff" stroke={fill} strokeWidth="1.6" />
            <g clipPath={`url(#cl${uid})`}>
              <g style={{ transform: `translateY(${Math.max(0, y - 1.5)}px)`, transition: 'transform .6s cubic-bezier(.3,1.4,.5,1)' }}>
                <g className="[animation:wave-x_1.6s_linear_infinite]">
                  <path d="M0 2 Q4 0 8 2 T16 2 T24 2 T32 2 T40 2 T48 2 T56 2 T64 2 V40 H0 Z" fill={light} opacity=".7" />
                </g>
              </g>
              <g style={{ transform: `translateY(${y}px)`, transition: 'transform .6s cubic-bezier(.3,1.4,.5,1)' }}>
                <g className="[animation:wave-x_2.2s_linear_infinite]">
                  <path d="M0 3 Q4 1 8 3 T16 3 T24 3 T32 3 T40 3 T48 3 T56 3 T64 3 V40 H0 Z" fill={fill} />
                </g>
              </g>
            </g>
          </svg>
        </div>
        <span className="rounded-full border border-black/8 bg-white px-2.5 py-0.5 text-xs font-bold text-action shadow-[0_4px_10px_rgb(0_46_66/0.08)]">
          {launching ? size : done}/{size}
          <span className="ml-1 font-semibold text-muted">
            · {earned} de {total}
          </span>
        </span>
        {toast && (
          <span className="absolute right-0 bottom-[calc(100%+10px)] rounded-full bg-[linear-gradient(90deg,#002e42,#1f7a8c)] px-4 py-2 text-[13px] font-semibold whitespace-nowrap text-white shadow-[0_8px_20px_rgb(0_46_66/0.3)] [animation:toast-in_2.6s_ease_both]">
            {toast}
          </span>
        )}
      </div>

      {/* el incentivo volando hacia la fila de arriba */}
      {fly && (
        <svg
          viewBox="0 0 32 32"
          aria-hidden
          className="pointer-events-none fixed z-50"
          style={{
            left: fly.go && fly.to ? fly.to.left : fly.from.left + fly.from.width / 2 - 20,
            top: fly.go && fly.to ? fly.to.top : fly.from.top + fly.from.height / 2 - 20,
            width: fly.go && fly.to ? fly.to.width : 40,
            height: fly.go && fly.to ? fly.to.height : 40,
            opacity: fly.go && !fly.to ? 0 : 1,
            fill,
            filter: `drop-shadow(0 0 10px ${light})`,
            transition: 'left .75s cubic-bezier(.6,-0.25,.3,1), top .75s cubic-bezier(.6,-0.25,.3,1), width .75s, height .75s, opacity .75s',
          }}
        >
          <path d={path} />
        </svg>
      )}

      <p className="sr-only" role="status">
        {toast ?? ''}
      </p>
    </>
  )
}
