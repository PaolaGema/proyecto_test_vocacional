import { useEffect, useRef } from 'react'
import { useApp, type BlockKey } from '../context/AppContext'
import { IncentiveIcon, type IncentiveKind } from './icons'

/*
 * Ventana "¿Te tomas un descanso?" · Propuesta A.
 * El pingüino se asoma arriba, un anillo muestra el avance de la etapa y cuánto falta
 * para el próximo incentivo, y un aviso verde confirma que todo está guardado.
 * "Seguir respondiendo" es la acción principal; salir queda como enlace.
 */

type BlockInfo = { sections: number; size: number; icon: IncentiveKind; prize: string; unit: string }
const BLOCKS: Record<BlockKey, BlockInfo> = {
  personality: { sections: 4, size: 15, icon: 'heart', prize: 'tu próximo corazón', unit: 'preguntas' },
  block1: { sections: 4, size: 15, icon: 'star', prize: 'tu próxima estrella', unit: 'preguntas' },
  block2: { sections: 1, size: 15, icon: 'diamond', prize: 'el diamante', unit: 'casos' },
  block3: { sections: 1, size: 7, icon: 'trophy', prize: 'el trofeo', unit: 'áreas' },
}
const ROUTE_BLOCK: Record<string, BlockKey> = {
  '/test/personalidad': 'personality',
  '/test/bloque-1': 'block1',
  '/test/bloque-2': 'block2',
  '/test/bloque-3': 'block3',
}

export default function PauseCard({ onStay, onLeave }: { onStay: () => void; onLeave: () => void }) {
  const { lastRoute, progress, rewards } = useApp()
  const stayRef = useRef<HTMLButtonElement>(null)
  useEffect(() => stayRef.current?.focus(), [])

  const block = ROUTE_BLOCK[lastRoute ?? ''] ?? 'personality'
  const info = BLOCKS[block]
  const p = progress[block] ?? { section: 0, index: 0 }
  const done = p.section * info.size + p.index
  const pct = Math.round((done / (info.sections * info.size)) * 100)
  const left = info.size - p.index
  const earned =
    block === 'personality' ? rewards.hearts : block === 'block1' ? rewards.stars : block === 'block2' ? Number(rewards.diamond) : Number(rewards.trophy)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-navy/60 p-4 backdrop-blur-[2px] animate-fade-up"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pause-title"
      onKeyDown={(e) => e.key === 'Escape' && onStay()}
      onClick={(e) => e.target === e.currentTarget && onStay()}
    >
      <div className="relative mt-16 w-full max-w-[460px] rounded-[28px] bg-white px-6 pt-[72px] pb-6 text-center text-navy shadow-[0_24px_60px_rgb(0_0_0/0.3)] md:px-8">
        <img
          src="/images/penguinCoach.webp"
          alt=""
          className="absolute -top-[70px] left-1/2 h-[124px] w-auto -translate-x-1/2 [animation:peng-up_.5s_cubic-bezier(.2,1.5,.4,1)_.1s_both]"
        />
        <h2 id="pause-title" className="text-2xl leading-tight font-extrabold">
          ¿Te tomas un descanso?
        </h2>
        <p className="mt-1.5 text-[15px] text-muted">No pierdes nada: al volver sigues en la misma pregunta.</p>

        <div className="mt-5 flex items-center gap-4 rounded-2xl bg-[#f2f9fb] px-4 py-3 text-left">
          <span className="relative size-14 shrink-0">
            <svg viewBox="0 0 36 36" className="size-full -rotate-90" aria-hidden>
              <circle cx="18" cy="18" r="15" fill="none" stroke="#e3ecef" strokeWidth="3.5" />
              <circle cx="18" cy="18" r="15" fill="none" stroke="#33a1b8" strokeWidth="3.5" strokeLinecap="round" pathLength={100} strokeDasharray={`${pct} 100`} />
            </svg>
            <b className="absolute inset-0 flex items-center justify-center text-sm font-extrabold">{pct}%</b>
          </span>
          <span className="min-w-0 flex-1">
            <b className="block text-[15px]">
              {info.sections > 1 ? `Sección ${p.section + 1} de ${info.sections} · ` : ''}
              {info.unit === 'preguntas' ? 'pregunta' : info.unit === 'casos' ? 'caso' : 'área'} {p.index + 1}
            </b>
            <span className="block text-[13px] text-muted">
              Te {left === 1 ? 'falta 1' : `faltan ${left}`} para {info.prize}
            </span>
          </span>
          {info.sections > 1 && (
            <span className="hidden shrink-0 gap-0.5 sm:flex" aria-label={`${earned} de ${info.sections} ganados`}>
              {Array.from({ length: info.sections }, (_, i) => (
                <IncentiveIcon key={i} kind={info.icon} filled={i < earned} className="size-5" />
              ))}
            </span>
          )}
        </div>

        <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#e3f5ee] px-3 py-1 text-[13px] font-semibold text-[#0b5e43]">
          ✓ Tu avance está guardado
        </span>

        <button
          ref={stayRef}
          type="button"
          onClick={onStay}
          className="mt-5 h-14 w-full cursor-pointer rounded-full bg-action text-base font-bold text-white transition hover:brightness-110"
        >
          Seguir respondiendo
        </button>
        <button type="button" onClick={onLeave} className="mt-3 cursor-pointer text-[15px] font-semibold text-muted underline underline-offset-4 hover:text-navy">
          Salir y continuar después
        </button>
      </div>
    </div>
  )
}
