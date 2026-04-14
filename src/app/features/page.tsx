import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'

const PHASES = [
  {
    number: '1',
    name: 'Orientate',
    tagline: 'Understand where you stand — in 5 minutes',
    price: 'Free',
    description: 'Most people start separation with no idea what the process actually involves. Orientate gives you a clear, personalised picture of what lies ahead — no legal jargon, no pressure, no sign-up.',
    features: [
      { title: 'Personalised pathway', detail: 'Answer a few questions and see the exact steps for your specific situation — married or cohabiting, with or without children, amicable or complex.' },
      { title: 'AI-generated plan', detail: 'A personalised assessment of your situation, priorities, and what to focus on first. Powered by the same AI that builds your financial picture later.' },
      { title: 'Confidence map', detail: 'See what you know and where the gaps are. Understand your starting position before spending a penny.' },
      { title: 'PDF export', detail: 'Download your plan and take it to a solicitor, mediator, or just keep it for yourself.' },
    ],
  },
  {
    number: '2',
    name: 'Prepare',
    tagline: 'Build your complete financial picture automatically',
    price: '£49',
    description: 'The 28-page Form E is the most dreaded document in divorce. Prepare replaces the nightmare with a 15-minute bank connection. Your income, spending, debts, pensions, property — extracted, structured, and confirmed.',
    features: [
      { title: 'Open Banking connection', detail: 'Securely connect your bank account via Tink. Read-only access — we can see your transactions but never move your money.' },
      { title: 'Automatic extraction', detail: 'Income sources, regular payments, spending categories, pension contributions, mortgage payments — all identified and categorised automatically.' },
      { title: 'Confirm-by-exception', detail: 'We show you what we found. You confirm, correct, or add what\'s missing. One question at a time, no forms.' },
      { title: 'Commonly omitted prompts', detail: 'App-based bank accounts, closed accounts, director\'s loans — the things people forget that solicitors always ask about.' },
      { title: 'Spending analysis', detail: 'Your monthly outgoings broken down by category. Form E section 3.1 done in seconds, not hours.' },
      { title: 'Financial summary', detail: 'A complete, structured picture of your finances. Every item sourced from bank data or your confirmation.' },
    ],
  },
  {
    number: '3',
    name: 'Share & Negotiate',
    tagline: 'Controlled disclosure and tracked proposals',
    price: '£99',
    description: 'Disclosure shouldn\'t mean forwarding bank statements by email. Share gives your mediator or solicitor structured access to your financial picture, and tracks every proposal so nothing falls through the cracks.',
    features: [
      { title: 'Invite your mediator', detail: 'Generate a secure link. Your mediator sees a structured summary — not raw bank data. Professional, controlled, documented.' },
      { title: 'Partner invitation', detail: 'Invite your former partner to build their own financial picture. Both sides visible to the mediator, neither can edit the other\'s.' },
      { title: 'Proposal tracking', detail: 'Create proposals, receive counter-proposals, track what\'s agreed and what\'s still open. A clear record for every mediation session.' },
      { title: 'Mediation prep packs', detail: 'Before each session: what\'s agreed, what\'s outstanding, the key numbers. Walk in prepared, not scrambling.' },
    ],
  },
  {
    number: '4',
    name: 'Finalise',
    tagline: 'Court-ready documents at the press of a button',
    price: '£149',
    description: 'The last mile of financial settlement is paperwork. Finalise generates the structured information your solicitor needs to draft a consent order — slashing the hours (and cost) of professional document preparation.',
    features: [
      { title: 'Consent order information pack', detail: 'Everything a solicitor needs: agreed asset division, income positions, pension treatment, property arrangements. Structured and cross-referenced.' },
      { title: 'D81 statement preparation', detail: 'Pre and post-settlement positions for both parties. The document the court requires alongside every consent order.' },
      { title: 'Complete disclosure pack', detail: 'Your full financial disclosure in a single, structured document. Every item linked to its source — bank data, your confirmation, or supporting evidence.' },
      { title: 'Solicitor-ready output', detail: 'Formatted for professional use. What typically costs £3,000–5,000 in solicitor preparation time, done in an afternoon.' },
    ],
  },
]

export default function FeaturesPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-[1080px] px-6 py-20">
          <div className="text-center">
            <h1 className="font-heading text-3xl font-bold text-ink sm:text-4xl">
              From &ldquo;where do I start?&rdquo; to court-ready
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-ink-secondary">
              Four phases, each building on the last. Start free, upgrade when it makes sense. Every step designed to make financial disclosure faster, cheaper, and less stressful.
            </p>
          </div>

          <div className="mt-16 space-y-16">
            {PHASES.map((phase) => (
              <div key={phase.name}>
                {/* Phase header */}
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[15px] font-bold text-white"
                    style={{ backgroundColor: 'var(--color-red-500)' }}
                  >
                    {phase.number}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="font-heading text-xl font-bold text-ink">{phase.name}</h2>
                      <span className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-ink-tertiary" style={{ backgroundColor: 'var(--color-grey-50)' }}>
                        {phase.price}
                      </span>
                    </div>
                    <p className="mt-1 text-[15px] font-medium text-ink-secondary">{phase.tagline}</p>
                  </div>
                </div>

                {/* Phase description */}
                <p className="mt-4 ml-14 text-[15px] leading-relaxed text-ink-secondary">
                  {phase.description}
                </p>

                {/* Feature cards */}
                <div className="mt-6 ml-14 grid gap-4 sm:grid-cols-2">
                  {phase.features.map((feature) => (
                    <div
                      key={feature.title}
                      className="bg-white p-5"
                      style={{ borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-card)' }}
                    >
                      <p className="text-[14px] font-semibold text-ink">{feature.title}</p>
                      <p className="mt-2 text-[13px] leading-relaxed text-ink-secondary">{feature.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-20 text-center">
            <h2 className="font-heading text-2xl font-bold text-ink">
              Ready to start?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[15px] text-ink-secondary">
              Build your free separation plan in 5 minutes. No sign-up, no commitment.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/start">
                <Button size="lg">Build my free plan</Button>
              </Link>
              <Link href="/pricing">
                <Button variant="secondary" size="lg">See pricing</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
