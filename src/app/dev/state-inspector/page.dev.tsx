'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MODE } from '@/lib/auth'

const PREFIX = 'decouple:dev:'

interface Entry {
  key: string
  text: string
  edited: boolean
  error: string | null
}

const wrapStyle: React.CSSProperties = {
  fontFamily: 'system-ui, -apple-system, sans-serif',
  maxWidth: '900px',
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
  marginBottom: '1rem',
  padding: '1rem',
  border: '1px solid #e5e5e5',
  borderRadius: '6px',
  background: '#fff',
}

const codeStyle: React.CSSProperties = {
  fontFamily: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
  fontSize: '0.8125rem',
  background: '#f5f5f5',
  padding: '0.125rem 0.375rem',
  borderRadius: '3px',
}

const textareaStyle: React.CSSProperties = {
  width: '100%',
  minHeight: '120px',
  marginTop: '0.5rem',
  padding: '0.5rem',
  fontFamily: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
  fontSize: '0.8125rem',
  border: '1px solid #d5d5d5',
  borderRadius: '4px',
  resize: 'vertical',
  boxSizing: 'border-box',
}

const buttonStyle: React.CSSProperties = {
  padding: '0.375rem 0.75rem',
  fontSize: '0.8125rem',
  fontFamily: 'inherit',
  border: '1px solid #ccc',
  borderRadius: '4px',
  background: '#fff',
  cursor: 'pointer',
  marginRight: '0.5rem',
}

function validate(text: string): string | null {
  try {
    JSON.parse(text)
    return null
  } catch (err) {
    return err instanceof Error ? err.message : 'Invalid JSON'
  }
}

function snapshot(): Entry[] {
  if (typeof window === 'undefined') return []
  const keys = Object.keys(window.localStorage)
    .filter((k) => k.startsWith(PREFIX))
    .sort()
  return keys.map((key) => {
    const raw = window.localStorage.getItem(key) ?? ''
    let pretty = raw
    try {
      pretty = JSON.stringify(JSON.parse(raw), null, 2)
    } catch {
      // leave raw — will surface as JSON error if user tries to save
    }
    return { key, text: pretty, edited: false, error: null }
  })
}

export default function StateInspectorPage() {
  if (MODE !== 'dev') return null

  const [hydrated, setHydrated] = useState(false)
  const [entries, setEntries] = useState<Entry[]>([])

  useEffect(() => {
    setEntries(snapshot())
    setHydrated(true)
  }, [])

  if (!hydrated) return null

  function handleEdit(key: string, text: string) {
    setEntries((prev) =>
      prev.map((e) =>
        e.key === key
          ? { ...e, text, edited: true, error: validate(text) }
          : e,
      ),
    )
  }

  function handleRevert(key: string) {
    const fresh = snapshot().find((e) => e.key === key)
    if (!fresh) return
    setEntries((prev) => prev.map((e) => (e.key === key ? fresh : e)))
  }

  function handleSave(key: string) {
    const entry = entries.find((e) => e.key === key)
    if (!entry || entry.error) return
    window.localStorage.setItem(key, entry.text)
    setEntries(snapshot())
  }

  function handleDelete(key: string) {
    if (!window.confirm(`Delete ${key}?`)) return
    window.localStorage.removeItem(key)
    setEntries(snapshot())
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
        <h1 style={{ margin: '0.25rem 0 0', fontSize: '1.5rem' }}>State Inspector</h1>
        <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#666' }}>
          Every <span style={codeStyle}>{PREFIX}*</span> key in localStorage. Edit JSON inline.
          Save is blocked while JSON is invalid.
        </p>
      </header>

      {entries.length === 0 && (
        <p style={{ color: '#666', fontSize: '0.875rem' }}>
          No <span style={codeStyle}>{PREFIX}*</span> keys present. Pick a scenario from{' '}
          <Link href="/dev/scenarios" style={{ color: '#0066cc' }}>
            /dev/scenarios
          </Link>
          .
        </p>
      )}

      {entries.map((e) => (
        <article key={e.key} style={cardStyle}>
          <h2 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500 }}>
            <span style={codeStyle}>{e.key}</span>
          </h2>
          <textarea
            value={e.text}
            onChange={(ev) => handleEdit(e.key, ev.target.value)}
            style={textareaStyle}
            spellCheck={false}
            aria-label={`JSON value for ${e.key}`}
          />
          {e.error && (
            <div
              role="alert"
              style={{
                marginTop: '0.25rem',
                padding: '0.375rem 0.5rem',
                fontSize: '0.8125rem',
                color: '#cc0033',
                background: '#fff5f5',
                border: '1px solid #fcc',
                borderRadius: '3px',
              }}
            >
              JSON error: {e.error}
            </div>
          )}
          <div style={{ marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleSave(e.key)}
              disabled={!e.edited || !!e.error}
              style={{
                ...buttonStyle,
                background: e.edited && !e.error ? '#0066cc' : '#fff',
                color: e.edited && !e.error ? '#fff' : '#999',
                borderColor: e.edited && !e.error ? '#0066cc' : '#ccc',
                cursor: e.edited && !e.error ? 'pointer' : 'not-allowed',
              }}
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => handleRevert(e.key)}
              disabled={!e.edited}
              style={{
                ...buttonStyle,
                cursor: e.edited ? 'pointer' : 'not-allowed',
                opacity: e.edited ? 1 : 0.6,
              }}
            >
              Revert
            </button>
            <button
              type="button"
              onClick={() => handleDelete(e.key)}
              style={{ ...buttonStyle, color: '#cc0033', borderColor: '#fcc' }}
            >
              Delete
            </button>
          </div>
        </article>
      ))}
    </main>
  )
}
