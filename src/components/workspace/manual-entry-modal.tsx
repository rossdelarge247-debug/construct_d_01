'use client'

import { useState } from 'react'
import { Modal } from '@/components/workspace/modal'
import { Button } from '@/components/ui/button'
import { CATEGORY_PRIORITY } from '@/types/workspace'
import type { FinancialPictureItem } from '@/types/workspace'
import { cn } from '@/utils/cn'

interface ManualEntryModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (item: FinancialPictureItem) => void
  defaultCategory?: string
}

const CONFIDENCE = [
  { value: 'known' as const, label: 'Known', desc: 'I have evidence', activeClass: 'bg-sage text-white' },
  { value: 'estimated' as const, label: 'Estimated', desc: 'Rough idea', activeClass: 'bg-amber text-white' },
  { value: 'unknown' as const, label: 'Unknown', desc: 'Don\'t know', activeClass: 'bg-cream-dark text-ink-light' },
]

const OWNERSHIP = [
  { value: 'yours' as const, label: 'Yours' },
  { value: 'joint' as const, label: 'Joint' },
  { value: 'partners' as const, label: 'Partner\'s' },
  { value: 'unknown' as const, label: 'Don\'t know' },
]

export function ManualEntryModal({ isOpen, onClose, onSave, defaultCategory }: ManualEntryModalProps) {
  const [category, setCategory] = useState(defaultCategory || '')
  const [label, setLabel] = useState('')
  const [value, setValue] = useState('')
  const [period, setPeriod] = useState<'monthly' | 'annual' | 'total'>('total')
  const [confidence, setConfidence] = useState<'known' | 'estimated' | 'unknown'>('estimated')
  const [ownership, setOwnership] = useState<'yours' | 'joint' | 'partners' | 'unknown'>('yours')
  const [isInherited, setIsInherited] = useState(false)
  const [isPreMarital, setIsPreMarital] = useState(false)

  const selectedCat = CATEGORY_PRIORITY.find(c => c.key === category)

  function handleSave() {
    if (!category || !label) return

    onSave({
      id: crypto.randomUUID(),
      category: category as never,
      subcategory: category,
      label,
      value: value ? parseFloat(value.replace(/,/g, '')) : null,
      currency: 'GBP',
      period: value ? period : null,
      ownership,
      split: ownership === 'joint' ? 50 : ownership === 'yours' ? 100 : 0,
      confidence,
      status: confidence === 'known' ? 'confirmed' : 'estimated',
      source_document_id: null,
      notes: null,
      is_inherited: isInherited,
      is_pre_marital: isPreMarital,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    // Reset
    setLabel('')
    setValue('')
    setConfidence('estimated')
    setIsInherited(false)
    setIsPreMarital(false)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add an item">
      <div className="space-y-6">

        {/* Category — only show if not pre-selected */}
        {!defaultCategory && (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-ink">Category</label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORY_PRIORITY.filter(c => !['outgoings', 'budget'].includes(c.key)).map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setCategory(cat.key)}
                  className={cn(
                    'rounded-[var(--radius-sm)] border-[var(--border-card)] p-3 text-left text-sm transition-all',
                    category === cat.key
                      ? 'border-warmth bg-warmth-light/20 font-semibold text-ink'
                      : 'border-cream-dark bg-cream hover:border-ink-faint text-ink-light',
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {(category || defaultCategory) && (
          <>
            {/* Label */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-ink">What is this?</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder={selectedCat?.key === 'pensions' ? 'e.g. Workplace pension with Aviva' : 'e.g. Current account with Barclays'}
                className="w-full rounded-[var(--radius-sm)] border-[var(--border-card)] border-cream-dark bg-cream px-4 py-3 text-sm text-ink placeholder:text-ink-faint/50 focus:border-warmth focus:outline-none"
                autoFocus
              />
            </div>

            {/* Value */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-ink">Value <span className="text-ink-faint font-normal">(if you know it)</span></label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-ink-faint">£</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="e.g. 85,000"
                  className="w-40 rounded-[var(--radius-sm)] border-[var(--border-card)] border-cream-dark bg-cream px-4 py-3 text-sm text-ink placeholder:text-ink-faint/50 focus:border-warmth focus:outline-none"
                />
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value as 'monthly' | 'annual' | 'total')}
                  className="rounded-[var(--radius-sm)] border-[var(--border-card)] border-cream-dark bg-cream px-3 py-3 text-sm text-ink focus:border-warmth focus:outline-none"
                >
                  <option value="total">Total</option>
                  <option value="monthly">Per month</option>
                  <option value="annual">Per year</option>
                </select>
              </div>
            </div>

            {/* Confidence */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-ink">How sure are you?</label>
              <div className="flex gap-2">
                {CONFIDENCE.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setConfidence(opt.value)}
                    className={cn(
                      'rounded-full px-4 py-2 text-xs font-bold transition-all active:scale-95',
                      confidence === opt.value ? opt.activeClass : 'bg-cream-dark text-ink-faint hover:bg-cream-dark/80',
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Ownership */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-ink">Whose is this?</label>
              <div className="flex flex-wrap gap-2">
                {OWNERSHIP.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setOwnership(opt.value)}
                    className={cn(
                      'rounded-full px-4 py-2 text-xs font-bold transition-all active:scale-95',
                      ownership === opt.value ? 'bg-warmth text-white' : 'bg-cream-dark text-ink-faint hover:bg-cream-dark/80',
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Flags */}
            <div className="space-y-3">
              <label className="flex items-center gap-3 text-sm text-ink-light cursor-pointer">
                <input type="checkbox" checked={isInherited} onChange={(e) => setIsInherited(e.target.checked)} className="h-4 w-4 rounded border-cream-dark accent-warmth" />
                This was inherited
              </label>
              <label className="flex items-center gap-3 text-sm text-ink-light cursor-pointer">
                <input type="checkbox" checked={isPreMarital} onChange={(e) => setIsPreMarital(e.target.checked)} className="h-4 w-4 rounded border-cream-dark accent-warmth" />
                This is a pre-marital asset
              </label>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between border-t-[var(--border-card)] border-cream-dark pt-5">
              <button onClick={onClose} className="text-sm font-semibold text-ink-faint hover:text-ink transition-colors">
                Cancel
              </button>
              <Button onClick={handleSave} disabled={!label}>
                Save item
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}
