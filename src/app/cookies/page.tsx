import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function CookiesPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-6 py-28">
          <h1 className="font-heading text-3xl font-medium text-ink">Cookie policy</h1>
          <div className="mt-8 rounded-[var(--radius-md)] border border-amber-light bg-amber-light/50 p-5">
            <p className="text-sm text-ink-light">
              This is a draft. Cookie policy will be finalised before public launch.
            </p>
          </div>
          <div className="mt-10 space-y-5 text-sm leading-relaxed text-ink-light">
            <p>We use essential cookies to keep the service working. We use analytics cookies to understand how people use the service so we can improve it.</p>
            <p>Full cookie policy to follow.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
