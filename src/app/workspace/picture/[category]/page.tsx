'use client'

import { useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { WorkspaceLayout } from '@/components/workspace/workspace-layout'
import { DocumentUpload } from '@/components/workspace/document-upload'
import { ExtractionReview } from '@/components/workspace/extraction-review'
import { CetvTracker, type CetvRequest } from '@/components/workspace/cetv-tracker'
import { MicroMoment } from '@/components/interview/micro-moment'
import { Button } from '@/components/ui/button'
import { useWorkspace } from '@/hooks/use-workspace'
import { CATEGORY_PRIORITY } from '@/types/workspace'
import type { ExtractionResult, ClassificationResult } from '@/lib/documents/processor'
import { cn } from '@/utils/cn'
import Link from 'next/link'

function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) return '—'
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: amount < 100 ? 2 : 0 }).format(amount)
}

const CONFIDENCE_OPTIONS = [
  { value: 'known', label: 'Known' },
  { value: 'estimated', label: 'Estimated' },
  { value: 'unknown', label: 'Unknown' },
] as const

const OWNERSHIP_OPTIONS = [
  { value: 'yours', label: 'Yours' },
  { value: 'joint', label: 'Joint' },
  { value: 'partners', label: 'Partner\'s' },
  { value: 'unknown', label: 'Don\'t know' },
] as const

