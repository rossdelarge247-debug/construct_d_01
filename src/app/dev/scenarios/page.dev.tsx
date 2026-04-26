'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MODE } from '@/lib/auth'
import { SCENARIO_META } from '@/lib/store/scenario-descriptions'

const wrapStyle: React.CSSProperties = {
  fontFamily: 'system-ui, -apple-system, sans-serif',
  maxWidth: '760px',
  margin: '0 auto',
  padding: '2rem 1.5rem',
  color: '#1a1a1a',
}

const headerStyle: React.CSSProperties = {
  marginBottom: '1.5rem',
  paddingBottom: '0.75rem',
  borderBottom: '1px solid #e5e5e5',
}

const cardStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1rem',
  padding: '1rem',
  marginBottom: '0.5rem',
  border: '1px solid #e5e5e5',
  borderRadius: '6px',
  background: '#fff',
}

const buttonStyle: React.CSSProperties = {
  padding: '0.375rem 0.75rem',
  fontSize: '0.875rem',
  fontFamily: 'inherit',
  background: '#0066cc',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
}

export default function ScenariosPage() {
  if (MODE !== 'dev') return null

  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Honour ?load=<name> from the env-banner dropdown handoff: confirm,
  // load via the loader (dynamic import keeps loader code-split + outside
  // the static prod page chunk), redirect to /dev.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const loadName = params.get('load')
    if (!loadName) return
    if (!window.confirm(`Load scenario "${loadName}"? Current dev state will be wiped.`)) {
      window.history.replaceState({}, '', '/dev/scenarios')
      return
    }
    void runLoad(loadName)
  }, [])

  async function runLoad(name: string) {
    setBusy(name)
    setError(null)
    try {
      const { loadScenario } = await import('@/lib/store/scenario-loader')
      await loadScenario(name)
      window.location.href = '/dev'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setBusy(null)
    }
  }

  return (
    <main style={wrapStyle}>
      <header style={headerStyle}>
        <Link
          href="/dev"
          style={{ fontSize: '0.875rem', color: '#0066cc', textDecoration: 'none' }}
        >
          ← Dashboard
        </Link>
        <h1 style={{ margin: '0.25rem 0 0', fontSize: '1.5rem' }}>Scenarios</h1>
        <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#666' }}>
          Pick a fixture state. Loading wipes any current dev state and seeds the workspace.
        </p>
      </header>
      {error && (
        <div
          role="alert"
          style={{
            padding: '0.75rem',
            marginBottom: '1rem',
            background: '#fff5f5',
            border: '1px solid #fcc',
            borderRadius: '6px',
            color: '#cc0033',
            fontSize: '0.875rem',
          }}
        >
          Failed: {error}
        </div>
      )}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {SCENARIO_META.map(({ name, description }) => (
          <li key={name} style={cardStyle}>
            <div style={{ flex: 1 }}>
              <h2 style={{ margin: 0, fontSize: '1rem' }}>{name}</h2>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#666' }}>
                {description}
              </p>
            </div>
            <button
              type="button"
              onClick={() => runLoad(name)}
              disabled={busy !== null}
              style={{ ...buttonStyle, opacity: busy === name ? 0.6 : 1 }}
            >
              {busy === name ? 'Loading…' : 'Load'}
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}
