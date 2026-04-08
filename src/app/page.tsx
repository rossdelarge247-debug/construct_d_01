import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero — a deep breath, not a sales pitch */}
        <section className="mx-auto max-w-2xl px-6 py-28 text-center sm:py-36">
          <h1 className="font-heading text-4xl font-medium leading-tight tracking-tight text-ink sm:text-5xl">
            Separation doesn&apos;t have to feel overwhelming.
          </h1>
          <p className="mx-auto mt-8 max-w-md text-lg leading-relaxed text-ink-light">
            Understand the process. Shape a plan. Know what to do next.
          </p>
          <div className="mt-12">
            <Link href="/start">
              <Button size="lg">Get started</Button>
            </Link>
          </div>
          <p className="mt-5 text-sm text-ink-faint">
            No sign-up needed. Takes about 25 minutes.
          </p>
        </section>

        {/* How it works */}
        <section className="border-t border-cream-dark bg-cream-dark/50 py-20">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-center font-heading text-2xl font-medium text-ink">
              How it works
            </h2>
            <div className="mt-16 grid gap-12 sm:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-warmth-light text-lg font-medium text-warmth-dark">
                  1
                </div>
                <h3 className="mt-5 font-heading text-lg font-medium text-ink">Tell us your situation</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-light">
                  Answer a few questions about where you are. No legal jargon. No pressure.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-warmth-light text-lg font-medium text-warmth-dark">
                  2
                </div>
                <h3 className="mt-5 font-heading text-lg font-medium text-ink">See your route</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-light">
                  Understand the likely process for your specific situation, in plain English.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-warmth-light text-lg font-medium text-warmth-dark">
                  3
                </div>
                <h3 className="mt-5 font-heading text-lg font-medium text-ink">Get your plan</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-light">
                  Shape a starting position on children, housing, and finances. Know exactly what to focus on next.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust */}
        <section className="py-16">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <p className="text-sm leading-relaxed text-ink-faint">
              Your information is private and encrypted.
              Nothing is shared unless you choose to share it.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
