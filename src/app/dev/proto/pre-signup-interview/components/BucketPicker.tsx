'use client';

import { type KeyboardEvent } from 'react';
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
const ROVING_KEYS = new Set(['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End']);

export function BucketPicker<V extends string>({
  id,
  label,
  options,
  selected,
  onChange,
}: BucketPickerProps<V>) {
  const headingId = `${id}-label`;

  const allOptions: ReadonlyArray<{ value: V | null; label: string }> = [
    ...options,
    { value: null, label: PREFER_NOT_TO_SAY_LABEL },
  ];

  const selectedIndex = allOptions.findIndex((o) => o.value === selected);
  const tabStopIndex = selectedIndex === -1 ? 0 : selectedIndex;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!ROVING_KEYS.has(event.key)) return;
    event.preventDefault();

    const current = tabStopIndex;
    const last = allOptions.length - 1;
    let next: number;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      next = current === last ? 0 : current + 1;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      next = current === 0 ? last : current - 1;
    } else if (event.key === 'Home') {
      next = 0;
    } else {
      next = last;
    }

    onChange(allOptions[next].value as V | null);
    const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>('button[role="radio"]');
    buttons[next]?.focus();
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
        role="radiogroup"
        aria-labelledby={headingId}
        onKeyDown={handleKeyDown}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 6,
        }}
      >
        {allOptions.map((opt, i) => (
          <Pill
            key={opt.value ?? PREFER_NOT_TO_SAY_LABEL}
            label={opt.label}
            checked={selected === opt.value}
            tabIndex={i === tabStopIndex ? 0 : -1}
            onClick={() => onChange(opt.value as V | null)}
          />
        ))}
      </div>
    </div>
  );
}

interface PillProps {
  label: string;
  checked: boolean;
  tabIndex: number;
  onClick: () => void;
}

function Pill({ label, checked, tabIndex, onClick }: PillProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      tabIndex={tabIndex}
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
