import { useId, useMemo, useRef, useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthSplit, AuthTitle, Field, FormAlert } from '../components/AuthUi'
import { ArrowLeftIcon, ChevronDownIcon } from '../components/icons'
import { PillButton, cx } from '../components/ui'
import { GRADES, SCHOOLS, normalize } from '../data/registroData'

/*
 * Registro · Propuesta A ("Ordenado: una pantalla, dos columnas").
 * - 6 campos en dos columnas: entra completo en una laptop de 1280 × 720.
 * - Sin "Nombre de usuario" (se inicia sesión con el correo) ni "Confirmar contraseña".
 * - Grado en lista cerrada y colegio con buscador, para que los datos lleguen limpios.
 * - Casilla obligatoria de términos, privacidad y autorización del tutor.
 * - Al crear la cuenta entra directo al test.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_HINT = 'Mínimo 8 caracteres, con al menos un número.'

const fieldBox =
  'h-[52px] w-full rounded-lg bg-[#b0b0b0]/20 text-base text-ink outline-none focus:ring-2 dark:text-white'

type School = { id: string | null; name: string }

type Form = {
  name: string
  email: string
  grade: string
  school: School | null
  password: string
  phone: string
  terms: boolean
}

type Errors = Partial<Record<keyof Form, string>>

function validate(f: Form): Errors {
  const e: Errors = {}
  if (!f.name.trim()) e.name = 'Escribe tu nombre completo.'
  if (!EMAIL_RE.test(f.email.trim())) e.email = 'Escribe un correo válido, por ejemplo nombre@correo.com.'
  if (!f.grade) e.grade = 'Elige tu grado.'
  if (!f.school?.name.trim()) e.school = 'Busca y elige tu unidad educativa.'
  if (f.password.length < 8 || !/\d/.test(f.password)) e.password = PASSWORD_HINT
  if (f.phone && !/^[\d\s+()-]{7,}$/.test(f.phone)) e.phone = 'Escribe solo números (mínimo 7).'
  if (!f.terms) e.terms = 'Para crear tu cuenta debes aceptar los términos y la política de privacidad.'
  return e
}

/* ---------- Lista desplegable con el mismo estilo que los campos ---------- */
function SelectField({
  label,
  value,
  options,
  placeholder,
  error,
  onChange,
  onBlur,
}: {
  label: string
  value: string
  options: string[]
  placeholder: string
  error?: string
  onChange: (v: string) => void
  onBlur: () => void
}) {
  const id = useId()
  return (
    <div className="w-full">
      <label htmlFor={id} className="mb-1 block text-[15px] font-medium">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-err` : undefined}
          className={cx(
            fieldBox,
            'cursor-pointer appearance-none pr-10 pl-5',
            !value && 'text-ink/70 dark:text-white/70',
            error ? 'ring-2 ring-red-600' : 'focus:ring-brand',
          )}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o} value={o} className="text-ink">
              {o}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-4 h-[7px] w-3 -translate-y-1/2 text-ink/70 dark:text-white/70" />
      </div>
      {error && (
        <p id={`${id}-err`} className="mt-1 text-sm font-medium text-red-600 dark:text-red-300">
          {error}
        </p>
      )}
    </div>
  )
}

/* ---------- Buscador de unidad educativa (combobox accesible) ---------- */
function SchoolSearch({
  value,
  error,
  onChange,
  onBlur,
}: {
  value: School | null
  error?: string
  onChange: (v: School | null) => void
  onBlur: () => void
}) {
  const id = useId()
  const listId = `${id}-list`
  const [query, setQuery] = useState(value?.name ?? '')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const results = useMemo(() => {
    const q = normalize(query.trim())
    if (!q) return SCHOOLS.slice(0, 6)
    return SCHOOLS.filter((s) => normalize(`${s.name} ${s.city}`).includes(q)).slice(0, 6)
  }, [query])

  // Si no está en la lista, se puede usar lo escrito (el back-end lo revisa después)
  const typed = query.trim()
  const exact = results.some((s) => normalize(s.name) === normalize(typed))
  const options: School[] = [
    ...results.map((s) => ({ id: s.id, name: s.name })),
    ...(typed.length >= 3 && !exact ? [{ id: null, name: typed }] : []),
  ]

  const choose = (s: School) => {
    onChange(s)
    setQuery(s.name)
    setOpen(false)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setActive((a) => Math.min(a + 1, options.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter' && open && options[active]) {
      e.preventDefault()
      choose(options[active])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className="relative w-full">
      <label htmlFor={id} className="mb-1 block text-[15px] font-medium">
        Unidad Educativa
      </label>
      <div className="relative">
        <svg viewBox="0 0 20 20" className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink/60 dark:text-white/60" aria-hidden>
          <circle cx="8.5" cy="8.5" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="m13 13 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open && options[active] ? `${listId}-${active}` : undefined}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-err` : `${id}-hint`}
          autoComplete="off"
          placeholder="Busca tu colegio"
          value={query}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setQuery(e.target.value)
            setActive(0)
            setOpen(true)
            onChange(null)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          onBlur={() => {
            closeTimer.current = setTimeout(() => setOpen(false), 120)
            onBlur()
          }}
          className={cx(
            fieldBox,
            'pr-4 pl-11 placeholder:text-ink/70 dark:placeholder:text-white/70',
            error ? 'ring-2 ring-red-600' : 'focus:ring-brand',
          )}
        />
      </div>
      {open && options.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Unidades educativas"
          className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-[#e0e0e0] bg-white py-1 text-ink shadow-[0_8px_24px_rgb(0_0_0/0.15)]"
          onMouseDown={() => clearTimeout(closeTimer.current)}
        >
          {options.map((s, i) => (
            <li
              key={`${s.id ?? 'otro'}-${s.name}`}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseEnter={() => setActive(i)}
              onClick={() => choose(s)}
              className={cx('cursor-pointer px-4 py-2.5 text-[15px]', i === active && 'bg-blue-soft')}
            >
              {s.id ? (
                <>
                  <span className="font-medium">{s.name}</span>
                  <span className="text-muted"> · {SCHOOLS.find((x) => x.id === s.id)?.city}</span>
                </>
              ) : (
                <span>
                  No está en la lista: usar <b>“{s.name}”</b>
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
      {error ? (
        <p id={`${id}-err`} className="mt-1 text-sm font-medium text-red-600 dark:text-red-300">
          {error}
        </p>
      ) : (
        <p id={`${id}-hint`} className="sr-only">
          Escribe para buscar. Usa las flechas para elegir y Enter para confirmar.
        </p>
      )}
    </div>
  )
}

/** Figma: frame "Registrarse" — rediseñado según la propuesta A */
export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState<Form>({ name: '', email: '', grade: '', school: null, password: '', phone: '', terms: false })
  const [touched, setTouched] = useState<Partial<Record<keyof Form, boolean>>>({})
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)

  const errors = validate(form)
  const errorCount = Object.keys(errors).length
  const show = (k: keyof Form) => (submitted || touched[k] ? errors[k] : undefined)
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }))
  const touch = (k: keyof Form) => () => setTouched((t) => ({ ...t, [k]: true }))
  const text = (k: 'name' | 'email' | 'password' | 'phone') => ({
    value: form[k],
    onChange: (e: ChangeEvent<HTMLInputElement>) => set(k, e.target.value),
    onBlur: touch(k),
    error: show(k),
  })

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    if (errorCount > 0) return
    setSending(true)
    // Simulación de la API de registro; al terminar entra directo (sin volver al login)
    // Se recuerda el correo para dejarlo escrito en el login
    try {
      sessionStorage.setItem('tv-registered-email', form.email.trim())
      sessionStorage.setItem('tv-registered-name', form.name.trim())
    } catch {
      /* sin almacenamiento: el login queda vacío */
    }
    setTimeout(() => navigate('/cargando?next=/registro-exitoso'), 500)
  }

  return (
    <AuthSplit art="/images/penguinRegister.webp" artText="¡Únete y descubre tu camino!" formClassName="max-w-[640px]">
        <form onSubmit={onSubmit} noValidate className="flex flex-col">
          <Link to="/login" aria-label="Volver al inicio de sesión" className="w-9 text-fg md:w-10">
            <ArrowLeftIcon className="size-9 md:size-10" />
          </Link>
          <AuthTitle title="Crea tu cuenta" subtitle="Toma menos de un minuto. Todos los campos son obligatorios salvo el celular." />

          <div className="mt-5 grid gap-x-5 gap-y-3.5 sm:grid-cols-2">
            {submitted && errorCount > 0 && (
              <div className="sm:col-span-2">
                <FormAlert>Revisa {errorCount === 1 ? '1 campo marcado' : `${errorCount} campos marcados`} en rojo.</FormAlert>
              </div>
            )}
            <Field label="Nombre completo" placeholder="Ej. Juan Pérez Gómez" autoComplete="name" {...text('name')} />
            <Field label="Correo electrónico" placeholder="nombre@correo.com" type="email" autoComplete="email" {...text('email')} />
            <SelectField
              label="Grado"
              placeholder="Elige tu grado"
              options={GRADES}
              value={form.grade}
              onChange={(v) => set('grade', v)}
              onBlur={touch('grade')}
              error={show('grade')}
            />
            <SchoolSearch value={form.school} onChange={(v) => set('school', v)} onBlur={touch('school')} error={show('school')} />
            <Field
              label="Contraseña"
              placeholder="Crea una contraseña"
              password
              autoComplete="new-password"
              hint={PASSWORD_HINT}
              {...text('password')}
            />
            <Field label="Celular (opcional)" placeholder="Ej. 71234567" type="tel" autoComplete="tel" {...text('phone')} />
          </div>

          {/* Consentimiento: los usuarios son estudiantes de secundaria, muchos menores de edad */}
          <div className="mt-5">
            <label className="flex cursor-pointer items-start gap-3 text-[15px] leading-snug">
              <input
                type="checkbox"
                checked={form.terms}
                onChange={(e) => set('terms', e.target.checked)}
                aria-invalid={Boolean(show('terms'))}
                aria-describedby="terms-err"
                className="mt-0.5 size-5 shrink-0 cursor-pointer accent-[#1f7a8c]"
              />
              <span>
                Acepto los{' '}
                <a href="#" className="font-semibold text-action underline underline-offset-2 dark:text-brand">
                  términos y condiciones
                </a>{' '}
                y la{' '}
                <a href="#" className="font-semibold text-action underline underline-offset-2 dark:text-brand">
                  política de privacidad
                </a>
                . Si soy menor de edad, cuento con la autorización de mi madre, padre o tutor.
              </span>
            </label>
            {show('terms') && (
              <p id="terms-err" className="mt-1 pl-8 text-sm font-medium text-red-600 dark:text-red-300">
                {show('terms')}
              </p>
            )}
          </div>

          <PillButton type="submit" className="mt-5" disabled={sending}>
            {sending ? 'Creando tu cuenta…' : 'Crear cuenta'}
          </PillButton>
          <p className="mt-3 text-center text-[15px]">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-semibold text-action underline underline-offset-4 dark:text-brand">
              Inicia sesión
            </Link>
          </p>
        </form>
    </AuthSplit>
  )
}
