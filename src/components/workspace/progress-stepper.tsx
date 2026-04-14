'use client'

interface ProgressStepperProps {
  sections: string[]
  currentIndex: number
  completedCount: number
}

export function ProgressStepper({ sections, currentIndex, completedCount }: ProgressStepperProps) {
  const total = sections.length
  const displayIndex = Math.min(completedCount + 1, total)

  return (
    <div>
      {/* Step counter — Habito-style */}
      <p className="text-[13px] font-semibold text-ink mb-2">
        {displayIndex} of {total}
      </p>

      {/* Segmented bar — thicker, red fill */}
      <div className="flex gap-1">
        {sections.map((_, i) => (
          <div
            key={i}
            className="h-1.5 flex-1 rounded-full transition-all"
            style={{
              backgroundColor:
                i < completedCount
                  ? 'var(--color-red-500)'
                  : i === currentIndex
                    ? 'var(--color-red-500)'
                    : 'var(--color-grey-100)',
              opacity: 1,
              transitionDuration: '300ms',
              transitionTimingFunction: 'ease',
            }}
          />
        ))}
      </div>
    </div>
  )
}
