'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { TitleBar } from '@/components/hub/title-bar'
import { WelcomeCarousel } from '@/components/workspace/welcome-carousel'
import { TaskListHome } from '@/components/workspace/task-list-home'
import { BankConnectionFlow } from '@/components/workspace/bank-connection-flow'
import { ConfirmationFlow } from '@/components/workspace/confirmation-flow'
import { FinancialSummaryPage } from '@/components/workspace/financial-summary-page'
import type { BankConnectionPhase, ConnectedAccount, SectionConfirmation, SpendingFlowResult, WorkspaceView } from '@/types/hub'
import type { BankStatementExtraction } from '@/lib/ai/extraction-schemas'
import { SpendingFlow } from '@/components/workspace/spending-flow'
import { MegaFooter } from '@/components/workspace/mega-footer'

// ═══ Session persistence ═══
// Bridge until Supabase (#65). Saves workspace progress to sessionStorage
// so page reloads don't lose the user's work within the same browser session.

const STORAGE_KEY = 'decouple-workspace-state'

interface PersistedState {
  view: WorkspaceView
  bankConnected: boolean
  connectedAccounts: ConnectedAccount[]
  bankExtractions: BankStatementExtraction[]
  confirmationComplete: boolean
  confirmations: SectionConfirmation[]
  spendingResult: SpendingFlowResult | null
}

function loadPersistedState(): PersistedState | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as PersistedState
  } catch {
    return null
  }
}

function savePersistedState(state: PersistedState) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch { /* storage full or unavailable — degrade silently */ }
}

function getInitialState(): {
  view: WorkspaceView
  bankConnected: boolean
  connectedAccounts: ConnectedAccount[]
  bankExtractions: BankStatementExtraction[]
  confirmationComplete: boolean
  confirmations: SectionConfirmation[]
  spendingResult: SpendingFlowResult | null
} {
  const saved = loadPersistedState()
  if (saved) {
    // On reload, land on a safe resting screen (not mid-flow screens)
    let view = saved.view
    if (view === 'bank_connection' || view === 'confirmation' || view === 'spending_upgrade') {
      view = saved.confirmationComplete ? 'financial_summary' : 'task_list'
    }
    return { ...saved, view }
  }
  return {
    view: 'carousel',
    bankConnected: false,
    connectedAccounts: [],
    bankExtractions: [],
    confirmationComplete: false,
    confirmations: [],
    spendingResult: null,
  }
}

