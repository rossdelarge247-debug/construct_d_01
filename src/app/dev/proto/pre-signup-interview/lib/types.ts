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

export interface Answers {
  stage?: Stage;
  livingArrangement?: LivingArrangement;
  children?: ChildrenStatus;
  relationship?: RelationshipDynamic;
  employment?: Employment;
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
