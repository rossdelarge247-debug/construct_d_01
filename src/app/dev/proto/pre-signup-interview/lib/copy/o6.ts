import type { Stage, Priority, Worry } from '../types';

export interface O6PriorityOption {
  value: Priority;
  label: string;
}

export interface O6WorryOption {
  value: Worry;
  label: string;
}

export interface O6Copy {
  eyebrow: {
    label: string;
    accent: 'magenta';
  };
  heading: string;
  whyWeAsk: string;
  priorities: {
    title: string;
    caption: string;
    options: ReadonlyArray<O6PriorityOption>;
  };
  worries: {
    title: string;
    caption: string;
    options: ReadonlyArray<O6WorryOption>;
  };
  captions: {
    empty: string;
    notedSingular: string;
    notedPlural: (count: number) => string;
  };
  cta: {
    label: string;
  };
}

export function getCopy(_stage: Stage): O6Copy {
  return {
    eyebrow: { label: 'What matters · last step before your plan', accent: 'magenta' },
    heading: "A few words on what matters to you, and what's worrying you.",
    whyWeAsk: "Your plan should reflect what actually matters to you, not a generic best-practice. These priorities decide which recommendations come up first.",
    priorities: {
      title: "What's most important to you right now?",
      caption: 'Pick up to 3.',
      options: [
        { value: 'fair-split', label: 'A fair split of everything' },
        { value: 'keep-home', label: 'Keeping the family home' },
        { value: 'protect-pension', label: 'Protecting my pension' },
        { value: 'children-stability', label: 'Stability for the children' },
        { value: 'clean-break', label: 'A clean break — no ongoing ties' },
        { value: 'speed', label: 'Getting this done quickly' },
        { value: 'low-cost', label: 'Keeping costs low' },
        { value: 'ongoing-support', label: 'Ongoing financial support' },
      ],
    },
    worries: {
      title: 'What worries you most?',
      caption: 'Pick up to 3.',
      options: [
        { value: 'enough-to-live', label: 'Not having enough to live on' },
        { value: 'hidden-assets', label: 'Hidden assets or dishonesty' },
        { value: 'losing-pension', label: 'Losing my pension' },
        { value: 'mortgage-alone', label: 'Not being able to afford the mortgage alone' },
        { value: 'process-cost', label: 'The cost of the process itself' },
        { value: 'emotional-toll', label: 'The emotional toll' },
        { value: 'ex-cooperation', label: 'My ex not cooperating' },
        { value: 'fairness-unknown', label: "Not knowing what's fair" },
      ],
    },
    captions: {
      empty: 'You can continue without picking — your plan adapts either way.',
      notedSingular: '1 thing noted — your plan will weight these.',
      notedPlural: (count) => `${count} things noted — your plan will weight these.`,
    },
    cta: {
      label: 'Build my plan',
    },
  };
}
