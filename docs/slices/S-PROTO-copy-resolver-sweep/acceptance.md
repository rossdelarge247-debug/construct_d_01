# S-PROTO-copy-resolver-sweep

**Category:** prototype

## Why

The Phase 1 Tone audit (`docs/slices/S-PROTO-tone-audit-phase-1/`) walked `lib/copy/*.ts` only. Batch 2 (`S-PROTO-tone-pass-cta-batch`) surfaced that `screens/O2.tsx:205` hardcodes `ctaLabel="Continue"` directly in JSX, bypassing the copy resolver — same anti-pattern as F-TONE-04 but escaped audit because the walk excluded JSX-embedded literals. Recorded as a follow-up in that slice's §"Out of scope".

A live sweep extends the gap: O3 has the same hardcoded `"Continue"`; O7 + O8 have NO copy resolver module at all, with 17 + 18 hardcoded user-facing strings respectively (eyebrows, section titles, loading-step labels, loading aria-label, options array, hero copy, helper text, footer fallbacks).

Plus a paired cleanup: `primaryCTAForStage` (build-plan.ts:57) computes a stage-specific CTA that lands in `plan.links.primaryCTA` and is asserted by 7 tests, but O7.tsx:619 hardcodes `ctaLabel="What's next"` instead — making `primaryCTA` dead code. Two options: wire it into O7 OR remove the dead computation. Wiring matches the F-TONE-04 audit intent that stage-specific warmth ladders should reach the user; the audit's own CTA fix already populates `plan.links.primaryCTA` with `'Begin the plan'` for `decided`-stage users — without the wire, that warmth never renders.

Per CLAUDE.md §"Product rules" §"Show, don't ask" + §"A warm hand on a cold day": all user-facing copy belongs in the copy resolver so it can be audited as one surface, refactored without JSX surgery, and trusted as the canonical product voice.

## In scope

Six surfaces:

- O2.tsx:205 — add `cta.label` to `lib/copy/o2.ts`; replace hardcoded `ctaLabel="Continue"` with `copy.cta.label`.
- O3.tsx:291 — add `cta.label` to `lib/copy/o3.ts`; replace hardcoded `ctaLabel="Continue"` with `copy.cta.label`.
- O7.tsx — author NEW `lib/copy/o7.ts`; replace 20 hardcoded user-facing strings (hero region: 4 · actions: 3 · sections: 12 · reassurance: 1 · generating state: 9; counts overlap because `actions.downloadAsPdf` renders twice — net unique resolver fields = 20). Includes both attribute values (e.g. `eyebrow=`) and JSX text content (e.g. `<Eyebrow>Drawing it together</Eyebrow>`, split-italic headings).
- O7.tsx:619 — replace hardcoded `ctaLabel="What's next"` with `ctaLabel={plan.links.primaryCTA}` (wires the dead `primaryCTA` computation).
- O8.tsx — author NEW `lib/copy/o8.ts`; replace 20 hardcoded user-facing strings (planRecall: 2 · hero: 4 · options: 12 · footer fallbacks: 2). Includes both attribute values and JSX text content.
- `tests/unit/proto-pre-signup/copy-resolver-invariant.test.ts` — new regression test scanning `screens/*.tsx` for hardcoded user-facing string patterns; covers both attribute regex AND JSX text content regex; asserts zero matches outside an empty allowlist at slice ship.

100% rule check: 1 + 1 + 20 + 1 + 20 = 43 mechanical changes (42 string moves + 1 wire) + 1 invariant test. Sweep inventory (post mid-flight scope-expansion) matches.

**Mid-flight scope-expansion note:** the initial sweep at slice-freeze caught attribute values only (`ctaLabel=`, `eyebrow=`, `title=`, etc.). A second pass after the o7 resolver scaffold landed surfaced JSX text content (`<Eyebrow>Drawing it together</Eyebrow>`, split-italic headings like `Take a <italic>breath</italic>.`, action button labels like `<span>Download as PDF</span>`, helper paragraphs). User-confirmed Option A (full broad) at the scope-expansion gate; AC-3 + AC-5 expanded inline.