type ViewState = 'overview' | 'upload' | 'reviewing' | 'manual'

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const categoryKey = params.category as string
  const categoryInfo = CATEGORY_PRIORITY.find(c => c.key === categoryKey)

  const { items, addItem, updateItem, removeItem, setSpending } = useWorkspace()
  const [view, setView] = useState<ViewState>('overview')
  const [extractionResult, setExtractionResult] = useState<ExtractionResult | null>(null)
  const [classification, setClassification] = useState<ClassificationResult | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  // CETV state (for pensions category)
  const [cetvRequests, setCetvRequests] = useState<CetvRequest[]>([])

  // Manual entry state
  const [manualLabel, setManualLabel] = useState('')
  const [manualValue, setManualValue] = useState('')
  const [manualPeriod, setManualPeriod] = useState<'monthly' | 'annual' | 'total'>('total')
  const [manualConfidence, setManualConfidence] = useState<'known' | 'estimated' | 'unknown'>('estimated')
  const [manualOwnership, setManualOwnership] = useState<'yours' | 'joint' | 'partners' | 'unknown'>('yours')

  // Items for this category
  const categoryItems = items.filter(i =>
    i.category === categoryKey || i.subcategory === categoryKey ||
    (categoryKey === 'current_account' && (i.category === 'income' || i.subcategory === 'current_account'))
  )

  const handleProcessed = useCallback((result: { classification: unknown; extraction: unknown; message: string }) => {
    const classResult = result.classification as ClassificationResult | null
    const extractResult = result.extraction as ExtractionResult | null
    setClassification(classResult)
    setMessage(result.message)

    if (extractResult && extractResult.items.length > 0) {
      setExtractionResult(extractResult)
      setView('reviewing')
    }
  }, [])

  const handleConfirmAll = useCallback((
    confirmedItems: ExtractionResult['items'],
    spending: ExtractionResult['spending_categories'],
  ) => {
    confirmedItems.forEach(item => {
      addItem({
        id: crypto.randomUUID(),
        category: item.category as never,
        subcategory: item.subcategory || categoryKey,
        label: item.label,
        value: item.value,
        currency: 'GBP',
        period: item.period,
        ownership: item.ownership_hint === 'joint' ? 'joint' : item.ownership_hint === 'yours' ? 'yours' : 'unknown',
        split: item.ownership_hint === 'joint' ? 50 : 100,
        confidence: item.confidence >= 0.9 ? 'known' : 'estimated',
        status: 'confirmed',
        source_document_id: null,
        notes: item.source_description,
        is_inherited: false,
        is_pre_marital: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    })
    if (spending) {
      setSpending(spending.map(s => ({ category: s.category, monthly_average: s.monthly_average, transaction_count: s.transaction_count, examples: s.examples })))
    }
    setView('overview')
    setExtractionResult(null)
  }, [addItem, setSpending, categoryKey])

  function handleManualSave() {
    if (!manualLabel) return
    addItem({
      id: crypto.randomUUID(),
      category: categoryKey as never,
      subcategory: categoryKey,
      label: manualLabel,
      value: manualValue ? parseFloat(manualValue.replace(/,/g, '')) : null,
      currency: 'GBP',
      period: manualValue ? manualPeriod : null,
      ownership: manualOwnership,
      split: manualOwnership === 'joint' ? 50 : manualOwnership === 'yours' ? 100 : 0,
      confidence: manualConfidence,
      status: manualConfidence === 'known' ? 'confirmed' : 'estimated',
      source_document_id: null,
      notes: null,
      is_inherited: false,
      is_pre_marital: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    setManualLabel('')
    setManualValue('')
    setManualConfidence('estimated')
  }

  if (!categoryInfo) {
    return (
      <WorkspaceLayout activePhase="build_your_picture" >
        <div className="py-12 text-center">
          <p className="text-ink-light">Category not found.</p>
          <Link href="/workspace" className="mt-2 text-sm text-warmth-dark hover:text-warmth">Back to workspace</Link>
        </div>
      </WorkspaceLayout>
    )
  }

  const isPensions = categoryKey === 'pensions'

  return (
    <WorkspaceLayout
      activePhase="build_your_picture"
    >
      <div className="max-w-xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-heading text-2xl font-medium text-ink">{categoryInfo.label}</h1>
          <p className="mt-1 text-sm text-ink-light leading-relaxed">{categoryInfo.description}</p>
          <p className="mt-1 text-xs text-ink-faint">Form E section: {categoryInfo.formE}</p>
        </div>

        {/* Overview — existing items + actions */}
        {view === 'overview' && (
          <div className="space-y-6">
            {/* Existing items */}
            {categoryItems.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-medium uppercase tracking-wide text-ink-faint">
                  {categoryItems.length} item{categoryItems.length !== 1 ? 's' : ''} captured
                </h3>
                {categoryItems.map(item => (
                  <div key={item.id} className="rounded-[var(--radius-md)] border border-cream-dark p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-ink">{item.label}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className={cn(
                            'rounded-full px-2 py-0.5 text-[10px] font-medium',
                            item.confidence === 'known' ? 'bg-sage-light text-sage-dark' :
                            item.confidence === 'estimated' ? 'bg-amber-light text-amber' :
                            'bg-cream-dark text-ink-faint',
                          )}>
                            {item.confidence}
                          </span>
                          <span className="rounded-full bg-cream-dark px-2 py-0.5 text-[10px] text-ink-faint capitalize">
                            {item.ownership === 'yours' ? 'Yours' : item.ownership === 'joint' ? `Joint · ${item.split}% yours` : item.ownership === 'partners' ? "Partner's" : 'Unknown'}
                          </span>
                          {item.is_inherited && <span className="rounded-full bg-cream-dark px-2 py-0.5 text-[10px] text-ink-faint">Inherited</span>}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-ink">
                          {item.value !== null ? formatCurrency(item.value) : '—'}
                          {item.period === 'monthly' && <span className="text-xs text-ink-faint">/mo</span>}
                          {item.period === 'annual' && <span className="text-xs text-ink-faint">/yr</span>}
                        </p>
                      </div>
                    </div>
                    {item.notes && <p className="text-xs text-ink-faint">{item.notes}</p>}
                    <div className="flex gap-3">
                      <button onClick={() => removeItem(item.id)} className="text-xs text-ink-faint hover:text-warmth-dark transition-colors">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {categoryItems.length === 0 && (
              <div className="rounded-[var(--radius-md)] border border-cream-dark p-6 text-center space-y-2">
                <p className="text-sm text-ink-light">No items yet for {categoryInfo.label.toLowerCase()}.</p>
                <p className="text-xs text-ink-faint">Upload a document or add details manually.</p>
              </div>
            )}

            {/* CETV tracker — pensions only */}
            {isPensions && (
              <CetvTracker
                requests={cetvRequests}
                onAdd={(req) => setCetvRequests(prev => [...prev, req])}
                onUpdate={(id, updates) => setCetvRequests(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r))}
              />
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => setView('upload')} size="sm">Upload document</Button>
              <Button onClick={() => setView('manual')} variant="secondary" size="sm">Add manually</Button>
            </div>

            {/* Message from last upload */}
            {message && (
              <div className="rounded-[var(--radius-md)] border border-cream-dark p-3">
                <p className="text-xs text-ink-light">{message}</p>
              </div>
            )}

            <Link href="/workspace" className="block text-sm text-ink-light hover:text-ink transition-colors">
              ← Back to overview
            </Link>
          </div>
        )}

        {/* Upload view */}
        {view === 'upload' && (
          <div className="space-y-4">
            <DocumentUpload
              onProcessed={handleProcessed}
              prompt={`Upload a ${categoryInfo.label.toLowerCase()} document`}
              hint={`Best document: ${categoryInfo.idealDocs}`}
            />
            <button onClick={() => setView('overview')} className="text-sm text-ink-light hover:text-ink transition-colors">
              ← Back
            </button>
          </div>
        )}

        {/* Review view */}
        {view === 'reviewing' && extractionResult && (
          <div className="space-y-4">
            {classification && (
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-cream-dark px-2.5 py-0.5 text-xs text-ink-light">
                  {classification.document_type.replace(/_/g, ' ')}
                </span>
                {classification.provider_name && (
                  <span className="text-xs text-ink-faint">{classification.provider_name}</span>
                )}
              </div>
            )}
            <ExtractionReview
              items={extractionResult.items}
              spending={extractionResult.spending_categories}
              accounts={extractionResult.accounts}
              summary={extractionResult.raw_summary}
              onConfirmAll={(items, spending) => handleConfirmAll(items, spending)}
              onDismiss={() => { setView('overview'); setExtractionResult(null) }}
            />
          </div>
        )}

        {/* Manual entry view */}
        {view === 'manual' && (
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm text-ink">What is this?</label>
              <input
                type="text"
                value={manualLabel}
                onChange={(e) => setManualLabel(e.target.value)}
                placeholder={`e.g. ${categoryKey === 'pensions' ? 'Workplace pension with Aviva' : categoryKey === 'property' ? 'Family home, 12 Oak Lane' : 'Current account with Barclays'}`}
                className="w-full rounded-[var(--radius-sm)] border border-cream-dark bg-cream px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint/50 focus:border-warmth focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-ink">Value <span className="text-ink-faint">(if you know it)</span></label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-ink-faint">£</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={manualValue}
                  onChange={(e) => setManualValue(e.target.value)}
                  placeholder="e.g. 85,000"
                  className="w-40 rounded-[var(--radius-sm)] border border-cream-dark bg-cream px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint/50 focus:border-warmth focus:outline-none"
                />
                <select value={manualPeriod} onChange={(e) => setManualPeriod(e.target.value as 'monthly' | 'annual' | 'total')} className="rounded-[var(--radius-sm)] border border-cream-dark bg-cream px-2 py-2.5 text-sm text-ink focus:border-warmth focus:outline-none">
                  <option value="total">Total</option>
                  <option value="monthly">Per month</option>
                  <option value="annual">Per year</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-ink">How sure are you?</label>
              <div className="flex gap-2">
                {CONFIDENCE_OPTIONS.map(opt => (
                  <button key={opt.value} onClick={() => setManualConfidence(opt.value)} className={cn('rounded-full px-3 py-1.5 text-xs font-medium transition-all', manualConfidence === opt.value ? opt.value === 'known' ? 'bg-sage text-cream' : opt.value === 'estimated' ? 'bg-amber text-cream' : 'bg-cream-dark text-ink-light' : 'bg-cream text-ink-faint hover:bg-cream-dark')}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-ink">Whose is this?</label>
              <div className="flex gap-2">
                {OWNERSHIP_OPTIONS.map(opt => (
                  <button key={opt.value} onClick={() => setManualOwnership(opt.value)} className={cn('rounded-full px-3 py-1.5 text-xs font-medium transition-all', manualOwnership === opt.value ? 'bg-warmth text-cream' : 'bg-cream text-ink-faint hover:bg-cream-dark')}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button onClick={handleManualSave} disabled={!manualLabel}>Save item</Button>
              <button onClick={() => setView('overview')} className="text-sm text-ink-light hover:text-ink transition-colors">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </WorkspaceLayout>
  )
}
