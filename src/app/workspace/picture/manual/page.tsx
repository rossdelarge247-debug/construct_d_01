'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { WorkspaceLayout } from '@/components/workspace/workspace-layout'
import { Button } from '@/components/ui/button'
import { useWorkspace } from '@/hooks/use-workspace'
import { CATEGORY_PRIORITY } from '@/types/workspace'
import { cn } from '@/utils/cn'

const CONFIDENCE_OPTIONS = [
  { value: 'known', label: 'Known', description: 'I have evidence' },
  { value: 'estimated', label: 'Estimated', description: 'Rough idea' },
  { value: 'unknown', label: 'Unknown', description: 'Don\'t know' },
] as const

const OWNERSHIP_OPTIONS = [
  { value: 'yours', label: 'Yours' },
  { value: 'joint', label: 'Joint' },
  { value: 'partners', label: 'Partner\'s' },
  { value: 'unknown', label: 'Don\'t know' },
] as const

export default function ManualEntryPage() {
  const router = useRouter()
  const { addItem } = useWorkspace()

  const [category, setCategory] = useState<string | null>(null)
  const [label, setLabel] = useState('')
  const [value, setValue] = useState('')
  const [period, setPeriod] = useState<'monthly' | 'annual' | 'total'>('total')
  const [confidence, setConfidence] = useState<'known' | 'estimated' | 'unknown'>('estimated')
  const [ownership, setOwnership] = useState<'yours' | 'joint' | 'partners' | 'unknown'>('yours')

  const selectedCategory = CATEGORY_PRIORITY.find(c => c.key === category)

  function handleSave() {
    if (!category || !label) return

    addItem({
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
      is_inherited: false,
      is_pre_marital: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    // Reset for next entry
    setLabel('')
    setValue('')
    setConfidence('estimated')
  }

  return (
    <WorkspaceLayout
      activePhase="build_your_picture"
      breadcrumb={[
        { label: 'Build your picture', href: '/workspace/picture' },
        { label: 'Enter manually', href: '/workspace/picture/manual' },
      ]}
    >
      <div className="max-w-xl space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-medium text-ink">Enter details manually</h1>
          <p className="mt-2 text-sm text-ink-light leading-relaxed">
            Add what you know. Estimates and unknowns are fine — you can update these later when you have evidence.
          </p>
        </div>

        {/* Category selection */}
        {!category && (
          <div className="space-y-3">
            <p className="text-sm text-ink">What would you like to add?</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {CATEGORY_PRIORITY.filter(c => c.key !== 'outgoings' && c.key !== 'budget').map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setCategory(cat.key)}
                  className="rounded-[var(--radius-md)] border border-cream-dark p-3 text-left transition-all hover:border-ink-faint hover:shadow-[var(--shadow-sm)]"
                >
                  <p className="text-sm font-medium text-ink">{cat.label}</p>
                  <p className="mt-0.5 text-xs text-ink-faint">{cat.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Entry form */}
        {category && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-medium text-ink">{selectedCategory?.label}</h2>
              <button onClick={() => setCategory(null)} className="text-xs text-ink-light hover:text-ink transition-colors">
                Change category
              </button>
            </div>

            {/* Label */}
            <div className="space-y-2">
              <label className="text-sm text-ink">What is this?</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder={selectedCategory?.key === 'pensions' ? 'e.g. Workplace pension with Aviva' : selectedCategory?.key === 'property' ? 'e.g. Family home, 12 Oak Lane' : 'e.g. Current account with Barclays'}
                className="w-full rounded-[var(--radius-sm)] border border-cream-dark bg-cream px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint/50 focus:border-warmth focus:outline-none"
              />
            </div>

            {/* Value */}
            <div className="space-y-2">
              <label className="text-sm text-ink">Value <span className="text-ink-faint">(if you know it)</span></label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-ink-faint">£</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="e.g. 85,000"
                  className="w-40 rounded-[var(--radius-sm)] border border-cream-dark bg-cream px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint/50 focus:border-warmth focus:outline-none"
                />
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value as 'monthly' | 'annual' | 'total')}
                  className="rounded-[var(--radius-sm)] border border-cream-dark bg-cream px-2 py-2.5 text-sm text-ink focus:border-warmth focus:outline-none"
                >
                  <option value="total">Total</option>
                  <option value="monthly">Per month</option>
                  <option value="annual">Per year</option>
                </select>
              </div>
            </div>

            {/* Confidence */}
            <div className="space-y-2">
              <label className="text-sm text-ink">How sure are you?</label>
              <div className="flex gap-2">
                {CONFIDENCE_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setConfidence(opt.value)}
                    className={cn(
                      'rounded-full px-3 py-1.5 text-xs font-medium transition-all',
                      confidence === opt.value
                        ? opt.value === 'known' ? 'bg-sage text-cream' : opt.value === 'estimated' ? 'bg-amber text-cream' : 'bg-cream-dark text-ink-light'
                        : 'bg-cream text-ink-faint hover:bg-cream-dark',
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Ownership */}
            <div className="space-y-2">
              <label className="text-sm text-ink">Whose is this?</label>
              <div className="flex gap-2">
                {OWNERSHIP_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setOwnership(opt.value)}
                    className={cn(
                      'rounded-full px-3 py-1.5 text-xs font-medium transition-all',
                      ownership === opt.value
                        ? 'bg-warmth text-cream'
                        : 'bg-cream text-ink-faint hover:bg-cream-dark',
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <Button onClick={handleSave} disabled={!label}>
                Save item
              </Button>
              <Button variant="secondary" onClick={() => router.push('/workspace/picture')}>
                Upload documents instead
              </Button>
            </div>

            <p className="text-xs text-ink-faint">
              You can add evidence documents later to strengthen this item.
            </p>
          </div>
        )}
      </div>
    </WorkspaceLayout>
  )
}
