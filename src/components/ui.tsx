import { useState, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import PauseCard from './PauseCard'
import { ArrowLeftIcon, ArrowRightIcon, ChevronLeftIcon, MoonIcon, SunIcon } from './icons'

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')
export { cx }

/* ---------- Botón principal (Figma: "Button 10") ----------
   Fondo #1f7a8c (action) en lugar de #33a1b8: el blanco pasa de 3,0:1 a 5,0:1 (auditoría #2). */
type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { arrow?: boolean; children: ReactNode }

export function PrimaryButton({ arrow = true, className, children, disabled, ...rest }: BtnProps) {
  return (
    <button
      {...rest}
      disabled={disabled}
      className={cx(
        'inline-flex h-12 items-center justify-center gap-1 rounded-[30px] border px-6 text-base font-bold transition md:h-14 md:px-10',
        disabled
          ? 'cursor-not-allowed border-slate-btn bg-[#38454e] text-[#a3b1b8]'
          : 'cursor-pointer border-action bg-action text-white hover:brightness-110 active:scale-[0.98]',
        className,
      )}
    >
      <span>{children}</span>
      {arrow && <ArrowRightIcon className="size-6" />}
    </button>
  )
}

/* ---------- Botón píldora de formularios (Login / Registro) ---------- */
export function PillButton({ className, children, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={cx(
        'h-[59px] w-full cursor-pointer rounded-[30px] bg-action text-lg font-semibold text-white shadow-brand transition hover:brightness-110 active:scale-[0.99] disabled:cursor-wait disabled:opacity-70',
        className,
      )}
    >
      {children}
    </button>
  )
}

/* ---------- Interruptor de tema sol / luna ---------- */
export function ThemeToggle({ className }: { className?: string }) {
  const { dark, toggleTheme } = useApp()
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      className={cx(className ?? 'relative', 'flex h-[43px] w-[77px] shrink-0 cursor-pointer items-center justify-between rounded-[33px] bg-toggle px-[13px]')}
    >
      <span
        className={cx(
          'absolute top-[3px] size-[37px] rounded-full bg-navy shadow-[0_4px_4px_rgb(0_0_0/0.25)] transition-all duration-300',
          dark ? 'left-[37px]' : 'left-[4px]',
        )}
      />
      <SunIcon className="relative size-[17px] text-[#eef1f6]" />
      <MoonIcon className="relative size-[17px] text-[#eef1f6]" />
    </button>
  )
}

/* ---------- Flecha superior: navegación simple (login, registro) ---------- */
export function BackArrow({ to, onClick, label = 'Volver' }: { to?: string; onClick?: () => void; label?: string }) {
  const navigate = useNavigate()
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick ?? (() => (to ? navigate(to) : navigate(-1)))}
      className="shrink-0 cursor-pointer text-back-arrow transition hover:text-brand"
    >
      <ArrowLeftIcon className="size-9 md:size-11" />
    </button>
  )
}

/* ---------- Flecha superior dentro del test = "Salir": abre la tarjeta de pausa (PauseCard) ----------
   La pregunta anterior se maneja SOLO con el botón circular del pie. */
export function ExitTestButton() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  return (
    <>
      <BackArrow label="Salir del test" onClick={() => setOpen(true)} />
      {open && <PauseCard onStay={() => setOpen(false)} onLeave={() => navigate('/intro')} />}
    </>
  )
}

/* ---------- Botón circular del pie = "Pregunta anterior" ---------- */
export function CircleBackButton({ disabled, onClick }: { disabled?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      aria-label="Pregunta anterior"
      title="Pregunta anterior"
      disabled={disabled}
      onClick={onClick}
      className={cx(
        'flex size-11 shrink-0 items-center justify-center rounded-full transition md:size-[53px]',
        disabled ? 'cursor-not-allowed bg-slate-btn text-slate-icon' : 'cursor-pointer bg-action text-white hover:brightness-110',
      )}
    >
      <ChevronLeftIcon className="size-11 md:size-[53px]" />
    </button>
  )
}

/* ---------- Etiqueta "Bloque x de 3 · ..." ---------- */
export function BlockPill({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cx(
        'inline-flex h-9 items-center truncate whitespace-nowrap rounded-[40px] bg-pill px-3 text-sm font-semibold text-white md:h-[43px] md:px-[13px] md:text-base xl:text-xl',
        className,
      )}
    >
      {children}
    </span>
  )
}

/* ---------- Barra de progreso ---------- */
export function ProgressBar({ current, total, className }: { current: number; total: number; className?: string }) {
  const pct = Math.max(0, Math.min(1, current / total))
  return (
    <div
      className={cx('relative h-4 w-full rounded-lg bg-[#e5e5e5]', className)}
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current}
      aria-label={`Pregunta ${current} de ${total}`}
    >
      <div className="h-4 min-w-[68px] rounded-lg bg-brand transition-[width] duration-500" style={{ width: `${pct * 100}%` }} />
      <span className="absolute inset-0 flex items-center justify-center text-[13px] leading-4 font-semibold text-[#3f3f3f]">
        {current}/{total}
      </span>
    </div>
  )
}

/* ---------- Modal genérico ---------- */
export function Modal({
  children,
  overlay = 'ink',
  className,
  onClose,
}: {
  children: ReactNode
  overlay?: 'ink' | 'white'
  className?: string
  onClose?: () => void
}) {
  return (
    <div
      className={cx(
        'fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 animate-fade-up',
        overlay === 'ink' ? 'bg-ink/90' : 'bg-white dark:bg-navy',
      )}
      role="dialog"
      aria-modal="true"
      onKeyDown={(e) => e.key === 'Escape' && onClose?.()}
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div
        className={cx(
          'my-auto flex w-full flex-col items-center gap-4 rounded-lg border border-[#e0e0e0] bg-white p-6 text-center shadow-[0_4px_16px_rgb(0_0_0/0.25)]',
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}

export function ModalTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-2xl leading-[31px] font-extrabold text-navy">{children}</h2>
}

export function ModalText({ children }: { children: ReactNode }) {
  return <div className="text-base leading-6 text-[#333]">{children}</div>
}

/* ---------- Botón "Saltar" de animaciones ---------- */
export function SkipButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute top-6 right-6 z-10 cursor-pointer rounded-full border border-white/40 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
    >
      Saltar animación
    </button>
  )
}
