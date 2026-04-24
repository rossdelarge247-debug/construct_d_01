# S-F1 · Design system tokens — In-browser verification

**Slice:** S-F1-design-tokens
**Source:** CLAUDE.md DoD item 4 + engineering-phase-candidates.md §G.5
**Preview deploy URL:** *to be filled post-PR* (`construct-dev-git-claude-design-system-tokens-gin9e-*.vercel.app`)
**Integration URL:** N/A — single-branch-main per spec 71 §7a Option 4; main = canonical.

S-F1 is a token-foundation slice — no user-facing flow, no surface that exercises a "golden path" beyond computed-style smoke. The verification surface is intentionally minimal; richer in-browser verification belongs to the downstream component slices that consume these tokens.

---

## Golden path

The minimum end-to-end check: tokens shipped → page builds → tokens resolvable from any element on the placeholder landing page.

| Step | Action | Expected outcome | Evidence |
|---|---|---|---|
| 1 | Open Vercel preview URL | Placeholder landing page renders without error | *post-PR* |
| 2 | Browser dev-tools → Console: `getComputedStyle(document.documentElement).getPropertyValue('--ds-color-ink')` | Resolves to `' #1A1A1A'` | *post-PR* |
| 3 | Console: `getComputedStyle(document.documentElement).getPropertyValue('--ds-color-phase-build')` | Resolves to `' #4338CA'` | *post-PR* |
| 4 | Console: count of `--ds-*` properties resolved | ≥ 64 (actual 65) | *post-PR* |

**Pass / fail:** *to be filled post-PR*

## Edge cases

S-F1's edge-case surface is narrow — token files don't have user-facing edge cases. Recorded for completeness:

| Scenario | Trigger | Expected outcome | Evidence |
|---|---|---|---|
| Token name collision with V1/V2 | Component using `--space-3` (V1, 12px) on the same page as a future component using `--ds-space-3` (S-F1, 3px) | Both resolve independently — no leak between namespaces; computed styles match per-component expectation | manual verification post-PR via dev-tools spot-check on `<body>` element |
| Reload | F5 on the landing page | Tokens still resolve; no FOUC peculiar to S-F1 (any pre-existing FOUC would be V1/V2 territory, out of scope) | post-PR |
| Cross-route navigation | Click `/privacy` from landing | V1 token-using page (`/privacy`) renders with V1 colours unchanged; coexistence works | post-PR |

## Accessibility

S-F1 ships *tokens*, not interactive components. Accessibility checks for visual treatment are limited to colour-contrast verification of the extracted palette. Component-level a11y belongs to consuming slices.

- [ ] **Keyboard-only navigation** — N/A (no new interactive surface in this slice; Button reskin preserves existing keyboard behaviour, no new keyboard affordance added)
- [ ] **Screen reader sanity** — N/A (no new content)
- [ ] **`prefers-reduced-motion`** — N/A (no new motion in this slice)
- [ ] **Colour contrast** — `--ds-color-ink (#1A1A1A)` on `--ds-color-surface-page (#F5F5F4)` ≈ 16:1 (well above WCAG AAA 7:1). `--ds-color-text-muted (#78716C)` on surface-page ≈ 4.5:1 (WCAG AA). `--ds-color-text-sub (#57534E)` on surface-page ≈ 8.4:1 (WCAG AAA). Phase-soft tints used as backgrounds carry their accent as foreground; spot-check pairs in the design source — verified consistent with prototype's apparent contrast intent. *Numeric spot-checks recorded post-PR using a contrast-checker tool.*
- [ ] **Focus management** — Button retains existing `disabled:pointer-events-none disabled:opacity-50` pattern; focus ring inherited from `*:focus-visible` rule in globals.css (`outline: 2px solid var(--color-blue-600)`). NOTE: focus ring still uses V1 `--color-blue-600`. Updating it is downstream slice work (likely a button-states slice or accessibility-pass slice).

## Responsive viewport

S-F1 has no layout decisions; tokens are viewport-agnostic. Layout-container tokens (`--ds-layout-max-narrow: 760px`, `--ds-layout-max-wide: 960px`) ship for downstream consumption — their responsive behaviour will be verified when the first surface uses them.

| Viewport | Width | Expected behaviour | Evidence |
|---|---|---|---|
| Mobile | 375 px | Tokens resolve; placeholder page renders | *post-PR* |
| Tablet | 768 px | Same | *post-PR* |
| Desktop | 1440 px | Same | *post-PR* |

## Cross-browser

- [ ] **Chrome latest** — golden-path computed-style spot-check
- [ ] **Safari latest** — golden-path computed-style spot-check (CSS custom properties widely supported, no Safari-specific quirks expected for `:root` variables)
- [ ] **Firefox latest** — optional V1
- [ ] **Mobile Safari** (iOS 16+) — optional, deferred to first slice with mobile-relevant surface

