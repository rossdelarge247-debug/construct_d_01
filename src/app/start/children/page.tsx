'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { InterviewLayout } from '@/components/interview/interview-layout'
import { CardSelect } from '@/components/interview/card-select'
import { MicroMoment } from '@/components/interview/micro-moment'
import { Button } from '@/components/ui/button'
import { useInterviewContext } from '@/components/interview/interview-provider'

const CURRENT_OPTIONS = [
  { value: 'with_me', label: 'Mostly with me' },
  { value: 'with_partner', label: 'Mostly with my partner' },
  { value: 'roughly_shared', label: 'Roughly shared' },
  { value: 'other', label: 'Other / it varies' },
]

const DESIRED_OPTIONS = [
  { value: 'broadly_same', label: 'Broadly the same as now' },
  { value: 'more_with_me', label: 'More time with me' },
  { value: 'more_with_partner', label: 'More time with my partner' },
  { value: 'roughly_equal', label: 'Roughly equal' },
  { value: 'not_sure', label: 'I\'m not sure yet' },
]

const CONFIDENCE_OPTIONS = [
  { value: 'known', label: 'I have a clear idea', description: 'I know what I\'d like the arrangements to be' },
  { value: 'estimated', label: 'I have a rough idea', description: 'I know roughly, but the detail isn\'t clear yet' },
  { value: 'unsure', label: 'I\'m still working it out', description: 'I need to think about this more' },
]

type ChildStep = 'current' | 'desired' | 'confidence'
const STEPS: ChildStep[] = ['current', 'desired', 'confidence']

export default function ChildrenPage() {
  const router = useRouter()
  const { session, updateChildren, hasProperty, interviewSteps } = useInterviewContext()
  const [step, setStep] = useState<ChildStep>('current')
  const idx = STEPS.indexOf(step)

  function next() {
    if (idx < STEPS.length - 1) {
      setStep(STEPS[idx + 1])
    } else {
      router.push(hasProperty ? '/start/home' : '/start/finances')
    }
  }

  function canContinue() {
    switch (step) {
      case 'current': return session.children.current_arrangements !== null
      case 'desired': return session.children.desired_arrangements !== null
      case 'confidence': return session.children.confidence !== null
    }
  }

  return (
    <InterviewLayout currentStep="children" steps={interviewSteps}>
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-2xl font-bold text-ink">Your children</h1>
          <p className="mt-2 text-sm text-ink-secondary leading-relaxed">
            Let&apos;s think about what arrangements might work best for your children.
          </p>
        </div>

        {step === 'current' && (
          <div className="space-y-5">
            <p className="text-ink">What are the current day-to-day arrangements?</p>
            <CardSelect
              options={CURRENT_OPTIONS}
              value={session.children.current_arrangements}
              onChange={(v) => updateChildren({ current_arrangements: v as typeof session.children.current_arrangements })}
              columns={1}
            />
          </div>
        )}

        {step === 'desired' && (
          <div className="space-y-5">
            <p className="text-ink">What would you like the arrangements to look like?</p>
            <CardSelect
              options={DESIRED_OPTIONS}
              value={session.children.desired_arrangements}
              onChange={(v) => updateChildren({ desired_arrangements: v as typeof session.children.desired_arrangements })}
              columns={1}
            />
            {session.children.desired_arrangements === 'not_sure' && (
              <MicroMoment>
                That&apos;s completely fine. Most parents find this becomes clearer over time.
              </MicroMoment>
            )}
          </div>
        )}

        {step === 'confidence' && (
          <div className="space-y-5">
            <p className="text-ink">How sure are you about what you&apos;d want for the children?</p>
            <CardSelect
              options={CONFIDENCE_OPTIONS}
              value={session.children.confidence}
              onChange={(v) => updateChildren({ confidence: v as typeof session.children.confidence })}
              columns={1}
            />
            <MicroMoment>
              It&apos;s clear your children matter to you. You&apos;ve shaped a thoughtful starting position.
            </MicroMoment>
          </div>
        )}

        <div className="flex items-center justify-between pt-4">
          {idx > 0 ? (
            <button type="button" onClick={() => setStep(STEPS[idx - 1])} className="text-sm text-ink-secondary transition-colors hover:text-ink">Back</button>
          ) : (
            <button type="button" onClick={() => router.push('/start/route')} className="text-sm text-ink-secondary transition-colors hover:text-ink">Back</button>
          )}
          <Button onClick={next} disabled={!canContinue()}>Continue</Button>
        </div>
      </div>
    </InterviewLayout>
  )
}
