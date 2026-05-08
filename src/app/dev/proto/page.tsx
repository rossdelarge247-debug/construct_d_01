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
