import type { Metadata } from 'next'
import {
  PhaseStepper,
  JourneyMapRail,
  LockedSection,
  buildPhasesData,
} from '@/components/phase-nav'
import { TrustChip, TRUST_LEVELS } from '@/components/trust'

export const metadata: Metadata = {
  title: 'Decouple — rebuilding',
  description: 'The complete settlement workspace for separating couples — under active rebuild',
}

export default function LandingPage() {
  const phases = buildPhasesData('build', ['start'])
  const sampleSubitems = [
    { label: 'Section 1: About you' },
    { label: 'Section 2: Your finances' },
  ]

  return (
    <main className="min-h-screen bg-[color:var(--ds-color-surface-canvas)] p-[var(--ds-space-32)]">
      <div className="mx-auto flex max-w-[var(--ds-layout-max-wide)] flex-col gap-[var(--ds-space-40)]">
        <header className="flex flex-col gap-[var(--ds-space-8)] text-center">
          <h1 className="text-[length:var(--ds-type-40)] font-semibold text-[color:var(--ds-color-ink)]">
            Decouple
          </h1>
          <p className="text-[length:var(--ds-type-17)] leading-[1.6] text-[color:var(--ds-color-text-sub)]">
            The complete settlement workspace for separating couples is under active rebuild. The marketing surface is coming back in slice <code>S-M1</code> once the new design system lands.
          </p>
        </header>

        <section
          aria-label="Phase navigation demo (S-F3)"
          className="flex flex-col gap-[var(--ds-space-24)]"
        >
          <h2 className="text-[length:var(--ds-type-21)] font-medium text-[color:var(--ds-color-ink)]">
            Phase nav demo (S-F3)
          </h2>

          <PhaseStepper currentPhase="build" phases={phases} />

          <div className="grid grid-cols-1 gap-[var(--ds-space-24)] md:grid-cols-[280px_1fr]">
            <JourneyMapRail
              currentPhase="build"
              phases={phases}
              currentSubitems={sampleSubitems}
            />
            <LockedSection gate="reconcile" title="Reconcile your finances">
              <p className="text-[length:var(--ds-type-15-5)] text-[color:var(--ds-color-text-sub)]">
                Once you and Mark share your pictures, you&apos;ll work through any differences here.
              </p>
            </LockedSection>
          </div>
        </section>

        <section
          aria-label="Trust chip demo (S-F4)"
          className="flex flex-col gap-[var(--ds-space-24)]"
        >
          <h2 className="text-[length:var(--ds-type-21)] font-medium text-[color:var(--ds-color-ink)]">
            Trust chip demo (S-F4)
          </h2>
          <p className="text-[length:var(--ds-type-15-5)] text-[color:var(--ds-color-text-sub)]">
            Six trust levels, two with locked visual treatment per 68f C-T1
            (amber self-declared + green bank-evidenced); four pending Phase C
            anchor extraction.
          </p>
          <div className="flex flex-wrap items-center gap-[var(--ds-space-8)]">
            {TRUST_LEVELS.map((level) => (
              <TrustChip
                key={level}
                level={level}
                {...(level === 'bank-evidenced'
                  ? { sourceLabel: 'Verified from Barclays xxxx2323' }
                  : {})}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
