import type { Section } from '../registry-schema';

const SECTION_TITLES: Record<Section, string> = {
  'pre-auth-public': 'Pre-auth public',
  'auth-boundary': 'Auth boundary',
  'post-signup-onboarding': 'Post-signup onboarding',
  'bank-connect': 'Bank-connect',
  hub: 'Hub',
  build: 'Build',
  reconcile: 'Reconcile',
  settle: 'Settle',
  finalise: 'Finalise',
  'cross-cutting': 'Cross-cutting',
  'dev-tools': 'Dev tools',
};

export function SectionHeader({ section, count }: { section: Section; count: number }) {
  const title = SECTION_TITLES[section];
  return (
    <h2
      className="mt-8 mb-4 flex items-baseline gap-3"
      style={{
        fontSize: 'var(--ds-type-21)',
        fontFamily: 'var(--ds-font-serif)',
        color: 'var(--ds-color-ink)',
      }}
    >
      <span>{title}</span>
      <span
        style={{
          fontSize: 'var(--ds-type-14-5)',
          color: 'var(--ds-color-text-muted)',
          fontFamily: 'var(--ds-font-sans)',
          fontWeight: 'normal',
        }}
      >
        ({count})
      </span>
    </h2>
  );
}
