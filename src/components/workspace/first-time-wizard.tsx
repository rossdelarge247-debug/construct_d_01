'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Explainer } from '@/components/interview/explainer'
import { cn } from '@/utils/cn'

interface WizardConfig {
  categories: string[]
  counts: Record<string, number>
}

interface FirstTimeWizardProps {
  onComplete: (config: WizardConfig) => void
}

interface ScopeItem {
  key: string
  label: string
  icon: string
  description: string
  defaultChecked: boolean
  countQuestion?: string
  countOptions?: number[]
}

const SCOPE_ITEMS: ScopeItem[] = [
  { key: 'current_account', label: 'Current accounts', icon: '🏦', description: 'Income, spending, and day-to-day finances', defaultChecked: true, countQuestion: 'How many current accounts do you have?', countOptions: [1, 2, 3] },
  { key: 'savings', label: 'Savings & ISAs', icon: '💰', description: 'Savings accounts, ISAs, and cash holdings', defaultChecked: true, countQuestion: 'How many savings accounts or ISAs?', countOptions: [1, 2, 3] },
  { key: 'property', label: 'Property', icon: '🏠', description: 'Homes, land, or other property you own', defaultChecked: true, countQuestion: 'How many properties?', countOptions: [1, 2, 3] },
  { key: 'pensions', label: 'Pensions', icon: '📊', description: 'Workplace, personal, and state pensions', defaultChecked: true, countQuestion: 'How many pensions do you have?', countOptions: [1, 2, 3] },
  { key: 'debts', label: 'Debts & liabilities', icon: '💳', description: 'Loans, credit cards, and other debts', defaultChecked: true },
  { key: 'other_income', label: 'Other income', icon: '📥', description: 'Benefits, rental income, maintenance received', defaultChecked: false },
  { key: 'other_assets', label: 'Other assets', icon: '🚗', description: 'Vehicles, crypto, valuables, investments', defaultChecked: false },
  { key: 'business', label: 'Business interests', icon: '💼', description: 'Self-employment, company, or partnership', defaultChecked: false },
]

type WizardStep = 'playback' | 'scope' | 'ready'

