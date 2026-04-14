'use client'

import { useState } from 'react'
import { Home, Zap, ShoppingBag, Car, Users, Sparkles, X, AlertTriangle } from 'lucide-react'
import { SPENDING_CATEGORIES, type SpendingSubCategory } from '@/types/hub'

// S1b — Estimates form: 6 category inputs (£/month)
// S1c-1 — Estimates summary with amber badges + upgrade nudge

type EstimateValues = Partial<Record<SpendingSubCategory, number>>

interface SpendingEstimatesProps {
  hasChildren: boolean
  onComplete: (estimates: EstimateValues) => void
  onBack: () => void
}

const CATEGORY_ICONS: Record<SpendingSubCategory, typeof Home> = {
  housing: Home,
  utilities: Zap,
  personal: ShoppingBag,
  transport: Car,
  children: Users,
  leisure: Sparkles,
}

const INFO_TOOLTIPS: Record<SpendingSubCategory, string> = {
  housing: 'Mortgage or rent, ground rent, service charges, buildings insurance',
  utilities: 'Gas, electricity, water, council tax, broadband, phone, TV licence',
  personal: 'Food, toiletries, clothing, hairdressing, medical & dental',
  transport: 'Car payments, fuel, insurance, MOT, tax, public transport',
  children: 'School fees, childcare, uniforms, clubs, activities',
  leisure: 'Holidays, subscriptions, eating out, gym, hobbies, gifts',
}

export function SpendingEstimatesForm({ hasChildren, onComplete, onBack }: SpendingEstimatesProps) {
  const [values, setValues] = useState<EstimateValues>({})
  const [showChildren, setShowChildren] = useState(hasChildren)

  const categories = SPENDING_CATEGORIES.filter(
    (c) => c.key !== 'children' || showChildren,
  )

  const handleChange = (key: SpendingSubCategory, raw: string) => {
    const num = parseInt(raw.replace(/[^0-9]/g, ''), 10)
    setValues((prev) => ({ ...prev, [key]: isNaN(num) ? undefined : num }))
  }

  const hasAnyValue = Object.values(values).some((v) => v && v > 0)

  return (
    <div className="animate-fade-in">
      <p className="text-[12px] font-semibold text-ink-tertiary uppercase tracking-wider mb-2">
        Spending
      </p>
      <h3 className="text-[22px] font-bold text-ink leading-snug mb-6">
        For an initial mediation session, spending estimates are fine
      </h3>

      <div className="space-y-5">
        {categories.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.key]
          return (
            <div key={cat.key}>
              <div className="flex items-center gap-2 mb-1.5">
                <Icon size={16} className="text-ink-secondary" />
                <label className="text-[15px] font-semibold text-ink">
                  {cat.label}
                </label>
                <button
                  className="w-4 h-4 rounded-full bg-grey-100 flex items-center justify-center text-[10px] text-ink-tertiary font-bold"
                  title={INFO_TOOLTIPS[cat.key]}
                >
                  ?
                </button>
                {cat.key === 'children' && (
                  <button
                    onClick={() => setShowChildren(false)}
                    className="ml-auto text-ink-tertiary hover:text-ink-secondary"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-semibold text-ink">£</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={values[cat.key] ?? ''}
                  onChange={(e) => handleChange(cat.key, e.target.value)}
                  placeholder="0"
                  className="w-28 px-3 py-2.5 text-[15px] text-ink focus:outline-none transition-colors"
                  style={{
                    border: '1.5px solid var(--color-grey-100)',
                    borderRadius: 'var(--radius-card)',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-ink)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-grey-100)')}
                />
                <span className="text-[13px] text-ink-tertiary">per month</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8 flex items-center gap-4">
        <button
          onClick={() => onComplete(values)}
          disabled={!hasAnyValue}
          className="px-8 py-3.5 text-white text-[15px] font-semibold transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            backgroundColor: 'var(--color-red-500)',
            borderRadius: 'var(--radius-card)',
          }}
          onMouseEnter={(e) => { if (hasAnyValue) e.currentTarget.style.backgroundColor = 'var(--color-red-600)' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-red-500)' }}
        >
          Next
        </button>
        <button
          onClick={onBack}
          className="text-[13px] text-ink-tertiary hover:text-ink-secondary transition-colors"
        >
          Back
        </button>
      </div>
    </div>
  )
}

// ═══ S1c-1 — Estimates summary ═══

interface EstimatesSummaryProps {
  estimates: EstimateValues
  onConfirm: () => void
  onGoBack: () => void
}

export function SpendingEstimatesSummary({ estimates, onConfirm, onGoBack }: EstimatesSummaryProps) {
  const entries = SPENDING_CATEGORIES
    .filter((c) => estimates[c.key] && estimates[c.key]! > 0)
    .map((c) => ({ ...c, value: estimates[c.key]! }))

  return (
    <div className="animate-fade-in">
      <p className="text-[12px] font-semibold text-ink-tertiary uppercase tracking-wider mb-2">
        Spending
      </p>
      <h3 className="text-[22px] font-bold text-ink leading-snug mb-4">
        First stab at your spending estimates complete
      </h3>

      {/* Amber nudge */}
      <div
        className="flex items-start gap-3 px-4 py-3 mb-6"
        style={{
          backgroundColor: 'var(--color-amber-50)',
          borderRadius: 'var(--radius-card)',
        }}
      >
        <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
        <p className="text-[13px] text-ink-secondary leading-relaxed">
          We strongly recommend fully disclosing your spending based on your actual bank
          statement data as to not hold things up during mediation or finalisation.
          We will add a task to your todo list — it takes 5 minutes...
        </p>
      </div>

      <div className="space-y-3">
        {entries.map((entry) => {
          const Icon = CATEGORY_ICONS[entry.key]
          return (
            <div key={entry.key} className="flex items-center gap-3">
              <Icon size={16} className="text-ink-secondary shrink-0" />
              <span className="text-[15px] text-ink flex-1">
                {entry.label}: £{entry.value.toLocaleString()} p/m
              </span>
              <span
                className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: 'var(--color-amber-50)',
                  color: 'var(--color-amber-600)',
                }}
              >
                Estimated
              </span>
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
