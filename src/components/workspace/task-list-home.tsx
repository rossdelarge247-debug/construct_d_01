'use client'

import { Check, ChevronDown, Lock, Plus, Upload } from 'lucide-react'
import type { ConnectedAccount, SectionConfirmation } from '@/types/hub'
import type { BankStatementExtraction } from '@/lib/ai/extraction-schemas'

// ═══ Task generation from confirmation data ═══

interface GeneratedTask {
  id: string
  label: string
  linkText?: string
  actionLabel: string
  actionStyle: 'filled' | 'outlined'
  completed: boolean
}

function generatePreparationTasks(
  confirmations: SectionConfirmation[],
  extractions: BankStatementExtraction[],
): GeneratedTask[] {
  const tasks: GeneratedTask[] = []

  // Pension CETV task — if user has pensions
  const hasPension = confirmations.some(
    (c) => c.sectionKey === 'pensions' && c.confirmedFacts.some((f) => f.includes('at least one')),
  )
  if (hasPension) {
    tasks.push({
      id: 'cetv',
      label: "Have you applied for your pension CETV yet? (Don\u2019t forget it takes a while)",
      actionLabel: 'Take action',
      actionStyle: 'outlined',
      completed: false,
    })
  }

  // Children outline — always shown
  tasks.push({
    id: 'children',
    label: 'Outline your children situation',
    actionLabel: 'Start outline now',
    actionStyle: 'filled',
    completed: false,
  })

  // Post-separation needs — always shown
  tasks.push({
    id: 'needs',
    label: 'Fill out your post separation budgetary needs',
    actionLabel: 'Complete needs picture',
    actionStyle: 'filled',
    completed: false,
  })

  // Divorce application — always shown
  tasks.push({
    id: 'divorce',
    label: 'Have you applied for your divorce online yet?',
    linkText: 'for guidance click here',
    actionLabel: 'Take action',
    actionStyle: 'outlined',
    completed: false,
  })

  // MIAM booking — always shown
  tasks.push({
    id: 'miam',
    label: 'Book your MIAM and use your free \u00A3500 voucher',
    actionLabel: 'Take action',
    actionStyle: 'outlined',
    completed: false,
  })

  return tasks
}

function generateFinalisationTasks(
  confirmations: SectionConfirmation[],
  extractions: BankStatementExtraction[],
): GeneratedTask[] {
  const tasks: GeneratedTask[] = []
  const answers = confirmations.reduce((acc, c) => ({ ...acc, ...c.answers }), {} as Record<string, string>)

  // Property valuation — if property confirmed
  const hasProperty = answers['property-mortgage'] === 'yes' ||
    answers['property-own'] === 'yes'
  if (hasProperty) {
    tasks.push({
      id: 'valuation',
      label: 'Upload property valuation',
      actionLabel: 'Upload',
      actionStyle: 'filled',
      completed: false,
    })
  }

  // Mortgage statement — if mortgage detected
  const hasMortgage = extractions.some((e) =>
    e.regular_payments.some((p) => p.likely_category === 'mortgage'),
  )
  if (hasMortgage) {
    tasks.push({
      id: 'mortgage-statement',
      label: 'Upload your mortgage statement',
      actionLabel: 'Upload',
      actionStyle: 'filled',
      completed: false,
    })
  }

  // Payslips — if employed
  const isEmployed = extractions.some((e) =>
    e.income_deposits.some((i) => i.type === 'employment'),
  )
  if (isEmployed) {
    tasks.push({
      id: 'payslips',
      label: 'Upload your pay slips and P60',
      actionLabel: 'Upload',
      actionStyle: 'filled',
      completed: false,
    })
  }

  // Pension CETV document — if pensions
  const hasPension = confirmations.some(
    (c) => c.sectionKey === 'pensions' && c.confirmedFacts.some((f) => f.includes('at least one')),
  )
  if (hasPension) {
    tasks.push({
      id: 'pension-cetv',
      label: 'Upload your pension CETV',
      actionLabel: 'Upload',
      actionStyle: 'filled',
      completed: false,
    })
  }

  return tasks
}

// ═══ Component ═══

interface TaskListHomeProps {
  bankConnected: boolean
  connectedAccounts: ConnectedAccount[]
  confirmationComplete: boolean
  confirmations: SectionConfirmation[]
  extractions: BankStatementExtraction[]
  onGetStarted: () => void
  onSkip: () => void
  onViewSummary: () => void
}

