'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { InterviewLayout } from '@/components/interview/interview-layout'
import { MicroMoment } from '@/components/interview/micro-moment'
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
  const domainsWithContent = [
    session.children.current_arrangements !== null,
    session.home.desired_outcome !== null,
    session.finances.priorities.length > 0,
  ].filter(Boolean).length

  if (total >= 8 && knownOrEstimated >= 4 && domainsWithContent >= 2) return 'full'
  if (total >= 5 && domainsWithContent >= 1) return 'partial'
  if (total >= 1 || domainsWithContent >= 1) return 'thin'
  return 'not_ready'
}

function ConfidenceBar({ session }: { session: InterviewSession }) {
  const values = Object.values(session.confidence).filter(v => v !== null)
  const known = values.filter(v => v === 'known').length
  const estimated = values.filter(v => v === 'estimated').length
  const unknown = values.filter(v => v === 'unknown').length
  const total = values.length || 1

  return (
    <div className="space-y-2">
      <div className="flex h-2.5 overflow-hidden rounded-full">
        {known > 0 && <div className="bg-sage" style={{ width: `${(known / total) * 100}%` }} />}
        {estimated > 0 && <div className="bg-amber" style={{ width: `${(estimated / total) * 100}%` }} />}
        {unknown > 0 && <div className="bg-cream-dark" style={{ width: `${(unknown / total) * 100}%` }} />}
      </div>
      <div className="flex gap-4 text-xs text-ink-light">
        {known > 0 && <span>{known} known</span>}
        {estimated > 0 && <span>{estimated} estimated</span>}
        {unknown > 0 && <span>{unknown} unknown</span>}
      </div>
    </div>
  )
}

