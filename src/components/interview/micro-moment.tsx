import { cn } from '@/utils/cn'

interface MicroMomentProps {
  children: React.ReactNode
  className?: string
}

export function MicroMoment({ children, className }: MicroMomentProps) {
  return (
    <p className={cn('text-[13px] italic text-ink-tertiary leading-relaxed', className)}>
      {children}
    </p>
  )
}
