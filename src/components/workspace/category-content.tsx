'use client'

import { useState, useCallback } from 'react'
import { DocumentUpload } from '@/components/workspace/document-upload'
import { ExtractionReview } from '@/components/workspace/extraction-review'
import { CetvTracker, type CetvRequest } from '@/components/workspace/cetv-tracker'
import { Button } from '@/components/ui/button'
import { CATEGORY_PRIORITY } from '@/types/workspace'
import type { FinancialPictureItem } from '@/types/workspace'
import type { ExtractionResult, ClassificationResult } from '@/lib/documents/processor'
import { cn } from '@/utils/cn'

interface CategoryContentProps {
  categoryKey: string
  items: FinancialPictureItem[]
  onAddItem: (item: FinancialPictureItem) => void
  onRemoveItem: (id: string) => void
  onEditItem: (id: string) => void
  onOpenManualEntry: () => void
  setSpending: (s: { category: string; monthly_average: number; transaction_count: number; examples: string[] }[]) => void
}

const AI_PROMPTS: Record<string, string> = {
  current_account: 'Any bonuses, overtime, or side income not shown here?',
  savings: 'Any ISAs, premium bonds, or accounts you rarely check?',
  property: 'Any other properties — buy-to-let, inherited, or abroad?',
  pensions: 'Any old workplace pensions from previous employers?',
  debts: 'Any store cards, buy-now-pay-later, or loans from family?',
  other_income: 'Any benefits, tax credits, or maintenance payments received?',
  other_assets: 'Any vehicles, crypto, valuables over £500, or investments?',
  business: 'Any business accounts, SIPP contributions, or director\'s loans?',
  outgoings: 'Any regular commitments not captured — childcare, school fees, memberships?',
}

function formatCurrency(amount: number | null): string {
  if (amount === null || isNaN(amount)) return '—'
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: amount < 100 ? 2 : 0 }).format(amount)
}

type ViewState = 'idle' | 'uploading' | 'reviewing'

export function CategoryContent({ categoryKey, items, onAddItem, onRemoveItem, onEditItem, onOpenManualEntry, setSpending }: CategoryContentProps) {
  const [view, setView] = useState<ViewState>('idle')
  const [extractionResult, setExtractionResult] = useState<ExtractionResult | null>(null)
  const [cetvRequests, setCetvRequests] = useState<CetvRequest[]>([])

  const isPensions = categoryKey === 'pensions'
  const [classification, setClassification] = useState<ClassificationResult | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const categoryInfo = CATEGORY_PRIORITY.find(c => c.key === categoryKey)
  const catItems = items.filter(i =>
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
    } else {
      setView('idle')
    }
  }, [])

  const handleConfirmAll = useCallback((
    confirmedItems: ExtractionResult['items'],
    spending: ExtractionResult['spending_categories'],
  ) => {
    confirmedItems.forEach(item => {
      onAddItem({
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
    setView('idle')
    setExtractionResult(null)
    setMessage(null)
  }, [onAddItem, setSpending, categoryKey])

  return (
    <div className="space-y-6 py-6">
      {/* Upload zone — always visible in idle state */}
      {view === 'idle' && (
        <>
          <DocumentUpload
            onProcessed={handleProcessed}
            prompt={`Drop your ${categoryInfo?.label.toLowerCase() || 'financial'} document here`}
            hint={categoryInfo ? `Best document: ${categoryInfo.idealDocs}` : undefined}
          />

          <div className="flex items-center gap-4">
            <button onClick={onOpenManualEntry} className="text-sm font-semibold text-warmth-dark hover:text-warmth transition-colors">
              Enter details manually
            </button>
          </div>

          {/* Error/info message from last upload */}
          {message && (
            <div className="rounded-[var(--radius-md)] border-[var(--border-card)] border-amber-light bg-amber-light/30 p-4">
              <p className="text-sm text-ink">{message}</p>
            </div>
          )}
        </>
      )}

      {/* Review — inline when extraction completes */}
      {view === 'reviewing' && extractionResult && (
        <div className="rounded-[var(--radius-lg)] border-[var(--border-card)] border-cream-dark bg-surface p-6 shadow-[var(--shadow-md)]">
          {classification && (
            <div className="mb-4 flex items-center gap-2">
              <span className="rounded-full bg-cream-dark px-3 py-1 text-xs font-semibold text-ink-light">
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
            onDismiss={() => { setView('idle'); setExtractionResult(null); setMessage(null) }}
          />
        </div>
      )}

      {/* Items captured */}
      {catItems.length > 0 && (
        <div className="space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-ink-faint">
            {catItems.length} item{catItems.length !== 1 ? 's' : ''} captured
          </p>
          {catItems.map(item => (
            <div
              key={item.id}
              className={cn(
                'rounded-[var(--radius-md)] border-[var(--border-card)] p-4 transition-all',
                'border-l-[var(--border-accent)]',
                item.confidence === 'known' ? 'border-cream-dark border-l-sage bg-surface' :
                item.confidence === 'estimated' ? 'border-cream-dark border-l-amber bg-surface' :
                'border-cream-dark border-l-ink-faint bg-cream-dark/20',
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-base font-bold text-ink">{item.label}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <span className={cn(
                      'rounded-full px-2.5 py-0.5 text-[11px] font-bold',
                      item.confidence === 'known' ? 'bg-sage-light text-sage-dark' :
                      item.confidence === 'estimated' ? 'bg-amber-light text-amber' :
                      'bg-cream-dark text-ink-faint',
                    )}>
                      {item.confidence}
                    </span>
                    <span className="rounded-full bg-cream-dark px-2.5 py-0.5 text-[11px] font-semibold text-ink-faint capitalize">
                      {item.ownership === 'joint' ? `Joint · ${item.split}%` : item.ownership}
                    </span>
                  </div>
                  {item.notes && <p className="mt-1.5 text-xs text-ink-faint">{item.notes}</p>}
                </div>
                <div className="text-right">
                  <p className="text-xl font-extrabold tracking-tight text-ink tabular-nums">
                    {formatCurrency(item.value)}
                    {item.period === 'monthly' && <span className="text-sm font-semibold text-ink-faint">/mo</span>}
                    {item.period === 'annual' && <span className="text-sm font-semibold text-ink-faint">/yr</span>}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex gap-4">
                <button onClick={() => onEditItem(item.id)} className="text-xs font-semibold text-ink-faint hover:text-warmth-dark transition-colors">Edit</button>
                <button onClick={() => onRemoveItem(item.id)} className="text-xs font-semibold text-ink-faint hover:text-warmth-dark transition-colors">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {catItems.length === 0 && view === 'idle' && (
        <div className="rounded-[var(--radius-lg)] border-[var(--border-card)] border-cream-dark bg-cream-dark/20 p-8 text-center">
          <p className="text-base font-semibold text-ink-light">No {categoryInfo?.label.toLowerCase()} items yet</p>
          <p className="mt-1 text-sm text-ink-faint">Upload a document above or enter details manually.</p>
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

      {/* AI prompt */}
      {AI_PROMPTS[categoryKey] && catItems.length > 0 && (
        <div className="rounded-[var(--radius-md)] border-[var(--border-card)] border-l-[var(--border-accent)] border-cream-dark border-l-warmth bg-warmth-light/20 p-4">
          <p className="text-sm text-ink">💡 {AI_PROMPTS[categoryKey]}</p>
          <button onClick={onOpenManualEntry} className="mt-2 text-xs font-semibold text-warmth-dark hover:text-warmth transition-colors">
            Add another item
          </button>
        </div>
      )}
    </div>
  )
}
