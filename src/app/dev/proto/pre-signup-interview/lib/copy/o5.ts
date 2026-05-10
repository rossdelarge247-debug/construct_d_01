import type { Stage, PartnerAwareness } from '../types';

interface AwarenessOption {
  value: PartnerAwareness;
  label: string;
}

export interface O5Copy {
  eyebrow: string;
  heading: string;
  options: ReadonlyArray<AwarenessOption>;
}

export function getCopy(_stage: Stage): O5Copy {
  return {
    eyebrow: 'O5 · Partner finances',
    heading: 'How much do you know about your partner’s finances?',
    options: [
      { value: 'good-idea', label: 'I have a good idea of everything' },
      { value: 'some-things', label: 'I know some things but not all' },
      { value: 'very-little', label: 'Very little — they managed the money' },
      { value: 'hiding', label: 'I suspect they may be hiding things' },
    ],
  };
}
