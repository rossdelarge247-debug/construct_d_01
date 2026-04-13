'use client'

import { Check, ChevronDown, Lock } from 'lucide-react'
import type { ConnectedAccount } from '@/types/hub'

interface TaskListHomeProps {
  bankConnected: boolean
  connectedAccounts: ConnectedAccount[]
  confirmationComplete: boolean
  onGetStarted: () => void
  onSkip: () => void
  onViewSummary: () => void
}

export function TaskListHome({
  bankConnected,
  connectedAccounts,
  confirmationComplete,
  onGetStarted,
  onSkip,
  onViewSummary,
}: TaskListHomeProps) {
  const accountCount = connectedAccounts.length
  const bankName = connectedAccounts[0]?.bankName ?? 'your bank'

  return (
    <div className="px-6 pt-8">
      <div className="max-w-[var(--content-max-width)] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-ink">
            {bankConnected ? `Welcome back` : `Let's get started`}
          </h2>
          <p className="mt-1 text-sm text-ink-secondary">
            {bankConnected
              ? 'This is your task list of things to do'
              : 'We will add to your task list as you progress'}
          </p>
        </div>

        {/* ═══ Preparation phase ═══ */}
        <div className="bg-white rounded-lg border border-grey-100 overflow-hidden">
          <div className="px-5 py-3 border-b border-grey-100">
            <span className="text-xs font-semibold text-ink-secondary uppercase tracking-wider">
              Preparation
            </span>
          </div>

          {!bankConnected ? (
            /* First-time state: single bank connect task */
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-[15px] font-medium text-ink leading-snug">
                    Connect your bank account and be ready for financial disclosure in 3 minutes
                  </p>
                </div>
                <button
                  onClick={onGetStarted}
                  className="shrink-0 px-5 py-2.5 bg-ink text-white text-sm font-semibold rounded-md hover:opacity-90 transition-opacity active:scale-[0.98]"
                >
                  Get started
                </button>
              </div>
              <button
                onClick={onSkip}
                className="mt-3 text-sm text-ink-tertiary hover:text-ink-secondary transition-colors"
              >
                Skip for now, I want to have a look around
              </button>
            </div>
          ) : (
            /* Post-connection state: bank connected row + tasks */
            <div>
              {/* Bank connection row */}
              <div className="p-5 border-b border-grey-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center">
                      <Check size={12} className="text-white" strokeWidth={3} />
                    </div>
                    <span className="text-[15px] font-medium text-ink">
                      {accountCount} {bankName} bank account{accountCount !== 1 ? 's' : ''}
                    </span>
                    <ChevronDown size={16} className="text-ink-tertiary" />
                  </div>
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                    Connected
                  </span>
                </div>
                {confirmationComplete && (
                  <div className="mt-2 ml-7">
                    <p className="text-sm text-ink-secondary">
                      10 Form E sections are now complete and ready for sharing!
                    </p>
                    <button
                      onClick={onViewSummary}
                      className="mt-2 text-sm font-medium text-blue-600 hover:underline"
                    >
                      View financial summary
                    </button>
                  </div>
                )}
              </div>

              {/* Placeholder tasks — will be dynamic in session 11 */}
              {!confirmationComplete && (
                <div className="p-5">
                  <p className="text-sm text-ink-secondary">
                    Processing your bank data — confirmation questions will appear shortly.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ═══ Sharing & collaboration phase ═══ */}
        <div className="mt-4 bg-white rounded-lg border border-grey-100 overflow-hidden opacity-60">
          <div className="px-5 py-4 flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-secondary uppercase tracking-wider">
              Sharing &amp; collaboration
            </span>
            <div className="flex items-center gap-1.5 text-ink-tertiary">
              <Lock size={13} />
              <span className="text-xs">
                {bankConnected ? 'Available after confirmation' : 'Available after bank connection'}
              </span>
            </div>
          </div>
        </div>

        {/* ═══ Finalisation phase ═══ */}
        <div className="mt-4 bg-white rounded-lg border border-grey-100 overflow-hidden opacity-60">
          <div className="px-5 py-4 flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-secondary uppercase tracking-wider">
              Finalisation
            </span>
            <div className="flex items-center gap-1.5 text-ink-tertiary">
              <Lock size={13} />
              <span className="text-xs">Not available yet, collate final evidence</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
