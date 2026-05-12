# S-PROTO-density-entry-O1 — verification

## Slice status

Implemented; awaiting preview-deploy 6+1 walk evidence to close DoD-12.

Net diff: 1 new primitive (`EntryScaffold.tsx` + module CSS), 1 wiring change in `screens/O1.tsx`, 1 copy-resolver extension in `lib/copy/o1.ts`, 1 new unit test file. No regression in 534/534 vitest suite (+8 new EntryScaffold tests); typecheck clean; lint adds zero warnings (48 pre-existing warnings in `src/lib/**` + other test files unchanged).

Closes density-audit findings F-DEN-02, F-DEN-03, F-DEN-04 from `docs/slices/S-PROTO-pre-signup-density-delight-audit/acceptance.md`.

## Per-AC evidence

| AC | Status | Evidence |
|---|---|---|
| AC-1 EntryScaffold primitive shape | ✓ | `src/app/dev/proto/pre-signup-interview/components/EntryScaffold.tsx` + `.module.css` shipped. Props match `acceptance.md` AC-1: `timeIntro`, `outcomes`, `reassurance`, optional `className`, `staggerIndex`. Uses `tokens.font.*` and `var(--ds-color-*)` exclusively (no hardcoded colours). Tested in `tests/unit/proto-pre-signup/entry-scaffold.test.tsx` (8 tests; all green). |
| AC-2 O1 wiring + copy resolver | ✓ | `O1.tsx` L7 imports EntryScaffold; L110-115 renders it between `<TopBar>` and `<Hero>`. `lib/copy/o1.ts` L15-19 adds `O1EntryCopy` interface; L23 adds `entry` field to `O1Copy`; L34-42 returns the entry copy from `getCopy()`. Entry copy is stage-independent (returned identically across all three Stage variants — appropriate since the framing doesn't change per user-state). |
| AC-3 F-DEN-02 outcome scaffolding | ✓ | Three V1-verbatim bullets render: "See the likely process for your specific situation", "Shape a starting plan for children, housing, and finances", "Know exactly what to focus on next" (`lib/copy/o1.ts` L37-40). Each prefixed by ✓ glyph (`EntryScaffold.tsx` L57-67; aria-hidden span). Inverted negative-grep audit check: `grep -niE "you'll\|in the next" src/app/dev/proto/pre-signup-interview/.../o1.ts` returns 1 match (was zero pre-impl). Test `renders each outcome as a list item inside a single <ul>` asserts 3 items in DOM order. |
| AC-4 F-DEN-03 time-commitment | ✓ | "In the next ~3 minutes, you'll:" surfaces in EntryScaffold timeIntro (`lib/copy/o1.ts` L35). Matches spec 65 L21 "~3 minutes, 8 screens max"; does NOT use V1's "20-30 minutes" (different scope — V1 framed full Construct journey; pre-signup is the 8-screen interview only). Inverted grep: `grep -niE "minute\|3 min" .../o1.ts` returns 1 match (was zero pre-impl). |
| AC-5 F-DEN-04 reassurance | ✓ | V1-verbatim line renders: "You don't need to know everything. You just need to start." (`lib/copy/o1.ts` L41). Typography: italic-serif 13px/1.5 (`EntryScaffold.tsx` L73-78), matching `Hero` `helperVariant="italic-serif"` pattern for chassis coherence. Inverted grep: `grep -niE "don't need\|just need" .../o1.ts` returns 1 match (was zero pre-impl). Test `renders reassurance as an italic-serif paragraph` asserts `fontStyle === 'italic'`. |
| AC-6 Preview-deploy 6+1 walk | pending | Awaiting Vercel preview URL for slice PR; walk targets `/dev/proto/pre-signup-interview` (O1 entry + O2-O8 smoke). Table below populates after walk. |

## Preview-deploy verification (spec 72a 6+1)

| Dimension | Status | Evidence |
|---|---|---|
| Golden path | pending | O1 entry renders with EntryScaffold above Hero; user can read framing, select a stage option, hit Continue, navigate to O2. |
| Edge cases | pending | First load · already-selected-stage round-trip (back from O2 preserves selection + EntryScaffold) · narrow viewport `--stagger-index` animation order. |
| `prefers-reduced-motion` | pending | EntryScaffold uses `O1.module.css .entry` className → existing `@media (prefers-reduced-motion: reduce)` block disables the entry animation. Inherits chassis fallback. |
| Keyboard-only | pending | EntryScaffold has no interactive elements; no new focusable nodes — Hero radio cards still receive focus first. |
| 375×667 mobile | pending | Verify EntryScaffold + Hero + 3 RadioCards + Footer all visible within viewport at iPhone SE width with no horizontal overflow. |
| Screen reader | pending | EntryScaffold is a plain `<div>` (no landmark) carrying `<p>` + `<ul>`/`<li>` + `<p>` semantics. Checkmark spans are `aria-hidden="true"` (decorative). VoiceOver / TalkBack should read: time intro → 3 list items → reassurance, before reaching the Hero heading. |
| +1 visual diff | N/A | Per spec 72a §"Out of scope" — no visual-regression baseline tooling shipped. |

## Security checklist (prototype short-form per spec 72 §11)

- [x] Item 1: No secrets, credentials, or sensitive defaults committed (copy strings + design tokens only).
- [x] Item 8: No new third-party dependencies introduced.
- [x] Item 12: No new external surfaces (network requests, file I/O, auth boundaries).
- [x] Item 14: No PII handling changes; copy is generic + non-targeted.

## Architectural deferrals

- **EntryScaffold reuse on other screens (O2-O8).** The primitive lives under `components/` and is intentionally generic (props accept any timeIntro / outcomes / reassurance). Out-of-scope this slice per `acceptance.md` §"Out of scope" — the audit's F-DEN-02..04 findings are O1-entry-specific. Future audit lenses (e.g. tone audit Phase 1) may surface reasons to re-use; deferred.
- **No per-bullet stagger animation.** Outcomes appear simultaneously as the EntryScaffold block staggers in; per-bullet stagger would compete with the existing chassis 80ms rhythm (Hero @ stagger-0, RadioCards @ stagger-1/2/3). Could add `staggerIndex` per outcome in a future iteration if needed.

## Definition of Done (prototype short-form)

- [x] Item 1: acceptance.md + verification.md present and accurate
- [x] Item 8: tests written + passing (8 unit tests in `entry-scaffold.test.tsx`; 534/534 suite green; typecheck clean)
- [ ] Item 12: preview-deploy 6+1 walk evidenced in this file (pending — table above populates after PR preview deploys)
- [ ] Item 14: user feedback received + addressed (pending — captured in PR thread or session wrap)
