import type { FinancialSummary } from '@/types/workspace'
import { cn } from '@/utils/cn'

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(amount)
}

export function LiveSummary({ summary }: { summary: FinancialSummary }) {
  if (summary.items_confirmed + summary.items_estimated === 0) return null

  return (
    <div className="rounded-[var(--radius-md)] border border-cream-dark p-5 space-y-4">
      <h3 className="text-xs font-medium uppercase tracking-wide text-ink-faint">Live summary</h3>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div>
          <p className="text-xs text-ink-faint">Assets</p>
          <p className="text-lg font-medium text-ink">{formatCurrency(summary.total_assets)}</p>
        </div>
        <div>
          <p className="text-xs text-ink-faint">Liabilities</p>
          <p className="text-lg font-medium text-ink">{formatCurrency(summary.total_liabilities)}</p>
        </div>
        <div>
          <p className="text-xs text-ink-faint">Net position</p>
          <p className={cn(
            'text-lg font-medium',
            summary.net_position >= 0 ? 'text-sage-dark' : 'text-warmth-dark',
          )}>
            {formatCurrency(summary.net_position)}
          </p>
          {summary.items_estimated > 0 && (
            <p className="text-[10px] text-ink-faint">Includes estimates</p>
          )}
        </div>
      </div>

      {(summary.monthly_income > 0 || summary.monthly_outgoings > 0) && (
        <div className="border-t border-cream-dark pt-3 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-ink-faint">Monthly income</p>
            <p className="text-sm font-medium text-ink">{formatCurrency(summary.monthly_income)}/mo</p>
          </div>
          <div>
            <p className="text-xs text-ink-faint">Monthly outgoings</p>
            <p className="text-sm font-medium text-ink">{formatCurrency(summary.monthly_outgoings)}/mo</p>
          </div>
        </div>
      )}
    </div>
  )
}
