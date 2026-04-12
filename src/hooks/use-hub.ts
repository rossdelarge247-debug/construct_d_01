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
  // Pipeline diagnostics for debug panel
  const [lastDiagnostics, setLastDiagnostics] = useState<Record<string, unknown> | null>(null)
  const [lastClassification, setLastClassification] = useState<Record<string, unknown> | null>(null)
  const [lastTransformedCounts, setLastTransformedCounts] = useState<{ autoConfirm: number; questions: number; financialItems: number } | null>(null)

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

      // Read body as text first, then parse — avoids stream-consumed issue
      // where response.json() fails and response.text() returns empty
      const responseText = await response.text()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let data: any
      try {
        data = JSON.parse(responseText)
      } catch {
        setUploadContext((prev) => ({
          ...prev,
          error: `Server returned an invalid response (${response.status}). ${responseText.substring(0, 300)}`,
        }))
        setHeroPanelState('ready')
        return
      }

      if (!response.ok || data.error) {
        setUploadContext((prev) => ({ ...prev, error: data.error || `Upload failed (${response.status})` }))
        if (data.diagnostics) setLastDiagnostics(data.diagnostics)
        if (data.result?.classification) setLastClassification(data.result.classification)
        setHeroPanelState('ready')
        return
      }

      const { result, transformed, diagnostics: pipelineDiagnostics } = data
      const classification = result.classification

      // Store diagnostics for debug panel
      setLastDiagnostics(pipelineDiagnostics || null)
      setLastClassification(classification || null)
      setLastTransformedCounts(transformed ? {
        autoConfirm: transformed.autoConfirmItems?.length || 0,
        questions: transformed.questions?.length || 0,
        financialItems: transformed.financialItems?.length || 0,
      } : null)

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
        // Build clean summary for flyout (not raw AI description)
        const provider = classification.provider || ''
        const docTypeLabels: Record<string, string> = {
          bank_statement: 'statement',
          payslip: 'payslip',
          mortgage_statement: 'mortgage statement',
          pension_cetv: 'CETV letter',
          savings_statement: 'savings statement',
          credit_card_statement: 'credit card statement',
          p60: 'P60',
          tax_return: 'tax return',
        }
        const typeLabel = docTypeLabels[classification.document_type] || 'document'
        const summary = provider ? `${provider} ${typeLabel}` : file.name

        setLozengeState((prev) =>
          prev.map((l) => l.type === lozengeType
            ? {
                ...l,
                status: 'uploaded' as const,
                documents: [...l.documents, {
                  id: `doc-${Date.now()}`,
                  fileName: file.name,
                  fileType: file.type,
                  description: summary,
                  uploadedAt: new Date().toISOString(),
                  monthsCovered: 1, // TODO: calculate from statement period
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
    // Match by ID prefix: auto-confirm id "income-acme-123" → financial item id "fi-income-acme-123"
    const accepted = new Set(acceptedIds)
    const itemsToAdd = pendingFinancialItems.current.filter(
      (fi) => accepted.has(fi.id.replace(/^fi-/, ''))
    )

    if (itemsToAdd.length > 0) {
      setItems((prev) => mergeItemsDeduped(prev, itemsToAdd))
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

    const answeredQ = questions.find((q) => q.id === questionId)
    if (answeredQ && answer !== 'skipped') {
      // Own company answer → capture business name and enable business section
      if (OWN_COMPANY_ANSWERS.has(answer)) {
        const businessName = extractSourceName(answeredQ.questionText)
        if (businessName) {
          setConfig((prev) => ({
            ...prev,
            employment: prev.employment === 'employed' ? 'both' : 'self_employed',
            businessStructure: prev.businessStructure || 'limited',
          }))
        }
      }

      // First, check if the transformer pre-created a financial item for this question (ID-based match)
      const preCreatedItem = pendingFinancialItems.current.find(
        (fi) => fi.id === `fi-${questionId}`
      )

      if (preCreatedItem) {
        // Refine the pre-created item based on the answer
        const refinedItem = { ...preCreatedItem, ...resolveAnswerToSection(answer, preCreatedItem) }
        setItems((prev) => mergeItemsDeduped(prev, [refinedItem]))
      } else {
        // No pre-created item — create one from the question + answer
        const newItem = createItemFromAnswer(answeredQ, answer)
        if (newItem) {
          setItems((prev) => mergeItemsDeduped(prev, [newItem]))
        }
      }
    }

    const nextIndex = currentQuestionIndex + 1
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex)
    } else {
      // Add any remaining pending items not yet added (with account dedup)
      setItems((prev) => mergeItemsDeduped(prev, pendingFinancialItems.current))
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

  const skipQuestion = useCallback((questionId: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, answered: true, answer: 'skipped' } : q))
    )
    const nextIndex = currentQuestionIndex + 1
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex)
    } else {
      setItems((prev) => mergeItemsDeduped(prev, pendingFinancialItems.current))
      setHeroPanelState('summary')
    }
  }, [currentQuestionIndex, questions])

  const cancelReview = useCallback(() => {
    setHeroPanelState('ready')
    setQuestions([])
    setAutoConfirmItems([])
    setCurrentQuestionIndex(0)
    pendingFinancialItems.current = []
  }, [])

  const resetToReady = useCallback(() => {
    setHeroPanelState('ready')
  }, [])

  // ═══ Dynamic summary content ═══

  const summaryAchievements = generateAchievements(items, sections, uploadContext)
  const summaryTodoItems = generateTodoItems(lozengeState, config, sections)

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
    skipQuestion,
    cancelReview,
    finishSession,
    resetToReady,
    summaryAchievements,
    summaryTodoItems,
    lastDiagnostics,
    lastClassification,
    lastTransformedCounts,
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

