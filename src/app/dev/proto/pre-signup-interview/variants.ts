import type { PrototypeVariants } from '@/lib/dev/variant-manifest';

export const PRE_SIGNUP_INTERVIEW_VARIANTS: PrototypeVariants = {
  prototypeId: 'pre-signup-interview',
  prototypeLabel: 'Pre-signup interview',
  manifest: {
    helpRail: {
      label: 'Desktop Help Rail',
      options: [
        {
          id: 'off',
          label: 'Off (mobile-only behaviour)',
          description: 'Hide the desktop rail; existing mobile flow only.',
        },
        {
          id: 'v1',
          label: 'V1 · Glossary',
          description: 'Contextual glossary; current term highlighted.',
        },
        {
          id: 'v2',
          label: 'V2 · AI Coach',
          description: 'Ask-anything coach affordance with scope copy.',
        },
        {
          id: 'v3',
          label: 'V3 · Why we ask',
          description: 'Per-field rationale; trust play.',
        },
        {
          id: 'v4',
          label: 'V4 · Talk to a human',
          description: 'Channels: chat / phone / email.',
        },
        {
          id: 'v5',
          label: 'V5 · Hybrid (tabbed)',
          description: 'Tabs across V1-V4.',
        },
      ],
      default: 'off',
    },
  },
};
