'use client'

import { WorkspaceLayout } from '@/components/workspace/workspace-layout'
import { LiveSummary } from '@/components/workspace/financial-summary'
import { ReadinessBar } from '@/components/workspace/readiness-bar'
import { Button } from '@/components/ui/button'
import { useWorkspace } from '@/hooks/use-workspace'
import { CATEGORY_PRIORITY } from '@/types/workspace'
import { cn } from '@/utils/cn'
import Link from 'next/link'

export default function WorkspacePage() {
  const { items, summary, readiness, documents } = useWorkspace()

  const isEmpty = items.length === 0 && documents.length === 0

  // Determine which categories have items
  const categoriesWithItems = new Set(items.map(i => `${i.category}-${i.subcategory}`))

  // Find next suggested category
  const nextCategory = CATEGORY_PRIORITY.find(cat => {
    const hasItems = items.some(i =>
      i.category === cat.key || i.subcategory === cat.key ||
      (cat.key === 'current_account' && i.category === 'income')
    )
    return !hasItems
  })

  return (
    <WorkspaceLayout activePhase="build_your_picture">
      <div className="space-y-6">
        {/* Phase header */}
        <div>
          <h1 className="font-heading text-2xl font-medium text-ink">Build your picture</h1>
          {isEmpty ? (
            <p className="mt-2 text-sm text-ink-light leading-relaxed">
              This is where you bring everything together. Start by uploading any financial documents — we&apos;ll do the rest.
            </p>
          ) : (
            <p className="mt-2 text-sm text-ink-light leading-relaxed">
              Your financial picture is taking shape. {summary.items_to_review > 0 ? `${summary.items_to_review} items need your review.` : 'Keep adding to strengthen it.'}
            </p>
          )}
        </div>

        {/* Empty state — first time */}
        {isEmpty && (
          <div className="space-y-6">
            {/* Guided first upload */}
            <div className="rounded-[var(--radius-md)] border border-cream-dark p-6 space-y-4">
              <div>
                <p className="text-sm font-medium text-ink">
                  Start with your current account statement
                </p>
                <p className="mt-1 text-sm text-ink-light leading-relaxed">
                  This gives us your income and spending in one go. Download 12 months as a PDF from your online banking.
                </p>
              </div>

              <div className="rounded-[var(--radius-md)] border-2 border-dashed border-cream-dark bg-cream-dark/20 p-8 text-center">
                <p className="text-sm text-ink-faint">Drop your bank statement here</p>
                <Button variant="secondary" className="mt-3">Choose files</Button>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <Link href="/workspace/picture/manual" className="text-warmth-dark hover:text-warmth transition-colors">
                  Start without documents
                </Link>
                <span className="text-ink-faint">·</span>
                <button type="button" className="text-ink-light hover:text-ink transition-colors">
                  Upload multiple documents
                </button>
              </div>
            </div>

            {/* V1 data carried forward */}
            <div className="rounded-[var(--radius-md)] border border-cream-dark p-5 space-y-3">
              <h3 className="text-xs font-medium uppercase tracking-wide text-ink-faint">From your plan</h3>
              <div className="space-y-2">
                <p className="flex items-center justify-between text-sm">
                  <span className="text-ink-light">Income</span>
                  <span className="text-ink-faint">~£3,200/mo (estimated)</span>
                </p>
                <p className="flex items-center justify-between text-sm">
                  <span className="text-ink-light">Property</span>
                  <span className="text-ink-faint">Own jointly (value unknown)</span>
                </p>
                <p className="flex items-center justify-between text-sm">
                  <span className="text-ink-light">Pension</span>
                  <span className="text-ink-faint">Unknown</span>
                </p>
              </div>
              <p className="text-xs text-ink-faint">These estimates from your plan will be updated as you add evidence.</p>
            </div>
          </div>
        )}

        {/* Active state — has items */}
        {!isEmpty && (
          <div className="space-y-6">
            {/* Upload more */}
            <div className="rounded-[var(--radius-md)] border-2 border-dashed border-cream-dark bg-cream-dark/10 p-4 text-center">
              <Button variant="secondary" size="sm">Upload more documents</Button>
            </div>

            {/* Live summary */}
            <LiveSummary summary={summary} />

            {/* Category cards */}
            <div className="space-y-3">
              <h3 className="text-xs font-medium uppercase tracking-wide text-ink-faint">Categories</h3>

              <div className="grid gap-3 sm:grid-cols-2">
                {CATEGORY_PRIORITY.slice(0, 9).map(cat => {
                  const catItems = items.filter(i =>
                    i.category === cat.key || i.subcategory === cat.key ||
                    (cat.key === 'current_account' && (i.category === 'income' || i.subcategory === 'current_account'))
                  )
                  const hasContent = catItems.length > 0
                  const isNext = nextCategory?.key === cat.key
                  const totalValue = catItems.filter(i => i.value !== null).reduce((sum, i) => sum + i.value!, 0)
                  const confirmed = catItems.filter(i => i.status === 'confirmed').length
                  const toReview = catItems.filter(i => i.status === 'to_review').length

                  return (
                    <Link
                      key={cat.key}
                      href={`/workspace/picture/${cat.key}`}
                      className={cn(
                        'rounded-[var(--radius-md)] border p-4 transition-all duration-200 hover:shadow-[var(--shadow-sm)]',
                        isNext && !hasContent ? 'border-warmth bg-warmth-light/10' : 'border-cream-dark',
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-ink">{cat.label}</p>
                        {hasContent ? (
                          <span className="text-xs text-sage">{confirmed} confirmed</span>
                        ) : isNext ? (
                          <span className="text-xs text-warmth-dark">Suggested next</span>
                        ) : (
                          <span className="text-xs text-ink-faint">Not started</span>
                        )}
                      </div>
                      {hasContent && totalValue > 0 && (
                        <p className="mt-1 text-xs text-ink-light">
                          {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(totalValue)}
                          {toReview > 0 && <span className="ml-2 text-amber">· {toReview} to review</span>}
                        </p>
                      )}
                      {!hasContent && (
                        <p className="mt-1 text-xs text-ink-faint">{cat.description}</p>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Readiness */}
            <ReadinessBar readiness={readiness} />

            {/* What to do next */}
            {nextCategory && (
              <div className="rounded-[var(--radius-md)] border border-cream-dark p-5 space-y-2">
                <h3 className="text-xs font-medium uppercase tracking-wide text-ink-faint">What to do next</h3>
                <p className="text-sm text-ink">
                  <span className="text-warmth">→</span> {nextCategory.label}: {nextCategory.description}
                </p>
                <p className="text-xs text-ink-faint">Ideal documents: {nextCategory.idealDocs}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </WorkspaceLayout>
  )
}
