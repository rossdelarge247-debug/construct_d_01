'use client'

import { useState, useCallback, useMemo } from 'react'
import { Home, Zap, ShoppingBag, Car, Users, Sparkles, Check } from 'lucide-react'
import type { BankStatementExtraction } from '@/lib/ai/extraction-schemas'
import type { ConnectedAccount } from '@/types/hub'
import {
  SPENDING_CATEGORIES,
  type SpendingSubCategory,
  type SpendingItem,
  type SpendingFlowResult,
  type SpendingMode,
} from '@/types/hub'
import {
  getDetectedSpendingItems,
  createDemoTransactions,
  toMonthly,
} from '@/lib/bank/bank-data-utils'
import { SpendingFork } from './spending-fork'
import { SpendingEstimatesForm, SpendingEstimatesSummary } from './spending-estimates'
import { SpendingCategorise } from './spending-categorise'

// Thin orchestrator for the entire spending flow.
// Composes: fork → estimates path OR bank data categorisation path → summary.

type SpendingPhase =
  | 'fork'
  | 'estimates_form'
  | 'estimates_summary'
  | 'categorise'
  | 'full_summary'

interface SpendingFlowProps {
  extractions: BankStatementExtraction[]
  connectedAccounts: ConnectedAccount[]
  hasChildren: boolean
  onComplete: (result: SpendingFlowResult) => void
  onSkip: () => void
  /** Skip the fork and go straight to bank data categorisation (re-entry from estimates) */
  startInCategorise?: boolean
}

const CATEGORY_ICONS: Record<SpendingSubCategory, typeof Home> = {
  housing: Home,
  utilities: Zap,
  personal: ShoppingBag,
  transport: Car,
  children: Users,
  leisure: Sparkles,
}

export function SpendingFlow({
  extractions,
  connectedAccounts,
  hasChildren,
  onComplete,
  onSkip,
  startInCategorise,
}: SpendingFlowProps) {
  const [phase, setPhase] = useState<SpendingPhase>(startInCategorise ? 'categorise' : 'fork')
  const [estimateValues, setEstimateValues] = useState<Partial<Record<SpendingSubCategory, number>>>({})
  const [categoryResults, setCategoryResults] = useState<Record<string, SpendingItem[]>>({})

  const detectedItems = useMemo(
    () => getDetectedSpendingItems(extractions),
    [extractions],
  )
  const demoTransactions = useMemo(() => createDemoTransactions(), [])
  const bankName = connectedAccounts[0]?.bankName ?? 'Bank'

  const handleForkChoice = useCallback((mode: 'now' | 'estimates') => {
    if (mode === 'estimates') {
      setPhase('estimates_form')
    } else {
      setPhase('categorise')
    }
  }, [])

  const handleEstimatesComplete = useCallback((values: Partial<Record<SpendingSubCategory, number>>) => {
    setEstimateValues(values)
    setPhase('estimates_summary')
  }, [])

  const handleEstimatesConfirm = useCallback(() => {
    const categories = SPENDING_CATEGORIES
      .filter((c) => estimateValues[c.key] && estimateValues[c.key]! > 0)
      .map((c) => ({
        key: c.key,
        items: [{
          id: `est-${c.key}`,
          subCategory: c.key,
          label: c.label,
          amount: estimateValues[c.key]!,
          frequency: 'monthly' as const,
          monthlyEquivalent: estimateValues[c.key]!,
          source: 'manual' as const,
        }],
        totalMonthly: estimateValues[c.key]!,
        confirmed: true,
      }))

    onComplete({
      mode: 'estimates',
      categories,
      totalMonthly: categories.reduce((s, c) => s + c.totalMonthly, 0),
    })
  }, [estimateValues, onComplete])

  const handleCategoriseComplete = useCallback((results: Record<SpendingSubCategory, SpendingItem[]>) => {
    setCategoryResults(results)
    setPhase('full_summary')
  }, [])

  const handleFullSummaryConfirm = useCallback(() => {
    const categories = SPENDING_CATEGORIES
      .filter((c) => categoryResults[c.key]?.length > 0)
      .map((c) => {
        const items = categoryResults[c.key]
        return {
          key: c.key,
          items,
          totalMonthly: items.reduce((s, i) => s + i.monthlyEquivalent, 0),
          confirmed: true,
        }
      })

    onComplete({
      mode: 'bank_data',
      categories,
      totalMonthly: categories.reduce((s, c) => s + c.totalMonthly, 0),
    })
  }, [categoryResults, onComplete])

  return (
    <div>
      {phase === 'fork' && (
        <SpendingFork onChoose={handleForkChoice} onSkip={onSkip} />
      )}

      {phase === 'estimates_form' && (
        <SpendingEstimatesForm
          hasChildren={hasChildren}
          onComplete={handleEstimatesComplete}
          onBack={() => setPhase('fork')}
        />
      )}

      {phase === 'estimates_summary' && (
        <SpendingEstimatesSummary
          estimates={estimateValues}
          onConfirm={handleEstimatesConfirm}
          onGoBack={() => setPhase('estimates_form')}
        />
      )}

      {phase === 'categorise' && (
        <SpendingCategorise
          categories={SPENDING_CATEGORIES}
          detectedItems={detectedItems}
          transactions={demoTransactions}
          hasChildren={hasChildren}
          onComplete={handleCategoriseComplete}
        />
      )}

      {phase === 'full_summary' && (
        <FullSpendingSummary
          results={categoryResults}
          bankName={bankName}
          onConfirm={handleFullSummaryConfirm}
          onGoBack={() => setPhase('categorise')}
        />
      )}
    </div>
  )
}

