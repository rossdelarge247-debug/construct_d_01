'use client'

import { useState, useEffect } from 'react'
import { WorkspaceLayout } from '@/components/workspace/workspace-layout'
import { CategoryTabs } from '@/components/workspace/category-tabs'
import { CategoryContent } from '@/components/workspace/category-content'
import { LiveSummary } from '@/components/workspace/financial-summary'
import { useWorkspace } from '@/hooks/use-workspace'
import { useCountUp } from '@/hooks/use-count-up'
import { cn } from '@/utils/cn'
import Link from 'next/link'

const READINESS_MILESTONES = [
  { threshold: 0, label: 'Getting started', colour: 'bg-cream-dark' },
  { threshold: 20, label: 'Taking shape', colour: 'bg-warmth' },
  { threshold: 55, label: 'Ready to share with a mediator', colour: 'bg-warmth' },
  { threshold: 80, label: 'Ready for formal disclosure', colour: 'bg-sage' },
  { threshold: 95, label: 'Complete', colour: 'bg-sage' },
]

function getReadinessLabel(progress: number): { label: string; colour: string } {
  for (let i = READINESS_MILESTONES.length - 1; i >= 0; i--) {
    if (progress >= READINESS_MILESTONES[i].threshold) return READINESS_MILESTONES[i]
  }
  return READINESS_MILESTONES[0]
}

// Default visible categories — adaptive based on user situation
const DEFAULT_CATEGORIES = ['current_account', 'savings', 'property', 'pensions', 'debts', 'other_income', 'other_assets', 'outgoings']