/**
 * Generate dynamic summary achievements from actual processed data.
 * Per spec 16: every achievement framed in terms of what the user can now DO.
 */
function generateAchievements(
  items: FinancialItem[],
  sections: SectionData[],
  context: UploadContext,
): string[] {
  const achievements: string[] = []

  const incomeItems = items.filter((i) => i.sectionKey === 'income' && i.confidence === 'confirmed')
  if (incomeItems.length > 0) {
    achievements.push("We've got a good understanding of your income, ready for a first mediation conversation")
  }

  const spendingItems = items.filter((i) => i.sectionKey === 'spending')
  if (spendingItems.length > 0) {
    achievements.push('Your monthly spending behaviours are ready for a first mediation chat or conversation')
  }

  const accountItems = items.filter((i) => i.sectionKey === 'accounts')
  if (accountItems.length > 0) {
    achievements.push(`We've identified ${accountItems.length} account${accountItems.length > 1 ? 's' : ''} from your statements`)
  }

  const propertyItems = items.filter((i) => i.sectionKey === 'property')
  if (propertyItems.length > 0) {
    achievements.push('Your property details have been captured')
  }

  const pensionItems = items.filter((i) => i.sectionKey === 'pensions')
  if (pensionItems.length > 0) {
    achievements.push('Your pension information has been recorded')
  }

  if (achievements.length === 0 && items.length > 0) {
    achievements.push(`${items.length} item${items.length > 1 ? 's' : ''} added to your financial picture`)
  }

  return achievements
}

/**
 * Generate dynamic todo items from remaining lozenges and section gaps.
 * Per spec 16: todo items are specific and actionable with context.
 */
function generateTodoItems(
  lozenges: EvidenceLozenge[],
  config: ConfigAnswers,
  sections: SectionData[],
): { text: string; helpLink?: string }[] {
  const todos: { text: string; helpLink?: string }[] = []

  const emptyLozenges = lozenges.filter((l) => l.status === 'empty')
  for (const lozenge of emptyLozenges) {
    switch (lozenge.type) {
      case 'pensions':
        todos.push({
          text: "Upload your pension details, we have your estimates, so this doesn't block your first mediation chat. But have you applied for the official valuation yet?",
          helpLink: 'Help with this',
        })
        break
      case 'mortgage_details':
        todos.push({ text: 'Upload your mortgage statements' })
        break
      case 'payslips':
        todos.push({ text: 'Upload your payslips for 3 months' })
        break
      case 'savings_account':
        todos.push({ text: 'Upload your savings account statements' })
        break
      case 'credit_cards':
        todos.push({ text: 'Upload your credit card or loan statements' })
        break
      case 'current_account':
        todos.push({ text: 'Upload your current account bank statements (12 months ideal)' })
        break
    }
  }

  const emptyVisibleSections = sections.filter(
    (s) => s.visible && s.status === 'not_started' && !s.estimateFromConfig
  )
  for (const section of emptyVisibleSections) {
    if (!todos.some((t) => t.text.toLowerCase().includes(section.label.toLowerCase()))) {
      todos.push({ text: `Add details for ${section.label}` })
    }
  }

  return todos
}

