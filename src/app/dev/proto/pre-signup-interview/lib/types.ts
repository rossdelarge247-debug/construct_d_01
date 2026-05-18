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

export type SelfEmployment = 'no' | 'me' | 'ex' | 'both';

export interface EmploymentAnswers {
  selfEmployment?: SelfEmployment;
}

export type PartnerAwareness = 'full' | 'some' | 'little' | 'suspect';

export interface PartnerFinancesAnswers {
  awareness?: PartnerAwareness;
}

export type ChildAge = '0-4' | '5-11' | '12-15' | '16-17' | '18+';
export type AdultAge = '<30' | '30-39' | '40-49' | '50-59' | '60+';
export type ExAgeRelative = 'same' | 'older' | 'younger' | 'unknown';
export type RelationshipLength = '<2y' | '2-5y' | '5-10y' | '10-20y' | '20+y';
export type IncomeBracket = '<2k' | '2-4k' | '4-6k' | '6-10k' | '>10k';
export type TotalAssetsBracket = '<10k' | '10-50k' | '50-200k' | '200-500k' | '500k-1M' | '>1M';
export type PropertyEquityBracket = '<50k' | '50-150k' | '150-300k' | '300-500k' | '500k+';
export type SavingsCashBracket = '<5k' | '5-20k' | '20-50k' | '50-100k' | '100k+';
export type DebtsBracket = 'none' | '<5k' | '5-15k' | '15-30k' | '30k+';
export type PensionValueBracket = 'none' | '<25k' | '25-100k' | '100-300k' | '300k+';
export type TargetTimeline = 'asap' | '3m' | '6m' | '12m' | '18m+' | 'unsure';
export type TimelineDriver = 'deadline' | 'new_relationship' | 'housing' | 'children' | 'financial' | 'emotional' | 'none';

export interface Quantitative {
  child_age_youngest?: ChildAge | null;
  child_age_oldest?: ChildAge | null;
  your_age?: AdultAge | null;
  ex_age_relative?: ExAgeRelative | null;
  relationship_length?: RelationshipLength | null;
  combined_monthly_income?: IncomeBracket | null;
  total_assets?: TotalAssetsBracket | null;
  property_equity?: PropertyEquityBracket | null;
  savings_cash?: SavingsCashBracket | null;
  debts_non_mortgage?: DebtsBracket | null;
  pension_value?: PensionValueBracket | null;
  target_timeline?: TargetTimeline | null;
  timeline_drivers?: ReadonlyArray<TimelineDriver>;
}

export interface Answers {
  stage?: Stage;
  situation?: SituationAnswers;
  exAndSafety?: ExAndSafetyAnswers;
  employment?: EmploymentAnswers;
  partnerFinances?: PartnerFinancesAnswers;
  whatMatters?: WhatMattersAnswers;
  quantitative?: Quantitative;
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
