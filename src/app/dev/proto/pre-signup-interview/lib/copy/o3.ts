import type { Stage, RelationshipQuality, DevicePrivate } from '../types';

interface RelationshipOption {
  value: RelationshipQuality;
  primary: string;
  detail?: string;
}

interface DeviceOption {
  value: DevicePrivate;
  label: string;
}

export interface O3Copy {
  eyebrow: string;
  heading: string;
  whyWeAsk: string;
  relationship: {
    label: string;
    options: ReadonlyArray<RelationshipOption>;
  };
  privacy: {
    preamble: string;
    label: string;
    options: ReadonlyArray<DeviceOption>;
  };
  captions: {
    pickToContinue: string;
    privacyOptional: string;
    bothAnswered: string;
  };
}

export function getCopy(_stage: Stage): O3Copy {
  return {
    eyebrow: 'Your ex',
    heading: 'How would you describe things between you and your ex?',
    whyWeAsk: 'How things stand between you shapes whether you\'ll work through this together or apart. We also ask about safety so we can adjust the rest of the conversation.',
    relationship: {
      label: 'How would you describe things between you and your ex?',
      options: [
        { value: 'amicable', primary: 'Amicable', detail: 'we want to sort this out together' },
        { value: 'difficult', primary: 'Difficult', detail: 'but manageable' },
        { value: 'high-conflict', primary: 'High conflict', detail: 'communication is very hard' },
        { value: 'safety-concern', primary: 'I have safety concerns' },
      ],
    },
    privacy: {
      preamble: 'Some people read these screens with a partner nearby. We want to know whether you have privacy here.',
      label: 'Is this device private to you?',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'not-sure', label: 'Not sure' },
      ],
    },
    captions: {
      pickToContinue: 'Pick the option that fits best to continue.',
      privacyOptional: "Device privacy is optional — skip if you'd like.",
      bothAnswered: 'Both answered.',
    },
  };
}
