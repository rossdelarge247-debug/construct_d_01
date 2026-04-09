'use client'

import { useState, useMemo, useEffect } from 'react'
import { useStaggeredReveal } from '@/hooks/use-staggered-reveal'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'
import type { AnalysisResult, AnalysisItem, GapPrompt } from '@/lib/ai/document-analysis'

export type { AnalysisResult, AnalysisItem, GapPrompt }

interface AiAnalysisProps {
  result: AnalysisResult
  onComplete: (confirmedItems: AnalysisItem[], answers: Record<string, string>) => void
  onDismiss: () => void
}

function formatCurrency(amount: number): string {
  if (isNaN(amount)) return '—'
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: amount < 100 ? 2 : 0 }).format(amount)
}

type DialogueStep =
  | { type: 'auto'; items: AnalysisItem[] }
  | { type: 'confirm'; item: AnalysisItem }
  | { type: 'question'; item: AnalysisItem }
  | { type: 'gap'; gap: GapPrompt }
  | { type: 'complete' }

// ── Main Component — step-through dialogue ──

export function AiAnalysis({ result, onComplete, onDismiss }: AiAnalysisProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentStep, setCurrentStep] = useState(0)
  const [autoRevealed, setAutoRevealed] = useState(false)

  const autoItems = result.items.filter(i => i.tier === 'auto')
  const confirmItems = result.items.filter(i => i.tier === 'confirm')
  const questionItems = result.items.filter(i => i.tier === 'question')

  // Build the dialogue steps
  const steps = useMemo<DialogueStep[]>(() => {
    const s: DialogueStep[] = []
    if (autoItems.length > 0) s.push({ type: 'auto', items: autoItems })
    confirmItems.forEach(item => s.push({ type: 'confirm', item }))
    questionItems.forEach(item => s.push({ type: 'question', item }))
    result.gaps.forEach(gap => s.push({ type: 'gap', gap }))
    s.push({ type: 'complete' })
    return s
  }, [autoItems, confirmItems, questionItems, result.gaps])

  // Stagger reveal for auto items
  const autoRevealCount = useStaggeredReveal(
    autoRevealed ? 0 : autoItems.length,
    { initialDelay: 400, staggerDelay: 100 },
  )

  // Auto-advance from auto items after they've all revealed
  useEffect(() => {
    if (currentStep === 0 && steps[0]?.type === 'auto' && autoRevealCount >= autoItems.length && autoItems.length > 0) {
      const timer = setTimeout(() => setAutoRevealed(true), 800)
      return () => clearTimeout(timer)
    }
  }, [autoRevealCount, autoItems.length, currentStep, steps])

  function handleAnswer(itemId: string, answer: string) {
    setAnswers(prev => ({ ...prev, [itemId]: answer }))
    // Auto-advance to next step after a brief moment
    setTimeout(() => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1)), 350)
  }

  function handleComplete() {
    onComplete(result.items, answers)
  }

  function handleSkipToEnd() {
    setCurrentStep(steps.length - 1)
  }

  const step = steps[currentStep]
  const confirmedCount = autoItems.length + confirmItems.filter(i => answers[i.id]).length
  const hasInteractiveSteps = confirmItems.length > 0 || questionItems.length > 0 || result.gaps.length > 0
  const interactiveStepsTotal = confirmItems.length + questionItems.length + result.gaps.length
  const interactiveStepsDone = Object.keys(answers).length

  return (
    <div className="space-y-4">
      {/* ── Tier 1: Auto-confirmed (always visible) ── */}
      <div className={cn(
        'transition-all duration-500',
        currentStep >= 0 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
      )}>
        <div className="rounded-[var(--radius-lg)] border-[var(--border-card)] border-cream-dark bg-surface p-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-sage-dark">Here&apos;s what we found</p>

          <div className="mt-4 space-y-2">
            {autoItems.map((item, i) => (
              <div
                key={item.id}
                className={cn(
                  'flex items-center justify-between py-1 transition-all duration-300',
                  i < autoRevealCount || autoRevealed ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0',
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sage text-xs">✓</span>
                  <span className="text-sm text-ink">{item.label}</span>
                </div>
                <span className="text-sm font-bold text-ink tabular-nums">
                  {formatCurrency(item.value)}{item.period === 'monthly' ? '/mo' : item.period === 'annual' ? '/yr' : ''}
                </span>
              </div>
            ))}
          </div>

          {result.spending && result.spending.length > 0 && (
            <div className="mt-4 border-t border-cream-dark pt-3">
              <p className="text-[11px] font-semibold text-ink-faint uppercase tracking-wider">Monthly spending</p>
              <div className="mt-2 space-y-1">
                {result.spending.map(cat => (
                  <div key={cat.category} className="flex items-center justify-between text-sm">
                    <span className="text-ink-light capitalize">{cat.category.replace(/_/g, ' ')}</span>
                    <span className="font-semibold text-ink tabular-nums">{formatCurrency(cat.monthly_average)}/mo</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button className="mt-3 text-xs text-ink-faint hover:text-warmth-dark transition-colors">
            Something wrong? Correct an item
          </button>
        </div>
      </div>

      {/* ── Interactive step (one at a time) ── */}
      {autoRevealed && step?.type !== 'auto' && step?.type !== 'complete' && (
        <div className="transition-all duration-400 animate-in fade-in slide-in-from-bottom-2">
          {/* Progress indicator */}
          {interactiveStepsTotal > 1 && (
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                {Array.from({ length: interactiveStepsTotal }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-1 rounded-full transition-all duration-300',
                      i < interactiveStepsDone ? 'w-6 bg-sage' :
                      i === interactiveStepsDone ? 'w-6 bg-warmth' :
                      'w-3 bg-cream-dark',
                    )}
                  />
                ))}
              </div>
              <button
                onClick={handleSkipToEnd}
                className="text-xs text-ink-faint hover:text-ink transition-colors"
              >
                Skip all
              </button>
            </div>
          )}

          {/* Confirm step */}
          {step.type === 'confirm' && (
            <ConfirmCard item={step.item} onAnswer={handleAnswer} />
          )}

          {/* Question step */}
          {step.type === 'question' && (
            <QuestionCard item={step.item} onAnswer={handleAnswer} />
          )}

          {/* Gap step */}
          {step.type === 'gap' && (
            <GapCard gap={step.gap} onAnswer={handleAnswer} />
          )}
        </div>
      )}

      {/* ── Complete ── */}
      {(step?.type === 'complete' || (!hasInteractiveSteps && autoRevealed)) && (
        <div className="transition-all duration-500 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between">
            <button onClick={onDismiss} className="text-sm text-ink-faint hover:text-ink transition-colors">
              Discard
            </button>
            <Button onClick={handleComplete}>
              Add {confirmedCount} item{confirmedCount !== 1 ? 's' : ''} to your picture
            </Button>
          </div>
        </div>
      )}

      {/* Auto-advance to complete if no interactive steps */}
      {!hasInteractiveSteps && autoRevealed && currentStep === 0 && (
        <AutoAdvance onAdvance={() => setCurrentStep(steps.length - 1)} delay={600} />
      )}
    </div>
  )
}

// ── Confirm card (Tier 2) ──

function ConfirmCard({ item, onAnswer }: { item: AnalysisItem; onAnswer: (id: string, answer: string) => void }) {
  return (
    <div className="rounded-[var(--radius-md)] border-[var(--border-card)] border-cream-dark bg-surface p-5 shadow-[var(--shadow-sm)]">
      <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-ink-faint mb-3">Quick confirm</p>
      <p className="text-sm text-ink leading-relaxed">
        {item.confirm_question || `${item.label}: ${formatCurrency(item.value)}${item.period === 'monthly' ? '/mo' : ''}`}
      </p>
      {item.confirm_options && (
        <div className="mt-4 flex flex-wrap gap-2">
          {item.confirm_options.map(option => (
            <button
              key={option}
              onClick={() => onAnswer(item.id, option)}
              className="rounded-[var(--radius-sm)] border-[var(--border-card)] border-cream-dark bg-cream px-5 py-3 text-sm font-semibold text-ink transition-all hover:border-warmth hover:bg-warmth-light/20 active:scale-[0.97]"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Question card (Tier 3) ──

function QuestionCard({ item, onAnswer }: { item: AnalysisItem; onAnswer: (id: string, answer: string) => void }) {
  return (
    <div className="rounded-[var(--radius-md)] border-[var(--border-card)] border-l-[var(--border-accent)] border-cream-dark border-l-warmth bg-surface p-5 shadow-[var(--shadow-sm)]">
      <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-warmth-dark mb-3">We need your help</p>
      <p className="text-sm font-semibold text-ink">{item.question || item.label}</p>
      <p className="mt-1 text-xs text-ink-faint">{item.source_description}</p>
      {item.options && (
        <div className="mt-4 space-y-2">
          {item.options.map(option => (
            <button
              key={option}
              onClick={() => onAnswer(item.id, option)}
              className="block w-full rounded-[var(--radius-sm)] border-[var(--border-card)] border-cream-dark bg-cream px-4 py-3 text-left text-sm font-semibold text-ink transition-all hover:border-warmth hover:bg-warmth-light/20 active:scale-[0.99]"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Gap card (Tier 4) ──

function GapCard({ gap, onAnswer }: { gap: GapPrompt; onAnswer: (id: string, answer: string) => void }) {
  return (
    <div className="rounded-[var(--radius-md)] border-[var(--border-card)] border-teal-light bg-teal-light/10 p-5">
      <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-teal-dark mb-3">Something to think about</p>
      <p className="text-sm text-ink">{gap.prompt}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {gap.options.map(option => (
          <button
            key={option}
            onClick={() => onAnswer(gap.id, option)}
            className={cn(
              'rounded-[var(--radius-sm)] px-4 py-2.5 text-sm font-semibold transition-all active:scale-[0.97]',
              option.toLowerCase() === 'skip'
                ? 'text-ink-faint hover:text-ink'
                : 'border-[var(--border-card)] border-teal-light bg-cream text-ink hover:border-teal hover:bg-teal-light/30',
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Utility: auto-advance after delay ──

function AutoAdvance({ onAdvance, delay }: { onAdvance: () => void; delay: number }) {
  useEffect(() => {
    const timer = setTimeout(onAdvance, delay)
    return () => clearTimeout(timer)
  }, [onAdvance, delay])
  return null
}
