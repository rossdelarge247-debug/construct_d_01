'use client'

import { Button } from '@/components/ui/button'
import type { FinancialPictureItem, SpendingCategory } from '@/types/workspace'
import { cn } from '@/utils/cn'

interface SummaryTabProps {
  items: FinancialPictureItem[]
  spending: SpendingCategory[]
  onEditItem: (id: string) => void
  onSwitchToPreparation: () => void
}

function formatCurrency(amount: number | null): string {
  if (amount === null || isNaN(amount)) return '—'
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: amount < 100 ? 2 : 0 }).format(amount)
}

function SummarySection({ number, title, children, isEmpty }: { number: string; title: string; children: React.ReactNode; isEmpty?: boolean }) {
  return (
    <div className={cn('border-b-[var(--border-card)] border-cream-dark pb-8', isEmpty && 'opacity-60')}>
      <div className="flex items-baseline gap-3">
        <span className="text-xs font-bold text-ink-faint">{number}</span>
        <h3 className="text-lg font-bold text-ink">{title}</h3>
      </div>
      <div className="mt-4">
        {children}
      </div>
    </div>
  )
}

function SummaryItem({ item, onEdit }: { item: FinancialPictureItem; onEdit: () => void }) {
  return (
    <div className="group flex items-start justify-between rounded-[var(--radius-md)] border-[var(--border-card)] border-cream-dark bg-surface p-4 transition-all hover:shadow-[var(--shadow-sm)]">
      <div className="flex-1">
        <p className="text-base font-semibold text-ink">{item.label}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span className={cn(
            'rounded-full px-2 py-0.5 text-[10px] font-bold',
            item.confidence === 'known' ? 'bg-sage-light text-sage-dark' :
            item.confidence === 'estimated' ? 'bg-amber-light text-amber' :
            'bg-cream-dark text-ink-faint',
          )}>
            {item.confidence}
          </span>
          <span className="text-[10px] font-semibold text-ink-faint capitalize">
            {item.ownership === 'joint' ? `Joint · ${item.split}% yours` : item.ownership}
          </span>
          {item.is_inherited && <span className="text-[10px] font-bold text-teal">Inherited</span>}
          {item.is_pre_marital && <span className="text-[10px] font-bold text-teal">Pre-marital</span>}
        </div>
        {item.notes && <p className="mt-1 text-xs text-ink-faint">{item.notes}</p>}
      </div>
      <div className="text-right">
        <p className="text-lg font-extrabold tracking-tight text-ink tabular-nums">
          {formatCurrency(item.value)}
          {item.period === 'monthly' && <span className="text-xs font-semibold text-ink-faint">/mo</span>}
          {item.period === 'annual' && <span className="text-xs font-semibold text-ink-faint">/yr</span>}
        </p>
        <button
          onClick={onEdit}
          className="mt-1 text-[11px] font-semibold text-ink-faint opacity-0 transition-opacity group-hover:opacity-100 hover:text-warmth-dark"
        >
          Edit
        </button>
      </div>
    </div>
  )
}