// ═══ Statement deduplication ═══
// When the same account is uploaded twice (same provider + last4),
// keep only the most recent closing balance (by asAtDate).

/**
 * Extract an account key from a financial item's label.
 * Returns "account-{provider}-{last4}" or "overdraft-{provider}-{last4}",
 * or null if the item isn't an account/overdraft item.
 */
function getAccountKey(item: FinancialItem): string | null {
  const isAccount = item.sectionKey === 'accounts'
  const isOverdraft = item.sectionKey === 'debts' && item.label.includes('— overdraft')
  if (!isAccount && !isOverdraft) return null

  // Match: "Your [joint] {Provider} {type}[ ending {last4}]"
  const match = item.label.match(/Your (?:joint )?(.+?) (?:current account|savings account|account)(?: ending (\d+))?/)
  if (!match) return null

  const provider = match[1].toLowerCase().trim()
  const last4 = match[2] || 'unknown'
  const prefix = isOverdraft ? 'overdraft-' : 'account-'
  return `${prefix}${provider}-${last4}`
}

/**
 * Merge incoming items into existing items with deduplication:
 * - Skip items whose ID already exists (existing behaviour)
 * - For account/overdraft items: replace older statement with newer one (by asAtDate)
 */
function mergeItemsDeduped(existing: FinancialItem[], incoming: FinancialItem[]): FinancialItem[] {
  const result = [...existing]

  for (const item of incoming) {
    // Skip exact ID duplicates
    if (result.some((i) => i.id === item.id)) continue

    // Account dedup: same provider+last4 → keep the newer statement
    const key = getAccountKey(item)
    if (key) {
      const existingIdx = result.findIndex((i) => getAccountKey(i) === key)
      if (existingIdx >= 0) {
        const existingDate = result[existingIdx].asAtDate ? new Date(result[existingIdx].asAtDate!).getTime() : 0
        const incomingDate = item.asAtDate ? new Date(item.asAtDate).getTime() : 0
        if (incomingDate > existingDate) {
          result[existingIdx] = item // Replace with newer statement
        }
        continue
      }
    }

    result.push(item)
  }

  return result
}

// ═══ Answer → Financial item helpers ═══

// Maps user answers to the correct section key
const ANSWER_TO_SECTION: Record<string, SectionKey> = {
  mortgage: 'property',
  rent: 'spending',
  employment: 'income',
  own_company_dividends: 'income',
  own_company_salary: 'income',
  benefits: 'income',
  rental: 'income',
  pension_income: 'income',
  maintenance_received: 'income',
  investment_return: 'income',
  pension_contribution: 'pensions',
  workplace: 'pensions',
  personal: 'pensions',
  loan_repayment: 'debts',
  child_maintenance: 'spending',
  childcare: 'spending',
  car_insurance: 'spending',
  home_insurance: 'spending',
  life_insurance: 'spending',
  healthcare: 'spending',
  dental: 'spending',
  vehicle: 'spending',
  leisure: 'spending',
  education: 'spending',
  legal: 'spending',
  phone: 'spending',
  broadband: 'spending',
  subscription: 'spending',
  pets: 'spending',
  household: 'spending',
  joint_partner: 'accounts',
}

// Answers that indicate "own company" — triggers business section + captures company name
const OWN_COMPANY_ANSWERS = new Set(['own_company_dividends', 'own_company_salary', 'own_company'])

