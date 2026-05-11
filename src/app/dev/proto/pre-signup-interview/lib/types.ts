export type Stage = 'thinking' | 'decided' | 'in_process';

export type Priority =
  | 'fair-split'
  | 'keep-home'
  | 'protect-pension'
  | 'children-stability'
  | 'clean-break'
  | 'speed'
  | 'low-cost'
  | 'ongoing-support';

export type Worry =
  | 'enough-to-live'
  | 'hidden-assets'
  | 'losing-pension'
  | 'mortgage-alone'
  | 'process-cost'
  | 'emotional-toll'
  | 'ex-cooperation'
  | 'fairness-unknown';

export interface WhatMattersAnswers {
  priorities?: ReadonlyArray<Priority>;
  worries?: ReadonlyArray<Worry>;
}

export type RelationshipStatus = 'married' | 'civil-partnership' | 'cohabiting' | 'other';
export type LivingTogether = 'yes' | 'no' | 'complicated';
export type Home = 'mortgage' | 'own-outright' | 'rent' | 'other';
export type ChildrenCount = 1 | 2 | 3 | 4;

export interface SituationAnswers {
  relationship?: RelationshipStatus;
  living?: LivingTogether;
  hasChildren?: 'yes' | 'no';
  childrenCount?: ChildrenCount;
  home?: Home;
}

export type RelationshipQuality = 'amicable' | 'difficult' | 'high-conflict' | 'safety-concern';
export type DevicePrivate = 'yes' | 'not-sure';

export interface ExAndSafetyAnswers {
  relationshipQuality?: RelationshipQuality;
  devicePrivate?: DevicePrivate;
}

export function hasSafetyFlag(ex: ExAndSafetyAnswers | undefined): boolean {
  return ex?.relationshipQuality === 'safety-concern' || ex?.devicePrivate === 'not-sure';
}

export type SelfEmployment = 'neither' | 'me' | 'ex' | 'both';

export interface EmploymentAnswers {
  selfEmployment?: SelfEmployment;
}

export type PartnerAwareness = 'good-idea' | 'some-things' | 'very-little' | 'hiding';

export interface PartnerFinancesAnswers {
  awareness?: PartnerAwareness;
}

export interface Answers {
  stage?: Stage;
  situation?: SituationAnswers;
  exAndSafety?: ExAndSafetyAnswers;
  employment?: EmploymentAnswers;
  partnerFinances?: PartnerFinancesAnswers;
  whatMatters?: WhatMattersAnswers;
}

export interface PlanContent {
  situationSummary: string;
  journeyStages: ReadonlyArray<{ key: string; label: string; sub: string }>;
  whatNeedsToHappen: ReadonlyArray<string>;
  conventionalPath: { headline: string; cost: string; timeline: string; body: string };
  howDecoupleHelps: { headline: string; body: string; pillars: ReadonlyArray<string> };
  personalisedNotes: ReadonlyArray<{ trigger: string; body: string }>;
  links: { findOutMoreHref: string; primaryCTA: string };
}

export type BgMode = 'expressive' | 'canvasChrome' | 'o7Surface' | 'standalone';
export const BG_MODES: ReadonlyArray<BgMode> = ['expressive', 'canvasChrome', 'o7Surface', 'standalone'] as const;

export const TOTAL_STEPS = 8;

export type TitleShape =
  | { kind: 'plain'; text: string }
  | { kind: 'split'; bold: string; accent: string; period?: boolean };
