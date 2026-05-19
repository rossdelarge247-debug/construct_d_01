'use client';

import Link from 'next/link';
import type { CSSProperties } from 'react';
import { MODE } from '@/lib/auth';
import { VARIANT_REGISTRY } from '@/lib/dev/variants-registry';
import {
  VariantProvider,
  useResetVariant,
  useSetVariant,
  useVariant,
} from '@/lib/dev/variant-context';
import type { VariantOption, VariantSet } from '@/lib/dev/variant-manifest';

const wrapStyle: CSSProperties = {
  fontFamily: 'system-ui, -apple-system, sans-serif',
  maxWidth: '760px',
  margin: '0 auto',
  padding: '2rem 1.5rem',
  color: '#1a1a1a',
};

const headerStyle: CSSProperties = {
  marginBottom: '1.5rem',
  paddingBottom: '0.75rem',
  borderBottom: '1px solid #e5e5e5',
};

const prototypeStyle: CSSProperties = {
  border: '1px solid #e5e5e5',
  borderRadius: '6px',
  padding: '1.25rem',
  marginBottom: '1rem',
};

const setHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: '1rem',
  marginBottom: '0.5rem',
};

const optionRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '0.75rem',
  padding: '0.5rem 0',
};

const radioStyle: CSSProperties = {
  marginTop: '0.25rem',
  cursor: 'pointer',
};

const resetButtonStyle: CSSProperties = {
  fontSize: '0.85rem',
  background: 'transparent',
  border: '1px solid #cbd5e1',
  borderRadius: '4px',
  padding: '0.25rem 0.6rem',
  cursor: 'pointer',
  color: '#475569',
};

const linkStyle: CSSProperties = {
  fontSize: '0.85rem',
  color: '#0369a1',
  textDecoration: 'underline',
};

function VariantSetPanel({
  prototypeId,
  variantKey,
  set,
}: {
  prototypeId: string;
  variantKey: string;
  set: VariantSet;
}) {
  const active = useVariant(prototypeId, variantKey);
  const setVariant = useSetVariant(prototypeId, variantKey);
  const reset = useResetVariant(prototypeId, variantKey);

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <div style={setHeaderStyle}>
        <h3 style={{ fontSize: '1rem', margin: 0, fontWeight: 600 }}>{set.label}</h3>
        <button
          type="button"
          onClick={reset}
          style={resetButtonStyle}
          aria-label={`Reset ${set.label} to default`}
        >
          Reset to default
        </button>
      </div>
      <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 0.5rem' }}>
        Active: <code>{active}</code> · Default: <code>{set.default}</code>
      </p>
      <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
        <legend style={{ position: 'absolute', left: '-9999px' }}>{set.label} variant options</legend>
        {set.options.map((option) => (
          <OptionRow
            key={option.id}
            option={option}
            checked={active === option.id}
            onSelect={() => setVariant(option.id)}
            variantKey={variantKey}
          />
        ))}
      </fieldset>
    </div>
  );
}

function OptionRow({
  option,
  checked,
  onSelect,
  variantKey,
}: {
  option: VariantOption;
  checked: boolean;
  onSelect: () => void;
  variantKey: string;
}) {
  const id = `variant-${variantKey}-${option.id}`;
  return (
    <label htmlFor={id} style={optionRowStyle}>
      <input
        id={id}
        type="radio"
        name={`variant-${variantKey}`}
        value={option.id}
        checked={checked}
        onChange={onSelect}
        style={radioStyle}
      />
      <span>
        <strong>{option.label}</strong>
        {option.description ? (
          <span style={{ display: 'block', fontSize: '0.85rem', color: '#475569' }}>
            {option.description}
          </span>
        ) : null}
      </span>
    </label>
  );
}

function ControlContent() {
  const entries = Object.values(VARIANT_REGISTRY);

  return (
    <main style={wrapStyle}>
      <header style={headerStyle}>
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Prototype variant control</h1>
        <p style={{ marginTop: '0.5rem', color: '#475569' }}>
          Select which variant renders in each prototype. Selection persists in localStorage. URL
          parameter <code>?variant.&lt;key&gt;=&lt;id&gt;</code> overrides for shareable links.
        </p>
        <p style={{ marginTop: '0.5rem' }}>
          <Link href="/dev/proto" style={linkStyle}>
            ← Back to prototype hub
          </Link>
        </p>
      </header>

      {entries.length === 0 ? (
        <p style={{ color: '#64748b' }}>No prototypes have declared variants yet.</p>
      ) : (
        entries.map((entry) => (
          <section key={entry.prototypeId} style={prototypeStyle}>
            <h2 style={{ fontSize: '1.15rem', margin: '0 0 0.75rem' }}>{entry.prototypeLabel}</h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 1rem' }}>
              <Link href={`/dev/proto/${entry.prototypeId}`} style={linkStyle}>
                Open prototype →
              </Link>
            </p>
            {Object.entries(entry.manifest).map(([variantKey, set]) => (
              <VariantSetPanel
                key={variantKey}
                prototypeId={entry.prototypeId}
                variantKey={variantKey}
                set={set}
              />
            ))}
          </section>
        ))
      )}
    </main>
  );
}

export default function VariantControlPage() {
  if (MODE !== 'dev') return null;

  return (
    <VariantProvider registry={VARIANT_REGISTRY}>
      <ControlContent />
    </VariantProvider>
  );
}
