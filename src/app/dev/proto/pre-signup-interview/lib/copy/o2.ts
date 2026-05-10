import type { Stage } from '../types';

export interface O2Copy {
  eyebrow: string;
  heading: string;
  helper?: string;
}

export function getCopy(_stage: Stage): O2Copy {
  return {
    eyebrow: 'O2 · Your situation',
    heading: 'Tell us about your situation',
  };
}
