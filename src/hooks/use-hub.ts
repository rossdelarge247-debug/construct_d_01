'use client'

import { useState, useCallback, useEffect } from 'react'
import type {
  ConfigAnswers,
  SectionData,
  SectionKey,
  EvidenceLozenge,
  FinancialItem,
  FidelityLevel,
  HeroPanelState,
  ClarificationQuestion,
  AutoConfirmItem,
  INITIAL_CONFIG,
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

export function useHub() {
  const [config, setConfig] = useState<ConfigAnswers>(EMPTY_CONFIG)
  const [items, setItems] = useState<FinancialItem[]>([])
  const [heroPanelState, setHeroPanelState] = useState<HeroPanelState>('ready')
  const [questions, setQuestions] = useState<ClarificationQuestion[]>([])
  const [autoConfirmItems, setAutoConfirmItems] = useState<AutoConfirmItem[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [loaded, setLoaded] = useState(false)

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
      evidenceSummary: null,
      outstandingQuestions: 0,
    }))

  // ═══ Lozenges derived from config ═══

  const lozenges: EvidenceLozenge[] = generateLozenges(config)

  // ═══ Fidelity calculation ═══

  const fidelity: FidelityLevel = calculateFidelity(items, config)

  // ═══ Hero panel actions ═══

  const handleFilesDropped = useCallback((files: File[]) => {
    setHeroPanelState('uploading')

    // Simulate upload → classification → analysis
    setTimeout(() => setHeroPanelState('uploading_context'), 1500)
    setTimeout(() => setHeroPanelState('analysing'), 3000)
    setTimeout(() => {
      // Generate mock Q&A data — in production this comes from the AI pipeline
      setAutoConfirmItems([
        {
          id: 'auto-1',
          label: 'Monthly salary: £3,218 net from ACME Ltd',
          detail: '2 deposits, same source, consistent amount',
          accepted: true,
        },
        {
          id: 'auto-2',
          label: 'Child Benefit: £96.25/month from HMRC',
          detail: 'Regular government payment detected',
          accepted: true,
        },
      ])
      setQuestions([
        {
          id: 'q1',
          questionText: '£1,150 goes to Halifax on the 1st of each month. Is this your mortgage?',
          reasoning: 'When we see a regular payment to a building society or bank for this sort of amount each month we assume that it might be a mortgage payment going out...',
          options: [
            { label: 'Yes it is', value: 'mortgage' },
            { label: 'No it\'s something else', value: 'other' },
          ],
          primaryOption: 'Yes it is',
          secondaryLabel: 'No it\'s something else',
          formEField: '2.1 + 3.1',
          answered: false,
          answer: null,
        },
        {
          id: 'q2',
          questionText: '£89/month to Aviva. Is this your pension contribution, or insurance?',
          reasoning: '',
          options: [
            { label: 'Pension', value: 'pension' },
            { label: 'Insurance', value: 'insurance' },
            { label: 'No it\'s something else', value: 'other' },
          ],
          primaryOption: null,
          secondaryLabel: 'No it\'s something else',
          formEField: '2.13 or 3.1',
          answered: false,
          answer: null,
        },
        {
          id: 'q3',
          questionText: 'We can see a joint account holder on this account. Is this a joint account with your partner?',
          reasoning: 'Explanation as to why we made this assumption',
          options: [
            { label: 'Yes it is', value: 'joint' },
            { label: 'No it\'s something else', value: 'sole' },
          ],
          primaryOption: 'Yes it is',
          secondaryLabel: 'No it\'s something else',
          formEField: '2.3',
          answered: false,
          answer: null,
        },
      ])
      setCurrentQuestionIndex(0)
      setHeroPanelState('review_ready')
    }, 5000)
  }, [])

  const startReview = useCallback(() => {
    setHeroPanelState('auto_confirm')
  }, [])

  const acceptAutoConfirm = useCallback((acceptedIds: string[]) => {
    // Add auto-confirmed items as financial items
    const now = new Date().toISOString()
    const newItems: FinancialItem[] = acceptedIds.map((id) => {
      const autoItem = autoConfirmItems.find((i) => i.id === id)
      return {
        id: `fi-${id}`,
        sectionKey: 'income' as SectionKey,
        label: autoItem?.label || '',
        value: null,
        period: 'monthly',
        ownership: 'yours',
        confidence: 'confirmed',
        sourceDocumentId: null,
        sourceDescription: autoItem?.detail || null,
        isInherited: false,
        isPreMarital: false,
        asAtDate: null,
        createdAt: now,
        updatedAt: now,
      }
    })
    setItems((prev) => [...prev, ...newItems])
    setHeroPanelState('clarification')
  }, [autoConfirmItems])

  const answerQuestion = useCallback((questionId: string, answer: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, answered: true, answer } : q))
    )
    const nextIndex = currentQuestionIndex + 1
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex)
    } else {
      setHeroPanelState('summary')
    }
  }, [currentQuestionIndex, questions.length])

  const finishSession = useCallback(() => {
    setHeroPanelState('ready')
    setQuestions([])
    setAutoConfirmItems([])
    setCurrentQuestionIndex(0)
  }, [])

  const resetToReady = useCallback(() => {
    setHeroPanelState('ready')
  }, [])

  // ═══ Section actions (stubs) ═══

  const openManualInput = useCallback((sectionKey: SectionKey) => {
    // TODO: open manual input flow for section
  }, [])

  const openSectionReview = useCallback((sectionKey: SectionKey) => {
    // TODO: open review flow for section
  }, [])

  const addSection = useCallback(() => {
    // TODO: show section picker
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
      if (config.employment === 'employed' || config.employment === 'both') return null // Will come from payslip/bank
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

function generateLozenges(config: ConfigAnswers): EvidenceLozenge[] {
  const lozenges: EvidenceLozenge[] = [
    { type: 'current_account', label: 'Current account', status: 'empty', count: 0, documents: [] },
  ]

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
    lozenges.push({ type: 'other_assets', label: `${config.otherAssets.length} Other asset${config.otherAssets.length > 1 ? 's' : ''}`, status: 'empty', count: 0, documents: [] })
  }

  if (config.hasDebts) {
    lozenges.push({ type: 'credit_cards', label: 'Debt statements', status: 'empty', count: 0, documents: [] })
  }

  return lozenges
}

function calculateFidelity(items: FinancialItem[], config: ConfigAnswers): FidelityLevel {
  if (items.length === 0) return 'sketch'

  const confirmedItems = items.filter((i) => i.confidence === 'confirmed')
  if (confirmedItems.length >= 3) return 'draft'

  // More sophisticated calculation would check sections coverage, evidence completeness, etc.
  return 'sketch'
}
