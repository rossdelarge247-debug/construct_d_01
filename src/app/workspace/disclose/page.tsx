'use client'

import { FuturePhasePage } from '@/components/workspace/future-phase-page'
import { useWorkspace } from '@/hooks/use-workspace'

export default function DisclosePage() {
  const { items, summary } = useWorkspace()

  const emergingData = items.length > 0 ? [
    { label: 'Items captured', value: `${items.length} financial items` },
    { label: 'Confirmed', value: `${items.filter(i => i.status === 'confirmed').length} items with evidence` },
    { label: 'Estimated', value: `${items.filter(i => i.confidence === 'estimated').length} items need evidence` },
    ...(summary.total_assets > 0 ? [{ label: 'Total assets', value: `£${summary.total_assets.toLocaleString()}` }] : []),
  ] : undefined

  return (
    <FuturePhasePage
      phase="share_and_disclose"
      title="Share & disclose"
      subtitle="When your picture is complete, this is where you prepare to share it with the other party."
      whatHappens={[
        'Your financial information gets structured into a disclosure-ready format — equivalent to Form E',
        'You choose what to share and control who sees what',
        'The other party shares their disclosure back',
        'Open questions are raised and tracked — "What about your ISA?" "Where are the pension details?"',
        'Every claim is linked to evidence, making your disclosure thorough and credible',
      ]}
      whatYouNeed={[
        'Key financial items confirmed with evidence — bank statements, payslips, valuations',
        'Pension CETVs received (or at least requested)',
        'Property valued — even an estate agent estimate helps',
        'Children\'s arrangements shaped (if relevant)',
        'Readiness level: "Ready for formal disclosure"',
      ]}
      howWeHelp={[
        'We structure your data into Form E-equivalent sections automatically — no wrestling with 28-page forms',
        'Track what\'s been shared and what\'s outstanding',
        'Raise and manage open questions between parties',
        'Keep everything linked to evidence — every number traceable to a document',
        'Generate a disclosure pack ready to share with your mediator or solicitor',
      ]}
      emergingData={emergingData}
    />
  )
}
