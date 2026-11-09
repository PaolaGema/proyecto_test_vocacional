import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Reward from '../components/Reward'
import RewardCharger from '../components/RewardCharger'
import DemoHand from '../components/DemoHand'
import { Hearts, OverallProgress, TestHeader } from '../components/TestLayout'
import { Kbd, KeyHint, LoadingOverlay, PRACTICE_GLOW, PracticeBanner, PracticeCoach, PracticeTransition, useBlockFlow, useShortcuts } from '../components/flow'
import { BackArrow, CircleBackButton, ThemeToggle, cx } from '../components/ui'
import { useApp } from '../context/AppContext'
import { LIKERT_OPTIONS, PERSONALITY_ITEMS, PERSONALITY_QUESTIONS, PERSONALITY_SECTIONS } from '../data/testData'

// Como en Figma: 4 secciones de 15 preguntas; el contador "x/15" se reinicia y cada sección da un corazón
const SECTIONS = Array.from({ length: PERSONALITY_SECTIONS }, () => PERSONALITY_QUESTIONS.length)
// Una sola pregunta de práctica: la escala se entiende con una (propuesta B de tutoriales)
const PRACTICE = PERSONALITY_QUESTIONS[0]

/* ---------- Opciones de escala (Figma: "varias opciones personalidad") ---------- */
function LikertOptions({ value, onSelect, glow = false }: { value?: number; onSelect: (v: number) => void; glow?: boolean }) {
  return (
    <div className="mx-auto flex w-full max-w-[510px] flex-col gap-2.5" role="radiogroup">
      {LIKERT_OPTIONS.map((label, i) => {
        const selected = value === i
        return (
          <button
            key={label}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onSelect(i)}
            className={cx(
              'flex h-14 cursor-pointer items-center gap-4 rounded-xl border-[3px] bg-white px-4 text-left transition md:h-[62px] md:gap-[21px]',
              selected ? 'border-brand shadow-brand' : 'border-option-border hover:border-brand/60',
              glow && !selected && PRACTICE_GLOW,
            )}
          >
            <span
              className={cx(
                'flex size-6 shrink-0 items-center justify-center rounded-full shadow-[inset_0_4px_4px_rgb(255_255_255/0.12)]',
                selected ? 'bg-brand' : 'bg-[#d8d8d8]',
              )}
            >
              {selected && <span className="size-2.5 rounded-full bg-white" />}
            </span>
            <span className="text-base leading-[23px] font-medium text-option-text md:text-lg">{label}</span>
          </button>
        )
      })}
    </div>
  )
}

function Header({ progress }: { progress?: { current: number; total: number } }) {
  return (
    <TestHeader pill="Test de personalidad" pillClassName="xl:w-[369px] justify-center" incentives={<Hearts />} progress={progress} />
  )
}

/** Figma: "Test de personalidad pregunta N" + "Tutorial bloque 6" (tutorial) */
export default function PersonalityTest() {
  const navigate = useNavigate()
  const { answers, saveAnswer, rewards, setRewards } = useApp()
  const flow = useBlockFlow('personality', '/test/personalidad', SECTIONS)
  const busy = useRef(false)
  const demoRef = useRef<HTMLDivElement>(null)
  const [practiceValue, setPracticeValue] = useState<number>()

  const inPractice = flow.phase === 'practice' || flow.phase === 'practiceDone'
  const question = inPractice ? PRACTICE : PERSONALITY_ITEMS[flow.globalIndex]
  const value = inPractice ? practiceValue : answers.personality[flow.globalIndex]

  const select = (v: number) => {
    if (flow.phase === 'practice') {
      setPracticeValue(v)
      setTimeout(flow.finishPractice, 350)
      return
    }
    if (busy.current) return
    busy.current = true
    saveAnswer('personality', flow.globalIndex, v)
    setTimeout(() => {
      busy.current = false
      flow.next()
    }, 350)
  }

  // Atajos: teclas 1 a 5 eligen la opción (auditoría #8)
  useShortcuts(
    { '1': () => select(0), '2': () => select(1), '3': () => select(2), '4': () => select(3), '5': () => select(4) },
    flow.phase === 'test' || flow.phase === 'practice',
  )

  return (
    <div className="relative min-h-svh bg-surface pb-12 text-fg">
      {!inPractice && <OverallProgress />}
      {inPractice ? (
        <header className="mx-auto w-full max-w-[1352px] px-4 pt-4 md:px-8 md:pt-6 2xl:px-0">
          <div className="flex items-center gap-3 md:gap-6">
            <BackArrow to="/intro" />
            <PracticeBanner />
            <ThemeToggle />
          </div>
        </header>
      ) : (
        <Header progress={{ current: flow.index + 1, total: flow.sectionSize }} />
      )}

      <section className="mx-auto mt-5 max-w-[1100px] px-4 text-center md:mt-8">
        <p className="text-base leading-snug font-medium md:text-lg xl:text-2xl">
          {inPractice ? 'Pregunta de práctica: no cuenta para tu resultado' : 'No existen respuestas correctas e incorrectas'}
        </p>
        <h1 key={question} className="mt-3 text-[clamp(1.375rem,2.6vw,2.25rem)] leading-[1.25] font-bold animate-fade-up md:mt-5">
          {question}
        </h1>
      </section>

      {flow.phase === 'practice' && (
        <PracticeCoach onSkip={flow.skipPractice}>
          <b className="text-[#8fd8e6]">Toca la opción</b> que más se parezca a ti. No hay respuestas correctas.
        </PracticeCoach>
      )}
      <div ref={demoRef} className="relative mt-[clamp(20px,5vh,56px)] px-4">
        <DemoHand container={demoRef} mode="sweep" active={flow.phase === 'practice'} />
        <LikertOptions value={value} onSelect={select} glow={flow.phase === 'practice'} />
        <KeyHint>
          Atajo: pulsa <Kbd>1</Kbd> a <Kbd>5</Kbd> para elegir
        </KeyHint>
      </div>

      <div className="mx-auto mt-6 flex max-w-[1120px] items-center gap-4 px-4 md:gap-6">
        <CircleBackButton disabled={inPractice} onClick={flow.prev} />
        {!inPractice && value === undefined && (
          <span className="text-base text-section-label">Selecciona tu respuesta para continuar</span>
        )}
      </div>

      {flow.phase === 'practiceDone' && <PracticeTransition heading="Ahora empieza el test de personalidad de verdad" onStart={flow.startTest} />}
      {flow.phase === 'loading' && <LoadingOverlay />}
      {flow.phase === 'test' && (
        <RewardCharger
          kind="heart"
          done={flow.index}
          size={flow.sectionSize}
          earned={rewards.hearts}
          total={4}
          launchKey={flow.sectionDone}
          onLanded={() => setRewards((r) => ({ ...r, hearts: Math.min(4, r.hearts + 1) }))}
          className="bottom-5"
        />
      )}
      {flow.phase === 'reward' && (
        <Reward
          kind="heart"
          earned={rewards.hearts + 1}
          onDone={() => {
            setRewards((r) => ({ ...r, hearts: Math.min(4, r.hearts + 1) }))
            if (flow.afterReward()) navigate('/test/bloque-1')
          }}
        />
      )}
    </div>
  )
}
