'use client'

import { useRouter } from 'next/navigation'
import { InterviewLayout } from '@/components/interview/interview-layout'
import { MicroMoment } from '@/components/interview/micro-moment'
import { Button } from '@/components/ui/button'
import { useInterviewContext } from '@/components/interview/interview-provider'
import { cn } from '@/utils/cn'
import { generateRecommendations, type Recommendation } from '@/lib/recommendations'
import type { ReadinessTier } from '@/types'
import type { InterviewSession } from '@/types/interview'

function calculateTier(session: InterviewSession): ReadinessTier {
  const confidence = session.confidence
  const confValues = Object.values(confidence).filter(v => v !== null)
  const knownOrEstimated = confValues.filter(v => v === 'known' || v === 'estimated').length
  const total = confValues.length

  const hasChildrenContent = session.children.current_arrangements !== null
  const hasHomeContent = session.home.desired_outcome !== null
  const hasFinancesContent = session.finances.priorities.length > 0
  const domainsWithContent = [hasChildrenContent, hasHomeContent, hasFinancesContent].filter(Boolean).length

  if (total >= 8 && knownOrEstimated >= 4 && domainsWithContent >= 2) return 'full'
  if (total >= 5 && domainsWithContent >= 1) return 'partial'
  if (total >= 1 || domainsWithContent >= 1) return 'thin'
  return 'not_ready'
}

function ConfidenceSummaryBar({ session }: { session: InterviewSession }) {
  const values = Object.values(session.confidence).filter(v => v !== null)
  const known = values.filter(v => v === 'known').length
  const estimated = values.filter(v => v === 'estimated').length
  const unsure = values.filter(v => v === 'unsure').length
  const unknown = values.filter(v => v === 'unknown').length
  const total = values.length || 1

  return (
    <div className="space-y-2">
      <div className="flex h-3 overflow-hidden rounded-full">
        {known > 0 && <div className="bg-sage" style={{ width: `${(known / total) * 100}%` }} />}
        {estimated > 0 && <div className="bg-amber" style={{ width: `${(estimated / total) * 100}%` }} />}
        {unsure > 0 && <div className="bg-soft" style={{ width: `${(unsure / total) * 100}%` }} />}
        {unknown > 0 && <div className="bg-cream-dark" style={{ width: `${(unknown / total) * 100}%` }} />}
      </div>
      <div className="flex gap-4 text-xs text-ink-light">
        {known > 0 && <span>{known} known</span>}
        {estimated > 0 && <span>{estimated} estimated</span>}
        {unsure > 0 && <span>{unsure} unsure</span>}
        {unknown > 0 && <span>{unknown} unknown</span>}
      </div>
    </div>
  )
}

function PlanSection({ title, confidence, children }: {
  title: string
  confidence?: 'strong' | 'mixed' | 'gaps'
  children: React.ReactNode
}) {
  const confLabel = {
    strong: { text: 'Strong', className: 'text-sage-dark bg-sage-light' },
    mixed: { text: 'Mixed', className: 'text-amber bg-amber-light' },
    gaps: { text: 'Gaps', className: 'text-ink-faint bg-cream-dark' },
  }

  return (
    <div className="rounded-[var(--radius-md)] border border-cream-dark p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-base font-medium text-ink">{title}</h3>
        {confidence && (
          <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', confLabel[confidence].className)}>
            {confLabel[confidence].text}
          </span>
        )}
      </div>
      <div className="mt-3 text-sm text-ink-light leading-relaxed">
        {children}
      </div>
    </div>
  )
}

