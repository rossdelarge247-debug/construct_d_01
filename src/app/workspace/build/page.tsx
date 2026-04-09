'use client'

import { useState, useEffect } from 'react'
import { WorkspaceLayout } from '@/components/workspace/workspace-layout'
import { PageTabs } from '@/components/workspace/page-tabs'
import { CategoryTabs } from '@/components/workspace/category-tabs'
import { CategoryContent } from '@/components/workspace/category-content'
import { SummaryTab } from '@/components/workspace/summary-tab'
import { ManualEntryModal } from '@/components/workspace/manual-entry-modal'
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

function getReadinessLabel(progress: number) {
  for (let i = READINESS_MILESTONES.length - 1; i >= 0; i--) {
    if (progress >= READINESS_MILESTONES[i].threshold) return READINESS_MILESTONES[i]
  }
  return READINESS_MILESTONES[0]
}

const DEFAULT_CATEGORIES = ['current_account', 'savings', 'property', 'pensions', 'debts', 'other_income', 'other_assets', 'outgoings']

export default function BuildYourPicturePage() {
  const { items, addItem, removeItem, summary, readiness, spending, setSpending, loaded } = useWorkspace()

  // Page-level tab
  const [pageTab, setPageTab] = useState<'preparation' | 'summary'>('preparation')

  // Category tab (component-level, inside preparation)
  const [activeCategory, setActiveCategory] = useState('current_account')

  // Manual entry modal
  const [showManualEntry, setShowManualEntry] = useState(false)

  // First-time how-it-works
  const [showHowItWorks, setShowHowItWorks] = useState(true)
  useEffect(() => {
    if (localStorage.getItem('how_it_works_dismissed') === 'true') setShowHowItWorks(false)
  }, [])
  const dismissHowItWorks = () => {
    setShowHowItWorks(false)
    localStorage.setItem('how_it_works_dismissed', 'true')
  }

  // Readiness
  const progress = readiness.progress
  const milestone = getReadinessLabel(progress)
  const animatedProgress = useCountUp(progress, 800)

  if (!loaded) return (
    <WorkspaceLayout activePhase="build_your_picture">
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cream-dark border-t-warmth" />
      </div>
    </WorkspaceLayout>
  )

  return (
    <WorkspaceLayout activePhase="build_your_picture">
      {/* ── Navigation header ── */}
      <div className="border-b-[var(--border-card)] border-cream-dark bg-cream-dark/40 px-6 py-3 md:px-10">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/workspace" className="text-sm font-semibold text-ink-light hover:text-ink transition-colors">
            ← Back to workspace
          </Link>
        </div>
      </div>

      <div className="px-6 md:px-10">
        <div className="mx-auto max-w-4xl space-y-6 py-6">

          {/* ── Title panel (terracotta) ── */}
          <div className="relative rounded-[var(--radius-lg)] bg-warmth p-7 shadow-[var(--shadow-md)] overflow-hidden">
            <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
              Build your picture
            </h1>
            <p className="mt-1.5 text-sm text-white/80 leading-relaxed">
              Bring everything together — finances, property, pensions. Upload documents and we do the heavy lifting.
            </p>

            {/* Progress bar along bottom edge */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5">
              <div className="h-full w-full bg-warmth-dark/30">
                <div
                  className={cn('h-full transition-all duration-700 ease-out', milestone.colour)}
                  style={{ width: `${animatedProgress}%` }}
                />
              </div>
            </div>

            {progress > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs font-bold text-white/60">{animatedProgress}%</span>
                <span className="text-xs text-white/40">·</span>
                <span className="text-xs font-semibold text-white/70">{milestone.label}</span>
              </div>
            )}
          </div>

          {/* ── Page-level tabs ── */}
          <PageTabs active={pageTab} onChange={setPageTab} />

          {/* ── PREPARATION TAB ── */}
          {pageTab === 'preparation' && (
            <div className="space-y-6">

              {/* How this works — first visit */}
              {showHowItWorks && items.length === 0 && (
                <div className="relative rounded-[var(--radius-lg)] border-[var(--border-card)] border-teal-light bg-teal-light/30 p-6">
                  <button onClick={dismissHowItWorks} className="absolute top-4 right-4 text-teal-dark/40 hover:text-teal-dark text-lg">✕</button>
                  <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-teal-dark">How this works</p>
                  <div className="mt-4 grid gap-5 sm:grid-cols-3">
                    {[
                      { n: '1', text: 'Upload a document — we read, extract, and categorise everything' },
                      { n: '2', text: 'Review what we found and confirm with a few taps' },
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

              {/* Upload/work component with category tabs */}
              <div className="rounded-[var(--radius-lg)] border-[var(--border-card)] border-cream-dark bg-surface shadow-[var(--shadow-sm)] overflow-hidden">
                {/* Category tabs (component-level) */}
                <CategoryTabs
                  activeTab={activeCategory}
                  onTabChange={setActiveCategory}
                  items={items}
                  visibleCategories={DEFAULT_CATEGORIES}
                />

                {/* Category content */}
                <div className="px-6 pb-6">
                  <CategoryContent
                    categoryKey={activeCategory}
                    items={items}
                    onAddItem={addItem}
                    onRemoveItem={removeItem}
                    onOpenManualEntry={() => setShowManualEntry(true)}
                    setSpending={setSpending}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── SUMMARY TAB ── */}
          {pageTab === 'summary' && (
            <SummaryTab
              items={items}
              spending={spending}
              onEditItem={(id) => {
                // Switch to preparation and find the item's category
                const item = items.find(i => i.id === id)
                if (item) {
                  setActiveCategory(item.subcategory || item.category)
                  setPageTab('preparation')
                }
              }}
              onSwitchToPreparation={() => setPageTab('preparation')}
            />
          )}

        </div>
      </div>

      {/* Manual entry modal */}
      <ManualEntryModal
        isOpen={showManualEntry}
        onClose={() => setShowManualEntry(false)}
        onSave={(item) => { addItem(item); setShowManualEntry(false) }}
        defaultCategory={activeCategory}
      />
    </WorkspaceLayout>
  )
}
