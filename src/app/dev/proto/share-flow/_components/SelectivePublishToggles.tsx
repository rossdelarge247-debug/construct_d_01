import { useState } from 'react';
import { tokens } from '@/styles/tokens';

export const SECTIONS = [
  'Property',
  'Pensions',
  'Investments',
  'Income',
  'Spending',
  'Children',
  'Other',
] as const;

export type Section = (typeof SECTIONS)[number];

export function SelectivePublishToggles() {
  const [checked, setChecked] = useState<Record<Section, boolean>>(
    () => Object.fromEntries(SECTIONS.map((s) => [s, true])) as Record<Section, boolean>,
  );

  return (
    <fieldset
      style={{
        border: `1px solid ${tokens.color.border}`,
        borderRadius: 10,
        padding: 16,
        margin: '16px 0 0',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <legend
        style={{
          fontFamily: tokens.font.sans,
          fontSize: tokens.type['14-5'],
          fontWeight: 500,
          color: tokens.color.ink,
          padding: '0 8px',
        }}
      >
        What to share
      </legend>
      <p
        style={{
          margin: 0,
          fontFamily: tokens.font.sans,
          fontSize: 13,
          color: tokens.color.text.sub,
          lineHeight: 1.4,
        }}
      >
        By default, all sections share. Uncheck any you want to keep private for now.
      </p>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {SECTIONS.map((section) => (
          <li key={section}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '6px 0',
                fontFamily: tokens.font.sans,
                fontSize: tokens.type['14-5'],
                color: tokens.color.ink,
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={checked[section]}
                onChange={(e) =>
                  setChecked((prev) => ({ ...prev, [section]: e.target.checked }))
                }
                style={{ width: 16, height: 16, accentColor: tokens.color.phase.reconcile.accent }}
              />
              {section}
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}
