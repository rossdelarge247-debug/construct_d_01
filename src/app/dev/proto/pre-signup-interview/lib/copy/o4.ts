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
  whyWeAsk: string;
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
    whyWeAsk: "Salaries, self-employment, and limited-company finances are evidenced differently in settlement. Knowing this early shapes what we'll need to gather.",
    options: [
      { value: 'no', primary: 'No', detail: 'both employed, or not working', emphasised: true },
      { value: 'me', primary: 'Yes', detail: 'I am' },
      { value: 'ex', primary: 'Yes', detail: 'my ex is' },
      { value: 'both', primary: 'Yes', detail: 'we both are' },
    ],
    captions: {
      pickToContinue: "Pick the answer closest to what's true today.",
      oneAnswered: 'Noted — keep going when you\'re ready.',
    },
    cta: {
      continue: 'Next: their side',
    },
  };
}
