'use client'

import { useRouter } from 'next/navigation'
import { InterviewLayout } from '@/components/interview/interview-layout'
import { Explainer } from '@/components/interview/explainer'
import { MicroMoment } from '@/components/interview/micro-moment'
import { Button } from '@/components/ui/button'
import { useInterviewContext } from '@/components/interview/interview-provider'
import { cn } from '@/utils/cn'

interface PathwayStage {
  title: string
  detail: string
  tips: string[]
  serviceHint?: string
  isMajor: boolean
}

export default function PathwayPage() {
  const router = useRouter()
  const { session, hasChildren, hasProperty, hasSafeguardingConcerns, interviewSteps } = useInterviewContext()

  const isMarried = session.situation.relationship_status === 'married' || session.situation.relationship_status === 'civil_partnership'
  const isCohabiting = session.situation.relationship_status === 'cohabiting'
  const isAmicable = session.situation.relationship_quality === 'amicable'
  const notStarted = session.situation.process_status === 'not_yet'

  function getNextStep() {
    if (hasChildren) return '/start/children'
    if (hasProperty) return '/start/home'
    return '/start/finances'
  }

  // Build personalised pathway — accurate end-to-end journey
  const stages: PathwayStage[] = []

  // ── MARRIED / CIVIL PARTNERSHIP PATHWAY ──
  if (isMarried) {
    stages.push({
      title: 'Divorce application',
      detail: 'Apply online at gov.uk · £612 fee · Sole or joint application',
      tips: [
        'This is the simplest part — takes about 10 minutes online',
        'A 20-week reflection period starts from the date you apply',
        'Use this waiting time to work on your financial settlement',
        notStarted ? 'Help with fees is available if you\'re on a low income' : 'You\'ve already started this process',
      ],
      serviceHint: undefined,
      isMajor: true,
    })

    if (!hasSafeguardingConcerns) {
      stages.push({
        title: 'MIAM and mediation',
        detail: 'Required information meeting · Then mediation if suitable',
        tips: [
          'A MIAM is a one-off meeting — it\'s not mediation itself',
          'Usually required before any court application about finances or children',
          '£500 government voucher available towards mediation costs',
          isAmicable ? 'Since your relationship is amicable, mediation often works well' : 'Mediation can work even when communication is difficult',
        ],
        serviceHint: 'We help you prepare — organised disclosure and clear proposals make mediation more productive',
        isMajor: false,
      })
    }

    stages.push({
      title: 'Financial settlement',
      detail: 'Full financial picture · Disclosure · Negotiation · Agreement',
      tips: [
        'Both parties must share a complete financial picture (Form E or equivalent)',
        'This covers income, property, pensions, savings, debts, and obligations',
        'Pensions are often the largest asset — sometimes worth more than the home',
        'Request pension valuations (CETVs) early — they take up to 3 months',
      ],
      serviceHint: 'Upload documents and we extract, structure, and organise everything automatically. Track proposals, counter-proposals, and what\'s agreed.',
      isMajor: true,
    })

    if (hasChildren) {
      stages.push({
        title: 'Children\'s arrangements',
        detail: 'Living · Time with each parent · Schooling · Holidays · Handovers',
        tips: [
          'Arrangements can be agreed informally, through mediation, or via court',
          'Courts focus on the child\'s welfare — their needs come first',
          'A parenting plan helps formalise what you\'ve agreed',
          'Child maintenance (financial support) is a separate process via CMS',
        ],
        serviceHint: 'Build detailed arrangements ready to share with a mediator or formalise in a parenting plan',
        isMajor: true,
      })
    }

    stages.push({
      title: 'Consent order',
      detail: 'Draft order · D81 statement · Submit to court · Judge approves',
      tips: [
        'This makes your financial agreement legally binding',
        'Without one, either party can make claims indefinitely — even years later',
        'Requires a professionally drafted document — not just the D81 form',
        'Court fee: £60 · Usually no hearing required',
      ],
      serviceHint: 'We structure your agreement into the information needed for a consent order, reducing solicitor costs',
      isMajor: true,
    })

    stages.push({
      title: 'Conditional order',
      detail: 'Court confirms the divorce can proceed · Apply after 20-week wait',
      tips: [
        'This used to be called "decree nisi"',
        'You apply after the 20-week reflection period',
        'Usually straightforward if both parties agree',
        'Get your consent order submitted before applying for the final order',
      ],
      serviceHint: undefined,
      isMajor: false,
    })

    stages.push({
      title: 'Final order',
      detail: 'Divorce is legally complete · Apply 6 weeks after conditional order',
      tips: [
        'This used to be called "decree absolute"',
        'Wait at least 6 weeks and 1 day after the conditional order',
        'Make sure your consent order is sealed by the court before this step',
        'Once granted, you are legally divorced',
      ],
      serviceHint: undefined,
      isMajor: true,
    })
  }

  // ── COHABITING PATHWAY ──
  if (isCohabiting) {
    stages.push({
      title: 'Understand your position',
      detail: 'Legal rights for cohabiting partners are different from married couples',
      tips: [
        'There is no "common law marriage" in England and Wales',
        'Your rights depend on property ownership, contributions, and agreements',
        'If you own property jointly, you both have a stake regardless of who paid more',
        'Getting legal advice early is particularly important for cohabiting partners',
      ],
      serviceHint: undefined,
      isMajor: true,
    })

    if (!hasSafeguardingConcerns) {
      stages.push({
        title: 'Discussion or mediation',
        detail: 'Agree how to divide shared finances, property, and responsibilities',
        tips: [
          'Mediation can help even without a formal divorce process',
          '£500 government voucher available if children are involved',
          'Written agreements are strongly recommended even if informal',
        ],
        serviceHint: 'We help you prepare a clear financial picture and structured proposals for discussion',
        isMajor: false,
      })
    }

    if (hasProperty) {
      stages.push({
        title: 'Property and finances',
        detail: 'Divide property · Split shared finances · Resolve debts',
        tips: [
          'Jointly owned property: you both have rights, but the split may not be 50/50',
          'Property in one name: the other partner may still have a claim (beneficial interest)',
          'Get a property valuation — estate agents offer free appraisals',
          'Consider a Declaration of Trust if one person is staying in the property',
        ],
        serviceHint: 'Upload documents and we build a structured financial picture automatically. Track what\'s agreed and what\'s outstanding.',
        isMajor: true,
      })
    } else {
      stages.push({
        title: 'Financial separation',
        detail: 'Divide shared accounts · Resolve debts · Separate finances',
        tips: [
          'Close or restructure joint bank accounts',
          'Agree who is responsible for shared debts',
          'Update any shared financial commitments (utilities, subscriptions)',
        ],
        serviceHint: 'We help you build a clear financial picture and track what\'s been agreed',
        isMajor: true,
      })
    }

    if (hasChildren) {
      stages.push({
        title: 'Children\'s arrangements',
        detail: 'Living · Time with each parent · Schooling · Holidays',
        tips: [
          'Same legal framework as married parents — children\'s welfare comes first',
          'Arrangements can be agreed informally or formalised via court',
          'Child maintenance calculated through CMS (separate process)',
          'A parenting plan helps prevent future misunderstandings',
        ],
        serviceHint: 'Build detailed arrangements ready for mediation or a parenting plan',
        isMajor: true,
      })
    }

    stages.push({
      title: 'Written agreement',
      detail: 'Document what you\'ve agreed · Consider making it legally binding',
      tips: [
        'A written separation agreement isn\'t automatically legally binding',
        'But it creates a clear record of what was agreed and when',
        'For property, you may need a formal legal document (deed of trust)',
        'Legal advice is recommended to protect both parties',
      ],
      serviceHint: 'We help structure your agreement clearly, ready for legal review',
      isMajor: true,
    })
  }

  // ── SAFEGUARDING: add solicitor stage at start ──
  if (hasSafeguardingConcerns) {
    stages.unshift({
      title: 'Safety and legal advice',
      detail: 'Specialist solicitor · Safety planning · Understand your rights',
      tips: [
        'Speaking to a solicitor experienced in domestic abuse is an important first step',
        'Many offer a free initial consultation',
        'You may be exempt from the MIAM requirement before court',
        'National Domestic Abuse Helpline: 0808 2000 247 (24/7, free)',
      ],
      serviceHint: undefined,
      isMajor: true,
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
            Your separation journey, step by step.
          </h1>
          <p className="mt-2 text-sm text-ink-light leading-relaxed">
            Based on what you&apos;ve told us, here&apos;s what your specific journey involves — from where you are now to a settled, formalised agreement.
          </p>
        </div>

        {/* Journey diagram */}
        <div className="space-y-0">
          {stages.map((stage, i) => (
            <div key={i} className="flex gap-4">
              {/* Timeline */}
              <div className="flex flex-col items-center">
                <div className={cn(
                  'flex shrink-0 items-center justify-center rounded-full text-cream font-medium',
                  stage.isMajor ? 'h-8 w-8 bg-warmth text-sm' : 'h-6 w-6 bg-ink-faint text-xs',
                )}>
                  {i + 1}
                </div>
                {i < stages.length - 1 && (
                  <div className="w-px flex-1 bg-cream-dark" style={{ minHeight: '16px' }} />
                )}
              </div>

              {/* Content */}
              <div className={cn('pb-5 flex-1', i === stages.length - 1 && 'pb-0')}>
                <p className={cn(
                  'font-medium text-ink',
                  stage.isMajor ? 'text-sm' : 'text-xs text-ink-light',
                )}>
                  {stage.title}
                </p>
                <p className="mt-0.5 text-xs text-ink-faint">{stage.detail}</p>

                {/* Tips */}
                <ul className="mt-2 space-y-1">
                  {stage.tips.map((tip, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-ink-light leading-relaxed">
                      <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-ink-faint" />
                      {tip}
                    </li>
                  ))}
                </ul>

                {/* Service hint */}
                {stage.serviceHint && (
                  <div className="mt-2 rounded-[var(--radius-sm)] bg-warmth-light/30 px-3 py-2">
                    <p className="text-xs text-warmth-dark">
                      <span className="font-medium">How we help:</span> {stage.serviceHint}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Additional context — progressive disclosure */}
        {!hasSafeguardingConcerns && (
          <Explainer label="How long does this take?">
            <div className="space-y-2">
              {isMarried ? (
                <>
                  <p>The divorce itself takes a minimum of 26 weeks. The financial settlement is usually what takes longer — it depends on complexity and whether you agree.</p>
                  <p>Amicable cases with mediation: typically 6-12 months total. Contested cases: 12-24+ months.</p>
                </>
              ) : (
                <p>Without a formal divorce process, the timeline depends on how quickly you can agree on finances{hasProperty ? ', property,' : ''}{hasChildren ? ' and children\'s arrangements' : ''}. Getting organised early makes everything faster.</p>
              )}
            </div>
          </Explainer>
        )}

        {isMarried && (
          <Explainer label="What does this typically cost?">
            <div className="space-y-2">
              <p>Divorce application: £612 (help with fees available).</p>
              <p>Consent order: £60 court fee + solicitor drafting (£400-£1,500).</p>
              <p>Mediation: £500 government voucher available. Average total £3,000-3,500 shared between both parties.</p>
              <p>This service is designed to reduce your need for expensive solicitor hours by helping you do the structured preparation yourself.</p>
            </div>
          </Explainer>
        )}

        {/* Waypoint celebration + bridge */}
        <div className="border-t border-cream-dark pt-6 space-y-4">
          <MicroMoment>
            You now have a clearer picture of the process than most people at this stage.
          </MicroMoment>

          <p className="text-sm text-ink leading-relaxed">
            Now let&apos;s build the detail behind this pathway — your finances, your priorities, and how ready you are. This becomes your personalised plan.
          </p>

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
