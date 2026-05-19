'use client';

import { tokens } from '@/styles/tokens';
import styles from './focus-visible.module.css';

interface Option<V extends string> {
  value: V;
  label: string;
}

interface BucketPickerProps<V extends string> {
  id: string;
  label: string;
  options: ReadonlyArray<Option<V>>;
  selected: V | null | undefined;
  onChange: (value: V | null) => void;
}

const PREFER_NOT_TO_SAY_LABEL = 'Prefer not to say';

export function BucketPicker<V extends string>({
  id,
  label,
  options,
  selected,
  onChange,
}: BucketPickerProps<V>) {
  const isPreferNotToSay = selected === null;
  const headingId = `${id}-label`;

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
        role="radiogroup"
        aria-labelledby={headingId}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 6,
        }}
      >
        {options.map((opt) => {
          const checked = selected === opt.value;
          return (
            <Pill
              key={opt.value}
              label={opt.label}
              checked={checked}
              onClick={() => onChange(opt.value)}
            />
          );
        })}
        <Pill
          label={PREFER_NOT_TO_SAY_LABEL}
          checked={isPreferNotToSay}
          onClick={() => onChange(null)}
        />
      </div>
    </div>
  );
}

interface PillProps {
  label: string;
  checked: boolean;
  onClick: () => void;
}

function Pill({ label, checked, onClick }: PillProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={onClick}
      className={styles.focusable}
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
          borderRadius: 999,
          border: `1.5px solid ${checked ? '#FFFFFF' : '#767676'}`,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {checked ? (
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: 999,
              background: '#FFFFFF',
            }}
          />
        ) : null}
      </span>
      <span>{label}</span>
    </button>
  );
}
