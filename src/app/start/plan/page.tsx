'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { InterviewLayout } from '@/components/interview/interview-layout'
import { MicroMoment } from '@/components/interview/micro-moment'
import { Button } from '@/components/ui/button'
import { useInterviewContext } from '@/components/interview/interview-provider'
import { cn } from '@/utils/cn'
import type { ReadinessTier } from '@/types'
import type { InterviewSession } from '@/types/interview'
import type { AIPlanNarrative, AIPlanSection } from '@/lib/ai/plan-narrative'

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

function PlanPanel({ title, label, labelClass, loading, aiSection, fallbackSummary, fallbackPoints, nextSteps, serviceHelp }: {
  title: string
  label?: string
  labelClass?: string
  loading: boolean
  aiSection?: AIPlanSection | null
  fallbackSummary: string
  fallbackPoints: string[]
  nextSteps?: string[]
  serviceHelp?: string
}) {
  const summary = aiSection?.summary || fallbackSummary
  const points = aiSection?.key_points || fallbackPoints

  return (
    <div className="rounded-[var(--radius-md)] border border-cream-dark p-5 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-base font-medium text-ink">{title}</h3>
        {label && <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', labelClass)}>{label}</span>}
      </div>

      {loading ? (
        <div className="space-y-2 animate-pulse">
          <div className="h-3.5 w-4/5 rounded bg-cream-dark" />
          <div className="h-3 w-3/5 rounded bg-cream-dark" />
        </div>
      ) : (
        <>
          {/* Summary — one line */}
          <p className="text-sm font-medium text-ink">{summary}</p>

          {/* Key points — bullets */}
          {points.length > 0 && (
            <ul className="space-y-1.5">
              {points.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink-light">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-ink-faint" />
                  {point}
                </li>
              ))}
            </ul>
          )}

          {/* Next steps — what they do */}
          {nextSteps && nextSteps.length > 0 && (
            <div className="border-t border-cream-dark pt-3 space-y-1.5">
              <p className="text-xs font-medium text-ink-faint uppercase tracking-wide">Your next steps</p>
              {nextSteps.map((step, i) => (
                <p key={i} className="flex items-start gap-2 text-sm text-ink-light">
                  <span className="mt-0.5 text-warmth">→</span>
                  {step}
                </p>
              ))}
            </div>
          )}

          {/* Service value — how we help */}
          {serviceHelp && (
            <div className="rounded-[var(--radius-sm)] bg-warmth-light/30 p-3">
              <p className="text-sm text-warmth-dark">
                <span className="font-medium">How we make this easier:</span> {serviceHelp}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default function PlanPage() {
  const router = useRouter()
  const { session, hasChildren, hasProperty, hasSafeguardingConcerns, getPlanNarrative, startPlanGeneration, interviewSteps } = useInterviewContext()

  const [narrative, setNarrative] = useState<AIPlanNarrative | null>(null)
  const [loading, setLoading] = useState(true)
  const aiUsed = narrative !== null

  const tier = calculateTier(session)
  const isMarried = session.situation.relationship_status === 'married' || session.situation.relationship_status === 'civil_partnership'
  const v = session.values

  const confLabel = (state: string | null) =>
    state === 'known' ? { text: 'Strong', cls: 'text-sage-dark bg-sage-light' }
    : state === 'estimated' ? { text: 'Some gaps', cls: 'text-amber bg-amber-light' }
    : { text: 'Needs detail', cls: 'text-ink-faint bg-cream-dark' }

  const childLabel = confLabel(session.children.confidence)
  const homeLabel = confLabel(session.home.value_confidence)
  const finLabel = confLabel(session.finances.combined_awareness === 'pretty_clear' ? 'known' : session.finances.combined_awareness === 'rough_idea' || session.finances.combined_awareness === 'know_my_side' ? 'estimated' : null)

  useEffect(() => {
    if (tier === 'not_ready') { setLoading(false); return }
    async function loadNarrative() {
      startPlanGeneration(session, hasSafeguardingConcerns)
      const result = await getPlanNarrative()
      if (result) setNarrative(result)
      setLoading(false)
    }
    loadNarrative()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Fallback content (structured) ──

  const routeFallback = {
    summary: isMarried
      ? 'Your separation involves three connected processes: divorce, financial settlement, and' + (hasChildren ? ' children\'s arrangements.' : ' dividing shared finances.')
      : 'You\'ll need to divide shared finances' + (hasProperty ? ', property,' : '') + (hasChildren ? ' and agree children\'s arrangements.' : '.'),
    points: [
      isMarried ? 'The divorce itself is the simplest part — apply online, minimum 26 weeks' : null,
      isMarried ? 'A financial order (consent order) is essential — without it, claims stay open indefinitely' : null,
      hasChildren ? 'Children\'s arrangements are agreed separately, often through mediation' : null,
      !hasSafeguardingConcerns ? '£500 government mediation voucher available regardless of income' : null,
      hasSafeguardingConcerns ? 'Given your situation, mediation may not be appropriate — speak to a specialist solicitor' : null,
    ].filter(Boolean) as string[],
  }

  const childrenFallback = {
    summary: `Currently ${session.children.current_arrangements === 'roughly_shared' ? 'roughly shared' : session.children.current_arrangements === 'with_me' ? 'mostly with you' : 'with your partner'}, aiming for ${session.children.desired_arrangements === 'roughly_equal' ? 'roughly equal time' : session.children.desired_arrangements === 'broadly_same' ? 'broadly the same' : session.children.desired_arrangements === 'not_sure' ? 'something you\'re still working out' : 'a change'}.`,
    points: [
      session.children.confidence !== 'known' ? 'The more detail you can think through, the stronger your position' : 'You have a clear idea of what you want — that\'s a strong starting point',
      'Consider school terms, holidays, and handover logistics',
    ],
  }

  const housingFallback = {
    summary: `You\'d like to ${session.home.desired_outcome === 'sell_and_split' ? 'sell and split' : session.home.desired_outcome === 'one_stays' ? 'have one person stay' : 'decide later'}.`
      + (v.property_value ? ` Estimated value: £${v.property_value}.` : '')
      + (v.mortgage ? ` Mortgage: £${v.mortgage}.` : ''),
    points: [
      session.home.value_confidence !== 'known' ? 'Get a property valuation — estate agents offer free appraisals' : null,
      session.home.mortgage_confidence !== 'known' ? 'Check your latest mortgage statement for the balance' : null,
      session.home.desired_outcome === 'one_stays' ? 'Affordability depends on the full financial picture' : null,
    ].filter(Boolean) as string[],
  }

  const financesFallback = {
    summary: `Your priorities: ${session.finances.priorities.map(p => p.replace(/_/g, ' ')).join(', ')}.`
      + (v.my_income ? ` Income: £${v.my_income}/month.` : ''),
    points: [
      session.confidence.my_pension === 'unknown' || session.confidence.partner_pension === 'unknown' ? 'Pension valuations (CETVs) take up to 3 months — start now' : null,
      session.finances.worries.includes('hidden_assets') ? 'Formal disclosure requires everything declared under oath' : null,
      session.finances.combined_awareness !== 'pretty_clear' ? 'Building the full picture is the strongest next step' : null,
      session.finances.worries.includes('process_cost') ? 'Costs can be managed — £500 mediation voucher, DIY divorce is £612' : null,
    ].filter(Boolean) as string[],
  }

  // ── Next steps per section ──

  const routeNextSteps = [
    isMarried && session.situation.process_status === 'not_yet' ? 'Submit divorce application at gov.uk (£612)' : null,
    hasSafeguardingConcerns ? 'Contact a solicitor experienced in domestic abuse' : 'Book a free initial solicitor consultation',
  ].filter(Boolean) as string[]

  const childrenNextSteps = [
    session.children.confidence !== 'known' ? 'Map out a typical week — school, activities, handovers' : null,
    'Think about what the children would want',
  ].filter(Boolean) as string[]

  const housingNextSteps = [
    session.home.value_confidence !== 'known' ? 'Get a free estate agent appraisal' : null,
    session.home.mortgage_confidence !== 'known' ? 'Request a mortgage statement' : null,
  ].filter(Boolean) as string[]

  const financeNextSteps = [
    session.confidence.my_pension === 'unknown' ? 'Request your pension CETV (free, takes ~3 months)' : null,
    session.confidence.partner_pension === 'unknown' ? 'Find out about your partner\'s pension if possible' : null,
    'Gather 12 months of bank statements' ,
  ].filter(Boolean) as string[]

  // ── Service help per section ──

  const routeService = 'We guide you through every step — what to do, when, and why.'
  const childrenService = 'Build detailed arrangements ready to share with a mediator or use in a parenting plan.'
  const housingService = 'Track property value, mortgage, and equity — linked to evidence, ready for disclosure.'
  const financeService = 'Upload documents and we extract, classify, and structure everything automatically. You review and confirm.'

  return (
    <InterviewLayout currentStep="plan" steps={interviewSteps}>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-medium text-ink">Your plan</h1>
        </div>

        {loading && (
          <div className="flex items-center gap-3 rounded-[var(--radius-md)] border border-warmth-light bg-warmth-light/20 p-4">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-warmth-light border-t-warmth" />
            <p className="text-sm text-ink-light">Building your personalised assessment...</p>
          </div>
        )}

        {!loading && (
          <MicroMoment>
            {aiUsed && narrative?.overview ? narrative.overview : 'Here\'s what we can see from what you\'ve told us.'}
          </MicroMoment>
        )}

        <PlanPanel
          title="Your route"
          loading={loading}
          aiSection={aiUsed ? narrative?.route : null}
          fallbackSummary={routeFallback.summary}
          fallbackPoints={routeFallback.points}
          nextSteps={routeNextSteps}
          serviceHelp={routeService}
        />

        {hasChildren && session.children.current_arrangements && tier !== 'not_ready' && (
          <PlanPanel
            title="Children"
            label={childLabel.text}
            labelClass={childLabel.cls}
            loading={loading}
            aiSection={aiUsed ? narrative?.children : null}
            fallbackSummary={childrenFallback.summary}
            fallbackPoints={childrenFallback.points}
            nextSteps={childrenNextSteps}
            serviceHelp={childrenService}
          />
        )}

        {hasProperty && session.home.desired_outcome && tier !== 'not_ready' && (
          <PlanPanel
            title="Housing"
            label={homeLabel.text}
            labelClass={homeLabel.cls}
            loading={loading}
            aiSection={aiUsed ? narrative?.housing : null}
            fallbackSummary={housingFallback.summary}
            fallbackPoints={housingFallback.points}
            nextSteps={housingNextSteps}
            serviceHelp={housingService}
          />
        )}

        {session.finances.priorities.length > 0 && tier !== 'not_ready' && (
          <PlanPanel
            title="Finances"
            label={finLabel.text}
            labelClass={finLabel.cls}
            loading={loading}
            aiSection={aiUsed ? narrative?.finances : null}
            fallbackSummary={financesFallback.summary}
            fallbackPoints={financesFallback.points}
            nextSteps={financeNextSteps}
            serviceHelp={financeService}
          />
        )}

        {tier !== 'not_ready' && (
          <div className="rounded-[var(--radius-md)] border border-cream-dark p-5 space-y-3">
            <h3 className="font-heading text-base font-medium text-ink">Confidence map</h3>
            <ConfidenceBar session={session} />
            {!loading && (
              <p className="text-sm text-ink-light">
                {aiUsed && narrative?.confidence_insight ? narrative.confidence_insight : 'This shows what you know and where the gaps are.'}
              </p>
            )}
          </div>
        )}

        {!loading && aiUsed && narrative?.closing && (
          <MicroMoment>{narrative.closing}</MicroMoment>
        )}

        {tier !== 'not_ready' && (
          <button type="button" className="w-full rounded-[var(--radius-sm)] border border-cream-dark px-4 py-3 text-center text-sm text-ink-light hover:bg-cream-dark transition-colors">
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
