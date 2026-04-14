'use client'

// S1a — Spending fork: "Do it now" or "Just provide estimates"
// Appears as the last section in the confirmation flow.
// The question acknowledges the user's time and doesn't pressure them.

interface SpendingForkProps {
  onChoose: (mode: 'now' | 'estimates') => void
  onSkip: () => void
}

export function SpendingFork({ onChoose, onSkip }: SpendingForkProps) {
  return (
    <div className="animate-fade-in">
      <p className="text-[12px] font-semibold text-ink-tertiary uppercase tracking-wider mb-2">
        Spending
      </p>
      <h3 className="text-[22px] font-bold text-ink leading-snug mb-2">
        Spending categorisation adds a few extra minutes to the journey,
        it&apos;s not essential for your first mediation chat
      </h3>

      <div className="mt-6 space-y-2">
        <ForkOption
          label="I'd like to get it done now"
          selected={false}
          onClick={() => onChoose('now')}
        />
        <ForkOption
          label="I'll just provide some estimates to begin with"
          selected={false}
          onClick={() => onChoose('estimates')}
        />
      </div>

      <div className="mt-8 flex items-center gap-4">
        <button
          onClick={onSkip}
          className="text-[13px] text-ink-tertiary hover:text-ink-secondary transition-colors"
        >
          Skip for now
        </button>
      </div>
    </div>
  )
}

function ForkOption({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-5 py-4 transition-all"
      style={{
        borderRadius: 'var(--radius-card)',
        border: `1.5px solid ${selected ? 'var(--color-ink)' : 'var(--color-grey-100)'}`,
        backgroundColor: selected ? 'var(--color-ink)' : 'white',
        color: selected ? 'white' : 'var(--color-ink)',
        transitionDuration: '200ms',
        transitionTimingFunction: 'ease',
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all"
          style={{
            border: selected ? '2px solid white' : '2px solid var(--color-grey-200)',
            transitionDuration: '200ms',
          }}
        >
          {selected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
        </div>
        <span className="text-[15px] font-medium">{label}</span>
      </div>
    </button>
  )
}
