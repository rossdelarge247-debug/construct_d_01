import Link from 'next/link'

export default function StartNotFound() {
  return (
    <main
      id="main"
      style={{
        padding: '60px 20px',
        minHeight: '100vh',
        maxWidth: 640,
        margin: '0 auto',
      }}
    >
      <h1
        className="serif"
        style={{
          fontSize: 32,
          fontWeight: 600,
          letterSpacing: '-0.02em',
          marginBottom: 16,
        }}
      >
        Pre-signup interview opens soon
      </h1>
      <p
        style={{
          fontSize: 16,
          lineHeight: 1.6,
          color: 'var(--ds-color-text-sub)',
          marginBottom: 32,
        }}
      >
        Decouple&apos;s pre-signup flow lets you check that your situation fits
        the workspace before creating an account. We&apos;re finishing the
        connect-first onboarding now and it opens shortly.
      </p>
      <Link
        href="/"
        className="cta-primary inline-flex items-center gap-2"
        style={{
          padding: '10px 18px',
          borderRadius: 999,
          background: 'var(--ds-color-ink)',
          color: 'var(--ds-color-surface-panel)',
          textDecoration: 'none',
          fontWeight: 500,
        }}
      >
        ← Back to home
      </Link>
    </main>
  )
}