## Out of scope

- O1 / O4 / O5 / O6 — all resolver-sourced correctly per the live sweep at slice-freeze time; no fixes needed.
- Chassis primitives (`components/TopBar.tsx`, `Hero.tsx`, `Footer.tsx`, `EntryScaffold.tsx`, `WhyWeAsk.tsx`, `BrandBar.tsx`, `BgToggle.tsx`, `ProgressPill.tsx`, `Arrow.tsx`, `BackgroundShell.tsx`) — sweep returned zero hardcoded user-facing strings.
- Tone / content edits on the moved strings. The slice is a **structural move**, not a content edit. Every string is moved verbatim from JSX into the resolver. Anything that wants its register changed is a follow-up audit-finding slice.
- Dynamic strings in O7 sourced from `plan.{conventionalPath,howDecoupleHelps}.headline` — these come from build-plan computation, not the resolver. The resolver owns the static chrome only.
- Spec 65 amendment for quantitative profiling data (inherited P4).
- Desktop graceful enhancement (inherited P3).

## Acceptance criteria

### AC-1 — O2 `ctaLabel` resolver-sourced

`src/app/dev/proto/pre-signup-interview/lib/copy/o2.ts` adds a `cta: { label: string }` field to `O2Copy` interface + returns `cta: { label: 'Continue' }` from `getCopy`.

`src/app/dev/proto/pre-signup-interview/screens/O2.tsx:205` changes from:

- BEFORE: `ctaLabel="Continue"`
- AFTER: `ctaLabel={copy.cta.label}`

The literal string `'Continue'` lives only in the resolver after the move.

### AC-2 — O3 `ctaLabel` resolver-sourced

`src/app/dev/proto/pre-signup-interview/lib/copy/o3.ts` adds a `cta: { label: string }` field to `O3Copy` interface + returns `cta: { label: 'Continue' }` from `getCopy`.

`src/app/dev/proto/pre-signup-interview/screens/O3.tsx:291` changes from:

- BEFORE: `ctaLabel="Continue"`
- AFTER: `ctaLabel={copy.cta.label}`

The literal string `'Continue'` lives only in the resolver after the move.

### AC-3 — O7 resolver authored; 20 strings moved

NEW `src/app/dev/proto/pre-signup-interview/lib/copy/o7.ts` exports:

```ts
export type LoadingStepState = 'done' | 'working' | 'pending';
export interface O7LoadingStep { label: string; state: LoadingStepState; }
export interface SplitHeading { prefix: string; accent: string; suffix?: string; }
export interface O7Copy {
  hero: {
    eyebrow: string;
    heading: SplitHeading;
    helper: string;
    meta: string;
  };
  actions: {
    downloadAsPdf: string;
    emailToMe: string;
    emailLink: string;
  };
  sections: {
    situation: { eyebrow: string; title: string };
    journey: { eyebrow: string; title: string };
    whatNeeds: { eyebrow: string; title: string };
    conventional: { eyebrow: string };
    decoupleHelps: { eyebrow: string };
    notes: { eyebrow: string; title: string; sub: string };
  };
  reassurance: string;
  generating: {
    eyebrow: string;
    heading: SplitHeading;
    helper: string;
    ariaLabel: string;
    steps: ReadonlyArray<O7LoadingStep>;
    workingIndicator: string;
    quote: string;
  };
}
export function getCopy(stage: Stage): O7Copy;
```

`getCopy` returns (verbatim from current O7.tsx):

