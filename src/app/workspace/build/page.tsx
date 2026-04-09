'use client'

import { useState, useEffect, useCallback } from 'react'
import { WorkspaceLayout } from '@/components/workspace/workspace-layout'
import { PageTabs } from '@/components/workspace/page-tabs'
import { CategoryTabs } from '@/components/workspace/category-tabs'
import { CategoryContent } from '@/components/workspace/category-content'
import { SummaryTab } from '@/components/workspace/summary-tab'
import { ManualEntryModal } from '@/components/workspace/manual-entry-modal'
import { DocumentReviewModal } from '@/components/workspace/document-review-modal'
import { DocumentUpload } from '@/components/workspace/document-upload'
import { FirstTimeWizard } from '@/components/workspace/first-time-wizard'
import { useWorkspace } from '@/hooks/use-workspace'
import { useToast } from '@/components/workspace/toast'
import { useCountUp } from '@/hooks/use-count-up'
import { cn } from '@/utils/cn'
import Link from 'next/link'
import type { ExtractionResult, ClassificationResult } from '@/lib/documents/processor'

const READINESS_MILESTONES = [
  { threshold: 0, label: 'Getting started', colour: 'bg-cream-dark' },
  { threshold: 20, label: 'Taking shape', colour: 'bg-warmth' },
  { threshold: 55, label: 'Ready to share with a mediator', colour: 'bg-warmth' },
  { threshold: 80, label: 'Ready for formal disclosure', colour: 'bg-sage' },
  { threshold: 95, label: 'Complete', colour: 'bg-sage' },
]

function getReadinessLabel(progress: number) {
  for (let i = READINESS_MILESTONES.length - 1; i >= 0; i--) {
    if (progress >= READINESS_MILESTONES[i].threshold) return READINESS_MILESTONES[i]
  }
  return READINESS_MILESTONES[0]
}

// Map document types to category keys
const DOC_TYPE_TO_CATEGORY: Record<string, string> = {
  bank_statement: 'current_account',
  savings_statement: 'savings',
  payslip: 'current_account',
  p60: 'current_account',
  pension_letter: 'pensions',
  mortgage_statement: 'property',
  property_valuation: 'property',
  credit_card_statement: 'debts',
  loan_statement: 'debts',
  insurance_document: 'other_assets',
  tax_return: 'business',
  business_accounts: 'business',
  investment_statement: 'savings',
}

