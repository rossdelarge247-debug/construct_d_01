import type { Stage } from '../types';

export interface O4Copy {
  eyebrow: string;
  heading: string;
}

export function getCopy(_stage: Stage): O4Copy {
  return {
    eyebrow: 'O4 · Employment',
    heading: 'How do you make money?',
  };
}
