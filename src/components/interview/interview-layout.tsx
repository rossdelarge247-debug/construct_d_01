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
  situation: 'Situation',
  route: 'Route',
  children: 'Children',
  home: 'Home',
  finances: 'Finances',
  confidence: 'Confidence',
  plan: 'Plan',
  next: 'Next',
}

// All possible steps in order — conditional ones animate in/out
const ALL_STEPS: InterviewStepId[] = [
  'situation', 'route', 'children', 'home', 'finances', 'confidence', 'plan', 'next',
]

export function InterviewLayout({ children, currentStep, steps, showProgress = true }: InterviewLayoutProps) {
  const currentIndex = currentStep && steps ? steps.indexOf(currentStep) : -1
  const totalSteps = steps?.length ?? 0

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      {/* Minimal header */}
      <header className="px-6 pt-6">
        <div className="mx-auto flex max-w-xl items-center justify-between">
          <Link href="/" className="font-heading text-lg font-medium text-ink-faint transition-colors hover:text-ink">
            {APP_NAME}
          </Link>
        </div>
      </header>

      {/* Step progress */}
      {showProgress && currentStep && steps && (
        <div className="px-6 pt-6">
          <div className="mx-auto max-w-xl">
            {/* Progress bar */}
            <div className="h-1 overflow-hidden rounded-full bg-cream-dark">
              <div
                className="h-full rounded-full bg-warmth transition-all duration-500 ease-out"
                style={{ width: `${((currentIndex + 1) / totalSteps) * 100}%` }}
              />
            </div>

            {/* Step labels — all rendered, conditional ones animate */}
            <div className="mt-2 flex items-center">
              {ALL_STEPS.map((step) => {
                const isActive = steps.includes(step)
                const stepIndex = steps.indexOf(step)

                return (
                  <span
                    key={step}
                    className={cn(
                      'text-[11px] transition-all duration-300 ease-out overflow-hidden',
                      isActive ? 'max-w-24 opacity-100 mx-auto' : 'max-w-0 opacity-0 mx-0',
                      isActive && stepIndex < currentIndex && 'text-sage',
                      isActive && stepIndex === currentIndex && 'font-medium text-warmth-dark',
                      isActive && stepIndex > currentIndex && 'text-ink-faint',
                    )}
                  >
                    {STEP_LABELS[step]}
                  </span>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="flex flex-1 flex-col px-6 pb-12 pt-8">
        <div className="mx-auto w-full max-w-xl">
          {children}
        </div>
      </main>
    </div>
  )
}
