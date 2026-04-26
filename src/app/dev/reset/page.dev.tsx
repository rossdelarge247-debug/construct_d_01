'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MODE } from '@/lib/auth'

const wrapStyle: React.CSSProperties = {
  fontFamily: 'system-ui, -apple-system, sans-serif',
  maxWidth: '520px',
  margin: '0 auto',
  padding: '2rem 1.5rem',
  color: '#1a1a1a',
}

const cardStyle: React.CSSProperties = {
  padding: '1.5rem',
  border: '1px solid #fcc',
  borderRadius: '6px',
  background: '#fffafa',
}

const buttonStyle: React.CSSProperties = {
  padding: '0.5rem 1rem',
  fontSize: '0.875rem',
  fontFamily: 'inherit',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
}

export default function ResetPage() {
  if (MODE !== 'dev') return null

  // Runtime-built namespace prefix — same trick as env-banner so source
  // maps don't preserve the `decouple:dev:` literal.
  const NS_PREFIX = `${['decouple', 'dev'].join(':')}:`

  const [busy, setBusy] = useState(false)

  function handleConfirm() {
    setBusy(true)
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith(NS_PREFIX))
      .forEach((k) => window.localStorage.removeItem(k))
    window.location.href = '/dev'
  }

  return (
    <main style={wrapStyle}>
      <Link
        href="/dev"
        style={{ fontSize: '0.875rem', color: '#0066cc', textDecoration: 'none' }}
      >
        ← Dashboard
      </Link>
      <h1 style={{ margin: '0.25rem 0 1rem', fontSize: '1.5rem' }}>Reset dev state</h1>
      <div style={cardStyle}>
        <p style={{ margin: 0, fontSize: '0.875rem' }}>
          This wipes every <code>{NS_PREFIX}*</code> key from localStorage and reloads at the
          dashboard. Use this when a fixture is in a bad state or you want a clean slate.
        </p>
        <p style={{ margin: '0.75rem 0 1rem', fontSize: '0.875rem', color: '#666' }}>
          No remote effect — dev mode only touches localStorage.
        </p>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={busy}
            style={{ ...buttonStyle, background: '#cc0033', color: '#fff' }}
          >
            {busy ? 'Wiping…' : 'Wipe all dev state'}
          </button>
          <Link
            href="/dev"
            style={{ ...buttonStyle, background: '#fff', color: '#1a1a1a', border: '1px solid #ccc', textDecoration: 'none', display: 'inline-block', textAlign: 'center' }}
          >
            Cancel
          </Link>
        </div>
      </div>
    </main>
  )
}
