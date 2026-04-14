'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { X } from 'lucide-react'
import {
  SPENDING_CATEGORIES,
  type SpendingSubCategory,
  type SpendingSubCategoryDef,
  type SpendingItem,
} from '@/types/hub'
import { toMonthly, type DemoTransaction } from '@/lib/bank/bank-data-utils'
import { SpendingSearch, type SearchResult } from './spending-search'

// S2a-S2f — Per sub-category confirmation loop
// Walks through each spending category: show found → gap question → search → summary

type CatPhase =
  | 'show_found'   // S2a/S2f: show detected items
  | 'gap_ask'      // S2b: "did we miss anything?"
  | 'gap_select'   // S2c: checkboxes for additional cost types
  | 'search'       // S2d: transaction search (delegated to SpendingSearch)
  | 'sub_summary'  // S2e: sub-category mini summary

interface SpendingCategoriseProps {
  categories: SpendingSubCategoryDef[]
  detectedItems: Record<string, { payee: string; amount: number; frequency: string }[]>
  transactions: DemoTransaction[]
  hasChildren: boolean
  onComplete: (results: Record<SpendingSubCategory, SpendingItem[]>) => void
}

export function SpendingCategorise({
  categories,
  detectedItems,
  transactions,
  hasChildren,
  onComplete,
}: SpendingCategoriseProps) {
  const activeCats = categories.filter((c) => c.key !== 'children' || hasChildren)
  const [catIndex, setCatIndex] = useState(0)
  const [phase, setPhase] = useState<CatPhase>('show_found')
  const [results, setResults] = useState<Record<string, SpendingItem[]>>({})
  const [currentItems, setCurrentItems] = useState<SpendingItem[]>([])
  const [selectedGapTypes, setSelectedGapTypes] = useState<string[]>([])
  const [searchQueue, setSearchQueue] = useState<string[]>([])

  const currentCat = activeCats[catIndex]
  const detected = detectedItems[currentCat?.key] ?? []
  const isHighConfidence = detected.length >= 3

  // Initialise current items from detected data when entering a new category
  const initCategoryItems = useCallback((cat: SpendingSubCategoryDef) => {
    const items = (detectedItems[cat.key] ?? []).map((d, i) => ({
      id: `${cat.key}-detected-${i}`,
      subCategory: cat.key,
      label: d.payee,
      amount: d.amount,
      frequency: d.frequency as SpendingItem['frequency'],
      monthlyEquivalent: toMonthly(d.amount, d.frequency as SpendingItem['frequency']),
      source: 'bank' as const,
    }))
    setCurrentItems(items)
  }, [detectedItems])

  // Init the first category on mount
  const initialised = useRef(false)
  useEffect(() => {
    if (!initialised.current && currentCat) {
      initCategoryItems(currentCat)
      initialised.current = true
    }
  }, [currentCat, initCategoryItems])

  const removeItem = (id: string) => {
    setCurrentItems((prev) => prev.filter((item) => item.id !== id))
  }

  const advanceToNextCategory = useCallback(() => {
    // Save current category results
    const updated = { ...results, [currentCat.key]: currentItems }
    setResults(updated)

    const next = catIndex + 1
    if (next >= activeCats.length) {
      onComplete(updated as Record<SpendingSubCategory, SpendingItem[]>)
    } else {
      setCatIndex(next)
      setPhase('show_found')
      setSelectedGapTypes([])
      setSearchQueue([])
      initCategoryItems(activeCats[next])
    }
  }, [results, currentItems, currentCat, catIndex, activeCats, onComplete, initCategoryItems])

  const handleFoundConfirm = () => {
    setPhase('gap_ask')
  }

  const handleGapAnswer = (hasMore: boolean) => {
    if (hasMore) {
      setPhase('gap_select')
    } else {
      setPhase('sub_summary')
    }
  }

  const handleGapSelectDone = () => {
    if (selectedGapTypes.length > 0) {
      setSearchQueue([...selectedGapTypes])
      setPhase('search')
    } else {
      setPhase('sub_summary')
    }
  }

  const handleSearchComplete = (result: SearchResult) => {
    const newItem: SpendingItem = {
      id: `${currentCat.key}-search-${Date.now()}`,
      subCategory: currentCat.key,
      label: result.label,
      amount: result.totalAmount,
      frequency: result.frequency,
      monthlyEquivalent: result.monthlyEquivalent,
      source: 'search',
    }
    setCurrentItems((prev) => [...prev, newItem])

    // Move to next item in search queue
    const remaining = searchQueue.slice(1)
    if (remaining.length > 0) {
      setSearchQueue(remaining)
    } else {
      setPhase('sub_summary')
    }
  }

  const handleSearchSkip = () => {
    const remaining = searchQueue.slice(1)
    if (remaining.length > 0) {
      setSearchQueue(remaining)
    } else {
      setPhase('sub_summary')
    }
  }

  if (!currentCat) return null

  return (
    <div className="animate-fade-in">
      {/* Sub-category breadcrumb bar */}
      <SubCategoryBreadcrumb
        categories={activeCats}
        currentIndex={catIndex}
      />

      {/* Phase-specific content */}
      {phase === 'show_found' && (
        <ShowFoundItems
          category={currentCat}
          items={currentItems}
          isHighConfidence={isHighConfidence}
          onRemove={removeItem}
          onConfirm={handleFoundConfirm}
        />
      )}

      {phase === 'gap_ask' && (
        <GapQuestion
          category={currentCat}
          onAnswer={handleGapAnswer}
          onSkip={() => setPhase('sub_summary')}
        />
      )}

      {phase === 'gap_select' && (
        <GapSelect
          category={currentCat}
          selected={selectedGapTypes}
          onToggle={(type) => {
            setSelectedGapTypes((prev) =>
              prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
            )
          }}
          onDone={handleGapSelectDone}
          onSkip={() => setPhase('sub_summary')}
        />
      )}

      {phase === 'search' && searchQueue.length > 0 && (
        <SpendingSearch
          key={searchQueue[0]}
          label={searchQueue[0]}
          transactions={transactions}
          onComplete={handleSearchComplete}
          onSkip={handleSearchSkip}
        />
      )}

      {phase === 'sub_summary' && (
        <SubCategorySummary
          category={currentCat}
          items={currentItems}
          isLast={catIndex === activeCats.length - 1}
          onNext={advanceToNextCategory}
          onBack={() => setPhase('show_found')}
        />
      )}
    </div>
  )
}

