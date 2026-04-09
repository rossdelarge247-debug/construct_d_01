'use client'

import { useState } from 'react'
import { CetvTracker, type CetvRequest } from '@/components/workspace/cetv-tracker'
import { CATEGORY_PRIORITY } from '@/types/workspace'
import type { FinancialPictureItem, SpendingCategory } from '@/types/workspace'
import { cn } from '@/utils/cn'

interface CategoryContentProps {
  categoryKey: string
  items: FinancialPictureItem[]
  spending?: SpendingCategory[]
  onAddItem: (item: FinancialPictureItem) => void
  onRemoveItem: (id: string) => void
  onEditItem: (id: string) => void
  onOpenManualEntry: () => void
  setSpending: (s: SpendingCategory[]) => void
}

const AI_PROMPTS: Record<string, string> = {
  current_account: 'Any bonuses, overtime, or side income not shown here?',
  savings: 'Any ISAs, premium bonds, or accounts you rarely check?',
  property: 'Any other properties — buy-to-let, inherited, or abroad?',
  pensions: 'Any old workplace pensions from previous employers?',
  debts: 'Any store cards, buy-now-pay-later, or loans from family?',
  other_income: 'Any benefits, tax credits, or maintenance payments received?',
  other_assets: 'Any vehicles, crypto, valuables over £500, or investments?',
  business: 'Any business accounts, SIPP contributions, or director\'s loans?',
  outgoings: 'Any regular commitments not captured — childcare, school fees, memberships?',
}

function formatCurrency(amount: number | null): string {
  if (amount === null || isNaN(amount)) return '—'
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: amount < 100 ? 2 : 0 }).format(amount)
}

export function CategoryContent({ categoryKey, items, spending, onAddItem, onRemoveItem, onEditItem, onOpenManualEntry, setSpending }: CategoryContentProps) {
  const [cetvRequests, setCetvRequests] = useState<CetvRequest[]>([])

  const isPensions = categoryKey === 'pensions'
  const isOutgoings = categoryKey === 'outgoings'
  const categoryInfo = CATEGORY_PRIORITY.find(c => c.key === categoryKey)
  const catItems = items.filter(i =>
    i.category === categoryKey || i.subcategory === categoryKey ||
    (categoryKey === 'current_account' && (i.category === 'income' || i.subcategory === 'current_account'))
  )

  return (
    <div className="space-y-6 py-6">
      {/* Items captured */}
      {catItems.length > 0 && (
        <div className="space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-ink-faint">
            {catItems.length} item{catItems.length !== 1 ? 's' : ''} captured
          </p>
          {catItems.map(item => (
            <div
              key={item.id}
              className={cn(
                'rounded-[var(--radius-md)] border-[var(--border-card)] p-4 transition-all hover:shadow-[var(--shadow-sm)]',
                'border-l-[var(--border-accent)]',
                item.confidence === 'known' ? 'border-cream-dark border-l-sage bg-surface' :
                item.confidence === 'estimated' ? 'border-cream-dark border-l-amber bg-surface' :
                'border-cream-dark border-l-ink-faint bg-cream-dark/20',
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-base font-bold text-ink">{item.label}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <span className={cn(
                      'rounded-full px-2.5 py-0.5 text-[11px] font-bold',
                      item.confidence === 'known' ? 'bg-sage-light text-sage-dark' :
                      item.confidence === 'estimated' ? 'bg-amber-light text-amber' :
                      'bg-cream-dark text-ink-faint',
                    )}>
                      {item.confidence}
                    </span>
                    <span className="rounded-full bg-cream-dark px-2.5 py-0.5 text-[11px] font-semibold text-ink-faint capitalize">
                      {item.ownership === 'joint' ? `Joint · ${item.split}%` : item.ownership}
                    </span>
                    {item.is_inherited && <span className="rounded-full bg-teal-light px-2 py-0.5 text-[10px] font-bold text-teal-dark">Inherited</span>}
                    {item.is_pre_marital && <span className="rounded-full bg-teal-light px-2 py-0.5 text-[10px] font-bold text-teal-dark">Pre-marital</span>}
                  </div>
                  {item.notes && <p className="mt-1.5 text-xs text-ink-faint">{item.notes}</p>}
                </div>
                <div className="text-right">
                  <p className="text-xl font-extrabold tracking-tight text-ink tabular-nums">
                    {formatCurrency(item.value)}
                    {item.period === 'monthly' && <span className="text-sm font-semibold text-ink-faint">/mo</span>}
                    {item.period === 'annual' && <span className="text-sm font-semibold text-ink-faint">/yr</span>}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex gap-4">
                <button onClick={() => onEditItem(item.id)} className="text-xs font-semibold text-ink-faint hover:text-warmth-dark transition-colors">Edit</button>
                <button onClick={() => onRemoveItem(item.id)} className="text-xs font-semibold text-ink-faint hover:text-warmth-dark transition-colors">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Spending breakdown (outgoings tab) */}
      {isOutgoings && spending && spending.length > 0 && (
        <div className="space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-ink-faint">Monthly spending</p>
          <div className="rounded-[var(--radius-md)] border-[var(--border-card)] border-cream-dark overflow-hidden">
            {spending.map((cat, i) => (
              <div key={cat.category} className={cn('flex items-center justify-between px-4 py-3', i > 0 && 'border-t border-cream-dark')}>
                <span className="text-sm text-ink capitalize">{cat.category.replace(/_/g, ' ')}</span>
                <span className="text-sm font-bold text-ink tabular-nums">{formatCurrency(cat.monthly_average)}/mo</span>
              </div>
            ))}
            <div className="flex items-center justify-between px-4 py-3 border-t-[var(--border-card)] border-ink-faint bg-cream-dark/20">
              <span className="text-sm font-bold text-ink">Total</span>
              <span className="text-base font-extrabold text-ink tabular-nums">{formatCurrency(spending.reduce((s, c) => s + c.monthly_average, 0))}/mo</span>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {catItems.length === 0 && !(isOutgoings && spending && spending.length > 0) && (
        <div className="rounded-[var(--radius-lg)] border-[var(--border-card)] border-cream-dark bg-cream-dark/20 p-8 text-center">
          <p className="text-base font-semibold text-ink-light">No {categoryInfo?.label.toLowerCase()} items yet</p>
          <p className="mt-1 text-sm text-ink-faint">Drop a document above or enter details manually.</p>
          <button onClick={onOpenManualEntry} className="mt-3 text-sm font-semibold text-warmth-dark hover:text-warmth transition-colors">
            Add manually
          </button>
        </div>
      )}

      {/* CETV tracker — pensions only */}
      {isPensions && (
        <CetvTracker
          requests={cetvRequests}
          onAdd={(req) => setCetvRequests(prev => [...prev, req])}
          onUpdate={(id, updates) => setCetvRequests(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r))}
        />
      )}

      {/* AI prompt */}
      {AI_PROMPTS[categoryKey] && catItems.length > 0 && (
        <div className="rounded-[var(--radius-md)] border-[var(--border-card)] border-l-[var(--border-accent)] border-cream-dark border-l-warmth bg-warmth-light/20 p-4">
          <p className="text-sm text-ink">💡 {AI_PROMPTS[categoryKey]}</p>
          <button onClick={onOpenManualEntry} className="mt-2 text-xs font-semibold text-warmth-dark hover:text-warmth transition-colors">
            Add another item
          </button>
        </div>
      )}
    </div>
  )
}
