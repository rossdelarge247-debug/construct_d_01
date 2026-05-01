import { cn } from '@/utils/cn'
import type { ReactNode } from 'react'
import { UNLOCK_WHEN, UNLOCK_WHEN_DASHBOARD } from './copy'
import type { PhaseName } from './types'

type GateName = PhaseName | 'preparation' | 'reconciliation'

interface LockedSectionProps {
  gate: GateName
  title: string
  children: ReactNode
  className?: string
}

function unlockText(gate: GateName): string {
  if (gate === 'preparation' || gate === 'reconciliation') {
    return UNLOCK_WHEN_DASHBOARD[gate]
  }
  return UNLOCK_WHEN[gate] ?? ''
}

export function LockedSection({ gate, title, children, className }: LockedSectionProps) {
  const hint = unlockText(gate)
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
    </section>
  )
}