// ═══ Sub-category breadcrumb (information scent, not clickable) ═══

function SubCategoryBreadcrumb({
  categories,
  currentIndex,
}: {
  categories: SpendingSubCategoryDef[]
  currentIndex: number
}) {
  return (
    <div className="flex items-baseline gap-2 mb-4 overflow-hidden whitespace-nowrap">
      <span className="text-[12px] font-semibold text-ink-tertiary uppercase tracking-wider shrink-0">
        Spending:
      </span>
      {categories.map((cat, i) => {
        const isCurrent = i === currentIndex
        const offset = i - currentIndex
        const opacity = isCurrent ? 1 : offset === 1 ? 0.6 : offset === 2 ? 0.4 : 0.3
        return (
          <span
            key={cat.key}
            className="text-[13px] shrink-0 transition-opacity"
            style={{
              fontWeight: isCurrent ? 700 : 400,
              color: 'var(--color-ink)',
              opacity,
              transitionDuration: '200ms',
            }}
          >
            {cat.label}
          </span>
        )
      })}
    </div>
  )
}

// ═══ S2a/S2f — Show found items ═══

function ShowFoundItems({
  category,
  items,
  isHighConfidence,
  onRemove,
  onConfirm,
}: {
  category: SpendingSubCategoryDef
  items: SpendingItem[]
  isHighConfidence: boolean
  onRemove: (id: string) => void
  onConfirm: () => void
}) {
  const hasItems = items.length > 0
  const title = hasItems
    ? `We've built an initial picture of your ${category.label.toLowerCase()}`
    : `We didn't find any ${category.label.toLowerCase()} in your bank data`

  return (
    <div>
      <h3 className="text-[22px] font-bold text-ink leading-snug mb-4">{title}</h3>

      {hasItems && (
        <div className="space-y-2 mb-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between px-4 py-3"
              style={{
                border: '1px solid var(--color-grey-100)',
                borderRadius: 'var(--radius-card)',
              }}
            >
              <span className="text-[15px] text-ink">
                {item.label}, average £{item.amount.toLocaleString()}
                {item.frequency !== 'one_off' && ` ${item.frequency}`}
              </span>
              <button
                onClick={() => onRemove(item.id)}
                className="text-ink-tertiary hover:text-ink-secondary transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6">
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
          {hasItems ? (isHighConfidence ? 'These are all correct' : 'These are correct') : 'Continue'}
        </button>
      </div>
    </div>
  )
}

// ═══ S2b — Gap question ═══

function GapQuestion({
  category,
  onAnswer,
  onSkip,
}: {
  category: SpendingSubCategoryDef
  onAnswer: (hasMore: boolean) => void
  onSkip: () => void
}) {
  const [selected, setSelected] = useState<boolean | null>(null)

  return (
    <div>
      <h3 className="text-[22px] font-bold text-ink leading-snug mb-6">
        We didn&apos;t see any other {category.label.toLowerCase()}, did we miss any{' '}
        {category.otherOptions.slice(0, 3).map((o) => o.toLowerCase()).join(', ')}
        , or other {category.label.toLowerCase()}?
      </h3>

      <div className="space-y-2">
        <RadioOption
          label={`No I don't have any other ${category.label.toLowerCase()}`}
          selected={selected === false}
          onClick={() => setSelected(false)}
        />
        <RadioOption
          label={`Yes, I have more ${category.label.toLowerCase()}`}
          selected={selected === true}
          onClick={() => setSelected(true)}
        />
      </div>

      <div className="mt-8 flex items-center gap-4">
        <button
          onClick={() => selected !== null && onAnswer(selected)}
          disabled={selected === null}
          className="px-8 py-3.5 text-white text-[15px] font-semibold transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            backgroundColor: 'var(--color-red-500)',
            borderRadius: 'var(--radius-card)',
          }}
          onMouseEnter={(e) => { if (selected !== null) e.currentTarget.style.backgroundColor = 'var(--color-red-600)' }}
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

// ═══ S2c — Gap select (checkboxes) ═══

function GapSelect({
  category,
  selected,
  onToggle,
  onDone,
  onSkip,
}: {
  category: SpendingSubCategoryDef
  selected: string[]
  onToggle: (type: string) => void
  onDone: () => void
  onSkip: () => void
}) {
  return (
    <div>
      <h3 className="text-[22px] font-bold text-ink leading-snug mb-6">
        What are your additional {category.label.toLowerCase()}?
      </h3>

      <div className="space-y-2">
        {category.otherOptions.map((opt) => (
          <label
            key={opt}
            className="flex items-center gap-3 px-5 py-4 cursor-pointer transition-colors hover:bg-grey-50"
            style={{
              border: `1.5px solid ${selected.includes(opt) ? 'var(--color-ink)' : 'var(--color-grey-100)'}`,
              borderRadius: 'var(--radius-card)',
            }}
          >
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={() => onToggle(opt)}
              className="w-4.5 h-4.5 rounded border-grey-200 accent-ink"
            />
            <span className="text-[15px] text-ink">{opt}</span>
          </label>
        ))}
      </div>

      <div className="mt-8 flex items-center gap-4">
        <button
          onClick={onDone}
          disabled={selected.length === 0}
          className="px-8 py-3.5 text-white text-[15px] font-semibold transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            backgroundColor: 'var(--color-red-500)',
            borderRadius: 'var(--radius-card)',
          }}
          onMouseEnter={(e) => { if (selected.length > 0) e.currentTarget.style.backgroundColor = 'var(--color-red-600)' }}
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

// ═══ S2e — Sub-category summary ═══

function SubCategorySummary({
  category,
  items,
  isLast,
  onNext,
  onBack,
}: {
  category: SpendingSubCategoryDef
  items: SpendingItem[]
  isLast: boolean
  onNext: () => void
  onBack: () => void
}) {
  return (
    <div>
      <h3 className="text-[22px] font-bold text-ink leading-snug mb-4">
        {category.label} summary
      </h3>

      {items.length === 0 ? (
        <p className="text-[15px] text-ink-secondary mb-6">
          No {category.label.toLowerCase()} to report.
        </p>
      ) : (
        <div className="space-y-2 mb-6">
          {items.map((item) => {
            const showCalc = item.frequency !== 'monthly' && item.frequency !== 'one_off'
            const isAnnual = item.frequency === 'annual'
            return (
              <div
                key={item.id}
                className="flex items-start justify-between py-2.5"
              >
                <div>
                  <span className="text-[15px] text-ink">
                    {item.label}, average £{item.monthlyEquivalent.toLocaleString()} monthly
                  </span>
                  {showCalc && (
                    <p className="text-[13px] text-ink-tertiary mt-0.5 ml-4">
                      {isAnnual
                        ? `£${item.amount.toLocaleString()} annual, calculated @ £${item.monthlyEquivalent.toLocaleString()} monthly`
                        : `£${item.amount.toLocaleString()} ${item.frequency}, calculated @ £${item.monthlyEquivalent.toLocaleString()} monthly`
                      }
                    </p>
                  )}
                </div>
                <button className="text-[13px] text-blue-600 hover:opacity-80 shrink-0 ml-4">
                  Edit
                </button>
              </div>
            )
          })}
        </div>
      )}

      <div className="flex items-center gap-4">
        <button
          onClick={onNext}
          className="px-8 py-3.5 text-white text-[15px] font-semibold transition-colors active:scale-[0.98]"
          style={{
            backgroundColor: 'var(--color-red-500)',
            borderRadius: 'var(--radius-card)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-red-600)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-red-500)')}
        >
          {isLast ? 'Complete spending' : 'Next section'}
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

// ═══ Shared radio option ═══

function RadioOption({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-5 py-4 transition-all"
      style={{
        borderRadius: 'var(--radius-card)',
        border: `1.5px solid ${selected ? 'var(--color-ink)' : 'var(--color-grey-100)'}`,
        backgroundColor: selected ? 'var(--color-ink)' : 'white',
        color: selected ? 'white' : 'var(--color-ink)',
        transitionDuration: '200ms',
        transitionTimingFunction: 'ease',
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
          style={{
            border: selected ? '2px solid white' : '2px solid var(--color-grey-200)',
          }}
        >
          {selected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
        </div>
        <span className="text-[15px] font-medium">{label}</span>
      </div>
    </button>
  )
}
