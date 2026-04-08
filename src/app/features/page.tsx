import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function FeaturesPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
          <h1 className="text-3xl font-semibold text-slate-900">Features</h1>
          <p className="mt-4 text-slate-500">
            Detailed feature information coming soon.
          </p>
          <p className="mt-2 text-sm text-slate-400">
            This page is a placeholder and will be updated before public launch.
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
