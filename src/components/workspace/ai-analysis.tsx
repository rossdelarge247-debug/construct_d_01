'use client'

import { useState } from 'react'
import { useStaggeredReveal } from '@/hooks/use-staggered-reveal'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'

// ── Types ──

interface AnalysisItem {
  id: string
  label: string
  value: number
  period: 'monthly' | 'annual' | 'total'
  confidence: number
  tier: 'auto' | 'confirm' | 'question'
  category: string
  subcategory: string
  ownership_hint: 'yours' | 'joint' | 'unknown'
  source_description: string
  confirm_question?: string
  confirm_options?: string[]
  question?: string
  options?: string[]
}

interface GapPrompt {
  id: string
  domain: string
  prompt: string
  options: string[]
}

export interface AnalysisResult {
  summary: string
  items: AnalysisItem[]
  gaps: GapPrompt[]
  spending?: { category: string; monthly_average: number; transaction_count: number }[]
}

interface AiAnalysisProps {
  result: AnalysisResult
  onComplete: (confirmedItems: AnalysisItem[], answers: Record<string, string>) => void
  onDismiss: () => void
}

function formatCurrency(amount: number): string {
  if (isNaN(amount)) return '—'
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: amount < 100 ? 2 : 0 }).format(amount)
}

// ── Main Component ──

