import { useId, useState, type InputHTMLAttributes, type ReactNode } from 'react'
import Logo from './Logo'
import { EyeIcon, EyeOffIcon } from './icons'
import { ThemeToggle, cx } from './ui'

/* ---------- Campo con etiqueta visible y error en línea (auditoría #10) ---------- */
export function Field({
  label,
  password,
  error,
  hint,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; password?: boolean; error?: string; hint?: string }) {
  const [show, setShow] = useState(false)
  const id = useId()
  const describedBy = error ? `${id}-err` : hint ? `${id}-hint` : undefined
  return (
    <div className="w-full">
      <label htmlFor={id} className="mb-1 block text-[15px] font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          {...props}
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          type={password ? (show ? 'text' : 'password') : (props.type ?? 'text')}
          className={cx(
            'h-[52px] w-full rounded-lg bg-[#b0b0b0]/20 pr-12 pl-5 text-base text-ink outline-none placeholder:text-ink/70 focus:ring-2 dark:text-white dark:placeholder:text-white/70',
            error ? 'ring-2 ring-red-600 focus:ring-red-600' : 'focus:ring-brand',
          )}
        />
        {password && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            className="absolute top-1/2 right-[24px] -translate-y-1/2 cursor-pointer p-1 text-ink/70 dark:text-white/70"
          >
            {show ? <EyeIcon className="size-[17px]" /> : <EyeOffIcon className="size-[17px]" />}
          </button>
        )}
      </div>
      {error ? (
        <p id={`${id}-err`} className="mt-1.5 text-sm font-medium text-red-600 dark:text-red-300">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-muted dark:text-[#9ca3af]">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

/* ---------- Mensaje de error general del formulario (auditoría #11) ---------- */
export function FormAlert({ children }: { children: ReactNode }) {
  return (
    <div role="alert" className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
      {children}
    </div>
  )
}

export function AuthShell({ children, hideLogo = false }: { children: ReactNode; hideLogo?: boolean }) {
  return (
    <div className="relative min-h-screen bg-surface text-fg">
      <div className="relative mx-auto min-h-svh max-w-[1440px] px-5 pb-10 md:px-10 lg:px-0">
        {!hideLogo && (
          <Logo className="absolute top-[clamp(32px,8vh,111px)] right-[clamp(40px,13vw,196px)] hidden w-[140px] lg:block xl:w-[163px]" />
        )}
        <ThemeToggle className={cx('absolute top-6 right-6', hideLogo && 'lg:hidden')} />
        {children}
      </div>
    </div>
  )
}

/* ---------- Estructura común de login, registro y recuperación ----------
   Formulario a la izquierda y, a la derecha, un panel de marca que ocupa todo el espacio libre
   (logo + pingüino + mensaje). Así no queda un hueco cuando el formulario es angosto (login)
   y las tres pantallas se ven como una misma familia. */
export function AuthSplit({
  children,
  art,
  artText,
  formClassName,
}: {
  children: ReactNode
  art: string
  artText: string
  formClassName?: string
}) {
  return (
    <AuthShell hideLogo>
      <div className="flex flex-col gap-10 pt-20 lg:flex-row lg:items-stretch lg:gap-[clamp(40px,5vw,80px)] lg:py-[clamp(20px,4vh,40px)] lg:pr-[clamp(20px,2.5vw,40px)] lg:pl-[clamp(40px,8vw,140px)]">
        <div className={cx('flex w-full shrink-0 flex-col lg:pt-[clamp(8px,2vh,40px)]', formClassName ?? 'max-w-[420px]')}>{children}</div>
        <aside
          className="relative hidden min-h-[calc(100svh_-_2*clamp(20px,4vh,40px))] flex-1 flex-col items-center justify-center gap-5 rounded-[32px] bg-[#e8f3f6] px-8 py-12 text-center text-navy lg:flex dark:bg-white/5 dark:text-white"
        >
          <Logo className="absolute top-[clamp(24px,5vh,44px)] left-1/2 w-[clamp(120px,10vw,150px)] -translate-x-1/2" />
          <ThemeToggle className="absolute top-5 right-5" />
          <img src={art} alt="" className="h-[clamp(220px,44vh,400px)] w-auto max-w-[90%] object-contain" />
          <p className="max-w-[320px] text-[clamp(1.1rem,1.6vw,1.4rem)] leading-snug font-semibold">{artText}</p>
        </aside>
      </div>
    </AuthShell>
  )
}

/** Título y subtítulo de las pantallas de acceso */
export function AuthTitle({ title, subtitle }: { title: string; subtitle?: ReactNode }) {
  return (
    <>
      <h1 className="mt-3 text-[clamp(1.6rem,2.4vw,2.1rem)] leading-tight font-semibold">{title}</h1>
      {subtitle && <p className="mt-1 text-base text-muted dark:text-[#b7c4cb]">{subtitle}</p>}
    </>
  )
}

/** Aviso verde de éxito */
export function FormSuccess({ children }: { children: ReactNode }) {
  return (
    <div role="status" className="rounded-lg border border-[#9fdcc4] bg-[#e3f5ee] px-4 py-3 text-sm font-medium text-[#0b5e43]">
      {children}
    </div>
  )
}
