import { useEffect, useRef, useState } from 'react'
import { IncentiveIcon, RocketIcon, type IncentiveKind } from './icons'
import { PrimaryButton } from './ui'
import { useApp } from '../context/AppContext'

/*
 * Fin de etapa o de bloque · Propuesta A "Insignia con fuegos artificiales".
 * Las secciones intermedias ya no detienen el test (ver RewardCharger); esta pantalla
 * completa solo aparece al ganar el último incentivo:
 *   0,3 s  los incentivos de la fila bajan uno tras otro y se funden
 *   1,25 s destello en toda la pantalla y onda expansiva
 *   1,3 s  la insignia dorada aparece girando, con rayos detrás
 *   1,5 s  fuegos artificiales
 *   2,2 s  un brillo cruza la insignia
 *   2,3 s  mensaje y botón para seguir
 * Con "reducir movimiento" se ve directamente el estado final.
 */

/* ---------- Fondo de galaxia (misma temática espacial del test) ----------
   Nebulosas de color, ~110 estrellas que titilan, estrellas fugaces y un planeta con anillo.
   Las posiciones son fijas (generador con semilla) para que no "salten" entre renders. */
const GALAXY_STARS = (() => {
  let seed = 7
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646
  return Array.from({ length: 110 }, () => ({
    x: rnd() * 100,
    y: rnd() * 100,
    s: rnd() < 0.15 ? 3 : rnd() < 0.5 ? 2 : 1,
    d: 1.5 + rnd() * 3,
    delay: rnd() * 4,
  }))
})()

