'use client';

import type { ReactNode } from 'react';
import type { BgMode } from '../lib/types';
import styles from '../page.module.css';

const MODE_CLASSES: Record<BgMode, string> = {
  expressive: styles.expressive,
  canvasChrome: styles.canvasChrome,
  o7Surface: styles.o7Surface,
  standalone: styles.standalone,
};

export function BackgroundShell({ mode, children }: { mode: BgMode; children: ReactNode }) {
  return <div className={MODE_CLASSES[mode]}>{children}</div>;
}
