'use client'

import { WorkspaceLayout } from '@/components/workspace/workspace-layout'
import { LiveSummary } from '@/components/workspace/financial-summary'
import { ReadinessBar } from '@/components/workspace/readiness-bar'
import { DocumentChecklist } from '@/components/workspace/document-checklist'
import { Button } from '@/components/ui/button'
import { useWorkspace } from '@/hooks/use-workspace'
import { useStaggeredReveal } from '@/hooks/use-staggered-reveal'
import { CATEGORY_PRIORITY } from '@/types/workspace'
import { cn } from '@/utils/cn'
import Link from 'next/link'

const SIDEBAR_CATEGORIES = CATEGORY_PRIORITY.slice(0, 9).map(cat => ({
  label: cat.label,
  href: `/workspace/picture/${cat.key}`,
  status: 'pending' as const,
}))

export default function WorkspacePage() {
  const { items, summary, readiness, documents, spending } = useWorkspace()

  const isEmpty = items.length === 0 && documents.length === 0
  const categories = CATEGORY_PRIORITY.slice(0, 9)
  const visibleCards = useStaggeredReveal(isEmpty ? 0 : categories.length, { initialDelay: 200, staggerDelay: 80 })

  const nextCategory = CATEGORY_PRIORITY.find(cat => {
    const hasItems = items.some(i =>
      i.category === cat.key || i.subcategory === cat.key ||
      (cat.key === 'current_account' && i.category === 'income')
    )
    return !hasItems
  })

  return (
    <WorkspaceLayout
      activePhase="build_your_picture"
      phaseTitle="Build your picture"
      phaseSubtitle={isEmpty
        ? 'Start by uploading your main bank statement — one document tells us a lot'
        : `${summary.items_confirmed + summary.items_estimated} items captured · ${summary.categories_started} categories started`
      }
      sidebarSubItems={SIDEBAR_CATEGORIES}
    >
      <div className="space-y-8">

        {/* ── EMPTY STATE ── */}
        {isEmpty && (
          <div className="space-y-8">
            {/* Primary upload prompt — bold */}
            <div className="rounded-[var(--radius-lg)] bg-surface p-8 shadow-[var(--shadow-md)] border-l-[var(--border-accent)] border-warmth">
              <h2 className="text-xl font-semibold text-ink">
                Start with your main bank account
              </h2>
              <p className="mt-2 text-ink-light leading-relaxed">
                This one document gives us your income and a full spending breakdown. Download 12 months as a PDF from your online banking.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/workspace/picture">
                  <Button size="lg">Upload your first document</Button>
                </Link>
                <Link href="/workspace/picture/manual">
                  <Button variant="secondary" size="lg">I&apos;d rather enter details myself</Button>
                </Link>
              </div>
            </div>

            {/* What we know — from V1 */}
            <div className="rounded-[var(--radius-md)] bg-teal-light/50 p-6 border-l-[var(--border-accent)] border-teal">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-teal-dark">From your free plan</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-ink-faint">Income</p>
                  <p className="text-lg font-semibold text-ink">~£3,200/mo</p>
                  <p className="text-[10px] text-ink-faint">estimated</p>
                </div>
                <div>
                  <p className="text-xs text-ink-faint">Property</p>
                  <p className="text-lg font-semibold text-ink">Own jointly</p>
                  <p className="text-[10px] text-ink-faint">value unknown</p>
                </div>
                <div>
                  <p className="text-xs text-ink-faint">Pension</p>
                  <p className="text-lg font-semibold text-ink">Unknown</p>
                  <p className="text-[10px] text-ink-faint">needs attention</p>
                </div>
              </div>
              <p className="mt-4 text-xs text-teal-dark">These will be replaced with real figures as you add evidence.</p>
            </div>

            {/* How this works */}
            <div className="rounded-[var(--radius-md)] bg-surface p-6 shadow-[var(--shadow-sm)]">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-faint">How this works</h3>
              <div className="mt-4 grid gap-6 sm:grid-cols-3">
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-warmth text-sm font-bold text-white">1</div>
                  <p className="text-sm text-ink-light leading-relaxed">Upload a document — we read it, extract the numbers, and categorise everything</p>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-warmth text-sm font-bold text-white">2</div>
                  <p className="text-sm text-ink-light leading-relaxed">Review what we found and confirm or correct</p>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-warmth text-sm font-bold text-white">3</div>
                  <p className="text-sm text-ink-light leading-relaxed">Your financial picture builds up section by section</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── ACTIVE STATE ── */}
        {!isEmpty && (
          <div className="space-y-8">
            {/* Financial summary — hero numbers */}
            <LiveSummary summary={summary} />

            {/* Next step — ONE thing, prominent */}
            {nextCategory && (
              <div className="rounded-[var(--radius-md)] bg-surface p-6 shadow-[var(--shadow-sm)] border-l-[var(--border-accent)] border-warmth">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-warmth-dark">Your next step</h3>
                <p className="mt-2 text-lg font-semibold text-ink">{nextCategory.label}</p>
                <p className="mt-1 text-sm text-ink-light">{nextCategory.description}. Best document: {nextCategory.idealDocs}.</p>
                <div className="mt-4">
                  <Link href={`/workspace/picture/${nextCategory.key}`}>
                    <Button>Get started</Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Upload more — compact */}
            <Link href="/workspace/picture" className="block">
              <div className="rounded-[var(--radius-md)] border-2 border-dashed border-warmth/30 bg-warmth-light/10 p-5 text-center transition-all duration-200 hover:border-warmth/60 hover:bg-warmth-light/20">
                <p className="text-sm font-medium text-warmth-dark">Upload more documents</p>
                <p className="mt-1 text-xs text-ink-faint">or <Link href="/workspace/picture/manual" className="text-warmth-dark underline">enter manually</Link></p>
              </div>
            </Link>

            {/* Categories — visual status grid */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-faint">Categories</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
                  const isAwaiting = catItems.some(item => item.status === 'awaiting')

                  return (
                    <Link
                      key={cat.key}
                      href={`/workspace/picture/${cat.key}`}
                      className={cn(
                        'rounded-[var(--radius-md)] p-4 transition-all duration-300 border-l-[var(--border-accent)]',
                        i < visibleCards ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
                        hasContent && !isAwaiting ? 'bg-surface border-sage shadow-[var(--shadow-sm)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]' :
                        isAwaiting ? 'bg-amber-light/30 border-amber shadow-[var(--shadow-sm)]' :
                        isNext ? 'bg-warmth-light/20 border-warmth hover:bg-warmth-light/30' :
                        'bg-cream-dark/50 border-transparent hover:bg-cream-dark hover:border-ink-faint',
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <p className={cn('font-semibold', hasContent ? 'text-ink' : 'text-ink-light')}>{cat.label}</p>
                        {confirmed > 0 && <span className="text-xs font-medium text-sage">✓ {confirmed}</span>}
                        {isAwaiting && <span className="text-xs font-medium text-amber">⏳</span>}
                        {toReview > 0 && <span className="text-xs font-medium text-warmth">● {toReview}</span>}
                        {!hasContent && isNext && <span className="text-xs font-medium text-warmth-dark">Next</span>}
                      </div>

                      {hasContent && totalValue > 0 && (
                        <p className="mt-1 text-xl font-bold text-ink tabular-nums">
                          {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(totalValue)}
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

            {/* AI Insight */}
            {readiness.blockers.length > 0 && readiness.level !== 'not_started' && (
              <div className="rounded-[var(--radius-md)] bg-warmth-light/30 p-6 border-l-[var(--border-accent)] border-warmth">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-warmth-dark">💡 Insight</h3>
                <p className="mt-2 text-sm text-ink leading-relaxed">{readiness.blockers[0]}</p>
              </div>
            )}

            {/* V3 transition — when ready */}
            {readiness.level === 'first_draft' && (
              <div className="rounded-[var(--radius-md)] bg-sage-light/50 p-6 border-l-[var(--border-accent)] border-sage">
                <h3 className="text-lg font-semibold text-ink">Your picture is ready to share</h3>
                <p className="mt-1 text-sm text-ink-light leading-relaxed">
                  You have enough for an initial conversation with a mediator or solicitor. When you&apos;re ready, the next phase helps you prepare for formal disclosure.
                </p>
                <div className="mt-4">
                  <Button variant="secondary">Prepare for disclosure</Button>
                </div>
              </div>
            )}

            {/* Quick actions */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: 'Upload', icon: '📎', href: '/workspace/picture' },
                { label: 'Add item', icon: '✎', href: '/workspace/picture/manual' },
                { label: 'Documents', icon: '📄', href: '#' },
                { label: 'Summary', icon: '📊', href: '#' },
              ].map(action => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex flex-col items-center gap-2 rounded-[var(--radius-md)] bg-surface p-4 text-center shadow-[var(--shadow-sm)] transition-all hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5"
                >
                  <span className="text-2xl">{action.icon}</span>
                  <span className="text-xs font-medium text-ink-light">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Document checklist */}
        <DocumentChecklist
          items={items}
          documents={documents}
          hasChildren={false}
          hasProperty={items.some(i => i.category === 'property')}
          isSelfEmployed={items.some(i => i.category === 'business' as never)}
        />
      </div>
    </WorkspaceLayout>
  )
}
