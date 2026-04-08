import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
          <h1 className="text-3xl font-semibold text-slate-900">Privacy policy</h1>
          <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm text-amber-800">
              This is a draft privacy policy. It will be reviewed by a legal professional before public launch.
            </p>
          </div>
          <div className="mt-8 space-y-4 text-sm leading-relaxed text-slate-600">
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
