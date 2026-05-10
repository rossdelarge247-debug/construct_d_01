import type { Stage, RelationshipQuality, DevicePrivate } from '../types';

interface RelationshipOption {
  value: RelationshipQuality;
  label: string;
  helper?: string;
}

interface DeviceOption {
  value: DevicePrivate;
  label: string;
}

export interface O3Copy {
  eyebrow: string;
  heading: string;
  relationship: {
    label: string;
    options: ReadonlyArray<RelationshipOption>;
  };
  privacy: {
    preamble: string;
    label: string;
    options: ReadonlyArray<DeviceOption>;
  };
}

export function getCopy(_stage: Stage): O3Copy {
  return {
    eyebrow: 'O3 · Your ex & safety',
    heading: 'How would you describe things between you?',
    relationship: {
      label: 'Your relationship right now',
      options: [
        { value: 'amicable', label: 'Amicable', helper: 'We want to sort this out together' },
        { value: 'difficult', label: 'Difficult — but manageable' },
        { value: 'high-conflict', label: 'High conflict', helper: 'Communication is very hard' },
        { value: 'safety-concern', label: 'I have safety concerns' },
      ],
    },
    privacy: {
      preamble: 'Some people read these screens with a partner nearby.',
      label: 'Is this device private to you?',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'not-sure', label: 'Not sure' },
      ],
    },
  };
}
