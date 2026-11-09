import { useEffect, useRef, useState, type RefObject } from 'react'

/*
 * Manito animada para el modo práctica.
 * Muestra cómo se responde cada tipo de pregunta moviéndose sobre los elementos reales:
 *   - 'sweep'  (personalidad): baja por las opciones una por una y toca una.
 *   - 'pair'   (bloque 1): pasa por la tarjeta A, luego la B, y toca una.
 *   - 'drag'   (bloque 2): toma una opción y la arrastra hasta la casilla 1.
 *   - 'type'   (bloque 3): toca la primera casilla y escribe un número.
 * Es solo una demostración: no responde nada. Se repite hasta que el estudiante
 * toca la pantalla, y entonces desaparece. Con "reducir movimiento" queda quieta.
 */

export type DemoMode = 'sweep' | 'pair' | 'drag' | 'type'

type Point = { x: number; y: number }

export const HandIcon = () => (
  <svg viewBox="0 0 64 72" className="h-[46px] w-[41px] drop-shadow-[0_4px_6px_rgb(0_0_0/0.35)] md:h-[54px] md:w-[48px]" aria-hidden>
    <path
      d="M22 6c3.3 0 6 2.7 6 6v21l3-1.2V27c0-3.3 2.7-6 6-6s6 2.7 6 6v4.6l1.6-.5c3.1-.9 6.4.9 7.3 4l.2.6 2.2-.4c3.3-.6 6.4 1.6 7 4.8l.1.8V52c0 10.5-8.5 19-19 19H35c-6.2 0-12-3-15.6-8.1L7.6 46.4c-2-2.8-1.4-6.6 1.3-8.6 2.6-1.9 6.2-1.6 8.4.7L16 38.3V12c0-3.3 2.7-6 6-6Z"
      fill="#fff"
      stroke="#002e42"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
    <path d="M31 46v12M41 46v12M51 46v10" stroke="#002e42" strokeWidth="3" strokeLinecap="round" opacity=".35" />
  </svg>
)

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

