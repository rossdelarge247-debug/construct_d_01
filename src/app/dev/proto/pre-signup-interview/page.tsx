'use client';

import { Suspense } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { BackgroundShell } from './components/BackgroundShell';
import { BgToggle } from './components/BgToggle';
import { ProtoProvider, useProto } from './lib/proto-context';
import { type BgMode, BG_MODES } from './lib/types';
import { O1 } from './screens/O1';
import { O2 } from './screens/O2';
import { O3 } from './screens/O3';
import { O4 } from './screens/O4';
import { O5 } from './screens/O5';
import { O6 } from './screens/O6';
import { O7 } from './screens/O7';
import { O8 } from './screens/O8';

function ScreenSwitch() {
  const { step } = useProto();
  switch (step) {
    case 1: return <O1 />;
    case 2: return <O2 />;
    case 3: return <O3 />;
    case 4: return <O4 />;
    case 5: return <O5 />;
    case 6: return <O6 />;
    case 7: return <O7 />;
    case 8: return <O8 />;
    default: return <O1 />;
  }
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
      <ProtoProvider>
        <ScreenSwitch />
      </ProtoProvider>
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
