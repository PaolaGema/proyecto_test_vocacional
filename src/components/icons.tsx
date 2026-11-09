// Íconos SVG extraídos del diseño de Figma (Test web).
type P = { className?: string }

export const ArrowLeftIcon = ({ className = '' }: P) => (
  <svg viewBox="0 0 49 49" fill="none" className={className} aria-hidden>
    <path
      d="M40.8346 24.5H8.16797M20.418 36.75L8.16797 24.5L20.418 12.25"
      strokeWidth="3.0625"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
)

export const ArrowRightIcon = ({ className = '' }: P) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path
      d="M6 12H18.5M12.5 18L18.5 12L12.5 6"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
)

export const ChevronLeftIcon = ({ className = '' }: P) => (
  <svg viewBox="0 0 53 53" fill="none" className={className} aria-hidden>
    <path
      d="M32.8951 17.9435L24.3267 26.5118L32.8951 35.0802C33.7563 35.9414 33.7563 37.3327 32.8951 38.1939C32.0338 39.0552 30.6426 39.0552 29.7813 38.1939L19.6451 28.0577C18.7838 27.1964 18.7838 25.8052 19.6451 24.9439L29.7813 14.8077C30.6426 13.9464 32.0338 13.9464 32.8951 14.8077C33.7342 15.6689 33.7563 17.0822 32.8951 17.9435Z"
      fill="currentColor"
    />
  </svg>
)

export const ChevronDownIcon = ({ className = '' }: P) => (
  <svg viewBox="0 0 11 6" fill="none" className={className} aria-hidden>
    <path d="M0.5 0.5L5.5 5.5L10.5 0.5" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" />
  </svg>
)

export const SparkleIcon = ({ className = '' }: P) => (
  <svg viewBox="0 0 26 26" fill="currentColor" className={className} aria-hidden>
    <path d="M10.15 13.56c-.54-.18-.54-.94 0-1.11l3.15-1.05a5.2 5.2 0 0 0 3.29-3.29l1.05-3.15c.18-.54.94-.54 1.11 0l1.05 3.15a5.2 5.2 0 0 0 3.29 3.29l3.15 1.05c.54.18.54.94 0 1.11l-3.15 1.05a5.2 5.2 0 0 0-3.29 3.29l-1.05 3.15c-.18.54-.94.54-1.11 0l-1.05-3.15a5.2 5.2 0 0 0-3.29-3.29l-3.15-1.05Z" />
    <path d="M3.9 6.3c-.32-.1-.32-.56 0-.67l1.89-.63A3.12 3.12 0 0 0 7.76 3.03l.63-1.89c.11-.32.56-.32.67 0l.63 1.89a3.12 3.12 0 0 0 1.97 1.97l1.89.63c.32.11.32.56 0 .67l-1.89.63a3.12 3.12 0 0 0-1.97 1.97l-.63 1.89c-.11.32-.56.32-.67 0l-.63-1.89A3.12 3.12 0 0 0 5.79 6.93L3.9 6.3Z" />
    <path d="M1.4 19.1c-.21-.07-.21-.37 0-.45l1.26-.42a2.08 2.08 0 0 0 1.32-1.32l.42-1.26c.07-.21.37-.21.45 0l.42 1.26c.21.62.7 1.11 1.32 1.32l1.26.42c.21.07.21.37 0 .45l-1.26.42a2.08 2.08 0 0 0-1.32 1.32l-.42 1.26c-.07.21-.37.21-.45 0l-.42-1.26a2.08 2.08 0 0 0-1.32-1.32L1.4 19.1Z" />
  </svg>
)

export const HeartSolidIcon = ({ className = '' }: P) => (
  <svg viewBox="0 0 32 32" fill="currentColor" className={className} aria-hidden>
    <path d="M16 28.47 14.07 26.7C7.2 20.48 2.67 16.37 2.67 11.33 2.67 7.23 5.9 4 10 4c2.32 0 4.55 1.08 6 2.79C17.45 5.08 19.68 4 22 4c4.1 0 7.33 3.23 7.33 7.33 0 5.04-4.53 9.15-11.4 15.39L16 28.47Z" />
  </svg>
)

export const StarSolidIcon = ({ className = '' }: P) => (
  <svg viewBox="0 0 32 32" fill="currentColor" className={className} aria-hidden>
    <path d="M14.9 3.6c.45-.92 1.76-.92 2.2 0l3.3 6.7 7.38 1.07c1.01.15 1.41 1.39.68 2.1l-5.34 5.2 1.26 7.35c.17 1-.88 1.77-1.78 1.29L16 23.84l-6.6 3.47c-.9.48-1.95-.29-1.78-1.29l1.26-7.35-5.34-5.2c-.73-.71-.33-1.95.68-2.1l7.38-1.07 3.3-6.7Z" />
  </svg>
)

