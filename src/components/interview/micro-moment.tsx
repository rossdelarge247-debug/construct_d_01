import { cn } from '@/utils/cn'

interface MicroMomentProps {
  children: React.ReactNode
  className?: string
}

export function MicroMoment({ children, className }: MicroMomentProps) {
  return (
    <p className={cn('text-sm italic text-ink-faint leading-relaxed', className)}>
      {children}
    </p>
  )
}
