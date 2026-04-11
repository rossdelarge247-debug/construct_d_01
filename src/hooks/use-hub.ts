'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import type {
  ConfigAnswers,
  SectionData,
  SectionKey,
  EvidenceLozenge,
  EvidenceType,
  FinancialItem,
  FidelityLevel,
  HeroPanelState,
  ClarificationQuestion,
  AutoConfirmItem,
} from '@/types/hub'
import { SECTION_DEFINITIONS } from '@/types/hub'

const STORAGE_KEY = 'decouple-hub-state'

interface PersistedState {
  config: ConfigAnswers
  items: FinancialItem[]
}

function loadState(): PersistedState | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

function saveState(state: PersistedState) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // localStorage full or unavailable
  }
}

const EMPTY_CONFIG: ConfigAnswers = {
  v1DataConfirmed: false,
  employment: null,
  businessStructure: null,
  ownsProperty: false,
  propertyCount: 0,
  propertyEstimate: null,
  hasMortgage: false,
  mortgageEstimate: null,
  hasPensions: false,
  pensionEstimate: null,
  cetvRequested: null,
  hasSavings: false,
  savingsEstimate: null,
  hasDebts: false,
  debtsEstimate: null,
  otherAssets: [],
  hasChildren: false,
  configCompleted: false,
}

// Maps AI document types to evidence lozenge types
const DOC_TYPE_TO_LOZENGE: Record<string, EvidenceType> = {
  bank_statement: 'current_account',
  payslip: 'payslips',
  mortgage_statement: 'mortgage_details',
  pension_cetv: 'pensions',
  savings_statement: 'savings_account',
  credit_card_statement: 'credit_cards',
  tax_return: 'tax_returns',
  p60: 'tax_returns',
  business_accounts: 'business_accounts',
}

export interface UploadContext {
  fileCount: number
  fileNames: string[]
  documentType: string | null
  providerName: string | null
  processingMessages: string[]
  error: string | null
}

