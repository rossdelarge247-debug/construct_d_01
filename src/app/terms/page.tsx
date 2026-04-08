import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
          <h1 className="text-3xl font-semibold text-slate-900">Terms of service</h1>
          <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm text-amber-800">
              This is a draft. Terms will be reviewed by a legal professional before public launch.
            </p>
          </div>
          <div className="mt-8 space-y-4 text-sm leading-relaxed text-slate-600">
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