export default function DemoHand({
  container,
  mode,
  active,
}: {
  container: RefObject<HTMLElement | null>
  mode: DemoMode
  /** se apaga cuando el estudiante ya interactuó o terminó la práctica */
  active: boolean
}) {
  const [pos, setPos] = useState<Point | null>(null)
  const [tap, setTap] = useState(0) // cambia en cada "toque" para reiniciar la onda
  const [pressed, setPressed] = useState(false)
  const [ghost, setGhost] = useState<{ text: string; at: Point } | null>(null)
  const [typed, setTyped] = useState<{ text: string; at: Point } | null>(null)
  const [touched, setTouched] = useState(false)
  const hovered = useRef<HTMLElement | null>(null)

  const on = active && !touched

  // Si el estudiante toca cualquier cosa dentro del área, la demostración se retira
  useEffect(() => {
    const el = container.current
    if (!el || !on) return
    const stop = () => setTouched(true)
    el.addEventListener('pointerdown', stop)
    el.addEventListener('keydown', stop)
    return () => {
      el.removeEventListener('pointerdown', stop)
      el.removeEventListener('keydown', stop)
    }
  }, [container, on])

  useEffect(() => {
    const root = container.current
    if (!root || !on) return
    let cancelled = false
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    // Posición del centro de un elemento, relativa al contenedor
    const center = (el: Element, fx = 0.5, fy = 0.55): Point => {
      const r = el.getBoundingClientRect()
      const c = root.getBoundingClientRect()
      return { x: r.left - c.left + r.width * fx, y: r.top - c.top + r.height * fy }
    }
    const hover = (el: HTMLElement | null) => {
      hovered.current?.classList.remove('demo-hover')
      if (el) el.classList.add('demo-hover')
      hovered.current = el
    }
    const q = (sel: string) => Array.from(root.querySelectorAll<HTMLElement>(sel))

    const moveTo = async (el: HTMLElement, ms = 650, fx?: number, fy?: number) => {
      if (cancelled) return
      setPos(center(el, fx, fy))
      hover(el)
      await wait(ms)
    }
    const doTap = async () => {
      if (cancelled) return
      setPressed(true)
      setTap((t) => t + 1)
      await wait(220)
      setPressed(false)
      await wait(700)
    }

    const run = async () => {
      if (reduced) {
        // Sin animación: la manito queda quieta sobre el primer elemento
        const first = q(mode === 'drag' ? '[data-demo-option]' : mode === 'type' ? 'input' : mode === 'pair' ? 'button[aria-pressed]' : '[role=radio]')[0]
        if (first) setPos(center(first))
        return
      }
      await wait(500)
      while (!cancelled) {
        if (mode === 'sweep') {
          const opts = q('[role=radio]')
          for (const o of opts) await moveTo(o, 520, 0.18)
          const pick = opts[Math.min(3, opts.length - 1)]
          if (pick) {
            await moveTo(pick, 600, 0.18)
            await doTap()
          }
        } else if (mode === 'pair') {
          const cards = q('button[aria-pressed]')
          for (const c of cards) await moveTo(c, 900)
          if (cards[0]) {
            await moveTo(cards[0], 700)
            await doTap()
          }
        } else if (mode === 'drag') {
          const opt = q('[data-demo-option]')[0]
          const slot = q('[data-demo-slot]')[0]
          if (opt && slot) {
            await moveTo(opt, 700, 0.3)
            setPressed(true)
            setTap((t) => t + 1)
            await wait(250)
            const from = center(opt, 0.3)
            setGhost({ text: opt.dataset.demoOption ?? '', at: from })
            await wait(50)
            const to = center(slot)
            setPos(to)
            setGhost({ text: opt.dataset.demoOption ?? '', at: to })
            hover(slot)
            await wait(900)
            setPressed(false)
            setTap((t) => t + 1)
            await wait(900)
            setGhost(null)
          }
        } else if (mode === 'type') {
          const input = q('input')[0]
          if (input) {
            await moveTo(input, 750)
            await doTap()
            setTyped({ text: '1', at: center(input, 0.5, 0.45) })
            await wait(1300)
            setTyped(null)
          }
        }
        hover(null)
        await wait(700)
      }
    }
    run()
    return () => {
      cancelled = true
      hovered.current?.classList.remove('demo-hover')
      hovered.current = null
    }
  }, [container, mode, on])

  if (!on || !pos) return null

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-visible" aria-hidden>
      {/* onda del toque */}
      <span
        key={tap}
        className="absolute size-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/40 [animation:demo-ripple_0.7s_ease-out_forwards]"
        style={{ left: pos.x, top: pos.y }}
      />
      {/* opción que se arrastra (bloque 2) */}
      {ghost && (
        <span
          className="absolute flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-brand bg-white text-xl font-bold text-navy shadow-lg transition-[left,top] duration-[850ms] ease-in-out"
          style={{ left: ghost.at.x, top: ghost.at.y }}
        >
          {ghost.text}
        </span>
      )}
      {/* número que se escribe (bloque 3) */}
      {typed && (
        <span
          className="absolute -translate-x-1/2 -translate-y-1/2 text-[44px] font-bold text-navy [animation:pop-in_0.35s_ease_both]"
          style={{ left: typed.at.x, top: typed.at.y }}
        >
          {typed.text}
        </span>
      )}
      {/* la manito: la punta del dedo queda sobre el punto */}
      <span
        className="absolute transition-[left,top] duration-500 ease-in-out"
        style={{ left: pos.x - 13, top: pos.y - 4 }}
      >
        <span className={`block transition-transform duration-150 ${pressed ? 'scale-90' : 'scale-100'}`}>
          <HandIcon />
        </span>
      </span>
    </div>
  )
}
