<!--
  This template enforces CLAUDE.md §"Engineering conventions" Definition of Done.
  Delete the guidance comments before submitting.
-->

## Summary

<!-- 1-3 bullets: what changed and *why*. -->

## Slice / scope

- Slice: <!-- S-XX + short name, e.g. "S-F1 design-system tokens" -->
- Or mark docs-only / infra-only:
  - [ ] This PR does **not** touch `src/` (skip the src/ DoD below).
  - [ ] `src/` touch is trivial (placeholder / tooling only) — request `no-slice-required` label from a reviewer.

## Definition of Done (CLAUDE.md §"Engineering conventions")

**Required for any PR that touches `src/`.** Check each item; add evidence link or explain deferral.

- [ ] **AC met with evidence** — link `docs/slices/S-XX/verification.md` showing each acceptance criterion satisfied. *(CI will fail without this reference on src/ PRs.)*
- [ ] **Tests written + passing** — unit + integration + visual as applicable; test-pain audit per spec 72d §3 cleared (>2 mock setups per unit test triggered architectural step-back if surfaced; threshold raises to >5 for `category: prototype` slices per spec 76 §3)
- [ ] **Adversarial review done** — concerns addressed or explicitly deferred with reasoning (paste output or link)
- [ ] **Preview deploy verified in-browser** (UI only) — golden path + edge cases + `prefers-reduced-motion`
- [ ] **No regression in adjacent slices** — smoke check + automated tests across affected surfaces
- [ ] **Slice's open 68f/g entries resolved** or explicitly deferred with reasoning in slice wrap
- [ ] **Registry row updated** — if PR touches `src/app/dev/proto/<surface>/page.tsx`, the corresponding row in `src/app/dev/proto/registry.ts` has `lastTouched.session` bumped and `status` reflects ship state; new surfaces add a row in the same PR.

## Security DoD (spec 72 §11 — 14 items)

**Required for any PR that touches `src/`.** See `docs/workspace-spec/72-engineering-security.md` §11. For `category: prototype` slices (spec 76 §1), short-form applies: items 1, 8, 12, 14 only — remaining items render as `N/A — category: prototype, see spec 76 §5` in the slice's `security.md`.

- [ ] 14-item per-slice security checklist walked — paste the filled checklist or link to the slice's `security.md`. (Prototype slices: short-form per spec 76 §5.)

## Test plan

<!-- Markdown checklist of what you ran / what a reviewer should verify. -->

- [ ] ...

## References

<!-- Kickoff, brief, spec sections, related PRs, decision refs (68f/g entries). -->

---

_Generated on branch `<branch-name>` — remember the 6-step wrap protocol in CLAUDE.md §"Wrapping up a session"._
