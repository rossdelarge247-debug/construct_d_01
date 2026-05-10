import type { Stage } from '../types';

export interface O3Copy {
  eyebrow: string;
  heading: string;
  privacyPreamble: string;
}

export function getCopy(_stage: Stage): O3Copy {
  return {
    eyebrow: 'O3 · Your ex & safety',
    heading: 'How would you describe things between you?',
    privacyPreamble: 'Some people read these screens with a partner nearby.',
  };
}
