'use client'

import { useRouter } from 'next/navigation'
import { InterviewLayout } from '@/components/interview/interview-layout'
import { Explainer } from '@/components/interview/explainer'
import { MicroMoment } from '@/components/interview/micro-moment'
import { Button } from '@/components/ui/button'
import { useInterviewContext } from '@/components/interview/interview-provider'
import { cn } from '@/utils/cn'

interface PathwayStage {
  number: number
  title: string
  detail: string
}

export default function PathwayPage() {
  const router = useRouter()
  const { session, hasChildren, hasProperty, hasSafeguardingConcerns, interviewSteps } = useInterviewContext()

  const isMarried = session.situation.relationship_status === 'married' || session.situation.relationship_status === 'civil_partnership'
  const isCohabiting = session.situation.relationship_status === 'cohabiting'

  function getNextStep() {
    if (hasChildren) return '/start/children'
    if (hasProperty) return '/start/home'
    return '/start/finances'
  }

  // Build personalised pathway stages
  const stages: PathwayStage[] = []

  if (isMarried) {
    stages.push({
      number: stages.length + 1,
      title: 'Divorce application',
      detail: 'Apply online · Minimum 26 weeks · £612',
    })
  }

  stages.push({
    number: stages.length + 1,
    title: 'Financial settlement',
    detail: hasProperty
      ? 'Build picture · Property · Pensions · Disclose · Negotiate'
      : 'Build picture · Disclose · Negotiate · Agree',
  })

  if (hasChildren) {
    stages.push({
      number: stages.length + 1,
      title: 'Children\'s arrangements',
      detail: 'Shape plan · Agree or mediate · Formalise',
    })
  }

  if (isMarried) {
    stages.push({
      number: stages.length + 1,
      title: 'Consent order',
      detail: 'Makes your agreement legally binding',
    })
  }

  return (
    <InterviewLayout currentStep="route" steps={interviewSteps}>
      <div className="space-y-8">
        {/* Waypoint header */}
        <div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rotate-45 bg-warmth" />
            <span className="text-xs font-medium uppercase tracking-wide text-warmth-dark">Your pathway</span>
          </div>
          <h1 className="mt-3 font-heading text-2xl font-medium text-ink">
            {isCohabiting
              ? 'Here\'s what your separation is likely to involve.'
              : 'Here\'s what your separation journey looks like.'}
          </h1>
        </div>

        {/* Visual journey diagram */}
        <div className="rounded-[var(--radius-md)] border border-cream-dark bg-cream-dark/20 p-6">
          <div className="space-y-0">
            {stages.map((stage, i) => (
              <div key={i} className="flex gap-4">
                {/* Vertical line + number */}
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-warmth text-sm font-medium text-cream">
                    {stage.number}
                  </div>
                  {i < stages.length - 1 && (
                    <div className="w-px flex-1 bg-cream-dark my-1" style={{ minHeight: '24px' }} />
                  )}
                </div>
                {/* Content */}
                <div className="pb-6">
                  <p className="text-sm font-medium text-ink">{stage.title}</p>
                  <p className="mt-1 text-xs text-ink-light">{stage.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Critical warning — consent order */}
        {isMarried && (
          <div className="rounded-[var(--radius-md)] border border-warmth-light bg-warmth-light/30 p-4">
            <p className="text-sm text-ink">
              <span className="font-medium">Important:</span> Getting divorced does not end financial claims. Without a consent order, your ex-partner could claim against your assets years later.
            </p>
          </div>
        )}

        {/* Cohabiting rights note */}
        {isCohabiting && (
          <div className="rounded-[var(--radius-md)] border border-warmth-light bg-warmth-light/30 p-4">
            <p className="text-sm text-ink">
              <span className="font-medium">Important:</span> Cohabiting partners have different legal rights from married couples. There is no &quot;common law marriage&quot; in England and Wales. Your rights depend more on ownership and financial contributions.
            </p>
          </div>
        )}

        {/* Progressive disclosure */}
        {!hasSafeguardingConcerns ? (
          <div className="space-y-3">
            <Explainer label="What about mediation?">
              <div className="space-y-2">
                <p>A MIAM (information meeting) is usually required before court. It&apos;s not mediation itself — it&apos;s a one-off session where a mediator explains your options.</p>
                <p>There&apos;s a £500 government voucher towards mediation costs, available regardless of income.</p>
              </div>
            </Explainer>
            <Explainer label="Do I need a solicitor?">
              <div className="space-y-2">
                <p>The divorce application is straightforward to do yourself. For the financial settlement, legal advice is strongly recommended — especially around pensions and property.</p>
                <p>Look for a Resolution-accredited solicitor. Many offer a free initial consultation.</p>
              </div>
            </Explainer>
            {hasProperty && (
              <Explainer label="Start now: request pension valuations">
                <div className="space-y-2">
                  <p>Pensions are often the largest asset — sometimes worth more than the home. Getting a valuation (CETV) takes up to 3 months. Starting now means it&apos;s ready when you need it.</p>
                  <p>Contact your pension provider directly. It&apos;s free.</p>
                </div>
              </Explainer>
            )}
          </div>
        ) : (
          <div className="rounded-[var(--radius-md)] border border-warmth-light bg-warmth-light/30 p-4 space-y-2">
            <p className="text-sm font-medium text-ink">About mediation and your situation</p>
            <p className="text-sm text-ink-light">Mediation isn&apos;t always appropriate. You may be exempt from the usual MIAM requirement. Speaking to a solicitor who understands domestic abuse is an important first step.</p>
          </div>
        )}

        {/* Waypoint celebration + bridge to act 2 */}
        <div className="border-t border-cream-dark pt-6 space-y-4">
          <MicroMoment>
            You now have a clearer picture of the process than most people at this stage.
          </MicroMoment>

          <div>
            <p className="text-sm text-ink leading-relaxed">
              Next, let&apos;s build the detail behind this pathway — your finances, your priorities, and how ready you are. This becomes your personalised plan.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => router.push('/start/situation')}
              className="text-sm text-ink-light transition-colors hover:text-ink"
            >
              Back
            </button>
            <div className="text-right">
              <Button onClick={() => router.push(getNextStep())}>
                Build my full plan
              </Button>
              <p className="mt-2 text-xs text-ink-faint">About 7 more minutes</p>
            </div>
          </div>
        </div>
      </div>
    </InterviewLayout>
  )
}
