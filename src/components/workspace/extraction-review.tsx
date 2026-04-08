'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'
import { useStaggeredReveal } from '@/hooks/use-staggered-reveal'
import type { ExtractedFinancialItem, ExtractedSpendingCategory, ExtractedAccount } from '@/lib/documents/processor'

interface ExtractionReviewProps {
  items: ExtractedFinancialItem[]
  spending: ExtractedSpendingCategory[] | null
  accounts: ExtractedAccount[]
  summary: string
  onConfirmAll: (items: ExtractedFinancialItem[], spending: ExtractedSpendingCategory[] | null, accounts: ExtractedAccount[]) => void
  onDismiss: () => void
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(amount)
}

export function ExtractionReview({ items, spending, accounts, summary, onConfirmAll, onDismiss }: ExtractionReviewProps) {
  const [reviewedItems, setReviewedItems] = useState<Record<string, 'accepted' | 'rejected'>>({})

  // Count total visible sections for stagger
  const sectionCount = 1 + (accounts.length > 0 ? 1 : 0) + (items.length > 0 ? 1 : 0) + (spending ? 1 : 0)
  const visibleSections = useStaggeredReveal(sectionCount, { initialDelay: 200, staggerDelay: 300 })

  const acceptItem = (index: number) => {
    setReviewedItems(prev => ({ ...prev, [index]: 'accepted' }))
  }

  const rejectItem = (index: number) => {
    setReviewedItems(prev => ({ ...prev, [index]: 'rejected' }))
  }

  const handleConfirmAll = () => {
    // If user reviewed individually, only include accepted. Otherwise include all.
    const hasReviewed = Object.keys(reviewedItems).length > 0
    const confirmedItems = hasReviewed
      ? items.filter((_, i) => reviewedItems[i] !== 'rejected')
      : items
    onConfirmAll(confirmedItems, spending, accounts)
  }

  let sectionIndex = 0

  return (
    <div className="space-y-6">
      {/* Summary — always first */}
      <div className={cn(
        'rounded-[var(--radius-md)] border border-sage-light bg-sage-light/20 p-5 transition-all duration-500',
        visibleSections > sectionIndex ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
      )}>
        <p className="text-sm text-ink leading-relaxed">{summary}</p>
      </div>
      {(() => { sectionIndex++; return null })()}

      {/* Accounts */}
      {accounts.length > 0 && (
        <div className={cn(
          'space-y-3 transition-all duration-500',
          visibleSections > sectionIndex ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
        )}>
          <h3 className="text-xs font-medium uppercase tracking-wide text-ink-faint">Accounts we found</h3>
          {accounts.map((account, i) => (
            <div key={i} className="rounded-[var(--radius-md)] border border-cream-dark p-4 flex items-center justify-between hover:shadow-[var(--shadow-sm)] transition-shadow duration-200">
              <div>
                <p className="text-sm font-medium text-ink">{account.provider} {account.account_reference}</p>
                <p className="text-xs text-ink-light">
                  {account.account_type}{account.is_joint ? ' · Joint account' : ''}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-ink">{formatCurrency(account.balance)}</p>
                <p className="text-[10px] text-ink-faint">as at {account.balance_date}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      {accounts.length > 0 && (() => { sectionIndex++; return null })()}

      {/* Extracted items */}
      {items.length > 0 && (
        <div className={cn(
          'space-y-3 transition-all duration-500',
          visibleSections > sectionIndex ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
        )}>
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-medium uppercase tracking-wide text-ink-faint">What we extracted</h3>
            {items.length > 2 && Object.keys(reviewedItems).length === 0 && (
              <button
                onClick={handleConfirmAll}
                className="text-xs text-warmth-dark hover:text-warmth transition-colors"
              >
                Confirm all {items.length} items
              </button>
            )}
          </div>

          {items.map((item, i) => (
            <div
              key={i}
              className={cn(
                'rounded-[var(--radius-md)] border p-4 transition-all duration-300',
                reviewedItems[i] === 'accepted' ? 'border-sage bg-sage-light/10' :
                reviewedItems[i] === 'rejected' ? 'border-cream-dark opacity-40 scale-[0.98]' :
                'border-cream-dark hover:shadow-[var(--shadow-sm)]',
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {/* Confidence indicator */}
                    <div className={cn(
                      'h-2 w-2 rounded-full transition-colors',
                      item.confidence >= 0.9 ? 'bg-sage' : item.confidence >= 0.7 ? 'bg-amber' : 'bg-ink-faint',
                    )} />
                    <p className="text-sm font-medium text-ink">{item.label}</p>
                    {reviewedItems[i] === 'accepted' && (
                      <span className="text-sage text-xs">✓</span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-ink-faint">{item.source_description}</p>
                  {item.ownership_hint === 'joint' && (
                    <span className="mt-1.5 inline-block rounded-full bg-cream-dark px-2 py-0.5 text-[10px] text-ink-faint">Joint — 50% yours</span>
                  )}
                </div>
                <p className="text-sm font-medium text-ink whitespace-nowrap">
                  {formatCurrency(item.value)}{item.period === 'monthly' ? '/mo' : item.period === 'annual' ? '/yr' : ''}
                </p>
              </div>

              {/* Review actions — only show if not yet reviewed */}
              {!reviewedItems[i] && (
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => acceptItem(i)}
                    className="rounded-[var(--radius-sm)] bg-sage-light px-3 py-1.5 text-xs font-medium text-sage-dark transition-all hover:bg-sage/20 active:scale-95"
                  >
                    Looks right
                  </button>
                  <button
                    onClick={() => rejectItem(i)}
                    className="rounded-[var(--radius-sm)] px-3 py-1.5 text-xs text-ink-faint transition-all hover:bg-cream-dark active:scale-95"
                  >
                    Not correct
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {items.length > 0 && (() => { sectionIndex++; return null })()}

      {/* Spending */}
      {spending && spending.length > 0 && (
        <div className={cn(
          'space-y-3 transition-all duration-500',
          visibleSections > sectionIndex ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
        )}>
          <h3 className="text-xs font-medium uppercase tracking-wide text-ink-faint">Your monthly spending</h3>
          <p className="text-xs text-ink-light">Auto-categorised from your transactions. You can adjust these later.</p>

          <div className="rounded-[var(--radius-md)] border border-cream-dark overflow-hidden">
            {spending.map((cat, i) => (
              <div key={i} className={cn(
                'flex items-center justify-between px-4 py-3 transition-colors hover:bg-cream-dark/10',
                i > 0 && 'border-t border-cream-dark',
              )}>
                <div>
                  <p className="text-sm text-ink capitalize">{cat.category.replace(/_/g, ' ')}</p>
                  <p className="text-[10px] text-ink-faint">{cat.transaction_count} transactions</p>
                </div>
                <p className="text-sm font-medium text-ink tabular-nums">{formatCurrency(cat.monthly_average)}<span className="text-xs text-ink-faint">/mo</span></p>
              </div>
            ))}
            <div className="flex items-center justify-between px-4 py-3 border-t border-cream-dark bg-cream-dark/20">
              <p className="text-sm font-medium text-ink">Total monthly outgoings</p>
              <p className="text-sm font-medium text-ink tabular-nums">
                {formatCurrency(spending.reduce((sum, s) => sum + s.monthly_average, 0))}<span className="text-xs text-ink-faint">/mo</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <button onClick={onDismiss} className="text-sm text-ink-light hover:text-ink transition-colors">
          I&apos;ll review this later
        </button>
        <Button onClick={handleConfirmAll}>
          Confirm and continue
        </Button>
      </div>
    </div>
  )
}
