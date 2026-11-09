import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AuthShell, AuthSplit, AuthTitle, Field, FormAlert, FormSuccess } from '../components/AuthUi'
import { ArrowLeftIcon } from '../components/icons'
import { PillButton } from '../components/ui'
import { useApp } from '../context/AppContext'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_HINT = 'Mínimo 8 caracteres, con al menos un número.'

const linkClass = 'font-semibold text-action underline underline-offset-4 dark:text-brand'

const readStored = (key: string) => {
  try {
    return sessionStorage.getItem(key) ?? ''
  } catch {
    return ''
  }
}

const emailError = (email: string) =>
  !email.trim()
    ? 'Escribe tu correo electrónico.'
    : EMAIL_RE.test(email.trim())
      ? undefined
      : 'Escribe un correo válido, por ejemplo nombre@correo.com.'

/**
 * Login · Propuesta A ("Espejo del registro").
 * Misma estructura que "Crea tu cuenta": formulario a la izquierda y pingüino a la derecha,
 * un solo título, botón "Entrar" y el enlace para crear cuenta justo debajo.
 */
export function Login() {
  const navigate = useNavigate()
  const { signIn } = useApp()
  const [params] = useSearchParams()
  // Avisos según de dónde viene: cuenta recién creada o contraseña recién cambiada
  const justRegistered = params.get('registrado') === '1'
  const passwordReset = params.get('restablecida') === '1'
  const [email, setEmail] = useState(() => (justRegistered ? readStored('tv-registered-email') : passwordReset ? readStored('tv-reset-email') : ''))
  const [pass, setPass] = useState('')
  const [errors, setErrors] = useState<{ email?: string; pass?: string; form?: string }>({})
  const [sending, setSending] = useState(false)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const next = { email: emailError(email), pass: pass ? undefined : 'Escribe tu contraseña.' }
    setErrors(next)
    if (next.email || next.pass) return
    setSending(true)
    // Simulación de la API: un correo que empieza con "error@" muestra el estado de credenciales incorrectas
    setTimeout(() => {
      setSending(false)
      if (email.trim().toLowerCase().startsWith('error@')) {
        setErrors({ form: 'Correo o contraseña incorrectos. Revisa los datos e inténtalo de nuevo.' })
        return
      }
      const mail = email.trim().toLowerCase()
      const registeredName = readStored('tv-registered-email').toLowerCase() === mail ? readStored('tv-registered-name') : ''
      // Sin back-end solo se conoce el nombre si se registró en este navegador; no se inventa desde el correo
      signIn({ email: mail, name: registeredName })
      navigate('/cargando?next=/intro')
    }, 600)
  }

  return (
    <AuthSplit art="/images/penguinLogin.webp" artText="Tu progreso te espera.">
      <form onSubmit={onSubmit} noValidate className="flex flex-col">
        <Link to="/" aria-label="Volver al inicio" className="w-9 text-fg md:w-10">
          <ArrowLeftIcon className="size-9 md:size-10" />
        </Link>
        <AuthTitle title="¡Hola de nuevo!" subtitle="Entra para seguir con tu test de orientación vocacional." />

        <div className="mt-6 flex flex-col gap-4">
          {justRegistered && !errors.form && <FormSuccess>¡Tu cuenta se creó con éxito! Escribe tu contraseña para empezar el test.</FormSuccess>}
          {passwordReset && !errors.form && <FormSuccess>Tu contraseña se cambió. Entra con la nueva.</FormSuccess>}
          {errors.form && <FormAlert>{errors.form}</FormAlert>}
          <Field
            label="Correo electrónico"
            placeholder="nombre@correo.com"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
          <Field
            label="Contraseña"
            placeholder="Tu contraseña"
            autoFocus={(justRegistered || passwordReset) && Boolean(email)}
            password
            autoComplete="current-password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            error={errors.pass}
          />
        </div>
        <Link
          to={email.trim() ? `/recuperar?correo=${encodeURIComponent(email.trim())}` : '/recuperar'}
          className="mt-2 self-end text-[15px] leading-[23px] text-muted underline-offset-4 hover:text-action hover:underline dark:text-[#b7c4cb]"
        >
          ¿Olvidaste tu contraseña?
        </Link>
        <PillButton type="submit" className="mt-6" disabled={sending}>
          {sending ? 'Verificando…' : 'Entrar'}
        </PillButton>
        <p className="mt-4 text-center text-[15px]">
          ¿No tienes cuenta?{' '}
          <Link to="/registro" className={linkClass}>
            Crea una
          </Link>
        </p>
      </form>
    </AuthSplit>
  )
}

/**
 * Recuperar contraseña · paso 1 y 2: escribir el correo → "Revisa tu correo".
 * El aviso no confirma si el correo existe, para no revelar qué correos están registrados.
 */
