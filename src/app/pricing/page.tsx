import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'

const TIERS = [
  {
    name: 'Prepare',
    price: '£49',
    period: 'one-off',
    description: 'Build your complete financial picture from bank data.',
    features: [
      'Secure Open Banking connection',
      'Automatic income, spending & debt extraction',
      'Guided confirmation flow',
      'Full financial summary',
      'Spending analysis',
      'PDF export of your disclosure',
    ],
    cta: 'Get started',
    highlighted: false,
  },
  {
    name: 'Share & Negotiate',
    price: '£99',
    period: 'one-off',
    description: 'Everything in Prepare, plus share and track proposals.',
    features: [
      'Everything in Prepare',
      'Invite your partner or mediator',
      'Controlled access sharing',
      'Proposal and counter-proposal tracking',
      'Mediation session prep packs',
      'Structured agreement summary',
    ],
    cta: 'Get started',
    highlighted: true,
    badge: 'Most popular',
  },
  {
    name: 'Finalise',
    price: '£149',
    period: 'one-off',
    description: 'Everything in Share, plus court-ready documentation.',
    features: [
      'Everything in Share & Negotiate',
      'Consent order information pack',
      'D81 statement preparation',
      'Complete disclosure document pack',
      'Solicitor-ready structured output',
      'Priority support',
    ],
    cta: 'Get started',
    highlighted: false,
  },
]

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-[1080px] px-6 py-20">
          <div className="text-center">
            <h1 className="font-heading text-3xl font-bold text-ink sm:text-4xl">
              Simple pricing. No surprises.
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-ink-secondary">
              Start with a free plan to understand your situation. Upgrade when you&apos;re ready to build, share, or finalise your financial disclosure.
            </p>
          </div>

          {/* Free tier callout */}
          <div
            className="mx-auto mt-12 max-w-[600px] bg-white p-6 text-center"
            style={{ borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-card)' }}
          >
            <p className="text-[13px] font-semibold uppercase tracking-wider text-ink-tertiary">Always free</p>
            <h2 className="mt-2 font-heading text-xl font-bold text-ink">Orientate</h2>
            <p className="mt-2 text-[15px] text-ink-secondary">
              Personalised separation pathway, AI-generated plan, confidence assessment, PDF export. No sign-up needed.
            </p>
            <div className="mt-5">
              <Link href="/start">
                <Button variant="secondary">Build my free plan</Button>
              </Link>
            </div>
          </div>

          {/* Paid tiers */}
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className="relative flex flex-col bg-white p-7"
                style={{
                  borderRadius: 'var(--radius-card)',
                  boxShadow: tier.highlighted ? '0 4px 24px rgba(0,0,0,0.12)' : 'var(--shadow-card)',
                  border: tier.highlighted ? '2px solid var(--color-red-500)' : '1px solid var(--color-grey-100)',
                }}
              >
                {tier.badge && (
                  <span
                    className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[11px] font-semibold text-white"
                    style={{ backgroundColor: 'var(--color-red-500)' }}
                  >
                    {tier.badge}
                  </span>
                )}

                <div>
                  <h3 className="font-heading text-lg font-bold text-ink">{tier.name}</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-ink">{tier.price}</span>
                    <span className="text-[13px] text-ink-tertiary">{tier.period}</span>
                  </div>
                  <p className="mt-3 text-[13px] leading-relaxed text-ink-secondary">{tier.description}</p>
                </div>

                <ul className="mt-6 flex-1 space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-[13px] text-ink-secondary">
                      <span className="mt-0.5 text-[var(--color-green-600)]">&#10003;</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Button
                    variant={tier.highlighted ? 'primary' : 'secondary'}
                    className="w-full"
                  >
                    {tier.cta}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom note */}
          <div className="mt-12 text-center">
            <p className="text-[13px] text-ink-tertiary">
              All prices are one-off payments, not subscriptions. Your free plan is yours to keep forever.
              <br />
              Prices shown are indicative and may change before launch.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
