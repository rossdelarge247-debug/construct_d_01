'use client';

import { tokens } from '@/styles/tokens';

export interface RadioChipsOption<T extends string | number> {
  value: T;
  label: string;
}

interface Props<T extends string | number> {
  name: string;
  options: ReadonlyArray<RadioChipsOption<T>>;
  value: T | undefined;
  onChange: (next: T) => void;
}

export function RadioChips<T extends string | number>({ name, options, value, onChange }: Props<T>) {
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
        Select an option
      </legend>
      {options.map((opt) => {
        const selected = value === opt.value;
        const id = `${name}-${opt.value}`;
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
              cursor: 'pointer',
              font: `500 14px/1.2 ${tokens.font.sans}`,
              transition: 'background-color 120ms ease, color 120ms ease',
            }}
          >
            <input
              type="radio"
              id={id}
              name={name}
              value={String(opt.value)}
              checked={selected}
              onChange={() => onChange(opt.value)}
              style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
            />
            {opt.label}
          </label>
        );
      })}
    </fieldset>
  );
}
