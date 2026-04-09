import type { ReadinessState } from '@/types/workspace'
import { cn } from '@/utils/cn'

export function ReadinessBar({ readiness }: { readiness: ReadinessState }) {
  return (
    <div className="rounded-[var(--radius-md)] border-[var(--border-card)] border-cream-dark p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium uppercase tracking-wide text-ink-faint">Readiness</h3>
        <span className={cn(
          'text-xs font-medium',
          readiness.level === 'not_started' && 'text-ink-faint',
          readiness.level === 'first_draft' && 'text-amber',
          readiness.level === 'disclosure' && 'text-sage-dark',
          readiness.level === 'final_draft' && 'text-sage-dark',
          readiness.level === 'formalisation' && 'text-sage-dark',
        )}>
          {readiness.label}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-cream-dark">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            readiness.progress < 30 && 'bg-cream-dark',
            readiness.progress >= 30 && readiness.progress < 60 && 'bg-amber',
            readiness.progress >= 60 && 'bg-sage',
          )}
          style={{ width: `${readiness.progress}%` }}
        />
      </div>

      <p className="text-xs text-ink-light">{readiness.description}</p>

      {readiness.blockers.length > 0 && readiness.level !== 'not_started' && (
        <div className="space-y-1">
          {readiness.blockers.slice(0, 2).map((blocker, i) => (
            <p key={i} className="flex items-start gap-2 text-xs text-ink-faint">
              <span className="mt-0.5 text-amber">○</span>
              {blocker}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
