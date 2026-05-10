import type { Stage } from '../types';

export interface O1Copy {
  eyebrow: string;
  heading: string;
  helper?: string;
}

export function getCopy(_stage: Stage): O1Copy {
  return {
    eyebrow: 'O1 · Where are you?',
    heading: 'Where are you in your separation?',
    helper: 'There’s no wrong answer. Pick the one that fits today — you can always come back.',
  };
}