export default function BuildYourPicturePage() {
  const { items, addItem, removeItem, summary, readiness, spending, setSpending, loaded } = useWorkspace()
  const [activeTab, setActiveTab] = useState('current_account')
  const [showHowItWorks, setShowHowItWorks] = useState(true)

  // Check if "how it works" was dismissed
  useEffect(() => {
    const dismissed = localStorage.getItem('how_it_works_dismissed')
    if (dismissed === 'true') setShowHowItWorks(false)
  }, [])

  const dismissHowItWorks = () => {
    setShowHowItWorks(false)
    localStorage.setItem('how_it_works_dismissed', 'true')
  }

  const progress = readiness.progress
  const milestone = getReadinessLabel(progress)
  const animatedProgress = useCountUp(progress, 800)

  const handleOpenManualEntry = () => {
    // TODO: open modal — for now alert
    alert('Manual entry modal — coming soon')
  }

  if (!loaded) return (
    <WorkspaceLayout activePhase="build_your_picture">
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cream-dark border-t-warmth" />
      </div>
    </WorkspaceLayout>
  )

  return (
    <WorkspaceLayout activePhase="build_your_picture">
      {/* Top navigation bar — full width, thin, navigation only */}
      <div className="border-b-[var(--border-card)] border-cream-dark bg-cream-dark/40 px-6 py-3 md:px-10">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/workspace" className="text-sm font-semibold text-ink-light hover:text-ink transition-colors">
            ← Back to workspace
          </Link>
          {/* Future: profile, notifications, etc. */}
        </div>
      </div>

      <div className="px-6 md:px-10">
        <div className="mx-auto max-w-4xl">

          {/* Title panel — terracotta card, same width as content */}
          <div className="relative mt-6 rounded-[var(--radius-lg)] bg-warmth p-7 shadow-[var(--shadow-md)]">
            <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
              Build your picture
            </h1>
            <p className="mt-1.5 text-sm text-white/80 leading-relaxed">
              Bring everything together — finances, property, pensions. Upload documents and we do the heavy lifting.
            </p>

            {/* Progress bar along bottom edge */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 overflow-hidden rounded-b-[var(--radius-lg)]">
              <div className="h-full w-full bg-warmth-dark/30">
                <div
                  className={cn('h-full transition-all duration-700 ease-out rounded-r-full', milestone.colour)}
                  style={{ width: `${animatedProgress}%` }}
                />
              </div>
            </div>

            {/* Milestone label */}
            {progress > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs font-bold text-white/60">{animatedProgress}%</span>
                <span className="text-xs text-white/40">·</span>
                <span className="text-xs font-semibold text-white/70">{milestone.label}</span>
              </div>
            )}
          </div>

          {/* How this works — dismissable */}
          {showHowItWorks && items.length === 0 && (
            <div className="mt-6 rounded-[var(--radius-lg)] border-[var(--border-card)] border-teal-light bg-teal-light/40 p-6 relative">
              <button
                onClick={dismissHowItWorks}
                className="absolute top-4 right-4 text-teal-dark/50 hover:text-teal-dark text-lg leading-none"
              >
                ✕
              </button>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-teal-dark">How this works</p>
              <div className="mt-4 grid gap-5 sm:grid-cols-3">
                {[
                  { n: '1', text: 'Upload a document — we read it, extract the numbers, and categorise everything' },
                  { n: '2', text: 'Review what we found and confirm or correct' },
                  { n: '3', text: 'Your financial picture builds as you go' },
                ].map(step => (
                  <div key={step.n} className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal text-sm font-bold text-white">{step.n}</div>
                    <p className="text-sm text-ink-light leading-relaxed">{step.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tabbed work area */}
          <div className="mt-6 rounded-[var(--radius-lg)] border-[var(--border-card)] border-cream-dark bg-surface shadow-[var(--shadow-sm)] overflow-hidden">
            <CategoryTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              items={items}
              visibleCategories={DEFAULT_CATEGORIES}
            />
            <div className="px-6">
              <CategoryContent
                categoryKey={activeTab}
                items={items}
                onAddItem={addItem}
                onRemoveItem={removeItem}
                onOpenManualEntry={handleOpenManualEntry}
                setSpending={setSpending}
              />
            </div>
          </div>

          {/* Live financial picture */}
          <div className="mt-10 mb-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-ink-faint">Your financial picture</p>

            {items.length > 0 ? (
              <div className="mt-4 space-y-6">
                <LiveSummary summary={summary} />

                {/* Category summary grid */}
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { label: 'Income', items: items.filter(i => i.category === 'income') },
                    { label: 'Savings', items: items.filter(i => i.subcategory === 'savings' || i.subcategory === 'current_account') },
                    { label: 'Property', items: items.filter(i => i.category === 'property') },
                    { label: 'Pensions', items: items.filter(i => i.category === 'pension') },
                    { label: 'Debts', items: items.filter(i => i.category === 'liability' || i.subcategory === 'debt') },
                    { label: 'Outgoings', items: spending.length > 0 ? [{ id: 'spending' }] as never : [] },
                  ].map(cat => {
                    const hasItems = cat.items.length > 0
                    const totalValue = cat.items.filter((i: FinancialPictureItem) => i.value !== null).reduce((sum: number, i: FinancialPictureItem) => sum + (i.value || 0), 0)

                    return (
                      <button
                        key={cat.label}
                        onClick={() => {
                          const tabKey = cat.label.toLowerCase() === 'income' ? 'current_account' :
                            cat.label.toLowerCase() === 'savings' ? 'savings' :
                            cat.label.toLowerCase() === 'outgoings' ? 'outgoings' :
                            cat.label.toLowerCase()
                          setActiveTab(tabKey)
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        }}
                        className={cn(
                          'flex items-center justify-between rounded-[var(--radius-md)] border-[var(--border-card)] p-4 text-left transition-all hover:shadow-[var(--shadow-sm)]',
                          hasItems ? 'border-cream-dark bg-surface border-l-[var(--border-accent)] border-l-sage' : 'border-cream-dark bg-cream-dark/20',
                        )}
                      >
                        <span className={cn('text-sm font-semibold', hasItems ? 'text-ink' : 'text-ink-faint')}>{cat.label}</span>
                        {hasItems ? (
                          <span className="text-sm font-bold text-ink tabular-nums">
                            {cat.label === 'Outgoings'
                              ? `£${spending.reduce((s, c) => s + c.monthly_average, 0).toLocaleString()}/mo`
                              : `£${totalValue.toLocaleString()}`
                            }
                          </span>
                        ) : (
                          <span className="text-xs text-ink-faint">○</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-[var(--radius-lg)] border-[var(--border-card)] border-cream-dark bg-cream-dark/20 p-10 text-center">
                <p className="text-lg font-bold text-ink-light">Your picture will build here</p>
                <p className="mt-2 text-sm text-ink-faint leading-relaxed">
                  As you upload documents and add information above, your financial picture will take shape here — assets, liabilities, income, outgoings, all in one place.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </WorkspaceLayout>
  )
}

// Type import for the grid
import type { FinancialPictureItem } from '@/types/workspace'
