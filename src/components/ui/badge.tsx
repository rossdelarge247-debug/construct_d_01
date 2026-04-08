import { type HTMLAttributes } from 'react'
import { cn } from '@/utils/cn'
import type { ConfidenceState, FollowUpState } from '@/types'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variant === 'default' && 'bg-slate-100 text-slate-700',
        variant === 'outline' && 'border border-slate-200 text-slate-600',
        className,
      )}
      {...props}
    />
  )
}

const confidenceStyles: Record<ConfidenceState, string> = {
  known: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  estimated: 'bg-amber-50 text-amber-700 border-amber-200',
  unsure: 'bg-orange-50 text-orange-700 border-orange-200',
  unknown: 'bg-slate-100 text-slate-500 border-slate-200',
}

const confidenceLabels: Record<ConfidenceState, string> = {
  known: 'Known',
  estimated: 'Estimated',
  unsure: 'Unsure',
  unknown: 'Unknown',
}

export function ConfidenceChip({
  state,
  className,
}: {
  state: ConfidenceState
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        confidenceStyles[state],
        className,
      )}
    >
      {confidenceLabels[state]}
    </span>
  )
}

const followUpStyles: Record<FollowUpState, string> = {
  fine_for_now: 'bg-slate-50 text-slate-600',
  confirm_later: 'bg-blue-50 text-blue-700',
  priority_to_confirm: 'bg-red-50 text-red-700',
  resolved: 'bg-emerald-50 text-emerald-700',
}

const followUpLabels: Record<FollowUpState, string> = {
  fine_for_now: 'Fine for now',
  confirm_later: 'Confirm later',
  priority_to_confirm: 'Priority',
  resolved: 'Resolved',
}

export function FollowUpBadge({
  state,
  className,
}: {
  state: FollowUpState
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        followUpStyles[state],
        className,
      )}
    >
      {followUpLabels[state]}
    </span>
  )
}