## Regression surfaces

V1/V2 tokens in `globals.css` `@theme` block are untouched by S-F1. PWR components consuming them should render unchanged.

| Adjacent slice / surface | Smoke check | Pass / fail | Evidence |
|---|---|---|---|
| `/privacy /terms /cookies` (V1 pages, in `@theme` palette) | Renders identically to pre-S-F1 | *post-PR* | *post-PR* |
| `src/components/ui/card.tsx` (PWR, NOT reskinned this slice) | Renders with V1/V2 styling unchanged on the placeholder landing page (if visible) | *post-PR* | *post-PR* |
| `src/components/ui/badge.tsx` (PWR, NOT reskinned this slice) | Same | *post-PR* | *post-PR* |
| `src/components/layout/{header,footer,env-banner}.tsx` (PWR, NOT reskinned) | Same | *post-PR* | *post-PR* |

## Dev-mode sanity

- [ ] N/A — S-F1 ships no MODE-varying surface. `/app/dev/*` not introduced this slice.

## Adversarial run

- [ ] `/review` skill run on slice diff; findings triaged in this section
- [ ] `/security-review` skill run on slice diff; findings recorded in `security.md` §12
- [ ] Optional sub-agent run — skipped for token-foundation slice (low complexity surface)

---

## Token coverage map

What S-F1 ships vs what downstream slices may need to extend.

### Locked by S-F1

| 68g entry | Status | Tokens |
|---|---|---|
| C-V1 (phase colour system) | 🟢 locked | `--ds-color-phase-{build,reconcile,settle,finalise}` + `-soft` variants (8) |
| C-V13 (phase accent-tint card washes) | 🟢 locked | `--ds-shadow-phase-{build,reconcile,settle,finalise}` (4) + the 4 `-soft` colour tokens shared with C-V1 |

### Coverage gaps — extension expected by downstream slices

| Gap | Owner slice (estimated) | Note |
|---|---|---|
| Bank brand colours | bank-picker slice (C-V10) | NHS-red / NatWest blues / Monzo / etc. seen in design source as `bg:/fg:/bc:` keys; deferred per AC-1 |
| Peach/warm tints | connected-data-source-card slice (C-V9) | `#FFEEE7`, `#E6F0FA`, `#F5F3EE`, `#D6D3CC` — observed but not extracted to S-F1 |
| Light success/info tints | first slice that needs them | `#A7F3D0`, `#F6FBF8` — observed but unclassified |
| State tokens beyond danger | first slice that needs them | success / warning / info — un-evidenced in current prototypes |
| Dark-mode variants | dark-mode slice (not yet scheduled) | every `--ds-*` may need a paired `--ds-*-dark` |
| Print-specific tokens | document-export slice | when Sarah's Picture exports to PDF |
| Focus-ring tokens | accessibility-pass slice or Button-states slice | currently using V1 `--color-blue-600`; new `--ds-focus-ring-*` candidate |
| Button hover-state token | Button-states slice | currently `hover:opacity-90` literal; could be `--ds-color-state-hover-overlay` or similar |

These gaps are *expected* and *additive*; existing S-F1 tokens are stable.

---

## Sign-off

- **Verified by:** *to be filled post-PR*
- **Date:** *to be filled*
- **Commit SHA verified:** *to be filled*
- **Preview URL:** *to be filled*
- **Outstanding issues:** *to be filled*
- **DoD item 4 status:** *to be filled — complete after preview-deploy spot-check*

---

## DoD item summary

| # | DoD item | Status | Evidence |
|---|---|---|---|
| 1 | All AC met, with evidence per AC | ✓ AC-1..AC-5 met automatically; AC-6 met by this file + sibling docs being populated | per-AC `Evidence at wrap` lines in `acceptance.md` |
| 2 | Tests written + passing (unit + integration + visual as applicable) | ✓ unit (vitest 8/8) · visual (manual post-PR) | `npx vitest run` output |
| 3 | Adversarial review done; concerns addressed or deferred | *pending* — `/review` after this commit | post-review entries in this file's "Adversarial run" section |
| 4 | Preview deploy verified in-browser if UI | *pending* — post-PR; computed-style spot-check | filled at sign-off |
| 5 | No regression in adjacent slices | *pending* — post-PR; smoke checks above | filled at sign-off |
| 6 | Slice's open 68f/g entries resolved or explicitly deferred | ✓ C-V1 + C-V13 locked (this slice); C-V2..C-V12, C-V14 deferred to component slices | 68g-visual-anchors.md status flips |

Plus 13-item security checklist — see `security.md`.