export function useHub() {
  const [config, setConfig] = useState<ConfigAnswers>(EMPTY_CONFIG)
  const [items, setItems] = useState<FinancialItem[]>([])
  const [heroPanelState, setHeroPanelState] = useState<HeroPanelState>('ready')
  const [questions, setQuestions] = useState<ClarificationQuestion[]>([])
  const [autoConfirmItems, setAutoConfirmItems] = useState<AutoConfirmItem[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [lozengeState, setLozengeState] = useState<EvidenceLozenge[]>([])
  const [uploadContext, setUploadContext] = useState<UploadContext>({
    fileCount: 0, fileNames: [], documentType: null, providerName: null,
    processingMessages: [], error: null,
  })
  // Financial items produced by the transformer, held until Q&A completes
  const pendingFinancialItems = useRef<FinancialItem[]>([])

  // Load persisted state on mount
  useEffect(() => {
    const stored = loadState()
    if (stored) {
      setConfig(stored.config)
      setItems(stored.items)
    }
    setLoaded(true)
  }, [])

  // Auto-save on changes
  useEffect(() => {
    if (!loaded) return
    saveState({ config, items })
  }, [config, items, loaded])

  // Regenerate lozenges when config changes, preserving upload state
  useEffect(() => {
    setLozengeState((prevLozenges) => {
      const freshLozenges = generateLozenges(config)
      // Merge: preserve uploaded status from previous lozenges
      return freshLozenges.map((fresh) => {
        const existing = prevLozenges.find((l) => l.type === fresh.type)
        return existing && existing.status !== 'empty' ? existing : fresh
      })
    })
  }, [config])

  // ═══ Config actions ═══

  const updateConfig = useCallback((updates: Partial<ConfigAnswers>) => {
    setConfig((prev) => ({ ...prev, ...updates }))
  }, [])

  const completeConfig = useCallback(() => {
    setConfig((prev) => ({ ...prev, configCompleted: true }))
  }, [])

  // ═══ Sections derived from config ═══

  const sections: SectionData[] = SECTION_DEFINITIONS
    .filter((def) => isSectionVisible(def.key, config))
    .map((def) => ({
      key: def.key,
      label: def.label,
      formESections: def.formESections,
      status: getSectionStatus(def.key, items, config),
      items: items.filter((i) => i.sectionKey === def.key),
      visible: true,
      estimateFromConfig: getEstimateFromConfig(def.key, config),
      evidenceSummary: getEvidenceSummary(def.key, items),
      outstandingQuestions: 0,
    }))

  // ═══ Lozenges — stateful, updated by uploads ═══

  const lozenges: EvidenceLozenge[] = lozengeState.length > 0
    ? lozengeState
    : generateLozenges(config)

  // ═══ Fidelity calculation ═══

  const fidelity: FidelityLevel = calculateFidelity(items, sections, config)

  // ═══ Hero panel actions ═══

  const handleFilesDropped = useCallback(async (files: File[]) => {
    if (files.length === 0) return

    setUploadContext({
      fileCount: files.length,
      fileNames: files.map((f) => f.name),
      documentType: null,
      providerName: null,
      processingMessages: [],
      error: null,
    })
    setHeroPanelState('uploading')

    // Process first file (multi-file will iterate in future)
    const file = files[0]
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/documents/extract', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok || data.error) {
        setUploadContext((prev) => ({ ...prev, error: data.error || 'Upload failed' }))
        setHeroPanelState('ready')
        return
      }

      const { result, transformed } = data
      const classification = result.classification

      // Update context with classification info
      setUploadContext((prev) => ({
        ...prev,
        documentType: classification.document_type,
        providerName: classification.provider || null,
        processingMessages: transformed.processingMessages || [],
      }))

      // Update the relevant lozenge to 'uploading' then 'uploaded'
      const lozengeType = DOC_TYPE_TO_LOZENGE[classification.document_type]
      if (lozengeType) {
        setLozengeState((prev) =>
          prev.map((l) => l.type === lozengeType
            ? { ...l, status: 'uploading' as const, count: l.count + 1 }
            : l
          )
        )
      }

      setHeroPanelState('uploading_context')

      // Brief pause so user sees the contextual info
      await new Promise((r) => setTimeout(r, 1200))

      // Update lozenge to uploaded
      if (lozengeType) {
        setLozengeState((prev) =>
          prev.map((l) => l.type === lozengeType
            ? {
                ...l,
                status: 'uploaded' as const,
                documents: [...l.documents, {
                  id: `doc-${Date.now()}`,
                  fileName: file.name,
                  fileType: file.type,
                  description: classification.description || file.name,
                  uploadedAt: new Date().toISOString(),
                  monthsCovered: 0,
                  monthsRequired: classification.document_type === 'bank_statement' ? 12 : 0,
                }],
              }
            : l
          )
        )
      }

      setHeroPanelState('analysing')

      // Brief pause so user sees analysing state
      await new Promise((r) => setTimeout(r, 800))

      // Set transformed Q&A data from the real pipeline
      setAutoConfirmItems(transformed.autoConfirmItems || [])
      setQuestions(transformed.questions || [])
      pendingFinancialItems.current = transformed.financialItems || []
      setCurrentQuestionIndex(0)
      setHeroPanelState('review_ready')

    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Something went wrong'
      setUploadContext((prev) => ({ ...prev, error: msg }))
      setHeroPanelState('ready')
    }
  }, [])

  const startReview = useCallback(() => {
    setHeroPanelState('auto_confirm')
  }, [])

  const acceptAutoConfirm = useCallback((acceptedIds: string[]) => {
    // Add the pre-built financial items from the transformer for accepted auto-confirm items
    const accepted = new Set(acceptedIds)
    const itemsToAdd = pendingFinancialItems.current.filter(
      (fi) => autoConfirmItems.some((ai) => accepted.has(ai.id) && fi.label === ai.label)
    )

    if (itemsToAdd.length > 0) {
      setItems((prev) => [...prev, ...itemsToAdd])
    }

    if (questions.length > 0) {
      setHeroPanelState('clarification')
    } else {
      setHeroPanelState('summary')
    }
  }, [autoConfirmItems, questions.length])

  const answerQuestion = useCallback((questionId: string, answer: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, answered: true, answer } : q))
    )

    // Add any remaining financial items that correspond to answered questions
    // (the transformer pre-creates items; answers refine ownership/category)
    const answeredQ = questions.find((q) => q.id === questionId)
    if (answeredQ) {
      const matchingItems = pendingFinancialItems.current.filter(
        (fi) => fi.sourceDescription?.includes(answeredQ.questionText.substring(0, 20))
      )
      if (matchingItems.length > 0) {
        setItems((prev) => {
          const existingIds = new Set(prev.map((i) => i.id))
          const newItems = matchingItems.filter((i) => !existingIds.has(i.id))
          return newItems.length > 0 ? [...prev, ...newItems] : prev
        })
      }
    }

    const nextIndex = currentQuestionIndex + 1
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex)
    } else {
      // Add any remaining pending items not yet added
      setItems((prev) => {
        const existingIds = new Set(prev.map((i) => i.id))
        const remaining = pendingFinancialItems.current.filter((i) => !existingIds.has(i.id))
        return remaining.length > 0 ? [...prev, ...remaining] : prev
      })
      setHeroPanelState('summary')
    }
  }, [currentQuestionIndex, questions])

  const finishSession = useCallback(() => {
    setHeroPanelState('ready')
    setQuestions([])
    setAutoConfirmItems([])
    setCurrentQuestionIndex(0)
    pendingFinancialItems.current = []
    setUploadContext({
      fileCount: 0, fileNames: [], documentType: null, providerName: null,
      processingMessages: [], error: null,
    })
  }, [])

  const resetToReady = useCallback(() => {
    setHeroPanelState('ready')
  }, [])

  // ═══ Section actions (stubs — spec 14 wizards) ═══

  const openManualInput = useCallback((_sectionKey: SectionKey) => {
    // TODO: open manual input wizard for section (spec 14)
  }, [])

  const openSectionReview = useCallback((_sectionKey: SectionKey) => {
    // TODO: open review flow for section
  }, [])

  const addSection = useCallback(() => {
    // TODO: show section picker for "+ More to disclose"
  }, [])

  return {
    config,
    sections,
    lozenges,
    items,
    fidelity,
    heroPanelState,
    questions,
    autoConfirmItems,
    currentQuestionIndex,
    uploadContext,
    updateConfig,
    completeConfig,
    handleFilesDropped,
    startReview,
    acceptAutoConfirm,
    answerQuestion,
    finishSession,
    resetToReady,
    openManualInput,
    openSectionReview,
    addSection,
  }
}

