'use client'

import { InterviewLayout } from '@/components/interview/interview-layout'
import { Button } from '@/components/ui/button'

export default function SaveWorkspacePage() {
  return (
    <InterviewLayout showProgress={false}>
      <div className="flex flex-col items-center py-12 text-center">
        <h1 className="font-heading text-2xl font-bold text-ink">
          Save your workspace
        </h1>
        <p className="mt-4 max-w-sm text-sm text-ink-light leading-relaxed">
          You&apos;ve built something worth keeping. Save your workspace to keep your plan, return anytime, and continue when you&apos;re ready.
        </p>

        <div className="mt-10 w-full max-w-sm space-y-4">
          <Button size="lg" className="w-full">
            Continue with email
          </Button>
          <Button variant="secondary" size="lg" className="w-full">
            Continue with Google
          </Button>
        </div>

        <p className="mt-8 text-xs text-ink-faint leading-relaxed">
          Your information stays private. Nothing is shared unless you choose to share it.
        </p>
      </div>
    </InterviewLayout>
  )
}
