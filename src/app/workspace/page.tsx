'use client'

import { useState, useCallback } from 'react'
import { TitleBar } from '@/components/hub/title-bar'
import { WelcomeCarousel } from '@/components/workspace/welcome-carousel'
import { TaskListHome } from '@/components/workspace/task-list-home'
import { BankConnectionFlow } from '@/components/workspace/bank-connection-flow'
import { ConfirmationFlow } from '@/components/workspace/confirmation-flow'
import { FinancialSummaryPage } from '@/components/workspace/financial-summary-page'
import type { BankConnectionPhase, ConnectedAccount, SectionConfirmation, SpendingFlowResult } from '@/types/hub'
import type { BankStatementExtraction } from '@/lib/ai/extraction-schemas'
import { SpendingFlow } from '@/components/workspace/spending-flow'

type WorkspaceView = 'carousel' | 'task_list' | 'bank_connection' | 'confirmation' | 'financial_summary' | 'spending_upgrade'

export default function WorkspacePage() {
  const [view, setView] = useState<WorkspaceView>('carousel')
  const [bankPhase, setBankPhase] = useState<BankConnectionPhase>('idle')
  const [bankConnected, setBankConnected] = useState(false)
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([])
  const [bankExtractions, setBankExtractions] = useState<BankStatementExtraction[]>([])
  const [confirmationComplete, setConfirmationComplete] = useState(false)
  const [confirmations, setConfirmations] = useState<SectionConfirmation[]>([])
  const [spendingResult, setSpendingResult] = useState<SpendingFlowResult | null>(null)

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
    setView('spending_upgrade')
  }, [])

  const handleSpendingUpgradeComplete = useCallback((result: SpendingFlowResult) => {
    setSpendingResult(result)
    setView('financial_summary')
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
                onSkip={() => setView('task_list')}
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
          />
        )}
      </main>
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
