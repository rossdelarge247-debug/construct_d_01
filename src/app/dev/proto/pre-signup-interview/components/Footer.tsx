'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { Arrow } from './Arrow';
import styles from './Footer.module.css';

interface FooterProps {
  caption?: ReactNode;
  ctaLabel: string;
  enabled?: boolean;
  onContinue: () => void;
  secondaryActions?: ReactNode;
  variant?: 'cream' | 'light';
}

export function Footer({
  caption,
  ctaLabel,
  enabled = true,
  onContinue,
  secondaryActions,
  variant = 'cream',
}: FooterProps) {
  const ctaRef = useRef<HTMLButtonElement>(null);
  const prevEnabledRef = useRef(enabled);

  useEffect(() => {
    const node = ctaRef.current;
    if (!node) return;
    if (!prevEnabledRef.current && enabled) {
      node.classList.remove(styles.ctaEnabled);
      void node.offsetWidth;
      node.classList.add(styles.ctaEnabled);
    }
    prevEnabledRef.current = enabled;
  }, [enabled]);

  const wrapperClass =
    variant === 'light' ? `${styles.footer} ${styles.footerLight}` : `${styles.footer} ${styles.footerCream}`;
  const hasCaption = caption !== undefined && caption !== null && caption !== '';

  return (
    <footer className={wrapperClass}>
      {hasCaption && (
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className={enabled ? styles.captionEnabled : styles.captionDisabled}
        >
          {caption}
        </div>
      )}
      {secondaryActions && <div className={styles.secondaryRow}>{secondaryActions}</div>}
      <button
        ref={ctaRef}
        type="button"
        onClick={onContinue}
        disabled={!enabled}
        className={`${styles.cta}${enabled ? ` ${styles.ctaEnabled}` : ''}`}
      >
        <span>{ctaLabel}</span>
        <Arrow dir="right" size={13} strokeWidth={2} />
      </button>
    </footer>
  );
}
