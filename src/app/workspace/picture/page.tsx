'use client'

import { useState, useCallback } from 'react'
import { WorkspaceLayout } from '@/components/workspace/workspace-layout'
import { DocumentUpload } from '@/components/workspace/document-upload'
import { ExtractionReview } from '@/components/workspace/extraction-review'
import { MicroMoment } from '@/components/interview/micro-moment'
import { Button } from '@/components/ui/button'
import { useWorkspace } from '@/hooks/use-workspace'
import { CATEGORY_PRIORITY } from '@/types/workspace'
import type { ExtractionResult, ClassificationResult } from '@/lib/documents/processor'
import Link from 'next/link'

type ViewState = 'upload' | 'reviewing' | 'complete'

export default function PicturePage() {
  const { items, addItem, setSpending } = useWorkspace()
  const [view, setView] = useState<ViewState>('upload')
  const [extractionResult, setExtractionResult] = useState<ExtractionResult | null>(null)
  const [classification, setClassification] = useState<ClassificationResult | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleProcessed = useCallback((result: { classification: unknown; extraction: unknown; message: string }) => {
    const classResult = result.classification as ClassificationResult | null
    const extractResult = result.extraction as ExtractionResult | null

    setClassification(classResult)
    setMessage(result.message)

    if (extractResult && extractResult.items.length > 0) {
      setExtractionResult(extractResult)
      setView('reviewing')
    } else {
      // No extraction — show message and offer manual entry
      setView('upload')
    }
  }, [])

  const handleConfirmAll = useCallback((
    confirmedItems: ExtractionResult['items'],
    spending: ExtractionResult['spending_categories'],
    accounts: ExtractionResult['accounts'],
  ) => {
    // Add confirmed items to workspace
    confirmedItems.forEach(item => {
      addItem({
        id: crypto.randomUUID(),
        category: item.category as never,
        subcategory: item.subcategory,
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

    // Add spending categories
    if (spending) {
      setSpending(spending.map(s => ({
        category: s.category,
        monthly_average: s.monthly_average,
        transaction_count: s.transaction_count,
        examples: s.examples,
      })))
    }

    setView('complete')
  }, [addItem, setSpending])

  const handleDismiss = useCallback(() => {
    setView('upload')
    setExtractionResult(null)
    setClassification(null)
    setMessage(null)
  }, [])

  // Find next suggested category based on what's already captured
  const categoriesWithItems = new Set(items.map(i => i.category))
  const nextCategory = CATEGORY_PRIORITY.find(cat => !categoriesWithItems.has(cat.key as never))

  return (
    <WorkspaceLayout
      activePhase="build_your_picture"
      breadcrumb={[{ label: 'Build your picture', href: '/workspace/picture' }]}
    >
      <div className="max-w-xl space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-medium text-ink">Add to your picture</h1>
          <p className="mt-2 text-sm text-ink-light leading-relaxed">
            Upload a document and we&apos;ll do the heavy lifting — reading, extracting, and organising the financial details.
          </p>
        </div>

        {/* Upload view */}
        {view === 'upload' && (
          <div className="space-y-6">
            {/* Classification hint if we tried and failed */}
            {message && !extractionResult && (
              <div className="rounded-[var(--radius-md)] border border-amber-light bg-amber-light/30 p-4">
                <p className="text-sm text-ink">{message}</p>
              </div>
            )}

            {/* Guided prompt */}
            {nextCategory && items.length === 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-ink">
                  Start with your {nextCategory.label.toLowerCase()}
                </p>
                <p className="text-xs text-ink-light">{nextCategory.description}. Ideal: {nextCategory.idealDocs}.</p>
              </div>
            )}

            {nextCategory && items.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-ink">
                  Next suggested: {nextCategory.label}
                </p>
                <p className="text-xs text-ink-light">{nextCategory.idealDocs}</p>
              </div>
            )}

            <DocumentUpload
              onProcessed={handleProcessed}
              prompt={items.length === 0
                ? 'Drop your current account statement here'
                : 'Drop any financial document here'
              }
              hint={items.length === 0
                ? '12 months if you have it. Download as PDF from your online banking.'
                : 'Bank statements, payslips, pension letters, mortgage statements, valuations...'
              }
            />

            <div className="flex items-center gap-4 text-sm">
              <Link href="/workspace/picture/manual" className="text-warmth-dark hover:text-warmth transition-colors">
                Enter details manually
              </Link>
              {items.length > 0 && (
                <>
                  <span className="text-ink-faint">·</span>
                  <Link href="/workspace" className="text-ink-light hover:text-ink transition-colors">
                    Back to hub
                  </Link>
                </>
              )}
            </div>
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
                {classification.is_joint && (
                  <span className="rounded-full bg-cream-dark px-2.5 py-0.5 text-xs text-ink-faint">Joint</span>
                )}
              </div>
            )}

            <ExtractionReview
              items={extractionResult.items}
              spending={extractionResult.spending_categories}
              accounts={extractionResult.accounts}
              summary={extractionResult.raw_summary}
              onConfirmAll={handleConfirmAll}
              onDismiss={handleDismiss}
            />
          </div>
        )}

        {/* Complete view — celebration moment */}
        {view === 'complete' && (
          <div className="space-y-6">
            {/* Success card with warmth */}
            <div className="rounded-[var(--radius-md)] border border-sage bg-sage-light/20 p-6 text-center space-y-3">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-sage/20">
                <span className="text-sage text-lg">✓</span>
              </div>
              <p className="text-sm font-medium text-ink">
                {extractionResult?.items.length || 0} items added to your picture
              </p>
              {extractionResult?.spending_categories && (
                <p className="text-xs text-ink-light">
                  Plus a full spending breakdown across {extractionResult.spending_categories.length} categories
                </p>
              )}
              <p className="text-xs text-ink-faint italic">
                {items.length <= 3
                  ? 'That\'s a strong start. One document, and we already have a foundation to build on.'
                  : 'Your picture is really coming together now. Each document makes your position clearer.'}
              </p>
            </div>

            {/* Next category suggestion */}
            {nextCategory && (
              <div className="rounded-[var(--radius-md)] border border-warmth/30 bg-warmth-light/5 p-5 space-y-3">
                <p className="text-xs font-medium uppercase tracking-wide text-warmth-dark">Continue with</p>
                <p className="text-sm font-medium text-ink">{nextCategory.label}</p>
                <p className="text-xs text-ink-light leading-relaxed">{nextCategory.description}. Best document: {nextCategory.idealDocs}.</p>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Button onClick={() => { setView('upload'); setExtractionResult(null) }}>
                Upload next document
              </Button>
              <Link href="/workspace">
                <Button variant="secondary">Back to overview</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </WorkspaceLayout>
  )
}
