'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { InterviewLayout } from '@/components/interview/interview-layout'
import { CardSelect } from '@/components/interview/card-select'
import { MicroMoment } from '@/components/interview/micro-moment'
import { Explainer } from '@/components/interview/explainer'
import { Button } from '@/components/ui/button'
import { useInterviewContext } from '@/components/interview/interview-provider'
import { getFinancialReactions } from '@/lib/recommendations'
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

const AWARENESS_OPTIONS = [
  { value: 'pretty_clear', label: 'Yes, I have a pretty clear picture' },
  { value: 'know_my_side', label: 'I know my side, but not theirs' },
  { value: 'rough_idea', label: 'I have a rough idea overall' },
  { value: 'really_dont_know', label: 'I really don\'t know' },
]

type FinanceStep = 'priorities' | 'worries' | 'reflection' | 'awareness'
const STEPS: FinanceStep[] = ['priorities', 'worries', 'reflection', 'awareness']

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
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {options.map(option => (
        <button
          key={option.value}
          type="button"
          onClick={() => toggle(option.value)}
          className={cn(
            'rounded-[var(--radius-md)] border-2 px-5 py-4 text-left text-sm font-medium transition-all duration-200',
            selected.includes(option.value)
              ? 'border-[#E5484D] bg-[#FEF2F2] text-[#E5484D]'
              : 'border-[var(--color-grey-100)] bg-white text-ink hover:border-ink-faint',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

export default function FinancesPage() {
  const router = useRouter()
  const { session, updateFinances, interviewSteps } = useInterviewContext()
  const [step, setStep] = useState<FinanceStep>('priorities')
  const idx = STEPS.indexOf(step)

  function next() {
    if (idx < STEPS.length - 1) {
      setStep(STEPS[idx + 1])
    } else {
      router.push('/start/readiness')
    }
  }

  function canContinue() {
    switch (step) {
      case 'priorities': return session.finances.priorities.length > 0
      case 'worries': return session.finances.worries.length > 0
      case 'reflection': return true // always can continue
      case 'awareness': return session.finances.combined_awareness !== null
    }
  }

  return (
    <InterviewLayout currentStep="finances" steps={interviewSteps}>
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-2xl font-bold text-ink">Your finances</h1>
          <p className="mt-2 text-sm text-ink-secondary leading-relaxed">
            This isn&apos;t about exact numbers yet. It&apos;s about understanding what matters to you.
          </p>
        </div>

        {step === 'priorities' && (
          <div className="space-y-5">
            <p className="text-ink">What matters most to you financially? <span className="text-ink-tertiary">(Select all that apply)</span></p>
            <MultiSelect
              options={PRIORITY_OPTIONS}
              selected={session.finances.priorities}
              onChange={(v) => updateFinances({ priorities: v })}
            />
            {session.finances.priorities.includes('pension_protection') && (
              <Explainer label="Why pensions matter so much">
                <p>Pensions are often the largest single asset in a separation — sometimes worth more than the family home. Many people don&apos;t realise this until late in the process. We&apos;ll make sure this gets the attention it deserves.</p>
              </Explainer>
            )}
            {session.finances.priorities.includes('clean_break') && (
              <Explainer label="What a clean break means">
                <p>A clean break means neither of you can make financial claims against each other in the future. This is formalised through a consent order — and it&apos;s strongly recommended even when you agree on everything.</p>
              </Explainer>
            )}
          </div>
        )}

        {step === 'worries' && (
          <div className="space-y-5">
            <p className="text-ink">What worries you most? <span className="text-ink-tertiary">(Select all that apply)</span></p>
            <MultiSelect
              options={WORRY_OPTIONS}
              selected={session.finances.worries}
              onChange={(v) => updateFinances({ worries: v })}
            />
            {session.finances.worries.includes('hidden_assets') && (
              <Explainer label="How disclosure protects you">
                <p>The formal disclosure process requires both parties to declare everything under a legal oath. If information is deliberately hidden, there are serious consequences — including court orders and contempt proceedings. Having your side thoroughly prepared is the strongest protection.</p>
              </Explainer>
            )}
            {session.finances.worries.includes('not_enough') && (
              <MicroMoment>
                This is the most common financial worry during separation. Building a clear picture is the first step to understanding what&apos;s realistic.
              </MicroMoment>
            )}
            {session.finances.worries.includes('process_cost') && (
              <Explainer label="Keeping costs manageable">
                <p>The divorce application is £612. Mediation is subsidised with a £500 government voucher. This service is designed to reduce your dependence on expensive solicitor hours by helping you do the preparation yourself — structured and guided.</p>
              </Explainer>
            )}
            {!session.finances.worries.includes('hidden_assets') && !session.finances.worries.includes('not_enough') && !session.finances.worries.includes('process_cost') && (
              <MicroMoment>
                These are the most common financial worries during separation. You&apos;re not alone in feeling this.
              </MicroMoment>
            )}
          </div>
        )}

        {step === 'reflection' && (
          <div className="space-y-5">
            <p className="text-ink">Here&apos;s what we&apos;ve heard</p>
            <div className="space-y-3">
              {getFinancialReactions(session).map(reaction => (
                <div key={reaction.trigger} className="rounded-[var(--radius-md)] border border-[var(--color-grey-100)] p-5">
                  <p className="text-sm text-ink-secondary leading-relaxed">{reaction.message}</p>
                </div>
              ))}
              {getFinancialReactions(session).length === 0 && (
                <MicroMoment>
                  You&apos;ve captured the financial picture as you see it now. The next stage will help you build the detail.
                </MicroMoment>
              )}
            </div>
            <MicroMoment>
              We&apos;ll use this to tailor your plan and recommendations.
            </MicroMoment>
          </div>
        )}

        {step === 'awareness' && (
          <div className="space-y-5">
            <p className="text-ink">Are you broadly aware of your combined financial position?</p>
            <CardSelect
              options={AWARENESS_OPTIONS}
              value={session.finances.combined_awareness}
              onChange={(v) => updateFinances({ combined_awareness: v as typeof session.finances.combined_awareness })}
              columns={1}
            />
            {session.finances.combined_awareness === 'really_dont_know' && (
              <MicroMoment>
                Not knowing everything is normal. Building the picture is exactly what the next stage helps with.
              </MicroMoment>
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
