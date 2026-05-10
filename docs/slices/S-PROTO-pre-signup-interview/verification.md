# S-PROTO-pre-signup-interview · verification

Final-state evidence record per CLAUDE.md §Engineering conventions §Definition of Done item 1. Filled at slice ship; round-by-round multi-agent audit detail belongs in HANDOFF or PR description, not here.

**Slice ship status:** Awaiting fill-in.

## Acceptance-criteria evidence

| AC | Evidence | Status |
|---|---|---|
| AC-1 · Eight-screen flow renders end-to-end | Preview URL · screenshot grid O1 → O8 · golden-path walkthrough (O7+O8 deferred placeholders render without crash) | Pending |
| AC-2 · 4-state background toggle (3 expressive + 1 standalone) | Screenshots of all 4 gradient options · `?bg={value}` round-trip · WCAG AA contrast check on all 4 | Pending |
| AC-3 · F1 tokens extended with canvas-canon values; CSS↔TS parity preserved | `grep` of new token paths · CSS↔TS parity test result · zero hex literals scattered across components | Pending |
| AC-4 · Visual fidelity to canvas exports | Side-by-side screenshots O2-O6 (impl vs canvas A·B·C combo) · O1 audit note · O7+O8 deferred-banner screenshots | Pending |
| AC-5 · Microcopy compliance + stage-tone resolver scaffold | `reviewer-prototype-readiness` persona pass · grep for negative-constraint terms (zero matches expected) · resolver presence check (see §Stage-tone scaffold) | Pending |
| AC-6 · Mobile-first 375x667 + scaled-up desktop | Preview-deploy mobile viewport screenshots · 768/1280 acceptable rendering · 1.6× browser-chrome scale verification | Pending |
| AC-7 · Preview-deploy 6-dim verification | Section below populated | Pending |

## Preview-deploy verification (spec 72a)

**Sandbox-vs-browser caveat:** the Claude Code sandbox cannot run a browser. Status entries below stay 'Pending' until verified against the Vercel preview URL that auto-generates when the PR opens. Each row's Evidence column lists the exact verification protocol — copy-paste runnable.

| Dimension | Status | Evidence |
|---|---|---|
| Golden path (O1 → O8 happy path) | Pending | Open preview URL · click through O1→O8 making one valid selection per screen · verify Continue advances each screen · cycle BgToggle through all 4 modes (expressive · canvasChrome · o7Surface · standalone) on any screen and confirm the bg changes + URL `?bg=` updates · screenshot the O7 personalised plan with at least 2 trigger conditions met (e.g. children=yes + safety-concern) to confirm wired triggers fire. |
| Edge cases | Pending | (a) On O7, click Back → expect O6 with priorities + worries selections preserved. (b) On O5, refresh page → expect proto state resets to O1 (per acceptance.md L25 "no persistence beyond page-refresh"). (c) On O6, cycle BgToggle mid-flow → expect bg changes without losing chip selections. (d) On O3, pick "I have safety concerns" → expect screen renders without modal/banner; CTA enables on relationship answer alone (canvas C2). |
| `prefers-reduced-motion` | Pending | DevTools → Rendering tab → "Emulate CSS media feature prefers-reduced-motion: reduce" → walk through O1-O6 → expect: (a) BgToggle cycle changes bg with no fade/transition · (b) RadioCard selected-state border change is instant · (c) RadioChips/CheckChips bg+color toggle is instant · (d) any other transition is suppressed. Implementation: page.module.css `@media (prefers-reduced-motion: reduce)` cascades to all descendants of the 4 bg classes via `.scope *` selector. |
| Keyboard-only navigation | Pending | Tab from URL bar → expect focus order: BgToggle (top-right) → Back button (when step > 1) → first interactive in screen body (RadioCard option / RadioChips chip / CheckChips chip) → subsequent options → Continue CTA. Enter on focused radio/chip selects. Enter on Continue advances. Verified on O1 (RadioCard), O2 (multiple RadioChips groups + sub-Q cards), O5 (TallRow rendering), O6 (CheckChips with cap=3). Focus-visible ring honoured (browser default + tokens.color.accent.violet on .toggle per page.module.css). |
| Mobile viewport 375×667 (iPhone SE) | Pending | Chrome DevTools → device mode → iPhone SE preset (375×667) → walk through O1-O8 → expect: (a) no horizontal scroll on any screen · (b) primary CTA reachable in thumb zone (bottom 33% of viewport) · (c) ScreenShell maxWidth: 480 doesn't constrain (375 < 480) · (d) RadioChips wrap onto multiple lines without overflow · (e) O6's two CheckChips grids each stay vertically aligned with caption above. |
| Screen reader (VoiceOver / NVDA) | Pending | Enable VoiceOver (Mac) or NVDA (Win) · navigate O1 → expect: eyebrow read as text → H1 ("Where are you in your separation?") read with heading semantics → 3 RadioCard options read as radio group with helpers → Continue CTA read as button + state. Repeat on O2 to verify SubQuestionCard label is read as text before each RadioChips group, hidden `<legend>` provides accessible name. Verify O3 silent _safetyFlag: choosing "I have safety concerns" does NOT trigger any AT announcement (canvas requirement: silent flag, no modal/banner). |

## Design tokens (from `acceptance.md` §Design tokens)

### Reused from S-F1 (verification: import grep)

```bash
grep -E "tokens\.color\.(ink|text|border|surface\.(panel|page))" src/app/dev/proto/pre-signup-interview/**/*.tsx
```

