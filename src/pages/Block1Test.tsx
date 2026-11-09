import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Reward from '../components/Reward'
import RewardCharger from '../components/RewardCharger'
import DemoHand from '../components/DemoHand'
import { Stars, TestHeader, TestLayout } from '../components/TestLayout'
import { Kbd, KeyHint, LoadingOverlay, PRACTICE_GLOW, PracticeBanner, PracticeCoach, PracticeTransition, useBlockFlow, useShortcuts } from '../components/flow'
import { BackArrow, ThemeToggle, cx } from '../components/ui'
import { useApp } from '../context/AppContext'
import { BLOCK1_QUESTIONS, type ActivityOption, type Block1Question } from '../data/testData'

const SECTIONS = [15, 15, 15, 15] // 60 pares → 4 estrellas

const PRACTICE: Block1Question = {
  a: { text: 'Crear un programa cultural para población vulnerable.', image: '/images/actividades/practica-a.webp' },
  b: { text: 'Fortalecer un programa de higiene bucal para adultos mayores.', image: '/images/actividades/practica-b.webp' },
}

/* ---------- Tarjeta de actividad (Figma: "card de preguntas") ---------- */
export function ActivityCard({
  option,
  letter,
  selected,
  onClick,
  glow = false,
}: {
  option: ActivityOption
  letter: 'A' | 'B'
  selected?: boolean
  onClick?: () => void
  glow?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cx(
        'group relative flex w-full cursor-pointer flex-col rounded-xl border-[4px] bg-white p-2 pb-12 text-left shadow-card transition-all duration-300 md:border-[5px] md:p-4 md:pb-14 lg:px-[19px] lg:pt-[22px]',
        selected ? 'scale-[1.03] border-brand md:scale-[1.06]' : 'border-white hover:-translate-y-1 hover:shadow-[0_4px_10px_rgb(0_0_0/0.25)]',
        glow && !selected && PRACTICE_GLOW,
      )}
    >
      <div className="h-[clamp(96px,24vh,242px)] w-full overflow-hidden rounded bg-[#d9d9d9]">
        <img src={option.image} alt="" loading="lazy" className="size-full object-cover" />
      </div>
      <p className="mt-3 text-sm leading-snug font-bold text-card-title md:mt-5 md:text-lg lg:text-[20px]">{option.text}</p>
      <span className="absolute right-3 bottom-3 flex size-8 items-center justify-center rounded-full border-[3px] border-white bg-action text-base font-bold text-white md:size-[43px] md:text-[21.7px]">
        {letter}
      </span>
    </button>
  )
}

export function Block1Pair({
  question,
  selected,
  onSelect,
  glow = false,
}: {
  question: Block1Question
  selected?: 'A' | 'B'
  onSelect?: (v: 'A' | 'B') => void
  glow?: boolean
}) {
  return (
    <div className="mx-auto grid w-full max-w-[827px] grid-cols-2 gap-3 md:gap-[37px]">
      <ActivityCard option={question.a} letter="A" glow={glow} selected={selected === 'A'} onClick={() => onSelect?.('A')} />
      <ActivityCard option={question.b} letter="B" glow={glow} selected={selected === 'B'} onClick={() => onSelect?.('B')} />
    </div>
  )
}

export function Block1Title() {
  return (
    <div className="mx-auto mt-5 flex max-w-[1106px] flex-col gap-2 px-4 text-center md:mt-8 md:gap-[14px]">
      <h1 className="text-[clamp(1.25rem,2.3vw,2rem)] leading-[1.25] font-medium">DE LAS SIGUIENTES DOS ACTIVIDADES ¿CUÁL TE ATRAE MÁS?</h1>
      <p className="text-base leading-snug font-medium md:text-lg xl:text-2xl">No existen respuestas correctas e incorrectas</p>
    </div>
  )
}

