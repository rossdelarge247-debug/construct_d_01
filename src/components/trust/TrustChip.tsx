import type { TrustLevel } from './types'
import { humaniseLevel } from './levels'

export interface TrustChipProps {
  level: TrustLevel
  sourceLabel?: string
}

const SHARED_CLASSES =
  'inline-flex items-center px-[var(--ds-space-8)] py-[2px] rounded-full text-[length:var(--ds-type-12)] font-medium border'

const LEVEL_CLASSES: Record<TrustLevel, string> = {
  'self-declared':
    'bg-[var(--ds-color-trust-self-declared-soft)] text-[var(--ds-color-trust-self-declared)] border-[var(--ds-color-trust-self-declared)]',
  'bank-evidenced':
    'bg-[var(--ds-color-trust-bank-evidenced-soft)] text-[var(--ds-color-trust-bank-evidenced)] border-[var(--ds-color-trust-bank-evidenced)]',
  'credit-verified': 'bg-neutral-100 text-neutral-600 border-neutral-300',
  'document-evidenced': 'bg-neutral-100 text-neutral-600 border-neutral-300',
  'both-party-agreed': 'bg-neutral-100 text-neutral-600 border-neutral-300',
  'court-sealed': 'bg-neutral-100 text-neutral-600 border-neutral-300',
}

function defaultLabel(level: TrustLevel): string {
  if (level === 'self-declared') return 'Estimated'
  if (level === 'bank-evidenced') return 'Bank'
  return humaniseLevel(level)
}

export function TrustChip({ level, sourceLabel }: TrustChipProps) {
  const label = sourceLabel ?? defaultLabel(level)
  const className = `${SHARED_CLASSES} ${LEVEL_CLASSES[level]}`
  return (
    <span
      data-trust-chip-level={level}
      className={className}
      aria-label={`Trust: ${humaniseLevel(level)} — ${label}`}
    >
      {label}
    </span>
  )
}
