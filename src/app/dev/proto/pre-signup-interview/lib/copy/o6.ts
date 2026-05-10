import type { Stage, Priority, Worry } from '../types';

interface PriorityOption {
  value: Priority;
  label: string;
}

interface WorryOption {
  value: Worry;
  label: string;
}

export interface O6Copy {
  eyebrow: string;
  heading: string;
  hint: string;
  priorities: {
    label: string;
    options: ReadonlyArray<PriorityOption>;
  };
  worries: {
    label: string;
    options: ReadonlyArray<WorryOption>;
  };
  ctaLabel: (priorityCount: number, worryCount: number) => string;
}

export function getCopy(_stage: Stage): O6Copy {
  return {
    eyebrow: 'O6 · What matters',
    heading: 'What matters most to you?',
    hint: 'Pick what matters most. There’s no wrong answer.',
    priorities: {
      label: 'What’s most important to you right now?',
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
      label: 'What worries you most?',
      options: [
        { value: 'enough-to-live', label: 'Not having enough to live on' },
        { value: 'hidden-assets', label: 'Hidden assets or dishonesty' },
        { value: 'losing-pension', label: 'Losing my pension' },
        { value: 'mortgage-alone', label: 'Not being able to afford the mortgage alone' },
        { value: 'process-cost', label: 'The cost of the process itself' },
        { value: 'emotional-toll', label: 'The emotional toll' },
        { value: 'ex-cooperation', label: 'My ex not cooperating' },
        { value: 'fairness-unknown', label: 'Not knowing what’s fair' },
      ],
    },
    ctaLabel: (priorityCount, worryCount) =>
      `Continue${priorityCount + worryCount > 0 ? ` (${priorityCount + worryCount} chosen)` : ''}`,
  };
}
