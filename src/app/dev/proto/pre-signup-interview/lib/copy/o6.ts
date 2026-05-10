import type { Stage } from '../types';

export interface O6Copy {
  eyebrow: string;
  heading: string;
  hint: string;
}

export function getCopy(_stage: Stage): O6Copy {
  return {
    eyebrow: 'O6 · What matters',
    heading: 'What matters most to you?',
    hint: 'Pick what matters most. There’s no wrong answer.',
  };
}