/** Figma: "pregunta - N", "pregunta N A/B", "Tutorial bloque 7" */
export default function Block1Test() {
  const navigate = useNavigate()
  const { answers, saveAnswer, rewards, setRewards } = useApp()
  const flow = useBlockFlow('block1', '/test/bloque-1', SECTIONS)
  const busy = useRef(false)
  const demoRef = useRef<HTMLDivElement>(null)
  const [practicePick, setPracticePick] = useState<'A' | 'B'>()

  const inPractice = flow.phase === 'practice' || flow.phase === 'practiceDone'
  const question = inPractice ? PRACTICE : BLOCK1_QUESTIONS[flow.globalIndex]
  const selected = inPractice ? practicePick : answers.block1[flow.globalIndex]

  const select = (v: 'A' | 'B') => {
    if (flow.phase === 'practiceDone') return
    if (flow.phase === 'practice') {
      setPracticePick(v)
      setTimeout(flow.finishPractice, 350)
      return
    }
    if (busy.current) return
    busy.current = true
    saveAnswer('block1', flow.globalIndex, v)
    setTimeout(() => {
      busy.current = false
      flow.next()
    }, 450)
  }

  // Atajos: A / B, 1 / 2 o flechas izquierda / derecha (auditoría #8)
  useShortcuts(
    { a: () => select('A'), b: () => select('B'), '1': () => select('A'), '2': () => select('B'), arrowleft: () => select('A'), arrowright: () => select('B') },
    flow.phase === 'test' || flow.phase === 'practice',
  )

  return (
    <TestLayout prevDisabled={inPractice || flow.index === 0} onPrev={flow.prev}>
      {inPractice ? (
        <header className="mx-auto flex w-full max-w-[1352px] items-center gap-3 px-4 pt-4 md:gap-6 md:px-8 md:pt-6 2xl:px-0">
          <BackArrow to="/test/personalidad" />
          <PracticeBanner />
          <ThemeToggle />
        </header>
      ) : (
        <TestHeader
          pill="Bloque 1 de 3 · Intereses profesionales"
          progress={{ current: flow.index + 1, total: flow.sectionSize }}
          progressAside={<Stars label={`${flow.section + 1} de 4 secciones`} />}
        />
      )}

      <Block1Title />

      {flow.phase === 'practice' && (
        <PracticeCoach onSkip={flow.skipPractice}>
          <b className="text-[#8fd8e6]">Toca la actividad</b> que más te atraiga.
        </PracticeCoach>
      )}
      <div ref={demoRef} className="relative mx-auto mt-[clamp(16px,4vh,48px)] w-full max-w-[860px] px-4" key={flow.globalIndex}>
        <DemoHand container={demoRef} mode="pair" active={flow.phase === 'practice'} />
        <div className="animate-fade-up">
          <Block1Pair question={question} selected={selected} onSelect={select} glow={flow.phase === 'practice'} />
        </div>
        {!inPractice && (
          <KeyHint>
            Atajo: pulsa <Kbd>A</Kbd> o <Kbd>B</Kbd> para elegir
          </KeyHint>
        )}
      </div>

      {flow.phase === 'practiceDone' && <PracticeTransition heading="Ahora empieza el bloque 1 de verdad" onStart={flow.startTest} />}
      {flow.phase === 'loading' && <LoadingOverlay />}
      {flow.phase === 'test' && (
        <RewardCharger
          kind="star"
          done={flow.index}
          size={flow.sectionSize}
          earned={rewards.stars}
          total={4}
          launchKey={flow.sectionDone}
          onLanded={() => setRewards((r) => ({ ...r, stars: Math.min(4, r.stars + 1) }))}
          className="bottom-[80px] md:bottom-[108px]"
        />
      )}
      {flow.phase === 'reward' && (
        <Reward
          kind="star"
          earned={rewards.stars + 1}
          onDone={() => {
            setRewards((r) => ({ ...r, stars: Math.min(4, r.stars + 1) }))
            if (flow.afterReward()) navigate('/test/bloque-2')
          }}
        />
      )}
    </TestLayout>
  )
}
