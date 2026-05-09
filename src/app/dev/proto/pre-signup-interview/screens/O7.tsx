'use client';

import { tokens } from '@/styles/tokens';
import { ScreenShell } from '../components/ScreenShell';
import { JourneyTimeline } from '../components/JourneyTimeline';
import { PlanSection } from '../components/PlanSection';
import { useProto } from '../lib/proto-context';
import { buildPlanFromAnswers } from '../lib/build-plan';

export function O7() {
  const { answers, next, back, step } = useProto();
  const plan = buildPlanFromAnswers(answers);

  return (
    <ScreenShell
      step={step}
      heading="Your picture, taking shape"
      helper="From what you’ve told us. You can change any answer by going back."
      ctaLabel="See what’s next"
      onContinue={next}
      onBack={back}
    >
      <PlanSection heading="Your situation">
        <p style={{ margin: 0 }}>{plan.situationSummary}</p>
      </PlanSection>

      <PlanSection heading="The journey">
        <JourneyTimeline stages={plan.journeyStages} />
      </PlanSection>

      <PlanSection heading="What needs to happen">
        <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {plan.whatNeedsToHappen.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </PlanSection>

      <PlanSection heading={plan.conventionalPath.headline}>
        <p style={{ margin: 0, font: `600 18px/1.3 ${tokens.font.sans}`, color: tokens.color.phase.reconcile.accent }}>
          {plan.conventionalPath.cost}
        </p>
        <p style={{ margin: '6px 0 0', font: `400 14px/1.5 ${tokens.font.sans}`, color: tokens.color.text.sub }}>
          {plan.conventionalPath.timeline}
        </p>
        <p style={{ margin: '10px 0 0' }}>{plan.conventionalPath.body}</p>
      </PlanSection>

      <PlanSection heading={plan.howDecoupleHelps.headline}>
        <p style={{ margin: 0 }}>{plan.howDecoupleHelps.body}</p>
        <ul style={{ margin: '10px 0 0', paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {plan.howDecoupleHelps.pillars.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </PlanSection>

      {plan.personalisedNotes.length > 0 && (
        <PlanSection heading="Your specific situation">
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {plan.personalisedNotes.map((n) => (
              <li key={n.trigger}>{n.body}</li>
            ))}
          </ul>
        </PlanSection>
      )}
    </ScreenShell>
  );
}