export default function WorkspacePage() {
  const initial = useRef(getInitialState()).current

  const [view, setView] = useState<WorkspaceView>(initial.view)
  const [bankPhase, setBankPhase] = useState<BankConnectionPhase>('idle')
  const [bankConnected, setBankConnected] = useState(initial.bankConnected)
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>(initial.connectedAccounts)
  const [bankExtractions, setBankExtractions] = useState<BankStatementExtraction[]>(initial.bankExtractions)
  const [confirmationComplete, setConfirmationComplete] = useState(initial.confirmationComplete)
  const [confirmations, setConfirmations] = useState<SectionConfirmation[]>(initial.confirmations)
  const [spendingResult, setSpendingResult] = useState<SpendingFlowResult | null>(initial.spendingResult)
  const [spendingReturnTo, setSpendingReturnTo] = useState<'task_list' | 'financial_summary'>('financial_summary')

  // Persist state on every meaningful change
  useEffect(() => {
    savePersistedState({
      view,
      bankConnected,
      connectedAccounts,
      bankExtractions,
      confirmationComplete,
      confirmations,
      spendingResult,
    })
  }, [view, bankConnected, connectedAccounts, bankExtractions, confirmationComplete, confirmations, spendingResult])

  // ═══ Navigation callbacks ═══

  const handleCarouselComplete = useCallback(() => {
    setView('task_list')
  }, [])

  const handleGetStarted = useCallback(() => {
    setView('bank_connection')
    setBankPhase('loader')
  }, [])

  const handleSkip = useCallback(() => {
    // "Skip for now, I want to have a look around" — stay on task list
  }, [])

  const handleBankComplete = useCallback(
    (accounts: ConnectedAccount[], _revealItems: unknown, extractions: BankStatementExtraction[]) => {
      setConnectedAccounts(accounts)
      setBankExtractions(extractions)
      setBankConnected(true)
      setBankPhase('idle')
      setView('confirmation')
    },
    []
  )

  const handleBankCancel = useCallback(() => {
    setBankPhase('idle')
    setView('task_list')
  }, [])

  const handleConfirmationComplete = useCallback(
    (sectionConfirmations: SectionConfirmation[], spending?: SpendingFlowResult) => {
      setConfirmations(sectionConfirmations)
      if (spending) setSpendingResult(spending)
      setConfirmationComplete(true)
      setView('financial_summary')
    },
    []
  )

  const handleViewSummary = useCallback(() => {
    setView('financial_summary')
  }, [])

  const handleStartSpending = useCallback(() => {
    setSpendingReturnTo(view === 'financial_summary' ? 'financial_summary' : 'task_list')
    setView('spending_upgrade')
  }, [view])

  const handleSpendingUpgradeComplete = useCallback((result: SpendingFlowResult) => {
    setSpendingResult(result)
    setView('financial_summary')
  }, [])

  const handleDisconnect = useCallback(() => {
    setBankConnected(false)
    setConnectedAccounts([])
    setBankExtractions([])
    setConfirmationComplete(false)
    setConfirmations([])
    setSpendingResult(null)
    setView('task_list')
    try { sessionStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
  }, [])

  // ═══ Title bar context ═══

  const titleProps = getTitleProps(view, bankPhase)

  return (
    <div className="min-h-screen bg-off-white">
      <TitleBar {...titleProps} />

      <main className="mx-auto max-w-[var(--content-max-width)] px-6 py-8">
        {/* Welcome carousel (screens 1a-1c) */}
        {view === 'carousel' && (
          <WelcomeCarousel onComplete={handleCarouselComplete} />
        )}

        {/* Task list home (screen 2a / 2j) */}
        {view === 'task_list' && (
          <TaskListHome
            bankConnected={bankConnected}
            connectedAccounts={connectedAccounts}
            confirmationComplete={confirmationComplete}
            confirmations={confirmations}
            extractions={bankExtractions}
            spendingResult={spendingResult}
            onGetStarted={handleGetStarted}
            onSkip={handleSkip}
            onViewSummary={handleViewSummary}
            onStartSpending={handleStartSpending}
          />
        )}

        {/* Bank connection flow (screens 3, 3b-3e) */}
        {view === 'bank_connection' && (
          <BankConnectionFlow
            phase={bankPhase}
            onPhaseChange={setBankPhase}
            onComplete={handleBankComplete}
            onCancel={handleBankCancel}
          />
        )}

        {/* Confirmation flow (screens 2b-2i) */}
        {view === 'confirmation' && (
          <ConfirmationFlow
            extractions={bankExtractions}
            connectedAccounts={connectedAccounts}
            onComplete={handleConfirmationComplete}
          />
        )}

        {/* Spending upgrade (re-entry from estimates → full bank data) */}
        {view === 'spending_upgrade' && (
          <div className="max-w-[var(--content-narrow)] mx-auto">
            <button
              onClick={() => setView(spendingReturnTo)}
              className="text-[13px] font-medium text-blue-600 hover:underline mb-6 inline-block"
            >
              &larr; {spendingReturnTo === 'financial_summary' ? 'Back to financial summary' : 'Back to workspace'}
            </button>
            <div
              className="bg-white overflow-hidden p-6"
              style={{
                borderRadius: 'var(--radius-card)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <SpendingFlow
                extractions={bankExtractions}
                connectedAccounts={connectedAccounts}
                hasChildren={bankExtractions.some((e) =>
                  e.income_deposits.some((d) => d.type === 'benefits' && d.source.toLowerCase().includes('child')),
                )}
                onComplete={handleSpendingUpgradeComplete}
                onSkip={() => setView(spendingReturnTo)}
                startInCategorise
              />
            </div>
          </div>
        )}

        {/* Financial summary (screen 3a) */}
        {view === 'financial_summary' && (
          <FinancialSummaryPage
            extractions={bankExtractions}
            connectedAccounts={connectedAccounts}
            confirmations={confirmations}
            spendingResult={spendingResult}
            onBack={() => setView('task_list')}
            onStartSpending={handleStartSpending}
            onDisconnect={handleDisconnect}
          />
        )}
      </main>

      <MegaFooter />
    </div>
  )
}

// ═══ Title bar helpers ═══

function getTitleProps(
  view: WorkspaceView,
  bankPhase: BankConnectionPhase
): { title: string; subtitle?: string; showShareButton: boolean } {
  switch (view) {
    case 'carousel':
      return { title: 'Overview', subtitle: 'Welcome', showShareButton: false }
    case 'task_list':
      return { title: 'Overview', subtitle: 'Home', showShareButton: false }
    case 'bank_connection':
      if (bankPhase === 'complete' || bankPhase === 'reveal') {
        return { title: 'Connected to your bank', showShareButton: false }
      }
      return { title: 'Overview', subtitle: 'Preparation', showShareButton: false }
    case 'confirmation':
      return { title: 'Preparation', showShareButton: true }
    case 'financial_summary':
      return { title: 'Financial summary', showShareButton: true }
    case 'spending_upgrade':
      return { title: 'Preparation', subtitle: 'Spending', showShareButton: false }
    default:
      return { title: 'Overview', showShareButton: false }
  }
}