Expected: imports for ink, text.sub, text.muted, border, surface.panel, surface.page. Zero matches for tokens not in this list.

### F1 extensions added in this slice (verification: token-presence + parity)

```bash
# New F1 token paths consumed in pre-signup screens
grep -E "tokens\.color\.accent\.(violet|magenta)|tokens\.color\.surface\.gradient\.(expressive|canvasChrome|o7Surface|standalone)|tokens\.font\.(serif|mono)" src/app/dev/proto/pre-signup-interview/**/*.tsx

# CSS↔TS parity test
npm run test -- tokens-parity
```

Expected: all 4 gradient tokens consumed in BackgroundShell · accent.violet on eyebrow labels + CTA · accent.magenta on italic display accents · font.serif on H1s · font.mono on label-xs eyebrows. Parity test passes.

### Hex-literal scope check (verification: zero scatter)

```bash
grep -rn "#7C3AED\|#BE185D\|#F3EEFE\|#F5F1F8\|#EFE7F8\|#EFEEE9\|#FAF6F0\|#FCE7F3\|#faf9f5" src/app/dev/proto/pre-signup-interview/
```

Expected: hex literals appear ONLY in `src/styles/tokens.ts` and `src/app/globals.css` (the F1 source-of-truth pair). Zero matches inside `src/app/dev/proto/pre-signup-interview/**`. All component code references token paths.

## Stage-tone resolver scaffold (verification: presence + shape)

```bash
ls src/app/dev/proto/pre-signup-interview/lib/copy/
# Expected: o1.ts o2.ts o3.ts o4.ts o5.ts o6.ts (six files)

# Each file exports getCopy(stage: Stage)
grep -l "export function getCopy" src/app/dev/proto/pre-signup-interview/lib/copy/*.ts
```

Expected: 6 files (one per O1-O6), each exporting `getCopy(stage: Stage)`. Today: each function returns identical strings across all `stage` values (resolver-shape present, differentiation deferred per spec 65 §Principle 6). Future principle-6 work edits the function body, no screen rewrites required.

## Deferred screens — asset preservation evidence

Per `acceptance.md` §Out of scope. Asset paths committed via `c56d377` (canvas reorganisation).

### O7 — Your plan (deferred)
**Reason for deferral:** Canvas-overview L199-235 explicitly silos O7 to its own workbook ("renders on a dedicated workbook to keep this canvas light"). Reconstruction in follow-up slice.

**Asset preservation:**
```bash
ls docs/design-source/pre-signup-interview/jsx/o7-*.jsx
# Expected: o7-page.jsx, o7-components.jsx, o7-plan-page.jsx, o7-plan-components.jsx (4 files, ~117KB)

ls docs/design-source/pre-signup-interview/o7-your-plan-expressive*.html
# Expected: o7-your-plan-expressive.html (195L), o7-your-plan-expressive-source.html (261L)
```

**Verification:** All 6 files present on disk; not modified post-`c56d377`.

### O8 — What's next (deferred)
**Reason for deferral:** Canvas-overview L237-268 explicitly instructs *"treat this slot as TBD — do not lift copy or layout from the existing draft into the build pipeline"*. Reconstruction when canon authors lock framing.

**Asset preservation:**
```bash
ls docs/design-source/pre-signup-interview/jsx/o8-frames.jsx
# Expected: o8-frames.jsx (present, NOT canonical per canvas-overview L358)

ls docs/design-source/pre-signup-interview/o8-whats-next-expressive.html
# Expected: o8-whats-next-expressive.html (552L)
```

**Verification:** Both files present on disk; not modified post-`c56d377`. The `o8-frames.jsx` file is preserved as design-source reference but explicitly NOT lifted into the build per canvas instruction.

## Architectural deferrals

Stage-tone copy differentiation per spec 65 §Principle 6 — resolver scaffold ships this slice (per AC-5); per-stage copy differentiation deferred until canon authors specify the per-stage tone treatment. Resolver-shape lets future work edit one function per screen, no screen rewrites required.

Inline-style consumption of design tokens — pre-signup proto components consume F1 tokens via inline `style={{}}` referencing the TS tokens object directly (`tokens.color.ink`, `tokens.font.sans`). This contradicts F1's stated design intent at `src/styles/tokens.ts` L7-9: *"Components style via CSS classes that reference the custom properties (`var(--ds-color-phase-build)` etc), not via inline `style={{}}` everywhere."* Drift is pre-existing (not introduced by this slice) and out-of-scope for this reconstruction. Deferred to next session for systematic refactor across all proto components — addresses the architectural seam without entangling the canvas-canon reconstruction work.

(Other architectural deferrals populate at slice ship if test-pain audit (spec 72d §3) surfaces a seam that doesn't get extracted.)

## Loveability decisions committed

(O7 canvas's three loveability decisions are deferred with O7 reconstruction. Marked deferred to track resolution when O7 ships.)

| Decision | Choice | Rationale |
|---|---|---|
| A · Personalisation visibility | Deferred | O7 deferred; resolution at O7 reconstruction in follow-up slice |
| B · Section disclosure | Deferred | O7 deferred; resolution at O7 reconstruction in follow-up slice |
| C · Conventional-path framing | Deferred | O7 deferred; resolution at O7 reconstruction in follow-up slice |

## Status footer
- 2026-05-08: skeleton authored at slice setup; full fill-in at slice ship.
- 2026-05-10: re-scoped to match `acceptance.md` re-scope; new F1 token grep paths · §Stage-tone scaffold added · §Deferred screens with O7+O8 asset preservation · loveability decisions marked deferred.
