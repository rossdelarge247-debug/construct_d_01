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
  | 'readiness'  // legacy — kept for type compat
  | 'plan'
  | 'next'       // legacy — kept for type compat
  | 'choose'

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
  choose: 'plan',
}

// Waypoint phases get a diamond marker
const WAYPOINT_PHASES: TrackerPhase[] = ['pathway', 'plan']

export function InterviewLayout({ children, currentStep, showProgress = true }: InterviewLayoutProps) {
  const currentPhase = currentStep ? STEP_TO_PHASE[currentStep] : null
  const currentPhaseIndex = currentPhase ? TRACKER_PHASES.indexOf(currentPhase) : -1

  return (
    <div className="flex min-h-screen flex-col bg-off-white">
      <ExitPageButton />
      {/* Header — V2 unified */}
      <header className="sticky top-0 z-30 bg-white" style={{ boxShadow: '0 1px 0 var(--color-grey-100)' }}>
        <div className="flex items-center justify-center px-6" style={{ height: '64px' }}>
          <Link href="/" className="text-[18px] font-bold text-ink tracking-tight select-none">
            {APP_NAME}
          </Link>
        </div>
      </header>

      {/* Progress bar — V2 red bar + step counter */}
      {showProgress && currentStep && (
        <div className="px-6 pt-6">
          <div className="mx-auto max-w-[600px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] font-semibold text-ink">
                {PHASE_LABELS[currentPhase!]}
              </span>
              <span className="text-[13px] font-medium text-ink-tertiary">
                {currentPhaseIndex + 1} of {TRACKER_PHASES.length}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full" style={{ backgroundColor: 'var(--color-grey-100)' }}>
              <div
                className="h-full rounded-full transition-all duration-300 ease"
                style={{
                  width: `${((currentPhaseIndex + 1) / TRACKER_PHASES.length) * 100}%`,
                  backgroundColor: 'var(--color-red-500)',
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="flex flex-1 flex-col px-6 pb-12 pt-8">
        <div className="mx-auto w-full max-w-[600px]">
          {children}
        </div>
      </main>
    </div>
  )
}