// ═══ Helper functions ═══

function isSectionVisible(key: SectionKey, config: ConfigAnswers): boolean {
  switch (key) {
    case 'income': return true
    case 'accounts': return true
    case 'spending': return true
    case 'property': return config.ownsProperty
    case 'other_property': return config.propertyCount > 1
    case 'pensions': return config.hasPensions
    case 'debts': return config.hasDebts
    case 'business': return config.employment === 'self_employed' || config.employment === 'both'
    case 'other_assets': return config.otherAssets.length > 0
    default: return false
  }
}

function getSectionStatus(key: SectionKey, items: FinancialItem[], config: ConfigAnswers): SectionData['status'] {
  const sectionItems = items.filter((i) => i.sectionKey === key)
  if (sectionItems.length === 0) {
    const hasEstimate = getEstimateFromConfig(key, config) !== null
    return hasEstimate ? 'estimate_only' : 'not_started'
  }
  const allConfirmed = sectionItems.every((i) => i.confidence === 'confirmed')
  return allConfirmed ? 'fully_evidenced' : 'partial_evidence'
}

function getEstimateFromConfig(key: SectionKey, config: ConfigAnswers): string | null {
  switch (key) {
    case 'income':
      if (config.employment === 'employed' || config.employment === 'both') return null
      return null
    case 'property':
      if (config.propertyEstimate) return `£${config.propertyEstimate.toLocaleString()} property estimated`
      return null
    case 'pensions':
      if (config.pensionEstimate) return `~£${config.pensionEstimate.toLocaleString()} (Your estimate)`
      return config.hasPensions ? 'Pension exists — value unknown' : null
    case 'accounts':
      if (config.savingsEstimate) return `~£${config.savingsEstimate.toLocaleString()} in savings (Your estimate)`
      return null
    case 'debts':
      if (config.debtsEstimate) return `~£${config.debtsEstimate.toLocaleString()} in debts (Your estimate)`
      return null
    default:
      return null
  }
}

