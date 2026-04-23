import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Decouple — rebuilding',
  description: 'The complete settlement workspace for separating couples — under active rebuild',
}

export default function LandingPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div style={{ maxWidth: '36rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '1rem' }}>
          Decouple
        </h1>
        <p style={{ fontSize: '1.125rem', lineHeight: 1.6, color: '#444' }}>
          The complete settlement workspace for separating couples is under active rebuild.
          The marketing surface is coming back in slice <code>S-M1</code> once the new design system lands.
        </p>
        <p style={{ fontSize: '0.875rem', color: '#888', marginTop: '2rem' }}>
          Phase C foundation — session 24, Option 4
        </p>
      </div>
    </main>
  )
}
