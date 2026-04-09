'use client'

import { FuturePhasePage } from '@/components/workspace/future-phase-page'

export default function AgreePage() {
  return (
    <FuturePhasePage
      phase="reach_agreement"
      title="Reach agreement"
      subtitle="Resolve remaining points and capture the final agreed position."
      whatHappens={[
        'Outstanding disputed items are clearly listed with both parties\' positions',
        'Remaining differences are narrowed through structured discussion',
        'Each resolved point is captured and locked — no going backwards',
        'The final agreed position covers finances, property, pensions, and children',
        'Everything is documented and ready to move to formalisation',
      ]}
      whatYouNeed={[
        'Negotiation underway — proposals and counter-proposals exchanged',
        'Most items either agreed or close to agreement',
        'Readiness level: "Negotiation in progress"',
      ]}
      howWeHelp={[
        'See exactly what\'s agreed, what\'s disputed, and what\'s outstanding — at a glance',
        'Track the resolution of each disputed point',
        'Generate a structured summary of the full agreed position',
        'Prepare everything for the final step — making it legally binding',
      ]}
    />
  )
}
