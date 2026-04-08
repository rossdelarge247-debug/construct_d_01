import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-6 py-28">
          <h1 className="font-heading text-3xl font-medium text-ink">Privacy policy</h1>
          <div className="mt-8 rounded-[var(--radius-md)] border border-amber-light bg-amber-light/50 p-5">
            <p className="text-sm text-ink-light">
              This is a draft privacy policy. It will be reviewed by a legal professional before public launch.
            </p>
          </div>
          <div className="mt-10 space-y-5 text-sm leading-relaxed text-ink-light">
            <p>Your privacy matters to us. This service handles sensitive personal and financial information with care.</p>
            <p>We collect only the information you choose to provide. Your data is encrypted in transit and at rest. We do not sell your data to third parties.</p>
            <p>Full privacy policy to follow.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
