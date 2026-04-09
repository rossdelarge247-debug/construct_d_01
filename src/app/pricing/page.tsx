import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-6 py-28 text-center">
          <h1 className="font-heading text-3xl font-bold text-ink">Pricing</h1>
          <p className="mt-6 text-ink-light leading-relaxed">
            Pricing information coming soon.
          </p>
          <p className="mt-2 text-sm text-ink-faint">
            This page is a placeholder and will be updated before public launch.
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
