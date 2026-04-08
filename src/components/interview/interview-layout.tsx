'use client'

import { type ReactNode } from 'react'
import Link from 'next/link'
import { APP_NAME } from '@/constants'
import { cn } from '@/utils/cn'

export type InterviewStepId =
  | 'situation'
  | 'route'
  | 'children'
  | 'home'
  | 'finances'
  | 'confidence'
  | 'plan'
  | 'next'

interface InterviewLayoutProps {
  children: ReactNode
  currentStep?: InterviewStepId
  steps?: InterviewStepId[]
  showProgress?: boolean
}

const STEP_LABELS: Record<InterviewStepId, string> = {
  situation: 'Your situation',
  route: 'Your route',
  children: 'Children',
  home: 'Home',
  finances: 'Finances',
  confidence: 'What you know',
  plan: 'Your plan',
  next: 'Road ahead',
}

export function InterviewLayout({ children, currentStep, steps, showProgress = true }: InterviewLayoutProps) {
  const currentIndex = currentStep && steps ? steps.indexOf(currentStep) : -1
  const totalSteps = steps?.length ?? 0

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      {/* Minimal header */}
      <header className="px-6 pt-6">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <Link href="/" className="font-heading text-lg font-medium text-ink-faint transition-colors hover:text-ink">
            {APP_NAME}
          </Link>
        </div>
      </header>

      {/* Step progress — dots with labels */}
      {showProgress && currentStep && steps && (
        <div className="px-6 pt-6">
          <div className="mx-auto max-w-lg">
            {/* Progress bar */}
            <div className="h-1 overflow-hidden rounded-full bg-cream-dark">
              <div
                className="h-full rounded-full bg-warmth transition-all duration-500 ease-out"
                style={{ width: `${((currentIndex + 1) / totalSteps) * 100}%` }}
              />
            </div>

            {/* Step labels */}
            <div className="mt-3 flex flex-wrap items-center gap-x-1 gap-y-1">
              {steps.map((step, i) => (
                <div key={step} className="flex items-center gap-1">
                  {i > 0 && <span className="text-cream-dark mx-0.5">·</span>}
                  <span className={cn(
                    'text-xs transition-colors',
                    i < currentIndex ? 'text-sage' :
                    i === currentIndex ? 'font-medium text-warmth-dark' :
                    'text-ink-faint',
                  )}>
                    {STEP_LABELS[step]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="flex flex-1 flex-col px-6 pb-12 pt-8">
        <div className="mx-auto w-full max-w-lg">
          {children}
        </div>
      </main>
    </div>
  )
}
