'use client'

import { useRouter } from 'next/navigation'
import { InterviewLayout } from '@/components/interview/interview-layout'
import { MicroMoment } from '@/components/interview/micro-moment'
import { Button } from '@/components/ui/button'
import { useInterviewContext } from '@/components/interview/interview-provider'
import { generateRecommendations } from '@/lib/recommendations'
import { cn } from '@/utils/cn'

export default function NextStepsPage() {
  const router = useRouter()
  const { session, hasChildren, hasProperty, hasSafeguardingConcerns, interviewSteps } = useInterviewContext()

  const recommendations = generateRecommendations(session, hasSafeguardingConcerns)
  const isMarried = session.situation.relationship_status === 'married' || session.situation.relationship_status === 'civil_partnership'

  // Build the journey phases personalised to their situation
  const journeyPhases: { title: string; description: string; userContext: string; howWeHelp: string; active: boolean }[] = []

  // Phase 1: Build your picture — always
  const unknownCount = Object.values(session.confidence).filter(v => v === 'unknown').length
  const estimatedCount = Object.values(session.confidence).filter(v => v === 'estimated').length
  journeyPhases.push({
    title: 'Build your full picture',
    description: 'Bring together everything about your finances, property, pensions, and' + (hasChildren ? ' children\'s arrangements' : ' commitments') + '.',
    userContext: unknownCount > 0
      ? `You have ${unknownCount} unknown area${unknownCount > 1 ? 's' : ''}${estimatedCount > 0 ? ` and ${estimatedCount} estimate${estimatedCount > 1 ? 's' : ''} to confirm` : ''}. This is where you fill those gaps — upload documents and we extract and organise everything automatically, or add information manually.`
      : 'You have a good foundation. This stage helps you add the detail and evidence that makes your position stronger.',
    howWeHelp: 'Upload documents and we\'ll automatically extract, classify, and structure your financial information. Review and confirm — we do the heavy lifting. No spreadsheets, no chasing through paperwork.',
    active: true,
  })

  // Phase 2: Prepare for disclosure — if married/CP
  if (isMarried) {
    journeyPhases.push({
      title: 'Prepare for disclosure',
      description: 'Structure your financial picture into disclosure-ready format.',
      userContext: session.finances.worries.includes('hidden_assets')
        ? 'You mentioned concerns about hidden assets. The formal disclosure process requires both parties to declare everything under oath. Having your side thoroughly prepared puts you in the strongest position.'
        : 'Both parties need to share a full financial picture. We help you structure yours into a Form E-equivalent that\'s clear, complete, and evidence-backed.',
      howWeHelp: 'We turn your financial picture into structured disclosure — every item linked to evidence, every gap clearly flagged. No more wrestling with 28-page forms.',
      active: false,
    })
  }

  // Phase 3: Share and negotiate — if not safeguarding
  if (!hasSafeguardingConcerns) {
    journeyPhases.push({
      title: 'Share and negotiate',
      description: 'Exchange information, discuss proposals, and track what\'s agreed.',
      userContext: session.situation.relationship_quality === 'amicable'
        ? 'Since your relationship is amicable, you may be able to reach agreement through mediation or direct discussion. This stage keeps everything structured and tracked.'
        : 'Negotiation can feel messy — proposals, counter-proposals, mediation sessions. This stage keeps a clear record of what was discussed, what changed, and what\'s agreed.',
      howWeHelp: 'Invite your partner, mediator, or solicitor with controlled access. Track proposals and counter-proposals. After each mediation session, upload notes and we\'ll extract what changed and update your position automatically.',
      active: false,
    })
  }

  // Phase 4: Reach agreement — always
  journeyPhases.push({
    title: 'Reach agreement',
    description: 'Resolve remaining points and capture the final agreed position.',
    userContext: session.finances.priorities.includes('clean_break')
      ? 'You want a clean break — meaning no future financial claims from either side. This stage helps you capture a complete agreement that a solicitor can turn into a consent order.'
      : 'The goal is a clear, complete agreement that both parties accept. This stage tracks what\'s resolved and what still needs discussion.',
    howWeHelp: 'See exactly what\'s agreed, what\'s disputed, and what\'s left. Generate a structured summary for your solicitor or mediator.',
    active: false,
  })

  // Phase 5: Make it official — always for married
  if (isMarried) {
    journeyPhases.push({
      title: 'Make it official',
      description: 'Prepare the documents needed to formalise your agreement through the court.',
      userContext: 'A consent order makes your agreement legally binding. Without one, either party can make financial claims in the future — even years later. This stage helps you prepare everything needed.',
      howWeHelp: 'Generate structured information for a draft consent order, D81 statement, and disclosure pack. Reduce solicitor costs by arriving with everything prepared and organised.',
      active: false,
    })
  }

  // Top immediate actions from recommendations
  const immediateActions = recommendations.filter(r => r.priority === 'high').slice(0, 2)

  return (
    <InterviewLayout currentStep="next" steps={interviewSteps}>
      <div className="space-y-10">
        <div>
          <h1 className="font-heading text-2xl font-bold text-ink">
            Your road ahead
          </h1>
          <p className="mt-2 text-sm text-ink-light leading-relaxed">
            Here&apos;s the journey from where you are now to a settled, formalised agreement. Every step is designed to reduce the complexity and make the process manageable.
          </p>
        </div>

        {/* Immediate actions — high priority, time-sensitive */}
        {immediateActions.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-heading text-lg font-semibold text-ink">Start with these</h2>
            {immediateActions.map(action => (
              <div key={action.id} className="rounded-[var(--radius-md)] border border-warmth-light bg-warmth-light/20 p-5">
                <h3 className="text-sm font-medium text-ink">{action.title}</h3>
                <p className="mt-2 text-sm text-ink-light leading-relaxed">{action.explanation}</p>
              </div>
            ))}
          </div>
        )}

        {/* The journey — personalised phases with service value */}
        <div className="space-y-4">
          <h2 className="font-heading text-lg font-semibold text-ink">How the service helps at every step</h2>
          <p className="text-sm text-ink-light leading-relaxed">
            Each stage builds on the last. You&apos;re never starting from scratch.
          </p>

          {journeyPhases.map((phase, i) => (
            <div
              key={i}
              className={cn(
                'rounded-[var(--radius-md)] border p-5',
                phase.active ? 'border-warmth bg-warmth-light/10' : 'border-cream-dark',
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium',
                  phase.active ? 'bg-warmth text-cream' : 'bg-cream-dark text-ink-faint',
                )}>
                  {i + 1}
                </div>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium text-ink">
                      {phase.title}
                      {phase.active && <span className="ml-2 text-xs text-warmth">Your next step</span>}
                    </h3>
                    <p className="mt-1 text-sm text-ink-light leading-relaxed">{phase.description}</p>
                  </div>

                  {/* Personalised context — what this means for THEM */}
                  <p className="text-sm text-ink-light leading-relaxed">
                    {phase.userContext}
                  </p>

                  {/* How we help — the service value */}
                  <div className="rounded-[var(--radius-sm)] bg-cream-dark/50 p-3">
                    <p className="text-sm text-ink leading-relaxed">
                      <span className="font-medium text-warmth-dark">How we help: </span>
                      {phase.howWeHelp}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <MicroMoment>
          You don&apos;t have to face any of this alone. Every step is guided, structured, and designed to make the hard parts lighter.
        </MicroMoment>

        {/* Tier selection */}
        <div className="space-y-4">
          <h2 className="font-heading text-lg font-semibold text-ink">Choose how to continue</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[var(--radius-md)] border-2 border-cream-dark p-6">
              <h3 className="font-heading text-base font-semibold text-ink">Standard</h3>
              <p className="mt-2 text-sm text-ink-light leading-relaxed">
                Build your picture, prepare disclosure, share and negotiate, reach agreement.
              </p>
              <p className="mt-4 text-sm text-ink-faint">Pricing coming soon</p>
              <Button variant="secondary" className="mt-4 w-full">Coming soon</Button>
            </div>
            <div className="rounded-[var(--radius-md)] border-2 border-depth-light p-6">
              <h3 className="font-heading text-base font-semibold text-ink">Enhanced</h3>
              <p className="mt-2 text-sm text-ink-light leading-relaxed">
                Everything in Standard, plus court document preparation and additional support.
              </p>
              <p className="mt-4 text-sm text-ink-faint">Pricing coming soon</p>
              <Button variant="secondary" className="mt-4 w-full">Coming soon</Button>
            </div>
          </div>
          <p className="text-sm text-ink-light">
            You can upgrade from Standard to Enhanced at any time.
          </p>
        </div>

        {/* Free save */}
        <div className="border-t border-cream-dark pt-6">
          <p className="text-sm text-ink-light leading-relaxed">
            Not ready to decide? Save your workspace for free and come back when you&apos;re ready.
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