**Hero region (replaces O7.tsx:127-163):**
- `hero.eyebrow` = `'Your plan is ready'` (L129)
- `hero.heading` = `{ prefix: "Here's", accent: 'your plan', suffix: '.' }` (L131-136 split JSX)
- `hero.helper` = `"Built from your six answers — a warm picture of where you are, what's ahead, and what your options are."` (L138)
- `hero.meta` = `'~5 min read · 4 pages · yours to keep'` (L161)

**Actions (used twice — MobileHero L150/157 + MobileReadyView L630/637):**
- `actions.downloadAsPdf` = `'Download as PDF'` (L150 + L630)
- `actions.emailToMe` = `'Email it to me'` (L157)
- `actions.emailLink` = `'Email link'` (L637)

**Sections (replaces O7.tsx:213 / 238 / 308 / 353 / 389 / 431-433):**
- `sections.situation` = `{ eyebrow: 'Section 1 · what you told us', title: 'Your situation' }`
- `sections.journey` = `{ eyebrow: 'Section 2 · the journey', title: 'What separation looks like' }`
- `sections.whatNeeds` = `{ eyebrow: 'Section 3 · tailored to you', title: 'What needs to happen' }`
- `sections.conventional` = `{ eyebrow: 'Section 4 · for comparison' }` (title stays dynamic from `path.headline`)
- `sections.decoupleHelps` = `{ eyebrow: 'Section 5 · how decouple helps' }` (title stays dynamic from `help.headline`)
- `sections.notes` = `{ eyebrow: 'Section 6 · your specific notes', title: 'Things to bear in mind', sub: 'Drawn from the corners of your situation that need extra care.' }`

**Reassurance (replaces O7.tsx:469):**
- `reassurance` = `"You've built a strong starting position."`

**Generating state (replaces O7.tsx:478-595):**
- `generating.eyebrow` = `'Drawing it together'` (L505)
- `generating.heading` = `{ prefix: 'Take a', accent: 'breath', suffix: '.' }` (L515 split JSX)
- `generating.helper` = `"We're shaping this around the six things you've told us. There's no clock here — we'll be ready when you are."` (L526)
- `generating.ariaLabel` = `'Plan generation progress'` (L533)
- `generating.steps` = 5 entries (replaces module-scope `DISCLOSURE_STEPS` at L477-483):
  - `'Listening to your situation'` · `'done'`
  - `'Mapping the journey'` · `'done'`
  - `'Tailoring next steps'` · `'done'`
  - `'Comparing the conventional path'` · `'working'`
  - `'Writing your specific notes'` · `'pending'`
- `generating.workingIndicator` = `'working…'` (L575)
- `generating.quote` = `'"A warm hand on a cold day."'` (L593; literal smart-quotes preserved)

