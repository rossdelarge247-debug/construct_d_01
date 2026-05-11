import type { Stage, SelfEmployment } from '../types';

export interface O4Option {
  value: SelfEmployment;
  primary: string;
  detail?: string;
  emphasised?: boolean;
}

export interface O4Copy {
  eyebrow: {
    label: string;
    accent: 'indigo';
  };
  heading: string;
  helper: string;
  options: ReadonlyArray<O4Option>;
  captions: {
    pickToContinue: string;
    oneAnswered: string;
  };
  cta: {
    continue: string;
  };
}

export function getCopy(_stage: Stage): O4Copy {
  return {
    eyebrow: { label: 'Money', accent: 'indigo' },
    heading: 'Does either of you work for yourself, or run a limited company?',
    helper: 'This affects how we handle income evidence later.',
    options: [
      { value: 'no', primary: 'No', detail: 'both employed, or not working', emphasised: true },
      { value: 'me', primary: 'Yes', detail: 'I am' },
      { value: 'ex', primary: 'Yes', detail: 'my ex is' },
      { value: 'both', primary: 'Yes', detail: 'we both are' },
    ],
    captions: {
      pickToContinue: 'Pick the option that fits to continue.',
      oneAnswered: 'Answer recorded — continue when ready.',
    },
    cta: {
      continue: 'Continue',
    },
  };
}
