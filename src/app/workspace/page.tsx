'use client'

import { useState, useCallback } from 'react'
import { TitleBar } from '@/components/hub/title-bar'
import { WelcomeCarousel } from '@/components/workspace/welcome-carousel'
import { TaskListHome } from '@/components/workspace/task-list-home'
import { BankConnectionFlow } from '@/components/workspace/bank-connection-flow'
import type { WorkspaceView, BankConnectionPhase, ConnectedAccount, RevealItem } from '@/types/hub'

export default function WorkspacePage() {
  const [view, setView] = useState<WorkspaceView>('carousel')
  const [bankPhase, setBankPhase] = useState<BankConnectionPhase>('idle')
  const [bankConnected, setBankConnected] = useState(false)
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([])
  const [confirmationComplete] = useState(false) // Session 10: will wire up confirmation flow

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
    (accounts: ConnectedAccount[], _revealItems: RevealItem[]) => {
      setConnectedAccounts(accounts)
      setBankConnected(true)
      setBankPhase('idle')
      setView('task_list')
    },
    []
  )

  const handleBankCancel = useCallback(() => {
    setBankPhase('idle')
    setView('task_list')
  }, [])

  const handleViewSummary = useCallback(() => {
    setView('financial_summary')
  }, [])

  // ═══ Title bar context ═══

  const titleProps = getTitleProps(view, bankPhase)

  return (
    <div className="min-h-screen bg-off-white">
      <TitleBar {...titleProps} />

      <main className="mx-auto max-w-[var(--content-max-width)] py-2">
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

        {/* Financial summary placeholder (screen 3a — session 10) */}
        {view === 'financial_summary' && (
          <div className="px-6 pt-8">
            <div className="max-w-[var(--content-max-width)] mx-auto">
              <button
                onClick={() => setView('task_list')}
                className="text-sm font-medium text-blue-600 hover:underline mb-6"
              >
                &larr; Back to your dashboard
              </button>
              <h2 className="text-2xl font-bold text-ink mb-6">
                Your financial picture
              </h2>
              <div className="bg-white rounded-lg border border-grey-100 p-8 text-center">
                <p className="text-ink-secondary text-sm">
                  Financial summary will be built in session 10.
                </p>
              </div>
            </div>
          </div>
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
    case 'financial_summary':
      return { title: 'Financial summary', showShareButton: true }
    default:
      return { title: 'Overview', showShareButton: false }
  }
}
