import type { Metadata } from 'next'
import Link from 'next/link'
import { MODE } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Dev Dashboard — Decouple',
}

const TOOLS = [
  {
    href: '/dev/scenarios',
    title: 'Scenarios',
    desc: 'Pick a fixture state to load into the dev workspace.',
  },
  {
    href: '/dev/state-inspector',
    title: 'State Inspector',
    desc: 'View and edit the dev store as JSON.',
  },
  {
    href: '/dev/reset',
    title: 'Reset',
    desc: 'Wipe all dev-mode localStorage keys.',
  },
  {
    href: '/dev/engine-workbench',
    title: 'Engine Workbench',
    desc: 'Test signal rules against synthetic transactions.',
  },
] as const

const wrapStyle: React.CSSProperties = {
  fontFamily: 'system-ui, -apple-system, sans-serif',
  maxWidth: '760px',
  margin: '0 auto',
  padding: '2rem 1.5rem',
  color: '#1a1a1a',
}

const headerStyle: React.CSSProperties = {
  marginBottom: '2rem',
  paddingBottom: '1rem',
  borderBottom: '1px solid #e5e5e5',
}

const chipStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '0.125rem 0.5rem',
  fontSize: '0.75rem',
  fontWeight: 600,
  letterSpacing: '0.05em',
  borderRadius: '4px',
  background: MODE === 'dev' ? '#f0f7ff' : '#fff5f5',
  color: MODE === 'dev' ? '#0066cc' : '#cc0033',
  marginRight: '0.5rem',
}

const cardStyle: React.CSSProperties = {
  display: 'block',
  padding: '1rem',
  marginBottom: '0.75rem',
  border: '1px solid #e5e5e5',
  borderRadius: '6px',
  textDecoration: 'none',
  color: 'inherit',
  background: '#fff',
}

export default function DevDashboardPage() {
  return (
    <main style={wrapStyle}>
      <header style={headerStyle}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Dev Dashboard</h1>
        <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
          <span style={chipStyle}>MODE: {MODE.toUpperCase()}</span>
          <span style={{ fontSize: '0.875rem', color: '#888' }}>
            Current scenario surfaces in the env banner (AC-5).
          </span>
        </p>
      </header>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {TOOLS.map((tool) => (
          <li key={tool.href}>
            <Link href={tool.href} style={cardStyle}>
              <h2 style={{ margin: 0, fontSize: '1rem' }}>{tool.title}</h2>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#666' }}>
                {tool.desc}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
