import type { Stage, SelfEmployment, TitleShape } from '../types';

interface SelfEmploymentOption {
  value: SelfEmployment;
  label: string;
  helper?: string;
}

export interface O4Copy {
  eyebrow: string;
  heading: TitleShape;
  options: ReadonlyArray<SelfEmploymentOption>;
}

export function getCopy(_stage: Stage): O4Copy {
  return {
    eyebrow: 'O4 · Employment',
    heading: { kind: 'plain', text: 'How do you make money?' },
    options: [
      { value: 'neither', label: 'No, just the basics', helper: 'Both employed or not working' },
      { value: 'me', label: 'Yes — I am self-employed', helper: 'Sole trader, freelance, or company director' },
      { value: 'ex', label: 'Yes — my ex is self-employed' },
      { value: 'both', label: 'Yes — we both are', helper: 'Both running businesses' },
    ],
  };
}