Total: 20 string moves (counting `actions.downloadAsPdf` once since it's a single resolver field consumed twice in JSX).

`screens/O7.tsx` imports `getCopy` + types from `'../lib/copy/o7'`. The `O7` top-level component calls `getCopy(answers.stage)` once; the resolver value is passed down via props to `MobileHero` / `MobileGeneratingView` / `MobileReadyView` / `Reassurance`, and from those to `MobileSectionHeader` calls. The module-scope `DISCLOSURE_STEPS` constant is deleted (moved to resolver). The local `Eyebrow` primitive (L69-) is unchanged — it's a presentation component, not a copy holder.

Split-JSX rendering: `{copy.hero.heading.prefix}{' '}<span style={...}>{copy.hero.heading.accent}</span>{copy.hero.heading.suffix}` preserves the exact rendered shape. Apostrophes in resolver string values use regular `'`; JSX renders them identically to the existing `&apos;` HTML entities.

### AC-4 — `primaryCTA` wired into O7

`src/app/dev/proto/pre-signup-interview/screens/O7.tsx:619` changes from:

- BEFORE: `ctaLabel="What's next"`
- AFTER: `ctaLabel={plan.links.primaryCTA}`

`plan` is already in scope at L619 (used at L611-617 for `plan.situationSummary` etc.).

Behavioural change: the rendered CTA becomes stage-specific per `primaryCTAForStage`:

- `thinking` → `'See what comes next'`
- `decided` → `'Begin the plan'`
- `in_process` → `'Pick up from here'`
- default → `'Continue'`

The pre-session-101 hardcoded `'What's next'` is removed. Per F-TONE-04 audit intent: the audit's stage-specific warmth ladder reaches the user. The default fallback `'Continue'` remains generic (per F-TONE-04 batch §"Out of scope") because it covers undefined-stage edge cases.

### AC-5 — O8 resolver authored; 20 strings moved

NEW `src/app/dev/proto/pre-signup-interview/lib/copy/o8.ts` exports:

```ts
export type O8OptionId = 'signup' | 'download' | 'conventional' | 'support';
export interface O8Option { id: O8OptionId; title: string; sub: string; cta: string; }
export interface O8Copy {
  planRecall: { label: string; backToPlan: string };
  hero: {
    eyebrow: string;
    heading: string;
    helper: { primary: string; secondary: string };
  };
  options: ReadonlyArray<O8Option>;
  footer: { captionFallback: string; ctaFallback: string };
}
export function getCopy(stage: Stage): O8Copy;
```

`getCopy` returns (verbatim from current O8.tsx):

**PlanRecall (replaces O8.tsx:116-156):**
- `planRecall.label` = `'Your plan is ready'` (L145)
- `planRecall.backToPlan` = `'back to plan'` (L148)

**Hero (replaces O8.tsx:258-268):**
- `hero.eyebrow` = `"What's next · take it from here"` (L259)
- `hero.heading` = `'What would you like to do next?'` (L261 + also rendered as the sr-only legend at L271 — single source for both)
- `hero.helper.primary` = `"There's no wrong answer."` (L264 inline span)
- `hero.helper.secondary` = `'You can come back anytime.'` (L265 inline span)

**Options (replaces module-scope `OPTIONS` at O8.tsx:37-66):**
- `signup`: `'Create a free account and start building my picture'` / `'Free to start; no card needed.'` / `'Create my account'`
- `download`: `'Download my plan and come back later'` / `"We'll keep your answers for 30 days if you want to come back."` / `'Download my plan'`
- `conventional`: `'I want to go the conventional route'` / `"We'll point you to good starting places."` / `'See helpful links'`
- `support`: `'I need to talk to someone first'` / `'Here are people who can help.'` / `'See support resources'`

**Footer fallbacks (replaces O8.tsx:283-284):**
- `footer.captionFallback` = `'Pick an option above to continue.'`
- `footer.ctaFallback` = `'Continue'`

Total: 20 strings (2 planRecall + 4 hero + 12 options + 2 footer fallbacks).

`screens/O8.tsx` imports `getCopy` + `O8Option` from `'../lib/copy/o8'`. The `O8` top-level component calls `getCopy(answers.stage)`; the resolver value is passed down via props to `PlanRecall` / `OptionCard`. The module-scope `OPTIONS` constant + module-scope `OptionDef` type are deleted (moved to the resolver). `PlanRecall` becomes parameterised by props (currently takes no props).

### AC-6 — Copy-resolver-invariant test passes

NEW `tests/unit/proto-pre-signup/copy-resolver-invariant.test.ts` reads each `src/app/dev/proto/pre-signup-interview/screens/O[1-8].tsx` file and asserts zero matches for two pattern families:

**Family 1 — attribute hardcodes:**

- `(eyebrow|heading|helper|title|caption|aria-label|ctaLabel|sub|placeholder)\s*=\s*"[A-Z][^"]+"`
- Same with single-quoted strings: `(eyebrow|heading|helper|title|caption|aria-label|ctaLabel|sub|placeholder)\s*=\s*'[A-Z][^']+'`
- Capital-first-letter constraint excludes structural ID refs (`aria-labelledby="o3-rel-legend"` starts lowercase) and the `id="..."` family.

**Family 2 — JSX text content hardcodes:**

- `>[A-Z][a-zA-Z][a-zA-Z'.,!?: \-]+<` — text content between angle brackets starting with a capital letter that has at least 2 letters (catches `>Download as PDF<`, `>Drawing it together<`, `>Take a<`, etc.).
- `>[a-z]+\s[a-z]+\s[a-z]+[^<]*<` — text content starting lowercase with 3+ words (catches `>back to plan<`, multi-word lowercase content).
- Excludes single-char content (`>·<`, `>—<`) and pure-symbol content; the regex's letter-class requirement filters those.

The test scans each file as text, applies both regex families, and reports any matches as failures with the matched substring + line number for diagnostics.

The test passes once AC-1..AC-5 land. Future PRs that re-introduce a hardcoded user-facing string fail this test, surfacing the regression at CI time rather than at the next audit.

The allowlist is documented in the test file itself for surfaces that have a legitimate hardcoded literal (e.g. SVG inline labels for icons, character escapes inside JSX bodies that are necessarily inline). At slice ship the allowlist is empty.

## Definition of Done

Spec 76 §5 verbatim sets the in-scope items:

> *"Spec 72 §11 specifies 14 checkbox items. For category=prototype, four items remain in scope:*
>
> *1. Item 1 — Data classification per AC. Prototypes declare T0 metadata explicitly; the declaration itself is the audit.*
> *2. Item 8 — Error handling. User-facing surface; generic errors with reference IDs apply even when the data is static. Prototype loveability includes graceful failure.*
> *3. Item 12 — Adversarial review. `/security-review` skill run on slice diff. Cheap; catches regressions in patterns the spec doesn't otherwise enforce.*
> *4. Item 14 — Secrets hygiene. `gitleaks` clean on slice branch. No exception for any category."*

Applied to this slice:

- DoD-1: AC-1..AC-6 met with evidence in `verification.md`. All strings are T0 metadata (user-facing static copy, no personal data).
- DoD-8 (Item 8): N/A — pure-string structural move + one prop re-wire; no error paths touched. O7's `plan.links.primaryCTA` is guaranteed non-empty by `primaryCTAForStage`'s `default` case.
- DoD-12 (Item 12): single-turn review applies. Quoting `docs/workspace-spec/72b-adversarial-review-budget.md` §"Decision criteria" row 1: *"<300 lines | any | Single-turn (status quo) | Fits in one read-cap window; no orchestration overhead."* Slice acceptance.md ≈ 266 lines (under 300L threshold); rationale repeated in §"Adversarial review budget" below for visibility.
- DoD-14 (Item 14): `gitleaks` CI check verifies. No secrets in copy strings.

## Adversarial review budget

Spec 72b §"Decision criteria" row 1 verbatim:

> *"<300 lines | any | Single-turn (status quo) | Fits in one read-cap window; no orchestration overhead."*

Slice acceptance.md ≈ 266 lines, structural moves only (zero new logic, zero new render surface), prototype category. Single-turn applies (<300L threshold).

## Pre-flight notes

- Pure-string slice per CLAUDE.md §"Don't write file-content assertions for logic slices" — file-content / regex assertions are appropriate here (the bail-out category for copy-flips + structural invariants).
- Per-screen render tests on O2 / O3 / O7 / O8 will inherit cascading updates wherever they currently assert literal string values; expected cascade ≈ 5-10 pre-existing assertions per the per-batch cascade pattern observed across earlier copy-only batches. Budget that into the slice.
- AC-3 owns 17 string moves + AC-5 owns 18 string moves in single ACs each. Granularity choice: one AC per logical surface (the new resolver). Per-string verbatim quoting in the AC body keeps each move traceable; `verification.md` records line-by-line evidence at ship time.
- No tone or content edit anywhere. If a moved string reads as register-mismatched after moving, file a new audit-finding slice. This slice is structural only.
