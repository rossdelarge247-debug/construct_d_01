interface SectionHeadProps {
  children: React.ReactNode
  eyebrow?: string
  maxWidth?: number
}

export function SectionHead({
  children,
  eyebrow,
  maxWidth = 720,
}: SectionHeadProps) {
  return (
    <div style={{ maxWidth }}>
      {eyebrow ? (
        <div className="label-xs" style={{ color: 'var(--ds-color-text-muted)' }}>
          {eyebrow}
        </div>
      ) : null}
      <h2
        className="serif"
        style={{
          fontSize: 38,
          fontWeight: 600,
          letterSpacing: '-0.022em',
          lineHeight: 1.1,
          color: 'var(--ds-color-ink)',
          marginTop: eyebrow ? 14 : 0,
          textWrap: 'balance',
        }}
      >
        {children}
      </h2>
    </div>
  )
}
