import type { Stage } from '../types';

export type LoadingStepState = 'done' | 'working' | 'pending';

export interface O7LoadingStep {
  label: string;
  state: LoadingStepState;
}

export interface SplitHeading {
  prefix: string;
  accent: string;
  suffix?: string;
}

export interface O7Copy {
  hero: {
    eyebrow: string;
    heading: SplitHeading;
    helper: string;
    meta: string;
  };
  actions: {
    downloadAsPdf: string;
    emailToMe: string;
    emailLink: string;
  };
  sections: {
    situation: { eyebrow: string; title: string };
    journey: { eyebrow: string; title: string };
    whatNeeds: { eyebrow: string; title: string };
    conventional: { eyebrow: string };
    decoupleHelps: { eyebrow: string };
    notes: { eyebrow: string; title: string; sub: string };
  };
  reassurance: string;
  generating: {
    eyebrow: string;
    heading: SplitHeading;
    helper: string;
    ariaLabel: string;
    steps: ReadonlyArray<O7LoadingStep>;
    workingIndicator: string;
    quote: string;
  };
}

export function getCopy(_stage: Stage): O7Copy {
  return {
    hero: {
      eyebrow: 'Your plan is ready',
      heading: { prefix: "Here's", accent: 'your plan', suffix: '.' },
      helper: "Built from your six answers — a warm picture of where you are, what's ahead, and what your options are.",
      meta: '~5 min read · 4 pages · yours to keep',
    },
    actions: {
      downloadAsPdf: 'Download as PDF',
      emailToMe: 'Email it to me',
      emailLink: 'Email link',
    },
    sections: {
      situation: { eyebrow: 'Section 1 · what you told us', title: 'Your situation' },
      journey: { eyebrow: 'Section 2 · the journey', title: 'What separation looks like' },
      whatNeeds: { eyebrow: 'Section 3 · tailored to you', title: 'What needs to happen' },
      conventional: { eyebrow: 'Section 4 · for comparison' },
      decoupleHelps: { eyebrow: 'Section 5 · how decouple helps' },
      notes: {
        eyebrow: 'Section 6 · your specific notes',
        title: 'Things to bear in mind',
        sub: 'Drawn from the corners of your situation that need extra care.',
      },
    },
    reassurance: "You've built a strong starting position.",
    generating: {
      eyebrow: 'Drawing it together',
      heading: { prefix: 'Take a', accent: 'breath', suffix: '.' },
      helper: "We're shaping this around the six things you've told us. There's no clock here — we'll be ready when you are.",
      ariaLabel: 'Plan generation progress',
      steps: [
        { label: 'Listening to your situation', state: 'done' },
        { label: 'Mapping the journey', state: 'done' },
        { label: 'Tailoring next steps', state: 'done' },
        { label: 'Comparing the conventional path', state: 'working' },
        { label: 'Writing your specific notes', state: 'pending' },
      ],
      workingIndicator: 'working…',
      quote: '“A warm hand on a cold day.”',
    },
  };
}
