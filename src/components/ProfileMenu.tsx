import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { ChevronDownIcon } from './icons'
import { cx } from './ui'

/*
 * Menú de perfil · Propuesta A.
 * Cerrado: avatar + primer nombre. Abierto: nombre completo, correo, avance y "Cerrar sesión".
 * Computadora: menú desplegable. Celular: hoja que sube desde abajo.
 * Se cierra con Escape o tocando fuera; las flechas recorren las opciones.
 */

const PersonIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className} aria-hidden>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </svg>
)
const LogoutIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l5-5-5-5M15 12H4" />
  </svg>
)
/** Avatar con degradado de marca: inicial si hay nombre, ícono de persona si no */
export function Avatar({ name, size = 'md' }: { name: string; size?: 'md' | 'lg' }) {
  const initial = name.trim().charAt(0).toUpperCase()
  return (
    <span
      aria-hidden
      className={cx(
        'flex shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#33a1b8,#1f7a8c)] font-bold text-white',
        size === 'md' ? 'size-9 text-sm' : 'size-11 text-base',
      )}
    >
      {initial || <PersonIcon className="size-1/2" />}
    </span>
  )
}

export default function ProfileMenu({
  name,
  email,
  progress,
  onLogout,
}: {
  name: string
  email: string
  /** porcentaje del test; si es null no se muestra la barra */
  progress: number | null
  onLogout: () => void
}) {
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const wrapRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const itemsRef = useRef<HTMLElement[]>([])
  const firstName = name.trim().split(/\s+/)[0] ?? ''

  // Cerrar al tocar fuera
  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])

  // Al abrir, el foco va a la primera opción
  useEffect(() => {
    if (open) itemsRef.current[0]?.focus()
  }, [open])

  const close = () => {
    setOpen(false)
    buttonRef.current?.focus()
  }

  const onMenuKey = (e: KeyboardEvent) => {
    const items = itemsRef.current.filter(Boolean)
    const i = items.indexOf(document.activeElement as HTMLElement)
    if (e.key === 'Escape') {
      e.preventDefault()
      close()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      items[(i + 1) % items.length]?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      items[(i - 1 + items.length) % items.length]?.focus()
    } else if (e.key === 'Tab') {
      setOpen(false)
    }
  }

  const itemClass =
    'flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-left text-[15px] font-medium outline-none transition hover:bg-[#f2f9fb] focus-visible:bg-[#f2f9fb] focus-visible:outline-2 focus-visible:outline-brand sm:py-2.5'

  return (
    <div ref={wrapRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`Tu cuenta${name ? `: ${name}` : ''}`}
        onClick={() => setOpen((o) => !o)}
        className={cx(
          'flex cursor-pointer items-center gap-2 rounded-full border border-black/10 py-1 pr-2 pl-1 transition hover:bg-black/5 sm:pr-3 dark:border-white/15 dark:hover:bg-white/10',
          open && 'bg-black/5 dark:bg-white/10',
        )}
      >
        <Avatar name={name} />
        {firstName && <span className="hidden max-w-[120px] truncate text-[15px] font-semibold sm:block">{firstName}</span>}
        <ChevronDownIcon className={cx('h-[6px] w-[11px] opacity-60 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <>
          {/* Celular: fondo oscuro detrás de la hoja */}
          <div className="fixed inset-0 z-40 bg-navy/40 sm:hidden" aria-hidden onClick={() => setOpen(false)} />
          <div
            id={menuId}
            role="menu"
            aria-label="Tu cuenta"
            onKeyDown={onMenuKey}
            className={cx(
              'z-50 bg-white text-navy shadow-[0_16px_40px_rgb(0_46_66/0.2)] animate-fade-up',
              // celular: hoja desde abajo
              'fixed inset-x-0 bottom-0 rounded-t-3xl px-4 pt-3 pb-[max(20px,env(safe-area-inset-bottom))]',
              // computadora: desplegable bajo el botón
              'sm:absolute sm:inset-x-auto sm:top-[calc(100%+8px)] sm:right-0 sm:bottom-auto sm:w-[300px] sm:rounded-2xl sm:border sm:border-black/8 sm:p-2',
            )}
          >
            <div className="mx-auto mb-2 h-1.5 w-10 rounded-full bg-[#d9e3e7] sm:hidden" aria-hidden />
            <div className="flex items-center gap-3 border-b border-black/8 px-3 pt-2 pb-3">
              <Avatar name={name} size="lg" />
              <span className="min-w-0">
                <span className="block truncate font-semibold">{name || 'Tu cuenta'}</span>
                <span className="block truncate text-[13px] text-muted">{email}</span>
              </span>
            </div>
            {progress !== null && (
              <div className="px-3 pt-3 pb-1">
                <span className="text-[13px] text-muted">Llevas el {progress} % del test</span>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#e5e5e5]">
                  <div className="h-full rounded-full bg-brand" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}
            <div className="mt-1 flex flex-col">
              <button
                ref={(el) => {
                  if (el) itemsRef.current[0] = el
                }}
                role="menuitem"
                type="button"
                onClick={() => {
                  setOpen(false)
                  onLogout()
                }}
                className={cx(itemClass, 'text-[#b42318] hover:bg-[#fde8e6] focus-visible:bg-[#fde8e6]')}
              >
                <LogoutIcon className="size-5" />
                Cerrar sesión
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