export function AiAnalysis({ result, onComplete, onDismiss }: AiAnalysisProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showCorrections, setShowCorrections] = useState(false)

  const autoItems = result.items.filter(i => i.tier === 'auto')
  const confirmItems = result.items.filter(i => i.tier === 'confirm')
  const questionItems = result.items.filter(i => i.tier === 'question')

  // Count sections for stagger
  const sectionCount = 1 + (confirmItems.length > 0 ? 1 : 0) + (questionItems.length > 0 ? 1 : 0) + (result.gaps.length > 0 ? 1 : 0) + 1
  const visibleSections = useStaggeredReveal(sectionCount, { initialDelay: 300, staggerDelay: 400 })

  const allConfirmsAnswered = confirmItems.every(i => answers[i.id])
  const allQuestionsAnswered = questionItems.every(i => answers[i.id])

  function handleAnswer(itemId: string, answer: string) {
    setAnswers(prev => ({ ...prev, [itemId]: answer }))
  }

  function handleComplete() {
    onComplete(result.items, answers)
  }

  let sectionIdx = 0

  return (
    <div className="space-y-6">
      {/* ── Tier 1: Auto-confirmed ── */}
      <div className={cn(
        'transition-all duration-500',
        visibleSections > sectionIdx ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
      )}>
        <div className="rounded-[var(--radius-lg)] border-[var(--border-card)] border-cream-dark bg-surface p-6 shadow-[var(--shadow-sm)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-sage-dark">Here&apos;s what we found</p>

          <div className="mt-4 space-y-2.5">
            {autoItems.map((item, i) => (
              <div
                key={item.id}
                className={cn(
                  'flex items-center justify-between py-1.5 transition-all duration-300',
                  i < useStaggeredRevealCount(autoItems.length, 300, 80) ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0',
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sage text-sm">✓</span>
                  <span className="text-sm text-ink">{item.label}</span>
                </div>
                <span className="text-sm font-bold text-ink tabular-nums">
                  {formatCurrency(item.value)}{item.period === 'monthly' ? '/mo' : item.period === 'annual' ? '/yr' : ''}
                </span>
              </div>
            ))}
          </div>

          {result.spending && result.spending.length > 0 && (
            <div className="mt-4 border-t-[var(--border-card)] border-cream-dark pt-4">
              <p className="text-xs font-semibold text-ink-faint">Monthly spending breakdown</p>
              <div className="mt-2 space-y-1.5">
                {result.spending.map(cat => (
                  <div key={cat.category} className="flex items-center justify-between text-sm">
                    <span className="text-ink-light capitalize">{cat.category.replace(/_/g, ' ')}</span>
                    <span className="font-semibold text-ink tabular-nums">{formatCurrency(cat.monthly_average)}/mo</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!showCorrections && (
            <button
              onClick={() => setShowCorrections(true)}
              className="mt-4 text-xs text-ink-faint hover:text-warmth-dark transition-colors"
            >
              Something wrong? Correct an item
            </button>
          )}
        </div>
      </div>
      {(() => { sectionIdx++; return null })()}

      {/* ── Tier 2: Quick confirmations ── */}
      {confirmItems.length > 0 && (
        <div className={cn(
          'space-y-3 transition-all duration-500',
          visibleSections > sectionIdx ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
        )}>
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-ink-faint">A few things to confirm</p>

          {confirmItems.map(item => (
            <div
              key={item.id}
              className={cn(
                'rounded-[var(--radius-md)] border-[var(--border-card)] p-5 transition-all duration-300',
                answers[item.id]
                  ? 'border-sage bg-sage-light/20'
                  : 'border-cream-dark bg-surface shadow-[var(--shadow-sm)]',
              )}
            >
              <p className="text-sm text-ink leading-relaxed">
                {item.confirm_question || `${item.label}: ${formatCurrency(item.value)}${item.period === 'monthly' ? '/mo' : ''}`}
              </p>

              {!answers[item.id] && item.confirm_options && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.confirm_options.map(option => (
                    <button
                      key={option}
                      onClick={() => handleAnswer(item.id, option)}
                      className="rounded-[var(--radius-sm)] border-[var(--border-card)] border-cream-dark bg-cream px-4 py-2.5 text-sm font-semibold text-ink transition-all hover:border-warmth hover:bg-warmth-light/20 active:scale-[0.97]"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {answers[item.id] && (
                <p className="mt-2 text-xs font-semibold text-sage-dark">✓ {answers[item.id]}</p>
              )}
            </div>
          ))}
        </div>
      )}
      {confirmItems.length > 0 && (() => { sectionIdx++; return null })()}

      {/* ── Tier 3: Genuine questions ── */}
      {questionItems.length > 0 && (
        <div className={cn(
          'space-y-3 transition-all duration-500',
          visibleSections > sectionIdx ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
        )}>
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-warmth-dark">
            {questionItems.length === 1 ? 'One thing we need your help with' : 'A couple of things we need your help with'}
          </p>

          {questionItems.map(item => (
            <div
              key={item.id}
              className={cn(
                'rounded-[var(--radius-md)] border-[var(--border-card)] border-l-[var(--border-accent)] p-5 transition-all duration-300',
                answers[item.id]
                  ? 'border-sage border-l-sage bg-sage-light/10'
                  : 'border-cream-dark border-l-warmth bg-surface shadow-[var(--shadow-sm)]',
              )}
            >
              <p className="text-sm font-semibold text-ink">{item.question || item.label}</p>
              <p className="mt-1 text-xs text-ink-faint">{item.source_description}</p>

              {!answers[item.id] && item.options && (
                <div className="mt-4 space-y-2">
                  {item.options.map(option => (
                    <button
                      key={option}
                      onClick={() => handleAnswer(item.id, option)}
                      className="block w-full rounded-[var(--radius-sm)] border-[var(--border-card)] border-cream-dark bg-cream px-4 py-3 text-left text-sm font-semibold text-ink transition-all hover:border-warmth hover:bg-warmth-light/20 active:scale-[0.99]"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {answers[item.id] && (
                <p className="mt-3 text-xs font-semibold text-sage-dark">✓ {answers[item.id]}</p>
              )}
            </div>
          ))}
        </div>
      )}
      {questionItems.length > 0 && (() => { sectionIdx++; return null })()}

      {/* ── Tier 4: Gap prompts ── */}
      {result.gaps.length > 0 && (
        <div className={cn(
          'space-y-3 transition-all duration-500',
          visibleSections > sectionIdx ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
        )}>
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-teal-dark">A couple of things to think about</p>

          {result.gaps.map(gap => (
            <div
              key={gap.id}
              className={cn(
                'rounded-[var(--radius-md)] border-[var(--border-card)] border-teal-light p-5 transition-all',
                answers[gap.id] ? 'bg-teal-light/10' : 'bg-teal-light/20',
              )}
            >
              <p className="text-sm text-ink">💡 {gap.prompt}</p>

              {!answers[gap.id] && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {gap.options.map(option => (
                    <button
                      key={option}
                      onClick={() => handleAnswer(gap.id, option)}
                      className={cn(
                        'rounded-[var(--radius-sm)] px-4 py-2 text-xs font-semibold transition-all active:scale-[0.97]',
                        option.toLowerCase() === 'skip'
                          ? 'text-ink-faint hover:text-ink'
                          : 'border-[var(--border-card)] border-teal-light bg-cream text-ink hover:border-teal hover:bg-teal-light/30',
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {answers[gap.id] && (
                <p className="mt-2 text-xs font-semibold text-teal-dark">✓ {answers[gap.id]}</p>
              )}
            </div>
          ))}
        </div>
      )}
      {result.gaps.length > 0 && (() => { sectionIdx++; return null })()}

      {/* ── Complete ── */}
      <div className={cn(
        'transition-all duration-500',
        visibleSections > sectionIdx ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
      )}>
        <div className="flex items-center justify-between">
          <button onClick={onDismiss} className="text-sm font-semibold text-ink-faint hover:text-ink transition-colors">
            Discard and upload different document
          </button>
          <Button onClick={handleComplete}>
            Add {autoItems.length + confirmItems.filter(i => answers[i.id]).length} items to your picture
          </Button>
        </div>
      </div>
    </div>
  )
}

// Helper — inline stagger count for auto items
function useStaggeredRevealCount(total: number, initialDelay: number, stagger: number): number {
  // Simplified: in production this would use the hook, but items are already visible
  // since the parent section has revealed. Return total immediately.
  return total
}
