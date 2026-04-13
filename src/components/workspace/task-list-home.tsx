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
    <div className="max-w-[var(--content-max-width)] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-[28px] font-bold text-ink leading-tight">
          {bankConnected ? 'Welcome back' : "Let\u2019s get started"}
        </h2>
        <p className="mt-2 text-[15px] text-ink-secondary">
          {bankConnected
            ? 'Your task list'
            : 'We\u2019ll add tasks as you progress'}
        </p>
      </div>

      {/* ═══ Preparation phase ═══ */}
      <div
        className="bg-white overflow-hidden"
        style={{
          borderRadius: 'var(--radius-card)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--color-grey-100)' }}>
          <span className="text-[12px] font-semibold text-ink-tertiary uppercase tracking-wider">
            Preparation
          </span>
        </div>

        {!bankConnected ? (
          <div className="p-6">
            <p className="text-[15px] font-medium text-ink leading-snug">
              Connect your bank account and be ready for financial disclosure in 3 minutes
            </p>
            <button
              onClick={onGetStarted}
              className="mt-5 w-full sm:w-auto px-6 py-3 text-white text-[15px] font-semibold transition-colors active:scale-[0.98]"
              style={{
                backgroundColor: 'var(--color-red-500)',
                borderRadius: 'var(--radius-card)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-red-600)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-red-500)')}
            >
              Get started
            </button>
            <button
              onClick={onSkip}
              className="mt-3 block text-[13px] text-ink-tertiary hover:text-ink-secondary transition-colors"
            >
              Skip for now
            </button>
          </div>
        ) : (
          <div>
            {/* Bank connection row */}
            <div className="p-6" style={{ borderBottom: '1px solid var(--color-grey-100)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center">
                    <Check size={12} className="text-white" strokeWidth={3} />
                  </div>
                  <span className="text-[15px] font-medium text-ink">
                    {accountCount} {bankName} account{accountCount !== 1 ? 's' : ''}
                  </span>
                  <ChevronDown size={16} className="text-ink-tertiary" />
                </div>
                <span
                  className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: 'var(--color-green-50)', color: 'var(--color-green-600)' }}
                >
                  Connected
                </span>
              </div>
              {confirmationComplete && (
                <div className="mt-3 ml-7">
                  <p className="text-[13px] text-ink-secondary">
                    10 Form E sections complete and ready for sharing
                  </p>
                  <button
                    onClick={onViewSummary}
                    className="mt-2 text-[13px] font-medium text-blue-600 hover:underline"
                  >
                    View financial summary
                  </button>
                </div>
              )}
            </div>

            {!confirmationComplete && (
              <div className="p-6">
                <p className="text-[13px] text-ink-secondary">
                  Processing your bank data — confirmation questions will appear shortly.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ═══ Sharing & collaboration phase ═══ */}
      <div
        className="mt-4 bg-white overflow-hidden opacity-50"
        style={{
          borderRadius: 'var(--radius-card)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div className="px-6 py-5 flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-[12px] font-semibold text-ink-tertiary uppercase tracking-wider">
            Sharing &amp; collaboration
          </span>
          <div className="flex items-center gap-1.5 text-ink-disabled">
            <Lock size={13} className="shrink-0" />
            <span className="text-[12px]">
              {bankConnected ? 'After confirmation' : 'After bank connection'}
            </span>
          </div>
        </div>
      </div>

      {/* ═══ Finalisation phase ═══ */}
      <div
        className="mt-4 bg-white overflow-hidden opacity-50"
        style={{
          borderRadius: 'var(--radius-card)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div className="px-6 py-5 flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-[12px] font-semibold text-ink-tertiary uppercase tracking-wider">
            Finalisation
          </span>
          <div className="flex items-center gap-1.5 text-ink-disabled">
            <Lock size={13} className="shrink-0" />
            <span className="text-[12px]">Collate final evidence</span>
          </div>
        </div>
      </div>
    </div>
  )
}
