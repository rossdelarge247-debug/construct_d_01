'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'
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

function ConfidenceDot({ confidence }: { confidence: number }) {
  return (
    <span className={cn(
      'inline-block h-2 w-2 rounded-full',
      confidence >= 0.9 ? 'bg-sage' : confidence >= 0.7 ? 'bg-amber' : 'bg-ink-faint',
    )} />
  )
}

export function ExtractionReview({ items, spending, accounts, summary, onConfirmAll, onDismiss }: ExtractionReviewProps) {
  const [reviewedItems, setReviewedItems] = useState<Record<string, 'accepted' | 'rejected'>>(
    {},
  )

  const acceptItem = (index: number) => {
    setReviewedItems(prev => ({ ...prev, [index]: 'accepted' }))
  }

  const rejectItem = (index: number) => {
    setReviewedItems(prev => ({ ...prev, [index]: 'rejected' }))
  }

  const allReviewed = items.every((_, i) => reviewedItems[i])
  const acceptedItems = items.filter((_, i) => reviewedItems[i] === 'accepted')

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="rounded-[var(--radius-md)] border border-sage-light bg-sage-light/30 p-4">
        <p className="text-sm text-ink">{summary}</p>
      </div>

      {/* Accounts detected */}
      {accounts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-medium uppercase tracking-wide text-ink-faint">Accounts found</h3>
          {accounts.map((account, i) => (
            <div key={i} className="rounded-[var(--radius-md)] border border-cream-dark p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ink">{account.provider} {account.account_reference}</p>
                <p className="text-xs text-ink-light">
                  {account.account_type}{account.is_joint ? ' · Joint' : ''}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-ink">{formatCurrency(account.balance)}</p>
                <p className="text-xs text-ink-faint">as at {account.balance_date}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Extracted items */}
      {items.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-medium uppercase tracking-wide text-ink-faint">Items found</h3>
          {items.map((item, i) => (
            <div
              key={i}
              className={cn(
                'rounded-[var(--radius-md)] border p-4 transition-all duration-200',
                reviewedItems[i] === 'accepted' ? 'border-sage-light bg-sage-light/10' :
                reviewedItems[i] === 'rejected' ? 'border-cream-dark bg-cream-dark/20 opacity-50' :
                'border-cream-dark',
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <ConfidenceDot confidence={item.confidence} />
                    <p className="text-sm font-medium text-ink">{item.label}</p>
                  </div>
                  <p className="mt-1 text-xs text-ink-faint">{item.source_description}</p>
                  {item.ownership_hint === 'joint' && (
                    <span className="mt-1 inline-block rounded-full bg-cream-dark px-2 py-0.5 text-[10px] text-ink-faint">Joint</span>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-ink">
                    {formatCurrency(item.value)}{item.period === 'monthly' ? '/mo' : item.period === 'annual' ? '/yr' : ''}
                  </p>
                </div>
              </div>

              {!reviewedItems[i] && (
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => acceptItem(i)}
                    className="rounded-[var(--radius-sm)] bg-sage-light px-3 py-1.5 text-xs font-medium text-sage-dark transition-colors hover:bg-sage/20"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => rejectItem(i)}
                    className="rounded-[var(--radius-sm)] bg-cream-dark px-3 py-1.5 text-xs font-medium text-ink-faint transition-colors hover:bg-cream-dark/80"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Spending categories */}
      {spending && spending.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-medium uppercase tracking-wide text-ink-faint">Monthly spending (auto-categorised)</h3>
          <div className="rounded-[var(--radius-md)] border border-cream-dark divide-y divide-cream-dark">
            {spending.map((cat, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm text-ink capitalize">{cat.category.replace(/_/g, ' ')}</p>
                  <p className="text-xs text-ink-faint">{cat.transaction_count} transactions · e.g. {cat.examples.slice(0, 2).join(', ')}</p>
                </div>
                <p className="text-sm font-medium text-ink">{formatCurrency(cat.monthly_average)}/mo</p>
              </div>
            ))}
            <div className="flex items-center justify-between px-4 py-3 bg-cream-dark/20">
              <p className="text-sm font-medium text-ink">Total outgoings</p>
              <p className="text-sm font-medium text-ink">
                {formatCurrency(spending.reduce((sum, s) => sum + s.monthly_average, 0))}/mo
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <button onClick={onDismiss} className="text-sm text-ink-light hover:text-ink transition-colors">
          Skip for now
        </button>
        <Button
          onClick={() => onConfirmAll(acceptedItems.length > 0 ? acceptedItems : items, spending, accounts)}
          disabled={items.length > 0 && !allReviewed && acceptedItems.length === 0}
        >
          {allReviewed ? `Confirm ${acceptedItems.length} items` : 'Confirm all'}
        </Button>
      </div>
    </div>
  )
}
