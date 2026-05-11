import type { Stage } from '../types';

export interface O1StageOption {
  value: Stage;
  label: string;
  sub: string;
}

export interface O1Copy {
  eyebrow: string;
  subStem: string;
  options: ReadonlyArray<O1StageOption>;
  cta: string;
  trustBand: { left: string; right: string };
}

export function getCopy(_stage: Stage): O1Copy {
  return {
    eyebrow: 'To start your plan…',
    subStem: 'Your answer shapes the rest of the plan. There\'s no wrong choice.',
    options: [
      { value: 'decided', label: 'We\'ve decided to separate', sub: 'You want to get the finances sorted.' },
      { value: 'thinking', label: 'I\'m thinking about separating', sub: 'You want to understand what\'s involved.' },
      { value: 'in_process', label: 'We\'re already in the process', sub: 'You want to get things moving faster.' },
    ],
    cta: 'Continue',
    trustBand: { left: 'Free', right: 'Private until saved' },
  };
}
