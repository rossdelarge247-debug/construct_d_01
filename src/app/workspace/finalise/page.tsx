'use client'

import { FuturePhasePage } from '@/components/workspace/future-phase-page'

export default function FinalisePage() {
  return (
    <FuturePhasePage
      phase="make_it_official"
      title="Make it official"
      subtitle="Prepare the documents needed to formalise your agreement through the court."
      whatHappens={[
        'Your agreed position is structured into the information needed for a draft consent order',
        'A D81 (Statement of Information) is prepared from your financial data',
        'Form A (Notice of Application) supporting data is organised',
        'A complete disclosure pack is assembled with all evidence linked',
        'Everything is prepared for your solicitor to review and submit',
        'Court fee: £60 for a consent order — usually no hearing required',
      ]}
      whatYouNeed={[
        'Full agreement reached on all financial and children\'s matters',
        'Both parties\' disclosure complete and exchanged',
        'All evidence linked and confirmed',
        'Readiness level: "Agreement reached"',
      ]}
      howWeHelp={[
        'Generate structured information for a draft consent order — reducing solicitor hours and cost',
        'Prepare the D81 Statement of Information with all data already structured',
        'Create a complete disclosure pack linked to evidence',
        'Generate an adviser-ready bundle your solicitor can work from immediately',
        'Track submission status and court response',
      ]}
      upsellTier="enhanced"
    />
  )
}