export function SummaryTab({ items, spending, onEditItem, onSwitchToPreparation }: SummaryTabProps) {
  const hasItems = items.length > 0

  if (!hasItems && spending.length === 0) {
    // Zero-data state
    return (
      <div className="py-12">
        <div className="mx-auto max-w-xl text-center space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-ink">Your financial disclosure</h2>
            <p className="mt-3 text-base text-ink-light leading-relaxed">
              This is where your complete financial picture will be structured — equivalent to a Form E financial statement.
            </p>
          </div>

          <div className="rounded-[var(--radius-lg)] border-[var(--border-card)] border-teal-light bg-teal-light/20 p-8 text-left space-y-4">
            <p className="text-sm text-ink leading-relaxed">
              As you upload documents and confirm details in the Preparation tab, this summary builds automatically:
            </p>
            <ul className="space-y-2.5">
              {['Property and valuations', 'Bank accounts and savings', 'Pensions with CETV values', 'Debts and liabilities', 'Income (employment, benefits, other)', 'Monthly expenditure breakdown'].map(item => (
                <li key={item} className="flex items-center gap-2 text-sm text-ink-light">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm text-ink-light">
              Each section links to evidence. Each value shows its confidence level. Gaps are clearly marked.
            </p>
          </div>

          <p className="text-sm text-ink-faint">
            When ready, download as PDF or email to yourself, your solicitor, or your mediator.
          </p>

          <Button onClick={onSwitchToPreparation}>
            Start in Preparation →
          </Button>
        </div>
      </div>
    )
  }

  // Group items by Form E section
  const property = items.filter(i => i.category === 'property')
  const bankAccounts = items.filter(i => i.subcategory === 'current_account' || i.subcategory === 'savings' || i.subcategory === 'bank_account')
  const investments = items.filter(i => i.subcategory === 'investment' || i.subcategory === 'isa')
  const pensions = items.filter(i => i.category === 'pension')
  const liabilities = items.filter(i => i.category === 'liability' || i.subcategory === 'debt' || i.subcategory === 'mortgage')
  const income = items.filter(i => i.category === 'income')
  const otherAssets = items.filter(i => i.category === 'other' || i.subcategory === 'vehicle' || i.subcategory === 'crypto')

  // Calculate totals
  const totalAssets = [...property, ...bankAccounts, ...investments, ...pensions, ...otherAssets]
    .filter(i => i.value !== null && i.period === 'total')
    .reduce((sum, i) => sum + (i.value! * (i.split / 100)), 0)
  const totalLiabilities = liabilities
    .filter(i => i.value !== null)
    .reduce((sum, i) => sum + (i.value! * (i.split / 100)), 0)
  const totalIncome = income
    .filter(i => i.value !== null && i.period === 'monthly')
    .reduce((sum, i) => sum + i.value!, 0)
  const totalSpending = spending.reduce((sum, s) => sum + s.monthly_average, 0)

  // Gaps
  const gaps: string[] = []
  if (pensions.length === 0) gaps.push('Pension CETV values')
  if (items.some(i => i.status === 'awaiting')) gaps.push('Items awaiting external information')
  if (!items.some(i => i.ownership === 'partners')) gaps.push('Partner\'s financial information')
  if (otherAssets.length === 0) gaps.push('Other assets (vehicles, valuables)')

  return (
    <div className="py-8 space-y-8">
      {/* Document header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-ink">Your financial disclosure</h2>
          <p className="mt-1 text-sm text-ink-faint">
            Prepared: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">Email to myself</Button>
          <Button variant="secondary" size="sm">Download PDF</Button>
        </div>
      </div>

      {/* Net position summary */}
      <div className="rounded-[var(--radius-lg)] border-[var(--border-card)] border-cream-dark bg-surface p-6 shadow-[var(--shadow-sm)]">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-ink-faint">Assets</p>
            <p className="mt-1 text-2xl font-extrabold tracking-tight text-ink tabular-nums">{formatCurrency(totalAssets)}</p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-ink-faint">Liabilities</p>
            <p className="mt-1 text-2xl font-extrabold tracking-tight text-ink tabular-nums">{formatCurrency(totalLiabilities)}</p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-ink-faint">Net position</p>
            <p className={cn('mt-1 text-2xl font-extrabold tracking-tight tabular-nums', totalAssets - totalLiabilities >= 0 ? 'text-sage-dark' : 'text-warmth-dark')}>
              {formatCurrency(totalAssets - totalLiabilities)}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-ink-faint">Monthly surplus</p>
            <p className={cn('mt-1 text-2xl font-extrabold tracking-tight tabular-nums', totalIncome - totalSpending >= 0 ? 'text-sage-dark' : 'text-warmth-dark')}>
              {formatCurrency(totalIncome - totalSpending)}
            </p>
          </div>
        </div>
      </div>

      {/* Form E sections */}
      <div className="space-y-8">
        <SummarySection number="2.1" title="Property" isEmpty={property.length === 0}>
          {property.length > 0 ? (
            <div className="space-y-3">
              {property.map(item => <SummaryItem key={item.id} item={item} onEdit={() => onEditItem(item.id)} />)}
            </div>
          ) : (
            <p className="text-sm text-ink-faint italic">No property information captured yet.</p>
          )}
        </SummarySection>

        <SummarySection number="2.4" title="Bank accounts & savings" isEmpty={bankAccounts.length === 0}>
          {bankAccounts.length > 0 ? (
            <div className="space-y-3">
              {bankAccounts.map(item => <SummaryItem key={item.id} item={item} onEdit={() => onEditItem(item.id)} />)}
            </div>
          ) : (
            <p className="text-sm text-ink-faint italic">No bank accounts captured yet.</p>
          )}
        </SummarySection>

        <SummarySection number="2.7" title="Pensions" isEmpty={pensions.length === 0}>
          {pensions.length > 0 ? (
            <div className="space-y-3">
              {pensions.map(item => <SummaryItem key={item.id} item={item} onEdit={() => onEditItem(item.id)} />)}
            </div>
          ) : (
            <p className="text-sm text-ink-faint italic">No pension information captured yet. CETVs take up to 3 months — start early.</p>
          )}
        </SummarySection>

        <SummarySection number="2.10" title="Liabilities" isEmpty={liabilities.length === 0}>
          {liabilities.length > 0 ? (
            <div className="space-y-3">
              {liabilities.map(item => <SummaryItem key={item.id} item={item} onEdit={() => onEditItem(item.id)} />)}
            </div>
          ) : (
            <p className="text-sm text-ink-faint italic">No debts or liabilities captured yet.</p>
          )}
        </SummarySection>

        <SummarySection number="2.11" title="Income" isEmpty={income.length === 0}>
          {income.length > 0 ? (
            <div className="space-y-3">
              {income.map(item => <SummaryItem key={item.id} item={item} onEdit={() => onEditItem(item.id)} />)}
            </div>
          ) : (
            <p className="text-sm text-ink-faint italic">No income information captured yet.</p>
          )}
        </SummarySection>

        <SummarySection number="2.12" title="Expenditure" isEmpty={spending.length === 0}>
          {spending.length > 0 ? (
            <div className="space-y-1">
              {spending.map(cat => (
                <div key={cat.category} className="flex items-center justify-between py-2 border-b border-cream-dark last:border-b-0">
                  <span className="text-sm text-ink capitalize">{cat.category.replace(/_/g, ' ')}</span>
                  <span className="text-sm font-bold text-ink tabular-nums">{formatCurrency(cat.monthly_average)}/mo</span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-3 mt-2 border-t-[var(--border-card)] border-ink-faint">
                <span className="text-sm font-bold text-ink">Total expenditure</span>
                <span className="text-base font-extrabold text-ink tabular-nums">{formatCurrency(totalSpending)}/mo</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-ink-faint italic">No expenditure data captured yet. Upload a bank statement to auto-categorise.</p>
          )}
        </SummarySection>
      </div>

      {/* Gaps */}
      {gaps.length > 0 && (
        <div className="rounded-[var(--radius-lg)] border-[var(--border-card)] border-amber-light bg-amber-light/20 p-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-amber">Gaps — not yet captured</p>
          <ul className="mt-3 space-y-2">
            {gaps.map(gap => (
              <li key={gap} className="flex items-center gap-2 text-sm text-ink-light">
                <span className="text-amber">○</span>
                {gap}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer */}
      <div className="rounded-[var(--radius-md)] bg-cream-dark/30 p-4 text-center">
        <p className="text-xs text-ink-faint">
          This is a working document. It updates automatically as you add information in the Preparation tab.
        </p>
      </div>
    </div>
  )
}
