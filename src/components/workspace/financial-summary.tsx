'use client'

import type { FinancialSummary } from '@/types/workspace'
import { useCountUp } from '@/hooks/use-count-up'
import { cn } from '@/utils/cn'

function AnimatedCurrency({ amount, className }: { amount: number; className?: string }) {
  const display = useCountUp(amount)
  return (
    <span className={className}>
      {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(display)}
    </span>
  )
}

export function LiveSummary({ summary }: { summary: FinancialSummary }) {
  if (summary.items_confirmed + summary.items_estimated === 0) return null

  return (
    <div className="rounded-[var(--radius-md)] border border-cream-dark p-6 space-y-5 transition-all duration-500 animate-in fade-in">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium uppercase tracking-wide text-ink-faint">Your financial picture</h3>
        <span className="text-xs text-ink-faint">
          {summary.items_confirmed + summary.items_estimated} items captured
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-[11px] text-ink-faint">Assets</p>
          <AnimatedCurrency amount={summary.total_assets} className="text-lg font-medium text-ink" />
        </div>
        <div>
          <p className="text-[11px] text-ink-faint">Liabilities</p>
          <AnimatedCurrency amount={summary.total_liabilities} className="text-lg font-medium text-ink" />
        </div>
        <div>
          <p className="text-[11px] text-ink-faint">Net position</p>
          <AnimatedCurrency
            amount={summary.net_position}
            className={cn('text-lg font-medium', summary.net_position >= 0 ? 'text-sage-dark' : 'text-warmth-dark')}
          />
          {summary.items_estimated > 0 && (
            <p className="text-[10px] text-ink-faint mt-0.5">includes estimates</p>
          )}
        </div>
      </div>

      {(summary.monthly_income > 0 || summary.monthly_outgoings > 0) && (
        <div className="border-t border-cream-dark pt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-[11px] text-ink-faint">Monthly income</p>
            <AnimatedCurrency amount={summary.monthly_income} className="text-base font-medium text-ink" />
            <p className="text-[10px] text-ink-faint">/month</p>
          </div>
          {summary.monthly_outgoings > 0 && (
            <div>
              <p className="text-[11px] text-ink-faint">Monthly outgoings</p>
              <AnimatedCurrency amount={summary.monthly_outgoings} className="text-base font-medium text-ink" />
              <p className="text-[10px] text-ink-faint">/month</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
