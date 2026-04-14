'use client'

interface ProgressStepperProps {
  sections: string[]
  currentIndex: number
}

export function ProgressStepper({ sections, currentIndex }: ProgressStepperProps) {
  const total = sections.length

  return (
    <div>
      {/* Step counter — Habito-style */}
      <p className="text-[13px] font-semibold text-ink mb-2">
        {currentIndex + 1} of {total}
      </p>

      {/* Segmented bar — thicker, red fill */}
      <div className="flex gap-1">
        {sections.map((_, i) => (
          <div
            key={i}
            className="h-1.5 flex-1 rounded-full transition-all"
            style={{
              backgroundColor:
                i <= currentIndex
                  ? 'var(--color-red-500)'
                  : 'var(--color-grey-100)',
              transitionDuration: '300ms',
              transitionTimingFunction: 'ease',
            }}
          />
        ))}
      </div>
    </div>
  )
}
