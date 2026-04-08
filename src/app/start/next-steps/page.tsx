'use client'

import { useRouter } from 'next/navigation'
import { InterviewLayout } from '@/components/interview/interview-layout'
import { MicroMoment } from '@/components/interview/micro-moment'
import { Button } from '@/components/ui/button'
import { useInterviewContext } from '@/components/interview/interview-provider'
import { generateRecommendations } from '@/lib/recommendations'

export default function NextStepsPage() {
  const router = useRouter()
  const { session, hasSafeguardingConcerns } = useInterviewContext()

  const recommendations = generateRecommendations(session, hasSafeguardingConcerns)
  // Show top 4 recommendations as next steps, ordered by priority
  const steps = recommendations.slice(0, 4)

  return (
    <InterviewLayout step={8} totalSteps={8}>
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-2xl font-medium text-ink">Your next steps</h1>
          <p className="mt-2 text-sm text-ink-light leading-relaxed">
            Based on your plan and what matters most to you, here&apos;s where to focus.
          </p>
        </div>

        <div className="space-y-4">
          {steps.map((step, i) => (
            <div key={step.id} className="rounded-[var(--radius-md)] border border-cream-dark p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-warmth-light text-xs font-medium text-warmth-dark">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm text-ink-light leading-relaxed">{step.explanation}</p>
                  {step.serviceDescription && (
                    <p className="mt-3 text-sm text-warmth-dark leading-relaxed">
                      <span className="font-medium">How we help:</span> {step.serviceDescription}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <MicroMoment>
          You now have a clearer picture than most people at this stage.
        </MicroMoment>

        <div className="flex items-center justify-between pt-4">
          <button type="button" onClick={() => router.back()} className="text-sm text-ink-light transition-colors hover:text-ink">Back</button>
          <Button onClick={() => router.push('/start/next')}>
            What comes next
          </Button>
        </div>
      </div>
    </InterviewLayout>
  )
}
