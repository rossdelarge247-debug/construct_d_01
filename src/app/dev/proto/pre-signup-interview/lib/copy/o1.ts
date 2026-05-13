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

export interface O1Copy {
  eyebrow: string;
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
    heading: { pre: 'Tell us ', italic: 'where', tail: ' you\'re at.' },
    subStem: 'Your answer shapes the rest of the plan. There\'s no wrong choice.',
    whyWeAsk: 'This shapes the tone and pace of your plan. People who\'ve already decided need next-action language; people exploring need more space to weigh things up.',
    options: [
      { value: 'decided', label: 'We\'ve decided to separate', sub: 'You want to get the finances sorted.' },
      { value: 'thinking', label: 'I\'m thinking about separating', sub: 'You want to understand what\'s involved.' },
      { value: 'in_process', label: 'We\'re already in the process', sub: 'You want to get things moving faster.' },
    ],
    cta: 'Continue',
    trustBand: { left: 'Free', right: 'Private until saved' },
  };
}