export function FirstTimeWizard({ onComplete }: FirstTimeWizardProps) {
  const [step, setStep] = useState<WizardStep>('playback')
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set(SCOPE_ITEMS.filter(i => i.defaultChecked).map(i => i.key))
  )
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [pensionUnsure, setPensionUnsure] = useState(false)

  function toggleCategory(key: string) {
    setSelectedCategories(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  function setCount(key: string, count: number) {
    setCounts(prev => ({ ...prev, [key]: count }))
  }

  function handleComplete() {
    onComplete({
      categories: Array.from(selectedCategories),
      counts,
    })
  }

  return (
    <div className="space-y-6">
      {/* ── Step 1: V1 Playback ── */}
      {step === 'playback' && (
        <div className="space-y-6">
          <div className="rounded-[var(--radius-lg)] border-[var(--border-card)] border-teal-light bg-teal-light/30 p-7">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-teal-dark">From your plan</p>
            <h2 className="mt-3 text-xl font-bold text-ink">Here&apos;s what we know about your situation</h2>
            <p className="mt-2 text-sm text-ink-light leading-relaxed">
              Before we start building your financial picture, let&apos;s make sure we&apos;ve got the basics right.
            </p>

            <div className="mt-5 space-y-3">
              {[
                { label: 'Relationship', value: 'Married' },
                { label: 'Children', value: 'Yes' },
                { label: 'Property', value: 'Own jointly' },
                { label: 'Income', value: '~£3,200/mo (estimated)' },
                { label: 'Pensions', value: 'Unknown' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-1.5">
                  <span className="text-sm text-ink-light">{item.label}</span>
                  <span className="text-sm font-semibold text-ink">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button className="text-sm font-semibold text-ink-faint hover:text-ink transition-colors">
              Something needs changing
            </button>
            <Button onClick={() => setStep('scope')}>
              This looks right →
            </Button>
          </div>
        </div>
      )}

      {/* ── Step 2: Disclosure Scope ── */}
      {step === 'scope' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-ink">What areas apply to your situation?</h2>
            <p className="mt-2 text-sm text-ink-light leading-relaxed">
              We&apos;ve pre-selected the areas most people need. Adjust to match your situation — you can add more anytime.
            </p>
          </div>

          <div className="space-y-3">
            {SCOPE_ITEMS.map(item => {
              const isSelected = selectedCategories.has(item.key)
              const showCount = isSelected && item.countQuestion

              return (
                <div key={item.key}>
                  <button
                    onClick={() => toggleCategory(item.key)}
                    className={cn(
                      'flex w-full items-center gap-4 rounded-[var(--radius-md)] border-[var(--border-card)] p-4 text-left transition-all',
                      isSelected
                        ? 'border-warmth bg-warmth-light/10 shadow-[var(--shadow-sm)]'
                        : 'border-cream-dark bg-surface hover:border-ink-faint',
                    )}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <div className="flex-1">
                      <p className={cn('text-base font-bold', isSelected ? 'text-ink' : 'text-ink-light')}>
                        {item.label}
                      </p>
                      <p className="text-xs text-ink-faint">{item.description}</p>
                    </div>
                    <div className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-full border-[var(--border-card)] transition-colors',
                      isSelected ? 'border-warmth bg-warmth text-white' : 'border-cream-dark bg-cream',
                    )}>
                      {isSelected && <span className="text-xs">✓</span>}
                    </div>
                  </button>

                  {/* Count question */}
                  {showCount && (
                    <div className="ml-14 mt-2 flex items-center gap-3">
                      <p className="text-xs text-ink-light">{item.countQuestion}</p>
                      <div className="flex gap-1.5">
                        {(item.countOptions || [1, 2, 3]).map(n => (
                          <button
                            key={n}
                            onClick={() => setCount(item.key, n)}
                            className={cn(
                              'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all',
                              (counts[item.key] || 1) === n
                                ? 'bg-warmth text-white'
                                : 'bg-cream-dark text-ink-faint hover:bg-cream-dark/80',
                            )}
                          >
                            {n === 3 ? '3+' : n}
                          </button>
                        ))}
                        {item.key === 'pensions' && (
                          <button
                            onClick={() => { setPensionUnsure(true); setCount('pensions', 0) }}
                            className={cn(
                              'rounded-full px-3 py-1.5 text-xs font-semibold transition-all',
                              pensionUnsure ? 'bg-amber text-white' : 'bg-cream-dark text-ink-faint hover:bg-cream-dark/80',
                            )}
                          >
                            Not sure
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Pension tracing guidance */}
                  {item.key === 'pensions' && pensionUnsure && isSelected && (
                    <div className="ml-14 mt-2">
                      <Explainer label="Help finding lost pensions">
                        <div className="space-y-2">
                          <p>Many people have pensions from previous employers they&apos;ve lost track of.</p>
                          <p>The government&apos;s free Pension Tracing Service can help: <strong>gov.uk/find-pension-contact-details</strong></p>
                          <p>We&apos;ll add a pensions section and you can update it when you find out more.</p>
                        </div>
                      </Explainer>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="flex items-center justify-between">
            <button onClick={() => setStep('playback')} className="text-sm font-semibold text-ink-faint hover:text-ink transition-colors">
              ← Back
            </button>
            <Button onClick={() => setStep('ready')}>
              Continue →
            </Button>
          </div>
        </div>
      )}

      {/* ── Step 3: Ready ── */}
      {step === 'ready' && (
        <div className="space-y-6">
          <div className="rounded-[var(--radius-lg)] border-[var(--border-card)] border-sage bg-sage-light/20 p-7 text-center">
            <h2 className="text-xl font-bold text-ink">You&apos;re set up</h2>
            <p className="mt-2 text-sm text-ink-light leading-relaxed">
              We&apos;ve configured {selectedCategories.size} areas for your financial picture. Upload any financial document — we&apos;ll detect what it is and organise it for you.
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {Array.from(selectedCategories).map(key => {
                const item = SCOPE_ITEMS.find(i => i.key === key)
                if (!item) return null
                return (
                  <span key={key} className="flex items-center gap-1.5 rounded-full bg-surface border-[var(--border-card)] border-cream-dark px-3 py-1.5 text-xs font-semibold text-ink">
                    <span>{item.icon}</span>
                    {item.label}
                  </span>
                )
              })}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button onClick={() => setStep('scope')} className="text-sm font-semibold text-ink-faint hover:text-ink transition-colors">
              ← Adjust areas
            </button>
            <Button onClick={handleComplete}>
              Start building →
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
