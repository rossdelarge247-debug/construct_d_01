import type { Stage } from '../types';

export interface O1StageOption {
  value: Stage;
  label: string;
  sub: string;
}

export interface O1Heading {
  pre: string;
  italic: string;
  tail: string;
}

export interface O1EntryCopy {
  timeIntro: string;
  outcomes: ReadonlyArray<string>;
  reassurance: string;
}

export interface O1Copy {
  eyebrow: string;
  entry: O1EntryCopy;
  heading: O1Heading;
  subStem: string;
  whyWeAsk: string;
  options: ReadonlyArray<O1StageOption>;
  cta: string;
  trustBand: { left: string; right: string };
}

export function getCopy(_stage: Stage): O1Copy {
  return {
    eyebrow: 'To start your plan…',
    entry: {
      timeIntro: 'In the next ~3 minutes, you\'ll:',
      outcomes: [
        'See the likely process for your specific situation',
        'Shape a starting plan for children, housing, and finances',
        'Know exactly what to focus on next',
      ],
      reassurance: 'You don\'t need to know everything. You just need to start.',
    },
    heading: { pre: 'Tell us ', italic: 'where', tail: ' you\'re at.' },
    subStem: 'Your answer shapes the rest of the plan. There\'s no wrong choice.',
    whyWeAsk: 'This shapes the tone and pace of your plan. People who\'ve already decided need next-action language; people exploring need more space to weigh things up.',
    options: [
      { value: 'decided', label: 'We\'ve decided to separate', sub: 'You want to make a clear plan.' },
      { value: 'thinking', label: 'I\'m thinking about separating', sub: 'You want to understand what\'s involved.' },
      { value: 'in_process', label: 'We\'re already in the process', sub: 'You want to get things moving faster.' },
    ],
    cta: 'Set up your situation',
    trustBand: { left: 'Free', right: 'Private until saved' },
  };
}
