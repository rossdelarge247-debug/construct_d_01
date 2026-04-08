'use client'

import { type ReactNode } from 'react'
import Link from 'next/link'
import { APP_NAME } from '@/constants'
import { ExitPageButton } from '@/components/ui/exit-page'

interface InterviewLayoutProps {
  children: ReactNode
  step?: number
  totalSteps?: number
  showProgress?: boolean
}

export function InterviewLayout({ children, step, totalSteps, showProgress = true }: InterviewLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <ExitPageButton />

      {/* Minimal header */}
      <header className="px-6 pt-6">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <Link href="/" className="font-heading text-lg font-medium text-ink-faint transition-colors hover:text-ink">
            {APP_NAME}
          </Link>
        </div>
      </header>

      {/* Progress indicator */}
      {showProgress && step && totalSteps && (
        <div className="px-6 pt-8">
          <div className="mx-auto max-w-lg">
            <div className="flex items-center gap-3">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-cream-dark">
                <div
                  className="h-full rounded-full bg-warmth transition-all duration-500 ease-out"
                  style={{ width: `${(step / totalSteps) * 100}%` }}
                />
              </div>
              <span className="text-xs text-ink-faint">
                {step} of {totalSteps}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="flex flex-1 flex-col px-6 pb-12 pt-10">
        <div className="mx-auto w-full max-w-lg">
          {children}
        </div>
      </main>
    </div>
  )
}