export const RocketIcon = ({ className = '' }: P) => (
  <svg viewBox="0 0 30 30" fill="currentColor" className={className} aria-hidden>
    <path d="M11.94 22.4c-.53 1.15-2.3 3.85-7.25 3.85a.94.94 0 0 1-.94-.94c0-4.96 2.7-6.72 3.85-7.25a.94.94 0 1 1 .78 1.71c-.75.34-2.42 1.45-2.71 4.56 3.11-.29 4.22-1.96 4.56-2.71a.94.94 0 1 1 1.71.78Zm15.21-15.57c-.05-.78-.66-1.4-1.44-1.44-1.66-.1-5.82.04-9.25 3.48l-.32.32H12.4c-.5 0-.98.2-1.33.55L7.05 13.76a.94.94 0 0 0 .53 1.59l3.67.51 4.3 4.3.51 3.67a.94.94 0 0 0 1.59.53l4.02-4.02c.35-.35.55-.83.55-1.33v-3.73l.32-.32c3.44-3.43 3.58-7.59 3.48-9.25Z" />
  </svg>
)

export const EyeOffIcon = ({ className = '' }: P) => (
  <svg viewBox="0 0 17 17" fill="currentColor" className={className} aria-hidden>
    <path d="M8.37 5.81 10.8 8.24l.01-.13a2.32 2.32 0 0 0-2.32-2.32l-.13.01Z" />
    <path d="M8.5 4.25a3.86 3.86 0 0 1 3.59 5.27l2.26 2.26A9.14 9.14 0 0 0 17 8.11 9.13 9.13 0 0 0 8.5 2.32c-1.08 0-2.12.19-3.08.54l1.67 1.67c.44-.17.91-.28 1.41-.28Z" />
    <path d="m.77 2.15 1.76 1.76.35.35A9.1 9.1 0 0 0 0 8.11a9.13 9.13 0 0 0 8.5 5.8c1.2 0 2.34-.23 3.39-.65l.33.33 2.25 2.25.99-.98L1.76 1.16l-.99.99Zm4.27 4.27 1.2 1.2c-.04.16-.06.33-.06.5a2.32 2.32 0 0 0 2.32 2.32c.17 0 .34-.02.5-.06l1.2 1.2a3.86 3.86 0 0 1-5.16-5.16Z" />
  </svg>
)

export const EyeIcon = ({ className = '' }: P) => (
  <svg viewBox="0 0 17 17" fill="currentColor" className={className} aria-hidden>
    <path d="M8.5 2.32A9.13 9.13 0 0 0 0 8.11a9.13 9.13 0 0 0 8.5 5.8 9.13 9.13 0 0 0 8.5-5.8 9.13 9.13 0 0 0-8.5-5.79Zm0 9.65a3.86 3.86 0 1 1 0-7.72 3.86 3.86 0 0 1 0 7.72Zm0-6.18a2.32 2.32 0 1 0 0 4.64 2.32 2.32 0 0 0 0-4.64Z" />
  </svg>
)

export const SunIcon = ({ className = '' }: P) => (
  <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" className={className} aria-hidden>
    <circle cx="9" cy="9" r="3.75" />
    <path d="M9 .75v1.5M9 15.75v1.5M17.25 9h-1.5M2.25 9H.75M14.83 3.17l-1.06 1.06M4.23 13.77l-1.06 1.06M14.83 14.83l-1.06-1.06M4.23 4.23 3.17 3.17" />
  </svg>
)

export const MoonIcon = ({ className = '' }: P) => (
  <svg viewBox="0 0 18 18" fill="currentColor" className={className} aria-hidden>
    <path d="M8.98 1.93a.66.66 0 0 1-.04.71 5.25 5.25 0 0 0 7.47 7.02.66.66 0 0 1-.01-.01c.47-.33 1.1.03 1.06.59a7.88 7.88 0 1 1-8.06-8.65c.26-.02.5.11.63.34Zm-1.59 1.25a6.56 6.56 0 1 0 7.44 7.67 6.56 6.56 0 0 1-7.44-7.67Z" />
  </svg>
)

export const LayersIcon = ({ className = '' }: P) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="m1.33 8 6.43 3.21c.09.04.13.07.18.07h.12c.05 0 .09-.03.18-.07L14.67 8M1.33 11.33l6.43 3.22c.09.04.13.06.18.07h.12c.05-.01.09-.03.18-.07l6.43-3.22M1.33 4.67l6.43-3.22c.09-.04.13-.06.18-.07h.12c.05.01.09.03.18.07l6.43 3.22-6.43 3.21c-.09.04-.13.07-.18.07h-.12c-.05 0-.09-.03-.18-.07L1.33 4.67Z" />
  </svg>
)

