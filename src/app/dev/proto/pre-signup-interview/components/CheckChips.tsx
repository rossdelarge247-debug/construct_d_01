'use client';

import { tokens } from '@/styles/tokens';

export interface CheckChipsOption<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  name: string;
  options: ReadonlyArray<CheckChipsOption<T>>;
  values: ReadonlyArray<T>;
  cap?: number;
  onChange: (next: ReadonlyArray<T>) => void;
}

export function CheckChips<T extends string>({ name, options, values, cap, onChange }: Props<T>) {
  const isSelected = (v: T) => values.includes(v);
  const toggle = (v: T) => {
    if (isSelected(v)) {
      onChange(values.filter((x) => x !== v));
    } else {
      if (cap !== undefined && values.length >= cap) return;
      onChange([...values, v]);
    }
  };
  return (
    <fieldset
      style={{
        border: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
      }}
    >
      <legend style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)' }}>
        Select up to {cap ?? options.length}
      </legend>
      {options.map((opt) => {
        const selected = isSelected(opt.value);
        const id = `${name}-${opt.value}`;
        const isCapped = !selected && cap !== undefined && values.length >= cap;
        return (
          <label
            key={String(opt.value)}
            htmlFor={id}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '8px 14px',
              borderRadius: 999,
              background: selected ? tokens.color.ink : tokens.color.surface.panel,
              color: selected ? tokens.color.surface.panel : tokens.color.ink,
              border: `1px solid ${selected ? tokens.color.ink : tokens.color.border}`,
              cursor: isCapped ? 'not-allowed' : 'pointer',
              opacity: isCapped ? 0.5 : 1,
              font: `500 14px/1.2 ${tokens.font.sans}`,
              transition: 'background-color 120ms ease, color 120ms ease, opacity 120ms ease',
            }}
          >
            <input
              type="checkbox"
              id={id}
              name={name}
              value={String(opt.value)}
              checked={selected}
              onChange={() => toggle(opt.value)}
              disabled={isCapped}
              style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
            />
            {opt.label}
          </label>
        );
      })}
    </fieldset>
  );
}
