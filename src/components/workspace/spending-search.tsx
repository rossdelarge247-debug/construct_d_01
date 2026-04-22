'use client'

import { useState, useMemo } from 'react'
import {
  searchTransactionsByPayee,
  inferPaymentFrequency,
  toMonthly,
  type DemoTransaction,
} from '@/lib/bank/bank-data-utils'

// S2d — Transaction search with typeahead
// User searches their bank transactions by payee name.
// Results grouped by payee, individual transactions have checkboxes.
// Frequency inferred from count, monthly equivalent calculated.

interface SpendingSearchProps {
  label: string
  transactions: DemoTransaction[]
  onComplete: (result: SearchResult) => void
  onSkip: () => void
}

export interface SearchResult {
  label: string
  payee: string
  selectedTransactions: DemoTransaction[]
  frequency: 'monthly' | 'quarterly' | 'annual' | 'one_off'
  totalAmount: number
  monthlyEquivalent: number
}

export function SpendingSearch({ label, transactions, onComplete, onSkip }: SpendingSearchProps) {
  const [query, setQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [frequencies, setFrequencies] = useState<Record<string, 'monthly' | 'quarterly' | 'annual' | 'one_off'>>({})

  const groupedResults = useMemo(
    () => searchTransactionsByPayee(transactions, query),
    [transactions, query],
  )

  const toggleTransaction = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const setPayeeFrequency = (payee: string, freq: 'monthly' | 'quarterly' | 'annual' | 'one_off') => {
    setFrequencies((prev) => ({ ...prev, [payee]: freq }))
  }

  const hasSelection = selectedIds.size > 0

  const handleComplete = () => {
    // Group selected transactions by payee, take the first payee group
    const allSelected = transactions.filter((t) => selectedIds.has(t.id))
    if (allSelected.length === 0) return

    const payee = allSelected[0].payee
    const inferred = frequencies[payee] ?? inferPaymentFrequency(allSelected.length)
    const avgAmount = Math.round(
      allSelected.reduce((s, t) => s + t.amount, 0) / allSelected.length,
    )

    onComplete({
      label,
      payee,
      selectedTransactions: allSelected,
      frequency: inferred,
      totalAmount: avgAmount,
      monthlyEquivalent: toMonthly(avgAmount, inferred),
    })
  }

  return (
    <div className="animate-fade-in">
      <h3 className="text-[22px] font-bold text-ink leading-snug mb-4">
        Search for your {label.toLowerCase()}
      </h3>

      {/* Search input */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Start typing a payee name..."
        className="w-full px-4 py-3 text-[15px] text-ink focus:outline-none transition-colors mb-4"
        style={{
          border: '1.5px solid var(--color-grey-100)',
          borderRadius: 'var(--radius-card)',
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-ink)')}
        onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-grey-100)')}
        autoFocus
      />

      {/* Results grouped by payee */}
      {Array.from(groupedResults.entries()).map(([payee, txs]) => (
        <PayeeGroup
          key={payee}
          payee={payee}
          transactions={txs}
          selectedIds={selectedIds}
          onToggle={toggleTransaction}
          frequency={frequencies[payee]}
          onFrequencyChange={(f) => setPayeeFrequency(payee, f)}
        />
      ))}

      {query.length >= 2 && groupedResults.size === 0 && (
        <p className="text-[13px] text-ink-tertiary py-4">
          No transactions found matching &ldquo;{query}&rdquo;
        </p>
      )}

      {/* Actions */}
      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={handleComplete}
          disabled={!hasSelection}
          className="px-8 py-3.5 text-white text-[15px] font-semibold transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            backgroundColor: 'var(--color-red-500)',
            borderRadius: 'var(--radius-card)',
          }}
          onMouseEnter={(e) => { if (hasSelection) e.currentTarget.style.backgroundColor = 'var(--color-red-600)' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-red-500)' }}
        >
          Next
        </button>
        <button
          onClick={onSkip}
          className="text-[13px] text-ink-tertiary hover:text-ink-secondary transition-colors"
        >
          Skip for now
        </button>
      </div>
    </div>
  )
}

// ═══ PayeeGroup — transactions from one payee ═══

function PayeeGroup({
  payee,
  transactions,
  selectedIds,
  onToggle,
  frequency,
  onFrequencyChange,
}: {
  payee: string
  transactions: DemoTransaction[]
  selectedIds: Set<string>
  onToggle: (id: string) => void
  frequency?: 'monthly' | 'quarterly' | 'annual' | 'one_off'
  onFrequencyChange: (f: 'monthly' | 'quarterly' | 'annual' | 'one_off') => void
}) {
  const anySelected = transactions.some((t) => selectedIds.has(t.id))

  return (
    <div
      className="mb-4 overflow-hidden"
      style={{
        border: '1px solid var(--color-grey-100)',
        borderRadius: 'var(--radius-card)',
      }}
    >
      <div className="px-4 py-2.5 bg-grey-50">
        <span className="text-[14px] font-semibold text-ink">{payee}</span>
      </div>
      <div className="divide-y divide-grey-100">
        {transactions.map((tx) => {
          const checked = selectedIds.has(tx.id)
          return (
            <label
              key={tx.id}
              className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-grey-50 transition-colors"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(tx.id)}
                className="w-4 h-4 rounded border-grey-200 text-ink accent-ink"
              />
              <span className="text-[13px] text-ink-secondary flex-1">
                {formatDate(tx.date)} £{tx.amount.toLocaleString()} — {tx.reference}
              </span>
            </label>
          )
        })}
      </div>

      {/* Frequency selector — shown when any transaction is selected */}
      {anySelected && (
        <div className="px-4 py-3 border-t border-grey-100">
          <p className="text-[12px] text-ink-tertiary mb-2">
            Kind of payment this is: quarterly, monthly, or annually etc
          </p>
          <div className="flex gap-2 flex-wrap">
            {(['monthly', 'quarterly', 'annual', 'one_off'] as const).map((f) => {
              const isActive = (frequency ?? inferPaymentFrequency(transactions.length)) === f
              return (
                <button
                  key={f}
                  onClick={() => onFrequencyChange(f)}
                  className="px-3 py-1.5 text-[12px] font-medium transition-all"
                  style={{
                    borderRadius: '6px',
                    border: `1px solid ${isActive ? 'var(--color-ink)' : 'var(--color-grey-100)'}`,
                    backgroundColor: isActive ? 'var(--color-ink)' : 'white',
                    color: isActive ? 'white' : 'var(--color-ink-secondary)',
                  }}
                >
                  {f === 'one_off' ? 'One-off' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
