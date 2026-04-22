'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { InterviewLayout } from '@/components/interview/interview-layout'
import { CardSelect } from '@/components/interview/card-select'
import { Explainer } from '@/components/interview/explainer'
import { MicroMoment } from '@/components/interview/micro-moment'
import { Button } from '@/components/ui/button'
import { useInterviewContext } from '@/components/interview/interview-provider'

const RELATIONSHIP_OPTIONS = [
  { value: 'married', label: 'Married' },
  { value: 'civil_partnership', label: 'Civil partnership' },
  { value: 'cohabiting', label: 'Living together (not married)' },
  { value: 'other', label: 'Other' },
]

const LIVING_OPTIONS = [
  { value: 'yes', label: 'Yes, still living together' },
  { value: 'no', label: 'No, living separately' },
  { value: 'complicated', label: 'It\'s complicated' },
]

const CHILDREN_OPTIONS = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
]

const PROPERTY_OPTIONS = [
  { value: 'own_jointly', label: 'Own together' },
  { value: 'own_one_name', label: 'Own in one name' },
  { value: 'rent', label: 'Rent' },
  { value: 'other', label: 'Other' },
]

const PROCESS_OPTIONS = [
  { value: 'not_yet', label: 'Not yet started' },
  { value: 'discussed', label: 'We\'ve discussed it' },
  { value: 'formally_underway', label: 'Formally underway' },
]

const RELATIONSHIP_QUALITY_OPTIONS = [
  { value: 'amicable', label: 'Amicable', description: 'We can have reasonable conversations' },
  { value: 'difficult', label: 'Difficult but manageable', description: 'It\'s hard, but we can communicate' },
  { value: 'high_conflict', label: 'High conflict', description: 'Communication is very difficult' },
  { value: 'safety_concerns', label: 'I have safety concerns', description: 'I\'m worried about my safety or my children\'s safety' },
]

type SituationStep = 'relationship' | 'living' | 'children' | 'property' | 'process' | 'quality' | 'financial_control'

const STEP_ORDER: SituationStep[] = ['relationship', 'living', 'children', 'property', 'process', 'quality', 'financial_control']

