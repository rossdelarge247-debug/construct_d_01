import { ArrowRight } from './icons'

interface CTAPrimaryProps {
  label?: string
  time?: string
  href?: string
  size?: 'lg' | 'sm'
  inverse?: boolean
}

const INK = 'var(--ds-color-ink)'
const MUTE = 'var(--ds-color-text-muted)'
const WHITE = '#FFFFFF'

export function CTAPrimary({
  label = 'Start your free plan',
  time = '~3 minutes · no account needed',
  href = '/start',
  size = 'lg',
  inverse = false,
}: CTAPrimaryProps) {
  const padY = size === 'lg' ? 16 : 12
  const padX = size === 'lg' ? 26 : 20
  const fs = size === 'lg' ? 15 : 13.5
  return (
    <div className="inline-flex flex-col items-start gap-2">
      <a
        href={href}
        className="cta-primary inline-flex items-center gap-2.5 rounded-full font-medium"
        style={{
          padding: `${padY}px ${padX}px`,
          background: inverse ? WHITE : INK,
          color: inverse ? INK : WHITE,
          border: `1px solid ${INK}`,
          fontSize: fs,
          letterSpacing: '-0.005em',
        }}
      >
        {label}
        <ArrowRight size={fs + 2} sw={2} />
      </a>
      <div
        className="flex items-center gap-2 pl-1"
        style={{ color: MUTE }}
      >
        <span
          className="mono tabular"
          style={{ fontSize: 11, letterSpacing: '0.02em' }}
        >
          {time}
        </span>
        <span className="kbd" style={{ marginLeft: 4 }}>↵</span>
      </div>
    </div>
  )
}