// ═══ S1c-2 — Full spending summary (bank-confirmed) ═══

function FullSpendingSummary({
  results,
  bankName,
  onConfirm,
  onGoBack,
}: {
  results: Record<string, SpendingItem[]>
  bankName: string
  onConfirm: () => void
  onGoBack: () => void
}) {
  const entries = SPENDING_CATEGORIES.filter((c) => results[c.key]?.length > 0)

  return (
    <div className="animate-fade-in">
      <p className="text-[12px] font-semibold text-ink-tertiary uppercase tracking-wider mb-2">
        Spending
      </p>
      <h3 className="text-[22px] font-bold text-ink leading-snug mb-6">
        That&apos;s it for spending, please check the categories below
      </h3>

      <div className="space-y-3">
        {entries.map((cat) => {
          const items = results[cat.key]
          const total = items.reduce((s, i) => s + i.monthlyEquivalent, 0)
          const Icon = CATEGORY_ICONS[cat.key]
          return (
            <div key={cat.key} className="flex items-center gap-3">
              <Icon size={16} className="text-ink-secondary shrink-0" />
              <span className="text-[15px] text-ink flex-1">
                {cat.label}: £{total.toLocaleString()} p/m
              </span>
              <span
                className="text-[11px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap"
                style={{
                  backgroundColor: 'var(--color-green-50)',
                  color: 'var(--color-green-600)',
                }}
              >
                {bankName} Bank connection
              </span>
              <button className="text-[13px] text-blue-600 hover:opacity-80 shrink-0">
                Edit
              </button>
            </div>
          )
        })}
      </div>

      <div className="mt-8 flex items-center gap-4">
        <button
          onClick={onConfirm}
          className="px-8 py-3.5 text-white text-[15px] font-semibold transition-colors active:scale-[0.98]"
          style={{
            backgroundColor: 'var(--color-red-500)',
            borderRadius: 'var(--radius-card)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-red-600)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-red-500)')}
        >
          This looks correct
        </button>
        <button
          onClick={onGoBack}
          className="text-[13px] text-blue-600 hover:opacity-80 transition-opacity underline"
        >
          I need to go back and review these again
        </button>
      </div>
    </div>
  )
}
