import Link from 'next/link';
import { registry } from './registry';
import type { Section } from './registry-schema';
import { FlowRow } from './_components/FlowRow';
import { SectionHeader } from './_components/SectionHeader';

const SECTION_ORDER: Section[] = [
  'pre-auth-public',
  'auth-boundary',
  'post-signup-onboarding',
  'bank-connect',
  'hub',
  'build',
  'reconcile',
  'settle',
  'finalise',
  'cross-cutting',
  'dev-tools',
];

export default function ProtoHubPage() {
  const bySection = SECTION_ORDER.map((section) => ({
    section,
    rows: registry.filter((r) => r.section === section),
  }));

  return (
    <main
      className="mx-auto max-w-4xl p-8"
      style={{ fontFamily: 'var(--ds-font-sans)', color: 'var(--ds-color-ink)' }}
    >
      <header className="mb-8">
        <h1
          style={{
            fontSize: 'var(--ds-type-21)',
            fontFamily: 'var(--ds-font-serif)',
            fontWeight: 700,
            margin: 0,
          }}
        >
          Decouple — design uncertainty registry
        </h1>
        <p
          className="mt-2"
          style={{ fontSize: 'var(--ds-type-15-5)', color: 'var(--ds-color-text-sub)' }}
        >
          {registry.length} flows tracked across {SECTION_ORDER.length} sections.
          Status + confidence per row; click status &gt; <em>not started</em> rows for stub detail.
        </p>
      </header>

      <nav
        className="mb-8 rounded-lg p-5"
        style={{ border: '2px solid var(--ds-color-phase-build-accent, #4338CA)', background: 'var(--ds-color-surface-panel)' }}
      >
        <h2 style={{ fontSize: 'var(--ds-type-17)', fontWeight: 700, margin: '0 0 8px' }}>
          End-to-end signed-in journey
        </h2>
        <p style={{ fontSize: 'var(--ds-type-14-5)', color: 'var(--ds-color-text-sub)', margin: '0 0 12px' }}>
          Click through the full post-signup experience: onboarding &rarr; profiling &rarr; bank connect &rarr; dashboard.
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Welcome tour', href: '/dev/proto/welcome-tour' },
            { label: 'Safeguarding', href: '/dev/proto/safeguarding-signposting' },
            { label: 'Moment 1', href: '/dev/proto/moment-1-ack' },
            { label: 'Moment 2 profiling', href: '/dev/proto/moment-2-profiling' },
            { label: 'Bank connect', href: '/dev/proto/bank-connect' },
            { label: 'Dashboard', href: '/dev/proto/post-connect-dashboard' },
            { label: 'Section confirm', href: '/dev/proto/section-confirm' },
            { label: 'Share flow', href: '/dev/proto/share-flow' },
            { label: 'AI coach', href: '/dev/proto/ai-coach' },
          ].map((step, i) => (
            <Link
              key={step.href}
              href={step.href}
              className="inline-flex items-center gap-1 rounded-full px-3 py-1"
              style={{
                fontSize: 'var(--ds-type-12)',
                fontWeight: 600,
                background: 'var(--ds-color-phase-build-soft, #EEF2FF)',
                color: 'var(--ds-color-phase-build-accent, #4338CA)',
                textDecoration: 'none',
              }}
            >
              <span style={{ fontSize: 10, opacity: 0.6 }}>{i + 1}</span> {step.label}
            </Link>
          ))}
        </div>
        <p className="mt-3" style={{ fontSize: 'var(--ds-type-12)', color: 'var(--ds-color-text-muted)' }}>
          Start at Welcome tour and follow the CTAs to walk the full flow. Each screen&apos;s primary action leads to the next.
        </p>
      </nav>

      {bySection.map(({ section, rows }) => (
        <section key={section}>
          <SectionHeader section={section} count={rows.length} />
          {rows.map((row) => (
            <FlowRow key={row.id} row={row} />
          ))}
        </section>
      ))}
    </main>
  );
}
