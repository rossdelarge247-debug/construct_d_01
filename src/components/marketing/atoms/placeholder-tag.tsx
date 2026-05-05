interface PlaceholderTagProps {
  children: React.ReactNode
}

export function PlaceholderTag({ children }: PlaceholderTagProps) {
  return (
    <span
      className="mono"
      style={{
        fontSize: 10.5,
        letterSpacing: '0.04em',
        color: 'var(--ds-color-text-muted)',
        background: 'rgba(255, 255, 255, 0.85)',
        padding: '3px 7px',
        borderRadius: 4,
        border: '1px solid var(--ds-color-border)',
      }}
    >
      {children}
    </span>
  )
}
