import { notFound } from 'next/navigation';
import Link from 'next/link';
import { registry } from '../registry';
import { StatusBadge } from '../_components/StatusBadge';
import { ConfidenceBadge } from '../_components/ConfidenceBadge';

const LINK_LABELS = {
  spec: 'Spec',
  canvas: 'Canvas',
  prototype: 'Prototype',
  slice: 'Slice',
} as const;

type LinkKey = keyof typeof LINK_LABELS;

export default async function StubPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const row = registry.find((r) => r.id === slug);

  if (!row || row.status === 'not-started') {
    notFound();
  }

  const populatedLinks = (
    Object.entries(row.links) as Array<[LinkKey, string | undefined]>
  ).filter(([, v]) => Boolean(v));

  return (
    <main
      className="mx-auto max-w-4xl p-8"
      style={{ fontFamily: 'var(--ds-font-sans)', color: 'var(--ds-color-ink)' }}
    >
      <nav className="mb-6">
        <Link
          href="/dev/proto"
          style={{ color: 'var(--ds-color-text-sub)', textDecoration: 'underline' }}
        >
          ← back to hub
        </Link>
      </nav>

      <header className="mb-6 flex flex-wrap items-center gap-3">
        <h1
          className="m-0"
          style={{
            fontSize: 'var(--ds-type-21)',
            fontFamily: 'var(--ds-font-serif)',
            fontWeight: 700,
          }}
        >
          {row.title}
        </h1>
        <StatusBadge status={row.status} />
        <ConfidenceBadge confidence={row.confidence} />
      </header>

      {row.openQuestions.length > 0 && (
        <section className="mb-6">
          <h2 className="mt-0 mb-2" style={{ fontSize: 'var(--ds-type-17)' }}>
            Open questions
          </h2>
          <ul className="list-disc pl-6" style={{ color: 'var(--ds-color-text-sub)' }}>
            {row.openQuestions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </section>
      )}

      {populatedLinks.length > 0 && (
        <section>
          <h2 className="mt-0 mb-2" style={{ fontSize: 'var(--ds-type-17)' }}>
            Linked artefacts
          </h2>
          <ul className="list-disc pl-6">
            {populatedLinks.map(([key, value]) => (
              <li key={key}>
                {LINK_LABELS[key]}:{' '}
                <code
                  style={{
                    color: 'var(--ds-color-text-sub)',
                    fontSize: 'var(--ds-type-14-5)',
                  }}
                >
                  {value}
                </code>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
