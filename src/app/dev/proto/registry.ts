import type { RegistryRow } from './registry-schema';

type RowInput = Omit<RegistryRow, 'owner' | 'tags' | 'openQuestions' | 'lastTouched' | 'links'> &
  Partial<Pick<RegistryRow, 'owner' | 'tags' | 'openQuestions' | 'lastTouched' | 'links'>>;

function row(input: RowInput): RegistryRow {
  return {
    owner: 'both',
    tags: [],
    openQuestions: [],
    lastTouched: { session: 74, date: '2026-05-08' },
    links: {},
    ...input,
  };
}

export const registry: RegistryRow[] = [
  // §1 · Pre-auth public
  row({ id: 'marketing-landing', title: 'Marketing landing', section: 'pre-auth-public', status: 'prototype-built', confidence: 'medium', tags: ['mobile-priority'], openQuestions: ['Mobile-first vs desktop-first authoring order?'], lastTouched: { session: 115, date: '2026-05-22' }, links: { canvas: 'docs/design-source/marketing-landing/', prototype: 'src/app/dev/proto/marketing-landing/' } }),
  row({ id: 'how-it-works', title: 'How it works', section: 'pre-auth-public', status: 'shell-built', confidence: 'medium', openQuestions: ['Copy depth — narrative vs scannable bullets?'], lastTouched: { session: 115, date: '2026-05-22' }, links: { canvas: 'docs/design-source/mobile-screens-v2/', prototype: 'src/app/dev/proto/how-it-works/' } }),
  row({ id: 'pricing', title: 'Pricing', section: 'pre-auth-public', status: 'shell-built', confidence: 'low-blocked', tags: ['blocks-launch'], openQuestions: ['Pricing decision deferred per spec 56 L8.2 — when?'], lastTouched: { session: 115, date: '2026-05-22' }, links: { canvas: 'docs/design-source/mobile-screens-v2/', spec: 'docs/workspace-spec/56-launch-readiness.md', prototype: 'src/app/dev/proto/pricing/' } }),
  row({ id: 'faq-trust', title: 'FAQ & Trust', section: 'pre-auth-public', status: 'shell-built', confidence: 'medium', openQuestions: ['Which questions surface; trust-signal sources?'], lastTouched: { session: 115, date: '2026-05-22' }, links: { canvas: 'docs/design-source/mobile-screens-v2/', prototype: 'src/app/dev/proto/faq-trust/' } }),
  row({ id: 'pre-signup-interview', title: 'Pre-signup interview O1-O8', section: 'pre-auth-public', status: 'prototype-built', confidence: 'medium', tags: ['ai-dependent', 'free-tier'], openQuestions: ['O7 (Your plan) + O8 (What’s next) full canvas reconstruction deferred — assets preserved at docs/design-source/pre-signup-interview/', 'Per-screen bg defaults (canvas-overview L177-179: O2-O6 use canvasChrome, O1+O7+O8 use expressive) not implemented — global default stays expressive', 'Inline-style proto consumption — F1 design intent at tokens.ts L7-9 says CSS-class via var(--ds-*); proto-wide refactor deferred', 'Stage-tone copy differentiation per spec 65 §Principle 6 — resolver scaffold ships, per-stage diff deferred'], lastTouched: { session: 80, date: '2026-05-10' }, links: { spec: 'docs/workspace-spec/65-pre-signup-interview-reconciled.md', canvas: 'docs/design-source/pre-signup-interview/', prototype: 'src/app/dev/proto/pre-signup-interview/', slice: 'docs/slices/S-PROTO-pre-signup-interview/' } }),
  row({ id: 'ai-plan-preview', title: 'AI plan preview / "Your plan"', section: 'pre-auth-public', status: 'spec-only', confidence: 'low', tags: ['ai-dependent', 'free-tier', 'high-uncertainty'], openQuestions: ['What is gated behind sign-up vs visible pre-account?'], links: { spec: 'docs/workspace-spec/74-ai-plan-generation.md' } }),
  row({ id: 'legal-trio', title: 'Privacy / Terms / Cookies', section: 'pre-auth-public', status: 'spec-only', confidence: 'low-blocked', tags: ['legal-review-pending', 'blocks-launch', 'placeholder-shipped'], openQuestions: ['Spec 56 L2 legal review timing?'], links: { spec: 'docs/workspace-spec/56-launch-readiness.md', prototype: 'src/app/privacy/' } }),
  row({ id: 'invitation-landing', title: 'Invitation landing (respondent)', section: 'pre-auth-public', status: 'not-started', confidence: 'low', tags: ['multi-actor'], openQuestions: ['Inherited-context display per spec 67a?'], links: { spec: 'docs/workspace-spec/67a-respondent-state-machine.md' } }),

  // §2 · Auth boundary
  row({ id: 'sign-in', title: 'Sign in', section: 'auth-boundary', status: 'canvas-drafted', confidence: 'medium', openQuestions: ['Magic-link only or password fallback?'], links: { canvas: 'docs/design-source/mobile-screens-v2/' } }),
  row({ id: 'sign-up', title: 'Sign up', section: 'auth-boundary', status: 'prototype-built', confidence: 'medium', openQuestions: ['Spec 65a reconciliation rendering?'], lastTouched: { session: 125, date: '2026-09-09' }, links: { canvas: 'docs/design-source/mobile-screens-v2/', spec: 'docs/workspace-spec/65a-signup-orientation-reconciliation.md', prototype: 'src/app/dev/proto/sign-up/' } }),
  row({ id: 'magic-link-sent', title: 'Magic-link sent confirmation', section: 'auth-boundary', status: 'not-started', confidence: 'low-blocked', openQuestions: ['Resend cooldown UX?'] }),

  // §3 · Post-signup onboarding
  row({ id: 'welcome-tour', title: 'Welcome tour / carousel', section: 'post-signup-onboarding', status: 'prototype-built', confidence: 'medium', openQuestions: ['Skip-to-end vs forced linearity?'], lastTouched: { session: 115, date: '2026-05-22' }, links: { canvas: 'docs/design-source/welcome-tour/', prototype: 'src/app/dev/proto/welcome-tour/' } }),
  row({ id: 'moment-1-ack', title: 'Moment 1 acknowledgement', section: 'post-signup-onboarding', status: 'prototype-built', confidence: 'medium', links: { spec: 'docs/workspace-spec/67-post-signup-profiling-progress.md', prototype: 'src/app/dev/proto/moment-1-ack/' } }),
  row({ id: 'moment-2-profiling', title: 'Moment 2 pre-bank profiling', section: 'post-signup-onboarding', status: 'prototype-built', confidence: 'medium', links: { spec: 'docs/workspace-spec/67-post-signup-profiling-progress.md', prototype: 'src/app/dev/proto/moment-2-profiling/' } }),
  row({ id: 'safeguarding-signposting', title: 'Safeguarding signposting', section: 'post-signup-onboarding', status: 'prototype-built', confidence: 'high', tags: ['safeguarding'], links: { spec: 'docs/workspace-spec/67-post-signup-profiling-progress.md', prototype: 'src/app/dev/proto/safeguarding-signposting/' } }),

  // §4 · Bank-connect
  row({ id: 'bank-picker', title: 'Bank picker', section: 'bank-connect', status: 'prototype-built', confidence: 'high', links: { prototype: 'src/app/dev/proto/bank-connect/' } }),
  row({ id: 'tink-mid-flow', title: 'Tink iframe mid-flow', section: 'bank-connect', status: 'prototype-built', confidence: 'medium', links: { prototype: 'src/app/dev/proto/bank-connect/' } }),
  row({ id: 'callback-success', title: 'Callback success', section: 'bank-connect', status: 'prototype-built', confidence: 'high', links: { prototype: 'src/app/dev/proto/bank-connect/' } }),
  row({ id: 'callback-error-retry', title: 'Callback error / retry', section: 'bank-connect', status: 'prototype-built', confidence: 'high', links: { prototype: 'src/app/dev/proto/bank-connect/' } }),
  row({ id: 'manual-entry-fallback', title: 'Manual entry fallback', section: 'bank-connect', status: 'not-started', confidence: 'low-blocked', openQuestions: ['When offered vs document upload?'] }),

  // §5 · Hub
  row({ id: 'hub-day-1', title: 'Hub Day 1', section: 'hub', status: 'not-started', confidence: 'low', openQuestions: ['Empty-state UX?'] }),
  row({ id: 'hub-day-7-state-f', title: 'Hub Day 7 (state F)', section: 'hub', status: 'prototype-built', confidence: 'medium', openQuestions: ['Progress-visualisation primacy?'], lastTouched: { session: 115, date: '2026-05-22' }, links: { canvas: 'docs/design-source/post-connect-dashboard/', prototype: 'src/app/dev/proto/post-connect-dashboard/', slice: 'docs/slices/S-PROTO-post-connect-dashboard-canvas-port/' } }),
  row({ id: 'hub-state-a-mid-build', title: 'Hub state A (mid-build)', section: 'hub', status: 'not-started', confidence: 'low', openQuestions: ['Section-completion ordering?'] }),
  row({ id: 'hub-state-b-review', title: 'Hub state B (review)', section: 'hub', status: 'not-started', confidence: 'low', openQuestions: ['Trigger criteria?'] }),
  row({ id: 'hub-return-visit', title: 'Hub return-visit', section: 'hub', status: 'not-started', confidence: 'low-blocked', openQuestions: ["What's-changed-since-last UX?"] }),
  row({ id: 'todos', title: 'Todos', section: 'hub', status: 'canvas-drafted', confidence: 'low', tags: ['canvas-multi-variant'], openQuestions: ['Variant choice — base / v2 / vA / vB / vC?'], links: { canvas: 'docs/design-source/mobile-screens-v2/' } }),

  // §6 · Build
  row({ id: 'extraction-results', title: 'What we found (AI extraction results)', section: 'build', status: 'prototype-built', confidence: 'high', links: { prototype: 'src/app/dev/proto/extraction-results/' } }),
  row({ id: 'per-section-confirm', title: 'Confirm your data (7-section hub)', section: 'build', status: 'prototype-built', confidence: 'high', lastTouched: { session: 117, date: '2026-05-22' }, links: { canvas: 'docs/design-source/mobile-screens-v2/', prototype: 'src/app/dev/proto/section-confirm/', slice: 'docs/slices/S-PROTO-section-confirm/' } }),
  row({ id: 'bank-rec-categorise', title: 'Bank-rec: Categorise', section: 'build', status: 'prototype-built', confidence: 'medium', openQuestions: ['Category-set finalisation?'], lastTouched: { session: 117, date: '2026-05-22' }, links: { canvas: 'docs/design-source/mobile-screens-v2/', prototype: 'src/app/dev/proto/section-confirm/categorise/' } }),
  row({ id: 'bank-rec-confirm-recurring', title: 'Bank-rec: Confirm recurring', section: 'build', status: 'prototype-built', confidence: 'medium', openQuestions: ['Variable-amount edge cases?'], lastTouched: { session: 117, date: '2026-05-22' }, links: { canvas: 'docs/design-source/mobile-screens-v2/', prototype: 'src/app/dev/proto/section-confirm/confirm-recurring/' } }),
  row({ id: 'bank-rec-manual-entry', title: 'Bank-rec: Manual entry', section: 'build', status: 'prototype-built', confidence: 'high', links: { canvas: 'docs/design-source/mobile-screens-v2/', prototype: 'src/app/dev/proto/section-confirm/manual-entry/' } }),
  row({ id: 'bank-rec-resolve-duplicate', title: 'Bank-rec: Resolve duplicate', section: 'build', status: 'prototype-built', confidence: 'high', links: { canvas: 'docs/design-source/mobile-screens-v2/', prototype: 'src/app/dev/proto/section-confirm/resolve-duplicate/' } }),
  row({ id: 'bank-rec-split', title: 'Bank-rec: Split', section: 'build', status: 'prototype-built', confidence: 'high', links: { canvas: 'docs/design-source/mobile-screens-v2/', prototype: 'src/app/dev/proto/section-confirm/split/' } }),
  row({ id: 'bank-rec-balance-check', title: 'Bank-rec: Balance check', section: 'build', status: 'prototype-built', confidence: 'high', links: { canvas: 'docs/design-source/mobile-screens-v2/', prototype: 'src/app/dev/proto/section-confirm/balance-check/' } }),
  row({ id: 'hidden-asset-prompts', title: 'Hidden-asset prompts', section: 'build', status: 'spec-only', confidence: 'low-blocked', openQuestions: ['Trigger criteria?'] }),
  row({ id: 'your-picture-private', title: 'Your Picture (private mode)', section: 'build', status: 'prototype-built', confidence: 'high', lastTouched: { session: 124, date: '2026-05-25' }, links: { canvas: 'docs/design-source/mobile-screens-v2/', prototype: 'src/app/dev/proto/your-picture/' } }),
  row({ id: 'document-picker', title: 'Document picker', section: 'build', status: 'not-started', confidence: 'low-blocked', openQuestions: ['Upload UX + document types?'] }),

  // §7 · Reconcile
  row({ id: 'joint-document-view', title: 'Joint document view', section: 'reconcile', status: 'canvas-drafted', confidence: 'medium', tags: ['multi-actor'], openQuestions: ['Divergence display + permissions?'], links: { canvas: 'docs/design-source/mobile-screens-v2/' } }),
  row({ id: 'conflict-card', title: 'Conflict card', section: 'reconcile', status: 'spec-only', confidence: 'low', tags: ['multi-actor', 'high-uncertainty'], openQuestions: ['Tone + resolution-path UX?'] }),
  row({ id: 'reconciliation-queue', title: 'Reconciliation queue', section: 'reconcile', status: 'spec-only', confidence: 'low', tags: ['multi-actor'], openQuestions: ['Ordering + status display?'] }),
  row({ id: 'share-flow', title: 'Share flow (Sarah/Mark joint)', section: 'reconcile', status: 'prototype-built', confidence: 'medium', tags: ['multi-actor', 'high-uncertainty'], openQuestions: [], lastTouched: { session: 119, date: '2026-05-23' }, links: { spec: 'docs/workspace-spec/68a-decisions-crosscutting.md', prototype: 'src/app/dev/proto/share-flow/', slice: 'docs/slices/S-PROTO-share-flow/' } }),
  row({ id: 'counter-proposal-request', title: 'Counter-proposal request', section: 'reconcile', status: 'spec-only', confidence: 'low-blocked', tags: ['multi-actor'], openQuestions: ['Respondent-path UX?'] }),

  // §8 · Settle
  row({ id: 'proposal-builder', title: 'Proposal builder', section: 'settle', status: 'spec-only', confidence: 'low-blocked', openQuestions: ['Anchor visualisation + what-if explorer?'] }),
  row({ id: 'ai-coach', title: 'AI coach', section: 'settle', status: 'prototype-built', confidence: 'medium', tags: ['ai-dependent'], openQuestions: ['Invocation pattern locked: always-on rail, cards-only'], lastTouched: { session: 118, date: '2026-05-22' }, links: { prototype: 'src/app/dev/proto/ai-coach/', slice: 'docs/slices/S-PROTO-ai-coach/' } }),
  row({ id: 'counter', title: 'Counter (against proposal)', section: 'settle', status: 'spec-only', confidence: 'low-blocked', openQuestions: ['Suggestion-quality threshold?'] }),
  row({ id: 'settlement-redline', title: 'Settlement redline', section: 'settle', status: 'canvas-drafted', confidence: 'medium', openQuestions: ['Change-visualisation + accept/reject UX?'], links: { canvas: 'docs/design-source/mobile-screens-v2/' } }),
  row({ id: 'negotiation-history', title: 'Negotiation history', section: 'settle', status: 'not-started', confidence: 'low-blocked', openQuestions: ['Timeline UX + what to surface?'] }),

  // §9 · Finalise
  row({ id: 'consent-order-generation', title: 'Consent order generation', section: 'finalise', status: 'spec-only', confidence: 'low-blocked', openQuestions: ['Doc template + field mapping?'] }),
  row({ id: 'preflight-advisory', title: 'Pre-flight advisory', section: 'finalise', status: 'canvas-drafted', confidence: 'medium', openQuestions: ['Warning taxonomy: gate vs advisory?'], links: { canvas: 'docs/design-source/mobile-screens-v2/' } }),
  row({ id: 'fork-flow', title: 'Fork (separate or joint submission)', section: 'finalise', status: 'spec-only', confidence: 'low-blocked', openQuestions: ['Trigger criteria + split mechanics?'] }),
  row({ id: 'court-submit', title: 'Submit to court', section: 'finalise', status: 'not-started', confidence: 'low-blocked', tags: ['legal-review-pending'], openQuestions: ['E-submission vs PDF + form package?'] }),
  row({ id: 'post-order-implementation', title: 'Post-order implementation', section: 'finalise', status: 'not-started', confidence: 'low-blocked', openQuestions: ['Scope + reminders?'] }),

  // §10 · Cross-cutting
  row({ id: 'account-admin', title: 'Account admin / settings', section: 'cross-cutting', status: 'spec-only', confidence: 'low-blocked', openQuestions: ['V1 minimum scope from spec 75?'], links: { spec: 'docs/workspace-spec/75-account-administration.md' } }),
  row({ id: 'notifications', title: 'Notifications', section: 'cross-cutting', status: 'not-started', confidence: 'low-blocked', openQuestions: ['Channel set + per-event allowlist?'] }),
  row({ id: 'trust-band', title: 'Trust band', section: 'cross-cutting', status: 'canvas-drafted', confidence: 'high', openQuestions: ['Position discipline — when shown vs hidden?'] }),
  row({ id: 'exit-this-page-footer', title: 'Exit-this-page footer', section: 'cross-cutting', status: 'spec-only', confidence: 'high', tags: ['safeguarding'], openQuestions: ['Behaviour spec finalisation?'] }),
  row({ id: 'global-ai-coach-surface', title: 'Global AI coach surface', section: 'cross-cutting', status: 'not-started', confidence: 'low', tags: ['ai-dependent'], openQuestions: ['Where invoked + persistence model?'] }),

  // §11 · Dev tools
  row({ id: 'dev-root-landing', title: 'Dev root landing', section: 'dev-tools', status: 'shipped', confidence: 'high', tags: ['dev-only'], links: { prototype: 'src/app/dev/' } }),
  row({ id: 'dev-heroes', title: 'Dev hero variant gallery', section: 'dev-tools', status: 'shipped', confidence: 'high', links: { prototype: 'src/app/dev/heroes/' } }),
  row({ id: 'dev-variant-control', title: 'Prototype variant control', section: 'dev-tools', status: 'shipped', confidence: 'high', tags: ['dev-only'], links: { prototype: 'src/app/dev/control/' } }),
  row({ id: 'dev-scenarios', title: 'Dev scenario picker', section: 'dev-tools', status: 'shipped', confidence: 'high', tags: ['dev-only'], links: { prototype: 'src/app/dev/scenarios/' } }),
  row({ id: 'dev-state-inspector', title: 'Dev state inspector', section: 'dev-tools', status: 'shipped', confidence: 'high', tags: ['dev-only'], links: { prototype: 'src/app/dev/state-inspector/' } }),
  row({ id: 'dev-reset', title: 'Dev state reset', section: 'dev-tools', status: 'shipped', confidence: 'high', tags: ['dev-only'], links: { prototype: 'src/app/dev/reset/' } }),
  row({ id: 'dev-engine-workbench', title: 'Engine workbench', section: 'dev-tools', status: 'shipped', confidence: 'high', tags: ['dev-only'], links: { prototype: 'src/app/dev/engine-workbench/' } }),
];
