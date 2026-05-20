'use client';

import type { ReactNode } from 'react';
import { useVariant } from '@/lib/dev/variant-context';
import { RailGlossary } from './rails/RailGlossary';
import { RailCoach } from './rails/RailCoach';
import { RailWhy } from './rails/RailWhy';
import { RailHuman } from './rails/RailHuman';
import { RailHybrid } from './rails/RailHybrid';
import styles from '../page.module.css';

function ActiveRail() {
  const variant = useVariant('pre-signup-interview', 'helpRail');

  if (variant === 'v1') return <RailGlossary focused="relationship" />;
  if (variant === 'v2') return <RailCoach />;
  if (variant === 'v3') return <RailWhy />;
  if (variant === 'v4') return <RailHuman />;
  if (variant === 'v5') return <RailHybrid />;
  return null;
}

export function HelpRailLayout({ children }: { children: ReactNode }) {
  const variant = useVariant('pre-signup-interview', 'helpRail');
  const showRail = variant !== 'off' && variant !== '';

  return (
    <div className={styles.helpRailWrapper} data-rail-active={showRail ? 'true' : 'false'}>
      <div className={styles.helpRailContent}>{children}</div>
      <div className={styles.helpRailColumn} aria-live="polite">
        {showRail ? <ActiveRail /> : null}
      </div>
    </div>
  );
}