export default function BuildYourPicturePage() {
  const { items, addItem, updateItem, removeItem, summary, readiness, spending, setSpending, loaded } = useWorkspace()
  const { showToast } = useToast()

  // First-time wizard
  const [wizardComplete, setWizardComplete] = useState(false)
  const [visibleCategories, setVisibleCategories] = useState<string[]>([])

  // Page-level tab
  const [pageTab, setPageTab] = useState<'preparation' | 'summary'>('preparation')

  // Category tab
  const [activeCategory, setActiveCategory] = useState('current_account')

  // Modals
  const [showManualEntry, setShowManualEntry] = useState(false)
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const editingItem = editingItemId ? items.find(i => i.id === editingItemId) || null : null

  // Upload state (shared — one upload zone)
  const [extractionResult, setExtractionResult] = useState<ExtractionResult | null>(null)
  const [classification, setClassification] = useState<ClassificationResult | null>(null)
  const [uploadMessage, setUploadMessage] = useState<string | null>(null)
  const [isReviewing, setIsReviewing] = useState(false)

  // Check wizard state on mount
  useEffect(() => {
    const config = localStorage.getItem('wizard_config')
    if (config) {
      try {
        const parsed = JSON.parse(config)
        setVisibleCategories(parsed.categories || ['current_account', 'savings', 'property', 'pensions', 'debts'])
        setWizardComplete(true)
      } catch {
        // Default categories
        setVisibleCategories(['current_account', 'savings', 'property', 'pensions', 'debts'])
      }
    }
  }, [])

  // Smart document routing — when upload completes, route to correct tab
  const handleUploadProcessed = useCallback((result: { classification: unknown; extraction: unknown; message: string }) => {
    const classResult = result.classification as ClassificationResult | null
    const extractResult = result.extraction as ExtractionResult | null

    setClassification(classResult)
    setUploadMessage(result.message)

    if (extractResult && extractResult.items.length > 0) {
      setExtractionResult(extractResult)
      setIsReviewing(true)

      // Route to the correct tab based on document type
      if (classResult?.document_type) {
        const targetTab = DOC_TYPE_TO_CATEGORY[classResult.document_type]
        if (targetTab && visibleCategories.includes(targetTab)) {
          setActiveCategory(targetTab)
        }
      }
    }
  }, [visibleCategories])

  const handleWizardComplete = (config: { categories: string[]; counts: Record<string, number> }) => {
    setVisibleCategories(config.categories)
    setWizardComplete(true)
    localStorage.setItem('wizard_config', JSON.stringify(config))
    if (config.categories.length > 0) {
      setActiveCategory(config.categories[0])
    }
  }

  const handleConfirmExtraction = useCallback((confirmedItems: ExtractionResult['items'], extractedSpending: ExtractionResult['spending_categories']) => {
    confirmedItems.forEach(item => {
      addItem({
        id: crypto.randomUUID(),
        category: item.category as never,
        subcategory: item.subcategory || activeCategory,
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
    if (extractedSpending) {
      setSpending(extractedSpending.map(s => ({ category: s.category, monthly_average: s.monthly_average, transaction_count: s.transaction_count, examples: s.examples })))
    }
    setIsReviewing(false)
    setExtractionResult(null)
    setUploadMessage(null)
    showToast(`${confirmedItems.length} items added to your picture`)
  }, [addItem, setSpending, activeCategory, showToast])

  // Readiness
  const progress = readiness.progress
  const milestone = getReadinessLabel(progress)
  const animatedProgress = useCountUp(progress, 800)

  if (!loaded) return (
    <WorkspaceLayout activePhase="build_your_picture">
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cream-dark border-t-warmth" />
      </div>
    </WorkspaceLayout>
  )

  return (
    <WorkspaceLayout activePhase="build_your_picture">
      {/* ── Navigation header ── */}
      <div className="border-b-[var(--border-card)] border-cream-dark bg-cream-dark/40 px-6 py-3 md:px-10">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/workspace" className="text-sm font-semibold text-ink-light hover:text-ink transition-colors">
            ← Back to workspace
          </Link>
        </div>
      </div>

      <div className="px-6 md:px-10">
        <div className="mx-auto max-w-4xl space-y-6 py-6">

          {/* ── Title panel ── */}
          <div className="relative rounded-[var(--radius-lg)] bg-warmth p-7 shadow-[var(--shadow-md)] overflow-hidden">
            <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
              Build your picture
            </h1>
            <p className="mt-1.5 text-sm text-white/80 leading-relaxed">
              Upload any financial document — we&apos;ll detect what it is and organise it automatically.
            </p>

            <div className="absolute bottom-0 left-0 right-0 h-1.5">
              <div className="h-full w-full bg-warmth-dark/30">
                <div className={cn('h-full transition-all duration-700 ease-out', milestone.colour)} style={{ width: `${animatedProgress}%` }} />
              </div>
            </div>

            {progress > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs font-bold text-white/60">{animatedProgress}%</span>
                <span className="text-xs text-white/40">·</span>
                <span className="text-xs font-semibold text-white/70">{milestone.label}</span>
              </div>
            )}
          </div>

          {/* ── First-time wizard ── */}
          {!wizardComplete && (
            <FirstTimeWizard onComplete={handleWizardComplete} />
          )}

          {/* ── Main content (after wizard) ── */}
          {wizardComplete && (
            <>
              {/* Page-level tabs */}
              <PageTabs active={pageTab} onChange={setPageTab} />

              {/* ── PREPARATION TAB ── */}
              {pageTab === 'preparation' && (
                <div className="space-y-6">

                  {/* Single upload zone — always at top, routes to correct tab */}
                  <div className="rounded-[var(--radius-lg)] border-[var(--border-card)] border-cream-dark bg-surface shadow-[var(--shadow-sm)] p-6">
                    {!isReviewing ? (
                      <>
                        <DocumentUpload
                          onProcessed={handleUploadProcessed}
                          prompt="Drop any financial document here"
                          hint="Bank statements, payslips, pension letters, mortgage statements, valuations — we'll detect the type automatically"
                        />

                        {uploadMessage && !isReviewing && (
                          <div className="mt-4 rounded-[var(--radius-md)] border-[var(--border-card)] border-amber-light bg-amber-light/30 p-4">
                            <p className="text-sm text-ink">{uploadMessage}</p>
                          </div>
                        )}

                        <div className="mt-4 flex items-center gap-4">
                          <button onClick={() => setShowManualEntry(true)} className="text-sm font-semibold text-warmth-dark hover:text-warmth transition-colors">
                            Enter details manually
                          </button>
                        </div>
                      </>
                    ) : extractionResult && (
                      <>
                        {classification && (
                          <div className="mb-4 flex items-center gap-2">
                            <span className="rounded-full bg-cream-dark px-3 py-1 text-xs font-semibold text-ink-light">
                              {classification.document_type.replace(/_/g, ' ')}
                            </span>
                            {classification.provider_name && (
                              <span className="text-xs text-ink-faint">{classification.provider_name}</span>
                            )}
                            <span className="text-xs text-ink-faint">→ routed to {activeCategory.replace(/_/g, ' ')}</span>
                          </div>
                        )}
                        {/* Inline review using existing ExtractionReview */}
                        <div className="space-y-4">
                          {/* Import and use ExtractionReview inline */}
                          <p className="text-sm font-semibold text-ink">{extractionResult.raw_summary}</p>
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleConfirmExtraction(extractionResult.items, extractionResult.spending_categories)}
                              className="rounded-[var(--radius-sm)] bg-warmth px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-warmth-dark active:scale-[0.97]"
                            >
                              Confirm {extractionResult.items.length} items
                            </button>
                            <button
                              onClick={() => { setIsReviewing(false); setExtractionResult(null); setUploadMessage(null) }}
                              className="text-sm font-semibold text-ink-faint hover:text-ink transition-colors"
                            >
                              Discard
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Category tabs — show captured data per category */}
                  <div className="rounded-[var(--radius-lg)] border-[var(--border-card)] border-cream-dark bg-surface shadow-[var(--shadow-sm)] overflow-hidden">
                    <CategoryTabs
                      activeTab={activeCategory}
                      onTabChange={setActiveCategory}
                      items={items}
                      visibleCategories={visibleCategories}
                    />
                    <div className="px-6 pb-6">
                      <CategoryContent
                        categoryKey={activeCategory}
                        items={items}
                        onAddItem={(item) => { addItem(item); showToast(`${item.label} added`) }}
                        onRemoveItem={(id) => { removeItem(id); showToast('Item removed') }}
                        onEditItem={(id) => setEditingItemId(id)}
                        onOpenManualEntry={() => setShowManualEntry(true)}
                        setSpending={setSpending}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ── SUMMARY TAB ── */}
              {pageTab === 'summary' && (
                <SummaryTab
                  items={items}
                  spending={spending}
                  onEditItem={(id) => {
                    const item = items.find(i => i.id === id)
                    if (item) setEditingItemId(id)
                  }}
                  onSwitchToPreparation={() => setPageTab('preparation')}
                />
              )}
            </>
          )}

        </div>
      </div>

      {/* Modals */}
      <ManualEntryModal
        isOpen={showManualEntry}
        onClose={() => setShowManualEntry(false)}
        onSave={(item) => { addItem(item); setShowManualEntry(false); showToast(`${item.label} added`) }}
        defaultCategory={activeCategory}
      />

      <DocumentReviewModal
        isOpen={!!editingItemId}
        onClose={() => setEditingItemId(null)}
        item={editingItem}
        onSave={(id, updates) => { updateItem(id, updates); setEditingItemId(null); showToast('Item updated') }}
      />
    </WorkspaceLayout>
  )
}
