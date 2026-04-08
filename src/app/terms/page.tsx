import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-6 py-28">
          <h1 className="font-heading text-3xl font-medium text-ink">Terms of service</h1>
          <div className="mt-8 rounded-[var(--radius-md)] border border-amber-light bg-amber-light/50 p-5">
            <p className="text-sm text-ink-light">
              This is a draft. Terms will be reviewed by a legal professional before public launch.
            </p>
          </div>
          <div className="mt-10 space-y-5 text-sm leading-relaxed text-ink-light">
            <p>This service provides structured planning tools and guidance for people navigating separation in England and Wales.</p>
            <p>This service is not a substitute for regulated legal advice. It does not provide legal advice, and no solicitor-client relationship is created by using this service.</p>
            <p>Full terms to follow.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
