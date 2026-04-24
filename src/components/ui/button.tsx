import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

// Reskinned in S-F1 to consume --ds-* design system tokens (per spec 70
// line 117). Variant + size logic preserved; visual treatment shifts to
// the session-22 Claude AI Design palette: primary becomes ink-on-panel
// (matching the design source's filled-black CTAs) rather than V1 brand
// red. See docs/slices/S-F1-design-tokens/acceptance.md AC-3.
const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--ds-color-ink)] text-[color:var(--ds-color-surface-panel)] hover:opacity-90',
  secondary:
    'bg-[var(--ds-color-surface-panel)] text-[color:var(--ds-color-ink)] border border-[color:var(--ds-color-border)] hover:bg-[var(--ds-color-surface-canvas)]',
  ghost:
    'text-[color:var(--ds-color-text-sub)] hover:text-[color:var(--ds-color-ink)] hover:bg-[var(--ds-color-surface-canvas)]',
  danger:
    'bg-[var(--ds-color-danger)] text-[color:var(--ds-color-surface-panel)] hover:opacity-90',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-[var(--ds-space-12)] py-[var(--ds-space-6)] text-[length:var(--ds-type-15-5)]',
  md: 'px-[var(--ds-space-20)] py-[var(--ds-space-10)] text-[length:var(--ds-type-16)]',
  lg: 'px-[var(--ds-space-32)] py-[var(--ds-space-14)] text-[length:var(--ds-type-17)]',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-200',
          'rounded-[var(--ds-radius-lg)]',
          'disabled:pointer-events-none disabled:opacity-50',
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        disabled={disabled}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'
