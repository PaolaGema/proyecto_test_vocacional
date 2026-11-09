import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Logo from '../components/Logo'

/** Anillo de carga (Figma: componente "Proceso de carga") */
export function LoadingRing() {
  return (
    <div className="relative flex size-[250px] items-center justify-center" role="status" aria-live="polite">
      <span className="absolute inset-0 rounded-full border-[3px] border-[#212121] dark:border-white" />
      <span
        className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-brand border-r-brand"
        style={{ animation: 'spin-ring 1.1s linear infinite' }}
      />
      <span
        className="absolute inset-[10px] rounded-full border-2 border-transparent border-b-brand/50"
        style={{ animation: 'spin-ring 1.6s linear infinite reverse' }}
      />
      <p className="w-[198px] text-center text-base leading-[19px] font-medium tracking-[-0.3px] text-navy dark:text-white">
        En progreso por favor espere un momento...
      </p>
    </div>
  )
}

/** Figma: frames "Carga login" / "Carga registro". Redirige a ?next= */
export default function Loading() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const next = params.get('next') ?? '/'

  useEffect(() => {
    const t = setTimeout(() => navigate(next, { replace: true }), 900)
    return () => clearTimeout(t)
  }, [navigate, next])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-9 bg-surface text-fg">
      <Logo className="w-[270px]" />
      <LoadingRing />
    </div>
  )
}
