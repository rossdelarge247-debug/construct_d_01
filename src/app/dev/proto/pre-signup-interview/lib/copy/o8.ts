import type { Stage } from '../types';

export type O8OptionId = 'signup' | 'download' | 'conventional' | 'support';

export interface O8Option {
  id: O8OptionId;
  title: string;
  sub: string;
  cta: string;
}

export interface O8Copy {
  planRecall: {
    label: string;
    backToPlan: string;
  };
  hero: {
    eyebrow: string;
    heading: string;
    helper: { primary: string; secondary: string };
  };
  options: ReadonlyArray<O8Option>;
  footer: {
    captionFallback: string;
    ctaFallback: string;
  };
}

export function getCopy(_stage: Stage): O8Copy {
  return {
    planRecall: {
      label: 'Your plan is ready',
      backToPlan: 'back to plan',
    },
    hero: {
      eyebrow: "What's next · take it from here",
      heading: 'What would you like to do next?',
      helper: {
        primary: "There's no wrong answer.",
        secondary: 'You can come back anytime.',
      },
    },
    options: [
      {
        id: 'signup',
        title: 'Create a free account and start building my picture',
        sub: 'Free to start; no card needed.',
        cta: 'Create my account',
      },
      {
        id: 'download',
        title: 'Download my plan and come back later',
        sub: "We'll keep your answers for 30 days if you want to come back.",
        cta: 'Download my plan',
      },
      {
        id: 'conventional',
        title: 'I want to go the conventional route',
        sub: "We'll point you to good starting places.",
        cta: 'See helpful links',
      },
      {
        id: 'support',
        title: 'I need to talk to someone first',
        sub: 'Here are people who can help.',
        cta: 'See support resources',
      },
    ],
    footer: {
      captionFallback: 'Pick an option above to continue.',
      ctaFallback: 'Continue',
    },
  };
}
