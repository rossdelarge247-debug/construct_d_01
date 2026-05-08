'use client';

import type { ReactNode } from 'react';
import type { BgMode } from '../lib/types';
import styles from '../page.module.css';

export function BackgroundShell({ mode, children }: { mode: BgMode; children: ReactNode }) {
  const className = `${styles.scope} ${mode === 'expressive' ? styles.expressive : styles.standalone}`;
  return <div className={className}>{children}</div>;
}
