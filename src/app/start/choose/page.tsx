'use client'

import { useRouter } from 'next/navigation'
import { InterviewLayout } from '@/components/interview/interview-layout'
import { MicroMoment } from '@/components/interview/micro-moment'
import { Button } from '@/components/ui/button'
import { useInterviewContext } from '@/components/interview/interview-provider'

const TIERS = [
  {
    name: 'Prepare',
    price: '£49',
    description: 'Build your complete financial picture from bank data.',
    features: [
      'Secure Open Banking connection',
      'Automatic extraction',
      'Guided confirmation',
      'Full financial summary',
      'Spending analysis',
    ],
    highlighted: false,
  },
  {
    name: 'Share & Negotiate',
    price: '£99',
    badge: 'Most popular',
    description: 'Everything in Prepare, plus share and track proposals.',
    features: [
      'Everything in Prepare',
      'Invite partner or mediator',
      'Controlled access sharing',
      'Proposal tracking',
      'Mediation prep packs',
    ],
    highlighted: true,
  },
  {
    name: 'Finalise',
    price: '£149',
    description: 'Everything in Share, plus court-ready documentation.',
    features: [
      'Everything in Share',
      'Consent order prep',
      'D81 statement',
      'Disclosure pack',
      'Solicitor-ready output',
    ],
    highlighted: false,
  },
]

export default function ChoosePage() {
  const router = useRouter()
  const { interviewSteps } = useInterviewContext()

  return (
    <InterviewLayout currentStep="choose" steps={interviewSteps} showProgress={false}>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="font-heading text-2xl font-bold text-ink">
            Choose how to continue
          </h1>
          <p className="mt-3 text-[15px] text-ink-secondary leading-relaxed">
            Your free plan is yours to keep. When you&apos;re ready, choose the level of support that fits.
          </p>
        </div>

        <div className="space-y-4">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className="relative bg-white p-5"
              style={{
                borderRadius: 'var(--radius-card)',
                boxShadow: tier.highlighted ? '0 4px 24px rgba(0,0,0,0.12)' : 'var(--shadow-card)',
                border: tier.highlighted ? '2px solid var(--color-red-500)' : '1px solid var(--color-grey-100)',
              }}
            >
              {tier.badge && (
                <span
                  className="absolute -top-2.5 left-5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-white"
                  style={{ backgroundColor: 'var(--color-red-500)' }}
                >
                  {tier.badge}
                </span>
              )}

              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-heading text-[16px] font-bold text-ink">{tier.name}</h3>
                    <span className="text-[13px] font-semibold text-ink-tertiary">{tier.price}</span>
                  </div>
                  <p className="mt-1 text-[13px] text-ink-secondary">{tier.description}</p>
                  <ul className="mt-3 space-y-1">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-[13px] text-ink-secondary">
                        <span className="mt-0.5 text-[var(--color-green-600)]">&#10003;</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="shrink-0 pt-1">
                  <Button
                    variant={tier.highlighted ? 'primary' : 'secondary'}
                    size="sm"
                  >
                    Get started
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <MicroMoment>
          All prices are one-off, not subscriptions. You can upgrade at any time.
        </MicroMoment>

        {/* Free save option */}
        <div className="text-center pt-2" style={{ borderTop: '1px solid var(--color-grey-100)' }}>
          <p className="pt-5 text-[13px] text-ink-secondary">
            Not ready to decide?
          </p>
          <button
            onClick={() => router.push('/start/save')}
            className="mt-2 text-[13px] font-medium text-[#2563EB] underline transition-opacity hover:opacity-80"
          >
            Save your plan for free
          </button>
        </div>

        <div className="flex items-center justify-start pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm text-ink-secondary transition-colors hover:text-ink"
          >
            Back
          </button>
        </div>
      </div>
    </InterviewLayout>
  )
}
