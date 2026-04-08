'use client'

import { useRouter } from 'next/navigation'
import { InterviewLayout } from '@/components/interview/interview-layout'
import { Explainer } from '@/components/interview/explainer'
import { MicroMoment } from '@/components/interview/micro-moment'
import { Button } from '@/components/ui/button'
import { useInterviewContext } from '@/components/interview/interview-provider'

export default function RoutePage() {
  const router = useRouter()
  const { session, hasChildren, hasProperty, hasSafeguardingConcerns } = useInterviewContext()

  const isMarriedOrCP = session.situation.relationship_status === 'married' || session.situation.relationship_status === 'civil_partnership'
  const isCohabiting = session.situation.relationship_status === 'cohabiting'

  function getNextStep() {
    if (hasChildren) return '/start/children'
    if (hasProperty) return '/start/home'
    return '/start/finances'
  }

  return (
    <InterviewLayout step={2} totalSteps={8}>
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-2xl font-medium text-ink">
            Your likely route
          </h1>
          <p className="mt-2 text-sm text-ink-light leading-relaxed">
            Based on what you&apos;ve told us, here&apos;s what the process is likely to involve.
          </p>
        </div>

        {/* The three-process explanation — the key clarity moment */}
        <div className="rounded-[var(--radius-md)] border border-cream-dark bg-cream-dark/30 p-6">
          <h2 className="font-heading text-lg font-medium text-ink">
            One important thing to know first
          </h2>
          <p className="mt-3 text-sm text-ink-light leading-relaxed">
            {isMarriedOrCP
              ? 'Separation actually involves three connected but separate processes. Most people don\'t realise this at the start.'
              : 'Separation involves several things to sort out. Here\'s what applies to your situation.'}
          </p>

          <div className="mt-5 space-y-4">
            {isMarriedOrCP && (
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-warmth-light text-sm font-medium text-warmth-dark">1</div>
                <div>
                  <p className="text-sm font-medium text-ink">The divorce itself</p>
                  <p className="mt-1 text-sm text-ink-light leading-relaxed">
                    The legal process of ending the marriage. This is the simplest part — you apply online, and it takes a minimum of 26 weeks.
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-warmth-light text-sm font-medium text-warmth-dark">
                {isMarriedOrCP ? '2' : '1'}
              </div>
              <div>
                <p className="text-sm font-medium text-ink">Money and property</p>
                <p className="mt-1 text-sm text-ink-light leading-relaxed">
                  {isMarriedOrCP
                    ? 'Dividing finances, property, pensions, and debts. This is usually the most complex part. It requires financial disclosure and results in a consent order or court order.'
                    : 'Working out how to divide finances, property, and shared commitments. As cohabiting partners, the legal framework is different from married couples — your rights depend more on ownership and contributions.'}
                </p>
              </div>
            </div>

            {hasChildren && (
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-warmth-light text-sm font-medium text-warmth-dark">
                  {isMarriedOrCP ? '3' : '2'}
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">Children&apos;s arrangements</p>
                  <p className="mt-1 text-sm text-ink-light leading-relaxed">
                    Deciding where children live, how they spend time with each parent, and practical matters like schooling and holidays.
                  </p>
                </div>
              </div>
            )}
          </div>

          {isMarriedOrCP && (
            <div className="mt-5 rounded-[var(--radius-sm)] border border-warmth-light bg-warmth-light/30 p-4">
              <p className="text-sm text-ink leading-relaxed">
                <span className="font-medium">Important:</span> Getting divorced does not automatically sort out your finances. Without a financial order, your ex-partner could make a financial claim against you even years after the divorce is finalised.
              </p>
            </div>
          )}
        </div>

        {/* What happens in practice */}
        <div className="space-y-4">
          <h2 className="font-heading text-lg font-medium text-ink">
            What this means in practice
          </h2>

          {isMarriedOrCP && (
            <p className="text-sm text-ink-light leading-relaxed">
              {session.situation.process_status === 'not_yet'
                ? 'You haven\'t started the formal process yet, which means you have time to prepare. The smartest first step is usually to get a clear picture of your financial situation before filing anything.'
                : session.situation.process_status === 'discussed'
                  ? 'You\'ve started discussing separation, which is an important step. The next priorities are usually getting clear on your financial picture and understanding whether mediation might work for you.'
                  : 'Your process is already underway. This service can help you organise your financial picture, prepare for disclosure, and track how things develop.'}
            </p>
          )}

          {isCohabiting && (
            <p className="text-sm text-ink-light leading-relaxed">
              As cohabiting partners, there&apos;s no formal &quot;divorce&quot; process, but you still need to work out how to divide shared finances and property. If you own property together, this is particularly important to get right.
            </p>
          )}
        </div>

        {/* Mediation / MIAM section — adapted for safeguarding */}
        {!hasSafeguardingConcerns ? (
          <div className="space-y-3">
            <Explainer label="What about mediation?">
              <div className="space-y-3">
                <p>Mediation is where a trained, neutral person helps you and your partner reach agreements. It&apos;s usually much cheaper and faster than going to court.</p>
                <p>Before applying to court for most family matters, you&apos;re usually required to attend a MIAM — a Mediation Information and Assessment Meeting. This is a one-off session where a mediator explains your options. It&apos;s not mediation itself.</p>
                <p>There&apos;s a government voucher worth up to £500 towards mediation costs, available regardless of your income.</p>
              </div>
            </Explainer>

            <Explainer label="Do I need a solicitor?">
              <div className="space-y-3">
                <p>It depends on your situation. Many people manage the divorce application themselves (it&apos;s straightforward online). But for the financial settlement, getting legal advice is strongly recommended — especially around pensions and property.</p>
                <p>A good starting point is a free initial consultation with a family solicitor. Look for one who is a member of Resolution, an organisation committed to a non-confrontational approach.</p>
              </div>
            </Explainer>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-[var(--radius-md)] border border-warmth-light bg-warmth-light/30 p-5">
              <p className="text-sm font-medium text-ink">A note about mediation and your situation</p>
              <p className="mt-2 text-sm text-ink-light leading-relaxed">
                Mediation isn&apos;t always appropriate. If you have safety concerns, you may be exempt from the usual requirement to attend a mediation meeting (MIAM) before going to court. There are specific exemptions for domestic abuse.
              </p>
              <p className="mt-2 text-sm text-ink-light leading-relaxed">
                Speaking to a solicitor who understands domestic abuse is an important step. Many offer free initial consultations.
              </p>
            </div>
          </div>
        )}

        {/* Pension early warning */}
        {hasProperty && (
          <Explainer label="Something to start now: pension valuations">
            <div className="space-y-3">
              <p>Pensions are often one of the largest assets in a settlement — sometimes worth more than the family home. Many people don&apos;t realise this until late in the process.</p>
              <p>Getting a pension valuation (called a CETV — Cash Equivalent Transfer Value) from your pension provider takes up to 3 months. Starting this early means the information is ready when you need it.</p>
              <p>You can request a CETV by contacting your pension provider directly. It&apos;s free.</p>
            </div>
          </Explainer>
        )}

        <MicroMoment>
          Most people find that just seeing the shape of the process makes it feel more manageable.
        </MicroMoment>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={() => router.push('/start/situation')}
            className="text-sm text-ink-light transition-colors hover:text-ink"
          >
            Back
          </button>
          <Button onClick={() => router.push(getNextStep())}>
            Continue
          </Button>
        </div>
      </div>
    </InterviewLayout>
  )
}
