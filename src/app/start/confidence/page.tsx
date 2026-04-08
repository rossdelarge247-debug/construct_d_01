'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { InterviewLayout } from '@/components/interview/interview-layout'
import { MicroMoment } from '@/components/interview/micro-moment'
import { Button } from '@/components/ui/button'
import { useInterviewContext } from '@/components/interview/interview-provider'
import { cn } from '@/utils/cn'
import type { InterviewSession } from '@/types/interview'

type ConfidenceValue = 'known' | 'estimated' | 'unsure' | 'unknown'
type ConfidenceKey = keyof InterviewSession['confidence']

const DOMAINS: { key: ConfidenceKey; label: string; valueLabel?: string; valuePlaceholder?: string; valuePrefix?: string }[] = [
  { key: 'my_income', label: 'My income', valueLabel: 'Monthly income', valuePlaceholder: 'e.g. 3,200', valuePrefix: '£' },
  { key: 'partner_income', label: 'Partner\'s income', valueLabel: 'Their monthly income', valuePlaceholder: 'e.g. 2,800', valuePrefix: '£' },
  { key: 'savings', label: 'Savings and bank accounts', valueLabel: 'Total savings', valuePlaceholder: 'e.g. 15,000', valuePrefix: '£' },
  { key: 'debts', label: 'Debts and loans', valueLabel: 'Total debts', valuePlaceholder: 'e.g. 8,000', valuePrefix: '£' },
  { key: 'property_value', label: 'Property value', valueLabel: 'Approximate value', valuePlaceholder: 'e.g. 320,000', valuePrefix: '£' },
  { key: 'mortgage', label: 'Mortgage details', valueLabel: 'Outstanding balance', valuePlaceholder: 'e.g. 195,000', valuePrefix: '£' },
  { key: 'my_pension', label: 'My pension(s)', valueLabel: 'Pension value', valuePlaceholder: 'e.g. 85,000', valuePrefix: '£' },
  { key: 'partner_pension', label: 'Partner\'s pension(s)', valueLabel: 'Their pension value', valuePlaceholder: 'e.g. 40,000', valuePrefix: '£' },
  { key: 'other_assets', label: 'Other assets', valueLabel: 'Approximate value', valuePlaceholder: 'e.g. 5,000', valuePrefix: '£' },
  { key: 'commitments', label: 'Regular commitments', valueLabel: 'Monthly total', valuePlaceholder: 'e.g. 1,200', valuePrefix: '£' },
]

const CONFIDENCE_OPTIONS: { value: ConfidenceValue; label: string; color: string }[] = [
  { value: 'known', label: 'Known', color: 'bg-sage text-cream' },
  { value: 'estimated', label: 'Estimated', color: 'bg-amber text-cream' },
  { value: 'unsure', label: 'Unsure', color: 'bg-soft text-ink' },
  { value: 'unknown', label: 'Unknown', color: 'bg-cream-dark text-ink-faint' },
]

function ConfidenceRow({ domain, confidenceValue, numericValue, onConfidenceChange, onValueChange }: {
  domain: typeof DOMAINS[number]
  confidenceValue: ConfidenceValue | null
  numericValue: string | null
  onConfidenceChange: (v: ConfidenceValue) => void
  onValueChange: (v: string) => void
}) {
  const showValueInput = confidenceValue === 'known' || confidenceValue === 'estimated'

  return (
    <div className="rounded-[var(--radius-sm)] border border-cream-dark p-4 transition-all duration-200">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-sm font-medium text-ink">{domain.label}</span>
        <div className="flex gap-1.5">
          {CONFIDENCE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onConfidenceChange(opt.value)}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium transition-all duration-200',
                confidenceValue === opt.value
                  ? opt.color
                  : 'bg-cream text-ink-faint hover:bg-cream-dark hover:text-ink-light',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Progressive value capture */}
      {showValueInput && domain.valueLabel && (
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs text-ink-faint">{domain.valueLabel}</span>
          <div className="flex items-center gap-1">
            {domain.valuePrefix && <span className="text-sm text-ink-faint">{domain.valuePrefix}</span>}
            <input
              type="text"
              inputMode="numeric"
              value={numericValue || ''}
              onChange={(e) => onValueChange(e.target.value)}
              placeholder={domain.valuePlaceholder}
              className="w-28 rounded-[var(--radius-sm)] border border-cream-dark bg-cream px-2.5 py-1.5 text-sm text-ink placeholder:text-ink-faint/50 transition-colors focus:border-warmth focus:outline-none"
            />
          </div>
          <span className="text-xs text-ink-faint">optional</span>
        </div>
      )}
    </div>
  )
}

