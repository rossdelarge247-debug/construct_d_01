'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { InterviewLayout } from '@/components/interview/interview-layout'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'

const BULLETS = [
  'See the likely process for your specific situation',
  'Shape a starting plan for children, housing, and finances',
  'Know exactly what to focus on next',
]

export default function StartPage() {
  const [visibleCount, setVisibleCount] = useState(0)
  const [showFooter, setShowFooter] = useState(false)

  useEffect(() => {
    // Stagger bullets: 600ms delay, then one every 500ms
    const timers: ReturnType<typeof setTimeout>[] = []

    timers.push(setTimeout(() => setVisibleCount(1), 600))
    timers.push(setTimeout(() => setVisibleCount(2), 1100))
    timers.push(setTimeout(() => setVisibleCount(3), 1600))
    timers.push(setTimeout(() => setShowFooter(true), 2200))

    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <InterviewLayout showProgress={false}>
      <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
        <h1 className="font-heading text-3xl font-bold leading-snug tracking-tight text-ink sm:text-4xl">
          Let&apos;s build your free separation plan.
        </h1>
        <p className="mt-4 text-ink-secondary leading-relaxed">
          A clear picture of where you are, what comes next, and what to do.
        </p>

        <div className="mt-12 space-y-6 text-left">
          {BULLETS.map((bullet, i) => (
            <p
              key={i}
              className={cn(
                'flex items-start gap-4 text-ink-secondary transition-all duration-500 ease-out',
                i < visibleCount
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-3 opacity-0',
              )}
            >
              <span className="mt-0.5 text-[var(--color-green-600)]">&#10003;</span>
              {bullet}
            </p>
          ))}
        </div>

        <div className={cn(
          'mt-12 transition-all duration-500 ease-out',
          showFooter ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
        )}>
          <p className="text-sm text-ink-tertiary">
            You don&apos;t need to know everything. You just need to start.
          </p>
          <div className="mt-6">
            <Link href="/start/situation">
              <Button size="lg">Build my free plan</Button>
            </Link>
          </div>
          <p className="mt-3 text-xs text-ink-tertiary">
            Takes about 10 minutes. No sign-up needed.
          </p>
        </div>
      </div>
    </InterviewLayout>
  )
}
