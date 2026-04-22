'use client'

import { useState, useMemo } from 'react'

// Form E 3.1 spending categories — the actual budget line items
const FORM_E_CATEGORIES = [
  { value: 'housing', label: 'Housing (mortgage / rent)' },
  { value: 'council_tax', label: 'Council tax' },
  { value: 'gas', label: 'Gas' },
  { value: 'electricity', label: 'Electricity' },
  { value: 'water', label: 'Water' },
  { value: 'phone', label: 'Phone / mobile' },
  { value: 'broadband', label: 'Broadband / TV' },
  { value: 'food', label: 'Food / groceries' },
  { value: 'toiletries', label: 'Toiletries / cleaning' },
  { value: 'clothing_you', label: 'Clothing \u2014 you' },
  { value: 'clothing_children', label: 'Clothing \u2014 children' },
  { value: 'holidays', label: 'Holidays' },
  { value: 'car_fuel', label: 'Car \u2014 fuel' },
  { value: 'car_insurance', label: 'Car \u2014 insurance' },
  { value: 'car_tax_mot', label: 'Car \u2014 tax / MOT' },
  { value: 'car_maintenance', label: 'Car \u2014 maintenance' },
  { value: 'public_transport', label: 'Public transport' },
  { value: 'healthcare', label: 'Healthcare / prescriptions' },
  { value: 'dental', label: 'Dental' },
  { value: 'childcare', label: 'Childcare' },
  { value: 'school_fees', label: 'School fees / activities' },
  { value: 'pet_costs', label: 'Pet costs' },
  { value: 'subscriptions', label: 'Subscriptions' },
  { value: 'eating_out', label: 'Eating out' },
  { value: 'personal', label: 'Personal (haircuts, etc.)' },
  { value: 'gifts', label: 'Gifts' },
  { value: 'savings_investments', label: 'Savings / investments' },
  { value: 'loan_repayments', label: 'Loan repayments' },
  { value: 'credit_card_payments', label: 'Credit card payments' },
  { value: 'other', label: 'Other' },
] as const

export type FormECategory = (typeof FORM_E_CATEGORIES)[number]['value']

interface CategorySelectorProps {
  questionText: string
  onSelect: (category: string) => void
  onSkip: () => void
}

export function CategorySelector({ questionText, onSelect, onSkip }: CategorySelectorProps) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (!search.trim()) return FORM_E_CATEGORIES
    const term = search.toLowerCase()
    return FORM_E_CATEGORIES.filter(
      (cat) => cat.label.toLowerCase().includes(term) || cat.value.includes(term),
    )
  }, [search])

  return (
    <div>
      <p className="text-xs font-semibold text-ink-tertiary uppercase tracking-wide">
        Processed : Please categorise
      </p>
      <p className="mt-3 text-xl font-semibold text-ink leading-snug">
        {questionText}
      </p>

      <div className="mt-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search categories..."
          className="w-full px-4 py-2.5 text-sm border-2 border-grey-200 rounded-md focus:border-blue-600 focus:outline-none transition-colors"
        />
      </div>

      <div className="mt-2 max-h-[240px] overflow-y-auto space-y-1">
        {filtered.length === 0 ? (
          <p className="py-3 px-4 text-sm text-ink-secondary">No matching categories</p>
        ) : (
          filtered.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelected(cat.value)}
              className={`w-full text-left px-4 py-2.5 text-sm rounded-md transition-colors ${
                selected === cat.value
                  ? 'bg-blue-50 border border-blue-600/20 text-ink font-medium'
                  : 'hover:bg-grey-50 text-ink'
              }`}
            >
              {cat.label}
            </button>
          ))
        )}
      </div>

      <div className="mt-5 flex items-center gap-4">
        <button
          onClick={() => {
            if (selected) onSelect(selected)
          }}
          disabled={!selected}
          className="px-6 py-3 bg-ink text-white text-[15px] font-semibold rounded-md hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {selected
            ? FORM_E_CATEGORIES.find((c) => c.value === selected)?.label || 'Confirm'
            : 'Select a category'}
        </button>
        <button
          onClick={onSkip}
          className="text-sm text-blue-600 hover:underline"
        >
          I&apos;ll answer this later
        </button>
      </div>
    </div>
  )
}

export { FORM_E_CATEGORIES }
