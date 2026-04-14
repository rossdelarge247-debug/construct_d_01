'use client'

import { useState, useCallback, useMemo } from 'react'
import { Check, ChevronDown, ChevronUp, Lock } from 'lucide-react'
import type { BankStatementExtraction } from '@/lib/ai/extraction-schemas'
import type { ConnectedAccount, SectionConfirmation, SpendingFlowResult } from '@/types/hub'
import {
  CONFIRMATION_SECTIONS,
  generateSectionSteps,
  generateSectionSummary,
  type ConfirmationStep,
  type SectionSummaryData,
} from '@/lib/bank/confirmation-questions'
import { ProgressStepper } from './progress-stepper'
import { SectionMiniSummary } from './section-mini-summary'
import { SpendingFlow } from './spending-flow'

interface ConfirmationFlowProps {
  extractions: BankStatementExtraction[]
  connectedAccounts: ConnectedAccount[]
  onComplete: (confirmations: SectionConfirmation[], spendingResult?: SpendingFlowResult) => void
}

type FlowPhase = 'question' | 'mini_summary' | 'transitioning' | 'spending' | 'final_summary'

export function ConfirmationFlow({
  extractions,
  connectedAccounts,
  onComplete,
}: ConfirmationFlowProps) {
  const [sectionIndex, setSectionIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const [phase, setPhase] = useState<FlowPhase>('question')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [inputQualifier, setInputQualifier] = useState<string | null>(null)
  const [accordionOpen, setAccordionOpen] = useState(false)
  const [completedSections, setCompletedSections] = useState<SectionSummaryData[]>([])

  const currentSectionKey = CONFIRMATION_SECTIONS[sectionIndex]
  const accountCount = connectedAccounts.length
  const bankName = connectedAccounts[0]?.bankName ?? 'your bank'

  const allSteps = useMemo(
    () => generateSectionSteps(currentSectionKey, extractions),
    [currentSectionKey, extractions],
  )

  const visibleSteps = useMemo(() => {
    return allSteps.filter((step: ConfirmationStep) => {
      if (!step.showWhen) return true
      const answer = answers[step.showWhen.questionId]
      if (Array.isArray(step.showWhen.value)) {
        return step.showWhen.value.includes(answer)
      }
      return answer === step.showWhen.value
    })
  }, [allSteps, answers])

  const currentStep = visibleSteps[stepIndex] as ConfirmationStep | undefined

  const handleSectionQuestionsComplete = useCallback(() => {
    const summary = generateSectionSummary(currentSectionKey, answers, extractions)
    setCompletedSections((prev: SectionSummaryData[]) => {
      const filtered = prev.filter((s) => s.sectionKey !== currentSectionKey)
      return [...filtered, summary]
    })
    setAccordionOpen(true)
    setPhase('mini_summary')
  }, [currentSectionKey, answers, extractions])

  const handleNext = useCallback(() => {
    if (!currentStep) return

    if (currentStep.type === 'question' && selectedOption) {
      setAnswers((prev: Record<string, string>) => ({ ...prev, [currentStep.id]: selectedOption }))
    } else if (currentStep.type === 'input' && inputValue) {
      setAnswers((prev: Record<string, string>) => ({
        ...prev,
        [currentStep.id]: inputValue,
        ...(inputQualifier ? { [`${currentStep.id}-qualifier`]: inputQualifier } : {}),
      }))
    }

    const nextAnswers = {
      ...answers,
      ...(currentStep.type === 'question' && selectedOption ? { [currentStep.id]: selectedOption } : {}),
      ...(currentStep.type === 'input' && inputValue ? { [currentStep.id]: inputValue } : {}),
    }

    const nextVisibleSteps = allSteps.filter((step: ConfirmationStep) => {
      if (!step.showWhen) return true
      const answer = nextAnswers[step.showWhen.questionId]
      if (Array.isArray(step.showWhen.value)) {
        return step.showWhen.value.includes(answer)
      }
      return answer === step.showWhen.value
    })

    const nextStepIndex = stepIndex + 1
    if (nextStepIndex >= nextVisibleSteps.length) {
      handleSectionQuestionsComplete()
    } else {
      setStepIndex(nextStepIndex)
    }

    setSelectedOption(null)
    setInputValue('')
    setInputQualifier(null)
  }, [currentStep, selectedOption, inputValue, inputQualifier, answers, allSteps, stepIndex, handleSectionQuestionsComplete])

  const handleSkip = useCallback(() => {
    if (!currentStep) return

    const nextStepIndex = stepIndex + 1
    const nextVisibleSteps = allSteps.filter((step: ConfirmationStep) => {
      if (!step.showWhen) return true
      const answer = answers[step.showWhen.questionId]
      if (Array.isArray(step.showWhen.value)) {
        return step.showWhen.value.includes(answer)
      }
      return answer === step.showWhen.value
    })

    if (nextStepIndex >= nextVisibleSteps.length) {
      handleSectionQuestionsComplete()
    } else {
      setStepIndex(nextStepIndex)
    }
    setSelectedOption(null)
    setInputValue('')
  }, [currentStep, stepIndex, allSteps, answers, handleSectionQuestionsComplete])

  const [spendingResult, setSpendingResult] = useState<SpendingFlowResult | null>(null)

  const handleSectionConfirm = useCallback(() => {
    const nextSection = sectionIndex + 1
    if (nextSection >= CONFIRMATION_SECTIONS.length) {
      // After last confirmation section (debts), go to spending
      setPhase('spending')
      setAccordionOpen(false)
    } else {
      setPhase('transitioning')
      setAccordionOpen(false)
      setTimeout(() => {
        setSectionIndex(nextSection)
        setStepIndex(0)
        setPhase('question')
      }, 300)
    }
  }, [sectionIndex])

  const handleSpendingComplete = useCallback((result: SpendingFlowResult) => {
    setSpendingResult(result)
    const spendingLabel = result.mode === 'estimates'
      ? 'Spending estimates disclosed, ready for starter conversations (complete full disclosure asap)'
      : 'Spending fully disclosed'
    setCompletedSections((prev: SectionSummaryData[]) => {
      const filtered = prev.filter((s) => s.sectionKey !== 'spending')
      return [...filtered, {
      sectionKey: 'spending',
      sectionLabel: 'Spending',
      heading: 'Spending disclosed',
      accordionLabel: spendingLabel,
      facts: result.categories.map((c) => ({
        label: `${c.key}: £${c.totalMonthly}/month`,
        value: `£${c.totalMonthly}`,
        source: result.mode === 'bank_data' ? 'bank' as const : 'self' as const,
      })),
    }]
    })
    setPhase('final_summary')
    setAccordionOpen(true)
  }, [])

  const handleSpendingSkip = useCallback(() => {
    setPhase('final_summary')
    setAccordionOpen(true)
  }, [])

  const handleGoBack = useCallback(() => {
    setStepIndex(0)
    setPhase('question')
    setSelectedOption(null)
  }, [])

  const handleFinish = useCallback(() => {
    const confirmations: SectionConfirmation[] = completedSections
      .filter((s: SectionSummaryData) => s.sectionKey !== 'spending')
      .map((s: SectionSummaryData) => ({
        sectionKey: s.sectionKey,
        status: 'confirmed' as const,
        answers,
        confirmedFacts: s.facts.map((f: SectionSummaryData['facts'][0]) => f.label),
        gapMessages: s.facts.filter((f: SectionSummaryData['facts'][0]) => f.gapMessage).map((f: SectionSummaryData['facts'][0]) => f.gapMessage!),
      }))

    // Add spending as a confirmation if completed
    if (spendingResult) {
      confirmations.push({
        sectionKey: 'spending',
        status: 'confirmed',
        answers: {
          ...answers,
          'spending-mode': spendingResult.mode,
          'spending-total': String(spendingResult.totalMonthly),
        },
        confirmedFacts: spendingResult.categories.map((c: SpendingFlowResult['categories'][0]) => `${c.key}: £${c.totalMonthly}/month`),
        gapMessages: spendingResult.mode === 'estimates'
          ? ['Complete full spending disclosure from bank data']
          : [],
      })
    }

    onComplete(confirmations, spendingResult ?? undefined)
  }, [completedSections, answers, spendingResult, onComplete])

  const canAdvance = currentStep?.type === 'confirmation_message'
    || (currentStep?.type === 'question' && selectedOption !== null)
    || (currentStep?.type === 'input' && inputValue.length > 0)

  return (
    <div className="max-w-[var(--content-narrow)] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-[28px] font-bold text-ink leading-tight">
          Let&apos;s go through what you shared
        </h2>
      </div>

      {/* ═══ Preparation card ═══ */}
      <div
        className="bg-white overflow-hidden"
        style={{
          borderRadius: 'var(--radius-card)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        {/* Bank connection row + accordion */}
        <div className="px-6 py-5" style={{ borderBottom: '1px solid var(--color-grey-100)' }}>
          <button
            onClick={() => setAccordionOpen(!accordionOpen)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center">
                <Check size={12} className="text-white" strokeWidth={3} />
              </div>
              <span className="text-[15px] font-medium text-ink">
                {accountCount} {bankName} account{accountCount !== 1 ? 's' : ''}
              </span>
              {accordionOpen
                ? <ChevronUp size={16} className="text-ink-tertiary transition-transform" />
                : <ChevronDown size={16} className="text-ink-tertiary transition-transform" />
              }
            </div>
            <span
              className="text-[11px] font-medium px-2.5 py-1 rounded-full"
              style={{ backgroundColor: 'var(--color-green-50)', color: 'var(--color-green-600)' }}
            >
              Connected
            </span>
          </button>
          <p className="text-[12px] text-ink-tertiary mt-1 ml-7">
            This connection lasts for 90 days
          </p>

          {/* Accordion: completed section sub-tabs */}
          <div
            className="overflow-hidden transition-all"
            style={{
              maxHeight: accordionOpen ? `${completedSections.length * 40 + 8}px` : '0',
              opacity: accordionOpen ? 1 : 0,
              transitionDuration: '300ms',
              transitionTimingFunction: 'ease-out',
            }}
          >
            <div className="mt-3 ml-7 space-y-2">
              {completedSections.map((s: SectionSummaryData) => (
                <div key={s.sectionKey} className="flex items-center justify-between gap-2 text-[13px]">
                  <div className="flex items-center gap-2 text-ink-secondary">
                    <Check size={13} className="text-green-600 shrink-0" />
                    <span>{s.accordionLabel}</span>
                  </div>
                  <button className="text-blue-600 hover:underline shrink-0">Edit</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Progress stepper — 5 confirmation sections + spending */}
        <div className="px-6 pt-5">
          <ProgressStepper
            sections={[...CONFIRMATION_SECTIONS, 'spending'] as string[]}
            currentIndex={phase === 'spending' ? CONFIRMATION_SECTIONS.length : sectionIndex}
            completedCount={completedSections.length}
          />
        </div>

        {/* ═══ Question / Mini-summary / Final summary area ═══ */}
        <div className="px-6 py-8">
          {phase === 'question' && currentStep && (
            <QuestionCard
              step={currentStep}
              selectedOption={selectedOption}
              onSelectOption={setSelectedOption}
              inputValue={inputValue}
              onInputChange={setInputValue}
              inputQualifier={inputQualifier}
              onQualifierChange={setInputQualifier}
              onNext={handleNext}
              onSkip={handleSkip}
              canAdvance={canAdvance}
            />
          )}

          {phase === 'mini_summary' && (
            <SectionMiniSummary
              data={generateSectionSummary(currentSectionKey, answers, extractions)}
              onConfirm={handleSectionConfirm}
              onGoBack={handleGoBack}
            />
          )}

          {phase === 'spending' && (
            <SpendingFlow
              extractions={extractions}
              connectedAccounts={connectedAccounts}
              hasChildren={extractions.some((e) =>
                e.income_deposits.some((d) => d.type === 'benefits' && d.source.toLowerCase().includes('child')),
              )}
              onComplete={handleSpendingComplete}
              onSkip={handleSpendingSkip}
            />
          )}

          {phase === 'final_summary' && (
            <FinalSummary
              completedSections={completedSections}
              onFinish={handleFinish}
            />
          )}
        </div>
      </div>

      {/* ═══ Locked phases ═══ */}
      {phase !== 'final_summary' && (
        <>
          <LockedPhaseCard label="Sharing & collaboration" />
          <LockedPhaseCard label="Finalisation" />
        </>
      )}
    </div>
  )
}

// ═══ QuestionCard — Habito-style radio cards ═══

function QuestionCard({
  step,
  selectedOption,
  onSelectOption,
  inputValue,
  onInputChange,
  inputQualifier,
  onQualifierChange,
  onNext,
  onSkip,
  canAdvance,
}: {
  step: ConfirmationStep
  selectedOption: string | null
  onSelectOption: (v: string) => void
  inputValue: string
  onInputChange: (v: string) => void
  inputQualifier: string | null
  onQualifierChange: (v: string) => void
  onNext: () => void
  onSkip: () => void
  canAdvance: boolean
}) {
  return (
    <div className="animate-fade-in">
      <p className="text-[12px] font-semibold text-ink-tertiary uppercase tracking-wider mb-2">
        {step.sectionLabel}
      </p>
      <h3 className="text-[22px] font-bold text-ink leading-snug">{step.text}</h3>
      {step.subtext && (
        <p className="text-[13px] text-ink-secondary mt-2 mb-1">{step.subtext}</p>
      )}

      {/* Habito-style radio option cards */}
      {step.options && (
        <div className="mt-6 space-y-2">
          {step.options.map((opt) => {
            const isSelected = selectedOption === opt.value
            return (
              <button
                key={opt.value}
                onClick={() => onSelectOption(opt.value)}
                className="w-full text-left px-5 py-4 transition-all"
                style={{
                  borderRadius: 'var(--radius-card)',
                  border: `1.5px solid ${isSelected ? 'var(--color-ink)' : 'var(--color-grey-100)'}`,
                  backgroundColor: isSelected ? 'var(--color-ink)' : 'white',
                  color: isSelected ? 'white' : 'var(--color-ink)',
                  transitionDuration: '200ms',
                  transitionTimingFunction: 'ease',
                }}
              >
                <div className="flex items-center gap-3">
                  {/* Radio circle */}
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all"
                    style={{
                      border: isSelected ? '2px solid white' : '2px solid var(--color-grey-200)',
                      transitionDuration: '200ms',
                    }}
                  >
                    {isSelected && (
                      <div className="w-2.5 h-2.5 rounded-full bg-white" />
                    )}
                  </div>
                  <span className="text-[15px] font-medium">{opt.label}</span>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* Input field (property value) */}
      {step.type === 'input' && (
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            {step.inputPrefix && (
              <span className="text-[18px] font-semibold text-ink">{step.inputPrefix}</span>
            )}
            <input
              type="text"
              value={inputValue}
              onChange={(e: { target: { value: string } }) => onInputChange(e.target.value)}
              placeholder={step.inputPlaceholder}
              className="flex-1 px-4 py-3 text-[15px] text-ink focus:outline-none transition-colors"
              style={{
                border: '1.5px solid var(--color-grey-100)',
                borderRadius: 'var(--radius-card)',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-ink)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-grey-100)')}
            />
          </div>
          {step.inputQualifiers && (
            <div className="space-y-2">
              {step.inputQualifiers.map((q) => {
                const isQSelected = inputQualifier === q.value
                return (
                  <button
                    key={q.value}
                    onClick={() => onQualifierChange(q.value)}
                    className="w-full text-left px-5 py-4 transition-all"
                    style={{
                      borderRadius: 'var(--radius-card)',
                      border: `1.5px solid ${isQSelected ? 'var(--color-ink)' : 'var(--color-grey-100)'}`,
                      backgroundColor: isQSelected ? 'var(--color-ink)' : 'white',
                      color: isQSelected ? 'white' : 'var(--color-ink)',
                      transitionDuration: '200ms',
                      transitionTimingFunction: 'ease',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                        style={{
                          border: isQSelected ? '2px solid white' : '2px solid var(--color-grey-200)',
                        }}
                      >
                        {isQSelected && (
                          <div className="w-2.5 h-2.5 rounded-full bg-white" />
                        )}
                      </div>
                      <span className="text-[15px] font-medium">{q.label}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Actions — red Continue + ghost Skip */}
      <div className="mt-8 flex items-center gap-4">
        <button
          onClick={onNext}
          disabled={!canAdvance}
          className="px-8 py-3.5 text-white text-[15px] font-semibold transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            backgroundColor: canAdvance ? 'var(--color-red-500)' : 'var(--color-red-500)',
            borderRadius: 'var(--radius-card)',
          }}
          onMouseEnter={(e) => { if (canAdvance) e.currentTarget.style.backgroundColor = 'var(--color-red-600)' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-red-500)' }}
        >
          {step.type === 'confirmation_message' ? 'OK, next' : 'Continue'}
        </button>
        {step.type !== 'confirmation_message' && (
          <button
            onClick={onSkip}
            className="text-[13px] text-ink-tertiary hover:text-ink-secondary transition-colors"
          >
            Skip for now
          </button>
        )}
      </div>
    </div>
  )
}

// ═══ FinalSummary ═══

function FinalSummary({
  completedSections,
  onFinish,
}: {
  completedSections: SectionSummaryData[]
  onFinish: () => void
}) {
  return (
    <div className="animate-fade-in">
      <p className="text-[12px] font-semibold text-ink-tertiary uppercase tracking-wider mb-2">
        End of the beginning
      </p>
      <h3 className="text-[22px] font-bold text-ink mb-3">This is great progress</h3>
      <p className="text-[15px] text-ink-secondary mb-8 leading-relaxed">
        We&apos;ll now take you to your financial summary which can be shared with your
        spouse/partner, mediator or solicitor.
      </p>
      <button
        onClick={onFinish}
        className="px-8 py-3.5 text-white text-[15px] font-semibold transition-colors active:scale-[0.98]"
        style={{
          backgroundColor: 'var(--color-red-500)',
          borderRadius: 'var(--radius-card)',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-red-600)')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-red-500)')}
      >
        View financial summary
      </button>
    </div>
  )
}

// ═══ LockedPhaseCard ═══

function LockedPhaseCard({ label }: { label: string }) {
  return (
    <div
      className="mt-4 bg-white overflow-hidden opacity-50"
      style={{
        borderRadius: 'var(--radius-card)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div className="px-6 py-5 flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-[12px] font-semibold text-ink-tertiary uppercase tracking-wider">
          {label}
        </span>
        <div className="flex items-center gap-1.5 text-ink-disabled">
          <Lock size={13} className="shrink-0" />
          <span className="text-[12px]">After confirmation</span>
        </div>
      </div>
    </div>
  )
}