function GalaxyBackdrop({ animate, rocket = false }: { animate: boolean; rocket?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* nebulosas */}
      <div className="absolute inset-0 bg-[radial-gradient(40%_35%_at_18%_22%,rgb(124_77_255/0.35),transparent_70%),radial-gradient(45%_40%_at_85%_30%,rgb(51_161_184/0.35),transparent_70%),radial-gradient(50%_40%_at_70%_90%,rgb(255_92_168/0.22),transparent_70%),radial-gradient(35%_30%_at_10%_85%,rgb(51_161_184/0.25),transparent_70%)]" />
      {/* estrellas */}
      {GALAXY_STARS.map((st, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${st.x}%`,
            top: `${st.y}%`,
            width: st.s,
            height: st.s,
            opacity: st.s === 3 ? 0.95 : 0.7,
            boxShadow: st.s === 3 ? '0 0 6px 1px rgb(255 255 255 / 0.7)' : undefined,
            animation: animate ? `twinkle ${st.d}s ease-in-out ${st.delay}s infinite` : undefined,
          }}
        />
      ))}
      {/* estrellas fugaces */}
      {animate &&
        [
          { top: '12%', left: '62%', delay: '2.8s' },
          { top: '30%', left: '8%', delay: '6.5s' },
          { top: '6%', left: '28%', delay: '10s' },
        ].map((f, i) => (
          <span
            key={i}
            className="absolute h-[2px] w-[110px] rounded-full bg-[linear-gradient(90deg,#fff,transparent)] opacity-0"
            style={{ top: f.top, left: f.left, animation: `shooting-star 9s ease-out ${f.delay} infinite` }}
          />
        ))}
      {/* planeta con anillo */}
      <div className="absolute -bottom-12 -left-14 size-[110px] md:-bottom-16 md:-left-12 md:size-[230px]">
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_30%,#4fb8cd,#1f7a8c_45%,#0b3a4e_80%)] shadow-[0_0_40px_rgb(51_161_184/0.35)]" />
        <div className="absolute top-1/2 left-1/2 h-[28%] w-[150%] -translate-x-1/2 -translate-y-1/2 -rotate-[18deg] rounded-[50%] border-[5px] border-[#ffd56b]/50 border-t-transparent" />
      </div>
      {/* cohete (solo pantalla final): despega del planeta y aterriza junto a la luna.
          Las posiciones de salida y llegada van en variables CSS para seguir al planeta y a la luna en cada tamaño. */}
      {rocket && (
        <div
          className="absolute z-[5] size-9 [--from-x:64px] [--from-y:calc(100%-44px)] [--land-x:calc(93%-62px)] [--land-y:calc(9%+40px)] md:size-12 md:[--from-x:150px] md:[--from-y:calc(100%-130px)] md:[--land-x:calc(93%-80px)] md:[--land-y:calc(9%+52px)]"
          style={
            animate
              ? { animation: 'rocket-trip 3.6s cubic-bezier(.5,0,.3,1) 1.4s both' }
              : { left: 'var(--land-x)', top: 'var(--land-y)', transform: 'translate(-50%,-50%) scale(.8)' }
          }
        >
          {animate && (
            <span className="absolute -bottom-[38%] -left-[38%] size-[70%] [animation:fade-out_.4s_ease_4.8s_both]">
              <span className="block size-full rounded-full bg-[radial-gradient(circle_at_70%_30%,#fff,#ffd56b_30%,#ffa101_55%,transparent_72%)] [animation:rocket-flame_.12s_ease-in-out_infinite_alternate]" />
            </span>
          )}
          <RocketIcon className="relative size-full text-white drop-shadow-[0_0_10px_rgb(143_216_230/0.8)]" />
          {animate && <span className="absolute inset-0 rounded-full border-2 border-white/70 opacity-0 [animation:land-puff_.8s_ease-out_5s_both]" />}
        </div>
      )}
      {/* luna */}
      <div className="absolute top-[9%] right-[7%] size-12 rounded-full bg-[radial-gradient(circle_at_35%_35%,#fff,#d7e3ea_55%,#9fb3bf)] opacity-90 shadow-[0_0_30px_rgb(255_255_255/0.35)] md:size-16" />
    </div>
  )
}

type Copy = { ribbon: string; title: string; sub: string; cta: string; total: number; ribbonBg: string }
const COPY: Record<IncentiveKind, Copy> = {
  heart: {
    ribbon: 'Personalidad',
    title: '¡Ya conocemos tu personalidad!',
    sub: 'Ahora vamos por lo que te interesa: tu test vocacional',
    cta: 'Empezar test vocacional',
    total: 4,
    ribbonBg: '#1f7a8c',
  },
  star: {
    ribbon: 'Intereses',
    title: '¡Terminaste el bloque 1!',
    sub: 'Ya sabemos qué actividades te atraen · sigue el bloque 2',
    cta: 'Seguir con el bloque 2',
    total: 4,
    ribbonBg: '#a86b00',
  },
  diamond: {
    ribbon: 'Casos prácticos',
    title: '¡Terminaste el bloque 2!',
    sub: 'Ya sabemos cómo decides · falta el último bloque',
    cta: 'Seguir con el bloque 3',
    total: 1,
    ribbonBg: '#a86b00',
  },
  trophy: {
    ribbon: 'Test vocacional',
    title: '¡Terminaste tu test!',
    sub: 'Juntamos tu personalidad y tus intereses: tus resultados están listos',
    cta: 'Ver mis resultados',
    total: 1,
    ribbonBg: '#a86b00',
  },
}

const reducedMotion = () => {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return false
  }
}

/* ---------- Confeti (solo en la pantalla final del test) ----------
   Dos cañones desde las esquinas de abajo (1,4 s y 3,2 s) y luego una lluvia suave desde arriba
   que deja de caer a los ~7 s. Papelitos rectangulares que giran y "voltean" (escala en Y). */
function useConfetti(enabled: boolean) {
  const canvas = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const cv = canvas.current
    const ctx = cv?.getContext('2d')
    if (!cv || !ctx || !enabled) return
    const dpr = window.devicePixelRatio || 1
    const fit = () => {
      cv.width = cv.clientWidth * dpr
      cv.height = cv.clientHeight * dpr
    }
    fit()
    window.addEventListener('resize', fit)
    const colors = ['#33a1b8', '#8fd8e6', '#ffd56b', '#ffa101', '#1ad598', '#ff8fa3', '#b69cff', '#ffffff']
    type C = { x: number; y: number; vx: number; vy: number; r: number; vr: number; flip: number; vf: number; w: number; h: number; c: string; round: boolean }
    let parts: C[] = []
    const piece = (x: number, y: number, vx: number, vy: number): C => ({
      x, y, vx, vy,
      r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3,
      flip: Math.random() * Math.PI, vf: 0.08 + Math.random() * 0.12,
      w: (6 + Math.random() * 6) * dpr, h: (3 + Math.random() * 4) * dpr,
      c: colors[Math.floor(Math.random() * colors.length)], round: Math.random() < 0.2,
    })
    const cannon = (side: 0 | 1) => {
      for (let i = 0; i < 90; i++) {
        const a = (side ? -115 : -65) * (Math.PI / 180) + (Math.random() - 0.5) * 0.7
        const v = (9 + Math.random() * 9) * dpr
        parts.push(piece(side ? cv.width : 0, cv.height, Math.cos(a) * v, Math.sin(a) * v))
      }
    }
    const timers = [
      setTimeout(() => { cannon(0); cannon(1) }, 1400),
      setTimeout(() => { cannon(0); cannon(1) }, 3200),
    ]
    const start = performance.now()
    let raf = 0
    const frame = (now: number) => {
      const t = now - start
      if (t > 1500 && t < 7000 && Math.random() < 0.55) parts.push(piece(Math.random() * cv.width, -10 * dpr, (Math.random() - 0.5) * dpr, (1 + Math.random() * 1.5) * dpr))
      ctx.clearRect(0, 0, cv.width, cv.height)
      parts = parts.filter((p) => p.y < cv.height + 30 * dpr)
      for (const p of parts) {
        p.vy = Math.min(p.vy + 0.18 * dpr, 3.2 * dpr)
        p.vx *= 0.985
        p.x += p.vx + Math.sin(p.flip) * 0.6 * dpr
        p.y += p.vy
        p.r += p.vr
        p.flip += p.vf
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.r)
        ctx.scale(1, Math.cos(p.flip))
        ctx.fillStyle = p.c
        if (p.round) {
          ctx.beginPath()
          ctx.arc(0, 0, p.h, 0, Math.PI * 2)
          ctx.fill()
        } else ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        ctx.restore()
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => {
      timers.forEach(clearTimeout)
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', fit)
    }
  }, [enabled])
  return canvas
}

/* ---------- Fuegos artificiales en canvas ---------- */
function useFireworks(enabled: boolean) {
  const canvas = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const cv = canvas.current
    const ctx = cv?.getContext('2d')
    if (!cv || !ctx || !enabled) return
    const dpr = window.devicePixelRatio || 1
    const fit = () => {
      cv.width = cv.clientWidth * dpr
      cv.height = cv.clientHeight * dpr
    }
    fit()
    window.addEventListener('resize', fit)
    const colors = ['#ffd56b', '#33a1b8', '#8fd8e6', '#ffa101', '#1ad598', '#ffffff']
    type P = { x: number; y: number; vx: number; vy: number; c: string; life: number; s: number }
    let parts: P[] = []
    const boom = (fx: number, fy: number) => {
      const c = colors[Math.floor(Math.random() * colors.length)]
      for (let i = 0; i < 80; i++) {
        const a = (i / 80) * Math.PI * 2
        const v = (2.5 + Math.random() * 4) * dpr
        parts.push({ x: cv.width * fx, y: cv.height * fy, vx: Math.cos(a) * v, vy: Math.sin(a) * v, c, life: 1, s: (1.5 + Math.random()) * dpr })
      }
    }
    const shots: [number, number, number][] = [
      [1500, 0.22, 0.28], [1800, 0.78, 0.24], [2100, 0.5, 0.15], [2500, 0.12, 0.45], [2700, 0.88, 0.42],
      [3100, 0.32, 0.2], [3400, 0.68, 0.3], [4200, 0.2, 0.35], [4500, 0.8, 0.2],
    ]
    const timers = shots.map(([t, x, y]) => setTimeout(() => boom(x, y), t))
    let raf = 0
    const frame = () => {
      ctx.clearRect(0, 0, cv.width, cv.height)
      parts = parts.filter((p) => p.life > 0)
      for (const p of parts) {
        p.vy += 0.05 * dpr
        p.vx *= 0.98
        p.vy *= 0.98
        p.x += p.vx
        p.y += p.vy
        p.life -= 0.012
        ctx.globalAlpha = Math.max(0, p.life)
        ctx.fillStyle = p.c
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => {
      timers.forEach(clearTimeout)
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', fit)
    }
  }, [enabled])
  return canvas
}

export default function Reward({
  kind,
  onDone,
  finalLabel,
}: {
  kind: IncentiveKind
  /** se mantiene por compatibilidad; la insignia muestra el total de la etapa */
  earned?: number
  onDone: () => void
  /** texto del botón; si no se indica, se usa el de cada etapa */
  finalLabel?: string
}) {
  const [quiet] = useState(reducedMotion)
  const canvas = useFireworks(!quiet)
  const isFinal = kind === 'trophy'
  const confetti = useConfetti(!quiet && isFinal)
  const { user } = useApp()
  const firstName = user?.name.trim().split(' ')[0]
  const copy = COPY[kind]
  const doneRef = useRef(onDone)
  useEffect(() => {
    doneRef.current = onDone
  })
  const wrapRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const t = setTimeout(() => wrapRef.current?.querySelector('button')?.focus(), quiet ? 0 : 2400)
    return () => clearTimeout(t)
  }, [quiet])

  const anim = (v: string) => (quiet ? undefined : v)

  return (
    <div
      ref={wrapRef}
      className="fixed inset-0 z-50 overflow-hidden bg-[radial-gradient(120%_90%_at_50%_100%,#0b3550_0%,#071a33_55%,#030b1a_100%)] text-white"
      role="dialog"
      aria-modal="true"
      aria-labelledby="badge-title"
    >
      <GalaxyBackdrop animate={!quiet} rocket={isFinal} />
      <canvas ref={canvas} className="pointer-events-none absolute inset-0 size-full" aria-hidden />
      {isFinal && <canvas ref={confetti} className="pointer-events-none absolute inset-0 z-10 size-full" aria-hidden />}

      {/* los incentivos de la fila bajan y se funden */}
      {!quiet && (
        <div className="absolute top-[8%] left-1/2 flex -translate-x-1/2 gap-3" aria-hidden>
          {Array.from({ length: copy.total }, (_, i) => (
            <span key={i} style={{ animation: `badge-merge .8s cubic-bezier(.6,-0.3,.4,1) ${0.3 + i * 0.1}s both` }}>
              <IncentiveIcon kind={kind} filled className="size-12 md:size-16" />
            </span>
          ))}
        </div>
      )}

      {/* destello y onda */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_36%,#fff,rgb(255_213_107/0.6)_30%,transparent_70%)] opacity-0"
        style={{ animation: anim('badge-flash .7s ease-out 1.25s both') }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-[36%] left-1/2 aspect-square w-[22vmin] rounded-full border-[6px] border-[#ffd56b] opacity-0"
        style={{ animation: anim('badge-wave 1s ease-out 1.3s both') }}
        aria-hidden
      />

      {/* insignia */}
      <div
        className={`absolute left-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 ${isFinal ? 'top-[30%] w-[min(40vmin,260px)]' : 'top-[36%] w-[min(46vmin,300px)]'}`}
        aria-hidden
      >
        <div className="relative size-full" style={{ animation: anim('badge-in .9s cubic-bezier(.2,1.5,.4,1) 1.3s both') }}>
          <div
            className="absolute -inset-[45%] rounded-full bg-[repeating-conic-gradient(from_0deg,rgb(255_190_44/.22)_0_8deg,transparent_8deg_20deg)] [mask:radial-gradient(circle,#000_30%,transparent_70%)]"
            style={{ animation: anim('badge-rays 8s linear 1.3s infinite') }}
          />
          <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_200deg,#ffd56b,#d28800,#ffe9a8,#d28800,#ffd56b)] shadow-[0_0_0_10px_rgb(255_213_107/0.25),0_20px_50px_rgb(0_0_0/0.45)]" />
          <div className="absolute inset-[11%] grid place-items-center overflow-hidden rounded-full bg-[radial-gradient(circle_at_35%_30%,#0f5d77,#002e42)]">
            <IncentiveIcon kind={kind} filled className="size-[52%]" />
            {!quiet && (
              <span className="absolute inset-y-[-30%] left-[-70%] w-[30%] skew-x-[-20deg] bg-[linear-gradient(90deg,transparent,rgb(255_255_255/.6),transparent)] [animation:shine-sweep_1s_ease-in-out_2.2s_both]" />
            )}
          </div>
          <span
            className="absolute -bottom-[12%] left-1/2 -translate-x-1/2 rounded-lg px-5 py-1.5 text-sm font-extrabold tracking-[0.08em] whitespace-nowrap uppercase shadow-[0_8px_20px_rgb(0_0_0/0.3)] md:text-base"
            style={{ background: copy.ribbonBg }}
          >
            {copy.ribbon}
          </span>
        </div>
      </div>

      {/* mensaje y acción */}
      <div className="absolute inset-x-0 bottom-[7%] px-5 text-center" style={{ animation: anim('cap-in .5s ease 2.3s both') }}>
        {isFinal && firstName && (
          <p className="mb-1 text-sm font-bold tracking-[0.12em] text-[#8fd8e6] uppercase md:text-base">¡Felicitaciones, {firstName}!</p>
        )}
        <h2 id="badge-title" className="text-[clamp(1.7rem,4.4vw,3rem)] leading-tight font-extrabold tracking-[-0.02em]">
          {copy.title}
        </h2>
        <p className="mx-auto mt-2 max-w-[560px] text-[clamp(1rem,2vw,1.25rem)] text-white/85">{copy.sub}</p>
        {isFinal && (
          <div className="mx-auto mt-4 inline-flex flex-col items-center gap-1.5 rounded-2xl border border-white/15 bg-white/[0.07] px-4 py-2.5 backdrop-blur-sm">
            <span className="text-[11px] font-bold tracking-[0.1em] text-white/70 uppercase">Tu colección completa</span>
            <span className="flex items-center gap-1 sm:gap-1.5">
              {(['heart', 'heart', 'heart', 'heart', 'star', 'star', 'star', 'star', 'diamond', 'trophy'] as IncentiveKind[]).map((k, i) => (
                <span key={i} className={i === 4 || i >= 8 ? 'ml-1.5 sm:ml-2.5' : undefined} style={{ animation: anim(`pop-in .35s cubic-bezier(.2,1.6,.4,1) ${2.6 + i * 0.08}s both`) }}>
                  <IncentiveIcon kind={k} filled className="size-5 sm:size-6" />
                </span>
              ))}
            </span>
          </div>
        )}
        <div />
        <PrimaryButton onClick={() => doneRef.current()} className="mt-5 w-[320px] max-w-full">
          {finalLabel ?? copy.cta}
        </PrimaryButton>
      </div>
    </div>
  )
}
