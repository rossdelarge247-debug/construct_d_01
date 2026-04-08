'use client'

import { useRouter } from 'next/navigation'
import { InterviewLayout } from '@/components/interview/interview-layout'
import { MicroMoment } from '@/components/interview/micro-moment'
import { Button } from '@/components/ui/button'
import { useInterviewContext } from '@/components/interview/interview-provider'
import { cn } from '@/utils/cn'
import type { InterviewSession } from '@/types/interview'

type ConfidenceValue = 'known' | 'estimated' | 'unsure' | 'unknown'
type ConfidenceKey = keyof InterviewSession['confidence']

const DOMAINS: { key: ConfidenceKey; label: string }[] = [
  { key: 'my_income', label: 'My income' },
  { key: 'partner_income', label: 'Partner\'s income' },
  { key: 'savings', label: 'Savings and bank accounts' },
  { key: 'debts', label: 'Debts and loans' },
  { key: 'property_value', label: 'Property value' },
  { key: 'mortgage', label: 'Mortgage details' },
  { key: 'my_pension', label: 'My pension(s)' },
  { key: 'partner_pension', label: 'Partner\'s pension(s)' },
  { key: 'other_assets', label: 'Other assets' },
  { key: 'commitments', label: 'Regular commitments' },
]

const CONFIDENCE_OPTIONS: { value: ConfidenceValue; label: string; color: string }[] = [
  { value: 'known', label: 'Known', color: 'bg-sage text-cream' },
  { value: 'estimated', label: 'Estimated', color: 'bg-amber text-cream' },
  { value: 'unsure', label: 'Unsure', color: 'bg-soft text-ink' },
  { value: 'unknown', label: 'Unknown', color: 'bg-cream-dark text-ink-faint' },
]

function ConfidenceRow({ label, value, onChange }: {
  label: string
  value: ConfidenceValue | null
  onChange: (v: ConfidenceValue) => void
}) {
  return (
    <div className="flex flex-col gap-3 rounded-[var(--radius-sm)] border border-cream-dark p-4 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm font-medium text-ink">{label}</span>
      <div className="flex gap-1.5">
        {CONFIDENCE_OPTIONS.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition-all duration-200',
              value === opt.value
                ? opt.color
                : 'bg-cream text-ink-faint hover:bg-cream-dark hover:text-ink-light',
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function ConfidencePage() {
  const router = useRouter()
  const { session, updateConfidence } = useInterviewContext()

  const answeredCount = DOMAINS.filter(d => session.confidence[d.key] !== null).length
  const allAnswered = answeredCount === DOMAINS.length

  // Summary stats
  const known = DOMAINS.filter(d => session.confidence[d.key] === 'known').length
  const estimated = DOMAINS.filter(d => session.confidence[d.key] === 'estimated').length
  const unsure = DOMAINS.filter(d => session.confidence[d.key] === 'unsure').length
  const unknown = DOMAINS.filter(d => session.confidence[d.key] === 'unknown').length

  return (
    <InterviewLayout step={6} totalSteps={8}>
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-2xl font-medium text-ink">What do you know?</h1>
          <p className="mt-2 text-sm text-ink-light leading-relaxed">
            For each area, tell us how well you know the information. Most people have a mix — that&apos;s completely normal.
          </p>
        </div>

        <div className="space-y-3">
          {DOMAINS.map(domain => (
            <ConfidenceRow
              key={domain.key}
              label={domain.label}
              value={session.confidence[domain.key]}
              onChange={(v) => updateConfidence({ [domain.key]: v })}
            />
          ))}
        </div>

        {/* Live summary */}
        {answeredCount > 0 && (
          <div className="rounded-[var(--radius-md)] border border-cream-dark p-5">
            <div className="flex items-center gap-4 text-sm">
              {known > 0 && <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-full bg-sage" /> {known} known</span>}
              {estimated > 0 && <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-full bg-amber" /> {estimated} estimated</span>}
              {unsure > 0 && <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-full bg-soft" /> {unsure} unsure</span>}
              {unknown > 0 && <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-full bg-cream-dark" /> {unknown} unknown</span>}
            </div>
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