export function TaskListHome({
  bankConnected,
  connectedAccounts,
  confirmationComplete,
  confirmations,
  extractions,
  onGetStarted,
  onSkip,
  onViewSummary,
}: TaskListHomeProps) {
  const accountCount = connectedAccounts.length
  const bankName = connectedAccounts[0]?.bankName ?? 'your bank'

  const prepTasks = confirmationComplete
    ? generatePreparationTasks(confirmations, extractions)
    : []
  const finalTasks = confirmationComplete
    ? generateFinalisationTasks(confirmations, extractions)
    : []

  const phasesUnlocked = confirmationComplete

  return (
    <div className="max-w-[var(--content-max-width)] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-[28px] font-bold text-ink leading-tight">
          {confirmationComplete ? 'Welcome back' : bankConnected ? 'Welcome back' : "Let\u2019s get started"}
        </h2>
        <p className="mt-2 text-[15px] text-ink-secondary">
          {confirmationComplete
            ? 'This is your task list of things to do'
            : bankConnected
              ? 'This is your task list of things to do'
              : 'We\u2019ll add tasks as you progress'}
        </p>
      </div>

      {/* ═══ Preparation tasks ═══ */}
      <div
        className="bg-white overflow-hidden animate-fade-in"
        style={{
          borderRadius: 'var(--radius-card)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--color-grey-100)' }}>
          <span className="text-[16px] font-semibold text-ink">
            Preparation tasks
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
            <div className="px-6 py-5" style={{ borderBottom: '1px solid var(--color-grey-100)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center shrink-0">
                    <Check size={12} className="text-white" strokeWidth={3} />
                  </div>
                  <span className="text-[15px] font-medium text-ink">
                    {accountCount} {bankName} bank account{accountCount !== 1 ? 's' : ''}
                  </span>
                  <ChevronDown size={16} className="text-ink-tertiary" />
                </div>
                <span
                  className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: 'var(--color-green-50)', color: 'var(--color-green-600)' }}
                >
                  {bankName} Bank connection
                </span>
              </div>
              {confirmationComplete && (
                <div className="mt-3 ml-7">
                  <p className="text-[13px] text-ink-secondary">
                    10 Form E sections are now complete and ready for sharing!
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

            {/* Dynamic preparation tasks */}
            {confirmationComplete && prepTasks.length > 0 && (
              <div>
                {prepTasks.map((task, i) => (
                  <TaskRow key={task.id} task={task} delay={i * 80} />
                ))}
              </div>
            )}

            {!confirmationComplete && (
              <div className="p-6">
                <p className="text-[13px] text-ink-secondary">
                  Processing your bank data — confirmation questions will appear shortly.
                </p>
              </div>
            )}

            {/* Add more tasks */}
            {confirmationComplete && (
              <div className="px-6 py-4" style={{ borderTop: '1px solid var(--color-grey-100)' }}>
                <button className="flex items-center gap-2 text-[13px] text-ink-tertiary hover:text-ink-secondary transition-colors">
                  <Plus size={14} />
                  <span>Add more tasks to track here</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ═══ Sharing & collaboration tasks ═══ */}
      <div
        className="mt-4 bg-white overflow-hidden animate-fade-in"
        style={{
          borderRadius: 'var(--radius-card)',
          boxShadow: 'var(--shadow-card)',
          opacity: phasesUnlocked ? 1 : 0.5,
          animationDelay: '150ms',
          animationFillMode: 'both',
        }}
      >
        <div className="px-6 py-4" style={{ borderBottom: phasesUnlocked ? '1px solid var(--color-grey-100)' : 'none' }}>
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-[16px] font-semibold text-ink">
              {phasesUnlocked ? 'Sharing & collaboration tasks' : 'Sharing & collaboration'}
            </span>
            {!phasesUnlocked && (
              <div className="flex items-center gap-1.5 text-ink-disabled">
                <Lock size={13} className="shrink-0" />
                <span className="text-[12px]">
                  {bankConnected ? 'After confirmation' : 'After bank connection'}
                </span>
              </div>
            )}
          </div>
        </div>

        {phasesUnlocked && (
          <div>
            <SharingTaskRow
              label="Invite your ex-partner to collaborate and share their financial picture securely here"
              actionLabel="Invite now"
            />
            <SharingTaskRow
              label="Invite your mediator to collaborate and share their financial picture securely here"
              actionLabel="Invite now"
            />
            <SharingTaskRow
              label="Invite your solicitor to collaborate and share their financial picture securely here"
              actionLabel="Invite now"
            />
            <div className="px-6 py-4" style={{ borderTop: '1px solid var(--color-grey-100)' }}>
              <button className="flex items-center gap-2 text-[13px] text-ink-tertiary hover:text-ink-secondary transition-colors">
                <Plus size={14} />
                <span>Add more tasks to track here</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ═══ Finalisation ═══ */}
      <div
        className="mt-4 bg-white overflow-hidden animate-fade-in"
        style={{
          borderRadius: 'var(--radius-card)',
          boxShadow: 'var(--shadow-card)',
          opacity: phasesUnlocked ? 1 : 0.5,
          animationDelay: '300ms',
          animationFillMode: 'both',
        }}
      >
        <div className="px-6 py-4" style={{ borderBottom: phasesUnlocked ? '1px solid var(--color-grey-100)' : 'none' }}>
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-[16px] font-semibold text-ink">
              Finalisation
            </span>
            {!phasesUnlocked && (
              <div className="flex items-center gap-1.5 text-ink-disabled">
                <Lock size={13} className="shrink-0" />
                <span className="text-[12px]">Collate final evidence</span>
              </div>
            )}
          </div>
        </div>

        {phasesUnlocked && (
          <div>
            {/* Evidence gathering header */}
            <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--color-grey-100)' }}>
              <p className="text-[15px] font-medium text-ink">Final evidence gathering</p>
              <p className="text-[13px] text-ink-secondary mt-1">
                {finalTasks.length} supporting document{finalTasks.length !== 1 ? 's' : ''} needed for court
              </p>
            </div>

            {/* Upload tasks */}
            {finalTasks.map((task, i) => (
              <UploadTaskRow key={task.id} task={task} index={i + 1} />
            ))}

            {/* Generate final docs */}
            <div className="px-6 py-5" style={{ borderTop: '1px solid var(--color-grey-100)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[15px] font-medium text-ink">Generate final documentation</p>
                  <p className="text-[13px] text-ink-tertiary mt-0.5">D81, Form E final, Consent Order, Form A</p>
                </div>
                <button
                  className="shrink-0 px-4 py-2 text-[13px] font-medium text-ink transition-colors"
                  style={{
                    border: '1px solid var(--color-grey-100)',
                    borderRadius: 'var(--radius-card)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-grey-50)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  Create final docs
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ═══ Sub-components ═══

function TaskRow({ task, delay }: { task: GeneratedTask; delay: number }) {
  return (
    <div
      className="px-6 py-5 flex items-center justify-between gap-4 animate-fade-in"
      style={{
        borderBottom: '1px solid var(--color-grey-100)',
        animationDelay: `${delay}ms`,
        animationFillMode: 'both',
      }}
    >
      <div className="flex-1">
        <p className="text-[15px] text-ink leading-snug">
          {task.label}
          {task.linkText && (
            <>
              {' '}
              <button className="text-blue-600 underline">{task.linkText}</button>
            </>
          )}
        </p>
      </div>
      {task.actionStyle === 'filled' ? (
        <button
          className="shrink-0 px-4 py-2 text-[13px] font-medium text-white transition-colors active:scale-[0.98]"
          style={{
            backgroundColor: 'var(--color-ink)',
            borderRadius: 'var(--radius-card)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          {task.actionLabel}
        </button>
      ) : (
        <button
          className="shrink-0 flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium text-ink transition-colors"
          style={{
            border: '1px solid var(--color-grey-100)',
            borderRadius: 'var(--radius-card)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-grey-50)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          {task.actionLabel}
          <ChevronDown size={14} className="text-ink-tertiary" />
        </button>
      )}
    </div>
  )
}

function SharingTaskRow({ label, actionLabel }: { label: string; actionLabel: string }) {
  return (
    <div
      className="px-6 py-5 flex items-center justify-between gap-4"
      style={{ borderBottom: '1px solid var(--color-grey-100)' }}
    >
      <p className="text-[15px] text-ink leading-snug flex-1">{label}</p>
      <button
        className="shrink-0 px-4 py-2 text-[13px] font-medium text-white transition-colors active:scale-[0.98]"
        style={{
          backgroundColor: 'var(--color-ink)',
          borderRadius: 'var(--radius-card)',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
      >
        {actionLabel}
      </button>
    </div>
  )
}

function UploadTaskRow({ task, index }: { task: GeneratedTask; index: number }) {
  return (
    <div
      className="px-6 py-4 flex items-center justify-between gap-4"
      style={{ borderBottom: '1px solid var(--color-grey-100)' }}
    >
      <div className="flex items-center gap-3 flex-1">
        <span
          className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0"
          style={{
            backgroundColor: 'var(--color-amber-50)',
            color: 'var(--color-amber-600)',
          }}
        >
          {index}
        </span>
        <p className="text-[15px] text-ink">{task.label}</p>
      </div>
      <button
        className="shrink-0 flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium text-white transition-colors active:scale-[0.98]"
        style={{
          backgroundColor: 'var(--color-ink)',
          borderRadius: 'var(--radius-card)',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
      >
        <Upload size={14} />
        Upload
      </button>
    </div>
  )
}
