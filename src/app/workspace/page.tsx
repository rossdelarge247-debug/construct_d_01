'use client'

import { WorkspaceLayout } from '@/components/workspace/workspace-layout'
import { Button } from '@/components/ui/button'
import { useWorkspace } from '@/hooks/use-workspace'
import { useCountUp } from '@/hooks/use-count-up'
import { cn } from '@/utils/cn'
import Link from 'next/link'

const PHASES = [
  { key: 'build', label: 'Build your picture', href: '/workspace/build', description: 'Upload documents, capture your financial position, track what you know and what you need.' },
  { key: 'disclose', label: 'Share & disclose', href: '/workspace/disclose', description: 'Prepare your disclosure and exchange financial information with the other party.' },
  { key: 'negotiate', label: 'Work through it', href: '/workspace/negotiate', description: 'Track proposals, counter-proposals, and mediation progress.' },
  { key: 'agree', label: 'Reach agreement', href: '/workspace/agree', description: 'Resolve remaining points and capture the final agreed position.' },
  { key: 'finalise', label: 'Make it official', href: '/workspace/finalise', description: 'Prepare consent order, D81, and court documents.' },
]

function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const display = useCountUp(value)
  return <span className={className}>{new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(display)}</span>
}

export default function WorkspaceHomePage() {
  const { items, summary, readiness, loaded } = useWorkspace()
  const hasData = items.length > 0

  if (!loaded) return (
    <WorkspaceLayout activePhase={null}>
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cream-dark border-t-warmth" />
      </div>
    </WorkspaceLayout>
  )

  return (
    <WorkspaceLayout activePhase={null}>
      <div className="px-6 py-8 md:px-10 md:py-10">
        <div className="mx-auto max-w-4xl space-y-10">

          {/* Welcome */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-ink">
              {hasData ? 'Welcome back' : 'Welcome to your workspace'}
            </h1>
            <p className="mt-2 text-base text-ink-light">
              {hasData
                ? 'Here\'s where things stand across your separation journey.'
                : 'Everything from your plan is here. Let\'s start building the detail.'}
            </p>
          </div>

          {/* Journey progress — horizontal */}
          <div className="rounded-[var(--radius-lg)] border-[var(--border-card)] border-cream-dark bg-surface p-6 shadow-[var(--shadow-sm)]">
            <div className="flex items-center justify-between">
              {PHASES.map((phase, i) => (
                <div key={phase.key} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-colors',
                      i === 0 ? 'bg-warmth text-white' : 'bg-cream-dark text-ink-faint',
                    )}>
                      {i + 1}
                    </div>
                    <p className={cn(
                      'mt-2 text-center text-xs font-semibold',
                      i === 0 ? 'text-warmth-dark' : 'text-ink-faint',
                    )}>
                      {phase.label}
                    </p>
                  </div>
                  {i < PHASES.length - 1 && (
                    <div className={cn(
                      'mx-2 h-0.5 flex-1',
                      i === 0 ? 'bg-warmth/30' : 'bg-cream-dark',
                    )} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Two-column: Next step + Financial snapshot */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Next step */}
            <div className="rounded-[var(--radius-lg)] border-[var(--border-card)] border-cream-dark border-l-[var(--border-accent)] border-l-warmth bg-surface p-6 shadow-[var(--shadow-sm)]">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-warmth-dark">Your next step</p>
              <h2 className="mt-3 text-xl font-bold text-ink">
                {hasData ? 'Continue building your picture' : 'Upload your first document'}
              </h2>
              <p className="mt-2 text-sm text-ink-light leading-relaxed">
                {hasData
                  ? 'You have items captured but there\'s more to add. Each document strengthens your position.'
                  : 'Start with your current account — one document gives us your income and spending.'}
              </p>
              <div className="mt-5">
                <Link href="/workspace/build">
                  <Button>Continue →</Button>
                </Link>
              </div>
            </div>

            {/* Financial snapshot */}
            <div className="rounded-[var(--radius-lg)] border-[var(--border-card)] border-cream-dark border-l-[var(--border-accent)] border-l-teal bg-surface p-6 shadow-[var(--shadow-sm)]">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-teal-dark">Financial snapshot</p>
              {hasData ? (
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-[11px] text-ink-faint">Assets</p>
                      <AnimatedNumber value={summary.total_assets} className="text-2xl font-extrabold tracking-tight text-ink" />
                    </div>
                    <div>
                      <p className="text-[11px] text-ink-faint">Liabilities</p>
                      <AnimatedNumber value={summary.total_liabilities} className="text-2xl font-extrabold tracking-tight text-ink" />
                    </div>
                    <div>
                      <p className="text-[11px] text-ink-faint">Net</p>
                      <AnimatedNumber value={summary.net_position} className={cn('text-2xl font-extrabold tracking-tight', summary.net_position >= 0 ? 'text-sage-dark' : 'text-warmth-dark')} />
                    </div>
                  </div>
                  <div className="pt-2">
                    <Link href="/workspace/build" className="text-sm font-semibold text-teal hover:text-teal-dark transition-colors">
                      View full picture →
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="mt-4">
                  <p className="text-sm text-ink-light">No financial data yet. Start building your picture to see your position here.</p>
                </div>
              )}
            </div>
          </div>

          {/* Phase cards */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-ink-faint">Your phases</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {PHASES.map((phase, i) => {
                const isActive = i === 0
                const isFuture = i > 0

                return (
                  <Link
                    key={phase.key}
                    href={phase.href}
                    className={cn(
                      'rounded-[var(--radius-lg)] border-[var(--border-card)] p-6 transition-all duration-200',
                      isActive && 'border-warmth bg-surface shadow-[var(--shadow-sm)] border-l-[var(--border-accent)] border-l-warmth hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5',
                      isFuture && 'border-cream-dark bg-cream-dark/30 hover:bg-cream-dark/50 hover:border-ink-faint',
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-ink">{phase.label}</h3>
                        <p className="mt-1 text-sm text-ink-light leading-relaxed">{phase.description}</p>
                      </div>
                      <div className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                        isActive && 'bg-warmth text-white',
                        isFuture && 'bg-cream-dark text-ink-faint',
                      )}>
                        {i + 1}
                      </div>
                    </div>
                    {isActive && (
                      <div className="mt-4">
                        <p className="text-sm font-semibold text-warmth-dark">
                          {hasData ? `${summary.categories_started} categories started · ${summary.items_confirmed + summary.items_estimated} items` : 'Not started yet'}
                        </p>
                      </div>
                    )}
                    {isFuture && (
                      <p className="mt-3 text-xs font-semibold text-ink-faint">Learn more →</p>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Upload document', icon: '📎', href: '/workspace/build' },
              { label: 'Add manually', icon: '✎', href: '/workspace/build' },
              { label: 'Documents', icon: '📄', href: '#' },
              { label: 'Summary', icon: '📊', href: '#' },
            ].map(action => (
              <Link
                key={action.label}
                href={action.href}
                className="flex flex-col items-center gap-2 rounded-[var(--radius-md)] border-[var(--border-card)] border-cream-dark bg-surface p-5 text-center shadow-[var(--shadow-sm)] transition-all duration-150 hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <span className="text-2xl">{action.icon}</span>
                <span className="text-xs font-semibold text-ink-light">{action.label}</span>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </WorkspaceLayout>
  )
}
