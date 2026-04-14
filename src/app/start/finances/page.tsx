'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { InterviewLayout } from '@/components/interview/interview-layout'
import { CardSelect } from '@/components/interview/card-select'
import { MicroMoment } from '@/components/interview/micro-moment'
import { Explainer } from '@/components/interview/explainer'
import { Button } from '@/components/ui/button'
import { useInterviewContext } from '@/components/interview/interview-provider'
import { cn } from '@/utils/cn'

const PRIORITY_OPTIONS = [
  { value: 'fair_split', label: 'A fair split' },
  { value: 'keep_home', label: 'Keeping the home' },
  { value: 'pension_protection', label: 'Protecting my pension' },
  { value: 'children_stability', label: 'Children\'s financial stability' },
  { value: 'clean_break', label: 'A clean break' },
  { value: 'ongoing_support', label: 'Ongoing financial support' },
]

const WORRY_OPTIONS = [
  { value: 'not_enough', label: 'Not having enough to live on' },
  { value: 'hidden_assets', label: 'Hidden assets or information' },
  { value: 'pension_loss', label: 'Losing pension value' },
  { value: 'mortgage', label: 'Mortgage affordability' },
  { value: 'process_cost', label: 'The cost of the process itself' },
]

const PARTNER_AWARENESS_OPTIONS = [
  { value: 'good_idea', label: 'I have a good idea', description: 'I know roughly what they earn, own, and owe' },
  { value: 'some_things', label: 'I know some things', description: 'I know parts, but there are gaps' },
  { value: 'very_little', label: 'Very little', description: 'I don\'t know much about their finances' },
  { value: 'hiding', label: 'I suspect they\'re hiding things', description: 'I believe information is being deliberately withheld' },
]

function MultiSelect({ options, selected, onChange }: {
  options: { value: string; label: string }[]
  selected: string[]
  onChange: (selected: string[]) => void
}) {
  function toggle(value: string) {
    onChange(
      selected.includes(value)
        ? selected.filter(v => v !== value)
        : [...selected, value]
    )
  }

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {options.map(option => (
        <button
          key={option.value}
          type="button"
          onClick={() => toggle(option.value)}
          className={cn(
            'rounded-[var(--radius-card)] px-5 py-4 text-left text-[15px] font-medium transition-all duration-200',
            selected.includes(option.value)
              ? 'bg-ink text-white'
              : 'bg-white text-ink hover:bg-[var(--color-grey-50)]',
          )}
          style={{
            boxShadow: selected.includes(option.value) ? 'none' : 'var(--shadow-card)',
            border: selected.includes(option.value) ? '1px solid var(--color-ink)' : '1px solid var(--color-grey-100)',
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

type FinanceStep = 'what_matters' | 'partner'
const STEPS: FinanceStep[] = ['what_matters', 'partner']

export default function FinancesPage() {
  const router = useRouter()
  const { session, updateFinances, startPlanGeneration, hasSafeguardingConcerns, interviewSteps } = useInterviewContext()
  const [step, setStep] = useState<FinanceStep>('what_matters')
  const idx = STEPS.indexOf(step)

  function next() {
    if (idx < STEPS.length - 1) {
      setStep(STEPS[idx + 1])
    } else {
      // Pre-generate plan before navigating
      startPlanGeneration(session, hasSafeguardingConcerns)
      router.push('/start/plan')
    }
  }

  function canContinue() {
    switch (step) {
      case 'what_matters': return session.finances.priorities.length > 0 && session.finances.worries.length > 0
      case 'partner': return session.finances.partner_awareness !== null
    }
  }

  return (
    <InterviewLayout currentStep="finances" steps={interviewSteps}>
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-2xl font-bold text-ink">Your finances</h1>
          <p className="mt-2 text-[15px] text-ink-secondary leading-relaxed">
            This isn&apos;t about exact numbers yet. It&apos;s about understanding what matters to you.
          </p>
        </div>

        {/* Screen 1: Priorities + Worries combined */}
        {step === 'what_matters' && (
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-[15px] font-medium text-ink">What matters most to you financially? <span className="text-ink-tertiary">(Select all that apply)</span></p>
              <MultiSelect
                options={PRIORITY_OPTIONS}
                selected={session.finances.priorities}
                onChange={(v) => updateFinances({ priorities: v })}
              />
              {session.finances.priorities.includes('pension_protection') && (
                <Explainer label="Why pensions matter so much">
                  <p>Pensions are often the largest single asset in a separation — sometimes worth more than the family home. Many people don&apos;t realise this until late in the process.</p>
                </Explainer>
              )}
              {session.finances.priorities.includes('clean_break') && (
                <Explainer label="What a clean break means">
                  <p>A clean break means neither of you can make financial claims against each other in the future. This is formalised through a consent order — strongly recommended even when you agree.</p>
                </Explainer>
              )}
            </div>

            <div className="space-y-4">
              <p className="text-[15px] font-medium text-ink">What worries you most? <span className="text-ink-tertiary">(Select all that apply)</span></p>
              <MultiSelect
                options={WORRY_OPTIONS}
                selected={session.finances.worries}
                onChange={(v) => updateFinances({ worries: v })}
              />
              {session.finances.worries.includes('hidden_assets') && (
                <Explainer label="How disclosure protects you">
                  <p>The formal disclosure process requires both parties to declare everything under oath. If information is deliberately hidden, there are serious consequences. Having your side thoroughly prepared is the strongest protection.</p>
                </Explainer>
              )}
              {session.finances.worries.includes('process_cost') && (
                <Explainer label="Keeping costs manageable">
                  <p>The divorce application is £612. Mediation has a £500 government voucher. This service reduces your dependence on expensive solicitor hours by helping you do the preparation yourself.</p>
                </Explainer>
              )}
            </div>
          </div>
        )}

        {/* Screen 2: Partner awareness */}
        {step === 'partner' && (
          <div className="space-y-5">
            <p className="text-[15px] font-medium text-ink">What do you know about your partner&apos;s finances?</p>
            <p className="text-[13px] text-ink-tertiary">This helps us understand how complete the picture is — and where we can help fill the gaps.</p>
            <CardSelect
              options={PARTNER_AWARENESS_OPTIONS}
              value={session.finances.partner_awareness}
              onChange={(v) => updateFinances({ partner_awareness: v as typeof session.finances.partner_awareness })}
              columns={1}
            />
            {session.finances.partner_awareness === 'very_little' && (
              <MicroMoment>
                This is very common. Building your side first puts you in a strong position — and you can invite your partner to share their side later.
              </MicroMoment>
            )}
            {session.finances.partner_awareness === 'hiding' && (
              <Explainer label="What you can do about hidden assets">
                <p>The formal disclosure process requires everything declared under oath. Non-disclosure has serious legal consequences. Building your own thorough picture is the strongest foundation — it makes gaps in their disclosure easier to identify.</p>
              </Explainer>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-4">
          {idx > 0 ? (
            <button type="button" onClick={() => setStep(STEPS[idx - 1])} className="text-sm text-ink-secondary transition-colors hover:text-ink">Back</button>
          ) : (
            <button type="button" onClick={() => router.back()} className="text-sm text-ink-secondary transition-colors hover:text-ink">Back</button>
          )}
          <Button onClick={next} disabled={!canContinue()}>Continue</Button>
        </div>
      </div>
    </InterviewLayout>
  )
}