export const ZapIcon = ({ className = '' }: P) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M8.67 1.33 2.73 8.46c-.23.28-.35.42-.35.53 0 .1.04.2.12.27.09.07.27.07.64.07H8l-.67 5.33 5.94-7.12c.23-.28.35-.42.35-.54a.33.33 0 0 0-.12-.26c-.09-.07-.27-.07-.64-.07H8l.67-5.34Z" />
  </svg>
)

export const CheckIcon = ({ className = '' }: P) => (
  <svg viewBox="0 0 16 9" fill="currentColor" className={className} aria-hidden>
    <path
      fillRule="evenodd"
      d="M4.25 8.65.44 5.65c-.59-.47-.59-1.22 0-1.7.29-.22.67-.35 1.08-.35.4 0 .79.13 1.07.35l2.73 2.16L12.62.35C12.9.13 13.29 0 13.69 0c.4 0 .79.13 1.08.35.59.47.59 1.23 0 1.7L6.4 8.65c-.29.22-.67.35-1.08.35-.4 0-.79-.13-1.07-.35Z"
    />
  </svg>
)

export const DragDotsIcon = ({ className = '' }: P) => (
  <svg viewBox="0 0 7 12" fill="currentColor" className={className} aria-hidden>
    {[0, 5, 10].map((y) => (
      <g key={y}>
        <circle cx="1" cy={y + 1} r="1" />
        <circle cx="6" cy={y + 1} r="1" />
      </g>
    ))}
  </svg>
)

/* ---------- Incentivos (corazones, estrellas, diamante, trofeo) ---------- */
const HEART = 'M30 12.75c0 8.75-12.97 15.83-13.53 16.13a1 1 0 0 1-.94 0C14.97 28.58 2 21.5 2 12.75A7.76 7.76 0 0 1 9.75 5c2.58 0 4.84 1.11 6.25 2.99C17.41 6.11 19.67 5 22.25 5A7.76 7.76 0 0 1 30 12.75Z'
const STAR = 'M14.6 3.5c.55-1.14 2.25-1.14 2.8 0l3.04 6.27 6.92 1c1.27.19 1.78 1.73.86 2.62l-5 4.88 1.18 6.88c.22 1.25-1.1 2.2-2.23 1.61L16 23.5l-6.17 3.26c-1.13.59-2.45-.36-2.23-1.61l1.18-6.88-5-4.88c-.92-.89-.41-2.43.86-2.62l6.92-1L14.6 3.5Z'
const DIAMOND = 'M30.75 12.34 23.75 4.34A1 1 0 0 0 23 4H9a1 1 0 0 0-.75.34l-7 8a1 1 0 0 0 .02 1.34l14 15a1 1 0 0 0 1.46 0l14-15a1 1 0 0 0 .02-1.34Z'
const TROPHY = 'M28 7h-3V6a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v1H4a2 2 0 0 0-2 2v2a5 5 0 0 0 5 5h.46A9 9 0 0 0 15 21.94V25h-3a1 1 0 0 0 0 2h8a1 1 0 0 0 0-2h-3v-3.06A9 9 0 0 0 24.54 16H25a5 5 0 0 0 5-5V9a2 2 0 0 0-2-2ZM7 14a3 3 0 0 1-3-3V9h3v4c0 .33.02.67.05 1H7Zm21-3a3 3 0 0 1-3 3h-.06c.04-.36.06-.72.06-1.09V9h3v2Z'

export type IncentiveKind = 'heart' | 'star' | 'diamond' | 'trophy'
export const INCENTIVE_PATHS: Record<IncentiveKind, string> = { heart: HEART, star: STAR, diamond: DIAMOND, trophy: TROPHY }
const FILLED: Record<IncentiveKind, string> = {
  heart: '#33A1B8',
  star: '#D28800',
  diamond: '#FFA101',
  trophy: '#FFA101',
}

export const IncentiveIcon = ({
  kind,
  filled,
  className = '',
}: {
  kind: IncentiveKind
  filled: boolean
  className?: string
}) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden>
    <path
      d={INCENTIVE_PATHS[kind]}
      fill={filled ? FILLED[kind] : 'rgb(255 255 255 / 0.3)'}
      stroke={filled ? 'none' : 'var(--empty-icon-stroke)'}
      strokeWidth={1.4}
      strokeLinejoin="round"
    />
  </svg>
)