// Maps answers to Form E category labels for section card grouping
const ANSWER_TO_FORM_E_CATEGORY: Record<string, string> = {
  mortgage: 'Mortgage',
  rent: 'Housing',
  employment: 'Employment income',
  own_company_dividends: 'Dividends',
  own_company_salary: 'Employment income',
  benefits: 'Benefits',
  rental: 'Rental income',
  pension_income: 'Pension income',
  maintenance_received: 'Maintenance received',
  investment_return: 'Investment income',
  pension_contribution: 'Pensions',
  workplace: 'Pensions',
  loan_repayment: 'Loan repayments',
  child_maintenance: 'Child maintenance',
  childcare: 'Childcare',
  car_insurance: 'Car — insurance',
  home_insurance: 'Insurance',
  life_insurance: 'Insurance',
  healthcare: 'Healthcare',
  dental: 'Healthcare / dental',
  vehicle: 'Vehicle costs',
  leisure: 'Personal / leisure',
  education: 'Children / education',
  legal: 'Legal costs',
  phone: 'Phone / communications',
  broadband: 'Broadband / TV',
  subscription: 'Subscriptions',
  pets: 'Pet costs',
  household: 'Household maintenance',
  // Form E category selector values
  housing: 'Housing',
  council_tax: 'Council tax',
  gas: 'Gas', electricity: 'Electricity', water: 'Water',
  food: 'Food / groceries',
  car_fuel: 'Car — fuel', car_tax_mot: 'Car — tax / MOT', car_maintenance: 'Car — maintenance',
  public_transport: 'Public transport',
  school_fees: 'School fees / activities',
  subscriptions: 'Subscriptions',
  eating_out: 'Eating out',
  personal: 'Personal',
  gifts: 'Gifts',
  savings_investments: 'Savings / investments',
  loan_repayments: 'Loan repayments',
  credit_card_payments: 'Credit card payments',
}

/**
 * When a pre-created financial item exists, refine its section/confidence based on the answer.
 */
function resolveAnswerToSection(
  answer: string,
  existing: FinancialItem,
): Partial<FinancialItem> {
  const sectionKey = ANSWER_TO_SECTION[answer] || existing.sectionKey
  return {
    sectionKey,
    confidence: 'confirmed',
    ownership: answer === 'joint_partner' || answer === 'joint' ? 'joint' : existing.ownership,
    updatedAt: new Date().toISOString(),
  }
}

/**
 * Extract a source/payee name from question text.
 * Matches "from SOURCE_NAME" at end of sentence, e.g.
 * "We found regular deposits of £2,000/monthly from User Need Ltd."
 */
function extractSourceName(questionText: string): string | null {
  const match = questionText.match(/from\s+(.+?)(?:\.|,|\?|$)/)
  return match ? match[1].trim() : null
}

/**
 * Create a new financial item from a clarification question + user answer.
 * Extracts amount from question text (£X,XXX pattern) and maps answer to section.
 */
function createItemFromAnswer(
  question: ClarificationQuestion,
  answer: string,
): FinancialItem | null {
  // Don't create items for informational questions (learn_more, understood, skip, etc.)
  const nonItemAnswers = ['learn_more', 'understood', 'skip', 'noted', 'review', 'correct', 'will_request', 'have_newer', 'other_income']
  if (nonItemAnswers.includes(answer)) return null

  // Extract amount from question text — matches £1,234 or £1234 patterns
  const amountMatch = question.questionText.match(/£([\d,]+)/)
  const amount = amountMatch ? parseInt(amountMatch[1].replace(/,/g, ''), 10) : null
  const sourceName = extractSourceName(question.questionText)

  // Build a meaningful label based on the answer type
  let label: string
  if (OWN_COMPANY_ANSWERS.has(answer)) {
    const companyName = sourceName || 'your company'
    label = answer === 'own_company_dividends'
      ? `Dividends from ${companyName}`
      : `Salary from ${companyName} (director)`
  } else {
    const answerOption = question.options.find((o) => o.value === answer)
    label = answerOption ? answerOption.label : answer
  }

  const sectionKey = ANSWER_TO_SECTION[answer] || 'spending'
  const now = new Date().toISOString()

  return {
    id: `fi-${question.id}`,
    sectionKey,
    label,
    value: amount,
    period: 'monthly',
    ownership: answer === 'joint_partner' || answer === 'joint' ? 'joint' : 'yours',
    confidence: 'confirmed',
    sourceDocumentId: null,
    sourceDescription: sourceName
      ? `From ${sourceName}: ${question.questionText.substring(0, 60)}`
      : `From question: ${question.questionText.substring(0, 60)}`,
    formECategory: ANSWER_TO_FORM_E_CATEGORY[answer] || null,
    isInherited: false,
    isPreMarital: answer === 'pre_marital',
    asAtDate: now,
    createdAt: now,
    updatedAt: now,
  }
}
