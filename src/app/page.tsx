import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-2xl px-6 py-28 text-center sm:py-36">
          <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">
            Financial disclosure, sorted.
          </h1>
          <p className="mx-auto mt-8 max-w-lg text-lg leading-relaxed text-ink-secondary">
            The 28-page Form E nightmare ends here. Connect your bank, confirm the facts, share with your mediator. Minutes, not months.
          </p>
          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/start">
              <Button size="lg">Build my free plan</Button>
            </Link>
          </div>
          <p className="mt-5 text-sm text-ink-tertiary">
            Start free, no sign-up needed. Upgrade when you&apos;re ready.
          </p>
        </section>

        {/* 4-phase journey */}
        <section className="border-t border-[var(--color-grey-100)] bg-[var(--color-grey-50)] py-20">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-center font-heading text-2xl font-bold text-ink">
              Four steps to a clean settlement
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-center text-sm leading-relaxed text-ink-secondary">
              From &ldquo;where do I start?&rdquo; to court-ready documents. Each step builds on the last.
            </p>

            <div className="mt-14 space-y-12 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
              {/* Orientate */}
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FEF2F2] text-lg font-medium text-[#E5484D]">
                  1
                </div>
                <h3 className="mt-5 font-heading text-base font-semibold text-ink">Orientate</h3>
                <p className="mt-1 text-xs font-medium text-[#E5484D]">Free</p>
                <p className="mt-3 text-sm leading-relaxed text-ink-secondary">
                  Understand your process, see your personalised route, know what to do first. Your free separation plan in 5 minutes.
                </p>
              </div>

              {/* Prepare */}
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FEF2F2] text-lg font-medium text-[#E5484D]">
                  2
                </div>
                <h3 className="mt-5 font-heading text-base font-semibold text-ink">Prepare</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-secondary">
                  Connect your bank via secure Open Banking. We extract income, spending, debts, pensions — everything. You confirm. No forms, no faff.
                </p>
              </div>

              {/* Share & Negotiate */}
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FEF2F2] text-lg font-medium text-[#E5484D]">
                  3
                </div>
                <h3 className="mt-5 font-heading text-base font-semibold text-ink">Share &amp; Negotiate</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-secondary">
                  Invite your mediator or solicitor. Controlled access, structured proposals, tracked agreements. Drama-free, documented.
                </p>
              </div>

              {/* Finalise */}
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FEF2F2] text-lg font-medium text-[#E5484D]">
                  4
                </div>
                <h3 className="mt-5 font-heading text-base font-semibold text-ink">Finalise</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-secondary">
                  Court-ready documentation at a press of a button. Consent order prep, D81, complete disclosure pack. Solicitor costs slashed.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pain points → solutions */}
        <section className="py-20">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-center font-heading text-2xl font-bold text-ink">
              Built for the reality of separation
            </h2>
            <div className="mt-12 space-y-6">
              <div className="rounded-[var(--radius-md)] border border-[var(--color-grey-100)] p-6">
                <p className="text-sm font-semibold text-ink">Hassle-free disclosure via Open Banking</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                  No chasing bank statements, no scanning documents, no filling in spreadsheets. Securely connect your bank account and your financial picture builds itself in seconds.
                </p>
              </div>
              <div className="rounded-[var(--radius-md)] border border-[var(--color-grey-100)] p-6">
                <p className="text-sm font-semibold text-ink">Clean, managed communication</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                  Share your disclosure on your terms. Controlled access for mediators, solicitors, and your former partner. Every proposal tracked, every agreement documented. No late-night emails, no he-said-she-said.
                </p>
              </div>
              <div className="rounded-[var(--radius-md)] border border-[var(--color-grey-100)] p-6">
                <p className="text-sm font-semibold text-ink">Court-ready at a press of a button</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                  Structured output that solicitors can use directly. Consent order preparation, D81 statements, complete disclosure packs. What used to cost £5,000+ in solicitor hours, done in an afternoon.
                </p>
              </div>
              <div className="rounded-[var(--radius-md)] border border-[var(--color-grey-100)] p-6">
                <p className="text-sm font-semibold text-ink">You stay in control</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                  Your data is encrypted and private. Nothing is shared unless you choose to share it. No lock-in, no hidden fees, no pressure. Start free and upgrade when you&apos;re ready.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-[var(--color-grey-100)] py-20">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <h2 className="font-heading text-2xl font-bold text-ink">
              Start with a free plan. Upgrade when it makes sense.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink-secondary">
              Build your personalised separation plan in 5 minutes. See your route, understand your options, know your next steps — all free.
            </p>
            <div className="mt-8">
              <Link href="/start">
                <Button size="lg">Build my free plan</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
