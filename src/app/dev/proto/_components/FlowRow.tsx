import Link from 'next/link';
import type { RegistryRow } from '../registry-schema';
import { StatusBadge } from './StatusBadge';
import { ConfidenceBadge } from './ConfidenceBadge';

export function FlowRow({ row }: { row: RegistryRow }) {
  const topQuestion = row.openQuestions[0];
  const isClickable = row.status !== 'not-started';

  return (
    <article
      className="my-2 rounded-lg p-4"
      style={{
        border: '1px solid var(--ds-color-border)',
        background: 'var(--ds-color-surface-panel)',
      }}
    >
      <header className="flex flex-wrap items-center gap-2">
        <h3
          style={{
            fontSize: 'var(--ds-type-16)',
            color: 'var(--ds-color-ink)',
            margin: 0,
            fontFamily: 'var(--ds-font-sans)',
          }}
        >
          {isClickable ? (
            <Link href={`/dev/proto/${row.id}`} style={{ color: 'inherit', textDecoration: 'underline' }}>
              {row.title}
            </Link>
          ) : (
            row.title
          )}
        </h3>
        <code
          style={{
            fontSize: 'var(--ds-type-11)',
            color: 'var(--ds-color-text-muted)',
            fontFamily: 'var(--ds-font-mono)',
          }}
        >
          {row.id}
        </code>
        <StatusBadge status={row.status} />
        <ConfidenceBadge confidence={row.confidence} />
      </header>

      {(row.tags.length > 0 || topQuestion) && (
        <div
          className="mt-2"
          style={{ fontSize: 'var(--ds-type-14-5)', color: 'var(--ds-color-text-sub)' }}
        >
          {row.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {row.tags.map((t) => (
                <span key={t}>#{t}</span>
              ))}
            </div>
          )}
          {topQuestion && <div className="mt-1">Q: {topQuestion}</div>}
        </div>
      )}

      <footer
        className="mt-2"
        style={{ fontSize: 'var(--ds-type-11)', color: 'var(--ds-color-text-muted)' }}
      >
        owner: {row.owner} · last touched: session {row.lastTouched.session}
      </footer>
    </article>
  );
}
