import { cn } from '@/utils/cn'
import type { PhasesData, PhaseName, PhaseStatus } from './types'

interface PhaseStepperProps {
  currentPhase: PhaseName
  phases: PhasesData
  className?: string
}

const STATUS_LABEL: Record<PhaseStatus, string> = {
  current: 'In progress',
  complete: 'Complete',
  locked: 'Locked',
}

export function PhaseStepper({ currentPhase: _currentPhase, phases, className }: PhaseStepperProps) {
  return (
    <nav
      aria-label="Phase progress"
      className={cn(
        'flex w-full items-stretch gap-[var(--ds-space-8)]',
        'rounded-[var(--ds-radius-lg)] bg-[var(--ds-color-surface-panel)] p-[var(--ds-space-12)]',
        className,
      )}
    >
      {phases.map((phase, idx) => {
        const isCurrent = phase.status === 'current'
        const isLocked = phase.status === 'locked'
        const isComplete = phase.status === 'complete'
        const phaseColorVar =
          phase.name === 'start' ? '--ds-color-ink' : `--ds-color-phase-${phase.name}`

        return (
          <div
            key={phase.name}
            data-phase-name={phase.name}
            data-phase-status={phase.status}
            data-phase-stepper-current={isCurrent ? '' : undefined}
            aria-current={isCurrent ? 'step' : undefined}
            aria-label={`Phase ${idx + 1}: ${phase.label} — ${STATUS_LABEL[phase.status]}`}
            className={cn(
              'flex flex-1 flex-col items-start gap-[var(--ds-space-4)]',
              'rounded-[var(--ds-radius-md)] border px-[var(--ds-space-12)] py-[var(--ds-space-10)]',
              'border-[color:var(--ds-color-border)] bg-[var(--ds-color-surface-panel)]',
              isCurrent &&
                `bg-[var(${phaseColorVar})] text-[color:var(--ds-color-surface-panel)] border-transparent`,
              isComplete && 'opacity-90',
              isLocked && 'opacity-50',
            )}
          >
            <span className="flex items-center gap-[var(--ds-space-6)] text-[length:var(--ds-type-14-5)] font-medium">
              <span
                className={cn(
                  'inline-flex h-[var(--ds-space-20)] w-[var(--ds-space-20)] items-center justify-center rounded-full text-[length:var(--ds-type-11)] font-semibold',
                  isCurrent
                    ? 'bg-[var(--ds-color-surface-panel)] text-[color:var(--ds-color-ink)]'
                    : 'bg-[var(--ds-color-surface-canvas)] text-[color:var(--ds-color-text-sub)]',
                )}
              >
                {idx + 1}
              </span>
              {phase.label}
            </span>
            <span
              className={cn(
                'text-[length:var(--ds-type-11)] uppercase tracking-[var(--ds-letter-spacing-wide)]',
                isCurrent
                  ? 'text-[color:var(--ds-color-surface-panel)] opacity-80'
                  : 'text-[color:var(--ds-color-text-sub)]',
              )}
            >
              {STATUS_LABEL[phase.status]}
            </span>
          </div>
        )
      })}
    </nav>
  )
}
