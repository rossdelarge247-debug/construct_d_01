import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'

export default function StartPage() {
  return (
    <>
      <Header />
      <main className="flex flex-1 items-center justify-center px-6">
        <div className="mx-auto max-w-md py-28 text-center">
          <h1 className="font-heading text-3xl font-medium leading-snug tracking-tight text-ink sm:text-4xl">
            Let&apos;s build a clear picture of where you are and what comes next.
          </h1>
          <div className="mt-10 space-y-5 text-left">
            <p className="flex items-start gap-4 text-ink-light">
              <span className="mt-0.5 text-sage">&#10003;</span>
              See the likely process for your specific situation
            </p>
            <p className="flex items-start gap-4 text-ink-light">
              <span className="mt-0.5 text-sage">&#10003;</span>
              Shape a starting plan for children, housing, and finances
            </p>
            <p className="flex items-start gap-4 text-ink-light">
              <span className="mt-0.5 text-sage">&#10003;</span>
              Know exactly what to focus on next
            </p>
          </div>
          <p className="mt-10 text-sm text-ink-faint">
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
