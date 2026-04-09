'use client'

import { WorkspaceLayout } from '@/components/workspace/workspace-layout'
import { Button } from '@/components/ui/button'
import { useWorkspace } from '@/hooks/use-workspace'
import { cn } from '@/utils/cn'
import Link from 'next/link'
import type { WorkspacePhase } from '@/types'

interface FuturePhasePageProps {
  phase: WorkspacePhase
  title: string
  subtitle: string
  whatHappens: string[]
  whatYouNeed: string[]
  howWeHelp: string[]
  emergingData?: { label: string; value: string }[]
  upsellTier?: 'standard' | 'enhanced'
}

export function FuturePhasePage({
  phase,
  title,
  subtitle,
  whatHappens,
  whatYouNeed,
  howWeHelp,
  emergingData,
  upsellTier,
}: FuturePhasePageProps) {
  const { readiness } = useWorkspace()

  return (
    <WorkspaceLayout activePhase={phase}>
      {/* Nav header */}
      <div className="border-b-[var(--border-card)] border-cream-dark bg-cream-dark/40 px-6 py-3 md:px-10">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/workspace" className="text-sm font-semibold text-ink-light hover:text-ink transition-colors">
            ← Back to workspace
          </Link>
        </div>
      </div>

      <div className="px-6 md:px-10">
        <div className="mx-auto max-w-4xl space-y-8 py-8">

          {/* Title panel — teal for future phases (not warmth — that's for the active phase) */}
          <div className="rounded-[var(--radius-lg)] bg-teal p-7 shadow-[var(--shadow-md)]">
            <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
              {title}
            </h1>
            <p className="mt-1.5 text-sm text-white/80 leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* What happens here */}
          <div className="rounded-[var(--radius-lg)] border-[var(--border-card)] border-cream-dark bg-surface p-7 shadow-[var(--shadow-sm)]">
            <h2 className="text-lg font-bold text-ink">What happens in this phase</h2>
            <ul className="mt-4 space-y-3">
              {whatHappens.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-light text-xs font-bold text-teal-dark">✓</span>
                  <span className="text-sm text-ink-light leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What you need first */}
          <div className="rounded-[var(--radius-lg)] border-[var(--border-card)] border-cream-dark border-l-[var(--border-accent)] border-l-amber bg-surface p-7 shadow-[var(--shadow-sm)]">
            <h2 className="text-lg font-bold text-ink">What you need first</h2>
            <ul className="mt-4 space-y-3">
              {whatYouNeed.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-light text-xs font-bold text-amber">○</span>
                  <span className="text-sm text-ink-light leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>

            {/* Live readiness from V2 */}
            <div className="mt-5 rounded-[var(--radius-md)] bg-cream-dark/30 p-4">
              <p className="text-sm text-ink">
                <span className="font-bold">Your readiness:</span> {readiness.label} ({readiness.progress}%)
              </p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-cream-dark">
                <div className="h-full rounded-full bg-warmth transition-all duration-500" style={{ width: `${readiness.progress}%` }} />
              </div>
            </div>
          </div>

          {/* Emerging data from earlier phases */}
          {emergingData && emergingData.length > 0 && (
            <div className="rounded-[var(--radius-lg)] border-[var(--border-card)] border-cream-dark border-l-[var(--border-accent)] border-l-teal bg-teal-light/30 p-7">
              <h2 className="text-lg font-bold text-ink">What we know so far</h2>
              <p className="mt-1 text-sm text-ink-faint">From your financial picture — this data will feed into this phase.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {emergingData.map((item, i) => (
                  <div key={i} className="rounded-[var(--radius-md)] bg-surface p-4 border-[var(--border-card)] border-cream-dark">
                    <p className="text-xs text-ink-faint">{item.label}</p>
                    <p className="mt-1 text-base font-bold text-ink">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* How the service helps */}
          <div className="rounded-[var(--radius-lg)] border-[var(--border-card)] border-cream-dark border-l-[var(--border-accent)] border-l-warmth bg-warmth-light/20 p-7">
            <h2 className="text-lg font-bold text-ink">How we help at this stage</h2>
            <ul className="mt-4 space-y-3">
              {howWeHelp.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 text-warmth font-bold">→</span>
                  <span className="text-sm text-ink leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            {upsellTier === 'enhanced' && (
              <div className="mt-4 rounded-[var(--radius-md)] bg-warmth/10 p-3">
                <p className="text-xs font-bold text-warmth-dark">Enhanced plan feature</p>
                <p className="mt-1 text-xs text-ink-light">This phase includes features available on the Enhanced plan.</p>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/workspace/build">
              <Button>Continue building your picture</Button>
            </Link>
            <Link href="/workspace" className="text-sm font-semibold text-ink-light hover:text-ink transition-colors">
              Back to workspace
            </Link>
          </div>

        </div>
      </div>
    </WorkspaceLayout>
  )
}
