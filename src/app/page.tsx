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
        <section className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 sm:py-32">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Separation doesn&apos;t have to feel overwhelming.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-500">
            Understand the process. Shape a plan. Know what to do next.
          </p>
          <div className="mt-10">
            <Link href="/start">
              <Button size="lg">Get started</Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-slate-400">
            No sign-up needed. Takes about 25 minutes.
          </p>
        </section>

        {/* How it works */}
        <section className="border-t border-slate-100 bg-white py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="text-center text-2xl font-semibold text-slate-900">
              How it works
            </h2>
            <div className="mt-12 grid gap-8 sm:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-lg font-semibold text-slate-600">
                  1
                </div>
                <h3 className="mt-4 font-medium text-slate-900">Tell us your situation</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Answer a few questions about where you are. No legal jargon. No pressure.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-lg font-semibold text-slate-600">
                  2
                </div>
                <h3 className="mt-4 font-medium text-slate-900">See your route</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Understand the likely process for your specific situation, in plain English.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-lg font-semibold text-slate-600">
                  3
                </div>
                <h3 className="mt-4 font-medium text-slate-900">Get your plan</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Shape a starting position on children, housing, and finances. Know exactly what to focus on next.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust */}
        <section className="border-t border-slate-100 py-12">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <p className="text-sm text-slate-400">
              Your information is private and encrypted. Nothing is shared unless you choose to share it.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