function getEvidenceSummary(key: SectionKey, items: FinancialItem[]): string | null {
  const sectionItems = items.filter((i) => i.sectionKey === key)
  if (sectionItems.length === 0) return null

  const confirmedCount = sectionItems.filter((i) => i.confidence === 'confirmed').length
  const totalCount = sectionItems.length
  if (confirmedCount === totalCount) {
    return `${totalCount} item${totalCount > 1 ? 's' : ''} confirmed`
  }
  return `${confirmedCount} of ${totalCount} items confirmed`
}

function generateLozenges(config: ConfigAnswers): EvidenceLozenge[] {
  const lozenges: EvidenceLozenge[] = [
    { type: 'current_account', label: 'Current account', status: 'empty', count: 0, documents: [] },
  ]

  if (config.employment === 'employed' || config.employment === 'both') {
    lozenges.push({ type: 'payslips', label: 'Payslips', status: 'empty', count: 0, documents: [] })
  }

  if (config.hasPensions) {
    lozenges.push({ type: 'pensions', label: 'Pensions', status: 'empty', count: 0, documents: [] })
  }

  if (config.ownsProperty && config.hasMortgage) {
    lozenges.push({ type: 'mortgage_details', label: 'Mortgage details', status: 'empty', count: 0, documents: [] })
  }

  if (config.hasSavings) {
    lozenges.push({ type: 'savings_account', label: 'Savings account', status: 'empty', count: 0, documents: [] })
  }

  if (config.otherAssets.length > 0) {
    const count = config.otherAssets.length
    lozenges.push({ type: 'other_assets', label: `${count} Other asset${count > 1 ? 's' : ''}`, status: 'empty', count: 0, documents: [] })
  }

  if (config.hasDebts) {
    lozenges.push({ type: 'credit_cards', label: 'Debt statements', status: 'empty', count: 0, documents: [] })
  }

  return lozenges
}

/**
 * Fidelity calculation per spec 17.
 * Checks section coverage and evidence quality, not just item count.
 */
function calculateFidelity(
  items: FinancialItem[],
  sections: SectionData[],
  config: ConfigAnswers,
): FidelityLevel {
  if (items.length === 0) return 'sketch'

  const visibleSections = sections.filter((s) => s.visible)
  const sectionsWithEvidence = visibleSections.filter(
    (s) => s.status === 'partial_evidence' || s.status === 'fully_evidenced'
  )
  const sectionsFullyEvidenced = visibleSections.filter(
    (s) => s.status === 'fully_evidenced'
  )

  // Locked: every visible section fully evidenced, no outstanding questions
  if (
    sectionsFullyEvidenced.length === visibleSections.length &&
    visibleSections.length > 0
  ) {
    return 'locked'
  }

  // Evidenced: most sections have evidence, core sections (income + accounts or spending) covered
  const coreEvidenced = ['income', 'accounts', 'spending'].filter((key) => {
    const section = sections.find((s) => s.key === key)
    return section && (section.status === 'partial_evidence' || section.status === 'fully_evidenced')
  })
  if (
    coreEvidenced.length >= 2 &&
    sectionsWithEvidence.length >= Math.ceil(visibleSections.length * 0.6)
  ) {
    return 'evidenced'
  }

  // Draft: at least one document processed, core sections have some data
  if (sectionsWithEvidence.length >= 1 && coreEvidenced.length >= 1) {
    return 'draft'
  }

  return 'sketch'
}
