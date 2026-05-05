interface WordmarkProps {
  size?: number
}

export function Wordmark({ size = 18 }: WordmarkProps) {
  return (
    <div
      className="flex items-center gap-2 select-none"
      aria-label="Decouple"
    >
      <div
        className="relative"
        style={{ width: size + 4, height: size + 4 }}
        aria-hidden
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: '#111' }}
        />
        <div
          className="absolute rounded-full"
          style={{
            left: '42%',
            top: 0,
            width: '58%',
            height: '100%',
            background: 'var(--ds-color-surface-page)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            left: '45%',
            top: '12%',
            width: '10%',
            height: '76%',
            background: '#111',
          }}
        />
      </div>
      <span
        style={{
          fontSize: size,
          letterSpacing: '-0.01em',
          fontWeight: 600,
          color: '#111',
        }}
      >
        decouple
      </span>
    </div>
  )
}
