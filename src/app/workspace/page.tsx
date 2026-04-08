'use client'

import { WorkspaceLayout } from '@/components/workspace/workspace-layout'
import { LiveSummary } from '@/components/workspace/financial-summary'
import { ReadinessBar } from '@/components/workspace/readiness-bar'
import { Button } from '@/components/ui/button'
import { useWorkspace } from '@/hooks/use-workspace'
import { useStaggeredReveal } from '@/hooks/use-staggered-reveal'
import { CATEGORY_PRIORITY } from '@/types/workspace'
import { cn } from '@/utils/cn'
import Link from 'next/link'

export default function WorkspacePage() {
  const { items, summary, readiness, documents } = useWorkspace()

  const isEmpty = items.length === 0 && documents.length === 0
  const categories = CATEGORY_PRIORITY.slice(0, 9) // main categories

  // Stagger category cards on load
  const visibleCards = useStaggeredReveal(isEmpty ? 0 : categories.length, { initialDelay: 200, staggerDelay: 80 })

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
              This is where everything comes together. One document can tell us a lot — let&apos;s start with the one that matters most.
            </p>
          ) : (
            <p className="mt-2 text-sm text-ink-light leading-relaxed">
              Your picture is taking shape.
              {summary.items_to_review > 0
                ? ` ${summary.items_to_review} item${summary.items_to_review > 1 ? 's' : ''} need${summary.items_to_review === 1 ? 's' : ''} your review.`
                : ' Keep adding to make it stronger.'}
            </p>
          )}
        </div>

        {/* ── EMPTY STATE ── */}
        {isEmpty && (
          <div className="space-y-6">
            {/* Primary upload prompt */}
            <div className="rounded-[var(--radius-md)] border border-cream-dark p-6 space-y-4">
              <div>
                <p className="text-sm font-medium text-ink">
                  Start with your main bank account
                </p>
                <p className="mt-1 text-sm text-ink-light leading-relaxed">
                  This one document gives us your income and a full spending breakdown. Download 12 months as a PDF from your online banking.
                </p>
              </div>

              <Link href="/workspace/picture">
                <Button className="w-full sm:w-auto">Upload your first document</Button>
              </Link>

              <div className="flex items-center gap-4 text-sm">
                <Link href="/workspace/picture/manual" className="text-warmth-dark hover:text-warmth transition-colors">
                  I&apos;d rather enter details myself
                </Link>
              </div>
            </div>

            {/* What we already know */}
            <div className="rounded-[var(--radius-md)] border border-cream-dark p-5 space-y-3">
              <h3 className="text-xs font-medium uppercase tracking-wide text-ink-faint">What we know from your plan</h3>
              <div className="space-y-2">
                <p className="flex items-center justify-between text-sm">
                  <span className="text-ink-light">Income</span>
                  <span className="text-ink-faint">~£3,200/mo <span className="text-[10px]">(estimated)</span></span>
                </p>
                <p className="flex items-center justify-between text-sm">
                  <span className="text-ink-light">Property</span>
                  <span className="text-ink-faint">Own jointly <span className="text-[10px]">(value unknown)</span></span>
                </p>
                <p className="flex items-center justify-between text-sm">
                  <span className="text-ink-light">Pension</span>
                  <span className="text-ink-faint">Unknown</span>
                </p>
              </div>
              <p className="text-xs text-ink-faint">These will be replaced with real figures as you add evidence.</p>
            </div>

            {/* What's ahead */}
            <div className="rounded-[var(--radius-md)] border border-cream-dark p-5 space-y-3">
              <h3 className="text-xs font-medium uppercase tracking-wide text-ink-faint">How this works</h3>
              <div className="space-y-3">
                <p className="flex items-start gap-3 text-sm text-ink-light">
                  <span className="mt-0.5 text-warmth shrink-0">1</span>
                  Upload a document — we read it, extract the numbers, and categorise everything
                </p>
                <p className="flex items-start gap-3 text-sm text-ink-light">
                  <span className="mt-0.5 text-warmth shrink-0">2</span>
                  You review what we found and confirm or correct
                </p>
                <p className="flex items-start gap-3 text-sm text-ink-light">
                  <span className="mt-0.5 text-warmth shrink-0">3</span>
                  Your financial picture builds up section by section
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── ACTIVE STATE ── */}
        {!isEmpty && (
          <div className="space-y-6">
            {/* Upload more — compact */}
            <Link href="/workspace/picture" className="block">
              <div className="rounded-[var(--radius-md)] border-2 border-dashed border-cream-dark p-4 text-center transition-all duration-200 hover:border-ink-faint hover:bg-cream-dark/10">
                <p className="text-sm text-ink-light">
                  <span className="text-warmth-dark font-medium">Upload more documents</span> — or <Link href="/workspace/picture/manual" className="text-warmth-dark underline decoration-warmth-light hover:decoration-warmth">enter manually</Link>
                </p>
              </div>
            </Link>

            {/* Live summary */}
            <LiveSummary summary={summary} />

            {/* Category cards — staggered reveal */}
            <div className="space-y-3">
              <h3 className="text-xs font-medium uppercase tracking-wide text-ink-faint">Your categories</h3>

              <div className="grid gap-3 sm:grid-cols-2">
                {categories.map((cat, i) => {
                  const catItems = items.filter(item =>
                    item.category === cat.key || item.subcategory === cat.key ||
                    (cat.key === 'current_account' && (item.category === 'income' || item.subcategory === 'current_account'))
                  )
                  const hasContent = catItems.length > 0
                  const isNext = nextCategory?.key === cat.key
                  const totalValue = catItems.filter(item => item.value !== null).reduce((sum, item) => sum + item.value!, 0)
                  const confirmed = catItems.filter(item => item.status === 'confirmed').length
                  const toReview = catItems.filter(item => item.status === 'to_review').length

                  return (
                    <Link
                      key={cat.key}
                      href={`/workspace/picture/${cat.key}`}
                      className={cn(
                        'rounded-[var(--radius-md)] border p-4 transition-all duration-300',
                        // Stagger animation
                        i < visibleCards ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
                        // State styling
                        hasContent ? 'border-cream-dark hover:shadow-[var(--shadow-sm)] hover:-translate-y-0.5' :
                        isNext ? 'border-warmth/40 bg-warmth-light/5 hover:bg-warmth-light/10' :
                        'border-cream-dark hover:border-ink-faint',
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <p className={cn('text-sm font-medium', hasContent ? 'text-ink' : 'text-ink-light')}>{cat.label}</p>
                        {hasContent ? (
                          <span className="flex items-center gap-1 text-xs text-sage">
                            <span className="h-1.5 w-1.5 rounded-full bg-sage" />
                            {confirmed} confirmed
                          </span>
                        ) : isNext ? (
                          <span className="text-xs text-warmth-dark">Suggested</span>
                        ) : (
                          <span className="text-xs text-ink-faint">—</span>
                        )}
                      </div>

                      {hasContent ? (
                        <p className="mt-1 text-xs text-ink-light tabular-nums">
                          {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(totalValue)}
                          {toReview > 0 && <span className="ml-2 text-amber">· {toReview} to review</span>}
                        </p>
                      ) : (
                        <p className="mt-1 text-xs text-ink-faint">{cat.description}</p>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Readiness */}
            <ReadinessBar readiness={readiness} />

            {/* What to do next — just one thing */}
            {nextCategory && (
              <div className="rounded-[var(--radius-md)] border border-cream-dark p-5 space-y-2">
                <h3 className="text-xs font-medium uppercase tracking-wide text-ink-faint">Focus on next</h3>
                <p className="text-sm text-ink">
                  <span className="font-medium">{nextCategory.label}</span> — {nextCategory.description.toLowerCase()}
                </p>
                <p className="text-xs text-ink-faint">Best document: {nextCategory.idealDocs}</p>
              </div>
            )}

            {/* V3 transition prompt — only when ready */}
            {readiness.level === 'first_draft' && (
              <div className="rounded-[var(--radius-md)] border border-sage-light bg-sage-light/20 p-5 space-y-2">
                <p className="text-sm font-medium text-ink">Your picture is ready to share</p>
                <p className="text-xs text-ink-light leading-relaxed">
                  You have enough for an initial conversation with a mediator or solicitor. When you&apos;re ready, the next phase helps you prepare for formal disclosure.
                </p>
                <Button variant="secondary" size="sm">Prepare for disclosure</Button>
              </div>
            )}
          </div>
        )}
      </div>
    </WorkspaceLayout>
  )
}
