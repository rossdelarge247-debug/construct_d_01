import type { Stage, PartnerAwareness } from '../types';

export interface O5Option {
  value: PartnerAwareness;
  primary: string;
  detail?: string;
}

export interface O5Copy {
  eyebrow: {
    label: string;
    accent: 'indigo';
  };
  heading: string;
  helper: string;
  options: ReadonlyArray<O5Option>;
  captions: {
    pickToContinue: string;
    oneAnswered: string;
  };
  cta: {
    continue: string;
  };
}

export function getCopy(_stage: Stage): O5Copy {
  return {
    eyebrow: { label: 'Money · their side', accent: 'indigo' },
    heading: "How much do you know about your partner's financial situation?",
    helper: "There's no wrong answer. Many people don't know everything.",
    options: [
      { value: 'full', primary: 'I have a good idea of everything' },
      { value: 'some', primary: 'I know some things but not all' },
      { value: 'little', primary: 'Very little', detail: 'they managed the money' },
      { value: 'suspect', primary: 'I suspect they may be hiding things' },
    ],
    captions: {
      pickToContinue: "Pick the answer closest to what's true today.",
      oneAnswered: 'Answer recorded — continue when ready.',
    },
    cta: {
      continue: 'Continue',
    },
  };
}
