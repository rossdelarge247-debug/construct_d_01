'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { InterviewLayout } from '@/components/interview/interview-layout'
import { CardSelect } from '@/components/interview/card-select'
import { MicroMoment } from '@/components/interview/micro-moment'
import { Button } from '@/components/ui/button'
import { useInterviewContext } from '@/components/interview/interview-provider'

const DESIRED_OPTIONS = [
  { value: 'sell_and_split', label: 'Sell and split the proceeds' },
  { value: 'one_stays', label: 'One of us stays in the home' },
  { value: 'not_sure', label: 'I\'m not sure yet' },
]

const VALUE_CONFIDENCE_OPTIONS = [
  { value: 'known', label: 'Known', description: 'I have a recent valuation' },
  { value: 'estimated', label: 'Estimated', description: 'I have a rough idea' },
  { value: 'unknown', label: 'Unknown', description: 'I don\'t know' },
]

const MORTGAGE_CONFIDENCE_OPTIONS = [
  { value: 'known', label: 'Known', description: 'I know the balance' },
  { value: 'estimated', label: 'Estimated', description: 'I have a rough idea' },
  { value: 'unknown', label: 'Unknown', description: 'I don\'t know' },
  { value: 'no_mortgage', label: 'No mortgage', description: 'The property is owned outright' },
]

type HomeStep = 'desired' | 'value' | 'mortgage'
const STEPS: HomeStep[] = ['desired', 'value', 'mortgage']

export default function HomePage() {
  const router = useRouter()
  const { session, updateHome, interviewSteps } = useInterviewContext()
  const [step, setStep] = useState<HomeStep>('desired')
  const idx = STEPS.indexOf(step)

  function next() {
    if (idx < STEPS.length - 1) {
      setStep(STEPS[idx + 1])
    } else {
      router.push('/start/finances')
    }
  }

  function canContinue() {
    switch (step) {
      case 'desired': return session.home.desired_outcome !== null
      case 'value': return session.home.value_confidence !== null
      case 'mortgage': return session.home.mortgage_confidence !== null
    }
  }

  return (
    <InterviewLayout currentStep="home" steps={interviewSteps}>
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-2xl font-bold text-ink">Your home</h1>
          <p className="mt-2 text-sm text-ink-light leading-relaxed">
            Let&apos;s think about what you&apos;d like to happen with the property.
          </p>
        </div>

        {step === 'desired' && (
          <div className="space-y-5">
            <p className="text-ink">What would you like to happen with the home?</p>
            <CardSelect
              options={DESIRED_OPTIONS}
              value={session.home.desired_outcome}
              onChange={(v) => updateHome({ desired_outcome: v as typeof session.home.desired_outcome })}
              columns={1}
            />
            {session.home.desired_outcome === 'not_sure' && (
              <MicroMoment>
                That&apos;s one of the most common answers. The financial picture will help clarify this.
              </MicroMoment>
            )}
          </div>
        )}

        {step === 'value' && (
          <div className="space-y-5">
            <p className="text-ink">How well do you know the property value?</p>
            <CardSelect
              options={VALUE_CONFIDENCE_OPTIONS}
              value={session.home.value_confidence}
              onChange={(v) => updateHome({ value_confidence: v as typeof session.home.value_confidence })}
            />
            <MicroMoment>
              A rough estimate is fine here. We can help you firm this up later.
            </MicroMoment>
          </div>
        )}

        {step === 'mortgage' && (
          <div className="space-y-5">
            <p className="text-ink">How well do you know the mortgage balance?</p>
            <CardSelect
              options={MORTGAGE_CONFIDENCE_OPTIONS}
              value={session.home.mortgage_confidence}
              onChange={(v) => updateHome({ mortgage_confidence: v as typeof session.home.mortgage_confidence })}
            />
          </div>
        )}

        <div className="flex items-center justify-between pt-4">
          {idx > 0 ? (
            <button type="button" onClick={() => setStep(STEPS[idx - 1])} className="text-sm text-ink-light transition-colors hover:text-ink">Back</button>
          ) : (
            <button type="button" onClick={() => router.back()} className="text-sm text-ink-light transition-colors hover:text-ink">Back</button>
          )}
          <Button onClick={next} disabled={!canContinue()}>Continue</Button>
        </div>
      </div>
    </InterviewLayout>
  )
}
