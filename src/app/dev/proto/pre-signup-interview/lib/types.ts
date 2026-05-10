export type Stage = 'considering' | 'starting' | 'in-process';
export type LivingArrangement = 'together' | 'separated' | 'undecided';
export type ChildrenStatus = 'none' | 'have-with-partner' | 'have-from-prior';
export type RelationshipDynamic =
  | 'collaborative'
  | 'difficult-but-managing'
  | 'high-conflict'
  | 'safety-concern';
export type Employment = 'employed' | 'self-employed' | 'mixed' | 'not-working';
export type PartnerFinanceKnowledge =
  | 'open-book'
  | 'mostly-known'
  | 'partially-known'
  | 'unknown';

export type Priority = 'children-stability' | 'family-home' | 'finances-fair' | 'speed' | 'cost' | 'amicable';
export type Worry = 'partner-disclosure' | 'court' | 'cost' | 'time' | 'safety' | 'children-impact';

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

export interface Answers {
  stage?: Stage;
  situation?: SituationAnswers;
  exAndSafety?: ExAndSafetyAnswers;
  employment?: EmploymentAnswers;
  livingArrangement?: LivingArrangement;
  children?: ChildrenStatus;
  relationship?: RelationshipDynamic;
  partnerFinance?: PartnerFinanceKnowledge;
  priorities?: ReadonlyArray<Priority>;
  worries?: ReadonlyArray<Worry>;
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