export default function SituationPage() {
  const router = useRouter()
  const { session, updateSituation, interviewSteps } = useInterviewContext()
  const [currentStep, setCurrentStep] = useState<SituationStep>('relationship')

  const currentIndex = STEP_ORDER.indexOf(currentStep)

  function nextSubStep() {
    const nextIndex = currentIndex + 1
    if (nextIndex < STEP_ORDER.length) {
      setCurrentStep(STEP_ORDER[nextIndex])
    } else {
      router.push('/start/route')
    }
  }

  function canContinue(): boolean {
    switch (currentStep) {
      case 'relationship': return session.situation.relationship_status !== null
      case 'living': return session.situation.living_together !== null
      case 'children': return session.situation.has_children !== null
      case 'property': return session.situation.property_status !== null
      case 'process': return session.situation.process_status !== null
      case 'quality': return session.situation.relationship_quality !== null
      case 'financial_control': return session.situation.financial_control_concerns !== null
      default: return false
    }
  }

  return (
    <InterviewLayout currentStep="situation" steps={interviewSteps}>
      <div className="space-y-8">
        {/* Step heading */}
        <div>
          <h1 className="font-heading text-2xl font-bold text-ink">
            Your situation
          </h1>
          <p className="mt-2 text-sm text-ink-secondary leading-relaxed">
            A few questions to help us understand where you are. Nothing is shared.
          </p>
        </div>

        {/* Current sub-question */}
        {currentStep === 'relationship' && (
          <div className="space-y-5">
            <p className="text-ink">Are you married or in a civil partnership?</p>
            <CardSelect
              options={RELATIONSHIP_OPTIONS}
              value={session.situation.relationship_status}
              onChange={(v) => updateSituation({ relationship_status: v as InterviewSessionSituationRelationshipStatus })}
            />
            {session.situation.relationship_status === 'cohabiting' && (
              <Explainer label="What this means for you">
                <p>As cohabiting partners, your legal rights are different from married couples. There&apos;s no such thing as &quot;common law marriage&quot; in England and Wales — even if you&apos;ve lived together for many years. We&apos;ll tailor your route to reflect this.</p>
              </Explainer>
            )}
            {session.situation.relationship_status !== 'cohabiting' && (
              <Explainer label="Why we ask this">
                <p>The legal process differs depending on whether you&apos;re married, in a civil partnership, or cohabiting. This helps us show you the right route.</p>
              </Explainer>
            )}
          </div>
        )}

        {currentStep === 'living' && (
          <div className="space-y-5">
            <p className="text-ink">Are you currently living together?</p>
            <CardSelect
              options={LIVING_OPTIONS}
              value={session.situation.living_together}
              onChange={(v) => updateSituation({ living_together: v as 'yes' | 'no' | 'complicated' })}
              columns={1}
            />
            <MicroMoment>
              Many people are still living together when they begin this process. That&apos;s completely normal.
            </MicroMoment>
          </div>
        )}

        {currentStep === 'children' && (
          <div className="space-y-5">
            <p className="text-ink">Do you have children together?</p>
            <CardSelect
              options={CHILDREN_OPTIONS}
              value={session.situation.has_children === null ? null : session.situation.has_children ? 'yes' : 'no'}
              onChange={(v) => updateSituation({ has_children: v === 'yes' })}
            />
          </div>
        )}

        {currentStep === 'property' && (
          <div className="space-y-5">
            <p className="text-ink">What&apos;s your housing situation?</p>
            <CardSelect
              options={PROPERTY_OPTIONS}
              value={session.situation.property_status}
              onChange={(v) => updateSituation({ property_status: v as 'own_jointly' | 'own_one_name' | 'rent' | 'other' })}
            />
          </div>
        )}

        {currentStep === 'process' && (
          <div className="space-y-5">
            <p className="text-ink">Where are you in the separation process?</p>
            <CardSelect
              options={PROCESS_OPTIONS}
              value={session.situation.process_status}
              onChange={(v) => updateSituation({ process_status: v as 'not_yet' | 'discussed' | 'formally_underway' })}
              columns={1}
            />
          </div>
        )}

        {currentStep === 'quality' && (
          <div className="space-y-5">
            <p className="text-ink">How would you describe the relationship with your partner right now?</p>
            <CardSelect
              options={RELATIONSHIP_QUALITY_OPTIONS}
              value={session.situation.relationship_quality}
              onChange={(v) => updateSituation({ relationship_quality: v as 'amicable' | 'difficult' | 'high_conflict' | 'safety_concerns' })}
              columns={1}
            />
            {session.situation.relationship_quality === 'high_conflict' && (
              <Explainer label="What this means for your journey">
                <p>High-conflict situations are more common than you might think. It doesn&apos;t mean you can&apos;t reach a resolution — but the route may look different. We&apos;ll adjust our guidance to reflect this, and help you understand when professional support is particularly important.</p>
              </Explainer>
            )}
            {session.situation.relationship_quality === 'safety_concerns' && (
              <div className="rounded-[var(--radius-md)] border border-[var(--color-amber-50)] bg-[#FFFBEB] p-5">
                <p className="text-sm font-medium text-ink">You&apos;re not alone.</p>
                <p className="mt-2 text-sm text-ink-secondary leading-relaxed">
                  If you or your children are in immediate danger, call 999. For confidential support, you can contact the National Domestic Abuse Helpline on 0808 2000 247 (24 hours, free).
                </p>
                <Explainer label="More support options">
                  <div className="space-y-2">
                    <p>Women&apos;s Aid Live Chat: womensaid.org.uk (7 days, 10am-6pm)</p>
                    <p>Men&apos;s Advice Line: 0808 8010 327 (Mon-Fri 10am-8pm)</p>
                    <p>Galop (LGBT+): 0800 999 5428</p>
                    <p>Surviving Economic Abuse: survivingeconomicabuse.org</p>
                  </div>
                </Explainer>
              </div>
            )}
            {session.situation.relationship_quality === 'difficult' && (
              <MicroMoment>
                Difficult but manageable is where most people are. The structure and clarity this service provides can help make those conversations easier.
              </MicroMoment>
            )}
          </div>
        )}

        {currentStep === 'financial_control' && (
          <div className="space-y-5">
            <p className="text-ink">Do you feel safe making decisions about your finances without your partner&apos;s permission?</p>
            <CardSelect
              options={[
                { value: 'yes', label: 'Yes', description: 'I can make financial decisions freely' },
                { value: 'no', label: 'No', description: 'My partner controls or restricts my access to money or documents' },
                { value: 'unsure', label: 'I\'m not sure', description: 'I haven\'t thought about it, or it\'s complicated' },
              ]}
              value={session.situation.financial_control_concerns === null ? null : session.situation.financial_control_concerns ? 'no' : 'yes'}
              onChange={(v) => updateSituation({ financial_control_concerns: v === 'no' })}
              columns={1}
            />
            {session.situation.financial_control_concerns && (
              <div className="rounded-[var(--radius-md)] border border-[var(--color-amber-50)] bg-[#FFFBEB] p-5">
                <p className="text-sm font-medium text-ink">This is more common than you might think.</p>
                <p className="mt-2 text-sm text-ink-secondary leading-relaxed">
                  Controlling someone&apos;s access to money is a form of economic abuse. You can speak to Surviving Economic Abuse at survivingeconomicabuse.org, or call the National Domestic Abuse Helpline on 0808 2000 247.
                </p>
              </div>
            )}
            <MicroMoment>
              This helps us tailor our guidance. Your answers are private and never shared.
            </MicroMoment>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4">
          {currentIndex > 0 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(STEP_ORDER[currentIndex - 1])}
              className="text-sm text-ink-secondary transition-colors hover:text-ink"
            >
              Back
            </button>
          ) : (
            <div />
          )}
          <Button
            onClick={nextSubStep}
            disabled={!canContinue()}
          >
            Continue
          </Button>
        </div>
      </div>
    </InterviewLayout>
  )
}

// Type helper to avoid inline cast verbosity
type InterviewSessionSituationRelationshipStatus = NonNullable<ReturnType<typeof useInterviewContext>['session']['situation']['relationship_status']>
