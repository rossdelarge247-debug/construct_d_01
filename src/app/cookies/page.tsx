import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function CookiesPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
          <h1 className="text-3xl font-semibold text-slate-900">Cookie policy</h1>
          <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm text-amber-800">
              This is a draft. Cookie policy will be finalised before public launch.
            </p>
          </div>
          <div className="mt-8 space-y-4 text-sm leading-relaxed text-slate-600">
            <p>We use essential cookies to keep the service working. We use analytics cookies to understand how people use the service so we can improve it.</p>
            <p>Full cookie policy to follow.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
