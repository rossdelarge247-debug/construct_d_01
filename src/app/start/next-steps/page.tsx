'use client'

import { useRouter } from 'next/navigation'
import { InterviewLayout } from '@/components/interview/interview-layout'
import { MicroMoment } from '@/components/interview/micro-moment'
import { Button } from '@/components/ui/button'
import { useInterviewContext } from '@/components/interview/interview-provider'

export default function NextStepsPage() {
  const router = useRouter()
  const { session, hasChildren, hasProperty, hasSafeguardingConcerns } = useInterviewContext()

  // Build prioritised next steps based on what we know
  const steps: { title: string; why: string }[] = []

  // Pension early warning — always high priority if property owner
  const pensionUnknown = session.confidence.my_pension === 'unknown' || session.confidence.partner_pension === 'unknown'
  if (pensionUnknown) {
    steps.push({
      title: 'Request pension valuations (CETVs)',
      why: 'Pensions are often the largest asset in a settlement — sometimes worth more than the home. Getting valuations takes up to 3 months, so starting now means they\'re ready when you need them.',
    })
  }

  // Financial picture — the primary V2 bridge
  if (session.finances.combined_awareness !== 'pretty_clear') {
    steps.push({
      title: 'Build your full financial picture',
      why: 'Upload documents and we\'ll extract, organise, and structure everything automatically. This becomes the foundation for disclosure and negotiation.',
    })
  }

  // Property valuation
  if (hasProperty && (session.home.value_confidence === 'unknown' || session.home.value_confidence === 'unsure')) {
    steps.push({
      title: 'Get a property valuation or estimate',
      why: 'You\'ll need an accurate property value for any financial settlement. An estate agent can give you a free market appraisal.',
    })
  }

  // Children detail
  if (hasChildren && session.children.confidence !== 'known') {
    steps.push({
      title: 'Deepen your children\'s arrangements',
      why: 'The more detail you can think through — school terms, holidays, handovers — the stronger your position in any discussion.',
    })
  }

  // Safeguarding-specific
  if (hasSafeguardingConcerns) {
    steps.push({
      title: 'Speak to a specialist solicitor',
      why: 'Given your situation, getting professional legal advice is particularly important. Many solicitors offer a free initial consultation. Look for one experienced in domestic abuse cases.',
    })
  }

  // Mediation (only if not safeguarding)
  if (!hasSafeguardingConcerns) {
    steps.push({
      title: 'Consider mediation',
      why: 'A MIAM (Mediation Information and Assessment Meeting) is usually required before court. There\'s a government voucher worth up to £500 towards mediation costs.',
    })
  }

  return (
    <InterviewLayout step={8} totalSteps={8}>
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-2xl font-medium text-ink">Your next steps</h1>
          <p className="mt-2 text-sm text-ink-light leading-relaxed">
            Based on your plan, here&apos;s what matters most right now.
          </p>
        </div>

        <div className="space-y-4">
          {steps.map((step, i) => (
            <div key={i} className="rounded-[var(--radius-md)] border border-cream-dark p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-warmth-light text-xs font-medium text-warmth-dark">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm text-ink-light leading-relaxed">{step.why}</p>
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
