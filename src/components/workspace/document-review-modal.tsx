'use client'

import { useState } from 'react'
import { Modal } from '@/components/workspace/modal'
import { Button } from '@/components/ui/button'
import type { FinancialPictureItem } from '@/types/workspace'
import { cn } from '@/utils/cn'

interface DocumentReviewModalProps {
  isOpen: boolean
  onClose: () => void
  item: FinancialPictureItem | null
  onSave: (id: string, updates: Partial<FinancialPictureItem>) => void
}

const CONFIDENCE = [
  { value: 'known' as const, label: 'Known', cls: 'bg-sage text-white' },
  { value: 'estimated' as const, label: 'Estimated', cls: 'bg-amber text-white' },
  { value: 'unknown' as const, label: 'Unknown', cls: 'bg-cream-dark text-ink-light' },
]

const OWNERSHIP = [
  { value: 'yours' as const, label: 'Yours' },
  { value: 'joint' as const, label: 'Joint' },
  { value: 'partners' as const, label: "Partner's" },
  { value: 'unknown' as const, label: "Don't know" },
]

export function DocumentReviewModal({ isOpen, onClose, item, onSave }: DocumentReviewModalProps) {
  const [label, setLabel] = useState(item?.label || '')
  const [value, setValue] = useState(item?.value?.toString() || '')
  const [period, setPeriod] = useState<'monthly' | 'annual' | 'total'>(item?.period || 'total')
  const [confidence, setConfidence] = useState(item?.confidence || 'estimated')
  const [ownership, setOwnership] = useState(item?.ownership || 'yours')
  const [split, setSplit] = useState(item?.split?.toString() || '50')
  const [isInherited, setIsInherited] = useState(item?.is_inherited || false)
  const [isPreMarital, setIsPreMarital] = useState(item?.is_pre_marital || false)
  const [notes, setNotes] = useState(item?.notes || '')

  // Reset state when item changes
  if (item && label !== item.label && !label) {
    setLabel(item.label)
    setValue(item.value?.toString() || '')
    setPeriod(item.period || 'total')
    setConfidence(item.confidence)
    setOwnership(item.ownership)
    setSplit(item.split?.toString() || '50')
    setIsInherited(item.is_inherited)
    setIsPreMarital(item.is_pre_marital)
    setNotes(item.notes || '')
  }

  function handleSave() {
    if (!item) return
    onSave(item.id, {
      label,
      value: value ? parseFloat(value.replace(/,/g, '')) : null,
      period: value ? period : null,
      confidence,
      ownership,
      split: ownership === 'joint' ? parseInt(split) || 50 : ownership === 'yours' ? 100 : 0,
      is_inherited: isInherited,
      is_pre_marital: isPreMarital,
      notes: notes || null,
    })
    onClose()
  }

  if (!item) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit item" maxWidth="max-w-2xl">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left: Document preview (or placeholder) */}
        <div className="rounded-[var(--radius-md)] border-[var(--border-card)] border-cream-dark bg-cream-dark/20 p-6 flex flex-col items-center justify-center min-h-[300px]">
          {item.source_document_id ? (
            <div className="text-center space-y-3">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[var(--radius-md)] bg-cream-dark">
                <span className="text-2xl">📄</span>
              </div>
              <p className="text-sm font-semibold text-ink">Source document</p>
              <p className="text-xs text-ink-faint">{item.notes || 'Uploaded document'}</p>
              <Button variant="secondary" size="sm">View full document</Button>
            </div>
          ) : (
            <div className="text-center space-y-3">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[var(--radius-md)] bg-cream-dark">
                <span className="text-2xl text-ink-faint">📎</span>
              </div>
              <p className="text-sm text-ink-faint">No document linked</p>
              <p className="text-xs text-ink-faint">Upload evidence to strengthen this item</p>
              <Button variant="secondary" size="sm">Upload evidence</Button>
            </div>
          )}
        </div>

        {/* Right: Editable fields */}
        <div className="space-y-5">
          {/* Label */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-[0.1em] text-ink-faint">Description</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full rounded-[var(--radius-sm)] border-[var(--border-card)] border-cream-dark bg-cream px-4 py-3 text-sm font-semibold text-ink focus:border-warmth focus:outline-none"
            />
          </div>

          {/* Value + period */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-[0.1em] text-ink-faint">Value</label>
            <div className="flex gap-2">
              <div className="flex items-center gap-1 flex-1">
                <span className="text-sm font-bold text-ink-faint">£</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="0"
                  className="w-full rounded-[var(--radius-sm)] border-[var(--border-card)] border-cream-dark bg-cream px-4 py-3 text-sm text-ink tabular-nums focus:border-warmth focus:outline-none"
                />
              </div>
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
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-[0.1em] text-ink-faint">Confidence</label>
            <div className="flex gap-2">
              {CONFIDENCE.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setConfidence(opt.value)}
                  className={cn(
                    'rounded-full px-4 py-2 text-xs font-bold transition-all active:scale-95',
                    confidence === opt.value ? opt.cls : 'bg-cream-dark text-ink-faint hover:bg-cream-dark/80',
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Ownership + split */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-[0.1em] text-ink-faint">Ownership</label>
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
            {ownership === 'joint' && (
              <div className="mt-2 flex items-center gap-2">
                <label className="text-xs text-ink-faint">Your share:</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={split}
                  onChange={(e) => setSplit(e.target.value)}
                  className="w-20 rounded-[var(--radius-sm)] border-[var(--border-card)] border-cream-dark bg-cream px-3 py-2 text-sm text-ink tabular-nums focus:border-warmth focus:outline-none"
                />
                <span className="text-xs text-ink-faint">%</span>
              </div>
            )}
          </div>

          {/* Flags */}
          <div className="space-y-2">
            <label className="flex items-center gap-3 text-sm text-ink-light cursor-pointer">
              <input type="checkbox" checked={isInherited} onChange={(e) => setIsInherited(e.target.checked)} className="h-4 w-4 rounded border-cream-dark accent-warmth" />
              Inherited asset
            </label>
            <label className="flex items-center gap-3 text-sm text-ink-light cursor-pointer">
              <input type="checkbox" checked={isPreMarital} onChange={(e) => setIsPreMarital(e.target.checked)} className="h-4 w-4 rounded border-cream-dark accent-warmth" />
              Pre-marital asset
            </label>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-[0.1em] text-ink-faint">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Any additional context..."
              className="w-full rounded-[var(--radius-sm)] border-[var(--border-card)] border-cream-dark bg-cream px-4 py-3 text-sm text-ink placeholder:text-ink-faint/50 focus:border-warmth focus:outline-none resize-none"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center justify-between border-t-[var(--border-card)] border-cream-dark pt-5">
        <button onClick={onClose} className="text-sm font-semibold text-ink-faint hover:text-ink transition-colors">
          Cancel
        </button>
        <Button onClick={handleSave}>Save changes</Button>
      </div>
    </Modal>
  )
}
