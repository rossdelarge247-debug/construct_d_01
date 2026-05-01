import { cn } from '@/utils/cn'
import type { PhasesData, PhaseName, SubItem } from './types'
import { UNLOCK_WHEN } from './copy'

interface JourneyMapRailProps {
  currentPhase: PhaseName
  phases: PhasesData
  currentSubitems?: readonly SubItem[]
  className?: string
}

export function JourneyMapRail({
  currentPhase: _currentPhase,
  phases,
  currentSubitems = [],
  className,
}: JourneyMapRailProps) {
  return (
    <nav
      aria-label="Journey map"
      className={cn(
        'flex flex-col gap-[var(--ds-space-12)]',
        'rounded-[var(--ds-radius-lg)] bg-[var(--ds-color-surface-panel)] p-[var(--ds-space-16)]',
        'border border-[color:var(--ds-color-border)]',
        className,
      )}
    >
      {phases.map((phase, idx) => {
        const isCurrent = phase.status === 'current'
        const isLocked = phase.status === 'locked'
        const phaseColorVar =
          phase.name === 'start' ? '--ds-color-ink' : `--ds-color-phase-${phase.name}`
        const unlockHint = isLocked ? UNLOCK_WHEN[phase.name] : undefined

        return (
          <div
            key={phase.name}
            data-phase-name={phase.name}
            data-phase-status={phase.status}
            aria-current={isCurrent ? 'step' : undefined}
            className={cn(
              'flex flex-col gap-[var(--ds-space-6)] border-l-2 pl-[var(--ds-space-12)]',
              isCurrent && `border-[color:var(${phaseColorVar})]`,
              !isCurrent && 'border-[color:var(--ds-color-border)]',
              isLocked && 'opacity-60',
            )}
          >
            <span className="flex items-center gap-[var(--ds-space-8)] text-[length:var(--ds-type-15-5)] font-medium">
              <span
                className={cn(
                  'inline-flex h-[var(--ds-space-20)] w-[var(--ds-space-20)] items-center justify-center rounded-full text-[length:var(--ds-type-11)] font-semibold',
                  isCurrent
                    ? `bg-[var(${phaseColorVar})] text-[color:var(--ds-color-surface-panel)]`
                    : 'bg-[var(--ds-color-surface-canvas)] text-[color:var(--ds-color-text-sub)]',
                )}
              >
                {idx + 1}
              </span>
              <span
                className={cn(
                  isCurrent
                    ? 'text-[color:var(--ds-color-ink)]'
                    : 'text-[color:var(--ds-color-text-sub)]',
                )}
              >
                {phase.label}
              </span>
            </span>
            {isCurrent && currentSubitems.length > 0 && (
              <ul className="ml-[var(--ds-space-28)] flex flex-col gap-[var(--ds-space-4)]">
                {currentSubitems.map((item, i) => (
                  <li
                    key={i}
                    className="text-[length:var(--ds-type-14-5)] text-[color:var(--ds-color-text-sub)]"
                  >
                    {item.href ? (
                      <a href={item.href} className="hover:underline">
                        {item.label}
                      </a>
                    ) : (
                      item.label
                    )}
                  </li>
                ))}
              </ul>
            )}
            {isLocked && (
              <ul
                data-locked-preview
                className="ml-[var(--ds-space-28)] flex flex-col gap-[var(--ds-space-4)]"
              >
                <li className="text-[length:var(--ds-type-11)] italic opacity-70 text-[color:var(--ds-color-text-sub)]">
                  Preview of next steps
                </li>
                {unlockHint && (
                  <li className="text-[length:var(--ds-type-11)] text-[color:var(--ds-color-text-sub)]">
                    {unlockHint}
                  </li>
                )}
              </ul>
            )}
          </div>
        )
      })}
    </nav>
  )
}
