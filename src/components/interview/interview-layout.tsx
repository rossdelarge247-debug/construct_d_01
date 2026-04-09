'use client'

import { type ReactNode } from 'react'
import Link from 'next/link'
import { APP_NAME } from '@/constants'
import { ExitPageButton } from '@/components/ui/exit-page'
import { cn } from '@/utils/cn'

export type InterviewStepId =
  | 'situation'
  | 'route'
  | 'children'
  | 'home'
  | 'finances'
  | 'readiness'
  | 'plan'
  | 'next'

interface InterviewLayoutProps {
  children: ReactNode
  currentStep?: InterviewStepId
  steps?: InterviewStepId[]
  showProgress?: boolean
}

// The tracker shows a simplified journey with two waypoint deliverables
// Internal steps (children, home, finances, readiness) collapse into "Your picture"
type TrackerPhase = 'situation' | 'pathway' | 'picture' | 'plan'

const TRACKER_PHASES: TrackerPhase[] = ['situation', 'pathway', 'picture', 'plan']

const PHASE_LABELS: Record<TrackerPhase, string> = {
  situation: 'Situation',
  pathway: 'Your pathway',
  picture: 'Your picture',
  plan: 'Your plan',
}

// Map each internal step to a tracker phase
const STEP_TO_PHASE: Record<InterviewStepId, TrackerPhase> = {
  situation: 'situation',
  route: 'pathway',
  children: 'picture',
  home: 'picture',
  finances: 'picture',
  readiness: 'picture',
  plan: 'plan',
  next: 'plan',
}

// Waypoint phases get a diamond marker
const WAYPOINT_PHASES: TrackerPhase[] = ['pathway', 'plan']

export function InterviewLayout({ children, currentStep, steps, showProgress = true }: InterviewLayoutProps) {
  const currentPhase = currentStep ? STEP_TO_PHASE[currentStep] : null
  const currentPhaseIndex = currentPhase ? TRACKER_PHASES.indexOf(currentPhase) : -1

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <ExitPageButton />
      {/* Minimal header */}
      <header className="px-6 pt-6">
        <div className="mx-auto flex max-w-xl items-center justify-between">
          <Link href="/" className="font-heading text-lg font-semibold text-ink-faint transition-colors hover:text-ink">
            {APP_NAME}
          </Link>
        </div>
      </header>

      {/* Progress tracker — simplified with waypoints */}
      {showProgress && currentStep && steps && (
        <div className="px-6 pt-6">
          <div className="mx-auto max-w-xl">
            {/* Progress bar */}
            <div className="h-1 overflow-hidden rounded-full bg-cream-dark">
              <div
                className="h-full rounded-full bg-warmth transition-all duration-500 ease-out"
                style={{ width: `${((currentPhaseIndex + 1) / TRACKER_PHASES.length) * 100}%` }}
              />
            </div>

            {/* Phase labels with waypoint diamonds */}
            <div className="mt-3 flex items-center justify-between">
              {TRACKER_PHASES.map((phase, i) => {
                const isWaypoint = WAYPOINT_PHASES.includes(phase)
                const isComplete = i < currentPhaseIndex
                const isCurrent = i === currentPhaseIndex
                const isFuture = i > currentPhaseIndex

                return (
                  <div key={phase} className="flex flex-col items-center gap-1">
                    {/* Diamond or dot marker */}
                    <div className={cn(
                      'transition-all duration-300',
                      isWaypoint ? 'h-2.5 w-2.5 rotate-45' : 'h-1.5 w-1.5 rounded-full',
                      isComplete && 'bg-sage',
                      isCurrent && 'bg-warmth',
                      isFuture && 'bg-cream-dark',
                    )} />
                    {/* Label */}
                    <span className={cn(
                      'text-[11px] transition-colors duration-300',
                      isComplete && 'text-sage',
                      isCurrent && 'font-medium text-warmth-dark',
                      isFuture && 'text-ink-faint',
                    )}>
                      {PHASE_LABELS[phase]}
                    </span>
                  </div>
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