export default function PlanPage() {
  const router = useRouter()
  const { session, hasChildren, hasProperty, hasSafeguardingConcerns } = useInterviewContext()

  const tier = calculateTier(session)
  const isMarried = session.situation.relationship_status === 'married' || session.situation.relationship_status === 'civil_partnership'

  // Determine children confidence
  const childConf = session.children.confidence === 'known' ? 'strong' : session.children.confidence === 'estimated' ? 'mixed' : 'gaps'
  // Determine home confidence
  const homeConf = session.home.value_confidence === 'known' || session.home.value_confidence === 'estimated' ? (session.home.mortgage_confidence === 'known' ? 'strong' : 'mixed') : 'gaps'
  // Determine finances confidence
  const finConf = session.finances.combined_awareness === 'pretty_clear' ? 'strong' : session.finances.combined_awareness === 'rough_idea' || session.finances.combined_awareness === 'know_my_side' ? 'mixed' : 'gaps'

  const tierMessages = {
    full: { heading: 'You\'ve built a strong starting position.', micro: 'Here\'s where you stand across each area.' },
    partial: { heading: 'You\'ve made real progress.', micro: 'Some areas are well-shaped. Others need more detail — and that\'s exactly what comes next.' },
    thin: { heading: 'You\'ve taken an important first step.', micro: 'Here\'s what you\'ve captured so far.' },
    not_ready: { heading: 'Understanding the process is a huge step forward.', micro: 'When you\'re ready to start shaping your plan, everything is here waiting for you.' },
  }

  return (
    <InterviewLayout step={7} totalSteps={8}>
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-2xl font-medium text-ink">Your plan</h1>
          <p className="mt-2 text-sm text-ink-light leading-relaxed">
            {tierMessages[tier].micro}
          </p>
        </div>

        <MicroMoment>{tierMessages[tier].heading}</MicroMoment>

        {/* Route summary — always shown */}
        <PlanSection title="Your route">
          {isMarried ? (
            <p>Your route involves three connected processes: the divorce itself, a financial settlement, and{hasChildren ? ' children\'s arrangements' : ' sorting out shared finances'}. The financial settlement is usually the most complex and important part.</p>
          ) : (
            <p>As cohabiting partners, you&apos;ll need to work out how to divide shared finances{hasProperty ? ' and property' : ''}{hasChildren ? ', and agree children\'s arrangements' : ''}.</p>
          )}
          {hasSafeguardingConcerns && (
            <p className="mt-2">Given your situation, some routes like mediation may not be appropriate. We&apos;ve adjusted our guidance accordingly.</p>
          )}
        </PlanSection>

        {/* Children — if applicable and answered */}
        {hasChildren && session.children.current_arrangements && tier !== 'not_ready' && (
          <PlanSection title="Children" confidence={childConf}>
            <p>
              Current arrangements: {session.children.current_arrangements === 'roughly_shared' ? 'roughly shared' : session.children.current_arrangements === 'with_me' ? 'mostly with you' : session.children.current_arrangements === 'with_partner' ? 'mostly with your partner' : 'other'}.
              {' '}You&apos;re aiming for {session.children.desired_arrangements === 'not_sure' ? 'something you\'re still working out' : session.children.desired_arrangements === 'roughly_equal' ? 'roughly equal time' : session.children.desired_arrangements === 'broadly_same' ? 'broadly the same as now' : 'a change in the balance'}.
            </p>
          </PlanSection>
        )}

        {/* Home — if applicable and answered */}
        {hasProperty && session.home.desired_outcome && tier !== 'not_ready' && (
          <PlanSection title="Housing" confidence={homeConf}>
            <p>
              You&apos;d like to {session.home.desired_outcome === 'sell_and_split' ? 'sell the property and split the proceeds' : session.home.desired_outcome === 'one_stays' ? 'have one person stay in the home' : 'work this out as the picture becomes clearer'}.
              {session.home.value_confidence === 'unknown' && ' The property value is currently unknown — getting an estimate or valuation is a clear next step.'}
            </p>
          </PlanSection>
        )}

        {/* Finances — if answered */}
        {session.finances.priorities.length > 0 && tier !== 'not_ready' && (
          <PlanSection title="Finances" confidence={finConf}>
            <p>
              What matters most to you: {session.finances.priorities.map(p => p.replace(/_/g, ' ')).join(', ')}.
              {session.finances.combined_awareness === 'really_dont_know' && ' You don\'t yet have a clear picture of the combined finances — building this is the strongest next step.'}
              {session.finances.combined_awareness === 'know_my_side' && ' You know your side but not your partner\'s — this is very common and something the next stage helps with.'}
            </p>
          </PlanSection>
        )}

        {/* Confidence map */}
        {tier !== 'not_ready' && (
          <div className="rounded-[var(--radius-md)] border border-cream-dark p-5">
            <h3 className="font-heading text-base font-medium text-ink">Your confidence map</h3>
            <div className="mt-4">
              <ConfidenceSummaryBar session={session} />
            </div>
            <p className="mt-3 text-sm text-ink-light leading-relaxed">
              This shows what you know and where the gaps are. The next stage helps you fill in the detail.
            </p>
          </div>
        )}

        {/* AI Recommendations — personalised, connected to service */}
        {tier !== 'not_ready' && (() => {
          const recs = generateRecommendations(session, hasSafeguardingConcerns)
          const highPriority = recs.filter(r => r.priority === 'high')
          const mediumPriority = recs.filter(r => r.priority === 'medium')

          return (
            <div className="space-y-5">
              <h2 className="font-heading text-lg font-medium text-ink">
                Our recommendations for you
              </h2>
              <p className="text-sm text-ink-light leading-relaxed">
                Based on everything you&apos;ve told us, here&apos;s what we&apos;d prioritise.
              </p>

              {highPriority.length > 0 && (
                <div className="space-y-3">
                  {highPriority.map(rec => (
                    <div key={rec.id} className="rounded-[var(--radius-md)] border border-warmth-light bg-warmth-light/20 p-5">
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 shrink-0 text-warmth">●</span>
                        <div>
                          <h3 className="text-sm font-medium text-ink">{rec.title}</h3>
                          <p className="mt-2 text-sm text-ink-light leading-relaxed">{rec.explanation}</p>
                          {rec.serviceDescription && (
                            <p className="mt-3 text-sm text-warmth-dark leading-relaxed">
                              <span className="font-medium">How we help:</span> {rec.serviceDescription}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {mediumPriority.length > 0 && (
                <div className="space-y-3">
                  {mediumPriority.map(rec => (
                    <div key={rec.id} className="rounded-[var(--radius-md)] border border-cream-dark p-5">
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 shrink-0 text-ink-faint">○</span>
                        <div>
                          <h3 className="text-sm font-medium text-ink">{rec.title}</h3>
                          <p className="mt-2 text-sm text-ink-light leading-relaxed">{rec.explanation}</p>
                          {rec.serviceDescription && (
                            <p className="mt-3 text-sm text-warmth-dark leading-relaxed">
                              <span className="font-medium">How we help:</span> {rec.serviceDescription}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })()}

        {/* Download PDF placeholder */}
        {tier !== 'not_ready' && (
          <button
            type="button"
            className="w-full rounded-[var(--radius-sm)] border border-cream-dark px-4 py-3 text-center text-sm text-ink-light transition-colors hover:bg-cream-dark"
          >
            Download your plan as PDF
          </button>
        )}

        <div className="flex items-center justify-between pt-4">
          <button type="button" onClick={() => router.back()} className="text-sm text-ink-light transition-colors hover:text-ink">Back</button>
          <Button onClick={() => router.push('/start/next-steps')}>
            See next steps
          </Button>
        </div>
      </div>
    </InterviewLayout>
  )
}
