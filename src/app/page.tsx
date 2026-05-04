import type { Metadata } from 'next'
import {
  PhaseStepper,
  JourneyMapRail,
  LockedSection,
  buildPhasesData,
} from '@/components/phase-nav'
import { TrustChip, TRUST_LEVELS } from '@/components/trust'
import { DocumentShell } from '@/components/document-shell'

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

        <section
          aria-label="Document shell demo (S-F2)"
          className="flex flex-col gap-[var(--ds-space-24)]"
        >
          <h2 className="text-[length:var(--ds-type-21)] font-medium text-[color:var(--ds-color-ink)]">
            Document shell demo (S-F2)
          </h2>
          <p className="text-[length:var(--ds-type-15-5)] text-[color:var(--ds-color-text-sub)]">
            Three-column shell every document renders into (Sarah&apos;s
            Picture, Our Household Picture, Settlement Proposal). Stub content
            below; document slices ship the section bodies.
          </p>

          <PhaseStepper currentPhase="build" phases={phases} />

          <div className="rounded border border-[color:var(--ds-color-divider)]">
            <DocumentShell
              title="Sarah&rsquo;s Picture"
              state="draft"
              autosaveStamp="Autosaved · 2 min ago"
              bodyAs="section"
              leftRail={
                <div className="flex flex-col gap-3">
                  <p className="text-xs uppercase tracking-wide text-neutral-500">
                    In this document
                  </p>
                  <p className="text-sm font-semibold">25% complete</p>
                  <ul className="flex flex-col gap-2 text-sm">
                    <li>✓ The children</li>
                    <li>! The home</li>
                    <li>• Pensions</li>
                    <li>○ Income</li>
                  </ul>
                </div>
              }
              body={
                <div className="flex flex-col gap-3">
                  <h3 className="text-base font-semibold">
                    §1 · The children — Amelia (8), Jack (5)
                  </h3>
                  <p className="text-sm leading-relaxed">
                    A structured record of what you own, owe, earn and spend,
                    as of 4 May 2026. Based on 412 transactions across 12
                    months from your connected accounts, plus items
                    you&apos;ve added yourself.
                  </p>
                  <p className="text-sm leading-relaxed">
                    Amelia and Jack are with you during the week, with Mark on
                    alternate weekends and half of school holidays.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span>Child benefit</span>
                    <TrustChip
                      level="bank-evidenced"
                      sourceLabel="Verified from Halifax"
                    />
                    <span className="ml-auto">£165.40 / month</span>
                  </div>
                </div>
              }
              rightRail={
                <div className="flex flex-col gap-3">
                  <div className="rounded border p-3">
                    <p className="text-xs uppercase tracking-wide text-neutral-500">
                      Snapshot
                    </p>
                    <p className="mt-1 text-sm">Net position · £142,300</p>
                    <p className="text-sm">Assets · £218,500</p>
                    <p className="text-sm">Debts · £76,200</p>
                    <p className="text-sm">Monthly gap · -£420</p>
                  </div>
                  <div className="rounded border p-3">
                    <p className="text-xs uppercase tracking-wide text-neutral-500">
                      Data sources
                    </p>
                    <p className="mt-1 text-sm">Halifax · 1 day ago</p>
                    <p className="text-sm">NHS Pensions · Pending</p>
                  </div>
                  <div className="rounded border p-3">
                    <p className="text-xs uppercase tracking-wide text-neutral-500">
                      Needs your attention
                    </p>
                    <p className="mt-1 text-sm">Upload SA302 (last tax year)</p>
                    <p className="text-sm">Confirm Vanguard ISA balance</p>
                  </div>
                </div>
              }
            />
          </div>
        </section>
      </div>
    </main>
  )
}
