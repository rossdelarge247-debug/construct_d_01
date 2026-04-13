'use client'

import { useState, useCallback, useMemo } from 'react'
import { Check, ChevronDown, ChevronUp, Lock } from 'lucide-react'
import type { BankStatementExtraction } from '@/lib/ai/extraction-schemas'
import type { ConnectedAccount, SectionConfirmation } from '@/types/hub'
import {
  CONFIRMATION_SECTIONS,
  generateSectionSteps,
  generateSectionSummary,
  type ConfirmationStep,
  type SectionSummaryData,
} from '@/lib/bank/confirmation-questions'
import { ProgressStepper } from './progress-stepper'
import { SectionMiniSummary } from './section-mini-summary'

interface ConfirmationFlowProps {
  extractions: BankStatementExtraction[]
  connectedAccounts: ConnectedAccount[]
  onComplete: (confirmations: SectionConfirmation[]) => void
}

type FlowPhase = 'question' | 'mini_summary' | 'final_summary'

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

  // Generate steps for current section
  const allSteps = useMemo(
    () => generateSectionSteps(currentSectionKey, extractions),
    [currentSectionKey, extractions],
  )

  // Filter visible steps based on conditional showWhen
  const visibleSteps = useMemo(() => {
    return allSteps.filter((step: ConfirmationStep) => {
      if (!step.showWhen) return true
      return answers[step.showWhen.questionId] === step.showWhen.value
    })
  }, [allSteps, answers])

  const currentStep = visibleSteps[stepIndex] as ConfirmationStep | undefined

  // Handle answer selection + advance
  const handleNext = useCallback(() => {
    if (!currentStep) return

    // Store answer
    if (currentStep.type === 'question' && selectedOption) {
      setAnswers((prev: Record<string, string>) => ({ ...prev, [currentStep.id]: selectedOption }))
    } else if (currentStep.type === 'input' && inputValue) {
      setAnswers((prev: Record<string, string>) => ({
        ...prev,
        [currentStep.id]: inputValue,
        ...(inputQualifier ? { [`${currentStep.id}-qualifier`]: inputQualifier } : {}),
      }))
    }

    // Recalculate visible steps after this answer
    const nextAnswers = {
      ...answers,
      ...(currentStep.type === 'question' && selectedOption ? { [currentStep.id]: selectedOption } : {}),
      ...(currentStep.type === 'input' && inputValue ? { [currentStep.id]: inputValue } : {}),
    }

    const nextVisibleSteps = allSteps.filter((step: ConfirmationStep) => {
      if (!step.showWhen) return true
      return nextAnswers[step.showWhen.questionId] === step.showWhen.value
    })

    const nextStepIndex = stepIndex + 1
    if (nextStepIndex >= nextVisibleSteps.length) {
      // Section complete — show mini-summary
      setPhase('mini_summary')
    } else {
      setStepIndex(nextStepIndex)
    }

    setSelectedOption(null)
    setInputValue('')
    setInputQualifier(null)
  }, [currentStep, selectedOption, inputValue, inputQualifier, answers, allSteps, stepIndex])

  const handleSkip = useCallback(() => {
    if (!currentStep) return

    const nextStepIndex = stepIndex + 1
    const nextVisibleSteps = allSteps.filter((step: ConfirmationStep) => {
      if (!step.showWhen) return true
      return answers[step.showWhen.questionId] === step.showWhen.value
    })

    if (nextStepIndex >= nextVisibleSteps.length) {
      setPhase('mini_summary')
    } else {
      setStepIndex(nextStepIndex)
    }
    setSelectedOption(null)
    setInputValue('')
  }, [currentStep, stepIndex, allSteps, answers])

  // Mini-summary confirmed — advance to next section
  const handleSectionConfirm = useCallback(() => {
    const summary = generateSectionSummary(currentSectionKey, answers, extractions)
    setCompletedSections((prev: SectionSummaryData[]) => [...prev, summary])

    const nextSection = sectionIndex + 1
    if (nextSection >= CONFIRMATION_SECTIONS.length) {
      setPhase('final_summary')
    } else {
      setSectionIndex(nextSection)
      setStepIndex(0)
      setPhase('question')
      setAccordionOpen(false)
    }
  }, [currentSectionKey, sectionIndex, answers, extractions])

  // Go back to re-answer section questions
  const handleGoBack = useCallback(() => {
    setStepIndex(0)
    setPhase('question')
    setSelectedOption(null)
  }, [])

  // Final summary — complete
  const handleFinish = useCallback(() => {
    const confirmations: SectionConfirmation[] = completedSections.map((s: SectionSummaryData) => ({
      sectionKey: s.sectionKey,
      status: 'confirmed' as const,
      answers,
      confirmedFacts: s.facts.map((f: SectionSummaryData['facts'][0]) => f.label),
      gapMessages: s.facts.filter((f: SectionSummaryData['facts'][0]) => f.gapMessage).map((f: SectionSummaryData['facts'][0]) => f.gapMessage!),
    }))
    onComplete(confirmations)
  }, [completedSections, answers, onComplete])

  // Can advance?
  const canAdvance = currentStep?.type === 'confirmation_message'
    || (currentStep?.type === 'question' && selectedOption !== null)
    || (currentStep?.type === 'input' && inputValue.length > 0)

  return (
    <div className="px-6 pt-8">
      <div className="max-w-[var(--content-max-width)] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-ink">
            Let&apos;s go through what you just shared with us
          </h2>
        </div>

        {/* ═══ Preparation card ═══ */}
        <div className="bg-white rounded-lg border border-grey-100 overflow-hidden">
          <div className="px-5 py-3 border-b border-grey-100">
            <span className="text-xs font-semibold text-ink-secondary uppercase tracking-wider">
              Preparation
            </span>
          </div>

          {/* Bank connection row + accordion */}
          <div className="px-5 py-4 border-b border-grey-100">
            <button
              onClick={() => setAccordionOpen(!accordionOpen)}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center">
                  <Check size={12} className="text-white" strokeWidth={3} />
                </div>
                <span className="text-[15px] font-medium text-ink">
                  {accountCount} {bankName} bank account{accountCount !== 1 ? 's' : ''}
                </span>
                {accordionOpen
                  ? <ChevronUp size={16} className="text-ink-tertiary transition-transform" />
                  : <ChevronDown size={16} className="text-ink-tertiary transition-transform" />
                }
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                Connected
              </span>
            </button>
            <p className="text-xs text-red-600 mt-1 ml-7">
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
              <div className="mt-3 ml-7 space-y-1.5">
                {completedSections.map((s: SectionSummaryData) => (
                  <div key={s.sectionKey} className="flex items-center gap-2 text-sm text-ink-secondary">
                    <Check size={13} className="text-green-600 shrink-0" />
                    <span>{s.accordionLabel}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Progress stepper */}
          <div className="px-5 pt-4">
            <ProgressStepper
              sections={CONFIRMATION_SECTIONS}
              currentIndex={sectionIndex}
              completedCount={completedSections.length}
            />
          </div>

          {/* ═══ Question / Mini-summary / Final summary area ═══ */}
          <div className="px-5 py-6">
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
    </div>
  )
}

// ═══ QuestionCard ═══

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
      <p className="text-xs font-semibold text-ink-tertiary uppercase tracking-wider mb-1">
        {step.sectionLabel}
      </p>
      <h3 className="text-xl font-bold text-ink mb-1">{step.text}</h3>
      {step.subtext && (
        <p className="text-sm text-ink-secondary mb-4">{step.subtext}</p>
      )}

      {/* Radio options */}
      {step.options && (
        <div className="mt-4 space-y-2">
          {step.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onSelectOption(opt.value)}
              className="w-full text-left px-4 py-3 rounded-md border transition-all"
              style={{
                borderColor: selectedOption === opt.value ? 'var(--color-ink)' : 'var(--color-grey-100)',
                backgroundColor: selectedOption === opt.value ? 'var(--color-grey-50)' : 'white',
                transitionDuration: '150ms',
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors"
                  style={{
                    borderColor: selectedOption === opt.value ? 'var(--color-ink)' : 'var(--color-grey-200)',
                  }}
                >
                  {selectedOption === opt.value && (
                    <div className="w-2 h-2 rounded-full bg-ink" />
                  )}
                </div>
                <span className="text-[15px] text-ink">{opt.label}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Input field (property value) */}
      {step.type === 'input' && (
        <div className="mt-4">
          <div className="flex items-center gap-1 mb-3">
            {step.inputPrefix && (
              <span className="text-lg font-medium text-ink">{step.inputPrefix}</span>
            )}
            <input
              type="text"
              value={inputValue}
              onChange={(e: { target: { value: string } }) => onInputChange(e.target.value)}
              placeholder={step.inputPlaceholder}
              className="flex-1 px-3 py-2.5 border border-grey-100 rounded-md text-[15px] text-ink focus:border-ink focus:outline-none transition-colors"
            />
          </div>
          {step.inputQualifiers && (
            <div className="space-y-2">
              {step.inputQualifiers.map((q) => (
                <button
                  key={q.value}
                  onClick={() => onQualifierChange(q.value)}
                  className="w-full text-left px-4 py-2.5 rounded-md border transition-all"
                  style={{
                    borderColor: inputQualifier === q.value ? 'var(--color-ink)' : 'var(--color-grey-100)',
                    backgroundColor: inputQualifier === q.value ? 'var(--color-grey-50)' : 'white',
                    transitionDuration: '150ms',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
                      style={{
                        borderColor: inputQualifier === q.value ? 'var(--color-ink)' : 'var(--color-grey-200)',
                      }}
                    >
                      {inputQualifier === q.value && (
                        <div className="w-2 h-2 rounded-full bg-ink" />
                      )}
                    </div>
                    <span className="text-sm text-ink">{q.label}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={onNext}
          disabled={!canAdvance}
          className="px-5 py-2.5 bg-ink text-white text-sm font-semibold rounded-md hover:opacity-90 transition-opacity active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {step.type === 'confirmation_message' ? 'OK, next' : 'Next'}
        </button>
        {step.type !== 'confirmation_message' && (
          <button
            onClick={onSkip}
            className="text-sm text-ink-tertiary hover:text-ink-secondary transition-colors"
          >
            Skip for now
          </button>
        )}
      </div>
    </div>
  )
}

// ═══ FinalSummary (screen 2i) ═══

function FinalSummary({
  completedSections,
  onFinish,
}: {
  completedSections: SectionSummaryData[]
  onFinish: () => void
}) {
  return (
    <div className="animate-fade-in">
      {/* Expanded accordion showing all sections */}
      <div className="mb-6 space-y-1.5">
        {completedSections.map((s: SectionSummaryData, i: number) => (
          <div
            key={s.sectionKey}
            className="flex items-center gap-2 text-sm text-ink-secondary animate-fade-in"
            style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}
          >
            <Check size={13} className="text-green-600 shrink-0" />
            <span>{s.accordionLabel}</span>
          </div>
        ))}
      </div>

      <p className="text-xs font-semibold text-ink-tertiary uppercase tracking-wider mb-1">
        End of the beginning
      </p>
      <h3 className="text-xl font-bold text-ink mb-3">This is great progress</h3>
      <p className="text-sm text-ink-secondary mb-6 leading-relaxed">
        We will now take you to your financial summary which can be shared with your
        spouse/partner and/or a third party such as a mediator or solicitor.
      </p>
      <button
        onClick={onFinish}
        className="px-5 py-2.5 bg-ink text-white text-sm font-semibold rounded-md hover:opacity-90 transition-opacity active:scale-[0.98]"
      >
        Take me to my financial summary
      </button>
    </div>
  )
}

// ═══ LockedPhaseCard ═══

function LockedPhaseCard({ label }: { label: string }) {
  return (
    <div className="mt-4 bg-white rounded-lg border border-grey-100 overflow-hidden opacity-60">
      <div className="px-5 py-4 flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-xs font-semibold text-ink-secondary uppercase tracking-wider">
          {label}
        </span>
        <div className="flex items-center gap-1.5 text-ink-tertiary">
          <Lock size={13} className="shrink-0" />
          <span className="text-xs">Available after confirmation</span>
        </div>
      </div>
    </div>
  )
}
