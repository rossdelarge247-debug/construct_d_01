import type { Stage } from '../types';

export interface O5Copy {
  eyebrow: string;
  heading: string;
}

export function getCopy(_stage: Stage): O5Copy {
  return {
    eyebrow: 'O5 · Partner finances',
    heading: 'How much do you know about your partner’s finances?',
  };
}
