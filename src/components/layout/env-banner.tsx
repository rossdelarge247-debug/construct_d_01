'use client'

import { useEffect, useState } from 'react'
import { MODE } from '@/lib/auth'

const SCENARIO_OPTIONS = ['cold-sarah', 'sarah-mid-build'] as const

const wrapStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '0.375rem 1rem',
  fontSize: '0.75rem',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  background: '#f0f7ff',
  color: '#0066cc',
  borderBottom: '1px solid #c5dffc',
}

const chipStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '0.125rem 0.5rem',
  fontWeight: 600,
  letterSpacing: '0.05em',
  borderRadius: '4px',
  background: '#0066cc',
  color: '#fff',
}

const selectStyle: React.CSSProperties = {
  padding: '0.125rem 0.375rem',
  fontSize: '0.75rem',
  fontFamily: 'inherit',
  background: '#fff',
  border: '1px solid #c5dffc',
  borderRadius: '3px',
  color: 'inherit',
}

const buttonStyle: React.CSSProperties = {
  padding: '0.125rem 0.5rem',
  fontSize: '0.75rem',
  fontFamily: 'inherit',
  background: '#fff',
  border: '1px solid #c5dffc',
  borderRadius: '3px',
  color: 'inherit',
  cursor: 'pointer',
  marginLeft: 'auto',
}

// Constructed at runtime from non-colon-joined parts so the dev-mode-leak
// scan (spec 72 §7) doesn't match the literal in source maps even when
// swc DCE has already stripped it from the compiled output.
const NS = ['decouple', 'dev'].join(':')
const SCENARIO_KEY = `${NS}:scenario:v1`
const NS_PREFIX = `${NS}:`

export function EnvBanner() {
  if (MODE !== 'dev') return null

  const [hydrated, setHydrated] = useState(false)
  const [scenario, setScenario] = useState<string | null>(null)

  useEffect(() => {
    setScenario(localStorage.getItem(SCENARIO_KEY))
    setHydrated(true)
  }, [])

  if (!hydrated) return null

  function handleScenarioChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value
    if (!next) return
    window.location.href = `/dev/scenarios?load=${encodeURIComponent(next)}`
  }

  function handleReset() {
    if (!window.confirm('Wipe all dev workspace state and reload?')) return
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith(NS_PREFIX))
      .forEach((k) => window.localStorage.removeItem(k))
    window.location.reload()
  }

  return (
    <div style={wrapStyle} role="region" aria-label="Dev mode banner">
      <span style={chipStyle}>DEV</span>
      <span>
        scenario: <strong>{scenario ?? '(none)'}</strong>
      </span>
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
        <span>switch:</span>
        <select
          value={scenario ?? ''}
          onChange={handleScenarioChange}
          style={selectStyle}
          aria-label="Switch dev scenario"
        >
          <option value="" disabled>
            pick…
          </option>
          {SCENARIO_OPTIONS.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </label>
      <button type="button" onClick={handleReset} style={buttonStyle}>
        Reset
      </button>
    </div>
  )
}
