'use client'

import { useState, useCallback } from 'react'
import { TitleBar } from '@/components/hub/title-bar'
import { WelcomeCarousel } from '@/components/workspace/welcome-carousel'
import { TaskListHome } from '@/components/workspace/task-list-home'
import { BankConnectionFlow } from '@/components/workspace/bank-connection-flow'
import { ConfirmationFlow } from '@/components/workspace/confirmation-flow'
import { FinancialSummaryPage } from '@/components/workspace/financial-summary-page'
import type { WorkspaceView, BankConnectionPhase, ConnectedAccount, SectionConfirmation } from '@/types/hub'
import type { BankStatementExtraction } from '@/lib/ai/extraction-schemas'

export default function WorkspacePage() {
  const [view, setView] = useState<WorkspaceView>('carousel')
  const [bankPhase, setBankPhase] = useState<BankConnectionPhase>('idle')
  const [bankConnected, setBankConnected] = useState(false)
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([])
  const [bankExtractions, setBankExtractions] = useState<BankStatementExtraction[]>([])
  const [confirmationComplete, setConfirmationComplete] = useState(false)
  const [confirmations, setConfirmations] = useState<SectionConfirmation[]>([])

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
    (sectionConfirmations: SectionConfirmation[]) => {
      setConfirmations(sectionConfirmations)
      setConfirmationComplete(true)
      setView('financial_summary')
    },
    []
  )

  const handleViewSummary = useCallback(() => {
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
            onGetStarted={handleGetStarted}
            onSkip={handleSkip}
            onViewSummary={handleViewSummary}
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

        {/* Financial summary (screen 3a) */}
        {view === 'financial_summary' && (
          <FinancialSummaryPage
            extractions={bankExtractions}
            connectedAccounts={connectedAccounts}
            confirmations={confirmations}
            onBack={() => setView('task_list')}
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
    default:
      return { title: 'Overview', showShareButton: false }
  }
}