export default function ConfidencePage() {
  const router = useRouter()
  const { session, updateConfidence, updateValues } = useInterviewContext()

  const answeredCount = DOMAINS.filter(d => session.confidence[d.key] !== null).length
  const allAnswered = answeredCount === DOMAINS.length

  const known = DOMAINS.filter(d => session.confidence[d.key] === 'known').length
  const estimated = DOMAINS.filter(d => session.confidence[d.key] === 'estimated').length
  const unsure = DOMAINS.filter(d => session.confidence[d.key] === 'unsure').length
  const unknown = DOMAINS.filter(d => session.confidence[d.key] === 'unknown').length

  // Count values provided
  const valuesProvided = DOMAINS.filter(d => session.values[d.key] && session.values[d.key]!.trim() !== '').length

  return (
    <InterviewLayout step={6} totalSteps={8}>
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-2xl font-medium text-ink">What do you know?</h1>
          <p className="mt-2 text-sm text-ink-light leading-relaxed">
            For each area, tell us how well you know the information. If you know a number — even roughly — you can add it and we&apos;ll use it to make your plan more specific.
          </p>
        </div>

        <div className="space-y-3">
          {DOMAINS.map(domain => (
            <ConfidenceRow
              key={domain.key}
              domain={domain}
              confidenceValue={session.confidence[domain.key]}
              numericValue={session.values[domain.key]}
              onConfidenceChange={(v) => updateConfidence({ [domain.key]: v })}
              onValueChange={(v) => updateValues({ [domain.key]: v })}
            />
          ))}
        </div>

        {/* Live summary */}
        {answeredCount > 0 && (
          <div className="rounded-[var(--radius-md)] border border-cream-dark p-5">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {known > 0 && <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-full bg-sage" /> {known} known</span>}
              {estimated > 0 && <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-full bg-amber" /> {estimated} estimated</span>}
              {unsure > 0 && <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-full bg-soft" /> {unsure} unsure</span>}
              {unknown > 0 && <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-full bg-cream-dark" /> {unknown} unknown</span>}
            </div>
            {valuesProvided > 0 && (
              <p className="mt-2 text-xs text-ink-faint">{valuesProvided} value{valuesProvided > 1 ? 's' : ''} provided — this will make your plan more specific.</p>
            )}
          </div>
        )}

        {allAnswered && unknown >= 4 && (
          <MicroMoment>
            Having several unknowns is completely normal — especially around your partner&apos;s finances. Knowing where the gaps are is itself valuable. The next stage is designed to help you fill them in.
          </MicroMoment>
        )}
        {allAnswered && unknown < 4 && unknown > 0 && (
          <MicroMoment>
            You can see exactly where the gaps are — and that&apos;s powerful information in itself.
          </MicroMoment>
        )}
        {allAnswered && unknown === 0 && (
          <MicroMoment>
            You have a strong picture of your financial position. That puts you in a much stronger starting place than most people at this stage.
          </MicroMoment>
        )}

        <div className="flex items-center justify-between pt-4">
          <button type="button" onClick={() => router.back()} className="text-sm text-ink-light transition-colors hover:text-ink">Back</button>
          <Button onClick={() => router.push('/start/plan')} disabled={!allAnswered}>
            See your plan
          </Button>
        </div>
      </div>
    </InterviewLayout>
  )
}
