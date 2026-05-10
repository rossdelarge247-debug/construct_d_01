'use client';

import { tokens } from '@/styles/tokens';

export interface RadioCardOption<T extends string> {
  value: T;
  label: string;
  helper?: string;
}

interface Props<T extends string> {
  name: string;
  options: ReadonlyArray<RadioCardOption<T>>;
  value: T | undefined;
  onChange: (next: T) => void;
}

export function RadioCard<T extends string>({ name, options, value, onChange }: Props<T>) {
  return (
    <fieldset style={{ border: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <legend style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)' }}>
        Select an option
      </legend>
      {options.map((opt) => {
        const selected = value === opt.value;
        const id = `${name}-${opt.value}`;
        return (
          <label
            key={opt.value}
            htmlFor={id}
            style={{
              display: 'block',
              padding: '14px 16px',
              borderRadius: 12,
              background: tokens.color.surface.panel,
              border: `2px solid ${selected ? tokens.color.ink : tokens.color.border}`,
              cursor: 'pointer',
              boxShadow: selected ? tokens.shadow.md : 'none',
              transition: 'border-color 120ms ease, box-shadow 120ms ease',
            }}
          >
            <input
              type="radio"
              id={id}
              name={name}
              value={opt.value}
              checked={selected}
              onChange={() => onChange(opt.value)}
              style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
            />
            <div style={{ font: `600 16px/1.3 ${tokens.font.sans}`, color: tokens.color.ink }}>{opt.label}</div>
            {opt.helper && (
              <div style={{ marginTop: 4, font: `400 14px/1.4 ${tokens.font.sans}`, color: tokens.color.text.sub }}>
                {opt.helper}
              </div>
            )}
          </label>
        );
      })}
    </fieldset>
  );
}
