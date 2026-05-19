'use client';

import { Suspense } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { VariantProvider } from '@/lib/dev/variant-context';
import { VARIANT_REGISTRY } from '@/lib/dev/variants-registry';
import { BackgroundShell } from './components/BackgroundShell';
import { BgToggle } from './components/BgToggle';
import { HelpRailLayout } from './components/HelpRailLayout';
import { ProtoProvider, useProto } from './lib/proto-context';
import { type BgMode, BG_MODES } from './lib/types';
import { useScreenTransition } from './lib/use-screen-transition';
import { O1 } from './screens/O1';
import { O2 } from './screens/O2';
import { O3 } from './screens/O3';
import { O4 } from './screens/O4';
import { O5 } from './screens/O5';
import { O6 } from './screens/O6';
import { O6_5 } from './screens/O6_5';
import { O6_6 } from './screens/O6_6';
import { O6_7 } from './screens/O6_7';
import { O7 } from './screens/O7';
import { O8 } from './screens/O8';
import { QuantBridge } from './screens/QuantBridge';
import styles from './page.module.css';

function renderScreen(step: number) {
  switch (step) {
    case 1: return <O1 />;
    case 2: return <O2 />;
    case 3: return <O3 />;
    case 4: return <O4 />;
    case 5: return <O5 />;
    case 6: return <O6 />;
    case 7: return <QuantBridge />;
    case 8: return <O6_5 />;
    case 9: return <O6_6 />;
    case 10: return <O6_7 />;
    case 11: return <O7 />;
    case 12: return <O8 />;
    default: return <O1 />;
  }
}

function ScreenSwitch() {
  const { step } = useProto();
  const { renderedStep, phase } = useScreenTransition(step);
  return (
    <div className={styles.transitionLayer} data-phase={phase}>
      {renderScreen(renderedStep)}
    </div>
  );
}

function Inner() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const bgParam = params.get('bg');
  const bgMode: BgMode = (BG_MODES as ReadonlyArray<string>).includes(bgParam ?? '') ? (bgParam as BgMode) : 'expressive';
  const handleToggle = (next: BgMode) => {
    const url = next === 'expressive' ? pathname : `${pathname}?bg=${next}`;
    router.replace(url);
  };
  return (
    <BackgroundShell mode={bgMode}>
      <BgToggle mode={bgMode} onToggle={handleToggle} />
      <VariantProvider registry={VARIANT_REGISTRY}>
        <ProtoProvider>
          <HelpRailLayout>
            <ScreenSwitch />
          </HelpRailLayout>
        </ProtoProvider>
      </VariantProvider>
    </BackgroundShell>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  );
}
