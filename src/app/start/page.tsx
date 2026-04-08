import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'

export default function StartPage() {
  return (
    <>
      <Header />
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="mx-auto max-w-lg py-24 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Let&apos;s build a clear picture of where you are and what comes next.
          </h1>
          <div className="mt-8 space-y-4 text-left">
            <p className="flex items-start gap-3 text-slate-600">
              <span className="mt-0.5 text-emerald-500">&#10003;</span>
              See the likely process for your specific situation
            </p>
            <p className="flex items-start gap-3 text-slate-600">
              <span className="mt-0.5 text-emerald-500">&#10003;</span>
              Shape a starting plan for children, housing, and finances
            </p>
            <p className="flex items-start gap-3 text-slate-600">
              <span className="mt-0.5 text-emerald-500">&#10003;</span>
              Know exactly what to focus on next
            </p>
          </div>
          <p className="mt-8 text-sm text-slate-400">
            You don&apos;t need to know everything. You just need to start.
          </p>
          <div className="mt-8">
            <Button size="lg">Let&apos;s begin</Button>
          </div>
        </div>
      </main>
    </>
  )
}