export function ForgotPassword() {
  const [params] = useSearchParams()
  const [email, setEmail] = useState(params.get('correo') ?? '')
  const [error, setError] = useState<string>()
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [resent, setResent] = useState(false)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const err = emailError(email)
    setError(err)
    if (err) return
    setSending(true)
    // Simulación de la API que envía el enlace por correo
    setTimeout(() => {
      try {
        sessionStorage.setItem('tv-reset-email', email.trim())
      } catch {
        /* sin almacenamiento */
      }
      setSending(false)
      setSent(true)
    }, 600)
  }

  if (sent) {
    return (
      <AuthSplit art="/images/penguinLogin.webp" artText="Te ayudamos a volver.">
        <div className="flex flex-col">
          <Link to="/login" aria-label="Volver al inicio de sesión" className="w-9 text-fg md:w-10">
            <ArrowLeftIcon className="size-9 md:size-10" />
          </Link>
          <AuthTitle title="Revisa tu correo" />
          <div className="mt-6 flex flex-col gap-4">
            <FormSuccess>
              Si <b>{email.trim()}</b> tiene una cuenta, te llegará un enlace para crear una nueva contraseña en unos minutos. Revisa también la carpeta
              de spam.
            </FormSuccess>
            <button
              type="button"
              onClick={() => setResent(true)}
              disabled={resent}
              className="h-[52px] cursor-pointer rounded-[30px] border-2 border-action font-semibold text-action transition hover:bg-action/10 disabled:cursor-default disabled:opacity-60 dark:border-brand dark:text-brand"
            >
              {resent ? 'Enlace reenviado' : 'Reenviar enlace'}
            </button>
            {/* Solo en el prototipo: simula abrir el enlace que llega por correo */}
            <Link to="/recuperar/nueva" className="rounded-lg border border-dashed border-current/30 px-4 py-3 text-center text-sm text-muted dark:text-[#b7c4cb]">
              Prototipo: abrir el enlace del correo →
            </Link>
          </div>
          <p className="mt-6 text-center text-[15px]">
            <Link to="/login" className={linkClass}>
              Volver a iniciar sesión
            </Link>
          </p>
        </div>
      </AuthSplit>
    )
  }

  return (
    <AuthSplit art="/images/penguinLogin.webp" artText="Te ayudamos a volver.">
      <form onSubmit={onSubmit} noValidate className="flex flex-col">
        <Link to="/login" aria-label="Volver al inicio de sesión" className="w-9 text-fg md:w-10">
          <ArrowLeftIcon className="size-9 md:size-10" />
        </Link>
        <AuthTitle title="¿Olvidaste tu contraseña?" subtitle="Escribe tu correo y te enviamos un enlace para crear una nueva." />
        <div className="mt-6">
          <Field
            label="Correo electrónico"
            placeholder="nombre@correo.com"
            type="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
          />
        </div>
        <PillButton type="submit" className="mt-6" disabled={sending}>
          {sending ? 'Enviando…' : 'Enviar enlace'}
        </PillButton>
        <p className="mt-4 text-center text-[15px]">
          <Link to="/login" className={linkClass}>
            Volver a iniciar sesión
          </Link>
        </p>
      </form>
    </AuthSplit>
  )
}

/** Recuperar contraseña · paso 3: crear la nueva contraseña (se llega desde el enlace del correo) */
export function ResetPassword() {
  const navigate = useNavigate()
  const [pass, setPass] = useState('')
  const [error, setError] = useState<string>()
  const [sending, setSending] = useState(false)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const err = pass.length < 8 || !/\d/.test(pass) ? PASSWORD_HINT : undefined
    setError(err)
    if (err) return
    setSending(true)
    setTimeout(() => navigate('/login?restablecida=1'), 600)
  }

  return (
    <AuthSplit art="/images/penguinLogin.webp" artText="Ya casi estás de vuelta.">
      <form onSubmit={onSubmit} noValidate className="flex flex-col">
        <AuthTitle title="Crea tu nueva contraseña" subtitle="Elige una que no hayas usado antes." />
        <div className="mt-6">
          <Field
            label="Nueva contraseña"
            placeholder="Crea una contraseña"
            password
            autoComplete="new-password"
            autoFocus
            hint={PASSWORD_HINT}
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            error={error}
          />
        </div>
        <PillButton type="submit" className="mt-6" disabled={sending}>
          {sending ? 'Guardando…' : 'Guardar contraseña'}
        </PillButton>
      </form>
    </AuthSplit>
  )
}

/** Figma: frame "Registro exitoso" — avanza solo tras unos segundos */
export function RegisterSuccess() {
  const navigate = useNavigate()
  useEffect(() => {
    const t = setTimeout(() => navigate('/cargando?next=' + encodeURIComponent('/login?registrado=1')), 2400)
    return () => clearTimeout(t)
  }, [navigate])
  return (
    <AuthShell>
      <div className="flex min-h-screen items-center justify-center">
        <img src="/images/penguinSuccess.webp" alt="¡Registro exitoso!" className="w-[473px] max-w-full [animation:pop-in_0.6s_ease_both]" />
        <p className="sr-only" role="status">
          Registro exitoso. Te llevamos al inicio de sesión.
        </p>
      </div>
    </AuthShell>
  )
}
