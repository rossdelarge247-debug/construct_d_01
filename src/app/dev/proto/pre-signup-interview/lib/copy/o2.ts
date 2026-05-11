import type { Stage, RelationshipStatus, LivingTogether, ChildrenCount, Home, TitleShape } from '../types';

interface QuestionRelationship {
  key: 'relationship';
  label: string;
  options: ReadonlyArray<{ value: RelationshipStatus; label: string }>;
}

interface QuestionLiving {
  key: 'living';
  label: string;
  options: ReadonlyArray<{ value: LivingTogether; label: string }>;
}

interface QuestionChildren {
  key: 'children';
  label: string;
  yesLabel: string;
  noLabel: string;
  countOptions: ReadonlyArray<{ value: ChildrenCount; label: string }>;
}

interface QuestionHome {
  key: 'home';
  label: string;
  options: ReadonlyArray<{ value: Home; label: string }>;
}

export interface O2Copy {
  eyebrow: string;
  heading: TitleShape;
  helper?: string;
  relationship: QuestionRelationship;
  living: QuestionLiving;
  children: QuestionChildren;
  home: QuestionHome;
  ctaCaption: (answeredCount: number) => string;
}

export function getCopy(_stage: Stage): O2Copy {
  return {
    eyebrow: 'O2 · Your situation',
    heading: { kind: 'split', bold: 'Your', accent: 'situation', period: true },
    relationship: {
      key: 'relationship',
      label: 'Relationship',
      options: [
        { value: 'married', label: 'Married' },
        { value: 'civil-partnership', label: 'Civil partnership' },
        { value: 'cohabiting', label: 'Cohabiting' },
        { value: 'other', label: 'Other' },
      ],
    },
    living: {
      key: 'living',
      label: 'Living together',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
        { value: 'complicated', label: 'Complicated' },
      ],
    },
    children: {
      key: 'children',
      label: 'Children under 18',
      yesLabel: 'Yes',
      noLabel: 'No',
      countOptions: [
        { value: 1, label: '1' },
        { value: 2, label: '2' },
        { value: 3, label: '3' },
        { value: 4, label: '4+' },
      ],
    },
    home: {
      key: 'home',
      label: 'Your home',
      options: [
        { value: 'mortgage', label: 'Own with mortgage' },
        { value: 'own-outright', label: 'Own outright' },
        { value: 'rent', label: 'Rent' },
        { value: 'other', label: 'Other' },
      ],
    },
    ctaCaption: (n) => `${n} of 4 answered`,
  };
}
