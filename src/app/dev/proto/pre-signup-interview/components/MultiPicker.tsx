'use client';

import { tokens } from '@/styles/tokens';

interface Option<V extends string> {
  value: V;
  label: string;
}

interface MultiPickerProps<V extends string> {
  id: string;
  label: string;
  options: ReadonlyArray<Option<V>>;
  selected: ReadonlyArray<V>;
  onChange: (next: ReadonlyArray<V>) => void;
}

export function MultiPicker<V extends string>({
  id,
  label,
  options,
  selected,
  onChange,
}: MultiPickerProps<V>) {
  const headingId = `${id}-label`;

  const toggle = (value: V) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <div
        id={headingId}
        style={{
          font: `500 13.5px/1.25 ${tokens.font.sans}`,
          color: tokens.color.ink,
        }}
      >
        {label}
      </div>
      <div
        role="group"
        aria-labelledby={headingId}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 6,
        }}
      >
        {options.map((opt) => (
          <CheckPill
            key={opt.value}
            label={opt.label}
            checked={selected.includes(opt.value)}
            onClick={() => toggle(opt.value)}
          />
        ))}
      </div>
    </div>
  );
}

interface CheckPillProps {
  label: string;
  checked: boolean;
  onClick: () => void;
}

function CheckPill({ label, checked, onClick }: CheckPillProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        background: checked ? tokens.color.ink : '#FFFFFF',
        color: checked ? '#FFFFFF' : tokens.color.ink,
        border: `1px solid ${checked ? tokens.color.ink : tokens.color.border}`,
        borderRadius: 999,
        padding: '8px 14px',
        minHeight: 44,
        font: `500 12.5px/1.2 ${tokens.font.sans}`,
        cursor: 'pointer',
        textAlign: 'left',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          flex: 'none',
          width: 14,
          height: 14,
          borderRadius: 4,
          border: `1.5px solid ${checked ? '#FFFFFF' : '#767676'}`,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {checked ? (
          <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path
              d="M2 5.2 L4.2 7.4 L8 3.2"
              stroke="#FFFFFF"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
      </span>
      <span>{label}</span>
    </button>
  );
}