function PlanPanel({ title, label, labelClass, loading, aiContent, fallback, tasks, serviceHelp }: {
  title: string
  label?: string
  labelClass?: string
  loading: boolean
  aiContent?: string | null
  fallback: string
  tasks?: string[]
  serviceHelp?: string
}) {
  const content = aiContent || fallback

  return (
    <div className="rounded-[var(--radius-md)] border border-cream-dark p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-base font-medium text-ink">{title}</h3>
        {label && <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', labelClass)}>{label}</span>}
      </div>

      {loading ? (
        <div className="space-y-2 animate-pulse">
          <div className="h-3.5 w-full rounded bg-cream-dark" />
          <div className="h-3.5 w-5/6 rounded bg-cream-dark" />
        </div>
      ) : (
        <p className="text-sm text-ink-light leading-relaxed">{content}</p>
      )}

      {!loading && tasks && tasks.length > 0 && (
        <div className="space-y-2 border-t border-cream-dark pt-3">
          <p className="text-xs font-medium text-ink-faint uppercase tracking-wide">Things to do next</p>
          <ul className="space-y-1.5">
            {tasks.map((task, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-ink-light">
                <span className="mt-0.5 text-warmth">→</span>
                <span>{task}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!loading && serviceHelp && (
        <div className="rounded-[var(--radius-sm)] bg-warmth-light/30 p-3">
          <p className="text-sm text-warmth-dark leading-relaxed">
            <span className="font-medium">How we make this easier:</span> {serviceHelp}
          </p>
        </div>
      )}
    </div>
  )
}

export default function PlanPage() {
  const router = useRouter()
  const { session, hasChildren, hasProperty, hasSafeguardingConcerns } = useInterviewContext()

  // Cache the AI narrative in a ref so navigating back doesn't regenerate
  const cachedNarrative = useRef<AIPlanNarrative | null>(null)
  const [narrative, setNarrative] = useState<AIPlanNarrative | null>(cachedNarrative.current)
  const [loading, setLoading] = useState(!cachedNarrative.current)
  const aiUsed = narrative !== null

  const tier = calculateTier(session)
  const isMarried = session.situation.relationship_status === 'married' || session.situation.relationship_status === 'civil_partnership'
  const v = session.values

  // Confidence labels
  const childLabel = session.children.confidence === 'known' ? { text: 'Strong', cls: 'text-sage-dark bg-sage-light' } : session.children.confidence === 'estimated' ? { text: 'Some gaps', cls: 'text-amber bg-amber-light' } : { text: 'Needs detail', cls: 'text-ink-faint bg-cream-dark' }
  const homeLabel = session.home.value_confidence === 'known' ? { text: 'Strong', cls: 'text-sage-dark bg-sage-light' } : session.home.value_confidence === 'estimated' ? { text: 'Some gaps', cls: 'text-amber bg-amber-light' } : { text: 'Needs detail', cls: 'text-ink-faint bg-cream-dark' }
  const finLabel = session.finances.combined_awareness === 'pretty_clear' ? { text: 'Strong', cls: 'text-sage-dark bg-sage-light' } : session.finances.combined_awareness === 'rough_idea' || session.finances.combined_awareness === 'know_my_side' ? { text: 'Some gaps', cls: 'text-amber bg-amber-light' } : { text: 'Needs detail', cls: 'text-ink-faint bg-cream-dark' }

  // Generate AI narrative (only once)
  useEffect(() => {
    if (cachedNarrative.current || tier === 'not_ready') { setLoading(false); return }

    async function fetchNarrative() {
      try {
        const res = await fetch('/api/plan/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session, hasSafeguardingConcerns }),
        })
        const data = await res.json()
        if (data.narrative) {
          cachedNarrative.current = data.narrative
          setNarrative(data.narrative)
        }
      } catch { /* fallback */ }
      finally { setLoading(false) }
    }
    fetchNarrative()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Template fallbacks
  const propertyStr = v.property_value ? `£${v.property_value}` : null
  const mortgageStr = v.mortgage ? `£${v.mortgage}` : null
  const incomeStr = v.my_income ? `£${v.my_income}/month` : null

  const fallbacks = {
    route: isMarried
      ? `Your route involves three connected processes: the divorce itself, a financial settlement, and${hasChildren ? ' children\'s arrangements' : ' sorting out shared finances'}. The financial settlement is usually the most complex part.${hasSafeguardingConcerns ? ' Given your situation, some routes like mediation may not be appropriate.' : ''}`
      : `As cohabiting partners, you'll need to divide shared finances${hasProperty ? ' and property' : ''}${hasChildren ? ', and agree children\'s arrangements' : ''}.`,
    children: `Current arrangements: ${session.children.current_arrangements === 'roughly_shared' ? 'roughly shared' : session.children.current_arrangements === 'with_me' ? 'mostly with you' : session.children.current_arrangements === 'with_partner' ? 'mostly with your partner' : 'other'}. You're aiming for ${session.children.desired_arrangements === 'not_sure' ? 'something you\'re still working out' : session.children.desired_arrangements === 'roughly_equal' ? 'roughly equal time' : session.children.desired_arrangements === 'broadly_same' ? 'broadly the same as now' : 'a change in the balance'}.`,
    housing: `You'd like to ${session.home.desired_outcome === 'sell_and_split' ? 'sell and split the proceeds' : session.home.desired_outcome === 'one_stays' ? 'have one person stay in the home' : 'work this out as the picture becomes clearer'}.${propertyStr && mortgageStr ? ` Estimated value: ${propertyStr}, mortgage: ${mortgageStr}.` : ''}`,
    finances: `Your priorities: ${session.finances.priorities.map(p => p.replace(/_/g, ' ')).join(', ')}.${incomeStr ? ` Your income: ${incomeStr}.` : ''}${session.finances.combined_awareness === 'really_dont_know' ? ' You don\'t yet have a clear combined picture — this is the strongest next step.' : ''}`,
  }

  // Get recommendations for inline integration
  const recs = generateRecommendations(session, hasSafeguardingConcerns)

  // Build tasks per panel
  const routeTasks = [
    isMarried && session.situation.process_status === 'not_yet' ? 'Submit divorce application (£612, straightforward online at gov.uk)' : null,
    !hasSafeguardingConcerns ? 'Look into mediation — £500 government voucher available' : null,
    hasSafeguardingConcerns ? 'Speak to a solicitor experienced in domestic abuse' : null,
  ].filter(Boolean) as string[]

  const childrenTasks = [
    session.children.confidence !== 'known' ? 'Think through school terms, holidays, handovers' : null,
    'Consider what the children might want',
  ].filter(Boolean) as string[]

  const housingTasks = [
    session.home.value_confidence !== 'known' ? 'Get a free estate agent market appraisal' : null,
    session.home.mortgage_confidence !== 'known' ? 'Check your latest mortgage statement' : null,
    session.home.desired_outcome === 'one_stays' ? 'Consider solo mortgage affordability' : null,
  ].filter(Boolean) as string[]

  const financeTasks = [
    session.confidence.my_pension === 'unknown' || session.confidence.partner_pension === 'unknown' ? 'Request pension valuations (CETVs) — takes up to 3 months' : null,
    session.finances.combined_awareness !== 'pretty_clear' ? 'Gather bank statements, payslips, pension letters' : null,
    session.finances.worries.includes('hidden_assets') ? 'Document everything you know — thorough records are your protection' : null,
  ].filter(Boolean) as string[]

  // Service help per panel
  const routeServiceHelp = 'We guide you through every step of the process — what to do, when, and why. No legal jargon.'
  const childrenServiceHelp = 'Our guided tools help you build detailed arrangements that are ready to share with a mediator or use in a parenting plan.'
  const housingServiceHelp = 'Track your property value and mortgage, link valuation evidence, and see how housing fits your overall financial position.'
  const financeServiceHelp = 'Upload documents and we automatically extract, classify, and structure your financial information. You review and confirm — we do the heavy lifting.'

  const tierMessage = {
    full: 'Here\'s your personalised assessment.',
    partial: 'Here\'s what we can see so far — some areas need more detail.',
    thin: 'Here\'s what you\'ve captured so far.',
    not_ready: 'When you\'re ready to start shaping your plan, everything is here.',
  }

  return (
    <InterviewLayout step={7} totalSteps={8}>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-medium text-ink">Your plan</h1>
          <p className="mt-2 text-sm text-ink-light">{tierMessage[tier]}</p>
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="flex items-center gap-3 rounded-[var(--radius-md)] border border-warmth-light bg-warmth-light/20 p-4">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-warmth-light border-t-warmth" />
            <p className="text-sm text-ink-light">Building your personalised assessment...</p>
          </div>
        )}

        {/* AI overview */}
        {!loading && aiUsed && narrative?.overview && (
          <MicroMoment>{narrative.overview}</MicroMoment>
        )}

        {/* Route panel */}
        <PlanPanel
          title="Your route"
          loading={loading}
          aiContent={aiUsed ? narrative?.route : null}
          fallback={fallbacks.route}
          tasks={routeTasks}
          serviceHelp={routeServiceHelp}
        />

        {/* Children panel */}
        {hasChildren && session.children.current_arrangements && tier !== 'not_ready' && (
          <PlanPanel
            title="Children"
            label={childLabel.text}
            labelClass={childLabel.cls}
            loading={loading}
            aiContent={aiUsed ? narrative?.children : null}
            fallback={fallbacks.children}
            tasks={childrenTasks}
            serviceHelp={childrenServiceHelp}
          />
        )}

        {/* Housing panel */}
        {hasProperty && session.home.desired_outcome && tier !== 'not_ready' && (
          <PlanPanel
            title="Housing"
            label={homeLabel.text}
            labelClass={homeLabel.cls}
            loading={loading}
            aiContent={aiUsed ? narrative?.housing : null}
            fallback={fallbacks.housing}
            tasks={housingTasks}
            serviceHelp={housingServiceHelp}
          />
        )}

        {/* Finances panel */}
        {session.finances.priorities.length > 0 && tier !== 'not_ready' && (
          <PlanPanel
            title="Finances"
            label={finLabel.text}
            labelClass={finLabel.cls}
            loading={loading}
            aiContent={aiUsed ? narrative?.finances : null}
            fallback={fallbacks.finances}
            tasks={financeTasks}
            serviceHelp={financeServiceHelp}
          />
        )}

        {/* Confidence map */}
        {tier !== 'not_ready' && (
          <div className="rounded-[var(--radius-md)] border border-cream-dark p-5 space-y-3">
            <h3 className="font-heading text-base font-medium text-ink">Confidence map</h3>
            <ConfidenceBar session={session} />
            {!loading && (
              <p className="text-sm text-ink-light leading-relaxed">
                {aiUsed && narrative?.confidence_insight ? narrative.confidence_insight : 'This shows what you know and where the gaps are.'}
              </p>
            )}
          </div>
        )}

        {/* AI closing */}
        {!loading && aiUsed && narrative?.closing && tier !== 'not_ready' && (
          <MicroMoment>{narrative.closing}</MicroMoment>
        )}

        {/* Download PDF */}
        {tier !== 'not_ready' && (
          <button
            type="button"
            className="w-full rounded-[var(--radius-sm)] border border-cream-dark px-4 py-3 text-center text-sm text-ink-light hover:bg-cream-dark transition-colors"
          >
            Download your plan as PDF
          </button>
        )}

        <div className="flex items-center justify-between pt-2">
          <button type="button" onClick={() => router.back()} className="text-sm text-ink-light hover:text-ink transition-colors">Back</button>
          <Button onClick={() => router.push('/start/next-steps')}>Your road ahead</Button>
        </div>
      </div>
    </InterviewLayout>
  )
}
