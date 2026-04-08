'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { InterviewLayout } from '@/components/interview/interview-layout'
import { MicroMoment } from '@/components/interview/micro-moment'
import { Explainer } from '@/components/interview/explainer'
import { Button } from '@/components/ui/button'
import { useInterviewContext } from '@/components/interview/interview-provider'
import { cn } from '@/utils/cn'
import { generateRecommendations } from '@/lib/recommendations'
import type { ReadinessTier } from '@/types'
import type { InterviewSession } from '@/types/interview'
import type { AIPlanNarrative } from '@/lib/ai/plan-narrative'

function calculateTier(session: InterviewSession): ReadinessTier {
  const confValues = Object.values(session.confidence).filter(v => v !== null)
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
        {known > 0 && <div className="bg-sage transition-all duration-500" style={{ width: `${(known / total) * 100}%` }} />}
        {estimated > 0 && <div className="bg-amber transition-all duration-500" style={{ width: `${(estimated / total) * 100}%` }} />}
        {unsure > 0 && <div className="bg-soft transition-all duration-500" style={{ width: `${(unsure / total) * 100}%` }} />}
        {unknown > 0 && <div className="bg-cream-dark transition-all duration-500" style={{ width: `${(unknown / total) * 100}%` }} />}
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

// Better confidence labels
const CONF_LABELS = {
  strong: { text: 'Strong', className: 'text-sage-dark bg-sage-light' },
  some_gaps: { text: 'Some gaps', className: 'text-amber bg-amber-light' },
  needs_detail: { text: 'Needs detail', className: 'text-ink-faint bg-cream-dark' },
}

function PlanSection({ title, confidence, aiContent, templateContent, loading, tasks, children }: {
  title: string
  confidence?: 'strong' | 'some_gaps' | 'needs_detail'
  aiContent?: string | null
  templateContent?: string
  loading?: boolean
  tasks?: string[]
  children?: React.ReactNode
}) {
  return (
    <div className="rounded-[var(--radius-md)] border border-cream-dark p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-base font-medium text-ink">{title}</h3>
        {confidence && (
          <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', CONF_LABELS[confidence].className)}>
            {CONF_LABELS[confidence].text}
          </span>
        )}
      </div>

      <div className="mt-3 text-sm text-ink-light leading-relaxed">
        {loading ? (
          <div className="space-y-2.5 animate-pulse">
            <div className="h-3.5 w-full rounded bg-cream-dark" />
            <div className="h-3.5 w-5/6 rounded bg-cream-dark" />
            <div className="h-3.5 w-3/5 rounded bg-cream-dark" />
          </div>
        ) : (
          <p>{aiContent || templateContent}</p>
        )}
      </div>

      {children}

      {/* Panel tasks — things to think about */}
      {!loading && tasks && tasks.length > 0 && (
        <Explainer label="Things to think about next" className="mt-4">
          <ul className="space-y-2">
            {tasks.map((task, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-0.5 text-warmth">→</span>
                <span>{task}</span>
              </li>
            ))}
          </ul>
        </Explainer>
      )}
    </div>
  )
}

// Template fallbacks
function getTemplatePlan(session: InterviewSession, isMarried: boolean, hasChildren: boolean, hasProperty: boolean, hasSafeguarding: boolean) {
  const v = session.values
  const propertyVal = v.property_value ? `£${v.property_value}` : null
  const mortgageVal = v.mortgage ? `£${v.mortgage}` : null
  const incomeVal = v.my_income ? `£${v.my_income}/month` : null

  return {
    route: isMarried
      ? `Your route involves three connected processes: the divorce itself, a financial settlement, and${hasChildren ? ' children\'s arrangements' : ' sorting out shared finances'}. The financial settlement is usually the most complex and important part.`
      + (hasSafeguarding ? ' Given your situation, some routes like mediation may not be appropriate.' : '')
      : `As cohabiting partners, you'll need to work out how to divide shared finances${hasProperty ? ' and property' : ''}${hasChildren ? ', and agree children\'s arrangements' : ''}.`,
    children: hasChildren && session.children.current_arrangements
      ? `Current arrangements: ${session.children.current_arrangements === 'roughly_shared' ? 'roughly shared' : session.children.current_arrangements === 'with_me' ? 'mostly with you' : session.children.current_arrangements === 'with_partner' ? 'mostly with your partner' : 'other'}. You're aiming for ${session.children.desired_arrangements === 'not_sure' ? 'something you\'re still working out' : session.children.desired_arrangements === 'roughly_equal' ? 'roughly equal time' : session.children.desired_arrangements === 'broadly_same' ? 'broadly the same as now' : 'a change in the balance'}.`
      : null,
    housing: hasProperty && session.home.desired_outcome
      ? `You'd like to ${session.home.desired_outcome === 'sell_and_split' ? 'sell the property and split the proceeds' : session.home.desired_outcome === 'one_stays' ? 'have one person stay in the home' : 'work this out as the picture becomes clearer'}.`
      + (propertyVal && mortgageVal ? ` Based on your estimates, the property is worth around ${propertyVal} with ${mortgageVal} outstanding on the mortgage.` : '')
      + (session.home.value_confidence === 'unknown' ? ' The property value is currently unknown — getting an estimate is a clear next step.' : '')
      : null,
    finances: session.finances.priorities.length > 0
      ? `What matters most to you: ${session.finances.priorities.map(p => p.replace(/_/g, ' ')).join(', ')}.`
      + (incomeVal ? ` Your income is around ${incomeVal}.` : '')
      + (session.finances.combined_awareness === 'really_dont_know' ? ' You don\'t yet have a clear picture of the combined finances — building this is the strongest next step.' : '')
      : 'Building a clear financial picture is the strongest next step.',
  }
}

export default function PlanPage() {
  const router = useRouter()
  const { session, hasChildren, hasProperty, hasSafeguardingConcerns } = useInterviewContext()

  const [narrative, setNarrative] = useState<AIPlanNarrative | null>(null)
  const [loading, setLoading] = useState(true)
  const [aiUsed, setAiUsed] = useState(false)

  const tier = calculateTier(session)
  const isMarried = session.situation.relationship_status === 'married' || session.situation.relationship_status === 'civil_partnership'

  const childConf = session.children.confidence === 'known' ? 'strong' as const : session.children.confidence === 'estimated' ? 'some_gaps' as const : 'needs_detail' as const
  const homeConf = session.home.value_confidence === 'known' || session.home.value_confidence === 'estimated' ? (session.home.mortgage_confidence === 'known' ? 'strong' as const : 'some_gaps' as const) : 'needs_detail' as const
  const finConf = session.finances.combined_awareness === 'pretty_clear' ? 'strong' as const : session.finances.combined_awareness === 'rough_idea' || session.finances.combined_awareness === 'know_my_side' ? 'some_gaps' as const : 'needs_detail' as const

  const templatePlan = getTemplatePlan(session, isMarried, hasChildren, hasProperty, hasSafeguardingConcerns)

  // Generate AI narrative on mount
  useEffect(() => {
    if (tier === 'not_ready') { setLoading(false); return }

    async function fetchNarrative() {
      try {
        const res = await fetch('/api/plan/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session, hasSafeguardingConcerns }),
        })
        const data = await res.json()
        if (data.narrative) { setNarrative(data.narrative); setAiUsed(true) }
      } catch { /* fallback silently */ }
      finally { setLoading(false) }
    }

    fetchNarrative()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const tierMessages = {
    full: { heading: 'You\'ve built a strong starting position.', micro: 'Here\'s your personalised assessment.' },
    partial: { heading: 'You\'ve made real progress.', micro: 'Here\'s what we can see so far — some areas need more detail.' },
    thin: { heading: 'You\'ve taken an important first step.', micro: 'Here\'s what you\'ve captured so far.' },
    not_ready: { heading: 'Understanding the process is a huge step forward.', micro: 'When you\'re ready to start shaping your plan, everything is here.' },
  }

  // Build panel tasks based on session data
  const routeTasks = [
    isMarried && session.situation.process_status === 'not_yet' ? 'Consider when to submit the divorce application (£612, straightforward online)' : null,
    !hasSafeguardingConcerns ? 'Look into mediation — a MIAM is usually required, and a £500 government voucher is available' : null,
    hasSafeguardingConcerns ? 'Speak to a solicitor experienced in domestic abuse — many offer free initial consultations' : null,
  ].filter(Boolean) as string[]

  const childrenTasks = [
    session.children.confidence !== 'known' ? 'Think through the practical detail — school terms, holidays, handovers' : null,
    'Consider what the children themselves might want — their wishes matter',
    session.children.desired_arrangements === 'not_sure' ? 'You don\'t need to decide now — this becomes clearer as you work through the process' : null,
  ].filter(Boolean) as string[]

  const housingTasks = [
    session.home.value_confidence !== 'known' ? 'Get a property valuation — estate agents offer free market appraisals' : null,
    session.home.mortgage_confidence !== 'known' ? 'Check your mortgage statement for the outstanding balance' : null,
    session.home.desired_outcome === 'one_stays' ? 'Consider whether the remaining person can afford the mortgage alone' : null,
  ].filter(Boolean) as string[]

  const financeTasks = [
    session.confidence.my_pension === 'unknown' || session.confidence.partner_pension === 'unknown' ? 'Request pension valuations (CETVs) — this takes up to 3 months' : null,
    session.finances.combined_awareness !== 'pretty_clear' ? 'Gather bank statements, payslips, and pension letters' : null,
    session.finances.worries.includes('hidden_assets') ? 'Document what you know — a thorough record is your strongest protection' : null,
  ].filter(Boolean) as string[]

  return (
    <InterviewLayout step={7} totalSteps={8}>
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-2xl font-medium text-ink">Your plan</h1>
          <p className="mt-2 text-sm text-ink-light leading-relaxed">
            {tierMessages[tier].micro}
          </p>
        </div>

        {/* Loading state with message */}
        {loading && (
          <div className="flex items-center gap-3 rounded-[var(--radius-md)] border border-cream-dark p-5">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-cream-dark border-t-warmth" />
            <p className="text-sm text-ink-light">Making your initial assessment now...</p>
          </div>
        )}

        {/* AI overview or tier heading */}
        {!loading && (
          <MicroMoment>
            {aiUsed && narrative?.overview ? narrative.overview : tierMessages[tier].heading}
          </MicroMoment>
        )}

        {/* Route */}
        <PlanSection
          title="Your route"
          loading={loading}
          aiContent={aiUsed ? narrative?.route : null}
          templateContent={templatePlan.route}
          tasks={routeTasks}
        />

        {/* Children */}
        {hasChildren && session.children.current_arrangements && tier !== 'not_ready' && (
          <PlanSection
            title="Children"
            confidence={childConf}
            loading={loading}
            aiContent={aiUsed ? narrative?.children : null}
            templateContent={templatePlan.children || ''}
            tasks={childrenTasks}
          />
        )}

        {/* Housing */}
        {hasProperty && session.home.desired_outcome && tier !== 'not_ready' && (
          <PlanSection
            title="Housing"
            confidence={homeConf}
            loading={loading}
            aiContent={aiUsed ? narrative?.housing : null}
            templateContent={templatePlan.housing || ''}
            tasks={housingTasks}
          />
        )}

        {/* Finances */}
        {session.finances.priorities.length > 0 && tier !== 'not_ready' && (
          <PlanSection
            title="Finances"
            confidence={finConf}
            loading={loading}
            aiContent={aiUsed ? narrative?.finances : null}
            templateContent={templatePlan.finances}
            tasks={financeTasks}
          />
        )}

        {/* Confidence map */}
        {tier !== 'not_ready' && (
          <div className="rounded-[var(--radius-md)] border border-cream-dark p-5">
            <h3 className="font-heading text-base font-medium text-ink">Your confidence map</h3>
            <div className="mt-4">
              <ConfidenceSummaryBar session={session} />
            </div>
            {loading ? (
              <div className="mt-3 space-y-2 animate-pulse">
                <div className="h-3.5 w-full rounded bg-cream-dark" />
                <div className="h-3.5 w-4/6 rounded bg-cream-dark" />
              </div>
            ) : (
              <p className="mt-3 text-sm text-ink-light leading-relaxed">
                {aiUsed && narrative?.confidence_insight ? narrative.confidence_insight : 'This shows what you know and where the gaps are. The next stage helps you fill in the detail.'}
              </p>
            )}
          </div>
        )}

        {/* AI closing */}
        {!loading && aiUsed && narrative?.closing && tier !== 'not_ready' && (
          <MicroMoment>{narrative.closing}</MicroMoment>
        )}

        {/* Recommendations */}
        {tier !== 'not_ready' && (() => {
          const recs = generateRecommendations(session, hasSafeguardingConcerns)
          const highPriority = recs.filter(r => r.priority === 'high')
          const mediumPriority = recs.filter(r => r.priority === 'medium')

          return (
            <div className="space-y-5">
              <h2 className="font-heading text-lg font-medium text-ink">Our recommendations</h2>

              {highPriority.length > 0 && (
                <div className="space-y-3">
                  {highPriority.map(rec => (
                    <div key={rec.id} className="rounded-[var(--radius-md)] border border-warmth-light bg-warmth-light/20 p-5">
                      <h3 className="text-sm font-medium text-ink">{rec.title}</h3>
                      <p className="mt-2 text-sm text-ink-light leading-relaxed">{rec.explanation}</p>
                      {rec.serviceDescription && (
                        <p className="mt-3 text-sm text-warmth-dark leading-relaxed">
                          <span className="font-medium">How we help:</span> {rec.serviceDescription}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {mediumPriority.length > 0 && (
                <Explainer label={`${mediumPriority.length} more recommendation${mediumPriority.length > 1 ? 's' : ''}`}>
                  <div className="space-y-4">
                    {mediumPriority.map(rec => (
                      <div key={rec.id}>
                        <h3 className="text-sm font-medium text-ink">{rec.title}</h3>
                        <p className="mt-1 text-sm text-ink-light leading-relaxed">{rec.explanation}</p>
                        {rec.serviceDescription && (
                          <p className="mt-2 text-sm text-warmth-dark leading-relaxed">
                            <span className="font-medium">How we help:</span> {rec.serviceDescription}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </Explainer>
              )}
            </div>
          )
        })()}

        {/* Download PDF */}
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
            Your road ahead
          </Button>
        </div>
      </div>
    </InterviewLayout>
  )
}
