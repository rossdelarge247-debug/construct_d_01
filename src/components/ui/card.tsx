import { type HTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'sm' | 'md' | 'lg'
}

export function Card({ className, padding = 'md', ...props }: CardProps) {
  const paddingStyles = {
    sm: 'p-5',
    md: 'p-7',
    lg: 'p-10',
  }

  return (
    <div
      className={cn(
        'rounded-[var(--radius-md)] border-[var(--border-card)] border-cream-dark bg-surface shadow-[var(--shadow-sm)]',
        paddingStyles[padding],
        className,
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-4', className)} {...props} />
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('font-heading text-xl font-semibold text-ink', className)} {...props} />
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-ink-light leading-relaxed', className)} {...props} />
}
