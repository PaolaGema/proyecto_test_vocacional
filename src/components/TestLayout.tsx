import type { ReactNode } from 'react'
import { useApp } from '../context/AppContext'
import { IncentiveIcon } from './icons'
import { BLOCK1_QUESTIONS, BLOCK2_CASES, BLOCK3_AREAS, PERSONALITY_ITEMS } from '../data/testData'
import { BlockPill, CircleBackButton, ExitTestButton, ProgressBar, ThemeToggle, cx } from './ui'

/** Total de ítems del test completo (60 + 60 + 15 + 7 = 142) */
export const TOTAL_ITEMS = PERSONALITY_ITEMS.length + BLOCK1_QUESTIONS.length + BLOCK2_CASES.length + BLOCK3_AREAS.length

/* ---------- Progreso global del test (auditoría #3) ---------- */
export function OverallProgress() {
  const { answeredCount } = useApp()
  const pct = Math.round((Math.min(answeredCount, TOTAL_ITEMS) / TOTAL_ITEMS) * 100)
  return (
    <div className="fixed inset-x-0 top-0 z-30" title={`Llevas el ${pct} % del test`}>
      <div className="h-1.5 bg-[#e5e5e5]/60 dark:bg-white/10">
        <div className="h-full bg-brand transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
      <span className="sr-only">Llevas el {pct} % del test completo</span>
    </div>
  )
}

/* ---------- Incentivos ganados ---------- */
const ICON = 'size-6 md:size-7 xl:size-8'

export function Hearts({ className }: { className?: string }) {
  const { rewards } = useApp()
  return (
    <div className={cx('flex gap-1', className)} aria-label={`${rewards.hearts} de 4 corazones`}>
      {[0, 1, 2, 3].map((i) => (
        <span key={i} data-reward-slot={`heart-${i}`} className="inline-flex">
          <IncentiveIcon kind="heart" filled={i < rewards.hearts} className={ICON} />
        </span>
      ))}
    </div>
  )
}

export function Stars({ label, className }: { label?: string; className?: string }) {
  const { rewards } = useApp()
  return (
    <div className={cx('flex flex-col items-center gap-1', className)}>
      <div className="flex gap-1" aria-label={`${rewards.stars} de 4 estrellas`}>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} data-reward-slot={`star-${i}`} className="inline-flex">
            <IncentiveIcon kind="star" filled={i < rewards.stars} className={ICON} />
          </span>
        ))}
      </div>
      {label && <span className="text-center text-xs font-medium whitespace-nowrap text-section-label md:text-sm">{label}</span>}
    </div>
  )
}

export function AllIncentives({ sectionLabel }: { sectionLabel?: string }) {
  const { rewards } = useApp()
  return (
    <div className="flex flex-wrap items-start gap-2 md:gap-[10px]">
      <Hearts />
      <Stars label={sectionLabel} />
      <span data-reward-slot="diamond-0" className="inline-flex">
        <IncentiveIcon kind="diamond" filled={rewards.diamond} className={ICON} />
      </span>
      <span data-reward-slot="trophy-0" className="inline-flex">
        <IncentiveIcon kind="trophy" filled={rewards.trophy} className={ICON} />
      </span>
    </div>
  )
}

/* ---------- Encabezado de pregunta (responsivo) ----------
   Móvil/tablet: salir + etiqueta + tema en una fila; incentivos debajo.
   Escritorio (xl): todo en una fila como en el diseño. */
export function TestHeader({
  pill,
  incentives,
  progress,
  progressAside,
  pillClassName,
}: {
  pill: ReactNode
  incentives?: ReactNode
  progress?: { current: number; total: number }
  progressAside?: ReactNode
  pillClassName?: string
}) {
  return (
    <header className="mx-auto w-full max-w-[1352px] px-4 pt-4 md:px-8 md:pt-6 2xl:px-0">
      <div className="flex items-center gap-3 md:gap-6 xl:gap-[40px]">
        <ExitTestButton />
        <BlockPill className={cx('min-w-0', pillClassName)}>
          {typeof pill === 'string' && pill.includes(' · ') ? (
            <>
              {pill.split(' · ')[0]}
              <span className="hidden sm:inline">&nbsp;· {pill.split(' · ')[1]}</span>
            </>
          ) : (
            pill
          )}
        </BlockPill>
        {incentives && <div className="hidden xl:block">{incentives}</div>}
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>
      {incentives && <div className="mt-3 flex justify-center xl:hidden">{incentives}</div>}
      {progress && (
        <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:gap-5 md:mt-6">
          <div className="flex w-full flex-1 justify-center lg:px-10">
            <ProgressBar current={progress.current} total={progress.total} className="max-w-[1042px]" />
          </div>
          {progressAside && <div className="shrink-0">{progressAside}</div>}
        </div>
      )}
    </header>
  )
}

/* ---------- Estructura de pantalla de test: zona principal + pie ----------
   El pie queda fijo abajo (sticky) para que "Anterior" y "Continuar" estén siempre a mano. */
export function TestLayout({
  children,
  onPrev,
  prevDisabled,
  footerRight,
}: {
  children: ReactNode
  onPrev?: () => void
  prevDisabled?: boolean
  footerRight?: ReactNode
}) {
  return (
    <div className="flex min-h-svh flex-col bg-surface text-fg">
      <OverallProgress />
      <main className="flex-1 pb-8">{children}</main>
      <footer className="sticky bottom-0 z-20 flex shrink-0 items-center justify-between gap-4 bg-footer px-4 py-3 md:px-8 md:py-5">
        <CircleBackButton disabled={prevDisabled} onClick={onPrev} />
        {footerRight}
      </footer>
    </div>
  )
}
