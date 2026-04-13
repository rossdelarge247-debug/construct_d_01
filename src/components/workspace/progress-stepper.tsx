'use client'

import type { ConfirmationSectionKey } from '@/lib/bank/confirmation-questions'

interface ProgressStepperProps {
  sections: ConfirmationSectionKey[]
  currentIndex: number
  completedCount: number
}

export function ProgressStepper({ sections, currentIndex, completedCount }: ProgressStepperProps) {
  return (
    <div className="flex gap-1">
      {sections.map((_, i) => (
        <div
          key={i}
          className="h-1.5 flex-1 rounded-full transition-all"
          style={{
            backgroundColor: i < completedCount ? 'var(--color-ink)' : i === currentIndex ? 'var(--color-ink)' : 'var(--color-grey-100)',
            opacity: i === currentIndex && i >= completedCount ? 0.5 : 1,
            transitionDuration: '300ms',
            transitionTimingFunction: 'ease',
          }}
        />
      ))}
    </div>
  )
}
