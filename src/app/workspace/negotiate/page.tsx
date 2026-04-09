'use client'

import { FuturePhasePage } from '@/components/workspace/future-phase-page'
import { useWorkspace } from '@/hooks/use-workspace'

export default function NegotiatePage() {
  const { items } = useWorkspace()

  const priorities = items.length > 0 ? [
    { label: 'Financial items', value: `${items.length} items to build proposals from` },
  ] : undefined

  return (
    <FuturePhasePage
      phase="work_through_it"
      title="Work through it"
      subtitle="Where proposals, counter-proposals, and mediation happen — tracked and structured."
      whatHappens={[
        'You shape initial proposals on finances, property, pensions, and children\'s arrangements',
        'The other party responds with their position — we track what changed',
        'Mediation sessions are logged — upload notes, emails, or summaries and we extract the key points',
        'Counter-proposals are compared side by side so you can see what moved',
        'What\'s agreed, what\'s disputed, and what\'s still to discuss is always clear',
        'An agenda is generated for each mediation session based on outstanding items',
      ]}
      whatYouNeed={[
        'Disclosure exchanged — both parties have shared their financial picture',
        'Clear understanding of what you\'re aiming for (from your plan)',
        'Readiness level: "Disclosure complete"',
      ]}
      howWeHelp={[
        'Track proposals and counter-proposals with version history — see exactly what changed and when',
        'Upload mediation notes or emails and we extract the key decisions and action items',
        'Automatically update your position when mediation produces agreement on specific points',
        'Generate structured agendas for each mediation session based on what\'s still unresolved',
        'Keep a complete negotiation history — the "memory" of your case that survives across sessions',
      ]}
      emergingData={priorities}
    />
  )
}
