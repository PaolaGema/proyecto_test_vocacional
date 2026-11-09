import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

/**
 * Estado global del prototipo:
 *  - tema claro/oscuro (interruptor sol/luna del diseño)
 *  - incentivos ganados (corazones, estrellas, diamante, trofeo)
 *  - respuestas del usuario (listas para enviar al back-end)
 *  - progreso por bloque, para "salir y continuar después" (auditoría #1)
 *
 * Todo se guarda en localStorage. El back-end debería reemplazarlo por un
 * guardado por pregunta asociado a la cuenta del estudiante.
 */

export type Rewards = { hearts: number; stars: number; diamond: boolean; trophy: boolean }

export type Answers = {
  personality: Record<number, number> // índice pregunta → 0..4 (escala Likert)
  block1: Record<number, 'A' | 'B'>
  block2: Record<number, string[]> // índice caso → orden de letras (1 = más importante)
  block3: Record<string, Record<number, number>> // área → índice actividad → número asignado
}

export type BlockKey = 'personality' | 'block1' | 'block2' | 'block3'
export type BlockProgress = { section: number; index: number }

/** Estudiante con sesión iniciada (en producción vendrá del back-end) */
export type User = { name: string; email: string }

type Saved = {
  rewards: Rewards
  answers: Answers
  progress: Partial<Record<BlockKey, BlockProgress>>
  lastRoute: string | null
}

type AppState = Saved & {
  dark: boolean
  toggleTheme: () => void
  setRewards: (fn: (r: Rewards) => Rewards) => void
  saveAnswer: <K extends keyof Answers>(block: K, key: keyof Answers[K], value: Answers[K][keyof Answers[K]]) => void
  saveProgress: (block: BlockKey, p: BlockProgress) => void
  setLastRoute: (route: string | null) => void
  /** cantidad de respuestas dadas en todo el test */
  answeredCount: number
  reset: () => void
  user: User | null
  signIn: (user: User) => void
  /** cierra la sesión; el avance queda guardado para cuando vuelva a entrar */
  signOut: () => void
}

const EMPTY: Saved = {
  rewards: { hearts: 0, stars: 0, diamond: false, trophy: false },
  answers: { personality: {}, block1: {}, block2: {}, block3: {} },
  progress: {},
  lastRoute: null,
}

const STORE_KEY = 'tv-progress-v1'

const read = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback
  } catch {
    return fallback
  }
}
const write = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value))
  } catch {
    /* almacenamiento no disponible: el prototipo sigue funcionando sin guardar */
  }
}

const Ctx = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem('tv-theme') === 'dark'
    } catch {
      return false
    }
  })
  const [saved, setSaved] = useState<Saved>(() => read(STORE_KEY, EMPTY))
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem('tv-user')
      if (!raw) return null
      const u = JSON.parse(raw) as User
      // Versiones anteriores inventaban el nombre desde el correo ("gema.jancopaola@…" → "Gema Jancopaola"): se descarta
      const fromEmail = u.email.split('@')[0].replace(/[^a-z0-9]/gi, '').toLowerCase()
      const plainName = u.name.replace(/[^a-z0-9]/gi, '').toLowerCase()
      return plainName && plainName === fromEmail ? { ...u, name: '' } : u
    } catch {
      return null
    }
  })

  useEffect(() => {
    try {
      if (user) localStorage.setItem('tv-user', JSON.stringify(user))
      else localStorage.removeItem('tv-user')
    } catch {
      /* sin almacenamiento */
    }
  }, [user])

  const signIn = useCallback((u: User) => setUser(u), [])
  const signOut = useCallback(() => setUser(null), [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    write('tv-theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => write(STORE_KEY, saved), [saved])

  const toggleTheme = useCallback(() => setDark((d) => !d), [])
  const setRewards = useCallback((fn: (r: Rewards) => Rewards) => setSaved((s) => ({ ...s, rewards: fn(s.rewards) })), [])
  const saveAnswer = useCallback<AppState['saveAnswer']>((block, key, value) => {
    setSaved((s) => ({ ...s, answers: { ...s.answers, [block]: { ...s.answers[block], [key]: value } } }))
  }, [])
  const saveProgress = useCallback((block: BlockKey, p: BlockProgress) => {
    setSaved((s) => ({ ...s, progress: { ...s.progress, [block]: p } }))
  }, [])
  const setLastRoute = useCallback((route: string | null) => setSaved((s) => (s.lastRoute === route ? s : { ...s, lastRoute: route })), [])
  const reset = useCallback(() => setSaved(EMPTY), [])

  const answeredCount = useMemo(() => {
    const a = saved.answers
    return (
      Object.keys(a.personality).length +
      Object.keys(a.block1).length +
      Object.keys(a.block2).length +
      Object.keys(a.block3).length
    )
  }, [saved.answers])

  const value = useMemo(
    () => ({ ...saved, dark, toggleTheme, setRewards, saveAnswer, saveProgress, setLastRoute, answeredCount, reset, user, signIn, signOut }),
    [saved, dark, toggleTheme, setRewards, saveAnswer, saveProgress, setLastRoute, answeredCount, reset, user, signIn, signOut],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp debe usarse dentro de <AppProvider>')
  return ctx
}
