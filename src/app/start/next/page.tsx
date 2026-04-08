'use client'

import { useRouter } from 'next/navigation'
import { InterviewLayout } from '@/components/interview/interview-layout'
import { Button } from '@/components/ui/button'
import { useInterviewContext } from '@/components/interview/interview-provider'
import { cn } from '@/utils/cn'

const SERVICE_PHASES = [
  {
    title: 'Build the full picture',
    description: 'Upload documents and we\'ll extract, organise, and structure your finances automatically. Deepen family arrangements. Link evidence to everything.',
    included: 'standard',
  },
  {
    title: 'Prepare for disclosure',
    description: 'Turn your full picture into structured, Form E-ready disclosure. Resolve open questions. Link evidence to every claim.',
    included: 'standard',
  },
  {
    title: 'Share and negotiate',
    description: 'Invite your partner, mediator, or solicitor. Track proposals, counter-proposals, and mediation progress. Control exactly what they see.',
    included: 'standard',
  },
  {
    title: 'Reach agreement',
    description: 'Resolve open points. Capture the final agreed position. Get ready for formalisation.',
    included: 'standard',
  },
  {
    title: 'Prepare court documents',
    description: 'Generate draft consent orders, disclosure packs, and adviser-ready bundles directly from your structured case record.',
    included: 'enhanced',
  },
]

export default function WhatComesNextPage() {
  const router = useRouter()
  const { hasSafeguardingConcerns } = useInterviewContext()

  return (
    <InterviewLayout showProgress={false}>
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-2xl font-medium text-ink">
            Make your plan real
          </h1>
          <p className="mt-2 text-sm text-ink-light leading-relaxed">
            You&apos;ve shaped a starting position. Here&apos;s how the service helps you from here.
          </p>
        </div>

        {/* Service phases */}
        <div className="space-y-3">
          {SERVICE_PHASES.map((phase, i) => {
            // Hide "Share and negotiate" if safeguarding concerns
            if (hasSafeguardingConcerns && phase.title === 'Share and negotiate') return null

            return (
              <div key={i} className="rounded-[var(--radius-md)] border border-cream-dark p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-medium text-ink">{phase.title}</h3>
                    <p className="mt-2 text-sm text-ink-light leading-relaxed">{phase.description}</p>
                  </div>
                  {phase.included === 'enhanced' && (
                    <span className="shrink-0 rounded-full bg-depth-light px-2.5 py-0.5 text-xs font-medium text-depth">
                      Enhanced
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Tier selection */}
        <div>
          <h2 className="font-heading text-lg font-medium text-ink">Choose how to continue</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className={cn(
              'rounded-[var(--radius-md)] border-2 border-cream-dark p-6',
            )}>
              <h3 className="font-heading text-base font-medium text-ink">Standard</h3>
              <p className="mt-2 text-sm text-ink-light leading-relaxed">
                Build your financial picture, prepare disclosure, share and negotiate, reach agreement.
              </p>
              <p className="mt-4 text-sm text-ink-faint">Pricing coming soon</p>
              <Button variant="secondary" className="mt-4 w-full">Coming soon</Button>
            </div>

            <div className={cn(
              'rounded-[var(--radius-md)] border-2 border-depth-light p-6',
            )}>
              <h3 className="font-heading text-base font-medium text-ink">Enhanced</h3>
              <p className="mt-2 text-sm text-ink-light leading-relaxed">
                Everything in Standard, plus draft court documents and additional support.
              </p>
              <p className="mt-4 text-sm text-ink-faint">Pricing coming soon</p>
              <Button variant="secondary" className="mt-4 w-full">Coming soon</Button>
            </div>
          </div>
        </div>

        <p className="text-sm text-ink-light leading-relaxed">
          You can upgrade from Standard to Enhanced at any time.
        </p>

        {/* Free save option */}
        <div className="border-t border-cream-dark pt-6">
          <p className="text-sm text-ink-light leading-relaxed">
            Not ready to decide? Save your workspace for free and explore when you&apos;re ready.
          </p>
          <Button
            variant="ghost"
            className="mt-3"
            onClick={() => router.push('/start/save')}
          >
            Save workspace free
          </Button>
        </div>
      </div>
    </InterviewLayout>
  )
}
