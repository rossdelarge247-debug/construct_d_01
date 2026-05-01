import { cn } from '@/utils/cn'
import type { ReactNode } from 'react'
import { UNLOCK_WHEN, UNLOCK_WHEN_DASHBOARD } from './copy'
import type { PhaseName } from './types'

type GateName = PhaseName | 'preparation' | 'reconciliation'

interface LockedSectionProps {
  gate: GateName
  title: string
  children: ReactNode
  renderCta?: () => ReactNode
  className?: string
}

function getUnlockText(gate: GateName): string {
  if (gate === 'preparation' || gate === 'reconciliation') {
    return UNLOCK_WHEN_DASHBOARD[gate]
  }
  return UNLOCK_WHEN[gate] ?? ''
}

function LockedPill() {
  return (
    <span className="inline-flex items-center rounded-[var(--ds-radius-md)] border border-[color:var(--ds-color-border)] px-[var(--ds-space-12)] py-[var(--ds-space-6)] text-[length:var(--ds-type-11)] uppercase tracking-[var(--ds-letter-spacing-wide)] text-[color:var(--ds-color-text-sub)]">
      Locked
    </span>
  )
}

export function LockedSection({
  gate,
  title,
  children,
  renderCta,
  className,
}: LockedSectionProps) {
  const hint = getUnlockText(gate)
  const cta = renderCta ? renderCta() : <LockedPill />
  return (
    <section
      aria-disabled="true"
      className={cn('flex flex-col gap-[var(--ds-space-12)]', className)}
    >
      <div data-locked-header className="flex flex-col gap-[var(--ds-space-4)]">
        <h2 className="text-[length:var(--ds-type-20)] font-medium text-[color:var(--ds-color-ink)]">
          {title}
        </h2>
        <span className="flex items-center gap-[var(--ds-space-6)] text-[length:var(--ds-type-11)] uppercase tracking-[var(--ds-letter-spacing-wide)] text-[color:var(--ds-color-text-sub)]">
          🔒 LOCKED{hint && ` · ${hint}`}
        </span>
      </div>
      <div data-locked-children className="opacity-50 pointer-events-none">
        {children}
      </div>
      <div data-locked-cta className="flex">{cta}</div>
    </section>
  )
}
